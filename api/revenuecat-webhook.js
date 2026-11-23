/* Achats intégrés de l'app iOS (App Store, via RevenueCat) → Pro.
 *
 * Même contrat que le webhook Stripe : on écrit `isPro` sur users/{uid}, et le
 * site comme l'app le lisent en direct. L'app identifie l'acheteur RevenueCat
 * par l'uid Firebase (Purchases.configure({ appUserID: uid })), donc
 * `app_user_id` EST l'uid : pas de correspondance par e-mail à faire.
 *
 * Sécurité : on ne fait PAS confiance au contenu de l'événement. Il sert
 * seulement de « réveil » : on redemande à RevenueCat l'état réel du droit
 * `pro` de cet uid, puis on écrit cet état. Un appel forgé ne peut donc
 * qu'appliquer la vérité, jamais accorder un Pro. Pas de secret partagé à
 * maintenir. (Si REVENUECAT_WEBHOOK_SECRET est posé ET correspond, tant mieux,
 * mais ce n'est plus requis.)
 *
 * On ne retire jamais un Pro accordé par Stripe : la fin d'un abonnement Apple
 * ne coupe que si le Pro venait d'Apple (proType = 'apple_subscription').
 */
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
}

/* Clé PUBLIQUE du SDK iOS (la même que dans l'app) : lecture de l'état d'un client. */
const RC_PUBLIC_KEY = 'appl_dPgGFEZnBWEGsllhhZFcPyuaCDL';
const ENTITLEMENT = 'pro';

async function proFromRevenueCat(uid) {
  const r = await fetch('https://api.revenuecat.com/v1/subscribers/' + encodeURIComponent(uid), {
    headers: { Authorization: 'Bearer ' + RC_PUBLIC_KEY, 'X-Platform': 'ios' },
  });
  if (!r.ok) throw new Error('RevenueCat ' + r.status);
  const sub = ((await r.json()).subscriber) || {};
  const ent = (sub.entitlements || {})[ENTITLEMENT];
  if (!ent) return { active: false };
  const exp = ent.expires_date ? Date.parse(ent.expires_date) : null;
  return {
    active: exp === null || exp > Date.now(),
    since: ent.purchase_date || null,
    expires: ent.expires_date || null,
    product: ent.product_identifier || null,
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const ev = (req.body && req.body.event) || {};
  const uid = ev.app_user_id;
  // Acheteur anonyme (pas encore connecté dans l'app) : rien à rattacher.
  if (!uid || typeof uid !== 'string' || uid.indexOf('$RCAnonymousID') === 0) {
    return res.status(200).json({ ignored: 'anonyme' });
  }

  try {
    // Uniquement des comptes qui existent déjà : un appel forgé ne crée rien.
    const ref = admin.firestore().collection('users').doc(uid);
    const snap = await ref.get();
    if (!snap.exists) return res.status(200).json({ ignored: 'compte inconnu' });
    const d = snap.data() || {};

    const pro = await proFromRevenueCat(uid);
    if (pro.active) {
      await ref.set({
        isPro: true,
        proType: d.isPro && d.proType && d.proType !== 'apple_subscription' ? d.proType : 'apple_subscription',
        proSince: d.proSince || pro.since || new Date().toISOString(),
        proExpires: pro.expires,
        proProduct: pro.product,
      }, { merge: true });
      console.log('RC grant', ev.type, uid, pro.product);
    } else if (d.isPro && d.proType === 'apple_subscription') {
      await ref.set({ isPro: false, proExpires: pro.expires || new Date().toISOString() }, { merge: true });
      console.log('RC revoke', ev.type, uid);
    }
    return res.status(200).json({ ok: true, pro: pro.active });
  } catch (e) {
    console.error('RC webhook', e.message);
    return res.status(500).json({ error: 'sync' });
  }
};

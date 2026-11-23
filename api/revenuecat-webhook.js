/* Achats intégrés de l'app iOS (App Store, via RevenueCat) → Pro.
 *
 * Même contrat que le webhook Stripe : on écrit `isPro` sur users/{uid}, et le
 * site comme l'app le lisent en direct. L'app identifie l'acheteur RevenueCat
 * par l'uid Firebase (Purchases.configure({ appUserID: uid })), donc
 * `app_user_id` EST l'uid : pas de correspondance par e-mail à faire.
 *
 * Sécurité : RevenueCat envoie l'en-tête Authorization fixé dans son tableau de
 * bord ; il doit valoir la variable Vercel REVENUECAT_WEBHOOK_SECRET.
 *
 * On ne retire jamais un Pro accordé par Stripe : la fin d'un abonnement Apple
 * ne coupe que si le Pro venait d'Apple (proType = 'apple_subscription').
 */
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
}

const GRANT = ['INITIAL_PURCHASE', 'RENEWAL', 'UNCANCELLATION', 'PRODUCT_CHANGE', 'NON_RENEWING_PURCHASE', 'SUBSCRIPTION_EXTENDED', 'TEMPORARY_ENTITLEMENT_GRANT'];
const REVOKE = ['EXPIRATION'];

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (!secret || req.headers.authorization !== secret) return res.status(401).end();

  const ev = (req.body && req.body.event) || {};
  const uid = ev.app_user_id;
  // Acheteur anonyme (pas encore connecté dans l'app) : rien à rattacher.
  if (!uid || uid.indexOf('$RCAnonymousID') === 0) return res.status(200).json({ ignored: 'anonyme' });

  const ref = admin.firestore().collection('users').doc(uid);
  try {
    if (GRANT.includes(ev.type)) {
      await ref.set({
        isPro: true,
        proType: 'apple_subscription',
        proSince: new Date(ev.purchased_at_ms || Date.now()).toISOString(),
        proExpires: ev.expiration_at_ms ? new Date(ev.expiration_at_ms).toISOString() : null,
        proProduct: ev.product_id || null,
      }, { merge: true });
      console.log('RC grant', ev.type, uid, ev.product_id);
    } else if (REVOKE.includes(ev.type)) {
      const snap = await ref.get();
      const d = snap.exists ? snap.data() : {};
      if (d.proType === 'apple_subscription') {
        await ref.set({ isPro: false, proExpires: new Date(ev.expiration_at_ms || Date.now()).toISOString() }, { merge: true });
        console.log('RC revoke', uid);
      }
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('RC webhook', e.message);
    return res.status(500).json({ error: 'firestore' });
  }
};

/* Suppression définitive du compte (exigée par Apple, règle 5.1.1(v), et droit
 * à l'effacement RGPD).
 *
 * Le compte supprimé est celui prouvé par le jeton Firebase, jamais une adresse
 * envoyée dans le corps. Dans l'ordre :
 *   1. abonnement Stripe actif → résilié immédiatement (sinon il serait encore
 *      prélevé alors que le compte n'existe plus) ;
 *   2. document Firestore users/{uid} (progression, Pro, rappel) ;
 *   3. compte Firebase Auth.
 * Un abonnement App Store ne peut pas être résilié par le serveur : l'app
 * prévient l'utilisateur de le faire dans les Réglages de l'iPhone.
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const header = req.headers.authorization || '';
  const idToken = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!idToken) return res.status(401).json({ error: 'Authentification requise' });

  let decoded;
  try {
    // checkRevoked : un jeton volé puis révoqué ne peut pas effacer le compte.
    decoded = await admin.auth().verifyIdToken(idToken, true);
  } catch (e) {
    return res.status(401).json({ error: 'Session expirée, reconnecte-toi puis réessaie' });
  }
  const uid = decoded.uid;
  const email = decoded.email;

  try {
    let stripeCancelled = 0;
    if (email && process.env.STRIPE_SECRET_KEY) {
      const customers = await stripe.customers.list({ email, limit: 5 });
      for (const c of customers.data) {
        const subs = await stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 10 });
        for (const s of subs.data) {
          if (['active', 'trialing', 'past_due', 'unpaid', 'incomplete'].includes(s.status)) {
            await stripe.subscriptions.cancel(s.id);
            stripeCancelled++;
          }
        }
      }
    }

    const ref = admin.firestore().collection('users').doc(uid);
    const snap = await ref.get();
    const appleSub = snap.exists && snap.data().proType === 'apple_subscription' && snap.data().isPro === true;
    await ref.delete();
    await admin.auth().deleteUser(uid);

    console.log('Account deleted', uid, 'stripe cancelled:', stripeCancelled);
    return res.json({ success: true, stripeCancelled, appleSub });
  } catch (err) {
    console.error('Delete account error:', err.message);
    return res.status(500).json({ error: 'La suppression a échoué, réessaie ou écris à contact@heritage-musulman.com' });
  }
};

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

/* L'ancienne version résiliait sur simple envoi d'une adresse e-mail, sans
   aucune preuve d'identité : n'importe qui connaissant l'adresse d'un abonné
   pouvait annuler son abonnement. On exige désormais un jeton Firebase signé,
   et on résilie l'abonnement de l'adresse CONTENUE DANS LE JETON — jamais celle
   envoyée dans le corps de la requête. */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const header = req.headers.authorization || '';
    const idToken = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!idToken) return res.status(401).json({ error: 'Authentification requise' });

    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(idToken);
    } catch (e) {
      return res.status(401).json({ error: 'Session expirée, reconnecte-toi' });
    }

    const email = decoded.email;
    if (!email) return res.status(400).json({ error: 'Compte sans adresse e-mail' });

    // Find customer by email
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (!customers.data.length) return res.status(404).json({ error: 'Aucun abonnement trouvé' });

    const customerId = customers.data[0].id;

    // Find active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    if (!subscriptions.data.length) return res.status(404).json({ error: 'Aucun abonnement actif' });

    // Cancel at period end (user keeps access until end of billing period)
    const subscription = await stripe.subscriptions.update(subscriptions.data[0].id, {
      cancel_at_period_end: true,
    });

    const endDate = new Date(subscription.current_period_end * 1000).toLocaleDateString('fr-FR');
    res.json({ success: true, endDate });
  } catch (err) {
    console.error('Cancel error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

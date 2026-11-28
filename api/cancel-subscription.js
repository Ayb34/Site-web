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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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

    /* Chaque paiement crée un client Stripe : une adresse peut en avoir
       plusieurs. On cherche l'abonnement vivant sur tous, essai gratuit
       compris (statut `trialing` — l'ancien filtre `active` ne le voyait pas,
       et la résiliation pendant l'essai aurait échoué). */
    const customers = await stripe.customers.list({ email, limit: 20 });
    if (!customers.data.length) return res.status(404).json({ error: 'Aucun abonnement trouvé' });

    let vivant = null;
    for (const c of customers.data) {
      const subs = await stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 10 });
      vivant = subs.data.find(function (s) { return ['trialing', 'active', 'past_due'].indexOf(s.status) !== -1; });
      if (vivant) break;
    }

    if (!vivant) return res.status(404).json({ error: 'Aucun abonnement actif' });

    // Cancel at period end (user keeps access until end of billing period).
    // En essai, la fin de période = la fin de l'essai : rien n'est prélevé.
    const subscription = await stripe.subscriptions.update(vivant.id, {
      cancel_at_period_end: true,
    });

    const fin = subscription.status === 'trialing' && subscription.trial_end ? subscription.trial_end : subscription.current_period_end;
    const endDate = new Date(fin * 1000).toLocaleDateString('fr-FR');
    res.json({ success: true, endDate, trial: subscription.status === 'trialing' });
  } catch (err) {
    console.error('Cancel error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

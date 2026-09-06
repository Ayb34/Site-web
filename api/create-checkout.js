const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// Tarifs Stripe (produit « Héritage Musulman — Abonnement Pro »)
const PRICE_MONTHLY = 'price_1UCeGNCI24S0XRebJ13Trh7M'; //  4,99 € / mois
const PRICE_ANNUAL  = 'price_1TyxGoCI24S0XRebIfNLuJFo'; // 29,99 € / an

// Équivalents PayPal (paiement unique, pas d'abonnement)
const PAYPAL_PLANS = {
  monthly: { amount: 499,  days: 30,  label: 'Héritage Musulman Pro — 1 mois' },
  annual:  { amount: 2999, days: 365, label: 'Héritage Musulman Pro — 1 an' },
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const origin = req.headers.origin || 'https://heritage-musulman.com';
    const method = (req.body && req.body.method) || 'card';
    // L'annuel est le plan mis en avant : c'est aussi le défaut côté serveur.
    const plan = (req.body && req.body.plan) === 'monthly' ? 'monthly' : 'annual';

    // Email du compte connecté. Le webhook accorde `isPro` à l'adresse présente
    // sur la session Stripe : en la pré-remplissant ici, le paiement se rattache
    // au compte qui l'a lancé. Sans ça, une adresse différente saisie dans le
    // formulaire créait un second compte Pro et laissait l'acheteur sans accès.
    const rawEmail = req.body && req.body.email;
    const email = typeof rawEmail === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rawEmail)
      ? rawEmail
      : null;

    let session;

    if (method === 'paypal') {
      // PayPal : paiement unique, l'accès Pro expire après `days` (voir webhook)
      const p = PAYPAL_PLANS[plan];
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['paypal'],
        line_items: [{
          price_data: {
            currency: 'eur',
            unit_amount: p.amount,
            product_data: {
              name: p.label,
              description: 'Accès complet pendant ' + p.days + ' jours · renouvelable',
            },
          },
          quantity: 1,
        }],
        metadata: { payment_method: 'paypal', duration_days: String(p.days), plan: plan },
        ui_mode: 'embedded',
        return_url: `${origin}/?psid={CHECKOUT_SESSION_ID}#payment-success`,
        locale: 'fr',
        ...(email ? { customer_email: email } : {}),
      });
    } else {
      // Abonnement carte + Apple Pay / Google Pay — méthodes gérées via Dashboard Stripe
      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: plan === 'monthly' ? PRICE_MONTHLY : PRICE_ANNUAL, quantity: 1 }],
        payment_method_types: ['card'],
        ui_mode: 'embedded',
        return_url: `${origin}/?psid={CHECKOUT_SESSION_ID}#payment-success`,
        locale: 'fr',
        metadata: { plan: plan },
        ...(email ? { customer_email: email } : {}),
      });
    }

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

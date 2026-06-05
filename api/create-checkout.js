const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

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

    let session;

    if (method === 'paypal') {
      // Paiement unique PayPal — 7,99€ / 30 jours
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['paypal'],
        line_items: [{
          price_data: {
            currency: 'eur',
            unit_amount: 799,
            product_data: {
              name: 'Héritage Musulman Pro — 1 mois',
              description: 'Accès complet pendant 30 jours · renouvelable',
            },
          },
          quantity: 1,
        }],
        metadata: { payment_method: 'paypal', duration_days: '30' },
        ui_mode: 'embedded',
        return_url: `${origin}/#payment-success`,
        locale: 'fr',
      });
    } else {
      // Abonnement carte + Apple Pay / Google Pay automatiques
      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: 'price_1TXkOqCI24S0XReb1I9KiKuv', quantity: 1 }],
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never', // exclut Link (redirect), garde Apple Pay + carte
        },
        ui_mode: 'embedded',
        return_url: `${origin}/#payment-success`,
        locale: 'fr',
      });
    }

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

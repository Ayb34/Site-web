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
    // Offre fondateur : 1er mois -50%
    const founder = !!(req.body && req.body.founder);
    const FOUNDER_COUPON = process.env.STRIPE_FOUNDER_COUPON; // coupon Stripe (50% off, duration: once)

    let session;

    if (method === 'paypal') {
      // Paiement unique PayPal — 7,99€ / 30 jours (3,99€ pour les fondateurs, 1er mois)
      const amount = (founder ? 399 : 799);
      session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['paypal'],
        line_items: [{
          price_data: {
            currency: 'eur',
            unit_amount: amount,
            product_data: {
              name: founder ? 'Héritage Musulman Pro — 1er mois Fondateur (-50%)' : 'Héritage Musulman Pro — 1 mois',
              description: 'Accès complet pendant 30 jours · renouvelable',
            },
          },
          quantity: 1,
        }],
        metadata: { payment_method: 'paypal', duration_days: '30', founder: founder ? '1' : '0' },
        ui_mode: 'embedded',
        return_url: `${origin}/?psid={CHECKOUT_SESSION_ID}#payment-success`,
        locale: 'fr',
      });
    } else {
      // Abonnement carte + Apple Pay / Google Pay — méthodes gérées via Dashboard Stripe
      const sub = {
        mode: 'subscription',
        line_items: [{ price: 'price_1TXkOqCI24S0XReb1I9KiKuv', quantity: 1 }],
        payment_method_types: ['card'],
        ui_mode: 'embedded',
        return_url: `${origin}/?psid={CHECKOUT_SESSION_ID}#payment-success`,
        locale: 'fr',
        metadata: { founder: founder ? '1' : '0' },
      };
      // Fondateur : applique le coupon -50% sur la 1ère facture (duration: once)
      if (founder && FOUNDER_COUPON) {
        sub.discounts = [{ coupon: FOUNDER_COUPON }];
      }
      session = await stripe.checkout.sessions.create(sub);
    }

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

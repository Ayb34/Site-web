const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const sid = req.query.sid;
  if (!sid) return res.status(400).json({ error: 'Missing sid' });

  try {
    const session = await stripe.checkout.sessions.retrieve(sid);
    const email =
      (session.customer_details && session.customer_details.email) ||
      session.customer_email ||
      '';
    // Montant réel renvoyé pour que l'événement Purchase du pixel porte la
    // vraie valeur (Stripe compte en centimes) : sans ça, pas de ROAS fiable
    // et l'algorithme publicitaire optimise à l'aveugle.
    res.json({
      email,
      amount: typeof session.amount_total === 'number' ? session.amount_total / 100 : null,
      currency: (session.currency || 'eur').toUpperCase(),
    });
  } catch (err) {
    console.error('session-email error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

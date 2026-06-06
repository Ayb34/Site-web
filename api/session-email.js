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
    res.json({ email });
  } catch (err) {
    console.error('session-email error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');

// Initialize Firebase Admin once
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send('Webhook Error: ' + err.message);
  }

  const db = admin.firestore();

  try {
    // Paiement confirmé → activer Pro
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const email =
        (session.customer_details && session.customer_details.email) ||
        session.customer_email;
      if (email) {
        const userRecord = await admin.auth().getUserByEmail(email);
        await db
          .collection('users')
          .doc(userRecord.uid)
          .set({ isPro: true, proSince: new Date().toISOString() }, { merge: true });
        console.log('isPro activated for:', email);
      }
    }

    // Abonnement annulé → désactiver Pro
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const customer = await stripe.customers.retrieve(subscription.customer);
      const email = customer.email;
      if (email) {
        const userRecord = await admin.auth().getUserByEmail(email);
        await db
          .collection('users')
          .doc(userRecord.uid)
          .set({ isPro: false }, { merge: true });
        console.log('isPro deactivated for:', email);
      }
    }
  } catch (err) {
    console.error('Firebase error:', err.message);
  }

  res.json({ received: true });
}

// Disable body parser — must be set on the function, not overwritten
handler.config = { api: { bodyParser: false } };

module.exports = handler;

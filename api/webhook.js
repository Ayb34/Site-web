const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');
const { emailRelancePaiement, envoyer } = require('./_emails');

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
        let userRecord;
        try {
          userRecord = await admin.auth().getUserByEmail(email);
        } catch (e) {
          // Compte inexistant → Option A : créer automatiquement après paiement
          userRecord = await admin.auth().createUser({
            email: email,
            emailVerified: false,
          });
          console.log('New Firebase user created after payment:', email);
        }
        const data = {
          isPro: true,
          proSince: new Date().toISOString(),
        };
        // PayPal one-time : expiry selon la durée du plan acheté (30 j ou 365 j)
        if (session.metadata && session.metadata.payment_method === 'paypal') {
          const days = parseInt((session.metadata && session.metadata.duration_days) || '30', 10) || 30;
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + days);
          data.proExpiry = expiry.toISOString();
          data.proType = 'paypal_onetime';
          data.proPlan = session.metadata.plan || 'monthly';
        } else {
          data.proType = 'stripe_subscription';
          data.proPlan = (session.metadata && session.metadata.plan) || 'annual';
          /* Essai gratuit de 7 jours (depuis le 28/11/2026) : Pro tout de
             suite, carte enregistrée, premier prélèvement à la fin de l'essai.
             On garde l'abonnement et la date de fin pour l'e-mail de rappel
             (api/trial-emails.js) et pour le profil. */
          data.proTrial = false;
          if (session.subscription) {
            data.proSubId = String(session.subscription);
            try {
              const sub = await stripe.subscriptions.retrieve(String(session.subscription));
              if (sub.status === 'trialing' && sub.trial_end) {
                data.proTrial = true;
                data.proTrialEnd = new Date(sub.trial_end * 1000).toISOString();
              }
            } catch (e) { console.error('Lecture abonnement:', e.message); }
          }
        }
        await db
          .collection('users')
          .doc(userRecord.uid)
          .set(data, { merge: true });
        console.log('isPro activated for:', email, '| type:', data.proType);
      }
    }

    /* Page de paiement ouverte puis abandonnée → un e-mail de relance.
       Conditions : un compte existe pour cette adresse, il n'est pas Pro (il a
       pu payer entre-temps sur une autre page), et aucune relance depuis
       30 jours. Le drapeau est posé AVANT l'envoi : Stripe rejoue un événement
       qui a échoué, et un doublon coûterait plus cher qu'une relance manquée. */
    if (event.type === 'checkout.session.expired') {
      const session = event.data.object;
      const email = session.customer_email ||
        (session.customer_details && session.customer_details.email);
      if (email) {
        let userRecord = null;
        try { userRecord = await admin.auth().getUserByEmail(email); } catch (e) {}
        if (userRecord) {
          const ref = db.collection('users').doc(userRecord.uid);
          const doc = await ref.get();
          const d = doc.exists ? doc.data() : {};
          const derniere = d.mails && d.mails.relancePaiement;
          const recente = derniere && Date.now() - derniere < 30 * 86400000;
          if (!d.isPro && !recente) {
            await ref.set({ mails: { relancePaiement: Date.now() } }, { merge: true });
            let prenom = (userRecord.displayName || '').trim().split(/\s+/)[0] || '';
            if (!/^[\p{L}][\p{L}'-]{1,19}$/u.test(prenom)) prenom = '';
            const plan = session.metadata && session.metadata.plan === 'monthly' ? 'monthly' : 'annual';
            await envoyer(email, prenom, emailRelancePaiement(prenom, plan));
            console.log('Relance paiement envoyée :', userRecord.uid, plan);
          }
        }
      }
    }

    /* Abonnement modifié : fin d'essai payée (on retire le drapeau d'essai) ou
       prélèvement définitivement refusé (`unpaid`, `incomplete_expired`) → Pro
       retiré. `past_due` garde l'accès le temps des nouvelles tentatives de
       Stripe. Ne touche qu'un Pro Stripe : un abonnement Apple reste intact. */
    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object;
      const avant = (event.data.previous_attributes || {}).status;
      const customer = await stripe.customers.retrieve(sub.customer);
      let userRecord = null;
      if (customer.email) { try { userRecord = await admin.auth().getUserByEmail(customer.email); } catch (e) {} }
      if (userRecord) {
        const ref = db.collection('users').doc(userRecord.uid);
        const d = (await ref.get()).data() || {};
        if (d.proType === 'stripe_subscription') {
          if (sub.status === 'active' && avant === 'trialing') {
            await ref.set({ proTrial: false, proTrialConverted: new Date().toISOString() }, { merge: true });
            console.log('Essai converti :', userRecord.uid);
          } else if (['unpaid', 'incomplete_expired', 'canceled'].indexOf(sub.status) !== -1) {
            await ref.set({ isPro: false, proTrial: false }, { merge: true });
            console.log('isPro retiré (statut ' + sub.status + ') :', userRecord.uid);
          }
        }
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
          .set({ isPro: false, proTrial: false }, { merge: true });
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

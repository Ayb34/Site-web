const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

// Tarifs Stripe (produit « Héritage Musulman — Abonnement Pro »)
const PRICE_MONTHLY = 'price_1Uew75CI24S0XRebghkQjoIG'; //  7,90 € / mois depuis le 23/11/2026 (ancien 4,99 € : price_1UCeGNCI24S0XRebJ13Trh7M, abonnés existants non migrés)
const PRICE_ANNUAL  = 'price_1TyxGoCI24S0XRebIfNLuJFo'; // 29,99 € / an

// Équivalents PayPal (paiement unique, pas d'abonnement)
const PAYPAL_PLANS = {
  monthly: { amount: 790,  days: 30,  label: 'Héritage Musulman Pro — 1 mois' },
  annual:  { amount: 2999, days: 365, label: 'Héritage Musulman Pro — 1 an' },
};

const TRIAL_DAYS = 7;

/* Essai offert seulement à une adresse connue (compte connecté) qui n'a encore
   jamais eu d'abonnement Stripe, quel qu'en soit l'état. Chaque paiement crée
   un client Stripe : une même adresse peut en avoir plusieurs, on les voit
   tous. En cas de doute (erreur Stripe), pas d'essai : on ne promet rien
   qu'on ne puisse tenir. */
async function essaiPossible(email) {
  if (!email) return false;
  try {
    const clients = await stripe.customers.list({ email, limit: 20 });
    for (const c of clients.data) {
      const subs = await stripe.subscriptions.list({ customer: c.id, status: 'all', limit: 1 });
      if (subs.data.length) return false;
    }
    return true;
  } catch (e) {
    console.error('essaiPossible:', e.message);
    return false;
  }
}

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

    /* Une page de paiement non validée expire au bout de 2 h (Stripe : 24 h
       par défaut, minimum 30 min). L'expiration déclenche le webhook
       `checkout.session.expired`, qui envoie l'e-mail de relance : 2 h, c'est
       le soir même, quand l'envie est encore là — pas le lendemain. */
    const expiresAt = Math.floor(Date.now() / 1000) + 2 * 3600;

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
        expires_at: expiresAt,
        ui_mode: 'embedded',
        return_url: `${origin}/?psid={CHECKOUT_SESSION_ID}#payment-success`,
        locale: 'fr',
        ...(email ? { customer_email: email } : {}),
      });
    } else {
      /* Essai gratuit de 7 jours sur l'annuel par carte (28/11/2026, choix
         d'Ayoub). La carte est enregistrée, rien n'est prélevé avant J+7 ; un
         e-mail prévient avant la fin (api/trial-emails.js) et la résiliation
         du profil coupe tout sans frais. Une seule fois par adresse : qui a
         déjà eu un abonnement Stripe (essai compris) paie directement. */
      const trial = plan === 'annual' && await essaiPossible(email);
      // Abonnement carte + Apple Pay / Google Pay — méthodes gérées via Dashboard Stripe
      session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: plan === 'monthly' ? PRICE_MONTHLY : PRICE_ANNUAL, quantity: 1 }],
        payment_method_types: ['card'],
        expires_at: expiresAt,
        ui_mode: 'embedded',
        return_url: `${origin}/?psid={CHECKOUT_SESSION_ID}#payment-success`,
        locale: 'fr',
        metadata: { plan: plan, trial: trial ? '1' : '0' },
        ...(trial ? {
          subscription_data: {
            trial_period_days: TRIAL_DAYS,
            trial_settings: { end_behavior: { missing_payment_method: 'cancel' } },
            metadata: { trial: '1' },
          },
          custom_text: { submit: { message: '0 € aujourd’hui. Un e-mail te prévient avant la fin de l’essai, et tu peux résilier en 1 clic depuis ton profil : rien ne sera prélevé.' } },
        } : {}),
        ...(email ? { customer_email: email } : {}),
      });
      return res.json({ clientSecret: session.client_secret, trial });
    }

    res.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

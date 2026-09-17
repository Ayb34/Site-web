/* E-mail de bienvenue, envoyé à l'instant où l'essai s'ouvre.

   Authentifié par jeton Firebase, comme la résiliation : un point d'entrée qui
   envoie du courrier et qui accepterait une adresse dans le corps de la requête
   serait une machine à spam offerte au premier venu. On n'écrit qu'à l'adresse
   CONTENUE DANS LE JETON, jamais à une adresse transmise. */

const admin = require('firebase-admin');
const { emailBienvenue, envoyer, TRIAL_DAYS } = require('./_emails');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

module.exports = async (req, res) => {
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
      return res.status(401).json({ error: 'Session invalide' });
    }

    const uid = decoded.uid;
    const email = decoded.email;
    if (!email) return res.status(400).json({ error: 'Compte sans adresse e-mail' });

    const db = admin.firestore();
    const ref = db.collection('users').doc(uid);
    const doc = await ref.get();
    const data = doc.exists ? doc.data() : {};

    /* Le client peut appeler plusieurs fois — deux onglets, un rechargement au
       mauvais moment. Le drapeau serveur est seul juge. */
    if (data.mails && data.mails.welcome) return res.json({ ok: true, skipped: 'déjà envoyé' });
    if (data.isPro) return res.json({ ok: true, skipped: 'déjà abonné' });

    const u = await admin.auth().getUser(uid);
    const cree = Date.parse(u.metadata.creationTime);
    /* Le compte doit venir d'être créé. Sans ce garde-fou, un ancien membre qui
       se reconnecte déclencherait une bienvenue pour un essai déjà expiré. */
    if (isNaN(cree) || Date.now() - cree > 6 * 3600 * 1000) {
      return res.json({ ok: true, skipped: 'compte trop ancien' });
    }

    const prenom = (u.displayName || '').trim().split(' ')[0] || '';
    await envoyer(email, prenom, emailBienvenue(prenom, cree + TRIAL_DAYS * 86400000));

    await ref.set({ mails: { welcome: true } }, { merge: true });
    res.json({ ok: true, sent: 'welcome' });
  } catch (err) {
    console.error('welcome-email:', err.message);
    res.status(500).json({ error: err.message });
  }
};

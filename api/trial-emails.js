/* Relances d'essai — J+1 et J+2. Appelé une fois par jour par le cron Vercel.

   Deux garde-fous qui comptent plus que le reste :

   1. `CRON_SECRET`. Vercel place ce secret en en-tête sur ses appels planifiés.
      Sans cette vérification, l'adresse serait publique et n'importe qui
      pourrait la marteler ; les drapeaux Firestore empêcheraient le doublon,
      mais pas la facture Brevo ni la charge.

   2. Une fenêtre étroite sur l'âge du compte. On ne regarde QUE les comptes
      créés dans les trois derniers jours. Les 225 membres existants sont donc
      hors de portée par construction : aucun envoi massif accidentel n'est
      possible, même en cas de bug ailleurs dans ce fichier.

   L'horloge est `metadata.creationTime` de Firebase Auth, exactement celle que
   le site utilise pour afficher le mur. Les deux ne peuvent pas diverger. */

const admin = require('firebase-admin');
const { emailDernierJour, emailFin, envoyer, TRIAL_DAYS } = require('./_emails');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

const JOUR = 86400000;
const FENETRE = 3 * JOUR;

module.exports = async (req, res) => {
  const secret = process.env.CRON_SECRET;
  const recu = (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!secret || recu !== secret) return res.status(401).json({ error: 'Non autorisé' });

  const db = admin.firestore();
  const maintenant = Date.now();
  const bilan = { examines: 0, d1: 0, fin: 0, ignores: 0, erreurs: [] };

  try {
    /* 230 comptes aujourd'hui : une page suffit. La boucle de pagination est là
       pour que ça continue de fonctionner à 10 000 sans qu'on y repense. */
    let pageToken;
    const candidats = [];
    do {
      const lot = await admin.auth().listUsers(1000, pageToken);
      lot.users.forEach(function (u) {
        const cree = Date.parse(u.metadata.creationTime);
        if (isNaN(cree)) return;
        const age = maintenant - cree;
        if (age >= 0 && age < FENETRE) candidats.push({ u, cree, age });
      });
      pageToken = lot.pageToken;
    } while (pageToken);

    for (const { u, cree, age } of candidats) {
      bilan.examines += 1;
      if (!u.email) { bilan.ignores += 1; continue; }

      /* Quel e-mail cet âge appelle-t-il ? Le cron tourne une fois par jour ;
         on vise donc une tranche d'un jour, pas un instant. */
      const jours = Math.floor(age / JOUR);
      const type = jours === TRIAL_DAYS - 1 ? 'd1' : jours === TRIAL_DAYS ? 'fin' : null;
      if (!type) { bilan.ignores += 1; continue; }

      const ref = db.collection('users').doc(u.uid);
      const doc = await ref.get();
      const data = doc.exists ? doc.data() : {};

      /* Ne jamais relancer un abonné : il a payé, lui rappeler ce qu'il perd
         serait absurde. */
      if (data.isPro) { bilan.ignores += 1; continue; }
      if (data.mails && data.mails[type]) { bilan.ignores += 1; continue; }

      /* Personne à qui la bienvenue n'est jamais partie n'a pas vécu d'essai —
         compte créé avant la mise en place, ou e-mail en échec. Lui écrire
         « ton accès ferme demain » parlerait d'un accès qu'il n'a pas eu. */
      if (!(data.mails && data.mails.welcome)) { bilan.ignores += 1; continue; }

      const prenom = (u.displayName || '').trim().split(' ')[0] || '';
      const message = type === 'd1'
        ? emailDernierJour(prenom, cree + TRIAL_DAYS * JOUR)
        : emailFin(prenom);

      try {
        await envoyer(u.email, prenom, message);
        await ref.set({ mails: { [type]: true } }, { merge: true });
        bilan[type] += 1;
      } catch (e) {
        /* Un échec sur un destinataire ne doit pas emporter les suivants. Le
           drapeau n'est pas posé : le passage de demain réessaiera, tant que le
           compte reste dans la fenêtre. */
        bilan.erreurs.push(u.uid + ' : ' + e.message);
      }
    }

    console.log('trial-emails', JSON.stringify(bilan));
    res.json(bilan);
  } catch (err) {
    console.error('trial-emails:', err.message);
    res.status(500).json({ error: err.message, bilan });
  }
};

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
const { emailDernierJour, emailFin, emailBienvenueRattrapage, emailOffreLancement, emailRappel, envoyer, TRIAL_DAYS, TRIAL_STOP } = require('./_emails');

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
        // Comptes créés après la fin de l'essai : ils n'en ont pas eu, rien à relancer.
        if (cree >= TRIAL_STOP) return;
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

    /* Rattrapage unique des bienvenues perdues (cf. emailBienvenueRattrapage).
       Fenêtre de dates FIXE : seuls les comptes créés pendant la panne sont
       concernés, et le drapeau mails.welcome — posé avant l'envoi — garantit
       qu'aucun ne le reçoit deux fois. Hors de cette fenêtre, ce bloc ne fait
       rien : il peut rester en place sans risque. */
    const PANNE_DEBUT = Date.parse('2026-11-14T12:16:00Z');
    const PANNE_FIN = Date.parse('2026-11-20T08:00:00Z');
    bilan.rattrapage = 0;
    let tok;
    const perdus = [];
    do {
      const lot = await admin.auth().listUsers(1000, tok);
      lot.users.forEach(function (u) {
        const cree = Date.parse(u.metadata.creationTime);
        if (cree >= PANNE_DEBUT && cree < PANNE_FIN && u.email && !/id\.gle$/.test(u.email)) perdus.push(u);
      });
      tok = lot.pageToken;
    } while (tok);
    for (const u of perdus) {
      const ref = db.collection('users').doc(u.uid);
      const doc = await ref.get();
      const data = doc.exists ? doc.data() : {};
      if (data.isPro || (data.mails && data.mails.welcome)) continue;
      await ref.set({ mails: { welcome: true, welcomeRattrapage: Date.now() } }, { merge: true });
      let prenom = (u.displayName || '').trim().split(/\s+/)[0] || '';
      if (!/^[\p{L}][\p{L}'-]{1,19}$/u.test(prenom)) prenom = '';
      try {
        await envoyer(u.email, prenom, emailBienvenueRattrapage(prenom));
        bilan.rattrapage += 1;
      } catch (e) {
        bilan.erreurs.push('rattrapage ' + u.uid + ' : ' + e.message);
      }
    }

    /* Offre de lancement (4,99 €/mois jusqu'au dimanche 22/11 minuit, Paris).
       Une fois par compte, aux inscrits depuis le 19/11 qui ne sont pas Pro.
       Ne part plus à moins de 3 h de la fin de l'offre : annoncer une offre
       qui expire pendant qu'on lit le mail serait malhonnête. Au-delà, le
       bloc ne fait plus rien et peut rester en place. */
    const OFFRE_FIN = Date.parse('2026-11-22T23:00:00Z');
    const OFFRE_DEBUT_INSCR = Date.parse('2026-11-18T23:00:00Z');
    bilan.offre = 0;
    if (Date.now() < OFFRE_FIN - 3 * 3600000) {
      let tk;
      const cibles = [];
      do {
        const lot = await admin.auth().listUsers(1000, tk);
        lot.users.forEach(function (u) {
          const cree = Date.parse(u.metadata.creationTime);
          if (cree >= OFFRE_DEBUT_INSCR && u.email && !/id\.gle$/.test(u.email)) cibles.push(u);
        });
        tk = lot.pageToken;
      } while (tk);
      for (const u of cibles) {
        const ref = db.collection('users').doc(u.uid);
        const doc = await ref.get();
        const data = doc.exists ? doc.data() : {};
        if (data.isPro || (data.mails && data.mails.offreLancement)) continue;
        await ref.set({ mails: { offreLancement: Date.now() } }, { merge: true });
        let prenom = (u.displayName || '').trim().split(/\s+/)[0] || '';
        if (!/^[\p{L}][\p{L}'-]{1,19}$/u.test(prenom)) prenom = '';
        const mots = data.comprendre && data.comprendre.words ? Object.keys(data.comprendre.words).length : 0;
        try {
          await envoyer(u.email, prenom, emailOffreLancement(prenom, mots));
          bilan.offre += 1;
        } catch (e) {
          bilan.erreurs.push('offre ' + u.uid + ' : ' + e.message);
        }
      }
    }

    /* Aperçu à la demande : un compte marqué mails.apercu = true (posé à la
       main, depuis la console admin) reçoit une fois le dernier mail de
       campagne, pour relecture. Aucune adresse dans le code. */
    bilan.apercu = 0;
    const apercus = await db.collection('users').where('mails.apercu', '==', true).get();
    for (const d of apercus.docs) {
      await d.ref.set({ mails: { apercu: false } }, { merge: true });
      try {
        const u = await admin.auth().getUser(d.id);
        if (!u.email) continue;
        let prenom = (u.displayName || '').trim().split(/\s+/)[0] || '';
        if (!/^[\p{L}][\p{L}'-]{1,19}$/u.test(prenom)) prenom = '';
        const data = d.data();
        const mots = data.comprendre && data.comprendre.words ? Object.keys(data.comprendre.words).length : 0;
        await envoyer(u.email, prenom, emailOffreLancement(prenom, mots));
        bilan.apercu += 1;
      } catch (e) {
        bilan.erreurs.push('apercu ' + d.id + ' : ' + e.message);
      }
    }

    /* Rappel du verset du jour — opt-in uniquement (rappel.on posé par la
       personne elle-même dans Comprendre). Un par jour au plus, et rien si elle
       a déjà joué aujourd'hui. Jours comptés à l'heure de Paris, comme le site. */
    bilan.rappel = 0;
    const jourParis = function (offset) {
      return new Date(Date.now() + (offset || 0) * JOUR).toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
    };
    const auj = jourParis(0), hier = jourParis(-1);
    const abonnes = await db.collection('users').where('rappel.on', '==', true).get();
    for (const doc of abonnes.docs) {
      const data = doc.data();
      const cmp = data.comprendre || {};
      if (cmp.lastDay === auj) continue;
      if (data.mails && data.mails.rappelJour === auj) continue;
      let u;
      try { u = await admin.auth().getUser(doc.id); } catch (e) { continue; }
      if (!u.email || /id\.gle$/.test(u.email)) continue;
      await doc.ref.set({ mails: { rappelJour: auj } }, { merge: true });
      let prenom = (u.displayName || '').trim().split(/\s+/)[0] || '';
      if (!/^[\p{L}][\p{L}'-]{1,19}$/u.test(prenom)) prenom = '';
      const serie = cmp.lastDay === hier ? (cmp.streak || 0) : 0;
      try {
        await envoyer(u.email, prenom, emailRappel(prenom, serie));
        bilan.rappel += 1;
      } catch (e) {
        bilan.erreurs.push('rappel ' + doc.id + ' : ' + e.message);
      }
    }

    console.log('trial-emails', JSON.stringify(bilan));
    res.json(bilan);
  } catch (err) {
    console.error('trial-emails:', err.message);
    res.status(500).json({ error: err.message, bilan });
  }
};

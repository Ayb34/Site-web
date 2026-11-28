/* E-mail du vendredi (Jumu’a) — appelé par le cron Vercel chaque vendredi.

   Destinataires : comptes avec e-mail, SANS abonnement, qui n'ont pas demandé
   l'arrêt (mails.jumuaOff). Pas les adresses relais d'Apple (privaterelay) :
   tant que le domaine n'est pas enregistré chez Apple, elles rebondissent et
   abîment la réputation d'envoi.

   Quota : l'offre gratuite de Brevo plafonne à 300 e-mails PAR JOUR, bienvenues
   et rappels compris. On s'arrête donc à LIMITE envois et l'on sert d'abord
   ceux qui l'ont reçu il y a le plus longtemps (jamais = en premier), puis les
   plus récemment actifs. Tant que la liste dépasse LIMITE, chacun le reçoit au
   moins une semaine sur deux ; avec une offre Brevo payante, monter LIMITE.

   Même adresse pour l'arrêt : GET/POST ?stop=<uid>&t=<signature>. La signature
   (HMAC du uid avec CRON_SECRET) empêche de désabonner quelqu'un d'autre. */

const crypto = require('crypto');
const admin = require('firebase-admin');
const { emailJumua, envoyer } = require('./_emails');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

const JOUR = 86400000;
/* 200 (et non 230) depuis le 28/11/2026 : la séquence d'accueil et les rappels
   partent aussi chaque jour, et Brevo Free plafonne à 300 envois par jour. */
const LIMITE = 200;
const SITE = 'https://heritage-musulman.com';

function signature(uid, k) {
  return crypto.createHmac('sha256', process.env.CRON_SECRET || '').update((k || 'jumua') + ':' + uid).digest('hex').slice(0, 24);
}
/* Listes qu'on peut quitter par ce lien : k absent = vendredi ; k=seq = la
   séquence d'accueil J+1/J+3/J+6 (api/trial-emails.js). */
const LISTES = {
  jumua: { champ: 'jumuaOff', texte: 'Tu ne recevras plus l’e-mail du vendredi.' },
  seq: { champ: 'seqOff', texte: 'Tu ne recevras plus les e-mails d’accueil.' },
};

function page(titre, texte) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${titre}</title></head>
<body style="margin:0;padding:40px 20px;background:#03110a;color:#f0ede6;font-family:Arial,Helvetica,sans-serif;text-align:center;">
<h1 style="font-size:22px;margin:0 0 12px;">${titre}</h1><p style="color:#9db3a5;line-height:1.6;">${texte}</p>
<p style="margin-top:24px;"><a href="${SITE}/#comprendre" style="color:#e6c84a;">Retour sur Héritage Musulman</a></p></body></html>`;
}

module.exports = async (req, res) => {
  const q = req.query || {};

  /* ── Arrêt de l'e-mail du vendredi ── */
  if (q.stop) {
    const uid = String(q.stop);
    const t = String(q.t || '');
    const k = LISTES[String(q.k || '')] ? String(q.k) : 'jumua';
    const attendu = signature(uid, k);
    if (!process.env.CRON_SECRET || t.length !== attendu.length
      || !crypto.timingSafeEqual(Buffer.from(t), Buffer.from(attendu))) {
      res.status(400).setHeader('content-type', 'text/html; charset=utf-8');
      return res.send(page('Lien invalide', 'Ce lien d’arrêt n’est pas valide. Réponds simplement à l’e-mail et je m’en occupe.'));
    }
    await admin.firestore().collection('users').doc(uid)
      .set({ mails: { [LISTES[k].champ]: true, [LISTES[k].champ + 'At']: Date.now() } }, { merge: true });
    res.setHeader('content-type', 'text/html; charset=utf-8');
    return res.send(page('C’est noté', LISTES[k].texte + ' Ton compte et ta progression ne changent pas.'));
  }

  /* ── Envoi (cron uniquement) ── */
  const secret = process.env.CRON_SECRET;
  const recu = (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!secret || recu !== secret) return res.status(401).json({ error: 'Non autorisé' });

  // Garde-fou : seulement un vendredi, heure de Paris.
  const jourSemaine = new Date().toLocaleDateString('en-US', { timeZone: 'Europe/Paris', weekday: 'short' });
  if (jourSemaine !== 'Fri') return res.json({ ignore: 'pas vendredi', jourSemaine });

  const auj = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
  const semaine = Math.floor(Date.now() / (7 * JOUR));
  const db = admin.firestore();
  const bilan = { candidats: 0, envoyes: 0, ignores: 0, erreurs: [] };

  try {
    const docs = {};
    (await db.collection('users').get()).forEach(function (d) { docs[d.id] = d.data(); });

    let tok;
    const liste = [];
    do {
      const lot = await admin.auth().listUsers(1000, tok);
      lot.users.forEach(function (u) {
        const e = (u.email || '').toLowerCase();
        if (!e || /id\.gle$|privaterelay\.appleid\.com$|^review@heritage-musulman\.com$/.test(e)) return;
        const d = docs[u.uid] || {};
        const m = d.mails || {};
        if (d.isPro || m.jumuaOff || m.jumua === auj) return;
        liste.push({ u, d, dernier: m.jumuaAt || 0, actif: Date.parse(u.metadata.lastRefreshTime || u.metadata.lastSignInTime || u.metadata.creationTime) || 0 });
      });
      tok = lot.pageToken;
    } while (tok);

    bilan.candidats = liste.length;
    liste.sort(function (a, b) { return (a.dernier - b.dernier) || (b.actif - a.actif); });
    const cibles = liste.slice(0, LIMITE);
    bilan.ignores = liste.length - cibles.length;

    // 8 envois en parallèle : ~230 e-mails en une vingtaine de secondes.
    let i = 0;
    async function ouvrier() {
      while (i < cibles.length) {
        const { u, d } = cibles[i++];
        let prenom = (u.displayName || '').trim().split(/\s+/)[0] || '';
        if (!/^[\p{L}][\p{L}'-]{1,19}$/u.test(prenom)) prenom = '';
        const mots = d.comprendre && d.comprendre.words ? Object.keys(d.comprendre.words).length : 0;
        const urlStop = SITE + '/api/jumua-email?stop=' + encodeURIComponent(u.uid) + '&t=' + signature(u.uid);
        const ref = db.collection('users').doc(u.uid);
        // Drapeau posé AVANT l'envoi : un second passage le même jour n'envoie jamais deux fois.
        await ref.set({ mails: { jumua: auj, jumuaAt: Date.now() } }, { merge: true });
        try {
          await envoyer(u.email, prenom, emailJumua(prenom, mots, semaine, urlStop));
          bilan.envoyes += 1;
        } catch (e) {
          bilan.erreurs.push(u.uid + ' : ' + e.message);
        }
      }
    }
    await Promise.all(Array.from({ length: 8 }, ouvrier));

    console.log('jumua-email', JSON.stringify(bilan));
    res.json(bilan);
  } catch (err) {
    console.error('jumua-email:', err.message);
    res.status(500).json({ error: err.message, bilan });
  }
};

module.exports.config = { maxDuration: 60 };

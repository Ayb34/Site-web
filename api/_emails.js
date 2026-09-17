/* Les trois e-mails du cycle d'essai, et l'envoi Brevo.

   Le préfixe « _ » écarte ce fichier du routage Vercel : c'est une
   bibliothèque, pas un point d'entrée.

   Ce que dit la campagne du 6 septembre : 203 délivrés, 36 % ouverts, 3,45 %
   cliqués. Être lu n'est donc pas le problème — 66 personnes sur 73 ont lu et
   n'ont pas bougé. Un e-mail qui décrit le site perd. Ce que la séquence
   apporte et qu'une campagne ponctuelle ne peut pas avoir, c'est une échéance
   réelle : un accès qui se ferme à une date que le lecteur peut vérifier.

   Écriture : pas de fausse urgence, pas de compte à rebours inventé. On vend de
   l'apprentissage religieux à des gens qui jugent sur la droiture ; quelques
   clics gagnés contre la confiance perdue est un mauvais échange quand tout
   l'enjeu est de passer de 0,77 % à quelques pour cent de conversion.

   Technique : tableaux et non flexbox, styles en ligne, VML pour les boutons
   Outlook, pré-en-tête masqué. Les clients de messagerie sont restés en 2005. */

const SITE = 'https://heritage-musulman.com';
const SENDER = { name: 'Héritage Musulman', email: 'contact@heritage-musulman.com' };

const OR = '#c8a727';
const OR_CLAIR = '#e6c84a';
const FOND = '#03110a';
const CARTE = '#0a1f12';
const TEXTE = '#f0ede6';
const DOUX = '#9db3a5';

const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
  'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function dateFr(ms) {
  const d = new Date(ms);
  return JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + MOIS[d.getMonth()];
}

/* Le lien porte son origine : le site l'écrit dans Firestore sur le compte de
   l'inscrit. C'est ce qui permettra de dire lequel des trois e-mails a produit
   des abonnements, plutôt que de le supposer.

   L'ordre `?requête` PUIS `#page` n'est pas cosmétique. L'inverse — écrire
   `/#comprendre?utm_source=…` — plaçait tout dans le fragment : le routeur
   cherchait une page nommée « comprendre?utm_source=email&… », ne la trouvait
   pas et affichait une 404, pendant que l'attribution, qui lit
   `location.search`, ne voyait rien. */
function lien(campagne, page) {
  const requete = '?utm_source=email&utm_medium=lifecycle&utm_campaign=' + campagne;
  return SITE + '/' + requete + (page ? '#' + page : '');
}

function bouton(url, texte) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
    <tr><td align="center" bgcolor="${OR}" style="border-radius:10px;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word"
        href="${url}" style="height:52px;v-text-anchor:middle;width:300px;" arcsize="20%" stroke="f" fillcolor="${OR}">
        <w:anchorlock/><center style="color:#1c1200;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">${texte}</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-- -->
      <a href="${url}" style="display:inline-block;padding:16px 34px;font-family:Arial,Helvetica,sans-serif;
        font-size:16px;font-weight:bold;color:#1c1200;text-decoration:none;border-radius:10px;">${texte}</a>
      <!--<![endif]-->
    </td></tr>
  </table>`;
}

/* Coquille commune. `preheader` est le texte que la boîte de réception affiche
   à côté de l'objet : laissé vide, elle y met le premier texte trouvé, souvent
   « Affichage dans le navigateur ». C'est une deuxième chance d'être ouvert. */
function coquille(preheader, corps) {
  return `<!doctype html>
<html lang="fr"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<title>Héritage Musulman</title>
</head>
<body style="margin:0;padding:0;background:${FOND};">
<div style="display:none;font-size:1px;color:${FOND};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${FOND};">
<tr><td align="center" style="padding:32px 16px 44px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:520px;">

    <tr><td align="center" style="padding-bottom:26px;">
      <div style="font-family:Georgia,serif;font-size:19px;font-weight:bold;color:${OR};letter-spacing:3px;">HÉRITAGE</div>
      <div style="font-family:Georgia,serif;font-size:11px;color:${DOUX};letter-spacing:5px;padding-top:3px;">MUSULMAN</div>
    </td></tr>

    <tr><td style="background:${CARTE};border:1px solid rgba(200,167,39,0.22);border-radius:16px;padding:32px 28px;">
      ${corps}
    </td></tr>

    <tr><td align="center" style="padding-top:26px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#5d7367;line-height:1.7;">
      Tu reçois cet e-mail parce que tu as créé un compte sur Héritage Musulman.<br>
      <a href="{{ unsubscribe }}" style="color:#5d7367;text-decoration:underline;">Ne plus recevoir ces e-mails</a>
    </td></tr>

  </table>
</td></tr></table>
</body></html>`;
}

const h1 = `font-family:Georgia,serif;font-size:23px;line-height:1.3;color:${TEXTE};margin:0 0 16px;font-weight:normal;`;
const p = `font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#c9d6ce;margin:0 0 16px;`;
const petit = `font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:${DOUX};margin:0;`;

/* Deux colonnes « ce qui reste / ce qui ferme ». Nommer ce qui reste ouvert
   avant ce qui se ferme n'est pas de la politesse : un lecteur qui croit tout
   perdre ferme l'onglet, et personne ne paie pour un site qu'il a quitté. */
function colonnes(garde, perd) {
  const item = (t, c) => `<tr><td style="padding:3px 0;font-family:Arial,Helvetica,sans-serif;font-size:13.5px;color:${c};">${t}</td></tr>`;
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:4px 0 22px;">
    <tr><td style="padding-bottom:14px;">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:#4ade80;padding-bottom:6px;">CE QUI TE RESTE</div>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">${garde.map(t => item('✓ ' + t, '#c9d6ce')).join('')}</table>
    </td></tr>
    <tr><td>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:${OR};padding-bottom:6px;">CE QUI SE REFERME</div>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">${perd.map(t => item('· ' + t, DOUX)).join('')}</table>
    </td></tr>
  </table>`;
}

const PRIX = `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:22px 0 20px;">
    <tr><td align="center" style="background:rgba(200,167,39,0.07);border:1px solid rgba(200,167,39,0.2);border-radius:12px;padding:18px;">
      <div style="font-family:Georgia,serif;font-size:29px;color:${OR_CLAIR};">29,99&nbsp;€<span style="font-family:Arial,sans-serif;font-size:13px;color:${DOUX};"> / an</span></div>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${DOUX};padding-top:5px;">soit 2,50&nbsp;€ par mois — ou 4,99&nbsp;€ au mois, sans engagement</div>
    </td></tr>
  </table>`;

/* ── 1. Bienvenue — envoyé à l'instant où l'essai s'ouvre ── */
function emailBienvenue(prenom, finMs) {
  const salut = prenom ? `As-salāmu ʿalaykum ${prenom},` : 'As-salāmu ʿalaykum,';
  return {
    subject: 'Ton accès complet est ouvert jusqu\'à ' + dateFr(finMs),
    html: coquille(
      'Par quoi commencer : quatre minutes suffisent.',
      `
      <p style="${p}">${salut}</p>
      <h1 style="${h1}">Tout le site t'est ouvert<br>jusqu'à <span style="color:${OR_CLAIR};">${dateFr(finMs)}</span>.</h1>
      <p style="${p}">Aucune carte n'a été demandée, il n'y a donc rien à résilier. À la fin des deux jours, ton compte redevient simplement gratuit.</p>
      <p style="${p}">Une seule chose à faire maintenant, et elle prend quatre minutes : <strong style="color:${TEXTE};">Al-Fâtiha, mot à mot</strong>. Tu la récites dans chaque prière — tu vas enfin voir ce que chaque mot veut dire.</p>
      ${bouton(lien('trial_welcome', 'comprendre'), 'Commencer par Al-Fâtiha')}
      <p style="${petit}padding-top:22px;">Ensuite, si tu veux : 38 sourates en mot-à-mot, 740 questions de quiz sur trois niveaux, et les 114 sourates du Blind Test.</p>
      `
    ),
  };
}

/* ── 2. J+1 — il reste un jour ── */
function emailDernierJour(prenom, finMs) {
  const salut = prenom ? `${prenom},` : 'As-salāmu ʿalaykum,';
  return {
    subject: 'Ton accès complet ferme demain',
    html: coquille(
      'Ce que tu gardes, et ce qui se referme.',
      `
      <p style="${p}">${salut}</p>
      <h1 style="${h1}">Il te reste un jour<br>d'accès complet.</h1>
      <p style="${p}">Demain, ${dateFr(finMs)}, ton compte redevient gratuit. Rien ne sera perdu de ce que tu as appris — mais le rythme change.</p>
      ${colonnes(
        ['Toute ta progression, définitivement', 'Al-Fâtiha et Al-Ikhlâs en entier', 'Une partie de Quiz par jour', 'Une partie de Blind Test par jour', 'Une sourate Pro offerte chaque semaine'],
        ['Les 36 autres sourates en mot-à-mot', 'Les niveaux Amateur et Avancé', 'Les 114 sourates du Blind Test', 'Le jeu sans limite quotidienne']
      )}
      <p style="${p}">Si tu veux garder l'accès entier, c'est maintenant qu'il faut le dire — demain le site aura déjà changé.</p>
      ${PRIX}
      ${bouton(lien('trial_d1', 'subscription'), 'Garder l\'accès complet')}
      <p style="${petit}padding-top:20px;">Résiliable en un clic, remboursé sous 48 h.</p>
      `
    ),
  };
}

/* ── 3. J+2 — l'essai est terminé ── */
function emailFin(prenom) {
  const salut = prenom ? `${prenom},` : 'As-salāmu ʿalaykum,';
  return {
    subject: 'Ton essai est terminé — ce qui reste ouvert',
    html: coquille(
      'Ton compte reste actif, et ta progression est intacte.',
      `
      <p style="${p}">${salut}</p>
      <h1 style="${h1}">Tes deux jours<br>sont passés.</h1>
      <p style="${p}">Ton compte reste actif et ta progression est intacte. Ce que tu as appris ne t'est pas repris : tu peux continuer, simplement à un rythme plus lent.</p>
      ${colonnes(
        ['Une partie de Quiz par jour', 'Une partie de Blind Test par jour', 'Al-Fâtiha et Al-Ikhlâs, toujours', 'Une sourate Pro offerte chaque semaine'],
        ['Le Juz ʿAmma complet, 38 sourates', 'Les 740 questions, tous niveaux', 'Les 114 sourates du Blind Test']
      )}
      <p style="${p}">Si les deux jours t'ont servi, l'abonnement rouvre tout. Sinon, reviens quand tu veux : la partie du jour t'attend, et elle restera gratuite.</p>
      ${PRIX}
      ${bouton(lien('trial_end', 'subscription'), 'Rouvrir tout le site')}
      <p style="${petit}padding-top:20px;">Huit centimes par jour. On dépense davantage sans y penser, pour des choses dont il ne reste rien le lendemain.</p>
      `
    ),
  };
}

/* Envoi transactionnel Brevo. `fetch` est natif sur le runtime Node de Vercel.
   On renvoie une erreur parlante : un échec silencieux sur un envoi d'e-mail se
   remarque des semaines plus tard, quand personne ne se souvient de rien. */
async function envoyer(destinataire, prenom, message) {
  const cle = process.env.BREVO_API_KEY;
  if (!cle) throw new Error('BREVO_API_KEY absente');

  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': cle, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: SENDER,
      to: [prenom ? { email: destinataire, name: prenom } : { email: destinataire }],
      subject: message.subject,
      htmlContent: message.html,
    }),
  });

  if (!r.ok) {
    const corps = await r.text().catch(() => '');
    throw new Error('Brevo ' + r.status + ' : ' + corps.slice(0, 200));
  }
  return r.json().catch(() => ({}));
}

module.exports = {
  TRIAL_DAYS: 2,
  emailBienvenue,
  emailDernierJour,
  emailFin,
  envoyer,
  dateFr,
};

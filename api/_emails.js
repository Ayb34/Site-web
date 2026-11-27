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
/* Réponses : contact@heritage-musulman.com. Jusqu'au 22/11/2026 le domaine
   n'avait pas de MX et ces réponses se perdaient. Depuis, ImprovMX (MX dans le
   DNS Vercel) fait suivre tout @heritage-musulman.com vers la boîte Gmail. */
const REPLY_TO = SENDER.email;

const OR = '#c8a727';
const OR_CLAIR = '#e6c84a';
const FOND = '#03110a';
const CARTE = '#0a1f12';
const TEXTE = '#f0ede6';
const DOUX = '#9db3a5';
/* Equivalents opaques des anciens rgba() : Gmail sur mobile ne les
   interprete pas, et rendait bordures et cadres dans des teintes arbitraires.
   Calcules par composition sur la carte #0a1f12. */
const BORD = '#343D17';
const BORD_PRIX = '#303A16';
const FOND_PRIX = '#172913';

const JOURS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
  'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/* Heure de Paris, pas celle du serveur : Vercel tourne en UTC, et une
   inscription à 23 h 30 en France tombait la veille ou le lendemain. */
function paris(ms) {
  const d = new Date(new Date(ms).toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
  return d;
}
function dateFr(ms) {
  const d = paris(ms);
  return JOURS[d.getDay()] + ' ' + d.getDate() + ' ' + MOIS[d.getMonth()];
}
/* « demain » ou « ce soir » : le cron passe à 9 h, et pour qui s'est inscrit
   en soirée l'accès ferme le jour même. */
function quandFr(finMs) {
  const fin = paris(finMs), now = paris(Date.now());
  if (fin.toDateString() === now.toDateString()) return { mot: fin.getHours() >= 18 ? 'ce soir' : "aujourd'hui", heure: fin.getHours() + ' h' };
  return { mot: 'demain', heure: null };
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
<style>
  /* Le logo est retire sous 600 px : sur un ecran etroit il occupait le tiers
     du premier coup d'oeil pour ne rien dire que le texte ne dise deja.

     Gmail respecte les blocs <style> et les media queries depuis 2016 pour les
     comptes Google — donc la regle s'applique la ou le probleme se pose. Les
     clients qui suppriment le bloc gardent le logo affiche : c'est le bon sens
     du repli, on ne perd jamais l'identite, on la montre seulement partout. */
  @media only screen and (max-width: 600px) {
    .entete-logo { display: none !important; }
  }
</style>
</head>
<body bgcolor="${FOND}" style="margin:0;padding:0;background-color:${FOND};">
<div style="display:none;font-size:1px;color:${FOND};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="${FOND}" style="background-color:${FOND};">
<tr><td align="center" bgcolor="${FOND}" style="background-color:${FOND};padding:32px 16px 44px;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:520px;">

    <tr class="entete-logo"><td align="center" style="padding-bottom:26px;">
      <!-- PNG transparent, et non aplati sur le fond. Gmail sur mobile ajuste
           les couleurs de fond de l'e-mail mais ne touche pas aux images : une
           tuile opaque cessait de correspondre au fond decale et se voyait
           comme un rectangle vert. La transparence s'adapte a ce que le client
           decide de peindre. Le mot-symbole est dore a 86 %, donc il survit
           meme chez un client qui imposerait un fond blanc. -->
      <img src="${SITE}/uploads/logo-email.png" width="150" height="127"
        alt="Héritage Musulman"
        style="display:block;width:150px;height:auto;border:0;outline:none;text-decoration:none;">
    </td></tr>

    <tr><td bgcolor="${CARTE}" style="background-color:${CARTE};border:1px solid ${BORD};border-radius:16px;padding:32px 28px;">
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
function colonnes(garde, perd, titreGarde, titrePerd) {
  const item = (t, c) => `<tr><td style="padding:3px 0;font-family:Arial,Helvetica,sans-serif;font-size:13.5px;color:${c};">${t}</td></tr>`;
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:4px 0 22px;">
    <tr><td style="padding-bottom:14px;">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:#4ade80;padding-bottom:6px;">${titreGarde || 'CE QUI TE RESTE'}</div>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">${garde.map(t => item('✓ ' + t, '#c9d6ce')).join('')}</table>
    </td></tr>
    ${perd.length ? `<tr><td>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:${OR};padding-bottom:6px;">${titrePerd || 'CE QUI SE REFERME'}</div>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">${perd.map(t => item('· ' + t, DOUX)).join('')}</table>
    </td></tr>` : ''}
  </table>`;
}

const PRIX = `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:22px 0 20px;">
    <tr><td align="center" bgcolor="${FOND_PRIX}" style="background-color:${FOND_PRIX};border:1px solid ${BORD_PRIX};border-radius:12px;padding:18px;">
      <div style="font-family:Georgia,serif;font-size:29px;color:${OR_CLAIR};">29,99&nbsp;€<span style="font-family:Arial,sans-serif;font-size:13px;color:${DOUX};"> / an</span></div>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${DOUX};padding-top:5px;">soit 2,50&nbsp;€ par mois — ou 7,90&nbsp;€ au mois, sans engagement</div>
    </td></tr>
  </table>`;

/* Fin de l'essai de 2 jours : comptes créés après cette date (même valeur
   que HM_TRIAL_STOP dans src/app.jsx). Ils reçoivent la bienvenue « gratuite »
   et aucune relance de fin d'essai. */
const TRIAL_STOP = Date.UTC(2026, 10, 4, 12, 15, 0);

/* ── 0. Bienvenue — compte gratuit, sans essai (depuis le 04/11/2026) ──
   Remplace aussi l'ancien e-mail EmailJS, qui annonçait encore les 2 jours et
   ne partait qu'aux inscriptions par e-mail (jamais par Google). */
function emailBienvenueGratuit(prenom) {
  const salut = prenom ? `As-salāmu ʿalaykum ${prenom},` : 'As-salāmu ʿalaykum,';
  const url = SITE + '/#comprendre';
  /* Volontairement « nu » : ni logo, ni bouton, ni prix, ni lien de
     désinscription. Gmail classe en Promotions ce qui ressemble à une
     newsletter (gabarit coloré, image, gros bouton, mention de prix) ; un
     message écrit comme par une personne arrive dans Principale. La question
     finale invite à répondre : chaque réponse apprend à Gmail que l'expéditeur
     est un correspondant, pas un annonceur. */
  const lignes = [
    salut,
    'Ton compte est prêt. Il est gratuit et le reste : chaque jour une partie de Quiz et une de Blind Test, Al-Fâtiha et Al-Ikhlâs en entier dans Comprendre, et l’écoute mot à mot de toutes les sourates. Ta progression est sauvegardée.',
    'Si tu ne sais pas par où commencer : Al-Fâtiha, mot à mot. Tu la récites dans chaque prière, et en quatre minutes tu vois enfin ce que chaque mot veut dire.',
    url,
    'Une question pour moi : qu’est-ce qui t’a amené sur le site ? Réponds simplement à cet e-mail, je lis tout.',
    'Ayoub\nHéritage Musulman',
  ];
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#222;">
${lignes.map((l) => l === url
    ? `<p style="margin:0 0 14px;"><a href="${url}">${url.replace('https://', '')}</a></p>`
    : `<p style="margin:0 0 14px;">${l.replace(/\n/g, '<br>')}</p>`).join('\n')}
</body></html>`;
  return {
    subject: 'Ton compte Héritage Musulman est prêt',
    html,
    text: lignes.join('\n\n'),
    senderName: 'Ayoub · Héritage Musulman',
  };
}

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
    subject: 'Ton accès complet ferme ' + quandFr(finMs).mot,
    html: coquille(
      'Ce que tu gardes, et ce qui se referme.',
      `
      <p style="${p}">${salut}</p>
      <h1 style="${h1}">Il te reste un jour<br>d'accès complet.</h1>
      <p style="${p}">${quandFr(finMs).heure ? (quandFr(finMs).mot === 'ce soir' ? 'Ce soir' : "Aujourd'hui") + ', vers ' + quandFr(finMs).heure : 'Demain, ' + dateFr(finMs)}, ton compte redevient gratuit. Rien ne sera perdu de ce que tu as appris — mais le rythme change.</p>
      ${colonnes(
        ['Toute ta progression, définitivement', 'Al-Fâtiha et Al-Ikhlâs en entier', 'Une partie de Quiz par jour', 'Une partie de Blind Test par jour'],
        ['Le jeu sur les 36 autres sourates', 'Le Quiz sans limite', 'Le Blind Test sans limite']
      )}
      <p style="${p}">Si tu veux garder l'accès entier, c'est maintenant qu'il faut le dire — demain le site aura déjà changé.</p>
      ${PRIX}
      ${bouton(lien('trial_d1', 'subscription'), 'Garder l\'accès complet')}
      <p style="${petit}padding-top:20px;">Résiliable en un clic, satisfait ou remboursé 14 jours.</p>
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
        ['Une partie de Quiz par jour', 'Une partie de Blind Test par jour', 'Al-Fâtiha et Al-Ikhlâs, toujours'],
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

/* ── Réouverture — campagne unique vers les membres d'avant ──

   Pas un des trois e-mails de la séquence : ceux-là parlent d'un essai ouvert à
   l'inscription, ce que ces membres n'ont jamais eu. Leur envoyer « ton accès
   ferme demain » serait faux, et se découvrirait au premier clic.

   Celui-ci n'est vrai que parce que la fenêtre existe vraiment dans le code —
   voir HM_REOPEN_START dans src/app.jsx. L'angle est là : c'est déjà actif,
   il n'y a rien à faire, rien à saisir. */
function emailReouverture(finTexte) {
  return {
    subject: 'On t\'a rouvert tout le site jusqu\'à ' + finTexte,
    html: coquille(
      'C\'est déjà actif sur ton compte — rien à faire, aucune carte.',
      `
      <p style="${p}">As-salāmu ʿalaykum,</p>
      <h1 style="${h1}">Tout le site t'est ouvert<br>jusqu'à <span style="color:${OR_CLAIR};">${finTexte}</span>.</h1>
      <p style="${p}">Tu as créé un compte sur Héritage Musulman, mais l'accès complet ne s'est jamais ouvert pour toi. C'est réparé : <strong style="color:${TEXTE};">tout est déverrouillé sur ton compte dès maintenant</strong>. Rien à faire, rien à saisir, aucune carte bancaire.</p>
      ${colonnes(
        ['Le Juz ʿAmma complet — 38 sourates mot à mot', 'Les 740 questions, du Débutant à l\'Avancé', 'Les 114 sourates du Blind Test', 'Aucune limite quotidienne'],
        [],
        'CE QUI EST OUVERT'
      )}
      <p style="${p}">Si tu ne fais qu'une seule chose : <strong style="color:${TEXTE};">Al-Fâtiha, mot à mot</strong>. Quatre minutes. Tu la récites dans chaque prière — tu ne la réciteras plus jamais de la même façon.</p>
      ${bouton(lien('reouverture', 'comprendre'), 'Ouvrir Al-Fâtiha')}
      <p style="${petit}padding-top:22px;">Après ${finTexte}, ton compte redevient gratuit et ta progression reste intacte. Si tu veux garder l'accès entier :</p>
      ${PRIX}
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
      sender: message.senderName ? { ...SENDER, name: message.senderName } : SENDER,
      replyTo: { email: REPLY_TO, name: message.senderName || SENDER.name },
      to: [prenom ? { email: destinataire, name: prenom } : { email: destinataire }],
      subject: message.subject,
      htmlContent: message.html,
      // Une version texte : un message HTML seul est un signal « marketing ».
      ...(message.text ? { textContent: message.text } : {}),
      ...(message.headers ? { headers: message.headers } : {}),
    }),
  });

  if (!r.ok) {
    const corps = await r.text().catch(() => '');
    throw new Error('Brevo ' + r.status + ' : ' + corps.slice(0, 200));
  }
  return r.json().catch(() => ({}));
}

/* ── Bienvenue en retard (envoi unique, 21/11/2026) ──
   Du 14/11 12:16 au 20/11 07:46 (UTC), une apostrophe droite dans ce fichier
   l'a rendu illisible pour Node : aucune bienvenue n'est partie, 34 comptes
   sans e-mail, dont ceux venus du Reel Instagram. Envoyé une seule fois par le
   cron (fenêtre de dates fixe + drapeau mails.welcome).
   À la demande d'Ayoub, ce mail dit aussi POURQUOI le site n'est pas
   entièrement gratuit. Règle tenue : ce n'est jamais l'abonnement qui est
   récompensé, c'est l'apprentissage — le site n'en est que le moyen. */
function emailBienvenueRattrapage(prenom) {
  const salut = prenom ? `As-salāmu ʿalaykum ${prenom},` : 'As-salāmu ʿalaykum,';
  const urlCmp = lien('bienvenue_rattrapage', 'comprendre');
  const urlAbo = lien('bienvenue_rattrapage', 'subscription');
  const lignes = [
    salut,
    'Bārakallāhu fīk d’avoir rejoint Héritage Musulman. Chaque personne qui s’inscrit me donne un peu plus de force pour continuer ce projet.',
    'Ton compte est gratuit et le reste : chaque jour une partie de Quiz et une de Blind Test, Al-Fâtiha et Al-Ikhlâs en entier dans Comprendre, et l’écoute mot à mot de toutes les sourates. Ta progression est sauvegardée.',
    'Si tu ne sais pas par où commencer : Al-Fâtiha, mot à mot. Tu la récites dans chaque prière, et en quatre minutes tu vois ce que chaque mot veut dire.',
    urlCmp,
    '<b>Pourquoi tout n’est pas gratuit</b>',
    'Je préfère te le dire franchement. Derrière Héritage Musulman, il n’y a pas une grande entreprise : il y a un musulman qui porte ce projet seul. Le site est sans publicité, et ce sont les abonnements qui le font vivre.',
    'Chaque abonnement sert directement à l’améliorer : de nouvelles sourates à comprendre, de nouveaux quiz, de nouvelles activités. S’abonner, c’est aussi soutenir un musulman qui entreprend, plutôt qu’une grande plateforme.',
    'Et pour ce que ça apporte, c’est sans doute l’un des meilleurs investissements que tu puisses faire : 29,99 € pour un an, soit 2,50 € par mois, pour comprendre mot à mot les sourates que tu récites chaque jour, dans chaque prière.',
    'Le Prophète ﷺ a dit : « Quiconque emprunte un chemin en quête de science, Allah lui facilitera par là un chemin vers le Paradis. » (Muslim 2699). Ce n’est pas l’abonnement qui est récompensé, c’est l’effort d’apprendre. Le site n’est qu’un moyen de le rendre plus simple, chaque jour.',
    urlAbo,
    'Sans engagement, annulable à tout moment, et remboursé sous 14 jours si ça ne te convient pas. Et si tu préfères rester sur la version gratuite, elle est là pour ça.',
    'Une question pour moi : qu’est-ce qui t’a amené sur le site ? Réponds simplement à cet e-mail, je lis tout.',
    'Ayoub\nHéritage Musulman',
  ];
  const para = (l) => {
    if (l === urlCmp) return `<p style="margin:0 0 14px;"><a href="${urlCmp}">Commencer par Al-Fâtiha</a></p>`;
    if (l === urlAbo) return `<p style="margin:0 0 14px;"><a href="${urlAbo}">Voir l’abonnement</a></p>`;
    return `<p style="margin:0 0 14px;">${l.replace(/\n/g, '<br>')}</p>`;
  };
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#222;">
${lignes.map(para).join('\n')}
</body></html>`;
  return {
    subject: 'Ton compte Héritage Musulman est prêt',
    html,
    text: lignes.map((l) => l.replace(/<\/?b>/g, '')).join('\n\n'),
    senderName: 'Ayoub · Héritage Musulman',
  };
}

/* ── Offre de lancement : 4,99 €/mois jusqu'au dimanche 22/11 minuit ──
   Envoyé UNE fois (drapeau mails.offreLancement) aux inscrits depuis le 19/11
   (Reel Instagram) qui ne sont pas Pro, à la demande d'Ayoub (21/11/2026).
   L'échéance est réelle : le mensuel passe à 7,90 € le lundi 23/11.
   Personnalisé : celui qui a déjà joué voit ce qu'il a déjà fait ; celui qui
   n'a pas joué reçoit une invitation à essayer. Même écriture « personne à
   personne » que la bienvenue : pas de gabarit, deux liens texte. */
function emailOffreLancement(prenom, mots) {
  const salut = prenom ? `As-salāmu ʿalaykum ${prenom},` : 'As-salāmu ʿalaykum,';
  const urlSite = lien('offre_lancement', 'comprendre');
  const urlPaye = SITE + '/?utm_source=email&utm_medium=lifecycle&utm_campaign=offre_lancement&reprendre=monthly#comprendre';
  const debut = mots > 0
    ? `Tu as commencé Comprendre le Coran il y a quelques jours, et tu as déjà reconnu ${mots} mot${mots > 1 ? 's' : ''} du Coran. Bārakallāhu fīk, c’est un vrai début.`
    : 'Tu as créé ton compte il y a quelques jours, mais tu n’as pas encore essayé Comprendre le Coran. Ça prend trois minutes, et c’est gratuit.';
  const lignes = [
    salut,
    debut,
    'Chaque jour, tu récites Al-Fâtiha au moins 17 fois dans tes prières obligatoires. Imagine comprendre chaque mot, puis chaque sourate courte que tu récites après : Al-Ikhlâs, Al-Falaq, An-Nâs, Al-Kawthar, Al-‘Asr…',
    urlSite,
    '<b>Jusqu’à dimanche minuit : l’abonnement à 4,99 € par mois</b>',
    'C’est l’offre de lancement du site. Dès lundi, le mensuel passe à 7,90 €. Si tu t’abonnes avant, tu gardes 4,99 € tant que ton abonnement reste actif.',
    'Ce que ça t’ouvre : les 38 sourates du Juz ‘Amma en mot à mot, avec l’audio (plus d’un mot du Coran sur deux), et le Quiz et le Blind Test sans limite.',
    urlPaye,
    'Sans engagement, annulable en un clic, et remboursé sous 14 jours si ça ne te convient pas.',
    'Le Prophète ﷺ a dit : « Celui qui lit le Coran en butant, et pour qui c’est difficile, aura deux récompenses. » (Bukhari 4937, Muslim 798). Ce n’est pas l’abonnement qui est récompensé, c’est l’effort d’apprendre. Le site est là pour te le rendre plus simple.',
    'Derrière Héritage Musulman, il n’y a que moi : un projet indépendant, sans publicité, que chaque abonnement fait grandir. Une question ? Réponds simplement à cet e-mail, je te réponds moi-même.',
    'Bārakallāhu fīk,\nAyoub\nHéritage Musulman',
  ];
  const para = (l) => {
    if (l === urlSite) return `<p style="margin:0 0 14px;"><a href="${urlSite}">Continuer sur Comprendre le Coran</a></p>`;
    if (l === urlPaye) return `<p style="margin:0 0 14px;"><a href="${urlPaye}"><b>Profiter de 4,99 € par mois</b></a></p>`;
    return `<p style="margin:0 0 14px;">${l.replace(/\n/g, '<br>')}</p>`;
  };
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#222;">
${lignes.map(para).join('\n')}
</body></html>`;
  return {
    subject: 'Comprendre ta prière : 4,99 € jusqu’à dimanche soir',
    html,
    text: lignes.map((l) => l.replace(/<\/?b>/g, '')).join('\n\n'),
    senderName: 'Ayoub · Héritage Musulman',
  };
}

/* ── Rappel du verset du jour ──
   Envoyé UNIQUEMENT aux comptes qui l'ont activé eux-mêmes dans Comprendre
   (users/{uid}.rappel.on), et seulement les jours où ils n'ont pas encore joué.
   Court, sans offre : c'est un rendez-vous, pas une relance commerciale.
   Lien d'arrêt en une touche dans chaque e-mail. */
function emailRappel(prenom, serie) {
  const salut = prenom ? `As-salāmu ʿalaykum ${prenom},` : 'As-salāmu ʿalaykum,';
  const urlSite = lien('rappel', 'comprendre');
  const urlStop = SITE + '/?rappel=off#comprendre';
  const lignes = [
    salut,
    serie > 0
      ? `Hier, c’était ton ${serie === 1 ? '1er' : serie + 'e'} jour d’affilée. Ton verset du jour est prêt : deux minutes pour garder ta série.`
      : 'Ton verset du jour est prêt : deux minutes pour l’écouter mot à mot et retenir ses mots.',
    urlSite,
    'Le Prophète ﷺ a dit : « L’œuvre la plus aimée d’Allah est la plus régulière, même si elle est peu abondante. » (Bukhari 6464, Muslim 783)',
    'Bārakallāhu fīk,\nAyoub\nHéritage Musulman',
  ];
  const para = (l) => l === urlSite
    ? `<p style="margin:0 0 14px;"><a href="${urlSite}"><b>Ouvrir mon verset du jour</b></a></p>`
    : `<p style="margin:0 0 14px;">${l.replace(/\n/g, '<br>')}</p>`;
  const pied = `Tu reçois ce rappel parce que tu l’as activé sur le site. Pour l’arrêter : ${urlStop}`;
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#222;">
${lignes.map(para).join('\n')}
<p style="margin:22px 0 0;font-size:12px;color:#777;">Tu reçois ce rappel parce que tu l’as activé sur le site. <a href="${urlStop}" style="color:#777;">Arrêter les rappels</a></p>
</body></html>`;
  return {
    subject: serie > 0 ? `🔥 ${serie} jour${serie > 1 ? 's' : ''} d’affilée : ton verset du jour t’attend` : 'Ton verset du jour t’attend',
    html,
    text: lignes.join('\n\n') + '\n\n' + pied,
    senderName: 'Ayoub · Héritage Musulman',
  };
}

/* ── Relance d'un paiement non terminé ──
   Envoyé par le webhook Stripe `checkout.session.expired`, 2 h après qu'une
   page de paiement a été ouverte sans être validée (cf. expires_at dans
   api/create-checkout.js). Le 19/11/2026, 28 inscrits en une nuit, une seule
   page de paiement ouverte — 29,99 €, abandonnée — et personne pour le savoir.

   Même écriture que la bienvenue : un mot d'une personne, pas une newsletter.
   Aucune fausse urgence, aucune remise : on rappelle ce qui a été commencé,
   on propose d'aider si quelque chose a coincé, et on le dit une seule fois.
   Le lien porte `reprendre=<plan>` : le site rouvre directement le paiement. */
function emailRelancePaiement(prenom, plan) {
  const salut = prenom ? `As-salāmu ʿalaykum ${prenom},` : 'As-salāmu ʿalaykum,';
  const mensuel = plan === 'monthly';
  const url = SITE + '/?utm_source=email&utm_medium=lifecycle&utm_campaign=relance_paiement&reprendre='
    + (mensuel ? 'monthly' : 'annual') + '#comprendre';
  const prix = mensuel
    ? '7,90 € par mois'
    : '29,99 € pour un an, soit 2,50 € par mois';
  const lignes = [
    salut,
    'Tu as commencé à t’abonner à Héritage Musulman, mais le paiement n’est pas allé jusqu’au bout.',
    'Si quelque chose a coincé (carte refusée, page qui ne charge pas, Apple Pay…) ou si tu as une question sur l’abonnement, réponds simplement à cet e-mail : je te réponds moi-même.',
    'Et si tu veux reprendre là où tu en étais, ce lien rouvre directement le paiement :',
    url,
    'Pour rappel : ' + prix + ', sans engagement, annulable à tout moment, et remboursé sous 14 jours si ça ne te convient pas.',
    'C’est le seul rappel que tu recevras.',
    'Ayoub\nHéritage Musulman',
  ];
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#222;">
${lignes.map((l) => l === url
    ? `<p style="margin:0 0 14px;"><a href="${url}">Reprendre mon abonnement</a></p>`
    : `<p style="margin:0 0 14px;">${l.replace(/\n/g, '<br>')}</p>`).join('\n')}
</body></html>`;
  return {
    subject: 'Ton abonnement n’est pas allé au bout',
    html,
    text: lignes.join('\n\n'),
    senderName: 'Ayoub · Héritage Musulman',
  };
}

/* ── E-mail du vendredi (Jumu’a) ──
   Demandé par Ayoub le 27/11/2026 : chaque vendredi, un mot aux inscrits sans
   abonnement pour souhaiter un bon vendredi et donner envie de revenir
   apprendre. Pas une relance commerciale : un rendez-vous, comme le rappel.
   Une seule ligne parle de Pro, en P.-S., sans prix barré ni urgence.
   Lien d'arrêt personnel (signé) dans chaque envoi + en-tête List-Unsubscribe.
   Le hadith change chaque semaine ; tous sont authentiques et référencés. */
const JUMUA_HADITHS = [
  { t: 'Le meilleur jour sur lequel le soleil se soit levé est le vendredi.', s: 'Muslim 854' },
  { t: 'Le meilleur d’entre vous est celui qui apprend le Coran et l’enseigne.', s: 'Bukhari 5027' },
  { t: 'L’œuvre la plus aimée d’Allah est la plus régulière, même si elle est peu abondante.', s: 'Bukhari 6464, Muslim 783' },
  { t: 'Celui qui emprunte un chemin à la recherche d’une science, Allah lui facilite par cela un chemin vers le Paradis.', s: 'Muslim 2699' },
];
function emailJumua(prenom, mots, semaine, urlStop) {
  const salut = prenom ? `As-salāmu ʿalaykum ${prenom},` : 'As-salāmu ʿalaykum,';
  const url = lien('jumua', 'comprendre');
  const h = JUMUA_HADITHS[Math.abs(semaine) % JUMUA_HADITHS.length];
  const progres = mots > 0
    ? `Tu as déjà appris ${mots} mot${mots > 1 ? 's' : ''} du Coran sur Héritage Musulman. Ils restent si on les revoit : prends quelques minutes aujourd’hui pour ton verset du jour et pour en ajouter de nouveaux.`
    : 'Tu n’as pas encore commencé « Comprendre le Coran » : lance-toi avec Al-Fâtiha, la sourate que tu récites à chaque prière. Deux minutes suffisent pour comprendre ses premiers mots.';
  const lignes = [
    salut,
    'Jumu’a mubārak ! Qu’Allah accepte tes prières et ton vendredi.',
    progres,
    url,
    `Le Prophète ﷺ a dit : « ${h.t} » (${h.s})`,
    'Le verset du jour, Al-Fâtiha, Al-Ikhlâs et une partie par jour de Quiz et de Blind Test restent gratuits. P.-S. : si tu veux comprendre toutes les sourates de ta prière, Héritage Pro les ouvre toutes.',
    'Bon vendredi,\nAyoub\nHéritage Musulman',
  ];
  const para = (l) => l === url
    ? `<p style="margin:0 0 14px;"><a href="${url}"><b>Continuer mon apprentissage</b></a></p>`
    : `<p style="margin:0 0 14px;">${l.replace(/\n/g, '<br>')}</p>`;
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"></head>
<body style="margin:0;padding:16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#222;">
${lignes.map(para).join('\n')}
<p style="margin:22px 0 0;font-size:12px;color:#777;">Tu reçois cet e-mail du vendredi parce que tu as un compte sur Héritage Musulman. <a href="${urlStop}" style="color:#777;">Ne plus recevoir l’e-mail du vendredi</a></p>
</body></html>`;
  return {
    subject: prenom ? `Jumu’a mubārak ${prenom}` : 'Jumu’a mubārak',
    html,
    text: lignes.join('\n\n') + '\n\nNe plus recevoir l’e-mail du vendredi : ' + urlStop,
    senderName: 'Ayoub · Héritage Musulman',
    headers: { 'List-Unsubscribe': `<${urlStop}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' },
  };
}

module.exports = {
  TRIAL_DAYS: 2,
  TRIAL_STOP,
  emailBienvenue,
  emailBienvenueGratuit,
  emailReouverture,
  emailDernierJour,
  emailFin,
  emailRelancePaiement,
  emailBienvenueRattrapage,
  emailOffreLancement,
  emailRappel,
  emailJumua,
  envoyer,
  dateFr,
};

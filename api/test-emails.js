/* Envoi d'essai des trois e-mails vers une adresse choisie.

   Sert à vérifier le rendu réel — Gmail, Outlook, mobile — et l'arrivée en
   boîte de réception plutôt qu'en indésirables. Un aperçu dans un navigateur ne
   prouve ni l'un ni l'autre : les clients de messagerie réécrivent le HTML, et
   la délivrabilité ne se voit qu'à l'arrivée.

   Protégé par le même secret que le cron. L'adresse est passée en paramètre et
   non codée en dur : le dépôt est public, une adresse personnelle écrite ici
   serait offerte aux robots collecteurs.

   Reste déployé volontairement : chaque modification des gabarits devra être
   revérifiée dans une vraie boîte, et reconstruire ce point d'entrée à ce
   moment-là serait du travail refait. */

const { emailBienvenue, emailDernierJour, emailFin, envoyer, TRIAL_DAYS } = require('./_emails');

module.exports = async (req, res) => {
  const secret = process.env.CRON_SECRET;
  const recu = (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!secret || recu !== secret) return res.status(401).json({ error: 'Non autorisé' });

  const to = req.query.to;
  if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return res.status(400).json({ error: 'Paramètre ?to= manquant ou invalide' });
  }

  const prenom = req.query.prenom || '';
  const fin = Date.now() + TRIAL_DAYS * 86400000;

  const lot = [
    ['bienvenue', emailBienvenue(prenom, fin)],
    ['dernier-jour', emailDernierJour(prenom, fin)],
    ['fin', emailFin(prenom)],
  ];

  const envoyes = [];
  const erreurs = [];
  const liens = [];
  for (const [nom, message] of lot) {
    /* On renvoie l'URL du bouton avec chaque envoi. Sans elle, vérifier qu'un
       lien est correct oblige à ouvrir une boîte de réception, et on ne sait
       même pas si le déploiement en cours porte bien la version qu'on teste. */
    const m = message.html.match(/https:\/\/heritage-musulman\.com[^"]+/);
    if (m) liens.push(nom + ' → ' + m[0]);
    try {
      await envoyer(to, prenom, message);
      envoyes.push(nom + ' — ' + message.subject);
    } catch (e) {
      erreurs.push(nom + ' : ' + e.message);
    }
  }

  res.status(erreurs.length ? 500 : 200).json({ to, envoyes, liens, erreurs });
};

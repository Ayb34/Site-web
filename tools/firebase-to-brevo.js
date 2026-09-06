/* Convertit un export Firebase Auth en CSV importable dans Brevo.
 *
 *   firebase auth:export users.json --format=json --project heritage-musulman
 *   node tools/firebase-to-brevo.js users.json                → tous les comptes
 *   node tools/firebase-to-brevo.js users.json 2026-07-31     → seulement ceux créés après cette date
 *
 * Le fichier d'entrée contient les EMPREINTES DE MOTS DE PASSE : il ne sort
 * jamais du poste, ne va jamais dans Git, et se supprime après usage. La sortie,
 * elle, ne contient que ce dont Brevo a besoin.
 */
const fs = require('fs');

const [, , input, since] = process.argv;
if (!input) {
  console.error('Usage : node tools/firebase-to-brevo.js <export.json> [AAAA-MM-JJ]');
  process.exit(1);
}

const users = JSON.parse(fs.readFileSync(input, 'utf8')).users || [];
const seuil = since ? Date.parse(since) : 0;
if (since && isNaN(seuil)) {
  console.error('Date invalide : ' + since + ' (format attendu : 2026-07-31)');
  process.exit(1);
}

/* Une adresse en double dans Brevo n'est pas une erreur — l'import écrase — mais
   elle fausse le décompte qu'on affiche à la fin. */
const vus = new Set();
const lignes = [];
let sansEmail = 0, tropAnciens = 0, doublons = 0;

users.forEach(function (u) {
  if (!u.email) { sansEmail += 1; return; }
  const cree = Number(u.createdAt || 0);
  if (cree < seuil) { tropAnciens += 1; return; }
  const email = u.email.trim().toLowerCase();
  if (vus.has(email)) { doublons += 1; return; }
  vus.add(email);

  /* Le prénom sert au « As-salâmu 'alaykum {{ PRENOM }} » : sans lui, la
     formule doit rester correcte toute seule — d'où la colonne vide plutôt
     qu'un « cher membre » qui sonnerait faux une fois sur deux. */
  const prenom = (u.displayName || '').trim().split(/\s+/)[0] || '';
  const date = cree ? new Date(cree).toISOString().slice(0, 10) : '';

  lignes.push([email, prenom, date].map(csv).join(','));
});

function csv(v) {
  const s = String(v == null ? '' : v);
  return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

const sortie = 'EMAIL,PRENOM,DATE_INSCRIPTION\n' + lignes.join('\n') + '\n';
const nom = since ? 'brevo-nouveaux.csv' : 'brevo-tous.csv';
fs.writeFileSync(nom, sortie, 'utf8');

console.log('Écrit : ' + nom);
console.log('  ' + lignes.length + ' contacts');
if (tropAnciens) console.log('  ' + tropAnciens + ' ignorés (inscrits avant ' + since + ')');
if (sansEmail) console.log('  ' + sansEmail + ' ignorés (aucune adresse)');
if (doublons) console.log('  ' + doublons + ' doublons écartés');

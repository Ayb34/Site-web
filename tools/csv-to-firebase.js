/* Convertit un CSV d'adresses en fichier d'import Firebase Authentication.
 *
 *   node tools/csv-to-firebase.js contacts.csv
 *   firebase auth:import firebase-import.json --project heritage-musulman
 *
 * Le CSV doit avoir une colonne d'adresses. La colonne est trouvée par son
 * intitulé (EMAIL, E-MAIL, MAIL…) ; à défaut, la première colonne contenant un
 * « @ » est utilisée.
 *
 * Les comptes créés n'ont PAS de mot de passe : la personne devra passer par
 * « mot de passe oublié » pour en définir un. C'est volontaire — inventer un
 * mot de passe pour quelqu'un serait à la fois inutilisable et malvenu.
 */
const fs = require('fs');
const crypto = require('crypto');

const [, , input, out] = process.argv;
if (!input) {
  console.error('Usage : node tools/csv-to-firebase.js <fichier.csv> [sortie.json]');
  process.exit(1);
}
const sortie = out || 'firebase-import.json';

const lignes = fs.readFileSync(input, 'utf8').split(/\r?\n/).filter(function (l) { return l.trim(); });
if (!lignes.length) { console.error('Fichier vide.'); process.exit(1); }

/* Découpage CSV minimal mais correct : gère les champs entre guillemets et les
   virgules qu'ils contiennent. Une adresse avec une virgule décalerait sinon
   toutes les colonnes. */
function decoupe(ligne) {
  const out = [];
  let champ = '', dansGuillemets = false;
  for (let i = 0; i < ligne.length; i++) {
    const c = ligne[i];
    if (dansGuillemets) {
      if (c === '"' && ligne[i + 1] === '"') { champ += '"'; i++; }
      else if (c === '"') dansGuillemets = false;
      else champ += c;
    } else if (c === '"') dansGuillemets = true;
    else if (c === ',' || c === ';') { out.push(champ); champ = ''; }
    else champ += c;
  }
  out.push(champ);
  return out.map(function (s) { return s.trim(); });
}

const entete = decoupe(lignes[0]);
let colonne = entete.findIndex(function (h) { return /^(e?-?mail|email)$/i.test(h); });
let debut = 1;
if (colonne < 0) {
  // Pas d'en-tête reconnu : on cherche une colonne contenant un « @ », et on
  // traite alors la première ligne comme une donnée, pas comme un titre.
  colonne = entete.findIndex(function (v) { return v.includes('@'); });
  debut = colonne >= 0 ? 0 : 1;
}
if (colonne < 0) {
  console.error('Aucune colonne d adresse trouvee. En-tete lu : ' + entete.join(' | '));
  process.exit(1);
}

const vus = new Set();
const users = [];
let invalides = 0, doublons = 0;

for (let i = debut; i < lignes.length; i++) {
  const brut = (decoupe(lignes[i])[colonne] || '').trim().toLowerCase();
  if (!brut) continue;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(brut)) { invalides += 1; console.warn('  ignoree (adresse invalide) : ' + brut); continue; }
  if (vus.has(brut)) { doublons += 1; continue; }
  vus.add(brut);

  /* UID dérivé de l'adresse : relancer l'import ne crée pas de doublons, il
     retombe sur le même identifiant. Firebase refusera alors l'entrée au lieu
     de créer un second compte pour la même personne. */
  const uid = crypto.createHash('sha256').update(brut).digest('hex').slice(0, 28);

  users.push({
    localId: uid,
    email: brut,
    emailVerified: false,
    /* Pas de passwordHash : compte sans mot de passe, à définir par la personne
       via « mot de passe oublié ». */
  });
}

fs.writeFileSync(sortie, JSON.stringify({ users: users }, null, 2), 'utf8');

console.log('Ecrit : ' + sortie);
console.log('  ' + users.length + ' comptes a importer');
if (doublons) console.log('  ' + doublons + ' doublons ecartes');
if (invalides) console.log('  ' + invalides + ' adresses invalides ecartees');
console.log('');
console.log('Etape suivante :');
console.log('  firebase auth:import ' + sortie + ' --project heritage-musulman');

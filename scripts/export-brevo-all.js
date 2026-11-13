// Export de TOUS les comptes Firebase Auth → brevo-tous.csv (ignoré par Git).
// Lecture seule. Colonnes prêtes pour un import Brevo, avec de quoi segmenter :
// PRO (abonné ou non) et DERNIERE_CONNEXION (pour cibler les inactifs).
//   node scripts/export-brevo-all.js
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

admin.initializeApp({
  credential: admin.credential.cert(require('../heritage-musulman-firebase-adminsdk-fbsvc-e932fdeab5.json')),
});
const db = admin.firestore();

function csv(v) {
  const s = String(v == null ? '' : v);
  return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
const day = (t) => (t ? new Date(t).toISOString().slice(0, 10) : '');

(async () => {
  let users = [];
  let page = await admin.auth().listUsers(1000);
  users = users.concat(page.users);
  while (page.pageToken) {
    page = await admin.auth().listUsers(1000, page.pageToken);
    users = users.concat(page.users);
  }

  const seen = new Set();
  const rows = [];
  let noEmail = 0, dup = 0, pro = 0, disabled = 0;
  for (const u of users) {
    if (!u.email) { noEmail++; continue; }
    if (u.disabled) { disabled++; continue; }
    const email = u.email.trim().toLowerCase();
    if (seen.has(email)) { dup++; continue; }
    seen.add(email);
    const doc = await db.collection('users').doc(u.uid).get();
    const d = doc.exists ? doc.data() : {};
    const isPro = d.isPro === true;
    if (isPro) pro++;
    // Prénom utilisé dans « As-salâmu 'alaykum {{ PRENOM }} » : seulement s'il
    // ressemble à un prénom (lettres, 2 à 20 caractères), sinon vide.
    let prenom = (u.displayName || d.displayName || '').trim().split(/\s+/)[0] || '';
    if (!/^[\p{L}][\p{L}'-]{1,19}$/u.test(prenom)) prenom = '';
    else prenom = prenom.charAt(0).toLocaleUpperCase('fr') + prenom.slice(1).toLocaleLowerCase('fr');
    rows.push([email, prenom, day(u.metadata.creationTime), isPro ? 'oui' : 'non', day(u.metadata.lastSignInTime)].map(csv).join(','));
  }

  const out = path.join(__dirname, '..', 'brevo-tous.csv');
  fs.writeFileSync(out, 'EMAIL,PRENOM,DATE_INSCRIPTION,PRO,DERNIERE_CONNEXION\n' + rows.join('\n') + '\n', 'utf8');

  const now = Date.now();
  const inactive30 = rows.filter((r) => { const last = r.split(',')[4]; return last && now - Date.parse(last) > 30 * 864e5; }).length;
  console.log('Comptes Firebase Auth : ' + users.length);
  console.log('Exportés              : ' + rows.length + ' (dont Pro : ' + pro + ')');
  console.log('Avec prénom           : ' + rows.filter((r) => r.split(',')[1]).length);
  console.log('Inactifs > 30 jours   : ' + inactive30);
  console.log('Écartés : sans email ' + noEmail + ', désactivés ' + disabled + ', doublons ' + dup);
  console.log('Fichier : ' + out);
  process.exit(0);
})().catch((e) => { console.error('Erreur:', e.message); process.exit(1); });

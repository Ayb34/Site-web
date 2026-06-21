// Export emails Firebase Auth (non-Pro) → contacts.csv pour import Brevo
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('../heritage-musulman-firebase-adminsdk-fbsvc-e932fdeab5.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function listAllUsers() {
  let users = [];
  let result = await admin.auth().listUsers(1000);
  users = users.concat(result.users);
  while (result.pageToken) {
    result = await admin.auth().listUsers(1000, result.pageToken);
    users = users.concat(result.users);
  }
  return users;
}

async function main() {
  const users = await listAllUsers();
  console.log(`Total comptes Firebase Auth : ${users.length}`);

  const rows = [['EMAIL']];
  let skippedPro = 0;
  let skippedNoEmail = 0;

  for (const u of users) {
    if (!u.email) {
      skippedNoEmail++;
      continue;
    }
    const doc = await db.collection('users').doc(u.uid).get();
    const data = doc.exists ? doc.data() : {};
    if (data.isPro === true) {
      skippedPro++;
      continue;
    }
    rows.push([u.email]);
  }

  const csv = rows.map(r => r.join(',')).join('\n');
  const outPath = path.join(__dirname, '..', 'contacts.csv');
  fs.writeFileSync(outPath, csv, 'utf8');

  console.log(`Exclus (Pro) : ${skippedPro}`);
  console.log(`Exclus (sans email) : ${skippedNoEmail}`);
  console.log(`Contacts exportés : ${rows.length - 1}`);
  console.log(`Fichier : ${outPath}`);
  process.exit(0);
}

main().catch(err => {
  console.error('Erreur:', err);
  process.exit(1);
});

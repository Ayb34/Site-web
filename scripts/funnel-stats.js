/* Entonnoir de l'offre Pro : vues → clics → page Stripe, par endroit.
   Lit users/{uid}.funnel (écrit par hmFunnel dans src/app.jsx depuis le 20/11/2026).
   Usage : node scripts/funnel-stats.js  (clé admin Firebase locale, jamais commitée) */
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const cle = fs.readdirSync(path.join(__dirname, '..')).find((f) => /firebase-adminsdk.*\.json$/.test(f));
admin.initializeApp({ credential: admin.credential.cert(require(path.join(__dirname, '..', cle))) });

(async () => {
  const snap = await admin.firestore().collection('users').get();
  const tot = {}, pers = {};
  let avecFunnel = 0, pro = 0;
  snap.forEach((doc) => {
    const d = doc.data();
    if (!d.funnel) return;
    avecFunnel += 1;
    if (d.isPro) pro += 1;
    Object.entries(d.funnel).forEach(([k, v]) => {
      if (k.endsWith('_last')) return;
      tot[k] = (tot[k] || 0) + v;
      pers[k] = (pers[k] || 0) + 1;
    });
  });
  console.log('Comptes avec données d\'entonnoir :', avecFunnel, '· dont Pro :', pro);
  console.log('événement'.padEnd(28), 'fois'.padStart(6), 'personnes'.padStart(10));
  Object.keys(tot).sort().forEach((k) => console.log(k.padEnd(28), String(tot[k]).padStart(6), String(pers[k]).padStart(10)));
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });

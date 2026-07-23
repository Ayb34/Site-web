




const { useState, useEffect, useRef } = React;

/* ─── Affichage prix offre lancement (cohérent partout) ─── */
function OfferPrice({ big = 40, light = false }) {
  var priceColor = light ? '#1a1a1a' : '#f5d76e';
  var subColor   = light ? 'rgba(0,0,0,0.6)' : '#ffffff';
  var mutedColor = light ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.88)';
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7 }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'center', gap:10, flexWrap:'wrap' }}>
        <span style={{ fontFamily:"'Playfair Display', serif", fontWeight:900, fontSize:big, lineHeight:1, color:priceColor, letterSpacing:'-0.5px', textShadow: light ? 'none' : '0 2px 16px rgba(200,167,39,0.35)' }}>3,99€</span>
        <span style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:Math.round(big*0.36), fontWeight:700, color:subColor }}>le 1<sup style={{ fontSize:'0.6em' }}>er</sup> mois</span>
        <span style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:Math.round(big*0.3), fontWeight:800, color:'#ffffff', background:'linear-gradient(135deg,#6ee79a,#22c55e)', borderRadius:30, padding:'3px 11px', letterSpacing:'0.02em', boxShadow:'0 2px 12px rgba(34,197,94,0.35)' }}>−50%</span>
      </div>
      <div style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:Math.round(big*0.33), fontWeight:600, color:mutedColor }}>
        puis <span style={{ textDecoration:'line-through', opacity:0.85 }}>7,99€</span>/mois · sans engagement
      </div>
    </div>
  );
}

/* ─── Vrai compte à rebours offre (48h par utilisateur, persistant) ─── */
function getOfferDeadline() {
  try {
    var k = 'hm_offer_deadline';
    var v = localStorage.getItem(k);
    var now = Date.now();
    if (!v || isNaN(parseInt(v, 10)) || parseInt(v, 10) < now) {
      var hours = 30 + Math.random() * 18; // départ aléatoire entre 30h et 48h
      var dl = now + Math.round(hours * 3600 * 1000);
      localStorage.setItem(k, String(dl));
      return dl;
    }
    return parseInt(v, 10);
  } catch (e) {
    return Date.now() + 48 * 3600 * 1000;
  }
}

function OfferCountdown({ compact = false }) {
  var [deadline] = React.useState(getOfferDeadline);
  var [now, setNow] = React.useState(Date.now());
  React.useEffect(function () {
    var id = setInterval(function () { setNow(Date.now()); }, 1000);
    return function () { clearInterval(id); };
  }, []);
  var left = Math.max(0, deadline - now);
  var h = Math.floor(left / 3600000);
  var m = Math.floor((left % 3600000) / 60000);
  var s = Math.floor((left % 60000) / 1000);
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
  var box = {
    fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900,
    fontSize: compact ? 13 : 15, color: '#fff', background: 'rgba(0,0,0,0.28)',
    borderRadius: 7, padding: compact ? '2px 7px' : '4px 9px', letterSpacing: '0.04em',
    minWidth: compact ? 30 : 36, textAlign: 'center', display: 'inline-block'
  };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.32)', borderRadius: 30, padding: compact ? '5px 12px' : '7px 16px' }}>
      <span style={{ fontSize: compact ? 12 : 13 }}>⏳</span>
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: compact ? 11.5 : 12.5, fontWeight: 700, color: '#ff8a8a', letterSpacing: '0.04em' }}>
        Offre −50% · fin dans
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
        <span style={box}>{pad(h)}</span>
        <span style={{ color: '#ff8a8a', fontWeight: 900 }}>:</span>
        <span style={box}>{pad(m)}</span>
        <span style={{ color: '#ff8a8a', fontWeight: 900 }}>:</span>
        <span style={box}>{pad(s)}</span>
      </span>
    </div>
  );
}

/* ─── Logo image ─── */
function CrescentLogo({ size = 32 }) {
  return (
    <img
      src="uploads/logo.png"
      alt="Héritage Musulman"
      style={{
        width: size, height: size,
        objectFit: 'contain', display: 'block', opacity: "1"
      }} />);


}

/* ─── SVG: Star icon ─── */
function StarIcon({ size = 20, color = '#c8a727' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z" />
    </svg>);

}

/* ─── Islamic Arabesque SVG ─── */
function ArabesqueDivider({ color = 'rgba(200,167,39,0.25)' }) {
  return (
    <svg width="120" height="24" viewBox="0 0 120 24" fill="none" style={{ display: 'block', margin: '0 auto' }}>
      <path d="M60 12 C50 6 40 6 30 12 C20 18 10 18 0 12" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M60 12 C70 6 80 6 90 12 C100 18 110 18 120 12" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="60" cy="12" r="3" fill={color} />
      <circle cx="30" cy="12" r="1.5" fill={color} />
      <circle cx="90" cy="12" r="1.5" fill={color} />
    </svg>);

}

/* --- Auth Context --- */
const AuthContext = React.createContext(null);
function useAuth() { return React.useContext(AuthContext); }

/* ── Countdown 48h — expire depuis la première visite ── */
function useLaunchCountdown() {
  function getDeadline() {
    var stored = localStorage.getItem('__launchDeadline');
    if (stored) return parseInt(stored, 10);
    var dl = Date.now() + 48 * 60 * 60 * 1000;
    localStorage.setItem('__launchDeadline', dl);
    return dl;
  }
  function fmt() {
    var diff = Math.max(0, getDeadline() - Date.now());
    var h = Math.floor(diff / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    var pad = function(n){ return n < 10 ? '0' + n : '' + n; };
    return h + 'h ' + pad(m) + 'm ' + pad(s) + 's';
  }
  var _s = React.useState(fmt);
  var val = _s[0]; var setVal = _s[1];
  React.useEffect(function() {
    var t = setInterval(function(){ setVal(fmt()); }, 1000);
    return function(){ clearInterval(t); };
  }, []);
  return val;
}

/* ─── Guest Gate Modal (après 1ère action gratuite) ─── */
function GuestGateModal({ onClose, context = 'default' }) {
  const { openAuth, openQuickCheckout } = useAuth();
  const overlayRef = React.useRef(null);
  const GATE_COPY = {
    default: {
      emoji: '🎯',
      title: 'Tu es lancé(e) !',
      sub: <>Crée ton compte gratuit pour continuer<br/>et sauvegarder ta progression.<br/><strong style={{color:'rgba(240,237,230,0.85)'}}>Ça prend 10 secondes.</strong></>,
      feats: ['✓ Score & progression sauvegardés','✓ Reprends là où tu t\'es arrêté','✓ Sans carte bancaire','✓ Accès gratuit pour toujours'],
    },
    blindtest: {
      emoji: '🎵',
      title: 'Beau parcours !',
      sub: <>Crée ton compte gratuit pour continuer<br/>le Blind Test et garder ton score.<br/><strong style={{color:'rgba(240,237,230,0.85)'}}>Ça prend 10 secondes.</strong></>,
      feats: ['✓ Ton score sauvegardé','✓ Reprends quand tu veux','✓ Sans carte bancaire','✓ Accès gratuit pour toujours'],
    },
    quiz: {
      emoji: '🧠',
      title: 'Bien joué !',
      sub: <>Crée ton compte gratuit pour continuer<br/>le quiz et suivre ta progression.<br/><strong style={{color:'rgba(240,237,230,0.85)'}}>Ça prend 10 secondes.</strong></>,
      feats: ['✓ Ta progression sauvegardée','✓ Reprends quand tu veux','✓ Sans carte bancaire','✓ Accès gratuit pour toujours'],
    },
    studio: {
      emoji: '🎬',
      title: 'Ta vidéo est prête !',
      sub: <>Crée ton compte gratuit pour<br/>télécharger ta vidéo.<br/><strong style={{color:'rgba(240,237,230,0.85)'}}>Ça prend 10 secondes.</strong></>,
      feats: ['✓ Télécharge ta vidéo en HD','✓ 1 vidéo offerte, sans carte','✓ Tes créations sauvegardées','✓ Accès gratuit pour toujours'],
    },
    comprendre: {
      emoji: '📖',
      title: 'Continue ton apprentissage',
      sub: <>Crée ton compte gratuit pour continuer<br/>et sauvegarder ta progression.<br/><strong style={{color:'rgba(240,237,230,0.85)'}}>Ça prend 10 secondes.</strong></>,
      feats: ['✓ Toutes les sourates débloquées*','✓ Ta progression sauvegardée','✓ Sans carte bancaire','✓ Accès gratuit pour toujours'],
    },
  };
  const copy = GATE_COPY[context] || GATE_COPY.default;
  React.useEffect(function () {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    if (overlayRef.current) overlayRef.current.scrollTop = 0;
    return function () {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);
  return (
    <div ref={overlayRef} onClick={function(e){ if(e.target===e.currentTarget) onClose(); }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(10px)', zIndex:10000, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'24px 20px', overflowY:'auto', WebkitOverflowScrolling:'touch', animation:'overlayFade 0.25s ease-out' }}>
      <div style={{ background:'linear-gradient(145deg,#0a1f12,#071510)', border:'1px solid rgba(200,167,39,0.35)', borderRadius:22, padding:'36px 28px', maxWidth:400, width:'100%', margin:'16px auto', textAlign:'center', boxShadow:'0 0 80px rgba(200,167,39,0.12), 0 40px 60px rgba(0,0,0,0.6)', animation:'proPop 0.38s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div style={{ fontSize:44, marginBottom:14 }}>{copy.emoji}</div>
        <h2 style={{ fontFamily:'Cinzel,serif', fontSize:21, color:'#f0ede6', margin:'0 0 10px', lineHeight:1.2 }}>
          {copy.title}
        </h2>
        <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:14, color:'rgba(240,237,230,0.55)', lineHeight:1.7, margin:'0 0 20px' }}>
          {copy.sub}
        </p>
        {/* Avantages compte gratuit */}
        <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'12px 16px', marginBottom:22, textAlign:'left' }}>
          {copy.feats.map(function(f) {
            return <div key={f} style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, color:'rgba(240,237,230,0.65)', marginBottom:6 }}>{f}</div>;
          })}
        </div>
        <button onClick={function(){ openAuth(); onClose(); }}
          style={{ width:'100%', background:'linear-gradient(135deg,#c8a727,#a8891f)', border:'none', color:'#0a1a08', padding:'14px', borderRadius:12, fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:'Plus Jakarta Sans,sans-serif', marginBottom:10, boxShadow:'0 4px 20px rgba(200,167,39,0.35)' }}>
          Créer mon compte — c'est gratuit →
        </button>
        <button onClick={onClose}
          style={{ background:'none', border:'none', color:'rgba(240,237,230,0.28)', fontSize:12, cursor:'pointer', fontFamily:'Plus Jakarta Sans,sans-serif' }}>
          Continuer sans compte (progression non sauvegardée)
        </button>
      </div>
    </div>
  );
}

/* ─── Pro Gate Modal ─── */
function ProGateModal({ onClose, navigate }) {
  const { openQuickCheckout } = useAuth();
  const overlayRef = React.useRef(null);
  React.useEffect(function () {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    if (overlayRef.current) overlayRef.current.scrollTop = 0;
    return function () {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);
  return (
    <div ref={overlayRef} onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.82)', backdropFilter:'blur(10px)', zIndex:10000, display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'24px 20px', overflowY:'auto', WebkitOverflowScrolling:'touch', animation:'overlayFade 0.25s ease-out' }}>
      <div onClick={function(e){ e.stopPropagation(); }} style={{ background:'linear-gradient(145deg,#0a1f12,#071510)', border:'1px solid rgba(200,167,39,0.35)', borderRadius:22, padding:'40px 32px', maxWidth:400, width:'100%', margin:'16px auto', textAlign:'center', boxShadow:'0 0 80px rgba(200,167,39,0.12), 0 40px 60px rgba(0,0,0,0.6)', animation:'proPop 0.38s cubic-bezier(0.34,1.56,0.64,1)' }}>
        {/* Lock icon */}
        <div style={{ width:64, height:64, borderRadius:'50%', background:'rgba(200,167,39,0.1)', border:'1.5px solid rgba(200,167,39,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 20px' }}>🔒</div>

        <h2 style={{ fontFamily:'Cinzel,serif', fontSize:20, color:'#f0ede6', margin:'0 0 10px', lineHeight:1.2 }}>Fonctionnalité Pro</h2>
        <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:14, color:'rgba(240,237,230,0.55)', lineHeight:1.7, margin:'0 0 12px' }}>
          Ce contenu est réservé aux membres Pro.<br/>Débloque <strong style={{color:'#c8a727'}}>tout le site</strong> — Comprendre le Coran, quiz, blind test et studio vidéo.
        </p>
        <div className="pro-gate-feat-list" style={{ display:'flex', flexDirection:'column', gap:6, margin:'0 0 20px', textAlign:'left' }}>
          {['📖 Comprendre le Coran — toutes les sourates mot à mot','🧠 Quiz illimités tous niveaux','🎵 Blind Test — 114 sourates','🎬 Studio vidéo & téléchargement','📅 Nouveau contenu chaque semaine'].map(function(f){
            return React.createElement('div',{key:f,style:{fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:12,color:'rgba(240,237,230,0.7)',display:'flex',alignItems:'center',gap:8}},
              React.createElement('span',{style:{color:'#4ade80',fontWeight:800}},'✓'),f
            );
          })}
        </div>

        {/* Price */}
        <div style={{ background:'rgba(200,167,39,0.07)', border:'1px solid rgba(200,167,39,0.2)', borderRadius:14, padding:'18px 20px', marginBottom:24 }}>
          <div style={{ marginBottom:8 }}>
            {(window.HM_FOUNDER && window.HM_FOUNDER()) ? (
              <OfferPrice big={38} />
            ) : (
              <>
                <span style={{ fontFamily:'Cinzel,serif', fontSize:36, fontWeight:700, color:'#c8a727' }}>7,99€</span>
                <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:14, color:'rgba(240,237,230,0.4)' }}> / mois</span>
              </>
            )}
          </div>
          <ul style={{ listStyle:'none', padding:0, margin:0, textAlign:'left' }}>
            {['✓ Blind Test illimité — tous niveaux','✓ Quiz illimité — Amateur & Avancé','✓ Studio vidéo — téléchargement inclus','✓ Résiliable à tout moment'].map(function(item) {
              return <li key={item} style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:13, color:'rgba(240,237,230,0.65)', marginBottom:7 }}>{item}</li>;
            })}
          </ul>
        </div>

        {/* CTA */}
        <button onClick={function(){ onClose(); openQuickCheckout(); }}
          style={{ width:'100%', background:'linear-gradient(135deg,#c8a727,#a8891f)', border:'none', color:'#fff', padding:'14px', borderRadius:12, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'Plus Jakarta Sans,sans-serif', marginBottom:8, boxShadow:'0 4px 20px rgba(200,167,39,0.3)' }}>
          {(window.HM_FOUNDER && window.HM_FOUNDER()) ? "Passer à Pro — 3,99€ le 1er mois" : "Passer à Pro — 7,99€/mois"}
        </button>
        <div style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.22)', borderRadius:10, padding:'7px 12px', marginBottom:12, display:'flex', alignItems:'center', justifyContent:'center', gap:6, flexWrap:'wrap' }}>
          <span style={{ color:'#4ade80', fontSize:13, flexShrink:0 }}>✓</span>
          <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.70)' }}>Annule quand tu veux</span>
          <span style={{ color:'rgba(255,255,255,0.25)' }}>·</span>
          <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.70)' }}>Remboursé sous 48h</span>
        </div>
        <button onClick={onClose}
          style={{ background:'none', border:'none', color:'rgba(240,237,230,0.3)', fontSize:13, cursor:'pointer', fontFamily:'Plus Jakarta Sans,sans-serif' }}>
          Continuer en gratuit
        </button>
      </div>
    </div>
  );
}

/* --- Auth Modal --- */
function AuthModal({ onClose }) {
  const [tab, setTab] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const { onAuthSuccess } = useAuth();

  const sendReset = async () => {
    if (!email) { setError('Entre ton email pour réinitialiser.'); return; }
    if (!window._auth) { setError('Firebase non configuré.'); return; }
    setLoading(true); setError('');
    try {
      await window._auth.sendPasswordResetEmail(email);
      setForgotSent(true);
    } catch(e) {
      const m = { 'auth/user-not-found': 'Aucun compte avec cet email.', 'auth/invalid-email': 'Email invalide.' };
      setError(m[e.code] || 'Erreur. Réessaie.');
    } finally { setLoading(false); }
  };
  const errorFr = (code) => {
    const m = {
      'auth/email-already-in-use': 'Email déjà utilisé.',
      'auth/invalid-email': 'Email invalide.',
      'auth/weak-password': 'Mot de passe trop court (6 caractères min).',
      'auth/user-not-found': 'Aucun compte avec cet email.',
      'auth/wrong-password': 'Mot de passe incorrect.',
      'auth/invalid-credential': 'Email ou mot de passe incorrect.',
      'auth/too-many-requests': 'Trop de tentatives. Réessaie plus tard.',
    };
    return m[code] || 'Une erreur est survenue.';
  };
  const submit = async () => {
    if (!window._auth) { setError('Firebase non configuré.'); return; }
    setError(''); setLoading(true);
    try {
      if (tab === 'signup') {
        const cred = await window._auth.createUserWithEmailAndPassword(email, password);
        if (name) await cred.user.updateProfile({ displayName: name });
        if (window._ejsSend) window._ejsSend(email, name || cred.user.displayName || 'cher(e) membre');
        onAuthSuccess('signup');
      } else {
        await window._auth.signInWithEmailAndPassword(email, password);
        onAuthSuccess('login');
      }
      onClose();
    } catch(e) { setError(errorFr(e.code)); }
    finally { setLoading(false); }
  };
  const tabBtn = (active) => ({
    flex: 1, padding: '9px', borderRadius: 8, border: 'none', cursor: 'pointer',
    fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, fontWeight: 600,
    background: active ? 'rgba(200,167,39,0.15)' : 'transparent',
    color: active ? '#c8a727' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s'
  });
  const inp = {
    width: '100%', background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
    padding: '13px 16px', color: '#fff', fontSize: 15, marginBottom: 12,
    fontFamily: 'Plus Jakarta Sans, sans-serif', outline: 'none', display: 'block'
  };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }} onClick={onClose}>
      <div className="auth-modal-box" style={{ background: 'linear-gradient(160deg,#0d1f13 0%,#091409 100%)',
        border: '1px solid rgba(200,167,39,0.22)', borderRadius: 22,
        padding: '36px 32px', maxWidth: 420, width: '100%'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="uploads/logo.png" alt="Héritage Musulman" className="auth-modal-logo" style={{ width: 150, height: 150, objectFit: 'contain', display: 'block', margin: '0 auto 8px' }} />
          <h2 style={{ color: '#c8a727', fontSize: 22, fontWeight: 800, margin: 0 }}>
            {tab === 'signup' ? 'Créer un compte' : 'Connexion'}
          </h2>
        </div>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 4, marginBottom: 24 }}>
          <button style={tabBtn(tab === 'signup')} onClick={() => { setTab('signup'); setError(''); }}>Créer un compte</button>
          <button style={tabBtn(tab === 'login')} onClick={() => { setTab('login'); setError(''); }}>Se connecter</button>
        </div>
        {forgotMode ? (
          <>
            {forgotSent ? (
              <div style={{ textAlign: 'center', padding: '12px 0 20px' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📧</div>
                <p style={{ color: '#4ade80', fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Email envoyé !</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.6 }}>
                  Vérifie ta boîte mail (et tes spams). Clique sur le lien pour réinitialiser ton mot de passe.
                </p>
              </div>
            ) : (
              <>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
                  Entre ton email — on t'envoie un lien pour réinitialiser ton mot de passe.
                </p>
                <input type="email" placeholder="Ton email" value={email} onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendReset()} style={inp} />
                {error && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</p>}
                <button onClick={sendReset} disabled={loading} style={{
                  width: '100%', background: 'linear-gradient(135deg,#a8891f,#c4a83a)',
                  border: 'none', color: '#1c1200', padding: '14px', borderRadius: 10,
                  fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
                  fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 12
                }}>{loading ? '…' : 'Envoyer le lien'}</button>
              </>
            )}
            <button onClick={() => { setForgotMode(false); setForgotSent(false); setError(''); }} style={{
              display: 'block', width: '100%', background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.35)', fontSize: 13, cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>← Retour à la connexion</button>
          </>
        ) : (
          <>
            {tab === 'signup' && <input type="text" placeholder="Prénom (optionnel)" value={name} onChange={e => setName(e.target.value)} style={inp} />}
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inp} />
            <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()} style={{...inp, marginBottom: tab === 'login' ? 6 : 18}} />
            {tab === 'login' && (
              <div style={{ textAlign: 'right', marginBottom: 16 }}>
                <button onClick={() => { setForgotMode(true); setError(''); }} style={{
                  background: 'none', border: 'none', color: 'rgba(200,167,39,0.7)',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
                  textDecoration: 'underline'
                }}>Mot de passe oublié ?</button>
              </div>
            )}
            {error && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>{error}</p>}
            <button onClick={submit} disabled={loading} style={{
              width: '100%', background: 'linear-gradient(135deg,#a8891f,#c4a83a)',
              border: 'none', color: '#1c1200', padding: '14px', borderRadius: 10,
              fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: 14
            }}>{loading ? '…' : (tab === 'signup' ? 'Créer mon compte' : 'Se connecter')}</button>
            <button onClick={onClose} style={{
              display: 'block', width: '100%', background: 'none', border: 'none',
              color: 'rgba(255,255,255,0.28)', fontSize: 13, cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>Annuler</button>
          </>
        )}
      </div>
    </div>
  );
}

/* --- Subscription Page --- */
function SubscriptionPage({ navigate }) {
  const { user, openAuth } = useAuth();
  const firstName = user && user.displayName ? user.displayName.split(' ')[0] : null;

  // Guard: non connecté → montrer auth modal + page de présentation
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 20px 40px', textAlign: 'center', background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(200,167,39,0.08) 0%, transparent 70%)' }}>
        <div style={{ fontSize: 52, marginBottom: 20 }}>🔒</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 6, letterSpacing: '-0.5px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Accès Pro
        </h1>
        <div style={{ marginBottom: 10 }}>
          {(window.HM_FOUNDER && window.HM_FOUNDER()) ? (
            <OfferPrice big={30} />
          ) : (
            <>
              <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:22, fontWeight:900, color:'#c8a727' }}>7,99€/mois</span>
              <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, color:'rgba(200,167,39,0.6)', marginLeft:6 }}>· offre lancement</span>
            </>
          )}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 8, maxWidth: 380, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Comprendre le Coran · Quiz illimités · Blind Test complet · Studio vidéo
        </p>
        <p style={{ color: 'rgba(200,167,39,0.7)', fontSize: 13, marginBottom: 32, fontStyle: 'italic', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Crée ton compte gratuitement pour continuer.
        </p>
        <button onClick={openAuth} style={{ background: 'linear-gradient(135deg,#c8a727,#a8891f)', border: 'none', color: '#0a1a08', padding: '16px 40px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 4px 24px rgba(200,167,39,0.35)', marginBottom: 10 }}>
          Créer mon compte — c'est gratuit
        </button>
        <div style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.22)', borderRadius:10, padding:'8px 14px', marginBottom:14, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <span style={{ color:'#4ade80', fontSize:14, flexShrink:0 }}>✓</span>
          <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.72)' }}>Sans engagement — annule quand tu veux en 1 clic</span>
        </div>
        <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)', fontSize: 13, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', textDecoration: 'underline' }}>
          Retour à l'accueil
        </button>
      </div>
    );
  }
  const [showCheckout, setShowCheckout] = React.useState(false);
  const [checkoutLoading, setCheckoutLoading] = React.useState(false);
  const [checkoutError, setCheckoutError] = React.useState(null);
  const checkoutRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const genRef = React.useRef(0);
  const busyRef = React.useRef(false);

  const destroyCheckout = function() {
    if (checkoutRef.current) {
      try { checkoutRef.current.destroy(); } catch (e) {}
      checkoutRef.current = null;
    }
  };

  const openCheckout = async function(method) {
    var myGen = ++genRef.current;
    setCheckoutLoading(true);
    setCheckoutError(null);
    setShowCheckout(true);
    destroyCheckout();
    while (busyRef.current) {
      await new Promise(function (r) { setTimeout(r, 30); });
      if (myGen !== genRef.current) return;
    }
    busyRef.current = true;
    try {
      var stripe = window.Stripe('pk_live_51TVoHLCI24S0XRebTf9xPgcK5lOEAiVaWRXMsWii5u9qGzI661YAxmE9o5AyC0jBZLsqIGh3NiyQNe4pXeUdpkoC00zU3o9AOV');
      var res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: method || 'card', founder: window.HM_FOUNDER && window.HM_FOUNDER() }),
      });
      var data = await res.json();
      if (data.error) throw new Error(data.error);
      if (myGen !== genRef.current) return;
      var checkout = await stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret });
      if (myGen !== genRef.current) { try { checkout.destroy(); } catch (e) {} return; }
      destroyCheckout();
      checkoutRef.current = checkout;
      setCheckoutLoading(false);
      setTimeout(function() {
        if (containerRef.current && checkoutRef.current === checkout) checkout.mount(containerRef.current);
      }, 80);
    } catch(err) {
      if (myGen === genRef.current) { setCheckoutError(err.message); setCheckoutLoading(false); }
    } finally {
      busyRef.current = false;
    }
  };

  const closeCheckout = function() {
    genRef.current++;
    destroyCheckout();
    setShowCheckout(false);
    setCheckoutLoading(false);
    setCheckoutError(null);
  };
  const features = [
    { icon: '🕌', title: 'Quiz islamiques', desc: '200+ questions sur les piliers, prophètes, histoire' },
    { icon: '🎵', title: 'Blind Test Coran', desc: 'Reconnais les sourates à l\'écoute' },
    { icon: '🎬', title: 'Studio Vidéo', desc: 'Crée des clips avec des rappels audio' },
    { icon: '📅', title: 'Nouveau contenu', desc: 'Ajouts chaque semaine incha\'Allah' },
  ];
  return (
    <div className="fade-up sub-page-wrap" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '100px 20px 40px', textAlign: 'center',
      background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(200,167,39,0.08) 0%, transparent 70%)' }}>

      {/* Success badge */}
      <div className="sub-badge-wrap" style={{ position: 'relative', marginBottom: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))',
          border: '2px solid rgba(34,197,94,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto' }}>✓</div>
        <div style={{ position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: '50%',
          background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10 }}>🌙</div>
      </div>

      {/* Title */}
      <h1 className="sub-title" style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 6, letterSpacing: '-0.5px' }}>
        Passe à Pro 🔓
      </h1>
      <p className="sub-welcome" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, marginBottom: 8, maxWidth: 380 }}>
        {firstName ? <><strong style={{ color: '#c8a727' }}>{firstName}</strong>, débloques l'accès complet.</> : 'Débloque l\'accès complet — quiz illimités, blind test, studio.'}
      </p>
      <p className="sub-hadith" style={{ color: 'rgba(200,167,39,0.65)', fontSize: 12, marginBottom: 32, fontStyle: 'italic', maxWidth: 360 }}>
        « Celui qui suit un chemin pour acquérir une connaissance, Allah lui facilite le chemin vers le Paradis. »
      </p>

      {/* Card */}
      <div className="sub-card" style={{ background: 'linear-gradient(160deg, rgba(200,167,39,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(200,167,39,0.3)', borderRadius: 24, padding: '36px 28px',
        maxWidth: 420, width: '100%', marginBottom: 20, backdropFilter: 'blur(10px)',
        boxShadow: '0 0 60px rgba(200,167,39,0.06)' }}>

        {/* Badge */}
        <div style={{ display: 'inline-block', background: 'rgba(200,167,39,0.12)',
          border: '1px solid rgba(200,167,39,0.3)', borderRadius: 30, padding: '4px 14px',
          fontSize: 12, color: '#c8a727', fontWeight: 700, marginBottom: 20, letterSpacing: 0.5 }}>
          {(window.HM_FOUNDER && window.HM_FOUNDER()) ? '🎉 OFFRE LANCEMENT · -50% LE 1ER MOIS' : '✦ ACCÈS COMPLET'}
        </div>

        {/* Price */}
        {(window.HM_FOUNDER && window.HM_FOUNDER()) ? (
          <div style={{ marginBottom: 6 }}><OfferPrice big={52} /></div>
        ) : (
          <div style={{ marginBottom: 6, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4 }}>
            <span className="sub-price" style={{ fontSize: 52, fontWeight: 900, color: '#c8a727', lineHeight: 1 }}>7,99€</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16, marginBottom: 8 }}>/mois</span>
          </div>
        )}
        <div style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.22)', borderRadius:10, padding:'8px 14px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <span style={{ color:'#4ade80', fontSize:15, flexShrink:0 }}>✓</span>
          <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.78)' }}>Sans engagement — annule quand tu veux en 1 clic</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, marginBottom: 20, lineHeight: 1.6 }}>
          Moins d'un café par semaine pour enrichir ton Deen.
        </p>

        {/* Features */}
        <div style={{ marginBottom: 28 }}>
          {features.map(f => (
            <div key={f.icon} style={{ display: 'flex', alignItems: 'flex-start', gap: 12,
              marginBottom: 14, textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10,
                background: 'rgba(200,167,39,0.1)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{f.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => openCheckout('card')}
          className="sub-cta-btn"
          style={{ width: '100%', background: 'linear-gradient(135deg,#c8a727,#a8891f)',
            border: 'none', color: '#0a1a08', padding: '16px', borderRadius: 12,
            fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
            letterSpacing: 0.3, boxShadow: '0 4px 24px rgba(200,167,39,0.25)',
            transition: 'transform 0.15s, box-shadow 0.15s'
          }}
          onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(200,167,39,0.35)'; }}
          onMouseOut={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 24px rgba(200,167,39,0.25)'; }}
        >
          {(window.HM_FOUNDER && window.HM_FOUNDER()) ? "🔓 1er mois à 3,99€ — puis 7,99€/mois" : "🔓 Débloquer l'accès — 7,99€/mois"}
        </button>

        {/* Séparateur */}
        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'14px 0' }}>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
          <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, color:'rgba(255,255,255,0.25)' }}>ou</span>
          <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
        </div>

        {/* PayPal — paiement unique 1 mois */}
        <button
          onClick={() => openCheckout('paypal')}
          style={{ width:'100%', background:'#FFC439', border:'none', color:'#003087', padding:'14px', borderRadius:12,
            fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:'Plus Jakarta Sans, sans-serif',
            boxShadow:'0 4px 20px rgba(255,196,57,0.35)', transition:'transform 0.15s, box-shadow 0.15s',
            display:'flex', alignItems:'center', justifyContent:'center', gap:10
          }}
          onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(255,196,57,0.5)'; }}
          onMouseOut={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 4px 20px rgba(255,196,57,0.35)'; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#003087"><path d="M20.067 8.478c.492.88.556 2.014.3 3.327-.74 3.806-3.276 5.12-6.514 5.12h-.5a.805.805 0 0 0-.794.68l-.04.22-.63 3.99-.032.17a.804.804 0 0 1-.794.68H8.54a.483.483 0 0 1-.477-.558l.925-5.832.01-.07c.06-.372.382-.64.758-.64h1.482c3.102 0 5.533-1.258 6.243-4.895.312-1.588.05-2.85-.693-3.85a3.745 3.745 0 0 0-.72-.332z"/><path d="M18.14 7.7a6.143 6.143 0 0 0-.738-.16 9.294 9.294 0 0 0-1.476-.108H11.4a.804.804 0 0 0-.795.68L9.418 16.05l-.01.07a.805.805 0 0 0 .795.92h1.773c.37 0 .692-.267.76-.63l.63-3.99.04-.22a.804.804 0 0 1 .795-.68h.5c3.237 0 5.773-1.314 6.513-5.12.27-1.313.197-2.443-.327-3.327a3.83 3.83 0 0 0-1.747-.663 6.73 6.73 0 0 0-1.1 3.29z"/></svg>
          PayPal — 7,99€ · 1 mois
        </button>
        <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:8 }}>
          Paiement unique · renouvellement manuel par email
        </p>

        {/* Trust */}
        <div className="sub-trust" style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
          {['🔒 Paiement sécurisé', '📵 Sans pub', '✦ Halal', '↩ Résiliable en 1 clic'].map(t => (
            <span key={t} style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Skip */}
      <button onClick={() => navigate('home')} style={{
        background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)',
        fontSize: 13, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
        textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.1)'
      }}>Continuer sans abonnement →</button>

      {/* ── Embedded Checkout Modal ── */}
      {showCheckout && (
        <div onClick={function(e){ if(e.target===e.currentTarget) closeCheckout(); }} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(12px)', zIndex:10000, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
          <div style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', position:'relative', boxShadow:'0 40px 80px rgba(0,0,0,0.6)' }}>
            {/* Close */}
            <button onClick={closeCheckout} style={{ position:'absolute', top:14, right:14, zIndex:10, background:'rgba(0,0,0,0.07)', border:'none', borderRadius:'50%', width:32, height:32, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif' }}>✕</button>

            {/* Loading */}
            {checkoutLoading && (
              <div style={{ padding:60, textAlign:'center', fontFamily:'Plus Jakarta Sans,sans-serif' }}>
                <div style={{ width:40, height:40, border:'3px solid #f0e8d0', borderTopColor:'#c8a727', borderRadius:'50%', margin:'0 auto 16px', animation:'spin 0.8s linear infinite' }} />
                <p style={{ color:'#555', fontSize:14 }}>Chargement du paiement sécurisé…</p>
              </div>
            )}

            {/* Error */}
            {checkoutError && (
              <div style={{ padding:40, textAlign:'center', fontFamily:'Plus Jakarta Sans,sans-serif' }}>
                <div style={{ fontSize:32, marginBottom:12 }}>⚠️</div>
                <p style={{ color:'#dc2626', fontSize:14, marginBottom:20 }}>{checkoutError}</p>
                <button onClick={() => openCheckout('card')} style={{ background:'#c8a727', border:'none', color:'#1c1200', padding:'12px 28px', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer' }}>Réessayer</button>
              </div>
            )}

            {/* Checkout container */}
            {!checkoutLoading && !checkoutError && <div ref={containerRef} style={{ minHeight:200 }} />}
          </div>
        </div>
      )}
    </div>
  );
}

/* --- Profile Page --- */
function ProfilePage({ navigate }) {
  const { user, logout, isPro } = useAuth();
  const [cancelState, setCancelState] = React.useState('idle'); // idle | confirm | loading | done | error
  const [cancelEndDate, setCancelEndDate] = React.useState('');
  const [cancelError, setCancelError] = React.useState('');

  const handleCancel = async function() {
    if (cancelState === 'idle') { setCancelState('confirm'); return; }
    if (cancelState === 'confirm') {
      setCancelState('loading');
      try {
        var res = await fetch('/api/cancel-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email }),
        });
        var data = await res.json();
        if (data.error) throw new Error(data.error);
        setCancelEndDate(data.endDate);
        setCancelState('done');
      } catch(e) {
        setCancelError(e.message);
        setCancelState('error');
      }
    }
  };
  const CATS = [
    { key: 'prophetes',  title: 'Les Prophètes',       icon: '🌙', color: '#c8a727' },
    { key: 'piliers',    title: 'Les 5 Piliers',        icon: '🕌', color: '#60a5fa' },
    { key: 'histoire',   title: 'Histoire islamique',   icon: '📜', color: '#fb923c' },
    { key: 'compagnons', title: 'Les Compagnons',       icon: '⭐', color: '#a78bfa' },
    { key: 'jugement',   title: 'Jour du Jugement',     icon: '⚖️', color: '#4ade80' },
    { key: 'hadiths',    title: 'Hadiths & Sunna',      icon: '📖', color: '#34d399' },
    { key: 'fiqh',       title: 'Fiqh & Pratique',      icon: '🤲', color: '#f472b6' },
  ];
  const LEVELS = [
    { id: 'debutant', label: 'Débutant', icon: '🌱', color: '#4ade80' },
    { id: 'amateur',  label: 'Amateur',  icon: '⭐', color: '#60a5fa' },
    { id: 'avance',   label: 'Avancé',   icon: '🔥', color: '#fb923c' },
  ];

  // Sanitize + load scores (cap correct at total to fix old 11/10 bug)
  const scores = {};
  CATS.forEach(cat => {
    scores[cat.key] = {};
    LEVELS.forEach(lv => {
      const key = 'quiz_score_' + cat.key + '_' + lv.id;
      const s = localStorage.getItem(key);
      if (s) {
        const parsed = JSON.parse(s);
        parsed.correct = Math.min(parsed.correct, parsed.total);
        localStorage.setItem(key, JSON.stringify(parsed)); // fix in place
        scores[cat.key][lv.id] = parsed;
      }
    });
  });

  const allScores = CATS.flatMap(cat => LEVELS.map(lv => scores[cat.key][lv.id]).filter(Boolean));
  const totalCompleted = allScores.length;
  const totalPossible = CATS.length * LEVELS.length;
  const avgScore = totalCompleted > 0
    ? Math.round(allScores.reduce((a, s) => a + (s.correct / s.total * 100), 0) / totalCompleted)
    : 0;
  const globalPct = Math.round((totalCompleted / totalPossible) * 100);

  const catAvgs = CATS.map(cat => {
    const cs = LEVELS.map(lv => scores[cat.key][lv.id]).filter(Boolean);
    if (!cs.length) return null;
    return { ...cat, avg: Math.round(cs.reduce((a, s) => a + s.correct / s.total * 100, 0) / cs.length) };
  }).filter(Boolean);
  const bestCat = catAvgs.length ? catAvgs.sort((a, b) => b.avg - a.avg)[0] : null;

  const motiv = (() => {
    if (globalPct === 0) return { msg: "Lance-toi ! Chaque grand voyage commence par un premier pas.", icon: '🚀' };
    if (globalPct < 20)  return { msg: "Bien démarré ! Continue sur ta lancée.", icon: '🌱' };
    if (globalPct < 50)  return { msg: "Belle progression ! Tu maîtrises déjà l'essentiel.", icon: '⭐' };
    if (globalPct < 80)  return { msg: "Impressionnant ! Tu es sur la voie de la maîtrise.", icon: '🔥' };
    return { msg: "Mashallah ! Tu as une connaissance approfondie de l'islam.", icon: '🏆' };
  })();

  const memberSince = user && user.metadata && user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="fade-up profile-page" style={{ minHeight: '100vh', padding: '100px 24px 80px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        <button onClick={() => navigate('home')} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)',
          fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 32, padding: 0, fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>← Accueil</button>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg,rgba(200,167,39,0.08) 0%,rgba(26,92,53,0.15) 100%)',
          border: '1px solid rgba(200,167,39,0.2)', borderRadius: 24,
          padding: '32px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap'
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#a8891f,#c4a83a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: '#1c1200'
          }}>
            {((user && (user.displayName || user.email)) || '?')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>
              {(user && user.displayName) || 'Mon compte'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, margin: '0 0 8px' }}>{user && user.email}</p>
            {memberSince && (
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                background: 'rgba(200,167,39,0.12)', border: '1px solid rgba(200,167,39,0.25)',
                color: '#c8a727', textTransform: 'uppercase', letterSpacing: '0.08em'
              }}>Membre depuis {memberSince}</span>
            )}
          </div>
          <button onClick={logout} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.4)', padding: '8px 16px', borderRadius: 8,
            fontSize: 13, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}>Déconnexion</button>
        </div>

        {/* Abonnement Pro — résiliation */}
        {isPro && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,167,39,0.2)', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#c8a727', textTransform: 'uppercase', letterSpacing: 1 }}>✦ Abonnement Pro actif</span>
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>7,99€/mois · Résiliable à tout moment</div>
              </div>
              {cancelState === 'idle' && (
                <button onClick={handleCancel} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: 'rgba(239,68,68,0.7)', padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Résilier l'abonnement
                </button>
              )}
              {cancelState === 'confirm' && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setCancelState('idle')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '8px 14px', borderRadius: 10, fontSize: 12, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Annuler</button>
                  <button onClick={handleCancel} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Confirmer la résiliation</button>
                </div>
              )}
              {cancelState === 'loading' && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Résiliation en cours…</span>}
              {cancelState === 'done' && <span style={{ fontSize: 13, color: '#4ade80', fontWeight: 700 }}>✓ Accès conservé jusqu'au {cancelEndDate}</span>}
              {cancelState === 'error' && <span style={{ fontSize: 12, color: '#ef4444' }}>Erreur : {cancelError}</span>}
            </div>
          </div>
        )}

        {/* Motivation */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,167,39,0.15)',
          borderRadius: 16, padding: '20px 24px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 16
        }}>
          <span style={{ fontSize: 32, flexShrink: 0 }}>{motiv.icon}</span>
          <div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: '0 0 3px' }}>{motiv.msg}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0 }}>
              {totalCompleted}/{totalPossible} niveaux complétés · {globalPct}% de progression globale
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 32 }}>
          {[
            { label: 'Quiz terminés',      val: totalCompleted, suffix: `/${totalPossible}`, color: '#c8a727',   big: true },
            { label: 'Score moyen',        val: avgScore + '%', suffix: '',                 color: avgScore >= 70 ? '#4ade80' : avgScore >= 50 ? '#60a5fa' : '#fb923c', big: true },
            { label: 'Meilleure catégorie',val: bestCat ? bestCat.icon : '—', suffix: '',  color: bestCat ? bestCat.color : '#fff', sub: bestCat ? bestCat.title : 'Aucune', big: false },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: '20px 16px', textAlign: 'center'
            }}>
              <div style={{ fontSize: s.big ? 30 : 26, fontWeight: 900, color: s.color, marginBottom: 4 }}>
                {s.val}<span style={{ fontSize: 14, opacity: 0.6 }}>{s.suffix}</span>
              </div>
              {s.sub && <div style={{ color: s.color, fontSize: 11, fontWeight: 600, marginBottom: 3 }}>{s.sub}</div>}
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Category progress */}
        <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Ma progression par catégorie</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {CATS.map(cat => {
            const catScores = LEVELS.map(lv => ({ ...lv, score: scores[cat.key][lv.id] || null }));
            const done = catScores.filter(l => l.score).length;
            const avg = done > 0
              ? Math.round(catScores.filter(l => l.score).reduce((a, l) => a + l.score.correct / l.score.total * 100, 0) / done)
              : null;
            return (
              <div key={cat.key} style={{
                background: 'rgba(255,255,255,0.03)', border: `1px solid ${cat.color}22`,
                borderRadius: 18, padding: '22px 24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                      background: `${cat.color}18`, border: `1px solid ${cat.color}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
                    }}>{cat.icon}</div>
                    <div>
                      <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{cat.title}</div>
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>
                        {done}/3 niveaux · {done === 0 ? 'Non commencé' : done === 3 ? '✓ Complété' : 'En cours'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {avg !== null && (
                      <span style={{ fontSize: 20, fontWeight: 900, color: avg >= 70 ? '#4ade80' : avg >= 50 ? '#60a5fa' : '#fb923c' }}>
                        {avg}%
                      </span>
                    )}
                    <button onClick={() => navigate('quiz-' + cat.key)} style={{
                      background: `${cat.color}18`, border: `1px solid ${cat.color}44`,
                      color: cat.color, padding: '7px 16px', borderRadius: 8,
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                      fontFamily: 'Plus Jakarta Sans, sans-serif'
                    }}>{done === 0 ? 'Commencer' : done === 3 ? 'Rejouer' : 'Continuer →'}</button>
                  </div>
                </div>
                <div className="cat-levels-row" style={{ display: 'flex', gap: 10 }}>
                  {catScores.map(lv => (
                    <div key={lv.id} style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: lv.score ? lv.color : 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700 }}>
                          {lv.icon} {lv.label}
                        </span>
                        {lv.score && <span style={{ color: lv.color, fontSize: 11, fontWeight: 700 }}>{lv.score.correct}/{lv.score.total}</span>}
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', borderRadius: 3,
                          background: lv.score ? `linear-gradient(90deg,${lv.color}88,${lv.color})` : 'transparent',
                          width: lv.score ? `${Math.round(lv.score.correct / lv.score.total * 100)}%` : '0%',
                          transition: 'width 0.8s ease'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Blind test progression ── */}
        {(() => {
          const BT_LEVELS = [
            { id: 'debutant', label: 'Débutant', icon: '🌱', color: '#4ade80', desc: 'Juz Amma' },
            { id: 'amateur',  label: 'Amateur',  icon: '⭐', color: '#c8a727', desc: 'Sourates moyennes' },
            { id: 'avance',   label: 'Avancé',   icon: '🔥', color: '#f87171', desc: 'Tout le Coran' },
          ];
          const btScores = BT_LEVELS.map(lv => {
            const s = localStorage.getItem('blindtest_score_' + lv.id);
            return { ...lv, score: s ? JSON.parse(s) : null };
          });
          const btDone = btScores.filter(l => l.score).length;
          return (
            <div style={{ marginTop: 32 }}>
              <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                🎵 Écoute &amp; Devine
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.35)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{btDone}/3 niveaux</span>
              </h2>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,167,39,0.15)', borderRadius: 18, padding: '22px 24px' }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  {btScores.map(lv => (
                    <div key={lv.id} style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                        <span style={{ color: lv.score ? lv.color : 'rgba(255,255,255,0.2)', fontSize: 12, fontWeight: 700 }}>{lv.icon} {lv.label}</span>
                        {lv.score && <span style={{ color: lv.color, fontSize: 12, fontWeight: 700 }}>{lv.score.correct}/{lv.score.total}</span>}
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 3, background: lv.score ? `linear-gradient(90deg,${lv.color}88,${lv.color})` : 'transparent', width: lv.score ? `${Math.round(lv.score.correct/lv.score.total*100)}%` : '0%', transition: 'width 0.8s ease' }} />
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, marginTop: 4 }}>{lv.desc}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('blind-test')} style={{
                  marginTop: 18, width: '100%', background: 'rgba(200,167,39,0.08)', border: '1px solid rgba(200,167,39,0.25)',
                  color: '#c8a727', padding: '11px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif'
                }}>{btDone === 0 ? 'Commencer Écoute & Devine →' : btDone === 3 ? 'Rejouer →' : 'Continuer →'}</button>
              </div>
            </div>
          );
        })()}

        {/* CTA continue */}
        {totalCompleted < totalPossible && (
          <div style={{
            marginTop: 32,
            background: 'linear-gradient(135deg,rgba(200,167,39,0.08),rgba(26,92,53,0.12))',
            border: '1px solid rgba(200,167,39,0.2)', borderRadius: 20, padding: '28px', textAlign: 'center'
          }}>
            <p style={{ color: '#c8a727', fontWeight: 800, fontSize: 16, marginBottom: 6 }}>
              Continue ta progression 🏆
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 20 }}>
              {totalPossible - totalCompleted} niveau{totalPossible - totalCompleted > 1 ? 'x' : ''} restant{totalPossible - totalCompleted > 1 ? 's' : ''}
            </p>
            <button onClick={() => navigate('quiz')} style={{
              background: 'linear-gradient(135deg,#a8891f,#c4a83a)', border: 'none',
              color: '#1c1200', padding: '14px 32px', borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>Accéder aux quiz →</button>
          </div>
        )}

      </div>
    </div>
  );
}

/* ─── Navbar ─── */
function Navbar({ navigate }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, openAuth, isPro } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = ['Accueil', 'Blind test', 'Quiz', 'Studio'];
  const pageMap = { 'Blind test': 'blind-test', 'Quiz': 'quiz', 'Studio': 'studio' };

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(3,14,8,0.82)' : 'rgba(3,14,8,0.55)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      borderBottom: scrolled ? '1px solid rgba(200,167,39,0.13)' : '1px solid transparent',
      boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.45)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 32px'
    }}>
      <div className="navbar-inner" style={{
        maxWidth: 1280, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 68, position: 'relative'
      }}>
        {/* Logo */}
        <div className="navbar-logo" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => navigate('home')}>
          <CrescentLogo size={105} />
        </div>

        {/* Desktop nav links */}
        <div className="hide-mobile" style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {navLinks.map((link) => {
            const isActive = (link === 'Accueil' && window.location.hash === '') ||
              (pageMap[link] && window.location.hash === '#' + pageMap[link]);
            return (
              <a key={link} href="#" onClick={(e) => { e.preventDefault(); if (pageMap[link]) navigate(pageMap[link]); else navigate('home'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
                style={{
                  color: isActive ? '#c8a727' : 'rgba(255,255,255,0.82)',
                  textDecoration: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  padding: '7px 18px',
                  borderRadius: 6,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#c8a727'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = isActive ? '#c8a727' : 'rgba(255,255,255,0.82)'; }}>
                {link}
              </a>
            );
          })}
        </div>

        {/* CTA buttons */}
        <div className="hide-mobile" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {user ? (
            <>
              {isPro ? (
                <div className="nav-pro-wrap">
                  <button onClick={() => navigate('profile')} className="nav-pro-btn" title="Compte Pro — voir mon profil">
                    <div style={{ width:24, height:24, borderRadius:'50%', background:'linear-gradient(135deg,#c8a727,#e6c84a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#1c1200', flexShrink:0 }}>
                      {(user.displayName || user.email || '?')[0].toUpperCase()}
                    </div>
                    <span style={{ overflow:'hidden', textOverflow:'ellipsis', maxWidth:100 }}>
                      {user.displayName || user.email.split('@')[0]}
                    </span>
                    <span style={{ fontSize:10, background:'rgba(200,167,39,0.15)', borderRadius:4, padding:'1px 6px', flexShrink:0, color:'rgba(200,167,39,0.85)', fontWeight:700, letterSpacing:'0.05em' }}>PRO</span>
                  </button>
                </div>
              ) : (
                <button onClick={() => navigate('profile')} className="nav-free-btn" title="Mon compte — passer à Pro">
                  <div style={{ width:24, height:24, borderRadius:'50%', background:'rgba(200,167,39,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'rgba(200,167,39,0.9)', flexShrink:0 }}>
                    {(user.displayName || user.email || '?')[0].toUpperCase()}
                  </div>
                  <span style={{ overflow:'hidden', textOverflow:'ellipsis', maxWidth:90 }}>
                    {user.displayName || user.email.split('@')[0]}
                  </span>
                </button>
              )}
              <button onClick={logout} style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.4)', padding: '7px 12px', borderRadius: 8,
                fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}>
                ↩ Déco
              </button>
            </>
          ) : (
            <>
              <button onClick={openAuth} style={{
                background: 'transparent', border: '1.5px solid rgba(255,255,255,0.25)',
                color: '#fff', padding: '8px 16px', borderRadius: 8,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                fontFamily: 'Plus Jakarta Sans, sans-serif'
              }}
              onMouseEnter={(e) => {e.target.style.background = 'rgba(255,255,255,0.08)';}}
              onMouseLeave={(e) => {e.target.style.background = 'transparent';}}>
                Connexion
              </button>
              <button onClick={() => { openAuth(); }} style={{
                background: 'linear-gradient(135deg,#c8a727 0%,#e6c84a 100%)',
                border: 'none', color: '#1c1200', padding: '8px 18px', borderRadius: 8,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 2px 12px rgba(200,167,39,0.35)', transition: 'all 0.2s',
                fontFamily: 'Plus Jakarta Sans, sans-serif'
              }}
              onMouseEnter={(e) => {e.currentTarget.style.transform = 'scale(1.04)';}}
              onMouseLeave={(e) => {e.currentTarget.style.transform = 'scale(1)';}}>
                {(window.HM_FOUNDER && window.HM_FOUNDER()) ? "S'abonner — 3,99€ le 1er mois" : "S'abonner 7,99€/mois"}
              </button>
            </>
          )}
        </div>

        {/* Mobile burger — LEFT */}
        <button className="hide-desktop mobile-burger" onClick={() => setMenuOpen(!menuOpen)} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 8, order: 1
        }}>
          <div style={{ width: 28, height: 2.5, background: '#ffffff', marginBottom: 6, transition: 'all 0.3s', borderRadius: 2,
            transform: menuOpen ? 'rotate(45deg) translate(6px,6px)' : 'none' }} />
          <div style={{ width: 28, height: 2.5, background: '#ffffff', marginBottom: 6, borderRadius: 2, opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: 28, height: 2.5, background: '#ffffff', borderRadius: 2, transition: 'all 0.3s',
            transform: menuOpen ? 'rotate(-45deg) translate(6px,-6px)' : 'none' }} />
        </button>

        {/* Mobile account button — RIGHT */}
        <button className="hide-desktop mobile-account-btn" onClick={() => user ? navigate('profile') : openAuth()} style={{
          background: user ? 'rgba(200,167,39,0.15)' : 'rgba(255,255,255,0.08)',
          border: user ? '1px solid rgba(200,167,39,0.35)' : '1px solid rgba(255,255,255,0.18)',
          color: user ? '#c8a727' : '#fff',
          borderRadius: 10, padding: '7px 14px', cursor: 'pointer',
          fontSize: 13, fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif',
          order: 3
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen &&
      <div style={{
        background: 'linear-gradient(160deg,#071a0d 0%,#050f08 100%)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(200,167,39,0.18)',
        padding: '8px 20px 28px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)'
      }}>
        {/* Divider doré */}
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(200,167,39,0.4),transparent)', margin: '4px 0 20px' }} />

        {/* Nav links */}
        {navLinks.map((link, i) =>
          <a key={link} href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); if (pageMap[link]) navigate(pageMap[link]); else navigate('home'); window.scrollTo({ top: 0, behavior: 'instant' }); }} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            color: '#fff', textDecoration: 'none',
            fontSize: 17, fontWeight: 600, padding: '14px 4px',
            borderBottom: i < navLinks.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
            fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.2px'
          }}>
            {link}
            <span style={{ color: 'rgba(200,167,39,0.5)', fontSize: 16 }}>›</span>
          </a>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(200,167,39,0.25),transparent)', margin: '20px 0 18px' }} />

        {/* Auth section */}
        {user ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
              background: 'rgba(200,167,39,0.07)', borderRadius: 12, border: '1px solid rgba(200,167,39,0.15)' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#a8891f,#c4a83a)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#1c1200', flexShrink: 0 }}>
                {((user.displayName || user.email || '?')[0]).toUpperCase()}
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{user.displayName || 'Mon compte'}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
              </div>
            </div>
            <button onClick={() => { setMenuOpen(false); navigate('profile'); }} style={{
              background: 'rgba(200,167,39,0.1)', border: '1px solid rgba(200,167,39,0.3)',
              color: '#c8a727', padding: '13px', borderRadius: 12, fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>Ma progression →</button>
            <button onClick={() => { setMenuOpen(false); logout(); }} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.45)', padding: '11px', borderRadius: 12, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>Déconnexion</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => { setMenuOpen(false); openAuth(); }} style={{
              background: 'linear-gradient(135deg,#a8891f,#c4a83a)',
              border: 'none', color: '#1c1200', padding: '15px', borderRadius: 12,
              fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
              letterSpacing: '-0.2px'
            }}>{(window.HM_FOUNDER && window.HM_FOUNDER()) ? "✦ S'abonner — 3,99€ le 1er mois" : "✦ S'abonner — 7,99€/mois"}</button>
            <button onClick={() => { setMenuOpen(false); openAuth(); }} style={{
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)', padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif'
            }}>Se connecter</button>
          </div>
        )}
      </div>
      }
    </nav>);

}

/* ─── Démo vivante du hero — un verset s'anime mot à mot, en boucle ─── */
function HeroLiveDemo({ navigate }) {
  const WORDS = [
    { ar: 'بِسْمِ', ph: 'bismi', fr: 'Au nom de' },
    { ar: 'اللَّهِ', ph: 'Llâhi', fr: 'Allah' },
    { ar: 'الرَّحْمَٰنِ', ph: 'ar-Rahmâni', fr: 'le Tout-Miséricordieux' },
    { ar: 'الرَّحِيمِ', ph: 'ar-Rahîm', fr: 'le Très-Miséricordieux' },
  ];
  const [tick, setTick] = React.useState(0);
  React.useEffect(function () {
    const id = setInterval(function () { setTick(function (t) { return t + 1; }); }, 1150);
    return function () { clearInterval(id); };
  }, []);
  const cycle = WORDS.length + 1; // +1 tick de pause avant de reboucler
  const active = tick % cycle;
  const current = active < WORDS.length ? WORDS[active] : null;
  return (
    <button onClick={function () { navigate('comprendre'); }} className="fade-up-3" style={{
      width: '100%', maxWidth: 460, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
      background: 'linear-gradient(160deg, rgba(200,167,39,0.09), rgba(255,255,255,0.02))',
      border: '1px solid rgba(200,167,39,0.35)', borderRadius: 18, padding: '14px 16px 12px',
      marginBottom: 18, textAlign: 'center', position: 'relative', overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(200,167,39,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
      WebkitTapHighlightColor: 'transparent', transition: 'border-color 0.25s, box-shadow 0.25s'
    }}
      onMouseEnter={function (e) { e.currentTarget.style.borderColor = 'rgba(200,167,39,0.7)'; e.currentTarget.style.boxShadow = '0 14px 50px rgba(200,167,39,0.2), inset 0 1px 0 rgba(255,255,255,0.08)'; }}
      onMouseLeave={function (e) { e.currentTarget.style.borderColor = 'rgba(200,167,39,0.35)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(200,167,39,0.1), inset 0 1px 0 rgba(255,255,255,0.06)'; }}>
      <span style={{ display: 'block', fontFamily: 'Cormorant Garamond, Georgia, serif', fontStyle: 'italic', fontSize: 15.5, color: 'rgba(240,237,230,0.75)', marginBottom: 10, lineHeight: 1.4 }}>
        Tu récites ces mots chaque jour… <span style={{ color: '#e6c84a', fontStyle: 'normal', fontWeight: 600 }}>les comprends-tu ?</span>
      </span>
      {/* mots RTL */}
      <span style={{ display: 'flex', flexDirection: 'row-reverse', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 8 }}>
        {WORDS.map(function (w, i) {
          const on = i === active;
          const seen = active < WORDS.length ? i < active : true;
          return (
            <span key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, transition: 'all 0.45s cubic-bezier(0.34,1.56,0.64,1)', transform: on ? 'scale(1.12)' : 'scale(1)', opacity: on ? 1 : seen ? 0.75 : 0.3 }}>
              <span style={{ fontFamily: 'Amiri, Georgia, serif', fontSize: 30, lineHeight: 1.15, color: on ? '#f5d76e' : '#e9e2c8', textShadow: on ? '0 0 18px rgba(230,200,74,0.7)' : 'none', direction: 'rtl' }}>{w.ar}</span>
              <span style={{ fontSize: 9.5, fontStyle: 'italic', color: on || seen ? 'rgba(240,237,230,0.55)' : 'transparent', transition: 'color 0.4s' }}>{w.ph}</span>
            </span>
          );
        })}
      </span>
      {/* traduction du mot actif — hauteur fixe pour éviter les sauts */}
      <span style={{ display: 'block', height: 20, fontSize: 13.5, fontWeight: 700, color: '#e6c84a' }}>
        {current ? current.fr : '« Au nom d’Allah, le Tout-Miséricordieux, le Très-Miséricordieux »'}
      </span>
      <span style={{ display: 'block', marginTop: 6, fontSize: 11.5, color: 'rgba(255,255,255,0.45)' }}>Essaie — c'est gratuit ›</span>
    </button>
  );
}

/* ─── Hero ─── */
function Hero({ navigate }) {
  const { user, openAuth, isPro } = useAuth();
  return (
    <section className="hero-section" style={{
      background: 'transparent',
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center',
      padding: '120px 24px 70px',
      position: 'relative', overflow: 'visible'
    }}>
      {/* Bottom fade */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, transparent, rgba(5,15,8,0.6))', pointerEvents: 'none', zIndex: 2 }} />


      {/* Secondary glow bottom-left */}
      <div style={{
        position: 'absolute', bottom: '-10%', left: '-5%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(26,92,53,0.8) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      {/* Vignette edges */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,20,10,0.65) 100%)'
      }} />

      {/* === Grande arche islamique (mihrab) — inspirée du logo === */}
      <div className="hero-arch-wrap" style={{
        position: 'absolute', top: -90, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none', zIndex: 0, overflow: 'visible'
      }}>
        <svg viewBox="0 0 1000 890" preserveAspectRatio="xMidYMid slice"
        className="hero-arch-svg"
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0d060" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#c8a727" stopOpacity="1" />
              <stop offset="100%" stopColor="#9a7010" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="goldGradV" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e6c84a" stopOpacity="1" />
              <stop offset="100%" stopColor="#a07b10" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="pillarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#051a0c" stopOpacity="1" />
              <stop offset="35%" stopColor="#0f3d20" stopOpacity="0.92" />
              <stop offset="65%" stopColor="#0f3d20" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#051a0c" stopOpacity="1" />
            </linearGradient>
            <pattern id="zelligePillar" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <rect width="28" height="28" fill="none" />
              <polygon points="14,1 20,8 27,8 27,20 20,20 14,27 8,20 1,20 1,8 8,8" fill="none" stroke="rgba(200,167,39,0.55)" strokeWidth="0.9" />
              <circle cx="14" cy="14" r="3.5" fill="none" stroke="rgba(200,167,39,0.4)" strokeWidth="0.7" />
              <line x1="0" y1="14" x2="28" y2="14" stroke="rgba(200,167,39,0.18)" strokeWidth="0.4" />
              <line x1="14" y1="0" x2="14" y2="28" stroke="rgba(200,167,39,0.18)" strokeWidth="0.4" />
              <line x1="0" y1="0" x2="28" y2="28" stroke="rgba(200,167,39,0.1)" strokeWidth="0.3" />
              <line x1="28" y1="0" x2="0" y2="28" stroke="rgba(200,167,39,0.1)" strokeWidth="0.3" />
            </pattern>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>



          {/* ══════════════════════════════════════
                  ARCHE CENTRALE — style logo (large)
                  Porte islamique : ogive + dôme + finiale
               ══════════════════════════════════════ */}


          {/* ── Bordure extérieure principale (ogee arch arabe avec épaules) ── */}
          <path d="M 270 800 L 270 500
            C 270 380 330 220 500 60
            C 670 220 730 380 730 500
            L 730 800"




















          fill="none" stroke="url(#goldGrad)" strokeWidth="4.5" />

          {/* ── Bordure intérieure 1 ── */}
          <path d="M 284 800 L 284 503
            C 284 383 342 228 500 78
            C 658 228 716 383 716 503
            L 716 800"




















          fill="none" stroke="rgba(200,167,39,0.5)" strokeWidth="1.8" />

          {/* ── Bordure intérieure 2 (fine) ── */}
          <path d="M 298 800 L 298 506
            C 298 386 354 236 500 96
            C 646 236 702 386 702 506
            L 702 800"




















          fill="none" stroke="rgba(200,167,39,0.22)" strokeWidth="1" />

          {/* ── DÔME / FINIALE inspiré logo ──
                   Forme : ogive pointue avec bulbe au sommet */}

          {/* Bulbe principal (dôme du logo) */}
          <path d="
            M 452 34
            C 445 28, 436 18, 436 8
            C 436 0, 442 -5, 500 -5
            C 558 -5, 564 0, 564 8
            C 564 18, 555 28, 548 34
            C 536 42, 520 48, 500 48
            C 480 48, 464 42, 452 34 Z"




























          fill="url(#goldGrad)" opacity="0.9" />

          {/* Arche interne du dôme (comme le mihrab dans le logo) */}
          <path d="M 468 46 C 468 34 480 26 500 24 C 520 26 532 34 532 46"
          fill="none" stroke="rgba(3,14,8,0.6)" strokeWidth="3" />
          <path d="M 472 46 C 472 36 483 29 500 27 C 517 29 528 36 528 46"
          fill="none" stroke="rgba(200,167,39,0.4)" strokeWidth="1" />

          {/* Finiale au sommet */}
          <ellipse cx="500" cy="-5" rx="6" ry="9" fill="url(#goldGrad)" opacity="0.95" />
          <circle cx="500" cy="-14" r="3.5" fill="url(#goldGrad)" opacity="0.85" />
          <circle cx="500" cy="-20" r="1.8" fill="rgba(230,200,74,0.9)" />


          {/* Ligne de base horizontale (seuil de la porte) */}
          <line x1="270" y1="799" x2="730" y2="799"
          stroke="url(#goldGrad)" strokeWidth="3" opacity="0.6" />
        </svg>
      </div>

      <div className="hero-text-wrap">

      {/* Kicker — marque */}
      <div className="fade-up-2" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, transparent, rgba(200,167,39,0.6))' }} />
        <span style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700,
            fontSize: 'clamp(10px, 2.4vw, 12.5px)', color: 'rgba(200,167,39,0.85)',
            letterSpacing: '0.32em', textTransform: 'uppercase'
          }}>Explore l'islam autrement</span>
        <span style={{ width: 24, height: 1, background: 'linear-gradient(90deg, rgba(200,167,39,0.6), transparent)' }} />
      </div>

      {/* Title — promesse concrète */}
      <h1 className="fade-up-2 hero-h1" style={{
          fontFamily: 'Fraunces, serif',
          fontWeight: 400,
          fontStyle: 'normal',
          color: '#fff',
          lineHeight: 1.0,
          letterSpacing: '-2px',
          margin: '0 0 18px',
          fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 0',
          fontSize: 'clamp(40px, 6vw, 84px)'
        }}>L'islam comme tu l'as<br /><span style={{ color: '#e6c84a', fontStyle: 'italic', fontWeight: 400, fontVariationSettings: '"opsz" 144' }}>jamais appris.</span></h1>

      <p className="fade-up-3 hero-subtitle" style={{
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: 'clamp(15px, 2.4vw, 20px)',
          color: 'rgba(255,255,255,0.5)',
          marginBottom: 30,
          letterSpacing: '0.01em',
          lineHeight: 1.5
        }}>Apprends le Coran et ta religion <strong style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>en jouant</strong> — quelques minutes par jour.</p>

      {/* Démo vivante — le produit se montre tout seul */}
      <HeroLiveDemo navigate={navigate} />

      {/* Un seul CTA */}
      <div className="fade-up-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: '100%', maxWidth: 460 }}>
        <button onClick={() => navigate('comprendre')} style={{
            width: '100%', maxWidth: 340,
            background: 'linear-gradient(135deg,#e6c84a,#a8891f)',
            border: 'none', borderRadius: 100, padding: '17px 32px',
            fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16.5, fontWeight: 800,
            color: '#1a1205', cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
            boxShadow: '0 10px 38px rgba(200,167,39,0.35)', transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 14px 48px rgba(200,167,39,0.5)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 38px rgba(200,167,39,0.35)'; }}>
          Commencer gratuitement →
        </button>
        <p style={{ margin: 0, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
          Sans carte bancaire <span style={{ opacity: 0.5 }}>·</span> +130 membres
        </p>
      </div>

      </div>{/* /hero-text-wrap */}
    </section>);

}

/* ─── Reassurance Banner ─── */
function ReassuranceBanner() {
  const { isPro } = useAuth();
  return (
    <div style={{
      background: 'linear-gradient(90deg, transparent 0%, rgba(4,14,8,0.72) 20%, rgba(4,14,8,0.72) 80%, transparent 100%)',
      borderTop: '1px solid rgba(200,167,39,0.2)',
      borderBottom: '1px solid rgba(200,167,39,0.2)',
      padding: '16px 24px',
      textAlign: 'center',
      position: 'relative'
    }}>
      {/* zellige-inspired side ornaments */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '100%', pointerEvents: 'none', overflow: 'hidden', height: '100%' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(200,167,39,0.07)" strokeWidth="40" />
        </svg>
      </div>
      <p style={{
        fontFamily: 'Cinzel, serif',
        fontWeight: 400,
        fontSize: 'clamp(12px, 1.6vw, 15px)',
        letterSpacing: '0.12em',
        color: '#e6c84a',
        position: 'relative', zIndex: 1,
        textTransform: 'uppercase'
      }}>
        {isPro ? (
          <>✦ <span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 400 }}>Quiz · Blind Test · Studio Vidéo</span> — accès complet ✦</>
        ) : (
          <>✦ Accès gratuit —&nbsp;<span style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 400 }}>Quiz · Blind test · Studio vidéo&nbsp;</span><span style={{ color: '#e6c84a' }}>— sans carte bancaire ✦</span></>
        )}
      </p>
    </div>);

}

/* ─── Stats Bar (ticker) ─── */
function StatsBar() {
  const stats = [
  { value: '3,99€', label: '1er mois · −50%' },
  { value: '3', label: 'activités uniques' },
  { value: '100%', label: 'en français' },
  { value: 'Sans', label: 'engagement' }];


  // Duplicate items for seamless loop
  const items = [...stats, ...stats, ...stats];

  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.25) 100%)',
      padding: '22px 0',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* fade edges */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, rgba(5,20,10,0.7), transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, rgba(5,20,10,0.7), transparent)', zIndex: 2, pointerEvents: 'none' }} />

      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-100% / 3)); }
        }
        .ticker-track {
          display: flex;
          align-items: center;
          gap: 0;
          width: max-content;
          animation: ticker 18s linear infinite;
        }
        .ticker-track:hover { animation-play-state: paused; }
      `}</style>

      <div className="ticker-track">
        {items.map((s, i) =>
        <React.Fragment key={i}>
            <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '0 40px', flexShrink: 0
          }}>
              <span style={{ fontSize: 'clamp(22px,3.5vw,30px)', fontWeight: 800, color: '#c8a727', lineHeight: 1 }}>
                {s.value}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 600, marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
                {s.label}
              </span>
            </div>
            {/* separator diamond */}
            <span style={{ color: 'rgba(200,167,39,0.35)', fontSize: 10, flexShrink: 0 }}>◆</span>
          </React.Fragment>
        )}
      </div>
    </div>);

}

/* ─── Feature Cards ─── */
function FeatureCards({ navigate }) {
  const cards = [
    {
      num: '01', icon: '🎵', tag: 'POPULAIRE', tagColor: '#c8a727', tagRgb: '200,167,39',
      title: 'Blind Test Coran',
      hook: 'Reconnais à l\'oreille ce que tu n\'arrives pas à retenir par cœur.',
      desc: 'Sourates, récitateurs, thèmes — un format addictif qui grave les versets dans ta mémoire sans effort.',
      free: 'Niveau Débutant · illimité',
      pro: '114 sourates · Tous niveaux · Illimité',
      accent: { from:'rgba(30,22,4,0.97)', to:'rgba(8,6,1,0.99)', border:'rgba(200,167,39,0.32)', glow:'rgba(200,167,39,0.16)', line:'#c8a727' },
      page: 'blind-test',
    },
    {
      num: '02', icon: '🧠', tag: null, tagColor: '#7bc99a', tagRgb: '123,201,154',
      title: 'Quiz Islamiques',
      hook: 'Teste tes connaissances. Surprends-toi toi-même.',
      desc: 'Histoire, prophètes ﷺ, jurisprudence, Coran. Des centaines de questions vérifiées, structurées par niveau.',
      free: 'Niveau Débutant · illimité',
      pro: 'Tous niveaux · Toutes catégories · Illimité',
      accent: { from:'rgba(6,22,13,0.97)', to:'rgba(2,8,4,0.99)', border:'rgba(100,180,130,0.28)', glow:'rgba(100,180,130,0.12)', line:'#4ade80' },
      page: 'quiz',
    },
    {
      num: '03', icon: '📖', tag: 'NOUVEAU', tagColor: '#c8a727', tagRgb: '200,167,39',
      title: 'Comprends le Coran',
      hook: 'Tu pries en arabe depuis des années — sans vraiment comprendre les mots.',
      desc: 'Apprends le Coran mot à mot. ~50 mots suffisent à saisir près de la moitié du Coran. Écoute, comprends, joue — et un jour, tu comprends ta prière.',
      free: 'Al-Fâtiha · mot à mot · illimité',
      pro: 'Toutes les sourates · progression complète',
      accent: { from:'rgba(30,22,4,0.97)', to:'rgba(8,6,1,0.99)', border:'rgba(200,167,39,0.32)', glow:'rgba(200,167,39,0.16)', line:'#c8a727' },
      page: 'comprendre',
    },
    {
      num: '04', icon: '🎬', tag: null, tagColor: '#a78bfa', tagRgb: '167,139,250',
      title: 'Studio Vidéo',
      hook: 'Crée tes vidéos de récitation à partager — chaque vue peut être une sadaqa jariya.',
      desc: 'Sous-titres arabes et français, fonds, polices. Poste sur TikTok, Instagram et YouTube en quelques clics.',
      free: 'Créer · Prévisualiser · Personnaliser',
      pro: 'Téléchargement HD · Export illimité',
      accent: { from:'rgba(18,14,30,0.97)', to:'rgba(5,4,10,0.99)', border:'rgba(167,139,250,0.28)', glow:'rgba(167,139,250,0.12)', line:'#a78bfa' },
      page: 'studio',
    },
  ];

  return (
    <section id="features" style={{ padding:'96px 24px 80px', background:'transparent', position:'relative', overflow:'hidden' }}>
      {/* Glows fond */}
      <div style={{ position:'absolute', top:'-10%', left:'-8%', width:600, height:600, background:'radial-gradient(circle,rgba(26,92,53,0.45) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'absolute', bottom:'-5%', right:'-5%', width:500, height:500, background:'radial-gradient(circle,rgba(200,167,39,0.1) 0%,transparent 70%)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse at center,transparent 40%,rgba(5,20,10,0.45) 100%)' }} />

      <div style={{ maxWidth:1120, margin:'0 auto', position:'relative', zIndex:1, display:'flex', flexDirection:'column' }}>

        {/* ── Bande : l'importance du savoir (déplacée plus bas via order) ── */}
        <div className="reveal-scale section-text-backdrop" style={{ textAlign:'center', marginTop:80, marginBottom:0, order:3, width:'100%' }}>
          <p style={{ fontSize:11.5, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--gold)', marginBottom:14, fontFamily:'Plus Jakarta Sans,sans-serif' }}>
            ◆ Pourquoi c'est essentiel
          </p>
          <h2 style={{ fontFamily:'Cinzel,serif', fontWeight:700, fontSize:'clamp(26px,4.6vw,46px)', color:'#f0ede6', lineHeight:1.18, margin:'0 0 14px' }}>
            Apprendre sa religion<br/><span style={{ color:'var(--gold)' }}>n'est pas une option.</span>
          </h2>
          <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:'clamp(15px,1.8vw,17px)', color:'rgba(240,237,230,0.5)', maxWidth:560, margin:'0 auto 44px', lineHeight:1.8 }}>
            Le savoir est au cœur de l'islam — une voie vers Allah, élevée et récompensée. Voici ce qu'en disent le Coran et le Prophète ﷺ.
          </p>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:22, maxWidth:1000, margin:'0 auto 44px', textAlign:'left' }}>
            {[
              { ar:'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ', fr:'« La recherche du savoir est une obligation pour tout musulman. »', src:'Hadith — Ibn Majah' },
              { ar:'قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ', fr:'« Dis : sont-ils égaux, ceux qui savent et ceux qui ne savent pas ? »', src:'Coran — Az-Zumar (39:9)' },
              { ar:'يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ', fr:'« Allah élèvera en degrés ceux d\'entre vous qui ont cru et ceux à qui le savoir a été donné. »', src:'Coran — Al-Moujadalah (58:11)' },
            ].map(function(item, i) {
              return (
                <div key={i} style={{ background:'linear-gradient(160deg,rgba(200,167,39,0.06) 0%,rgba(255,255,255,0.015) 100%)', border:'1px solid rgba(200,167,39,0.22)', borderRadius:18, padding:'26px 24px', display:'flex', flexDirection:'column', gap:14, boxShadow:'0 4px 24px rgba(0,0,0,0.35)' }}>
                  <div style={{ fontFamily:'Amiri,Georgia,serif', fontSize:24, color:'#f0e4bf', lineHeight:1.9, direction:'rtl', textAlign:'right' }}>{item.ar}</div>
                  <div style={{ fontFamily:'Cormorant Garamond,Georgia,serif', fontSize:18, fontStyle:'italic', color:'rgba(240,237,230,0.82)', lineHeight:1.5 }}>{item.fr}</div>
                  <div style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, fontWeight:700, letterSpacing:'0.06em', color:'var(--gold)' }}>{item.src}</div>
                </div>
              );
            })}
          </div>

          <p style={{ fontFamily:'Cormorant Garamond,Georgia,serif', fontSize:'clamp(18px,2.4vw,24px)', fontStyle:'italic', color:'rgba(240,237,230,0.7)', maxWidth:620, margin:'0 auto 56px', lineHeight:1.6 }}>
            Et si on rendait cet apprentissage <span style={{ color:'var(--gold)', fontStyle:'normal', fontWeight:600 }}>simple, vivant et addictif</span> ? Ici, tu apprends ta religion <strong style={{ color:'#f0ede6', fontWeight:600 }}>en jouant</strong> — et tu progresses sans t'en rendre compte.
          </p>
          <ArabesqueDivider color="rgba(200,167,39,0.3)" />
        </div>

        {/* ── En-tête section ── */}
        <div className="reveal-scale section-text-backdrop" style={{ textAlign:'center', marginBottom:64 }}>
          <p style={{ fontSize:11.5, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:'var(--gold)', marginBottom:14, fontFamily:'Plus Jakarta Sans,sans-serif' }}>
            ◆ Les activités
          </p>
          <h2 style={{ fontFamily:'Cinzel,serif', fontWeight:700, fontSize:'clamp(28px,5vw,52px)', color:'#f0ede6', lineHeight:1.15, margin:'0 0 16px' }}>
            Joue. Apprends. Crée.
          </h2>
          <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:'clamp(15px,1.8vw,17px)', color:'rgba(240,237,230,0.45)', maxWidth:480, margin:'0 auto 24px', lineHeight:1.8 }}>
            Trois outils pour enrichir ta foi — sans que ça ressemble à un cours.
          </p>
          <ArabesqueDivider color="rgba(200,167,39,0.35)" />
        </div>

        {/* ── Cartes ── */}
        <div className="reveal-stagger-alt" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:28 }}>
          {cards.map(function(card, i) {
            var ac = card.accent;
            return (
              <div key={i}
                onClick={function(){ if (card.page && navigate) navigate(card.page); }}
                style={{ background:'linear-gradient(160deg,'+ac.from+' 0%,'+ac.to+' 100%)', border:'1px solid '+ac.border, borderRadius:26, padding:'36px 30px', position:'relative', overflow:'hidden', boxShadow:'0 8px 44px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)', transition:'all 0.3s ease', cursor:card.page?'pointer':'default', display:'flex', flexDirection:'column' }}
                onMouseEnter={function(e){ e.currentTarget.style.transform='translateY(-8px) scale(1.01)'; e.currentTarget.style.boxShadow='0 20px 60px rgba(0,0,0,0.7), 0 0 40px '+ac.glow+', inset 0 1px 0 rgba(255,255,255,0.08)'; }}
                onMouseLeave={function(e){ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 8px 44px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)'; }}>

                {/* Ligne top colorée */}
                <div style={{ position:'absolute', top:0, left:'8%', right:'8%', height:2, background:'linear-gradient(90deg,transparent,'+ac.line+',transparent)', borderRadius:2 }} />
                {/* Glow coin */}
                <div style={{ position:'absolute', top:-50, right:-50, width:160, height:160, background:'radial-gradient(circle,'+ac.glow+' 0%,transparent 70%)', pointerEvents:'none' }} />
                {/* Numéro watermark */}
                <div style={{ position:'absolute', bottom:20, right:24, fontFamily:'Cinzel,serif', fontSize:64, fontWeight:700, color:'rgba(255,255,255,0.025)', lineHeight:1, userSelect:'none', pointerEvents:'none' }}>{card.num}</div>

                {/* Badge tag */}
                {card.tag && (
                  <span style={{ position:'absolute', top:22, right:22, background:'rgba(200,167,39,0.14)', border:'1px solid rgba(200,167,39,0.35)', borderRadius:100, padding:'3px 12px', fontSize:10, fontWeight:800, color:'#c8a727', letterSpacing:'0.1em', textTransform:'uppercase' }}>{card.tag}</span>
                )}

                {/* Contenu */}
                <div style={{ position:'relative', zIndex:1, flexGrow:1, display:'flex', flexDirection:'column' }}>

                  {/* Icône */}
                  <div style={{ fontSize:38, marginBottom:18, lineHeight:1, filter:'drop-shadow(0 0 10px '+ac.glow+')' }}>{card.icon}</div>

                  {/* Titre */}
                  <h3 style={{ fontFamily:'Cinzel,serif', fontWeight:700, fontSize:21, marginBottom:10, color:'#f0ede6', lineHeight:1.25 }}>{card.title}</h3>

                  {/* Hook italique */}
                  <p style={{ fontFamily:'Cormorant Garamond,serif', fontStyle:'italic', fontSize:16, color:'rgba(240,237,230,0.55)', lineHeight:1.5, marginBottom:14, fontWeight:400 }}>{card.hook}</p>

                  {/* Desc */}
                  <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:13.5, lineHeight:1.8, color:'rgba(240,237,230,0.48)', marginBottom:28, flexGrow:1 }}>{card.desc}</p>

                  {/* Free / Pro pills */}
                  <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:24 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:9, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)', borderRadius:10, padding:'9px 14px' }}>
                      <span style={{ color:'#4ade80', fontSize:13, fontWeight:800, flexShrink:0 }}>✓</span>
                      <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12.5, color:'rgba(240,237,230,0.55)', fontWeight:500 }}>Gratuit — {card.free}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:9, background:'rgba('+card.tagRgb+',0.07)', border:'1px solid rgba('+card.tagRgb+',0.22)', borderRadius:10, padding:'9px 14px' }}>
                      <span style={{ color:card.tagColor, fontSize:13, fontWeight:800, flexShrink:0 }}>✦</span>
                      <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12.5, color:'rgba(240,237,230,0.7)', fontWeight:500 }}>Pro — {card.pro}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div style={{ display:'inline-flex', alignItems:'center', gap:6, fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:13.5, fontWeight:700, color:card.tagColor, letterSpacing:'0.01em' }}>
                    Essayer maintenant <span style={{ fontSize:16 }}>→</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works ─── */
function HowItWorksSection() {
  const [scene, setScene] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [tick, setTick] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const SCENE_MS = 4800;

  React.useEffect(function() {
    if (paused) return;
    setProgress(0);
    setTick(0);
    var start = Date.now();
    var iv = setInterval(function() {
      var elapsed = Date.now() - start;
      setTick(elapsed);
      setProgress(Math.min(elapsed / SCENE_MS * 100, 100));
      if (elapsed >= SCENE_MS) {
        clearInterval(iv);
        setScene(function(s) { return (s + 1) % 3; });
      }
    }, 40);
    return function() { clearInterval(iv); };
  }, [scene, paused]);

  /* ── Scene 0 : Création de compte ── */
  function renderScene0() {
    var typed = tick > 600 ? 'yasmin@gmail.com'.slice(0, Math.min(Math.floor((tick - 600) / 80), 16)) : '';
    var showPass = tick > 2200;
    var showBtn  = tick > 2600;
    var clicked  = tick > 3400;
    var success  = tick > 4000;
    if (success) return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:250, gap:12 }}>
        <div style={{ width:58, height:58, borderRadius:'50%', background:'rgba(74,222,128,0.13)', border:'2px solid #4ade80', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>✓</div>
        <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:15, fontWeight:700, color:'#4ade80', margin:0 }}>Compte créé !</p>
        <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, color:'rgba(240,237,230,0.45)', textAlign:'center', margin:0 }}>Bienvenue sur Héritage Musulman 🕌</p>
      </div>
    );
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:14, fontWeight:700, color:'#f0ede6', margin:0 }}>Créer ton compte gratuit</p>
        <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:11, color:'rgba(240,237,230,0.38)', margin:'0 0 4px' }}>Aucune carte bancaire requise</p>
        <div>
          <label style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:11, color:'rgba(240,237,230,0.45)', display:'block', marginBottom:5 }}>Email</label>
          <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(200,167,39,0.35)', borderRadius:9, padding:'9px 12px', fontFamily:'monospace', fontSize:12, color:'#f0ede6', minHeight:34, display:'flex', alignItems:'center' }}>
            {typed}
            <span style={{ display:'inline-block', width:1.5, height:13, background:'#c8a727', marginLeft:1, opacity: tick % 700 < 350 ? 1 : 0 }} />
          </div>
        </div>
        {showPass && (
          <div>
            <label style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:11, color:'rgba(240,237,230,0.45)', display:'block', marginBottom:5 }}>Mot de passe</label>
            <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:9, padding:'9px 12px', fontFamily:'monospace', fontSize:12, color:'rgba(240,237,230,0.35)', minHeight:34 }}>••••••••</div>
          </div>
        )}
        {showBtn && (
          <div style={{ marginTop:4, background: clicked ? 'rgba(200,167,39,0.18)' : 'linear-gradient(135deg,#c8a727,#e6c84a)', borderRadius:9, padding:'11px 0', textAlign:'center', fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:13, fontWeight:700, color: clicked ? '#c8a727' : '#030d06', transform: clicked ? 'scale(0.97)' : 'scale(1)', transition:'all 0.15s', boxShadow: clicked ? 'none' : '0 4px 18px rgba(200,167,39,0.28)' }}>
            {clicked ? 'Création en cours…' : 'Créer mon compte →'}
          </div>
        )}
      </div>
    );
  }

  /* ── Scene 1 : Choix d'activité ── */
  function renderScene1() {
    var activities = [
      { icon:'🎵', name:'Blind Test', desc:'Reconnais les sourates', color:'#c8a727' },
      { icon:'❓', name:'Quiz Islam', desc:'Teste tes connaissances', color:'#60a5fa' },
      { icon:'🎬', name:'Studio',    desc:'Crée des vidéos islamiques', color:'#a78bfa' },
    ];
    var selectedIdx = tick > 2800 ? 0 : null;
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:14, fontWeight:700, color:'#f0ede6', margin:'0 0 4px' }}>Que veux-tu faire ?</p>
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {activities.map(function(act, i) {
            var isSel = selectedIdx === i;
            var visible = tick > 300 + i * 280;
            return (
              <div key={i} style={{ background: isSel ? 'rgba(200,167,39,0.1)' : 'rgba(255,255,255,0.04)', border: isSel ? ('1.5px solid ' + act.color) : '1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'11px 12px', display:'flex', alignItems:'center', gap:10, opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(-10px)', transition:'opacity 0.4s, transform 0.4s, background 0.3s, border-color 0.3s', boxShadow: isSel ? ('0 0 14px ' + act.color + '33') : 'none' }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{act.icon}</span>
                <div style={{ flex:1 }}>
                  <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, fontWeight:700, color: isSel ? act.color : '#f0ede6', margin:0 }}>{act.name}</p>
                  <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:10, color:'rgba(240,237,230,0.38)', margin:0 }}>{act.desc}</p>
                </div>
                {isSel && <span style={{ fontSize:14, color:act.color }}>✓</span>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Scene 2 : Quiz en action ── */
  function renderScene2() {
    var answers = ['104 sourates','112 sourates','114 sourates','120 sourates'];
    var showQ       = tick > 400;
    var showAns     = tick > 1000;
    var wrongSel    = tick > 1900 ? 0    : null;
    var correctSel  = tick > 3000 ? 2    : null;
    var showPts     = tick > 3500;
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:2 }}>
          <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:11, color:'rgba(240,237,230,0.38)' }}>Question 3 / 10</span>
          <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, fontWeight:800, color: showPts ? '#4ade80' : '#c8a727', transition:'color 0.3s' }}>
            {showPts ? '30' : '20'} pts {showPts && '🎉'}
          </span>
        </div>
        <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:9, padding:'12px', opacity: showQ ? 1 : 0, transition:'opacity 0.5s' }}>
          <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, color:'#f0ede6', lineHeight:1.5, margin:0 }}>Combien de sourates compte le Saint Coran ?</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, opacity: showAns ? 1 : 0, transition:'opacity 0.5s' }}>
          {answers.map(function(ans, i) {
            var bg = 'rgba(255,255,255,0.05)', border = '1px solid rgba(255,255,255,0.08)', color = 'rgba(240,237,230,0.8)', suffix = '';
            if (wrongSel === i && correctSel === null) { bg='rgba(239,68,68,0.15)'; border='1px solid rgba(239,68,68,0.5)'; color='#ef4444'; suffix=' ✗'; }
            if (correctSel !== null && i === 0)    { bg='rgba(239,68,68,0.1)';  border='1px solid rgba(239,68,68,0.3)';  color='rgba(239,68,68,0.55)'; suffix=' ✗'; }
            if (correctSel !== null && i === 2)    { bg='rgba(74,222,128,0.15)'; border='1px solid rgba(74,222,128,0.6)'; color='#4ade80'; suffix=' ✓'; }
            return (
              <div key={i} style={{ background:bg, border:border, borderRadius:8, padding:'8px 5px', textAlign:'center', fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:11, fontWeight:600, color:color, transition:'all 0.3s', lineHeight:1.3 }}>
                {ans}{suffix}
              </div>
            );
          })}
        </div>
        {showPts && <div style={{ textAlign:'center', fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:14, fontWeight:800, color:'#4ade80' }}>+10 pts !</div>}
      </div>
    );
  }

  var steps = [
    { num:'01', label:'Créer un compte',     sub:'30 secondes, c\'est tout' },
    { num:'02', label:'Choisir une activité', sub:'Blind Test, Quiz ou Studio' },
    { num:'03', label:'Jouer & progresser',  sub:'Apprends sans t\'en rendre compte' },
  ];
  var sceneLabels = ['Inscription','Choix d\'activité','Quiz en action'];

  return (
    <section style={{ padding:'100px 24px', background:'linear-gradient(180deg,#030d06 0%,#040f07 100%)', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(200,167,39,0.04) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div style={{ maxWidth:900, margin:'0 auto', position:'relative' }}>

        {/* Header */}
        <div className="reveal-blur" style={{ textAlign:'center', marginBottom:56 }}>
          <span style={{ display:'inline-block', background:'rgba(200,167,39,0.1)', border:'1px solid rgba(200,167,39,0.25)', borderRadius:20, padding:'5px 16px', fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, color:'rgba(200,167,39,0.9)', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:18 }}>
            Comment ça marche
          </span>
          <h2 style={{ fontFamily:'Cinzel,serif', fontSize:'clamp(26px,4vw,40px)', color:'#f0ede6', lineHeight:1.2, marginBottom:14 }}>
            Lancé en <span style={{ color:'#c8a727' }}>3 étapes</span>
          </h2>
          <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:16, color:'rgba(240,237,230,0.55)', maxWidth:480, margin:'0 auto' }}>
            Pas de configuration. Pas de mode d'emploi. Tu arrives, tu joues, tu progresses.
          </p>
        </div>

        {/* Two-col layout */}
        <div className="reveal-zoom" style={{ display:'flex', gap:52, alignItems:'center', flexWrap:'wrap', justifyContent:'center' }}>

          {/* Left — clickable step list */}
          <div style={{ flex:'1 1 220px', minWidth:220, maxWidth:340, display:'flex', flexDirection:'column', gap:6 }}>
            {steps.map(function(s, i) {
              var isActive = scene === i;
              return (
                <div key={i} onClick={function() { setScene(i); setPaused(false); }}
                  style={{ display:'flex', gap:14, alignItems:'flex-start', padding:'16px 14px', borderRadius:12, cursor:'pointer', background: isActive ? 'rgba(200,167,39,0.06)' : 'transparent', border: isActive ? '1px solid rgba(200,167,39,0.22)' : '1px solid transparent', transition:'all 0.3s' }}>
                  <div style={{ flexShrink:0, width:34, height:34, borderRadius:'50%', background: isActive ? 'linear-gradient(135deg,#c8a727,#e6c84a)' : 'rgba(200,167,39,0.08)', border: isActive ? 'none' : '1.5px solid rgba(200,167,39,0.22)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cinzel,serif', fontSize:11, color: isActive ? '#030d06' : 'rgba(200,167,39,0.55)', fontWeight:700, boxShadow: isActive ? '0 0 14px rgba(200,167,39,0.32)' : 'none', transition:'all 0.3s' }}>
                    {s.num}
                  </div>
                  <div>
                    <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:14, fontWeight:700, color: isActive ? '#f0ede6' : 'rgba(240,237,230,0.4)', margin:'0 0 2px', transition:'color 0.3s' }}>{s.label}</p>
                    <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:11, color:'rgba(240,237,230,0.28)', margin:0 }}>{s.sub}</p>
                  </div>
                </div>
              );
            })}
            {/* Play/pause */}
            <button onClick={function() { setPaused(function(p) { return !p; }); }}
              style={{ alignSelf:'flex-start', marginLeft:14, marginTop:6, display:'flex', alignItems:'center', gap:7, background:'none', border:'1px solid rgba(255,255,255,0.09)', borderRadius:20, padding:'6px 14px', cursor:'pointer', color:'rgba(240,237,230,0.38)', fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12 }}>
              <span>{paused ? '▶' : '⏸'}</span>
              <span>{paused ? 'Reprendre' : 'Pause'}</span>
            </button>
          </div>

          {/* Right — animated phone */}
          <div style={{ flex:'1 1 240px', minWidth:240, display:'flex', flexDirection:'column', alignItems:'center', gap:18 }}>
            {/* Phone frame */}
            <div style={{ width:262, background:'#071510', borderRadius:30, border:'2px solid rgba(200,167,39,0.28)', overflow:'hidden', boxShadow:'0 0 60px rgba(200,167,39,0.11), 0 32px 64px rgba(0,0,0,0.65)', position:'relative' }}>
              {/* Status bar */}
              <div style={{ background:'#030d06', padding:'10px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:10, color:'rgba(240,237,230,0.45)' }}>9:41</span>
                <div style={{ width:52, height:5, background:'rgba(200,167,39,0.12)', borderRadius:3, border:'1px solid rgba(200,167,39,0.18)' }} />
                <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:10, color:'rgba(240,237,230,0.45)' }}>●●●</span>
              </div>
              {/* App header */}
              <div style={{ background:'rgba(200,167,39,0.07)', borderBottom:'1px solid rgba(200,167,39,0.13)', padding:'9px 16px', display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:14 }}>☪️</span>
                <span style={{ fontFamily:'Cinzel,serif', fontSize:11, color:'#c8a727' }}>Héritage Musulman</span>
              </div>
              {/* Scene */}
              <div style={{ padding:'18px 16px 22px', minHeight:280 }}>
                {scene === 0 && renderScene0()}
                {scene === 1 && renderScene1()}
                {scene === 2 && renderScene2()}
              </div>
            </div>

            {/* Progress bars (3 segments) */}
            <div style={{ width:262, display:'flex', gap:5 }}>
              {[0,1,2].map(function(i) {
                var isActive = scene === i;
                var isDone   = scene > i;
                return (
                  <div key={i} onClick={function() { setScene(i); setPaused(false); }}
                    style={{ flex:1, height:3, background:'rgba(255,255,255,0.09)', borderRadius:2, overflow:'hidden', cursor:'pointer' }}>
                    <div style={{ height:'100%', width: isDone ? '100%' : isActive ? (progress + '%') : '0%', background:'linear-gradient(90deg,#c8a727,#e6c84a)', borderRadius:2, transition: isActive ? 'none' : 'width 0.35s' }} />
                  </div>
                );
              })}
            </div>
            <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:11, color:'rgba(240,237,230,0.3)', textAlign:'center', margin:0 }}>
              Étape {scene + 1} / 3 — {sceneLabels[scene]}
            </p>
          </div>

        </div>

        {/* Bottom badge */}
        <div className="reveal-blur" style={{ textAlign:'center', marginTop:56 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(200,167,39,0.07)', border:'1px solid rgba(200,167,39,0.2)', borderRadius:40, padding:'12px 28px' }}>
            <span style={{ fontSize:20 }}>⏱️</span>
            <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:14, color:'rgba(240,237,230,0.7)' }}>
              Première partie en moins de <strong style={{ color:'#c8a727' }}>2 minutes</strong> — même depuis ton téléphone
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─── Comparison Table ─── */
function ComparisonTable({ navigate }) {
  const { user, isPro, openAuth, openQuickCheckout } = useAuth();
  const freeItems = [
  { text: 'Niveau Débutant · parties illimitées', ok: true },
  { text: 'Blind Test Débutant illimité', ok: true },
  { text: 'Accès à 1 niveau de quiz', ok: true },
  { text: '🔒 Quiz illimités tous niveaux', ok: false },
  { text: '🔒 Blind test complet (114 sourates)', ok: false },
  { text: '🔒 Studio vidéo & téléchargement', ok: false },
  { text: '🔒 Statistiques de progression', ok: false },
  { text: '🔒 Nouvelles sorties chaque semaine', ok: false }];

  const proItems = [
  { text: 'Quiz illimités · tous niveaux · toutes catégories', icon: '🧠' },
  { text: 'Blind test Coran complet — 114 sourates', icon: '🎵' },
  { text: 'Studio vidéo — crée & télécharge tes vidéos', icon: '🎬' },
  { text: 'Statistiques de progression détaillées', icon: '📈' },
  { text: 'Nouvelles sorties chaque semaine', icon: '🆕' },
  { text: 'Accès sur mobile & tablette', icon: '📱' },
  { text: 'Soutien à la communauté islamique FR 🤍', icon: '🕌' }];


  return (
    <section style={{ padding: '80px 24px', background: 'rgba(0,0,0,0.18)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)', pointerEvents: 'none' }} />
      {/* Lueur dorée centre-droite */}
      <div style={{ position: 'absolute', top: '20%', right: '-10%', width: 550, height: 550, background: 'radial-gradient(circle, rgba(200,167,39,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      {/* Lueur verte centre-gauche */}
      <div style={{ position: 'absolute', bottom: '10%', left: '-8%', width: 480, height: 480, background: 'radial-gradient(circle, rgba(26,92,53,0.45) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="reveal-left section-text-backdrop" style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>
            ◆ COMPARAISON
          </p>
          <h2 style={{
            fontFamily: 'Playfair Display, serif', fontWeight: 900,
            fontSize: 'clamp(26px,4.5vw,44px)', color: '#fff',
            fontFamily: 'Playfair Display, serif', fontWeight: 900,
            letterSpacing: '-0.5px', lineHeight: 1.15
          }}>
            Gratuit vs Abonné
          </h2>
        </div>

        <div className="reveal-stagger" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24, alignItems: 'stretch'
        }}>
          {/* Free column */}
          <div style={{
            background: 'rgba(255,255,255,0.05)', borderRadius: 20,
            border: '1px solid rgba(200,167,39,0.15)',
            padding: '32px 28px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
          }}>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Version gratuite</p>
              <p style={{ fontSize: 32, fontWeight: 800, color: '#c8a727' }}>0€</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Pour commencer</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {freeItems.map((item, i) =>
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                  width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: item.ok ? 'var(--green-light)' : 'rgba(255,255,255,0.05)',
                  fontSize: 11, fontWeight: 700,
                  color: item.ok ? '#c8a727' : 'rgba(255,255,255,0.15)',
                  flexShrink: 0
                }}>
                    {item.ok ? '✓' : '✕'}
                  </span>
                  <span style={{
                  fontSize: 14,
                  color: item.ok ? '#fff' : 'rgba(255,255,255,0.25)',
                  textDecoration: item.ok ? 'none' : 'line-through'
                }}>{item.text}</span>
                </div>
              )}
            </div>
            <button onClick={function(){ navigate('start'); }} style={{
              marginTop: 28, width: '100%',
              background: 'transparent', border: '1.5px solid rgba(255,255,255,0.25)',
              color: '#fff', padding: '13px', borderRadius: 10,
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {e.currentTarget.style.background = 'rgba(255,255,255,0.08)';e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';}}
            onMouseLeave={(e) => {e.currentTarget.style.background = 'transparent';e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';}}>
              {isPro ? '✦ Continuer' : user ? 'Accéder au contenu gratuit' : 'Commencer gratuitement'}
            </button>
          </div>

          {/* Pro column */}
          <div style={{
            background: 'linear-gradient(145deg, var(--green-dark), #1f6e3f)',
            borderRadius: 20,
            padding: '32px 28px',
            boxShadow: '0 12px 48px rgba(26,92,53,0.3)',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: -2, right: 20 }}>
              <div style={{ background: 'var(--gold)', color: '#ffffff', fontSize: 11, fontWeight: 800, padding: '4px 14px', borderRadius: '0 0 10px 10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Recommandé
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>Accès complet</p>
              <div style={{ marginBottom: 2 }}>
                
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                {(window.HM_FOUNDER && window.HM_FOUNDER()) ? (
                  <OfferPrice big={40} />
                ) : (
                  <>
                    <p style={{ fontSize: 38, fontWeight: 800, color: '#c8a727' }}>7,99€</p>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>/mois</p>
                  </>
                )}
              </div>
              <div style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.22)', borderRadius:10, padding:'7px 12px', marginTop:4, display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ color:'#4ade80', fontSize:13, flexShrink:0 }}>✓</span>
                <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.72)' }}>Sans engagement — annule quand tu veux en 1 clic</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 1 }}>
              {proItems.map((item, i) =>
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.88)' }}>{item.text}</span>
                </div>
              )}
            </div>
            {!isPro && (
              <div style={{ marginTop:24, display:'flex', alignItems:'center', justifyContent:'center', gap:7, background:'rgba(220,50,50,0.1)', border:'1px solid rgba(220,50,50,0.28)', borderRadius:20, padding:'5px 14px' }}>
                <span style={{ fontSize:11 }}>⏳</span>
                <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:11, fontWeight:700, color:'#ff7070', letterSpacing:'0.05em' }}>⚡ Offre de lancement — expire bientôt</span>
              </div>
            )}
            <button onClick={() => isPro ? navigate('blind-test') : openQuickCheckout()} style={{
              marginTop: isPro ? 32 : 12, width: '100%', position: 'relative', zIndex: 1,
              background: 'linear-gradient(135deg, #c8a727 0%, #a8891f 100%)',
              border: 'none', color: '#fff', padding: '15px', borderRadius: 10,
              fontSize: 15, fontWeight: 800, cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              boxShadow: '0 4px 20px rgba(200,167,39,0.35)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {e.currentTarget.style.boxShadow='0 6px 28px rgba(200,167,39,0.55)';e.currentTarget.style.transform='translateY(-1px)';e.currentTarget.style.background='linear-gradient(135deg, #d4b42e 0%, #b8991f 100%)';}}
            onMouseLeave={(e) => {e.currentTarget.style.boxShadow='0 4px 20px rgba(200,167,39,0.35)';e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.background='linear-gradient(135deg, #c8a727 0%, #a8891f 100%)';}}>
              {isPro ? '✦ Commencer une activité →' : 'Débloquer l\'accès complet →'}
            </button>
          </div>
        </div>
      </div>
    </section>);

}

/* ─── Parcours ─── */
function ParcoursSection() {
  const parcours = [
  {
    level: 'Débutant',
    dot: '#4ade80',
    desc: 'Tu découvres l\'islam ou tu veux revoir les bases. Histoire, piliers, vocabulaire essentiel.',
    tags: ['Bases de l\'islam', 'Vocabulaire', 'Premiers pas']
  },
  {
    level: 'Reconverti(e)',
    dot: '#60a5fa',
    desc: 'Tu t\'es converti(e) et tu veux construire une connaissance solide, à ton rythme.',
    tags: ['Pratique', 'Priorités', 'Soutien']
  },
  {
    level: 'Intermédiaire',
    dot: '#c8a727',
    desc: 'Tu connais les bases et tu veux approfondir : seerah, jurisprudence, Coran.',
    tags: ['Seerah', 'Fiqh', 'Coran']
  },
  {
    level: 'Avancé',
    dot: '#f87171',
    desc: 'Tu maîtrises bien et tu cherches à affiner ta compréhension des sciences islamiques.',
    tags: ['Sciences islamiques', 'Exégèse', 'Débats']
  }];


  return (
    <section style={{ padding: '80px 24px', background: 'transparent', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)', pointerEvents: 'none' }} />
      {/* Lueur verte haut-droite */}
      <div style={{ position: 'absolute', top: '-5%', right: '-6%', width: 520, height: 520, background: 'radial-gradient(circle, rgba(26,92,53,0.5) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      {/* Lueur dorée bas-centre */}
      <div style={{ position: 'absolute', bottom: '5%', left: '30%', width: 460, height: 460, background: 'radial-gradient(circle, rgba(200,167,39,0.09) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="reveal-right section-text-backdrop" style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>
            ◆ PARCOURS
          </p>
          <h2 style={{
            fontFamily: 'Playfair Display, serif', fontWeight: 900,
            fontSize: 'clamp(26px,4.5vw,44px)', color: '#fff',
            letterSpacing: '-0.5px', lineHeight: 1.15,
            marginBottom: 16
          }}>
            Adapté à ton niveau
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto' }}>
            Quel que soit ton point de départ, il y a un parcours pour toi.
          </p>
          <div style={{ marginTop: 20 }}><ArabesqueDivider color="rgba(200,167,39,0.4)" /></div>
        </div>

        <div className="reveal-stagger-alt" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: 20
        }}>
          {parcours.map((p, i) => {
            // Each card gets a unique dark gradient anchored to its accent colour
            const cardBgs = [
            `linear-gradient(155deg, rgba(18,58,32,0.94) 0%, rgba(3,12,6,0.97) 100%)`,
            `linear-gradient(155deg, rgba(10,28,48,0.94) 0%, rgba(3,8,18,0.97) 100%)`,
            `linear-gradient(155deg, rgba(36,32,8,0.94) 0%, rgba(10,8,3,0.97) 100%)`,
            `linear-gradient(155deg, rgba(46,14,14,0.92) 0%, rgba(14,4,4,0.97) 100%)`];

            const cardBorders = [
            `rgba(78,222,128,0.22)`,
            `rgba(96,165,250,0.22)`,
            `rgba(200,167,39,0.3)`,
            `rgba(248,113,113,0.22)`];

            return (
              <div key={i} style={{
                background: cardBgs[i],
                border: `1px solid ${cardBorders[i]}`,
                borderRadius: 20, padding: '28px 24px',
                position: 'relative', overflow: 'hidden',
                boxShadow: `0 8px 36px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)`,
                transition: 'all 0.3s',
                cursor: 'default'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = `0 16px 52px rgba(0,0,0,0.65), 0 0 28px ${p.dot}22, inset 0 1px 0 rgba(255,255,255,0.07)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = `0 8px 36px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)`;
              }}>

              {/* Top accent line */}
              <div style={{
                  position: 'absolute', top: 0, left: '8%', right: '8%', height: 2,
                  background: `linear-gradient(90deg, transparent, ${p.dot}88, transparent)`
                }} />
              {/* Corner glow */}
              <div style={{
                  position: 'absolute', top: -30, right: -30, width: 100, height: 100,
                  background: `radial-gradient(circle, ${p.dot}22 0%, transparent 70%)`,
                  pointerEvents: 'none'
                }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: p.dot, boxShadow: `0 0 10px ${p.dot}99`, flexShrink: 0 }} />
                  <h3 style={{ fontWeight: 700, fontSize: 17, color: '#fff' }}>{p.level}</h3>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, marginBottom: 20 }}>
                  {p.desc}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {p.tags.map((tag, j) =>
                    <span key={j} style={{
                      background: `${p.dot}18`, color: p.dot,
                      border: `1px solid ${p.dot}44`,
                      fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 100,
                      letterSpacing: '0.03em'
                    }}>{tag}</span>
                    )}
                </div>
              </div>
            </div>);

          })}
        </div>
      </div>
    </section>);

}

/* ─── Importance de l'islam ─── */
function ImportanceSection() {
  const pillars = [
  {
    emoji: "🌿",
    title: "Une paix intérieure profonde",
    desc: "L'islam n'est pas qu'une religion — c'est un mode de vie complet. Chaque connaissance acquise apaise l'âme, ancre le cœur et donne un sens à chaque journée."
  },
  {
    emoji: "📖",
    title: "Comprendre ce que tu récites",
    desc: "Tu lis le Coran chaque jour — mais en saisir le sens transforme ta relation à Allah. La connaissance est la clé qui ouvre la porte de chaque sourate."
  },
  {
    emoji: "🕌",
    title: "Vivre l'islam pleinement",
    desc: "Connaître les piliers, l'histoire et les prophètes, c'est être fier de sa foi. C'est répondre aux questions de tes proches avec assurance et clarté."
  },
  {
    emoji: "🌙",
    title: "Une récompense qui dure",
    desc: "« Celui qui emprunte un chemin pour acquérir un savoir, Allah lui facilite un chemin vers le Paradis. » — Sahih Muslim. Chaque verset appris est une lumière."
  },
  {
    emoji: "🤝",
    title: "Transmettre à ceux qu'on aime",
    desc: "Enseigner à ses enfants, répondre à un ami curieux, expliquer à sa famille — le savoir islamique est un cadeau que tu peux offrir à chaque instant."
  },
  {
    emoji: "⚡",
    title: "Se reconnecter en 5 minutes",
    desc: "Pas besoin d'une heure. Un quiz, une histoire, une écoute. Héritage Musulman s'adapte à ta vie pour que la foi reste vivante, même dans l'agitation du quotidien."
  }];


  return (
    <section style={{
      padding: '100px 24px',
      background: 'transparent',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Lueurs */}
      <div style={{ position: 'absolute', top: '10%', left: '-8%', width: 560, height: 560, background: 'radial-gradient(circle, rgba(26,92,53,0.5) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '5%', right: '-6%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(200,167,39,0.11) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '45%', left: '50%', transform: 'translate(-50%,-50%)', width: 900, height: 600, background: 'radial-gradient(ellipse, rgba(26,92,53,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* En-tête */}
        <div className="reveal-scale" style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 16 }}>✦ POURQUOI APPRENDRE</p>
          <h2 style={{
            fontFamily: 'Playfair Display, serif', fontWeight: 900,
            fontSize: 'clamp(32px, 5vw, 56px)', color: '#fff',
            lineHeight: 1.15, margin: '0 0 24px'
          }}>
            L'islam mérite d'être<br />
            <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>vraiment compris.</span>
          </h2>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(17px, 2.2vw, 22px)',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 560, margin: '0 auto',
            lineHeight: 1.7
          }}>Pas pour les autres. Pour toi. Pour la paix que tu ressens quand tu sais pourquoi tu fais ce que tu fais.</p>
        </div>

        {/* Grille de pilliers */}
        <div className="reveal-stagger" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 28
        }}>
          {pillars.map((p, i) =>
          <div key={i} style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: '32px 28px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(145deg, rgba(26,92,53,0.18) 0%, rgba(200,167,39,0.04) 100%)';
            e.currentTarget.style.borderColor = 'rgba(200,167,39,0.25)';
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
              {/* Accent top */}
              <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(200,167,39,0.3), transparent)' }} />
              <div style={{ fontSize: 38, marginBottom: 18, lineHeight: 1 }}>{p.emoji}</div>
              <h3 style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: 700, fontSize: 19,
              color: '#fff', marginBottom: 12, lineHeight: 1.3
            }}>{p.title}</h3>
              <p style={{
              fontSize: 14, lineHeight: 1.8,

              fontFamily: 'Plus Jakarta Sans, sans-serif', color: "rgb(217, 175, 10)"
            }}>{p.desc}</p>
            </div>
          )}
        </div>

        {/* Citation centrale */}
        <div className="reveal" style={{ textAlign: 'center', marginTop: 72, maxWidth: 700, margin: '72px auto 0' }}>
          <div style={{ width: 40, height: 2, background: 'var(--gold)', margin: '0 auto 28px', opacity: 0.5 }} />
          <p style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(20px, 3vw, 28px)',
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 1.6,
            letterSpacing: '0.01em'
          }}>
            « Demandez le savoir du berceau jusqu'à la tombe. »
          </p>
          <p style={{ marginTop: 16, fontSize: 13, color: 'var(--gold)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>SUNAN AL-TIRMIDHI, N° 74</p>
          <div style={{ width: 40, height: 2, background: 'var(--gold)', margin: '28px auto 0', opacity: 0.5 }} />
        </div>

      </div>
    </section>);

}


/* ─── Learn & Play Section ─── */
function LearnPlaySection({ navigate }) {
  const benefits = [
    { icon: '🧠', title: 'Tu retiens sans effort', desc: 'Le jeu active la mémoire à long terme. Ce que tu apprends en jouant reste gravé bien plus profondément qu\'un cours classique.' },
    { icon: '🔥', title: 'Tu te dépasses à chaque session', desc: 'Chaque bonne réponse te pousse plus loin. Chaque erreur devient une leçon. Le défi permanent maintient ta progression.' },
    { icon: '🤍', title: 'Tu renforces ta foi en t\'amusant', desc: 'Reconnaître une sourate à l\'oreille, répondre juste sur les prophètes — chaque victoire te rapproche de ton deen.' },
  ];
  return (
    <section style={{ background: 'linear-gradient(180deg, #020a04 0%, #030d06 100%)', padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* bg glow left */}
      <div style={{ position: 'absolute', top: '30%', left: '-10%', width: 500, height: 500, background: 'radial-gradient(ellipse, rgba(200,167,39,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
      {/* bg glow right */}
      <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: 400, height: 400, background: 'radial-gradient(ellipse, rgba(100,60,200,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="reveal-blur" style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(200,167,39,0.1)', border: '1px solid rgba(200,167,39,0.25)', borderRadius: 20, padding: '6px 18px', marginBottom: 20 }}>
            <span style={{ fontSize: 13 }}>🎮</span>
            <span style={{ color: '#c8a727', fontSize: 13, fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '0.05em' }}>BLIND TEST & QUIZ</span>
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 200, fontStyle: 'italic', fontSize: 'clamp(36px, 5vw, 62px)', color: '#fff', margin: '0 0 16px', lineHeight: 1.1, letterSpacing: '-1px' }}>
            Apprends ton deen.<br /><span style={{ color: '#c8a727' }}>Sans t'en rendre compte.</span>
          </h2>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.5)', maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
            Le vrai apprentissage ne ressemble pas à une leçon. Il ressemble à un jeu qu'on n'a pas envie d'arrêter.
          </p>
        </div>

        {/* Main layout */}
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 72 }}>

          {/* LEFT — Mockups */}
          <div className="reveal-left" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 420, width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
              <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Aperçu interactif</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* Blind Test card */}
            <div style={{ background: 'linear-gradient(145deg,rgba(18,10,2,0.95),rgba(8,6,2,0.98))', border: '1px solid rgba(200,167,39,0.22)', borderRadius: 22, overflow: 'hidden', position: 'relative' }}>
              {/* Top bar */}
              <div style={{ background: 'rgba(200,167,39,0.08)', borderBottom: '1px solid rgba(200,167,39,0.12)', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15 }}>🎵</span>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 13, color: '#fff' }}>Blind Test Coran</span>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, color: '#c8a727', fontWeight: 700 }}>7/10</span>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, color: '#fb923c', fontWeight: 700 }}>🔥 ×3</span>
                </div>
              </div>
              <div style={{ padding: '20px 18px' }}>
                {/* Player */}
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: '16px', marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(200,167,39,0.3),rgba(200,167,39,0.08))', border: '1.5px solid rgba(200,167,39,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>▶</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 28 }}>
                        {[5,9,14,11,19,15,22,17,12,20,16,11,21,14,10,17,12,15,19,11,9,14,6,10,16,12,20,15,8,12].map((h,i) => (
                          <div key={i} style={{ flex: 1, height: h, borderRadius: 2, background: i < 16 ? `rgba(200,167,39,${0.5+i*0.03})` : 'rgba(255,255,255,0.1)' }} />
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>0:18</span>
                        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>0:45</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Question */}
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Quelle est cette sourate ?</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
                  {[{l:'Al-Fatiha',ok:false},{l:'Al-Baqara',ok:false},{l:'Al-Kahf',ok:true},{l:'Al-Imran',ok:false}].map((s,i) => (
                    <div key={i} style={{ background: s.ok ? 'rgba(34,197,94,0.15)' : i===0 ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${s.ok ? 'rgba(34,197,94,0.5)' : i===0 ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 10, padding: '10px 8px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, color: s.ok ? '#4ade80' : i===0 ? '#f87171' : 'rgba(255,255,255,0.5)', fontWeight: s.ok ? 800 : 400, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                      {s.ok && '✓ '}{i===0 && '✗ '}{s.l}
                    </div>
                  ))}
                </div>
                {/* Bonne réponse banner */}
                <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>✅</span>
                  <div>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, fontWeight: 800, color: '#4ade80', margin: 0 }}>Bonne réponse !</p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Sourate 18 — La Caverne (Al-Kahf)</p>
                  </div>
                  <span style={{ marginLeft: 'auto', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, color: '#c8a727', fontWeight: 800 }}>+10 pts</span>
                </div>
              </div>
            </div>

            {/* Quiz card */}
            <div style={{ background: 'linear-gradient(145deg,rgba(4,12,24,0.97),rgba(2,6,14,0.99))', border: '1px solid rgba(96,165,250,0.2)', borderRadius: 22, overflow: 'hidden', position: 'relative' }}>
              {/* Top bar */}
              <div style={{ background: 'rgba(96,165,250,0.06)', borderBottom: '1px solid rgba(96,165,250,0.1)', padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 15 }}>🧠</span>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 13, color: '#fff' }}>Quiz — Les Prophètes</span>
                </div>
                <div style={{ background: 'rgba(200,167,39,0.15)', border: '1px solid rgba(200,167,39,0.3)', borderRadius: 20, padding: '2px 10px' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 10, color: '#c8a727', fontWeight: 700 }}>Amateur</span>
                </div>
              </div>
              <div style={{ padding: '18px' }}>
                {/* Question num + timer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Question 4 / 10</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 20, padding: '2px 10px' }}>
                    <span style={{ fontSize: 11 }}>⏱</span>
                    <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, color: '#f87171', fontWeight: 700 }}>12s</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
                  <div style={{ width: '38%', height: '100%', background: 'linear-gradient(90deg,#60a5fa,#818cf8)', borderRadius: 2 }} />
                </div>
                {/* Question */}
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: 14, padding: '14px 16px', marginBottom: 14 }}>
                  <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, color: '#fff', margin: 0, lineHeight: 1.55, fontWeight: 600 }}>Dans quelle ville le Prophète ﷺ est-il né ?</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[{l:'Médine',s:'wrong'},{l:'La Mecque',s:'correct'},{l:'Jérusalem',s:''},{l:'Taïf',s:''}].map((a,i) => (
                    <div key={i} style={{ background: a.s==='correct'?'rgba(34,197,94,0.12)':a.s==='wrong'?'rgba(239,68,68,0.08)':'rgba(255,255,255,0.03)', border:`1.5px solid ${a.s==='correct'?'rgba(34,197,94,0.4)':a.s==='wrong'?'rgba(239,68,68,0.25)':'rgba(255,255,255,0.07)'}`, borderRadius: 11, padding: '11px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: a.s==='correct'?'rgba(34,197,94,0.2)':a.s==='wrong'?'rgba(239,68,68,0.15)':'rgba(255,255,255,0.06)', border:`1.5px solid ${a.s==='correct'?'#4ade80':a.s==='wrong'?'#f87171':'rgba(255,255,255,0.15)'}`, display:'flex',alignItems:'center',justifyContent:'center', fontSize: 11, color: a.s==='correct'?'#4ade80':a.s==='wrong'?'#f87171':'rgba(255,255,255,0.3)', fontWeight:800 }}>
                          {a.s==='correct'?'✓':a.s==='wrong'?'✗':['A','B','C','D'][i]}
                        </div>
                        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, color: a.s==='correct'?'#4ade80':a.s==='wrong'?'#f87171':'rgba(255,255,255,0.6)', fontWeight: a.s?700:400 }}>{a.l}</span>
                      </div>
                      {a.s==='correct' && <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, color: '#c8a727', fontWeight: 800 }}>+10 pts</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Benefits */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 380, justifyContent: 'center' }}>
            <div className="reveal-stagger-alt" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {benefits.map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(200,167,39,0.1)', border: '1px solid rgba(200,167,39,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{b.icon}</div>
                  <div>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 15, color: '#fff', margin: '0 0 6px' }}>{b.title}</p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.48)', margin: 0, lineHeight: 1.65 }}>{b.desc}</p>
                  </div>
                </div>
              ))}

              {/* Quote */}
              <div style={{ background: 'rgba(200,167,39,0.06)', border: '1px solid rgba(200,167,39,0.15)', borderRadius: 16, padding: '18px 20px' }}>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 17, color: 'rgba(255,255,255,0.7)', margin: '0 0 8px', lineHeight: 1.6 }}>
                  "Cherchez la science du berceau jusqu'à la tombe."
                </p>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, color: 'rgba(200,167,39,0.6)', margin: 0, fontWeight: 600, letterSpacing: '0.04em' }}>— Hadith</p>
              </div>
            </div>

            {/* CTA buttons — outside stagger so always visible */}
            <div className="reveal-blur" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: '0 0 4px', textAlign: 'center', letterSpacing: '0.04em' }}>Essaie maintenant — c'est gratuit</p>
              <button onClick={() => navigate('blind-test')} style={{ width: '100%', background: 'linear-gradient(135deg,#c8a727,#a8891f)', border: 'none', color: '#fff', padding: '14px 20px', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 4px 16px rgba(200,167,39,0.3)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(200,167,39,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(200,167,39,0.3)'; }}>
                🎵 Jouer au Blind Test →
              </button>
              <button onClick={() => navigate('quiz')} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '13px 20px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; }}>
                🧠 Tester le Quiz →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Studio Viral Section ─── */
function StudioViralSection({ navigate }) {
  const stats = [
    { value: '847M', label: 'vues #islam sur TikTok en 2024', icon: '🔥' },
    { value: '×12', label: 'croissance contenu islamique FR', icon: '📈' },
    { value: '100%', label: 'contenu vérifié islamiquement', icon: '🕌' },
  ];
  const phones = [
    { views: '2.4M', likes: '187K', comments: '4.2K', shares: '43K', user: '@nour_islamique', tag: '#coran #fyp #islam' },
    { views: '1.1M', likes: '94K', comments: '2.1K', shares: '28K', user: '@deen_content', tag: '#rappel #islamfr #fyp' },
  ];
  // Reel de versets qui défile dans les téléphones — effet "studio vivant"
  const VERSE_REEL = [
    { arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', fr: 'Au nom d\'Allah, le Tout Miséricordieux', ref: 'Al-Fatiha · V.1' },
    { arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', fr: 'Celui qui s\'en remet à Allah, Il lui suffit', ref: 'At-Talaq · V.3' },
    { arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', fr: 'À côté de la difficulté est, certes, une facilité', ref: 'Ash-Sharh · V.6' },
    { arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ', fr: 'Souvenez-vous de Moi, Je Me souviendrai de vous', ref: 'Al-Baqara · V.152' },
    { arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', fr: 'Ô mon Seigneur, accrois mes connaissances', ref: 'Ta-Ha · V.114' },
    { arabic: 'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ', fr: 'C\'est par l\'évocation d\'Allah que les cœurs s\'apaisent', ref: 'Ar-Ra\'d · V.28' },
  ];
  const [reelIdx, setReelIdx] = React.useState(0);
  React.useEffect(function () {
    const id = setInterval(function () {
      setReelIdx(function (v) { return (v + 1) % VERSE_REEL.length; });
    }, 3400);
    return function () { clearInterval(id); };
  }, []);
  return (
    <section style={{ background: 'linear-gradient(180deg, #030d06 0%, #020a04 100%)', padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* bg glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, background: 'radial-gradient(ellipse, rgba(200,167,39,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="reveal-drop" style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(200,167,39,0.1)', border: '1px solid rgba(200,167,39,0.25)', borderRadius: 20, padding: '6px 18px' }}>
              <span style={{ fontSize: 13 }}>🎬</span>
              <span style={{ color: '#c8a727', fontSize: 13, fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '0.05em' }}>STUDIO VIDÉO</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '6px 14px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              <span style={{ color: '#4ade80', fontSize: 12, fontWeight: 800, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '0.08em' }}>NOUVEAU</span>
            </div>
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 200, fontStyle: 'italic', fontSize: 'clamp(48px, 7vw, 82px)', color: '#fff', margin: '0 0 22px', lineHeight: 1.05, letterSpacing: '-2px' }}>
            Des hassanats.<br /><span style={{ color: '#c8a727' }}>Pour ta communauté.</span>
          </h2>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(16px, 1.8vw, 20px)', color: 'rgba(255,255,255,0.52)', maxWidth: 600, margin: '0 auto 20px', lineHeight: 1.8 }}>
            Le contenu islamique explose sur TikTok et YouTube. Crée tes vidéos en quelques clics — et poste. Chaque partage peut être une sadaqa jariya : une bonne action qui continue de porter ses fruits tant que quelqu'un la regarde.
          </p>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 'clamp(18px, 2vw, 22px)', color: 'rgba(200,167,39,0.65)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            « Celui qui guide vers le bien obtient la même récompense que celui qui le fait. » — Sahih Muslim
          </p>
        </div>

        {/* Main layout: phones + stats */}
        <div className="studio-viral-layout" style={{ display: 'flex', gap: 48, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>

          {/* Phone mockups */}
          <div className="reveal-zoom studio-viral-phones" style={{ display: 'flex', gap: 28, alignItems: 'flex-end' }}>
            {phones.map((p, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, transform: i === 0 ? 'rotate(-3deg)' : 'rotate(2.5deg) translateY(18px)', flexShrink: 0 }}>
                {/* Views badge — ABOVE phone */}
                <div style={{ background: 'linear-gradient(135deg,#c8a727,#a8891f)', borderRadius: 20, padding: '5px 14px', boxShadow: '0 4px 16px rgba(200,167,39,0.45)', whiteSpace: 'nowrap' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, color: '#fff', fontWeight: 900 }}>👁 {p.views} vues</span>
                </div>
                {/* Phone frame */}
                <div style={{ width: 188, background: 'linear-gradient(145deg,#1c1c1c,#0c0c0c)', borderRadius: 38, padding: '10px 7px 10px', boxShadow: '0 28px 72px rgba(0,0,0,0.85), 0 0 0 1.5px rgba(255,255,255,0.09), inset 0 1px 0 rgba(255,255,255,0.07)', position: 'relative' }}>
                  {/* Dynamic island */}
                  <div style={{ width: 72, height: 10, background: '#000', borderRadius: 20, margin: '0 auto 6px', border: '1px solid rgba(255,255,255,0.05)' }} />
                  {/* Screen — pure black like studio output */}
                  <div style={{ borderRadius: 28, overflow: 'hidden', height: 336, background: '#000', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                    {/* TikTok top bar */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px 0 6px', position: 'relative', zIndex: 3 }}>
                      <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>Pour toi</span>
                    </div>
                    {/* CENTER — Arabic subtitle (studio output, verset qui défile) */}
                    {(function () {
                      const v = VERSE_REEL[(reelIdx + i) % VERSE_REEL.length];
                      return (
                        <div key={reelIdx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 14px', gap: 8, animation: 'verseSwap 3.4s ease-in-out' }}>
                          <div style={{ fontFamily: '"Amiri", serif', fontSize: 20, color: '#e6c84a', direction: 'rtl', textAlign: 'center', lineHeight: 1.8, }}>{v.arabic}</div>
                          <div style={{ width: 32, height: 1, background: 'rgba(200,167,39,0.3)' }} />
                          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.55)', textAlign: 'center', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>{v.fr}</p>
                          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 8, color: 'rgba(200,167,39,0.5)', margin: 0, fontWeight: 700 }}>{v.ref}</p>
                        </div>
                      );
                    })()}
                    {/* Bottom gradient */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 130, background: 'linear-gradient(to top,rgba(0,0,0,0.95) 0%,transparent 100%)', zIndex: 2 }} />
                    {/* Right-side TikTok actions */}
                    <div style={{ position: 'absolute', right: 7, bottom: 68, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, zIndex: 3 }}>
                      {[['❤️',p.likes],['💬',p.comments],['↪️',p.shares]].map(([icon,val]) => (
                        <div key={icon} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <span style={{ fontSize: 18 }}>{icon}</span>
                          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 8, color: '#fff', fontWeight: 700 }}>{val}</span>
                        </div>
                      ))}
                    </div>
                    {/* Bottom user row */}
                    <div style={{ position: 'absolute', bottom: 14, left: 10, right: 46, zIndex: 3 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg,#c8a727,#6b3f0a)', border: '1.5px solid #fff', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 9, color: '#fff', fontWeight: 800 }}>{p.user}</span>
                        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 4, padding: '1px 6px', marginLeft: 2, border: '1px solid rgba(255,255,255,0.3)' }}>
                          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 7, color: '#fff', fontWeight: 700 }}>+ Suivre</span>
                        </div>
                      </div>
                      <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{p.tag}</p>
                    </div>
                    {/* Progress bar */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.08)', zIndex: 4 }}>
                      <div style={{ width: i===0?'38%':'61%', height: '100%', background: 'rgba(255,255,255,0.5)' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats column */}
          <div className="reveal-stagger studio-viral-stats" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 340 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,167,39,0.15)', borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'center' }}>
                <span style={{ fontSize: 28 }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: 'Cinzel, serif', fontSize: 28, color: '#c8a727', fontWeight: 700, lineHeight: 1, letterSpacing: '0.04em' }}>{s.value}</div>
                  <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
                </div>
              </div>
            ))}

            {/* Reach block */}
            <div style={{ background: 'linear-gradient(135deg,rgba(200,167,39,0.1),rgba(200,167,39,0.04))', border: '1px solid rgba(200,167,39,0.28)', borderRadius: 16, padding: '20px 20px' }}>
              <div style={{ fontFamily: 'Cinzel, sans-serif', fontSize: 28, color: '#e6c84a', fontWeight: 700, lineHeight: 1, marginBottom: 4 }}>847M</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, fontWeight: 700, color: 'rgba(200,167,39,0.7)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>🔥 vues #islam sur TikTok en 2024</div>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12.5, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.7 }}>
                Le contenu islamique est l'un des plus partagés sur les réseaux. Chaque vidéo que tu crées peut toucher des milliers de personnes.
              </p>
            </div>

            {/* Sadaqa jariya block */}
            <div style={{ background: 'rgba(200,167,39,0.05)', border: '1px solid rgba(200,167,39,0.16)', borderRadius: 16, padding: '18px 20px' }}>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, fontWeight: 800, color: '#c8a727', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>🤲 Sadaqa Jariya numérique</div>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12.5, color: 'rgba(255,255,255,0.58)', margin: 0, lineHeight: 1.7 }}>
                Chaque vue est une bonne action qui perdure. Une adoration qui continue même quand tu dors — tant que la vidéo tourne.
              </p>
            </div>

            {/* Clarté prix — Gratuit vs Pro */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1, background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.22)', borderRadius: 14, padding: '14px 14px' }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, fontWeight: 800, color: '#4ade80', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Gratuit</div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: 22, color: '#fff', fontWeight: 700, lineHeight: 1 }}>0€</div>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11.5, color: 'rgba(255,255,255,0.55)', margin: '8px 0 0', lineHeight: 1.6 }}>Aperçu illimité · <strong style={{ color: '#fff' }}>1 vidéo</strong> à télécharger</p>
              </div>
              <div style={{ flex: 1, background: 'linear-gradient(135deg,rgba(200,167,39,0.14),rgba(200,167,39,0.05))', border: '1px solid rgba(200,167,39,0.4)', borderRadius: 14, padding: '14px 14px', position: 'relative' }}>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, fontWeight: 800, color: '#e6c84a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Pro ✦</div>
                <div style={{ fontFamily: 'Cinzel, serif', fontSize: 22, color: '#e6c84a', fontWeight: 700, lineHeight: 1 }}>7,99€<span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 400 }}>/mois</span></div>
                <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11.5, color: 'rgba(255,255,255,0.6)', margin: '8px 0 0', lineHeight: 1.6 }}>Vidéos <strong style={{ color: '#fff' }}>illimitées</strong> · tous les jeux Pro</p>
              </div>
            </div>

            <button onClick={() => navigate('studio')} style={{ background: 'linear-gradient(135deg,#c8a727,#a8891f)', border: 'none', color: '#fff', padding: '15px 24px', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 4px 20px rgba(200,167,39,0.35)', transition: 'all 0.2s', textAlign: 'center' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(200,167,39,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,167,39,0.35)'; }}>
              🎬 Créer ma première vidéo →
            </button>
            <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.45)', textAlign: 'center', margin: '2px 0 0' }}>
              ✓ Aperçu gratuit, sans compte · ✓ sans carte bancaire
            </p>
          </div>
        </div>

        {/* Bottom social proof bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 36, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {['TikTok • #islamfr', 'YouTube • #coranfrancais', 'Instagram • #rappelislamique', 'Facebook • #musulmansfrancophones'].map((tag) => (
            <div key={tag} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '7px 16px' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>📌 {tag}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FaqSection() {
  const [open, setOpen] = React.useState(null);

  const faqs = [
    {
      q: 'Est-ce vraiment gratuit ? Sans carte bancaire ?',
      a: 'Oui, complètement. Le compte gratuit donne accès aux aperçus de chaque fonctionnalité sans aucune limite de temps. Aucune carte bancaire n\'est demandée à l\'inscription. Tu passes à Pro uniquement si tu veux le contenu illimité.'
    },
    {
      q: 'Je ne suis pas bon(ne) en islam — c\'est fait pour moi ?',
      a: 'Absolument. Le Blind Test et le Quiz s\'adaptent à tous les niveaux. Les questions vont du très accessible au plus avancé. C\'est même là que le jeu est le plus utile : tu apprends sans pression, à ton rythme, en t\'amusant.'
    },
    {
      q: 'Le Studio Vidéo, c\'est compliqué à utiliser ?',
      a: 'Non, c\'est pensé pour être aussi simple que possible. Tu choisis une sourate et un récitateur (ou ton propre audio), un fond, et la vidéo se génère en quelques secondes avec les sous-titres arabe + traduction synchronisés et le format adapté aux Reels / TikTok / YouTube. Zéro compétence en montage requise. Et au-delà de la technique — chaque vidéo que tu partages peut être une sadaqa jariya : une bonne action qui continue de porter ses fruits tant que quelqu\'un la regarde ou la partage.'
    },
    {
      q: 'Est-ce que je peux résilier quand je veux ?',
      a: 'Oui, sans condition. L\'abonnement Pro est mensuel et résiliable en un clic depuis ton profil. Aucun engagement, aucune pénalité. Tu restes abonné jusqu\'à la fin du mois en cours, puis retour au compte gratuit.'
    },
    {
      q: 'Les vidéos générées sont-elles fiables islamiquement ?',
      a: 'Les versets proviennent directement de l\'API Al-Quran Cloud, source reconnue. Les traductions françaises utilisées sont soigneusement sélectionnées. Si tu constates une erreur, tu peux nous le signaler directement — nous corrigeons rapidement.'
    },
    {
      q: 'Combien ça coûte, et pourquoi pas gratuit à 100% ?',
      a: 'L\'offre de lancement est à 3,99€ le 1er mois (−50%), puis 7,99€/mois, sans engagement et résiliable en 1 clic. L\'hébergement, les API et le développement continu ont un coût réel : cet abonnement nous permet de maintenir la plateforme, d\'ajouter du contenu chaque semaine et de ne dépendre d\'aucune publicité. Un tarif volontairement accessible — moins d\'un café par semaine — pour que l\'apprentissage islamique reste à la portée de tous.'
    },
  ];

  return (
    <section style={{ padding: '100px 24px 80px', background: '#030d06' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <div className="reveal-blur" style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{ display: 'inline-block', background: 'rgba(200,167,39,0.1)', border: '1px solid rgba(200,167,39,0.25)', borderRadius: 20, padding: '5px 16px', fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 12, color: 'rgba(200,167,39,0.9)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 18 }}>
            Questions fréquentes
          </span>
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(24px,3.5vw,36px)', color: '#f0ede6', lineHeight: 1.25 }}>
            Tu as des questions ?<br />
            <span style={{ color: '#c8a727' }}>On a les réponses.</span>
          </h2>
        </div>

        {/* Accordion */}
        <div className="reveal-blur" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map(function(faq, i) {
            const isOpen = open === i;
            return (
              <div key={i}
                onClick={function() { setOpen(isOpen ? null : i); }}
                style={{
                  background: isOpen ? 'rgba(200,167,39,0.06)' : 'rgba(255,255,255,0.02)',
                  border: isOpen ? '1px solid rgba(200,167,39,0.3)' : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: '20px 24px',
                  cursor: 'pointer',
                  transition: 'background 0.3s, border-color 0.3s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, fontWeight: 600, color: isOpen ? '#e6c84a' : '#f0ede6', transition: 'color 0.3s', lineHeight: 1.4 }}>
                    {faq.q}
                  </span>
                  <span style={{ fontSize: 18, color: 'rgba(200,167,39,0.7)', flexShrink: 0, transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s', display: 'inline-block' }}>+</span>
                </div>
                {isOpen && (
                  <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, color: 'rgba(240,237,230,0.6)', lineHeight: 1.7, marginTop: 14, borderTop: '1px solid rgba(200,167,39,0.12)', paddingTop: 14 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="reveal-blur" style={{ textAlign: 'center', marginTop: 48 }}>
          <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, color: 'rgba(240,237,230,0.4)' }}>
            Autre question ?{' '}
            <a href="mailto:ayyb.34@gmail.com" style={{ color: 'rgba(200,167,39,0.7)', textDecoration: 'none', borderBottom: '1px solid rgba(200,167,39,0.3)' }}>
              Écris-nous
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Témoignages (preuve sociale réelle) ─── */
function Testimonials() {
  const reviews = [
    { t: "Incroyable site, j'aime beaucoup les blind tests : ils me permettent d'apprendre les sourates que je ne connaissais pas, ou de mieux apprendre celles que je connais.", n: 'Fatima' },
    { t: 'Site très instructif et amusant, surtout les blind tests !!', n: 'Ahmed' },
    { t: 'Je le recommande, tout est complet et très bien expliqué.', n: 'Yacine' },
    { t: "J'aime beaucoup le site, il m'aide beaucoup.", n: 'Amadou' },
    { t: 'Très bon site instructif, il m\'aide beaucoup à l\'apprentissage.', n: 'Mathis' },
    { t: 'Bon site, fluide et très bien pour l\'apprentissage.', n: 'Haitam' },
    { t: 'Ta plateforme est magnifique.', n: 'Mohtar' },
    { t: "Il est vraiment pas mal, j'aime bien.", n: 'Albash' },
  ];
  return (
    <section style={{ padding: '70px 24px 60px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ color: '#e6c84a', fontSize: 18, letterSpacing: 2 }}>★★★★★</span>
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 'clamp(24px,4vw,40px)', color: '#fff', letterSpacing: '-0.5px', marginBottom: 10 }}>
          Ils apprennent déjà avec <span style={{ color: '#c8a727' }}>Héritage Musulman</span>
        </h2>
        <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>
          Rejoins <strong style={{ color: '#e6c84a' }}>+90 musulmans</strong> qui révisent leur Deen en s'amusant.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, textAlign: 'left' }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,167,39,0.18)', borderRadius: 16, padding: '22px 22px 18px' }}>
              <div style={{ color: '#e6c84a', fontSize: 13, letterSpacing: 1.5, marginBottom: 10 }}>★★★★★</div>
              <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14.5, color: 'rgba(255,255,255,0.82)', lineHeight: 1.6, margin: '0 0 14px' }}>« {r.t} »</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#1f6f4a,#0b1a11)', border: '1.5px solid rgba(200,167,39,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: 15, color: '#e6c84a' }}>{r.n[0]}</div>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13.5, fontWeight: 700, color: '#fff' }}>{r.n}</span>
                <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, color: 'rgba(74,222,128,0.8)', marginLeft: 'auto' }}>✓ Membre</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SoftPaywall({ navigate }) {
  const { user, openAuth, openQuickCheckout, isPro } = useAuth();
  if (isPro) return null;
  return (
    <section style={{
      padding: '80px 24px 100px',
      background: 'linear-gradient(180deg, rgba(200,167,39,0.06) 0%, rgba(0,0,0,0.3) 100%)',
      textAlign: 'center',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 600, background: 'radial-gradient(ellipse, rgba(200,167,39,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div className="reveal-flip" style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Countdown live réel */}
        <div className="soft-paywall-countdown" style={{ marginBottom: 24 }}>
          <OfferCountdown />
        </div>

        <h2 style={{
          fontFamily: 'Playfair Display, serif', fontWeight: 900,
          fontSize: 'clamp(26px,4.5vw,44px)', color: '#fff',
          letterSpacing: '-0.5px', lineHeight: 1.15, marginBottom: 16
        }}>
          Connais vraiment ta religion.<br />
          <span style={{ color: '#c8a727' }}>Pas juste les bases.</span>
        </h2>

        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 32, maxWidth: 540, margin: '0 auto 32px' }}>
          Débloque tous les niveaux, les 114 sourates et le Studio.<br />
          Et chaque vidéo de récitation que tu crées et partages devient une <strong style={{ color: '#c8a727' }}>sadaqa jariya</strong> — une aumône qui continue de te rapporter, même après ta mort.
        </p>

        {/* Value stack */}
        <div className="soft-paywall-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 36, textAlign: 'left' }}>
          {[
            { icon: '📖', title: 'Comprendre le Coran', desc: 'Toutes les sourates, mot à mot' },
            { icon: '🧠', title: 'Quiz illimités', desc: 'Tous niveaux, toutes catégories' },
            { icon: '🎵', title: 'Blind test complet', desc: '114 sourates à reconnaître' },
            { icon: '🎬', title: 'Studio vidéo', desc: 'Crée & télécharge tes clips' },
            { icon: '📅', title: 'Nouveau contenu', desc: 'Chaque semaine incha\'Allah' },
          ].map((item) => (
            <div key={item.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,167,39,0.15)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Price anchor */}
        <div className="soft-paywall-price-row" style={{ marginBottom: 24, display:'flex', alignItems:'baseline', justifyContent:'center', flexWrap:'wrap', gap:6 }}>
          {(window.HM_FOUNDER && window.HM_FOUNDER()) ? (
            <OfferPrice big={42} />
          ) : (
            <>
              <span className="price-strike-new" style={{ fontFamily: 'Playfair Display, serif', fontSize: 38, fontWeight: 900, color: '#c8a727' }}>7,99€</span>
              <span className="price-strike-label" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>/mois · offre de lancement</span>
            </>
          )}
        </div>

        {/* CTA buttons */}
        <div className="soft-paywall-btns" style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <button onClick={() => openQuickCheckout()} style={{
            background: 'linear-gradient(135deg, #c8a727 0%, #a8891f 100%)',
            border: 'none', color: '#0a1a08', padding: '18px 44px', borderRadius: 14,
            fontSize: 16.5, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 6px 32px rgba(200,167,39,0.45)',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            width: 'auto', maxWidth: '100%', whiteSpace: 'nowrap',
            margin: '0 auto',
            transition: 'all 0.2s',
            letterSpacing: '0.02em'
          }}
          onMouseEnter={(e) => {e.currentTarget.style.boxShadow='0 8px 40px rgba(200,167,39,0.65)';e.currentTarget.style.transform='translateY(-2px)';}}
          onMouseLeave={(e) => {e.currentTarget.style.boxShadow='0 6px 32px rgba(200,167,39,0.45)';e.currentTarget.style.transform='translateY(0)';}}>
            {(window.HM_FOUNDER && window.HM_FOUNDER()) ? "🔓 Débloquer l'accès — 3,99€" : "🔓 Débloquer l'accès — 7,99€/mois"}
          </button>
          <div style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.22)', borderRadius:10, padding:'8px 14px', display:'flex', alignItems:'center', justifyContent:'center', gap:6, flexWrap:'wrap' }}>
            <span style={{ color:'#4ade80', fontSize:14, flexShrink:0 }}>✓</span>
            <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.72)' }}>Sans engagement — annule quand tu veux</span>
            <span style={{ color:'rgba(255,255,255,0.3)' }}>·</span>
            <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.72)' }}>Remboursé sous 48h si non utilisé</span>
          </div>
          <div style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:11, color:'rgba(255,255,255,0.25)', marginTop:8, textAlign:'center' }}>
            Moins d'un café par semaine pour enrichir ton Deen · 🔒 Paiement sécurisé
          </div>
        </div>
      </div>
    </section>);
}

/* ─── Start / Découverte Page ─── */
function StartPage({ navigate }) {
  const { openAuth, user, isPro, openQuickCheckout } = useAuth();
  const firstName = user && user.displayName ? user.displayName.split(' ')[0] : null;
  const [bottomVis, setBottomVis] = React.useState(false);
  const bottomRef = React.useRef(null);

  React.useEffect(function() {
    if (!bottomRef.current) return;
    var obs = new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) { setBottomVis(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(bottomRef.current);
    return function() { obs.disconnect(); };
  }, []);

  const ACTS = [
    {
      icon: '📖', tag: 'NOUVEAU', tagColor: '#c8a727', tagRgb: '200,167,39',
      title: 'Comprends le Coran',
      desc: 'Apprends le Coran mot à mot, verset par verset, avec audio et phonétique. Quelques dizaines de mots suffisent à saisir une grande partie du Coran — comprends enfin ce que tu récites dans ta prière.',
      free: ['Al-Fâtiha & Al-Ikhlâs — illimité', 'Audio & phonétique inclus', 'Progression sauvegardée'],
      pro: ['Toutes les sourates débloquées', 'Nouvelles sourates chaque semaine', 'Suivi de progression complet'],
      cta: '📖 Essayer Comprendre le Coran', page: 'comprendre',
    },
    {
      icon: '🎵', tag: 'POPULAIRE', tagColor: '#4ade80', tagRgb: '74,222,128',
      title: 'Blind Test Coran',
      desc: 'Reconnais les sourates à l\'oreille. Un format addictif qui grave les versets dans ta mémoire — sans effort, en jouant.',
      free: ['Niveau Débutant illimité', 'Score en temps réel', 'Toutes les parties que tu veux'],
      pro: ['114 sourates — accès complet', 'Tous les niveaux & récitateurs', 'Statistiques de progression', 'Défis illimités'],
      cta: '🎵 Essayer le Blind Test', page: 'blind-test',
    },
    {
      icon: '🧠', tag: 'ENRICHISSANT', tagColor: '#4ade80', tagRgb: '74,222,128',
      title: 'Quiz Islamiques',
      desc: 'Prophètes, histoire, jurisprudence, Coran. Des centaines de questions vérifiées, structurées par niveau de connaissance.',
      free: ['Niveau Débutant illimité', 'Tous les thèmes en aperçu', 'Score sauvegardé'],
      pro: ['Niveaux Amateur & Avancé débloqués', 'Quiz illimités', 'Toutes catégories', 'Corrections détaillées'],
      cta: '🧠 Essayer le Quiz', page: 'quiz',
    },
    {
      icon: '🎬', tag: null, tagColor: '#a78bfa', tagRgb: '167,139,250',
      title: 'Studio Vidéo',
      desc: 'Crée des vidéos de récitation avec sous-titres arabes & français. Chaque partage peut être une sadaqa jariya — une adoration qui perdure tant que la vidéo tourne.',
      free: ['Créer & prévisualiser', 'Personnalisation de base', 'Aperçu en direct'],
      pro: ['Téléchargement HD sans watermark', 'Tous les styles visuels', 'Export illimité'],
      cta: '🎬 Essayer le Studio', page: 'studio',
    },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#030e08 0%,#040f0a 60%,#071209 100%)', color:'#f0ede6', overflowX:'hidden' }}>
      <Navbar navigate={navigate} />

      {/* ── Ambient glows ── */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0 }}>
        <div style={{ position:'absolute', top:'8%', left:'10%', width:500, height:500, background:'radial-gradient(circle,rgba(200,167,39,0.07) 0%,transparent 70%)', animation:'spGlowPulse 4s ease-in-out infinite' }} />
        <div style={{ position:'absolute', top:'40%', right:'5%', width:400, height:400, background:'radial-gradient(circle,rgba(74,222,128,0.05) 0%,transparent 70%)', animation:'spGlowPulse 5s ease-in-out infinite 1.5s' }} />
        <div style={{ position:'absolute', bottom:'15%', left:'20%', width:350, height:350, background:'radial-gradient(circle,rgba(167,139,250,0.05) 0%,transparent 70%)', animation:'spGlowPulse 6s ease-in-out infinite 3s' }} />
      </div>

      {/* ── Hero ── */}
      <div style={{ position:'relative', zIndex:1, textAlign:'center', padding:'clamp(90px,15vw,130px) 20px 64px' }}>

        {/* Badge */}
        <div className="sp-1" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(200,167,39,0.09)', border:'1px solid rgba(200,167,39,0.25)', borderRadius:100, padding:'7px 20px', marginBottom:36 }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#c8a727', animation:'spGlowPulse 2s infinite', flexShrink:0, display:'inline-block' }} />
          <span style={{ fontSize:11.5, color:'rgba(200,167,39,0.9)', fontFamily:'Plus Jakarta Sans,sans-serif', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase' }}>Plateforme islamique 100% francophone</span>
        </div>

        {/* Titre principal */}
        <div className="sp-2" style={{ maxWidth:780, margin:'0 auto 10px' }}>
          <h1 style={{ fontFamily:'Cinzel,serif', fontSize:'clamp(28px,5vw,60px)', color:'#f0ede6', fontWeight:700, lineHeight:1.15, margin:0 }}>
            Trois façons de renforcer<br />
            <span style={{ position:'relative', display:'inline-block' }}>
              <span style={{ color:'#c8a727' }}>ta foi.</span>
              {/* Underline animée */}
              <span style={{ position:'absolute', bottom:-4, left:0, height:2, background:'linear-gradient(90deg,#c8a727,#e6c84a)', borderRadius:2, animation:'spLineGrow 0.9s cubic-bezier(0.16,1,0.3,1) 0.8s both', width:'100%' }} />
            </span>
          </h1>
        </div>

        {/* Sous-titre — adapté selon état user */}
        {user && isPro ? (
          <p className="sp-3" style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:'clamp(15px,1.8vw,18px)', color:'rgba(240,237,230,0.48)', maxWidth:520, margin:'22px auto 40px', lineHeight:1.8 }}>
            {firstName ? <><strong style={{color:'rgba(200,167,39,0.8)'}}>{firstName}</strong>, </> : ''}<strong style={{color:'rgba(240,237,230,0.7)'}}>accès complet débloqué.</strong> Quiz, Blind Test et Studio t'attendent — sans limite.
          </p>
        ) : user && !isPro ? (
          <p className="sp-3" style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:'clamp(15px,1.8vw,18px)', color:'rgba(240,237,230,0.48)', maxWidth:540, margin:'22px auto 40px', lineHeight:1.8 }}>
            {firstName ? <>Content de te revoir <strong style={{color:'rgba(200,167,39,0.8)'}}>{firstName}</strong> 👋</> : 'Content de te revoir 👋'} <strong style={{color:'rgba(240,237,230,0.7)'}}>On continue à apprendre ?</strong> Choisis une activité et lance-toi.
          </p>
        ) : (
          <p className="sp-3" style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:'clamp(15px,1.8vw,18px)', color:'rgba(240,237,230,0.48)', maxWidth:520, margin:'22px auto 40px', lineHeight:1.8 }}>
            Blind Test · Quiz islamiques · Studio Vidéo — <strong style={{ color:'rgba(240,237,230,0.7)', fontWeight:600 }}>tout est gratuit pour commencer.</strong>
          </p>
        )}

        {/* CTA — jouer d'abord (gratuit + inscrit non-Pro), upsell discret ensuite */}
        {!isPro ? (
          <div className="sp-4" style={{ display:'flex', flexDirection:'column', gap:12, width:'100%', maxWidth:460, margin:'0 auto' }}>
            <button onClick={function(){ navigate('blind-test'); }}
              style={{ background:'linear-gradient(135deg,#c8a727,#e6c84a)', border:'none', color:'#1a0e00', padding:'17px 24px', borderRadius:14, fontSize:16, fontWeight:800, cursor:'pointer', fontFamily:'Plus Jakarta Sans,sans-serif', boxShadow:'0 6px 28px rgba(200,167,39,0.42)', transition:'all 0.2s', letterSpacing:'-0.1px', width:'100%' }}
              onMouseEnter={function(e){ e.currentTarget.style.transform='scale(1.03)'; e.currentTarget.style.boxShadow='0 8px 36px rgba(200,167,39,0.6)'; }}
              onMouseLeave={function(e){ e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 6px 28px rgba(200,167,39,0.42)'; }}>
              🎵 Jouer au Blind Test
            </button>
            <div style={{ display:'flex', gap:12 }}>
              <button onClick={function(){ navigate('quiz'); }}
                style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(74,222,128,0.3)', color:'#fff', padding:'15px 16px', borderRadius:13, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'Plus Jakarta Sans,sans-serif', transition:'all 0.2s' }}
                onMouseEnter={function(e){ e.currentTarget.style.background='rgba(74,222,128,0.12)'; }}
                onMouseLeave={function(e){ e.currentTarget.style.background='rgba(255,255,255,0.05)'; }}>
                🧠 Quiz
              </button>
              <button onClick={function(){ navigate('studio'); }}
                style={{ flex:1, background:'rgba(255,255,255,0.05)', border:'1.5px solid rgba(167,139,250,0.3)', color:'#fff', padding:'15px 16px', borderRadius:13, fontSize:15, fontWeight:700, cursor:'pointer', fontFamily:'Plus Jakarta Sans,sans-serif', transition:'all 0.2s' }}
                onMouseEnter={function(e){ e.currentTarget.style.background='rgba(167,139,250,0.12)'; }}
                onMouseLeave={function(e){ e.currentTarget.style.background='rgba(255,255,255,0.05)'; }}>
                🎬 Studio
              </button>
            </div>
            {user ? (
              <>
                <p style={{ marginTop:4, fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:13, color:'rgba(240,237,230,0.4)', textAlign:'center', lineHeight:1.6 }}>
                  Niveau Débutant gratuit · rejoue autant que tu veux 🎯
                </p>
                {/* upsell discret — sous les boutons, jamais en barrage */}
                <div onClick={function(){ openQuickCheckout(); }} style={{ cursor:'pointer', background:'rgba(200,167,39,0.07)', border:'1px solid rgba(200,167,39,0.22)', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginTop:2 }}>
                  <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12.5, color:'rgba(240,237,230,0.6)' }}>
                    🔓 Tous les niveaux, 114 sourates & le Studio — <strong style={{ color:'#e6c84a' }}>3,99€ le 1er mois</strong> →
                  </span>
                </div>
              </>
            ) : (
              <>
                <p style={{ marginTop:4, fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:13, color:'rgba(240,237,230,0.4)', textAlign:'center', lineHeight:1.6 }}>
                  100% gratuit · sans carte · joue sans compte 🎯
                </p>
                <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12.5, color:'rgba(240,237,230,0.3)', textAlign:'center' }}>
                  Déjà un compte ? <span onClick={openAuth} style={{ color:'#c8a727', cursor:'pointer', textDecoration:'underline' }}>Se connecter</span>
                </p>
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* ── Séparateur titre section ── */}
      <div style={{ position:'relative', zIndex:1, textAlign:'center', marginBottom:8 }}>
        <p style={{ fontFamily:'Cinzel,serif', fontSize:10.5, color:'rgba(200,167,39,0.45)', letterSpacing:'0.18em', textTransform:'uppercase' }}>◆ Les activités</p>
      </div>

      {/* ── Activity cards ── */}
      <div style={{ position:'relative', zIndex:1, maxWidth:1140, margin:'0 auto', padding:'16px 20px 88px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:26 }}>
        {ACTS.map(function(act, idx) {
          return (
            <div key={act.title} className={'sp-card sp-card-'+idx} style={{ background:'linear-gradient(160deg,rgba(255,255,255,0.025) 0%,rgba(255,255,255,0.01) 100%)', border:'1px solid rgba('+act.tagRgb+',0.2)', borderRadius:24, padding:'34px 28px', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden', boxShadow:'0 4px 32px rgba(0,0,0,0.4)' }}>

              {/* Ambient glow coin */}
              <div style={{ position:'absolute', top:-50, right:-50, width:160, height:160, background:'radial-gradient(circle,rgba('+act.tagRgb+',0.12) 0%,transparent 70%)', pointerEvents:'none', animation:'spGlowPulse '+(3+idx)+'s ease-in-out infinite' }} />
              {/* Bottom glow */}
              <div style={{ position:'absolute', bottom:-30, left:-30, width:100, height:100, background:'radial-gradient(circle,rgba('+act.tagRgb+',0.07) 0%,transparent 70%)', pointerEvents:'none' }} />

              {/* Tag */}
              {act.tag && <span style={{ display:'inline-block', fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:10, fontWeight:800, letterSpacing:'0.13em', color:act.tagColor, background:'rgba('+act.tagRgb+',0.1)', border:'1px solid rgba('+act.tagRgb+',0.25)', borderRadius:6, padding:'3px 10px', marginBottom:22, alignSelf:'flex-start' }}>{act.tag}</span>}

              {/* Icon */}
              <div style={{ fontSize:38, marginBottom:14, lineHeight:1 }}>{act.icon}</div>

              {/* Title */}
              <h2 style={{ fontFamily:'Cinzel,serif', fontSize:20, color:'#f0ede6', marginBottom:12, fontWeight:600, lineHeight:1.3 }}>{act.title}</h2>

              {/* Desc */}
              <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:13.5, color:'rgba(240,237,230,0.48)', lineHeight:1.8, marginBottom:28, flexGrow:1 }}>{act.desc}</p>

              {/* Pro block (Pro users only) */}
              {isPro ? (
                <div style={{ background:'rgba('+act.tagRgb+',0.07)', border:'1px solid rgba('+act.tagRgb+',0.22)', borderRadius:12, padding:'16px 18px', marginBottom:24 }}>
                  <div style={{ marginBottom:12 }}>
                    <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:10, fontWeight:800, color:act.tagColor, letterSpacing:'0.12em', textTransform:'uppercase' }}>✦ Ton abonnement Pro — accès complet</span>
                  </div>
                  {act.pro.map(function(p) {
                    return (
                      <div key={p} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:8 }}>
                        <span style={{ color:act.tagColor, fontSize:12, flexShrink:0, fontWeight:700 }}>✦</span>
                        <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:13, color:'rgba(240,237,230,0.82)' }}>{p}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  {/* Free block */}
                  <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:12, padding:'16px 18px', marginBottom:16 }}>
                    <div style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:10, fontWeight:800, color:'rgba(240,237,230,0.25)', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:12 }}>GRATUIT — dès l'inscription</div>
                    {act.free.map(function(f) {
                      return (
                        <div key={f} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:8 }}>
                          <span style={{ color:'#4ade80', fontSize:12, flexShrink:0, fontWeight:700 }}>✓</span>
                          <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:13, color:'rgba(240,237,230,0.55)' }}>{f}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pro block */}
                  <div style={{ background:'rgba('+act.tagRgb+',0.05)', border:'1px solid rgba('+act.tagRgb+',0.15)', borderRadius:12, padding:'16px 18px', marginBottom:24 }}>
                    <div style={{ marginBottom:12, display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                      <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:10, fontWeight:800, color:act.tagColor, letterSpacing:'0.12em', textTransform:'uppercase' }}>{(window.HM_FOUNDER && window.HM_FOUNDER()) ? "✦ PRO — 3,99€ le 1er mois" : "✦ PRO — 7,99€/mois"}</span>
                      
                    </div>
                    {act.pro.map(function(p) {
                      return (
                        <div key={p} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:8 }}>
                          <span style={{ color:act.tagColor, fontSize:12, flexShrink:0, fontWeight:700 }}>✦</span>
                          <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:13, color:'rgba(240,237,230,0.72)' }}>{p}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* CTA */}
              <button onClick={function(){ navigate(act.page); }}
                style={{ background:'rgba('+act.tagRgb+',0.1)', border:'1.5px solid rgba('+act.tagRgb+',0.32)', color:act.tagColor, padding:'14px', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'Plus Jakarta Sans,sans-serif', width:'100%', transition:'all 0.2s', letterSpacing:'-0.1px' }}
                onMouseEnter={function(e){ e.currentTarget.style.background='rgba('+act.tagRgb+',0.22)'; e.currentTarget.style.transform='scale(1.02)'; }}
                onMouseLeave={function(e){ e.currentTarget.style.background='rgba('+act.tagRgb+',0.1)'; e.currentTarget.style.transform='scale(1)'; }}>
                {isPro ? '✦ Commencer →' : act.cta + ' →'}
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Section bas — Tout débloquer ── */}
      <div ref={bottomRef} style={{ position:'relative', zIndex:1, background:'linear-gradient(180deg,rgba(200,167,39,0.05) 0%,rgba(200,167,39,0.02) 100%)', borderTop:'1px solid rgba(200,167,39,0.12)', padding:'80px 24px 90px', textAlign:'center' }}>
        <div className={bottomVis ? 'sp-bottom' : ''} style={{ maxWidth:740, margin:'0 auto', opacity: bottomVis ? undefined : 0 }}>
          {isPro ? (
            <div style={{ marginBottom:48 }}>
              <p style={{ fontFamily:'Cinzel,serif', fontSize:11, color:'rgba(200,167,39,0.5)', letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:18 }}>◆ Accès Pro actif</p>
              <h2 style={{ fontFamily:'Cinzel,serif', fontSize:'clamp(22px,4vw,40px)', color:'#f0ede6', marginBottom:16, lineHeight:1.2 }}>
                Tout est débloqué.<br />
                <span style={{ color:'#c8a727' }}>Explore librement.</span>
              </h2>
              <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:16, color:'rgba(240,237,230,0.43)', lineHeight:1.8, maxWidth:420, margin:'0 auto' }}>
                Quiz, Blind Test, Studio Vidéo — tout est à toi, sans limite.
              </p>
            </div>
          ) : (
            <>
              {/* Rappel : pourquoi apprendre sa religion ne peut pas attendre */}
              <p style={{ fontFamily:'Cormorant Garamond,Georgia,serif', fontSize:'clamp(16px,2vw,19px)', fontStyle:'italic', color:'rgba(240,237,230,0.6)', maxWidth:520, margin:'0 auto 28px', lineHeight:1.7 }}>
                « La recherche du savoir est une obligation pour tout musulman. » — Chaque jour sans apprendre est un jour qui ne reviendra pas.
              </p>

              <p style={{ fontFamily:'Cinzel,serif', fontSize:11, color:'rgba(200,167,39,0.5)', letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:18 }}>◆ Accès complet</p>
              <h2 style={{ fontFamily:'Cinzel,serif', fontSize:'clamp(24px,4.5vw,46px)', color:'#f0ede6', marginBottom:16, lineHeight:1.2 }}>
                Un abonnement.<br />
                <span style={{ color:'#c8a727' }}>Trois activités. Sans limite.</span>
              </h2>
              <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:16, color:'rgba(240,237,230,0.43)', lineHeight:1.8, maxWidth:460, margin:'0 auto 24px' }}>
                Accède à tout ce que la plateforme a à offrir. Sans engagement. Résiliable en un clic, à tout moment.
              </p>

              {/* PRIX — gros, central, mis en valeur */}
              <div style={{ background:'linear-gradient(160deg,rgba(200,167,39,0.1) 0%,rgba(200,167,39,0.03) 100%)', border:'1.5px solid rgba(200,167,39,0.35)', borderRadius:24, padding:'36px 28px', maxWidth:480, margin:'0 auto 16px', boxShadow:'0 8px 50px rgba(200,167,39,0.12)' }}>
                {(window.HM_FOUNDER && window.HM_FOUNDER()) ? (
                  <OfferPrice big={52} />
                ) : (
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, flexWrap:'wrap' }}>
                    <span style={{ fontFamily:'Playfair Display,serif', fontSize:40, fontWeight:900, color:'#c8a727' }}>7,99€/mois</span>
                    <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:11, color:'rgba(200,167,39,0.6)', background:'rgba(200,167,39,0.1)', border:'1px solid rgba(200,167,39,0.25)', borderRadius:20, padding:'2px 10px' }}>offre lancement</span>
                  </div>
                )}
                <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:13, color:'rgba(240,237,230,0.5)', marginTop:16, lineHeight:1.6 }}>
                  Moins cher qu'un kebab par mois — pour un savoir qui te suit toute ta vie.
                </p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center', marginTop:18 }}>
                  {['✓ Sans engagement', '✓ Résiliable à tout moment, en 1 clic', '✓ Sans carte bancaire pour démarrer'].map(function(t) {
                    return (
                      <span key={t} style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, fontWeight:600, color:'#7bc99a', background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.25)', borderRadius:20, padding:'5px 12px' }}>{t}</span>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(155px,1fr))', gap:14, maxWidth:720, margin:'0 auto 52px' }}>
            {[['🎵','Blind Test illimité'],['🧠','Quiz tous niveaux'],['🎬','Studio + téléchargement HD'],['📱','Mobile & tablette'],['🆕','Nouveautés chaque semaine'],['🕌','Soutien communauté FR']].map(function(item,i) {
              return (
                <div key={item[1]} className="sp-feat" style={{ background:'rgba(200,167,39,0.05)', border:'1px solid rgba(200,167,39,0.14)', borderRadius:16, padding:'20px 12px', textAlign:'center', animation:'spCardIn 0.6s cubic-bezier(0.16,1,0.3,1) '+(bottomVis ? (0.05+i*0.08)+'s' : '9999s')+' both' }}>
                  <div style={{ fontSize:26, marginBottom:10 }}>{item[0]}</div>
                  <div style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12.5, color:'rgba(240,237,230,0.62)', fontWeight:500, lineHeight:1.5 }}>{item[1]}</div>
                </div>
              );
            })}
          </div>

          {isPro ? (
            <button onClick={function(){ navigate('blind-test'); }}
              style={{ background:'linear-gradient(135deg,#c8a727,#e6c84a)', border:'none', color:'#1a0e00', padding:'17px 56px', borderRadius:15, fontSize:16.5, fontWeight:800, cursor:'pointer', fontFamily:'Plus Jakarta Sans,sans-serif', boxShadow:'0 8px 36px rgba(200,167,39,0.45)', marginBottom:16, transition:'all 0.2s' }}
              onMouseEnter={function(e){ e.currentTarget.style.transform='scale(1.04)'; }}
              onMouseLeave={function(e){ e.currentTarget.style.transform='scale(1)'; }}>
              ✦ Commencer une activité →
            </button>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(220,50,50,0.12)', border:'1px solid rgba(220,50,50,0.35)', borderRadius:30, padding:'6px 18px', marginBottom:18, animation:'pulseUrgent 2.2s ease-in-out infinite' }}>
                <span style={{ fontSize:13 }}>⏳</span>
                <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12.5, fontWeight:800, color:'#ff7070', letterSpacing:'0.06em' }}>⚡ Offre de lancement -50% — expire bientôt</span>
              </div>
              <button onClick={function(){ openQuickCheckout(); }}
                style={{ background:'linear-gradient(135deg,#c8a727,#e6c84a)', border:'none', color:'#1a0e00', padding:'20px 60px', borderRadius:16, fontSize:18, fontWeight:800, cursor:'pointer', fontFamily:'Plus Jakarta Sans,sans-serif', boxShadow:'0 10px 44px rgba(200,167,39,0.55)', marginBottom:14, transition:'all 0.2s', display:'inline-block', maxWidth:'100%' }}
                onMouseEnter={function(e){ e.currentTarget.style.transform='scale(1.04)'; e.currentTarget.style.boxShadow='0 12px 56px rgba(200,167,39,0.75)'; }}
                onMouseLeave={function(e){ e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 10px 44px rgba(200,167,39,0.55)'; }}>
                {user ? '🔓 Débloquer l\'accès complet →' : 'Accéder à l\'offre →'}
              </button>
              <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12.5, color:'rgba(240,237,230,0.35)', margin:'0 0 4px' }}>
                Tu ne perds rien à essayer : résiliable en 1 clic, à tout moment.
              </p>
            </div>
          )}
          <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, color:'rgba(240,237,230,0.2)' }}>
            {isPro ? 'Accès illimité · Quiz · Blind Test · Studio' : user ? 'Moins d\'un café par semaine · résiliable en 1 clic' : 'Sans carte bancaire pour démarrer · 100% en français'}
          </p>
        </div>
      </div>

      <Footer navigate={navigate} />
    </div>
  );
}

/* ─── Footer ─── */
function Footer({ navigate }) {
  navigate = navigate || function(){};
  const socials = [
  { name: 'TikTok', icon:
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z" />
      </svg>
  },
  { name: 'Instagram', icon:
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
  },
  { name: 'YouTube', icon:
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
  }];


  return (
    <footer style={{
      background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, #071f12 100%)',
      padding: '56px 24px 32px',
      color: 'rgba(255,255,255,0.7)'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 40,
          justifyContent: 'space-between', marginBottom: 48
        }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <CrescentLogo size={140} />
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>
              La plateforme islamique francophone pour apprendre, jouer et progresser dans ta foi.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {socials.map((s) =>
              <a key={s.name} href="#" style={{
                width: 38, height: 38, borderRadius: 10,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {e.currentTarget.style.background = 'rgba(200,167,39,0.2)';e.currentTarget.style.color = '#c8a727';e.currentTarget.style.borderColor = 'rgba(200,167,39,0.4)';}}
              onMouseLeave={(e) => {e.currentTarget.style.background = 'rgba(255,255,255,0.08)';e.currentTarget.style.color = 'rgba(255,255,255,0.7)';e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';}}>
                  {s.icon}
                </a>
              )}
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Contenu</p>
              {['Blind test Coran', 'Quiz islamiques', 'Studio vidéo'].map((l) =>
              <a key={l} href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 14, marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.target.style.color = '#c8a727'}
              onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.55)'}>{l}</a>
              )}
            </div>
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Légal</p>
              {[
                { label:'Mentions légales',            page:'mentions-legales' },
                { label:'Politique de confidentialité', page:'confidentialite' },
                { label:'CGV',                          page:'cgu' },
                { label:'Contact',                      page:null, href:'mailto:contact.heritagemusulman@gmail.com' },
              ].map(function(l) {
                return (
                  <a key={l.label}
                    href={l.href || '#'}
                    onClick={l.page ? function(e){ e.preventDefault(); navigate(l.page); window.scrollTo(0,0); } : undefined}
                    style={{ display:'block', color:'rgba(255,255,255,0.55)', textDecoration:'none', fontSize:14, marginBottom:10, transition:'color 0.2s', cursor:'pointer' }}
                    onMouseEnter={function(e){ e.target.style.color='#c8a727'; }}
                    onMouseLeave={function(e){ e.target.style.color='rgba(255,255,255,0.55)'; }}>
                    {l.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: 24,
          display: 'flex', flexWrap: 'wrap', gap: 16,
          justifyContent: 'space-between', alignItems: 'center'
        }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            © 2026 Héritage Musulman. Tous droits réservés.
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            Fait avec <span style={{ color: '#c8a727' }}>✦</span> pour la communauté francophone
          </p>
        </div>
      </div>
    </footer>);

}

/* ─── Blind Test Page ─── */
const SURAHS = [
{ n: 1, ar: 'الفاتحة', fr: 'Al-Fatiha', a: 7 }, { n: 2, ar: 'البقرة', fr: 'Al-Baqara', a: 286 }, { n: 3, ar: 'آل عمران', fr: 'Al-Imran', a: 200 },
{ n: 4, ar: 'النساء', fr: 'An-Nisa', a: 176 }, { n: 5, ar: 'المائدة', fr: 'Al-Maida', a: 120 }, { n: 6, ar: 'الأنعام', fr: 'Al-Anam', a: 165 },
{ n: 7, ar: 'الأعراف', fr: 'Al-Araf', a: 206 }, { n: 8, ar: 'الأنفال', fr: 'Al-Anfal', a: 75 }, { n: 9, ar: 'التوبة', fr: 'At-Tawba', a: 129 },
{ n: 10, ar: 'يونس', fr: 'Yunus', a: 109 }, { n: 11, ar: 'هود', fr: 'Hud', a: 123 }, { n: 12, ar: 'يوسف', fr: 'Yusuf', a: 111 },
{ n: 13, ar: 'الرعد', fr: 'Ar-Rad', a: 43 }, { n: 14, ar: 'إبراهيم', fr: 'Ibrahim', a: 52 }, { n: 15, ar: 'الحجر', fr: 'Al-Hijr', a: 99 },
{ n: 16, ar: 'النحل', fr: 'An-Nahl', a: 128 }, { n: 17, ar: 'الإسراء', fr: 'Al-Isra', a: 111 }, { n: 18, ar: 'الكهف', fr: 'Al-Kahf', a: 110 },
{ n: 19, ar: 'مريم', fr: 'Maryam', a: 98 }, { n: 20, ar: 'طه', fr: 'Ta-Ha', a: 135 }, { n: 21, ar: 'الأنبياء', fr: 'Al-Anbiya', a: 112 },
{ n: 22, ar: 'الحج', fr: 'Al-Hajj', a: 78 }, { n: 23, ar: 'المؤمنون', fr: 'Al-Muminun', a: 118 }, { n: 24, ar: 'النور', fr: 'An-Nur', a: 64 },
{ n: 25, ar: 'الفرقان', fr: 'Al-Furqan', a: 77 }, { n: 26, ar: 'الشعراء', fr: 'Ash-Shuara', a: 227 }, { n: 27, ar: 'النمل', fr: 'An-Naml', a: 93 },
{ n: 28, ar: 'القصص', fr: 'Al-Qasas', a: 88 }, { n: 29, ar: 'العنكبوت', fr: 'Al-Ankabut', a: 69 }, { n: 30, ar: 'الروم', fr: 'Ar-Rum', a: 60 },
{ n: 31, ar: 'لقمان', fr: 'Luqman', a: 34 }, { n: 32, ar: 'السجدة', fr: 'As-Sajda', a: 30 }, { n: 33, ar: 'الأحزاب', fr: 'Al-Ahzab', a: 73 },
{ n: 34, ar: 'سبأ', fr: 'Saba', a: 54 }, { n: 35, ar: 'فاطر', fr: 'Fatir', a: 45 }, { n: 36, ar: 'يس', fr: 'Ya-Sin', a: 83 },
{ n: 37, ar: 'الصافات', fr: 'As-Saffat', a: 182 }, { n: 38, ar: 'ص', fr: 'Sad', a: 88 }, { n: 39, ar: 'الزمر', fr: 'Az-Zumar', a: 75 },
{ n: 40, ar: 'غافر', fr: 'Ghafir', a: 85 }, { n: 41, ar: 'فصلت', fr: 'Fussilat', a: 54 }, { n: 42, ar: 'الشورى', fr: 'Ash-Shura', a: 53 },
{ n: 43, ar: 'الزخرف', fr: 'Az-Zukhruf', a: 89 }, { n: 44, ar: 'الدخان', fr: 'Ad-Dukhan', a: 59 }, { n: 45, ar: 'الجاثية', fr: 'Al-Jathiya', a: 37 },
{ n: 46, ar: 'الأحقاف', fr: 'Al-Ahqaf', a: 35 }, { n: 47, ar: 'محمد', fr: 'Muhammad', a: 38 }, { n: 48, ar: 'الفتح', fr: 'Al-Fath', a: 29 },
{ n: 49, ar: 'الحجرات', fr: 'Al-Hujurat', a: 18 }, { n: 50, ar: 'ق', fr: 'Qaf', a: 45 }, { n: 51, ar: 'الذاريات', fr: 'Adh-Dhariyat', a: 60 },
{ n: 52, ar: 'الطور', fr: 'At-Tur', a: 49 }, { n: 53, ar: 'النجم', fr: 'An-Najm', a: 62 }, { n: 54, ar: 'القمر', fr: 'Al-Qamar', a: 55 },
{ n: 55, ar: 'الرحمن', fr: 'Ar-Rahman', a: 78 }, { n: 56, ar: 'الواقعة', fr: 'Al-Waqia', a: 96 }, { n: 57, ar: 'الحديد', fr: 'Al-Hadid', a: 29 },
{ n: 58, ar: 'المجادلة', fr: 'Al-Mujadila', a: 22 }, { n: 59, ar: 'الحشر', fr: 'Al-Hashr', a: 24 }, { n: 60, ar: 'الممتحنة', fr: 'Al-Mumtahana', a: 13 },
{ n: 61, ar: 'الصف', fr: 'As-Saff', a: 14 }, { n: 62, ar: 'الجمعة', fr: 'Al-Jumua', a: 11 }, { n: 63, ar: 'المنافقون', fr: 'Al-Munafiqun', a: 11 },
{ n: 64, ar: 'التغابن', fr: 'At-Taghabun', a: 18 }, { n: 65, ar: 'الطلاق', fr: 'At-Talaq', a: 12 }, { n: 66, ar: 'التحريم', fr: 'At-Tahrim', a: 12 },
{ n: 67, ar: 'الملك', fr: 'Al-Mulk', a: 30 }, { n: 68, ar: 'القلم', fr: 'Al-Qalam', a: 52 }, { n: 69, ar: 'الحاقة', fr: 'Al-Haqqa', a: 52 },
{ n: 70, ar: 'المعارج', fr: 'Al-Maarij', a: 44 }, { n: 71, ar: 'نوح', fr: 'Nuh', a: 28 }, { n: 72, ar: 'الجن', fr: 'Al-Jinn', a: 28 },
{ n: 73, ar: 'المزمل', fr: 'Al-Muzzammil', a: 20 }, { n: 74, ar: 'المدثر', fr: 'Al-Muddaththir', a: 56 }, { n: 75, ar: 'القيامة', fr: 'Al-Qiyama', a: 40 },
{ n: 76, ar: 'الإنسان', fr: 'Al-Insan', a: 31 }, { n: 77, ar: 'المرسلات', fr: 'Al-Mursalat', a: 50 }, { n: 78, ar: 'النبأ', fr: 'An-Naba', a: 40 },
{ n: 79, ar: 'النازعات', fr: 'An-Naziat', a: 46 }, { n: 80, ar: 'عبس', fr: 'Abasa', a: 42 }, { n: 81, ar: 'التكوير', fr: 'At-Takwir', a: 29 },
{ n: 82, ar: 'الانفطار', fr: 'Al-Infitar', a: 19 }, { n: 83, ar: 'المطففين', fr: 'Al-Mutaffifin', a: 36 }, { n: 84, ar: 'الانشقاق', fr: 'Al-Inshiqaq', a: 25 },
{ n: 85, ar: 'البروج', fr: 'Al-Buruj', a: 22 }, { n: 86, ar: 'الطارق', fr: 'At-Tariq', a: 17 }, { n: 87, ar: 'الأعلى', fr: 'Al-Ala', a: 19 },
{ n: 88, ar: 'الغاشية', fr: 'Al-Ghashiya', a: 26 }, { n: 89, ar: 'الفجر', fr: 'Al-Fajr', a: 30 }, { n: 90, ar: 'البلد', fr: 'Al-Balad', a: 20 },
{ n: 91, ar: 'الشمس', fr: 'Ash-Shams', a: 15 }, { n: 92, ar: 'الليل', fr: 'Al-Layl', a: 21 }, { n: 93, ar: 'الضحى', fr: 'Ad-Duha', a: 11 },
{ n: 94, ar: 'الشرح', fr: 'Ash-Sharh', a: 8 }, { n: 95, ar: 'التين', fr: 'At-Tin', a: 8 }, { n: 96, ar: 'العلق', fr: 'Al-Alaq', a: 19 },
{ n: 97, ar: 'القدر', fr: 'Al-Qadr', a: 5 }, { n: 98, ar: 'البينة', fr: 'Al-Bayyina', a: 8 }, { n: 99, ar: 'الزلزلة', fr: 'Az-Zalzala', a: 8 },
{ n: 100, ar: 'العاديات', fr: 'Al-Adiyat', a: 11 }, { n: 101, ar: 'القارعة', fr: 'Al-Qaria', a: 11 }, { n: 102, ar: 'التكاثر', fr: 'At-Takathur', a: 8 },
{ n: 103, ar: 'العصر', fr: 'Al-Asr', a: 3 }, { n: 104, ar: 'الهمزة', fr: 'Al-Humaza', a: 9 }, { n: 105, ar: 'الفيل', fr: 'Al-Fil', a: 5 },
{ n: 106, ar: 'قريش', fr: 'Quraysh', a: 4 }, { n: 107, ar: 'الماعون', fr: 'Al-Maun', a: 7 }, { n: 108, ar: 'الكوثر', fr: 'Al-Kawthar', a: 3 },
{ n: 109, ar: 'الكافرون', fr: 'Al-Kafirun', a: 6 }, { n: 110, ar: 'النصر', fr: 'An-Nasr', a: 3 }, { n: 111, ar: 'المسد', fr: 'Al-Masad', a: 5 },
{ n: 112, ar: 'الإخلاص', fr: 'Al-Ikhlas', a: 4 }, { n: 113, ar: 'الفلق', fr: 'Al-Falaq', a: 5 }, { n: 114, ar: 'الناس', fr: 'An-Nas', a: 6 }];


const RECITERS = [
{ id: 'Alafasy_128kbps', name: 'Mishary Alafasy' },
{ id: 'Abdurrahmaan_As-Sudais_192kbps', name: 'Abdurrahman As-Sudais' },
{ id: 'Saood_ash-Shuraym_128kbps', name: 'Saoud Ash-Shuraym' },
{ id: 'Yasser_Ad-Dussary_128kbps', name: 'Yasser Al Dossari' },
{ id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit' },
{ id: 'Husary_128kbps', name: 'Mahmoud Al-Husary' },
{ id: 'Nasser_Alqatami_128kbps', name: 'Nasser Al-Qatami' },
{ id: 'MaherAlMuaiqly128kbps', name: 'Maher Al-Muaiqly' }];


function rnd(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;}
function pad3(n) {return String(n).padStart(3, '0');}

const DEBUTANT_NBS = new Set([1, 94, 97, 102, 103, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114]);
const DIFF_POOLS = {
  debutant: SURAHS.filter((s) => DEBUTANT_NBS.has(s.n)), // 15 sourates choisies
  amateur: SURAHS.filter((s) => s.n >= 36), // 79 sourates
  avance: SURAHS // toutes
};

function BlindTestPage({ navigate }) {
  const { user, isPro } = useAuth();
  const [state, setState] = React.useState('idle');
  const [difficulty, setDifficulty] = React.useState(null);
  const [question, setQuestion] = React.useState(null);
  const [chosen, setChosen] = React.useState(null);
  const [score, setScore] = React.useState({ ok: 0, total: 0 });
  const [streak, setStreak] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [verseText, setVerseText] = React.useState(null);
  const [reciterId, setReciterId] = React.useState(null);
  const [sessionCount, setSessionCount] = React.useState(0); // questions répondues
  const [sessionOk, setSessionOk] = React.useState(0); // bonnes réponses session
  const [showProGate, setShowProGate] = React.useState(false);
  const [showGuestGate, setShowGuestGate] = React.useState(false);
  const audioRef = React.useRef(null);

  const SESSION_SIZE = 10;
  const NEXT_DIFF = { debutant: 'amateur', amateur: 'avance', avance: null };

  React.useEffect(() => () => {if (audioRef.current) audioRef.current.pause();}, []);

  function buildQuestion(diff, fallbackId) {
    const pool = DIFF_POOLS[diff];
    const surahIdx = rnd(0, pool.length - 1);
    const surah = pool[surahIdx];
    const ayah = rnd(1, surah.a);
    const effectiveId = fallbackId !== undefined ? fallbackId : reciterId;
    const reciter = effectiveId ? RECITERS.find((r) => r.id === effectiveId) : RECITERS[rnd(0, RECITERS.length - 1)];

    const wrongSet = new Set([surah.n]);
    while (wrongSet.size < 3) wrongSet.add(pool[rnd(0, pool.length - 1)].n);
    const choices = [...wrongSet].
    filter((n) => n !== surah.n).slice(0, 2).
    map((n) => SURAHS.find((s) => s.n === n)).
    concat(surah).
    sort(() => Math.random() - 0.5);

    const url = `https://everyayah.com/data/${reciter.id}/${pad3(surah.n)}${pad3(ayah)}.mp3`;
    return { surah, ayah, reciter, choices, url };
  }

  async function fetchVerse(surahN, ayahN) {
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surahN}:${ayahN}/editions/quran-simple,fr.hamidullah`);
      const data = await res.json();
      if (data.code === 200) {
        setVerseText({ ar: data.data[0].text, fr: data.data[1].text });
      }
    } catch (e) {/* silently fail */}
  }

  function launch(retry) {
    const retryCount = retry || 0;
    if (audioRef.current) {audioRef.current.pause();audioRef.current = null;}
    // After 3 failures, fall back to Alafasy (always available) to avoid infinite loop
    const fallback = retryCount >= 3 ? 'Alafasy_128kbps' : undefined;
    const q = buildQuestion(difficulty, fallback);
    setQuestion(q);
    setChosen(null);
    setVerseText(null);
    setState('loading');
    setIsPlaying(false);
    fetchVerse(q.surah.n, q.ayah);

    const audio = new Audio(q.url);
    audioRef.current = audio;
    audio.oncanplay = () => {setState('playing');audio.play();setIsPlaying(true);};
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => launch(retryCount + 1);
    audio.load();
  }

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {audioRef.current.pause();} else
    {audioRef.current.play();}
  }

  function answer(choice) {
    if (state !== 'playing') return;
    const correct = choice.n === question.surah.n;
    setChosen(choice.n);
    setState('answered');
    setScore((s) => ({ ok: s.ok + (correct ? 1 : 0), total: s.total + 1 }));
    setStreak((s) => correct ? s + 1 : 0);
    setSessionCount((c) => c + 1);
    setSessionOk((c) => c + (correct ? 1 : 0));
    if (audioRef.current) audioRef.current.pause();
  }

  function goNextOrBilan() {
    // Gate invité après 3 manches (assez de goût + investi → max inscriptions)
    if (!user && sessionCount === 3 && !showGuestGate) {
      setShowGuestGate(true);
      return;
    }
    // Session complète → on laisse vivre la victoire, puis upsell Pro au pic
    if (sessionCount + 1 >= SESSION_SIZE) {
      const finalOk = Math.min(sessionOk, SESSION_SIZE); // already updated by answer()
      if (user && difficulty) {
        const key = 'blindtest_score_' + difficulty;
        const prev = localStorage.getItem(key);
        const prevData = prev ? JSON.parse(prev) : null;
        if (!prevData || finalOk > prevData.correct) {
          localStorage.setItem(key, JSON.stringify({ correct: finalOk, total: SESSION_SIZE }));
        }
      }
      setState('bilan');
      // Upsell au moment fort : la partie finie, on propose Pro aux non-abonnés
      if (!isPro) {
        setTimeout(function () {
          setShowProGate(true);
          window.dispatchEvent(new CustomEvent('heritage:pro-popup'));
        }, 1600);
      }
    } else {
      launch();
    }
  }

  function continueLevel() {
    setSessionCount(0);setSessionOk(0);
    setState('loading');
    launch();
  }

  function goNextLevel() {
    const next = NEXT_DIFF[difficulty];
    setDifficulty(next);
    setSessionCount(0);setSessionOk(0);
    setState('loading');
    if (audioRef.current) {audioRef.current.pause();audioRef.current = null;}
    const q = buildQuestion(next);
    setQuestion(q);setChosen(null);setVerseText(null);setIsPlaying(false);
    fetchVerse(q.surah.n, q.ayah);
    const audio = new Audio(q.url);
    audioRef.current = audio;
    audio.oncanplay = () => {setState('playing');audio.play();setIsPlaying(true);};
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => launch(1);
    audio.load();
  }

  const correct = chosen !== null && question && chosen === question.surah.n;

  const DIFF_LABELS = {
    debutant: { label: 'Débutant(e)', desc: 'Sourates courtes (Juz Amma)', color: '#4ade80' },
    amateur: { label: 'Amateur', desc: 'Sourates moyennes', color: '#c8a727' },
    avance: { label: 'Avancé(e)', desc: 'Tout le Coran', color: '#f87171' }
  };

  const scoreColor = sessionOk >= 8 ? '#4ade80' : sessionOk >= 5 ? '#e6c84a' : '#f87171';
  const diffColors = { debutant: '#4ade80', amateur: '#c8a727', avance: '#f87171' };
  const diffIcons  = { debutant: '🌱', amateur: '⭐', avance: '🔥' };

  return (
    <div className="fade-up" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '90px 20px 80px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

      {showProGate && <ProGateModal onClose={function(){ setShowProGate(false); }} navigate={navigate} />}
      {showGuestGate && <GuestGateModal context="blindtest" onClose={function(){ setShowGuestGate(false); launch(); }} />}

      {/* ── Bouton Retour ── */}
      <button onClick={() => { if (audioRef.current) audioRef.current.pause(); navigate('home'); }} style={{
        position: 'fixed', top: 20, left: 20, zIndex: 200,
        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
        color: '#fff', padding: '10px 18px', borderRadius: 12,
        fontSize: 15, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(8px)',
        fontFamily: 'Plus Jakarta Sans, sans-serif'
      }}>← Retour</button>

      {/* ── Score live ── */}
      {score.total > 0 &&
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 200, display: 'flex', gap: 8 }}>
          <div style={{ background: 'rgba(200,167,39,0.15)', border: '1px solid rgba(200,167,39,0.3)', borderRadius: 10, padding: '7px 14px', color: '#c8a727', fontSize: 13, fontWeight: 700, backdropFilter: 'blur(8px)' }}>
            {score.ok}/{score.total}
          </div>
          {streak >= 2 && <div style={{ background: 'rgba(255,140,0,0.15)', border: '1px solid rgba(255,140,0,0.3)', borderRadius: 10, padding: '7px 14px', color: '#ff9632', fontSize: 13, fontWeight: 700 }}>🔥 {streak}</div>}
        </div>
      }

      {/* ── En-tête ── */}
      <div style={{ textAlign: 'center', marginBottom: 48, maxWidth: 560 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(200,167,39,0.1)', border: '1px solid rgba(200,167,39,0.25)', borderRadius: 20, padding: '5px 16px', marginBottom: 20 }}>
          <span style={{ fontSize: 14 }}>🎵</span>
          <span style={{ color: '#c8a727', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Reconnaissance de sourates</span>
        </div>
        <h1 style={{ fontSize: 'clamp(36px,8vw,72px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.0, margin: '0 0 14px', color: '#fff' }}>
          Écoute &amp; <span style={{ color: '#c8a727' }}>Devine</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: 0, lineHeight: 1.6 }}>
          Un extrait du Coran est joué — retrouve de quelle sourate il s'agit
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* ════════════ ÉCRAN IDLE ════════════ */}
        {state === 'idle' &&
          <div>
            {/* Explication rapide */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 36 }}>
              {[
                { icon: '🎧', title: 'Écoute', desc: 'Un verset est récité' },
                { icon: '🤔', title: 'Réfléchis', desc: 'De quelle sourate ?' },
                { icon: '✓', title: 'Réponds', desc: 'Choisis parmi 3 options' },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 3 }}>{s.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Niveau */}
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Choisir ton niveau</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
              {Object.entries(DIFF_LABELS).map(([key, val]) => {
                const locked = !isPro && key !== 'debutant';
                return (
                <button key={key} onClick={() => { if (locked) { setShowProGate(true); return; } setDifficulty(key); }} style={{
                  width: '100%', padding: '16px 20px', borderRadius: 14,
                  background: locked ? 'rgba(255,255,255,0.02)' : difficulty === key ? `rgba(${key==='debutant'?'74,222,128':key==='amateur'?'200,167,39':'248,113,113'},0.1)` : 'rgba(255,255,255,0.03)',
                  border: locked ? '1.5px solid rgba(255,255,255,0.06)' : difficulty === key ? `2px solid ${val.color}` : '1.5px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 14,
                  opacity: locked ? 0.6 : 1
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: locked ? 'rgba(255,255,255,0.06)' : `${val.color}18`, border: `1px solid ${locked ? 'rgba(255,255,255,0.1)' : val.color+'44'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {locked ? '🔒' : diffIcons[key]}
                  </div>
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: locked ? 'rgba(255,255,255,0.4)' : difficulty === key ? val.color : '#fff' }}>{val.label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{locked ? 'Réservé aux abonnés Pro' : val.desc}</div>
                  </div>
                  {locked
                    ? <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: 'rgba(200,167,39,0.1)', border: '1px solid rgba(200,167,39,0.25)', color: 'rgba(200,167,39,0.7)', flexShrink: 0 }}>Pro</span>
                    : difficulty === key && <div style={{ width: 22, height: 22, borderRadius: '50%', background: val.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#000', fontWeight: 900 }}>✓</div>
                  }
                </button>
                );
              })}
            </div>

            {/* Récitateur */}
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Récitateur</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 36 }}>
              {[{ id: null, name: 'Aléatoire', sub: 'Surprise à chaque verset' }, ...RECITERS.map(r => ({ id: r.id, name: r.name, sub: 'Récitateur choisi' }))].map((r) => (
                <button key={r.id ?? 'random'} onClick={() => setReciterId(r.id)} style={{
                  padding: '12px 14px', borderRadius: 12,
                  background: reciterId === r.id ? 'rgba(200,167,39,0.1)' : 'rgba(255,255,255,0.03)',
                  border: reciterId === r.id ? '1.5px solid rgba(200,167,39,0.45)' : '1.5px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left'
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: reciterId === r.id ? '#c8a727' : '#fff', marginBottom: 2 }}>{r.id === null ? '🎲 ' : '🎙 '}{r.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{r.sub}</div>
                </button>
              ))}
            </div>

            <button onClick={() => difficulty && (!isPro && difficulty !== 'debutant' ? setShowProGate(true) : launch())} style={{
              width: '100%', padding: '18px', borderRadius: 14, fontSize: 17, fontWeight: 800,
              background: difficulty ? 'linear-gradient(135deg,#a8891f,#c4a83a)' : 'rgba(255,255,255,0.06)',
              border: 'none', color: difficulty ? '#1c1200' : 'rgba(255,255,255,0.25)',
              cursor: difficulty ? 'pointer' : 'default', letterSpacing: '-0.2px',
              boxShadow: difficulty ? '0 4px 28px rgba(160,130,25,0.35)' : 'none', transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { if (difficulty) e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              {difficulty ? '▶ Lancer la session' : 'Choisis un niveau pour commencer'}
            </button>
            {difficulty && (
              <p style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
                {isPro
                  ? '✦ Session illimitée · Accès Pro complet'
                  : '🌱 Niveau Débutant gratuit · Passe à Pro pour les niveaux Amateur & Avancé'}
              </p>
            )}
          </div>
        }

        {/* ════════════ CHARGEMENT ════════════ */}
        {state === 'loading' &&
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', border: '3px solid rgba(200,167,39,0.15)', borderTopColor: '#c8a727', margin: '0 auto 20px', animation: 'spin 0.9s linear infinite' }} />
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Chargement du verset…</p>
          </div>
        }

        {/* ════════════ BILAN ════════════ */}
        {state === 'bilan' &&
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${scoreColor}33`, borderRadius: 24, padding: '36px 28px', marginBottom: 24 }}>
              <div style={{ fontSize: 88, fontWeight: 900, lineHeight: 1, color: scoreColor }}>
                {sessionOk}<span style={{ fontSize: 44, color: 'rgba(255,255,255,0.2)' }}>/{SESSION_SIZE}</span>
              </div>
              <p style={{ fontSize: 22, fontWeight: 800, marginTop: 12, color: scoreColor }}>
                {sessionOk === SESSION_SIZE ? '🏆 Parfait !' : sessionOk >= 8 ? '⭐ Excellent !' : sessionOk >= 6 ? '👍 Bien joué !' : sessionOk >= 4 ? '💪 Pas mal !' : '📖 Continue à pratiquer'}
              </p>
              <div style={{ margin: '20px auto 0', maxWidth: 300, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${sessionOk/SESSION_SIZE*100}%`, background: `linear-gradient(90deg,${scoreColor}88,${scoreColor})`, borderRadius: 4, transition: 'width 1s ease' }} />
              </div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
                {Array.from({ length: SESSION_SIZE }).map((_, i) => (
                  <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, background: i < sessionOk ? `${scoreColor}18` : 'rgba(255,255,255,0.04)', border: `1.5px solid ${i < sessionOk ? scoreColor : 'rgba(255,255,255,0.1)'}`, color: i < sessionOk ? scoreColor : 'transparent' }}>✓</div>
                ))}
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 20 }}>
              Niveau : <span style={{ color: diffColors[difficulty], fontWeight: 700 }}>{{ debutant:'Débutant(e)', amateur:'Amateur', avance:'Avancé(e)' }[difficulty]}</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {NEXT_DIFF[difficulty] && sessionOk >= 6 &&
                <button onClick={goNextLevel} style={{ background: 'linear-gradient(135deg,#a8891f,#c4a83a)', border: 'none', color: '#1c1200', padding: '16px', borderRadius: 12, fontSize: 16, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  ✦ Niveau suivant : {{ debutant:'Amateur', amateur:'Avancé(e)' }[difficulty]}
                </button>
              }
              <button onClick={continueLevel} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                🔄 Rejouer ce niveau
              </button>
              <button onClick={() => { setSessionCount(0); setSessionOk(0); setScore({ ok:0, total:0 }); setState('idle'); }} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.28)', fontSize: 13, cursor: 'pointer', padding: '8px' }}>
                Changer de niveau ou de récitateur
              </button>
            </div>
          </div>
        }

        {/* ════════════ JEU ════════════ */}
        {(state === 'playing' || state === 'answered') && question &&
          <>
            {/* Barre progression */}
            <div style={{ display: 'flex', gap: 5, marginBottom: 28 }}>
              {Array.from({ length: SESSION_SIZE }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i < sessionCount ? '#c8a727' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
              ))}
            </div>

            {/* Carte lecteur */}
            <div style={{ background: 'linear-gradient(135deg,rgba(200,167,39,0.08) 0%,rgba(26,92,53,0.1) 100%)', border: '1px solid rgba(200,167,39,0.2)', borderRadius: 22, padding: '28px 24px', marginBottom: 20, textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: '5px 14px', marginBottom: 24 }}>
                <span style={{ fontSize: 13 }}>🎙</span>
                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{question.reciter.name}</span>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>· verset {question.ayah}</span>
              </div>

              {/* Bouton play */}
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: verseText ? 24 : 8 }}>
                {isPlaying && <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: 'rgba(200,167,39,0.15)', animation: 'pulse 1.5s ease-in-out infinite' }} />}
                <button onClick={togglePlay} style={{
                  width: 96, height: 96, borderRadius: '50%', position: 'relative',
                  background: isPlaying ? 'linear-gradient(135deg,#a8891f,#c4a83a)' : 'rgba(200,167,39,0.12)',
                  border: isPlaying ? 'none' : '2px solid rgba(200,167,39,0.4)',
                  color: '#f5edd8', fontSize: 32, cursor: 'pointer',
                  boxShadow: isPlaying ? '0 0 40px rgba(200,167,39,0.5)' : 'none',
                  transition: 'all 0.25s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: verseText ? '0 0 0' : '8px 0 0' }}>
                {isPlaying ? 'En cours de lecture…' : 'Appuie pour écouter'}
              </p>

              {/* Texte du verset */}
              {verseText && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <p style={{ fontFamily: 'serif', fontSize: 'clamp(18px,4vw,24px)', color: 'rgba(255,248,220,0.9)', lineHeight: 2, direction: 'rtl', margin: '0 0 12px' }}>{verseText.ar}</p>
                  <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>{verseText.fr}</p>
                </div>
              )}
            </div>

            {/* Question */}
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 14 }}>
              De quelle sourate s'agit-il ?
            </p>

            {/* Choix */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
              {question.choices.map((choice) => {
                const isCorrect = choice.n === question.surah.n;
                const isChosen  = chosen === choice.n;
                let bg = 'rgba(255,255,255,0.04)', border = '1.5px solid rgba(255,255,255,0.09)', color = 'rgba(255,255,255,0.85)';
                if (state === 'answered') {
                  if (isCorrect) { bg = 'rgba(34,197,94,0.12)'; border = '1.5px solid rgba(34,197,94,0.45)'; color = '#4ade80'; }
                  else if (isChosen) { bg = 'rgba(239,68,68,0.12)'; border = '1.5px solid rgba(239,68,68,0.4)'; color = '#f87171'; }
                }
                return (
                  <button key={choice.n} onClick={() => answer(choice)} disabled={state === 'answered'} style={{
                    width: '100%', background: bg, border, color,
                    padding: '16px 20px', borderRadius: 14, fontSize: 15, fontWeight: 600,
                    cursor: state === 'answered' ? 'default' : 'pointer', transition: 'all 0.18s',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                  onMouseEnter={(e) => { if (state === 'playing') e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                  onMouseLeave={(e) => { if (state === 'playing') e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}>
                    <span>{choice.fr}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: 'serif', fontSize: 17, opacity: 0.65 }}>{choice.ar}</span>
                      {state === 'answered' && isCorrect && <span style={{ fontSize: 16 }}>✓</span>}
                      {state === 'answered' && isChosen && !isCorrect && <span style={{ fontSize: 16 }}>✗</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback */}
            {state === 'answered' &&
              <div style={{ textAlign: 'center', marginTop: 24, padding: '20px', background: correct ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${correct ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 16 }}>
                <p style={{ fontSize: 20, fontWeight: 800, color: correct ? '#4ade80' : '#f87171', marginBottom: correct ? 16 : 6 }}>
                  {correct ? '✓ Bonne réponse !' : '✗ Mauvaise réponse'}
                </p>
                {!correct && <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, marginBottom: 16 }}>C'était <strong style={{ color: '#c8a727' }}>{question.surah.fr}</strong> ({question.surah.ar})</p>}
                <button onClick={goNextOrBilan} style={{
                  background: 'linear-gradient(135deg,#a8891f,#c4a83a)', border: 'none',
                  color: '#1c1200', padding: '13px 32px', borderRadius: 12, fontSize: 15,
                  fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  {sessionCount + 1 >= SESSION_SIZE ? '📊 Voir le bilan' : `Suivant (${sessionCount + 1}/${SESSION_SIZE}) →`}
                </button>
              </div>
            }
          </>
        }
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.15); opacity: 0.2; } }`}</style>
    </div>
  );
}


/* ─── Quiz Page (category selector) ─── */
function QuizPage({ navigate }) {
  const LEVELS = [
    { id: 'debutant', label: 'Débutant',  icon: '🌱', desc: "Notions fondamentales de l'islam", color: '#4ade80' },
    { id: 'amateur',  label: 'Amateur',   icon: '⭐', desc: 'Connaissance intermédiaire',       color: '#60a5fa' },
    { id: 'avance',   label: 'Avancé',    icon: '🔥', desc: 'Savoir approfondi et détaillé',   color: '#fb923c' }
  ];

  const [cats, setCats]           = React.useState(null);
  const [scores, setScores]       = React.useState({});
  const [levelModal, setLevelModal] = React.useState(null);
  const [showProGate, setShowProGate] = React.useState(false);
  const { user, openAuth, isPro } = useAuth();

  React.useEffect(() => {
    fetch('./questions.json').then(r => r.json()).then(data => {
      setCats(data);
      const stored = {};
      Object.keys(data).forEach(k => {
        const ls = {};
        ['debutant','amateur','avance'].forEach(lv => {
          const s = localStorage.getItem('quiz_score_' + k + '_' + lv);
          if (s !== null) ls[lv] = JSON.parse(s);
        });
        if (Object.keys(ls).length) stored[k] = ls;
      });
      setScores(stored);
    });
  }, []);

  const handleClick = (key, cat) => {
    // Invités : on laisse goûter (le gate inscription arrive après quelques questions)
    setLevelModal({ key, cat });
  };

  const HOW = [
    { icon: '🎯', title: 'Choisis',   desc: 'Sélectionne une catégorie et ton niveau de difficulté' },
    { icon: '💡', title: 'Réponds',   desc: '10 questions tirées aléatoirement, une bonne réponse par question' },
    { icon: '📈', title: 'Progresse', desc: 'Ton meilleur score est sauvegardé dans ton profil' },
  ];

  return (
    <React.Fragment>
    <div className="fade-up" style={{ minHeight: '100vh', paddingBottom: 80, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', padding: '90px 20px 48px', maxWidth: 560, margin: '0 auto' }}>
        <button onClick={() => navigate('home')} style={{
          position: 'fixed', top: 20, left: 20, zIndex: 200,
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff', padding: '10px 18px', borderRadius: 12,
          fontSize: 15, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(8px)',
          fontFamily: 'Plus Jakarta Sans, sans-serif'
        }}>← Retour</button>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(200,167,39,0.1)', border: '1px solid rgba(200,167,39,0.25)', borderRadius: 20, padding: '5px 16px', marginBottom: 20 }}>
          <span style={{ fontSize: 14 }}>🧠</span>
          <span style={{ color: '#c8a727', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Quiz Islamiques</span>
        </div>

        <h1 style={{ fontSize: 'clamp(36px,8vw,72px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.0, margin: '0 0 14px', color: '#fff' }}>
          Teste tes <span style={{ color: '#c8a727' }}>connaissances</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: '0 0 16px', lineHeight: 1.6 }}>
          7 catégories · 3 niveaux
        </p>
        {isPro ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(200,167,39,0.08)', border: '1px solid rgba(200,167,39,0.25)', borderRadius: 12, padding: '8px 18px' }}>
            <span style={{ fontSize: 13 }}>✦</span>
            <span style={{ color: '#c8a727', fontSize: 12, fontWeight: 700 }}>Accès complet · 3 niveaux · questions illimitées</span>
          </div>
        ) : (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 12, padding: '8px 18px' }}>
            <span style={{ fontSize: 13 }}>🌱</span>
            <span style={{ color: 'rgba(74,222,128,0.85)', fontSize: 12, fontWeight: 700 }}>Gratuit : niveau Débutant · 10 questions</span>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>·</span>
            <span style={{ color: 'rgba(200,167,39,0.7)', fontSize: 12, fontWeight: 700 }}>🔒 Amateur & Avancé → Pro</span>
          </div>
        )}
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 20px' }}>

        {/* ── Comment ça marche ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 52 }}>
          {HOW.map((h, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{h.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: '#fff', marginBottom: 6 }}>{h.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>{h.desc}</div>
            </div>
          ))}
        </div>

        {/* ── Categories ── */}
        {!cats
          ? <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', paddingTop: 60 }}>Chargement…</div>
          : <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {Object.entries(cats).map(([key, cat]) => {
                const catScores  = scores[key] || {};
                const done       = Object.values(catScores).filter(Boolean).length;
                const bestPct    = done ? Math.round(Object.values(catScores).reduce((a, s) => a + s.correct / s.total, 0) / done * 100) : null;
                return (
                  <button key={key} onClick={() => handleClick(key, cat)}
                    style={{ background: 'rgba(255,255,255,0.025)', border: `1.5px solid ${cat.color}28`, borderRadius: 20, padding: '22px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 20, textAlign: 'left', transition: 'all 0.22s', position: 'relative', overflow: 'hidden', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${cat.color}0d`; e.currentTarget.style.borderColor = `${cat.color}55`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; e.currentTarget.style.borderColor = `${cat.color}28`; e.currentTarget.style.transform = 'translateY(0)'; }}>

                    {/* Glow blob */}
                    <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${cat.color}18 0%, transparent 70%)`, pointerEvents: 'none' }} />

                    {/* Icon */}
                    <div style={{ width: 58, height: 58, borderRadius: 16, flexShrink: 0, background: `${cat.color}18`, border: `1.5px solid ${cat.color}38`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                      {cat.icon}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                        <span style={{ fontWeight: 800, fontSize: 17, color: '#fff' }}>{cat.title}</span>
                        {done > 0 && <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${cat.color}22`, border: `1px solid ${cat.color}44`, color: cat.color }}>{done}/3 joués</span>}
                      </div>
                      <div style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, marginBottom: done > 0 ? 10 : 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {isPro ? (
                          <>
                            <span>3 niveaux · questions illimitées</span>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 6, background: 'rgba(200,167,39,0.12)', border: '1px solid rgba(200,167,39,0.3)', color: '#c8a727' }}>✦ Pro</span>
                          </>
                        ) : (
                          <>
                            <span>3 niveaux · 10 questions gratuites</span>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 6, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', color: 'rgba(74,222,128,0.8)' }}>🌱 Gratuit</span>
                          </>
                        )}
                      </div>
                      {done > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {LEVELS.map(lv => {
                            const sc = catScores[lv.id];
                            return (
                              <span key={lv.id} style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 8, background: sc ? `${lv.color}18` : 'rgba(255,255,255,0.05)', border: `1px solid ${sc ? lv.color + '44' : 'rgba(255,255,255,0.08)'}`, color: sc ? lv.color : 'rgba(255,255,255,0.22)' }}>
                                {lv.icon} {sc ? `${sc.correct}/${sc.total}` : lv.label}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Arrow (jouable, même invité) */}
                    <div style={{ fontSize: 20, color: cat.color, flexShrink: 0, marginRight: 4 }}>
                      ›
                    </div>
                  </button>
                );
              })}
            </div>
        }

        {/* ── Not logged in note ── */}
        {!user && (
          <div style={{ marginTop: 32, textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
            Choisis une catégorie et joue tout de suite 🎯 — <span onClick={openAuth} style={{ color: '#c8a727', cursor: 'pointer', textDecoration: 'underline' }}>crée ton compte gratuit</span> pour sauvegarder ton score.
          </div>
        )}
      </div>

    </div>
      {/* ── Level modal — outside fade-up to avoid transform breaking position:fixed ── */}
      {showProGate && <ProGateModal onClose={function(){ setShowProGate(false); setLevelModal(null); }} navigate={navigate} />}
      {levelModal && cats && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setLevelModal(null)}>
          <div style={{ background: 'linear-gradient(160deg,#0d1f13 0%,#060f08 100%)', border: `1.5px solid ${levelModal.cat.color}44`, borderRadius: 24, padding: '36px 28px', maxWidth: 420, width: '100%' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>{levelModal.cat.icon}</div>
              <h3 style={{ color: levelModal.cat.color, fontSize: 22, fontWeight: 900, margin: '0 0 6px' }}>{levelModal.cat.title}</h3>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 14, margin: 0 }}>Choisis ton niveau de difficulté</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {LEVELS.map(lv => {
                const sc = (scores[levelModal.key] || {})[lv.id];
                const locked = !isPro && lv.id !== 'debutant';
                return (
                  <button key={lv.id}
                    onClick={function() {
                      if (locked) { setLevelModal(null); setShowProGate(true); return; }
                      setLevelModal(null);
                      navigate('quiz-' + levelModal.key + '-' + lv.id);
                    }}
                    style={{ background: locked ? 'rgba(255,255,255,0.03)' : `${lv.color}0d`, border: `1.5px solid ${locked ? 'rgba(255,255,255,0.08)' : lv.color + '2a'}`, borderRadius: 14, padding: '15px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', transition: 'all 0.18s', fontFamily: 'Plus Jakarta Sans, sans-serif', opacity: locked ? 0.6 : 1 }}
                    onMouseEnter={e => { if (!locked) { e.currentTarget.style.background = `${lv.color}1e`; e.currentTarget.style.borderColor = `${lv.color}66`; } }}
                    onMouseLeave={e => { if (!locked) { e.currentTarget.style.background = `${lv.color}0d`; e.currentTarget.style.borderColor = `${lv.color}2a`; } }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${lv.color}18`, border: `1px solid ${lv.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{locked ? '🔒' : lv.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: locked ? 'rgba(255,255,255,0.4)' : lv.color, fontWeight: 800, fontSize: 15, marginBottom: 2 }}>{lv.label}</div>
                      <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{locked ? 'Réservé aux abonnés Pro' : lv.desc + ' · 10 questions'}</div>
                    </div>
                    {locked
                      ? <span style={{ fontSize: 11, fontWeight: 700, background: 'rgba(200,167,39,0.1)', border: '1px solid rgba(200,167,39,0.25)', borderRadius: 8, padding: '3px 8px', color: 'rgba(200,167,39,0.7)', flexShrink: 0 }}>Pro</span>
                      : sc
                        ? <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ color: lv.color, fontWeight: 800, fontSize: 15 }}>{sc.correct}/{sc.total}</div>
                            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>meilleur</div>
                          </div>
                        : <span style={{ color: lv.color, opacity: 0.5, fontSize: 18 }}>›</span>
                    }
                  </button>
                );
              })}
            </div>
            {!isPro && <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, color:'rgba(200,167,39,0.5)', textAlign:'center', marginBottom:12 }}>🔒 Niveaux Amateur & Avancé — abonnés Pro uniquement</p>}
            <button onClick={() => setLevelModal(null)} style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: 'rgba(255,255,255,0.28)', fontSize: 13, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', paddingTop: 4 }}>Annuler</button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

/* ─── Quiz Category Page ─── */
function QuizCategoryPage({ catKey, level, navigate }) {
  const { user, openAuth } = useAuth();
  const QUIZ_SIZE = 10;
  const LABELS = ['A', 'B', 'C', 'D'];
  const [showGuestGate, setShowGuestGate] = React.useState(false);
  const LEVEL_META = {
    debutant: { label: 'Débutant', icon: '🌱', color: '#4ade80' },
    amateur:  { label: 'Amateur',  icon: '⭐', color: '#60a5fa' },
    avance:   { label: 'Avancé',   icon: '🔥', color: '#fb923c' }
  };
  const lvMeta     = LEVEL_META[level] || LEVEL_META.debutant;
  const storageKey = 'quiz_score_' + catKey + '_' + (level || 'debutant');

  const [cat, setCat]         = React.useState(null);
  const [questions, setQs]    = React.useState([]);
  const [current, setCurrent] = React.useState(0);
  const [chosen, setChosen]   = React.useState(null);
  const [answered, setAnswered] = React.useState(false);
  const [score, setScore]     = React.useState(0);
  const [done, setDone]       = React.useState(false);

  React.useEffect(() => {
    fetch('./questions.json').then(r => r.json()).then(data => {
      const c = data[catKey];
      if (!c) { navigate('quiz'); return; }
      setCat(c);
      const filtered = (c.questions || []).filter(q => q.level === (level || 'debutant'));
      setQs([...filtered].sort(() => Math.random() - 0.5).slice(0, QUIZ_SIZE));
    });
  }, [catKey, level]);

  const pick = idx => {
    if (answered) return;
    setChosen(idx);
    setAnswered(true);
    if (idx === questions[current].correct) setScore(s => s + 1);
  };

  const next = () => {
    // Gate invité après 3 questions (assez de goût + investi -> max inscriptions)
    if (!user && current === 2 && current + 1 < questions.length) {
      setShowGuestGate(true);
      return;
    }
    if (current + 1 >= questions.length) {
      const newScore = Math.min(score, questions.length);
      if (user) {
        const prev = localStorage.getItem(storageKey);
        const prevData = prev ? JSON.parse(prev) : null;
        if (!prevData || newScore > prevData.correct) {
          localStorage.setItem(storageKey, JSON.stringify({ correct: newScore, total: questions.length }));
        }
      }
      window.dispatchEvent(new CustomEvent('heritage:pro-popup'));
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setChosen(null);
      setAnswered(false);
    }
  };

  if (!cat || questions.length === 0) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.4)' }}>Chargement…</div>
  );

  /* ── Bilan ── */
  if (done) {
    const finalScore = Math.min(score, questions.length);
    const pct   = Math.round(finalScore / questions.length * 100);
    const medal = pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '📖';
    const msg   = pct >= 80 ? 'Masha Allah !' : pct >= 50 ? 'Bien joué !' : 'Continue à apprendre !';
    const sub   = pct >= 80 ? 'Excellent résultat, tu maîtrises bien ce sujet.' : pct >= 50 ? 'Tu progresses, continue comme ça !' : 'Chaque question te rapproche de la maîtrise.';
    const glowColor = pct >= 80 ? '#4ade80' : pct >= 50 ? '#60a5fa' : '#fb923c';
    const replay = () => {
      setCurrent(0); setChosen(null); setAnswered(false); setScore(0); setDone(false);
      const filtered = (cat.questions || []).filter(q => q.level === (level || 'debutant'));
      setQs([...filtered].sort(() => Math.random() - 0.5).slice(0, QUIZ_SIZE));
    };
    return (
      <div className="fade-up" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          {/* Medal */}
          <div style={{ fontSize: 72, marginBottom: 8, filter: `drop-shadow(0 0 24px ${glowColor}66)` }}>{medal}</div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>{msg}</h2>
          <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 15, marginBottom: 32, lineHeight: 1.5 }}>{sub}</p>

          {/* Score ring */}
          <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 32px' }}>
            <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="80" cy="80" r="68" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
              <circle cx="80" cy="80" r="68" fill="none" stroke={glowColor} strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 68}`}
                strokeDashoffset={`${2 * Math.PI * 68 * (1 - pct / 100)}`}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 8px ${glowColor}88)`, transition: 'stroke-dashoffset 1s ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 38, fontWeight: 900, color: glowColor, lineHeight: 1 }}>{finalScore}</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>sur {questions.length}</span>
            </div>
          </div>

          {/* Category + level */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
            <span style={{ fontSize: 13, fontWeight: 700, padding: '4px 14px', borderRadius: 20, background: `${cat.color}18`, border: `1px solid ${cat.color}44`, color: cat.color }}>{cat.icon} {cat.title}</span>
            <span style={{ fontSize: 13, fontWeight: 700, padding: '4px 14px', borderRadius: 20, background: `${lvMeta.color}18`, border: `1px solid ${lvMeta.color}44`, color: lvMeta.color }}>{lvMeta.icon} {lvMeta.label}</span>
          </div>

          {/* Invité : pousse l'inscription au moment du score (pic d'intérêt) */}
          {!user && (
            <div style={{ background: 'linear-gradient(160deg, rgba(200,167,39,0.12), rgba(200,167,39,0.04))', border: '1.5px solid rgba(200,167,39,0.4)', borderRadius: 18, padding: '20px 22px', marginBottom: 28, textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 6 }}>💾 Sauvegarde ce score de {finalScore}/{questions.length}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 16, lineHeight: 1.5 }}>Crée ton compte gratuit pour garder ta progression et débloquer <strong style={{ color: '#c8a727' }}>toutes les catégories</strong>. 10 secondes.</div>
              <button onClick={openAuth} style={{ width: '100%', background: 'linear-gradient(135deg,#c8a727,#a8891f)', border: 'none', color: '#0a1a08', padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 4px 20px rgba(200,167,39,0.35)' }}>
                Créer mon compte gratuit →
              </button>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={replay} style={{ background: 'linear-gradient(135deg,#a8891f,#c4a83a)', border: 'none', color: '#f5edd8', padding: '14px 30px', borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              🔄 Rejouer
            </button>
            <button onClick={() => navigate('quiz')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', padding: '14px 30px', borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              ← Catégories
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Quiz in progress ── */
  const q         = questions[current];
  const isCorrect = idx => idx === q.correct;
  const progress  = questions.length > 0 ? (current + (answered ? 1 : 0)) / questions.length : 0;

  return (
    <div className="fade-up" style={{ minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif', paddingBottom: 60 }}>
      {showGuestGate && <GuestGateModal context="quiz" onClose={function(){ setShowGuestGate(false); setCurrent(c => c + 1); setChosen(null); setAnswered(false); }} />}

      {/* ── Top bar ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(5,14,8,0.92)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '14px 20px' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={() => navigate('quiz')} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer', padding: '7px 14px', borderRadius: 10, flexShrink: 0, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
              <span>{cat.icon} {cat.title} · {lvMeta.icon} {lvMeta.label}</span>
              <span style={{ color: '#4ade80', fontWeight: 700 }}>✓ {score}</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 2, background: `linear-gradient(90deg,${cat.color}99,${cat.color})`, width: (progress * 100) + '%', transition: 'width 0.4s ease' }} />
            </div>
          </div>
          <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.55)', flexShrink: 0 }}>
            {current + 1}<span style={{ color: 'rgba(255,255,255,0.22)', fontWeight: 400 }}>/{questions.length}</span>
          </div>
        </div>
        {/* Dot indicators */}
        <div style={{ maxWidth: 680, margin: '8px auto 0', display: 'flex', gap: 5 }}>
          {Array.from({ length: questions.length }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i < current ? cat.color : i === current ? `${cat.color}66` : 'rgba(255,255,255,0.08)', transition: 'background 0.3s' }} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px 0' }}>

        {/* ── Question card ── */}
        <div style={{ background: `linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)`, border: `1.5px solid ${cat.color}28`, borderRadius: 22, padding: '30px 28px', marginBottom: 22, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${cat.color}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
          <div style={{ fontSize: 11, fontWeight: 800, color: cat.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14, opacity: 0.7 }}>
            Question {current + 1}
          </div>
          <p style={{ color: '#fff', fontSize: 'clamp(17px,3.5vw,21px)', fontWeight: 700, lineHeight: 1.55, margin: 0 }}>
            {q.q}
          </p>
        </div>

        {/* ── Choices ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.choices.map((choice, idx) => {
            let bg     = 'rgba(255,255,255,0.04)';
            let border = '1.5px solid rgba(255,255,255,0.09)';
            let color  = 'rgba(255,255,255,0.82)';
            let labelBg = 'rgba(255,255,255,0.08)';
            let labelColor = 'rgba(255,255,255,0.45)';

            if (answered) {
              if (isCorrect(idx)) {
                bg = 'rgba(34,197,94,0.10)'; border = '1.5px solid rgba(34,197,94,0.42)'; color = '#4ade80';
                labelBg = 'rgba(34,197,94,0.22)'; labelColor = '#4ade80';
              } else if (idx === chosen) {
                bg = 'rgba(239,68,68,0.10)'; border = '1.5px solid rgba(239,68,68,0.42)'; color = '#f87171';
                labelBg = 'rgba(239,68,68,0.22)'; labelColor = '#f87171';
              }
            }
            return (
              <button key={idx} onClick={() => pick(idx)} disabled={answered}
                style={{ width: '100%', background: bg, border, color, padding: '15px 18px', borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: answered ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.18s', display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                onMouseEnter={e => { if (!answered) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; } }}
                onMouseLeave={e => { if (!answered) { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = border.replace('1.5px solid ',''); } }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: labelBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: labelColor, flexShrink: 0, transition: 'all 0.18s' }}>
                  {answered && isCorrect(idx) ? '✓' : answered && idx === chosen && !isCorrect(idx) ? '✗' : LABELS[idx]}
                </div>
                <span style={{ flex: 1 }}>{choice}</span>
              </button>
            );
          })}
        </div>

        {/* ── Explication + Next ── */}
        {answered && (
          <div style={{ marginTop: 22 }}>
            <div style={{ background: isCorrect(chosen) ? 'rgba(34,197,94,0.07)' : 'rgba(239,68,68,0.07)', border: `1.5px solid ${isCorrect(chosen) ? 'rgba(34,197,94,0.28)' : 'rgba(239,68,68,0.28)'}`, borderRadius: 16, padding: '18px 22px', marginBottom: 18 }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: isCorrect(chosen) ? '#4ade80' : '#f87171', margin: '0 0 8px' }}>
                {isCorrect(chosen) ? '✓ Bonne réponse !' : '✗ Mauvaise réponse'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>
                {q.explication}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={next}
                style={{ background: 'linear-gradient(135deg,#a8891f,#c4a83a)', border: 'none', color: '#f5edd8', padding: '15px 40px', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer', transition: 'transform 0.18s', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                {current + 1 >= questions.length ? '📊 Voir mon bilan' : `Question suivante  ${current + 2}/${questions.length} →`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/* ─── Canvas text helper ─── */
function wrapCanvasText(ctx, text, maxWidth, font) {
  ctx.font = font;
  var words = text.split(' '),lines = [],cur = '';
  for (var i = 0; i < words.length; i++) {
    var test = cur ? cur + ' ' + words[i] : words[i];
    if (ctx.measureText(test).width > maxWidth && cur) {lines.push(cur);cur = words[i];} else
    cur = test;
  }
  if (cur) lines.push(cur);
  return lines;
}

/* ─── Verse boundary detector (silence-based) ─── */
function detectVerseBoundaries(audioBuffer, verseCount) {
  if (verseCount <= 1) return [0];
  const data = audioBuffer.getChannelData(0);
  const sr = audioBuffer.sampleRate;
  const winSize = Math.floor(sr * 0.05); // 50 ms windows
  const totalWin = Math.floor(data.length / winSize);

  // RMS per window
  const rms = new Float32Array(totalWin);
  for (let w = 0; w < totalWin; w++) {
    let sum = 0;
    const off = w * winSize;
    for (let i = 0; i < winSize; i++) {const s = data[off + i];sum += s * s;}
    rms[w] = Math.sqrt(sum / winSize);
  }

  // Find silence region centres (RMS < threshold for ≥ 4 consecutive windows = 200ms)
  const threshold = 0.015;
  const minWin = 4;
  const silenceCentres = [];
  let silStart = -1;
  for (let w = 0; w <= totalWin; w++) {
    const quiet = w < totalWin && rms[w] < threshold;
    if (quiet) {if (silStart === -1) silStart = w;} else
    {
      if (silStart !== -1 && w - silStart >= minWin) {
        silenceCentres.push(Math.floor((silStart + w) / 2) * winSize / sr);
      }
      silStart = -1;
    }
  }

  // Pick verseCount-1 boundaries closest to even-split targets
  const dur = audioBuffer.duration;
  const boundaries = [0];
  for (let i = 1; i < verseCount; i++) {
    const target = dur / verseCount * i;
    let best = target; // fallback: even split
    let bestDist = Infinity;
    for (let j = 0; j < silenceCentres.length; j++) {
      const d = Math.abs(silenceCentres[j] - target);
      if (d < bestDist) {bestDist = d;best = silenceCentres[j];}
    }
    boundaries.push(best);
  }
  return boundaries; // seconds from start, one per verse
}

/* ─── Procedural animated backgrounds (no external assets) ─── */
const BG_PRESETS = [
  { id: 'black',   label: 'Noir',        emoji: '⬛' },
  { id: 'emerald', label: 'Émeraude',    emoji: '🟢' },
  { id: 'night',   label: 'Nuit étoilée', emoji: '🌌' },
  { id: 'stars',   label: 'Particules',  emoji: '✨' },
  { id: 'bokeh',   label: 'Bokeh doré',  emoji: '🟡' },
  { id: 'sunset',  label: 'Coucher',     emoji: '🌅' },
  { id: 'kaaba',   label: 'Spirituel',   emoji: '🕋' },
];
function drawProceduralBg(ctx, W, H, type, t, particlesRef) {
  // base fills
  function grad(stops) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    stops.forEach(function(s){ g.addColorStop(s[0], s[1]); });
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  // seed particles once per dims
  if ((type === 'stars' || type === 'night' || type === 'bokeh' || type === 'kaaba') && !particlesRef.current) {
    const n = type === 'bokeh' ? 26 : 90;
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push({ x: Math.random()*W, y: Math.random()*H, r: (type==='bokeh'? 18+Math.random()*60 : 1+Math.random()*2.4), s: 6+Math.random()*22, ph: Math.random()*Math.PI*2 });
    }
    particlesRef.current = arr;
  }
  if (type === 'black') { ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H); return; }
  if (type === 'emerald') {
    grad([[0,'#021a0d'],[0.55,'#063d20'],[1,'#021109']]);
    const r = ctx.createRadialGradient(W/2, H*0.34, 0, W/2, H*0.34, H*0.5);
    r.addColorStop(0,'rgba(60,180,110,0.18)'); r.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = r; ctx.fillRect(0,0,W,H); return;
  }
  if (type === 'sunset') {
    grad([[0,'#1a0b2e'],[0.45,'#4a1942'],[0.75,'#9c3d2e'],[1,'#e08a3c']]);
    const r = ctx.createRadialGradient(W/2, H*0.82, 0, W/2, H*0.82, H*0.45);
    r.addColorStop(0,'rgba(255,200,120,0.5)'); r.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = r; ctx.fillRect(0,0,W,H); return;
  }
  if (type === 'night') {
    grad([[0,'#060f26'],[0.6,'#0a1838'],[1,'#03060f']]);
    const ps = particlesRef.current || [];
    ctx.save();
    ps.forEach(function(p){
      const tw = 0.4 + 0.6*Math.abs(Math.sin(t*0.8 + p.ph));
      ctx.globalAlpha = tw; ctx.fillStyle = '#dfe8ff';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r*0.8, 0, Math.PI*2); ctx.fill();
    });
    ctx.restore(); return;
  }
  if (type === 'stars') {
    ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H);
    const ps = particlesRef.current || [];
    ctx.save(); ctx.fillStyle = 'rgba(200,167,39,0.9)';
    ps.forEach(function(p){
      const y = (p.y - t*p.s) % H; const yy = y < 0 ? y + H : y;
      ctx.globalAlpha = 0.3 + 0.7*Math.abs(Math.sin(t + p.ph));
      ctx.beginPath(); ctx.arc(p.x, yy, p.r, 0, Math.PI*2); ctx.fill();
    });
    ctx.restore(); return;
  }
  if (type === 'bokeh') {
    grad([[0,'#0a0f0a'],[0.5,'#13180d'],[1,'#080a06']]);
    const ps = particlesRef.current || [];
    ctx.save();
    ps.forEach(function(p){
      const yy = ((p.y - t*p.s*0.4) % (H+200)+ (H+200)) % (H+200) - 100;
      const g = ctx.createRadialGradient(p.x, yy, 0, p.x, yy, p.r);
      g.addColorStop(0,'rgba(230,200,90,0.22)'); g.addColorStop(1,'rgba(230,200,90,0)');
      ctx.globalAlpha = 0.4 + 0.4*Math.sin(t*0.5 + p.ph);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, yy, p.r, 0, Math.PI*2); ctx.fill();
    });
    ctx.restore(); return;
  }
  if (type === 'kaaba') {
    grad([[0,'#0b0b14'],[0.5,'#1a1426'],[1,'#070710']]);
    const r = ctx.createRadialGradient(W/2, H*0.5, 0, W/2, H*0.5, H*0.55);
    r.addColorStop(0,'rgba(200,167,39,0.14)'); r.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = r; ctx.fillRect(0,0,W,H);
    const ps = particlesRef.current || [];
    ctx.save(); ctx.fillStyle = 'rgba(230,200,90,0.8)';
    ps.forEach(function(p){
      const yy = ((p.y - t*p.s*0.5) % H + H) % H;
      ctx.globalAlpha = 0.25 + 0.5*Math.abs(Math.sin(t*0.7 + p.ph));
      ctx.beginPath(); ctx.arc(p.x, yy, p.r*0.7, 0, Math.PI*2); ctx.fill();
    });
    ctx.restore(); return;
  }
  ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H);
}

/* ─── Fast text+watermark blit (uses pre-computed lines from cache) ─── */
function drawTextAndWatermark(ctx, W, H, s, fadeAlpha, cache) {
  const fa = fadeAlpha == null ? 1 : fadeAlpha;
  const showAr = s.textMode !== 'french';
  const showFr = s.textMode !== 'arabic';
  const COL = { white: '#fff', gold: '#e6c84a', outline: '#fff' };
  const fillCol = COL[s.textColor] || '#fff';
  const fontId = s.fontId || 'Amiri';
  const fScale = s.fontScale || 1;
  const arSz = Math.round(W * 0.052 * fScale);
  const arFont = 'bold ' + arSz + 'px "' + fontId + '", "Amiri", serif';
  const arLines = (cache && cache.arLines) || [];
  const arLH = arSz * 1.65, arTH = arLines.length * arLH;
  const frSz = Math.round(W * 0.036 * fScale);
  const frFont = frSz + 'px "Plus Jakarta Sans", sans-serif';
  const frLines = (cache && cache.frLines) || [];
  const frLH = frSz * 1.5, frTH = frLines.length * frLH;
  const gap = (showAr && showFr) ? frSz * 2.1 : 0;
  const blockH = arTH + gap + frTH;
  const textPos = s.textPos || 'center';
  let topY;
  if (textPos === 'top') topY = H * 0.16;
  else if (textPos === 'bottom') topY = H * 0.80 - blockH;
  else topY = H / 2 - blockH / 2;
  const paint = function(line, x, yy, font, isAr) {
    ctx.font = font;
    if (s.textColor === 'outline') {
      ctx.lineWidth = Math.round((isAr ? arSz : frSz) * 0.14);
      ctx.strokeStyle = 'rgba(0,0,0,0.92)'; ctx.lineJoin = 'round';
      ctx.strokeText(line, x, yy);
    }
    ctx.fillStyle = fillCol;
    ctx.fillText(line, x, yy); ctx.fillText(line, x, yy);
  };
  if (showAr && arLines.length) {
    ctx.save(); ctx.globalAlpha = fa;
    ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = 'rgba(0,0,0,0.95)'; ctx.shadowBlur = W*0.018; ctx.shadowOffsetY = 2;
    let y = topY;
    arLines.forEach(function(line) { paint(line, W/2, y + arSz, arFont, true); y += arLH; });
    ctx.restore();
  }
  if (showFr && frLines.length) {
    ctx.save(); ctx.globalAlpha = fa * 0.92;
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.shadowColor = 'rgba(0,0,0,0.95)'; ctx.shadowBlur = W*0.014; ctx.shadowOffsetY = 2;
    let fy = topY + arTH + gap;
    frLines.forEach(function(line) { paint(line, W/2, fy, frFont, false); fy += frLH; });
    ctx.restore();
  }
  if (s.watermark) {
    ctx.save(); ctx.globalAlpha = 0.6;
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 8;
    ctx.font = '600 ' + Math.round(W * 0.026) + 'px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(s.watermark, W / 2, H - H * 0.035);
    ctx.restore();
  }
}

/* ─── Render a single studio frame (used by live preview AND offline export) ─── */
function renderStudioFrame(ctx, W, H, s, t, particles, fadeAlpha, bgVideo, bgImg) {
  ctx.clearRect(0, 0, W, H);
  if (s.bgType === 'video' && bgVideo && bgVideo.readyState >= 2) {
    const sc = Math.max(W / bgVideo.videoWidth, H / bgVideo.videoHeight);
    ctx.drawImage(bgVideo, (W - bgVideo.videoWidth * sc) / 2, (H - bgVideo.videoHeight * sc) / 2, bgVideo.videoWidth * sc, bgVideo.videoHeight * sc);
    ctx.fillStyle = 'rgba(0,0,0,0.42)'; ctx.fillRect(0, 0, W, H);
  } else if (s.bgType === 'image' && bgImg && bgImg.complete && bgImg.naturalWidth) {
    const sc = Math.max(W / bgImg.naturalWidth, H / bgImg.naturalHeight);
    ctx.drawImage(bgImg, (W - bgImg.naturalWidth * sc) / 2, (H - bgImg.naturalHeight * sc) / 2, bgImg.naturalWidth * sc, bgImg.naturalHeight * sc);
    ctx.fillStyle = 'rgba(0,0,0,0.42)'; ctx.fillRect(0, 0, W, H);
  } else {
    drawProceduralBg(ctx, W, H, s.bgType, t, particles);
  }
  const vg = ctx.createRadialGradient(W/2, H/2, H*0.25, W/2, H/2, H*0.72);
  vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,0.45)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  if (s.verse) {
    const fa = fadeAlpha == null ? 1 : fadeAlpha;
    const showAr = s.textMode !== 'french';
    const showFr = s.textMode !== 'arabic';
    const COL = { white: '#fff', gold: '#e6c84a', outline: '#fff' };
    const fillCol = COL[s.textColor] || '#fff';
    const fontId = s.fontId || 'Amiri';
    const fScale = s.fontScale || 1;
    const arSz = Math.round(W * 0.052 * fScale);
    const arFont = 'bold ' + arSz + 'px "' + fontId + '", "Amiri", serif';
    const arLines = showAr ? wrapCanvasText(ctx, s.verse.ar || '', W - W*0.12, arFont) : [];
    const arLH = arSz * 1.65, arTH = arLines.length * arLH;
    const frSz = Math.round(W * 0.036 * fScale);
    const frFont = frSz + 'px "Plus Jakarta Sans", sans-serif';
    const frLines = showFr ? wrapCanvasText(ctx, s.verse.fr || '', W - W*0.14, frFont) : [];
    const frLH = frSz * 1.5, frTH = frLines.length * frLH;
    const gap = (showAr && showFr) ? frSz * 2.1 : 0;
    const blockH = arTH + gap + frTH;
    const textPos = s.textPos || 'center';
    let topY;
    if (textPos === 'top') topY = H * 0.16;
    else if (textPos === 'bottom') topY = H * 0.80 - blockH;
    else topY = H / 2 - blockH / 2;
    const paint = function(line, x, yy, font, isAr) {
      ctx.font = font;
      if (s.textColor === 'outline') {
        ctx.lineWidth = Math.round((isAr ? arSz : frSz) * 0.14);
        ctx.strokeStyle = 'rgba(0,0,0,0.92)'; ctx.lineJoin = 'round';
        ctx.strokeText(line, x, yy);
      }
      ctx.fillStyle = fillCol;
      ctx.fillText(line, x, yy); ctx.fillText(line, x, yy);
    };
    if (showAr) {
      ctx.save(); ctx.globalAlpha = fa;
      ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.shadowColor = 'rgba(0,0,0,0.95)'; ctx.shadowBlur = W*0.018; ctx.shadowOffsetY = 2;
      let y = topY;
      arLines.forEach(function(line) { paint(line, W/2, y + arSz, arFont, true); y += arLH; });
      ctx.restore();
    }
    if (showFr) {
      ctx.save(); ctx.globalAlpha = fa * 0.92;
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      ctx.shadowColor = 'rgba(0,0,0,0.95)'; ctx.shadowBlur = W*0.014; ctx.shadowOffsetY = 2;
      let fy = topY + arTH + gap;
      frLines.forEach(function(line) { paint(line, W/2, fy, frFont, false); fy += frLH; });
      ctx.restore();
    }
  } else if (s.loading != null) {
    ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = Math.round(W * 0.04) + 'px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(s.loading ? 'Chargement…' : 'Aperçu de la vidéo', W / 2, H / 2);
  }
  if (s.watermark) {
    ctx.save(); ctx.globalAlpha = 0.6;
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 8;
    ctx.font = '600 ' + Math.round(W * 0.026) + 'px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(s.watermark, W / 2, H - H * 0.035);
    ctx.restore();
  }
}

/* ─── Video Creator Page ─── */
function VideoCreatorPage({ navigate }) {
  const FONT_OPTIONS = [
  { id: 'Amiri', label: 'Amiri' },
  { id: 'Scheherazade New', label: 'Scheherazade' },
  { id: 'Noto Naskh Arabic', label: 'Noto Naskh' },
  { id: 'Lateef', label: 'Lateef' },
  { id: 'Reem Kufi', label: 'Reem Kufi' },
  { id: 'Aref Ruqaa', label: 'Aref Ruqaa' },
  { id: 'Markazi Text', label: 'Markazi Text' },
  { id: 'Cairo', label: 'Cairo' },
  { id: 'serif', label: 'Classique' }];


  const [surahNum, setSurahNum] = React.useState(1);
  const [ayahNum, setAyahNum] = React.useState(1);
  const [verseCount, setVerseCount] = React.useState(3);
  const [reciterId, setReciterId] = React.useState('Alafasy_128kbps');
  const [fontId, setFontId] = React.useState('Amiri');
  const [bgType, setBgType] = React.useState('black');
  const [verseData, setVerseData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [statusMsg, setStatusMsg] = React.useState('');
  const [downloadUrl, setDownloadUrl] = React.useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = React.useState(false);
  const [customMp3, setCustomMp3] = React.useState(null); // { url, name }
  const [mp3Timestamps, setMp3Timestamps] = React.useState(null); // array of seconds, one per verse
  const [isMarking, setIsMarking] = React.useState(false);
  const [markingIndex, setMarkingIndex] = React.useState(0);
  const [markingTexts, setMarkingTexts] = React.useState([]);
  const [step, setStep] = React.useState(1); // wizard: 1=config, 2=audio, 3=export
  const [audioMode, setAudioMode] = React.useState('auto'); // 'auto' | 'custom'
  const [markingCountdown, setMarkingCountdown] = React.useState(null); // null | 3 | 2 | 1
  const [showProGate, setShowProGate] = React.useState(false);
  const [showGuestGate, setShowGuestGate] = React.useState(false);
  // ── New studio options ──
  const [aspect, setAspect] = React.useState('9:16');      // 9:16 | 1:1 | 16:9
  const [textMode, setTextMode] = React.useState('both');  // both | arabic | french
  const [textColor, setTextColor] = React.useState('white');// white | gold | outline
  const [fontScale, setFontScale] = React.useState(1);     // 0.8 – 1.3
  const [textPos, setTextPos] = React.useState('center');  // top | center | bottom
  const [watermark, setWatermark] = React.useState('');
  const [exportFormat, setExportFormat] = React.useState('mp4'); // detected at export
  const [freeDlUsed, setFreeDlUsed] = React.useState(false);
  const { isPro, user } = useAuth();

  // À chaque changement d'étape du wizard, remonter en haut de page
  React.useEffect(function () {
    try { window.scrollTo(0, 0); } catch (e) {}
  }, [step]);

  // Track free download usage per logged-in user
  React.useEffect(function () {
    if (user && !isPro) {
      try { setFreeDlUsed(localStorage.getItem('hm_free_dl_' + user.uid) === '1'); } catch (e) {}
    } else {
      setFreeDlUsed(false);
    }
  }, [user, isPro]);

  const triggerFreeDownload = function () {
    if (!downloadUrl) return;
    if (!user) { setShowGuestGate(true); return; }
    try { localStorage.setItem('hm_free_dl_' + user.uid, '1'); } catch (e) {}
    setFreeDlUsed(true);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'recitation-' + surah.fr + '-' + ayahNum + '-' + verseCount + 'v.' + exportFormat;
    document.body.appendChild(a); a.click(); a.remove();
  };

  const DIMS = { '9:16': [1080, 1920], '1:1': [1080, 1080], '16:9': [1920, 1080] };
  const cw = DIMS[aspect][0], ch = DIMS[aspect][1];
  const particlesRef = React.useRef(null);

  const canvasRef = React.useRef(null);
  const audioRef = React.useRef(null);
  const bgVideoRef = React.useRef(null);
  const bgImgRef = React.useRef(null);
  const animRef = React.useRef(null);
  const recorderRef = React.useRef(null);
  const previewRef = React.useRef(null);
  const chunksRef = React.useRef([]);
  const bgUrlRef = React.useRef(null);
  const customMp3UrlRef = React.useRef(null);
  const markingRef = React.useRef(null); // { actx, src, startTime, count }
  const genAudioRef = React.useRef(null); // playback during video generation
  const cvDataRef = React.useRef({ verse: null, bgType: 'black', fontId: 'Amiri', surahName: '', ayahNum: 1, loading: false });

  // Stop ALL audio on unmount (user navigates away)
  React.useEffect(function () {
    return function () {
      // Stop preview audio
      if (previewRef.current) {
        if (previewRef.current.stopExtra) previewRef.current.stopExtra();
        try { previewRef.current.stop(); } catch (e) {}
        previewRef.current = null;
      }
      // Stop calibration audio
      if (markingRef.current) {
        try { if (markingRef.current.src) markingRef.current.src.stop(); } catch (e) {}
        try { markingRef.current.actx.close(); } catch (e) {}
        markingRef.current = null;
      }
      // Stop generation playback audio
      if (genAudioRef.current) {
        try { genAudioRef.current.stop(); } catch (e) {}
        genAudioRef.current = null;
      }
      // Stop the HTML audio element used by preview
      if (audioRef.current) {
        try { audioRef.current.pause(); audioRef.current.removeAttribute('src'); audioRef.current.load(); } catch (e) {}
      }
      // Cancel any active recorder
      if (recorderRef.current) {
        try { if (recorderRef.current.state !== 'inactive') recorderRef.current.stop(); } catch (e) {}
        recorderRef.current = null;
      }
      // Stop RAF loop
      if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
    };
  }, []);
  const fadeRef = React.useRef({ alpha: 1, prevVerse: null }); // for verse fade transitions

  const surah = SURAHS.find((s) => s.n === surahNum) || SURAHS[0];
  const maxAyah = surah.a;
  const maxVerseCount = maxAyah - ayahNum + 1;

  // Load Arabic fonts once
  React.useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Scheherazade+New:wght@400;700&family=Noto+Naskh+Arabic:wght@400;700&family=Lateef:wght@400;700&family=Reem+Kufi:wght@400;700&family=Aref+Ruqaa:wght@400;700&family=Markazi+Text:wght@400;700&family=Cairo:wght@400;700&display=swap';
    document.head.appendChild(link);
    return () => {try {document.head.removeChild(link);} catch (e) {}};
  }, []);

  // Reset ayah on surah change
  React.useEffect(() => {if (ayahNum > maxAyah) setAyahNum(1);}, [surahNum]);
  // Clamp verseCount
  React.useEffect(() => {if (verseCount > maxVerseCount) setVerseCount(Math.max(1, maxVerseCount));}, [ayahNum, surahNum]);
  // Sync canvas data ref with current state
  React.useEffect(() => {
    cvDataRef.current = Object.assign({}, cvDataRef.current, { verse: verseData, bgType, fontId, surahName: surah.fr, ayahNum, loading, textMode, textColor, fontScale, textPos, watermark });
  }, [verseData, bgType, fontId, surah, ayahNum, loading, textMode, textColor, fontScale, textPos, watermark]);

  // Resize canvas when aspect ratio changes (render loop reads canvas.width/height each frame)
  React.useEffect(() => {
    if (canvasRef.current) { canvasRef.current.width = cw; canvasRef.current.height = ch; }
    particlesRef.current = null; // re-seed particles for new dims
  }, [aspect, cw, ch]);

  // Invalidate existing download when any setting that affects output changes
  React.useEffect(() => {
    if (downloadUrl) { try { URL.revokeObjectURL(downloadUrl); } catch (e) {} setDownloadUrl(null); }
  }, [surahNum, ayahNum, verseCount, reciterId, fontId, bgType, audioMode, customMp3, aspect, textMode, textColor, fontScale, textPos, watermark, mp3Timestamps]);


  // Fetch preview verse
  React.useEffect(() => {
    setLoading(true);
    setVerseData(null);
    fetch('https://api.alquran.cloud/v1/ayah/' + surahNum + ':' + ayahNum + '/editions/quran-simple,fr.hamidullah').
    then((r) => r.json()).
    then((d) => {if (d.code === 200) setVerseData({ ar: d.data[0].text, fr: d.data[1].text });}).
    catch(() => {}).
    finally(() => setLoading(false));
  }, [surahNum, ayahNum]);

  // Canvas loop — runs ONCE, reads canvasRef.current on EVERY frame so it follows canvas across step changes
  React.useEffect(() => {
    function render() {
      const canvas = canvasRef.current;
      if (!canvas) { animRef.current = requestAnimationFrame(render); return; }
      const ctx = canvas.getContext('2d');
      const W = canvas.width, H = canvas.height;
      const cd = cvDataRef.current;
      if (cd.verse !== fadeRef.current.prevVerse) { fadeRef.current.alpha = 0; fadeRef.current.prevVerse = cd.verse; }
      if (fadeRef.current.alpha < 1) fadeRef.current.alpha = Math.min(1, fadeRef.current.alpha + 0.045);
      renderStudioFrame(ctx, W, H, cd, performance.now() / 1000, particlesRef, fadeRef.current.alpha, bgVideoRef.current, bgImgRef.current);
      animRef.current = requestAnimationFrame(render);
    }
    render();
    return function () {if (animRef.current) cancelAnimationFrame(animRef.current);};
  }, []);

  const getAudioUrl = function (sNum, aNum) {
    return 'https://everyayah.com/data/' + reciterId + '/' + String(sNum).padStart(3, '0') + String(aNum).padStart(3, '0') + '.mp3';
  };

  const stopPreview = function () {
    if (previewRef.current) {
      if (previewRef.current.stopExtra) previewRef.current.stopExtra();
      previewRef.current.stop();
      previewRef.current = null;
    }
  };

  const startPreview = async function () {
    stopPreview();
    setIsPreviewLoading(true);
    let stopped = false;
    const audio = audioRef.current;
    if (!audio) { setIsPreviewLoading(false); return; }
    const timeouts = [];
    previewRef.current = {
      stop: function () {
        stopped = true;
        timeouts.forEach(clearTimeout);
        try { audio.pause(); audio.removeAttribute('src'); audio.load(); } catch (e) {}
        setIsPlaying(false); setIsPreviewLoading(false);
      },
      stopExtra: function () { timeouts.forEach(clearTimeout); }
    };

    const actualCount = Math.min(verseCount, maxAyah - ayahNum + 1);
    const vNums = Array.from({ length: actualCount }, function (_, i) { return ayahNum + i; });

    // Fetch verse texts in parallel
    const texts = await Promise.all(vNums.map(function (vNum) {
      return fetch('https://api.alquran.cloud/v1/ayah/' + surahNum + ':' + vNum + '/editions/quran-simple,fr.hamidullah')
        .then(function (r) { return r.json(); })
        .then(function (d) { return d.code === 200 ? { ar: d.data[0].text, fr: d.data[1].text } : { ar: '', fr: '' }; })
        .catch(function () { return { ar: '', fr: '' }; });
    }));
    if (stopped) return;

    // ── Custom MP3 path ──
    if (customMp3 && customMp3.url) {
      // Get boundaries: prefer manual, else auto-detect via Web Audio decode
      let boundaries = mp3Timestamps && mp3Timestamps.length === actualCount ? mp3Timestamps : null;
      if (!boundaries) {
        try {
          const actx = new (window.AudioContext || window.webkitAudioContext)();
          const ab = await fetch(customMp3.url).then(function (r) { return r.arrayBuffer(); });
          const buf = await actx.decodeAudioData(ab);
          boundaries = detectVerseBoundaries(buf, actualCount);
          actx.close().catch(function () {});
        } catch (e) { boundaries = vNums.map(function (_, i) { return i * 3; }); }
      }
      if (stopped) return;
      setIsPreviewLoading(false);
      setIsPlaying(true);
      audio.src = customMp3.url;
      audio.onended = function () { if (!stopped) { setIsPlaying(false); } };
      texts.forEach(function (t, i) {
        const delayMs = boundaries[i] * 1000;
        if (delayMs < 20) {
          cvDataRef.current = Object.assign({}, cvDataRef.current, { verse: t, ayahNum: vNums[i], loading: false });
        } else {
          timeouts.push(setTimeout(function () {
            if (!stopped) cvDataRef.current = Object.assign({}, cvDataRef.current, { verse: t, ayahNum: vNums[i], loading: false });
          }, delayMs));
        }
      });
      try { await audio.play(); } catch (e) { setIsPlaying(false); setIsPreviewLoading(false); }
      return;
    }

    // ── Auto reciter path: play each verse sequentially via HTMLAudioElement ──
    setIsPreviewLoading(false);
    setIsPlaying(true);
    cvDataRef.current = Object.assign({}, cvDataRef.current, { verse: null, loading: false });

    for (let i = 0; i < vNums.length; i++) {
      if (stopped) break;
      cvDataRef.current = Object.assign({}, cvDataRef.current, { verse: texts[i], ayahNum: vNums[i], loading: false });
      audio.src = getAudioUrl(surahNum, vNums[i]);
      try {
        await new Promise(function (resolve) {
          audio.onended = resolve;
          audio.onerror = resolve;
          const p = audio.play();
          if (p && p.catch) p.catch(resolve);
        });
      } catch (e) { break; }
    }

    if (!stopped) setIsPlaying(false);
    previewRef.current = null;
  };

  const handleBgUpload = function (e) {
    const file = e.target.files[0];if (!file) return;
    if (bgUrlRef.current) URL.revokeObjectURL(bgUrlRef.current);
    const url = URL.createObjectURL(file);bgUrlRef.current = url;
    if (file.type.startsWith('video/')) {
      setBgType('video');
      if (bgVideoRef.current) {bgVideoRef.current.src = url;bgVideoRef.current.loop = true;bgVideoRef.current.muted = true;bgVideoRef.current.play().catch(function () {});}
    } else {
      const img = new Image();img.onload = function () {bgImgRef.current = img;};img.src = url;
      setBgType('image');
    }
  };

  const handleMp3Upload = function (e) {
    const file = e.target.files[0];if (!file) return;
    if (customMp3UrlRef.current) URL.revokeObjectURL(customMp3UrlRef.current);
    const url = URL.createObjectURL(file);
    customMp3UrlRef.current = url;
    setCustomMp3({ url: url, name: file.name });
  };

  // One-click templates: combo of background + font + color + position
  const TEMPLATES = [
    { id: 'emouvant',  name: 'Émouvant',  emoji: '💚', bg: 'emerald', font: 'Amiri',          color: 'white',   pos: 'center' },
    { id: 'nuit',      name: 'Nuit',      emoji: '🌙', bg: 'night',   font: 'Scheherazade New',color: 'white',   pos: 'center' },
    { id: 'energique', name: 'Énergique', emoji: '🔥', bg: 'sunset',  font: 'Reem Kufi',       color: 'gold',    pos: 'bottom' },
    { id: 'minimal',   name: 'Minimal',   emoji: '⚪', bg: 'black',   font: 'Aref Ruqaa',      color: 'white',   pos: 'center' },
    { id: 'sacre',     name: 'Sacré',     emoji: '🕋', bg: 'kaaba',   font: 'Amiri',           color: 'gold',    pos: 'center' },
    { id: 'doré',      name: 'Doré',      emoji: '✨', bg: 'bokeh',   font: 'Cairo',           color: 'gold',    pos: 'center' },
  ];
  const applyTemplate = function (tpl) {
    setBgType(tpl.bg); setFontId(tpl.font); setTextColor(tpl.color); setTextPos(tpl.pos);
  };

  const clearCustomMp3 = function () {
    if (customMp3UrlRef.current) {URL.revokeObjectURL(customMp3UrlRef.current);customMp3UrlRef.current = null;}
    setCustomMp3(null);
    setMp3Timestamps(null);
    setIsMarking(false);
    if (markingRef.current) {try {markingRef.current.src.stop();} catch (e) {}markingRef.current.actx.close().catch(function () {});markingRef.current = null;}
  };

  const stopMarkingSession = function () {
    if (markingRef.current) {
      try {if (markingRef.current.src) markingRef.current.src.stop();} catch (e) {}
      markingRef.current.actx.close().catch(function () {});
      markingRef.current = null;
    }
    setIsMarking(false);
    setMarkingCountdown(null);
  };

  const startMarking = async function () {
    stopPreview();
    stopMarkingSession();
    setMp3Timestamps(null);
    const actualCount = Math.min(verseCount, maxAyah - ayahNum + 1);
    if (!customMp3 || !customMp3.url || actualCount < 1) return;

    // Fetch all verse texts in parallel
    const textFetches = Array.from({ length: actualCount }, function (_, i) {
      const vNum = ayahNum + i;
      return fetch('https://api.alquran.cloud/v1/ayah/' + surahNum + ':' + vNum + '/editions/quran-simple,fr.hamidullah').
      then(function (r) {return r.json();}).
      then(function (d) {return d.code === 200 ? { ar: d.data[0].text, fr: d.data[1].text, vNum: vNum } : { ar: '', fr: '', vNum: vNum };}).
      catch(function () {return { ar: '', fr: '', vNum: vNum };});
    });

    const [mp3ArrayBuf, ...texts] = await Promise.all([
    fetch(customMp3.url).then(function (r) {return r.arrayBuffer();}),
    ...textFetches]
    );

    const actx = new (window.AudioContext || window.webkitAudioContext)();
    await actx.resume();
    const mp3Buf = await actx.decodeAudioData(mp3ArrayBuf);

    // Store decoded audio in ref with pending flag — useEffect will start it after countdown
    markingRef.current = { actx, mp3Buf, count: actualCount, pending: true, src: null, startTime: null };

    // Show overlay + kick off countdown via state (useEffect drives the ticks)
    setMarkingTexts(texts);
    setMp3Timestamps([0]);
    setMarkingIndex(1);
    setIsMarking(true);
    setMarkingCountdown(3);
  };

  // Countdown ticker — each tick is a proper React state update driven by useEffect
  React.useEffect(function () {
    if (markingCountdown === null) return;

    if (markingCountdown > 0) {
      const t = setTimeout(function () {
        setMarkingCountdown(function (c) { return c - 1; });
      }, 1000);
      return function () { clearTimeout(t); };
    }

    // markingCountdown === 0 → "Go!" shown for 600ms then start audio
    const t = setTimeout(function () {
      setMarkingCountdown(null);
      if (!markingRef.current || !markingRef.current.pending) return;
      var m = markingRef.current;
      var src = m.actx.createBufferSource();
      src.buffer = m.mp3Buf;
      src.connect(m.actx.destination);
      var startTime = m.actx.currentTime;
      markingRef.current = { actx: m.actx, src: src, startTime: startTime, count: m.count };
      src.onended = function () { setIsMarking(false); markingRef.current = null; };
      src.start(0);
    }, 600);
    return function () { clearTimeout(t); };
  }, [markingCountdown]);

  const markNext = function () {
    if (!markingRef.current || !isMarking) return;
    const { actx, startTime, count } = markingRef.current;
    const t = actx.currentTime - startTime;
    setMp3Timestamps(function (prev) {return prev ? [...prev, t] : [0, t];});
    setMarkingIndex(function (prev) {
      const next = prev + 1;
      if (next >= count) {
        // All verses marked — stop audio
        setTimeout(stopMarkingSession, 300);
      }
      return next;
    });
  };

  // Spacebar listener for calibration — much more precise than mouse click
  React.useEffect(function () {
    if (!isMarking) return;
    function onKey(e) {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (!markingRef.current) return;
        const { actx, startTime, count } = markingRef.current;
        const t = actx.currentTime - startTime;
        setMp3Timestamps(function (prev) { return prev ? [...prev, t] : [0, t]; });
        setMarkingIndex(function (prev) {
          const next = prev + 1;
          if (next >= count) setTimeout(stopMarkingSession, 300);
          return next;
        });
      }
    }
    window.addEventListener('keydown', onKey);
    return function () { window.removeEventListener('keydown', onKey); };
  }, [isMarking]);

  // Build the audio plan (concat each verse, return concatenated AudioBuffer + per-verse start times)
  const buildAudioPlan = async function (actx) {
    const actualCount = Math.min(verseCount, maxAyah - ayahNum + 1);
    const verses = await Promise.all(Array.from({ length: actualCount }, async function (_, i) {
      const vNum = ayahNum + i;
      try {
        const res = await fetch('https://api.alquran.cloud/v1/ayah/' + surahNum + ':' + vNum + '/editions/quran-simple,fr.hamidullah');
        const d = await res.json();
        return d.code === 200 ? { ar: d.data[0].text, fr: d.data[1].text, ayah: vNum } : { ar: '', fr: '', ayah: vNum };
      } catch (e) { return { ar: '', fr: '', ayah: vNum }; }
    }));

    // Custom MP3 path: single buffer, boundaries from calibration or auto-detect
    if (customMp3 && customMp3.url) {
      const ab = await fetch(customMp3.url).then(function (r) { return r.arrayBuffer(); });
      const buf = await actx.decodeAudioData(ab);
      const boundaries = (mp3Timestamps && mp3Timestamps.length === verses.length)
        ? mp3Timestamps.slice() : detectVerseBoundaries(buf, verses.length);
      return { verses: verses, audioBuf: buf, starts: boundaries, totalDur: buf.duration };
    }

    // Auto reciter path: fetch each verse mp3, concat into one AudioBuffer
    const bufs = await Promise.all(verses.map(function (v) {
      return fetch(getAudioUrl(surahNum, v.ayah))
        .then(function (r) { return r.arrayBuffer(); })
        .then(function (b) { return actx.decodeAudioData(b); })
        .catch(function () { return null; });
    }));
    const sr = (bufs.find(function (b) { return b; }) || { sampleRate: 44100 }).sampleRate;
    const channels = Math.max.apply(null, bufs.map(function (b) { return b ? b.numberOfChannels : 1; }));
    const starts = []; let cursor = 0;
    bufs.forEach(function (b) { starts.push(cursor); if (b) cursor += b.duration; });
    const totalSamples = Math.ceil(cursor * sr);
    const out = actx.createBuffer(channels, totalSamples, sr);
    for (let i = 0; i < bufs.length; i++) {
      const b = bufs[i]; if (!b) continue;
      const offsetSamples = Math.floor(starts[i] * sr);
      for (let c = 0; c < channels; c++) {
        const src = b.getChannelData(Math.min(c, b.numberOfChannels - 1));
        out.getChannelData(c).set(src, offsetSamples);
      }
    }
    return { verses: verses, audioBuf: out, starts: starts, totalDur: cursor };
  };

  // ── Offline encoder via WebCodecs + mp4-muxer ──
  const createVideoOffline = async function () {
    if (!window.VideoEncoder || !window.AudioEncoder || !window.Mp4Muxer) return false;
    // Drop FPS aggressively for static content — text is stationary, eyes won't notice.
    // Animated bgs need more frames; static ones can run at 4 fps with no visual loss.
    const ANIMATED_BG_FPS = { stars: 1, night: 1, kaaba: 1, bokeh: 1, video: 1 };
    const FPS = ANIMATED_BG_FPS[bgType] ? 15 : 4;
    const W = cw, H = ch;
    const supportH264 = await VideoEncoder.isConfigSupported({ codec: 'avc1.42E01F', width: W, height: H, bitrate: 4_000_000, framerate: FPS }).then(function (r) { return r && r.supported; }).catch(function () { return false; });
    if (!supportH264) return false;

    setStatusMsg('Chargement des versets…');
    setProgress(2);
    const actx = new (window.OfflineAudioContext || window.AudioContext)(2, 44100 * 2, 44100); // throwaway just for decode
    let plan;
    try { plan = await buildAudioPlan(actx); } catch (e) { return false; }
    if (!plan || !plan.audioBuf || plan.totalDur < 0.1) return false;

    // ── Play audio during generation using the AudioContext created at user click ──
    try {
      const slot = genAudioRef.current;
      if (slot && slot.ctx && !slot.started) {
        try { await slot.ctx.resume(); } catch(e){}
        const psrc = slot.ctx.createBufferSource();
        psrc.buffer = plan.audioBuf;
        psrc.connect(slot.ctx.destination);
        slot.src = psrc; slot.started = true;
        psrc.onended = function(){
          try { slot.ctx.close(); } catch(e){}
          if (genAudioRef.current === slot) genAudioRef.current = null;
        };
        psrc.start(0);
      }
    } catch (e) {}

    const totalFrames = Math.ceil(plan.totalDur * FPS);
    setProgress(10);

    // Muxer
    const muxer = new window.Mp4Muxer.Muxer({
      target: new window.Mp4Muxer.ArrayBufferTarget(),
      video: { codec: 'avc', width: W, height: H, frameRate: FPS },
      audio: { codec: 'aac', sampleRate: plan.audioBuf.sampleRate, numberOfChannels: Math.min(2, plan.audioBuf.numberOfChannels) },
      fastStart: 'in-memory',
    });

    const videoEncoder = new VideoEncoder({
      output: function (chunk, meta) { muxer.addVideoChunk(chunk, meta); },
      error: function (e) { console.error('VideoEncoder error', e); },
    });
    videoEncoder.configure({ codec: 'avc1.42E01F', width: W, height: H, bitrate: 4_000_000, framerate: FPS, latencyMode: 'realtime', avc: { format: 'avc' } });

    const audioEncoder = new AudioEncoder({
      output: function (chunk, meta) { muxer.addAudioChunk(chunk, meta); },
      error: function (e) { console.error('AudioEncoder error', e); },
    });
    const audioChannels = Math.min(2, plan.audioBuf.numberOfChannels);
    audioEncoder.configure({ codec: 'mp4a.40.2', sampleRate: plan.audioBuf.sampleRate, numberOfChannels: audioChannels, bitrate: 128_000 });

    // ── Render video frames offline ──
    setStatusMsg('Rendu vidéo…');
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const ctx = off.getContext('2d', { alpha: false });
    const particles = { current: null };
    const baseSettings = { bgType, fontId, textMode, textColor, fontScale, textPos, watermark };
    const FADE_DURATION = 0.4; // seconds

    // Pre-render static backgrounds once (huge speedup for non-animated bg types)
    const ANIMATED_BG = { stars: 1, night: 1, kaaba: 1, bokeh: 1, video: 1 };
    const isAnimatedBg = ANIMATED_BG[bgType] === 1;
    let bgCache = null;
    if (!isAnimatedBg) {
      bgCache = document.createElement('canvas');
      bgCache.width = W; bgCache.height = H;
      const bctx = bgCache.getContext('2d', { alpha: false });
      // Draw bg + vignette into cache using a no-text settings object
      renderStudioFrame(bctx, W, H, { bgType: bgType, verse: null, loading: null }, 0, { current: null }, 1, null, bgImgRef.current);
    }

    // Pre-compute per-verse text layouts to avoid wrapCanvasText on every frame
    const TEXT_CACHE = plan.verses.map(function (v) {
      const tmp = document.createElement('canvas').getContext('2d');
      const showAr = textMode !== 'french';
      const showFr = textMode !== 'arabic';
      const arSz = Math.round(W * 0.052 * fontScale);
      const arFont = 'bold ' + arSz + 'px "' + fontId + '", "Amiri", serif';
      const frSz = Math.round(W * 0.036 * fontScale);
      const frFont = frSz + 'px "Plus Jakarta Sans", sans-serif';
      return {
        arLines: showAr ? wrapCanvasText(tmp, v.ar || '', W - W*0.12, arFont) : [],
        frLines: showFr ? wrapCanvasText(tmp, v.fr || '', W - W*0.14, frFont) : [],
      };
    });

    let lastYield = performance.now();
    let lastFrameKey = '';
    for (let f = 0; f < totalFrames; f++) {
      const t = f / FPS;
      let vIdx = 0;
      for (let i = plan.starts.length - 1; i >= 0; i--) { if (t >= plan.starts[i]) { vIdx = i; break; } }
      const verse = plan.verses[vIdx];
      const tInto = t - plan.starts[vIdx];
      const fade = Math.min(1, tInto / FADE_DURATION);
      // Skip redraw if static bg + settled fade + same verse — canvas already correct
      const fadeBucket = fade >= 1 ? 'S' : Math.round(fade * 20);
      const frameKey = vIdx + ':' + fadeBucket;
      const needsRedraw = isAnimatedBg || frameKey !== lastFrameKey;
      if (needsRedraw) {
        if (bgCache) {
          ctx.drawImage(bgCache, 0, 0);
          drawTextAndWatermark(ctx, W, H, Object.assign({}, baseSettings, { verse: { ar: verse.ar, fr: verse.fr }, ayahNum: verse.ayah }), fade, TEXT_CACHE[vIdx]);
        } else {
          const settings = Object.assign({}, baseSettings, { verse: { ar: verse.ar, fr: verse.fr }, ayahNum: verse.ayah, loading: null });
          renderStudioFrame(ctx, W, H, settings, t, particles, fade, null, bgImgRef.current);
        }
        lastFrameKey = frameKey;
      }
      const frame = new VideoFrame(off, { timestamp: Math.round(t * 1_000_000), duration: Math.round(1_000_000 / FPS) });
      videoEncoder.encode(frame, { keyFrame: f % (FPS * 2) === 0 });
      frame.close();
      if (videoEncoder.encodeQueueSize > 24) {
        await new Promise(function (r) { setTimeout(r, 0); });
      }
      const now = performance.now();
      if (now - lastYield > 120) {
        const pct = Math.round((f / totalFrames) * 100);
        setProgress(10 + Math.round((f / totalFrames) * 70));
        setStatusMsg('Encodage… ' + pct + '%');
        await new Promise(function (r) { setTimeout(r, 0); });
        lastYield = performance.now();
      }
    }

    setStatusMsg('Encodage audio…');
    setProgress(82);
    // Feed audio in 1-second chunks
    const sr = plan.audioBuf.sampleRate;
    const chunkFrames = sr * 5; // 5s chunks — fewer encode calls
    const numFrames = plan.audioBuf.length;
    // Interleave channels into Float32 planar packed
    for (let pos = 0; pos < numFrames; pos += chunkFrames) {
      const size = Math.min(chunkFrames, numFrames - pos);
      const planar = new Float32Array(size * audioChannels);
      for (let c = 0; c < audioChannels; c++) {
        planar.set(plan.audioBuf.getChannelData(c).subarray(pos, pos + size), c * size);
      }
      const ad = new AudioData({
        format: 'f32-planar',
        sampleRate: sr,
        numberOfFrames: size,
        numberOfChannels: audioChannels,
        timestamp: Math.round((pos / sr) * 1_000_000),
        data: planar,
      });
      audioEncoder.encode(ad);
      ad.close();
      if (audioEncoder.encodeQueueSize > 8) {
        await new Promise(function (r) { setTimeout(r, 1); });
      }
    }

    setStatusMsg('Finalisation…');
    setProgress(95);
    await videoEncoder.flush();
    await audioEncoder.flush();
    muxer.finalize();
    const buf = muxer.target.buffer;
    const blob = new Blob([buf], { type: 'video/mp4' });
    setExportFormat('mp4');
    setDownloadUrl(URL.createObjectURL(blob));
    setIsCreating(false); setProgress(0); setStatusMsg('');
    try { actx.close && actx.close(); } catch (e) {}
    return true;
  };

  // ── Realtime fallback (MediaRecorder) for browsers without WebCodecs ──
  const createVideoRealtime = async function () {
    const actx = new (window.AudioContext || window.webkitAudioContext)();
    actx.resume().catch(function () {});
    const audioDest = actx.createMediaStreamDestination();
    const canvas = canvasRef.current;
    const actualCount = Math.min(verseCount, maxAyah - ayahNum + 1);
    setStatusMsg('Chargement des versets…');
    const verses = await Promise.all(Array.from({ length: actualCount }, async function (_, i) {
      const vNum = ayahNum + i;
      try {
        const res = await fetch('https://api.alquran.cloud/v1/ayah/' + surahNum + ':' + vNum + '/editions/quran-simple,fr.hamidullah');
        const d = await res.json();
        return d.code === 200 ? { ar: d.data[0].text, fr: d.data[1].text, ayah: vNum } : { ar: '', fr: '', ayah: vNum };
      } catch (e) { return { ar: '', fr: '', ayah: vNum }; }
    }));
    setProgress(25);
    setStatusMsg('Enregistrement…');
    const cvStream = canvas.captureStream(30);
    const tracks = cvStream.getVideoTracks().slice();
    audioDest.stream.getAudioTracks().forEach(function (t) { tracks.push(t); });
    const finalStream = new MediaStream(tracks);
    const MP4_TYPES = ['video/mp4;codecs=avc1.42E01E', 'video/mp4;codecs=h264', 'video/mp4'];
    const WEBM_TYPES = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
    let mime = '', isMp4 = false;
    for (const m of MP4_TYPES) { if (MediaRecorder.isTypeSupported(m)) { mime = m; isMp4 = true; break; } }
    if (!mime) for (const m of WEBM_TYPES) { if (MediaRecorder.isTypeSupported(m)) { mime = m; break; } }
    const outType = isMp4 ? 'video/mp4' : 'video/webm';
    setExportFormat(isMp4 ? 'mp4' : 'webm');
    const rec = new MediaRecorder(finalStream, { mimeType: mime, videoBitsPerSecond: 8000000 });
    chunksRef.current = [];
    rec.ondataavailable = function (ev) { if (ev.data.size > 0) chunksRef.current.push(ev.data); };
    rec.onstop = function () {
      const blob = new Blob(chunksRef.current, { type: outType });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsCreating(false); setProgress(0); setStatusMsg('');
      actx.close().catch(function () {});
    };
    recorderRef.current = rec;
    rec.start(100);
    if (customMp3 && customMp3.url) {
      try {
        const mp3ArrayBuf = await fetch(customMp3.url).then(function (r) { return r.arrayBuffer(); });
        const mp3Buf = await actx.decodeAudioData(mp3ArrayBuf);
        const boundaries = mp3Timestamps && mp3Timestamps.length === verses.length ? mp3Timestamps : detectVerseBoundaries(mp3Buf, verses.length);
        setProgress(50);
        verses.forEach(function (v, i) {
          const delayMs = boundaries[i] * 1000;
          const apply = function () {
            cvDataRef.current = Object.assign({}, cvDataRef.current, { verse: { ar: v.ar, fr: v.fr }, ayahNum: v.ayah });
            setProgress(50 + Math.round((i + 1) / verses.length * 50));
            setStatusMsg('Verset ' + (i + 1) + ' / ' + verses.length + '…');
          };
          if (delayMs < 20) apply(); else setTimeout(apply, delayMs);
        });
        await new Promise(function (resolve) {
          const src = actx.createBufferSource();
          src.buffer = mp3Buf;
          src.connect(audioDest); src.connect(actx.destination);
          src.onended = resolve; src.start(0);
        });
      } catch (e) { setStatusMsg('Erreur MP3'); }
      rec.stop();
      return;
    }
    const audioPending = verses.map(function (v) {
      return fetch(getAudioUrl(surahNum, v.ayah)).then(function (r) { return r.arrayBuffer(); }).then(function (b) { return actx.decodeAudioData(b); }).catch(function () { return null; });
    });
    for (let i = 0; i < verses.length; i++) {
      const v = verses[i];
      cvDataRef.current = Object.assign({}, cvDataRef.current, { verse: { ar: v.ar, fr: v.fr }, ayahNum: v.ayah });
      setStatusMsg('Verset ' + (i + 1) + ' / ' + verses.length + '…');
      const audioBuf = await audioPending[i];
      if (audioBuf) {
        await new Promise(function (resolve) {
          const src = actx.createBufferSource();
          src.buffer = audioBuf;
          src.connect(audioDest); src.connect(actx.destination);
          src.onended = resolve; src.start(0);
        });
      }
      setProgress(25 + Math.round((i + 1) / verses.length * 75));
    }
    rec.stop();
  };

  const createVideoAuto = async function () {
    if (isCreating) return;
    setIsCreating(true); setProgress(0); setDownloadUrl(null);
    setStatusMsg('Préparation…');

    // Create playback AudioContext SYNCHRONOUSLY within user gesture so autoplay isn't blocked.
    // Stored in ref; createVideoOffline picks it up later when plan is ready.
    try {
      if (genAudioRef.current) { try { genAudioRef.current.stop(); } catch(e){} }
      const pactx = new (window.AudioContext || window.webkitAudioContext)();
      try { pactx.resume(); } catch(e){}
      genAudioRef.current = { ctx: pactx, src: null, started: false, stop: function(){ try { if(this.src) this.src.stop(); } catch(e){} try { pactx.close(); } catch(e){} genAudioRef.current = null; } };
    } catch (e) {}

    try {
      const ok = await createVideoOffline();
      if (ok) return;
    } catch (e) { console.warn('Offline encode failed, falling back to realtime', e); }
    // Fallback realtime
    setStatusMsg('Mode compatible — enregistrement en temps réel…');
    try { await createVideoRealtime(); } catch (e) {
      setStatusMsg('Erreur génération');
      setIsCreating(false); setProgress(0);
    }
  };

  const selStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, color: '#fff', padding: '10px 14px', fontSize: 14, cursor: 'pointer', outline: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif', WebkitAppearance: 'none', appearance: 'none' };
  const panelStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 20 };
  const secLabel = { color: 'rgba(255,255,255,0.42)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 14px' };
  const fieldLabel = { color: 'rgba(255,255,255,0.36)', fontSize: 12, display: 'block', marginBottom: 6 };
  const optBtn = function (active) {return { background: active ? 'rgba(200,167,39,0.14)' : 'rgba(255,255,255,0.03)', border: active ? '1px solid rgba(200,167,39,0.38)' : '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '9px 14px', cursor: 'pointer', color: active ? '#c8a727' : 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 600, textAlign: 'left', transition: 'all 0.15s', fontFamily: 'Plus Jakarta Sans,sans-serif' };};
  const smallBtn = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, color: '#fff', padding: '9px 13px', cursor: 'pointer', fontSize: 15, fontFamily: 'Plus Jakarta Sans,sans-serif' };

  const actualCount = Math.min(verseCount, maxAyah - ayahNum + 1);
  const calibrated = mp3Timestamps && mp3Timestamps.length === actualCount;

  const STEP_LABELS = ['Configuration', 'Audio', 'Aperçu & Export'];

  const btnPrimary = { background: 'linear-gradient(135deg,#a8891f,#c4a83a)', border: 'none', color: '#f5edd8', padding: '13px 32px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', transition: 'transform 0.15s' };
  const btnSecondary = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif' };

  return (
    <div className="fade-up" style={{ minHeight: '100vh', paddingBottom: 80, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

      {/* Fixed back button */}
      <button onClick={() => navigate('home')} style={{ position: 'fixed', top: 20, left: 20, zIndex: 300, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '10px 18px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(8px)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>← Retour</button>

      {/* Hidden elements */}
      <audio ref={audioRef} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onEnded={() => setIsPlaying(false)} />
      <video ref={bgVideoRef} style={{ display: 'none' }} muted loop playsInline />

      {/* ── Header ── */}
      <div style={{ textAlign: 'center', padding: '90px 20px 40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(200,167,39,0.1)', border: '1px solid rgba(200,167,39,0.25)', borderRadius: 20, padding: '5px 16px', marginBottom: 16 }}>
          <span style={{ fontSize: 14 }}>🎬</span>
          <span style={{ color: '#c8a727', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Studio Vidéo</span>
        </div>
        <h1 style={{ fontSize: 'clamp(32px,6vw,56px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.05, margin: '0 0 12px', color: '#fff' }}>
          Crée ta <span style={{ color: '#c8a727' }}>vidéo</span> coran
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: 14, margin: 0 }}>Prête pour TikTok & Instagram Reels</p>
      </div>

      {/* ── Stepper ── */}
      <div style={{ maxWidth: 560, margin: '0 auto 36px', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {STEP_LABELS.map((lbl, i) => {
            const s = i + 1;
            const done = step > s;
            const active = step === s;
            return (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, transition: 'all 0.25s', background: done ? '#c8a727' : active ? 'rgba(200,167,39,0.18)' : 'rgba(255,255,255,0.06)', border: done ? 'none' : active ? '2px solid #c8a727' : '1.5px solid rgba(255,255,255,0.12)', color: done ? '#000' : active ? '#c8a727' : 'rgba(255,255,255,0.3)', cursor: done ? 'pointer' : 'default' }}
                    onClick={() => { if (done) setStep(s); }}>
                    {done ? '✓' : s}
                  </div>
                  <span className="studio-stepper-label" style={{ fontSize: 11, fontWeight: 600, color: active ? '#c8a727' : done ? 'rgba(200,167,39,0.7)' : 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>{lbl}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 2, background: done ? '#c8a727' : 'rgba(255,255,255,0.08)', marginBottom: 22, transition: 'background 0.3s' }} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 16px' }}>

        {/* ══════════════════════════════════════
            ÉTAPE 1 — Configuration (2-col)
        ══════════════════════════════════════ */}
        {step === 1 && (
          <div className="studio-step1-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 28, alignItems: 'start' }}>

            {/* Step header spanning full width */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#c8a727', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#000', flexShrink: 0 }}>1</div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>Configuration de la vidéo</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* LEFT — Config panels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Templates 1-clic */}
              <div style={panelStyle}>
                <p style={secLabel}>⚡ Styles rapides</p>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, margin: '0 0 12px', lineHeight: 1.5 }}>1 clic = fond + police + couleur assortis</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
                  {TEMPLATES.map(tpl => {
                    const on = bgType === tpl.bg && fontId === tpl.font && textColor === tpl.color && textPos === tpl.pos;
                    return (
                      <button key={tpl.id} onClick={() => applyTemplate(tpl)} style={{ ...optBtn(on), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px', textAlign: 'center' }}>
                        <span style={{ fontSize: 18, lineHeight: 1 }}>{tpl.emoji}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1 }}>{tpl.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sourate & Versets */}
              <div style={panelStyle}>
                <p style={secLabel}>📖 Sourate & Versets</p>
                <label style={fieldLabel}>Sourate</label>
                <div style={{ position: 'relative', marginBottom: 14 }}>
                  <select value={surahNum} onChange={e => setSurahNum(Number(e.target.value))} style={selStyle}>
                    {SURAHS.map(s => <option key={s.n} value={s.n} style={{ background: '#061a0c' }}>{s.n}. {s.fr} — {s.ar}</option>)}
                  </select>
                  <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', pointerEvents: 'none', fontSize: 11 }}>▼</span>
                </div>
                <label style={fieldLabel}>Verset de départ (1–{maxAyah})</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <button onClick={() => setAyahNum(a => Math.max(1, a - 1))} style={smallBtn}>−</button>
                  <input type="number" min={1} max={maxAyah} value={ayahNum} onChange={e => setAyahNum(Math.min(maxAyah, Math.max(1, Number(e.target.value))))} style={{ ...selStyle, width: 70, textAlign: 'center' }} />
                  <button onClick={() => setAyahNum(a => Math.min(maxAyah, a + 1))} style={smallBtn}>+</button>
                </div>
                <label style={fieldLabel}>Nombre de versets (1–{maxVerseCount})</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => setVerseCount(v => Math.max(1, v - 1))} style={smallBtn}>−</button>
                  <input type="number" min={1} max={maxVerseCount} value={verseCount} onChange={e => setVerseCount(Math.min(maxVerseCount, Math.max(1, Number(e.target.value) || 1)))} style={{ ...selStyle, width: 80, textAlign: 'center' }} />
                  <button onClick={() => setVerseCount(v => Math.min(maxVerseCount, v + 1))} style={smallBtn}>+</button>
                  <button onClick={() => setVerseCount(maxVerseCount)} style={{ ...smallBtn, fontSize: 12, padding: '9px 10px', color: 'rgba(200,167,39,0.7)', borderColor: 'rgba(200,167,39,0.2)' }}>Tout</button>
                </div>
                {verseCount > 1 && <p style={{ color: 'rgba(200,167,39,0.6)', fontSize: 12, margin: '10px 0 0' }}>Versets {ayahNum} → {Math.min(ayahNum + verseCount - 1, maxAyah)} · {surah.fr}</p>}
              </div>

              {/* Police */}
              <div style={panelStyle}>
                <p style={secLabel}>✍️ Police arabe</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                  {FONT_OPTIONS.map(f => (
                    <button key={f.id} onClick={() => setFontId(f.id)} style={{ ...optBtn(fontId === f.id), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 6px', textAlign: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1 }}>{f.label}</span>
                      <span style={{ fontFamily: `"${f.id}", serif`, fontSize: 16, opacity: 0.8, direction: 'rtl', lineHeight: 1.2 }}>بسم الله</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Arrière-plan */}
              <div style={panelStyle}>
                <p style={secLabel}>🖼 Arrière-plan</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7, marginBottom: 8 }}>
                  {BG_PRESETS.map(b => (
                    <button key={b.id} onClick={() => setBgType(b.id)} style={{ ...optBtn(bgType === b.id), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 4px', textAlign: 'center' }}>
                      <span style={{ fontSize: 18, lineHeight: 1 }}>{b.emoji}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, lineHeight: 1.1 }}>{b.label}</span>
                    </button>
                  ))}
                </div>
                <label style={{ ...optBtn(bgType === 'video' || bgType === 'image'), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                  📁 Importer ma vidéo / image
                  <input type="file" accept="video/*,image/*" onChange={handleBgUpload} style={{ display: 'none' }} />
                </label>
              </div>

              {/* Format */}
              <div style={panelStyle}>
                <p style={secLabel}>📐 Format</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
                  {[['9:16','TikTok / Reels'],['1:1','Post carré'],['16:9','YouTube']].map(a => (
                    <button key={a[0]} onClick={() => setAspect(a[0])} style={{ ...optBtn(aspect === a[0]), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '10px 4px', textAlign: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 800, lineHeight: 1 }}>{a[0]}</span>
                      <span style={{ fontSize: 9, opacity: 0.7, lineHeight: 1.1 }}>{a[1]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Police */}
              <div style={panelStyle}>
                <p style={secLabel}>✍️ Police arabe</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                  {FONT_OPTIONS.map(f => (
                    <button key={f.id} onClick={() => setFontId(f.id)} style={{ ...optBtn(fontId === f.id), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 6px', textAlign: 'center' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1 }}>{f.label}</span>
                      <span style={{ fontFamily: `"${f.id}", serif`, fontSize: 16, opacity: 0.8, direction: 'rtl', lineHeight: 1.2 }}>بسم الله</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Texte */}
              <div style={panelStyle}>
                <p style={secLabel}>🔤 Texte affiché</p>
                <label style={fieldLabel}>Contenu</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7, marginBottom: 14 }}>
                  {[['both','Arabe + FR'],['arabic','Arabe seul'],['french','FR seul']].map(m => (
                    <button key={m[0]} onClick={() => setTextMode(m[0])} style={{ ...optBtn(textMode === m[0]), padding: '9px 4px', textAlign: 'center', fontSize: 11 }}>{m[1]}</button>
                  ))}
                </div>
                <label style={fieldLabel}>Couleur</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7, marginBottom: 14 }}>
                  {[['white','Blanc'],['gold','Doré'],['outline','Contour']].map(c => (
                    <button key={c[0]} onClick={() => setTextColor(c[0])} style={{ ...optBtn(textColor === c[0]), padding: '9px 4px', textAlign: 'center', fontSize: 11 }}>{c[1]}</button>
                  ))}
                </div>
                <label style={fieldLabel}>Position</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7, marginBottom: 14 }}>
                  {[['top','Haut'],['center','Centre'],['bottom','Bas']].map(p => (
                    <button key={p[0]} onClick={() => setTextPos(p[0])} style={{ ...optBtn(textPos === p[0]), padding: '9px 4px', textAlign: 'center', fontSize: 11 }}>{p[1]}</button>
                  ))}
                </div>
                <label style={fieldLabel}>Taille du texte — {Math.round(fontScale*100)}%</label>
                <input type="range" min={0.8} max={1.3} step={0.05} value={fontScale} onChange={e => setFontScale(Number(e.target.value))} style={{ width: '100%', accentColor: '#c8a727' }} />
              </div>

              {/* Watermark */}
              <div style={panelStyle}>
                <p style={secLabel}>🏷 Ta signature (option)</p>
                <input type="text" value={watermark} maxLength={30} onChange={e => setWatermark(e.target.value)} placeholder="@ton_pseudo" style={selStyle} />
                <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11, margin: '8px 0 0' }}>Affichée en bas de la vidéo.</p>
              </div>

            </div>

            {/* RIGHT — Live preview (sticky) */}
            <div className="studio-preview-sticky" style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Aperçu en direct</p>
              <div style={{ background: '#000', borderRadius: 18, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.07)' }}>
                <canvas ref={canvasRef} className="studio-canvas-preview" width={cw} height={ch} style={{ display: 'block', height: aspect === '16:9' ? 'auto' : '74vh', width: aspect === '16:9' ? 'min(100%,520px)' : 'auto', maxHeight: 660, maxWidth: '100%' }} />
              </div>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, margin: 0, textAlign: 'center' }}>Format {aspect} · {cw}×{ch} HD</p>
              <button onClick={() => setStep(2)} style={{ ...btnPrimary, padding: '13px 48px' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                Suivant — Choisir l'audio →
              </button>
            </div>

          </div>
        )}

        {/* ══════════════════════════════════════
            ÉTAPE 2 — Audio
        ══════════════════════════════════════ */}
        {step === 2 && (
          <div className="studio-step2" style={{ maxWidth: 560, margin: '0 auto' }}>

            {/* Step header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#c8a727', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#000', flexShrink: 0 }}>2</div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>Choix de l'audio</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* Mode toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 28 }}>
              {[
                { id: 'auto', icon: '🎙', title: 'Récitation automatique', desc: 'Choisis un récitateur parmi notre sélection' },
                { id: 'custom', icon: '🎵', title: 'Importer mon audio', desc: 'Utilise ta propre récitation MP3' }
              ].map(m => (
                <button key={m.id} onClick={() => setAudioMode(m.id)} style={{ background: audioMode === m.id ? 'rgba(200,167,39,0.10)' : 'rgba(255,255,255,0.03)', border: audioMode === m.id ? '2px solid rgba(200,167,39,0.5)' : '1.5px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: '18px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.18s', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{m.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: audioMode === m.id ? '#c8a727' : '#fff', marginBottom: 4 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{m.desc}</div>
                </button>
              ))}
            </div>

            {/* Auto récitateur */}
            {audioMode === 'auto' && (
              <div style={panelStyle}>
                <p style={secLabel}>Récitateur</p>
                {(() => {
                  const RECITER_DESC = {
                    'Alafasy_128kbps': 'Koweït · Classique',
                    'Abdurrahmaan_As-Sudais_192kbps': 'Médine · Majestueux',
                    'Saood_ash-Shuraym_128kbps': 'Médine · Puissant',
                    'Yasser_Ad-Dussary_128kbps': 'Arabie · Émouvant',
                    'Abdul_Basit_Murattal_192kbps': 'Égypte · Traditionnel',
                    'Husary_128kbps': 'Égypte · Tarteel',
                    'Nasser_Alqatami_128kbps': 'Koweït · Melodieux',
                    'MaherAlMuaiqly128kbps': 'Médine · Energique',
                  };
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {RECITERS.map(r => (
                        <button key={r.id} onClick={() => setReciterId(r.id)} style={{ ...optBtn(reciterId === r.id), display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, padding: '10px 12px' }}>
                          <span style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>🎙 {r.name}</span>
                          <span style={{ fontSize: 11, color: reciterId === r.id ? 'rgba(200,167,39,0.65)' : 'rgba(255,255,255,0.35)', lineHeight: 1.2, fontWeight: 400 }}>{RECITER_DESC[r.id] || ''}</span>
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Custom MP3 */}
            {audioMode === 'custom' && (
              <div style={panelStyle}>
                <p style={secLabel}>Ta récitation MP3</p>

                {!customMp3 ? (
                  <label style={{ display: 'block', cursor: 'pointer' }}>
                    <div style={{ border: '2px dashed rgba(200,167,39,0.3)', borderRadius: 14, padding: '32px 20px', textAlign: 'center', background: 'rgba(200,167,39,0.03)', transition: 'all 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor='rgba(200,167,39,0.55)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor='rgba(200,167,39,0.3)'}>
                      <div style={{ fontSize: 36, marginBottom: 10 }}>🎙</div>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, margin: '0 0 6px' }}>Clique ou glisse ton fichier ici</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: 0 }}>MP3, M4A, AAC, WAV</p>
                    </div>
                    <input type="file" accept="audio/*" onChange={handleMp3Upload} style={{ display: 'none' }} />
                  </label>
                ) : (
                  <div>
                    {/* File loaded */}
                    <div style={{ background: 'rgba(200,167,39,0.07)', border: '1px solid rgba(200,167,39,0.2)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                      <span style={{ fontSize: 22 }}>🎵</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: '#c8a727', fontSize: 13, fontWeight: 700, margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{customMp3.name}</p>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>Audio chargé</p>
                      </div>
                      <button onClick={clearCustomMp3} style={{ background: 'none', border: 'none', color: 'rgba(255,100,100,0.6)', cursor: 'pointer', fontSize: 18 }}>✕</button>
                    </div>

                    {/* Calibration status */}
                    {calibrated ? (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 10 }}>
                          <span>✅</span>
                          <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 700 }}>Synchronisation calibrée — {mp3Timestamps.length} versets</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                          {mp3Timestamps.map((t, i) => {
                            const m = Math.floor(t/60), s = (t%60).toFixed(1);
                            return <span key={i} style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 6, padding: '3px 8px', fontSize: 11, color: 'rgba(74,222,128,0.8)', fontFamily: 'monospace' }}>V{i+1} {m>0?m+'m':''}{s}s</span>;
                          })}
                        </div>
                        <button onClick={startMarking} style={{ width: '100%', ...optBtn(false), textAlign: 'center' }}>🔄 Re-calibrer</button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.18)', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
                          <span style={{ flexShrink: 0 }}>✨</span>
                          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12.5, lineHeight: 1.5 }}><strong style={{ color: '#4ade80' }}>Synchro automatique activée.</strong> Les versets s'affichent tout seuls — tu peux générer direct. Pour un calage parfait, calibre à la main (optionnel).</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
                          <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, fontSize: 12, margin: '0 0 8px' }}>Calibration manuelle — 3 étapes</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {['Ton audio se lance automatiquement', 'Appuie sur ESPACE dès que chaque verset commence', 'La synchro est sauvegardée pour ta vidéo'].map((t, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(200,167,39,0.15)', border: '1px solid rgba(200,167,39,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#c8a727', fontWeight: 700, flexShrink: 0 }}>{i+1}</div>
                                <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13 }}>{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button onClick={startMarking} style={{ ...optBtn(false), width: '100%', padding: '13px 0', textAlign: 'center' }}>
                          🎯 Calibrer manuellement (optionnel)
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
              <button onClick={() => setStep(1)} style={btnSecondary}>← Retour</button>
              <button onClick={() => setStep(3)}
                style={btnPrimary}
                onMouseEnter={e => e.currentTarget.style.transform='scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                Suivant — Aperçu & Export →
              </button>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            ÉTAPE 3 — Aperçu & Export
        ══════════════════════════════════════ */}
        {step === 3 && (
          <div>
            {/* Step header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#c8a727', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#000', flexShrink: 0 }}>3</div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>Aperçu & Export</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* 2-col grid desktop / 1-col mobile */}
            <div className="studio-step3-grid" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32, alignItems: 'start' }}>

              {/* LEFT — Canvas sticky */}
              <div className="studio-step3-canvas" style={{ position: 'sticky', top: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ background: '#000', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.07)' }}>
                  <canvas ref={canvasRef} width={cw} height={ch} style={{ display: 'block', height: aspect === '16:9' ? 'auto' : '62vh', width: aspect === '16:9' ? 'min(100%,480px)' : 'auto', maxHeight: 620, maxWidth: '100%' }} />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>{aspect} · {cw}×{ch} HD</p>
              </div>

              {/* RIGHT — Controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Summary — 3 compact info rows */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
                  {[
                    { icon: '📖', label: 'Sourate', value: `${surah.fr} · V${ayahNum}${verseCount>1?' → '+Math.min(ayahNum+verseCount-1,maxAyah):''}  (${verseCount} verset${verseCount>1?'s':''})`, color: '#c8a727' },
                    { icon: '🎙', label: 'Audio', value: audioMode === 'auto' ? (RECITERS.find(r=>r.id===reciterId)?.name||reciterId) : (customMp3?.name||'MP3 importé'), color: '#60a5fa' },
                    { icon: '📐', label: 'Format', value: `${aspect} · ${cw}×${ch}`, color: 'rgba(255,255,255,0.6)' },
                    { icon: '🖼', label: 'Fond', value: (BG_PRESETS.find(b=>b.id===bgType)?.label) || (bgType==='video'?'Vidéo importée':bgType==='image'?'Image importée':bgType), color: 'rgba(255,255,255,0.6)' },
                    { icon: '✍️', label: 'Police', value: FONT_OPTIONS.find(f=>f.id===fontId)?.label||fontId, color: 'rgba(255,255,255,0.6)' },
                  ].filter(Boolean).map((row, i, arr) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < arr.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <span style={{ fontSize: 16, width: 22, textAlign: 'center', flexShrink: 0 }}>{row.icon}</span>
                      <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, width: 46, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{row.label}</span>
                      <span style={{ color: row.color, fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* Preview */}
                {!isCreating && (
                  <button onClick={isPlaying ? stopPreview : startPreview} disabled={isPreviewLoading}
                    style={{ background: isPlaying ? 'rgba(200,167,39,0.12)' : 'rgba(255,255,255,0.04)', border: `1.5px solid ${isPlaying ? 'rgba(200,167,39,0.4)' : 'rgba(255,255,255,0.12)'}`, borderRadius: 12, padding: '14px', cursor: isPreviewLoading ? 'wait' : 'pointer', color: isPlaying ? '#c8a727' : 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, fontFamily: 'Plus Jakarta Sans,sans-serif', opacity: isPreviewLoading ? 0.5 : 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span style={{ fontSize: 16 }}>{isPreviewLoading ? '⏳' : isPlaying ? '⏹' : '▶'}</span>
                    {isPreviewLoading ? 'Chargement…' : isPlaying ? 'Arrêter l\'aperçu' : 'Écouter l\'aperçu'}
                  </button>
                )}

                {/* Create video CTA */}
                <div>
                  {!isCreating && !downloadUrl ? (
                    <button onClick={createVideoAuto}
                      style={{ width: '100%', background: 'linear-gradient(135deg,#a8891f,#c8a727)', border: 'none', color: '#fff', padding: '17px', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', letterSpacing: 0.2, boxShadow: '0 6px 28px rgba(200,167,39,0.3)', transition: 'transform 0.15s, box-shadow 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
                      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 10px 36px rgba(200,167,39,0.4)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 6px 28px rgba(200,167,39,0.3)'; }}>
                      <span style={{ fontSize: 18 }}>🎬</span>
                      Générer la vidéo · {verseCount} verset{verseCount>1?'s':''}
                    </button>
                  ) : isCreating ? (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>
                        <span>🎬 Génération en cours…</span>
                        <span style={{ color: '#c8a727', fontWeight: 700 }}>{progress}%</span>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, height: 6, overflow: 'hidden', marginBottom: 10 }}>
                        <div style={{ height: '100%', width: progress+'%', background: 'linear-gradient(90deg,#a8891f,#c4a83a)', borderRadius: 6, transition: 'width 0.4s' }} />
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, textAlign: 'center', margin: 0 }}>{statusMsg}</p>
                    </div>
                  ) : null}

                  {downloadUrl && (
                    isPro ? (
                      <a href={downloadUrl} download={`recitation-${surah.fr}-${ayahNum}-${verseCount}v.${exportFormat}`}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, background: 'linear-gradient(135deg,#22c55e,#16a34a)', border: 'none', color: '#fff', padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700, textAlign: 'center', textDecoration: 'none', fontFamily: 'Plus Jakarta Sans,sans-serif', boxShadow: '0 6px 24px rgba(34,197,94,0.3)' }}>
                        <span>⬇</span> Télécharger ma vidéo (.{exportFormat})
                      </a>
                    ) : !user ? (
                      <button onClick={function(){ setShowGuestGate(true); }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', marginTop: 12, background: 'rgba(200,167,39,0.10)', border: '1.5px solid rgba(200,167,39,0.35)', color: '#c8a727', padding: '14px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
                        👤 Crée ton compte gratuit pour télécharger
                      </button>
                    ) : !freeDlUsed ? (
                      <div style={{ marginTop: 12 }}>
                        <button onClick={triggerFreeDownload}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: 'linear-gradient(135deg,#22c55e,#16a34a)', border: 'none', color: '#fff', padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', boxShadow: '0 6px 24px rgba(34,197,94,0.3)' }}>
                          <span>⬇</span> Télécharger ma vidéo gratuite (.{exportFormat})
                        </button>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, textAlign: 'center', margin: '8px 0 0' }}>1 téléchargement offert · puis Pro pour vidéos illimitées</p>
                      </div>
                    ) : (
                      <div style={{ marginTop: 12 }}>
                        <button onClick={function(){ setShowProGate(true); }}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', background: 'rgba(200,167,39,0.10)', border: '1.5px solid rgba(200,167,39,0.35)', color: '#c8a727', padding: '14px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
                          🔒 Téléchargement gratuit utilisé — passer Pro
                        </button>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, textAlign: 'center', margin: '8px 0 0' }}>Tu as déjà utilisé ton téléchargement offert. Pro = vidéos illimitées.</p>
                      </div>
                    )
                  )}
                  {showProGate && <ProGateModal onClose={function(){ setShowProGate(false); }} navigate={navigate} />}
                  {showGuestGate && <GuestGateModal context="studio" onClose={function(){ setShowGuestGate(false); }} />}
                </div>

                {/* Back */}
                <button onClick={() => setStep(2)} style={{ ...btnSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  ← Modifier l'audio
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════
          CALIBRATION OVERLAY (full-screen)
      ══════════════════════════════════════ */}
      {isMarking && markingTexts.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.96)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {markingTexts.map((_, i) => (
              <div key={i} style={{ width: i < markingIndex ? 24 : 8, height: 8, borderRadius: 4, background: i < markingIndex ? '#c8a727' : i === markingIndex ? 'rgba(200,167,39,0.4)' : 'rgba(255,255,255,0.12)', transition: 'all 0.25s' }} />
            ))}
          </div>

          {markingCountdown !== null ? (
            /* ── COUNTDOWN phase ── */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: markingCountdown === 0 ? 64 : 96, fontWeight: 900, color: markingCountdown === 0 ? '#4ade80' : '#c8a727', lineHeight: 1, transition: 'all 0.2s', fontFamily: 'Plus Jakarta Sans,sans-serif', }}>
                {markingCountdown === 0 ? 'Go !' : markingCountdown}
              </div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14, margin: 0, textAlign: 'center' }}>
                {markingCountdown === 0 ? 'L\'audio démarre…' : 'Prépare-toi à marquer les versets'}
              </p>
            </div>
          ) : (
            /* ── MARKING phase ── */
            <React.Fragment>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 8, textAlign: 'center' }}>
                Écoute l'audio — appuie sur ESPACE dès que tu entends le verset
              </p>
              <p style={{ color: '#c8a727', fontWeight: 700, fontSize: 15, marginBottom: 28, textAlign: 'center' }}>
                Verset {markingIndex} / {markingTexts.length}
              </p>

              {/* Current verse */}
              {markingTexts[markingIndex] && (
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,167,39,0.2)', borderRadius: 16, padding: '24px 28px', maxWidth: 500, width: '100%', textAlign: 'center', marginBottom: 36 }}>
                  <p style={{ fontFamily: '"Amiri", serif', fontSize: 22, color: '#e6c84a', margin: '0 0 10px', direction: 'rtl', lineHeight: 1.7 }}>{markingTexts[markingIndex].ar}</p>
                  {markingTexts[markingIndex].fr && <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 13, margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>{markingTexts[markingIndex].fr.substring(0, 80)}{markingTexts[markingIndex].fr.length > 80 ? '…' : ''}</p>}
                </div>
              )}

              {markingIndex < markingTexts.length ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                  {/* Giant spacebar button */}
                  <button onClick={markNext}
                    style={{ background: 'rgba(200,167,39,0.12)', border: '2px solid rgba(200,167,39,0.5)', borderRadius: 16, padding: '18px 0', width: 260, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', transition: 'all 0.1s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                    onMouseDown={e => e.currentTarget.style.transform='scale(0.96)'}
                    onMouseUp={e => e.currentTarget.style.transform='scale(1)'}
                    onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>Appuie sur</span>
                    <span style={{ fontSize: 22, color: '#c8a727', fontWeight: 900, letterSpacing: 2 }}>ESPACE</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>ou clique ici</span>
                  </button>
                </div>
              ) : (
                <p style={{ color: '#4ade80', fontSize: 15, fontWeight: 700 }}>✅ Tous les versets marqués !</p>
              )}
            </React.Fragment>
          )}

          <button onClick={stopMarkingSession} style={{ marginTop: 24, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '9px 20px', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
            Annuler la calibration
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Legal shared styles ─── */
var LS = {
  h2:  { fontFamily:'Cinzel,serif', fontSize:16, color:'#c8a727', margin:'44px 0 14px', paddingBottom:10, borderBottom:'1px solid rgba(200,167,39,0.18)', letterSpacing:'0.04em' },
  h3:  { fontSize:14, fontWeight:700, color:'rgba(240,237,230,0.9)', margin:'24px 0 8px', fontFamily:'Plus Jakarta Sans,sans-serif' },
  p:   { marginBottom:14, color:'rgba(240,237,230,0.6)', lineHeight:1.9, fontSize:14, fontFamily:'Plus Jakarta Sans,sans-serif' },
  ul:  { paddingLeft:22, marginBottom:16 },
  li:  { marginBottom:8, color:'rgba(240,237,230,0.6)', lineHeight:1.75, fontSize:14, fontFamily:'Plus Jakarta Sans,sans-serif' },
  note:{ background:'rgba(200,167,39,0.07)', border:'1px solid rgba(200,167,39,0.22)', borderRadius:10, padding:'14px 18px', marginBottom:20, fontSize:13, color:'rgba(200,167,39,0.85)', lineHeight:1.75, fontFamily:'Plus Jakarta Sans,sans-serif' },
  tag: { display:'inline-block', background:'rgba(200,167,39,0.1)', border:'1px solid rgba(200,167,39,0.2)', borderRadius:6, padding:'2px 9px', fontSize:12, color:'rgba(200,167,39,0.8)', marginRight:6, fontFamily:'Plus Jakarta Sans,sans-serif' },
};

/* ─── Legal layout wrapper ─── */
function LegalLayout({ navigate, title, children }) {
  React.useEffect(function() { window.scrollTo(0,0); }, []);
  return (
    <div style={{ minHeight:'100vh', background:'#030d06', color:'#f0ede6' }}>
      <Navbar navigate={navigate} />
      <div style={{ maxWidth:780, margin:'0 auto', padding:'120px 24px 80px' }}>
        <button onClick={function(){ navigate('home'); }}
          style={{ background:'none', border:'none', color:'rgba(200,167,39,0.65)', cursor:'pointer', fontSize:14, marginBottom:44, padding:0, display:'flex', alignItems:'center', gap:8, fontFamily:'Plus Jakarta Sans,sans-serif' }}>
          ← Retour à l'accueil
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:6 }}>
          <div style={{ width:3, height:38, background:'linear-gradient(180deg,#c8a727,#a8891f)', borderRadius:2, flexShrink:0 }}/>
          <h1 style={{ fontFamily:'Cinzel,serif', fontSize:'clamp(20px,3.5vw,30px)', color:'#f0ede6', margin:0, lineHeight:1.2 }}>{title}</h1>
        </div>
        <p style={{ color:'rgba(240,237,230,0.28)', fontSize:12, marginBottom:52, marginLeft:17, fontFamily:'Plus Jakarta Sans,sans-serif' }}>Dernière mise à jour : mai 2026</p>
        {children}
      </div>
    </div>
  );
}

/* ─── Payment Success Page ─── */
function PaymentSuccessPage({ navigate }) {
  const { user, isPro } = useAuth();
  const [tick, setTick] = React.useState(0);
  const [proConfirmed, setProConfirmed] = React.useState(false);
  const [checkDot, setCheckDot] = React.useState(0);

  // Option A — nouvel utilisateur non-connecté
  const [prefillEmail, setPrefillEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [setupLoading, setSetupLoading] = React.useState(false);
  const [setupError, setSetupError] = React.useState('');
  const [resetSent, setResetSent] = React.useState(false);

  // Récupérer l'email depuis le session_id Stripe
  React.useEffect(function() {
    if (user) return;
    var psid = new URLSearchParams(window.location.search).get('psid');
    if (!psid) return;
    fetch('/api/session-email?sid=' + psid)
      .then(function(r){ return r.json(); })
      .then(function(d){ if (d.email) setPrefillEmail(d.email); })
      .catch(function(){});
  }, []);

  // Pulse animation tick
  React.useEffect(function () {
    var t = setInterval(function () { setTick(function (n) { return n + 1; }); }, 40);
    return function () { clearInterval(t); };
  }, []);

  // Confirm Pro from Firestore — poll until isPro true (max 30s)
  React.useEffect(function () {
    if (isPro) { setProConfirmed(true); return; }
    if (!user || !window._db) return;
    var attempts = 0;
    var maxAttempts = 15;
    var interval = setInterval(function () {
      attempts++;
      window._db.collection('users').doc(user.uid).get().then(function (doc) {
        if (doc.exists && doc.data().isPro === true) {
          setProConfirmed(true);
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          setProConfirmed(true);
          clearInterval(interval);
        }
      }).catch(function () {
        if (attempts >= maxAttempts) { setProConfirmed(true); clearInterval(interval); }
      });
    }, 2000);
    return function () { clearInterval(interval); };
  }, [user, isPro]);

  // Animated dots while waiting
  React.useEffect(function () {
    if (proConfirmed) return;
    var t = setInterval(function () { setCheckDot(function (n) { return (n + 1) % 4; }); }, 500);
    return function () { clearInterval(t); };
  }, [proConfirmed]);

  async function handleSetupAccount(e) {
    e.preventDefault();
    if (!prefillEmail || !password) return;
    setSetupLoading(true);
    setSetupError('');
    try {
      // Essayer connexion d'abord (compte existant)
      await window._auth.signInWithEmailAndPassword(prefillEmail, password);
      // Connecté → isPro arrivera via Firestore polling
    } catch(loginErr) {
      var noAccount = loginErr.code === 'auth/user-not-found' || loginErr.code === 'auth/invalid-credential';
      var wrongPwd = loginErr.code === 'auth/wrong-password' || loginErr.code === 'auth/invalid-login-credentials';
      if (noAccount) {
        // Nouveau compte → créer
        try {
          await window._auth.createUserWithEmailAndPassword(prefillEmail, password);
        } catch(createErr) {
          if (createErr.code === 'auth/email-already-in-use') {
            // Compte créé par webhook sans mot de passe → reset
            try { await window._auth.sendPasswordResetEmail(prefillEmail); setResetSent(true); }
            catch(e3) { setSetupError('Erreur : ' + e3.message); }
          } else {
            setSetupError(createErr.message);
          }
        }
      } else if (wrongPwd) {
        setSetupError('Mot de passe incorrect. Utilise ton mot de passe habituel ou réinitialise-le ci-dessous.');
      } else {
        setSetupError(loginErr.message);
      }
    }
    setSetupLoading(false);
  }

  async function handleResetPassword() {
    if (!prefillEmail) { setSetupError('Entre ton email d\'abord.'); return; }
    try {
      await window._auth.sendPasswordResetEmail(prefillEmail);
      setResetSent(true);
    } catch(e) { setSetupError('Erreur : ' + e.message); }
  }

  var ring = 'conic-gradient(#c8a727 ' + Math.min(360, tick * 6) + 'deg, rgba(255,255,255,0.06) 0deg)';

  var perks = [
    { icon: '🎵', label: 'Blind Test — tous les niveaux' },
    { icon: '🧠', label: 'Quiz — Amateur & Avancé débloqués' },
    { icon: '🎬', label: 'Studio Vidéo — export HD illimité' },
    { icon: '⚡', label: 'Nouvelles fonctionnalités en avant-première' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#050e08 0%,#040a06 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'Plus Jakarta Sans, sans-serif', position: 'relative', overflow: 'hidden' }}>

      {/* Background glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,167,39,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Spinning ring + check */}
      <div style={{ position: 'relative', marginBottom: 36 }}>
        <div style={{ width: 120, height: 120, borderRadius: '50%', background: ring, padding: 4, boxSizing: 'border-box' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#050e08', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="25" stroke="rgba(200,167,39,0.3)" strokeWidth="1.5" fill="rgba(200,167,39,0.08)" />
              <path d="M14 27L22 35L38 18" stroke="#c8a727" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="38" strokeDashoffset={Math.max(0, 38 - tick * 1.2)} />
            </svg>
          </div>
        </div>
        {[[-44,-18],[44,-10],[-28,52],[38,48],[0,-50]].map(function([x,y],i){
          return <div key={i} style={{ position:'absolute', top:'50%', left:'50%', transform:`translate(${x}px,${y}px)`, fontSize: 14 + (i%2)*4, opacity: tick > 20 ? 1 : 0, transition: 'opacity 0.4s' }}>✦</div>;
        })}
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 3, color: '#c8a727', textTransform: 'uppercase', marginBottom: 12 }}>Paiement confirmé</div>
        <h1 style={{ fontSize: 'clamp(28px,6vw,42px)', fontWeight: 900, color: '#fff', margin: '0 0 14px', lineHeight: 1.15 }}>
          Bienvenue dans<br /><span style={{ color: '#c8a727' }}>Héritage Pro 🌙</span>
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
          Ton abonnement Pro est actif. Toutes les fonctionnalités sont débloquées.
        </p>
      </div>

      {/* Perks */}
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,167,39,0.18)', borderRadius: 20, padding: '24px 28px', maxWidth: 380, width: '100%', marginTop: 24, marginBottom: 28 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(200,167,39,0.7)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>Accès débloqué</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {perks.map(function(p, i) {
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(200,167,39,0.1)', border: '1px solid rgba(200,167,39,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{p.icon}</div>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.82)' }}>{p.label}</span>
                <span style={{ marginLeft: 'auto', fontSize: 13, color: '#4ade80' }}>✓</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Option A — Nouveau compte si non connecté */}
      {!user && !resetSent && (
        <div style={{ background: 'rgba(200,167,39,0.06)', border: '1px solid rgba(200,167,39,0.25)', borderRadius: 18, padding: '24px 24px', maxWidth: 380, width: '100%', marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#c8a727', marginBottom: 6 }}>🔑 Accède à ton espace Pro</div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 16, lineHeight: 1.5 }}>
            Entre l'email utilisé lors du paiement et ton mot de passe. Pas encore de compte ? Il sera créé automatiquement.
          </p>
          <form onSubmit={handleSetupAccount} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input type="email" value={prefillEmail} onChange={function(e){ setPrefillEmail(e.target.value); }} placeholder="Email utilisé lors du paiement"
              required style={{ padding: '11px 14px', borderRadius: 10, border: '1px solid rgba(200,167,39,0.3)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, fontFamily: 'Plus Jakarta Sans,sans-serif', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
            <input type="password" value={password} onChange={function(e){ setPassword(e.target.value); }} placeholder="Ton mot de passe (6 car. min.)"
              required minLength="6" style={{ padding: '11px 14px', borderRadius: 10, border: '1px solid rgba(200,167,39,0.3)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: 14, fontFamily: 'Plus Jakarta Sans,sans-serif', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
            {setupError && (
              <div>
                <p style={{ color: '#f87171', fontSize: 12, margin: '0 0 4px' }}>{setupError}</p>
                <button type="button" onClick={handleResetPassword}
                  style={{ background: 'none', border: 'none', color: 'rgba(200,167,39,0.7)', fontSize: 12, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', textDecoration: 'underline', padding: 0 }}>
                  Réinitialiser mon mot de passe →
                </button>
              </div>
            )}
            <button type="submit" disabled={setupLoading}
              style={{ background: 'linear-gradient(135deg,#c8a727,#a8891f)', border: 'none', color: '#0a1a08', padding: '13px', borderRadius: 10, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
              {setupLoading ? 'Connexion...' : 'Accéder à mon espace Pro →'}
            </button>
          </form>
        </div>
      )}

      {/* Email reset envoyé */}
      {resetSent && (
        <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 14, padding: '18px 20px', maxWidth: 380, width: '100%', marginBottom: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>📬</div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
            Un email a été envoyé à <strong style={{ color: '#c8a727' }}>{prefillEmail}</strong> pour créer ton mot de passe. Vérifie ta boîte mail puis reviens te connecter.
          </p>
        </div>
      )}

      {/* CTA — si connecté */}
      {user && (!proConfirmed ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, border: '3px solid rgba(200,167,39,0.25)', borderTopColor: '#c8a727', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {'Activation en cours' + '.'.repeat(checkDot)}
          </p>
        </div>
      ) : (
        <button onClick={function(){ navigate('home'); }} style={{ background: 'linear-gradient(135deg,#a8891f,#c4a83a)', border: 'none', color: '#1c1200', padding: '16px 40px', borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', boxShadow: '0 8px 32px rgba(200,167,39,0.35)', transition: 'all 0.2s' }}
          onMouseEnter={function(e){ e.currentTarget.style.transform='translateY(-2px)'; }}
          onMouseLeave={function(e){ e.currentTarget.style.transform='translateY(0)'; }}>
          Découvrir mes fonctionnalités →
        </button>
      ))}

      {/* Lien accueil si non connecté */}
      {!user && (
        <button onClick={function(){ navigate('home'); }} style={{ marginTop: 12, background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', fontSize: 12, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', textDecoration: 'underline' }}>
          Retour à l'accueil
        </button>
      )}

      <p style={{ marginTop: 16, fontSize: 11, color: 'rgba(255,255,255,0.18)', textAlign: 'center', maxWidth: 320 }}>
        Un reçu Stripe a été envoyé à ton adresse e-mail. Gestion de l'abonnement dans ton profil.
      </p>
    </div>
  );
}

/* ─── Mentions légales ─── */
function MentionsLegalesPage({ navigate }) {
  return (
    <LegalLayout navigate={navigate} title="Mentions légales">
      <h2 style={LS.h2}>1. Éditeur du site</h2>
      <p style={LS.p}>Le site <strong>heritage-musulman.fr</strong> est édité par :</p>
      <ul style={LS.ul}>
        <li style={LS.li}><strong>Nom :</strong> Ayoub Rachidi</li>
        <li style={LS.li}><strong>Forme juridique :</strong> Entrepreneur individuel</li>
        <li style={LS.li}><strong>SIREN :</strong> 104 818 786</li>
        <li style={LS.li}><strong>SIRET :</strong> 104 818 786 00001</li>
        <li style={LS.li}><strong>Code APE :</strong> 62.01Z (Programmation informatique)</li>
        <li style={LS.li}><strong>Immatriculation RNE :</strong> 11 mai 2026</li>
        <li style={LS.li}><strong>Adresse :</strong> 25 Quai Maréchal de Lattre de Tassigny, 34200 Sète, France</li>
        <li style={LS.li}><strong>Email :</strong> contact.heritagemusulman@gmail.com</li>
      </ul>

      <h2 style={LS.h2}>2. Directeur de la publication</h2>
      <p style={LS.p}>Ayoub Rachidi, en qualité d'éditeur du site.</p>

      <h2 style={LS.h2}>3. Hébergement</h2>
      <p style={LS.p}>Le site est hébergé par :</p>
      <ul style={LS.ul}>
        <li style={LS.li}><strong>Société :</strong> Vercel Inc.</li>
        <li style={LS.li}><strong>Adresse :</strong> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</li>
        <li style={LS.li}><strong>Site :</strong> www.vercel.com</li>
      </ul>

      <h2 style={LS.h2}>4. Propriété intellectuelle</h2>
      <p style={LS.p}>
        L'ensemble des contenus présents sur ce site (textes, quiz, interface, vidéos générées, code source, logo) est protégé par le droit d'auteur et constitue la propriété exclusive de l'éditeur, sauf mention contraire.
      </p>
      <p style={LS.p}>
        Les versets coraniques proviennent de l'API Al-Quran Cloud (api.alquran.cloud), source ouverte et libre d'accès. Toute reproduction ou exploitation commerciale du contenu éditorial sans autorisation préalable écrite est interdite.
      </p>

      <h2 style={LS.h2}>5. Limitation de responsabilité</h2>
      <p style={LS.p}>
        L'éditeur s'efforce d'assurer l'exactitude des informations publiées mais ne saurait garantir leur exhaustivité. Il ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation du site, d'une interruption de service ou d'une erreur de contenu.
      </p>

      <h2 style={LS.h2}>6. Liens hypertextes</h2>
      <p style={LS.p}>
        Le site peut contenir des liens vers des sites tiers. L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
      </p>

      <h2 style={LS.h2}>7. Droit applicable</h2>
      <p style={LS.p}>
        Les présentes mentions légales sont soumises au droit français. Tout litige relatif à leur interprétation sera de la compétence exclusive des tribunaux français.
      </p>
    </LegalLayout>
  );
}

/* ─── CGU ─── */
function CguPage({ navigate }) {
  return (
    <LegalLayout navigate={navigate} title="Conditions Générales d'Utilisation">

      <h2 style={LS.h2}>Article 1 — Objet et acceptation</h2>
      <p style={LS.p}>
        Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du site <strong>heritage-musulman.fr</strong> et de l'ensemble de ses services. En créant un compte ou en utilisant le site, l'utilisateur accepte sans réserve les présentes CGU.
      </p>

      <h2 style={LS.h2}>Article 2 — Description du service</h2>
      <p style={LS.p}>Héritage Musulman est une plateforme d'apprentissage islamique francophone proposant :</p>
      <ul style={LS.ul}>
        <li style={LS.li}><span style={LS.tag}>Gratuit</span> Blind Test Coran — aperçu limité</li>
        <li style={LS.li}><span style={LS.tag}>Gratuit</span> Quiz islamiques — aperçu limité</li>
        <li style={LS.li}><span style={LS.tag}>Pro</span> Accès illimité à l'ensemble des contenus</li>
        <li style={LS.li}><span style={LS.tag}>Pro</span> Studio Vidéo — création de contenus islamiques</li>
      </ul>

      <h2 style={LS.h2}>Article 3 — Inscription et compte utilisateur</h2>
      <p style={LS.p}>
        La création d'un compte nécessite la fourniture d'une adresse email valide. L'utilisateur est seul responsable de la confidentialité de ses identifiants et de toutes les actions effectuées depuis son compte. Toute utilisation frauduleuse devra être signalée immédiatement à contact.heritagemusulman@gmail.com.
      </p>
      <p style={LS.p}>
        L'éditeur se réserve le droit de refuser l'inscription ou de supprimer un compte ne respectant pas les présentes CGU.
      </p>

      <h2 style={LS.h2}>Article 4 — Abonnement Pro et facturation</h2>
      <ul style={LS.ul}>
        <li style={LS.li}><strong>Tarif :</strong> 7,99 € TTC par mois</li>
        <li style={LS.li}><strong>Facturation :</strong> mensuelle, automatique à la date anniversaire d'inscription</li>
        <li style={LS.li}><strong>Paiement :</strong> sécurisé via Stripe (carte bancaire)</li>
        <li style={LS.li}><strong>Résiliation :</strong> possible à tout moment depuis le profil utilisateur, sans frais. L'accès Pro reste actif jusqu'à la fin de la période en cours.</li>
      </ul>

      <h2 style={LS.h2}>Article 5 — Droit de rétractation</h2>
      <p style={LS.p}>
        Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation de 14 jours <strong>ne s'applique pas</strong> aux contenus numériques dont l'exécution a commencé avec l'accord exprès du consommateur avant l'expiration du délai de rétractation et après renoncement exprès à son droit. Cet accord et cette renonciation sont recueillis lors de la souscription à l'abonnement Pro.
      </p>

      <h2 style={LS.h2}>Article 6 — Obligations de l'utilisateur</h2>
      <p style={LS.p}>L'utilisateur s'engage à :</p>
      <ul style={LS.ul}>
        <li style={LS.li}>Ne pas partager ses identifiants ou son accès avec des tiers</li>
        <li style={LS.li}>Ne pas extraire, copier ou redistribuer le contenu de la plateforme</li>
        <li style={LS.li}>Ne pas utiliser le service à des fins illicites, frauduleuses ou contraires à l'ordre public</li>
        <li style={LS.li}>Ne pas tenter de contourner les restrictions d'accès (compte Free vs Pro)</li>
        <li style={LS.li}>Fournir des informations exactes lors de l'inscription</li>
      </ul>

      <h2 style={LS.h2}>Article 7 — Propriété intellectuelle</h2>
      <p style={LS.p}>
        L'ensemble des contenus du site (quiz, interface, code, vidéos, textes éditoriaux) est la propriété exclusive de l'éditeur et protégé par le droit d'auteur français. Toute reproduction, même partielle, sans autorisation écrite préalable est interdite et constitue une contrefaçon.
      </p>
      <p style={LS.p}>
        Les versets coraniques utilisés proviennent de sources libres de droits (API Al-Quran Cloud).
      </p>

      <h2 style={LS.h2}>Article 8 — Suspension et résiliation du compte</h2>
      <p style={LS.p}>
        L'éditeur se réserve le droit de suspendre ou supprimer, sans préavis ni remboursement, tout compte ayant violé les présentes CGU. L'utilisateur peut supprimer son propre compte à tout moment depuis son profil.
      </p>

      <h2 style={LS.h2}>Article 9 — Limitation de responsabilité</h2>
      <p style={LS.p}>
        L'éditeur ne saurait être tenu responsable des interruptions de service, pertes de données, erreurs de contenu ou dommages indirects résultant de l'utilisation de la plateforme. La disponibilité du service est assurée dans la mesure du possible mais non garantie à 100 %.
      </p>

      <h2 style={LS.h2}>Article 10 — Modification des CGU</h2>
      <p style={LS.p}>
        L'éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés par email de toute modification substantielle. La poursuite de l'utilisation du service après notification vaut acceptation des nouvelles CGU.
      </p>

      <h2 style={LS.h2}>Article 11 — Droit applicable et juridiction</h2>
      <p style={LS.p}>
        Les présentes CGU sont soumises au droit français. En cas de litige, et après tentative de résolution amiable, les tribunaux français seront seuls compétents.
      </p>
    </LegalLayout>
  );
}

/* ─── Politique de confidentialité ─── */
function PolitiqueConfidentialitePage({ navigate }) {
  var tableStyle = { width:'100%', borderCollapse:'collapse', marginBottom:20, fontSize:13, fontFamily:'Plus Jakarta Sans,sans-serif' };
  var thStyle    = { background:'rgba(200,167,39,0.1)', color:'rgba(200,167,39,0.85)', padding:'10px 14px', textAlign:'left', borderBottom:'1px solid rgba(200,167,39,0.2)', fontWeight:700 };
  var tdStyle    = { padding:'10px 14px', color:'rgba(240,237,230,0.6)', borderBottom:'1px solid rgba(255,255,255,0.05)', verticalAlign:'top', lineHeight:1.6 };

  return (
    <LegalLayout navigate={navigate} title="Politique de confidentialité">

      <p style={LS.p}>
        La protection de vos données personnelles est une priorité. Cette politique décrit comment <strong>Héritage Musulman</strong> collecte, utilise et protège vos données, conformément au Règlement Général sur la Protection des Données (RGPD — UE 2016/679) et à la loi Informatique et Libertés.
      </p>

      <h2 style={LS.h2}>1. Responsable du traitement</h2>
      <ul style={LS.ul}>
        <li style={LS.li}><strong>Identité :</strong> Ayoub Rachidi — Entrepreneur individuel</li>
        <li style={LS.li}><strong>SIREN :</strong> 104 818 786</li>
        <li style={LS.li}><strong>Email :</strong> contact.heritagemusulman@gmail.com</li>
      </ul>

      <h2 style={LS.h2}>2. Données collectées</h2>
      <p style={LS.p}>Nous collectons uniquement les données strictement nécessaires au fonctionnement du service :</p>
      <ul style={LS.ul}>
        <li style={LS.li}><strong>Compte :</strong> adresse email, identifiant unique (UID généré par Firebase)</li>
        <li style={LS.li}><strong>Paiement :</strong> géré intégralement par Stripe — nous ne stockons aucune donnée bancaire</li>
        <li style={LS.li}><strong>Utilisation :</strong> scores et progression (stockés localement dans votre navigateur)</li>
      </ul>
      <p style={LS.p}>
        Nous ne collectons <strong>pas</strong> : numéro de téléphone, date de naissance, données de localisation, données sensibles (origine ethnique, convictions religieuses).
      </p>

      <h2 style={LS.h2}>3. Finalités et bases légales du traitement</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Donnée</th>
            <th style={thStyle}>Finalité</th>
            <th style={thStyle}>Base légale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>Adresse email</td>
            <td style={tdStyle}>Authentification, envois transactionnels</td>
            <td style={tdStyle}>Exécution du contrat</td>
          </tr>
          <tr>
            <td style={tdStyle}>UID Firebase</td>
            <td style={tdStyle}>Gestion et sécurité du compte</td>
            <td style={tdStyle}>Exécution du contrat</td>
          </tr>
          <tr>
            <td style={tdStyle}>Données de paiement</td>
            <td style={tdStyle}>Facturation abonnement Pro</td>
            <td style={tdStyle}>Exécution du contrat + obligation légale</td>
          </tr>
        </tbody>
      </table>

      <h2 style={LS.h2}>4. Durée de conservation</h2>
      <ul style={LS.ul}>
        <li style={LS.li}><strong>Données de compte :</strong> durée de vie du compte + 3 ans après suppression</li>
        <li style={LS.li}><strong>Données de paiement (Stripe) :</strong> 5 ans (obligation comptable française)</li>
        <li style={LS.li}><strong>Emails transactionnels :</strong> 1 an</li>
      </ul>

      <h2 style={LS.h2}>5. Sous-traitants et destinataires</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Sous-traitant</th>
            <th style={thStyle}>Rôle</th>
            <th style={thStyle}>Localisation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyle}>Google Firebase</td>
            <td style={tdStyle}>Authentification, base de données</td>
            <td style={tdStyle}>États-Unis / UE</td>
          </tr>
          <tr>
            <td style={tdStyle}>Stripe</td>
            <td style={tdStyle}>Traitement des paiements</td>
            <td style={tdStyle}>États-Unis / UE</td>
          </tr>
          <tr>
            <td style={tdStyle}>Vercel Inc.</td>
            <td style={tdStyle}>Hébergement du site</td>
            <td style={tdStyle}>États-Unis (transfers CCT)</td>
          </tr>
          <tr>
            <td style={tdStyle}>EmailJS</td>
            <td style={tdStyle}>Envoi d'emails transactionnels</td>
            <td style={tdStyle}>États-Unis</td>
          </tr>
        </tbody>
      </table>

      <h2 style={LS.h2}>6. Transferts hors Union Européenne</h2>
      <p style={LS.p}>
        Google Firebase, Stripe et EmailJS sont établis aux États-Unis. Ces transferts sont encadrés par les <strong>Clauses Contractuelles Types (CCT)</strong> approuvées par la Commission européenne, garantissant un niveau de protection adéquat de vos données.
      </p>

      <h2 style={LS.h2}>7. Vos droits (RGPD)</h2>
      <p style={LS.p}>Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :</p>
      <ul style={LS.ul}>
        <li style={LS.li}><strong>Accès</strong> — obtenir une copie de vos données personnelles</li>
        <li style={LS.li}><strong>Rectification</strong> — corriger des données inexactes</li>
        <li style={LS.li}><strong>Effacement</strong> — demander la suppression de vos données (« droit à l'oubli »)</li>
        <li style={LS.li}><strong>Limitation</strong> — restreindre le traitement dans certains cas</li>
        <li style={LS.li}><strong>Portabilité</strong> — recevoir vos données dans un format structuré</li>
        <li style={LS.li}><strong>Opposition</strong> — vous opposer à un traitement basé sur l'intérêt légitime</li>
      </ul>
      <p style={LS.p}>
        Pour exercer ces droits : <strong>contact.heritagemusulman@gmail.com</strong>. Réponse garantie sous 30 jours. Une pièce d'identité pourra être demandée.
      </p>

      <h2 style={LS.h2}>8. Sécurité</h2>
      <p style={LS.p}>
        Vos données sont protégées par les mécanismes de sécurité de Google Firebase (chiffrement TLS en transit, chiffrement au repos). L'accès aux données est restreint au strict nécessaire.
      </p>

      <h2 style={LS.h2}>9. Cookies</h2>
      <p style={LS.p}>Le site utilise uniquement des cookies <strong>strictement nécessaires</strong> au fonctionnement :</p>
      <ul style={LS.ul}>
        <li style={LS.li}><strong>Firebase Auth</strong> — maintien de la session utilisateur (localStorage)</li>
      </ul>
      <p style={LS.p}>
        Aucun cookie publicitaire, de tracking ou d'analyse tiers n'est utilisé. Aucun bandeau de consentement n'est requis pour les cookies strictement nécessaires (art. 82 loi Informatique et Libertés).
      </p>

      <h2 style={LS.h2}>10. Réclamations</h2>
      <p style={LS.p}>
        Si vous estimez que le traitement de vos données ne respecte pas la réglementation, vous pouvez introduire une réclamation auprès de la <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color:'#c8a727' }}>www.cnil.fr</a>
      </p>

      <h2 style={LS.h2}>11. Modifications</h2>
      <p style={LS.p}>
        Cette politique peut être mise à jour. En cas de modification substantielle, vous serez informé par email. La version en vigueur est celle affichée sur cette page avec sa date de mise à jour.
      </p>
    </LegalLayout>
  );
}

/* ─── CGV Page ─── */
function CGVPage({ navigate }) {
  return (
    <LegalLayout navigate={navigate} title="Conditions Générales de Vente">
      <p style={LS.p}>Dernière mise à jour : mai 2026. Les présentes CGV régissent l'achat de l'abonnement Héritage Pro sur <strong>heritage-musulman.com</strong>.</p>

      <h2 style={LS.h2}>1. Vendeur</h2>
      <ul style={LS.ul}>
        <li style={LS.li}><strong>Nom :</strong> Ayoub Rachidi</li>
        <li style={LS.li}><strong>Forme juridique :</strong> Entrepreneur individuel</li>
        <li style={LS.li}><strong>SIREN :</strong> 104 818 786</li>
        <li style={LS.li}><strong>SIRET :</strong> 104 818 786 00001</li>
        <li style={LS.li}><strong>Code APE :</strong> 62.01Z</li>
        <li style={LS.li}><strong>Adresse :</strong> 25 Quai Maréchal de Lattre de Tassigny, 34200 Sète, France</li>
        <li style={LS.li}><strong>Email :</strong> contact.heritagemusulman@gmail.com</li>
      </ul>

      <h2 style={LS.h2}>2. Produit et prix</h2>
      <p style={LS.p}>L'abonnement <strong>Héritage Pro</strong> donne accès à l'intégralité des fonctionnalités de la plateforme (tous niveaux de quiz, blind test illimité, studio vidéo HD).</p>
      <ul style={LS.ul}>
        <li style={LS.li}><strong>Prix :</strong> 7,99 € TTC / mois</li>
        <li style={LS.li}><strong>Facturation :</strong> mensuelle, reconduite automatiquement</li>
        <li style={LS.li}><strong>Paiement :</strong> carte bancaire via Stripe (sécurisé, certifié PCI DSS)</li>
        <li style={LS.li}><strong>TVA :</strong> non applicable — entrepreneur individuel (art. 293 B CGI)</li>
      </ul>

      <h2 style={LS.h2}>3. Accès au service</h2>
      <p style={LS.p}>L'accès Pro est activé immédiatement après confirmation du paiement par Stripe. Il est lié à votre compte et non transférable.</p>

      <h2 style={LS.h2}>4. Rétractation</h2>
      <p style={LS.p}>Conformément à l'article L.221-28 du Code de la consommation, <strong>le droit de rétractation de 14 jours ne s'applique pas</strong> aux contenus numériques fournis immédiatement après confirmation de paiement, avec votre accord exprès.</p>
      <p style={LS.p}>Toutefois, si vous n'avez pas encore accédé au service, vous pouvez demander un remboursement dans les 48h à : <strong>contact.heritagemusulman@gmail.com</strong>.</p>

      <h2 style={LS.h2}>5. Résiliation</h2>
      <p style={LS.p}>Vous pouvez résilier votre abonnement à tout moment depuis votre espace <strong>Profil</strong> sur le site. La résiliation prend effet à la fin de la période de facturation en cours — vous conservez l'accès Pro jusqu'à cette date. Aucun remboursement partiel n'est effectué.</p>

      <h2 style={LS.h2}>6. Renouvellement et résiliation par le vendeur</h2>
      <p style={LS.p}>L'abonnement est renouvelé automatiquement chaque mois. Vous serez notifié par email en cas d'échec de paiement. Le vendeur se réserve le droit de suspendre un compte en cas de violation des présentes CGV ou d'utilisation abusive de la plateforme.</p>

      <h2 style={LS.h2}>7. Responsabilité</h2>
      <p style={LS.p}>La plateforme est fournie « en l'état ». Le vendeur s'engage à maintenir un niveau de disponibilité raisonnable mais ne peut garantir un accès ininterrompu. En cas d'interruption prolongée (plus de 72h), un avoir pourra être accordé sur demande.</p>

      <h2 style={LS.h2}>8. Litiges</h2>
      <p style={LS.p}>En cas de litige, une solution amiable sera recherchée en priorité via <strong>contact.heritagemusulman@gmail.com</strong>. À défaut, les tribunaux français seront compétents, le droit français applicable. Vous pouvez également recourir à la médiation via la plateforme européenne : <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={{ color:'#c8a727' }}>ec.europa.eu/consumers/odr</a>.</p>
    </LegalLayout>
  );
}

/* ─── Bannière RGPD ─── */
function RgpdBanner({ onAccept, onDecline }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(function() {
    var consent = localStorage.getItem('hm_cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  if (!visible) return null;

  function accept() {
    localStorage.setItem('hm_cookie_consent', 'accepted');
    setVisible(false);
    if (onAccept) onAccept();
  }
  function decline() {
    localStorage.setItem('hm_cookie_consent', 'declined');
    setVisible(false);
    if (onDecline) onDecline();
  }

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99998,
      background: 'rgba(3,12,7,0.97)', backdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(200,167,39,0.2)',
      padding: '16px 24px',
      display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
      boxShadow: '0 -4px 32px rgba(0,0,0,0.5)',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
    }}>
      <div style={{ flex: 1, minWidth: 240 }}>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
          🍪 Nous utilisons des cookies strictement nécessaires au fonctionnement du site (session, paiement).
          {' '}<span style={{ color: 'rgba(255,255,255,0.45)' }}>Aucun cookie publicitaire sans votre accord.</span>
        </p>
      </div>
      <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
        <button onClick={decline} style={{
          background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
          color: 'rgba(255,255,255,0.55)', padding: '8px 18px', borderRadius: 8,
          fontSize: 13, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.4)'}
        onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.2)'}>
          Refuser
        </button>
        <button onClick={accept} style={{
          background: 'linear-gradient(135deg,#c8a727,#e6c84a)',
          border: 'none', color: '#1c1200', padding: '8px 22px', borderRadius: 8,
          fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
          boxShadow: '0 2px 12px rgba(200,167,39,0.35)', transition: 'all 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.transform='translateY(-1px)'}
        onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
          Accepter
        </button>
      </div>
    </div>
  );
}

/* ─── 404 Page ─── */
function NotFoundPage({ navigate }) {
  return (
    <div style={{ minHeight: '100vh', background: '#030d06', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Plus Jakarta Sans, sans-serif', textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.4 }}>🕌</div>
      <div style={{ fontFamily: 'Cinzel, serif', fontSize: 'clamp(60px,12vw,120px)', fontWeight: 700, color: 'rgba(200,167,39,0.2)', lineHeight: 1, marginBottom: 8 }}>404</div>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 200, fontStyle: 'italic', fontSize: 'clamp(24px,4vw,40px)', color: '#fff', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
        Cette page n'existe pas
      </h1>
      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', maxWidth: 360, lineHeight: 1.7, margin: '0 0 36px' }}>
        La page que tu cherches a peut-être été déplacée ou n'existe plus. Retourne à l'accueil.
      </p>
      <button onClick={() => navigate('home')} style={{ background: 'linear-gradient(135deg,#c8a727,#a8891f)', border: 'none', color: '#fff', padding: '14px 36px', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 20px rgba(200,167,39,0.3)', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 28px rgba(200,167,39,0.45)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(200,167,39,0.3)'; }}>
        ← Retour à l'accueil
      </button>
    </div>
  );
}

/* ─── Post Activity Popup (affiché une seule fois après une activité gratuite) ─── */
function ExitIntentPopup({ navigate }) {
  const { user, openAuth, isPro, openQuickCheckout } = useAuth();
  const [show, setShow] = React.useState(false);
  const STORAGE_KEY = 'heritage_pro_popup_shown';

  React.useEffect(function() {
    if (isPro) return;
    function onActivity() {
      if (localStorage.getItem(STORAGE_KEY)) return;
      setTimeout(function() {
        if (!localStorage.getItem(STORAGE_KEY)) setShow(true);
      }, 5000);
    }
    window.addEventListener('heritage:pro-popup', onActivity);
    return function() { window.removeEventListener('heritage:pro-popup', onActivity); };
  }, [isPro]);

  function close() {
    localStorage.setItem(STORAGE_KEY, '1');
    setShow(false);
  }

  if (!show || isPro) return null;

  return (
    <div onClick={function(e){ if(e.target===e.currentTarget) close(); }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.82)', backdropFilter:'blur(8px)', zIndex:10001, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div className="pro-popup-inner" style={{ background:'linear-gradient(160deg,rgba(15,35,18,0.98),rgba(8,20,10,0.98))', border:'1px solid rgba(200,167,39,0.3)', borderRadius:24, padding:'40px 32px', maxWidth:420, width:'100%', textAlign:'center', boxShadow:'0 40px 80px rgba(0,0,0,0.7)', position:'relative' }}>
        <button onClick={close} style={{ position:'absolute', top:14, right:16, background:'none', border:'none', color:'rgba(255,255,255,0.3)', fontSize:20, cursor:'pointer', lineHeight:1 }}>✕</button>
        <div style={{ fontSize:44, marginBottom:16 }}>🕌</div>
        <h2 style={{ fontFamily:'Playfair Display,serif', fontWeight:900, fontSize:24, color:'#fff', marginBottom:10, lineHeight:1.2 }}>
          Tu as vu l'aperçu gratuit.
        </h2>
        <p style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.7, marginBottom:8 }}>
          Les niveaux <strong style={{color:'#fff'}}>Amateur & Avancé</strong>, le Blind Test complet et le Studio vidéo t'attendent. La plateforme islamique <strong style={{color:'#fff'}}>100% en français</strong> la plus complète.
        </p>
        <div style={{ marginBottom:20 }}>
          {(window.HM_FOUNDER && window.HM_FOUNDER()) ? (
            <OfferPrice big={34} />
          ) : (
            <>
              <span style={{ fontFamily:'Playfair Display,serif', fontSize:26, fontWeight:900, color:'#c8a727' }}>7,99€/mois</span>
              <div style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:11, color:'rgba(200,167,39,0.6)', marginTop:2 }}>offre de lancement — sans engagement</div>
            </>
          )}
        </div>
        <button onClick={function(){ close(); openQuickCheckout(); }}
          style={{ width:'100%', background:'linear-gradient(135deg,#c8a727,#a8891f)', border:'none', color:'#0a1a08', padding:'15px', borderRadius:12, fontSize:15, fontWeight:800, cursor:'pointer', fontFamily:'Plus Jakarta Sans,sans-serif', boxShadow:'0 4px 20px rgba(200,167,39,0.4)', marginBottom:10 }}>
          🔓 Débloquer l'accès complet
        </button>
        <div style={{ background:'rgba(74,222,128,0.08)', border:'1px solid rgba(74,222,128,0.22)', borderRadius:10, padding:'7px 12px', margin:'8px 0 10px', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <span style={{ color:'#4ade80', fontSize:13, flexShrink:0 }}>✓</span>
          <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.70)' }}>Sans engagement — annule quand tu veux en 1 clic</span>
        </div>
        <button onClick={close}
          style={{ background:'none', border:'none', color:'rgba(255,255,255,0.2)', fontSize:12, cursor:'pointer', fontFamily:'Plus Jakarta Sans,sans-serif', textDecoration:'underline' }}>
          Pas maintenant
        </button>
      </div>
    </div>
  );
}

/* ─── Sticky Upgrade Banner (non-Pro logged-in users) ─── */
function StickyUpgradeBanner({ navigate }) {
  const { user, isPro, openQuickCheckout } = useAuth();
  const [visible, setVisible] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(function() {
    if (isPro || !user || dismissed) return;
    var onScroll = function() {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll);
    return function() { window.removeEventListener('scroll', onScroll); };
  }, [isPro, user, dismissed]);

  if (!user || isPro || dismissed || !visible) return null;

  var founder = window.HM_FOUNDER && window.HM_FOUNDER();
  return (
    <div className="sticky-upgrade-banner" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 999,
      background: 'linear-gradient(180deg, #102a18 0%, #0b1d11 100%)',
      borderTop: '1.5px solid rgba(200,167,39,0.5)',
      borderRadius: '18px 18px 0 0',
      padding: '13px 16px calc(13px + env(safe-area-inset-bottom, 0px))',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      boxShadow: '0 -10px 48px rgba(0,0,0,0.7)'
    }}>
      {/* liseré doré lumineux en haut */}
      <div style={{ position:'absolute', top:-1, left:'10%', right:'10%', height:2, background:'linear-gradient(90deg,transparent,#e6c84a,transparent)', borderRadius:2 }} />

      <div style={{ display:'flex', alignItems:'center', gap:12, flex:1, minWidth:0 }}>
        {/* badge -50% */}
        {founder && (
          <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#6ee79a,#22c55e)', borderRadius:12, padding:'6px 10px', boxShadow:'0 2px 12px rgba(34,197,94,0.4)' }}>
            <span style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:15, fontWeight:900, color:'#ffffff', lineHeight:1 }}>-50%</span>
          </div>
        )}
        <div style={{ minWidth:0 }}>
          <div style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:13.5, fontWeight:800, color:'#fff', lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            Débloque <span style={{ color:'#f5d76e' }}>tout l'accès</span>
          </div>
          <div style={{ fontFamily:'Plus Jakarta Sans,sans-serif', fontSize:12, color:'rgba(255,255,255,0.6)', marginTop:2, whiteSpace:'nowrap' }}>
            {founder ? (
              <>
                <span style={{ color:'#f5d76e', fontWeight:900, fontSize:15 }}>3,99€</span>
                <span style={{ textDecoration:'line-through', opacity:0.6, margin:'0 5px' }}>7,99€</span>
                le 1<sup style={{ fontSize:'0.7em' }}>er</sup> mois
              </>
            ) : (
              <><span style={{ color:'#f5d76e', fontWeight:900, fontSize:15 }}>7,99€</span> /mois</>
            )}
          </div>
        </div>
      </div>

      <button onClick={() => openQuickCheckout()} className="sticky-upgrade-banner-btn" style={{
        background:'linear-gradient(135deg,#e6c84a,#c8a727)',
        border:'none', color:'#0a1a08', padding:'13px 22px', borderRadius:12,
        fontSize:14, fontWeight:900, cursor:'pointer',
        fontFamily:'Plus Jakarta Sans,sans-serif',
        boxShadow:'0 4px 22px rgba(200,167,39,0.55)',
        whiteSpace:'nowrap', flexShrink:0
      }}>
        Débloquer →
      </button>
      <button onClick={() => setDismissed(true)} aria-label="Fermer" style={{
        background:'transparent', border:'none', color:'rgba(255,255,255,0.3)',
        fontSize:17, cursor:'pointer', padding:'4px 4px', flexShrink:0, lineHeight:1
      }}>✕</button>
    </div>
  );
}

/* ─── QuickCheckoutModal — Option A : checkout direct sans auth ─── */
function QuickCheckoutModal({ onClose, initialMethod }) {
  const { user } = useAuth();
  const [activeMethod, setActiveMethod] = React.useState(initialMethod || 'card');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const checkoutRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const genRef = React.useRef(0);       // jeton de génération (anti-obsolète)
  const busyRef = React.useRef(false);  // verrou : 1 seule création à la fois

  // Bloquer scroll body
  React.useEffect(function () {
    document.body.style.overflow = 'hidden';
    return function () { document.body.style.overflow = ''; };
  }, []);

  // Lancer checkout au montage
  React.useEffect(function () {
    startCheckout(initialMethod || 'card');
    return function () { genRef.current++; destroyCheckout(); };
  }, []);

  function destroyCheckout() {
    if (checkoutRef.current) {
      try { checkoutRef.current.destroy(); } catch (e) {}
      checkoutRef.current = null;
    }
  }

  async function startCheckout(method) {
    var myGen = ++genRef.current;          // invalide toute création précédente
    setLoading(true);
    setError(null);
    destroyCheckout();
    // attendre qu'une éventuelle création en cours se termine (jamais 2 en //)
    while (busyRef.current) {
      await new Promise(function (r) { setTimeout(r, 30); });
      if (myGen !== genRef.current) return; // supplanté entre-temps
    }
    busyRef.current = true;
    try {
      var stripe = window.Stripe('pk_live_51TVoHLCI24S0XRebTf9xPgcK5lOEAiVaWRXMsWii5u9qGzI661YAxmE9o5AyC0jBZLsqIGh3NiyQNe4pXeUdpkoC00zU3o9AOV');
      var res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ method: method, founder: window.HM_FOUNDER && window.HM_FOUNDER() }),
      });
      var data = await res.json();
      if (data.error) throw new Error(data.error);
      if (myGen !== genRef.current) return;  // supplanté pendant le fetch
      var checkout = await stripe.initEmbeddedCheckout({ clientSecret: data.clientSecret });
      if (myGen !== genRef.current) {        // supplanté pendant l'init -> on jette
        try { checkout.destroy(); } catch (e) {}
        return;
      }
      destroyCheckout();                     // sécurité : aucune instance résiduelle
      checkoutRef.current = checkout;
      setLoading(false);
      setTimeout(function () {
        if (containerRef.current && checkoutRef.current === checkout) checkout.mount(containerRef.current);
      }, 80);
    } catch (err) {
      if (myGen === genRef.current) { setError(err.message); setLoading(false); }
    } finally {
      busyRef.current = false;
    }
  }

  function handleClose() {
    destroyCheckout();
    onClose();
  }

  function switchMethod(m) {
    if (m === activeMethod && !error) return;
    setActiveMethod(m);
    startCheckout(m);
  }

  return (
    <div onClick={function (e) { if (e.target === e.currentTarget) handleClose(); }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)', zIndex: 10000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '16px', overflowY: 'auto' }}>
      <div className="checkout-modal" style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 520, position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', marginTop: 'max(16px, env(safe-area-inset-top))', marginBottom: 16 }}>

        {/* Header */}
        <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 10, fontWeight: 700, color: '#c8a727', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Héritage Pro · Offre Lancement</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              {(window.HM_FOUNDER && window.HM_FOUNDER()) && (
                <span style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 26, fontWeight: 900, color: '#1a1a1a', lineHeight: 1, letterSpacing: '-0.5px' }}>3,99€<span style={{ fontSize: 13, fontWeight: 700, color: '#555' }}> le 1er mois</span></span>
              )}
              <span style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: (window.HM_FOUNDER && window.HM_FOUNDER()) ? 14 : 26, fontWeight: (window.HM_FOUNDER && window.HM_FOUNDER()) ? 600 : 900, color: (window.HM_FOUNDER && window.HM_FOUNDER()) ? '#aaa' : '#1a1a1a', lineHeight: 1, textDecoration: (window.HM_FOUNDER && window.HM_FOUNDER()) ? 'line-through' : 'none' }}>7,99€<span style={{ fontSize: 12, fontWeight: 600, color: (window.HM_FOUNDER && window.HM_FOUNDER()) ? '#aaa' : '#555' }}>/mois</span></span>
              {(window.HM_FOUNDER && window.HM_FOUNDER()) && (
                <span style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 11, color: '#fff', fontWeight: 800, background: 'linear-gradient(135deg,#22c55e,#16a34a)', padding: '3px 9px', borderRadius: 20, letterSpacing: '0.02em' }}>−50%</span>
              )}
              <span style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 10, color: '#15803d', fontWeight: 700, background: 'rgba(22,163,74,0.12)', padding: '2px 8px', borderRadius: 20 }}>✓ Sans engagement</span>
            </div>
          </div>
          <button onClick={handleClose} style={{ background: 'rgba(0,0,0,0.07)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
        </div>

        {/* Tabs méthode de paiement */}
        <div style={{ padding: '10px 14px 0', display: 'flex', gap: 8 }}>
          <button onClick={() => switchMethod('card')}
            style={{ flex: 1, padding: '9px 6px', borderRadius: 10, border: activeMethod === 'card' ? '2px solid #c8a727' : '1px solid #e5e5e5', background: activeMethod === 'card' ? 'rgba(200,167,39,0.08)' : '#fff', color: activeMethod === 'card' ? '#b8960a' : '#666', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', transition: 'all 0.15s' }}>
            💳 Carte / Apple Pay
          </button>
          <button onClick={() => switchMethod('paypal')}
            style={{ flex: 1, padding: '9px 6px', borderRadius: 10, border: activeMethod === 'paypal' ? '2px solid #FFC439' : '1px solid #e5e5e5', background: activeMethod === 'paypal' ? 'rgba(255,196,57,0.10)' : '#fff', color: activeMethod === 'paypal' ? '#003087' : '#666', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', transition: 'all 0.15s' }}>
            PayPal · 1 mois
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ padding: '50px 20px', textAlign: 'center', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #f0e8d0', borderTopColor: '#c8a727', borderRadius: '50%', margin: '0 auto 14px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: '#888', fontSize: 13 }}>Chargement du paiement sécurisé…</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ padding: '30px 20px', textAlign: 'center', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>⚠️</div>
            <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 16 }}>{error}</p>
            <button onClick={() => startCheckout(activeMethod)} style={{ background: '#c8a727', border: 'none', color: '#1c1200', padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Réessayer</button>
          </div>
        )}

        {/* Stripe checkout */}
        <div ref={containerRef} />

        {/* Trust */}
        {!loading && !error && (
          <div style={{ padding: '8px 14px 14px', display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', borderTop: '1px solid #f5f5f5', marginTop: 4 }}>
            {['🔒 Paiement sécurisé', '↩ Résiliable en 1 clic', '📵 Sans pub'].map(function (t) {
              return <span key={t} style={{ color: '#555', fontSize: 11, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>{t}</span>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMPRENDRE — « Comprends ce que tu récites »
   Apprentissage des mots du Coran (mot-à-mot) + jeu + progression.
   Donnée mot-à-mot vérifiée. Audio: everyayah (Alafasy).
═══════════════════════════════════════════════════════════ */
const CMP_RECITER = 'Alafasy_128kbps';
const cmpPad3 = function (n) { return String(n).padStart(3, '0'); };
const cmpAyahAudio = function (surah, ayah) {
  return 'https://everyayah.com/data/' + CMP_RECITER + '/' + cmpPad3(surah) + cmpPad3(ayah) + '.mp3';
};

// Sourates avec découpage mot-à-mot (arabe + sens FR). Traductions standard.
const CMP_SOURATES = [
  {
    id: 'fatiha', surah: 1, name: 'Al-Fâtiha', fr: "L'Ouverture", free: true,
    ayahs: [
      { n: 1, words: [ {ar:'بِسْمِ',fr:'Au nom de'}, {ar:'اللَّهِ',fr:'Allah'}, {ar:'الرَّحْمَٰنِ',fr:'le Tout-Miséricordieux'}, {ar:'الرَّحِيمِ',fr:'le Très-Miséricordieux'} ] },
      { n: 2, words: [ {ar:'الْحَمْدُ',fr:'La louange'}, {ar:'لِلَّهِ',fr:'à Allah'}, {ar:'رَبِّ',fr:'Seigneur'}, {ar:'الْعَالَمِينَ',fr:"de l'univers"} ] },
      { n: 3, words: [ {ar:'الرَّحْمَٰنِ',fr:'le Tout-Miséricordieux'}, {ar:'الرَّحِيمِ',fr:'le Très-Miséricordieux'} ] },
      { n: 4, words: [ {ar:'مَالِكِ',fr:'Maître'}, {ar:'يَوْمِ',fr:'du Jour'}, {ar:'الدِّينِ',fr:'de la rétribution'} ] },
      { n: 5, words: [ {ar:'إِيَّاكَ',fr:"C'est Toi que"}, {ar:'نَعْبُدُ',fr:'nous adorons'}, {ar:'وَإِيَّاكَ',fr:"et c'est Toi que"}, {ar:'نَسْتَعِينُ',fr:"nous implorons l'aide"} ] },
      { n: 6, words: [ {ar:'اهْدِنَا',fr:'Guide-nous'}, {ar:'الصِّرَاطَ',fr:'le chemin'}, {ar:'الْمُسْتَقِيمَ',fr:'droit'} ] },
      { n: 7, words: [ {ar:'صِرَاطَ',fr:'le chemin de'}, {ar:'الَّذِينَ',fr:'ceux'}, {ar:'أَنْعَمْتَ',fr:'Tu as comblés'}, {ar:'عَلَيْهِمْ',fr:'sur eux'}, {ar:'غَيْرِ',fr:'non pas'}, {ar:'الْمَغْضُوبِ',fr:'des réprouvés'}, {ar:'وَلَا',fr:'ni'}, {ar:'الضَّالِّينَ',fr:'des égarés'} ] },
    ],
  },
  {
    id: 'ikhlas', surah: 112, name: 'Al-Ikhlâs', fr: 'Le Monothéisme pur', free: true,
    ayahs: [
      { n: 1, words: [ {ar:'قُلْ',fr:'Dis'}, {ar:'هُوَ',fr:'Il est'}, {ar:'اللَّهُ',fr:'Allah'}, {ar:'أَحَدٌ',fr:'Unique'} ] },
      { n: 2, words: [ {ar:'اللَّهُ',fr:'Allah'}, {ar:'الصَّمَدُ',fr:"l'Absolu"} ] },
      { n: 3, words: [ {ar:'لَمْ',fr:'ne pas'}, {ar:'يَلِدْ',fr:'a engendré'}, {ar:'وَلَمْ',fr:'et ne pas'}, {ar:'يُولَدْ',fr:'a été engendré'} ] },
      { n: 4, words: [ {ar:'وَلَمْ',fr:'et ne pas'}, {ar:'يَكُن',fr:'est'}, {ar:'لَّهُ',fr:'à Lui'}, {ar:'كُفُوًا',fr:'égal'}, {ar:'أَحَدٌ',fr:'quiconque'} ] },
    ],
  },
  {
    id: 'falaq', surah: 113, name: 'Al-Falaq', fr: "L'Aube naissante", free: false,
    ayahs: [
      { n: 1, words: [ {ar:'قُلْ',fr:'Dis'}, {ar:'أَعُوذُ',fr:'je cherche refuge'}, {ar:'بِرَبِّ',fr:'auprès du Seigneur'}, {ar:'الْفَلَقِ',fr:"de l'aube"} ] },
      { n: 2, words: [ {ar:'مِن',fr:'contre'}, {ar:'شَرِّ',fr:'le mal'}, {ar:'مَا',fr:'de ce'}, {ar:'خَلَقَ',fr:"qu'Il a créé"} ] },
      { n: 3, words: [ {ar:'وَمِن',fr:'et contre'}, {ar:'شَرِّ',fr:'le mal'}, {ar:'غَاسِقٍ',fr:"de l'obscurité"}, {ar:'إِذَا',fr:'quand'}, {ar:'وَقَبَ',fr:'elle s\'étend'} ] },
      { n: 4, words: [ {ar:'وَمِن',fr:'et contre'}, {ar:'شَرِّ',fr:'le mal'}, {ar:'النَّفَّاثَاتِ',fr:'des souffleuses'}, {ar:'فِي',fr:'sur'}, {ar:'الْعُقَدِ',fr:'les nœuds'} ] },
      { n: 5, words: [ {ar:'وَمِن',fr:'et contre'}, {ar:'شَرِّ',fr:'le mal'}, {ar:'حَاسِدٍ',fr:"de l'envieux"}, {ar:'إِذَا',fr:'quand'}, {ar:'حَسَدَ',fr:'il envie'} ] },
    ],
  },
  {
    id: 'nas', surah: 114, name: 'An-Nâs', fr: 'Les Hommes', free: false,
    ayahs: [
      { n: 1, words: [ {ar:'قُلْ',fr:'Dis'}, {ar:'أَعُوذُ',fr:'je cherche refuge'}, {ar:'بِرَبِّ',fr:'auprès du Seigneur'}, {ar:'النَّاسِ',fr:'des hommes'} ] },
      { n: 2, words: [ {ar:'مَلِكِ',fr:'le Roi'}, {ar:'النَّاسِ',fr:'des hommes'} ] },
      { n: 3, words: [ {ar:'إِلَٰهِ',fr:'le Dieu'}, {ar:'النَّاسِ',fr:'des hommes'} ] },
      { n: 4, words: [ {ar:'مِن',fr:'contre'}, {ar:'شَرِّ',fr:'le mal'}, {ar:'الْوَسْوَاسِ',fr:'du souffleur'}, {ar:'الْخَنَّاسِ',fr:'sournois'} ] },
      { n: 5, words: [ {ar:'الَّذِي',fr:'qui'}, {ar:'يُوَسْوِسُ',fr:'souffle'}, {ar:'فِي',fr:'dans'}, {ar:'صُدُورِ',fr:'les poitrines'}, {ar:'النَّاسِ',fr:'des hommes'} ] },
      { n: 6, words: [ {ar:'مِنَ',fr:'parmi'}, {ar:'الْجِنَّةِ',fr:'les djinns'}, {ar:'وَالنَّاسِ',fr:'et les hommes'} ] },
    ],
  },
  {
    id: 'asr', surah: 103, name: "Al-'Asr", fr: 'Le Temps', free: false,
    ayahs: [
      { n: 1, words: [ {ar:'وَالْعَصْرِ',fr:'Par le Temps'} ] },
      { n: 2, words: [ {ar:'إِنَّ',fr:'Certes'}, {ar:'الْإِنسَانَ',fr:"l'être humain"}, {ar:'لَفِي',fr:'est bien dans'}, {ar:'خُسْرٍ',fr:'la perte'} ] },
      { n: 3, words: [ {ar:'إِلَّا',fr:'sauf'}, {ar:'الَّذِينَ',fr:'ceux qui'}, {ar:'آمَنُوا',fr:'ont cru'}, {ar:'وَعَمِلُوا',fr:'et ont accompli'}, {ar:'الصَّالِحَاتِ',fr:'les bonnes œuvres'}, {ar:'وَتَوَاصَوْا',fr:'et se sont enjoint'}, {ar:'بِالْحَقِّ',fr:'la vérité'}, {ar:'وَتَوَاصَوْا',fr:'et se sont enjoint'}, {ar:'بِالصَّبْرِ',fr:"l'endurance"} ] },
    ],
  },
  {
    id: 'kawthar', surah: 108, name: 'Al-Kawthar', fr: "L'Abondance", free: false,
    ayahs: [
      { n: 1, words: [ {ar:'إِنَّا',fr:'Certes Nous'}, {ar:'أَعْطَيْنَاكَ',fr:"t'avons accordé"}, {ar:'الْكَوْثَرَ',fr:"l'abondance"} ] },
      { n: 2, words: [ {ar:'فَصَلِّ',fr:'Accomplis la prière'}, {ar:'لِرَبِّكَ',fr:'pour ton Seigneur'}, {ar:'وَانْحَرْ',fr:'et sacrifie'} ] },
      { n: 3, words: [ {ar:'إِنَّ',fr:'Certes'}, {ar:'شَانِئَكَ',fr:'celui qui te déteste'}, {ar:'هُوَ',fr:'est celui'}, {ar:'الْأَبْتَرُ',fr:'sans postérité'} ] },
    ],
  },
  {
    id: 'kafirun', surah: 109, name: 'Al-Kâfirûn', fr: 'Les Mécréants', free: false,
    ayahs: [
      { n: 1, words: [ {ar:'قُلْ',fr:'Dis'}, {ar:'يَا',fr:'Ô'}, {ar:'أَيُّهَا',fr:'vous'}, {ar:'الْكَافِرُونَ',fr:'les mécréants'} ] },
      { n: 2, words: [ {ar:'لَا',fr:'ne pas'}, {ar:'أَعْبُدُ',fr:"j'adore"}, {ar:'مَا',fr:'ce que'}, {ar:'تَعْبُدُونَ',fr:'vous adorez'} ] },
      { n: 3, words: [ {ar:'وَلَا',fr:'et ne pas'}, {ar:'أَنتُمْ',fr:'vous'}, {ar:'عَابِدُونَ',fr:'adorez'}, {ar:'مَا',fr:'ce que'}, {ar:'أَعْبُدُ',fr:"j'adore"} ] },
      { n: 4, words: [ {ar:'وَلَا',fr:'et ne pas'}, {ar:'أَنَا',fr:'je suis'}, {ar:'عَابِدٌ',fr:'adorateur'}, {ar:'مَّا',fr:'de ce que'}, {ar:'عَبَدتُّمْ',fr:'vous avez adoré'} ] },
      { n: 5, words: [ {ar:'وَلَا',fr:'et ne pas'}, {ar:'أَنتُمْ',fr:'vous'}, {ar:'عَابِدُونَ',fr:'adorez'}, {ar:'مَا',fr:'ce que'}, {ar:'أَعْبُدُ',fr:"j'adore"} ] },
      { n: 6, words: [ {ar:'لَكُمْ',fr:'à vous'}, {ar:'دِينُكُمْ',fr:'votre religion'}, {ar:'وَلِيَ',fr:'et à moi'}, {ar:'دِينِ',fr:'ma religion'} ] },
    ],
  },
  {
    id: 'maun', surah: 107, name: "Al-Mâ'ûn", fr: "L'Ustensile", free: false,
    ayahs: [
      { n: 1, words: [ {ar:'أَرَأَيْتَ',fr:'As-tu vu'}, {ar:'الَّذِي',fr:'celui qui'}, {ar:'يُكَذِّبُ',fr:'traite de mensonge'}, {ar:'بِالدِّينِ',fr:'la religion'} ] },
      { n: 2, words: [ {ar:'فَذَٰلِكَ',fr:"C'est celui"}, {ar:'الَّذِي',fr:'qui'}, {ar:'يَدُعُّ',fr:'repousse'}, {ar:'الْيَتِيمَ',fr:"l'orphelin"} ] },
      { n: 3, words: [ {ar:'وَلَا',fr:'et ne pas'}, {ar:'يَحُضُّ',fr:'incite'}, {ar:'عَلَىٰ',fr:'à'}, {ar:'طَعَامِ',fr:'nourrir'}, {ar:'الْمِسْكِينِ',fr:'le pauvre'} ] },
      { n: 4, words: [ {ar:'فَوَيْلٌ',fr:'Malheur'}, {ar:'لِّلْمُصَلِّينَ',fr:'à ceux qui prient'} ] },
      { n: 5, words: [ {ar:'الَّذِينَ',fr:'qui'}, {ar:'هُمْ',fr:'sont'}, {ar:'عَن',fr:'de'}, {ar:'صَلَاتِهِمْ',fr:'leur prière'}, {ar:'سَاهُونَ',fr:'distraits'} ] },
      { n: 6, words: [ {ar:'الَّذِينَ',fr:'qui'}, {ar:'هُمْ',fr:'sont'}, {ar:'يُرَاءُونَ',fr:"de l'ostentation"} ] },
      { n: 7, words: [ {ar:'وَيَمْنَعُونَ',fr:'et refusent'}, {ar:'الْمَاعُونَ',fr:'la menue assistance'} ] },
    ],
  },
];

// Index global des mots uniques (clé = arabe). Sert au jeu + à la progression.
const CMP_WORD_INDEX = (function () {
  const map = {};
  CMP_SOURATES.forEach(function (s) {
    s.ayahs.forEach(function (a) {
      a.words.forEach(function (w) {
        if (!map[w.ar]) map[w.ar] = { ar: w.ar, fr: w.fr, sourates: [] };
        if (map[w.ar].sourates.indexOf(s.id) < 0) map[w.ar].sourates.push(s.id);
      });
    });
  });
  return map;
})();
const CMP_ALL_WORDS = Object.keys(CMP_WORD_INDEX).map(function (k) { return CMP_WORD_INDEX[k]; });
const CMP_MASTER_THRESHOLD = 2; // bonnes réponses pour "maîtrisé"

// Phonétique (translittération FR) par mot arabe — pour ceux qui ne lisent pas l'arabe.
const CMP_PHON = {
  'بِسْمِ':'bismi','اللَّهِ':'Llâhi','الرَّحْمَٰنِ':'ar-Rahmâni','الرَّحِيمِ':'ar-Rahîm',
  'الْحَمْدُ':'al-hamdu','لِلَّهِ':'lillâhi','رَبِّ':'rabbi','الْعَالَمِينَ':"al-'âlamîn",
  'مَالِكِ':'mâliki','يَوْمِ':'yawmi','الدِّينِ':'ad-dîn',
  'إِيَّاكَ':'iyyâka','نَعْبُدُ':"na'budu",'وَإِيَّاكَ':'wa iyyâka','نَسْتَعِينُ':"nasta'în",
  'اهْدِنَا':'ihdinâ','الصِّرَاطَ':'as-sirâta','الْمُسْتَقِيمَ':'al-mustaqîm',
  'صِرَاطَ':'sirâta','الَّذِينَ':'alladhîna','أَنْعَمْتَ':"an'amta",'عَلَيْهِمْ':"'alayhim",'غَيْرِ':'ghayri','الْمَغْضُوبِ':'al-maghdûbi','وَلَا':'wa lâ','الضَّالِّينَ':'ad-dâllîn',
  'قُلْ':'qoul','هُوَ':'huwa','اللَّهُ':'Allâhu','أَحَدٌ':'ahad','الصَّمَدُ':'as-Samad',
  'لَمْ':'lam','يَلِدْ':'yalid','وَلَمْ':'wa lam','يُولَدْ':'yûlad','يَكُن':'yakun','لَّهُ':'lahû','كُفُوًا':'koufouwan',
  'أَعُوذُ':"a'oûdhou",'بِرَبِّ':'bi-rabbi','الْفَلَقِ':'al-falaq','مِن':'min','شَرِّ':'charri','مَا':'mâ','خَلَقَ':'khalaqa',
  'وَمِن':'wa min','غَاسِقٍ':'ghâsiqin','إِذَا':'idhâ','وَقَبَ':'waqaba','النَّفَّاثَاتِ':'an-naffâthâti','فِي':'fî','الْعُقَدِ':"al-'uqad",'حَاسِدٍ':'hâsidin','حَسَدَ':'hasada',
  'النَّاسِ':'an-nâs','مَلِكِ':'maliki','إِلَٰهِ':'ilâhi','الْوَسْوَاسِ':'al-waswâsi','الْخَنَّاسِ':'al-khannâs','الَّذِي':'alladhî','يُوَسْوِسُ':'youwaswisu','صُدُورِ':'sudûri','مِنَ':'mina','الْجِنَّةِ':'al-jinnati','وَالنَّاسِ':'wan-nâs',
  'وَالْعَصْرِ':"wal-'asr",'إِنَّ':'inna','الْإِنسَانَ':'al-insâna','لَفِي':'lafî','خُسْرٍ':'khousr','إِلَّا':'illâ','آمَنُوا':'âmanû','وَعَمِلُوا':"wa 'amilû",'الصَّالِحَاتِ':'as-sâlihâti','وَتَوَاصَوْا':'wa tawâsaw','بِالْحَقِّ':'bil-haqqi','بِالصَّبْرِ':'bis-sabr',
  'إِنَّا':'innâ','أَعْطَيْنَاكَ':"a'taynâka",'الْكَوْثَرَ':'al-kawthar','فَصَلِّ':'fa-salli','لِرَبِّكَ':'li-rabbika','وَانْحَرْ':'wanhar','شَانِئَكَ':'châni-aka','الْأَبْتَرُ':'al-abtar',
  'يَا':'yâ','أَيُّهَا':'ayyuhâ','الْكَافِرُونَ':'al-kâfirûn','لَا':'lâ','أَعْبُدُ':"a'budu",'تَعْبُدُونَ':"ta'budûn",'وَلَا ':'wa lâ','أَنتُمْ':'antum','عَابِدُونَ':"'âbidûn",'أَنَا':'anâ','عَابِدٌ':"'âbidun",'مَّا':'mâ','عَبَدتُّمْ':"'abadtum",'لَكُمْ':'lakum','دِينُكُمْ':'dînukum','وَلِيَ':'wa liya','دِينِ':'dîn',
  'أَرَأَيْتَ':'a-ra-ayta','يُكَذِّبُ':'youkadhdhibu','بِالدِّينِ':'bid-dîn','فَذَٰلِكَ':'fa-dhâlika','يَدُعُّ':"yadu''u",'الْيَتِيمَ':'al-yatîm','يَحُضُّ':'yahuddu','عَلَىٰ':"'alâ",'طَعَامِ':"ta'âmi",'الْمِسْكِينِ':'al-miskîn','فَوَيْلٌ':'fa-waylun','لِّلْمُصَلِّينَ':'lil-musallîn','هُمْ':'hum','عَن':"'an",'صَلَاتِهِمْ':'salâtihim','سَاهُونَ':'sâhûn','يُرَاءُونَ':'yurâ-ûn','وَيَمْنَعُونَ':"wa yamna'ûna",'الْمَاعُونَ':"al-mâ'ûn",
};
// Normalise (retire les diacritiques) pour une recherche robuste malgré les variations de harakat.
function cmpNorm(s) { return (s || '').replace(/[ؐ-ًؚ-ٰٟـۖ-ۭ]/g, ''); }
const CMP_PHON_NORM = (function () { var m = {}; Object.keys(CMP_PHON).forEach(function (k) { m[cmpNorm(k)] = CMP_PHON[k]; }); return m; })();
function cmpPhon(ar) { return CMP_PHON[ar] || CMP_PHON_NORM[cmpNorm(ar)] || ''; }

// ── Persistance (localStorage) ──
const CMP_KEY = 'hm_comprendre_v1';
function cmpLoad() {
  try {
    const raw = localStorage.getItem(CMP_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { xp: 0, streak: 0, lastDay: null, words: {}, best: {}, totalCorrect: 0 };
}
function cmpSave(st) { try { localStorage.setItem(CMP_KEY, JSON.stringify(st)); } catch (e) {} }
// Fusionne deux états (local + compte) sans rien perdre — prend le meilleur de chaque.
function cmpMerge(a, b) {
  a = a || {}; b = b || {};
  const words = {};
  Object.keys(a.words || {}).forEach(function (k) { words[k] = a.words[k]; });
  Object.keys(b.words || {}).forEach(function (k) { words[k] = Math.max(words[k] || 0, b.words[k]); });
  const best = {};
  Object.keys(a.best || {}).forEach(function (k) { best[k] = a.best[k]; });
  Object.keys(b.best || {}).forEach(function (k) { best[k] = Math.max(best[k] || 0, b.best[k]); });
  const aDay = a.lastDay || '', bDay = b.lastDay || '';
  const later = bDay >= aDay ? b : a;
  return {
    xp: Math.max(a.xp || 0, b.xp || 0),
    streak: later.streak || 0,
    lastDay: later.lastDay || null,
    words: words,
    best: best,
    totalCorrect: Math.max(a.totalCorrect || 0, b.totalCorrect || 0),
    plays: Math.max(a.plays || 0, b.plays || 0),
  };
}
function cmpTodayStr() { return new Date().toISOString().slice(0, 10); }
function cmpLearnedCount(words) {
  // mots vus correctement au moins une fois (progression visible dès la 1re partie)
  return Object.keys(words || {}).filter(function (k) { return (words[k] || 0) >= 1; }).length;
}
function cmpMasteredCount(words) {
  return Object.keys(words || {}).filter(function (k) { return (words[k] || 0) >= CMP_MASTER_THRESHOLD; }).length;
}
function cmpComprehensionPct(words) {
  // estimation motivante : ~ chaque mot appris ≈ 1,6%
  return Math.min(99, Math.round(cmpLearnedCount(words) * 1.6));
}
const CMP_LEVELS = ['Débutant', 'Apprenti', 'Étudiant', 'Connaisseur', 'Savant', 'Hâfiz'];
function cmpLevel(xp) {
  const lv = Math.floor((xp || 0) / 120);
  return { n: lv + 1, title: CMP_LEVELS[Math.min(lv, CMP_LEVELS.length - 1)], inLevel: (xp || 0) % 120, need: 120 };
}
function cmpShuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

// Anneau de progression SVG
function CmpRing({ pct, size, stroke, color, track, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track || 'rgba(255,255,255,0.08)'} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.max(0, Math.min(1, pct/100)))} style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)', filter: 'drop-shadow(0 0 6px ' + color + '88)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>{children}</div>
    </div>
  );
}

function ComprendrePage({ navigate }) {
  const { isPro, openAuth, user, openQuickCheckout } = useAuth();
  const [st, setSt] = React.useState(cmpLoad);
  const [mode, setMode] = React.useState('hub'); // hub | discover | play | result
  const [sourate, setSourate] = React.useState(CMP_SOURATES[0]);
  const audioRef = React.useRef(null);

  const persist = React.useCallback(function (next) { setSt(next); cmpSave(next); }, []);

  React.useEffect(function () {
    audioRef.current = typeof Audio !== 'undefined' ? new Audio() : null;
    return function () { if (audioRef.current) { try { audioRef.current.pause(); } catch (e) {} } };
  }, []);
  const playAyah = React.useCallback(function (surah, ayah) {
    if (!audioRef.current) return;
    try { audioRef.current.pause(); audioRef.current.src = cmpAyahAudio(surah, ayah); audioRef.current.currentTime = 0; const p = audioRef.current.play(); if (p && p.catch) p.catch(function(){}); } catch (e) {}
  }, []);

  // Synchro compte : charge la progression Firestore et fusionne avec le local (suivi cross-device)
  React.useEffect(function () {
    if (!user || !window._db) return;
    let cancelled = false;
    window._db.collection('users').doc(user.uid).get().then(function (doc) {
      if (cancelled || !doc.exists) return;
      const remote = doc.data().comprendre;
      if (!remote) return;
      setSt(function (local) { const merged = cmpMerge(local, remote); cmpSave(merged); return merged; });
    }).catch(function () {});
    return function () { cancelled = true; };
  }, [user]);

  const mastered = cmpLearnedCount(st.words);
  const pct = cmpComprehensionPct(st.words);
  const lvl = cmpLevel(st.xp);

  const [showGate, setShowGate] = React.useState(false);
  const [showPro, setShowPro] = React.useState(false);
  // Invité : 1 sourate offerte. Ensuite (autre sourate OU rejouer) → compte requis.
  const guestBlocked = !user && (st.plays || 0) > 0;

  function openSourate(s) {
    if (!s.free && !isPro) { setShowPro(true); return; }
    if (guestBlocked) { setShowGate(true); return; }
    setSourate(s); setMode('discover');
  }

  // ── enregistre résultat d'une partie ──
  function commitResult(res) {
    const next = JSON.parse(JSON.stringify(st));
    // streak
    const today = cmpTodayStr();
    if (next.lastDay !== today) {
      const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      next.streak = next.lastDay === y ? (next.streak || 0) + 1 : 1;
      next.lastDay = today;
    }
    next.xp = (next.xp || 0) + res.xp;
    next.totalCorrect = (next.totalCorrect || 0) + res.correct;
    res.wordResults.forEach(function (wr) {
      if (wr.correct) next.words[wr.ar] = Math.min(CMP_MASTER_THRESHOLD + 3, (next.words[wr.ar] || 0) + 1);
    });
    const prevBest = next.best[sourate.id] || 0;
    if (res.scorePct > prevBest) next.best[sourate.id] = res.scorePct;
    next.plays = (next.plays || 0) + 1;
    persist(next);
    // Sauvegarde sur le compte (suivi + cross-device)
    if (user && window._db) {
      try { window._db.collection('users').doc(user.uid).set({ comprendre: next, comprendreUpdatedAt: Date.now() }, { merge: true }); } catch (e) {}
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 0%, #0a1f12 0%, #050f09 45%, #03070a 100%)', fontFamily: "'Plus Jakarta Sans',sans-serif", paddingBottom: 60 }}>
      <Navbar navigate={navigate} />
      {mode === 'hub' && <CmpHub st={st} pct={pct} mastered={mastered} lvl={lvl} isPro={isPro} onOpen={openSourate} onBack={function(){ navigate('home'); }} onPro={function(){ setShowPro(true); }} />}
      {mode === 'discover' && <CmpDiscover sourate={sourate} playAyah={playAyah} onPlay={function(){ setMode('play'); }} onBack={function(){ setMode('hub'); }} />}
      {mode === 'play' && <CmpPlay sourate={sourate} st={st} onFinish={function(res){ commitResult(res); window.__cmpLastRes = res; setMode('result'); }} onBack={function(){ setMode('hub'); }} />}
      {mode === 'result' && <CmpResult res={window.__cmpLastRes} sourate={sourate} st={st} pct={pct} mastered={mastered} lvl={lvl} isPro={isPro} onReplay={function(){ if (guestBlocked) { setShowGate(true); return; } setMode('discover'); }} onHub={function(){ setMode('hub'); }} onPro={function(){ setShowPro(true); }} />}
      {showGate && <GuestGateModal context="comprendre" onClose={function(){ setShowGate(false); }} />}
      {showPro && <CmpProModal pct={pct} onClose={function(){ setShowPro(false); }} />}
    </div>
  );
}

// ── HUB ──
// ── Modal Pro contextuel « Comprendre » — vendu sur le bénéfice, pas sur le verrou ──
function CmpProModal({ onClose, pct }) {
  const { openQuickCheckout } = useAuth();
  const GOLD = '#e6c84a';
  const lockedCount = CMP_SOURATES.filter(function (s) { return !s.free; }).length;
  React.useEffect(function () {
    document.body.style.overflow = 'hidden';
    return function () { document.body.style.overflow = ''; };
  }, []);
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 10000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '24px 20px', overflowY: 'auto', WebkitOverflowScrolling: 'touch', animation: 'overlayFade 0.25s ease-out' }}>
      <div onClick={function (e) { e.stopPropagation(); }} style={{ background: 'linear-gradient(145deg,#0a1f12,#071510)', border: '1px solid rgba(200,167,39,0.35)', borderRadius: 22, padding: '34px 28px', maxWidth: 410, width: '100%', margin: '16px auto', textAlign: 'center', boxShadow: '0 0 80px rgba(200,167,39,0.12), 0 40px 60px rgba(0,0,0,0.6)', animation: 'proPop 0.38s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <div style={{ fontSize: 40, marginBottom: 10 }}>📖</div>
        <h2 style={{ fontFamily: 'Cinzel,serif', fontSize: 22, color: '#f0ede6', margin: '0 0 8px', lineHeight: 1.25 }}>
          {lockedCount} sourates<br /><span style={{ color: GOLD }}>t'attendent.</span>
        </h2>
        <p style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 14, color: 'rgba(240,237,230,0.6)', lineHeight: 1.7, margin: '0 0 18px' }}>
          Tu comprends déjà <strong style={{ color: GOLD }}>{pct}%</strong> des mots fréquents.
          Ne t'arrête pas là — chaque sourate apprise te rapproche de <strong style={{ color: '#f0ede6' }}>comprendre ta prière</strong>.
        </p>
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '14px 16px', marginBottom: 16, textAlign: 'left' }}>
          {['📖 Les ' + CMP_SOURATES.length + ' sourates mot à mot — et toutes celles à venir', '🎵 Blind Test complet — 114 sourates', '🧠 Quiz tous niveaux, tous thèmes', '🎬 Studio vidéo + téléchargement HD'].map(function (f) {
            return <div key={f} style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 12.5, color: 'rgba(240,237,230,0.7)', marginBottom: 7, display: 'flex', gap: 8 }}><span style={{ color: '#4ade80', fontWeight: 800 }}>✓</span>{f}</div>;
          })}
        </div>
        <div style={{ marginBottom: 14 }}>
          {(window.HM_FOUNDER && window.HM_FOUNDER()) ? <OfferPrice big={36} /> : (
            <><span style={{ fontFamily: 'Cinzel,serif', fontSize: 34, fontWeight: 700, color: GOLD }}>7,99€</span><span style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 13, color: 'rgba(240,237,230,0.4)' }}> / mois</span></>
          )}
        </div>
        <button onClick={function () { onClose(); openQuickCheckout(); }}
          style={{ width: '100%', background: 'linear-gradient(135deg,#c8a727,#a8891f)', border: 'none', color: '#1a1205', padding: '15px', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', marginBottom: 10, boxShadow: '0 4px 20px rgba(200,167,39,0.35)' }}>
          {(window.HM_FOUNDER && window.HM_FOUNDER()) ? 'Débloquer tout — 3,99€ le 1er mois' : 'Débloquer tout — 7,99€/mois'}
        </button>
        <p style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 11.5, color: 'rgba(240,237,230,0.45)', lineHeight: 1.6, margin: '0 0 10px' }}>
          🤲 Ton abonnement finance un projet 100% indépendant, sans pub — apprendre sa religion n'a pas de prix, mais le maintenir a un coût.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 12, flexWrap: 'wrap', fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 11, color: 'rgba(240,237,230,0.5)' }}>
          <span>✓ +130 membres</span><span>✓ Sans engagement</span><span>✓ Remboursé sous 48h</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(240,237,230,0.3)', fontSize: 13, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>
          Plus tard
        </button>
      </div>
    </div>
  );
}

function CmpHub({ st, pct, mastered, lvl, isPro, onOpen, onBack, onPro }) {
  const GOLD = '#e6c84a';
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '90px 20px 0' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(240,237,230,0.5)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 20 }}>← Accueil</button>

      {/* En-tête */}
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: GOLD, marginBottom: 12 }}>◆ Comprendre le Coran</p>
        <h1 style={{ fontFamily: 'Cinzel,serif', fontWeight: 700, fontSize: 'clamp(28px,6vw,42px)', color: '#f0ede6', lineHeight: 1.15, margin: '0 0 14px' }}>
          Comprends ce que<br/><span style={{ color: GOLD }}>tu récites.</span>
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(240,237,230,0.55)', lineHeight: 1.7, maxWidth: 460, margin: '0 auto' }}>
          Tu pries en arabe sans tout comprendre ? <strong style={{ color: '#f0ede6' }}>50 mots suffisent à saisir près de la moitié du Coran.</strong> Apprends-les, un verset à la fois.
        </p>
      </div>

      {/* Tableau de progression */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', background: 'linear-gradient(160deg,rgba(200,167,39,0.08),rgba(255,255,255,0.02))', border: '1px solid rgba(200,167,39,0.25)', borderRadius: 22, padding: '22px 24px', marginBottom: 16 }}>
        <CmpRing pct={pct} size={104} stroke={10} color={GOLD}>
          <span style={{ fontSize: 28, fontWeight: 900, color: GOLD, lineHeight: 1 }}>{pct}<span style={{ fontSize: 15 }}>%</span></span>
          <span style={{ fontSize: 9.5, color: 'rgba(240,237,230,0.5)', letterSpacing: '0.05em', marginTop: 2 }}>compris</span>
        </CmpRing>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'rgba(240,237,230,0.55)', marginBottom: 4 }}>Niveau {lvl.n} · <span style={{ color: GOLD, fontWeight: 700 }}>{lvl.title}</span></div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 5, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ height: '100%', width: (lvl.inLevel / lvl.need * 100) + '%', background: 'linear-gradient(90deg,#a8891f,' + GOLD + ')', borderRadius: 5, transition: 'width 0.6s' }} />
          </div>
          <div style={{ display: 'flex', gap: 18 }}>
            <div><div style={{ fontSize: 20, fontWeight: 900, color: '#f0ede6' }}>{mastered}</div><div style={{ fontSize: 11, color: 'rgba(240,237,230,0.45)' }}>mots appris</div></div>
            <div><div style={{ fontSize: 20, fontWeight: 900, color: '#ff8a4c' }}>🔥 {st.streak || 0}</div><div style={{ fontSize: 11, color: 'rgba(240,237,230,0.45)' }}>jours d'affilée</div></div>
            <div><div style={{ fontSize: 20, fontWeight: 900, color: '#f0ede6' }}>{st.xp || 0}</div><div style={{ fontSize: 11, color: 'rgba(240,237,230,0.45)' }}>XP</div></div>
          </div>
        </div>
      </div>

      {/* Liste des sourates */}
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(240,237,230,0.4)', margin: '24px 0 12px' }}>Choisis une sourate</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {CMP_SOURATES.map(function (s) {
          const locked = !s.free && !isPro;
          const total = s.ayahs.reduce(function (n, a) { return n + a.words.length; }, 0);
          const best = st.best[s.id] || 0;
          return (
            <button key={s.id} onClick={function(){ onOpen(s); }} style={{ textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16, background: locked ? 'linear-gradient(160deg,rgba(200,167,39,0.05),rgba(255,255,255,0.01))' : 'linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))', border: '1px solid ' + (locked ? 'rgba(200,167,39,0.18)' : 'rgba(200,167,39,0.3)'), borderRadius: 18, padding: '18px 20px', fontFamily: 'inherit', position: 'relative' }}>
              <div style={{ width: 52, height: 52, flexShrink: 0, borderRadius: 14, background: locked ? 'rgba(200,167,39,0.1)' : 'linear-gradient(135deg,#c8a727,#a8891f)', border: locked ? '1px solid rgba(200,167,39,0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: locked ? 20 : 22, fontWeight: 900, color: locked ? GOLD : '#1a1205' }}>{locked ? '🔒' : s.surah}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: '#f0ede6', fontFamily: 'Cinzel,serif' }}>{s.name}</span>
                  {locked && <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.1em', color: '#1a1205', background: 'linear-gradient(135deg,#e6c84a,#b8922f)', padding: '2px 8px', borderRadius: 999 }}>PRO</span>}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(240,237,230,0.5)' }}>{s.fr} · {total} mots{best > 0 ? ' · record ' + best + '%' : ''}</div>
              </div>
              <span style={{ color: '#e6c84a', fontSize: 22 }}>›</span>
            </button>
          );
        })}
      </div>
      {/* Bannière upsell (non-Pro) — cliquable */}
      {!isPro && (
        <button onClick={onPro} style={{ width: '100%', marginTop: 14, padding: '16px 18px', background: 'linear-gradient(135deg,rgba(200,167,39,0.16),rgba(200,167,39,0.06))', border: '1px solid rgba(200,167,39,0.45)', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', boxShadow: '0 4px 24px rgba(200,167,39,0.12)' }}>
          <span style={{ fontSize: 24 }}>🔓</span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 14.5, color: '#f0ede6', fontWeight: 800 }}>Débloque les {CMP_SOURATES.filter(function(s){return !s.free;}).length} sourates restantes</span>
            <span style={{ display: 'block', fontSize: 12, color: GOLD, fontWeight: 700 }}>{(window.HM_FOUNDER && window.HM_FOUNDER()) ? '3,99€ le 1er mois · sans engagement' : '7,99€/mois · sans engagement'}</span>
          </span>
          <span style={{ color: GOLD, fontSize: 20 }}>›</span>
        </button>
      )}
      {/* Teaser nouvelles sourates */}
      <div style={{ marginTop: 14, padding: '14px 18px', background: 'linear-gradient(160deg,rgba(200,167,39,0.06),rgba(255,255,255,0.01))', border: '1px dashed rgba(200,167,39,0.28)', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 22 }}>✨</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, color: '#f0ede6', fontWeight: 700 }}>D'autres sourates arrivent bientôt</div>
          <div style={{ fontSize: 12, color: 'rgba(240,237,230,0.5)' }}>On enrichit le contenu chaque semaine — les membres Pro y ont accès en premier.</div>
        </div>
      </div>
    </div>
  );
}

// ── DÉCOUVERTE (reveal mot-à-mot + audio) ──
function CmpDiscover({ sourate, playAyah, onPlay, onBack }) {
  const GOLD = '#e6c84a';
  const [ai, setAi] = React.useState(0);
  const [revealed, setRevealed] = React.useState(0); // nb de mots révélés sur l'ayah courant
  const ayah = sourate.ayahs[ai];

  React.useEffect(function () {
    setRevealed(0);
    playAyah(sourate.surah, ayah.n);
    const timers = ayah.words.map(function (_, i) {
      return setTimeout(function () { setRevealed(function (r) { return Math.max(r, i + 1); }); }, 500 + i * 850);
    });
    return function () { timers.forEach(clearTimeout); };
  }, [ai]);

  const last = ai >= sourate.ayahs.length - 1;
  const allRevealed = revealed >= ayah.words.length;

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '84px 20px 0', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(240,237,230,0.5)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>← Retour</button>
        <span style={{ fontSize: 13, color: 'rgba(240,237,230,0.5)' }}>{sourate.name} · verset {ayah.n}/{sourate.ayahs.length}</span>
      </div>

      <div style={{ textAlign: 'center', margin: '10px 0 28px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD }}>Découverte · écoute & lis</p>
      </div>

      {/* Mot-à-mot : RTL, chaque mot avec son sens dessous */}
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', flexDirection: 'row-reverse', justifyContent: 'center', alignContent: 'flex-start', gap: '14px 12px', padding: '10px 0 30px' }}>
        {ayah.words.map(function (w, i) {
          const show = i < revealed;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 16px', borderRadius: 16, background: show ? 'rgba(200,167,39,0.10)' : 'rgba(255,255,255,0.03)', border: '1px solid ' + (show ? 'rgba(200,167,39,0.4)' : 'rgba(255,255,255,0.06)'), opacity: show ? 1 : 0.35, transform: show ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.96)', transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
              <span style={{ fontFamily: 'Amiri,Georgia,serif', fontSize: 40, color: '#f7eecb', lineHeight: 1, direction: 'rtl' }}>{w.ar}</span>
              <span style={{ fontSize: 12.5, color: show ? 'rgba(240,237,230,0.55)' : 'transparent', fontStyle: 'italic', fontWeight: 500, transition: 'color 0.4s' }}>{cmpPhon(w.ar)}</span>
              <span style={{ fontSize: 14, color: show ? GOLD : 'transparent', fontWeight: 600, transition: 'color 0.4s' }}>{w.fr}</span>
            </div>
          );
        })}
      </div>

      {/* Traduction complète quand tout révélé */}
      <div style={{ minHeight: 50, textAlign: 'center', opacity: allRevealed ? 1 : 0, transition: 'opacity 0.5s', marginBottom: 18 }}>
        <p style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: 20, fontStyle: 'italic', color: 'rgba(240,237,230,0.8)', lineHeight: 1.5 }}>
          « {ayah.words.map(function (w) { return w.fr; }).join(' ')} »
        </p>
      </div>

      {/* Contrôles */}
      <div style={{ position: 'sticky', bottom: 0, background: 'linear-gradient(0deg,#03070a 60%,transparent)', padding: '16px 0 24px', display: 'flex', gap: 12 }}>
        <button onClick={function(){ playAyah(sourate.surah, ayah.n); setRevealed(ayah.words.length); }} style={{ flexShrink: 0, width: 56, height: 56, borderRadius: '50%', border: '1px solid rgba(200,167,39,0.4)', background: 'rgba(200,167,39,0.12)', color: GOLD, fontSize: 22, cursor: 'pointer' }}>▶</button>
        {!last ? (
          <button onClick={function(){ setAi(ai + 1); }} style={{ flex: 1, padding: '16px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg,#c8a727,#a8891f)', color: '#1a1205', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>Verset suivant →</button>
        ) : (
          <button onClick={onPlay} style={{ flex: 1, padding: '16px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg,#4ade80,#22a35a)', color: '#04140a', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>🎮 Maintenant, joue →</button>
        )}
      </div>
    </div>
  );
}

// ── JEU ──
function cmpBuildQuestions(sourate) {
  // mots uniques de la sourate
  const seen = {};
  const words = [];
  sourate.ayahs.forEach(function (a) { a.words.forEach(function (w) { if (!seen[w.ar]) { seen[w.ar] = 1; words.push(w); } }); });
  const pool = words.length >= 4 ? words : CMP_ALL_WORDS;
  const qs = cmpShuffle(words).slice(0, Math.min(8, words.length)).map(function (w, idx) {
    const type = idx % 3; // 0: ar→fr, 1: fr→ar, 2: complète (ar→fr aussi mais présenté en verset)
    const distract = cmpShuffle(pool.filter(function (x) { return x.fr !== w.fr; })).slice(0, 3);
    if (type === 1) {
      const opts = cmpShuffle([w].concat(distract));
      return { kind: 'fr2ar', ar: w.ar, prompt: w.fr, options: opts.map(function (o) { return o.ar; }), answer: w.ar };
    }
    const opts = cmpShuffle([w].concat(distract));
    return { kind: type === 2 ? 'fill' : 'ar2fr', ar: w.ar, prompt: w.ar, options: opts.map(function (o) { return o.fr; }), answer: w.fr };
  });
  return qs;
}

function CmpPlay({ sourate, st, onFinish, onBack }) {
  const GOLD = '#e6c84a';
  const GREEN = '#4ade80';
  const RED = '#e8654a';
  const [qs] = React.useState(function () { return cmpBuildQuestions(sourate); });
  const [qi, setQi] = React.useState(0);
  const [picked, setPicked] = React.useState(null);
  const [score, setScore] = React.useState(0);
  const [combo, setCombo] = React.useState(0);
  const [results, setResults] = React.useState([]);
  const [burst, setBurst] = React.useState(null); // {xp, combo, ok}
  const [shake, setShake] = React.useState(false);
  const q = qs[qi];

  // vibration mobile + feedback visuel
  function haptic(ok) {
    if (navigator.vibrate) { try { navigator.vibrate(ok ? [20] : [30, 40, 30]); } catch (e) {} }
  }

  function pick(opt) {
    if (picked != null) return;
    const correct = opt === q.answer;
    setPicked(opt);
    haptic(correct);
    const nc = correct ? combo + 1 : 0;
    setCombo(nc);
    const gainXp = correct ? 10 + Math.min(10, (nc - 1) * 2) : 0;
    if (correct) {
      setScore(function (s) { return s + gainXp; });
      setBurst({ xp: gainXp, combo: nc, ok: true });
      setTimeout(function () { setBurst(null); }, 900);
    } else {
      setShake(true);
      setTimeout(function () { setShake(false); }, 500);
    }
    const nr = results.concat([{ ar: q.ar, correct: correct }]);
    setResults(nr);
    setTimeout(function () {
      if (qi >= qs.length - 1) {
        const correctCount = nr.filter(function (r) { return r.correct; }).length;
        const scorePct = Math.round(correctCount / nr.length * 100);
        const xp = score + gainXp + (scorePct === 100 ? 20 : 0);
        onFinish({ xp: xp, correct: correctCount, total: nr.length, scorePct: scorePct, wordResults: nr });
      } else {
        setQi(qi + 1); setPicked(null);
      }
    }, correct ? 800 : 1400);
  }

  const promptArabic = q.kind !== 'fr2ar';
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '84px 20px 0', display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {/* burst XP au centre quand bonne réponse */}
      {burst && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 50, pointerEvents: 'none', textAlign: 'center', animation: 'cmpBurst 0.9s ease-out forwards' }}>
          <div style={{ fontSize: 64, fontWeight: 900, color: GREEN, textShadow: '0 0 30px rgba(74,222,128,0.8)' }}>+{burst.xp}</div>
          {burst.combo >= 2 && <div style={{ fontSize: 24, fontWeight: 900, color: GOLD, letterSpacing: 2 }}>🔥 COMBO x{burst.combo}</div>}
        </div>
      )}
      <style>{'@keyframes cmpBurst{0%{transform:translate(-50%,-30%) scale(0.5);opacity:0}20%{transform:translate(-50%,-50%) scale(1.15);opacity:1}80%{opacity:1}100%{transform:translate(-50%,-90%) scale(1);opacity:0}}@keyframes cmpShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-10px)}75%{transform:translateX(10px)}}@keyframes cmpPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}'}</style>

      {/* barre top */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'rgba(240,237,230,0.5)', fontSize: 20, cursor: 'pointer' }}>✕</button>
        <div style={{ flex: 1, height: 10, background: 'rgba(255,255,255,0.08)', borderRadius: 6, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: (qi / qs.length * 100) + '%', background: 'linear-gradient(90deg,#4ade80,#22a35a)', borderRadius: 6, transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)', boxShadow: '0 0 12px rgba(74,222,128,0.5)' }} />
        </div>
        {combo > 1 && (
          <span style={{ fontSize: 15, fontWeight: 900, color: GOLD, padding: '6px 12px', borderRadius: 999, background: 'rgba(230,200,74,0.14)', border: '1px solid rgba(230,200,74,0.4)', animation: 'cmpPulse 0.6s ease-in-out infinite' }}>🔥 x{combo}</span>
        )}
      </div>

      <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(240,237,230,0.5)', marginBottom: 18 }}>
        {q.kind === 'fr2ar' ? 'Quel mot arabe veut dire…' : 'Que veut dire ce mot ?'}
      </p>

      {/* prompt avec shake si faux */}
      <div style={{ textAlign: 'center', padding: '24px 20px', marginBottom: 26, background: 'linear-gradient(160deg,rgba(200,167,39,0.1),rgba(255,255,255,0.02))', border: '1px solid rgba(200,167,39,0.3)', borderRadius: 22, animation: shake ? 'cmpShake 0.4s ease-in-out' : 'none' }}>
        <span style={{ fontFamily: promptArabic ? 'Amiri,Georgia,serif' : 'Cormorant Garamond,serif', fontSize: promptArabic ? 56 : 34, fontStyle: promptArabic ? 'normal' : 'italic', color: '#f7eecb', direction: promptArabic ? 'rtl' : 'ltr', lineHeight: 1.2, display: 'block' }}>
          {promptArabic ? q.prompt : '« ' + q.prompt + ' »'}
        </span>
        {promptArabic && cmpPhon(q.prompt) && <div style={{ marginTop: 8, fontSize: 16, fontStyle: 'italic', color: 'rgba(240,237,230,0.6)', fontFamily: 'Plus Jakarta Sans,sans-serif' }}>{cmpPhon(q.prompt)}</div>}
      </div>

      {/* options */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {q.options.map(function (opt, i) {
          const isAns = opt === q.answer;
          const isPick = opt === picked;
          let bg = 'linear-gradient(160deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))', bd = 'rgba(200,167,39,0.28)', col = '#f0ede6', tf = 'scale(1)';
          if (picked != null) {
            if (isAns) { bg = 'rgba(74,222,128,0.18)'; bd = GREEN; col = '#eafff1'; tf = isPick ? 'scale(1.04)' : 'scale(1)'; }
            else if (isPick) { bg = 'rgba(232,101,74,0.18)'; bd = RED; col = '#ffe9e3'; tf = 'scale(0.96)'; }
            else { bg = 'rgba(255,255,255,0.02)'; bd = 'rgba(255,255,255,0.08)'; tf = 'scale(0.98)'; }
          }
          const optArabic = q.kind === 'fr2ar';
          return (
            <button key={i} onClick={function(){ pick(opt); }} disabled={picked != null}
              onMouseEnter={function(e){ if (picked == null) e.currentTarget.style.transform = 'scale(1.03)'; }}
              onMouseLeave={function(e){ if (picked == null) e.currentTarget.style.transform = 'scale(1)'; }}
              style={{ minHeight: 84, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, textAlign: 'center', padding: '14px', borderRadius: 18, background: bg, border: '2px solid ' + bd, color: col, cursor: picked != null ? 'default' : 'pointer', fontFamily: optArabic ? 'Amiri,Georgia,serif' : 'Plus Jakarta Sans,sans-serif', fontSize: optArabic ? 34 : 17, fontWeight: 700, direction: optArabic ? 'rtl' : 'ltr', transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)', position: 'relative', transform: tf, boxShadow: picked != null && isAns ? '0 0 24px rgba(74,222,128,0.4)' : 'none' }}>
              <span style={{ lineHeight: 1.1 }}>{opt}</span>
              {optArabic && cmpPhon(opt) && <span style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 13, fontStyle: 'italic', fontWeight: 500, color: 'rgba(240,237,230,0.5)', direction: 'ltr' }}>{cmpPhon(opt)}</span>}
              {picked != null && isAns && <span style={{ position: 'absolute', top: 6, right: 8, fontSize: 18, color: GREEN }}>✓</span>}
              {picked != null && isPick && !isAns && <span style={{ position: 'absolute', top: 6, right: 8, fontSize: 18, color: RED }}>✗</span>}
            </button>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ textAlign: 'center', padding: '20px 0 28px', fontSize: 14, color: 'rgba(240,237,230,0.4)' }}>
        Question {qi + 1} / {qs.length} · <span style={{ color: GOLD, fontWeight: 700 }}>{score} pts</span>
      </div>
    </div>
  );
}

// ── RÉSULTAT ──
function CmpResult({ res, sourate, st, pct, mastered, lvl, isPro, onReplay, onHub, onPro }) {
  const GOLD = '#e6c84a';
  const GREEN = '#4ade80';
  if (!res) { return <div style={{ padding: 100, textAlign: 'center', color: '#f0ede6' }}>—</div>; }
  const perfect = res.scorePct === 100;
  const newlyMastered = res.wordResults.filter(function (wr) { return wr.correct && (st.words[wr.ar] || 0) >= CMP_MASTER_THRESHOLD; });

  function share() {
    const txt = "Je viens de comprendre des versets du Coran mot à mot sur Héritage Musulman ! Je comprends déjà " + pct + "% des mots. 🌙";
    if (navigator.share) { navigator.share({ text: txt, url: 'https://heritage-musulman.com' }).catch(function(){}); }
    else if (navigator.clipboard) { navigator.clipboard.writeText(txt + ' heritage-musulman.com'); }
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '90px 20px 0', textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 10 }}>{perfect ? '🌟' : res.scorePct >= 60 ? '✨' : '📖'}</div>
      <h2 style={{ fontFamily: 'Cinzel,serif', fontWeight: 700, fontSize: 30, color: '#f0ede6', margin: '0 0 6px' }}>
        {perfect ? 'Parfait, mâ shâ Allah !' : res.scorePct >= 60 ? 'Bien joué !' : 'Continue, tu progresses'}
      </h2>
      <p style={{ fontSize: 15, color: 'rgba(240,237,230,0.55)', marginBottom: 28 }}>{sourate.name} · {res.correct}/{res.total} bonnes réponses</p>

      {/* gains */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ flex: 1, maxWidth: 150, background: 'rgba(200,167,39,0.1)', border: '1px solid rgba(200,167,39,0.3)', borderRadius: 18, padding: '18px 12px' }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: GOLD }}>+{res.xp}</div>
          <div style={{ fontSize: 12, color: 'rgba(240,237,230,0.5)' }}>XP gagnés</div>
        </div>
        <div style={{ flex: 1, maxWidth: 150, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: 18, padding: '18px 12px' }}>
          <div style={{ fontSize: 26, fontWeight: 900, color: GREEN }}>🔥 {st.streak || 0}</div>
          <div style={{ fontSize: 12, color: 'rgba(240,237,230,0.5)' }}>jours d'affilée</div>
        </div>
      </div>

      {/* jauge compréhension */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'linear-gradient(160deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))', border: '1px solid rgba(200,167,39,0.25)', borderRadius: 20, padding: '20px', marginBottom: 26 }}>
        <CmpRing pct={pct} size={84} stroke={9} color={GOLD}>
          <span style={{ fontSize: 22, fontWeight: 900, color: GOLD }}>{pct}%</span>
        </CmpRing>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 15, color: '#f0ede6', fontWeight: 700 }}>Tu comprends ≈ {pct}% des mots fréquents</div>
          <div style={{ fontSize: 13, color: 'rgba(240,237,230,0.5)' }}>{mastered} mots appris · niveau {lvl.title}</div>
        </div>
      </div>

      {/* Upsell au pic de dopamine — non-Pro uniquement */}
      {!isPro && (
        <button onClick={onPro} style={{ width: '100%', marginBottom: 14, padding: '18px 20px', background: 'linear-gradient(135deg,rgba(200,167,39,0.18),rgba(200,167,39,0.07))', border: '1px solid rgba(200,167,39,0.5)', borderRadius: 18, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 6px 28px rgba(200,167,39,0.15)' }}>
          <span style={{ fontSize: 28 }}>📖</span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 15, color: '#f0ede6', fontWeight: 800, marginBottom: 2 }}>Continue sur ta lancée</span>
            <span style={{ display: 'block', fontSize: 12.5, color: 'rgba(240,237,230,0.6)' }}>{CMP_SOURATES.filter(function(s){return !s.free;}).length} sourates de plus t'attendent — <span style={{ color: GOLD, fontWeight: 700 }}>{(window.HM_FOUNDER && window.HM_FOUNDER()) ? 'dès 3,99€' : '7,99€/mois'}</span></span>
          </span>
          <span style={{ color: GOLD, fontSize: 22 }}>›</span>
        </button>
      )}

      {/* actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={onReplay} style={{ padding: '16px', borderRadius: 16, border: 'none', background: 'linear-gradient(135deg,#c8a727,#a8891f)', color: '#1a1205', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>Rejouer cette sourate</button>
        <button onClick={share} style={{ padding: '14px', borderRadius: 16, border: '1px solid rgba(200,167,39,0.4)', background: 'rgba(200,167,39,0.08)', color: '#e6c84a', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>📤 Partager ma progression</button>
        <button onClick={onHub} style={{ padding: '12px', borderRadius: 16, border: 'none', background: 'none', color: 'rgba(240,237,230,0.5)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Retour au menu</button>
      </div>
    </div>
  );
}

// ── Section accueil : promo « Comprendre le Coran » ──
function ComprendreSection({ navigate }) {
  const GOLD = '#e6c84a';
  const demo = [ {ar:'بِسْمِ',fr:'Au nom de'}, {ar:'اللَّهِ',fr:'Allah'}, {ar:'الرَّحْمَٰنِ',fr:'le Tout-Miséricordieux'}, {ar:'الرَّحِيمِ',fr:'le Très-Miséricordieux'} ];
  return (
    <section style={{ padding: '80px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '10%', left: '-10%', width: 520, height: 520, background: 'radial-gradient(circle,rgba(200,167,39,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div className="reveal-scale" style={{ maxWidth: 880, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <p style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: GOLD, marginBottom: 14, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>◆ Nouveau · Comprendre le Coran</p>
        <h2 style={{ fontFamily: 'Cinzel,serif', fontWeight: 700, fontSize: 'clamp(26px,4.8vw,46px)', color: '#f0ede6', lineHeight: 1.18, margin: '0 0 16px' }}>
          Tu récites l'arabe…<br/><span style={{ color: GOLD }}>sans le comprendre ?</span>
        </h2>
        <p style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 'clamp(15px,1.9vw,18px)', color: 'rgba(240,237,230,0.55)', maxWidth: 560, margin: '0 auto 30px', lineHeight: 1.8 }}>
          Des millions de musulmans prient sans saisir les mots. Pourtant <strong style={{ color: '#f0ede6' }}>~50 mots suffisent à comprendre près de la moitié du Coran.</strong> Apprends-les, un verset à la fois.
        </p>

        {/* Aperçu mot-à-mot Al-Fâtiha */}
        <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row-reverse', justifyContent: 'center', gap: 12, maxWidth: 620, margin: '0 auto 34px' }}>
          {demo.map(function (w, i) {
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '14px 18px', borderRadius: 16, background: 'linear-gradient(160deg,rgba(200,167,39,0.1),rgba(255,255,255,0.02))', border: '1px solid rgba(200,167,39,0.3)' }}>
                <span style={{ fontFamily: 'Amiri,Georgia,serif', fontSize: 38, color: '#f7eecb', lineHeight: 1, direction: 'rtl' }}>{w.ar}</span>
                <span style={{ fontSize: 12, color: 'rgba(240,237,230,0.55)', fontStyle: 'italic', fontWeight: 500 }}>{cmpPhon(w.ar)}</span>
                <span style={{ fontSize: 13, color: GOLD, fontWeight: 600 }}>{w.fr}</span>
              </div>
            );
          })}
        </div>

        {/* 3 étapes */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap', marginBottom: 34 }}>
          {[['🎧','Écoute'],['💡','Comprends'],['🎮','Joue']].map(function (s, i) {
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>{s[0]}</span>
                <span style={{ fontFamily: 'Plus Jakarta Sans,sans-serif', fontSize: 15, fontWeight: 700, color: 'rgba(240,237,230,0.8)' }}>{s[1]}</span>
              </div>
            );
          })}
        </div>

        <button onClick={function(){ if (navigate) navigate('comprendre'); }} style={{ padding: '16px 40px', borderRadius: 100, border: 'none', background: 'linear-gradient(135deg,#c8a727,#a8891f)', color: '#1a1205', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans,sans-serif', boxShadow: '0 8px 30px rgba(200,167,39,0.35)' }}>
          Comprends le Coran →
        </button>
        <p style={{ fontSize: 12.5, color: 'rgba(240,237,230,0.4)', marginTop: 14, fontFamily: 'Plus Jakarta Sans,sans-serif' }}>Al-Fâtiha gratuite · sans inscription pour essayer</p>
      </div>
    </section>
  );
}

/* ─── App ─── */
function App() {
  const [page, setPage] = React.useState(function () {
    // Stripe redirect with ?payment=success
    if (new URLSearchParams(window.location.search).get('payment') === 'success') {
      window.history.replaceState(null, '', window.location.pathname);
      return 'payment-success';
    }
    const h = window.location.hash.slice(1);
    // Pages auth-only: ne pas restaurer depuis le hash sans session active
    const AUTH_PAGES = ['subscription', 'profile'];
    if (AUTH_PAGES.includes(h)) {
      window.history.replaceState(null, '', window.location.pathname);
      return 'home';
    }
    return h || 'home';
  });
  const [navKey, setNavKey] = React.useState(0);
  const [user, setUser] = React.useState(undefined);
  const [isPro, setIsPro] = React.useState(false);
  const [showAuth, setShowAuth] = React.useState(false);
  const [quickCheckoutMethod, setQuickCheckoutMethod] = React.useState(null);

  // navigate wrapper — scroll to top even if page doesn't change (ex: logo click depuis home)
  const navigate = React.useCallback(function(p) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setPage(p);
    setNavKey(function(k) { return k + 1; });
  }, []);

  // Write page to hash so refresh restores it + scroll to top on every navigation
  React.useEffect(function () {
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page, navKey]);

  // Handle browser back/forward
  React.useEffect(function () {
    function onHashChange() {
      const h = window.location.hash.slice(1);
      setPage(h || 'home');
    }
    window.addEventListener('hashchange', onHashChange);
    return function () {window.removeEventListener('hashchange', onHashChange);};
  }, []);

  useEffect(() => {
    const CLASSES = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-flip, .reveal-stagger, .reveal-stagger-alt, .reveal-blur, .reveal-zoom, .reveal-drop, .reveal-glow, .reveal-cards, .reveal-line';
    const seen = new WeakSet();

    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px' });

    function observeNew() {
      document.querySelectorAll(CLASSES).forEach((el) => {
        if (!seen.has(el)) { seen.add(el); revealObs.observe(el); }
      });
    }

    // Expose globally so navigation-back re-scan can call it
    window._revealScan = observeNew;

    observeNew();
    const t1 = setTimeout(observeNew, 150);
    const t2 = setTimeout(observeNew, 600);
    const t3 = setTimeout(observeNew, 1500);

    // Smart fallback: every 200ms reveal elements currently visible in viewport
    function revealVisible() {
      const vh = window.innerHeight + 60;
      document.querySelectorAll(CLASSES).forEach((el) => {
        if (!el.classList.contains('visible')) {
          const r = el.getBoundingClientRect();
          if (r.top < vh && r.bottom > -60) el.classList.add('visible');
        }
      });
    }
    const poll = setInterval(revealVisible, 200);
    const stopPoll = setTimeout(() => clearInterval(poll), 8000);
    document.addEventListener('visibilitychange', revealVisible);

    // Counter observer
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = el.dataset.target;
        const isFloat = target.includes('.');
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const numTarget = parseFloat(target.replace(',', '.'));
        const duration = 1600;
        const start = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = numTarget * eased;
          if (isFloat) {
            el.textContent = prefix + value.toFixed(1).replace('.', ',') + suffix;
          } else {
            el.textContent = prefix + Math.round(value).toLocaleString('fr') + suffix;
          }
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-counter]').forEach((el) => counterObs.observe(el));

    return () => { revealObs.disconnect(); counterObs.disconnect(); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(poll); clearTimeout(stopPoll); document.removeEventListener('visibilitychange', revealVisible); };
  }, []);

  // Re-trigger reveal when navigating back to home (new DOM elements after page switch)
  React.useEffect(() => {
    if (page !== 'home') return;
    const CLASSES = '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-flip, .reveal-stagger, .reveal-stagger-alt, .reveal-blur, .reveal-zoom, .reveal-drop, .reveal-glow, .reveal-cards, .reveal-line';
    function forceRevealInViewport() {
      const vh = window.innerHeight + 60;
      document.querySelectorAll(CLASSES).forEach((el) => {
        if (!el.classList.contains('visible')) {
          const r = el.getBoundingClientRect();
          if (r.top < vh && r.bottom > -60) el.classList.add('visible');
        }
      });
    }
    // Scan new elements into observer + force-reveal anything already visible
    const t1 = setTimeout(() => { if (window._revealScan) window._revealScan(); forceRevealInViewport(); }, 50);
    const t2 = setTimeout(() => { if (window._revealScan) window._revealScan(); forceRevealInViewport(); }, 200);
    const t3 = setTimeout(() => { if (window._revealScan) window._revealScan(); forceRevealInViewport(); }, 500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [page]);

  React.useEffect(() => {
    if (!window._auth) { setUser(null); return; }
    const unsub = window._auth.onAuthStateChanged(u => setUser(u || null));
    return unsub;
  }, []);

  // Écoute statut Pro depuis Firestore
  React.useEffect(function() {
    if (!user || !window._db) { setIsPro(false); return; }
    var unsub = window._db.collection('users').doc(user.uid)
      .onSnapshot(function(doc) {
        setIsPro(doc.exists && doc.data().isPro === true);
      }, function() { setIsPro(false); });
    return unsub;
  }, [user]);

  const authCtx = {
    user,
    isPro,
    logout: () => window._auth && window._auth.signOut(),
    openAuth: () => setShowAuth(true),
    openQuickCheckout: (method) => setQuickCheckoutMethod(method || 'card'),
    onAuthSuccess: () => {
      setShowAuth(false);
    }
  };

  const wrap = (children) => (
    <AuthContext.Provider value={authCtx}>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {quickCheckoutMethod && <QuickCheckoutModal initialMethod={quickCheckoutMethod} onClose={() => setQuickCheckoutMethod(null)} />}
      {children}
      <RgpdBanner />
    </AuthContext.Provider>
  );

  if (page === 'blind-test') return wrap(<BlindTestPage navigate={navigate} />);
  if (page === 'quiz') return wrap(<QuizPage navigate={navigate} />);
  if (page.startsWith('quiz-')) {
    const rest = page.slice(5);
    const levels = ['debutant', 'amateur', 'avance'];
    const lv = levels.find((l) => rest.endsWith('-' + l));
    if (lv) {
      const ck = rest.slice(0, rest.length - lv.length - 1);
      return wrap(<QuizCategoryPage catKey={ck} level={lv} navigate={navigate} />);
    }
    return wrap(<QuizCategoryPage catKey={rest} level="debutant" navigate={navigate} />);
  }
  if (page === 'studio') return wrap(<VideoCreatorPage navigate={navigate} />);
  if (page === 'comprendre') return wrap(<ComprendrePage navigate={navigate} />);
  if (page === 'start') return wrap(<StartPage navigate={navigate} />);
  if (page === 'subscription') return wrap(<><Navbar navigate={navigate} /><SubscriptionPage navigate={navigate} /></>);
  if (page === 'payment-success') return wrap(<PaymentSuccessPage navigate={navigate} />);
  if (page === 'profile') return wrap(<><Navbar navigate={navigate} /><ProfilePage navigate={navigate} /></>);
  if (page === 'mentions-legales') return wrap(<MentionsLegalesPage navigate={navigate} />);
  if (page === 'cgu') return wrap(<CGVPage navigate={navigate} />);
  if (page === 'confidentialite') return wrap(<PolitiqueConfidentialitePage navigate={navigate} />);

  if (page !== 'home') return wrap(<NotFoundPage navigate={navigate} />);

  return wrap(
    <>
      <Navbar navigate={navigate} />
      <main>
        <Hero navigate={navigate} />
        <ReassuranceBanner />
        <ComprendreSection navigate={navigate} />
        <FeatureCards navigate={navigate} />
        <HowItWorksSection />
        <LearnPlaySection navigate={navigate} />
        <ImportanceSection />

        <ComparisonTable navigate={navigate} />
        <ParcoursSection />
        <Testimonials />
        <StatsBar />
        <FaqSection />
        <SoftPaywall navigate={navigate} />
      </main>
      <Footer navigate={navigate} />
      <StickyUpgradeBanner navigate={navigate} />
      <ExitIntentPopup navigate={navigate} />
    </>
  );

}

// ── Attribution UTM — capture la 1ère source (TikTok/IG/etc.) en localStorage ──
(function () {
  try {
    var qs = new URLSearchParams(window.location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    var found = {};
    var has = false;
    keys.forEach(function (k) { var v = qs.get(k); if (v) { found[k] = v; has = true; } });
    if (has && !localStorage.getItem('hm_attribution')) {
      found.first_seen = new Date().toISOString();
      found.landing = window.location.pathname + window.location.hash;
      localStorage.setItem('hm_attribution', JSON.stringify(found));
    }
  } catch (e) {}
})();

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
// Hide loading screen once React is mounted
requestAnimationFrame(() => {
  const loader = document.getElementById('app-loading');
  if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 500); }
});
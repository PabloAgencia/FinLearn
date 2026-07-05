// ═══ SUPABASE — Auth + Cloud Sync ═══
const SUPABASE_URL  = 'https://qurxeuqoprcjstipvfcb.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cnhldXFvcHJjanN0aXB2ZmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MjcwMTMsImV4cCI6MjA5MTUwMzAxM30.h1wUJzYM2J_bgezlb9zRa456ezDA81LNcAExp3ILLL8';

// Cliente Supabase (cargado desde CDN en index.html)
let _sb = null;
function getSB() {
  if (!_sb) _sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  return _sb;
}

// Usuario autenticado actual
let _sbUser = null;
function getSBUser() { return _sbUser; }

// ── AUTH ──────────────────────────────────────────────────────────

async function sbSignUp(email, password) {
  const { data, error } = await getSB().auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

async function sbSignIn(email, password) {
  const { data, error } = await getSB().auth.signInWithPassword({ email, password });
  if (error) throw error;
  _sbUser = data.user;
  return data;
}

async function sbSignInGoogle() {
  const { error } = await getSB().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  });
  if (error) throw error;
}

async function sbSignOut() {
  await getSB().auth.signOut();
  _sbUser = null;
}

// ── CLOUD SYNC ────────────────────────────────────────────────────

// Guarda el estado S en Supabase (tabla user_state)
async function sbSaveState() {
  if (!_sbUser) return;
  try {
    const toSave = { ...S };
    delete toSave.currentMod;
    toSave.currentModId = S.currentMod ? S.currentMod.id : null;
    const { error } = await getSB()
      .from('user_state')
      .upsert({ user_id: _sbUser.id, state: toSave, updated_at: new Date().toISOString() },
               { onConflict: 'user_id' });
    if (error) console.warn('[SB] saveState error:', error.message);
  } catch(e) { console.warn('[SB] saveState exception:', e); }
}

// Carga el estado S desde Supabase
async function sbLoadState() {
  if (!_sbUser) return false;
  try {
    const { data, error } = await getSB()
      .from('user_state')
      .select('state')
      .eq('user_id', _sbUser.id)
      .single();
    if (error || !data) return false;
    const saved = data.state;
    Object.assign(S, DEFAULTS, saved);
    if (!Array.isArray(S.completedMods)) S.completedMods = [];
    S.completedMods = S.completedMods.filter(id => typeof id === 'number' && id >= 0 && id <= 999);
    if (!Array.isArray(S.viralMilestones)) S.viralMilestones = [];
    if (!Array.isArray(S.lifeEvents))      S.lifeEvents      = [];
    if (!Array.isArray(S.careerChanges))   S.careerChanges   = [];
    S.xp      = Math.max(0, parseInt(S.xp)       || 0);
    S.streak  = Math.max(0, parseInt(S.streak)    || 0);
    S.level   = Math.max(1, parseInt(S.level)     || 1);
    S.cash    = Math.max(0, parseFloat(S.cash)    || 0);
    S.invested= Math.max(0, parseFloat(S.invested)|| 0);
    if (!S.monthlyIncome) S.monthlyIncome = S.lifeSalary || S.income || 0;
    S.monthlyContribution = Math.max(0, parseFloat(S.monthlyContribution) || 200);
    S.patrimony = Math.max(0, parseFloat(S.patrimony) || 0);
    if (!S.patrimony && (S.cash || S.invested)) S.patrimony = recalcPatrimony();
    if (saved.currentModId != null)
      S.currentMod = MODULES.find(m => m && m.id === saved.currentModId) || null;
    if (typeof _applyDailyRollover === 'function') _applyDailyRollover();
    return true;
  } catch(e) { console.warn('[SB] loadState exception:', e); return false; }
}

// ── INIT: detectar sesión activa al arrancar ──────────────────────
async function sbInit() {
  const { data: { session } } = await getSB().auth.getSession();
  if (session?.user) {
    _sbUser = session.user;
    return true;
  }
  // Escuchar cambios de sesión (OAuth redirect)
  getSB().auth.onAuthStateChange((_event, session) => {
    _sbUser = session?.user || null;
  });
  return false;
}

// ── MODAL DE AUTH ─────────────────────────────────────────────────
function sbHandleAccountBtn() {
  const user = getSBUser();
  if (!user) { sbShowAuthModal('login'); return; }
  // Ya logueado — mostrar mini menú
  let menu = document.getElementById('sb-account-menu');
  if (menu) { menu.remove(); return; }
  menu = document.createElement('div');
  menu.id = 'sb-account-menu';
  menu.style.cssText = 'position:fixed;top:60px;right:16px;z-index:9999;background:#0d1220;border:1px solid rgba(255,255,255,0.15);border-radius:12px;padding:12px 16px;min-width:200px;box-shadow:0 8px 32px rgba(0,0,0,.8);';
  menu.innerHTML = `
    <div style="font-size:12px;color:var(--text2);margin-bottom:8px;word-break:break-all;">✅ ${user.email}</div>
    <button onclick="sbSignOut().then(()=>{location.reload();})"
      style="width:100%;padding:8px;border-radius:8px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);color:#ef4444;font-size:13px;cursor:pointer;font-weight:600;">
      Cerrar sesión
    </button>`;
  document.body.appendChild(menu);
  setTimeout(() => document.addEventListener('click', function h(e) {
    if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener('click', h); }
  }), 100);
}
window.sbHandleAccountBtn = sbHandleAccountBtn;

function sbShowAuthModal(mode = 'login') {
  let modal = document.getElementById('m-auth');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-auth';
    modal.className = 'modal-overlay';
    modal.style.cssText = 'display:flex;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.85);align-items:center;justify-content:center;padding:16px;';
    document.body.appendChild(modal);
  }
  const isLogin = mode === 'login';
  modal.innerHTML = `
    <div style="background:var(--card);border:1px solid var(--border);border-radius:20px;padding:28px 24px;max-width:380px;width:100%;position:relative;">
      <button onclick="document.getElementById('m-auth').style.display='none'"
        style="position:absolute;top:12px;right:12px;background:transparent;border:none;color:var(--text2);font-size:20px;cursor:pointer;">✕</button>
      <div style="font-size:28px;text-align:center;margin-bottom:8px;">${isLogin ? '👋' : '🚀'}</div>
      <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:20px;text-align:center;color:var(--text1);margin-bottom:4px;">
        ${isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}
      </div>
      <div style="font-size:13px;color:var(--text2);text-align:center;margin-bottom:20px;">
        ${isLogin ? 'Tu progreso se cargará automáticamente' : 'Tu progreso se guardará en la nube'}
      </div>
      <div id="auth-error" style="display:none;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);border-radius:8px;padding:8px 12px;font-size:13px;color:#ef4444;margin-bottom:12px;"></div>
      <input id="auth-email" type="email" placeholder="tu@email.com"
        style="width:100%;padding:12px 14px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text1);font-size:14px;box-sizing:border-box;margin-bottom:10px;">
      <input id="auth-pass" type="password" placeholder="Contraseña (mín. 6 caracteres)"
        style="width:100%;padding:12px 14px;border-radius:10px;border:1px solid var(--border);background:var(--surface);color:var(--text1);font-size:14px;box-sizing:border-box;margin-bottom:16px;">
      <button onclick="sbHandleAuth('${mode}')"
        style="width:100%;padding:14px;border-radius:12px;background:var(--accent);border:none;color:#000;font-weight:800;font-size:15px;cursor:pointer;margin-bottom:10px;">
        ${isLogin ? 'Entrar' : 'Crear cuenta'}
      </button>
      <button onclick="sbSignInGoogle()"
        style="width:100%;padding:12px;border-radius:12px;background:var(--surface);border:1px solid var(--border);color:var(--text1);font-weight:600;font-size:14px;cursor:pointer;margin-bottom:14px;">
        🔵 Continuar con Google
      </button>
      <div style="text-align:center;font-size:13px;color:var(--text2);">
        ${isLogin
          ? `¿Sin cuenta? <span style="color:var(--accent);cursor:pointer;" onclick="sbShowAuthModal('register')">Crear cuenta</span>`
          : `¿Ya tienes cuenta? <span style="color:var(--accent);cursor:pointer;" onclick="sbShowAuthModal('login')">Entrar</span>`}
      </div>
      <div style="text-align:center;font-size:11px;color:var(--text3);margin-top:12px;">🔒 Tus datos nunca se comparten</div>
    </div>`;
  modal.style.display = 'flex';
}

async function sbHandleAuth(mode) {
  const email = document.getElementById('auth-email')?.value?.trim();
  const pass  = document.getElementById('auth-pass')?.value;
  const errEl = document.getElementById('auth-error');
  if (!email || !pass) { if(errEl){errEl.textContent='Rellena email y contraseña';errEl.style.display='block';} return; }
  const btn = document.querySelector('#m-auth button');
  try {
    if (mode === 'register') { await sbSignUp(email, pass); await sbSignIn(email, pass); }
    else await sbSignIn(email, pass);
    document.getElementById('m-auth').style.display = 'none';
    if (typeof _calcGateRemove === 'function') _calcGateRemove();
    const hasCloud = await sbLoadState();
    if (!hasCloud && S.userName) await sbSaveState();
    if (S.userName) {
      showScreen('s-home');
      document.getElementById('bottom-nav')?.classList?.remove('hidden');
      renderHomeScreen();
      toast('☁️ Sesión iniciada', 'Tu progreso está sincronizado', 't-success');
    } else {
      showScreen('s-onboard');
    }
  } catch(e) {
    if(errEl){ errEl.textContent = e.message || 'Error al autenticar'; errEl.style.display='block'; }
  }
}

// ── PREMIUM SYNC ──────────────────────────────────────────────────

// Guarda el estado premium en Supabase (dentro de user_state)
async function sbSetPremium(isPrem) {
  if (!_sbUser) return;
  try {
    await getSB()
      .from('user_state')
      .upsert({ user_id: _sbUser.id, state: { ...((await sbGetStateRaw()) || {}), _premium: isPrem ? '1' : '0' }, updated_at: new Date().toISOString() },
               { onConflict: 'user_id' });
  } catch(e) { console.warn('[SB] setPremium error:', e); }
}

// Lee el estado premium desde Supabase
async function sbGetPremium() {
  if (!_sbUser) return false;
  try {
    const { data } = await getSB()
      .from('user_state')
      .select('state')
      .eq('user_id', _sbUser.id)
      .single();
    return data?.state?._premium === '1';
  } catch(e) { return false; }
}

// Helper interno para leer el state actual sin parsear todo
async function sbGetStateRaw() {
  try {
    const { data } = await getSB()
      .from('user_state')
      .select('state')
      .eq('user_id', _sbUser.id)
      .single();
    return data?.state || {};
  } catch(e) { return {}; }
}

window.sbSetPremium  = sbSetPremium;
window.sbGetPremium  = sbGetPremium;

window.sbShowAuthModal  = sbShowAuthModal;
window.sbHandleAuth     = sbHandleAuth;
window.sbSignInGoogle   = sbSignInGoogle;
window.sbSignOut        = sbSignOut;
window.sbSaveState      = sbSaveState;
window.sbLoadState      = sbLoadState;
window.sbInit           = sbInit;
window.getSBUser        = getSBUser;

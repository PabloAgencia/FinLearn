/* ═══ app-calc-gate.js — Auth gate para calculadoras ═══
   Patrón: calcula primero, muestra parcial, pide registro.
   El visitante ve los primeros resultados → formulario inline → al registrarse se desvela todo.
═══════════════════════════════════════════════════════ */

var _cgMode = 'register';
var _cgCurrentResult = null;

/* ── Punto de entrada — llamado al final de cada T{N}_calc ── */
function _calcGate(resultId, toolName, emoji) {
  if (typeof getSBUser === 'function' && getSBUser()) return; // ya autenticado
  var el = document.getElementById(resultId);
  if (!el) return;
  if (!el.innerHTML.trim() || el.classList.contains('hidden')) return;
  if (document.getElementById('calc-gate-panel')) return; // ya activo

  _cgCurrentResult = resultId;
  _cgMode = 'register';

  // Recortar resultado → preview parcial
  el.style.maxHeight = '165px';
  el.style.overflow  = 'hidden';
  el.dataset.gated   = '1';

  // Inyectar panel de conversión justo después del resultado
  var panel = document.createElement('div');
  panel.id        = 'calc-gate-panel';
  panel.className = 'calc-gate-panel';
  panel.innerHTML = _cgPanelHTML(toolName || 'esta calculadora', emoji || '📊');
  el.parentNode.insertBefore(panel, el.nextSibling);

  // Scroll suave al panel
  setTimeout(function() {
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 150);
}

/* ── HTML del panel de conversión ── */
function _cgPanelHTML(toolName, emoji) {
  return '<div class="cg-fade-bar"></div>'
    + '<div class="cg-card">'
    +   '<div class="cg-card-head">'
    +     '<div class="cg-icon">' + emoji + '</div>'
    +     '<div>'
    +       '<div class="cg-title">Análisis completo de ' + toolName + '</div>'
    +       '<div class="cg-sub">Crea tu cuenta gratuita — gratis para siempre</div>'
    +     '</div>'
    +   '</div>'
    +   '<ul class="cg-perks">'
    +     '<li>✓ Desglose detallado y gráficas completas</li>'
    +     '<li>✓ Guarda y compara simulaciones</li>'
    +     '<li>✓ Historial de cálculos en el tiempo</li>'
    +     '<li>✓ Sincroniza en todos tus dispositivos</li>'
    +   '</ul>'
    +   '<div id="cg-form-inner">' + _cgFormHTML('register') + '</div>'
    + '</div>';
}

function _cgFormHTML(mode) {
  var isReg = mode === 'register';
  return '<input type="email" id="cg-email" class="cg-input" placeholder="tu@email.com" autocomplete="email">'
    + '<input type="password" id="cg-pass" class="cg-input" placeholder="'
    +   (isReg ? 'Contraseña (mín. 6 caracteres)' : 'Tu contraseña')
    +   '" autocomplete="' + (isReg ? 'new-password' : 'current-password') + '">'
    + '<div id="cg-error" class="cg-error" style="display:none;"></div>'
    + '<button class="cg-btn-primary" id="cg-btn-main" onclick="_cgSubmit()">'
    +   (isReg ? 'Crear cuenta gratuita →' : 'Iniciar sesión →')
    + '</button>'
    + '<div class="cg-divider"><span>o</span></div>'
    + '<button class="cg-btn-google" onclick="_cgGoogle()">'
    +   '<svg viewBox="0 0 24 24" width="16" height="16" style="margin-right:6px;flex-shrink:0;">'
    +     '<path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>'
    +     '<path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>'
    +     '<path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>'
    +     '<path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>'
    +   '</svg>'
    +   'Continuar con Google'
    + '</button>'
    + '<div class="cg-login-row">'
    +   (isReg
      ? '¿Ya tienes cuenta? <button class="cg-link-btn" onclick="_cgToggle()">Iniciar sesión</button>'
      : '¿Sin cuenta? <button class="cg-link-btn" onclick="_cgToggle()">Crear cuenta gratis</button>')
    + '</div>';
}

/* ── Toggle login ↔ register ── */
function _cgToggle() {
  _cgMode = _cgMode === 'register' ? 'login' : 'register';
  var inner = document.getElementById('cg-form-inner');
  if (inner) inner.innerHTML = _cgFormHTML(_cgMode);
}

/* ── Submit del formulario inline ── */
async function _cgSubmit() {
  var email = (document.getElementById('cg-email')?.value || '').trim();
  var pass  = document.getElementById('cg-pass')?.value || '';
  var btn   = document.getElementById('cg-btn-main');

  if (!email || !email.includes('@')) { _cgError('Introduce un email válido.'); return; }
  if (!pass || pass.length < 6)       { _cgError('La contraseña debe tener al menos 6 caracteres.'); return; }

  if (btn) { btn.disabled = true; btn.textContent = '⏳ Cargando...'; }
  var errEl = document.getElementById('cg-error');
  if (errEl) errEl.style.display = 'none';

  try {
    if (_cgMode === 'register') {
      await sbSignUp(email, pass);
      await sbSignIn(email, pass); // asegura que _sbUser quede establecido
    } else {
      await sbSignIn(email, pass);
    }
    _cgOnSuccess();
  } catch(e) {
    var msg = e.message || 'Error de autenticación';
    if (msg.includes('already registered') || msg.includes('User already registered')) {
      msg = 'Este email ya está registrado. Iniciando sesión...';
      _cgMode = 'login';
      var inner = document.getElementById('cg-form-inner');
      if (inner) {
        inner.innerHTML = _cgFormHTML('login');
        var emailInput = document.getElementById('cg-email');
        if (emailInput) emailInput.value = email;
      }
    }
    if (msg.includes('Invalid login credentials')) msg = 'Email o contraseña incorrectos.';
    if (msg.includes('Email not confirmed'))       msg = 'Revisa tu email y confirma tu cuenta.';
    _cgError(msg);
  }
}

/* ── Google OAuth ── */
async function _cgGoogle() {
  try {
    await sbSignInGoogle();
    // OAuth redirige — al volver sbInit detecta la sesión
  } catch(e) {
    _cgError('Error al conectar con Google. Inténtalo de nuevo.');
  }
}

/* ── Mostrar error en el formulario ── */
function _cgError(msg) {
  var errEl = document.getElementById('cg-error');
  if (errEl) { errEl.textContent = msg; errEl.style.display = 'block'; }
  var btn = document.getElementById('cg-btn-main');
  if (btn) { btn.disabled = false; btn.textContent = _cgMode === 'register' ? 'Crear cuenta gratuita →' : 'Iniciar sesión →'; }
}

/* ── Callback tras auth exitosa ── */
async function _cgOnSuccess() {
  try {
    if (!getSBUser()) {
      const { data: { session } } = await getSB().auth.getSession();
      if (session?.user) window._sbUser = session.user;
    }
    var hasCloud = await sbLoadState();
    if (!hasCloud && typeof S !== 'undefined' && S.userName) await sbSaveState();
    _calcGateRemove();
    if (typeof updateUIFromState === 'function') updateUIFromState();
    if (typeof showToast === 'function') showToast('✅ Análisis completo desbloqueado');
  } catch(e) {
    _calcGateRemove();
    if (typeof showToast === 'function') showToast('✅ Sesión iniciada');
  }
}

/* ── Eliminar el gate y revelar el resultado ── */
function _calcGateRemove() {
  var panel = document.getElementById('calc-gate-panel');
  if (panel) panel.remove();

  if (_cgCurrentResult) {
    var el = document.getElementById(_cgCurrentResult);
    if (el && el.dataset.gated) {
      el.style.maxHeight = '';
      el.style.overflow  = '';
      delete el.dataset.gated;
    }
    _cgCurrentResult = null;
  }
  _cgMode = 'register';
}

window._calcGate       = _calcGate;
window._calcGateRemove = _calcGateRemove;
window._cgSubmit       = _cgSubmit;
window._cgGoogle       = _cgGoogle;
window._cgToggle       = _cgToggle;

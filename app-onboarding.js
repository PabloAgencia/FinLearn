/* ═══ app-onboarding.js — Test de personalidad + referidos ══════
   Gestiona el quiz de 4 preguntas del onboarding y la detección
   de códigos de referido en la URL.
══════════════════════════════════════════════════════════════════ */

var _OB_PROFILES = {
  freedom_zero: {
    icon: '🧭', color: '#00e5a0',
    name: 'Explorador hacia la Libertad',
    desc: 'Empezarás desde los fundamentos y construirás tu camino hacia la independencia financiera paso a paso.'
  },
  freedom_advanced: {
    icon: '📈', color: '#ffd700',
    name: 'Inversor Ambicioso',
    desc: 'Tienes base. Aprenderás a optimizar tu cartera y acelerar tu libertad financiera con estrategias avanzadas.'
  },
  debt: {
    icon: '💪', color: '#ff6b9d',
    name: 'Liberador de Deudas',
    desc: 'Salir de deudas es el primer gran paso hacia la riqueza. Aprenderás la estrategia más eficiente para lograrlo.'
  },
  invest: {
    icon: '📊', color: '#4ecdc4',
    name: 'Inversor en Formación',
    desc: 'Harás que tu dinero trabaje para ti. Mercados, ETFs, estrategias de largo plazo — todo paso a paso.'
  },
  house: {
    icon: '🏠', color: '#74b9ff',
    name: 'Arquitecto de Sueños',
    desc: 'Aprenderás a ahorrar para la entrada, negociar hipotecas y llegar antes a tu meta.'
  },
  retire: {
    icon: '🌅', color: '#a29bfe',
    name: 'Constructor del Futuro',
    desc: 'El tiempo es tu mayor aliado. Aprenderás a construir un plan de pensiones que realmente funcione.'
  },
  emergency: {
    icon: '🛡️', color: '#55efc4',
    name: 'Guardián del Capital',
    desc: 'Construirás tu colchón financiero y nunca más dependerás de créditos en momentos de crisis.'
  },
  default: {
    icon: '🌱', color: '#00e5a0',
    name: 'Explorador Financiero',
    desc: 'Aprenderás desde los fundamentos hasta estrategias avanzadas a tu propio ritmo.'
  }
};

function _obGetProfileKey() {
  var goal  = S.goal || 'default';
  var level = S.investorLevel || 'zero';
  if (goal === 'debt')      return 'debt';
  if (goal === 'invest')    return 'invest';
  if (goal === 'house')     return 'house';
  if (goal === 'retire')    return 'retire';
  if (goal === 'emergency') return 'emergency';
  if (goal === 'freedom' && (level === 'investing' || level === 'active')) return 'freedom_advanced';
  if (goal === 'freedom')   return 'freedom_zero';
  return 'default';
}

function _obLevelSelect(level, el) {
  S.investorLevel = level;
  document.querySelectorAll('.ob-level-card').forEach(function(c) { c.classList.remove('selected'); });
  if (el) el.classList.add('selected');
  setTimeout(function() { if (typeof obNext === 'function') obNext(4); }, 280);
}

function _obTimeSelect(minutes, el) {
  S.dailyGoalMinutes = minutes;
  document.querySelectorAll('.ob-time-card').forEach(function(c) { c.classList.remove('ob-tc-selected'); });
  if (el) el.classList.add('ob-tc-selected');
  setTimeout(function() {
    _obShowProfile();
    if (typeof obNext === 'function') obNext(5);
  }, 280);
}

function _obShowProfile() {
  var key     = _obGetProfileKey();
  var profile = _OB_PROFILES[key] || _OB_PROFILES['default'];
  var el      = document.getElementById('ob-profile-reveal');
  if (!el) return;

  S.financialProfile = key;

  el.innerHTML = '<div style="text-align:center;margin:8px 0 16px;">'
    + '<div style="font-size:64px;margin-bottom:8px;line-height:1;">' + profile.icon + '</div>'
    + '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--text3);margin-bottom:6px;">Tu perfil financiero</div>'
    + '<div style="font-size:22px;font-weight:900;color:' + profile.color + ';margin-bottom:10px;">' + profile.name + '</div>'
    + '<div style="font-size:14px;color:var(--text2);line-height:1.65;">' + profile.desc + '</div>'
    + '</div>';
}

function _applyPendingReferral() {
  var pendingRef = sessionStorage.getItem('fl_pending_ref');
  if (pendingRef && !S.referralUsed) {
    S.xp = (S.xp || 0) + 500;
    S.referralUsed = true;
    sessionStorage.removeItem('fl_pending_ref');
    if (typeof F34_onXPGained === 'function') F34_onXPGained(500);
    setTimeout(function() {
      if (typeof toast === 'function') {
        toast('🎁 Bonus de bienvenida', '+500 XP extra de regalo de tu amigo. ¡Buen comienzo!', 't-success');
      }
      if (typeof spawnXP === 'function') spawnXP('+500 XP 🎁');
    }, 2000);
  }
}

// Detect referral code in URL immediately on script load
(function() {
  try {
    var params = new URLSearchParams(location.search);
    var ref = params.get('ref');
    if (ref && !S.referralUsed) {
      sessionStorage.setItem('fl_pending_ref', ref);
    }
  } catch(e) {}
}());

window._obLevelSelect        = _obLevelSelect;
window._obTimeSelect         = _obTimeSelect;
window._obShowProfile        = _obShowProfile;
window._applyPendingReferral = _applyPendingReferral;

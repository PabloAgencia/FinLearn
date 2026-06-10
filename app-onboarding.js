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
  var pendingRef = localStorage.getItem('fl_pending_ref');
  if (pendingRef && !S.referralUsed) {
    S.xp = (S.xp || 0) + 500;
    S.referralUsed = true;
    localStorage.removeItem('fl_pending_ref');
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
    if (ref && typeof S !== 'undefined' && !S.referralUsed) {
      localStorage.setItem('fl_pending_ref', ref);
    }
  } catch(e) {}
}());

window._obLevelSelect        = _obLevelSelect;
window._obTimeSelect         = _obTimeSelect;
window._obShowProfile        = _obShowProfile;
window._applyPendingReferral = _applyPendingReferral;

/* ──────────────────────────────────────────────────────────────
   ONBOARDING MICRO-QUIZ — 3 preguntas que detectan el nivel
────────────────────────────────────────────────────────────── */

var _OB_QUIZ = [
  {
    q: '¿Qué es un fondo de emergencia?',
    opts: [
      'Un fondo especial del banco para vacaciones',
      '3-6 meses de gastos esenciales en una cuenta accesible',
      'Un seguro de vida complementario',
      'Una cuenta de pensiones privada'
    ],
    correct: 1,
    exp: 'El fondo de emergencia cubre 3-6 meses de gastos en liquidez. Es lo primero que hay que construir antes de invertir.'
  },
  {
    q: '¿Qué es un ETF?',
    opts: [
      'Un tipo de seguro de vida con rentabilidad garantizada',
      'Un depósito a plazo fijo de alta rentabilidad',
      'Un fondo que replica un índice como el S&P 500',
      'Un préstamo entre particulares'
    ],
    correct: 2,
    exp: 'Un ETF (Exchange Traded Fund) replica un índice bursátil. Se compra en bolsa como una acción y tiene comisiones muy bajas.'
  },
  {
    q: '¿Cuánto tiempo mínimo se recomienda tener dinero invertido en bolsa?',
    opts: [
      '6-12 meses para aprovechar la volatilidad',
      '2-3 años según el mercado',
      '5-10 años o más para reducir el riesgo',
      'Solo cuando la bolsa está en mínimos'
    ],
    correct: 2,
    exp: 'A corto plazo la bolsa es volátil. A 10+ años, históricamente siempre ha generado rentabilidad positiva. El tiempo es tu mejor aliado.'
  }
];

var _obQuizIdx   = 0;
var _obQuizScore = 0;
var _obQuizLocked = false;

function _obQuizInit() {
  _obQuizIdx   = 0;
  _obQuizScore = 0;
  _obQuizLocked = false;
  _obQuizRender();
}

function _obQuizRender() {
  var wrap = document.getElementById('ob-quiz-wrap');
  if (!wrap) return;

  if (_obQuizIdx >= _OB_QUIZ.length) {
    _obQuizFinish();
    return;
  }

  var q = _OB_QUIZ[_obQuizIdx];
  var dots = _OB_QUIZ.map(function(_, i) {
    var bg = i < _obQuizIdx ? 'var(--accent)' : i === _obQuizIdx ? '#fff' : 'rgba(255,255,255,.2)';
    return '<span style="width:8px;height:8px;border-radius:50%;display:inline-block;margin:0 3px;background:' + bg + ';transition:background .3s;"></span>';
  }).join('');

  wrap.innerHTML =
    '<div style="text-align:center;margin-bottom:14px;">' + dots + '</div>'
    + '<div style="font-size:10px;font-weight:700;letter-spacing:.1em;color:var(--text3);margin-bottom:8px;text-transform:uppercase;">Pregunta ' + (_obQuizIdx + 1) + ' de ' + _OB_QUIZ.length + '</div>'
    + '<div style="font-size:16px;font-weight:700;color:#fff;margin-bottom:18px;line-height:1.5;">' + q.q + '</div>'
    + q.opts.map(function(opt, i) {
        return '<div class="ob-quiz-opt" id="ob-qo-' + i + '" onclick="_obQuizAnswer(' + i + ')" '
          + 'style="background:rgba(255,255,255,.06);border:1.5px solid rgba(255,255,255,.1);border-radius:14px;'
          + 'padding:13px 16px;margin-bottom:10px;text-align:left;cursor:pointer;font-size:14px;'
          + 'color:var(--text1);transition:all .2s;user-select:none;">'
          + '<span style="font-weight:700;color:var(--text3);margin-right:8px;">' + String.fromCharCode(65 + i) + '.</span>' + opt
          + '</div>';
      }).join('');
}

function _obQuizAnswer(chosen) {
  if (_obQuizLocked) return;
  _obQuizLocked = true;

  var q = _OB_QUIZ[_obQuizIdx];
  var isCorrect = chosen === q.correct;
  if (isCorrect) _obQuizScore++;

  if (typeof HAPTIC !== 'undefined') {
    if (isCorrect) HAPTIC.success(); else HAPTIC.error();
  }

  // Colorear respuestas
  _OB_QUIZ[_obQuizIdx].opts.forEach(function(_, i) {
    var el = document.getElementById('ob-qo-' + i);
    if (!el) return;
    el.style.pointerEvents = 'none';
    if (i === q.correct) {
      el.style.background   = 'rgba(0,229,160,.15)';
      el.style.borderColor  = '#00e5a0';
      el.style.color        = '#00e5a0';
    } else if (i === chosen) {
      el.style.background   = 'rgba(248,113,113,.12)';
      el.style.borderColor  = '#f87171';
      el.style.color        = '#f87171';
    }
  });

  // Añadir explicación
  var wrap = document.getElementById('ob-quiz-wrap');
  if (wrap) {
    var expEl = document.createElement('div');
    expEl.style.cssText = 'background:rgba(0,229,160,.07);border:1px solid rgba(0,229,160,.18);'
      + 'border-radius:12px;padding:11px 14px;margin-top:4px;font-size:12px;'
      + 'color:var(--text2);line-height:1.6;animation:fadeInFast .25s ease;';
    expEl.innerHTML = (isCorrect ? '✅ ' : '❌ ') + q.exp;
    wrap.appendChild(expEl);
  }

  setTimeout(function() {
    _obQuizIdx++;
    _obQuizLocked = false;
    _obQuizRender();
  }, 1900);
}

function _obQuizFinish() {
  var level, levelLabel, levelIcon, levelDesc;
  if (_obQuizScore === 3) {
    level = 'investing'; levelIcon = '📊'; levelLabel = 'Inversor en formación';
    levelDesc = 'Tienes base sólida. Tu ruta empieza con estrategias de inversión avanzadas.';
  } else if (_obQuizScore === 2) {
    level = 'saving'; levelIcon = '🏦'; levelLabel = 'Ahorrador con potencial';
    levelDesc = 'Buen conocimiento base. Aprenderás a hacer crecer lo que ya tienes.';
  } else {
    level = 'zero'; levelIcon = '🌱'; levelLabel = 'Empezando desde cero';
    levelDesc = 'Todos empezamos aquí. Tu ruta te lleva de los fundamentos a la libertad financiera.';
  }

  S.investorLevel = level;

  var wrap = document.getElementById('ob-quiz-wrap');
  if (!wrap) return;
  wrap.innerHTML =
    '<div style="text-align:center;padding:8px 0 16px;">'
    + '<div style="font-size:52px;margin-bottom:10px;animation:rmValPop .4s cubic-bezier(.4,0,.2,1);">' + levelIcon + '</div>'
    + '<div style="font-size:10px;font-weight:700;letter-spacing:.1em;color:var(--text3);margin-bottom:6px;text-transform:uppercase;">Tu nivel detectado</div>'
    + '<div style="font-size:20px;font-weight:900;color:var(--accent);margin-bottom:6px;">' + levelLabel + '</div>'
    + '<div style="font-size:13px;color:var(--text2);margin-bottom:6px;line-height:1.55;">' + levelDesc + '</div>'
    + '<div style="font-size:12px;color:var(--text3);margin-bottom:20px;">' + _obQuizScore + '/3 correctas · Ruta personalizada activada</div>'
    + '<button class="btn btn-primary btn-block" onclick="if(typeof obNext===\'function\')obNext(4);" style="font-size:15px;padding:14px;">Continuar →</button>'
    + '</div>';

  if (typeof HAPTIC !== 'undefined') HAPTIC.medium();
}

window._obQuizInit   = _obQuizInit;
window._obQuizAnswer = _obQuizAnswer;

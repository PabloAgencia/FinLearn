/* ── P8-A: Online / Offline banner ────────────────────────────── */
(function() {
  function _showConnBanner(online) {
    var existing = document.getElementById('conn-banner');
    if (existing) existing.remove();
    if (online) {
      // Solo mostrar "restaurada" si veníamos de offline
      if (!window._wasOffline) return;
      window._wasOffline = false;
      var b = document.createElement('div');
      b.id = 'conn-banner';
      b.className = 'conn-banner conn-online';
      b.innerHTML = '✅ Conexión restaurada';
      document.body.appendChild(b);
      setTimeout(function() { if (b.parentNode) b.remove(); }, 3000);
    } else {
      window._wasOffline = true;
      var b = document.createElement('div');
      b.id = 'conn-banner';
      b.className = 'conn-banner conn-offline';
      b.innerHTML = '📵 Modo sin conexión — el contenido sigue disponible';
      document.body.appendChild(b);
    }
  }
  window.addEventListener('online',  function() { _showConnBanner(true);  });
  window.addEventListener('offline', function() { _showConnBanner(false); });
  if (!navigator.onLine) _showConnBanner(false);
})();


/* ═══════════════════════════════════════════════════════════════
   AMBIENT ANIMATION — Burbujas financieras flotantes ultra sutiles
═══════════════════════════════════════════════════════════════ */
(function initAmbient() {
  const wrap = document.getElementById('fin-ambient');
  if (!wrap) return;

  // Financial symbols pool
  const SYMBOLS = [
    { t:'€', cls:'ticker', color:'rgba(0,229,160,' },
    { t:'$', cls:'ticker', color:'rgba(110,86,255,' },
    { t:'%', cls:'ticker', color:'rgba(240,180,41,' },
    { t:'↑', cls:'ticker', color:'rgba(0,229,160,' },
    { t:'↗', cls:'ticker', color:'rgba(0,229,160,' },
    { t:'📈', cls:'bubble', color:null },
    { t:'💰', cls:'bubble', color:null },
    { t:'₿', cls:'ticker', color:'rgba(240,130,30,' },
    { t:'¥', cls:'ticker', color:'rgba(110,86,255,' },
    { t:'+', cls:'ticker', color:'rgba(0,229,160,' },
  ];

  const MAX_ELEMENTS = 14;
  let count = 0;

  function spawnElement() {
    if (!document.getElementById('fin-ambient')) return;
    if (count >= MAX_ELEMENTS) return;
    count++;

    const sym = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    const el  = document.createElement('div');
    const isCircle = Math.random() < 0.35 && sym.cls === 'bubble';

    const size     = isCircle ? (6 + Math.random() * 14) : (9 + Math.random() * 8);
    const left     = 2 + Math.random() * 96; // % across
    const duration = 14 + Math.random() * 22; // seconds
    const delay    = Math.random() * -duration;
    const opacity  = 0.04 + Math.random() * 0.09;

    if (isCircle) {
      el.className = 'fin-bubble';
      const alpha = (opacity * 0.7).toFixed(3);
      el.style.cssText = `
        left:${left}%;
        bottom:${-size}px;
        width:${size}px;
        height:${size}px;
        background:${sym.color || 'rgba(110,86,255,'}${alpha});
        animation-duration:${duration}s;
        animation-delay:${delay}s;
      `;
    } else {
      el.className = 'fin-ticker-float';
      el.textContent = sym.t;
      const col = sym.color ? sym.color + opacity.toFixed(3) + ')' : `rgba(200,200,200,${opacity.toFixed(3)})`;
      el.style.cssText = `
        left:${left}%;
        bottom:${-20}px;
        color:${col};
        font-size:${size}px;
        animation-duration:${duration * 0.7}s;
        animation-delay:${delay}s;
      `;
    }

    wrap.appendChild(el);

    // Remove when animation would have cycled a few times
    setTimeout(() => {
      el.remove();
      count = Math.max(0, count - 1);
    }, (duration + Math.abs(delay)) * 1000 + 2000);
  }

  // Spawn initial batch
  for (let i = 0; i < 8; i++) {
    setTimeout(() => spawnElement(), i * 600);
  }

  // Keep spawning continuously
  setInterval(() => {
    if (count < MAX_ELEMENTS) spawnElement();
  }, 2200);
})();

/* ══════════════════════════════════════════════════════════════════
   SISTEMA DE MISIONES SEMANALES v2
   ─────────────────────────────────────────────────────────────────
   · 14 misiones por semana de juego (7 días de juego = 1 semana)
   · Al inicio de semana se muestran 2 misiones desbloqueadas
   · Cada 24h reales se desbloquean 2 misiones más (hasta las 14)
   · Dificultades: fácil · media · difícil (retadoras pero justas)
   · Popup al completar cada misión (+XP inmediato)
   · Bonus +500 XP si completas 10 o más en la semana
   · Bonus +1000 XP si completas las 14 (semana perfecta)
══════════════════════════════════════════════════════════════════ */

/* ── Pool completo — 14 plantillas ordenadas por dificultad ──── */
const MISSION_POOL = [
  /* FÁCILES — primeras en desbloquearse, accesibles día 1 */
  {
    id:'m_dca1',      icon:'🎯', diff:'easy',
    title:'Pregunta del día',
    desc:'Responde la pregunta financiera del día en la pantalla de inicio',
    type:'dca', goal:1, xp:60,
  },
  {
    id:'m_visit_port', icon:'👀', diff:'easy',
    title:'Revisar cartera',
    desc:'Entra en la sección de Bolsa',
    type:'screen_portfolio', goal:1, xp:50,
  },
  {
    id:'m_learn1',    icon:'📖', diff:'easy',
    title:'Primera lección',
    desc:'Completa 1 módulo de aprendizaje',
    type:'modules', goal:1, xp:80,
  },
  {
    id:'m_visit_biz', icon:'🏙️', diff:'easy',
    title:'Visitar negocios',
    desc:'Entra en la sección de Negocios',
    type:'screen_business', goal:1, xp:50,
  },

  /* MEDIAS — se desbloquean a las 24–48h */
  {
    id:'m_buy1',      icon:'📈', diff:'medium',
    title:'Primera compra',
    desc:'Compra acciones en la bolsa simulada',
    type:'buys', goal:1, xp:90,
  },
  {
    id:'m_dca3',      icon:'🧠', diff:'medium',
    title:'Constancia mental',
    desc:'Responde la Acción del día 3 veces esta semana',
    type:'dca', goal:3, xp:150,
  },
  {
    id:'m_learn2',    icon:'📚', diff:'medium',
    title:'Doble sesión',
    desc:'Completa 2 módulos esta semana',
    type:'modules', goal:2, xp:180,
  },
  {
    id:'m_streak4',   icon:'🔥', diff:'medium',
    title:'Racha activa',
    desc:'Alcanza una racha de 4 días seguidos',
    type:'streak', goal:4, xp:160,
  },
  {
    id:'m_sell1',     icon:'💰', diff:'medium',
    title:'Tomar beneficios',
    desc:'Vende una posición en bolsa',
    type:'sells', goal:1, xp:100,
  },
  {
    id:'m_xp300',     icon:'⚡', diff:'medium',
    title:'Semana productiva',
    desc:'Gana 300 XP esta semana',
    type:'xp_week', goal:300, xp:140,
  },

  /* DIFÍCILES — se desbloquean a las 72–120h */
  {
    id:'m_learn3',    icon:'🎓', diff:'hard',
    title:'Maratón académico',
    desc:'Completa 3 módulos en la semana',
    type:'modules', goal:3, xp:280,
  },
  {
    id:'m_buy3',      icon:'💹', diff:'hard',
    title:'Inversor activo',
    desc:'Compra acciones 3 veces distintas esta semana',
    type:'buys', goal:3, xp:240,
  },
  {
    id:'m_diversify', icon:'🌐', diff:'hard',
    title:'Cartera diversificada',
    desc:'Ten 3 acciones distintas en cartera al mismo tiempo',
    type:'portfolio_size', goal:3, xp:300,
  },
  {
    id:'m_xp600',     icon:'🚀', diff:'hard',
    title:'Semana élite',
    desc:'Acumula 600 XP en esta semana',
    type:'xp_week', goal:600, xp:400,
  },
  /* NUEVAS — mayor variedad y profundidad */
  {
    id:'m_dca_streak', icon:'🔥', diff:'medium',
    title:'Racha perfecta 5 días',
    desc:'Acierta la pregunta del día 5 días seguidos',
    type:'dca_correct', goal:5, xp:200,
  },
  {
    id:'m_learn_hard', icon:'🎯', diff:'hard',
    title:'Dominio total',
    desc:'Completa 5 módulos con 100% de aciertos (sin fallar ningún quiz)',
    type:'modules_perfect', goal:5, xp:400,
  },
  {
    id:'m_budget', icon:'📊', diff:'medium',
    title:'Presupuesto mensual',
    desc:'Define tu presupuesto mensual completo en la pantalla de vida',
    type:'budget_set', goal:1, xp:120,
  },
  {
    id:'m_dilemma', icon:'⚖️', diff:'medium',
    title:'Dilema semanal',
    desc:'Responde al dilema financiero de la semana',
    type:'dilemma', goal:1, xp:100,
  },
  {
    id:'m_tools_3', icon:'🛠️', diff:'medium',
    title:'Explora las herramientas',
    desc:'Usa 3 calculadoras distintas (IRPF, interés compuesto, etc.)',
    type:'tools_used', goal:3, xp:150,
  },
  {
    id:'m_invest_1k', icon:'💼', diff:'hard',
    title:'Primera gran inversión',
    desc:'Invierte un total de €1.000 en bolsa simulada',
    type:'invested_amount', goal:1000, xp:300,
  },
  {
    id:'m_diversify_3', icon:'🌍', diff:'hard',
    title:'Cartera diversificada',
    desc:'Ten posiciones activas en al menos 3 acciones distintas',
    type:'stocks_held', goal:3, xp:250,
  },
  {
    id:'m_biz_1', icon:'🏪', diff:'medium',
    title:'Primer negocio',
    desc:'Compra tu primer negocio para ingresos pasivos',
    type:'biz_owned', goal:1, xp:180,
  },
  {
    id:'m_coach', icon:'🤖', diff:'easy',
    title:'Habla con el Coach',
    desc:'Haz una pregunta al FinAI Coach',
    type:'coach_used', goal:1, xp:80,
  },
  {
    id:'m_savings_rate', icon:'💰', diff:'hard',
    title:'Tasa de ahorro >20%',
    desc:'Alcanza una tasa de ahorro mensual superior al 20%',
    type:'savings_rate', goal:20, xp:350,
  },
];

/* ── Estado auxiliar de misiones (no persistido en S para no romper nada) */
let _mw = {
  buys: 0, sells: 0, modules: 0,
  dca: 0, dca_correct: 0, biz: 0,
  visited_portfolio: false, visited_business: false,
  xp_start: 0,
};

/* ── Helpers ─────────────────────────────────────────────────── */
function _missionWeekId() {
  return Math.floor((S.gameDay || 0) / 7);
}

function _nowHours() {
  return Date.now() / 3600000; // timestamp en horas reales
}

/* ── Cuántas misiones están desbloqueadas ahora mismo ───────── */
function _unlockedCount() {
  const weekStart = S._mw_real_start || _nowHours();
  const hoursElapsed = Math.max(0, _nowHours() - weekStart);
  // 2 iniciales + 2 cada 24h reales, máx 14
  return Math.min(14, 2 + Math.floor(hoursElapsed / 24) * 2);
}

/* ── Inicializar / rotar ─────────────────────────────────────── */
function _initMissions() {
  if (typeof S._mw_week !== 'number') S._mw_week = -1;
  if (!Array.isArray(S._mw_missions)) S._mw_missions = [];
  if (typeof S._mw_total_done !== 'number') S._mw_total_done = 0;

  const week = _missionWeekId();
  if (S._mw_week !== week) _rotateMissions(week);
}

function _rotateMissions(week) {
  // Bonus de semana anterior
  if (S._mw_week >= 0 && Array.isArray(S._mw_missions)) {
    const done = S._mw_missions.filter(m => m.done).length;
    if (done >= 14 && !S._mw_perfect_weeks?.includes(S._mw_week)) {
      if (!S._mw_perfect_weeks) S._mw_perfect_weeks = [];
      S._mw_perfect_weeks.push(S._mw_week);
      S.xp += 400;
      if (typeof F34_onXPGained === 'function') F34_onXPGained(400);
      setTimeout(() => _showMissionPopup({ icon:'👑', title:'¡Semana Perfecta! 14/14', xp: 400 }), 800);
    } else if (done >= 10 && !S._mw_ten_weeks?.includes(S._mw_week)) {
      if (!S._mw_ten_weeks) S._mw_ten_weeks = [];
      S._mw_ten_weeks.push(S._mw_week);
      S.xp += 200;
      if (typeof F34_onXPGained === 'function') F34_onXPGained(200);
      setTimeout(() => _showMissionPopup({ icon:'🏅', title:'10+ Misiones — Bonus', xp: 200 }), 800);
    }
  }

  S._mw_week        = week;
  S._mw_real_start  = _nowHours(); // marca de tiempo real para desbloqueo
  _mw = { buys:0, sells:0, modules:0, dca:0, dca_correct:0, biz:0, modules_perfect:0, budget_set:0, dilemma:0, tools_used:0, coach_used:0, tools_list:[],
          visited_portfolio:false, visited_business:false,
          xp_start: S.xp || 0 };

  // Asignar las 14 misiones del pool (están pre-ordenadas fácil→difícil)
  S._mw_missions = MISSION_POOL.map(t => ({
    id: t.id, icon: t.icon, title: t.title, desc: t.desc,
    type: t.type, goal: t.goal, xp: t.xp, diff: t.diff,
    progress: 0, done: false, xpClaimed: false,
  }));

  saveState();
}

/* ── Actualizar progreso ─────────────────────────────────────── */
function checkMissions() {
  _initMissions();
  if (!S._mw_missions?.length) return;

  const unlocked = _unlockedCount();
  let anyNew = false;

  S._mw_missions.slice(0, unlocked).forEach(m => {
    if (m.done) return;

    let prog = 0;
    switch (m.type) {
      case 'modules':          prog = _mw.modules; if (S.currentMod && (!S.currentMod._quizStats || S.currentMod._quizStats.wrong === 0)) _mw.modules_perfect++; break;
      case 'dca':              prog = _mw.dca;                             break;
      case 'dca_correct':      prog = _mw.dca_correct;                     break;
      case 'modules_perfect':  prog = _mw.modules_perfect;                 break;
      case 'budget_set':       prog = _mw.budget_set;                      break;
      case 'dilemma':          prog = _mw.dilemma;                         break;
      case 'tools_used':       prog = _mw.tools_used;                      break;
      case 'coach_used':       prog = _mw.coach_used;                      break;
      case 'invested_amount':  prog = Math.min(S.totalInvested || 0, mission.goal); break;
      case 'stocks_held':      prog = Object.keys(S.portfolio || {}).filter(t => (S.portfolio[t]?.qty || 0) > 0).length; break;
      case 'biz_owned':        prog = Object.keys(S.businesses || {}).length; break;
      case 'savings_rate':     prog = (S.lifeSalary||0) > 0 ? Math.round(((S.monthlyContribution||0)/(S.lifeSalary||1))*100) : 0; break;
      case 'buys':             prog = _mw.buys;                            break;
      case 'sells':            prog = _mw.sells;                           break;
      case 'biz_acquired':     prog = _mw.biz;                             break;
      case 'biz_active':       prog = Object.keys(S.businesses||{}).length; break;
      case 'portfolio_size':   prog = Object.keys(S.portfolio||{}).length;  break;
      case 'streak':           prog = S.streak || 0;                        break;
      case 'xp_week':          prog = Math.max(0,(S.xp||0)-(_mw.xp_start||0)); break;
      case 'screen_portfolio': prog = _mw.visited_portfolio ? 1 : 0;        break;
      case 'screen_business':  prog = _mw.visited_business  ? 1 : 0;        break;
    }

    m.progress = Math.min(m.goal, prog);

    if (m.progress >= m.goal) {
      m.done = true;
      if (!m.xpClaimed) {
        m.xpClaimed = true;
        S.xp += m.xp;
        if (typeof F34_onXPGained === 'function') F34_onXPGained(m.xp);
        S._mw_total_done = (S._mw_total_done || 0) + 1;
        anyNew = true;
        const snap = { icon: m.icon, title: m.title, xp: m.xp };
        setTimeout(() => _showMissionPopup(snap), 500);
      }
    }
  });

  if (anyNew) { saveState(); checkAchievements(); }
  renderMissionsCard();
}

/* ── Popup ───────────────────────────────────────────────────── */
function _showMissionPopup(m) {
  let el = document.getElementById('mission-popup');
  if (!el) {
    el = document.createElement('div');
    el.id = 'mission-popup';
    document.body.appendChild(el);
  }
  el.innerHTML = `
    <div class="mp-inner">
      <div class="mp-eyebrow">🏆 MISIÓN COMPLETADA</div>
      <div class="mp-icon">${m.icon}</div>
      <div class="mp-title">${m.title}</div>
      <div class="mp-xp">+${m.xp} XP</div>
    </div>`;
  el.className = 'mp-show';
  SFX.correct?.();
  HAPTIC?.success?.();
  spawnXP?.(`+${m.xp} XP`);
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = 'mp-hide'; }, 3400);
}

/* ── Countdown helpers ───────────────────────────────────────── */
let _mw_countdown_iv  = null;
let _mw_last_unlocked = 0;

function _msToNextUnlock() {
  if (!S._mw_real_start) return 0;
  const hoursElapsed = Math.max(0, _nowHours() - S._mw_real_start);
  const nextBatch    = Math.floor(hoursElapsed / 24) + 1;
  const hoursLeft    = nextBatch * 24 - hoursElapsed;
  return Math.max(0, hoursLeft * 3600000);
}

function _fmtCountdown(ms) {
  if (ms <= 0) return '¡Ahora!';
  const totalSec = Math.floor(ms / 1000);
  const h   = Math.floor(totalSec / 3600);
  const m   = Math.floor((totalSec % 3600) / 60);
  const sec = totalSec % 60;
  if (h > 0) return h + 'h ' + String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
  return String(m).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
}

function _updateMissionCountdown() {
  const el = document.getElementById('mission-unlock-countdown');
  // Si el elemento desapareció (panel cerrado), detener el intervalo
  if (!el) { clearInterval(_mw_countdown_iv); _mw_countdown_iv = null; return; }

  const unlocked = _unlockedCount();
  if (unlocked >= 14) {
    clearInterval(_mw_countdown_iv); _mw_countdown_iv = null;
    renderMissionsCard(); // re-render sin fila de cuenta atrás
    return;
  }
  // Si una nueva tanda se desbloqueó desde el último tick, re-renderizar
  if (unlocked > _mw_last_unlocked) {
    _mw_last_unlocked = unlocked;
    clearInterval(_mw_countdown_iv); _mw_countdown_iv = null;
    renderMissionsCard();
    return;
  }
  _mw_last_unlocked = unlocked;
  el.textContent = _fmtCountdown(_msToNextUnlock());
}

function _startMissionCountdown() {
  if (_mw_countdown_iv) return; // ya corriendo
  _mw_last_unlocked = _unlockedCount();
  _updateMissionCountdown();
  _mw_countdown_iv = setInterval(_updateMissionCountdown, 1000);
}

/* ── Render tarjeta ──────────────────────────────────────────── */
function renderMissionsCard() {
  _initMissions();
  const all      = S._mw_missions || [];
  const unlocked = _unlockedCount();
  const done     = all.slice(0, unlocked).filter(m => m.done).length;
  const locked   = 14 - unlocked;
  const pending  = all.slice(0, unlocked).filter(m => !m.done).reduce((a, m) => a + m.xp, 0);

  const sub = document.getElementById('missions-subtitle');
  if (sub) sub.textContent = `${done}/${unlocked} completadas${locked > 0 ? ' · 🔒 ' + locked + ' por desbloquear' : ' · ¡Todas desbloqueadas!'}`;

  const badge = document.getElementById('missions-xp-badge');
  if (badge) {
    badge.textContent = pending > 0 ? `+${pending} XP` : done === unlocked ? '✅ Al día' : '+0 XP';
    badge.style.background = pending > 0 ? 'rgba(99,102,241,.15)' : 'rgba(0,229,160,.15)';
    badge.style.color      = pending > 0 ? '#818cf8'              : '#00e5a0';
  }

  const card = document.getElementById('missions-card');
  if (card) card.className = 'missions-card' + (done > 0 && done === unlocked ? ' missions-card-complete' : '');

  const list = document.getElementById('missions-list');
  if (!list) return;

  const diffColor = { easy:'#00e5a0', medium:'#f0b429', hard:'#ff6b6b' };
  const diffLabel = { easy:'Fácil',   medium:'Media',   hard:'Difícil'  };

  // Render TODAS las 14 misiones; las bloqueadas con blur y candado
  let html = all.map((m, idx) => {
    const isLocked = idx >= unlocked;
    const col = diffColor[m.diff];
    const pct = m.goal > 1 ? Math.min(100, Math.round(m.progress / m.goal * 100)) : (m.done ? 100 : 0);

    const rowInner = `
      <div class="mission-row ${m.done ? 'mission-done' : ''}">
        <div class="mission-icon-wrap ${m.done ? 'mission-icon-done' : ''}">${m.icon}</div>
        <div class="mission-content">
          <div class="mission-top-row">
            <span class="mission-title">${m.title}</span>
            <span class="mission-xp" style="color:${m.done ? '#00e5a0' : '#818cf8'};">${m.done ? '✓ ' : ''}+${m.xp} XP</span>
          </div>
          <div class="mission-desc">${m.desc}</div>
          <div class="mission-progress-row">
            <div class="mission-pbar"><div class="mission-pbar-fill" style="width:${pct}%;background:${m.done ? '#00e5a0' : col};"></div></div>
            <span class="mission-progress-txt">${m.goal > 1 ? m.progress + '/' + m.goal : (m.done ? '✓' : '○')}</span>
            <span class="mission-diff-badge" style="color:${col};border-color:${col}30;">${diffLabel[m.diff]}</span>
          </div>
        </div>
      </div>`;

    if (isLocked) {
      // Wrapper: inner borroso + candado superpuesto (sibling, no hijo, para que no herede el blur)
      return `<div class="mw-locked-wrap">
        <div class="mw-locked-inner">${rowInner}</div>
        <div class="mw-lock-pill">🔒</div>
      </div>`;
    }
    return rowInner;
  }).join('');

  // Fila de cuenta atrás para el próximo desbloqueo
  if (locked > 0) {
    html += `<div class="mission-next-unlock">
      <span>🔓 +2 misiones se desbloquearán en</span>
      <span class="mnu-timer" id="mission-unlock-countdown">--:--</span>
    </div>`;
  }

  list.innerHTML = html;

  // Arrancar / mantener el contador de 1 segundo
  if (locked > 0) _startMissionCountdown();

  const footer = document.getElementById('missions-footer');
  if (footer) {
    const totalDone = all.filter(m => m.done).length;
    if (totalDone >= 14)      footer.innerHTML = `<div class="missions-complete-banner">👑 ¡Semana perfecta! +1000 XP bonus al rotar</div>`;
    else if (totalDone >= 10) footer.innerHTML = `<div class="missions-complete-banner" style="background:rgba(240,180,41,.08);border-color:rgba(240,180,41,.3);color:#f0b429;">🏅 10+ misiones · +500 XP bonus al rotar</div>`;
    else                      footer.innerHTML = `<div class="missions-reset-note">Completa 10+ para bonus · 14/14 para semana perfecta</div>`;
  }
}

/* ── Toggle ──────────────────────────────────────────────────── */
function toggleMissionsPanel() {
  const body    = document.getElementById('missions-body');
  const chevron = document.getElementById('missions-chevron');
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (chevron) chevron.textContent = open ? '▾' : '▴';
}

/**
 * toggleHomeSection — Acordeón genérico para las secciones secundarias
 * del home (home-sec-a/b/c/d). Colapsadas por defecto para reducir
 * la sobrecarga de la primera sesión; el contenido no cambia, solo su visibilidad.
 */
function toggleHomeSection(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  const open  = el.style.display !== 'none';
  el.style.display = open ? 'none' : 'block';
  const arrow = btn && btn.querySelector('.hs-arrow');
  if (arrow) arrow.textContent = open ? '▾' : '▴';
}
window.toggleHomeSection = toggleHomeSection;

/**
 * scrollToHomeTarget — Hace scroll a un elemento del home aunque este
 * dentro de un acordeon "Explorar mas" colapsado: lo abre primero
 * (y actualiza su flecha) y luego hace scroll con un pequeno delay
 * para dar tiempo al reflow.
 */
function scrollToHomeTarget(id, block) {
  const el = document.getElementById(id);
  if (!el) return;
  let opened = false;
  let node = el.parentElement;
  while (node) {
    if (node.id && node.id.indexOf('home-sec-') === 0 && getComputedStyle(node).display === 'none') {
      node.style.display = 'block';
      const btn = node.previousElementSibling;
      const arrow = btn && btn.querySelector && btn.querySelector('.hs-arrow');
      if (arrow) arrow.textContent = '▴';
      opened = true;
    }
    node = node.parentElement;
  }
  setTimeout(() => {
    el.scrollIntoView({ behavior: 'smooth', block: block || 'center' });
  }, opened ? 60 : 0);
}
window.scrollToHomeTarget = scrollToHomeTarget;

/* ── Hooks ───────────────────────────────────────────────────── */
(function _hookMissions() {
  // executeBuy
  const _ob = executeBuy;
  executeBuy = function() { _ob.apply(this, arguments); _mw.buys++; checkMissions(); };
  window.executeBuy = executeBuy;

  // executeSell
  const _os = executeSell;
  executeSell = function() { _os.apply(this, arguments); _mw.sells++; checkMissions(); };
  window.executeSell = executeSell;

  // completeModule
  const _om = completeModule;
  completeModule = function() { _om.apply(this, arguments); _mw.modules++; checkMissions(); };
  window.completeModule = completeModule;

  // answerDCA
  const _od = answerDCA;
  answerDCA = function(chosen, correct, exp) {
    _od.apply(this, arguments);
    _mw.dca++;
    if (chosen === correct) _mw.dca_correct++;
    checkMissions();
  };
  window.answerDCA = answerDCA;

  // executeBizAcquire
  const _ob2 = executeBizAcquire;
  executeBizAcquire = function() { _ob2.apply(this, arguments); _mw.biz++; checkMissions(); };
  window.executeBizAcquire = executeBizAcquire;

  // goTo — screen visits
  const _og = goTo;
  goTo = function(screen) {
    _og.apply(this, arguments);
    if (screen === 'portfolio') { _mw.visited_portfolio = true; checkMissions(); }
    if (screen === 'business')  { _mw.visited_business  = true; checkMissions(); }
  };
  window.goTo = goTo;
})();

/* ── Arranque ────────────────────────────────────────────────── */
(function() {
  const _wait = setInterval(() => {
    if (typeof S !== 'undefined' && S.userName) {
      clearInterval(_wait);
      _initMissions();
      renderMissionsCard();
      // Refrescar desbloqueo cada hora real
      setInterval(() => { if (typeof renderMissionsCard === 'function') renderMissionsCard(); }, 3600000);
    }
  }, 400);
})();

window.checkMissions       = checkMissions;
window.renderMissionsCard  = renderMissionsCard;
window.toggleMissionsPanel = toggleMissionsPanel;

/* ══════════════════════════════════════════════════════════════════
   COMPARADOR DE ESTILOS DE VIDA
══════════════════════════════════════════════════════════════════ */

let _lifestyleChartInst = null;

const LIFESTYLE_PROFILES = {
  consumista: { savingsRate:0.03, returnRate:0.015 },
  fire:       { savingsRate:0.55, returnRate:0.09  },
};

function _calcLifestyleProjection(income, savingsRate, returnRate, years, startPatrimony) {
  const monthly = income * savingsRate;
  const r = returnRate / 12;
  const data = [startPatrimony || 0];
  let val = startPatrimony || 0;
  for (let m = 1; m <= years * 12; m++) {
    val = val * (1 + r) + monthly;
    if (m % 12 === 0) data.push(Math.round(val));
  }
  return data;
}

function _calcFireAge(income, savingsRate, returnRate, startAge, startPatrimony) {
  const expenses = income * (1 - savingsRate);
  const fireNum  = expenses * 12 * 25;
  const monthly  = income * savingsRate;
  const r        = returnRate / 12;
  let   val      = startPatrimony || 0;
  for (let m = 1; m <= 600; m++) {
    val = val * (1 + r) + monthly;
    if (val >= fireNum) return startAge + Math.floor(m / 12);
  }
  return null;
}

function _fmtM(n) {
  if (!n && n !== 0) return '—';
  if (Math.abs(n) >= 1000000) return '€' + (n/1000000).toFixed(2) + 'M';
  if (Math.abs(n) >= 1000)    return '€' + Math.round(n/1000) + 'K';
  return '€' + Math.round(n).toLocaleString('es');
}

function renderLifestyleComparator() {
  const income = Math.max(100, S.income > 0 ? S.income : S.lifeSalary || 2000);
  const age    = S.lifeAge || S.age || 30;
  const myRate = Math.min(0.9, Math.max(0.01, (S.monthlyContribution || 200) / income));
  const myRet  = (S.expectedReturn || 7) / 100;
  const startP = S.patrimony || 0;
  const years  = 30;

  const myData   = _calcLifestyleProjection(income, myRate, myRet, years, startP);
  const conData  = _calcLifestyleProjection(income, LIFESTYLE_PROFILES.consumista.savingsRate, LIFESTYLE_PROFILES.consumista.returnRate, years, 0);
  const fireData = _calcLifestyleProjection(income, LIFESTYLE_PROFILES.fire.savingsRate, LIFESTYLE_PROFILES.fire.returnRate, years, 0);
  const labels   = Array.from({length: years+1}, (_,i) => String(age+i));

  const myFireAge   = _calcFireAge(income, myRate, myRet, age, startP);
  const fireFireAge = _calcFireAge(income, LIFESTYLE_PROFILES.fire.savingsRate, LIFESTYLE_PROFILES.fire.returnRate, age, 0);

  // Summary cards
  const summaryEl = document.getElementById('lsc-summary');
  if (summaryEl) summaryEl.innerHTML = `
    <div class="lsc-card lsc-card-you">
      <div class="lsc-card-emoji">🪞</div>
      <div class="lsc-card-label">TÚ HOY</div>
      <div class="lsc-card-rate">${Math.round(myRate*100)}% ahorro</div>
      <div class="lsc-card-fire">${myFireAge ? 'FIRE a los <strong>'+myFireAge+'</strong>' : 'Sin fecha FIRE'}</div>
      <div class="lsc-card-final" style="color:#6366f1;">${_fmtM(myData[years])}</div>
      <div class="lsc-card-final-lab">en ${years} años</div>
    </div>
    <div class="lsc-card lsc-card-con">
      <div class="lsc-card-emoji">🛍️</div>
      <div class="lsc-card-label">CONSUMISTA</div>
      <div class="lsc-card-rate">3% ahorro</div>
      <div class="lsc-card-fire" style="color:#ff6b6b;">Sin independencia</div>
      <div class="lsc-card-final" style="color:#ff6b6b;">${_fmtM(conData[years])}</div>
      <div class="lsc-card-final-lab">en ${years} años</div>
    </div>
    <div class="lsc-card lsc-card-fire">
      <div class="lsc-card-emoji">🔥</div>
      <div class="lsc-card-label">EL FIRE</div>
      <div class="lsc-card-rate">55% ahorro</div>
      <div class="lsc-card-fire" style="color:#f0b429;">FIRE a los <strong>${fireFireAge||'—'}</strong></div>
      <div class="lsc-card-final" style="color:#f0b429;">${_fmtM(fireData[years])}</div>
      <div class="lsc-card-final-lab">en ${years} años</div>
    </div>`;

  // Chart
  const canvas = document.getElementById('lifestyle-chart');
  if (canvas) {
    if (_lifestyleChartInst) { _lifestyleChartInst.destroy(); _lifestyleChartInst = null; }
    const ctx = canvas.getContext('2d');
    const g = (c1,c2) => { const g=ctx.createLinearGradient(0,0,0,300); g.addColorStop(0,c1); g.addColorStop(1,c2); return g; };
    _lifestyleChartInst = new Chart(canvas, {
      type:'line', data:{ labels, datasets:[
        { label:'🪞 Tú',         data:myData,   borderColor:'#6366f1', backgroundColor:g('rgba(99,102,241,.25)','rgba(99,102,241,0)'), borderWidth:3, pointRadius:0, fill:true, tension:.4 },
        { label:'🔥 FIRE',       data:fireData, borderColor:'#f0b429', backgroundColor:g('rgba(240,180,41,.18)','rgba(240,180,41,0)'), borderWidth:2.5, pointRadius:0, fill:true, tension:.4 },
        { label:'🛍️ Consumista', data:conData,  borderColor:'#ff6b6b', backgroundColor:g('rgba(255,107,107,.1)','rgba(255,107,107,0)'), borderWidth:2, borderDash:[5,4], pointRadius:0, fill:true, tension:.4 },
      ]},
      options:{ responsive:true, maintainAspectRatio:false,
        interaction:{ mode:'index', intersect:false },
        plugins:{ legend:{ position:'top', labels:{ color:'#a0a8c0', font:{size:11}, boxWidth:14, padding:14 }},
          tooltip:{ backgroundColor:'rgba(10,12,25,.92)', titleColor:'#e2e8f0', bodyColor:'#a0a8c0', borderColor:'rgba(99,102,241,.3)', borderWidth:1, padding:12, cornerRadius:10,
            callbacks:{ label: c => ` ${c.dataset.label}: ${_fmtM(c.raw)}` }}},
        scales:{
          x:{ ticks:{ color:'#606880', font:{size:10}, maxTicksLimit:8 }, grid:{ color:'rgba(255,255,255,.04)' }},
          y:{ ticks:{ color:'#606880', font:{size:10}, callback:v=>_fmtM(v) }, grid:{ color:'rgba(255,255,255,.05)' }}
        }
      }
    });
  }

  // Tabla
  const tbl = document.getElementById('lsc-table');
  if (tbl) {
    const rows = [5,10,20,30].map(y => {
      const my  = _calcLifestyleProjection(income,myRate,myRet,y,startP)[y];
      const con = _calcLifestyleProjection(income,.03,.015,y,0)[y];
      const fir = _calcLifestyleProjection(income,.55,.09,y,0)[y];
      const d   = fir - my;
      return `<tr>
        <td class="lst-year">Año ${y} <span class="lst-age">(${age+y}a)</span></td>
        <td style="color:#6366f1;font-weight:700;text-align:right;">${_fmtM(my)}</td>
        <td style="color:#f0b429;font-weight:700;text-align:right;">${_fmtM(fir)}</td>
        <td style="color:#ff6b6b;text-align:right;">${_fmtM(con)}</td>
        <td style="font-weight:700;color:${d>0?'#00e5a0':'#ff4b5c'};text-align:right;">${d>0?'+':''}${_fmtM(d)}</td>
      </tr>`;
    }).join('');
    tbl.innerHTML = `<table class="lifestyle-table"><thead><tr>
      <th>Año</th><th style="color:#6366f1;">🪞 Tú</th><th style="color:#f0b429;">🔥 FIRE</th>
      <th style="color:#ff6b6b;">🛍️ Cons.</th><th>Diferencia</th>
    </tr></thead><tbody>${rows}</tbody></table>`;
  }

  // Slider
  const wi = document.getElementById('lsc-whatif');
  if (wi) {
    const pct = Math.round(Math.min(90,Math.max(1,myRate*100)));
    wi.innerHTML = `
      <div class="lsc-whatif-head">
        <div class="h3" style="margin:0;">🎛️ ¿Y si cambio mi tasa de ahorro?</div>
        <div style="font-size:12px;color:var(--text2);">Mueve el slider — impacto en tiempo real</div>
      </div>
      <div class="lsc-whatif-row">
        <span style="font-size:12px;color:var(--text2);">Ahorro</span>
        <input type="range" id="lsc-rate-slider" min="3" max="60" step="1" value="${pct}"
          oninput="updateLifestyleSlider()" class="proj-slider" style="flex:1;margin:0 12px;">
        <span class="lsc-rate-val" id="lsc-rate-display">${pct}%</span>
      </div>
      <div id="lsc-whatif-result"></div>`;
    updateLifestyleSlider();
  }

  // Decisiones
  const dec = document.getElementById('lsc-decisions');
  if (dec) {
    const decisions = [
      { icon:'🚗', label:'El coche',     you:'Coche ajustado o sin coche', con:'Coche nuevo a crédito −€400/mes', fire:'Bicicleta o sin coche — €0/mes', lesson:'Un coche de €30k financiado cuesta ~€50k con intereses. Invertido al 7%: €380k en 30 años.' },
      { icon:'🏠', label:'La vivienda',  you:'Hipoteca según tus datos reales', con:'Hipoteca máxima — stress financiero', fire:'Alquiler barato o hipoteca mínima', lesson:'Regla: cuota < 30% del neto mensual. El banco aprueba más de lo que deberías aceptar.' },
      { icon:'☕', label:'Lo cotidiano', you:'Equilibrio consciente', con:'Café, lunch, salidas — €250/mes', fire:'Café en casa, tupper — €30/mes', lesson:'€220/mes × 30 años al 7% = €272.000. No es el café — es el patrón de gasto inconsciente.' },
      { icon:'🏖️', label:'Vacaciones',   you:'Planificadas y presupuestadas', con:'Vacaciones a crédito — €3.000/año', fire:'Vacaciones low-cost — €500/año', lesson:'Vacaciones a crédito al 20% TAE durante 20 años = €72.000 pagados solo en intereses.' },
    ];
    dec.innerHTML = decisions.map(d => `
      <div class="lsc-decision">
        <div class="lsd-header"><span class="lsd-icon">${d.icon}</span><span class="lsd-label">${d.label}</span></div>
        <div class="lsd-profiles">
          <div class="lsd-row"><span class="lsd-badge lsd-badge-you">🪞 Tú</span><span class="lsd-text">${d.you}</span></div>
          <div class="lsd-row"><span class="lsd-badge lsd-badge-fire">🔥 FIRE</span><span class="lsd-text">${d.fire}</span></div>
          <div class="lsd-row"><span class="lsd-badge lsd-badge-con">🛍️ Cons.</span><span class="lsd-text">${d.con}</span></div>
        </div>
        <div class="lsd-lesson">${d.lesson}</div>
      </div>`).join('');
  }
}

function updateLifestyleSlider() {
  const slider  = document.getElementById('lsc-rate-slider');
  const display = document.getElementById('lsc-rate-display');
  const result  = document.getElementById('lsc-whatif-result');
  if (!slider || !result) return;
  const pct    = parseInt(slider.value);
  const income = Math.max(100, S.income > 0 ? S.income : S.lifeSalary || 2000);
  const myRet  = (S.expectedReturn || 7) / 100;
  const age    = S.lifeAge || S.age || 30;
  const startP = S.patrimony || 0;
  if (display) display.textContent = pct + '%';
  const val10   = _calcLifestyleProjection(income,pct/100,myRet,10,startP)[10];
  const val30   = _calcLifestyleProjection(income,pct/100,myRet,30,startP)[30];
  const fireAge = _calcFireAge(income,pct/100,myRet,age,startP);
  const tier = pct<10?{l:'Zona de riesgo',c:'#ff6b6b',i:'⚠️'}:pct<20?{l:'Zona estándar',c:'#f0b429',i:'📊'}:pct<40?{l:'Zona saludable',c:'#6366f1',i:'💪'}:{l:'Zona FIRE',c:'#00e5a0',i:'🔥'};
  result.innerHTML = `
    <div class="lsc-slider-tier" style="border-color:${tier.c};background:${tier.c}18;">
      <span>${tier.i}</span><span style="font-weight:700;color:${tier.c};">${tier.l}</span>
      <span style="font-size:11px;color:var(--text2);">€${Math.round(income*pct/100).toLocaleString('es')}/mes</span>
    </div>
    <div class="lsc-slider-nums">
      <div class="lsc-sn-box"><div class="lsc-sn-val" style="color:#6366f1;">${_fmtM(val10)}</div><div class="lsc-sn-lab">10 años</div></div>
      <div class="lsc-sn-box lsc-sn-main"><div class="lsc-sn-val" style="color:#00e5a0;">${_fmtM(val30)}</div><div class="lsc-sn-lab">30 años</div></div>
      <div class="lsc-sn-box"><div class="lsc-sn-val" style="color:${tier.c};">${fireAge?fireAge+'a':'> 65'}</div><div class="lsc-sn-lab">Edad FIRE</div></div>
    </div>`;
}

window.renderLifestyleComparator = renderLifestyleComparator;
window.updateLifestyleSlider     = updateLifestyleSlider;


/* ══════════════════════════════════════════════════════════════════
   FEATURE: NOTICIAS ECONÓMICAS FICTICIAS
   ─────────────────────────────────────────────────────────────────
   · Se disparan cada 15-25 días de juego (desde _tickGameDay)
   · Muestran modal "breaking news" con impacto educativo FinAI
   · Aplican multiplicador de precio a sectores durante 3-5 días
══════════════════════════════════════════════════════════════════ */

const ECON_NEWS = [
  {
    headline: 'BCE sube tipos al 4,5% — mercados reaccionan',
    body: 'El Banco Central Europeo incrementa los tipos de referencia en 25 puntos básicos, su octava subida consecutiva. La medida busca frenar la inflación persistente en la Eurozona.',
    sector: 'tech', mult: 0.955, positive: false, duration: 4,
    icon: '🏦',
    finaiTip: '⚡ <strong>Tipos + Bolsa</strong>: Cuando el BCE sube tipos, el dinero "libre de riesgo" (bonos) ofrece más rentabilidad. Las acciones de crecimiento (tech) se vuelven relativamente menos atractivas porque su valoración descuenta flujos futuros con una tasa mayor. Es la mecánica clásica que explica por qué tech cae con tipos altos.'
  },
  {
    headline: 'NVIDIA bate estimaciones: IA dispara beneficios +240%',
    body: 'El fabricante de chips reporta beneficios trimestrales muy superiores a lo esperado, impulsado por la demanda récord de chips H100 para centros de datos de inteligencia artificial.',
    sector: 'tech', mult: 1.072, positive: true, duration: 3,
    icon: '🤖',
    finaiTip: '🚀 <strong>Earnings Surprise</strong>: Cuando una empresa supera ampliamente las expectativas de beneficios ("bate estimaciones"), el precio sube porque los inversores revisan al alza su valoración futura. El "earnings surprise" es uno de los catalizadores más potentes de movimiento de precios a corto plazo.'
  },
  {
    headline: 'OPEP+ recorta producción 1,5M barriles/día',
    body: 'La alianza de países productores de petróleo anuncia un recorte sorpresa de producción para sostener el precio del crudo por encima de 80$ el barril.',
    sector: 'commodity', mult: 1.065, positive: true, duration: 5,
    icon: '🛢️',
    finaiTip: '💡 <strong>Oferta y precio del petróleo</strong>: La OPEP actúa como un cártel que controla la oferta. Al reducir producción, el precio sube (menos oferta, misma demanda). Las energéticas ganan directamente; las aerolíneas y empresas con alta dependencia energética pierden. Esto ilustra cómo las materias primas conectan geopolítica con tu cartera.'
  },
  {
    headline: 'FED mantiene tipos: "Inflación bajo control"',
    body: 'La Reserva Federal mantiene los tipos entre 5,25-5,50% y señala posibles bajadas en los próximos trimestres si los datos de inflación continúan mejorando.',
    sector: 'all', mult: 1.025, positive: true, duration: 3,
    icon: '📊',
    finaiTip: '🎯 <strong>FED Put</strong>: Los mercados aman la certidumbre. Cuando la FED mantiene tipos sin sorpresas y da señales dovish (paloma = tipos bajos), los activos de riesgo suben. El concepto "FED Put" describe cómo el banco central actúa como red de seguridad implícita para los mercados.'
  },
  {
    headline: 'China estimula economía: bajada de tipos + €500B en infraestructura',
    body: 'El gobierno chino anuncia un paquete histórico de estímulos fiscales y monetarios para reactivar el consumo interno y el sector inmobiliario.',
    sector: 'etf', mult: 1.042, positive: true, duration: 4,
    icon: '🇨🇳',
    finaiTip: '🌍 <strong>Mercados emergentes y China</strong>: China representa ~18% del PIB mundial. Sus estímulos impactan directamente en materias primas (acero, cobre), exportadores europeos y ETFs de mercados emergentes. La correlación global de los mercados significa que lo que pasa en Pekín afecta tu cartera aunque no tengas ni una acción china.'
  },
  {
    headline: 'Crisis energética en Europa: gas natural x3 en 30 días',
    body: 'Tensiones geopolíticas cortan suministro de gas al continente. Los gobiernos activan planes de emergencia energética y las eléctricas intensivas en gas disparan costes.',
    sector: 'etf', mult: 0.958, positive: false, duration: 5,
    icon: '⚡',
    finaiTip: '🛡️ <strong>Cisne negro energético</strong>: Las crisis energéticas son shocks de oferta que elevan la inflación y reducen el crecimiento simultáneamente (stagflación). Los activos más resistentes en este entorno son energéticas con producción propia, utilities con tarifas reguladas, y commodities. Los ETFs diversificados amortiguan pero no eliminan el impacto.'
  },
  {
    headline: 'FDA aprueba nuevo fármaco oncológico: terapia génica revolucionaria',
    body: 'La agencia reguladora estadounidense da luz verde al tratamiento más prometedor en décadas para ciertos tipos de cáncer, con tasas de remisión del 78%.',
    sector: 'ibex', mult: 1.048, positive: true, duration: 4,
    icon: '💊',
    finaiTip: '🔬 <strong>Catalizadores binarios en pharma</strong>: En el sector farmacéutico, la aprobación de la FDA es un evento "binario": o sube mucho o cae mucho. Los inversores especializados llaman a esto un "binary event". Es por eso que la inversión en farmacéuticas individuales es de alto riesgo — mejor exponerse al sector mediante ETFs de salud que diversifican entre decenas de compañías.'
  },
  {
    headline: 'Dólar rompe mínimos de 3 años frente al euro',
    body: 'La divisa americana cede terreno ante el euro tras datos de empleo peores de lo esperado en EEUU y expectativas de bajadas de tipos por parte de la FED.',
    sector: 'usa', mult: 0.968, positive: false, duration: 4,
    icon: '💸',
    finaiTip: '💱 <strong>Divisa y rentabilidad del inversor europeo</strong>: Si inviertes en ETFs denominados en dólares (S&P 500), un dólar débil reduce tu rentabilidad en euros incluso si las acciones americanas suben en dólares. Por eso existe el "riesgo divisa". Los ETFs con cobertura de divisa (EUR-Hedged) eliminan este riesgo, aunque tienen mayor coste.'
  },
  {
    headline: 'Apple supera 1.200M de usuarios activos: servicios baten estimaciones',
    body: 'La empresa de Cupertino reporta crecimiento récord en su segmento de servicios (App Store, Apple Music, iCloud), que ya representa el 25% de sus ingresos totales.',
    sector: 'tech', mult: 1.038, positive: true, duration: 3,
    icon: '🍎',
    finaiTip: '📈 <strong>Transición de hardware a servicios</strong>: Apple es el caso de estudio perfecto del modelo de negocio "razor and blades": vende hardware (iPhone) para crear el ecosistema y luego gana con servicios recurrentes de altísimo margen (70%+). Los negocios de suscripción tienen mayor valoración porque sus ingresos son predecibles — los inversores pagan más por predictibilidad.'
  },
  {
    headline: 'Tensión geopolítica: sanciones económicas elevan el oro +4%',
    body: 'La incertidumbre global dispara la demanda de activos refugio. El oro supera los 2.100$/oz mientras los inversores buscan protección ante la volatilidad de los mercados de renta variable.',
    sector: 'commodity', mult: 1.04, positive: true, duration: 5,
    icon: '🥇',
    finaiTip: '🛡️ <strong>El oro como activo refugio</strong>: En periodos de incertidumbre extrema, los inversores huyen hacia activos "seguros": oro, bonos del gobierno alemán (Bunds) y el franco suizo. El oro no genera dividendo ni interés, pero históricamente preserva el poder adquisitivo. Tener un 5-10% en tu cartera puede reducir la volatilidad total sin sacrificar mucha rentabilidad.'
  },
  {
    headline: 'Tesla anuncia planta de baterías en Europa: coste -40%',
    body: 'El fabricante americano confirma una inversión de €6.000M en su nueva Gigafactory europea, que reducirá el coste por kWh de sus baterías a niveles sin precedentes.',
    sector: 'tech', mult: 1.055, positive: true, duration: 3,
    icon: '🔋',
    finaiTip: '⚡ <strong>Economías de escala en manufactura</strong>: El efecto Learning Curve (curva de aprendizaje) en manufactura dice que cada vez que se dobla la producción acumulada, el coste por unidad cae entre un 15-25%. Tesla aplica esto a las baterías: más volumen → menores costes → mayor margen o menores precios → más ventas → más volumen. Es un moat difícil de copiar una vez consolidado.'
  },
  {
    headline: 'S&P 500 entra en corrección técnica: -10% desde máximos',
    body: 'El índice americano registra su mayor caída en 18 meses, técnicamente en "corrección" (caída >10%). Los analistas debaten si es una oportunidad de compra o el inicio de un mercado bajista.',
    sector: 'etf', mult: 0.945, positive: false, duration: 5,
    icon: '📉',
    finaiTip: '🎯 <strong>Correcciones vs mercados bajistas</strong>: Una corrección es una caída del 10-20% desde máximos. Un mercado bajista es >20%. Históricamente, el S&P 500 sufre una corrección cada 1,5 años de media y tarda 4 meses en recuperarla. Los inversores de largo plazo que mantienen su estrategia DCA en correcciones compran más participaciones por el mismo precio — es matemáticamente ventajoso si tu horizonte es >5 años.'
  },
];

let _econNewsShown = false; // anti-spam en la misma sesión (1 noticia a la vez)

function _checkEconomicNews() {
  if (_econNewsShown) return;       // no interrumpir si una ya está activa
  if (!S.userName) return;

  const idx  = Math.floor(Math.random() * ECON_NEWS.length);
  const news = ECON_NEWS[idx];

  // Aplicar efecto de precio a las acciones del sector afectado
  STOCKS.forEach(s => {
    const applies = news.sector === 'all' ||
                    s.sector === news.sector ||
                    (news.sector === 'tech'      && ['AAPL','MSFT','NVDA','TSLA','AMZN'].includes(s.ticker)) ||
                    (news.sector === 'etf'       && s.sector === 'etf') ||
                    (news.sector === 'commodity' && ['GOLD','OIL'].includes(s.ticker)) ||
                    (news.sector === 'ibex'      && s.sector === 'ibex') ||
                    (news.sector === 'usa'       && s.sector === 'usa');
    if (applies) {
      const jitter = 0.99 + Math.random() * 0.02;
      GAME.stockPrices[s.ticker] = +((GAME.stockPrices[s.ticker] || s.price) * news.mult * jitter).toFixed(2);
    }
  });

  // Guardar efecto temporal activo para referencia UI
  GAME.activeNewsEffect = {
    sector:  news.sector,
    mult:    news.mult,
    positive:news.positive,
    headline:news.headline,
    endsDay: (S.gameDay || 0) + (news.duration || 4),
  };

  _renderPriceTicker();
  _showBreakingNewsModal(news);
}

function _showBreakingNewsModal(news) {
  _econNewsShown = true;

  // Calcular impacto en cartera del jugador
  let portfolioImpact = 0;
  Object.entries(S.portfolio || {}).forEach(([ticker, pos]) => {
    if (!pos.shares || pos.shares <= 0) return;
    const stock = STOCKS.find(s => s.ticker === ticker);
    if (!stock) return;
    const applies = news.sector === 'all' ||
                    stock.sector === news.sector ||
                    (news.sector === 'tech' && ['AAPL','MSFT','NVDA','TSLA','AMZN'].includes(ticker)) ||
                    (news.sector === 'etf'  && stock.sector === 'etf');
    if (applies) {
      const price = GAME.stockPrices[ticker] || stock.price;
      portfolioImpact += price * pos.shares * (news.mult - 1);
    }
  });

  const impactSign = portfolioImpact >= 0 ? '+' : '';
  const impactStr  = impactSign + '€' + Math.abs(portfolioImpact).toFixed(0);
  const impactColor = portfolioImpact >= 0 ? '#00e5a0' : '#ff6b6b';

  const modal = document.getElementById('m-breaking-news');
  if (!modal) return;

  document.getElementById('bn-icon').textContent     = news.icon;
  document.getElementById('bn-headline').textContent = news.headline;
  document.getElementById('bn-body').textContent     = news.body;
  document.getElementById('bn-impact-val').textContent  = portfolioImpact !== 0 ? impactStr : '—';
  document.getElementById('bn-impact-val').style.color  = impactColor;
  document.getElementById('bn-sector-tag').textContent  = _sectorLabel(news.sector);
  document.getElementById('bn-duration').textContent = `Efecto: ${news.duration || 4} días de juego`;
  document.getElementById('bn-finai-tip').innerHTML  = news.finaiTip;

  const dirEl = document.getElementById('bn-direction');
  dirEl.textContent = news.positive ? '▲ Positivo para el sector' : '▼ Presión sobre el sector';
  dirEl.className   = 'bn-direction ' + (news.positive ? 'bn-dir-up' : 'bn-dir-down');

  modal.classList.add('active');

  // FinAI alert flotante con tip educativo tras 2s
  setTimeout(() => {
    _showNewsFinAIAlert(news);
  }, 2200);
}

function _closeBreakingNews() {
  const modal = document.getElementById('m-breaking-news');
  if (modal) modal.classList.remove('active');
  setTimeout(() => { _econNewsShown = false; }, 3000); // cooldown antes de permitir otra
}

function _showNewsFinAIAlert(news) {
  // Reutiliza el patrón de _showCrisisFinAIAlert
  let el = document.getElementById('finai-news-alert');
  if (!el) {
    el = document.createElement('div');
    el.id        = 'finai-news-alert';
    el.className = 'finai-float-alert';
    document.body.appendChild(el);
  }
  el.innerHTML = `
    <div class="ffa-header">
      <span class="ffa-avatar">🤖</span>
      <span class="ffa-name">FinAI</span>
      <span class="ffa-badge">Análisis de Mercado</span>
      <button class="ffa-close" onclick="this.closest('#finai-news-alert').style.opacity='0';setTimeout(()=>{this.closest('#finai-news-alert').style.display='none'},400)">✕</button>
    </div>
    <div class="ffa-body">${news.finaiTip}</div>`;
  el.style.display = 'flex';
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  requestAnimationFrame(() => {
    el.style.transition = 'opacity .4s, transform .4s';
    el.style.opacity    = '1';
    el.style.transform  = 'translateY(0)';
  });
  clearTimeout(el._closeTimer);
  el._closeTimer = setTimeout(() => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    setTimeout(() => { el.style.display = 'none'; }, 400);
  }, 10000);
}

function _sectorLabel(sector) {
  const map = {
    tech: '🖥 Tecnología', etf: '🌍 ETF / Índices', commodity: '🛢 Materias primas',
    ibex: '🇪🇸 IBEX 35', usa: '🇺🇸 Mercado EE.UU.', all: '📊 Mercado global',
    crypto: '🔷 Cripto', health: '💊 Salud',
  };
  return map[sector] || sector;
}

// Exponer al scope global
window._closeBreakingNews = _closeBreakingNews;


/* ══════════════════════════════════════════════════════════════════
   FEATURE 10: DASHBOARD DE ESTADÍSTICAS PERSONALES (s-stats)
   ─────────────────────────────────────────────────────────────────
   · Accesible desde s-profile via goTo('stats')
   · XP semanal: barras SVG puro (sin Chart.js)
   · Heatmap 90 días: cuadrícula SVG estilo GitHub
   · Comparativa vs medias hardcodeadas (top X%)
   · Módulos: barra de progreso visual + dots
   · Patrimonio diario: línea SVG puro
══════════════════════════════════════════════════════════════════ */

function renderStatsScreen() {
  if (!S.userName) return;

  const totalDays = S.daysActive || S.gameDay || 0;
  const totalMiss = S._mw_total_done || 0;
  const totalAchs = (S.unlockedAchs || []).length;
  const curStreak = S.streak || 0;
  const maxStreak = S.maxStreak || curStreak;

  _setStats('stat-days-val',      totalDays);
  _setStats('stat-missions-val',  totalMiss);
  _setStats('stat-achs-val',      totalAchs);
  _setStats('stat-streak-val',    curStreak + '\uD83D\uDD25');
  _setStats('stat-maxstreak-val', maxStreak);
  _setStats('stat-xp-val',        (S.xp || 0).toLocaleString('es'));
  _setStats('stat-mods-val',      (S.completedMods || []).length);

  _renderStatsModsProgress();
  _renderStatsXPBars();
  HEATMAP_render(); // use real-date heatmap
  _renderStatsComparativa();
  _renderStatsPatrimonyLine();
  _renderStatsStreakBar(curStreak, maxStreak);
}

function _setStats(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

/* ── 1. Barra de progreso de módulos ───────────────────────── */
function _renderStatsModsProgress() {
  const completed = (S.completedMods || []).length;
  const total     = (typeof MODULES !== 'undefined') ? MODULES.filter(function(m){return m&&typeof m.id==='number';}).length : 30;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

  const sub  = document.getElementById('st-mods-sub');
  const fill = document.getElementById('st-mods-fill');
  const pctEl= document.getElementById('st-mods-pct');
  const dots = document.getElementById('st-mods-dots');

  if (sub)  sub.textContent  = completed + ' de ' + total + ' completados';
  if (fill) fill.style.width = pct + '%';
  if (pctEl)pctEl.textContent= pct + '%';

  // Dots visuales — 1 dot por módulo (max 30 mostrados)
  if (dots) {
    const show = Math.min(total, 30);
    dots.innerHTML = Array.from({length: show}, (_, i) => {
      const done = i < completed;
      return '<div class="st-mod-dot' + (done ? ' done' : '') + '" title="M' + (i+1) + '"></div>';
    }).join('');
  }
}

/* ── 2. Barras SVG — XP por semana ─────────────────────────── */
function _renderStatsXPBars() {
  const wrap = document.getElementById('st-xp-svg-wrap');
  if (!wrap) return;

  // Distribuir el XP total en 8 semanas simuladas
  const xpTotal = S.xp || 0;
  const weeks   = 8;
  const points  = _buildWeeklyXP(xpTotal, weeks);
  const labels  = points.map((_, i) => 'S' + (i + 1));
  const values  = points;

  wrap.innerHTML = _buildBarsSVG(values, labels, {
    color: '#6366f1',
    labelColor: '#64748b',
    unit: 'XP',
    height: 140,
  });
}

// Genera datos semanales deterministas a partir del XP total y daysActive
function _buildWeeklyXP(xpTotal, weeks) {
  const days = Math.max(7, S.daysActive || S.gameDay || 7);
  const perWeek = [];
  // Simulación: distribución log-normal seeded por gameDay
  let remaining = xpTotal;
  const seed = S.gameDay || 1;
  for (let w = weeks - 1; w >= 0; w--) {
    const factor = 0.3 + ((seed * (w + 3)) % 100) / 200;
    const chunk = w === 0 ? remaining : Math.min(remaining, Math.round(xpTotal * factor / weeks));
    perWeek.unshift(Math.max(0, chunk));
    remaining = Math.max(0, remaining - chunk);
  }
  return perWeek;
}

/* ── 3. Heatmap 90 días estilo GitHub ───────────────────────── */
function _renderStatsHeatmap() {
  const wrap = document.getElementById('st-heatmap-wrap');
  if (!wrap) return;

  // Construir set de días activos desde patrimonyDaily (proxies de actividad)
  const activeDays = new Set();
  (S.patrimonyDaily || []).forEach(p => {
    if (p.day != null) activeDays.add(p.day);
  });
  // También contar loginDayCount como proxy
  const today     = S.gameDay || 0;
  const cellSize  = 10;
  const gap       = 2;
  const cols      = 13;  // 13 semanas ≈ 91 días
  const rows      = 7;
  const W         = cols * (cellSize + gap);
  const H         = rows * (cellSize + gap) + 20;

  let cells = '';
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const dayOffset = (cols - 1 - c) * 7 + (rows - 1 - r);
      const gameDay   = today - dayOffset;
      const active    = gameDay > 0 && (activeDays.has(gameDay) ||
                        // heurística: si es reciente y daysActive cubre este día
                        (gameDay > today - (S.daysActive || 0) && gameDay <= today));
      const intensity = active ? (gameDay > today - 7 ? '#00e5a0' :
                                  gameDay > today - 30 ? '#00b880' : '#00805a') :
                        'rgba(255,255,255,0.04)';
      const x = c * (cellSize + gap);
      const y = r * (cellSize + gap) + 18;
      cells += '<rect x="' + x + '" y="' + y + '" width="' + cellSize + '" height="' + cellSize + '"' +
               ' rx="2" fill="' + intensity + '">' +
               '<title>Día ' + (gameDay > 0 ? gameDay : '—') + (active ? ' \u2705' : '') + '</title>' +
               '</rect>';
    }
  }

  // Leyenda meses (3 meses aprox)
  const monthLabels = ['Hace 3m', 'Hace 2m', 'Hace 1m', 'Esta sem'];
  let mLabels = '';
  [0, 4, 8, 12].forEach((col, i) => {
    if (col < cols) {
      mLabels += '<text x="' + (col * (cellSize + gap)) + '" y="12"' +
                 ' font-size="8" fill="#475569">' + (monthLabels[i] || '') + '</text>';
    }
  });

  wrap.innerHTML =
    '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="max-width:' + W + 'px;display:block;margin:0 auto">' +
    mLabels + cells +
    '</svg>' +
    '<div class="st-heatmap-legend">' +
      '<span style="color:var(--text3);font-size:11px">Menos</span>' +
      '<div class="st-hm-sq" style="background:rgba(255,255,255,.04)"></div>' +
      '<div class="st-hm-sq" style="background:#00805a"></div>' +
      '<div class="st-hm-sq" style="background:#00b880"></div>' +
      '<div class="st-hm-sq" style="background:#00e5a0"></div>' +
      '<span style="color:var(--text3);font-size:11px">Más</span>' +
    '</div>';
}

/* ── 4. Comparativa vs medias hardcodeadas ──────────────────── */
function _renderStatsComparativa() {
  const rows = document.getElementById('st-compare-rows');
  if (!rows) return;

  const xp      = S.xp || 0;
  const streak  = S.streak || 0;
  const mods    = (S.completedMods || []).length;
  const patr    = S.patrimony || 0;
  const days    = S.daysActive || 1;

  // Medias ficticias de la "comunidad FinLearn"
  const AVG = { xp: 1200, streak: 5, mods: 8, patr: 28000, xpPerDay: 80 };

  function topPct(val, avg) {
    if (avg === 0) return 50;
    const ratio = val / avg;
    // Mapeamos ratio a percentil (inverso — más = mejor ranking)
    if (ratio >= 3)   return 1;
    if (ratio >= 2)   return 5;
    if (ratio >= 1.5) return 15;
    if (ratio >= 1)   return 30;
    if (ratio >= 0.7) return 50;
    return 70;
  }

  const metrics = [
    { icon: '\u26a1', label: 'XP total',       val: xp.toLocaleString('es') + ' XP',   pct: topPct(xp, AVG.xp),      avg: AVG.xp.toLocaleString('es') + ' XP' },
    { icon: '\uD83D\uDD25', label: 'Racha actual', val: streak + ' d\xedas',             pct: topPct(streak, AVG.streak), avg: AVG.streak + ' d\xedas' },
    { icon: '\uD83D\uDCDA', label: 'M\xf3dulos completados', val: mods + ' m\xf3dulos',  pct: topPct(mods, AVG.mods),   avg: AVG.mods + ' m\xf3dulos' },
    { icon: '\uD83D\uDCB0', label: 'Patrimonio', val: '\u20ac' + Math.round(patr).toLocaleString('es'), pct: topPct(patr, AVG.patr), avg: '\u20ac' + AVG.patr.toLocaleString('es') },
  ];

  rows.innerHTML = metrics.map(m => {
    const color = m.pct <= 10 ? '#f0b429' : m.pct <= 30 ? '#00e5a0' : 'var(--text2)';
    const barW  = Math.max(4, 100 - m.pct);
    return '<div class="st-cmp-row">' +
      '<div class="st-cmp-left">' +
        '<span class="st-cmp-icon">' + m.icon + '</span>' +
        '<div>' +
          '<div class="st-cmp-label">' + m.label + '</div>' +
          '<div class="st-cmp-avg">Media: ' + m.avg + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="st-cmp-right">' +
        '<div class="st-cmp-val" style="color:' + color + '">' + m.val + '</div>' +
        '<div class="st-cmp-top" style="color:' + color + '">Top ' + m.pct + '%</div>' +
        '<div class="st-cmp-bar-bg"><div class="st-cmp-bar-fill" style="width:' + barW + '%;background:' + color + '"></div></div>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* ── 5. Línea SVG patrimonio diario ─────────────────────────── */
function _renderStatsPatrimonyLine() {
  const wrap = document.getElementById('st-patrimony-svg-wrap');
  if (!wrap) return;

  const points = (S.patrimonyDaily || []).slice(-60);
  if (points.length < 2) {
    wrap.innerHTML = '<div class="stats-empty-chart">\uD83D\uDCC8 El gr\xe1fico aparecer\xe1 cuando lleves m\xe1s d\xedas jugando</div>';
    return;
  }

  const values = points.map(p => p.value || 0);
  const labels = points.map((p, i) => i % 10 === 0 ? 'D' + (p.day || i) : '');
  wrap.innerHTML = _buildLineSVG(values, labels, {
    color: '#f0b429',
    fill:  'rgba(240,180,41,0.12)',
    unit:  '\u20ac',
    height: 130,
  });
}

/* ── 6. Racha: barra progreso ───────────────────────────────── */
function _renderStatsStreakBar(current, max) {
  const fill = document.getElementById('stats-streak-fill');
  const curr = document.getElementById('stats-streak-current');
  const hist = document.getElementById('stats-streak-max');
  if (!fill) return;
  const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 100;
  fill.style.width = pct + '%';
  if (curr) curr.textContent = current;
  if (hist) hist.textContent = max;
}

/* ── SVG helpers genéricos ──────────────────────────────────── */
function _buildBarsSVG(values, labels, opts) {
  const W = 320, H = opts.height || 140;
  const padL = 32, padR = 8, padT = 10, padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const n = values.length;
  if (n === 0) return '';

  const maxV  = Math.max(...values, 1);
  const barW  = Math.floor(chartW / n * 0.6);
  const gap   = chartW / n;
  const color = opts.color || '#00e5a0';
  const unit  = opts.unit  || '';

  let bars = '', lbls = '', vlines = '';

  // Y grid lines (3)
  for (let i = 0; i <= 3; i++) {
    const y = padT + chartH - (i / 3) * chartH;
    const v = Math.round((i / 3) * maxV);
    vlines += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + y.toFixed(1) + '"' +
              ' stroke="rgba(255,255,255,.05)" stroke-width="1"/>';
    vlines += '<text x="' + (padL - 4) + '" y="' + (y + 3).toFixed(1) + '"' +
              ' text-anchor="end" font-size="8" fill="#475569">' +
              (v >= 1000 ? (v/1000).toFixed(0) + 'k' : v) + '</text>';
  }

  values.forEach((v, i) => {
    const bh  = Math.max(2, (v / maxV) * chartH);
    const x   = padL + i * gap + (gap - barW) / 2;
    const y   = padT + chartH - bh;
    const alpha = 0.5 + (i / n) * 0.5;
    bars += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '"' +
            ' width="' + barW + '" height="' + bh.toFixed(1) + '"' +
            ' rx="3" fill="' + color + '" opacity="' + alpha.toFixed(2) + '">' +
            '<title>' + (labels[i] || '') + ': ' + v.toLocaleString('es') + ' ' + unit + '</title>' +
            '</rect>';
    lbls += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (H - 6) + '"' +
            ' text-anchor="middle" font-size="9" fill="' + (opts.labelColor || '#64748b') + '">' +
            (labels[i] || '') + '</text>';
  });

  return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" preserveAspectRatio="xMidYMid meet">' +
         vlines + bars + lbls + '</svg>';
}

function _buildLineSVG(values, labels, opts) {
  const W = 320, H = opts.height || 130;
  const padL = 36, padR = 8, padT = 10, padB = 24;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const n = values.length;
  if (n < 2) return '';

  const minV  = Math.min(...values);
  const maxV  = Math.max(...values, minV + 1);
  const range = maxV - minV;
  const color = opts.color || '#00e5a0';
  const fill  = opts.fill  || 'rgba(0,229,160,0.1)';
  const unit  = opts.unit  || '';

  function px(i) { return padL + (i / (n - 1)) * chartW; }
  function py(v) { return padT + chartH - ((v - minV) / range) * chartH; }

  // Grid
  let grid = '';
  for (let i = 0; i <= 3; i++) {
    const y = padT + (i / 3) * chartH;
    const v = maxV - (i / 3) * range;
    grid += '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + y.toFixed(1) + '"' +
            ' stroke="rgba(255,255,255,.05)" stroke-width="1"/>';
    grid += '<text x="' + (padL - 4) + '" y="' + (y + 3).toFixed(1) + '"' +
            ' text-anchor="end" font-size="8" fill="#475569">' +
            (Math.abs(v) >= 1000 ? (v/1000).toFixed(0) + 'k' : Math.round(v)) + '</text>';
  }

  // Path
  const dLine = values.map((v, i) => (i === 0 ? 'M' : 'L') + px(i).toFixed(1) + ',' + py(v).toFixed(1)).join(' ');
  const dFill = dLine + ' L' + px(n-1).toFixed(1) + ',' + (padT + chartH) + ' L' + padL + ',' + (padT + chartH) + ' Z';

  // Labels
  let lbls = '';
  labels.forEach((l, i) => {
    if (l) lbls += '<text x="' + px(i).toFixed(1) + '" y="' + (H - 4) + '"' +
                   ' text-anchor="middle" font-size="8" fill="#475569">' + l + '</text>';
  });

  return '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" preserveAspectRatio="xMidYMid meet">' +
         grid +
         '<path d="' + dFill + '" fill="' + fill + '"/>' +
         '<path d="' + dLine + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linejoin="round"/>' +
         lbls +
         '</svg>';
}

window.renderStatsScreen = renderStatsScreen;






/* ══════════════════════════════════════════════════════════════════
   CAL — Rich Calendar System v1
   ─────────────────────────────────────────────────────────────────
   · Mapea S.gameDay → día/mes/año consistente
   · Estaciones (Primavera/Verano/Otoño/Invierno) con flavor text
     y pequeño bonus de mercado sectorial al cambio de estación
   · Eventos fijos: FED/BCE, IRPF, Black Friday, resultados...
   · UI: pill de reloj enriquecida + popover de calendario +
     card "Próximo evento" en home
   ─────────────────────────────────────────────────────────────────
   HOOKS EN CÓDIGO EXISTENTE (mínimos):
     · _updateGameClockUI()  → llama CAL._updateClock()
     · _tickGameDay()        → llama CAL._onTick(S.gameDay)
══════════════════════════════════════════════════════════════════ */

const CAL = (() => {

  // ── Nombres ──────────────────────────────────────────────────
  const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                       'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const MONTH_SHORT = ['Ene','Feb','Mar','Abr','May','Jun',
                       'Jul','Ago','Sep','Oct','Nov','Dic'];

  // ── Estaciones ───────────────────────────────────────────────
  //  · months: array de meses (1-12) que pertenecen a la estación
  //  · sectorBonus: multiplicador 1× aplicado UNA VEZ al entrar
  const SEASONS = {
    primavera: {
      months:[3,4,5], icon:'🌸', label:'Primavera', color:'#4ade80',
      flavor:'Mercados optimistas tras el invierno. Buen momento para revisar la cartera y rebalancear.',
      sectorBonus:{ ibex:1.015, tech:1.012, etf:1.010 },
    },
    verano: {
      months:[6,7,8], icon:'☀️', label:'Verano', color:'#f0b429',
      flavor:'Volumen bajo en agosto. Inversores de vacaciones. Volatilidad reducida — "sell in May".',
      sectorBonus:{ ibex:1.020, commodity:1.010, crypto:0.990 },
    },
    otoño: {
      months:[9,10,11], icon:'🍂', label:'Otoño', color:'#fb923c',
      flavor:'Vuelta a la actividad bursátil. Pre-Black Friday impulsa consumo y retail global.',
      sectorBonus:{ ibex:1.018, usa:1.015, etf:1.008 },
    },
    invierno: {
      months:[12,1,2], icon:'❄️', label:'Invierno', color:'#7dd3fc',
      flavor:'Rally de Navidad. Cierre contable de grandes fondos. Santa Claus Rally histórico.',
      sectorBonus:{ ibex:1.022, usa:1.018, crypto:0.985 },
    },
  };

  // ── Eventos fijos de calendario ──────────────────────────────
  //  · month/day: fecha en el año de juego (meses 1-12, días 1-30)
  //  · mult: multiplicador de precio que se aplica al sector el día del evento
  //    (1.000 = sin efecto directo, solo notificación educativa)
  const EVENTS = [
    {
      id:'año_nuevo',  month:1,  day:1,
      icon:'🎆', label:'Año Nuevo',
      desc:'Nuevo ejercicio fiscal. Revisa aportaciones a planes de pensiones (límite 1.500€/año).',
      sector:'all',  mult:1.010, positive:true,
    },
    {
      id:'fed_jan',    month:1,  day:29,
      icon:'🏦', label:'Reunión FED',
      desc:'Decisión de tipos de interés de la Reserva Federal. Los mercados ajustan valoraciones.',
      sector:'all',  mult:1.000, positive:true,
    },
    {
      id:'q4_earn',    month:2,  day:15,
      icon:'📊', label:'Resultados Q4',
      desc:'Grandes tecnológicas publican beneficios anuales. Alta volatilidad esperada en NASDAQ.',
      sector:'tech', mult:1.025, positive:true,
    },
    {
      id:'fed_mar',    month:3,  day:19,
      icon:'🏦', label:'Reunión FED',
      desc:'Primera reunión de primavera. Se publican proyecciones económicas del año (Dot Plot).',
      sector:'all',  mult:1.000, positive:true,
    },
    {
      id:'irpf',       month:4,  day:2,
      icon:'📝', label:'Campaña IRPF',
      desc:'Inicio de la declaración de la renta. Deducciones por planes de pensiones y fondos.',
      sector:'ibex', mult:0.998, positive:false,
    },
    {
      id:'q1_earn',    month:5,  day:8,
      icon:'📊', label:'Resultados Q1',
      desc:'Primer trimestre. Marca el tono del año para empresas tech y consumo.',
      sector:'tech', mult:1.020, positive:true,
    },
    {
      id:'fed_jun',    month:6,  day:11,
      icon:'🏦', label:'Reunión FED + BCE',
      desc:'Reunión de verano con proyecciones actualizadas. Doble impacto en renta fija y variable.',
      sector:'all',  mult:1.000, positive:true,
    },
    {
      id:'q2_earn',    month:8,  day:7,
      icon:'📊', label:'Resultados Q2 / S1',
      desc:'Resultados del primer semestre. Guía clave para el resto del año.',
      sector:'tech', mult:1.018, positive:true,
    },
    {
      id:'bce_sep',    month:9,  day:12,
      icon:'🏛️', label:'Reunión BCE',
      desc:'Banco Central Europeo decide tipos para la eurozona. Impacto en IBEX y bonos europeos.',
      sector:'ibex', mult:1.005, positive:true,
    },
    {
      id:'q3_earn',    month:11, day:5,
      icon:'📊', label:'Resultados Q3',
      desc:'Beneficios previos al Black Friday. Las empresas revelan guía de ventas navideñas.',
      sector:'usa',  mult:1.015, positive:true,
    },
    {
      id:'black_fri',  month:11, day:28,
      icon:'🛍️', label:'Black Friday',
      desc:'Ventas récord mundiales. Retail y consumo al alza: LVMH, Inditex y Amazon en el foco.',
      sector:'ibex', mult:1.035, positive:true,
    },
    {
      id:'fed_dec',    month:12, day:10,
      icon:'🏦', label:'FED diciembre',
      desc:'Última reunión del año. Proyecciones para 2025 y señales sobre política monetaria.',
      sector:'all',  mult:1.000, positive:true,
    },
    {
      id:'navidad',    month:12, day:24,
      icon:'🎄', label:'Navidad — Rally',
      desc:'Santa Claus Rally: el S&P 500 sube el 74% de los años en la última semana de diciembre.',
      sector:'usa',  mult:1.020, positive:true,
    },
  ];

  // ── Estado interno ────────────────────────────────────────────
  let _lastSeasonKey  = null;
  let _firedEvents    = {};  // { 'eventId_year': true }
  let _popoverOpen    = false;

  // ════════════════════════════════════════════════════════════
  // HELPERS PUROS
  // ════════════════════════════════════════════════════════════

  /**
   * Convierte S.gameDay (entero, días desde inicio) a un calendario legible.
   * Convenio: 30 días/mes, 12 meses/año = 360 + 5 días de ajuste absorbidos.
   * @returns {{ year:number, month:number, day:number, monthIdx:number }}
   */
  function dayToCalendar(gameDay) {
    const d         = Math.max(0, gameDay || 0);
    const year      = Math.floor(d / 365) + 1;
    const dayOfYear = d % 365;
    const monthIdx  = Math.min(11, Math.floor(dayOfYear / 30));
    const dayOfMonth = (dayOfYear % 30) + 1;
    return { year, month: monthIdx + 1, day: dayOfMonth, monthIdx };
  }

  /** Retorna la clave de estación ('primavera'|'verano'|'otoño'|'invierno') para un mes (1-12). */
  function getSeason(month) {
    for (const [key, s] of Object.entries(SEASONS)) {
      if (s.months.includes(month)) return key;
    }
    return 'invierno';
  }

  /**
   * Días que faltan para un evento dado desde la posición actual del calendario.
   * Retorna 0 si el evento es hoy, ≥1 en otro caso (da la vuelta al año si ya pasó).
   */
  function _daysUntil(evt, cal) {
    const curDOY = cal.monthIdx * 30 + (cal.day - 1);
    const evtDOY = (evt.month - 1) * 30 + (evt.day - 1);
    let diff = evtDOY - curDOY;
    if (diff < 0) diff += 365;
    return diff;
  }

  /** Devuelve el próximo evento con su distancia en días. */
  function getNextEvent(gameDay) {
    const cal = dayToCalendar(gameDay);
    let nearest = null;
    let minDays = Infinity;
    for (const evt of EVENTS) {
      const d = _daysUntil(evt, cal);
      if (d < minDays) { minDays = d; nearest = evt; }
    }
    return nearest ? { evt: nearest, days: minDays } : null;
  }

  /** Devuelve los N próximos eventos ordenados por proximidad. */
  function getUpcomingEvents(gameDay, count) {
    const cal = dayToCalendar(gameDay);
    count = count || 4;
    return EVENTS
      .map(evt => ({ evt, days: _daysUntil(evt, cal) }))
      .sort((a, b) => a.days - b.days)
      .slice(0, count);
  }

  // ════════════════════════════════════════════════════════════
  // LÓGICA DE TICK (llamada desde _tickGameDay)
  // ════════════════════════════════════════════════════════════

  function _onTick(gameDay) {
    const cal    = dayToCalendar(gameDay);
    const season = getSeason(cal.month);

    // ── Cambio de estación ──────────────────────────────────
    if (season !== _lastSeasonKey) {
      _lastSeasonKey = season;
      _applySeasonEffect(SEASONS[season]);
    }

    // ── Evento de calendario hoy ────────────────────────────
    for (const evt of EVENTS) {
      if (evt.month !== cal.month || evt.day !== cal.day) continue;
      const key = evt.id + '_' + cal.year;
      if (_firedEvents[key]) continue;
      _firedEvents[key] = true;
      setTimeout(() => _fireCalEvent(evt), 1200 + Math.random() * 800);
    }

    // ── Refrescar card "Próximo evento" ─────────────────────
    _renderNextEventCard(gameDay);
  }

  function _applySeasonEffect(season) {
    if (typeof STOCKS === 'undefined' || typeof GAME === 'undefined') return;

    // Ajuste sectorial de precios (una sola aplicación por estación)
    STOCKS.forEach(function(s) {
      const mult = season.sectorBonus[s.sector];
      if (!mult || mult === 1.0) return;
      const cur = GAME.stockPrices[s.ticker];
      if (!cur) return;
      GAME.stockPrices[s.ticker] = +(cur * mult).toFixed(2);
    });

    // Toast informativo de estación
    if (typeof toast === 'function') {
      toast(
        season.icon + ' ' + season.label,
        season.flavor,
        't-success'
      );
    }
  }

  function _fireCalEvent(evt) {
    // Impacto de mercado del evento (si mult !== 1.0)
    if (typeof STOCKS !== 'undefined' && typeof GAME !== 'undefined' &&
        evt.mult && evt.mult !== 1.000) {
      STOCKS.forEach(function(s) {
        if (evt.sector !== 'all' && s.sector !== evt.sector) return;
        const cur = GAME.stockPrices[s.ticker];
        if (!cur) return;
        const jitter = 0.995 + Math.random() * 0.010;
        GAME.stockPrices[s.ticker] = +(cur * evt.mult * jitter).toFixed(2);
      });
    }

    // Banner de mercado (usa la función existente)
    if (typeof _showNewsBanner === 'function') {
      _showNewsBanner({
        headline: evt.icon + ' <strong>' + evt.label + '</strong> — ' + evt.desc,
        positive: evt.positive,
      });
    }

    // Toast educativo breve
    if (typeof toast === 'function') {
      toast(evt.icon + ' ' + evt.label, evt.desc, evt.positive ? 't-success' : 't-warn');
    }

    // Actualizar card
    if (typeof S !== 'undefined') _renderNextEventCard(S.gameDay);
  }

  // ════════════════════════════════════════════════════════════
  // UI — PILL DEL RELOJ
  // ════════════════════════════════════════════════════════════

  function _updateClock() {
    const el = document.getElementById('game-clock');
    if (!el) return;

    if (typeof S === 'undefined') return;
    const cal    = dayToCalendar(S.gameDay);
    const season = getSeason(cal.month);
    const s      = SEASONS[season];

    el.innerHTML =
      '<span class="cal-season-icon">' + s.icon + '</span>' +
      '<span class="cal-date-text">Día\u00a0' + cal.day + '\u00a0·\u00a0' + MONTH_SHORT[cal.monthIdx] + '</span>' +
      '<span class="cal-year-text">Año\u00a0' + cal.year + '</span>';

    el.title = s.label + ' — ' + s.flavor;

    // También refrescar la card al actualizar el reloj (cubre primer render)
    _renderNextEventCard(S.gameDay);
  }

  // ════════════════════════════════════════════════════════════
  // UI — CARD "PRÓXIMO EVENTO" EN HOME
  // ════════════════════════════════════════════════════════════

  function _renderNextEventCard(gameDay) {
    const card = document.getElementById('next-event-card');
    if (!card) return;

    const next = getNextEvent(gameDay);
    if (!next) { card.style.display = 'none'; return; }

    const { evt, days } = next;
    const daysLabel = days === 0 ? '¡Hoy!' : days === 1 ? 'Mañana' : 'En\u00a0' + days + '\u00a0días';
    const urgency   = days === 0 ? 'nec-today' : days <= 3 ? 'nec-urgent' : days <= 7 ? 'nec-soon' : '';

    card.style.display = '';
    card.innerHTML =
      '<div class="nec-inner ' + urgency + '">' +
        '<div class="nec-left">' +
          '<div class="nec-eyebrow">📅 Próximo evento</div>' +
          '<div class="nec-label">' + evt.icon + ' ' + evt.label + '</div>' +
          '<div class="nec-desc">' + evt.desc + '</div>' +
        '</div>' +
        '<div class="nec-badge">' + daysLabel + '</div>' +
      '</div>';
  }

  // ════════════════════════════════════════════════════════════
  // UI — POPOVER DE CALENDARIO (clic en la pill del reloj)
  // ════════════════════════════════════════════════════════════

  function togglePopover() {
    if (_popoverOpen) { _closePopover(); return; }
    _openPopover();
  }

  function _openPopover() {
    _popoverOpen = true;

    var pop = document.getElementById('cal-popover');
    if (!pop) {
      pop = document.createElement('div');
      pop.id = 'cal-popover';
      pop.className = 'cal-popover';
      document.body.appendChild(pop);
      // Cerrar al clicar fuera (capture phase para evitar conflictos)
      document.addEventListener('click', _popoverOutsideClick, true);
    }

    if (typeof S === 'undefined') return;
    const cal      = dayToCalendar(S.gameDay);
    const season   = getSeason(cal.month);
    const s        = SEASONS[season];
    const upcoming = getUpcomingEvents(S.gameDay, 5);

    // Bonus estacionales formateados
    var bonusHtml = Object.entries(s.sectorBonus).map(function(entry) {
      var sec  = entry[0];
      var mult = entry[1];
      var pct  = ((mult - 1) * 100).toFixed(1);
      var sign = mult >= 1 ? '+' : '';
      var col  = mult >= 1 ? 'var(--accent)' : 'var(--danger)';
      return '<span class="csb-tag" style="color:' + col + '">' + sec + '\u00a0' + sign + pct + '%</span>';
    }).join('');

    // Lista de próximos eventos
    var eventsHtml = upcoming.map(function(item) {
      var evt  = item.evt;
      var d    = item.days;
      var dl   = d === 0 ? 'Hoy' : d === 1 ? 'Mañana' : d + 'd';
      var urgCls = d === 0 ? 'cpe-today' : d <= 3 ? 'cpe-urgent' : d <= 7 ? 'cpe-soon' : '';
      return '<div class="cpe ' + urgCls + '">' +
               '<span class="cpe-icon">' + evt.icon + '</span>' +
               '<div class="cpe-info">' +
                 '<div class="cpe-label">' + evt.label + '</div>' +
                 '<div class="cpe-desc">' + evt.desc + '</div>' +
               '</div>' +
               '<div class="cpe-days">' + dl + '</div>' +
             '</div>';
    }).join('');

    pop.innerHTML =
      '<div class="cap-header">' +
        '<div class="cap-date">' + s.icon + '\u00a0' + cal.day + ' de ' + MONTH_NAMES[cal.monthIdx] + ', Año ' + cal.year + '</div>' +
        '<div class="cap-season" style="color:' + s.color + '">' + s.label + '</div>' +
      '</div>' +
      '<div class="cap-season-desc">' + s.flavor + '</div>' +
      '<div class="cap-divider"></div>' +
      '<div class="cap-title">Próximos eventos</div>' +
      '<div class="cap-events">' + eventsHtml + '</div>' +
      '<div class="cap-divider"></div>' +
      '<div class="cap-title">Efecto estacional actual</div>' +
      '<div class="cap-season-bonuses">' + bonusHtml + '</div>';

    // Posicionar debajo del pill del reloj
    var clockEl = document.getElementById('game-clock');
    if (clockEl) {
      var r = clockEl.getBoundingClientRect();
      pop.style.top  = (r.bottom + 8) + 'px';
      pop.style.left = Math.max(8, r.left - 40) + 'px';
    }

    requestAnimationFrame(function() { pop.classList.add('cal-popover--open'); });
  }

  function _closePopover() {
    _popoverOpen = false;
    var pop = document.getElementById('cal-popover');
    if (!pop) return;
    pop.classList.remove('cal-popover--open');
    setTimeout(function() { if (pop.parentNode) pop.parentNode.removeChild(pop); }, 200);
    document.removeEventListener('click', _popoverOutsideClick, true);
  }

  function _popoverOutsideClick(e) {
    var pop     = document.getElementById('cal-popover');
    var clockEl = document.getElementById('game-clock');
    if (!pop) return;
    if (!pop.contains(e.target) && !(clockEl && clockEl.contains(e.target))) {
      _closePopover();
    }
  }

  // ── API pública ──────────────────────────────────────────────
  return {
    // Helpers puros (útiles desde otros módulos)
    dayToCalendar  : dayToCalendar,
    getSeason      : getSeason,
    getNextEvent   : getNextEvent,
    getUpcomingEvents: getUpcomingEvents,
    // Hooks llamados desde código existente
    _updateClock   : _updateClock,
    _onTick        : _onTick,
    // UI auxiliar
    _renderNextEventCard: _renderNextEventCard,
    togglePopover  : togglePopover,
  };

})();

window.CAL = CAL; // exponer para onclick="CAL.togglePopover()"

/* ══════════════════════════════════════════════════════════════════
   LEDGER — Historial de movimientos de dinero
   ─────────────────────────────────────────────────────────────────
   S.ledger = [{ ts, type, cat, desc, amount, balanceAfter }]
   · ts          → timestamp real (Date.now())
   · type        → 'in' | 'out'
   · cat         → 'salary'|'dividend'|'buy'|'sell'|'biz_buy'|'biz_revenue'|
                   'biz_upgrade'|'reward'|'mission'|'achievement'|'life_event'|
                   'mortgage'|'debt'|'fx'|'other'
   · desc        → texto corto para mostrar en UI
   · amount      → siempre positivo
   · balanceAfter→ S.cash después de la operación (snapshot)
══════════════════════════════════════════════════════════════════ */

const LEDGER_MAX = 200; // máximo de entradas en memoria

/**
 * _ledgerAdd — añade una entrada al ledger y actualiza la UI si está abierta.
 */
function _ledgerAdd(type, cat, desc, amount) {
  if (!S.ledger) S.ledger = [];
  const entry = {
    ts:           Date.now(),
    gameDay:      S.gameDay || 0,
    type,          // 'in' | 'out'
    cat,
    desc,
    amount:       Math.abs(amount),
    balanceAfter: Math.round(S.cash || 0),
  };
  S.ledger.unshift(entry);           // más reciente primero
  if (S.ledger.length > LEDGER_MAX) S.ledger.length = LEDGER_MAX;
  // Actualizar UI si la sección está visible
  _ledgerRenderIfOpen();
}

function _ledgerRenderIfOpen() {
  const el = document.getElementById('ledger-list');
  if (el && el.closest('#ledger-panel')?.style.display !== 'none') {
    renderLedger();
  }
}

/* ── Iconos por categoría ────────────────────────────────────── */
const _LEDGER_ICONS = {
  salary:      '💼', dividend:    '💸', buy:         '📈',
  sell:        '💵', biz_buy:     '🏪', biz_revenue: '🤑',
  biz_upgrade: '⬆️', reward:      '🎁', mission:     '🏆',
  achievement: '🥇', life_event:  '🎭', mortgage:    '🏠',
  debt:        '💳', fx:          '⚡', other:       '💰',
};

/* ── Render ──────────────────────────────────────────────────── */
function renderLedger() {
  const list = document.getElementById('ledger-list');
  if (!list) return;

  _initLedger();
  const entries = S.ledger || [];

  if (entries.length === 0) {
    list.innerHTML = `<div class="ldg-empty">Aún no hay movimientos. Compra una acción, cobra un dividendo o completa una misión.</div>`;
    return;
  }

  // Filtro activo
  const filter = document.getElementById('ledger-filter')?.value || 'all';
  const visible = filter === 'all'   ? entries
                : filter === 'in'    ? entries.filter(e => e.type === 'in')
                : filter === 'out'   ? entries.filter(e => e.type === 'out')
                :                     entries.filter(e => e.cat  === filter);

  // Totales del filtro visible
  const totalIn  = visible.filter(e => e.type === 'in').reduce((s,e) => s + e.amount, 0);
  const totalOut = visible.filter(e => e.type === 'out').reduce((s,e) => s + e.amount, 0);

  const summary = document.getElementById('ledger-summary');
  if (summary) {
    summary.innerHTML = `
      <span class="ldg-sum-in">+€${Math.round(totalIn).toLocaleString('es')}</span>
      <span class="ldg-sum-sep">/</span>
      <span class="ldg-sum-out">−€${Math.round(totalOut).toLocaleString('es')}</span>
      <span class="ldg-sum-net" style="color:${totalIn-totalOut>=0?'#00e5a0':'#ef4444'}">
        Neto ${totalIn-totalOut>=0?'+':''}€${Math.round(totalIn-totalOut).toLocaleString('es')}
      </span>`;
  }

  list.innerHTML = visible.slice(0, 80).map(e => {
    const icon = _LEDGER_ICONS[e.cat] || '💰';
    const sign = e.type === 'in' ? '+' : '−';
    const col  = e.type === 'in' ? '#00e5a0' : '#ef4444';
    const date = new Date(e.ts).toLocaleDateString('es-ES', { day:'2-digit', month:'short' });
    const time = new Date(e.ts).toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' });
    return `
      <div class="ldg-row">
        <div class="ldg-icon">${icon}</div>
        <div class="ldg-body">
          <div class="ldg-desc">${e.desc}</div>
          <div class="ldg-meta">${date} ${time} · Día ${e.gameDay} · Saldo: €${e.balanceAfter.toLocaleString('es')}</div>
        </div>
        <div class="ldg-amount" style="color:${col}">${sign}€${Math.round(e.amount).toLocaleString('es')}</div>
      </div>`;
  }).join('');
}

function _initLedger() {
  if (!Array.isArray(S.ledger)) S.ledger = [];
}

function toggleLedger() {
  const panel = document.getElementById('ledger-panel');
  if (!panel) return;
  const open = panel.style.display !== 'none';
  panel.style.display = open ? 'none' : 'block';
  if (!open) renderLedger();
}

/**
 * downloadLedgerCSV — exporta el historial de movimientos a CSV.
 * Campos: Fecha, Día juego, Tipo, Categoría, Descripción, Importe, Saldo tras operación
 * Usa Blob + URL.createObjectURL, sin librerías externas.
 */

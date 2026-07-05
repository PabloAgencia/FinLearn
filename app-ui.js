// ═══ UI — Dashboard ═══
/* ══════════════════════════════════════════════════════════════════
   ui-dashboard.js — Dashboard · Salud financiera · Sincronización UI · Identidad · Patrimonio · Gráfico XP
   ─ Importa solo lo necesario de data.js y state.js.
   ─ No importa de script.js → sin dependencias circulares.
   ─ Las funciones de negocio (addXP, etc.) se acceden via window.*
     porque script.js las expone al arrancar la app.
══════════════════════════════════════════════════════════════════ */



function renderFinancialProfile() {
  const r = S.expectedReturn / 100;
  const fv10 = calcCompound(S.patrimony, S.monthlyContribution, S.expectedReturn, 10);
  const fv20 = calcCompound(S.patrimony, S.monthlyContribution, S.expectedReturn, 20);
  const fv30 = calcCompound(S.patrimony, S.monthlyContribution, S.expectedReturn, 30);

  // Goal = 1M independence
  const indepGoal = 1000000;
  const indepPct = Math.min((S.patrimony / indepGoal * 100), 100).toFixed(1);

  function fmt(n) { return '€' + Math.round(n).toLocaleString('es'); }

  setEl('fpcard-total', fmt(S.patrimony));
  countUp('fpcard-total', Math.round(S.patrimony||0), 700, '€');
  setEl('fpcard-indep-pct', indepPct + '%');
  setEl('fpg-savings', fmt(S.cash));
  setEl('fpg-invested', fmt(S.invested));
  setEl('fpg-10y', fmt(fv10));
  setEl('fpg-20y', fmt(fv20));

  const bar = document.getElementById('fpcard-bar');
  if (bar) bar.style.width = Math.min(parseFloat(indepPct), 100) + '%';

  const healthScore = calcHealthScore();
  const healthLevel = getHealthLevel(healthScore);
  setEl('fpcard-health-pct', healthScore + '%');
  if (typeof renderDailyDelta === 'function') renderDailyDelta();
  const fpEl = document.getElementById('fpcard-total');
  if (fpEl) { fpEl.classList.remove('bump'); void fpEl.offsetWidth; fpEl.classList.add('bump'); }

  // Dynamic motivation message
  const msgs = [
    `Si mantienes <strong>€${S.monthlyContribution}/mes</strong> → <strong>${fmt(fv20)}</strong> en 20 años al ${S.expectedReturn}%.`,
    `Con tu patrimonio actual más <strong>€${S.monthlyContribution}/mes</strong>, en 10 años tendrás <strong>${fmt(fv10)}</strong>.`,
    `Cada módulo que completas equivale a <strong>€${Math.round(S.monthlyContribution * 0.08)} más</strong> en tu proyección futura.`,
    `¡Vas por buen camino! A este ritmo llegarás a <strong>${fmt(fv30)}</strong> en 30 años. 🚀`,
  ];
  setElHTML('fpcard-proj', msgs[Math.floor(Date.now()/10000) % msgs.length]);

  // Also update old patrimony elements if they exist
  const pa = document.getElementById('patr-amount');
  if (pa) pa.textContent = fmt(S.patrimony);
  const p10 = document.getElementById('patr-p10');
  if (p10) p10.textContent = fmt(fv10);
  const p20 = document.getElementById('patr-p20');
  if (p20) p20.textContent = fmt(fv20);
  renderPatrimonyChartAuto();
  if (typeof renderFirstPath === 'function') renderFirstPath();
  // F25: actualizar badge real en el hero card
  if (typeof _f25_renderHeroBadge === 'function') _f25_renderHeroBadge();
}


function updateFinPreview() {
  // Delegate to enriched version
  _updateFinPreviewOnboarding();
}


function renderHealthScore() {
  const score = calcHealthScore();
  const level = getHealthLevel(score);
  const circumference = 201; // 2π*32
  const offset = circumference - (score / 100) * circumference;

  const fg = document.getElementById('health-ring-fg');
  if (fg) {
    fg.style.strokeDashoffset = offset;
    fg.style.stroke = level.color;
  }
  setEl('health-score-num', score + '%');
  setEl('health-title', level.label + ' · ' + score + '%');
  setEl('health-sub', score < 40
    ? 'Completa módulos y mantén tu racha para mejorar'
    : score < 70
      ? 'Buen progreso — invierte más para subir al siguiente nivel'
      : '¡Excelente salud financiera! Estás en el top de usuarios');

  const factors = [
    {name:'EMERGENCIA', val:Math.min(100,Math.round((S.cash/3000)*100)), color:'#00e5a0'},
    {name:'INVERSIÓN', val:Math.min(100,Math.round((S.invested/(S.patrimony||1))*200)), color:'#0091ff'},
    {name:'CONSTANCIA', val:Math.min(100,Math.round((S.streak/30)*100)), color:'#ff6b35'},
    {name:'APRENDIZAJE', val:Math.min(100,Math.round((S.completedMods.length/((typeof MODULES!=='undefined')?MODULES.filter(function(m){return m&&typeof m.id==='number';}).length:30))*100)), color:'#a855f7'},
  ];

  const fEl = document.getElementById('health-factors');
  if (fEl) {
    fEl.innerHTML = factors.map(f => `
      <div class="hf-item">
        <div class="hf-name">${f.name}</div>
        <div class="hf-bar"><div class="hf-fill" style="width:${f.val}%;background:${f.color};"></div></div>
        <div class="hf-val" style="color:${f.color};">${f.val}%</div>
      </div>`).join('');
  }
}


function renderDynamicMessage() {
  const wrap = document.getElementById('dyn-banner-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';

  const today = new Date().toISOString().slice(0,10);
  const lastDate = S.lastVisit;
  const daysSince = Math.floor((new Date(today) - new Date(lastDate)) / 86400000);

  let msg = null;

  const _dcaHint = !S.dcaDone ? ' <strong>⚠️ Acción Diaria pendiente</strong> — respóndela para mantener tu racha.' : '';
  if (daysSince >= 7) {
    msg = {type:'info', icon:'👋', text:`<strong>¡Bienvenido de vuelta!</strong> Llevas ${daysSince} días sin pasar por aquí. Tu patrimonio no puede esperar — retomemos donde lo dejaste.${_dcaHint}`};
  } else if (daysSince >= 3) {
    msg = {type:'warn', icon:'⏰', text:`<strong>Han pasado ${daysSince} días.</strong> La constancia es la clave — los inversores que revisan su progreso semanalmente obtienen un 40% más de rentabilidad emocional.${_dcaHint}`};
  } else if (!S.dcaDone) {
    msg = {type:'warn', icon:'⚠️', text:`<strong>Tu racha de ${S.streak} días está en riesgo.</strong> Responde la Acción Diaria para mantenerla.`};
  } else if (S.streak >= 30) {
    msg = {type:'ok', icon:'💎', text:`<strong>Racha de ${S.streak} días — Leyenda.</strong> Estás en el top 1% de FinLearn. Tu constancia es tu mayor activo.`};
  } else if (S.streak >= 14) {
    msg = {type:'fire', icon:'🏆', text:`<strong>Racha de ${S.streak} días — nivel elite.</strong> Solo el 8% de usuarios llega a esto. Eres un referente.`};
  } else if (S.streak >= 7) {
    msg = {type:'fire', icon:'🔥', text:`<strong>¡Racha de ${S.streak} días!</strong> Estás en el top 20% de usuarios constantes. ¡No pares ahora!`};
  } else if (S.completedMods.length === 0) {
    msg = {type:'info', icon:'💡', text:`<strong>Completa tu primer módulo hoy.</strong> Los usuarios que terminan el primero tienen 5× más probabilidad de llegar a la semana 4.`};
  } else if (S.completedMods.length >= 5) {
    msg = {type:'ok', icon:'📈', text:`<strong>Ya has completado ${S.completedMods.length} módulos.</strong> Vas por delante del 87% de nuevos usuarios. ¡Sigue!`};
  }

  if (msg) {
    wrap.innerHTML = `
      <div class="dyn-banner type-${msg.type}" style="margin-bottom:12px;">
        <div class="dyn-banner-icon">${msg.icon}</div>
        <div class="dyn-banner-text">${msg.text}</div>
      </div>`;
  }
}


/* ── P4-A: Banner "Racha en riesgo" (≥20:00 sin actividad hoy) ── */
function renderStreakRiskBanner() {
  const host = document.getElementById('streak-risk-banner-host');
  if (!host) return;
  host.innerHTML = '';
  if (!S.streak || S.streak < 1) return;
  const today = new Date().toISOString().slice(0, 10);
  const studied = S.activityLog && S.activityLog[today];
  const hour    = new Date().getHours();
  // Rachas largas reciben aviso más temprano — más valioso proteger
  const riskHour = S.streak >= 14 ? 17 : S.streak >= 7 ? 18 : S.streak >= 3 ? 19 : 20;
  if (studied || hour < riskHour) return;
  const shields = S.streakShields || 0;
  const shieldNote = shields > 0
    ? ` <span style="opacity:.8">(tienes ${shields} escudo${shields>1?'s':''} — se usará automáticamente si pierdes el día)</span>`
    : '';
  host.innerHTML = `
    <div class="streak-risk-banner" onclick="this.parentElement.innerHTML=''">
      <span class="srb-icon">⚠️</span>
      <span class="srb-text">
        <strong>Tu racha de ${S.streak} día${S.streak>1?'s':''} está en riesgo.</strong>
        Responde la Acción Diaria antes de medianoche para mantenerla.${shieldNote}
      </span>
      <span class="srb-close">✕</span>
    </div>`;
}
window.renderStreakRiskBanner = renderStreakRiskBanner;

function renderTemporalProgress() {
  const days = S.daysActive || 1;
  setEl('ts-days', days);
  setEl('ts-streak', S.streak + '🔥');
  setEl('ts-mods', S.completedMods.length);

  const MILESTONES = [
    {days:1,  label:'Primer día completado', xp:50},
    {days:7,  label:'Racha de 7 días', xp:100},
    {days:30, label:'Mes de constancia', xp:200},
    {days:90, label:'Nivel Analista desbloqueado', xp:1000},
    {days:180,label:'Nivel Inversor — top 5%', xp:2000},
    {days:365,label:'Independencia Financiera — leyenda', xp:5000},
  ];

  const el = document.getElementById('temporal-milestones');
  if (!el) return;
  el.innerHTML = MILESTONES.map(m => {
    const done = days >= m.days;
    const isNext = !done && MILESTONES.filter(x=>days>=x.days).length === MILESTONES.indexOf(m);
    const daysLeft = Math.max(0, m.days - days);
    return `
      <div class="tm-row">
        <div class="tm-dot ${done?'done':isNext?'next':'future'}"></div>
        <div class="tm-text ${done?'done':''}">${done?'✅ ':''}<b>Día ${m.days}:</b> ${m.label} · +${m.xp} XP</div>
        <div class="tm-days">${done ? 'Logrado' : daysLeft + 'd'}</div>
      </div>`;
  }).join('');
}


/* ── Lecciones & Módulos ──────────────────────────────────── */


function updateUIFromState() {
  _restoreTheme();
  // Show FinAI FAB once user is set up
  const fab = document.getElementById('finai-fab');
  if (fab) fab.style.display = S.userName ? 'flex' : 'none';
  // ── Nav bar ────────────────────────────────────────────────────────
  if (typeof F33_updateNavStreak === 'function') F33_updateNavStreak(); else setEl('nav-streak', S.streak);
  if (typeof _updateShieldUI === 'function') _updateShieldUI();
  // XP animado: cuenta de valor anterior al nuevo
  const _xpEl = document.getElementById('nav-xp');
  if (_xpEl && typeof _animateNum === 'function') {
    const _prevXP = parseInt(_xpEl.dataset.val || S.xp, 10);
    if (_prevXP !== S.xp && _prevXP > 0) _animateNum(_xpEl, _prevXP, S.xp);
    else _xpEl.textContent = S.xp.toLocaleString('es') + ' XP';
    _xpEl.dataset.val = S.xp;
  } else {
    setEl('nav-xp', S.xp.toLocaleString('es') + ' XP');
  }
  // Streak glow: la pill de fuego brilla cuando hay racha activa
  const _sPill = document.getElementById('nav-streak')?.closest?.('.nav-pill');
  if (_sPill) {
    _sPill.classList.toggle('streak-lit',  S.streak > 0);
    _sPill.classList.toggle('streak-fire', S.streak >= 7);
  }
  // Streak banner visible en home
  (function() {
    var _sb = document.getElementById('home-streak-banner');
    if (!_sb) return;
    var streak = S.streak || 0;
    if (streak === 0) { _sb.style.display = 'none'; return; }
    var msg = streak >= 30 ? '¡Racha legendaria! Eres imparable.' :
              streak >= 14 ? '¡Dos semanas seguidas! Extraordinario.' :
              streak >= 7  ? '¡Una semana completa! Increíble.' :
              streak >= 3  ? 'La constancia marca la diferencia.' :
                             'Buen comienzo. ¡Sigue así!';
    var nextMilestone = streak < 3 ? 3 : streak < 7 ? 7 : streak < 14 ? 14 : streak < 30 ? 30 : null;
    var progressPct = nextMilestone ? Math.round((streak / nextMilestone) * 100) : 100;
    var color = streak >= 30 ? '#a855f7' : streak >= 14 ? '#f0b429' : streak >= 7 ? '#ff6b35' : '#00e5a0';
    _sb.style.display = 'block';
    _sb.innerHTML = '<div style="display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.04);border:1px solid ' + color + '30;border-radius:14px;padding:10px 14px;">' +
      '<span style="font-size:26px;flex-shrink:0;">🔥</span>' +
      '<div style="flex:1;min-width:0;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
          '<span style="font-size:13px;font-weight:700;color:var(--text1);">' + streak + ' días de racha</span>' +
          (nextMilestone ? '<span style="font-size:10px;color:var(--text3);">Meta: ' + nextMilestone + ' días</span>' : '<span style="font-size:10px;color:' + color + ';">¡Máximo nivel!</span>') +
        '</div>' +
        '<div style="height:3px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden;">' +
          '<div style="height:100%;width:' + progressPct + '%;background:' + color + ';border-radius:2px;transition:width .4s ease;"></div>' +
        '</div>' +
        '<div style="font-size:11px;color:var(--text3);margin-top:3px;">' + msg + '</div>' +
      '</div>' +
    '</div>';
  })();
  // Avatar: solo poner el emoji como fallback si NO hay sprite inyectado
  // (setEl borraría el <img class="fl-gen-av"> que inyecta AVATAR_AI.apply)
  ['home-nav-av', 'prof-av'].forEach(function(_avId) {
    var _avEl = document.getElementById(_avId);
    if (_avEl && !_avEl.querySelector('.fl-gen-av')) _avEl.textContent = S.avatar || '🌱';
  });
  if (S.userName && typeof AVATAR_AI !== 'undefined') AVATAR_AI.apply(S.avatarName || S.userName);

  // ── Profile hero ───────────────────────────────────────────────────
  setEl('prof-name',  S.userName || 'Mi perfil');
  setEl('cert-name',  S.userName || 'Usuario');

  // Handle dinámico: nombre + nivel + título de identidad
  const idLevel   = _getIdentityLevel();
  const idTitles  = ['Aprendiz','Analista','Inversor','Libre','Maestro'];
  const idTitle   = idTitles[Math.min(idLevel, idTitles.length - 1)];
  // P4-B: título de rango por XP
  const rankTitle = getLevelTitle(S.xp);
  const handle    = '@' + (S.userName || 'usuario').toLowerCase().replace(/\s+/g,'') +
                    ' · Nivel ' + S.level + ' · ' + (S.avatar || '🌱') + ' ' + idTitle;
  setEl('prof-handle', handle);
  // Mostrar el título de rango P4-B en el perfil
  const rankBadgeEl = document.getElementById('prof-rank-title');
  if (rankBadgeEl) {
    rankBadgeEl.textContent = rankTitle.icon + ' ' + rankTitle.title;
    rankBadgeEl.style.color = rankTitle.color;
  }

  // Estadísticas de perfil (antes hardcodeadas)
  setEl('prof-xp-total',     S.xp.toLocaleString('es'));
  setEl('prof-streak-val',   '🔥' + S.streak);
  setEl('prof-modules-count', S.completedMods.length);
  // prof-friends-count: feature pendiente de backend

  // ── Goal tracker ───────────────────────────────────────────────────
  setEl('gt-goal-text',  S.goalLabel);
  setEl('prof-goal-txt', S.goalLabel);
  const _gtTotal = (typeof MODULES!=='undefined') ? MODULES.filter(function(m){return m&&typeof m.id==='number';}).length : 131;
  const pct = Math.round((S.completedMods.length / _gtTotal) * 100);
  setEl('gt-pct', pct + '%');
  const fill = document.getElementById('gt-fill');
  if (fill) fill.style.width = pct + '%';

  // ── Level badge (ranking screen) ───────────────────────────────────
  setEl('lb-num', S.level);

  // ── Percentile (calculado determinísticamente desde XP real) ───────
  const percData = _calcPercentile();
  // Home hero
  setEl('home-perc-num',   percData.pct + '%');
  setEl('home-perc-count', percData.ahead.toLocaleString('es') + ' personas');
  // Profile card
  setEl('prof-percentile',   'Top ' + (100 - percData.pct) + '%');
  setEl('prof-ahead-count',  percData.ahead.toLocaleString('es') + ' usuarios');
  // Celebration modal
  setEl('cel-streak', '🔥' + S.streak);
  setEl('cel-rank',   'Top ' + (100 - percData.pct) + '%');
  // Cert rank
  setEl('cert-rank',  'Top ' + (100 - percData.pct) + '%');

  // ── Level bar in home hero ─────────────────────────────────────────
  const _lvl = Math.min((S.level || 1), 50);
  const _xpThis  = (typeof LEVEL_XP_THRESHOLDS !== 'undefined') ? (LEVEL_XP_THRESHOLDS[_lvl - 1] || 0) : (_lvl - 1) * 500;
  const _xpNext  = (typeof LEVEL_XP_THRESHOLDS !== 'undefined') ? (LEVEL_XP_THRESHOLDS[_lvl] || LEVEL_XP_THRESHOLDS[LEVEL_XP_THRESHOLDS.length - 1]) : _lvl * 500;
  const _xpInLvl = Math.max(0, S.xp - _xpThis);
  const _xpRange = Math.max(1, _xpNext - _xpThis);
  const xpPct    = Math.round((_xpInLvl / _xpRange) * 100);
  const xpToNext = Math.max(0, _xpNext - S.xp);
  const fillEl   = document.getElementById('xp-level-fill');
  if (fillEl) fillEl.style.width = xpPct + '%';
  const isMax = _lvl >= 50;
  setEl('home-level-lbl',  isMax ? 'Lv.50 MAX' : 'Lv.' + _lvl + '→' + (_lvl + 1));
  setEl('home-xp-to-next', isMax ? '¡Nivel máximo! · ' : xpToNext.toLocaleString('es') + ' XP para subir · ');
  // P4-B: mostrar título de rango en home hero
  const homeRankEl = document.getElementById('home-rank-title');
  if (homeRankEl) {
    homeRankEl.textContent = rankTitle.icon + ' ' + rankTitle.title;
    homeRankEl.style.color = rankTitle.color;
  }
  if (rankTitle.next) {
    const homeRankNextEl = document.getElementById('home-rank-next');
    if (homeRankNextEl)
      homeRankNextEl.textContent = rankTitle.next.minXP.toLocaleString('es') + ' XP → ' + rankTitle.next.title;
  }

  // ── Ranking — mi posición real dentro de RANKINGS ─────────────────
  _updateMyRankPosition();

  // ── Ranking week badge ─────────────────────────────────────────────
  const weekNum = Math.max(1, Math.floor(S.daysActive / 7) + 1);
  setEl('rank-week-badge', 'Semana ' + weekNum);

  // ── Viral share modal ──────────────────────────────────────────────
  setEl('vcp-streak', '🔥' + S.streak);
  setEl('vcp-stage',  rankTitle.icon + ' ' + rankTitle.title + ' · Nivel ' + S.level);

  // ── Profile goal section (separate from home gt-fill) ────────────
  const profGoalPct  = document.getElementById('prof-goal-pct');
  const profGoalFill = document.getElementById('prof-goal-fill');
  if (profGoalPct)  profGoalPct.textContent = pct + '%';
  if (profGoalFill) profGoalFill.style.width = pct + '%';

  // ── Time to goal (profile) ────────────────────────────────────────
  const timeEl = document.getElementById('prof-time-to-goal');
  if (timeEl) {
    const _gtTotal2 = (typeof MODULES!=='undefined') ? MODULES.filter(function(m){return m&&typeof m.id==='number';}).length : 131;
    const modsLeft = Math.max(0, _gtTotal2 - (S.completedMods || []).length);
    if (modsLeft === 0) {
      timeEl.textContent = '¡Completado!';
    } else {
      const daysPerMod = S.daysActive > 0 && (S.completedMods||[]).length > 0
        ? S.daysActive / (S.completedMods||[]).length
        : 3; // assume 1 mod every 3 days if no history
      const months = Math.max(1, Math.round((modsLeft * daysPerMod) / 30));
      timeEl.textContent = '~' + months + (months === 1 ? ' mes' : ' meses');
    }
  }

  // ── RPG multiplier badge ──────────────────────────────────────────
  const multBadge = document.getElementById('rpg-multiplier-badge');
  const multVal   = document.getElementById('rpg-mult-val');
  if (S.streak >= 3 && multBadge) {
    const mult = S.streak >= 14 ? 2.0 : S.streak >= 7 ? 1.5 : 1.25;
    if (multVal) multVal.textContent = '×' + mult.toFixed(2).replace('.00','');
    multBadge.style.display = 'flex';
  } else if (multBadge) {
    multBadge.style.display = 'none';
  }

  // ── Patr card (virtual patrimony widget) ─────────────────────────
  const patrimony = Math.round(S.patrimony || 0);
  setEl('patr-amount', '€' + patrimony.toLocaleString('es'));
  countUp('patr-amount', Math.round(S.patrimony||0), 900, '€');
  const goalTarget = 500000; // €500k = financial freedom target
  const patrPct = Math.min(100, Math.round((patrimony / goalTarget) * 100));
  setEl('patr-pct', patrPct + '%');
  const patrFill = document.getElementById('patr-fill');
  if (patrFill) patrFill.style.width = patrPct + '%';
  if (patrimony > 0) {
    const todayGain = Math.round(S.monthlyContribution || 200);
    setEl('patr-change', '↑ +€' + todayGain + '/mes · creciendo');
  }

  // ── Identity granular spans ───────────────────────────────────────
  const modsSpan2 = document.getElementById('identity-modules-count');
  if (modsSpan2) modsSpan2.textContent = (S.completedMods || []).length;
  const xpSpan2   = document.getElementById('identity-xp-count');
  if (xpSpan2)   xpSpan2.textContent   = (S.xp || 0).toLocaleString('es');

  // ── Progreso dinámico spans ────────────────────────────────────────
  updateProgressText();

  // ── Sync baked sections that cache state values ───────────────────
  refreshSettingsSection();
}


function refreshUI() {
  // ── 1. Modules grid (locked/done/progress rings) ──────────────────
  renderModules();

  // ── 2. Progress bar + "X de N módulos" text ──────────────────────
  updateProgressText();
  const _totalMods = (typeof MODULES !== 'undefined') ? MODULES.filter(function(m){return m&&typeof m.id==='number';}).length : 30;
  const pct  = Math.round((S.completedMods.length / _totalMods) * 100);
  const fill = document.getElementById('gt-fill');
  if (fill) fill.style.width = pct + '%';
  const gtPct = document.getElementById('gt-pct');
  if (gtPct) gtPct.textContent = pct + '%';

  // ── 3. XP bar + level (home hero) ─────────────────────────────────
  const _lvl2 = Math.min((S.level || 1), 50);
  const _xpThis2  = (typeof LEVEL_XP_THRESHOLDS !== 'undefined') ? (LEVEL_XP_THRESHOLDS[_lvl2 - 1] || 0) : (_lvl2 - 1) * 500;
  const _xpNext2  = (typeof LEVEL_XP_THRESHOLDS !== 'undefined') ? (LEVEL_XP_THRESHOLDS[_lvl2] || LEVEL_XP_THRESHOLDS[LEVEL_XP_THRESHOLDS.length - 1]) : _lvl2 * 500;
  const _xpInLvl2 = Math.max(0, S.xp - _xpThis2);
  const _xpRange2 = Math.max(1, _xpNext2 - _xpThis2);
  const xpPct2    = Math.round((_xpInLvl2 / _xpRange2) * 100);
  const xpFill    = document.getElementById('xp-level-fill');
  if (xpFill) xpFill.style.width = xpPct2 + '%';
  const isMax2 = _lvl2 >= 50;
  setEl('home-xp-to-next', isMax2 ? '¡Nivel máximo! · ' : Math.max(0, _xpNext2 - S.xp).toLocaleString('es') + ' XP para subir · ');
  setEl('home-level-lbl',  isMax2 ? 'Lv.50 MAX' : 'Lv.' + _lvl2 + '→' + (_lvl2 + 1));
  setEl('nav-xp',          S.xp.toLocaleString('es') + ' XP');
  if (typeof F33_updateNavStreak === 'function') F33_updateNavStreak(); else setEl('nav-streak', S.streak);
  setEl('lb-num',          S.level);

  // ── 4. Full state sync (percentile, rank, profile, patrimony…) ────
  updateUIFromState();

  // ── 5. Health score + identity card ───────────────────────────────
  if (typeof renderHealthScore     === 'function') renderHealthScore();
  if (typeof renderIdentity        === 'function') renderIdentity();
  if (typeof renderFinancialProfile === 'function') renderFinancialProfile();
  if (typeof renderTemporalProgress === 'function') renderTemporalProgress();
}


function syncAllData() {
  const n   = (S.completedMods || []).length;
  const _totalMods = (typeof MODULES !== 'undefined') ? MODULES.filter(function(m){return m&&typeof m.id==='number';}).length : 30;
  const pct = Math.round((n / _totalMods) * 100);

  // ── 1. Dashboard: "X de N módulos" (todas las instancias) ──────────
  const dashText = n + ' de ' + _totalMods;
  const el1 = document.getElementById('progress-text');
  const el2 = document.getElementById('progress-text-profile');
  if (el1) el1.textContent = dashText;
  if (el2) el2.textContent = dashText;

  // ── 2. Barra de progreso principal ──────────────────────────────────
  const fill = document.getElementById('gt-fill');
  if (fill) fill.style.width = pct + '%';
  const gtPct = document.getElementById('gt-pct');
  if (gtPct) gtPct.textContent = pct + '%';

  // ── 3. Perfil: módulos completados + barra XP ───────────────────────
  const _lvl3 = Math.min((S.level || 1), 50);
  const _xpThis3  = (typeof LEVEL_XP_THRESHOLDS !== 'undefined') ? (LEVEL_XP_THRESHOLDS[_lvl3 - 1] || 0) : (_lvl3 - 1) * 500;
  const _xpNext3  = (typeof LEVEL_XP_THRESHOLDS !== 'undefined') ? (LEVEL_XP_THRESHOLDS[_lvl3] || LEVEL_XP_THRESHOLDS[LEVEL_XP_THRESHOLDS.length - 1]) : _lvl3 * 500;
  const _xpInLvl3 = Math.max(0, S.xp - _xpThis3);
  const _xpRange3 = Math.max(1, _xpNext3 - _xpThis3);
  const xpPct     = Math.round((_xpInLvl3 / _xpRange3) * 100);
  const xpFill    = document.getElementById('xp-level-fill');
  if (xpFill) xpFill.style.width = xpPct + '%';
  const isMax3 = _lvl3 >= 50;
  setEl('home-xp-to-next', isMax3 ? '¡Nivel máximo! · ' : Math.max(0, _xpNext3 - S.xp).toLocaleString('es') + ' XP para subir · ');
  setEl('home-level-lbl',  isMax3 ? 'Lv.50 MAX' : 'Lv.' + _lvl3 + '→' + (_lvl3 + 1));
  setEl('nav-xp',          S.xp.toLocaleString('es') + ' XP');
  if (typeof F33_updateNavStreak === 'function') F33_updateNavStreak(); else setEl('nav-streak', S.streak);
  setEl('lb-num',          S.level);
  setEl('prof-modules-count', n);

  // ── 4. Delegate full render to refreshUI (modules grid, rank, etc.) ─
  refreshUI();
}


/* ── Grid de módulos ──────────────────────────────────────── */


function updateProjection() {
  const monthly = +document.getElementById('proj-slider').value;
  document.getElementById('proj-slider-val').textContent = monthly + '€';
  const r = 0.08/12, n10 = 120, n30 = 360;
  const fv = (m, n) => m * ((Math.pow(1+r,n)-1)/r);
  document.getElementById('proj-10y').textContent = '€' + Math.round(fv(monthly,n10)).toLocaleString('es');
  document.getElementById('proj-30y').textContent = '€' + Math.round(fv(monthly,n30)).toLocaleString('es');
}


/* ── Renderizado de pasos (contenido, quiz, final) ─────────── */


function updateDCALock(unlock = false) {
  const lockedEls = document.querySelectorAll('.content-locked');
  lockedEls.forEach(el => {
    if (unlock || S.dcaDone) {
      el.classList.add('content-unlocked');
      el.classList.add('unlocking');
    } else {
      el.classList.remove('content-unlocked');
    }
  });
}


function updatePatrimony(xpGained = 0) {
  // Each XP point = ~€0.05 of "virtual patrimony" (narrative, not real)
  const gained = xpGained * 0.05;
  S.patrimony += gained;
  S.totalXPtoday += xpGained;

  const r = 0.08/12, monthly = S.monthlyContribution;
  const fv = (m, n) => Math.round(m * ((Math.pow(1+r,n)-1)/r));

  const p10 = fv(monthly, 120);
  const p20 = fv(monthly, 240);

  // Patrimony % toward independence goal (1M€ = 100%)
  const goal = 1000000;
  const pct = Math.min(Math.round((S.patrimony / goal) * 100 * 100) / 100, 100);

  // Update DOM
  const amtEl = document.getElementById('patr-amount');
  if (amtEl) {
    amtEl.textContent = '€' + Math.round(S.patrimony).toLocaleString('es');
    amtEl.classList.remove('bump');
    void amtEl.offsetWidth;
    amtEl.classList.add('bump');
  }
  const changeEl = document.getElementById('patr-change');
  if (changeEl) changeEl.textContent = `↑ +€${gained.toFixed(2)} ahora · +€${(S.totalXPtoday * 0.05).toFixed(2)} hoy`;

  const pctEl = document.getElementById('patr-pct');
  if (pctEl) pctEl.textContent = pct.toFixed(2) + '%';
  const fillEl = document.getElementById('patr-fill');
  if (fillEl) fillEl.style.width = Math.max(pct * 8, 2) + '%'; // scaled for visibility

  const p10El = document.getElementById('patr-p10');
  if (p10El) p10El.textContent = '€' + p10.toLocaleString('es');
  const p20El = document.getElementById('patr-p20');
  if (p20El) p20El.textContent = '€' + p20.toLocaleString('es');

  // Dynamic motivational message
  const msgs = [
    `"Si mantienes este hábito 20 años → <strong>€${p20.toLocaleString('es')}</strong> de patrimonio. Cada lección es un ladrillo más."`,
    `"Llevas <strong>€${Math.round(S.patrimony).toLocaleString('es')}</strong> construidos. El mejor momento para invertir fue ayer. El segundo mejor es hoy."`,
    `"Con <strong>${S.streak} días de racha</strong> podrías duplicar este patrimonio en 10 años si inviertes <strong>€${monthly}/mes</strong>."`,
    `"Eres del <strong>13%</strong> de personas que entiende el interés compuesto. Eso ya vale más que cualquier título."`,
  ];
  const msgEl = document.getElementById('patr-msg');
  if (msgEl) msgEl.innerHTML = msgs[Math.floor(Math.random() * msgs.length)];

  // Update badge based on patrimony
  updatePatrimonyBadge();
}


function updatePatrimonyBadge() {
  const stages = [
    {min:0, icon:'🌱', label:'APRENDIZ'},
    {min:500, icon:'📊', label:'AHORRADOR'},
    {min:2000, icon:'💼', label:'INVERSOR'},
    {min:5000, icon:'🦅', label:'AVANZADO'},
    {min:15000, icon:'🏝️', label:'LIBRE'},
  ];
  const stage = [...stages].reverse().find(s => S.patrimony >= s.min) || stages[0];
  const iconEl = document.getElementById('patr-badge-icon');
  const labelEl = document.getElementById('patr-badge-label');
  if (iconEl) iconEl.textContent = stage.icon;
  if (labelEl) labelEl.textContent = stage.label;
}


/* ── Notificaciones, XP y badges ─────────────────────────── */


function renderIdentity() {
  const currentLevel = calcIdentityLevel();
  S.identityLevel = currentLevel;
  const current = IDENTITY_STAGES[currentLevel];
  const next = IDENTITY_STAGES[currentLevel + 1];

  // Stages path
  const stagesEl = document.getElementById('identity-stages');
  if (!stagesEl) return;
  let html = '';
  IDENTITY_STAGES.forEach((s, i) => {
    const isDone = i < currentLevel;
    const isCurrent = i === currentLevel;
    const isLocked = i > currentLevel;
    html += `<div class="id-stage ${isDone?'done':isCurrent?'current':'locked'}">
      <div class="id-circle">${s.icon}</div>
      <div class="id-stage-name">${s.name}</div>
    </div>`;
    if (i < IDENTITY_STAGES.length - 1) {
      html += `<div class="id-connector ${isDone?'done':''}"></div>`;
    }
  });
  stagesEl.innerHTML = html;

  // Current info — write to both composite and granular span IDs
  const currNameEl = document.getElementById('id-curr-name');
  if (currNameEl) currNameEl.textContent = current.name;
  // Granular spans inside id-curr-desc
  const modsSpan = document.getElementById('identity-modules-count');
  if (modsSpan) modsSpan.textContent = S.completedMods.length;
  const xpSpan = document.getElementById('identity-xp-count');
  if (xpSpan) xpSpan.textContent = S.xp.toLocaleString('es');
  const tagEl = document.getElementById('id-current-tag');
  if (tagEl) tagEl.textContent = current.icon + ' ' + current.name;

  // Next level info
  if (next) {
    const nextBadgeEl = document.getElementById('id-next-badge');
    if (nextBadgeEl) nextBadgeEl.textContent = `⏱ ~${next.days} días para ${next.name}`;
    // Progress toward next (safe division — avoids NaN when both thresholds equal)
    const xpRange = next.minXP - current.minXP;
    const modRange = next.minMods - current.minMods;
    const xpProgress  = xpRange  > 0 ? Math.min((S.xp - current.minXP) / xpRange, 1)                      : 1;
    const modProgress = modRange > 0 ? Math.min((S.completedMods.length - current.minMods) / modRange, 1)  : 1;
    const progress = Math.max(0, Math.round(((xpProgress + modProgress) / 2) * 100));
    const progPctEl = document.getElementById('id-prog-pct');
    if (progPctEl) progPctEl.textContent = progress + '%';
    const progFillEl = document.getElementById('id-prog-fill');
    if (progFillEl) progFillEl.style.width = progress + '%';
  } else {
    const nextBadgeEl = document.getElementById('id-next-badge');
    if (nextBadgeEl) nextBadgeEl.textContent = '🏝️ ¡Libertad alcanzada!';
    const progPctEl = document.getElementById('id-prog-pct');
    if (progPctEl) progPctEl.textContent = '100%';
    const progFillEl = document.getElementById('id-prog-fill');
    if (progFillEl) progFillEl.style.width = '100%';
  }
}


/* ── UX helpers (skeletons, badges, charts) ──────────────── */


function refreshSettingsSection() {
  const modsCount = document.getElementById('settings-mods-count');
  const modsPct   = document.getElementById('settings-mods-pct');
  const n = (S.completedMods || []).length;
  const _totalMods = (typeof MODULES !== 'undefined') ? MODULES.filter(function(m){return m&&typeof m.id==='number';}).length : 30;
  if (modsCount) modsCount.textContent = n + ' de ' + _totalMods + ' módulos';
  if (modsPct)   modsPct.textContent   = Math.round((n / _totalMods) * 100) + '%';
}


function renderXPChart() {
  const svg    = document.getElementById('xp-svg-chart');
  const labels = document.getElementById('xp-chart-labels');
  const total  = document.getElementById('xp-chart-total');
  if (!svg) return;

  // ── Datos: últimos 7 días de XP ──────────────────────
  // Intenta leer histórico de sesiones guardado;
  // si no existe, genera progresión demo con varianza realista.
  let weeklyXP = [];
  try {
    const saved = AppState.get('fl_xp_history', null);
    if (saved && Array.isArray(saved) && saved.length >= 2) {
      weeklyXP = saved.slice(-7);
    }
  } catch(e) {}

  // Si no hay datos suficientes, generar demo basado en XP actual
  if (weeklyXP.length < 3) {
    const base  = Math.max(50, Math.round(S.xp / 10));
    const noise = () => Math.round((Math.random() - 0.3) * base * 0.6);
    const days  = ['L','M','X','J','V','S','D'];
    weeklyXP = days.map((d, i) => ({
      day: d,
      xp: Math.max(0, base + noise() + i * Math.round(base * 0.08)),
    }));
    // El último día = hoy con XP actual de sesión
    weeklyXP[6].xp = Math.max(weeklyXP[5].xp, Math.round(S.totalXPtoday || base));
  }

  const days     = weeklyXP.map(d => d.day  || '?');
  const values   = weeklyXP.map(d => d.xp   || 0);
  const maxVal   = Math.max(...values, 1);
  const totalXP  = values.reduce((a, b) => a + b, 0);

  // ── Construir path SVG ───────────────────────────────
  const W = 280, H = 80, PAD_X = 10, PAD_Y = 12;
  const plotW = W - PAD_X * 2;
  const plotH = H - PAD_Y * 2;
  const n = values.length;

  // Puntos normalizados
  const pts = values.map((v, i) => ({
    x: PAD_X + (i / (n - 1)) * plotW,
    y: PAD_Y + plotH - (v / maxVal) * plotH,
  }));

  // Bézier suavizado: control points = media de vecinos
  function bezier(ps) {
    if (ps.length < 2) return '';
    let d = `M ${ps[0].x.toFixed(1)} ${ps[0].y.toFixed(1)}`;
    for (let i = 1; i < ps.length; i++) {
      const prev = ps[i - 1];
      const curr = ps[i];
      const cx   = (prev.x + curr.x) / 2;
      d += ` C ${cx.toFixed(1)} ${prev.y.toFixed(1)}, ${cx.toFixed(1)} ${curr.y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
    }
    return d;
  }

  const linePath = bezier(pts);
  // Área rellena: line path + cierre en baseline
  const areaPath = linePath
    + ` L ${pts[n-1].x.toFixed(1)} ${(H - PAD_Y + 4).toFixed(1)}`
    + ` L ${pts[0].x.toFixed(1)} ${(H - PAD_Y + 4).toFixed(1)} Z`;

  // ── Render SVG ──────────────────────────────────────
  const gradId = 'xpGrad_' + Date.now();
  svg.innerHTML = `
    <defs>
      <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="var(--accent)" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.01"/>
      </linearGradient>
    </defs>
    <!-- Área rellena -->
    <path d="${areaPath}" fill="url(#${gradId})" stroke="none"/>
    <!-- Línea principal -->
    <path d="${linePath}" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <!-- Puntos destacados -->
    ${pts.map((p, i) => `
      <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${i === n-1 ? 4 : 2.5}"
        fill="${i === n-1 ? 'var(--accent)' : 'var(--bg)'}"
        stroke="var(--accent)" stroke-width="${i === n-1 ? 2 : 1.5}"/>
    `).join('')}
    <!-- Línea base -->
    <line x1="${PAD_X}" y1="${H - PAD_Y + 4}" x2="${W - PAD_X}" y2="${H - PAD_Y + 4}"
      stroke="var(--border)" stroke-width="1" opacity="0.5"/>
  `;

  // ── Labels de días ──
  if (labels) {
    labels.innerHTML = days.map(d => `<span>${d}</span>`).join('');
  }

  // ── Total semanal ──
  if (total) {
    total.textContent = '+' + totalXP.toLocaleString('es') + ' XP';
  }
}


/* ── Examen final ─────────────────────────────────────────── */



// ═══ UI — Módulos ═══
/* ══════════════════════════════════════════════════════════════════
   ui-modules.js — Grid de módulos · Lecciones · Quizzes · Bloques de contenido · Examen final
   ─ Importa solo lo necesario de data.js y state.js.
   ─ No importa de script.js → sin dependencias circulares.
   ─ Las funciones de negocio (addXP, etc.) se acceden via window.*
     porque script.js las expone al arrancar la app.
══════════════════════════════════════════════════════════════════ */



function renderLessonNav() {
  const mod = S.currentMod;
  if (!mod) return;
  // Module pills — with sequential lock + completion check indicators
  const pills = document.getElementById('lmb-pills');
  if (pills) {
    pills.innerHTML = MODULES.filter(m => m && typeof m.id === 'number').map(m => {
      const done     = S.completedMods.includes(m.id);
      const isActive = m.id === mod.id;
      const locked   = !done && !_isModUnlockedByBranch(m.id);
      const cls      = isActive ? 'active' : done ? 'done' : locked ? 'lmb-locked' : '';
      const title    = (done ? '✓ ' : locked ? '🔒 ' : '') + m.title;
      const style    = locked ? 'opacity:.4;cursor:not-allowed;' : '';
      return `<div class="lmb-pill ${cls}" onclick="startModule(${m.id})"
        title="${title}" style="${style}">${m.id + 1}</div>`;
    }).join('');
  }
  // Prev / Next module buttons
  const prevBtn = document.getElementById('lmb-prev');
  const nextBtn = document.getElementById('lmb-next-mod');
  if (prevBtn) prevBtn.disabled = mod.id === 0;
  if (nextBtn) nextBtn.disabled = mod.id === MODULES.length - 1;
}


/* ── Sincronización de estado → DOM ──────────────────────── */


const MODULES_INITIAL_COUNT = 8;  // cuántos se muestran por defecto
let _modulesExpanded = false;
let _activeModBranch = (typeof F28_BRANCHES !== 'undefined' && F28_BRANCHES[0]) ? F28_BRANCHES[0].id : 'fundamentos';

// ─── Utilidad: obtener la rama de un módulo ────────────────────
function _getModBranch(modId) {
  if (typeof F28_BRANCHES === 'undefined') return null;
  return F28_BRANCHES.find(b => b.mods.includes(modId)) || null;
}

// ─── Utilidad: ¿está desbloqueado un módulo según su rama? ────
function _isModUnlockedByBranch(modId) {
  const completed = S.completedMods || [];
  if (completed.includes(modId)) return true;             // ya hecho
  const branch = _getModBranch(modId);
  if (!branch) return modId === 0 || completed.includes(modId - 1); // fallback legacy
  const idx = branch.mods.indexOf(modId);
  if (idx === 0) return true;                              // primero de rama: siempre libre
  return completed.includes(branch.mods[idx - 1]);        // requiere anterior de la MISMA rama
}

function _buildModuleCard(m, branchColor) {
  const done    = (S.completedMods || []).includes(m.id);
  const locked  = !_isModUnlockedByBranch(m.id);
  const cardCls = `mod-card${done ? ' done' : ''}${locked ? ' mod-locked' : ''}`;
  const R       = 18;
  const circ    = +(2 * Math.PI * R).toFixed(1);
  const dash    = done ? circ : 0;
  const gap     = +(circ - dash).toFixed(1);
  const color   = branchColor || (done ? 'var(--accent)' : locked ? 'rgba(255,255,255,.15)' : 'var(--accent2)');
  const ringClr = locked ? 'rgba(255,255,255,.15)' : color;
  const branch  = _getModBranch(m.id);
  const lockMsg = locked && branch ? `Completa "${MODULES.find(bm => bm && bm.id === branch.mods[branch.mods.indexOf(m.id)-1])?.title || 'el módulo anterior'}" primero` : '';
  return `
  <div class="${cardCls}" data-mod-id="${m.id}" onclick="startModule(${m.id})"
       ${branchColor ? `style="--branch-color:${branchColor}"` : ''}>
    <div class="mod-ring-wrap">
      <svg class="mod-ring-svg" viewBox="0 0 44 44" width="44" height="44">
        <circle class="mod-ring-bg" cx="22" cy="22" r="${R}"/>
        <circle class="mod-ring-fg" cx="22" cy="22" r="${R}"
          stroke="${ringClr}" stroke-dasharray="${dash} ${gap}"
          transform="rotate(-90 22 22)"/>
      </svg>
      <div class="mod-ring-icon${locked ? ' mod-ring-locked' : ''}">${locked ? '🔒' : m.icon}</div>
    </div>
    <div class="mod-content">
      <div class="mod-tag-row">
        <div class="tag tag-${m.tagC} mod-tag-pill">${m.tag}</div>
        ${done ? '<div class="mod-done-chip">✓</div>' : ''}
        ${locked && lockMsg ? `<div class="mod-lock-hint" title="${lockMsg}">🔒</div>` : ''}
      </div>
      <div class="mod-title">${m.title}</div>
      <div class="mod-desc">${m.desc}</div>
      ${locked && lockMsg ? `<div class="mod-lock-msg">${lockMsg}</div>` : ''}
    </div>
    <div class="mod-footer">
      <div class="mod-xp">+${m.xp} XP</div>
      <div class="mod-users">👤 ${m.users}</div>
      ${done ? `<button class="mod-speedrun-btn" onclick="event.stopPropagation();SPEEDRUN_start(${m.id})" title="Modo speedrun">⚡</button>` : ''}
    </div>
  </div>`;
}

function renderModules() {
  const grid = document.getElementById('modules-grid');
  const wrap = document.getElementById('modules-show-more-wrap');
  const btn  = document.getElementById('modules-show-more-btn');
  if (!grid) return;

  // ── Tabs de rama ───────────────────────────────────────────
  _renderBranchTabs();

  grid.style.display = '';

  const branch = (typeof F28_BRANCHES !== 'undefined') ? F28_BRANCHES.find(b => b.id === _activeModBranch) : null;
  const modsToShow = branch
    ? branch.mods.map(id => MODULES.find(m => m && m.id === id)).filter(Boolean)
    : MODULES.filter(function(m){return m&&typeof m.id==='number';});

  const branchMap = {};
  if (typeof F28_BRANCHES !== 'undefined') {
    F28_BRANCHES.forEach(b => b.mods.forEach(id => { branchMap[id] = b.color; }));
  }

  const MAX_VISIBLE = 8;
  const isExpanded = GAME._expandedBranch === _activeModBranch;
  const visibleMods = isExpanded ? modsToShow : modsToShow.slice(0, MAX_VISIBLE);
  const hasMore = modsToShow.length > MAX_VISIBLE;

  grid.innerHTML = visibleMods.map(m => _buildModuleCard(m, branchMap[m.id])).join('');

  const existingBtn = document.getElementById('branch-show-more');
  if (existingBtn) existingBtn.remove();
  if (hasMore) {
    const moreBtn = document.createElement('button');
    moreBtn.id = 'branch-show-more';
    moreBtn.className = 'btn btn-ghost btn-sm';
    moreBtn.style.cssText = 'width:100%;margin-top:8px;padding:10px;border:1px dashed var(--border);border-radius:12px;';
    moreBtn.textContent = isExpanded
      ? '▴ Mostrar menos'
      : `Ver todos los módulos de esta rama (${modsToShow.length - MAX_VISIBLE} más) ▾`;
    moreBtn.onclick = function() {
      GAME._expandedBranch = isExpanded ? null : _activeModBranch;
      renderModules();
    };
    grid.parentNode.insertBefore(moreBtn, grid.nextSibling);
  }

  if (wrap) wrap.style.display = 'none';
}

function _renderBranchTabs() {
  let tabsEl = document.getElementById('mod-branch-tabs');
  if (!tabsEl) {
    const grid = document.getElementById('modules-grid');
    if (!grid) return;
    tabsEl = document.createElement('div');
    tabsEl.id = 'mod-branch-tabs';
    tabsEl.className = 'mod-branch-tabs';
    grid.parentNode.insertBefore(tabsEl, grid);
  }
  if (typeof F28_BRANCHES === 'undefined') return;

  const completed = S.completedMods || [];
  const tabs = [...F28_BRANCHES];
  tabsEl.innerHTML = tabs.map(b => {
    const active = _activeModBranch === b.id;
    let progress = '';
    if (b.id !== 'all' && b.mods) {
      const done = b.mods.filter(id => completed.includes(id)).length;
      progress = `<span class="mbt-prog">${done}/${b.mods.length}</span>`;
    }
    return `<button class="mbt-tab${active ? ' mbt-active' : ''}"
      data-branch="${b.id}"
      style="${active ? `border-color:${b.color};color:${b.color};` : ''}"
      onclick="switchModBranch('${b.id}')">
      <span class="mbt-emoji">${b.emoji || '📚'}</span>
      <span class="mbt-label">${b.label}</span>
      ${progress}
    </button>`;
  }).join('');
}

function switchModBranch(branchId) {
  GAME._expandedBranch = null;
  _activeModBranch = branchId;
  _modulesExpanded = false;
  renderModules();
}
window.switchModBranch = switchModBranch;

var _modView = localStorage.getItem('finlearn_mod_view') || 'map';

function switchModView(view) {
  _modView = view;
  localStorage.setItem('finlearn_mod_view', view);
  const mapEl  = document.getElementById('f28-skill-tree');
  const listEl = document.getElementById('modules-grid');
  const btnMap  = document.getElementById('btn-view-map');
  const btnList = document.getElementById('btn-view-list');
  if (view === 'map') {
    if (mapEl)  mapEl.style.display  = '';
    if (listEl) listEl.style.display = 'none';
    btnMap?.classList.add('active');
    btnList?.classList.remove('active');
    if (typeof F28_render === 'function') F28_render();
  } else {
    if (mapEl)  mapEl.style.display  = 'none';
    if (listEl) listEl.style.display = '';
    btnMap?.classList.remove('active');
    btnList?.classList.add('active');
    renderModules();
  }
}
window.switchModView = switchModView;

function toggleModulesExpand() {
  _modulesExpanded = !_modulesExpanded;
  renderModules();
  // Si se colapsa, hacer scroll suave al inicio de la sección
  if (!_modulesExpanded) {
    document.getElementById('modules-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}


let _activeReadInterval = null;

function renderStep() {
  if (_activeReadInterval) { clearInterval(_activeReadInterval); _activeReadInterval = null; }
  if (typeof AUDIO !== 'undefined') AUDIO.stop();
  const mod = S.currentMod;
  if (!mod || !mod.steps) return;
  const step = mod.steps[S.step];
  if (!step) return;
  const total = mod.steps.length;
  const pct = Math.round(((S.step + 1) / total) * 100);
  const progEl = document.getElementById('lesson-prog');
  if (progEl) progEl.style.width = pct + '%';
  const progFill = document.getElementById('lf-prog-fill');
  if (progFill) progFill.style.width = pct + '%';
  const stepLbl = document.getElementById('lesson-step-lbl');
  if (stepLbl) stepLbl.textContent = S.step + '/' + (total-1);
  const stepNum = document.getElementById('lf-step-num');
  if (stepNum) stepNum.textContent = (S.step + 1);
  const stepTotal = document.getElementById('lf-step-total');
  if (stepTotal) stepTotal.textContent = total;
  const xpVal = document.getElementById('lf-xp-val');
  if (xpVal) xpVal.textContent = '+' + mod.xp + ' XP';

  const nextBtn = document.getElementById('lesson-next-btn');
  nextBtn.disabled = false; nextBtn.style.opacity = '1';
  nextBtn.textContent = S.step >= total-2 ? 'Completar ✓' : 'Siguiente →';

  const c = document.getElementById('lesson-content');

  // Final Exam intro screen
  if (step.type === 'final_exam_intro') {
    renderFinalExamIntro(c, nextBtn);
    c.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:300,easing:'ease'});
    return;
  }
  // Final Exam question
  if (step.type === 'exam_question') {
    renderExamQuestion(c, step, nextBtn);
    c.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'none'}],{duration:300,easing:'ease'});
    return;
  }

  if (step.type === 'content') {
    // Support both legacy (blocks:[]) and modern (bullets:[], fact:'') formats
    const blocksHtml = (step.blocks && step.blocks.length)
      ? step.blocks.map(renderBlock).join('')
      : _renderModernContent(step);
    c.innerHTML = `
      <div class="lesson-hdr">
        ${step.tag ? `<div class="tag tag-blue mb8">${step.tag}</div>` : ''}
        <div class="lesson-title-big">${step.title}</div>
        ${step.intro ? `<div class="lesson-intro">${step.intro}</div>` : ''}
      </div>
      ${blocksHtml}
    `;
    // ── Reading lock: circular SVG progress ring ────────────────
    nextBtn.disabled = true; nextBtn.style.opacity = '1';
    nextBtn.dataset.readLock = '1';
    const _RTOTAL = 6, _circ = 2 * Math.PI * 10;
    let _rsecs = _RTOTAL;
    nextBtn.innerHTML = '<svg class="read-ring-svg" viewBox="0 0 26 26" width="20" height="20">'
      + '<circle cx="13" cy="13" r="10" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="2.5"/>'
      + '<circle id="read-ring-arc" cx="13" cy="13" r="10" fill="none" stroke="var(--accent)" stroke-width="2.5"'
      + ' stroke-dasharray="' + _circ.toFixed(1) + '" stroke-dashoffset="' + _circ.toFixed(1) + '"'
      + ' stroke-linecap="round" transform="rotate(-90 13 13)"/>'
      + '</svg><span id="read-ring-sec" style="margin-left:6px;">' + _rsecs + 's</span>';
    _activeReadInterval = setInterval(() => {
      _rsecs--;
      const _arc = document.getElementById('read-ring-arc');
      const _sec = document.getElementById('read-ring-sec');
      if (_arc) _arc.style.strokeDashoffset = (_circ * (1 - (_RTOTAL - _rsecs) / _RTOTAL)).toFixed(2);
      if (_sec) _sec.textContent = _rsecs > 0 ? _rsecs + 's' : '';
      if (_rsecs <= 0) {
        clearInterval(_activeReadInterval);
        _activeReadInterval = null;
        nextBtn.disabled = false;
        nextBtn.innerHTML = S.step >= total - 2 ? 'Completar ✓' : 'Siguiente →';
        delete nextBtn.dataset.readLock;
      }
    }, 1000);
  } else if (step.type === 'quiz') {
    S.quizAnswered = false;
    nextBtn.disabled = true; nextBtn.style.opacity = '.4';
    const quizQ = step.q || step.title || '';
    c.innerHTML = `
      <div class="quiz-wrap">
        <div class="tag tag-orange mb12">❓ Test de comprensión</div>
        <div class="quiz-q">${quizQ}</div>
        <div class="quiz-opts">
          ${step.opts.map((o,i)=>`
            <div class="quiz-opt" onclick="answerQuiz(${i})" id="qo-${i}">
              <div class="quiz-letter">${'ABCD'[i]}</div>${o.t}
            </div>
          `).join('')}
        </div>
        <div class="quiz-fb" id="quiz-fb"></div>
        ${(S.quizHints > 0) ? '<div class="quiz-hint-active">💡 Pista activa — se eliminarán 2 opciones incorrectas</div>' : ''}
      </div>
    `;
    // F50 quiz hint: consume 1 pista, deshabilita 2 opciones incorrectas
    if ((S.quizHints || 0) > 0) {
      S.quizHints--;
      saveState();
      setTimeout(function() {
        var correctIdx = step.opts.findIndex(function(o){ return o.ok; });
        var wrongIdxs  = step.opts.map(function(_,i){ return i; }).filter(function(i){ return i !== correctIdx; });
        // eliminar 2 de las opciones incorrectas (las primeras 2)
        wrongIdxs.slice(0, 2).forEach(function(i) {
          var el = document.getElementById('qo-' + i);
          if (el) { el.classList.add('quiz-opt-hint-out'); el.style.pointerEvents = 'none'; el.style.opacity = '0.3'; }
        });
        spawnXP('💡 Pista usada');
      }, 350);
    }
  } else if (step.type === 'final') {
    S.lessonDone = true;
    nextBtn.textContent = '🏆 Ver mi certificado';
    c.innerHTML = `
      <div style="text-align:center;padding:60px 20px;">
        <div style="font-size:80px;margin-bottom:20px;animation:celPop .5s cubic-bezier(.34,1.56,.64,1);">🎉</div>
        <div class="lesson-title-big">${step.msg}</div>
        <div style="font-size:15px;color:var(--text2);margin-top:10px;">Has ganado <strong style="color:var(--accent);">+${step.xp} XP</strong></div>
      </div>
    `;
    // P4-C: comprobar examen perfecto para misión 'perfect'
    if (typeof checkPerfectExam === 'function') checkPerfectExam();
  }
  const _dir = window._lessonDir || 'forward';
  window._lessonDir = null;
  const _tx = _dir === 'back' ? '-24px' : '24px';
  c.animate([{opacity:0,transform:`translateX(${_tx})`},{opacity:1,transform:'none'}],
    {duration:260, easing:'cubic-bezier(.25,.46,.45,.94)'});
  // Stagger content blocks for extra polish
  const _blocks = c.querySelectorAll('.content-block, .formula-box, .stats-strip, .hl-box, .quiz-wrap');
  _blocks.forEach(function(el, i) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    setTimeout(function() {
      el.style.transition = 'opacity .25s ease, transform .25s ease';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, 80 + i * 55);
  });
}


function renderBlock(b) {
  if (b.t==='text') return `<div class="content-block">${b.h?`<h3>${b.h}</h3>`:''}${b.p?`<p>${b.p}</p>`:''}</div>`;
  if (b.t==='formula') return `<div class="formula-box"><div class="formula">${b.f}</div><div class="formula-lab">${b.l}</div></div>`;
  if (b.t==='stats') return `<div class="stats-strip">${b.items.map(s=>`<div class="sbox"><div class="sbox-val">${s.v}</div><div class="sbox-lab">${s.l}</div></div>`).join('')}</div>`;
  if (b.t==='hl') return `<div class="hl-box ${b.s||''}"><div class="hl-label">${b.label}</div><p>${b.p}</p></div>`;
  return '';
}

// Render modern module format: bullets[] + fact string
function _renderModernContent(step) {
  let html = '';
  if (step.bullets && step.bullets.length) {
    html += `<div class="content-block modern-bullets">` +
      step.bullets.map(b => `<div class="bullet-item">${b}</div>`).join('') +
      `</div>`;
  }
  if (step.p) html += `<div class="content-block"><p>${step.p}</p></div>`;
  if (step.fact) {
    html += `<div class="fact-box">💡 <strong>Dato clave:</strong> ${step.fact}</div>`;
  }
  return html;
}


/* ── Temporizadores & notificaciones ──────────────────────── */


function showSkeletonLoader() {
  const c = document.getElementById('lesson-content');
  if (!c) return;
  c.innerHTML = `
    <div style="padding:20px 4px;">
      <div class="sk-line sk-title"  style="width:65%;height:30px;margin-bottom:18px;"></div>
      <div class="sk-line sk-text"   style="width:92%;height:15px;margin-bottom:8px;"></div>
      <div class="sk-line sk-text"   style="width:80%;height:15px;margin-bottom:20px;"></div>
      <div class="sk-block"          style="height:130px;margin-bottom:18px;"></div>
      <div class="sk-line sk-text"   style="width:100%;margin-bottom:8px;"></div>
      <div class="sk-line sk-text"   style="width:88%;margin-bottom:8px;"></div>
      <div class="sk-line sk-short"  style="width:55%;"></div>
    </div>`;
}


function renderCourseBadges() {
  const section = document.getElementById('course-badges-section');
  if (!section) return;

  const total     = MODULES.filter(function(m){return m&&typeof m.id==='number';}).length;
  const completed = S.completedMods.length;
  const pct       = total > 0 ? (completed / total) * 100 : 0;

  const earned50  = pct >= 50;
  const earned100 = pct >= 100;

  section.innerHTML = `
    <div class="cb-title">🏅 Logros del Curso</div>
    <div class="cb-badges">

      <div class="cb-badge ${earned50 ? 'cb-unlocked' : 'cb-locked'}">
        <div class="cb-badge-icon">${earned50 ? '🌟' : '🔒'}</div>
        <div class="cb-badge-info">
          <div class="cb-badge-name">Mitad del camino</div>
          <div class="cb-badge-desc">50% completado</div>
          ${!earned50
            ? `<div class="cb-badge-prog">${completed}/${Math.round(total/2)} mód.</div>`
            : '<div class="cb-badge-prog" style="color:var(--accent)">¡Desbloqueado!</div>'}
        </div>
      </div>

      <div class="cb-badge ${earned100 ? 'cb-unlocked' : 'cb-locked'}">
        <div class="cb-badge-icon">${earned100 ? '🏆' : '🔒'}</div>
        <div class="cb-badge-info">
          <div class="cb-badge-name">Curso completo</div>
          <div class="cb-badge-desc">100% dominado</div>
          ${!earned100
            ? `<div class="cb-badge-prog">${completed}/${total} mód.</div>`
            : '<div class="cb-badge-prog" style="color:var(--gold)">¡Leyenda!</div>'}
        </div>
      </div>

    </div>`;

  // Unlock celebrations (fire once per session using S flags)
  if (earned50 && !S._badge50Shown) {
    S._badge50Shown = true;
    setTimeout(() => {
      confetti();
      toast('🌟 ¡Badge desbloqueado!', '¡Llevas el 50% del curso! Eres de los mejores.', 't-success');
    }, 600);
  }
  if (earned100 && !S._badge100Shown) {
    S._badge100Shown = true;
    setTimeout(() => {
      confetti();
      toast('🏆 ¡Curso completado!', '¡Has dominado todos los módulos de FinLearn! Leyenda total.', 't-success');
    }, 900);
  }
}


function renderFinalExamIntro(c, nextBtn) {
  const allPrev = MODULES.slice(0, 5).every(m => S.completedMods.includes(m.id));
  if (!allPrev) {
    c.innerHTML = `
      <div style="text-align:center;padding:50px 20px;">
        <div style="font-size:64px;margin-bottom:16px;">🔒</div>
        <div class="lesson-title-big" style="margin-bottom:12px;">Módulos Previos Requeridos</div>
        <div style="font-size:15px;color:var(--text2);line-height:1.6;">
          Debes completar los 5 módulos del curso (Módulos 1-5) antes de enfrentarte al Reto Final.<br><br>
          Tu dominio actual: <strong style="color:var(--accent)">${S.completedMods.filter(id => id < 5).length}/5 módulos</strong>
        </div>
        <button class="btn btn-secondary" style="margin-top:24px;" onclick="safeGoHome()">← Volver al inicio</button>
      </div>`;
    nextBtn.disabled = true; nextBtn.style.opacity = '.3';
    return;
  }
  c.innerHTML = `
    <div class="exam-intro-wrap">
      <div class="exam-trophy">🏆</div>
      <div class="exam-intro-title">Reto Final: Maestro Financiero</div>
      <div class="exam-intro-sub">
        Has completado todos los módulos del curso. Ahora llega el reto definitivo.
      </div>
      <div class="exam-rules">
        <div class="exam-rule"><span class="exam-rule-icon">📋</span><div><strong>10 preguntas aleatorias</strong> de los 5 módulos del curso</div></div>
        <div class="exam-rule"><span class="exam-rule-icon">🎯</span><div>Necesitas <strong>7/10 respuestas correctas</strong> para certificarte</div></div>
        <div class="exam-rule"><span class="exam-rule-icon">⚡</span><div>Cada pregunta bien respondida suma <strong>+50 XP</strong></div></div>
        <div class="exam-rule"><span class="exam-rule-icon">🏅</span><div>Al superar el examen obtienes el título de <strong>Maestro Financiero</strong></div></div>
        <div class="exam-rule"><span class="exam-rule-icon">🔁</span><div>Si no superas el umbral, puedes repetirlo con preguntas distintas</div></div>
      </div>
      <div style="font-size:13px;color:var(--text2);text-align:center;margin-top:12px;">
        Las preguntas son seleccionadas aleatoriamente del pool de ${EXAM_QUESTION_POOL.length} preguntas del curso.
      </div>
    </div>`;
  nextBtn.disabled = false;
  nextBtn.style.opacity = '1';
  nextBtn.textContent = '🚀 Empezar el Reto Final →';
}


function renderExamQuestion(c, step, nextBtn) {
  S.quizAnswered = false;
  nextBtn.disabled = true;
  nextBtn.style.opacity = '.4';
  nextBtn.textContent = `Pregunta ${step.questionIdx + 1}/10 →`;

  c.innerHTML = `
    <div class="exam-question-wrap">
      <div class="exam-progress-bar-wrap">
        <div class="exam-q-counter">PREGUNTA ${step.questionIdx + 1} DE 10</div>
        <div class="exam-module-tag">${step.module}</div>
        <div class="pbar thick" style="margin-bottom:0;">
          <div class="pbar-fill gold" style="width:${(step.questionIdx / 10) * 100}%;"></div>
        </div>
      </div>
      <div class="exam-score-row">
        <span style="font-size:12px;color:var(--text2);">Correctas hasta ahora:</span>
        <strong style="color:var(--accent);">${GAME.examScore}/${step.questionIdx}</strong>
      </div>
      <div class="quiz-q" style="margin-top:12px;">${step.q}</div>
      <div class="quiz-opts">
        ${step.opts.map((o, i) => `
          <div class="quiz-opt" onclick="answerExamQuestion(${i})" id="eqo-${i}">
            <div class="quiz-letter">${'ABCD'[i]}</div>${o.t}
          </div>`).join('')}
      </div>
      <div class="quiz-fb" id="exam-fb"></div>
    </div>`;
}



// ═══ UI — Portfolio ═══
/* ══════════════════════════════════════════════════════════════════
   ui-portfolio.js — Simulador de bolsa · Cartera · Acciones · Negocios · Carrera
   ─ Importa solo lo necesario de data.js y state.js.
   ─ No importa de script.js → sin dependencias circulares.
   ─ Las funciones de negocio (addXP, etc.) se acceden via window.*
     porque script.js las expone al arrancar la app.
══════════════════════════════════════════════════════════════════ */



function renderCompoundPanel(stock, currentPrice, shares) {
  const currentValue = currentPrice * shares;
  if (currentValue <= 0) return '';

  const horizons = [10, 20, 30];
  const rows = horizons.map(y => {
    const { nominal, real } = calcAssetProjection(currentValue, stock.annualReturn, y);
    const gain = nominal - currentValue;
    const mult = (nominal / currentValue).toFixed(1);
    return `
      <div style="display:flex;align-items:center;gap:8px;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.05);">
        <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--text2);width:28px;flex-shrink:0;">${y}a</div>
        <div style="flex:1;min-width:0;overflow:hidden;">
          <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:13px;color:var(--accent);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">€${nominal.toLocaleString('es')}</div>
          <div style="font-size:10px;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Real: €${real.toLocaleString('es')}</div>
        </div>
        <div style="text-align:right;flex-shrink:0;">
          <div style="font-size:12px;color:var(--gold);font-weight:700;font-family:'DM Mono',monospace;">+€${gain.toLocaleString('es')}</div>
          <div style="font-size:10px;color:var(--text3);">×${mult}</div>
        </div>
      </div>`;
  }).join('');

  return `
    <div style="background:rgba(0,229,160,.04);border:1px solid rgba(0,229,160,.15);border-radius:12px;padding:12px 14px;margin-bottom:14px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <div style="font-size:11px;font-weight:700;color:var(--accent);letter-spacing:.06em;font-family:'DM Mono',monospace;">📈 PROYECCIÓN INTERÉS COMPUESTO</div>
        <div style="font-size:11px;color:var(--gold);font-weight:700;font-family:'DM Mono',monospace;flex-shrink:0;margin-left:8px;">${(stock.annualReturn*100).toFixed(0)}%/año</div>
      </div>
      ${rows}
      <div style="font-size:10px;color:var(--text3);margin-top:8px;line-height:1.5;">
        ⚠️ Proyecciones históricas. El pasado no garantiza el futuro. Inflación ${INFLATION_RATE*100}% deflactada.
        ${stock.historicalNote ? `<br>💡 ${stock.historicalNote}` : ''}
      </div>
    </div>`;
}


function renderCareerCard() {
  const el = document.getElementById('career-card');
  if (!el) return;
  const career = getCurrentCareer();
  const salary = calcMonthlySalary();
  const lifestyle = career.lifestyleExtra || 0;
  const careerIds = CAREERS.map(c => c.id);
  const currentIdx = careerIds.indexOf(S.career || 'intern');

  // Build level dots
  const dots = CAREERS.map((c, i) => {
    let cls = 'career-level-dot';
    if (i < currentIdx) cls += ' filled';
    if (i === currentIdx) cls += ' current';
    return `<div class="${cls}" title="${c.title}" style="${i === currentIdx ? `background:${career.color};` : ''}"></div>`;
  }).join('');

  el.innerHTML = `
    <div class="career-summary-row">
      <div class="career-icon-big" style="background:${career.color}22;border-color:${career.color}44;">
        ${career.icon}
      </div>
      <div style="flex:1;">
        <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:16px;color:${career.color};">
          ${career.title}
        </div>
        <div style="font-size:11px;color:var(--text3);margin-bottom:4px;">${career.subtitle}</div>
        <div style="font-size:13px;font-weight:700;color:var(--accent);">
          €${salary.toLocaleString('es')}/mes neto
        </div>
      </div>
      <div style="font-size:10px;color:var(--text3);font-style:italic;">
        Según tus ingresos
      </div>
    </div>

    <!-- Level progression bar -->
    <div style="margin:10px 0 4px;">
      <div style="font-size:9px;color:var(--text3);margin-bottom:5px;text-transform:uppercase;letter-spacing:.08em;">
        Nivel ${currentIdx + 1} / ${CAREERS.length} — ${career.title}
      </div>
      <div class="career-level-bar">${dots}</div>
    </div>

    ${lifestyle > 0 ? `
    <div style="display:flex;gap:6px;align-items:center;margin-top:8px;padding:6px 10px;background:rgba(255,75,92,.07);border-radius:8px;border:1px solid rgba(255,75,92,.15);">
      <span style="font-size:13px;">⚠️</span>
      <span style="font-size:11px;color:var(--danger);">Lifestyle creep: −€${lifestyle.toLocaleString('es')}/mes en gastos de estilo de vida</span>
    </div>` : ''}

    ${career.id === 'investor' ? `
    <div style="display:flex;gap:6px;align-items:center;margin-top:8px;padding:6px 10px;background:rgba(0,229,160,.07);border-radius:8px;border:1px solid rgba(0,229,160,.15);">
      <span style="font-size:13px;">📈</span>
      <span style="font-size:11px;color:var(--accent);">Ingresos pasivos del 4% anual de €${Math.round(S.invested||0).toLocaleString('es')} invertidos</span>
    </div>` : ''}

    <div style="margin-top:10px;padding:8px 12px;background:rgba(255,255,255,.03);border-radius:8px;font-size:11px;color:var(--text2);line-height:1.5;">
      💡 <em>${career.lesson}</em>
    </div>`;
}


function renderStockList() {
  const el = document.getElementById('stock-list');
  if (!el) return;

  // En modo "Todos", los activos featured van primero
  let filtered = STOCKS.filter(s =>
    GAME.currentStockFilter === 'all'
      ? true
      : s.group === GAME.currentStockFilter
  );
  if (GAME.currentStockFilter === 'all') {
    filtered = [
      ...filtered.filter(s => s.featured),
      ...filtered.filter(s => !s.featured),
    ];
  }
  el.innerHTML = filtered.map(s => renderStockCard(s)).join('');
}


function _sparklineSVG(ticker, w, h) {
  const hist = (GAME.priceHistory && GAME.priceHistory[ticker]) || [];
  if (hist.length < 2) return '';
  const last20 = hist.slice(-20);
  const mn = Math.min(...last20), mx = Math.max(...last20), range = mx - mn || 1;
  const pts = last20.map((v, i) =>
    `${(i / (last20.length - 1)) * w},${h - ((v - mn) / range) * (h - 4) + 2}`
  ).join(' ');
  const up = last20[last20.length - 1] >= last20[0];
  const col = up ? '#00e5a0' : '#ef4444';
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:block;overflow:visible;">`
    + `<polyline points="${pts}" fill="none" stroke="${col}" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>`
    + `</svg>`;
}

function renderStockCard(s) {
  const price    = GAME.stockPrices[s.ticker] || s.price;
  const pct      = ((price - s.price) / s.price * 100).toFixed(2);
  const up       = price >= s.price;
  const owned    = (S.portfolio || {})[s.ticker];
  const featBadge = s.featured
    ? `<span style="font-size:9px;background:rgba(251,191,36,.15);color:var(--gold);border-radius:4px;padding:1px 5px;margin-left:4px;font-family:'DM Mono',monospace;">DESTACADO</span>`
    : '';
  return `<div class="stock-card ${owned ? 'owned' : ''}" onclick="openStockModal('${s.ticker}')">
    <div class="sc-logo" style="background:${s.bg};">${s.icon}</div>
    <div class="sc-info">
      <div class="sc-name">${s.name}${featBadge}</div>
      <div class="sc-ticker">${s.ticker} · ${s.exchange}
        ${s.dividendYield > 0 ? `<span class="div-badge" style="font-size:9px;">÷${s.dividendYield}%</span>` : ''}
        ${s.isCrypto ? '<span style="font-size:9px;color:var(--accent3);"> ⚠️ Alto riesgo</span>' : ''}
      </div>
      ${owned ? `<div class="sc-owned">${owned.shares} uds · P&L: ${fmtPnl(owned.shares, owned.avgPrice, price)}</div>` : ''}
    </div>
    <div class="sc-right">
      <div class="sc-sparkline">${_sparklineSVG(s.ticker, 44, 20)}</div>
      <div class="sc-price">${price >= 1000 ? '€' + Math.round(price).toLocaleString('es') : fmtPrice(price)}</div>
      <div class="sc-pct ${up ? 'up' : 'down'}">${up ? '+' : ''}${pct}%</div>
    </div>
  </div>`;
}



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
  setEl('home-nav-av', S.avatar);
  if (S.userName && typeof AVATAR_AI !== 'undefined') AVATAR_AI.apply(S.userName);

  // ── Profile hero ───────────────────────────────────────────────────
  setEl('prof-av',    S.avatar);
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
    pills.innerHTML = MODULES.map(m => {
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
      </div>
    `;
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


function renderPortfolioSummary() {
  if (!S.portfolio) return;
  let totalVal = 0, totalInvested = 0;
  Object.entries(S.portfolio).forEach(([ticker, pos]) => {
    const price = GAME.stockPrices[ticker] || STOCKS.find(s => s.ticker === ticker)?.price || 0;
    totalVal     += price * pos.shares;
    totalInvested += pos.avgPrice * pos.shares;
  });
  const gains = totalVal - totalInvested;
  const pct   = totalInvested > 0 ? (gains / totalInvested * 100).toFixed(2) : 0;
  const up    = gains >= 0;

  setEl('port-total-val', '€' + totalVal.toFixed(2));
  setEl('port-total-change', `${up ? '+' : ''}€${gains.toFixed(2)} (${up ? '+' : ''}${pct}%) total`);
  const changeEl = document.getElementById('port-total-change');
  if (changeEl) changeEl.className = `port-change ${up ? 'up' : 'down'}`;
  setEl('port-invested-val', '€' + totalInvested.toFixed(0));
  setEl('port-gains-val', (up ? '+' : '') + '€' + gains.toFixed(0));
  setEl('port-divs-val', '€' + (S.totalDividends || 0).toFixed(2));
  setEl('port-cash-nav', fmtPrice(S.cash || 0));

  // Mostrar efectivo real vs nominal si hay inflación acumulada
  if ((S.gameYear || 0) > 0) {
    const realCash = getCashRealValue();
    const lostPct  = ((1 - realCash / S.cash) * 100).toFixed(1);
    const infoEl   = document.getElementById('port-inflation-info');
    if (infoEl) {
      infoEl.innerHTML = `💸 Efectivo: ${fmtPrice(S.cash)} nominal · <span style="color:var(--danger);">${fmtPrice(realCash)} real (−${lostPct}% por inflación)</span>`;
      infoEl.style.display = 'block';
    }
  }

  renderMyPositions();
}


function renderMyPositions() {
  const section = document.getElementById('port-positions-section');
  const list    = document.getElementById('port-positions');
  if (!section || !list) return;
  const owned = Object.entries(S.portfolio || {}).filter(([, p]) => p.shares > 0);
  if (!owned.length) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  list.innerHTML = owned.map(([ticker, pos]) => {
    const stock = STOCKS.find(s => s.ticker === ticker);
    if (!stock) return '';
    const price = GAME.stockPrices[ticker] || stock.price;
    const val   = price * pos.shares;
    const pnl   = (price - pos.avgPrice) * pos.shares;
    const up    = pnl >= 0;
    return `<div class="stock-card owned" onclick="openStockModal('${ticker}')">
      <div class="sc-logo" style="background:${stock.bg};">${stock.icon}</div>
      <div class="sc-info">
        <div class="sc-name">${stock.name}</div>
        <div class="sc-ticker">${ticker} · ${pos.shares} uds · Coste medio: ${fmtPrice(pos.avgPrice)}</div>
        <div class="sc-owned">Dividendos: €${(pos.dividendsCollected || 0).toFixed(2)} · Año juego ${S.gameYear || 0}</div>
      </div>
      <div class="sc-right">
        <div class="sc-price">€${val.toFixed(0)}</div>
        <div class="sc-pct ${up ? 'up' : 'down'}">${up ? '+' : ''}€${pnl.toFixed(2)}</div>
      </div>
    </div>`;
  }).join('');
}


function renderMiniChart(ticker) {
  const hist = GAME.priceHistory[ticker] || [];
  const el   = document.getElementById('sdh-chart');
  if (!el || hist.length < 2) return;
  const min  = Math.min(...hist);
  const max  = Math.max(...hist);
  const range = max - min || 1;
  const w = 320, h = 68;
  const pts = hist.map((v, i) =>
    `${(i / (hist.length - 1)) * w},${h - ((v - min) / range) * (h - 8) + 4}`
  ).join(' ');
  const up  = hist[hist.length - 1] >= hist[0];
  const col = up ? '#00e5a0' : '#ef4444';
  el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${col}" stop-opacity=".3"/>
      <stop offset="100%" stop-color="${col}" stop-opacity="0"/>
    </linearGradient></defs>
    <polygon points="${pts} ${w},${h} 0,${h}" fill="url(#cg)"/>
    <polyline points="${pts}" fill="none" stroke="${col}" stroke-width="2"/>
  </svg>`;
}


function updateQtyDisplay() {
  if (!GAME.currentStock) return;
  const price  = GAME.stockPrices[GAME.currentStock.ticker] || GAME.currentStock.price;
  const qtyEl  = document.getElementById('stock-qty');
  if (qtyEl) {
    if (qtyEl.tagName === 'INPUT') qtyEl.value = GAME.stockQty;
    else qtyEl.textContent = GAME.stockQty;
  }
  setEl('stock-total', 'Total: ' + fmtPrice(price * GAME.stockQty));
}


function showDividendPopup(stock, amount) {
  toast('💰 Dividendos recibidos', `Has recibido ${amount.toFixed(2)}€ en dividendos de ${stock.ticker}`, 't-success');
}


/* ── Negocios (Business game) ─────────────────────────────── */


function renderBusinesses() {
  const available  = document.getElementById('businesses-list');
  const mySection  = document.getElementById('my-businesses-section');
  const myList     = document.getElementById('my-businesses-list');
  if (!available) return;

  const owned = Object.keys(S.businesses || {});

  // ── Mis negocios activos ──────────────────────────────
  const myBizsHtml = owned.map(id => {
    const biz   = BUSINESSES.find(b => b.id === id);
    const state = S.businesses[id];
    if (!biz) return '';
    const rev    = calcBizRevenue(id);
    const profit = rev - biz.monthlyExpenses;
    const upgCount = (state.upgrades || []).length;
    const maxUpg   = biz.upgrades?.length || 0;
    const isVol    = biz.isVolatile ? '<span style="font-size:10px;color:var(--accent3);">⚡ variable</span>' : '';
    const isFail   = biz.failChance ? `<span style="font-size:10px;color:var(--loss);">⚠️ riesgo ${Math.round(biz.failChance*100)}%/mes</span>` : '';
    return `<div class="biz-card owned" onclick="openBizModal('${id}')">
      <div class="bc-top">
        <div class="bc-icon" style="background:rgba(251,191,36,.1);">${biz.icon}</div>
        <div class="bc-info">
          <div class="bc-name">${biz.name}</div>
          <div class="bc-type">${biz.type} ${isVol}${isFail}</div>
        </div>
        <div class="bc-right">
          <div style="color:var(--gain);font-family:'DM Mono',monospace;font-size:14px;font-weight:700;">+€${profit.toFixed(0)}/mes</div>
          <div style="font-size:10px;color:var(--text2);margin-top:2px;">Beneficio neto</div>
        </div>
      </div>
      <div class="biz-progress">
        <div class="biz-prog-label">
          <span>Mejoras ${upgCount}/${maxUpg}</span>
          <span style="color:var(--gold);">ROI ${calcBizROI(id).toFixed(1)}%</span>
        </div>
        <div class="biz-level-bar"><div class="biz-level-fill" style="width:${maxUpg ? upgCount/maxUpg*100 : 0}%;"></div></div>
      </div>
    </div>`;
  }).join('');
  if (myList)    myList.innerHTML = myBizsHtml;
  if (mySection) mySection.style.display = owned.length > 0 ? 'block' : 'none';

  // ── Marketplace — categorizado por tier ──────────────
  const notOwned = BUSINESSES.filter(b => !owned.includes(b.id));
  const tiers = [
    { id:'basic',        label:'🌱 Para todos',          color:'var(--accent)' },
    { id:'senior',       label:'💼 Nivel Senior',         color:'var(--accent2)' },
    { id:'entrepreneur', label:'🚀 Nivel Emprendedor',    color:'var(--accent3)' },
  ];

  available.innerHTML = tiers.map(tier => {
    const bizsInTier = notOwned.filter(b => b.tier === tier.id);
    if (!bizsInTier.length) return '';

    const cards = bizsInTier.map(biz => {
      const canAfford = (S.cash || 0) >= biz.cost;
      const unlocked  = isBusinessUnlocked(biz);
      const lockReason = getBusinessLockReason(biz);
      const isLocked  = !unlocked;

      const riskBadge = {low:'🟢 Bajo',med:'🟡 Medio',high:'🔴 Alto'}[biz.riskLevel] || biz.riskLevel;
      const specialBadge = biz.isVolatile  ? '<span class="biz-tag" style="background:rgba(255,107,53,.1);color:var(--accent3);">⚡ Ingresos variables</span>' :
                           biz.failChance  ? `<span class="biz-tag" style="background:rgba(255,75,92,.1);color:var(--loss);">⚠️ ${Math.round(biz.failChance*100)}% fracaso/mes</span>` : '';
      const freeBadge  = biz.cost === 0   ? '<span class="biz-tag" style="background:rgba(0,255,136,.1);color:var(--gain);">✅ Gratis</span>' : '';

      return `<div class="biz-card ${isLocked?'locked':''} ${!canAfford&&!isLocked?'locked':''}"
                   onclick="${!isLocked&&canAfford?`openBizModal('${biz.id}')`:''}"
                   style="${isLocked||!canAfford?'cursor:not-allowed;':''}">
        <div class="bc-top">
          <div class="bc-icon" style="background:rgba(251,191,36,.07);">${biz.icon}</div>
          <div class="bc-info">
            <div class="bc-name">${biz.name}</div>
            <div class="bc-type">${biz.type}</div>
          </div>
          <div class="bc-right">
            ${biz.cost > 0 ? `<div class="bc-price">${fmtPrice(biz.cost)}</div>` : '<div class="bc-price" style="color:var(--gain);">Gratis</div>'}
            <div class="bc-revenue">+€${(biz.monthlyRevenue - biz.monthlyExpenses).toFixed(0)}/mes neto</div>
          </div>
        </div>
        ${isLocked ? `<div style="font-size:11px;color:var(--loss);margin-bottom:8px;padding:6px 10px;background:rgba(255,75,92,.07);border-radius:6px;">${lockReason}</div>` : ''}
        <div class="biz-stats-row">
          <span class="biz-tag risk-${biz.riskLevel}">${riskBadge} riesgo</span>
          ${specialBadge}${freeBadge}
          <span class="biz-tag" style="background:rgba(168,85,247,.1);color:var(--accent4);">ROI ${biz.cost > 0 ? (((biz.monthlyRevenue - biz.monthlyExpenses) * 12 / biz.cost) * 100).toFixed(1) : '∞'}%/año</span>
          ${!isLocked && !canAfford ? '<span class="biz-tag" style="background:rgba(239,68,68,.1);color:var(--danger);">Sin fondos</span>' : ''}
        </div>
        <div style="font-size:11px;color:var(--text3);margin-top:8px;line-height:1.4;border-top:1px solid var(--border);padding-top:8px;">💡 ${biz.learnNote||biz.desc}</div>
      </div>`;
    }).join('');

    return `<div class="biz-tier-section">
      <div class="biz-tier-header" style="border-left:3px solid ${tier.color};">
        <span style="color:${tier.color};font-weight:700;">${tier.label}</span>
      </div>
      ${cards}
    </div>`;
  }).join('');

  renderBizCashflow();
}


function renderBizCashflow() {
  const owned = Object.keys(S.businesses||{});
  let gross=0, exp=0;
  owned.forEach(id=>{
    const biz=BUSINESSES.find(b=>b.id===id);
    if(!biz) return;
    gross+=calcBizRevenue(id);
    exp+=biz.monthlyExpenses;
  });
  const net=gross-exp;
  setEl('biz-total-cashflow',(net>=0?'+':'')+'€'+net.toFixed(0)+'/mes');
  setEl('biz-gross','€'+gross.toFixed(0));
  setEl('biz-expenses','-€'+exp.toFixed(0));
  setEl('biz-count',owned.length);
  setEl('biz-cash-pill','💰 '+fmtPrice(S.cash||0));
  setEl('biz-cf-sub', owned.length>0
    ? `${owned.length} ${owned.length===1?'negocio activo':'negocios activos'} · Próximo cobro el día 1`
    : 'Adquiere negocios para generar ingresos pasivos');
  setEl('biz-cash-display', '€'+Math.round(S.cash||0).toLocaleString('es'));
}


/* ── Simulador de vida ────────────────────────────────────── */



// ═══ UI — Social ═══
/* ══════════════════════════════════════════════════════════════════
   ui-social.js — Rankings · Podio · Logros · Actividad · Datos financieros · Countdown
   ─ Importa solo lo necesario de data.js y state.js.
   ─ No importa de script.js → sin dependencias circulares.
   ─ Las funciones de negocio (addXP, etc.) se acceden via window.*
     porque script.js las expone al arrancar la app.
══════════════════════════════════════════════════════════════════ */



function renderChallengeMembers() {
  document.getElementById('chal-members').innerHTML = CHALLENGE.map(u => `
    <div class="chal-row">
      <span style="font-size:16px;">${u.em}</span>
      <span class="chal-name ${u.me?'me':''}">${u.me ? S.userName || u.n : u.n}</span>
      <div class="chal-pbar"><div class="pbar"><div class="pbar-fill ${u.me?'':'purple'}" style="width:${u.pct}%;${u.me?'':''}"></div></div></div>
      <span class="chal-pct">${u.pct}%</span>
    </div>
  `).join('');
}


/* ── Rankings & Podio ─────────────────────────────────────── */


function renderHomeRank() {
  const list = _getLiveRankingsEnhanced();
  const top  = list.slice(0, 5);
  const me   = list.find(r => r.me);
  const rows = (me && !top.includes(me)) ? [...top, me] : top;
  const html = rows.map(rankRow).join('');
  const el = document.getElementById('home-rank-list');
  if (el) el.innerHTML = html;
  const profileEl = document.getElementById('home-rank-list-profile');
  if (profileEl) profileEl.innerHTML = html;
}


function rankRow(r) {
  const medals = {1:'🥇',2:'🥈',3:'🥉'};
  let nameHtml;
  if (r.me) {
    nameHtml = (S.userName || 'Tú') + ' <span style="color:var(--accent);font-size:10px;">TÚ</span>';
  } else if (r.shadow) {
    nameHtml = `${r.n} <span class="shadow-badge">${r.badge}</span>`;
  } else {
    nameHtml = r.n;
  }
  const shadowClass = r.shadow ? 'shadow-investor' : '';

  // F33: streak identity visual en el ranking
  const streak = r.str || 0;
  let streakHtml = '';
  if (r.shadow) {
    streakHtml = '—';
  } else if (streak >= 100) {
    streakHtml = `<span class="f33-rank-streak f33-rank-legend" title="Leyenda — ${streak} días">👑🔥<span class="f33-rsn">${streak}</span></span>`;
  } else if (streak >= 60) {
    streakHtml = `<span class="f33-rank-streak f33-rank-aura" title="${streak} días de racha">🔥<span class="f33-rsn">${streak}</span></span>`;
  } else if (streak >= 30) {
    streakHtml = `<span class="f33-rank-streak f33-rank-crown" title="${streak} días de racha">👑🔥<span class="f33-rsn">${streak}</span></span>`;
  } else if (streak >= 7) {
    streakHtml = `<span class="f33-rank-streak f33-rank-hot" title="${streak} días de racha">🔥<span class="f33-rsn">${streak}</span></span>`;
  } else {
    streakHtml = `<span class="f33-rank-streak">🔥${streak}</span>`;
  }

  const rowExtra = streak >= 100 ? ' f33-row-legend' : streak >= 60 ? ' f33-row-aura' : '';
  return `
  <div class="rank-row ${r.me ? 'me' : ''} ${shadowClass}${rowExtra}" ${r.shadow ? `title="${r.tip}"` : ''}>
    <div class="rank-pos">${medals[r.pos] || r.pos}</div>
    <div class="rank-av" style="background:linear-gradient(135deg,${r.cl}44,${r.cl}18);font-size:15px;">${r.em}</div>
    <div class="rank-name">${nameHtml}</div>
    <div class="rank-str">${streakHtml}</div>
    <div class="rank-xp">${r.xp.toLocaleString('es')} XP</div>
  </div>`;
}


function renderFullRank() {
  const list = _getLiveRankingsEnhanced();
  const el = document.getElementById('full-rank-list');
  if (el) el.innerHTML = list.map(rankRow).join('');
}


function renderPodium() {
  const list  = _getLiveRankingsEnhanced();
  const t     = list.slice(0, 3);
  const order = [t[1], t[0], t[2]];
  const cls   = ['second', 'first', 'third'];
  const hs    = [58, 75, 44];
  const el = document.getElementById('podium');
  if (!el) return;
  const weeklyXP = Math.max(0, (S.xp || 0) - (S.leagueWeekXPBase || 0));
  if (weeklyXP === 0 && (S.completedMods || []).length === 0) {
    el.innerHTML = `<div style="padding:24px;text-align:center;background:var(--surface);border-radius:16px;border:1px dashed var(--border);">
      <div style="font-size:36px;margin-bottom:8px;opacity:.5;">🏆</div>
      <div style="font-size:13px;color:var(--text2);">Completa tu primer módulo para aparecer en el ranking.</div>
    </div>`;
    return;
  }
  el.innerHTML = order.map((r, i) => r ? `
    <div class="pd-slot ${cls[i]}">
      <div class="pd-name">${r.n.split(' ')[0]}</div>
      <div class="pd-av" style="background:linear-gradient(135deg,${r.cl}44,${r.cl}18);font-size:${i===1?22:17}px;">${r.em}</div>
      <div class="pd-block" style="height:${hs[i]}px;">${r.pos}</div>
      <div class="pd-xp">${r.xp.toLocaleString('es')} XP</div>
    </div>` : '').join('');
}


function renderAchievements() {
  const el = document.getElementById('ach-grid');
  if (!el) return;

  const unlocked = S.unlockedAchs || [];
  const total    = ACHIEVEMENTS.length;
  const doneCount= unlocked.length;

  el.className = 'ach-grid-v2';
  el.innerHTML = ACHIEVEMENTS.map(a => {
    const ok = unlocked.includes(a.id) || (a.check && a.check(S));
    return `<div class="ach-v2 ${ok ? 'unlocked' : 'locked'}">
      ${ok ? '<div class="ach-v2-check">✓</div>' : ''}
      <div class="ach-v2-icon">${ok ? a.i : '🔒'}</div>
      <div class="ach-v2-name">${a.n}</div>
      <div class="ach-v2-desc">${a.desc}</div>
    </div>`;
  }).join('');

  // Summary line above grid
  const summary = el.previousElementSibling;
  if (summary && summary.classList.contains('ach-summary')) {
    summary.textContent = `${doneCount} de ${total} desbloqueados`;
  }
}


function renderActivity() {
  const el = document.getElementById('activity-list');
  if (!el) return;
  const acts = [];
  (S.completedMods || []).slice().reverse().forEach((modId, i) => {
    const mod = MODULES.find(m => m.id === modId);
    if (!mod) return;
    const hoursAgo = (i + 1) * 2;
    const timeStr = hoursAgo < 24 ? (hoursAgo <= 1 ? 'Hace 1h' : 'Hace ' + hoursAgo + 'h')
                  : (hoursAgo < 48 ? 'Ayer' : 'Hace ' + Math.floor(hoursAgo/24) + ' días');
    acts.push({i: mod.icon, txt: 'Completaste <strong>' + mod.title + '</strong>', xp: '+' + mod.xp + ' XP', t: timeStr});
  });
  if (S.streak >= 3) acts.push({i:'🔥', txt:'Racha de <strong>' + S.streak + ' días</strong> activa', xp:'', t:'Activo'});
  acts.push({i:'🌱', txt:'Te uniste a <strong>FinLearn</strong>', xp:'+100 XP', t: S.startDate || 'Inicio'});
  if (acts.length === 1 && !S.completedMods.length) {
    el.innerHTML = '<div style="color:var(--text3);font-size:13px;padding:16px 0;text-align:center;">Completa tu primera lección para ver tu actividad aquí 🚀</div>';
    return;
  }
  el.innerHTML = acts.slice(0,8).map(a => `
    <div class="activity-item">
      <div class="ai-icon">${a.i}</div>
      <div style="flex:1;"><div class="ai-text">${a.txt}</div><div class="ai-time">${a.t}</div></div>
      ${a.xp ? `<div class="tag tag-green">${a.xp}</div>` : ''}
    </div>
  `).join('');
}


function updateCountdown() {
  const end = new Date(); end.setDate(end.getDate()+3); end.setHours(23,59,59);
  const d = end - new Date();
  const str = `${Math.floor(d/86400000)}d ${Math.floor((d%86400000)/3600000)}h ${Math.floor((d%3600000)/60000)}m`;
  ['chal-countdown','rank-reset'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=str.replace(' min',''); });
}


/* ── Portfolio & Stocks ───────────────────────────────────── */


function renderFact(idx) {
  const fact = FINANCIAL_FACTS[idx];
  const textEl  = document.getElementById('facts-text');
  const srcEl   = document.getElementById('facts-source');
  const dotsEl  = document.getElementById('facts-dots');
  if (textEl)  textEl.innerHTML  = fact.text;
  if (srcEl)   srcEl.textContent = fact.source;
  if (dotsEl) {
    dotsEl.innerHTML = FINANCIAL_FACTS.map((_, i) =>
      `<div class="facts-dot${i === idx ? ' active' : ''}" onclick="goToFact(${i})"></div>`
    ).join('');
  }
}



// ═══ UI — Vida ═══
/* ══════════════════════════════════════════════════════════════════
   ui-life.js — Simulador de vida · Patrimonio growth · Notificaciones · Badges · XP pop
   ─ Importa solo lo necesario de data.js y state.js.
   ─ No importa de script.js → sin dependencias circulares.
   ─ Las funciones de negocio (addXP, etc.) se acceden via window.*
     porque script.js las expone al arrancar la app.
══════════════════════════════════════════════════════════════════ */



function renderPatrimonyGrowthBanner(current, growthPct) {
  const bannerEl = document.getElementById('patrimony-growth-banner');
  if (!bannerEl) return;

  const isGrowth = growthPct >= 0;
  const arrow    = isGrowth ? '↑' : '↓';
  const color    = isGrowth ? 'var(--gain)' : 'var(--loss)';
  const bgColor  = isGrowth ? 'rgba(0,255,136,.05)' : 'rgba(255,75,92,.05)';
  const bdColor  = isGrowth ? 'rgba(0,255,136,.15)' : 'rgba(255,75,92,.15)';

  const history  = S.patrimonyHistory || [];
  const sparkSVG = buildSparkline(history.map(h => h.value));

  bannerEl.style.cssText   = `background:${bgColor};border:1px solid ${bdColor};border-radius:14px;padding:14px 16px;margin-bottom:16px;`;
  bannerEl.style.display   = 'block';

  const yearLabel = `Año de juego ${S.gameYear || 0}`;
  const absChange = Math.abs(current - (S.lastYearPatrimony || current));

  bannerEl.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:12px;">
      <div style="flex:1;">
        <div style="font-family:'DM Mono',monospace;font-size:10px;color:var(--text2);letter-spacing:.08em;margin-bottom:4px;">${yearLabel.toUpperCase()} · TU PATRIMONIO</div>
        <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:22px;color:var(--text);">€${Math.round(current).toLocaleString('es')}</div>
        <div style="font-size:13px;margin-top:4px;color:${color};font-weight:700;">
          ${arrow} ${isGrowth ? '+' : ''}${growthPct.toFixed(1)}% este año
          <span style="font-size:11px;color:var(--text2);font-weight:400;"> (${isGrowth ? '+' : '-'}€${Math.round(absChange).toLocaleString('es')})</span>
        </div>
        <div style="font-size:11px;color:var(--text2);margin-top:6px;line-height:1.4;">
          ${getPatrimonyMessage(growthPct, current)}
        </div>
      </div>
      <div style="width:80px;flex-shrink:0;">${sparkSVG}</div>
    </div>`;
}


function renderLifeScreen() {
  setEl('life-name', S.userName||'Tú');
  setEl('life-avatar-big', S.avatar||'🌱');
  const age = S.lifeAge||25;
  setEl('ls-age', age);
  setEl('life-age-label', `Edad: ${age} años`);
  const stage = age<30?'🌱 APRENDIZ':age<40?'📊 ANALISTA':age<50?'💼 INVERSOR':'🏝️ LIBRE';
  setEl('life-stage-label', stage);
  // Net worth
  const netWorth = (S.cash||0)+(S.balance||0)+
    Object.entries(S.portfolio||{}).reduce((acc,[t,p])=>acc+(GAME.stockPrices[t]||STOCKS.find(s=>s.ticker===t)?.price||0)*p.shares,0)+
    Object.keys(S.businesses||{}).reduce((acc,id)=>acc+(BUSINESSES.find(b=>b.id===id)?.cost||0)*0.8,0);
  S.patrimony = netWorth;
  setEl('ls-net-worth', netWorth>=1000?'€'+Math.round(netWorth/1000)+'k':'€'+Math.round(netWorth));
  // Monthly net
  const income = (S.lifeSalary||1800) +
    Object.keys(S.businesses||{}).reduce((acc,id)=>acc+(calcBizRevenue(id)-(BUSINESSES.find(b=>b.id===id)?.monthlyExpenses||0)),0);
  const exp = Object.values(S.lifeExpenses||{rent:0,food:0,transport:0,leisure:0,other:0}).reduce((a,b)=>a+b,0) +
    (S.monthlyContribution||0);
  const net = income - exp;
  setEl('ls-monthly-net', (net>=0?'+':'')+'€'+Math.round(net));
  // Happiness
  const h = Math.min(100,Math.max(0,S.lifeHappiness||70));
  setEl('ls-happiness', h>=80?'😄':h>=60?'😊':h>=40?'😐':h>=20?'😟':'😢');
  // Monthly flow breakdown
  renderLifeMonthlyFlow(income, exp);
  // Life events
  renderLifeEvents();
}


function renderLifeMonthlyFlow(income, expenses) {
  const el = document.getElementById('life-monthly-flow');
  if(!el) return;
  const sal = S.lifeSalary||1800;
  const bizNet = Object.keys(S.businesses||{}).reduce((acc,id)=>acc+(calcBizRevenue(id)-(BUSINESSES.find(b=>b.id===id)?.monthlyExpenses||0)),0);
  const expObj = S.lifeExpenses||{rent:0,food:0,transport:0,leisure:0,other:0};
  const totalExp = Object.values(expObj).reduce((a,b)=>a+b,0)+(S.monthlyContribution||0);
  const rows = [
    {icon:'💼',label:'Sueldo neto',amount:sal,type:'in'},
    bizNet>0?{icon:'🏪',label:'Negocios',amount:bizNet,type:'in'}:null,
    {icon:'🏠',label:'Vivienda (alquiler/hipoteca)',amount:expObj.rent||700,type:'out'},
    {icon:'🍽️',label:'Alimentación',amount:expObj.food||300,type:'out'},
    {icon:'🚗',label:'Transporte',amount:expObj.transport||100,type:'out'},
    {icon:'🎭',label:'Ocio y entretenimiento',amount:expObj.leisure||200,type:'out'},
    {icon:'📦',label:'Otros gastos',amount:expObj.other||150,type:'out'},
    S.monthlyContribution>0?{icon:'📈',label:'Inversión mensual',amount:S.monthlyContribution,type:'out'}:null,
  ].filter(Boolean);
  const totalIn = rows.filter(r=>r.type==='in').reduce((a,r)=>a+r.amount,0);
  const net = income-totalExp;
  el.innerHTML = rows.map(r=>`
    <div class="mf-row">
      <div class="mf-icon">${r.icon}</div>
      <div class="mf-label">${r.label}</div>
      <div class="mf-amount ${r.type}">${r.type==='in'?'+':'-'}€${r.amount.toLocaleString('es')}</div>
    </div>`).join('')+`
    <div class="mf-row" style="margin-top:6px;padding-top:10px;border-top:1px solid var(--border2);">
      <div class="mf-icon">${net>=0?'💚':'🔴'}</div>
      <div class="mf-label" style="font-weight:700;color:var(--text);">Ahorro neto mensual</div>
      <div class="mf-amount ${net>=0?'in':'out'}" style="font-family:'Syne',sans-serif;font-weight:800;font-size:16px;">${net>=0?'+':'-'}€${Math.abs(net).toLocaleString('es')}</div>
    </div>`;
}


function renderLifeEvents() {
  const el = document.getElementById('life-events-list');
  if(!el) return;
  const taken = (S.lifeEvents||[]).map(e=>e.id);
  const available = LIFE_EVENTS.filter(e=>!taken.includes(e.id)&&(!e.condition||e.condition(S)));
  el.innerHTML = available.slice(0,6).map(ev=>`
    <div class="life-event-card ${ev.type}" onclick="takeLifeEvent('${ev.id}')">
      <div class="lec-top">
        <div class="lec-icon">${ev.icon}</div>
        <div class="lec-info">
          <div class="lec-title">${ev.title}</div>
          <div class="lec-desc">${ev.desc}</div>
        </div>
        ${ev.effects.cost>0?`<div class="lec-cost"><div class="lec-cost-val">${fmtPrice(ev.effects.cost)}</div><div class="lec-cost-lab">Coste</div></div>`:''}
      </div>
      <div class="lec-impact">
        ${ev.effects.xp?`<span class="lec-badge xp">+${ev.effects.xp} XP</span>`:''}
        ${ev.effects.salaryMultiplier&&ev.effects.salaryMultiplier>1?`<span class="lec-badge income">+Sueldo ${Math.round((ev.effects.salaryMultiplier-1)*100)}%</span>`:''}
        ${ev.effects.salaryBonus?`<span class="lec-badge income">+€${ev.effects.salaryBonus}/mes</span>`:''}
        ${ev.effects.expenseIncrease?`<span class="lec-badge expense">-€${ev.effects.expenseIncrease}/mes</span>`:''}
        ${ev.effects.cost>0?`<span class="lec-badge expense">Pago único</span>`:''}
        ${ev.effects.happiness>0?`<span class="lec-badge income">+${ev.effects.happiness} bienestar</span>`:`<span class="lec-badge expense">${ev.effects.happiness} bienestar</span>`}
      </div>
    </div>`).join('');
  if(available.length===0) el.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text2);font-size:14px;">🎉 Has completado todos los eventos disponibles en tu etapa de vida actual.</div>`;
}


/* ── DCA & Patrimonio ─────────────────────────────────────── */


function showBadgeNotification(icon, name, desc) {
  const el = document.createElement('div');
  el.className = 'badge-notif';
  el.innerHTML = `
    <span class="bn-icon-big">${icon}</span>
    <div>
      <div class="bn-text">¡Badge desbloqueado! ${name}</div>
      <div class="bn-sub">${desc}</div>
    </div>
  `;
  document.body.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 400);
  }, 4000);
}


function spawnXPv2(text, source) {
  const el = document.createElement('div');
  el.className = 'xp-pop-v2';
  const colors = {dca:'#00e5a0', quiz:'#0091ff', module:'#fbbf24', default:'#00e5a0'};
  el.style.color = colors[source] || colors.default;
  el.textContent = text;
  const x = 30 + Math.random() * 40;
  el.style.cssText += `left:${x}%;top:60%;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}


function showXPMilestone(milestone) {
  const wrap = document.createElement('div');
  wrap.className = 'xp-milestone';
  wrap.innerHTML = `
    <div class="xp-milestone-inner">
      <div class="milestone-xp">⚡ ${milestone} XP</div>
      <div class="milestone-label">¡Nuevo hito alcanzado! Sigue así 🔥</div>
    </div>
  `;
  document.body.appendChild(wrap);
  setTimeout(() => {
    wrap.style.animation = 'milestoneIn .3s ease reverse';
    setTimeout(() => wrap.remove(), 350);
  }, 1800);
  toast(`⚡ ¡Hito ${milestone} XP!`, 'Cada 100 XP te acerca más a tu independencia financiera', 't-fire');
}


/* ── Streak Milestones ──────────────────────────────────────── */
var _STREAK_MILESTONES = [
  { days: 3,   xp: 50,   emoji: '🔥', title: '¡3 días seguidos!', msg: 'El hábito empieza aquí. El 70% no llega al día 3.' },
  { days: 7,   xp: 100,  emoji: '🦅', title: '¡Una semana de racha!', msg: 'Estás en el top 30% de usuarios. La constancia es tu ventaja.' },
  { days: 14,  xp: 200,  emoji: '💎', title: '¡14 días imparables!', msg: 'Dos semanas. Solo el 15% llega aquí. Tu cerebro ya está cambiando.' },
  { days: 30,  xp: 500,  emoji: '👑', title: '¡Un mes de racha!', msg: 'TOP 5%. Un mes de educación financiera diaria. Eres diferente.' },
  { days: 100, xp: 1000, emoji: '🌟', title: '¡100 DÍAS DE RACHA!', msg: 'Legendario. Menos del 1% llega aquí. Tu futuro financiero ya es diferente.' },
];

function _checkStreakMilestone(streak) {
  var milestones = S.streakMilestonesGiven || [];
  var hit = null;
  for (var i = 0; i < _STREAK_MILESTONES.length; i++) {
    var m = _STREAK_MILESTONES[i];
    if (streak === m.days && milestones.indexOf(m.days) === -1) { hit = m; break; }
  }
  if (!hit) return;
  milestones.push(hit.days);
  S.streakMilestonesGiven = milestones;
  S.xp = (S.xp || 0) + hit.xp;
  setTimeout(function() { _showStreakMilestone(hit); }, 1200);
}

function _showStreakMilestone(m) {
  SFX.levelUp && SFX.levelUp();
  confetti && confetti();
  var el = document.createElement('div');
  el.id = 'streak-milestone-overlay';
  el.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(6,8,16,.92);backdrop-filter:blur(8px);animation:fadeInFast .25s ease;';
  el.innerHTML =
    '<div style="text-align:center;padding:32px 24px;max-width:340px;">' +
      '<div style="font-size:80px;margin-bottom:16px;animation:celPop .5s cubic-bezier(.34,1.56,.64,1);">' + m.emoji + '</div>' +
      '<div style="font-family:\'Syne\',sans-serif;font-weight:800;font-size:28px;color:#fff;margin-bottom:8px;">' + m.title + '</div>' +
      '<div style="font-size:15px;color:rgba(255,255,255,.7);line-height:1.6;margin-bottom:20px;">' + m.msg + '</div>' +
      '<div style="display:inline-block;background:rgba(0,229,160,.15);border:1px solid var(--accent);border-radius:20px;padding:8px 20px;font-size:15px;font-weight:700;color:var(--accent);margin-bottom:28px;">+' + m.xp + ' XP de recompensa 🔥' + m.days + '</div>' +
      '<br><button onclick="document.getElementById(\'streak-milestone-overlay\').remove();" style="background:var(--accent);color:#000;border:none;border-radius:12px;padding:14px 40px;font-size:16px;font-weight:800;cursor:pointer;font-family:\'Syne\',sans-serif;">¡A por más! →</button>' +
    '</div>';
  document.body.appendChild(el);
  el.addEventListener('click', function(e) { if (e.target === el) el.remove(); });
}
window._checkStreakMilestone = _checkStreakMilestone;

/* ── Identidad & Perfil ───────────────────────────────────── */



// ═══ SCRIPT — Nav ═══
/* ══════════════════════════════════════════════════════════════════
   script-nav.js — Navegación y Renderizado de Pantalla Principal

   ¿QUÉ ES ESTO Y POR QUÉ EXISTE?
   ─────────────────────────────────────────────────────────────────
   Este archivo es el núcleo de la navegación de FinLearn.
   Controla qué pantalla se muestra y orquesta el renderizado
   inicial de cada sección cuando el usuario navega a ella.

   REGLA CRÍTICA: Este archivo NO importa de ningún otro script-*.js
   porque es el nodo raíz del grafo de dependencias. Todos los demás
   script-*.js pueden importar goTo de aquí, pero este archivo
   no puede importar de ellos → cero riesgo de dependencias circulares.

   QUÉ EXPORTA:
   · goTo(screen)              → navega a una pantalla por nombre lógico
   · showScreen(id)            → muestra un div.screen por su id HTML
   · safeGoHome()              → confirma antes de salir de una lección
   · renderHomeScreen()        → orquesta el renderizado completo del home
   · renderProfileScreen()     → renderiza la pantalla de perfil
   · renderDCA()               → renderiza la pregunta de acción diaria
   · answerDCA(chosen, correct, explanation) → procesa la respuesta DCA
   · _renderTicker()           → inicia el ticker de prueba social (rotación)
   · _renderFacts()            → inicia la rotación de datos financieros
   · _updateInactionModule()   → actualiza el módulo "coste de inacción"
══════════════════════════════════════════════════════════════════ */





/* ══════════════════════════════════════════════════════════════════
   NAVEGACIÓN PRINCIPAL
══════════════════════════════════════════════════════════════════ */

/**
 * goTo — Navega a una pantalla por nombre lógico.
 * ─────────────────────────────────────────────────────────────────
 * El map traduce nombres semánticos ('home', 'rank'…) a ids de div
 * HTML. Esto desacopla el código de los ids del HTML: si cambias
 * el id de un div, solo tocas el map aquí.
 *
 * También gestiona:
 * · El bottom nav (qué item queda activo)
 * · Ocultar el bottom nav en pantallas de flujo (lesson, cert…)
 * · Llamar al renderizado específico de cada pantalla
 */
function goTo(screen) {
  if (typeof closeToolModal === 'function') closeToolModal();
  const map = {
    home:      's-home',
    onboard:   's-onboard',
    lesson:    's-lesson',
    cert:      's-cert',
    rank:      's-rank',
    profile:   's-profile',
    stats:     's-stats',
    portfolio: 's-portfolio',
    business:  's-business',
    life:      's-life',
    future:    's-future',
    lifestyle: 's-lifestyle',
    tools:     's-tools',
    guides:    's-guides',
    realmoney: 's-realmoney',
  };
  const id = map[screen] || screen;
  document.querySelectorAll('.modal-overlay').forEach(m => {
    if (m.classList.contains('open') && !m.id.startsWith('m-guide-reader')) {
      m.remove();
    }
  });
  document.querySelectorAll('[data-animation-active]').forEach(el => {
    el.removeAttribute('data-animation-active');
  });
  if (window._activeTimers) {
    window._activeTimers.forEach(clearTimeout);
    window._activeTimers = [];
  }
  // Limpiar modales huérfanos al cambiar de pantalla
  document.querySelectorAll('.modal-overlay.open').forEach(m => {
    if (!m.id.startsWith('m-guide-reader')) {
      m.classList.remove('open');
      m.style.display = 'none';
    }
  });
  showScreen(id);

  // Actualizar bottom nav (marca el ítem activo)
  document.querySelectorAll('.bn-item').forEach(b => b.classList.remove('active'));
  const bn = document.getElementById('bn-' + screen);
  if (bn) bn.classList.add('active');

  // Ocultar bottom nav en pantallas de flujo (sin nav)
  const bottomNav = document.getElementById('bottom-nav');
  if (bottomNav) {
    const noNav = ['s-onboard', 's-lesson', 's-cert', 's-future', 's-lifestyle'];
    bottomNav.classList.toggle('hidden', noNav.includes(id));
  }

  // Renderizado específico por pantalla
  if (screen === 'home')      { renderHomeScreen(); if ((Date.now() - _appStartTime) > 30000) setTimeout(() => AI_COACH.proactiveCheck(), 2000); }
  if (screen === 'rank')      { renderFullRank(); renderPodium(); }
  if (screen === 'profile')   { renderProfileScreen(); }
  if (screen === 'stats')     { renderStatsScreen(); }
  if (screen === 'portfolio') {
    renderPortfolioSummary(); renderStockList(); renderMyPositions();
    setTimeout(() => CHART.init(), 50); setTimeout(renderPortfolioDonut, 120);
    // Refresh datos reales al entrar en bolsa
    if (typeof MARKET !== 'undefined') MARKET.init();
  }
  if (screen === 'business')  { renderBusinesses(); renderBizCashflow(); }
  if (screen === 'life')      { renderLifeScreen(); renderCareerCard(); renderLifeEvents(); }
  if (screen === 'lifestyle') { setTimeout(renderLifestyleComparator, 60); }
  if (screen === 'tools')     { if (typeof renderToolsScreen === 'function') renderToolsScreen(); }
  if (screen === 'guides')    { if (typeof renderGuidesScreen === 'function') renderGuidesScreen(); }
  if (screen === 'realmoney') {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('s-realmoney');
    if (el) el.classList.add('active');
    if (typeof _rmLoad === 'function') _rmLoad();
  }
}

/**
 * showScreen — Muestra un div.screen por su id HTML.
 * Quita la clase 'active' de todas las pantallas y la añade solo a la target.
 * También resetea el scroll al top (para que no aparezca a mitad de página).
 */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    el.scrollTop = 0;
  }
}

/**
 * safeGoHome — Sale de la lección con confirmación previa.
 * Guarda el estado antes de salir para no perder el progreso.
 */
function safeGoHome() {
  if (confirm('¿Salir de la lección? Tu progreso se guardará.')) {
    // Cancelar speedrun si estaba activo
    if (typeof SPEEDRUN_stop === 'function') SPEEDRUN_stop();
    saveState();
    goTo('home');
  }
}


/* ══════════════════════════════════════════════════════════════════
   RENDERIZADO DE PANTALLAS
══════════════════════════════════════════════════════════════════ */

/**
 * renderHomeScreen — Orquesta el renderizado completo del home.
 * ─────────────────────────────────────────────────────────────────
 * Llama a todas las funciones de ui.js que pintan secciones del home.
 * El orden importa: updateUIFromState() va primero porque inicializa
 * elementos que los demás renderers asumen que ya existen.
 */
function renderHomeScreen() {
  AMBIENT.init();
  // Ocultar splash/skeleton si sigue visible
  const splash = document.getElementById('app-splash');
  if (splash) splash.style.display = 'none';
  const skeleton = document.getElementById('home-skeleton');
  if (skeleton) skeleton.style.display = 'none';
  updateUIFromState();
  renderModules();
  renderHomeRank();
  // renderChallengeMembers(); — chal-members removed from home
  renderHealthScore();
  renderFinancialProfile();
  renderTemporalProgress();
  renderIdentity();
  renderDynamicMessage();
  updateProjection();
  _renderFacts();
  renderDCA();
  const dcaStreakEl = document.getElementById('dca-streak-nav');
  if (dcaStreakEl) dcaStreakEl.textContent = S.streak || 0;
  if (typeof renderMissionsCard === 'function') renderMissionsCard();
  // F24: personalized hero message + suggested module badge
  _f24_renderHeroMsg();
  _f24_highlightSuggestedModule();
  // F3X: Rutas de aprendizaje personalizadas
  if (typeof renderLearningPathCard === 'function') renderLearningPathCard();
  // F27: plan de acción personalizado
  if (typeof F27_render === 'function') F27_render();
  // F28: Skill Tree / vista módulos
  switchModView(_modView);
  // F29: Caja Sorpresa Diaria
  if (typeof F29_render === 'function') F29_render();
  // F30: Misiones Grupales
  if (typeof F30_render === 'function') F30_render();
  // F31: Badges de Identidad
  if (typeof F31_renderBadges === 'function') F31_renderBadges('f31-home-badges');
  // F32: Ligas Semanales (una sola llamada)
  if (typeof F32_render === 'function') F32_render();
  // F33: Streak Identity — banner Earn Back
  if (typeof F33_renderBanner === 'function') F33_renderBanner();
  // F34: Reto Diario
  if (typeof F34_render === 'function') F34_render();
  // F42: Problema del Día
  if (typeof F42_render === 'function') F42_render();
  // F44: Cofres
  if (typeof F44_render === 'function') F44_render();
  // F45: Eventos de Mercado
  if (typeof F45_checkTrigger === 'function') F45_checkTrigger();
  // F46: Hearts UI
  if (typeof F46_renderHearts === 'function') F46_renderHearts();
  // F48: Resumen Semanal
  if (typeof F48_checkShow === 'function') F48_checkShow();
  // F41: Escudo de racha
  if (typeof F41_renderShield === 'function') F41_renderShield();
  // M1: Doble XP banner
  if (typeof M1_checkDoubleXP === 'function') M1_checkDoubleXP();
  // M3: Friend streak
  if (typeof M3_render === 'function') M3_render();
  // Daily Hub (resumen diario de acciones pendientes)
  renderDailyHub();
  // F14: actualizar indicador de flashcards pendientes
  if (typeof _FC !== 'undefined' && _FC.updateEntryUI) _FC.updateEntryUI();
  // M2: Prestige check
  if (typeof M2_checkPrestige === 'function') M2_checkPrestige();
  // P4-A: Banner racha en riesgo (≥20:00 sin actividad)
  if (typeof renderStreakRiskBanner === 'function') renderStreakRiskBanner();
  // SEASONAL: banner de evento activo
  if (typeof SEA_render === 'function') { try { SEA_render(); } catch(e) { console.warn('[SEA]', e); } }
  renderIncomePanel();
  _renderStreakRepairBanner();
  _renderStreakDangerBanner();
  if (!document.getElementById('challenge-card')) {
    const cardWrap = document.createElement('div');
    cardWrap.id = 'challenge-card';
    cardWrap.style.cssText = 'margin:12px 16px;';
    const homeScreen = document.getElementById('s-home');
    if (homeScreen) homeScreen.appendChild(cardWrap);
  }
  _renderRealMoneyHomeCard();
  _renderWeeklyActionCard();
  // misión grupal pasa a Laboratorio
  renderHomeCTA();
  // Micro-animation: stagger de cards al entrar al home
  if (typeof _staggerHomeItems === 'function') setTimeout(_staggerHomeItems, 40);
}

function _getNextRecommendedMod() {
  if (typeof MODULES === 'undefined') return null;
  // Prioridad 1: módulo sugerido en onboarding
  if (S.suggestedModuleId) {
    const suggested = MODULES.find(m => m.id === S.suggestedModuleId && !S.completedMods.includes(m.id));
    if (suggested) return suggested;
  }
  // Prioridad 2: primer módulo no completado de la rama activa
  const activeBranch = S._activeBranch || 'fundamentos';
  const branchMod = MODULES.find(m =>
    (m.branch || m.category || '') === activeBranch && !S.completedMods.includes(m.id)
  );
  if (branchMod) return branchMod;
  // Prioridad 3: cualquier módulo no completado
  return MODULES.find(m => !S.completedMods.includes(m.id)) || null;
}

function renderDailyHub() {
  const el = document.getElementById('daily-hub');
  if (!el) return;

  const today     = new Date().toISOString().slice(0, 10);
  const dcaDone   = S.dcaLastDate === today;
  const nextMod   = _getNextRecommendedMod();
  const missions  = (S.weeklyMissions || []).filter(m => !m.done);
  const nearMission = missions.sort((a, b) => (b.progress / b.goal) - (a.progress / a.goal))[0];

  // Calcular cuántas acciones diarias quedan
  const actions = [];
  if (!dcaDone) actions.push({ icon:'💰', label:'DCA diario pendiente', onclick:"document.getElementById('tab-dca')?.click()||goTo('home')" });
  if (nextMod)  actions.push({ icon:'📖', label:`Módulo: ${nextMod.title}`, onclick:`startModule(${nextMod.id})` });
  if (nearMission) {
    const pct = Math.round((nearMission.progress / nearMission.goal) * 100);
    actions.push({ icon:'🎯', label:`Misión: ${nearMission.id} (${pct}%)`, onclick:"goTo('home')" });
  }

  if (actions.length === 0) {
    el.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(0,229,160,.12),rgba(0,229,160,.04));border:1px solid rgba(0,229,160,.25);border-radius:16px;padding:14px 16px;margin:0 0 4px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:28px;">✅</span>
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--accent);">¡Todo completado hoy!</div>
          <div style="font-size:11px;color:var(--text2);">Vuelve mañana para seguir tu racha.</div>
        </div>
      </div>`;
    return;
  }

  const items = actions.slice(0, 3).map(a => `
    <button onclick="${a.onclick}" style="display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 12px;width:100%;cursor:pointer;text-align:left;margin-bottom:6px;">
      <span style="font-size:20px;flex-shrink:0;">${a.icon}</span>
      <span style="font-size:12px;font-weight:600;color:var(--text1);">${a.label}</span>
      <span style="margin-left:auto;font-size:11px;color:var(--accent);">→</span>
    </button>`).join('');

  el.innerHTML = `
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px 14px 8px;margin:0 0 4px;">
      <div style="font-size:10px;font-weight:800;letter-spacing:.1em;color:var(--text3);margin-bottom:10px;">ACCIONES DE HOY</div>
      ${items}
    </div>`;
}

function renderHomeCTA() {
  var el = document.getElementById('home-continue-cta');
  if (!el) return;
  var completed = S.completedMods || [];
  if (completed.length === 0) { el.style.display = 'none'; return; }
  var targetId = null;
  if (S.suggestedModuleId != null && completed.indexOf(S.suggestedModuleId) === -1) {
    targetId = S.suggestedModuleId;
  }
  if (targetId === null && typeof MODULES !== 'undefined') {
    for (var i = 0; i < MODULES.length; i++) {
      var m = MODULES[i];
      if (m && typeof m.id === 'number' && completed.indexOf(m.id) === -1) { targetId = m.id; break; }
    }
  }
  if (targetId === null) { el.style.display = 'none'; return; }
  var mod = null;
  if (typeof MODULES !== 'undefined') {
    for (var j = 0; j < MODULES.length; j++) {
      if (MODULES[j] && MODULES[j].id === targetId) { mod = MODULES[j]; break; }
    }
  }
  if (!mod) { el.style.display = 'none'; return; }
  var isSuggested = (targetId === S.suggestedModuleId);
  var ctaLabel = isSuggested ? 'Módulo recomendado para ti' : 'Continúa donde lo dejaste';
  el.style.display = 'block';
  el.innerHTML = '<button onclick="startModule(' + targetId + ')" style="' +
    'display:flex;align-items:center;gap:12px;width:100%;' +
    'background:linear-gradient(135deg,var(--bg2) 0%,rgba(0,229,160,0.08) 100%);' +
    'border:1.5px solid var(--accent);border-radius:16px;padding:14px 16px;' +
    'cursor:pointer;text-align:left;position:relative;overflow:hidden;' +
    'animation:ctaPulse 2.4s ease-in-out infinite;">' +
    '<div style="font-size:36px;flex-shrink:0;line-height:1;">' + mod.icon + '</div>' +
    '<div style="flex:1;min-width:0;">' +
      '<div style="font-size:11px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:.6px;margin-bottom:2px;">' + ctaLabel + '</div>' +
      '<div style="font-size:15px;font-weight:800;color:var(--text1);font-family:\'Syne\',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + mod.title + '</div>' +
    '</div>' +
    '<div style="font-size:13px;font-weight:700;color:var(--accent);flex-shrink:0;">Continuar →</div>' +
  '</button>';
}
window.renderHomeCTA = renderHomeCTA;

/**
 * renderProfileScreen — Renderiza la pantalla de perfil.
 * Actualiza todos los datos del perfil desde S.
 */
/**
 * _f24_renderHeroMsg — Muestra el mensaje personalizado del onboarding en el hero card.
 * Solo visible si el usuario tiene un onboardHeroMsg generado en el onboarding.
 */
function _f24_renderHeroMsg() {
  const el = document.getElementById('ob-hero-msg');
  if (!el) return;
  if (S.onboardHeroMsg) {
    el.textContent = S.onboardHeroMsg;
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}

/**
 * _f24_highlightSuggestedModule — Añade badge "PARA TI 🎯" al módulo sugerido.
 * Solo se muestra si el módulo aún no está completado.
 */
function _f24_highlightSuggestedModule() {
  // Limpiar badges previos
  document.querySelectorAll('.mod-suggested-badge').forEach(b => b.remove());
  if (S.suggestedModuleId == null) return;
  const modId = S.suggestedModuleId;
  if ((S.completedMods || []).includes(modId)) return; // ya completado, no mostrar

  // Buscar la tarjeta del módulo por su atributo data-mod-id o por orden
  const cards = document.querySelectorAll('.mod-card[data-mod-id]');
  let target = null;
  cards.forEach(card => {
    if (parseInt(card.dataset.modId, 10) === modId) target = card;
  });
  if (!target) {
    // fallback: buscar por índice si no hay data-mod-id
    const allCards = document.querySelectorAll('.mod-card');
    if (allCards[modId]) target = allCards[modId];
  }
  if (!target) return;

  const badge = document.createElement('div');
  badge.className = 'mod-suggested-badge';
  badge.textContent = '🎯 Para ti';
  target.style.position = 'relative';
  target.appendChild(badge);
  // Scroll suave hacia el módulo sugerido (solo la primera vez)
  if (!S._suggestedScrolled) {
    S._suggestedScrolled = true;
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 800);
  }
}


/* ══════════════════════════════════════════════════════════════════
   F3X — RUTAS DE APRENDIZAJE PERSONALIZADAS
   ─────────────────────────────────────────────────────────────────
   Card en home con la rama recomendada según goal + investorLevel.
   Muestra los próximos módulos pendientes de la rama y permite
   cambiar la ruta con un quiz de 3 preguntas.
══════════════════════════════════════════════════════════════════ */

function renderLearningPathCard() {
  var el = document.getElementById('learning-path-card');
  if (!el) return;

  if (typeof F28_BRANCHES === 'undefined' || typeof MODULES === 'undefined') {
    el.style.display = 'none';
    return;
  }

  var branchId = S.suggestedBranchId;
  // Retrocompatibilidad: usuarios anteriores sin suggestedBranchId
  if (!branchId && S.suggestedModuleId != null) {
    branchId = _ob_getSuggestedBranch();
    S.suggestedBranchId = branchId;
  }
  if (!branchId && !S.goal && !S.investorLevel) {
    // Usuario nuevo sin perfil — mostrar teaser
    el.style.display = '';
    el.innerHTML = `
      <div class="lp-teaser" onclick="if(typeof RUTA_openQuiz==='function')RUTA_openQuiz()">
        <div class="lp-teaser-icon">🎯</div>
        <div class="lp-teaser-text">
          <div class="lp-teaser-title">Descubre tu ruta de aprendizaje</div>
          <div class="lp-teaser-sub">3 preguntas · Ruta personalizada en segundos</div>
        </div>
        <span class="lp-teaser-arrow">›</span>
      </div>`;
    return;
  }

  if (!branchId) branchId = _ob_getSuggestedBranch();

  var branch = F28_BRANCHES.find(function(b) { return b.id === branchId; });
  if (!branch) { el.style.display = 'none'; return; }

  var completed = S.completedMods || [];
  var pendingMods = branch.mods
    .filter(function(id) { return !completed.includes(id); })
    .slice(0, 3)
    .map(function(id) { return MODULES.find(function(m) { return m && m.id === id; }); })
    .filter(Boolean);

  var done = branch.mods.filter(function(id) { return completed.includes(id); }).length;
  var total = branch.mods.length;
  var pct = total > 0 ? Math.round((done / total) * 100) : 0;

  var modsHtml = pendingMods.length > 0
    ? pendingMods.map(function(m) {
        return '<div class="lp-mod-item" onclick="if(typeof startModule===\'function\')startModule(' + m.id + ')">' +
               '<span class="lp-mod-icon">' + (m.icon || '📖') + '</span>' +
               '<span class="lp-mod-title">' + (m.title || 'Módulo') + '</span>' +
               '<span class="lp-mod-arrow">›</span></div>';
      }).join('')
    : '<div class="lp-done-msg">🎉 ¡Rama completada! Empieza otra.</div>';

  el.style.display = '';
  el.innerHTML = `
    <div class="lp-card">
      <div class="lp-header">
        <div class="lp-branch-info">
          <span class="lp-emoji">${branch.emoji}</span>
          <div>
            <div class="lp-title">Tu ruta: <strong>${branch.label}</strong></div>
            <div class="lp-sub">${done}/${total} módulos · ${pct}% completado</div>
          </div>
        </div>
        <button class="lp-change-btn" onclick="if(typeof RUTA_openQuiz==='function')RUTA_openQuiz()" title="Cambiar ruta">✏️</button>
      </div>
      <div class="lp-progress-bar"><div class="lp-progress-fill" style="width:${pct}%;background:${branch.color}"></div></div>
      <div class="lp-mods">${modsHtml}</div>
    </div>`;
}

window.renderLearningPathCard = renderLearningPathCard;

/* ══════════════════════════════════════════════════════════════════
   F25 — TRACKER DE PATRIMONIO REAL
   ─────────────────────────────────────────────────────────────────
   Permite al usuario introducir su situación financiera real:
   activos (cuenta corriente, fondos, acciones, inmueble, pensión,
   otros) y deudas (hipoteca, préstamos, tarjetas).

   Al guardar:
   · Calcula S.realPatrimony (neto real)
   · Actualiza el hero card con badge "Real vs Simulado"
   · Genera análisis de salud financiera con datos reales
   · Construye recomendación personalizada

   API pública:
   · F25_open()          → abre el modal
   · F25_close()         → cierra el modal
   · F25_tab(name)       → cambia entre 'assets'|'debts'|'summary'
   · F25_liveUpdate()    → recalcula totales en tiempo real
   · F25_save()          → guarda, calcula y va al summary
══════════════════════════════════════════════════════════════════ */

/** Abre el modal y precarga valores guardados si existen. */
function F25_open() {
  if (!isPremium()) { PM_showPaywall('f25'); return; }
  openModal('m-real-patrimony');
  F25_tab('assets');
  F25_preload();
}

/** Cierra el modal y refresca el hero card. */
function F25_close() {
  closeModal('m-real-patrimony');
  renderFinancialProfile();
  _f25_renderHeroBadge();
}

/** Cambia entre los tres paneles del modal. */
function F25_tab(name) {
  ['assets','debts','summary'].forEach(t => {
    const tab   = document.getElementById('rpt-tab-'  + t);
    const panel = document.getElementById('rpt-panel-' + t);
    if (tab)   tab.classList.toggle('active',   t === name);
    if (panel) panel.classList.toggle('active', t === name);
  });
  if (name === 'summary' && S.realPatrimony !== null) F25_renderSummary();
}

/**
 * Precarga los inputs con los datos guardados en S.realAssets/realDebts.
 * Así el usuario puede actualizar sin volver a teclear todo.
 */
function F25_preload() {
  const a = S.realAssets || {};
  const d = S.realDebts  || {};
  const pairs = [
    ['rpt-checking', a.checking], ['rpt-funds',    a.funds],
    ['rpt-stocks',   a.stocks],   ['rpt-property', a.property],
    ['rpt-pension',  a.pension],  ['rpt-other',    a.other],
    ['rpt-mortgage', d.mortgage], ['rpt-loans',    d.loans],
    ['rpt-cards',    d.cards],
  ];
  pairs.forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val > 0 ? val : '';
  });

  // Última actualización
  const dateEl = document.getElementById('rpt-last-update');
  if (dateEl) {
    dateEl.textContent = S.realPatrimonyDate
      ? 'Actualizado el ' + new Date(S.realPatrimonyDate).toLocaleDateString('es-ES', { day:'numeric', month:'short', year:'numeric' })
      : 'Nunca actualizado';
  }
  F25_liveUpdate();
}

/** Recalcula totales en tiempo real mientras el usuario escribe. */
function F25_liveUpdate() {
  function v(id) { return parseFloat(document.getElementById(id)?.value) || 0; }
  const totalAssets = v('rpt-checking') + v('rpt-funds') + v('rpt-stocks') +
                      v('rpt-property') + v('rpt-pension') + v('rpt-other');
  const totalDebts  = v('rpt-mortgage') + v('rpt-loans') + v('rpt-cards');
  const net         = totalAssets - totalDebts;

  function fmt(n) { return (n < 0 ? '-€' : '€') + Math.abs(Math.round(n)).toLocaleString('es-ES'); }
  setEl('rpt-total-assets', fmt(totalAssets));
  setEl('rpt-total-debts',  fmt(totalDebts));
  const netEl = document.getElementById('rpt-net-preview');
  if (netEl) {
    netEl.textContent = fmt(net);
    netEl.style.color = net >= 0 ? 'var(--accent)' : 'var(--danger)';
  }

  // Actualizar slider visual del input activo
  const slider = document.getElementById('rpt-assets-bar');
  if (slider && totalAssets > 0) {
    slider.style.width = Math.min((totalDebts / totalAssets) * 100, 100) + '%';
  }
}

/**
 * Guarda los datos, calcula patrimonio neto real y va al resumen.
 */
function F25_save() {
  function v(id) { return parseFloat(document.getElementById(id)?.value) || 0; }

  const assets = {
    checking: v('rpt-checking'), funds:    v('rpt-funds'),
    stocks:   v('rpt-stocks'),   property: v('rpt-property'),
    pension:  v('rpt-pension'),  other:    v('rpt-other'),
  };
  const debts = {
    mortgage: v('rpt-mortgage'), loans: v('rpt-loans'), cards: v('rpt-cards'),
  };
  const totalAssets = Object.values(assets).reduce((s,x) => s + x, 0);
  const totalDebts  = Object.values(debts).reduce((s,x) => s + x, 0);
  const realNet     = totalAssets - totalDebts;

  S.realAssets       = assets;
  S.realDebts        = debts;
  S.realPatrimony    = realNet;
  S.realPatrimonyDate = new Date().toISOString();

  // Regenerar hero message con datos reales
  S.onboardHeroMsg = _ob_buildHeroMsg();
  // F27: invalidar plan para que se regenere con datos reales
  S._actionPlanHash = null;

  saveState();

  // Actualizar fecha en modal
  const dateEl = document.getElementById('rpt-last-update');
  if (dateEl) dateEl.textContent = 'Actualizado hoy';

  // Ir al resumen
  F25_tab('summary');
  F25_renderSummary();

  toast('✅ Patrimonio real guardado', `Neto: ${(realNet<0?'-€':'€') + Math.abs(Math.round(realNet)).toLocaleString('es-ES')}`, 't-success');
}

/**
 * Renderiza el panel de resumen con breakdown, health score y comparativa.
 */
function F25_renderSummary() {
  if (S.realPatrimony === null) return;
  const a = S.realAssets || {};
  const d = S.realDebts  || {};
  const totalA = Object.values(a).reduce((s,x) => s + x, 0);
  const totalD = Object.values(d).reduce((s,x) => s + x, 0);
  const net    = S.realPatrimony;

  function fmt(n) { return (n < 0 ? '-€' : '€') + Math.abs(Math.round(n)).toLocaleString('es-ES'); }

  // ── Patrimonio neto ──────────────────────────────────────────
  const amtEl = document.getElementById('rpt-sn-amount');
  if (amtEl) {
    amtEl.textContent = fmt(net);
    amtEl.style.color = net >= 0 ? 'var(--accent)' : 'var(--danger)';
  }
  const dateEl = document.getElementById('rpt-sn-date');
  if (dateEl) {
    dateEl.textContent = new Date(S.realPatrimonyDate).toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' });
  }

  // ── Breakdown barras ─────────────────────────────────────────
  const breakdown = document.getElementById('rpt-breakdown');
  if (breakdown) {
    const items = [
      { label:'Cuenta corriente', val: a.checking, color:'var(--accent)',  icon:'🏧' },
      { label:'Fondos/ETFs',      val: a.funds,    color:'var(--accent2)', icon:'📈' },
      { label:'Acciones',         val: a.stocks,   color:'#06b6d4',        icon:'🏢' },
      { label:'Inmueble',         val: a.property, color:'#f59e0b',        icon:'🏠' },
      { label:'Plan pensiones',   val: a.pension,  color:'#a78bfa',        icon:'🌅' },
      { label:'Otros activos',    val: a.other,    color:'var(--text3)',   icon:'📦' },
      { label:'Hipoteca',         val:-d.mortgage, color:'var(--danger)',  icon:'🏠' },
      { label:'Préstamos',        val:-d.loans,    color:'#ef4444',        icon:'🚗' },
      { label:'Tarjetas',         val:-d.cards,    color:'#f97316',        icon:'💳' },
    ].filter(x => x.val !== 0);

    const maxAbs = Math.max(...items.map(x => Math.abs(x.val)), 1);
    breakdown.innerHTML = '<div class="rpt-bd-title">Desglose</div>' +
      items.map(x => {
        const w = (Math.abs(x.val) / maxAbs * 100).toFixed(1);
        const isDebt = x.val < 0;
        return `<div class="rpt-bd-row">
          <div class="rpt-bd-label">${x.icon} ${x.label}</div>
          <div class="rpt-bd-bar-wrap">
            <div class="rpt-bd-bar" style="width:${w}%;background:${x.color};opacity:${isDebt?.7:1};"></div>
          </div>
          <div class="rpt-bd-val" style="color:${x.val<0?'var(--danger)':'var(--text)'}">${fmt(x.val)}</div>
        </div>`;
      }).join('');
  }

  // ── Health score REAL ────────────────────────────────────────
  const score = _f25_calcRealHealthScore(a, d, totalA, totalD);
  const healthCard = document.getElementById('rpt-health-card');
  if (healthCard) {
    const level  = score >= 70 ? { label:'Buena', color:'var(--accent)' }
                 : score >= 40 ? { label:'Media', color:'#f59e0b' }
                 : { label:'Mejorable', color:'var(--danger)' };
    const details = _f25_healthDetails(a, d, totalA, totalD, net);
    healthCard.innerHTML = `
      <div class="rpt-hc-row">
        <div>
          <div class="rpt-hc-title">Salud financiera real</div>
          <div class="rpt-hc-sub">${details.summary}</div>
        </div>
        <div class="rpt-hc-score" style="color:${level.color}">${score}<span style="font-size:14px">/100</span></div>
      </div>
      <div class="rpt-hc-bar-wrap">
        <div class="rpt-hc-bar-fill" style="width:${score}%;background:${level.color};"></div>
      </div>
      <div class="rpt-hc-items">
        ${details.items.map(i => `<div class="rpt-hc-item ${i.ok?'ok':'warn'}">${i.ok?'✓':'⚠'} ${i.text}</div>`).join('')}
      </div>`;
  }

  // ── Comparativa simulado vs real ─────────────────────────────
  const compareCard = document.getElementById('rpt-compare-card');
  if (compareCard) {
    const simulated = S.patrimony || 0;
    const diff      = net - simulated;
    const hasSim    = simulated !== 0 || S.completedMods.length > 0;
    if (hasSim) {
      compareCard.innerHTML = `
        <div class="rpt-cc-title">Simulado vs Real</div>
        <div class="rpt-cc-row">
          <div class="rpt-cc-block">
            <div class="rpt-cc-label">🎮 Simulado</div>
            <div class="rpt-cc-val b">${fmt(simulated)}</div>
          </div>
          <div class="rpt-cc-vs">vs</div>
          <div class="rpt-cc-block">
            <div class="rpt-cc-label">🏦 Real</div>
            <div class="rpt-cc-val" style="color:${net>=0?'var(--accent)':'var(--danger)'}">${fmt(net)}</div>
          </div>
        </div>
        <div class="rpt-cc-diff" style="color:${diff>=0?'var(--accent)':'var(--danger)'}">
          ${diff >= 0 ? '▲' : '▼'} ${fmt(Math.abs(diff))} ${diff >= 0 ? 'más' : 'menos'} que el simulador
        </div>`;
      compareCard.style.display = 'block';
    } else {
      compareCard.style.display = 'none';
    }
  }

  // ── Recomendación personalizada ──────────────────────────────
  const adviceCard = document.getElementById('rpt-advice-card');
  if (adviceCard) {
    const advice = _f25_buildAdvice(a, d, totalA, totalD, net, score);
    adviceCard.innerHTML = `
      <div class="rpt-adv-title">💡 Próximos pasos para ti</div>
      ${advice.map(a => `<div class="rpt-adv-item">${a}</div>`).join('')}`;
  }

  // Actualizar hero badge tras guardar
  _f25_renderHeroBadge();
}

/**
 * Calcula score de salud financiera con datos reales (0-100).
 * Cuatro dimensiones: liquidez, inversión, deuda, diversificación.
 */
function _f25_calcRealHealthScore(assets, debts, totalA, totalD) {
  const income = S.income || S.lifeSalary || 1800;
  let score = 0;

  // 1. Liquidez: cuenta corriente ≥ 3 meses de gastos (25 pts)
  const monthlyExpenses = income * 0.7;
  const emergencyTarget = monthlyExpenses * 3;
  score += Math.min(25, (assets.checking / Math.max(emergencyTarget, 1)) * 25);

  // 2. Inversión: fondos+ETFs+acciones como % del total activos (25 pts)
  const invested = (assets.funds || 0) + (assets.stocks || 0);
  if (totalA > 0) score += Math.min(25, (invested / totalA) * 50);

  // 3. Ratio deuda/activos: menos deuda = mejor (25 pts)
  if (totalA > 0) score += Math.max(0, 25 - (totalD / Math.max(totalA, 1)) * 50);
  else score += totalD === 0 ? 25 : 0;

  // 4. Diversificación: cuántos tipos de activos distintos tiene (25 pts)
  const types = [assets.checking, assets.funds, assets.stocks, assets.property, assets.pension, assets.other]
    .filter(x => x > 0).length;
  score += Math.min(25, (types / 4) * 25);

  return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * Genera los ítems de detalle del health score real.
 */
function _f25_healthDetails(assets, debts, totalA, totalD, net) {
  const income = S.income || S.lifeSalary || 1800;
  const emergency = (assets.checking || 0) >= income * 2.1;  // ≥ 3 meses
  const hasInvested = (assets.funds || 0) + (assets.stocks || 0) > 0;
  const debtRatio = totalA > 0 ? totalD / totalA : 1;
  const hasPension = (assets.pension || 0) > 0;

  const items = [
    { ok: emergency,                   text: emergency ? 'Fondo de emergencia cubierto' : 'Fondo de emergencia insuficiente (< 3 meses)' },
    { ok: hasInvested,                 text: hasInvested ? 'Tienes activos invertidos' : 'Sin fondos ni acciones — tu dinero no trabaja' },
    { ok: debtRatio < 0.4,             text: debtRatio < 0.4 ? `Ratio deuda/activos saludable (${(debtRatio*100).toFixed(0)}%)` : `Ratio deuda/activos alto (${(debtRatio*100).toFixed(0)}%)` },
    { ok: hasPension,                  text: hasPension ? 'Preparando la jubilación' : 'Sin plan de pensiones — considera empezar' },
    { ok: net >= 0,                    text: net >= 0 ? 'Patrimonio neto positivo' : 'Patrimonio neto negativo — las deudas superan activos' },
  ];

  const okCount = items.filter(i => i.ok).length;
  const summary = okCount >= 4 ? 'Situación sólida — optimiza lo que tienes'
                : okCount >= 2 ? 'Base en construcción — hay pasos claros'
                : 'Punto de partida — cada módulo suma';
  return { items, summary };
}

/**
 * Genera 2-3 recomendaciones personalizadas según los datos reales.
 */
function _f25_buildAdvice(assets, debts, totalA, totalD, net, score) {
  const advice = [];
  const income  = S.income || S.lifeSalary || 1800;
  const checking = assets.checking || 0;
  const invested  = (assets.funds || 0) + (assets.stocks || 0);
  const cards     = debts.cards  || 0;
  const loans     = debts.loans  || 0;

  // Prioridad 1: deuda cara
  if (cards > 500)
    advice.push(`💳 Tienes ${('€' + cards.toLocaleString('es-ES'))} en tarjetas. Es tu deuda más cara (18-24% TAE) — eliminarla primero da un retorno garantizado.`);
  else if (loans > 2000)
    advice.push(`🚗 Con ${('€' + loans.toLocaleString('es-ES'))} en préstamos, amortizar antes de invertir puede ser lo más rentable según el tipo de interés.`);

  // Prioridad 2: fondo de emergencia
  if (checking < income * 2.1)
    advice.push(`🛡️ Objetivo inmediato: llegar a ${('€' + Math.round(income * 3).toLocaleString('es-ES'))} en cuenta corriente (3 meses de gastos). Esto te da tranquilidad para invertir con cabeza.`);

  // Prioridad 3: invertir
  if (checking >= income * 3 && invested === 0)
    advice.push(`📈 Tienes liquidez pero sin inversión — tu dinero pierde poder adquisitivo con la inflación. Un ETF indexado global es el primer paso.`);
  else if (invested > 0 && invested / totalA < 0.2)
    advice.push(`🎯 Solo el ${((invested/totalA)*100).toFixed(0)}% de tus activos está invertido. Aumentar esta proporción acelerará tu patrimonio significativamente.`);

  // Prioridad 4: pensión
  if (!assets.pension && net > 10000)
    advice.push(`🌅 Con patrimonio positivo, considera abrir un plan de pensiones o alternativa (PIAS) — el beneficio fiscal es inmediato.`);

  // Fallback
  if (advice.length === 0)
    advice.push(`✨ Tu situación es sólida. El siguiente nivel es optimizar la rentabilidad de lo que ya tienes: diversificación geográfica y rebalanceo anual.`);

  return advice.slice(0, 3);
}

/**
 * Actualiza el hero card del home con el badge "Real" cuando hay datos reales.
 * Diferencia visual clara entre "Patrimonio simulado" y "Patrimonio real".
 */
function _f25_renderHeroBadge() {
  const eyebrow  = document.getElementById('fpcard-eyebrow');
  const badge    = document.getElementById('hero-real-badge');
  const btn      = document.getElementById('hero-real-btn-label');
  const heroCard = document.getElementById('finprofile-card');

  if (S.realPatrimony !== null) {
    // Hay datos reales — mostrar badge con comparativa
    if (eyebrow) eyebrow.textContent = 'Patrimonio simulado';
    if (badge) {
      const net = S.realPatrimony;
      const sim = S.patrimony || 0;
      const diff = net - sim;
      badge.innerHTML = `<span class="hrb-label">Real</span><span class="hrb-val" style="color:${net>=0?'var(--accent)':'var(--danger)'}">
        ${net < 0 ? '-' : ''}€${Math.abs(Math.round(net)).toLocaleString('es-ES')}</span>
        ${diff !== 0 ? `<span class="hrb-diff" style="color:${diff>=0?'var(--accent)':'var(--danger)'}">
          ${diff>=0?'▲':'▼'} €${Math.abs(Math.round(diff)).toLocaleString('es-ES')}</span>` : ''}`;
      badge.style.display = 'flex';
    }
    if (btn) btn.textContent = '✏️ Actualizar datos';
    if (heroCard) heroCard.classList.add('has-real-data');
  } else {
    // Sin datos reales todavía
    if (eyebrow) eyebrow.textContent = 'Patrimonio simulado';
    if (badge)   badge.style.display = 'none';
    if (btn)     btn.textContent = '📊 Mi patrimonio real';
    if (heroCard) heroCard.classList.remove('has-real-data');
  }
}


/* ══════════════════════════════════════════════════════════════════
   F27 — PLAN DE ACCIÓN PERSONALIZADO
   ─────────────────────────────────────────────────────────────────
   El plan de acción más importante de la app: convierte al
   "ahorrador paralizado" en un inversor activo dándole pasos
   concretos, ordenados y con cantidades reales calculadas desde
   sus datos (F24 + F25).

   FILOSOFÍA DE DISEÑO:
   · Nunca más de 5 pasos — los planes largos abruman
   · Cada paso tiene UNA acción clara, no conceptos
   · Las cantidades son reales (calculadas desde realAssets/income)
   · Orden de prioridad financiera universal:
       1. Fondo de emergencia
       2. Deuda cara (tarjetas > préstamos > hipoteca)
       3. Primera inversión indexada
       4. Automatizar aportación mensual
       5. Optimizar/diversificar según objetivo

   ESTADO EN S:
   · S.actionPlan   = [{ id, status:'pending'|'done'|'active', … }]
   · S.actionPlanTs = timestamp de cuando se generó el plan

   API pública:
   · F27_render()    → renderiza el widget en el home
   · F27_refresh()   → regenera el plan (cuando cambian datos de F24/F25)
   · F27_stepDone(id)→ marca un paso como completado
   · F27_generate()  → calcula y devuelve el array de pasos
══════════════════════════════════════════════════════════════════ */

/**
 * F27_generate — El corazón de F27.
 * Calcula un plan de 3-5 pasos personalizado basado en la situación
 * financiera real del usuario. Devuelve un array de steps.
 *
 * Cada step: {
 *   id:       string único
 *   icon:     emoji
 *   category: 'emergencia'|'deuda'|'inversion'|'automatizar'|'optimizar'
 *   title:    string corto (<50 chars)
 *   body:     string descriptivo con cantidad real
 *   amount:   número (puede ser null)
 *   amountLabel: string formateado
 *   cta:      string — texto del botón de acción
 *   ctaAction: 'module'|'f25'|'external'|'none'
 *   ctaTarget: moduleId | null
 *   urgency:  'high'|'medium'|'low'
 *   status:   'active'|'pending'|'done'
 * }
 */
function F27_generate() {
  const a     = S.realAssets  || {};
  const d     = S.realDebts   || {};
  const steps = [];

  // ── Datos del usuario ──────────────────────────────────────────
  const income    = S.income    || S.lifeSalary || 1800;
  const monthly   = S.monthlyContribution || 0;
  const goal      = S.goal      || 'freedom';
  const level     = S.investorLevel || 'zero';
  const checking  = a.checking  || 0;
  const funds     = a.funds     || 0;
  const stocks    = a.stocks    || 0;
  const property  = a.property  || 0;
  const pension   = a.pension   || 0;
  const mortgage  = d.mortgage  || 0;
  const loans     = d.loans     || 0;
  const cards     = d.cards     || 0;
  const totalA    = checking + funds + stocks + property + pension + (a.other||0);
  const totalD    = mortgage + loans + cards;
  const netWorth  = totalA - totalD;

  // Fondo de emergencia objetivo: 3-6 meses de gastos estimados
  const monthlyExpenses = income * 0.7;
  const emergencyMin    = Math.round(monthlyExpenses * 3);
  const emergencyIdeal  = Math.round(monthlyExpenses * 6);
  const hasEmergency    = checking >= emergencyMin;
  const invested        = funds + stocks;
  const hasInvestment   = invested > 0 || level === 'investing' || level === 'active';

  function fmt(n) {
    return '€' + Math.round(n).toLocaleString('es-ES');
  }

  // ─────────────────────────────────────────────────────────────
  // PASO A: Fondo de emergencia
  // ─────────────────────────────────────────────────────────────
  if (!hasEmergency) {
    const gap     = emergencyMin - checking;
    const months  = monthly > 0 ? Math.ceil(gap / monthly) : null;
    steps.push({
      id: 'emergency',
      icon: '🛡️',
      category: 'emergencia',
      title: 'Crea tu fondo de emergencia',
      body: `Necesitas ${fmt(emergencyMin)} en cuenta corriente (3 meses de gastos). Ahora tienes ${fmt(checking)} — te faltan ${fmt(gap)}.${months ? ` Con ${fmt(monthly)}/mes lo consigues en ${months} ${months===1?'mes':'meses'}.` : ' Define una aportación mensual para calcularlo.'}`,
      amount: gap,
      amountLabel: fmt(gap),
      cta: 'Ver módulo: Fondo de Emergencia',
      ctaAction: 'module',
      ctaTarget: 29,
      urgency: 'high',
      status: 'active',
    });
  }

  // ─────────────────────────────────────────────────────────────
  // PASO B: Deuda cara — tarjetas primero (mayor TAE)
  // ─────────────────────────────────────────────────────────────
  if (cards > 200) {
    const months = monthly > 0 ? Math.ceil(cards / (monthly * 0.7)) : null;
    steps.push({
      id: 'cards',
      icon: '💳',
      category: 'deuda',
      title: 'Elimina la deuda de tarjetas',
      body: `Tienes ${fmt(cards)} en tarjetas al ~20% TAE. Esta deuda crece ${fmt(Math.round(cards*0.2/12))}/mes en intereses. Antes de invertir nada, este es tu mejor "rendimiento garantizado".${months ? ` En ~${months} meses puedes liquidarla.` : ''}`,
      amount: cards,
      amountLabel: fmt(cards),
      cta: 'Aprender: Deuda Inteligente',
      ctaAction: 'module',
      ctaTarget: 25,
      urgency: 'high',
      status: cards > 0 && !hasEmergency ? 'pending' : 'active',
    });
  } else if (loans > 3000) {
    steps.push({
      id: 'loans',
      icon: '🔓',
      category: 'deuda',
      title: 'Amortiza tus préstamos',
      body: `Tienes ${fmt(loans)} en préstamos. Si el tipo de interés supera el 5%, amortizar es más rentable que invertir. Calcula exactamente cuánto te cuesta cada euro de deuda.`,
      amount: loans,
      amountLabel: fmt(loans),
      cta: 'Calcular: ¿Amortizar o invertir?',
      ctaAction: 'module',
      ctaTarget: 14,
      urgency: 'medium',
      status: 'pending',
    });
  }

  // ─────────────────────────────────────────────────────────────
  // PASO C: Primera inversión
  // ─────────────────────────────────────────────────────────────
  if (hasEmergency && !hasInvestment && checking > emergencyMin) {
    const toInvest = Math.round(checking - emergencyMin);
    const proj10   = calcCompound(toInvest, monthly, 8, 10);
    steps.push({
      id: 'first_invest',
      icon: '📈',
      category: 'inversion',
      title: `Mueve ${fmt(toInvest)} a un ETF global`,
      body: `Tienes ${fmt(checking - emergencyMin)} por encima de tu fondo de emergencia sin trabajar. Invertido en un ETF MSCI World (VWCE/IWDA) al 8% histórico, en 10 años serían ${fmt(proj10)}.`,
      amount: toInvest,
      amountLabel: fmt(toInvest),
      cta: 'Aprender: ETFs e Indexación',
      ctaAction: 'module',
      ctaTarget: 26,
      urgency: 'high',
      status: 'active',
    });
  } else if (hasEmergency && hasInvestment && level === 'saving') {
    // Tiene algo invertido pero puede mejorar
    const toAdd = Math.round(Math.max(0, checking - emergencyIdeal));
    if (toAdd > 500) {
      steps.push({
        id: 'add_invest',
        icon: '📊',
        category: 'inversion',
        title: `Aumenta tu cartera en ${fmt(toAdd)}`,
        body: `Tienes ${fmt(toAdd)} extra en cuenta que supera tu colchón ideal. Añadirlos a tu cartera indexada acelera tu camino hacia ${goal === 'freedom' ? 'la libertad financiera' : 'tu objetivo'}.`,
        amount: toAdd,
        amountLabel: fmt(toAdd),
        cta: 'Ver: Arquitectura de Cartera',
        ctaAction: 'module',
        ctaTarget: 1,
        urgency: 'medium',
        status: 'active',
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PASO D: Automatizar aportación mensual
  // ─────────────────────────────────────────────────────────────
  if (monthly === 0) {
    steps.push({
      id: 'automate_zero',
      icon: '🔁',
      category: 'automatizar',
      title: 'Define tu aportación mensual',
      body: `No tienes configurada ninguna aportación mensual. Incluso ${fmt(50)}/mes al 8% durante 30 años = ${fmt(calcCompound(0,50,8,30))}. Elige una cantidad y ponla en automático.`,
      amount: null,
      amountLabel: null,
      cta: 'Aprender: El hábito del inversor',
      ctaAction: 'module',
      ctaTarget: 0,
      urgency: 'high',
      status: 'active',
    });
  } else if (monthly > 0) {
    const pct = income > 0 ? (monthly / income * 100).toFixed(0) : null;
    const proj20 = calcCompound(Math.max(0, netWorth), monthly, 8, 20);
    steps.push({
      id: 'automate',
      icon: '🔁',
      category: 'automatizar',
      title: `Automatiza ${fmt(monthly)}/mes`,
      body: `Tienes configurados ${fmt(monthly)}/mes ${pct ? `(${pct}% de tus ingresos)` : ''}. Asegúrate de que sale automáticamente el día 1 de cada mes a tu broker — la automatización elimina la fricción y los errores emocionales.${proj20 ? ` En 20 años: ${fmt(proj20)}.` : ''}`,
      amount: monthly,
      amountLabel: fmt(monthly) + '/mes',
      cta: 'Ver: Psicología del Inversor',
      ctaAction: 'module',
      ctaTarget: 2,
      urgency: 'low',
      status: 'pending',
    });
  }

  // ─────────────────────────────────────────────────────────────
  // PASO E: Optimización / siguiente nivel según objetivo
  // ─────────────────────────────────────────────────────────────
  const optimizeMap = {
    freedom: {
      icon: '🏝️', title: 'Calcula tu número FIRE',
      body: `Tu objetivo es la libertad financiera. La Regla del 4% dice que necesitas ${fmt((income*12*25))} en cartera para vivir de las rentas. ${netWorth > 0 ? `Ya llevas ${fmt(netWorth)} — vas al ${((netWorth/(income*12*25))*100).toFixed(1)}% del camino.` : 'El primer paso ya está dado: educarte.'}`,
      cta: 'Módulo FIRE',  ctaTarget: 24, urgency: 'medium'
    },
    house: {
      icon: '🏠', title: 'Calcula cuándo podrás comprar',
      body: `Para una entrada del 20% en una vivienda media necesitarás entre €40.000-€80.000. Con ${fmt(monthly)}/mes lo consigues en ${monthly>0?Math.ceil(60000/monthly)+' meses':'— define una aportación'}.`,
      cta: 'Módulo Alquiler vs Compra', ctaTarget: 10, urgency: 'medium'
    },
    retire: {
      icon: '🌅', title: 'Construye tu plan de pensiones',
      body: pension > 0 ? `Tienes ${fmt(pension)} en pensiones. El objetivo es acumular 20x tu salario anual — ahora llevas ${fmt(pension)} de ${fmt(income*12*20)}.` : `No tienes plan de pensiones. Las aportaciones tienen beneficio fiscal inmediato. Aunque sea ${fmt(100)}/mes marca la diferencia.`,
      cta: 'Módulo Jubilación', ctaTarget: 18, urgency: 'medium'
    },
    debt: {
      icon: '💪', title: 'Plan de liquidación de deudas',
      body: totalD > 0 ? `Total deudas: ${fmt(totalD)}. La estrategia avalancha (mayor TAE primero) te ahorra más dinero. La bola de nieve (menor saldo primero) te da más victorias psicológicas.` : '✅ No tienes deudas — empieza a invertir todo tu capital disponible.',
      cta: 'Módulo Deuda Inteligente', ctaTarget: 25, urgency: totalD > 0 ? 'high' : 'low'
    },
    invest: {
      icon: '📊', title: 'Diversifica tu cartera',
      body: invested > 0 ? `Tienes ${fmt(invested)} invertido. El siguiente nivel es diversificación geográfica: 80% global (VWCE) + 10% emergentes + 10% bonos si tu horizonte es < 10 años.` : `Estás listo para empezar. Un ETF indexado global (VWCE o IWDA) con costes < 0.25% TER es el punto de partida óptimo.`,
      cta: 'Módulo ETFs e Indexación', ctaTarget: 26, urgency: 'medium'
    },
    emergency: {
      icon: '🛡️', title: 'Amplía el fondo a 6 meses',
      body: checking >= emergencyMin ? `Tienes ${fmt(checking)} cubriendo ${Math.floor(checking/monthlyExpenses)} meses de gastos. El objetivo ideal son 6 meses (${fmt(emergencyIdeal)}).` : `Prioritario: llegar a ${fmt(emergencyMin)} antes de invertir nada.`,
      cta: 'Módulo Fondo de Emergencia', ctaTarget: 29, urgency: 'medium'
    },
  };

  const opt = optimizeMap[goal] || optimizeMap.freedom;
  steps.push({
    id: 'optimize_' + goal,
    icon: opt.icon,
    category: 'optimizar',
    title: opt.title,
    body: opt.body,
    amount: null,
    amountLabel: null,
    cta: opt.cta,
    ctaAction: 'module',
    ctaTarget: opt.ctaTarget,
    urgency: opt.urgency,
    status: 'pending',
  });

  // ─────────────────────────────────────────────────────────────
  // Limitar a 5 pasos máximo. Priorizar: high > medium > low
  // y respetar el orden financiero lógico
  // ─────────────────────────────────────────────────────────────
  const prioritized = steps
    .filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i) // deduplicar
    .slice(0, 5);

  // Sincronizar con el estado guardado (preservar 'done')
  const existing = S.actionPlan || [];
  return prioritized.map((step, idx) => {
    const saved = existing.find(e => e.id === step.id);
    return {
      ...step,
      status: saved?.status === 'done' ? 'done' : (idx === 0 ? 'active' : step.status),
      order: idx,
    };
  });
}

/**
 * F27_render — Renderiza el widget del plan de acción en el home screen.
 * Solo visible si el usuario tiene userName (ha hecho onboarding).
 */
function F27_render() {
  if (!isPremium()) {
    const el = document.getElementById('f27-action-plan');
    if (el) {
      el.style.display = 'block';
      el.innerHTML = `<div style="padding:16px;text-align:center;background:var(--surface);border-radius:16px;border:1px solid var(--border);">
        <div style="font-size:28px;margin-bottom:8px;">🗺️</div>
        <div style="font-weight:700;font-size:15px;color:var(--text1);margin-bottom:4px;">Plan de Acción Personalizado</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:12px;">Pasos concretos según tu situación real.</div>
        <button class="btn btn-primary btn-sm" onclick="PM_showPaywall('f27')">✦ Desbloquear con Premium</button>
      </div>`;
    }
    return;
  }
  const card = document.getElementById('f27-action-plan');
  if (!card) return;

  // Ocultar si no hay usuario o si es muy nuevo (sin datos relevantes)
  if (!S.userName) { card.style.display = 'none'; return; }

  // Generar plan si no existe o si los datos cambiaron desde la última vez
  const dataHash = _f27_dataHash();
  if (!S.actionPlan || S.actionPlan.length === 0 || S._actionPlanHash !== dataHash) {
    S.actionPlan      = F27_generate();
    S._actionPlanHash = dataHash;
  }

  const steps    = S.actionPlan;
  const total    = steps.length;
  const done     = steps.filter(s => s.status === 'done').length;
  const pct      = total > 0 ? Math.round((done / total) * 100) : 0;
  const circ     = 113; // 2π×18
  const offset   = circ - (pct / 100) * circ;

  // Progress ring
  const ringFg = document.getElementById('f27-ring-fg');
  if (ringFg) {
    ringFg.style.strokeDashoffset = offset;
    ringFg.style.stroke = pct >= 80 ? 'var(--accent)' : pct >= 40 ? 'var(--accent2)' : 'var(--gold)';
  }
  setEl('f27-ring-label', `${done}/${total}`);

  // Barra global
  const bar = document.getElementById('f27-global-bar');
  if (bar) bar.style.width = pct + '%';

  // Sub-headline contextual
  const nextActive = steps.find(s => s.status !== 'done');
  const subTexts = {
    0:   `${S.userName ? S.userName.split(' ')[0] : 'Tú'}, aquí están tus próximos pasos reales.`,
    100: '🎉 ¡Plan completado! Tu situación financiera ha mejorado significativamente.',
  };
  setEl('f27-plan-sub', subTexts[pct] ||
    `${done} de ${total} pasos completados · Siguiente: ${nextActive?.title || '—'}`);

  // Renderizar steps
  const stepsEl = document.getElementById('f27-steps');
  if (stepsEl) {
    stepsEl.innerHTML = steps.map((step, i) => _f27_buildStepHTML(step, i)).join('');
  }

  // Footer motivacional
  const footerEl = document.getElementById('f27-plan-footer');
  if (footerEl) footerEl.innerHTML = _f27_buildFooter(steps, done, total);

  // Botón refresh: mostrar si el usuario ha actualizado sus datos de F25 recientemente
  const refreshBtn = document.getElementById('f27-refresh-btn');
  if (refreshBtn) {
    const hasNewData = S.realPatrimonyDate &&
      new Date(S.realPatrimonyDate) > new Date(S._actionPlanGeneratedAt || 0);
    refreshBtn.style.display = hasNewData && done < total ? 'block' : 'none';
  }

  card.style.display = 'block';
  // Animación de entrada solo la primera vez
  if (!card.dataset.shown) {
    card.dataset.shown = '1';
    card.style.animation = 'fadeUp .5s ease';
  }
}

/**
 * _f27_buildStepHTML — Construye el HTML de un step individual.
 */
function _f27_buildStepHTML(step, index) {
  const isDone    = step.status === 'done';
  const isActive  = step.status === 'active';
  const isPending = step.status === 'pending';

  const urgencyColor = {
    high:   'var(--danger)',
    medium: 'var(--gold)',
    low:    'var(--accent)',
  }[step.urgency] || 'var(--text3)';

  const statusClass = isDone ? 'f27-step-done' : isActive ? 'f27-step-active' : 'f27-step-pending';

  return `
  <div class="f27-step ${statusClass}" id="f27-step-${step.id}">
    <!-- Step indicator -->
    <div class="f27-step-indicator">
      <div class="f27-step-num ${isDone?'done':isActive?'active':'pending'}">
        ${isDone ? '✓' : index + 1}
      </div>
      ${index < (S.actionPlan?.length||0)-1 ? '<div class="f27-step-line"></div>' : ''}
    </div>

    <!-- Step content -->
    <div class="f27-step-body">
      <div class="f27-step-header">
        <span class="f27-step-icon">${step.icon}</span>
        <div class="f27-step-title-wrap">
          <div class="f27-step-title">${step.title}</div>
          ${step.urgency === 'high' && !isDone ? `<span class="f27-urgency-tag" style="background:${urgencyColor}20;color:${urgencyColor}">PRIORITARIO</span>` : ''}
          ${isDone ? '<span class="f27-done-tag">COMPLETADO ✓</span>' : ''}
        </div>
      </div>

      <div class="f27-step-desc ${isDone?'f27-step-desc-done':''}">${step.body}</div>

      ${step.amountLabel && !isDone ? `
        <div class="f27-step-amount">
          <span class="f27-amount-label">Importe: </span>
          <span class="f27-amount-val">${step.amountLabel}</span>
        </div>` : ''}

      <!-- Acciones -->
      <div class="f27-step-actions ${isDone?'':''}">
        ${!isDone && step.ctaAction === 'module' && step.ctaTarget !== null ? `
          <button class="f27-cta-btn" onclick="F27_openModule(${step.ctaTarget}, '${step.id}')">
            <span>📖 ${step.cta}</span>
            <span class="f27-cta-arrow">→</span>
          </button>` : ''}
        ${!isDone ? (() => {
          const needsMod = step.ctaAction === 'module' && step.ctaTarget !== null && step.ctaTarget !== undefined;
          const modDone  = needsMod && (S.completedMods || []).includes(step.ctaTarget);
          if (needsMod && !modDone) {
            return `<button class="f27-done-btn f27-done-btn-locked" onclick="F27_stepDone('${step.id}')" title="Completa el módulo primero">
              🔒 Completa el módulo primero
            </button>`;
          }
          return `<button class="f27-done-btn" onclick="F27_stepDone('${step.id}')">
            ✓ Marcar como hecho
          </button>`;
        })() : `
          <button class="f27-undo-btn" onclick="F27_stepUndo('${step.id}')">
            Deshacer
          </button>`}
      </div>
    </div>
  </div>`;
}

/**
 * _f27_buildFooter — Construye el mensaje motivacional del footer.
 */
function _f27_buildFooter(steps, done, total) {
  const monthly   = S.monthlyContribution || 0;
  const netWorth  = S.realPatrimony !== null ? S.realPatrimony : (S.patrimony || 0);
  const proj10    = calcCompound(Math.max(0, netWorth), monthly, 8, 10);
  const allDone   = done === total;

  if (allDone) {
    return `<div class="f27-footer-msg f27-footer-success">
      🏆 Has completado todos los pasos de tu plan. Tu patrimonio está optimizado.
      <strong>Siguiente nivel: diversifica globalmente y aumenta tu aportación mensual.</strong>
    </div>`;
  }

  if (!S.realPatrimony && !S.realAssets) {
    return `<div class="f27-footer-msg f27-footer-tip">
      💡 <strong>Tip:</strong> Introduce tus datos reales con el botón "📊 Mi patrimonio real" para que este plan use tus números exactos.
    </div>`;
  }

  if (monthly > 0) {
    return `<div class="f27-footer-msg">
      📊 Si sigues tu plan y mantienes ${fmtPrice(monthly)}/mes, en 10 años tendrás <strong>${fmtPrice(proj10)}</strong>.
      Cada paso completado acelera ese número.
    </div>`;
  }

  return `<div class="f27-footer-msg f27-footer-tip">
    🎯 Completa el paso 1 hoy. La diferencia entre querer y tener dinero es empezar.
  </div>`;
}

/**
 * F27_stepDone — Marca un paso como completado.
 * Guarda en S, re-renderiza y lanza celebración si es el último.
 */
/**
 * _f27_penaltyShake — Animación de castigo cuando el usuario intenta
 * marcar un paso como hecho sin haber completado el módulo vinculado.
 */
function _f27_penaltyShake(id) {
  const el = document.getElementById('f27-step-' + id);
  if (!el) return;

  // Shake visual
  el.classList.add('f27-penalty-shake');
  setTimeout(() => el.classList.remove('f27-penalty-shake'), 600);

  // Encontrar nombre del módulo vinculado
  const step = (S.actionPlan || []).find(s => s.id === id);
  const modId = step && step.ctaTarget;
  const mod = (typeof MODULES !== 'undefined') ? MODULES.find(m => m.id === modId) : null;
  const modName = mod ? mod.title : 'el módulo vinculado';

  // Toast informativo, no acusatorio
  if (typeof toast === 'function') {
    toast('📖 Completa el módulo primero', `"${modName}" debe estar completado para marcar este paso.`, 't-warn');
  }

  // Highlight del botón CTA como guía
  const ctaBtn = el.querySelector('.f27-cta-btn');
  if (ctaBtn) {
    ctaBtn.classList.add('f27-cta-pulse');
    setTimeout(() => ctaBtn.classList.remove('f27-cta-pulse'), 2000);
  }
}

function F27_stepDone(id) {
  if (!S.actionPlan) return;
  const step = S.actionPlan.find(s => s.id === id);
  if (!step || step.status === 'done') return;

  // ── Validación: si el paso tiene módulo vinculado, debe estar completado de verdad
  if (step.ctaAction === 'module' && step.ctaTarget !== null && step.ctaTarget !== undefined) {
    const modCompleted = (S.completedMods || []).includes(step.ctaTarget);
    if (!modCompleted) {
      _f27_penaltyShake(id);
      return;
    }
  }

  step.status = 'done';

  // Activar el siguiente paso pendiente
  const nextPending = S.actionPlan.find(s => s.status !== 'done');
  if (nextPending) nextPending.status = 'active';

  saveState();
  F27_render();

  // Celebración proporcional
  const done  = S.actionPlan.filter(s => s.status === 'done').length;
  const total = S.actionPlan.length;
  const xpReward = 30;
  S.xp += xpReward;
  F34_onXPGained(xpReward);
  spawnXP(xpReward);
  saveState();

  if (done === total) {
    // Plan completado
    setTimeout(() => {
      confetti();
      toast('🎉 ¡Plan completado!', 'Has optimizado tu situación financiera real.', 't-success');
    }, 300);
  } else {
    toast('✅ Paso completado', `+${xpReward} XP · ${total - done} pasos restantes`, 't-success');
  }
}

/**
 * F27_stepUndo — Deshace la marca de completado de un paso.
 */
function F27_stepUndo(id) {
  if (!S.actionPlan) return;
  const step = S.actionPlan.find(s => s.id === id);
  if (step) { step.status = 'pending'; }
  saveState();
  F27_render();
}

/**
 * F27_openModule — Abre el módulo de aprendizaje vinculado a un paso
 * y opcionalmente marca el paso como "en progreso".
 */
function F27_openModule(moduleId, stepId) {
  if (typeof startModule === 'function') {
    startModule(moduleId);
  }
}

/**
 * F27_refresh — Regenera el plan cuando los datos del usuario cambian.
 * Preserva los steps ya marcados como 'done'.
 */
function F27_refresh() {
  const prevDone = (S.actionPlan || [])
    .filter(s => s.status === 'done')
    .map(s => s.id);

  S.actionPlan = F27_generate().map(step => ({
    ...step,
    status: prevDone.includes(step.id) ? 'done' : step.status,
  }));
  S._actionPlanHash      = _f27_dataHash();
  S._actionPlanGeneratedAt = new Date().toISOString();
  saveState();
  F27_render();
  toast('🔄 Plan actualizado', 'Calculado con tus datos más recientes.', 't-success');
}

/**
 * _f27_dataHash — Hash ligero para detectar si los datos del usuario
 * han cambiado desde la última vez que se generó el plan.
 */
function _f27_dataHash() {
  const key = [
    S.goal, S.investorLevel, S.monthlyContribution,
    S.income, S.realPatrimony,
    JSON.stringify(S.realAssets), JSON.stringify(S.realDebts)
  ].join('|');
  // djb2 hash
  let h = 5381;
  for (let i = 0; i < key.length; i++) h = ((h << 5) + h) ^ key.charCodeAt(i);
  return h >>> 0;
}

function renderProfileScreen() {
  updateUIFromState();
  renderAchievements();
  renderActivity();
  renderXPChart();
  renderDebtTracker();
  // F13: certificado visible cuando hay 10+ módulos
  const _certCard = document.getElementById('prof-cert-card');
  const _certBtn  = document.getElementById('prof-cert-btn');
  const _mods     = (S.completedMods||[]).length;
  if (_certCard) _certCard.style.display = _mods >= 10 ? 'flex' : 'none';
  if (_certBtn)  _certBtn.style.display  = _mods >= 10 ? 'flex' : 'none';
  // F19: mostrar perfil inversor si existe
  const _invCard = document.getElementById('investor-profile-card');
  const _invBtn  = document.getElementById('inv-test-btn') || document.querySelector('.inv-test-btn');
  const _invProf = S.investorProfile;
  if (_invCard) {
    if (_invProf) {
      _invCard.style.display = 'flex';
      _invCard.innerHTML = '<span class="inv-prof-icon" style="color:'+_invProf.color+';">'+_invProf.icon+'</span>'
        + '<div class="inv-prof-info"><div class="inv-prof-label" style="color:'+_invProf.color+';">'+_invProf.label+'</div>'
        + '<div class="inv-prof-sub">'+INVESTOR_PROFILES[_invProf.id.slice(0,1)]?.tagline+'</div></div>'
        + '<button class="btn btn-ghost btn-sm" onclick="INVESTOR_TEST.open()" style="font-size:11px;flex-shrink:0;">Repetir</button>';
      if (_invBtn) {
        document.getElementById('inv-test-title').textContent = 'Tu perfil: '+_invProf.label;
        document.getElementById('inv-test-sub').textContent   = 'Pulsa para ver tu cartera recomendada';
        document.getElementById('inv-test-icon').textContent  = _invProf.icon;
      }
    } else {
      _invCard.style.display = 'none';
    }
  }
  setEl('prof-name',          S.userName || 'Explorador');
  setEl('prof-handle',        `@${(S.userName || 'usuario').toLowerCase().replace(/\s+/g, '')} · Nivel ${S.level}`);
  setEl('prof-xp-total',      S.xp);
  setEl('prof-streak-val',    '🔥' + S.streak);
  const maxStr = Math.max(S.maxStreak || 0, S.streak || 0);
  const maxEl = document.getElementById('prof-max-streak-val');
  if (maxEl) maxEl.textContent = '🏅 ' + maxStr;
  setEl('prof-modules-count', S.completedMods.length);
  setEl('prof-av',            S.avatar || '🌱');
  setEl('prof-goal-txt',      S.goalLabel || '🏝️ Libertad financiera');

  // P4-B: render tabla de rangos en el perfil
  renderLevelTitlesPanel();

  // P3-B: Estadísticas personales
  (function() {
    const weekXP     = Math.max(0, (S.xp || 0) - (S.leagueWeekXPBase || 0));
    const snap       = S.weeklySnapshot || {};
    const prevXP     = snap.prev ? Math.max(0, (snap.cur?.xp || S.xp) - (snap.prev?.xp || 0)) : null;
    const studyH     = S.totalStudyMinutes ? (S.totalStudyMinutes < 60
                         ? S.totalStudyMinutes + ' min'
                         : Math.floor(S.totalStudyMinutes / 60) + 'h ' + (S.totalStudyMinutes % 60) + 'min') : '—';
    // Rama más avanzada
    const completed  = S.completedMods || [];
    const topBranch  = F28_BRANCHES.reduce((best, b) => {
      const pct = b.mods.length ? (b.mods.filter(id => completed.includes(id)).length / b.mods.length) : 0;
      return pct > (best.pct || 0) ? { pct, label: b.emoji + ' ' + b.label } : best;
    }, { pct: 0, label: '—' });
    setEl('prof-week-xp',    weekXP.toLocaleString('es') + ' XP');
    setEl('prof-lastweek-xp', prevXP !== null ? prevXP.toLocaleString('es') + ' XP' : '—');
    setEl('prof-study-time', studyH);
    setEl('prof-top-branch', topBranch.pct > 0 ? topBranch.label : '—');
    // Delta XP semana vs anterior
    const deltaRow = document.getElementById('prof-xp-delta-row');
    if (deltaRow && prevXP !== null && weekXP > 0) {
      const diff = weekXP - prevXP;
      const pctDiff = prevXP > 0 ? Math.abs(Math.round((diff / prevXP) * 100)) : null;
      const icon = diff >= 0 ? '📈' : '📉';
      const txt  = diff >= 0
        ? `Ganaste ${diff.toLocaleString('es')} XP más que la semana pasada${pctDiff ? ' (+' + pctDiff + '%)' : ''}`
        : `Ganaste ${Math.abs(diff).toLocaleString('es')} XP menos que la semana pasada${pctDiff ? ' (-' + pctDiff + '%)' : ''}`;
      setEl('prof-xp-delta-icon', icon);
      setEl('prof-xp-delta-txt',  txt);
      deltaRow.style.display = 'flex';
    } else if (deltaRow) {
      deltaRow.style.display = 'none';
    }
  })();

  const _modTotal = MODULES.filter(function(m){return m&&typeof m.id==='number';}).length;
  const pct  = Math.round((S.completedMods.length / _modTotal) * 100);
  setEl('prof-goal-pct', pct + '%');
  const fill = document.getElementById('prof-goal-fill');
  if (fill) fill.style.width = pct + '%';
  setEl('progress-text-profile', `${S.completedMods.length} de ${_modTotal}`);

  // PRIORIDAD 2: Personality Test + Branch Certs cards
  if (typeof PROF_renderGamifCards === 'function') PROF_renderGamifCards();
  // SPEEDRUN records
  if (typeof SPEEDRUN_renderRecords === 'function') { try { SPEEDRUN_renderRecords(); } catch(e) {} }
  renderStreakBadges();
  _renderProfileFinancialHealth();
}


function _renderProfileFinancialHealth() {
  var el = document.getElementById('prof-fin-health');
  if (!el) return;
  var hist    = S._realMoneyHistory || [];
  var total   = S._realMoneyTotal || 0;
  var actions = S._realActionsCount || 0;
  if (hist.length === 0 && actions === 0) {
    el.style.display = 'none'; return;
  }
  el.style.display = 'block';
  var last = hist.length > 0 ? hist[hist.length - 1] : null;
  var lastSavings  = last ? (last.savings || 0) : 0;
  var lastExpenses = last ? (last.totalExpenses || 0) : 0;
  var lastRate     = (last && last.income > 0) ? Math.round((lastSavings / last.income) * 100) : null;
  var rateColor    = lastRate === null ? 'var(--text2)' : lastRate >= 20 ? '#00e5a0' : lastRate >= 10 ? '#f5a623' : '#ef4444';
  var rateLabel    = lastRate === null ? '—' : lastRate + '%';

  // FIRE calc
  var fireTarget = lastExpenses > 0 ? Math.round(lastExpenses * 12 * 25) : 0;
  var fireYrsHtml = '';
  if (fireTarget > 0 && lastSavings > 0) {
    var mRate = 0.07 / 12;
    var pv = (S.realPatrimony != null && S.realPatrimony > 0) ? S.realPatrimony : total;
    var v = pv, months = 0;
    while (v < fireTarget && months < 600) { v = v * (1 + mRate) + lastSavings; months++; }
    var yrs = months < 600 ? Math.ceil(months / 12) : null;
    fireYrsHtml = yrs !== null
      ? '<span style="color:var(--accent);font-weight:700;">' + yrs + ' años</span> para independencia financiera'
      : 'Aumenta tu ahorro para calcular tu independencia';
  }

  el.innerHTML = '<div style="background:linear-gradient(135deg,rgba(0,229,160,.08),rgba(0,229,160,.02));border:1px solid rgba(0,229,160,.2);border-radius:16px;padding:18px;cursor:pointer;" onclick="goTo(\'realmoney\')">'
    + '<div style="font-size:11px;font-weight:800;color:#00e5a0;letter-spacing:.08em;margin-bottom:14px;">💰 MI SITUACIÓN FINANCIERA REAL</div>'
    + '<div style="display:flex;gap:10px;margin-bottom:' + (fireYrsHtml ? '12px' : '0') + ';">'
      + '<div style="flex:1;background:var(--bg);border-radius:10px;padding:10px;">'
        + '<div style="font-size:10px;color:var(--text2);margin-bottom:3px;">AHORROS ACUMULADOS</div>'
        + '<div style="font-family:\'Syne\',sans-serif;font-size:20px;font-weight:800;color:#00e5a0;">€' + total.toLocaleString('es') + '</div>'
      + '</div>'
      + '<div style="flex:1;background:var(--bg);border-radius:10px;padding:10px;">'
        + '<div style="font-size:10px;color:var(--text2);margin-bottom:3px;">TASA DE AHORRO</div>'
        + '<div style="font-family:\'Syne\',sans-serif;font-size:20px;font-weight:800;color:' + rateColor + ';">' + rateLabel + '</div>'
      + '</div>'
      + '<div style="flex:1;background:var(--bg);border-radius:10px;padding:10px;">'
        + '<div style="font-size:10px;color:var(--text2);margin-bottom:3px;">ACCIONES REALES</div>'
        + '<div style="font-family:\'Syne\',sans-serif;font-size:20px;font-weight:800;color:var(--gold);">' + actions + '</div>'
      + '</div>'
    + '</div>'
    + (fireYrsHtml ? '<div style="font-size:12px;color:var(--text2);padding-top:10px;border-top:1px solid rgba(0,229,160,.15);">🏝️ ' + fireYrsHtml + '</div>' : '')
  + '</div>';
}
window._renderProfileFinancialHealth = _renderProfileFinancialHealth;

/* ── P4-B: Panel de rangos en el perfil ─────────────────────────── */
/**
 * renderLevelTitlesPanel — Renderiza la tabla visual de todos los títulos
 * de rango en el perfil, marcando el actual y el progreso hacia el siguiente.
 */
function renderLevelTitlesPanel() {
  const container = document.getElementById('level-titles-panel');
  if (!container) return;
  const currentXP = S.xp || 0;
  const currentIdx = getLevelTitle(currentXP).idx;

  let html = '<div class="ltp-header"><span class="ltp-title">🏅 Tu Rango</span></div>';
  html += '<div class="ltp-list">';

  LEVEL_TITLES.forEach((t, i) => {
    const isActive  = i === currentIdx;
    const isDone    = i < currentIdx;
    const isLocked  = i > currentIdx;
    const nextT     = LEVEL_TITLES[i + 1];
    let progressBar = '';

    if (isActive && nextT) {
      const xpInRange  = currentXP - t.minXP;
      const rangeSize  = nextT.minXP - t.minXP;
      const pct        = Math.min(100, Math.round((xpInRange / rangeSize) * 100));
      const xpLeft     = nextT.minXP - currentXP;
      progressBar = `
        <div class="ltp-progress-wrap">
          <div class="ltp-progress-bar" style="background:${t.color}20;">
            <div class="ltp-progress-fill" style="width:${pct}%;background:${t.color};"></div>
          </div>
          <span class="ltp-progress-label">${xpLeft.toLocaleString('es')} XP para siguiente rango</span>
        </div>`;
    }

    html += `
      <div class="ltp-row${isActive ? ' ltp-row--active' : ''}${isDone ? ' ltp-row--done' : ''}${isLocked ? ' ltp-row--locked' : ''}"
           style="${isActive ? '--rank-color:' + t.color + ';' : ''}">
        <div class="ltp-icon" style="color:${isLocked ? '#444' : t.color}">${isLocked ? '🔒' : t.icon}</div>
        <div class="ltp-info">
          <div class="ltp-name" style="color:${isLocked ? '#555' : (isActive ? t.color : '#aaa')}">${t.title}</div>
          <div class="ltp-xp-req">${t.minXP === 0 ? 'Rango inicial' : 'Desde ' + t.minXP.toLocaleString('es') + ' XP'}</div>
          ${isActive ? '<div class="ltp-desc">' + t.desc + '</div>' : ''}
          ${progressBar}
        </div>
        ${isDone ? '<div class="ltp-check">✅</div>' : ''}
        ${isActive ? '<div class="ltp-current-badge" style="background:' + t.color + '15;color:' + t.color + ';border-color:' + t.color + '40;">ACTUAL</div>' : ''}
      </div>`;
  });

  html += '</div>';
  container.innerHTML = html;
}
window.renderLevelTitlesPanel = renderLevelTitlesPanel;


/* ══════════════════════════════════════════════════════════════════
   P4-D — CARTA DE PERSONAJE (Character Card)
   Pantalla tipo carta de jugador, exportable/compartible.
   Sin canvas — todo CSS/HTML generado dinámicamente.
══════════════════════════════════════════════════════════════════ */

/**
 * GOAL_MOTTOS — frases motivacionales según S.goal del usuario.
 */
const GOAL_MOTTOS = {
  freedom:    '"La libertad financiera no es un destino, es un hábito diario."',
  save:       '"Cada euro ahorrado es un voto por tu futuro yo."',
  invest:     '"El mercado recompensa la paciencia, no la impaciencia."',
  house:      '"Tu hogar no es solo un activo — es la base de tu plan financiero."',
  business:   '"El mejor negocio en el que puedes invertir eres tú mismo."',
};

/**
 * openCharCard() — Renderiza y abre la carta de personaje.
 */
function openCharCard() {
  const el = document.getElementById('m-char-card');
  if (!el) return;

  const titleData    = getLevelTitle(S.xp || 0);
  const completed    = S.completedMods || [];
  const totalMods    = MODULES.filter(function(m){return m&&typeof m.id==='number';}).length;
  const pct          = totalMods > 0 ? Math.round((completed.length / totalMods) * 100) : 0;
  const streak       = S.streak || 0;
  const name         = S.userName || 'Explorador';
  const avatar       = S.avatar || '🌱';
  const profColor    = S.profileColor || '#00e5a0';
  const goal         = S.goal || 'freedom';
  const motto        = GOAL_MOTTOS[goal] || GOAL_MOTTOS.freedom;
  const joinDate     = S.joinDate ? new Date(S.joinDate).toLocaleDateString('es-ES', {month:'short', year:'numeric'}) : 'Hoy';

  // Top 3 logros desbloqueados
  const earnedAchs   = (S.unlockedAchs || []);
  const top3Achs     = ACHIEVEMENTS.filter(a => earnedAchs.includes(a.id)).slice(0, 3);

  // Progreso por rama (% completado)
  const branchBars   = F28_BRANCHES.map(b => {
    const done = b.mods.filter(id => completed.includes(id)).length;
    const pctB = b.mods.length > 0 ? Math.round((done / b.mods.length) * 100) : 0;
    return { label: b.emoji + ' ' + b.label, pct: pctB, color: b.color };
  });

  // Handle de usuario
  const handle = '@' + name.toLowerCase().replace(/\s+/g, '') + ' · FinLearn';

  const cardEl = document.getElementById('char-card-inner');
  if (!cardEl) return;

  cardEl.style.setProperty('--card-accent', profColor);

  cardEl.innerHTML = `
    <div class="cc-header" style="background:linear-gradient(135deg,${profColor}22 0%,${profColor}08 100%);border-bottom:1px solid ${profColor}30;">
      <div class="cc-avatar" style="border-color:${profColor};box-shadow:0 0 18px ${profColor}55;">${avatar}</div>
      <div class="cc-header-info">
        <div class="cc-name">${name}</div>
        <div class="cc-handle" style="color:${profColor};">${titleData.icon} ${titleData.title}</div>
        <div class="cc-meta">📅 Desde ${joinDate} · ${handle}</div>
      </div>
    </div>
    <div class="cc-stats-row">
      <div class="cc-stat">
        <div class="cc-stat-val" style="color:${profColor};">${(S.xp||0).toLocaleString('es')}</div>
        <div class="cc-stat-lbl">XP Total</div>
      </div>
      <div class="cc-stat">
        <div class="cc-stat-val" style="color:#f59e0b;">🔥${streak}</div>
        <div class="cc-stat-lbl">Racha</div>
      </div>
      <div class="cc-stat">
        <div class="cc-stat-val" style="color:#60a5fa;">${completed.length}</div>
        <div class="cc-stat-lbl">Módulos</div>
      </div>
      <div class="cc-stat">
        <div class="cc-stat-val" style="color:#c084fc;">${earnedAchs.length}</div>
        <div class="cc-stat-lbl">Logros</div>
      </div>
    </div>
    <div class="cc-progress-global">
      <div class="cc-prog-label">
        <span>Progreso global</span><span style="color:${profColor};font-weight:700;">${pct}%</span>
      </div>
      <div class="cc-prog-track"><div class="cc-prog-fill" style="width:${pct}%;background:${profColor};"></div></div>
    </div>
    <div class="cc-branches">
      ${branchBars.map(b => `
        <div class="cc-branch-row">
          <div class="cc-branch-label">${b.label}</div>
          <div class="cc-branch-track">
            <div class="cc-branch-fill" style="width:${b.pct}%;background:${b.color};"></div>
          </div>
          <div class="cc-branch-pct" style="color:${b.color};">${b.pct}%</div>
        </div>`).join('')}
    </div>
    ${top3Achs.length > 0 ? `
    <div class="cc-achs">
      <div class="cc-achs-label">Logros destacados</div>
      <div class="cc-achs-row">
        ${top3Achs.map(a => `<div class="cc-ach-badge" title="${a.n}">${a.i}</div>`).join('')}
      </div>
    </div>` : ''}
    <div class="cc-motto">${motto}</div>
    <div class="cc-footer">finlearn.app · ${new Date().getFullYear()}</div>
  `;

  openModal('m-char-card');
}

/**
 * shareCharCard() — Comparte la carta usando navigator.share o copia al portapapeles.
 */
function shareCharCard() {
  const titleData = getLevelTitle(S.xp || 0);
  const name      = S.userName || 'Un usuario';
  const streak    = S.streak || 0;
  const completed = (S.completedMods || []).length;
  const achs      = (S.unlockedAchs || []).length;

  const text = `🏆 Mi carta de personaje en FinLearn\n\n👤 ${name} — ${titleData.icon} ${titleData.title}\n⚡ ${(S.xp||0).toLocaleString('es')} XP · 🔥 ${streak} días de racha\n📚 ${completed} módulos completados · 🏅 ${achs} logros\n\n¡Aprende finanzas reales y compite conmigo! → finlearn.app`;

  if (navigator.share) {
    navigator.share({ title: 'Mi carta FinLearn', text }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(text).then(() => {
      toast('📋 Copiado', 'Texto copiado al portapapeles. ¡Pégalo donde quieras!', 't-success');
    }).catch(() => {
      toast('📋 Tu carta', text, 't-info');
    });
  }
  HAPTIC.light();
}

window.openCharCard  = openCharCard;
window.shareCharCard = shareCharCard;


/* ══════════════════════════════════════════════════════════════════
   ACCIÓN DIARIA (DCA)
   ─────────────────────────────────────────────────────────────────
   DCA = Dollar Cost Averaging. En FinLearn es la "acción del día":
   una pregunta corta que el usuario responde para mantener su racha.
   Responderla correctamente da +80 XP y +1 día de racha.
══════════════════════════════════════════════════════════════════ */

/**
 * renderDCA — Renderiza la tarjeta de pregunta diaria.
 * Si ya se respondió hoy (S.dcaDone), muestra la vista de completado.
 * Si no, elige una pregunta aleatoria de DAILY_QUESTIONS.
 */
function renderDCA() {
  if (S.dcaDone) {
    document.getElementById('dca-not-done')?.style?.setProperty('display', 'none');
    const done = document.getElementById('dca-done');
    if (done) done.style.display = 'block';
    return;
  }

  // Seed diaria: misma pregunta todo el día, no se puede eludir recargando
  const _dcaSeed = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const _dcaIdx = parseInt(_dcaSeed, 10) % DAILY_QUESTIONS.length;
  const q = DAILY_QUESTIONS[_dcaIdx];
  if (!q) return;

  setEl('dca-q-title', q.q || q.question || q.title || 'Reto de hoy');
  setEl('dca-q-text',  '');
  const opts = document.getElementById('dca-q-opts');
  const options = q.options || q.opts || [];
  if (opts && options.length) {
    opts.innerHTML = options.map((o, i) =>
      `<button class="dca-opt" onclick="answerDCA(${i},${q.correct},'${encodeURIComponent(q.explain || q.explanation || '')}')">${o}</button>`
    ).join('');
  }
}

/**
 * answerDCA — Procesa la respuesta del usuario a la pregunta DCA.
 * ─────────────────────────────────────────────────────────────────
 * · Marca visualmente la opción correcta e incorrecta
 * · Suma XP y actualiza la racha
 * · Desbloquea el contenido premium del día (updateDCALock)
 * · Expuesto a window porque es llamado desde onclick="" en renderDCA
 */
function answerDCA(chosen, correct, explanation) {
  if (S.dcaDone) return;
  const opts = document.querySelectorAll('.dca-opt');
  opts.forEach((b, i) => {
    b.disabled = true;
    if (i === correct)               b.classList.add('correct');
    if (i === chosen && chosen !== correct) b.classList.add('wrong');
  });

  const isCorrect = chosen === correct;
  const _dcaMult  = _comboHit(isCorrect);
  const xpGained  = isCorrect ? Math.round(80 * _dcaMult) : 0;

  S.xp           += xpGained;
  S.totalXPtoday += xpGained;
  if (xpGained > 0) F34_onXPGained(xpGained);
  S.dcaDone       = true;
  S.dcaDate       = new Date().toISOString().slice(0, 10);
  // Racha: sube solo si aciertas; si fallas, mantiene el valor actual (nunca fuerza a 1)
  if (isCorrect) {
    S.streak = (S.streak || 0) + 1;
    _checkStreakMilestone(S.streak);
  }
  S.maxStreak = Math.max(S.maxStreak || 0, S.streak || 0);
  if (isCorrect && typeof F34_onXPGained === 'function') F34_onXPGained(xpGained);
  saveState();
  checkAchievements();
  updateDCALock(true);

  setTimeout(() => {
    document.getElementById('dca-not-done')?.style?.setProperty('display', 'none');
    const done = document.getElementById('dca-done');
    if (done) done.style.display = 'block';
    setEl('dca-done-msg', isCorrect ? '¡Correcto! 🎯' : '❌ Respuesta incorrecta');
    setEl('dca-done-sub', isCorrect ? `Has ganado +${xpGained} XP · Racha: 🔥${S.streak}` : `Sin XP hoy. Vuelve mañana y acierta para +80 XP y mantener tu racha.`);
    spawnXP('+' + xpGained + ' XP');
    if (isCorrect) toast('🎯 ¡Correcto!', '+' + xpGained + ' XP ganados', 't-success');
  }, 900);
}


/* ══════════════════════════════════════════════════════════════════
   WIDGETS DE HOME
══════════════════════════════════════════════════════════════════ */

/**
 * _renderTicker — Inicia el ticker de prueba social.
 * Rota los mensajes de SOCIAL_PROOF cada 5 segundos con fade.
 * El prefijo _ indica función interna (no se expone a window).
 */
let _tickerRunning = false;
function _renderTicker() {
  const el = document.getElementById('ticker-inner');
  if (!el || !SOCIAL_PROOF?.length || _tickerRunning) return;
  _tickerRunning = true;
  let idx = 0;
  const rotate = () => {
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent   = SOCIAL_PROOF[idx % SOCIAL_PROOF.length];
      el.style.opacity = '1';
      idx++;
    }, 400);
  };
  rotate();
  setInterval(rotate, 5000);
}

/**
 * _renderFacts — Inicia la rotación de datos financieros curiosos.
 * Cambia cada 9 segundos con fade animado.
 */
let _factsRunning = false;
function _renderFacts() {
  if (!FINANCIAL_FACTS?.length || _factsRunning) return;
  _factsRunning = true;
  let idx = 0;
  const show = (i) => {
    const f   = FINANCIAL_FACTS[i];
    if (!f) return;
    const el  = document.getElementById('facts-text');
    const src = document.getElementById('facts-source');
    if (el)  { el.style.opacity = '0';  setTimeout(() => { el.innerHTML   = f.text   || f;  el.style.opacity  = '1'; }, 300); }
    if (src) { src.style.opacity = '0'; setTimeout(() => { src.textContent = f.source || ''; src.style.opacity = '1'; }, 300); }
  };
  show(0);
  setInterval(() => { idx = (idx + 1) % FINANCIAL_FACTS.length; show(idx); }, 8000);
}

/**
 * _updateInactionModule — Calcula el coste diario de no invertir.
 * ─────────────────────────────────────────────────────────────────
 * Fórmula: pérdida_diaria = aportación_anual × rentabilidad / 365
 * Es un motivador conductual: muestra cuánto "pierde" el usuario
 * cada día que no invierte su dinero.
 */
function _updateInactionModule() {
  const monthly   = S.monthlyContribution || 200;
  const dailyLoss = ((monthly * 12 * (S.expectedReturn || 7) / 100) / 365).toFixed(2);
  setEl('ina-amount', `−€${dailyLoss}`);
  setEl('ina-desc',   `Cada día sin invertir pierdes €${dailyLoss} de tu futuro. Basado en tu proyección al ${S.expectedReturn || 7}% anual con ${monthly}€/mes.`);
}


// ═══ SCRIPT — Onboarding ═══
/* ══════════════════════════════════════════════════════════════════
   script-onboarding.js — Onboarding y Configuración Inicial

   ¿QUÉ ES ESTO Y POR QUÉ EXISTE?
   ─────────────────────────────────────────────────────────────────
   El onboarding es el flujo de bienvenida de 4 pasos:
     1. Seleccionar objetivo financiero (libertad, casa, retiro…)
     2. Elegir nombre y avatar
     3. Ver proyección de patrimonio basada en aportación mensual
     4. Introducir datos financieros reales (ahorros, aportación, retorno)

   También incluye el landing overlay de primera visita y la gestión
   del modal de avatar (accesible también desde el perfil).

   DEPENDENCIAS:
   · Importa goTo de script-nav.js (navegar a home tras finalizar)
   · No importa de ningún otro script-* → sin circulares

   QUÉ EXPORTA:
   · GR_landingCTA()              → acción del botón CTA del landing
   · GR_initLanding()             → muestra u oculta el landing overlay
   · selectGoal(key, label)       → selecciona un objetivo financiero
   · pickAvatar(emoji, name)      → elige avatar en el onboarding
   · pickAvatar2(emoji, name)     → elige avatar desde el modal de perfil
   · validateObs2()               → valida el campo de nombre del onboarding
   · obNext(step)                 → avanza al siguiente paso del onboarding
   · finishOnboarding()           → completa el onboarding y va al home
   · _renderProjectionStep()      → calcula y muestra la proyección del paso 3
   · _updateFinPreviewOnboarding()→ actualiza preview en tiempo real del paso 4
══════════════════════════════════════════════════════════════════ */



/* ══════════════════════════════════════════════════════════════════
   LANDING OVERLAY
   ─────────────────────────────────────────────────────────────────
   El landing overlay se muestra solo en la primera visita del usuario.
   Una vez visto, se marca en localStorage para no volver a aparecer.
══════════════════════════════════════════════════════════════════ */

/**
 * GR_landingCTA — Acción del botón principal del landing.
 * Si el usuario ya completó el onboarding, va al home directamente.
 * Si no, abre el onboarding.
 */
function GR_landingCTA() {
  const landing = document.getElementById('gr-landing-overlay');
  if (landing) landing.style.display = 'none';
  if (S.userName) {
    goTo('home');
  } else {
    showScreen('s-onboard');
    setTimeout(_hideSplash, 600);
  }
  try { localStorage.setItem('fl_landing', 'true'); } catch (e) { }
}

/**
 * GR_initLanding — Decide si mostrar u ocultar el landing overlay.
 * · Lo muestra solo si el usuario nunca lo vio Y no tiene nombre.
 * · En cualquier otro caso lo oculta.
 */
function GR_initLanding() {
  const overlay = document.getElementById('gr-landing-overlay');
  if (!overlay) return;
  try {
    const seen = localStorage.getItem('fl_landing');
    overlay.style.display = (seen || S.userName) ? 'none' : 'flex';
  } catch (e) {
    overlay.style.display = 'none';
  }
}

// showScreen ya definida en script-nav


/* ══════════════════════════════════════════════════════════════════
   PASO 1 — OBJETIVO FINANCIERO
══════════════════════════════════════════════════════════════════ */

/**
 * selectGoal — Selecciona un objetivo financiero del onboarding.
 * ─────────────────────────────────────────────────────────────────
 * Marca la tarjeta visual seleccionada y activa el botón de continuar.
 * key: 'freedom' | 'house' | 'retire' | 'emergency' | etc.
 */
function selectGoal(key, label) {
  S.goal      = key;
  S.goalLabel = label;
  document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById('g-' + key);
  if (card) card.classList.add('selected');
  const btn = document.getElementById('ob-s1-btn');
  if (btn) {
    btn.style.opacity = '1';
    btn.style.cursor  = 'pointer';
  }
}


/* ══════════════════════════════════════════════════════════════════
   PASO 2 — NOMBRE Y AVATAR
══════════════════════════════════════════════════════════════════ */

/**
 * pickAvatar — Elige avatar durante el onboarding.
 * Marca visualmente el avatar seleccionado y actualiza S.avatar.
 */
function pickAvatar(emoji, name) {
  S.avatar = emoji;
  document.querySelectorAll('.av-opt').forEach(o => o.classList.remove('sel'));
  const opt = document.querySelector(`.av-opt[data-av="${emoji}"]`);
  if (opt) opt.classList.add('sel');
  const selAv = document.getElementById('ob-sel-av');
  if (selAv) selAv.textContent = emoji;
  validateObs2();
}

/**
 * pickAvatar2 — Elige avatar desde el modal de perfil (post-onboarding).
 * ─────────────────────────────────────────────────────────────────
 * Diferencia con pickAvatar: este también actualiza los avatares
 * visibles en el nav y el perfil, y cierra el modal.
 */
function pickAvatar2(emoji, name) {
  S.avatar = emoji;
  document.querySelectorAll('#m-avatar .av-opt').forEach(o => o.classList.remove('sel'));
  const opt = document.querySelector(`#m-avatar .av-opt[data-av="${emoji}"]`) ||
    [...document.querySelectorAll('#m-avatar .av-opt')]
      .find(o => o.querySelector('.av-em')?.textContent === emoji);
  if (opt) opt.classList.add('sel');
  // Actualizar avatar visible en header y perfil sin refrescar toda la UI
  const av = document.getElementById('home-nav-av');
  if (av) av.textContent = emoji;
  const profAv = document.getElementById('prof-av');
  if (profAv) profAv.textContent = emoji;
  saveState();
  closeModal('m-avatar');
  toast('✅ Avatar actualizado', 'Tu nuevo avatar está activo', 't-success');
}

/**
 * validateObs2 — Valida el campo de nombre del onboarding.
 * Activa el botón "Continuar" solo si el nombre tiene ≥2 caracteres.
 */
function validateObs2() {
  const inp = document.getElementById('ob-name-input');
  const btn = document.getElementById('ob-s2-btn');
  if (!inp || !btn) return;
  const ok           = inp.value.trim().length >= 2;
  btn.style.opacity  = ok ? '1'           : '0.4';
  btn.style.cursor   = ok ? 'pointer'     : 'not-allowed';
}


/* ══════════════════════════════════════════════════════════════════
   NAVEGACIÓN ENTRE PASOS DEL ONBOARDING
══════════════════════════════════════════════════════════════════ */

/**
 * obNext — Avanza al siguiente paso del onboarding.
 * ─────────────────────────────────────────────────────────────────
 * Lee el nombre del input antes de avanzar (por si el usuario
 * escribió y no hizo blur). Activa el paso correspondiente
 * y llama al setup específico si hace falta.
 */
/* ── Datos de la profesión seleccionada en onboarding ───────── */
let _ob_selected_career = null;

/**
 * _ob_renderProfessions — Renderiza la cuadrícula de profesiones en ob-sprof.
 * Muestra sólo las 6 carreras iniciales (hasta entrepreneur).
 */
function _ob_renderProfessions() {
  const grid = document.getElementById('ob-prof-grid');
  if (!grid) return;

  // Mostrar solo las que son elegibles al inicio (salary > 0 o intern)
  const startable = CAREERS.filter(c =>
    ['intern','junior','specialist','senior','director','entrepreneur'].includes(c.id)
  );

  grid.innerHTML = startable.map(c => `
    <div class="ob-prof-card ${_ob_selected_career === c.id ? 'selected' : ''}"
         id="ob-pc-${c.id}" onclick="_ob_selectCareer('${c.id}')">
      <div class="ob-pc-icon">${c.icon}</div>
      <div class="ob-pc-title">${c.title}</div>
      <div class="ob-pc-salary">${c.salaryRange}</div>
    </div>
  `).join('');
}

function _ob_selectCareer(id) {
  _ob_selected_career = id;
  // Actualizar selección visual
  document.querySelectorAll('.ob-prof-card').forEach(el => el.classList.remove('selected'));
  const sel = document.getElementById('ob-pc-' + id);
  if (sel) sel.classList.add('selected');

  // Mostrar detalle
  const career  = CAREERS.find(c => c.id === id);
  const detail  = document.getElementById('ob-prof-detail');
  if (career && detail) {
    detail.style.display = 'block';
    detail.innerHTML = `
      <div class="ob-pd-desc">${career.description}</div>
      <div class="ob-pd-pros-cons">
        <div class="ob-pd-col">
          ${career.pros.map(p=>`<div class="ob-pd-item ob-pd-pro">✓ ${p}</div>`).join('')}
        </div>
        <div class="ob-pd-col">
          ${career.cons.map(c=>`<div class="ob-pd-item ob-pd-con">✗ ${c}</div>`).join('')}
        </div>
      </div>
      <div class="ob-pd-lesson">"${career.lesson}"</div>`;
  }

  // Habilitar botón continuar
  const btn = document.getElementById('ob-sprof-btn');
  if (btn) {
    btn.style.opacity = '1';
    btn.style.cursor  = 'pointer';
  }

  // Pre-rellenar ingresos en step 4 con el sueldo de la carrera.
  // Solo sobreescribe si el usuario no lo ha editado manualmente.
  const incomeInput = document.getElementById('ob-income');
  if (incomeInput && career.salary > 0 && !incomeInput.dataset.manualEdit) {
    incomeInput.value = career.salary;
  }
}

/* ══════════════════════════════════════════════════════════════════
   F24 — ONBOARDING PERSONALIZADO: Nuevos pasos y helpers
══════════════════════════════════════════════════════════════════ */

/**
 * selectInvestorLevel — Selecciona el nivel de conocimiento del usuario.
 * Activa la tarjeta visual y habilita el botón de continuar.
 */
function selectInvestorLevel(level, label) {
  S.investorLevel = level;
  document.querySelectorAll('.ob-level-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById('lvl-' + level);
  if (card) card.classList.add('selected');
  const btn = document.getElementById('ob-s3-btn');
  if (btn) {
    btn.style.opacity = '1';
    btn.style.cursor  = 'pointer';
  }
}

/**
 * _ob_updateMonthlySlider — Actualiza display + proyecciones en tiempo real
 * mientras el usuario arrastra el slider de aportación mensual.
 */
function _ob_updateMonthlySlider() {
  const slider = document.getElementById('ob-monthly-slider');
  if (!slider) return;
  const val = parseInt(slider.value, 10) || 0;
  const pct = (val / 2000 * 100).toFixed(1);
  slider.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--border2) ${pct}%)`;

  const display = document.getElementById('ob-monthly-display');
  if (display) display.textContent = '€' + val.toLocaleString('es-ES');

  if (val === 0) {
    setEl('fp-10y-final', '—');
    setEl('fp-20y-final', '—');
    setEl('fp-30y-final', '—');
    return;
  }

  const p10 = Math.round(calcCompound(0, val, 8, 10));
  const p20 = Math.round(calcCompound(0, val, 8, 20));
  const p30 = Math.round(calcCompound(0, val, 8, 30));
  setEl('fp-10y-final', fmtPrice(p10));
  setEl('fp-20y-final', fmtPrice(p20));
  setEl('fp-30y-final', fmtPrice(p30));

  // Insight contextual según importe
  let insight = '';
  if (val < 50)       insight = '🌱 Pequeño pero poderoso. La constancia gana a la cantidad.';
  else if (val < 200) insight = '📈 Con esto ya superas a la mayoría de ahorradores en España.';
  else if (val < 500) insight = '🔥 Excelente base. Estás en el top 20% de inversores habituales.';
  else if (val < 1000)insight = '🚀 Con esta aportación alcanzas la libertad financiera antes de los 55.';
  else                insight = '👑 Nivel élite. Alcanzarás la independencia financiera mucho antes.';
  // ob-mp-insight: elemento eliminado del onboarding

  // Pre-configurar S.monthlyContribution en tiempo real para que el paso 3 use el valor
  S.monthlyContribution = val;
}

/**
 * _ob_getSuggestedModule — Devuelve el id del módulo más relevante
 * según el objetivo financiero y el nivel del usuario.
 */
function _ob_getSuggestedModule() {
  const goal  = S.goal  || 'freedom';
  const level = S.investorLevel || 'zero';
  const map = {
    freedom:   { zero: 0, saving: 0, investing: 1, active: 4 },
    debt:      { zero: 2, saving: 2, investing: 2, active: 2 },
    house:     { zero: 5, saving: 5, investing: 3, active: 4 },
    retire:    { zero: 0, saving: 1, investing: 4, active: 4 },
    invest:    { zero: 0, saving: 0, investing: 1, active: 4 },
    emergency: { zero: 5, saving: 5, investing: 5, active: 3 },
  };
  return (map[goal] || map.freedom)[level] ?? 0;
}

function _ob_getSuggestedBranch() {
  const goal  = S.goal  || 'freedom';
  const level = S.investorLevel || 'zero';
  const map = {
    freedom:   { zero: 'fundamentos', saving: 'fundamentos', investing: 'inversion',  active: 'avanzado'    },
    debt:      { zero: 'deuda',       saving: 'deuda',       investing: 'deuda',       active: 'deuda'        },
    house:     { zero: 'fundamentos', saving: 'vivienda',    investing: 'vivienda',    active: 'inversion'    },
    retire:    { zero: 'fundamentos', saving: 'fundamentos', investing: 'inversion',   active: 'avanzado'     },
    invest:    { zero: 'fundamentos', saving: 'inversion',   investing: 'inversion',   active: 'avanzado'     },
    emergency: { zero: 'fundamentos', saving: 'fundamentos', investing: 'inversion',   active: 'inversion'    },
  };
  return (map[goal] || map.freedom)[level] || 'fundamentos';
}

/**
 * _ob_buildHeroMsg — Construye el mensaje personalizado para el hero card.
 * Calcula cuánto necesitas al mes y en cuántos años para tu objetivo.
 */
function _ob_buildHeroMsg() {
  const goal    = S.goal  || 'freedom';
  const level   = S.investorLevel || 'zero';
  const monthly = S.monthlyContribution || 200;
  const name    = S.userName || 'tú';

  const goalLabels = {
    freedom:   'libertad financiera',
    debt:      'eliminar tus deudas',
    house:     'comprar tu vivienda',
    retire:    'tu jubilación ideal',
    invest:    'construir cartera',
    emergency: 'tu fondo de emergencia',
  };
  const goalLabel = goalLabels[goal] || goalLabels.freedom;

  if (goal === 'debt') {
    const debt = S.patrimony < 0 ? Math.abs(S.patrimony) : 5000;
    const months = monthly > 0 ? Math.ceil(debt / monthly) : 0;
    const yrs = months > 0 ? Math.round(months / 12 * 10) / 10 : '?';
    return `💪 Con ${fmtPrice(monthly)}/mes puedes eliminar tus deudas en ~${yrs} años. Empieza por el módulo de Deuda Inteligente.`;
  }
  if (goal === 'emergency') {
    const target = (S.income || 1800) * 3;
    const months = monthly > 0 ? Math.ceil(target / monthly) : 0;
    return `🛡️ Con ${fmtPrice(monthly)}/mes tendrás tu fondo de emergencia de ${fmtPrice(target)} en ~${months} meses.`;
  }
  if (goal === 'house') {
    const target = 40000; // entrada típica en España
    const months = monthly > 0 ? Math.ceil(target / monthly) : 0;
    const yrs = Math.round(months / 12 * 10) / 10;
    return `🏠 Para ${fmtPrice(target)} de entrada necesitas ${fmtPrice(monthly)}/mes durante ~${yrs} años. ¡Vas bien!`;
  }

  // FIRE para freedom / retire / invest
  const fireTarget = (S.income || 1800) * 12 * 25; // regla del 4%
  const r = 0.08 / 12;
  let yearsToFire = 0;
  if (monthly > 0) {
    // Meses hasta alcanzar fireTarget con aportación mensual al 8%
    const months = Math.log(1 + (fireTarget * r) / monthly) / Math.log(1 + r);
    yearsToFire = Math.round(months / 12);
  }
  const levelTips = {
    zero:      'Empieza por el módulo de Interés Compuesto — cambia todo.',
    saving:    'El siguiente paso es poner tu ahorro a trabajar en ETFs.',
    investing: 'Optimiza tu cartera con diversificación inteligente.',
    active:    'Descubre estrategias avanzadas para acelerar tu FIRE.',
  };
  const tip = levelTips[level] || levelTips.zero;
  if (yearsToFire > 0 && yearsToFire < 100) {
    return `🏝️ Para tu ${goalLabel} con ${fmtPrice(monthly)}/mes llegarás en ~${yearsToFire} años. ${tip}`;
  }
  return `🏝️ Cada mes que inviertes acerca tu ${goalLabel}. ${tip}`;
}

function obNext(step) {
  // Guardar nombre si venimos del paso 2
  const inp = document.getElementById('ob-name-input');
  if (inp && inp.value.trim()) S.userName = inp.value.trim();

  document.querySelectorAll('.ob-step').forEach(s => s.classList.remove('active'));

  const next = document.getElementById('ob-s' + step);
  if (next) next.classList.add('active');

  if (step === 3) {
    const slider = document.getElementById('ob-monthly-slider');
    if (slider) {
      slider.value = S.monthlyContribution || 100;
      _ob_updateMonthlySlider();
    }
    setTimeout(_ob_initNumericInputs, 50);
  } else if (step === 4) {
    _renderProjectionStepFinal();
    if (typeof _ob_renderProfessions === 'function') _ob_renderProfessions();
  } else if (step === 5) {
    // Paso final: hora de recordatorio
  }
}

function _obSelectTime(hour) {
  document.querySelectorAll('.ob-time-btn').forEach(b => b.classList.remove('selected'));
  if (event && event.target) event.target.classList.add('selected');
  S._reminderHour = hour;
  saveState();
}
window._obSelectTime = _obSelectTime;

function _ob_initNumericInputs() {
  if (typeof makeNumericControl !== 'function') return;
  makeNumericControl({ inputId:'ob-savings',    min:0,  max:500000, suffix:'€', onChange: _renderProjectionStepFinal });
  makeNumericControl({ inputId:'ob-income',     min:0,  max:30000,  suffix:'€', onChange: _renderProjectionStepFinal });
  makeNumericControl({ inputId:'ob-debt-total', min:0,  max:500000, suffix:'€', onChange: _renderProjectionStepFinal });
  makeNumericControl({ inputId:'ob-age',        min:16, max:80,     suffix:'',  step:1,   onChange: _renderProjectionStepFinal });
}

function _renderProjectionStepFinal() {
  const savings  = parseFloat(document.getElementById('ob-savings')?.value)       || 0;
  const monthly  = parseFloat(document.getElementById('ob-monthly-slider')?.value) || Math.round((parseFloat(document.getElementById('ob-income')?.value)||1800) * 0.15);
  const rate     = 7;
  const debt     = parseFloat(document.getElementById('ob-debt-total')?.value)      || 0;
  const income   = parseFloat(document.getElementById('ob-income')?.value)          || 0;

  // Mostrar carrera asignada automáticamente
  const autoCareerEl = document.getElementById('ob-career-auto');
  if (autoCareerEl && income > 0) {
    const careerId = income < 900 ? 'intern' : income < 1600 ? 'junior' : income < 2500 ? 'specialist' : income < 4000 ? 'senior' : income < 8000 ? 'director' : 'entrepreneur';
    const careerData = { intern:{icon:'🎓',label:'Becario'}, junior:{icon:'🌱',label:'Junior / Empleado'}, specialist:{icon:'🔧',label:'Especialista'}, senior:{icon:'💼',label:'Senior / Manager'}, director:{icon:'🏛️',label:'Director / VP'}, entrepreneur:{icon:'🚀',label:'Emprendedor'} };
    const cd = careerData[careerId] || careerData.junior;
    document.getElementById('ob-career-icon').textContent = cd.icon;
    document.getElementById('ob-career-label').textContent = cd.label;
    document.getElementById('ob-career-salary').textContent = `€${income.toLocaleString('es')}/mes según tus ingresos`;
    autoCareerEl.style.display = 'block';
  }

  const patrimony = Math.max(0, savings - debt);
  const result10  = calcCompound(patrimony, monthly, rate, 10);
  const result20  = calcCompound(patrimony, monthly, rate, 20);
  const result30  = calcCompound(patrimony, monthly, rate, 30);

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = fmtPrice(val); };
  set('fp-today-final', patrimony);
  set('fp-10y-final',   result10);
  set('fp-20y-final',   result20);

  // 30y number: count-up for wow effect
  const el30 = document.getElementById('fp-30y-final');
  if (el30) {
    const target = Math.round(result30);
    const start  = parseInt(el30.dataset.prev || '0', 10);
    el30.dataset.prev = target;
    let frame = 0;
    const frames = 40;
    const tick = () => {
      frame++;
      const pct = frame / frames;
      const eased = 1 - Math.pow(1 - pct, 3);
      el30.textContent = fmtPrice(Math.round(start + (target - start) * eased));
      if (frame < frames) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Motivational context line below projection
  const motivEl = document.getElementById('ob-proj-motivation');
  if (motivEl && result30 > 0) {
    const monthly = parseFloat(document.getElementById('ob-monthly-slider')?.value) || Math.round((income || 1800) * 0.15);
    motivEl.textContent = `Ahorrando solo ${fmtPrice(monthly)}/mes, el interés compuesto hace el resto. Eso es libertad financiera.`;
    motivEl.style.display = 'block';
  }
}

/**
 * _renderProjectionStep — Calcula y muestra la proyección del paso 3.
 * Ahora usa el valor del slider de aportación mensual si está disponible.
 */
function _renderProjectionStep() {
  const monthly = S.monthlyContribution || 200;
  const result  = calcCompound(0, monthly, 8, 30);
  const projEl  = document.getElementById('ob-proj-amount');
  if (projEl) projEl.textContent = fmtPrice(result);

  // Actualizar el subtítulo con la aportación real elegida
  const sub = document.getElementById('ob-s3-sub');
  if (sub && monthly > 0) {
    sub.innerHTML = `Si inviertes <strong style="color:var(--accent)">${fmtPrice(monthly)}/mes</strong> y mantienes el hábito de aprender…`;
  }
}

/**
 * _updateFinPreviewOnboarding — Actualiza la preview financiera en tiempo real.
 * Llamada cuando el usuario mueve los sliders del paso 4.
 * Lee los inputs y recalcula las proyecciones a 10, 20 y 30 años.
 */
function _updateFinPreviewOnboarding() {
  const savings   = parseFloat(document.getElementById('ob-savings')?.value)    || 0;
  const monthly   = parseFloat(document.getElementById('ob-monthly')?.value)    || 200;
  const ret       = parseFloat(document.getElementById('ob-return')?.value)     || 7;
  const income    = parseFloat(document.getElementById('ob-income')?.value)     || 0;
  const debtTotal = parseFloat(document.getElementById('ob-debt-total')?.value) || 0;
  const age       = parseFloat(document.getElementById('ob-age')?.value)        || 30;

  const netWorth = savings - debtTotal;
  setEl('fp-today-final', fmtPrice(netWorth));
  setEl('fp-10y-final',   fmtPrice(calcCompound(Math.max(0, netWorth), monthly, ret, 10)));
  setEl('fp-20y-final',   fmtPrice(calcCompound(Math.max(0, netWorth), monthly, ret, 20)));
  setEl('fp-30y-final',   fmtPrice(calcCompound(Math.max(0, netWorth), monthly, ret, 30)));

  // ── Live health score ────────────────────────────────────────
  let score = 0;
  // Emergency fund: savings >= 3 months expenses (estimated as 30% of income)
  const monthlyExpenses = income ? income * 0.7 : 1500;
  const emergencyTarget = monthlyExpenses * 3;
  score += Math.min(25, (savings / Math.max(emergencyTarget, 1)) * 25);
  // Savings rate: monthly / income
  if (income > 0) score += Math.min(25, (monthly / income) * 100);
  // Debt ratio: lower is better
  if (income > 0) score += Math.max(0, 25 - (debtTotal / (income * 12)) * 25);
  else score += debtTotal === 0 ? 25 : 10;
  // Age factor: younger = more time = bonus
  score += Math.min(25, Math.max(0, (65 - age) / 40 * 25));
  score = Math.round(Math.min(100, Math.max(0, score)));

  const scoreEl = document.getElementById('fp-health-score');
  if (scoreEl) {
    scoreEl.textContent = score + '%';
    scoreEl.style.color = score >= 70 ? 'var(--accent)' : score >= 40 ? '#f59e0b' : 'var(--danger)';
  }

  // ── Personalized insight ─────────────────────────────────────
  const insightEl = document.getElementById('fp-insight');
  if (insightEl) {
    let insight = '';
    if (debtTotal > savings * 2 && debtTotal > 0)
      insight = '💡 Con deudas altas, tu prioridad es el módulo de Deuda Inteligente primero.';
    else if (income > 0 && monthly / income < 0.1)
      insight = '💡 Ahorras menos del 10% de tus ingresos. ¡Pequeños ajustes hacen grandes diferencias!';
    else if (age < 30)
      insight = '🚀 Empezar joven es tu mayor ventaja. El tiempo multiplica cada euro que inviertes.';
    else if (age > 50)
      insight = '⏰ Cada mes cuenta. Maximizar el ahorro ahora marca la diferencia para tu retiro.';
    else if (score >= 70)
      insight = '🌟 Tu situación financiera es sólida. Vamos a optimizarla con educación.';
    else
      insight = '💪 Desde aquí solo se sube. FinLearn te dará el mapa exacto para mejorar.';
    insightEl.textContent = insight;
  }
}


/* ══════════════════════════════════════════════════════════════════
   FINALIZAR ONBOARDING
══════════════════════════════════════════════════════════════════ */

/**
 * finishOnboarding — Completa el onboarding y lanza la app.
 * ─────────────────────────────────────────────────────────────────
 * 1. Lee los datos financieros introducidos en el paso 4
 * 2. Guarda todo en S y persiste
 * 3. Navega al home con celebración (confeti + toast)
 * 4. Muestra el modal de registro 3s después (growth loop)
 */
function finishOnboarding() {
  const savings   = parseFloat(document.getElementById('ob-savings')?.value)    || 0;
  // F24: prefer the monthly slider value (set in ob-s-monthly) over the text input
  const incomeVal = parseFloat(document.getElementById('ob-income')?.value) || 0;
  const sliderVal = parseInt(document.getElementById('ob-monthly-slider')?.value, 10) || Math.round(incomeVal * 0.15);
  const monthly   = sliderVal > 0 ? sliderVal
                    : (parseFloat(document.getElementById('ob-monthly')?.value) || 200);
  const ret       = parseFloat(document.getElementById('ob-return')?.value)     || 7;
  const income    = parseFloat(document.getElementById('ob-income')?.value)     || 0;
  const debtTotal = parseFloat(document.getElementById('ob-debt-total')?.value) || 0;
  const age       = parseFloat(document.getElementById('ob-age')?.value)        || 30;

  // ── Carrera asignada según ingreso real introducido ────────────
  // Si el usuario introdujo un ingreso, asignar carrera coherente automáticamente
  const _autoCareer = income > 0
    ? (income < 900  ? 'intern'
     : income < 1600 ? 'junior'
     : income < 2500 ? 'specialist'
     : income < 4000 ? 'senior'
     : income < 8000 ? 'director'
     : 'entrepreneur')
    : null;
  const chosenCareer = _autoCareer
    ? CAREERS.find(c => c.id === _autoCareer)
    : (_ob_selected_career ? CAREERS.find(c => c.id === _ob_selected_career) : null);

  // ── Estado financiero coherente con la carrera ─────────────────
  // S.cash = ahorros reales del usuario (o estimación por carrera si no puso nada)
  const careerDefaults = {
    intern:       { cash: 300,   age: 22, monthlyC: 50,  lifeExp: { rent:400, food:200, transport:80, leisure:100, other:80 } },
    junior:       { cash: 1500,  age: 26, monthlyC: 150, lifeExp: { rent:650, food:280, transport:100, leisure:180, other:130 } },
    specialist:   { cash: 5000,  age: 30, monthlyC: 300, lifeExp: { rent:800, food:300, transport:120, leisure:250, other:180 } },
    senior:       { cash: 12000, age: 35, monthlyC: 600, lifeExp: { rent:1100, food:350, transport:200, leisure:400, other:300 } },
    director:     { cash: 30000, age: 42, monthlyC: 1500, lifeExp:{ rent:1800, food:500, transport:400, leisure:800, other:600 } },
    entrepreneur: { cash: 8000,  age: 32, monthlyC: 200, lifeExp: { rent:900, food:320, transport:150, leisure:300, other:200 } },
  };
  const cdef = chosenCareer ? (careerDefaults[chosenCareer.id] || careerDefaults.junior) : careerDefaults.junior;

  // Usar datos del usuario si los puso; si no, los de la carrera
  const finalCash    = savings > 0 ? savings   : cdef.cash;
  const finalAge     = age    > 0  ? age       : cdef.age;
  const finalMonthly = monthly > 0 ? monthly   : cdef.monthlyC;
  const finalIncome  = income  > 0 ? income    : (chosenCareer?.salary || 1800);

  S.cash                = finalCash;
  S.balance             = 0;
  S.invested            = 0;
  S.monthlyContribution = finalMonthly;
  S.expectedReturn      = ret || 7;
  S.patrimony           = Math.max(0, finalCash - debtTotal);
  S.streak              = 1;
  S.xp                  = 50;
  S.income              = finalIncome;
  S.monthlyIncome       = finalIncome;
  S.age                 = finalAge;
  S.lifeAge             = finalAge;

  // ── Asignar carrera y sueldo coherentes ───────────────────────
  if (chosenCareer) {
    S.career     = chosenCareer.id;
    S.lifeSalary = income > 0 ? income : chosenCareer.salary;
    // Gastos de vida coherentes con la carrera
    S.lifeExpenses = cdef.lifeExp;
    // Felicidad inicial: los que tienen más dinero empiezan más tranquilos
    S.lifeHappiness = chosenCareer.id === 'intern'  ? 65
                    : chosenCareer.id === 'junior'   ? 70
                    : chosenCareer.id === 'specialist'? 75
                    : chosenCareer.id === 'senior'   ? 72   // lifestyle creep empieza a morder
                    : chosenCareer.id === 'director' ? 70
                    : chosenCareer.id === 'entrepreneur'? 68 // incertidumbre alta
                    : 70;
    // Registrar cambio de carrera inicial
    S.careerChanges = [{ from: null, to: chosenCareer.id, age: finalAge, gameDay: 0 }];
  }

  // ── Deudas ──────────────────────────────────────────────────────
  if (debtTotal > 0 && (!S.debts || S.debts.length === 0)) {
    S.debts = [{
      id: Date.now(),
      name: 'Deudas actuales',
      balance: debtTotal,
      rate: 8,
      minPayment: Math.round(debtTotal * 0.02),
    }];
  }

  if (!S.userName) {
    const inp  = document.getElementById('ob-name-input');
    S.userName = inp?.value.trim() || 'Explorador';
  }
  S.onboardingDone = true;
  if (!S.joinDate) S.joinDate = Date.now();
  // Pedir permiso de notificaciones si el usuario eligió una hora
  if (typeof S._reminderHour === 'number' && S._reminderHour >= 0 && typeof NOTIFS !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
    setTimeout(() => {
      NOTIFS.requestPermission().then(ok => {
        if (ok) {
          const now = new Date();
          const target = new Date();
          target.setHours(S._reminderHour, 0, 0, 0);
          if (target <= now) target.setDate(target.getDate() + 1);
          const ms = target.getTime() - now.getTime();
          NOTIFS.schedule(ms, '🔥 Tu lección de 1 minuto', 'Completa tu acción diaria para mantener la racha.', 'streak-daily');
          toast('🔔 Recordatorio activado', 'Te avisaremos a las ' + S._reminderHour + ':00', 't-success');
        }
      });
    }, 800);
  }
  S.finLevel = S.investorLevel || S.finLevel || 'zero';

  // Entrada inicial en el ledger
  if (finalCash > 0) {
    _ledgerAdd('in', 'other', `Capital inicial · ${chosenCareer ? chosenCareer.title : 'jugador nuevo'}`, finalCash);
  }

  // ── F24: Pre-rellenar presupuesto, módulo sugerido y mensaje hero ──
  // Pre-rellenar S._budget.income con los ingresos del onboarding
  if (finalIncome > 0) {
    if (!S._budget) S._budget = { income: finalIncome, cats: {}, saved: false };
    else S._budget.income = finalIncome;
  }
  // Calcular módulo y rama más relevantes según goal + nivel
  S.suggestedModuleId = _ob_getSuggestedModule();
  S.suggestedBranchId = _ob_getSuggestedBranch();
  // Construir mensaje personalizado para el hero card
  S.onboardHeroMsg = _ob_buildHeroMsg();

  saveState();
  goTo('home');
  checkAchievements();

  const careerMsg = chosenCareer ? ` como ${chosenCareer.title}` : '';
  toast('🎉 ¡Bienvenido a FinLearn!', `Hola ${S.userName}, empezamos${careerMsg} 🚀`, 't-success');
  confetti();

  // Start tutorial 1.5s after confetti so user can see the home screen first
  setTimeout(() => { if (typeof startTutorial === 'function') startTutorial(); }, 1500);

  // Auth modal after tutorial would have finished (~20s)
  setTimeout(() => { if (typeof sbShowAuthModal === 'function' && typeof getSBUser === 'function' && !getSBUser()) { sbShowAuthModal('register'); } }, 20000);
  // Aviso legal (primera vez)
  if (typeof _checkLegalDisclaimer === 'function') setTimeout(_checkLegalDisclaimer, 3000);
}


// ═══ SCRIPT — Lecciones ═══
/* ══════════════════════════════════════════════════════════════════
   script-learn.js — Flujo de Lecciones, Quizzes y Examen Final

   ¿QUÉ ES ESTO Y POR QUÉ EXISTE?
   ─────────────────────────────────────────────────────────────────
   Todo lo relacionado con el aprendizaje activo: empezar módulos,
   avanzar pasos, responder quizzes, completar y celebrar.

   DEPENDENCIAS:
   · Importa goTo de script-nav.js (para navegar entre pantallas)
   · Importa data.js, state.js, ui.js
   · NO importa de script-market.js, script-features.js → sin circulares

   QUÉ EXPORTA:
   · startModule(id)           → inicia un módulo por su id
   · lessonNext()              → avanza al siguiente paso de la lección
   · lessonPrev()              → retrocede al paso anterior
   · lessonNextModule()        → pasa al siguiente módulo al terminar
   · completeModule()          → marca el módulo como completado + celebración
   · goToCertificate()         → cierra modal de celebración y va al certificado
   · toggleFocusMode()         → muestra/oculta la barra de módulos en lección
   · shareCert(platform)       → comparte certificado en redes sociales
   · quickShare(platform)      → comparte progreso rápidamente
   · answerQuiz(chosen)        → procesa respuesta de quiz de lección
   · answerExamQuestion(chosen)→ procesa respuesta del examen final
══════════════════════════════════════════════════════════════════ */




// goTo viene de script-nav.js — el único import entre script-* files


/* ══════════════════════════════════════════════════════════════════
   CONSTANTES DEL MÓDULO
══════════════════════════════════════════════════════════════════ */
const XP_PER_MODULE = 150;   // XP que da completar un módulo


/* ══════════════════════════════════════════════════════════════════
   FLUJO DE LECCIONES
══════════════════════════════════════════════════════════════════ */

/**
 * startModule — Inicia un módulo por su id.
 * ─────────────────────────────────────────────────────────────────
 * 1. Busca el módulo en MODULES por id
 * 2. Guarda el módulo activo en S.currentMod
 * 3. Resetea el estado de la lección (paso 0, sin quiz respondido)
 * 4. Navega a la pantalla de lección y renderiza el primer paso
 */
function startModule(id) {
  const mod = MODULES.find(m => m && m.id === id);
  if (!mod) { toast('⚠️ Módulo no encontrado', 'ID: ' + id, 't-warn'); return; }

  const isCompleted = (S.completedMods || []).includes(id);
  if (!isCompleted && !_isModUnlockedByBranch(id)) {
    const branch = _getModBranch(id);
    const prevIdx = branch ? branch.mods.indexOf(id) - 1 : -1;
    const prevMod = (branch && prevIdx >= 0) ? MODULES.find(m => m && m.id === branch.mods[prevIdx]) : null;
    toast('🔒 Módulo bloqueado', prevMod ? `Completa "${prevMod.title}" primero` : 'Completa el módulo anterior de esta rama', 't-warn');
    return;
  }

  S.currentMod   = mod;
  S.step         = 0;
  S.quizAnswered = false;
  S.lessonDone   = false;
  _comboReset();
  saveState();

  goTo('lesson');
  renderStep();
  renderLessonNav();
  if (typeof F46_renderHearts === 'function') F46_renderHearts();
}

/**
 * lessonNext — Avanza al siguiente paso de la lección.
 * Si es el último paso, completa el módulo.
 * También actualiza la barra de progreso de la lección.
 */
function lessonNext() {
  if (!S.currentMod) { goTo('home'); return; }
  const steps = S.currentMod.steps || [];
  const currentStep = steps[S.step];

  // Si estamos en un quiz sin responder, no avanzar
  if (currentStep && currentStep.type === 'quiz' && !S.quizAnswered) {
    toast('⚠️ Responde primero', 'Selecciona una opción para continuar.', 't-warn');
    return;
  }

  if (S.step < steps.length - 1) {
    S.step++;
    saveState();
    window._lessonDir = 'forward';
    renderStep();
    renderLessonNav();
    const prog = document.getElementById('lesson-prog');
    if (prog) prog.style.width = `${((S.step + 1) / steps.length) * 100}%`;
  } else {
    // Al completar, si hubo fallos mostrar resumen antes (sin dejar completar)
    const stats = S.currentMod._quizStats;
    if (stats && stats.wrong > 0) {
      _showModuleSummary(stats);
    } else {
      completeModule();
    }
  }
}

function _closeModuleSummary() {
  const m = document.getElementById('m-module-summary');
  if (m) m.classList.remove('active');
}
window._closeModuleSummary = _closeModuleSummary;

function _showModuleSummary(stats) {
  const total = stats.correct + stats.wrong;
  const pct = Math.round((stats.correct / total) * 100);
  const passed = pct >= 80;
  let modal = document.getElementById('m-module-summary');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-module-summary';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-box" style="max-width:360px;padding:28px 24px;text-align:center;position:relative;">
      <button onclick="_closeModuleSummary();goTo('home');" style="position:absolute;top:12px;right:14px;background:none;border:none;font-size:22px;color:var(--text3);cursor:pointer;line-height:1;">✕</button>
      <div style="font-size:48px;margin-bottom:12px;">${passed ? '🎯' : pct >= 60 ? '💪' : '📚'}</div>
      <div style="font-family:'Syne',sans-serif;font-size:24px;font-weight:800;color:#f5a623;margin-bottom:4px;">${stats.correct} de ${total} correctas</div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:20px;">${passed ? '¡Excelente! Dominas el tema.' : pct >= 60 ? 'Casi lo tienes. Repite para aprobarlo con 80% o más.' : 'Necesitas repetir el módulo. La repetición es clave para afianzar.'}</div>
      ${passed ? `<button class="btn btn-primary btn-block" onclick="_closeModuleSummary();completeModule();" style="margin-bottom:8px;">✓ Completar módulo</button>` : ''}
      <button class="btn ${passed ? 'btn-ghost btn-sm' : 'btn-primary'} btn-block" onclick="_retryModule()">🔄 Repetir módulo</button>
      <button class="btn btn-ghost btn-sm btn-block" onclick="_closeModuleSummary();goTo('home');" style="margin-top:8px;">← Volver al inicio</button>
    </div>`;
  modal.style.display = 'flex';
}

function _retryModule() {
  _closeModuleSummary();
  if (!S.currentMod) { goTo('home'); return; }
  S.step = 0;
  S.quizAnswered = false;
  S.currentMod._quizStats = { correct: 0, wrong: 0, wrongSteps: [] };
  saveState();
  renderStep();
  renderLessonNav();
}
window._retryModule = _retryModule;

/** lessonPrev — Retrocede al paso anterior de la lección. */
function lessonPrev() {
  if (S.step > 0) {
    S.step--;
    saveState();
    window._lessonDir = 'back';
    renderStep();
    renderLessonNav();
  }
}

/**
 * lessonNextModule — Pasa automáticamente al siguiente módulo.
 * Si no hay siguiente módulo (último del curso), vuelve al home.
 */
function lessonNextModule() {
  if (!S.currentMod) return;
  if (!S.lessonDone) {
    toast('⚠️ Termina el módulo actual', 'Completa este módulo antes de pasar al siguiente', 't-warn');
    return;
  }
  const nextId = S.currentMod.id + 1;
  const next   = MODULES.find(m => m.id === nextId);
  if (next) { startModule(nextId); }
  else      { goTo('home'); }
}

/**
 * completeModule — Marca el módulo como completado.
 * ─────────────────────────────────────────────────────────────────
 * Solo suma XP/recompensas si el módulo no estaba ya completado
 * (evita doble recompensa si el usuario repite el módulo).
 * Al terminar:
 * · Actualiza certificado en pantalla de cert
 * · Abre modal de celebración con confeti
 * · Llama a renderCourseBadges para desbloquear badges 50%/100%
 */
function completeModule() {
  if (!S.currentMod) return;
  const mod = S.currentMod;

  if (!S.completedMods.includes(mod.id)) {
    S.completedMods.push(mod.id);
    // P3-B: acumular minutos de estudio (8 min estimados por módulo)
    S.totalStudyMinutes = (S.totalStudyMinutes || 0) + 8;
    // F29: aplicar multiplicador x2 si está activo + multiplicador de evento estacional
    const hasMultiplier = S.xpMultiplierExpiry && Date.now() < S.xpMultiplierExpiry;
    const permMult = S.xpMultiplier || 1.0;
    const seaMult  = (typeof SEA_getXPMult === 'function') ? SEA_getXPMult() : 1;
    const xpGain = Math.round((hasMultiplier ? XP_PER_MODULE * 2 : XP_PER_MODULE) * permMult * seaMult);
    S.xp           += xpGain;
    S.totalXPtoday += xpGain;
    S.streak        = Math.max(1, S.streak);
    // F34: trackear XP ganado para reto de tipo 'xp'
    if (typeof F34_onXPGained === 'function') F34_onXPGained(xpGain);
    if (typeof recalcPatrimony === 'function') recalcPatrimony();
    if (hasMultiplier || seaMult > 1) {
      const multLabel = hasMultiplier && seaMult > 1 ? 'doble + evento' : hasMultiplier ? 'doble' : 'evento \xd71.5';
      toast('🚀 ¡Multiplicador activo!', '+' + xpGain + ' XP (' + multLabel + ')', 't-success');
    }

    // Subir de nivel automáticamente (sistema progresivo 50 niveles)
    let newLevel = 1;
    if (typeof LEVEL_XP_THRESHOLDS !== 'undefined') {
      for (let i = LEVEL_XP_THRESHOLDS.length - 1; i >= 1; i--) {
        if (S.xp >= LEVEL_XP_THRESHOLDS[i]) { newLevel = i + 1; break; }
      }
      newLevel = Math.min(newLevel, 50);
    } else {
      newLevel = Math.floor(S.xp / 500) + 1;
    }
    if (newLevel > S.level) {
      S.level = newLevel;
      SFX.levelUp && SFX.levelUp();
      _showLevelUpScreen(newLevel);
    }
    // P4-B: comprobar si se ha desbloqueado nuevo título de rango
    checkTitleUpgrade();
    // P4-C: tick misiones semanales
    if (typeof tickMission === 'function') {
      tickMission('mods', 1);
    }
    // P4-C: racha sincronizada
    if (typeof checkStreakMission === 'function') checkStreakMission();
    // Referral: comprobar recompensa de referido al completar primer módulo
    if (typeof _checkReferralReward === 'function') _checkReferralReward();
  }

  saveState();

  // Calcular xpGain real para mostrar en UI (refleja todos los multiplicadores)
  const _seaMultDisplay = (typeof SEA_getXPMult === 'function') ? SEA_getXPMult() : 1;
  const _xpGainDisplay = Math.round(
    ((S.xpMultiplierExpiry && Date.now() < S.xpMultiplierExpiry) ? XP_PER_MODULE * 2 : XP_PER_MODULE)
    * (S.xpMultiplier || 1) * _seaMultDisplay
  );

  // Actualizar pantalla de certificado
  setEl('cert-name', S.userName || 'Explorador');
  setEl('cert-mod',  'completó ' + mod.title);
  setEl('cert-xp',   '+' + _xpGainDisplay + ' XP');
  setEl('cert-date', 'Emitido el ' + new Date().toLocaleDateString('es'));

  // Modal de celebración
  setEl('cel-title',  '¡' + mod.title + ' completado!');
  setEl('cel-xp',     '+' + _xpGainDisplay + ' XP');
  setEl('cel-streak', '🔥' + S.streak);

  // ── Quiz stats en modal de celebración ──────────────────────────
  var celQs = document.getElementById('cel-quiz-stats');
  if (celQs) {
    var qs = S.currentMod && S.currentMod._quizStats;
    if (qs && (qs.correct + qs.wrong) > 0) {
      var _total = qs.correct + qs.wrong;
      var _pct   = Math.round((qs.correct / _total) * 100);
      var _qColor = _pct === 100 ? 'var(--accent)' : _pct >= 80 ? '#60a5fa' : '#fb923c';
      var _qIcon  = _pct === 100 ? '🏆' : _pct >= 80 ? '✓' : '📚';
      celQs.style.display = 'block';
      celQs.innerHTML = '<span style="display:inline-block;background:var(--bg2);border:1px solid ' + _qColor + ';border-radius:20px;padding:5px 14px;font-size:13px;font-weight:700;color:' + _qColor + ';">' +
        _qIcon + ' ' + qs.correct + '/' + _total + ' correctas (' + _pct + '%)</span>';
    } else {
      celQs.style.display = 'none';
    }
  }

  // ── Botón "Siguiente módulo" ─────────────────────────────────────
  var celNextBtn = document.getElementById('cel-next-mod-btn');
  if (celNextBtn) {
    var _nextModId = null;
    var _completedArr = S.completedMods || [];
    if (typeof F28_BRANCHES !== 'undefined' && typeof MODULES !== 'undefined') {
      var _curBranch = null;
      for (var _bi = 0; _bi < F28_BRANCHES.length; _bi++) {
        if (F28_BRANCHES[_bi].mods.indexOf(mod.id) !== -1) { _curBranch = F28_BRANCHES[_bi]; break; }
      }
      if (_curBranch) {
        var _curPos = _curBranch.mods.indexOf(mod.id);
        for (var _mi = _curPos + 1; _mi < _curBranch.mods.length; _mi++) {
          if (_completedArr.indexOf(_curBranch.mods[_mi]) === -1) { _nextModId = _curBranch.mods[_mi]; break; }
        }
      }
      if (_nextModId === null) {
        if (S.suggestedModuleId != null && _completedArr.indexOf(S.suggestedModuleId) === -1) {
          _nextModId = S.suggestedModuleId;
        } else {
          for (var _ai = 0; _ai < MODULES.length; _ai++) {
            var _am = MODULES[_ai];
            if (_am && typeof _am.id === 'number' && _completedArr.indexOf(_am.id) === -1) { _nextModId = _am.id; break; }
          }
        }
      }
    }
    if (_nextModId != null) {
      var _nextMod = null;
      for (var _nmi = 0; _nmi < MODULES.length; _nmi++) {
        if (MODULES[_nmi] && MODULES[_nmi].id === _nextModId) { _nextMod = MODULES[_nmi]; break; }
      }
      celNextBtn.innerHTML = '⚡ ' + (_nextMod ? _nextMod.icon + ' ' + _nextMod.title : 'Siguiente módulo') + ' →';
      celNextBtn.style.display = 'block';
      celNextBtn.onclick = (function(nid) { return function() { closeModal('m-cel'); startModule(nid); }; }(_nextModId));
    } else {
      celNextBtn.style.display = 'none';
    }
  }

  // Real action injection based on module tag/branch
  var _celRa = document.getElementById('cel-real-action');
  var _celRaText = document.getElementById('cel-ra-text');
  var _celRaBtn = document.getElementById('cel-ra-btn');
  if (_celRa && _celRaText && typeof MODULE_REAL_ACTIONS_MAP !== 'undefined') {
    var _raEntry = null;
    var _modTag = ((mod.tag || '').replace(/[^\wÀ-ɏ]/g, ' ').trim().toUpperCase());
    for (var _rk in MODULE_REAL_ACTIONS_MAP) {
      if (_modTag.indexOf(_rk.toUpperCase()) !== -1) { _raEntry = MODULE_REAL_ACTIONS_MAP[_rk]; break; }
    }
    if (!_raEntry && typeof F28_BRANCHES !== 'undefined') {
      for (var _fb = 0; _fb < F28_BRANCHES.length; _fb++) {
        if (F28_BRANCHES[_fb].mods.indexOf(mod.id) !== -1) {
          _raEntry = MODULE_REAL_ACTIONS_MAP[F28_BRANCHES[_fb].id] || MODULE_REAL_ACTIONS_MAP['fundamentos'];
          break;
        }
      }
    }
    if (!_raEntry) _raEntry = MODULE_REAL_ACTIONS_MAP['fundamentos'];
    _celRaText.textContent = _raEntry.emoji + ' ' + _raEntry.action;
    _celRa.style.display = 'block';
    if (_celRaBtn) { _celRaBtn.disabled = false; _celRaBtn.textContent = '✅ Ya lo hice · +25 XP'; _celRaBtn.style.opacity = '1'; }
  } else if (_celRa) {
    _celRa.style.display = 'none';
  }

  // Simulator CTA: conectar lección con práctica real en el simulador
  var _celSimBtn = document.getElementById('cel-simulator-btn');
  if (_celSimBtn) {
    var _branchId = '';
    if (typeof F28_BRANCHES !== 'undefined') {
      for (var _sb = 0; _sb < F28_BRANCHES.length; _sb++) {
        if (F28_BRANCHES[_sb].mods.indexOf(mod.id) !== -1) { _branchId = F28_BRANCHES[_sb].id; break; }
      }
    }
    var _simScreen = null, _simLabel = '';
    if (_branchId === 'inversion' || _branchId === 'avanzado' || (mod.tag||'').toUpperCase().indexOf('INVERS') !== -1) {
      _simScreen = 'portfolio'; _simLabel = '📈 Practica en el simulador de bolsa';
    } else if ((mod.tag||'').toUpperCase().indexOf('NEGOCIO') !== -1 || (mod.tag||'').toUpperCase().indexOf('EMPRESA') !== -1) {
      _simScreen = 'business'; _simLabel = '🏪 Prueba el simulador de negocios';
    }
    if (_simScreen) {
      _celSimBtn.textContent = _simLabel;
      _celSimBtn.onclick = (function(sc) { return function() { closeModal('m-cel'); goTo(sc); }; }(_simScreen));
      _celSimBtn.style.display = 'block';
    } else {
      _celSimBtn.style.display = 'none';
    }
  }

  openModal('m-cel');
  SFX.moduleComplete();
  if ((S.completedMods || []).length === 1) {
    NOTIFS.onFirstModule();
    NOTIFS.subscribePush();
  } else if (NOTIFS._granted) NOTIFS.scheduleStreakReminder();
  // Mensaje emocional de vuelta al día siguiente
  setTimeout(() => {
    const hour = new Date().getHours();
    const msg = hour < 12 ? 'Nos vemos mañana por la mañana 🌅' : hour < 20 ? 'Nos vemos mañana a esta hora ⏰' : 'Nos vemos mañana 🌙';
    toast('💪 ¡Lección completada!', msg, 't-success');
  }, 2500);
  confetti();
  emojiConfetti();
  spawnXP('+' + _xpGainDisplay + ' XP');
  checkAchievements();

  // Comprobar badges de progreso del curso
  renderCourseBadges();

  // F28: animar unlock del siguiente nodo en el árbol
  if (typeof F28_onModuleComplete === 'function') F28_onModuleComplete(mod.id);
  // F30: registrar progreso en misión grupal
  if (typeof F30_recordModuleComplete === 'function') F30_recordModuleComplete();
  // F33: comprobar Earn Back de racha
  if (typeof F33_checkEarnBack === 'function') F33_checkEarnBack();
  // F34: trackear módulo completado
  if (typeof F34_onModuleComplete === 'function') F34_onModuleComplete(mod);
  // F44: posible cofre por completar módulo
  if (typeof F44_onModuleComplete === 'function') F44_onModuleComplete();
  // BOSS BATTLE: comprobar si se ha completado la última rama
  if (typeof BOSS_checkTrigger === 'function') setTimeout(() => BOSS_checkTrigger(mod.id), 900);
  // BRANCH CERT: comprobar si se puede emitir certificado de rama
  if (typeof CERT_checkBranch === 'function') setTimeout(() => CERT_checkBranch(mod.id), 2000);
  // HEATMAP: registrar actividad real
  if (typeof HEATMAP_record === 'function') { try { HEATMAP_record(); } catch(e) { console.warn('[HEATMAP]', e); } }
  // SPEEDRUN: guardar tiempo si esta activo
  if (typeof SPEEDRUN_onComplete === 'function') { try { SPEEDRUN_onComplete(mod.id); } catch(e) { console.warn('[SPEEDRUN]', e); } }
  // F26: preparar botón de compartir en el modal de celebración
  if (typeof F26_showModuleShare === 'function') {
    setTimeout(() => {
      const shareBtn = document.getElementById('cel-share-btn');
      if (shareBtn) {
        shareBtn.style.display = 'inline-flex';
        shareBtn.onclick = () => F26_showModuleShare(mod.title, mod.icon, _xpGainDisplay);
      }
    }, 100);
  }
}

function _showLevelUpScreen(level) {
  const rankTitle = typeof getLevelTitle === 'function' ? getLevelTitle(S.xp) : { icon:'⭐', title:'Nivel ' + level, color:'#00e5a0', desc:'' };
  const chestReward = _getLevelChest(level);
  const milestone = (typeof LEVEL_MILESTONES !== 'undefined') ? LEVEL_MILESTONES[level] : null;

  // Aplicar recompensa de hito si existe
  if (milestone) {
    if (milestone.apply) milestone.apply(S);
    if (milestone.chestType && typeof F44_earnChest === 'function') F44_earnChest(milestone.chestType);
    saveState();
  }

  let overlay = document.getElementById('level-up-overlay');
  if (!overlay) { overlay = document.createElement('div'); overlay.id = 'level-up-overlay'; document.body.appendChild(overlay); }
  overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.92);backdrop-filter:blur(12px);animation:fadeInFast .25s ease;';

  const milestoneHtml = milestone ? `
    <div style="background:linear-gradient(135deg,rgba(255,215,0,.15),rgba(255,165,0,.08));border:1px solid rgba(255,215,0,.4);border-radius:16px;padding:14px 16px;margin-bottom:12px;display:flex;align-items:center;gap:12px;text-align:left;">
      <span style="font-size:32px;">${milestone.icon}</span>
      <div>
        <div style="font-size:10px;color:#fbbf24;font-weight:700;letter-spacing:.08em;">🏆 HITO DESBLOQUEADO</div>
        <div style="font-size:14px;font-weight:700;color:#fff;">${milestone.label}</div>
      </div>
    </div>` : '';

  const chestHtml = (chestReward && !milestone?.chestType) ? `
    <div style="background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:14px 16px;margin-bottom:12px;display:flex;align-items:center;gap:12px;text-align:left;">
      <span style="font-size:32px;">${chestReward.icon}</span>
      <div><div style="font-size:10px;color:var(--text3);font-weight:700;letter-spacing:.08em;">RECOMPENSA DE NIVEL</div>
      <div style="font-size:14px;font-weight:700;color:#fff;">Cofre ${chestReward.label}</div></div>
    </div>` : '';

  overlay.innerHTML = `
    <div style="text-align:center;padding:32px 24px;max-width:340px;width:100%;animation:levelUpPop .5s cubic-bezier(.34,1.56,.64,1) both;">
      <div style="font-size:11px;font-weight:800;letter-spacing:.15em;color:var(--text3);margin-bottom:16px;">NIVEL DESBLOQUEADO</div>
      <div style="font-size:88px;line-height:1;margin-bottom:8px;filter:drop-shadow(0 0 24px ${rankTitle.color});">${rankTitle.icon}</div>
      <div style="font-family:'Syne',sans-serif;font-size:64px;font-weight:800;color:#fff;line-height:1;margin-bottom:4px;">${level}</div>
      <div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;color:${rankTitle.color};margin-bottom:6px;">${rankTitle.title}</div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:20px;line-height:1.5;">${rankTitle.desc || ''}</div>
      ${milestoneHtml}${chestHtml}
      <button onclick="document.getElementById('level-up-overlay').remove();if(typeof F44_render==='function')F44_render();"
        style="width:100%;padding:16px;border-radius:14px;background:var(--accent);border:none;color:#000;font-family:'Syne',sans-serif;font-weight:800;font-size:16px;cursor:pointer;">
        ¡Seguir subiendo! 🚀
      </button>
    </div>`;
  if (typeof confetti === 'function') {
    const colors = milestone ? ['#fbbf24', '#ff6b35', '#ffffff'] : [rankTitle.color, '#ffffff', '#fbbf24'];
    confetti({ particleCount: milestone ? 200 : 140, spread: 80, origin: { y: 0.5 }, colors });
    setTimeout(() => confetti({ particleCount: milestone ? 100 : 70, spread: 130, origin: { y: 0.35 }, colors }), 350);
  }
  setTimeout(() => {
    const el = document.getElementById('level-up-overlay');
    if (el) { el.style.animation = 'fadeOutFast .3s ease forwards'; setTimeout(() => { el.remove(); if(typeof F44_render==='function') F44_render(); }, 300); }
  }, 5000);
  if (chestReward && !milestone?.chestType && typeof F44_earnChest === 'function') F44_earnChest(chestReward.type);
}

function _getLevelChest(level) {
  const icons  = { bronze:'📦', silver:'🥈', gold:'🏅', legendary:'👑' };
  const labels = { bronze:'Bronce', silver:'Plata', gold:'Oro', legendary:'Legendario' };

  // Determinista: el tipo de cofre depende solo del nivel, nunca de Math.random()
  if (isPremium()) {
    const type = level % 10 === 0 ? 'legendary'
               : level % 5  === 0 ? 'gold'
               : level % 3  === 0 ? 'silver'
               : 'bronze';
    return { type, icon: icons[type], label: labels[type] };
  } else {
    const type = level % 10 === 0 ? 'gold'
               : level % 5  === 0 ? 'silver'
               : 'bronze';
    return { type, icon: icons[type], label: labels[type] };
  }
}

/** goToCertificate — Cierra el modal de celebración y va a la pantalla de certificado. */
function goToCertificate() {
  closeModal('m-cel');
  goTo('cert');
}

/** toggleFocusMode — Muestra/oculta la barra de módulos en la pantalla de lección. */
function toggleFocusMode() {
  document.getElementById('lesson-mod-bar')?.classList.toggle('hidden');
}

/**
 * shareCert — Comparte el certificado en una red social.
 * Plataformas: 'twitter' | 'linkedin'
 */
function shareCert(platform) {
  const modName = S.currentMod ? S.currentMod.title : 'un módulo';
  const text = encodeURIComponent(`¡Acabo de completar "${modName}" en FinLearn! 🎓📈 Mejora tus finanzas personales en finlearn.app`);
  const urls = {
    twitter:  `https://twitter.com/intent/tweet?text=${text}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=https://finlearn.app`,
  };
  window.open(urls[platform] || urls.twitter, '_blank');
}

/**
 * quickShare — Comparte el progreso rápidamente desde el modal de celebración.
 * Plataformas: 'whatsapp' | 'twitter'
 */
function quickShare(platform) {
  const modName = S.currentMod ? S.currentMod.title : 'un módulo';
  const streakTxt = S.streak >= 3 ? ` 🔥 ${S.streak} días de racha.` : '';
  const text = encodeURIComponent(`Acabo de completar "${modName}" en FinLearn 🚀${streakTxt} finlearn.app`);
  const url  = platform === 'whatsapp'
    ? `https://api.whatsapp.com/send?text=${text}`
    : `https://twitter.com/intent/tweet?text=${text}`;
  window.open(url, '_blank');
}


/* ══════════════════════════════════════════════════════════════════
   QUIZZES Y EXAMEN
   ─────────────────────────────────────────────────────────────────
   Hay dos tipos de preguntas en FinLearn:
   · Quiz de módulo  → dentro de las lecciones, paso tipo 'quiz'
   · Examen final    → paso tipo 'exam_question', 10 preguntas del pool
   Ambos siguen la misma mecánica pero con elementos DOM distintos.
══════════════════════════════════════════════════════════════════ */

/**
 * answerQuiz — Procesa la respuesta del usuario a un quiz de lección.
 * ─────────────────────────────────────────────────────────────────
 * · Deshabilita todas las opciones (solo se puede responder una vez)
 * · Marca visualmente la correcta (verde) y la incorrecta (rojo)
 * · Suma 30 XP si es correcta
 * · Muestra el feedback textual del quiz (step.ok o step.bad)
 * · Habilita el botón "Siguiente" para continuar
 */
function answerQuiz(chosen) {
  if (S.quizAnswered) return;
  const mod  = S.currentMod;
  const step = mod?.steps[S.step];
  if (!step || step.type !== 'quiz') return;
  // F46: si no hay corazones, mostrar modal y bloquear
  if (typeof F46_regenHearts === 'function') F46_regenHearts();
  if (typeof S.hearts !== 'undefined' && S.hearts <= 0) {
    if (typeof _f46_noHeartsModal === 'function') _f46_noHeartsModal();
    return;
  }
  S.quizAnswered = true;

  const correctIdx = step.opts.findIndex(o => o.ok);
  const isCorrect  = chosen === correctIdx;
  const opts = document.querySelectorAll('.quiz-opt');
  opts.forEach((el, i) => {
    el.style.pointerEvents = 'none';
    if (i === correctIdx)          el.classList.add('correct');
    if (i === chosen && !isCorrect) el.classList.add('wrong');
  });

  const fbEl = document.getElementById('quiz-fb');
  if (fbEl) {
    fbEl.innerHTML = `<div class="quiz-fb-inner ${isCorrect ? 'ok' : 'bad'}">
      ${isCorrect ? '✅ ' : '❌ '}${isCorrect ? step.ok : step.bad}
    </div>`;
  }

  const _cMult = _comboHit(isCorrect);
  // Trackear aciertos/fallos del módulo
  if (!S.currentMod._quizStats) S.currentMod._quizStats = { correct: 0, wrong: 0, wrongSteps: [] };
  if (isCorrect) S.currentMod._quizStats.correct++;
  else {
    S.currentMod._quizStats.wrong++;
    if (!S.currentMod._quizStats.wrongSteps.includes(S.step)) {
      S.currentMod._quizStats.wrongSteps.push(S.step);
    }
  }
  if (isCorrect) {
    SFX.correct();
    HAPTIC.success();
    const _xpGain = Math.round(20 * _cMult * (S.xpMultiplier || 1));
    S.xp += _xpGain;
    spawnXP('+' + _xpGain + ' XP' + (_cMult > 1 ? ' ×' + _cMult : ''));
    setTimeout(() => _quizBurst('qo-' + correctIdx), 60);
    saveState();
    // F34: trackear quiz correcto y XP ganado
    if (typeof F34_onQuizCorrect === 'function') F34_onQuizCorrect();
    if (typeof F34_onXPGained === 'function') F34_onXPGained(_xpGain);
    // P4-C: tick misión quiz (racha de consecutivas)
    if (typeof tickMission === 'function') tickMission('quiz', 1);
  } else {
    SFX.wrong();
    HAPTIC.error();
    const _wrongEl = document.getElementById('qo-' + chosen);
    if (_wrongEl) { _wrongEl.classList.remove('quiz-shake'); void _wrongEl.offsetWidth; _wrongEl.classList.add('quiz-shake'); }
    // F46: consumir corazón
    if (typeof F46_loseHeart === 'function') F46_loseHeart();
    // P4-C: error rompe la racha de quiz consecutivos
    if (typeof resetMissionProgress === 'function') resetMissionProgress('quiz');
  }

  const nextBtn = document.getElementById('lesson-next-btn');
  if (nextBtn) { nextBtn.disabled = false; nextBtn.style.opacity = '1'; }
}

/**
 * answerExamQuestion — Procesa la respuesta del examen final.
 * ─────────────────────────────────────────────────────────────────
 * Mismo mecanismo que answerQuiz pero:
 * · Usa GAME.examScore para llevar el marcador
 * · Suma +50 XP por pregunta correcta (más que quiz normal)
 * · Actualiza el botón con el número de pregunta siguiente o "Ver resultado"
 */
function answerExamQuestion(chosen) {
  const mod  = S.currentMod;
  const step = mod?.steps[S.step];
  if (!step || step.type !== 'exam_question' || S.quizAnswered) return;
  S.quizAnswered = true;

  const correctIdx = step.opts.findIndex(o => o.ok);
  const isCorrect  = chosen === correctIdx;

  const opts = document.querySelectorAll('.quiz-opt, [id^="eqo-"]');
  opts.forEach((el, i) => {
    el.style.pointerEvents = 'none';
    if (i === correctIdx)          el.classList.add('correct');
    if (i === chosen && !isCorrect) el.classList.add('wrong');
  });

  const _eMult = _comboHit(isCorrect);
  if (isCorrect) {
    GAME.examScore++;
    const _eXP = Math.round(50 * _eMult);
    S.xp += _eXP;
    F34_onXPGained(_eXP);
    spawnXP('+' + _eXP + ' XP' + (_eMult > 1 ? ' ×' + _eMult : ''));
    setTimeout(() => _quizBurst(null), 60);
    saveState();
  } else {
    const _badEl = document.querySelector('[id^="eqo-"].wrong');
    if (_badEl) { _badEl.classList.remove('quiz-shake'); void _badEl.offsetWidth; _badEl.classList.add('quiz-shake'); }
  }

  const fbEl = document.getElementById('exam-fb');
  if (fbEl) {
    fbEl.innerHTML = `<div class="quiz-fb-inner ${isCorrect ? 'ok' : 'bad'}">
      ${isCorrect ? '✅ ' : '❌ '}${isCorrect ? step.ok : step.bad}
    </div>`;
  }

  const nextBtn = document.getElementById('lesson-next-btn');
  if (nextBtn) {
    nextBtn.disabled    = false;
    nextBtn.style.opacity = '1';
    const remaining     = 10 - (step.questionIdx + 1);
    nextBtn.textContent = remaining > 0
      ? `Pregunta ${step.questionIdx + 2}/10 →`
      : 'Ver resultado →';
  }
}


/* ══════════════════════════════════════════════════════════════════
   INCOME PANEL — Panel explicativo de ingresos simulados en home
   renderIncomePanel() — se llama desde renderHomeScreen()
══════════════════════════════════════════════════════════════════ */

function renderIncomePanel() {
  const panel = document.getElementById('income-summary-panel');
  if (!panel) return;

  const salary      = typeof calcMonthlySalary === 'function' ? calcMonthlySalary() : (S.lifeSalary || 1800);
  const career      = typeof getCurrentCareer  === 'function' ? getCurrentCareer()  : null;
  const careerLabel = career ? career.title : 'Empleado';
  const careerIcon  = career ? career.icon  : '👔';
  const mods        = (S.completedMods || []).length;
  const bizCount    = Object.keys(S.businesses || {}).length;
  const invested    = S.invested || 0;
  const passiveEst  = Math.round(invested * 0.04 / 12);

  // Fuente de ingresos principal
  let sourceLabel, sourceDetail;
  if (career && career.id === 'investor') {
    sourceLabel  = 'Rentas pasivas';
    sourceDetail = `4% anual s/ €${invested.toLocaleString('es')} invertidos`;
  } else if (career && career.id === 'entrepreneur') {
    sourceLabel  = 'Emprendedor';
    sourceDetail = bizCount > 0 ? `${bizCount} negocio${bizCount>1?'s':''} activo${bizCount>1?'s':''}` : 'Sin negocios activos';
  } else {
    sourceLabel  = careerLabel;
    sourceDetail = `Sueldo base simulado + bonos por módulos`;
  }

  panel.innerHTML = `
    <div class="income-panel-inner">
      <div class="income-panel-left">
        <div class="income-panel-icon">${careerIcon}</div>
        <div>
          <div class="income-panel-amount">€${salary.toLocaleString('es')}<span class="income-panel-period">/mes</span></div>
          <div class="income-panel-source">${sourceLabel} · ${sourceDetail}</div>
        </div>
      </div>
      <div class="income-panel-right">
        ${passiveEst > 0 ? `<div class="income-panel-passive">+€${passiveEst.toLocaleString('es')}<br><span>pasivos</span></div>` : '<div class="income-panel-info">💡 Info</div>'}
      </div>
    </div>`;

  // Rellena el modal
  const modalBody = document.getElementById('income-modal-body');
  if (!modalBody) return;

  const modsBonus = Math.floor(mods / 10) * 50; // +€50 cada 10 módulos
  modalBody.innerHTML = `
    <div class="income-modal-rows">
      <div class="income-modal-row">
        <span>📚 Sueldo base (carrera actual)</span>
        <strong>€${(S.lifeSalary || 1800).toLocaleString('es')}/mes</strong>
      </div>
      ${bizCount > 0 ? `
      <div class="income-modal-row">
        <span>🏪 Negocios activos (×${bizCount})</span>
        <strong>+€${(bizCount * 200).toLocaleString('es')}/mes</strong>
      </div>` : ''}
      ${passiveEst > 0 ? `
      <div class="income-modal-row">
        <span>📈 Rentas pasivas (4% s/ inversiones)</span>
        <strong>+€${passiveEst.toLocaleString('es')}/mes</strong>
      </div>` : ''}
      <div class="income-modal-divider"></div>
      <div class="income-modal-row income-modal-total">
        <span>💰 Total estimado</span>
        <strong>€${salary.toLocaleString('es')}/mes</strong>
      </div>
    </div>
    <p class="income-modal-tip">
      📌 <strong>¿Cómo aumentar tus ingresos?</strong><br>
      Completa módulos para desbloquear carreras mejor remuneradas, adquiere negocios en el simulador o acumula inversiones para vivir de rentas pasivas.
    </p>`;
}

window.renderIncomePanel = renderIncomePanel;

function showXPPanel() {
  const xp = S.xp || 0;
  const level = S.level || 1;
  const thresholds = typeof LEVEL_XP_THRESHOLDS !== 'undefined' ? LEVEL_XP_THRESHOLDS : [];
  const xpThis = thresholds[level - 1] || 0;
  const xpNext = thresholds[level] || (xpThis + 1000);
  const xpInLevel = xp - xpThis;
  const xpNeeded = xpNext - xpThis;
  const pct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));
  const rank = typeof getLevelTitle === 'function' ? getLevelTitle(xp) : { icon:'⭐', title:'Nivel ' + level, color:'#00e5a0', desc:'' };
  const nextLevels = [];
  for (let i = level; i <= Math.min(level + 4, 50); i++) {
    const chest = _getLevelChest(i + 1);
    nextLevels.push({ level: i + 1, chest });
  }
  let modal = document.getElementById('m-xp-panel');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-xp-panel';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-box" style="max-width:360px;padding:24px;">
      <button class="modal-close" onclick="closeModal('m-xp-panel')">✕</button>
      <div style="text-align:center;margin-bottom:20px;">
        <div style="font-size:56px;line-height:1;margin-bottom:8px;filter:drop-shadow(0 0 16px ${rank.color});">${rank.icon}</div>
        <div style="font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#fff;">Nivel ${level}</div>
        <div style="font-size:13px;color:${rank.color};font-weight:700;margin-top:4px;">${rank.title}</div>
        <div style="font-size:12px;color:var(--text3);margin-top:4px;">${rank.desc}</div>
      </div>
      <div style="margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text2);margin-bottom:6px;">
          <span>⚡ ${xp.toLocaleString('es')} XP total</span>
          <span>${xpInLevel.toLocaleString('es')} / ${xpNeeded.toLocaleString('es')} XP</span>
        </div>
        <div style="height:10px;background:var(--border2);border-radius:99px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,${rank.color},#fff8);border-radius:99px;transition:width .6s ease;"></div>
        </div>
        <div style="font-size:11px;color:var(--text3);margin-top:4px;text-align:right;">Faltan ${(xpNeeded - xpInLevel).toLocaleString('es')} XP para nivel ${level + 1}</div>
      </div>
      <div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:10px;letter-spacing:.08em;">PRÓXIMAS RECOMPENSAS</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${nextLevels.map(n => `
          <div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:var(--surface);border-radius:12px;border:1px solid var(--border);">
            <div style="font-size:22px;">${n.chest.icon}</div>
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--text1);">Nivel ${n.level}</div>
              <div style="font-size:11px;color:var(--text3);">Cofre ${n.chest.label}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`;
  openModal('m-xp-panel');
}
window.showXPPanel = showXPPanel;

function _renderWeeklyActionCard() {
  const action = typeof getCurrentWeeklyAction === 'function' ? getCurrentWeeklyAction() : null;
  if (!action) return;
  const done = S._currentWeeklyAction && S._currentWeeklyAction.done;
  let el = document.getElementById('weekly-action-card');
  if (!el) {
    el = document.createElement('div');
    el.id = 'weekly-action-card';
    el.style.cssText = 'margin:0 0 12px;';
    const area = document.getElementById('home-actions-area');
    const homeScreen = document.getElementById('s-home');
    if (area) area.appendChild(el);
    else if (homeScreen) homeScreen.appendChild(el);
  }
  if (done) {
    el.innerHTML = `
      <div style="padding:16px 18px;background:linear-gradient(135deg,rgba(0,229,160,.12),rgba(0,229,160,.04));border:1px solid rgba(0,229,160,.25);border-radius:16px;display:flex;align-items:center;gap:12px;">
        <div style="font-size:28px;">✓</div>
        <div style="flex:1;">
          <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:14px;color:#00e5a0;">Acción completada esta semana</div>
          <div style="font-size:12px;color:var(--text2);margin-top:2px;">${action.title}</div>
        </div>
      </div>`;
  } else {
    el.innerHTML = `
      <div style="padding:18px 20px;background:linear-gradient(135deg,rgba(245,166,35,.12),rgba(245,166,35,.04));border:1px solid rgba(245,166,35,.3);border-radius:18px;position:relative;overflow:hidden;">
        <div style="position:absolute;top:-12px;right:-12px;font-size:70px;opacity:.08;">${action.icon}</div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;position:relative;">
          <div style="font-size:11px;font-weight:800;color:#f5a623;letter-spacing:.1em;">🎯 ACCIÓN DE LA SEMANA</div>
          <div style="background:rgba(245,166,35,.15);border:1px solid rgba(245,166,35,.3);padding:3px 8px;border-radius:99px;font-size:10px;font-weight:800;color:#f5a623;margin-left:auto;">+${action.xp} XP</div>
        </div>
        <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:17px;color:var(--text1);line-height:1.25;margin-bottom:6px;position:relative;">${action.icon} ${action.title}</div>
        <div style="font-size:13px;color:var(--text2);line-height:1.45;margin-bottom:14px;position:relative;">${action.desc}</div>
        ${action.savingEst > 0 ? `<div style="font-size:11px;color:#00e5a0;font-weight:700;margin-bottom:12px;">💰 Ahorro estimado: €${action.savingEst}/mes</div>` : ''}
        <button onclick="completeWeeklyAction()" style="width:100%;background:linear-gradient(90deg,#f5a623,#f5c842);border:none;color:#0a0c14;padding:12px;border-radius:12px;font-weight:800;font-size:14px;cursor:pointer;box-shadow:0 4px 12px rgba(245,166,35,.3);">✓ He completado esta acción</button>
      </div>`;
  }
}
window._renderWeeklyActionCard = _renderWeeklyActionCard;

function _renderRealMoneyHomeCard() {
  if (!S.userName || !S.onboardingDone) return;
  const total   = S._realMoneyTotal || 0;
  const actions = S._realActionsCount || 0;
  const hist    = S._realMoneyHistory || [];
  let el = document.getElementById('home-realmoney-card');
  if (!el) {
    el = document.createElement('div');
    el.id = 'home-realmoney-card';
    el.style.cssText = 'margin:0 0 12px;';
    const area = document.getElementById('home-actions-area');
    const homeScreen = document.getElementById('s-home');
    if (area) area.insertBefore(el, area.firstChild);
    else if (homeScreen) homeScreen.appendChild(el);
  }

  if (total === 0 && actions === 0) {
    el.innerHTML = `
      <div onclick="goTo('realmoney')" style="cursor:pointer;padding:18px 20px;background:linear-gradient(135deg,rgba(0,229,160,.08),rgba(0,229,160,.02));border:1px solid rgba(0,229,160,.2);border-radius:16px;display:flex;align-items:center;gap:12px;">
        <div style="font-size:28px;">💰</div>
        <div style="flex:1;">
          <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:14px;color:#00e5a0;">Conecta tu dinero real</div>
          <div style="font-size:12px;color:var(--text2);margin-top:2px;">Calcula tu tasa de ahorro y camino FIRE →</div>
        </div>
      </div>`;
    return;
  }

  // Calculate FIRE context from last history entry
  var last = hist.length > 0 ? hist[hist.length - 1] : null;
  var lastSavings = last ? (last.savings || 0) : 0;
  var lastExpenses = last ? (last.totalExpenses || 0) : 0;
  var fireTarget = lastExpenses > 0 ? Math.round(lastExpenses * 12 * 25) : 0;
  var fireLabel  = '';
  var fireYrsHtml = '';
  var progressPct = 0;
  if (fireTarget > 0 && lastSavings > 0) {
    var mRate = 0.07 / 12;
    var pv = (S.realPatrimony != null && S.realPatrimony > 0) ? S.realPatrimony : total;
    var v = pv, months = 0;
    while (v < fireTarget && months < 600) { v = v * (1 + mRate) + lastSavings; months++; }
    var yrs = months < 600 ? Math.ceil(months / 12) : null;
    fireLabel = yrs !== null ? '🏝️ Independencia en ' + yrs + ' años · al 7% anual' : '🏝️ Sigue ahorrando para tu independencia';
    progressPct = Math.min(100, Math.round((pv / fireTarget) * 100));
  }

  var lastSavingsHtml = lastSavings > 0
    ? `<div style="text-align:right;">
        <div style="font-size:10px;color:var(--text3);letter-spacing:.05em;">ESTE MES</div>
        <div style="font-size:16px;font-weight:800;color:#00e5a0;font-family:'Syne',sans-serif;">+€${lastSavings.toLocaleString('es')}</div>
       </div>` : '';

  var fireLineHtml = fireLabel
    ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(0,229,160,.15);">
        <div style="font-size:11px;color:var(--gold);font-weight:600;">${fireLabel}</div>
        ${progressPct > 0 ? `<div style="height:3px;background:rgba(255,255,255,.08);border-radius:2px;margin-top:6px;overflow:hidden;"><div style="width:${progressPct}%;height:100%;background:var(--gold);border-radius:2px;"></div></div>` : ''}
       </div>` : '';

  el.innerHTML = `
    <div onclick="goTo('realmoney')" style="cursor:pointer;padding:18px 20px;background:linear-gradient(135deg,rgba(0,229,160,.12),rgba(0,229,160,.04));border:1px solid rgba(0,229,160,.3);border-radius:16px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-15px;right:-15px;font-size:80px;opacity:.05;">💰</div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;position:relative;">
        <div>
          <div style="font-size:10px;color:var(--text2);letter-spacing:.08em;margin-bottom:4px;">AHORROS ACUMULADOS</div>
          <div style="font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#00e5a0;line-height:1;">€${total.toLocaleString('es')}</div>
          <div style="font-size:11px;color:var(--text3);margin-top:4px;">${actions} ${actions === 1 ? 'acción real' : 'acciones reales'} completadas</div>
        </div>
        ${lastSavingsHtml}
      </div>
      ${fireLineHtml}
    </div>`;
}
window._renderRealMoneyHomeCard = _renderRealMoneyHomeCard;

function _celRaMarkDone() {
  var _celRa = document.getElementById('cel-real-action');
  var _celRaBtn = document.getElementById('cel-ra-btn');
  if (_celRaBtn) { _celRaBtn.disabled = true; _celRaBtn.style.opacity = '0.5'; }
  S._realActionsCount = (S._realActionsCount || 0) + 1;
  S.xp = (S.xp || 0) + 25;
  if (typeof F34_onXPGained === 'function') F34_onXPGained(25);
  saveState();
  if (_celRa) {
    _celRa.innerHTML = '<div style="text-align:center;padding:10px 0;"><div style="font-size:26px;margin-bottom:4px;">✅</div><div style="font-family:\'Syne\',sans-serif;font-weight:800;font-size:14px;color:#00e5a0;">¡Acción real completada! +25 XP</div><div style="font-size:11px;color:var(--text3);margin-top:3px;">Estas acciones construyen tu futuro financiero.</div></div>';
  }
  if (typeof spawnXPv2 === 'function') spawnXPv2('+25 XP', 'Acción real');
  if (typeof confetti === 'function') confetti();
  if (typeof _renderRealMoneyHomeCard === 'function') setTimeout(_renderRealMoneyHomeCard, 300);
}
window._celRaMarkDone = _celRaMarkDone;

function _openLab() {
  let modal = document.getElementById('m-lab');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-lab';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }
  const items = [
    { icon:'🔧', label:'Calculadoras y Herramientas', desc:'IRPF, hipoteca, FIRE, interés compuesto', action:"closeModal('m-lab');goTo('tools')" },
    { icon:'📈', label:'Simulador de Bolsa', desc:'Practica invertir con dinero virtual', action:"closeModal('m-lab');goTo('portfolio')" },
    { icon:'🌍', label:'Simulador de Vida', desc:'Gestiona ingresos, gastos y eventos', action:"closeModal('m-lab');goTo('life')" },
    { icon:'🏪', label:'Negocios', desc:'Compra negocios para ingresos pasivos', action:"closeModal('m-lab');goTo('business')" },
    { icon:'⚔️', label:'Boss Battles', desc:'Retos al final de cada rama (al 60% completada)', action:"closeModal('m-lab');setTimeout(()=>{if(typeof BOSS_DATA!=='undefined'&&typeof BOSS_open==='function'){const beaten=S.bossBeaten||[];const available=Object.keys(BOSS_DATA).find(id=>!beaten.includes(id));if(available){BOSS_open(available);}else{toast('🏆 Todos vencidos','Has derrotado a todos los bosses disponibles.','t-success');}}else{toast('⚔️ Aún no disponible','Completa al 60% una rama del curso para desbloquearlo.','t-warn');}},300)" },
    { icon:'🎯', label:'Escenarios de Reto', desc:'Crisis de mercado simuladas (premium)', action:"closeModal('m-lab');if(typeof openScenariosScreen==='function'){openScenariosScreen();}else if(typeof PM_showPaywall==='function'){PM_showPaywall('scenarios');}else{toast('🎯 Próximamente','Escenarios de reto en construcción.','t-info');}" },
    { icon:'🌐', label:'Misión Grupal', desc:'Objetivo colectivo semanal', action:"closeModal('m-lab');goTo('home');setTimeout(()=>{let c=document.getElementById('challenge-card');if(!c){c=document.createElement('div');c.id='challenge-card';c.style.cssText='margin:12px 16px;';document.getElementById('s-home').appendChild(c);}if(typeof _renderGroupMissionEpic==='function')_renderGroupMissionEpic();c.scrollIntoView({behavior:'smooth'});},400)" },
  ];
  modal.innerHTML = `
    <div class="modal-box" style="max-width:420px;padding:24px 20px;max-height:85vh;overflow-y:auto;">
      <button class="modal-close" onclick="closeModal('m-lab')" style="position:absolute;top:14px;right:16px;background:none;border:none;font-size:22px;color:var(--text3);cursor:pointer;">✕</button>
      <div style="text-align:center;margin-bottom:6px;">
        <div style="font-size:36px;margin-bottom:6px;">🧪</div>
        <div style="font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--text1);">Laboratorio</div>
        <div style="font-size:12px;color:var(--text2);margin-top:4px;">Practica con simuladores y retos</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:18px;">
        ${items.map(it => `
          <button onclick="${it.action}" style="background:linear-gradient(135deg,rgba(245,166,35,.06),rgba(245,166,35,.01));border:1px solid rgba(245,166,35,.18);padding:14px 16px;border-radius:14px;display:flex;align-items:center;gap:14px;cursor:pointer;text-align:left;color:var(--text1);">
            <div style="font-size:26px;">${it.icon}</div>
            <div style="flex:1;">
              <div style="font-family:'Syne',sans-serif;font-weight:700;font-size:14px;color:#f5a623;">${it.label}</div>
              <div style="font-size:11px;color:var(--text2);margin-top:2px;">${it.desc}</div>
            </div>
            <div style="font-size:18px;color:#f5a623;opacity:.6;">→</div>
          </button>
        `).join('')}
      </div>
    </div>`;
  modal.style.display = 'flex';
}
window._openLab = _openLab;

function _renderStreakRepairBanner() {
  if (!S.userName || !S.streakBrokeAt) return;
  const hoursSinceBreak = (Date.now() - S.streakBrokeAt) / 3600000;
  if (hoursSinceBreak > 48 || (S.maxStreak || 0) < 3) {
    if (hoursSinceBreak > 48) { S.streakBrokeAt = null; saveState(); }
    return;
  }
  const hoursLeft = Math.round(48 - hoursSinceBreak);
  const repairCost = Math.min(500, Math.round((S.maxStreak || 0) * 20));
  let banner = document.getElementById('streak-repair-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'streak-repair-banner';
    banner.style.cssText = 'margin:12px 16px;background:linear-gradient(135deg,#7c3aed,#5b21b6);color:#fff;padding:14px 16px;border-radius:14px;display:flex;align-items:center;gap:12px;box-shadow:0 4px 16px rgba(124,58,237,.3);';
    const homeScreen = document.getElementById('s-home');
    if (homeScreen) homeScreen.insertBefore(banner, homeScreen.firstChild.nextSibling);
  }
  banner.innerHTML = `
    <div style="font-size:28px;">💜</div>
    <div style="flex:1;">
      <div style="font-weight:800;font-size:14px;">Recupera tu racha de ${S.maxStreak} días</div>
      <div style="font-size:11px;opacity:.9;">${hoursLeft}h restantes · ${repairCost} XP</div>
    </div>
    <button onclick="_repairStreak(${repairCost})" style="background:#fff;color:#7c3aed;border:none;padding:8px 14px;border-radius:10px;font-weight:800;font-size:12px;cursor:pointer;">Pagar</button>`;
}

function _repairStreak(cost) {
  if ((S.xp || 0) < cost) { toast('❌ XP insuficiente', `Necesitas ${cost} XP`, 't-error'); return; }
  S.xp -= cost;
  S.streak = S.maxStreak || 0;
  S.streakBrokeAt = null;
  saveState();
  document.getElementById('streak-repair-banner')?.remove();
  toast('💜 ¡Racha recuperada!', `Tu racha de ${S.streak} días vuelve.`, 't-success');
  if (typeof confetti === 'function') confetti();
  if (typeof updateUIFromState === 'function') updateUIFromState();
}
window._repairStreak = _repairStreak;

function _rmUpdate() {
  var get = function(id) { return parseFloat(document.getElementById(id) && document.getElementById(id).value) || 0; };
  var inc = get('rm-income');
  var expHome = get('rm-exp-home'), expFood = get('rm-exp-food'), expTransport = get('rm-exp-transport'), expFun = get('rm-exp-fun'), expOther = get('rm-exp-other');
  var totalExp = expHome + expFood + expTransport + expFun + expOther;
  var savings = Math.max(0, inc - totalExp);
  var pct = inc > 0 ? Math.round((savings / inc) * 100) : 0;

  // Hero values
  var valEl = document.getElementById('rm-savings-val');
  var pctEl = document.getElementById('rm-savings-pct');
  if (valEl) valEl.textContent = '€' + savings.toLocaleString('es');
  if (pctEl) {
    if (inc === 0) pctEl.textContent = 'Introduce tus datos →';
    else if (totalExp > inc) pctEl.textContent = '⚠️ Gastas más de lo que ingresas';
    else pctEl.textContent = pct >= 20 ? '🔥 Tasa excelente' : pct >= 10 ? '✓ Tasa correcta' : '⚠️ Tasa baja';
  }

  // Rate bar
  var rateBar = document.getElementById('rm-rate-bar');
  var rateLbl = document.getElementById('rm-rate-lbl');
  if (rateBar) {
    var barW = Math.min(100, pct * 2.5); // 40% → 100%
    var barColor = pct >= 20 ? '#00e5a0' : pct >= 10 ? '#f5a623' : '#ef4444';
    rateBar.style.width = barW + '%';
    rateBar.style.background = barColor;
  }
  if (rateLbl) {
    rateLbl.textContent = inc > 0 ? pct + '%' : '—';
    rateLbl.style.color = pct >= 20 ? '#00e5a0' : pct >= 10 ? '#f5a623' : '#ef4444';
  }

  // Total strip
  var totalStrip = document.getElementById('rm-total-strip');
  var totalVal = document.getElementById('rm-total-val');
  var histTotal = (S._realMoneyHistory || []).reduce(function(a,h){ return a + (h.savings||0); }, 0);
  if (totalStrip && totalVal) {
    totalStrip.style.display = histTotal > 0 ? 'flex' : 'none';
    totalVal.textContent = '€' + histTotal.toLocaleString('es');
  }

  // Expense breakdown
  var brkCard = document.getElementById('rm-breakdown-card');
  var brkBars = document.getElementById('rm-breakdown-bars');
  if (brkCard && brkBars && totalExp > 0) {
    var cats = [
      { label:'🏠 Vivienda', val:expHome },
      { label:'🛒 Comida', val:expFood },
      { label:'🚗 Transporte', val:expTransport },
      { label:'🎉 Ocio', val:expFun },
      { label:'📱 Otros', val:expOther }
    ];
    var maxCat = Math.max.apply(null, cats.map(function(c){ return c.val; }).concat([1]));
    brkBars.innerHTML = cats.map(function(c) {
      var cpct = totalExp > 0 ? Math.round((c.val / totalExp) * 100) : 0;
      var bw = Math.round((c.val / maxCat) * 100);
      var col = (c.label.indexOf('Vivienda') !== -1 && cpct > 35) ? '#ef4444' : '#60a5fa';
      return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:9px;">' +
        '<div style="font-size:12px;width:96px;color:var(--text2);flex-shrink:0;">' + c.label + '</div>' +
        '<div style="flex:1;height:7px;background:var(--bg2);border-radius:4px;overflow:hidden;">' +
          '<div style="width:' + bw + '%;height:100%;background:' + col + ';border-radius:4px;"></div>' +
        '</div>' +
        '<div style="font-size:11px;color:var(--text3);white-space:nowrap;width:70px;text-align:right;">' + cpct + '% · €' + c.val.toLocaleString('es') + '</div>' +
        '</div>';
    }).join('');
    brkCard.style.display = 'block';
  } else if (brkCard) {
    brkCard.style.display = 'none';
  }

  // Insight
  var insCard = document.getElementById('rm-insight-card');
  var insTxt = document.getElementById('rm-insight-text');
  if (insCard && insTxt && inc > 0) {
    var insightMsg = '';
    var homePct = inc > 0 ? Math.round((expHome / inc) * 100) : 0;
    var fv5 = savings > 0 ? Math.round(savings * 12 * ((Math.pow(1.07, 5) - 1) / 0.07)) : 0;
    if (savings === 0 && totalExp >= inc) {
      insightMsg = '⚠️ Tus gastos igualan o superan tus ingresos. Identifica los 2 gastos más fáciles de reducir y aplica la regla 50/30/20.';
    } else if (homePct > 35) {
      insightMsg = '🏠 Tu vivienda consume el ' + homePct + '% de tus ingresos (recomendado: máx. 30–35%). Considera renegociar el contrato o buscar alternativas.';
    } else if (pct >= 20) {
      insightMsg = '🔥 Tasa de ahorro del ' + pct + '%. Excelente. Invirtiendo estos €' + savings.toLocaleString('es') + '/mes a 7% anual, en 5 años tendrás aproximadamente €' + fv5.toLocaleString('es') + '.';
    } else if (pct >= 10) {
      var gap = Math.round(inc * 0.20 - savings);
      insightMsg = '✓ Tasa del ' + pct + '%. Para alcanzar el 20% recomendado necesitas ahorrar €' + gap.toLocaleString('es') + ' más al mes. Revisa suscripciones y ocio.';
    } else {
      insightMsg = '⚠️ Tasa de ahorro del ' + pct + '%. El objetivo mínimo es el 10% de los ingresos. Con €' + inc.toLocaleString('es') + ' de ingresos, eso son €' + Math.round(inc * 0.1).toLocaleString('es') + '/mes.';
    }
    insTxt.textContent = insightMsg;
    insCard.style.display = 'block';
  } else if (insCard) {
    insCard.style.display = 'none';
  }

  // History bars
  var histCard = document.getElementById('rm-history-card');
  var histBars = document.getElementById('rm-history-bars');
  var history = S._realMoneyHistory || [];
  if (histCard && histBars && history.length > 0) {
    var recent = history.slice(-6);
    var maxSav = Math.max.apply(null, recent.map(function(h){ return h.savings||0; }).concat([1]));
    histBars.innerHTML = recent.reverse().map(function(h) {
      var bw = Math.round(((h.savings||0) / maxSav) * 100);
      var monthLabel = (h.month || '').slice(0, 7);
      return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:7px;">' +
        '<div style="font-size:11px;color:var(--text3);width:54px;flex-shrink:0;">' + monthLabel + '</div>' +
        '<div style="flex:1;height:8px;background:var(--bg2);border-radius:4px;overflow:hidden;">' +
          '<div style="width:' + bw + '%;height:100%;background:#00e5a0;border-radius:4px;"></div>' +
        '</div>' +
        '<div style="font-size:11px;color:#00e5a0;width:54px;text-align:right;">€' + (h.savings||0).toLocaleString('es') + '</div>' +
        '</div>';
    }).join('');
    histCard.style.display = 'block';
  } else if (histCard) {
    histCard.style.display = 'none';
  }

  // VS mes anterior
  var last = history.length > 0 ? history[history.length - 1] : null;
  var compEl = document.getElementById('rm-comparison');
  var compText = document.getElementById('rm-compare-text');
  if (last && inc > 0 && compEl && compText) {
    var diff = savings - (last.savings || 0);
    if (diff > 0) compText.innerHTML = '📈 Ahorras <strong style="color:#00e5a0;">€' + diff.toLocaleString('es') + ' más</strong> que el mes pasado';
    else if (diff < 0) compText.innerHTML = '📉 Ahorras <strong style="color:#ef4444;">€' + Math.abs(diff).toLocaleString('es') + ' menos</strong> que el mes pasado';
    else compText.textContent = 'Igual que el mes pasado';
    compEl.style.display = 'block';
  } else if (compEl) {
    compEl.style.display = 'none';
  }

  // FIRE projection
  var fireCard = document.getElementById('rm-fire-card');
  var fireNum  = document.getElementById('rm-fire-number');
  var fireYrs  = document.getElementById('rm-fire-years');
  var fireTip  = document.getElementById('rm-fire-tip');
  if (fireCard && fireNum && fireYrs && fireTip && inc > 0 && totalExp > 0 && savings > 0) {
    var annualExp  = totalExp * 12;
    var fireTarget = Math.round(annualExp * 25);
    var pv         = (S.realPatrimony != null && S.realPatrimony > 0) ? S.realPatrimony : (S._realMoneyTotal || 0);
    var mRate      = 0.07 / 12;

    function _monthsToFIRE(pmt, target, start) {
      var v = start;
      for (var m = 1; m <= 600; m++) { v = v * (1 + mRate) + pmt; if (v >= target) return m; }
      return null;
    }

    var m1 = _monthsToFIRE(savings, fireTarget, pv);
    var yrs = m1 !== null ? Math.ceil(m1 / 12) : null;

    // Format FIRE number
    var fireLabel = fireTarget >= 1000000
      ? (fireTarget / 1000000).toFixed(1) + 'M'
      : Math.round(fireTarget / 1000) + 'k';
    fireNum.textContent = '€' + fireLabel;
    fireYrs.textContent = yrs !== null ? yrs + ' años' : '+50 años';

    // Tip: +10% savings
    var m2 = _monthsToFIRE(savings * 1.1, fireTarget, pv);
    var yrs2 = m2 !== null ? Math.ceil(m2 / 12) : null;
    var diff2 = (yrs !== null && yrs2 !== null) ? yrs - yrs2 : null;
    var progressPct = pv > 0 ? Math.min(100, Math.round((pv / fireTarget) * 100)) : 0;

    var tip = '';
    if (diff2 && diff2 > 0) {
      tip += '💡 Ahorrar <strong>€' + Math.round(savings * 0.1).toLocaleString('es') + ' más al mes</strong> (10% extra) te acercaría <strong>' + diff2 + ' ' + (diff2 === 1 ? 'año' : 'años') + '</strong> a la independencia.';
    }
    if (progressPct > 0) {
      tip += (tip ? ' <span style="color:var(--text3);">·</span> ' : '') + 'Llevas el <strong style="color:var(--gold);">' + progressPct + '%</strong> del camino recorrido.';
    }
    if (!tip) {
      tip = 'Invirtiendo tus ahorros mensuales al 7% anual (media histórica de mercado global).';
    }
    fireTip.innerHTML = tip;
    fireCard.style.display = 'block';
  } else if (fireCard) {
    fireCard.style.display = 'none';
  }
}

function _rmToggleEdit() {
  var body = document.getElementById('rm-edit-body');
  var arrow = document.getElementById('rm-edit-arrow');
  var toggle = document.getElementById('rm-edit-toggle');
  if (!body) return;
  var isOpen = body.style.maxHeight !== '0px' && body.style.maxHeight !== '';
  if (isOpen) {
    body.style.maxHeight = '0px';
    if (arrow) arrow.style.transform = '';
    if (toggle) toggle.style.borderBottomColor = 'transparent';
  } else {
    body.style.maxHeight = '600px';
    if (arrow) arrow.style.transform = 'rotate(180deg)';
    if (toggle) toggle.style.borderBottomColor = 'var(--border)';
  }
}
window._rmToggleEdit = _rmToggleEdit;

function _rmSaveMonth() {
  const get = id => parseFloat(document.getElementById(id)?.value) || 0;
  const inc = get('rm-income');
  if (inc === 0) { toast('⚠️ Falta información', 'Introduce al menos tus ingresos.', 't-warn'); return; }
  const exp = {
    home: get('rm-exp-home'),
    food: get('rm-exp-food'),
    transport: get('rm-exp-transport'),
    fun: get('rm-exp-fun'),
    other: get('rm-exp-other')
  };
  const totalExp = Object.values(exp).reduce((a,b) => a+b, 0);
  const savings = Math.max(0, inc - totalExp);
  const month = new Date().toISOString().slice(0, 7);
  if (!S._realMoneyHistory) S._realMoneyHistory = [];
  const existingIdx = S._realMoneyHistory.findIndex(h => h.month === month);
  const entry = { month, income: inc, expenses: exp, totalExpenses: totalExp, savings, savedAt: Date.now() };
  if (existingIdx >= 0) S._realMoneyHistory[existingIdx] = entry;
  else S._realMoneyHistory.push(entry);
  S._realMoneyTotal = S._realMoneyHistory.reduce((a,h) => a + h.savings, 0);
  saveState();
  toast('✓ Mes guardado', `Ahorro total acumulado: €${S._realMoneyTotal.toLocaleString('es')}`, 't-success');
  // XP por usar el tracker real
  if (existingIdx < 0) {
    S.xp = (S.xp || 0) + 50;
    if (typeof spawnXPv2 === 'function') spawnXPv2('+50 XP', 'Mi Dinero Real');
    saveState();
  }
  // Refresh home card immediately
  if (typeof _renderRealMoneyHomeCard === 'function') _renderRealMoneyHomeCard();
}

function _rmLoad() {
  if (!S._realMoneyHistory || S._realMoneyHistory.length === 0) {
    // First time: auto-open the edit form
    setTimeout(function() {
      var body = document.getElementById('rm-edit-body');
      var arrow = document.getElementById('rm-edit-arrow');
      var toggle = document.getElementById('rm-edit-toggle');
      if (body) body.style.maxHeight = '600px';
      if (arrow) arrow.style.transform = 'rotate(180deg)';
      if (toggle) toggle.style.borderBottomColor = 'var(--border)';
    }, 100);
    _rmUpdate();
    return;
  }
  const last = S._realMoneyHistory[S._realMoneyHistory.length - 1];
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('rm-income', last.income);
  set('rm-exp-home', last.expenses.home);
  set('rm-exp-food', last.expenses.food);
  set('rm-exp-transport', last.expenses.transport);
  set('rm-exp-fun', last.expenses.fun);
  set('rm-exp-other', last.expenses.other);
  _rmUpdate();
}
window._rmUpdate = _rmUpdate;
window._rmSaveMonth = _rmSaveMonth;
window._rmLoad = _rmLoad;

function _renderStreakDangerBanner() {
  if (!S.userName || S.dcaDone || (S.streak || 0) < 2) return;
  const now = new Date();
  const hoursLeft = 24 - now.getHours() - (now.getMinutes() / 60);
  if (hoursLeft > 4) return;

  let banner = document.getElementById('streak-danger-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'streak-danger-banner';
    banner.style.cssText = 'position:fixed;top:calc(64px + env(safe-area-inset-top, 0px));left:8px;right:8px;z-index:900;background:linear-gradient(135deg,#dc2626,#991b1b);color:#fff;padding:12px 16px;border-radius:14px;box-shadow:0 8px 24px rgba(220,38,38,.4);animation:pulse 2s ease-in-out infinite;cursor:pointer;display:flex;align-items:center;gap:12px;';
    banner.onclick = () => {
      document.getElementById('dca-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      banner.remove();
    };
    document.body.appendChild(banner);
  }
  const hrs = Math.floor(hoursLeft);
  const mins = Math.floor((hoursLeft - hrs) * 60);
  banner.innerHTML = `
    <div style="font-size:22px;">🔥</div>
    <div style="flex:1;">
      <div style="font-weight:800;font-size:13px;">¡Racha de ${S.streak} días en peligro!</div>
      <div style="font-size:11px;opacity:.9;">Quedan ${hrs}h ${mins}m para completar tu acción diaria</div>
    </div>
    <div style="font-size:14px;">→</div>`;
}


/* ══════════════════════════════════════════════════════════════════
   GUIDES — Artículos de lectura libre (sin quiz, sin XP)
   renderGuidesScreen() — punto de entrada desde goTo('guides')
══════════════════════════════════════════════════════════════════ */

const GUIDE_ARTICLES = [
  /* ── FUNDAMENTOS ── */
  {
    id: 'guide_ahorro', cat: 'fundamentos', icon: '💰',
    title: 'El poder del ahorro: por qué el 20% lo cambia todo',
    summary: 'La regla del 20% y cómo aplicarla desde hoy.',
    body: `
      <h3>¿Por qué el 20%?</h3>
      <p>La regla 50/30/20 divide tus ingresos en tres bloques: 50% para necesidades (alquiler, comida, suministros), 30% para deseos (ocio, ropa, salidas) y 20% para ahorro e inversión. El 20% no es caprichoso: es el mínimo que los estudios de planificación financiera señalan para alcanzar independencia económica en unos 30-35 años de vida laboral.</p>
      <h3>El efecto del tiempo</h3>
      <p>Si ganas 2.000 €/mes y ahorras el 20% (400 €) durante 30 años con una rentabilidad del 7% anual, acumularás aproximadamente 480.000 €. Si esperas 10 años para empezar, ese número cae a menos de 200.000 €. El tiempo es el factor multiplicador más poderoso que existe.</p>
      <h3>Cómo empezar</h3>
      <p>El truco más efectivo es la automatización: configura una transferencia automática el mismo día que cobras. Así el dinero nunca llega a tu cuenta corriente y no existe la tentación de gastarlo. Empieza con el 10% si el 20% es imposible hoy, y aumenta un 1% cada tres meses.</p>
      <h3>Ahorrar vs. invertir</h3>
      <p>El ahorro en cuenta corriente pierde poder adquisitivo con la inflación. El objetivo no es acumular billetes bajo el colchón, sino mover ese ahorro hacia activos que crezcan: fondos indexados, planes de pensiones o inmobiliario. El ahorro es el primer paso; la inversión es donde ocurre la magia.</p>
    `
  },
  {
    id: 'guide_presupuesto', cat: 'fundamentos', icon: '📊',
    title: 'Cómo hacer un presupuesto que realmente funcione',
    summary: 'Método envelope, apps y el único hábito que importa.',
    body: `
      <h3>El problema con los presupuestos clásicos</h3>
      <p>La mayoría de presupuestos fracasan porque son demasiado detallados. Nadie tiene tiempo de anotar cada café. La clave es trabajar con grandes categorías y revisar una vez a la semana, no cada gasto individual.</p>
      <h3>El método de los sobres (envelope method)</h3>
      <p>Divide tu sueldo neto en categorías y asigna un límite mensual a cada una. Cuando el sobre se vacía, la categoría está agotada ese mes. Funciona con cuentas bancarias separadas o con apps como YNAB o Spendee. La rigidez inicial es exactamente el punto: te obliga a priorizar.</p>
      <h3>Las categorías que importan</h3>
      <p>Vivienda (alquiler/hipoteca + suministros), alimentación, transporte, salud, formación, ocio, ahorro/inversión y deudas. Esas ocho categorías cubren el 95% de lo que gasta una persona media. Todo lo demás es ruido.</p>
      <h3>La revisión semanal de 10 minutos</h3>
      <p>Cada domingo, revisa cuánto has gastado en cada categoría. No para machacarte, sino para ajustar el resto del mes. Este hábito, más que cualquier app o spreadsheet, es lo que separa a las personas que controlan su dinero de las que no.</p>
    `
  },
  {
    id: 'guide_fondo_emergencia', cat: 'fundamentos', icon: '🛡️',
    title: 'El fondo de emergencia: tu primera línea de defensa',
    summary: 'Cuánto necesitas, dónde guardarlo y cuándo usarlo.',
    body: `
      <h3>¿Para qué sirve exactamente?</h3>
      <p>El fondo de emergencia no es un ahorro para vacaciones ni para el coche nuevo. Es exclusivamente para situaciones imprevistas que afectan a tus ingresos o generan un gasto urgente: pérdida de empleo, avería del coche en la que dependes para trabajar, reparación de vivienda, emergencia médica.</p>
      <h3>¿Cuánto necesitas?</h3>
      <p>La regla general es entre 3 y 6 meses de gastos esenciales. Si eres autónomo, trabajas por proyectos o tienes ingresos variables, apunta a 9-12 meses. Un empleado con contrato indefinido en un sector estable puede quedarse en 3 meses.</p>
      <h3>Dónde guardarlo</h3>
      <p>En una cuenta de ahorro remunerada o depósito a corto plazo. No en bolsa (puede caer justo cuando más lo necesitas), no bajo el colchón (inflación) y no en el mismo banco que tu cuenta corriente (demasiado tentador). Cuentas como Trade Republic o MyInvestor ofrecen actualmente entre el 2% y el 3,5% sin permanencia.</p>
      <h3>Cuándo usarlo</h3>
      <p>Sólo en emergencias reales. Una oportunidad de compra en bolsa no es una emergencia. Unas vacaciones no son una emergencia. Si lo usas, la prioridad número uno vuelve a ser reponerlo antes de cualquier otro objetivo financiero.</p>
    `
  },
  /* ── INVERSIÓN ── */
  {
    id: 'guide_indexados', cat: 'inversion', icon: '📈',
    title: 'Fondos indexados: la estrategia que bate al 90% de los gestores',
    summary: 'Qué son, por qué funcionan y cómo empezar con 100 €.',
    body: `
      <h3>La evidencia que nadie puede ignorar</h3>
      <p>Según el informe SPIVA de S&P Global, más del 90% de los fondos de gestión activa no superan a su índice de referencia en un período de 15 años. No es que los gestores sean malos, es que el mercado es enormemente eficiente y los costes de gestión (1,5-2,5% anual) se comen la diferencia.</p>
      <h3>¿Qué es un fondo indexado?</h3>
      <p>Un fondo indexado replica mecánicamente la composición de un índice (S&P 500, MSCI World, etc.) comprando todas sus acciones en la misma proporción. Al no necesitar un equipo de analistas eligiendo acciones, los costes son mínimos: entre 0,03% y 0,20% anual.</p>
      <h3>El efecto del coste</h3>
      <p>Invertir 10.000 € durante 30 años al 7%: con un fondo de gestión activa al 2% de comisión acumulas 43.000 €. Con un indexado al 0,1% acumulas 74.000 €. La diferencia de 31.000 € es solo por las comisiones.</p>
      <h3>Cómo empezar</h3>
      <p>Plataformas como MyInvestor, Indexa Capital o el broker de Trade Republic ofrecen fondos indexados con inversión mínima desde 1 €. El MSCI World (empresas grandes de 23 países desarrollados) o el S&P 500 son los puntos de entrada más razonables para un inversor nuevo.</p>
    `
  },
  {
    id: 'guide_dca', cat: 'inversion', icon: '🔄',
    title: 'DCA: por qué invertir todos los meses es mejor que esperar',
    summary: 'El método que elimina la ansiedad de "comprar en el momento equivocado".',
    body: `
      <h3>El problema del market timing</h3>
      <p>Nadie sabe cuándo es el mejor momento para invertir. Ni los profesionales. Un estudio de Fidelity analizó sus mejores clientes y descubrió que eran personas que habían muerto o se habían olvidado de que tenían cuenta. El intento de sincronizar el mercado destruye rentabilidad.</p>
      <h3>Qué es el DCA (Dollar Cost Averaging)</h3>
      <p>Consiste en invertir una cantidad fija cada mes, independientemente del precio. En meses donde el mercado cae, compras más acciones. En meses donde sube, compras menos. Con el tiempo, tu precio medio de compra tiende a ser inferior al precio medio del período.</p>
      <h3>Un ejemplo real</h3>
      <p>Si inviertes 200 €/mes en el S&P 500 durante 20 años con una rentabilidad media del 8%, acumulas aproximadamente 118.000 €, habiendo aportado solo 48.000 € de tu bolsillo. La diferencia (70.000 €) es el interés compuesto trabajando para ti.</p>
      <h3>La automatización como superpoder</h3>
      <p>Configura una orden periódica en tu broker el día que cobras. Así no tienes que tomar ninguna decisión, no ves el precio, y el hábito de inversión se mantiene incluso en los meses donde "el mercado da miedo". La consistencia supera a la inteligencia en inversión a largo plazo.</p>
    `
  },
  {
    id: 'guide_diversificacion', cat: 'inversion', icon: '🌍',
    title: 'Diversificación: no pongas todos los huevos en la misma cesta',
    summary: 'Cómo distribuir tus inversiones para reducir riesgo sin perder rentabilidad.',
    body: `
      <h3>Por qué diversificar</h3>
      <p>En 2000 las acciones de Enron valían 90 dólares. En 2002 valían 0. Sus empleados, que tenían el 100% de sus ahorros en acciones de la empresa, lo perdieron todo. La diversificación no elimina el riesgo de mercado, pero sí el riesgo específico de empresa o sector.</p>
      <h3>Los ejes de diversificación</h3>
      <p>Geográfica: no solo España ni solo Europa. Un MSCI World da exposición a 1.500 empresas en 23 países. Sectorial: tecnología, salud, consumo, energía, financieras. Temporal: el DCA es diversificación en el tiempo. Por activo: renta variable, renta fija, inmobiliario, liquidez.</p>
      <h3>La cartera de tres fondos</h3>
      <p>Una estrategia clásica y simple: 60% MSCI World (renta variable global), 30% bonos globales (estabilidad) y 10% liquidez. Rebalancear una vez al año para mantener los porcentajes. Simple, barato y eficaz.</p>
      <h3>Cuándo NO diversificar</h3>
      <p>Sobre-diversificar también es un error. Tener 20 fondos que replican índices similares no reduce más el riesgo, solo añade complejidad y costes. Tres o cuatro fondos bien elegidos son suficientes para la mayoría de inversores particulares.</p>
    `
  },
  /* ── DEUDA ── */
  {
    id: 'guide_deuda_buena', cat: 'deuda', icon: '🏦',
    title: 'Deuda buena vs. deuda mala: la distinción que te cambia la vida',
    summary: 'No toda deuda es igual. Saber distinguirlas es clave.',
    body: `
      <h3>La definición práctica</h3>
      <p>La deuda buena te ayuda a adquirir activos que se aprecian o generan ingresos: una hipoteca sobre un inmueble en zona con demanda, un préstamo para estudiar una carrera con buenas salidas o financiar un negocio rentable. La deuda mala te endeuda para consumir: tarjetas de crédito, préstamos personales para vacaciones, financiación de coches nuevos.</p>
      <h3>El coste real de la deuda mala</h3>
      <p>Una deuda de 5.000 € en una tarjeta revolving al 24% de TAE tarda más de 10 años en pagarse si solo haces el pago mínimo mensual, y acabas pagando el doble del capital original. El 24% de interés es exactamente lo opuesto al 7% que obtendrías invirtiendo ese dinero.</p>
      <h3>La regla de oro</h3>
      <p>Si el tipo de interés de tu deuda es superior a la rentabilidad esperada de tus inversiones (aprox. 7-8% anual), prioriza siempre pagar esa deuda antes de invertir. Pagar una deuda al 24% es equivalente a obtener un 24% de rentabilidad garantizada.</p>
      <h3>El orden correcto</h3>
      <p>Primero el fondo de emergencia (3 meses). Segundo, eliminar deudas de alto coste (>10%). Tercero, aprovechar cualquier ventaja fiscal de tu empresa (plan de pensiones con match). Cuarto, inversión a largo plazo. Este orden puede representar una diferencia de cientos de miles de euros a lo largo de una vida.</p>
    `
  },
  /* ── PSICOLOGÍA ── */
  {
    id: 'guide_sesgos', cat: 'psicologia', icon: '🧠',
    title: 'Los 5 sesgos cognitivos que destruyen tus inversiones',
    summary: 'Tu cerebro no está diseñado para invertir. Estos son sus errores más costosos.',
    body: `
      <h3>1. Sesgo de confirmación</h3>
      <p>Buscamos información que confirme lo que ya creemos. Si crees que Bitcoin llegará a 200.000 $, solo lees artículos bullish. La solución: busca activamente el mejor argumento contrario a tu posición antes de tomar cualquier decisión de inversión.</p>
      <h3>2. Aversión a las pérdidas</h3>
      <p>Perder 1.000 € duele psicológicamente el doble que ganar 1.000 €. Esto lleva a vender en mínimos (para "dejar de perder") y a mantener posiciones perdedoras esperando recuperar. El mercado no sabe ni le importa a qué precio compraste tú.</p>
      <h3>3. Sesgo de recencia</h3>
      <p>Creemos que lo que pasó recientemente continuará. Tras una racha alcista pensamos "esto no puede parar". Tras una bajada pensamos "esto seguirá cayendo". Los mercados son cíclicos y la regresión a la media es inevitable.</p>
      <h3>4. Exceso de confianza</h3>
      <p>El 80% de los conductores creen que conducen mejor que la media. El 90% de los inversores creen que pueden batir al mercado. Ambas cosas son matemáticamente imposibles. La humildad epistémica es una ventaja competitiva real en inversión.</p>
      <h3>5. Efecto manada</h3>
      <p>Compramos cuando todos compran (máximos de mercado) y vendemos cuando todos venden (mínimos). Warren Buffett lo resumió perfectamente: "Sé temeroso cuando otros son codiciosos, y codicioso cuando otros son temerosos."</p>
    `
  },
  /* ── FISCALIDAD ── */
  {
    id: 'guide_irpf_inversion', cat: 'fiscalidad', icon: '📋',
    title: 'IRPF y tus inversiones: lo que Hacienda se lleva (y cómo minimizarlo)',
    summary: 'Plusvalías, dividendos, tramos 2024 y estrategias legales de optimización.',
    body: `
      <h3>Las ganancias patrimoniales en 2024</h3>
      <p>Las plusvalías por venta de acciones o fondos tributan en la base del ahorro: 19% hasta 6.000 €, 21% entre 6.000 € y 50.000 €, 23% entre 50.000 € y 200.000 €, y 27% a partir de 200.000 €. Los dividendos tributan igual.</p>
      <h3>Compensación de pérdidas</h3>
      <p>Si tienes minusvalías de un año anterior (hasta 4 años atrás), puedes compensarlas con las plusvalías de este año y pagar solo por la diferencia. Esta es una de las pocas estrategias legales de reducción fiscal disponibles para el inversor particular.</p>
      <h3>Los fondos indexados vs. ETFs en fiscalidad</h3>
      <p>En España, los fondos de inversión tienen una ventaja fiscal enorme frente a los ETFs: puedes traspasar de un fondo a otro sin tributar hasta el momento del rescate final. Los ETFs tributan en cada venta. Para inversión a largo plazo, los fondos indexados son fiscalmente más eficientes en España.</p>
      <h3>El plan de pensiones</h3>
      <p>Las aportaciones reducen tu base imponible del IRPF (tributas menos ahora). El límite en 2024 es el menor entre 1.500 € anuales y el 30% de los rendimientos del trabajo. Ideal para personas en tramos marginales altos (>37%). La pega: el dinero queda bloqueado hasta jubilación, invalidez u otras contingencias.</p>
    `
  },
  /* ── VIVIENDA ── */
  {
    id: 'guide_hipoteca', cat: 'vivienda', icon: '🏠',
    title: 'Hipoteca en 2024: todo lo que debes saber antes de firmar',
    summary: 'Euríbor, tipos fijos vs. variables, TAE real y gastos ocultos.',
    body: `
      <h3>El Euríbor y las hipotecas variables</h3>
      <p>El Euríbor a 12 meses, al que se referencian la mayoría de hipotecas variables en España, ha pasado del -0,5% en 2021 al entorno del 3-4% en 2024. Una hipoteca variable de 200.000 € a 30 años puede suponer 400-600 € más al mes respecto a cuando los tipos estaban en negativo.</p>
      <h3>Fijo vs. variable vs. mixta</h3>
      <p>El tipo fijo da certeza: sabes exactamente lo que pagarás durante toda la vida del préstamo. El variable es más arriesgado pero puede ser más barato si los tipos bajan. La hipoteca mixta combina un período fijo inicial (5-10 años) con variable posterior. En un entorno de tipos altos como 2024, el fijo es atractivo para quien valore la estabilidad.</p>
      <h3>La TAE real: el número que importa</h3>
      <p>El TIN (tipo nominal) no incluye comisiones ni gastos. La TAE (tasa anual equivalente) sí los incluye y es la cifra que permite comparar correctamente entre ofertas. Siempre compara TAE, nunca TIN.</p>
      <h3>Los gastos que nadie menciona</h3>
      <p>Tasación (300-600 €), gestoría, registro de la propiedad, notaría y el IAJD (Impuesto de Actos Jurídicos Documentados, que desde 2018 paga el banco). Además, la entrada: los bancos suelen financiar el 80% del valor de tasación, lo que significa que necesitas el 20% más un 10-12% para gastos. Para un piso de 200.000 €, necesitas tener ahorrados unos 60.000 €.</p>
    `
  },
  /* ── AVANZADO ── */
  {
    id: 'guide_interes_compuesto', cat: 'avanzado', icon: '🚀',
    title: 'El interés compuesto: la octava maravilla del mundo',
    summary: 'Por qué Einstein (supuestamente) llamó así al interés compuesto y cómo aprovecharlo.',
    body: `
      <h3>La fórmula mágica</h3>
      <p>Capital final = Capital inicial × (1 + rentabilidad)^años. Parece simple, pero sus implicaciones son contraintuitivas. 10.000 € al 7% durante 10 años = 19.672 €. Durante 20 años = 38.697 €. Durante 40 años = 149.745 €. No duplicas el dinero cada 10 años, te cuadriuplicas porque los intereses también generan intereses.</p>
      <h3>La regla del 72</h3>
      <p>Para saber en cuántos años se duplica una inversión, divide 72 entre la rentabilidad anual. Al 6%, tarda 12 años. Al 8%, tarda 9 años. Al 12%, tarda 6 años. Esta regla mental te permite hacer cálculos rápidos sin calculadora.</p>
      <h3>El coste de esperar</h3>
      <p>Ana invierte 200 €/mes desde los 25 hasta los 35 (10 años, 24.000 € totales) y luego no aporta nada más. Carlos invierte 200 €/mes desde los 35 hasta los 65 (30 años, 72.000 € totales). A los 65 años, Ana tiene más dinero que Carlos, habiendo aportado tres veces menos. Esto es el interés compuesto y el tiempo.</p>
      <h3>Lo que frena el interés compuesto</h3>
      <p>Las interrupciones: retirar dinero antes de tiempo destruye el efecto compuesto. Los impuestos: tributar cada año por las ganancias reduce la base que genera nuevos intereses. Las comisiones: un 1% extra de comisión anual puede costar el 25% del capital final en 40 años. Por eso los fondos indexados de bajo coste y la inversión a largo plazo son tan potentes juntos.</p>
    `
  },
  {
    id: 'guide_independencia', cat: 'avanzado', icon: '🏝️',
    title: 'FIRE: independencia financiera y retiro anticipado',
    summary: 'La regla del 4%, el número mágico y cómo calcular el tuyo.',
    body: `
      <h3>¿Qué es el movimiento FIRE?</h3>
      <p>FIRE (Financial Independence, Retire Early) es una filosofía que busca acumular suficiente patrimonio para vivir de las rentas sin necesitar trabajar. No implica necesariamente jubilarse a los 35 ni vivir en una cabaña; muchos FIRE siguen trabajando en lo que les apasiona, simplemente porque quieren, no porque necesiten el dinero.</p>
      <h3>La regla del 4%</h3>
      <p>Basada en el Trinity Study (1998), establece que puedes retirar el 4% de tu cartera cada año sin agotarla en un horizonte de 30 años, asumiendo una cartera 50% renta variable / 50% renta fija. Tu número FIRE es tu gasto anual × 25 (que equivale a tener 25 veces tus gastos, permitiendo retirar el 4%).</p>
      <h3>Calcula tu número FIRE</h3>
      <p>Si gastas 2.000 €/mes (24.000 €/año), necesitas 24.000 × 25 = 600.000 € en activos financieros. Si reduces tus gastos a 1.500 €/mes, el número cae a 450.000 €. Reducir gastos tiene un doble efecto: ahorras más rápido Y necesitas menos capital para ser libre.</p>
      <h3>Las variantes de FIRE</h3>
      <p>Lean FIRE: vivir con el mínimo (para quienes no necesitan grandes comodidades). Fat FIRE: independencia con estilo de vida elevado. Barista FIRE: un trabajo a tiempo parcial cubre gastos básicos y la cartera solo necesita cubrir el exceso. Coast FIRE: ya tienes suficiente acumulado y el interés compuesto hará el resto sin nuevas aportaciones.</p>
    `
  },
];

const GUIDE_CATS = [
  { id: 'all',          label: 'Todos',        icon: '📚' },
  { id: 'fundamentos',  label: 'Fundamentos',  icon: '🏗️' },
  { id: 'inversion',    label: 'Inversión',    icon: '📈' },
  { id: 'deuda',        label: 'Deuda',        icon: '🏦' },
  { id: 'psicologia',   label: 'Psicología',   icon: '🧠' },
  { id: 'fiscalidad',   label: 'Fiscalidad',   icon: '📋' },
  { id: 'vivienda',     label: 'Vivienda',     icon: '🏠' },
  { id: 'avanzado',     label: 'Avanzado',     icon: '🚀' },
];

let _guideCat = 'all';
let _guideOpenId = null;

function renderGuidesScreen() {
  const el = document.getElementById('s-guides');
  if (!el) return;
  const read = S.readGuides || [];
  const filtered = _guideCat === 'all'
    ? GUIDE_ARTICLES
    : GUIDE_ARTICLES.filter(a => a.cat === _guideCat);

  el.innerHTML = `
    <div class="guide-screen">
      <div class="top-nav">
        <button class="btn btn-ghost btn-sm" onclick="goTo('home')" style="padding:8px 12px;">← Volver</button>
        <div class="logo">📖 Guías</div>
        <div style="opacity:.5;font-size:12px;">${read.length}/${GUIDE_ARTICLES.length} leídas</div>
      </div>

      <div class="guide-progress-bar">
        <div class="guide-progress-fill" style="width:${Math.round(read.length/GUIDE_ARTICLES.length*100)}%"></div>
      </div>

      <div class="guide-cats">
        ${GUIDE_CATS.map(c => `
          <button class="guide-cat-btn ${_guideCat === c.id ? 'active' : ''}"
            onclick="setGuideCat('${c.id}')">
            ${c.icon} ${c.label}
          </button>`).join('')}
      </div>

      <div class="guide-list">
        ${filtered.length === 0
          ? '<p class="guide-empty">No hay artículos en esta categoría.</p>'
          : filtered.map(a => {
              const isRead = read.includes(a.id);
              return `
                <div class="guide-card ${isRead ? 'guide-card-read' : ''}"
                     onclick="openGuide('${a.id}')">
                  <div class="guide-card-icon">${a.icon}</div>
                  <div class="guide-card-body">
                    <div class="guide-card-title">${a.title}</div>
                    <div class="guide-card-summary">${a.summary}</div>
                  </div>
                  <div class="guide-card-status">${isRead ? '✅' : '→'}</div>
                </div>`;
            }).join('')}
      </div>
    </div>`;
}

function setGuideCat(cat) {
  _guideCat = cat;
  renderGuidesScreen();
}

function openGuide(id) {
  const article = GUIDE_ARTICLES.find(a => a.id === id);
  if (!article) return;

  // Marcar como leído
  if (!S.readGuides) S.readGuides = [];
  if (!S.readGuides.includes(id)) {
    S.readGuides = [...S.readGuides, id];
    saveState();
  }

  let modal = document.getElementById('m-guide-reader');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-guide-reader';
    modal.className = 'modal-overlay guide-modal-overlay';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-box guide-reader-box">
      <button class="guide-reader-close" onclick="closeModal('m-guide-reader');renderGuidesScreen()">✕</button>
      <div class="guide-reader-cat-badge">${GUIDE_CATS.find(c=>c.id===article.cat)?.icon || ''} ${article.cat}</div>
      <h2 class="guide-reader-title">${article.icon} ${article.title}</h2>
      <div class="guide-reader-body">${article.body}</div>
      <button class="btn btn-primary btn-block mt8" onclick="closeModal('m-guide-reader');renderGuidesScreen()">
        ✅ Entendido
      </button>
    </div>`;
  openModal('m-guide-reader');
}

window.setGuideCat   = setGuideCat;
window.openGuide     = openGuide;
window.renderGuidesScreen = renderGuidesScreen;

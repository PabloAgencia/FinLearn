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

  // Generar código de referido si no existe
  if (!S.referralCode) {
    var _rbase = (S.userName || 'FL').replace(/\s+/g, '').toUpperCase().slice(0, 4);
    S.referralCode = _rbase + Math.random().toString(36).slice(2, 6).toUpperCase();
  }
  // Aplicar bonus de referido si hay uno pendiente
  if (typeof _applyPendingReferral === 'function') _applyPendingReferral();

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
  if (m) { m.classList.remove('active'); m.style.display = 'none'; }
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
  window._celPendingAfterLevelUp = false;

  if (!S.completedMods.includes(mod.id)) {
    S.completedMods.push(mod.id);
    // P3-B: acumular minutos de estudio (8 min estimados por módulo)
    S.totalStudyMinutes = (S.totalStudyMinutes || 0) + 8;
    // F29: aplicar multiplicador x2 si está activo + multiplicador de evento estacional
    const hasMultiplier = S.xpMultiplierExpiry && Date.now() < S.xpMultiplierExpiry;
    const permMult  = S.xpMultiplier || 1.0;
    const seaMult   = (typeof SEA_getXPMult === 'function') ? SEA_getXPMult() : 1;
    const hotMult   = (S.streak || 0) >= 7 ? 1.5 : 1.0;
    const xpGain = Math.round((hasMultiplier ? XP_PER_MODULE * 2 : XP_PER_MODULE) * permMult * seaMult * hotMult);
    S.xp           += xpGain;
    S.totalXPtoday += xpGain;
    S.streak        = Math.max(1, S.streak);
    // F34: trackear XP ganado para reto de tipo 'xp'
    if (typeof F34_onXPGained === 'function') F34_onXPGained(xpGain);
    if (typeof recalcPatrimony === 'function') recalcPatrimony();
    if (hasMultiplier || seaMult > 1 || hotMult > 1) {
      const multLabel = hotMult > 1 && hasMultiplier ? 'doble + racha caliente'
        : hotMult > 1 && seaMult > 1 ? 'racha caliente + evento'
        : hotMult > 1 ? 'racha caliente 🔥'
        : hasMultiplier && seaMult > 1 ? 'doble + evento'
        : hasMultiplier ? 'doble' : 'evento \xd71.5';
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
      window._celPendingAfterLevelUp = true;
      // Community feed: registrar subida de nivel
      if (typeof _FEED !== 'undefined') _FEED.write('level_up', { level: newLevel });
      _showLevelUpScreen(newLevel);
    } else {
      window._celPendingAfterLevelUp = false;
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
    // Community feed: registrar módulo completado
    if (typeof _FEED !== 'undefined') _FEED.write('module_complete', { title: mod.title, xp: xpGain });
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

  if (!window._celPendingAfterLevelUp) openModal('m-cel');
  SFX.moduleComplete();
  if ((S.completedMods || []).length === 1) {
    NOTIFS.onFirstModule();
    NOTIFS.subscribePush();
    if (typeof PWA_showAfterModule === 'function') PWA_showAfterModule();
  } else if (NOTIFS._granted) NOTIFS.scheduleStreakReminder();
  // Mensaje emocional de vuelta al día siguiente
  setTimeout(() => {
    const hour = new Date().getHours();
    const msg = hour < 12 ? 'Nos vemos mañana por la mañana 🌅' : hour < 20 ? 'Nos vemos mañana a esta hora ⏰' : 'Nos vemos mañana 🌙';
    toast('💪 ¡Lección completada!', msg, 't-success');
  }, 2500);
  confetti();
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
  // F35: misiones diarias — módulo completado
  if (typeof F35_onModuleComplete === 'function') F35_onModuleComplete();
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
      <button onclick="_shareLevelUp(${level},\`${rankTitle.title}\`,\`${rankTitle.icon}\`)" style="width:100%;padding:12px;border-radius:14px;background:rgba(255,255,255,.08);border:1.5px solid rgba(255,255,255,.12);color:#fff;font-family:'Syne',sans-serif;font-weight:700;font-size:14px;cursor:pointer;margin-bottom:8px;">
        📤 Compartir nivel
      </button>
      <button onclick="document.getElementById('level-up-overlay').remove();if(typeof F44_render==='function')F44_render();if(window._celPendingAfterLevelUp){window._celPendingAfterLevelUp=false;if(typeof openModal==='function')openModal('m-cel');}if(typeof _checkShowRating==='function')_checkShowRating();"
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

function _shareLevelUp(level, rankTitle, icon) {
  var text = '¡Acabo de alcanzar el nivel ' + level + ' en FinLearn! ' + (icon || '🚀') + ' ' + (rankTitle || '') + '\nAprendo finanzas personales gratis → ' + window.location.origin;
  if (navigator.share) {
    navigator.share({ title: 'FinLearn · Nivel ' + level + ' 🎉', text: text, url: window.location.origin }).catch(function(){});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      if (typeof toast === 'function') toast('✅ Copiado', 'Pégalo en tus redes sociales', 't-success');
    });
  }
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
  const text = encodeURIComponent(`¡Acabo de completar "${modName}" en FinLearn! 🎓📈 Mejora tus finanzas personales en ${window.location.origin}`);
  const urls = {
    twitter:  `https://twitter.com/intent/tweet?text=${text}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`,
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
  const text = encodeURIComponent(`Acabo de completar "${modName}" en FinLearn 🚀${streakTxt} ${window.location.origin}`);
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
    const _hotMult = (S.streak || 0) >= 7 ? 1.5 : 1.0;
    const _xpGain = Math.round(20 * _cMult * (S.xpMultiplier || 1) * _hotMult);
    S.xp += _xpGain;
    spawnXP('+' + _xpGain + ' XP' + (_cMult > 1 ? ' ×' + _cMult : ''));
    setTimeout(() => _quizBurst('qo-' + correctIdx), 60);
    saveState();
    // F34/F35: trackear quiz correcto y XP ganado
    if (typeof F34_onQuizCorrect === 'function') F34_onQuizCorrect();
    if (typeof F34_onXPGained === 'function') F34_onXPGained(_xpGain);
    if (typeof F35_onQuizCorrect === 'function') F35_onQuizCorrect();
    if (typeof F35_onXPGained === 'function') F35_onXPGained(_xpGain);
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
        <div style="font-size:36px;margin-bottom:6px;">🧮</div>
        <div style="font-family:'Syne',sans-serif;font-size:22px;font-weight:800;color:var(--text1);">Calculadoras</div>
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
  if (valEl) {
    var newTxt = '€' + savings.toLocaleString('es');
    if (valEl.textContent !== newTxt) {
      valEl.textContent = newTxt;
      valEl.classList.remove('rm-val-pop');
      void valEl.offsetWidth; // reflow
      valEl.classList.add('rm-val-pop');
    }
  }
  if (pctEl) {
    if (inc === 0) pctEl.textContent = 'Introduce tus datos para empezar';
    else if (totalExp > inc) pctEl.textContent = '⚠️ Gastas más de lo que ingresas';
    else pctEl.textContent = pct >= 20 ? 'Ahorrando el ' + pct + '% de tus ingresos' : pct >= 10 ? 'Ahorrando el ' + pct + '% de tus ingresos' : 'Ahorrando el ' + pct + '% de tus ingresos';
  }

  // Gauge ring
  var ring = document.getElementById('rm-rate-ring');
  var rateLbl = document.getElementById('rm-rate-lbl');
  var ringColor = pct >= 20 ? '#00e5a0' : pct >= 10 ? '#f5a623' : '#ef4444';
  if (ring) {
    var circ = 314;
    var dashOffset = inc > 0 ? (circ - Math.min(pct / 40, 1) * circ) : circ;
    ring.style.strokeDashoffset = dashOffset;
    ring.style.stroke = inc > 0 ? ringColor : 'rgba(255,255,255,.07)';
  }
  if (rateLbl) {
    rateLbl.textContent = inc > 0 ? pct + '%' : '—';
    rateLbl.style.color = inc > 0 ? ringColor : 'var(--text3)';
  }

  // Tier badge
  var tierBadge = document.getElementById('rm-tier-badge');
  if (tierBadge && inc > 0) {
    var tiers = [[30,'🔥 Maestro FIRE'],[20,'⭐ Ahorrador Élite'],[10,'✓ En el buen camino'],[0,'⚠️ Empieza a ahorrar']];
    var tier = tiers.find(function(t){ return pct >= t[0]; }) || tiers[tiers.length - 1];
    tierBadge.textContent = tier[1];
    tierBadge.style.display = 'inline-block';
    tierBadge.style.color = ringColor;
    tierBadge.style.borderColor = ringColor;
    tierBadge.style.opacity = '1';
    tierBadge.style.background = 'transparent';
    tierBadge.style.boxShadow = '0 0 0 1.5px ' + ringColor + '40';
    tierBadge.style.border = '1.5px solid ' + ringColor + '50';
  } else if (tierBadge) {
    tierBadge.style.display = 'none';
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

  // 50/30/20 analysis
  _rmRender503020(inc, expHome, expFood, expTransport, expFun, expOther);
}

// ─── 50/30/20 VISUAL ANALYSIS ────────────────────────────────────────────────
function _rmRender503020(inc, expHome, expFood, expTransport, expFun, expOther) {
  var card = document.getElementById('rm-503020-card');
  if (!card) return;

  if (inc <= 0) { card.style.display = 'none'; return; }
  card.style.display = 'block';

  var needs   = expHome + expFood + expTransport;
  var wants   = expFun + expOther;
  var savings = Math.max(0, inc - needs - wants);

  var needsPct   = Math.round((needs   / inc) * 100);
  var wantsPct   = Math.round((wants   / inc) * 100);
  var savingsPct = Math.round((savings / inc) * 100);

  var TARGET_NEEDS = 50, TARGET_WANTS = 30, TARGET_SAVINGS = 20;

  // Verdict badge
  var overspendTotal = needs + wants > inc;
  var verdictKey, verdictColor, verdictIcon;
  if (overspendTotal) {
    verdictKey = 'Gasto mayor que ingreso'; verdictColor = '#ef4444'; verdictIcon = '🚨';
  } else if (savingsPct >= 30 && needsPct <= 50) {
    verdictKey = 'FIRE Track';              verdictColor = '#00e5a0'; verdictIcon = '🔥';
  } else if (needsPct <= 52 && wantsPct <= 32 && savingsPct >= 18) {
    verdictKey = 'Equilibrado';             verdictColor = '#00e5a0'; verdictIcon = '✅';
  } else if (needsPct > 60) {
    verdictKey = 'Necesidades altas';       verdictColor = '#f5a623'; verdictIcon = '⚠️';
  } else if (savingsPct < 10) {
    verdictKey = 'Ahorro crítico';          verdictColor = '#ef4444'; verdictIcon = '🚨';
  } else {
    verdictKey = 'Ajuste recomendado';      verdictColor = '#f5a623'; verdictIcon = '💡';
  }

  function barHTML(label, emoji, actual, target, amount, color) {
    var fill = Math.min(100, actual);
    var overTarget = actual > target;
    var fillColor = overTarget ? '#ef4444' : (Math.abs(actual - target) <= 5 ? '#00e5a0' : '#f5a623');
    if (label === 'Ahorro' && !overTarget) {
      fillColor = actual >= target ? '#00e5a0' : (actual >= target * 0.5 ? '#f5a623' : '#ef4444');
    }
    var deltaVal = actual - target;
    var deltaStr = (deltaVal > 0 ? '+' : '') + deltaVal + '%';
    var deltaColor = label === 'Ahorro'
      ? (deltaVal >= 0 ? '#00e5a0' : '#ef4444')
      : (deltaVal <= 0 ? '#00e5a0' : '#ef4444');
    var targetPx = Math.min(100, target);
    return '<div class="rm50-row">' +
      '<div class="rm50-row-head">' +
        '<span class="rm50-row-label">' + emoji + ' ' + label + '</span>' +
        '<span class="rm50-row-meta">' +
          '<span style="color:var(--text2);font-size:12px;">€' + Math.round(amount).toLocaleString('es') + '</span>' +
          '<span class="rm50-delta" style="color:' + deltaColor + ';">' + deltaStr + '</span>' +
        '</span>' +
      '</div>' +
      '<div class="rm50-track">' +
        '<div class="rm50-fill" style="width:' + fill + '%;background:' + fillColor + ';"></div>' +
        '<div class="rm50-target-line" style="left:' + targetPx + '%;"></div>' +
      '</div>' +
      '<div class="rm50-target-lbl" style="left:' + targetPx + '%;">' + target + '%</div>' +
    '</div>';
  }

  // Compound interest "improvement tip" — what redirecting 10% of wants saves in 20yr
  var redirectable = Math.max(0, wants - inc * (TARGET_WANTS / 100));
  var tipHTML = '';
  if (redirectable >= 50) {
    var months = 240, rate = 0.07 / 12;
    var fv = redirectable * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);
    tipHTML = '<div class="rm50-tip">' +
      '💡 Si redirigeras los <strong>€' + Math.round(redirectable).toLocaleString('es') + '/mes</strong> extra de Deseos a inversión ' +
      '(7% anual), tendrías <strong style="color:#00e5a0;">€' + Math.round(fv / 1000).toLocaleString('es') + 'k</strong> en 20 años.' +
    '</div>';
  } else if (savingsPct < TARGET_SAVINGS) {
    var gap = Math.round(inc * (TARGET_SAVINGS / 100)) - savings;
    tipHTML = '<div class="rm50-tip">' +
      '💡 Te faltan <strong>€' + gap.toLocaleString('es') + '/mes</strong> para alcanzar el objetivo del 20% de ahorro.' +
    '</div>';
  }

  // Monthly history trend (last 4 months)
  var histHTML = '';
  var hist = (typeof S !== 'undefined' && S._realMoneyHistory) ? S._realMoneyHistory : [];
  if (hist.length > 0) {
    var last4 = hist.slice(-4);
    histHTML = '<div class="rm50-hist-title">Historial 50/30/20</div><div class="rm50-hist">';
    last4.forEach(function(h) {
      var hInc = h.income || 0;
      if (hInc <= 0) return;
      var hNeeds = (h.expenses ? (h.expenses.home || 0) + (h.expenses.food || 0) + (h.expenses.transport || 0) : 0);
      var hWants = (h.expenses ? (h.expenses.fun || 0) + (h.expenses.other || 0) : 0);
      var hSav   = Math.max(0, hInc - hNeeds - hWants);
      var nP = Math.round((hNeeds / hInc) * 100);
      var wP = Math.round((hWants / hInc) * 100);
      var sP = Math.round((hSav   / hInc) * 100);
      var ok = nP <= 52 && wP <= 32 && sP >= 18;
      var dot = ok ? '🟢' : '🟡';
      var monthLbl = h.month ? h.month.slice(0, 7) : '';
      histHTML += '<div class="rm50-hist-row">' +
        '<span class="rm50-hist-month">' + dot + ' ' + monthLbl + '</span>' +
        '<span class="rm50-hist-pct" style="color:#f5a623;">' + nP + '%</span>' +
        '<span class="rm50-hist-pct" style="color:#818cf8;">' + wP + '%</span>' +
        '<span class="rm50-hist-pct" style="color:#00e5a0;">' + sP + '%</span>' +
      '</div>';
    });
    histHTML += '</div><div class="rm50-hist-legend">' +
      '<span style="color:#f5a623;">■ Nec</span>' +
      '<span style="color:#818cf8;">■ Des</span>' +
      '<span style="color:#00e5a0;">■ Aho</span>' +
    '</div>';
  }

  card.innerHTML =
    '<div class="rm50-card">' +
      '<div class="rm50-header">' +
        '<span class="rm50-title">Regla 50/30/20</span>' +
        '<span class="rm50-verdict" style="background:' + verdictColor + '22;color:' + verdictColor + ';">' + verdictIcon + ' ' + verdictKey + '</span>' +
      '</div>' +
      barHTML('Necesidades', '🏠', needsPct,   TARGET_NEEDS,    needs,   '#f5a623') +
      barHTML('Deseos',      '🎮', wantsPct,   TARGET_WANTS,    wants,   '#818cf8') +
      barHTML('Ahorro',      '💰', savingsPct, TARGET_SAVINGS,  savings, '#00e5a0') +
      tipHTML +
      histHTML +
    '</div>';
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
  const pctSaved = inc > 0 ? Math.round((savings / inc) * 100) : 0;
  // Milestone celebrations
  if (pctSaved >= 20 && existingIdx < 0) {
    setTimeout(function() {
      if (typeof confetti === 'function') confetti();
      if (typeof toast === 'function') toast('🔥 ¡Tasa Élite!', 'Ahorrando el ' + pctSaved + '% de tus ingresos. ¡Eres un maestro!', 't-success');
    }, 600);
  } else if (pctSaved >= 10 && existingIdx < 0) {
    setTimeout(function() {
      if (typeof toast === 'function') toast('⭐ ¡Buen trabajo!', 'Superaste el 10% de ahorro. ¡Sigue así!', 't-success');
    }, 600);
  } else {
    toast('✓ Mes guardado', `Ahorro total acumulado: €${S._realMoneyTotal.toLocaleString('es')}`, 't-success');
  }
  // XP por usar el tracker real
  if (existingIdx < 0) {
    S.xp = (S.xp || 0) + 50;
    if (typeof spawnXPv2 === 'function') spawnXPv2('+50 XP', 'Mi Dinero Real');
    // Community feed: registrar ahorro del mes
    if (typeof _FEED !== 'undefined') _FEED.write('savings', { amount: savings, pct: pctSaved });
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
   GUIDES — Artículos de lectura libre
   renderGuidesScreen() — punto de entrada desde goTo('guides')
══════════════════════════════════════════════════════════════════ */

const GUIDE_ARTICLES = [
  /* ── FUNDAMENTOS ── */
  {
    id: 'guide_ahorro', cat: 'fundamentos', icon: '💰', readTime: 3,
    title: 'El poder del ahorro: por qué el 20% lo cambia todo',
    summary: 'La regla del 20% y cómo aplicarla desde hoy.',
    stat: { value: '480k€', label: 'acumularías ahorrando 400€/mes al 7% durante 30 años' },
    key: 'Empieza con el 10% si el 20% es imposible hoy. Auméntalo un 1% cada 3 meses. La automatización es el único truco que funciona de verdad.',
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
    id: 'guide_presupuesto', cat: 'fundamentos', icon: '📊', readTime: 3,
    title: 'Cómo hacer un presupuesto que realmente funcione',
    summary: 'Método envelope, apps y el único hábito que importa.',
    stat: { value: '10 min', label: 'es todo lo que necesitas cada semana para controlar tu dinero' },
    key: 'No anotes cada café. Usa 8 categorías grandes y revisa una vez a la semana. El sistema sencillo que cumples supera al sistema perfecto que abandonas.',
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
    id: 'guide_fondo_emergencia', cat: 'fundamentos', icon: '🛡️', readTime: 3,
    title: 'El fondo de emergencia: tu primera línea de defensa',
    summary: 'Cuánto necesitas, dónde guardarlo y cuándo usarlo.',
    stat: { value: '3-6 m', label: 'meses de gastos esenciales es lo que necesitas tener siempre disponible' },
    key: 'Una oportunidad en bolsa no es una emergencia. Unas vacaciones no son una emergencia. Úsalo solo en urgencias reales y repónlo de inmediato.',
    body: `
      <h3>¿Para qué sirve exactamente?</h3>
      <p>El fondo de emergencia no es un ahorro para vacaciones ni para el coche nuevo. Es exclusivamente para situaciones imprevistas que afectan a tus ingresos o generan un gasto urgente: pérdida de empleo, avería del coche en la que dependes para trabajar, reparación de vivienda, emergencia médica.</p>
      <h3>¿Cuánto necesitas?</h3>
      <p>La regla general es entre 3 y 6 meses de gastos esenciales. Si eres autónomo, trabajas por proyectos o tienes ingresos variables, apunta a 9-12 meses. Un empleado con contrato indefiniente en un sector estable puede quedarse en 3 meses.</p>
      <h3>Dónde guardarlo</h3>
      <p>En una cuenta de ahorro remunerada o depósito a corto plazo. No en bolsa (puede caer justo cuando más lo necesitas), no bajo el colchón (inflación) y no en el mismo banco que tu cuenta corriente (demasiado tentador). Cuentas como Trade Republic o MyInvestor ofrecen actualmente entre el 2% y el 3,5% sin permanencia.</p>
      <h3>Cuándo usarlo</h3>
      <p>Sólo en emergencias reales. Una oportunidad de compra en bolsa no es una emergencia. Unas vacaciones no son una emergencia. Si lo usas, la prioridad número uno vuelve a ser reponerlo antes de cualquier otro objetivo financiero.</p>
    `
  },
  {
    id: 'guide_fin_de_mes', cat: 'fundamentos', icon: '😤', readTime: 4,
    title: 'Cómo romper el ciclo de "llego justo a fin de mes"',
    summary: 'El orden correcto del dinero y por qué casi nadie lo aplica.',
    stat: { value: '63%', label: 'de españoles no aguantaría 3 meses sin ingresos (CNMV 2023)' },
    key: 'No es un problema de ingresos, es un problema de orden. Págate primero a ti mismo — el futuro tú — antes de pagar nada más.',
    body: `
      <h3>Por qué siempre parece que falta dinero</h3>
      <p>El ciclo "cobro → gasto → ahorro lo que queda" es el patrón más común y el más destructivo. El problema: casi nunca queda nada. El gasto se expande para llenar cualquier ingreso disponible. Es lo que los economistas llaman inflación de lifestyle.</p>
      <h3>El orden correcto: págate primero</h3>
      <p>En cuanto cobras, la primera transferencia es para ti: un 10-20% directo a una cuenta de ahorro o inversión separada. Después pagas el alquiler, suministros, y lo que reste es para vivir. Si el resto no alcanza, el problema es visible y manejable. Si primero gastas, el problema es invisible hasta que es tarde.</p>
      <h3>Dónde suele perderse el dinero sin saberlo</h3>
      <p>Suscripciones olvidadas (Netflix, Spotify, apps), comida a domicilio cotidiana, "pequeñas" compras impulsivas online, y el coste invisible de las tarjetas de crédito con pago aplazado. Una auditoría de un mes —revisar cada cargo— suele revelar entre 100 € y 300 € "desaparecidos".</p>
      <h3>El plan de 90 días</h3>
      <p>Mes 1: auditar y eliminar gastos invisibles. Mes 2: automatizar el ahorro del 10% el día de cobro. Mes 3: aumentar al 15%. En 90 días puedes pasar de llegar justo a tener un pequeño colchón y la sensación de control que cambia completamente la relación con el dinero.</p>
    `
  },
  /* ── INVERSIÓN ── */
  {
    id: 'guide_indexados', cat: 'inversion', icon: '📈', readTime: 4,
    title: 'Fondos indexados: la estrategia que bate al 90% de los gestores',
    summary: 'Qué son, por qué funcionan y cómo empezar con 100 €.',
    stat: { value: '+31k€', label: 'de diferencia entre un indexado al 0,1% y un fondo activo al 2% en 30 años' },
    key: 'No necesitas ser listo para ganar más que la mayoría de gestores profesionales. Solo necesitas un indexado barato y paciencia.',
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
    id: 'guide_dca', cat: 'inversion', icon: '🔄', readTime: 3,
    title: 'DCA: por qué invertir todos los meses es mejor que esperar',
    summary: 'El método que elimina la ansiedad de "comprar en el momento equivocado".',
    stat: { value: '118k€', label: 'acumularías invirtiendo 200€/mes al 8% durante 20 años' },
    key: 'Configura la orden periódica en tu broker el día de cobro. Así no tienes que tomar ninguna decisión. La consistencia supera a la inteligencia.',
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
    id: 'guide_diversificacion', cat: 'inversion', icon: '🌍', readTime: 3,
    title: 'Diversificación: no pongas todos los huevos en la misma cesta',
    summary: 'Cómo distribuir tus inversiones para reducir riesgo sin perder rentabilidad.',
    stat: { value: '1.500', label: 'empresas en 23 países cubre un MSCI World — eso es diversificación real' },
    key: 'Tres o cuatro fondos bien elegidos son suficientes para la mayoría de inversores. Sobre-diversificar añade complejidad sin reducir más el riesgo.',
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
  {
    id: 'guide_acciones_vs_etf', cat: 'inversion', icon: '⚖️', readTime: 4,
    title: 'Acciones individuales vs ETFs: la decisión más importante',
    summary: 'Por qué la mayoría pierde eligiendo acciones y cuándo tiene sentido hacerlo.',
    stat: { value: '15%', label: 'de seleccionadores de acciones individuales baten al índice en 10 años' },
    key: 'Elegir acciones es apostar a que eres mejor que los mejores analistas del mundo. Los ETFs no requieren tener razón — solo paciencia.',
    body: `
      <h3>El atractivo de las acciones individuales</h3>
      <p>Comprar Apple o Amazon en el momento justo suena emocionante. El problema es que ese momento solo lo conoces en retrospectiva. Para cada persona que compró Amazon en 2010, hubo decenas que compraron Nokia, Blackberry o Kodak convencidos de estar eligiendo bien.</p>
      <h3>Por qué es tan difícil batir al mercado</h3>
      <p>Los mercados modernos están llenos de analistas con modelos matemáticos, acceso privilegiado a management de empresas y equipos enteros dedicados a analizar cada detalle. La información pública ya está descontada en el precio. Tú, invirtiendo desde casa, no tienes ventaja informacional.</p>
      <h3>Cuándo tiene sentido elegir acciones</h3>
      <p>Si tienes un conocimiento profundo y diferencial de un sector específico (eres médico y entiendes biotecnología, eres ingeniero y entiendes semiconductores), puedes tener una ventaja real en ese nicho. Y si lo haces, no más del 10-20% de tu cartera. El resto en índices.</p>
      <h3>La regla práctica</h3>
      <p>Si no puedes explicar en dos frases por qué una empresa vale más de lo que cotiza hoy y cuál es el catalizador que hará que el mercado lo reconozca, no deberías comprar esa acción. Tener una "buena empresa" no significa que esté barata.</p>
    `
  },
  /* ── DEUDA ── */
  {
    id: 'guide_deuda_buena', cat: 'deuda', icon: '🏦', readTime: 3,
    title: 'Deuda buena vs. deuda mala: la distinción que te cambia la vida',
    summary: 'No toda deuda es igual. Saber distinguirlas es clave.',
    stat: { value: '2x', label: 'acabas pagando en una tarjeta revolving al 24% si solo haces el pago mínimo' },
    key: 'Si el interés de tu deuda supera el 8%, págala antes de invertir. Liquidar una deuda al 24% equivale a una rentabilidad garantizada del 24%.',
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
  {
    id: 'guide_bola_nieve', cat: 'deuda', icon: '⛄', readTime: 3,
    title: 'Bola de nieve vs. avalancha: el mejor método para salir de deudas',
    summary: 'Dos estrategias opuestas. Cuál elegir depende de cómo funciona tu cabeza.',
    stat: { value: '23%', label: 'más rápido sales de deudas con avalancha vs bola de nieve en términos matemáticos' },
    key: 'La bola de nieve gana psicológicamente. La avalancha gana matemáticamente. La mejor estrategia es la que realmente cumples.',
    body: `
      <h3>El método bola de nieve (Dave Ramsey)</h3>
      <p>Ordena tus deudas de menor a mayor importe, independientemente del tipo de interés. Paga el mínimo en todas excepto en la más pequeña, a la que destinas todo el dinero extra disponible. Cuando la eliminas, añades ese pago a la siguiente. La bola crece con cada deuda eliminada.</p>
      <h3>El método avalancha</h3>
      <p>Ordena tus deudas de mayor a menor tipo de interés. Paga el mínimo en todas excepto en la de mayor interés. Matemáticamente, ahorras más dinero porque atacas primero la deuda que más te cuesta. Es la estrategia óptima en papel.</p>
      <h3>¿Cuál funciona mejor?</h3>
      <p>Estudios de comportamiento financiero (Harvard Business Review, 2016) demuestran que la bola de nieve tiene mayor tasa de éxito en la práctica porque las victorias rápidas generan motivación. La avalancha es mejor si eres disciplinado y no necesitas refuerzo positivo inmediato.</p>
      <h3>La regla de aplicación</h3>
      <p>Si la diferencia de tipos de interés entre tus deudas es pequeña (menos de 5 puntos), usa bola de nieve. Si tienes una deuda con un tipo muy superior al resto (una revolving al 24% frente a un préstamo al 5%), usa avalancha para esa primero independientemente del importe.</p>
    `
  },
  /* ── PSICOLOGÍA ── */
  {
    id: 'guide_sesgos', cat: 'psicologia', icon: '🧠', readTime: 5,
    title: 'Los 5 sesgos cognitivos que destruyen tus inversiones',
    summary: 'Tu cerebro no está diseñado para invertir. Estos son sus errores más costosos.',
    stat: { value: '6,4%', label: 'de rentabilidad anual pierde el inversor medio por errores de comportamiento (DALBAR)' },
    key: 'Conocer un sesgo no te hace inmune a él, pero sí te da un segundo antes de actuar. En inversión, ese segundo puede valer miles de euros.',
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
  {
    id: 'guide_no_mirar', cat: 'psicologia', icon: '🙈', readTime: 3,
    title: 'Cómo no arruinarse mirando el portfolio cada día',
    summary: 'La paradoja: cuanto más miras, peores decisiones tomas.',
    stat: { value: '95%', label: 'de probabilidad de ver pérdidas si miras tu cartera cada día, aunque sea año bueno' },
    key: 'El S&P 500 sube el ~70% de los días, pero la volatilidad diaria activa el sistema de alarma del cerebro. Mirar menos no es ignorancia, es disciplina.',
    body: `
      <h3>La tiranía de la pantalla</h3>
      <p>Si miras tu cartera a diario, un año con rentabilidad del +15% se percibe como una pesadilla: días rojos, semanas de bajada, noticias alarmantes. El cerebro registra cada pérdida con más intensidad que cada ganancia. El resultado: decisiones emocionales en el peor momento.</p>
      <h3>La matemática del dolor</h3>
      <p>En un año con rentabilidad positiva del 10%, hay aproximadamente 120 días de bajada. Si miras cada día, experimentas ese dolor 120 veces. Si miras cada mes, quizás 3 o 4. Si miras cada trimestre, probablemente ninguno. Misma rentabilidad, distinto sufrimiento.</p>
      <h3>El experimento de Benartzi y Thaler</h3>
      <p>Demostraron que inversores que solo revisan su cartera anualmente invierten más agresivamente (y obtienen mayor rentabilidad) que los que la revisan mensualmente. La frecuencia de revisión determina el apetito al riesgo, no al revés.</p>
      <h3>Protocolo práctico</h3>
      <p>Configura tus alertas solo para bajadas superiores al 20% (que requieren revisión real) y para el día que toca rebalancear (una vez al año). Elimina la app del broker de la pantalla principal del móvil. No mirar no es ignorancia, es disciplina activa.</p>
    `
  },
  /* ── FISCALIDAD ── */
  {
    id: 'guide_irpf_inversion', cat: 'fiscalidad', icon: '📋', readTime: 4,
    title: 'IRPF y tus inversiones: lo que Hacienda se lleva (y cómo minimizarlo)',
    summary: 'Plusvalías, dividendos, tramos 2024 y estrategias legales de optimización.',
    stat: { value: '19%', label: 'retención mínima en ganancias de capital — empieza aquí la base del ahorro 2024' },
    key: 'En España los fondos de inversión permiten traspasar sin tributar. Ese diferimiento fiscal compuesto puede valer más que la diferencia de rentabilidad entre fondos.',
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
  {
    id: 'guide_declarar_renta', cat: 'fiscalidad', icon: '📝', readTime: 4,
    title: 'Cómo declarar tus inversiones en la Renta (sin errores)',
    summary: 'Casillas, plazos y los errores más comunes que cuestan dinero.',
    stat: { value: '4 años', label: 'tiene Hacienda para revisar tu declaración — no improvises' },
    key: 'Las pérdidas no declaradas son dinero tirado. Puedes compensarlas durante 4 años. Muchos inversores desconocen este derecho y pagan de más.',
    body: `
      <h3>Qué tienes que declarar</h3>
      <p>Todo lo que hayas vendido durante el año: acciones, fondos, ETFs, criptomonedas. También los dividendos recibidos aunque vengan ya con retención del 19%. Y los intereses de cuentas de ahorro o depósitos. Si no vendiste nada durante el año, no hay ganancia patrimonial que declarar.</p>
      <h3>Las casillas que importan</h3>
      <p>Las ganancias y pérdidas de acciones y fondos van en la casilla 1624 (rendimientos de capital mobiliario) o en la casilla 1800 (ganancias y pérdidas patrimoniales). Los dividendos en la 0029. La app Renta Web de la AEAT rellena automáticamente los datos de brokers españoles; los brokers extranjeros como Interactive Brokers o Degiro requieren más cuidado.</p>
      <h3>El error más caro: no declarar pérdidas</h3>
      <p>Si vendiste con pérdidas, decláralo aunque no "tengas que" hacerlo. Esas pérdidas compensan ganancias futuras durante los próximos 4 años. Es dinero que te devuelve Hacienda en el futuro. No declarar las pérdidas es perder ese derecho.</p>
      <h3>Brokers extranjeros</h3>
      <p>Degiro, Interactive Brokers y similares no comunican automáticamente a la AEAT. Eres responsable de declarar. Además, si tienes más de 50.000 € en el extranjero, debes presentar el modelo 720. La ignorancia no exime de sanciones.</p>
    `
  },
  /* ── VIVIENDA ── */
  {
    id: 'guide_hipoteca', cat: 'vivienda', icon: '🏠', readTime: 4,
    title: 'Hipoteca en 2024: todo lo que debes saber antes de firmar',
    summary: 'Euríbor, tipos fijos vs. variables, TAE real y gastos ocultos.',
    stat: { value: '60k€', label: 'necesitas ahorrados mínimo para comprar un piso de 200.000 € (entrada + gastos)' },
    key: 'Compara siempre TAE, nunca TIN. Y recuerda: el banco no es tu amigo en la negociación — lleva ofertas de al menos tres entidades.',
    body: `
      <h3>El Euríbor y las hipotecas variables</h3>
      <p>El Euríbor a 12 meses, al que se referencian la mayoría de hipotecas variables en España, ha pasado del -0,5% en 2021 al entorno del 3-4% en 2024. Una hipoteca variable de 200.000 € a 30 años puede suponer 400-600 € más al mes respecto a cuando los tipos estaban en negativo.</p>
      <h3>Fijo vs. variable vs. mixta</h3>
      <p>El tipo fijo da certeza: sabes exactamente lo que pagarás durante toda la vida del préstamo. El variable es más arriesgado pero puede ser más barato si los tipos bajan. La hipoteca mixta combina un período fijo inicial (5-10 años) con variable posterior. En un entorno de tipos altos como 2024, el fijo es atractivo para quien valore la estabilidad.</p>
      <h3>La TAE real: el número que importa</h3>
      <p>El TIN (tipo nominal) no incluye comisiones ni gastos. La TAE (tasa anual equivalente) sí los incluye y es la cifra que permite comparar correctamente entre ofertas. Siempre compara TAE, nunca TIN.</p>
      <h3>Los gastos que nadie menciona</h3>
      <p>Tasación (300-600 €), gestoría, registro de la propiedad, notaría y el IAJD (que desde 2018 paga el banco). Además, la entrada: los bancos suelen financiar el 80% del valor de tasación. Para un piso de 200.000 €, necesitas tener ahorrados unos 60.000 €.</p>
    `
  },
  /* ── AVANZADO ── */
  {
    id: 'guide_interes_compuesto', cat: 'avanzado', icon: '🚀', readTime: 4,
    title: 'El interés compuesto: la octava maravilla del mundo',
    summary: 'Por qué Einstein llamó así al interés compuesto y cómo aprovecharlo.',
    stat: { value: '149k€', label: 'se convierten 10.000€ al 7% en 40 años. En 20 años solo 38.697€.' },
    key: 'El coste de esperar 10 años para empezar a invertir puede superar el coste de las comisiones de toda una vida. Empieza hoy, aunque sea con poco.',
    body: `
      <h3>La fórmula mágica</h3>
      <p>Capital final = Capital inicial × (1 + rentabilidad)^años. Parece simple, pero sus implicaciones son contraintuitivas. 10.000 € al 7% durante 10 años = 19.672 €. Durante 20 años = 38.697 €. Durante 40 años = 149.745 €. No duplicas el dinero cada 10 años, te cuadruiplicas porque los intereses también generan intereses.</p>
      <h3>La regla del 72</h3>
      <p>Para saber en cuántos años se duplica una inversión, divide 72 entre la rentabilidad anual. Al 6%, tarda 12 años. Al 8%, tarda 9 años. Al 12%, tarda 6 años. Esta regla mental te permite hacer cálculos rápidos sin calculadora.</p>
      <h3>El coste de esperar</h3>
      <p>Ana invierte 200 €/mes desde los 25 hasta los 35 (10 años, 24.000 € totales) y luego no aporta nada más. Carlos invierte 200 €/mes desde los 35 hasta los 65 (30 años, 72.000 € totales). A los 65 años, Ana tiene más dinero que Carlos, habiendo aportado tres veces menos. Esto es el interés compuesto y el tiempo.</p>
      <h3>Lo que frena el interés compuesto</h3>
      <p>Las interrupciones: retirar dinero antes de tiempo destruye el efecto compuesto. Los impuestos: tributar cada año por las ganancias reduce la base que genera nuevos intereses. Las comisiones: un 1% extra de comisión anual puede costar el 25% del capital final en 40 años.</p>
    `
  },
  {
    id: 'guide_independencia', cat: 'avanzado', icon: '🏝️', readTime: 4,
    title: 'FIRE: independencia financiera y retiro anticipado',
    summary: 'La regla del 4%, el número mágico y cómo calcular el tuyo.',
    stat: { value: '25x', label: 'tus gastos anuales: ese es el patrimonio que necesitas para ser financieramente libre' },
    key: 'Reducir gastos tiene doble efecto: ahorras más rápido Y necesitas menos capital para ser libre. Es el mayor acelerador del camino FIRE.',
    body: `
      <h3>¿Qué es el movimiento FIRE?</h3>
      <p>FIRE (Financial Independence, Retire Early) es una filosofía que busca acumular suficiente patrimonio para vivir de las rentas sin necesitar trabajar. No implica jubilarse a los 35 ni vivir en una cabaña; muchos FIRE siguen trabajando en lo que les apasiona, simplemente porque quieren, no porque necesiten el dinero.</p>
      <h3>La regla del 4%</h3>
      <p>Basada en el Trinity Study (1998), establece que puedes retirar el 4% de tu cartera cada año sin agotarla en un horizonte de 30 años, asumiendo una cartera 50% renta variable / 50% renta fija. Tu número FIRE es tu gasto anual × 25.</p>
      <h3>Calcula tu número FIRE</h3>
      <p>Si gastas 2.000 €/mes (24.000 €/año), necesitas 24.000 × 25 = 600.000 € en activos financieros. Si reduces tus gastos a 1.500 €/mes, el número cae a 450.000 €. Reducir gastos tiene un doble efecto: ahorras más rápido Y necesitas menos capital para ser libre.</p>
      <h3>Las variantes de FIRE</h3>
      <p>Lean FIRE: vivir con el mínimo. Fat FIRE: independencia con estilo de vida elevado. Barista FIRE: un trabajo a tiempo parcial cubre gastos básicos. Coast FIRE: ya tienes suficiente acumulado y el interés compuesto hará el resto sin nuevas aportaciones.</p>
    `
  },
  {
    id: 'guide_4_activos', cat: 'avanzado', icon: '🎯', readTime: 4,
    title: 'Los 4 activos que debes conocer (y cuánto de cada uno)',
    summary: 'Renta variable, fija, inmobiliario y liquidez: el mapa completo de las inversiones.',
    stat: { value: '4', label: 'tipos de activos principales que determinan el 90% del resultado de cualquier cartera' },
    key: 'La asignación de activos (qué porcentaje de cada tipo) determina más del 90% de tu rentabilidad a largo plazo. Elegir qué acciones comprar es lo de menos.',
    body: `
      <h3>1. Renta variable (acciones)</h3>
      <p>Propiedades de empresas. Mayor rentabilidad histórica (~7-10% anual) pero mayor volatilidad. Ideal para horizontes de inversión largos (>10 años). Un MSCI World o S&P 500 te da exposición a las mejores empresas del mundo con un solo instrumento y mínimas comisiones.</p>
      <h3>2. Renta fija (bonos)</h3>
      <p>Préstamos a gobiernos o empresas que pagan un interés fijo. Menor rentabilidad pero mayor estabilidad. Funcionan como amortiguador en carteras mixtas: cuando la bolsa cae, los bonos suelen subir. Recomendados para inversores conservadores o con horizonte temporal corto.</p>
      <h3>3. Inmobiliario (REITs o directo)</h3>
      <p>Acceso a ingresos por alquiler y revalorización del inmueble. Los REITs (fondos inmobiliarios cotizados) permiten invertir en inmobiliario desde 1 € sin gestión directa. El inmobiliario directo tiene ventajas fiscales en España pero requiere capital elevado y gestión activa.</p>
      <h3>4. Liquidez (cash y equivalentes)</h3>
      <p>Cuentas remuneradas, fondos monetarios, letras del tesoro. Rentabilidad baja pero capital disponible de inmediato. Imprescindible para el fondo de emergencia y para oportunidades de mercado. Demasiada liquidez en cartera es un coste de oportunidad real.</p>
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

function renderGuidesScreen() {
  const el = document.getElementById('s-guides');
  if (!el) return;
  const read = S.readGuides || [];
  const filtered = _guideCat === 'all'
    ? GUIDE_ARTICLES
    : GUIDE_ARTICLES.filter(a => a.cat === _guideCat);

  const pct = Math.round(read.length / GUIDE_ARTICLES.length * 100);

  // Category completion banner
  let catBanner = '';
  if (_guideCat !== 'all') {
    const catArticles = GUIDE_ARTICLES.filter(a => a.cat === _guideCat);
    const readInCat = catArticles.filter(a => read.includes(a.id));
    if (catArticles.length > 0 && readInCat.length === catArticles.length) {
      const catInfo = GUIDE_CATS.find(c => c.id === _guideCat);
      catBanner = `<div class="guide-cat-complete">
        <div class="guide-cat-complete-icon">🏆</div>
        <div><div class="guide-cat-complete-text">¡Categoría completada!</div>
        <div class="guide-cat-complete-sub">Todas las guías de ${catInfo?.label || _guideCat} leídas</div></div>
      </div>`;
    }
  }

  el.innerHTML = `
    <div class="guide-screen">
      <div class="top-nav">
        <button class="btn btn-ghost btn-sm" onclick="goTo('home')" style="padding:8px 12px;">← Volver</button>
        <div class="logo">📖 Guías</div>
        <div style="font-size:12px;color:var(--text3);">${read.length}/${GUIDE_ARTICLES.length} <span style="color:var(--accent);font-weight:700;">${pct}%</span></div>
      </div>

      <div class="guide-progress-bar">
        <div class="guide-progress-fill" style="width:${pct}%;transition:width .6s ease;"></div>
      </div>

      <div class="guide-cats">
        ${GUIDE_CATS.map(c => `
          <button class="guide-cat-btn ${_guideCat === c.id ? 'active' : ''}"
            onclick="setGuideCat('${c.id}')">
            ${c.icon} ${c.label}
          </button>`).join('')}
      </div>

      <div class="guide-list">
        ${catBanner}
        ${filtered.length === 0
          ? '<p class="guide-empty">No hay artículos en esta categoría.</p>'
          : filtered.map((a, i) => {
              const isRead = read.includes(a.id);
              return `
                <div class="guide-card ${isRead ? 'guide-card-read' : ''} guide-card-anim"
                     style="animation-delay:${i * 55}ms"
                     onclick="openGuide('${a.id}')">
                  <div class="guide-card-icon">${a.icon}</div>
                  <div class="guide-card-body">
                    <div class="guide-card-title">${a.title}</div>
                    <div class="guide-card-summary">${a.summary}</div>
                    <div class="guide-card-meta">
                      <span class="guide-card-time">⏱ ${a.readTime || 3} min</span>
                      ${!isRead ? '<span class="guide-card-xp">+30 XP</span>' : ''}
                    </div>
                  </div>
                  <div class="guide-card-right">
                    ${isRead ? '<span class="guide-card-status-read">✅</span>' : '<span style="font-size:14px;color:var(--text3);">→</span>'}
                  </div>
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

  const isFirstRead = !S.readGuides || !S.readGuides.includes(id);
  if (!S.readGuides) S.readGuides = [];
  if (isFirstRead) {
    S.readGuides = [...S.readGuides, id];
    saveState();
  }

  let reader = document.getElementById('guide-reader-screen');
  if (!reader) {
    reader = document.createElement('div');
    reader.id = 'guide-reader-screen';
    reader.className = 'guide-reader-screen';
    document.body.appendChild(reader);
  }

  const catInfo = GUIDE_CATS.find(c => c.id === article.cat);
  const statBlock = article.stat ? `
    <div class="guide-stat-callout">
      <div class="guide-stat-value">${article.stat.value}</div>
      <div class="guide-stat-label">${article.stat.label}</div>
    </div>` : '';
  const keyBlock = article.key ? `
    <div class="guide-key-takeaway">
      <div class="guide-key-label">💡 DATO CLAVE</div>
      <div class="guide-key-text">"${article.key}"</div>
    </div>` : '';

  reader.innerHTML = `
    <div class="guide-reader-scrollbar" id="guide-reader-scrollbar"></div>
    <div class="guide-reader-topbar">
      <button class="guide-reader-back-btn" onclick="closeGuideReader()">← Volver</button>
      <div class="guide-reader-topcat">${catInfo?.icon || ''} ${catInfo?.label || article.cat}</div>
      <div class="guide-reader-toptime">⏱ ${article.readTime || 3} min</div>
    </div>
    <div class="guide-reader-scroll-area" id="guide-reader-scroll-area">
      <div class="guide-reader-big-icon">${article.icon}</div>
      <h1 class="guide-reader-h1">${article.title}</h1>
      ${statBlock}
      <div class="guide-reader-body">${article.body}</div>
      ${keyBlock}
      <div class="guide-done-area">
        <button class="btn btn-primary btn-block guide-done-btn" onclick="finishGuide('${id}',${isFirstRead})">
          ${isFirstRead ? '✅ Entendido · +30 XP' : '✅ Entendido'}
        </button>
        <button class="guide-share-btn" onclick="_shareGuide('${id}')">📤 Compartir esta guía</button>
      </div>
    </div>`;

  requestAnimationFrame(() => { reader.classList.add('open'); });

  const scrollArea = document.getElementById('guide-reader-scroll-area');
  const bar = document.getElementById('guide-reader-scrollbar');
  if (scrollArea && bar) {
    scrollArea.addEventListener('scroll', function() {
      const max = scrollArea.scrollHeight - scrollArea.clientHeight;
      if (max > 0) bar.style.width = Math.min(100, (scrollArea.scrollTop / max) * 100) + '%';
    }, { passive: true });
  }
}

function closeGuideReader() {
  const reader = document.getElementById('guide-reader-screen');
  if (!reader) return;
  reader.classList.remove('open');
  reader.classList.add('closing');
  setTimeout(() => { reader.classList.remove('closing'); }, 320);
  renderGuidesScreen();
}

function finishGuide(id, isFirstRead) {
  if (isFirstRead) {
    const xp = 30;
    if (typeof S !== 'undefined') {
      S.xp = (S.xp || 0) + xp;
      if (typeof F34_onXPGained === 'function') F34_onXPGained(xp);
      if (typeof saveState === 'function') saveState();
    }
    if (typeof spawnXP === 'function') spawnXP('+' + xp + ' XP');
    if (typeof toast === 'function') toast('📖 Guía completada', '+' + xp + ' XP ganados', 't-success');
    // Check category completion
    const article = GUIDE_ARTICLES.find(a => a.id === id);
    if (article) {
      const catArticles = GUIDE_ARTICLES.filter(a => a.cat === article.cat);
      const nowRead = catArticles.filter(a => (S.readGuides || []).includes(a.id));
      if (nowRead.length === catArticles.length) {
        const catInfo = GUIDE_CATS.find(c => c.id === article.cat);
        setTimeout(() => {
          if (typeof toast === 'function') toast('🏆 Categoría completada', 'Todas las guías de ' + (catInfo?.label || article.cat) + ' leídas', 't-success');
        }, 1200);
      }
    }
  }
  closeGuideReader();
}

function _shareGuide(id) {
  const article = GUIDE_ARTICLES.find(a => a.id === id);
  if (!article) return;
  const text = '📖 Acabo de leer "' + article.title + '" en FinLearn. Aprende finanzas personales gratis 👉 ' + window.location.origin;
  if (navigator.share) {
    navigator.share({ title: 'FinLearn — Guía financiera', text }).catch(function() {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      if (typeof toast === 'function') toast('📋 Copiado', 'Pégalo donde quieras compartirlo', 't-success');
    });
  }
}

window.setGuideCat        = setGuideCat;
window.openGuide          = openGuide;
window.closeGuideReader   = closeGuideReader;
window.finishGuide        = finishGuide;
window._shareGuide        = _shareGuide;
window.renderGuidesScreen = renderGuidesScreen;

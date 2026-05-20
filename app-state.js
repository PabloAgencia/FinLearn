// ═══ STATE — Core ═══
/* ══════════════════════════════════════════════════════════════════
   state-core.js — Núcleo del Estado FinLearn

   ¿QUÉ ES ESTO Y POR QUÉ EXISTE?
   ─────────────────────────────────────────────────────────────────
   El "estado" es toda la información del jugador en un momento dado:
   su XP, nivel, racha, dinero, módulos completados, etc.
   Este archivo es el corazón de la app: si este archivo falla,
   la app entera falla. Por eso es el más pequeño y limpio de todos.

   FLUJO DE DATOS:
     1. La app arranca → loadState() lee localStorage → llena S
     2. El usuario hace algo → script modifica S directamente
     3. Antes de salir de cada acción → saveState() escribe S en localStorage
     4. Al recargar → loadState() restaura exactamente donde estaba

   DEPENDENCIAS:
     · Importa MODULES de data.js (para restaurar currentMod por id)
     · NO importa de ui.js ni script.js → sin riesgo de dependencias circulares

   QUÉ EXPORTA:
     · DEFAULTS           → valores iniciales de S (el "estado cero")
     · S                  → el objeto de estado vivo que toda la app lee/escribe
     · LS_KEY             → clave de localStorage
     · GAME               → estado de juego temporal (precios, filtros activos)
     · INFLATION_RATE     → constante de inflación simulada (2%)
     · AppState           → helper mínimo para leer/escribir keys auxiliares
     · saveState()        → serializa S a localStorage
     · loadState()        → restaura S desde localStorage
     · clearState()       → resetea todo a DEFAULTS
     · calcCompound()     → fórmula valor futuro (capital + aportaciones)
     · simulateMonthlyGrowth() → simula un día de crecimiento del patrimonio
     · calcHealthScore()  → puntuación 0-100 de salud financiera del jugador
     · getHealthLevel()   → convierte score en {label, color} para mostrar
══════════════════════════════════════════════════════════════════ */



/* ══════════════════════════════════════════════════════════════════
   DEFAULTS — El estado cero del jugador nuevo
   ─────────────────────────────────────────────────────────────────
   Cada clave aquí tiene un propósito:
   · xp / level / streak         → sistema de gamificación
   · completedMods / currentMod  → progreso en el curso
   · balance / invested          → dinero del simulador financiero
   · cash / portfolio            → simulador de bolsa
   · businesses                  → simulador de negocios
   · lifeAge / lifeEvents        → simulador de vida
   · career                      → carrera actual (junior/senior/entrepreneur)
   · gameYear                    → años de juego transcurridos (inflación)
══════════════════════════════════════════════════════════════════ */
const DEFAULTS = {
  /* ── Gamificación ── */
  xp: 0, level: 1, streak: 0, maxStreak: 0,
  goal: 'freedom', goalLabel: '🏝️ Libertad financiera',
  userName: '', avatar: '🌱',
  /* ── Progreso del curso ── */
  completedMods: [], currentMod: null, step: 0,
  quizAnswered: false, lessonDone: false,
  /* ── Control diario ── */
  dcaDone: false, dcaDate: '',
  gameDay: 0, gameYear: 1,
  unlockedAchs: [],
  lastLoginDate: '', loginDayCount: 0, claimedDays: [],
  streakShields: 0,             // escudos consumibles (max 2)
  streakMilestonesGiven: [],    // días de racha ya recompensados [3,7,14,30,100]
  lastSessionTs: 0,           // timestamp real del último saveState
  lastSessionGameDay: 0,      // gameDay de la última sesión
  debts: [],
  income: 0, monthlyIncome: 0, age: 30,
  seenCareerEvents: [],
  shownYearSummaries: [],
  gameSpeedMult: 3,
  hasSeenTutorial: false,
  nextCrisisDay: 180,
  nextEconomicNewsDay: 20,
  seenCrisisEvents: [],
  recentLifeEvents: [],
  nextLifeEventDay: 45,
  mortgages: [],
  completedScenarios: [],
  peakPatrimony: 0,
  lightMode: false,
  theme: 'dark',
  hadBigDrawdown: false,
  daysSinceLastSell: 0,
  flashCrashBuys: 0,
  crisesSurvived: 0,
  crisisBuys: 0,
  paperHandsCount: 0,   // years already shown (prevent re-show)
  yearStartPatrimony: 0,    // patrimony at start of current year
  yearStartXP: 0,           // XP at start of current year
  yearStartMods: 0,         // modules completed at year start
  yearDividends: 0,         // dividends collected this game-year
  yearBizIncome: 0,         // business income this game-year
  totalXPtoday: 0, lastMilestone: 0, identityLevel: 0,
  currentTitleIdx: 0,           // P4-B: índice del último título de nivel desbloqueado
  /* ── Perfil financiero (simulador) ── */
  balance: 0, invested: 0,
  monthlyContribution: 200, expectedReturn: 7, patrimony: 0,
  /* ── F24 Onboarding personalizado ── */
  investorLevel: '',        // 'zero' | 'saving' | 'investing' | 'active'
  suggestedModuleId: null,  // id del módulo sugerido según goal+level
  onboardHeroMsg: '',       // mensaje personalizado para el hero card
  /* ── F25 Tracker de Patrimonio Real ── */
  realAssets: null,         // { checking, funds, stocks, property, pension, other } — null = no configurado
  realDebts:  null,         // { mortgage, loans, cards }
  realPatrimony: null,      // número: patrimonio neto real calculado
  realPatrimonyDate: null,  // ISO date de última actualización
  /* ── F27 Plan de Acción Personalizado ── */
  actionPlan: null,           // [{ id, status, title, ... }]
  _actionPlanHash: null,      // hash de datos para detectar cambios
  _actionPlanGeneratedAt: null,// ISO timestamp de generación
  /* ── Fechas ── */
  startDate: new Date().toISOString().slice(0, 10),
  lastVisit: new Date().toISOString().slice(0, 10),
  daysActive: 0,
  /* ── Viral / logros ── */
  viralMilestones: [],
  /* ── Simulador de bolsa ── */
  cash: 5000,        // efectivo disponible para invertir
  portfolio: {},     // { ticker: { shares, avgPrice, dividendsCollected } }
  totalDividends: 0,
  /* ── Simulador de negocios ── */
  businesses: {},    // { bizId: { level, purchasePrice, totalRevenue, upgrades:[] } }
  /* ── Simulador de vida ── */
  lifeAge: 25,
  lifeEvents: [],
  lifeSalary: 1800,
  lifeExpenses: { rent: 700, food: 300, transport: 100, leisure: 200, other: 150 },
  lifeHappiness: 70,
  /* ── Sistema de carrera ── */
  career: 'intern',       // 'intern' | 'junior' | 'specialist' | 'senior' | 'director' | 'clevel' | 'entrepreneur' | 'investor'
  careerChanges: [],       // historial: [{from, to, age, gameYear}]
  /* ── Historial de patrimonio ── */
  patrimonyHistory: [],    // [{gameYear, value}] — snapshot anual
  patrimonyDaily:   [],    // [{day, value}] — snapshot diario, rolling 365 puntos
  lastYearPatrimony: 0,    // valor al inicio del año actual de juego
  /* ── Historial de movimientos ── */
  ledger: [],
  /* ── Dividendos del mes ── */
  totalDivMonth: 0,        // acumulado de dividendos en el mes actual
  /* ── F33 Streak Identity ── */
  streakBrokeAt: null,      // timestamp cuando se rompió la racha (para Earn Back 24h)
  streakEarnBackMods: 0,    // módulos completados desde que se rompió (necesita 2 para recuperar)
  /* ── F34 Reto Diario ── */
  dailyChallengeKey: '',          // fecha 'YYYY-MM-DD' del reto actual
  dailyChallengeCompleted: false, // ¿completado hoy?
  dailyChallengeClaimed: false,   // ¿premio reclamado?
  dailyChallengeProgress: 0,      // progreso actual (0..target)
  dailyChallengeType: '',         // tipo de reto generado hoy ('module'|'xp'|'quiz'|'streak')
  dailyChallengeTag: '',          // tag de rama (solo tipo 'module')
  dailyChallengeTarget: 0,        // objetivo numérico
  dailyChallengeXPReward: 0,      // XP del premio de hoy
  /* ── F32 Ligas Semanales ── */
  league: 'bronze',        // 'bronze' | 'silver' | 'gold' | 'diamond'
  leagueWeekXP: 0,         // XP ganado esta semana (calculado como S.xp - leagueWeekXPBase)
  leagueWeekXPBase: 0,     // S.xp al inicio de la semana actual (para calcular delta)
  leagueWeekKey: '',       // clave 'YYYY-Www' para detectar cambio de semana
  leagueSeed: 0,           // seed para generar rivales estables por semana
  leaguePromotedFrom: null, // liga anterior si acaba de ascender (para animación)
  /* ── F42 Problema del Día ── */
  dailyProblem: null,       // {date, solved, attempts, emojis}
  /* ── F43 Rentabilidad Pasiva ── */
  lastSeen: 0,              // timestamp del último cierre de app
  /* ── F44 Cofres + Pity ── */
  chestsAvailable: [],      // [{type, earnedAt}]
  chestPityCount: 0,        // cofres abiertos sin legendario
  xpMultiplier: 1.0,        // multiplicador permanente de XP
  /* ── F45 Eventos de Mercado ── */
  activeMarketEvent: null,  // {id, startTime, endTime, eventData}
  seenMarketEvents: [],     // IDs de eventos ya vistos
  marketEventLastTrigger: 0,// timestamp del último evento
  /* ── F46 Hearts ── */
  hearts: 5,                // fichas de análisis (máx 5)
  heartsLastRegen: 0,       // timestamp de última regeneración
  /* ── F47 Dilemas ── */
  lastDilemma: null,        // {week, answered, choice}
  /* ── F48 Resumen Semanal ── */
  weeklySnapshot: null,     // {weekKey, prev:{xp,mods,patrimony,streak}, cur:{...}}
  weeklyReviewSeen: '',     // weekKey ya vista (para no mostrarla 2 veces)
  /* ── M1 Doble XP Weekend ── */
  doubleXPLastWeekend: '',  // 'YYYY-Www' para evitar duplicar bonus
  /* ── M2 Prestige ── */
  prestigeCount: 0,
  /* ── M3 Friend Streak ── */
  friendCode: '',           // código 6 chars
  friendStreak: 0,
  /* ── PRIORIDAD 1: Herramientas Reales ── */
  nwHistory: [],            // [{date, networth, assets, debts}] — net worth tracker histórico
  nwAssets: { efectivo: 0, inversiones: 0, inmuebles: 0, pension: 0, otros: 0 },
  nwDebts:  { hipoteca: 0, prestamos: 0, tarjetas: 0, otros: 0 },
  /* ── PRIORIDAD 2: Gamificación diferencial ── */
  bossBeaten:       [],   // IDs de ramas cuyos boss han sido completados
  bossAttempts:     {},   // { branchId: intentos }
  personalityType:  null, // 'ahorrador' | 'inversor' | 'emprendedor' | 'gastador'
  personalityAnswers: [], // respuestas guardadas [0..7]
  branchCerts:      [],   // ramas certificadas ['fundamentos','inversion',...]
  /* ── HEATMAP de actividad real ── */
  activityLog:      {},   // { 'YYYY-MM-DD': nModulesCompleted }
  /* ── Speedrun mode ── */
  speedrunRecords:  {},   // { modId: segundos } — mejor tiempo propio
  /* ── Seasonal Events ── */
  seenSeasonalRewards: [], // IDs de recompensas ya reclamadas ['fire_enero_2025',...]
  /* ── P4-C Misiones Semanales ── */
  weeklyMissions: [],          // [{id, progress, goal, xp, done, type}]
  weeklyMissionsDate: '',      // ISO lunes actual 'YYYY-MM-DD'
  /* ── P3-A Onboarding / Perfil ── */
  onboardingDone: false,       // true tras completar el wizard
  profileColor: '#00e5a0',     // color de acento del perfil
  joinDate: 0,                 // timestamp de primer inicio
  dailyGoalMinutes: 10,        // minutos diarios objetivo
  finLevel: '',                // 'zero'|'saving'|'investing'|'active' (nivel financiero)
  /* ── P3-B Estadísticas Perfil ── */
  totalStudyMinutes: 0,        // minutos acumulados de estudio (estimado: 8 min/módulo)
  /* ── Blog / Guías ── */
  readGuides: [],              // IDs de artículos leídos ['guide_ahorro', ...]
  /* ── Campos internos (no mostrar al usuario) ── */
  _budget: null,
  _totalSells: 0,
  _premium: '0',
  lastSessionPatrimony: 0,
  xpMultiplierExpiry: 0,
  _mw_week: -1,
  _mw_missions: [],
  _mw_perfect_weeks: [],
  _mw_ten_weeks: [],
};


/* ══════════════════════════════════════════════════════════════════
   S — El estado vivo de la aplicación
   ─────────────────────────────────────────────────────────────────
   ¿Por qué `export let S`?
   · `let` permite reasignar S (necesario si hacemos Object.assign en loadState)
   · Se exporta para que script.js y ui.js puedan leerlo directamente
   · NUNCA lo reemplaces con S = {} — modifica siempre con Object.assign(S, {...})
     para que las referencias importadas en otros módulos sigan apuntando
     al mismo objeto en memoria.
══════════════════════════════════════════════════════════════════ */
let S = { ...DEFAULTS };


/* ══════════════════════════════════════════════════════════════════
   CONSTANTES GLOBALES
══════════════════════════════════════════════════════════════════ */

/** Clave de localStorage. Bumpeala (+1) para forzar reset en todos los usuarios.
 *  Ejemplo: v9 → v10 cuando cambies la estructura de DEFAULTS. */
const LS_KEY = 'finlearn_v9_state';

/** Tasa de inflación anual simulada en el juego (2%). */
const INFLATION_RATE = 0.02;


/* ══════════════════════════════════════════════════════════════════
   GAME — Estado de sesión del simulador de mercado
   ─────────────────────────────────────────────────────────────────
   ¿Por qué está separado de S?
   · S se persiste en localStorage (survives page reload)
   · GAME es estado de UI efímero: precios actuales, filtros de pantalla,
     qué stock está activo ahora mismo. No tiene sentido guardarlo.
   · Importado como objeto mutable por script.js y ui.js — ambos
     modifican la MISMA referencia en memoria sin importaciones circulares.
══════════════════════════════════════════════════════════════════ */
const GAME = {
  stockPrices: {},         // { ticker: precioActual }
  priceHistory: {},        // { ticker: [p1, p2, ...] } — últimas 60 velas
  currentStockFilter: 'all',
  currentStock: null,      // objeto del stock activo en el modal de bolsa
  stockQty: 1,
  examScore: 0,
  _expandedBranch: null,   // rama actualmente expandida en el grid de módulos
};


/* ══════════════════════════════════════════════════════════════════
   AppState — Wrapper mínimo de localStorage para claves auxiliares
   ─────────────────────────────────────────────────────────────────
   Uso: AppState.set('fl_plan', datos) / AppState.get('fl_plan')
   Para claves simples fuera del objeto S principal (onboarding, landing).
══════════════════════════════════════════════════════════════════ */
const AppState = {
  get(key, def = null) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
    catch (e) { return def; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { }
  },
};


/* ══════════════════════════════════════════════════════════════════
   PERSISTENCIA — save / load / clear
══════════════════════════════════════════════════════════════════ */

/**
 * saveState — Serializa S a localStorage.
 * ─────────────────────────────────────────────────────────────────
 * ¿Por qué no guardamos currentMod como objeto?
 * · Los módulos son objetos grandes con funciones anidadas.
 * · JSON.stringify no serializa funciones → se perderían datos.
 * · Solución: guardamos solo el id (número) y al cargar buscamos
 *   el objeto completo en el array MODULES.
 */
function saveState() {
  try {
    S.maxStreak = Math.max(S.maxStreak||0, S.streak||0);
    S.lastSessionTs        = Date.now();
    S.lastSeen             = Date.now();
    S.lastSessionGameDay   = S.gameDay || 0;
    S.lastSessionPatrimony = Math.round(S.patrimony || 0);
    const toSave = { ...S };
    delete toSave.currentMod;
    toSave.currentModId = S.currentMod ? S.currentMod.id : null;
    localStorage.setItem(LS_KEY, JSON.stringify(toSave));
    // Sync to cloud if logged in (fire and forget)
    if (typeof sbSaveState === 'function' && typeof getSBUser === 'function' && getSBUser()) {
      sbSaveState().catch(e => console.warn('[SB] sync error:', e));
    }
  } catch (e) { console.warn('saveState error:', e); }
}

/**
 * loadState — Restaura S desde localStorage.
 * ─────────────────────────────────────────────────────────────────
 * Pasos:
 * 1. Lee el JSON de localStorage.
 * 2. Hace merge con DEFAULTS (para que campos nuevos aparezcan).
 * 3. Sanitiza: corrige tipos incorrectos o datos corruptos.
 * 4. Restaura currentMod desde currentModId.
 * 5. Detecta si es un nuevo día → reset diario + streak.
 *
 * Retorna true si había estado guardado, false si es la primera visita.
 */
function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;

    const saved = JSON.parse(raw);

    // Merge: DEFAULTS primero (valores por defecto), luego saved (sobrescribe con los del jugador)
    // Así si añades una clave nueva a DEFAULTS, aparece automáticamente en jugadores viejos.
    Object.assign(S, DEFAULTS, saved);

    // ── Sanitización de arrays (protege contra corrupción de localStorage) ──
    if (!Array.isArray(S.completedMods)) S.completedMods = [];
    // Solo IDs numéricos válidos
    S.completedMods = S.completedMods.filter(id => typeof id === 'number' && id >= 0 && id <= 999);
    if (!Array.isArray(S.viralMilestones)) S.viralMilestones = [];
    if (!Array.isArray(S.lifeEvents))      S.lifeEvents      = [];
    if (!Array.isArray(S.careerChanges))   S.careerChanges   = [];

    // ── Sanitización de números (convierte strings a números si el tipo se corrompió) ──
    S.xp      = Math.max(0, parseInt(S.xp)       || 0);
    S.streak  = Math.max(0, parseInt(S.streak)    || 0);
    S.gameSpeedMult = S.gameSpeedMult || 3;
    S.level   = Math.max(1, parseInt(S.level)     || 1);
    S.balance = Math.max(0, parseFloat(S.balance) || 0);
    S.cash    = Math.max(0, parseFloat(S.cash)    || 0);
    S.invested= Math.max(0, parseFloat(S.invested)|| 0);
    if (!S.monthlyIncome) S.monthlyIncome = S.lifeSalary || S.income || 0;
    S.monthlyContribution = Math.max(0, parseFloat(S.monthlyContribution) || 200);
    S.patrimony = Math.max(0, parseFloat(S.patrimony) || 0);
    // Recalcular nivel desde XP con el sistema progresivo
    if (typeof LEVEL_XP_THRESHOLDS !== 'undefined' && LEVEL_XP_THRESHOLDS.length > 1) {
      let recalcLevel = 1;
      for (let i = LEVEL_XP_THRESHOLDS.length - 1; i >= 1; i--) {
        if (S.xp >= LEVEL_XP_THRESHOLDS[i]) { recalcLevel = i + 1; break; }
      }
      S.level = Math.min(Math.max(1, recalcLevel), 50);
    }

    // ── MIGRACIÓN: saves antiguos tienen dinero en S.balance pero S.cash era 5000 default.
    //    Si el save tenía S.balance > 0 y S.cash es el valor default (5000), 
    //    mover S.balance a S.cash para unificar. ──────────────────────────────────────────
    if (S.balance > 0 && S.cash <= 5000) {
      S.cash    = S.balance + S.cash;
      S.balance = 0;
    }

    // Si patrimony quedó en 0 pero hay cash o invested, recalcula
    if (!S.patrimony && (S.cash || S.invested)) {
      S.patrimony = recalcPatrimony();
    }

    // ── Restaurar objeto módulo desde id ──
    if (saved.currentModId != null) {
      S.currentMod = MODULES.find(m => m.id === saved.currentModId) || null;
    }

    // ── Reset diario: detectar si es un día nuevo ──
    const today     = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    if (S.lastVisit !== today) {
      if (S.lastVisit !== yesterday) {
        // Rompió la racha — consumir escudo si hay
        if ((S.streakShields || 0) > 0) {
          S.streakShields--;
          // No resetear racha — el escudo la protege
          setTimeout(function() {
            toast('🛡️ ¡Escudo activado!',
              'Tu racha de ' + S.streak + ' días se ha salvado. Te queda' + (S.streakShields > 0 ? 'n ' + S.streakShields : ' 0') + ' escudo' + (S.streakShields !== 1 ? 's' : '') + '.',
              't-success');
          }, 1500);
        } else {
          S.streak = 0; // sin escudo — racha perdida
          S.streakBrokeAt      = Date.now();
          S.streakEarnBackMods = 0;
        }
      }
      S.dcaDone      = false;
      S.dcaDate      = '';
      S.totalXPtoday = 0;
      S.daysActive   = (S.daysActive || 0) + 1;
      S.lastVisit    = today;
      simulateMonthlyGrowth(); // simula el crecimiento del día
    }

    return true;
  } catch (e) {
    console.warn('loadState error:', e);
    return false;
  }
}

/**
 * clearState — Borra todo y vuelve al estado cero.
 * Limpia también claves legacy de versiones anteriores.
 */
function clearState() {
  ['finlearn_v9_state', 'finlearn_v8_state', 'finlearn_v7_state', 'finlearn_v6_state',
   'fl_state', 'fl_plan', 'fl_daily', 'fl_landing', 'fl_registered', 'fl_lastLogin',
  ].forEach(k => { try { localStorage.removeItem(k); } catch (e) { } });

  Object.assign(S, DEFAULTS);
  S.startDate = new Date().toISOString().slice(0, 10);
  S.lastVisit = new Date().toISOString().slice(0, 10);
}


/* ══════════════════════════════════════════════════════════════════
   CÁLCULOS FINANCIEROS CORE
   ─────────────────────────────────────────────────────────────────
   Aquí solo las fórmulas que el propio estado necesita internamente
   (simulateMonthlyGrowth las llama loadState). El resto de helpers
   financieros están en state-helpers.js.
══════════════════════════════════════════════════════════════════ */

/**
 * calcCompound — Valor futuro con aportaciones periódicas.
 * ─────────────────────────────────────────────────────────────────
 * Fórmula: FV = P×(1+r)^n + PMT×[((1+r)^n − 1)/r]
 * Donde:
 *   P   = capital inicial
 *   PMT = aportación mensual
 *   r   = tasa mensual (anual/12/100)
 *   n   = meses totales (años×12)
 *
 * Ejemplo: calcCompound(10000, 200, 7, 20) = patrimonio en 20 años
 * con 10.000€ iniciales + 200€/mes al 7% anual.
 */
function calcCompound(principal, monthly, rateAnnual, years) {
  const r = rateAnnual / 100 / 12;
  const n = years * 12;
  if (r === 0) return principal + monthly * n;
  return Math.round(
    principal * Math.pow(1 + r, n) +
    monthly * ((Math.pow(1 + r, n) - 1) / r)
  );
}

/**
 * simulateMonthlyGrowth — Simula un día de crecimiento del patrimonio.
 * ─────────────────────────────────────────────────────────────────
 * Llamada automáticamente cada vez que el usuario abre la app un nuevo día.
 * Divide la aportación mensual entre 30 días y aplica el retorno esperado.
 * Esto da la sensación de que el dinero crece "en tiempo real".
 */
function simulateMonthlyGrowth() {
  const dailyContrib = S.monthlyContribution / 30;
  const dailyReturn  = (S.expectedReturn / 100 / 365) * S.invested;
  S.invested  += dailyContrib + dailyReturn;
  recalcPatrimony();
}

/**
 * calcHealthScore — Puntuación 0-100 de salud financiera del jugador.
 * ─────────────────────────────────────────────────────────────────
 * Compuesto de 4 factores de 25 puntos cada uno:
 *   · Fondo de emergencia (balance ≥ 3× gastos mensuales estimados)
 *   · Porcentaje invertido del patrimonio total
 *   · Racha de estudio (30 días = máximo)
 *   · Módulos completados (20 módulos = máximo)
 */
function calcHealthScore() {
  let score = 0;
  const income         = S.monthlyIncome || S.lifeSalary || S.income || 2000;
  const monthlyExp     = income * 0.7;
  const emergencyTarget= Math.max(monthlyExp * 3, 3000);
  const debtTotal      = (S.debts || []).reduce((s,d) => s + (d.balance||0), 0);

  // 1. Fondo de emergencia (25 pts) — usa S.cash (cartera unificada)
  score += Math.min(25, (S.cash / emergencyTarget) * 25);
  // 2. Tasa de inversión / patrimonio (25 pts)
  const totalPat = Math.max(S.patrimony || 1, 1);
  score += Math.min(25, (S.invested / totalPat) * 50);
  // 3. Racha y aprendizaje (25 pts)
  score += Math.min(15, (S.streak / 30) * 15);
  score += Math.min(10, (S.completedMods.length / ((typeof MODULES !== 'undefined') ? MODULES.filter(function(m){return m&&typeof m.id==='number';}).length : 30)) * 10);
  // 4. Ratio deuda/ingresos anuales (25 pts)
  const annualIncome = income * 12;
  if (annualIncome > 0) score += Math.max(0, 25 - (debtTotal / annualIncome) * 25);
  else score += debtTotal === 0 ? 25 : 5;

  return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * getHealthLevel — Convierte un score numérico en etiqueta + color para la UI.
 * 0-30  → Básico (rojo)
 * 31-70 → En progreso (amarillo)
 * 71-100 → Avanzado (verde)
 */
function getHealthLevel(score) {
  if (score <= 30) return { label: 'Básico',       color: '#ef4444' };
  if (score <= 70) return { label: 'En progreso',  color: '#eab308' };
  return               { label: 'Avanzado',      color: '#00e5a0' };
}


// ═══ STATE — DOM ═══
/* ══════════════════════════════════════════════════════════════════
   state-dom.js — Utilidades DOM y Efectos Visuales

   ¿QUÉ ES ESTO Y POR QUÉ EXISTE?
   ─────────────────────────────────────────────────────────────────
   Este archivo tiene UNA sola regla: solo puede tocar el DOM.
   Nada de lógica de negocio, nada de cálculos financieros.
   Si una función crea, modifica o lee un elemento HTML → va aquí.

   Separar esto de state-core.js tiene dos ventajas:
   · state-core.js puede testearse sin un navegador (sin document ni window)
   · Si refactorizas la UI (p.ej. migras a React), solo tocas este archivo

   QUÉ EXPORTA:
   · setEl()           → cambia el texto de un elemento por id
   · setElHTML()       → cambia el innerHTML de un elemento por id
   · openModal()       → añade clase 'open' a un modal
   · closeModal()      → quita clase 'open' de un modal
   · toast()           → muestra notificación emergente (esquina pantalla)
   · confetti()        → lluvia de confeti (partículas de colores)
   · emojiConfetti()   → lluvia de emojis (celebración máxima)
   · spawnXP()         → texto "+20 XP" que flota y desaparece
   · fmtPrice()        → formatea un número como precio en euros
   · fmtPnl()          → formatea ganancia/pérdida con color
   · updateProgressText() → actualiza "X de 20 módulos" en la UI

   DEPENDENCIAS: ninguna — este archivo no importa nada.
══════════════════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════════════════════════
   HELPERS DOM BÁSICOS
   ─────────────────────────────────────────────────────────────────
   setEl y setElHTML son los más usados de toda la app.
   Siempre verifican que el elemento existe antes de modificarlo
   para evitar errores en pantallas que no tienen ese elemento en el DOM.
══════════════════════════════════════════════════════════════════ */

/** Cambia el textContent de un elemento por su id. */
function setEl(id, val) {
  const e = document.getElementById(id);
  if (e) e.textContent = val;
}

/** Cambia el innerHTML de un elemento por su id. */
function setElHTML(id, val) {
  const e = document.getElementById(id);
  if (e) e.innerHTML = val;
}

/** Actualiza los spans "X de N módulos" que aparecen en dashboard y perfil. */
function updateProgressText(completedMods) {
  const n     = (completedMods || S.completedMods || []).length;
  const _totalMods = (typeof MODULES !== 'undefined') ? MODULES.filter(m => m && typeof m.id === 'number').length : 30;
  const total = _totalMods;
  const text  = n + ' de ' + total;
  ['progress-text', 'progress-text-profile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });
}


/* ══════════════════════════════════════════════════════════════════
   MODALES
   ─────────────────────────────────────────────────────────────────
   Los modales en FinLearn son divs con clase CSS 'open' que los hace visibles.
   openModal/closeModal simplemente añaden o quitan esa clase.
   El CSS (en style.css) maneja la animación de entrada/salida.
══════════════════════════════════════════════════════════════════ */

/** Abre un modal añadiendo la clase 'open'. */
function openModal(id) {
  const el = document.getElementById(id);
  if (!el) { console.warn('[openModal] Elemento no encontrado:', id); return; }
  el.classList.add('open');
  // Support both modal-bg (class toggle) and modal-overlay (display toggle)
  if (el.classList.contains('modal-overlay')) {
    el.style.display = 'flex';
  } else {
    el.style.display = 'flex'; // modal-bg also needs display flex
  }
}

/** Cierra un modal quitando la clase 'open'. Silent si no existe (puede que no esté en DOM). */
function closeModal(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('open');
  el.style.display = 'none';
}


/* ══════════════════════════════════════════════════════════════════
   TOAST — Notificación emergente
   ─────────────────────────────────────────────────────────────────
   Tipos disponibles (controlan el color via CSS):
     · 't-success' → verde  (acción completada)
     · 't-fire'    → naranja (racha, milestone)
     · 't-social'  → azul   (prueba social)

   El toast se auto-elimina del DOM a los 4,5 segundos.
   También puede cerrarse con clic antes.
══════════════════════════════════════════════════════════════════ */
function toast(title, body, type = 't-success') {
  if (typeof title !== 'string') title = String(title || '');
  if (typeof body !== 'string') body = String(body || '');
  if (typeof type !== 'string') type = 't-success';
  const wrap = document.getElementById('toast-wrap');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<div class="toast-t">${title}</div><div class="toast-b">${body}</div>`;
  el.onclick = () => { el.classList.add('out'); setTimeout(() => el.remove(), 300); };
  wrap.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 2800);
}


/* ══════════════════════════════════════════════════════════════════
   EFECTOS VISUALES DE CELEBRACIÓN
   ─────────────────────────────────────────────────────────────────
   Tres niveles de celebración:
     1. spawnXP()       → texto flotante "+20 XP" (feedback inmediato de cada quiz)
     2. confetti()      → lluvia de 70 partículas de colores (completar módulo)
     3. emojiConfetti() → lluvia de 28 emojis (máximos: certificado, FIRE)
══════════════════════════════════════════════════════════════════ */

/**
 * Muestra un texto flotante tipo "+20 XP" que asciende y desaparece.
 * text: el string a mostrar, ej. '+20 XP' o '🎯 ¡Quiz!'
 */
function spawnMoney(text, color) {
  const el = document.createElement('div');
  el.className = 'money-pop';
  el.textContent = text;
  const hue = color || '#00e5a0';
  el.style.cssText = `left:${20 + Math.random() * 60}%;bottom:${60 + Math.random() * 20}%;color:${hue};`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

function _addGroupXP(amount) {
  S._groupXP = (S._groupXP || 0) + (amount || 0);
}
window._addGroupXP = _addGroupXP;

function spawnXP(text) {
  const el = document.createElement('div');
  el.className = 'xp-pop';
  el.textContent = text;
  el.style.cssText = `left:${40 + Math.random() * 20}%;top:50%;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

/**
 * Lanza 70 partículas de confeti desde posiciones aleatorias.
 * Cada partícula es un div con animación CSS (definida en style.css).
 */
function confetti() {
  const wrap = document.getElementById('confetti-wrap');
  if (!wrap) return;
  const colors = ['#00e5a0', '#0091ff', '#ff6b35', '#fbbf24', '#a855f7'];
  for (let i = 0; i < 70; i++) {
    const p    = document.createElement('div');
    p.className = 'cp';
    const size  = 6 + Math.random() * 6;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = Math.random() > 0.5 ? '50%' : '2px';
    p.style.cssText = [
      `left:${Math.random() * 100}%`,
      `width:${size}px`, `height:${size}px`,
      `background:${color}`, `border-radius:${shape}`,
      `animation-duration:${1.5 + Math.random() * 1.5}s`,
      `animation-delay:${Math.random() * 0.5}s`,
    ].join(';');
    wrap.appendChild(p);
    setTimeout(() => p.remove(), 3500);
  }
}

/**
 * Lanza 28 emojis aleatorios que caen desde arriba (máxima celebración).
 */
function emojiConfetti() {
  const emojis = ['🎉', '🏆', '⭐', '💰', '🚀', '🎊', '💎', '✨', '🔥', '🌟'];
  for (let i = 0; i < 28; i++) {
    const el       = document.createElement('div');
    el.className   = 'emoji-confetti-piece';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const left     = 5 + Math.random() * 90;
    const delay    = Math.random() * 1.2;
    const duration = 2.5 + Math.random() * 2;
    el.style.cssText = [
      `left:${left}%`,
      `animation-duration:${duration}s`,
      `animation-delay:${delay}s`,
      `font-size:${22 + Math.random() * 18}px`,
    ].join(';');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), (duration + delay + 0.5) * 1000);
  }
}


/* ══════════════════════════════════════════════════════════════════
   FORMATEO DE PRECIOS Y P&L
   ─────────────────────────────────────────────────────────────────
   Centralizar el formateo aquí evita tener `.toFixed(2)` y
   `.toLocaleString()` dispersos por toda la app.
══════════════════════════════════════════════════════════════════ */

/**
 * fmtPrice — Formatea un número como precio en euros con lógica adaptativa:
 *   ≥ 10.000€ → sin decimales          (ej: "€12.450")
 *   ≥ 100€    → 2 decimales            (ej: "€182.50")
 *   < 100€    → hasta 4 decimales      (ej: "€3.8200")  ← cripto / centavos
 */
function fmtPrice(n) {
  if (n >= 10000) return '€' + n.toLocaleString('es', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  if (n >= 100)   return '€' + n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '€' + n.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

/**
 * fmtPnl — Formatea la ganancia/pérdida no realizada de una posición.
 * Devuelve HTML con color: verde si ganancias, rojo si pérdidas.
 * shares × (precioActual − precioMedio) = P&L total de la posición.
 */
function fmtPnl(shares, avg, current) {
  const pnl  = (current - avg) * shares;
  const sign = pnl >= 0 ? '+' : '';
  const color = pnl >= 0 ? 'var(--accent)' : 'var(--danger)';
  return `<span style="color:${color}">${sign}€${Math.abs(pnl).toFixed(2)}</span>`;
}


// ═══ STATE — Helpers ═══
/* ══════════════════════════════════════════════════════════════════
   state-helpers.js — Helpers de Lógica de Negocio

   ¿QUÉ ES ESTO Y POR QUÉ EXISTE?
   ─────────────────────────────────────────────────────────────────
   Funciones que COMBINEN datos de S con datos de data.js para
   calcular algo que la UI necesita mostrar.

   Ejemplos:
   · "¿En qué posición del ranking está el jugador?" → necesita S.xp + RANKINGS
   · "¿Cuánto gana este negocio?" → necesita S.businesses + BUSINESSES
   · "¿En qué etapa de identidad está?" → necesita S.xp + IDENTITY_STAGES

   REGLA: este archivo no toca el DOM (eso es state-dom.js)
   y no modifica S directamente (eso es state-core.js).
   Solo lee datos y devuelve valores calculados.

   DEPENDENCIAS:
     · S, INFLATION_RATE  ← de state-core.js
     · CAREERS, BUSINESSES, RANKINGS, IDENTITY_STAGES ← de data.js

   QUÉ EXPORTA:
   · calcAssetProjection()     → valor nominal y real futuro de un activo
   · getCurrentCareer()        → objeto carrera activa del jugador
   · calcMonthlySalary()       → sueldo mensual neto según carrera + negocios
   · buildSparkline()          → SVG mini-gráfico a partir de un array de precios
   · getPatrimonyMessage()     → mensaje motivacional según crecimiento del patrimonio
   · calcIdentityLevel()       → índice 0-4 de la etapa de identidad actual
   · _getIdentityLevel()       → alias de calcIdentityLevel (compatibilidad)
   · _calcPercentile()         → percentil y usuarios adelantados en el ranking
   · _getLiveRankings()        → ranking completo con el jugador insertado
   · _updateMyRankPosition()   → actualiza los elementos DOM del ranking
   · calcBizRevenue()          → ingresos mensuales de un negocio concreto
   · calcBizROI()              → ROI anual de un negocio como porcentaje
   · isBusinessUnlocked()      → ¿puede el jugador comprar este negocio?
   · getBusinessLockReason()   → texto del motivo de bloqueo
   · getCashRealValue()        → valor real (ajustado por inflación) del efectivo
══════════════════════════════════════════════════════════════════ */



/* ══════════════════════════════════════════════════════════════════
   PROYECCIONES FINANCIERAS
══════════════════════════════════════════════════════════════════ */

/**
 * calcAssetProjection — Proyecta el valor de un activo en el futuro.
 * ─────────────────────────────────────────────────────────────────
 * Devuelve dos valores:
 *   · nominal → lo que aparece en el saldo (sin descontar inflación)
 *   · real    → poder adquisitivo real (descontando INFLATION_RATE)
 *
 * Ejemplo: calcAssetProjection(10000, 0.07, 20)
 *   → nominal: 38.697€  (lo que ves en la cuenta)
 *   → real:    26.533€  (lo que realmente puedes comprar con eso)
 */
function calcAssetProjection(currentValue, annualReturn, years) {
  const nominal = Math.round(currentValue * Math.pow(1 + annualReturn, years));
  const real    = Math.round(nominal / Math.pow(1 + INFLATION_RATE, years));
  return { nominal, real };
}


/* ══════════════════════════════════════════════════════════════════
   SISTEMA DE CARRERA
══════════════════════════════════════════════════════════════════ */

/**
 * getCurrentCareer — Devuelve el objeto carrera activa del jugador.
 * Si S.career no existe o no coincide con ninguna carrera, devuelve junior (CAREERS[0]).
 */
function getCurrentCareer() {
  return CAREERS.find(c => c.id === (S.career || 'junior')) || CAREERS[0];
}

/**
 * calcMonthlySalary — Calcula el sueldo mensual neto según carrera y negocios.
 * ─────────────────────────────────────────────────────────────────
 * Para el emprendedor, no hay sueldo base fijo: se añaden 150€ por
 * cada negocio que posee (para simular que diversificar negocios
 * genera ingresos aunque la carrera base sea 0).
 */
function calcMonthlySalary() {
  const career = getCurrentCareer();
  // S.lifeSalary stores the actual negotiated salary (modified by career events)
  // Falls back to career base salary if not set
  let base = S.lifeSalary || career.salary || 1800;
  if (career.id === 'entrepreneur') {
    const bizCount = Object.keys(S.businesses || {}).length;
    base += bizCount * 200;
  }
  if (career.id === 'investor') {
    // Passive income: 4% rule annualized / 12
    const passiveMonthly = Math.round((S.invested || 0) * 0.04 / 12);
    base = passiveMonthly;
  }
  return Math.round(base);
}


/* ══════════════════════════════════════════════════════════════════
   GRÁFICOS
══════════════════════════════════════════════════════════════════ */

/**
 * buildSparkline — Genera un SVG de mini-gráfico (sparkline) para mostrar
 * la evolución del precio de un activo en las últimas N velas.
 * ─────────────────────────────────────────────────────────────────
 * · values: array de números (precios históricos)
 * · El color es verde si el último precio ≥ al primero, rojo si no.
 * · Viewbox 80×32 pixels — escala automáticamente al contenedor CSS.
 */
function buildSparkline(values) {
  if (!values || values.length < 2) return '<svg width="80" height="32"></svg>';
  const min   = Math.min(...values);
  const max   = Math.max(...values);
  const range = max - min || 1;
  const W = 80, H = 32;
  const pts = values.map((v, i) =>
    `${(i / (values.length - 1)) * W},${H - ((v - min) / range) * (H - 6) + 3}`
  ).join(' ');
  const up  = values[values.length - 1] >= values[0];
  const col = up ? '#00e5a0' : '#ef4444';
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    <polyline points="${pts}" fill="none" stroke="${col}" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;
}


/* ══════════════════════════════════════════════════════════════════
   PATRIMONIO
══════════════════════════════════════════════════════════════════ */

/**
 * getPatrimonyMessage — Mensaje motivacional basado en el crecimiento anual.
 * Aparece en la sección de patrimonio al cerrar el año de juego.
 * growthPct: porcentaje de crecimiento (puede ser negativo en crashes).
 */
function getPatrimonyMessage(growthPct) {
  if (growthPct >= 15)  return '¡Crecimiento excepcional! Tu cartera supera la media histórica. Mantén el rumbo.';
  if (growthPct >= 7)   return `Buen año (${growthPct.toFixed(1)}%). Estás en línea con la rentabilidad histórica del mercado.`;
  if (growthPct >= 0)   return 'Año positivo. Las caídas son temporales; la constancia a largo plazo siempre gana.';
  if (growthPct >= -10) return 'Año difícil. Históricamente, tras correcciones el mercado sube más del 100% en 5 años.';
  return 'Corrección severa. Los inversores que mantienen siempre acaban recuperándose y superando máximos.';
}


/* ══════════════════════════════════════════════════════════════════
   SISTEMA DE IDENTIDAD
   ─────────────────────────────────────────────────────────────────
   La identidad del inversor evoluciona en 5 etapas:
   🌱 Principiante → 💰 Ahorrador → 📊 Analista → 💼 Inversor → 🏝️ Independiente
   El nivel depende de XP acumulado + módulos completados.
══════════════════════════════════════════════════════════════════ */

/**
 * calcIdentityLevel — Devuelve el índice 0-4 de la etapa de identidad actual.
 * Recorre IDENTITY_STAGES de mayor a menor y devuelve el primero que cumple
 * tanto el minXP como los minMods requeridos.
 */
function calcIdentityLevel() {
  for (let i = IDENTITY_STAGES.length - 1; i >= 0; i--) {
    const stage = IDENTITY_STAGES[i];
    const xpOk  = S.xp >= (stage.minXP  || 0);
    const modOk = (S.completedMods || []).length >= (stage.minMods || 0);
    if (xpOk && modOk) return i;
  }
  return 0;
}

/** Alias de calcIdentityLevel para mantener compatibilidad con código antiguo. */
function _getIdentityLevel() {
  return calcIdentityLevel();
}

/* ── P4-B: Título de nivel por XP ───────────────────────────────── */
/**
 * getLevelTitle(xp) — Devuelve el objeto de título correspondiente al XP dado.
 * Incluye campo `next` con el siguiente título (o null si es el máximo).
 */
function getLevelTitle(xp) {
  let current = LEVEL_TITLES[0];
  for (let i = LEVEL_TITLES.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_TITLES[i].minXP) { current = LEVEL_TITLES[i]; break; }
  }
  const next = (current.idx < LEVEL_TITLES.length - 1)
    ? LEVEL_TITLES[current.idx + 1] : null;
  return { ...current, next };
}

/**
 * showTitleUpgradeModal(titleData) — Modal de celebración al subir de título.
 * Muestra el nuevo rango, descripción, y cuándo será el siguiente.
 */
function showTitleUpgradeModal(titleData) {
  const el = document.getElementById('m-title-upgrade');
  if (!el) return;
  const setT = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
  const setH = (id, v) => { const e = document.getElementById(id); if (e) e.innerHTML = v; };
  setT('ttu-icon',  titleData.icon);
  setT('ttu-title', titleData.title);
  setH('ttu-desc',  titleData.desc);
  const badgeEl = document.getElementById('ttu-badge');
  if (badgeEl) badgeEl.style.borderColor = titleData.color;
  const iconEl = document.getElementById('ttu-icon');
  if (iconEl) iconEl.style.textShadow = `0 0 30px ${titleData.color}`;
  if (titleData.next) {
    setH('ttu-next', `Siguiente rango: <strong>${titleData.next.icon} ${titleData.next.title}</strong> — desde ${titleData.next.minXP.toLocaleString('es')} XP`);
  } else {
    setT('ttu-next', '¡Has alcanzado el título máximo! Eres un referente.');
  }
  openModal('m-title-upgrade');
  confetti();
  if (typeof SFX !== 'undefined') SFX.levelUp();
  if (typeof HAPTIC !== 'undefined') HAPTIC.levelUp();
}

/**
 * checkTitleUpgrade() — Compara el título actual con el guardado en S.
 * Si ha subido de rango, muestra el modal de celebración.
 */
function checkTitleUpgrade() {
  S.currentTitleIdx = S.currentTitleIdx ?? 0;
  const titleData = getLevelTitle(S.xp);
  if (titleData.idx > S.currentTitleIdx) {
    S.currentTitleIdx = titleData.idx;
    saveState();
    // Delay para que el modal de módulo completado se cierre primero
    setTimeout(() => showTitleUpgradeModal(titleData), 1800);
  }
}
window.getLevelTitle = getLevelTitle;
window.checkTitleUpgrade = checkTitleUpgrade;
window.showTitleUpgradeModal = showTitleUpgradeModal;


/* ══════════════════════════════════════════════════════════════════
   P4-C — MISIONES SEMANALES
   Pool de 8 misiones, se generan 3 cada lunes, se resetean a las 00:00
══════════════════════════════════════════════════════════════════ */

const WEEKLY_MISSION_POOL = [
  { id:'wm_mods3',    label:'Completa 3 módulos esta semana',             icon:'📚', type:'mods',    goal:3,  xp:50  },
  { id:'wm_streak5',  label:'Consigue una racha de 5 días',               icon:'🔥', type:'streak',  goal:5,  xp:40  },
  { id:'wm_boss',     label:'Completa un Boss Battle sin fallos',          icon:'⚔️', type:'boss',    goal:1,  xp:60  },
  { id:'wm_tools3',   label:'Usa 3 herramientas distintas',               icon:'🛠️', type:'tools',   goal:3,  xp:35  },
  { id:'wm_branch',   label:'Completa todos los módulos de una rama',     icon:'🌿', type:'branch',  goal:1,  xp:80  },
  { id:'wm_quiz10',   label:'Responde 10 quizzes correctos seguidos',     icon:'🎯', type:'quiz',    goal:10, xp:45  },
  { id:'wm_speedrun', label:'Completa un módulo en Speedrun (<3 min)',    icon:'⚡', type:'speedrun',goal:1,  xp:50  },
  { id:'wm_perfect',  label:'Consigue puntuación perfecta en un quiz',    icon:'💯', type:'perfect', goal:1,  xp:30  },
];

/** Devuelve el ISO del lunes de la semana de 'date' */
function getMondayISO(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=dom
  const diff = (day === 0) ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().slice(0, 10);
}

/** Genera 3 misiones aleatorias (semilla basada en la fecha del lunes) */
function generateWeeklyMissions(mondayISO) {
  // Semilla determinista basada en la fecha
  let seed = mondayISO.replace(/-/g, '') | 0;
  function rng() { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; }
  const pool = [...WEEKLY_MISSION_POOL];
  const selected = [];
  while (selected.length < 3 && pool.length > 0) {
    const i = Math.floor(rng() * pool.length);
    selected.push({ ...pool[i], progress: 0, done: false });
    pool.splice(i, 1);
  }
  return selected;
}

/** Inicializa / resetea misiones si es nueva semana */
function initWeeklyMissions() {
  S.weeklyMissions     = S.weeklyMissions     ?? [];
  S.weeklyMissionsDate = S.weeklyMissionsDate ?? '';
  const monday = getMondayISO(new Date());
  if (S.weeklyMissionsDate !== monday) {
    S.weeklyMissions     = generateWeeklyMissions(monday);
    S.weeklyMissionsDate = monday;
    saveState();
  }
}

/** Actualiza el progreso de una misión por tipo y cantidad */
function tickMission(type, amount) {
  amount = amount || 1;
  S.weeklyMissions = S.weeklyMissions ?? [];
  let changed = false;
  S.weeklyMissions.forEach(function(m) {
    if (m.done) return;
    if (m.type !== type) return;
    m.progress = Math.min(m.goal, (m.progress || 0) + amount);
    if (m.progress >= m.goal) {
      m.done = true;
      S.xp = (S.xp || 0) + m.xp;
      checkTitleUpgrade();
      spawnXP('🏆 Misión completada · +' + m.xp + ' XP');
      toast('🏆 ' + m.label, 't-success');
      changed = true;
    }
  });
  if (changed) saveState();
  renderMissions();
}

/** Renderiza el panel de misiones semanales en #missions-list */
function renderMissions() {
  initWeeklyMissions();
  const list = document.getElementById('missions-list');
  const badge = document.getElementById('missions-xp-badge');
  const sub   = document.getElementById('missions-subtitle');
  const footer = document.getElementById('missions-footer');
  if (!list) return;

  const totalXP   = S.weeklyMissions.reduce((a, m) => a + m.xp, 0);
  const doneXP    = S.weeklyMissions.filter(m => m.done).reduce((a, m) => a + m.xp, 0);
  const doneCount = S.weeklyMissions.filter(m => m.done).length;

  if (sub)    sub.textContent  = doneCount + '/3 completadas';
  if (badge)  badge.textContent = '+' + doneXP + ' / +' + totalXP + ' XP';

  list.innerHTML = S.weeklyMissions.map(function(m) {
    const pct = Math.round(((m.progress || 0) / m.goal) * 100);
    const doneClass = m.done ? ' wm-done' : '';
    return `
      <div class="wm-item${doneClass}">
        <div class="wm-item-top">
          <span class="wm-icon">${m.icon}</span>
          <div class="wm-info">
            <div class="wm-label">${m.label}</div>
            <div class="wm-progress-row">
              <div class="wm-bar"><div class="wm-fill" style="width:${pct}%"></div></div>
              <span class="wm-counter">${m.progress || 0}/${m.goal}</span>
            </div>
          </div>
          <div class="wm-xp ${m.done ? 'wm-xp-done' : ''}">+${m.xp} XP</div>
        </div>
        ${m.done ? '<div class="wm-check">✓ Completada</div>' : ''}
      </div>`;
  }).join('');

  // Footer: días restantes hasta el lunes
  if (footer) {
    const now    = new Date();
    const monday = new Date(getMondayISO(now));
    monday.setDate(monday.getDate() + 7); // próximo lunes
    const diff   = Math.ceil((monday - now) / 86400000);
    footer.textContent = 'Se resetean en ' + diff + ' día' + (diff !== 1 ? 's' : '');
  }
}

/** Toggle panel de misiones */
function toggleMissionsPanel() {
  const body    = document.getElementById('missions-body');
  const chevron = document.getElementById('missions-chevron');
  if (!body) return;
  const open = body.style.display === 'none' || body.style.display === '';
  body.style.display   = open ? 'block' : 'none';
  if (chevron) chevron.textContent = open ? '▴' : '▾';
  if (open) renderMissions();
}

window.initWeeklyMissions   = initWeeklyMissions;
window.renderMissions       = renderMissions;
window.toggleMissionsPanel  = toggleMissionsPanel;
window.tickMission          = tickMission;
window.getMondayISO         = getMondayISO;

/** Resetea el progreso de misiones de un tipo (para misiones consecutivas) */
function resetMissionProgress(type) {
  if (!S.weeklyMissions) return;
  S.weeklyMissions.forEach(function(m) {
    if (m.done) return;
    if (m.type !== type) return;
    m.progress = 0;
  });
  renderMissions();
}
window.resetMissionProgress = resetMissionProgress;

/** Comprueba y tickea la misión de racha según el valor actual de S.streak */
function checkStreakMission() {
  if (!S.weeklyMissions) return;
  S.weeklyMissions.forEach(function(m) {
    if (m.done || m.type !== 'streak') return;
    // Sincroniza el progreso con el valor real de la racha
    const newProg = Math.min(m.goal, S.streak || 0);
    if (newProg > (m.progress || 0)) {
      m.progress = newProg;
      if (m.progress >= m.goal) {
        m.done = true;
        S.xp = (S.xp || 0) + m.xp;
        checkTitleUpgrade();
        spawnXP('🏆 Misión completada · +' + m.xp + ' XP');
        toast('🏆 ' + m.label, 't-success');
        saveState();
      }
    }
  });
  renderMissions();
}
window.checkStreakMission = checkStreakMission;

/** Comprueba si el examen final fue perfecto y tickea 'perfect' */
function checkPerfectExam() {
  if (!S.currentMod) return;
  const examSteps = (S.currentMod.steps || []).filter(s => s.type === 'exam_question');
  if (examSteps.length === 0) return;
  if (GAME.examScore >= examSteps.length) {
    tickMission('perfect', 1);
  }
}
window.checkPerfectExam = checkPerfectExam;

/** Registra una herramienta usada esta semana (solo cuenta nuevas) */
function tickMissionTool(toolId) {
  S.weeklyToolsUsed = S.weeklyToolsUsed ?? [];
  const monday = getMondayISO(new Date());
  // Resetear si es nueva semana
  if ((S.weeklyToolsDate || '') !== monday) {
    S.weeklyToolsUsed = [];
    S.weeklyToolsDate = monday;
  }
  if (!S.weeklyToolsUsed.includes(toolId)) {
    S.weeklyToolsUsed.push(toolId);
    tickMission('tools', 1);
  }
}
window.tickMissionTool = tickMissionTool;

function makeNumericControl(opts) {
  function smartStep(val) {
    if (val < 1000)   return opts.step || 50;
    if (val < 10000)  return opts.step || 100;
    if (val < 100000) return opts.step || 500;
    return opts.step || 1000;
  }

  var el = document.getElementById(opts.inputId);
  if (!el) return;

  if (!el.parentNode.classList.contains('num-ctrl-wrap')) {
    var wrap = document.createElement('div');
    wrap.className = 'num-ctrl-wrap';
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);

    var btnMinus = document.createElement('button');
    btnMinus.type = 'button';
    btnMinus.className = 'num-ctrl-btn num-ctrl-minus';
    btnMinus.textContent = '−';
    wrap.insertBefore(btnMinus, el);

    var btnPlus = document.createElement('button');
    btnPlus.type = 'button';
    btnPlus.className = 'num-ctrl-btn num-ctrl-plus';
    btnPlus.textContent = '+';
    wrap.appendChild(btnPlus);

    if (opts.suffix) {
      var suf = document.createElement('span');
      suf.className = 'num-ctrl-suffix';
      suf.textContent = opts.suffix;
      wrap.insertBefore(suf, btnPlus);
    }
  }

  function clamp(v) {
    return Math.min(opts.max || 9999999, Math.max(opts.min || 0, v));
  }

  function change(delta) {
    var cur = parseFloat(el.value) || 0;
    var step = smartStep(cur);
    var next = clamp(cur + delta * step);
    el.value = next;
    if (opts.onChange) opts.onChange(next);
  }

  function setupHold(btn, dir) {
    var _holdTimer = null;
    var _repeatTimer = null;
    var _speed = 320;
    var _running = false;

    function startHold(e) {
      if (_running) return;
      _running = true;
      if (e && e.cancelable) e.preventDefault();
      change(dir);
      _holdTimer = setTimeout(function loop() {
        change(dir);
        _speed = Math.max(90, _speed - 15);
        _repeatTimer = setTimeout(loop, _speed);
      }, 500);
    }

    function stopHold() {
      _running = false;
      clearTimeout(_holdTimer);
      clearTimeout(_repeatTimer);
      _holdTimer = null;
      _repeatTimer = null;
      _speed = 320;
    }

    btn.addEventListener('touchstart', startHold, { passive: false });
    btn.addEventListener('mousedown', function(e) {
      if ('ontouchstart' in window) return;
      startHold(e);
    });
    btn.addEventListener('touchend',    stopHold);
    btn.addEventListener('touchcancel', stopHold);
    btn.addEventListener('mouseup',     stopHold);
    btn.addEventListener('mouseleave',  stopHold);
  }

  var w = el.parentNode;
  var minus = w.querySelector('.num-ctrl-minus');
  var plus  = w.querySelector('.num-ctrl-plus');
  if (minus) setupHold(minus, -1);
  if (plus)  setupHold(plus,  +1);

  el.addEventListener('input', function() {
    if (opts.onChange) opts.onChange(parseFloat(el.value) || 0);
  });
}
window.makeNumericControl = makeNumericControl;


/* ══════════════════════════════════════════════════════════════════
   RANKING
══════════════════════════════════════════════════════════════════ */

/**
 * _calcPercentile — Calcula el percentil del jugador dentro de la comunidad.
 * ─────────────────────────────────────────────────────────────────
 * Basado en XP: si tienes 10.000 XP del máximo imaginado de 10.000,
 * estás en el percentil 99. La posición "ahead" indica cuántos usuarios
 * ha superado (número estimado sobre TOTAL_USERS).
 */
function _calcPercentile() {
  const TOTAL_USERS = 12450;
  const xpRank = Math.min(99, Math.round((S.xp / 10000) * 100));
  const ahead  = Math.round((xpRank / 100) * TOTAL_USERS);
  return { pct: xpRank, ahead };
}

/**
 * _getLiveRankings — Construye la lista de ranking con el jugador insertado.
 * ─────────────────────────────────────────────────────────────────
 * Los datos de RANKINGS son estáticos (jugadores ficticios con XP fijo).
 * Esta función inserta al jugador real en la posición que le corresponde
 * según su XP actual, recalculando todos los puestos.
 *
 * Así el jugador ve su posición real, no una posición hardcodeada.
 */
function _getLiveRankings() {
  const base  = RANKINGS.map((r, i) => ({ ...r, pos: i + 1, me: false }));
  const myXP  = S.xp || 0;
  const meRow = {
    n:   S.userName || 'Tú',
    em:  S.avatar   || '🌱',
    xp:  myXP,
    str: S.streak   || 0,
    cl:  '#00e5a0',
    me:  true,
    pos: 1,
  };
  const idx = base.findIndex(r => myXP > r.xp);
  if (idx >= 0) {
    base.splice(idx, 0, meRow);
  } else {
    base.push(meRow);
  }
  base.forEach((r, i) => { r.pos = i + 1; });
  return base;
}

/**
 * _updateMyRankPosition — Actualiza los elementos DOM del ranking del jugador.
 * Lee el ranking en vivo y escribe la posición y distancia al top 10.
 */
function _updateMyRankPosition() {
  const rankings = _getLiveRankings();
  const me       = rankings.find(r => r.me);
  if (!me) return;
  setEl('my-rank-pos', '#' + me.pos);
  const top10xp = rankings[9]?.xp || 0;
  const diff    = Math.max(0, top10xp - S.xp);
  setEl('xp-to-top10', diff > 0
    ? '+' + diff.toLocaleString('es') + ' XP'
    : '¡Ya estás en top 10!');
}


/* ══════════════════════════════════════════════════════════════════
   SIMULADOR DE NEGOCIOS
══════════════════════════════════════════════════════════════════ */

/**
 * calcBizRevenue — Ingresos mensuales de un negocio concreto.
 * ─────────────────────────────────────────────────────────────────
 * La fórmula base es:
 *   ingresos = monthlyRevenue × (1 + upgrades × 0.15)
 * Cada mejora comprada añade un 15% de ingresos.
 * Si el negocio es isVolatile (YouTube), los ingresos varían ±40% aleatoriamente
 * cada vez que se calculan (simula la viralidad).
 */
function calcBizRevenue(id) {
  const biz   = BUSINESSES.find(b => b.id === id);
  const owned = (S.businesses || {})[id];
  if (!biz || !owned) return 0;
  let rev = biz.monthlyRevenue || 0;
  const upgCount = (owned.upgrades || []).length;
  rev *= (1 + upgCount * 0.15);
  if (biz.isVolatile) rev *= (0.8 + Math.random() * 0.4); // ±40% de variabilidad
  return Math.round(rev);
}

/**
 * calcBizROI — ROI anual del negocio como porcentaje.
 * ROI = ((ingresosNetos × 12) / costeInicial) × 100
 */
function calcBizROI(id) {
  const biz = BUSINESSES.find(b => b.id === id);
  if (!biz || !biz.cost) return 0;
  const monthlyProfit = calcBizRevenue(id) - (biz.monthlyExpenses || 0);
  return parseFloat(((monthlyProfit * 12 / biz.cost) * 100).toFixed(1));
}

/**
 * calcPortfolioMarketValue — Valor de mercado real de la cartera.
 * Usa el precio live de GAME.stockPrices, no el coste de adquisición.
 * Esto es lo que el usuario vería si vendiese todo hoy.
 */
function calcPortfolioMarketValue() {
  return Object.entries(S.portfolio || {}).reduce((sum, [ticker, pos]) => {
    const livePrice = (GAME.stockPrices && GAME.stockPrices[ticker])
      || STOCKS.find(s => s.ticker === ticker)?.price
      || 0;
    return sum + livePrice * (pos.shares || 0);
  }, 0);
}

/**
 * recalcPatrimony — Recalcula S.patrimony con valor real de mercado.
 * Fórmula: cash disponible + valor mercado de acciones + valor residual de negocios (80% coste)
 * Sustituye a todos los `S.patrimony = S.cash + S.invested` del código.
 */
function recalcPatrimony() {
  const portfolioValue = calcPortfolioMarketValue();
  const bizValue = Object.keys(S.businesses || {}).reduce((sum, id) => {
    const biz = BUSINESSES.find(b => b.id === id);
    return sum + (biz ? (biz.cost || 0) * 0.8 : 0);
  }, 0);
  S.patrimony = Math.round((S.cash || 0) + portfolioValue + bizValue);
  return S.patrimony;
}

/**
 * isBusinessUnlocked — ¿Puede el jugador comprar este negocio?
 * Un negocio puede estar bloqueado por carrera requerida (senior/entrepreneur).
 * Si careerRequired es null o no definido, siempre está disponible.
 */
function isBusinessUnlocked(biz) {
  const req = biz.careerRequired || biz.requiredCareer;
  if (!req) return true;
  const reqs = Array.isArray(req) ? req : [req];
  return reqs.includes(S.career || 'junior');
}

/**
 * getBusinessLockReason — Texto descriptivo del motivo de bloqueo.
 * Devuelve string vacío si el negocio no está bloqueado.
 */
function getBusinessLockReason(biz) {
  const req = biz.careerRequired || biz.requiredCareer;
  if (!req) return '';
  const reqs  = Array.isArray(req) ? req : [req];
  const names = reqs.map(id => {
    const c = CAREERS.find(x => x.id === id);
    return c ? c.title : id;
  }).join(' o ');
  return `🔒 Requiere carrera: ${names}`;
}


/* ══════════════════════════════════════════════════════════════════
   INFLACIÓN DEL EFECTIVO
══════════════════════════════════════════════════════════════════ */

/**
 * getCashRealValue — Valor real (ajustado por inflación) del efectivo del jugador.
 * ─────────────────────────────────────────────────────────────────
 * El efectivo no invertido pierde valor cada año de juego (INFLATION_RATE = 2%).
 * Si llevas 10 años de juego con 5.000€ en cash:
 *   valor real = 5.000 / (1.02)^10 = 4.102€
 * Esto incentiva al jugador a invertir en lugar de acumular efectivo.
 */
function getCashRealValue() {
  const years = S.gameYear || 0;
  if (years === 0) return S.cash || 0;
  return Math.round((S.cash || 0) / Math.pow(1 + INFLATION_RATE, years));
}



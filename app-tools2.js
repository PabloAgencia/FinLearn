const SCENARIOS = [
  {
    id: 'debt_hell',
    icon: '🔥',
    name: 'Infierno de Deudas',
    tagline: 'Empiezas con €50.000 de deuda y 5 años para jubilarte. Sobrevive.',
    difficulty: '🔴 Extremo',
    startConditions: { cash: 800, balance: 0, invested: 0, lifeSalary: 1600,
      debts: [
        { name:'Préstamo personal', amount:15000, rate:12, minPayment:350 },
        { name:'Tarjeta revolving', amount:8000,  rate:24, minPayment:200 },
        { name:'Coche financiado',  amount:12000, rate:8,  minPayment:280 },
        { name:'Deuda familiar',    amount:15000, rate:0,  minPayment:300 },
      ]},
    objective: { type:'net_worth', target: 10000, label:'Patrimonio neto positivo de €10.000', gameDays: 5*365 },
    xpReward: 400,
    relatedTag: 'DEUDA',
    lesson: 'La deuda no es el fin del mundo. Con el método correcto, el orden importa más que los ingresos.',
    milestones: [{pct:30,label:'Deuda por debajo de €35.000',xp:120},{pct:60,label:'Deuda a la mitad',xp:180},{pct:85,label:'Casi libre de deudas',xp:250}],
  },
  {
    id: 'early_retirement',
    icon: '🏝️',
    name: 'FIRE a los 40',
    tagline: 'Tienes 25 años, €5.000 ahorrados y 15 años para alcanzar la independencia financiera.',
    difficulty: '🟡 Difícil',
    startConditions: { cash: 5000, balance: 2000, invested: 0, lifeSalary: 2200,
      monthlyContribution: 400 },
    objective: { type:'invested', target: 300000, label:'€300.000 invertidos', gameDays: 15*365 },
    xpReward: 500,
    relatedTag: 'FIRE',
    lesson: 'Con una tasa de ahorro del 40%+ y retornos compuestos, la jubilación anticipada es matemáticamente posible.',
    milestones: [{pct:25,label:'Primeros €75.000 invertidos',xp:150},{pct:55,label:'Más de la mitad del camino',xp:200},{pct:80,label:'FIRE a la vista',xp:300}],
  },
  {
    id: 'crisis_survivor',
    icon: '📉',
    name: 'Crisis del 2008',
    tagline: 'El mercado cae un 50%. Tu patrimonio se divide. Decide: ¿Vendes o aguantas?',
    difficulty: '🟠 Medio',
    startConditions: { cash: 3000, balance: 5000, invested: 16000, lifeSalary: 2800 },
    objective: { type:'patrimony_recover', target: 40000, label:'Recuperar €40.000 de patrimonio (partiste de €21.000 tras el crash)', gameDays: 3*365 },
    xpReward: 350,
    relatedTag: 'INVERSIÓN',
    lesson: 'El S&P 500 tardó 5 años en recuperar el crash de 2008. Quienes mantuvieron triplicaron en 10 años.',
    milestones: [{pct:40,label:'Superada la primera caída',xp:100},{pct:65,label:'Recuperando terreno',xp:150},{pct:85,label:'Casi recuperado',xp:200}],
  },
  {
    id: 'from_zero',
    icon: '🌱',
    name: 'De Cero al Primer Millón',
    tagline: 'Sin ahorros, sin inversiones, sin deudas. Solo tu sueldo. 30 años.',
    difficulty: '🟢 Normal',
    startConditions: { cash: 0, balance: 0, invested: 0, lifeSalary: 1800 },
    objective: { type:'patrimony', target: 500000, label:'€500.000 de patrimonio', gameDays: 30*365 },
    xpReward: 600,
    relatedTag: 'AHORRO',
    lesson: 'El tiempo es el activo más valioso. Empezar con nada a los 25 y ser millonario a los 55 es estadísticamente normal con DCA.',
    milestones: [{pct:10,label:'Primeros €50.000',xp:150},{pct:40,label:'€200.000 acumulados',xp:250},{pct:75,label:'El millón está cerca',xp:400}],
  },
  {
    id: 'entrepreneur',
    icon: '🚀',
    name: 'El Emprendedor',
    tagline: 'Tienes €20.000 y una idea. Sin sueldo fijo. Solo tus negocios.',
    difficulty: '🔴 Extremo',
    startConditions: { cash: 20000, balance: 0, invested: 0, lifeSalary: 0,
      career: 'entrepreneur' },
    objective: { type:'biz_income', target: 5000, label:'€5.000/mes de ingresos de negocios', gameDays: 5*365 },
    xpReward: 500,
    relatedTag: 'EMPRENDIMIENTO',
    lesson: 'El emprendedor apuesta todo al principio. El riesgo es real, pero la asimetría del retorno también.',
    milestones: [{pct:30,label:'€1.500/mes de negocios',xp:150},{pct:60,label:'€3.000/mes de negocios',xp:250},{pct:85,label:'Casi independiente',xp:350}],
  },
  {
    id: 'inheritance',
    icon: '💰',
    name: 'La Herencia Inesperada',
    tagline: 'Tu tío fallece y te deja €50.000. Tienes 3 años para no arruinarlo — y ojalá triplicarlo.',
    difficulty: '🟡 Difícil',
    startConditions: { cash: 50000, balance: 0, invested: 0, lifeSalary: 2200 },
    objective: { type:'patrimony', target: 120000, label:'€120.000 de patrimonio en 3 años', gameDays: 3*365 },
    xpReward: 450,
    relatedTag: 'INVERSIÓN',
    lesson: 'El dinero inesperado suele perderse en 3 años. La disciplina de invertirlo inmediatamente marca la diferencia.',
    milestones: [{pct:30,label:'€36.000 de patrimonio',xp:120},{pct:60,label:'€72.000 alcanzados',xp:180},{pct:85,label:'Casi en el objetivo',xp:220}],
  },
  {
    id: 'inflation_hell',
    icon: '📈',
    name: 'La Inflación del 10%',
    tagline: 'Es 2022. La inflación devora tus ahorros al 10% anual. ¿Qué activos te salvan?',
    difficulty: '🟠 Medio',
    startConditions: { cash: 8000, balance: 0, invested: 5000, lifeSalary: 2500 },
    objective: { type:'patrimony', target: 45000, label:'€45.000 de patrimonio preservado en 2 años', gameDays: 2*365 },
    xpReward: 380,
    relatedTag: 'INVERSIÓN',
    lesson: 'En 2022, el cash perdió un 10% de poder adquisitivo. El MSCI World cayó un 18% pero el oro subió un 12%.',
    milestones: [{pct:40,label:'€18.000 de patrimonio',xp:100},{pct:70,label:'€31.500 alcanzados',xp:150},{pct:90,label:'Casi preservado',xp:180}],
  },
  {
    id: 'divorce',
    icon: '💔',
    name: 'Reconstrucción',
    tagline: 'Tu patrimonio se divide a la mitad. €15.000 y un sueldo de €2.000. Reconstruye en 5 años.',
    difficulty: '🔴 Extremo',
    startConditions: { cash: 15000, balance: 0, invested: 0, lifeSalary: 2000,
      debts: [{ name:'Préstamo personal', amount:8000, rate:7, minPayment:180 }] },
    objective: { type:'patrimony', target: 60000, label:'€60.000 de patrimonio en 5 años', gameDays: 5*365 },
    xpReward: 550,
    relatedTag: 'AHORRO',
    lesson: 'Reconstruir desde cero con 35-45 años es posible. La clave: eliminar deuda primero, automatizar ahorro después.',
    milestones: [{pct:25,label:'Deuda cancelada',xp:150},{pct:55,label:'€33.000 reconstruidos',xp:200},{pct:85,label:'Casi en el objetivo',xp:280}],
  },
];

let _activeScenario    = null;
let _scenarioState     = null;
let _scenarioGameState = null;
let _scenarioStartDay  = 0;

function openScenariosScreen() {
  if (!isPremium()) { PM_showPaywall('scenarios'); return; }
  let modal = document.getElementById('m-scenarios');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-scenarios';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const SCENARIO_LOCKS = {
    debt_hell:        null,
    from_zero:        null,
    crisis_survivor:  { type:'mods', count:5, tag:'inversion', label:'Completa 5 módulos de Inversión' },
    early_retirement: { type:'level', count:3, label:'Alcanza el nivel 3' },
    entrepreneur:     { type:'level', count:5, label:'Alcanza el nivel 5' },
    inheritance:      { type:'mods', count:3, label:'Completa 3 módulos' },
    inflation_hell:   { type:'mods', count:4, tag:'inversion', label:'Completa 4 módulos de Inversión' },
    divorce:          { type:'level', count:4, label:'Alcanza el nivel 4' },
  };

  const cards = SCENARIOS.map(sc => {
    const relMod = (typeof MODULES !== 'undefined' && sc.relatedTag)
      ? MODULES.find(m => m && m.tag && m.tag.toUpperCase().includes(sc.relatedTag) && !(S.completedMods||[]).includes(m.id))
      : null;
    const lock = SCENARIO_LOCKS[sc.id];
    let isLocked = false;
    if (lock) {
      if (lock.type === 'level') isLocked = (S.level||1) < lock.count;
      if (lock.type === 'mods') {
        const branch = lock.tag ? (typeof F28_BRANCHES !== 'undefined' ? F28_BRANCHES.find(b=>b.id===lock.tag) : null) : null;
        const relevant = branch ? branch.mods : [];
        const done = relevant.length > 0
          ? relevant.filter(id=>(S.completedMods||[]).includes(id)).length
          : (S.completedMods||[]).length;
        isLocked = done < lock.count;
      }
    }
    const alreadyDone = (S.completedScenarios||[]).includes(sc.id);
    return `
    <div class="scenario-card${isLocked?' sc-locked':''}${alreadyDone?' sc-done':''}" onclick="${isLocked?'':'openScenarioBriefing(\''+sc.id+'\')'}">
      <div class="sc-header">
        <span class="sc-icon">${sc.icon}</span>
        <div>
          <div class="sc-name">${sc.name}</div>
          <div class="sc-diff">${sc.difficulty}</div>
        </div>
        <div class="sc-xp">${alreadyDone?'<span class="sc-done-badge">✓ Completado</span>':''} +${sc.xpReward} XP</div>
      </div>
      <div class="sc-tagline">${sc.tagline}</div>
      <div class="sc-obj">🎯 ${sc.objective.label}</div>
      ${isLocked ? `<div style="font-size:11px;color:var(--text3);margin-top:8px;">🔒 ${lock.label}</div>` : ''}
      ${relMod && !isLocked ? `<div onclick="event.stopPropagation();openModule(${relMod.id})" style="font-size:11px;color:var(--accent);margin-top:6px;cursor:pointer;">📖 Repasar: ${relMod.title} →</div>` : ''}
      ${!isLocked && !alreadyDone ? `<button class="sc-start-btn" onclick="event.stopPropagation();openScenarioBriefing('${sc.id}')">▶ Ver detalles e iniciar</button>` : ''}
    </div>`;
  }).join('');

  modal.innerHTML = `
    <div class="modal-box" style="max-width:420px;max-height:85vh;overflow-y:auto;">
      <button class="modal-close" onclick="document.getElementById('m-scenarios').style.display='none'">✕</button>
      <div style="text-align:center;font-size:36px;">⚡</div>
      <div class="h2 text-center mb4">Retos de Escenario</div>
      <div style="font-size:12px;color:var(--text2);text-align:center;margin-bottom:20px;">
        Partidas rápidas con condiciones únicas. Tu progreso principal no se ve afectado.
      </div>
      ${cards}
    </div>`;
  modal.style.display = 'flex';
}

function openScenarioBriefing(scenarioId) {
  const sc = SCENARIOS.find(s => s.id === scenarioId);
  if (!sc) return;

  // Cerrar modal de lista
  const listModal = document.getElementById('m-scenarios');
  if (listModal) listModal.style.display = 'none';

  const conds = sc.startConditions;
  const totalDebt = Array.isArray(conds.debts)
    ? conds.debts.reduce((a, d) => a + (d.amount || d.balance || 0), 0)
    : 0;

  const condRows = [
    conds.cash    !== undefined ? `<div class="scb-cond-row"><span class="scb-cond-icon">💰</span><span>Efectivo inicial</span><strong>€${(conds.cash).toLocaleString('es')}</strong></div>` : '',
    conds.balance !== undefined && conds.balance > 0 ? `<div class="scb-cond-row"><span class="scb-cond-icon">🏦</span><span>Cuenta corriente</span><strong>€${(conds.balance).toLocaleString('es')}</strong></div>` : '',
    conds.invested !== undefined && conds.invested > 0 ? `<div class="scb-cond-row"><span class="scb-cond-icon">📈</span><span>Cartera invertida</span><strong>€${(conds.invested).toLocaleString('es')}</strong></div>` : '',
    conds.lifeSalary !== undefined ? `<div class="scb-cond-row"><span class="scb-cond-icon">💼</span><span>Sueldo mensual</span><strong>${conds.lifeSalary > 0 ? '€'+conds.lifeSalary.toLocaleString('es') : 'Sin sueldo fijo'}</strong></div>` : '',
    totalDebt > 0 ? `<div class="scb-cond-row scb-cond-danger"><span class="scb-cond-icon">💳</span><span>Deuda total</span><strong>−€${totalDebt.toLocaleString('es')}</strong></div>` : '',
  ].filter(Boolean).join('');

  const patrimonyNet = (conds.cash || 0) + (conds.balance || 0) + (conds.invested || 0) - totalDebt;

  let modal = document.getElementById('m-scenario-briefing');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-scenario-briefing';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-box scb-box">
      <button class="modal-close" onclick="document.getElementById('m-scenario-briefing').style.display='none'">✕</button>
      <div class="scb-top">
        <div class="scb-big-icon">${sc.icon}</div>
        <div>
          <div class="scb-title">${sc.name}</div>
          <div class="scb-diff">${sc.difficulty}</div>
        </div>
      </div>
      <div class="scb-story">${sc.tagline}</div>
      <div class="scb-section-label">📋 CONDICIONES INICIALES</div>
      <div class="scb-conditions">${condRows}
        <div class="scb-cond-row scb-cond-net" style="margin-top:8px;border-top:1px solid rgba(255,255,255,.08);padding-top:8px;">
          <span class="scb-cond-icon">⚖️</span><span>Patrimonio neto</span>
          <strong style="color:${patrimonyNet >= 0 ? 'var(--accent)' : 'var(--danger)'};">€${patrimonyNet.toLocaleString('es')}</strong>
        </div>
      </div>
      <div class="scb-section-label">🎯 OBJETIVO</div>
      <div class="scb-obj-box">${sc.objective.label}</div>
      <div class="scb-section-label">💡 LECCIÓN DEL RETO</div>
      <div class="scb-lesson">${sc.lesson}</div>
      <div class="scb-reward">+${sc.xpReward} XP al completar el reto</div>
      <button class="btn btn-primary btn-block scb-start-btn" onclick="document.getElementById('m-scenario-briefing').style.display='none'; startScenario('${sc.id}')">
        ⚡ ¡Empezar el reto!
      </button>
      <button class="btn btn-ghost btn-block btn-sm" style="margin-top:8px;" onclick="document.getElementById('m-scenario-briefing').style.display='none'">
        Cancelar
      </button>
    </div>`;
  modal.style.display = 'flex';
}

function startScenario(scenarioId) {
  const sc = SCENARIOS.find(s => s.id === scenarioId);
  if (!sc) return;
  const listModal = document.getElementById('m-scenarios');
  if (listModal) listModal.style.display = 'none';

  // Save current state snapshot
  _scenarioState    = JSON.parse(JSON.stringify(S));
  _activeScenario   = sc;
  _scenarioStartDay = S.gameDay;

  // Apply scenario start conditions — FULL ISOLATION
  const conds = JSON.parse(JSON.stringify(sc.startConditions));
  // Normalize debts
  if (Array.isArray(conds.debts)) {
    conds.debts = conds.debts.map((d, i) => ({
      id: Date.now() + i,
      name: d.name,
      balance: d.balance ?? d.amount ?? 0,
      rate: d.rate ?? 0,
      minPayment: d.minPayment ?? d.payment ?? 0,
    }));
  }

  // Save GAME state too (stock prices affect portfolio value)
  _scenarioGameState = JSON.parse(JSON.stringify({
    stockPrices: GAME.stockPrices,
    priceHistory: GAME.priceHistory,
  }));

  // Reset ALL financial state to scenario conditions
  // Portfolio = empty (scenario defines invested as a number, not holdings)
  S.portfolio   = conds.portfolio || {};
  S.mortgages   = conds.mortgages || [];
  S.businesses  = conds.businesses || [];
  S.debts       = conds.debts || [];
  S.cash        = conds.cash ?? 1000;
  S.balance     = conds.balance ?? 0;
  S.invested    = conds.invested ?? 0;
  S.lifeSalary  = conds.lifeSalary ?? 1800;
  if (conds.career) S.career = conds.career;
  S.yearBizIncome = 0;
  recalcPatrimony();

  saveState();

  // Navegar al home y refrescar toda la UI para que refleje el nuevo estado
  if (typeof goTo === 'function') goTo('home');
  if (typeof refreshUI === 'function') refreshUI();
  else if (typeof updateUIFromState === 'function') updateUIFromState();

  setTimeout(() => {
    toast(`${sc.icon} Escenario iniciado`, sc.name + ' — ¡Buena suerte!', 't-success');
    HAPTIC.levelUp();
    SFX.levelUp();
    // Show objective banner
    _showScenarioBanner(sc);
  }, 300);
}

function toggleScenarioBanner() {
  const banner = document.getElementById('scenario-banner');
  if (!banner) return;
  const isCollapsed = banner.classList.toggle('sc-collapsed');
  const btn = banner.querySelector('.sc-hud-toggle');
  if (btn) btn.textContent = isCollapsed ? '+' : '–';
  // Ajustar posición del FAB
  const fab = document.getElementById('finai-fab');
  if (fab) fab.style.bottom = isCollapsed ? '102px' : '136px';
}

function _showScenarioBanner(sc) {
  let banner = document.getElementById('scenario-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'scenario-banner';
    banner.className = 'scenario-banner';
    document.body.appendChild(banner);
  }
  _updateScenarioBanner(sc);
  banner.style.display = 'flex';
  // Add scenario overlay class to body for visual mode
  document.body.classList.add('scenario-active');
}

function _updateScenarioBanner(sc) {
  const banner = document.getElementById('scenario-banner');
  if (!banner || !sc) return;
  const obj = sc.objective;
  const daysLeft = Math.max(0, (obj.gameDays || 365) - (S.gameDay - _scenarioStartDay));
  const yearsLeft = (daysLeft / 365).toFixed(1);

  // Progress toward objective
  let progress = 0;
  if (obj.type === 'net_worth')      progress = Math.max(0, (S.patrimony - (S.debts||[]).reduce((a,d)=>a+(d.balance||0),0))) / obj.target;
  else if (obj.type === 'invested')  progress = (S.invested||0) / obj.target;
  else if (obj.type === 'patrimony') progress = (S.patrimony||0) / obj.target;
  else if (obj.type === 'patrimony_recover') progress = (S.patrimony||0) / obj.target;
  else if (obj.type === 'biz_income') progress = ((S.yearBizIncome||0)/12) / obj.target;
  progress = Math.min(1, Math.max(0, progress));
  const pct = Math.round(progress * 100);

  banner.innerHTML = `
    <div class="sc-hud-left">
      <span class="sc-hud-icon">${sc.icon}</span>
      <div>
        <div class="sc-hud-name">${sc.name}</div>
        <div class="sc-hud-obj">${sc.objective.label}</div>
      </div>
    </div>
    <div class="sc-hud-center">
      <div class="sc-hud-pct">${pct}%</div>
      <div class="sc-hud-bar-wrap" style="position:relative;">
        <div class="sc-hud-bar" style="width:${pct}%"></div>
        ${(sc.milestones||[]).map(m=>`<div style="position:absolute;top:-4px;left:${m.pct}%;width:2px;height:calc(100% + 8px);background:${pct>=m.pct?'var(--accent)':'rgba(255,255,255,.3)'};border-radius:1px;" title="${m.label}"></div>`).join('')}
      </div>
      <div class="sc-hud-time">⏱ ${yearsLeft}a restantes</div>
    </div>
    <div style="display:flex;gap:6px;flex-shrink:0;">
      <button onclick="toggleScenarioBanner()" class="sc-hud-toggle" title="Minimizar">–</button>
      <button onclick="endScenario(false)" class="sc-hud-exit" title="Salir del reto">✕</button>
    </div>`;
}

function _triggerScenarioEvent(sc) {
  const events = {
    debt_hell: [{ q:'¿Qué deuda atacas primero?', opts:[
      { label:'La de mayor interés (tarjeta 24% TAE)', xp:80, effect: s => { const d = s.debts.find(x=>x.rate>=20); if(d) d.balance = Math.max(0, d.balance - 800); } },
      { label:'La más pequeña (efecto psicológico)', xp:40, effect: s => { const d = s.debts.slice().sort((a,b)=>a.balance-b.balance)[0]; if(d) d.balance = Math.max(0, d.balance - 500); } },
      { label:'Pago mínimo a todas', xp:10, effect: ()=>{} },
    ]}],
    early_retirement: [{ q:'El mercado cae un 20%. ¿Qué haces?', opts:[
      { label:'Compro más, es una oportunidad', xp:100, effect: s => { s.invested = (s.invested||0) * 0.8 + 2000; } },
      { label:'Mantengo mi DCA sin cambios', xp:60, effect: ()=>{} },
      { label:'Espero a que se estabilice', xp:0, effect: s => { s.invested = (s.invested||0) * 0.8; } },
    ]}],
    from_zero: [{ q:'Recibes un bonus de €1.000. ¿Qué haces?', opts:[
      { label:'Todo al fondo de emergencia primero', xp:70, effect: s => { s.cash = (s.cash||0) + 1000; } },
      { label:'70% invertir, 30% fondo emergencia', xp:100, effect: s => { s.invested = (s.invested||0) + 700; s.cash = (s.cash||0) + 300; } },
      { label:'Me lo gasto, me lo merezco', xp:0, effect: ()=>{} },
    ]}],
    crisis_survivor: [{ q:'El mercado se desploma un 40%. Tu cartera vale la mitad. ¿Qué haces?', opts:[
      { label:'Compro más con todo el efectivo disponible', xp:100, effect: s => { const extra = Math.min(s.cash||0, 3000); s.cash = (s.cash||0) - extra; s.invested = (s.invested||0) * 0.6 + extra; } },
      { label:'Mantengo y no miro la cartera', xp:70, effect: s => { s.invested = (s.invested||0) * 0.6; } },
      { label:'Vendo todo para no perder más', xp:0, effect: s => { s.cash = (s.cash||0) + (s.invested||0) * 0.6; s.invested = 0; } },
    ]}],
    entrepreneur: [{ q:'Tu primer cliente te ofrece €5.000 por trabajo puntual. ¿Cómo lo usas?', opts:[
      { label:'Reinvierto el 80% en marketing y herramientas', xp:100, effect: s => { s.invested = (s.invested||0) + 4000; s.cash = (s.cash||0) + 1000; } },
      { label:'Lo guardo como colchón de emergencia empresarial', xp:60, effect: s => { s.cash = (s.cash||0) + 5000; } },
      { label:'Me lo pago como sueldo', xp:20, effect: s => { s.cash = (s.cash||0) + 5000; } },
    ]}],
    inheritance: [
      { q:'Tienes €50.000. ¿Cuál es tu primer movimiento?', opts:[
        { label:'Fondo emergencia (€10k) + invertir el resto en MSCI World', xp:120, effect: s => { s.cash = 10000; s.invested = (s.invested||0) + 40000; } },
        { label:'Todo en inmueble para alquilar', xp:60, effect: s => { s.invested = (s.invested||0) + 50000; } },
        { label:'Diversifico: €20k ETF, €15k depósito, €15k guardado', xp:90, effect: s => { s.cash = 15000; s.invested = (s.invested||0) + 20000; } },
      ]},
      { q:'El mercado sube un 25%. Tus amigos te dicen que vendas y te vayas de vacaciones.', opts:[
        { label:'Mantengo. El largo plazo es el plan.', xp:100, effect: s => { s.invested = (s.invested||0) * 1.25; } },
        { label:'Vendo un 20% para asegurar beneficios', xp:50, effect: s => { const v=(s.invested||0)*0.2*1.25; s.cash=(s.cash||0)+v; s.invested=(s.invested||0)*0.8*1.25; } },
        { label:'Vendo todo. Prefiero no arriesgar.', xp:0, effect: s => { s.cash=(s.cash||0)+(s.invested||0)*1.25; s.invested=0; } },
      ]},
    ],
    inflation_hell: [
      { q:'La inflación está al 10%. Tienes €8.000 en cuenta corriente. ¿Qué haces?', opts:[
        { label:'Muevo todo a un ETF de commodities y oro', xp:110, effect: s => { s.invested=(s.invested||0)+6000; s.cash=(s.cash||0)-6000; } },
        { label:'Lo dejo en el banco, es lo más seguro', xp:0, effect: s => { s.cash=(s.cash||0)*0.90; } },
        { label:'Compro un fondo monetario al 3.5%', xp:70, effect: s => { s.cash=(s.cash||0)*0.97; s.invested=(s.invested||0)+3000; } },
      ]},
    ],
    divorce: [
      { q:'Tienes €15.000 y una deuda de €8.000 al 7%. ¿Orden de prioridad?', opts:[
        { label:'Cancelo la deuda primero (garantiza 7% de retorno)', xp:120, effect: s => { const d=s.debts&&s.debts[0]; if(d){d.balance=0;} s.cash=(s.cash||0)-8000; } },
        { label:'Invierto todo en ETFs y pago mínimos de deuda', xp:40, effect: s => { s.invested=(s.invested||0)+15000; } },
        { label:'Mitad a deuda, mitad a fondo emergencia', xp:90, effect: s => { const d=s.debts&&s.debts[0]; if(d){d.balance=Math.max(0,d.balance-4000);} s.cash=Math.max(0,(s.cash||0)-4000); } },
      ]},
    ],
  };
  const pool = events[sc.id];
  if (!pool) return;
  const ev = pool[Math.floor(Math.random() * pool.length)];
  let modal = document.getElementById('m-scenario-event');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-scenario-event';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `<div class="modal-box" style="max-width:380px;text-align:center;">
    <div style="font-size:32px;margin-bottom:8px;">⚡</div>
    <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:16px;margin-bottom:6px;">Decisión del escenario</div>
    <div style="font-size:13px;color:var(--text2);margin-bottom:16px;">${ev.q}</div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      ${ev.opts.map(o => `<button class="btn btn-secondary" onclick="(${o.effect.toString()})(S);S.xp+=${o.xp};if(${o.xp}>0)spawnXP('+${o.xp} XP');saveState();updateUIFromState();document.getElementById('m-scenario-event').style.display='none';toast('✅ Decisión tomada','+${o.xp} XP','t-success');">${o.label}${o.xp>0?` <span style="color:var(--accent);font-size:10px;">+${o.xp}XP</span>`:''}</button>`).join('')}
    </div>
  </div>`;
  modal.style.display = 'flex';
}

function _checkScenarioCompletion() {
  if (!_activeScenario) return;
  const sc  = _activeScenario;
  const obj = sc.objective;
  let achieved = false;

  if (obj.type === 'net_worth')        achieved = (S.patrimony - (S.debts||[]).reduce((a,d)=>a+(d.balance||d.amount||0),0)) >= obj.target;
  else if (obj.type === 'invested')    achieved = (S.invested || 0) >= obj.target;
  else if (obj.type === 'patrimony')   achieved = (S.patrimony || 0) >= obj.target;
  else if (obj.type === 'patrimony_recover') achieved = (S.patrimony || 0) >= obj.target;
  else if (obj.type === 'biz_income')  achieved = (S.yearBizIncome || 0) / 12 >= obj.target;

  const daysElapsed = S.gameDay - _scenarioStartDay;
  const failed      = daysElapsed > obj.gameDays;

  // Progress toward objective (for milestones)
  let progress = 0;
  if (obj.type === 'net_worth')           progress = Math.max(0, (S.patrimony - (S.debts||[]).reduce((a,d)=>a+(d.balance||0),0))) / obj.target;
  else if (obj.type === 'invested')       progress = (S.invested||0) / obj.target;
  else if (obj.type === 'patrimony')      progress = (S.patrimony||0) / obj.target;
  else if (obj.type === 'patrimony_recover') progress = (S.patrimony||0) / obj.target;
  else if (obj.type === 'biz_income')     progress = ((S.yearBizIncome||0)/12) / obj.target;
  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);

  // Hitos intermedios
  if (!Array.isArray(S._scenarioMilestones)) S._scenarioMilestones = [];
  (sc.milestones || []).forEach(function(m) {
    const key = sc.id + '_' + m.pct;
    if (pct >= m.pct && !S._scenarioMilestones.includes(key)) {
      S._scenarioMilestones.push(key);
      S.xp += m.xp;
      F34_onXPGained(m.xp);
      spawnXP('+' + m.xp + ' XP');
      toast('🎯 ' + m.label, 'Hito alcanzado · +' + m.xp + ' XP', 't-success');
      saveState();
    }
  });

  // Decision events every 15 game days
  const lastEvent = S._lastScenarioEventDay || 0;
  if (daysElapsed > 0 && (daysElapsed - lastEvent) >= 15) {
    S._lastScenarioEventDay = daysElapsed;
    _triggerScenarioEvent(sc);
  }

  // Don't allow instant win — min 3 game days must pass
  if (daysElapsed < 3) return;

  if (achieved) {
    endScenario(true);
  } else if (failed) {
    toast(`💀 Escenario fallado`, `No alcanzaste el objetivo a tiempo. +100 XP por intentarlo.`, 't-danger');
    endScenario(false);
  }
}

function endScenario(won) {
  if (!_activeScenario) return;
  const sc = _activeScenario;

  // Calcular XP total ganado durante el escenario (milestones + victoria/derrota)
  const _preScenarioXP  = _scenarioState ? (_scenarioState.xp || 0) : (S.xp || 0);
  const _milestoneXP    = Math.max(0, (S.xp || 0) - _preScenarioXP);
  const _wonScenario    = won;
  const _xpReward       = won ? sc.xpReward : 100; // 100 XP consolación si falla
  const _scenarioId     = sc.id;
  const _totalXPGained  = _milestoneXP + _xpReward;

  if (won) {
    confetti(); setTimeout(confetti, 400); setTimeout(confetti, 800);
    HAPTIC.levelUp(); SFX.levelUp();
    toast(`🏆 ¡Escenario completado!`, `${sc.name} · +${sc.xpReward} XP · "${sc.lesson}"`, 't-success');
  }

  // Restore original state (full isolation restore)
  if (_scenarioState) {
    Object.assign(S, _scenarioState);
    S.portfolio  = _scenarioState.portfolio  || {};
    S.mortgages  = _scenarioState.mortgages  || [];
    S.businesses = _scenarioState.businesses || [];
    S.debts      = _scenarioState.debts      || [];
  }

  // Aplicar TODO el XP ganado DESPUÉS del restore para que no se pierda
  S.xp = (S.xp || 0) + _totalXPGained;
  if (_wonScenario) {
    if (!Array.isArray(S.completedScenarios)) S.completedScenarios = [];
    if (!S.completedScenarios.includes(_scenarioId)) S.completedScenarios.push(_scenarioId);
  }

  saveState();
  updateUIFromState();
  _activeScenario    = null;
  _scenarioState     = null;
  _scenarioGameState = null;
  S._lastScenarioEventDay = 0;
  S._scenarioMilestones   = [];
  saveState();

  const banner = document.getElementById('scenario-banner');
  if (banner) banner.style.display = 'none';
  document.body.classList.remove('scenario-active');

  checkAchievements();
}

/* ══════════════════════════════════════════════════════════════════
   S&P 500 HISTORICAL RETURNS — Datos reales anuales 1990-2024
   Compact array: ~35 años, ~280 bytes. Sin JSON externo.
   Fuente: Bloomberg / Macrotrends (retornos totales con dividendos)
══════════════════════════════════════════════════════════════════ */
const SP500_ANNUAL_RETURNS = {
  1990:-3.1, 1991:30.5, 1992:7.6,  1993:10.1, 1994:1.3,
  1995:37.6, 1996:23.0, 1997:33.4, 1998:28.6, 1999:21.0,
  2000:-9.1, 2001:-11.9,2002:-22.1,2003:28.7, 2004:10.9,
  2005:4.9,  2006:15.8, 2007:5.5,  2008:-37.0,2009:26.5,
  2010:15.1, 2011:2.1,  2012:16.0, 2013:32.4, 2014:13.7,
  2015:1.4,  2016:12.0, 2017:21.8, 2018:-4.4, 2019:31.5,
  2020:18.4, 2021:28.7, 2022:-18.1,2023:26.3, 2024:23.3,
};
const MSCI_WORLD_AVG = 9.2; // % annual avg 1990-2024 (conservative)
const SP500_AVG = 10.7;     // % annual avg 1990-2024 (with dividends)

/* ══════════════════════════════════════════════════════════════════
   WHAT IF SIMULATOR — "¿Y si hubieras invertido desde…?"
   ─────────────────────────────────────────────────────────────────
   · Compara "bajo el colchón" vs "S&P 500 con retornos reales"
   · Gráfico Chart.js con gradiente — línea gris vs línea verde
   · Botón de compartir en Instagram con canvas generado
   · Responde a Gemini: datos reales año a año, no promedio plano
══════════════════════════════════════════════════════════════════ */
let _whatIfChartInst = null;

function calcWhatIf(monthlyAmount, startYear, endYear) {
  const years = endYear - startYear;
  const mattress = []; // ahorrado sin invertir (inflación ~3%)
  const sp500    = []; // invertido en S&P 500
  const labels   = [];

  let mattressVal = 0;
  let sp500Val    = 0;

  for (let y = startYear; y <= endYear; y++) {
    const annual  = monthlyAmount * 12;
    const ret     = (SP500_ANNUAL_RETURNS[y] ?? SP500_AVG) / 100;
    // S&P: capital existente crece + aportar este año
    sp500Val    = sp500Val * (1 + ret) + annual;
    // Colchón: capital pierde 3% inflación + aportar este año
    mattressVal = mattressVal * 0.97 + annual;

    mattress.push(Math.round(mattressVal));
    sp500.push(Math.round(sp500Val));
    labels.push(y.toString());
  }

  return { mattress, sp500, labels, years,
           totalInvested: monthlyAmount * 12 * years,
           finalMattress: mattress[mattress.length-1],
           finalSP500:    sp500[sp500.length-1] };
}

function renderWhatIfChart() {
  const monthly   = parseInt(document.getElementById('wi-monthly')?.value  || 200);
  const startYear = parseInt(document.getElementById('wi-start')?.value    || 2000);
  const endYear   = new Date().getFullYear();

  const { mattress, sp500, labels, totalInvested, finalMattress, finalSP500 } = calcWhatIf(monthly, startYear, endYear);

  // Update summary numbers
  setEl('wi-invested-total', '€' + Math.round(totalInvested).toLocaleString('es'));
  setEl('wi-mattress-final', '€' + finalMattress.toLocaleString('es'));
  setEl('wi-sp500-final',    '€' + finalSP500.toLocaleString('es'));
  const multiplier = (finalSP500 / totalInvested).toFixed(1);
  setEl('wi-multiplier',     multiplier + '×');
  const diff = finalSP500 - finalMattress;
  setEl('wi-diff',           '+€' + diff.toLocaleString('es'));

  const canvas = document.getElementById('whatif-chart');
  if (!canvas) return;

  if (_whatIfChartInst) _whatIfChartInst.destroy();

  const ctx = canvas.getContext('2d');

  // Gradient for S&P500 line
  const grad = ctx.createLinearGradient(0, 0, 0, 280);
  grad.addColorStop(0,   'rgba(0,229,160,0.35)');
  grad.addColorStop(0.7, 'rgba(0,229,160,0.05)');
  grad.addColorStop(1,   'rgba(0,229,160,0)');

  // Gradient for mattress line
  const gradGray = ctx.createLinearGradient(0, 0, 0, 280);
  gradGray.addColorStop(0,   'rgba(100,100,120,0.2)');
  gradGray.addColorStop(1,   'rgba(100,100,120,0)');

  _whatIfChartInst = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: '📈 S&P 500',
          data: sp500,
          borderColor: '#00e5a0',
          backgroundColor: grad,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.4,
          fill: true,
        },
        {
          label: '🛏️ Bajo el colchón',
          data: mattress,
          borderColor: 'rgba(150,150,170,0.7)',
          backgroundColor: gradGray,
          borderWidth: 2,
          borderDash: [5, 3],
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          labels: { color: 'rgba(255,255,255,.55)', font: { size: 11 }, boxWidth: 20 },
        },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.dataset.label}: €${Math.round(ctx.parsed.y).toLocaleString('es')}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color:'rgba(255,255,255,.35)', font:{size:9}, maxTicksLimit: 7 },
          grid:  { color:'rgba(255,255,255,.04)' },
        },
        y: {
          ticks: {
            color:'rgba(255,255,255,.35)', font:{size:9},
            callback: v => '€' + (v >= 1000000 ? (v/1000000).toFixed(1)+'M' : v >= 1000 ? (v/1000).toFixed(0)+'k' : v),
          },
          grid: { color:'rgba(255,255,255,.05)' },
        },
      },
    },
  });
}

function shareWhatIf() {
  HAPTIC.medium();
  const monthly   = document.getElementById('wi-monthly')?.value || 200;
  const startYear = document.getElementById('wi-start')?.value   || 2000;
  const endYear   = new Date().getFullYear();
  const { finalSP500, totalInvested } = calcWhatIf(parseInt(monthly), parseInt(startYear), endYear);
  const mult = (finalSP500 / totalInvested).toFixed(1);

  const canvas = document.createElement('canvas');
  canvas.width  = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  // BG
  const bg = ctx.createLinearGradient(0, 0, 1080, 1080);
  bg.addColorStop(0, '#060810'); bg.addColorStop(1, '#0d1420');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, 1080, 1080);

  // Orb
  const orb = ctx.createRadialGradient(200, 300, 0, 200, 300, 600);
  orb.addColorStop(0, 'rgba(0,229,160,0.15)'); orb.addColorStop(1, 'transparent');
  ctx.fillStyle = orb; ctx.fillRect(0, 0, 1080, 1080);

  // Logo
  ctx.fillStyle = 'rgba(255,255,255,.4)';
  ctx.font = '700 32px system-ui'; ctx.letterSpacing = '3px';
  ctx.fillText('FINLEARN', 80, 80);

  // Title
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.font = '500 40px system-ui';
  ctx.letterSpacing = '0px';
  ctx.fillText(`¿Y si hubieras invertido €${monthly}/mes desde ${startYear}?`, 80, 200);

  // The "if only" number
  ctx.fillStyle = '#00e5a0'; ctx.font = 'bold 130px system-ui';
  ctx.fillText('€' + Math.round(finalSP500).toLocaleString('es'), 80, 380);

  ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.font = '500 40px system-ui';
  ctx.fillText('invirtiendo en S&P 500 · retornos reales históricos', 80, 440);

  // Divider
  ctx.strokeStyle = 'rgba(0,229,160,.3)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(80, 500); ctx.lineTo(1000, 500); ctx.stroke();

  // Stats
  ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.font = '500 34px system-ui';
  ctx.fillText('Aportado total', 80, 580);
  ctx.fillStyle = '#fff'; ctx.font = 'bold 54px system-ui';
  ctx.fillText('€' + Math.round(totalInvested).toLocaleString('es'), 80, 650);

  ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.font = '500 34px system-ui';
  ctx.fillText('Multiplicador', 600, 580);
  ctx.fillStyle = '#f0b429'; ctx.font = 'bold 54px system-ui';
  ctx.fillText(mult + '×', 600, 650);

  ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.font = '500 34px system-ui';
  ctx.fillText('Bajo el colchón habrías tenido', 80, 740);
  ctx.fillStyle = 'rgba(150,150,170,.9)'; ctx.font = 'bold 54px system-ui';
  ctx.fillText('€' + Math.round(calcWhatIf(parseInt(monthly), parseInt(startYear), endYear).finalMattress).toLocaleString('es'), 80, 800);

  ctx.fillStyle = '#00e5a0'; ctx.font = 'bold 80px system-ui';
  const saved = finalSP500 - calcWhatIf(parseInt(monthly), parseInt(startYear), endYear).finalMattress;
  ctx.fillText('+€' + Math.round(saved).toLocaleString('es') + ' de diferencia', 80, 920);

  ctx.fillStyle = 'rgba(255,255,255,.15)'; ctx.font = '500 28px system-ui';
  ctx.fillText('finlearn.app · Empieza hoy. El tiempo compuesto no espera.', 80, 1020);

  // Share or download
  if (navigator.share && navigator.canShare) {
    canvas.toBlob(async blob => {
      const file = new File([blob], 'finlearn-whatif.png', { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ title: '¿Y si hubiera invertido?', files: [file] });
        return;
      }
      _downloadCard(canvas, 'finlearn-whatif.png');
    }, 'image/png');
  } else {
    _downloadCard(canvas, 'finlearn-whatif.png');
    toast('📸 Imagen guardada', 'El poder del interés compuesto, listo para compartir', 't-success');
  }
}

function _downloadCard(canvas, filename) {
  const a = document.createElement('a');
  a.download = filename; a.href = canvas.toDataURL('image/png'); a.click();
}


/* ══════════════════════════════════════════════════════════════════
   FIRE CALCULATOR — ¿Cuándo puedes jubilarte?
   ─────────────────────────────────────────────────────────────────
   Regla del 4% (Bengen): necesitas 25× tus gastos anuales.
   FIRE Number = gastos_anuales × 25
   Años hasta FIRE = calculado con interés compuesto mensual
══════════════════════════════════════════════════════════════════ */
function calcFireYears(currentSavings, monthlyContrib, annualReturn, fireNumber) {
  if (monthlyContrib <= 0) return 999;
  const r = annualReturn / 100 / 12;
  let balance = currentSavings;
  let months  = 0;
  while (balance < fireNumber && months < 600) {
    balance = balance * (1 + r) + monthlyContrib;
    months++;
  }
  return months / 12;
}

function renderFireCalc() {
  const monthlyExp  = parseFloat(document.getElementById('fire-expenses')?.value   || 2000);
  const monthlyInv  = parseFloat(document.getElementById('fire-monthly-inv')?.value || 500);
  const annualRet   = parseFloat(document.getElementById('fire-return')?.value      || 7);
  const currentSav  = S.patrimony || 0;
  const fireNumber  = monthlyExp * 12 * 25;
  const years       = calcFireYears(currentSav, monthlyInv, annualRet, fireNumber);
  const currentAge  = S.age || 30;
  const fireAge     = Math.round(currentAge + years);
  const savingsRate = Math.round(monthlyInv / (S.income || 2000) * 100);

  setEl('fire-number-display',  '€' + Math.round(fireNumber).toLocaleString('es'));
  setEl('fire-years-display',   years > 99 ? '∞' : years.toFixed(1) + ' años');
  setEl('fire-age-display',     years > 99 ? 'Nunca a este ritmo' : 'A los ' + fireAge + ' años');
  setEl('fire-savings-rate',    savingsRate + '%');
  setEl('fire-current',         '€' + Math.round(currentSav).toLocaleString('es'));

  const bar = document.getElementById('fire-progress-bar');
  if (bar) {
    const pct = Math.min((currentSav / fireNumber) * 100, 100);
    bar.style.width = pct + '%';
    setEl('fire-progress-pct', pct.toFixed(1) + '%');
  }

  // Motivation message
  let msg = '';
  if (years <= 10)      msg = '🔥 ¡Estás en camino al FIRE temprano! Eres del top 1%.';
  else if (years <= 20) msg = '💪 Muy buen ritmo. Aumenta la aportación mensual para acortar.';
  else if (years <= 35) msg = '📈 Ritmo estándar. Cada €100 más al mes reduce ~2 años.';
  else                   msg = '⚠️ A este ritmo la jubilación llega tarde. Revisa tus gastos e ingresos.';
  setEl('fire-motivation', msg);

  // Show what happens with +100€/mes
  const yearsWith100 = calcFireYears(currentSav, monthlyInv + 100, annualRet, fireNumber);
  const diffYears = (years - yearsWith100).toFixed(1);
  setEl('fire-extra-100', `+€100/mes = ${diffYears} años menos`);
}


/* ══════════════════════════════════════════════════════════════════
   STREAMER MODE — Oculta números reales con % y barras
   ─────────────────────────────────────────────────────────────────
   · Toggle global que envuelve todos los € en spans .streamer-num
   · En modo ON → sustituye por barras de progreso relativas
   · Ideal para TikTok/YouTube sin revelar patrimonio real
══════════════════════════════════════════════════════════════════ */
const STREAMER = {
  active: false,
  maxRef: 0, // max patrimony reference for %

  toggle() {
    this.active = !this.active;
    this.maxRef = Math.max(S.patrimony || 0, 1000);
    document.body.classList.toggle('streamer-mode', this.active);
    const btn = document.getElementById('streamer-btn');
    if (btn) {
      btn.textContent = this.active ? '👁️ Modo Streamer ON' : '👁️ Modo Streamer';
      btn.classList.toggle('streamer-on', this.active);
    }
    if (this.active) {
      toast('👁️ Modo Streamer activado', 'Los números se ocultan. Perfecto para grabar.', 't-social');
      HAPTIC.medium();
    }
  },
};


/* ══════════════════════════════════════════════════════════════════
   SECRET ACHIEVEMENTS — Easter eggs ocultos
   No aparecen en la lista hasta que se desbloquean.
   El jugador los descubre sin saberlo.
══════════════════════════════════════════════════════════════════ */
const SECRET_ACHIEVEMENTS = [
  {
    id: 'secret_patience',
    i: '🐢', n: 'El Paciente',
    desc: 'Pasaste 30 días sin vender nada. La paciencia es la única ventaja del inversor retail.',
    cat: 'secret',
    check: s => (s.daysSinceLastSell || 0) >= 30,
    hint: '???',
  },
  {
    id: 'secret_bottom',
    i: '🎯', n: 'Cazador de Mínimos',
    desc: 'Compraste dentro de las 24h de un flash crash. Timing perfecto.',
    cat: 'secret',
    check: s => (s.flashCrashBuys || 0) >= 1,
    hint: '???',
  },
  {
    id: 'secret_millionaire',
    i: '💰', n: 'El Primer Millón',
    desc: 'Patrimonio superior a €1.000.000. Solo el 1% de la población llega aquí.',
    cat: 'secret',
    check: s => (s.patrimony || 0) >= 1000000,
    hint: '???',
  },
  {
    id: 'secret_nocash',
    i: '📊', n: 'Fully Invested',
    desc: 'Menos de €100 en efectivo con más de €10.000 invertidos. All-in.',
    cat: 'secret',
    check: s => (s.cash || 0) < 100 && (s.invested || 0) > 10000,
    hint: '???',
  },
  {
    id: 'secret_allmodules',
    i: '🧠', n: 'Mente Maestra',
    desc: 'Completaste los 30 módulos Y tienes un patrimonio superior a €50.000. Conocimiento + acción.',
    cat: 'secret',
    check: s => (s.completedMods||[]).length >= 30 && (s.patrimony||0) >= 50000,
    hint: '???',
  },
  {
    id: 'secret_crisis3',
    i: '🦾', n: 'Antifrágil',
    desc: 'Superaste 3 crisis de mercado sin vender ni un activo. Eres Nassim Taleb.',
    cat: 'secret',
    check: s => (s.crisesSurvived || 0) >= 3,
    hint: '???',
  },
  {
    id: 'secret_fire_achieved',
    i: '🏝️', n: 'FIRE Conseguido',
    desc: 'Tu patrimonio supera 25× tus gastos anuales. Técnicamente, ya no necesitas trabajar.',
    cat: 'secret',
    check: s => {
      const fireNum = (s.income || 2000) * 0.6 * 12 * 25;
      return (s.patrimony || 0) >= fireNum;
    },
    hint: '???',
  },
  {
    id: 'secret_comeback',
    i: '🔄', n: 'El Gran Regreso',
    desc: 'Tu patrimonio cayó más de un 30% y luego lo recuperaste. Psicología de hierro.',
    cat: 'secret',
    check: s => (s.hadBigDrawdown || false) && (s.patrimony || 0) > (s.peakPatrimony || 0) * 0.95,
    hint: '???',
  },
];

function checkSecretAchievements() {
  if (!Array.isArray(S.unlockedAchs)) S.unlockedAchs = [];
  SECRET_ACHIEVEMENTS.forEach(ach => {
    if (S.unlockedAchs.includes(ach.id)) return;
    try {
      if (ach.check(S)) {
        S.unlockedAchs.push(ach.id);
        setTimeout(() => {
          showBadgeNotification(ach.i, '🔓 ' + ach.n, ach.desc);
          SFX.levelUp(); HAPTIC.levelUp();
          confetti();
          toast('🔓 Logro secreto desbloqueado', ach.n + ' — ' + ach.desc, 't-success');
        }, 800);
      }
    } catch(e) {}
  });
}

// Track peak patrimony and drawdowns for secret achievements
function _trackPatrimonyPeak() {
  if (typeof _checkPatrimonyMilestones === 'function') _checkPatrimonyMilestones();
  if ((S.patrimony || 0) > (S.peakPatrimony || 0)) {
    S.peakPatrimony = S.patrimony;
  }
  if ((S.peakPatrimony || 0) > 0 && (S.patrimony || 0) < (S.peakPatrimony || 0) * 0.70) {
    S.hadBigDrawdown = true;
  }
  // Days since last sell
  if (!S._lastActivityDay) S._lastActivityDay = S.gameDay;
  S.daysSinceLastSell = (S.daysSinceLastSell || 0) + 1;
}

// Flash crash buy detection
function _trackFlashCrashBuy() {
  if (GAME._flashCrashTime && Date.now() - GAME._flashCrashTime < 86400000) {
    S.flashCrashBuys = (S.flashCrashBuys || 0) + 1;
  }
}

/* ══════════════════════════════════════════════════════════════════
   AI COACH — "El Doctor Financiero"
   ─────────────────────────────────────────────────────────────────
   · Proactivo: analiza S cada vez que el usuario abre el home
   · Usa la API de Claude con contexto financiero real del jugador
   · Aparece como burbuja flotante con animación de escritura
   · Sistema de prompt duro: mentor cínico, una frase, sin rollos
   · Rate limit: máximo 1 consejo cada 90 seg reales
══════════════════════════════════════════════════════════════════ */

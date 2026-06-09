// ═══ FINLEARN — app-extras.js ═══════════════════════════════════
// Overflow de app-tools.js. Cargado después de app-tools.js.
// Contiene: F44 Cofres, F45 Market Events, F46 Hearts, F47 Dilemas,
//           F48 Resumen Semanal, M1-M3, T1-T7 Herramientas,
//           BOSS, PERSONALITY, CERT, HEATMAP, SPEEDRUN, SEASONAL
// ═══════════════════════════════════════════════════════════════════

/* ══════════════════════════════════════════════════════════════════
   F44 — COFRES CON SISTEMA PITY
   ─────────────────────────────────────────────────────────────────
   Cofres BRONCE / PLATA / ORO / LEGENDARIO.
   Garantía de legendario cada 10 cofres sin uno (pity).
══════════════════════════════════════════════════════════════════ */

const CHEST_REWARDS = {
  // Cofre BRONCE — se obtiene cada 5 módulos
  // Probabilidades: XP común (70%), XP raro (25%), Escudo (5%)
  bronze: [
    { w: 70, type: 'xp',     value: 25,  label: '25 XP',            icon: '✨' },
    { w: 25, type: 'xp',     value: 50,  label: '50 XP',            icon: '⭐' },
    { w:  5, type: 'shield', value: 1,   label: '1 Escudo de Racha', icon: '🛡️' },
  ],
  // Cofre PLATA — cada 10 módulos o racha ×7
  // Probabilidades: XP (50%), XP raro (25%), Escudo (15%), ×2 XP 24h (10%)
  silver: [
    { w: 50, type: 'xp',       value: 100, label: '100 XP',              icon: '💫' },
    { w: 25, type: 'xp',       value: 150, label: '150 XP',              icon: '🌟' },
    { w: 15, type: 'shield',   value: 2,   label: '2 Escudos de Racha',  icon: '🛡️🛡️' },
    { w: 10, type: 'xpMult2', value: 86400000, label: 'XP ×2 durante 24h', icon: '⚡' },
  ],
  // Cofre ORO — cada 25 módulos o racha ×30
  // Probabilidades: XP (40%), XP raro (25%), Escudo (20%), Bono patrimonio (15%)
  gold: [
    { w: 40, type: 'xp',     value: 300,  label: '300 XP',            icon: '💎' },
    { w: 25, type: 'xp',     value: 500,  label: '500 XP',            icon: '👑' },
    { w: 20, type: 'shield', value: 3,    label: '3 Escudos de Racha', icon: '🛡️' },
    { w: 15, type: 'patBonus', value: 0.02, label: '+2% Patrimonio',  icon: '📈' },
  ],
  legendary: [
    { w: 100, type: 'legendary_pack', value: 1000, label: '1.000 XP + Multiplicador permanente +0.1x', icon: '🏆' },
  ],
};

function _f44_weightedPick(rewards) {
  const total = rewards.reduce((s, r) => s + r.w, 0);
  let rand = Math.random() * total;
  for (const r of rewards) {
    rand -= r.w;
    if (rand <= 0) return r;
  }
  return rewards[rewards.length - 1];
}

function F44_earnChest(type) {
  const chests = S.chestsAvailable || [];
  chests.push({ type, earnedAt: Date.now() });
  S.chestsAvailable = chests;
  saveState();
  F44_render();
  toast('🎁 ¡Cofre ' + type + ' ganado!', 'Ábrelo desde la pantalla principal.', 't-success');
}

function F44_openChest(index) {
  const chests = S.chestsAvailable || [];
  if (index >= chests.length) return;
  const chest = chests[index];

  // Pity check
  let effectiveType = chest.type;
  S.chestPityCount = (S.chestPityCount || 0) + 1;
  if (S.chestPityCount >= 10) {
    effectiveType = 'legendary';
    S.chestPityCount = 0;
  }

  const rewards = CHEST_REWARDS[effectiveType] || CHEST_REWARDS.bronze;
  const reward  = _f44_weightedPick(rewards);

  // Aplicar recompensa
  let resultMsg = '';
  if (reward.type === 'xp') {
    const gained = Math.round(reward.value * (S.xpMultiplier || 1));
    S.xp += gained;
    F34_onXPGained(gained);
    resultMsg = `+${gained} XP`;
    spawnXP('+' + gained + ' XP');
  } else if (reward.type === 'shield') {
    S.streakShields = Math.min(3, (S.streakShields || 0) + reward.value);
    resultMsg = reward.label;
  } else if (reward.type === 'xpMult2') {
    S.xpMultiplierExpiry = Date.now() + reward.value;
    resultMsg = 'XP ×2 durante 24h 🚀';
  } else if (reward.type === 'patBonus') {
    const bonus = Math.round((S.patrimony || 0) * reward.value);
    S.invested  = (S.invested  || 0) + bonus;
    recalcPatrimony();
    _ledgerAdd('in', 'reward', 'Cofre: bono patrimonio ' + reward.label, bonus);
    resultMsg = `+€${bonus.toLocaleString('es')} al patrimonio`;
  } else if (reward.type === 'legendary_pack') {
    const gained = Math.round(reward.value * (S.xpMultiplier || 1));
    S.xp += gained;
    F34_onXPGained(gained);
    S.xpMultiplier = +((S.xpMultiplier || 1) + 0.1).toFixed(2);
    resultMsg = `+${gained} XP + multiplicador permanente ×${S.xpMultiplier.toFixed(1)}`;
    spawnXP('+' + gained + ' XP 🏆');
    SFX.levelUp && SFX.levelUp();
  }

  // Remover cofre de la cola
  chests.splice(index, 1);
  S.chestsAvailable = chests;
  saveState();

  // Modal de apertura
  _f44_openAnimation(effectiveType, reward, resultMsg);
}

function _f44_openAnimation(chestType, reward, resultMsg) {
  let modal = document.getElementById('m-f44-chest');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-f44-chest';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }
  const colors = { bronze: '#cd7f32', silver: '#c0c0c0', gold: '#ffd700', legendary: '#a855f7' };
  const icons  = { bronze: '📦', silver: '🥈', gold: '🏅', legendary: '👑' };
  modal.innerHTML = `
    <div class="modal-box f44-modal">
      <div class="f44-chest-anim f44-type-${chestType}" style="--chest-color:${colors[chestType] || '#888'}">
        <div class="f44-chest-icon">${icons[chestType] || '📦'}</div>
        <div class="f44-particles">
          ${Array(12).fill(0).map(() => `<span class="f44-particle"></span>`).join('')}
        </div>
      </div>
      <div class="f44-reward-icon">${reward.icon}</div>
      <div class="f44-reward-label">${resultMsg}</div>
      <div class="f44-pity-bar">
        <div class="f44-pity-label">Próximo legendario garantizado en <strong>${10 - (S.chestPityCount || 0)}</strong> cofres</div>
        <div class="f44-pity-track"><div class="f44-pity-fill" style="width:${(S.chestPityCount || 0) * 10}%"></div></div>
      </div>
      <button class="btn btn-primary btn-block" onclick="closeModal('m-f44-chest');F44_render()">¡Genial! 🎉</button>
    </div>`;
  openModal('m-f44-chest');
  SFX.xp && SFX.xp();
  confetti && confetti();
}

function F44_render() {
  const el = document.getElementById('f44-chests');
  if (!el) return;
  const chests = S.chestsAvailable || [];
  el.style.display = '';

  if (chests.length === 0) {
    const next5 = 5 - ((S.completedMods || []).length % 5 || 5);
    const hint = next5 === 0
      ? 'Completa un módulo para ganar tu próximo cofre'
      : `${next5} módulo${next5 !== 1 ? 's' : ''} para tu próximo cofre`;
    el.innerHTML = `
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:14px 16px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:28px;">📦</span>
        <div>
          <div style="font-weight:700;font-size:13px;">Próximo cofre</div>
          <div style="font-size:11px;color:var(--text2);">${hint}</div>
        </div>
      </div>`;
    return;
  }

  const icons = { bronze: '📦', silver: '🥈', gold: '🏅', legendary: '👑' };
  el.innerHTML = `
    <div class="f44-wrap">
      <div class="f44-header">
        <span class="f44-title">🎁 Tienes ${chests.length} cofre${chests.length !== 1 ? 's' : ''} sin abrir</span>
        <span class="f44-pity-mini">Pity: ${S.chestPityCount || 0}/10</span>
      </div>
      <div class="f44-list">
        ${chests.map((c, i) => `
          <button class="f44-chest-btn f44-chest-${c.type} f44-pulse" onclick="F44_openChest(${i})">
            <span class="f44-chest-btn-icon">${icons[c.type] || '📦'}</span>
            <span class="f44-chest-btn-type">${c.type.charAt(0).toUpperCase() + c.type.slice(1)}</span>
          </button>`).join('')}
      </div>
    </div>`;
}

function F44_onModuleComplete() {
  const completed = (S.completedMods || []).length;
  const prem = isPremium();

  if (prem) {
    // Premium: cofres mejores y más frecuentes
    if (completed % 5 === 0 && completed > 0)  F44_earnChest('bronze');
    if (completed % 10 === 0 && completed > 0) { F44_earnChest('silver'); return; }
    if (completed % 25 === 0 && completed > 0)  F44_earnChest('gold');
    if ((S.streak||0) > 0 && (S.streak||0) % 7 === 0) F44_earnChest('silver');
  } else {
    // Gratis: bronce cada 5, plata cada 20, oro casi nunca
    if (completed % 20 === 0 && completed > 0) { F44_earnChest('silver'); return; }
    if (completed % 5 === 0 && completed > 0)   F44_earnChest('bronze');
    // Sin cofres por racha en plan gratis
  }
}

window.F44_earnChest   = F44_earnChest;
window.F44_openChest   = F44_openChest;
window.F44_render      = F44_render;
window.F44_onModuleComplete = F44_onModuleComplete;


/* ══════════════════════════════════════════════════════════════════
   F45 — EVENTOS DE MERCADO EN VIVO
   ─────────────────────────────────────────────────────────────────
   Titulares ficticios que afectan temporalmente los precios
   y obligan al jugador a decidir: mantener, vender o comprar.
══════════════════════════════════════════════════════════════════ */

const MARKET_EVENTS = [
  { id: 'fed_rate_hike',   type: 'crash',  headline: '⚠️ CRISIS: La Fed sube tipos al 6%. Mercados caen -15%',           impact: -0.15, sectors: ['all'],      duration: 8,  edu: 'Históricamente, subidas bruscas de tipos preceden correcciones. Los mercados suelen recuperarse en 12-18 meses.' },
  { id: 'inflation_good',  type: 'boom',   headline: '🚀 BOOM: Inflación cae al 2%. S&P 500 sube +12%',                  impact:  0.12, sectors: ['all'],      duration: 6,  edu: 'La bajada de inflación reduce la presión sobre los tipos y dispara las valoraciones. Históricamente alcista.' },
  { id: 'tech_regulation', type: 'sector', headline: '📉 TECH: Regulación antimonopolio hunde el sector -25%',           impact: -0.25, sectors: ['MSFT','AAPL','NVDA'], duration: 10, edu: 'La regulación tecnológica crea incertidumbre a corto plazo pero raramente destruye valor a largo plazo.' },
  { id: 'ree_dividend',    type: 'dividend',headline: '💰 REE: Dividendo extraordinario del 5% anunciado',               impact:  0.08, sectors: ['REE','IBE'], duration: 5,  edu: 'Los dividendos extraordinarios reducen el efectivo de la empresa pero premian al accionista a corto plazo.' },
  { id: 'btc_hack',        type: 'crypto', headline: '🔴 CRYPTO: Hackeo masivo de exchange. Bitcoin -35%',               impact: -0.35, sectors: ['BTC'],       duration: 7,  edu: 'El riesgo de custodia en crypto es real. Hardware wallets y exchanges regulados reducen el riesgo.' },
  { id: 'ipo_fintech',     type: 'oportunidad', headline: '🏦 IPO FINTECH: Sale a bolsa con descuento del 20%',          impact:  0.20, sectors: ['all'],      duration: 4,  edu: 'Las IPOs a menudo caen en sus primeros meses. Invertir en IPOs tiene más riesgo que en empresas consolidadas.' },
  { id: 'recession_fear',  type: 'crash',  headline: '😱 RECESIÓN: Curva invertida indica recesión inminente. -18%',      impact: -0.18, sectors: ['all'],      duration: 9,  edu: 'La curva invertida predice recesiones con 12-18 meses de antelación. Pero no todas las predicciones se cumplen.' },
  { id: 'energy_crisis',   type: 'sector', headline: '⚡ ENERGÍA: Corte de suministro. Energéticas suben +15%',           impact:  0.15, sectors: ['REE','IBE','ENG'], duration: 6, edu: 'Las crisis energéticas benefician a productores. La diversificación sectorial te protege de shocks específicos.' },
  { id: 'ai_revolution',   type: 'boom',   headline: '🤖 IA: Breakthrough tecnológico. Tech sube +20%',                  impact:  0.20, sectors: ['MSFT','NVDA'], duration: 5, edu: 'Los ciclos tecnológicos crean ganadores y perdedores. Invertir en índices captura el sector ganador automáticamente.' },
  { id: 'housing_crash',   type: 'crash',  headline: '🏠 INMOBILIARIO: Burbuja pinchada. Banca cae -20%',                impact: -0.20, sectors: ['SAN','BBVA'], duration: 8, edu: 'Las crisis inmobiliarias arrastran a la banca. La diversificación fuera del sector financiero es clave.' },
  { id: 'dividend_cut',    type: 'sector', headline: '✂️ IBEX: Varias empresas recortan dividendos. -10%',               impact: -0.10, sectors: ['SAN','TEF'], duration: 5, edu: 'El recorte de dividendos señala dificultades. Diversificar en índices globales reduce este riesgo específico.' },
  { id: 'china_gdp',       type: 'boom',   headline: '🐉 CHINA: PIB supera expectativas. Mercados emergentes +15%',       impact:  0.15, sectors: ['all'],      duration: 6, edu: 'China es el segundo motor económico mundial. Su crecimiento impacta materias primas y empresas exportadoras.' },
  { id: 'oil_opec',        type: 'sector', headline: '🛢️ OPEP: Recorte de producción. Petroleras +18%',                   impact:  0.18, sectors: ['REPSOL'],   duration: 7, edu: 'La OPEP controla el precio del petróleo. Las subidas benefician a productores pero dañan la economía global.' },
  { id: 'dollar_strong',   type: 'crash',  headline: '💵 DÓLAR: Fortaleza extrema. Exportadoras europeas -12%',           impact: -0.12, sectors: ['all'],      duration: 6, edu: 'Un dólar fuerte encarece las exportaciones europeas a EEUU y reduce beneficios de empresas que reportan en USD.' },
  { id: 'green_deal',      type: 'boom',   headline: '🌱 GREEN: Acuerdo climático masivo. Renovables +25%',               impact:  0.25, sectors: ['REE','IBE'], duration: 7, edu: 'La transición energética crea mega-tendencias de décadas. Las renovables tienen vientos de cola estructurales.' },
  { id: 'bank_crisis',     type: 'crash',  headline: '🏦 BANCA: Quiebra banco sistémico. Sector -30%',                   impact: -0.30, sectors: ['SAN','BBVA','SAB'], duration: 10, edu: 'Las crisis bancarias pueden contagiarse. Los depósitos hasta €100.000 están garantizados por el FGD.' },
  { id: 'jobs_strong',     type: 'boom',   headline: '💼 EMPLEO: Paro en mínimos históricos. Consumo sube +10%',          impact:  0.10, sectors: ['all'],      duration: 5, edu: 'El pleno empleo impulsa el consumo y los beneficios empresariales. Es el mejor contexto para renta variable.' },
  { id: 'supply_chain',    type: 'sector', headline: '🚢 SUPPLY: Crisis cadena suministro. Industriales -15%',            impact: -0.15, sectors: ['all'],      duration: 8, edu: 'Los cuellos de botella en suministros generan inflación transitoria y comprimen márgenes empresariales.' },
  { id: 'geopolitical',    type: 'crash',  headline: '💣 GEO: Conflicto geopolítico. Activos refugio disparan +20%',      impact: -0.15, sectors: ['all'],      duration: 9, edu: 'Los conflictos crean volatilidad pero raramente destruyen valor a largo plazo. El oro y los bonos actúan como refugio.' },
  { id: 'rate_cut',        type: 'boom',   headline: '✂️ BCE: Tipos bajan al 1%. Bolsa dispara +15%',                    impact:  0.15, sectors: ['all'],      duration: 6, edu: 'Los recortes de tipos reducen el coste del dinero, impulsan el crédito y aumentan las valoraciones bursátiles.' },
  { id: 'pharma_breakthrough', type: 'sector', headline: '💊 FARMACIA: Cura contra el Alzheimer. Sector +30%',           impact:  0.30, sectors: ['all'],      duration: 5, edu: 'Los avances farmacéuticos pueden crear valor masivo pero son difíciles de predecir. La diversificación captura estas sorpresas.' },
  { id: 'climate_disaster', type: 'crash', headline: '🌊 CLIMA: Huracán masivo destruye infraestructura. -10%',           impact: -0.10, sectors: ['all'],      duration: 5, edu: 'Los riesgos climáticos son crecientes. Los seguros y la diversificación geográfica mitigan el impacto en cartera.' },
  { id: 'earnings_beat',   type: 'boom',   headline: '📊 RESULTADOS: Beneficios empresariales superan estimaciones +18%', impact: 0.18, sectors: ['all'],      duration: 5, edu: 'Los resultados sólidos confirman que los precios del mercado reflejan el valor real. El mercado es eficiente a largo plazo.' },
  { id: 'm_and_a',         type: 'sector', headline: '🤝 M&A: Megafusión crea empresa valorada en €500.000M',             impact: 0.12, sectors: ['all'],      duration: 4, edu: 'Las fusiones pueden crear o destruir valor. Históricamente, los compradores tienden a pagar de más (winner\'s curse).' },
  { id: 'inflation_spike',  type: 'crash', headline: '🔥 INFLACIÓN: IPC sube al 8%. Mercados se desploman -20%',          impact: -0.20, sectors: ['all'],     duration: 9, edu: 'La inflación alta erosiona los retornos reales. Los activos reales (inmobiliario, commodities, TIPS) protegen mejor.' },
  { id: 'default_sovereign', type: 'crash', headline: '🇬🇷 DEUDA: País europeo amenaza con impago. -22%',                impact: -0.22, sectors: ['SAN','BBVA'], duration: 10, edu: 'El riesgo soberano es sistémico. Una cartera global diversificada reduce la exposición a riesgos de un solo país.' },
  { id: 'mega_ipo',         type: 'boom',   headline: '🦄 IPO HISTÓRICA: Empresa tech sale a bolsa valorada en €2T',      impact: 0.10, sectors: ['all'],      duration: 4, edu: 'Las mega-IPOs crean entusiasmo pero con frecuencia defraudan a corto plazo. La paciencia y la investigación son clave.' },
  { id: 'buyback',          type: 'boom',   headline: '🔄 RECOMPRA: Apple anuncia recompra de acciones por €100.000M',    impact: 0.08, sectors: ['AAPL'],     duration: 3, edu: 'Las recompras de acciones reducen el número en circulación y aumentan el BPA. Son equivalentes a dividendos fiscalmente.' },
  { id: 'flash_crash_2',    type: 'crash',  headline: '⚡ FLASH CRASH: Caída algorítmica del -8% en 20 minutos',          impact: -0.08, sectors: ['all'],     duration: 2, edu: 'Los flash crashes son provocados por algoritmos y se recuperan rápidamente. La volatilidad es el precio de los retornos.' },
  { id: 'ecb_qe',           type: 'boom',   headline: '🖨️ BCE: Programa de compra de activos de €1 billón. Bolsa +14%',  impact: 0.14, sectors: ['all'],      duration: 7, edu: 'El Quantitative Easing inyecta liquidez, baja tipos y eleva los precios de activos. Beneficia a los inversores.' },
];

let _f45SessionEvent = null;
let _f45LastTrigger  = 0;

function F45_checkTrigger() {
  if (!S.userName) return;
  const now = Date.now();
  if (now - _f45LastTrigger < 5 * 60000) return; // mínimo 5 min entre eventos
  if (Math.random() > 0.25) return; // 25% de probabilidad por sesión de render
  _f45LastTrigger = now;

  const seen    = S.seenMarketEvents || [];
  const unseen  = MARKET_EVENTS.filter(e => !seen.includes(e.id));
  if (unseen.length === 0) { S.seenMarketEvents = []; saveState(); return; }

  const event   = unseen[Math.floor(Math.random() * unseen.length)];
  S.seenMarketEvents = [...seen, event.id];
  S.activeMarketEvent = { id: event.id, startTime: now, endTime: now + event.duration * 60000, eventData: event };
  saveState();

  // Modificar precios temporalmente
  _f45_applyPrices(event, true);

  // Mostrar banner
  _f45_showBanner(event);

  // Revertir precios al expirar
  setTimeout(() => { _f45_applyPrices(event, false); S.activeMarketEvent = null; saveState(); }, event.duration * 60000);
}

function _f45_applyPrices(event, apply) {
  const multiplier = apply ? (1 + event.impact) : (1 / (1 + event.impact));
  STOCKS.forEach(s => {
    if (event.sectors.includes('all') || event.sectors.includes(s.ticker)) {
      GAME.stockPrices[s.ticker] = +((GAME.stockPrices[s.ticker] || s.price) * multiplier).toFixed(2);
    }
  });
}

function _f45_showBanner(event) {
  let banner = document.getElementById('f45-market-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'f45-market-banner';
    document.body.prepend(banner);
  }

  const isPositive = event.impact > 0;
  const impactStr  = (isPositive ? '+' : '') + Math.round(event.impact * 100) + '%';
  const portfolioImpact = _f45_calcPortfolioImpact(event);
  const impactEur  = (portfolioImpact >= 0 ? '+' : '') + '€' + Math.abs(portfolioImpact).toFixed(0);
  const bgClass    = isPositive ? 'f45-banner-boom' : 'f45-banner-crash';

  banner.innerHTML = `
    <div class="f45-banner ${bgClass} f45-slide-in">
      <div class="f45-banner-inner">
        <div class="f45-headline">${event.headline}</div>
        <div class="f45-impact-row">
          <span class="f45-impact-pct" style="color:${isPositive?'#00e5a0':'#ef4444'}">${impactStr} sobre tu cartera</span>
          <span class="f45-impact-eur">${impactEur}</span>
        </div>
        <div class="f45-banner-actions">
          <button class="f45-btn f45-hold"   onclick="F45_decide('hold',   '${event.id}')">💎 Mantener</button>
          <button class="f45-btn f45-sell"   onclick="F45_decide('sell',   '${event.id}')">🚨 Vender</button>
          <button class="f45-btn f45-buy"    onclick="F45_decide('buy',    '${event.id}')">📈 Comprar más</button>
        </div>
      </div>
    </div>`;

  // Auto-dismiss tras la duración del evento
  setTimeout(() => {
    if (banner.parentNode) banner.remove();
  }, event.duration * 60000);
}

function _f45_calcPortfolioImpact(event) {
  let impact = 0;
  Object.entries(S.portfolio || {}).forEach(([ticker, pos]) => {
    const price = (GAME.stockPrices || {})[ticker] || 0;
    if (event.sectors.includes('all') || event.sectors.includes(ticker)) {
      impact += pos.shares * price * event.impact;
    }
  });
  return impact;
}

function F45_decide(action, eventId) {
  const banner = document.getElementById('f45-market-banner');
  const event  = MARKET_EVENTS.find(e => e.id === eventId);
  if (!event) return;

  let xpGain = 0, msg = '';
  const isPositive = event.impact > 0;

  if (action === 'hold') {
    xpGain = isPositive ? 20 : 30; // mantener en crash es mejor
    msg = isPositive ? 'Buena decisión. Mantener en subidas evita el FOMO de vender pronto.' : '💎 ¡Manos de diamante! Históricamente, mantener en caídas maximiza el retorno.';
  } else if (action === 'sell') {
    xpGain = isPositive ? 15 : 5;
    msg = isPositive ? 'Realizaste beneficios. Pero podrías haber ganado más manteniéndote.' : '⚠️ Vender en caídas suele ser el peor movimiento. El pánico destruye rentabilidad.';
  } else if (action === 'buy') {
    xpGain = isPositive ? 10 : 35;
    msg = isPositive ? 'Comprar en máximos tiene riesgo. Mejor DCA que intentar el timing.' : '🚀 ¡Excelente! Comprar en caídas es la estrategia de los inversores más exitosos.';
  }

  xpGain = Math.round(xpGain * (S.xpMultiplier || 1));
  S.xp += xpGain;
  if (typeof F34_onXPGained === 'function') F34_onXPGained(xpGain);
  saveState();
  checkAchievements();
  spawnXP('+' + xpGain + ' XP');

  if (banner) {
    banner.innerHTML = `
      <div class="f45-banner f45-banner-result f45-slide-in">
        <div class="f45-banner-inner">
          <div class="f45-decision-msg">${msg}</div>
          <div class="f45-edu-box">📚 ${event.edu}</div>
          <div class="f45-xp-gained">+${xpGain} XP por tu decisión</div>
          <button class="btn btn-ghost f45-close-btn" onclick="this.closest('#f45-market-banner').remove()">Cerrar</button>
        </div>
      </div>`;
    setTimeout(() => { if (banner.parentNode) banner.remove(); }, 6000);
  }
}

window.F45_checkTrigger = F45_checkTrigger;
window.F45_decide       = F45_decide;


/* ══════════════════════════════════════════════════════════════════
   F46 — HP SYSTEM (FICHAS DE ANÁLISIS ❤️)
   ─────────────────────────────────────────────────────────────────
   Máx 5 fichas. Se regeneran 1 cada 2 horas.
   Respuesta incorrecta → consume 1 ficha.
   Al llegar a 0: modal para recuperar fichas.
══════════════════════════════════════════════════════════════════ */

function F46_regenHearts() {
  const now  = Date.now();
  const last = S.heartsLastRegen || now;
  const hoursPassed = (now - last) / 3600000;
  const toRegen = Math.floor(hoursPassed / 2); // 1 cada 2 horas
  if (toRegen > 0) {
    S.hearts = Math.min(5, (S.hearts || 5) + toRegen);
    S.heartsLastRegen = last + toRegen * 2 * 3600000;
    saveState();
  }
}

function F46_loseHeart() {
  F46_regenHearts();
  S.hearts = Math.max(0, (S.hearts || 5) - 1);
  S.heartsLastRegen = S.heartsLastRegen || Date.now();
  saveState();
  F46_renderHearts();

  if (S.hearts === 0) {
    setTimeout(_f46_noHeartsModal, 400);
  } else if (S.hearts === 1) {
    toast('❤️ Última ficha', '¡Cuidado! Responde correctamente o perderás el acceso a los quizzes por 2h.', 't-warn');
  }
}

function _f46_noHeartsModal() {
  const nextRegen = (S.heartsLastRegen || Date.now()) + 2 * 3600000;
  const minLeft   = Math.max(0, Math.round((nextRegen - Date.now()) / 60000));

  let modal = document.getElementById('m-f46-hearts');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-f46-hearts';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-box f46-modal">
      <div class="f46-no-hearts-icon">💔</div>
      <div class="f46-title">Sin fichas de análisis</div>
      <div class="f46-sub">Necesitas fichas para responder quizzes. Se regeneran solas.</div>
      <div class="f46-regen-info">⏱ Próxima ficha en <strong>${minLeft} min</strong></div>
      <div class="f46-options">
        <button class="btn btn-primary btn-block" onclick="F46_buyHeart()">⚡ Gastar 50 XP → Recuperar 1 ficha</button>
        <button class="btn btn-ghost btn-block"   onclick="closeModal('m-f46-hearts')">Volver más tarde</button>
      </div>
    </div>`;
  openModal('m-f46-hearts');
}

function F46_buyHeart() {
  if ((S.xp || 0) < 50) {
    toast('❌ XP insuficiente', 'Necesitas 50 XP.', 't-error');
    return;
  }
  S.xp    -= 50;
  S.hearts = Math.min(5, (S.hearts || 0) + 1);
  saveState();
  closeModal('m-f46-hearts');
  F46_renderHearts();
  toast('❤️ Ficha recuperada', 'Ya puedes volver a responder quizzes.', 't-success');
}

function F46_renderHearts() {
  F46_regenHearts();
  const h   = S.hearts || 0;
  const max = 5;
  const next = (S.heartsLastRegen || Date.now()) + 2 * 3600000;
  const minLeft = Math.max(0, Math.round((next - Date.now()) / 60000));
  const regenStr = h < max ? ` · ${minLeft}min para +1` : '';
  const heartsHtml = Array(max).fill(0).map((_, i) => `<span class="f46-heart${i < h ? '' : ' f46-heart-empty'}">${i < h ? '❤️' : '🖤'}</span>`).join('');

  const el = document.getElementById('f46-hearts-row');
  if (el) {
    el.innerHTML = heartsHtml + `<span class="f46-regen-label">${regenStr}</span>`;
    el.classList.toggle('f46-danger', h <= 1);
  }
  // También en el indicador compacto de la lección
  const lf = document.getElementById('lf-hearts-display');
  if (lf) {
    lf.innerHTML = heartsHtml;
    lf.style.opacity = h <= 1 ? '1' : '0.7';
  }
}

window.F46_loseHeart    = F46_loseHeart;
window.F46_buyHeart     = F46_buyHeart;
window.F46_renderHearts = F46_renderHearts;
window.F46_regenHearts  = F46_regenHearts;


/* ══════════════════════════════════════════════════════════════════
   F47 — DILEMAS "¿QUÉ HARÍAS TÚ?"
   ─────────────────────────────────────────────────────────────────
   1 dilema por semana (lunes). Modifica permanentemente S.
   +30 XP por responder, independientemente de la elección.
══════════════════════════════════════════════════════════════════ */

const DILEMMAS = [
  {
    id: 'salary_vs_options',
    q: () => `Tu empresa te ofrece subida de €300/mes o stock options al 20% de descuento. ¿Qué eliges?`,
    ctx: 'El salario es seguro. Las opciones pueden valer mucho más o nada si la empresa va mal.',
    a: { label: '💼 Subida de €300/mes (seguro)', apply: () => { S.lifeSalary = (S.lifeSalary||1800) + 300; } },
    b: { label: '📈 Stock options (potencial mayor)', apply: () => { /* Simbólico: añade inversión */ S.invested = (S.invested||0) + 3000; S.patrimony = (S.patrimony||0) + 3000; } },
    comparison: 'A largo plazo, las opciones pueden multiplicar el valor. Pero el salario seguro reduce el estrés financiero y permite más inversión mensual.',
  },
  {
    id: 'car_cash_vs_finance',
    q: () => `Tienes €${Math.min(S.cash||5000, 12000).toLocaleString('es')}. Coche al contado (€12.000) vs financiado al 6% en 5 años. ¿Qué haces?`,
    ctx: 'Pagar al contado elimina la deuda. Financiar te permite mantener el capital para invertir.',
    a: { label: '💰 Pagar al contado (sin deudas)', apply: () => { S.cash = Math.max(0, (S.cash||5000) - 12000); } },
    b: { label: '🏦 Financiar al 6% (mantener capital)', apply: () => { S.debts = [...(S.debts||[]), {name:'Coche', balance:12000, rate:6, monthly:232}]; } },
    comparison: 'Al 6% de interés, el coche financiado cuesta €1.920 extra. Si ese capital lo inviertes al 7%, en 5 años habrás ganado más de lo que costaron los intereses.',
  },
  {
    id: 'friend_loan',
    q: () => `Un amigo te pide €3.000 prestados sin interés. Tienes €${(S.cash||5000).toLocaleString('es')} de efectivo. ¿Se los prestas?`,
    ctx: 'Prestar a amigos puede deteriorar la relación si no devuelven. Pero puede ser apoyo real en un momento crítico.',
    a: { label: '🤝 Sí, le presto €3.000', apply: () => { S.cash = Math.max(0, (S.cash||5000) - 3000); } },
    b: { label: '❌ No, no mezclo dinero y amistad', apply: () => { /* no change */ } },
    comparison: 'Los datos indican que el 40% de los préstamos entre amigos generan conflictos. Si decides prestar, ponlo por escrito aunque sea informal.',
  },
  {
    id: 'invest_vs_mortgage',
    q: () => `Tienes €500/mes libre. ¿Amortizar hipoteca al 3% o invertirlo en ETF al histórico 7%?`,
    ctx: 'Amortizar reduce el riesgo y la deuda total. Invertir aprovecha el diferencial de rentabilidad.',
    a: { label: '🏠 Amortizar hipoteca (sin riesgo)', apply: () => { const m = (S.debts||[]).find(d => /hipotec/i.test(d.name)); if (m) m.balance = Math.max(0, m.balance - 500); else S.cash = (S.cash||0) + 500; } },
    b: { label: '📊 Invertir en ETF (7% histórico)', apply: () => { S.invested = (S.invested||0) + 500; S.patrimony = (S.patrimony||0) + 500; } },
    comparison: 'Con hipoteca al 3% e inversión al 7%, matemáticamente conviene invertir (4% de diferencial). Pero la tranquilidad de no deber también tiene valor.',
  },
  {
    id: 'emergency_fund',
    q: () => `Tienes €10.000 en cuenta sin rentabilidad. Inflación al 4%. ¿Mantienes el fondo o inviertes parte?`,
    ctx: 'El fondo de emergencia pierde poder adquisitivo. Pero sin él, cualquier imprevisto puede arruinar tus inversiones.',
    a: { label: '🛡️ Mantener €10.000 como fondo (seguridad)', apply: () => { /* no change, es la opción conservadora */ } },
    b: { label: '📈 Invertir €6.000 y dejar €4.000 de fondo', apply: () => { S.cash = Math.max(0, (S.cash||5000) - 6000); S.invested = (S.invested||0) + 6000; } },
    comparison: 'Con gastos de €2.000/mes, €4.000 cubre 2 meses. El mínimo recomendado es 3-6 meses. Invertir el exceso sobre ese umbral es racional.',
  },
  {
    id: 'salary_raise_save',
    q: () => `Tu empresa te sube el sueldo €500/mes. ¿Gastar en calidad de vida o ahorrar el 100%?`,
    ctx: 'Lifestyle inflation erosiona los aumentos de sueldo. Pero equilibrar disfrute y ahorro también es importante.',
    a: { label: '🎉 50% disfrute, 50% ahorro (equilibrio)', apply: () => { S.lifeSalary = (S.lifeSalary||1800) + 500; S.monthlyContribution = (S.monthlyContribution||200) + 250; } },
    b: { label: '💪 100% a inversión (máximo ahorro)', apply: () => { S.lifeSalary = (S.lifeSalary||1800) + 500; S.monthlyContribution = (S.monthlyContribution||200) + 500; } },
    comparison: 'La regla de oro: cuando aumentan los ingresos, no aumentes el gasto en la misma proporción. Reserva al menos el 50% del aumento neto para inversión.',
  },
  {
    id: 'inheritance',
    q: () => `Recibes una herencia de €30.000 inesperada. ¿Cómo la distribuyes?`,
    ctx: 'Una cantidad inesperada puede cambiar tu trayectoria financiera si se gestiona bien.',
    a: { label: '🏠 Amortizar deudas + fondo emergencia + inversión (3 partes)', apply: () => { S.cash = (S.cash||5000) + 10000; S.invested = (S.invested||0) + 20000; S.patrimony = (S.patrimony||0) + 30000; } },
    b: { label: '📊 Todo a inversión en ETF global', apply: () => { S.invested = (S.invested||0) + 30000; S.patrimony = (S.patrimony||0) + 30000; } },
    comparison: 'Si no tienes deudas caras ni fondo de emergencia, invertir todo es eficiente. Si los tienes, primero cúbrelos. El orden: 1) deudas caras, 2) fondo, 3) inversión.',
  },
  {
    id: 'job_offer',
    q: () => `Te ofrecen trabajo nuevo: +€800/mes pero ciudad diferente, o quedarte en tu empresa actual.`,
    ctx: 'El coste de vida de la nueva ciudad puede absorber el aumento. Pero el crecimiento profesional también importa.',
    a: { label: '✈️ Aceptar (más dinero y experiencia)', apply: () => { S.lifeSalary = (S.lifeSalary||1800) + 800; } },
    b: { label: '🏠 Quedarse (estabilidad y vínculos)', apply: () => { /* no change */ } },
    comparison: 'Calcula el aumento neto considerando el coste de vida. Si el diferencial real es > 15% de tus ingresos, suele valer la pena. Modela los números antes de decidir.',
  },
  {
    id: 'pension_plan',
    q: () => `Tienes 30 años. ¿Empiezas a aportar €200/mes a un plan de pensiones o a un ETF indexado?`,
    ctx: 'El plan de pensiones tiene ventaja fiscal ahora pero tributa al rescatar. El ETF es más flexible.',
    a: { label: '🏦 Plan de pensiones (deducción IRPF)', apply: () => { S.invested = (S.invested||0) + 200; S.xp += 20; } },
    b: { label: '📊 ETF indexado (más flexible)', apply: () => { S.invested = (S.invested||0) + 200; S.monthlyContribution = (S.monthlyContribution||200) + 200; } },
    comparison: 'Si tu tipo marginal es alto (>30%), el plan de pensiones puede tener ventaja. Pero los ETFs de acumulación son más eficientes para la mayoría con tipo marginal bajo o medio.',
  },
  {
    id: 'crypto_allocation',
    q: () => `¿Pones el 5% de tu cartera en Bitcoin como "cobertura contra la inflación"?`,
    ctx: 'Bitcoin tiene correlación creciente con la renta variable. Su papel como refugio es debatido.',
    a: { label: '₿ Sí, 5% en BTC (especulación controlada)', apply: () => { const amount = (S.invested||0) * 0.05; /* simbólico */ } },
    b: { label: '❌ No, prefiero oro o TIPS', apply: () => { /* no change */ } },
    comparison: 'El Bitcoin ha ofrecido retornos extraordinarios pero con volatilidad extrema (-80% en ciclos bajistas). Un 1-5% puede ser aceptable para quien entiende el riesgo.',
  },
  {
    id: 'side_hustle',
    q: () => `Tienes una idea de negocio paralelo. ¿Inviertes €5.000 propios para lanzarla?`,
    ctx: '8 de cada 10 negocios fracasan en 5 años. Pero el 1 que funciona puede cambiar tu vida.',
    a: { label: '🚀 Sí, invierto €5.000 en el negocio', apply: () => { S.cash = Math.max(0, (S.cash||5000) - 5000); } },
    b: { label: '📊 No, prefiero invertir en ETFs (más seguro)', apply: () => { S.invested = (S.invested||0) + 5000; S.patrimony = (S.patrimony||0) + 5000; } },
    comparison: 'Si el negocio tiene plan, producto probado y tú aportas tiempo, puede multiplicar el retorno de cualquier inversión financiera. Sin esas condiciones, el ETF gana.',
  },
  {
    id: 'buy_rent',
    q: () => `Alquiler €900/mes vs hipoteca €950/mes. ¿Compras o sigues alquilando?`,
    ctx: 'La hipoteca construye patrimonio. El alquiler da flexibilidad. Ambos tienen pros y contras matemáticos.',
    a: { label: '🏠 Comprar (construyo patrimonio)', apply: () => { S.patrimony = (S.patrimony||0) + 5000; S.debts = [...(S.debts||[]), {name:'Hipoteca', balance:180000, rate:3.5, monthly:950}]; } },
    b: { label: '🏢 Seguir alquilando (más flexibilidad)', apply: () => { /* no change */ } },
    comparison: 'El análisis correcto compara: coste total hipoteca (intereses + impuestos + mantenimiento) vs. alquiler + rentabilidad del capital que no inmovilizas. El resultado depende de la ciudad.',
  },
  {
    id: 'sabbatical',
    q: () => `Llevas 5 años sin descanso. Puedes permitirte un año sabático usando €20.000 de ahorros. ¿Lo haces?`,
    ctx: 'El agotamiento destruye productividad. Pero 20.000€ invertidos al 7% durante 20 años = €77.000.',
    a: { label: '🌍 Sí, necesito el año sabático', apply: () => { S.cash = Math.max(0, (S.cash||5000) - 20000); S.xp += 50; } },
    b: { label: '💼 No, sigo trabajando e invierto ese dinero', apply: () => { S.invested = (S.invested||0) + 20000; S.patrimony = (S.patrimony||0) + 20000; } },
    comparison: 'El coste de oportunidad del sabático no es solo los €20.000 sino también los ingresos perdidos. Pero el agotamiento tiene coste real en salud y productividad futura.',
  },
  {
    id: 'insurance',
    q: () => `¿Contratas seguro de vida por €100/mes si tienes familia dependiente?`,
    ctx: 'El seguro de vida no es un activo, pero protege a los que dependen de ti si falleces.',
    a: { label: '🛡️ Sí, protejo a mi familia', apply: () => { /* coste mensual simulado */ } },
    b: { label: '❌ No, prefiero invertir ese dinero', apply: () => { S.invested = (S.invested||0) + 1200; S.patrimony = (S.patrimony||0) + 1200; } },
    comparison: 'Si tienes personas dependientes (hijos, pareja sin ingresos), el seguro de vida es imprescindible. Sin dependientes, puede ser prescindible. El coste de oportunidad es real pero el riesgo también.',
  },
  {
    id: 'real_estate_vs_etf',
    q: () => `€100.000 disponibles: ¿piso para alquilar o ETF global?`,
    ctx: 'El inmobiliario en España ha dado ~3-4% real histórico. El ETF global ~5-7% real. Pero el inmobiliario da apalancamiento.',
    a: { label: '🏠 Piso para alquilar (tangible, apalancamiento)', apply: () => { S.cash = Math.max(0, (S.cash||0) - 100000); S.invested = (S.invested||0) + 100000; } },
    b: { label: '📊 ETF global (mayor liquidez y retorno histórico)', apply: () => { S.invested = (S.invested||0) + 100000; S.patrimony = (S.patrimony||0) + 100000; } },
    comparison: 'El ETF global tiene mayor retorno histórico y cero gestión. El piso ofrece apalancamiento (hipoteca) pero requiere gestión y tiene iliquidez. Depende de tu perfil y conocimiento del mercado local.',
  },
  {
    id: 'debt_consolidation',
    q: () => `Tienes 3 préstamos: 8%, 12% y 18%. ¿Los consolidas en uno al 10%?`,
    ctx: 'Consolidar reduce el tipo medio pero puede alargar el plazo y el coste total.',
    a: { label: '✅ Sí, consolido para simplificar', apply: () => { /* simplificación simbólica */ toast('💡 Deudas consolidadas', 'Tipo medio: 10%', 't-success'); } },
    b: { label: '🎯 No, pago el del 18% primero (método avalancha)', apply: () => { /* estrategia correcta: avalancha */ } },
    comparison: 'El método avalancha (pagar primero la deuda más cara) minimiza los intereses totales. La consolidación puede simplificar pero solo conviene si el tipo consolidado es menor al promedio ponderado.',
  },
  {
    id: 'lifestyle_creep',
    q: () => `Con €3.000/mes de sueldo, ¿cuánto es razonable gastar en vivienda?`,
    ctx: 'La regla del 30% dice que no deberías gastar más del 30% de ingresos en vivienda.',
    a: { label: '🏠 €900/mes (30% de ingresos)', apply: () => { /* proporcional correcto */ } },
    b: { label: '🏡 €1.200/mes (40% – más cómodo)', apply: () => { /* por encima del umbral */ } },
    comparison: 'Superar el 30-35% en vivienda compromete el resto del presupuesto: ahorro, emergencias, ocio. La comodidad tiene un coste de oportunidad real en tu trayectoria financiera.',
  },
  {
    id: 'stock_picking',
    q: () => `Un analista recomienda una acción "que va a doblar". ¿Inviertes €5.000 en ella?`,
    ctx: 'El 90% de los gestores activos no baten al índice. Los analistas de bolsa tampoco.',
    a: { label: '🎯 Sí, confío en el análisis (€5.000)', apply: () => { const amount = 5000; S.cash = Math.max(0, (S.cash||5000) - amount); S.invested = (S.invested||0) + amount; } },
    b: { label: '📊 No, prefiero añadirlo a mi ETF indexado', apply: () => { S.invested = (S.invested||0) + 5000; S.patrimony = (S.patrimony||0) + 5000; } },
    comparison: 'Los estudios muestran que seguir recomendaciones de analistas da resultados similares o peores al índice después de comisiones. La gestión indexada bate a la gran mayoría a largo plazo.',
  },
  {
    id: 'early_retirement',
    q: () => `Puedes retirarte a los 45 con €800.000 invertidos (retiro del 3,5%). ¿Lo haces?`,
    ctx: 'La regla del 4% puede ser demasiado agresiva para 40+ años de retiro. El 3-3,5% es más seguro.',
    a: { label: '🏝️ Sí, me retiro a los 45 (FIRE)', apply: () => { S.xp += 100; toast('🏝️ ¡FIRE activado!', 'Has elegido la libertad financiera.', 't-success'); } },
    b: { label: '💼 No, trabajo 5 años más para más seguridad', apply: () => { S.lifeSalary = (S.lifeSalary||1800) + 0; S.monthlyContribution = (S.monthlyContribution||200) + 500; } },
    comparison: 'Con €800.000 al 3,5% de retiro = €28.000/año. Si eso cubre tus gastos, el FIRE a los 45 es viable. Trabajar 5 años más puede añadir €150-200k adicionales y reducir el riesgo de secuencia.',
  },
  {
    id: 'subscriptions_audit',
    q: () => `Pagas €${Math.round((S.lifeSalary||1800)*0.04).toLocaleString('es')}/mes en suscripciones (Netflix, Spotify, gym, etc.). ¿Las reduces o las mantienes?`,
    ctx: 'Las suscripciones son el "gasto invisible" moderno. Se acumulan sin que las notemos.',
    a: { label: '✂️ Cancelar las que no uso activamente', apply: () => { const saving = Math.round((S.lifeSalary||1800)*0.02); S.cash = (S.cash||0) + saving*3; S.monthlyContribution = (S.monthlyContribution||200) + saving; } },
    b: { label: '📺 Mantener todas, mejoran mi calidad de vida', apply: () => { } },
    comparison: 'El español medio gasta €85/mes en suscripciones. Reducirlas a la mitad e invertir la diferencia durante 20 años al 7% genera €27.000 adicionales.',
  },
  {
    id: 'salary_negotiation',
    q: () => `Tu empresa te ofrece renovar contrato con el mismo salario (€${(S.lifeSalary||1800).toLocaleString('es')}). ¿Negocias una subida o aceptas?`,
    ctx: 'El mejor momento para negociar es cuando renuevas, no cuando estás desesperado.',
    a: { label: '💬 Negocio: pido un 10-15% más', apply: () => { S.lifeSalary = Math.round((S.lifeSalary||1800) * 1.1); } },
    b: { label: '🤝 Acepto, valoro la estabilidad', apply: () => { } },
    comparison: 'Negociar un 10% de subida hoy puede suponer €50.000-€100.000 extra a lo largo de tu carrera por el efecto acumulativo en sueldos futuros.',
  },
  {
    id: 'lump_sum_vs_dca',
    q: () => `Recibes €${Math.min(Math.round((S.cash||5000)*0.3), 15000).toLocaleString('es')} inesperados (bonus, herencia). ¿Inviertes todo de golpe o lo distribuyes en 12 meses?`,
    ctx: 'Invertir de golpe (lump sum) vs distribuir en el tiempo (DCA).',
    a: { label: '🚀 Todo de golpe (estadísticamente mejor)', apply: () => { const amt = Math.min(Math.round((S.cash||5000)*0.3), 15000); S.cash = Math.max(0,(S.cash||0)-amt); S.invested = (S.invested||0)+amt; } },
    b: { label: '📅 Lo distribuyo en 12 meses (más tranquilidad)', apply: () => { const amt = Math.min(Math.round((S.cash||5000)*0.3), 15000); S.monthlyContribution = (S.monthlyContribution||200) + Math.round(amt/12); } },
    comparison: 'Estudios de Vanguard muestran que invertir de golpe bate al DCA en ~68% de los casos. Pero el DCA reduce el riesgo psicológico de invertir en un máximo.',
  },
  {
    id: 'rent_increase',
    q: () => `Tu casero sube el alquiler €${Math.round((S.lifeSalary||1800)*0.08).toLocaleString('es')}/mes. ¿Negocias, te mudas o aceptas?`,
    ctx: 'El coste de mudarse (depósito, mudanza, tiempo) puede superar varios meses del incremento.',
    a: { label: '🏠 Negocio o busco piso más barato', apply: () => { } },
    b: { label: '✅ Acepto, el piso me compensa', apply: () => { const extra = Math.round((S.lifeSalary||1800)*0.08); S.cash = Math.max(0,(S.cash||0)-extra*3); } },
    comparison: 'Una mudanza cuesta de media €1.500-€3.000 + 1-2 meses de fianza. Si la subida es menor de €100/mes, mudarse puede no compensar el primer año.',
  },
  {
    id: 'tax_optimization',
    q: () => `Puedes reducir €1.500 de tu base imponible del IRPF aportando a un plan de pensiones. ¿Lo haces?`,
    ctx: 'Los planes de pensiones reducen impuestos hoy pero tributan al rescatarlos. Son líquidos solo en casos excepcionales.',
    a: { label: '🏦 Sí, ahorro impuestos ahora', apply: () => { S.xp += 30; S.cash = Math.max(0,(S.cash||0)-1500); S.invested = (S.invested||0)+1500; } },
    b: { label: '❌ No, prefiero mantener liquidez', apply: () => { } },
    comparison: 'Con IRPF al 30%, aportar €1.500 te devuelve €450 en la declaración. Pero el dinero queda bloqueado hasta jubilación. Ideal si tu tramo marginal es alto.',
  },
  {
    id: 'freelance_vs_empleado',
    q: () => `Te ofrecen irte de freelance con un contrato de €${Math.round((S.lifeSalary||1800)*1.4).toLocaleString('es')}/mes brutos (sin seguridad social). ¿Aceptas?`,
    ctx: 'Como freelance pagas tu propia Seguridad Social (~€300/mes) y tienes más incertidumbre pero más libertad.',
    a: { label: '🚀 Me voy de freelance (más dinero, más riesgo)', apply: () => { S.lifeSalary = Math.round((S.lifeSalary||1800)*1.4) - 300; } },
    b: { label: '🛡️ Me quedo como empleado (seguridad)', apply: () => { } },
    comparison: 'El freelance cobra más bruto pero asume cotizaciones, vacaciones no pagadas e ingresos variables. El salario equivalente real es ~20% menos de lo pactado.',
  },
  {
    id: 'consumption_vs_investment',
    q: () => `Tienes €3.000 de ahorro extra este año. ¿Te das un viaje o lo inviertes?`,
    ctx: 'Las experiencias dan felicidad a corto plazo. La inversión da libertad a largo plazo.',
    a: { label: '✈️ El viaje: las experiencias no se repiten', apply: () => { S.lifeHappiness = Math.min(100,(S.lifeHappiness||70)+8); S.cash = Math.max(0,(S.cash||0)-3000); } },
    b: { label: '📈 Lo invierto: el futuro yo me lo agradecerá', apply: () => { S.invested = (S.invested||0)+3000; S.cash = Math.max(0,(S.cash||0)-3000); } },
    comparison: 'No hay respuesta correcta universal. Si tu tasa de ahorro ya supera el 20%, disfrutar el presente es racional. Si no llega al 10%, prioriza la inversión.',
  },
  {
    id: 'credit_card_rewards',
    q: () => `Te ofrecen una tarjeta con 2% cashback en todas las compras. ¿La usas para todo y pagas íntegro cada mes?`,
    ctx: 'Las tarjetas de crédito pueden ser una herramienta o una trampa según cómo se usen.',
    a: { label: '💳 Sí, aprovecho el cashback (pago total)', apply: () => { S.cash = (S.cash||0) + 150; } },
    b: { label: '💵 No, solo uso débito para no tentarme', apply: () => { } },
    comparison: 'Usar crédito con pago íntegro mensual es neutral o positivo (cashback, seguros). El problema es cuando no se paga en su totalidad: el 24% TAE anula cualquier beneficio.',
  },
  {
    id: 'gold_allocation',
    q: () => `¿Tienes sentido poner un 10% de tu cartera en oro como "hedge"?`,
    ctx: 'El oro protege en crisis pero no genera rentabilidad real a largo plazo.',
    a: { label: '🥇 Sí, oro como hedge (10%)', apply: () => { /* simbólico */ } },
    b: { label: '📊 No, prefiero bonos del estado como hedge', apply: () => { /* más racional para cartera larga */ } },
    comparison: 'El oro ha dado 0% de rentabilidad real a 100 años pero protege en hiperinflación y crisis extremas. Los bonos a largo plazo tienen correlación negativa con la bolsa y mejor retorno real histórico.',
  },
];

function _f47_weekKey() {
  const now  = new Date();
  const y    = now.getFullYear();
  const jan1 = new Date(y, 0, 1);
  const week = Math.ceil(((now - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return y + '-W' + week;
}

function F47_checkShow() {
  if (!S.userName) return;
  const weekKey = _f47_weekKey();
  const ld = S.lastDilemma || {};
  if (ld.week === weekKey && ld.answered) return; // ya respondido esta semana
  // Solo mostrar los lunes (día 1)
  const dayOfWeek = new Date().getDay(); // 0=dom, 1=lun
  if (dayOfWeek !== 1) return;

  const idx     = (DILEMMAS.length + (parseInt(S.gameYear || 0) % DILEMMAS.length)) % DILEMMAS.length;
  const dilemma = DILEMMAS[idx];
  if (!dilemma) return;

  S.lastDilemma = { week: weekKey, answered: false, choice: null };
  saveState();

  setTimeout(() => _f47_showModal(dilemma, idx), 1500);
}

function _f47_showModal(dilemma, idx) {
  let modal = document.getElementById('m-f47-dilemma');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-f47-dilemma';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const question = typeof dilemma.q === 'function' ? dilemma.q() : dilemma.q;
  modal.innerHTML = `
    <div class="modal-box f47-modal">
      <div class="f47-badge">⚖️ Dilema de la semana</div>
      <div class="f47-question">${question}</div>
      <div class="f47-context">💡 ${dilemma.ctx}</div>
      <div class="f47-choices">
        <button class="f47-choice f47-choice-a" onclick="F47_choose('a', ${idx})">
          ${dilemma.a.label}
        </button>
        <button class="f47-choice f47-choice-b" onclick="F47_choose('b', ${idx})">
          ${dilemma.b.label}
        </button>
      </div>
      <div class="f47-skip">
        <button class="btn btn-ghost" onclick="closeModal('m-f47-dilemma')">Decidir más tarde</button>
      </div>
    </div>`;
  openModal('m-f47-dilemma');
}

function F47_choose(choice, idx) {
  const dilemma = DILEMMAS[idx];
  if (!dilemma) return;

  // Aplicar consecuencia
  const option = choice === 'a' ? dilemma.a : dilemma.b;
  const _xpBefore = S.xp || 0;
  if (typeof option.apply === 'function') option.apply();

  // +30 XP base para tomar la decisión
  const xpGain = Math.round(30 * (S.xpMultiplier || 1));
  S.xp += xpGain;
  const _totalXPDelta = (S.xp || 0) - _xpBefore;
  if (_totalXPDelta > 0 && typeof F34_onXPGained === 'function') F34_onXPGained(_totalXPDelta);
  spawnXP('+' + xpGain + ' XP');

  S.lastDilemma = { week: _f47_weekKey(), answered: true, choice };
  if (typeof recalcPatrimony === 'function') recalcPatrimony();
  saveState();
  if (typeof updateUIFromState === 'function') setTimeout(updateUIFromState, 100);

  // Mostrar consecuencia
  const modal = document.getElementById('m-f47-dilemma');
  if (modal) {
    const question = typeof dilemma.q === 'function' ? dilemma.q() : dilemma.q;
    const other    = choice === 'a' ? dilemma.b : dilemma.a;
    modal.querySelector('.modal-box').innerHTML = `
      <div class="f47-badge">✅ Decisión tomada</div>
      <div class="f47-question">${question}</div>
      <div class="f47-chosen">Elegiste: <strong>${option.label}</strong></div>
      <div class="f47-comparison">
        <div class="f47-comparison-title">📚 Lo que habrías obtenido con la otra opción:</div>
        <div class="f47-comparison-other">${other.label}</div>
        <div class="f47-comparison-analysis">${dilemma.comparison}</div>
      </div>
      <div class="f47-xp-gained">+${xpGain} XP por tu decisión</div>
      <button class="btn btn-primary btn-block" onclick="closeModal('m-f47-dilemma')">Entendido 💪</button>`;
  }
  SFX.xp && SFX.xp();
}

window.F47_checkShow = F47_checkShow;
window.F47_choose    = F47_choose;


/* ══════════════════════════════════════════════════════════════════
   F48 — RESUMEN SEMANAL AUTOMÁTICO (Spotify Wrapped)
   ─────────────────────────────────────────────────────────────────
   Cada lunes: compara S.weeklySnapshot con los valores actuales.
   Presenta la semana pasada en formato visual atractivo.
══════════════════════════════════════════════════════════════════ */

function F48_updateSnapshot() {
  if (!S.userName) return;
  const weekKey = _f48_weekKey();
  const snap = S.weeklySnapshot || {};

  if (snap.weekKey !== weekKey) {
    // Nueva semana: guardar snapshot del inicio de esta semana
    S.weeklySnapshot = {
      weekKey,
      prev:    snap.cur || null, // la semana anterior pasa a "prev"
      cur:     { xp: S.xp, mods: (S.completedMods||[]).length, patrimony: Math.round(S.patrimony||0), streak: S.streak||0, date: new Date().toISOString() },
    };
    saveState();
  } else {
    // Actualizar "cur" con los valores actuales
    const existing = S.weeklySnapshot;
    existing.cur = { xp: S.xp, mods: (S.completedMods||[]).length, patrimony: Math.round(S.patrimony||0), streak: S.streak||0, date: new Date().toISOString() };
    saveState();
  }
}

function _f48_weekKey() {
  const now  = new Date();
  const y    = now.getFullYear();
  const jan1 = new Date(y, 0, 1);
  const week = Math.ceil(((now - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return y + '-W' + week;
}

function F48_checkShow() {
  if (!S.userName) return;
  const snap = S.weeklySnapshot || {};
  if (!snap.prev) return; // sin datos de semana anterior
  const weekKey = _f48_weekKey();
  if (S.weeklyReviewSeen === weekKey) return; // ya vista
  // Solo mostrar el lunes
  if (new Date().getDay() !== 1) return;

  S.weeklyReviewSeen = weekKey;
  saveState();

  // En lunes hay ruleta diaria (1.2s) + welcome-back (5.8s) — retrasar para no solapar
  const _hadLongAbsence = (S.lastLoginTimestamp || 0) > 0 && (Date.now() - (S.lastLoginTimestamp || 0)) < 60000;
  setTimeout(() => F48_showReview(snap.prev, snap.cur), _hadLongAbsence ? 9000 : 2500);
}

function F48_showReview(prev, cur) {
  if (!prev || !cur) return;

  const xpGained   = (cur.xp || 0) - (prev.xp || 0);
  const modsWeek   = (cur.mods || 0) - (prev.mods || 0);
  const patriDelta = (cur.patrimony || 0) - (prev.patrimony || 0);
  const streak     = cur.streak || 0;

  const xpSign  = xpGained >= 0 ? '+' : '';
  const patSign = patriDelta >= 0 ? '+' : '';

  let coachMsg = '';
  if (xpGained >= 200 && modsWeek >= 3) {
    coachMsg = `🔥 Semana élite. Llevas una racha de ${streak} días y ${modsWeek} módulos esta semana. Imparable.`;
  } else if (xpGained >= 100) {
    coachMsg = `💪 Buena semana. ${xpGained} XP ganados. Si mantienes este ritmo, alcanzarás tus metas financieras antes de lo previsto.`;
  } else if (xpGained > 0) {
    coachMsg = `📈 Semana de progreso. El rebote completo está en tus manos esta semana. ¡Tú puedes!`;
  } else {
    coachMsg = `💡 Semana complicada. Recuerda: el 80% del camino hacia la independencia financiera es la constancia, no la perfección.`;
  }

  let modal = document.getElementById('m-f48-weekly');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-f48-weekly';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-box f48-modal">
      <div class="f48-header">
        <div class="f48-week-label">Tu Semana Financiera 📊</div>
        <div class="f48-week-dates">Resumen de la semana pasada</div>
      </div>
      <div class="f48-big-xp">
        <div class="f48-xp-num">${xpSign}${xpGained.toLocaleString('es')}</div>
        <div class="f48-xp-label">XP ganados esta semana</div>
      </div>
      <div class="f48-highlights">
        <div class="f48-hi-card">
          <div class="f48-hi-icon">📚</div>
          <div class="f48-hi-val">${modsWeek}</div>
          <div class="f48-hi-lab">Módulos</div>
        </div>
        <div class="f48-hi-card">
          <div class="f48-hi-icon">💰</div>
          <div class="f48-hi-val">${patSign}€${Math.abs(patriDelta).toLocaleString('es')}</div>
          <div class="f48-hi-lab">Patrimonio</div>
        </div>
        <div class="f48-hi-card">
          <div class="f48-hi-icon">🔥</div>
          <div class="f48-hi-val">${streak}</div>
          <div class="f48-hi-lab">Racha</div>
        </div>
      </div>
      <div class="f48-coach-msg">${coachMsg}</div>
      <div class="f48-actions">
        <button class="btn btn-primary" onclick="F48_shareWeek(${xpGained},${modsWeek},${streak})">📤 Compartir</button>
        <button class="btn btn-ghost"   onclick="closeModal('m-f48-weekly')">Ver más tarde</button>
      </div>
    </div>`;
  openModal('m-f48-weekly');
}

function F48_shareWeek(xpGained, modsWeek, streak) {
  const text = `Mi semana en FinLearn 💰\n+${xpGained} XP ganados\n📚 ${modsWeek} módulos completados\n🔥 ${streak} días de racha\n¿Y la tuya? finlearn.app`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => toast('📋 Copiado', 'Comparte tu semana financiera.', 't-success'));
  } else {
    prompt('Copia:', text);
  }
}

window.F48_updateSnapshot = F48_updateSnapshot;
window.F48_checkShow      = F48_checkShow;
window.F48_showReview     = F48_showReview;
window.F48_shareWeek      = F48_shareWeek;


/* ══════════════════════════════════════════════════════════════════
   M1 — DOBLE XP EN FIN DE SEMANA
   ─────────────────────────────────────────────────────────────────
   Viernes-domingo: S.xpMultiplier se duplica temporalmente.
   Banner amarillo en home.
══════════════════════════════════════════════════════════════════ */

function M1_checkDoubleXP() {
  const day = new Date().getDay(); // 0=dom, 5=vie, 6=sab
  const isWeekend = day === 0 || day === 5 || day === 6;
  const banner = document.getElementById('m1-dxp-banner');
  if (!banner) return;

  if (isWeekend) {
    const now = new Date();
    const endOfSunday = new Date(now);
    const daysUntilMonday = day === 0 ? 1 : (day === 5 ? 3 : 2);
    endOfSunday.setDate(now.getDate() + daysUntilMonday);
    endOfSunday.setHours(0, 0, 0, 0);
    const endTs = endOfSunday.getTime();
    const hLeft = Math.max(0, Math.round((endOfSunday - now) / 3600000));

    // Aplicar el multiplicador x2 hasta final del domingo si no hay uno más largo activo
    if (S && (!S.xpMultiplierExpiry || S.xpMultiplierExpiry < endTs)) {
      S.xpMultiplierExpiry = endTs;
      if (typeof saveState === 'function') saveState();
    }

    banner.style.display = '';
    banner.innerHTML = `<div class="m1-banner">⚡ DOBLE XP activo — quedan ${hLeft}h · ¡Aprovecha el fin de semana!</div>`;
  } else {
    banner.style.display = 'none';
  }
}

window.M1_checkDoubleXP = M1_checkDoubleXP;


/* ══════════════════════════════════════════════════════════════════
   M2 — PRESTIGE SYSTEM "Nueva Vida Financiera"
   ─────────────────────────────────────────────────────────────────
   Si FIRE % >= 100%: botón para iniciar nueva vida.
   Mantiene: completedMods, badges, streak, xpMultiplier.
   Bonus: +0.25 al multiplicador + badge "Retirado 🌴".
══════════════════════════════════════════════════════════════════ */

function M2_checkPrestige() {
  const firePct = _calcFirePct ? _calcFirePct() : 0;
  const btn = document.getElementById('m2-prestige-btn');
  if (btn) btn.style.display = firePct >= 100 ? '' : 'none';
}

function _calcFirePct() {
  const monthlyExpenses = Math.round((S.lifeSalary || S.monthlyIncome || 1800) * 0.7);
  const target = monthlyExpenses * 12 * 25;
  return target > 0 ? Math.min(100, Math.round(((S.patrimony || 0) / target) * 100)) : 0;
}

function M2_initPrestige() {
  if (_calcFirePct() < 100) { toast('⚠️ Aún no', 'Necesitas alcanzar el 100% de tu objetivo FIRE primero.', 't-warn'); return; }

  // Guardar lo que se mantiene
  const keep = {
    completedMods:  [...(S.completedMods || [])],
    badges:         [...(S.badges || [])],
    streak:         S.streak || 0,
    maxStreak:      S.maxStreak || 0,
    xpMultiplier:   +((S.xpMultiplier || 1) + 0.25).toFixed(2),
    prestigeCount:  (S.prestigeCount || 0) + 1,
    userName:       S.userName,
    avatar:         S.avatar,
    goal:           S.goal,
    goalLabel:      S.goalLabel,
    xp:             S.xp,
  };

  // Reset financiero
  Object.assign(S, {
    cash: 5000, invested: 0, patrimony: 5000,
    portfolio: {}, debts: [], businesses: {},
    totalDividends: 0, ledger: [],
    lifeAge: 25, gameDay: 0, gameYear: 0,
    patrimonyHistory: [], patrimonyDaily: [],
  });

  // Restaurar lo guardado
  Object.assign(S, keep);

  // Añadir badge prestige
  if (!S.badges.includes('prestige_1')) S.badges.push('prestige_' + S.prestigeCount);

  saveState();
  toast('🌴 ¡Nueva Vida Financiera!', `Prestige #${S.prestigeCount} iniciado. Multiplicador permanente: ×${S.xpMultiplier.toFixed(1)}`, 't-success');
  SFX.levelUp && SFX.levelUp();
  confetti && confetti();
  if (typeof renderHomeScreen === 'function') setTimeout(renderHomeScreen, 500);
}

window.M2_checkPrestige = M2_checkPrestige;
window.M2_initPrestige  = M2_initPrestige;


/* ══════════════════════════════════════════════════════════════════
   M3 — FRIEND STREAK
   ─────────────────────────────────────────────────────────────────
   Código único de 6 chars. Racha compartida simulada via localStorage.
══════════════════════════════════════════════════════════════════ */

function M3_getOrCreateCode() {
  if (!S.friendCode) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    S.friendCode = Array(6).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    saveState();
  }
  return S.friendCode;
}

function M3_addFriend(code) {
  toast('🔜 Próximamente', 'La función de amigos llegará en la próxima versión. ¡Mantente al tanto!', 't-success');
}

function M3_render() {
  const el = document.getElementById('m3-friend-streak');
  if (!el) return;
  const code = M3_getOrCreateCode();
  const fs   = S.friendStreak || 0;
  el.innerHTML = `
    <div class="m3-wrap">
      <div class="m3-code-row">
        <span class="m3-label">Tu código:</span>
        <strong class="m3-code">${code}</strong>
        <button class="m3-copy-btn" onclick="navigator.clipboard&&navigator.clipboard.writeText('${code}').then(()=>toast('📋 Copiado','',  't-success'))">📋</button>
      </div>
      ${fs > 0
        ? `<div class="m3-streak-row">🤝 Racha con amigo: <strong>${fs} días</strong></div>`
        : `<div class="m3-add-row">
             <input id="m3-friend-input" class="m3-input" placeholder="Código amigo (6 chars)" maxlength="6">
             <button class="btn btn-primary m3-add-btn" onclick="M3_addFriend(document.getElementById('m3-friend-input').value.toUpperCase())">Añadir</button>
           </div>`
      }
    </div>`;
}

window.M3_getOrCreateCode = M3_getOrCreateCode;
window.M3_addFriend       = M3_addFriend;
window.M3_render          = M3_render;


/* ══════════════════════════════════════════════════════════════════
   PRIORIDAD 1 — HERRAMIENTAS REALES
   ─────────────────────────────────────────────────────────────────
   T1  Simulador IRPF 2025
   T2  Calculadora Hipoteca vs Alquiler
   T3  Proyector FIRE interactivo (Chart.js)
   T4  Simulador Bola de Nieve de Deudas
   T5  Calculadora Interés Compuesto visual (Chart.js)
   T6  Net Worth Tracker (persistido en localStorage)
══════════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────────
   renderToolsScreen — Menú principal de herramientas
───────────────────────────────────────────────────────────────── */

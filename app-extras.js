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
function renderToolsScreen() {
  const el = document.getElementById('s-tools');
  if (!el) return;
  el.innerHTML = `
    <div class="tools-header">
      <h2 class="tools-title">🔧 Herramientas Reales</h2>
      <p class="tools-subtitle">Calcula, proyecta y decide con datos reales</p>
    </div>
    <div class="tools-grid">
      <button class="tool-card" onclick="openTool('irpf')">
        <span class="tool-icon">🧾</span>
        <div class="tool-info">
          <div class="tool-name">Simulador IRPF 2025</div>
          <div class="tool-desc">Calcula tu cuota y tipo efectivo</div>
        </div>
        <span class="tool-arrow">›</span>
      </button>
      <button class="tool-card" onclick="openTool('hipoteca')">
        <span class="tool-icon">🏠</span>
        <div class="tool-info">
          <div class="tool-name">Hipoteca vs Alquiler</div>
          <div class="tool-desc">Break-even, costes reales, ITP</div>
        </div>
        <span class="tool-arrow">›</span>
      </button>
      <button class="tool-card" onclick="openTool('fire')">
        <span class="tool-icon">🔥</span>
        <div class="tool-info">
          <div class="tool-name">Proyector FIRE</div>
          <div class="tool-desc">Gráfico a 30 años + año de independencia</div>
        </div>
        <span class="tool-arrow">›</span>
      </button>
      <button class="tool-card" onclick="openTool('snowball')">
        <span class="tool-icon">❄️</span>
        <div class="tool-info">
          <div class="tool-name">Bola de Nieve</div>
          <div class="tool-desc">Snowball vs Avalanche: elige tu estrategia</div>
        </div>
        <span class="tool-arrow">›</span>
      </button>
      <button class="tool-card" onclick="openTool('compound')">
        <span class="tool-icon">📈</span>
        <div class="tool-info">
          <div class="tool-name">Interés Compuesto</div>
          <div class="tool-desc">Visualiza el poder del tiempo</div>
        </div>
        <span class="tool-arrow">›</span>
      </button>
      <button class="tool-card" onclick="openTool('networth')">
        <span class="tool-icon">💎</span>
        <div class="tool-info">
          <div class="tool-name">Net Worth Tracker</div>
          <div class="tool-desc">Patrimonio neto real con histórico</div>
        </div>
        <span class="tool-arrow">›</span>
      </button>
      <button class="tool-card" onclick="openTool('simhipoteca')">
        <span class="tool-icon">🏦</span>
        <div class="tool-info">
          <div class="tool-name">Simulador Hipoteca</div>
          <div class="tool-desc">Cuota, amortización, ITP y comparativas</div>
        </div>
        <span class="tool-arrow">›</span>
      </button>
      <button class="tool-card" onclick="openTool('dca')">
        <span class="tool-icon">📆</span>
        <div class="tool-info">
          <div class="tool-name">DCA vs Lump Sum</div>
          <div class="tool-desc">¿Invertir poco a poco o todo de golpe?</div>
        </div>
        <span class="tool-arrow">›</span>
      </button>
    </div>
  `;
}

function openTool(id) {
  const fns = { irpf: T1_open, hipoteca: T2_open, fire: T3_open, snowball: T4_open, compound: T5_open, networth: T6_open, simhipoteca: T7_open, dca: T8_open };
  if (fns[id]) {
    fns[id]();
    // P4-C: registrar herramienta usada (tracker de herramientas únicas esta semana)
    if (typeof tickMissionTool === 'function') tickMissionTool(id);
  }
}

/* ─────────────────────────────────────────────────────────────────
   T1 — SIMULADOR IRPF 2025
   Tramos estatales + autonómicos (media). Sin API, puro cálculo.
───────────────────────────────────────────────────────────────── */
function T1_open() {
  const modal = document.getElementById('tool-modal');
  if (!modal) return;
  modal.innerHTML = `
    <div class="tool-modal-inner">
      <div class="tool-modal-head">
        <button class="tool-back" onclick="closeToolModal()">‹ Volver</button>
        <h3>🧾 Simulador IRPF 2025</h3>
      </div>
      <div class="tool-body">
        <div class="tool-section">
          <label class="tool-label">Ingresos del trabajo (brutos/año) €</label>
          <input id="t1-salary" class="tool-input" type="number" placeholder="35000" value="35000" oninput="T1_calc()">
        </div>
        <div class="tool-section">
          <label class="tool-label">Otros ingresos (alquiler, freelance, etc.) €</label>
          <input id="t1-other" class="tool-input" type="number" placeholder="0" value="0" oninput="T1_calc()">
        </div>
        <div class="tool-section">
          <label class="tool-label">Aportación Plan de Pensiones €</label>
          <input id="t1-pp" class="tool-input" type="number" placeholder="0" value="0" oninput="T1_calc()">
        </div>
        <div class="tool-section">
          <label class="tool-label">Situación familiar</label>
          <select id="t1-family" class="tool-select" onchange="T1_calc()">
            <option value="0">Soltero/a sin hijos</option>
            <option value="1">Con 1 hijo menor de 3 años</option>
            <option value="2">Con 2+ hijos</option>
            <option value="3">Familia numerosa</option>
          </select>
        </div>
        <div class="tool-section">
          <label class="tool-label">Comunidad Autónoma</label>
          <select id="t1-ca" class="tool-select" onchange="T1_calc()">
            <option value="0.00">Media nacional</option>
            <option value="0.01">Andalucía (bonificada)</option>
            <option value="0.00">Cataluña (estándar)</option>
            <option value="-0.01">Madrid (reducida)</option>
            <option value="0.01">Valencia</option>
            <option value="0.00">País Vasco (foral)</option>
          </select>
        </div>
        <div id="t1-result" class="tool-result hidden"></div>
        <button class="btn btn-primary tool-calc-btn" onclick="T1_calc()">Calcular</button>
      </div>
    </div>
  `;
  modal.classList.add('active');
  T1_calc();
}

function T1_calc() {
  try {
    const salary   = parseFloat(document.getElementById('t1-salary')?.value) || 0;
    const other    = parseFloat(document.getElementById('t1-other')?.value)  || 0;
    const pp       = Math.min(parseFloat(document.getElementById('t1-pp')?.value) || 0, 1500);
    const family   = parseInt(document.getElementById('t1-family')?.value)   || 0;
    const caAdj    = parseFloat(document.getElementById('t1-ca')?.value)     || 0;

    // Reducción por rendimientos del trabajo (Art.20 LIRPF 2025)
    let redTrabajo = 0;
    const netSalary = salary - pp;
    if (netSalary <= 13115)      redTrabajo = 5565;
    else if (netSalary <= 16825) redTrabajo = 5565 - 1.5 * (netSalary - 13115);
    else                          redTrabajo = 0;

    // Mínimo personal y familiar
    let minPersonal = 5550;
    if (family === 1) minPersonal += 2400;
    else if (family === 2) minPersonal += 4800;
    else if (family === 3) minPersonal += 7200;

    const baseGeneral = Math.max(0, salary + other - pp - redTrabajo);

    // Cuota íntegra estatal (tramos 2024)
    function cuotaEstatal(base) {
      const tramos = [[12450, 0.095], [7750, 0.12], [15000, 0.15], [24800, 0.185], [Infinity, 0.225]];
      let cuota = 0, rest = base;
      for (const [lim, rate] of tramos) {
        const chunk = Math.min(rest, lim);
        cuota += chunk * rate;
        rest -= chunk;
        if (rest <= 0) break;
      }
      return cuota;
    }

    // Cuota autonómica (tramos autonómicos estándar ajustados)
    function cuotaAutonomica(base, adj) {
      const tramos = [[12450, 0.09 + adj], [7750, 0.12 + adj], [15000, 0.14 + adj], [24800, 0.175 + adj], [Infinity, 0.215 + adj]];
      let cuota = 0, rest = base;
      for (const [lim, rate] of tramos) {
        const chunk = Math.min(rest, lim);
        cuota += Math.max(0, chunk * rate);
        rest -= chunk;
        if (rest <= 0) break;
      }
      return cuota;
    }

    const cuotaEst  = cuotaEstatal(Math.max(0, baseGeneral - minPersonal));
    const cuotaAut  = cuotaAutonomica(Math.max(0, baseGeneral - minPersonal), caAdj);
    const cuotaTotal = cuotaEst + cuotaAut;

    // Retenciones aproximadas (modelo simplificado)
    const retencion = salary * T1_tipoRetencion(salary);
    const resultado = retencion - cuotaTotal;
    const tipoEfectivo = baseGeneral > 0 ? (cuotaTotal / (salary + other)) * 100 : 0;
    const tipoMarginal = T1_tipoMarginal(baseGeneral);

    const res = document.getElementById('t1-result');
    if (!res) return;
    const sign = resultado >= 0 ? '+' : '';
    const color = resultado >= 0 ? 'var(--green)' : 'var(--red)';
    res.classList.remove('hidden');
    res.innerHTML = `
      <div class="t1-result-grid">
        <div class="t1-stat">
          <div class="t1-stat-label">Base imponible general</div>
          <div class="t1-stat-val">${_fmt(baseGeneral)}€</div>
        </div>
        <div class="t1-stat">
          <div class="t1-stat-label">Cuota íntegra total</div>
          <div class="t1-stat-val">${_fmt(cuotaTotal)}€</div>
        </div>
        <div class="t1-stat">
          <div class="t1-stat-label">Tipo efectivo</div>
          <div class="t1-stat-val">${tipoEfectivo.toFixed(1)}%</div>
        </div>
        <div class="t1-stat">
          <div class="t1-stat-label">Tipo marginal</div>
          <div class="t1-stat-val">${tipoMarginal}%</div>
        </div>
        <div class="t1-stat t1-highlight" style="border-color:${color}">
          <div class="t1-stat-label">Resultado estimado</div>
          <div class="t1-stat-val" style="color:${color}">${sign}${_fmt(resultado)}€</div>
          <div class="t1-stat-sub">${resultado >= 0 ? '✅ A devolver' : '⚠️ A pagar'}</div>
        </div>
        <div class="t1-stat">
          <div class="t1-stat-label">Neto anual tras IRPF</div>
          <div class="t1-stat-val">${_fmt(salary + other - cuotaTotal)}€</div>
        </div>
      </div>
      <div class="tool-disclaimer">⚠️ Estimación orientativa. Consulta a un asesor fiscal o la calculadora oficial de la AEAT para tu declaración real.</div>
    `;
  } catch(e) { console.warn('T1_calc error', e); }
}

function T1_tipoRetencion(salary) {
  if (salary <= 12450) return 0;
  if (salary <= 20200) return 0.1;
  if (salary <= 35200) return 0.15;
  if (salary <= 60000) return 0.24;
  return 0.3;
}
function T1_tipoMarginal(base) {
  if (base <= 12450) return 19;
  if (base <= 20200) return 24;
  if (base <= 35200) return 30;
  if (base <= 60000) return 37;
  if (base <= 300000) return 45;
  return 47;
}

/* ─────────────────────────────────────────────────────────────────
   T2 — CALCULADORA HIPOTECA vs ALQUILER
───────────────────────────────────────────────────────────────── */
function T2_open() {
  const modal = document.getElementById('tool-modal');
  if (!modal) return;
  modal.innerHTML = `
    <div class="tool-modal-inner">
      <div class="tool-modal-head">
        <button class="tool-back" onclick="closeToolModal()">‹ Volver</button>
        <h3>🏠 Hipoteca vs Alquiler</h3>
      </div>
      <div class="tool-body">
        <div class="t2-tabs">
          <button class="t2-tab active" onclick="T2_setTab('compra',this)">🏡 Compra</button>
          <button class="t2-tab" onclick="T2_setTab('alquiler',this)">🏙️ Alquiler</button>
          <button class="t2-tab" onclick="T2_setTab('comparar',this)">⚖️ Comparar</button>
        </div>
        <div id="t2-compra" class="t2-panel">
          <div class="tool-section">
            <label class="tool-label">Precio del inmueble €</label>
            <input id="t2-price" class="tool-input" type="number" value="250000" oninput="T2_calc()">
          </div>
          <div class="tool-section">
            <label class="tool-label">Entrada % (recomendado 20%)</label>
            <input id="t2-down" class="tool-input" type="range" min="10" max="50" value="20" oninput="T2_updateRange('t2-down','t2-down-val','%'); T2_calc()">
            <span id="t2-down-val" class="tool-range-val">20%</span>
          </div>
          <div class="tool-section">
            <label class="tool-label">Tipo de interés % (fijo/variable)</label>
            <input id="t2-rate" class="tool-input" type="number" step="0.1" value="3.5" oninput="T2_calc()">
          </div>
          <div class="tool-section">
            <label class="tool-label">Plazo hipoteca (años)</label>
            <input id="t2-years" class="tool-input" type="range" min="10" max="30" value="25" oninput="T2_updateRange('t2-years','t2-years-val',' años'); T2_calc()">
            <span id="t2-years-val" class="tool-range-val">25 años</span>
          </div>
          <div class="tool-section">
            <label class="tool-label">Comunidad Autónoma (ITP)</label>
            <select id="t2-ca" class="tool-select" onchange="T2_calc()">
              <option value="0.07">Andalucía 7%</option>
              <option value="0.10">Cataluña 10%</option>
              <option value="0.06">Madrid 6%</option>
              <option value="0.10">Valencia 10%</option>
              <option value="0.07">Galicia 7%</option>
              <option value="0.07">Aragón 7%</option>
              <option value="0.08">Castilla-La Mancha 8%</option>
              <option value="0.08">Murcia 8%</option>
              <option value="0.08">Islas Baleares 8%</option>
            </select>
          </div>
        </div>
        <div id="t2-alquiler" class="t2-panel hidden">
          <div class="tool-section">
            <label class="tool-label">Alquiler mensual equivalente €</label>
            <input id="t2-rent" class="tool-input" type="number" value="900" oninput="T2_calc()">
          </div>
          <div class="tool-section">
            <label class="tool-label">Incremento anual del alquiler %</label>
            <input id="t2-rent-inc" class="tool-input" type="number" step="0.1" value="2.5" oninput="T2_calc()">
          </div>
          <div class="tool-section">
            <label class="tool-label">Rentabilidad inversión alternativa %</label>
            <input id="t2-inv" class="tool-input" type="number" step="0.1" value="7" oninput="T2_calc()">
          </div>
        </div>
        <div id="t2-result" class="tool-result hidden"></div>
        <div id="t2-comparar-panel" class="hidden">
          <canvas id="t2-chart" height="200"></canvas>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
  T2_calc();
}

function T2_setTab(tab, btn) {
  document.querySelectorAll('.t2-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['t2-compra','t2-alquiler'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('hidden', !id.includes(tab === 'alquiler' ? 'alquiler' : tab === 'compra' ? 'compra' : ''));
  });
  if (tab === 'comparar') {
    document.getElementById('t2-compra')?.classList.remove('hidden');
    document.getElementById('t2-alquiler')?.classList.remove('hidden');
    document.getElementById('t2-comparar-panel')?.classList.remove('hidden');
  } else {
    document.getElementById('t2-comparar-panel')?.classList.add('hidden');
  }
  T2_calc();
}

function T2_updateRange(inputId, labelId, suffix) {
  const val = document.getElementById(inputId)?.value;
  const lbl = document.getElementById(labelId);
  if (lbl) lbl.textContent = val + suffix;
}

function T2_calc() {
  try {
    const price  = parseFloat(document.getElementById('t2-price')?.value) || 250000;
    const down   = (parseFloat(document.getElementById('t2-down')?.value) || 20) / 100;
    const rate   = (parseFloat(document.getElementById('t2-rate')?.value) || 3.5) / 100 / 12;
    const years  = parseInt(document.getElementById('t2-years')?.value) || 25;
    const itp    = parseFloat(document.getElementById('t2-ca')?.value) || 0.07;
    const rent   = parseFloat(document.getElementById('t2-rent')?.value) || 900;
    const rentInc= (parseFloat(document.getElementById('t2-rent-inc')?.value) || 2.5) / 100;
    const invRet = (parseFloat(document.getElementById('t2-inv')?.value) || 7) / 100;

    const n       = years * 12;
    const entrada = price * down;
    const loan    = price * (1 - down);
    const gastos  = price * itp + price * 0.011; // ITP + notaría/registro ~1.1%
    const cuota   = rate > 0 ? loan * (rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1) : loan / n;
    const interesesTotal = cuota * n - loan;
    const ibi     = price * 0.0025; // ~0.25% anual
    const comunidad = 100 * 12;     // ~100€/mes comunidad
    const manto   = price * 0.01;   // 1% anual mantenimiento
    const costeAnualCompra = cuota * 12 + ibi + comunidad + manto;
    const costeTotalCompra = entrada + gastos + cuota * n + (ibi + comunidad + manto) * years;

    // Alquiler acumulado
    let totalAlquiler = 0, rentActual = rent;
    for (let y = 0; y < years; y++) { totalAlquiler += rentActual * 12; rentActual *= (1 + rentInc); }

    // Inversión alternativa (entrada + gastos invertidos + diferencia mensual)
    const diferenciaMensual = cuota + (ibi + comunidad + manto) / 12 - rent;
    const capitalInicial = entrada + gastos;
    const invMonthly = Math.max(0, diferenciaMensual);
    const invFinalEntrada = capitalInicial * Math.pow(1 + invRet / 12, n);
    const invFinalMensual = invMonthly * (Math.pow(1 + invRet / 12, n) - 1) / (invRet / 12);
    const totalInversion = invFinalEntrada + invFinalMensual;

    // Price-to-Rent ratio
    const ptrRatio = price / (rent * 12);

    const res = document.getElementById('t2-result');
    if (!res) return;
    res.classList.remove('hidden');
    const compraGana = costeTotalCompra < totalAlquiler + (totalInversion - capitalInicial);
    res.innerHTML = `
      <div class="t2-result-cols">
        <div class="t2-col">
          <div class="t2-col-title">🏡 Compra</div>
          <div class="t2-row"><span>Entrada + gastos</span><strong>${_fmt(entrada + gastos)}€</strong></div>
          <div class="t2-row"><span>Cuota mensual</span><strong>${_fmt(cuota)}€</strong></div>
          <div class="t2-row"><span>Coste anual total</span><strong>${_fmt(costeAnualCompra)}€</strong></div>
          <div class="t2-row"><span>Intereses ${years}a</span><strong>${_fmt(interesesTotal)}€</strong></div>
          <div class="t2-row t2-total"><span>Coste total ${years}a</span><strong>${_fmt(costeTotalCompra)}€</strong></div>
        </div>
        <div class="t2-col">
          <div class="t2-col-title">🏙️ Alquiler + Inversión</div>
          <div class="t2-row"><span>Capital invertido</span><strong>${_fmt(capitalInicial)}€</strong></div>
          <div class="t2-row"><span>Alquiler mensual</span><strong>${_fmt(rent)}€</strong></div>
          <div class="t2-row"><span>Total alquileres ${years}a</span><strong>${_fmt(totalAlquiler)}€</strong></div>
          <div class="t2-row"><span>Cartera al final</span><strong style="color:var(--green)">${_fmt(totalInversion)}€</strong></div>
          <div class="t2-row t2-total"><span>Patrimonio neto</span><strong>${_fmt(totalInversion - totalAlquiler)}€</strong></div>
        </div>
      </div>
      <div class="t2-ptr">
        <span>Price-to-Rent ratio: <strong>${ptrRatio.toFixed(1)}x</strong></span>
        <span class="t2-ptr-badge ${ptrRatio < 20 ? 't2-good' : ptrRatio < 25 ? 't2-neutral' : 't2-bad'}">${ptrRatio < 20 ? '✅ Zona de compra' : ptrRatio < 25 ? '⚠️ Zona gris' : '🔴 Alquilar es más eficiente'}</span>
      </div>
      <div class="tool-disclaimer">⚠️ Estimación orientativa. La decisión de comprar o alquilar depende también de tu estabilidad laboral y horizonte temporal.</div>
    `;
  } catch(e) { console.warn('T2_calc', e); }
}

/* ─────────────────────────────────────────────────────────────────
   T3 — PROYECTOR FIRE INTERACTIVO
───────────────────────────────────────────────────────────────── */
let _fireChart = null;
function T3_open() {
  const modal = document.getElementById('tool-modal');
  if (!modal) return;
  modal.innerHTML = `
    <div class="tool-modal-inner">
      <div class="tool-modal-head">
        <button class="tool-back" onclick="closeToolModal()">‹ Volver</button>
        <h3>🔥 Proyector FIRE</h3>
      </div>
      <div class="tool-body">
        <div class="t3-sliders">
          <div class="tool-section">
            <label class="tool-label">Edad actual: <strong id="t3-age-v">30</strong></label>
            <input id="t3-age" class="tool-input tool-slider" type="range" min="18" max="60" value="30" oninput="T3_update('age')">
          </div>
          <div class="tool-section">
            <label class="tool-label">Patrimonio actual: <strong id="t3-pat-v">10.000€</strong></label>
            <input id="t3-pat" class="tool-input tool-slider" type="range" min="0" max="500000" step="1000" value="10000" oninput="T3_update('pat')">
          </div>
          <div class="tool-section">
            <label class="tool-label">Aportación mensual: <strong id="t3-monthly-v">500€</strong></label>
            <input id="t3-monthly" class="tool-input tool-slider" type="range" min="50" max="5000" step="50" value="500" oninput="T3_update('monthly')">
          </div>
          <div class="tool-section">
            <label class="tool-label">Rentabilidad esperada: <strong id="t3-ret-v">7%</strong></label>
            <input id="t3-ret" class="tool-input tool-slider" type="range" min="2" max="15" step="0.5" value="7" oninput="T3_update('ret')">
          </div>
          <div class="tool-section">
            <label class="tool-label">Gastos anuales FIRE: <strong id="t3-exp-v">24.000€</strong></label>
            <input id="t3-exp" class="tool-input tool-slider" type="range" min="6000" max="120000" step="1000" value="24000" oninput="T3_update('exp')">
          </div>
        </div>
        <div id="t3-result-bar" class="t3-result-bar"></div>
        <canvas id="t3-chart" height="220" style="margin-top:16px"></canvas>
      </div>
    </div>
  `;
  modal.classList.add('active');
  T3_calc();
}

function T3_update(field) {
  const vals = { age: ['t3-age','t3-age-v',''], pat: ['t3-pat','t3-pat-v','€'], monthly: ['t3-monthly','t3-monthly-v','€'], ret: ['t3-ret','t3-ret-v','%'], exp: ['t3-exp','t3-exp-v','€'] };
  const [inputId, labelId, suffix] = vals[field] || [];
  const val = parseFloat(document.getElementById(inputId)?.value) || 0;
  const lbl = document.getElementById(labelId);
  if (lbl) lbl.textContent = (field === 'pat' || field === 'monthly' || field === 'exp') ? _fmt(val) + suffix : val + suffix;
  T3_calc();
}

function T3_calc() {
  try {
    const age     = parseInt(document.getElementById('t3-age')?.value) || 30;
    const pat     = parseFloat(document.getElementById('t3-pat')?.value) || 10000;
    const monthly = parseFloat(document.getElementById('t3-monthly')?.value) || 500;
    const ret     = (parseFloat(document.getElementById('t3-ret')?.value) || 7) / 100;
    const expenses= parseFloat(document.getElementById('t3-exp')?.value) || 24000;

    const fireNumber = expenses * 25; // Regla del 4%
    const retMonthly = ret / 12;
    const labels = [], dataPatrimony = [], dataFire = [];
    let patrimony = pat, fireAge = null, fireYear = null;

    for (let y = 0; y <= 40; y++) {
      labels.push(age + y);
      dataPatrimony.push(Math.round(patrimony));
      dataFire.push(fireNumber);
      if (!fireAge && patrimony >= fireNumber) { fireAge = age + y; fireYear = new Date().getFullYear() + y; }
      // Proyectar un año más
      for (let m = 0; m < 12; m++) {
        patrimony = patrimony * (1 + retMonthly) + monthly;
      }
    }

    // Render resultado
    const bar = document.getElementById('t3-result-bar');
    if (bar) {
      if (fireAge) {
        const yearsToFire = fireAge - age;
        bar.innerHTML = `
          <div class="t3-fire-result">
            <div class="t3-fire-stat"><span>🎯 Número FIRE</span><strong>${_fmt(fireNumber)}€</strong></div>
            <div class="t3-fire-stat"><span>🔥 Año FIRE</span><strong>${fireYear} (edad ${fireAge})</strong></div>
            <div class="t3-fire-stat"><span>⏱️ Años hasta FIRE</span><strong>${yearsToFire} años</strong></div>
            <div class="t3-fire-stat"><span>📅 Tasa de ahorro</span><strong>${((monthly * 12) / Math.max(1, monthly * 12 + expenses) * 100).toFixed(0)}%</strong></div>
          </div>
        `;
      } else {
        bar.innerHTML = `<div class="t3-fire-noreach">⚠️ Con estas condiciones no se alcanza FIRE en 40 años. Aumenta la aportación o reduce gastos.</div>`;
      }
    }

    // Chart.js
    if (typeof Chart === 'undefined') return;
    const ctx = document.getElementById('t3-chart');
    if (!ctx) return;
    if (_fireChart) { _fireChart.destroy(); _fireChart = null; }
    _fireChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Tu patrimonio', data: dataPatrimony, borderColor: '#6c63ff', backgroundColor: 'rgba(108,99,255,0.15)', fill: true, tension: 0.4, pointRadius: 0 },
          { label: 'Número FIRE', data: dataFire, borderColor: '#f5a623', borderDash: [6,4], fill: false, pointRadius: 0 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { labels: { color: '#a0a8c0', font: { size: 11 } } }, tooltip: { callbacks: { label: ctx => _fmt(ctx.raw) + '€' } } },
        scales: {
          x: { ticks: { color: '#a0a8c0', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#a0a8c0', font: { size: 10 }, callback: v => v >= 1000000 ? (v/1000000).toFixed(1)+'M€' : v >= 1000 ? (v/1000).toFixed(0)+'k€' : v+'€' }, grid: { color: 'rgba(255,255,255,0.05)' } }
        }
      }
    });
  } catch(e) { console.warn('T3_calc', e); }
}

/* ─────────────────────────────────────────────────────────────────
   T4 — SIMULADOR BOLA DE NIEVE DE DEUDAS
───────────────────────────────────────────────────────────────── */
let _snowChart = null;
function T4_open() {
  const modal = document.getElementById('tool-modal');
  if (!modal) return;
  modal.innerHTML = `
    <div class="tool-modal-inner">
      <div class="tool-modal-head">
        <button class="tool-back" onclick="closeToolModal()">‹ Volver</button>
        <h3>❄️ Bola de Nieve de Deudas</h3>
      </div>
      <div class="tool-body">
        <p class="tool-intro">Añade tus deudas y descubre qué estrategia te ahorra más dinero.</p>
        <div id="t4-debts-list"></div>
        <button class="btn btn-secondary t4-add-btn" onclick="T4_addRow()">+ Añadir deuda</button>
        <div class="tool-section" style="margin-top:12px">
          <label class="tool-label">Pago extra mensual disponible €</label>
          <input id="t4-extra" class="tool-input" type="number" value="200" oninput="T4_calc()">
        </div>
        <div id="t4-result" class="tool-result hidden"></div>
        <canvas id="t4-chart" height="200" style="margin-top:12px"></canvas>
      </div>
    </div>
  `;
  modal.classList.add('active');
  // Deudas de ejemplo
  window._t4Debts = [
    { name: 'Tarjeta VISA', balance: 2000, rate: 22, minPay: 60 },
    { name: 'Préstamo coche', balance: 8000, rate: 9, minPay: 200 },
    { name: 'Hipoteca', balance: 120000, rate: 3.5, minPay: 650 },
  ];
  T4_renderRows();
  T4_calc();
}

function T4_addRow() {
  window._t4Debts = window._t4Debts || [];
  window._t4Debts.push({ name: 'Nueva deuda', balance: 5000, rate: 10, minPay: 150 });
  T4_renderRows();
  T4_calc();
}

function T4_renderRows() {
  const list = document.getElementById('t4-debts-list');
  if (!list) return;
  list.innerHTML = (window._t4Debts || []).map((d, i) => `
    <div class="t4-debt-row">
      <input class="t4-input t4-name" type="text" value="${d.name}" placeholder="Nombre" oninput="T4_update(${i},'name',this.value)">
      <div class="t4-row-fields">
        <div><span class="t4-lbl">Saldo €</span><input class="t4-input" type="number" value="${d.balance}" oninput="T4_update(${i},'balance',this.value)"></div>
        <div><span class="t4-lbl">TAE %</span><input class="t4-input" type="number" step="0.1" value="${d.rate}" oninput="T4_update(${i},'rate',this.value)"></div>
        <div><span class="t4-lbl">Mín €</span><input class="t4-input" type="number" value="${d.minPay}" oninput="T4_update(${i},'minPay',this.value)"></div>
        <button class="t4-del" onclick="T4_removeRow(${i})">✕</button>
      </div>
    </div>
  `).join('');
}

function T4_update(i, field, val) {
  if (!window._t4Debts?.[i]) return;
  window._t4Debts[i][field] = (field === 'name') ? val : parseFloat(val) || 0;
  T4_calc();
}
function T4_removeRow(i) {
  window._t4Debts?.splice(i, 1);
  T4_renderRows();
  T4_calc();
}

function T4_simulate(debts, extra, strategy) {
  // Deep copy
  let ds = debts.map(d => ({ ...d }));
  // Ordenar: snowball = menor saldo primero, avalanche = mayor tasa primero
  ds.sort((a, b) => strategy === 'snowball' ? a.balance - b.balance : b.rate - a.rate);
  let month = 0, totalInterest = 0;
  while (ds.some(d => d.balance > 0) && month < 600) {
    month++;
    let extraLeft = extra;
    // Pagar mínimos + calcular intereses
    for (const d of ds) {
      if (d.balance <= 0) continue;
      const interest = d.balance * (d.rate / 100 / 12);
      totalInterest += interest;
      d.balance += interest;
      const pay = Math.min(d.balance, d.minPay);
      d.balance -= pay;
      if (d.balance < 0) d.balance = 0;
    }
    // Aplicar extra a la primera deuda con saldo (según estrategia)
    for (const d of ds) {
      if (d.balance <= 0 || extraLeft <= 0) continue;
      const pay = Math.min(d.balance, extraLeft);
      d.balance -= pay;
      extraLeft -= pay;
    }
  }
  return { months: month, interest: totalInterest };
}

function T4_calc() {
  try {
    const debts = (window._t4Debts || []).filter(d => d.balance > 0);
    const extra = parseFloat(document.getElementById('t4-extra')?.value) || 0;
    if (!debts.length) { document.getElementById('t4-result')?.classList.add('hidden'); return; }

    const snowball = T4_simulate(debts, extra, 'snowball');
    const avalanche = T4_simulate(debts, extra, 'avalanche');
    const totalDebt = debts.reduce((s, d) => s + d.balance, 0);

    const res = document.getElementById('t4-result');
    if (res) {
      res.classList.remove('hidden');
      const snowWins = avalanche.interest < snowball.interest;
      res.innerHTML = `
        <div class="t4-compare">
          <div class="t4-strat ${!snowWins ? 't4-winner' : ''}">
            <div class="t4-strat-name">❄️ Snowball</div>
            <div class="t4-strat-stat"><span>Meses libre</span><strong>${snowball.months}</strong></div>
            <div class="t4-strat-stat"><span>Intereses total</span><strong>${_fmt(snowball.interest)}€</strong></div>
            ${!snowWins ? '<div class="t4-best">✅ Más motivador</div>' : ''}
          </div>
          <div class="t4-strat ${snowWins ? 't4-winner' : ''}">
            <div class="t4-strat-name">🌊 Avalanche</div>
            <div class="t4-strat-stat"><span>Meses libre</span><strong>${avalanche.months}</strong></div>
            <div class="t4-strat-stat"><span>Intereses total</span><strong>${_fmt(avalanche.interest)}€</strong></div>
            ${snowWins ? '<div class="t4-best">✅ Ahorra más dinero (+' + _fmt(snowball.interest - avalanche.interest) + '€)</div>' : ''}
          </div>
        </div>
        <div class="t4-summary">Deuda total: <strong>${_fmt(totalDebt)}€</strong> · Con ${extra}€ extra/mes quedarás libre en <strong>${Math.min(snowball.months, avalanche.months)} meses</strong></div>
      `;
    }

    // Chart comparativo
    if (typeof Chart !== 'undefined') {
      const ctx = document.getElementById('t4-chart');
      if (!ctx) return;
      if (_snowChart) { _snowChart.destroy(); _snowChart = null; }
      _snowChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Snowball ❄️', 'Avalanche 🌊'],
          datasets: [
            { label: 'Intereses pagados', data: [snowball.interest, avalanche.interest], backgroundColor: ['rgba(108,99,255,0.7)', 'rgba(245,166,35,0.7)'] },
          ]
        },
        options: {
          responsive: true, maintainAspectRatio: true,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => _fmt(ctx.raw) + '€ en intereses' } } },
          scales: {
            x: { ticks: { color: '#a0a8c0' }, grid: { display: false } },
            y: { ticks: { color: '#a0a8c0', callback: v => _fmt(v) + '€' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }
  } catch(e) { console.warn('T4_calc', e); }
}

/* ─────────────────────────────────────────────────────────────────
   T5 — CALCULADORA INTERÉS COMPUESTO VISUAL
───────────────────────────────────────────────────────────────── */
let _compChart = null;
function T5_open() {
  const modal = document.getElementById('tool-modal');
  if (!modal) return;
  modal.innerHTML = `
    <div class="tool-modal-inner">
      <div class="tool-modal-head">
        <button class="tool-back" onclick="closeToolModal()">‹ Volver</button>
        <h3>📈 Interés Compuesto</h3>
      </div>
      <div class="tool-body">
        <div class="t5-grid">
          <div class="tool-section">
            <label class="tool-label">Capital inicial: <strong id="t5-init-v">10.000€</strong></label>
            <input id="t5-init" class="tool-slider" type="range" min="0" max="200000" step="500" value="10000" oninput="T5_update()">
          </div>
          <div class="tool-section">
            <label class="tool-label">Aportación mensual: <strong id="t5-month-v">300€</strong></label>
            <input id="t5-month" class="tool-slider" type="range" min="0" max="5000" step="50" value="300" oninput="T5_update()">
          </div>
          <div class="tool-section">
            <label class="tool-label">Rentabilidad anual: <strong id="t5-ret-v">7%</strong></label>
            <input id="t5-ret" class="tool-slider" type="range" min="1" max="20" step="0.5" value="7" oninput="T5_update()">
          </div>
          <div class="tool-section">
            <label class="tool-label">Años: <strong id="t5-years-v">20</strong></label>
            <input id="t5-years" class="tool-slider" type="range" min="1" max="50" value="20" oninput="T5_update()">
          </div>
        </div>
        <div id="t5-stats" class="t5-stats"></div>
        <canvas id="t5-chart" height="220" style="margin-top:16px;max-width:100%;"></canvas>
        <div id="t5-quote" style="margin-top:20px;padding:16px 18px;background:linear-gradient(135deg,rgba(245,166,35,.08),rgba(245,166,35,.02));border:1px solid rgba(245,166,35,.15);border-radius:14px;text-align:center;font-size:13px;color:var(--text1);font-style:italic;line-height:1.5;min-height:54px;"></div>
      </div>
    </div>
  `;
  modal.classList.add('active');
  T5_update();
  _t5RotateQuote();
}

const _T5_QUOTES = [
  '"El interés compuesto es la octava maravilla del mundo. Quien lo entiende, lo gana. Quien no, lo paga." — Albert Einstein',
  '"Alguien está sentado a la sombra hoy porque alguien plantó un árbol hace mucho tiempo." — Warren Buffett',
  '"El tiempo es el amigo del negocio maravilloso." — Warren Buffett',
  '"El primer millón es el más difícil. Los siguientes llegan solos por el interés compuesto."',
  '"No es lo que ganas, es lo que conservas e inviertes lo que te hace rico."',
  '"€200/mes al 7% durante 30 años son €245.000. Empezar hoy vale más que 10 años de decidir."',
  '"Si no sabes cómo ganar dinero mientras duermes, trabajarás hasta que mueras." — Warren Buffett',
  '"La paciencia es el secreto. La impaciencia, el enemigo número uno del inversor."',
  '"Una acción que sube un 20% al año durante 10 años se multiplica por 6, no por 3."',
  '"La rueda del interés compuesto gira lento al principio y se vuelve imparable al final."',
];

function _t5RotateQuote() {
  const el = document.getElementById('t5-quote');
  if (!el) return;
  let idx = Math.floor(Math.random() * _T5_QUOTES.length);
  el.textContent = _T5_QUOTES[idx];
  if (window._t5QuoteTimer) clearInterval(window._t5QuoteTimer);
  window._t5QuoteTimer = setInterval(() => {
    if (!document.getElementById('t5-quote')) { clearInterval(window._t5QuoteTimer); return; }
    idx = (idx + 1) % _T5_QUOTES.length;
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = _T5_QUOTES[idx];
      el.style.opacity = '1';
    }, 300);
  }, 7000);
}

function T5_update() {
  const init   = parseFloat(document.getElementById('t5-init')?.value) || 0;
  const month  = parseFloat(document.getElementById('t5-month')?.value) || 0;
  const ret    = parseFloat(document.getElementById('t5-ret')?.value) || 7;
  const years  = parseInt(document.getElementById('t5-years')?.value) || 20;
  document.getElementById('t5-init-v').textContent  = _fmt(init) + '€';
  document.getElementById('t5-month-v').textContent = _fmt(month) + '€';
  document.getElementById('t5-ret-v').textContent   = ret + '%';
  document.getElementById('t5-years-v').textContent = years;

  const r = ret / 100 / 12;
  const n = years * 12;
  const labels = [], dataTot = [], dataAport = [], dataInter = [];
  let pat = init, totalAport = init;

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) { pat = pat * (1 + r) + month; totalAport += month; }
    labels.push(y);
    dataTot.push(Math.round(pat));
    dataAport.push(Math.round(totalAport));
    dataInter.push(Math.round(pat - totalAport));
  }

  const final = Math.round(init * Math.pow(1 + r, n) + month * (Math.pow(1 + r, n) - 1) / r);
  const totalInv = init + month * n;
  const totalInt = final - totalInv;
  const x = totalInt / Math.max(1, totalInv);

  const multiplier = final / Math.max(1, totalInv);
  const stats = document.getElementById('t5-stats');
  if (stats) stats.innerHTML = `
      <div class="t5-stat-box">
        <div class="t5-stat-val">${_fmt(Math.round(final))}€</div>
        <div class="t5-stat-lbl">Total final</div>
      </div>
      <div class="t5-stat-box">
        <div class="t5-stat-val">${_fmt(Math.round(totalInv))}€</div>
        <div class="t5-stat-lbl">Aportado</div>
      </div>
      <div class="t5-stat-box">
        <div class="t5-stat-val" style="color:#4ade80;">${_fmt(Math.round(totalInt))}€</div>
        <div class="t5-stat-lbl">Intereses</div>
      </div>
      <div class="t5-stat-box">
        <div class="t5-stat-val">x${multiplier.toFixed(1)}</div>
        <div class="t5-stat-lbl">Multiplicador</div>
      </div>
  `;

  if (typeof Chart === 'undefined') return;
  const ctx = document.getElementById('t5-chart');
  if (!ctx) return;
  if (_compChart) { _compChart.destroy(); _compChart = null; }
  _compChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: 'Capital total', data: dataTot, borderColor: '#6c63ff', backgroundColor: 'rgba(108,99,255,0.15)', fill: true, tension: 0.4, pointRadius: 0 },
        { label: 'Dinero aportado', data: dataAport, borderColor: '#a0a8c0', borderDash: [4,4], fill: false, tension: 0.2, pointRadius: 0 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { labels: { color: '#a0a8c0', font: { size: 11 } } }, tooltip: { callbacks: { label: ctx => _fmt(ctx.raw) + '€' } } },
      scales: {
        x: { ticks: { color: '#a0a8c0', font: { size: 10 }, callback: v => v + 'a' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#a0a8c0', font: { size: 10 }, callback: v => v >= 1000000 ? (v/1000000).toFixed(1)+'M€' : v >= 1000 ? (v/1000).toFixed(0)+'k€' : v+'€' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}

/* ─────────────────────────────────────────────────────────────────
   T6 — NET WORTH TRACKER (persiste en localStorage)
───────────────────────────────────────────────────────────────── */
let _nwChart = null;
function T6_open() {
  const modal = document.getElementById('tool-modal');
  if (!modal) return;
  const a = S.nwAssets || {};
  const d = S.nwDebts  || {};
  modal.innerHTML = `
    <div class="tool-modal-inner">
      <div class="tool-modal-head">
        <button class="tool-back" onclick="closeToolModal()">‹ Volver</button>
        <h3>💎 Net Worth Tracker</h3>
      </div>
      <div class="tool-body">
        <div class="t6-cols">
          <div class="t6-col">
            <div class="t6-col-title">✅ ACTIVOS</div>
            <label class="tool-label">Efectivo / cuentas €</label>
            <input id="t6-cash" class="tool-input" type="number" value="${a.efectivo||0}" oninput="T6_calc()">
            <label class="tool-label">Inversiones (ETFs, acciones) €</label>
            <input id="t6-inv" class="tool-input" type="number" value="${a.inversiones||0}" oninput="T6_calc()">
            <label class="tool-label">Inmuebles (valor mercado) €</label>
            <input id="t6-prop" class="tool-input" type="number" value="${a.inmuebles||0}" oninput="T6_calc()">
            <label class="tool-label">Plan de pensiones €</label>
            <input id="t6-pension" class="tool-input" type="number" value="${a.pension||0}" oninput="T6_calc()">
            <label class="tool-label">Otros activos €</label>
            <input id="t6-aother" class="tool-input" type="number" value="${a.otros||0}" oninput="T6_calc()">
          </div>
          <div class="t6-col">
            <div class="t6-col-title">🔴 PASIVOS</div>
            <label class="tool-label">Hipoteca pendiente €</label>
            <input id="t6-mort" class="tool-input" type="number" value="${d.hipoteca||0}" oninput="T6_calc()">
            <label class="tool-label">Préstamos €</label>
            <input id="t6-loans" class="tool-input" type="number" value="${d.prestamos||0}" oninput="T6_calc()">
            <label class="tool-label">Tarjetas €</label>
            <input id="t6-cards" class="tool-input" type="number" value="${d.tarjetas||0}" oninput="T6_calc()">
            <label class="tool-label">Otros pasivos €</label>
            <input id="t6-dother" class="tool-input" type="number" value="${d.otros||0}" oninput="T6_calc()">
          </div>
        </div>
        <div id="t6-result" class="t6-result"></div>
        <button class="btn btn-primary" onclick="T6_save()" style="margin-top:12px;width:100%">💾 Guardar snapshot</button>
        <canvas id="t6-chart" height="180" style="margin-top:16px"></canvas>
        <div id="t6-history"></div>
      </div>
    </div>
  `;
  modal.classList.add('active');
  T6_calc();
  T6_renderHistory();
}

function T6_calc() {
  try {
    const assets = {
      efectivo:    parseFloat(document.getElementById('t6-cash')?.value)    || 0,
      inversiones: parseFloat(document.getElementById('t6-inv')?.value)     || 0,
      inmuebles:   parseFloat(document.getElementById('t6-prop')?.value)    || 0,
      pension:     parseFloat(document.getElementById('t6-pension')?.value) || 0,
      otros:       parseFloat(document.getElementById('t6-aother')?.value)  || 0,
    };
    const debts = {
      hipoteca:  parseFloat(document.getElementById('t6-mort')?.value)  || 0,
      prestamos: parseFloat(document.getElementById('t6-loans')?.value) || 0,
      tarjetas:  parseFloat(document.getElementById('t6-cards')?.value) || 0,
      otros:     parseFloat(document.getElementById('t6-dother')?.value)|| 0,
    };
    const totalAssets = Object.values(assets).reduce((a,b) => a+b, 0);
    const totalDebts  = Object.values(debts).reduce((a,b) => a+b, 0);
    const netWorth    = totalAssets - totalDebts;
    const debtRatio   = totalAssets > 0 ? (totalDebts / totalAssets * 100) : 0;

    // Save to S (not persisted until snapshot)
    S.nwAssets = assets;
    S.nwDebts  = debts;

    const res = document.getElementById('t6-result');
    if (res) {
      const color = netWorth >= 0 ? 'var(--green)' : 'var(--red)';
      res.innerHTML = `
        <div class="t6-nw-display" style="border-color:${color}">
          <div class="t6-nw-label">Patrimonio Neto</div>
          <div class="t6-nw-val" style="color:${color}">${_fmt(netWorth)}€</div>
        </div>
        <div class="t6-breakdown">
          <div class="t6-break-item t6-green"><span>Total activos</span><strong>${_fmt(totalAssets)}€</strong></div>
          <div class="t6-break-item t6-red"><span>Total pasivos</span><strong>${_fmt(totalDebts)}€</strong></div>
          <div class="t6-break-item"><span>Ratio deuda/activos</span><strong>${debtRatio.toFixed(1)}%</strong></div>
        </div>
      `;
    }
  } catch(e) { console.warn('T6_calc', e); }
}

function T6_save() {
  try {
    const assets = S.nwAssets || {};
    const debts  = S.nwDebts  || {};
    const totalAssets = Object.values(assets).reduce((a,b) => a+b, 0);
    const totalDebts  = Object.values(debts).reduce((a,b) => a+b, 0);
    const netWorth    = totalAssets - totalDebts;
    const today = new Date().toISOString().slice(0, 10);

    if (!S.nwHistory) S.nwHistory = [];
    // No duplicar mismo día
    const existing = S.nwHistory.findIndex(h => h.date === today);
    const snap = { date: today, networth: netWorth, assets: totalAssets, debts: totalDebts };
    if (existing >= 0) S.nwHistory[existing] = snap;
    else S.nwHistory.push(snap);
    // Mantener últimos 24 meses máximo
    if (S.nwHistory.length > 24) S.nwHistory = S.nwHistory.slice(-24);
    saveState();
    T6_renderHistory();
    showToast('💎 Snapshot guardado');
  } catch(e) { console.warn('T6_save', e); }
}

function T6_renderHistory() {
  const history = S.nwHistory || [];
  const hist = document.getElementById('t6-history');
  if (!hist) return;
  if (!history.length) { hist.innerHTML = '<p class="tool-disclaimer" style="margin-top:8px">Guarda tu primer snapshot para empezar el historial.</p>'; return; }

  hist.innerHTML = `
    <div class="t6-hist-title">📅 Historial</div>
    ${history.slice().reverse().slice(0, 6).map(h => {
      const color = h.networth >= 0 ? 'var(--green)' : 'var(--red)';
      return `<div class="t6-hist-row"><span>${h.date}</span><strong style="color:${color}">${_fmt(h.networth)}€</strong></div>`;
    }).join('')}
  `;

  // Chart histórico
  if (typeof Chart === 'undefined' || history.length < 2) return;
  const ctx = document.getElementById('t6-chart');
  if (!ctx) return;
  if (_nwChart) { _nwChart.destroy(); _nwChart = null; }
  _nwChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: history.map(h => h.date.slice(0, 7)),
      datasets: [
        { label: 'Patrimonio neto', data: history.map(h => h.networth), borderColor: '#6c63ff', backgroundColor: 'rgba(108,99,255,0.15)', fill: true, tension: 0.4, pointRadius: 3 },
        { label: 'Activos', data: history.map(h => h.assets), borderColor: 'var(--green)', fill: false, tension: 0.4, pointRadius: 2 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: { legend: { labels: { color: '#a0a8c0', font: { size: 10 } } }, tooltip: { callbacks: { label: ctx => _fmt(ctx.raw) + '€' } } },
      scales: {
        x: { ticks: { color: '#a0a8c0', font: { size: 9 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
        y: { ticks: { color: '#a0a8c0', font: { size: 9 }, callback: v => v >= 1000 ? (v/1000).toFixed(0)+'k€' : v+'€' }, grid: { color: 'rgba(255,255,255,0.05)' } }
      }
    }
  });
}

/* ─────────────────────────────────────────────────────────────────
   Helpers compartidos
───────────────────────────────────────────────────────────────── */
function _fmt(n) {
  if (typeof n !== 'number' || isNaN(n)) return '0';
  return Math.round(n).toLocaleString('es-ES');
}

function closeToolModal() {
  const modal = document.getElementById('tool-modal');
  if (modal) modal.classList.remove('active');
  // Destruir charts activos para evitar memory leaks
  if (_fireChart)  { try { _fireChart.destroy();  } catch(e){} _fireChart  = null; }
  if (_snowChart)  { try { _snowChart.destroy();  } catch(e){} _snowChart  = null; }
  if (_compChart)  { try { _compChart.destroy();  } catch(e){} _compChart  = null; }
  if (_nwChart)    { try { _nwChart.destroy();    } catch(e){} _nwChart    = null; }
}

/* ─────────────────────────────────────────────────────────────────
   Exports
───────────────────────────────────────────────────────────────── */
window.renderToolsScreen = renderToolsScreen;
window.openTool          = openTool;
window.closeToolModal    = closeToolModal;
window.T1_open  = T1_open;  window.T1_calc   = T1_calc;
window.T2_open  = T2_open;  window.T2_calc   = T2_calc;  window.T2_setTab = T2_setTab; window.T2_updateRange = T2_updateRange;
window.T3_open  = T3_open;  window.T3_calc   = T3_calc;  window.T3_update = T3_update;
window.T4_open  = T4_open;  window.T4_calc   = T4_calc;  window.T4_addRow = T4_addRow; window.T4_update = T4_update; window.T4_removeRow = T4_removeRow;
window.T5_open  = T5_open;  window.T5_update = T5_update;
window.T6_open  = T6_open;  window.T6_calc   = T6_calc;  window.T6_save   = T6_save;   window.T6_renderHistory = T6_renderHistory;

/* ─────────────────────────────────────────────────────────────
   T7 — SIMULADOR DE HIPOTECA COMPLETO
   Cuota, amortización, ITP/IVA, comparativas de plazo
───────────────────────────────────────────────────────────── */
const T7_CA = [
  ['Andalucía',     0.07, 'segunda'], ['Cataluña',       0.10, 'segunda'],
  ['Madrid',        0.06, 'segunda'], ['Valencia',        0.10, 'segunda'],
  ['Galicia',       0.07, 'segunda'], ['País Vasco',      0.04, 'segunda'],
  ['Navarra',       0.06, 'segunda'], ['Aragón',          0.08, 'segunda'],
  ['Asturias',      0.08, 'segunda'], ['Cantabria',       0.09, 'segunda'],
  ['Murcia',        0.08, 'segunda'], ['Baleares',        0.08, 'segunda'],
  ['Canarias',      0.065,'segunda'], ['Castilla-La Mancha',0.09,'segunda'],
  ['Castilla y León',0.08,'segunda'], ['Extremadura',     0.08, 'segunda'],
  ['La Rioja',      0.07, 'segunda'],
];

function T7_open() {
  const modal = document.getElementById('tool-modal');
  if (!modal) return;
  const caOpts = T7_CA.map((c,i)=>`<option value="${i}">${c[0]} (ITP ${(c[1]*100).toFixed(0)}%)</option>`).join('');
  modal.innerHTML = `
    <div class="tool-modal-inner">
      <div class="tool-modal-head">
        <button class="tool-back" onclick="closeToolModal()">‹ Volver</button>
        <h3>🏦 Simulador de Hipoteca</h3>
      </div>
      <div class="tool-body">
        <div class="t7-grid">
          <div class="tool-section">
            <label class="tool-label">Precio de la vivienda (€)</label>
            <input id="t7-price" class="tool-input" type="number" value="250000" oninput="T7_calc()">
          </div>
          <div class="tool-section">
            <label class="tool-label">Entrada disponible (€)</label>
            <input id="t7-down" class="tool-input" type="number" value="50000" oninput="T7_calc()">
          </div>
          <div class="tool-section">
            <label class="tool-label">Tipo de interés anual (TIN %)</label>
            <input id="t7-rate" class="tool-input" type="number" step="0.05" value="3.5" oninput="T7_calc()">
          </div>
          <div class="tool-section">
            <label class="tool-label">Plazo: <span id="t7-years-lbl">25</span> años</label>
            <input id="t7-years" class="tool-input" type="range" min="5" max="40" value="25" oninput="document.getElementById('t7-years-lbl').textContent=this.value;T7_calc()">
          </div>
          <div class="tool-section">
            <label class="tool-label">Comunidad Autónoma</label>
            <select id="t7-ca" class="tool-select" onchange="T7_calc()">${caOpts}</select>
          </div>
          <div class="tool-section">
            <label class="tool-label">Tipo de vivienda</label>
            <select id="t7-tipo" class="tool-select" onchange="T7_calc()">
              <option value="segunda">Segunda mano (ITP)</option>
              <option value="nueva">Obra nueva (IVA 10%)</option>
            </select>
          </div>
        </div>
        <div id="t7-result"></div>
        <div class="tool-section" style="margin-top:12px">
          <label class="tool-label">💡 Amortización anticipada: +€<span id="t7-extra-lbl">0</span>/año desde año</label>
          <div style="display:flex;gap:8px;align-items:center">
            <input id="t7-extra" class="tool-input" type="number" value="0" placeholder="€ extra/año" oninput="T7_calc()" style="flex:1">
            <span style="color:var(--text3);font-size:12px">desde año</span>
            <input id="t7-extra-year" class="tool-input" type="number" value="5" min="1" max="39" oninput="T7_calc()" style="width:70px">
          </div>
        </div>
        <div id="t7-extra-result"></div>
        <div class="tool-section" style="margin-top:16px">
          <div class="tool-label" style="margin-bottom:8px">📊 Comparativa de plazos</div>
          <div id="t7-compare"></div>
        </div>
        <div class="tool-section" style="margin-top:16px">
          <div class="tool-label" style="margin-bottom:8px">📅 Tabla de amortización — primeros 12 meses</div>
          <div id="t7-amort" style="overflow-x:auto"></div>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
  T7_calc();
}

function T7_calc() {
  const price  = +document.getElementById('t7-price')?.value || 0;
  const down   = +document.getElementById('t7-down')?.value  || 0;
  const rate   = (+document.getElementById('t7-rate')?.value  || 3.5) / 100;
  const years  = +document.getElementById('t7-years')?.value || 25;
  const caIdx  = +document.getElementById('t7-ca')?.value    || 0;
  const tipo   = document.getElementById('t7-tipo')?.value   || 'segunda';
  const extra  = +document.getElementById('t7-extra')?.value || 0;
  const extraY = +document.getElementById('t7-extra-year')?.value || 5;

  const loan   = Math.max(0, price - down);
  const ltv    = price > 0 ? (loan / price * 100).toFixed(1) : 0;
  const taxRate = tipo === 'nueva' ? 0.10 : T7_CA[caIdx][1];
  const taxLabel = tipo === 'nueva' ? 'IVA (10%)' : `ITP (${(taxRate*100).toFixed(0)}%)`;
  const tax    = price * taxRate;
  const notary = Math.min(2500, Math.max(600, price * 0.005)); // aprox notaría + registro
  const totalBuy = price + tax + notary;

  // Cuota mensual (amortización francesa)
  function cuota(L, r, n) {
    if (r === 0) return L / n;
    const rm = r / 12;
    return L * rm * Math.pow(1+rm, n) / (Math.pow(1+rm, n) - 1);
  }

  const n  = years * 12;
  const rm = rate / 12;
  const fee = cuota(loan, rate, n);
  const totalPaid = fee * n;
  const totalInterest = totalPaid - loan;
  const salaryRef = fee / 0.35; // cuota = 35% sueldo neto → sueldo mínimo recomendado

  const fmt = v => v.toLocaleString('es-ES', {maximumFractionDigits:0}) + ' €';
  const fmtN = v => v.toLocaleString('es-ES', {maximumFractionDigits:2});

  // Traffic light LTV
  const ltvColor = ltv <= 80 ? '#00e5a0' : ltv <= 90 ? '#fbbf24' : '#f87171';

  document.getElementById('t7-result').innerHTML = `
    <div class="t7-kpis">
      <div class="t7-kpi"><div class="t7-kpi-val" style="color:var(--accent)">${fmt(fee)}/mes</div><div class="t7-kpi-lbl">Cuota mensual</div></div>
      <div class="t7-kpi"><div class="t7-kpi-val">${fmt(totalInterest)}</div><div class="t7-kpi-lbl">Intereses totales</div></div>
      <div class="t7-kpi"><div class="t7-kpi-val">${fmt(totalBuy + totalInterest)}</div><div class="t7-kpi-lbl">Coste total real</div></div>
      <div class="t7-kpi"><div class="t7-kpi-val" style="color:${ltvColor}">${ltv}%</div><div class="t7-kpi-lbl">LTV (loan-to-value)</div></div>
    </div>
    <div class="t7-detail">
      <div class="t7-row"><span>${taxLabel}</span><span>${fmt(tax)}</span></div>
      <div class="t7-row"><span>Notaría + Registro (estimado)</span><span>${fmt(notary)}</span></div>
      <div class="t7-row"><span>Entrada</span><span>${fmt(down)}</span></div>
      <div class="t7-row"><span>Capital financiado</span><span>${fmt(loan)}</span></div>
      <div class="t7-row" style="border-top:1px solid var(--border);margin-top:6px;padding-top:6px"><span>💡 Sueldo neto recomendado (regla 35%)</span><span>${fmt(salaryRef)}/mes</span></div>
    </div>
    ${T7_svgBar(loan, totalInterest, tax + notary)}
  `;

  // Amortización anticipada
  if (extra > 0 && loan > 0) {
    let bal = loan, month = 0, saved = 0;
    const regularFee = fee;
    while (bal > 0.01 && month < n) {
      const int = bal * rm;
      const principal = Math.min(bal, regularFee - int);
      bal -= principal;
      month++;
      if (month >= extraY * 12 && month % 12 === 0) {
        const extraPay = Math.min(bal, extra);
        bal -= extraPay;
      }
    }
    const savedMonths = n - month;
    saved = totalInterest - (regularFee * month - loan);
    document.getElementById('t7-extra-result').innerHTML = `
      <div class="t7-bonus">✂️ Amortizando ${fmt(extra)}/año desde el año ${extraY}: <strong>ahorras ~${fmt(Math.max(0,totalInterest - regularFee*month + loan))} en intereses</strong> y reduces el plazo en <strong>${Math.floor(savedMonths/12)} años ${savedMonths%12} meses</strong></div>
    `;
  } else {
    document.getElementById('t7-extra-result').innerHTML = '';
  }

  // Comparativa plazos
  const plazos = [20, 25, 30].filter(p => p !== years);
  plazos.push(years);
  plazos.sort((a,b)=>a-b);
  document.getElementById('t7-compare').innerHTML = `
    <table class="t7-table">
      <thead><tr><th>Plazo</th><th>Cuota/mes</th><th>Intereses totales</th><th>Total pagado</th></tr></thead>
      <tbody>${plazos.map(p=>{
        const f2=cuota(loan,rate,p*12), tp=f2*p*12;
        const hl = p===years ? ' style="background:rgba(0,229,160,.08);font-weight:700"' : '';
        return `<tr${hl}><td>${p} años</td><td>${fmt(f2)}</td><td>${fmt(tp-loan)}</td><td>${fmt(tp)}</td></tr>`;
      }).join('')}</tbody>
    </table>
  `;

  // Tabla amortización 12 meses
  if (loan > 0) {
    let bal2 = loan;
    let rows = '';
    for (let m=1; m<=12 && bal2>0.01; m++) {
      const int = bal2*rm, princ = Math.min(bal2, fee-int);
      bal2 -= princ;
      rows += `<tr><td>${m}</td><td>${fmtN(fee)} €</td><td>${fmtN(int)} €</td><td>${fmtN(princ)} €</td><td>${fmtN(bal2)} €</td></tr>`;
    }
    document.getElementById('t7-amort').innerHTML = `
      <table class="t7-table">
        <thead><tr><th>Mes</th><th>Cuota</th><th>Intereses</th><th>Capital</th><th>Deuda pendiente</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }
}

function T7_svgBar(loan, interest, costs) {
  const total = loan + interest + costs;
  if (total <= 0) return '';
  const pL = loan/total*100, pI = interest/total*100, pC = costs/total*100;
  const fmt = v => v.toLocaleString('es-ES',{maximumFractionDigits:0});
  return `<div class="t7-bar-wrap">
    <div class="t7-bar-label">Desglose coste total</div>
    <div class="t7-bar-track">
      <div class="t7-bar-seg" style="width:${pL.toFixed(1)}%;background:#60a5fa" title="Capital: ${fmt(loan)} €"></div>
      <div class="t7-bar-seg" style="width:${pI.toFixed(1)}%;background:#f87171" title="Intereses: ${fmt(interest)} €"></div>
      <div class="t7-bar-seg" style="width:${pC.toFixed(1)}%;background:#fbbf24" title="Impuestos+gastos: ${fmt(costs)} €"></div>
    </div>
    <div class="t7-bar-legend">
      <span><span class="t7-dot" style="background:#60a5fa"></span>Capital ${pL.toFixed(0)}%</span>
      <span><span class="t7-dot" style="background:#f87171"></span>Intereses ${pI.toFixed(0)}%</span>
      <span><span class="t7-dot" style="background:#fbbf24"></span>Gastos ${pC.toFixed(0)}%</span>
    </div>
  </div>`;
}
window.T7_open = T7_open; window.T7_calc = T7_calc;

/* ══════════════════════════════════════════════════════════════════
   T8 — CALCULADORA DCA vs LUMP SUM
   Compara invertir de golpe vs. mensualmente (DCA)
══════════════════════════════════════════════════════════════════ */
function T8_open() {
  const modal = document.getElementById('tool-modal');
  if (!modal) return;
  modal.innerHTML = `
    <div class="tool-modal-inner">
      <div class="tool-modal-head">
        <button class="tool-back" onclick="closeToolModal()">‹ Volver</button>
        <h3>📆 DCA vs Inversión Única</h3>
      </div>
      <div class="tool-body">
        <div class="tool-section">
          <label class="tool-label">Capital total a invertir (€)</label>
          <input id="t8-capital" class="tool-input" type="number" placeholder="12000" value="12000" oninput="T8_calc()">
        </div>
        <div class="tool-section">
          <label class="tool-label">Rentabilidad anual esperada (%)</label>
          <input id="t8-rate" class="tool-input" type="number" placeholder="7" value="7" step="0.5" oninput="T8_calc()">
        </div>
        <div class="tool-section">
          <label class="tool-label">Horizonte temporal (años)</label>
          <input id="t8-years" class="tool-input" type="number" placeholder="10" value="10" min="1" max="40" oninput="T8_calc()">
        </div>
        <div id="t8-result" style="margin-top:16px;"></div>
        <div style="margin-top:14px;padding:12px 16px;background:var(--bg2);border-radius:12px;border-left:3px solid var(--accent2);">
          <div style="font-size:11px;color:var(--accent2);font-weight:600;margin-bottom:4px;">💡 ¿CUÁNDO USAR CADA ESTRATEGIA?</div>
          <p style="font-size:13px;color:var(--text2);margin:0;line-height:1.6;">
            <strong>DCA:</strong> Mercados volátiles, capital que llega en mensualidades, reduce el impacto emocional.<br>
            <strong>Lump sum:</strong> Capital ya disponible, mercados alcistas, estadísticamente gana al DCA en 2/3 de los casos históricos.
          </p>
        </div>
      </div>
    </div>`;
  T8_calc();
}

function T8_calc() {
  try {
    const capital = parseFloat(document.getElementById('t8-capital')?.value) || 12000;
    const rate    = (parseFloat(document.getElementById('t8-rate')?.value) || 7) / 100;
    const years   = parseInt(document.getElementById('t8-years')?.value) || 10;
    const months  = years * 12;
    const monthly = capital / months;
    const monthlyRate = rate / 12;

    // Lump sum: capital invertido de golpe al inicio
    const lumpSum = capital * Math.pow(1 + rate, years);

    // DCA: aportaciones mensuales iguales
    const dca = monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

    const diff = lumpSum - dca;
    const winner = diff > 0 ? 'Lump Sum' : 'DCA';
    const winColor = diff > 0 ? 'var(--accent)' : 'var(--accent2)';
    const fmt = v => Math.round(v).toLocaleString('es');

    const res = document.getElementById('t8-result');
    if (!res) return;
    res.innerHTML = `
      <div class="t1-result-grid">
        <div class="t1-stat">
          <div class="t1-stat-label">Lump Sum (todo al inicio)</div>
          <div class="t1-stat-val" style="color:var(--accent);">${fmt(lumpSum)}€</div>
        </div>
        <div class="t1-stat">
          <div class="t1-stat-label">DCA (${fmt(monthly)}€/mes)</div>
          <div class="t1-stat-val" style="color:var(--accent2);">${fmt(dca)}€</div>
        </div>
        <div class="t1-stat">
          <div class="t1-stat-label">Diferencia</div>
          <div class="t1-stat-val" style="color:${winColor};">${diff > 0 ? '+' : ''}${fmt(diff)}€</div>
        </div>
        <div class="t1-stat">
          <div class="t1-stat-label">Ganador histórico</div>
          <div class="t1-stat-val" style="color:${winColor};">${winner}</div>
        </div>
      </div>
      <div style="margin-top:10px;text-align:center;font-size:12px;color:var(--text3);">
        Capital invertido: ${fmt(capital)}€ · ${years} años · ${rate*100}% anual
      </div>`;
  } catch(e) {}
}
window.T8_open = T8_open; window.T8_calc = T8_calc;

/* ══════════════════════════════════════════════════════════════════
   PRIORIDAD 2A — BOSS BATTLES
   ─────────────────────────────────────────────────────────────────
   Al completar el último módulo de una rama → Boss Battle:
   5 preguntas difíciles, timer, animación épica, cofre legendario.
══════════════════════════════════════════════════════════════════ */

const BOSS_DATA = {
  fundamentos: {
    name: 'El Guardián del Presupuesto',
    emoji: '🏗️',
    color: '#00e5a0',
    intro: 'Has dominado los fundamentos. Ahora demuestra que realmente los entiendes.',
    questions: [
      {
        q: '¿Cuánto capital necesitas para que el 4% anual cubra 30.000€ de gastos anuales?',
        opts: ['600.000€', '750.000€', '450.000€', '1.000.000€'],
        correct: 0,
        exp: 'Regla del 4%: 30.000 / 0.04 = 750.000€. El número FIRE.'
      },
      {
        q: 'Si inviertes 300€/mes al 8% anual durante 30 años, ¿cuánto tendrás aproximadamente?',
        opts: ['480.000€', '108.000€', '270.000€', '650.000€'],
        correct: 0,
        exp: 'El interés compuesto multiplica x4.4 lo aportado: 300×12×30 = 108k€ aportados → ~435k€ final.'
      },
      {
        q: 'Tienes 20.000€ de deuda al 18% TAE y 15.000€ en un depósito al 3%. ¿Qué haces?',
        opts: ['Cancelo la deuda con el depósito', 'Mantengo el depósito y pago mínimos', 'Refinancio la deuda', 'Invierto en bolsa'],
        correct: 0,
        exp: '18% > 3%: cada euro que cancelas la deuda "gana" un 18% garantizado. Cancela siempre.'
      },
      {
        q: '¿Cuál es el orden correcto para optimizar tu dinero en España?',
        opts: ['Fondo emergencia → PP hasta máximo si tipo >30% → ETFs acumulación', 'ETFs primero → luego emergencia', 'PP siempre antes que todo', 'Inmueble antes que mercado'],
        correct: 0,
        exp: 'Primero liquidez (emergencia), luego fiscalidad (PP si compensa), luego crecimiento (ETFs).'
      },
      {
        q: 'El coste real de un piso de 200.000€ a 30 años (hipoteca al 3.5%) es aproximadamente:',
        opts: ['~350.000€ con todos los gastos', '~200.000€ exacto', '~250.000€', '~500.000€'],
        correct: 0,
        exp: 'ITP/gastos +10%, intereses +80k€, IBI +18k€, mantenimiento +60k€, comunidad +36k€ ≈ 350k€.'
      }
    ]
  },
  inversion: {
    name: 'El Mercado Infinito',
    emoji: '📈',
    color: '#60a5fa',
    intro: 'El mercado pone a prueba a los que creen que saben. ¿Estás listo?',
    questions: [
      {
        q: 'Un ETF con TER del 0.20% vs uno con TER del 1.50% a 30 años con 10.000€ iniciales (7% bruto). ¿Diferencia aproximada?',
        opts: ['~45.000€', '~5.000€', '~15.000€', '~2.000€'],
        correct: 0,
        exp: 'Las comisiones compuestas destruyen capital: 6.8% neto vs 5.5% neto = diferencia brutal a 30 años.'
      },
      {
        q: '¿Qué significa que un ETF sea "de acumulación" vs "de distribución"?',
        opts: ['Acumulación reinvierte dividendos sin tributar, distribución paga y tributa cada vez', 'Acumulación crece más rápido siempre', 'Distribución es mejor para jubilación', 'No hay diferencia fiscal'],
        correct: 0,
        exp: 'En acumulación, el interés compuesto actúa sobre los dividendos sin pagar IRPF cada año.'
      },
      {
        q: 'El mercado cae un 40%. ¿Qué hace el inversor inteligente según el value investing?',
        opts: ['Compra más si tiene liquidez disponible', 'Vende para evitar más pérdidas', 'Espera y no hace nada', 'Diversifica en crypto'],
        correct: 0,
        exp: 'Graham y Buffett: el mercado bajista es el gran saldo. Si el negocio es sólido, la caída es oportunidad.'
      },
      {
        q: '¿Cuál es la diferencia entre rentabilidad nominal y real?',
        opts: ['Real = nominal - inflación. Con 7% nominal y 3% inflación, ganas 4% real', 'Son lo mismo, solo cambia el nombre', 'Real es con impuestos, nominal sin', 'Nominal es siempre mayor'],
        correct: 0,
        exp: 'La inflación erosiona el poder adquisitivo. Un 7% con 3% de inflación son solo 4% de ganancia real.'
      },
      {
        q: 'Tienes 50.000€ de plusvalías en ETFs. ¿Cuánto pagas de IRPF en España 2024?',
        opts: ['6.000×19% + 44.000×21% = 10.380€', '50.000×21% = 10.500€', '50.000×19% = 9.500€', '50.000×23% = 11.500€'],
        correct: 0,
        exp: 'Tramos del ahorro: primeros 6.000€ al 19%, los siguientes 44.000€ al 21% = 10.380€.'
      }
    ]
  },
  deuda: {
    name: 'El Señor de las Deudas',
    emoji: '🔄',
    color: '#fb923c',
    intro: 'La deuda puede destruirte o catapultarte. Demuestra que sabes la diferencia.',
    questions: [
      {
        q: '¿A partir de qué TAE siempre compensa pagar deuda antes de invertir en mercado?',
        opts: ['5% TAE', '3% TAE', '10% TAE', '8% TAE'],
        correct: 0,
        exp: 'Con deuda >5% TAE la rentabilidad garantizada de pagarla supera la esperada del mercado (~7%).'
      },
      {
        q: 'Avalanche vs Snowball: ¿cuál ahorra más dinero matemáticamente?',
        opts: ['Avalanche (ataca mayor TAE primero)', 'Snowball (ataca menor saldo primero)', 'Son iguales', 'Depende del número de deudas'],
        correct: 0,
        exp: 'Avalanche elimina primero los intereses más caros → menos interés total pagado. Snowball es psicológicamente mejor.'
      },
      {
        q: 'Una empresa tiene un ratio deuda/EBITDA de 8x. ¿Qué significa?',
        opts: ['Tardaría 8 años en pagar su deuda con beneficios operativos: alto riesgo', 'Es una empresa muy rentable', 'Tiene 8 veces más activos que deudas', 'Es un ratio neutral'],
        correct: 0,
        exp: 'D/EBITDA >4x ya es arriesgado. 8x indica estrés financiero severo, riesgo de impago elevado.'
      },
      {
        q: '¿Cuándo es racional tener una hipoteca y a la vez invertir en mercado?',
        opts: ['Cuando el tipo hipotecario esperado < rentabilidad esperada del mercado', 'Nunca, siempre paga primero', 'Siempre que tengas liquidez', 'Solo si la hipoteca es fija'],
        correct: 0,
        exp: 'Hipoteca al 3.5% vs mercado al 7%: el diferencial del 3.5% trabaja a tu favor invirtiendo la diferencia.'
      },
      {
        q: 'Refinancias una deuda del 22% TAE a 8% TAE. ¿Qué riesgo real existe?',
        opts: ['Liberar flujo de caja y volver a endeudarse, perpetuando el ciclo', 'Subida de tipos futura', 'El banco puede cancelarla', 'Ninguno, siempre es buena idea'],
        correct: 0,
        exp: 'El mayor riesgo conductual: liberar capacidad de pago y gastarla en lugar de usarla para pagar capital.'
      }
    ]
  },
  fiscalidad: {
    name: 'El Inspector de Hacienda',
    emoji: '🧾',
    color: '#fbbf24',
    intro: 'Hacienda somos todos. Demuestra que sabes cómo jugar el juego legal.',
    questions: [
      {
        q: '¿Qué diferencia a la base del ahorro de la base general en el IRPF español?',
        opts: ['Ahorro tributa plusvalías e intereses al 19-28%, general tributa trabajo hasta el 47%', 'Son lo mismo desde 2023', 'Ahorro es para autónomos', 'General tributa al 21%'],
        correct: 0,
        exp: 'La distinción es clave: dividendos y plusvalías tienen tipos más bajos que los ingresos del trabajo.'
      },
      {
        q: '¿Qué es el "traspaso entre fondos" y por qué es ventajoso fiscalmente?',
        opts: ['Mueves dinero entre fondos sin tributar hasta el rescate final, diferimiento ilimitado', 'Pagas el 10% al traspasar', 'Solo aplica a planes de pensiones', 'Solo si permaneces en el mismo banco'],
        correct: 0,
        exp: 'Los fondos de inversión permiten reasignación de cartera sin hecho imponible. Los ETFs no tienen esta ventaja.'
      },
      {
        q: 'Tienes 5.000€ de plusvalías y 2.000€ de minusvalías en el año. ¿Cuánto pagas?',
        opts: ['19% sobre 3.000€ netos = 570€', '19% sobre 5.000€ = 950€', '0€ porque se compensan', '21% sobre 5.000€ = 1.050€'],
        correct: 0,
        exp: 'Puedes compensar ganancias con pérdidas del mismo ejercicio. 5.000 - 2.000 = 3.000€ base × 19% = 570€.'
      },
      {
        q: '¿Cuándo NO conviene aportar al máximo al plan de pensiones?',
        opts: ['Cuando tu tipo marginal actual es inferior al que tendrás en jubilación', 'Cuando ganas más de 60.000€', 'Cuando tienes deudas', 'Siempre conviene al máximo'],
        correct: 0,
        exp: 'El PP difiere impuestos al futuro. Si en jubilación tributas más que hoy, el PP te perjudica.'
      },
      {
        q: 'Eres autónomo en módulos con 40.000€ de ingresos. ¿Qué ventaja fiscal tienes vs asalariado?',
        opts: ['Puedes deducir gastos reales: material, parte del hogar, formación, transporte, reduciendo base imponible', 'Pagas menos seguridad social', 'Tienes tipo fijo del 15%', 'No tienes ventajas'],
        correct: 0,
        exp: 'Un autónomo con 10.000€ de gastos deducibles paga IRPF solo sobre 30.000€ vs los 40.000€ del asalariado.'
      }
    ]
  },
  psicologia: {
    name: 'El Espejo Financiero',
    emoji: '🧠',
    color: '#c084fc',
    intro: 'El mayor enemigo del inversor es el que ves en el espejo. ¿Te conoces?',
    questions: [
      {
        q: '¿Qué sesgo explica que vendas tus acciones ganadoras pronto y mantengas las perdedoras?',
        opts: ['Aversión a las pérdidas (Prospect Theory de Kahneman)', 'Exceso de confianza', 'Sesgo de disponibilidad', 'Anclaje'],
        correct: 0,
        exp: 'Las pérdidas duelen 2x más que los beneficios satisfacen. Vendemos ganadores para "asegurar" y aguantamos perdedores esperando recuperación.'
      },
      {
        q: 'El mercado cae un 30% en un mes. Sientes pánico intenso. ¿Qué indica eso sobre tu cartera?',
        opts: ['Que tienes más riesgo (renta variable) del que tu tolerancia real admite', 'Que la cartera está mal gestionada', 'Que debes vender', 'Es reacción normal, no indica nada'],
        correct: 0,
        exp: 'La tolerancia al riesgo real se descubre en los crashes, no en papel. El pánico = señal de que debes rebalancear.'
      },
      {
        q: '¿Qué es el "efecto latte" o sesgo de pequeños gastos?',
        opts: ['Subestimamos el impacto acumulado de gastos pequeños y recurrentes', 'Los gastos pequeños no importan', 'Es un mito financiero', 'Solo aplica a gastos de lujo'],
        correct: 0,
        exp: '5€/día × 365 × 20 años al 7% = 82.000€. Los pequeños hábitos de gasto se capitalizan como los de ahorro.'
      },
      {
        q: 'Compras acciones de tu empresa porque "la conoces bien". ¿Qué sesgo es?',
        opts: ['Sesgo de familiaridad + falta de diversificación (riesgo concentración)', 'Inversión inteligente con ventaja informacional', 'Sesgo de confirmación', 'Value investing correcto'],
        correct: 0,
        exp: 'Conocer la empresa no te protege de sus ciclos bajistas. Además, concentras riesgo laboral y patrimonial en el mismo activo.'
      },
      {
        q: '¿Qué estrategia minimiza el impacto conductual en la inversión a largo plazo?',
        opts: ['DCA automático (aportación periódica fija) + sin mirar la cartera a diario', 'Seguir el mercado de cerca', 'Comprar en mínimos de mercado', 'Rotar cartera cada trimestre'],
        correct: 0,
        exp: 'El DCA automático elimina la decisión emocional. Lo que no ves no te genera ansiedad. Disciplina > inteligencia.'
      }
    ]
  },
  avanzado: {
    name: 'El Arquitecto de la Riqueza',
    emoji: '🚀',
    color: '#f87171',
    intro: 'El nivel más alto. Solo los que realmente entienden las finanzas llegan aquí.',
    questions: [
      {
        q: 'Tasa de ahorro del 50% vs 20% a los mismos ingresos. ¿Cuántos años de diferencia en alcanzar FIRE?',
        opts: ['~17 años vs ~37 años (20 años de diferencia)', '~10 vs ~20 años', '~5 vs ~15 años', 'Depende de la inflación'],
        correct: 0,
        exp: 'La tasa de ahorro es la variable más poderosa del FIRE. Al 50% llegas en ~17 años; al 20% en ~37 años.'
      },
      {
        q: '¿Qué es el "ciclo económico de Dalio" y qué implica para un inversor?',
        opts: ['Ciclos de deuda cortos (5-8a) y largos (75-100a): diversificar en activos que descorrelacionen en cada fase', 'El mercado siempre sube a largo plazo', 'Los bancos centrales controlan todo', 'Invertir solo en períodos de expansión'],
        correct: 0,
        exp: 'Entender el ciclo permite preparar la cartera: en deflación bonos, en inflación materias primas, en crecimiento acciones.'
      },
      {
        q: 'Estrategia "All Weather" de Dalio. ¿Cuál es la distribución aproximada?',
        opts: ['30% acciones, 40% bonos L/P, 15% bonos M/P, 7.5% oro, 7.5% commodities', '60% acciones, 40% bonos', '100% acciones mundiales', '50% acciones, 50% crypto'],
        correct: 0,
        exp: 'Diseñada para funcionar en los 4 escenarios económicos. Prioriza protección sobre rentabilidad máxima.'
      },
      {
        q: '¿Por qué los REITs pueden ser eficientes en una cartera de rentas pasivas?',
        opts: ['Acceso a inmobiliario sin capital inmovilizado, liquidez diaria, dividendos obligatorios del 90% del beneficio', 'Garantizan rentas fijas', 'Están exentos de impuestos', 'Nunca bajan de precio'],
        correct: 0,
        exp: 'Los REITs reparten al menos el 90% de beneficios como dividendos por ley. Permiten diversificación inmobiliaria desde 100€.'
      },
      {
        q: '¿Qué define a un millonario de primera generación según Thomas Stanley?',
        opts: ['Gasta muy por debajo de sus ingresos, invierte consistentemente y vive en vecindarios de clase media', 'Tiene ingresos altísimos', 'Hereda capital o negocio familiar', 'Tiene título universitario de prestigio'],
        correct: 0,
        exp: '"The Millionaire Next Door": la mayoría de millonarios self-made son frugales, disciplinados e invisibles. El lujo visible es anti-riqueza.'
      }
    ]
  },
  vivienda: {
    name: 'El Guardián del Ladrillo',
    emoji: '🏠',
    color: '#34d399',
    intro: 'La vivienda es la mayor decisión financiera de tu vida. Demuestra que sabes lo que haces.',
    questions: [
      {
        q: '¿Cuánto se recomienda tener ahorrado antes de comprar vivienda, además de la entrada?',
        opts: ['20% de entrada + 10-15% extra para gastos (notaría, impuestos, gestoría)', 'Solo la entrada del 10%', 'Nada extra, el banco lo cubre', '30% de entrada sin gastos adicionales'],
        correct: 0,
        exp: 'El banco solo financia hasta el 80%. Necesitas el 20% de entrada + ~10-15% en gastos de compra (ITP/IVA, notaría, registro, gestoría). Sin ese colchón, no compres.'
      },
      {
        q: 'Hipoteca fija vs variable al mismo plazo. ¿Cuándo conviene la variable?',
        opts: ['Cuando el Euríbor está alto y se espera que baje, y tienes capacidad de absorber subidas', 'Siempre, porque empieza más barata', 'Nunca, la fija siempre es mejor', 'Solo para hipotecas cortas de menos de 10 años'],
        correct: 0,
        exp: 'La variable tiene sentido si el Euríbor está en máximos históricos y tienes margen financiero. La fija da certeza. En 2022-2023, quien tenía variable pagó hasta €400/mes más.'
      },
      {
        q: '¿Qué es el ratio precio/alquiler (PER inmobiliario) y cómo se interpreta?',
        opts: ['Precio de compra / alquiler anual. Por debajo de 20 favorece compra; por encima de 25, alquilar es más eficiente', 'Rentabilidad bruta del alquiler', 'Solo aplica a inversión, no a vivienda habitual', 'El ratio ideal siempre es 15'],
        correct: 0,
        exp: 'PER = precio / alquiler anual. Un PER de 20 = tardarás 20 años en recuperar la inversión vía alquiler. Por encima de 25 suele ser más barato alquilar y invertir la diferencia.'
      },
      {
        q: 'Amortización anticipada de hipoteca vs inversión en bolsa. ¿Qué manda la matemática?',
        opts: ['Si el tipo hipotecario < rentabilidad esperada de bolsa (~7-10%), invertir suele ganar. Con tipo >4%, la decisión se equilibra', 'Siempre amortizar, eliminar deuda es lo primero', 'Siempre invertir, la bolsa siempre sube', 'Depende solo de la edad'],
        correct: 0,
        exp: 'Con hipoteca al 2-3% y bolsa al 7-10% histórico, la matemática favorece invertir. Con hipoteca al 4-5%, el diferencial se reduce. La paz mental de no tener deuda también tiene valor real.'
      },
      {
        q: '¿Qué gastos ocultos debes considerar al ser propietario que el inquilino no paga?',
        opts: ['IBI, comunidad, seguro hogar, derramas, mantenimiento (~1-2% del valor anual) y vacíos hipotecarios', 'Solo el IBI', 'Ninguno si la hipoteca está pagada', 'Solo la comunidad de vecinos'],
        correct: 0,
        exp: 'Ser propietario tiene costes invisibles: IBI (~0.5-1.1% valor catastral), comunidad, seguro, mantenimiento y reparaciones. Suma fácilmente €3.000-8.000/año según el inmueble.'
      }
    ]
  }
};

let _bossState = null; // { branchId, qIdx, score, startTime, answers[] }
let _bossTimer  = null;

function BOSS_checkTrigger(modId) {
  try {
    if (!modId && modId !== 0) return;
    const branch = F28_BRANCHES.find(b => b.mods.includes(modId));
    if (!branch) return;
    if ((S.bossBeaten || []).includes(branch.id)) return;
    // Check if ALL mods of the branch are completed
    const completed = new Set(S.completedMods || []);
    const allDone = branch.mods.every(id => completed.has(id));
    if (!allDone) return;
    // Trigger Boss Battle!
    setTimeout(() => BOSS_open(branch.id), 400);
  } catch(e) { console.warn('BOSS_checkTrigger', e); }
}

function BOSS_open(branchId) {
  try {
    const boss = BOSS_DATA[branchId];
    if (!boss) return;
    _bossState = { branchId, qIdx: 0, score: 0, startTime: Date.now(), answers: [] };
    const modal = document.getElementById('boss-modal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    BOSS_renderIntro(branchId);
  } catch(e) { console.warn('BOSS_open', e); }
}

function BOSS_renderIntro(branchId) {
  const boss = BOSS_DATA[branchId];
  const modal = document.getElementById('boss-modal');
  if (!modal || !boss) return;
  modal.innerHTML = `
    <div class="boss-container">
      <div class="boss-intro-wrap">
        <div class="boss-aura" style="--boss-color:${boss.color}"></div>
        <div class="boss-emoji-big">${boss.emoji}</div>
        <div class="boss-badge">⚔️ BOSS BATTLE</div>
        <div class="boss-name">${boss.name}</div>
        <div class="boss-branch" style="color:${boss.color}">${branchId.charAt(0).toUpperCase()+branchId.slice(1)}</div>
        <div class="boss-intro-text">${boss.intro}</div>
        <div class="boss-rules">
          <div class="boss-rule">⏱️ 45 segundos por pregunta</div>
          <div class="boss-rule">5 preguntas difíciles</div>
          <div class="boss-rule">5/5 correctas → cofre legendario 🏆</div>
        </div>
        <button class="btn btn-boss" onclick="BOSS_startQuiz('${branchId}')">⚔️ ¡Comenzar batalla!</button>
        <button class="btn btn-ghost btn-sm" style="margin-top:8px" onclick="BOSS_close()">No estoy listo</button>
      </div>
    </div>
  `;
}

function BOSS_startQuiz(branchId) {
  _bossState.qIdx = 0;
  BOSS_renderQuestion();
}

function BOSS_renderQuestion() {
  if (!_bossState) return;
  const boss = BOSS_DATA[_bossState.branchId];
  const q = boss.questions[_bossState.qIdx];
  const modal = document.getElementById('boss-modal');
  if (!modal || !q) return;

  const qNum = _bossState.qIdx + 1;
  const total = boss.questions.length;

  modal.innerHTML = `
    <div class="boss-container">
      <div class="boss-quiz-wrap">
        <div class="boss-quiz-header">
          <div class="boss-quiz-progress">
            ${boss.questions.map((_,i) => `<div class="boss-dot ${i < qNum ? 'active':''} ${i === _bossState.qIdx ? 'current':''}"></div>`).join('')}
          </div>
          <div class="boss-quiz-info">
            <span style="color:${boss.color}">${boss.emoji} ${boss.name}</span>
            <span class="boss-timer" id="boss-timer">45</span>
          </div>
        </div>
        <div class="boss-q-num">Pregunta ${qNum} / ${total}</div>
        <div class="boss-question">${q.q}</div>
        <div class="boss-opts" id="boss-opts">
          ${q.opts.map((opt,i) => `
            <button class="boss-opt" onclick="BOSS_answer(${i})">${opt}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  BOSS_startTimer();
}

function BOSS_startTimer() {
  if (_bossTimer) clearInterval(_bossTimer);
  let secs = 45;
  _bossTimer = setInterval(() => {
    secs--;
    const el = document.getElementById('boss-timer');
    if (el) {
      el.textContent = secs;
      if (secs <= 10) el.style.color = '#f87171';
      if (secs <= 5)  el.style.animation = 'bossTimerPulse 0.5s infinite alternate';
    }
    if (secs <= 0) {
      clearInterval(_bossTimer);
      BOSS_answer(-1); // timeout = wrong
    }
  }, 1000);
}

function BOSS_answer(chosen) {
  if (_bossTimer) clearInterval(_bossTimer);
  if (!_bossState) return;
  const boss = BOSS_DATA[_bossState.branchId];
  const q = boss.questions[_bossState.qIdx];
  const correct = chosen === q.correct;
  if (correct) _bossState.score++;
  _bossState.answers.push({ chosen, correct });

  // Show feedback briefly
  const opts = document.querySelectorAll('.boss-opt');
  opts.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('boss-opt-correct');
    else if (i === chosen && !correct) btn.classList.add('boss-opt-wrong');
  });

  // Show explanation
  const container = document.querySelector('.boss-quiz-wrap');
  if (container) {
    const exp = document.createElement('div');
    exp.className = 'boss-explanation ' + (correct ? 'boss-exp-ok' : 'boss-exp-bad');
    exp.innerHTML = (correct ? '✅ ¡Correcto! ' : '❌ Incorrecto. ') + q.exp;
    container.appendChild(exp);
  }

  setTimeout(() => {
    _bossState.qIdx++;
    if (_bossState.qIdx >= boss.questions.length) {
      BOSS_showResult();
    } else {
      BOSS_renderQuestion();
    }
  }, 2200);
}

function BOSS_showResult() {
  if (!_bossState) return;
  const boss = BOSS_DATA[_bossState.branchId];
  const score = _bossState.score;
  const total = boss.questions.length;
  const won = score >= 5;
  const modal = document.getElementById('boss-modal');
  if (!modal) return;

  if (won && !(S.bossBeaten||[]).includes(_bossState.branchId)) {
    if (!S.bossBeaten) S.bossBeaten = [];
    S.bossBeaten.push(_bossState.branchId);
    S.xp += 300;
    if (typeof F34_onXPGained === 'function') F34_onXPGained(300);
    if (!S.chestsAvailable) S.chestsAvailable = [];
    S.chestsAvailable.push({ type: 'legendary', earnedAt: Date.now() });
    saveState();
    checkAchievements();
    confetti();
    emojiConfetti();
    // P4-C: tick misión boss
    if (typeof tickMission === 'function') tickMission('boss', 1);
  }

  const stars = score >= 5 ? '⭐⭐⭐' : score >= 3 ? '⭐⭐' : '⭐';
  modal.innerHTML = `
    <div class="boss-container">
      <div class="boss-result-wrap ${won ? 'boss-won' : 'boss-lost'}">
        <div class="boss-result-aura" style="--boss-color:${won ? '#fbbf24' : '#f87171'}"></div>
        <div class="boss-result-stars">${stars}</div>
        <div class="boss-result-title">${won ? '¡BOSS DERROTADO!' : 'El Boss gana esta vez'}</div>
        <div class="boss-result-emoji">${won ? '🏆' : '💀'}</div>
        <div class="boss-result-score">${score} / ${total} correctas</div>
        <div class="boss-result-msg">${won
          ? '¡Increíble! Has demostrado dominar ' + boss.name + '. Un cofre legendario te espera.'
          : 'Falta poco. Repasa los módulos y vuelve a intentarlo.'}
        </div>
        ${won ? '<div class="boss-reward-badge">+300 XP · 🏆 Cofre Legendario</div>' : ''}
        <div class="boss-result-btns">
          ${won ? '' : `<button class="btn btn-boss" onclick="BOSS_open('${_bossState.branchId}')">🔄 Reintentar</button>`}
          <button class="btn ${won ? 'btn-boss' : 'btn-ghost btn-sm'}" onclick="BOSS_close()">
            ${won ? '🎁 ¡Reclamar recompensa!' : 'Volver al juego'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function BOSS_close() {
  const modal = document.getElementById('boss-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
  _bossState = null;
  if (_bossTimer) clearInterval(_bossTimer);
  if (typeof renderHomeScreen === 'function') renderHomeScreen();
}

window.BOSS_checkTrigger = BOSS_checkTrigger;
window.BOSS_open         = BOSS_open;
window.BOSS_startQuiz    = BOSS_startQuiz;
window.BOSS_answer       = BOSS_answer;
window.BOSS_close        = BOSS_close;

/* ══════════════════════════════════════════════════════════════════
   PRIORIDAD 2B — FINANCIAL PERSONALITY TEST
   8 preguntas → 4 arquetipos con tarjeta shareable
══════════════════════════════════════════════════════════════════ */

const PERSONALITY_QUESTIONS = [
  {
    q: 'Recibes 5.000€ inesperados. ¿Qué haces primero?',
    opts: [
      { text: 'Lo pongo en la cuenta de ahorro inmediatamente', type: 'ahorrador' },
      { text: 'Lo invierto en mi cartera de ETFs o acciones', type: 'inversor' },
      { text: 'Lo reinvierto en mi negocio o idea', type: 'emprendedor' },
      { text: 'Me doy un capricho que llevo tiempo queriendo', type: 'gastador' }
    ]
  },
  {
    q: 'Tu relación con el riesgo financiero es:',
    opts: [
      { text: 'Lo evito. Prefiero rentabilidades bajas pero seguras', type: 'ahorrador' },
      { text: 'Lo acepto si el análisis lo justifica', type: 'inversor' },
      { text: 'Sin riesgo no hay recompensa. Acepto volatilidad alta', type: 'emprendedor' },
      { text: 'No pienso mucho en eso, vivo el presente', type: 'gastador' }
    ]
  },
  {
    q: 'Cuando piensas en tu jubilación:',
    opts: [
      { text: 'Ya tengo un plan detallado y voy bien', type: 'ahorrador' },
      { text: 'Mi cartera de inversión me cubrirá', type: 'inversor' },
      { text: 'A esa edad tendré ingresos pasivos de mis negocios', type: 'emprendedor' },
      { text: 'Ya pensaré en eso cuando llegue el momento', type: 'gastador' }
    ]
  },
  {
    q: 'Tu gasto en ocio y estilo de vida es:',
    opts: [
      { text: 'Mínimo. Prefiero ahorrar que gastar', type: 'ahorrador' },
      { text: 'Controlado. Primero invierto, luego gasto lo que queda', type: 'inversor' },
      { text: 'Variable. A veces gasto mucho si genera conexiones o valor', type: 'emprendedor' },
      { text: 'Generoso. La vida es para disfrutarla', type: 'gastador' }
    ]
  },
  {
    q: 'Cuando el mercado cae un 30%, ¿qué sientes?',
    opts: [
      { text: 'Nerviosismo. Prefiero no tener mucho en bolsa', type: 'ahorrador' },
      { text: 'Oportunidad. Compro más con mi liquidez reservada', type: 'inversor' },
      { text: 'Indiferencia. Mi riqueza no depende del mercado', type: 'emprendedor' },
      { text: 'No lo sigo de cerca', type: 'gastador' }
    ]
  },
  {
    q: 'Tu fuente de ingresos ideal es:',
    opts: [
      { text: 'Un empleo estable con buen sueldo y buenas condiciones', type: 'ahorrador' },
      { text: 'Dividendos y rentas pasivas de mi cartera', type: 'inversor' },
      { text: 'Mi propio negocio con múltiples fuentes de ingresos', type: 'emprendedor' },
      { text: 'Lo que sea mientras pague bien y me guste', type: 'gastador' }
    ]
  },
  {
    q: 'Frente a una oportunidad de negocio que requiere invertir 10.000€:',
    opts: [
      { text: 'No arriesgo capital que he tardado en ahorrar', type: 'ahorrador' },
      { text: 'Analizo el ROI esperado y decido con números', type: 'inversor' },
      { text: 'Si creo en la idea, lo pongo sin dudar', type: 'emprendedor' },
      { text: 'Dependería de si el negocio mola o no', type: 'gastador' }
    ]
  },
  {
    q: 'Tu filosofía financiera más cercana es:',
    opts: [
      { text: '"Un céntimo ahorrado es un céntimo ganado"', type: 'ahorrador' },
      { text: '"Haz que tu dinero trabaje más duro que tú"', type: 'inversor' },
      { text: '"Construye activos, no acumules dinero"', type: 'emprendedor' },
      { text: '"El dinero está para usarlo y disfrutarlo"', type: 'gastador' }
    ]
  }
];

const PERSONALITY_TYPES = {
  ahorrador: {
    name: 'El Ahorrador',
    emoji: '🏦',
    color: '#00e5a0',
    subtitle: 'Disciplinado · Conservador · Seguro',
    desc: 'Tu superpoder es la disciplina y la constancia. Acumulas capital de forma segura y nunca te pillan con la guardia baja. Tu punto ciego: el exceso de cautela puede costarte rentabilidad a largo plazo. Combina tu ahorro con inversión indexada y multiplicarás resultados sin asumir riesgo innecesario.',
    tip: '💡 Desafío: Automatiza el 20% de tu ingreso en un ETF global. Tu disciplina + el mercado = fórmula ganadora.',
    famous: 'Como Warren Buffett en sus inicios: frugal y paciente.'
  },
  inversor: {
    name: 'El Inversor',
    emoji: '📈',
    color: '#60a5fa',
    subtitle: 'Analítico · Paciente · Estratégico',
    desc: 'Piensas en términos de activos, flujos de caja y rentabilidad. El mercado es tu aliado natural. Tu punto ciego: puedes análizar tanto que te paralices o que ignores la parte emocional del dinero. El mejor inversor también tiene un plan de vida, no solo una cartera.',
    tip: '💡 Desafío: Define tu número FIRE y calcula cuántos años te faltan con tu tasa de ahorro actual.',
    famous: 'Como Charlie Munger: calma, largo plazo y mentalidad de dueño.'
  },
  emprendedor: {
    name: 'El Emprendedor',
    emoji: '🚀',
    color: '#f87171',
    subtitle: 'Creativo · Tolerante al riesgo · Visionario',
    desc: 'Ves oportunidades donde otros ven problemas. Tu activo más valioso no es tu cartera sino tu capacidad de crear valor. Tu punto ciego: el riesgo concentrado en tu propio negocio puede destruir lo construido de golpe. Diversifica: protege lo que ya tienes mientras construyes lo nuevo.',
    tip: '💡 Desafío: Separa un 15% de ingresos del negocio en activos desvinculados de él (ETFs, inmueble).',
    famous: 'Como Elon Musk antes de SpaceX: reinvierte todo, pero ten un colchón.'
  },
  gastador: {
    name: 'El Disfrutador',
    emoji: '🎉',
    color: '#fbbf24',
    subtitle: 'Presente · Sociable · Experiencial',
    desc: 'Valoras las experiencias sobre la acumulación y vives el presente con intensidad. Tu punto ciego: sin un sistema automático de ahorro, el futuro puede pillarte desprevenido. No tienes que dejar de disfrutar: solo necesitas que el sistema trabaje por ti en segundo plano.',
    tip: '💡 Desafío: Configura una transferencia automática del 10% de tu sueldo el día de cobro. No lo verás, no lo echarás de menos.',
    famous: 'Como muchos deportistas y artistas: mucho ingreso, poco sistema.'
  }
};

let _ptAnswers = {}; // { tipo: count }
let _ptStep    = -1; // -1 = no iniciado

function PERS_open() {
  _ptAnswers = { ahorrador: 0, inversor: 0, emprendedor: 0, gastador: 0 };
  _ptStep = 0;
  const modal = document.getElementById('personality-modal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  PERS_renderQuestion();
}

function PERS_renderQuestion() {
  const modal = document.getElementById('personality-modal');
  if (!modal) return;
  if (_ptStep >= PERSONALITY_QUESTIONS.length) { PERS_showResult(); return; }
  const q = PERSONALITY_QUESTIONS[_ptStep];
  const pct = Math.round((_ptStep / PERSONALITY_QUESTIONS.length) * 100);
  modal.innerHTML = `
    <div class="pers-container">
      <div class="pers-header">
        <div class="pers-progress-bar"><div class="pers-progress-fill" style="width:${pct}%"></div></div>
        <div class="pers-counter">${_ptStep + 1} / ${PERSONALITY_QUESTIONS.length}</div>
      </div>
      <div class="pers-body">
        <div class="pers-title">🧠 Test de Personalidad Financiera</div>
        <div class="pers-question">${q.q}</div>
        <div class="pers-opts">
          ${q.opts.map((opt,i) => `
            <button class="pers-opt" onclick="PERS_answer('${opt.type}')">
              ${opt.text}
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function PERS_answer(type) {
  _ptAnswers[type] = (_ptAnswers[type] || 0) + 1;
  _ptStep++;
  PERS_renderQuestion();
}

function PERS_showResult() {
  // Determinar tipo dominante
  const dominant = Object.entries(_ptAnswers).sort((a,b) => b[1]-a[1])[0][0];
  S.personalityType    = dominant;
  S.personalityAnswers = Object.values(_ptAnswers);
  saveState();

  const type = PERSONALITY_TYPES[dominant];
  const modal = document.getElementById('personality-modal');
  if (!modal) return;

  modal.innerHTML = `
    <div class="pers-container">
      <div class="pers-result-wrap">
        <div class="pers-result-header" style="--pt-color:${type.color}">
          <div class="pers-result-emoji">${type.emoji}</div>
          <div class="pers-result-name">${type.name}</div>
          <div class="pers-result-sub">${type.subtitle}</div>
        </div>
        <div class="pers-result-body">
          <div class="pers-breakdown">
            ${Object.entries(_ptAnswers).map(([t,v]) => {
              const pt = PERSONALITY_TYPES[t];
              const pct = Math.round(v/8*100);
              return `<div class="pers-bar-row">
                <span>${pt.emoji} ${pt.name}</span>
                <div class="pers-bar-track"><div class="pers-bar-fill" style="width:${pct}%;background:${pt.color}"></div></div>
                <span>${pct}%</span>
              </div>`;
            }).join('')}
          </div>
          <div class="pers-desc">${type.desc}</div>
          <div class="pers-tip">${type.tip}</div>
          <div class="pers-famous">📖 ${type.famous}</div>
          <div class="pers-result-btns">
            <button class="btn btn-primary btn-block" onclick="PERS_share()">📤 Compartir resultado</button>
            <button class="btn btn-ghost btn-sm btn-block" onclick="PERS_close()">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function PERS_share() {
  try {
    const type = PERSONALITY_TYPES[S.personalityType];
    if (!type) return;
    const text = `Soy "${type.name}" ${type.emoji} según el test de FinLearn. ${type.subtitle}. ¿Y tú? 👉 finlearn.app`;
    if (navigator.share) {
      navigator.share({ title: 'Mi perfil financiero en FinLearn', text });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        if (typeof toast === 'function') toast('📋 Copiado', 'Pégalo donde quieras', 't-success');
      });
    }
  } catch(e) { console.warn('PERS_share', e); }
}

function PERS_close() {
  const modal = document.getElementById('personality-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

window.PERS_open   = PERS_open;
window.PERS_answer = PERS_answer;
window.PERS_share  = PERS_share;
window.PERS_close  = PERS_close;

/* ══════════════════════════════════════════════════════════════════
   PRIORIDAD 2C — CERTIFICADOS DE RAMA (Canvas API)
   Al completar todos los módulos de una rama → certificado descargable
══════════════════════════════════════════════════════════════════ */

function CERT_checkBranch(modId) {
  try {
    const branch = F28_BRANCHES.find(b => b.mods.includes(modId));
    if (!branch) return;
    if ((S.branchCerts||[]).includes(branch.id)) return;
    const completed = new Set(S.completedMods||[]);
    const allDone = branch.mods.every(id => completed.has(id));
    if (!allDone) return;
    if (!S.branchCerts) S.branchCerts = [];
    S.branchCerts.push(branch.id);
    saveState();
    setTimeout(() => CERT_openBranch(branch), 1500);
  } catch(e) { console.warn('CERT_checkBranch', e); }
}

function CERT_openBranch(branch) {
  const modal = document.getElementById('cert-branch-modal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  const bossData = BOSS_DATA[branch.id];
  modal.innerHTML = `
    <div class="certb-container">
      <div class="certb-fireworks">
        ${Array.from({length:12},(_,i)=>`<div class="certb-spark certb-spark-${i}" style="--c:${branch.color}"></div>`).join('')}
      </div>
      <div class="certb-inner">
        <div class="certb-badge" style="border-color:${branch.color}">
          <div class="certb-badge-emoji">${branch.emoji}</div>
          <div class="certb-badge-label" style="color:${branch.color}">CERTIFICADO</div>
        </div>
        <div class="certb-title">Rama completada</div>
        <div class="certb-branch-name">${branch.label}</div>
        <div class="certb-user">${S.userName || 'Explorador'}</div>
        <div class="certb-modules">${branch.mods.length} módulos · ${new Date().toLocaleDateString('es-ES', {day:'numeric',month:'long',year:'numeric'})}</div>
        <div class="certb-actions">
          <button class="btn btn-primary" onclick="CERT_download('${branch.id}','${branch.label}','${branch.emoji}','${branch.color}')">⬇️ Descargar certificado</button>
          <button class="btn btn-ghost btn-sm" onclick="CERT_shareBranch('${branch.id}')">📤 Compartir</button>
          <button class="btn btn-ghost btn-sm" onclick="CERT_closeBranch()">Cerrar</button>
        </div>
      </div>
    </div>
  `;
}

function CERT_download(branchId, branchLabel, emoji, color) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width  = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#060810');
    grad.addColorStop(0.5, '#0d1220');
    grad.addColorStop(1, '#060810');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    // Glow overlay
    const radGrad = ctx.createRadialGradient(600, 400, 0, 600, 400, 600);
    radGrad.addColorStop(0, color + '22');
    radGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Border
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 1140, 740);
    ctx.strokeStyle = color + '44';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 1120, 720);

    // FinLearn logo text
    ctx.fillStyle = color;
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✦ FINLEARN', 600, 90);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px Arial';
    ctx.fillText('CERTIFICADO DE DOMINIO', 600, 200);

    // Subtitle
    ctx.fillStyle = '#a0a8c0';
    ctx.font = '28px Arial';
    ctx.fillText('Este certificado acredita que', 600, 265);

    // User name
    ctx.fillStyle = color;
    ctx.font = 'bold 68px Arial';
    ctx.fillText(S.userName || 'Explorador Financiero', 600, 380);

    // Line under name
    ctx.strokeStyle = color + '66';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 405); ctx.lineTo(1000, 405);
    ctx.stroke();

    // Branch info
    ctx.fillStyle = '#ffffff';
    ctx.font = '32px Arial';
    ctx.fillText('ha completado la rama', 600, 455);

    ctx.fillStyle = color;
    ctx.font = 'bold 48px Arial';
    ctx.fillText(emoji + ' ' + branchLabel, 600, 530);

    // Modules count
    const branch = F28_BRANCHES.find(b => b.id === branchId);
    ctx.fillStyle = '#a0a8c0';
    ctx.font = '22px Arial';
    ctx.fillText((branch ? branch.mods.length : '?') + ' módulos completados · FinLearn Academy', 600, 585);

    // Date
    ctx.fillStyle = '#6b7590';
    ctx.font = '20px Arial';
    ctx.fillText('Emitido el ' + new Date().toLocaleDateString('es-ES', {day:'numeric',month:'long',year:'numeric'}), 600, 680);

    // Corner decorations
    const corners = [[80,80],[1120,80],[80,720],[1120,720]];
    corners.forEach(([x,y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI*2);
      ctx.fillStyle = color + '44';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Download
    const link = document.createElement('a');
    link.download = `FinLearn_Certificado_${branchLabel.replace(/\s/g,'_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    if (typeof toast === 'function') toast('🏆 Certificado descargado', branchLabel, 't-success');
  } catch(e) { console.warn('CERT_download error', e); }
}

function CERT_shareBranch(branchId) {
  const branch = F28_BRANCHES.find(b => b.id === branchId);
  if (!branch) return;
  const text = `🏆 Acabo de completar la rama "${branch.label}" ${branch.emoji} en FinLearn. ${branch.mods.length} módulos dominados. ¿Tú dónde estás? 👉 finlearn.app`;
  if (navigator.share) {
    navigator.share({ title: 'Certificado FinLearn', text });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      if (typeof toast === 'function') toast('📋 Copiado', 'Pégalo en tus redes', 't-success');
    });
  }
}

function CERT_closeBranch() {
  const modal = document.getElementById('cert-branch-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Botón en perfil para ver certificados y abrir test
function CERT_openFromProfile(branchId) {
  const branch = F28_BRANCHES.find(b => b.id === branchId);
  if (branch) CERT_openBranch(branch);
}

window.CERT_checkBranch   = CERT_checkBranch;
window.CERT_openBranch    = CERT_openBranch;
window.CERT_download      = CERT_download;
window.CERT_shareBranch   = CERT_shareBranch;
window.CERT_closeBranch   = CERT_closeBranch;
window.CERT_openFromProfile = CERT_openFromProfile;

/* ─────────────────────────────────────────────────────────────────
   PROF_renderGamifCards — Personality + Certs en pantalla de perfil
───────────────────────────────────────────────────────────────── */
function PROF_renderGamifCards() {
  const el = document.getElementById('prof-gamif-cards');
  if (!el) return;

  // Personality card
  const pt = S.personalityType ? PERSONALITY_TYPES[S.personalityType] : null;
  const personalityCard = `
    <div class="prof-gamif-section">
      <div class="prof-gamif-title">🧠 Personalidad Financiera</div>
      ${pt ? `
        <div class="prof-pt-card" style="--pt-color:${pt.color}" onclick="PERS_open()">
          <div class="prof-pt-emoji">${pt.emoji}</div>
          <div class="prof-pt-info">
            <div class="prof-pt-name">${pt.name}</div>
            <div class="prof-pt-sub">${pt.subtitle}</div>
          </div>
          <span class="prof-pt-retake">Repetir →</span>
        </div>
      ` : `
        <button class="prof-pt-cta" onclick="PERS_open()">
          <span>🧠</span>
          <div>
            <div class="prof-pt-cta-title">Descubre tu perfil financiero</div>
            <div class="prof-pt-cta-sub">8 preguntas · 4 arquetipos · Shareable</div>
          </div>
          <span>›</span>
        </button>
      `}
    </div>
  `;

  // Branch certs
  const certs = S.branchCerts || [];
  const certsCard = `
    <div class="prof-gamif-section">
      <div class="prof-gamif-title">🏆 Certificados de Rama</div>
      ${certs.length === 0 ? `
        <div class="prof-certs-empty">Completa todos los módulos de una rama para obtener tu certificado descargable.</div>
      ` : `
        <div class="prof-certs-grid">
          ${certs.map(branchId => {
            const branch = F28_BRANCHES.find(b => b.id === branchId);
            if (!branch) return '';
            return `
              <div class="prof-cert-item" onclick="CERT_openFromProfile('${branch.id}')" style="border-color:${branch.color}22">
                <div class="prof-cert-emoji">${branch.emoji}</div>
                <div class="prof-cert-label">${branch.label}</div>
                <button class="prof-cert-dl" onclick="event.stopPropagation();CERT_download('${branch.id}','${branch.label}','${branch.emoji}','${branch.color}')">⬇️</button>
              </div>
            `;
          }).join('')}
        </div>
      `}
      ${F28_BRANCHES.filter(b => !certs.includes(b.id)).length > 0 ? `
        <div class="prof-certs-pending">${F28_BRANCHES.filter(b => !certs.includes(b.id)).length} ramas pendientes</div>
      ` : '<div class="prof-certs-complete">🎉 ¡Todas las ramas completadas!</div>'}
    </div>
  `;

  // Boss battles summary
  const beaten = S.bossBeaten || [];
  const bossCard = `
    <div class="prof-gamif-section">
      <div class="prof-gamif-title">⚔️ Boss Battles</div>
      <div class="prof-boss-grid">
        ${F28_BRANCHES.map(branch => {
          const b = beaten.includes(branch.id);
          return `
            <div class="prof-boss-item ${b ? 'prof-boss-won' : ''}" ${b ? '' : `onclick="BOSS_open('${branch.id}')"`} title="${b ? 'Derrotado' : 'Click para intentarlo'}">
              <span>${branch.emoji}</span>
              <span class="prof-boss-status">${b ? '⚔️' : '🔒'}</span>
            </div>
          `;
        }).join('')}
      </div>
      <div class="prof-boss-score">${beaten.length} / ${F28_BRANCHES.length} bosses derrotados</div>
    </div>
  `;

  el.innerHTML = personalityCard + certsCard + bossCard;
}

window.PROF_renderGamifCards = PROF_renderGamifCards;


/* ══════════════════════════════════════════════════════════════════
   HEATMAP DE ACTIVIDAD — Real dates (YYYY-MM-DD)
   Registra módulos completados por fecha real.
══════════════════════════════════════════════════════════════════ */
function HEATMAP_record() {
  const today = new Date().toISOString().slice(0, 10);
  if (!S.activityLog) S.activityLog = {};
  S.activityLog[today] = (S.activityLog[today] || 0) + 1;
  saveState();
}

function HEATMAP_render() {
  const wrap = document.getElementById('st-heatmap-wrap');
  if (!wrap) return;

  const log    = S.activityLog || {};
  const today  = new Date();
  const DAYS   = 364; // 52 semanas
  const cols   = 52;
  const rows   = 7;
  const cs     = 10; // cell size
  const gap    = 2;
  const W      = cols * (cs + gap);
  const H      = rows * (cs + gap) + 22;

  // Generar fecha desde hace 364 días
  function dateStr(daysAgo) {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().slice(0, 10);
  }

  // Alinear inicio al lunes más cercano
  const todayDow = today.getDay(); // 0=dom
  const totalCells = cols * rows;

  let cells = '';
  let maxAct = Math.max(1, ...Object.values(log));

  for (let c = cols - 1; c >= 0; c--) {
    for (let r = rows - 1; r >= 0; r--) {
      const cellIdx = (cols - 1 - c) * rows + (rows - 1 - r);
      const daysAgo = DAYS - cellIdx;
      if (daysAgo < 0) continue;
      const ds   = dateStr(daysAgo);
      const act  = log[ds] || 0;
      const isToday = daysAgo === 0;
      const streak = S.streak > 0 && daysAgo < S.streak;

      let fill;
      if (act === 0 && !isToday) {
        fill = 'rgba(255,255,255,0.04)';
      } else if (streak && act > 0) {
        fill = '#f0b429'; // gold for streak days
      } else if (act >= 3) {
        fill = '#00e5a0';
      } else if (act >= 1) {
        fill = '#00b880';
      } else {
        fill = isToday ? 'rgba(0,229,160,0.15)' : 'rgba(255,255,255,0.04)';
      }

      const x = c * (cs + gap);
      const y = r * (cs + gap) + 20;
      const label = ds + (act > 0 ? ': ' + act + ' módulo' + (act > 1 ? 's' : '') : ': sin actividad');
      cells += `<rect x="${x}" y="${y}" width="${cs}" height="${cs}" rx="2" fill="${fill}"><title>${label}</title></rect>`;
    }
  }

  // Month labels
  let mLabels = '';
  const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  let lastMonth = -1;
  for (let c = 0; c < cols; c++) {
    const daysAgo = DAYS - c * rows;
    if (daysAgo < 0) continue;
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    const m = d.getMonth();
    if (m !== lastMonth) {
      lastMonth = m;
      mLabels += `<text x="${c * (cs + gap)}" y="12" font-size="8" fill="#475569">${monthNames[m]}</text>`;
    }
  }

  // Total actividad
  const totalMods = Object.values(log).reduce((a, b) => a + b, 0);
  const activeDays = Object.keys(log).length;

  wrap.innerHTML =
    `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <span style="font-size:12px;color:var(--text2);font-weight:600;">📅 Actividad — últimas 52 semanas</span>
      <span style="font-size:11px;color:var(--text3);">${activeDays} días · ${totalMods} módulos</span>
    </div>` +
    `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;display:block;margin:0 auto;overflow:visible">` +
    mLabels + cells +
    `</svg>` +
    `<div class="st-heatmap-legend">
      <span style="color:var(--text3);font-size:11px">Sin actividad</span>
      <div class="st-hm-sq" style="background:rgba(255,255,255,.04)"></div>
      <div class="st-hm-sq" style="background:#00b880"></div>
      <div class="st-hm-sq" style="background:#00e5a0"></div>
      <div class="st-hm-sq" style="background:#f0b429"></div>
      <span style="color:var(--text3);font-size:11px">Racha activa</span>
    </div>`;
}

window.HEATMAP_record = HEATMAP_record;
window.HEATMAP_render = HEATMAP_render;


/* ══════════════════════════════════════════════════════════════════
   SPEEDRUN MODE — Cronómetro por módulo, récords guardados en S
══════════════════════════════════════════════════════════════════ */
let _speedrunActive   = false;
let _speedrunModId    = null;
let _speedrunStart    = 0;
let _speedrunInterval = null;

function SPEEDRUN_start(modId) {
  // Iniciar módulo en modo speedrun
  _speedrunActive = true;
  _speedrunModId  = modId;
  _speedrunStart  = Date.now();

  // Mostrar timer en lesson screen
  const wrap = document.getElementById('speedrun-timer-wrap');
  if (wrap) wrap.style.display = 'flex';

  if (_speedrunInterval) clearInterval(_speedrunInterval);
  _speedrunInterval = setInterval(() => {
    const secs = Math.floor((Date.now() - _speedrunStart) / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    const el = document.getElementById('speedrun-timer-display');
    if (el) el.textContent = `${m}:${s.toString().padStart(2,'0')}`;
  }, 500);

  startModule(modId);
}

function SPEEDRUN_stop() {
  _speedrunActive = false;
  _speedrunModId  = null;
  if (_speedrunInterval) { clearInterval(_speedrunInterval); _speedrunInterval = null; }
  const wrap = document.getElementById('speedrun-timer-wrap');
  if (wrap) wrap.style.display = 'none';
}

function SPEEDRUN_onComplete(modId) {
  if (!_speedrunActive || _speedrunModId !== modId) return;
  const elapsed = Math.floor((Date.now() - _speedrunStart) / 1000);
  const prev    = (S.speedrunRecords || {})[modId];
  const isNew   = !prev || elapsed < prev;

  if (isNew) {
    if (!S.speedrunRecords) S.speedrunRecords = {};
    S.speedrunRecords[modId] = elapsed;
    saveState();
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    setTimeout(() => toast('⚡ ¡Nuevo récord speedrun!', `${m}:${s.toString().padStart(2,'0')} en este módulo`, 't-success'), 1200);
  }
  // P4-C: tick misión speedrun si < 3 minutos (180 s)
  if (elapsed <= 180 && typeof tickMission === 'function') tickMission('speedrun', 1);
  SPEEDRUN_stop();
}

function SPEEDRUN_renderRecords() {
  const el = document.getElementById('speedrun-records-list');
  if (!el) return;
  const records = S.speedrunRecords || {};
  const entries = Object.entries(records)
    .map(([id, secs]) => ({ id: +id, secs, mod: MODULES.find(m => m && m.id === +id) }))
    .filter(e => e.mod)
    .sort((a, b) => a.secs - b.secs)
    .slice(0, 5);

  if (entries.length === 0) {
    el.innerHTML = '<div style="color:var(--text3);font-size:13px;text-align:center;padding:16px 0;">Aún no tienes récords. Usa ⚡ Speedrun en cualquier módulo.</div>';
    return;
  }

  el.innerHTML = entries.map((e, i) => {
    const m = Math.floor(e.secs / 60);
    const s = e.secs % 60;
    const medals = ['🥇','🥈','🥉','4️⃣','5️⃣'];
    return `<div class="speedrun-record-row">
      <span class="sr-medal">${medals[i]}</span>
      <span class="sr-icon">${e.mod.icon}</span>
      <div class="sr-info">
        <div class="sr-title">${e.mod.title}</div>
        <div class="sr-branch">${e.mod.tag}</div>
      </div>
      <div class="sr-time">${m}:${s.toString().padStart(2,'0')}</div>
    </div>`;
  }).join('');
}

window.SPEEDRUN_start    = SPEEDRUN_start;
window.SPEEDRUN_stop     = SPEEDRUN_stop;
window.SPEEDRUN_onComplete = SPEEDRUN_onComplete;
window.SPEEDRUN_renderRecords = SPEEDRUN_renderRecords;


/* ══════════════════════════════════════════════════════════════════
   SEASONAL EVENTS — Eventos por fecha real del calendario
══════════════════════════════════════════════════════════════════ */
const SEASONAL_EVENTS = [
  {
    id:     'fire_enero',
    name:   '🔥 Reto FIRE de Enero',
    desc:   'Todo el mes de enero — módulos de libertad financiera con XP ×1.5',
    color:  '#e25822',
    accent: '#ff7043',
    xpMult: 1.5,
    check:  (d) => d.getMonth() === 0, // enero
    rewardDesc: 'Cofre Especial + Badge "Guerrero FIRE"',
    modHighlight: ['inversion', 'avanzado'],
    badge:  '🔥 Guerrero FIRE',
  },
  {
    id:     'renta_marzo',
    name:   '💰 Campaña de la Renta',
    desc:   '1-15 de marzo — domina el IRPF antes de la campaña',
    color:  '#1a73e8',
    accent: '#42a5f5',
    xpMult: 1.0,
    check:  (d) => d.getMonth() === 2 && d.getDate() <= 15, // 1-15 marzo
    rewardDesc: 'Cofre Especial + Badge "Maestro Fiscal"',
    modHighlight: ['fiscalidad'],
    badge:  '💸 Maestro Fiscal',
  },
  {
    id:     'blackfriday_nov',
    name:   '🛒 Black Friday Inversor',
    desc:   '25-30 nov — reto anti-consumismo, psicología del gasto',
    color:  '#212121',
    accent: '#ffd600',
    xpMult: 1.0,
    check:  (d) => d.getMonth() === 10 && d.getDate() >= 25, // 25-30 nov
    rewardDesc: 'Cofre Especial + Badge "Inversor Consciente"',
    modHighlight: ['psicologia'],
    badge:  '🧠 Inversor Consciente',
  },
  {
    id:     'balance_dic',
    name:   '🎁 Balance Financiero Anual',
    desc:   'Diciembre — revisa tu año y calcula tu patrimonio neto',
    color:  '#2e7d32',
    accent: '#66bb6a',
    xpMult: 1.0,
    check:  (d) => d.getMonth() === 11, // diciembre
    rewardDesc: 'Cofre Especial + Badge "Planificador del Año"',
    modHighlight: ['fundamentos', 'avanzado'],
    badge:  '📊 Planificador del Año',
  },
];

function SEA_getActiveEvent() {
  const now = new Date();
  return SEASONAL_EVENTS.find(e => e.check(now)) || null;
}

function SEA_render() {
  const banner = document.getElementById('seasonal-banner');
  if (!banner) return;
  const ev = SEA_getActiveEvent();
  if (!ev) { banner.style.display = 'none'; return; }

  banner.style.display = 'block';
  banner.innerHTML = `
    <div class="seasonal-banner-inner" style="--sea-color:${ev.color};--sea-accent:${ev.accent};">
      <div class="sea-left">
        <div class="sea-name">${ev.name}</div>
        <div class="sea-desc">${ev.desc}</div>
        ${ev.xpMult > 1 ? `<div class="sea-mult-badge">⚡ XP ×${ev.xpMult}</div>` : ''}
      </div>
      <button class="sea-cta-btn" onclick="SEA_openDetail()">Ver reto →</button>
    </div>`;
}

function SEA_openDetail() {
  const ev = SEA_getActiveEvent();
  if (!ev) return;
  const rewardKey = ev.id + '_' + new Date().getFullYear();
  const claimed   = (S.seenSeasonalRewards || []).includes(rewardKey);

  const html = `
    <div style="padding:24px;text-align:center;">
      <div style="font-size:40px;margin-bottom:12px;">${ev.name.split(' ')[0]}</div>
      <div style="font-size:20px;font-weight:700;margin-bottom:8px;">${ev.name}</div>
      <div style="color:var(--text2);font-size:14px;margin-bottom:20px;">${ev.desc}</div>
      ${ev.xpMult > 1 ? `<div class="sea-modal-mult">⚡ XP ×${ev.xpMult} activo todo el evento</div>` : ''}
      <div class="sea-reward-box">
        <div style="font-size:13px;font-weight:600;color:var(--text1);">🎁 Recompensa al completar el reto:</div>
        <div style="font-size:13px;color:var(--text2);margin-top:4px;">${ev.rewardDesc}</div>
      </div>
      ${claimed
        ? `<div class="sea-claimed">✅ ¡Recompensa reclamada!</div>`
        : `<button class="btn btn-primary" style="margin-top:20px;width:100%;" onclick="SEA_claimReward('${rewardKey}','${ev.badge}')">🎁 Reclamar recompensa del evento</button>`
      }
      <button class="btn btn-ghost" style="margin-top:12px;width:100%;" onclick="closeModal('m-sea')">Cerrar</button>
    </div>`;

  let modal = document.getElementById('m-sea');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-sea';
    modal.className = 'modal-overlay';
    modal.innerHTML = `<div class="modal-card" style="max-width:400px;">${html}</div>`;
    document.body.appendChild(modal);
  } else {
    modal.querySelector('.modal-card').innerHTML = html;
  }
  openModal('m-sea');
}

function SEA_claimReward(rewardKey, badge) {
  if (!S.seenSeasonalRewards) S.seenSeasonalRewards = [];
  if (S.seenSeasonalRewards.includes(rewardKey)) return;
  S.seenSeasonalRewards.push(rewardKey);
  // Dar cofre especial (gold — 'epic' no existe en CHEST_REWARDS)
  if (!S.chestsAvailable) S.chestsAvailable = [];
  S.chestsAvailable.push({ type: 'gold', earnedAt: Date.now() });
  // Dar XP bonus
  S.xp += 300;
  if (typeof F34_onXPGained === 'function') F34_onXPGained(300);
  saveState();
  checkAchievements();
  closeModal('m-sea');
  toast('🎁 ¡Recompensa reclamada!', badge + ' · +300 XP · Cofre Oro', 't-success');
  if (typeof F44_render === 'function') F44_render();
}

// Hook: aplicar multiplicador de evento al ganar XP (solo para módulos)
function SEA_getXPMult() {
  const ev = SEA_getActiveEvent();
  return ev ? (ev.xpMult || 1) : 1;
}

window.SEA_render      = SEA_render;
window.SEA_openDetail  = SEA_openDetail;
window.SEA_claimReward = SEA_claimReward;
window.SEA_getXPMult   = SEA_getXPMult;

function _renderGroupMissionEpic() {
  const el = document.getElementById('challenge-card') || document.getElementById('group-mission-card');
  if (!el) return;
  const S_ = window.S || {};
  const goal = 100000;
  const progress = Math.min(goal, (S_._groupXP || 0) + (S_.xp || 0));
  const pct = Math.round((progress / goal) * 100);
  const daysLeft = 7 - (new Date().getDay());
  const msg = pct < 25 ? '🌱 Está comenzando. Tu XP suma al equipo.'
            : pct < 50 ? '🔥 ¡Vamos por buen camino! Cada módulo cuenta.'
            : pct < 75 ? '⚡ Más de la mitad. El objetivo está cerca.'
            : pct < 100 ? '🎯 ¡A por el último empujón! Faltan pocas horas.'
            : '🏆 ¡META CONSEGUIDA! Todos ganan recompensa grupal.';
  el.innerHTML = `
    <div style="padding:18px 20px;background:linear-gradient(135deg,rgba(108,99,255,.12),rgba(245,166,35,.08));border:1px solid rgba(108,99,255,.2);border-radius:18px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-20px;right:-20px;font-size:80px;opacity:.08;">🌍</div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;position:relative;">
        <div style="font-size:22px;">🌍</div>
        <div style="flex:1;">
          <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:15px;color:var(--text1);">Misión Global de la Semana</div>
          <div style="font-size:11px;color:var(--text2);">${daysLeft} días restantes · Objetivo colectivo</div>
        </div>
        <div style="background:rgba(245,166,35,.15);border:1px solid rgba(245,166,35,.3);padding:4px 10px;border-radius:99px;font-size:10px;font-weight:800;color:#f5a623;">+500 XP</div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text2);margin-bottom:6px;">
        <span>${progress.toLocaleString('es')} XP</span>
        <span style="font-weight:700;color:var(--text1);">${goal.toLocaleString('es')} XP</span>
      </div>
      <div style="height:12px;background:rgba(0,0,0,.3);border-radius:99px;overflow:hidden;position:relative;">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#6c63ff,#f5a623);border-radius:99px;transition:width .6s;box-shadow:0 0 12px rgba(245,166,35,.4);position:relative;">
          ${pct > 5 ? `<div style="position:absolute;right:4px;top:50%;transform:translateY(-50%);font-size:10px;font-weight:800;color:#000;">${pct}%</div>` : ''}
        </div>
      </div>
      <div style="margin-top:12px;font-size:12px;color:var(--text2);text-align:center;font-style:italic;">${msg}</div>
    </div>`;
}
window._renderGroupMissionEpic = _renderGroupMissionEpic;

/* ══ GLOBAL ERROR SAFETY NET ══════════════════════════════════════
   Si una función de render falla, no debe romper toda la app.
   Captura errores no manejados y oculta el splash de emergencia.
═══════════════════════════════════════════════════════════════════ */
window.addEventListener('error', function(e) {
  console.warn('[FinLearn] Error capturado:', e.message, 'en', e.filename + ':' + e.lineno);
  var s = document.getElementById('app-splash');
  if (s && s.style.display !== 'none') {
    s.classList.add('splash-out');
    setTimeout(function() { s.style.display = 'none'; }, 600);
  }
});
window.addEventListener('unhandledrejection', function(e) {
  console.warn('[FinLearn] Promise rechazada:', e.reason);
  var s = document.getElementById('app-splash');
  if (s && s.style.display !== 'none') {
    s.classList.add('splash-out');
    setTimeout(function() { s.style.display = 'none'; }, 600);
  }
});

// ═══ INIT + WINDOW BRIDGE ═══

/* ══ AMBIENT BACKGROUND ══════════════════════════════════════════ */
function _initAmbient() {
  // Create canvas for ultra-subtle floating finance particles
  if (document.getElementById('ambient-canvas')) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'ambient-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0;';
  const root = document.getElementById('app') || document.body;
  root.prepend(canvas);

  // ── Premium ambient layers (CSS-only, injected once) ──
  if (!document.getElementById('aurora-layer')) {
    ['aurora-layer','scanlines-layer','vignette-layer'].forEach(id => {
      const d = document.createElement('div');
      d.id = id;
      root.prepend(d);
    });
  }

  const ctx = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

  // Finance symbols & micro-glyphs
  const GLYPHS = ['€','$','%','↑','↗','▲','◆','●','◉','⬡','○','◇'];
  const N = 26;
  const isLight = () => document.body.classList.contains('light-mode');

  class Particle {
    constructor(fromBottom) {
      this.reset(fromBottom);
    }
    reset(fromBottom) {
      this.x    = Math.random() * W;
      this.y    = fromBottom ? H + 20 : Math.random() * H;
      this.size = 8 + Math.random() * 14;
      this.spd  = 0.12 + Math.random() * 0.22;
      this.drift= (Math.random() - 0.5) * 0.18;
      this.alpha= 0.03 + Math.random() * 0.055;
      this.glyph= GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      this.rot  = Math.random() * Math.PI * 2;
      this.rotSpd = (Math.random() - 0.5) * 0.004;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpd = 0.008 + Math.random() * 0.012;
      // color family
      const paletteDark  = ['rgba(110,86,255,A)','rgba(0,229,160,A)','rgba(240,180,40,A)','rgba(255,255,255,A)'];
      const paletteLight = ['rgba(13,122,88,A)','rgba(79,70,160,A)','rgba(180,130,20,A)','rgba(30,34,53,A)'];
      const pal = isLight() ? paletteLight : paletteDark;
      this.colorBase = pal[Math.floor(Math.random()*pal.length)];
    }
    update() {
      this.y    -= this.spd;
      this.x    += this.drift;
      this.rot  += this.rotSpd;
      this.pulse += this.pulseSpd;
      if (this.y < -30) this.reset(true);
      if (this.x < -30 || this.x > W + 30) this.x = Math.random() * W;
    }
    draw() {
      const a = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.font = `${this.size}px 'Syne', sans-serif`;
      ctx.fillStyle = this.colorBase.replace('A', a.toFixed(3));
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.glyph, 0, 0);
      ctx.restore();
    }
  }

  // Also draw subtle rising line traces (market chart lines)
  class Trace {
    constructor() { this.reset(); }
    reset() {
      this.x   = Math.random() * W;
      this.y   = H + 10;
      this.pts = [];
      this.spd = 0.3 + Math.random() * 0.5;
      this.alpha = 0.015 + Math.random() * 0.025;
      this.width = 0.5 + Math.random();
      const paletteDark  = ['rgba(0,229,160,A)','rgba(110,86,255,A)'];
      const paletteLight = ['rgba(13,122,88,A)','rgba(79,70,160,A)'];
      const pal = isLight() ? paletteLight : paletteDark;
      this.color = pal[Math.floor(Math.random()*pal.length)];
      this.drift = (Math.random() - 0.5) * 1.2;
    }
    update() {
      this.y -= this.spd;
      this.x += this.drift + (Math.random()-0.5)*0.4;
      this.pts.push({x:this.x, y:this.y});
      if (this.pts.length > 60) this.pts.shift();
      if (this.y < -20) this.reset();
    }
    draw() {
      if (this.pts.length < 2) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.pts[0].x, this.pts[0].y);
      for (let i = 1; i < this.pts.length; i++) {
        ctx.lineTo(this.pts[i].x, this.pts[i].y);
      }
      ctx.strokeStyle = this.color.replace('A', this.alpha.toFixed(3));
      ctx.lineWidth   = this.width;
      ctx.stroke();
      ctx.restore();
    }
  }

  const particles = Array.from({length: N}, () => new Particle(false));
  const traces    = Array.from({length: 6}, () => new Trace());

  let raf;
  function tick() {
    ctx.clearRect(0, 0, W, H);
    traces.forEach(t => { t.update(); t.draw(); });
    particles.forEach(p => { p.update(); p.draw(); });
    raf = requestAnimationFrame(tick);
  }
  tick();

  // Pause when tab hidden (performance)
  let _wasMusicPlaying = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      if (typeof MUSIC !== 'undefined' && MUSIC.isPlaying && MUSIC.isPlaying()) {
        _wasMusicPlaying = true;
        MUSIC.stop();
      } else {
        _wasMusicPlaying = false;
      }
    } else {
      tick();
      if (_wasMusicPlaying && typeof MUSIC !== 'undefined' && MUSIC.start) {
        setTimeout(() => MUSIC.start(), 300);
      }
    }
  });
}

const _appStartTime = Date.now();
setInterval(() => {
  if (document.hidden) return;
  if (!document.getElementById('game-clock-pill')) return;
  if (typeof _renderGameClock === 'function') _renderGameClock();
}, 5000);
function initApp() {
  _showSplash();
  // Intentar sesión Supabase primero; si hay usuario logado, cargar desde la nube
  if (typeof sbInit === 'function') {
    sbInit().then(async hasSession => {
      let hasState = false;
      if (hasSession) {
        hasState = await sbLoadState();
        // Si no había estado en la nube pero sí local, subir el local
        if (!hasState) {
          hasState = loadState();
          if (hasState && typeof sbSaveState === 'function') sbSaveState();
        }
      } else {
        hasState = loadState();
      }
      try { _initAppWithState(hasState); } catch(e) { console.warn('[FinLearn] init error:', e); _hideSplash(); }
    }).catch(() => {
      try {
        const hasState = loadState();
        _initAppWithState(hasState);
      } catch(e) { console.warn('[FinLearn] init fallback error:', e); _hideSplash(); }
    });
    return;
  }
  const hasState = loadState();
  _initAppWithState(hasState);
}

function _initAppWithState(hasState) {

  // ── Inicializar precios de stocks desde datos estáticos ─────────────
  STOCKS.forEach(s => {
    GAME.stockPrices[s.ticker] = s.price;
    // Generar historial simulado de 60 velas con tendencia realista
    const history = [];
    let price = s.price * (0.80 + Math.random() * 0.15); // empezar 5-20% más bajo
    const trend = 1 + (s.change || 0) / 100 / 30; // tendencia diaria implícita
    for (let i = 0; i < 59; i++) {
      price *= trend * (0.985 + Math.random() * 0.03);
      history.push(+price.toFixed(2));
    }
    history.push(s.price); // última = precio actual exacto
    GAME.priceHistory[s.ticker] = history;
  });

  // ── Datos de mercado reales (Cloudflare Function → Yahoo Finance) ────
  setTimeout(function() { if (typeof MARKET !== 'undefined') MARKET.init(); }, 3000);

  // ── Simulación de precios en tiempo real (cada 4 segundos) ───────────
  setInterval(() => {
    // ── Flash Crash: 0.5% de probabilidad por tick ──────────────
    const isFlashCrash = Math.random() < 0.005;
    if (isFlashCrash && !_crisisActive) {
      const crashStock = STOCKS[Math.floor(Math.random() * STOCKS.length)];
      const crashMult  = 0.65 + Math.random() * 0.1; // -25% a -35%
      GAME.stockPrices[crashStock.ticker] = +(GAME.stockPrices[crashStock.ticker] * crashMult).toFixed(2);
      GAME.priceHistory[crashStock.ticker].push(GAME.stockPrices[crashStock.ticker]);
      _showNewsBanner({ headline: `⚡ FLASH CRASH — ${crashStock.ticker} −${Math.round((1-crashMult)*100)}% en segundos`, positive: false });
      HAPTIC.heavy();
      document.body.classList.add('market-shake');
      setTimeout(() => document.body.classList.remove('market-shake'), 500);
      GAME._lastFlashCrashTicker = crashStock.ticker;
      GAME._flashCrashTime = Date.now();
    }

    STOCKS.forEach(s => {
      const cur = GAME.stockPrices[s.ticker] || s.price;
      // Movimiento ±0.4% por tick (~6% al día simulado)
      const delta = cur * (0.996 + Math.random() * 0.008);
      GAME.stockPrices[s.ticker] = +delta.toFixed(2);
      // Añadir al historial y mantener ventana de 60 velas
      GAME.priceHistory[s.ticker].push(+delta.toFixed(2));
      if (GAME.priceHistory[s.ticker].length > 60) GAME.priceHistory[s.ticker].shift();
    });
    // Noticias de mercado que mueven precios
    _checkMarketNews();

    // Si el modal de stock está abierto, actualizar precio y gráfico en vivo
    if (GAME.currentStock) {
      const ticker = GAME.currentStock.ticker;
      const livePrice = GAME.stockPrices[ticker];
      setEl('sdh-price', fmtPrice(livePrice));
      renderMiniChart(ticker);
      updateQtyDisplay();
    }
  }, 4000);

  // Si el usuario ya completó el onboarding, mostrar home
  if (hasState && S.userName) {
    showScreen('s-home');
    document.getElementById('bottom-nav')?.classList?.remove('hidden');
    const _skel = document.getElementById('home-skeleton');
    if (_skel) _skel.style.display = 'block';
    try { renderHomeScreen(); } catch(e) { console.warn('[FinLearn] renderHomeScreen error:', e); }
    setTimeout(_hideSplash, 400);
  } else {
    showScreen('s-onboard');
    setTimeout(_hideSplash, 600);
  }

  // Iniciar timers
  _initCountdowns();

  // Calculadora inicial
  CALC.update();

  // Iniciar reloj de juego (1 día = 5 min reales)
  _startGameClock();

  // Restaurar velocidad de juego guardada
  if (S.gameSpeedMult && S.gameSpeedMult > 1) {
    setTimeout(() => _applyGameSpeed(S.gameSpeedMult), 500);
  }

  // Iniciar ticker de precios en vivo
  _initPriceTicker();

  // Iniciar motor de música lo-fi
  MUSIC.init();

  // Comprobar regalo diario de login
  checkDailyLogin();

  // Modal de bienvenida de regreso (>2h fuera)
  checkWelcomeBack();

  // F43: Rentabilidad pasiva offline
  if (typeof F43_checkOfflineEarnings === 'function') setTimeout(F43_checkOfflineEarnings, 1200);
  // Stripe: detectar cancelación de pago
  if (new URLSearchParams(window.location.search).get('cancelled') === '1') {
    history.replaceState({}, '', window.location.pathname);
    setTimeout(() => toast('💳 Pago cancelado', 'Puedes intentarlo cuando quieras.', 't-warn'), 1000);
  }
  // Stripe: detectar retorno con premium activado
  const _stripeParams = new URLSearchParams(window.location.search);
  if (_stripeParams.get('premium') === '1') {
    try {
      localStorage.setItem(PREMIUM_KEY, '1');
      S._premium = '1';
      if (typeof sbSetPremium === 'function' && typeof getSBUser === 'function' && getSBUser()) {
        sbSetPremium(true);
      }
      saveState();
      history.replaceState({}, '', window.location.pathname);
      setTimeout(() => {
        toast('👑 ¡Bienvenido a Premium!', 'Todas las funciones están desbloqueadas.', 't-success');
        if (typeof confetti === 'function') { confetti(); setTimeout(confetti, 400); }
        if (typeof renderHomeScreen === 'function') renderHomeScreen();
      }, 1500);
    } catch(e) {}
  }
  // F47: Dilema semanal (lunes) — en lunes con login nuevo (ruleta activa) retrasar a 12s
  if (typeof F47_checkShow === 'function') {
    const _f47IsMonday = new Date().getDay() === 1;
    setTimeout(F47_checkShow, _f47IsMonday ? 12000 : 2000);
  }
  // F48: Snapshot semanal update
  if (typeof F48_updateSnapshot === 'function') F48_updateSnapshot();
  // P4-C: Misiones semanales
  initWeeklyMissions();

  // Aviso legal (primera vez que abre la app)
  setTimeout(_checkLegalDisclaimer, 1800);
  // Referidos: detectar parámetro ?ref=CODE en URL
  _checkReferralParam();

  // App iniciada
  _initAmbient();
}


/* ══════════════════════════════════════════════════════════════════
   LEGAL DISCLAIMER — Mostrar aviso legal la primera vez
══════════════════════════════════════════════════════════════════ */
const _LEGAL_KEY = 'fl_legal_v1';

function _checkLegalDisclaimer() {
  if (localStorage.getItem(_LEGAL_KEY)) return; // ya aceptado
  const el = document.getElementById('m-legal');
  if (!el) return;
  el.style.display = 'flex';
}

function _acceptLegal() {
  const check = document.getElementById('legal-check');
  const btn   = document.getElementById('legal-accept-btn');
  if (check && !check.checked) {
    if (btn) btn.style.animation = 'shake .3s ease';
    setTimeout(() => { if (btn) btn.style.animation = ''; }, 400);
    toast('✋ Un momento', 'Marca la casilla para continuar.', 't-warn');
    return;
  }
  localStorage.setItem(_LEGAL_KEY, '1');
  const el = document.getElementById('m-legal');
  if (el) { el.style.opacity = '0'; el.style.transition = 'opacity .2s'; setTimeout(() => { el.style.display = 'none'; el.style.opacity = ''; }, 200); }
}

window._checkLegalDisclaimer = _checkLegalDisclaimer;
window._acceptLegal           = _acceptLegal;

/* ══════════════════════════════════════════════════════════════════
   REFERIDOS — Detectar código ?ref= y entregar recompensa
══════════════════════════════════════════════════════════════════ */
function _checkReferralParam() {
  const params = new URLSearchParams(window.location.search);
  const ref    = params.get('ref');
  if (!ref || S._referredBy) return;
  if (ref.length < 4 || ref.length > 8) return;
  // No auto-referirse con el propio código
  if (S.friendCode && ref.toUpperCase() === S.friendCode.toUpperCase()) return;
  S._referredBy = ref.toUpperCase();
  history.replaceState({}, '', window.location.pathname);
  saveState();
}

function _checkReferralReward() {
  if (S._referralRewarded || !S._referredBy) return;
  // Solo se entrega al completar el primer módulo real (completedMods.length === 1)
  if ((S.completedMods || []).length !== 1) return;
  S._referralRewarded = true;
  const xpBonus = 200;
  S.xp += xpBonus;
  F34_onXPGained(xpBonus);
  recalcPatrimony();
  saveState();
  toast('🎁 ¡Bono de referido!', `+${xpBonus} XP por unirte con el código de un amigo.`, 't-success');
  try {
    fetch('/api/referral-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referrerCode: S._referredBy, newUserCode: S.friendCode || '' }),
    }).catch(() => {});
  } catch(e) {}
}

window._checkReferralParam  = _checkReferralParam;
window._checkReferralReward = _checkReferralReward;

/* ══════════════════════════════════════════════════════════════════
   CHART — Gráfica de mercado en tiempo real con Chart.js
   Muestra el historial de precios del ticker activo en s-portfolio.
══════════════════════════════════════════════════════════════════ */
const CHART = (() => {
  let _chart = null;
  let _ticker = 'VUSA';
  let _liveInterval = null;

  function _getStock(ticker) {
    return STOCKS.find(s => s.ticker === ticker) || STOCKS[0];
  }

  function _buildDataset(ticker) {
    const hist = GAME.priceHistory[ticker] || [];
    return hist.map((v, i) => ({ x: i, y: v }));
  }

  function _updateHeader(ticker) {
    const stock = _getStock(ticker);
    const price = GAME.stockPrices[ticker] || stock.price;
    const hist  = GAME.priceHistory[ticker] || [];
    const first = hist[0] || price;
    const pct   = ((price - first) / first * 100).toFixed(2);
    const up    = price >= first;
    const el = id => document.getElementById(id);
    if (el('chart-ticker-icon'))  el('chart-ticker-icon').textContent  = stock.icon || '📈';
    if (el('chart-ticker-name'))  el('chart-ticker-name').textContent  = stock.name;
    if (el('chart-ticker-sub'))   el('chart-ticker-sub').textContent   = ticker + ' · Últimas 60 velas';
    if (el('chart-price'))        el('chart-price').textContent        = fmtPrice(price);
    if (el('chart-pct')) {
      el('chart-pct').textContent  = (up ? '+' : '') + pct + '%';
      el('chart-pct').style.color  = up ? 'var(--accent)' : 'var(--danger)';
    }
  }

  function _renderQuickTickers() {
    const el = document.getElementById('chart-quick-tickers');
    if (!el) return;
    const featured = STOCKS.filter(s => s.featured).slice(0, 6);
    el.innerHTML = featured.map(s => {
      const price = GAME.stockPrices[s.ticker] || s.price;
      const hist  = GAME.priceHistory[s.ticker] || [];
      const pct   = hist.length > 1 ? ((price - hist[0]) / hist[0] * 100).toFixed(1) : '0.0';
      const up    = parseFloat(pct) >= 0;
      return `<div class="qt-pill${s.ticker === _ticker ? ' active' : ''}" onclick="CHART.focus('${s.ticker}')">
        <span>${s.icon} ${s.ticker}</span>
        <span style="color:${up ? 'var(--accent)' : 'var(--danger)'};font-size:10px">${up ? '+' : ''}${pct}%</span>
      </div>`;
    }).join('');
  }

  function focus(ticker) {
    _ticker = ticker;
    _update();
    _renderQuickTickers();
  }

  function _update() {
    const canvas = document.getElementById('marketChart');
    if (!canvas) return;
    if (typeof Chart === 'undefined') return;

    const ticker = _ticker;
    const hist   = GAME.priceHistory[ticker] || [];
    if (!hist.length) return;

    const labels = hist.map((_, i) => i);
    const first  = hist[0];
    const last   = hist[hist.length - 1];
    const up     = last >= first;
    const color  = up ? '#00e5a0' : '#ef4444';

    _updateHeader(ticker);

    if (_chart) {
      _chart.data.labels = labels;
      _chart.data.datasets[0].data = hist;
      _chart.data.datasets[0].borderColor = color;
      _chart.data.datasets[0].backgroundColor = up
        ? 'rgba(0,229,160,0.08)' : 'rgba(239,68,68,0.08)';
      _chart.update('none');
      return;
    }

    // Create chart
    _chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: hist,
          borderColor: color,
          backgroundColor: up ? 'rgba(0,229,160,0.08)' : 'rgba(239,68,68,0.08)',
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
          tension: 0.3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: { legend: { display: false }, tooltip: {
          mode: 'index', intersect: false,
          callbacks: { label: ctx => ' ' + fmtPrice(ctx.parsed.y) }
        }},
        scales: {
          x: { display: false },
          y: {
            display: true,
            position: 'right',
            grid: { color:document.body.classList.contains('light-mode')?'rgba(60,50,30,.07)':'rgba(255,255,255,.05)' },
            ticks: { color:document.body.classList.contains('light-mode')?'rgba(60,50,30,.5)':'rgba(255,255,255,.4)', font: { size: 10 },
              callback: v => fmtPrice(v) }
          }
        }
      }
    });
  }

  function init() {
    // Start with VUSA or first available stock
    _ticker = STOCKS.find(s => s.featured)?.ticker || STOCKS[0]?.ticker || 'VUSA';
    _update();
    _renderQuickTickers();
    // Live update every 4s when portfolio screen is visible
    if (_liveInterval) clearInterval(_liveInterval);
    _liveInterval = setInterval(() => {
      const portfolio = document.getElementById('s-portfolio');
      if (portfolio?.classList.contains('active')) {
        _update();
        _renderQuickTickers();
      }
    }, 4000);
  }

  return { focus, init, update: _update };
})();


/* ══════════════════════════════════════════════════════════════════
   DAILY LOGIN REWARDS — Feature 9: Ruleta Diaria
   ─────────────────────────────────────────────────────────────────
   · Premio determinista por fecha (seed = fecha ISO) — no hay trampa
     recargando la página.
   · Premios escalonados por racha:
       streak < 3  → tier 0 (XP pequeño)
       streak 3–6  → tier 0–1 (+cash virtual)
       streak ≥ 7  → tier 0–2 (+escudo, inversión, gran cash)
   · Animación CSS real de giro (3 s) antes de revelar el premio.
   · Reemplaza completamente el modal anterior.
══════════════════════════════════════════════════════════════════ */

// 8 segmentos fijos en la ruleta. Tier indica racha mínima para ganarlos.
const ROULETTE_SEGS = [
  { id:'xp50',   icon:'\u26a1', label:'+50 XP',        color:'#00e5a0', type:'xp',     amount:50,   tier:0 },
  { id:'xp100',  icon:'\uD83C\uDF31', label:'+100 XP', color:'#00b880', type:'xp',     amount:100,  tier:0 },
  { id:'xp200',  icon:'\uD83D\uDD25', label:'+200 XP', color:'#ff6b35', type:'xp',     amount:200,  tier:1 },
  { id:'cash500',icon:'\uD83D\uDCB0', label:'+\u20AC500', color:'#f0b429', type:'cash', amount:500,  tier:1 },
  { id:'xp150',  icon:'\u2b50', label:'+150 XP',        color:'#8b5cf6', type:'xp',     amount:150,  tier:0 },
  { id:'cash1k', icon:'\uD83D\uDC8E', label:'+\u20AC1.000', color:'#3b82f6', type:'cash', amount:1000, tier:2 },
  { id:'shield', icon:'\uD83D\uDEE1', label:'\u00a1Escudo!', color:'#f59e0b', type:'shield', amount:1, tier:2 },
  { id:'invest', icon:'\uD83D\uDCC8', label:'+\u20AC2.000 inv', color:'#ec4899', type:'invest', amount:2000, tier:2 },
];

// Devuelve qué segmentos son elegibles según racha
function _rouletteEligible(streak) {
  const maxTier = (streak >= 7) ? 2 : (streak >= 3) ? 1 : 0;
  return ROULETTE_SEGS.filter(s => s.tier <= maxTier);
}

// Determinista: misma fecha + racha → mismo premio
function _rouletteRoll(dateStr, streak) {
  const pool = _rouletteEligible(streak);
  // Simple hash de la cadena de fecha
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  const chosen = pool[hash % pool.length];
  // Devuelve el índice real en ROULETTE_SEGS
  return ROULETTE_SEGS.findIndex(s => s.id === chosen.id);
}

// Genera el SVG de la rueda (8 sectores)
function _buildRouletteSVG() {
  const R = 110, cx = 120, cy = 120;
  const total = ROULETTE_SEGS.length;
  const angle = (2 * Math.PI) / total;
  let paths = '';
  let labels = '';

  ROULETTE_SEGS.forEach((seg, i) => {
    const startA = i * angle - Math.PI / 2;
    const endA   = startA + angle;
    const x1 = cx + R * Math.cos(startA), y1 = cy + R * Math.sin(startA);
    const x2 = cx + R * Math.cos(endA),   y2 = cy + R * Math.sin(endA);
    paths += '<path d="M' + cx + ',' + cy + ' L' + x1.toFixed(2) + ',' + y1.toFixed(2) +
             ' A' + R + ',' + R + ' 0 0,1 ' + x2.toFixed(2) + ',' + y2.toFixed(2) + ' Z"' +
             ' fill="' + seg.color + '" opacity="0.88" stroke="#0a0f1e" stroke-width="1.5"/>';
    // Icon label — midpoint
    const midA  = startA + angle / 2;
    const lx    = cx + (R * 0.65) * Math.cos(midA);
    const ly    = cy + (R * 0.65) * Math.sin(midA);
    labels += '<text x="' + lx.toFixed(1) + '" y="' + (ly + 5).toFixed(1) + '"' +
              ' text-anchor="middle" font-size="18" style="user-select:none">' + seg.icon + '</text>';
  });

  return '<svg id="rl-wheel-svg" viewBox="0 0 240 240" width="220" height="220"' +
         ' style="transition:transform 3s cubic-bezier(.17,.67,.12,1);transform-origin:center;display:block;margin:0 auto">' +
         '<defs><filter id="rl-shadow"><feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="rgba(0,0,0,.5)"/></filter></defs>' +
         '<g filter="url(#rl-shadow)">' + paths + '</g>' +
         '<circle cx="' + cx + '" cy="' + cy + '" r="18" fill="#0a0f1e" stroke="rgba(255,255,255,.15)" stroke-width="2"/>' +
         '<text x="' + cx + '" y="' + (cy + 6) + '" text-anchor="middle" font-size="14" fill="white">\uD83C\uDF40</text>' +
         labels +
         '</svg>';
}

// Calcula los grados de rotación para que el segmento winIdx quede en el tope (puntero arriba)
function _rouletteTargetDeg(winIdx) {
  const segDeg  = 360 / ROULETTE_SEGS.length;      // 45°
  const centerDeg = winIdx * segDeg + segDeg / 2;  // centro del segmento ganador
  // Queremos que ese centro quede en 0° (arriba), así que rotamos en sentido contrario
  // Añadimos 5 vueltas completas para el efecto visual
  return 360 * 5 - centerDeg;
}

function showDailyRewardModal(dayCount) {
  var today    = new Date().toISOString().slice(0, 10);
  var streak   = S.streak || 0;
  var winIdx   = _rouletteRoll(today, streak);
  var reward   = ROULETTE_SEGS[winIdx];
  var cycleDay = ((dayCount - 1) % 7) + 1;
  var claimed  = (S.claimedDays || []).includes(dayCount);

  var modal = document.getElementById('m-daily-reward');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-daily-reward';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  var streakMsg = streak >= 100 ? 'Leyenda absoluta. Top 0.1% de usuarios' :
                  streak >= 30  ? 'Racha epica. Top 1%' :
                  streak >= 14  ? 'Dos semanas seguidas. Top 5%' :
                  streak >= 7   ? 'Una semana completa. Top 15%' :
                  streak >= 3   ? streak + ' dias seguidos. Sigue asi.' :
                  streak === 1  ? 'Primer dia. Empieza tu racha.' :
                  'Completa un modulo para iniciar tu racha';

  var calHTML = Array.from({length:7}, function(_,i) {
    var d = i + 1, isDone = d < cycleDay, isCurr = d === cycleDay;
    var isB3 = d === 3, isB7 = d === 7;
    var icon = isDone ? '✓' : isCurr ? reward.icon : (isB7 ? '👑' : isB3 ? '⚡' : '○');
    var cls  = isDone ? 'sc-cal-day sc-day-done'
             : isCurr ? 'sc-cal-day sc-day-active'
             : (isB3||isB7) ? 'sc-cal-day sc-day-bonus' : 'sc-cal-day sc-day-future';
    var sub  = isDone ? '' : isCurr ? 'Hoy' : isB3 ? '+100XP' : isB7 ? '+300+🛡️' : 'D'+d;
    return '<div class="' + cls + '"><div class="sc-cal-icon">' + icon + '</div><div class="sc-cal-sub">' + sub + '</div></div>';
  }).join('');

  var bonusHTML = cycleDay === 3
    ? '<div class="sc-bonus-callout sc-bonus-3">🎯 BONUS HOY — <strong>+100 XP garantizados</strong></div>'
    : cycleDay === 7
    ? '<div class="sc-bonus-callout sc-bonus-7">👑 MEGA BONUS HOY — <strong>+300 XP + 🛡️ Escudo garantizados</strong></div>'
    : '';

  var nextB = cycleDay < 3 ? 3 : cycleDay < 7 ? 7 : null;
  var daysToNext = nextB ? nextB - cycleDay : null;
  var nextHTML = daysToNext
    ? '<div class="sc-next-bonus-hint">Pr\xF3ximo bonus: D\xEDa ' + nextB + ' en ' + daysToNext + ' d\xEDa' + (daysToNext > 1 ? 's' : '') + (nextB === 7 ? ' — 👑 +300XP + Escudo' : ' — ⚡ +100XP') + '</div>'
    : '';

  if (claimed) {
    var nextTs = (S.lastLoginTimestamp || 0) + 86400000;
    var msLeft = Math.max(0, nextTs - Date.now());
    var hh = Math.floor(msLeft / 3600000), mm = Math.floor((msLeft % 3600000) / 60000);
    var cdStr = hh > 0 ? hh + 'h ' + (mm < 10 ? '0' : '') + mm + 'm' : mm + 'm';
    modal.innerHTML = '<div class="sc-modal-backdrop" onclick="closeModal(\'m-daily-reward\')">'
      + '<div class="sc-modal-box" onclick="event.stopPropagation()">'
      + '<button class="sc-modal-close" onclick="closeModal(\'m-daily-reward\')">✕</button>'
      + '<div class="sc-modal-flame">🔥</div>'
      + '<div class="sc-modal-streak-num">' + streak + '</div>'
      + '<div class="sc-modal-streak-label">d\xEDas de racha \xB7 D\xEDa ' + cycleDay + '/7</div>'
      + '<div class="sc-modal-msg">' + streakMsg + '</div>'
      + '<div class="sc-cal-row">' + calHTML + '</div>'
      + '<div class="sc-claimed-state">✅ Ya reclamaste hoy</div>'
      + '<div class="sc-next-reward-cd">Siguiente ruleta en <strong>' + cdStr + '</strong></div>'
      + nextHTML
      + '</div></div>';
  } else {
    modal.innerHTML = '<div class="sc-modal-backdrop" onclick="closeModal(\'m-daily-reward\')">'
      + '<div class="sc-modal-box" onclick="event.stopPropagation()">'
      + '<button class="sc-modal-close" onclick="closeModal(\'m-daily-reward\')">✕</button>'
      + '<div class="sc-modal-flame">🔥</div>'
      + '<div class="sc-modal-streak-num">' + streak + '</div>'
      + '<div class="sc-modal-streak-label">d\xEDas de racha \xB7 D\xEDa ' + cycleDay + '/7</div>'
      + '<div class="sc-modal-msg">' + streakMsg + '</div>'
      + '<div class="sc-cal-row">' + calHTML + '</div>'
      + bonusHTML
      + '<div class="sc-wheel-wrap">'
      +   '<div class="rl-wheel-wrap" style="margin:0 auto">'
      +     '<div class="rl-pointer">▼</div>'
      +     '<div id="rl-wheel-container">' + _buildRouletteSVG() + '</div>'
      +   '</div>'
      +   '<div id="rl-prize-reveal" style="display:none;flex-direction:column;align-items:center;gap:4px;margin-top:8px;">'
      +     '<div class="rl-prize-icon">' + reward.icon + '</div>'
      +     '<div class="rl-prize-label" style="color:' + reward.color + '">' + reward.label + '</div>'
      +   '</div>'
      + '</div>'
      + '<button id="rl-spin-btn" class="sc-spin-btn" onclick="_rouletteSpinAndClaim(' + winIdx + ',' + dayCount + ')">🎰 \xA1Girar la ruleta!</button>'
      + nextHTML
      + '</div></div>';
  }

  openModal('m-daily-reward');
  if (typeof SFX !== 'undefined' && SFX.achievement) SFX.achievement();
}

function renderStreakCard() {
  var el = document.getElementById('streak-card-widget');
  if (!el) return;
  if (!S.userName) { el.innerHTML = ''; return; }

  var streak   = S.streak || 0;
  var dayCount = S.loginDayCount || 1;
  var cycleDay = ((dayCount - 1) % 7) + 1;
  var claimed  = (S.claimedDays || []).includes(dayCount);
  var shields  = S.streakShields || 0;
  var today    = new Date().toISOString().slice(0, 10);
  var reward   = ROULETTE_SEGS[_rouletteRoll(today, streak)];

  var dotsHTML = Array.from({length:7}, function(_,i) {
    var d = i + 1, isDone = d < cycleDay, isCurr = d === cycleDay;
    var isB3 = d === 3, isB7 = d === 7;
    var icon = isDone ? '✓' : isCurr ? (claimed ? '✓' : reward.icon) : (isB7 ? '👑' : isB3 ? '⚡' : '\xB7');
    var cls = isDone || (isCurr && claimed) ? 'sc-dot sc-dot-done'
            : isCurr ? 'sc-dot sc-dot-active'
            : (isB3||isB7) ? 'sc-dot sc-dot-bonus' : 'sc-dot';
    return '<div class="' + cls + '">' + icon + '</div>';
  }).join('');

  var bonusTag = cycleDay === 3 ? ' <span class="sc-card-bonus-tag">⚡ +100XP</span>'
               : cycleDay === 7 ? ' <span class="sc-card-bonus-tag sc-tag-mega">👑 Mega</span>'
               : '';

  var ctaHTML;
  if (claimed) {
    var nextTs = (S.lastLoginTimestamp || 0) + 86400000;
    var msLeft = Math.max(0, nextTs - Date.now());
    var hh = Math.floor(msLeft / 3600000), mm = Math.floor((msLeft % 3600000) / 60000);
    var cdStr = hh > 0 ? hh + 'h ' + (mm < 10 ? '0' : '') + mm + 'm' : (mm > 0 ? mm + 'm' : 'pronto');
    ctaHTML = '<button class="sc-cta-btn sc-cta-done" onclick="showDailyRewardModal(' + dayCount + ')">✅ Reclamado \xB7 vuelve en ' + cdStr + '</button>';
  } else {
    ctaHTML = '<button class="sc-cta-btn sc-cta-available sc-cta-pulse" onclick="showDailyRewardModal(' + dayCount + ')">🎰 Girar ruleta del d\xEDa</button>';
  }

  el.innerHTML = '<div class="sc-card">'
    + '<div class="sc-card-top">'
    +   '<div class="sc-card-streak-wrap">'
    +     '<span class="sc-card-fire">🔥</span>'
    +     '<div>'
    +       '<div class="sc-card-num">' + streak + '</div>'
    +       '<div class="sc-card-sublabel">d\xEDas de racha' + bonusTag + '</div>'
    +     '</div>'
    +   '</div>'
    +   (shields > 0 ? '<div class="sc-card-shields">🛡️ \xD7' + shields + '</div>' : '<div class="sc-card-shields sc-shields-empty">Sin escudos</div>')
    + '</div>'
    + '<div class="sc-dots-wrap">' + dotsHTML + '</div>'
    + ctaHTML
    + '<div class="sc-share-row">'
    +   '<button class="sc-share-btn" onclick="shareStats()">📸 Compartir racha</button>'
    +   '<button class="sc-share-btn" onclick="showReferralSheet()">🎁 Invitar amigos</button>'
    + '</div>'
    + '</div>';
}
window.renderStreakCard = renderStreakCard;

function _rouletteSpinAndClaim(winIdx, dayCount) {
  const btn  = document.getElementById('rl-spin-btn');
  const svg  = document.getElementById('rl-wheel-svg');
  if (!svg || !btn) return;
  if (btn.dataset.spinning === '1') return;
  btn.dataset.spinning = '1';
  btn.disabled = true;
  btn.textContent = '\u23f3 Girando...';

  const deg = _rouletteTargetDeg(winIdx);
  svg.style.transform = 'rotate(' + deg + 'deg)';
  SFX.xp();

  // After animation: reveal prize + claim
  setTimeout(function() {
    const reward  = ROULETTE_SEGS[winIdx];
    const reveal  = document.getElementById('rl-prize-reveal');
    if (reveal) reveal.style.display = 'flex';
    if (btn) { btn.textContent = '\uD83C\uDF81 \u00a1Reclamar ' + reward.label + '!'; btn.disabled = false; }
    btn.onclick = function() { claimDailyReward(winIdx, dayCount); };
    SFX.achievement();
    spawnXP(reward.label);
  }, 3200);
}

function claimDailyReward(winIdx, dayCount) {
  // Support legacy call without args (fallback)
  if (winIdx === undefined || dayCount === undefined) {
    dayCount = S.loginDayCount;
    const today  = new Date().toISOString().slice(0, 10);
    winIdx = _rouletteRoll(today, S.streak || 0);
  }
  const reward = ROULETTE_SEGS[winIdx];

  // Apply reward
  if (reward.type === 'xp') {
    S.xp += reward.amount;
    F34_onXPGained(reward.amount);
    spawnXP('+' + reward.amount + ' XP');
  } else if (reward.type === 'cash') {
    S.cash += reward.amount;
    _ledgerAdd('in', 'reward', 'Ruleta d\xeda ' + dayCount, reward.amount);
    spawnXP('+\u20ac' + reward.amount.toLocaleString('es'));
  } else if (reward.type === 'invest') {
    S.invested += reward.amount;
    recalcPatrimony();
    spawnXP('+\u20ac' + reward.amount.toLocaleString('es') + ' invertido');
  } else if (reward.type === 'shield') {
    S.streakShields = Math.min(3, (S.streakShields || 0) + 1);
    _updateShieldUI();
    spawnXP('\uD83D\uDEE1 Escudo ganado!');
  }

  if (!Array.isArray(S.claimedDays)) S.claimedDays = [];
  S.claimedDays.push(dayCount);

  // Login bonus escalado: bonuses garantizados en d\u00EDas 3 y 7 del ciclo
  const _cycleDay = ((dayCount - 1) % 7) + 1;
  if (_cycleDay === 3) {
    S.xp += 100;
    if (typeof F34_onXPGained === 'function') F34_onXPGained(100);
    spawnXP('+100 XP \uD83C\uDFAF');
    setTimeout(function() {
      toast('\uD83C\uDFAF \u00a1Bonus D\u00EDa 3!', '+100 XP extra por tu constancia. \u00a1Sigue as\u00ED!', 't-success');
    }, 500);
  } else if (_cycleDay === 7) {
    S.xp += 300;
    if (typeof F34_onXPGained === 'function') F34_onXPGained(300);
    S.streakShields = Math.min(3, (S.streakShields || 0) + 1);
    if (typeof _updateShieldUI === 'function') _updateShieldUI();
    spawnXP('+300 XP \uD83D\uDC51');
    setTimeout(function() {
      if (typeof confetti === 'function') confetti();
      toast('\uD83D\uDC51 \u00a1MEGA BONUS D\u00EDa 7!', '+300 XP + \uD83D\uDEE1\uFE0F Escudo de Racha por tu semana completa. \u00a1Eres una m\u00E1quina!', 't-success');
    }, 500);
  }

  saveState();
  checkAchievements();

  const modal = document.getElementById('m-daily-reward');
  if (modal) modal.style.display = 'none';

  const isMega = reward.type === 'shield' || reward.amount >= 1000 || _cycleDay === 7;
  if (isMega) confetti();
  toast('\uD83C\uDF81 \u00a1Premio reclamado!', reward.label, 't-success');
  updateUIFromState();
}


/* ══════════════════════════════════════════════════════════════════
   WELCOME BACK MODAL — Se muestra si han pasado >2h desde la última
   sesión. Informa al usuario de lo que ocurrió mientras estaba fuera:
   días de juego, Δ patrimonio, ingresos cobrados, sparkline.
══════════════════════════════════════════════════════════════════ */

function _showWelcomeBackModal(hoursAway, gameDaysDelta, patrimonyBefore, incomeSummary) {
  var patrimonyNow  = Math.round(S.patrimony || 0);
  var deltaEur      = patrimonyNow - Math.round(patrimonyBefore);
  var deltaPos      = deltaEur >= 0;
  var deltaCol      = deltaPos ? '#00e5a0' : '#ef4444';
  var deltaSign     = deltaPos ? '+' : '';

  // Mini sparkline from patrimonyDaily
  var sparkVals = (S.patrimonyDaily || []).slice(-20).map(function(p) { return p.value; });
  var sparkSVG  = buildSparkline(sparkVals);

  // Time away label
  var timeLabel;
  if (hoursAway < 24) {
    timeLabel = Math.round(hoursAway) + ' horas';
  } else {
    var d = Math.floor(hoursAway / 24);
    timeLabel = d + (d === 1 ? ' día' : ' días');
  }

  // Income rows
  var incomeHTML = '';
  if (incomeSummary.salary > 0) {
    incomeHTML += '<div class="wb-income-row"><span>\uD83D\uDCBC Salario recibido</span><span class="wb-inc-val">+\u20AC' + Math.round(incomeSummary.salary).toLocaleString('es') + '</span></div>';
  }
  if (incomeSummary.dividends > 0) {
    incomeHTML += '<div class="wb-income-row"><span>\uD83D\uDCB8 Dividendos cobrados</span><span class="wb-inc-val">+\u20AC' + Math.round(incomeSummary.dividends).toLocaleString('es') + '</span></div>';
  }
  if (incomeSummary.biz > 0) {
    incomeHTML += '<div class="wb-income-row"><span>\uD83C\uDFEA Negocios</span><span class="wb-inc-val">+\u20AC' + Math.round(incomeSummary.biz).toLocaleString('es') + '</span></div>';
  }

  var gameDaysLabel = gameDaysDelta === 1 ? '1 día de juego' : gameDaysDelta + ' días de juego';

  var modal = document.getElementById('m-welcome-back');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-welcome-back';
    modal.className = 'modal-overlay';
    modal.style.display = 'none';
    document.body.appendChild(modal);
  }

  modal.innerHTML =
    '<div class="modal-box wb-modal" style="position:relative">' +
      '<button onclick="closeModal(\'m-welcome-back\')" style="position:absolute;top:10px;right:12px;background:none;border:none;font-size:18px;cursor:pointer;color:var(--text3);z-index:10;">✕</button>' +
      '<div class="wb-header">' +
        '<div class="wb-emoji">\uD83C\uDF1F</div>' +
        '<div class="wb-title">¡Bienvenido de vuelta!</div>' +
        '<div class="wb-sub">Estuviste fuera <strong>' + timeLabel + '</strong> · <strong>' + gameDaysLabel + '</strong> transcurridos</div>' +
      '</div>' +
      '<div class="wb-patrimony">' +
        '<div class="wb-patr-label">Patrimonio ahora</div>' +
        '<div class="wb-patr-val">\u20AC' + patrimonyNow.toLocaleString('es') + '</div>' +
        '<div class="wb-patr-delta" style="color:' + deltaCol + '">' + deltaSign + '\u20AC' + Math.abs(deltaEur).toLocaleString('es') + ' desde tu última sesión</div>' +
        '<div class="wb-sparkline">' + sparkSVG + '</div>' +
      '</div>' +
      (incomeHTML ? '<div class="wb-income">' + incomeHTML + '</div>' : '') +
      '<button class="btn btn-primary btn-block wb-cta" onclick="document.getElementById(\'m-welcome-back\').style.display=\'none\';">' +
        '\uD83D\uDE80 ¡Seguir jugando!' +
      '</button>' +
    '</div>';

  modal.style.display = 'flex';
  SFX.xp();
}

function checkWelcomeBack() {
  if (!S.userName) return;
  var lastTs    = S.lastSessionTs || 0;
  if (!lastTs) return;                          // primera sesión, no hay datos
  var hoursAway = (Date.now() - lastTs) / 3600000;
  if (hoursAway < 2) return;                   // menos de 2h — no mostrar

  var gameDaysDelta = Math.max(0, (S.gameDay || 0) - (S.lastSessionGameDay || 0));
  var patrimonyBefore = S.lastSessionPatrimony || (S.patrimony || 0);

  // Scan ledger for income since lastSessionTs
  var incomeSummary = { salary: 0, dividends: 0, biz: 0 };
  (S.ledger || []).forEach(function(e) {
    if (e.ts <= lastTs) return;
    if (e.type !== 'in') return;
    if (e.cat === 'salary')   incomeSummary.salary    += e.amount;
    if (e.cat === 'dividend') incomeSummary.dividends += e.amount;
    if (e.cat === 'biz_revenue' || e.cat === 'biz_sell') incomeSummary.biz += e.amount;
  });

  // Si la ruleta diaria también va a aparecer (>24h desde último login), retrasamos el welcome-back
  var lastLoginTs = S.lastLoginTimestamp || 0;
  var hoursSinceLogin = lastLoginTs > 0 ? (Date.now() - lastLoginTs) / 3600000 : 0;
  var rouletteWillShow = hoursSinceLogin >= 24;
  var delay = rouletteWillShow ? 5800 : 800;

  setTimeout(function() {
    _showWelcomeBackModal(hoursAway, gameDaysDelta, patrimonyBefore, incomeSummary);
  }, delay);
}


/* ══════════════════════════════════════════════════════════════════
   CAMINO DE INICIO — Guía para usuarios nuevos (< 14 días activos)
   ─────────────────────────────────────────────────────────────────
   · 5 pasos en cadena, cada uno con CTA directo a la acción
   · Auto-detección del estado real de S (sin "marcar como hecho")
   · Recompensa visible antes de cada acción
   · Al completar los 5: +500 XP + badge Explorador + confetti
   · Desaparece cuando se completan los 5 o daysActive >= 14
══════════════════════════════════════════════════════════════════ */

const FIRST_PATH_STEPS = [
  {
    id:     'first_module',
    icon:   '\uD83D\uDCDA',
    title:  'Completa tu primer módulo',
    desc:   'El interés compuesto es la 8ª maravilla del mundo. 5 minutos que valen miles de euros.',
    reward: '+150 XP',
    rewardCol: '#818cf8',
    cta:    'Empezar módulo',
    action: function() { if (typeof startModule === 'function') startModule(0); else goTo('home'); },
    done:   function() { return (S.completedMods || []).length >= 1; },
  },
  {
    id:     'first_invest',
    icon:   '\uD83D\uDCC8',
    title:  'Haz tu primera inversión',
    desc:   'Compra aunque sea 1 acción o ETF. Ver tu cartera crecer en tiempo real lo cambia todo.',
    reward: '+150 XP al invertir',
    rewardCol: '#00e5a0',
    cta:    'Ir a la bolsa',
    action: function() { goTo('portfolio'); },
    done:   function() {
      return Object.values(S.portfolio || {}).some(function(p) { return p.shares > 0; });
    },
  },
  {
    id:     'first_mission',
    icon:   '\uD83C\uDFAF',
    title:  'Completa una misión',
    desc:   'Las misiones son el motor de tu XP. La primera es fácil y te da la base para las siguientes.',
    reward: '+100 XP',
    rewardCol: '#818cf8',
    cta:    'Ver misiones',
    action: function() {
      var mc = document.getElementById('missions-card');
      if (mc) { mc.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      if (typeof toggleMissionsPanel === 'function') setTimeout(function() {
        var body = document.getElementById('missions-body');
        if (body && body.style.display === 'none') toggleMissionsPanel();
      }, 400);
    },
    done:   function() {
      return Array.isArray(S._mw_missions) && S._mw_missions.some(function(m) { return m.done; });
    },
  },
  {
    id:     'check_health',
    icon:   '\uD83D\uDC9A',
    title:  'Lee tu salud financiera',
    desc:   'El anillo verde del home te dice exactamente en qué mejorar. Tu coach financiero personal.',
    reward: '+75 XP',
    rewardCol: '#818cf8',
    cta:    'Ver mi salud',
    action: function() {
      var el = document.getElementById('health-score-num');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (!S._firstPathHealthSeen) {
        S._firstPathHealthSeen = true;
        S.xp = (S.xp || 0) + 75;
        saveState();
        if (typeof spawnXP === 'function') spawnXP('+75 XP');
        if (typeof renderFirstPath === 'function') setTimeout(renderFirstPath, 600);
      }
    },
    done:   function() { return !!S._firstPathHealthSeen; },
  },
  {
    id:     'streak_3',
    icon:   '\uD83D\uDD25',
    title:  'Mantén la racha 3 días',
    desc:   'Vuelve mañana y pasado. La racha es el hábito. El hábito es la libertad financiera.',
    reward: '+250 XP + badge',
    rewardCol: '#f0b429',
    cta:    'Ver mi racha',
    action: function() {
      var el = document.getElementById('nav-streak');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    done:   function() { return (S.streak || 0) >= 3; },
  },
];

function _getFirstPathProgress() {
  var steps     = FIRST_PATH_STEPS;
  var completed = steps.filter(function(s) { return s.done(); });
  return { steps: steps, completed: completed.length, total: steps.length };
}

function _firstPathAllDone() {
  return FIRST_PATH_STEPS.every(function(s) { return s.done(); });
}

function _shouldShowFirstPath() {
  if (!S.userName) return false;
  if (S._firstPathDismissed) return false;
  if ((S.daysActive || 0) >= 14) return false;
  return true;
}

function _checkFirstPathCompletion() {
  if (!S._firstPathAwardGiven && _firstPathAllDone()) {
    S._firstPathAwardGiven = true;
    S.xp = (S.xp || 0) + 500;
    saveState();
    if (typeof confetti === 'function') confetti();
    if (typeof SFX !== 'undefined') SFX.levelUp();
    if (typeof toast === 'function') toast('\uD83D\uDDFA\uFE0F \u00a1Explorador Financiero!', 'Completaste el Camino de Inicio. +500 XP + badge desbloqueado.', 't-success');
    if (typeof checkAchievements === 'function') checkAchievements();
    // Hide widget after 3s
    setTimeout(function() {
      var w = document.getElementById('first-path-widget');
      if (w) { w.style.opacity = '0'; w.style.transform = 'scale(0.95)'; setTimeout(function() { w.style.display = 'none'; }, 400); }
    }, 3000);
  }
}

function renderFirstPath() {
  var widget = document.getElementById('first-path-widget');
  if (!widget) return;

  if (!_shouldShowFirstPath()) {
    widget.style.display = 'none';
    return;
  }

  var prog    = _getFirstPathProgress();
  var pct     = Math.round((prog.completed / prog.total) * 100);
  var allDone = prog.completed === prog.total;

  // Find current active step (first not done, or last if all done)
  var activeIdx = prog.steps.findIndex(function(s) { return !s.done(); });
  if (activeIdx === -1) activeIdx = prog.steps.length - 1;

  // Progress arc SVG (r=20, circumference ~125.7)
  var r  = 20, circ = 2 * Math.PI * r;
  var dash = ((pct / 100) * circ).toFixed(1);

  var arcSVG =
    '<svg width="52" height="52" viewBox="0 0 52 52">' +
    '<circle cx="26" cy="26" r="' + r + '" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="4"/>' +
    '<circle cx="26" cy="26" r="' + r + '" fill="none" stroke="#00e5a0" stroke-width="4"' +
    ' stroke-dasharray="' + dash + ' ' + circ.toFixed(1) + '"' +
    ' stroke-dashoffset="' + (circ / 4).toFixed(1) + '"' +
    ' stroke-linecap="round" transform="rotate(-90 26 26)"/>' +
    '<text x="26" y="30" text-anchor="middle" font-size="11" font-weight="800"' +
    ' fill="' + (allDone ? '#00e5a0' : '#fff') + '" font-family="Syne,sans-serif">' + pct + '%</text>' +
    '</svg>';

  // Steps list
  var stepsHTML = prog.steps.map(function(step, i) {
    var done    = step.done();
    var active  = i === activeIdx && !allDone;
    var locked  = i > activeIdx && !done;

    var rowCls = 'fp-step' +
      (done   ? ' fp-step-done'   : '') +
      (active ? ' fp-step-active' : '') +
      (locked ? ' fp-step-locked' : '');

    var iconHtml = done
      ? '<div class="fp-step-check">\u2713</div>'
      : '<div class="fp-step-icon ' + (locked ? 'fp-step-icon-locked' : '') + '">' + (locked ? '\uD83D\uDD12' : step.icon) + '</div>';

    var ctaHtml = active
      ? '<button class="fp-step-cta" onclick="window._firstPathAction(' + i + ')">' + step.cta + ' \u2192</button>'
      : '';

    var rewardHtml = !done
      ? '<span class="fp-step-reward" style="color:' + step.rewardCol + '">' + step.reward + '</span>'
      : '<span class="fp-step-reward" style="color:#00e5a0">\u2713 Completado</span>';

    return (
      '<div class="' + rowCls + '">' +
        iconHtml +
        '<div class="fp-step-body">' +
          '<div class="fp-step-title">' + step.title + '</div>' +
          (active ? '<div class="fp-step-desc">' + step.desc + '</div>' : '') +
          '<div class="fp-step-meta">' + rewardHtml + '</div>' +
        '</div>' +
        (active ? '<div class="fp-step-cta-wrap">' + ctaHtml + '</div>' : '') +
      '</div>'
    );
  }).join('');

  widget.style.display = 'block';
  widget.innerHTML =
    '<div class="fp-header">' +
      '<div class="fp-arc">' + arcSVG + '</div>' +
      '<div class="fp-header-text">' +
        '<div class="fp-title">\uD83D\uDDFA\uFE0F Camino de Inicio</div>' +
        '<div class="fp-sub">' + prog.completed + ' de ' + prog.total + ' pasos completados' + (allDone ? ' \u2014 \u00a1Listo! \uD83C\uDF89' : '') + '</div>' +
      '</div>' +
      '<button class="fp-dismiss" onclick="window._firstPathDismiss()" title="Ocultar">\u2715</button>' +
    '</div>' +
    '<div class="fp-steps">' + stepsHTML + '</div>';

  _checkFirstPathCompletion();
}

window._firstPathAction = function(idx) {
  var step = FIRST_PATH_STEPS[idx];
  if (step && typeof step.action === 'function') step.action();
};

window._firstPathDismiss = function() {
  S._firstPathDismissed = true;
  saveState();
  var w = document.getElementById('first-path-widget');
  if (w) { w.style.opacity = '0'; setTimeout(function() { w.style.display = 'none'; }, 300); }
};

/* ══════════════════════════════════════════════════════════════════
   STREAK MILESTONES — recompensas reales por constancia
   día 3: +100 XP | día 7: escudo + €500 | día 14: +500 XP + título
   día 30: +2000 XP + badge | día 100: evento único
══════════════════════════════════════════════════════════════════ */
const STREAK_MILESTONES = [
  { day: 3,   xp: 75,   cash: 0,    shield: 0, label: '🔥 ¡Racha de 3 días!',   msg: 'Empiezas a crear el hábito. +75 XP.' },
  { day: 7,   xp: 150,  cash: 300,  shield: 1, label: '🛡️ ¡Semana completa!',   msg: 'Una semana sin fallo. +150 XP, €300 y un Escudo de Racha.' },
  { day: 14,  xp: 300,  cash: 0,    shield: 1, label: '🏆 ¡Dos semanas!',       msg: '14 días constante. Eres del top 15%. +300 XP y un escudo.' },
  { day: 30,  xp: 500,  cash: 500,  shield: 2, label: '💎 ¡Racha de 30 días!',  msg: 'Un mes sin fallar. Top 5% global. +500 XP, €500 y 2 escudos.' },
  { day: 100, xp: 1500, cash: 2000, shield: 2, label: '👑 ¡100 días seguidos!', msg: 'Leyenda absoluta. +1.500 XP, €2.000 y 2 escudos.' },
  { day: 365, xp: 5000, cash: 8000, shield: 3, label: '🌟 ¡Un año sin fallar!', msg: 'Eres una inspiración. +5.000 XP, €8.000 y 3 escudos. Estatus LEYENDA permanente.' },
];

function _checkStreakMilestones(streak) {
  if (!Array.isArray(S.streakMilestonesGiven)) S.streakMilestonesGiven = [];
  STREAK_MILESTONES.forEach(function(m) {
    if (streak >= m.day && !S.streakMilestonesGiven.includes(m.day)) {
      S.streakMilestonesGiven.push(m.day);
      S.xp              = (S.xp || 0) + m.xp;
      S.cash            = (S.cash || 0) + m.cash;
      S.streakShields   = Math.min(3, (S.streakShields || 0) + m.shield);
      if (m.cash > 0)  _ledgerAdd('in', 'reward', 'Milestone racha ' + m.day + 'd: ' + m.label, m.cash);
      recalcPatrimony();
      saveState();
      setTimeout(function() {
        toast(m.label, m.msg + (m.shield > 0 ? ' 🛡️ Escudo' + (m.shield > 1 ? 's' : '') + ' añadido' + (m.shield > 1 ? 's' : '') + '.' : ''), 't-success');
        if (m.xp >= 500) { if (typeof SFX !== 'undefined') SFX.levelUp(); if (typeof confetti === 'function') confetti(); }
        _updateShieldUI();
      }, 2000);
    }
  });
}

function _updateShieldUI() {
  var shields = S.streakShields || 0;
  var el = document.getElementById('nav-shields');
  if (!el) return;
  el.textContent = shields;
  var wrap = document.getElementById('nav-shield-wrap');
  if (wrap) wrap.style.display = shields > 0 ? 'flex' : 'none';
  // Profile shields row
  var row = document.getElementById('prof-shields-row');
  var iconsEl = document.getElementById('prof-shields-icons');
  if (row && iconsEl) {
    if (shields > 0) {
      row.style.display = 'flex';
      iconsEl.textContent = '🛡️'.repeat(shields) + (shields < 3 ? ('⬜'.repeat(3 - shields)) : '');
    } else {
      row.style.display = 'none';
    }
  }
}

/* ── P4-A: renderStreakBadges — badges de hitos en perfil ── */
function renderStreakBadges() {
  var list = document.getElementById('streak-badges-list');
  if (!list) return;
  var given = S.streakMilestonesGiven || [];
  var cur   = S.streak || 0;
  var max   = Math.max(S.maxStreak || 0, cur);
  var DEFS  = [
    { day:3,   icon:'🔥', label:'3 días',      desc:'Hábito iniciado',         color:'#fb923c' },
    { day:7,   icon:'🛡️', label:'Semana',      desc:'7 días sin fallo',        color:'#60a5fa' },
    { day:14,  icon:'🏆', label:'2 semanas',   desc:'Top 15% de usuarios',     color:'#fbbf24' },
    { day:30,  icon:'💎', label:'30 días',     desc:'Top 5% global',           color:'#c084fc' },
    { day:100, icon:'👑', label:'100 días',    desc:'Leyenda absoluta',        color:'#f87171' },
    { day:365, icon:'🌟', label:'1 año',       desc:'Estatus LEYENDA',         color:'#00e5a0' },
  ];
  list.innerHTML = DEFS.map(function(d) {
    var earned  = given.includes(d.day);
    var isNext  = !earned && max < d.day && DEFS.filter(function(x){ return x.day <= max && !given.includes(x.day); }).length === 0;
    var pct     = earned ? 100 : Math.min(99, Math.round((max / d.day) * 100));
    var cls     = earned ? 'sb-item sb-earned' : (isNext ? 'sb-item sb-next' : 'sb-item sb-locked');
    return '<div class="' + cls + '" style="--sb-color:' + d.color + ';">'
      + '<div class="sb-icon" style="' + (earned ? 'filter:none;' : 'filter:grayscale(1) opacity(.4);') + '">' + d.icon + '</div>'
      + '<div class="sb-info">'
      +   '<div class="sb-name">' + d.label + '</div>'
      +   '<div class="sb-desc">' + d.desc + '</div>'
      +   (earned
            ? '<div class="sb-done">✓ Conseguido</div>'
            : '<div class="sb-pbar"><div class="sb-pfill" style="width:' + pct + '%;background:' + d.color + ';"></div></div>'
              + '<div class="sb-pct">' + pct + '% · máx ' + max + '/' + d.day + 'd</div>')
      + '</div>'
      + '</div>';
  }).join('');
}
window.renderStreakBadges = renderStreakBadges;

function checkDailyLogin() {
  if (!S.userName) return;
  const now = Date.now();
  const last = S.lastLoginTimestamp || 0;
  const hoursSince = (now - last) / 3600000;

  // Already shown in last 24h
  if (last > 0 && hoursSince < 24) {
    _updateShieldUI();
    return;
  }

  S.loginDayCount       = (S.loginDayCount || 0) + 1;
  S.lastLoginTimestamp  = now;
  S.lastLoginDate       = new Date().toISOString().slice(0, 10); // mantener para compatibilidad
  if (!Array.isArray(S.claimedDays)) S.claimedDays = [];

  // Streak milestone check
  _checkStreakMilestones(S.streak || 0);

  // Streak-in-danger toast: if streak >= 3 and lastVisit was yesterday
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if ((S.streak || 0) >= 3 && S.lastVisit === yesterday) {
    setTimeout(function() {
      toast('🔥 Racha activa: ' + S.streak + ' días',
        (S.streakShields > 0
          ? '¡Tienes ' + S.streakShields + ' escudo' + (S.streakShields > 1 ? 's' : '') + '! Completa la acción de hoy para mantener la racha.'
          : 'Completa la acción de hoy para no perder tu racha de ' + S.streak + ' días.'),
        'racha' in S && S.streak >= 14 ? 't-success' : 't-warn');
    }, 2500);
  }

  saveState();
  _updateShieldUI();

  // Show modal after 1.2s (let the app render first)
  setTimeout(() => showDailyRewardModal(S.loginDayCount), 1200);
}


/* ══════════════════════════════════════════════════════════════════
   GAME CLOCK — 1 día de juego = 5 minutos reales
   Cada tick de día:
     · Actualiza gameDay / gameYear
     · Paga dividendos trimestrales (cada 90 días)
     · Genera ingresos de negocios mensuales (cada 30 días)
     · Simula crecimiento del patrimonio
     · Muestra notificación de eventos relevantes
══════════════════════════════════════════════════════════════════ */

const GAME_DAY_MS = 5 * 60 * 1000; // 5 minutos reales = 1 día de juego

function _renderGameClock() {
  const el = document.getElementById('game-clock-pill');
  if (!el) return;
  if (!S.userName || !S.onboardingDone) { el.style.display = 'none'; return; }
  el.style.display = '';
  const speed = S.gameSpeedMult || 3;
  const daysToPayday = 30 - ((S.gameDay || 0) % 30);
  // 1 día de juego = 8 segundos reales con speed=3 (ajustar según tu lógica real)
  const secPerDay = 24 / speed;
  const totalSec = Math.round(daysToPayday * secPerDay);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  el.textContent = `📅 ${daysToPayday}d · ${mins}m${secs > 0 ? ' ' + secs + 's' : ''} al cobro`;
}
window._renderGameClock = _renderGameClock;

function _tickGameDay() {
  if (!S.userName) return; // solo si hay usuario
  S.gameDay  = (S.gameDay  || 0) + 1;
  S.gameYear = Math.floor(S.gameDay / 365) + 1;

  // ── Crecimiento diario del patrimonio ──────────────────────
  const dailyReturn = (S.expectedReturn / 100 / 365) * S.invested;
  S.invested  += dailyReturn;
  recalcPatrimony();

  // ── Hipotecas (cada 30 días de juego) ──────────────────────
  if (S.gameDay % 30 === 0) {
    _tickMortgages();
  }

  // ── Ingresos de negocios (cada 30 días de juego) ──────────
  if (S.gameDay % 30 === 0) {
    let totalBizIncome = 0;
    Object.entries(S.businesses || {}).forEach(([id, owned]) => {
      const biz = BUSINESSES.find(b => b.id === id);
      if (!biz) return;
      const upgCount = (owned.upgrades || []).length;
      // Cada mejora añade el revBonus de esa mejora
      let extraRev = 0;
      (owned.upgrades || []).forEach(uid => {
        const u = (biz.upgrades || []).find(x => x.id === uid);
        if (u) extraRev += u.revBonus;
      });
      const monthRev = (biz.monthlyRevenue + extraRev) - (biz.monthlyExpenses || 0);
      const net = Math.max(0, monthRev);
      S.cash    += net;
      owned.totalRevenue = (owned.totalRevenue || 0) + net;
      totalBizIncome += net;
      S.yearBizIncome = (S.yearBizIncome || 0) + net;
    });
    if (totalBizIncome > 0) {
      recalcPatrimony();
      _ledgerAdd('in', 'biz_revenue', `Ingresos negocios · mes ${Math.floor(S.gameDay/30)}`, totalBizIncome);
      spawnMoney('+€' + Math.round(totalBizIncome).toLocaleString('es') + ' 🏪', '#0091ff');
      toast('🏪 Ingresos de negocios', `+€${Math.round(totalBizIncome).toLocaleString('es')} este mes de juego`, 't-success');
    }
    // ── Salario mensual de carrera ──────────────────────────
    const monthlySalary  = calcMonthlySalary();
    const career         = getCurrentCareer();
    const lifestyleCost  = career.lifestyleExtra || 0;
    const monthlyInc     = S.lifeSalary || S.monthlyIncome || S.income || 1800;
    const livingCost     = Math.round(monthlyInc * 0.5); // 50% de ingresos en gastos de vida
    const totalExpenses  = Math.round(lifestyleCost + livingCost);
    const netSalary      = Math.max(0, monthlySalary - totalExpenses);
    if (monthlySalary > 0) {
      S.cash    = (S.cash || 0) + netSalary;
      // Auto-invest the monthlyContribution portion from salary
      const autoInvest = Math.min(S.monthlyContribution || 0, netSalary);
      if (autoInvest > 0) {
        S.invested  += autoInvest;
        S.cash       = Math.max(0, (S.cash || 0) - autoInvest);
      }
      recalcPatrimony();
      // Notify salary received
      if (netSalary > 0) {
        spawnMoney('+€' + Math.round(netSalary).toLocaleString('es') + ' 💼', '#00e5a0');
        _ledgerAdd('in', 'salary', `Sueldo mensual · ${getCurrentCareer().title}`, netSalary);
        if (S.gameDay % 90 === 0 && NOTIFS._granted) NOTIFS.notifySalary(netSalary);
      }
    }
    // Contribución mensual de ahorro (también si hay ingresos manuales)
    if (S.monthlyContribution > 0 && monthlySalary === 0) {
      S.invested  += S.monthlyContribution;
      recalcPatrimony();
    }
  }

  // ── Dividendos (cada 90 días de juego = trimestral) ───────
  if (S.gameDay % 90 === 0) {
    let totalDiv = 0;
    const divDetails = [];
    Object.entries(S.portfolio || {}).forEach(([ticker, pos]) => {
      if (!pos.shares || pos.shares <= 0) return;
      const stock = STOCKS.find(s => s.ticker === ticker);
      if (!stock || !stock.dividendYield) return;
      // Dividendo trimestral = (yield anual / 4) * valor de la posición
      const price     = GAME.stockPrices[ticker] || stock.price;
      const posValue  = price * pos.shares;
      const quarterly = (stock.dividendYield / 100 / 4) * posValue;
      const netDiv    = quarterly * (1 - 0.19); // retención 19% IRPF (realista)
      if (netDiv < 0.01) return;
      S.cash += netDiv;
      pos.dividendsCollected = (pos.dividendsCollected || 0) + netDiv;
      totalDiv += netDiv;
      S.yearDividends   = (S.yearDividends   || 0) + netDiv;
      S.totalDividends  = (S.totalDividends  || 0) + netDiv;
      divDetails.push(`${ticker}: +€${netDiv.toFixed(2)}`);
    });
    if (totalDiv > 0) {
      spawnMoney('+€' + totalDiv.toFixed(0) + ' 💸', '#f0b429');
      SFX.dividend();
      checkAchievements();
      _ledgerAdd('in', 'dividend', `Dividendos Q · ${divDetails.slice(0,3).join(', ')}`, totalDiv);
      toast(
        '💰 Dividendos cobrados',
        `+€${totalDiv.toFixed(2)} netos (19% IRPF retenido) · ${divDetails.slice(0,3).join(' · ')}`,
        't-success'
      );
    }
  }

  // ── Evento de carrera (cada 60 días de juego) ──────────────
  if (S.gameDay % 60 === 0) {
    setTimeout(_checkCareerEvent, 1500);
  }
  // ── Oferta de trabajo (cada ~20 días) ────────────────────────
  if (S.gameDay % 20 === 0) {
    setTimeout(_checkJobOffer, 3000);
  }

  // ── Evento de vida aleatorio (cada 45-90 días) ───────────────
  _checkRandomLifeEvent();

  // ── Eventos automáticos por edad ──────────────────────────────
  _checkAgeEvents();

  // ── Bots del ranking avanzan cada semana de juego ────────────
  _tickBotRankings();

  // ── Noticias económicas (cada 15-25 días de juego) ─────────
  if (S.gameDay >= (S.nextEconomicNewsDay || 20)) {
    S.nextEconomicNewsDay = S.gameDay + 15 + Math.floor(Math.random() * 11);
    setTimeout(_checkEconomicNews, 2500);
  }
  // Expirar efecto temporal de noticia económica activa
  if (GAME.activeNewsEffect && S.gameDay > GAME.activeNewsEffect.endsDay) {
    GAME.activeNewsEffect = null;
  }

  // ── Crisis de mercado (cada ~180 días, con recuperación gradual) ──
  _checkMarketCrisis();
  if (_activeScenario) {
    _checkScenarioCompletion();
    _updateScenarioBanner(_activeScenario);
  }
  if (_crisisActive && S.gameDay % 3 === 0) {
    _stepCrisisRecovery();
  }

  // ── Acumular dividendos e ingresos de negocios anuales ─────
  // (ya se sumaron al cash arriba — aquí solo trackeamos el total)

  // ── FIN DE AÑO (cada 365 días de juego) ───────────────────
  if (S.gameDay % 365 === 0) {
    const completedYear = S.gameYear - 1; // year that just finished
    if (!S.shownYearSummaries) S.shownYearSummaries = [];
    if (!S.shownYearSummaries.includes(completedYear)) {
      S.shownYearSummaries.push(completedYear);
      // Save snapshot for history
      if (!Array.isArray(S.patrimonyHistory)) S.patrimonyHistory = [];
      S.patrimonyHistory.push({ year: completedYear, value: S.patrimony });
      S.lastYearPatrimony = S.patrimony;
      // Show year-end summary after 2s
      setTimeout(() => _showYearEndSummary(completedYear), 2000);
      // Reset year accumulators
      S.yearStartPatrimony = S.patrimony;
      S.yearStartXP        = S.xp;
      S.yearStartMods      = S.completedMods.length;
      S.yearDividends      = 0;
      S.yearBizIncome      = 0;
    }
  }

  // ── Crisis de mercado (Feature 11) ────────────────────────
  if (typeof _checkMarketCrisis !== 'undefined') _checkMarketCrisis();

  // ── Sistema de calendario rico ──────────────────────────────
  if (typeof CAL !== 'undefined') CAL._onTick(S.gameDay);

  // ── Snapshot diario de patrimonio (rolling 365) ─────────────
  if (!Array.isArray(S.patrimonyDaily)) S.patrimonyDaily = [];
  S.patrimonyDaily.push({ day: S.gameDay, value: Math.round(S.patrimony || 0) });
  if (S.patrimonyDaily.length > 365) S.patrimonyDaily.shift();

  saveState();

  // Actualizar UI si home está visible
  const homeEl = document.getElementById('s-home');
  if (homeEl?.classList.contains('active')) {
    updateUIFromState();
    renderFinancialProfile();
  }

  // Actualizar reloj en pantalla
  _updateGameClockUI();
}

function _updateGameClockUI() {
  if (typeof CAL !== 'undefined') { CAL._updateClock(); return; }
  // fallback antes de que CAL esté disponible
  const el = document.getElementById('game-clock');
  if (!el) return;
  const day  = S.gameDay  || 0;
  const year = S.gameYear || 1;
  const month = Math.floor((day % 365) / 30) + 1;
  const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  el.textContent = `📅 Año ${year} · ${monthNames[Math.min(month-1, 11)]}`;
}

let _gameClockInterval = null;
let _gameSpeedMultiplier = 1; // 1x, 3x, 10x
const GAME_SPEEDS = [
  { mult:3,   label:'3×',   title:'Normal (100 seg/día)' },
  { mult:10,  label:'10×',  title:'Rápido (30 seg/día)' },
  { mult:30,  label:'30×',  title:'Ultra (9 seg/día)' },
  { mult:100, label:'100×', title:'Hyperspeed (3 seg/día) 🚀' },
];

function _startGameClock() {
  if (!S.userName) return;
  _updateGameClockUI();
  _gameSpeedMultiplier = S.gameSpeedMult || 3;
  _applyGameSpeed(_gameSpeedMultiplier);
  _renderSpeedBtn();
}

function _applyGameSpeed(mult) {
  if (_gameClockInterval) clearInterval(_gameClockInterval);
  _gameSpeedMultiplier = mult;
  S.gameSpeedMult = mult;
  const ms = Math.round(GAME_DAY_MS / mult);
  _gameClockInterval = setInterval(_tickGameDay, ms);
}

function cycleGameSpeed() {
  const speeds = GAME_SPEEDS.map(s => s.mult);
  const idx    = speeds.indexOf(_gameSpeedMultiplier);
  const next   = GAME_SPEEDS[(idx + 1) % GAME_SPEEDS.length];
  _applyGameSpeed(next.mult);
  _renderSpeedBtn();
  toast('⏩ Velocidad de juego', next.title, 't-success');
  SFX.xp();
}

function _renderSpeedBtn() {
  const btn = document.getElementById('game-speed-btn');
  if (!btn) return;
  const cur = GAME_SPEEDS.find(s => s.mult === _gameSpeedMultiplier) || GAME_SPEEDS[0];
  const colors = { 3:'var(--text2)', 10:'#f0b429', 30:'#ff9500', 100:'#ff4b5c' };
  const icons  = { 3:'⏩', 10:'⚡', 30:'🔥', 100:'🚀' };
  btn.textContent = (icons[cur.mult] || '⏩') + ' ' + cur.label;
  btn.title = cur.title;
  btn.style.color = colors[cur.mult] || 'var(--text2)';
  btn.style.borderColor = cur.mult >= 30 ? colors[cur.mult] : 'transparent';
}


/* ══════════════════════════════════════════════════════════════════
   SOUND ENGINE — Web Audio API (sin archivos externos)
   Genera sonidos proceduralmente. No requiere assets.
══════════════════════════════════════════════════════════════════ */
// ── Global audio mute state ───────────────────────────────────
let AUDIO_MUTED = false;
function setAudioMuted(v) {
  AUDIO_MUTED = v;
  // Mute/unmute MUSIC masterGain
  if (MUSIC && MUSIC.setVolume) {
    if (v) MUSIC.setVolume(0);
    else   MUSIC.setVolume(window._savedMusicVol || 0.7);
  }
  const btn = document.getElementById('mute-all-btn');
  if (btn) {
    btn.textContent = v ? '🔕' : '🔔';
    btn.title = v ? 'Activar sonido' : 'Silencio total';
    btn.style.color = v ? 'var(--danger)' : 'var(--text3)';
  }
}
function toggleMuteAll() {
  window._savedMusicVol = MUSIC?.getVolume() || 0.7;
  setAudioMuted(!AUDIO_MUTED);
  if (!AUDIO_MUTED) toast('🔔 Sonido activado', '', 't-success');
  else              toast('🔕 Silencio total', 'Todos los sonidos desactivados', 't-social');
}

const SFX = (() => {
  let _ctx = null;
  function ctx() {
    if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
    return _ctx;
  }

  function _tone(freq, type, duration, vol, delay = 0) {
    if (AUDIO_MUTED) return;  // respect global mute
    try {
      const c = ctx();
      const osc  = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime + delay);
      gain.gain.setValueAtTime(0, c.currentTime + delay);
      gain.gain.linearRampToValueAtTime(vol, c.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
      osc.start(c.currentTime + delay);
      osc.stop(c.currentTime + delay + duration + 0.05);
    } catch(e) {}
  }

  return {
    // Logro desbloqueado — fanfarria corta ascendente
    achievement() {
      _tone(523, 'sine', 0.12, 0.12, 0.00);
      _tone(659, 'sine', 0.12, 0.12, 0.10);
      _tone(784, 'sine', 0.12, 0.12, 0.20);
      _tone(1047,'sine', 0.30, 0.16, 0.30);
    },
    // Quiz correcto — ding suave
    correct() {
      _tone(880, 'sine', 0.15, 0.10, 0.00);
      _tone(1108,'sine', 0.20, 0.08, 0.12);
    },
    // Módulo completado — fanfarria completa
    moduleComplete() {
      _tone(523, 'sine', 0.10, 0.10, 0.00);
      _tone(659, 'sine', 0.10, 0.10, 0.08);
      _tone(784, 'sine', 0.10, 0.10, 0.16);
      _tone(1047,'sine', 0.10, 0.12, 0.24);
      _tone(1319,'sine', 0.40, 0.15, 0.32);
    },
    // XP ganado — pop breve
    xp() {
      _tone(660, 'sine', 0.08, 0.06, 0.00);
      _tone(880, 'sine', 0.10, 0.05, 0.06);
    },
    // Dividendo cobrado — moneda
    dividend() {
      _tone(1047,'sine', 0.08, 0.07, 0.00);
      _tone(1319,'sine', 0.15, 0.07, 0.07);
    },
    // Error / quiz incorrecto — buzz suave
    wrong() {
      _tone(220, 'sawtooth', 0.10, 0.06, 0.00);
      _tone(196, 'sawtooth', 0.12, 0.05, 0.08);
    },
    // Nivel subido — jingle épico
    levelUp() {
      [523,659,784,1047,1319,1568].forEach((f,i) => _tone(f,'sine',0.15,0.12,i*0.09));
    },
  };
})();

/* ══════════════════════════════════════════════════════════════════
   ACHIEVEMENT POPUP — Tarjeta flotante dopaminosa con animación CSS
══════════════════════════════════════════════════════════════════ */
function showAchievementPopup(ach) {
  // Inject popup HTML if not present
  if (!document.getElementById('ach-popup')) {
    const div = document.createElement('div');
    div.id = 'ach-popup';
    div.innerHTML = `
      <div id="ach-popup-inner">
        <div id="ach-popup-glow"></div>
        <div id="ach-popup-icon"></div>
        <div id="ach-popup-label">LOGRO DESBLOQUEADO</div>
        <div id="ach-popup-name"></div>
        <div id="ach-popup-desc"></div>
        <div id="ach-popup-reward" class="ach-popup-reward-line"></div>
      </div>`;
    document.body.appendChild(div);
  }
  document.getElementById('ach-popup-icon').textContent = ach.i;
  document.getElementById('ach-popup-name').textContent = ach.n;
  document.getElementById('ach-popup-desc').textContent = ach.desc;

  // Mostrar recompensa
  const rewardEl = document.getElementById('ach-popup-reward');
  if (rewardEl) {
    const parts = [];
    if (ach.reward?.xp)   parts.push('+' + ach.reward.xp   + ' XP');
    if (ach.reward?.cash) parts.push('+€' + ach.reward.cash.toLocaleString('es'));
    if (parts.length) {
      rewardEl.textContent = '🎁 Recompensa: ' + parts.join(' · ');
      rewardEl.style.display = '';
    } else {
      rewardEl.style.display = 'none';
    }
  }

  const popup = document.getElementById('ach-popup');
  popup.classList.remove('ach-popup-out');
  popup.classList.add('ach-popup-in');

  SFX.achievement();
  confetti();

  setTimeout(() => {
    popup.classList.remove('ach-popup-in');
    popup.classList.add('ach-popup-out');
  }, 3800);
}

/* ══════════════════════════════════════════════════════════════════
   CHECK ACHIEVEMENTS — llamar después de cada acción relevante
   Compara el estado actual con cada condición.
   Solo dispara cada logro UNA vez (guardado en S.unlockedAchs).
══════════════════════════════════════════════════════════════════ */
function checkAchievements() {
  if (!S.userName) return;
  if (!S.unlockedAchs) S.unlockedAchs = [];

  let newUnlock = false;
  ACHIEVEMENTS.forEach(ach => {
    if (S.unlockedAchs.includes(ach.id)) return; // ya desbloqueado
    try {
      if (ach.check(S)) {
        S.unlockedAchs.push(ach.id);
        newUnlock = true;
        // ── Aplicar recompensa ──────────────────────────────
        if (ach.reward) {
          if (ach.reward.xp)   { S.xp   = (S.xp   || 0) + ach.reward.xp;   }
          if (ach.reward.cash) {
            S.cash = (S.cash || 0) + ach.reward.cash;
            _ledgerAdd('in', 'achievement', `Logro: ${ach.n}`, ach.reward.cash);
          }
        }
        // ── Popup con delay escalonado ──────────────────────
        const delay = S.unlockedAchs.length * 400;
        setTimeout(() => showAchievementPopup(ach), delay);
      }
    } catch(e) {}
  });

  if (newUnlock) saveState();
}


/* ══════════════════════════════════════════════════════════════════
   DEBT TRACKER — Avalanche vs Snowball
   ─────────────────────────────────────────────────────────────────
   S.debts = [{ id, name, balance, rate, minPayment }]
   Muestra:
   · Lista de deudas con coste mensual de interés
   · Plan Avalanche (mayor TAE primero) — matemáticamente óptimo
   · Plan Snowball (menor saldo primero) — más motivador
   · Tiempo estimado para quedar libre de deudas
   · Total de intereses pagados con cada método
══════════════════════════════════════════════════════════════════ */

function openAddDebtModal() {
  // Clear fields
  ['debt-input-name','debt-input-balance','debt-input-rate','debt-input-payment']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  openModal('m-add-debt');
}

function addDebt() {
  const name    = (document.getElementById('debt-input-name')?.value || '').trim();
  const balance = parseFloat(document.getElementById('debt-input-balance')?.value);
  const rate    = parseFloat(document.getElementById('debt-input-rate')?.value);
  const payment = parseFloat(document.getElementById('debt-input-payment')?.value);

  if (!name)                   { toast('⚠️', 'Escribe un nombre para la deuda', 't-warn'); return; }
  if (!balance || balance <= 0){ toast('⚠️', 'El saldo debe ser mayor que 0', 't-warn'); return; }
  if (rate < 0 || rate > 100)  { toast('⚠️', 'Introduce un TAE válido (0–100%)', 't-warn'); return; }
  if (!payment || payment <= 0){ toast('⚠️', 'El pago mínimo debe ser mayor que 0', 't-warn'); return; }

  if (!Array.isArray(S.debts)) S.debts = [];
  S._hadDebts = true;
  S.debts.push({
    id:         Date.now(),
    name,
    balance,
    rate,
    minPayment: payment,
  });

  saveState();
  closeModal('m-add-debt');
  renderDebtTracker();
  toast('💳 Deuda añadida', name + ' — €' + balance.toLocaleString('es'), 't-success');
  SFX.xp();
  checkAchievements();
}

function removeDebt(id) {
  if (id === undefined || id === null) return;
  // id from HTML comes as number literal — coerce both sides
  S.debts = (S.debts || []).filter(d => String(d.id) !== String(id));
  saveState();
  renderDebtTracker();
  toast('💳 Deuda eliminada', 'Actualizado tu tracker de deudas', 't-success');
}

/* ── Simulación de amortización ──────────────────────────────── */
function _simulatePayoff(debts, method) {
  // Deep copy
  let ds = debts.map(d => ({ ...d, remaining: d.balance }));
  // Sort: avalanche = highest rate first, snowball = lowest balance first
  if (method === 'avalanche') ds.sort((a,b) => b.rate - a.rate);
  else                        ds.sort((a,b) => a.balance - b.balance);

  const totalMinPayment = ds.reduce((s,d) => s + d.minPayment, 0);
  // Extra payment toward priority debt = total budget minus all minimums
  // For simulation, use totalMinPayment as the fixed budget
  let months = 0;
  let totalInterest = 0;
  const maxMonths = 600; // 50 years cap

  while (ds.some(d => d.remaining > 0) && months < maxMonths) {
    months++;
    let extraBudget = totalMinPayment;

    // Apply interest to all debts first
    ds.forEach(d => {
      if (d.remaining <= 0) return;
      const monthlyRate = d.rate / 100 / 12;
      const interest = d.remaining * monthlyRate;
      totalInterest += interest;
      d.remaining += interest;
    });

    // Apply minimum payments to all except priority
    // Then dump all extra cash into priority debt
    const priority = ds.find(d => d.remaining > 0);
    ds.forEach(d => {
      if (d.remaining <= 0) return;
      if (d === priority) return;
      const pay = Math.min(d.remaining, d.minPayment);
      d.remaining -= pay;
      extraBudget -= pay;
    });

    // All remaining budget to priority
    if (priority && extraBudget > 0) {
      priority.remaining = Math.max(0, priority.remaining - extraBudget);
    }
  }

  return { months, totalInterest: Math.round(totalInterest) };
}

function renderDebtTracker() {
  const debts = S.debts || [];

  const listEl    = document.getElementById('debt-list');
  const emptyEl   = document.getElementById('debt-empty');
  const summaryEl = document.getElementById('debt-summary-card');
  const planEl    = document.getElementById('debt-plan-card');
  if (!listEl) return;

  if (debts.length === 0) {
    listEl.innerHTML    = '';
    if (emptyEl)   emptyEl.style.display   = 'block';
    if (summaryEl) summaryEl.style.display = 'none';
    if (planEl)    planEl.style.display    = 'none';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  // ── Summary card ────────────────────────────────────────────
  const totalDebt     = debts.reduce((s,d) => s + d.balance, 0);
  const totalMonthly  = debts.reduce((s,d) => s + d.minPayment, 0);
  const monthlyInterest = debts.reduce((s,d) => s + (d.balance * d.rate / 100 / 12), 0);
  const weightedRate  = (debts.reduce((s,d) => s + d.rate * d.balance, 0) / totalDebt).toFixed(1);

  if (summaryEl) {
    summaryEl.style.display = 'block';
    summaryEl.innerHTML = `
      <div class="debt-sum-grid">
        <div class="debt-sum-item">
          <div class="debt-sum-val danger">€${Math.round(totalDebt).toLocaleString('es')}</div>
          <div class="debt-sum-label">Deuda total</div>
        </div>
        <div class="debt-sum-item">
          <div class="debt-sum-val">€${Math.round(totalMonthly).toLocaleString('es')}/mes</div>
          <div class="debt-sum-label">Pago mínimo</div>
        </div>
        <div class="debt-sum-item">
          <div class="debt-sum-val warn">€${Math.round(monthlyInterest).toLocaleString('es')}/mes</div>
          <div class="debt-sum-label">Solo en intereses</div>
        </div>
        <div class="debt-sum-item">
          <div class="debt-sum-val">${weightedRate}%</div>
          <div class="debt-sum-label">TAE media</div>
        </div>
      </div>`;
  }

  // ── Debt list ────────────────────────────────────────────────
  listEl.innerHTML = debts
    .slice()
    .sort((a,b) => b.rate - a.rate)
    .map(d => {
      const monthInterest = (d.balance * d.rate / 100 / 12).toFixed(2);
      const pct = Math.min(100, Math.round(d.rate / 30 * 100));
      const danger = d.rate >= 15;
      return `
        <div class="debt-card mb8">
          <div class="debt-card-top">
            <div class="debt-card-left">
              <div class="debt-card-name">${d.name}</div>
              <div class="debt-card-rate ${danger ? 'high' : ''}">${d.rate}% TAE${danger ? ' ⚠️' : ''}</div>
            </div>
            <div class="debt-card-right">
              <div class="debt-card-balance">€${Math.round(d.balance).toLocaleString('es')}</div>
              <div class="debt-card-interest">+€${monthInterest}/mes en intereses</div>
            </div>
          </div>
          <div class="debt-rate-bar">
            <div class="debt-rate-fill ${danger ? 'danger' : ''}" style="width:${pct}%"></div>
          </div>
          <div class="debt-card-footer">
            <span style="font-size:11px;color:var(--text2);">Pago mín: €${d.minPayment}/mes</span>
            <button class="btn btn-ghost btn-sm" style="font-size:11px;padding:4px 10px;color:var(--danger);" onclick="removeDebt(${d.id})">Eliminar</button>
          </div>
        </div>`;
    }).join('');

  // ── Payoff plan comparison ───────────────────────────────────
  if (debts.length >= 1 && planEl) {
    const avalanche = _simulatePayoff(debts, 'avalanche');
    const snowball  = _simulatePayoff(debts, 'snowball');

    const fmtMonths = m => m >= 600 ? '+50 años' :
      m >= 24 ? `${Math.floor(m/12)} años ${m%12 ? m%12+'m' : ''}`.trim() :
      `${m} meses`;

    const saved = snowball.totalInterest - avalanche.totalInterest;

    planEl.style.display = 'block';
    planEl.innerHTML = `
      <div class="debt-plan-title">📊 Comparativa de estrategias</div>
      <div class="debt-plan-note">Con los pagos mínimos actuales como presupuesto fijo:</div>
      <div class="debt-plan-grid">
        <div class="debt-plan-col avalanche">
          <div class="dp-badge">⚡ AVALANCHE</div>
          <div class="dp-subtitle">Mayor TAE primero · Óptimo matemáticamente</div>
          <div class="dp-stat"><span class="dp-val">${fmtMonths(avalanche.months)}</span><span class="dp-lab">hasta libertad</span></div>
          <div class="dp-stat"><span class="dp-val warn">€${avalanche.totalInterest.toLocaleString('es')}</span><span class="dp-lab">total en intereses</span></div>
        </div>
        <div class="debt-plan-col snowball">
          <div class="dp-badge">❄️ SNOWBALL</div>
          <div class="dp-subtitle">Menor saldo primero · Más motivador</div>
          <div class="dp-stat"><span class="dp-val">${fmtMonths(snowball.months)}</span><span class="dp-lab">hasta libertad</span></div>
          <div class="dp-stat"><span class="dp-val warn">€${snowball.totalInterest.toLocaleString('es')}</span><span class="dp-lab">total en intereses</span></div>
        </div>
      </div>
      ${saved > 0 ? `<div class="debt-plan-insight">💡 Con Avalanche ahorras <strong style="color:var(--accent)">€${saved.toLocaleString('es')}</strong> en intereses respecto a Snowball.</div>` : ''}
      <div class="debt-plan-insight" style="margin-top:6px;">🎯 Tip: paga siempre el mínimo en todas las deudas. Todo el dinero extra, a la deuda prioritaria.</div>
    `;
  }
}


/* ══════════════════════════════════════════════════════════════════
   COUNTUP — Animación numérica suave para cifras de patrimonio
══════════════════════════════════════════════════════════════════ */
function countUp(elementId, targetVal, duration, prefix, suffix) {
  const el = document.getElementById(elementId);
  if (!el) return;
  prefix = prefix || '';
  suffix = suffix || '';
  const start    = parseFloat(el.dataset.val || 0) || 0;
  const startT   = performance.now();
  const diff     = targetVal - start;
  if (Math.abs(diff) < 1) { el.textContent = prefix + Math.round(targetVal).toLocaleString('es') + suffix; return; }
  function frame(now) {
    const elapsed = now - startT;
    const prog    = Math.min(elapsed / duration, 1);
    const ease    = 1 - Math.pow(1 - prog, 3); // ease-out cubic
    const cur     = start + diff * ease;
    el.textContent = prefix + Math.round(cur).toLocaleString('es') + suffix;
    el.dataset.val = cur;
    if (prog < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ══════════════════════════════════════════════════════════════════
   LIVE PRICE TICKER — Scrolling stock prices in home screen
══════════════════════════════════════════════════════════════════ */
const TICKER_STOCKS = ['MSCI','SP500','AAPL','MSFT','NVDA','AMZN','TSLA','BTC','ETH','GOLD'];

function _renderPriceTicker() {
  const wrap = document.getElementById('price-ticker');
  if (!wrap) return;

  const items = TICKER_STOCKS.map(ticker => {
    const stock = STOCKS.find(s => s.ticker === ticker);
    if (!stock) return '';
    const cur  = GAME.stockPrices[ticker] || stock.price;
    const prev = (GAME.priceHistory[ticker] || [])[58] || stock.price;
    const chg  = ((cur - prev) / prev * 100);
    const up   = chg >= 0;
    const col  = up ? 'var(--accent)' : 'var(--danger)';
    const arr  = up ? '▲' : '▼';
    return `<span class="pt-item">
      <span class="pt-name">${ticker}</span>
      <span class="pt-price" style="color:${col};">${fmtPrice(cur)}</span>
      <span class="pt-chg" style="color:${col};">${arr}${Math.abs(chg).toFixed(2)}%</span>
    </span>`;
  }).filter(Boolean).join('<span class="pt-sep">·</span>');

  // Duplicate for seamless loop
  wrap.innerHTML = items + '<span class="pt-sep" style="padding:0 24px;"></span>' + items;
}

function _initPriceTicker() {
  _renderPriceTicker();
  // Re-render every 4s in sync with price updates
  setInterval(() => {
    _renderPriceTicker();
  }, 4000);
}

/* ══════════════════════════════════════════════════════════════════
   HAPTIC — Vibración nativa en móvil para momentos clave
══════════════════════════════════════════════════════════════════ */
const HAPTIC = {
  light()   { navigator.vibrate?.(30); },
  medium()  { navigator.vibrate?.(60); },
  heavy()   { navigator.vibrate?.(120); },
  success() { navigator.vibrate?.([30, 50, 80]); },   // triple pulse
  error()   { navigator.vibrate?.([80, 30, 80]); },    // double heavy
  levelUp() { navigator.vibrate?.([50, 30, 50, 30, 150]); }, // celebration
};

/* ══════════════════════════════════════════════════════════════════
   LOCAL NOTIFICATIONS — Push sin servidor (Notification API)
   ─────────────────────────────────────────────────────────────────
   · Pide permiso una sola vez tras completar el primer módulo
   · Programa recordatorios locales con setTimeout
   · Sin backend, sin suscripciones push — funciona en PWA
══════════════════════════════════════════════════════════════════ */

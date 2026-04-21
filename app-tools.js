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
setInterval(() => { if (typeof _renderGameClock === 'function') _renderGameClock(); }, 1000);
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
      _initAppWithState(hasState);
    }).catch(() => {
      const hasState = loadState();
      _initAppWithState(hasState);
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
    renderHomeScreen();
    setTimeout(_hideSplash, 400);
  } else {
    showScreen('s-onboard');
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
  // F47: Dilema semanal (lunes)
  if (typeof F47_checkShow === 'function') setTimeout(F47_checkShow, 2000);
  // F48: Snapshot semanal update
  if (typeof F48_updateSnapshot === 'function') F48_updateSnapshot();
  // P4-C: Misiones semanales
  initWeeklyMissions();

  // App iniciada
  _initAmbient();
}


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
  const today   = new Date().toISOString().slice(0, 10);
  const streak  = S.streak || 0;
  const winIdx  = _rouletteRoll(today, streak);
  const reward  = ROULETTE_SEGS[winIdx];
  const cycleDay = ((dayCount - 1) % 7) + 1;

  // Build 7-day dots
  const dots = Array.from({length:7}, (_,i) => {
    const filled = i < cycleDay;
    const active = i === cycleDay - 1;
    return '<div class="dr-dot ' + (filled ? 'filled' : '') + ' ' + (active ? 'active' : '') + '">' +
           (filled ? (i < cycleDay - 1 ? '\u2713' : reward.icon) : i + 1) + '</div>';
  }).join('');

  // Streak tier badge
  const tierLabel = streak >= 7 ? '\uD83D\uDD25 Racha \xd7' + streak + ' \u2014 premios \u00e9picos' :
                    streak >= 3 ? '\u26a1 Racha \xd7' + streak + ' \u2014 premios mejorados' :
                    'Racha \xd7' + streak + ' \u2014 consigue 3+ d\xedas para mejores premios';

  let modal = document.getElementById('m-daily-reward');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-daily-reward';
    modal.className = 'modal-overlay';
    modal.style.display = 'none';
    document.body.appendChild(modal);
  }

  modal.innerHTML =
    '<div class="modal-box dr-modal rl-modal" style="position:relative">' +
      '<button onclick="document.getElementById(\'m-daily-reward\').style.display=\'none\'" style="position:absolute;top:10px;right:12px;background:none;border:none;font-size:18px;cursor:pointer;color:var(--text3);z-index:10;">✕</button>' +
      '<div class="dr-glow"></div>' +
      '<div class="dr-eyebrow">\uD83C\uDF81 RULETA DIARIA \u00b7 D\xcdA ' + cycleDay + ' DE 7</div>' +
      '<div class="rl-streak-badge">' + tierLabel + '</div>' +

      // Wheel container + pointer
      '<div class="rl-wheel-wrap">' +
        '<div class="rl-pointer">\u25bc</div>' +
        '<div id="rl-wheel-container">' + _buildRouletteSVG() + '</div>' +
      '</div>' +

      // Prize reveal (hidden until spin ends)
      '<div id="rl-prize-reveal" style="display:none">' +
        '<div class="rl-prize-icon">' + reward.icon + '</div>' +
        '<div class="rl-prize-label" style="color:' + reward.color + '">' + reward.label + '</div>' +
      '</div>' +

      '<div class="dr-dots" style="margin-top:14px">' + dots + '</div>' +

      '<button id="rl-spin-btn" class="btn btn-primary btn-block dr-claim-btn" onclick="_rouletteSpinAndClaim(' + winIdx + ',' + dayCount + ')">' +
        '\uD83C\uDFB0 \u00a1Girar la ruleta!' +
      '</button>' +
      '<div style="font-size:11px;color:var(--text3);margin-top:8px;text-align:center">' +
        'D\xeda ' + dayCount + ' de tu camino' +
      '</div>' +
    '</div>';

  modal.style.display = 'flex';
  SFX.achievement();
}

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
  saveState();
  checkAchievements();

  const modal = document.getElementById('m-daily-reward');
  if (modal) modal.style.display = 'none';

  const isMega = reward.type === 'shield' || reward.amount >= 1000;
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
    '<div class="modal-box wb-modal">' +
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
    if (e.cat === 'biz_revenue' || e.cat === 'biz_buy') incomeSummary.biz += e.amount;
  });

  setTimeout(function() {
    _showWelcomeBackModal(hoursAway, gameDaysDelta, patrimonyBefore, incomeSummary);
  }, 800);
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
    reward: '+€200 en cartera',
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
const NOTIFS = {
  _granted: false,

  async requestPermission() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') { this._granted = true; return true; }
    if (Notification.permission === 'denied')  return false;
    const result = await Notification.requestPermission();
    this._granted = result === 'granted';
    return this._granted;
  },

  _show(title, body, icon, tag) {
    if (!this._granted || Notification.permission !== 'granted') return;
    try {
      const n = new Notification(title, {
        body, icon: icon || '🎯',
        tag: tag || 'finlearn',
        badge: './icons/icon-96.png',
        silent: false,
      });
      n.onclick = () => { window.focus(); n.close(); };
    } catch(e) {}
  },

  // Schedule a one-shot notification N ms from now
  schedule(ms, title, body, tag) {
    if (!this._granted) return;
    setTimeout(() => this._show(title, body, '📈', tag), ms);
  },

  // Call after completing first module — ask permission + schedule daily reminder
  async onFirstModule() {
    const ok = await this.requestPermission();
    if (!ok) return;
    // Schedule: come back tomorrow
    const H23 = 23 * 60 * 60 * 1000;
    this.schedule(H23,
      '🔥 Tu racha te espera',
      'Lleva ' + (S.streak || 1) + ' días seguidos. No lo rompas hoy.',
      'streak-reminder'
    );
  },

  // Streak at risk — fire if user hasn't opened in 20h
  scheduleStreakReminder() {
    if (!this._granted) return;
    const H20 = 20 * 60 * 60 * 1000;
    this.schedule(H20,
      '⚡ ¡Racha en peligro!',
      'Tu racha de ' + (S.streak || 1) + ' días termina a medianoche. 1 minuto es suficiente.',
      'streak-risk'
    );
  },

  // Salary received notification
  notifySalary(amount) {
    this._show(
      '💼 Sueldo recibido',
      '+€' + Math.round(amount).toLocaleString('es') + ' ingresados este mes de juego',
      '💼', 'salary'
    );
  },
};

// Auto-init: restore permission state
if ('Notification' in window && Notification.permission === 'granted') {
  NOTIFS._granted = true;
}

/* ══════════════════════════════════════════════════════════════════
   SHARE CARD — Genera imagen PNG con Canvas para compartir
   ─────────────────────────────────────────────────────────────────
   Crea una tarjeta 1080×1080 (Instagram) con:
   · Fondo oscuro + gradiente de color
   · Patrimonio destacado
   · Nivel + racha
   · Branding FinLearn
   · Usa navigator.share si está disponible (móvil nativo)
══════════════════════════════════════════════════════════════════ */
function generateShareCard() {
  const canvas = document.createElement('canvas');
  canvas.width  = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  // ── Background ───────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 1080, 1080);
  bg.addColorStop(0,   '#060810');
  bg.addColorStop(0.5, '#0d1420');
  bg.addColorStop(1,   '#060810');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1080);

  // ── Accent orb ───────────────────────────────────────────
  const orb = ctx.createRadialGradient(200, 200, 0, 200, 200, 600);
  orb.addColorStop(0, 'rgba(0,229,160,0.18)');
  orb.addColorStop(1, 'transparent');
  ctx.fillStyle = orb;
  ctx.fillRect(0, 0, 1080, 1080);

  const orb2 = ctx.createRadialGradient(900, 900, 0, 900, 900, 500);
  orb2.addColorStop(0, 'rgba(110,86,255,0.14)');
  orb2.addColorStop(1, 'transparent');
  ctx.fillStyle = orb2;
  ctx.fillRect(0, 0, 1080, 1080);

  // ── Logo ─────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '600 36px system-ui, sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('FINLEARN', 80, 80);

  // ── Main label ───────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '500 48px system-ui';
  ctx.fillText('Mi patrimonio actual', 80, 320);

  // ── Patrimony big number ──────────────────────────────────
  const patr = Math.round(S.patrimony || 0);
  const patrStr = '€' + patr.toLocaleString('es');
  ctx.fillStyle = '#00e5a0';
  ctx.font      = 'bold 144px system-ui';
  // Shrink if too long
  const metrics = ctx.measureText(patrStr);
  if (metrics.width > 900) ctx.font = 'bold 96px system-ui';
  ctx.fillText(patrStr, 80, 480);

  // ── Divider line ─────────────────────────────────────────
  ctx.strokeStyle = 'rgba(0,229,160,0.3)';
  ctx.lineWidth   = 2;
  ctx.beginPath(); ctx.moveTo(80, 540); ctx.lineTo(1000, 540); ctx.stroke();

  // ── Stats row ────────────────────────────────────────────
  const stats = [
    { label: 'Nivel', value: 'Lv.' + (S.level || 1) },
    { label: 'Racha', value: (S.streak || 0) + '🔥 días' },
    { label: 'Módulos', value: (S.completedMods || []).length + '/30' },
    { label: 'XP Total', value: (S.xp || 0).toLocaleString('es') + ' XP' },
  ];
  stats.forEach((st, i) => {
    const x = 80 + i * 240;
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font      = '500 32px system-ui';
    ctx.fillText(st.label, x, 630);
    ctx.fillStyle = '#fff';
    ctx.font      = 'bold 52px system-ui';
    ctx.fillText(st.value, x, 700);
  });

  // ── Projection ───────────────────────────────────────────
  const proj10 = Math.round(calcCompound(S.patrimony||0, S.monthlyContribution||200, S.expectedReturn||7, 10));
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font      = '500 38px system-ui';
  ctx.fillText('En 10 años a este ritmo:', 80, 820);
  ctx.fillStyle = '#f0b429';
  ctx.font      = 'bold 80px system-ui';
  ctx.fillText('€' + proj10.toLocaleString('es'), 80, 910);

  // ── Footer tag ───────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font      = '500 30px system-ui';
  ctx.fillText('finlearn.app · Aprende. Invierte. Libérate.', 80, 1020);

  return canvas;
}

async function shareProgress() {
  HAPTIC.medium();
  const canvas = generateShareCard();

  // Try native share (mobile)
  if (navigator.share && navigator.canShare) {
    try {
      canvas.toBlob(async blob => {
        const file = new File([blob], 'finlearn-progreso.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Mi progreso en FinLearn',
            text: '¡Llevo €' + Math.round(S.patrimony||0).toLocaleString('es') + ' de patrimonio y nivel ' + (S.level||1) + '!',
            files: [file],
          });
          return;
        }
        _downloadShareCard(canvas);
      }, 'image/png');
      return;
    } catch(e) {}
  }

  // Fallback: download image
  _downloadShareCard(canvas);
}

function _downloadShareCard(canvas) {
  const a = document.createElement('a');
  a.download = 'finlearn-progreso.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  toast('📸 Imagen guardada', 'Comparte tu progreso en Instagram o WhatsApp', 't-success');
}

/* ══════════════════════════════════════════════════════════════════
   CAREER EVENT ENGINE
══════════════════════════════════════════════════════════════════ */

function _checkCareerEvent() {
  if (!S.userName) return;
  if (!Array.isArray(S.seenCareerEvents)) S.seenCareerEvents = [];

  // Find an event that: hasn't been seen AND whose trigger passes
  const available = CAREER_EVENTS.filter(e =>
    !S.seenCareerEvents.includes(e.id) && e.trigger(S)
  );
  if (available.length === 0) return;

  // Pick the first available (they're ordered by progression)
  const event = available[0];
  _showCareerEventModal(event);
}

function _showCareerEventModal(event) {
  let modal = document.getElementById('m-career-event');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-career-event';
    modal.className = 'modal-overlay';
    modal.style.display = 'none';
    document.body.appendChild(modal);
  }

  const choicesHTML = event.choices.map((c, i) => `
    <button class="career-choice-btn choice-${c.type}" onclick="pickCareerChoice('${event.id}', ${i})">
      <div class="ccb-label">${c.label}</div>
      <div class="ccb-desc">${c.desc}</div>
    </button>`).join('');

  modal.innerHTML = `
    <div class="modal-box career-event-modal">
      <div class="cev-icon">${event.icon}</div>
      <div class="cev-title">${event.title}</div>
      <div class="cev-desc">${event.desc}</div>
      <div class="cev-choices">${choicesHTML}</div>
      <div class="cev-lesson">${event.lesson}</div>
    </div>`;

  modal.style.display = 'flex';
  SFX.xp();
}

function pickCareerChoice(eventId, choiceIdx) {
  const event  = CAREER_EVENTS.find(e => e.id === eventId);
  if (!event) return;
  const choice = event.choices[choiceIdx];
  if (!choice) return;

  // Apply effect
  try { choice.effect(S); } catch(e) {}

  // Mark as seen
  if (!Array.isArray(S.seenCareerEvents)) S.seenCareerEvents = [];
  S.seenCareerEvents.push(eventId);
  saveState();

  // Close modal
  const modal = document.getElementById('m-career-event');
  if (modal) modal.style.display = 'none';

  // Show result toast
  const type = choice.type === 'positive' ? 't-success' :
               choice.type === 'negative' ? 't-danger'  : 't-social';
  toast(event.icon + ' ' + event.title, choice.result, type);

  if (choice.type === 'positive') { SFX.correct(); HAPTIC.success(); confetti(); }
  else if (choice.type === 'negative') SFX.wrong();

  // Update salary display if on life screen
  renderCareerCard();
  updateUIFromState();
  checkAchievements();
}


/* ══════════════════════════════════════════════════════════════════
   YEAR-END SUMMARY — Resumen épico al final de cada año de juego
   Aparece automáticamente cuando gameDay alcanza múltiplo de 365.
══════════════════════════════════════════════════════════════════ */
function _showYearEndSummary(year) {
  // ── Calcular estadísticas del año ────────────────────────
  const patrimonyEnd   = S.patrimony || 0;
  const patrimonyStart = S.yearStartPatrimony || 0;
  const patrimonyGain  = patrimonyEnd - patrimonyStart;
  const patrimonyPct   = patrimonyStart > 0
    ? ((patrimonyGain / patrimonyStart) * 100).toFixed(1)
    : null;

  const xpGained   = (S.xp || 0) - (S.yearStartXP || 0);
  const modsGained = (S.completedMods || []).length - (S.yearStartMods || 0);
  const divYear    = S.yearDividends  || 0;
  const bizYear    = S.yearBizIncome  || 0;
  const salary     = calcMonthlySalary();
  const totalIncome= salary * 12 + bizYear;

  // ── Highlight stat (best thing that happened) ───────────
  let highlight = '';
  if (divYear > 500)
    highlight = `💸 Cobraste <strong>€${Math.round(divYear).toLocaleString('es')}</strong> en dividendos este año`;
  else if (bizYear > 2000)
    highlight = `🏪 Tus negocios generaron <strong>€${Math.round(bizYear).toLocaleString('es')}</strong>`;
  else if (modsGained >= 5)
    highlight = `🎓 Completaste <strong>${modsGained} módulos</strong> — nivel de conocimiento élite`;
  else if (patrimonyGain > 1000)
    highlight = `📈 Tu patrimonio creció <strong>€${Math.round(patrimonyGain).toLocaleString('es')}</strong>`;
  else
    highlight = `⚡ Ganaste <strong>${xpGained.toLocaleString('es')} XP</strong> este año`;

  // ── Personal message based on performance ───────────────
  let msg = '';
  if (patrimonyPct && parseFloat(patrimonyPct) >= 10)
    msg = '🔥 Año excepcional. Sigues por encima de la inflación y del mercado.';
  else if (modsGained >= 3)
    msg = '📚 Gran año de aprendizaje. El conocimiento que has ganado nunca se devalúa.';
  else if (S.streak >= 30)
    msg = '💎 La constancia es tu superpoder. 30+ días de racha lo dice todo.';
  else
    msg = '🌱 Cada año es un ladrillo más. El interés compuesto necesita tiempo.';

  // ── Inject modal ─────────────────────────────────────────
  let modal = document.getElementById('m-year-end');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-year-end';
    modal.className = 'modal-overlay';
    modal.style.display = 'none';
    document.body.appendChild(modal);
  }

  const pctBadge = patrimonyPct !== null
    ? `<div class="ye-pct ${parseFloat(patrimonyPct) >= 0 ? 'pos' : 'neg'}">${parseFloat(patrimonyPct) >= 0 ? '+' : ''}${patrimonyPct}%</div>`
    : '';

  modal.innerHTML = `
    <div class="modal-box year-end-modal">
      <div class="ye-fireworks">🎆</div>
      <div class="ye-eyebrow">RESUMEN DEL AÑO ${year}</div>
      <div class="ye-title">¡Otro año más libre!</div>
      <div class="ye-patrimony">
        <div class="ye-patrimony-label">Patrimonio total</div>
        <div class="ye-patrimony-val">€${Math.round(patrimonyEnd).toLocaleString('es')}</div>
        ${pctBadge}
      </div>
      <div class="ye-stats">
        <div class="ye-stat">
          <div class="ye-stat-icon">⚡</div>
          <div class="ye-stat-val">${xpGained.toLocaleString('es')}</div>
          <div class="ye-stat-lab">XP ganados</div>
        </div>
        <div class="ye-stat">
          <div class="ye-stat-icon">📚</div>
          <div class="ye-stat-val">${modsGained}</div>
          <div class="ye-stat-lab">Módulos</div>
        </div>
        <div class="ye-stat">
          <div class="ye-stat-icon">💸</div>
          <div class="ye-stat-val">€${Math.round(divYear).toLocaleString('es')}</div>
          <div class="ye-stat-lab">Dividendos</div>
        </div>
        <div class="ye-stat">
          <div class="ye-stat-icon">🏪</div>
          <div class="ye-stat-val">€${Math.round(bizYear).toLocaleString('es')}</div>
          <div class="ye-stat-lab">Negocios</div>
        </div>
      </div>
      <div class="ye-highlight">${highlight}</div>
      <div class="ye-msg">${msg}</div>
      <div class="ye-next">
        <div class="ye-next-label">Objetivo año ${year + 1}</div>
        <div class="ye-next-val">€${Math.round(patrimonyEnd * 1.10).toLocaleString('es')}</div>
        <div class="ye-next-sub">+10% con tu ritmo actual</div>
      </div>
      <button class="btn btn-primary btn-block" style="margin-top:20px;" onclick="closeYearEnd()">
        🚀 A por el año ${year + 1}
      </button>
    </div>`;

  modal.style.display = 'flex';
  SFX.levelUp();
  HAPTIC.levelUp();
  confetti();
  setTimeout(confetti, 600);
  setTimeout(confetti, 1200);
  checkAchievements();
}

function closeYearEnd() {
  const modal = document.getElementById('m-year-end');
  if (modal) {
    modal.classList.add('modal-out');
    setTimeout(() => { modal.style.display = 'none'; modal.classList.remove('modal-out'); }, 300);
  }
}

/* ══════════════════════════════════════════════════════════════════
   MUSIC ENGINE — Lo-Fi Beat Procedural (Web Audio API)
   ─────────────────────────────────────────────────────────────────
   Sin archivos externos. Genera un beat lo-fi chill proceduralmente:
   · Kick drum (oscilador sub pitchbend)
   · Hi-hat (ruido blanco filtrado)
   · Bass line (escala pentatónica menor)
   · Chord pads (osciladores suavizados)
   · BPM: 80 — tempo ideal para concentración/dopamina suave
   · Se activa solo tras interacción del usuario (política autoplay)
══════════════════════════════════════════════════════════════════ */
const MUSIC = (() => {
  let _ctx = null;
  let _playing = false;
  let _masterGain = null;
  let _scheduledNodes = [];
  let _nextBeat = 0;
  let _beatTimer = null;
  const BPM = 80;
  const BEAT_S = 60 / BPM;
  const STEP_S = BEAT_S / 2; // 8th notes

  // Pentatonic minor scale in C: C2 Eb2 F2 G2 Bb2 C3
  const BASS_NOTES = [65.41, 77.78, 87.31, 98.00, 116.54, 130.81];
  const CHORD_NOTES = [[130.81,155.56,174.61],[98.00,116.54,146.83],[87.31,104.17,130.81]];

  // Bass pattern (16 steps, 0=rest, 1-6=note index)
  const BASS_PAT = [1,0,0,3, 0,0,2,0, 1,0,0,4, 0,3,0,0];
  // Kick pattern
  const KICK_PAT = [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,1,0];
  // Hat pattern
  const HAT_PAT  = [0,1,0,1, 0,1,0,1, 0,1,0,1, 0,1,0,1];

  let _step = 0;
  let _chordIdx = 0;
  let _chordTimer = 0;

  function ctx() {
    if (!_ctx) {
      _ctx = new (window.AudioContext || window.webkitAudioContext)();
      _masterGain = _ctx.createGain();
      _masterGain.gain.setValueAtTime((_volume || 0.7) * 0.25, _ctx.currentTime) // quiet ambient
      _masterGain.connect(_ctx.destination);
    }
    return _ctx;
  }

  function _kick(t) {
    const c = ctx();
    const g = c.createGain();
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    g.connect(_masterGain);
    const o = c.createOscillator();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    o.connect(g);
    o.start(t); o.stop(t + 0.35);
  }

  function _hat(t, open) {
    const c = ctx();
    const dur = open ? 0.12 : 0.04;
    const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = 'highpass';
    filt.frequency.value = 8000;
    const g = c.createGain();
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filt); filt.connect(g); g.connect(_masterGain);
    src.start(t); src.stop(t + dur);
  }

  function _bass(t, freq) {
    const c = ctx();
    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = freq;
    const filt = c.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(400, t);
    filt.frequency.exponentialRampToValueAtTime(200, t + STEP_S * 0.8);
    const g = c.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + STEP_S * 0.85);
    o.connect(filt); filt.connect(g); g.connect(_masterGain);
    o.start(t); o.stop(t + STEP_S);
  }

  function _chord(t, notes) {
    const c = ctx();
    notes.forEach(freq => {
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq * 2; // up one octave for pads
      const g = c.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.3);
      g.gain.exponentialRampToValueAtTime(0.001, t + BEAT_S * 3.8);
      o.connect(g); g.connect(_masterGain);
      o.start(t); o.stop(t + BEAT_S * 4);
    });
  }

  function _schedule() {
    if (!_playing) return;
    const c = ctx();
    const ahead = 0.1;
    while (_nextBeat < c.currentTime + ahead) {
      const t = _nextBeat;
      const s = _step % 16;

      if (KICK_PAT[s]) _kick(t);
      if (HAT_PAT[s])  _hat(t, false);
      if (BASS_PAT[s]) _bass(t, BASS_NOTES[BASS_PAT[s] - 1]);

      // Chord every 4 beats (every 8 steps)
      if (s === 0) {
        _chord(t, CHORD_NOTES[_chordIdx % CHORD_NOTES.length]);
        _chordIdx++;
      }

      _step++;
      _nextBeat += STEP_S;
    }
    _beatTimer = setTimeout(_schedule, 20);
  }

  function start() {
    if (_playing) return;
    _playing = true;
    const c = ctx();
    if (c.state === 'suspended') c.resume();
    _nextBeat = c.currentTime + 0.05;
    _schedule();
    _renderMusicBtn();
  }

  function stop() {
    _playing = false;
    if (_beatTimer) clearTimeout(_beatTimer);
    _renderMusicBtn();
  }

  function isPlaying() {
    return _playing;
  }

  function toggle() {
    _playing ? stop() : start();
  }

  function setVolume(v) {
    // v: 0.0 → 1.0
    const vol = Math.max(0, Math.min(1, v));
    if (_masterGain) {
      _masterGain.gain.cancelScheduledValues(_ctx.currentTime);
      _masterGain.gain.linearRampToValueAtTime(vol * 0.35, _ctx.currentTime + 0.1);
    }
    _volume = vol;
  }

  let _volume = 0.7; // default volume

  function _renderMusicBtn() {
    const btn = document.getElementById('music-control');
    if (!btn) return;
    const vol = Math.round((_volume || 0.7) * 100);
    btn.innerHTML = `
      <div class="music-widget">
        <button class="music-toggle-btn ${_playing ? 'music-on' : ''}"
          onclick="MUSIC.toggle()"
          title="${_playing ? 'Pausar' : 'Activar'} música">
          ${_playing ? '🎵' : '🔇'}
        </button>
        <div class="music-vol-wrap">
          <input type="range" class="music-vol-slider" min="0" max="100" value="${vol}"
            style="--val:${vol}%"
            oninput="const v=this.value/100; MUSIC.setVolume(v); window._savedMusicVol=v; document.getElementById('music-vol-pct').textContent=this.value+'%'; this.style.setProperty('--val',this.value+'%');"
            title="Volumen">
          <span class="music-vol-pct" id="music-vol-pct">${vol}%</span>
        </div>
      </div>`;
  }

  // Auto-start on first user interaction
  function _autoStart() {
    // iOS/Android: AudioContext must be created AND resumed inside a user gesture.
    // We call ctx() to create it, then explicitly resume() before starting the music.
    const c = ctx();
    if (c.state === 'suspended') {
      c.resume().then(() => {
        if (!_playing) start();
      }).catch(() => {});
    } else if (!_playing) {
      start();
    }
  }

  // Unlock AudioContext on ANY touch/click (needed for iOS which suspends after creation)
  function _unlockAudio() {
    const c = ctx();
    if (c.state === 'suspended') c.resume().catch(() => {});
  }

  return { start, stop, toggle, setVolume, isPlaying, getVolume: () => _volume, init() {
    // Use passive touch handlers for performance on mobile
    document.addEventListener('click',      _autoStart,    { once: true, passive: true });
    document.addEventListener('touchstart', _autoStart,    { once: true, passive: true });
    document.addEventListener('touchend',   _unlockAudio,  { once: true, passive: true });
    setTimeout(_renderMusicBtn, 500);
  }};
})();


/* ══════════════════════════════════════════════════════════════════
   SPLASH SCREEN — Pantalla de carga animada
   Muestra progreso mientras el JS inicializa. Se oculta en 1.8s.
══════════════════════════════════════════════════════════════════ */
function _showSplash() {
  const splash = document.getElementById('app-splash');
  if (!splash) return;
  splash.style.display = 'flex';

  const hints = [
    'Cargando tu universo financiero…',
    'Inicializando mercados en vivo…',
    'Preparando tus módulos…',
    'Calculando proyecciones…',
    '¡Listo para invertir!',
  ];
  const bar  = document.getElementById('splash-bar');
  const hint = document.getElementById('splash-hint');
  let prog = 0;
  let hIdx = 0;

  const iv = setInterval(() => {
    prog += Math.random() * 22 + 8;
    if (prog > 100) prog = 100;
    if (bar)  bar.style.width = prog + '%';
    if (hint) hint.textContent = hints[Math.min(hIdx++, hints.length - 1)];
    if (prog >= 100) clearInterval(iv);
  }, 260);

  // GARANTÍA: ocultar siempre a los 2.5s aunque falle cualquier otra cosa
  setTimeout(_hideSplash, 2500);
}

function _hideSplash() {
  const splash = document.getElementById('app-splash');
  if (!splash) return;
  splash.classList.add('splash-out');
  setTimeout(() => { splash.style.display = 'none'; }, 600);
}


/* ══════════════════════════════════════════════════════════════════
   INTERACTIVE TUTORIAL — Guía de primer uso paso a paso
   ─────────────────────────────────────────────────────────────────
   · 6 pasos con highlight del elemento real en pantalla
   · Solo aparece la primera vez (S.hasSeenTutorial)
   · Saltable en cualquier momento
   · Haptic + sound en cada paso
══════════════════════════════════════════════════════════════════ */
const TUTORIAL_STEPS = [
  {
    icon: '🎓',
    title: '¡Bienvenido a FinLearn!',
    desc: 'Aprende finanzas reales completando módulos cortos. Cada módulo te da XP y conocimiento que puedes aplicar hoy mismo. Empieza por "Interés Compuesto" — son 5 minutos que valen miles de euros.',
  },
  {
    icon: '📈',
    title: 'Tu simulador financiero',
    desc: 'Invierte en bolsa, gestiona negocios y simula decisiones de vida — todo con dinero virtual. El simulador arranca con tu situación real para que las proyecciones tengan sentido.',
  },
  {
    icon: '🏆',
    title: 'Gana XP y sube de nivel',
    desc: 'Cada módulo completado, inversión realizada y misión cumplida te da XP. Sube de nivel, desbloquea carreras y derrota bosses al completar ramas enteras.',
  },
];

let _tutStep = 0;

function startTutorial() {
  if (S.hasSeenTutorial || localStorage.getItem('fl_tutorial_done')) return;
  localStorage.setItem('fl_tutorial_done', '1');
  _tutStep = 0;
  S.hasSeenTutorial = true;
  saveState();
  document.getElementById('tutorial-overlay').style.display = 'block';
  _renderTutStep();
}

function _renderTutStep() {
  const step = TUTORIAL_STEPS[_tutStep];
  if (!step) { endTutorial(); return; }

  setEl('tut-icon',  step.icon);
  setEl('tut-title', step.title);
  setEl('tut-desc',  step.desc);

  const nextBtn = document.getElementById('tut-next-btn');
  if (nextBtn) nextBtn.textContent = _tutStep === TUTORIAL_STEPS.length - 1 ? '¡Empezar! 🚀' : 'Siguiente →';

  // Dots
  const dots = document.getElementById('tut-dots');
  if (dots) {
    dots.innerHTML = TUTORIAL_STEPS.map((_, i) =>
      `<div class="tut-dot ${i === _tutStep ? 'active' : ''}"></div>`
    ).join('');
  }

  const hl   = document.getElementById('tut-highlight');
  const arr  = document.getElementById('tut-arrow');
  const card = document.getElementById('tut-card');
  if (hl)   hl.style.display  = 'none';
  if (arr)  arr.style.display = 'none';
  if (card) {
    card.style.position  = 'fixed';
    card.style.top       = '50%';
    card.style.left      = '50%';
    card.style.right     = 'auto';
    card.style.bottom    = 'auto';
    card.style.margin    = '0';
    card.style.transform = 'translate(-50%, -50%)';
  }

  SFX.xp();
  HAPTIC.light();
}

function tutorialNext() {
  _tutStep++;
  if (_tutStep >= TUTORIAL_STEPS.length) { endTutorial(); return; }
  _renderTutStep();
}

function skipTutorial() {
  endTutorial();
}

function endTutorial() {
  document.getElementById('tutorial-overlay').style.display = 'none';
  S.hasSeenTutorial = true;
  localStorage.setItem('fl_tutorial_done', '1');
  saveState();
  // Encourage first action
  setTimeout(() => toast('🎯 Primer objetivo', 'Completa 3 módulos y haz tu primera inversión', 't-success'), 500);
}


/* ══════════════════════════════════════════════════════════════════
   MARKET CRISIS ENGINE — Eventos aleatorios que afectan el mercado
   ─────────────────────────────────────────────────────────────────
   · Se dispara cada ~180 días de juego (±60 días de aleatoriedad)
   · 3 tipos: CRASH (-20% a -45%), BURBUJA (+30% a +60%), TIPOS (efecto mixto)
   · Afecta TODOS los precios de GAME.stockPrices en tiempo real
   · Modal educativo con contexto histórico y decisión del jugador
   · Recuperación gradual durante los siguientes 30-90 días
══════════════════════════════════════════════════════════════════ */
const CRISIS_EVENTS = [
  {
    id: 'crash_tech',
    type: 'crash',
    icon: '🔴',
    name: 'Crash Tecnológico',
    severity: 0.72, // multiplier applied to all prices
    desc: 'Las valoraciones del sector tech eran insostenibles. El mercado corrige con fuerza. Los inversores con liquidez tienen la oportunidad de su vida.',
    affectedSectors: ['tech', 'crypto'],
    crashMult: { tech: 0.62, crypto: 0.45, default: 0.82 },
    recoveryDays: 60,
    lesson: '💡 Los crashes son normales. El S&P 500 ha tenido correcciones del 20%+ 26 veces en 100 años — y se ha recuperado el 100% de las veces.',
    choices: [
      { label: '😨 Vendo todo para preservar capital', effect: s => { s.cash = (s.cash||0) + Object.entries(s.portfolio||{}).reduce((a,[t,p]) => a + (GAME.stockPrices[t]||0)*p.shares*0.85, 0); s.portfolio = {}; }, result: 'Vendiste con -15% de pérdida. Realizaste las pérdidas permanentemente. El mercado tardó 8 meses en recuperar.', type: 'negative' },
      { label: '💎 Mantengo y no miro los precios', effect: s => { s.xp += 200; }, result: '+200 XP. Decisión correcta. Los inversores que mantuvieron en 2008 recuperaron todo en 3 años y triplicaron en 10.', type: 'positive' },
      { label: '🚀 Compro más — es una oportunidad', effect: s => { const extra = Math.min(s.cash||0, 2000); s.cash = (s.cash||0) - extra; s.balance = (s.balance||0) + extra; s.xp += 400; }, result: '¡Compraste en mínimos! +400 XP. Este es el movimiento de los grandes inversores.', type: 'positive' },
    ],
  },
  {
    id: 'bubble_meme',
    type: 'bubble',
    icon: '🟢',
    name: 'Burbuja Especulativa',
    desc: 'La euforia del mercado empuja los precios muy por encima de su valor real. Todo sube. La tentación de comprar es máxima — pero la historia advierte.',
    affectedSectors: ['all'],
    crashMult: { default: 1.45 },
    recoveryDays: 45,
    lesson: '⚠️ "Cuando el taxista te da consejos de bolsa, es hora de vender." — Warren Buffett. La euforia es el peor momento para comprar.',
    choices: [
      { label: '🤑 Compro todo, el mercado solo sube', effect: s => { s.xp -= 50; }, result: '-50 XP. Comprar en máximos de euforia es el error más caro del inversor retail. La burbuja explota en 60 días.', type: 'negative' },
      { label: '⚖️ Rebalanceo — vendo lo que sobrepesa', effect: s => { s.xp += 250; s.cash = (s.cash||0) + 800; }, result: '+250 XP, +€800 realizados. El rebalanceo automático te hizo vender caro. Trabajo bien hecho.', type: 'positive' },
      { label: '📊 Mantengo mi plan sin cambios', effect: s => { s.xp += 150; }, result: '+150 XP. Ignorar el ruido del mercado y mantener el plan es difícil y correcto.', type: 'positive' },
    ],
  },
  {
    id: 'rates_hike',
    type: 'tipos',
    icon: '🏛️',
    name: 'Subida Brusca de Tipos',
    desc: 'El Banco Central sube tipos de interés al 4,5% para combatir la inflación. Bonos y renta fija suben. Las acciones, especialmente growth, caen.',
    affectedSectors: ['bonds', 'tech'],
    crashMult: { bonds: 1.12, tech: 0.78, default: 0.88 },
    recoveryDays: 90,
    lesson: '💡 Tipos altos = bonos más atractivos = dinero sale de bolsa. Los valores "value" (bancos, energía) resisten mejor que "growth" (tech) en este entorno.',
    choices: [
      { label: '🏦 Diversifico con renta fija / bonos', effect: s => { s.xp += 300; s.cash = (s.cash||0) + 600; }, result: '+300 XP, +€600. Los bonos rinden más ahora. Diversificación inteligente.', type: 'positive' },
      { label: '📉 Reduzco exposición a acciones tech', effect: s => { s.xp += 150; }, result: '+150 XP. Ajustar el portfolio al entorno macroeconómico es gestión activa real.', type: 'positive' },
      { label: '🙈 Ignoro la macro, sigo igual', effect: s => { s.xp += 50; }, result: '+50 XP. No es el peor movimiento — pero entender los ciclos mejora tus decisiones.', type: 'neutral' },
    ],
  },
  {
    id: 'recession',
    type: 'crash',
    icon: '📉',
    name: 'Recesión Económica',
    desc: '2 trimestres consecutivos de contracción del PIB. El desempleo sube. Los mercados anticipan menores beneficios empresariales y caen con fuerza.',
    affectedSectors: ['all'],
    crashMult: { default: 0.70 },
    recoveryDays: 120,
    lesson: '💡 Las recesiones duran una media de 11 meses. Las expansiones duran 4,5 años. Los inversores pacientes que no venden en recesión capturan toda la recuperación.',
    choices: [
      { label: '💵 Acumulo liquidez para el rebote', effect: s => { s.xp += 200; s.cash = (s.cash||0) + 500; }, result: '+200 XP. Mantener liquidez en recesión para comprar en mínimos es estrategia de élite.', type: 'positive' },
      { label: '🛡️ Me refugio en oro y defensivos', effect: s => { s.xp += 180; }, result: '+180 XP. Activos defensivos (utilities, consumo básico, oro) protegen en recesión.', type: 'positive' },
      { label: '😱 Vendo y espero a que se calme', effect: s => { s.xp -= 100; s.cash = (s.cash||0) + Object.entries(s.portfolio||{}).reduce((a,[t,p]) => a + (GAME.stockPrices[t]||0)*p.shares*0.75,0)*0.4; }, result: '-100 XP. Vender en pánico y esperar "que se calme" es la receta para perderse el rebote.', type: 'negative' },
    ],
  },
];

let _crisisActive = false;
let _crisisRecoveryStep = 0;
let _crisisRecoveryTotal = 0;
let _crisisRecoveryMult = {};

function _checkMarketCrisis() {
  if (_crisisActive) return;
  if (!S.userName) return;
  if (!Array.isArray(S.seenCrisisEvents)) S.seenCrisisEvents = [];

  // Trigger every 180 game days ±60 randomness
  const nextCrisis = S.nextCrisisDay || 180;
  if (S.gameDay < nextCrisis) return;

  // Pick unseen event, or reset if all seen
  let available = CRISIS_EVENTS.filter(e => !S.seenCrisisEvents.includes(e.id));
  if (available.length === 0) { S.seenCrisisEvents = []; available = CRISIS_EVENTS; }
  const event = available[Math.floor(Math.random() * available.length)];

  // Schedule next crisis
  S.nextCrisisDay = S.gameDay + 150 + Math.floor(Math.random() * 60);
  S.seenCrisisEvents.push(event.id);

  setTimeout(() => _triggerCrisis(event), 800);
}

function _triggerCrisis(event) {
  _crisisActive = true;

  // Apply price shock immediately
  const mult = event.crashMult || {};
  STOCKS.forEach(s => {
    const m = mult[s.sector] ?? mult.default ?? 1;
    GAME.stockPrices[s.ticker] = +(GAME.stockPrices[s.ticker] * m).toFixed(2);
    // Add crash candle to history
    GAME.priceHistory[s.ticker].push(GAME.stockPrices[s.ticker]);
    if (GAME.priceHistory[s.ticker].length > 60) GAME.priceHistory[s.ticker].shift();
  });

  // Set up recovery
  _crisisRecoveryTotal = event.recoveryDays || 60;
  _crisisRecoveryStep  = 0;
  // Recovery target: return to 95% of pre-crash for crash, 85% of bubble peak for bubble
  _crisisRecoveryMult  = event.type === 'crash' ? { default: 1.012 } :
                         event.type === 'bubble' ? { default: 0.992 } :
                         { default: 1.005 };

  // Show crisis modal
  _showCrisisModal(event);

  // Screen shake
  document.body.classList.add('market-shake');
  setTimeout(() => document.body.classList.remove('market-shake'), 600);

  // Sound + haptic
  SFX.wrong();
  if (event.type !== 'bubble') { HAPTIC.heavy(); } else { HAPTIC.success(); }

  // Update ticker
  _renderPriceTicker();
}

let _crisisCountdownTimer = null;
let _crisisSec = 60;

function _showCrisisModal(event) {
  _crisisSec = 60;
  if (_crisisCountdownTimer) { clearInterval(_crisisCountdownTimer); _crisisCountdownTimer = null; }

  let modal = document.getElementById('m-crisis');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-crisis';
    modal.className = 'modal-overlay';
    modal.style.display = 'none';
    document.body.appendChild(modal);
  }

  const isCrash  = event.type === 'crash' || event.type === 'tipos' || event.type === 'recession';
  const headerCol = isCrash ? '#ff4b5c' : '#00e5a0';

  function buildInner(secs) {
    const urgentCls = secs <= 15 ? ' mc-urgent' : secs <= 30 ? ' mc-warn' : '';
    const dashOffset = Math.round(220 - (secs / 60) * 220);
    const choicesHTML = event.choices.map((c, i) =>
      '<button class="mc-decision-btn choice-' + c.type + '" onclick="pickCrisisChoice(\'' + event.id + '\',' + i + ')">' +
        '<div class="mc-dec-label">' + c.label + '</div>' +
      '</button>'
    ).join('');
    return '<div class="modal-box mc-modal' + urgentCls + '">' +
      '<div class="mc-alert-bar" style="background:' + headerCol + '20;color:' + headerCol + '">\uD83D\uDEA8 EVENTO DE MERCADO</div>' +
      '<div class="crisis-icon" style="color:' + headerCol + ';font-size:40px;margin:8px 0">' + event.icon + '</div>' +
      '<div class="crisis-title">' + event.name + '</div>' +
      '<div class="crisis-desc">' + event.desc + '</div>' +
      '<div class="mc-countdown-wrap">' +
        '<svg viewBox="0 0 80 80" width="72" height="72" style="transform:rotate(-90deg)">' +
          '<circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="5"/>' +
          '<circle cx="40" cy="40" r="35" fill="none" stroke="' + headerCol + '" stroke-width="5"' +
          ' stroke-dasharray="220" stroke-dashoffset="' + dashOffset + '"' +
          ' style="transition:stroke-dashoffset .95s linear" id="mc-ring"/>' +
        '</svg>' +
        '<div class="mc-countdown-center">' +
          '<div class="mc-countdown-val" id="mc-secs">' + secs + '</div>' +
          '<div class="mc-countdown-label">seg</div>' +
        '</div>' +
      '</div>' +
      '<div class="mc-decisions">' + choicesHTML + '</div>' +
    '</div>';
  }

  modal.innerHTML = buildInner(_crisisSec);
  modal.style.display = 'flex';

  _crisisCountdownTimer = setInterval(function() {
    _crisisSec--;
    const secsEl = document.getElementById('mc-secs');
    const ringEl = document.getElementById('mc-ring');
    if (secsEl) secsEl.textContent = _crisisSec;
    if (ringEl) ringEl.style.strokeDashoffset = Math.round(220 - (_crisisSec / 60) * 220);
    const box = modal.querySelector('.modal-box');
    if (box) {
      box.classList.remove('mc-urgent', 'mc-warn');
      if (_crisisSec <= 15) box.classList.add('mc-urgent');
      else if (_crisisSec <= 30) box.classList.add('mc-warn');
    }
    if (_crisisSec <= 0) {
      clearInterval(_crisisCountdownTimer);
      _crisisCountdownTimer = null;
      pickCrisisChoice(event.id, 1); // auto: mantener
    }
  }, 1000);
}

function pickCrisisChoice(eventId, idx) {
  if (_crisisCountdownTimer) { clearInterval(_crisisCountdownTimer); _crisisCountdownTimer = null; }
  const event  = CRISIS_EVENTS.find(e => e.id === eventId);
  if (!event) return;
  const choice = event.choices[idx];
  if (!choice) return;

  const patrimonyBefore = S.patrimony || 0;
  try { choice.effect(S); } catch(e) {}
  recalcPatrimony();
  saveState();

  // Show summary modal
  const modal = document.getElementById('m-crisis');
  if (modal) {
    const delta = (S.patrimony || 0) - patrimonyBefore;
    const deltaCol = delta >= 0 ? '#00e5a0' : '#ef4444';
    const deltaSign = delta >= 0 ? '+' : '';
    const typeClass = choice.type === 'positive' ? 't-success' : choice.type === 'negative' ? 't-danger' : '';

    // Alternatives summary
    const altsHTML = event.choices.map((c, i) =>
      '<div class="mc-alt-row' + (i === idx ? ' mc-alt-chosen' : '') + '">' +
        '<span class="mc-alt-icon">' + c.label.slice(0,2) + '</span>' +
        '<div><div class="mc-alt-result">' + c.result + '</div></div>' +
      '</div>'
    ).join('');

    modal.innerHTML =
      '<div class="modal-box mc-modal mc-summary">' +
        '<div class="mc-sum-header">' +
          '<div class="mc-sum-icon">' + choice.label.slice(0,2) + '</div>' +
          '<div class="mc-sum-title">Elegiste: ' + choice.label.slice(2).trim() + '</div>' +
        '</div>' +
        '<div class="mc-patrimony-delta">' +
          '<div class="mc-pd-label">Impacto en patrimonio</div>' +
          '<div class="mc-pd-val" style="color:' + deltaCol + '">' + deltaSign + '\u20ac' + Math.abs(delta).toLocaleString('es') + '</div>' +
        '</div>' +
        '<div class="mc-sum-result ' + typeClass + '">' + choice.result + '</div>' +
        '<div class="card mc-alternatives" style="margin-top:12px">' +
          '<div class="mc-alts-title">\uD83D\uDCD6 Las 3 opciones comparadas</div>' +
          altsHTML +
        '</div>' +
        '<div class="mc-lesson-box">' +
          '<div class="mc-lesson-text">' + event.lesson + '</div>' +
        '</div>' +
        '<button class="btn btn-primary btn-block" style="margin-top:16px"' +
        ' onclick="document.getElementById(\'m-crisis\').style.display=\'none\';checkAchievements();updateUIFromState();">' +
          '\uD83D\uDE80 Continuar' +
        '</button>' +
      '</div>';
  }

  if (choice.type === 'positive') { SFX.correct(); HAPTIC.success(); }
  else { SFX.wrong(); }
}

function _stepCrisisRecovery() {
  if (!_crisisActive) return;
  _crisisRecoveryStep++;
  const mult = _crisisRecoveryMult.default || 1.01;
  STOCKS.forEach(s => {
    GAME.stockPrices[s.ticker] = +(GAME.stockPrices[s.ticker] * (0.998 + Math.random() * 0.008 + (mult - 1))).toFixed(2);
  });
  if (_crisisRecoveryStep >= _crisisRecoveryTotal) {
    _crisisActive = false;
  }
}


/* ══════════════════════════════════════════════════════════════════
   RANDOM LIFE EVENTS — Eventos cotidianos que obligan a usar el
   fondo de emergencia y añaden realismo al simulador
   ─────────────────────────────────────────────────────────────────
   · Se disparan cada 45-90 días de juego de forma aleatoria
   · Mezcla de golpes negativos (realismo) y positivos (dopamina)
   · Conectan directamente con los módulos educativos
══════════════════════════════════════════════════════════════════ */
const RANDOM_LIFE_EVENTS = [
  // GOLPES — requieren fondo de emergencia
  { id:'boiler',    icon:'🔧', type:'bad',
    title:'Se ha roto la caldera',
    desc:'Justo en enero. El fontanero dice que es urgente. No hay opción.',
    cost: 650, lesson:'¿Tenías fondo de emergencia? Para esto existe.',
    trigger: s => s.gameDay > 30 },
  { id:'car_repair', icon:'🚗', type:'bad',
    title:'Avería del coche',
    desc:'El motor de arranque ha muerto. Sin coche no puedes trabajar.',
    cost: 480, lesson:'Los coches son el activo que más dinero destruye silenciosamente.',
    trigger: s => s.gameDay > 45 },
  { id:'medical',   icon:'🏥', type:'bad',
    title:'Gasto médico inesperado',
    desc:'Una revisión rutinaria revela algo que hay que tratar pronto. La sanidad privada pasa factura.',
    cost: 900, lesson:'La salud tiene un coste real. El seguro médico privado vale ~€80/mes.',
    trigger: s => s.gameDay > 60 },
  { id:'fine',      icon:'📋', type:'bad',
    title:'Multa de tráfico',
    desc:'Un radar en la autovía. 100 km/h en zona de 90. Sin puntos, pero con factura.',
    cost: 200, lesson:'Los imprevistos pequeños son los más frecuentes. El fondo de emergencia también cubre estos.',
    trigger: s => true },
  { id:'rent_hike', icon:'🏠', type:'bad',
    title:'Subida del alquiler',
    desc:'Tu casero actualiza el contrato al IPC. +8% este año. La inflación afecta a todo.',
    cost: 120 * 12, lesson:'La inflación del alquiler es el mayor destructor de ahorro para quien no tiene vivienda propia.',
    trigger: s => s.gameDay > 90 },
  { id:'laptop',    icon:'💻', type:'bad',
    title:'El portátil se ha muerto',
    desc:'Pantalla negra. Datos sin backup. El técnico dice que no tiene solución.',
    cost: 750, lesson:'La depreciación tecnológica es real. El seguro del hogar a veces cubre esto.',
    trigger: s => true },

  // GOLPES MEDIOS — decisiones
  { id:'friend_debt', icon:'🤝', type:'choice',
    title:'Un amigo te pide dinero',
    desc:'Tu mejor amigo pasa por un mal momento y te pide 1.000€. "Te lo devuelvo en 3 meses."',
    lesson:'El 70% de los préstamos a amigos no se devuelven. Solo presta lo que puedas permitirte perder.',
    choices: [
      { label:'💸 Le presto los 1.000€', effect: s => { s.cash = Math.max(0, (s.cash||0) - 1000); }, result:'−€1.000. Ahora esperas. La amistad y el dinero rara vez se llevan bien.', type:'negative' },
      { label:'🎁 Le doy 200€ como regalo', effect: s => { s.cash = Math.max(0, (s.cash||0) - 200); s.xp += 50; }, result:'−€200. Ayudas sin comprometer tus finanzas. +50 XP por inteligencia emocional.', type:'neutral' },
      { label:'❌ No puedo, mis finanzas no están para eso', effect: s => { s.xp += 80; }, result:'+80 XP por mantener límites financieros. Diferenciar entre ser generoso y ser imprudente es madurez.', type:'positive' },
    ],
    trigger: s => (s.cash||0) > 1000 },

  // GOLPES POSITIVOS — dopamina
  { id:'inheritance', icon:'🎁', type:'good',
    title:'Herencia inesperada',
    desc:'Un tío lejano del que apenas sabías ha fallecido y te ha dejado algo. El notario ha llamado.',
    gain: 2800, lesson:'Las herencias inesperadas son uno de los principales eventos que cambian trayectorias financieras. Invierte, no gastes.',
    trigger: s => s.gameDay > 30 },
  { id:'bonus',     icon:'🏆', type:'good',
    title:'Bonus de empresa',
    desc:'Resultados record este trimestre. El bonus llega por sorpresa a la cuenta.',
    gain: 1200, lesson:'Un bonus extra invertido inmediatamente tiene el mayor impacto. Antes de gastarlo: invierte el 70%.',
    trigger: s => (s.career||'junior') !== 'entrepreneur' },
  { id:'cashback',  icon:'💳', type:'good',
    title:'Cashback acumulado',
    desc:'Tu tarjeta de crédito sin comisión lleva meses acumulando el 1%. Hoy te ingresan el total.',
    gain: 180, lesson:'Las tarjetas sin comisión con cashback son dinero gratis si pagas el saldo completo cada mes.',
    trigger: s => true },
  { id:'tax_return', icon:'📊', type:'good',
    title:'Devolución de la Renta',
    desc:'Hacienda te devuelve más de lo esperado. Las deducciones del plan de pensiones han funcionado.',
    gain: 650, lesson:'Optimizar la declaración de la renta puede suponer cientos de euros. Vale la pena entender las deducciones.',
    trigger: s => s.gameDay > 120 },
  { id:'freelance', icon:'💼', type:'good',
    title:'Ingreso freelance inesperado',
    desc:'Un contacto de LinkedIn te pide un proyecto puntual. Dos semanas de trabajo, buen precio.',
    gain: 900, lesson:'Un segundo flujo de ingresos, aunque sea esporádico, acelera exponencialmente la acumulación de patrimonio.',
    trigger: s => s.completedMods.length >= 5 },
];

/* Age events function */
function _checkAgeEvents() {
  if (!S.userName) return;
  const age = S.lifeAge || 25;

  // Jubilacion a los 67
  if (age >= 67 && !S.retirementEventFired) {
    S.retirementEventFired = true;
    saveState();
    setTimeout(function() {
      var bonus = 5000;
      S.cash = (S.cash || 0) + bonus;
      recalcPatrimony();
      _ledgerAdd('in', 'life_event', '🎉 Jubilación · Edad ' + age + ' — pensión inicial', bonus);
      saveState();
      toast('🎉 ¡Jubilación!', 'Has alcanzado los ' + age + ' años. Recibes €' + bonus.toLocaleString('es') + ' como pensión inicial. Hora de vivir de tus inversiones.', 't-success');
    }, 1500);
  }

  // Revision de cartera a los 45
  if (age >= 45 && !S.portfolioReviewSuggested) {
    S.portfolioReviewSuggested = true;
    saveState();
    setTimeout(function() {
      toast('📊 Revisión de cartera recomendada', 'Con ' + age + ' años es buen momento para revisar tu estrategia: reduce riesgo, diversifica y ajusta tu horizonte temporal.', 't-info');
    }, 3000);
  }
}

let _nextLifeEventDay = 45 + Math.floor(Math.random() * 30);

function _checkRandomLifeEvent() {
  if (!S.userName) return;
  if (S.gameDay < (_nextLifeEventDay || 45)) return;

  // Schedule next event
  _nextLifeEventDay = S.gameDay + 40 + Math.floor(Math.random() * 50);

  // Pick eligible event not seen recently
  if (!Array.isArray(S.recentLifeEvents)) S.recentLifeEvents = [];
  const eligible = RANDOM_LIFE_EVENTS.filter(e =>
    !S.recentLifeEvents.includes(e.id) && e.trigger(S)
  );
  if (!eligible.length) { S.recentLifeEvents = []; return; }

  const ev = eligible[Math.floor(Math.random() * eligible.length)];
  S.recentLifeEvents.push(ev.id);
  if (S.recentLifeEvents.length > 6) S.recentLifeEvents.shift();

  setTimeout(() => _showLifeEventModal(ev), 1200);
}

function _showLifeEventModal(ev) {
  let modal = document.getElementById('m-life-random');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-life-random';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const isBad  = ev.type === 'bad';
  const isGood = ev.type === 'good';
  const col    = isBad ? 'var(--danger)' : isGood ? 'var(--accent)' : '#f0b429';

  let bodyHTML = '';

  if (ev.type === 'bad') {
    const hasFund = (S.cash || 0) >= ev.cost;
    bodyHTML = `
      <div class="le-amount" style="color:${col};">−€${ev.cost.toLocaleString('es')}</div>
      <div class="le-fund-status" style="color:${hasFund ? 'var(--accent)' : 'var(--danger)'};">
        ${hasFund ? '✅ Tu fondo de emergencia lo cubre' : '⚠️ No tienes suficiente efectivo'}
      </div>
      <div class="le-lesson">${ev.lesson}</div>
      <button class="btn btn-primary btn-block" style="margin-top:16px;" onclick="resolveLifeEvent('${ev.id}','pay')">
        ${hasFund ? `Pagar €${ev.cost.toLocaleString('es')}` : `Pagar lo que puedo (−€${Math.min(ev.cost, S.cash||0).toLocaleString('es')})`}
      </button>`;
  } else if (ev.type === 'good') {
    bodyHTML = `
      <div class="le-amount" style="color:${col};">+€${ev.gain.toLocaleString('es')}</div>
      <div class="le-lesson">${ev.lesson}</div>
      <div style="display:flex;gap:8px;margin-top:16px;">
        <button class="btn btn-primary" style="flex:1;" onclick="resolveLifeEvent('${ev.id}','invest')">💹 Invertir 70%</button>
        <button class="btn btn-secondary" style="flex:1;" onclick="resolveLifeEvent('${ev.id}','save')">🏦 Guardar todo</button>
      </div>`;
  } else {
    // choice event
    bodyHTML = `
      <div class="le-lesson" style="margin-bottom:14px;">${ev.lesson}</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${ev.choices.map((c,i) => `<button class="career-choice-btn choice-${c.type}" onclick="resolveLifeEvent('${ev.id}','choice_${i}')">${c.label}</button>`).join('')}
      </div>`;
  }

  modal.innerHTML = `
    <div class="modal-box le-modal">
      <div class="le-icon">${ev.icon}</div>
      <div class="le-type" style="color:${col};">${isBad ? '⚠️ IMPREVISTO' : isGood ? '🎉 BUENAS NOTICIAS' : '🤔 DECISIÓN'}</div>
      <div class="le-title">${ev.title}</div>
      <div class="le-desc">${ev.desc}</div>
      ${bodyHTML}
    </div>`;
  modal.style.display = 'flex';

  if (isBad)  { SFX.wrong();   HAPTIC.error(); }
  if (isGood) { SFX.correct(); HAPTIC.success(); confetti(); }
  if (ev.type === 'choice') SFX.xp();
}

function resolveLifeEvent(eventId, action) {
  const ev = RANDOM_LIFE_EVENTS.find(e => e.id === eventId);
  if (!ev) return;
  const modal = document.getElementById('m-life-random');
  if (modal) modal.style.display = 'none';

  if (ev.type === 'bad') {
    const cost = Math.min(ev.cost, S.cash || 0);
    S.cash = Math.max(0, (S.cash||0) - cost);
    spawnMoney('−€' + cost.toLocaleString('es'), '#ff4b5c');
    toast(ev.icon + ' ' + ev.title, `−€${cost.toLocaleString('es')} de tu efectivo`, 't-danger');
  } else if (ev.type === 'good') {
    if (action === 'invest') {
      const inv = Math.round(ev.gain * 0.7);
      const sav = ev.gain - inv;
      S.cash    = (S.cash||0) + sav;
      S.invested = (S.invested||0) + inv;
      S.xp += 150;
      spawnMoney('+€' + ev.gain.toLocaleString('es'), '#00e5a0');
      toast(ev.icon + ' ' + ev.title, `+€${inv.toLocaleString('es')} invertidos + €${sav} guardados · +150 XP`, 't-success');
    } else {
      S.cash = (S.cash||0) + ev.gain;
      spawnMoney('+€' + ev.gain.toLocaleString('es'), '#00e5a0');
      toast(ev.icon + ' ' + ev.title, `+€${ev.gain.toLocaleString('es')} en efectivo`, 't-success');
    }
  } else {
    const idx = parseInt(action.replace('choice_', ''));
    const ch  = ev.choices[idx];
    if (ch) {
      try { ch.effect(S); } catch(e) {}
      toast(ev.icon + ' ' + ev.title, ch.result, ch.type === 'positive' ? 't-success' : ch.type === 'negative' ? 't-danger' : 't-social');
    }
  }

  saveState();
  updateUIFromState();
  checkAchievements();
}


/* ══════════════════════════════════════════════════════════════════
   MARKET NEWS FEED — Noticias que mueven precios en tiempo real
   ─────────────────────────────────────════════════════════════════
   · Se dispara cada 20-40 ticks del precio (80-160s reales)
   · Aparece como banner en la parte superior
   · Afecta precios de sectores específicos ±2-8%
══════════════════════════════════════════════════════════════════ */
const MARKET_NEWS = [
  { headline:'🏦 BCE sube tipos +0,25% — bonos suben, tech presionado', sector:'tech', mult:0.97, positive:false },
  { headline:'🤖 NVIDIA bate estimaciones: beneficio récord en IA', sector:'tech', mult:1.06, positive:true },
  { headline:'🛢️ OPEP recorta producción — petróleo +8%', sector:'commodity', mult:1.05, positive:true },
  { headline:'📉 Dato IPC EEUU: inflación persiste en 3,4%', sector:'all', mult:0.98, positive:false },
  { headline:'🇨🇳 China estimula economía: mercados emergentes +3%', sector:'etf', mult:1.04, positive:true },
  { headline:'⚡ Crisis energética en Europa: utilities bajo presión', sector:'commodity', mult:0.95, positive:false },
  { headline:'💊 Aprobación FDA de nuevo fármaco — healthcare +4%', sector:'health', mult:1.04, positive:true },
  { headline:'🏠 Datos inmobiliario EEUU: sector residencial frena', sector:'realestate', mult:0.96, positive:false },
  { headline:'🚀 SpaceX IPO rumoreada — sector aeroespacial al alza', sector:'tech', mult:1.03, positive:true },
  { headline:'🌍 Tensión geopolítica — oro como refugio sube +2%', sector:'commodity', mult:1.03, positive:true },
  { headline:'📊 FED mantiene tipos — mercado respira aliviado', sector:'all', mult:1.02, positive:true },
  { headline:'💸 Dólar se fortalece — exportadoras europeas caen', sector:'etf', mult:0.97, positive:false },
  { headline:'🔋 Tesla anuncia batería de nueva generación +15% autonomía', sector:'tech', mult:1.05, positive:true },
  { headline:'🏦 Quiebra banco regional EEUU — sector financiero -3%', sector:'all', mult:0.97, positive:false },
  { headline:'📱 Apple supera 1B de iPhones activos — máximos históricos', sector:'tech', mult:1.03, positive:true },
];

let _newsTickCount = 0;
const NEWS_INTERVAL = 25 + Math.floor(Math.random() * 20);

function _checkMarketNews() {
  _newsTickCount++;
  if (_newsTickCount % NEWS_INTERVAL !== 0) return;

  const news = MARKET_NEWS[Math.floor(Math.random() * MARKET_NEWS.length)];

  // Apply price effect
  STOCKS.forEach(s => {
    const applies = news.sector === 'all' ||
                    s.sector   === news.sector ||
                    (news.sector === 'tech' && ['AAPL','MSFT','NVDA','TSLA','AMZN'].includes(s.ticker)) ||
                    (news.sector === 'etf'  && ['MSCI','SP500','IBEX'].includes(s.ticker)) ||
                    (news.sector === 'commodity' && ['GOLD','OIL'].includes(s.ticker));
    if (applies) {
      const jitter = 0.99 + Math.random() * 0.02;
      GAME.stockPrices[s.ticker] = +((GAME.stockPrices[s.ticker] || s.price) * news.mult * jitter).toFixed(2);
    }
  });

  // Show news banner
  _showNewsBanner(news);
  _renderPriceTicker();
}

function _showNewsBanner(news) {
  // Update euribor if BCE-related news
  if (news && news.headline) _updateEuriborFromNews(news.headline);

  let banner = document.getElementById('news-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'news-banner';
    banner.className = 'news-banner';
    document.getElementById('s-home')?.prepend(banner) || document.body.prepend(banner);
  }
  banner.innerHTML = news.headline;
  banner.className = 'news-banner ' + (news.positive ? 'news-positive' : 'news-negative');
  banner.style.opacity = '1';
  banner.style.transform = 'translateY(0)';
  setTimeout(() => {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(-20px)';
  }, 4000);
}


/* ══════════════════════════════════════════════════════════════════
   PATRIMONY CHART — Curva histórica con Chart.js
   ─────────────────────────────────────────────────────────────────
   · Se muestra en el home debajo del patrimonio actual
   · Línea del jugador (verde) + proyección (punteada dorada)
   · Solo visible si hay ≥2 puntos de historia
══════════════════════════════════════════════════════════════════ */
let _patrimonyChartInst = null;

function renderPatrimonyChart() {
  const canvas = document.getElementById('patrimony-chart');
  if (!canvas) return;

  const history = S.patrimonyHistory || [];
  // Add current point
  const points = [
    ...history.map(h => ({ x: `Año ${h.year}`, y: h.value })),
    { x: `Año ${S.gameYear||1} (actual)`, y: Math.round(S.patrimony||0) },
  ];

  if (points.length < 2) {
    canvas.parentElement.style.display = 'none';
    return;
  }
  canvas.parentElement.style.display = 'block';

  // Projection: 5 more years
  const lastVal = points[points.length-1].y;
  const projPoints = [lastVal];
  for (let i = 1; i <= 5; i++) {
    projPoints.push(Math.round(calcCompound(lastVal, S.monthlyContribution||200, S.expectedReturn||7, i)));
  }

  const labels    = points.map(p => p.x);
  const projLabels = points.map(p => p.x).concat(
    Array.from({length:5},(_,i)=>`+${i+1}a`)
  );

  if (_patrimonyChartInst) _patrimonyChartInst.destroy();

  _patrimonyChartInst = new Chart(canvas, {
    type: 'line',
    data: {
      labels: projLabels,
      datasets: [
        {
          label: 'Tu patrimonio',
          data: [...points.map(p=>p.y), ...Array(5).fill(null)],
          borderColor: '#00e5a0',
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const {ctx: c, chartArea} = chart;
            if (!chartArea) return 'rgba(0,229,160,0.08)';
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0,   'rgba(0,229,160,0.28)');
            gradient.addColorStop(0.6, 'rgba(0,229,160,0.08)');
            gradient.addColorStop(1,   'rgba(0,229,160,0.0)');
            return gradient;
          },
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#00e5a0',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Proyección',
          data: [...Array(points.length-1).fill(null), ...projPoints],
          borderColor: '#f0b429',
          borderWidth: 2,
          borderDash: [6,4],
          pointRadius: 3,
          pointBackgroundColor: '#f0b429',
          tension: 0.4,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => '€' + Math.round(ctx.parsed.y).toLocaleString('es'),
          },
        },
      },
      scales: {
        x: { ticks: { color: ()=>document.body.classList.contains('light-mode')?'rgba(60,50,30,.5)':'rgba(255,255,255,.4)', font:{size:9} }, grid: { color: ()=>document.body.classList.contains('light-mode')?'rgba(60,50,30,.08)':'rgba(255,255,255,.05)' } },
        y: {
          ticks: { color: ()=>document.body.classList.contains('light-mode')?'rgba(60,50,30,.5)':'rgba(255,255,255,.4)', font:{size:9},
            callback: v => '€' + (v>=1000 ? (v/1000).toFixed(0)+'k' : v) },
          grid: { color: ()=>document.body.classList.contains('light-mode')?'rgba(60,50,30,.08)':'rgba(255,255,255,.05)' },
        },
      },
    },
  });
}


/* ══════════════════════════════════════════════════════════════════
   PATRIMONY DAILY CHART — SVG puro, sin librerías
   · Visible desde el día 2 (no espera fin de año)
   · Rolling últimos 90 días o todos si < 90
   · Tooltip interactivo con mousemove / touchmove
   · Tab "Días" (SVG) y "Años" (Chart.js anual existente)
══════════════════════════════════════════════════════════════════ */

let _patrimonyTab = 'daily';

function switchPatrimonyTab(tab) {
  _patrimonyTab = tab;
  const dailyWrap = document.getElementById('patr-daily-wrap');
  const yearsWrap = document.getElementById('patr-yearly-wrap');
  const tabDaily  = document.getElementById('pct-tab-daily');
  const tabYears  = document.getElementById('pct-tab-years');
  if (tab === 'daily') {
    if (dailyWrap) dailyWrap.style.display = 'block';
    if (yearsWrap) yearsWrap.style.display = 'none';
    if (tabDaily)  { tabDaily.classList.add('active'); }
    if (tabYears)  { tabYears.classList.remove('active'); }
    renderPatrimonyDailyChart();
  } else {
    if (dailyWrap) dailyWrap.style.display = 'none';
    if (yearsWrap) yearsWrap.style.display = 'block';
    if (tabYears)  { tabYears.classList.add('active'); }
    if (tabDaily)  { tabDaily.classList.remove('active'); }
    renderPatrimonyChartAuto();
  }
}

function renderPatrimonyDailyChart() {
  const wrap = document.getElementById('patr-daily-wrap');
  if (!wrap) return;
  if (!Array.isArray(S.patrimonyDaily)) S.patrimonyDaily = [];
  const allPoints = S.patrimonyDaily;
  if (allPoints.length < 2) {
    wrap.innerHTML = '<div class="patr-chart-empty">El historial diario aparece a partir del segundo día de juego.</div>';
    return;
  }
  const pts    = allPoints.length > 90 ? allPoints.slice(-90) : allPoints;
  const values = pts.map(function(p) { return p.value; });
  const days   = pts.map(function(p) { return p.day; });
  const minV   = Math.min.apply(null, values);
  const maxV   = Math.max.apply(null, values);
  const rangeV = maxV - minV || 1;
  const firstV = values[0];
  const lastV  = values[values.length - 1];
  const deltaV = lastV - firstV;
  const deltaPct = firstV > 0 ? ((deltaV / firstV) * 100).toFixed(1) : '0.0';
  const deltaPos = deltaV >= 0;

  var VW = 360, VH = 130, PL = 52, PR = 12, PT = 18, PB = 30;
  var CW = VW - PL - PR, CH = VH - PT - PB;
  var n  = pts.length;

  function xOf(i)  { return PL + (i / (n - 1)) * CW; }
  function yOf(v)  { return PT + CH - ((v - minV) / rangeV) * CH; }

  function buildPath(vals) {
    var coords = vals.map(function(v, i) { return [xOf(i), yOf(v)]; });
    var d = 'M' + coords[0][0].toFixed(1) + ',' + coords[0][1].toFixed(1);
    for (var i = 1; i < coords.length; i++) {
      var prev = coords[i-1], curr = coords[i];
      var cpx = (prev[0] + curr[0]) / 2;
      d += ' C' + cpx.toFixed(1) + ',' + prev[1].toFixed(1) +
           ' '  + cpx.toFixed(1) + ',' + curr[1].toFixed(1) +
           ' '  + curr[0].toFixed(1) + ',' + curr[1].toFixed(1);
    }
    return d;
  }

  var linePath = buildPath(values);
  var lastX    = xOf(n - 1).toFixed(1);
  var lastY    = yOf(lastV).toFixed(1);
  var fillPath = linePath + ' L' + lastX + ',' + (PT + CH).toFixed(1) +
                 ' L' + PL + ',' + (PT + CH).toFixed(1) + ' Z';

  function fmtV(v) {
    return v >= 1000000 ? (v/1000000).toFixed(1)+'M' :
           v >= 1000    ? (v/1000).toFixed(0)+'k'    : Math.round(v).toString();
  }

  var yTickVals = [minV, minV + rangeV * 0.5, maxV];
  var yTicksHTML = yTickVals.map(function(v) {
    return '<text x="' + (PL-4) + '" y="' + (yOf(v)+3.5).toFixed(1) + '"' +
           ' text-anchor="end" font-size="8" fill="rgba(255,255,255,0.35)"' +
           ' font-family="DM Mono,monospace">\u20ac' + fmtV(Math.round(v)) + '</text>';
  }).join('');

  var xIdxs = [0, Math.floor((n-1)/2), n-1];
  var xTicksHTML = xIdxs.map(function(i) {
    return '<text x="' + xOf(i).toFixed(1) + '" y="' + (VH-4) + '"' +
           ' text-anchor="middle" font-size="8" fill="rgba(255,255,255,0.30)"' +
           ' font-family="DM Mono,monospace">D' + days[i] + '</text>';
  }).join('');

  var badgeCol  = deltaPos ? '#00e5a0' : '#ef4444';
  var badgeSign = deltaPos ? '+' : '';
  var gid       = 'pdg' + (Date.now() % 99999);
  var badgeX    = VW - PR - 72;

  var svgHTML =
    '<svg id="patr-svg-el" viewBox="0 0 ' + VW + ' ' + VH + '" preserveAspectRatio="none"' +
    ' style="width:100%;height:130px;display:block;overflow:visible;">' +
    '<defs>' +
    '<linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0%" stop-color="#00e5a0" stop-opacity="0.28"/>' +
    '<stop offset="75%" stop-color="#00e5a0" stop-opacity="0.05"/>' +
    '<stop offset="100%" stop-color="#00e5a0" stop-opacity="0"/>' +
    '</linearGradient></defs>' +
    // grid lines
    yTickVals.map(function(v) {
      return '<line x1="' + PL + '" y1="' + yOf(v).toFixed(1) + '" x2="' + (VW-PR) + '" y2="' + yOf(v).toFixed(1) + '"' +
             ' stroke="rgba(255,255,255,0.05)" stroke-width="1"/>';
    }).join('') +
    // fill + line
    '<path d="' + fillPath + '" fill="url(#' + gid + ')"/>' +
    '<path d="' + linePath + '" fill="none" stroke="#00e5a0" stroke-width="2"' +
    ' stroke-linecap="round" stroke-linejoin="round"/>' +
    // last point
    '<circle cx="' + lastX + '" cy="' + lastY + '" r="4" fill="#00e5a0"/>' +
    '<circle cx="' + lastX + '" cy="' + lastY + '" r="8" fill="#00e5a0" opacity="0.15"/>' +
    // labels
    yTicksHTML + xTicksHTML +
    // delta badge
    '<rect x="' + badgeX + '" y="' + (PT-13) + '" width="72" height="16" rx="8"' +
    ' fill="' + badgeCol + '" opacity="0.15"/>' +
    '<text x="' + (badgeX+36) + '" y="' + (PT-2) + '"' +
    ' text-anchor="middle" font-size="9" font-weight="700" fill="' + badgeCol + '"' +
    ' font-family="DM Mono,monospace">' + badgeSign + deltaPct + '% (' + n + 'd)</text>' +
    // hover zone
    '<rect id="patr-hz" x="' + PL + '" y="' + PT + '" width="' + CW + '" height="' + CH + '"' +
    ' fill="transparent" style="cursor:crosshair;"/>' +
    '<line id="patr-hl" x1="0" y1="' + PT + '" x2="0" y2="' + (PT+CH) + '"' +
    ' stroke="rgba(255,255,255,0.22)" stroke-width="1" stroke-dasharray="3,2" opacity="0" pointer-events="none"/>' +
    '<circle id="patr-hd" cx="0" cy="0" r="3.5" fill="white" opacity="0" pointer-events="none"/>' +
    '</svg>' +
    '<div id="patr-tip" style="display:none;position:absolute;top:6px;left:50%;transform:translateX(-50%);\
background:rgba(6,8,16,0.92);border:1px solid rgba(255,255,255,0.12);border-radius:8px;\
padding:5px 10px;font-size:11px;color:#e2e8f0;font-family:\'DM Mono\',monospace;\
pointer-events:none;white-space:nowrap;z-index:10;"></div>';

  wrap.style.position = 'relative';
  wrap.innerHTML = svgHTML;

  var svgEl = document.getElementById('patr-svg-el');
  var zone  = document.getElementById('patr-hz');
  var hLine = document.getElementById('patr-hl');
  var hDot  = document.getElementById('patr-hd');
  var tip   = document.getElementById('patr-tip');
  if (!zone) return;

  function getIdx(clientX) {
    var rect = svgEl.getBoundingClientRect();
    var svgX = ((clientX - rect.left) / rect.width) * VW;
    var i    = Math.round(((svgX - PL) / CW) * (n - 1));
    return Math.max(0, Math.min(n - 1, i));
  }
  function showTip(clientX) {
    var i  = getIdx(clientX);
    var px = xOf(i), py = yOf(values[i]);
    if (hLine) { hLine.setAttribute('x1', px.toFixed(1)); hLine.setAttribute('x2', px.toFixed(1)); hLine.setAttribute('opacity','1'); }
    if (hDot)  { hDot.setAttribute('cx', px.toFixed(1)); hDot.setAttribute('cy', py.toFixed(1)); hDot.setAttribute('opacity','1'); }
    if (tip) {
      var d = values[i] - values[0];
      tip.textContent = 'D\xeda ' + days[i] + ': \u20ac' + values[i].toLocaleString('es') + '  ' + (d>=0?'+':'') + '\u20ac' + Math.round(d).toLocaleString('es');
      tip.style.display = 'block';
    }
  }
  function hideTip() {
    if (hLine) hLine.setAttribute('opacity','0');
    if (hDot)  hDot.setAttribute('opacity','0');
    if (tip)   tip.style.display = 'none';
  }
  zone.addEventListener('mousemove',  function(e) { showTip(e.clientX); });
  zone.addEventListener('mouseleave', hideTip);
  zone.addEventListener('touchmove',  function(e) { e.preventDefault(); showTip(e.touches[0].clientX); }, { passive:false });
  zone.addEventListener('touchend',   hideTip);
}

function renderPatrimonyChartAuto() {
  var wrap = document.getElementById('patr-chart-wrap');
  if (!wrap) return;
  if (!Array.isArray(S.patrimonyDaily)) S.patrimonyDaily = [];
  var hasDailyData  = S.patrimonyDaily.length >= 2;
  var hasYearlyData = (S.patrimonyHistory || []).length >= 1;
  if (!hasDailyData && !hasYearlyData) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  switchPatrimonyTab(_patrimonyTab);
}




/* ══════════════════════════════════════════════════════════════════
   SMART BOT RANKING — Bots con patrimonio real y comportamiento
   dinámico. Se mueven cada semana de juego con pequeña aleatoriedad
══════════════════════════════════════════════════════════════════ */
const BOT_PLAYERS = [
  { n:'María S.',  em:'🦊', xp:8420, str:28, cl:'#ff6b35', patrimony:34200, trend: 1.008 },
  { n:'Carlos M.', em:'🐻', xp:7890, str:21, cl:'#0091ff', patrimony:28900, trend: 1.006 },
  { n:'Ana P.',    em:'🦋', xp:7340, str:15, cl:'#a855f7', patrimony:22100, trend: 1.010 },
  { n:'David R.',  em:'🦅', xp:6980, str:19, cl:'#00e5a0', patrimony:19400, trend: 1.007 },
  { n:'Laura G.',  em:'🌺', xp:6420, str:12, cl:'#f0b429', patrimony:15800, trend: 1.009 },
  { n:'Javier T.', em:'🦁', xp:5890, str:8,  cl:'#06b6d4', patrimony:12300, trend: 1.005 },
  { n:'Sara M.',   em:'🐝', xp:5210, str:22, cl:'#8b5cf6', patrimony:9800,  trend: 1.012 },
  { n:'Pablo H.',  em:'🐬', xp:4780, str:6,  cl:'#ec4899', patrimony:7200,  trend: 1.004 },
];

/* ── SHADOW INVESTORS — bots con estrategia real, compiten contra el jugador ── */
const SHADOW_INVESTORS = [
  {
    id: 'bogle',
    n: 'Bogle-Bot',
    em: '🤖',
    cl: '#00e5a0',
    xp: 9999, str: 365,
    patrimony: 41000,
    // DCA puro: +0.8% mensual fijo (S&P500 histórico ~10% anual)
    strategy: 'bogle',
    badge: '📊 Solo VUSA',
    tip: 'Compra índice cada mes. Nunca vende. Gana al 90% de gestores.',
    trend: 1.0065, // ~8% anual
    shadow: true,
  },
  {
    id: 'cryptobro',
    n: 'Cripto-Bro',
    em: '🎰',
    cl: '#f59e0b',
    xp: 3200, str: 4,
    patrimony: 38000,
    strategy: 'crypto',
    badge: '🪙 BTC/ETH only',
    tip: 'Todo en crypto. A veces nº1, a veces el último.',
    trend: 1.008,  // alta media pero con volatilidad brutal
    shadow: true,
  },
  {
    id: 'senator',
    n: 'The Senator',
    em: '🏛️',
    cl: '#a855f7',
    xp: 11200, str: 90,
    patrimony: 55000,
    strategy: 'insider',
    badge: '🔮 Info privilegiada',
    tip: 'Siempre "adivina" los eventos 2 días antes. Misterioso.',
    trend: 1.010, // mejor rendimiento pero irregular
    shadow: true,
  },
];

// Advance bot patrimony each game week
function _tickBotRankings() {
  if (S.gameDay % 7 !== 0) return;
  BOT_PLAYERS.forEach(bot => {
    const rnd = 0.996 + Math.random() * 0.016;
    bot.patrimony = Math.round(bot.patrimony * bot.trend * rnd);
    bot.xp += Math.floor(Math.random() * 40);
  });
  // Shadow Investors — cada uno con su lógica propia
  SHADOW_INVESTORS.forEach(bot => {
    let rnd;
    if (bot.strategy === 'bogle') {
      // Estable, poca volatilidad, sube siempre
      rnd = 0.999 + Math.random() * 0.004;
    } else if (bot.strategy === 'crypto') {
      // Alta volatilidad: puede subir mucho o caer fuerte
      rnd = 0.97 + Math.random() * 0.07;
    } else if (bot.strategy === 'insider') {
      // Casi siempre sube, raro que baje
      rnd = 1.001 + Math.random() * 0.006;
    }
    bot.patrimony = Math.round(Math.max(1000, bot.patrimony * bot.trend * rnd));
    bot.xp += Math.floor(Math.random() * 20);
  });
}

// Override _getLiveRankings to include patrimony
function _getLiveRankingsEnhanced() {
  const bots    = BOT_PLAYERS.map(b => ({ ...b, me: false }));
  const shadows = SHADOW_INVESTORS.map(b => ({ ...b, me: false }));
  const myPatrimony = Math.round(S.patrimony || 0);
  const meRow = {
    n: S.userName || 'Tú', em: S.avatar || '🌱',
    xp: S.xp || 0, str: S.streak || 0,
    cl: '#00e5a0', me: true, pos: 1,
    patrimony: myPatrimony,
  };
  const all = [...bots, ...shadows, meRow].sort((a, b) => b.patrimony - a.patrimony);
  all.forEach((r, i) => r.pos = i + 1);
  return all;
}

/* ══════════════════════════════════════════════════════════════════
   MORTGAGE ENGINE — Sistema de Hipotecas con Amortización Francesa
   ─────────────────────────────────────────────────────────────────
   Fórmula cuota mensual (Sistema Francés):
     M = P × [i(1+i)^n] / [(1+i)^n − 1]
   donde P=principal, i=tipo mensual, n=meses totales

   · Tipo fijo: cuota constante toda la vida
   · Tipo variable: ligado al euriborValue que sube/baja con noticias BCE
   · Si euribor sube tras noticia BCE → cuota variable sube en tiempo real
   · Cuota se descuenta automáticamente del cash cada mes de juego
══════════════════════════════════════════════════════════════════ */

// Euribor global — fluctúa con noticias del BCE
let EURIBOR = { value: 3.65, lastUpdate: 0 }; // % anual, valor actual ~2024

function calcMortgagePayment(principal, annualRate, months) {
  // Amortización francesa
  if (annualRate === 0) return principal / months;
  const i = annualRate / 100 / 12; // tipo mensual
  const n = months;
  return principal * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
}

function calcMortgageSchedule(principal, annualRate, months) {
  // Devuelve tabla de amortización completa [{mes, cuota, intereses, capital, saldoPendiente}]
  const schedule = [];
  let balance = principal;
  const payment = calcMortgagePayment(principal, annualRate, months);
  for (let m = 1; m <= months; m++) {
    const i = annualRate / 100 / 12;
    const interestPart = balance * i;
    const capitalPart  = payment - interestPart;
    balance = Math.max(0, balance - capitalPart);
    schedule.push({ mes: m, cuota: payment, intereses: interestPart, capital: capitalPart, saldo: balance });
  }
  return schedule;
}

function applyForMortgage(propertyValue, downPayment, years, type) {
  // type: 'fixed' | 'variable'
  const principal  = propertyValue - downPayment;
  const months     = years * 12;
  const baseRate   = type === 'fixed' ? 3.2 : EURIBOR.value + 0.8; // fijo 3.2% / variable euribor+0.8
  const payment    = calcMortgagePayment(principal, baseRate, months);

  if ((S.cash || 0) < downPayment) {
    toast('❌ Entrada insuficiente', `Necesitas €${downPayment.toLocaleString('es')} de entrada. Tienes €${Math.round(S.cash||0).toLocaleString('es')}`, 't-danger');
    return false;
  }

  const mortgage = {
    id:          'mort_' + Date.now(),
    propertyVal: propertyValue,
    principal,
    downPayment,
    months,
    remainingMonths: months,
    type,           // 'fixed' | 'variable'
    rate:            baseRate,
    monthlyPayment:  payment,
    paid:            false,
    totalInterestPaid: 0,
    monthsPaid:      0,
    propertyName:   `Vivienda €${(propertyValue/1000).toFixed(0)}k`,
  };

  S.cash      = (S.cash || 0) - downPayment;
  if (!Array.isArray(S.mortgages)) S.mortgages = [];
  S._hadMortgages = true;
  S.mortgages.push(mortgage);
  S.xp += 200;
  saveState();
  HAPTIC.success();
  SFX.levelUp();
  toast('🏠 Hipoteca aprobada', `€${Math.round(payment).toLocaleString('es')}/mes · ${years} años · tipo ${type === 'fixed' ? 'fijo' : 'variable'} ${baseRate.toFixed(2)}%`, 't-success');
  updateUIFromState();
  checkAchievements();
  return true;
}

function _tickMortgages() {
  // Called monthly (gameDay % 30 === 0) from _tickGameDay
  if (!Array.isArray(S.mortgages) || S.mortgages.length === 0) return;

  S.mortgages.forEach(m => {
    if (m.paid) return;

    // Variable rate: update from euribor
    if (m.type === 'variable') {
      const newRate    = EURIBOR.value + 0.8;
      if (Math.abs(newRate - m.rate) > 0.01) {
        const oldPayment = m.monthlyPayment;
        m.rate           = newRate;
        m.monthlyPayment = calcMortgagePayment(m.principal * (m.remainingMonths / m.months), newRate, m.remainingMonths);
        const diff = m.monthlyPayment - oldPayment;
        if (Math.abs(diff) >= 10) {
          const dir = diff > 0 ? '⬆️' : '⬇️';
          toast(`${dir} Hipoteca variable actualizada`,
            `Euríbor ${EURIBOR.value.toFixed(2)}% → cuota ${diff > 0 ? '+' : ''}€${Math.round(diff)}/mes (ahora €${Math.round(m.monthlyPayment).toLocaleString('es')})`,
            diff > 0 ? 't-danger' : 't-success');
          if (diff > 50) HAPTIC.error();
        }
      }
    }

    // Deduct payment
    const payment = Math.min(m.monthlyPayment, S.cash || 0);
    S.cash = Math.max(0, (S.cash || 0) - payment);
    if (payment > 0) _ledgerAdd('out', 'mortgage', `Cuota hipoteca: ${m.propertyName||'Vivienda'}`, payment);
    spawnMoney('−€' + Math.round(payment).toLocaleString('es') + ' 🏠', '#ff4b5c');

    // Amortise
    const i            = m.rate / 100 / 12;
    const interestPart = (m.principal * (m.remainingMonths / m.months)) * i;
    const capitalPart  = Math.max(0, payment - interestPart);
    m.totalInterestPaid += interestPart;
    m.monthsPaid++;
    m.remainingMonths = Math.max(0, m.remainingMonths - 1);

    if (m.remainingMonths === 0) {
      m.paid = true;
      S.xp += 500;
      confetti(); confetti();
      toast('🎉 ¡Hipoteca pagada!', `${m.propertyName} ya es tuya. Pagaste €${Math.round(m.totalInterestPaid).toLocaleString('es')} en intereses.`, 't-success');
      HAPTIC.levelUp(); SFX.levelUp();
      checkAchievements();
    }
  });

  S.patrimony = recalcPatrimony();
}

// Euribor reacts to BCE news
function _updateEuriborFromNews(headline) {
  if (!headline) return;
  const h = headline.toLowerCase();
  if (h.includes('bce sube tipos') || h.includes('subida') && h.includes('tipos')) {
    EURIBOR.value = Math.min(6.0, +(EURIBOR.value + 0.25).toFixed(2));
    toast('🏦 Euríbor sube', `Nuevo Euríbor: ${EURIBOR.value}% — Tu hipoteca variable sube`, 't-danger');
  } else if (h.includes('bce baja tipos') || h.includes('fed mantiene') || h.includes('tipos bajos')) {
    EURIBOR.value = Math.max(0.5, +(EURIBOR.value - 0.15).toFixed(2));
    toast('🏦 Euríbor baja', `Nuevo Euríbor: ${EURIBOR.value}% — Tu hipoteca variable mejora`, 't-success');
  }
}

function renderMortgagePanel() {
  const el = document.getElementById('mortgage-panel');
  if (!el) return;
  const morts = S.mortgages || [];

  if (morts.length === 0) {
    el.innerHTML = `
      <div class="mort-empty">
        <div style="font-size:36px;margin-bottom:8px;">🏠</div>
        <div style="font-weight:700;color:var(--text1);margin-bottom:4px;">Sin hipoteca activa</div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:16px;">Apalanca tu futuro con una hipoteca. El banco te presta hasta el 80% del valor.</div>
        <button class="btn btn-primary btn-sm" onclick="openMortgageModal()">Solicitar hipoteca</button>
      </div>`;
    return;
  }

  el.innerHTML = morts.map(m => {
    if (m.paid) return `
      <div class="mort-card mort-paid">
        <span class="mort-status">✅ PAGADA</span>
        <div class="mort-prop">${m.propertyName}</div>
        <div class="mort-detail">Intereses totales pagados: €${Math.round(m.totalInterestPaid).toLocaleString('es')}</div>
      </div>`;
    const pct = Math.round((1 - m.remainingMonths / m.months) * 100);
    const yearsLeft = Math.ceil(m.remainingMonths / 12);
    return `
      <div class="mort-card">
        <div class="mort-header">
          <span class="mort-prop">${m.propertyName}</span>
          <span class="mort-type-tag ${m.type}">${m.type === 'fixed' ? '🔒 Fijo' : '📊 Variable'}</span>
        </div>
        <div class="mort-big">€${Math.round(m.monthlyPayment).toLocaleString('es')}<span>/mes</span></div>
        <div class="mort-rate">Tipo ${m.rate.toFixed(2)}% · Quedan ${yearsLeft} años · Euríbor ${EURIBOR.value.toFixed(2)}%</div>
        <div class="pbar" style="margin:10px 0 6px;">
          <div class="pbar-fill" style="width:${pct}%;background:var(--accent);"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text3);">
          <span>${pct}% amortizado</span>
          <span>Intereses pagados: €${Math.round(m.totalInterestPaid).toLocaleString('es')}</span>
        </div>
        <button class="btn btn-sm btn-ghost" style="margin-top:10px;width:100%;" onclick="showAmortizationTable('${m.id}')">Ver tabla amortización →</button>
      </div>`;
  }).join('');

  const el2 = document.getElementById('mortgage-apply-btn');
  if (el2) el2.style.display = morts.filter(m=>!m.paid).length >= 2 ? 'none' : 'block';
}

function openMortgageModal() {
  let modal = document.getElementById('m-mortgage');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-mortgage';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-box" style="max-width:380px;">
      <button class="modal-close" onclick="document.getElementById('m-mortgage').style.display='none'">✕</button>
      <div style="text-align:center;font-size:40px;margin-bottom:8px;">🏠</div>
      <div class="h3 text-center mb4">Solicitar Hipoteca</div>
      <div style="font-size:12px;color:var(--text2);text-align:center;margin-bottom:20px;">
        Banco FinLearn · Máximo 80% LTV · Amortización francesa
      </div>

      <div class="form-group">
        <label class="form-label">Valor del inmueble (€)</label>
        <input type="number" id="mort-prop-val" class="form-input" value="200000" min="50000" max="800000" step="10000" oninput="updateMortgageCalc()">
      </div>
      <div class="form-group">
        <label class="form-label">Tu entrada (€) <span style="color:var(--text3);font-size:10px;">mín. 20%</span></label>
        <input type="number" id="mort-down" class="form-input" value="40000" min="10000" step="5000" oninput="updateMortgageCalc()">
      </div>
      <div class="form-group">
        <label class="form-label">Plazo (años)</label>
        <input type="range" id="mort-years" min="10" max="30" value="25" step="5" oninput="updateMortgageCalc()" style="width:100%;">
        <div style="text-align:center;font-size:13px;font-weight:700;" id="mort-years-lbl">25 años</div>
      </div>
      <div class="form-group">
        <label class="form-label">Tipo de interés</label>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-secondary" id="mort-btn-fixed" onclick="selectMortgageType('fixed')" style="flex:1;">🔒 Fijo 3.2%</button>
          <button class="btn btn-ghost" id="mort-btn-variable" onclick="selectMortgageType('variable')" style="flex:1;">📊 Variable Euríbor+0.8%</button>
        </div>
      </div>

      <div class="mort-calc-result" id="mort-calc-result"></div>

      <button class="btn btn-primary btn-block" onclick="confirmMortgage()" style="margin-top:16px;">
        ✅ Firmar hipoteca
      </button>
    </div>`;
  modal.style.display = 'flex';
  window._mortgageType = 'fixed';
  updateMortgageCalc();
}

function selectMortgageType(type) {
  window._mortgageType = type;
  const btnFixed    = document.getElementById('mort-btn-fixed');
  const btnVariable = document.getElementById('mort-btn-variable');
  if (btnFixed)    btnFixed.className    = type === 'fixed'    ? 'btn btn-secondary' : 'btn btn-ghost';
  if (btnVariable) btnVariable.className = type === 'variable' ? 'btn btn-secondary' : 'btn btn-ghost';
  updateMortgageCalc();
}

function updateMortgageCalc() {
  const propVal  = parseFloat(document.getElementById('mort-prop-val')?.value) || 200000;
  const down     = parseFloat(document.getElementById('mort-down')?.value)     || 40000;
  const years    = parseInt(document.getElementById('mort-years')?.value)      || 25;
  const type     = window._mortgageType || 'fixed';
  const lbl      = document.getElementById('mort-years-lbl');
  if (lbl) lbl.textContent = years + ' años';

  const principal = propVal - down;
  const rate      = type === 'fixed' ? 3.2 : EURIBOR.value + 0.8;
  const months    = years * 12;
  const payment   = calcMortgagePayment(principal, rate, months);
  const totalPaid = payment * months;
  const totalInt  = totalPaid - principal;
  const ltv       = (principal / propVal * 100).toFixed(0);

  const result = document.getElementById('mort-calc-result');
  if (!result) return;

  const ltvOk = ltv <= 80;
  const downOk = down >= propVal * 0.20;
  const cashOk = (S.cash || 0) >= down;

  result.innerHTML = `
    <div class="mort-preview ${(!ltvOk || !cashOk) ? 'mort-warning' : ''}">
      <div class="mort-preview-row"><span>Principal</span><span>€${Math.round(principal).toLocaleString('es')}</span></div>
      <div class="mort-preview-row"><span>LTV</span><span style="color:${ltvOk?'var(--accent)':'var(--danger)'};">${ltv}% ${ltvOk?'✅':'⛔ máx. 80%'}</span></div>
      <div class="mort-preview-row"><span>Tipo</span><span>${rate.toFixed(2)}% anual${type==='variable'?' (Euríbor '+EURIBOR.value.toFixed(2)+'%)':''}</span></div>
      <div class="mort-preview-row big"><span>Cuota mensual</span><span style="color:var(--accent);">€${Math.round(payment).toLocaleString('es')}/mes</span></div>
      <div class="mort-preview-row"><span>Total intereses</span><span style="color:var(--danger);">€${Math.round(totalInt).toLocaleString('es')}</span></div>
      <div class="mort-preview-row"><span>Tu efectivo</span><span style="color:${cashOk?'var(--accent)':'var(--danger)'};">€${Math.round(S.cash||0).toLocaleString('es')} ${cashOk?'✅':'❌ insuficiente'}</span></div>
      ${type==='variable'?'<div class="mort-warning-msg">⚠️ Si el BCE sube tipos, tu cuota sube automáticamente.</div>':''}
    </div>`;
}

function confirmMortgage() {
  const propVal = parseFloat(document.getElementById('mort-prop-val')?.value) || 200000;
  const down    = parseFloat(document.getElementById('mort-down')?.value)     || 40000;
  const years   = parseInt(document.getElementById('mort-years')?.value)      || 25;
  const type    = window._mortgageType || 'fixed';
  document.getElementById('m-mortgage').style.display = 'none';
  applyForMortgage(propVal, down, years, type);
}

function showAmortizationTable(mortId) {
  const m = (S.mortgages || []).find(x => x.id === mortId);
  if (!m) return;
  const schedule = calcMortgageSchedule(
    m.principal * (m.remainingMonths / m.months),
    m.rate, m.remainingMonths
  ).slice(0, 12); // Show first year

  let modal = document.getElementById('m-amort-table');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-amort-table';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-box" style="max-width:420px;">
      <button class="modal-close" onclick="document.getElementById('m-amort-table').style.display='none'">✕</button>
      <div class="h3 mb4">📊 Tabla de amortización</div>
      <div style="font-size:11px;color:var(--text2);margin-bottom:12px;">${m.propertyName} · Próximos 12 meses</div>
      <div style="overflow-x:auto;">
        <table class="amort-table">
          <thead><tr><th>Mes</th><th>Cuota</th><th>Intereses</th><th>Capital</th><th>Saldo</th></tr></thead>
          <tbody>
            ${schedule.map(r => `<tr>
              <td>${r.mes}</td>
              <td>€${Math.round(r.cuota).toLocaleString('es')}</td>
              <td style="color:var(--danger);">€${Math.round(r.intereses).toLocaleString('es')}</td>
              <td style="color:var(--accent);">€${Math.round(r.capital).toLocaleString('es')}</td>
              <td>€${Math.round(r.saldo).toLocaleString('es')}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="mort-lesson">💡 Al principio casi todo son intereses. Así funciona el sistema francés: el banco cobra primero.</div>
    </div>`;
  modal.style.display = 'flex';
}


/* ══════════════════════════════════════════════════════════════════
   SCENARIO CHALLENGES — Retos de Escenario "Endgame"
   ─────────────────────────────────────────────────────────────────
   · 5 escenarios distintos de partida rápida (10 min reales)
   · Cada uno arranca con condiciones iniciales únicas
   · Al completarlo (objetivo alcanzado) da XP masivo y badge
   · No sobreescribe el estado principal — usa una copia temporal
══════════════════════════════════════════════════════════════════ */
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
const AI_COACH = (() => {
  let _lastAdviceTime = 0;
  const COOLDOWN_MS   = 120_000; // 2 min entre consejos proactivos

  // ─── API key desde localStorage (nunca en el código) ──────────
  function _getApiKey()      { return localStorage.getItem('finai_api_key') || ''; }
  function _getApiProvider() { return localStorage.getItem('finai_api_provider') || 'anthropic'; }

  /* ── fetchFinAIResponse ─────────────────────────────────────
     Llama a la API con contexto real del jugador.
     Soporta: anthropic (Claude) | deepseek | openai
     Si falla devuelve respuesta estática: el juego NUNCA se rompe.
  ─────────────────────────────────────────────────────────────*/
  async function fetchFinAIResponse(userQuestion, staticFallback) {
    const FINAI_API_KEY      = _getApiKey();
    const FINAI_API_PROVIDER = _getApiProvider();

    // Si no hay key propia pero es premium, usar endpoint propio
    // Usuario gratis: retorna fallback inmediato sin error
    if (!FINAI_API_KEY && !isPremium()) return staticFallback;
    if (!FINAI_API_KEY && isPremium()) {
      try {
        if (!navigator.onLine) return '📵 Sin conexión. El FinAI Coach no está disponible offline.';
        const context = 'Nombre: ' + (S.userName||'Explorador')
          + ' | Nivel: ' + (S.level||1)
          + ' | XP: ' + (S.xp||0)
          + ' | Racha: ' + (S.streak||0) + 'd'
          + ' | Módulos: ' + (S.completedMods||[]).length
          + ' | Cash: €' + Math.round(S.cash||0)
          + ' | Patrimonio: €' + Math.round(S.patrimony||0)
          + ' | Carrera: ' + (S.career||'junior');
        const res = await fetch('/api/coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: userQuestion, context }),
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (data.text) {
          _coachHistory.push({ q: userQuestion.slice(0,120), a: data.text });
          if (_coachHistory.length > 6) _coachHistory.shift();
          return data.text;
        }
      } catch(e) {
        if (!navigator.onLine) return '📵 Sin conexión. Vuelve cuando tengas internet.';
        return '⚠️ El coach está sobrecargado ahora mismo. Inténtalo en 30 segundos.';
      }
    }

    if (!FINAI_API_KEY) return staticFallback;

    // Construir contexto financiero del jugador
    const totalDebt  = (S.debts||[]).reduce((a,d)=>a+(d.balance||0),0);
    const bizIncome  = Math.round((S.yearBizIncome||0)/12);
    const holdings   = Object.keys(S.portfolio||{}).filter(k=>S.portfolio[k]>0).join(', ') || 'ninguna';
    const gameYear   = S.gameYear || 1;

    // ── Contexto enriquecido del jugador ─────────────────────
    const healthScore    = typeof calcHealthScore === 'function' ? calcHealthScore() : 0;
    const savingsRate    = (S.lifeSalary||0) > 0 ? Math.round(((S.monthlyContribution||0)/(S.lifeSalary||1))*100) : 0;
    const fireNumber     = Math.round((S.lifeSalary||1800)*0.6*12*25);
    const firePct        = fireNumber > 0 ? Math.round((S.patrimony||0)/fireNumber*100) : 0;
    const portfolioBreakdown = Object.entries(S.portfolio||{})
      .filter(function(e){ return e[1].shares > 0; })
      .map(function(e){ var tk=e[0],p=e[1]; var price=(GAME.stockPrices&&GAME.stockPrices[tk])||(typeof STOCKS!=='undefined'&&STOCKS.find(function(s){return s.ticker===tk;})?.price)||0; return tk+':'+p.shares+'acc(€'+Math.round(price*p.shares)+')'; })
      .join(', ') || 'ninguna';
    const bizDetails = Object.entries(S.businesses||{})
      .map(function(e){ var b=typeof BUSINESSES!=='undefined'&&BUSINESSES.find(function(x){return x.id===e[0];}); return b?b.name:e[0]; })
      .join(', ') || 'ninguno';
    const missionsDone   = Array.isArray(S._mw_missions) ? S._mw_missions.filter(function(m){return m.done;}).length : 0;
    const achievCount    = typeof ACHIEVEMENTS !== 'undefined' ? ACHIEVEMENTS.filter(function(a){return a.earned;}).length : 0;
    const patrimonyTrend = (function(){
      var pd = S.patrimonyDaily || [];
      if (pd.length < 5) return 'insuficientes datos';
      var last5 = pd.slice(-5).map(function(p){return p.value;});
      var delta = last5[last5.length-1] - last5[0];
      return (delta >= 0 ? '+' : '') + Math.round(delta).toLocaleString('es') + '€ últimos 5 días';
    })();
    const conversationCtx = _coachHistory.length > 0
      ? '\nCONVERSACIÓN PREVIA (contexto):\n' + _coachHistory.slice(-3).map(function(h){return 'P:'+h.q+'\nR:'+h.a.slice(0,100);}).join('\n')
      : '';

    const systemPrompt = 'Eres FinAI, el coach financiero personal de ' + (S.userName||'este jugador') + ' en FinLearn.'
      + '\nRespondes SIEMPRE en español, de forma directa y concisa (2-3 frases máximo).'
      + '\nUsas los números EXACTOS del jugador. Nunca das disclaimers legales. Eres directo, útil, motivador.'
      + '\nSi el usuario hace pregunta de seguimiento, tienes en cuenta la conversación previa.'
      + '\n\nESTADO DEL JUGADOR:'
      + '\nNombre: ' + (S.userName||'Explorador') + ' | Edad: ' + (S.lifeAge||25) + 'a | Año juego: ' + gameYear
      + '\nPatrimonio: €' + Math.round(S.patrimony||0).toLocaleString('es') + ' | Cash: €' + Math.round(S.cash||0).toLocaleString('es') + ' | Invertido: €' + Math.round(S.invested||0).toLocaleString('es')
      + '\nSalario/mes: €' + Math.round(S.lifeSalary||0).toLocaleString('es') + ' | Tasa ahorro: ' + savingsRate + '% | Deuda: €' + Math.round(totalDebt).toLocaleString('es')
      + '\nCartera: ' + portfolioBreakdown
      + '\nNegocios: ' + bizDetails + ' | Ingresos biz/mes: €' + bizIncome.toLocaleString('es')
      + '\nSalud financiera: ' + healthScore + '/100 | Racha: ' + (S.streak||0) + 'd | XP: ' + (S.xp||0)
      + '\nMódulos: ' + (S.completedMods||[]).length + ' | Misiones: ' + missionsDone + ' | Logros: ' + achievCount
      + '\nFIRE: ' + firePct + '% de €' + fireNumber.toLocaleString('es')
      + '\nTendencia patrimonio: ' + patrimonyTrend
      + (typeof _activeScenario !== 'undefined' && _activeScenario ? '\nESCENARIO: "' + _activeScenario.name + '"' : '')
      + conversationCtx;

    // P8-A: Sin conexión → mensaje amigable
    if (!navigator.onLine) return '📵 Sin conexión. El FinAI Coach no está disponible offline, pero el resto de FinLearn sí funciona. ¡Vuelve cuando tengas conexión!';

    const endpoints = {
      anthropic: { url: 'https://api.anthropic.com/v1/messages', model: 'claude-sonnet-4-20250514' },
      deepseek:  { url: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat' },
      openai:    { url: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' },
    };
    const ep = endpoints[FINAI_API_PROVIDER] || endpoints.anthropic;

    try {
      let res;
      if (FINAI_API_PROVIDER === 'anthropic') {
        res = await fetch(ep.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': FINAI_API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: ep.model,
            max_tokens: 200,
            system: systemPrompt,
            messages: [{ role: 'user', content: userQuestion }],
          }),
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const text = data.content?.[0]?.text?.trim();
        if (!text) throw new Error('empty response');
        _coachHistory.push({ q: userQuestion.slice(0,120), a: text });
        if (_coachHistory.length > 6) _coachHistory.shift();
        return text;
      } else {
        res = await fetch(ep.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${FINAI_API_KEY}` },
          body: JSON.stringify({
            model: ep.model,
            max_tokens: 180,
            temperature: 0.7,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user',   content: userQuestion },
            ],
          }),
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (!text) throw new Error('empty response');
        _coachHistory.push({ q: userQuestion.slice(0,120), a: text });
        if (_coachHistory.length > 6) _coachHistory.shift();
        return text;
      }
    } catch (err) {
      console.warn('[FinAI] API error, using fallback:', err.message);
      return staticFallback;
    }
  }

  /* ── Motor de análisis financiero inteligente — 60+ reglas ─────────
     Sin API key. Analiza S en tiempo real y genera consejos personalizados.
  ─────────────────────────────────────────────────────────────────── */
  function _analyze() {
    const patrimony   = S.patrimony   || 0;
    const cash        = S.cash        || 0;
    const invested    = S.invested    || 0;
    const salary      = S.lifeSalary  || calcMonthlySalary?.() || 0;
    const totalDebt   = (S.debts||[]).reduce((a,d)=>a+(d.balance||0),0);
    const highDebt    = (S.debts||[]).filter(d=>(d.rate||0)>=15);
    const mortgage    = (S.mortgages||[]).filter(m=>!m.paid);
    const savingsRate = salary > 0 ? Math.round((S.monthlyContribution||0)/salary*100) : 0;
    const cashPct     = patrimony > 0 ? Math.round(cash/patrimony*100) : 100;
    const career      = getCurrentCareer?.() || { id:'junior' };
    const mods        = (S.completedMods||[]).length;
    const gameYear    = S.gameYear || 1;
    const fireNumber  = salary > 0 ? salary * 0.6 * 12 * 25 : 1;
    const firePct     = fireNumber > 0 ? Math.round(patrimony/fireNumber*100) : 0;
    const inflLoss    = Math.round(cash * 0.035 / 12);
    const divIncome   = Math.round((S.totalDividends||0) / Math.max(1, gameYear));
    const holdings    = Object.keys(S.portfolio||{}).filter(k=>(S.portfolio[k].shares||0)>0);
    const streak      = S.streak || 0;
    const bizIncome   = Math.round((S.yearBizIncome||0)/12);
    const debtVsInv   = totalDebt > 0 && invested > 0;
    const tips = [];

    // 1. Cash excesivo
    if (cashPct > 50 && cash > 2000)
      tips.push(`Tienes el ${cashPct}% de tu patrimonio en cash (€${cash.toLocaleString('es')}). La inflación te roba €${inflLoss}/mes. Invierte al menos el 30% en un ETF indexado.`);
    if (cash > 10000 && invested < 1000)
      tips.push(`€${cash.toLocaleString('es')} parados mientras el mercado lleva décadas dando ~10% anual. Cada mes que esperas es rentabilidad perdida para siempre.`);

    // 2. Deuda de alto interés
    if (highDebt.length > 0 && debtVsInv) {
      const worstDebt = [...highDebt].sort((a,b)=>b.rate-a.rate)[0];
      tips.push(`Tienes deuda al ${worstDebt.rate}% TAE (€${Math.round(worstDebt.balance).toLocaleString('es')}) e inversión simultánea = pérdida matemática. Pagar esa deuda da un ${worstDebt.rate}% garantizado.`);
    }
    if (highDebt.length > 0) {
      const totalHigh  = highDebt.reduce((a,d)=>a+(d.balance||0),0);
      const monthlyInt = highDebt.reduce((a,d)=>a+(d.balance*d.rate/100/12),0);
      tips.push(`Tus deudas de alto interés te cuestan €${Math.round(monthlyInt)}/mes en intereses. €${Math.round(totalHigh).toLocaleString('es')} a liquidar antes de invertir más.`);
    }

    // 3. Tasa de ahorro baja
    if (salary > 0 && savingsRate < 10 && savingsRate >= 0)
      tips.push(`Ahorras solo el ${savingsRate}% de tu sueldo. La regla mínima es 20%. Con €${salary.toLocaleString('es')}/mes deberías apartar €${Math.round(salary*0.2).toLocaleString('es')} automáticamente el día de cobro.`);
    if (salary > 0 && savingsRate >= 40)
      tips.push(`Tasa de ahorro del ${savingsRate}%. Top 5% mundial. Sigue así y el interés compuesto hará el trabajo pesado.`);
    if (salary > 0 && savingsRate >= 20 && savingsRate < 30)
      tips.push(`Tasa del ${savingsRate}%: bien por encima del mínimo. Llegar al 30% adelantaría tu independencia financiera varios años.`);

    // 4. Fondo de emergencia
    const monthlyExpenses = Math.round(salary * 0.5 + (career.lifestyleExtra||0));
    if (cash < monthlyExpenses * 3 && salary > 0)
      tips.push(`Tienes €${cash.toLocaleString('es')} pero necesitas al menos €${(monthlyExpenses*3).toLocaleString('es')} (3 meses de gastos) antes de invertir agresivamente.`);
    if (cash >= monthlyExpenses * 6 && cashPct < 30)
      tips.push(`Fondo de emergencia sólido (${Math.round(cash/monthlyExpenses)} meses). El excedente sobre 6 meses debería estar invertido generando rentabilidad.`);

    // 5. Hipoteca vs inversión
    if (mortgage.length > 0 && invested > 5000) {
      const r = mortgage[0].rate || 3.2;
      tips.push(r < 3.5
        ? `Hipoteca al ${r}% con inversión en bolsa: matemáticamente mejor invertir (bolsa ~10% histórico vs ${r}% hipoteca).`
        : `Hipoteca al ${r}%: en el umbral. Amortizar extra ahora tiene una rentabilidad garantizada del ${r}%.`);
    }

    // 6. Diversificación
    if (holdings.length === 1 && invested > 5000)
      tips.push(`Toda la cartera en ${holdings[0]}. Un ETF MSCI World te da 1.500 empresas de golpe con la misma inversión.`);
    if (holdings.length === 0 && cash > 3000)
      tips.push(`€${cash.toLocaleString('es')} en cuenta y cero en bolsa. El S&P 500 lleva 35 años dando un 10,7% anual. ¿Cuánto más esperas?`);
    if (holdings.length >= 6)
      tips.push(`${holdings.length} activos — buena diversificación. Cada posición debería tener una tesis clara.`);

    // 7. FIRE
    if (firePct >= 100)
      tips.push(`🔥 Tu patrimonio supera tu número FIRE. La regla del 4% te da €${Math.round(patrimony*0.04/12).toLocaleString('es')}/mes de por vida.`);
    else if (firePct >= 75)
      tips.push(`${firePct}% del FIRE alcanzado. Recta final. Cada aportación ahora tiene más impacto por el compuesto acumulado.`);
    else if (firePct >= 50)
      tips.push(`Al ${firePct}% del FIRE. La segunda mitad se construye más rápido — el compuesto ya trabaja.`);
    else if (firePct >= 25)
      tips.push(`${firePct}% hacia el FIRE. Con €${(S.monthlyContribution||0).toLocaleString('es')}/mes el compuesto empieza a ser tu mejor empleado.`);

    // 8. Dividendos
    if (divIncome > 0 && salary > 0 && divIncome < salary * 0.1)
      tips.push(`Cobras ~€${divIncome.toLocaleString('es')}/año en dividendos — el ${Math.round(divIncome/12/Math.max(1,salary)*100)}% de tu sueldo como ingreso pasivo.`);
    if (salary > 0 && divIncome >= salary * 0.5)
      tips.push(`🎯 Dividendos de €${divIncome.toLocaleString('es')}/año: cubren el ${Math.round(divIncome/12/Math.max(1,salary)*100)}% de tu sueldo. Libertad real en construcción.`);

    // 9. Carrera
    if (career.id === 'intern' && gameYear >= 2)
      tips.push(`${gameYear} años de becario. El salto a Junior cambia tus posibilidades de ahorro significativamente.`);
    if (career.id === 'senior' && (career.lifestyleExtra||0) > 0 && savingsRate < 25)
      tips.push(`Lifestyle creep detectado: €${career.lifestyleExtra}/mes de gasto estructural extra. Con tu sueldo, el 25% de ahorro es el mínimo razonable.`);
    if (career.id === 'entrepreneur' && bizIncome < 1000)
      tips.push(`Emprendedor con €${bizIncome}/mes de negocios. Zona peligrosa — necesitas 12 meses de gastos en reserva.`);

    // 10. Educación
    if (mods < 5 && gameYear >= 2)
      tips.push(`${mods} módulos en ${gameYear} años de juego. El conocimiento financiero es el activo más seguro.`);
    if (mods >= 20 && mods < 50)
      tips.push(`${mods} módulos — superas al 85% en educación financiera. Ahora aplícalo.`);
    if (mods >= 50)
      tips.push(`${mods} módulos. Nivel experto. ¿Cómo refleja tu cartera real lo que has aprendido?`);

    // 11. Negocios
    const bizCount = Object.keys(S.businesses||{}).length;
    if (bizCount === 0 && salary > 2000 && cash > 5000)
      tips.push(`€${cash.toLocaleString('es')} en cash y €${salary.toLocaleString('es')}/mes: tienes base para lanzar un negocio con ingresos sin techo.`);
    if (bizCount >= 2 && salary > 0 && bizIncome > salary)
      tips.push(`Tus negocios (€${bizIncome.toLocaleString('es')}/mes) ya superan tu sueldo. El active income deja de ser el centro.`);

    // 12. Racha
    if (streak >= 30 && mods >= 10)
      tips.push(`${streak} días de racha y ${mods} módulos: la consistencia bate al talento en finanzas.`);
    if (streak === 0 && mods > 0)
      tips.push(`La racha se ha roto. Los hábitos financieros funcionan igual que el interés compuesto: la consistencia es todo. Hoy es el día.`);

    // 13. Crypto concentración
    const cryptoH = holdings.filter(t => ['BTC','ETH'].includes(t));
    if (cryptoH.length > 0 && invested > 0) {
      const cryptoVal = cryptoH.reduce((s,t) => {
        const q = (S.portfolio[t]?.shares||0);
        const p = (GAME.stockPrices&&GAME.stockPrices[t]) || (STOCKS?.find(x=>x.ticker===t)?.price||0);
        return s + q*p;
      }, 0);
      const cryptoPct = Math.round(cryptoVal/invested*100);
      if (cryptoPct > 20)
        tips.push(`${cryptoPct}% de la cartera en cripto — encima del 10% recomendado. Un -80% (histórico BTC) sería €${Math.round(cryptoVal*0.8).toLocaleString('es')} de pérdida.`);
    }

    // 14. Situación óptima
    if (tips.length === 0)
      tips.push(`Situación sólida: €${patrimony.toLocaleString('es')} de patrimonio, ahorro del ${savingsRate}%, ${mods} módulos completados. Mantén el rumbo.`);

    return tips;
  }

  function _showBubble(text) {
    if (localStorage.getItem('finai_quiet') === '1') return;
    let bubble = document.getElementById('coach-bubble');
    if (!bubble) {
      bubble = document.createElement('div');
      bubble.id        = 'coach-bubble';
      bubble.className = 'coach-bubble';
      document.body.appendChild(bubble);
    }
    bubble.innerHTML = `
      <div class="coach-avatar">🤖</div>
      <div class="coach-content">
        <div class="coach-label">FinAI</div>
        <div class="coach-text" id="coach-text"></div>
        <div style="display:flex;gap:6px;margin-top:6px;align-items:center;">
          <button class="coach-ask-btn" onclick="AI_COACH.askQuestion()">Preguntar →</button>
          <button class="coach-close" onclick="document.getElementById('coach-bubble').classList.remove('coach-visible')" style="background:none;border:none;color:rgba(255,255,255,.3);cursor:pointer;font-size:13px;padding:2px 4px;">✕</button>
          <button onclick="localStorage.setItem('finai_quiet','1');document.getElementById('coach-bubble').classList.remove('coach-visible')" style="background:none;border:none;color:rgba(255,255,255,.2);cursor:pointer;font-size:11px;padding:2px 4px;" title="No volver a mostrar">🔕</button>
        </div>
      </div>`;
    bubble.classList.add('coach-visible');

    // Typewriter effect
    const el = document.getElementById('coach-text');
    let i = 0;
    el.textContent = '';
    const iv = setInterval(() => {
      if (i < text.length) { el.textContent += text[i++]; }
      else clearInterval(iv);
    }, 18);

    // Auto-hide after 14s
    setTimeout(() => bubble?.classList.remove('coach-visible'), 14000);
  }

  function proactiveCheck() {
    const now = Date.now();
    if (now - _lastAdviceTime < COOLDOWN_MS) return;
    if (!S.userName) return;
    _lastAdviceTime = now;
    const tips = _prioritizeTips(_analyze());
    const situation = _detectSituation();
    let tip;
    if (situation === 'thriving')
      tip = tips.find(t=>t.includes('FIRE')||t.includes('dividendo')||t.includes('módulo')) || tips[0];
    else if (situation === 'struggling')
      tip = tips.find(t=>t.includes('deuda')||t.includes('emergencia')||t.includes('cash')||t.includes('interés')) || tips[0];
    else
      tip = tips[0];
    setTimeout(() => _showBubble(tip), 1800);
  }

  // ── 30 preguntas reales con respuestas dinámicas ─────────────
  const ALL_QUESTIONS = [
    { q:'¿Debería amortizar hipoteca o invertir?', fn:()=>{
      const m=(S.mortgages||[]).find(x=>!x.paid);
      if(!m) return '🏠 Sin hipoteca activa. Invierte el máximo en renta variable — el tiempo en el mercado vence al timing perfectamente.';
      const r=m.rate||3.2;
      const alt=[
        r<3.5?`Tu hipoteca está al ${r}%. La bolsa da ~10% histórico. Matemáticamente, invertir gana. Pero la paz mental de no deber también tiene valor.`
             :`Con hipoteca al ${r}% amortizar renta casi lo mismo que la bolsa, sin riesgo. Considera 50/50.`,
        r<3.5?`Un ${r}% de interés hipotecario es dinero barato. Cada euro que inviertes en lugar de amortizar genera ~6% más de retorno esperado a largo plazo.`
             :`Hipoteca al ${r}%: en el límite del break-even vs bolsa. Si te queda mucho plazo, amortiza para reducir exposición al riesgo de tipos.`,
      ];
      return alt[Math.floor(Math.random()*alt.length)];
    }},
    { q:'¿Estoy ahorrando suficiente?', fn:()=>{
      const sal=S.lifeSalary||1800; const sr=Math.round((S.monthlyContribution||0)/sal*100);
      const alts=[
        sr>=20?`✅ ${sr}% de tasa de ahorro. Estás en el top 20% de ahorradores. Con €${(S.monthlyContribution||0).toLocaleString('es')}/mes y 30 años de interés compuesto, el resultado es contundente.`
              :`❌ Solo el ${sr}%. Necesitas al menos 20% (€${Math.round(sal*.2).toLocaleString('es')}/mes). Automatízalo el día de cobro — lo que no ves, no lo gastas.`,
        sr>=20?`Tasa del ${sr}% — excelente. La regla dice 20%, tú superas eso. Cada punto porcentual adicional reduce años de trabajo activo significativamente.`
              :`${sr}% de ahorro cuando el mínimo es 20%. Tienes una brecha de €${Math.round(sal*.2-(S.monthlyContribution||0)).toLocaleString('es')}/mes. Revisa qué suscripciones o gastos puedes eliminar.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo llego antes al FIRE?', fn:()=>{
      const sal=S.lifeSalary||1800; const fire=sal*.6*12*25;
      const diff=Math.max(0,fire-(S.patrimony||0));
      const pct=Math.round((S.patrimony||0)/fire*100);
      const alts=[
        `Tu FIRE number es €${Math.round(fire).toLocaleString('es')}. Vas por el ${pct}%. Los tres aceleradores: ganar más, gastar menos, invertir antes. Cada €100/mes extra equivale a ~2 años menos de trabajo.`,
        `Con €${Math.round(diff).toLocaleString('es')} por delante para el FIRE, el tiempo es tu palanca más potente. Aumentar la tasa de ahorro un 5% reduce el plazo más que doblar el sueldo manteniendo el mismo estilo de vida.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué hago con mi deuda?', fn:()=>{
      const ds=S.debts||[];
      if(!ds.length){
        const alts=['Sin deudas. Toda tu capacidad de ahorro puede ir directamente a inversión. Esa es una ventaja enorme — mantenla.','Limpio de deudas. El siguiente paso: construir el fondo de emergencia si no lo tienes y luego invertir sistemáticamente.'];
        return alts[Math.floor(Math.random()*alts.length)];
      }
      const worst=[...ds].sort((a,b)=>b.rate-a.rate)[0];
      const totalInt=Math.round(ds.reduce((s,d)=>s+(d.balance*d.rate/100/12),0));
      const alts=[
        `Avalanche: ataca ${worst.name} al ${worst.rate}% primero. Te cuesta €${totalInt}/mes en intereses ahora mismo — dinero regalado al banco.`,
        `Tienes €${totalInt}/mes yendo a intereses. Cada euro extra que pongas en tu deuda más cara (${worst.name} al ${worst.rate}%) genera un retorno garantizado del ${worst.rate}%.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cuánto tengo en cada inversión?', fn:()=>{
      const h=Object.entries(S.portfolio||{}).filter(([,q])=>q>0);
      if(!h.length){
        const alts=['Cartera vacía. Empieza con un ETF global (MSCI World o S&P 500). Diversificación instantánea en 1.500+ empresas.','Sin posiciones. VUSA o IWDA como primer ETF es el punto de entrada más sensato. Complejidad cero, diversificación máxima.'];
        return alts[Math.floor(Math.random()*alts.length)];
      }
      const total=h.reduce((s,[t,q])=>{const p=GAME.stockPrices[t]||(STOCKS.find(x=>x.ticker===t)?.price||0);return s+q*p;},0);
      const breakdown=h.map(([t,q])=>{const p=GAME.stockPrices[t]||(STOCKS.find(x=>x.ticker===t)?.price||0);const v=q*p;return `${t} ${Math.round(v/total*100)}%`;}).join(' · ');
      return `Cartera €${Math.round(total).toLocaleString('es')}: ${breakdown}. ${h.length===1?'Concentrada en un activo — considera diversificar.':h.length>=5?'Buena diversificación por activos.':''}`;
    }},
    { q:'¿Cuándo podré jubilarme?', fn:()=>{
      const sal=S.lifeSalary||1800; const expenses=sal*.6*12;
      const fire=expenses*25; const pat=S.patrimony||0;
      const monthlyInvest=S.monthlyContribution||0;
      if(monthlyInvest<=0) return 'Sin aportaciones mensuales configuradas. Define cuánto inviertes al mes para calcular tu proyección de jubilación.';
      const r=((S.expectedReturn||7)/100)/12;
      let acc=pat; let months=0;
      while(acc<fire&&months<600){acc=acc*(1+r)+monthlyInvest;months++;}
      const years=Math.round(months/12);
      const retireAge=(S.lifeAge||25)+years;
      return months>=600?`Con las aportaciones actuales (€${monthlyInvest}/mes) el objetivo FIRE (€${Math.round(fire).toLocaleString('es')}) no es alcanzable en 50 años. Necesitas invertir más o reducir gastos futuros previstos.`
        :`Con €${monthlyInvest.toLocaleString('es')}/mes alcanzas el FIRE en ~${years} años (a los ~${retireAge} años). Cada €100 extra al mes recorta el plazo.`;
    }},
    { q:'¿Tengo fondo de emergencia suficiente?', fn:()=>{
      const sal=S.lifeSalary||1800; const career=getCurrentCareer?.();
      const lifestyle=career?.lifestyleExtra||0;
      const monthlyExpenses=Math.round(sal*.5+lifestyle);
      const needed3=monthlyExpenses*3; const needed6=monthlyExpenses*6;
      const cash=S.cash||0;
      const alts=[
        cash>=needed6?`✅ Con €${cash.toLocaleString('es')} cubres ${Math.round(cash/monthlyExpenses)} meses de gastos. Fondo de emergencia sólido. Todo lo que supere 6 meses debería ir a inversión.`
        :cash>=needed3?`⚠️ Tienes ${Math.round(cash/monthlyExpenses)} meses de cobertura. Lo mínimo son 3, lo ideal son 6 (€${needed6.toLocaleString('es')} en tu caso). Sigue construyendo antes de invertir más.`
        :`❌ Solo ${Math.round(cash/monthlyExpenses*10)/10} meses de cobertura. Necesitas €${needed3.toLocaleString('es')} mínimo antes de invertir en renta variable. Un imprevisto te obligaría a vender en el peor momento.`,
        cash>=needed6?`Fondo de emergencia: ${Math.round(cash/monthlyExpenses)} meses. Excelente. El objetivo oficial es 3-6 meses; tú lo superas.`
        :`Con €${cash.toLocaleString('es')} y gastos mensuales de ~€${monthlyExpenses.toLocaleString('es')}, tienes ${(cash/monthlyExpenses).toFixed(1)} meses de cobertura. El mínimo es 3, el ideal 6.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué ETF debería comprar?', fn:()=>{
      const invested=S.invested||0;
      const h=Object.keys(S.portfolio||{}).filter(k=>S.portfolio[k]>0);
      const alts=[
        invested<5000?'Para empezar: VUSA (S&P 500) o IWDA (MSCI World). Comisiones mínimas, liquidez máxima. Diversificación automática en 500-1.500 empresas globales.'
        :h.length<=2?`Tienes €${invested.toLocaleString('es')} invertidos en ${h.length} activo(s). Considera añadir EMIM (mercados emergentes) para completar la cobertura global.`
        :`Con €${invested.toLocaleString('es')} en ${h.length} activos ya tienes buena base. Mantener y aportar sistemáticamente bate a cualquier estrategia activa estadísticamente.`,
        'Los ETFs de acumulación (Acc) reinvierten dividendos automáticamente — más eficientes fiscalmente en España que los de distribución. VWCE y IWDA son los más populares entre inversores españoles.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo diversifico mejor?', fn:()=>{
      const h=Object.entries(S.portfolio||{}).filter(([,q])=>q>0);
      const hasCrypto=h.some(([t])=>['BTC','ETH'].includes(t));
      const hasStocks=h.some(([t])=>!['BTC','ETH','GOLD'].includes(t));
      if(!h.length) return 'Sin inversiones aún. La diversificación empieza con un ETF global — 1 solo producto que ya diversifica en 1.500 empresas de 23 países.';
      const alts=[
        `Diversificación real = activos que no se mueven juntos. Acciones + Bonos + Inmobiliario (REITs) + algo de cash. ${hasCrypto?'Tienes cripto: máximo 5% de la cartera por su volatilidad.':'Considera añadir un fondo de bonos cuando te acerques a la jubilación.'}`,
        `${h.length} activos en cartera. La diversificación por geografía (Europa, EE.UU., emergentes) y sector (tecnología, salud, consumo) reduce el riesgo sin reducir rentabilidad esperada.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Vale la pena un plan de pensiones?', fn:()=>{
      const sal=S.lifeSalary||1800;
      const anual=sal*12;
      const deduccion=Math.min(1500,anual*.3);
      const tipo=anual>60000?0.45:anual>35200?0.37:anual>20200?0.30:0.19;
      const ahorro=Math.round(deduccion*tipo);
      const alts=[
        `Con tu sueldo de €${sal.toLocaleString('es')}/mes, aportar el máximo a plan de pensiones (€${deduccion.toLocaleString('es')}/año) te ahorra ~€${ahorro.toLocaleString('es')} en IRPF este año. Es una rentabilidad garantizada del ${Math.round(tipo*100)}% inmediata.`,
        `El plan de pensiones en España: deducción fiscal de hasta €1.500/año. Con tipo marginal del ${Math.round(tipo*100)}%, cada €1.500 aportados te ahorran €${Math.round(1500*tipo)} en la renta. Dinero gratis del fisco.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cuánto me cuesta la inflación?', fn:()=>{
      const cash=S.cash||0; const invested=S.invested||0;
      const inflacion=0.035;
      const perdidaCash=Math.round(cash*inflacion/12);
      const perdidaAnual=Math.round(cash*inflacion);
      const alts=[
        `Con €${cash.toLocaleString('es')} en cash, la inflación del 3.5% te roba €${perdidaCash}/mes (€${perdidaAnual}/año) en poder adquisitivo. Ese dinero desaparece sin que lo veas.`,
        `€${cash.toLocaleString('es')} parados = €${perdidaAnual}/año de poder adquisitivo perdido por inflación. ${invested>0?`Tus €${invested.toLocaleString('es')} invertidos al menos combaten la inflación.`:'Sin inversiones, la inflación gana por goleada.'}`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo negocio un aumento de sueldo?', fn:()=>{
      const sal=S.lifeSalary||1800;
      const objetivo=Math.round(sal*1.2);
      const alts=[
        `Para negociar el sueldo de €${sal.toLocaleString('es')} a €${objetivo.toLocaleString('es')} (+20%): 1) Documenta logros con números. 2) Investiga el mercado (Glassdoor, LinkedIn). 3) Pide reunión específica para ello. 4) Empieza por arriba del objetivo real.`,
        `Script probado: "He investigado el mercado y para mi perfil el rango es €${Math.round(sal*1.15).toLocaleString('es')}-€${Math.round(sal*1.25).toLocaleString('es')}. ¿Podemos hablarlo?" — nunca seas tú quien diga el número primero.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Criptomonedas sí o no?', fn:()=>{
      const pat=S.patrimony||0;
      const maxCrypto=Math.round(pat*0.05);
      const h=Object.entries(S.portfolio||{}).filter(([t,q])=>['BTC','ETH'].includes(t)&&q>0);
      const cryptoVal=h.reduce((s,[t,q])=>{const p=GAME.stockPrices[t]||(STOCKS.find(x=>x.ticker===t)?.price||0);return s+q*p;},0);
      const cryptoPct=pat>0?Math.round(cryptoVal/pat*100):0;
      const alts=[
        cryptoPct>10?`Tienes el ${cryptoPct}% en cripto. Por encima del 5-10% recomendado para activos especulativos. Alta correlación y volatilidad —considera rebalancear.`
        :cryptoPct>0?`${cryptoPct}% en cripto — dentro del rango aceptable (<10%). Si crees en el activo, manten. Si no lo entiendes, reduce.`
        :`Sin cripto. El 5% máximo de la cartera en BTC es lo que recomienda la mayoría de gestores. Ni más ni menos. Y solo si entiendes lo que compras.`,
        'Bitcoin tiene 15 años de historia. Ha caído >80% tres veces y se ha recuperado las tres. Es el activo más volátil y más rentable de la última década. Todo en el mismo paquete.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué hago si pierdo el trabajo?', fn:()=>{
      const cash=S.cash||0; const sal=S.lifeSalary||1800;
      const months=sal>0?Math.round(cash/(sal*.6)):0;
      const alts=[
        `Con €${cash.toLocaleString('es')} en cash y gastos de ~€${Math.round(sal*.6).toLocaleString('es')}/mes tienes ${months} meses de cobertura. ${months>=6?'Margen cómodo para buscar trabajo sin presión.':months>=3?'Mínimo suficiente. Prioriza buscar trabajo.':'Margen crítico — activa el modo ahorro extremo desde el día 1.'}`,
        `Protocolo de emergencia laboral: 1) No toques las inversiones si puedes evitarlo. 2) Reduce gastos al mínimo vital. 3) Activa prestación por desempleo inmediatamente. 4) Red de contactos: el 80% de empleos se consiguen por networking.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo ahorrar con sueldo bajo?', fn:()=>{
      const sal=S.lifeSalary||1800;
      const min20=Math.round(sal*.2);
      const min10=Math.round(sal*.1);
      const alts=[
        `Con €${sal.toLocaleString('es')}/mes, el 10% son €${min10.toLocaleString('es')}/mes. Empieza ahí. Automatiza ese ingreso el día de cobro. En 3 meses no lo echarás de menos y habrás ahorrado €${(min10*3).toLocaleString('es')}.`,
        `Sueldo bajo no significa no poder ahorrar. Significa que los pequeños cambios de gasto tienen más impacto: cancelar 2 suscripciones (€30), comer de tupper 3 días/semana (€60), revisar seguro de móvil (€15) = €${105}/mes sin grandes sacrificios.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el interés compuesto realmente?', fn:()=>{
      const mc=S.monthlyContribution||200;
      const simFn=(monthly,rate,years)=>{let acc=0;const mr=rate/100/12;for(let i=0;i<years*12;i++){acc=(acc+monthly)*(1+mr);}return Math.round(acc);};
      const v10=simFn(mc,7,10); const v30=simFn(mc,7,30);
      const alts=[
        `Con €${mc}/mes al 7% anual: en 10 años tienes €${v10.toLocaleString('es')}. En 30 años: €${v30.toLocaleString('es')}. La diferencia no es proporcional — es exponencial. Los últimos 10 años generan más que los primeros 20.`,
        `Interés compuesto: ganas interés sobre el interés. €10.000 al 7% = €700 el año 1. Pero el año 30 genera €7.600 de interés anual sobre el mismo capital inicial. El dinero se auto-acelera.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cuánto gano realmente con mis inversiones?', fn:()=>{
      const invested=S.invested||0;
      if(!invested) return 'Sin inversiones activas. No hay retorno que calcular. Cada día sin invertir es interés compuesto que pierdes.';
      const ret=((S.expectedReturn||7)/100);
      const monthlyReturn=Math.round(invested*ret/12);
      const alts=[
        `Con €${invested.toLocaleString('es')} invertidos al ${S.expectedReturn||7}% esperado, generas ~€${monthlyReturn.toLocaleString('es')}/mes en rentabilidad (no realizada). Ese dinero trabaja sin que hagas nada.`,
        `Tu cartera de €${invested.toLocaleString('es')} a largo plazo: €${Math.round(invested*Math.pow(1+(S.expectedReturn||7)/100,10)).toLocaleString('es')} en 10 años, €${Math.round(invested*Math.pow(1+(S.expectedReturn||7)/100,20)).toLocaleString('es')} en 20 años. Solo dejando el dinero quieto.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Debería invertir aunque tenga poca cantidad?', fn:()=>{
      const alts=[
        'Sí, siempre. €50/mes durante 40 años al 7% = €131.000. El mismo dinero esperando 10 años para "tener más" = €65.000. El tiempo perdido no se recupera nunca.',
        'Con €1 ya puedes comprar fracciones de ETF en muchos brokers. La cantidad importa menos que el hábito. Un inversor que aporta €100/mes 30 años supera a quien aporta €1.000/mes durante 10.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Es buen momento para invertir ahora?', fn:()=>{
      const alts=[
        'El mejor momento para invertir fue hace 10 años. El segundo mejor momento es hoy. Nadie — ni los mejores gestores del mundo — sabe predecir el mercado de forma consistente.',
        'El "market timing" destruye más rentabilidad que cualquier comisión. Un estudio de Schwab demostró que incluso invertir siempre en el peor día del año supera a quedarse esperando el "momento perfecto".',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el rebalanceo de cartera?', fn:()=>{
      const alts=[
        'Rebalancear = volver a tu asignación objetivo cuando un activo crece demasiado. Si quieres 80% acciones y el bull market lo lleva al 95%, vendes acciones y compras bonos para volver al 80%. Fuerza a comprar barato y vender caro automáticamente.',
        'Frecuencia óptima de rebalanceo: anual o cuando un activo se desvía >5% del objetivo. Menos = más eficiente fiscalmente (menos eventos tributables). El rebalanceo automático de los fondos mixtos es una ventaja real.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},

    { q:'¿Qué es un ETF indexado vs fondo activo?', fn:()=>{
      const alts=[
        'Los fondos activos cobran 1,5-2,5%/año y el 90% no bate al índice en 15 años (datos SPIVA). Un ETF indexado cobra 0,07-0,25%/año y replica el mercado exactamente. La diferencia de comisión en 30 años sobre €100.000 supera €400.000 en rentabilidad perdida.',
        'Buffett apostó €1M a que ningún fondo activo batiría al S&P 500 en 10 años. Ganó fácil. La matemática es simple: si el mercado da X, los fondos activos dan X menos comisiones. Imposible ganar en media. Usa gestión pasiva.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el TER de un fondo?', fn:()=>{
      const alts=[
        'TER = Total Expense Ratio. La comisión anual total del fondo. VUSA cobra 0,07%, un fondo activo cobra 1,8%. Diferencia sobre €100.000 en 30 años: más de €500.000 en rentabilidad. El TER es el coste más importante para comparar fondos.',
        '0,07% vs 1,8% parece poca diferencia. Pero el 1,8% sobre €200.000 son €3.600/año que no se reinvierten. En 30 años con interés compuesto, esa diferencia acumulada supera el capital inicial. El coste importa más que casi cualquier otra decisión.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo tributan mis ETFs en España?', fn:()=>{
      const invested=S.invested||0; const gain=Math.round(invested*0.3);
      const tax=gain<=6000?Math.round(gain*0.19):gain<=50000?Math.round(6000*0.19+(gain-6000)*0.21):Math.round(6000*0.19+44000*0.21+(gain-50000)*0.23);
      const alts=[
        `Plusvalías de ETFs: hasta €6.000 al 19%, €6.001-€50.000 al 21%, €50.001-€200.000 al 23%, más de €200.000 al 27%. ${invested>0?`Con tus €${invested.toLocaleString('es')} invertidos, una ganancia del 30% pagaría ~€${tax.toLocaleString('es')} de impuestos al vender.`:'Mientras no vendes, no tributas. El diferimiento fiscal multiplica el interés compuesto.'}`,
        'Los ETFs de ACUMULACIÓN reinvierten dividendos sin tributar en cada pago. Solo tributas al vender. Mucho más eficiente que los de DISTRIBUCIÓN, que te obligan a declarar cada dividendo como rendimiento del capital mobiliario.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el lifestyle creep?', fn:()=>{
      const career=getCurrentCareer?.(); const lc=career?.lifestyleExtra||0;
      const alts=[
        `Lifestyle creep: cuando tu sueldo sube pero los gastos suben igual o más, quedándote financieramente igual. ${lc>0?`Tu carrera tiene €${lc.toLocaleString('es')}/mes de gasto extra. Sin control consciente, ese dinero desaparece sin construir patrimonio.`:'El antídoto: cada subida de sueldo, incrementa primero el porcentaje de ahorro, luego el gasto.'}`,
        'El directivo que gana €8.000/mes y gasta €7.800 es más pobre financieramente que el junior que gana €2.000 y ahorra €600. El lifestyle creep destruye más patrimonio que la crisis de 2008 para la mayoría de familias.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cuánto necesito para vivir de las rentas?', fn:()=>{
      const sal=S.lifeSalary||1800; const gastos=Math.round(sal*0.7*12);
      const fireNum=gastos*25; const fire4=Math.round(gastos/12);
      const alts=[
        `Con tus gastos estimados de €${gastos.toLocaleString('es')}/año, necesitas €${fireNum.toLocaleString('es')} invertidos al 4% para vivir de rentas indefinidamente. Eso genera €${fire4.toLocaleString('es')}/mes — exactamente tus gastos. Regla del 4%.`,
        `Número FIRE = gastos anuales × 25. Si gastas €${fire4.toLocaleString('es')}/mes (€${gastos.toLocaleString('es')}/año) necesitas €${fireNum.toLocaleString('es')} invertidos. Con ese capital, retiras el 4% anual y el dinero dura estadísticamente 30+ años.`,
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Es mejor alquilar o comprar?', fn:()=>{
      const cash=S.cash||0;
      const alts=[
        `Comprar gana si te quedas >10 años, tienes estabilidad laboral y el ratio precio/alquiler anual es <20. ${cash>=20000?'Tienes base para la entrada. Calcula si la zona tiene ratio razonable.':'Primero necesitas 20% de entrada + 10% en gastos notariales/ITP antes de plantearlo.'}`,
        'Alquilar no es tirar el dinero — pagas flexibilidad y liquidez. Comprar tiene costes del 10-15% al entrar y 6-10% al salir. El break-even real frente al alquiler es de 7-12 años según ciudad. Haz los números antes de decidir por emoción.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es un REIT?', fn:()=>{
      const alts=[
        'REIT = Real Estate Investment Trust. Un fondo que invierte en inmuebles y cotiza en bolsa. Da exposición inmobiliaria desde €100, sin hipoteca ni inquilinos. Por ley distribuyen el 90% de beneficios como dividendo. Liquidez total vs inmueble físico.',
        'Los REITs permiten invertir en oficinas, centros comerciales u hospitales con cualquier cantidad. Ventaja: liquidez y diversificación. Desventaja: más correlación con bolsa que el ladrillo físico. Acceso vía ETFs de REITs como IWDP o VNQI.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué riesgo tiene mi cartera?', fn:()=>{
      const h=Object.entries(S.portfolio||{}).filter(([,q])=>q>0);
      const total=h.reduce((s,[t,q])=>{const p=GAME.stockPrices[t]||(STOCKS.find(x=>x.ticker===t)?.price||0);return s+q*p;},0);
      const hasCrypto=h.filter(([t])=>['BTC','ETH'].includes(t));
      const cryptoVal=hasCrypto.reduce((s,[t,q])=>{const p=GAME.stockPrices[t]||(STOCKS.find(x=>x.ticker===t)?.price||0);return s+q*p;},0);
      const cryptoPct=total>0?Math.round(cryptoVal/total*100):0;
      if(!h.length) return 'Sin cartera: riesgo de mercado cero, pero riesgo de inflación alto. Todo en cash pierde poder adquisitivo cada año.';
      const alts=[
        `${h.length} posiciones, €${Math.round(total).toLocaleString('es')} total. ${cryptoPct>20?`⚠️ ${cryptoPct}% en cripto — riesgo muy alto. Un crash del 80% (histórico en BTC) supondría €${Math.round(total*cryptoPct/100*0.8).toLocaleString('es')} de pérdida.`:cryptoPct>0?`${cryptoPct}% en cripto — exposición especulativa presente.`:'Sin cripto — perfil de riesgo moderado.'}`,
        `Con €${Math.round(total).toLocaleString('es')} en cartera, un crash del 40% (como 2008) implica €${Math.round(total*0.4).toLocaleString('es')} de caída temporal. La pregunta clave: ¿mantienes sin vender con esa pérdida sobre el papel?`,
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el Euríbor?', fn:()=>{
      const mort=(S.mortgages||[]).find(x=>!x.paid&&(x.type||'variable')==='variable');
      const alts=[
        `El Euríbor es el tipo al que los bancos europeos se prestan entre sí. La mayoría de hipotecas variables en España = Euríbor + diferencial. ${mort?`Si el Euríbor sube 1%, tu cuota sube ~€${Math.round((mort.principal||100000)*0.01/12)}/mes.`:'Pasó del -0,5% (2022) al 4,2% (2023). Diferencia en €200.000 a 30 años: +€400/mes.'}`,
        'El Euríbor llegó a -0,5% en 2021 (cuotas mínimas históricas) y al 4,2% en 2023. La diferencia en cuota mensual para €200.000 a 30 años supera €400/mes. Por eso la hipoteca fija da certeza a cambio de pagar algo más al inicio.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el MSCI World?', fn:()=>{
      const alts=[
        'MSCI World: ~1.500 empresas de 23 países desarrollados. EEUU 69%, Europa 15%, Japón 6%. Un ETF que lo replique (IWDA) da exposición global automática con TER de 0,2%. Ha dado ~10,5% anual de media en los últimos 30 años.',
        'MSCI World vs ACWI: World solo incluye países desarrollados. ACWI añade mercados emergentes (China, India, Brasil — 10% del índice). VWCE replica el ACWI. Para la mayoría de inversores a largo plazo, cualquiera de los dos es excelente punto de partida.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el coste de oportunidad?', fn:()=>{
      const cash=S.cash||0; const lost=Math.round(cash*0.07/12);
      const alts=[
        `Coste de oportunidad = lo que dejas de ganar por elegir una opción. ${cash>3000?`Tus €${cash.toLocaleString('es')} en cash tienen un coste de ~€${lost.toLocaleString('es')}/mes (lo que ganarían al 7% en bolsa que no estás ganando).`:'Cada euro en cash pierde frente a invertirlo. El coste no es visible, pero es tan real como cualquier gasto.'}`,
        'Coste de oportunidad del efectivo: al 7% histórico de la bolsa, €10.000 sin invertir 10 años = €9.672 de retorno perdido. No aparece en ningún extracto bancario, pero se acumula en silencio año tras año.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué son los Dividend Aristocrats?', fn:()=>{
      const alts=[
        'Dividend Aristocrats: empresas del S&P 500 con 25+ años consecutivos aumentando su dividendo. ~65 empresas: Coca-Cola, J&J, Procter & Gamble... La selección elimina empresas frágiles automáticamente — una empresa en problemas recorta el dividendo antes de 25 años.',
        'Invertir en Dividend Aristocrats da: dividendo creciente (anti-inflación), empresas con moat probado y menor volatilidad que el mercado general. El trade-off: menor crecimiento de precio que tecnológicas en mercados alcistas. Perfectas para inversores que buscan renta pasiva creciente.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo protejo mi patrimonio de la inflación?', fn:()=>{
      const pat=S.patrimony||0; const cash=S.cash||0;
      const cashPct=pat>0?Math.round(cash/pat*100):100; const perdida=Math.round(cash*0.035);
      const alts=[
        `Activos anti-inflación: acciones (empresas suben precios), inmobiliario (rentas suben con IPC), oro, bonos ligados a inflación (TIPS). ${cashPct>40?`Con el ${cashPct}% en cash, la inflación te roba €${perdida.toLocaleString('es')}/año en poder adquisitivo.`:'Tu cartera con activos reales combate la inflación activamente.'}`,
        `La inflación del 3,5% sobre €${(cash||10000).toLocaleString('es')} son €${Math.round((cash||10000)*0.035).toLocaleString('es')}/año desaparecidos. En 20 años sin invertir, €100.000 valen €50.000 en términos reales. Única defensa: activos reales.`,
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cuándo debo vender una inversión?', fn:()=>{
      const alts=[
        'Razones VÁLIDAS para vender: tu tesis de inversión ha cambiado, el activo supera tu % objetivo (rebalanceo), o necesitas el dinero planificado. Razón INVÁLIDA: "ha bajado y me da pánico" o "ha subido mucho y quiero asegurar". Esas decisiones emocionales destruyen rentabilidad.',
        '"El mercado transfiere riqueza de los impacientes a los pacientes" — Buffett. Vende solo si el negocio o activo ha cambiado fundamentalmente, no si el precio fluctúa. Las fluctuaciones son ruido; el valor a largo plazo es la señal.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo funciona la tarjeta revolving?', fn:()=>{
      const alts=[
        'Las tarjetas revolving cobran 22-28% TAE — el crédito más caro legalmente. Con €2.000 al 24% TAE pagando el mínimo de €60/mes: tardas 4 años en pagar y los intereses totales son €800 — un 40% extra. Es la trampa financiera número uno en España.',
        '⚠️ Revolving = veneno financiero. €1.000 en revolving al 24% = €240/año en intereses puros. Cancélala antes de cualquier inversión. No hay bolsa que compense un 24% garantizado de coste.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es la regla del 4%?', fn:()=>{
      const sal=S.lifeSalary||1800; const gastos=Math.round(sal*0.7);
      const fire=gastos*12*25;
      const alts=[
        `La regla del 4%: si tienes suficiente capital invertido, puedes retirar el 4% anual indefinidamente (con alta probabilidad de que el dinero dure 30+ años). Con tus gastos estimados de €${gastos.toLocaleString('es')}/mes necesitas €${fire.toLocaleString('es')} invertidos.`,
        'La regla del 4% viene del estudio Trinity (1998): carteras 60% acciones / 40% bonos han sobrevivido 30+ años con retiradas del 4% anual en el 95% de períodos históricos. Es el fundamento del movimiento FIRE.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el VWCE?', fn:()=>{
      const alts=[
        'VWCE (Vanguard FTSE All-World Acc): ~3.700 empresas de 47 países desarrollados + emergentes. TER 0,22%. Acumulación = reinvierte dividendos automáticamente. Es literalmente "compra el mundo entero" en un producto. El ETF más popular entre inversores europeos a largo plazo.',
        'VWCE vs IWDA: VWCE incluye emergentes (China, India, Brasil — ~10% del fondo). IWDA solo países desarrollados, TER 0,20%. Para la mayoría de inversores a largo plazo la diferencia es mínima. Ambos son excelentes opciones de cartera núcleo.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es la cartera permanente?', fn:()=>{
      const alts=[
        'Harry Browne: 25% acciones + 25% bonos largos + 25% oro + 25% cash. Desde 1972 da ~8% anual con caída máxima del -12%. Cada cuadrante protege en un escenario distinto: acciones (crecimiento), bonos (deflación), oro (inflación), cash (recesión). Rebalanceo anual.',
        '25/25/25/25. Suena aburrida, lo es. Pero ha sobrevivido stagflación, crisis del petróleo, 2008 y COVID. Rentabilidad moderada, volatilidad mínima. Perfecta para quienes priorizan proteger sobre multiplicar.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo funciona la amortización anticipada?', fn:()=>{
      const mort=(S.mortgages||[]).find(x=>!x.paid);
      if(!mort) return 'Sin hipoteca activa. Para el futuro: negocia la comisión por amortización anticipada a 0% cuando firmes — es negociable y puede ahorrarte miles.';
      const alts=[
        `Cada €1.000 que amortizas anticipadamente reduce el capital pendiente y por tanto los intereses futuros. ${(mort.rate||3)>3.5?'Con tu tipo actual, amortizar tiene sentido matemático claro.':'Con tipo bajo, la bolsa históricamente supera al ahorro en intereses hipotecarios.'} Dos opciones: reducir plazo (ahorras más) o reducir cuota (más flexibilidad mensual).`,
        'Amortizar plazo vs cuota: si reduces plazo, pagas lo mismo pero acabas antes y ahorras más intereses totales. Si reduces cuota, liberas cash mensual pero el ahorro en intereses es menor. Si tienes estabilidad laboral: reduce plazo.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el ratio PER?', fn:()=>{
      const alts=[
        'PER = Precio / Beneficio por acción. Si una empresa cotiza a €100 y gana €7/acción, su PER es 14,3 — pagas 14,3 años de beneficios actuales. Histórico S&P 500: PER medio 15-17. Por encima de 25-30 empieza a ser caro salvo crecimiento extraordinario justificado.',
        'PER 10 = barato (o empresa en declive). PER 20 = valoración normal. PER 40+ = expectativas de crecimiento altísimas (arriesgado si no se cumplen). NVIDIA llegó a PER 70 en 2024. El contexto de tipos de interés también importa: con tipos altos, el PER razonable es menor.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cuánto cobra un broker en España?', fn:()=>{
      const alts=[
        'Brokers recomendados para ETFs en España: Interactive Brokers (0,05% mín €1), Trade Republic (€1 fijo), DeGiro (€0 en ETFs seleccionados + €1/trimestre). Evita bancos tradicionales — cobran 0,25-0,5% por operación, hasta 50× más que los brokers low-cost.',
        'El coste del broker importa más de lo que parece. €300/mes en ETF durante 30 años: con 0,1% de comisión acumulas €12.000 más que con 0,5%. Los brokers low-cost han democratizado la inversión — no tiene sentido usar los caros.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué son los fondos de inversión indexados?', fn:()=>{
      const alts=[
        'Un fondo indexado replica un índice (S&P 500, MSCI World) automáticamente sin gestor activo. Comisiones mínimas (0,05-0,3%/año), diversificación instantánea, sin necesidad de análisis. John Bogle (Vanguard) los inventó en 1976 y democratizó la inversión.',
        'La diferencia entre fondo indexado y ETF es operativa: el fondo se compra al NAV del día, el ETF cotiza en bolsa en tiempo real. En España los fondos indexados permiten traspaso sin tributar — ventaja fiscal relevante para rebalanceos.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es la diversificación temporal (DCA)?', fn:()=>{
      const mc=S.monthlyContribution||200;
      const alts=[
        `DCA = invertir €${mc.toLocaleString('es')}/mes pase lo que pase, sin mirar el precio. En meses malos compras más unidades. En meses buenos, menos. El coste promedio mejora sistemáticamente sin necesidad de predecir el mercado. El 95% de inversores debería usar DCA.`,
        'Un estudio de Vanguard: inversión de golpe vs DCA en períodos de 10 años. La de golpe ganó en 2/3 de períodos (el mercado sube más tiempo del que baja). Pero DCA reduce ansiedad y el riesgo de comprar justo antes de un crash. Para la mayoría: DCA automático y olvidarse.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo construyo una cartera desde cero?', fn:()=>{
      const cash=S.cash||0; const inv=S.invested||0;
      const alts=[
        `Cartera desde cero en 4 pasos: 1) Fondo de emergencia (3-6 meses de gastos). ${cash>3000?'✅ Tienes algo de base.':'Primero esto.'} 2) ETF core global (VWCE o IWDA — 80-90% de la cartera). 3) Aportaciones automáticas mensuales. 4) No tocar en 10+ años.`,
        'La cartera más sencilla que funciona: 100% VWCE o IWDA. Un ETF. 3.700 empresas de 47 países. Aportación automática mensual. Revisión anual. El 90% de los "portfolios complejos" de 15 activos tienen peor rentabilidad ajustada al riesgo.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el impuesto de sucesiones?', fn:()=>{
      const pat=S.patrimony||0;
      const alts=[
        `El impuesto de sucesiones en España varía mucho por comunidad autónoma: Madrid y Canarias casi lo han eliminado (<1% efectivo). Cataluña y Asturias pueden llegar al 34%. Con un patrimonio de €${pat.toLocaleString('es')}, la planificación sucesoria puede ahorrar decenas de miles a tus herederos.`,
        'Estrategias legales para reducir sucesiones: donaciones en vida (reducción del 95% en algunos casos), seguros de vida (quedan fuera de la herencia), SL familiar (valoración reducida), testamento optimizado. Consulta un asesor fiscal cuando el patrimonio supere €200.000.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es un fondo indexado?', fn:()=>{
      const alts=[
        'Un fondo indexado replica un índice (S&P 500, MSCI World) comprando todas sus empresas en proporción. Sin gestor que decida, sin análisis — solo seguir el mercado. Resultado: bate al 85% de los fondos activos a 15 años, con comisiones 10 veces menores.',
        'Vanguard, fundada por John Bogle en 1975, demostró que los fondos indexados baten sistemáticamente a los gestores activos. Hoy gestionan más de $8 billones. La revolución silenciosa de las finanzas personales.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es la diversificación real?', fn:()=>{
      const alts=[
        'Diversificación real ≠ tener muchas acciones del mismo sector. MSCI World = 23 países · 1.500 empresas · 11 sectores. Eso es diversificación. 10 empresas tecnológicas españolas no lo es. Busca activos que se muevan de forma diferente entre sí.',
        'La correlación lo es todo. En 2022 acciones y bonos cayeron juntos (correlación 1). En otros crashs, los bonos subieron. La diversificación funciona cuando los activos tienen correlación baja o negativa entre sí, no por tener muchos.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Dónde guardo el fondo de emergencia?', fn:()=>{
      const alts=[
        'El fondo de emergencia debe estar en: 1) Cuenta remunerada (Revolut, Trade Republic: 3-4% TAE), 2) Letras del Tesoro a 3-6 meses (4% sin riesgo), 3) Fondo monetario. NUNCA en bolsa ni en fondos con riesgo. Debe estar disponible en 24-48h.',
        'Trade Republic paga actualmente ~4% TAE en cuenta corriente sin plazo. Revolut hasta 4,5% para suscriptores premium. Las letras del Tesoro español a 3 meses han dado 3,5-4% en 2024. Tres opciones sólidas para tu fondo de emergencia.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué broker usar en España?', fn:()=>{
      const alts=[
        'Para ETFs e indexación en España: MyInvestor (sin mínimo, amplio catálogo), DEGIRO (muy barato para bolsa directa), Interactive Brokers (el mejor para carteras grandes). Evita los brokers de banco tradicional — sus comisiones pueden ser 10-20 veces más caras.',
        'Criterios para elegir broker: 1) Regulado por CNMV/ESMA (seguridad). 2) Comisiones de compra-venta. 3) Custodia anual (muchos cobran 0%). 4) Catálogo de fondos y ETFs. 5) Facilidad de uso. Para empezar: MyInvestor o Trade Republic tienen todo.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo funciona la bolsa en un crash?', fn:()=>{
      const alts=[
        'En un crash: 1) Cae el precio porque más gente vende que compra. 2) Los margin calls fuerzan ventas automáticas. 3) Los medios amplifican el pánico. 4) Los inversores emocionales venden en el peor momento. 5) Los inversores disciplinados compran barato. El crash es una transferencia de riqueza de los impacientes a los pacientes.',
        'Los crashes más grandes de la historia: 1929 (-86%), 1973 (-48%), 2000 (-49%), 2008 (-56%), 2020 (-34%). En todos los casos el mercado se recuperó y superó los máximos anteriores. La pregunta no es si caerá, sino si estarás para la recuperación.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué pasa si quiebra mi broker?', fn:()=>{
      const alts=[
        'Si quiebra tu broker, tus activos están separados del balance del broker (son tuyos, no suyos). En España el Fondo de Garantía de Inversiones (FOGAIN) cubre hasta €100.000 por inversor. Para brokers europeos: el SIPC estadounidense cubre $500.000. No es lo mismo que perder el dinero.',
        'Los activos que compras en un broker (acciones, ETFs) los posees tú — el broker solo los custodia. Si quiebra Degiro o MyInvestor, tus acciones siguen siendo tuyas y se transfieren a otro custodio. Sí puedes perder dinero en efectivo no invertido por encima de €100.000.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué son los REITs?', fn:()=>{
      const alts=[
        'REITs (Real Estate Investment Trusts): empresas que poseen y gestionan inmuebles (oficinas, centros comerciales, residencias de estudiantes, hospitales). Cotizan en bolsa como acciones. Están obligadas a repartir el 90% del beneficio como dividendo. Inmobiliario sin hipoteca ni gestión.',
        'Ventajas REITs vs piso en alquiler: diversificación instantánea en cientos de inmuebles, liquidez total (vendes en segundos), sin gestión de inquilinos, inversión desde €10, dividendos periódicos. Desventaja: correlación alta con la bolsa en los crashes. Excelente para el 5-10% de una cartera.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo afecta el tipo de cambio a mis inversiones?', fn:()=>{
      const alts=[
        'Si inviertes en ETFs del S&P 500 en euros, tienes exposición al dólar. Si el dólar sube vs el euro, ganas más. Si cae, ganas menos. Los ETFs con divisa cubierta (hedged) eliminan este riesgo pero cuestan ~0,5-1% anual extra. Para plazos largos (+15 años), la cobertura raramente vale la pena.',
        'El riesgo de divisa es real pero se suele sobrevalorar en inversión indexada global. Si inviertes en MSCI World, tienes exposición a 23 divisas — se diversifican entre sí. Solo si tu cartera es muy concentrada en una moneda (solo EE.UU.) tiene sentido valorar la cobertura.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es la tasa interna de retorno (TIR)?', fn:()=>{
      const alts=[
        'La TIR es la rentabilidad anualizada real de una inversión. Si compras un piso por €150.000, recibes €800/mes de alquiler y lo vendes a €180.000 en 10 años, tu TIR es ~7,3% anual. Es la métrica que permite comparar cualquier inversión en igualdad de condiciones.',
        'TIR vs rentabilidad simple: la diferencia importa. Una inversión que dobla en 10 años tiene una TIR del 7,2%. Una que dobla en 5 años tiene una TIR del 14,9%. El tiempo cambia completamente la ecuación. Siempre compara inversiones por TIR, no por retorno total.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo funciona el sistema bancario?', fn:()=>{
      const alts=[
        'Los bancos toman tu depósito (te pagan 0,5-2%) y lo prestan a otros al 4-15%. La diferencia (margen de intereses) es su beneficio. Con el dinero que depositas, prestan 9 veces más (reserva fraccionaria). Por eso los bancos son sistémicamente importantes — y por eso se rescatan.',
        'Cuando depositas €1.000 en el banco, el banco puede crear €9.000 adicionales en préstamos (con reserva del 10%). El BCE controla los tipos para regular cuánto se presta y a qué coste. Cuando el BCE sube tipos, los préstamos se encarecen y la economía se enfría — y viceversa.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},

    // ── Preguntas nuevas ─────────────────────────────────────────────
    { q:'¿Cómo controlo mi psicología en los crashes?', fn:()=>{
      const inv=S.invested||0;
      const opts=[
        `Un crash del 40% sobre €${inv.toLocaleString('es')} = €${Math.round(inv*0.4).toLocaleString('es')} de caída temporal. ¿Mantendrías sin vender? Si la respuesta es no, ajusta tu exposición ahora, no durante el crash.`,
        'El inversor medio obtiene un 3,9% anual mientras el mercado da un 10,3%. La diferencia es comportamiento: vendes en mínimos por pánico y compras en máximos por euforia. Solución: DCA automático y no mirar la cartera más de una vez al mes.',
      ];
      return opts[Math.floor(Math.random()*opts.length)];
    }},
    { q:'¿Qué es el Factor Investing?', fn:()=>{
      const opts=[
        'Factor investing: invertir según características ligadas a mayor rentabilidad. Los 5 factores probados: Value (empresas baratas), Size (pequeñas caps), Profitability (alta rentabilidad), Investment (conservador) y Momentum (tendencia).',
        'ETFs de factores: IWVL (value), IWMO (momentum), IWQU (quality) — TER ~0,30%. Una cartera multifactor combina varios para diversificar el riesgo de factor. Fama y French los validaron académicamente en 1992.',
      ];
      return opts[Math.floor(Math.random()*opts.length)];
    }},
    { q:'¿Qué es el FIRE Lean vs Fat FIRE?', fn:()=>{
      const sal=S.lifeSalary||1800;
      const lean=Math.round(sal*.5*12*25); const fat=Math.round(sal*1.2*12*25);
      return `Lean FIRE: vivir con lo mínimo — €${Math.round(sal*.5).toLocaleString('es')}/mes, necesitas €${lean.toLocaleString('es')}. Fat FIRE: mantener el estilo actual — €${Math.round(sal*1.2).toLocaleString('es')}/mes, necesitas €${fat.toLocaleString('es')}. La mayoría busca el punto medio con margen de seguridad.`;
    }},
    { q:'¿Cómo funciona la economía del comportamiento?', fn:()=>{
      return 'Thaler (Nobel 2017): somos predeciblemente irracionales. Sesgos clave: aversión a pérdidas (perder €100 duele 2,5× más que ganar €100), descuento hiperbólico (preferimos €100 hoy a €150 en un año), efecto ancla (el primer precio condiciona todo). Conocerlos es la única defensa real.';
    }},
    { q:'¿Qué es el presupuesto 50/30/20?', fn:()=>{
      const sal=S.lifeSalary||1800;
      return `50% necesidades (€${Math.round(sal*.5).toLocaleString('es')}/mes), 30% deseos (€${Math.round(sal*.3).toLocaleString('es')}/mes), 20% ahorro/deuda (€${Math.round(sal*.2).toLocaleString('es')}/mes). Es el punto de partida — ajusta el 20% hacia arriba.`;
    }},
    { q:'¿Cómo reduzco mis gastos sin sacrificar calidad de vida?', fn:()=>{
      const sal=S.lifeSalary||1800;
      return `Regla de las 24h: ante cualquier compra >€50, espera un día. El 40% no se realizan. Con €${sal.toLocaleString('es')}/mes, revisar suscripciones (€30), comer de tupper 3 días (€60) y el seguro del móvil (€15) libera €105/mes — €38.000 extra en 30 años al 7%.`;
    }},
    { q:'¿Cómo funciona el plan de pensiones en España?', fn:()=>{
      const sal=S.lifeSalary||1800;
      const tipo=(sal*12)>35200?0.37:(sal*12)>20200?0.30:0.19;
      return `Aportación máxima deducible: €1.500/año. Con tipo marginal del ${Math.round(tipo*100)}%, aportar €1.500 te ahorra €${Math.round(1500*tipo)} en la declaración. Tributa al rescatar, pero el diferimiento del compuesto durante décadas compensa.`;
    }},
    { q:'¿Cómo tributa la bolsa en España?', fn:()=>{
      return 'Plusvalías: 19% hasta €6.000, 21% de €6.001 a €50.000, 23% de €50.001 a €200.000, 27% por encima. Los ETFs de acumulación difieren el impuesto hasta la venta — ventaja fiscal enorme para el largo plazo.';
    }},
    { q:'¿Qué seguro de vida necesito?', fn:()=>{
      const sal=S.lifeSalary||1800;
      return `Necesitas seguro de vida si tienes dependientes (hijos, pareja sin ingresos) o hipoteca grande. Cobertura mínima: 10 años de sueldo (€${(sal*12*10).toLocaleString('es')}). Sin dependientes ni deudas grandes: no lo necesitas.`;
    }},
    { q:'¿Qué son las finanzas en pareja?', fn:()=>{
      return 'Tres modelos: Todo común (eficiente, menos autonomía), Todo separado (autónomo, ineficiente), Híbrido (recomendado): cuenta conjunta para gastos fijos + cuentas individuales. La regla proporcional — cada uno aporta según su sueldo — es la más equitativa.';
    }},

  ];

  // ─── helpers ────────────────────────────────────────────────
  let _shownQIndices  = [];
  let _coachHistory   = []; // [{q, a}] últimas 6 exchanges


  function _themeColor(dark, light) {
    return document.body.classList.contains('light-mode') ? light : dark;
  }

  function _fmt(n) { return Math.round(n).toLocaleString('es'); }

  function _getRandomQs(n, excludeIdx) {
    const pool  = ALL_QUESTIONS.map((_,i)=>i).filter(i=>i!==excludeIdx);
    const fresh = pool.filter(i=>!_shownQIndices.includes(i));
    const src   = fresh.length >= n ? fresh : pool;
    const copy  = [...src], picked = [];
    while(picked.length < n && copy.length) {
      picked.push(copy.splice(Math.floor(Math.random()*copy.length),1)[0]);
    }
    _shownQIndices = [..._shownQIndices.slice(-10), ...picked];
    return picked;
  }

  function _getAnswer(idx) {
    const qt = ALL_QUESTIONS[idx];
    if (!qt) return '—';
    try { return qt.fn(); }
    catch(e) { return 'No tengo datos suficientes ahora mismo.'; }
  }

  /* Ordena tips por urgencia (deuda > emergency > diversif > educación) */
  function _prioritizeTips(tips) {
    const PRIORITY_KEYWORDS = ['deuda','interés','hipoteca','emergencia','concentrad','€0','cero','parad'];
    return tips.slice().sort(function(a,b) {
      var sa = PRIORITY_KEYWORDS.filter(function(k){ return a.toLowerCase().includes(k); }).length;
      var sb = PRIORITY_KEYWORDS.filter(function(k){ return b.toLowerCase().includes(k); }).length;
      return sb - sa;
    });
  }

  /* Genera preguntas contextuales basadas en el estado real de S */
  function _getContextualQs() {
    var qs = [];
    var totalDebt = (S.debts||[]).reduce(function(a,d){ return a+(d.balance||0); }, 0);
    var holdings  = Object.keys(S.portfolio||{}).filter(function(k){ return (S.portfolio[k].shares||0) > 0; });
    var mods      = (S.completedMods||[]).length;
    var firePct   = Math.round((S.patrimony||0) / Math.max(1,(S.lifeSalary||1800)*0.6*12*25)*100);
    var cash      = S.cash||0;
    var savRate   = (S.lifeSalary||0) > 0 ? Math.round((S.monthlyContribution||0)/(S.lifeSalary||1)*100) : 0;
    // Context-specific first
    if (totalDebt > 0)       qs.push({ q: '¿Cómo ataco mi deuda de ' + Math.round(totalDebt).toLocaleString('es') + '€?', fn: function(){ return _getAnswer(ALL_QUESTIONS.findIndex(function(x){ return x.q.includes('deuda'); })); } });
    if (holdings.length > 0) qs.push({ q: '¿Está bien diversificada mi cartera de ' + holdings.join(', ') + '?', fn: function(){ return _getAnswer(ALL_QUESTIONS.findIndex(function(x){ return x.q.includes('inversión'); })); } });
    if (cash > 5000)         qs.push({ q: '¿Qué hago con los ' + Math.round(cash).toLocaleString('es') + '€ que tengo parados?', fn: function(){ return 'Con ' + Math.round(cash).toLocaleString('es') + '€ en cash podrías invertir en ETFs o reforzar el fondo de emergencia primero.'; } });
    if (savRate < 15)        qs.push({ q: '¿Cómo subo mi tasa de ahorro del ' + savRate + '%?', fn: function(){ return _getAnswer(ALL_QUESTIONS.findIndex(function(x){ return x.q.includes('ahorrando'); })); } });
    if (firePct < 100)       qs.push({ q: '¿Cuánto me falta para el FIRE? Voy por el ' + firePct + '%', fn: function(){ return _getAnswer(ALL_QUESTIONS.findIndex(function(x){ return x.q.includes('FIRE'); })); } });
    if (mods < 5)            qs.push({ q: '¿Qué módulo debería completar ahora?', fn: function(){ return 'Con ' + mods + ' módulos completados, el siguiente es clave. El interés compuesto y la diversificación son los más impactantes.'; } });
    // Fill with ALL_QUESTIONS if needed
    var fallbackIdxs = _getRandomQs(Math.max(0, 5 - qs.length));
    fallbackIdxs.forEach(function(i) { qs.push({ q: ALL_QUESTIONS[i].q, fn: function(){ return _getAnswer(i); }, _idx: i }); });
    return qs.slice(0, 5);
  }


  /* Detecta la situación del jugador */
  function _detectSituation() {
    const streak   = S.streak || 0;
    const weekXP   = S.weeklySnapshot?.current?.xp || 0;
    const highDebt = (S.debts||[]).filter(d=>(d.rate||0)>=15);
    const firePct  = (S.lifeSalary||0) > 0
      ? Math.round((S.patrimony||0) / ((S.lifeSalary||1800)*0.6*12*25) * 100) : 0;
    if (streak >= 7 && weekXP >= 100 && firePct >= 30) return 'thriving';
    if (highDebt.length > 0 || streak === 0) return 'struggling';
    return 'neutral';
  }

  /* Genera un plan de 3 acciones concretas para esta semana */
  function _buildWeeklyPlan() {
    const plan    = [];
    const sal     = S.lifeSalary || 1800;
    const mc      = S.monthlyContribution || 0;
    const cash    = S.cash || 0;
    const invested = S.invested || 0;
    const highDebt = (S.debts||[]).filter(d=>(d.rate||0)>=15);
    const mods     = (S.completedMods||[]).length;
    const streak   = S.streak || 0;
    const mExp     = Math.round(sal * 0.5);
    const firePct  = sal > 0 ? Math.round((S.patrimony||0) / (sal*0.6*12*25) * 100) : 0;
    const wMods    = S.weeklySnapshot?.current?.mods || 0;

    // Acción 1 — más urgente
    if (highDebt.length > 0) {
      const w = [...highDebt].sort((a,b)=>b.rate-a.rate)[0];
      plan.push(`💳 Esta semana: pon €${Math.min(Math.round(cash*0.1)||50,500).toLocaleString('es')} extra en deuda ${w.name||'cara'} (${w.rate}% TAE) — retorno garantizado.`);
    } else if (cash < mExp * 3) {
      plan.push(`🛡️ Esta semana: transfiere €${Math.min(Math.round(cash*0.05)||50,300).toLocaleString('es')} a cuenta de ahorro para el fondo de emergencia.`);
    } else if (mc === 0) {
      plan.push(`📈 Esta semana: configura una aportación automática al broker — aunque sean €${Math.max(50,Math.round(sal*0.1)).toLocaleString('es')}/mes.`);
    } else {
      plan.push(`📈 Esta semana: confirma que tu aportación de €${mc.toLocaleString('es')}/mes está programada.`);
    }

    // Acción 2 — educación
    if (wMods < 2) {
      const nextMod = typeof MODULES !== 'undefined' ? MODULES.find(m=>!(S.completedMods||[]).includes(m.id)) : null;
      plan.push(`🎓 Esta semana: completa ${2-wMods} módulo${2-wMods>1?'s':''}${nextMod?` — empieza con "${nextMod.title}"`:''}.`);
    } else {
      plan.push(`✅ Educación OK: ${wMods} módulo${wMods>1?'s':''} completados esta semana.`);
    }

    // Acción 3 — según estado FIRE y racha
    if (firePct >= 80)
      plan.push(`🔥 Esta semana: revisa si tu asignación de activos es óptima para la fase final del FIRE.`);
    else if (streak < 3)
      plan.push(`🔥 Esta semana: mantén 3 días seguidos de actividad — cada racha empieza con el primer día.`);
    else if (invested > 0)
      plan.push(`📊 Esta semana: revisa tu cartera — ¿algún activo se ha desviado >10% del objetivo?`);
    else
      plan.push(`🚀 Esta semana: abre cuenta en un broker low-cost. Trade Republic y DeGiro: proceso online de 10 min.`);

    return plan;
  }

  function _typewrite(el, text, speed=11) {
    el.textContent = '';
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) el.textContent += text[i++];
      else clearInterval(iv);
    }, speed);
  }

  function _renderQButtons(qIndices) {
    const wrap = document.getElementById('coach-q-wrap');
    if (!wrap) return;
    wrap.innerHTML = '';
    qIndices.forEach(idx => {
      const btn = document.createElement('button');
      btn.className = 'coach-q-btn';
      btn.textContent = ALL_QUESTIONS[idx].q;
      btn.dataset.idx = idx;
      wrap.appendChild(btn);
    });
  }

  function askQuestion() {
    if (!isPremium()) { PM_showPaywall('coach'); return; }
    let modal = document.getElementById('m-coach');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'm-coach';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const tips      = _prioritizeTips(_analyze()); // ordenados por urgencia
    const totalDebt = (S.debts||[]).reduce((a,d)=>a+(d.balance||0),0);
    const healthScore = typeof calcHealthScore === 'function' ? calcHealthScore() : 0;
    const savRate   = (S.lifeSalary||0) > 0 ? Math.round(((S.monthlyContribution||0)/(S.lifeSalary||1))*100) : 0;
    const firePct   = Math.round((S.patrimony||0)/Math.max(1,(S.lifeSalary||1800)*0.6*12*25)*100);

    // Top 3 insights prioritizados
    const insights = tips.slice(0,3);

    const plan = _buildWeeklyPlan();
    modal.innerHTML =
      '<div class="modal-box coach-modal-box">' +
        '<button class="modal-close" onclick="document.getElementById(\'m-coach\').style.display=\'none\'">✕</button>' +

        // Header
        '<div class="coach-modal-header">' +
          '<div class="coach-modal-avatar">🤖</div>' +
          '<div style="flex:1">' +
            '<div class="coach-modal-title">FinAI Coach</div>' +
            '<div class="coach-modal-sub">' + (_getApiKey() ? '🟢 IA activa · respuestas reales' : '⚪ Modo análisis local · <a href="#" onclick="AI_COACH.openSettings()" style="color:var(--accent);">Activar IA real →</a>') + '</div>' +
          '</div>' +
          '<button class="coach-settings-btn" onclick="AI_COACH.openSettings()" title="Configurar IA">⚙️</button>' +
          '<button style="background:none;border:none;color:rgba(255,255,255,.4);font-size:18px;cursor:pointer;padding:4px 6px;line-height:1;flex-shrink:0;" onclick="document.getElementById(\'m-coach\').style.display=\'none\'">✕</button>' +
        '</div>' +

        // Stats bar
        '<div class="coach-stats-bar">' +
          '<div class="coach-stat-pill"><span class="coach-stat-icon">💰</span><span>€' + _fmt(S.patrimony||0) + '</span></div>' +
          '<div class="coach-stat-pill"><span class="coach-stat-icon">💚</span><span>' + healthScore + '/100</span></div>' +
          '<div class="coach-stat-pill"><span class="coach-stat-icon">📈</span><span>' + firePct + '% FIRE</span></div>' +
          '<div class="coach-stat-pill"><span class="coach-stat-icon">🔥</span><span>' + (S.streak||0) + 'd racha</span></div>' +
        '</div>' +

        // Insights prioritizados (top 3)
        '<div class="coach-insights-wrap" id="coach-insights-wrap">' +
          '<div class="coach-section-lbl">💡 Tus insights de ahora</div>' +
          insights.map(function(tip, i) {
            return '<div class="coach-insight-row" data-tip="' + i + '">' +
              '<div class="coach-insight-num">' + (i+1) + '</div>' +
              '<div class="coach-insight-text">' + tip + '</div>' +
            '</div>';
          }).join('') +
        '</div>' +

        // Plan semanal
        (plan.length > 0 ? (
          '<div class="coach-section-lbl" style="margin-top:14px;">📋 Tu plan para esta semana</div>' +
          '<div class="coach-plan-wrap">' +
          plan.map(function(p,i){
            return '<div class="coach-plan-row"><div class="coach-plan-num">'+(i+1)+'</div><div class="coach-plan-text">'+p+'</div></div>';
          }).join('') +
          '</div>'
        ) : '') +

        // Preguntas contextuales
        '<div class="coach-section-lbl" style="margin-top:14px;">🎯 Pregúntame algo concreto</div>' +
        '<div id="coach-q-wrap" class="coach-q-wrap"></div>' +

        // Free text input
        '<div class="coach-input-row">' +
          '<input id="coach-free-input" class="coach-free-input" type="text" placeholder="Escribe tu pregunta aquí..." maxlength="200"/>' +
          '<button class="coach-send-btn" id="coach-send-btn">↑</button>' +
        '</div>' +

        // Response area
        '<div id="coach-response" class="coach-response-area" style="display:none;">' +
          '<div class="coach-resp-label">💬 FinAI responde</div>' +
          '<div id="coach-ans-text"></div>' +
        '</div>' +
      '</div>';

    modal.style.display = 'flex';

    // Render contextual question buttons
    _renderContextualQButtons();

    // Question button click
    const wrap = document.getElementById('coach-q-wrap');
    if (wrap) {
      wrap.addEventListener('click', function(e) {
        const btn = e.target.closest('.coach-q-btn');
        if (!btn) return;
        _handleCoachQuestion(btn.dataset.question, btn.dataset.static || '');
        SFX?.xp?.(); HAPTIC?.light?.();
      });
    }

    // Free text send
    const sendBtn = document.getElementById('coach-send-btn');
    const input   = document.getElementById('coach-free-input');
    function _doSend() {
      const q = (input?.value || '').trim();
      if (!q) return;
      input.value = '';
      _handleCoachQuestion(q, null);
    }
    if (sendBtn) sendBtn.addEventListener('click', _doSend);
    if (input)   input.addEventListener('keydown', function(e) { if (e.key === 'Enter') _doSend(); });

    // Insight row click → expand
    const insWrap = document.getElementById('coach-insights-wrap');
    if (insWrap) {
      insWrap.addEventListener('click', function(e) {
        const row = e.target.closest('.coach-insight-row');
        if (!row) return;
        const i   = parseInt(row.dataset.tip, 10);
        const tip = insights[i];
        if (tip) _handleCoachQuestion(tip, tip);
      });
    }
  }

  function _renderContextualQButtons() {
    const wrap = document.getElementById('coach-q-wrap');
    if (!wrap) return;
    const ctxQs = _getContextualQs();
    wrap.innerHTML = '';
    ctxQs.forEach(function(cq) {
      const btn = document.createElement('button');
      btn.className = 'coach-q-btn';
      btn.textContent = cq.q;
      btn.dataset.question = cq.q;
      const sta = (function(){ try { return cq.fn(); } catch(e){ return ''; } })();
      btn.dataset.static = sta;
      wrap.appendChild(btn);
    });
  }

  function _handleCoachQuestion(question, staticFallback) {
    const respEl = document.getElementById('coach-response');
    const ansEl  = document.getElementById('coach-ans-text');
    if (!respEl || !ansEl) return;
    respEl.style.display = 'block';
    ansEl.textContent = '⏳ Analizando…';
    const fallback = staticFallback || _analyze()[0] || 'Revisa tu situación financiera y actúa hoy.';
    fetchFinAIResponse(question, fallback).then(function(answer) {
      _typewrite(ansEl, answer);
    });
    // Scroll into view
    setTimeout(function() { respEl.scrollIntoView({ behavior:'smooth', block:'nearest' }); }, 100);
  }

  function _answerQ(idx) {
    const ansEl = document.getElementById('coach-ans-text');
    if (ansEl) _typewrite(ansEl, _getAnswer(idx));
  }

  function sendQ(customQuestion) {
    if (!customQuestion) return;
    if (document.getElementById('m-coach')?.style.display !== 'flex') {
      AI_COACH.askQuestion();
      setTimeout(function() { _handleCoachQuestion(customQuestion, null); }, 300);
    } else {
      _handleCoachQuestion(customQuestion, null);
    }
  }

  function openSettings() {
    let modal = document.getElementById('m-coach-settings');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'm-coach-settings';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }
    const curKey  = localStorage.getItem('finai_api_key') || '';
    const curProv = localStorage.getItem('finai_api_provider') || 'anthropic';
    modal.innerHTML = `
      <div class="modal-box coach-settings-box">
        <button class="modal-close" onclick="closeModal('m-coach-settings')">✕</button>
        <div class="cs-header">
          <div class="cs-icon">🤖</div>
          <div>
            <div class="cs-title">Configurar FinAI</div>
            <div class="cs-sub">Conecta tu propia API para respuestas reales</div>
          </div>
        </div>

        <div class="cs-provider-row">
          <label class="cs-label">Proveedor de IA</label>
          <div class="cs-provider-btns" id="cs-provider-btns">
            ${['anthropic','deepseek','openai'].map(p => `
              <button class="cs-prov-btn${curProv===p?' cs-prov-active':''}" onclick="document.querySelectorAll('.cs-prov-btn').forEach(b=>b.classList.remove('cs-prov-active'));this.classList.add('cs-prov-active');document.getElementById('cs-key-input').placeholder=AI_COACH._keyPlaceholder('${p}');document.getElementById('cs-api-link').href=AI_COACH._apiLink('${p}');document.getElementById('cs-api-link').textContent='Obtener clave de '+AI_COACH._provName('${p}');this.dataset.sel='1';" data-prov="${p}">
                ${{anthropic:'🟣 Claude (Anthropic)',deepseek:'🔵 DeepSeek (barato)',openai:'🟢 ChatGPT (OpenAI)'}[p]}
              </button>`).join('')}
          </div>
        </div>

        <div class="cs-field">
          <label class="cs-label">API Key</label>
          <input id="cs-key-input" class="cs-input" type="password"
            value="${curKey}"
            placeholder="${_keyPlaceholder(curProv)}"/>
          <div class="cs-key-hint">Tu clave se guarda solo en este dispositivo. Nunca sale al exterior.</div>
        </div>

        <a id="cs-api-link" class="cs-link" href="${_apiLink(curProv)}" target="_blank" rel="noopener">
          Obtener clave de ${_provName(curProv)} →
        </a>

        <div class="cs-cost-note">
          💡 <strong>Coste estimado:</strong> Claude Sonnet ~$0,003/respuesta · DeepSeek ~$0,0003/respuesta · GPT-4o-mini ~$0,0002/respuesta
        </div>

        <div class="cs-actions">
          <button class="btn btn-primary" onclick="AI_COACH.saveSettings()">💾 Guardar y activar</button>
          ${curKey ? `<button class="btn btn-ghost" onclick="AI_COACH.clearSettings()">🗑️ Borrar key</button>` : ''}
        </div>
        <div id="cs-feedback" style="margin-top:10px;font-size:.82rem;text-align:center;"></div>
      </div>`;
    openModal('m-coach-settings');
  }

  function _keyPlaceholder(prov) {
    return {anthropic:'sk-ant-api03-…', deepseek:'sk-…', openai:'sk-…'}[prov] || 'sk-…';
  }
  function _apiLink(prov) {
    return {anthropic:'https://console.anthropic.com/keys', deepseek:'https://platform.deepseek.com/api_keys', openai:'https://platform.openai.com/api-keys'}[prov] || '#';
  }
  function _provName(prov) {
    return {anthropic:'Anthropic', deepseek:'DeepSeek', openai:'OpenAI'}[prov] || prov;
  }

  function saveSettings() {
    const key    = (document.getElementById('cs-key-input')?.value || '').trim();
    const active = document.querySelector('.cs-prov-btn.cs-prov-active');
    const prov   = active?.dataset?.prov || 'anthropic';
    const fb     = document.getElementById('cs-feedback');

    if (!key) { if (fb) fb.textContent = '⚠️ Introduce una API key válida.'; return; }
    if (!key.startsWith('sk-')) { if (fb) { fb.style.color = 'var(--loss)'; fb.textContent = '⚠️ La key debe empezar por sk-'; } return; }

    localStorage.setItem('finai_api_key', key);
    localStorage.setItem('finai_api_provider', prov);
    if (fb) { fb.style.color = 'var(--gain)'; fb.textContent = '✅ FinAI activado con ' + _provName(prov) + ' · Cierra y vuelve a abrir el coach'; }
    SFX?.xp?.();
    setTimeout(() => closeModal('m-coach-settings'), 1800);
  }

  function clearSettings() {
    localStorage.removeItem('finai_api_key');
    localStorage.removeItem('finai_api_provider');
    closeModal('m-coach-settings');
    toast('🗑️ API key eliminada', 'FinAI vuelve al modo análisis local.', 't-warn');
  }

  return { proactiveCheck, askQuestion, sendQ, _answerQ, _renderQButtons, _analyze, fetchFinAIResponse, openSettings, saveSettings, clearSettings, _keyPlaceholder, _apiLink, _provName };
})();



/* ══════════════════════════════════════════════════════════════════
   PORTFOLIO DONUT CHART — Composición de cartera en tiempo real
   ─────────────────────────────────────────────────────────────────
   · Gráfico tipo donut con Chart.js
   · Colores neón sobre fondo oscuro (terminal de trading)
   · Muestra % de cada activo + valor total en el centro
   · Se actualiza en tiempo real con los precios
══════════════════════════════════════════════════════════════════ */
const ASSET_COLORS = {
  VUSA:'#00e5a0', IWDA:'#00c9ff', EQQQ:'#6e56ff', MSCI:'#a78bfa',
  SP500:'#34d399', AAPL:'#f0b429', MSFT:'#fb923c', NVDA:'#f43f5e',
  TSLA:'#e879f9', GOOGL:'#38bdf8', AMZN:'#facc15', BTC:'#f97316',
  ETH:'#8b5cf6', GOLD:'#fbbf24', SAN:'#06b6d4', ITX:'#10b981',
  IBE:'#3b82f6', TEF:'#ec4899', BRK:'#84cc16', JNJ:'#14b8a6',
  LVMH:'#a855f7',
};

let _donutChartInst = null;

function renderPortfolioDonut() {
  const canvas = document.getElementById('portfolio-donut');
  if (!canvas) return;

  // Build holdings from S.portfolio
  const holdings = Object.entries(S.portfolio || {})
    .filter(([,qty]) => qty > 0)
    .map(([ticker, qty]) => {
      const price = GAME.stockPrices[ticker] || (STOCKS.find(s=>s.ticker===ticker)?.price||0);
      return { ticker, qty, value: qty * price };
    })
    .filter(h => h.value > 0)
    .sort((a,b) => b.value - a.value);

  const totalValue = holdings.reduce((s,h) => s+h.value, 0);

  if (holdings.length === 0) {
    const dw = document.getElementById('donut-wrap');
    if (dw) dw.style.display = 'none';
    canvas.style.display = 'none';
    return;
  }
  const dw = document.getElementById('donut-wrap');
  if (dw) dw.style.display = 'block';
  canvas.style.display = 'block';
  const empty = canvas.parentElement.querySelector('.donut-empty');
  if (empty) empty.style.display = 'none';

  const labels = holdings.map(h => h.ticker);
  const data   = holdings.map(h => h.value);
  const colors = holdings.map(h => ASSET_COLORS[h.ticker] || '#666');

  if (_donutChartInst) _donutChartInst.destroy();

  _donutChartInst = new Chart(canvas, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderColor: '#0d1420', borderWidth: 3, hoverBorderWidth: 4 }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const pct = (ctx.parsed / totalValue * 100).toFixed(1);
              return ` ${ctx.label}: €${Math.round(ctx.parsed).toLocaleString('es')} (${pct}%)`;
            },
          },
        },
      },
      animation: { animateRotate: true, duration: 600 },
    },
    plugins: [{
      id: 'centerText',
      afterDraw(chart) {
        const { ctx: c, chartArea: {top,right,bottom,left,width,height} } = chart;
        const cx = left + width/2, cy = top + height/2;
        c.save();
        c.textAlign = 'center'; c.textBaseline = 'middle';
        c.fillStyle = 'rgba(255,255,255,.45)'; c.font = '600 11px system-ui';
        c.fillText('CARTERA', cx, cy - 12);
        c.fillStyle = '#00e5a0'; c.font = 'bold 16px system-ui';
        c.fillText('€' + Math.round(totalValue).toLocaleString('es'), cx, cy + 6);
        c.restore();
      },
    }],
  });

  // Render legend list
  const legend = document.getElementById('portfolio-donut-legend');
  if (legend) {
    legend.innerHTML = holdings.slice(0, 8).map(h => {
      const pct = (h.value/totalValue*100).toFixed(1);
      const col = ASSET_COLORS[h.ticker] || '#666';
      return `<div class="donut-leg-row">
        <span class="donut-leg-dot" style="background:${col};"></span>
        <span class="donut-leg-name">${h.ticker}</span>
        <span class="donut-leg-pct" style="color:${col};">${pct}%</span>
        <span class="donut-leg-val">€${Math.round(h.value).toLocaleString('es')}</span>
      </div>`;
    }).join('');
  }
}


/* ══════════════════════════════════════════════════════════════════
   DUEL QUIZ — Minitest de 10 preguntas, XP al ganador
   ─────────────────────────────────────────────────────────────────
   · Modo solitario: tú vs "la media de FinLearn"
   · 10 preguntas rápidas de finanzas reales
   · Timer de 15 segundos por pregunta
   · Resultado: XP proporcional a aciertos + badge si 8+/10
══════════════════════════════════════════════════════════════════ */
const DUEL_QUESTIONS = [
  { q:'¿Qué es la regla del 72?', opts:['Años para doblar capital dividiendo 72/tasa','El máximo de deuda recomendado','El % de cartera en RV','La tasa de ahorro ideal'], a:0 },
  { q:'¿Qué significa DCA?', opts:['Diversificación Con Activos','Dollar Cost Averaging (aportaciones periódicas)','Deuda Con Apalancamiento','Dividendo Compuesto Anual'], a:1 },
  { q:'¿Qué es el FIRE Number?', opts:['El patrimonio en el momento del crash','25 veces tus gastos anuales','Tu sueldo multiplicado por 10','El límite de deducción fiscal'], a:1 },
  { q:'Si el Euríbor sube, tu hipoteca variable…', opts:['Baja','Sube','No cambia','Depende del banco'], a:1 },
  { q:'¿Qué método de pago de deuda es matemáticamente óptimo?', opts:['Snowball (menor saldo primero)','Avalanche (mayor TAE primero)','Pagar lo mismo a todas','Pagar solo los mínimos'], a:1 },
  { q:'¿Cuál es la deducción máxima en planes de pensiones en España (2024)?', opts:['500€','1.500€','3.000€','8.000€'], a:1 },
  { q:'¿Qué mide el ratio Price-to-Rent?', opts:['Rentabilidad de un alquiler vs compra','El precio del petróleo','La inflación del sector','El coste de una hipoteca'], a:0 },
  { q:'¿Qué es un ETF de acumulación?', opts:['Un ETF que reparte dividendos','Un ETF que reinvierte dividendos automáticamente','Un fondo garantizado','Un bono indexado'], a:1 },
  { q:'¿Qué porcentaje recomienda el método 50/30/20?', opts:['50% necesidades, 20% ocio, 30% ahorro','50% necesidades, 30% deseos, 20% ahorro e inversión','40% ahorro, 40% gastos, 20% ocio','60% necesidades, 20% ahorro, 20% impuestos'], a:1 },
  { q:'¿Qué es el interés compuesto?', opts:['Interés solo sobre el capital inicial','Interés sobre capital + intereses acumulados','Un tipo de cuenta bancaria','El interés de las tarjetas revolving'], a:1 },
  { q:'¿Qué es la diversificación?', opts:['Comprar siempre el mismo activo','Repartir inversiones para reducir riesgo','Vender en caídas y comprar en subidas','Invertir solo en España'], a:1 },
  { q:'¿Cuánto tiempo tardó el S&P 500 en recuperar el crash de 2008?', opts:['1 año','2 años','5 años','10 años'], a:2 },
  { q:'¿Qué es el efecto del market timing?', opts:['Invertir en el momento perfecto (imposible de predecir)','Comprar y vender según el reloj','Un indicador técnico','La hora óptima de apertura de bolsa'], a:0 },
  { q:'¿Qué ventaja fiscal tienen los ETFs de acumulación en España?', opts:['Tributación 0%','No tributan hasta que vendes (diferimiento fiscal)','Deducción del 100%','Exención hasta 10.000€'], a:1 },
  { q:'¿Qué es el fondo de emergencia ideal?', opts:['1 mes de gastos','3-6 meses de gastos en cuenta corriente o monetario','Todo el ahorro','El 10% del patrimonio'], a:1 },
  { q:'¿Qué es un fondo indexado?', opts:['Un fondo que supera al mercado','Un fondo que replica un índice como el S&P500','Un depósito bancario','Un bono del estado'], a:1 },
  { q:'¿Qué significa TAE?', opts:['Tipo Anual Estimado','Tasa Anual Equivalente','Total Acumulado de Euríbor','Tipo de Ahorro Estipulado'], a:1 },
  { q:'¿Cuánto debería ser tu fondo de emergencia mínimo?', opts:['1 mes de gastos','3-6 meses de gastos','12 meses de gastos','El 10% de tu patrimonio'], a:1 },
  { q:'¿Qué es el rebalanceo de cartera?', opts:['Cambiar toda la cartera cada año','Vender en pérdidas para compensar','Restaurar los porcentajes objetivo de tu asignación de activos','Diversificar en más de 10 países'], a:2 },
  { q:'¿Qué ventaja tiene el interés compuesto frente al simple?', opts:['No hay diferencia a corto plazo en más de 10 años','Los intereses también generan intereses','El capital inicial crece más rápido en el simple','Solo aplica a inversiones en bolsa'], a:1 },
  { q:'¿Qué es el sesgo de confirmación en inversión?', opts:['Buscar solo información que confirme tu tesis','Diversificar demasiado','Vender demasiado pronto','Invertir siempre en lo mismo'], a:0 },
  { q:'Si la inflación es del 4% y tu depósito da el 2%, ¿qué ocurre?', opts:['Ganas poder adquisitivo','Lo pierdes: tu dinero vale menos en términos reales','Es neutro, se compensan','Depende del plazo'], a:1 },
  { q:'¿Qué es un ETF de distribución?', opts:['Reparte dividendos periódicamente','Reinvierte los dividendos','No tiene dividendos','Solo invierte en bonos'], a:0 },
  { q:'¿Qué significa tener una cartera 60/40?', opts:['60% bonos, 40% RV','60% RV, 40% bonos','60% nacional, 40% internacional','60% largo plazo, 40% corto plazo'], a:1 },
  { q:'¿Cuál es el riesgo principal de las tarjetas revolving?', opts:['Comisión de apertura alta','Intereses muy altos (20-30% TAE) que se acumulan fácilmente','Límite de crédito bajo','No se pueden usar en el extranjero'], a:1 },
];

const DUEL = (() => {
  let _questions = [];
  let _current   = 0;
  let _score     = 0;
  let _botScore  = 0;
  let _timer     = null;
  let _timeLeft  = 15;
  let _answered  = false;

  function start() {
    // Shuffle + pick 10
    _questions = [...DUEL_QUESTIONS].sort(()=>Math.random()-.5).slice(0,10);
    _current = _score = _botScore = 0;
    _showModal();
    _showQuestion();
  }

  function _showModal() {
    let modal = document.getElementById('m-duel');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'm-duel';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-box duel-box">
        <button onclick="DUEL.close()" style="position:absolute;top:10px;right:12px;background:none;border:none;font-size:20px;cursor:pointer;color:var(--text3);z-index:10;">✕</button>
        <div class="duel-header">
          <div class="duel-vs">
            <div class="duel-player">
              <span class="duel-avatar">${S.avatar||'🌱'}</span>
              <span class="duel-pname">${S.userName||'Tú'}</span>
              <span class="duel-pscore" id="duel-my-score">0</span>
            </div>
            <div class="duel-vstext">VS</div>
            <div class="duel-player">
              <span class="duel-avatar">🤖</span>
              <span class="duel-pname">Media FinLearn</span>
              <span class="duel-pscore" id="duel-bot-score">0</span>
            </div>
          </div>
          <div class="duel-progress">
            <div class="duel-q-num" id="duel-qnum">Pregunta 1/10</div>
            <div class="duel-timer-bar"><div class="duel-timer-fill" id="duel-timer-fill"></div></div>
            <div class="duel-timer-txt" id="duel-timer-txt">15s</div>
          </div>
        </div>
        <div id="duel-question" class="duel-question"></div>
        <div id="duel-opts" class="duel-opts"></div>
        <div id="duel-feedback" class="duel-feedback"></div>
      </div>`;
  }

  function _showQuestion() {
    if (_current >= _questions.length) { _showResult(); return; }
    const q = _questions[_current];
    _answered = false;
    _timeLeft = 15;

    setEl('duel-qnum', `Pregunta ${_current+1}/10`);
    const qEl = document.getElementById('duel-question');
    if (qEl) qEl.textContent = q.q;

    const optsEl = document.getElementById('duel-opts');
    if (optsEl) optsEl.innerHTML = q.opts.map((o,i) => `
      <button class="duel-opt" onclick="DUEL.answer(${i})">${String.fromCharCode(65+i)}. ${o}</button>`
    ).join('');

    const fb = document.getElementById('duel-feedback');
    if (fb) fb.innerHTML = '';

    // Timer
    if (_timer) clearInterval(_timer);
    _timer = setInterval(() => {
      _timeLeft--;
      const pct = (_timeLeft/15)*100;
      const fill = document.getElementById('duel-timer-fill');
      const txt  = document.getElementById('duel-timer-txt');
      if (fill) { fill.style.width = pct+'%'; fill.style.background = pct>40?'var(--accent)':'#f0b429'; }
      if (txt)  txt.textContent = _timeLeft+'s';
      if (_timeLeft <= 0) { clearInterval(_timer); if (!_answered) answer(-1); }
    }, 1000);
  }

  function answer(idx) {
    if (_answered) return;
    _answered = true;
    clearInterval(_timer);
    const q      = _questions[_current];
    const correct = idx === q.a;
    // Bot answers correctly 65% of the time
    const botCorrect = Math.random() < 0.65;

    if (correct) { _score++; SFX.correct(); HAPTIC.success(); }
    else         { SFX.wrong(); HAPTIC.error(); }
    if (botCorrect) _botScore++;

    setEl('duel-my-score',  _score);
    setEl('duel-bot-score', _botScore);

    // Visual feedback on buttons
    const opts = document.querySelectorAll('.duel-opt');
    opts.forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.a) btn.classList.add('duel-correct');
      else if (i === idx && !correct) btn.classList.add('duel-wrong');
    });

    const fb = document.getElementById('duel-feedback');
    if (fb) fb.innerHTML = `
      <span class="${correct?'fb-correct':'fb-wrong'}">${correct?'✅ ¡Correcto!':'❌ Incorrecto'}</span>
      ${!correct?`<span class="fb-answer">Respuesta: ${q.opts[q.a]}</span>`:''}
      <span class="fb-bot">${botCorrect?'🤖 El bot también acertó':'🤖 El bot también falló'}</span>`;

    _current++;
    setTimeout(_showQuestion, correct?1200:2000);
  }

  function _showResult() {
    const won   = _score > _botScore;
    const draw  = _score === _botScore;
    const xp    = _score * 30 + (won ? 200 : draw ? 80 : 20);
    S.xp += xp;
    saveState();
    checkAchievements();
    if (won) { confetti(); SFX.levelUp(); HAPTIC.levelUp(); }

    const modal = document.getElementById('m-duel');
    if (!modal) return;
    modal.innerHTML = `
      <div class="modal-box duel-result">
        <div class="duel-result-icon">${won?'🏆':draw?'🤝':'📚'}</div>
        <div class="duel-result-title">${won?'¡Ganaste!':draw?'Empate':_score>=7?'¡Muy bien!':_score>=5?'Correcto':'Sigue estudiando'}</div>
        <div class="duel-result-scores">
          <div class="duel-rs"><span>${S.userName||'Tú'}</span><span class="duel-rs-val ${won?'g':''}">${_score}/10</span></div>
          <div class="duel-vs-small">VS</div>
          <div class="duel-rs"><span>Media FinLearn</span><span class="duel-rs-val ${!won&&!draw?'g':''}">${_botScore}/10</span></div>
        </div>
        <div class="duel-xp-award">+${xp} XP ganados</div>
        <div class="duel-lesson">
          ${_score<=4?'💡 Repasa los módulos de inversión y finanzas personales':
            _score<=7?'💪 Buen nivel. Aún hay margen para mejorar con los módulos avanzados':
            '🔥 ¡Nivel experto! La teoría la tienes clara.'}
        </div>
        <div style="display:flex;gap:8px;margin-top:16px;">
          <button class="btn btn-primary" style="flex:1;" onclick="DUEL.start()">🔄 Revancha</button>
          <button class="btn btn-secondary" style="flex:1;" onclick="document.getElementById('m-duel').style.display='none'">Cerrar</button>
        </div>
      </div>`;
  }

  function close() {
    if (_timer) clearInterval(_timer);
    const modal = document.getElementById('m-duel');
    if (modal) modal.style.display = 'none';
  }
  return { start, answer, close };
})();

/* ── FinAI API Key Configuration ─────────────────────────── */
function openFinAIConfig() {
  const current = localStorage.getItem('finlearn_api_key') || '';
  let modal = document.getElementById('m-finai-config');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-finai-config';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-box" style="max-width:380px;">
      <button class="modal-close" onclick="document.getElementById('m-finai-config').style.display='none'">✕</button>
      <div style="text-align:center;font-size:40px;margin-bottom:8px;">🤖</div>
      <div class="h3 text-center mb4">Activar FinAI Coach</div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:16px;line-height:1.6;">
        FinAI necesita una API key de Anthropic para funcionar. Es gratuita hasta cierto uso.
        <a href="https://console.anthropic.com" target="_blank" style="color:var(--accent);font-weight:700;">
          → Obtener key gratis en console.anthropic.com
        </a>
      </div>
      <div class="form-group">
        <label class="form-label">Tu API Key (sk-ant-...)</label>
        <input type="password" id="finai-key-input" class="form-input"
          placeholder="sk-ant-api03-..."
          value="${current}"
          style="font-family:monospace;font-size:11px;">
      </div>
      <div style="font-size:10px;color:var(--text3);margin-bottom:16px;">
        🔒 Solo se guarda en tu dispositivo, nunca en servidores externos.
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary" style="flex:1;" onclick="saveFinAIKey()">Guardar y activar</button>
        ${current ? '<button class="btn btn-ghost btn-sm" onclick="clearFinAIKey()">Eliminar key</button>' : ''}
      </div>
      <div id="finai-test-result" style="margin-top:12px;font-size:12px;"></div>
    </div>`;
  modal.style.display = 'flex';
}

function saveFinAIKey() {
  const key = (document.getElementById('finai-key-input')?.value || '').trim();
  if (!key.startsWith('sk-ant')) {
    document.getElementById('finai-test-result').innerHTML =
      '<span style="color:var(--danger);">❌ La key debe empezar por sk-ant-...</span>';
    return;
  }
  localStorage.setItem('finlearn_api_key', key);
  document.getElementById('finai-test-result').innerHTML =
    '<span style="color:var(--accent);">✅ Key guardada. Probando conexión...</span>';
  // Test the key
  setTimeout(async () => {
    const advice = await AI_COACH.getAdvice(true);
    const el = document.getElementById('finai-test-result');
    if (el) el.innerHTML = advice
      ? '<span style="color:var(--accent);">✅ FinAI activo y funcionando.</span>'
      : '<span style="color:#f0b429;">⚠️ Key guardada pero no se pudo conectar. Verifica que sea válida.</span>';
  }, 300);
}

function clearFinAIKey() {
  localStorage.removeItem('finlearn_api_key');
  document.getElementById('m-finai-config').style.display = 'none';
  toast('🔑 Key eliminada', 'FinAI desactivado', 't-social');
}

/* ══════════════════════════════════════════════════════════════════
   SISTEMA DE TRABAJOS / TAREAS LABORALES
   ─────────────────────────────────────────────────────────────────
   · Cada ~20 días aparece una oferta de trabajo puntual
   · El jugador decide si aceptar o rechazar (impacta cash, XP, carrera)
   · Trabajos freelance, consultorías, extras, inversiones de ángel
   · Las decisiones tienen consecuencias económicas reales
   · Algunos trabajos abren puertas (ascienden carrera, desbloquean negocios)
══════════════════════════════════════════════════════════════════ */
const JOB_OFFERS = [
  {
    id: 'consulting_gig',
    icon: '📊',
    title: 'Consultoría freelance',
    desc: 'Una empresa te contacta para un proyecto de análisis de 2 semanas. Pagan bien pero es fuera de horario.',
    condition: s => ['junior','specialist','senior','director'].includes(s.career||'junior'),
    choices: [
      { label: '✅ Acepto', desc: '+€800 extras. Cansancio pero dinero', effect: s => { s.cash += 800; s.xp += 60; }, result: '💰 Consultoría completada. +€800, +60 XP' },
      { label: '❌ Rechazo', desc: 'Tu tiempo libre es sagrado', effect: s => { s.xp += 15; }, result: '😌 Rechazado. Priorizaste tu tiempo. +15 XP' },
      { label: '💬 Negocio más', desc: 'Propones €1.200 o nada', effect: s => { if(Math.random()>.4){s.cash+=1200;s.xp+=80;}else{s.xp+=20;} }, result: '🎲 A veces funciona, a veces no.' },
    ],
  },
  {
    id: 'job_offer',
    icon: '💼',
    title: 'Oferta de otra empresa',
    desc: 'Headhunter: una empresa competidora te ofrece un 25% más de sueldo. Tu jefe lo sabe y está molesto.',
    condition: s => ['junior','specialist','senior'].includes(s.career||'junior'),
    choices: [
      { label: '🚀 Me cambio', desc: 'Salario +25%, hay que adaptarse', effect: s => { s.lifeSalary=Math.round((s.lifeSalary||1800)*1.25); s.xp+=120; }, result: '🚀 Cambiaste. +25% sueldo. El riesgo valió la pena.' },
      { label: '🤝 Negocio con mi empresa', desc: 'Usas la oferta para negociar +12%', effect: s => { s.lifeSalary=Math.round((s.lifeSalary||1800)*1.12); s.xp+=80; }, result: '💼 Tu empresa igualó parcialmente. +12% sueldo.' },
      { label: '🙅 Me quedo tal cual', desc: 'Lealtad o comodidad', effect: s => { s.xp+=20; }, result: '😌 Seguiste igual. Estabilidad por encima del dinero.' },
    ],
  },
  {
    id: 'overtime_project',
    icon: '⏰',
    title: 'Proyecto extra urgente',
    desc: 'Tu empresa necesita que trabajes 3 fines de semana. Prometen un bono de €500, pero no hay contrato.',
    condition: s => true,
    choices: [
      { label: '✅ Acepto (confío)', desc: 'Arriesgas tu tiempo por promesa verbal', effect: s => { if(Math.random()>.3){s.cash+=500;s.xp+=50;}else{s.xp+=30;} }, result: '🎲 A veces pagan, a veces no. Lección aprendida.' },
      { label: '📄 Solo con contrato', desc: 'Nada verbal. Exiges por escrito.', effect: s => { s.xp+=90; s.lifeSalary=Math.round((s.lifeSalary||1800)*1.05); }, result: '💪 Te respetan más. +90 XP. Subida del 5% en siguiente contrato.' },
      { label: '❌ Rechazo', desc: 'Work-life balance primero', effect: s => { s.xp+=25; }, result: '😌 Rechazaste. Salud mental protegida.' },
    ],
  },
  {
    id: 'startup_equity',
    icon: '🌱',
    title: 'Startup te ofrece equity',
    desc: 'Una startup te ofrece unirte con sueldo bajo (-30%) pero con 2% de equity. Valoración actual: €500k.',
    condition: s => (s.xp||0) >= 300,
    choices: [
      { label: '🚀 Acepto (creo en el proyecto)', desc: 'Sacrificio ahora, potencial enorme', effect: s => { s.lifeSalary=Math.round((s.lifeSalary||1800)*0.7); s.startupEquity=(s.startupEquity||0)+2; s.xp+=150; }, result: '🎲 2% de equity añadido. El futuro dirá.' },
      { label: '💵 Solo si igualan sueldo', desc: 'Equity sí, pero sin sacrificio salarial', effect: s => { if(Math.random()>.6){s.startupEquity=(s.startupEquity||0)+0.5;s.xp+=80;}else{s.xp+=30;} }, result: '🎲 A veces aceptan, a veces no.' },
      { label: '❌ Demasiado riesgo', desc: 'Prefieres la seguridad', effect: s => { s.xp+=20; }, result: '😌 Seguridad primero. Otras oportunidades vendrán.' },
    ],
  },
  {
    id: 'angel_investment',
    icon: '😇',
    title: 'Inversión ángel en startup',
    desc: 'Un amigo emprendedor busca €3.000 para su startup de IA. Valoración de €100k. Alto riesgo, alto potencial.',
    condition: s => (s.cash||0) >= 3000 && (s.patrimony||0) >= 10000,
    choices: [
      { label: '💸 Invierto €3.000', desc: 'Diversificación alternativa. Alto riesgo.', effect: s => { s.cash-=3000; s.angelInvestments=(s.angelInvestments||0)+3000; s.xp+=100; }, result: '😇 €3.000 invertidos en startup. El tiempo dirá (x0 o x10+).' },
      { label: '💸 Invierto €1.000', desc: 'Exposición menor al riesgo', effect: s => { s.cash-=1000; s.angelInvestments=(s.angelInvestments||0)+1000; s.xp+=60; }, result: '😇 €1.000 apostados. Ticket reducido.' },
      { label: '❌ No invierto', desc: 'Startups = lotería', effect: s => { s.xp+=15; }, result: '😌 Correcto. El 90% de startups fracasan.' },
    ],
  },
  {
    id: 'tax_decision',
    icon: '🧾',
    title: 'Declaración de la renta',
    desc: 'Tu asesor propone dos estrategias para la declaración: una conservadora y una agresiva (legal pero con riesgo de inspección).',
    condition: s => (s.lifeSalary||0) >= 2000,
    choices: [
      { label: '✅ Estrategia conservadora', desc: 'Seguro. Deduces lo obvio.', effect: s => { s.cash+=Math.round((s.lifeSalary||1800)*0.08); s.xp+=40; }, result: '✅ Devolución estándar. Sin sobresaltos.' },
      { label: '💡 Estrategia optimizada', desc: 'Plan de pensiones + gastos profesionales', effect: s => { s.cash+=Math.round((s.lifeSalary||1800)*0.18); s.xp+=90; }, result: '💰 Optimización fiscal legal. Devuelven más.' },
      { label: '⚠️ Estrategia agresiva', desc: 'Mucho riesgo de inspección', effect: s => { if(Math.random()>.7){s.cash+=Math.round((s.lifeSalary||1800)*0.3);}else{s.cash-=Math.round((s.lifeSalary||1800)*0.15);} s.xp+=20; }, result: '🎲 A veces Hacienda inspecciona y te sale caro.' },
    ],
  },
  {
    id: 'side_hustle',
    icon: '🛒',
    title: 'Negocio paralelo pequeño',
    desc: 'Tienes una idea: vender cursos online sobre tu especialidad. Necesitas €200 para la plataforma.',
    condition: s => (s.cash||0) >= 200,
    choices: [
      { label: '🚀 Lo lanzo ya', desc: '-€200 ahora, potencial de €300-1500/mes', effect: s => { s.cash-=200; if(Math.random()>.4){s.cash+=(300+Math.random()*1200);s.xp+=120;}else{s.xp+=60;} }, result: '🎲 El mercado decide si tu curso tiene demanda.' },
      { label: '📝 Primero valido la idea', desc: 'Encuestas gratis antes de invertir', effect: s => { s.xp+=80; if(Math.random()>.5){s.cash-=200; s.cash+=600; }}, result: '💡 Validar antes de invertir. Enfoque lean.' },
      { label: '❌ No tengo tiempo', desc: 'Tu energía tiene un límite', effect: s => { s.xp+=15; }, result: '😌 Correcto si no tienes ancho de banda.' },
    ],
  },
  {
    id: 'promotion_opport',
    icon: '📈',
    title: 'Oportunidad de promoción interna',
    desc: 'Se abre un puesto de responsabilidad. Tendrías que hacer una presentación ante el comité directivo.',
    condition: s => ['junior','specialist','senior'].includes(s.career||'junior') && (s.completedMods||[]).length >= 5,
    choices: [
      { label: '💪 Me presento', desc: 'Preparas la presentación de tu vida', effect: s => { if(Math.random()>.45){ const levels=['junior','specialist','senior','director','clevel']; const idx=levels.indexOf(s.career||'junior'); if(idx<levels.length-1){s.career=levels[idx+1]; s.lifeSalary=Math.round((s.lifeSalary||1800)*1.35);} s.xp+=200; } else { s.xp+=80; }}, result: '🎲 A veces lo consigues, a veces no. Pero siempre aprendes.' },
      { label: '🤝 Me alío con un colega', desc: 'Presentación conjunta, mayor probabilidad', effect: s => { if(Math.random()>.3){ const levels=['junior','specialist','senior','director','clevel']; const idx=levels.indexOf(s.career||'junior'); if(idx<levels.length-1){s.career=levels[idx+1]; s.lifeSalary=Math.round((s.lifeSalary||1800)*1.30);} s.xp+=160; } else { s.xp+=60; }}, result: '🤝 Con aliados las probabilidades mejoran.' },
      { label: '⏳ No es el momento', desc: 'Seguirás preparándote', effect: s => { s.xp+=30; }, result: '😌 La próxima vez con más preparación.' },
    ],
  },
];

// Pending job offer state
let _pendingJobOffer = null;
let _lastJobOfferDay = 0;

function _checkJobOffer() {
  if (_pendingJobOffer) return; // already one pending
  const daysSince = (S.gameDay||0) - _lastJobOfferDay;
  if (daysSince < 18) return; // min 18 days between offers
  if (Math.random() > 0.35) return; // 35% chance each check

  const eligible = JOB_OFFERS.filter(j => {
    try { return j.condition(S); } catch(e) { return false; }
  });
  if (!eligible.length) return;

  _pendingJobOffer = eligible[Math.floor(Math.random() * eligible.length)];
  _lastJobOfferDay = S.gameDay || 0;
  setTimeout(_showJobOffer, 2000);
}

function _showJobOffer() {
  const job = _pendingJobOffer;
  if (!job) return;

  let modal = document.getElementById('m-job-offer');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-job-offer';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-box" style="max-width:380px;">
      <div class="job-offer-header">
        <div class="job-offer-icon">${job.icon}</div>
        <div class="job-offer-badge">💼 Decisión laboral</div>
      </div>
      <div class="h3 mb8">${job.title}</div>
      <div style="font-size:13px;color:var(--text2);margin-bottom:18px;line-height:1.6;">${job.desc}</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${job.choices.map((c,i) => `
          <button class="job-choice-btn" onclick="takeJobChoice(${i})">
            <div class="jcb-label">${c.label}</div>
            <div class="jcb-desc">${c.desc}</div>
          </button>`).join('')}
      </div>
    </div>`;
  modal.style.display = 'flex';
  HAPTIC.medium();
  SFX.xp();
}

function takeJobChoice(idx) {
  const job = _pendingJobOffer;
  if (!job) return;
  const choice = job.choices[idx];
  if (!choice) return;

  try { choice.effect(S); } catch(e) {}

  document.getElementById('m-job-offer').style.display = 'none';
  _pendingJobOffer = null;

  saveState();
  updateUIFromState();
  checkAchievements();
  renderCareerCard?.();

  toast(job.icon + ' ' + job.title, choice.result, 'default');
  SFX.correct();
  HAPTIC.success();
}

// Hook into daily tick — check every 20 game days

/* ══════════════════════════════════════════════════════════════════
   AMBIENT FINANCIAL PARTICLES
   Símbolos financieros ultra-sutiles flotando en el fondo.
   Canvas de bajo impacto: 30fps, solo 18-22 partículas activas.
══════════════════════════════════════════════════════════════════ */
const AMBIENT = (() => {
  const SYMBOLS = [
    '€','$','£','¥','₿','%','↑','↗','◈','◆',
    '0.7%','x10','+€','ETF','4%','DCA','FIRE',
    '📈','💹','🏦','💰','📊',
  ];
  const MAX   = 20;
  const FPS   = 30;
  let canvas, ctx, particles = [], raf, lastT = 0;
  let W = 0, H = 0;

  function _rand(a,b){ return a + Math.random()*(b-a); }

  function _spawn(){
    return {
      x:     _rand(0, W),
      y:     H + 20,
      vx:    _rand(-0.25, 0.25),
      vy:    _rand(-0.4, -0.9),
      sym:   SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)],
      size:  _rand(9, 17),
      alpha: _rand(0.07, 0.22),
      rot:   _rand(-0.3, 0.3),
      rotV:  _rand(-0.003, 0.003),
      life:  1,
      decay: _rand(0.0008, 0.002),
    };
  }

  function _tick(ts){
    if (ts - lastT < 1000/FPS){ raf = requestAnimationFrame(_tick); return; }
    lastT = ts;
    ctx.clearRect(0, 0, W, H);

    // Maybe spawn
    if (particles.length < MAX && Math.random() < 0.12){
      particles.push(_spawn());
    }

    // Draw + update
    particles = particles.filter(p => {
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.rotV;
      p.life -= p.decay;
      if (p.life <= 0 || p.y < -30) return false;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha * Math.min(p.life * 5, 1);
      ctx.fillStyle = '#00e5a0';
      ctx.font = `${p.size}px "Syne", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.sym, 0, 0);
      ctx.restore();
      return true;
    });

    raf = requestAnimationFrame(_tick);
  }

  function _resize(){
    if (!canvas) return;
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init(){
    canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    _resize();
    window.addEventListener('resize', _resize);
    // Pre-spawn scattered
    for(let i=0;i<10;i++){
      const p = _spawn();
      p.y = _rand(0, H);
      particles.push(p);
    }
    raf = requestAnimationFrame(_tick);
  }

  return { init };
})();


/* ══════════════════════════════════════════════════════════════════
   27. PUENTE GLOBAL — expone todas las funciones a window
   Soluciona el ReferenceError de onclick="" con ES Modules
══════════════════════════════════════════════════════════════════ */

// ── Navegación
window.goTo               = goTo;
window.safeGoHome         = safeGoHome;

// ── Landing / Growth
window.GR_landingCTA      = GR_landingCTA;
window.GR_openRegister    = GR_openRegister;
window.GR_submitRegister  = GR_submitRegister;
window.GR_skipRegister    = GR_skipRegister;

// ── Onboarding
window.selectGoal         = selectGoal;
window.pickAvatar         = pickAvatar;
window.pickAvatar2        = pickAvatar2;
window.validateObs2       = validateObs2;
window.obNext             = obNext;
window.finishOnboarding   = finishOnboarding;
window.updateFinPreview   = updateFinPreview;   // re-export de ui.js

// ── Lecciones
window.startModule        = startModule;
window.lessonNext         = lessonNext;
window.lessonPrev         = lessonPrev;
window.lessonNextModule   = lessonNextModule;
window.goToCertificate    = goToCertificate;
window.toggleFocusMode    = toggleFocusMode;
window.shareCert          = shareCert;
window.quickShare         = quickShare;

// ── Home helpers
window.updateProjection   = updateProjection;   // re-export de ui.js

// ── Bolsa
window.filterStocks       = filterStocks;
window.changeQty          = changeQty;
window.executeBuy         = executeBuy;
window.executeSell        = executeSell;

// ── Negocios
window.executeBizAcquire  = executeBizAcquire;
window.executeBizUpgrade  = executeBizUpgrade;
window._startGameClock    = _startGameClock;
window.checkAchievements  = checkAchievements;
window.claimDailyReward       = claimDailyReward;
window._rouletteSpinAndClaim  = _rouletteSpinAndClaim;
window.openAddDebtModal   = openAddDebtModal;
window.addDebt            = addDebt;
window.removeDebt         = removeDebt;
window.renderDebtTracker  = renderDebtTracker;
window.pickCareerChoice   = pickCareerChoice;
window.closeYearEnd       = closeYearEnd;
window.cycleGameSpeed     = cycleGameSpeed;
window.MUSIC              = MUSIC;
window.shareProgress      = shareProgress;
window.HAPTIC             = HAPTIC;
window.NOTIFS             = NOTIFS;
window._hideSplash        = _hideSplash;
window.resolveLifeEvent   = resolveLifeEvent;
window.openMortgageModal  = openMortgageModal;
window.selectMortgageType = selectMortgageType;
window.updateMortgageCalc = updateMortgageCalc;
window.confirmMortgage    = confirmMortgage;
window.showAmortizationTable = showAmortizationTable;
window.openScenariosScreen  = openScenariosScreen;
window.openScenarioBriefing = openScenarioBriefing;
window.toggleScenarioBanner = toggleScenarioBanner;
window.startScenario        = startScenario;
window.endScenario        = endScenario;
window.renderWhatIfChart  = renderWhatIfChart;
window.shareWhatIf        = shareWhatIf;
window.renderFireCalc     = renderFireCalc;
// ── Light / Dark theme toggle ─────────────────────────────────
function _applyTheme(isLight) {
  document.body.classList.toggle('light-mode', isLight);
  const icon = isLight ? '☀️' : '🌙';
  document.querySelectorAll('.theme-toggle-btn').forEach(b => {
    b.textContent = b.dataset.label === '1' ? icon + '\u00a0Tema' : icon;
  });
}
function toggleTheme() {
  S.lightMode = !S.lightMode;
  S.theme = S.lightMode ? 'light' : 'dark';
  saveState();
  _applyTheme(S.lightMode);
  HAPTIC.light();
}
// Restore theme on load (supports legacy S.lightMode bool)
function _restoreTheme() {
  S.lightMode = S.lightMode ?? false;
  S.theme     = S.theme ?? (S.lightMode ? 'light' : 'dark');
  if (S.theme === 'light') S.lightMode = true;
  _applyTheme(S.lightMode);
}

window.STREAMER           = STREAMER;
window.toggleTheme        = toggleTheme;
window.toggleMuteAll      = toggleMuteAll;
window.AI_COACH           = AI_COACH;
window.openFinAIConfig    = openFinAIConfig;
window.saveFinAIKey       = saveFinAIKey;
window.clearFinAIKey      = clearFinAIKey;
window.takeJobChoice      = takeJobChoice;
window.DUEL               = DUEL;
window.renderPortfolioDonut = renderPortfolioDonut;
window.setAudioMuted      = setAudioMuted;
window.checkSecretAchievements = checkSecretAchievements;
window.startTutorial      = startTutorial;
window.tutorialNext       = tutorialNext;
window.skipTutorial       = skipTutorial;
window.pickCrisisChoice   = pickCrisisChoice;
window._checkCareerEvent  = _checkCareerEvent;
window.checkDailyLogin        = checkDailyLogin;
window.checkWelcomeBack       = checkWelcomeBack;
window._checkStreakMilestones = _checkStreakMilestones;
window._updateShieldUI        = _updateShieldUI;
window.renderFirstPath    = renderFirstPath;
window.SFX                = SFX;
window.executeBizSell     = executeBizSell;

// ── Ranking / retos
window.joinChallenge      = joinChallenge;
window.copyInvite         = copyInvite;

// ── Modals
window.openModal          = openModal;
window.closeModal         = closeModal;
window.toast              = toast;

// ── Premium / Paywall
window.isPremium          = isPremium;
window.upgradeToPremium   = upgradeToPremium;
window.PM_showPaywall     = PM_showPaywall;

// ── SAAS
window.SAAS_selectPlan    = SAAS_selectPlan;
window.SAAS_startPayment  = SAAS_startPayment;
window.SAAS_confirmSuccess= SAAS_confirmSuccess;

// ── PWA
window.PWA_triggerInstall = PWA_triggerInstall;
window.PWA_dismissBanner  = PWA_dismissBanner;

// ── B2B
window.B2B_submitForm     = B2B_submitForm;

// ── Viral
window.doShare            = doShare;
window.doCopyLink         = doCopyLink;

// ── Crisis
window.respondToBlackSwan = respondToBlackSwan;

// ── Objetos compuestos (AudioManager, WhiteLabel, CALC, FinAI, DynCert)
window.AudioManager       = AudioManager;
window.WhiteLabel         = WhiteLabel;
window.CALC               = CALC;
window.FinAI              = FinAI;
window.DynCert            = DynCert;
window._BUDGET            = _BUDGET;
window._DECISION          = _DECISION;
window.INVESTOR_TEST      = INVESTOR_TEST;
window.openMortgageSimulator = openMortgageSimulator;
window.mortSimTab         = mortSimTab;
window._mortSimUpdate     = _mortSimUpdate;
window._FC                = _FC;
window.renderDailyDelta   = renderDailyDelta;
window._comboReset        = _comboReset;
// ── GAME object (shared with ui.js) ──────────────────────────────────
window.GAME               = GAME;
// ── Funciones generadas en onclick="" por renderXxx() en ui.js ───────
window.openBizModal       = openBizDetail;
window.openBizDetail      = openBizDetail;
window.openStockModal     = openStockDetail;
window.openStockDetail    = openStockDetail;
window.answerDCA          = answerDCA;
window.changeCareer       = changeCareer;
window.renderFact         = renderFact;
window.jumpToModule       = startModule;
window.openCareerModal    = openCareerModal;
window.goToFact           = goToFact;
window.answerQuiz         = answerQuiz;
window.answerExamQuestion = answerExamQuestion;
window.takeLifeEvent      = takeLifeEvent;

function tickMissionTool(toolId) {
  if (!_mw.tools_list) _mw.tools_list = [];
  if (!_mw.tools_list.includes(toolId)) {
    _mw.tools_list.push(toolId);
    _mw.tools_used = _mw.tools_list.length;
    if (typeof _saveMissionWeek === 'function') _saveMissionWeek();
  }
}
window.tickMissionTool = tickMissionTool;

function _addGroupXP(amount) {
  S._groupXP = (S._groupXP || 0) + (amount || 0);
}
window._addGroupXP = _addGroupXP;

window.CHART              = CHART;


/* ══════════════════════════════════════════════════════════════════
   28. AUTO-ARRANQUE
══════════════════════════════════════════════════════════════════ */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
  checkSecretAchievements();
  _trackPatrimonyPeak(); setTimeout(renderPortfolioDonut, 80);

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
      setTimeout(() => _showMissionPopup({ icon:'👑', title:'¡Semana Perfecta! 14/14', xp: 400 }), 800);
    } else if (done >= 10 && !S._mw_ten_weeks?.includes(S._mw_week)) {
      if (!S._mw_ten_weeks) S._mw_ten_weeks = [];
      S._mw_ten_weeks.push(S._mw_week);
      S.xp += 200;
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
function downloadLedgerCSV() {
  _initLedger();
  const entries = S.ledger || [];
  if (entries.length === 0) {
    toast('⚠️ Historial vacío', 'Aún no hay movimientos que exportar.', 't-warn');
    return;
  }

  const BOM = '\uFEFF'; // BOM para que Excel abra UTF-8 correctamente
  const header = ['Fecha', 'Día juego', 'Tipo', 'Categoría', 'Descripción', 'Importe (€)', 'Saldo tras op. (€)'];

  const rows = entries.map(function(e) {
    var date = new Date(e.ts).toLocaleDateString('es-ES', { year:'numeric', month:'2-digit', day:'2-digit' });
    var time = new Date(e.ts).toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' });
    var dateStr = date + ' ' + time;
    var sign = e.type === 'in' ? '+' : '-';
    var amount = sign + e.amount.toFixed(2);
    var desc = '"' + (e.desc || '').replace(/"/g, '""') + '"';
    return [
      dateStr,
      e.gameDay || 0,
      e.type === 'in' ? 'Entrada' : 'Salida',
      e.cat || 'other',
      desc,
      amount,
      (e.balanceAfter || 0).toFixed(2)
    ].join(';');
  });

  var csv = BOM + header.join(';') + '\n' + rows.join('\n');
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'finlearn-historial-' + new Date().toISOString().slice(0,10) + '.csv';
  document.body.appendChild(a);
  a.click();
  setTimeout(function() { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  toast('✅ CSV exportado', entries.length + ' movimientos descargados.', 't-success');
}

window._ledgerAdd         = _ledgerAdd;
window.renderLedger       = renderLedger;
window.toggleLedger       = toggleLedger;
window.downloadLedgerCSV        = downloadLedgerCSV;
window.switchPatrimonyTab        = switchPatrimonyTab;
window.renderPatrimonyDailyChart = renderPatrimonyDailyChart;
window.renderPatrimonyChartAuto  = renderPatrimonyChartAuto;

// F25 — Tracker Patrimonio Real
window.F25_open       = F25_open;
window.F25_close      = F25_close;
window.F25_tab        = F25_tab;
window.F25_liveUpdate = F25_liveUpdate;
window.F25_save       = F25_save;

// F27 — Plan de Acción Personalizado
window.F27_render    = F27_render;
window.F27_refresh   = F27_refresh;
window.F27_stepDone  = F27_stepDone;
window.F27_stepUndo  = F27_stepUndo;
window.F27_openModule = F27_openModule;

/* ══════════════════════════════════════════════════════════════════
   F28 — SKILL TREE VISUAL
   Mapa visual de módulos organizado en 6 ramas temáticas.
   Nodos conectados, estados: locked / available / completed.
   Animación de unlock al completar un módulo.
══════════════════════════════════════════════════════════════════ */

const F28_BRANCHES = [
  {
    id: 'fundamentos', label: 'Fundamentos', emoji: '🏗️', color: '#00e5a0',
    mods: [0, 11, 29, 39, 57, 70, 75, 103, 105, 108, 114, 116, 122, 129, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145]
  },
  {
    id: 'inversion', label: 'Inversión', emoji: '📈', color: '#60a5fa',
    mods: [1, 7, 16, 26, 30, 32, 34, 36, 48, 58, 61, 62, 66, 92, 96, 99, 101, 104, 106, 113, 117, 121, 123, 125, 127, 128, 146, 147, 148, 149]
  },
  {
    id: 'deuda', label: 'Deuda & Riesgo', emoji: '🔄', color: '#fb923c',
    mods: [3, 14, 25, 31, 37, 41, 55, 120, 150, 151, 152, 153, 154, 155, 156, 157]
  },
  {
    id: 'fiscalidad', label: 'Fiscalidad', emoji: '🧾', color: '#fbbf24',
    mods: [4, 9, 21, 28, 38, 42, 49, 51, 60, 68, 83, 91, 94, 100, 110, 119, 126]
  },
  {
    id: 'psicologia', label: 'Psicología', emoji: '🧠', color: '#c084fc',
    mods: [2, 6, 20, 33, 54, 59, 67, 71, 74, 78, 95, 98, 107, 112, 118, 124, 130]
  },
  {
    id: 'avanzado', label: 'Avanzado', emoji: '🚀', color: '#f87171',
    mods: [5, 8, 10, 12, 13, 15, 17, 18, 19, 22, 23, 24, 27, 35, 40, 43, 44, 45, 46, 47, 50, 52, 56, 63, 64, 65, 69, 72, 73, 76, 77, 79, 80, 81, 82, 89, 90, 93, 97, 102, 109, 111, 115]
  },
  {
    id: 'vivienda', label: 'Vivienda', emoji: '🏠', color: '#34d399',
    mods: [84, 85, 86, 87, 88]
  }
];

let _f28Expanded = false;
let _f28LastUnlock = null; // modId that just unlocked (for animation)

function F28_render() {
  const container = document.getElementById('f28-skill-tree');
  if (!container) return;

  const completed = new Set(S.completedMods || []);
  const suggested = S.suggestedModuleId;
  const showRows = _f28Expanded ? 99 : 2; // how many branches to show fully

  let html = '';

  F28_BRANCHES.forEach((branch, bIdx) => {
    const branchCompleted = branch.mods.filter(id => completed.has(id)).length;
    const branchTotal = branch.mods.length;
    const pct = Math.round((branchCompleted / branchTotal) * 100);
    const isCollapsed = !_f28Expanded && bIdx >= 2;

    if (isCollapsed) return;

    html += `<div class="f28-branch" data-branch="${branch.id}">
      <div class="f28-branch-header">
        <span class="f28-branch-emoji">${branch.emoji}</span>
        <span class="f28-branch-name">${branch.label}</span>
        <div class="f28-branch-bar">
          <div class="f28-branch-fill" style="width:${pct}%;background:${branch.color}"></div>
        </div>
        <span class="f28-branch-pct" style="color:${branch.color}">${branchCompleted}/${branchTotal}</span>
      </div>
      <div class="f28-nodes-row">`;

    branch.mods.forEach((modId, idx) => {
      const mod = (typeof MODULES !== 'undefined') ? MODULES.find(m => m && m.id === modId) : null;
      if (!mod) return;
      const isDone = completed.has(modId);
      // Branch-local lock: first node always unlocked, others need previous in branch done
      const prevDone = idx === 0 || completed.has(branch.mods[idx - 1]);
      const isLocked = !isDone && !prevDone;
      const isAvailable = !isDone && !isLocked;
      const isSuggested = modId === suggested && !isDone;
      const isNewUnlock = modId === _f28LastUnlock;

      let nodeClass = 'f28-node';
      if (isDone) nodeClass += ' f28-done';
      else if (isLocked) nodeClass += ' f28-locked';
      else nodeClass += ' f28-available';
      if (isSuggested) nodeClass += ' f28-suggested';
      if (isNewUnlock) nodeClass += ' f28-unlock-anim';

      const shortTitle = mod.title.length > 14 ? mod.title.substring(0, 13) + '…' : mod.title;
      const clickHandler = (isDone || isAvailable) ? `onclick="startModule(${modId})"` : '';
      const connector = idx < branch.mods.length - 1
        ? `<div class="f28-connector${isDone ? ' f28-conn-done' : ''}" style="background:${isDone ? branch.color : 'rgba(255,255,255,0.12)'}"></div>`
        : '';

      html += `
        <div class="f28-node-wrap">
          <div class="${nodeClass}" ${clickHandler}
               style="--branch-color:${branch.color}"
               title="${mod.title}">
            <div class="f28-node-icon">${isDone ? '✓' : isLocked ? '🔒' : mod.icon}</div>
            ${isSuggested ? '<div class="f28-suggested-ring"></div>' : ''}
          </div>
          <div class="f28-node-label">${shortTitle}</div>
        </div>
        ${connector}`;
    });

    html += `</div></div>`;
  });

  container.innerHTML = `
    <div class="f28-tree-inner">
      ${html}
    </div>
    <div class="f28-expand-wrap">
      <button class="btn btn-ghost btn-sm f28-expand-btn" onclick="F28_toggle()">
        ${_f28Expanded
          ? 'Mostrar menos ▴'
          : `Ver mapa completo (${F28_BRANCHES.reduce((a,b)=>a+b.mods.length,0)} módulos) ▾`}
      </button>
    </div>`;
}

function F28_toggle() {
  _f28Expanded = !_f28Expanded;
  F28_render();
  if (!_f28Expanded) {
    document.getElementById('f28-skill-tree')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * F28_onModuleComplete — llama tras completar un módulo para animar el unlock.
 * Pasar el modId recién completado. Encuentra el siguiente en la rama y anima.
 */
function F28_onModuleComplete(doneModId) {
  _f28LastUnlock = null;
  // Find which branch and next module
  for (const branch of F28_BRANCHES) {
    const idx = branch.mods.indexOf(doneModId);
    if (idx !== -1 && idx + 1 < branch.mods.length) {
      _f28LastUnlock = branch.mods[idx + 1];
      break;
    }
  }
  F28_render();
  // Clear animation flag after animation completes
  setTimeout(() => {
    _f28LastUnlock = null;
    const unlockEl = document.querySelector('.f28-unlock-anim');
    if (unlockEl) unlockEl.classList.remove('f28-unlock-anim');
  }, 1200);
}

window.F28_render  = F28_render;
window.F28_toggle  = F28_toggle;
window.F28_onModuleComplete = F28_onModuleComplete;

/* ══════════════════════════════════════════════════════════════════
   F29 — CAJA SORPRESA DIARIA
   Variable reward diario. Recompensas ponderadas aleatorias.
   Persiste en S.lastSurpriseBoxDate.
══════════════════════════════════════════════════════════════════ */

const F29_REWARDS = [
  // weight, type, generator
  { w:40, type:'xp',         gen: () => { const v = [50,75,100,150,200][Math.floor(Math.random()*5)]; return { icon:'⚡', title:`+${v} XP`, desc:'¡Bonus de experiencia!', value: v }; }},
  { w:25, type:'fact',       gen: () => {
      const facts = [
        { icon:'💡', title:'Dato Exclusivo', desc:'El 90% de los fondos de gestión activa no baten al mercado a 15 años. Los indexados, sí.' },
        { icon:'📊', title:'Estadística Real', desc:'Invertir 200€/mes durante 30 años al 7% genera más de 220.000€. Sin tocarlos.' },
        { icon:'🧠', title:'Psicología', desc:'El efecto del anclaje hace que el primer precio que ves determina si algo te parece caro o barato.' },
        { icon:'🏦', title:'Dato Bancario', desc:'Los bancos españoles cobran de media 1,8% en comisiones de gestión. En un ETF: 0,07%.' },
        { icon:'📈', title:'Historia del Mercado', desc:'El S&P 500 ha tenido retorno positivo en el 73% de los años desde 1928, incluyendo crisis.' },
        { icon:'💰', title:'El Coste del Miedo', desc:'Quedarte fuera del mercado solo los 10 mejores días de la última década te cuesta un 54% de rentabilidad.' },
      ];
      return facts[Math.floor(Math.random() * facts.length)];
  }},
  { w:15, type:'multiplier', gen: () => ({ icon:'🚀', title:'Multiplicador x2', desc:'Tu próximo módulo da el doble de XP durante 1 hora.', value: Date.now() + 3600000 }) },
  { w:10, type:'streak',     gen: () => ({ icon:'🛡️', title:'Escudo de Racha', desc:'Tu racha está protegida hoy. Puedes faltar sin perderla.', value: true }) },
  { w:10, type:'badge',      gen: () => {
      const badges = ['🌟 Explorador Curioso','🎯 Enfocado','💎 Constante','🔥 Imparable','⚡ Veloz'];
      const b = badges[Math.floor(Math.random() * badges.length)];
      return { icon:'🏅', title:'Badge Sorpresa', desc:`Has ganado el badge ${b}` };
  }},
];

function F29_getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function F29_hasOpened() {
  return S.lastSurpriseBoxDate === F29_getTodayKey();
}

function F29_pickReward() {
  const total = F29_REWARDS.reduce((a, r) => a + r.w, 0);
  let rand = Math.random() * total;
  for (const r of F29_REWARDS) {
    rand -= r.w;
    if (rand <= 0) return { type: r.type, ...r.gen() };
  }
  return { type: 'xp', ...F29_REWARDS[0].gen() };
}

function F29_applyReward(reward) {
  if (reward.type === 'xp') {
    S.xp = (S.xp || 0) + reward.value;
    S.totalXPtoday = (S.totalXPtoday || 0) + reward.value;
    saveState();
    if (typeof spawnXP === 'function') spawnXP('+' + reward.value + ' XP');
  } else if (reward.type === 'multiplier') {
    S.xpMultiplierExpiry = reward.value; // timestamp hasta el que aplica x2
    saveState();
  } else if (reward.type === 'streak') {
    S.streakShields = Math.min(3, (S.streakShields || 0) + 1); // cap 3
    saveState();
  } else if (reward.type === 'badge') {
    if (!Array.isArray(S.surpriseBadges)) S.surpriseBadges = [];
    S.surpriseBadges.push(reward.title);
    if (S.surpriseBadges.length > 200) S.surpriseBadges = S.surpriseBadges.slice(-200);
    saveState();
  }
}

function F29_render() {
  const el = document.getElementById('f29-surprise-box');
  if (!el) return;

  const opened = F29_hasOpened();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  const missedYesterday = S.lastSurpriseBoxDate && S.lastSurpriseBoxDate !== F29_getTodayKey() && S.lastSurpriseBoxDate === yesterdayKey;

  if (opened && S._f29LastReward) {
    // Already opened: show reward
    const r = S._f29LastReward;
    el.innerHTML = `
      <div class="f29-opened">
        <div class="f29-reward-icon">${r.icon}</div>
        <div class="f29-reward-title">${r.title}</div>
        <div class="f29-reward-desc">${r.desc}</div>
        <div class="f29-next-label">Vuelve mañana para otra caja 🎁</div>
      </div>`;
    return;
  }

  el.innerHTML = `
    <div class="f29-box-wrap" onclick="F29_open()">
      ${missedYesterday ? '<div class="f29-notif-badge">!</div>' : ''}
      <div class="f29-box-icon">🎁</div>
      <div class="f29-box-text">
        <div class="f29-box-title">${missedYesterday ? '¡Tienes una caja sin abrir!' : 'Tu caja sorpresa de hoy'}</div>
        <div class="f29-box-sub">Toca para revelar tu recompensa</div>
      </div>
      <div class="f29-box-arrow">→</div>
    </div>`;
}

function F29_open() {
  if (F29_hasOpened()) return;

  const el = document.getElementById('f29-surprise-box');
  if (!el) return;

  const reward = F29_pickReward();

  // Save state
  S.lastSurpriseBoxDate = F29_getTodayKey();
  S._f29LastReward = reward;
  saveState();

  // Apply reward effect
  F29_applyReward(reward);

  // Animate open
  el.innerHTML = `<div class="f29-opening"><div class="f29-box-explode">🎁</div></div>`;

  setTimeout(() => {
    el.innerHTML = `
      <div class="f29-opened f29-reveal-anim">
        <div class="f29-reward-icon">${reward.icon}</div>
        <div class="f29-reward-title">${reward.title}</div>
        <div class="f29-reward-desc">${reward.desc}</div>
        <div class="f29-particles">✨🌟⚡✨🌟⚡</div>
      </div>`;

    // Show toast
    if (typeof toast === 'function') {
      toast(reward.icon + ' ' + reward.title, reward.desc, 't-success');
    }
  }, 600);
}

window.F29_render = F29_render;
window.F29_open   = F29_open;

/* ══════════════════════════════════════════════════════════════════
   F26 — TARJETAS DE COMPARTIR
   Canvas 1080×1080px generado al completar módulo o alcanzar hito.
   Diseño oscuro con gradiente. Botón navigator.share() con fallback.
══════════════════════════════════════════════════════════════════ */

function F26_generateCard(opts) {
  // opts: { type:'module'|'milestone', title, subtitle, stat, emoji, color }
  const canvas = document.createElement('canvas');
  canvas.width  = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  const color = opts.color || '#00e5a0';

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 1080, 1080);
  bg.addColorStop(0, '#060810');
  bg.addColorStop(0.5, '#0d1220');
  bg.addColorStop(1, '#060810');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1080);

  // Glow circle
  const glow = ctx.createRadialGradient(540, 480, 0, 540, 480, 380);
  glow.addColorStop(0, color + '22');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1080, 1080);

  // Border
  ctx.strokeStyle = color + '44';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, 1000, 1000);

  // Corner accents
  const accentLen = 60;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  [[40,40],[1040,40],[40,1040],[1040,1040]].forEach(([x,y]) => {
    const dx = x === 40 ? accentLen : -accentLen;
    const dy = y === 40 ? accentLen : -accentLen;
    ctx.beginPath(); ctx.moveTo(x, y + dy); ctx.lineTo(x, y); ctx.lineTo(x + dx, y); ctx.stroke();
  });

  // Big emoji
  ctx.font = '160px serif';
  ctx.textAlign = 'center';
  ctx.fillText(opts.emoji || '🏆', 540, 380);

  // Achievement label
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.fillStyle = color;
  ctx.fillText(opts.type === 'module' ? '✓ MÓDULO COMPLETADO' : '🏆 HITO ALCANZADO', 540, 500);

  // Main title
  ctx.font = 'bold 68px system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  const titleLines = _F26_wrapText(ctx, opts.title || '', 900);
  titleLines.forEach((line, i) => ctx.fillText(line, 540, 590 + i * 78));

  // Stat
  if (opts.stat) {
    ctx.font = '38px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(opts.stat, 540, 590 + titleLines.length * 78 + 50);
  }

  // Divider
  const divY = 820;
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(100, divY); ctx.lineTo(980, divY); ctx.stroke();

  // Footer: FinLearn branding
  ctx.font = 'bold 36px system-ui, sans-serif';
  ctx.fillStyle = color;
  ctx.fillText('FinLearn', 540, 880);
  ctx.font = '28px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('Aprende finanzas personales en 1 minuto al día', 540, 928);

  return canvas;
}

function _F26_wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  words.forEach(w => {
    const test = current ? current + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  });
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

async function F26_share(opts) {
  const canvas = F26_generateCard(opts);

  canvas.toBlob(async (blob) => {
    const file = new File([blob], 'finlearn-logro.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'FinLearn — ' + (opts.title || 'Logro'),
          text: '¡Acabo de completar un módulo en FinLearn! 📈 Aprende finanzas personales en 1 minuto al día.',
          files: [file]
        });
        return;
      } catch(e) { /* fallthrough to download */ }
    }

    // Fallback: download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finlearn-logro.png';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
    if (typeof toast === 'function') {
      toast('📥 Imagen descargada', 'Compártela en tus redes sociales.', 't-success');
    }
  }, 'image/png');
}

/**
 * F26_showModuleShare — muestra modal de compartir tras completar un módulo.
 * Llama desde el modal de celebración existente.
 */
function F26_showModuleShare(modTitle, modIcon, xpGained) {
  const modal = document.getElementById('f26-share-modal');
  if (!modal) return;

  const opts = {
    type: 'module',
    title: modTitle,
    subtitle: 'Módulo completado',
    emoji: modIcon || '📈',
    stat: `+${xpGained || 0} XP · ${(S.completedMods || []).length} módulos completados`,
    color: '#00e5a0'
  };

  // Preview canvas
  const canvas = F26_generateCard(opts);
  const preview = document.getElementById('f26-canvas-preview');
  if (preview) {
    preview.innerHTML = '';
    canvas.style.width  = '100%';
    canvas.style.height = 'auto';
    canvas.style.borderRadius = '12px';
    preview.appendChild(canvas);
  }

  document.getElementById('f26-share-btn').onclick = () => F26_share(opts);
  modal.style.display = 'flex';
}

function F26_closeModal() {
  const modal = document.getElementById('f26-share-modal');
  if (modal) modal.style.display = 'none';
}

window.F26_share           = F26_share;
window.F26_showModuleShare = F26_showModuleShare;
window.F26_closeModal      = F26_closeModal;
window.F26_generateCard    = F26_generateCard;

/* ══════════════════════════════════════════════════════════════════
   F30 — MISIONES GRUPALES
   Grupo de 5 simulados + usuario. Misión semanal compartida.
   Progreso social visible. Presión positiva.
══════════════════════════════════════════════════════════════════ */

const F30_MEMBERS = [
  { name:'Ana García',    avatar:'👩' },
  { name:'Carlos López',  avatar:'👨' },
  { name:'María Ruiz',    avatar:'👩‍💼' },
  { name:'David Martín',  avatar:'🧑' },
  { name:'Sofía Torres',  avatar:'👩‍🎓' },
];

const F30_MISSIONS = [
  { id:'m1', title:'Completad 3 módulos entre todos', target:3, type:'mods' },
  { id:'m2', title:'Ganad 500 XP en grupo esta semana', target:500, type:'xp' },
  { id:'m3', title:'Completad 5 módulos en 7 días', target:5, type:'mods' },
  { id:'m4', title:'Mantened 3 días de racha en el grupo', target:3, type:'streak' },
];

function F30_getWeekKey() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

function F30_init() {
  const wk = F30_getWeekKey();
  if (!S.groupMission || S.groupMission.weekKey !== wk) {
    // New week: new mission
    const mission = F30_MISSIONS[Math.floor(Math.random() * F30_MISSIONS.length)];
    S.groupMission = {
      weekKey: wk,
      missionId: mission.id,
      userProgress: 0,
      memberProgress: F30_MEMBERS.map(m => ({
        name: m.name,
        avatar: m.avatar,
        progress: Math.floor(Math.random() * Math.ceil(mission.target * 0.6))
      })),
      userLastActiveKey: null,
    };
    saveState();
  }
}

function F30_getMission() {
  return F30_MISSIONS.find(m => m.id === (S.groupMission?.missionId || 'm1')) || F30_MISSIONS[0];
}

function F30_getTotalProgress() {
  if (!S.groupMission) return 0;
  const memberTotal = (S.groupMission.memberProgress || []).reduce((a, m) => a + m.progress, 0);
  return memberTotal + (S.groupMission.userProgress || 0);
}

function F30_render() {
  const el = document.getElementById('f30-group-mission');
  if (!el) return;

  F30_init();
  const gm = S.groupMission;
  const mission = F30_getMission();
  const total = F30_getTotalProgress();
  const pct = Math.min(100, Math.round((total / mission.target) * 100));
  const done = total >= mission.target;

  const todayKey = new Date().toISOString().slice(0, 10);
  const userInactive = gm.userLastActiveKey && gm.userLastActiveKey !== todayKey;
  const daysSinceActive = userInactive ? Math.floor((Date.now() - new Date(gm.userLastActiveKey)) / 86400000) : 0;

  el.innerHTML = `
    <div class="f30-card${done ? ' f30-done' : ''}">
      <div class="f30-header">
        <span class="f30-icon">👥</span>
        <span class="f30-title">Misión Grupal</span>
        <span class="f30-week-badge">Esta semana</span>
      </div>
      <div class="f30-mission-text">"${mission.title}"</div>
      ${userInactive && daysSinceActive >= 2 ? `<div class="f30-nudge">⚠️ Llevas ${daysSinceActive} días sin contribuir al grupo. ¡Tus compañeros te necesitan!</div>` : ''}
      <div class="f30-progress-bar">
        <div class="f30-progress-fill ${done ? 'f30-fill-done' : ''}" style="width:${pct}%"></div>
      </div>
      <div class="f30-progress-label">${total}/${mission.target} ${done ? '✓ ¡Completada!' : ''}</div>
      <div class="f30-members">
        ${F30_MEMBERS.map((m, i) => {
          const mp = (gm.memberProgress || [])[i];
          const prog = mp ? mp.progress : 0;
          const contrib = prog > 0;
          return `<div class="f30-member ${contrib ? 'f30-member-active' : ''}">
            <div class="f30-member-av">${m.avatar}</div>
            <div class="f30-member-name">${m.name.split(' ')[0]}</div>
            <div class="f30-member-prog">${prog}</div>
          </div>`;
        }).join('')}
        <div class="f30-member f30-member-you ${(gm.userProgress||0) > 0 ? 'f30-member-active' : ''}">
          <div class="f30-member-av">🙋</div>
          <div class="f30-member-name">Tú</div>
          <div class="f30-member-prog">${gm.userProgress || 0}</div>
        </div>
      </div>
    </div>`;
}

function F30_recordModuleComplete() {
  if (!S.groupMission) F30_init();
  const todayKey = new Date().toISOString().slice(0, 10);
  S.groupMission.userProgress = (S.groupMission.userProgress || 0) + 1;
  S.groupMission.userLastActiveKey = todayKey;

  // Simulate other members progressing
  S.groupMission.memberProgress = S.groupMission.memberProgress.map(m => {
    if (Math.random() < 0.35 && m.progress < F30_getMission().target) {
      return { ...m, progress: m.progress + 1 };
    }
    return m;
  });
  saveState();
  F30_render();
}

window.F30_render              = F30_render;
window.F30_recordModuleComplete = F30_recordModuleComplete;
window.F30_init                = F30_init;

/* ══════════════════════════════════════════════════════════════════
   F31 — BADGES DE IDENTIDAD EVOLUTIVOS
   Badges que evolucionan según decisiones y logros del usuario.
   Visibles bajo el avatar en el perfil y en el ranking.
══════════════════════════════════════════════════════════════════ */

function F31_getBadges() {
  const badges = [];
  const completed = new Set(S.completedMods || []);
  const streak = S.streak || 0;
  const xp = S.xp || 0;
  const hasRealPatrimony = S.realPatrimony > 0 || (S.realAssets && S.realAssets.length > 0);

  // Indexador: 3+ módulos de ETF/Inversión
  const etfMods = [1, 7, 16, 26, 30, 36, 66];
  const etfDone = etfMods.filter(id => completed.has(id)).length;
  if (etfDone >= 3) badges.push({ id:'indexador', icon:'📊', label:'Indexador', desc:`Has completado ${etfDone} módulos de inversión`, color:'#60a5fa' });

  // Racha 60 días: corona
  if (streak >= 60) badges.push({ id:'corona', icon:'👑', label:'Rey de la Racha', desc:`${streak} días consecutivos`, color:'#fbbf24' });
  else if (streak >= 30) badges.push({ id:'fuego', icon:'🔥', label:'En Llamas', desc:`${streak} días de racha`, color:'#fb923c' });
  else if (streak >= 7) badges.push({ id:'racha', icon:'⚡', label:'Con Racha', desc:`${streak} días seguidos`, color:'#a855f7' });

  // Inversor Real: patrimonio configurado
  if (hasRealPatrimony) badges.push({ id:'real', icon:'💼', label:'Inversor Real', desc:'Patrimonio real configurado', color:'#00e5a0' });

  // Maestro: 20+ módulos
  if (completed.size >= 20) badges.push({ id:'maestro', icon:'🎓', label:'Maestro', desc:`${completed.size} módulos completados`, color:'#c084fc' });
  else if (completed.size >= 10) badges.push({ id:'avanzado', icon:'📚', label:'Avanzado', desc:`${completed.size} módulos`, color:'#60a5fa' });
  else if (completed.size >= 5) badges.push({ id:'aprendiz', icon:'🌱', label:'Aprendiz', desc:`${completed.size} módulos`, color:'#00e5a0' });
  else if (completed.size >= 1) badges.push({ id:'inicio', icon:'🚀', label:'Comenzando', desc:'Primer módulo completado', color:'#fb923c' });

  // XP milestones
  if (xp >= 5000) badges.push({ id:'xp5k', icon:'💎', label:'Élite', desc:`${xp.toLocaleString()} XP totales`, color:'#fbbf24' });
  else if (xp >= 1000) badges.push({ id:'xp1k', icon:'⭐', label:'Estrella', desc:`${xp.toLocaleString()} XP`, color:'#fbbf24' });

  return badges;
}

function F31_renderBadges(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const badges = F31_getBadges();
  if (badges.length === 0) {
    el.innerHTML = '<div class="f31-no-badges">Completa módulos para ganar badges</div>';
    return;
  }
  el.innerHTML = badges.map(b => `
    <div class="f31-badge" title="${b.desc}" style="--badge-color:${b.color}">
      <div class="f31-badge-icon">${b.icon}</div>
      <div class="f31-badge-label">${b.label}</div>
    </div>`).join('');
}

window.F31_getBadges    = F31_getBadges;
window.F31_renderBadges = F31_renderBadges;

/* ══════════════════════════════════════════════════════════════════
   F32 — LIGAS SEMANALES
   Grupos de ~20 usuarios simulados por nivel. 4 ligas: Bronce → Plata → Oro → Diamante.
   Top 5 por XP semanal suben de liga, los 5 últimos bajan.
   Palanca psicológica: Loss aversion — el miedo a bajar retiene más que el deseo de subir.
   Persiste en S.league, S.leagueWeekXP, S.leagueWeekXPBase, S.leagueWeekKey, S.leagueSeed.
══════════════════════════════════════════════════════════════════ */

// ── Configuración de ligas ──────────────────────────────────────
const F32_LEAGUES = {
  bronze:  { id:'bronze',  label:'Bronce',   icon:'🥉', next:'silver',  prev:null,       color:'#cd7f32', pos:0 },
  silver:  { id:'silver',  label:'Plata',    icon:'🥈', next:'gold',    prev:'bronze',   color:'#c0c0c0', pos:1 },
  gold:    { id:'gold',    label:'Oro',      icon:'🥇', next:'diamond', prev:'silver',   color:'#ffd700', pos:2 },
  diamond: { id:'diamond', label:'Diamante', icon:'💎', next:null,      prev:'gold',     color:'#a5f3fc', pos:3 },
};

// Rivales con nombres españoles realistas, con avatares variados
const F32_RIVAL_POOL = [
  { name:'Alejandro M.', av:'👨' }, { name:'Sofía R.',      av:'👩' },
  { name:'Carlos P.',    av:'🧑' }, { name:'María G.',      av:'👩‍💼' },
  { name:'David L.',     av:'👨‍💻' }, { name:'Lucía T.',      av:'👩‍🎓' },
  { name:'Javier S.',    av:'👨‍🏫' }, { name:'Ana C.',        av:'🧕' },
  { name:'Pablo F.',     av:'🧔' }, { name:'Isabel V.',     av:'👩‍🔬' },
  { name:'Miguel A.',    av:'👴' }, { name:'Cristina B.',   av:'👩‍🏫' },
  { name:'Roberto N.',   av:'👨‍🏭' }, { name:'Laura E.',      av:'💁‍♀️' },
  { name:'Sergio O.',    av:'🙎‍♂️' }, { name:'Patricia K.',   av:'👩‍🎨' },
  { name:'Andrés H.',    av:'🧑‍🎤' }, { name:'Carmen D.',     av:'🧓' },
  { name:'Rubén I.',     av:'👦' }, { name:'Nuria W.',      av:'👧' },
  { name:'Álvaro J.',    av:'🧑‍💼' }, { name:'Beatriz Q.',    av:'🙆‍♀️' },
  { name:'Fernando U.',  av:'👨‍🎓' }, { name:'Raquel Y.',     av:'👱‍♀️' },
  { name:'Jorge Z.',     av:'🧑‍🏫' }, { name:'Marta X.',      av:'🧑‍🎓' },
];

// Rangos de XP semanal por liga (para simular rivales creíbles)
const F32_RIVAL_XP_RANGES = {
  bronze:  [20,  220],
  silver:  [80,  420],
  gold:    [150, 650],
  diamond: [300, 900],
};

// ── Helpers de semana ───────────────────────────────────────────

/** Devuelve la clave de la semana actual en formato 'YYYY-Www' (semana ISO) */
function F32_getWeekKey() {
  const d = new Date();
  const jan4 = new Date(d.getFullYear(), 0, 4); // el 4 de enero siempre está en la semana 1
  const weekNum = Math.ceil(((d - jan4) / 86400000 + jan4.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2,'0')}`;
}

/** Milisegundos hasta el próximo lunes 00:00 */
function F32_msUntilMonday() {
  const now = new Date();
  const ms  = now.getTime();
  const day = now.getDay(); // 0=dom … 6=sáb
  const daysUntilMonday = day === 0 ? 1 : (8 - day) % 7 || 7;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);
  return nextMonday.getTime() - ms;
}

/** Formatea ms como "Xd Xh Xm" */
function F32_formatCountdown(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ── Pseudo-RNG determinista ─────────────────────────────────────
/** LCG simple, seed determinista por semana+liga para que los rivales no cambien al refrescar */
function F32_rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Inicialización y reset semanal ─────────────────────────────

/**
 * F32_init — Inicializa / actualiza el estado de la liga.
 * Debe llamarse en renderHomeScreen y cuando se inicie la app.
 * - Detecta cambio de semana → aplica ascenso/descenso y resetea XP base
 * - Primera vez → asigna seed y clave
 */
function F32_init() {
  const currentWeek = F32_getWeekKey();

  if (!S.leagueWeekKey) {
    // Primera vez: inicializar
    S.leagueWeekKey     = currentWeek;
    S.leagueWeekXPBase  = S.xp || 0;
    S.leagueWeekXP      = 0;
    S.leagueSeed        = Math.floor(Math.random() * 9999999);
    if (!S.league) S.league = 'bronze';
    saveState();
    return;
  }

  if (S.leagueWeekKey !== currentWeek) {
    // ¡Nueva semana! Calcular posición final de la semana anterior
    const weekXP    = Math.max(0, (S.xp || 0) - (S.leagueWeekXPBase || 0));
    const rivals    = F32_generateRivals(S.league, S.leagueSeed);
    const allUsers  = [...rivals, { isYou:true, xp: weekXP }];
    allUsers.sort((a,b) => b.xp - a.xp);
    const yourPos   = allUsers.findIndex(u => u.isYou) + 1; // 1-based
    const total     = allUsers.length;

    const leagueInfo = F32_LEAGUES[S.league] || F32_LEAGUES.bronze;
    const promoted   = yourPos <= 5 && leagueInfo.next !== null;
    const relegated  = yourPos > (total - 5) && leagueInfo.prev !== null;

    const oldLeague = S.league;
    if (promoted)  {
      S.league = leagueInfo.next;
      S.leaguePromotedFrom = oldLeague;
      toast(`🎉 ¡Subiste a liga ${F32_LEAGUES[S.league].label}!`,
        `Quedaste ${yourPos}º la semana pasada. ¡Sigue así!`, 't-success');
    } else if (relegated) {
      S.league = leagueInfo.prev;
      S.leaguePromotedFrom = null;
      toast(`⚠️ Bajaste a liga ${F32_LEAGUES[S.league].label}`,
        `Quedaste ${yourPos}º de ${total}. Esta semana lo recuperas.`, 't-warn');
    } else {
      S.leaguePromotedFrom = null;
    }

    // Resetear para nueva semana
    S.leagueWeekKey    = currentWeek;
    S.leagueWeekXPBase = S.xp || 0;
    S.leagueWeekXP     = 0;
    S.leagueSeed       = Math.floor(Math.random() * 9999999);
    saveState();
  } else {
    // Misma semana: actualizar el XP de esta semana
    S.leagueWeekXP = Math.max(0, (S.xp || 0) - (S.leagueWeekXPBase || 0));
  }
}

// ── Generar rivales ─────────────────────────────────────────────

/**
 * F32_generateRivals — Genera 19 rivales simulados con XP creíble para la liga.
 * Usa seed determinista para que sean estables durante la semana.
 */
function F32_generateRivals(leagueName, seed) {
  const rng   = F32_rng((seed || 1) + (leagueName.charCodeAt(0) || 66));
  const range = F32_RIVAL_XP_RANGES[leagueName] || F32_RIVAL_XP_RANGES.bronze;
  const pool  = [...F32_RIVAL_POOL];

  // Shuffle del pool con rng determinista
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Tomar 19 rivales y asignarles XP aleatorio dentro del rango de la liga
  return pool.slice(0, 19).map(p => ({
    name:  p.name,
    av:    p.av,
    xp:    Math.floor(rng() * (range[1] - range[0])) + range[0],
    isYou: false,
  }));
}

// ── Renderizado ─────────────────────────────────────────────────

let F32_countdownInterval = null;

function F32_render() {
  const el = document.getElementById('f32-league-widget');
  if (!el) return;

  F32_init();

  const league    = F32_LEAGUES[S.league] || F32_LEAGUES.bronze;
  const weekXP    = Math.max(0, (S.xp || 0) - (S.leagueWeekXPBase || 0));
  const rivals    = F32_generateRivals(S.league, S.leagueSeed);
  const you       = { name: S.userName || 'Tú', av: S.avatar || '🌱', xp: weekXP, isYou: true };

  // Construir ranking completo y ordenar
  const allUsers = [...rivals, you];
  allUsers.sort((a, b) => b.xp - a.xp);
  const yourPos  = allUsers.findIndex(u => u.isYou) + 1; // 1-based
  const total    = allUsers.length;

  // Zona de ascenso: posiciones 1-5 / descenso: posiciones 16-20
  const PROMO_ZONE    = 5;
  const RELEGATE_ZONE = total - 5;
  const inDanger      = yourPos > RELEGATE_ZONE && (F32_LEAGUES[S.league] || {}).prev;

  // Determinar qué filas mostrar: 5 por encima y 5 por debajo + tú
  const youIdx    = yourPos - 1; // 0-based
  const showStart = Math.max(0, Math.min(youIdx - 5, total - 11));
  const showEnd   = Math.min(total - 1, showStart + 10);
  const visible   = allUsers.slice(showStart, showEnd + 1);

  // Comprobar aviso de domingo (zona peligro)
  const isSunday = new Date().getDay() === 0;
  if (isSunday && inDanger) {
    const xpToSafe = allUsers[RELEGATE_ZONE - 1].xp - weekXP + 1;
    if (xpToSafe > 0) {
      // Solo avisar una vez por sesión usando un flag de sesión
      if (!window._f32WarnedThisSession) {
        window._f32WarnedThisSession = true;
        setTimeout(() => {
          toast(`⚠️ Liga en peligro — posición ${yourPos}`,
            `Estás a ${xpToSafe} XP de zona segura. ¡Tienes hasta mañana!`, 't-warn');
        }, 3000);
      }
    }
  }

  // Construir HTML
  const badgeClass  = `f32-league-badge f32-badge-${league.id}${S.leaguePromotedFrom ? ' f32-badge-promoted' : ''}`;

  let rowsHTML = '';
  let lastWasYou = false;

  visible.forEach((user, localIdx) => {
    const globalPos = showStart + localIdx + 1; // 1-based global position
    const isPromo   = globalPos <= PROMO_ZONE;
    const isRelegate = globalPos > RELEGATE_ZONE;
    const rowClass  = user.isYou
      ? 'f32-row f32-row-you'
      : isPromo    ? 'f32-row f32-row-promo'
      : isRelegate ? 'f32-row f32-row-relegate'
      : 'f32-row';

    const posClass  = globalPos <= 3 ? 'f32-pos f32-pos-top' : 'f32-pos';
    const posIcon   = globalPos === 1 ? '🥇' : globalPos === 2 ? '🥈' : globalPos === 3 ? '🥉' : globalPos;

    let zoneLabel = '';
    if (isPromo)    zoneLabel = `<span class="f32-zone-label f32-zone-up">▲ SUBE</span>`;
    if (isRelegate) zoneLabel = `<span class="f32-zone-label f32-zone-down">▼ BAJA</span>`;

    const nameClass = user.isYou ? 'f32-name f32-name-you' : 'f32-name';
    const xpClass   = user.isYou ? 'f32-xp-val f32-xp-you' : 'f32-xp-val';

    // Añadir divisor si hay salto en posiciones (solo cuando showStart > 0 y es la primera fila)
    if (localIdx === 0 && showStart > 0) {
      rowsHTML += `<div class="f32-divider">· · ·</div>`;
    }

    rowsHTML += `
      <div class="${rowClass}">
        <div class="${posClass}">${posIcon}</div>
        <div class="f32-av">${user.av}</div>
        <div class="${nameClass}">${user.name}</div>
        ${zoneLabel}
        <div class="${xpClass}">${user.xp.toLocaleString('es-ES')} XP</div>
      </div>`;

    lastWasYou = user.isYou;
  });

  if (showEnd < total - 1) {
    rowsHTML += `<div class="f32-divider">· · ·</div>`;
  }

  const dangerBanner = inDanger
    ? `<div class="f32-warning">⚡ Estás en posición ${yourPos} — zona de descenso. Gana más XP esta semana para mantenerte.</div>`
    : '';

  const msLeft = F32_msUntilMonday();

  el.innerHTML = `
    <div class="f32-wrap">
      <div class="f32-header">
        <div class="${badgeClass}">${league.icon} ${league.label}</div>
        <div class="f32-header-info">
          <div class="f32-header-title">Posición ${yourPos} de ${total}</div>
          <div class="f32-header-sub">Liga semanal · Top 5 ascienden</div>
        </div>
        <div class="f32-week-xp">
          <div class="f32-week-xp-val">${weekXP.toLocaleString('es-ES')}</div>
          <div class="f32-week-xp-lab">XP esta semana</div>
        </div>
      </div>
      <div class="f32-rank-list">${rowsHTML}</div>
      ${dangerBanner}
      <div class="f32-footer">
        <div class="f32-footer-info">🏅 ${PROMO_ZONE} ascienden · ${total - RELEGATE_ZONE} descienden</div>
        <div class="f32-reset-label" id="f32-countdown">Reinicia en ${F32_formatCountdown(msLeft)}</div>
      </div>
    </div>`;

  // Actualizar contador en tiempo real
  if (F32_countdownInterval) clearInterval(F32_countdownInterval);
  F32_countdownInterval = setInterval(() => {
    const cdEl = document.getElementById('f32-countdown');
    if (cdEl) cdEl.textContent = `Reinicia en ${F32_formatCountdown(F32_msUntilMonday())}`;
    else clearInterval(F32_countdownInterval);
  }, 30000);

  // Limpiar flag de promoción después de mostrar la animación
  if (S.leaguePromotedFrom) {
    setTimeout(() => { S.leaguePromotedFrom = null; saveState(); }, 1200);
  }
}

window.F32_render = F32_render;
window.F32_init   = F32_init;

/* ══════════════════════════════════════════════════════════════════
   F33 — STREAK IDENTITY UPGRADE
   El streak como identidad visual progresiva de 5 tiers.
   Sistema Earn Back: 24h para recuperar la racha completando 2 módulos.
   Persiste en S.streakBrokeAt, S.streakEarnBackMods.
══════════════════════════════════════════════════════════════════ */

// ── Configuración de tiers ──────────────────────────────────────
const F33_TIERS = [
  { min:   0, max:   6, tier: 0, label: 'Racha inicial',   navClass: '',       icon: '🔥' },
  { min:   7, max:  29, tier: 1, label: 'En racha',        navClass: 'f33-t1', icon: '🔥' },
  { min:  30, max:  59, tier: 2, label: 'Imparable',       navClass: 'f33-t2', icon: '👑🔥' },
  { min:  60, max:  99, tier: 3, label: 'Aura de élite',   navClass: 'f33-t3', icon: '🔥' },
  { min: 100, max: Infinity, tier: 4, label: 'Leyenda',    navClass: 'f33-t4', icon: '🌟🔥' },
];

/** Devuelve el tier object para un valor de streak dado */
function F33_getTier(streak) {
  return F33_TIERS.find(t => streak >= t.min && streak <= t.max) || F33_TIERS[0];
}

// ── Nav pill: actualización visual ─────────────────────────────

/**
 * F33_updateNavStreak — Actualiza el nav-pill de streak con el tier visual correcto.
 * Sustituye al setEl simple para los 3 puntos donde se llama en updateUIFromState.
 */
function F33_updateNavStreak() {
  const streak = S.streak || 0;
  const tierObj = F33_getTier(streak);

  // Actualizar número
  const numEl = document.getElementById('nav-streak');
  if (numEl) numEl.textContent = streak;

  // Actualizar clase tier en el pill
  const pill = numEl ? numEl.closest('.nav-pill.streak') : null;
  if (!pill) return;

  // Limpiar clases anteriores de F33
  pill.classList.remove('f33-t1', 'f33-t2', 'f33-t3', 'f33-t4');

  if (tierObj.tier > 0) {
    pill.classList.add(tierObj.navClass);
  }

  // Emoji del tier delante del número
  const textBefore = pill.childNodes[0]; // textNode "🔥 "
  if (textBefore && textBefore.nodeType === Node.TEXT_NODE) {
    textBefore.textContent = tierObj.icon + ' ';
  }

  // Tier 4: partícula flotante
  let particle = pill.querySelector('.f33-particle');
  if (tierObj.tier === 4) {
    if (!particle) {
      particle = document.createElement('span');
      particle.className = 'f33-particle';
      particle.textContent = '✨';
      pill.appendChild(particle);
    }
  } else if (particle) {
    particle.remove();
  }
}

// ── Earn Back system ────────────────────────────────────────────

/**
 * F33_checkEarnBack — Llamada cada vez que el usuario completa un módulo.
 * Si está en ventana de Earn Back (24h tras romper racha):
 *   - Incrementa contador de módulos
 *   - Si llega a 2: restaura racha a 1 con animación especial
 */
function F33_checkEarnBack() {
  if (!S.streakBrokeAt) return;

  const now        = Date.now();
  const msElapsed  = now - S.streakBrokeAt;
  const WINDOW_24H = 24 * 60 * 60 * 1000;

  if (msElapsed > WINDOW_24H) {
    // Expiró la ventana de Earn Back — limpiar
    S.streakBrokeAt      = null;
    S.streakEarnBackMods = 0;
    saveState();
    return;
  }

  // Dentro de la ventana: contar módulo
  S.streakEarnBackMods = (S.streakEarnBackMods || 0) + 1;

  if (S.streakEarnBackMods >= 2) {
    // ¡Racha recuperada!
    S.streak             = 1;
    S.streakBrokeAt      = null;
    S.streakEarnBackMods = 0;
    saveState();

    // Animación y mensaje de recuperación
    setTimeout(() => {
      toast('⚡ ¡Racha recuperada!',
        '2 módulos seguidos. Tu constancia te define. Sigue así.', 't-success');
      if (typeof spawnXP === 'function') spawnXP('+¡RACHA!');
    }, 800);

    // Actualizar banner y nav
    if (typeof F33_renderBanner     === 'function') F33_renderBanner();
    if (typeof F33_updateNavStreak  === 'function') F33_updateNavStreak();
  } else {
    // Primer módulo completado — actualizar banner para mostrar progreso
    saveState();
    if (typeof F33_renderBanner === 'function') F33_renderBanner();
    toast('⚡ ¡Módulo 1/2!',
      'Un módulo más y recuperas tu racha. ¡No pares ahora!', 't-warn');
  }
}

// ── Banner Earn Back en el home ─────────────────────────────────

let _f33BannerInterval = null;

/**
 * F33_renderBanner — Renderiza (o esconde) el banner de "Racha en peligro"
 * en el div #f33-earn-back-banner del home.
 */
function F33_renderBanner() {
  const el = document.getElementById('f33-earn-back-banner');
  if (!el) return;

  // Limpiar timer anterior
  if (_f33BannerInterval) { clearInterval(_f33BannerInterval); _f33BannerInterval = null; }

  // Sin streakBrokeAt → ocultar
  if (!S.streakBrokeAt) { el.style.display = 'none'; return; }

  const now        = Date.now();
  const WINDOW_24H = 24 * 60 * 60 * 1000;
  const msLeft     = (S.streakBrokeAt + WINDOW_24H) - now;

  if (msLeft <= 0) {
    // Ventana expirada — limpiar estado y ocultar
    S.streakBrokeAt      = null;
    S.streakEarnBackMods = 0;
    saveState();
    el.style.display = 'none';
    return;
  }

  el.style.display = 'block';

  const modsLeft = Math.max(0, 2 - (S.streakEarnBackMods || 0));
  const done0    = (S.streakEarnBackMods || 0) >= 1;
  const done1    = (S.streakEarnBackMods || 0) >= 2;

  function _formatTime(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  el.innerHTML = `
    <div class="f33-earn-back">
      <div class="f33-earn-back-icon">⚡</div>
      <div class="f33-earn-back-body">
        <div class="f33-earn-back-title">Racha en peligro — completa ${modsLeft} módulo${modsLeft !== 1 ? 's' : ''} más</div>
        <div class="f33-earn-back-sub">Tienes ${_formatTime(msLeft)} para recuperar tu racha completando 2 módulos seguidos. No te regala nada — la conquistas.</div>
        <div class="f33-earn-back-dots">
          <div class="f33-dot${done0 ? ' done' : ''}"></div>
          <div class="f33-dot${done1 ? ' done' : ''}"></div>
        </div>
      </div>
      <div class="f33-earn-back-timer" id="f33-banner-timer">${_formatTime(msLeft)}</div>
    </div>`;

  // Actualizar countdown cada minuto
  _f33BannerInterval = setInterval(() => {
    if (!S.streakBrokeAt) { clearInterval(_f33BannerInterval); F33_renderBanner(); return; }
    const msl = (S.streakBrokeAt + WINDOW_24H) - Date.now();
    const timerEl = document.getElementById('f33-banner-timer');
    if (timerEl) timerEl.textContent = _formatTime(Math.max(0, msl));
    if (msl <= 0) {
      if (_f33BannerInterval) clearInterval(_f33BannerInterval);
      F33_renderBanner(); // re-render para ocultar
    }
  }, 60000);
}

window.F33_updateNavStreak = F33_updateNavStreak;
window.F33_getTier         = F33_getTier;
window.F33_checkEarnBack   = F33_checkEarnBack;
window.F33_renderBanner    = F33_renderBanner;

/* ══════════════════════════════════════════════════════════════════
   F34 — RETO DIARIO CON CUENTA ATRÁS
   Un reto nuevo cada día generado a las 00:00.
   Tipos: module (rama), xp, quiz, streak.
   Premio: XP extra + badge temporal único (no recuperable).
   FOMO temporal: desaparece a medianoche con animación de expirado.
   Persiste: S.dailyChallengeKey, S.dailyChallengeCompleted,
             S.dailyChallengeClaimed, S.dailyChallengeProgress,
             S.dailyChallengeType, S.dailyChallengeTag,
             S.dailyChallengeTarget, S.dailyChallengeXPReward.
══════════════════════════════════════════════════════════════════ */

// ── Configuración de tipos de reto ─────────────────────────────
const F34_CHALLENGE_TYPES = [
  {
    type: 'module',
    icon: '📚',
    label: 'Reto de Módulo',
    generate(seed) {
      // Elegir una rama aleatoria con módulos no completados
      const tags = ['FUNDAMENTAL','INVERSIÓN','MENTALIDAD','PSICOLOGÍA',
                    'FISCALIDAD','VIVIENDA','PRESUPUESTO','DEUDA','FIRE',
                    'DIVIDENDOS','MERCADOS','JUBILACIÓN','CRYPTO','AHORRO'];
      const rng = F34_rng(seed + 1);
      const tag = tags[Math.floor(rng() * tags.length)];
      const pendingMods = (typeof MODULES !== 'undefined' && Array.isArray(S.completedMods))
        ? MODULES.filter(m => m && typeof m.id === 'number' && !S.completedMods.includes(m.id) && m.tag && m.tag.toUpperCase().includes(tag))
        : [];
      const rng2 = F34_rng(seed + 7);
      const picked = pendingMods.length > 0 ? pendingMods[Math.floor(rng2() * pendingMods.length)] : null;
      return {
        tag,
        target: 1,
        xpReward: 100 + Math.floor(rng() * 5) * 25,  // 100, 125, 150, 175, 200
        desc: `Completa 1 módulo de la rama <strong>${tag}</strong> antes de medianoche.`,
        moduleId: picked ? picked.id : null,
      };
    },
  },
  {
    type: 'xp',
    icon: '⚡',
    label: 'Reto de XP',
    generate(seed) {
      const rng = F34_rng(seed + 2);
      const targets = [50, 75, 100, 150, 200];
      const target = targets[Math.floor(rng() * targets.length)];
      return {
        tag: '',
        target,
        xpReward: Math.round(target * 0.5),
        desc: `Gana <strong>${target} XP</strong> hoy completando módulos o quizzes.`,
      };
    },
  },
  {
    type: 'quiz',
    icon: '🎯',
    label: 'Reto de Quizzes',
    generate(seed) {
      const rng = F34_rng(seed + 3);
      const targets = [3, 5, 7, 10];
      const target = targets[Math.floor(rng() * targets.length)];
      return {
        tag: '',
        target,
        xpReward: target * 15,
        desc: `Responde correctamente <strong>${target} quiz${target > 1 ? 'zes' : ''}</strong> hoy.`,
      };
    },
  },
  {
    type: 'streak',
    icon: '🔥',
    label: 'Reto de Racha',
    generate(seed) {
      return {
        tag: '',
        target: 1,
        xpReward: 75,
        desc: 'Mantén tu <strong>racha activa</strong> completando al menos 1 módulo hoy.',
      };
    },
  },
];

// ── Pseudo-RNG determinista (mismo patrón que F32) ──────────────
function F34_rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Key de hoy ──────────────────────────────────────────────────
function F34_todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/** Milisegundos hasta medianoche */
function F34_msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function F34_formatCountdown(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0)  return `${h}h ${String(m).padStart(2,'0')}m`;
  if (m >= 1) return `${m}m ${String(s).padStart(2,'0')}s`;
  return `${s}s`;
}

// ── Generación del reto del día ─────────────────────────────────

/**
 * F34_getOrGenerate — Devuelve el reto del día, generándolo si es nuevo.
 * Usa la fecha como seed para que el reto sea determinista (mismo para todos).
 */
function F34_getOrGenerate() {
  const today = F34_todayKey();

  // Si es un día nuevo o no hay reto, generar uno nuevo
  if (S.dailyChallengeKey !== today) {
    // Seed basado en fecha + id de usuario (stable pero único)
    const dateSeed = parseInt(today.replace(/-/g, ''), 10) % 9999999;
    const rng = F34_rng(dateSeed);

    // Elegir tipo de reto de forma rotativa pero con algo de azar
    const typeIdx = Math.floor(rng() * F34_CHALLENGE_TYPES.length);
    const typeDef = F34_CHALLENGE_TYPES[typeIdx];
    const generated = typeDef.generate(dateSeed);

    S.dailyChallengeKey       = today;
    S.dailyChallengeType      = typeDef.type;
    S.dailyChallengeTag       = generated.tag || '';
    S.dailyChallengeTarget    = generated.target;
    S.dailyChallengeXPReward  = generated.xpReward;
    S.dailyChallengeCompleted = false;
    S.dailyChallengeClaimed   = false;
    S.dailyChallengeProgress  = 0;
    saveState();
  }

  const typeDef = F34_CHALLENGE_TYPES.find(t => t.type === S.dailyChallengeType)
    || F34_CHALLENGE_TYPES[0];

  return {
    type:      S.dailyChallengeType,
    tag:       S.dailyChallengeTag,
    target:    S.dailyChallengeTarget,
    xpReward:  S.dailyChallengeXPReward,
    progress:  S.dailyChallengeProgress || 0,
    completed: S.dailyChallengeCompleted,
    claimed:   S.dailyChallengeClaimed,
    icon:      typeDef.icon,
    label:     typeDef.label,
    desc:      typeDef.generate(parseInt(today.replace(/-/g,''),10) % 9999999).desc,
  };
}

// ── Hooks de progreso ───────────────────────────────────────────

/** Llamado cuando se completa un módulo (hookea F34 tipo 'module' y 'streak') */
function F34_onModuleComplete(mod) {
  if (S.dailyChallengeKey !== F34_todayKey()) return;
  if (S.dailyChallengeCompleted) return;

  const type = S.dailyChallengeType;
  let advanced = false;

  if (type === 'streak') {
    S.dailyChallengeProgress = 1;
    advanced = true;
  } else if (type === 'module') {
    const modTag = (mod && mod.tag) ? mod.tag : '';
    if (modTag === S.dailyChallengeTag || S.dailyChallengeTag === '') {
      S.dailyChallengeProgress = (S.dailyChallengeProgress || 0) + 1;
      advanced = true;
    }
  }

  if (advanced) F34_checkComplete();
}

/** Llamado cuando se responde correctamente un quiz */
function F34_onQuizCorrect() {
  if (S.dailyChallengeKey !== F34_todayKey()) return;
  if (S.dailyChallengeCompleted) return;
  if (S.dailyChallengeType !== 'quiz') return;

  S.dailyChallengeProgress = (S.dailyChallengeProgress || 0) + 1;
  F34_checkComplete();
}

/** Llamado cuando se gana XP (hookear desde el sitio central de ganancia XP) */
function F34_onXPGained(amount) {
  if (S.dailyChallengeKey !== F34_todayKey()) return;
  if (S.dailyChallengeCompleted) return;
  if (S.dailyChallengeType !== 'xp') return;

  S.dailyChallengeProgress = (S.dailyChallengeProgress || 0) + (amount || 0);
  F34_checkComplete();
}

/** Comprueba si el reto está completado y actualiza estado */
function F34_checkComplete() {
  if (S.dailyChallengeProgress >= S.dailyChallengeTarget) {
    S.dailyChallengeCompleted = true;
    saveState();
    // Re-renderizar para mostrar CTA de reclamar
    if (typeof F34_render === 'function') setTimeout(F34_render, 100);
    toast('🎯 ¡Reto diario completado!',
      `Reclama tu premio: +${S.dailyChallengeXPReward} XP`, 't-success');
  } else {
    saveState();
    if (typeof F34_render === 'function') setTimeout(F34_render, 100);
  }
}

/** F34_claim — El usuario reclama el premio del reto completado */
function F34_claim() {
  if (!S.dailyChallengeCompleted || S.dailyChallengeClaimed) return;
  if (S.dailyChallengeKey !== F34_todayKey()) return;

  const xp = S.dailyChallengeXPReward || 100;
  S.xp += xp;
  S.dailyChallengeClaimed = true;
  saveState();

  spawnXP('+' + xp + ' XP');
  if (typeof confetti === 'function') confetti();

  // Badge temporal del día
  if (!Array.isArray(S.surpriseBadges)) S.surpriseBadges = [];
  const today = F34_todayKey();
  S.surpriseBadges.push(`🎯 Reto ${today}`);
  if (S.surpriseBadges.length > 200) S.surpriseBadges = S.surpriseBadges.slice(-200);
  saveState();

  if (typeof checkAchievements === 'function') checkAchievements();
  if (typeof F34_render === 'function') F34_render();
}

// ── Countdown timer ─────────────────────────────────────────────
let _f34Interval = null;

// ── Renderizado ─────────────────────────────────────────────────

function F34_render() {
  const el = document.getElementById('f34-daily-challenge');
  if (!el) return;

  // Limpiar timer anterior
  if (_f34Interval) { clearInterval(_f34Interval); _f34Interval = null; }

  const ch = F34_getOrGenerate();
  const msLeft = F34_msUntilMidnight();
  const pct = ch.target > 0
    ? Math.min(100, Math.round((ch.progress / ch.target) * 100))
    : 0;
  const isUrgent = msLeft < 2 * 3600 * 1000; // < 2 horas

  // Construir HTML según estado
  let stateClass, tagClass, tagLabel, bodyHTML;

  if (ch.claimed) {
    // ── Estado: RECLAMADO ──────────────────────────────────────
    stateClass = 'f34-done';
    tagClass   = 'f34-tag-done';
    tagLabel   = '✅ COMPLETADO';
    bodyHTML   = `
      <div class="f34-body">
        <div class="f34-claimed-banner">
          <span style="font-size:22px;">${ch.icon}</span>
          <span>Reto de hoy superado · <strong>+${ch.xpReward} XP</strong> reclamados. Vuelve mañana para el siguiente.</span>
        </div>
      </div>`;

  } else if (ch.completed) {
    // ── Estado: COMPLETADO — pendiente de reclamar ─────────────
    stateClass = 'f34-done';
    tagClass   = 'f34-tag-done';
    tagLabel   = '🎯 ¡COMPLETADO!';
    bodyHTML   = `
      <div class="f34-body">
        <div class="f34-desc">${ch.desc}</div>
        <div class="f34-reward-row">
          <div class="f34-reward-icon">🏆</div>
          <div class="f34-reward-text">Premio de hoy (sólo disponible hoy)</div>
          <div class="f34-reward-xp">+${ch.xpReward} XP</div>
        </div>
        <button class="f34-claim-btn f34-pulse-cta" onclick="F34_claim()">
          🎁 Reclamar premio
        </button>
      </div>`;

  } else {
    // ── Estado: ACTIVO — en progreso ───────────────────────────
    stateClass = 'f34-active';
    tagClass   = 'f34-tag-active';
    tagLabel   = '⏳ RETO DE HOY';

    const progressHTML = `
      <div class="f34-progress-wrap${pct === 100 ? ' f34-progress-done' : ''}">
        <div class="f34-progress-bar">
          <div class="f34-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="f34-progress-label">
          <span>Progreso</span>
          <span>${ch.progress} / ${ch.target}${ch.type === 'xp' ? ' XP' : ''}</span>
        </div>
      </div>`;

    bodyHTML = `
      <div class="f34-body">
        <div class="f34-desc">${ch.desc}</div>
        ${progressHTML}
        ${(ch.type === 'module' && ch.moduleId != null)
          ? `<button onclick="openModule(${ch.moduleId})" style="margin-top:8px;width:100%;padding:10px;background:rgba(0,229,160,.1);border:1px solid rgba(0,229,160,.25);border-radius:10px;color:var(--accent);font-weight:700;font-size:12px;cursor:pointer;">→ Ir al módulo del reto</button>`
          : ''}
        <div class="f34-reward-row">
          <div class="f34-reward-icon">🎁</div>
          <div class="f34-reward-text">Premio único de hoy — expira a medianoche</div>
          <div class="f34-reward-xp">+${ch.xpReward} XP</div>
        </div>
      </div>`;
  }

  const countdownClass = isUrgent && !ch.claimed ? ' f34-countdown-urgent' : '';
  const countdownHTML = !ch.claimed ? `
    <div class="f34-countdown-pill${countdownClass}" id="f34-cd-pill">
      <div class="f34-countdown-val" id="f34-cd-val">${F34_formatCountdown(msLeft)}</div>
      <div class="f34-countdown-lab">restante</div>
    </div>` : '';

  el.innerHTML = `
    <div class="f34-wrap ${stateClass}" id="f34-inner">
      <div class="f34-header">
        <div class="f34-type-icon">${ch.icon}</div>
        <div class="f34-header-body">
          <div class="f34-header-title">${ch.label}</div>
          <div class="f34-header-sub">Nuevo reto cada día · No se puede recuperar</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
          <div class="f34-tag ${tagClass}">${tagLabel}</div>
          ${countdownHTML}
        </div>
      </div>
      ${bodyHTML}
    </div>`;

  // Ticker de cuenta atrás en tiempo real (solo si no está reclamado)
  if (!ch.claimed) {
    _f34Interval = setInterval(() => {
      const cdEl = document.getElementById('f34-cd-val');
      const pillEl = document.getElementById('f34-cd-pill');
      const ms = F34_msUntilMidnight();

      if (ms <= 0) {
        // Expirado — animación y re-render
        clearInterval(_f34Interval);
        const inner = document.getElementById('f34-inner');
        if (inner) inner.classList.add('f34-expire-anim');
        setTimeout(() => F34_render(), 900);
        return;
      }

      if (cdEl) cdEl.textContent = F34_formatCountdown(ms);
      if (pillEl) {
        if (ms < 2 * 3600 * 1000) pillEl.classList.add('f34-countdown-urgent');
        else pillEl.classList.remove('f34-countdown-urgent');
      }
    }, 1000);
  }
}

window.F34_render           = F34_render;
window.F34_claim            = F34_claim;
window.F34_onModuleComplete = F34_onModuleComplete;
window.F34_onQuizCorrect    = F34_onQuizCorrect;
window.F34_onXPGained       = F34_onXPGained;
window.F34_checkComplete    = F34_checkComplete;


/* ══════════════════════════════════════════════════════════════════
   F41 — ESCUDO DE RACHA (UI visible en home)
   ─────────────────────────────────────────────────────────────────
   La lógica de consumo ya está en loadState().
   Aquí sólo la función de compra con XP y el render del icono
   en el header de la home (si existe el elemento #streak-shield-icon).
══════════════════════════════════════════════════════════════════ */

function F41_buyShield() {
  // Los escudos NO se compran con XP — solo se consiguen en cofres o en rachas hito
  toast('🛡️ Escudos de Racha', 'Los escudos no se compran — se consiguen en los cofres o al alcanzar rachas hito (7, 14, 30, 100 días). ¡Sigue estudiando!', 't-info');
}

function F41_renderShield() {
  const el = document.getElementById('streak-shield-icon');
  if (!el) return;
  const n = S.streakShields || 0;
  if (n > 0) {
    el.innerHTML = `<span class="shield-icon shield-active" title="${n} escudo(s) — protege tu racha si pierdes un día" onclick="F41_buyShield()">🛡️<span class="shield-count">${n}</span></span>`;
  } else {
    el.innerHTML = `<span class="shield-icon shield-empty" title="Sin escudos — gánalos en los cofres" onclick="F41_buyShield()">🛡️</span>`;
  }
}

window.F41_buyShield  = F41_buyShield;
window.F41_renderShield = F41_renderShield;


/* ══════════════════════════════════════════════════════════════════
   F42 — PROBLEMA FINANCIERO DEL DÍA
   ─────────────────────────────────────────────────────────────────
   90 problemas, se selecciona por índice del día del año.
   Máx 3 intentos. Botón compartir Wordle-style.
══════════════════════════════════════════════════════════════════ */

const DAILY_PROBLEMS = [
  { q: '¿Cuál es la regla del 72 para doblar tu inversión?', opts: ['Divide 72 entre el tipo de interés anual', 'Multiplica 72 por el número de años', 'Suma 72 al rendimiento esperado', 'Divide el capital entre 72'], ans: 0, exp: 'La regla del 72 dice: 72 ÷ tipo de interés = años para doblar. Con un 6% anual doblas en 12 años.' },
  { q: 'Tienes €10.000. ¿Cuánto tendrás en 10 años con un 7% anual compuesto?', opts: ['€17.000', '€19.672', '€17.500', '€21.000'], ans: 1, exp: '10.000 × (1,07)^10 = €19.672. El interés compuesto acelera el crecimiento con el tiempo.' },
  { q: '¿Qué es el "expense ratio" de un ETF?', opts: ['El coste anual de gestión sobre el patrimonio', 'El beneficio anual del ETF', 'La diferencia entre precio de compra y venta', 'El dividendo anual del ETF'], ans: 0, exp: 'El expense ratio es el coste anual de gestión cobrado sobre el patrimonio del fondo. Un 0,1% es barato; 2% es caro.' },
  { q: 'Un presupuesto sigue la regla 50/30/20. ¿Qué porcentaje va a ahorro?', opts: ['50%', '30%', '20%', '10%'], ans: 2, exp: '50% necesidades, 30% deseos, 20% ahorro e inversión. Es una guía básica muy efectiva.' },
  { q: 'Tienes deuda al 18% y una inversión que da 7%. ¿Qué haces primero?', opts: ['Invertir, siempre maximizar retorno', 'Pagar la deuda del 18% primero', 'Hacer las dos cosas a partes iguales', 'Ignorar la deuda por ahora'], ans: 1, exp: 'Pagar deuda al 18% es un retorno garantizado del 18%. Ninguna inversión te da eso de forma segura.' },
  { q: '¿Qué es la diversificación en inversión?', opts: ['Concentrar todo en el activo más rentable', 'Distribuir el capital entre distintos activos para reducir riesgo', 'Invertir solo en índices', 'Cambiar de inversión cada semana'], ans: 1, exp: 'Diversificar reduce el riesgo sin reducir el retorno esperado a largo plazo. Es la única comida gratis en finanzas.' },
  { q: 'Un ETF del S&P 500 cae 30%. ¿Cuál es la mejor acción histórica?', opts: ['Vender todo y esperar', 'Comprar más aprovechando el descuento', 'No hacer nada y esperar', 'Las opciones B y C son correctas'], ans: 3, exp: 'Históricamente, mantener y comprar en caídas maximiza el retorno a largo plazo. Vender es casi siempre el peor movimiento.' },
  { q: '¿Cuánto necesitas ahorrar para 25 años de "FIRE" con €2.000/mes de gasto?', opts: ['€300.000', '€480.000', '€600.000', '€720.000'], ans: 2, exp: 'Regla del 4%: gasto anual × 25. €24.000 × 25 = €600.000. Esto asegura 30+ años sin agotar el capital.' },
  { q: '¿Qué significa que un bono tiene "vencimiento" a 10 años?', opts: ['Que solo puedes venderlo en 10 años', 'Que el emisor devuelve el principal en 10 años', 'Que genera intereses durante 10 meses', 'Que su valor aumenta un 10% al año'], ans: 1, exp: 'Al vencimiento, el emisor del bono devuelve el nominal (principal). Mientras tanto paga cupones (intereses periódicos).' },
  { q: '€500/mes durante 30 años al 7% anual. ¿Cuánto acumulas?', opts: ['€180.000', '€340.000', '€568.000', '€1.000.000'], ans: 2, exp: '€500 × 12 × 30 = €180.000 aportado. El resto (€388.000) es puro interés compuesto. Así funciona invertir regularmente.' },
  { q: '¿Cuál es el mayor error al invertir a largo plazo?', opts: ['Comprar índices globales', 'Salir del mercado en momentos de pánico', 'Reinvertir los dividendos', 'Invertir cada mes independientemente del precio'], ans: 1, exp: 'Vender en pánico cristaliza las pérdidas. Los mercados siempre han recuperado. El tiempo en el mercado bate al timing del mercado.' },
  { q: '¿Qué es el "coste de oportunidad"?', opts: ['El coste de mantener dinero en efectivo', 'Lo que renuncias al elegir una opción sobre otra', 'Los impuestos de una inversión', 'El coste de abrir una cuenta de inversión'], ans: 1, exp: 'Si eliges mantener €10.000 en cuenta corriente en vez de invertirlos al 7%, tu coste de oportunidad es €700/año.' },
  { q: 'Inflación al 3% anual. €100.000 en cuenta sin interés. ¿Cuánto vale en 10 años?', opts: ['€100.000 (mismo valor nominal)', '€130.000', '€74.400', '€85.000'], ans: 2, exp: '100.000 × (0,97)^10 ≈ €74.400 en poder adquisitivo real. La inflación destruye el dinero que no crece.' },
  { q: '¿Qué ventaja fiscal tiene un plan de pensiones en España?', opts: ['Los rendimientos están exentos de impuestos', 'Las aportaciones deducen en la base imponible del IRPF', 'No tributa al rescatarlo', 'Está exento del impuesto de patrimonio'], ans: 1, exp: 'Las aportaciones a planes de pensiones reducen la base imponible del IRPF (hasta €1.500/año en 2024). Al rescatarlo sí tributa.' },
  { q: '¿Qué es el "dollar cost averaging" (DCA)?', opts: ['Comprar solo cuando el mercado baja', 'Invertir una cantidad fija de forma periódica', 'Comprar solo en dólares', 'Calcular el promedio de tus inversiones'], ans: 1, exp: 'DCA = invertir la misma cantidad cada mes, sin importar el precio. Reduce el riesgo de entrar en máximos.' },
  { q: 'Tienes un crédito personal al 8% y un seguro de vida que "rinde" un 4%. ¿Qué deberías hacer?', opts: ['Mantener ambos', 'Cancelar el seguro y pagar el crédito', 'Contratar más seguro', 'Refinanciar el crédito'], ans: 1, exp: 'Si el crédito cuesta más de lo que rinde el seguro, la operación neta es negativa. Cancelar el seguro para pagar deuda cara es mejor.' },
  { q: '¿Cuál de estos activos NO suele estar correlacionado con la bolsa?', opts: ['Acciones tech', 'Bonos del estado a largo plazo', 'ETFs del S&P 500', 'Fondos de renta variable'], ans: 1, exp: 'Los bonos del estado suelen subir cuando la bolsa baja (activo refugio). Son el mejor complemento diversificador clásico.' },
  { q: '¿Qué es la "liquidez" de un activo?', opts: ['Su rentabilidad en el tiempo', 'La facilidad y rapidez para convertirlo en efectivo', 'Su precio en el mercado', 'El dividendo que paga'], ans: 1, exp: 'Un inmueble es poco líquido (meses para vender). Una acción en bolsa es muy líquida (se vende en segundos). La liquidez tiene un precio.' },
  { q: 'La Fed sube los tipos de interés. ¿Qué suele pasar con los bonos existentes?', opts: ['Suben de precio', 'Bajan de precio', 'No cambian', 'Se amortizan anticipadamente'], ans: 1, exp: 'Cuando suben los tipos, los bonos existentes valen menos (pagan menos que los nuevos). Precio del bono y tipos se mueven inversamente.' },
  { q: '¿Cuántas veces multiplica el interés compuesto €1.000 en 30 años al 10%?', opts: ['3 veces (€3.000)', '10 veces (€10.000)', '17 veces (€17.449)', '30 veces (€30.000)'], ans: 2, exp: '1.000 × (1,10)^30 = €17.449. El interés sobre el interés crea un efecto bola de nieve que se dispara en los últimos años.' },
  { q: '¿Qué es el "rebalanceo" de cartera?', opts: ['Cambiar toda la cartera por activos mejores', 'Vender los activos que más han subido y comprar los que más han bajado para mantener la asignación objetivo', 'Reinvertir dividendos', 'Añadir dinero nuevo cada mes'], ans: 1, exp: 'El rebalanceo mantiene tu asignación objetivo (ej: 80% acciones, 20% bonos) y te obliga a comprar barato y vender caro.' },
  { q: '¿Qué ratio usa Buffett para valorar si la bolsa está cara o barata?', opts: ['P/E ratio', 'Ratio de Buffett (capitalización bolsa / PIB)', 'Ratio de Sharpe', 'Beta del mercado'], ans: 1, exp: 'El Buffett Indicator = capitalización total de la bolsa ÷ PIB del país. Por encima de 120% = cara. Por debajo de 80% = barata.' },
  { q: 'Un fondo con "beta de 1,3" significa que:', opts: ['Da un 1,3% más que el mercado', 'Si el mercado sube 10%, sube un 13% (y baja más en caídas)', 'Tiene una volatilidad del 1,3%', 'Cobra un 1,3% de comisión'], ans: 1, exp: 'Beta > 1 = más volátil que el mercado. Beta 1,3 amplifica los movimientos: +10% mercado → +13% fondo, y viceversa.' },
  { q: '¿Cuál es la principal ventaja de los ETFs sobre los fondos de inversión activos?', opts: ['Mayor rentabilidad garantizada', 'Menores comisiones y gestión pasiva que suele superar a los activos a largo plazo', 'Más diversificación', 'Liquidez diaria'], ans: 1, exp: 'El 90%+ de los fondos activos no supera al índice a 10+ años, y cobran 5-10x más en comisiones. El coste importa mucho a largo plazo.' },
  { q: '¿Qué es el "efecto Latte" en finanzas personales?', opts: ['Una estrategia de inversión en commodities', 'Los pequeños gastos diarios que acumulados impiden la riqueza', 'Un tipo de fondo de café', 'La inflación en productos básicos'], ans: 1, exp: '€5/día en café = €1.825/año. Invertidos al 7% durante 30 años = €185.000. Los pequeños gastos tienen un coste de oportunidad enorme.' },
  { q: '¿Qué significa "apalancamiento" en inversión?', opts: ['Invertir en varios países', 'Usar dinero prestado para ampliar la inversión (y el riesgo)', 'Diversificar en diferentes sectores', 'Invertir solo en mercados alcistas'], ans: 1, exp: 'El apalancamiento amplifica ganancias Y pérdidas. Con €10.000 propios y €10.000 prestados, si baja un 50%, pierdes todo.' },
  { q: '¿Cuándo se dice que un activo está "en territorio de corrección"?', opts: ['Cuando baja menos del 5%', 'Cuando baja entre el 10% y el 20% desde máximos', 'Cuando baja más del 30%', 'Cuando sube más del 20%'], ans: 1, exp: 'Corrección = caída del 10-20%. Caída del 20%+ se llama "mercado bajista" (bear market). Correcciones son normales y frecuentes.' },
  { q: 'Tienes €15.000 y vas a comprar un coche. Opción A: contado. Opción B: financiado al 5% en 5 años. ¿Cuál cuesta más?', opts: ['Las dos cuestan lo mismo', 'La opción A (contado)', 'La opción B (financiado)', 'Depende del modelo'], ans: 2, exp: 'El coche financiado al 5% en 5 años cuesta €15.000 + intereses (≈€1.985 extra). Y el coste de oportunidad del dinero contado también existe.' },
  { q: '¿Qué es la "curva de interés invertida" y por qué asusta a los inversores?', opts: ['Cuando los bonos a corto plazo pagan más que los de largo plazo, señal histórica de recesión', 'Cuando los tipos bajan de golpe', 'Un tipo de gráfico de análisis técnico', 'Cuando los bonos pierden valor'], ans: 0, exp: 'La curva invertida (bonos 2y > bonos 10y) ha precedido cada recesión de EEUU en los últimos 50 años. No es garantía, pero es señal.' },
  { q: 'Si reinviertes dividendos durante 20 años vs no reinvertirlos, ¿cuánto más ganas aproximadamente?', opts: ['Un 10-15% más', 'Un 30-40% más', '2-3 veces más', 'Lo mismo, los dividendos no cambian el retorno total'], ans: 2, exp: 'Reinvertir dividendos y dejar que compoundem puede llegar a doblar o triplicar el resultado final en 20+ años. Es el poder del interés compuesto.' },
  { q: '¿Qué es la "prima de riesgo" de la bolsa española?', opts: ['El diferencial entre la rentabilidad esperada de la bolsa y la del bono sin riesgo', 'El impuesto sobre plusvalías', 'La diferencia de rentabilidad entre España y Alemania', 'La volatilidad anualizada del IBEX'], ans: 0, exp: 'Prima de riesgo = retorno esperado bolsa - bono sin riesgo (letras del tesoro). Históricamente 4-7% en España. Compensa el riesgo asumido.' },
  { q: '¿Qué es "aportar a la mochila"? (inversión indexada)', opts: ['Un fondo de inversión específico', 'Invertir cada mes independientemente del precio del mercado', 'Ahorrar en una cuenta especial', 'Repartir inversiones entre renta fija y variable'], ans: 1, exp: '"Aportar a la mochila" = DCA (Dollar Cost Averaging). Cada mes pones una aportación fija, sin intentar adivinar el mejor momento.' },
  { q: 'Tienes €5.000 de fondo de emergencia en un banco al 0%. La inflación es 4%. ¿Cuánto pierdes en poder adquisitivo en 1 año?', opts: ['€0 (no pierdes nada nominalmente)', '€200', '€400', '€1.000'], ans: 1, exp: 'En términos nominales tienes €5.000. Pero en poder real, €5.000 × 0,96 = €4.800. Pierdes €200 de poder de compra. La inflación es un impuesto silencioso.' },
  { q: '¿Cuándo conviene usar un robo-advisor vs gestionar tu propia cartera de ETFs?', opts: ['El robo-advisor siempre es mejor por su tecnología', 'Gestionar tú mismo es mejor si ya entiendes la inversión indexada y buscas mínimas comisiones', 'El robo-advisor es mejor para todo el mundo', 'Ninguno de los dos tiene sentido'], ans: 1, exp: 'Los robo-advisors cobran 0,5-1% sobre los ETFs. Si ya sabes elegir ETFs tú mismo, puedes replicarlos por 0,05-0,2%. Pero para empezar, los robo son excelentes.' },
  { q: '¿Qué es el "riesgo de longevidad"?', opts: ['El riesgo de morir antes de recuperar tu inversión', 'El riesgo de vivir más tiempo del que tu dinero puede durar', 'El riesgo de invertir en empresas muy antiguas', 'El riesgo de la inflación a largo plazo'], ans: 1, exp: 'El riesgo de longevidad es sobrevivir a tus ahorros. Con FIRE y la regla del 4%, hay que asegurarse que el dinero dure 30-40+ años.' },
  { q: 'Si quieres jubilarte en 15 años con €1.500/mes de "sueldo pasivo", ¿cuánto necesitas acumular?', opts: ['€225.000', '€270.000', '€450.000', '€630.000'], ans: 2, exp: '€1.500/mes = €18.000/año. Con regla del 4%: €18.000 ÷ 0,04 = €450.000. Necesitas ese capital invertido al 4% de retiro sostenible.' },
  { q: '¿Qué es el "value averaging" a diferencia del DCA?', opts: ['Es lo mismo que DCA', 'Inviertes más cuando el mercado ha bajado y menos cuando ha subido para mantener un objetivo de valor', 'Inviertes solo cuando el valor cae', 'Compras siempre el activo de mayor valor'], ans: 1, exp: 'Value averaging: si tu objetivo es crecer €500/mes y el mercado subió, inviertes menos; si bajó, inviertes más. Más complejo que DCA pero potencialmente más eficiente.' },
  { q: '¿Cuál es el "sesgo del presente" en psicología financiera?', opts: ['Preferir invertir en empresas del presente', 'Valorar las recompensas inmediatas desproporcionadamente más que las futuras', 'Analizar solo datos actuales del mercado', 'Invertir solo en activos presentes'], ans: 1, exp: 'El sesgo del presente nos hace preferir €100 hoy vs €120 en un año, aunque el 20% en un año supere cualquier inversión. Es la raíz de la falta de ahorro.' },
  { q: 'ETF de acumulación vs distribución: ¿cuál es más eficiente fiscalmente en España mientras no necesitas rentas?', opts: ['Distribución, porque cobras dividendos', 'Acumulación, porque reinvierte automáticamente sin tributar por dividendos', 'Son iguales fiscalmente', 'Depende de tu tipo marginal'], ans: 1, exp: 'ETF acumulación reinvierte dividendos sin pasar por tu IRPF. Solo tributas al vender. Fiscalmente más eficiente si no necesitas rentas ahora.' },
  { q: '¿Qué es la "ilusión monetaria"?', opts: ['Creer que el dinero tiene más valor del real', 'Confundir el aumento nominal de salario con aumento real (sin considerar inflación)', 'Un truco de marketing bancario', 'La creencia de que el dinero da la felicidad'], ans: 1, exp: 'Ilusión monetaria: te suben el sueldo un 3% pero la inflación es 5%. Nominalmente ganas más, pero en términos reales pierdes poder adquisitivo.' },
  { q: 'Una acción tiene un PER (Price-to-Earnings) de 30. ¿Qué significa?', opts: ['Que el dividendo es del 30%', 'Que pagas 30 veces los beneficios anuales de la empresa', 'Que la empresa tiene 30 años de historia', 'Que la acción ha subido un 30%'], ans: 1, exp: 'PER 30 = a precios actuales, pagarías 30 años de beneficios para "comprar" la empresa. Un PER bajo suele indicar empresa barata, pero hay excepciones.' },
  { q: '¿Qué diferencia hay entre rentabilidad nominal y real?', opts: ['No hay diferencia', 'Rentabilidad real = nominal - inflación', 'Rentabilidad real = nominal + impuestos', 'Rentabilidad nominal es siempre mayor que la real'], ans: 1, exp: 'Si tu inversión sube 8% y la inflación es 3%, tu rentabilidad real es 5%. Es lo que importa para ver si realmente mejoras tu poder adquisitivo.' },
  { q: '¿Cuándo es mala idea la deuda hipotecaria?', opts: ['Siempre es mala idea', 'Cuando el tipo de interés supera la rentabilidad esperada de invertir ese dinero a largo plazo', 'Nunca, siempre es mejor tener casa', 'Solo cuando los tipos suben'], ans: 1, exp: 'Si la hipoteca es al 4,5% y los mercados dan históricamente 7%, hay un debate. Pero psicológicamente y en términos de riesgo, muchos prefieren primero pagar la hipoteca.' },
  { q: '¿Qué es un "fondo de emergencia" y cuánto debería cubrir?', opts: ['Un fondo de inversión para emergencias médicas', 'Entre 3 y 6 meses de gastos, en cuenta muy líquida', 'Todo tu ahorro, para estar siempre preparado', '12 meses de ingresos'], ans: 1, exp: 'El fondo de emergencia (3-6 meses de gastos) debe ser líquido y seguro (no en bolsa). Evita que vendas inversiones en mal momento por imprevistos.' },
  { q: '¿Qué es el "riesgo de concentración" en tu cartera?', opts: ['Invertir en activos complejos', 'Tener demasiado capital en pocos activos o un solo sector', 'No diversificar geográficamente', 'Las opciones B y C son correctas'], ans: 3, exp: 'Concentración = poco diversificado. Tener el 70% en empresas tech españolas es altísimo riesgo de concentración. Un índice global lo elimina casi.' },
  { q: 'Tienes €2.000/mes de renta. El alquiler de un piso es €600. ¿Cuál es el ratio deuda-ingresos recomendado para una hipoteca?', opts: ['Máximo 20% de ingresos (€400/mes)', 'Máximo 33% de ingresos (€660/mes)', 'Máximo 50% de ingresos (€1.000/mes)', 'No hay límite recomendado'], ans: 1, exp: 'La regla del 33% dice que el pago de la hipoteca no debería superar el 33% de los ingresos netos. Bancos suelen exigir máximo 35-40%.' },
  { q: '¿Qué es el "factor de éxito seguro" (safe withdrawal rate)?', opts: ['El interés anual que da un bono del estado', 'El porcentaje anual que puedes retirar de tu cartera sin agotarla en 30 años', 'La tasa de éxito de los fondos activos', 'El tipo de interés mínimo recomendado'], ans: 1, exp: 'La regla del 4% dice que puedes retirar ese porcentaje anualmente sin agotar tu cartera en 30+ años históricamente. Es la base del FIRE.' },
  { q: 'Tu empresa te ofrece matching de plan de pensiones 1:1 hasta el 5% de tu salario. ¿Deberías aprovecharlo?', opts: ['No, los planes de pensiones no merecen la pena', 'Sí, es un retorno inmediato del 100% antes de impuestos', 'Solo si el plan tiene buenos fondos', 'Solo si piensas jubilarte pronto'], ans: 1, exp: 'Matching 1:1 = doblas el dinero instantáneamente. Es el activo financiero más rentable que existe. Siempre hay que aprovechar el matching hasta el límite.' },
  { q: '¿Cuál es la diferencia entre un activo y un pasivo según Kiyosaki?', opts: ['Activo tiene más valor que el pasivo', 'Activo pone dinero en tu bolsillo; pasivo te lo saca', 'Activo es tangible; pasivo es digital', 'No hay diferencia real'], ans: 1, exp: 'Kiyosaki: tu coche propio es un pasivo (gastos > ingresos). Una vivienda en alquiler es un activo (ingresos > gastos). La riqueza se construye con activos.' },
  { q: 'Si el S&P 500 ha dado un 10% anual histórico en dólares y la inflación americana media es 3%, ¿cuál es la rentabilidad real media?', opts: ['13%', '10%', '7%', '3%'], ans: 2, exp: '10% - 3% = 7% real. Es la cifra que se usa para calcular proyecciones reales de FIRE. La inflación siempre se resta al rendimiento nominal.' },
  { q: '¿Qué es el "bias de anclaje" en finanzas?', opts: ['Confiar solo en el asesor financiero del banco', 'Darle demasiado peso al primer precio que viste al tomar una decisión', 'Invertir siempre en el mismo activo', 'El miedo a vender con pérdidas'], ans: 1, exp: 'Sesgo de anclaje: si un piso costaba €300.000 y ahora vale €280.000, lo vemos como barato aunque el precio justo sea €240.000. El precio histórico te ancla.' },
  { q: '¿Por qué el coste total de una hipoteca a 30 años suele doblar el precio del piso?', opts: ['Por los impuestos de compraventa', 'Por los intereses acumulados durante 30 años sobre el capital pendiente', 'Por los gastos de notaría y registro', 'Por las comisiones del banco'], ans: 1, exp: 'En una hipoteca a 30 años al 3%, por cada €100.000 de capital pagas unos €151.000 total. Los intereses acumulados son enormes.' },
  { q: '¿Qué ventaja da el "efecto del primer año" en la jubilación (sequence of returns risk)?', opts: ['Los primeros años de inversión son los más importantes', 'Una caída grave justo al jubilarte es mucho más dañina que la misma caída 15 años después', 'Los retornos son más altos al principio', 'El primer año es el más fácil fiscalmente'], ans: 1, exp: 'El riesgo de secuencia: si el mercado cae 40% justo cuando empiezas a retirar (FIRE), puede agotar el capital. Por eso se aconseja tener 2-3 años en efectivo al jubilarse.' },
  { q: '¿Qué son los "dividendos aristocratas"?', opts: ['Empresas que pagan dividendos muy altos', 'Empresas que han aumentado sus dividendos durante 25+ años consecutivos', 'Fondos de inversión especializados en dividendos', 'ETFs con los mejores dividendos del año'], ans: 1, exp: 'Los Dividend Aristocrats son empresas del S&P 500 que han aumentado su dividendo cada año durante 25+ años. Señal de solidez y disciplina financiera.' },
  { q: '¿Qué es la "beta smart" o factor investing?', opts: ['Invertir solo en empresas con alta beta', 'Estrategias sistemáticas que buscan fuentes de retorno superiores al mercado (value, momentum, quality)', 'Un algoritmo de trading de alta frecuencia', 'Fondos cotizados con gestión activa'], ans: 1, exp: 'Factor investing = smart beta. Sobreponderar factores probados (value, momentum, size, quality) que históricamente superan al mercado. Más que gestión pasiva pura.' },
  { q: '¿Cuándo conviene amortizar hipoteca vs invertir en bolsa?', opts: ['Siempre amortizar: la deuda es siempre mala', 'Depende: si el tipo hipotecario < retorno esperado de bolsa, puede convenir invertir. Si es fijo bajo (< 2%), invertir. Si es variable alto, amortizar.', 'Siempre invertir, la bolsa siempre gana', 'Son equivalentes siempre'], ans: 1, exp: 'Con hipoteca fija al 1,5% y bolsa histórica al 7%, matemáticamente conviene invertir. Pero la deuda tiene riesgo y la bolsa tiene volatilidad. El perfil psicológico importa.' },
  { q: '¿Qué es el "error de supervivencia" en inversión?', opts: ['Invertir solo en empresas grandes que ya sobrevivieron', 'El sesgo de ver solo los fondos o inversiones que tuvieron éxito, ignorando todos los que quebraron', 'La tendencia a no vender activos que bajan', 'Confundir rentabilidad nominal con real'], ans: 1, exp: 'Survivorship bias: cuando ves fondos con 15% anual, olvidas los 1.000 fondos que quebraron. Los datos de éxito están sesgados por los supervivientes.' },
  { q: '¿Por qué no deberías invertir en bolsa dinero que vayas a necesitar en menos de 5 años?', opts: ['Porque los brokers cobran comisiones extra por plazos cortos', 'Porque la bolsa puede bajar un 50% en ese plazo y no habría tiempo de recuperarse antes de necesitar el dinero', 'Porque la bolsa solo paga dividendos a largo plazo', 'Porque hay límites legales para inversiones cortas'], ans: 1, exp: 'La bolsa puede tardar 5-10 años en recuperar una caída grave. Si necesitas el dinero en 2 años y cae un 40%, tendrías que vender en pérdidas. Horizonte temporal = clave.' },
  { q: '¿Qué ventaja aporta un ETF de "distribución" para una persona en FIRE?', opts: ['Mayor rentabilidad total', 'Genera rentas periódicas (dividendos) sin tener que vender participaciones', 'Menores comisiones que el de acumulación', 'Mejor tratamiento fiscal siempre'], ans: 1, exp: 'En FIRE, el ETF de distribución paga dividendos que cubren gastos sin tener que vender participaciones. Ideal para no depender del timing del mercado para retirar.' },
  { q: '¿Cuál es el "ratio de Sharpe" y qué mide?', opts: ['La comisión anual de un fondo', 'El retorno de la inversión ajustado por el riesgo asumido (volatilidad)', 'La correlación entre dos activos', 'El porcentaje de dividendos sobre el precio'], ans: 1, exp: 'Sharpe = (retorno - tasa libre de riesgo) / volatilidad. Un Sharpe > 1 es bueno: obtienes más retorno por unidad de riesgo. Compara fondos ajustando por riesgo.' },
  { q: 'Tienes €30.000 y decides invertirlos todos en el S&P 500 de golpe vs en 12 meses (DCA). ¿Cuál suele ser mejor históricamente?', opts: ['DCA, siempre reduce el riesgo', 'Invertir todo de golpe (lump sum) estadísticamente da mejores resultados en ~2/3 de los casos', 'Son iguales estadísticamente', 'DCA es mejor en mercados alcistas'], ans: 1, exp: 'Invertir todo de golpe (lump sum) es estadísticamente mejor en ~65% de los casos porque el mercado tiende a subir con el tiempo. Pero DCA reduce la ansiedad psicológica.' },
  { q: '¿Qué es el "rebalanceo fiscal eficiente" (tax-loss harvesting)?', opts: ['Pagar menos impuestos declarando pérdidas ficticias', 'Vender activos en pérdidas para compensar plusvalías fiscalmente, y comprar activos similares para mantener la exposición', 'Un tipo de cuenta de inversión exenta', 'Cambiar domicilio fiscal para pagar menos'], ans: 1, exp: 'Tax-loss harvesting: si una posición baja, la vendes (realizas la pérdida fiscal), compras un activo similar y compensas ganancias de otras posiciones. Legal y eficiente.' },
  { q: '¿Por qué el oro no es una buena inversión a muy largo plazo según los datos históricos?', opts: ['Porque es ilegal en muchos países', 'Porque su rentabilidad real a 100+ años es prácticamente 0% (solo preserva valor vs inflación)', 'Porque genera costes de almacenamiento', 'Las opciones B y C son correctas'], ans: 3, exp: 'El oro históricamente preserva poder adquisitivo pero no genera rentabilidad real significativa. €100 en oro en 1900 = €100 en valor real hoy. La bolsa: €100 → €50.000+.' },
  { q: '¿Qué es una "corrección del 10%" diferente de un "mercado bajista"?', opts: ['Son lo mismo', 'Corrección: caída del 10-20% (normal, frecuente). Bajista: caída >20% sostenida (raro, grave)', 'Corrección: caída rápida. Bajista: caída lenta', 'Solo afecta a diferentes mercados'], ans: 1, exp: 'Correcciones del 10% ocurren casi cada año. Bear markets (>20%) son raros (cada 4-5 años). Confundirlos lleva a vender en correcciones innecesariamente.' },
  { q: '¿Cuándo tiene sentido abrir una cuenta en un broker internacional vs banco español?', opts: ['Nunca, el banco siempre es más seguro', 'Cuando buscas acceso a más mercados y menores comisiones, aceptando más complejidad en la declaración', 'Solo si inviertes más de €100.000', 'Solo si eres residente fiscal en otro país'], ans: 1, exp: 'Brokers como Interactive Brokers, DEGIRO o Lightyear ofrecen acceso global con comisiones mucho menores. La declaración es algo más compleja (modelo 720 si > €50.000 en el extranjero).' },
  { q: '¿Qué es el "índice de miseria" y para qué sirve?', opts: ['Un índice de deuda personal', 'La suma de la tasa de desempleo y la tasa de inflación de un país', 'Un indicador de pobreza absoluta', 'El índice de volatilidad del mercado'], ans: 1, exp: 'Índice de miseria = desempleo + inflación. Mide el "dolor económico" de la población. Útil para comparar países y decidir dónde invertir en deuda soberana.' },
  { q: '¿Qué impacto tiene el "rebalanceo anual" en el riesgo de una cartera 80/20?', opts: ['Ninguno, el riesgo es siempre igual', 'Mantiene la asignación objetivo y puede mejorar el retorno ajustado por riesgo entre 0,5-1% anual', 'Aumenta el riesgo al vender lo que sube', 'Solo tiene ventaja fiscal'], ans: 1, exp: 'Sin rebalancear, una cartera 80/20 puede volverse 95/5 en un mercado alcista. El rebalanceo vende lo que subió (acciones) y compra lo que bajó (bonos): compra barato, vende caro.' },
  { q: '¿Cuál es la diferencia entre un fondo indexado y un ETF indexado?', opts: ['No hay diferencia', 'El ETF cotiza en bolsa intradiariamente como una acción; el fondo indexado solo al precio de cierre diario. Ambos replican el mismo índice.', 'El ETF tiene comisiones más altas', 'El fondo indexado es más arriesgado'], ans: 1, exp: 'ETF y fondo indexado son similares en concepto. La diferencia es la liquidez (ETF = intradiaria), el mínimo de inversión (fondos pueden tener mínimos) y el acceso (ETF necesita broker).' },
  { q: '¿Qué es la "teoría del mercado eficiente" (EMH)?', opts: ['Los mercados siempre suben a largo plazo', 'Los precios de los activos reflejan toda la información disponible, haciendo imposible batir el mercado consistentemente', 'Los mercados son eficientes solo en EE.UU.', 'El mercado siempre valora correctamente las empresas'], ans: 1, exp: 'EMH implica que si los precios ya reflejan todo, no puedes tener información ventajosa. La evidencia empírica apoya fuertemente la gestión indexada sobre la activa.' },
  { q: '¿Qué es el "put protector" como estrategia de cobertura?', opts: ['Comprar acciones baratas', 'Comprar una opción de venta sobre un activo que posees para limitar las pérdidas máximas', 'Un tipo de seguro de depósito bancario', 'Vender acciones en corto para cubrirse'], ans: 1, exp: 'El put protector = compras el derecho a vender tu activo a un precio fijo (strike). Si cae, limitas la pérdida al strike. Funciona como un seguro. Tiene un coste (la prima).' },
  { q: '¿Cuánto puede tardar el mercado en recuperar una caída tipo 2008 (-50%)?', opts: ['1-2 años máximo', '3-5 años aproximadamente', 'Puede tardar 10+ años (el S&P tardó 5 años en recuperar el máximo, ajustado por inflación tardó más)', 'El mercado no siempre recupera'], ans: 2, exp: 'El S&P 500 tardó ≈5 años en recuperar nominalmente el máximo de 2007. Ajustado por inflación, más de 7 años. Por eso el horizonte temporal es crucial antes de invertir.' },
  { q: '¿Qué ventaja tiene un plan de ahorro sistemático (DCA mensual) en términos psicológicos?', opts: ['Maximiza el retorno en todos los escenarios', 'Elimina la necesidad de tomar decisiones basadas en el mercado y reduce el sesgo del timing', 'Es obligatorio por ley en España', 'No tiene ventajas psicológicas'], ans: 1, exp: 'El DCA automatizado elimina la tentación de "esperar el momento perfecto" y el pánico en caídas. La automatización es el mayor superpoder del inversor minorista.' },
  { q: '¿Qué es el "efecto de disposición" (disposition effect)?', opts: ['La tendencia a invertir en activos familiares', 'Vender demasiado pronto los activos que ganan y mantener demasiado tiempo los que pierden', 'La preferencia por dividendos vs plusvalías', 'Comprar siempre en máximos por el FOMO'], ans: 1, exp: 'El efecto disposición es el opuesto a lo racional: vendemos lo que sube (realizamos beneficios para sentirnos bien) y aguantamos lo que baja (esperando recuperar). Es un enorme destructor de rentabilidad.' },
  { q: 'Inflación 3%, retorno de tu cartera 8%, tipo impositivo sobre plusvalías 21%. ¿Cuál es tu rentabilidad real neta?', opts: ['5%', '4,68%', '6,32%', '3,08%'], ans: 1, exp: '8% - 21% de impuestos = 6,32% neto nominal. 6,32% - 3% inflación = 3,32% real. Nota: simplificado, pues el impuesto se paga al vender y la inflación se aplica también al coste base.' },
  { q: '¿Qué es el "risk parity" en gestión de carteras?', opts: ['Dividir la cartera en partes iguales', 'Asignar capital de forma que cada activo contribuya la misma cantidad de riesgo (volatilidad) a la cartera', 'Invertir solo en activos sin riesgo', 'El mismo concepto que diversificación'], ans: 1, exp: 'Risk parity: en vez de 60/40 en capital, ajustas para que acciones y bonos contribuyan el mismo riesgo. Como los bonos son menos volátiles, te apalancas más en ellos. Bridgewater lo popularizó.' },
  { q: '¿Cuál es el principal riesgo de invertir en bonos corporativos de alto rendimiento (high yield)?', opts: ['Riesgo de tipo de interés solamente', 'Riesgo de crédito: que la empresa emisora no pueda pagar los intereses o el principal (impago/default)', 'Riesgo de iliquidez exclusivamente', 'No tienen riesgo adicional respecto a bonos del estado'], ans: 1, exp: 'Los bonos high yield pagan más porque el emisor tiene mayor probabilidad de impago. El riesgo principal es el crédito: que la empresa quiebre y no pueda devolver el dinero.' },
  { q: 'Si un activo tiene una "correlación de -0,8" con otro, ¿qué significa para tu cartera?', opts: ['Los activos se mueven en la misma dirección', 'Cuando uno sube el otro suele bajar, reduciendo drásticamente el riesgo de la cartera combinada', 'La correlación no afecta al riesgo', 'Solo importa la correlación positiva'], ans: 1, exp: 'Correlación -0,8 es casi perfectamente inversa. Combinar activos con correlación negativa reduce el riesgo sin sacrificar tanto retorno. Es la base de la diversificación eficiente.' },
  { q: '¿Qué es la "prima de liquidez" en los mercados?', opts: ['El descuento que dan los brokers por operar mucho', 'El exceso de retorno exigido a activos menos líquidos para compensar el riesgo de no poder venderlos rápido', 'El diferencial entre compra y venta de una acción', 'El coste de mantener efectivo en cartera'], ans: 1, exp: 'Los activos ilíquidos (capital riesgo, inmobiliario) exigen un retorno extra (prima de liquidez) para compensar que no puedes venderlos rápido. Históricamente 2-4% adicional.' },
  { q: '¿Por qué "comprar un piso para no tirar el dinero al alquiler" es un análisis incompleto?', opts: ['Es completamente correcto, siempre conviene comprar', 'Ignorar el coste de oportunidad del capital inmovilizado, los intereses hipotecarios, impuestos y mantenimiento hace la comparación injusta', 'Solo depende del precio del alquiler', 'Solo aplica en ciudades caras'], ans: 1, exp: 'Comprar también tiene costes: intereses hipotecarios, IBI, mantenimiento, seguro, gastos de compraventa (10-15% del precio). El alquiler no es "tirar dinero" si el resto se invierte bien.' },
  { q: '¿Cuál es la diferencia entre riesgo sistemático e idiosincrático en una cartera?', opts: ['No hay diferencia', 'Sistemático: riesgo del mercado entero (no diversificable). Idiosincrático: riesgo propio de cada empresa (sí diversificable)', 'Sistemático se puede eliminar; idiosincrático no', 'Solo el idiosincrático importa para el inversor'], ans: 1, exp: 'El riesgo de mercado (sistemático) afecta a todo: crises, guerras, inflación. No se puede evitar. El riesgo empresa (idiosincrático) se elimina diversificando con 20-30 activos no correlacionados.' },
  { q: '¿Qué es el "momentum investing" y tiene base académica?', opts: ['Invertir en lo que bajó para que rebote', 'Invertir en activos que han subido recientemente porque tienden a seguir subiendo a corto-medio plazo. Sí tiene evidencia académica sólida.', 'Es solo especulación sin base científica', 'Invertir siguiendo las noticias del momento'], ans: 1, exp: 'El momentum es uno de los factores más robustos documentados (Jegadeesh & Titman, 1993). Los activos que subieron en los últimos 3-12 meses tienden a seguir subiendo en los próximos 3-6 meses.' },
  { q: '¿Cuándo tiene sentido contratar un asesor financiero independiente (fee-only)?', opts: ['Nunca, puedes hacerlo todo tú', 'Cuando la complejidad (herencias, divorcio, empresa, FIRE cercano, muchos activos) supera lo que puedes gestionar solo', 'Siempre, para cualquier cantidad', 'Solo si tienes más de €1.000.000'], ans: 1, exp: 'Un fee-only advisor cobra por hora/servicio, sin comisiones de producto. Tiene sentido en situaciones complejas donde el valor que añade supera claramente su coste.' },
  { q: '¿Qué es el "CAPE ratio" (Cyclically Adjusted Price-Earnings) de Shiller?', opts: ['El PER del S&P 500 en tiempo real', 'El PER ajustado por el promedio de beneficios de los últimos 10 años (suaviza el ciclo económico)', 'El ratio de capitalización del mercado total', 'La correlación ajustada entre precio y beneficios'], ans: 1, exp: 'CAPE = precio / media de beneficios reales de los últimos 10 años. Suaviza los ciclos. Un CAPE alto (>30) históricamente predice retornos futuros más bajos. Robert Shiller ganó el Nobel por esto.' },
  { q: '¿Qué es el "asset allocation" y qué porcentaje de rentabilidad explica?', opts: ['Elegir qué acciones concretas comprar; explica el 30%', 'La distribución entre clases de activos (acciones, bonos, etc.); estudios muestran que explica el 90%+ de la rentabilidad', 'El número de activos en cartera; explica el 50%', 'El timing de entrada; explica el 70%'], ans: 1, exp: 'Según el estudio de Brinson, Hood y Beebower, el asset allocation explica más del 90% de la rentabilidad a largo plazo. Elegir qué porcentaje va a acciones vs bonos importa más que qué acciones concretas.' },
  { q: '¿Qué mide el índice MSCI World?', opts: ['Las 500 mayores empresas de EEUU', 'La evolución de las bolsas de los principales países desarrollados (~1.500 empresas de 23 países)', 'Solo el mercado europeo', 'Los mercados emergentes globales'], ans: 1, exp: 'El MSCI World incluye ~1.500 empresas de 23 países desarrollados. EE.UU. pesa ~65%. Es la referencia para carteras globales de renta variable.' },
  { q: '¿Qué es la "tasa interna de retorno" (TIR o IRR)?', opts: ['El tipo de interés nominal de un préstamo', 'La tasa que hace el VAN = 0; representa el retorno real anualizado de la inversión', 'El retorno nominal anual del activo', 'La tasa de inflación implícita'], ans: 1, exp: 'La TIR es el retorno efectivo anualizado considerando todos los flujos de caja. Si TIR > coste de capital, la inversión crea valor. Es imprescindible para comparar proyectos con distintos plazos.' },
  { q: '¿Qué es el "VIX" y por qué se llama "índice del miedo"?', opts: ['La volatilidad histórica del S&P 500', 'La expectativa del mercado sobre la volatilidad futura del S&P 500 implícita en los precios de opciones', 'La desviación estándar diaria del mercado', 'El índice de correlación global'], ans: 1, exp: 'VIX > 30 señala pánico extremo (2008, 2020). VIX < 15 señala complacencia. Muchos inversores lo usan como señal contraria: comprar cuando el miedo es alto.' },
  { q: '¿Por qué es ilegal el "insider trading" (uso de información privilegiada)?', opts: ['No es ilegal si la información es correcta', 'Daña la igualdad del mercado y puede acarrear cárcel y multas millonarias', 'Solo está prohibido para directivos de grandes empresas', 'Solo está prohibido en EEUU'], ans: 1, exp: 'El insider trading es delito penal en todos los mercados regulados. Los reguladores (SEC, CNMV) tienen herramientas sofisticadas para detectar patrones inusuales de operaciones previas a anuncios.' },
  { q: '¿Qué diferencia hay entre el S&P 500 "de precio" y "total return"?', opts: ['Son idénticos', 'El total return incluye la reinversión de dividendos, dando un retorno significativamente mayor a largo plazo', 'El de precio incluye dividendos; el total return no', 'Solo difieren en la metodología de cálculo'], ans: 1, exp: 'El S&P 500 price-only da ~7% anual histórico. El total return (con dividendos reinvertidos) da ~10%. A 30 años, la diferencia es enorme: €10.000 → €76.000 vs €174.000.' },
  { q: '¿Cuál es la "regla del inversor perezoso" más eficiente según la investigación académica?', opts: ['Invertir en acciones que subieron el año anterior', 'Comprar un ETF de mercado global y no hacer nada (buy & hold indefinido)', 'Rebalancear mensualmente para aprovechar la volatilidad', 'Invertir en el sector con mejor comportamiento de los últimos 3 años'], ans: 1, exp: 'El buy & hold de un ETF global diversificado supera a la gran mayoría de estrategias activas tras costes a largo plazo. La simplicidad es una estrategia, no una renuncia.' },
];

// ── Helpers internos ────────────────────────────────────────────

function _f42_todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function _f42_problemIndex() {
  const now  = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return dayOfYear % DAILY_PROBLEMS.length;
}

function F42_render() {
  const el = document.getElementById('f42-daily-problem');
  if (!el) return;

  const today   = _f42_todayKey();
  const idx     = _f42_problemIndex();
  const problem = DAILY_PROBLEMS[idx];
  const dp      = S.dailyProblem || {};
  const isTodayDone = dp.date === today && dp.solved;

  // Countdown
  const msLeft  = new Date(today + 'T23:59:59').getTime() - Date.now() + 1000;
  const h = Math.floor(msLeft / 3600000);
  const m = Math.floor((msLeft % 3600000) / 60000);
  const cdStr = `${h}h ${m}m`;

  if (isTodayDone) {
    el.innerHTML = `
      <div class="f42-card f42-solved">
        <div class="f42-header-row">
          <span class="f42-icon">📅</span>
          <span class="f42-title">Problema del Día #${idx + 1}</span>
          <span class="f42-badge f42-badge-done">✅ Resuelto</span>
        </div>
        <div class="f42-emoji-grid">${dp.emojis || ''}</div>
        <div class="f42-share-row">
          <button class="f42-share-btn" onclick="F42_share()">📤 Compartir resultado</button>
          <span class="f42-countdown">Próximo en ${cdStr}</span>
        </div>
      </div>`;
  } else {
    const attLeft = 3 - (dp.date === today ? (dp.attempts || 0) : 0);
    el.innerHTML = `
      <div class="f42-card f42-active">
        <div class="f42-header-row">
          <span class="f42-icon">🧩</span>
          <span class="f42-title">Problema del Día #${idx + 1}</span>
          <span class="f42-badge f42-badge-active">🔴 Sin resolver</span>
        </div>
        <div class="f42-question">${problem.q}</div>
        <div class="f42-opts" id="f42-opts">
          ${problem.opts.map((o, i) => `<button class="f42-opt" onclick="F42_answer(${i})">${o}</button>`).join('')}
        </div>
        <div class="f42-fb" id="f42-fb"></div>
        <div class="f42-meta">Intentos restantes: <strong>${attLeft}</strong> · Nuevo problema en ${cdStr}</div>
      </div>`;

    // Si ya respondió hoy pero no resolvió, deshabilitar opciones ya usadas
    if (dp.date === today && dp.attempts > 0 && !dp.solved) {
      // Restaurar intentos anteriores en visual
    }
  }
}

function F42_answer(chosen) {
  const today   = _f42_todayKey();
  const idx     = _f42_problemIndex();
  const problem = DAILY_PROBLEMS[idx];

  if (!S.dailyProblem || S.dailyProblem.date !== today) {
    S.dailyProblem = { date: today, solved: false, attempts: 0, emojis: '' };
  }
  if (S.dailyProblem.solved || S.dailyProblem.attempts >= 3) return;

  S.dailyProblem.attempts++;
  const correct = chosen === problem.ans;
  const attempt = S.dailyProblem.attempts;

  // Emoji grid
  const green = '🟩', yellow = '🟨', red = '🟥', black = '⬛';
  let emojiRow = '';
  if (correct) {
    emojiRow = Array(3).fill(attempt === 1 ? green : attempt === 2 ? yellow : red).join('') + Array(3 - attempt).fill(black).join('');
  } else {
    emojiRow = (S.dailyProblem.emojis || '') + (attempt === 3 ? '🟥' : '⬜');
  }
  S.dailyProblem.emojis = (S.dailyProblem.emojis || '') + (correct ? (attempt === 1 ? '🟩' : attempt === 2 ? '🟨' : '🟧') : '🟥');

  const fbEl = document.getElementById('f42-fb');

  if (correct) {
    S.dailyProblem.solved = true;
    const xpMap = [50, 30, 10];
    const xpGain = Math.round(xpMap[attempt - 1] * (S.xpMultiplier || 1));
    S.xp += xpGain;
    spawnXP('+' + xpGain + ' XP');
    saveState();
    if (typeof checkAchievements === 'function') checkAchievements();
    SFX.correct && SFX.correct();
    if (fbEl) fbEl.innerHTML = `<div class="f42-fb-ok">✅ ¡Correcto! +${xpGain} XP<br><small>${problem.exp}</small></div>`;
    setTimeout(F42_render, 1400);
  } else {
    if (S.dailyProblem.attempts >= 3) {
      S.xp += 5;
      saveState();
      if (fbEl) fbEl.innerHTML = `<div class="f42-fb-bad">❌ Sin más intentos. +5 XP de consolación<br><small><strong>Respuesta correcta:</strong> ${problem.opts[problem.ans]}<br>${problem.exp}</small></div>`;
      setTimeout(F42_render, 2000);
    } else {
      saveState();
      if (fbEl) fbEl.innerHTML = `<div class="f42-fb-bad">❌ Incorrecto. Te quedan ${3 - S.dailyProblem.attempts} intento(s).</div>`;
      // Deshabilitar la opción elegida
      const opts = document.querySelectorAll('.f42-opt');
      if (opts[chosen]) opts[chosen].disabled = true;
    }
  }
}

function F42_share() {
  const today = _f42_todayKey();
  const idx   = _f42_problemIndex();
  const dp    = S.dailyProblem;
  if (!dp || dp.date !== today) return;
  const text = `FinLearn Problema del Día #${idx + 1} 💰\nResuelto en ${dp.attempts} intento(s)\n${dp.emojis}\n¿Lo consigues tú? finlearn.app`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => toast('📋 Copiado', 'Pega el resultado donde quieras.', 't-success'));
  } else {
    prompt('Copia este texto:', text);
  }
}

window.F42_render = F42_render;
window.F42_answer = F42_answer;
window.F42_share  = F42_share;


/* ══════════════════════════════════════════════════════════════════
   F43 — RENTABILIDAD PASIVA OFFLINE
   ─────────────────────────────────────────────────────────────────
   Calcula los rendimientos de la cartera durante el tiempo ausente
   y los presenta con un modal al volver.
══════════════════════════════════════════════════════════════════ */

function F43_checkOfflineEarnings() {
  if (!S.userName) return;
  const lastSeen = S.lastSeen || 0;
  if (!lastSeen) { S.lastSeen = Date.now(); saveState(); return; }
  const minAway = (Date.now() - lastSeen) / 60000;
  if (minAway < 30) return; // menos de 30 min — no mostrar
  if ((S.invested || 0) < 500 && Object.keys(S.portfolio || {}).length === 0) {
    // Sin cartera: mensaje motivador
    const fakeEarnings = +(500 * (0.07 / 365 / 24 / 60) * Math.min(minAway, 72 * 60)).toFixed(2);
    if (fakeEarnings > 0.01) {
      _f43_showModal(0, minAway, fakeEarnings, true);
    }
    return;
  }

  const cappedMin = Math.min(minAway, 72 * 60);
  const annualReturn = 0.07;
  const ratePerMin = annualReturn / 365 / 24 / 60;
  let earnings = 0;

  // Calcular por cada posición en cartera
  Object.entries(S.portfolio || {}).forEach(([ticker, pos]) => {
    const price = (GAME.stockPrices || {})[ticker] || 0;
    const value = pos.shares * price;
    earnings += value * ratePerMin * cappedMin;
  });

  // Si no hay posiciones pero sí S.invested
  if (earnings === 0 && S.invested > 0) {
    earnings = S.invested * ratePerMin * cappedMin;
  }

  earnings = +earnings.toFixed(2);
  if (earnings < 0.05) return;

  _f43_showModal(earnings, minAway, 0, false);
}

function _f43_showModal(earnings, minAway, fakeEarnings, isMotivator) {
  const hoursAway = (minAway / 60).toFixed(1);
  let modal = document.getElementById('m-f43-offline');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-f43-offline';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  if (isMotivator) {
    modal.innerHTML = `
      <div class="modal-box f43-modal">
        <div class="f43-icon">💡</div>
        <div class="f43-title">Mientras estabas fuera…</div>
        <div class="f43-sub">Con €500 invertidos habrías generado <strong>€${fakeEarnings.toFixed(2)}</strong> pasivos</div>
        <p class="f43-tip">Las inversiones trabajan 24/7 por ti. ¡Empieza a invertir hoy!</p>
        <button class="btn btn-primary btn-block" onclick="closeModal('m-f43-offline');goTo('portfolio')">📈 Ir a la bolsa</button>
        <button class="btn btn-ghost btn-block" onclick="closeModal('m-f43-offline')">Cerrar</button>
      </div>`;
  } else {
    modal.innerHTML = `
      <div class="modal-box f43-modal">
        <div class="f43-coins-anim">💰💰💰</div>
        <div class="f43-title">¡Bienvenido de vuelta!</div>
        <div class="f43-sub">Mientras estabas <strong>${hoursAway}h</strong> fuera, tu cartera generó:</div>
        <div class="f43-amount">+€${earnings.toFixed(2)}</div>
        <div class="f43-note">Rendimiento pasivo estimado al 7% anual</div>
        <div class="f43-actions">
          <button class="btn btn-primary" onclick="F43_reinvest(${earnings})">♻️ Reinvertir</button>
          <button class="btn btn-ghost" onclick="F43_keepCash(${earnings})">💵 Guardar en efectivo</button>
        </div>
      </div>`;
  }
  openModal('m-f43-offline');
}

function F43_reinvest(amount) {
  S.invested = (S.invested || 0) + amount;
  S.patrimony = (S.patrimony || 0) + amount;
  saveState();
  closeModal('m-f43-offline');
  toast('♻️ Reinvertido', `€${amount.toFixed(2)} añadidos a tu cartera.`, 't-success');
}

function F43_keepCash(amount) {
  S.cash = (S.cash || 0) + amount;
  S.patrimony = (S.patrimony || 0) + amount;
  saveState();
  closeModal('m-f43-offline');
  toast('💵 Efectivo añadido', `€${amount.toFixed(2)} en tu cuenta.`, 't-success');
}

window.F43_checkOfflineEarnings = F43_checkOfflineEarnings;
window.F43_reinvest = F43_reinvest;
window.F43_keepCash = F43_keepCash;



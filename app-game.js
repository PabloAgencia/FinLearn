// ═══ SCRIPT — Market ═══
/* ══════════════════════════════════════════════════════════════════
   script-market.js — Simuladores de Bolsa, Negocios, Vida y Carrera

   ¿QUÉ ES ESTO Y POR QUÉ EXISTE?
   ─────────────────────────────────────────────────────────────────
   Todo lo relacionado con los simuladores financieros interactivos:
   · Bolsa: comprar/vender acciones, filtrar por categoría, modal de detalle
   · Negocios: adquirir/vender negocios, ver detalle
   · Carrera: cambiar de carrera profesional, ver opciones
   · Vida: tomar decisiones de vida (eventos del simulador de vida)
   · Crisis: responder a cisnes negros (crashes de mercado)

   DEPENDENCIAS: solo data.js, state.js y ui.js — sin imports de otros script-*

   QUÉ EXPORTA:
   · filterStocks(cat, el)            → filtra la lista de acciones por categoría
   · changeQty(delta)                 → sube/baja la cantidad a comprar/vender
   · executeBuy()                     → ejecuta la compra de acciones
   · executeSell()                    → ejecuta la venta de acciones
   · openStockDetail(ticker)          → abre el modal de detalle de una acción
   · openBizDetail(bizId)             → abre el modal de detalle de un negocio
   · executeBizAcquire()              → adquiere el negocio en modal abierto
   · executeBizSell()                 → vende el negocio en modal abierto
   · openCareerModal()                → abre el modal de cambio de carrera
   · changeCareer(id)                 → cambia la carrera del jugador
   · takeLifeEvent(eventId)           → aplica un evento del simulador de vida
   · respondToBlackSwan(decision)     → responde a una crisis de mercado
   · goToFact(idx)                    → navega a un dato financiero concreto
══════════════════════════════════════════════════════════════════ */





/* ══════════════════════════════════════════════════════════════════
   BOLSA (PORTFOLIO)
   ─────────────────────────────────────────────────────────────────
   El simulador de bolsa permite al jugador comprar y vender activos
   con el efectivo virtual (S.cash). Los precios fluctúan en GAME.stockPrices
   (inicializados en initApp y actualizados por el ticker en script.js).
══════════════════════════════════════════════════════════════════ */

/**
 * filterStocks — Filtra la lista de acciones por categoría.
 * cat: 'all' | 'etf' | 'stock' | 'crypto' | 'commodity' | etc.
 * Actualiza el tab activo y re-renderiza la lista.
 */
function filterStocks(cat, el) {
  document.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  GAME.currentStockFilter = cat;
  renderStockList(cat);
}

/**
 * changeQty — Modifica la cantidad de acciones a comprar/vender.
 * delta: +1 o -1. Mínimo 1 acción.
 */
function changeQty(delta) {
  GAME.stockQty = Math.max(1, (GAME.stockQty || 1) + delta);
  updateQtyDisplay();
}

/**
 * executeBuy — Ejecuta la compra de acciones.
 * ─────────────────────────────────────────────────────────────────
 * Comprueba que el jugador tiene suficiente efectivo.
 * Si ya tiene posición en ese ticker, actualiza el precio medio ponderado.
 * Precio medio = (coste anterior + coste nuevo) / acciones totales.
 */
function executeBuy() {
  if (!GAME.currentStock) return;
  const price = GAME.stockPrices[GAME.currentStock.ticker] || GAME.currentStock.price || 0;
  const total = price * GAME.stockQty;
  if (!S.cash || S.cash < total) {
    toast('❌ Capital insuficiente', `Necesitas €${total.toFixed(2)} · Tienes €${(S.cash||0).toFixed(2)}`, 't-warn');
    return;
  }

  S.cash -= total;
  const tk = GAME.currentStock.ticker;
  if (!S.portfolio[tk]) S.portfolio[tk] = { shares: 0, avgPrice: 0, dividendsCollected: 0 };
  const pos   = S.portfolio[tk];
  const prev  = pos.shares * pos.avgPrice;
  pos.shares += GAME.stockQty;
  pos.avgPrice = (prev + total) / pos.shares;
  S.invested += total;
  // Crisis buyer tracking
  if (_crisisActive) { S.crisisBuys = (S.crisisBuys || 0) + 1; }
  _trackFlashCrashBuy();
  recalcPatrimony();
  _ledgerAdd('out', 'buy', `Compra ${GAME.stockQty}× ${tk}`, total);

  saveState();
  closeModal('m-stock');
  renderPortfolioSummary();
  renderMyPositions();
  checkAchievements();
  toast('🟢 Compra ejecutada', `${GAME.stockQty}× ${tk} · Total €${total.toFixed(2)}`, 't-success');
  spawnXP('+€' + total.toFixed(0));
}

/**
 * executeSell — Ejecuta la venta de acciones.
 * ─────────────────────────────────────────────────────────────────
 * Comprueba que el jugador tiene suficientes acciones.
 * Si la posición queda a 0, elimina el ticker de S.portfolio.
 * El coste base es el precio medio de compra (no el actual).
 */
function executeSell() {
  if (!GAME.currentStock) return;
  const tk  = GAME.currentStock.ticker;
  const pos = S.portfolio[tk];
  if (!pos || pos.shares < GAME.stockQty) {
    toast('❌ No tienes suficientes acciones', '', 't-warn');
    return;
  }

  // FIX: usar precio live del ticker, no el precio stale del modal
  const price     = (GAME.stockPrices && GAME.stockPrices[tk]) || GAME.currentStock.price || 0;
  const total     = price * GAME.stockQty;
  const costBasis = pos.avgPrice * GAME.stockQty;
  pos.shares     -= GAME.stockQty;
  if (pos.shares <= 0) delete S.portfolio[tk];
  S.cash    += total;
  S.invested = Math.max(0, S.invested - costBasis);
  S._totalSells = (S._totalSells || 0) + 1;
  recalcPatrimony();
  const gain = total - costBasis;
  _ledgerAdd('in', 'sell', `Venta ${GAME.stockQty}× ${tk}${gain>=0?' (+€'+Math.round(gain)+')':' (−€'+Math.round(Math.abs(gain))+')'}`, total);

  saveState();
  closeModal('m-stock');
  renderPortfolioSummary();
  renderMyPositions();
  toast('🔴 Venta ejecutada', `${GAME.stockQty}× ${tk} · €${total.toFixed(2)} cobrados`, 't-success');
}

/**
 * openStockDetail — Abre el modal de detalle de una acción.
 * Actualiza todos los campos del modal con los datos del stock seleccionado.
 * También muestra/oculta el botón de vender según si se posee el activo.
 */
function openStockDetail(ticker) {
  const stock = STOCKS.find(s => s.ticker === ticker);
  if (!stock) return;
  GAME.currentStock = stock;
  GAME.stockQty     = 1;

  const livePrice = (GAME.stockPrices && GAME.stockPrices[ticker]) || stock.price || 0;
  const realQuote = (typeof MARKET !== 'undefined') ? MARKET.getQuote(ticker) : null;
  const changePct = realQuote ? realQuote.changePct : (stock.change || 0);

  setEl('sdh-name',   stock.name || ticker);
  setEl('sdh-ticker', ticker + ' · ' + (stock.market || ''));
  setEl('sdh-price',  fmtPrice(livePrice));
  setEl('sdh-logo',   stock.icon || '📈');
  setElHTML('sdh-pct',
    `<span style="color:${changePct >= 0 ? 'var(--accent)' : 'var(--danger)'}">` +
    `${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%` +
    `${realQuote ? ' <span class="sdh-real-tag">🟢 Real</span>' : ''}</span>`
  );

  const pos     = S.portfolio[ticker];
  const sellBtn = document.getElementById('btn-sell-stock');
  if (sellBtn) sellBtn.style.display = pos?.shares > 0 ? 'block' : 'none';

  // Dividendo en modal
  const divRow = document.getElementById('sdh-dividend-row');
  const divYieldEl = document.getElementById('sdh-div-yield');
  if (divRow && divYieldEl) {
    if (stock.dividendYield > 0) {
      divYieldEl.textContent = stock.dividendYield + '% anual';
      divRow.style.display = 'block';
    } else {
      divRow.style.display = 'none';
    }
  }
  // Posición actual con dividendos cobrados
  const myPos = S.portfolio[ticker];
  const posInfoEl = document.getElementById('sdh-pos-info');
  if (posInfoEl) {
    if (myPos?.shares > 0) {
      const val = (GAME.stockPrices[ticker] || stock.price) * myPos.shares;
      const pnl = val - myPos.avgPrice * myPos.shares;
      posInfoEl.innerHTML = `<span style="color:var(--text2);font-size:12px">
        ${myPos.shares} acc · Valor €${val.toFixed(2)} · 
        <span style="color:${pnl>=0?'var(--accent)':'var(--danger)'}">${pnl>=0?'+':''}€${pnl.toFixed(2)} PnL</span>
        ${myPos.dividendsCollected > 0 ? ` · 💰 €${myPos.dividendsCollected.toFixed(2)} dividendos cobrados` : ''}
      </span>`;
      posInfoEl.style.display = 'block';
    } else {
      posInfoEl.style.display = 'none';
    }
  }
  setEl('sdh-cash-avail', fmtPrice(S.cash || 0));
  updateQtyDisplay();
  renderMiniChart(ticker);
  openModal('m-stock');
  // Fetch historial real en segundo plano y re-renderiza el chart si llega
  if (typeof MARKET !== 'undefined') {
    MARKET.fetchHistory(ticker, function() {
      if (GAME.currentStock && GAME.currentStock.ticker === ticker) renderMiniChart(ticker);
    });
  }
  (function() {
    function holdBtn(id, dir) {
      var btn = document.getElementById(id);
      if (!btn || btn.dataset.hold) return;
      btn.dataset.hold = '1';
      var iv, tm, sp = 400;
      function start() {
        changeQty(dir);
        tm = setTimeout(function go() {
          changeQty(dir);
          sp = Math.max(250, sp - 20);
          iv = setTimeout(go, sp);
        }, 800);
      }
      function stop() { clearTimeout(tm); clearTimeout(iv); sp = 250; }
      ['mousedown','touchstart'].forEach(function(e){ btn.addEventListener(e, start, {passive:true}); });
      ['mouseup','mouseleave','touchend'].forEach(function(e){ btn.addEventListener(e, stop); });
    }
    holdBtn('stock-qty-minus', -1);
    holdBtn('stock-qty-plus',   1);
  })();
}


/* ══════════════════════════════════════════════════════════════════
   NEGOCIOS
   ─────────────────────────────────────────────────────────────────
   El simulador de negocios permite comprar negocios virtuales que
   generan ingresos pasivos mensuales (S.businesses).
══════════════════════════════════════════════════════════════════ */

// Estado local: negocio actualmente abierto en el modal
let _currentBizDetail = null;

/**
 * openBizDetail — Abre el modal de detalle de un negocio.
 * Muestra botón "Adquirir" si no se posee, "Vender" si ya se posee.
 */
function openBizDetail(bizId) {
  const biz = BUSINESSES.find(b => b.id === bizId);
  if (!biz) return;
  _currentBizDetail = biz;

  setEl('bdm-icon', biz.icon || '🏪');
  setEl('bdm-name', biz.name || '');
  setEl('bdm-desc', biz.desc || '');

  const owned = S.businesses[bizId];
  const bizCost = biz.cost || 0;

  // Metrics grid
  const metricsEl = document.getElementById('bdm-metrics');
  if (metricsEl) {
    const roi = biz.roi ? biz.roi + '%' : '—';
    const risk = {low:'🟢 Bajo', med:'🟡 Medio', high:'🔴 Alto'}[biz.riskLevel] || '—';
    const revenue = biz.monthlyRevenue ? '€' + biz.monthlyRevenue.toLocaleString('es') + '/mes' : '—';
    const cost = bizCost ? '€' + bizCost.toLocaleString('es') : 'Gratis';
    metricsEl.innerHTML = `
      <div class="bdm-metric"><div class="bdm-metric-label">Coste inicial</div><div class="bdm-metric-val">${cost}</div></div>
      <div class="bdm-metric"><div class="bdm-metric-label">Ingresos/mes</div><div class="bdm-metric-val" style="color:var(--accent)">${revenue}</div></div>
      <div class="bdm-metric"><div class="bdm-metric-label">ROI anual</div><div class="bdm-metric-val">${roi}</div></div>
      <div class="bdm-metric"><div class="bdm-metric-label">Riesgo</div><div class="bdm-metric-val">${risk}</div></div>
    `;
  }

  // Upgrades list
  const upEl = document.getElementById('bdm-upgrades');
  if (upEl && biz.upgrades?.length) {
    const ownedUpgrades = owned?.upgrades || [];
    upEl.innerHTML = biz.upgrades.map(u => {
      const hasDone = ownedUpgrades.includes(u.id);
      const canAfford = (S.cash||0) >= u.cost;
      return `<div class="biz-upgrade-row${hasDone ? ' done' : ''}">
        <div style="flex:1">
          <div style="font-weight:600;font-size:13px">${u.name}</div>
          <div style="font-size:11px;color:var(--text2)">${u.desc} · €${u.cost.toLocaleString('es')}</div>
        </div>
        ${hasDone
          ? '<span style="color:var(--accent);font-size:12px;font-weight:700">✓ Activo</span>'
          : `<button class="btn btn-sm ${canAfford ? 'btn-primary' : ''}" style="font-size:11px;padding:6px 10px;${!canAfford?'opacity:.4':''}" onclick="${owned && canAfford ? `executeBizUpgrade('${biz.id}','${u.id}')` : ''}">
              ${canAfford ? (owned ? 'Mejorar' : 'Compra primero') : 'Sin fondos'}
            </button>`
        }
      </div>`;
    }).join('');
    document.getElementById('bdm-upgrades-section').style.display = 'block';
  } else if (upEl) {
    upEl.innerHTML = '';
    const sec = document.getElementById('bdm-upgrades-section');
    if (sec) sec.style.display = 'none';
  }

  // Nota educativa
  if (biz.learnNote) {
    let noteEl = document.getElementById('bdm-learn-note');
    if (!noteEl) {
      noteEl = document.createElement('div');
      noteEl.id = 'bdm-learn-note';
      noteEl.style.cssText = 'margin-top:12px;padding:10px 12px;background:rgba(0,229,160,.06);border-left:3px solid var(--accent);border-radius:6px;font-size:12px;color:var(--text2);line-height:1.5;';
      document.getElementById('m-biz')?.querySelector('.modal')?.insertBefore(noteEl, document.getElementById('bdm-upgrades-section'));
    }
    noteEl.textContent = '💡 ' + biz.learnNote;
  }

  const acquireBtn = document.getElementById('btn-acquire-biz');
  const sellBtn    = document.getElementById('btn-sell-biz');
  if (acquireBtn) {
    acquireBtn.style.display = owned ? 'none' : 'block';
    acquireBtn.textContent = bizCost > 0 ? `💰 Adquirir por €${bizCost.toLocaleString('es')}` : '🚀 Iniciar (gratis)';
  }
  if (sellBtn) sellBtn.style.display = owned ? 'block' : 'none';

  openModal('m-biz');
}

/**
 * executeBizAcquire — Adquiere el negocio actualmente en el modal.
 * Comprueba que el jugador tenga efectivo suficiente.
 * Crea la entrada en S.businesses con nivel 1 y sin mejoras.
 */
function executeBizAcquire() {
  if (!_currentBizDetail) return;
  const biz = _currentBizDetail;
  const bizCost = biz.cost || biz.price || 0;
  if ((S.cash||0) < bizCost) {
    toast('❌ Capital insuficiente', `Necesitas €${bizCost.toLocaleString('es')} · Tienes €${Math.round(S.cash||0).toLocaleString('es')}`, 't-warn');
    return;
  }
  S.cash -= bizCost;
  S.businesses[biz.id] = { level: 1, purchasePrice: bizCost, totalRevenue: 0, upgrades: [] };
  _ledgerAdd('out', 'biz_buy', `Adquirir negocio: ${biz.name}`, bizCost);
  recalcPatrimony();
  saveState();
  closeModal('m-biz');
  renderBusinesses();
  renderBizCashflow();
  checkAchievements();
  toast('🏪 Negocio adquirido', biz.name + ' está generando ingresos', 't-success');
}

/**
 * executeBizSell — Vende el negocio al 75% del precio de compra.
 * El descuento del 25% simula los costes de salida del mercado.
 */
function executeBizSell() {
  if (!_currentBizDetail) return;
  const biz   = _currentBizDetail;
  const owned = S.businesses[biz.id];
  if (!owned) return;
  const sellPrice = Math.round(owned.purchasePrice * 0.75);
  // Paper hands detection (negocios no tienen ticker, solo aplica crisis activa)
  if (_crisisActive) {
    S.paperHandsCount = (S.paperHandsCount || 0) + 1;
    toast('🧻 ¡Manos de Papel!', 'Vendiste durante una crisis. Acabas de cristalizar tus pérdidas.', 't-danger');
    if (typeof HAPTIC !== 'undefined') HAPTIC.error();
  }
  S.cash += sellPrice;
  delete S.businesses[biz.id];
  _ledgerAdd('in', 'biz_sell', `Vender negocio: ${biz.name}`, sellPrice);
  recalcPatrimony();
  saveState();
  closeModal('m-biz');
  renderBusinesses();
  renderBizCashflow();
  toast('📤 Negocio vendido', `+€${sellPrice} recuperados`, 't-success');
}


function executeBizUpgrade(bizId, upgradeId) {
  const biz = BUSINESSES.find(b => b.id === bizId);
  const upg = biz?.upgrades?.find(u => u.id === upgradeId);
  if (!biz || !upg) return;
  const owned = S.businesses[bizId];
  if (!owned) { toast('⚠️', 'Adquiere el negocio primero', 't-warn'); return; }
  if ((owned.upgrades || []).includes(upgradeId)) { toast('⚠️', 'Mejora ya aplicada', 't-warn'); return; }
  if ((S.cash||0) < upg.cost) {
    toast('❌ Sin fondos', `Necesitas €${upg.cost.toLocaleString('es')}`, 't-warn');
    return;
  }
  S.cash -= upg.cost;
  if (!owned.upgrades) owned.upgrades = [];
  owned.upgrades.push(upgradeId);
  S.xp += 50;
  if (typeof F34_onXPGained === 'function') F34_onXPGained(50);
  _ledgerAdd('out', 'biz_upgrade', `Mejora: ${upg.name} (${biz.name})`, upg.cost);
  recalcPatrimony();
  saveState();
  spawnXP('+50 XP');
  toast('⬆️ Mejora aplicada', upg.name + ' · ' + upg.desc, 't-success');
  openBizDetail(bizId); // re-render modal
  renderBusinesses();
  renderBizCashflow();
}

/* ══════════════════════════════════════════════════════════════════
   CARRERA
   ─────────────────────────────────────────────────────────────────
   El sistema de carrera permite al jugador cambiar de rol profesional:
   Junior (por defecto) → Senior → Emprendedor.
   Cada carrera tiene distinto sueldo y desbloquea diferentes negocios.
══════════════════════════════════════════════════════════════════ */

/**
 * openCareerModal — Abre el modal de cambio de carrera.
 * Renderiza las opciones de carrera disponibles, marcando la actual
 * y bloqueando las que requieren más XP del que tiene el jugador.
 */
function openCareerModal() {
  let modal = document.getElementById('m-career');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-career';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const careerList = CAREERS.map((career, idx) => {
    const isCurrent  = career.id === (S.career || 'junior');
    const canChange  = S.xp >= (career.xpRequired || 0);
    const isLocked   = !canChange && !isCurrent;
    const xpNeeded   = Math.max(0, (career.xpRequired||0) - (S.xp||0));
    const careerIds  = CAREERS.map(c => c.id);
    const currentIdx = careerIds.indexOf(S.career || 'junior');
    const isNext     = idx === currentIdx + 1;

    return `
      <div class="career-option ${isCurrent?'current':''} ${isLocked?'locked':''} ${isNext?'next-up':''}"
        onclick="${(!isLocked && !isCurrent) ? `changeCareer('${career.id}')` : ''}"
        style="cursor:${(!isLocked && !isCurrent) ? 'pointer' : 'default'};"
        ${isLocked ? `title="Necesitas ${career.xpRequired} XP para desbloquear"` : ''}>
        <div class="career-opt-left">
          <div class="career-opt-icon" style="background:${career.color}20;border-color:${career.color}40;">${career.icon}</div>
        </div>
        <div class="career-opt-body">
          <div class="career-opt-title" style="color:${isCurrent?career.color:'var(--text1)'};">
            ${isCurrent ? '✓ ' : ''}${career.title}
            ${isNext ? '<span class="career-next-badge">Próximo</span>' : ''}
          </div>
          <div class="career-opt-sub">${career.subtitle}</div>
          <div class="career-opt-salary" style="color:var(--accent);">${career.salaryRange}</div>
          ${career.lifestyleExtra > 0 ? `<div style="font-size:10px;color:var(--danger);">⚠️ +€${career.lifestyleExtra}/mes en gastos de vida</div>` : ''}
        </div>
        <div class="career-opt-right">
          ${isCurrent
            ? '<span style="color:var(--accent);font-size:11px;font-weight:700;">Actual</span>'
            : isLocked
              ? `<span style="font-size:10px;color:var(--text3);">🔒 ${career.xpRequired} XP<br><span style="color:var(--danger);">-${xpNeeded} XP</span></span>`
              : '<span style="color:var(--text2);font-size:18px;">→</span>'
          }
        </div>
      </div>`;
  }).join('');

  modal.innerHTML = `
    <div class="modal-box" style="max-width:420px;">
      <button class="modal-close" onclick="closeModal('m-career')">✕</button>
      <div class="h3 mb4">💼 Trayectoria profesional</div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:16px;">
        Tu nivel de XP desbloquea nuevas etapas profesionales. Cuantos más módulos completes, más carreras se abren.
        XP actual: <strong style="color:var(--accent);">${S.xp||0} XP</strong>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;max-height:65vh;overflow-y:auto;">
        ${careerList}
      </div>
    </div>`;
  modal.style.display = 'flex';
}


function changeCareer(id) {
  const career = CAREERS.find(c => c.id === id);
  if (!career) return;
  S.careerChanges.push({ from: S.career, to: id, age: S.lifeAge, gameYear: S.gameYear });
  S.career     = id;
  // Reset salary to career base when changing career (events can modify from here)
  S.lifeSalary = Math.max(career.salary || 1800, S.lifeSalary || 0);
  saveState();
  closeModal('m-career');
  toast(`💼 ¡Carrera cambiada!`, `Ahora eres ${career.title} · ${career.salary}€/mes`, 't-success');
  renderCareerCard();
}


/* ══════════════════════════════════════════════════════════════════
   SIMULADOR DE VIDA
   ─────────────────────────────────────────────────────────────────
   Los eventos de vida son decisiones que el jugador puede tomar:
   cambiar de piso, tener hijos, hacer un máster, etc.
   Cada uno tiene efectos: coste, cambio de sueldo, XP, felicidad.
══════════════════════════════════════════════════════════════════ */

/**
 * takeLifeEvent — Aplica un evento del simulador de vida.
 * ─────────────────────────────────────────────────────────────────
 * Valida que el jugador tenga efectivo suficiente para el coste.
 * Aplica todos los efectos del evento (xp, salario, gastos, felicidad).
 * Añade una entrada visual al timeline de vida.
 */
function takeLifeEvent(eventId) {
  const ev = LIFE_EVENTS.find(e => e.id === eventId);
  if (!ev) return;

  // Evitar duplicado
  if ((S.lifeEvents || []).find(e => e.id === eventId)) {
    toast('⚠️ Ya tomaste esta decisión', '', 't-warn');
    return;
  }

  const fx = ev.effects || {};

  // Verificar coste
  if (fx.cost > 0) {
    if (S.cash < fx.cost) {
      toast('❌ No tienes suficiente efectivo', `Necesitas ${fmtPrice(fx.cost)}`, 't-warn');
      return;
    }
    S.cash -= fx.cost;
  }

  // Aplicar efectos
  if (fx.xp)              { S.xp += fx.xp; if (typeof F34_onXPGained === 'function') F34_onXPGained(fx.xp); if (typeof spawnXP === 'function') spawnXP('+' + fx.xp + ' XP'); }
  if (fx.salaryMultiplier) { S.lifeSalary   = Math.round((S.lifeSalary || 1800) * fx.salaryMultiplier); }
  if (fx.salaryBonus)      { S.lifeSalary   = (S.lifeSalary || 1800) + fx.salaryBonus; }
  if (fx.expenseIncrease) {
    S.lifeExpenses       = S.lifeExpenses || {};
    S.lifeExpenses.other = (S.lifeExpenses.other || 150) + fx.expenseIncrease;
  }
  if (fx.happiness !== undefined) { S.lifeHappiness = Math.min(100, Math.max(0, (S.lifeHappiness || 70) + fx.happiness)); }
  if (fx.age)              { S.lifeAge += fx.age; }

  S.lifeEvents = S.lifeEvents || [];
  S.lifeEvents.push({ id: eventId, age: S.lifeAge, gameYear: S.gameYear });
  saveState();

  // Añadir entrada al timeline visual
  const tl = document.getElementById('life-timeline');
  if (tl) {
    const entry = document.createElement('div');
    entry.className = 'lt-event';
    entry.innerHTML = `<div class="lt-dot"></div>
      <div class="lt-title">${ev.icon} ${ev.title}</div>
      <div class="lt-age">Edad ${S.lifeAge}</div>
      <div class="lt-impact">${ev.desc}</div>`;
    tl.prepend(entry);
  }

  toast(`${ev.icon} ${ev.title}`, ev.desc, 't-success');
  renderLifeScreen();
}


/* ══════════════════════════════════════════════════════════════════
   CRISIS DE MERCADO (CISNE NEGRO)
   ─────────────────────────────────────────────────────────────────
   El módulo de cisne negro simula situaciones de pánico bursátil.
   Tiene dos decisiones: mantener la calma (correcto) o vender en pánico.
   El objetivo es enseñar que mantener durante correcciones es mejor.
══════════════════════════════════════════════════════════════════ */

/**
 * respondToBlackSwan — Responde a una crisis de mercado.
 * decision: 'hold' (mantener) o 'sell' (vender en pánico).
 * · Hold → +150 XP, mensaje motivacional
 * · Sell → pérdida real del 15% de S.invested
 */
function respondToBlackSwan(decision) {
  const outcomeEl = document.getElementById('crisis-outcome');
  if (!outcomeEl) return;

  if (decision === 'hold') {
    S.xp += 150;
    if (typeof F34_onXPGained === 'function') F34_onXPGained(150);
    outcomeEl.innerHTML = `
      <div style="color:var(--accent);font-weight:700;margin-bottom:6px;">💪 Decisión correcta: MANTENER</div>
      <div style="font-size:13px;color:var(--text2);">Históricamente, los mercados siempre se han recuperado. +150 XP por tu disciplina inversora.</div>`;
    toast('💪 ¡Mantuviste la calma!', '+150 XP · Decisión históricamente correcta', 't-success');
  } else {
    const loss = Math.round(S.invested * 0.15);
    S.invested = Math.max(0, S.invested - loss);
    recalcPatrimony();
    _ledgerAdd('out', 'sell', 'Venta en pánico (crisis)', loss);
    outcomeEl.innerHTML = `
      <div style="color:var(--danger);font-weight:700;margin-bottom:6px;">📉 Vendiste en pánico</div>
      <div style="font-size:13px;color:var(--text2);">Realizaste pérdidas de €${loss}. En el mundo real, esto sería permanente.</div>`;
    toast('📉 Vendiste en mínimos', `−€${loss} realizados`, 't-warn');
  }

  outcomeEl.style.display = 'block';
  document.querySelector('.crisis-actions')?.style?.setProperty('display', 'none');
  saveState();
  checkAchievements();
}


/* ══════════════════════════════════════════════════════════════════
   DATOS FINANCIEROS
══════════════════════════════════════════════════════════════════ */

// Índice del dato financiero actualmente visible
let _factsIdx = 0;

/**
 * goToFact — Navega a un dato financiero concreto por índice.
 * Llamado desde los dots de navegación del widget de facts.
 */
function goToFact(idx) {
  _factsIdx = idx;
  renderFact(idx);
}


// ═══ SCRIPT — Features ═══
/* ══════════════════════════════════════════════════════════════════
   script-features.js — Features Auxiliares de la App

   ¿QUÉ ES ESTO Y POR QUÉ EXISTE?
   ─────────────────────────────────────────────────────────────────
   Features que son independientes del flujo principal de aprendizaje:
   · Growth: registro, landing, growth loops
   · Monetización: premium, paywall, SAAS
   · Distribución: PWA install, B2B form
   · Social: viral sharing, invitaciones, retos
   · Herramientas: calculadora, audio, WhiteLabel, FinAI, certificado dinámico
   · Timers: countdown de retos y límite diario

   DEPENDENCIAS: solo data.js y state.js — sin imports de otros script-*
   Esto significa que puede cargarse en cualquier orden sin problemas.

   QUÉ EXPORTA:
   · GR_openRegister / GR_submitRegister / GR_skipRegister  → modal de registro
   · isPremium()              → ¿tiene premium el usuario?
   · upgradeToPremium()       → abre modal de pago
   · PM_showPaywall(trigger)  → muestra el paywall
   · SAAS_selectPlan(plan)    → selecciona plan de pago (annual/monthly)
   · SAAS_startPayment()      → inicia flujo de pago simulado
   · SAAS_confirmSuccess()    → cierra modal tras pago completado
   · PWA_triggerInstall()     → activa el prompt de instalación PWA
   · PWA_dismissBanner()      → oculta el banner PWA
   · B2B_submitForm()         → envía el formulario B2B
   · doShare(platform)        → comparte en redes desde modal viral
   · doCopyLink()             → copia el enlace de invitación
   · joinChallenge()          → se une al reto semanal
   · copyInvite()             → copia el enlace de invitación
   · AudioManager             → objeto para gestionar música de fondo
   · WhiteLabel               → objeto para demo de whitelabel B2B
   · CALC                     → objeto calculadora de interés compuesto
   · FinAI                    → objeto stub del asistente de IA financiero
   · DynCert                  → objeto generador de certificado dinámico en canvas
   · _initCountdowns()        → inicia todos los timers de countdown
   · _updateSliderFill(...)   → actualiza el fill visual de un slider
══════════════════════════════════════════════════════════════════ */



/* ══════════════════════════════════════════════════════════════════
   GROWTH — REGISTRO
══════════════════════════════════════════════════════════════════ */

const PREMIUM_KEY = 'fl_premium';

/**
 * GR_openRegister — Abre el modal de registro si el usuario aún no se registró.
 * Solo lo muestra una vez (marcado en localStorage con 'fl_registered').
 */
function GR_openRegister() {
  try {
    const already = localStorage.getItem('fl_registered');
    if (already) return;
  } catch (e) { }
  openModal('m-register');
}

/**
 * GR_submitRegister — Envía el formulario de registro.
 * Valida el formato del email. Si es válido, cierra el modal y muestra confirmación.
 * Si se omite el email, registra al usuario como invitado.
 */
function GR_submitRegister() {
  const emailEl = document.getElementById('gr-reg-email');
  const email   = emailEl?.value?.trim() || '';
  const errEl   = document.getElementById('gr-reg-error');

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (errEl) { errEl.textContent = 'Email no válido'; errEl.style.display = 'block'; }
    return;
  }
  try { localStorage.setItem('fl_registered', '1'); } catch (e) { }
  closeModal('m-register');
  toast('✅ ¡Guardado!', email ? 'Te avisaremos si tu racha está en riesgo' : 'Continuando como invitado', 't-success');
}

/** GR_skipRegister — Salta el registro y marca al usuario como invitado. */
function GR_skipRegister() {
  try { localStorage.setItem('fl_registered', '1'); } catch (e) { }
  closeModal('m-register');
}


/* ══════════════════════════════════════════════════════════════════
   PREMIUM / PAYWALL
══════════════════════════════════════════════════════════════════ */

/** isPremium — Devuelve true si el usuario tiene premium activo. */
function isPremium() {
  // Primero comprueba S._premium (sincronizado desde Supabase al cargar)
  if (typeof S !== 'undefined' && S._premium === '1') return true;
  // Fallback a localStorage para usuarios sin cuenta
  try { return localStorage.getItem(PREMIUM_KEY) === '1'; } catch (e) { return false; }
}

/** upgradeToPremium — Cierra el paywall y abre el modal de pago SAAS. */
function upgradeToPremium() {
  closeModal('m-paywall');
  openModal('m-premium-saas');
}

/** PM_showPaywall — Muestra el modal de paywall. trigger es el origen (unused por ahora). */
function PM_showPaywall(trigger) {
  const msgs = {
    'f25':       { title:'Análisis automático de tus gastos', sub:'Detecta fugas en tu presupuesto y recibe sugerencias reales sobre tus números.' },
    'f27':       { title:'Plan de acción sobre tu dinero real', sub:'Pasos concretos adaptados a tus ingresos y gastos reales para avanzar más rápido.' },
    'scenarios': { title:'Recordatorios inteligentes', sub:'Renueva seguros, compara tarifas y no pierdas dinero por descuido.' },
    'coach':     { title:'Coach FinAI sobre tus números reales', sub:'Tu coach financiero con IA analiza TUS datos y te da consejos personalizados.' },
    'projection':{ title:'Plan de ahorro personalizado mensual', sub:'Un plan de ahorro adaptado a tus ingresos reales, revisado cada mes.' },
    'chest':     { title:'Detector de fugas en tu presupuesto', sub:'Identifica gastos invisibles y patrones que te cuestan dinero sin que lo notes.' },
    'premium_feature': { title:'Función Elite', sub:'Desbloquea todas las herramientas reales de FinLearn.' },
  };
  const m = msgs[trigger] || msgs['premium_feature'];
  setEl('pm-paywall-title', m.title);
  setEl('pm-paywall-sub',   m.sub);
  openModal('m-paywall');
}


/* ══════════════════════════════════════════════════════════════════
   SAAS — FLUJO DE PAGO SIMULADO
   ─────────────────────────────────────────────────────────────────
   Simula un flujo de pago real con 3 pasos:
   1. Selección de plan (anual/mensual)
   2. Loading (simula 3D Secure y confirmación)
   3. Éxito (activa premium en localStorage)
══════════════════════════════════════════════════════════════════ */

let _saasPlan = 'annual';

/** SAAS_selectPlan — Selecciona el plan de suscripción y marca el activo visualmente. */
function SAAS_selectPlan(plan) {
  _saasPlan = plan;
  document.querySelectorAll('.saas-plan').forEach(p => p.classList.remove('saas-plan-active'));
  document.getElementById('plan-' + plan)?.classList.add('saas-plan-active');
}

/**
 * SAAS_startPayment — Inicia el flujo de pago simulado.
 * Muestra pantalla de loading con mensajes rotativos y finaliza con éxito tras 3s.
 */
async function SAAS_startPayment() {
  const isAnnual = _saasPlan === 'annual';
  const priceId  = isAnnual
    ? 'price_1Tps6RQn1UY1PTsHZmWgJw9y'
    : 'price_1Tps6DQn1UY1PTsHXXuXss39';

  document.getElementById('saas-step-plan')?.style?.setProperty('display', 'none');
  const loading = document.getElementById('saas-step-loading');
  if (loading) loading.style.display = 'block';

  const msgs = [
    'Conectando con pasarela de pago segura...',
    'Redirigiendo a Stripe...',
    'Preparando checkout...',
  ];
  let mi = 0;
  const iv = setInterval(() => { setEl('saas-loading-msg', msgs[mi] || msgs[0]); mi++; }, 900);

  try {
    const user    = typeof getSBUser === 'function' ? getSBUser() : null;
    const res     = await fetch('/api/stripe-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId,
        userId:    user?.id    || '',
        userEmail: user?.email || '',
      }),
    });
    const data = await res.json();
    clearInterval(iv);
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error(data.error || 'No URL');
    }
  } catch(e) {
    clearInterval(iv);
    if (loading) loading.style.display = 'none';
    document.getElementById('saas-step-plan')?.style?.removeProperty('display');
    toast('❌ Error al conectar con el pago', 'Inténtalo de nuevo.', 't-error');
  }
}

/** SAAS_confirmSuccess — Cierra el modal de pago y resetea el estado visual del modal. */
function SAAS_confirmSuccess() {
  closeModal('m-premium-saas');
  if (isPremium() && typeof renderHomeScreen === 'function') {
    setTimeout(renderHomeScreen, 300);
  }
  document.getElementById('saas-step-plan')?.style?.setProperty('display', 'block');
  document.getElementById('saas-step-loading')?.style?.setProperty('display', 'none');
  document.getElementById('saas-step-success')?.style?.setProperty('display', 'none');
  toast('✦ ¡Bienvenido a Elite!', 'Acceso ilimitado activado', 't-success');
  updateUIFromState();
}


/* ══════════════════════════════════════════════════════════════════
   PWA INSTALL
   ─────────────────────────────────────────────────────────────────
   Gestiona el banner de instalación como app nativa (PWA).
   El evento 'beforeinstallprompt' se captura y guarda para
   activarlo cuando el usuario pulse el botón de instalación.
══════════════════════════════════════════════════════════════════ */

let _deferredInstallPrompt = null;

// Capturar el evento de instalación antes de que el navegador lo muestre
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _deferredInstallPrompt = e;
  _PWA_maybeShowBanner();
});

function _PWA_maybeShowBanner() {
  if (!_deferredInstallPrompt) return;
  if (localStorage.getItem('fl_pwa_dismissed')) return;
  if (window.matchMedia('(display-mode: standalone)').matches) return;
  var visits = parseInt(localStorage.getItem('fl_pwa_visits') || '0', 10) + 1;
  localStorage.setItem('fl_pwa_visits', visits);
  // Mostrar en la 2ª visita o más, con 30s de delay para no interrumpir
  if (visits >= 2) {
    setTimeout(function() {
      if (!_deferredInstallPrompt) return;
      const banner = document.getElementById('pwa-install-banner');
      if (banner) banner.style.display = 'flex';
    }, 30000);
  }
}

/** PWA_showAfterModule — Llamar tras completar el primer módulo para mostrar el banner. */
function PWA_showAfterModule() {
  if (!_deferredInstallPrompt) return;
  if (localStorage.getItem('fl_pwa_dismissed')) return;
  if (window.matchMedia('(display-mode: standalone)').matches) return;
  setTimeout(function() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) banner.style.display = 'flex';
  }, 2000);
}

/** PWA_triggerInstall — Activa el prompt nativo del navegador para instalar la PWA. */
function PWA_triggerInstall() {
  if (!_deferredInstallPrompt) return;
  _deferredInstallPrompt.prompt();
  _deferredInstallPrompt.userChoice.then(() => {
    _deferredInstallPrompt = null;
    PWA_dismissBanner();
  });
}

/** PWA_dismissBanner — Oculta el banner de instalación PWA y recuerda la decisión. */
function PWA_dismissBanner() {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) banner.style.display = 'none';
  localStorage.setItem('fl_pwa_dismissed', '1');
}


/* ══════════════════════════════════════════════════════════════════
   B2B FORM
══════════════════════════════════════════════════════════════════ */

/**
 * B2B_submitForm — Envía el formulario de contacto B2B.
 * Valida que nombre y empresa estén rellenos y muestra la pantalla de éxito.
 */
function B2B_submitForm() {
  const name    = document.getElementById('b2b-name')?.value?.trim()    || '';
  const company = document.getElementById('b2b-company')?.value?.trim() || '';

  if (!name || !company) { toast('⚠️ Completa los campos obligatorios', '', 't-warn'); return; }

  document.getElementById('b2b-step-form')?.style?.setProperty('display', 'none');
  const succ = document.getElementById('b2b-step-success');
  if (succ) succ.style.display = 'block';
  setEl('b2b-success-name',    name);
  setEl('b2b-success-company', company);
}


/* ══════════════════════════════════════════════════════════════════
   VIRAL SHARING
══════════════════════════════════════════════════════════════════ */

/**
 * doShare — Comparte el progreso en redes desde el modal viral.
 * platform: 'twitter' | 'whatsapp' | 'linkedin'
 */
function doShare(platform) {
  const user = S.userName || 'Un usuario';
  const text = encodeURIComponent(`${user} está mejorando sus finanzas con FinLearn 🚀 Únete gratis: ${window.location.origin}`);
  const urls = {
    twitter:  `https://twitter.com/intent/tweet?text=${text}`,
    whatsapp: `https://api.whatsapp.com/send?text=${text}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`,
  };
  window.open(urls[platform] || urls.twitter, '_blank');
  closeModal('m-viral');
}

/** doCopyLink — Copia el enlace de la app al portapapeles. */
function doCopyLink() {
  navigator.clipboard?.writeText(window.location.origin).catch(() => { });
  toast('🔗 ¡Enlace copiado!', 'Pégalo donde quieras', 't-success');
  closeModal('m-viral');
}

/** joinChallenge — Se une al reto semanal de la comunidad. */
function joinChallenge() {
  toast('🔥 ¡Te has unido al reto!', 'Completa 1 lección al día durante 7 días', 't-success');
  closeModal('m-challenge');
}

/** copyInvite — Copia el enlace de invitación desde el modal de ranking. */
function copyInvite() {
  const inp = document.getElementById('invite-input');
  if (inp) { navigator.clipboard?.writeText(inp.value).catch(() => { }); }
  toast('📋 ¡Enlace copiado!', 'Comparte con tus amigos', 't-success');
}


/* ══════════════════════════════════════════════════════════════════
   AUDIO MANAGER
   ─────────────────────────────────────────────────────────────────
   Gestiona la música de fondo de la app.
   Por defecto está en modo muted (no molesta al abrir la app).
══════════════════════════════════════════════════════════════════ */

const AudioManager = {
  _muted: true,
  /**
   * toggleMute — Alterna entre silencio y música.
   * El audio del navegador requiere interacción previa del usuario para reproducir.
   */
  toggleMute() {
    this._muted = !this._muted;
    const audio = document.getElementById('bg-music');
    const btn   = document.getElementById('music-control');
    if (!audio) return;
    if (this._muted) {
      audio.pause();
      if (btn) btn.textContent = '🔈 Audio';
    } else {
      audio.play().catch(() => { });
      if (btn) btn.textContent = '🔊 Sonido';
    }
  },
};


/* ══════════════════════════════════════════════════════════════════
   WHITELABEL (DEMO B2B)
   ─────────────────────────────────────────────────────────────────
   Permite demostrar la app con la marca de un partner B2B.
   Cambia el color principal y el nombre de la app.
══════════════════════════════════════════════════════════════════ */

const WhiteLabel = {
  _active:      false,
  _partnerColor: '#0052FF',
  _partnerName:  'Partner Finance',
  toggle() {
    this._active = !this._active;
    const toggle = document.getElementById('wl-toggle');
    const bar    = document.getElementById('wl-active-bar');
    if (this._active) {
      document.documentElement.style.setProperty('--accent', this._partnerColor);
      if (toggle) toggle.classList.add('on');
      if (bar)    bar.style.display = 'flex';
      setEl('wl-app-name-bar', this._partnerName);
      const logo = document.querySelector('.logo');
      if (logo) logo.textContent = this._partnerName;
    } else {
      document.documentElement.style.removeProperty('--accent');
      if (toggle) toggle.classList.remove('on');
      if (bar)    bar.style.display = 'none';
      const logo = document.querySelector('.logo');
      if (logo) logo.textContent = 'FinLearn';
    }
  },
};


/* ══════════════════════════════════════════════════════════════════
   CALCULADORA DE INTERÉS COMPUESTO (CALC)
   ─────────────────────────────────────────────────────────────────
   Widget interactivo con 3 sliders:
   · Aportación mensual (€50 - €2.000)
   · Años de inversión (1 - 40)
   · Rentabilidad anual esperada (1% - 15%)
   Muestra en tiempo real: total contribuido, ganancias e intereses.
══════════════════════════════════════════════════════════════════ */

const CALC = {
  update() {
    const monthly     = parseFloat(document.getElementById('calc-monthly')?.value) || 200;
    const years       = parseFloat(document.getElementById('calc-years')?.value)   || 20;
    const rate        = parseFloat(document.getElementById('calc-rate')?.value)    || 7;

    const contributed = monthly * years * 12;
    const total       = calcCompound(0, monthly, rate, years);
    const gains       = total - contributed;

    setEl('calc-monthly-val',  monthly + ' €/mes');
    setEl('calc-years-val',    years   + ' años');
    setEl('calc-rate-val',     rate    + '%');
    setEl('calc-contributed',  fmtPrice(contributed));
    setEl('calc-final',        fmtPrice(total));
    setEl('calc-gains',        fmtPrice(gains));
    setEl('calc-badge',        fmtPrice(total));

    // Barra visual contribuido vs ganancias
    const contribPct = Math.round((contributed / total) * 100);
    const gainsPct   = 100 - contribPct;
    const contribEl  = document.getElementById('calc-bar-contrib');
    const gainsEl    = document.getElementById('calc-bar-gains');
    if (contribEl) contribEl.style.width = contribPct + '%';
    if (gainsEl)   gainsEl.style.width   = gainsPct   + '%';

    // Actualizar fills de sliders
    _updateSliderFill('calc-monthly', 'calc-monthly-fill', 50,   2000);
    _updateSliderFill('calc-years',   'calc-years-fill',    1,   40);
    _updateSliderFill('calc-rate',    'calc-rate-fill',      1,   15);
  },
};

/**
 * _updateSliderFill — Actualiza el fill visual de un slider tipo range.
 * Calcula el porcentaje del valor actual entre min y max y lo aplica al fill.
 */
function _updateSliderFill(sliderId, fillId, min, max) {
  const slider = document.getElementById(sliderId);
  const fill   = document.getElementById(fillId);
  if (!slider || !fill) return;
  const pct = ((slider.value - min) / (max - min)) * 100;
  fill.style.width = pct + '%';
}


/* ══════════════════════════════════════════════════════════════════
   DYNCERT — CERTIFICADO DINÁMICO EN CANVAS
   ─────────────────────────────────────────────────────────────────
   Genera un certificado personalizado usando Canvas 2D.
   El resultado se muestra como imagen y se puede descargar.
══════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════════
   F13 — CERTIFICADO DINÁMICO PROFESIONAL
   Canvas 1200×800 · Gradientes, arcos, stats grid, tier dinámico
══════════════════════════════════════════════════════════════════ */

function _certTier(mods) {
  if (mods >= 36) return { label: 'Maestro Financiero',    color: '#f0b429', icon: '\uD83C\uDFC6' };
  if (mods >= 26) return { label: 'Experto Financiero',    color: '#00e5a0', icon: '\uD83C\uDF1F' };
  if (mods >= 16) return { label: 'Analista Financiero',   color: '#818cf8', icon: '\uD83D\uDCCA' };
  return                  { label: 'Inversor Certificado', color: '#38bdf8', icon: '\uD83D\uDCB0' };
}

function _certRR(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

function _certArc(ctx, cx, cy, radius, pct, color) {
  var start = Math.PI * 0.75, sweep = Math.PI * 1.5;
  ctx.beginPath(); ctx.arc(cx,cy,radius,start,start+sweep);
  ctx.strokeStyle='rgba(255,255,255,0.08)'; ctx.lineWidth=11; ctx.lineCap='round'; ctx.stroke();
  if (pct>0) {
    ctx.beginPath(); ctx.arc(cx,cy,radius,start,start+sweep*(pct/100));
    ctx.strokeStyle=color; ctx.lineWidth=11; ctx.lineCap='round'; ctx.stroke();
  }
}

const DynCert = {
  generate() {
    var mods     = (S.completedMods||[]).length;
    var tier     = _certTier(mods);
    var health   = (typeof calcHealthScore==='function') ? calcHealthScore() : 0;
    var hlevel   = (typeof getHealthLevel==='function')  ? getHealthLevel(health)  : {label:'En progreso',color:'#eab308'};
    var name     = S.userName || 'Explorador';
    var xpTxt    = (S.xp||0).toLocaleString('es');
    var streak   = S.maxStreak || S.streak || 0;
    var now      = new Date();
    var months   = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    var dateStr  = now.getDate()+' de '+months[now.getMonth()]+' de '+now.getFullYear();
    var total    = (typeof MODULES!=='undefined') ? MODULES.length : 50;

    openModal('m-dyncert');
    var loading = document.getElementById('dyncert-loading');
    var img     = document.getElementById('cert-preview-img');
    var dlLink  = document.getElementById('cert-download-link');
    if (loading) loading.style.display = 'flex';
    if (img)     img.style.display     = 'none';

    requestAnimationFrame(function() {
      var canvas = document.getElementById('cert-canvas');
      if (!canvas) return;
      canvas.width=1200; canvas.height=800;
      var ctx = canvas.getContext('2d');
      if (!ctx) return;
      var W=1200, H=800, pad=30;

      // ── Fondo ──────────────────────────────────────────────────
      ctx.fillStyle='#060810'; ctx.fillRect(0,0,W,H);
      // Grid de puntos sutil
      ctx.fillStyle='rgba(255,255,255,0.018)';
      for (var gx=0;gx<W;gx+=22) for (var gy=0;gy<H;gy+=22) ctx.fillRect(gx,gy,1,1);

      // ── Borde exterior ─────────────────────────────────────────
      _certRR(ctx,pad,pad,W-pad*2,H-pad*2,18);
      ctx.globalAlpha=0.5; ctx.strokeStyle=tier.color; ctx.lineWidth=2.5; ctx.stroke();
      ctx.globalAlpha=1;
      _certRR(ctx,pad+9,pad+9,W-(pad+9)*2,H-(pad+9)*2,12);
      ctx.strokeStyle='rgba(255,255,255,0.05)'; ctx.lineWidth=1; ctx.stroke();

      // ── Banda superior con gradiente ───────────────────────────
      var barH=148;
      _certRR(ctx,pad,pad,W-pad*2,barH,18); ctx.save(); ctx.clip();
      var topG=ctx.createLinearGradient(0,0,W,barH);
      topG.addColorStop(0,'rgba(6,9,20,1)');
      topG.addColorStop(0.35,'rgba(0,229,160,0.1)');
      topG.addColorStop(0.65,'rgba(110,86,255,0.13)');
      topG.addColorStop(1,'rgba(6,9,20,1)');
      ctx.fillStyle=topG; ctx.fillRect(pad,pad,W-pad*2,barH); ctx.restore();
      ctx.beginPath(); ctx.moveTo(pad+18,pad+barH); ctx.lineTo(W-pad-18,pad+barH);
      ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1; ctx.stroke();

      // ── Logo FL (top-left) ─────────────────────────────────────
      var lx=pad+62, ly=pad+74;
      ctx.beginPath(); ctx.arc(lx,ly,30,0,Math.PI*2);
      ctx.fillStyle=tier.color+'1a'; ctx.fill();
      ctx.beginPath(); ctx.arc(lx,ly,30,0,Math.PI*2);
      ctx.globalAlpha=0.65; ctx.strokeStyle=tier.color; ctx.lineWidth=2; ctx.stroke(); ctx.globalAlpha=1;
      ctx.fillStyle=tier.color; ctx.font='bold 20px system-ui'; ctx.textAlign='center';
      ctx.fillText('FL',lx,ly+7);
      ctx.fillStyle='#fff'; ctx.font='bold 24px system-ui'; ctx.textAlign='left';
      ctx.fillText('FinLearn',pad+104,pad+62);
      ctx.fillStyle='rgba(255,255,255,0.38)'; ctx.font='12px system-ui';
      ctx.fillText('Educaci\xF3n Financiera',pad+104,pad+80);

      // ── Label central top ──────────────────────────────────────
      ctx.fillStyle='rgba(255,255,255,0.16)'; ctx.font='10px system-ui'; ctx.textAlign='center';
      ctx.fillText('\u2014\u2014\u2014\u2014\u2014  CERTIFICADO DE EDUCACI\xD3N FINANCIERA  \u2014\u2014\u2014\u2014\u2014',W/2,pad+74);

      // ── Fecha top-right ────────────────────────────────────────
      ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.font='11px system-ui'; ctx.textAlign='right';
      ctx.fillText(dateStr,W-pad-46,pad+74);

      // ── Badge de tier ──────────────────────────────────────────
      var bY=pad+barH+32;
      var bLabel=tier.icon+'  '+tier.label;
      ctx.font='bold 14px system-ui'; ctx.textAlign='center';
      var bW=ctx.measureText(bLabel).width+44;
      var bX=W/2-bW/2;
      _certRR(ctx,bX,bY,bW,32,16); ctx.fillStyle=tier.color+'20'; ctx.fill();
      _certRR(ctx,bX,bY,bW,32,16); ctx.globalAlpha=0.65; ctx.strokeStyle=tier.color; ctx.lineWidth=1.5; ctx.stroke(); ctx.globalAlpha=1;
      ctx.fillStyle=tier.color; ctx.fillText(bLabel,W/2,bY+22);

      // ── Nombre (grande, centro) ────────────────────────────────
      var nY=bY+76;
      ctx.save(); ctx.shadowColor=tier.color; ctx.shadowBlur=36;
      ctx.fillStyle=tier.color; ctx.globalAlpha=0.05; ctx.fillRect(W/2-340,nY-48,680,62); ctx.restore();
      ctx.fillStyle='#fff'; ctx.font='bold 54px system-ui'; ctx.textAlign='center';
      var displayName=name.length>24 ? name.slice(0,24)+'\u2026' : name;
      ctx.fillText(displayName,W/2,nY);
      ctx.fillStyle='rgba(255,255,255,0.4)'; ctx.font='15px system-ui';
      ctx.fillText('ha demostrado competencia en educaci\xF3n financiera personal',W/2,nY+33);

      // ── 4 cajas de stats ───────────────────────────────────────
      var sY=nY+68, bxW=188, bxH=70, gap=16;
      var totalBW=bxW*4+gap*3, bxStart=(W-totalBW)/2;
      var statsData=[
        {v:mods+' / '+total, l:'M\xF3dulos completados', c:tier.color},
        {v:xpTxt+' XP',      l:'Experiencia total',     c:'#818cf8'},
        {v:health+'%',       l:'Salud financiera',       c:hlevel.color},
        {v:streak+' d\xEDas', l:'Racha m\xE1xima',        c:'#f0b429'},
      ];
      statsData.forEach(function(st,i) {
        var bx=bxStart+i*(bxW+gap);
        _certRR(ctx,bx,sY,bxW,bxH,11); ctx.fillStyle='rgba(255,255,255,0.04)'; ctx.fill();
        _certRR(ctx,bx,sY,bxW,bxH,11); ctx.strokeStyle='rgba(255,255,255,0.07)'; ctx.lineWidth=1; ctx.stroke();
        ctx.fillStyle=st.c; ctx.font='bold 21px system-ui'; ctx.textAlign='center';
        ctx.fillText(st.v,bx+bxW/2,sY+29);
        ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.font='10px system-ui';
        ctx.fillText(st.l.toUpperCase(),bx+bxW/2,sY+50);
      });

      // ── Arcos de progreso izq/der ──────────────────────────────
      var arcY=sY+bxH+56;
      _certArc(ctx,pad+106,arcY,42,Math.round((mods/total)*100),tier.color);
      ctx.fillStyle=tier.color; ctx.font='bold 18px system-ui'; ctx.textAlign='center';
      ctx.fillText(Math.round((mods/total)*100)+'%',pad+106,arcY+6);
      ctx.fillStyle='rgba(255,255,255,0.28)'; ctx.font='10px system-ui';
      ctx.fillText('Completado',pad+106,arcY+23);

      _certArc(ctx,W-pad-106,arcY,42,health,hlevel.color);
      ctx.fillStyle=hlevel.color; ctx.font='bold 18px system-ui'; ctx.textAlign='center';
      ctx.fillText(health+'%',W-pad-106,arcY+6);
      ctx.fillStyle='rgba(255,255,255,0.28)'; ctx.font='10px system-ui';
      ctx.fillText('Salud',W-pad-106,arcY+23);

      // ── Footer ─────────────────────────────────────────────────
      var fY=H-pad-16;
      ctx.beginPath(); ctx.moveTo(pad+38,fY-22); ctx.lineTo(W-pad-38,fY-22);
      ctx.strokeStyle='rgba(255,255,255,0.06)'; ctx.lineWidth=1; ctx.stroke();
      ctx.beginPath(); ctx.arc(W/2,fY-20,16,0,Math.PI*2);
      ctx.globalAlpha=0.45; ctx.strokeStyle=tier.color; ctx.lineWidth=1.5; ctx.stroke(); ctx.globalAlpha=1;
      ctx.fillStyle=tier.color; ctx.font='12px system-ui'; ctx.textAlign='center'; ctx.fillText('\u2605',W/2,fY-15);
      ctx.fillStyle='rgba(255,255,255,0.22)'; ctx.font='11px system-ui'; ctx.textAlign='left';
      ctx.fillText('Emitido: '+dateStr,pad+46,fY);
      ctx.textAlign='right';
      ctx.fillText('FinLearn\u2122 \xB7 finlearn.app',W-pad-46,fY);

      // ── Export ─────────────────────────────────────────────────
      canvas.toBlob(function(blob) {
        var url=URL.createObjectURL(blob);
        if (loading) loading.style.display='none';
        if (img)    { img.src=url; img.style.display='block'; }
        if (dlLink) { dlLink.href=url; dlLink.download='FinLearn_Cert_'+(name.replace(/\s+/g,'_')||'Usuario')+'.png'; }
      },'image/png');
    });
  },
};


/* ══════════════════════════════════════════════════════════════════
   F14 — FLASHCARDS SRS (Spaced Repetition)
   · 30 tarjetas de conceptos clave
   · Sesión de 5 tarjetas diarias
   · Flip 3D · Easy(7d) / Hard(1d) / No sé(hoy)
   · Estado: S._flashcards = {intervals:{}, nextReview:{}, doneToday:[]}
   · +5 XP por tarjeta repasada
══════════════════════════════════════════════════════════════════ */

var FLASHCARDS = [
  {id:0,  f:'Regla del 72',             b:'Divide 72 entre el inter\xE9s anual para saber en cu\xE1ntos a\xF1os se dobla el capital. Ej: 72\xF76% = 12 a\xF1os.'},
  {id:1,  f:'Inter\xE9s compuesto',      b:'Intereses que generan m\xE1s intereses. F\xF3rmula: C\xB7(1+r)\u207F. El tiempo es el factor m\xE1s cr\xEDtico; a 30 a\xF1os supera con creces el capital aportado.'},
  {id:2,  f:'TER (Total Expense Ratio)', b:'Porcentaje anual que cobra un fondo sobre tu capital. ETF \xEDndice: 0.05\u20130.20%. Fondo activo: 1.5\u20132.5%. La diferencia compuesta a 30 a\xF1os puede ser el 30% de tu patrimonio.'},
  {id:3,  f:'ETF',                       b:'Fondo cotizado en bolsa. Replica un \xEDndice autom\xE1ticamente. TER bajo, liquidez diaria, sin m\xEDnimo. Base de la inversi\xF3n pasiva indexada.'},
  {id:4,  f:'M\xE9todo Avalanche',       b:'Paga el m\xEDnimo en todas las deudas. Todo el extra va a la de MAYOR tipo de inter\xE9s. \xD3ptimo matem\xE1ticamente: minimiza el total de intereses pagados.'},
  {id:5,  f:'M\xE9todo Snowball',        b:'Paga el m\xEDnimo en todas. El extra va a la de MENOR saldo. Crea motivaci\xF3n con victorias r\xE1pidas pero paga m\xE1s intereses que el m\xE9todo Avalanche.'},
  {id:6,  f:'Fondo de emergencia',      b:'3\u20136 meses de gastos esenciales en cuenta l\xEDquida y separada. Para aut\xF3nomos: 6 meses m\xEDnimo. No es inversi\xF3n, es un seguro de supervivencia.'},
  {id:7,  f:'LTV (Loan-to-Value)',      b:'Principal de hipoteca \xF7 valor del inmueble. M\xE1ximo habitual: 80%. Con LTV bajo obtienes mejores tipos y evitas el PMI o seguro de protecci\xF3n.'},
  {id:8,  f:'TAE vs TIN',              b:'TIN = inter\xE9s puro. TAE = inter\xE9s + comisiones + gastos. Siempre compara el TAE: es el coste real anual de un pr\xE9stamo o hipoteca.'},
  {id:9,  f:'Amortizaci\xF3n francesa', b:'Cuota fija mensual. Al principio casi todo son intereses; al final casi todo es capital. El m\xE1s com\xFAn en hipotecas espa\xF1olas. La amortizaci\xF3n anticipada ahorra m\xE1s al inicio.'},
  {id:10, f:'DCA (Dollar Cost Averaging)', b:'Invertir cantidad fija peri\xF3dicamente sin importar el precio. Reduce el riesgo de invertir todo en el peor momento. Compras m\xE1s unidades cuando el precio baja.'},
  {id:11, f:'Diversificaci\xF3n',       b:'Distribuir entre activos no correlacionados. No elimina el riesgo de mercado (sistem\xE1tico) pero reduce el riesgo espec\xEDfico de empresa o sector.'},
  {id:12, f:'Regla 4% (FIRE)',         b:'Puedes retirar el 4% anual de tu cartera de forma sostenible. Patrimonio FIRE = gastos anuales \xD7 25. Validado por el estudio Trinity con datos hist\xF3ricos.'},
  {id:13, f:'Patrimonio neto',         b:'Suma de todos tus activos menos todas tus deudas. La m\xE9trica m\xE1s honesta de tu situaci\xF3n financiera real. Ignora los ingresos: lo que importa es lo que queda.'},
  {id:14, f:'Renta variable',          b:'Acciones y ETFs. Rentabilidad hist\xF3rica ~8\u201310% anual real, con alta volatilidad. Para horizontes >5\u201310 a\xF1os; nunca inviertas dinero que puedas necesitar en 3 a\xF1os.'},
  {id:15, f:'Renta fija',             b:'Bonos y deuda. Rentabilidad menor pero m\xE1s predecible. Relaci\xF3n inversa precio-tipo: si los tipos suben, el precio de los bonos existentes baja.'},
  {id:16, f:'Inflaci\xF3n',           b:'P\xE9rdida anual de poder adquisitivo. El dinero en cuenta corriente pierde valor real cada a\xF1o. El objetivo del BCE es ~2% anual; desde 2021 super\xF3 el 10%.'},
  {id:17, f:'Regla 50/30/20',         b:'50% necesidades, 30% deseos, 20% ahorro e inversi\xF3n. Marco simple de presupuesto. Ajusta al 60/20/20 si vives en ciudad cara o al 40/20/40 si puedes ahorrar m\xE1s.'},
  {id:18, f:'Price-to-Rent ratio',    b:'Precio de compra \xF7 alquiler anual. >20 favorece alquilar. <15 favorece comprar. En Espa\xF1a las grandes ciudades est\xE1n en 22\u201330, lo que hist\xF3ricamente favorece el alquiler.'},
  {id:19, f:'PER (Price-to-Earnings)', b:'Precio de acci\xF3n \xF7 beneficio por acci\xF3n. Cuantas veces pagas los beneficios actuales. PER 15 = hist\xF3ricamente normal. >30 = caro. <10 = barato o empresa con problemas.'},
  {id:20, f:'Fondo indexado',         b:'Replica un \xEDndice (ej: MSCI World). Gesti\xF3n pasiva, comisiones ultrabajas, bate al 90% de fondos activos a largo plazo. Diferencia vs ETF: traspaso sin tributar en Espa\xF1a.'},
  {id:21, f:'Acumulaci\xF3n vs Distribuci\xF3n', b:'Acumulaci\xF3n: reinvierte dividendos autom\xE1ticamente (m\xE1s eficiente fiscalmente). Distribuci\xF3n: paga dividendos en efectivo. Para FIRE en Espa\xF1a, acumulaci\xF3n suele ganar.'},
  {id:22, f:'Coste de oportunidad',  b:'Valor de la mejor alternativa a la que renuncias. Gastar 1.000\u20AC hoy tiene un coste real mayor: los intereses compuestos que ese dinero habr\xEDa generado durante d\xE9cadas.'},
  {id:23, f:'IRPF \u2014 Base del ahorro', b:'Plusval\xEDas e intereses tributan separado del trabajo: 19% hasta 6.000\u20AC, 21% hasta 50.000\u20AC, 23% hasta 200.000\u20AC, 27% m\xE1s de 200.000\u20AC. M\xE1s ventajoso que el tipo marginal del trabajo.'},
  {id:24, f:'Cartera Boglehead',     b:'ETF mercado global (80%) + ETF bonos (20%) + rebalanceo anual. Simplicidad m\xE1xima con resultados hist\xF3ricos superiores a la gran mayor\xEDa de estrategias activas.'},
  {id:25, f:'Free Cash Flow (FCF)',  b:'Beneficio operativo menos inversiones necesarias. El FCF es el dinero que queda de verdad; es dif\xEDcil de manipular contablemente. Mejor indicador que el beneficio neto.'},
  {id:26, f:'Sesgo de confirmaci\xF3n', b:'Tendencia a buscar informaci\xF3n que confirma lo que ya creemos. Nos hace mantener malas inversiones demasiado tiempo. La soluci\xF3n: buscar activamente argumentos en contra.'},
  {id:27, f:'Amortizaci\xF3n anticipada', b:'Reducir capital pendiente de hipoteca antes de plazo. M\xE1s eficiente al inicio (donde los intereses son mayores). Cada euro extra al principio ahorra varios euros de inter\xE9s.'},
  {id:28, f:'Diversificaci\xF3n temporal (DCA)', b:'Invertir peri\xF3dicamente reduce el riesgo de timing. Combinado con diversificaci\xF3n geogr\xE1fica y sectorial, es la base del inversor pasivo indexado a largo plazo.'},
  {id:29, f:'Beta de una acci\xF3n',  b:'Mide la sensibilidad a movimientos del mercado. Beta 1.5: si el mercado sube 10%, la acci\xF3n tiende a subir 15% (y viceversa). Beta <1: m\xE1s estable que el mercado.'},
];

var _FC = {
  _st: function() {
    if (!S._flashcards) S._flashcards = {intervals:{}, nextReview:{}, doneToday:[]};
    return S._flashcards;
  },
  _today: function() { return new Date().toISOString().slice(0,10); },
  _due: function() {
    var st=this._st(), tod=this._today();
    return FLASHCARDS.filter(function(c){ var nr=st.nextReview[c.id]; return !nr||nr<=tod; });
  },
  _doneCount: function() {
    var st=this._st(), tod=this._today();
    return (st.doneToday||[]).filter(function(d){ return d===tod; }).length;
  },

  open: function() {
    var m=document.getElementById('m-flashcard');
    if (!m) { m=document.createElement('div'); m.id='m-flashcard'; m.className='modal-overlay'; document.body.appendChild(m); }
    m.style.display='flex';
    this._render(m);
  },

  _render: function(m) {
    var due=this._due(), done=this._doneCount(), daily=5;
    if (done>=daily) {
      m.innerHTML='<div class="fc-box"><button class="modal-close" onclick="document.getElementById(\'m-flashcard\').style.display=\'none\'">\u2715</button>'
        +'<div style="text-align:center;padding:40px 20px;">'
        +'<div style="font-size:48px;margin-bottom:12px;">\uD83C\uDF1F</div>'
        +'<div class="h3 mb8">Sesi\xF3n completada</div>'
        +'<div style="font-size:13px;color:var(--text2);margin-bottom:16px;">Has repasado tus '+daily+' tarjetas de hoy.<br>Vuelve ma\xF1ana para continuar.</div>'
        +'<div style="font-size:11px;color:var(--text3);">'+FLASHCARDS.length+' conceptos en el mazo \xB7 '+due.length+' pendientes</div>'
        +'</div></div>';
      return;
    }
    if (due.length===0) {
      m.innerHTML='<div class="fc-box"><button class="modal-close" onclick="document.getElementById(\'m-flashcard\').style.display=\'none\'">\u2715</button>'
        +'<div style="text-align:center;padding:40px 20px;">'
        +'<div style="font-size:48px;margin-bottom:12px;">\u2705</div>'
        +'<div class="h3 mb8">¡Al d\xEDa!</div>'
        +'<div style="font-size:13px;color:var(--text2);">No hay tarjetas pendientes hoy.<br>El sistema ir\xE1 program\xE1ndolas en los d\xEDas correctos.</div>'
        +'</div></div>';
      return;
    }
    var card=due[0];
    m.innerHTML='<div class="fc-box">'
      +'<button class="modal-close" onclick="document.getElementById(\'m-flashcard\').style.display=\'none\'">\u2715</button>'
      +'<div class="fc-header"><span class="fc-progress">'+done+' / '+daily+' hoy</span><span class="fc-count">'+due.length+' pendientes</span></div>'
      +'<div class="fc-scene" id="fc-scene" onclick="_FC.flip()">'
      +'  <div class="fc-card" id="fc-card">'
      +'    <div class="fc-face fc-front"><div class="fc-eyebrow">Concepto</div><div class="fc-term">'+card.f+'</div><div class="fc-hint">Toca para ver la respuesta</div></div>'
      +'    <div class="fc-face fc-back"><div class="fc-eyebrow">Definici\xF3n</div><div class="fc-def">'+card.b+'</div></div>'
      +'  </div>'
      +'</div>'
      +'<div class="fc-btns" id="fc-btns" style="display:none;">'
      +'  <button class="fc-btn fc-btn-no"   onclick="_FC.answer('+card.id+',0)">No lo s\xE9<br><span>Hoy</span></button>'
      +'  <button class="fc-btn fc-btn-hard" onclick="_FC.answer('+card.id+',1)">Dif\xEDcil<br><span>1 d\xEDa</span></button>'
      +'  <button class="fc-btn fc-btn-easy" onclick="_FC.answer('+card.id+',7)">F\xE1cil<br><span>7 d\xEDas</span></button>'
      +'</div></div>';
  },

  flip: function() {
    var card=document.getElementById('fc-card'), btns=document.getElementById('fc-btns');
    if (!card) return;
    card.classList.toggle('fc-flipped');
    if (btns) btns.style.display=card.classList.contains('fc-flipped')?'flex':'none';
  },

  answer: function(cardId, days) {
    var st=this._st(), tod=this._today();
    var next=new Date(); next.setDate(next.getDate()+days);
    st.intervals[cardId]=days;
    st.nextReview[cardId]=next.toISOString().slice(0,10);
    if (!Array.isArray(st.doneToday)) st.doneToday=[];
    st.doneToday.push(tod);
    st.doneToday=st.doneToday.filter(function(d){ return d===tod; });
    S._flashcards=st;
    S.xp+=5; if (typeof F34_onXPGained === 'function') F34_onXPGained(5); saveState(); if (typeof spawnXP === 'function') spawnXP('+5 XP');
    var m=document.getElementById('m-flashcard');
    if (m) this._render(m);
  },
};

/* ─── F14 v2: ampliar _FC con SM-2, tarjetas de módulos y UI mejorada ─── */
_FC._DAILY = 10;
_FC._sessionXP = 0;
_FC._sessionCards = 0;

_FC._buildAllCards = function() {
  var cards = FLASHCARDS.slice();
  try {
    if (typeof MODULES !== 'undefined' && Array.isArray(MODULES)) {
      var completed = (S && S.completedMods) || [];
      MODULES.forEach(function(mod) {
        if (!completed.includes(mod.id)) return;
        (mod.steps || []).forEach(function(step, si) {
          if (step.type !== 'quiz') return;
          var correct = (step.opts || []).find(function(o) { return o.ok; });
          if (!correct) return;
          var back = correct.t;
          if (step.ok) back += '\n\n' + step.ok.replace(/<[^>]+>/g, '');
          cards.push({ id: 'm' + mod.id + '_' + si, front: step.q, back: back, modTitle: mod.title || ('Mod ' + mod.id), fromModule: true });
        });
      });
    }
  } catch(e) {}
  return cards;
};

_FC._due = function() {
  var st = this._st(), tod = this._today();
  return this._buildAllCards().filter(function(c) {
    var key = c.id !== undefined ? c.id : (c.front || '');
    var term = (typeof c === 'object' && 'f' in c) ? c.f : c.front;
    var nr = st.nextReview[c.id !== undefined ? c.id : term];
    return !nr || nr <= tod;
  });
};

_FC._st = function() {
  if (!S._flashcards) S._flashcards = { intervals: {}, nextReview: {}, doneToday: [], srs: {} };
  if (!S._flashcards.srs) S._flashcards.srs = {};
  return S._flashcards;
};

_FC.open = function() {
  this._sessionXP = 0; this._sessionCards = 0;
  var m = document.getElementById('m-flashcard');
  if (!m) { m = document.createElement('div'); m.id = 'm-flashcard'; m.className = 'modal-overlay'; document.body.appendChild(m); }
  m.style.display = 'flex';
  this._render(m);
};

_FC._render = function(m) {
  var due = this._due(), done = this._doneCount(), daily = this._DAILY;
  var allCards = this._buildAllCards();
  var xpEarned = this._sessionXP || done * 5;
  var X = '✕', STAR = '🌟', CHECK = '✅', FIRE = '🔥';

  if (done >= daily) {
    m.innerHTML = '<div class="fc-box">'
      + '<button class="modal-close" onclick="document.getElementById(\'m-flashcard\').style.display=\'none\';_FC.updateEntryUI();">' + X + '</button>'
      + '<div style="text-align:center;padding:32px 20px;">'
      + '<div style="font-size:52px;margin-bottom:12px;">' + STAR + '</div>'
      + '<div class="fc-end-title">Sesi\xF3n completada</div>'
      + '<div class="fc-end-xp">+' + xpEarned + ' XP</div>'
      + '<div class="fc-end-stats">'
      + '<div class="fc-end-stat"><div class="fc-end-stat-val">' + done + '</div><div class="fc-end-stat-lbl">tarjetas</div></div>'
      + '<div class="fc-end-stat"><div class="fc-end-stat-val">' + allCards.length + '</div><div class="fc-end-stat-lbl">en el mazo</div></div>'
      + '<div class="fc-end-stat"><div class="fc-end-stat-val">' + due.length + '</div><div class="fc-end-stat-lbl">ma\xF1ana</div></div>'
      + '</div>'
      + '<div style="font-size:12px;color:var(--text3);margin-top:12px;">Vuelve ma\xF1ana ' + FIRE + '</div>'
      + '</div></div>';
    this.updateEntryUI(); return;
  }
  if (due.length === 0) {
    m.innerHTML = '<div class="fc-box">'
      + '<button class="modal-close" onclick="document.getElementById(\'m-flashcard\').style.display=\'none\'">' + X + '</button>'
      + '<div style="text-align:center;padding:40px 20px;">'
      + '<div style="font-size:52px;margin-bottom:12px;">' + CHECK + '</div>'
      + '<div class="fc-end-title">\xA1Al d\xEDa!</div>'
      + '<div style="font-size:13px;color:var(--text2);margin-top:8px;">No hay tarjetas pendientes. El sistema las programa autom\xE1ticamente.</div>'
      + '<div style="font-size:11px;color:var(--text3);margin-top:16px;">' + allCards.length + ' conceptos en el mazo</div>'
      + '</div></div>';
    this.updateEntryUI(); return;
  }

  var card = due[0];
  var cId   = card.id !== undefined ? card.id : card.f;
  var term  = card.fromModule ? card.front : card.f;
  var def   = card.fromModule ? card.back  : card.b;
  var srs   = (this._st().srs || {})[cId] || { interval: 1, ease: 2.5, reps: 0 };
  var nHard = Math.max(1, Math.round((srs.interval || 1) * 0.5));
  var nOk   = srs.reps === 0 ? 1 : srs.reps === 1 ? 3 : Math.round((srs.interval || 1) * 1.5);
  var nEasy = srs.reps <= 1 ? (srs.reps === 0 ? 4 : 7) : Math.round((srs.interval || 1) * 2.5);
  var idStr = (typeof cId === 'string') ? "'" + cId + "'" : cId;
  var badge = card.fromModule ? '<div class="fc-mod-badge">📚 ' + (card.modTitle || '') + '</div>' : '';
  var eyeF  = card.fromModule ? 'Pregunta del m\xF3dulo' : 'Concepto';

  m.innerHTML = '<div class="fc-box">'
    + '<button class="modal-close" onclick="document.getElementById(\'m-flashcard\').style.display=\'none\'">' + X + '</button>'
    + '<div class="fc-header"><span class="fc-progress">' + done + ' / ' + daily + ' hoy</span><span class="fc-count">' + due.length + ' pendientes</span></div>'
    + '<div class="fc-pbar"><div class="fc-pbar-fill" style="width:' + Math.round(done / daily * 100) + '%;"></div></div>'
    + '<div class="fc-scene" id="fc-scene" onclick="_FC.flip()">'
    + '  <div class="fc-card" id="fc-card">'
    + '    <div class="fc-face fc-front">' + badge + '<div class="fc-eyebrow">' + eyeF + '</div><div class="fc-term">' + term + '</div><div class="fc-hint">Toca para ver la respuesta</div></div>'
    + '    <div class="fc-face fc-back">'  + badge + '<div class="fc-eyebrow">Respuesta</div><div class="fc-def">' + (def || '').replace(/\n/g, '<br>') + '</div></div>'
    + '  </div>'
    + '</div>'
    + '<div class="fc-btns" id="fc-btns" style="display:none;">'
    + '  <button class="fc-btn fc-btn-no"   onclick="_FC.answer(' + idStr + ',0)">No lo s\xE9<br><span>Hoy</span></button>'
    + '  <button class="fc-btn fc-btn-hard" onclick="_FC.answer(' + idStr + ',1)">Dif\xEDcil<br><span>' + nHard + 'd</span></button>'
    + '  <button class="fc-btn fc-btn-ok"   onclick="_FC.answer(' + idStr + ',2)">Bien<br><span>' + nOk + 'd</span></button>'
    + '  <button class="fc-btn fc-btn-easy" onclick="_FC.answer(' + idStr + ',3)">F\xE1cil<br><span>' + nEasy + 'd</span></button>'
    + '</div></div>';
};

_FC.answer = function(cardId, quality) {
  var st = this._st(), tod = this._today();
  if (!st.srs) st.srs = {};
  var srs = st.srs[cardId] || { interval: 1, ease: 2.5, reps: 0 };
  var days;
  if (quality === 0) {
    days = 0; srs.interval = 1; srs.reps = 0;
  } else if (quality === 1) {
    days = Math.max(1, Math.round((srs.interval || 1) * 0.5));
    srs.interval = days; srs.ease = Math.max(1.3, (srs.ease || 2.5) - 0.2);
    srs.reps = Math.max(0, (srs.reps || 0) - 1);
  } else if (quality === 2) {
    days = srs.reps === 0 ? 1 : srs.reps === 1 ? 3 : Math.round((srs.interval || 1) * 1.5);
    srs.interval = days; srs.reps = (srs.reps || 0) + 1;
  } else {
    days = srs.reps === 0 ? 4 : srs.reps === 1 ? 7 : Math.round((srs.interval || 1) * (srs.ease || 2.5));
    srs.ease = Math.min(3.5, (srs.ease || 2.5) + 0.1);
    srs.interval = days; srs.reps = (srs.reps || 0) + 1;
  }
  var next = new Date();
  if (days > 0) next.setDate(next.getDate() + days);
  var nextStr = days === 0 ? tod : next.toISOString().slice(0, 10);
  st.srs[cardId] = srs;
  st.nextReview[cardId] = nextStr;
  st.intervals[cardId] = days;
  if (!Array.isArray(st.doneToday)) st.doneToday = [];
  st.doneToday.push(tod);
  st.doneToday = st.doneToday.filter(function(d) { return d === tod; });
  S._flashcards = st;
  S.xp += 5; if (typeof F34_onXPGained === 'function') F34_onXPGained(5); saveState(); if (typeof spawnXP === 'function') spawnXP('+5 XP');
  this._sessionXP = (this._sessionXP || 0) + 5;
  this._sessionCards = (this._sessionCards || 0) + 1;
  var m = document.getElementById('m-flashcard');
  if (m) this._render(m);
};

_FC.updateEntryUI = function() {
  var subEl = document.querySelector('.fc-entry-sub');
  if (!subEl) return;
  var done = this._doneCount();
  if (done >= this._DAILY) { subEl.textContent = '✅ Sesi\xF3n de hoy completada'; return; }
  var due = this._due().length;
  subEl.textContent = due > 0
    ? due + ' tarjetas pendientes \xB7 toca para repasar'
    : '✅ Al d\xEDa \xB7 Vuelve ma\xF1ana';
};

/* ══════════════════════════════════════════════════════════════════
   F15 — WIDGET DAILY PATRIMONY DELTA
   · Compara patrimonio actual con snapshot del día anterior
   · Badge ▲/▼ con €X (Y%) bajo el hero amount
   · Se llama desde el bloque fpcard en updateUIFromState
══════════════════════════════════════════════════════════════════ */


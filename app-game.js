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
  if (_crisisActive) { S.crisisBuys = (S.crisisBuys || 0) + 1; checkAchievements(); }
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

  setEl('sdh-name',   stock.name   || ticker);
  setEl('sdh-ticker', ticker + ' · ' + (stock.market || ''));
  setEl('sdh-price',  fmtPrice(stock.price || 0));
  setEl('sdh-logo',   stock.icon   || '📈');
  setElHTML('sdh-pct', `<span style="color:${(stock.change || 0) >= 0 ? 'var(--accent)' : 'var(--danger)'}">${stock.change >= 0 ? '+' : ''}${(stock.change || 0).toFixed(2)}%</span>`);

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
  (function() {
    function holdBtn(id, dir) {
      var btn = document.getElementById(id);
      if (!btn || btn.dataset.hold) return;
      btn.dataset.hold = '1';
      var iv, tm, sp = 250;
      function start() {
        changeQty(dir);
        tm = setTimeout(function go() {
          changeQty(dir);
          sp = Math.max(150, sp - 15);
          iv = setTimeout(go, sp);
        }, 600);
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
  // Paper hands detection
  if (GAME._flashCrashTime && Date.now() - GAME._flashCrashTime < 10000 &&
      GAME._lastFlashCrashTicker === ticker) {
    S.paperHandsCount = (S.paperHandsCount || 0) + 1;
    toast('🧻 ¡Manos de Papel!', 'Vendiste durante un flash crash. Acabas de cristalizar tus pérdidas.', 't-danger');
    HAPTIC.error();
  } else if (_crisisActive) {
    // Sold during a crisis - still paper hands
    S.paperHandsCount = (S.paperHandsCount || 0) + 1;
  } else {
    // Held through crisis = diamond hands progress tracked via crisisSurvived
  }
  S.cash += sellPrice;
  delete S.businesses[biz.id];
  _ledgerAdd('in', 'biz_buy', `Vender negocio: ${biz.name}`, sellPrice);
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
  _ledgerAdd('out', 'biz_upgrade', `Mejora: ${upg.name} (${biz.name})`, upg.cost);
  saveState();
  toast('⬆️ Mejora aplicada', upg.name + ' · ' + upg.desc, 't-success');
  spawnXP('+50 XP');
  S.xp += 50;
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
      <button class="modal-close" onclick="document.getElementById('m-career').style.display='none'">✕</button>
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
  if (fx.xp)              { S.xp          += fx.xp;          spawnXP('+' + fx.xp + ' XP'); }
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
    outcomeEl.innerHTML = `
      <div style="color:var(--accent);font-weight:700;margin-bottom:6px;">💪 Decisión correcta: MANTENER</div>
      <div style="font-size:13px;color:var(--text2);">Históricamente, los mercados siempre se han recuperado. +150 XP por tu disciplina inversora.</div>`;
    toast('💪 ¡Mantuviste la calma!', '+150 XP · Decisión históricamente correcta', 't-success');
  } else {
    const loss      = Math.round(S.invested * 0.15);
    S.invested      = Math.max(0, S.invested - loss);
    S.patrimony     = Math.max(0, S.patrimony - loss);
    outcomeEl.innerHTML = `
      <div style="color:var(--danger);font-weight:700;margin-bottom:6px;">📉 Vendiste en pánico</div>
      <div style="font-size:13px;color:var(--text2);">Realizaste pérdidas de €${loss}. En el mundo real, esto sería permanente.</div>`;
    toast('📉 Vendiste en mínimos', `−€${loss} realizados`, 't-warn');
  }

  outcomeEl.style.display = 'block';
  document.querySelector('.crisis-actions')?.style?.setProperty('display', 'none');
  saveState();
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
  try { return localStorage.getItem(PREMIUM_KEY) === '1'; } catch (e) { return false; }
}

/** upgradeToPremium — Cierra el paywall y abre el modal de pago SAAS. */
function upgradeToPremium() {
  closeModal('m-paywall');
  openModal('m-premium-saas');
}

/** PM_showPaywall — Muestra el modal de paywall. trigger es el origen (unused por ahora). */
function PM_showPaywall(trigger) {
  setEl('pm-paywall-title', 'Desbloquea tu crecimiento financiero');
  setEl('pm-paywall-sub',   'Accede al plan Premium y multiplica tu progreso.');
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
  document.querySelectorAll('.saas-plan').forEach(p => p.classList.remove('active'));
  document.getElementById('plan-' + plan)?.classList.add('active');
}

/**
 * SAAS_startPayment — Inicia el flujo de pago simulado.
 * Muestra pantalla de loading con mensajes rotativos y finaliza con éxito tras 3s.
 */
function SAAS_startPayment() {
  const label   = _saasPlan === 'annual' ? 'Elite Anual · 65€/año' : 'Elite Mensual · 9€/mes';
  document.getElementById('saas-step-plan')?.style?.setProperty('display', 'none');
  const loading = document.getElementById('saas-step-loading');
  if (loading) loading.style.display = 'block';

  const msgs = [
    'Conectando con pasarela de pago segura...',
    'Verificando identidad (3D Secure)...',
    'Confirmando suscripción...',
  ];
  let mi = 0;
  const iv = setInterval(() => { setEl('saas-loading-msg', msgs[mi] || msgs[0]); mi++; }, 900);

  setTimeout(() => {
    clearInterval(iv);
    loading.style.display = 'none';
    const success = document.getElementById('saas-step-success');
    if (success) success.style.display = 'block';
    setEl('saas-plan-name', label);
    const nextYear = new Date(); nextYear.setFullYear(nextYear.getFullYear() + 1);
    setEl('saas-next-bill', nextYear.toLocaleDateString('es'));
    try { localStorage.setItem(PREMIUM_KEY, '1'); } catch (e) { }
  }, 3000);
}

/** SAAS_confirmSuccess — Cierra el modal de pago y resetea el estado visual del modal. */
function SAAS_confirmSuccess() {
  closeModal('m-premium-saas');
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
  const banner = document.getElementById('pwa-install-banner');
  if (banner) banner.style.display = 'flex';
});

/** PWA_triggerInstall — Activa el prompt nativo del navegador para instalar la PWA. */
function PWA_triggerInstall() {
  if (!_deferredInstallPrompt) return;
  _deferredInstallPrompt.prompt();
  _deferredInstallPrompt.userChoice.then(() => {
    _deferredInstallPrompt = null;
    PWA_dismissBanner();
  });
}

/** PWA_dismissBanner — Oculta el banner de instalación PWA. */
function PWA_dismissBanner() {
  const banner = document.getElementById('pwa-install-banner');
  if (banner) banner.style.display = 'none';
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
  const text = encodeURIComponent(`${user} está mejorando sus finanzas con FinLearn 🚀 Únete gratis: finlearn.app`);
  const urls = {
    twitter:  `https://twitter.com/intent/tweet?text=${text}`,
    whatsapp: `https://api.whatsapp.com/send?text=${text}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=https://finlearn.app`,
  };
  window.open(urls[platform] || urls.twitter, '_blank');
  closeModal('m-viral');
}

/** doCopyLink — Copia el enlace de la app al portapapeles. */
function doCopyLink() {
  navigator.clipboard?.writeText('https://finlearn.app').catch(() => { });
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
   FinAI — ASISTENTE DE IA FINANCIERO (STUB)
   ─────────────────────────────────────────────────────────────────
   Actualmente es un stub: abre/cierra el modal de FinAI.
   En futuras versiones contendrá la lógica del chat con IA.
══════════════════════════════════════════════════════════════════ */

const FinAI = {
  open()  { openModal('m-finai'); },
  close() { closeModal('m-finai'); },
};


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
    S.xp+=5; saveState(); spawnXP('+5 XP');
    var m=document.getElementById('m-flashcard');
    if (m) this._render(m);
  },
};

/* ══════════════════════════════════════════════════════════════════
   F15 — WIDGET DAILY PATRIMONY DELTA
   · Compara patrimonio actual con snapshot del día anterior
   · Badge ▲/▼ con €X (Y%) bajo el hero amount
   · Se llama desde el bloque fpcard en updateUIFromState
══════════════════════════════════════════════════════════════════ */

function renderDailyDelta() {
  var el=document.getElementById('fpcard-daily-delta');
  if (!el) return;
  var daily=(S.patrimonyDaily||[]), current=Math.round(S.patrimony||0);
  if (daily.length<2) { el.style.display='none'; return; }
  var yesterday=daily[daily.length-2].value;
  if (!yesterday||yesterday===0) { el.style.display='none'; return; }
  var delta=current-yesterday, pct=((delta/yesterday)*100).toFixed(2);
  var isUp=delta>=0, icon=isUp?'\u25B2':'\u25BC', cls=isUp?'delta-up':'delta-down', sign=isUp?'+':'';
  el.style.display='flex';
  el.innerHTML='<span class="fpd-icon '+cls+'">'+icon+'</span>'
    +'<span class="fpd-val '+cls+'">'+sign+'\u20AC'+Math.abs(Math.round(delta)).toLocaleString('es')+'</span>'
    +'<span class="fpd-pct '+cls+'">('+sign+pct+'%)</span>'
    +'<span class="fpd-label">vs ayer</span>';
}

/* ══════════════════════════════════════════════════════════════════
   F16 — COMBO SYSTEM + MICRO-INTERACTIONS
   · _COMBO tracking de racha de respuestas correctas
   · Multiplicador XP: ×1 → ×1.5 (2+) → ×2 (4+) → ×3 (6+)
   · Badge flotante animado en pantalla
   · _quizBurst: partículas de colores al acertar
   · quiz-shake: sacudida en opción errónea
══════════════════════════════════════════════════════════════════ */

var _COMBO = {count:0, active:false};

function _comboHit(correct) {
  if (correct) { _COMBO.count++; _COMBO.active=true; }
  else         { _COMBO.count=0; _COMBO.active=false; }
  _renderComboBadge();
  return _comboMult();
}

function _comboMult() {
  if (_COMBO.count>=6) return 3;
  if (_COMBO.count>=4) return 2;
  if (_COMBO.count>=2) return 1.5;
  return 1;
}

function _comboReset() { _COMBO.count=0; _COMBO.active=false; _renderComboBadge(); }

function _renderComboBadge() {
  var badge=document.getElementById('combo-badge');
  if (!badge) {
    badge=document.createElement('div');
    badge.id='combo-badge'; badge.className='combo-badge';
    document.body.appendChild(badge);
  }
  if (!_COMBO.active||_COMBO.count<2) { badge.classList.remove('combo-visible'); return; }
  var tier=_COMBO.count>=6?'combo-gold':_COMBO.count>=4?'combo-purple':'combo-green';
  badge.className='combo-badge combo-visible '+tier;
  badge.innerHTML='\uD83D\uDD25 <span class="cb-n">'+_COMBO.count+'×</span> COMBO '
    +'<span class="cb-m">\xD7'+_comboMult()+' XP</span>';
  badge.classList.remove('combo-pulse'); void badge.offsetWidth; badge.classList.add('combo-pulse');
}

function _quizBurst(optionId) {
  var el=optionId?document.getElementById(optionId):document.querySelector('.quiz-opt.correct');
  if (!el) return;
  var r=el.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
  var cols=['#00e5a0','#f0b429','#818cf8','#38bdf8','#fb7185'];
  for (var i=0;i<10;i++) {
    var p=document.createElement('span');
    p.className='quiz-burst-p';
    var angle=(i/10)*Math.PI*2, dist=28+Math.random()*28;
    var tx=Math.cos(angle)*dist, ty=Math.sin(angle)*dist;
    p.style.cssText='left:'+cx+'px;top:'+cy+'px;'
      +'--tx:'+tx.toFixed(1)+'px;--ty:'+ty.toFixed(1)+'px;'
      +'background:'+cols[i%cols.length]+';';
    document.body.appendChild(p);
    setTimeout(function(pp){ pp.remove(); }, 700, p);
  }
}

/* ══════════════════════════════════════════════════════════════════
   F19 — TEST DE PERSONALIDAD INVERSORA
   · 8 preguntas sobre tolerancia al riesgo, horizonte y objetivos
   · 4 perfiles: Conservador · Moderado · Agresivo · FIRE Seeker
   · Cartera recomendada personalizada por perfil
   · Guardado en S.investorProfile
   · Entrada desde s-profile
══════════════════════════════════════════════════════════════════ */

var INVESTOR_QUESTIONS = [
  {
    q: '¿Cuánto tiempo puedes dejar tu dinero invertido sin tocarlo?',
    opts: [
      {t:'Menos de 2 años',          s:{c:3, m:1, a:0, f:0}},
      {t:'2 a 5 años',               s:{c:1, m:2, a:1, f:0}},
      {t:'5 a 15 años',              s:{c:0, m:2, a:2, f:1}},
      {t:'Más de 15 años o siempre', s:{c:0, m:1, a:2, f:3}},
    ],
  },
  {
    q: 'Tu cartera cae un 20% en 3 meses. ¿Qué haces?',
    opts: [
      {t:'Vendo todo — no aguanto verlo bajar', s:{c:4, m:0, a:0, f:0}},
      {t:'Vendo la mitad por si cae más',       s:{c:2, m:2, a:0, f:0}},
      {t:'No hago nada — sigo el plan',         s:{c:0, m:2, a:2, f:1}},
      {t:'Compro más — es una oportunidad',     s:{c:0, m:0, a:3, f:3}},
    ],
  },
  {
    q: '¿Cuál es tu objetivo principal?',
    opts: [
      {t:'Proteger lo que tengo de la inflación',s:{c:4, m:1, a:0, f:0}},
      {t:'Crecer de forma estable a largo plazo', s:{c:0, m:3, a:1, f:1}},
      {t:'Maximizar rentabilidad aunque sea volátil',s:{c:0, m:0, a:4, f:1}},
      {t:'Alcanzar la independencia financiera (FIRE)', s:{c:0, m:1, a:1, f:4}},
    ],
  },
  {
    q: 'Si pudieras elegir, ¿qué opción preferiría para tus ahorros?',
    opts: [
      {t:'Garantizado +3% anual',                  s:{c:4, m:0, a:0, f:0}},
      {t:'70% probabilidad de +10%, 30% de -5%',   s:{c:1, m:3, a:1, f:1}},
      {t:'50% de +25%, 50% de -15%',               s:{c:0, m:1, a:3, f:1}},
      {t:'25% de +80%, 75% de no ganar nada',      s:{c:0, m:0, a:3, f:2}},
    ],
  },
  {
    q: '¿Cuánto tiempo le dedicas a gestionar tus finanzas?',
    opts: [
      {t:'Casi nada — prefiero automatizar todo', s:{c:2, m:2, a:0, f:2}},
      {t:'Reviso mis cuentas una vez al mes',      s:{c:1, m:3, a:1, f:1}},
      {t:'Sigo la bolsa varias veces a la semana', s:{c:0, m:1, a:3, f:0}},
      {t:'Es una de mis mayores aficiones',        s:{c:0, m:0, a:2, f:3}},
    ],
  },
  {
    q: 'Tu edad y situación laboral es…',
    opts: [
      {t:'Mayor de 55 o próximo a jubilarme',    s:{c:4, m:1, a:0, f:0}},
      {t:'35-55 con trabajo estable',            s:{c:1, m:3, a:1, f:0}},
      {t:'25-35 con ingresos estables',          s:{c:0, m:2, a:2, f:1}},
      {t:'Joven con ingresos variables / emprendedor', s:{c:0, m:1, a:2, f:3}},
    ],
  },
  {
    q: '¿Cuántos meses de fondo de emergencia tienes?',
    opts: [
      {t:'Ninguno — vivo al día',        s:{c:2, m:0, a:2, f:0}},
      {t:'1 a 2 meses',                  s:{c:1, m:2, a:1, f:0}},
      {t:'3 a 6 meses',                  s:{c:0, m:2, a:2, f:1}},
      {t:'Más de 6 meses cubiertos',     s:{c:0, m:1, a:1, f:4}},
    ],
  },
  {
    q: '¿Cómo te sientes cuando escuchas "invertir en bolsa"?',
    opts: [
      {t:'Miedo — prefiero no arriesgar', s:{c:4, m:0, a:0, f:0}},
      {t:'Curiosidad, pero con cautela',  s:{c:1, m:3, a:0, f:0}},
      {t:'Emoción — es la mejor forma de crear riqueza', s:{c:0, m:1, a:3, f:1}},
      {t:'Mi camino hacia la libertad financiera',       s:{c:0, m:0, a:1, f:4}},
    ],
  },
];

var INVESTOR_PROFILES = {
  c: {
    id: 'conservador', label: 'Conservador', icon: '\uD83D\uDEE1\uFE0F',
    color: '#38bdf8',
    tagline: 'La seguridad antes que todo',
    desc: 'Priorizas la preservaci\xF3n del capital. Prefieres certezas aunque la rentabilidad sea menor. La volatilidad te incomoda y tu horizonte es corto o mediano.',
    portfolio: [
      {name:'Renta fija / bonos',   pct:50, color:'#38bdf8'},
      {name:'ETF MSCI World',        pct:20, color:'#00e5a0'},
      {name:'Cuenta remunerada',     pct:20, color:'#818cf8'},
      {name:'Oro / commodities',     pct:10, color:'#f0b429'},
    ],
    tip: 'Considera al menos un 20% en un ETF global para protegerte de la inflaci\xF3n a largo plazo.',
  },
  m: {
    id: 'moderado', label: 'Moderado', icon: '\u2696\uFE0F',
    color: '#00e5a0',
    tagline: 'Equilibrio entre crecimiento y estabilidad',
    desc: 'Buscas un balance entre rentabilidad y tranquilidad. Puedes soportar ca\xEDdas temporales si el horizonte es suficientemente largo. La estrategia 60/40 es tu aliada.',
    portfolio: [
      {name:'ETF MSCI World',      pct:50, color:'#00e5a0'},
      {name:'Renta fija / bonos',  pct:25, color:'#38bdf8'},
      {name:'ETF Nasdaq 100',      pct:15, color:'#818cf8'},
      {name:'Efectivo / liquidez', pct:10, color:'#f0b429'},
    ],
    tip: 'El rebalanceo anual es clave: cuando bolsa sube mucho, vende un poco y a\xF1ade bonos. Y viceversa.',
  },
  a: {
    id: 'agresivo', label: 'Agresivo', icon: '\uD83D\uDE80',
    color: '#818cf8',
    tagline: 'Máxima rentabilidad a largo plazo',
    desc: 'Tienes tolerancia alta al riesgo y horizonte largo. Las ca\xEDdas del mercado las ves como oportunidades. Tu objetivo es multiplicar el capital, no solo preservarlo.',
    portfolio: [
      {name:'ETF Nasdaq 100',       pct:40, color:'#818cf8'},
      {name:'ETF MSCI World',       pct:35, color:'#00e5a0'},
      {name:'Acciones individuales',pct:15, color:'#f0b429'},
      {name:'Crypto / alternativos',pct:10, color:'#fb7185'},
    ],
    tip: 'Aplica DCA mensual y nunca inviertas dinero que puedas necesitar en los pr\xF3ximos 5 a\xF1os.',
  },
  f: {
    id: 'fire', label: 'FIRE Seeker', icon: '\uD83D\uDD25',
    color: '#f0b429',
    tagline: 'Independencia financiera y retiro anticipado',
    desc: 'Tu objetivo es la libertad total. La Regla del 4% es tu gu\xEDa. Inviertes agresivamente y controlas cada euro. Cada d\xEDa de trabajo es uno menos, no uno m\xE1s.',
    portfolio: [
      {name:'ETF MSCI World acumulaci\xF3n', pct:60, color:'#f0b429'},
      {name:'ETF Nasdaq 100',               pct:20, color:'#818cf8'},
      {name:'REITs / inmobiliario',         pct:10, color:'#00e5a0'},
      {name:'Fondo de emergencia 12m',      pct:10, color:'#38bdf8'},
    ],
    tip: 'Con la Regla del 4% necesitas 25× tus gastos anuales. \xBFCu\xE1nto llevas ahorrado ya?',
  },
};

var INVESTOR_TEST = (function() {
  var _step = 0, _scores = {c:0, m:0, a:0, f:0};

  function _open() {
    _step = 0; _scores = {c:0, m:0, a:0, f:0};
    var m = _getModal();
    m.style.display = 'flex';
    _render(m);
  }

  function _getModal() {
    var m = document.getElementById('m-investor-test');
    if (!m) {
      m = document.createElement('div');
      m.id = 'm-investor-test'; m.className = 'modal-overlay';
      document.body.appendChild(m);
    }
    return m;
  }

  function _close() {
    var m = document.getElementById('m-investor-test');
    if (m) m.style.display = 'none';
  }

  function _render(m) {
    if (_step >= INVESTOR_QUESTIONS.length) { _showResult(m); return; }
    var q = INVESTOR_QUESTIONS[_step];
    var prog = Math.round((_step / INVESTOR_QUESTIONS.length) * 100);
    m.innerHTML = '<div class="it-box">'
      + '<button class="modal-close" onclick="INVESTOR_TEST.close()">\u2715</button>'
      + '<div class="it-header">'
      + '<div class="it-eyebrow">Pregunta ' + (_step+1) + ' de ' + INVESTOR_QUESTIONS.length + '</div>'
      + '<div class="it-pbar"><div class="it-pbar-fill" style="width:' + prog + '%;"></div></div>'
      + '</div>'
      + '<div class="it-q">' + q.q + '</div>'
      + '<div class="it-opts">'
      + q.opts.map(function(o, i) {
          return '<button class="it-opt" onclick="INVESTOR_TEST.pick(' + i + ')">'
            + '<span class="it-opt-letter">' + 'ABCD'[i] + '</span>'
            + '<span class="it-opt-text">' + o.t + '</span>'
            + '</button>';
        }).join('')
      + '</div>'
      + '</div>';
  }

  function _pick(optIdx) {
    var q = INVESTOR_QUESTIONS[_step];
    var s = q.opts[optIdx].s;
    _scores.c += s.c; _scores.m += s.m; _scores.a += s.a; _scores.f += s.f;
    _step++;
    var m = _getModal();
    // Quick flash transition
    m.querySelector('.it-box').style.opacity = '0';
    setTimeout(function() { _render(m); }, 160);
  }

  function _showResult(m) {
    // Determine profile
    var best = 'c', bestScore = _scores.c;
    ['m','a','f'].forEach(function(k) { if (_scores[k] > bestScore) { best = k; bestScore = _scores[k]; } });
    var p = INVESTOR_PROFILES[best];

    // Save to state
    S.investorProfile = { id: p.id, label: p.label, icon: p.icon, color: p.color, scores: _scores };
    saveState();
    spawnXP('+100 XP');
    S.xp += 100; saveState();

    // Build pie SVG
    var total = p.portfolio.reduce(function(a, b) { return a + b.pct; }, 0);
    var pieSVG = _buildPieSVG(p.portfolio, total);

    m.innerHTML = '<div class="it-box it-result-box">'
      + '<button class="modal-close" onclick="INVESTOR_TEST.close()">\u2715</button>'
      + '<div style="text-align:center;margin-bottom:16px;">'
      + '<div class="it-result-icon" style="color:' + p.color + ';">' + p.icon + '</div>'
      + '<div class="it-result-label" style="color:' + p.color + ';">' + p.label + '</div>'
      + '<div class="it-result-tagline">' + p.tagline + '</div>'
      + '</div>'
      + '<div class="it-result-desc">' + p.desc + '</div>'
      + '<div class="it-port-section">'
      + '<div class="it-port-title">Cartera recomendada</div>'
      + '<div class="it-port-layout">'
      + '<div>' + pieSVG + '</div>'
      + '<div class="it-port-legend">'
      + p.portfolio.map(function(seg) {
          return '<div class="it-leg-row">'
            + '<span class="it-leg-dot" style="background:' + seg.color + ';"></span>'
            + '<span class="it-leg-name">' + seg.name + '</span>'
            + '<span class="it-leg-pct">' + seg.pct + '%</span>'
            + '</div>';
        }).join('')
      + '</div>'
      + '</div>'
      + '</div>'
      + '<div class="it-tip">\uD83D\uDCA1 ' + p.tip + '</div>'
      + '<button class="btn btn-primary btn-block" onclick="INVESTOR_TEST.close();toast(\'✅ Perfil guardado\',\'' + p.label + ' — ' + p.tagline + '\',\'t-success\')" style="margin-top:16px;">'
      + 'Guardar mi perfil</button>'
      + '</div>';

    confetti();
    SFX.achievement();
  }

  function _buildPieSVG(segs, total) {
    var cx = 64, cy = 64, r = 52, gap = 1.5;
    var angle = -Math.PI / 2;
    var paths = segs.map(function(seg) {
      var sweep = (seg.pct / total) * (Math.PI * 2 - gap * segs.length * (Math.PI/180));
      var x1 = cx + r * Math.cos(angle);
      var y1 = cy + r * Math.sin(angle);
      angle += sweep + gap * (Math.PI/180);
      var x2 = cx + r * Math.cos(angle);
      var y2 = cy + r * Math.sin(angle);
      var large = sweep > Math.PI ? 1 : 0;
      return '<path d="M ' + cx + ' ' + cy + ' L ' + x1.toFixed(2) + ' ' + y1.toFixed(2)
        + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2)
        + ' Z" fill="' + seg.color + '" opacity="0.88"/>';
    }).join('');
    // Center hole
    return '<svg viewBox="0 0 128 128" width="120" height="120">'
      + paths
      + '<circle cx="64" cy="64" r="28" fill="var(--card)"/>'
      + '</svg>';
  }

  return { open: _open, close: _close, pick: _pick };
})();

/* ══════════════════════════════════════════════════════════════════
   F20 — HITOS PATRIMONIALES
   · Celebración al alcanzar 1k / 5k / 10k / 25k / 50k / 100k / 250k / 500k / 1M
   · Modal especial con confetti grande + XP reward
   · S.milestonesReached[] — evita doble disparo
   · Se checkea en _trackPatrimonyPeak() y tras cada income/reward
══════════════════════════════════════════════════════════════════ */

var PATRIMONY_MILESTONES = [
  {v:1000,    icon:'\uD83C\uDF31', label:'¡Primera barrera!',      msg:'Has superado los €1.000 de patrimonio. El viaje de mil millas empieza con el primer paso.', xp:150,  cash:50},
  {v:5000,    icon:'\uD83D\uDCB0', label:'€5.000 — ¡Va en serio!', msg:'Solo el 37% de los jóvenes en España llega a este punto. Eres del selecto grupo que actúa.', xp:300,  cash:100},
  {v:10000,   icon:'\uD83D\uDE80', label:'Cinco dígitos alcanzados', msg:'€10.000. Con el interés compuesto, este dinero puede convertirse en €100.000 en 30 años.', xp:600,  cash:250},
  {v:25000,   icon:'\uD83C\uDFC6', label:'€25.000 — Masa crítica', msg:'Tu dinero empieza a trabajar para ti con fuerza real. La bola de nieve está rodando.', xp:1000, cash:500},
  {v:50000,   icon:'\uD83D\uDC8E', label:'Zona élite: €50.000',   msg:'Eres del top 15% de ahorradores. A este ritmo, la independencia financiera es alcanzable.', xp:2000, cash:1000},
  {v:100000,  icon:'\uD83C\uDF1F', label:'¡€100.000! Leyenda',    msg:'El primer millón cuesta más que el resto. Has completado el 10% del camino al millón. Los próximos 900k irán más rápido gracias al compounding.', xp:5000, cash:3000},
  {v:250000,  icon:'\uD83D\uDD25', label:'€250.000 — FIRE visible', msg:'Con €250.000 al 4% anual generas €10.000 en ingresos pasivos. La libertad financiera se acerca.', xp:10000, cash:7500},
  {v:500000,  icon:'\uD83D\uDCA5', label:'Medio millón. Épico.',  msg:'€500.000 generan €1.666/mes en ingresos pasivos. ¿Cuándo firmas la carta de renuncia?', xp:20000, cash:15000},
  {v:1000000, icon:'\uD83D\uDC51', label:'¡MILLONARIO VIRTUAL!', msg:'1.000.000€. La Regla del 4% te da €40.000/año para siempre. Has alcanzado la LIBERTAD FINANCIERA. Este es el sueño hecho realidad.', xp:50000, cash:50000},
];

function _checkPatrimonyMilestones() {
  if (!Array.isArray(S.milestonesReached)) S.milestonesReached = [];
  var p = Math.round(S.patrimony || 0);
  var pending = PATRIMONY_MILESTONES.filter(function(m) {
    return p >= m.v && !S.milestonesReached.includes(m.v);
  });
  if (!pending.length) return;
  // Show the highest unreached milestone (most satisfying)
  var hit = pending[pending.length - 1];
  S.milestonesReached.push(hit.v);
  S.xp   += hit.xp;
  S.cash += hit.cash;
  saveState();

  // Show milestone modal
  setTimeout(function() { _showMilestoneModal(hit); }, 400);
}

function _showMilestoneModal(hit) {
  var m = document.getElementById('m-milestone');
  if (!m) {
    m = document.createElement('div');
    m.id = 'm-milestone'; m.className = 'modal-overlay';
    document.body.appendChild(m);
  }
  m.innerHTML = '<div class="ms-box">'
    + '<div class="ms-glow" style="--ms-color:var(--accent);"></div>'
    + '<div class="ms-icon">' + hit.icon + '</div>'
    + '<div class="ms-tag">NUEVO HITO</div>'
    + '<div class="ms-label">' + hit.label + '</div>'
    + '<div class="ms-amount">\u20AC' + hit.v.toLocaleString('es') + '</div>'
    + '<div class="ms-msg">' + hit.msg + '</div>'
    + '<div class="ms-rewards">'
    + '<div class="ms-rew-item"><span class="ms-rew-icon">\u26A1</span><span>+' + hit.xp.toLocaleString('es') + ' XP</span></div>'
    + '<div class="ms-rew-item"><span class="ms-rew-icon">\uD83D\uDCB8</span><span>+\u20AC' + hit.cash.toLocaleString('es') + ' bonus</span></div>'
    + '</div>'
    + '<button class="btn btn-primary btn-block" onclick="document.getElementById(\'m-milestone\').style.display=\'none\'" style="margin-top:20px;">Seguir construyendo \uD83D\uDE80</button>'
    + '</div>';
  m.style.display = 'flex';
  SFX.levelUp();
  confetti();
  emojiConfetti();
  spawnXP('+' + hit.xp.toLocaleString('es') + ' XP');
}

/* ══════════════════════════════════════════════════════════════════
   F12 — SIMULADOR INTERACTIVO DE HIPOTECA
   · 3 tabs: Básica | Tabla de amortización | Amortización anticipada
   · Sliders tiempo real → SVG gráfica capital/intereses por año
   · Si hay hipoteca activa → pre-rellena con valores reales
   · Funciones: openMortgageSimulator, mortSimTab, _mortSimUpdate,
     _mortSimDrawSVG, _mortSimEarlyUpdate, _mortSimDrawEarlySVG
══════════════════════════════════════════════════════════════════ */

function openMortgageSimulator() {
  var m = document.getElementById('m-mort-sim');
  if (!m) {
    m = document.createElement('div');
    m.id = 'm-mort-sim'; m.className = 'modal-overlay';
    document.body.appendChild(m);
  }

  // Pre-fill with active mortgage if available
  var defPrinc = 150000, defRate = 3.2, defYears = 25;
  if (S.mortgages && S.mortgages.length > 0) {
    var active = S.mortgages.find(function(x) { return x.remainingMonths > 0; });
    if (active) {
      var rem = Math.round(active.principal * (active.remainingMonths / active.months));
      defPrinc = Math.max(30000, rem);
      defRate  = active.rate || 3.2;
      defYears = Math.round(active.remainingMonths / 12) || 25;
    }
  }

  m.innerHTML = '<div class="ms-sim-box">'
    + '<button class="modal-close" onclick="document.getElementById(\'m-mort-sim\').style.display=\'none\'">\u2715</button>'
    + '<div style="font-size:16px;font-weight:800;margin-bottom:14px;">\uD83C\uDFE0 Simulador de Hipoteca</div>'
    + '<div class="ms-sim-tabs" id="ms-sim-tabs">'
    + '<button class="ms-stab active" onclick="mortSimTab(\'basic\',this)">B\xE1sica</button>'
    + '<button class="ms-stab" onclick="mortSimTab(\'amort\',this)">Amortizaci\xF3n</button>'
    + '<button class="ms-stab" onclick="mortSimTab(\'early\',this)">Anticipada</button>'
    + '</div>'

    + '<div id="ms-tab-basic">'
    + _mortSimSlider('ms-principal','Capital (€)',defPrinc,30000,600000,5000)
    + _mortSimSlider('ms-rate','Tipo de inter\xE9s (%)',defRate,0.5,8,0.1)
    + _mortSimSlider('ms-years','Plazo (a\xF1os)',defYears,5,35,1)
    + '<div class="ms-sim-res" id="ms-basic-res"></div>'
    + '</div>'

    + '<div id="ms-tab-amort" style="display:none;">'
    + '<div class="ms-chart-wrap" id="ms-amort-chart"></div>'
    + '<div id="ms-amort-legend" class="ms-chart-legend"></div>'
    + '</div>'

    + '<div id="ms-tab-early" style="display:none;">'
    + _mortSimSlider('ms-extra','Amortizaci\xF3n extra/mes (€)',200,50,2000,50)
    + '<div id="ms-early-res"></div>'
    + '</div>'

    + '</div>';

  m.style.display = 'flex';
  window._mortSimTab = 'basic';
  _mortSimUpdate();
}

function _mortSimSlider(id, label, val, min, max, step) {
  return '<div class="ms-sl-row">'
    + '<div class="ms-sl-head"><span class="ms-sl-label">' + label + '</span><span class="ms-sl-val" id="' + id + '-val"></span></div>'
    + '<input type="range" class="ms-slider" id="' + id + '" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" oninput="_mortSimUpdate()">'
    + '<div class="ms-sl-limits"><span>' + (id.includes('rate') ? min + '%' : id.includes('years') ? min + 'a' : '\u20AC' + min.toLocaleString('es')) + '</span>'
    + '<span>' + (id.includes('rate') ? max + '%' : id.includes('years') ? max + 'a' : '\u20AC' + max.toLocaleString('es')) + '</span></div>'
    + '</div>';
}

function mortSimTab(tab, btn) {
  window._mortSimTab = tab;
  document.querySelectorAll('.ms-stab').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  ['basic','amort','early'].forEach(function(t) {
    var el = document.getElementById('ms-tab-' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  _mortSimUpdate();
}

function _mortSimUpdate() {
  var principal = parseFloat(document.getElementById('ms-principal')?.value) || 150000;
  var rate      = parseFloat(document.getElementById('ms-rate')?.value)      || 3.2;
  var years     = parseInt(document.getElementById('ms-years')?.value)       || 25;
  var extra     = parseFloat(document.getElementById('ms-extra')?.value)     || 200;

  // Update display values
  var fmt = function(n) { return '\u20AC' + Math.round(n).toLocaleString('es'); };
  var sid = document.getElementById('ms-principal-val'); if (sid) sid.textContent = fmt(principal);
  var rid = document.getElementById('ms-rate-val');      if (rid) rid.textContent = rate.toFixed(1) + '%';
  var yid = document.getElementById('ms-years-val');     if (yid) yid.textContent = years + ' años';
  var eid = document.getElementById('ms-extra-val');     if (eid) eid.textContent = fmt(extra) + '/mes';

  var months   = years * 12;
  var r        = rate / 100 / 12;
  var payment  = r > 0 ? principal * (r * Math.pow(1+r,months)) / (Math.pow(1+r,months)-1) : principal/months;
  var totalPay = payment * months;
  var totalInt = totalPay - principal;

  var tab = window._mortSimTab || 'basic';
  if (tab === 'basic') {
    var res = document.getElementById('ms-basic-res');
    if (!res) return;
    res.innerHTML = '<div class="ms-res-grid">'
      + _msResItem(fmt(Math.round(payment)), 'Cuota mensual', true)
      + _msResItem(fmt(Math.round(totalPay)), 'Total pagado', false)
      + _msResItem(fmt(Math.round(totalInt)), 'Intereses', false)
      + _msResItem((totalInt/principal*100).toFixed(0)+'%', '% de intereses', false)
      + '</div>';
  } else if (tab === 'amort') {
    _mortSimDrawSVG(principal, rate, years);
  } else if (tab === 'early') {
    _mortSimEarlyUpdate(principal, rate, years, extra);
  }
}

function _msResItem(val, label, main) {
  return '<div class="ms-ri' + (main?' ms-ri-main':'') + '">'
    + '<div class="ms-ri-val">' + val + '</div>'
    + '<div class="ms-ri-lab">' + label + '</div>'
    + '</div>';
}

function _mortSimDrawSVG(principal, rate, years) {
  var chart = document.getElementById('ms-amort-chart');
  if (!chart) return;
  var months = years * 12;
  var r = rate / 100 / 12;
  var payment = r > 0 ? principal*(r*Math.pow(1+r,months))/(Math.pow(1+r,months)-1) : principal/months;
  // Aggregate by year
  var yearData = [], bal = principal;
  for (var y = 0; y < years; y++) {
    var yCap = 0, yInt = 0;
    for (var mo = 0; mo < 12; mo++) {
      var intPay = bal * r, capPay = payment - intPay;
      yInt += intPay; yCap += capPay; bal = Math.max(0, bal - capPay);
    }
    yearData.push({cap: Math.round(yCap), int: Math.round(yInt)});
  }
  var maxVal = Math.max.apply(null, yearData.map(function(d) { return d.cap + d.int; }));
  var W = 320, H = 130, PAD_L = 36, PAD_B = 22, barW = (W - PAD_L - 8) / years;
  var scY = function(v) { return H - PAD_B - (v / maxVal) * (H - PAD_B - 8); };
  var bars = yearData.map(function(d, i) {
    var x = PAD_L + i * barW + 1;
    var yInt = scY(d.cap + d.int), yCap = scY(d.cap);
    return '<rect x="' + x.toFixed(1) + '" y="' + yInt.toFixed(1) + '" width="' + (barW-2).toFixed(1) + '" height="' + (yCap - yInt).toFixed(1) + '" fill="#ef4444" opacity=".7"/>'
      + '<rect x="' + x.toFixed(1) + '" y="' + yCap.toFixed(1) + '" width="' + (barW-2).toFixed(1) + '" height="' + (H - PAD_B - yCap).toFixed(1) + '" fill="var(--accent)" opacity=".8"/>';
  }).join('');
  // Y axis labels
  var fmt2 = function(n) { return n >= 1000 ? (n/1000).toFixed(0)+'k' : n; };
  var yLabels = [0.25,0.5,0.75,1].map(function(f) {
    var v = Math.round(maxVal * f), y = scY(v);
    return '<text x="' + (PAD_L-4) + '" y="' + y.toFixed(1) + '" font-size="8" fill="rgba(255,255,255,.3)" text-anchor="end">' + fmt2(v) + '</text>';
  }).join('');
  // X labels every 5 years
  var xLabels = '';
  for (var yi = 0; yi < years; yi += 5) {
    var lx = PAD_L + yi * barW + barW/2;
    xLabels += '<text x="' + lx.toFixed(1) + '" y="' + (H-6) + '" font-size="8" fill="rgba(255,255,255,.35)" text-anchor="middle">A' + (yi+1) + '</text>';
  }
  chart.innerHTML = '<div class="ms-chart-title">Capital vs Intereses por año</div>'
    + '<svg viewBox="0 0 ' + W + ' ' + H + '" width="100%" style="overflow:visible;">'
    + '<line x1="' + PAD_L + '" y1="8" x2="' + PAD_L + '" y2="' + (H-PAD_B) + '" stroke="rgba(255,255,255,.1)" stroke-width="1"/>'
    + '<line x1="' + PAD_L + '" y1="' + (H-PAD_B) + '" x2="' + (W-8) + '" y2="' + (H-PAD_B) + '" stroke="rgba(255,255,255,.1)" stroke-width="1"/>'
    + yLabels + xLabels + bars
    + '</svg>';
  var legend = document.getElementById('ms-amort-legend');
  if (legend) legend.innerHTML = '<span><span class="ms-leg-dot" style="background:var(--accent);"></span>Capital</span>'
    + '<span><span class="ms-leg-dot" style="background:#ef4444;"></span>Intereses</span>';
}

function _mortSimEarlyUpdate(principal, rate, years, extra) {
  var res = document.getElementById('ms-early-res');
  if (!res) return;
  var months = years * 12;
  var r = rate / 100 / 12;
  var pmt = r > 0 ? principal*(r*Math.pow(1+r,months))/(Math.pow(1+r,months)-1) : principal/months;
  var totalNormal = pmt * months;

  // With extra payment simulation
  var bal = principal, paidMo = 0, totalWithExtra = 0;
  while (bal > 0 && paidMo < months) {
    var intPay = bal * r;
    var pay = Math.min(pmt + extra, bal + intPay);
    totalWithExtra += pay;
    bal -= (pay - intPay);
    paidMo++;
  }
  var saved = totalNormal - totalWithExtra;
  var yearsSaved = ((months - paidMo) / 12).toFixed(1);
  var fmtE = function(n) { return '\u20AC' + Math.abs(Math.round(n)).toLocaleString('es'); };

  res.innerHTML = '<div class="ms-early-summary">'
    + '<div class="ms-early-row"><span>Sin amortizaci\xF3n extra:</span><span class="ms-early-num-bad">' + fmtE(totalNormal) + '</span></div>'
    + '<div class="ms-early-row"><span>Con amortizaci\xF3n extra:</span><span class="ms-early-num-good">' + fmtE(totalWithExtra) + '</span></div>'
    + '<div class="ms-early-divider"></div>'
    + '<div class="ms-early-row ms-early-highlight"><span>\uD83D\uDCB0 Intereses ahorrados:</span><span style="color:var(--accent);font-weight:800;">' + fmtE(saved) + '</span></div>'
    + '<div class="ms-early-row ms-early-highlight"><span>\u23F1 A\xF1os ganados:</span><span style="color:var(--accent);font-weight:800;">' + yearsSaved + ' a\xF1os</span></div>'
    + '<div class="ms-early-row"><span>Nueva duraci\xF3n:</span><span>' + (paidMo/12).toFixed(1) + ' a\xF1os</span></div>'
    + '</div>';
}

/* ══════════════════════════════════════════════════════════════════
   F21 — PRESUPUESTO MENSUAL INTERACTIVO
   · 8 categorías editables con slider + input
   · Donut SVG en tiempo real
   · Benchmark vs media española por categoría
   · Plan de optimización personalizado
   · S._budget = { income, cats:{vivienda, comida, …} }
   · +50 XP al guardar el primer presupuesto
══════════════════════════════════════════════════════════════════ */

var BUDGET_CATS = [
  { id:'vivienda',     icon:'🏠', label:'Vivienda',        color:'#38bdf8', max:3000, bench:880,  tip:'Lo ideal es no superar el 30% de tus ingresos netos.' },
  { id:'comida',       icon:'🛒', label:'Alimentación',    color:'#00e5a0', max:1200, bench:420,  tip:'Cocinar en casa vs comer fuera puede ahorrar 150-300€/mes.' },
  { id:'transporte',   icon:'🚗', label:'Transporte',      color:'#818cf8', max:1000, bench:310,  tip:'El coste real de un coche incluye seguro, combustible y mantenimiento.' },
  { id:'ocio',         icon:'🎭', label:'Ocio & Suscripciones', color:'#f0b429', max:800, bench:230, tip:'Audita tus suscripciones: el español medio paga por 4 que no usa.' },
  { id:'salud',        icon:'💊', label:'Salud',           color:'#fb7185', max:500,  bench:120,  tip:'Incluye gimnasio, farmacia y seguros privados de salud.' },
  { id:'ropa',         icon:'👕', label:'Ropa & Belleza',  color:'#c084fc', max:500,  bench:140,  tip:'La moda rápida es una de las categorías más infravaloradas.' },
  { id:'formacion',    icon:'📚', label:'Formación',       color:'#4ade80', max:300,  bench:55,   tip:'Invertir en ti mismo tiene el ROI más alto posible.' },
  { id:'varios',       icon:'🔧', label:'Otros gastos',    color:'#94a3b8', max:600,  bench:180,  tip:'Incluye reparaciones, regalos y gastos imprevistos.' },
];

var _BUDGET = (function() {
  function _getState() {
    if (!S._budget) S._budget = { income: S.lifeSalary || S.income || 2000, cats: {}, saved: false };
    // Default values if not set
    BUDGET_CATS.forEach(function(c) {
      if (S._budget.cats[c.id] === undefined) S._budget.cats[c.id] = Math.round(c.bench);
    });
    return S._budget;
  }

  function open() {
    var m = document.getElementById('m-budget');
    if (!m) {
      m = document.createElement('div');
      m.id = 'm-budget'; m.className = 'modal-overlay';
      document.body.appendChild(m);
    }
    m.style.display = 'flex';
    _render(m);
  }

  function _render(m) {
    var b = _getState();
    var totalExp = BUDGET_CATS.reduce(function(s, c) { return s + (b.cats[c.id] || 0); }, 0);
    var surplus  = b.income - totalExp;
    var surplusClass = surplus >= 0 ? 'bgt-surplus-ok' : 'bgt-surplus-neg';

    var catSliders = BUDGET_CATS.map(function(c) {
      var val = b.cats[c.id] || 0;
      var pct = b.income > 0 ? Math.round((val / b.income) * 100) : 0;
      var benchPct = b.income > 0 ? Math.round((c.bench / b.income) * 100) : 0;
      var over = val > c.bench * 1.3;
      return '<div class="bgt-cat-row" id="bcat-' + c.id + '">'
        + '<div class="bgt-cat-head">'
        + '<span class="bgt-cat-icon">' + c.icon + '</span>'
        + '<span class="bgt-cat-name">' + c.label + '</span>'
        + '<span class="bgt-cat-bench" title="Media española">⌀ €' + c.bench + '</span>'
        + '<span class="bgt-cat-val ' + (over ? 'bgt-over' : '') + '" id="bcat-val-' + c.id + '">€' + val + '</span>'
        + '</div>'
        + '<input type="range" class="bgt-slider" style="--track-color:' + c.color + ';" '
        + 'id="bcat-sl-' + c.id + '" min="0" max="' + c.max + '" step="10" value="' + val + '" '
        + 'oninput="_BUDGET.update(\'' + c.id + '\',this.value)">'
        + '<div class="bgt-bench-bar"><div class="bgt-bench-fill" style="width:' + Math.min(benchPct,100) + '%;background:rgba(255,255,255,.18);"></div>'
        + '<div class="bgt-actual-fill" style="width:' + Math.min(pct,100) + '%;background:' + c.color + ';"></div></div>'
        + '</div>';
    }).join('');

    m.innerHTML = '<div class="bgt-box">'
      + '<button class="modal-close" onclick="document.getElementById(\'m-budget\').style.display=\'none\'">\u2715</button>'
      + '<div class="bgt-header">'
      + '<div style="font-size:16px;font-weight:800;">\uD83D\uDCCA Presupuesto Mensual</div>'
      + '<div style="font-size:11px;color:var(--text2);margin-top:2px;">Ajusta tus gastos reales para ver tu situación financiera real</div>'
      + '</div>'

      // Income input
      + '<div class="bgt-income-row">'
      + '<span class="bgt-income-label">\uD83D\uDCB0 Ingresos netos/mes</span>'
      + '<input type="number" class="bgt-income-input" id="bgt-income" value="' + b.income + '" min="500" max="20000" step="100" oninput="_BUDGET.setIncome(this.value)">'
      + '</div>'

      // Donut + surplus in one row
      + '<div class="bgt-overview">'
      + '<div id="bgt-donut-wrap">' + _buildDonut(b) + '</div>'
      + '<div class="bgt-surplus-box ' + surplusClass + '">'
      + '<div class="bgt-surplus-label">Disponible para invertir</div>'
      + '<div class="bgt-surplus-val" id="bgt-surplus-val">' + (surplus >= 0 ? '+' : '') + '\u20AC' + surplus.toLocaleString('es') + '</div>'
      + '<div class="bgt-surplus-pct" id="bgt-surplus-pct">' + (b.income > 0 ? Math.abs(Math.round(surplus/b.income*100)) : 0) + '% de tus ingresos</div>'
      + '<div class="bgt-rate-label">' + _savingsRateLabel(b.income > 0 ? surplus/b.income : 0) + '</div>'
      + '</div>'
      + '</div>'

      // Category sliders
      + '<div class="bgt-cats" id="bgt-cats">' + catSliders + '</div>'

      // Optimization tip
      + '<div class="bgt-tip-box" id="bgt-tip-box">' + _buildTip(b) + '</div>'

      + '<button class="btn btn-primary btn-block" style="margin-top:14px;" onclick="_BUDGET.save()">Guardar presupuesto</button>'
      + '</div>';
  }

  function _buildDonut(b) {
    var totalExp = BUDGET_CATS.reduce(function(s, c) { return s + (b.cats[c.id] || 0); }, 0);
    var cx = 54, cy = 54, r = 40, strokeW = 14;
    var circ = 2 * Math.PI * r;
    var angle = -Math.PI / 2;
    var paths = '';
    BUDGET_CATS.forEach(function(c) {
      var val = b.cats[c.id] || 0;
      if (val <= 0) return;
      var frac = val / Math.max(totalExp, 1);
      var sweep = frac * circ;
      var x1 = cx + r * Math.cos(angle);
      var y1 = cy + r * Math.sin(angle);
      angle += frac * 2 * Math.PI;
      var x2 = cx + r * Math.cos(angle);
      var y2 = cy + r * Math.sin(angle);
      var large = frac > 0.5 ? 1 : 0;
      paths += '<path d="M ' + x1.toFixed(2) + ' ' + y1.toFixed(2)
        + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2)
        + ' L ' + cx + ' ' + cy + ' Z" fill="' + c.color + '" opacity="0.85"/>';
    });
    var surplus = b.income - totalExp;
    if (surplus > 0 && b.income > 0) {
      var frac = surplus / b.income;
      var x1 = cx + r * Math.cos(angle);
      var y1 = cy + r * Math.sin(angle);
      angle += frac * 2 * Math.PI;
      var x2 = cx + r * Math.cos(angle);
      var y2 = cy + r * Math.sin(angle);
      var large = frac > 0.5 ? 1 : 0;
      paths += '<path d="M ' + x1.toFixed(2) + ' ' + y1.toFixed(2)
        + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x2.toFixed(2) + ' ' + y2.toFixed(2)
        + ' L ' + cx + ' ' + cy + ' Z" fill="#00e5a0" opacity="0.5"/>';
    }
    return '<svg viewBox="0 0 108 108" width="108" height="108">'
      + paths
      + '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - strokeW/2) + '" fill="var(--card)"/>'
      + '<text x="' + cx + '" y="' + (cy - 5) + '" text-anchor="middle" font-size="10" font-weight="800" fill="var(--text1)">\u20AC' + totalExp.toLocaleString('es') + '</text>'
      + '<text x="' + cx + '" y="' + (cy + 9) + '" text-anchor="middle" font-size="8" fill="var(--text3)">total gastos</text>'
      + '</svg>';
  }

  function _savingsRateLabel(rate) {
    if (rate < 0)    return '\u26A0\uFE0F Gastas m\xE1s de lo que ingresas';
    if (rate < 0.05) return '\uD83D\uDFE1 Ahorro muy bajo (< 5%)';
    if (rate < 0.15) return '\uD83D\uDFE1 Ahorro ajustado (5-15%)';
    if (rate < 0.25) return '\uD83D\uDFE2 Buen ritmo (15-25%)';
    if (rate < 0.40) return '\u2705 Excelente (25-40%)';
    return '\uD83D\uDD25 FIRE track (> 40%)';
  }

  function _buildTip(b) {
    var worstCat = null, worstRatio = 0;
    BUDGET_CATS.forEach(function(c) {
      var val = b.cats[c.id] || 0;
      var ratio = c.bench > 0 ? val / c.bench : 0;
      if (ratio > worstRatio) { worstRatio = ratio; worstCat = c; }
    });
    if (!worstCat || worstRatio < 1.25) {
      return '<div style="font-size:12px;color:var(--text2);line-height:1.6;">\u2705 Tu distribución de gastos es equilibrada. ¡Buen trabajo! Considera aumentar tu tasa de ahorro incrementando la inversión mensual en tu ETF global.</div>';
    }
    var excess = Math.round((b.cats[worstCat.id] || 0) - worstCat.bench);
    return '<div style="font-size:12px;color:var(--text2);line-height:1.6;">'
      + '<strong style="color:' + worstCat.color + ';">' + worstCat.icon + ' ' + worstCat.label + ':</strong> '
      + 'Gastas €' + excess + ' m\xE1s que la media española (€' + worstCat.bench + '). '
      + worstCat.tip + ' Optimizando esta categoría podrías invertir €' + excess + '/mes extra, '
      + 'que a 20 a\xF1os al 8% = <strong style="color:var(--accent);">€' + Math.round(excess * ((Math.pow(1.08/12+1,240)-1)/(0.08/12))).toLocaleString('es') + '</strong>.</div>';
  }

  function update(catId, val) {
    var b = _getState();
    b.cats[catId] = parseInt(val) || 0;
    S._budget = b;
    // Update just the affected elements without full re-render
    var valEl = document.getElementById('bcat-val-' + catId);
    var c = BUDGET_CATS.find(function(x) { return x.id === catId; });
    if (valEl && c) {
      valEl.textContent = '\u20AC' + b.cats[catId];
      valEl.className = 'bgt-cat-val' + (b.cats[catId] > c.bench * 1.3 ? ' bgt-over' : '');
    }
    var totalExp = BUDGET_CATS.reduce(function(s, c2) { return s + (b.cats[c2.id] || 0); }, 0);
    var surplus  = b.income - totalExp;
    var surplusEl = document.getElementById('bgt-surplus-val');
    var surplusPct = document.getElementById('bgt-surplus-pct');
    if (surplusEl) surplusEl.textContent = (surplus >= 0 ? '+' : '') + '\u20AC' + surplus.toLocaleString('es');
    if (surplusPct) surplusPct.textContent = (b.income > 0 ? Math.abs(Math.round(surplus/b.income*100)) : 0) + '% de tus ingresos';
    // Rebuild donut
    var donutWrap = document.getElementById('bgt-donut-wrap');
    if (donutWrap) donutWrap.innerHTML = _buildDonut(b);
    // Update tip
    var tipBox = document.getElementById('bgt-tip-box');
    if (tipBox) tipBox.innerHTML = _buildTip(b);
    // Update bar
    var barEl = document.getElementById('bcat-sl-' + catId);
    if (barEl) {
      var pct = b.income > 0 ? Math.min(Math.round((b.cats[catId]/b.income)*100), 100) : 0;
      // just rely on CSS for bar width
      var actualFill = document.querySelector('#bcat-' + catId + ' .bgt-actual-fill');
      if (actualFill && b.income > 0) {
        var pct2 = Math.min(Math.round((b.cats[catId] / b.income) * 100), 100);
        actualFill.style.width = pct2 + '%';
        var c2 = BUDGET_CATS ? BUDGET_CATS.find(function(x){return x.id===catId;}) : null;
        actualFill.style.background = c2 ? c2.color : 'var(--accent)';
      }
    }
  }

  function setIncome(val) {
    var b = _getState();
    b.income = parseInt(val) || 2000;
    S._budget = b;
    var m = document.getElementById('m-budget');
    if (m) _render(m);
  }

  function save() {
    var b = _getState();
    if (!b.saved) {
      b.saved = true;
      S.xp += 50;
      spawnXP('+50 XP');
      toast('\uD83D\uDCCA Presupuesto guardado', 'Ya tienes tu mapa financiero mensual', 't-success');
    } else {
      toast('\u2705 Actualizado', 'Tu presupuesto ha sido actualizado', 't-success');
    }
    S._budget = b;
    saveState();
    document.getElementById('m-budget').style.display = 'none';
  }

  return { open: open, update: update, setIncome: setIncome, save: save };
})();

/* ══════════════════════════════════════════════════════════════════
   F22 — SIMULADOR DE DECISIONES FINANCIERAS
   · "¿Cuánto cuesta realmente esto en términos de libertad?"
   · El usuario elige tipo de compra o escribe el coste
   · Calcula: coste nominal vs coste de oportunidad a 10/20/30 años
   · Muestra cuántos días de retiro equivale al gasto
   · Compara: gasto vs inversión en ETF global
   · Accesible desde perfil y home (botón flotante opcional)
══════════════════════════════════════════════════════════════════ */

var DECISION_PRESETS = [
  { label:'☕ Café diario (1 año)',    cost:1095, icon:'☕' },
  { label:'🚗 Coche nuevo',            cost:22000, icon:'🚗' },
  { label:'📱 iPhone último modelo',   cost:1299,  icon:'📱' },
  { label:'✈️ Vacaciones en Maldivas', cost:3500,  icon:'✈️' },
  { label:'👗 Armario nueva temporada',cost:800,   icon:'👗' },
  { label:'🍽️ Cenas fuera (1 mes)',    cost:360,   icon:'🍽️' },
  { label:'🎮 Gaming setup',           cost:1800,  icon:'🎮' },
  { label:'🏋️ Gym anual',             cost:600,   icon:'🏋️' },
];

var _DECISION = (function() {
  var _cost = 1000, _years = 20, _return = 8;

  function open() {
    var m = document.getElementById('m-decision');
    if (!m) {
      m = document.createElement('div');
      m.id = 'm-decision'; m.className = 'modal-overlay';
      document.body.appendChild(m);
    }
    m.style.display = 'flex';
    _render(m);
  }

  function _render(m) {
    var presetBtns = DECISION_PRESETS.map(function(p) {
      return '<button class="dcs-preset" onclick="_DECISION.setPreset(' + p.cost + ',\'' + p.label + '\')">'
        + p.icon + ' <span>' + p.label + '</span></button>';
    }).join('');

    m.innerHTML = '<div class="dcs-box">'
      + '<button class="modal-close" onclick="document.getElementById(\'m-decision\').style.display=\'none\'">\u2715</button>'
      + '<div class="dcs-header">'
      + '<div style="font-size:16px;font-weight:800;">\uD83E\uDD14 Calculadora de Decisiones</div>'
      + '<div style="font-size:11px;color:var(--text2);margin-top:2px;">Descubre el coste real de tus gastos en términos de libertad financiera</div>'
      + '</div>'

      + '<div class="dcs-presets">' + presetBtns + '</div>'

      + '<div class="dcs-custom-row">'
      + '<span class="dcs-custom-label">O introduce tu gasto:</span>'
      + '<div class="dcs-input-wrap">'
      + '<span class="dcs-currency">\u20AC</span>'
      + '<input type="number" id="dcs-amount" class="dcs-input" value="' + _cost + '" min="1" max="500000" step="50" oninput="_DECISION.calc()">'
      + '</div>'
      + '</div>'

      + '<div class="dcs-horizon-row">'
      + '<span class="dcs-hor-label">Horizonte</span>'
      + '<div class="dcs-hor-btns">'
      + [10,20,30].map(function(y) {
          return '<button class="dcs-hor-btn' + (y===_years?' active':'') + '" onclick="_DECISION.setYears(' + y + ')">' + y + 'a</button>';
        }).join('')
      + '</div>'
      + '</div>'

      + '<div class="dcs-result" id="dcs-result"></div>'
      + '</div>';

    _calcResult();
  }

  function _calcResult() {
    var r     = _return / 100 / 12;
    var n     = _years * 12;
    var fv    = _cost * Math.pow(1 + _return/100, _years); // lump sum
    var fdiff = fv - _cost;
    var days  = S.monthlyContribution > 0 ? Math.round(_cost / (S.monthlyContribution / 30)) : 0;
    var fireIncome = fv * 0.04 / 12; // monthly passive income lost
    var months4pct = S.monthlyContribution > 0 ? Math.round(_cost / S.monthlyContribution) : 0;

    var res = document.getElementById('dcs-result');
    if (!res) return;

    var fmt = function(n2) { return '\u20AC' + Math.round(n2).toLocaleString('es'); };

    res.innerHTML = '<div class="dcs-cards">'
      // Card 1: cost now
      + '<div class="dcs-card dcs-card-cost">'
      + '<div class="dcs-card-icon">\uD83D\uDCB8</div>'
      + '<div class="dcs-card-main">' + fmt(_cost) + '</div>'
      + '<div class="dcs-card-sub">Coste nominal hoy</div>'
      + '</div>'
      // Card 2: opportunity cost
      + '<div class="dcs-card dcs-card-opp">'
      + '<div class="dcs-card-icon">\uD83D\uDCC8</div>'
      + '<div class="dcs-card-main dcs-green">' + fmt(fv) + '</div>'
      + '<div class="dcs-card-sub">Invertido al ' + _return + '% · ' + _years + 'a</div>'
      + '</div>'
      + '</div>'

      + '<div class="dcs-verdict">'
      + '<div class="dcs-verdict-row"><span class="dcs-vr-icon">\uD83D\uDD25</span><span>Coste de oportunidad real: <strong style="color:var(--danger,#ef4444);">' + fmt(fdiff) + '</strong></span></div>'
      + (fireIncome > 0 ? '<div class="dcs-verdict-row"><span class="dcs-vr-icon">\uD83C\uDFD6\uFE0F</span><span>Renta pasiva mensual perdida: <strong style="color:#f0b429;">' + fmt(fireIncome) + '/mes</strong></span></div>' : '')
      + (months4pct > 0 ? '<div class="dcs-verdict-row"><span class="dcs-vr-icon">\uD83D\uDCC5</span><span>Equivale a <strong>' + months4pct + ' mes' + (months4pct>1?'es':'') + '</strong> de tu inversión habitual</span></div>' : '')
      + '</div>'

      // SVG comparison bar
      + _buildCompBar(_cost, fv)

      + '<div class="dcs-insight">' + _getInsight(_cost, fv, fdiff) + '</div>';
  }

  function _buildCompBar(cost, fv) {
    var max = fv, costPct = Math.round((cost/max)*100), fvPct = 100;
    return '<div class="dcs-compbar-wrap">'
      + '<div class="dcs-compbar-label"><span>Gasto ahora</span><span>Invertido ' + _years + 'a</span></div>'
      + '<div class="dcs-compbar-track">'
      + '<div class="dcs-compbar-fill" style="width:' + costPct + '%;background:var(--danger,#ef4444);opacity:.7;"></div>'
      + '</div>'
      + '<div class="dcs-compbar-track" style="margin-top:4px;">'
      + '<div class="dcs-compbar-fill" style="width:100%;background:var(--accent);opacity:.8;"></div>'
      + '</div>'
      + '</div>';
  }

  function _getInsight(cost, fv, diff) {
    if (cost < 100)  return '\uD83D\uDCA1 Gasto pequeño, pero los hábitos se suman. ' + BUDGET_CATS[1].tip;
    if (cost < 500)  return '\uD83D\uDCA1 A largo plazo, invertir este dinero en un ETF global generaría \u20AC' + Math.round(diff).toLocaleString('es') + ' extra. ¿Vale la pena?';
    if (cost < 2000) return '\uD83E\uDD14 Un gasto de ' + '\u20AC' + cost.toLocaleString('es') + ' invertido al ' + _return + '% durante ' + _years + ' años se convierte en \u20AC' + Math.round(fv).toLocaleString('es') + '. El verdadero precio no es lo que pagas hoy.';
    if (cost < 10000) return '\uD83D\uDD25 Compra importante. El coste de oportunidad real es \u20AC' + Math.round(diff).toLocaleString('es') + '. Si no es una necesidad, considera aplazar o financiar solo si el tipo de interés < ' + _return + '%.';
    return '\uD83C\uDFC6 Decisión de alto impacto financiero. Este dinero invertido al ' + _return + '% en ' + _years + ' años = \u20AC' + Math.round(fv).toLocaleString('es') + '. Antes de comprometerte, calcula si esto acelera o retrasa tu libertad financiera.';
  }

  function setPreset(cost, label) {
    _cost = cost;
    var inp = document.getElementById('dcs-amount');
    if (inp) inp.value = cost;
    // Highlight active preset
    document.querySelectorAll('.dcs-preset').forEach(function(b) {
      b.classList.toggle('active', b.textContent.includes(label.replace(/^[^ ]+ /, '')));
    });
    _calcResult();
  }

  function setYears(y) {
    _years = y;
    document.querySelectorAll('.dcs-hor-btn').forEach(function(b) {
      b.classList.toggle('active', b.textContent === y + 'a');
    });
    _calcResult();
  }

  function calc() {
    var inp = document.getElementById('dcs-amount');
    _cost = parseFloat(inp?.value) || 1000;
    document.querySelectorAll('.dcs-preset').forEach(function(b) { b.classList.remove('active'); });
    _calcResult();
  }

  return { open: open, setPreset: setPreset, setYears: setYears, calc: calc };
})();

/* ══════════════════════════════════════════════════════════════════
   COUNTDOWN / TIMERS
   ─────────────────────────────────────────────────────────────────
   Dos contadores:
   1. Próximo lunes (reset del reto semanal) → 'chal-countdown', 'rank-reset'
   2. Medianoche (reset del límite diario)   → 'limit-countdown'
══════════════════════════════════════════════════════════════════ */

/**
 * _initCountdowns — Inicia todos los timers de countdown de la app.
 * Se llama una sola vez en initApp(). Usa setInterval de 1 segundo.
 */
function _initCountdowns() {
  setInterval(() => {
    const now  = new Date();

    // Próximo lunes (reset semanal)
    const next = new Date(now);
    next.setDate(now.getDate() + (8 - now.getDay()) % 7 || 7);
    next.setHours(0, 0, 0, 0);
    const diff = next - now;
    const d    = Math.floor(diff / 86400000);
    const h    = Math.floor((diff % 86400000) / 3600000);
    const m    = Math.floor((diff % 3600000) / 60000);
    setEl('chal-countdown', `${d}d ${h}h ${m}m`);
    setEl('rank-reset',     `${d}d ${h}h`);

    // Medianoche (límite diario de lecciones)
    const midnight = new Date(now); midnight.setHours(24, 0, 0, 0);
    const toMid    = midnight - now;
    const hm       = Math.floor(toMid / 3600000).toString().padStart(2, '0');
    const mm       = Math.floor((toMid % 3600000) / 60000).toString().padStart(2, '0');
    const ss       = Math.floor((toMid % 60000) / 1000).toString().padStart(2, '0');
    setEl('limit-countdown', `${hm}:${mm}:${ss}`);
  }, 1000);
}



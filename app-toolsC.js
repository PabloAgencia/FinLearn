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
  if (typeof F34_onXPGained === 'function') F34_onXPGained(200);
  _ledgerAdd('out', 'mortgage', `Entrada hipoteca: ${mortgage.propertyName}`, downPayment);
  recalcPatrimony();
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
      if (typeof F34_onXPGained === 'function') F34_onXPGained(500);
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

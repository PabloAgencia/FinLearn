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
  modal.classList.add('active');
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
    if (typeof _calcGate === 'function') _calcGate('t8-result', 'DCA vs Lump Sum', '📊');
  } catch(e) {}
}
window.T8_open = T8_open; window.T8_calc = T8_calc;

/* ─────────────────────────────────────────────────────────────────
   T9 — REGLA DEL 72
   ¿En cuántos años doblas tu dinero? Bidireccional: años ↔ tasa.
───────────────────────────────────────────────────────────────── */
let _t9Tab = 'time';

function T9_open() {
  const modal = document.getElementById('tool-modal');
  if (!modal) return;
  _t9Tab = 'time';
  modal.innerHTML = `
    <div class="tool-modal-inner">
      <div class="tool-modal-head">
        <button class="tool-back" onclick="closeToolModal()">‹ Volver</button>
        <h3>⚡ Regla del 72</h3>
      </div>
      <div class="tool-body">
        <p class="tool-intro">Divide 72 entre la rentabilidad anual y obtendrás los años necesarios para doblar tu dinero.</p>
        <div class="t9-tabs">
          <button class="t9-tab active" onclick="T9_setTab('time',this)">Años para doblar</button>
          <button class="t9-tab" onclick="T9_setTab('rate',this)">Rentabilidad necesaria</button>
        </div>
        <div id="t9-time-panel" class="t9-panel">
          <div class="tool-section">
            <label class="tool-label">Rentabilidad anual: <strong id="t9-rate-v">7%</strong></label>
            <input id="t9-rate" class="tool-slider" type="range" min="1" max="30" step="0.5" value="7" oninput="T9_calc()">
          </div>
        </div>
        <div id="t9-rate-panel" class="t9-panel" style="display:none;">
          <div class="tool-section">
            <label class="tool-label">Años para doblar: <strong id="t9-years-v">10</strong></label>
            <input id="t9-years" class="tool-slider" type="range" min="1" max="36" step="1" value="10" oninput="T9_calc()">
          </div>
        </div>
        <div id="t9-result" class="t9-result"></div>
        <div class="t9-ref">
          <div class="t9-ref-title">Referencias habituales</div>
          <div class="t9-ref-grid">
            <div class="t9-ref-card"><div class="t9-ref-name">Cuenta ahorro 2%</div><div class="t9-ref-years">36 años</div></div>
            <div class="t9-ref-card"><div class="t9-ref-name">Bonos/renta fija 4%</div><div class="t9-ref-years">18 años</div></div>
            <div class="t9-ref-card t9-ref-highlight"><div class="t9-ref-name">S&P 500 histórico ~7%</div><div class="t9-ref-years">~10 años</div></div>
            <div class="t9-ref-card"><div class="t9-ref-name">NASDAQ ~10%</div><div class="t9-ref-years">~7 años</div></div>
            <div class="t9-ref-card"><div class="t9-ref-name">Inmuebles ~5%</div><div class="t9-ref-years">14 años</div></div>
            <div class="t9-ref-card"><div class="t9-ref-name">Inflación ~3%</div><div class="t9-ref-years">24 años</div></div>
          </div>
        </div>
      </div>
    </div>
  `;
  modal.classList.add('active');
  T9_calc();
}

function T9_setTab(tab, btn) {
  _t9Tab = tab;
  document.querySelectorAll('.t9-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const timeP = document.getElementById('t9-time-panel');
  const rateP = document.getElementById('t9-rate-panel');
  if (timeP) timeP.style.display = tab === 'time' ? '' : 'none';
  if (rateP) rateP.style.display = tab === 'rate' ? '' : 'none';
  T9_calc();
}

function T9_calc() {
  const res = document.getElementById('t9-result');
  if (!res) return;
  if (_t9Tab === 'time') {
    const rate   = parseFloat(document.getElementById('t9-rate')?.value) || 7;
    const rateV  = document.getElementById('t9-rate-v');
    if (rateV) rateV.textContent = rate + '%';
    const approx = (72 / rate).toFixed(1);
    const exact  = (Math.log(2) / Math.log(1 + rate / 100)).toFixed(1);
    res.innerHTML = `
      <div class="t9-big">
        <div class="t9-big-num">${approx}<span class="t9-big-unit"> años</span></div>
        <div class="t9-big-sub">para doblar al ${rate}% anual</div>
        <div class="t9-exact">Cálculo exacto: ${exact} años</div>
      </div>
      <div class="t9-insight">💡 10.000€ al ${rate}% → ~20.000€ en ${approx} años sin aportar nada más.</div>
    `;
  } else {
    const years  = parseInt(document.getElementById('t9-years')?.value) || 10;
    const yearsV = document.getElementById('t9-years-v');
    if (yearsV) yearsV.textContent = years;
    const rate   = (72 / years).toFixed(1);
    const exact  = ((Math.pow(2, 1 / years) - 1) * 100).toFixed(2);
    res.innerHTML = `
      <div class="t9-big">
        <div class="t9-big-num">${rate}<span class="t9-big-unit">%</span> <span style="font-size:15px;color:var(--text2);">anual</span></div>
        <div class="t9-big-sub">para doblar en ${years} año${years !== 1 ? 's' : ''}</div>
        <div class="t9-exact">Tasa exacta: ${exact}%</div>
      </div>
      <div class="t9-insight">💡 El S&P 500 histórico (~7% real) dobla cada ~10 años. Un depósito al 2% tarda 36 años.</div>
    `;
  }
  if (typeof _calcGate === 'function') _calcGate('t9-result', 'Regla del 72', '⚡');
}

window.T9_open = T9_open; window.T9_calc = T9_calc; window.T9_setTab = T9_setTab;

/* ─────────────────────────────────────────────────────────────────
   T10 — FONDO DE EMERGENCIA
   Objetivo, progreso y tiempo estimado para llegar al colchón.
───────────────────────────────────────────────────────────────── */
let _t10Months = 6;

const _T10_HINTS = {
  3: '3 meses: mínimo para empleados fijos con ingresos estables.',
  6: '6 meses: recomendado para la mayoría · autónomos y temporales.',
  9: '9 meses: ideal si tienes personas a cargo o sector inestable.',
  12: '12 meses: máxima seguridad · emprendedores y sector volátil.',
};

function T10_open() {
  const modal = document.getElementById('tool-modal');
  if (!modal) return;
  _t10Months = 6;
  const expenses = S.monthlyExpenses || 1500;
  modal.innerHTML = `
    <div class="tool-modal-inner">
      <div class="tool-modal-head">
        <button class="tool-back" onclick="closeToolModal()">‹ Volver</button>
        <h3>🛡️ Fondo de Emergencia</h3>
      </div>
      <div class="tool-body">
        <p class="tool-intro">Calcula cuánto debes tener guardado para estar protegido ante cualquier imprevisto.</p>
        <div class="tool-section">
          <label class="tool-label">Gastos mensuales fijos (alquiler, comida, suministros) €</label>
          <input id="t10-expenses" class="tool-input" type="number" value="${expenses}" min="100" oninput="T10_calc()">
        </div>
        <div class="tool-section">
          <label class="tool-label">Meses de cobertura objetivo</label>
          <div class="t10-months-sel">
            <button class="t10-mbtn" onclick="T10_setMonths(3,this)">3 meses</button>
            <button class="t10-mbtn active" onclick="T10_setMonths(6,this)">6 meses</button>
            <button class="t10-mbtn" onclick="T10_setMonths(9,this)">9 meses</button>
            <button class="t10-mbtn" onclick="T10_setMonths(12,this)">12 meses</button>
          </div>
          <div class="t10-hint" id="t10-hint">${_T10_HINTS[6]}</div>
        </div>
        <div class="tool-section">
          <label class="tool-label">Ahorro actual disponible €</label>
          <input id="t10-saved" class="tool-input" type="number" value="0" min="0" oninput="T10_calc()">
        </div>
        <div class="tool-section">
          <label class="tool-label">Capacidad de ahorro mensual €</label>
          <input id="t10-monthly" class="tool-input" type="number" value="200" min="0" oninput="T10_calc()">
        </div>
        <div id="t10-result"></div>
      </div>
    </div>
  `;
  modal.classList.add('active');
  T10_calc();
}

function T10_setMonths(m, btn) {
  _t10Months = m;
  document.querySelectorAll('.t10-mbtn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const hint = document.getElementById('t10-hint');
  if (hint) hint.textContent = _T10_HINTS[m] || '';
  T10_calc();
}

function T10_calc() {
  const expenses = parseFloat(document.getElementById('t10-expenses')?.value) || 0;
  const saved    = parseFloat(document.getElementById('t10-saved')?.value)    || 0;
  const monthly  = parseFloat(document.getElementById('t10-monthly')?.value)  || 0;
  const res      = document.getElementById('t10-result');
  if (!res || expenses <= 0) return;

  const target  = expenses * _t10Months;
  const needed  = Math.max(0, target - saved);
  const pct     = Math.min(100, Math.round((saved / target) * 100));
  const moTime  = monthly > 0 ? Math.ceil(needed / monthly) : null;
  const barClr  = pct >= 100 ? 'var(--green)' : pct >= 60 ? '#f5a623' : 'var(--red)';

  if (needed <= 0) {
    res.innerHTML = `
      <div class="t10-done">
        <div style="font-size:36px;margin-bottom:8px;">✅</div>
        <div class="t10-done-title">¡Fondo de emergencia completo!</div>
        <div class="t10-done-sub">Tienes ${_fmt(Math.round(saved))}€ guardados (${_t10Months} meses de gastos). El excedente puede ir a inversión.</div>
      </div>
    `;
    if (typeof _calcGate === 'function') _calcGate('t10-result', 'Fondo de Emergencia', '🛡️');
    return;
  }

  let timeStr = moTime ? (moTime >= 12 ? `${Math.floor(moTime/12)} año${Math.floor(moTime/12)>1?'s':''} y ${moTime%12} meses` : `${moTime} meses`) : '—';

  res.innerHTML = `
    <div class="t10-target-box">
      <div class="t10-target-lbl">Objetivo</div>
      <div class="t10-target-val">${_fmt(Math.round(target))}€</div>
      <div class="t10-target-sub">${_t10Months} meses × ${_fmt(Math.round(expenses))}€</div>
    </div>
    <div class="t10-prog-wrap">
      <div class="t10-prog-bar"><div class="t10-prog-fill" style="width:${pct}%;background:${barClr};"></div></div>
      <div class="t10-prog-pct" style="color:${barClr};">${pct}% completado</div>
    </div>
    <div class="t10-stats-grid">
      <div class="t10-stat">
        <div class="t10-stat-val">${_fmt(Math.round(saved))}€</div>
        <div class="t10-stat-lbl">Ahorrado</div>
      </div>
      <div class="t10-stat" style="border-color:var(--red);">
        <div class="t10-stat-val" style="color:var(--red);">${_fmt(Math.round(needed))}€</div>
        <div class="t10-stat-lbl">Falta</div>
      </div>
      ${moTime ? `<div class="t10-stat">
        <div class="t10-stat-val">${timeStr}</div>
        <div class="t10-stat-lbl">Tiempo estimado</div>
      </div>` : ''}
    </div>
    <div class="t9-insight">💡 Guárdalo en cuenta de alta rentabilidad (Openbank, MyInvestor, CUEN). Accesible en 24–48h, nunca en fondos de inversión.</div>
  `;
  if (typeof _calcGate === 'function') _calcGate('t10-result', 'Fondo de Emergencia', '🛡️');
}

window.T10_open = T10_open; window.T10_calc = T10_calc; window.T10_setMonths = T10_setMonths;

/* ─────────────────────────────────────────────────────────────────
   T11 — COSTE REAL DE LA DEUDA
   Amortización real con TAE: cuánto pagas en total y cuándo acabas.
───────────────────────────────────────────────────────────────── */
const _T11_PRESETS = {
  tarjeta:  { rate: 24.9, payment: 100 },
  revolving:{ rate: 26.8, payment: 80  },
  prestamo: { rate: 8.5,  payment: 150 },
  coche:    { rate: 6.5,  payment: 250 },
};

function T11_open() {
  const modal = document.getElementById('tool-modal');
  if (!modal) return;
  modal.innerHTML = `
    <div class="tool-modal-inner">
      <div class="tool-modal-head">
        <button class="tool-back" onclick="closeToolModal()">‹ Volver</button>
        <h3>💳 Coste Real de la Deuda</h3>
      </div>
      <div class="tool-body">
        <p class="tool-intro">Descubre cuánto te cuesta realmente una deuda una vez sumados todos los intereses.</p>
        <div class="tool-section">
          <label class="tool-label">Tipo de deuda</label>
          <select id="t11-type" class="tool-select" onchange="T11_preset()">
            <option value="tarjeta">Tarjeta de crédito</option>
            <option value="revolving">Tarjeta revolving</option>
            <option value="prestamo">Préstamo personal</option>
            <option value="coche">Financiación coche</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>
        <div class="tool-section">
          <label class="tool-label">Deuda total €</label>
          <input id="t11-amount" class="tool-input" type="number" value="3000" min="100" oninput="T11_calc()">
        </div>
        <div class="tool-section">
          <label class="tool-label">TAE anual %</label>
          <input id="t11-rate" class="tool-input" type="number" step="0.1" value="24.9" min="0.1" max="100" oninput="T11_calc()">
        </div>
        <div class="tool-section">
          <label class="tool-label">Cuota mensual que pagas €</label>
          <input id="t11-payment" class="tool-input" type="number" value="100" min="1" oninput="T11_calc()">
        </div>
        <div id="t11-result"></div>
      </div>
    </div>
  `;
  modal.classList.add('active');
  T11_calc();
}

function T11_preset() {
  const type = document.getElementById('t11-type')?.value;
  const p    = _T11_PRESETS[type];
  if (!p) return;
  const rateEl = document.getElementById('t11-rate');
  const payEl  = document.getElementById('t11-payment');
  if (rateEl) rateEl.value = p.rate;
  if (payEl)  payEl.value  = p.payment;
  T11_calc();
}

function T11_calc() {
  const amount  = parseFloat(document.getElementById('t11-amount')?.value)  || 0;
  const tae     = parseFloat(document.getElementById('t11-rate')?.value)    || 0;
  const payment = parseFloat(document.getElementById('t11-payment')?.value) || 0;
  const res     = document.getElementById('t11-result');
  if (!res || amount <= 0 || tae <= 0 || payment <= 0) { if (res) res.innerHTML = ''; return; }

  const mr = tae / 100 / 12;
  const minPayment = amount * mr;

  if (payment <= minPayment) {
    res.innerHTML = `<div class="t11-warning">⚠️ Con ${_fmt(Math.round(payment))}€/mes solo cubres los intereses (${_fmt(Math.round(minPayment))}€). Necesitas pagar más para reducir la deuda.</div>`;
    return;
  }

  let balance = amount, totalInterest = 0, months = 0;
  while (balance > 0.01 && months < 600) {
    const interest  = balance * mr;
    const principal = Math.min(payment - interest, balance);
    totalInterest  += interest;
    balance        -= principal;
    months++;
  }

  const totalPaid = amount + totalInterest;
  const costPct   = Math.round(totalInterest / amount * 100);
  const years     = Math.floor(months / 12);
  const remMo     = months % 12;
  const timeStr   = years > 0 ? `${years}a ${remMo}m` : `${months} meses`;
  const principalPct = Math.round(amount / totalPaid * 100);
  const interestPct  = 100 - principalPct;
  const severity     = costPct >= 50 ? 'var(--red)' : costPct >= 20 ? '#f5a623' : 'var(--green)';

  res.innerHTML = `
    <div class="t11-stats-grid">
      <div class="t11-stat">
        <div class="t11-stat-val">${_fmt(Math.round(amount))}€</div>
        <div class="t11-stat-lbl">Deuda original</div>
      </div>
      <div class="t11-stat" style="border-color:${severity};">
        <div class="t11-stat-val" style="color:${severity};">+${_fmt(Math.round(totalInterest))}€</div>
        <div class="t11-stat-lbl">Intereses (+${costPct}%)</div>
      </div>
      <div class="t11-stat">
        <div class="t11-stat-val">${_fmt(Math.round(totalPaid))}€</div>
        <div class="t11-stat-lbl">Total pagado</div>
      </div>
      <div class="t11-stat">
        <div class="t11-stat-val">${timeStr}</div>
        <div class="t11-stat-lbl">Tiempo para saldar</div>
      </div>
    </div>
    <div class="t11-bar-wrap">
      <div class="t11-bar-labels">
        <span>Principal ${_fmt(Math.round(amount))}€</span>
        <span style="color:${severity};">Intereses ${_fmt(Math.round(totalInterest))}€</span>
      </div>
      <div class="t11-bar">
        <div class="t11-bar-principal" style="width:${principalPct}%;"></div>
        <div class="t11-bar-interest" style="width:${interestPct}%;background:${severity};opacity:.8;"></div>
      </div>
    </div>
    <div class="t9-insight">
      💡 ${costPct >= 30 ? `Esta deuda te cuesta un <strong>${costPct}%</strong> extra. Prioriza pagarla antes que invertir.` : `Coste razonable. Subir la cuota a ${_fmt(Math.round(payment * 1.5))}€ reduciría el tiempo notablemente.`}
    </div>
  `;
  if (typeof _calcGate === 'function') _calcGate('t11-result', 'Coste Real de la Deuda', '💳');
}

window.T11_open = T11_open; window.T11_calc = T11_calc; window.T11_preset = T11_preset;

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
        correct: 1,
        exp: 'Regla del 4%: 30.000 / 0.04 = 750.000€. El número FIRE.'
      },
      {
        q: 'Inviertes 300€/mes al 8% anual durante 30 años. Aportas en total 108.000€. ¿Cuánto tendrás?',
        opts: ['~216.000€ (×2 inflación)', '~447.000€ (interés compuesto)', '~108.000€ (lo aportado)', '~1.200.000€ (exagerado)'],
        correct: 1,
        exp: 'El IC no duplica ni mantiene: PMT 300 × factor 1490 ÷ tipo mensual ≈ 447k€. La clave es no tocar el capital.'
      },
      {
        q: 'Tienes 20.000€ de deuda al 18% TAE y 15.000€ en un depósito al 3%. ¿Qué haces?',
        opts: ['Cancelo la deuda con el depósito', 'Mantengo el depósito y pago mínimos', 'Refinancio la deuda', 'Invierto en bolsa'],
        correct: 0,
        exp: '18% > 3%: cada euro que cancelas la deuda "gana" un 18% garantizado. Cancela siempre.'
      },
      {
        q: 'Tu tipo marginal IRPF es el 37%. ¿Cuál es el orden financiero correcto en España?',
        opts: ['ETFs globales primero → PP después → emergencia si sobra', 'Emergencia 3-6 meses → PP hasta límite deducible → ETFs acumulación', 'PP al máximo primero → luego todo a ETFs', 'Primero invertir, la emergencia es para los miedosos'],
        correct: 1,
        exp: 'Liquidez primero (emergencia): sin ella vendes inversiones en el peor momento. Luego PP (37% deducción es brutal). Luego ETFs.'
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
        q: 'ETF acumulación vs fondo de inversión en España. ¿Cuál tiene más ventaja fiscal y por qué?',
        opts: ['El fondo: permite traspasos sin tributar. El ETF no tiene ese beneficio', 'El ETF: opera en bolsa y es más eficiente', 'Son exactamente iguales fiscalmente', 'El fondo tributa al 10%, el ETF al 19%'],
        correct: 0,
        exp: 'Los fondos permiten traspasar entre sí sin hecho imponible (diferimiento). Los ETFs tributan al vender aunque reinviertas en otro ETF.'
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
        q: 'Vendes acciones con 8.000€ de ganancia pero tienes 3.000€ de pérdidas de años anteriores pendientes de compensar. ¿Qué pagas?',
        opts: ['19% sobre 8.000€ = 1.520€ (las pérdidas antiguas no compensan ganancias del año)', '19% sobre 5.000€ = 950€ (compensas las pérdidas)', '0€ porque las pérdidas cubren todo', '21% sobre 8.000€ = 1.680€'],
        correct: 1,
        exp: 'Las pérdidas de capital de ejercicios anteriores (hasta 4 años) sí compensan ganancias del mismo tipo en el año actual. 8.000 - 3.000 = 5.000 × 19% = 950€.'
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
        q: 'Cartera 100% MSCI World vs All-Weather de Dalio. Crash del 50% de bolsa global. ¿Cuál pierde menos?',
        opts: ['MSCI World: más concentrada pero históricamente se recupera antes', 'All-Weather: correlación negativa de bonos/oro amortigua la caída a ~15-20%', 'Son iguales en crashes severos', 'All-Weather nunca pierde en crashes'],
        correct: 1,
        exp: 'All-Weather usa decorrelación: cuando acciones caen, bonos L/P suben. En 2008: MSCI -50%, All-Weather -14%. No es inmune, pero amortigua brutalmente.'
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
          <div class="boss-rule">⏱️ 15 segundos por pregunta</div>
          <div class="boss-rule">5 preguntas de nivel experto</div>
          <div class="boss-rule" style="color:#f87171;font-weight:800;">💀 Un error = derrota inmediata</div>
          <div class="boss-rule">5/5 perfectas → cofre legendario 🏆</div>
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
            <span class="boss-timer" id="boss-timer">15</span>
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
  let secs = 15;
  _bossTimer = setInterval(() => {
    secs--;
    const el = document.getElementById('boss-timer');
    if (el) {
      el.textContent = secs;
      if (secs <= 8) el.style.color = '#f87171';
      if (secs <= 4) el.style.animation = 'bossTimerPulse 0.5s infinite alternate';
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
    if (!correct) {
      // Un fallo = game over inmediato
      BOSS_showResult();
      return;
    }
    _bossState.qIdx++;
    if (_bossState.qIdx >= boss.questions.length) {
      BOSS_showResult();
    } else {
      BOSS_renderQuestion();
    }
  }, 1800);
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
          ${won ? `<button class="btn btn-ghost btn-sm" onclick="_bossShare('${boss.name.replace(/'/g,"\\'")}','${_bossState.branchId}')" style="margin-bottom:8px;width:100%;">📤 Compartir victoria</button>` : `<button class="btn btn-boss" onclick="BOSS_open('${_bossState.branchId}')">🔄 Reintentar</button>`}
          <button class="btn ${won ? 'btn-boss' : 'btn-ghost btn-sm'}" onclick="BOSS_close()">
            ${won ? '🎁 ¡Reclamar recompensa!' : 'Volver al juego'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function _bossShare(bossName, branchId) {
  var text = '¡Acabo de derrotar a "' + bossName + '" en FinLearn! 🏆 +300 XP ganados en el modo más difícil.\n¿Puedes tú también? → ' + window.location.origin;
  if (navigator.share) {
    navigator.share({ title: 'FinLearn · Boss Derrotado 🏆', text: text, url: window.location.origin }).catch(function(){});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      if (typeof toast === 'function') toast('✅ Copiado', 'Pégalo en tus redes sociales', 't-success');
    });
  }
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
window._bossShare        = _bossShare;

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
    const text = `Soy "${type.name}" ${type.emoji} según el test de FinLearn. ${type.subtitle}. ¿Y tú? 👉 ${window.location.origin}`;
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


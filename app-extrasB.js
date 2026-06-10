function renderToolsScreen() {
  const el = document.getElementById('s-tools');
  if (!el) return;

  const featured = [
    { id:'fire',     icon:'🔥', q:'¿Cuándo me libero?',    sub:'Proyector FIRE' },
    { id:'hipoteca', icon:'🏠', q:'¿Compro o alquilo?',    sub:'Hipoteca vs Alquiler' },
    { id:'compound', icon:'📈', q:'¿Cuánto puede crecer?', sub:'Interés Compuesto' },
  ];

  const groups = [
    {
      title: '🏡 Planifica tu dinero',
      tools: [
        { id:'irpf',        icon:'🧾', name:'Simulador IRPF 2025',  desc:'Tu cuota y tipo efectivo' },
        { id:'hipoteca',    icon:'🏠', name:'Hipoteca vs Alquiler',  desc:'¿Cuándo sale rentable comprar?' },
        { id:'simhipoteca', icon:'🏦', name:'Simulador Hipoteca',    desc:'Cuota, amortización y TAE real' },
        { id:'emergencia',  icon:'🛡️', name:'Fondo de Emergencia',   desc:'Cuánto guardar y cuándo llegas' },
      ]
    },
    {
      title: '📈 Haz crecer tu dinero',
      tools: [
        { id:'compound', icon:'📈', name:'Interés Compuesto', desc:'El poder del tiempo y el ahorro' },
        { id:'fire',     icon:'🔥', name:'Proyector FIRE',    desc:'Gráfico a 30 años + año de libertad' },
        { id:'dca',      icon:'📆', name:'DCA vs Lump Sum',   desc:'¿Invertir poco a poco o de golpe?' },
        { id:'regla72',  icon:'⚡', name:'Regla del 72',      desc:'¿En cuántos años doblas tu dinero?' },
      ]
    },
    {
      title: '💳 Controla tus deudas',
      tools: [
        { id:'snowball', icon:'❄️', name:'Bola de Nieve',           desc:'Snowball vs Avalanche: elige tu estrategia' },
        { id:'deuda',    icon:'💳', name:'Coste Real de la Deuda',  desc:'Lo que realmente te cuesta tu tarjeta' },
        { id:'networth', icon:'💎', name:'Net Worth Tracker',       desc:'Tu patrimonio neto real con histórico' },
      ]
    },
  ];

  const sims = [
    { icon:'📊', label:'Bolsa',    desc:'Invierte virtual',  action:"goTo('portfolio')" },
    { icon:'🌍', label:'Vida',     desc:'Simula tu futuro',  action:"goTo('life')" },
    { icon:'🏪', label:'Negocios', desc:'Ingresos pasivos',  action:"goTo('business')" },
  ];

  el.innerHTML = `
    <div class="lab-header">
      <div class="lab-header-title">🧪 Laboratorio</div>
      <div class="lab-header-sub">11 herramientas para tomar mejores decisiones financieras</div>
    </div>
    <div class="lab-section-pad">
      <div class="lab-feat-row">
        ${featured.map(f => `
          <button class="lab-feat-btn" onclick="openTool('${f.id}')">
            <span class="lab-feat-icon">${f.icon}</span>
            <div class="lab-feat-q">${f.q}</div>
            <div class="lab-feat-sub">${f.sub}</div>
          </button>
        `).join('')}
      </div>
      ${groups.map(g => `
        <div class="lab-group">
          <div class="lab-group-title">${g.title}</div>
          <div class="lab-tools-list">
            ${g.tools.map(t => `
              <button class="tool-card" onclick="openTool('${t.id}')">
                <span class="tool-icon">${t.icon}</span>
                <div class="tool-info">
                  <div class="tool-name">${t.name}</div>
                  <div class="tool-desc">${t.desc}</div>
                </div>
                <span class="tool-arrow">›</span>
              </button>
            `).join('')}
          </div>
        </div>
      `).join('')}
      <div class="lab-group">
        <div class="lab-group-title">📊 Simuladores</div>
        <div class="lab-sim-row">
          ${sims.map(s => `
            <button class="lab-sim-btn" onclick="${s.action}">
              <span class="lab-sim-icon">${s.icon}</span>
              <div class="lab-sim-label">${s.label}</div>
              <div class="lab-sim-desc">${s.desc}</div>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderLabShortcut() {
  const el = document.getElementById('lab-shortcut-card');
  if (!el || !S.userName) return;
  const shortcuts = [
    { id:'fire',     icon:'🔥', label:'FIRE' },
    { id:'compound', icon:'📈', label:'Compuesto' },
    { id:'hipoteca', icon:'🏠', label:'Hipoteca' },
    { id:'irpf',     icon:'🧾', label:'IRPF' },
  ];
  el.innerHTML = `
    <div class="lab-shortcut-card">
      <div class="lab-sc-head">
        <div class="lab-sc-title">🧪 Calculadoras</div>
        <button class="lab-sc-all" onclick="goTo('tools')">Ver todas (11) →</button>
      </div>
      <div class="lab-sc-row">
        ${shortcuts.map(s => `
          <button class="lab-sc-btn" onclick="openTool('${s.id}')">
            <span>${s.icon}</span>
            <span class="lab-sc-lbl">${s.label}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}
window.renderLabShortcut = renderLabShortcut;

function openTool(id) {
  const fns = { irpf: T1_open, hipoteca: T2_open, fire: T3_open, snowball: T4_open, compound: T5_open, networth: T6_open, simhipoteca: T7_open, dca: T8_open, regla72: T9_open, emergencia: T10_open, deuda: T11_open };
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

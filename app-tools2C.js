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
    F34_onXPGained(xp);
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
  const current = localStorage.getItem('finai_api_key') || '';
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
  localStorage.setItem('finai_api_key', key);
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
  localStorage.removeItem('finai_api_key');
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

  const _xpBefore = S.xp || 0;
  try { choice.effect(S); } catch(e) {}
  const _xpDelta = (S.xp || 0) - _xpBefore;
  if (_xpDelta > 0 && typeof F34_onXPGained === 'function') F34_onXPGained(_xpDelta);
  recalcPatrimony();

  document.getElementById('m-job-offer').style.display = 'none';
  _pendingJobOffer = null;

  saveState();
  updateUIFromState();
  checkAchievements();
  renderCareerCard?.();

  toast(job.icon + ' ' + job.title, choice.result, 't-social');
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
window.showDailyRewardModal   = showDailyRewardModal;
window.renderStreakCard        = renderStreakCard;
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
window.PWA_triggerInstall  = PWA_triggerInstall;
window.PWA_dismissBanner   = PWA_dismissBanner;
window.PWA_showAfterModule = PWA_showAfterModule;

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

function _getWeekKey() {
  const now = new Date();
  const year = now.getFullYear();
  // Semana ISO aproximada
  const start = new Date(year, 0, 1);
  const days = Math.floor((now - start) / 86400000);
  const week = Math.ceil((days + start.getDay() + 1) / 7);
  return `${year}-W${week}`;
}

function getCurrentWeeklyAction() {
  if (typeof WEEKLY_ACTIONS === 'undefined' || !WEEKLY_ACTIONS.length) return null;
  const weekKey = _getWeekKey();
  if (!S._currentWeeklyAction || S._currentWeeklyAction.week !== weekKey) {
    // Asignar nueva acción: excluir las ya completadas recientemente
    const completed = S._completedActions || [];
    const available = WEEKLY_ACTIONS.filter(a => !completed.includes(a.id));
    const pool = available.length > 0 ? available : WEEKLY_ACTIONS;
    const action = pool[Math.floor(Math.random() * pool.length)];
    S._currentWeeklyAction = { week: weekKey, id: action.id, done: false, startedAt: Date.now() };
    saveState();
  }
  return WEEKLY_ACTIONS.find(a => a.id === S._currentWeeklyAction.id);
}

function completeWeeklyAction() {
  if (!S._currentWeeklyAction || S._currentWeeklyAction.done) return;
  const action = WEEKLY_ACTIONS.find(a => a.id === S._currentWeeklyAction.id);
  if (!action) return;
  S._currentWeeklyAction.done = true;
  S._currentWeeklyAction.completedAt = Date.now();
  if (!S._completedActions) S._completedActions = [];
  S._completedActions.push(action.id);
  if (S._completedActions.length > 50) S._completedActions = S._completedActions.slice(-50);
  S.xp = (S.xp || 0) + action.xp;
  if (!S._totalRealSavings) S._totalRealSavings = 0;
  S._totalRealSavings += (action.savingEst || 0);
  S._realActionsCount = (S._realActionsCount || 0) + 1;
  saveState();
  if (typeof spawnXPv2 === 'function') spawnXPv2(`+${action.xp} XP`, 'Acción real');
  if (typeof confetti === 'function') confetti();
  toast('🎯 ¡Acción completada!', action.savingEst > 0 ? `Ahorro estimado: €${action.savingEst}/mes` : '¡Bien hecho!', 't-success');
  if (typeof renderHomeScreen === 'function') setTimeout(renderHomeScreen, 400);
}

window.getCurrentWeeklyAction = getCurrentWeeklyAction;
window.completeWeeklyAction = completeWeeklyAction;

function _addGroupXP(amount) {
  S._groupXP = (S._groupXP || 0) + (amount || 0);
}
window._addGroupXP = _addGroupXP;

window.CHART              = CHART;


/* ══════════════════════════════════════════════════════════════════
   28. AUTO-ARRANQUE
══════════════════════════════════════════════════════════════════ */

function _runPostInit() {
  checkSecretAchievements();
  _trackPatrimonyPeak();
  setTimeout(renderPortfolioDonut, 80);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    initApp();
    _runPostInit();
  });
} else {
  initApp();
  _runPostInit();
}

// Safety net: ocultar splash pase lo que pase, máximo 5s
setTimeout(function() {
  var s = document.getElementById('app-splash');
  if (s && s.style.display !== 'none') {
    s.classList.add('splash-out');
    setTimeout(function() { s.style.display = 'none'; }, 600);
  }
}, 5000);


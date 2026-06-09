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
    S.xp += 100;
    if (typeof F34_onXPGained === 'function') F34_onXPGained(100);
    saveState();
    checkAchievements();
    spawnXP('+100 XP');

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
  F34_onXPGained(hit.xp);
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
    if (!S._budget) S._budget = { income: S.monthlyIncome || S.lifeSalary || S.income || 2000, cats: {}, saved: false };
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
      if (typeof F34_onXPGained === 'function') F34_onXPGained(50);
      spawnXP('+50 XP');
      toast('\uD83D\uDCCA Presupuesto guardado', 'Ya tienes tu mapa financiero mensual', 't-success');
    } else {
      toast('\u2705 Actualizado', 'Tu presupuesto ha sido actualizado', 't-success');
    }
    S._budget = b;
    saveState();
    checkAchievements();
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



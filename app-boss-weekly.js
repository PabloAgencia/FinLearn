/* ═══ app-boss-weekly.js — Boss Battle Semanal ═══════════════════
   Un jefe nuevo cada semana. 3 preguntas cronometradas, 90 segundos.
   Una oportunidad por semana. Recompensa: 500 XP + cofre plata.
══════════════════════════════════════════════════════════════════ */

var WEEKLY_BOSSES = [
  {
    name: 'El Especulador', emoji: '🐉',
    color: '#ff4444', bg: 'rgba(255,68,68,.12)',
    intro: 'Un especulador que lleva 20 años prometiendo rentabilidades del 50% anual. Demuestra que conoces la diferencia entre invertir y especular.',
    reward: '500 XP + Cofre Plata',
    questions: [
      {
        q: '¿Cuál es la diferencia clave entre invertir y especular?',
        opts: ['Invertir busca rentabilidad a largo plazo con análisis; especular busca ganancias rápidas asumiendo alto riesgo', 'No hay diferencia real, ambos buscan ganar dinero', 'Invertir es solo para ricos, especular es para todos', 'Especular siempre da más dinero a largo plazo'],
        correct: 0,
        exp: 'Invertir = análisis + horizonte largo. Especular = apostar a movimientos de precio a corto plazo con riesgo muy alto.'
      },
      {
        q: 'Un "gurú" te promete un 40% de rentabilidad anual garantizada. ¿Qué haces?',
        opts: ['Huyo: ninguna inversión legítima garantiza ese rendimiento de forma consistente', 'Invierto todo mi capital: 40% al año es una oportunidad increíble', 'Investigo durante una semana y luego invierto', 'Pido prestado para invertir más'],
        correct: 0,
        exp: 'El S&P 500 da ~10% de media. Alguien que promete 40% garantizado es una señal de alarma de estafa o Ponzi.'
      },
      {
        q: 'El índice Sharpe mide la rentabilidad de una inversión. ¿Qué incluye que otros ratios no tienen?',
        opts: ['El riesgo asumido para obtener esa rentabilidad', 'Los impuestos pagados', 'El tiempo que se mantuvo la inversión', 'Las comisiones del broker'],
        correct: 0,
        exp: 'Ratio Sharpe = (rentabilidad - tasa libre de riesgo) / desviación estándar. Penaliza la volatilidad.'
      }
    ]
  },
  {
    name: 'La Inflación', emoji: '🔥',
    color: '#ff8c00', bg: 'rgba(255,140,0,.12)',
    intro: 'La inflación silenciosamente destruye tu poder adquisitivo. Demuestra que entiendes cómo combatirla.',
    reward: '500 XP + Cofre Plata',
    questions: [
      {
        q: 'Tienes 10.000€ en cuenta corriente al 0%. La inflación es del 4%. ¿Cuánto "pierdes" en poder adquisitivo en 1 año?',
        opts: ['Unos 400€ de poder adquisitivo real', 'Nada, el dinero sigue siendo 10.000€', '400€ en efectivo de tu cuenta', '40€'],
        correct: 0,
        exp: '10.000 × 0,04 = 400€ de pérdida de poder adquisitivo. El dinero sigue siendo 10.000€ nominalmente, pero compra menos.'
      },
      {
        q: '¿Qué activo históricamente ha protegido mejor contra la inflación a largo plazo?',
        opts: ['Renta variable (acciones)', 'Cuenta de ahorro al 0,5%', 'Efectivo debajo del colchón', 'Depósitos a plazo fijo al 1%'],
        correct: 0,
        exp: 'La bolsa ha dado ~7% real anual histórico. La inflación media es ~3%. Las acciones son el mejor hedge a largo plazo.'
      },
      {
        q: 'El BCE tiene un objetivo de inflación del 2%. ¿Por qué no 0%?',
        opts: ['El 0% arriesga deflación, que es más perjudicial que inflación moderada', 'Porque es más fácil de alcanzar', 'Para que los bancos ganen más', 'Porque la UE lo exige por ley'],
        correct: 0,
        exp: 'La deflación (precios cayendo) frena el consumo y la inversión — la gente espera para comprar. El 2% da margen de maniobra.'
      }
    ]
  },
  {
    name: 'El Deudor Eterno', emoji: '💀',
    color: '#8b00ff', bg: 'rgba(139,0,255,.12)',
    intro: 'Lleva 10 años pagando el mínimo de su tarjeta. Demuestra que entiendes el verdadero coste de la deuda.',
    reward: '500 XP + Cofre Plata',
    questions: [
      {
        q: 'Tienes 3.000€ de deuda en tarjeta al 24% TAE. Solo pagas el mínimo (2%). ¿Cuántos años tardas en saldarla?',
        opts: ['Más de 15 años', '3 años', '5 años', '8 años'],
        correct: 0,
        exp: 'Con pago mínimo al 2%, una deuda de 3.000€ al 24% TAE puede tardar 20+ años en saldarse, pagando más del triple en intereses.'
      },
      {
        q: '¿Qué estrategia de pago de deudas tiene más impacto psicológico positivo?',
        opts: ['Método Snowball: paga primero la deuda más pequeña para sentir victorias rápidas', 'Método Avalanche: paga primero la deuda con mayor tipo de interés', 'Consolidar todas las deudas en una sola', 'No pagar y esperar que prescriban'],
        correct: 0,
        exp: 'Snowball gana en motivación. Avalanche gana matemáticamente. Para personas que necesitan impulso, Snowball es más efectivo.'
      },
      {
        q: 'Tu TAE es del 18% en un préstamo. ¿Cuántos años tarda en doblarse la deuda si no pagas nada? (Regla del 72)',
        opts: ['4 años (72÷18)', '18 años', '7 años', '2 años'],
        correct: 0,
        exp: 'Regla del 72: 72 ÷ 18 = 4 años. A 18% TAE, tu deuda se dobla cada 4 años sin hacer ningún pago.'
      }
    ]
  },
  {
    name: 'El Ilusionista Fiscal', emoji: '🎩',
    color: '#00c8ff', bg: 'rgba(0,200,255,.12)',
    intro: 'Te promete "trucos fiscales" que en realidad son ilegales. Demuestra que entiendes cómo pagar menos impuestos legalmente.',
    reward: '500 XP + Cofre Plata',
    questions: [
      {
        q: '¿Cuál de estas es una forma LEGAL de reducir tu carga fiscal en España?',
        opts: ['Aportar al plan de pensiones (hasta 1.500€/año deducibles)', 'Declarar ingresos en un paraíso fiscal sin tributar aquí', 'No declarar ingresos en efectivo', 'Inflar gastos personales como deducibles de empresa'],
        correct: 0,
        exp: 'Planes de pensiones, deducciones por vivienda habitual, donaciones a ONGs… son vías legales. El resto es fraude fiscal.'
      },
      {
        q: 'Ganas 30.000€/año y tu tipo marginal es del 30%. Aportas 1.500€ al plan de pensiones. ¿Cuánto ahorras en IRPF?',
        opts: ['450€ (1.500€ × 30%)', '1.500€', '300€', '150€'],
        correct: 0,
        exp: '1.500€ × 30% tipo marginal = 450€ de ahorro fiscal. Es el coste real de la aportación: solo te cuesta 1.050€ de bolsillo.'
      },
      {
        q: 'Un autónomo puede deducir gastos de su actividad. ¿Cuál NO es deducible legalmente?',
        opts: ['Las vacaciones familiares aunque lleves el portátil', 'El alquiler de la oficina donde trabajas', 'El ordenador que usas para trabajar', 'Las cuotas de autónomo (RETA)'],
        correct: 0,
        exp: 'Las vacaciones personales no son deducibles aunque ocasionalmente trabajes. Hacienda requiere que el gasto sea necesario para la actividad.'
      }
    ]
  },
  {
    name: 'El Rey del Consumismo', emoji: '👑',
    color: '#ffd700', bg: 'rgba(255,215,0,.12)',
    intro: 'Gana 5.000€/mes pero nunca puede ahorrar. Demuestra que entiendes la trampa del estilo de vida.',
    reward: '500 XP + Cofre Plata',
    questions: [
      {
        q: '¿Qué es la "trampa del estilo de vida" (lifestyle creep)?',
        opts: ['Cuando los gastos suben proporcionalmente a los ingresos, sin mejorar el ahorro', 'Vivir mejor de lo que te puedes permitir', 'Usar tarjeta de crédito para gastos del día a día', 'Compararte con tus vecinos para decidir qué comprar'],
        correct: 0,
        exp: 'Ganas más → gastas más → ahorras lo mismo. El lifestyle creep es el enemigo silencioso de la independencia financiera.'
      },
      {
        q: 'La regla 50/30/20 divide tus ingresos netos. ¿Cuál es la asignación correcta?',
        opts: ['50% necesidades, 30% deseos, 20% ahorro/deuda', '50% ahorro, 30% necesidades, 20% ocio', '50% ocio, 30% ahorro, 20% necesidades', '60% necesidades, 20% deseos, 20% ahorro'],
        correct: 0,
        exp: '50/30/20 de Senado Warren: 50% vivienda/comida/transporte, 30% ocio/extras, 20% ahorro e inversión o pago de deudas.'
      },
      {
        q: 'Quieres comprarte un coche de 30.000€ a crédito al 7% durante 5 años. ¿Cuánto pagas en total?',
        opts: ['Unos 35.600€ (cuota ~594€/mes)', '30.000€ (no hay intereses en concesionarios)', '31.050€ (pequeño recargo)', '28.000€ (hay descuento por financiar'],
        correct: 0,
        exp: 'Cuota mensual = 30.000 × [0,07/12 / (1-(1+0,07/12)^-60)] ≈ 594€. Total: 594×60 = 35.640€. El crédito cuesta 5.640€.'
      }
    ]
  },
  {
    name: 'El Gestor Fantasma', emoji: '👻',
    color: '#7fff00', bg: 'rgba(127,255,0,.10)',
    intro: 'Cobra el 2% anual de tu cartera y raramente bate al índice. Demuestra que entiendes la gestión pasiva vs activa.',
    reward: '500 XP + Cofre Plata',
    questions: [
      {
        q: '¿Qué porcentaje de fondos de gestión activa supera al índice de referencia a 15 años?',
        opts: ['Menos del 10%', 'Más del 50%', 'Exactamente el 50%', 'Alrededor del 30%'],
        correct: 0,
        exp: 'Según los informes SPIVA, menos del 10% de fondos activos supera a su índice en períodos de 15+ años. Los costes los penalizan.'
      },
      {
        q: 'Un fondo cobra el 1,5% anual y uno indexado cobra el 0,2%. En 30 años con 50.000€, ¿qué impacto tienen esas comisiones?',
        opts: ['El fondo caro puede costar +90.000€ en rendimientos perdidos', 'La diferencia es mínima, apenas unos cientos de euros', 'El fondo caro suele ganar lo suficiente para compensar', 'Solo importa la diferencia en el primer año'],
        correct: 0,
        exp: 'Al 7% bruto: el fondo al 0,2% da ~374k€; el fondo al 1,5% da ~280k€. Diferencia: ~94.000€ por comisiones.'
      },
      {
        q: '¿Qué es un ETF de acumulación vs uno de distribución?',
        opts: ['Acumulación reinvierte dividendos automáticamente; distribución los paga en efectivo', 'Acumulación es más caro que distribución', 'Distribución es mejor para largo plazo por el interés compuesto', 'No hay diferencia práctica entre ambos'],
        correct: 0,
        exp: 'ETF acumulación = más eficiente fiscalmente en España para inversión a largo plazo (no tributa por los dividendos reinvertidos hasta vender).'
      }
    ]
  },
  {
    name: 'La Burbuja', emoji: '🫧',
    color: '#ff69b4', bg: 'rgba(255,105,180,.12)',
    intro: 'Año 2000. Año 2008. Año 2021. Las burbujas se repiten. Demuestra que las reconoces antes de que exploten.',
    reward: '500 XP + Cofre Plata',
    questions: [
      {
        q: '¿Cuál es una señal clásica de que un mercado está en burbuja?',
        opts: ['Valoraciones extremadamente altas sin respaldo de beneficios reales', 'Subidas de precios del 5% anual constante', 'Muchos análisis negativos en prensa económica', 'Bajos volúmenes de negociación'],
        correct: 0,
        exp: 'PER >40, "esta vez es diferente", FOMO masivo, activos sin valor fundamental subiendo 10x… señales clásicas de burbuja.'
      },
      {
        q: 'En la burbuja .com (2000), muchas empresas sin beneficios tenían valoraciones billonarias. ¿Qué ratio fue más ignorado?',
        opts: ['El PER (Price-to-Earnings Ratio) — sin ganancias, el PER era infinito', 'El dividendo yield', 'La capitalización de mercado', 'El precio de la acción en términos absolutos'],
        correct: 0,
        exp: 'Muchas .com tenían PER infinito (sin beneficios). El mercado ignoró los fundamentales. El Nasdaq cayó un 78% entre 2000-2002.'
      },
      {
        q: 'La mejor estrategia para un inversor a largo plazo durante una crisis de mercado es:',
        opts: ['Mantener (y si es posible, comprar más a precios bajos)', 'Vender todo para no perder más', 'Esperar a que suba para luego comprar', 'Mover todo a oro'],
        correct: 0,
        exp: 'DCA (Dollar Cost Averaging) durante caídas = compras más barato. Los mercados siempre se han recuperado históricamente.'
      }
    ]
  }
];

// ── State ──────────────────────────────────────────────────────
var _wbState = null; // { qIdx, score, startTime, timerInterval }

function _wbGetWeekKey() {
  var d = new Date();
  var jan1 = new Date(d.getFullYear(), 0, 1);
  var week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return d.getFullYear() + '-W' + week;
}

function _wbGetBoss() {
  var d = new Date();
  var jan1 = new Date(d.getFullYear(), 0, 1);
  var weekIdx = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return WEEKLY_BOSSES[weekIdx % WEEKLY_BOSSES.length];
}

function _wbNextMonday() {
  var d = new Date();
  var day = d.getDay();
  var toMonday = day === 0 ? 1 : 8 - day;
  var next = new Date(d);
  next.setDate(d.getDate() + toMonday);
  next.setHours(0, 0, 0, 0);
  return next;
}

function _wbCountdown() {
  var diff = _wbNextMonday() - Date.now();
  var h = Math.floor(diff / 3600000);
  var m = Math.floor((diff % 3600000) / 60000);
  if (h >= 48) { var days = Math.floor(h / 24); return days + 'd ' + (h % 24) + 'h'; }
  return h + 'h ' + m + 'm';
}

// ── Home card ─────────────────────────────────────────────────
function WB_renderCard() {
  var el = document.getElementById('wb-card');
  if (!el) return;

  var boss = _wbGetBoss();
  var weekKey = _wbGetWeekKey();
  var done = S.weeklyBossKey === weekKey;
  var won  = done && S.weeklyBossWon;

  if (done) {
    el.innerHTML = '<div class="wb-card wb-card-done" style="background:' + boss.bg + ';border-color:' + boss.color + '20;">'
      + '<div class="wb-card-header">'
      + '<span class="wb-boss-emoji">' + boss.emoji + '</span>'
      + '<div class="wb-boss-info">'
      + '<div class="wb-boss-name">' + boss.name + '</div>'
      + '<div class="wb-boss-sub">Boss semanal · ' + (won ? '¡Derrotado!' : 'Escapó esta semana') + '</div>'
      + '</div>'
      + '<span class="wb-status-badge" style="background:' + (won ? '#00e5a0' : '#ff4444') + '20;color:' + (won ? '#00e5a0' : '#ff4444') + ';">'
      + (won ? '⚔️ Vencido' : '💀 Escapó') + '</span>'
      + '</div>'
      + '<div class="wb-next-row">Próximo boss en <strong>' + _wbCountdown() + '</strong></div>'
      + '</div>';
  } else {
    el.innerHTML = '<div class="wb-card" style="background:' + boss.bg + ';border-color:' + boss.color + '40;">'
      + '<div class="wb-card-header">'
      + '<span class="wb-boss-emoji wb-pulse">' + boss.emoji + '</span>'
      + '<div class="wb-boss-info">'
      + '<div class="wb-boss-name">' + boss.name + '</div>'
      + '<div class="wb-boss-sub">Boss semanal · ' + boss.reward + '</div>'
      + '</div>'
      + '<span class="wb-status-badge" style="background:' + boss.color + '20;color:' + boss.color + ';">ACTIVO</span>'
      + '</div>'
      + '<div class="wb-boss-intro">' + boss.intro + '</div>'
      + '<button class="wb-fight-btn" style="background:' + boss.color + ';" onclick="WB_open()">⚔️ Luchar contra el boss</button>'
      + '</div>';
  }
}

// ── Modal de batalla ──────────────────────────────────────────
function WB_open() {
  var boss = _wbGetBoss();
  var weekKey = _wbGetWeekKey();
  if (S.weeklyBossKey === weekKey) { if (typeof toast === 'function') toast('Ya luchaste esta semana', 'Vuelve el lunes para el nuevo boss', 't-warn'); return; }

  _wbState = { qIdx: 0, score: 0, startTime: Date.now(), timerInterval: null, boss: boss };

  var modal = document.getElementById('m-wb');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-wb';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  WB_renderQuestion();
  openModal('m-wb');
}

function WB_renderQuestion() {
  var modal = document.getElementById('m-wb');
  if (!modal || !_wbState) return;

  var boss = _wbState.boss;
  var qIdx = _wbState.qIdx;
  var q = boss.questions[qIdx];
  var total = boss.questions.length;
  var timeLimit = 90;

  if (_wbState.timerInterval) clearInterval(_wbState.timerInterval);

  var deadline = Date.now() + timeLimit * 1000;
  var pct = 100;

  modal.innerHTML = '<div class="sc-modal-backdrop" onclick="WB_forfeit()">'
    + '<div class="wb-modal-box" onclick="event.stopPropagation()">'
    + '<div class="wb-modal-header" style="border-color:' + boss.color + ';">'
    + '<span>' + boss.emoji + ' ' + boss.name + '</span>'
    + '<span class="wb-q-counter">' + (qIdx + 1) + '/' + total + '</span>'
    + '<span id="wb-timer" class="wb-timer">⏱ 90s</span>'
    + '</div>'
    + '<div class="wb-score-bar"><div class="wb-score-fill" id="wb-timer-bar" style="width:100%;background:' + boss.color + ';"></div></div>'
    + '<div class="wb-question">' + q.q + '</div>'
    + '<div class="wb-opts">'
    + q.opts.map(function(opt, i) {
        return '<button class="wb-opt-btn" onclick="WB_answer(' + i + ')">' + opt + '</button>';
      }).join('')
    + '</div>'
    + '</div></div>';

  _wbState.timerInterval = setInterval(function() {
    var remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    var timerEl = document.getElementById('wb-timer');
    var barEl   = document.getElementById('wb-timer-bar');
    if (timerEl) timerEl.textContent = '⏱ ' + remaining + 's';
    if (barEl)   barEl.style.width = Math.round(remaining / timeLimit * 100) + '%';
    if (remaining <= 0) {
      clearInterval(_wbState.timerInterval);
      WB_answer(-1); // timeout = wrong
    }
  }, 500);
}

function WB_answer(optIdx) {
  if (!_wbState) return;
  if (_wbState.timerInterval) clearInterval(_wbState.timerInterval);

  var boss = _wbState.boss;
  var q = boss.questions[_wbState.qIdx];
  var correct = optIdx === q.correct;
  if (correct) _wbState.score++;

  var modal = document.getElementById('m-wb');
  if (!modal) return;

  // Show feedback then advance
  var feedback = '<div class="wb-feedback ' + (correct ? 'wb-fb-ok' : 'wb-fb-bad') + '">'
    + (correct ? '✅ ¡Correcto!' : '❌ Incorrecto') + ' — ' + q.exp + '</div>';

  var opts = modal.querySelectorAll('.wb-opt-btn');
  opts.forEach(function(btn, i) {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('wb-opt-correct');
    else if (i === optIdx) btn.classList.add('wb-opt-wrong');
  });

  var fbEl = document.createElement('div');
  fbEl.innerHTML = feedback;
  var optsContainer = modal.querySelector('.wb-opts');
  if (optsContainer) optsContainer.after(fbEl.firstChild);

  setTimeout(function() {
    _wbState.qIdx++;
    if (_wbState.qIdx >= boss.questions.length) {
      WB_finish();
    } else {
      WB_renderQuestion();
    }
  }, 1600);
}

function WB_finish() {
  if (!_wbState) return;
  var boss = _wbState.boss;
  var score = _wbState.score;
  var total = boss.questions.length;
  var won = score >= Math.ceil(total * 0.67); // 2/3 correcto para ganar
  var weekKey = _wbGetWeekKey();

  S.weeklyBossKey = weekKey;
  S.weeklyBossWon = won;
  if (won) {
    S.xp = (S.xp || 0) + 500;
    if (typeof F34_onXPGained === 'function') F34_onXPGained(500);
    if (typeof F44_earnChest === 'function') F44_earnChest('silver');
    if (!Array.isArray(S.bossBeaten)) S.bossBeaten = [];
    var weekBossId = 'weekly_' + weekKey;
    if (!S.bossBeaten.includes(weekBossId)) S.bossBeaten.push(weekBossId);
  }
  if (typeof saveState === 'function') saveState();
  if (typeof checkAchievements === 'function') checkAchievements();

  var modal = document.getElementById('m-wb');
  if (!modal) return;

  modal.innerHTML = '<div class="sc-modal-backdrop" onclick="WB_close()">'
    + '<div class="wb-modal-box" onclick="event.stopPropagation()">'
    + '<div style="text-align:center;padding:32px 20px;">'
    + '<div style="font-size:64px;margin-bottom:12px;">' + (won ? '🏆' : '💀') + '</div>'
    + '<div style="font-size:22px;font-weight:700;color:' + (won ? '#00e5a0' : '#ff4444') + ';margin-bottom:8px;">'
    + (won ? '¡Boss derrotado!' : 'El boss escapó') + '</div>'
    + '<div style="font-size:15px;color:var(--text2);margin-bottom:20px;">'
    + score + '/' + total + ' correctas'
    + (won ? ' · +500 XP + Cofre Plata' : ' · Inténtalo la próxima semana') + '</div>'
    + '<div style="font-size:13px;color:var(--text3);margin-bottom:24px;">Nuevo boss en <strong>' + _wbCountdown() + '</strong></div>'
    + '<button class="sc-spin-btn" onclick="WB_close()">Continuar</button>'
    + '</div></div></div>';

  if (won) {
    if (typeof confetti === 'function') confetti();
    if (typeof spawnXP === 'function') spawnXP('+500 XP 🏆');
    if (typeof SFX !== 'undefined' && SFX.levelUp) SFX.levelUp();
  }
}

function WB_forfeit() {
  if (_wbState && _wbState.timerInterval) clearInterval(_wbState.timerInterval);
  _wbState = null;
  closeModal('m-wb');
}

function WB_close() {
  if (_wbState && _wbState.timerInterval) clearInterval(_wbState.timerInterval);
  _wbState = null;
  closeModal('m-wb');
  WB_renderCard();
}

window.WB_renderCard  = WB_renderCard;
window.WB_open        = WB_open;
window.WB_answer      = WB_answer;
window.WB_forfeit     = WB_forfeit;
window.WB_close       = WB_close;

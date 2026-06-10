/* ═══ app-news.js — Eventos de Actualidad Financiera ══════════════
   Un evento financiero nuevo cada día. Titular + contexto + 2 preguntas.
   Recompensa: 30-50 XP por evento respondido.
══════════════════════════════════════════════════════════════════ */

var NEWS_EVENTS = [
  {
    id: 'news_01',
    tag: '🏛️ Política Monetaria',
    tagColor: '#00c8ff',
    headline: 'El BCE sube tipos al 4,5% — ¿Qué significa para tu hipoteca?',
    context: 'El Banco Central Europeo ha subido los tipos de interés al 4,5%, el nivel más alto en 15 años. Esta decisión afecta directamente a las hipotecas a tipo variable (referenciadas al Euribor), a los préstamos personales y a la rentabilidad de los depósitos bancarios. El objetivo es frenar la inflación reduciendo el consumo y la inversión.',
    xp: 40,
    questions: [
      {
        q: '¿Por qué subir los tipos de interés reduce la inflación?',
        opts: ['Encarece el crédito, reduciendo consumo e inversión, lo que baja la presión sobre los precios', 'Hace que los precios bajen directamente por ley', 'Aumenta la producción industrial automáticamente', 'Reduce el gasto público del gobierno'],
        correct: 0,
        exp: 'Tipos más altos = crédito más caro = menos consumo e inversión = menos demanda = inflación baja. Es el mecanismo de transmisión monetaria.'
      },
      {
        q: 'Tienes una hipoteca variable de 200.000€ a 30 años. El Euribor sube del 2% al 4%. ¿Cuánto sube aproximadamente tu cuota mensual?',
        opts: ['Unos 200-250€/mes más', '20€/mes más', '1.000€/mes más', 'No cambia hasta renovación'],
        correct: 0,
        exp: 'En una hipoteca de 200k€ a 30 años, 2 puntos más de tipo = ~220€/mes extra. Esto es el riesgo del tipo variable.'
      }
    ]
  },
  {
    id: 'news_02',
    tag: '📉 Mercados',
    tagColor: '#ff4444',
    headline: 'La bolsa cae un 8% en una semana — ¿Crisis o corrección normal?',
    context: 'El IBEX 35 ha caído un 8% en los últimos 5 días de negociación, arrastrado por datos de inflación más altos de lo esperado y tensiones geopolíticas. Los medios hablan de "crash" pero los analistas señalan que caídas del 5-10% ocurren varias veces al año y son parte del ciclo normal de los mercados.',
    xp: 35,
    questions: [
      {
        q: '¿Cuántas veces al año ocurre históricamente una corrección del 5-10% en el S&P 500?',
        opts: ['3-4 veces al año de media', 'Casi nunca, solo en crisis graves', '1 vez cada 5 años', '12 veces al año'],
        correct: 0,
        exp: 'Datos históricos: el S&P 500 cae un 5%+ unas 3-4 veces/año, un 10%+ cada 1-2 años. Son completamente normales.'
      },
      {
        q: 'En una caída del mercado del 20%, el inversor a largo plazo que mantiene su cartera indexada, históricamente:',
        opts: ['Recupera todo y más en los años siguientes si mantiene', 'Pierde ese dinero de forma permanente', 'Solo recupera si añade más dinero', 'Debe vender para evitar pérdidas mayores'],
        correct: 0,
        exp: 'Todas las caídas históricas han sido recuperadas. El inversor que mantiene (y no vende en el pánico) históricamente sale adelante.'
      }
    ]
  },
  {
    id: 'news_03',
    tag: '💰 Ahorro',
    tagColor: '#00e5a0',
    headline: 'Los depósitos a plazo vuelven a dar hasta el 3,5% en España',
    context: 'Tras años de tipos cero, los depósitos bancarios en España vuelven a ofrecer rentabilidades interesantes. Algunos bancos ofrecen hasta el 3,5% TAE para plazos de 12 meses. Esto los convierte en una alternativa para el ahorro a corto plazo, aunque la inflación sigue siendo mayor que esa rentabilidad en muchos períodos.',
    xp: 30,
    questions: [
      {
        q: 'Un depósito al 3,5% con inflación del 4,2%. ¿Cuál es tu rentabilidad REAL?',
        opts: ['-0,7% (pierdes poder adquisitivo, aunque ganas dinero nominal)', '+3,5% (el depósito da lo prometido)', '+7,7% (se suman)', '-4,2% (solo importa la inflación)'],
        correct: 0,
        exp: 'Rentabilidad real = nominal - inflación = 3,5% - 4,2% = -0,7%. El dinero crece nominalmente pero compras menos con él.'
      },
      {
        q: '¿Hasta qué importe garantiza el Fondo de Garantía de Depósitos (FGD) en España?',
        opts: ['100.000€ por titular y entidad', '50.000€ por cuenta', '250.000€ por titular', 'No hay límite'],
        correct: 0,
        exp: 'El FGD español (y europeo) garantiza hasta 100.000€ por depositante y entidad. Si el banco quiebra, ese dinero está protegido.'
      }
    ]
  },
  {
    id: 'news_04',
    tag: '🏠 Inmobiliario',
    tagColor: '#ffd700',
    headline: 'El precio de la vivienda sube un 7% en las grandes ciudades',
    context: 'Madrid y Barcelona registran subidas de precio de la vivienda del 7% interanual, impulsadas por la escasez de oferta y la demanda de alquiler. Los expertos debaten si es el momento de comprar o alquilar, con el Euribor aún alto y los precios en máximos históricos.',
    xp: 40,
    questions: [
      {
        q: '¿Cuál es el ratio "Price-to-Rent" y para qué sirve?',
        opts: ['El precio de compra dividido entre el alquiler anual; indica si comprar o alquilar es más eficiente', 'La rentabilidad de alquiler en porcentaje', 'El tiempo en años que tardas en amortizar una hipoteca', 'La relación entre hipoteca y salario'],
        correct: 0,
        exp: 'Price-to-Rent = precio / alquiler anual. Si es >20, alquilar suele ser más eficiente; si es <15, comprar suele compensar.'
      },
      {
        q: 'Al comprar una vivienda de 250.000€ en segunda mano en Madrid, ¿qué impuesto autonómico pagas (aprox)?',
        opts: ['ITP al 6-10% (~15.000-25.000€)', 'IVA al 21% (~52.500€)', 'Sin impuesto si es tu primera vivienda', 'Solo notaría (~1.000€)'],
        correct: 0,
        exp: 'Segunda mano = ITP (Impuesto de Transmisiones Patrimoniales). En Madrid es el 6% actualmente = 15.000€ solo de impuesto.'
      }
    ]
  },
  {
    id: 'news_05',
    tag: '₿ Criptomonedas',
    tagColor: '#f7931a',
    headline: 'Bitcoin supera los 100.000$ — ¿Burbuja o nueva era?',
    context: 'Bitcoin alcanza un nuevo máximo histórico superando los 100.000 dólares por primera vez. La aprobación de ETFs de Bitcoin en Estados Unidos y la reducción a la mitad de la emisión (halving) son los catalizadores. Los defensores hablan de "oro digital"; los críticos señalan la volatilidad extrema y el consumo energético.',
    xp: 35,
    questions: [
      {
        q: '¿Qué porcentaje de la cartera recomiendan la mayoría de asesores financieros para activos de alto riesgo como Bitcoin?',
        opts: ['No más del 5-10% para la mayoría de inversores', 'Al menos el 50% para maximizar rentabilidad', 'El 0%, nunca hay que invertir en cripto', 'Depende: si sube, más; si baja, menos'],
        correct: 0,
        exp: 'Regla general: activos muy volátiles (cripto, acciones individuales especulativas) no deberían superar el 5-10% de tu cartera total.'
      },
      {
        q: '¿Cuál es la principal crítica de los economistas tradicionales al Bitcoin como "reserva de valor"?',
        opts: ['Su extrema volatilidad lo hace poco fiable para conservar poder adquisitivo a corto plazo', 'Que no tiene límite de emisión', 'Que está respaldado por muchos gobiernos', 'Que es demasiado fácil de copiar'],
        correct: 0,
        exp: 'El oro ha mantenido valor durante milenios. Bitcoin cayó un 80% en 2022. La volatilidad lo hace problemático como reserva de valor.'
      }
    ]
  },
  {
    id: 'news_06',
    tag: '💼 Trabajo',
    tagColor: '#a855f7',
    headline: 'La reforma de pensiones: jubilación más tarde, cotización más alta',
    context: 'El Gobierno aprueba una reforma que aumenta progresivamente la edad de jubilación ordinaria a 67 años para 2027 y eleva el período de cotización necesario para cobrar el 100% de la pensión. Muchos expertos advierten que la pensión pública no será suficiente y recomiendan complementarla con ahorro privado.',
    xp: 40,
    questions: [
      {
        q: 'Para cobrar el 100% de la pensión máxima en España en 2027, ¿cuántos años de cotización serán necesarios?',
        opts: ['37 años cotizados', '25 años cotizados', '30 años cotizados', '15 años cotizados'],
        correct: 0,
        exp: 'La reforma de 2023 establece 37 años cotizados (y 6 meses) para el 100% de la base reguladora a partir de 2027.'
      },
      {
        q: '¿Cuál es la tasa de sustitución media de las pensiones en España? (% del último salario que cubre la pensión)',
        opts: ['~73% (de las más altas de Europa)', '~40%', '~95%', '~50%'],
        correct: 0,
        exp: 'España tiene una tasa de sustitución del ~73%, una de las más altas de Europa. Pero la sostenibilidad del sistema es la preocupación a futuro.'
      }
    ]
  },
  {
    id: 'news_07',
    tag: '🌍 Economía Global',
    tagColor: '#22d3ee',
    headline: 'China ralentiza: ¿cómo afecta a tus inversiones en España?',
    context: 'El PIB chino crece al 4,5%, por debajo del objetivo del 5%. La crisis inmobiliaria del país (Evergrande y otros promotores) sigue lastrando la economía. Dado que China representa el 18% del PIB mundial, su ralentización impacta en materias primas, empresas exportadoras y mercados emergentes.',
    xp: 35,
    questions: [
      {
        q: '¿Por qué la crisis inmobiliaria china puede afectar al precio del cobre y el acero a nivel global?',
        opts: ['China es el mayor consumidor mundial de estos materiales para construcción; menos construcción = menos demanda = precios bajan', 'Porque China los exporta y venderá más barato', 'Por el tipo de cambio yuan/euro', 'No tiene relación directa'],
        correct: 0,
        exp: 'China consume ~55% del acero y ~50% del cobre mundiales. Su ralentización en construcción reduce la demanda global, bajando los precios de estas materias primas.'
      },
      {
        q: 'Un fondo indexado al MSCI World incluye empresas chinas. ¿Cuánto pesa China aproximadamente en ese índice?',
        opts: ['Menos del 4% (China está en MSCI Emerging Markets, no en el World estándar)', 'El 18% (su peso en el PIB mundial)', 'El 30%', 'El 0%'],
        correct: 0,
        exp: 'El MSCI World cubre mercados desarrollados. China está en el MSCI Emerging Markets. Para exponerse a China hay que usar MSCI ACWI o fondos específicos.'
      }
    ]
  },
  {
    id: 'news_08',
    tag: '🤖 Tecnología',
    tagColor: '#ec4899',
    headline: 'La IA destruye empleos o los transforma: ¿cómo proteger tus ingresos?',
    context: 'Goldman Sachs estima que la inteligencia artificial podría automatizar el 25-30% de los trabajos actuales en los próximos 10 años. Las profesiones más afectadas: trabajos administrativos, atención al cliente, análisis de datos básico. Las más resilientes: creatividad, empatía, habilidades manuales complejas.',
    xp: 40,
    questions: [
      {
        q: '¿Cuál es la mejor estrategia financiera para protegerse de la obsolescencia laboral por la IA?',
        opts: ['Diversificar ingresos (formación continua + ahorro de emergencia amplio + ingresos pasivos)', 'No preocuparse: siempre habrá trabajo para humanos', 'Invertir todo en empresas de IA', 'Cambiarse a un sector que la IA no tocará nunca'],
        correct: 0,
        exp: 'Fondo de emergencia de 12 meses + ingresos múltiples + formación constante = resiliencia ante cambios del mercado laboral.'
      },
      {
        q: 'Inviertes en un ETF del sector tecnológico (NASDAQ). Tu riesgo de concentración es:',
        opts: ['Alto: si el sector cae, toda tu cartera sufre. La diversificación sectorial lo mitiga', 'Bajo: la tecnología siempre sube a largo plazo', 'Ninguno: los ETFs eliminan el riesgo', 'Moderado: mientras no inviertas en una sola empresa'],
        correct: 0,
        exp: 'El NASDAQ cayó un 78% en 2000-2002. La diversificación entre sectores (tecnología, consumo, salud, etc.) reduce la volatilidad de cartera.'
      }
    ]
  },
  {
    id: 'news_09',
    tag: '🌱 Inversión ESG',
    tagColor: '#22c55e',
    headline: 'Los fondos ESG crecen pero hay dudas sobre el "greenwashing"',
    context: 'Los activos en fondos ESG (Environmental, Social, Governance) superan los 35 billones de dólares mundialmente. Sin embargo, reguladores en Europa y EEUU investigan a gestoras por "greenwashing": presentar fondos como sostenibles cuando no lo son realmente. La UE ha introducido la SFDR para regular la clasificación.',
    xp: 35,
    questions: [
      {
        q: '¿Qué significa "greenwashing" en inversión?',
        opts: ['Presentar un fondo o empresa como más sostenible de lo que realmente es para atraer inversores', 'Invertir exclusivamente en energías renovables', 'El proceso de certificar la sostenibilidad de una inversión', 'Una estrategia de inversión en empresas verdes'],
        correct: 0,
        exp: 'Greenwashing = lavar la imagen de verde. Las empresas o fondos exageran su impacto ambiental positivo. La regulación SFDR de la UE intenta combatirlo.'
      },
      {
        q: '¿La inversión ESG tiene necesariamente menor rentabilidad que la inversión tradicional?',
        opts: ['No, históricamente los fondos ESG han tenido rendimientos similares o superiores en muchos períodos', 'Sí, siempre se sacrifica rentabilidad por ética', 'Sí, en el largo plazo siempre rinden menos', 'Solo rinden mejor durante crisis climáticas'],
        correct: 0,
        exp: 'Estudios de MSCI y Morningstar muestran que los fondos ESG de calidad han tenido rentabilidades comparables o superiores en muchos períodos, especialmente durante la pandemia.'
      }
    ]
  },
  {
    id: 'news_10',
    tag: '🏢 Emprendimiento',
    tagColor: '#f97316',
    headline: 'Récord de nuevas empresas en España: lo que nadie te cuenta del emprendimiento',
    context: 'España bate el récord de nuevas sociedades creadas en 2024. Pero las estadísticas muestran que el 80% de startups fracasan en los primeros 5 años. Los principales motivos: falta de liquidez, no validar el mercado antes de invertir, y socios mal elegidos. Emprender tiene implicaciones fiscales y patrimoniales que muchos desconocen.',
    xp: 45,
    questions: [
      {
        q: 'Como autónomo en España, ¿cuál es la cuota mínima mensual de la Seguridad Social aproximada en 2024?',
        opts: ['~230€/mes (tarifa plana para nuevos autónomos en el primer año)', '~600€/mes desde el primer día', '~100€/mes', 'Depende de los ingresos desde el primer euro'],
        correct: 0,
        exp: 'Tarifa plana 2024: 80€/mes el primer año, luego escalando. Tras el primer año, la cuota mínima es ~230€/mes para bases de cotización mínimas.'
      },
      {
        q: '¿Qué estructura empresarial protege mejor tu patrimonio personal si el negocio quiebra?',
        opts: ['Sociedad Limitada (SL): responsabilidad limitada al capital aportado', 'Autónomo: mayor flexibilidad fiscal', 'Sociedad Anónima (SA): para cualquier tamaño de negocio', 'Cooperativa: los socios comparten el riesgo'],
        correct: 0,
        exp: 'La SL limita tu responsabilidad al capital social (mínimo 1€ desde 2023). Como autónomo, respondes con todos tus bienes presentes y futuros.'
      }
    ]
  }
];

// ── State ──────────────────────────────────────────────────────
var _newsState = null;

function _newsGetTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function _newsGetTodayEvent() {
  // Determinar evento del día por índice de días desde epoch
  var dayIndex = Math.floor(Date.now() / 86400000);
  return NEWS_EVENTS[dayIndex % NEWS_EVENTS.length];
}

// ── Home card ─────────────────────────────────────────────────
function NEWS_renderCard() {
  var el = document.getElementById('news-card');
  if (!el) return;

  var event = _newsGetTodayEvent();
  var today = _newsGetTodayKey();
  var done  = S.newsReadKey === today && S.newsReadId === event.id;

  if (done) {
    el.innerHTML = '<div class="news-card news-card-done">'
      + '<div class="news-tag" style="background:' + event.tagColor + '20;color:' + event.tagColor + ';">' + event.tag + '</div>'
      + '<div class="news-headline">' + event.headline + '</div>'
      + '<div class="news-done-msg">✅ Leído hoy · Vuelve mañana para el siguiente evento</div>'
      + '</div>';
  } else {
    el.innerHTML = '<div class="news-card" onclick="NEWS_open()">'
      + '<div class="news-card-top">'
      + '<div class="news-tag" style="background:' + event.tagColor + '20;color:' + event.tagColor + ';">' + event.tag + '</div>'
      + '<div class="news-xp-badge">+' + event.xp + ' XP</div>'
      + '</div>'
      + '<div class="news-headline">' + event.headline + '</div>'
      + '<div class="news-cta">Leer y responder →</div>'
      + '</div>';
  }
}

// ── Modal ─────────────────────────────────────────────────────
function NEWS_open() {
  var event = _newsGetTodayEvent();
  var today = _newsGetTodayKey();
  if (S.newsReadKey === today && S.newsReadId === event.id) {
    if (typeof toast === 'function') toast('Ya leíste el evento de hoy', 'Vuelve mañana', 't-warn');
    return;
  }

  _newsState = { event: event, qIdx: 0, score: 0, phase: 'read' };

  var modal = document.getElementById('m-news');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-news';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  NEWS_renderRead();
  openModal('m-news');
}

function NEWS_renderRead() {
  var modal = document.getElementById('m-news');
  if (!modal || !_newsState) return;
  var ev = _newsState.event;

  modal.innerHTML = '<div class="sc-modal-backdrop" onclick="NEWS_close()">'
    + '<div class="news-modal-box" onclick="event.stopPropagation()">'
    + '<button class="sc-modal-close" onclick="NEWS_close()">&#x2715;</button>'
    + '<div class="news-tag" style="background:' + ev.tagColor + '20;color:' + ev.tagColor + ';margin-bottom:12px;">' + ev.tag + '</div>'
    + '<div class="news-modal-headline">' + ev.headline + '</div>'
    + '<div class="news-modal-context">' + ev.context + '</div>'
    + '<button class="sc-spin-btn" style="margin-top:20px;" onclick="NEWS_startQuiz()">Quiz → +' + ev.xp + ' XP</button>'
    + '</div></div>';
}

function NEWS_startQuiz() {
  if (!_newsState) return;
  _newsState.phase = 'quiz';
  _newsState.qIdx  = 0;
  NEWS_renderQuiz();
}

function NEWS_renderQuiz() {
  var modal = document.getElementById('m-news');
  if (!modal || !_newsState) return;
  var ev = _newsState.event;
  var q  = ev.questions[_newsState.qIdx];
  var total = ev.questions.length;

  modal.innerHTML = '<div class="sc-modal-backdrop" onclick="">'
    + '<div class="news-modal-box" onclick="event.stopPropagation()">'
    + '<div class="news-modal-qheader">'
    + '<span class="news-tag" style="background:' + ev.tagColor + '20;color:' + ev.tagColor + ';">' + ev.tag + '</span>'
    + '<span class="wb-q-counter">' + (_newsState.qIdx + 1) + '/' + total + '</span>'
    + '</div>'
    + '<div class="wb-question" style="margin:16px 0;">' + q.q + '</div>'
    + '<div class="wb-opts">'
    + q.opts.map(function(opt, i) {
        return '<button class="wb-opt-btn" onclick="NEWS_answer(' + i + ')">' + opt + '</button>';
      }).join('')
    + '</div>'
    + '</div></div>';
}

function NEWS_answer(optIdx) {
  if (!_newsState) return;
  var ev = _newsState.event;
  var q  = ev.questions[_newsState.qIdx];
  var correct = optIdx === q.correct;
  if (correct) _newsState.score++;

  var modal = document.getElementById('m-news');
  if (!modal) return;

  // Highlight answer
  var opts = modal.querySelectorAll('.wb-opt-btn');
  opts.forEach(function(btn, i) {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('wb-opt-correct');
    else if (i === optIdx) btn.classList.add('wb-opt-wrong');
  });

  var fbEl = document.createElement('div');
  fbEl.className = 'wb-feedback ' + (correct ? 'wb-fb-ok' : 'wb-fb-bad');
  fbEl.textContent = (correct ? '✅ ¡Correcto!' : '❌ Incorrecto') + ' — ' + q.exp;
  var optsContainer = modal.querySelector('.wb-opts');
  if (optsContainer) optsContainer.after(fbEl);

  setTimeout(function() {
    _newsState.qIdx++;
    if (_newsState.qIdx >= ev.questions.length) {
      NEWS_finish();
    } else {
      NEWS_renderQuiz();
    }
  }, 1800);
}

function NEWS_finish() {
  if (!_newsState) return;
  var ev    = _newsState.event;
  var score = _newsState.score;
  var total = ev.questions.length;
  var xpGained = score === total ? ev.xp : Math.round(ev.xp * 0.5);
  var today = _newsGetTodayKey();

  S.xp = (S.xp || 0) + xpGained;
  S.newsReadKey = today;
  S.newsReadId  = ev.id;
  if (typeof F34_onXPGained === 'function') F34_onXPGained(xpGained);
  if (typeof saveState === 'function') saveState();
  if (typeof checkAchievements === 'function') checkAchievements();

  var modal = document.getElementById('m-news');
  if (!modal) return;

  modal.innerHTML = '<div class="sc-modal-backdrop" onclick="NEWS_close()">'
    + '<div class="news-modal-box" onclick="event.stopPropagation()">'
    + '<div style="text-align:center;padding:28px 16px;">'
    + '<div style="font-size:52px;margin-bottom:10px;">' + (score === total ? '🎯' : '📰') + '</div>'
    + '<div style="font-size:20px;font-weight:700;color:var(--accent);margin-bottom:6px;">' + score + '/' + total + ' correctas</div>'
    + '<div style="font-size:14px;color:var(--text2);margin-bottom:20px;">+' + xpGained + ' XP ganados</div>'
    + '<div style="font-size:12px;color:var(--text3);margin-bottom:24px;">Nuevo evento mañana</div>'
    + '<button class="sc-spin-btn" onclick="NEWS_close()">Continuar</button>'
    + '</div></div></div>';

  if (typeof spawnXP === 'function') spawnXP('+' + xpGained + ' XP 📰');
}

function NEWS_close() {
  _newsState = null;
  closeModal('m-news');
  NEWS_renderCard();
}

window.NEWS_renderCard = NEWS_renderCard;
window.NEWS_open       = NEWS_open;
window.NEWS_startQuiz  = NEWS_startQuiz;
window.NEWS_answer     = NEWS_answer;
window.NEWS_close      = NEWS_close;

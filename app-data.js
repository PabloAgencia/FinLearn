/* FinLearn Bundle */

// ═══ DATA — Módulos ═══
/* ══════════════════════════════════════════════════════════════════
   data-modules.js — Módulos de Aprendizaje FinLearn
   ─ Contiene el array MODULES con todas las lecciones y quizzes.
   ─ Para añadir/editar un módulo, localiza el id correspondiente.
   ─ Estructura de cada step: {type:'content'|'quiz'|'final', ...}
   ─ Sin dependencias externas.
══════════════════════════════════════════════════════════════════ */

const MODULES = [

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 0 — El Interés Compuesto: La 8ª Maravilla
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:0, icon:'📈', title:'El Interés Compuesto',
    desc:'La fuerza matemática que convierte tiempo en millones',
    xp:20, tag:'FUNDAMENTAL', tagC:'green', users:'41.300',
    steps:[

      /* ── Lección 1: El mecanismo ── */
      {type:'content', tag:'📈 Módulo 1', title:'La 8ª Maravilla del Mundo',
        intro:'Albert Einstein, supuestamente, afirmó que el interés compuesto es la fuerza más poderosa del universo. Lo dijera o no, la frase captura una verdad matemática incontestable: el tiempo transforma cantidades modestas en fortunas. Y lo más brutal es que no requiere inteligencia, solo paciencia y empezar.',
        blocks:[
          {t:'text', h:'¿Qué es el interés compuesto?',
            p:'El interés simple es lineal: inviertes 1.000€ al 10% y cada año ganas 100€. En 30 años tienes 4.000€. El interés compuesto es exponencial: los intereses del año 1 generan intereses en el año 2. El año 1 ganas 100€; el año 2 ganas el 10% sobre <strong>1.100€</strong>, es decir, 110€. Esta diferencia parece insignificante. Pero en 30 años tu 1.000€ se convierte en <strong>17.449€</strong> — más de cuatro veces el resultado lineal.'},
          {t:'formula', f:'A = P × (1 + r)ⁿ', l:'A = valor futuro · P = capital inicial · r = tasa anual · n = número de años'},
          {t:'stats', items:[
            {v:'€17.449', l:'1.000€ al 10% en 30 años (compuesto)'},
            {v:'€4.000',  l:'1.000€ al 10% en 30 años (simple)'},
            {v:'×4.36',   l:'La ventaja del interés compuesto'},
          ]},
          {t:'hl', s:'', label:'💡 EL COSTE DE OPORTUNIDAD',
            p:'Cada euro que gastas hoy no vale solo lo que gastas: vale lo que hubiera generado durante los próximos 30 años. Ese café de 3€ diarios que no inviertes equivale a <strong>3 × 365 × (1,07)^30 ≈ 111.000€</strong> perdidos al llegar a la jubilación. No se trata de obsesionarse con cada euro, sino de entender el <em>precio real</em> de tus decisiones de gasto.'},
          {t:'hl', s:'warn', label:'⚠️ EL LADO OSCURO: TU DEUDA TAMBIÉN COMPONE',
            p:'El mismo mecanismo que enriquece al inversor destruye al deudor que no presta atención. Una tarjeta de crédito al 24% TAE dobla tu deuda en exactamente 3 años (Regla del 72: 72÷24=3). 5.000€ de deuda con saldo mínimo se convierten en <strong>19.600€</strong> en 12 años. El banco cobra interés compuesto; tú deberías cobrarlo también.'},
        ]
      },

      /* ── Quiz 1 ── */
      {type:'quiz',
        q:'Inviertes 5.000€ a una tasa del 8% anual con interés compuesto. Usando la fórmula A = P×(1+r)ⁿ, ¿cuánto tendrás exactamente en 10 años?',
        opts:[
          {t:'€9.000 (crecimiento lineal del 80%)',       ok:false},
          {t:'€10.794 (interés compuesto al 8% × 10)',    ok:true},
          {t:'€12.500 (estimación por exceso)',            ok:false},
          {t:'€8.500 (subestimación del efecto compuesto)',ok:false},
        ],
        ok:'¡Correcto! 5.000 × (1,08)^10 = 5.000 × 2,1589 = 10.794€. El crecimiento lineal habría dado solo 9.000€. La diferencia de 1.794€ en apenas 10 años ilustra el poder del efecto compuesto.',
        bad:'La respuesta correcta es 10.794€. Aplicando A = 5.000 × (1,08)^10: (1,08)^10 = 2,1589, por lo que 5.000 × 2,1589 = 10.794€. El crecimiento lineal solo daría 9.000€ — la diferencia es el interés compuesto en acción.',
      },

      /* ── Lección 2: La Regla del 72 y el tiempo como activo ── */
      {type:'content', title:'La Regla del 72 y el Tiempo Como Activo',
        blocks:[
          {t:'text', h:'La Regla del 72: cálculo mental de élite',
            p:'Cualquier gestor de fondos, trader o analista conoce esta regla de memoria: <strong>divide 72 entre la tasa de interés anual y obtienes los años necesarios para doblar tu capital</strong>. Al 6%: 72÷6 = 12 años para doblar. Al 9%: 72÷9 = 8 años. Al 12%: 72÷12 = 6 años. Esta regla es una aproximación basada en la función logarítmica natural (ln(2) ≈ 0,693), válida entre el 2% y el 15% de interés con menos del 1% de error.'},
          {t:'stats', items:[
            {v:'72÷6=12', l:'Años para doblar al 6% anual'},
            {v:'72÷9=8',  l:'Años para doblar al 9% anual (histórico SP500 real)'},
            {v:'72÷24=3', l:'Años para doblar UNA DEUDA al 24% TAE'},
          ]},
          {t:'text', h:'El activo más valioso: tu horizonte temporal',
            p:'Warren Buffett ganó el <strong>99% de su riqueza después de los 50 años</strong>. No porque fuera más inteligente a los 50, sino porque el interés compuesto necesita tiempo para manifestar su potencia exponencial. Si empiezas a invertir 300€/mes a los 25 años al 8%, llegas a los 65 con <strong>1.007.000€</strong>. Si empiezas a los 35, llegas con <strong>440.000€</strong>. La diferencia de 10 años cuesta <strong>567.000€</strong>: nunca hay un momento mejor que ahora.'},
          {t:'hl', s:'info', label:'📊 LA TABLA QUE CAMBIA VIDAS',
            p:'Con 200€/mes al 8% anual: <strong>10 años → 36.589€</strong> | <strong>20 años → 118.589€</strong> | <strong>30 años → 298.073€</strong> | <strong>40 años → 702.856€</strong>. El último período de 10 años (años 30-40) aporta más de 400.000€ — más que todos los anteriores juntos. Esta es la magia de la exponencialidad.'},
        ]
      },

      /* ── Quiz 2 ── */
      {type:'quiz',
        q:'Ana empieza a invertir 200€/mes a los 25 años al 8%. Luis empieza con 400€/mes a los 35 años al mismo rendimiento. ¿Quién tiene más dinero a los 65?',
        opts:[
          {t:'Luis, porque aporta el doble cada mes',                              ok:false},
          {t:'Ana, porque empezó antes y el tiempo supera a la cantidad',           ok:true},
          {t:'Tienen lo mismo, porque Luis compensa con más aportación',            ok:false},
          {t:'Depende de la inflación en cada período',                             ok:false},
        ],
        ok:'¡Exacto! Ana acumula ≈702.856€. Luis acumula ≈ 601.724€. Ana gana a pesar de aportar la mitad. Este es el principio fundamental que demuestra que <em>cuándo empiezas importa más que cuánto aportas</em>. 40 años de compuesto superan a 30 años con el doble de aportación.',
        bad:'Contra-intuitivo pero cierto: Ana gana con 200€/mes durante 40 años vs Luis con 400€/mes durante 30 años. Ana acumula ≈702.856€; Luis ≈601.724€. El tiempo supera al importe de aportación porque la exponencialidad crece más rápido en los últimos años.',
      },

      /* ── Quiz 3 ── */
      {type:'quiz',
        q:'Usando la Regla del 72, ¿en cuántos años se dobla una inversión que rinde el 9% anual?',
        opts:[
          {t:'9 años exactos',            ok:false},
          {t:'8 años (72÷9)',             ok:true},
          {t:'18 años (9×2)',             ok:false},
          {t:'Solo funciona para el 6%',  ok:false},
        ],
        ok:'¡Perfecto! 72 ÷ 9 = 8 años. La Regla del 72 funciona para cualquier tasa entre el 2% y el 15% con muy poco margen de error (menos del 1%). Es la herramienta de estimación mental más usada por inversores profesionales en el mundo.',
        bad:'La respuesta correcta es 8 años. La Regla del 72 dice: divide 72 entre la tasa de rendimiento anual. 72 ÷ 9 = 8 años para doblar el capital. Esta aproximación es válida con menos del 1% de error para tasas entre 2% y 15%.',
      },

      {type:'final', xp:20, msg:'¡Has dominado el Interés Compuesto! Ahora entiendes la fuerza más poderosa de las finanzas personales.'},
    ]
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 1 — Arquitectura de Cartera: ETFs vs Fondos
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:1, icon:'🏗️', title:'Arquitectura de Cartera',
    desc:'ETFs vs Fondos: la verdad que la industria no quiere que sepas',
    xp:22, tag:'INVERSIÓN', tagC:'blue', users:'29.800',
    steps:[

      /* ── Lección 1: El problema con los fondos activos ── */
      {type:'content', tag:'🏗️ Módulo 2', title:'Por Qué el 90% de los Gestores Pierde',
        intro:'La industria de fondos de inversión mueve 60 billones de dólares globalmente. La promesa es siempre la misma: gestores brillantes que, gracias a su análisis y experiencia, batirán al mercado. El problema es que los datos, después de décadas de análisis riguroso, demuestran que esta promesa es, en su mayoría, falsa.',
        blocks:[
          {t:'text', h:'¿Gestión activa o pasiva?',
            p:'La <strong>gestión activa</strong> implica que un equipo de analistas selecciona qué acciones comprar y vender, intentando batir a un índice de referencia (benchmark). La <strong>gestión pasiva</strong> replica mecánicamente un índice (S&P 500, MSCI World) sin intentar superarlo. El S&P SPIVA Report — el estudio más riguroso y largo de la industria — analiza miles de fondos activos a nivel global y publica los resultados cada semestre desde 2002.'},
          {t:'stats', items:[
            {v:'88%', l:'Fondos activos que NO baten al S&P 500 en 15 años (SPIVA 2024)'},
            {v:'96%', l:'Fondos activos de renta fija que no baten al índice en 20 años'},
            {v:'0%',  l:'Fondos que baten CONSISTENTEMENTE al mercado 20+ años'},
          ]},
          {t:'hl', s:'warn', label:'⚠️ EL IMPACTO DEMOLEDOR DE LAS COMISIONES (TER)',
            p:'El TER (Total Expense Ratio) es el porcentaje anual que cobra el fondo sobre tu capital. Un fondo activo cobra típicamente entre el 1,5% y el 2,5% anual. Un ETF indexado cobra entre el 0,03% y el 0,20%. La diferencia parece pequeña. Aplica el interés compuesto: sobre 100.000€ durante 30 años, la diferencia del 1,7% en comisiones equivale a <strong>perder 143.000€</strong>. Las comisiones son la mayor destrucción de riqueza silenciosa en finanzas personales.'},
          {t:'hl', s:'', label:'🎯 LA PARADOJA DEL MERCADO EFICIENTE',
            p:'¿Por qué los gestores no pueden batir al mercado? La hipótesis del mercado eficiente (Eugene Fama, Nobel 2013) dice que los precios ya reflejan toda la información disponible. Cuando un gestor "descubre" una oportunidad, miles de algoritmos y analistas ya la vieron antes. Intentar batir al mercado es como buscar billetes de 100€ en la acera de Wall Street: si existieran, alguien los habría recogido antes de que llegues.'},
        ]
      },

      /* ── Quiz 1 ── */
      {type:'quiz',
        q:'Un fondo activo cobra un TER del 2% anual. Un ETF indexado equivalente cobra el 0,07%. Sobre una inversión de 50.000€ a 25 años al 7% de rentabilidad bruta, ¿cuál es aproximadamente la diferencia en patrimonio final?',
        opts:[
          {t:'Unos 3.500€ — la diferencia es mínima',       ok:false},
          {t:'Unos 45.000€ — el impacto del TER es importante', ok:false},
          {t:'Más de 80.000€ — las comisiones destruyen el compuesto', ok:true},
          {t:'No hay diferencia si la rentabilidad bruta es igual',    ok:false},
        ],
        ok:'¡Correcto! La diferencia real supera los 80.000€. El fondo activo al 5% neto genera ≈169.000€. El ETF al 6,93% neto genera ≈254.000€. La comisión del 2% se lleva más del 30% de tu patrimonio potencial. Las comisiones son el cáncer silencioso de la inversión.',
        bad:'La respuesta correcta es más de 80.000€. Con TER 2%, la rentabilidad neta es 5%; con TER 0,07%, es ~6,93%. En 25 años sobre 50.000€: fondo activo ≈169.000€, ETF ≈254.000€. Diferencia: +85.000€ a favor del ETF. Las comisiones se capitalizan en tu contra igual que los intereses a tu favor.',
      },

      /* ── Lección 2: Cómo construir una cartera con ETFs ── */
      {type:'content', title:'Cómo Construir Tu Cartera con ETFs',
        blocks:[
          {t:'text', h:'Los ETFs esenciales para el inversor europeo',
            p:'Un ETF (Exchange-Traded Fund) es una cesta de valores que cotiza en bolsa. Al comprar una participación de VUSA o IWDA, estás comprando simultáneamente fracciones de cientos o miles de empresas. La diversificación instantánea que antes costaba millones ahora está al alcance de cualquiera con 50€ y un broker. Los ETFs pagan dividendos (distributing) o los reinvierten automáticamente (accumulating — preferibles en Europa por fiscalidad).'},
          {t:'stats', items:[
            {v:'IWDA',  l:'1.600 empresas, 23 países desarrollados — TER 0,20%'},
            {v:'VUSA',  l:'500 mayores EE.UU. (S&P 500) — TER 0,07%'},
            {v:'AGGH',  l:'Bonos globales para equilibrar riesgo — TER 0,10%'},
          ]},
          {t:'hl', s:'info', label:'📐 LA REGLA DE ORO DE LA ASIGNACIÓN DE ACTIVOS',
            p:'Una cartera clásica para el inversor a largo plazo (Bogle, Swensen): <strong>80% renta variable (IWDA o VUSA)</strong> + <strong>20% renta fija (bonos)</strong>. A medida que te acercas a la jubilación, reduce la renta variable y aumenta la fija: menos volatilidad a cambio de menor rentabilidad potencial. No existe la cartera perfecta universal — existe la cartera adecuada a tu horizonte temporal y tolerancia al riesgo.'},
          {t:'text', h:'DCA: Dollar-Cost Averaging',
            p:'No intentes comprar en mínimos. Nadie puede hacerlo de forma consistente — ni los mejores gestores. La estrategia óptima es el DCA: <strong>invertir una cantidad fija en intervalos regulares</strong> (mensual o trimestral) independientemente del precio. Cuando el mercado cae, compras más participaciones con el mismo dinero. Cuando sube, tus participaciones valen más. El resultado estadístico a largo plazo siempre supera al market timing.'},
        ]
      },

      /* ── Quiz 2 ── */
      {type:'quiz',
        q:'¿Qué significa que un ETF sea "accumulating" (de acumulación)?',
        opts:[
          {t:'Que acumula más comisiones que uno distributing',               ok:false},
          {t:'Que reinvierte los dividendos automáticamente sin tributar',    ok:true},
          {t:'Que solo puedes comprar en acumulación, no vender',            ok:false},
          {t:'Que garantiza una acumulación mínima del 5% anual',           ok:false},
        ],
        ok:'¡Exacto! Un ETF accumulating reinvierte los dividendos automáticamente dentro del fondo, incrementando el precio por participación sin que tengas que tributar por el dividendo recibido. En Europa, esto ofrece una ventaja fiscal significativa frente a los ETF distributing (que pagan dividendo y generan un evento fiscal inmediato).',
        bad:'La respuesta correcta es que reinvierte los dividendos automáticamente sin tributar. Un ETF accumulating incrementa su NAV (precio) en lugar de pagar dividendos. Para el inversor europeo de largo plazo, esto es fiscalmente más eficiente porque difiere la tributación hasta la venta.',
      },

      /* ── Quiz 3 ── */
      {type:'quiz',
        q:'Según el SPIVA Report de S&P Global, ¿qué porcentaje de fondos activos de renta variable NO supera a su índice de referencia en un período de 15 años?',
        opts:[
          {t:'Aproximadamente el 50% — es un mercado justo',          ok:false},
          {t:'Aproximadamente el 65% — los buenos gestores sí superan', ok:false},
          {t:'Aproximadamente el 88% — la mayoría fracasa a largo plazo', ok:true},
          {t:'El 100% — ningún fondo supera nunca al mercado',          ok:false},
        ],
        ok:'¡Correcto! El SPIVA Report de S&P Global demuestra sistemáticamente que alrededor del 88% de los fondos activos de renta variable en EE.UU. no baten a su índice de referencia en períodos de 15 años. En Europa, la cifra es similar. Este dato, repetido durante más de 20 años de análisis, es la base empírica de la inversión indexada.',
        bad:'La respuesta correcta es aproximadamente el 88%. El SPIVA Report analiza miles de fondos activos globalmente desde 2002. La conclusión es sistemática: el 85-92% de los fondos activos no bate a su índice en períodos de 15+ años. Este es el argumento más sólido en favor de los ETF indexados.',
      },

      {type:'final', xp:22, msg:'¡Maestro de la arquitectura de cartera! Ya sabes construir riqueza de forma eficiente y con datos.'},
    ]
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 2 — Psicología del Inversor: El Cisne Negro y los Crashes
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:2, icon:'🧠', title:'Psicología del Inversor',
    desc:'Por qué tu cerebro es tu mayor enemigo en los mercados',
    xp:25, tag:'MENTALIDAD', tagC:'purple', users:'34.100',
    steps:[

      /* ── Lección 1: Biases y el inversor emocional ── */
      {type:'content', tag:'🧠 Módulo 3', title:'Tu Cerebro Contra Tu Cartera',
        intro:'El mayor destructor de riqueza en los mercados financieros no es la inflación, ni las comisiones, ni siquiera los crashes. Es el propio inversor. Dalbar Inc. publica cada año el estudio QAIB (Quantitative Analysis of Investor Behavior): mientras el S&P 500 rentó un 10,35% anual en los últimos 30 años, el inversor medio en fondos de renta variable obtuvo solo un 3,86%. La diferencia no es mala suerte — es psicología.',
        blocks:[
          {t:'text', h:'Los tres sesgos que más dinero cuestan',
            p:'<strong>1. Aversión a las pérdidas (Kahneman y Tversky):</strong> una pérdida de 100€ duele psicológicamente 2,5 veces más que el placer de ganar 100€. Por eso vendemos en pánico durante los crashes (cristalizando pérdidas) y aguantamos posiciones ganadoras menos de lo que deberíamos. <strong>2. Sesgo de recencia:</strong> sobreponderamos lo reciente. Tras un crash de -40%, creemos que el mercado seguirá cayendo eternamente. Tras una racha alcista, creemos que durará para siempre. <strong>3. Efecto manada (Herding):</strong> compramos cuando todos compran (máximos) y vendemos cuando todos venden (mínimos). El comportamiento exactamente contrario al óptimo.'},
          {t:'stats', items:[
            {v:'10,35%', l:'Rentabilidad anual S&P 500 últimos 30 años'},
            {v:'3,86%',  l:'Rentabilidad media del inversor en fondos (QAIB)'},
            {v:'6,49%',  l:'Rentabilidad destruida por el comportamiento emocional'},
          ]},
          {t:'hl', s:'warn', label:'⚠️ EL CISNE NEGRO: NASSIM TALEB',
            p:'En "El Cisne Negro" (2007), Nassim Nicholas Taleb describe los eventos de alto impacto, baja probabilidad e impredecibles que dominan la historia: la crisis del 2008, el COVID-19, el crash del 87. La lección de Taleb no es predecirlos — es imposible — sino diseñar una cartera que pueda sobrevivir a ellos. Regla de Taleb: <strong>"No puedes controlar lo que no puedes predecir. Solo puedes hacerte antifrágil."</strong>'},
          {t:'hl', s:'info', label:'💡 CÓMO CONSTRUIR ANTIFRAGILIDAD',
            p:'Una cartera antifrágil no intenta evitar los crashes — se beneficia de ellos. Herramientas: <strong>DCA durante los crashes</strong> (compras más participaciones baratas), <strong>rebalanceo sistemático</strong> (vendes lo que subió y compras lo que bajó), <strong>fondo de emergencia</strong> (no necesitas vender inversiones para cubrir gastos imprevistos), <strong>horizonte largo</strong> (el S&P 500 nunca ha tenido un período negativo de 20 años).'},
        ]
      },

      /* ── Quiz 1 ── */
      {type:'quiz',
        q:'Según el estudio QAIB de Dalbar, ¿cuál es la principal causa de que el inversor medio obtenga una rentabilidad un 6% inferior a la del S&P 500?',
        opts:[
          {t:'Paga demasiadas comisiones en fondos activos',                         ok:false},
          {t:'Compra y vende en los momentos equivocados por sesgos emocionales',    ok:true},
          {t:'Invierte en productos de bajo riesgo y baja rentabilidad',             ok:false},
          {t:'Los estudios QAIB no son representativos de inversores reales',        ok:false},
        ],
        ok:'¡Correcto! La principal causa es el comportamiento emocional: vender en los mínimos del mercado (pánico) y comprar en los máximos (euforia). El inversor medio entra y sale del mercado en los peores momentos posibles. Las comisiones contribuyen, pero el factor dominante es la psicología del inversor.',
        bad:'La causa principal es el comportamiento emocional, no las comisiones. El inversor promedio vende durante los crashes (realizando pérdidas permanentes) y re-entra cuando el mercado ya ha subido mucho (comprando caro). Esta danza emocional destruye más del 6% de rentabilidad anual.',
      },

      /* ── Lección 2: Reglas de disciplina del inversor ── */
      {type:'content', title:'Las Reglas de Disciplina que Separan a los Ricos',
        blocks:[
          {t:'text', h:'El inversor en pánico: un caso de estudio',
            p:'En marzo de 2009, el S&P 500 tocó fondo en 666 puntos. Era el peor momento de la crisis financiera global. Los titulares gritaban colapso, depresión, fin del capitalismo. El 40% de los inversores en fondos rescataron su dinero ese trimestre — el peor trimestre posible para salir. Quien mantuvo su posición vio cómo el mercado multiplicó por 7 en la siguiente década. Quien vendió en pánico cristalizó pérdidas permanentes y se perdió la mayor subida de la historia bursátil reciente.'},
          {t:'hl', s:'', label:'📜 LAS 5 REGLAS DEL INVERSOR DISCIPLINADO',
            p:'<strong>1. Escribe tu política de inversión</strong> antes de invertir: cuánto, cada cuándo, en qué. Síguela en pánico y en euforia. <strong>2. Desactiva las notificaciones</strong> de cotizaciones: el precio diario es ruido, no señal. <strong>3. Automatiza las aportaciones</strong> para eliminar la decisión emocional. <strong>4. Si sientes la urgencia de vender</strong>, espera 48 horas y relee tu política. <strong>5. Fondo de emergencia de 6 meses</strong>: la mejor protección psicológica es no necesitar el dinero invertido.'},
          {t:'text', h:'El papel del asesor financiero',
            p:'El estudio Vanguard Advisor Alpha estima que un asesor financiero de calidad puede añadir hasta un <strong>3% de rentabilidad anual</strong> — no por seleccionar mejores acciones, sino por evitar que el cliente cometa errores de comportamiento durante los crashes. El mayor valor del asesor no es técnico, es conductual: te convence de no vender en el peor momento. Si no tienes asesor, la automatización y la política escrita son tus mejores sustitutos.'},
        ]
      },

      /* ── Quiz 2 ── */
      {type:'quiz',
        q:'Nassim Taleb define la "antifragilidad" como:',
        opts:[
          {t:'La capacidad de resistir el impacto de los Cisnes Negros sin pérdidas', ok:false},
          {t:'La capacidad de beneficiarse del desorden y los eventos extremos imprevistos', ok:true},
          {t:'Una estrategia de cobertura con opciones y derivados financieros',     ok:false},
          {t:'La diversificación máxima en 50 o más activos diferentes',            ok:false},
        ],
        ok:'¡Exacto! Para Taleb, ser antifrágil va más allá de ser resistente. Resistente significa que el estrés no te daña. Antifrágil significa que el estrés te hace mejor. Una cartera antifrágil, por ejemplo mediante DCA y rebalanceo, no solo sobrevive los crashes — los aprovecha para comprar activos de calidad a precios de saldo.',
        bad:'La respuesta correcta es beneficiarse del desorden. Taleb distingue tres estados: frágil (se rompe con el estrés), robusto (resiste el estrés sin mejorar) y antifrágil (mejora con el estrés). El objetivo del inversor no es solo sobrevivir los crashes, sino diseñar un sistema que los aproveche.',
      },

      /* ── Quiz 3 ── */
      {type:'quiz',
        q:'Un inversor ve que su cartera ha caído un 30% durante un crash de mercado. ¿Cuál de estas acciones es la más racional y rentable a largo plazo?',
        opts:[
          {t:'Vender todo para evitar que la caída siga y reinvertir cuando "se estabilice"', ok:false},
          {t:'No hacer nada y esperar — el mercado siempre se ha recuperado históricamente',    ok:false},
          {t:'Mantener la cartera Y aumentar la aportación mensual — compra activos más baratos', ok:true},
          {t:'Diversificar hacia activos seguros como oro y bonos para reducir riesgo',         ok:false},
        ],
        ok:'¡Perfecto! Mantener + aumentar aportaciones durante el crash es la acción óptima. Los activos de calidad están en "oferta" al -30%. Cada euro invertido en el mínimo compra más participaciones que compraría en condiciones normales. Históricamente, los mejores rendimientos a 5 años se obtienen invirtiendo en los peores momentos de mercado.',
        bad:'La acción óptima es mantener Y aumentar aportaciones. Vender en el mínimo cristaliza pérdidas permanentes y te saca del mercado justo cuando va a subir. Solo mantener también funciona. Pero aumentar aportaciones en el crash es la estrategia con mayor retorno esperado: estás comprando activos de calidad con descuento del 30%.',
      },

      {type:'final', xp:25, msg:'¡Mentalidad de inversor élite! Tu mayor ventaja en el mercado es ahora la disciplina y el control emocional.'},
    ]
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 3 — El Ciclo de la Deuda: Ray Dalio
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:3, icon:'🔄', title:'El Ciclo de la Deuda',
    desc:'Los principios de Ray Dalio sobre deuda buena, mala y el ciclo económico',
    xp:23, tag:'ECONOMÍA', tagC:'orange', users:'26.700',
    steps:[

      /* ── Lección 1: La máquina económica ── */
      {type:'content', tag:'🔄 Módulo 4', title:'Cómo Funciona la Máquina Económica (Dalio)',
        intro:'Ray Dalio, fundador de Bridgewater Associates (el mayor hedge fund del mundo con 150.000M$), desarrolló un modelo para entender los ciclos económicos que revolucionó la forma de ver la macroeconomía. En su vídeo "How the Economic Machine Works" (30 millones de visitas), Dalio explica que la economía no es un misterio — funciona como una máquina simple con piezas predecibles. La deuda es el aceite de esa máquina: bien usada, crea prosperidad; mal usada, genera crisis.',
        blocks:[
          {t:'text', h:'Transacciones, crédito y ciclos',
            p:'Toda la economía global es la suma de millones de transacciones. Una transacción: alguien compra algo con dinero o crédito. El crédito es extraordinariamente poderoso porque permite gastar más de lo que tienes hoy — a cambio de pagar más en el futuro. Cuando el crédito fluye, la economía crece; cuando se contrae (los bancos dejan de prestar), la economía se desacelera. Dalio identifica dos ciclos de deuda: el <strong>ciclo de deuda a corto plazo</strong> (5-8 años, el ciclo económico clásico) y el <strong>ciclo de deuda a largo plazo</strong> (75-100 años), mucho más peligroso.'},
          {t:'stats', items:[
            {v:'5-8 años',   l:'Duración del ciclo de deuda corto (ciclo económico)'},
            {v:'75-100 años',l:'Duración del ciclo de deuda largo (el que origina grandes depresiones)'},
            {v:'2008',       l:'Año del pico del ciclo largo en EE.UU. (inicio del "desapalancamiento")'},
          ]},
          {t:'hl', s:'', label:'🔑 DEUDA BUENA vs DEUDA MALA',
            p:'Para Dalio, <strong>la deuda buena genera un rendimiento que supera su coste</strong>: hipoteca para un inmueble que se revaloriza, préstamo para un negocio con ROI superior al tipo de interés, deuda para formación con retorno salarial demostrado. <strong>La deuda mala financia consumo que no genera retorno</strong>: tarjeta de crédito para vacaciones, crédito al consumo para electrónica, préstamo para coche que se deprecia. La diferencia no está en el tipo de producto financiero, sino en si el activo financiado genera valor superior al coste de la deuda.'},
          {t:'hl', s:'warn', label:'⚠️ EL DESAPALANCAMIENTO: LA CRISIS EN CÁMARA LENTA',
            p:'Cuando la deuda crece más rápido que los ingresos durante décadas, llega el "momento Minsky": el sistema no puede permitirse más crédito. El desapalancamiento (deleveraging) que sigue es doloroso: consumidores ahorran en lugar de gastar, empresas despiden en lugar de contratar, bancos no prestan. La solución de Dalio: cuatro herramientas simultáneas — <strong>austeridad</strong> (reducir gastos), <strong>reestructuración de deuda</strong>, <strong>redistribución de riqueza</strong> (impuestos a ricos), <strong>monetización</strong> (banco central imprime dinero). El equilibrio entre ellas determina si el ajuste es suave o catastrófico.'},
        ]
      },

      /* ── Quiz 1 ── */
      {type:'quiz',
        q:'Según el modelo de Dalio, ¿cuál de estas situaciones representa deuda BUENA?',
        opts:[
          {t:'Préstamo personal al 9% para financiar unas vacaciones',                          ok:false},
          {t:'Tarjeta de crédito al 22% para comprar un smartphone de última generación',       ok:false},
          {t:'Hipoteca al 3% para comprar un piso en una ciudad con alta demanda de alquiler',  ok:true},
          {t:'Crédito al consumo al 12% para amortizar otra deuda existente',                   ok:false},
        ],
        ok:'¡Correcto! La hipoteca para un inmueble en ciudad con alta demanda es deuda buena si el rendimiento del alquiler (o la revalorización) supera el 3% anual de coste. El activo genera valor. Las otras opciones financian consumo que no genera retorno o incluso destruye valor (el smartphone pierde el 30% de valor al primer año).',
        bad:'La respuesta correcta es la hipoteca para un inmueble rentable. La deuda buena según Dalio financia activos que generan un retorno superior a su coste. Un piso en zona de alta demanda puede generar rentas de alquiler o revalorización del 4-6% anual frente a un coste hipotecario del 3%. El resto son deudas malas: financian consumo o depreciación.',
      },

      /* ── Lección 2: Gestionar la deuda personal con el método Avalanche ── */
      {type:'content', title:'Estrategias para Destruir la Deuda Mala',
        blocks:[
          {t:'text', h:'El método Avalanche: maximizar el ahorro matemático',
            p:'El método Avalanche (cascada de nieve) es matemáticamente óptimo para eliminar deudas. Regla: <strong>paga el mínimo en todas las deudas excepto en la de mayor tipo de interés, a la que dedicas todo el dinero extra</strong>. Cuando la pagas, pasa al siguiente tipo más alto. Ejemplo: tienes tarjeta (22% TAE, 2.000€), préstamo coche (9% TAE, 8.000€) e hipoteca (3% TAE, 120.000€). Con Avalanche, atacas primero la tarjeta. Cada mes que tardas en pagarla te cuesta el 22% anualizado — mucho más destructivo que el préstamo del coche aunque tenga más saldo.'},
          {t:'stats', items:[
            {v:'Avalanche', l:'Método óptimo matemáticamente (ahorra más intereses)'},
            {v:'Snowball',  l:'Método de Ramsey — más motivador (elimina deudas pequeñas primero)'},
            {v:'Avalanche', l:'Recomendado si toleras la espera; Snowball si necesitas victorias rápidas'},
          ]},
          {t:'hl', s:'info', label:'💡 ANTES DE INVERTIR: EL UMBRAL DEL TIPO DE INTERÉS',
            p:'Regla universal: <strong>si una deuda tiene un tipo de interés superior a la rentabilidad esperada de tus inversiones, elimina la deuda primero</strong>. La renta variable global rinde históricamente un 8-10% anual. Si tienes una tarjeta al 22%, pagar esa deuda es "invertir" al 22% garantizado — ninguna inversión en renta variable puede garantizar eso. El umbral suele estar en torno al 5-7%: deudas por encima, pagar primero; por debajo, invertir puede ser mejor estrategia.'},
        ]
      },

      /* ── Quiz 2 ── */
      {type:'quiz',
        q:'Tienes tres deudas: A) 3.000€ al 5% TAE, B) 1.500€ al 18% TAE, C) 10.000€ al 3% TAE. Con el método Avalanche y 300€ extra al mes para pagar deudas, ¿cuál atacas primero?',
        opts:[
          {t:'C, porque tiene el mayor saldo absoluto',              ok:false},
          {t:'B, porque tiene el mayor tipo de interés (18%)',       ok:true},
          {t:'A, porque tiene un saldo intermedio y tipo moderado',  ok:false},
          {t:'Las tres por igual, distribuyendo los 300€',           ok:false},
        ],
        ok:'¡Perfecto! Avalanche: siempre el mayor tipo primero, independientemente del saldo. La deuda B al 18% TAE destruye patrimonio el doble de rápido que la A al 5%, y seis veces más rápido que la C al 3%. Con Avalanche: mínimo en A y C, los 300€ extra + mínimos liberados atacan B. En 5-6 meses, B desaparece y esos 300€ van a A.',
        bad:'La respuesta correcta es B (18% TAE), la de mayor interés. El método Avalanche ignora el saldo y se fija exclusivamente en el tipo. La deuda al 18% es la que más patrimonio destruye por euro pendiente. Atacarla primero maximiza el ahorro total de intereses pagados durante todo el proceso de desapalancamiento.',
      },

      /* ── Quiz 3 ── */
      {type:'quiz',
        q:'En el ciclo de deuda a largo plazo de Dalio, cuando llega el "desapalancamiento" (deleveraging), ¿cuál es el resultado macroeconómico inmediato?',
        opts:[
          {t:'Inflación desbocada porque el banco central imprime dinero',                      ok:false},
          {t:'Crecimiento acelerado porque se elimina la deuda improductiva',                  ok:false},
          {t:'Contracción económica: menos gasto, menos empleo, menos crédito simultáneamente', ok:true},
          {t:'Estabilización natural sin intervención — el mercado se ajusta solo',             ok:false},
        ],
        ok:'¡Correcto! El desapalancamiento genera una espiral contractiva: los deudores reducen gastos para pagar deuda → las empresas facturan menos → despidos → menos ingresos → más dificultades para pagar deuda → los bancos restringen crédito → más contracción. Es la "depresión" de Dalio. La solución requiere intervención coordinada: austeridad + reestructuración + redistribución + monetización equilibradas.',
        bad:'La respuesta correcta es contracción económica simultánea en todos los frentes. El desapalancamiento dispara un círculo vicioso: todos intentan gastar menos y ahorrar al mismo tiempo (paradoja del ahorro de Keynes). Resultado: menos demanda, menos empleo, más impagos, crédito más restringido. No se auto-corrige sin intervención de política fiscal y monetaria.',
      },

      {type:'final', xp:23, msg:'¡Entiendes la máquina económica! Ahora ves los ciclos donde otros solo ven caos.'},
    ]
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 4 — Sistema Fiscal e Inflación: La Defensa del Patrimonio
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:4, icon:'🛡️', title:'Fiscalidad e Inflación',
    desc:'Protege el poder adquisitivo y paga solo lo que la ley te obliga',
    xp:24, tag:'AVANZADO', tagC:'purple', users:'19.200',
    steps:[

      /* ── Lección 1: El impuesto invisible y la base del ahorro ── */
      {type:'content', tag:'🛡️ Módulo 5', title:'El Impuesto Invisible y Cómo Tributas en España',
        intro:'Existen dos formas silenciosas de empobrecer a los inversores: la inflación, que erosiona el poder adquisitivo de tu dinero, y los impuestos sobre las inversiones, que te cobran sobre ganancias que en parte son solo el reflejo de esa inflación. Entender ambos mecanismos — y las estrategias legales para mitigarlos — es la diferencia entre un patrimonio que crece de verdad y uno que solo lo parece.',
        blocks:[
          {t:'text', h:'La inflación: el impuesto que nadie vota',
            p:'La inflación mide la pérdida de poder adquisitivo de la moneda. Si la inflación es del 3% anual y tu cuenta corriente te da el 0%, en realidad estás perdiendo un 3% de poder adquisitivo cada año. En 10 años, 10.000€ en cuenta corriente solo comprarán lo que hoy compras con <strong>7.374€</strong>. La fórmula de rentabilidad real es: <strong>Rentabilidad real ≈ Rentabilidad nominal − Inflación</strong>. Si tu fondo rinde el 8% y la inflación es del 3%, tu ganancia real es del 5% — es decir, solo el 5% aumenta tu poder adquisitivo genuinamente.'},
          {t:'formula', f:'Rentabilidad Real = Rentabilidad Nominal − Inflación',
            l:'Ejemplo: fondo al 8% − inflación 3% = rentabilidad real 5% · Ajuste exacto: (1+0,08)/(1+0,03)−1 = 4,85%'},
          {t:'stats', items:[
            {v:'3,5%',  l:'Inflación media España 1994-2024 (30 años)'},
            {v:'€7.374', l:'Valor real de 10.000€ en cuenta corriente (10 años al 3%)'},
            {v:'S&P500', l:'Ha superado la inflación en el 100% de los períodos de 20 años'},
          ]},
          {t:'hl', s:'', label:'📊 BASE DEL AHORRO: CÓMO TRIBUTAN TUS INVERSIONES EN ESPAÑA',
            p:'Las ganancias de capital y dividendos tributan en la <strong>Base Imponible del Ahorro</strong> (IRPF 2024): hasta 6.000€ → 19%, de 6.000€ a 50.000€ → 21%, de 50.000€ a 200.000€ → 23%, más de 200.000€ → 28%. El dato fundamental: <strong>no tributas mientras no vendes</strong>. Mientras mantienes el ETF, el interés compuesto crece sin que Hacienda corte su parte.'},
          {t:'hl', s:'info', label:'💡 ESTRATEGIA: DIFERIMIENTO FISCAL',
            p:'Si tienes ETFs accumulating (acumulación), los dividendos se reinvierten automáticamente sin generar evento fiscal. Solo tributas cuando vendes. Si mantienes 20 años sin vender, el 100% del interés compuesto trabaja para ti sin interrupciones fiscales. Al vender, pagas sobre la ganancia total — pero esa ganancia es mucho mayor que si hubieras tributado cada año por los dividendos distribuidos.'},
        ]
      },

      /* ── Quiz 1 ── */
      {type:'quiz',
        q:'Tienes una ganancia realizada de 12.000€ en la venta de un ETF y una pérdida realizada de 3.000€ en la venta de unas acciones. ¿Cuánto pagas en concepto de IRPF (base del ahorro) en España en 2024?',
        opts:[
          {t:'Sobre 12.000€: 19% hasta 6.000€ y 21% sobre los 6.000€ restantes = 2.400€',   ok:false},
          {t:'Sobre 9.000€: 19% hasta 6.000€ = 1.140€ + 21% sobre 3.000€ = 630€ = 1.770€', ok:true},
          {t:'Solo sobre la ganancia mayor: 12.000€ × 19% = 2.280€',                         ok:false},
          {t:'Nada, porque las pérdidas compensan y el neto es menor a 6.000€ más un tramo', ok:false},
        ],
        ok:'¡Correcto! Puedes compensar pérdidas y ganancias dentro de la Base del Ahorro: 12.000 − 3.000 = 9.000€ de ganancia neta. Sobre 9.000€: primero los 6.000€ al 19% = 1.140€, luego los 3.000€ restantes al 21% = 630€. Total: 1.770€. Sin compensación habrías pagado 2.400€. La diferencia de 630€ es puro ahorro fiscal legal.',
        bad:'La respuesta correcta es 1.770€. Las pérdidas realizadas compensan las ganancias en la Base del Ahorro: 12.000 − 3.000 = 9.000€ netos. Tributación: 6.000€ × 19% = 1.140€ + 3.000€ × 21% = 630€. Total: 1.770€. Si no huberas compensado, pagarías 2.400€. La compensación de minusvalías con plusvalías es una de las optimizaciones fiscales más accesibles.',
      },

      /* ── Lección 2: Coberturas contra inflación ── */
      {type:'content', title:'Cómo Proteger Tu Patrimonio de la Inflación',
        blocks:[
          {t:'text', h:'Los mejores activos anti-inflación históricamente',
            p:'No todos los activos responden igual a la inflación. La renta fija a largo plazo (bonos soberanos) es el peor activo en períodos inflacionarios: su cupón fijo pierde poder adquisitivo año a año. Por el contrario, la <strong>renta variable (ETFs de acciones)</strong> protege contra la inflación a largo plazo porque las empresas trasladan la inflación a sus precios y márgenes. Los <strong>REITs</strong> (Real Estate Investment Trusts) también protegen porque los alquileres suben con la inflación. El <strong>oro</strong> tiene historial mixto: protege en períodos de hiperinflación o crisis sistémica, pero no en inflaciones moderadas.'},
          {t:'hl', s:'', label:'🏅 TABLA DE PROTECCIÓN ANTI-INFLACIÓN',
            p:'<strong>Renta variable (ETFs globales)</strong> ⭐⭐⭐⭐⭐ — supera inflación en 100% períodos 20 años | <strong>REITs</strong> ⭐⭐⭐⭐ — alquileres indexados | <strong>TIPS/bonos indexados</strong> ⭐⭐⭐ — protección directa pero rentabilidad baja | <strong>Oro</strong> ⭐⭐ — bueno en crisis, irregular en inflación moderada | <strong>Cuenta corriente/depósito</strong> ⭐ — destrucción de poder adquisitivo garantizada.'},
          {t:'text', h:'Plan de pensiones vs fondo de inversión: la decisión fiscal',
            p:'Los planes de pensiones reducen la Base General del IRPF (hasta 1.500€ en 2024): si tributas al marginal del 40%, cada 1.500€ aportados te devuelven 600€ en la declaración. El truco: al rescatar el plan en jubilación, tributan en la Base General — si tu pensión pública es baja, puede ser ventajoso. Los fondos de inversión no tienen deducción inmediata, pero permiten traspasos sin tributar (de fondo a fondo), diferimiento fiscal ilimitado y más liquidez. La elección óptima depende de tu tipo marginal actual vs el esperado en jubilación.'},
        ]
      },

      /* ── Quiz 2 ── */
      {type:'quiz',
        q:'Tu fondo de inversión rinde un 9% anual nominal. La inflación del año es del 4%. ¿Cuál es tu rentabilidad real aproximada?',
        opts:[
          {t:'13% — la rentabilidad se suma a la inflación',            ok:false},
          {t:'5% — restando inflación a rentabilidad nominal',          ok:true},
          {t:'9% — la inflación no afecta a la rentabilidad del fondo', ok:false},
          {t:'4% — la inflación absorbe la mitad de la rentabilidad',   ok:false},
        ],
        ok:'¡Correcto! Rentabilidad real ≈ 9% − 4% = 5%. (El cálculo exacto es (1,09)/(1,04) − 1 = 4,81%, pero la aproximación lineal es suficiente para la toma de decisiones.) Solo ese 5% aumenta tu poder adquisitivo real. El otro 4% solo compensa la erosión monetaria. Esta distinción es fundamental para evaluar inversiones en distintos entornos inflacionarios.',
        bad:'La respuesta correcta es aproximadamente el 5%. Rentabilidad real ≈ Rentabilidad nominal − Inflación = 9% − 4% = 5%. El cálculo exacto es (1,09)/(1,04)−1 = 4,81%. Solo ese 5% representa ganancia de poder adquisitivo genuina. El 4% restante simplemente compensa la depreciación del euro. En períodos de alta inflación, muchas inversiones "rentables" son en realidad pérdidas reales.',
      },

      /* ── Quiz 3 ── */
      {type:'quiz',
        q:'¿Cuál es la principal ventaja fiscal de los ETF de acumulación (accumulating) frente a los ETF de distribución (distributing) para un inversor español de largo plazo?',
        opts:[
          {t:'Están exentos de tributar en la declaración de la renta',                    ok:false},
          {t:'No generan evento fiscal al reinvertir dividendos — tributan solo al vender', ok:true},
          {t:'Pagan dividendos superiores que los de distribución',                        ok:false},
          {t:'No tienen TER porque son gestionados por el Estado',                         ok:false},
        ],
        ok:'¡Perfecto! Un ETF accumulating reinvierte los dividendos dentro del fondo sin distribuirlos. Para el inversor, esto significa que no hay un ingreso de dividendo que declarar cada año: no hay evento fiscal. Solo se tributa al vender el ETF, sobre la ganancia total acumulada. Esto permite que el 100% del interés compuesto (incluida la parte de dividendos) trabaje sin interrupciones durante toda la vida de la inversión.',
        bad:'La respuesta correcta es que no generan evento fiscal al reinvertir. Un ETF distributing paga dividendo → el inversor tributa ese año (19-28% sobre el dividendo). Un ETF accumulating reinvierte internamente ese dividendo → no hay tributación hasta la venta. El diferimiento fiscal permite que el compuesto actúe sobre el 100% del capital, incluyendo los impuestos que en el distributing ya habrías pagado.',
      },

      {type:'final', xp:24, msg:'¡Maestro de la defensa patrimonial! Ahora proteges tu dinero del impuesto invisible y del fisco con estrategia.'},
    ]
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 5 — RETO FINAL: Examen del Maestro Financiero
     (Se desbloquea al completar los módulos 0-4)
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:5, icon:'🏆', title:'Reto Final: Maestro Financiero',
    desc:'10 preguntas aleatorias de todo el curso — desbloquea tu título',
    xp:40, tag:'RETO FINAL', tagC:'gold', users:'4.100',
    isFinalExam: true,
    steps:[
      {type:'final_exam_intro'},
      {type:'final', xp:40, msg:'¡MAESTRO FINANCIERO CERTIFICADO! Has superado el examen con conocimiento real. Tu título está desbloqueado.'},
    ]
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 6 — Psicología del Gasto: Tu Peor Enemigo Eres Tú
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:6, icon:'🧠', title:'Psicología del Gasto',
    desc:'Los sesgos cognitivos que vacían tu cuenta bancaria',
    xp:22, tag:'PSICOLOGÍA', tagC:'purple', users:'28.700',
    steps:[
      {type:'content', tag:'🧠 Módulo 6', title:'Por Qué Gastamos Más de lo que Planeamos',
        intro:'Tu cerebro no evolucionó para gestionar dinero. Evolucionó para sobrevivir en la sabana africana. El resultado: tomamos decisiones financieras con hardware del paleolítico en un mundo del siglo XXI. La neurociencia del gasto explica por qué incluso personas muy inteligentes quiebran, se endeudan o nunca logran ahorrar.',
        blocks:[
          {t:'text', h:'El sesgo del presente (Present Bias)',
            p:'Tu cerebro valora una recompensa inmediata de 50€ MÁS que una recompensa futura de 100€ en 6 meses. Esto no es irracionalidad: es biología. Las resonancias magnéticas muestran que pensar en recompensas inmediatas activa el sistema límbico (emocional), mientras que el futuro activa la corteza prefrontal (racional). Cuando compras por impulso, literalmente, el cerebro emocional ha ganado al racional.'},
          {t:'stats', items:[
            {v:'68%', l:'Compradores impulsivos confiesan remordimiento posterior'},
            {v:'×2.5', l:'Valoramos pérdidas vs ganancias del mismo tamaño (Kahneman)'},
            {v:'21€', l:'Gasto impulsivo medio por transacción en España (2023)'},
          ]},
          {t:'text', h:'El Efecto de Anclaje: por qué el precio "antes" funciona',
            p:'Ves un abrigo rebajado de 400€ a 200€ y piensas que has "ahorrado" 200€. El minorista fijó el precio "original" de 400€ solo para que 200€ parezca una ganga. Este anclaje cognitivo hace que el punto de comparación sea arbitrario, no el valor real del producto. Solución: pregúntate siempre "¿lo compraría si no hubiera precio original?"'},
          {t:'hl', s:'warn', label:'⚠️ LA TRAMPA DEL CAFÉ DE 3€',
            p:'No es el café. Es el hábito invisible. 3€/día × 365 = <strong>1.095€/año</strong>. Ese dinero invertido al 8% durante 20 años = <strong>5.400€</strong>. Aún así, eliminar el café no resolverá tus finanzas: los "gastos grandes e infrecuentes" (vacaciones, reparaciones, coches) son los verdaderos culpables del 80% de los desequilibrios presupuestarios.'},
          {t:'text', h:'El dinero de plástico: el gran anestesiante del dolor',
            p:'Los estudios del MIT demuestran que la gente gasta hasta un <strong>83% más</strong> cuando paga con tarjeta vs efectivo. El dolor físico de entregar billetes activa respuestas neurológicas reales. Las apps de pago y las tarjetas de crédito eliminan ese fricción deliberadamente. Truco práctico: antes de una compra grande, imagina que sacas los billetes en metálico. ¿Aún la harías?'},
        ]
      },
      {type:'quiz',
        q:'Según la economía conductual, ¿cuánto más valoramos las pérdidas que las ganancias del mismo importe?',
        opts:[
          {t:'Lo mismo — 1:1',                              ok:false},
          {t:'El doble — 2:1 (Prospect Theory, Kahneman)',  ok:false},
          {t:'2,5 veces más — la pérdida duele más',        ok:true},
          {t:'5 veces más — la aversión es extrema',        ok:false},
        ],
        ok:'¡Correcto! Daniel Kahneman y Amos Tversky demostraron en la Prospect Theory que las pérdidas pesan ~2,5 veces más que las ganancias equivalentes. Por eso el "evitar perder" nos paraliza más que el "deseo de ganar".',
        bad:'La respuesta es 2,5 veces. La Prospect Theory (Kahneman, Nobel 2002) establece que perder 100€ duele como no ganar 250€. Esta asimetría explica muchos errores financieros: mantener inversiones en pérdidas, no vender activos perdedores, etc.',
      },
      {type:'content', title:'Herramientas Cognitivas Para Gastar Mejor',
        blocks:[
          {t:'text', h:'La regla de las 48 horas',
            p:'Para cualquier compra no planificada superior a 50€: espera 48 horas. Los estudios muestran que el 73% de las compras impulsivas son abandonadas tras este período. No es abstinencia, es dar tiempo al cortex prefrontal a recuperar el control sobre el sistema límbico.'},
          {t:'text', h:'El coste en horas de trabajo',
            p:'Transforma cualquier precio en horas de tu vida. Si cobras 15€/hora neta y quieres comprarte unas zapatillas de 150€: son 10 horas de tu vida. ¿Merece este producto 10 horas de tu tiempo? Este reencuadre mental reduce compras impulsivas de forma dramática.'},
          {t:'hl', s:'info', label:'💡 SISTEMA PRÁCTICO: EL SOBRE DE EFECTIVO',
            p:'Dave Ramsey popularizó los "cash envelopes": distribuye tu presupuesto mensual en sobres físicos (ocio, comida, ropa). Cuando el sobre está vacío, ese gasto se detiene. La fricción del efectivo físico reduce el gasto en esa categoría en un 15-20% según estudios de comportamiento financiero.'},
        ]
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 7 — ETFs y Fondos Indexados: Invierte Como Los Mejores
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:7, icon:'📊', title:'ETFs y Fondos Indexados',
    desc:'La estrategia que el 92% de los fondos activos no puede superar',
    xp:28, tag:'INVERSIÓN', tagC:'blue', users:'35.200',
    steps:[
      {type:'content', tag:'📊 Módulo 7', title:'La Estrategia de Inversión Más Validada de la Historia',
        intro:'En 2008, Warren Buffett apostó 1 millón de dólares a que ningún hedge fund podría superar al índice S&P 500 en 10 años. Ganó. Los fondos activos de élite, con equipos de analistas de Harvard y supercomputadoras, perdieron frente a un fondo indexado simple que cobra 0,03% anual. Esta es la historia detrás de la mayor revolución de inversión del siglo XX.',
        blocks:[
          {t:'text', h:'¿Qué es un ETF (Exchange-Traded Fund)?',
            p:'Un ETF es un fondo de inversión que cotiza en bolsa como una acción. Cuando compras 1 participación del ETF "Vanguard Total World" (VT) por 100€, estás comprando una fracción de <strong>9.000 empresas en 50 países</strong> simultáneamente. Es la diversificación máxima con un solo clic. A diferencia de los fondos tradicionales, puedes comprarlo y venderlo en tiempo real durante el horario de bolsa.'},
          {t:'formula', f:'Rentabilidad real = Rentabilidad bruta − TER − Inflación', l:'TER = Total Expense Ratio (comisión anual del fondo)'},
          {t:'stats', items:[
            {v:'0,03%', l:'TER de Vanguard S&P500 ETF (VOO) — casi gratis'},
            {v:'1,5%',  l:'TER medio de fondos activos en España'},
            {v:'47.000€', l:'Diferencia a 30 años entre ambas comisiones sobre 100k€ invertidos'},
          ]},
          {t:'text', h:'El impacto devastador de las comisiones',
            p:'Inviertes 100.000€ al 8% bruto durante 30 años. Con un ETF al 0,03%: <strong>992.000€</strong>. Con un fondo activo al 1,5%: <strong>654.000€</strong>. La diferencia de 1,47 puntos porcentuales en comisiones destruye <strong>338.000€</strong> de tu patrimonio. John Bogle (fundador de Vanguard) lo llamó "la tiranía del interés compuesto invertida".'},
          {t:'hl', s:'info', label:'📈 LOS 3 ETFs QUE CUBREN EL MUNDO ENTERO',
            p:'<strong>1. Vanguard FTSE All-World (VWCE):</strong> 3.700 empresas, 50 países, TER 0,22%. El más popular entre inversores europeos.<br><strong>2. iShares Core S&P 500 (CSPX):</strong> 500 mayores empresas USA, TER 0,07%. Referencia histórica.<br><strong>3. Xtrackers MSCI Emerging Markets (XMME):</strong> Mercados emergentes (China, India, Brasil), TER 0,18%. Complemento de diversificación.'},
        ]
      },
      {type:'quiz',
        q:'Inviertes 100.000€ al 8% durante 30 años. Un fondo indexado cobra 0,03% TER; un fondo activo cobra 1,5% TER. ¿Cuánta diferencia hay en el resultado final?',
        opts:[
          {t:'Apenas 5.000€ — la diferencia es mínima',   ok:false},
          {t:'Unos 50.000€ — significativa pero asumible', ok:false},
          {t:'Más de 330.000€ — el coste real del 1,47%', ok:true},
          {t:'Más de 500.000€ — los fondos activos son peores', ok:false},
        ],
        ok:'¡Exacto! La diferencia es ~338.000€. Este es el "precio oculto" de las comisiones: parecen insignificantes (1,47%) pero a través del interés compuesto destruyen un tercio de tu patrimonio final. Bogle lo llamó el mayor escándalo del sector financiero.',
        bad:'La diferencia correcta es ~338.000€. El 1,47% de diferencia en comisiones, multiplicado por 30 años de interés compuesto, destruye una tercera parte del patrimonio final. Esta es la razón por la que la gestión indexada de bajo coste ha ganado la guerra contra los fondos activos.',
      },
      {type:'content', title:'Cómo Construir Tu Primera Cartera Indexada',
        blocks:[
          {t:'text', h:'El portafolio "Lazy Portfolio" clásico',
            p:'La cartera más simple y probada del mundo: <strong>80% VWCE (acciones globales) + 20% iShares Global Aggregate Bond (AGGG)</strong>. Esta asignación 80/20 entre acciones y bonos ha generado una rentabilidad media del 7,2% anual en los últimos 30 años con una volatilidad controlada. El 20% en bonos amortigua las caídas de mercado.'},
          {t:'text', h:'Dónde comprar ETFs en España',
            p:'Los tres brokers más recomendados para inversores españoles: <strong>DeGiro</strong> (muy bajas comisiones, +12M usuarios), <strong>Interactive Brokers</strong> (profesional, ideal desde 50k€), y <strong>MyInvestor</strong> (banco español, acceso a fondos indexados sin comisión de compra). Evita los bancos tradicionales: sus ETFs propios suelen tener TER superiores al 1%.'},
          {t:'hl', s:'', label:'💡 ESTRATEGIA: DOLLAR COST AVERAGING (DCA)',
            p:'No intentes "timing" del mercado. Invierte una cantidad fija cada mes (p.ej. 300€) independientemente de si el mercado sube o baja. Cuando baja, compras más participaciones baratas. Cuando sube, tus participaciones valen más. En 15 años, el DCA genera resultados superiores al 80% de las estrategias activas en backtesting histórico.'},
        ]
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 8 — Criptomonedas: Fundamentos Sin Ruido
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:8, icon:'₿', title:'Criptomonedas: Fundamentos',
    desc:'Entiende la blockchain sin el hype ni el miedo irracional',
    xp:24, tag:'CRYPTO', tagC:'orange', users:'22.100',
    steps:[
      {type:'content', tag:'₿ Módulo 8', title:'Bitcoin, Blockchain y el Sistema Financiero del Futuro',
        intro:'Las criptomonedas son el activo más volátil, más controvertido y menos comprendido de la historia financiera moderna. En 2020, Bitcoin valía 5.000$. En 2021 llegó a 68.000$. En 2022 cayó a 16.000$. En 2024 superó de nuevo los 100.000$. Antes de invertir un solo euro, necesitas entender QUÉ es, POR QUÉ existe y cuáles son sus riesgos REALES.',
        blocks:[
          {t:'text', h:'¿Qué es la Blockchain?',
            p:'Una blockchain es una base de datos descentralizada y pública donde cada transacción queda registrada en un "bloque" que se encadena al anterior, formando un historial inmutable. No hay banco central ni autoridad que pueda alterar el registro. En Bitcoin, este historial es validado por millones de ordenadores simultáneamente: para falsificar una transacción, necesitarías controlar más del 51% de toda la red.'},
          {t:'stats', items:[
            {v:'21M', l:'Límite máximo de Bitcoin que existirán jamás (deflacionario)'},
            {v:'2140', l:'Año estimado en que se minará el último Bitcoin'},
            {v:'~105', l:'Países que han reconocido alguna forma de activo cripto (2024)'},
          ]},
          {t:'text', h:'Bitcoin vs Ethereum: dos filosofías distintas',
            p:'<strong>Bitcoin (BTC)</strong> es "oro digital": reserva de valor, suministro fijo, sin programabilidad compleja. Es la cripto más conservadora y la más aceptada institucionalmente (ETFs de Bitcoin aprobados por la SEC en EE.UU. en 2024). <strong>Ethereum (ETH)</strong> es una plataforma de contratos inteligentes: permite crear aplicaciones decentralizadas (DeFi, NFTs, DAOs). Mayor potencial de innovación, mayor complejidad y riesgo.'},
          {t:'hl', s:'warn', label:'⚠️ REGLA DE ORO: SOLO INVIERTES LO QUE PUEDES PERDER',
            p:'El regulador europeo (ESMA) y la CNMV española exigen que los intermediarios adviertan: las criptomonedas pueden perder el 100% de su valor. Esto ha ocurrido con Terra/LUNA (−99% en 72 horas, Mayo 2022), FTX (quiebra fraudulenta, 2022), y cientos de proyectos menores. La recomendación de los planificadores financieros es: máximo 5-10% de la cartera en cripto, y solo en BTC/ETH.'},
        ]
      },
      {type:'quiz',
        q:'¿Cuál es el límite máximo de Bitcoin que jamás podrá existir, garantizando su carácter deflacionario?',
        opts:[
          {t:'100 millones de BTC',    ok:false},
          {t:'21 millones de BTC',     ok:true},
          {t:'1 millón de BTC',        ok:false},
          {t:'No hay límite — es infinito', ok:false},
        ],
        ok:'¡Correcto! Solo existirán 21 millones de Bitcoin. Este límite está escrito en el código original de Satoshi Nakamoto y es inmutable. Es la característica que más diferencia a Bitcoin del dinero fiat, que los gobiernos pueden imprimir ilimitadamente.',
        bad:'El límite es 21 millones de BTC. Esta escasez programada es la base del argumento "oro digital": al contrario que los euros o dólares, ningún gobierno puede devaluar Bitcoin emitiendo más. El último Bitcoin se minará aproximadamente en el año 2140.',
      },
      {type:'content', title:'Cómo Acceder a Criptomonedas de Forma Segura',
        blocks:[
          {t:'text', h:'Exchanges regulados vs Wallets propios',
            p:'Para empezar: <strong>exchanges regulados</strong> como Coinbase, Kraken o Bitstamp (todos con licencia en España). Son el equivalente a un bróker de bolsa: custodian tus criptos. El riesgo: si el exchange quiebra (como FTX), puedes perder tu dinero. Solución avanzada: <strong>hardware wallet</strong> (Ledger, Trezor) — un dispositivo físico donde solo tú tienes las claves. "Not your keys, not your coins."'},
          {t:'hl', s:'info', label:'💡 ESTRATEGIA PARA PRINCIPIANTES: BITCOIN + DCA',
            p:'La estrategia más conservadora en cripto: comprar exclusivamente Bitcoin (el activo más maduro y regulado) mediante DCA mensual de una cantidad pequeña (50-100€/mes), mantenerlo a largo plazo sin mirar el precio a diario, y no superar el 5-10% de tu patrimonio total. Esta estrategia evita el FOMO, los altcoins especulativos y las pérdidas por panic-selling.'},
          {t:'text', h:'Fiscalidad de las criptomonedas en España',
            p:'La AEAT considera las criptomonedas como activos patrimoniales. Las ganancias tributan como <strong>ganancias patrimoniales en el IRPF</strong>: 19% hasta 6.000€, 21% entre 6.000-50.000€, 23% entre 50.000-200.000€ y 27% a partir de 200.000€. Cada intercambio (BTC→ETH, no solo venta a euros) es un hecho imponible. Mantener un registro exhaustivo de todas las operaciones es obligatorio.'},
        ]
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 9 — Optimización Fiscal: Paga Solo lo que Debes
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:9, icon:'📋', title:'Optimización Fiscal (España)',
    desc:'Estrategias legales para reducir tu factura con Hacienda',
    xp:26, tag:'FISCALIDAD', tagC:'green', users:'19.800',
    steps:[
      {type:'content', tag:'📋 Módulo 9', title:'Cómo Pagar Menos Impuestos de Forma Legal',
        intro:'La diferencia entre "evasión fiscal" (ilegal) y "optimización fiscal" (completamente legal) es enorme. Apple, Google, Jeff Bezos y la mayor parte de los ricos no evaden impuestos: optimizan. Usan las herramientas que el propio sistema fiscal pone a disposición de cualquier ciudadano. Y muchas de esas herramientas están también disponibles para ti.',
        blocks:[
          {t:'text', h:'IRPF: La estructura que debes conocer',
            p:'España tiene un IRPF progresivo con dos grandes bases: la <strong>base general</strong> (trabajo, alquiler, actividades económicas) y la <strong>base del ahorro</strong> (dividendos, intereses, plusvalías de inversiones). La base del ahorro tributa al 19-27%: más favorable que la base general, que puede llegar al 47% en rentas altas. Entender dónde tributa cada euro es la clave de la optimización.'},
          {t:'stats', items:[
            {v:'8.000€', l:'Aportación máxima deducible a plan de pensiones (2024)'},
            {v:'19-27%', l:'Tramos del ahorro (dividendos e inversiones)'},
            {v:'5.550€', l:'Mínimo personal exento para contribuyentes individuales'},
          ]},
          {t:'text', h:'Planes de Pensiones: deducción garantizada al tipo marginal',
            p:'Cada euro que aportas a un plan de pensiones <strong>se deduce directamente de tu base imponible</strong> al tipo marginal más alto que pagues. Si tu tipo marginal es el 37%, aportar 8.000€ al plan te ahorra 2.960€ en impuestos este año. Eso es rentabilidad garantizada e inmediata antes de cualquier ganancia del plan. Limitación: el dinero queda bloqueado hasta jubilación (con algunas excepciones: ERTE, paro de larga duración, enfermedad grave).'},
          {t:'hl', s:'info', label:'💡 ESTRATEGIA: COMPENSACIÓN DE PÉRDIDAS Y GANANCIAS',
            p:'Si en 2024 tienes plusvalías de 5.000€ en fondos ETF, pero también tienes acciones con minusvalías latentes de 3.000€, puedes vender las acciones perdedoras antes del 31 de diciembre para <strong>compensar</strong> 3.000€ de las ganancias. Solo tributarás sobre 2.000€. Puedes recomprar las mismas acciones 2 meses después. Esta técnica (loss harvesting) es 100% legal y puede ahorrarte cientos de euros cada año.'},
        ]
      },
      {type:'quiz',
        q:'Tu tipo marginal del IRPF es el 37%. Aportas el máximo al plan de pensiones (8.000€). ¿Cuánto te ahorras en impuestos este año?',
        opts:[
          {t:'800€ (el 10% de la aportación)',      ok:false},
          {t:'1.520€ (el 19%, tramo mínimo)',        ok:false},
          {t:'2.960€ (el 37%, tu tipo marginal)',    ok:true},
          {t:'3.760€ (el 47%, tipo máximo)',         ok:false},
        ],
        ok:'¡Correcto! La deducción es a tu tipo MARGINAL: 8.000€ × 37% = 2.960€ de ahorro fiscal garantizado este año. Es como el Estado te devuelve 2.960€ por ahorrar para tu jubilación.',
        bad:'La respuesta es 2.960€. La aportación al plan de pensiones se deduce al tipo MARGINAL (el más alto que aplica a tu último euro de renta). Con tipo marginal del 37%: 8.000 × 0,37 = 2.960€ de ahorro inmediato. Es rentabilidad asegurada antes de cualquier rendimiento del plan.',
      },
      {type:'content', title:'Otras Deducciones que No Puedes Ignorar',
        blocks:[
          {t:'text', h:'Deducción por vivienda habitual (régimen transitorio)',
            p:'Si compraste tu vivienda antes del 1 de enero de 2013, sigues teniendo derecho a deducirte el 15% de lo pagado (hipoteca + gastos) con un máximo de 9.040€/año base, lo que supone hasta 1.356€ de ahorro fiscal anual. Este régimen transitorio se mantiene indefinidamente para quien lo tenga. Si compartes vivienda con pareja, ambos podéis aplicarlo por separado.'},
          {t:'text', h:'Planes de Ahorro 5 (PIAS) y Seguros de Ahorro',
            p:'Los <strong>PIAS (Planes Individuales de Ahorro Sistemático)</strong> permiten acumular hasta 240.000€ con exención fiscal total de los rendimientos si se cobran como renta vitalicia y se ha mantenido más de 5 años. Los rendimientos tributan solo al 1,44% efectivo (el 8% sobre el 24% de la renta). Para quienes buscan alternativa a los planes de pensiones sin bloqueo del capital.'},
          {t:'hl', s:'warn', label:'⚠️ MODELO 720: OBLIGATORIO SI TIENES ACTIVOS EN EL EXTERIOR',
            p:'Si tienes cuentas, valores o inmuebles en el extranjero que superen 50.000€, estás obligado a declararlo en el Modelo 720 (antes del 31 de marzo de cada año). Las sanciones por no hacerlo son de entre 10.000€ y 30.000€ más la sanción por la ganancia no declarada. Los brokers extranjeros como DeGiro o Interactive Brokers no exigen M720 por las propias inversiones, pero sí los saldos en cuenta.'},
        ]
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 10 — Alquiler vs Compra: El Debate Definitivo
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:10, icon:'🏠', title:'Alquiler vs. Compra de Vivienda',
    desc:'El análisis financiero que nadie te ha explicado antes',
    xp:25, tag:'VIVIENDA', tagC:'blue', users:'31.400',
    steps:[
      {type:'content', tag:'🏠 Módulo 10', title:'La Decisión Financiera Más Grande de Tu Vida',
        intro:'En España, el 75% de los hogares viven en vivienda propia. Es el porcentaje más alto de Europa Occidental. La narrativa cultural es unánime: "el alquiler es tirar el dinero". Pero los números cuentan otra historia. Esta lección te dará las herramientas para hacer el cálculo correcto para TU situación, sin ideología.',
        blocks:[
          {t:'text', h:'El coste REAL de comprar (los que nadie menciona)',
            p:'Piso de 250.000€. Hipoteca al 3,5% a 30 años con el 20% de entrada (50.000€). La cuota mensual es ~900€. <strong>Pero el coste total es mucho mayor</strong>: gastos de compra (ITP/IVA + notaría + registro + gestoría) = 25.000-30.000€. Intereses totales de la hipoteca a 30 años = ~125.000€. IBI anual = 600€. Comunidad = 150€/mes. Mantenimiento y reparaciones = 1% del valor/año = 2.500€. <strong>Coste real en 30 años: ~600.000€ por una vivienda que "costaba" 250.000€</strong>.'},
          {t:'stats', items:[
            {v:'75%', l:'Hogares españoles en propiedad (vs 52% en Alemania)'},
            {v:'~10%', l:'Costes adicionales al comprar (impuestos, notaría, etc.)'},
            {v:'30 años', l:'El horizonte mínimo para que la compra supere al alquiler (según datos)'},
          ]},
          {t:'text', h:'El argumento a favor del alquiler: coste de oportunidad',
            p:'La entrada de 50.000€ + gastos (80.000€ en total) invertidos en el S&P 500 al 8% durante 30 años = <strong>805.000€</strong>. Si alquilas por menos de lo que pagarías de hipoteca y comunidad, la diferencia mensual invertida amplifica aún más esta ventaja. El alquiler en España rinde a quien es disciplinado invirtiendo la diferencia.'},
          {t:'hl', s:'info', label:'💡 LA REGLA PRICE-TO-RENT RATIO',
            p:'Divide el precio de compra entre el alquiler anual. Un piso de 300.000€ que alquila por 12.000€/año tiene un ratio de 25. <strong>Interpretación:</strong> Ratio &lt;15: compra claramente ventajosa. Ratio 15-20: zona gris. Ratio &gt;20: alquiler más eficiente. En Madrid y Barcelona el ratio supera 30: financieramente, alquilar suele ser más racional a corto-medio plazo en estas ciudades.'},
        ]
      },
      {type:'quiz',
        q:'El Price-to-Rent Ratio de un piso en Madrid es 32. Según el análisis financiero, ¿qué indicaría esto?',
        opts:[
          {t:'Que es buen momento para comprar — precio razonable',  ok:false},
          {t:'Que el mercado está equilibrado — indiferente',         ok:false},
          {t:'Que alquilar suele ser más eficiente a corto-medio plazo', ok:true},
          {t:'Que la vivienda está infravalorada',                    ok:false},
        ],
        ok:'¡Correcto! Con ratio >20 (y especialmente >25), el alquiler suele ser más eficiente. El capital no inmovilizado puede generar retornos superiores. Madrid y Barcelona tienen ratios de 30-40, entre los más altos de Europa, lo que explica por qué muchos economistas recomiendan el alquiler allí.',
        bad:'Ratio >20 indica que alquilar es más eficiente financieramente. Con ratio 32, tendrías que alquilar durante 32 años solo para pagar el precio de compra en alquileres. El capital inmovilizado en la compra, si se invierte en mercados, puede generar retornos superiores al diferencial de alquiler vs hipoteca.',
      },
      {type:'content', title:'Cuándo Comprar Sí Tiene Sentido',
        blocks:[
          {t:'text', h:'Las 4 condiciones que hacen racional la compra',
            p:'1. <strong>Estabilidad geográfica mínima 10-15 años</strong> (la movilidad laboral es el mayor coste oculto de la propiedad). 2. <strong>Apalancamiento favorable</strong>: tipos hipotecarios bajos vs rentabilidad esperada de los mercados. 3. <strong>Price-to-Rent ratio inferior a 20</strong> en la zona que te interesa. 4. <strong>Ahorro previo del 30%</strong> del precio (20% entrada + ~10% gastos) sin dañar el fondo de emergencia.'},
          {t:'hl', s:'', label:'🧮 CALCULADORA SIMPLIFICADA',
            p:'Compara: (Cuota hipoteca + IBI + comunidad + mantenimiento) vs (Alquiler equivalente). Si la diferencia mensual es de 300€ a favor del alquiler y la inviertes al 8%, en 30 años tendrás <strong>450.000€ adicionales</strong> más el capital que nunca inmovilizaste. Si la diferencia es a favor de la compra y tienes estabilidad geográfica: compra con confianza.'},
        ]
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 11 — Regla 50/30/20: Tu Presupuesto en Piloto Automático
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:11, icon:'💡', title:'Regla 50/30/20 de Ahorro',
    desc:'El sistema presupuestario más sencillo y efectivo del mundo',
    xp:18, tag:'PRESUPUESTO', tagC:'green', users:'44.600',
    steps:[
      {type:'content', tag:'💡 Módulo 11', title:'El Sistema que Elizabeth Warren le Enseñó al Mundo',
        intro:'Elizabeth Warren, entonces profesora de Harvard (hoy Senadora), popularizó en 2005 en su libro "All Your Worth" la regla que cambió la vida financiera de millones de personas: el 50/30/20. No es magia. Es matemática aplicada al comportamiento humano: lo suficientemente simple para mantenerla, lo suficientemente robusta para funcionar.',
        blocks:[
          {t:'text', h:'La regla: 50% Necesidades / 30% Deseos / 20% Ahorro',
            p:'Toma tu <strong>ingreso neto mensual</strong> (lo que realmente entra en tu cuenta). Divide en tres bloques: <strong>50%</strong> para necesidades (alquiler/hipoteca, alimentación, suministros, transporte, seguros básicos). <strong>30%</strong> para deseos (restaurantes, suscripciones, ropa no esencial, ocio, vacaciones). <strong>20%</strong> para ahorro e inversión (primero fondo de emergencia, luego inversión, luego pago de deudas no urgentes).'},
          {t:'stats', items:[
            {v:'50%', l:'Necesidades: lo que no puedes eliminar sin consecuencias'},
            {v:'30%', l:'Deseos: calidad de vida y disfrute (no culpa, es parte del plan)'},
            {v:'20%', l:'Ahorro e inversión: tu futuro en piloto automático'},
          ]},
          {t:'text', h:'Aplicación práctica para diferentes salarios',
            p:'Salario neto 1.500€: 750€ necesidades | 450€ deseos | 300€ ahorro/inversión. Salario neto 2.500€: 1.250€ necesidades | 750€ deseos | 500€ ahorro/inversión. Salario neto 4.000€: 2.000€ necesidades | 1.200€ deseos | 800€ ahorro/inversión. Con 300€/mes de ahorro al 8% durante 30 años: <strong>445.000€</strong>. Tu nivel de vida no lo define tu salario, sino el porcentaje que ahorras.'},
          {t:'hl', s:'warn', label:'⚠️ EL PROBLEMA: "MI ALQUILER YA SUPERA EL 50%"',
            p:'En ciudades como Madrid o Barcelona, el alquiler puede consumir el 40-50% del ingreso solo él. Solución: ajusta los porcentajes a tu realidad (60/20/20 o 65/15/20) pero mantén SIEMPRE el mínimo del 10% en ahorro. Con el tiempo, un cambio de vivienda, de ciudad o un aumento salarial te devolverá al 50/30/20 ideal.'},
        ]
      },
      {type:'quiz',
        q:'Con un salario neto de 2.000€/mes aplicando la regla 50/30/20, ¿cuánto debería ir a ahorro e inversión mensualmente?',
        opts:[
          {t:'100€ (5%)',      ok:false},
          {t:'200€ (10%)',     ok:false},
          {t:'400€ (20%)',     ok:true},
          {t:'600€ (30%)',     ok:false},
        ],
        ok:'¡Correcto! 2.000€ × 20% = 400€/mes. Si inviertes estos 400€ al 8% anual durante 25 años, tendrás 370.000€. No es magia: es matemática + disciplina + tiempo.',
        bad:'La respuesta es 400€ (20% de 2.000€). El 20% es el pilar del ahorro en la regla de Warren. 400€/mes al 8% en 25 años = 370.000€. Esta diferencia entre "quien ahorra" y "quien no" es lo que separa la libertad financiera de la dependencia perpetua.',
      },
      {type:'content', title:'Automatización: el Secreto del Ahorro Sostenible',
        blocks:[
          {t:'text', h:'Pay yourself first (Págate a ti primero)',
            p:'El error más común: intentar ahorrar "lo que sobre a fin de mes". La solución: el día que cobras, una transferencia automática mueve el 20% a una cuenta separada de inversión/ahorro. Esto ocurre ANTES de gastar nada. Tu cerebro adapta el gasto al 80% restante sin esfuerzo consciente. Es el principio más poderoso de las finanzas conductuales.'},
          {t:'text', h:'Cuenta de emergencia: el primer paso del 20%',
            p:'Antes de invertir, crea tu colchón de seguridad: <strong>3-6 meses de gastos esenciales en una cuenta de alta rentabilidad o fondo monetario</strong>. Con gastos esenciales de 1.200€/mes: colchón ideal = 3.600€ - 7.200€. Este fondo es inviolable (solo emergencias reales: pérdida de empleo, enfermedad, reparación urgente). Con él, nunca necesitarás una tarjeta de crédito en situaciones de estrés.'},
          {t:'hl', s:'info', label:'💡 HERRAMIENTA RECOMENDADA: FONDO MONETARIO',
            p:'En España, el colchón de emergencia en 2024 puede ir a un fondo monetario (liquidez en 24h, rentabilidad ~3,5-4% anual) como el Fidelity Euro Short Term Bond o el DPAM Money Market. Alternativa: cuenta remunerada de MyInvestor, Coinc o Trade Republic (3,5-4% TAE, sin riesgo, garantizado hasta 100.000€ por el Fondo de Garantía de Depósitos).'},
        ]
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 12 — Inversión Inmobiliaria para Principiantes
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:12, icon:'🏗️', title:'Inversión Inmobiliaria',
    desc:'Del piso de alquiler a los REITs: todas las formas de invertir en ladrillo',
    xp:27, tag:'INMOBILIARIO', tagC:'orange', users:'24.300',
    steps:[
      {type:'content', tag:'🏗️ Módulo 12', title:'Invertir en Inmuebles: Más Allá de Comprar un Piso',
        intro:'El sector inmobiliario ha generado más millonarios que cualquier otra clase de activo en la historia. Pero la imagen del "casero que cobra alquiler" es solo una de las múltiples formas de invertir en inmuebles. Desde los REITs que puedes comprar con 50€ hasta el crowdfunding inmobiliario, el acceso al "ladrillo" se ha democratizado radicalmente.',
        blocks:[
          {t:'text', h:'Inversión directa: el piso de alquiler clásico',
            p:'Compras un piso por 200.000€ (con 60.000€ de entrada), lo alquilas por 1.000€/mes. Ingresos brutos: 12.000€/año. Descontando hipoteca (640€/mes), IBI (600€/año), comunidad (1.200€/año), seguro (300€/año), mantenimiento (~1.500€/año promedio) y vacíos (1 mes/año = 1.000€): <strong>Flujo de caja neto ≈ 360€/año</strong>. Eso es un 0,6% sobre el capital total o un 1,8% sobre el equity inicial. La rentabilidad real viene de la revalorización del activo.'},
          {t:'stats', items:[
            {v:'4-6%', l:'Rentabilidad bruta media del alquiler en España (2024)'},
            {v:'2-4%', l:'Rentabilidad neta real tras gastos y vacíos'},
            {v:'REITs', l:'Alternativa líquida con rentabilidad histórica del 9-11% anual'},
          ]},
          {t:'text', h:'REITs: el ladrillo sin ser casero',
            p:'Un REIT (Real Estate Investment Trust) es una empresa que posee y gestiona inmuebles (hoteles, centros comerciales, oficinas, pisos). Están obligados por ley a distribuir el 90% de sus beneficios como dividendos. Puedes comprar REITs desde cualquier broker por el precio de una acción (5-50€), diversificando en miles de propiedades sin los dolores de cabeza del casero. Ejemplos: Realty Income (O), American Tower (AMT), MERLIN Properties (España).'},
          {t:'hl', s:'info', label:'💡 CROWDFUNDING INMOBILIARIO EN ESPAÑA',
            p:'Plataformas como Urbanitae, Housers o Fellow Funders permiten invertir desde 500€ en proyectos inmobiliarios concretos (promoción, reforma, alquiler). Rentabilidades objetivo del 8-15% anual. Riesgo: iliquidez (tu dinero queda bloqueado 12-36 meses) y riesgo del promotor. Están reguladas por la CNMV. Ideal como complemento, no como núcleo de cartera.'},
        ]
      },
      {type:'quiz',
        q:'Los REITs están legalmente obligados a distribuir qué porcentaje mínimo de sus beneficios como dividendos.',
        opts:[
          {t:'50% de los beneficios', ok:false},
          {t:'70% de los beneficios', ok:false},
          {t:'90% de los beneficios', ok:true},
          {t:'100% de los beneficios', ok:false},
        ],
        ok:'¡Correcto! Los REITs (en USA) deben distribuir mínimo el 90% de sus beneficios imponibles como dividendos, lo que los convierte en excelentes generadores de renta pasiva. En España, las SOCIMIs tienen obligación similar del 80% sobre rentas de alquiler.',
        bad:'La respuesta es el 90%. Esta obligación legal es lo que hace a los REITs tan atractivos para inversores que buscan renta pasiva: están forzados a repartir casi todos sus beneficios. La contrapartida: menor capacidad de reinversión para crecer orgánicamente.',
      },
      {type:'content', title:'La Estrategia BRRR: Comprar, Reformar, Refinanciar, Repetir',
        blocks:[
          {t:'text', h:'Método BRRR: apalancamiento inmobiliario avanzado',
            p:'Buy → Rehab → Rent → Refinance → Repeat. Compras un piso barato y deteriorado (180.000€), inviertes en reforma (30.000€), alquilas a precio de mercado superior, tasas la propiedad renovada (260.000€), refinancias el 80% (208.000€). Con ese capital recuperas tu inversión inicial y repites. Es la estrategia que convierte 50.000€ de capital inicial en múltiples propiedades en 5-10 años. Alto riesgo, alta complejidad, potencial enorme.'},
          {t:'hl', s:'warn', label:'⚠️ RIESGOS REALES DE SER CASERO',
            p:'Impagos (el proceso de desahucio en España tarda 12-24 meses), derramas de comunidad imprevisibles, ocupación ilegal, cambios regulatorios (limitación de alquileres en zonas tensionadas desde 2024), responsabilidad civil del propietario. El 60% de los caseros particulares en España obtienen menos del 4% neto real. Considera los REITs o el crowdfunding como alternativas de menor complejidad operativa.'},
        ]
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 13 — Seguros Esenciales: Protege lo que Has Construido
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:13, icon:'🛡️', title:'Seguros Esenciales',
    desc:'Cuáles contratar, cuáles evitar y cómo no pagar de más',
    xp:20, tag:'PROTECCIÓN', tagC:'purple', users:'17.900',
    steps:[
      {type:'content', tag:'🛡️ Módulo 13', title:'Seguros: Tu Red de Seguridad Financiera',
        intro:'Un seguro es una herramienta de transferencia de riesgo: pagas una prima pequeña y predecible para evitar una pérdida grande e impredecible. El error más común es contratar seguros por emoción (miedo a todo) o por omisión (olvidarse de lo realmente importante). La clave es asegurar los riesgos que NO PUEDES permitirte asumir; el resto, autosegúrate.',
        blocks:[
          {t:'text', h:'Los seguros que NUNCA debes omitir',
            p:'<strong>1. Seguro de vida (si tienes dependientes):</strong> Capital mínimo = 10× ingreso anual. Si ganas 30.000€ y tienes 2 hijos, necesitas 300.000€ de capital asegurado. Un seguro de vida a término (20 años) para alguien de 35 años cuesta ~25-40€/mes. Evita los seguros de vida con ahorro vinculado: son costosos y la rentabilidad es pobre. <strong>2. Seguro de invalidez/incapacidad:</strong> El riesgo más infravalorado. Tus probabilidades de quedar incapacitado antes de jubilarte son 3× las de morir antes de jubilarte.'},
          {t:'stats', items:[
            {v:'×3', l:'Probabilidad de incapacidad laboral antes de jubilarte vs muerte prematura'},
            {v:'10×', l:'Capital mínimo recomendado de vida (múltiplo del ingreso anual)'},
            {v:'~35€', l:'Prima mensual de vida a término 35 años / 300.000€ capital (referencia)'},
          ]},
          {t:'text', h:'Seguros importantes pero ajustables',
            p:'<strong>Seguro de hogar:</strong> Obligatorio si tienes hipoteca, muy recomendable siempre. Cubre el continente (estructura) y el contenido (muebles). Compara 3-4 ofertas al año: diferencias del 30-50% entre compañías para la misma cobertura. <strong>Seguro de salud privado:</strong> Interesante si vives en ciudades con saturación del sistema público, trabajas autónomo, o tienes familia con niños pequeños. En España, el sistema público es de los mejores del mundo: el seguro privado es complemento, no sustituto.'},
          {t:'hl', s:'warn', label:'⚠️ SEGUROS QUE SUELEN SER UN MAL NEGOCIO',
            p:'<strong>Seguros de garantía extendida</strong> de electrónica: márgenes del fabricante del 80%, probabilidad de avería en el período cubierto muy baja. <strong>Seguros de accidentes de viaje</strong> cuando ya los cubre tu tarjeta de crédito premium. <strong>Seguros de vida para hipoteca</strong> del banco: el banco exige seguro de vida, no que sea SUYO. Búscalo fuera y ahorra hasta 50% de la prima. <strong>Unit Linked</strong>: producto híbrido seguros-inversión con altas comisiones y escasa transparencia.'},
        ]
      },
      {type:'quiz',
        q:'Tu salario anual es 35.000€ y tienes pareja e hijos a cargo. ¿Cuál es el capital mínimo recomendado para un seguro de vida?',
        opts:[
          {t:'100.000€ — 3 años de salario',    ok:false},
          {t:'200.000€ — 6 años de salario',    ok:false},
          {t:'350.000€ — 10 años de salario',   ok:true},
          {t:'700.000€ — 20 años de salario',   ok:false},
        ],
        ok:'¡Correcto! La regla general es 10× el ingreso anual: 35.000€ × 10 = 350.000€. Este capital permite a tu familia mantener el nivel de vida durante una década mientras reorganiza su situación económica. Más en casos de deuda hipotecaria alta o dependientes con necesidades especiales.',
        bad:'La respuesta es 350.000€ (10 veces el ingreso anual de 35.000€). Esta es la regla estándar de la planificación financiera. El capital debe ser suficiente para que tus dependientes mantengan su nivel de vida mientras replantean su situación económica.',
      },
      {type:'content', title:'Cómo Contratar Bien y Pagar Menos',
        blocks:[
          {t:'text', h:'Las 3 reglas del comprador inteligente de seguros',
            p:'1. <strong>Compara siempre</strong>: Rastreator, Acierto, o directamente 3-4 compañías. Para vida e invalidez: considera corredores especializados (no comparadores generales). 2. <strong>Revisa anualmente</strong>: tu situación cambia y las primas suben automáticamente. Cambia de compañía sin miedo — la lealtad no da descuentos reales. 3. <strong>Aumenta el deducible</strong>: en hogar y salud, subir la franquicia reduce la prima 15-30%. Solo uses el seguro para pérdidas grandes que no puedes asumir.'},
          {t:'hl', s:'info', label:'💡 AUTOSEGURO: LA ESTRATEGIA AVANZADA',
            p:'Para personas con patrimonio elevado (>200.000€ invertidos): puede tener sentido reducir coberturas y autosegurarse para riesgos menores. Si tienes 200.000€ en cartera, un siniestro de 5.000€ (robo, avería mayor) representa solo el 2,5% de tu patrimonio. El coste en primas de segurar todos los riesgos pequeños puede superar estadísticamente las pérdidas evitadas.'},
        ]
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 14 — Deuda Buena vs Deuda Mala: Apalancamiento Inteligente
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:14, icon:'⚖️', title:'Deuda Buena vs Deuda Mala',
    desc:'Aprende a usar el apalancamiento como los ricos, no como los pobres',
    xp:23, tag:'DEUDA', tagC:'red', users:'26.800',
    steps:[
      {type:'content', tag:'⚖️ Módulo 14', title:'El Arma de Doble Filo del Dinero Prestado',
        intro:'Robert Kiyosaki la llamó "la línea entre ricos y pobres": los ricos usan la deuda para comprar activos que generan ingresos. Los pobres usan la deuda para comprar pasivos que generan gastos. Esta distinción simple explica por qué dos personas con el mismo salario pueden tener situaciones financieras radicalmente distintas en 10 años.',
        blocks:[
          {t:'text', h:'Deuda Buena: el dinero que genera más dinero',
            p:'Una deuda es "buena" cuando el activo que financia genera un retorno superior a su coste. Hipoteca al 3% para un piso que genera el 5% de rentabilidad: diferencial positivo del 2%. Préstamo al 5% para un negocio que genera el 25% de margen: apalancamiento inteligente. Deuda universitaria al 4% si ese título aumenta tu salario un 40%: retorno sobre inversión positivo. <strong>La clave: el activo genera más de lo que cuesta el préstamo.</strong>'},
          {t:'stats', items:[
            {v:'24% TAE', l:'Tipo habitual de tarjetas de crédito revolving en España'},
            {v:'72÷24=3', l:'Años para que esa deuda se DOBLE si solo pagas mínimos'},
            {v:'∞', l:'Coste real de una deuda que nunca terminas de pagar'},
          ]},
          {t:'text', h:'Deuda Mala: el pozo sin fondo',
            p:'Una deuda es "mala" cuando financia consumo o pasivos que pierden valor. Tarjeta de crédito al 24% para vacaciones: pagas durante 3 años por algo que duró 2 semanas. Préstamo al 18% para un coche que pierde el 20% de valor el primer año: doble devaluación. Crédito rápido al 40% para capricho: financiero equivalent a dinamita. Regla simple: si no puedes describir cómo ese préstamo te generará ingresos, es deuda mala.'},
          {t:'hl', s:'warn', label:'⚠️ EL PELIGRO DEL PAGO MÍNIMO EN TARJETAS',
            p:'Deuda de 5.000€ en tarjeta revolving al 24% TAE pagando solo el mínimo (3% del saldo = 150€). Tiempo para saldar la deuda: <strong>más de 15 años</strong>. Intereses totales pagados: <strong>~5.800€</strong> adicionales. Pagas casi el doble del coste original. Nunca uses el pago mínimo de tarjetas de crédito — paga el saldo completo cada mes o no uses la tarjeta.'},
        ]
      },
      {type:'quiz',
        q:'¿Cuál de estas deudas encaja en la definición de "deuda buena" según la filosofía del apalancamiento inteligente?',
        opts:[
          {t:'Crédito al 20% para televisor de última generación',       ok:false},
          {t:'Tarjeta revolving al 24% para viaje de vacaciones',        ok:false},
          {t:'Hipoteca al 3,5% para piso que renta al 5,5% neto',       ok:true},
          {t:'Préstamo personal al 10% para comprar ropa de marca',     ok:false},
        ],
        ok:'¡Correcto! Hipoteca al 3,5% para un activo que renta al 5,5% neto: diferencial positivo del 2%. El activo genera más de lo que cuesta el préstamo — esta es la definición exacta de apalancamiento inteligente. Las otras opciones financian consumo que no genera retorno económico.',
        bad:'La deuda buena es la hipoteca para el piso rentable: el activo genera el 5,5% y la deuda cuesta el 3,5% — diferencial positivo. Las tarjetas y préstamos personales para consumo son siempre deuda mala: financian gastos que no generan retorno futuro.',
      },
      {type:'content', title:'El Plan de Eliminación de Deuda Mala',
        blocks:[
          {t:'text', h:'Método Avalancha vs Método Bola de Nieve',
            p:'<strong>Avalancha (matemáticamente óptimo):</strong> Ordena tus deudas por tipo de interés de mayor a menor. Paga el mínimo en todas, y destina todo el exceso a la más cara. Al eliminarla, ese pago se vuelca a la siguiente. Ahorra más intereses totales. <strong>Bola de Nieve (psicológicamente efectivo):</strong> Ordena por saldo, de menor a mayor. Eliminar deudas pequeñas primero genera momentum emocional. Estudios muestran mayor tasa de finalización que la avalancha pura.'},
          {t:'hl', s:'info', label:'💡 REGLA PRÁCTICA: THRESHOLD DEL 5%',
            p:'Si tu deuda tiene un tipo de interés superior al 5%: prioriza eliminarla antes de invertir. Si está por debajo del 5%: invierte y paga el mínimo (la rentabilidad histórica del mercado supera ese coste). Ejemplo: hipoteca al 3% → invierte la diferencia. Tarjeta al 24% → elimínala antes que cualquier otra cosa, incluyendo el plan de pensiones.'},
        ]
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 15 — Libertad Financiera e Independencia (FIRE)
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:15, icon:'🔥', title:'Movimiento FIRE: Libertad Financiera',
    desc:'Cómo jubilarte a los 40 (o simplemente tener la opción)',
    xp:29, tag:'FIRE', tagC:'orange', users:'20.100',
    steps:[
      {type:'content', tag:'🔥 Módulo 15', title:'FIRE: Financial Independence, Retire Early',
        intro:'En 1992, William Bengen publicó el estudio que cambiaría la idea de la jubilación: la "regla del 4%". Desde entonces, decenas de miles de personas en todo el mundo han alcanzado la independencia financiera antes de los 50, 45 o incluso 40 años, no porque ganen más, sino porque entienden una ecuación simple: Número FIRE = Gastos anuales × 25.',
        blocks:[
          {t:'text', h:'La Regla del 4%: el fundamento matemático del FIRE',
            p:'Bengen analizó 50 años de datos históricos y encontró que una cartera de acciones + bonos puede soportar retiros del 4% anual durante 30+ años sin agotarse. Si tu patrimonio es 500.000€ y retiras 20.000€/año (4%), la cartera históricamente crece más que lo que retiras. <strong>Tu "número FIRE" = Gastos anuales ÷ 0,04 = Gastos × 25</strong>. Con gastos de 25.000€/año: necesitas 625.000€ invertidos.'},
          {t:'formula', f:'Número FIRE = Gastos anuales × 25', l:'Basado en la regla del 4% de Bengen (1992) — tasa de retiro segura históricamente'},
          {t:'stats', items:[
            {v:'4%', l:'Tasa de retiro anual segura históricamente (Bengen, 1992)'},
            {v:'×25', l:'Multiplicador para calcular tu número FIRE'},
            {v:'95%', l:'Probabilidad histórica de no agotar la cartera en 30 años'},
          ]},
          {t:'text', h:'Los 4 tipos de FIRE',
            p:'<strong>Lean FIRE</strong>: vida minimalista, gastos reducidos al máximo, independencia rápida (~300-400k€). <strong>Fat FIRE</strong>: nivel de vida alto (~1-2M€ de patrimonio, gastos 60-80k€/año). <strong>Barista FIRE</strong>: semi-retiro con trabajo parcial que cubre gastos básicos, la cartera cubre el resto. <strong>Coast FIRE</strong>: acumulas suficiente para que el interés compuesto complete el trabajo hasta los 65, y dejas de ahorrar agresivamente para disfrutar hoy.'},
          {t:'hl', s:'info', label:'💡 COAST FIRE: EL MÁS ACCESIBLE',
            p:'¿Cuánto necesitas tener ya invertido para que el interés compuesto llegue a tu número FIRE sin aportar más? Si tu número FIRE es 600.000€, tienes 30 años hasta los 65 y esperas un 7% real anual: <strong>600.000 ÷ (1,07)^30 = 78.000€</strong>. Con 78.000€ invertidos hoy, en 30 años tendrás 600.000€ sin aportar ni un euro más. Este cálculo libera enormemente la presión de la tasa de ahorro.'},
        ]
      },
      {type:'quiz',
        q:'Tus gastos anuales son 30.000€. Usando la regla del 4% de Bengen, ¿cuál es tu "número FIRE" (patrimonio necesario para retirarte)?',
        opts:[
          {t:'300.000€ (×10 los gastos)',   ok:false},
          {t:'600.000€ (×20 los gastos)',   ok:false},
          {t:'750.000€ (×25 los gastos)',   ok:true},
          {t:'1.500.000€ (×50 los gastos)', ok:false},
        ],
        ok:'¡Correcto! 30.000€ × 25 = 750.000€. Con 750.000€ invertidos en cartera diversificada, el 4% de retiro anual (30.000€) es históricamente sostenible indefinidamente. Este es tu número de libertad financiera.',
        bad:'La respuesta es 750.000€ (30.000€ × 25). La fórmula es: Gastos anuales ÷ 0,04 = Gastos × 25. Con 750.000€ invertidos, retiras 30.000€/año (4%) y la cartera históricamente sigue creciendo en términos reales.',
      },
      {type:'content', title:'Cómo Acelerar Tu Camino al FIRE',
        blocks:[
          {t:'text', h:'La tasa de ahorro: la variable más poderosa',
            p:'El factor que más impacta en la velocidad al FIRE no es la rentabilidad de la cartera — es tu <strong>tasa de ahorro</strong>. Con una tasa del 10%: 43 años hasta el FIRE. Con 25%: 32 años. Con 50%: 17 años. Con 75%: 7 años. Duplicar tu rentabilidad (del 6% al 12%) reduce el tiempo 15%. Duplicar tu tasa de ahorro (del 20% al 40%) reduce el tiempo un 45%. El camino al FIRE es más rápido por el lado de los gastos que por el lado de los retornos.'},
          {t:'hl', s:'warn', label:'⚠️ EL RIESGO: SEQUENCE OF RETURNS',
            p:'Si te retiras a los 45 y el mercado cae un 40% los primeros 2 años (como en 2008), retirar el 4% mientras la cartera se hunde puede agotarla prematuramente. La solución: 2-3 años de gastos en efectivo/bonos cortos ("buffer"), de modo que en años de caída usas el buffer en lugar de vender acciones depreciadas. Esta es la mayor amenaza real del FIRE temprano.'},
        ]
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 16 — El Poder de los Dividendos: Renta Pasiva Real
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:16, icon:'💸', title:'Dividendos: Renta Pasiva Real',
    desc:'Construye un flujo de ingresos que crece mientras duermes',
    xp:24, tag:'DIVIDENDOS', tagC:'green', users:'23.700',
    steps:[
      {type:'content', tag:'💸 Módulo 16', title:'Los Dividendos: El Dinero que Trabaja por Ti',
        intro:'Un dividendo es la parte de los beneficios de una empresa que se reparte entre los accionistas. Si posees 1.000 acciones de una empresa que paga 1€ de dividendo anual, recibes 1.000€/año sin vender ninguna acción. Con suficiente capital en empresas dividenderas, podrías cubrir tus gastos sin trabajar. Esto no es teoría: es la estrategia de renta pasiva más antigua y probada del capitalismo.',
        blocks:[
          {t:'text', h:'Dividend Yield y Dividend Growth: las dos métricas clave',
            p:'<strong>Dividend Yield (rentabilidad por dividendo)</strong> = Dividendo anual ÷ Precio acción × 100. Una acción que cotiza a 100€ y paga 4€/año tiene un yield del 4%. <strong>Dividend Growth (crecimiento del dividendo)</strong>: la tasa a la que la empresa aumenta su dividendo cada año. Una empresa con yield del 2,5% pero crecimiento del 10% anual pagará más que una con yield del 5% y crecimiento nulo, a los 10 años.'},
          {t:'stats', items:[
            {v:'25+', l:'Años consecutivos de aumento de dividendo para ser "Dividend Aristocrat"'},
            {v:'67', l:'Empresas del S&P 500 con estatus de Dividend Aristocrat en 2024'},
            {v:'~9%', l:'Rentabilidad total histórica del S&P 500 incluyendo dividendos reinvertidos'},
          ]},
          {t:'text', h:'Dividend Aristocrats: las empresas que llevan décadas pagando más cada año',
            p:'Los Dividend Aristocrats son empresas del S&P 500 que han aumentado su dividendo <strong>25+ años consecutivos</strong>. Han sobrevivido a la crisis dotcom (2001), la Gran Recesión (2008) y la pandemia (2020) sin bajar ni detener el dividendo. Ejemplos: Johnson & Johnson (dividendo creciente desde 1963), Coca-Cola (desde 1963), Procter & Gamble (desde 1956). En España, empresas como Inditex, AENA o Naturgy han mantenido dividendos robustos históricamente.'},
          {t:'hl', s:'info', label:'💡 EL REINVESTIMIENTO: DIVIDENDOS COMPRANDO DIVIDENDOS',
            p:'1.000€ invertidos en Realty Income (REIT, ~5,5% yield) el año 1 generan 55€ en dividendos. Si reinviertes esos dividendos compras más acciones. El año 2 generas dividendos sobre un capital mayor. En 20 años, sin añadir capital, esa posición inicial se convierte en ~2.900€ solo por el efecto del reinvestimiento compuesto. Es el interés compuesto aplicado a la renta pasiva.'},
        ]
      },
      {type:'quiz',
        q:'Una empresa cotiza a 50€ y paga un dividendo anual de 2€ por acción. ¿Cuál es su Dividend Yield?',
        opts:[
          {t:'1% de rentabilidad',  ok:false},
          {t:'2% de rentabilidad',  ok:false},
          {t:'4% de rentabilidad',  ok:true},
          {t:'10% de rentabilidad', ok:false},
        ],
        ok:'¡Correcto! Dividend Yield = (2€ ÷ 50€) × 100 = 4%. Esto significa que por cada 100€ invertidos en esta empresa, recibirás 4€/año en dividendos sin vender las acciones.',
        bad:'La fórmula es: Dividend Yield = (Dividendo anual ÷ Precio) × 100 = (2 ÷ 50) × 100 = 4%. Un yield del 4% significa que recibes 4€ por cada 100€ invertidos, año tras año, sin vender ninguna acción.',
      },
      {type:'content', title:'Construyendo Tu Máquina de Dividendos',
        blocks:[
          {t:'text', h:'La cartera dividendera clásica: el "Core-Satellite"',
            p:'<strong>Core (70%):</strong> ETF de dividendos globales como el Vanguard FTSE All-World High Dividend Yield (VHYL, yield ~3,5%) o el iShares MSCI World Quality Dividend (QDIV). Diversificación máxima, bajo coste. <strong>Satellite (30%):</strong> 5-10 empresas selectas con dividendos crecientes y negocios sólidos: Johnson & Johnson, Realty Income, Nestlé, AbbVie, Microsoft (aunque yield bajo, crecimiento excepcional).'},
          {t:'hl', s:'warn', label:'⚠️ YIELD TRAPS: EL PELIGRO DEL YIELD ALTO',
            p:'Un yield del 10% o más generalmente es una señal de alerta, no una oportunidad. Puede indicar: empresa en dificultades (precio caído → yield alto aparente), dividendo insostenible a punto de recortarse, o negocio en declive estructural. Antes de comprar cualquier empresa por su dividendo alto, revisa: ¿El payout ratio (dividendo ÷ beneficio) es inferior al 75%? ¿Los beneficios llevan 5+ años estables o creciendo? Si no, el "dividendo alto" puede ser la antesala de su eliminación.'},
        ]
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 17 — Mercados Financieros Internacionales
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:17, icon:'🌍', title:'Mercados Financieros Globales',
    desc:'Entiende cómo funciona el ecosistema financiero mundial',
    xp:26, tag:'MERCADOS', tagC:'blue', users:'16.500',
    steps:[
      {type:'content', tag:'🌍 Módulo 17', title:'El Sistema Nervioso de la Economía Global',
        intro:'Los mercados financieros mueven 7,5 billones de dólares DIARIOS en divisas (Forex), 300.000 millones en acciones, y trillones en deuda y derivados. Entender cómo se interconectan es fundamental para cualquier inversor: porque lo que decide la Reserva Federal americana afecta al precio de tu hipoteca en España.',
        blocks:[
          {t:'text', h:'Los 4 grandes mercados que debes conocer',
            p:'<strong>1. Renta Variable (Bolsa):</strong> Acciones de empresas. Mayor volatilidad, mayor retorno histórico (~7-10% real anual a largo plazo). <strong>2. Renta Fija (Bonos):</strong> Deuda de gobiernos y empresas. Flujo predecible, menor volatilidad. Los bonos y las acciones típicamente se mueven en direcciones opuestas (descorrelación). <strong>3. Divisas (Forex):</strong> El mercado más líquido del mundo. Afecta a multinacionales, exportadores e importadores. <strong>4. Materias Primas (Commodities):</strong> Petróleo, oro, metales, alimentos. Coberturas contra inflación.'},
          {t:'stats', items:[
            {v:'7,5T$', l:'Volumen diario del mercado Forex — el más líquido del planeta'},
            {v:'109T$', l:'Capitalización bursátil global (MSCI All Country, 2024)'},
            {v:'1,4T$', l:'Activos bajo gestión de BlackRock — el mayor gestor del mundo'},
          ]},
          {t:'text', h:'Cómo los tipos de interés mueven todos los mercados',
            p:'Este es el mecanismo más importante que debes entender. Cuando la Fed sube tipos: los bonos nuevos pagan más → los bonos viejos valen menos. El dólar se fortalece → las materias primas (en $) bajan. El crédito se encarece → las empresas endeudadas sufren → las bolsas caen. El inversor que entiende este ciclo puede anticipar movimientos de mercado antes de que ocurran.'},
          {t:'hl', s:'info', label:'📊 LOS ÍNDICES QUE TODO INVERSOR DEBE CONOCER',
            p:'<strong>S&P 500:</strong> 500 mayores empresas USA, referencia global. <strong>MSCI World:</strong> 1.500 empresas de 23 países desarrollados. <strong>MSCI Emerging Markets:</strong> 800+ empresas de mercados emergentes. <strong>Euro Stoxx 50:</strong> 50 mayores empresas europeas. <strong>IBEX 35:</strong> Las 35 mayores empresas españolas (alta concentración en bancos y utilities — poca diversificación). El MSCI World es la referencia de cartera global equilibrada.'},
        ]
      },
      {type:'quiz',
        q:'Cuando los bancos centrales suben los tipos de interés, ¿qué ocurre típicamente con el precio de los bonos emitidos anteriormente?',
        opts:[
          {t:'Suben — los bonos son más atractivos',       ok:false},
          {t:'No varían — son activos de renta fija',      ok:false},
          {t:'Bajan — los bonos viejos pierden atractivo', ok:true},
          {t:'Depende exclusivamente de la inflación',     ok:false},
        ],
        ok:'¡Correcto! Cuando suben los tipos, se emiten bonos nuevos con mayor rentabilidad. Los bonos viejos (con cupón más bajo) se vuelven menos atractivos → su precio cae en el mercado secundario. Esta relación inversa tipos-precio es fundamental en renta fija.',
        bad:'Los precios de los bonos viejos BAJAN cuando suben los tipos. Los bonos nuevos pagan más → los viejos pierden atractivo → su precio cae hasta que la rentabilidad efectiva se iguala. Relación inversa tipo de interés ↑ / precio bono ↓: la clave de la renta fija.',
      },
      {type:'content', title:'Ciclos Económicos y Rotación Sectorial',
        blocks:[
          {t:'text', h:'Los 4 fases del ciclo económico y qué invertir en cada una',
            p:'<strong>Expansión:</strong> crecimiento, empleo al alza → mejores activos: tecnología, consumo discrecional, pequeñas empresas. <strong>Pico:</strong> la economía "se calienta", inflación sube → mejores: materias primas, energía, sector financiero. <strong>Recesión:</strong> contracción → mejores: utilities, salud, bonos gubernamentales, oro. <strong>Recuperación:</strong> economía vuelve a crecer → mejores: sector financiero, industrial, real estate.'},
          {t:'hl', s:'warn', label:'⚠️ EL RIESGO DEL MARKET TIMING',
            p:'Aunque el ciclo económico es real, predecir exactamente cuándo cambia de fase es casi imposible, incluso para los mejores gestores del mundo. Los estudios de Dalbar muestran que el inversor medio obtiene un 3% anual menos que el mercado por intentar "entrar y salir" en el momento correcto. La diversificación permanente y el DCA baten al market timing en el 85% de los casos históricos a más de 10 años.'},
        ]
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 18 — Planificación de la Jubilación: Tu Futuro en Números
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:18, icon:'🏖️', title:'Planificación de la Jubilación',
    desc:'Calcula cuánto necesitas y cómo llegará solo si actúas ahora',
    xp:25, tag:'JUBILACIÓN', tagC:'gold', users:'21.200',
    steps:[
      {type:'content', tag:'🏖️ Módulo 18', title:'Tu Jubilación: El Proyecto Financiero Más Importante',
        intro:'El sistema público de pensiones español enfrenta un reto matemático: en 1978 había 5 trabajadores por cada pensionista. En 2023, hay 2,3. En 2050, se prevén 1,6. La pensión pública seguirá existiendo, pero será insuficiente para mantener el nivel de vida previo. El complemento privado ya no es opcional: es necesario.',
        blocks:[
          {t:'text', h:'La brecha de la jubilación: cuánto te faltará',
            p:'La tasa de sustitución de la Seguridad Social española es del 73% (una de las más altas de Europa), pero sobre una base que puede ser baja. Si cobras 3.000€/mes netos, tu pensión estimada sería ~2.190€ — una brecha de 810€/mes. En 20 años de jubilación, esa brecha son 194.400€ que necesitas de fuentes privadas. Y eso sin contar la inflación que erosiona el poder adquisitivo año a año.'},
          {t:'stats', items:[
            {v:'73%', l:'Tasa de sustitución media de la pensión española (2023)'},
            {v:'2,3', l:'Trabajadores actuales por cada pensionista (vs 5 en 1978)'},
            {v:'1,6', l:'Proyección para 2050 — la bomba demográfica del sistema'},
          ]},
          {t:'text', h:'Los 3 pilares del sistema de pensiones en España',
            p:'<strong>Pilar 1 — Público (Seguridad Social):</strong> Obligatorio, solidario intergeneracional. Complementar con los pilares 2 y 3 es esencial. <strong>Pilar 2 — Empresa:</strong> Planes de empleo, contribuciones del empleador. En España poco desarrollado vs Holanda o UK. Si tu empresa ofrece plan de empresa con aportación, es dinero gratis que no puedes rechazar. <strong>Pilar 3 — Individual:</strong> Planes de pensiones, PIAS, fondos indexados, carteras personales. Aquí está tu mayor palanca de acción.'},
          {t:'hl', s:'info', label:'💡 CALCULADORA SIMPLIFICADA DE JUBILACIÓN',
            p:'Tienes 35 años, quieres jubilarte a los 65 (30 años), necesitas 1.500€/mes extra de tu ahorro privado (18.000€/año), y esperas una rentabilidad real del 5% (descontando inflación). Capital necesario: 18.000 ÷ 0,04 = 450.000€. Para llegar: invierte 650€/mes durante 30 años al 7% = 785.000€. Cada año que retrasas esta decisión incrementa la cuota mensual necesaria un 8-12%.'},
        ]
      },
      {type:'quiz',
        q:'La "tasa de sustitución" de la Seguridad Social española indica que, de media, la pensión equivale a qué porcentaje del último salario.',
        opts:[
          {t:'50% del último salario',   ok:false},
          {t:'73% del último salario',   ok:true},
          {t:'90% del último salario',   ok:false},
          {t:'100% del último salario',  ok:false},
        ],
        ok:'¡Correcto! España tiene una tasa de sustitución del ~73%, una de las más altas de la OCDE. Pero esto se aplica sobre el salario regulador (base de cotización en los últimos años), que puede diferir del salario real. Y la sostenibilidad del sistema a largo plazo requiere complemento privado.',
        bad:'La tasa de sustitución española es ~73%: tu pensión pública equivaldrá a aproximadamente el 73% de tu último salario. Aunque es alta en comparación internacional, la sostenibilidad del sistema y la brecha en salarios altos hace necesario el ahorro privado complementario.',
      },
      {type:'content', title:'Estrategia Práctica de Ahorro para la Jubilación',
        blocks:[
          {t:'text', h:'La secuencia óptima para acumular patrimonio jubilación',
            p:'1. <strong>Aprovecha el plan de empresa</strong> hasta el máximo que aporte el empleador (dinero gratis). 2. <strong>Maximiza plan de pensiones individual</strong> (hasta 8.000€, deducción al tipo marginal). 3. <strong>Complementa con cartera indexada en bróker</strong> (más flexibilidad que el plan de pensiones, sin bloqueo). 4. Si eres autónomo: <strong>Plan de Pensiones de Empleo Simplificado para Autónomos (PPESA)</strong>, desde 2023 permite hasta 5.750€ adicionales deducibles.'},
          {t:'hl', s:'warn', label:'⚠️ EL ERROR DEL "YA LO HARÉ CUANDO GANE MÁS"',
            p:'200€/mes empezando a los 25 años al 7%: <strong>525.000€ a los 65</strong>. 200€/mes empezando a los 35 años al 7%: <strong>243.000€ a los 65</strong>. Esperar 10 años cuesta <strong>282.000€</strong>. El coste de oportunidad del retraso siempre es mayor de lo que parece. Empieza con lo que puedas — 50€/mes ya marca una diferencia estructural frente a no empezar.'},
        ]
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 19 — Emprendimiento y Fuentes de Ingresos Múltiples
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:19, icon:'🚀', title:'Ingresos Múltiples y Side Business',
    desc:'Por qué un solo ingreso es el mayor riesgo financiero de tu vida',
    xp:30, tag:'EMPRENDIMIENTO', tagC:'purple', users:'18.300',
    steps:[
      {type:'content', tag:'🚀 Módulo 19', title:'La Aritmética de los Ingresos Múltiples',
        intro:'Tom Corley, investigador del comportamiento financiero de los ricos, entrevistó durante 5 años a 177 millonarios hechos a sí mismos. Hallazgo clave: el 65% tenía 3 o más fuentes de ingresos antes de hacerse millonario. El sueldo es el inicio, no el destino. Un solo ingreso = un solo punto de fallo. Diversificar tus fuentes de ingreso es el seguro de riesgo más importante que existe.',
        blocks:[
          {t:'text', h:'Los 3 tipos de ingresos que existen',
            p:'<strong>Activo (lineal):</strong> Tiempo = dinero. Trabajas → cobras. Si no trabajas → no cobras. Techo: 24h al día. Es el único ingreso que tiene el 90% de la gente. <strong>Semi-pasivo:</strong> Requiere trabajo inicial o mantenimiento bajo. Alquiler, curso online, producto digital, royalties, afiliación, canal de YouTube. <strong>Pasivo (escalable):</strong> El capital trabaja por ti. Dividendos, intereses, regalías automatizadas. Construido inicialmente con tiempo o dinero, luego autosuficiente.'},
          {t:'stats', items:[
            {v:'65%', l:'Millonarios con 3+ fuentes de ingreso antes de serlo (Corley)'},
            {v:'1/3', l:'Ingresos extra del autónomo medio español vs empleo anterior'},
            {v:'5→20', l:'Años típicos para que un side project supere el salario principal'},
          ]},
          {t:'text', h:'Side businesses de bajo riesgo y alta escalabilidad',
            p:'<strong>Economía del conocimiento:</strong> Consultoría, formación online, ebooks, cursos. Margen del 70-90%, sin inventario. <strong>Economía del contenido:</strong> Newsletter, podcast, YouTube, creación para marcas. Ingresos publicitarios, patrocinadores, afiliación. <strong>Economía digital:</strong> Apps, SaaS, productos digitales. Ingresos recurrentes y escalables. <strong>Economía de servicios:</strong> Freelance especializado. Más activo pero con mayor tarifa por hora que el empleo tradicional.'},
          {t:'hl', s:'info', label:'💡 LA REGLA DE LAS 1.000 HORAS',
            p:'La mayoría de los side projects rentables requieren aproximadamente 1.000 horas de trabajo antes de generar ingresos significativos. A 10h semanales: 2 años. A 20h semanales: 1 año. La clave no es la genialidad de la idea sino la consistencia de la ejecución durante ese período crítico de "nada funciona todavía". El 80% de los emprendedores abandona en los primeros 6 meses, antes de cruzar el umbral de viabilidad.'},
        ]
      },
      {type:'quiz',
        q:'Según el investigador Tom Corley, ¿qué porcentaje de los millonarios hechos a sí mismos tenía 3 o más fuentes de ingreso antes de acumular su riqueza?',
        opts:[
          {t:'20% (una minoría selecta)',     ok:false},
          {t:'40% (algo menos de la mitad)',  ok:false},
          {t:'65% (la mayoría)',              ok:true},
          {t:'90% (prácticamente todos)',     ok:false},
        ],
        ok:'¡Correcto! El 65% de los millonarios estudiados por Corley tenía 3+ fuentes de ingreso. No lo conseguieron PORQUE eran ricos — diversificaron sus ingresos ANTES de serlo. La diversificación de ingresos es causa, no consecuencia, de la riqueza.',
        bad:'La respuesta es el 65%. Corley encontró que la mayoría de millonarios tenían múltiples fuentes ANTES de hacerse ricos. La correlación es causal: diversificar ingresos acelera la acumulación de riqueza, no al revés.',
      },
      {type:'content', title:'De Idea a Ingreso: El Framework Mínimo',
        blocks:[
          {t:'text', h:'El MVP financiero: monetiza antes de perfeccionar',
            p:'Error del emprendedor novato: pasar 12 meses perfeccionando el producto antes de venderlo. Framework correcto: 1. <strong>Identifica el problema</strong> que tienes experiencia resolviendo. 2. <strong>Crea la solución mínima</strong> en 4-8 semanas. 3. <strong>Busca 10 clientes pagantes</strong> antes de escalar. 4. <strong>Itera con feedback real</strong>. Los primeros 10 clientes son más valiosos que 10.000€ en desarrollo de producto.'},
          {t:'hl', s:'', label:'📊 ESTRUCTURA FISCAL DEL AUTÓNOMO EN ESPAÑA',
            p:'Si tu side business supera ~3.000€/año: declarar como autónomo es obligatorio. Cuota mínima de autónomos en 2024: 225€/mes (base mínima). Deducibles: material, software, parte proporcional del hogar si trabajas desde casa (30% del espacio proporcional a la vivienda), móvil, formación, transporte. Con ingresos de 15.000€/año y gastos deducibles de 5.000€: pagas IRPF sobre 10.000€. El autónomo con planificación fiscal paga significativamente menos que un asalariado equivalente.'},
        ]
      },
    ],
  },


  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 20 — Psicología del Dinero: Por qué sabemos qué hacer y no lo hacemos
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:20, icon:'🧠', title:'Psicología del Dinero',
    desc:'Los sesgos cognitivos que destruyen carteras y cómo vencerlos',
    xp:30, tag:'MENTALIDAD', tagC:'purple', users:'29.100',
    steps:[
      {type:'content', title:'Tu Cerebro: El Peor Gestor de Fondos',
        blocks:[
          {t:'text', h:'El enemigo está dentro',
            p:'El inversor medio del S&P 500 obtiene un rendimiento un 3-4% inferior al propio índice cada año. No por mala suerte, sino por decisiones emocionales: comprar eufórico en máximos, vender aterrorizado en mínimos. El índice no puede cometer errores emocionales. Tú sí. El estudio DALBAR de 2023 confirma que mientras el S&P 500 rentó +9,65% anual en 20 años, el inversor medio obtuvo solo +6,81%.'},
          {t:'stats', items:[
            {v:'+9,65%', l:'Rendimiento S&P 500 · 20 años (DALBAR 2023)'},
            {v:'+6,81%', l:'Rendimiento inversor medio · mismo período'},
            {v:'-2,84%', l:'Coste anual de las decisiones emocionales'},
          ]},
          {t:'text', h:'Los 5 sesgos que más dinero cuestan',
            p:'<strong>1. Aversión a la pérdida:</strong> Perder 100€ duele el doble que ganar 100€ alegra (Kahneman). Resultado: vendes demasiado pronto para evitar pérdidas. <strong>2. Sesgo de anclaje:</strong> "Mi acción costaba 50€, ahora vale 30€, espero a que vuelva a 50€". La recuperación nunca está garantizada. <strong>3. Sesgo de confirmación:</strong> Solo lees análisis que confirman lo que ya crees. <strong>4. Exceso de confianza:</strong> El 74% de los inversores cree que supera la media del mercado. Matemáticamente imposible. <strong>5. Comportamiento de rebaño:</strong> Cuando todo el mundo compra cripto o meme stocks, el techo está cerca.'},
          {t:'hl', s:'', label:'💡 EL ANTÍDOTO: AUTOMATIZACIÓN',
            p:'La mejor manera de vencer tus sesgos es eliminar la toma de decisiones. Un plan de inversión automático mensual (DCA) en un ETF indexado hace que no tengas que decidir nada. Sin decisiones emocionales = sin errores emocionales. <strong>La pereza bien dirigida es la estrategia más rentable.</strong>'},
        ]
      },
      {type:'quiz',
        q:'Un inversor tiene acciones que bajaron un 40%. Decide esperar a recuperar el precio de compra antes de vender. ¿Qué sesgo cognitivo describe este comportamiento?',
        opts:[
          {t:'Aversión al riesgo sistémico', ok:false},
          {t:'Sesgo de anclaje al precio de compra', ok:true},
          {t:'Exceso de confianza en el mercado', ok:false},
          {t:'Comportamiento de rebaño inverso', ok:false},
        ],
        ok:'Correcto. El sesgo de anclaje hace que el precio de compra original se convierta en un punto de referencia irracional. El mercado no sabe ni le importa a qué precio compraste. La pregunta correcta es: "¿Compraría esta acción hoy al precio actual?" — no "¿cuándo recupera mi precio de compra?"',
        bad:'Es el sesgo de anclaje. El inversor se ancla al precio de compra como referencia, cuando el mercado no tiene memoria de ese precio. La decisión correcta siempre es: si compraría hoy al precio actual, mantén; si no, vende. El precio de compra es irrelevante para la decisión futura.',
      },
      {type:'content', title:'El Coste Real del Market Timing',
        blocks:[
          {t:'text', h:'Nadie cronometra el mercado con éxito',
            p:'Un estudio de Schwab analizó 5 estrategias durante 20 años con 2.000€/año: invertir siempre el 1 de enero, invertir en el mínimo anual perfecto, invertir en el máximo peor, invertir en mitades y mantener en efectivo. <strong>Resultado: la diferencia entre el mejor momento (mínimo perfecto) y el peor (máximo) fue de solo €15.000 en 20 años</strong>. Pero no invertir nada y mantener efectivo perdió más de €60.000 respecto a invertir en cualquier momento.'},
          {t:'stats', items:[
            {v:'€87.004', l:'Invertir siempre el 1 enero (sin intentar timing)'},
            {v:'€87.111', l:'Timing perfecto (mínimo anual cada año)'},
            {v:'€72.487', l:'Timing terrible (máximo anual cada año)'},
            {v:'€44.438', l:'Mantener todo en efectivo sin invertir'},
          ]},
          {t:'hl', s:'warn', label:'⚠️ CONCLUSIÓN INCÓMODA',
            p:'La diferencia entre el timing perfecto y el timing terrible es pequeña. La diferencia entre invertir (como sea) y no invertir es enorme. <strong>El tiempo en el mercado supera siempre al tiempo del mercado.</strong> No esperes el momento ideal: no existe.'},
        ]
      },
      {type:'quiz',
        q:'Según el estudio de Schwab, ¿cuánto perdió el inversor que intentó "timing perfecto" vs simplemente invertir el 1 de enero cada año?',
        opts:[
          {t:'Ganó €50.000 más gracias al timing perfecto', ok:false},
          {t:'Solo €107 más en 20 años — prácticamente igual', ok:true},
          {t:'Perdió €15.000 por los errores inevitables', ok:false},
          {t:'El timing siempre supera a la inversión automática', ok:false},
        ],
        ok:'¡Exacto! El timing perfecto (siempre en el mínimo anual) superó a invertir el 1 de enero por apenas €107 en 20 años. Imposible de conseguir en la práctica. Conclusión: no pierdas tiempo intentando cronometrar el mercado.',
        bad:'El timing perfecto solo ganó €107 más que invertir el 1 de enero, en 20 años. Una diferencia insignificante e imposible de conseguir en la práctica. La lección: invierte de forma sistemática sin intentar predecir el mercado.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 21 — Fiscalidad del Inversor Español: Paga menos, legalmente
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:21, icon:'🏛️', title:'Fiscalidad del Inversor',
    desc:'IRPF, plusvalías, dividendos y cómo optimizar legalmente tu factura fiscal',
    xp:35, tag:'AVANZADO', tagC:'orange', users:'22.400',
    steps:[
      {type:'content', title:'Cómo Tributan tus Inversiones en España',
        blocks:[
          {t:'text', h:'La base del ahorro: tipos del IRPF 2024',
            p:'En España, las ganancias de capital (vender con beneficio) y los dividendos tributan en la <strong>base del ahorro</strong>, separada de los ingresos del trabajo. Los tipos son: <strong>19%</strong> hasta 6.000€ de ganancia; <strong>21%</strong> de 6.000€ a 50.000€; <strong>23%</strong> de 50.000€ a 200.000€; <strong>27%</strong> de 200.000€ a 300.000€; <strong>28%</strong> por encima de 300.000€. Estos tipos son significativamente más bajos que los del trabajo (hasta 47%). Esto es una ventaja legal que los inversores deben aprovechar.'},
          {t:'stats', items:[
            {v:'19%',  l:'Primeros €6.000 de ganancias de capital'},
            {v:'21%',  l:'De €6.001 a €50.000'},
            {v:'19%',  l:'Retención automática sobre dividendos (a cuenta)'},
          ]},
          {t:'text', h:'Compensación de pérdidas: el escudo fiscal',
            p:'Si vendes una acción con pérdidas, esas pérdidas <strong>compensan ganancias del mismo año</strong> y de los 4 años siguientes. Ejemplo: ganas 10.000€ con AAPL y pierdes 4.000€ con otra acción. Solo tributas por 6.000€. Esta mecánica se llama <strong>Tax Loss Harvesting</strong>: vender activos con pérdidas latentes antes de fin de año para reducir la factura fiscal, y recomprar activos similares (no idénticos, para no violar la norma antiaplicación del 2 meses).'},
          {t:'hl', s:'', label:'💡 LA TRAMPA DEL FONDO DE ACUMULACIÓN',
            p:'Los ETFs y fondos de <strong>acumulación</strong> (como IWDA o VUSA) reinvierten los dividendos internamente. No recibes pagos — reinvierten automáticamente. Ventaja fiscal clave: <strong>no pagas el 19% de retención en dividendos</strong> hasta que vendes. El dinero que habrías pagado en impuestos sigue componiendo. A 20 años, la diferencia con un fondo de distribución puede ser del 15-20% en rentabilidad neta.'},
        ]
      },
      {type:'quiz',
        q:'Tienes ganancias de €8.000 en bolsa este año y pérdidas de €3.000 en otra inversión. ¿Por cuánto tributarás en la base del ahorro?',
        opts:[
          {t:'Por €8.000 completos — las pérdidas no compensan', ok:false},
          {t:'Por €5.000 — las pérdidas compensan las ganancias',  ok:true},
          {t:'Por €0 — toda pérdida anula toda ganancia', ok:false},
          {t:'Por €11.000 — se suman pérdidas y ganancias', ok:false},
        ],
        ok:'Correcto. Las pérdidas de capital compensan las ganancias dentro del mismo ejercicio fiscal. 8.000 - 3.000 = 5.000€ base imponible. A los primeros 5.000€ se aplica el 19% = 950€ de impuestos, en lugar de 1.520€ sin compensar.',
        bad:'Las pérdidas de capital compensan directamente las ganancias. 8.000€ - 3.000€ = 5.000€ de base imponible. Esta mecánica de compensación es uno de los instrumentos fiscales más potentes del inversor español.',
      },
      {type:'content', title:'Plan de Pensiones vs Cuenta de Valores: Cuándo usar cada uno',
        blocks:[
          {t:'text', h:'Plan de pensiones: la deducción que pocos aprovechan',
            p:'Las aportaciones a planes de pensiones <strong>reducen tu base imponible del IRPF de trabajo</strong> hasta 1.500€/año (límite 2023). Si tu tipo marginal es el 37%, cada 1.000€ que metes en el plan te ahorras 370€ en la declaración de la renta. El problema: al retirar el capital en jubilación tributa como renta del trabajo (hasta 47%). Por eso el plan de pensiones solo tiene sentido si tu tipo en activo es muy superior al que tendrás en jubilación.'},
          {t:'text', h:'Cuenta de valores: flexibilidad y fiscalidad del ahorro',
            p:'Una cuenta de valores estándar (en cualquier broker) tributa en la base del ahorro (19-28%) cuando vendes con beneficio. Sin límites de aportación, sin penalización por rescatar antes. La ventaja vs plan de pensiones: pagas siempre en la base del ahorro, nunca como renta del trabajo. <strong>Para la mayoría de inversores jóvenes con tipo marginal bajo, la cuenta de valores es más eficiente que el plan de pensiones.</strong>'},
          {t:'hl', s:'info', label:'📊 LA REGLA DE ORO FISCAL',
            p:'Primero: fondo de emergencia (sin inversión). Segundo: plan de pensiones hasta el máximo si tu tipo marginal supera el 30%. Tercero: cuenta de valores con ETFs de acumulación para el resto. Cuarto: amortiza hipoteca si el tipo de interés supera tu rentabilidad esperada. Este orden maximiza la eficiencia fiscal en el sistema español.'},
        ]
      },
      {type:'quiz',
        q:'¿Por qué un ETF de acumulación (como IWDA) es fiscalmente más eficiente que uno de distribución a largo plazo?',
        opts:[
          {t:'Porque los ETFs de acumulación están exentos de impuestos', ok:false},
          {t:'Porque reinvierte dividendos sin retención del 19%, difiriendo impuestos', ok:true},
          {t:'Porque tributa al 15% en lugar del 19%', ok:false},
          {t:'Porque los dividendos reinvertidos no cuentan como ganancia', ok:false},
        ],
        ok:'Exacto. Con un ETF de acumulación, los dividendos se reinvierten internamente. No hay retención del 19% hasta que vendes. Ese dinero que no pagaste en impuestos sigue generando rentabilidad compuesta. A 20 años, este efecto puede suponer un 15-20% más de capital neto final.',
        bad:'La ventaja es el diferimiento fiscal. Un ETF de distribución paga dividendos → retención 19% automática → reinviertes menos. Un ETF de acumulación reinvierte el 100% sin retención hasta que vendes. El impuesto diferido vale mucho: ese 19% sigue componiéndose durante años.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 22 — Inmobiliario: Comprar o Alquilar, y el REITs Alternativo
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:22, icon:'🏠', title:'Inmobiliario Inteligente',
    desc:'La matemática real del "comprar siempre es mejor que alquilar" — y cuándo no lo es',
    xp:30, tag:'INMOBILIARIO', tagC:'blue', users:'35.200',
    steps:[
      {type:'content', title:'Comprar vs Alquilar: La Matemática Honesta',
        blocks:[
          {t:'text', h:'El mito del "alquilar es tirar el dinero"',
            p:'Esta frase está tan extendida en España que se considera verdad universal. No lo es. <strong>Comprar también tiene costes que "se tiran":</strong> intereses del hipoteca (típicamente el 40-50% de las cuotas iniciales son intereses puros), IBI, comunidad, reparaciones, seguro de hogar, gastos de compraventa (10-15% del precio entre impuestos y notaría). Un piso de 200.000€ con hipoteca a 30 años al 3% generará más de 100.000€ solo en intereses.'},
          {t:'stats', items:[
            {v:'10-15%', l:'Coste de compraventa (ITP/AJD + notaría + registro)'},
            {v:'>100.000€', l:'Intereses totales en hipoteca 200k€ · 30 años · 3%'},
            {v:'1-2%/año', l:'Costes de mantenimiento sobre el valor del inmueble'},
          ]},
          {t:'text', h:'La regla del precio/alquiler',
            p:'Divide el precio de compra entre el alquiler anual equivalente. Si el resultado es mayor que 25, el alquiler es financieramente superior (puedes invertir la diferencia). Si es menor que 20, comprar tiene más sentido. <strong>En Madrid y Barcelona el ratio está en 30-40x</strong> — señal clara de que el mercado está caro respecto a los alquileres. En ciudades medianas puede bajar a 15-20x, donde comprar empieza a tener sentido matemático.'},
          {t:'hl', s:'info', label:'💡 CUÁNDO COMPRAR SÍ TIENE SENTIDO',
            p:'Comprar es mejor que alquilar cuando: tienes mínimo el 30% del precio en efectivo (20% entrada + 10% gastos), planeas vivir allí más de 7-10 años, el ratio precio/alquiler es inferior a 20, tienes un fondo de emergencia independiente de la entrada, y la cuota hipotecaria no supera el 30% de tus ingresos netos.'},
        ]
      },
      {type:'quiz',
        q:'Un piso cuesta €250.000 y el alquiler equivalente es €800/mes (€9.600/año). ¿Cuál es el ratio precio/alquiler y qué indica?',
        opts:[
          {t:'Ratio 26 — zona gris, depende del plazo y alternativas de inversión', ok:true},
          {t:'Ratio 20 — claramente favorable para comprar', ok:false},
          {t:'Ratio 31 — claramente favorable para alquilar', ok:false},
          {t:'El ratio no aplica sin conocer el tipo hipotecario', ok:false},
        ],
        ok:'Correcto. 250.000 / 9.600 = 26. En zona gris (entre 20 y 30): ni claramente comprar ni claramente alquilar. La decisión depende de tu horizonte temporal, capacidad de invertir la diferencia, y expectativas de revalorización local.',
        bad:'250.000 / 9.600 = 26. Zona gris entre 20 (comprar) y 30 (alquilar). La decisión requiere analizar tu horizonte, alternativas de inversión para la entrada, y el mercado local. No hay respuesta universal.',
      },
      {type:'content', title:'REITs: Inmobiliario sin Hipoteca',
        blocks:[
          {t:'text', h:'¿Qué es un REIT?',
            p:'Un REIT (Real Estate Investment Trust) es una empresa que cotiza en bolsa y posee inmuebles: centros comerciales, oficinas, hoteles, almacenes logísticos, hospitales. Al comprar acciones de un REIT, tienes una participación en esos inmuebles. <strong>Obligación legal: distribuir mínimo el 90% de sus beneficios como dividendo.</strong> Esto los convierte en uno de los instrumentos con mayor rentabilidad por dividendo del mercado (4-8% anual).'},
          {t:'stats', items:[
            {v:'90%',  l:'Mínimo de beneficios que deben distribuir como dividendo'},
            {v:'4-8%', l:'Rentabilidad por dividendo típica de REITs'},
            {v:'€500', l:'Capital mínimo para diversificar en inmobiliario global via REIT'},
          ]},
          {t:'hl', s:'', label:'💡 REIT VS PISO FÍSICO',
            p:'Un piso en Madrid necesita €50.000+ de entrada, un inquilino, gestión de problemas, iliquidez total. Un ETF de REITs (como IQQP o BNKS) te da exposición a miles de inmuebles en todo el mundo desde €100, con liquidez diaria, sin gestión, y con diversificación geográfica y sectorial. Para la mayoría de inversores sin capital suficiente para el inmobiliario físico, los REITs son la alternativa superior.'},
        ]
      },
      {type:'quiz',
        q:'¿Cuál es la principal obligación legal de los REITs que los distingue de otras empresas cotizadas?',
        opts:[
          {t:'Invertir mínimo el 75% del capital en inmuebles', ok:false},
          {t:'Distribuir al menos el 90% de sus beneficios como dividendo', ok:true},
          {t:'Cotizar en al menos 3 bolsas internacionales', ok:false},
          {t:'Tener menos del 50% de deuda sobre activos', ok:false},
        ],
        ok:'Exacto. Los REITs están obligados por ley a distribuir mínimo el 90% de su beneficio como dividendo. Esto es lo que garantiza su alta rentabilidad por dividendo (4-8%) y los convierte en un instrumento de renta generalmente superior a los bonos.',
        bad:'La obligación clave es distribuir el 90% de beneficios como dividendo. Esta característica es lo que hace a los REITs únicos y los convierte en generadores de renta excepcionales. Sin esta obligación, serían simplemente inmobiliarias normales.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 23 — Cripto: Tecnología, Riesgo y Cuánto Debe Representar
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:23, icon:'₿', title:'Cripto Sin Hype',
    desc:'La tecnología real detrás de Bitcoin, los riesgos que nadie menciona y el tamaño correcto de posición',
    xp:30, tag:'CRIPTO', tagC:'orange', users:'31.500',
    steps:[
      {type:'content', title:'Bitcoin: Qué es Realmente y Qué No',
        blocks:[
          {t:'text', h:'El problema que Bitcoin resuelve',
            p:'Bitcoin nació en 2009 para resolver un problema técnico: cómo transferir valor digitalmente sin una entidad central de confianza. Antes, necesitabas un banco para evitar que gastaras el mismo dinero dos veces (doble gasto). <strong>La blockchain resuelve esto con criptografía y consenso distribuido:</strong> miles de nodos verifican cada transacción, haciendo imposible el fraude sin controlar el 51% de la red. Bitcoin no es solo dinero — es el primer sistema de escasez digital demostrable. Solo habrá 21 millones de Bitcoins, nunca más.'},
          {t:'stats', items:[
            {v:'21M', l:'Bitcoin máximos que existirán — escasez programada'},
            {v:'2140', l:'Año en que se minará el último Bitcoin'},
            {v:'-80%', l:'Máxima caída de Bitcoin en tres ocasiones distintas'},
          ]},
          {t:'text', h:'El riesgo que los influencers no mencionan',
            p:'Bitcoin ha caído más del 80% en tres ocasiones. Quien compró en el máximo de 2017 (≈€17.000) esperó más de 3 años para recuperar su inversión. Quien compró en el máximo de 2021 (≈€60.000) todavía espera en 2024. <strong>La volatilidad de Bitcoin es 5-8 veces mayor que la de la bolsa.</strong> Un portfolio con más del 5-10% en cripto tiene una volatilidad total que la mayoría de inversores no puede gestionar emocionalmente.'},
          {t:'hl', s:'warn', label:'⚠️ LA REGLA DEL 5%',
            p:'La mayoría de asesores financieros serios recomiendan máximo un 5% del portfolio en activos especulativos como cripto. No porque no pueda subir — puede multiplicarse por 10. Sino porque puede caer un 80% sin aviso. Un 5% que cae un 80% reduce tu portfolio total un 4%. Controlable. Un 40% que cae un 80% es devastador: reduces tu portfolio total un 32%.'},
        ]
      },
      {type:'quiz',
        q:'¿Cuál es el argumento técnico principal para que Bitcoin tenga valor escaso, a diferencia del dinero fiat?',
        opts:[
          {t:'Está respaldado por oro en reservas criptográficas', ok:false},
          {t:'Su protocolo limita la emisión total a 21 millones de unidades', ok:true},
          {t:'Los gobiernos lo han reconocido como moneda de reserva', ok:false},
          {t:'Su velocidad de transacción supera al sistema bancario tradicional', ok:false},
        ],
        ok:'Correcto. La escasez de Bitcoin está garantizada por el código: solo existirán 21 millones. A diferencia de los bancos centrales, que pueden emitir dinero sin límite, el protocolo de Bitcoin no puede modificarse para crear más unidades. Esta escasez programada es el argumento fundamental de su valor.',
        bad:'El argumento de escasez: el protocolo de Bitcoin garantiza un máximo de 21 millones de unidades. Los bancos centrales pueden emitir dinero infinito; Bitcoin no. Esta diferencia es el núcleo del argumento de valor. No está respaldado por oro ni reconocido como moneda de reserva global.',
      },
      {type:'content', title:'Ethereum, DeFi y el Ecosistema Cripto',
        blocks:[
          {t:'text', h:'Ethereum: el ordenador mundial',
            p:'Mientras Bitcoin es principalmente una reserva de valor (el "oro digital"), Ethereum es una plataforma de contratos inteligentes. Un <strong>contrato inteligente</strong> es código que se ejecuta automáticamente cuando se cumplen condiciones, sin intermediarios. Sobre Ethereum se construye DeFi (finanzas descentralizadas): préstamos sin banco, exchanges sin corredor, seguros sin aseguradora. El valor de Ethereum depende del uso de su red, no solo de la escasez.'},
          {t:'stats', items:[
            {v:'2015',    l:'Año de lanzamiento de Ethereum'},
            {v:'>3.000',  l:'Aplicaciones descentralizadas (dApps) activas'},
            {v:'300B$',   l:'Total Value Locked en DeFi (capital en contratos)'},
          ]},
          {t:'hl', s:'info', label:'📊 CRIPTO EN TU PORTFOLIO: EL TAMAÑO IMPORTA',
            p:'Perfil conservador (jubilación, <10 años horizonte): 0-2% máximo. Perfil moderado (30-50 años): 3-7%. Perfil agresivo (inversión a largo plazo, alta tolerancia volatilidad): hasta 10-15%. Nunca invertas en cripto dinero que puedas necesitar en menos de 3-5 años. La liquidez 24/7 es una trampa: facilita las ventas emocionales en las caídas.'},
        ]
      },
      {type:'quiz',
        q:'¿Qué diferencia fundamental existe entre Bitcoin y Ethereum en su propósito y fuente de valor?',
        opts:[
          {t:'Bitcoin es más antiguo; Ethereum simplemente lo copia con mejoras', ok:false},
          {t:'Bitcoin es reserva de valor por escasez; Ethereum es plataforma de contratos inteligentes con valor por uso de red', ok:true},
          {t:'No hay diferencia fundamental, ambos son activos especulativos sin utilidad', ok:false},
          {t:'Bitcoin es legal en España; Ethereum tiene estatus regulatorio incierto', ok:false},
        ],
        ok:'Exacto. Bitcoin: reserva de valor (escasez fija de 21M, el "oro digital"). Ethereum: plataforma tecnológica (su valor deriva del uso de la red para contratos inteligentes, DeFi, NFTs). Son activos con tesis de inversión completamente distintas.',
        bad:'Son propósitos distintos: Bitcoin = reserva de valor por escasez. Ethereum = plataforma tecnológica cuyo valor depende del uso de su red. Invertir en ambos sin entender esta diferencia es como no entender qué estás comprando.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 24 — Planificación de la Jubilación: El FIRE y la Regla del 4%
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:24, icon:'🏝️', title:'FIRE y Jubilación Anticipada',
    desc:'La matemática de la independencia financiera y cómo calcular tu número de libertad',
    xp:40, tag:'INDEPENDENCIA', tagC:'green', users:'19.800',
    steps:[
      {type:'content', title:'La Regla del 4%: Tu Número de Libertad',
        blocks:[
          {t:'text', h:'¿Qué es FIRE?',
            p:'FIRE (Financial Independence, Retire Early) es un movimiento que aplica matemáticas simples a una pregunta: ¿cuánto capital necesito para que los intereses de mis inversiones cubran mis gastos indefinidamente? La respuesta viene del <strong>estudio Trinity</strong> (1998, actualizado 2021): un portfolio 60% acciones / 40% bonos puede sostener retiros del <strong>4% anual indefinidamente</strong>, con más del 95% de probabilidad de aguantar 30+ años. Esto fue probado incluyendo el crash del 29, la crisis del 73, el 2000 y el 2008.'},
          {t:'formula', f:'Capital necesario = Gastos anuales × 25', l:'Derivado de la Regla del 4%: 1 ÷ 4% = 25 multiplicador'},
          {t:'stats', items:[
            {v:'25×',  l:'Multiplicador para calcular tu número de libertad'},
            {v:'4%',   l:'Tasa de retirada sostenible (Trinity Study)'},
            {v:'>95%', l:'Probabilidad de que el portfolio sobreviva 30+ años'},
          ]},
          {t:'text', h:'Tu número de libertad: cálculo práctico',
            p:'Si tus gastos mensuales son 2.000€ → gastos anuales = 24.000€ → capital necesario = 24.000 × 25 = <strong>600.000€</strong>. Si reduces gastos a 1.500€ → necesitas solo <strong>450.000€</strong>. Cada 100€ de gasto mensual que reduces, tu número FIRE baja 30.000€. Esta asimetría explica por qué el ahorro agresivo es más poderoso que la rentabilidad de inversión: controlas el gasto completamente, la rentabilidad no.'},
          {t:'hl', s:'', label:'💡 FIRE NO ES SOLO PARA RICOS',
            p:'Una persona con 30.000€ de ingresos que ahorra el 50% puede alcanzar FIRE en menos de 17 años. Una con 100.000€ que ahorra solo el 10% tardará 40+ años. El factor crítico es la <strong>tasa de ahorro</strong>, no el nivel de ingresos. A mayor tasa de ahorro, doble efecto: acumulas más rápido Y necesitas menos capital final (porque tus gastos son menores).'},
        ]
      },
      {type:'quiz',
        q:'Tus gastos mensuales son €2.500. Siguiendo la Regla del 4%, ¿cuánto capital necesitas para la independencia financiera?',
        opts:[
          {t:'€500.000 (€2.500 × 200)', ok:false},
          {t:'€750.000 (€2.500 × 12 meses × 25)', ok:true},
          {t:'€300.000 (€2.500 × 120 meses × 1%)', ok:false},
          {t:'€1.000.000 (margen de seguridad extra)', ok:false},
        ],
        ok:'¡Correcto! €2.500/mes × 12 = €30.000/año. €30.000 × 25 = €750.000. Con €750.000 invertidos en un portfolio diversificado, puedes retirar €30.000/año indefinidamente según el Trinity Study con más del 95% de probabilidad de que el dinero no se agote en 30 años.',
        bad:'€2.500/mes × 12 meses = €30.000 anuales. €30.000 × 25 (multiplicador del 4%) = €750.000. Este es tu número FIRE. La Regla del 4% dice que puedes retirar €30.000/año de €750.000 de forma sostenible indefinidamente.',
      },
      {type:'content', title:'Las Variantes de FIRE: Fat, Lean y Barista',
        blocks:[
          {t:'text', h:'No hay un solo modelo FIRE',
            p:'<strong>Lean FIRE:</strong> gastos reducidos al mínimo (1.000-1.500€/mes). Número FIRE: 300.000-450.000€. Posible en 10-12 años con ingresos medios. Requiere vivir de forma austera. <strong>Fat FIRE:</strong> independencia con gastos elevados (4.000-6.000€/mes). Número: 1,2M-1,8M€. Para quienes no quieren renunciar a nada. <strong>Barista FIRE:</strong> el punto medio inteligente — acumulas suficiente para que las inversiones cubran el 70-80% de gastos y trabajas a tiempo parcial (barista, freelance) para cubrir el resto. El trabajo se vuelve opcional, no obligatorio.'},
          {t:'stats', items:[
            {v:'€300k-450k', l:'Lean FIRE · gastos 1.000-1.500€/mes'},
            {v:'€750k-1M',   l:'FIRE estándar · gastos 2.500-3.300€/mes'},
            {v:'€1,2M-1,8M', l:'Fat FIRE · gastos 4.000-6.000€/mes'},
          ]},
          {t:'hl', s:'info', label:'📊 TU TASA DE AHORRO MARCA EL RITMO',
            p:'Ahorrando el 10% de los ingresos: 40+ años para FIRE. Ahorrando el 25%: 32 años. Ahorrando el 50%: 17 años. Ahorrando el 75%: 7 años. La relación no es lineal — a mayor tasa de ahorro, el tiempo se comprime exponencialmente porque estás haciendo dos cosas a la vez: acumular más rápido y necesitar menos capital final.'},
        ]
      },
      {type:'quiz',
        q:'¿Qué modelo FIRE describe a alguien que trabaja a tiempo parcial porque sus inversiones cubren el 75% de sus gastos?',
        opts:[
          {t:'Lean FIRE — estilo de vida muy reducido', ok:false},
          {t:'Barista FIRE — independencia parcial con trabajo opcional', ok:true},
          {t:'Fat FIRE — gastos elevados cubiertos por inversiones', ok:false},
          {t:'Coast FIRE — capital ya suficiente para crecer solo hasta jubilación', ok:false},
        ],
        ok:'Barista FIRE: las inversiones cubren la mayoría de gastos y el trabajo a tiempo parcial cubre el resto. El trabajo deja de ser obligatorio — puedes elegirlo. Es el equilibrio más sostenible para quienes no quieren la austeridad Lean ni esperan al Fat FIRE.',
        bad:'Barista FIRE: inversiones cubren el 70-80% de gastos, trabajo parcial el 20-30%. El trabajo es opcional. Lean FIRE = austeridad máxima. Fat FIRE = gastos altos cubiertos al 100%. Coast FIRE = capital ya suficiente para crecer solo hasta la jubilación tradicional sin más aportaciones.',
      },
    ],
  },



  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 25 — Deuda Inteligente: No toda deuda es mala
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:25, icon:'💳', title:'Deuda Inteligente',
    desc:'La diferencia entre deuda que te empobrece y deuda que te enriquece',
    xp:30, tag:'DEUDA', tagC:'red', users:'27.600',
    steps:[
      {type:'content', title:'Deuda Buena vs Deuda Mala',
        blocks:[
          {t:'text', h:'No toda deuda es el enemigo',
            p:'La deuda es una herramienta. Como un martillo: sirve para construir o para hacerte daño dependiendo de cómo la uses. <strong>Deuda buena:</strong> tiene un coste de interés inferior al retorno del activo que financia. Una hipoteca al 3% para un piso que se revaloriza al 5% anual es deuda buena. Un préstamo estudiantil al 2% para una carrera que multiplica tus ingresos por 2 es deuda buena. <strong>Deuda mala:</strong> financia consumo que no genera retorno. Una tarjeta al 24% TAE para unas vacaciones. Un crédito al 18% para un coche que se deprecia. Un BNPL para ropa.'},
          {t:'stats', items:[
            {v:'<5%',   l:'TAE umbral por debajo del cual la deuda puede ser estratégica'},
            {v:'>15%',  l:'TAE a partir del cual la deuda destruye riqueza activamente'},
            {v:'72÷24=3', l:'Años para doblar una deuda al 24% TAE sin pagarla'},
          ]},
          {t:'text', h:'El apalancamiento: el arma de doble filo',
            p:'Los millonarios usan deuda para comprar activos. El banco te presta €200.000 al 3% para comprar un piso. Si ese piso vale €250.000 en 5 años, has ganado €50.000 con solo €40.000 de entrada propia — un retorno del 125% sobre tu capital. Esto es apalancamiento. El riesgo: si el piso baja, pierdes más que si hubieras comprado al contado. <strong>La deuda amplifica tanto las ganancias como las pérdidas.</strong>'},
          {t:'hl', s:'warn', label:'⚠️ LA REGLA DE ORO DE LA DEUDA',
            p:'Solo endeúdate si: (1) el tipo de interés es inferior a la rentabilidad del activo, (2) tienes ingresos estables para cubrir las cuotas con el 30% o menos de tu sueldo, y (3) tienes un fondo de emergencia intacto. Si falla cualquiera de las tres, la deuda te pone en riesgo de ruina financiera.'},
        ]
      },
      {type:'quiz',
        q:'¿Cuál de estas deudas podría considerarse "buena" desde el punto de vista de generación de riqueza?',
        opts:[
          {t:'Crédito revolving al 22% TAE para financiar vacaciones', ok:false},
          {t:'Hipoteca al 2,5% para comprar un piso que genera un alquiler neto del 4,5%', ok:true},
          {t:'BNPL al 0% para comprar un smartphone que se deprecia', ok:false},
          {t:'Préstamo personal al 8% para comprar un coche de segunda mano', ok:false},
        ],
        ok:'Correcto. La hipoteca al 2,5% financia un activo (piso) que rinde el 4,5% neto — el diferencial del 2% te hace ganar dinero con dinero prestado. Esto es apalancamiento positivo. Las otras opciones financian consumo o activos que se deprecian.',
        bad:'La hipoteca al 2,5% para un activo que rinde 4,5% es deuda buena: el diferencial positivo genera riqueza. El BNPL al 0% parece gratis pero el smartphone se deprecia — no genera retorno. Un coche al 8% combina deuda cara con activo que pierde valor.',
      },
      {type:'content', title:'Estrategias de Eliminación: Avalanche y Snowball',
        blocks:[
          {t:'text', h:'El método Avalanche: matemáticamente óptimo',
            p:'Pagas el mínimo en todas tus deudas. Todo el dinero extra va a la deuda con <strong>mayor tipo de interés</strong>. Cuando esa se elimina, el dinero liberado se suma al pago de la siguiente. Resultado: pagas el mínimo total en intereses. Es el método que maximiza el dinero que queda en tu bolsillo.'},
          {t:'text', h:'El método Snowball: psicológicamente superior',
            p:'Propuesto por Dave Ramsey: pagas el mínimo en todo, todo el extra va a la <strong>deuda más pequeña por saldo</strong>. Cuando la eliminas, la celebras y atacas la siguiente. El coste en intereses es ligeramente mayor que Avalanche, pero <strong>los estudios muestran que la mayoría abandona Avalanche y completa Snowball</strong> porque las victorias rápidas mantienen la motivación. El mejor método es el que realmente ejecutas.'},
          {t:'hl', s:'info', label:'📊 ¿CUÁNDO USAR CADA UNO?',
            p:'Usa <strong>Avalanche</strong> si eres disciplinado, las diferencias de interés son grandes (p.ej. 24% vs 5%) y prefieres optimizar matemáticamente. Usa <strong>Snowball</strong> si necesitas victorias rápidas para mantener la motivación, tienes muchas deudas pequeñas, o en el pasado has abandonado planes de pago. La diferencia real entre ambos métodos en intereses totales suele ser menor del 5-10%. La diferencia en completar el plan o no puede ser del 100%.'},
        ]
      },
      {type:'quiz',
        q:'Tienes 4 deudas: €500 al 8%, €2.000 al 22%, €800 al 5%, €3.000 al 15%. Con Avalanche, ¿a qué deuda destinas el dinero extra primero?',
        opts:[
          {t:'€500 al 8% — la más pequeña para una victoria rápida', ok:false},
          {t:'€2.000 al 22% — la de mayor tipo de interés', ok:true},
          {t:'€3.000 al 15% — la de mayor saldo pendiente', ok:false},
          {t:'€800 al 5% — la de menor tipo para eliminarla pronto', ok:false},
        ],
        ok:'Avalanche = mayor TAE primero. El 22% es el que más dinero te roba cada mes. Eliminarlo primero minimiza el total de intereses pagados. El orden Avalanche completo sería: 22% → 15% → 8% → 5%.',
        bad:'Avalanche prioriza el mayor tipo de interés: 22% → 15% → 8% → 5%. El 22% TAE te cobra más dinero cada mes que cualquier otra deuda. Cada día que no lo eliminas te cuesta más que cualquier otra alternativa.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 26 — ETFs e Indexación: La Estrategia que Bate al 90% de Gestores
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:26, icon:'📊', title:'ETFs e Indexación',
    desc:'Por qué el 90% de los fondos de gestión activa pierden contra el índice y cómo aprovecharlo',
    xp:35, tag:'INVERSIÓN', tagC:'blue', users:'33.100',
    steps:[
      {type:'content', title:'Qué es un ETF y por qué importa',
        blocks:[
          {t:'text', h:'ETF: la revolución de la inversión pasiva',
            p:'Un ETF (Exchange Traded Fund) es un fondo que cotiza en bolsa como una acción y replica el comportamiento de un índice. El <strong>MSCI World</strong> incluye 1.500 empresas de 23 países desarrollados. Comprando un solo ETF tienes participación en Apple, LVMH, Toyota, Nestlé y 1.496 empresas más. Coste anual: 0,10-0,20%. Frente a un fondo activo: 1,5-2,5% anual. Esa diferencia de 1,5% anual equivale a <strong>€100.000 menos en un portfolio de €200.000 a 20 años</strong>.'},
          {t:'stats', items:[
            {v:'90%',   l:'Fondos activos que NO superan al índice en 15 años (S&P SPIVA 2023)'},
            {v:'0,07%', l:'TER anual del ETF Vanguard FTSE All-World (VWCE)'},
            {v:'1,8%',  l:'TER medio de fondos activos españoles de RV global'},
          ]},
          {t:'text', h:'Los ETFs más importantes para un inversor español',
            p:'<strong>VWCE (Vanguard All-World Acc):</strong> 3.700+ empresas de todo el mundo. El más diversificado. <strong>IWDA (iShares Core MSCI World):</strong> 1.500+ empresas de países desarrollados. El más popular en Europa. <strong>EIMI (iShares MSCI EM IMI):</strong> mercados emergentes (China, India, Brasil). Complementa a IWDA. <strong>IQQP (iShares MSCI World Quality):</strong> empresas de alta calidad con balance sólido. Alternativa ligeramente activa. Un portfolio 80% IWDA + 20% EIMI replica el mundo entero por menos de 0,15% anual.'},
          {t:'hl', s:'', label:'💡 EL ARGUMENTO MATEMÁTICO IRREFUTABLE',
            p:'Si el mercado es la suma de todos los participantes, el participante promedio OBTIENE el retorno del mercado ANTES de costes. Tras costes, el gestor activo promedio PIERDE contra el índice por exactamente su comisión. El mercado es un juego de suma cero donde la única ventaja sostenible es pagar menos comisiones. Los ETFs ganan por definición matemática, no por suerte.'},
        ]
      },
      {type:'quiz',
        q:'Según el informe SPIVA 2023, ¿qué porcentaje de fondos de gestión activa NO supera al índice de referencia en un período de 15 años?',
        opts:[
          {t:'Alrededor del 50% — los mercados son eficientes a medias', ok:false},
          {t:'Alrededor del 70% — la mayoría pero no todos', ok:false},
          {t:'Alrededor del 90% — la gestión activa rara vez gana a largo plazo', ok:true},
          {t:'Alrededor del 30% — los gestores tienen ventaja informacional', ok:false},
        ],
        ok:'Correcto. El 90% de los fondos activos NO baten al índice en 15 años, según SPIVA. Y el 10% que lo logra no es predecible de antemano — no puedes saber qué fondo ganará el próximo año. Por eso la indexación es la estrategia racional por defecto.',
        bad:'El 90% de los fondos activos pierde contra el índice en 15 años (SPIVA 2023). Esto no es una opinión sino datos. La razón matemática: el mercado es la suma de los participantes. El fondo activo promedio = retorno del mercado − comisiones. Las comisiones aseguran que la mayoría pierda.',
      },
      {type:'content', title:'Cómo Construir un Portfolio de ETFs en España',
        blocks:[
          {t:'text', h:'La cartera permanente para el inversor pasivo español',
            p:'El portfolio más simple y documentado para un inversor largo plazo: <strong>100% VWCE</strong> si eres joven y con alta tolerancia al riesgo. <strong>80% VWCE + 20% bonos (AGGH)</strong> si quieres reducir volatilidad. <strong>60% VWCE + 30% bonos + 10% oro (SGLN)</strong> si tu horizonte es inferior a 10 años. El rebalanceo anual (volver a los pesos originales) añade entre 0,3-0,5% de rentabilidad extra con menos riesgo.'},
          {t:'text', h:'Dónde comprar ETFs en España',
            p:'Los mejores brokers para ETFs en España por coste: <strong>DEGIRO</strong> (€1-2 por operación, sin custodia, plataforma sencilla). <strong>Interactive Brokers</strong> (el más barato para portfolios grandes, más complejo). <strong>MyInvestor</strong> (broker español, cuenta remunerada, también fondos indexados sin ETFs). Evita los ETFs de tu banco habitual: los venden pero añaden márgenes de hasta el 1% extra. La fiscalidad es idéntica en todos: ganancias tributan en base del ahorro (19-28% IRPF).'},
          {t:'hl', s:'info', label:'📊 EL PLAN DE 3 PASOS',
            p:'Paso 1: Abre una cuenta en DEGIRO o Interactive Brokers (15 min online). Paso 2: Configura una transferencia automática mensual el día 1 de cada mes. Paso 3: Compra VWCE con todo el dinero disponible ese día — sin analizar si el momento es bueno. Revisa una vez al año. Ese es todo el sistema. La disciplina de no mirar supera en rentabilidad a cualquier análisis sofisticado.'},
        ]
      },
      {type:'quiz',
        q:'¿Cuál es el argumento matemático fundamental por el que los ETFs indexados superan a la gestión activa a largo plazo?',
        opts:[
          {t:'Los ETFs tienen mejores algoritmos de selección de activos', ok:false},
          {t:'El inversor medio del mercado = retorno del mercado; tras comisiones la gestión activa media pierde por definición', ok:true},
          {t:'Los índices incluyen más empresas y eso reduce el riesgo sistemáticamente', ok:false},
          {t:'Los ETFs están exentos de impuestos en España', ok:false},
        ],
        ok:'El argumento matemático: todos los participantes del mercado en conjunto obtienen el retorno del mercado. Tras comisiones, la gestión activa promedio obtiene: retorno mercado − comisiones. Por definición matemática, la gestión activa promedio pierde. Ganar a largo plazo requiere estar consistentemente en el 10% superior, algo impredecible.',
        bad:'La lógica es pura matemática: el mercado es la suma de todos los participantes. En conjunto obtienen el retorno del mercado. Cada uno que paga comisiones obtiene menos que el mercado. La gestión activa promedio = mercado − comisiones = pérdida relativa garantizada. No es suerte: es aritmética.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 27 — Negociación Salarial: El Activo Más Infravalorado
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:27, icon:'🤝', title:'Negociación Salarial',
    desc:'Cómo conseguir un 10-20% más de sueldo con técnicas probadas — la habilidad con mejor ROI de tu vida',
    xp:30, tag:'CARRERA', tagC:'purple', users:'24.900',
    steps:[
      {type:'content', title:'Por Qué Negociar es la Inversión con Mejor ROI',
        blocks:[
          {t:'text', h:'Una conversación vale €200.000',
            p:'Imagina que negocias tu próximo sueldo y consigues €3.000 más al año. Si repites eso en cada cambio de trabajo durante 30 años, con el efecto acumulado sobre todos los beneficios vinculados al sueldo (pensión, complementos, bases para créditos), la diferencia total supera los €200.000. <strong>No existe ninguna inversión financiera con un ROI equivalente a 30 minutos de conversación.</strong> Sin embargo, el 60% de los trabajadores nunca negocia su primer sueldo.'},
          {t:'stats', items:[
            {v:'60%',    l:'Trabajadores que aceptan la primera oferta sin negociar (LinkedIn 2023)'},
            {v:'+18%',   l:'Sueldo adicional medio conseguido cuando se negocia con datos'},
            {v:'>€200k', l:'Impacto acumulado a 30 años de una negociación de €3.000/año'},
          ]},
          {t:'text', h:'El marco BATNA: tu poder de negociación real',
            p:'BATNA (Best Alternative To a Negotiated Agreement) es la alternativa que tienes si la negociación fracasa. Tu BATNA determina cuánto poder tienes. Si tu BATNA es "ninguna otra oferta", negociarás desde la debilidad. Si tu BATNA es "tengo otra oferta de €45.000", negociarás desde la fortaleza. <strong>La preparación pre-negociación es conseguir el mejor BATNA posible:</strong> entrevistas activas, ofertas reales, certificaciones que incrementen tu valor de mercado.'},
          {t:'hl', s:'', label:'💡 LA TÉCNICA DEL SILENCIO',
            p:'Cuando hagas tu petición de sueldo, calla. El silencio incómodo que sigue es un arma poderosa. La persona que habla primero después de una cifra suele hacer concesiones. Practica decir "Estoy buscando entre €X y €Y, basándome en el mercado actual y mis resultados" y luego espera. El silencio trabaja para ti.'},
        ]
      },
      {type:'quiz',
        q:'¿Qué es el BATNA en una negociación salarial y por qué determina tu poder de negociación?',
        opts:[
          {t:'El sueldo máximo que ofrece la empresa según su banda salarial interna', ok:false},
          {t:'Tu mejor alternativa si la negociación fracasa — define cuánto puedes ceder', ok:true},
          {t:'El beneficio neto anual total (Base + bonus + beneficios)', ok:false},
          {t:'La técnica de anclar alto para negociar hacia abajo', ok:false},
        ],
        ok:'BATNA = Best Alternative To a Negotiated Agreement. Si tienes buenas alternativas (otra oferta, tu negocio, alta demanda de tu perfil), puedes rechazar ofertas bajas sin miedo. Si no tienes alternativas, cualquier oferta te parece aceptable. La negociación empieza antes de sentarte a negociar: mejorando tu BATNA.',
        bad:'BATNA es tu mejor alternativa si la negociación falla. Si tienes otra oferta de €45k, no aceptarás €40k. Si no tienes alternativas, aceptarás lo que te den. Por eso la preparación pre-negociación (entrevistas activas, ofertas en paralelo) es más valiosa que las técnicas de negociación en sí.',
      },
      {type:'content', title:'El Guión de Negociación que Funciona',
        blocks:[
          {t:'text', h:'Paso 1: Investiga el mercado antes de entrar',
            p:'Usa Glassdoor, LinkedIn Salary, Infojobs y la red de contactos del sector para conocer el rango real del puesto. Prepara tres cifras: tu objetivo real (lo que quieres), tu ancla alta (un 15-20% por encima del objetivo, para dar margen), y tu mínimo aceptable (por debajo del cual rechazarías). Nunca digas el mínimo primero.'},
          {t:'text', h:'Paso 2: El guión en 4 frases',
            p:'<strong>Apertura:</strong> "Estoy muy interesado en unirme al equipo y creo que puedo aportar [X resultado específico]." <strong>Petición:</strong> "Basándome en mi experiencia en [logro], el mercado actual para este perfil, y lo que aporto, estoy buscando un salario de [cifra ancla]." <strong>Silencio.</strong> <strong>Si contraoferta baja:</strong> "Entiendo. ¿Hay flexibilidad para llegar a [cifra objetivo]? O si el base tiene un techo, ¿podemos hablar de [beneficio alternativo: bonus, días remotos, formación]?"'},
          {t:'hl', s:'info', label:'📊 LO QUE PUEDES NEGOCIAR ADEMÁS DEL SUELDO',
            p:'El salario base no es todo. Igualmente valioso: días de trabajo remoto (valor económico: €1.500-4.000/año en transporte y tiempo), días extra de vacaciones (cada día adicional = sueldo_diario de valor), budget de formación (€500-2.000/año), bonus por objetivos, fecha de revisión salarial en 6 meses en lugar de 12, ticket restaurante o guardería (exento de IRPF). A veces el techo salarial es real; los beneficios no tienen el mismo techo.'},
        ]
      },
      {type:'quiz',
        q:'En una negociación salarial, acabas de decir tu cifra objetivo. La otra persona guarda silencio. ¿Qué debes hacer?',
        opts:[
          {t:'Bajar tu cifra inmediatamente para reducir la tensión', ok:false},
          {t:'Justificar por qué mereces esa cifra con más argumentos', ok:false},
          {t:'Mantener el silencio — quien habla primero suele hacer concesiones', ok:true},
          {t:'Preguntar si hay algo que les parezca poco razonable', ok:false},
        ],
        ok:'El silencio es la técnica más poderosa en negociación. El instinto es llenarlo con concesiones. Resiste. El silencio trabaja para ti: la otra persona siente la presión de responder y frecuentemente hace una contrapropuesta o justifica por qué no puede llegar a esa cifra — información valiosa para continuar.',
        bad:'Mantén el silencio. Hablar primero después de hacer una petición es la trampa más común: te lleva a bajar tu cifra antes de que la otra parte haya dicho que no puede. El silencio crea presión sobre el interlocutor, no sobre ti. Es incómodo practicarlo pero es la técnica de mayor impacto.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 28 — Inflación: El Ladrón Silencioso y Cómo Protegerse
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:28, icon:'📉', title:'Inflación y Protección',
    desc:'Cómo el 3% anual destruye el 60% de tu poder adquisitivo en 30 años y los activos que protegen',
    xp:30, tag:'MACROECONOMÍA', tagC:'orange', users:'20.300',
    steps:[
      {type:'content', title:'Inflación: El Impuesto que Nadie Vota',
        blocks:[
          {t:'text', h:'La erosión invisible',
            p:'€100.000 en efectivo hoy, con una inflación del 3% anual, valen <strong>€40.800 en 30 años</strong> en términos de poder adquisitivo — una pérdida del 59% sin hacer nada malo. La inflación no aparece en tu cuenta bancaria: el saldo sigue siendo €100.000. Pero con ese dinero puedes comprar cada vez menos. El banco te ofrece un 2% en depósitos mientras la inflación es del 3%: estás perdiendo el 1% real cada año, garantizado, con "seguridad".'},
          {t:'formula', f:'Tipo de interés real = Tipo nominal − Inflación', l:'Si cobras 2% pero la inflación es 3%, tu rendimiento real es −1%'},
          {t:'stats', items:[
            {v:'€40.800',  l:'Valor real de €100.000 al cabo de 30 años con inflación del 3%'},
            {v:'-1%',      l:'Rendimiento real de un depósito al 2% con inflación al 3%'},
            {v:'2,5-3,5%', l:'Inflación media histórica en España (últimas 3 décadas)'},
          ]},
          {t:'hl', s:'warn', label:'⚠️ EL DINERO EN CUENTA CORRIENTE SE DERRITE',
            p:'Una cuenta corriente al 0% con inflación del 3% destruye el 26% del poder adquisitivo en 10 años. En 20 años, el 45%. El efectivo solo tiene sentido para el fondo de emergencia (3-6 meses de gastos). El resto debe estar en activos que superen la inflación. El riesgo de no invertir es tan real como el riesgo de invertir — simplemente es más lento y menos visible.'},
        ]
      },
      {type:'quiz',
        q:'Si tienes €50.000 en un depósito al 1,5% anual y la inflación es del 3,5%, ¿cuál es tu rendimiento real y qué ocurre con tu poder adquisitivo?',
        opts:[
          {t:'+1,5% real — el depósito siempre protege el capital', ok:false},
          {t:'-2% real — pierdes poder adquisitivo aunque el saldo nominal crezca', ok:true},
          {t:'0% real — el depósito cubre exactamente la inflación', ok:false},
          {t:'+5% real — la suma de depósito e inflación da ganancia', ok:false},
        ],
        ok:'Correcto. Rendimiento real = 1,5% − 3,5% = −2%. Tu saldo nominal crece, pero tu poder adquisitivo mengua un 2% anual. En 10 años, esos €50.000 compran lo que hoy compraría €41.000. El banco te hace sentir seguro mientras te empobrece lentamente.',
        bad:'Rendimiento real = tipo nominal − inflación = 1,5% − 3,5% = −2%. El saldo nominal sube, pero el poder adquisitivo cae. Esta es la trampa del "depósito seguro": la seguridad es nominal, no real. Invertir no es el riesgo — no invertir tiene un coste garantizado del −2% real anual en este escenario.',
      },
      {type:'content', title:'Activos que Protegen de la Inflación',
        blocks:[
          {t:'text', h:'La jerarquía de protección antiinflación',
            p:'<strong>Acciones (bolsa):</strong> el mejor escudo histórico. Las empresas suben precios cuando hay inflación, trasladando el coste al consumidor. El S&P 500 ha dado +7% real anual históricamente. <strong>Inmobiliario:</strong> los alquileres y el valor del suelo tienden a seguir la inflación. Limitación: iliquidez. <strong>TIPS / Bonos indexados:</strong> su principal aumenta con el IPC. Bajo riesgo pero bajo retorno. <strong>Oro:</strong> reserva de valor a muy largo plazo pero sin rendimiento recurrente y alta volatilidad en el corto. <strong>Cripto:</strong> altamente especulativo, sin relación probada con la inflación.'},
          {t:'stats', items:[
            {v:'+7%',    l:'Rentabilidad real histórica del S&P 500 (descontada inflación)'},
            {v:'+0,5%',  l:'Rentabilidad real histórica del oro (largo plazo)'},
            {v:'−1,5%',  l:'Rentabilidad real típica de un depósito en entorno inflacionario'},
          ]},
          {t:'hl', s:'info', label:'📊 LA CARTERA ANTIINFLACIÓN PRÁCTICA',
            p:'Para protegerse de la inflación sin complejidad: 70% acciones globales (VWCE o equivalente), 15% inmobiliario (REIT ETF o inmueble físico), 10% bonos indexados a inflación (TIPS ETF), 5% oro (ETF físico como SGLN). Esta combinación ha batido a la inflación en todos los períodos de 10+ años desde 1970, incluyendo el shock del 73 y la estanflación de los 80.'},
        ]
      },
      {type:'quiz',
        q:'¿Por qué las acciones son históricamente el mejor escudo contra la inflación entre los activos comunes?',
        opts:[
          {t:'Porque están reguladas por el BCE y tienen garantía de rentabilidad', ok:false},
          {t:'Porque las empresas trasladan la inflación a sus precios, manteniendo márgenes y valor real', ok:true},
          {t:'Porque el precio de las acciones siempre sube con la inflación automáticamente', ok:false},
          {t:'Porque los dividendos están exentos de tributación en períodos inflacionarios', ok:false},
        ],
        ok:'Las empresas son propietarias de activos reales (fábricas, marcas, tecnología) y pueden subir precios cuando los costes aumentan. Esto preserva sus márgenes y el valor real del negocio. Por eso el S&P 500 ha dado un +7% real anual históricamente, superando con creces cualquier alternativa.',
        bad:'Las empresas poseen activos reales y tienen poder de fijación de precios. Cuando la inflación sube, suben sus precios de venta, manteniendo márgenes. El valor real del negocio se preserva. Esto explica el +7% real histórico del S&P 500 incluso descontando períodos inflacionarios.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 29 — El Fondo de Emergencia: El Cimiento de Todo
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:29, icon:'🛡️', title:'El Fondo de Emergencia',
    desc:'Por qué sin fondo de emergencia todo lo demás falla — y cómo construirlo en 90 días',
    xp:20, tag:'FUNDAMENTAL', tagC:'green', users:'38.700',
    steps:[
      {type:'content', title:'El Cimiento que Hace que Todo lo Demás Funcione',
        blocks:[
          {t:'text', h:'¿Por qué el fondo de emergencia primero?',
            p:'Sin fondo de emergencia, cualquier imprevisto (avería del coche, pérdida de trabajo, gasto médico) te fuerza a una de estas opciones: endeudarte (tarjeta al 22% TAE), vender inversiones en el peor momento (crash de mercado), o pedir dinero a familia. El fondo de emergencia no es una inversión — es un seguro. Su función es eliminar la posibilidad de que un evento aleatorio destruya tu plan financiero. <strong>Sin él, toda tu arquitectura financiera es frágil.</strong>'},
          {t:'stats', items:[
            {v:'67%',      l:'Españoles que no podrían cubrir un gasto imprevisto de €1.000 (Banco de España)'},
            {v:'3-6 meses',l:'De gastos totales: tamaño óptimo del fondo de emergencia'},
            {v:'0%',       l:'Rentabilidad esperada — es un seguro, no una inversión'},
          ]},
          {t:'text', h:'¿Cuánto necesitas exactamente?',
            p:'Calcula tus gastos mensuales esenciales: alquiler/hipoteca, alimentación, suministros, transporte, seguros, mínimos de deudas. Multiplica por 3 si tu empleo es estable (funcionario, empresa consolidada). Multiplica por 6 si eres autónomo, freelance, sector volátil, o tienes dependientes. Si tienes hipoteca, añade 3 cuotas extra. Este dinero debe estar en una cuenta <strong>separada, líquida, y aburrida</strong> — cuenta remunerada o fondo monetario, no en bolsa.'},
          {t:'hl', s:'', label:'💡 DÓNDE GUARDARLO EN 2024',
            p:'Las mejores opciones para el fondo de emergencia en España: <strong>Cuenta remunerada MyInvestor al 2,5%</strong> (liquidez inmediata, FGDS garantizado hasta €100k). <strong>OCU Investments fondo monetario</strong> (~3,5% TAE, reembolso en 24-48h). <strong>Letras del Tesoro a 3 meses</strong> (~3,6% en 2024, liquidez en mercado secundario). Nunca en bolsa, ETFs, ni criptomonedas: la volatilidad elimina la función de seguro.'},
        ]
      },
      {type:'quiz',
        q:'Eres autónomo con gastos mensuales esenciales de €1.800. ¿Cuál es el tamaño mínimo recomendado para tu fondo de emergencia?',
        opts:[
          {t:'€1.800 — un mes de gastos es suficiente para empezar', ok:false},
          {t:'€5.400 — 3 meses estándar independiente del tipo de empleo', ok:false},
          {t:'€10.800 — 6 meses, porque el autónomo tiene mayor volatilidad de ingresos', ok:true},
          {t:'€21.600 — 12 meses para máxima seguridad', ok:false},
        ],
        ok:'Para autónomos, freelances y trabajadores con ingresos variables: 6 meses de gastos esenciales. €1.800 × 6 = €10.800. La razón: un empleado puede encontrar trabajo nuevo en 1-3 meses. Un autónomo puede tardar 3-6 meses en recuperar el nivel de ingresos tras perder un cliente clave.',
        bad:'Autónomo = 6 meses mínimo. €1.800 × 6 = €10.800. Los autónomos tienen ingresos variables y pueden tardar meses en recuperar clientes. Con 3 meses de fondo, una racha mala de 4 meses te lleva a endeudarte o vender inversiones en el peor momento. El fondo de emergencia más largo que necesites es el correcto.',
      },
      {type:'content', title:'Construir el Fondo en 90 Días',
        blocks:[
          {t:'text', h:'El plan de 90 días para llegar a 3 meses de fondo',
            p:'Si tu objetivo es €6.000 en 90 días, necesitas ahorrar €2.000/mes. Si parece mucho, aplica estas palancas: (1) <strong>Auditoría de suscripciones:</strong> el 68% de personas tiene suscripciones activas que no usa (Netflix, Spotify, apps). Media: €80-120€/mes de ahorro inmediato. (2) <strong>Regla de los 30 días:</strong> para cualquier compra no esencial mayor de €50, espera 30 días. El 80% desaparece. (3) <strong>Transferencia automática el día 1:</strong> el ahorro que no ves no se gasta. Configurar la transferencia antes de tener acceso al dinero es la táctica más poderosa.'},
          {t:'hl', s:'info', label:'📊 LA ESCALERA DEL FONDO DE EMERGENCIA',
            p:'Semana 1: Audita gastos y cancela suscripciones innecesarias. Mes 1: Consigue €1.000 — el "mini fondo" que cubre el 80% de las emergencias reales. Mes 2-3: Llega a 1 mes de gastos. Meses 4-6: Completa hasta 3-6 meses. Una vez completo, no lo toques excepto para emergencias reales. Un viaje no es una emergencia. Una nueva consola no es una emergencia. Un coche averiado o un mes sin ingresos sí lo son.'},
        ]
      },
      {type:'quiz',
        q:'¿Por qué el fondo de emergencia NO debe invertirse en bolsa o ETFs aunque den mayor rentabilidad?',
        opts:[
          {t:'Porque las cuentas bancarias tienen mejor fiscalidad que los ETFs', ok:false},
          {t:'Porque la volatilidad podría hacer que el fondo valiera menos justo cuando más lo necesitas', ok:true},
          {t:'Porque el CNMV prohíbe usar ETFs como fondo de emergencia', ok:false},
          {t:'Porque los ETFs tienen costes de reembolso que reducen la liquidez', ok:false},
        ],
        ok:'La función del fondo de emergencia es estar disponible y estable cuando lo necesitas. Un mercado bajista del −40% coincide frecuentemente con períodos de crisis económica y paro — exactamente cuando necesitarías el fondo. Con bolsa, tendrías que vender con −40% de pérdida. La rentabilidad del fondo es secundaria a su disponibilidad y estabilidad.',
        bad:'La volatilidad es el problema clave. Las crisis económicas (cuando pierdes trabajo) coinciden con mercados bajistas. Si tu fondo está en bolsa y cae un 40% justo cuando te quedas sin ingresos, tienes que vender con pérdidas. El fondo de emergencia renuncia a rentabilidad a cambio de estabilidad garantizada. Ese es el trato correcto.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 30 — Análisis Técnico vs Fundamental
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:30, icon:'📊', title:'Análisis Técnico vs Fundamental',
    desc:'Dos formas de ver el mercado. Una de ellas funciona mejor.',
    xp:25, tag:'AVANZADO', tagC:'blue', users:'18.200',
    steps:[
      {type:'content', tag:'📊 Módulo 30', title:'¿Qué mueve el precio de una acción?',
        intro:'Todo inversor enfrenta la misma pregunta: ¿cuándo comprar? Hay dos grandes escuelas de respuesta. El análisis fundamental dice: estudia la empresa, sus ingresos, su deuda, su ventaja competitiva. El análisis técnico dice: estudia el gráfico, los patrones, el volumen. ¿Quién tiene razón?',
        bullets:['📐 Análisis fundamental: valora la empresa real (ingresos, EBITDA, moat)','📈 Análisis técnico: estudia patrones de precio y volumen','🧪 Ambos buscan predecir el futuro con herramientas del pasado','🎯 El consenso académico favorece claramente al fundamental para inversión a largo plazo'],
        fact:'Warren Buffett, el mejor inversor de la historia, jamás ha usado un gráfico de velas. Solo analiza los fundamentales de empresas.'},
      {type:'content', tag:'📊 Módulo 30', title:'Análisis Fundamental: El Motor Real',
        intro:'El análisis fundamental parte de una premisa simple: el precio de una acción debería reflejar el valor real de la empresa. Si el precio está por debajo del valor real → oportunidad de compra. Si está por encima → posible burbuja.',
        bullets:['💰 PER (Price-to-Earnings): cuántas veces pagas los beneficios. PER 15 = normal, PER 40 = caro','📦 P/B (Price-to-Book): pagas menos de lo que vale el activo neto','💸 Free Cash Flow: el dinero real que genera (más honesto que el beneficio contable)','🏰 Moat: la ventaja competitiva que protege los beneficios futuros (marca, red, coste de cambio)','📉 Deuda/EBITDA: cuántos años de beneficios necesita para pagar su deuda'],
        fact:'Peter Lynch analizó más de 1.000 empresas en persona antes de invertir. Su fondo Magellan batió al mercado 13 años consecutivos.'},
      {type:'content', tag:'📊 Módulo 30', title:'Análisis Técnico: Lo Que los Gráficos Dicen (y No)',
        intro:'El análisis técnico asume que "el precio lo descuenta todo" y que los patrones del pasado se repiten. Usa velas japonesas, medias móviles, RSI, MACD y soportes/resistencias para decidir cuándo entrar y salir.',
        bullets:['🕯️ Velas japonesas: cada vela = apertura, máximo, mínimo y cierre de un período','📉 Media móvil 200: separador entre tendencia alcista y bajista','📊 RSI > 70 = sobrecomprado, RSI < 30 = sobrevendido','🎯 Soportes/Resistencias: niveles donde el precio ha rebotado históricamente','⚠️ Problema: si todos ven el mismo patrón, el mercado lo arbitraje y deja de funcionar'],
        fact:'Un estudio del MIT analizó 50 años de datos del S&P 500: los patrones técnicos más usados no generan alpha estadísticamente significativo.'},
      {type:'quiz', tag:'📊 Quiz', title:'¿Qué métrica fundamental mide si una acción está cara?',
        opts:['El volumen de trading diario','El PER (Price-to-Earnings Ratio)','La media móvil de 200 días','El número de analistas que la siguen'], correct:1,
        exp:'El PER compara el precio con los beneficios. Un PER de 15 significa que pagas 15 años de beneficios actuales. Por encima de 25-30 empieza a ser caro en términos históricos.'},
      {type:'quiz', tag:'📊 Quiz', title:'¿Cuál es la crítica principal al análisis técnico?',
        opts:['Requiere demasiado tiempo','Los patrones reconocidos se arbitrajan y pierden efectividad','Es demasiado complicado para el inversor medio','Solo funciona en mercados alcistas'], correct:1,
        exp:'Si miles de traders ven el mismo "patrón de cabeza y hombros", actuarán antes de que se complete y destruirán el patrón. La eficiencia del mercado erosiona las señales técnicas.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 31 — El Poder del Apalancamiento
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:31, icon:'⚖️', title:'Apalancamiento: Arma de Doble Filo',
    desc:'El apalancamiento puede multiplicar tus ganancias. O destruirte.',
    xp:30, tag:'RIESGO', tagC:'red', users:'12.800',
    steps:[
      {type:'content', tag:'⚖️ Módulo 31', title:'¿Qué es el Apalancamiento?',
        intro:'El apalancamiento es invertir con dinero prestado para amplificar el resultado. Si inviertes €10.000 propios y pides €90.000 prestados, controlas €100.000. Una subida del 10% te da €10.000 (100% sobre tu capital). Una bajada del 10% te deja sin nada.',
        bullets:['🔺 Apalancamiento 10:1 = controlas 10€ por cada 1€ propio','📈 Ganancias amplificadas proporcionalmente al apalancamiento','📉 Pérdidas igualmente amplificadas — asimétricas con la ruina','⚠️ Margin call: cuando las pérdidas superan tu capital, te cierran la posición','🏦 Hipoteca = apalancamiento controlado en inmobiliario (3:1 a 5:1 típico)'],
        fact:'LTCM, el fondo con los dos premios Nobel de Economía, quebró en 1998 con apalancamiento de 25:1. Perdió €4.600 millones en semanas.'},
      {type:'content', tag:'⚖️ Módulo 31', title:'Usos Razonables del Apalancamiento',
        intro:'No todo apalancamiento es especulación suicida. La hipoteca es apalancamiento. Un préstamo para montar un negocio rentable es apalancamiento. La clave está en el diferencial entre el coste del dinero y la rentabilidad del activo.',
        bullets:['🏠 Hipoteca al 3%: si el inmueble sube un 5% anual, el apalancamiento trabaja a tu favor','🏢 Préstamo empresarial al 6%: si el negocio da un 20%, el apalancamiento es inteligente','📊 ETFs apalancados 2x o 3x: para especulación a corto plazo, no para carteras a largo','💀 CFDs, opciones, futuros: apalancamientos de 50:1 a 100:1 — territorio de ruina para el 90%','✅ Regla: apalancamiento sensato = solo si el rendimiento esperado supera el coste del capital por margen amplio'],
        fact:'El 74% de los inversores minoristas en CFDs pierde dinero según la CNMV española. La principal causa: apalancamiento excesivo.'},
      {type:'quiz', tag:'⚖️ Quiz', title:'Tienes €5.000 e inviertes con apalancamiento 5:1 (controlas €25.000). El activo cae un 20%. ¿Cuánto pierdes?',
        opts:['€1.000 (20% de tus €5.000)','€5.000 (toda tu inversión inicial)','€25.000 (más de lo invertido)','€2.500 (50% de tu capital)'], correct:1,
        exp:'Con 5:1 controlas €25.000. Una caída del 20% = €5.000 de pérdida = EXACTAMENTE tu capital inicial. Quedas a cero. Con 5:1 solo necesitas un movimiento del 20% en contra para perderlo todo.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 32 — Sesiones de la Bolsa y Microestructura de Mercado
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:32, icon:'🕐', title:'Cómo Funciona la Bolsa por Dentro',
    desc:'Market makers, spreads, liquidez y por qué el horario importa.',
    xp:20, tag:'TÉCNICO', tagC:'blue', users:'9.400',
    steps:[
      {type:'content', tag:'🕐 Módulo 32', title:'La Mecánica del Mercado',
        intro:'Cuando pulsas "comprar" en tu broker, no estás comprando directamente a otro inversor. Hay toda una infraestructura invisible: market makers, libros de órdenes, cámaras de compensación y reguladores. Entenderla te hace mejor inversor.',
        bullets:['📋 Libro de órdenes: lista de compradores (bid) y vendedores (ask) con sus precios','💹 Spread: diferencia entre bid y ask — el coste invisible de cada operación','🤝 Market maker: instituciones que garantizan liquidez comprando y vendiendo continuamente','⏰ Sesiones: NYSE (15:30-22:00 hora española), Bolsa Madrid (9:00-17:35)','📊 Pre-market y after-hours: volumen bajo, spreads amplios, precios menos fiables'],
        fact:'El spread del IBEX 35 en hora punta es 0,01%. En pre-market puede ser 10 veces mayor. Operar fuera de horario te sale caro.'},
      {type:'quiz', tag:'🕐 Quiz', title:'¿Qué es el "spread" en bolsa?',
        opts:['El impuesto sobre ganancias bursátiles','La diferencia entre el precio de compra y el de venta','El porcentaje de comisión del broker','La diferencia entre el precio mínimo y máximo del día'], correct:1,
        exp:'El spread es el coste oculto de cada operación. Si el bid es 99,90€ y el ask es 100,10€, el spread es 0,20€. Cada vez que compras y vendes, pagas ese diferencial aunque el precio no se mueva.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 33 — Comportamiento del Inversor en Crisis
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:33, icon:'🧠', title:'Cómo No Perder la Cabeza en un Crash',
    desc:'El manual de supervivencia psicológica para cuando el mercado se hunde.',
    xp:30, tag:'PSICOLOGÍA', tagC:'purple', users:'31.500',
    steps:[
      {type:'content', tag:'🧠 Módulo 33', title:'Por Qué el Crash del 2008 Arruinó a Gente con Razón',
        intro:'El S&P 500 cayó un 56% entre 2007 y 2009. Muchos inversores que tenían buenas empresas, bien diversificadas, vendieron con pérdidas en el peor momento. No porque su tesis fuera incorrecta, sino porque el pánico venció a la razón. Luego el mercado se recuperó y marcó nuevos máximos.',
        bullets:['📉 Crash = caída > 20% desde el máximo reciente','😱 El pánico es contagioso: las caídas se aceleran cuando todos venden a la vez','🧠 Corteza prefrontal vs amígdala: el miedo desconecta la razón','📺 Los medios amplifican el pánico — cada crash "es el peor de la historia"','📊 Históricamente: el S&P 500 se ha recuperado de TODOS los crashes, sin excepción'],
        fact:'Los inversores que vendieron en marzo de 2009 (el mínimo del crash de 2008) y no volvieron a entrar, perdieron la mayor recuperación de la historia: +400% en los siguientes 11 años.'},
      {type:'content', tag:'🧠 Módulo 33', title:'El Plan de Acción Para el Próximo Crash',
        intro:'El próximo crash llegará. No sabes cuándo. Lo que sí puedes hacer es prepararte emocionalmente y técnicamente ANTES de que ocurra, cuando no hay presión.',
        bullets:['📝 Escribe tu política de inversión: qué harás si cae 20%, 40%, 60%','💰 Ten el fondo de emergencia completo ANTES de invertir — sin él, te verás obligado a vender','📅 DCA automático: las aportaciones periódicas compran más barato en los crashes','🔕 Desconéctate de las noticias durante las caídas — cada headline está diseñado para el miedo','📊 Mira el gráfico histórico a 20 años: cada "crisis" parece un bache diminuto'],
        fact:'Un estudio de Fidelity analizó qué cuentas habían tenido mejor rendimiento en 10 años. El resultado: las de clientes que habían olvidado que tenían la cuenta.'},
      {type:'quiz', tag:'🧠 Quiz', title:'Un inversor tiene €50.000 en un ETF del S&P 500. El mercado cae 40%. ¿Cuál es la respuesta correcta?',
        opts:['Vender todo para evitar pérdidas mayores','No hacer nada si el horizonte es +10 años y no necesitas ese dinero','Pedir un préstamo para comprar más','Cambiar a bonos del gobierno'], correct:1,
        exp:'Si el horizonte es largo plazo (>10 años) y tienes fondo de emergencia, la respuesta histórica correcta siempre ha sido mantener. Vender consolida las pérdidas y te hace perder la recuperación.'},
      {type:'quiz', tag:'🧠 Quiz', title:'¿Qué es el "Dollar Cost Averaging" (DCA)?',
        opts:['Convertir euros a dólares para invertir en EE.UU.','Invertir una cantidad fija periódicamente independientemente del precio','Comprar solo cuando el mercado está en mínimos','Diversificar entre dólares, euros y yenes'], correct:1,
        exp:'DCA = invertir €X cada mes pase lo que pase. En meses malos compras más unidades al mismo precio. En meses buenos, menos. El promedio del coste de adquisición mejora sistemáticamente sin necesidad de predecir el mercado.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 34 — Value Investing: Comprar Empresas, No Acciones
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:34, icon:'🔍', title:'Value Investing: La Filosofía de Buffett',
    desc:'Comprar €1 de valor pagando 60 céntimos. El método que construyó fortunas.',
    xp:30, tag:'AVANZADO', tagC:'gold', users:'22.100',
    steps:[
      {type:'content', tag:'🔍 Módulo 34', title:'¿Qué es el Value Investing?',
        intro:'Benjamin Graham (mentor de Buffett) definió la inversión con una analogía: el mercado es Mr. Market, un socio maníaco-depresivo que cada día te ofrece un precio diferente por tu parte del negocio. A veces está eufórico y pide demasiado. A veces está deprimido y regala el precio. Tu trabajo: comprar cuando está deprimido.',
        bullets:['💰 Valor intrínseco: lo que realmente vale la empresa, independientemente del precio de mercado','🛡️ Margen de seguridad: comprar por debajo del valor intrínseco para protegerte si te equivocas','🏰 Moat (foso económico): la ventaja que protege a la empresa de la competencia','📈 Inversión, no especulación: el objetivo es ser propietario de un negocio, no adivinar precios','⏳ Horizonte largo: "mi horizonte favorito es para siempre" — Buffett'],
        fact:'Si hubieras invertido €10.000 en Berkshire Hathaway (la empresa de Buffett) en 1965, hoy tendrías más de €250 millones. El S&P 500 en el mismo período: €2,5 millones.'},
      {type:'content', tag:'🔍 Módulo 34', title:'Cómo Identificar Empresas de Calidad',
        intro:'No toda empresa barata es una oportunidad. Graham distinguía entre la "trampa de valor" (empresa barata porque está en declive) y la auténtica oportunidad (empresa de calidad temporalmente infravalorada).',
        bullets:['📊 ROE > 15% sostenido: la empresa genera buena rentabilidad con su capital propio','💸 Márgenes crecientes: el pricing power indica moat real','🏦 Deuda conservadora: Deuda/EBITDA < 3x, preferiblemente < 2x','📈 Crecimiento de beneficios a 10 años: si no puedes proyectar 10 años, no entiendes el negocio','🎯 Insider ownership: cuando los directivos poseen acciones, sus intereses coinciden con los tuyos'],
        fact:'Buffett nunca invirtió en Amazon, Google o Facebook porque decía que no entendía cómo serían en 10 años. Su regla: si no puedes explicarlo simplemente, no lo compres.'},
      {type:'quiz', tag:'🔍 Quiz', title:'¿Qué es el "margen de seguridad" en value investing?',
        opts:['El seguro de cartera obligatorio','La diferencia entre el precio pagado y el valor intrínseco estimado','El stop-loss automático','El porcentaje de bonos en cartera'], correct:1,
        exp:'Si calculas que una empresa vale €100/acción y la compras a €60, tu margen de seguridad es 40%. Ese margen protege tu inversión si tu valoración tiene errores — que siempre los tiene.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 35 — Pensiones: El Sistema que Debes Entender Ya
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:35, icon:'👴', title:'El Sistema de Pensiones: Verdades Incómodas',
    desc:'Lo que nadie te explica sobre tu jubilación pública y qué hacer al respecto.',
    xp:25, tag:'ESPAÑA', tagC:'red', users:'28.700',
    steps:[
      {type:'content', tag:'👴 Módulo 35', title:'Cómo Funciona la Pensión Pública en España',
        intro:'España tiene un sistema de pensiones de reparto: los trabajadores activos pagan las pensiones de los jubilados actuales. No hay ninguna cuenta con "tu dinero" esperándote. Tu cotización de hoy paga la pensión de tu abuelo hoy.',
        bullets:['💸 Sistema de reparto: trabajadores actuales → pensiones actuales (no es tu ahorro)','📊 Tasa de sustitución media: la pensión pública cubre ~70-75% del último sueldo en España','📉 Problema demográfico: cada vez menos trabajadores por jubilado (de 4:1 a 2:1 en 2050)','📋 Se necesitan 25 años cotizados para el 100% de la base reguladora','⚠️ El Fondo de Reserva (la "hucha de las pensiones") pasó de €66.800M en 2011 a casi cero'],
        fact:'Según el Banco de España, sin reformas estructurales el déficit del sistema de pensiones alcanzará el 3,5% del PIB en 2050. La pensión media actual es de €1.234/mes.'},
      {type:'content', tag:'👴 Módulo 35', title:'Tu Estrategia Complementaria Obligatoria',
        intro:'La pensión pública quizás no desaparezca, pero sí se reducirá en términos reales. La solución no es política — es personal. Construir un segundo pilar de pensión privada no es opcional si quieres mantener tu nivel de vida.',
        bullets:['📊 Plan de pensiones individual: deducción fiscal de hasta €1.500/año en España (desde 2021)','🏢 Plan de empresa: aportaciones del empleador, frecuentemente gratuitas — siempre maximizar','📈 EPSV (País Vasco): hasta €5.000/año deducibles, muy superior al plan de pensiones estatal','💼 Cuenta de valores con ETFs: más flexible que el plan de pensiones pero sin ventaja fiscal','🔢 Regla práctica: la mitad de tu edad como porcentaje del ingreso a destinar a pensión (25 años → 12,5%)'],
        fact:'Si a los 25 años inviertes €200/mes en un ETF global y lo mantienes hasta los 65, con un 8% anual tendrás €620.000. Empezar a los 35 con €400/mes: €540.000. El tiempo gana.'},
      {type:'quiz', tag:'👴 Quiz', title:'¿Cuántos años cotizados se necesitan en España para cobrar el 100% de la pensión?',
        opts:['20 años','25 años','35 años','45 años'], correct:2,
        exp:'Desde la reforma de 2013, se necesitan 37 años cotizados para el 100% (y este umbral sigue subiendo). Con 25 años cotizados se obtiene aproximadamente el 50% de la base reguladora.'},
      {type:'quiz', tag:'👴 Quiz', title:'¿Por qué el sistema de pensiones español tiene problemas estructurales?',
        opts:['Porque la gente cobra demasiado tiempo la pensión','Porque hay cada vez menos trabajadores por jubilado (demografía)','Porque los gestores del sistema invierten mal','Porque las cotizaciones son demasiado bajas'], correct:1,
        exp:'El ratio de trabajadores por jubilado ha caído de 4:1 a 2,5:1 y seguirá cayendo. Con menos cotizantes sosteniendo más pensionistas, el sistema de reparto tiene tensiones crecientes.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 36 — Bonos y Renta Fija: El Activo que Nadie Explica
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:36, icon:'🏛️', title:'Bonos y Renta Fija: El Activo Invisible',
    desc:'Qué son, cómo funcionan y cuándo tienen sentido en tu cartera.',
    xp:25, tag:'FUNDAMENTAL', tagC:'green', users:'15.300',
    steps:[
      {type:'content', tag:'🏛️ Módulo 36', title:'Qué es un Bono',
        intro:'Un bono es un préstamo que haces a un gobierno o empresa. Ellos reciben tu dinero hoy y se comprometen a devolvértelo en una fecha futura (vencimiento) más intereses periódicos (cupón). Es deuda para el emisor, inversión para ti.',
        bullets:['📋 Emisor: gobierno (soberano) o empresa (corporativo)','💰 Cupón: interés periódico que recibes (ej: 3% anual)','📅 Vencimiento: cuando te devuelven el principal (1, 5, 10, 30 años)','⚖️ Relación inversa precio-tipo de interés: si suben los tipos, el precio del bono baja','🔒 Calificación crediticia: AAA (seguro) a D (en impago) según Moody\'s, S&P, Fitch'],
        fact:'España emite bonos a 10 años. En 2022 pagaba el 3,5% de interés. En 2021, con tipos negativos, pagaba el -0,05% — los inversores pagaban por prestarle dinero al estado español.'},
      {type:'content', tag:'🏛️ Módulo 36', title:'¿Cuándo Incluir Bonos en Tu Cartera?',
        intro:'La cartera clásica 60/40 (60% acciones, 40% bonos) ha sido el estándar durante décadas. Los bonos amortiguan las caídas de la bolsa porque cuando hay crisis, los inversores huyen a la seguridad de los bonos del estado.',
        bullets:['🔄 Correlación negativa histórica: cuando las acciones caen, los bonos tienden a subir','📅 A más edad → más bonos: menos tiempo para recuperarse de una crisis','📊 Bonos del Estado > Bonos Corporativos en términos de seguridad','🌍 Fondos de bonos: diversifican el riesgo de crédito entre muchos emisores','⚠️ 2022: año excepcional donde acciones Y bonos cayeron simultáneamente (inflación rompió la correlación)'],
        fact:'La cartera 60/40 perdió un 16% en 2022 — su peor año desde 1937. La razón: la inflación destruyó el valor de los bonos al mismo tiempo que el alza de tipos hundía las acciones.'},
      {type:'quiz', tag:'🏛️ Quiz', title:'Si suben los tipos de interés, ¿qué pasa con el precio de los bonos existentes?',
        opts:['Suben porque pagan más interés','Bajan porque los nuevos bonos son más atractivos','Se mantienen iguales','Depende del emisor'], correct:1,
        exp:'Los bonos existentes pagan un cupón fijo (ej: 2%). Si se emiten nuevos bonos al 4%, nadie querrá el tuyo al 2% a menos que su precio baje para igualar la rentabilidad efectiva. Tipos arriba → precios de bonos abajo.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 37 — El Arte de la Negociación Financiera Personal
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:37, icon:'🤝', title:'Negocia Todo: Hipoteca, Sueldo, Seguros',
    desc:'El dinero que no negocias es dinero que regalaS. Cada conversación tiene precio.',
    xp:25, tag:'PRÁCTICA', tagC:'green', users:'19.800',
    steps:[
      {type:'content', tag:'🤝 Módulo 37', title:'La Hipoteca: Tu Mayor Negociación',
        intro:'Una hipoteca de €200.000 a 30 años: la diferencia entre el 2% y el 2,5% de interés es €18.000 en intereses totales. Nadie viene a ofrecerte el mejor precio — tienes que pedirlo, y comparar entre al menos 3 entidades.',
        bullets:['🏦 Pide oferta a mínimo 3 bancos: el primero siempre deja margen','📊 Mejora tu scoring: cuanto mejor tu situación financiera, menor el tipo que consigues','🔄 Subrogación: puedes llevarte tu hipoteca a otro banco si te dan mejores condiciones','💼 Broker hipotecario: gestionan la negociación por ti (cobran €1.000-€3.000 pero ahorran más)','⚠️ TIN vs TAE: el TIN es el tipo "nominal", el TAE incluye todos los gastos — compara el TAE'],
        fact:'El banco Santander tiene instrucción interna de poder bajar el tipo hasta un 0,2% si el cliente amenaza con irse. El 80% de los clientes no lo saben y nunca lo piden.'},
      {type:'content', tag:'🤝 Módulo 37', title:'Seguros, Telefonía y Servicios: El Ritual Anual',
        intro:'Los seguros de hogar, auto y vida suben entre un 5-15% cada año "automáticamente". Las compañías cuentan con que la mayoría de clientes no llamará. Llamar tarda 15 minutos y puede ahorrarte €300 al año.',
        bullets:['📞 Llama a tu aseguradora en la renovación anual y pide retención','📊 Ten la oferta de la competencia antes de llamar (3 minutos en comparador)','💬 Script: "Tengo oferta de X por €Y menos. ¿Podéis igualarla o la tramito?"','📱 Telefonía: cambiar de operador cada 2 años suele ahorrar €200-€500/año','🏠 Suministros: comparar luz y gas tarda 10 minutos y puede ahorrar €150-€300/año'],
        fact:'Un estudio del OCU reveló que el 67% de los españoles nunca ha negociado su seguro de hogar. Los que sí lo hacen consiguen descuentos medios del 18%.'},
      {type:'quiz', tag:'🤝 Quiz', title:'¿Cuál es la diferencia entre TIN y TAE en una hipoteca?',
        opts:['El TIN incluye todos los gastos, el TAE solo el interés base','El TAE incluye todos los gastos y comisiones, el TIN solo el interés puro','Son lo mismo expresado de forma diferente','El TIN es para préstamos, el TAE para hipotecas'], correct:1,
        exp:'El TIN (Tipo de Interés Nominal) es solo el interés. El TAE incluye además comisiones, seguros vinculados y otros gastos. Siempre compara el TAE para tener el coste real de dos hipotecas.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 38 — Declaración de la Renta: Guía del Inversor
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:38, icon:'🧾', title:'Declaración de la Renta: Maximiza tu Devolución',
    desc:'Todo lo que te devuelven y no sabes que te corresponde.',
    xp:30, tag:'ESPAÑA', tagC:'red', users:'24.600',
    steps:[
      {type:'content', tag:'🧾 Módulo 38', title:'Cómo Funciona el IRPF del Inversor',
        intro:'En España, las ganancias de inversión tienen su propio tramo impositivo: la base imponible del ahorro. No pagas lo mismo por tu sueldo que por tus plusvalías bursátiles. Entender esto es dinero directo.',
        bullets:['📊 Hasta €6.000: 19% de impuestos sobre plusvalías','📊 €6.000 – €50.000: 21%','📊 €50.000 – €200.000: 23%','📊 Más de €200.000: 27%','🔄 Compensación: pérdidas computan contra ganancias (hasta 25% de los dividendos)','📅 Diferimiento: no tributas hasta que vendes — los ETFs de acumulación aprovechan esto al máximo'],
        fact:'Si tienes minusvalías en acciones A y plusvalías en acciones B, puedes vender ambas para compensar y reducir tu factura fiscal. La llamada "venta de minusvalías" es 100% legal y utilizada por todos los inversores profesionales.'},
      {type:'content', tag:'🧾 Módulo 38', title:'Deducciones que el 90% Ignora',
        intro:'La declaración de la renta tiene deducciones que la mayoría de contribuyentes no aplica por desconocimiento. Cada deducción no aprovechada es dinero regalado a Hacienda.',
        bullets:['🏠 Deducción por alquiler de vivienda habitual (si el contrato es anterior a 2015): 10,05%','👶 Mínimo familiar: €2.400 por el primer hijo, más por siguientes','♿ Discapacidad: reducciones de hasta €9.000 según grado','📚 Deducción por donativos a ONGs: 80% de los primeros €150, 35% el resto','💼 Gastos deducibles como autónomo: seguro médico, teléfono, ordenador, formación'],
        fact:'Según Hacienda, el 35% de los contribuyentes que hace la renta por los datos fiscales de Hacienda paga más de lo que debería por no revisar ni añadir sus deducciones.'},
      {type:'quiz', tag:'🧾 Quiz', title:'¿Qué tipo de IRPF pagas en España por ganancias bursátiles hasta €6.000?',
        opts:['El mismo que por tu sueldo (hasta 47%)','19%','15%','12%'], correct:1,
        exp:'Las plusvalías tributan en la "base del ahorro" separada del trabajo. Hasta €6.000 de ganancia, el tipo es 19%. Es más ventajoso que el tipo marginal del trabajo, que puede llegar al 47%.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 39 — El Arte del Presupuesto Zero
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:39, icon:'🎯', title:'Presupuesto Base Cero: Cada Euro con Destino',
    desc:'El sistema de presupuesto que obliga a justificar cada euro gastado.',
    xp:20, tag:'PRÁCTICA', tagC:'green', users:'21.400',
    steps:[
      {type:'content', tag:'🎯 Módulo 39', title:'Por Qué el Presupuesto Tradicional Falla',
        intro:'El presupuesto tradicional funciona así: ganas X, gastas lo que necesitas, lo que sobra lo ahorras. El problema: siempre hay algo más que "necesitar" y el ahorro queda reducido a las migajas. El presupuesto base cero invierte el orden.',
        bullets:['🔄 Base cero: cada mes empiezas desde €0 y asignas cada euro a un destino','💸 Primero: apartar el ahorro e inversión (como si fuera una factura obligatoria)','📊 Segundo: gastos fijos (alquiler, hipoteca, seguros, suscripciones)','🍕 Tercero: gastos variables (comida, ocio, ropa) — lo que sobra, no lo que te apetece','✅ Regla: si un gasto no está en el presupuesto, no existe'],
        fact:'Dave Ramsey, que ayudó a 5 millones de personas a salir de deudas, dice que el presupuesto base cero es la herramienta número uno. La mayoría de sus clientes descubren en el primer mes que gastaban €300-€500 en cosas que ni recuerdan.'},
      {type:'content', tag:'🎯 Módulo 39', title:'Implementar el Sistema en 30 Minutos',
        intro:'El presupuesto base cero requiere 30 minutos al inicio de cada mes y 5 minutos de seguimiento diario. No es un sacrificio — es elegir conscientemente qué haces con tu dinero en lugar de que el dinero "decida" por ti.',
        bullets:['1️⃣ Lista todos tus ingresos del mes (bruto y neto)','2️⃣ Escribe cada categoría de gasto con su límite máximo','3️⃣ Suma gastos + ahorro: debe igualar exactamente tus ingresos','4️⃣ Cuando una categoría se agote, paro — sin excepciones','5️⃣ Ajusta el mes siguiente según lo que salió diferente'],
        fact:'Un estudio de la Universidad de Utah encontró que las personas que escriben su presupuesto mensual tienen una tasa de ahorro un 38% mayor que las que no lo hacen, con los mismos ingresos.'},
      {type:'quiz', tag:'🎯 Quiz', title:'¿Cuál es la diferencia principal entre presupuesto tradicional y base cero?',
        opts:['El base cero no permite ningún gasto en ocio','En el base cero asignas un destino a CADA euro antes de gastarlo','El base cero solo funciona con ingresos altos','El base cero es mensual, el tradicional anual'], correct:1,
        exp:'En el presupuesto base cero, Ingresos - Gastos - Ahorro = €0. Cada euro tiene un nombre y un destino antes de que llegues a fin de mes. No hay "lo que sobra al final" — eso ya estaba planeado.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 40 — Startups, Unicornios y Capital Riesgo
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:40, icon:'🦄', title:'Startups y Capital Riesgo: El Mundo de lo Posible',
    desc:'Cómo funciona el ecosistema que ha creado las mayores fortunas del siglo XXI.',
    xp:35, tag:'AVANZADO', tagC:'gold', users:'11.200',
    steps:[
      {type:'content', tag:'🦄 Módulo 40', title:'El Ciclo de Vida de una Startup',
        intro:'Una startup no es una empresa pequeña. Es una apuesta por un modelo de negocio escalable. La gran mayoría muere. Las que sobreviven pueden multiplicar el capital invertido por 100 o por 1.000. Entender las fases es clave para evaluar el riesgo.',
        bullets:['🌱 Pre-seed: idea y equipo fundador. El dinero viene de FFF (Friends, Family, Fools)','🌿 Seed: primer producto y tracción inicial. Business angels y fondos semilla (€100K-€2M)','🌳 Serie A: modelo probado, escalar. VCs tradicionales (€5M-€25M)','🚀 Serie B/C: escala internacional, preparar IPO. €50M-€500M','💥 Exit: IPO en bolsa o venta a empresa grande (el momento donde los inversores cobran)'],
        fact:'Sequoia Capital invirtió €250.000 en Google en 1999. Cuando Google salió a bolsa en 2004, esa inversión valía €4.300 millones. Rentabilidad: 17.200x. Pero por cada Google, hay 999 startups que no devuelven nada.'},
      {type:'content', tag:'🦄 Módulo 40', title:'¿Puede el Inversor Minorista Acceder a Esto?',
        intro:'El venture capital ha sido históricamente reservado a grandes inversores y fondos. Pero han aparecido vías de acceso para el inversor con menos capital, con sus ventajas y limitaciones claras.',
        bullets:['👼 Inversión ángel: invertir directamente en startups (mínimo €5.000-€25.000, alta iliquidez)','🌐 Plataformas de equity crowdfunding: Seedrs, Crowdcube (desde €100, muchas quiebran)','📊 Fondos de VC: vehículos especializados (mínimos €100K+, típicamente para institucionales)','🏛️ ETFs de Innovation: ARK Innovation, etc. (acceso líquido a empresas growth, no early stage)','⚠️ Regla de oro: nunca más del 5-10% de tu cartera en activos alternativos de alto riesgo'],
        fact:'El 90% de las startups quiebra en los primeros 5 años. El 1% de las que sobreviven generan el 99% de los retornos del sector. La distribución de retornos en VC es la más extrema de todos los activos financieros.'},
      {type:'quiz', tag:'🦄 Quiz', title:'¿Qué es un "unicornio" en el mundo startup?',
        opts:['Una startup con tecnología de IA generativa','Una startup valorada en más de $1.000 millones','Una startup que cotiza en bolsa','Una startup que ha conseguido ser rentable'], correct:1,
        exp:'El término lo acuñó la inversora Aileen Lee en 2013 para describir startups privadas con valoración >$1.000M. Los llamó unicornios porque eran tan raros como esa criatura. Hoy hay más de 1.200 unicornios en el mundo.'},
    ],
  },

  /* ═══ MÓDULO 41 — Gestión del Riesgo Personal ════════════════════ */
  {
    id:41, icon:'🛡️', title:'Gestión del Riesgo Personal',
    desc:'Cuánto riesgo puedes permitirte realmente. No el que crees.',
    xp:25, tag:'FUNDAMENTAL', tagC:'green', users:'16.800',
    steps:[
      {type:'content', tag:'🛡️ Módulo 41', title:'Riesgo: Capacidad vs Tolerancia',
        intro:'Todos dicen tener "perfil moderado" hasta que la cartera cae un 30%. El riesgo tiene tres dimensiones reales: capacidad (¿puedes permitirte perder?), tolerancia (¿puedes dormir bien perdiendo?) y necesidad (¿cuánto riesgo requiere tu objetivo?). El más restrictivo de los tres manda.',
        bullets:['💪 Capacidad: si necesitas el dinero en 3 años, no puedes arriesgar que caiga 40%','🧠 Tolerancia: el 74% de inversores "agresivos" vendió en las 6 semanas del crash de 2020','🎯 Necesidad: para multiplicar por 3 en 10 años necesitas renta variable — no queda otra','📅 Horizonte largo = más riesgo posible. El tiempo cura las caídas','⚖️ Regla: el dinero que podrías necesitar en <5 años no va a renta variable'],
        fact:'Un estudio de Dalbar: el inversor medio de fondos de acciones obtuvo 4,35% anual durante 30 años mientras el S&P 500 daba 10,65%. La diferencia: el comportamiento (vender en caídas, comprar en euforia).'},
      {type:'content', tag:'🛡️ Módulo 41', title:'La Regla del 110 y el Asset Allocation por Edad',
        intro:'La asignación de activos (qué porcentaje va a acciones, bonos y cash) es la decisión más importante de tu cartera — más que qué acciones concretas eliges.',
        bullets:['📐 Regla del 110: % en acciones = 110 − tu edad. Con 30 años → 80% acciones','📅 Horizonte <3 años: 0% en renta variable. Mercado puede estar caído justo cuando lo necesitas','💰 3-10 años: 40-70% acciones según tolerancia','🚀 +10 años: 80-100% acciones históricamente óptimo','🔄 Reajustar cada 5 años conforme te acercas al objetivo'],
        fact:'Vanguard: invertir 100% en acciones desde los 25 a los 65, en el 96% de simulaciones históricas tienes más dinero que con cualquier otra combinación. El tiempo es el mejor diversificador.'},
      {type:'quiz', tag:'🛡️ Quiz', title:'¿Qué porcentaje en acciones corresponde a una persona de 35 años según la regla del 110?',
        opts:['35%','55%','75%','90%'], correct:2,
        exp:'110 − 35 = 75% en acciones. La regla del 110 (o 120 para perfiles agresivos) ajusta la exposición a renta variable según edad: a más joven, más tiempo para recuperar caídas, más acciones. A medida que se acerca la jubilación, se reduce el riesgo gradualmente.'},
    ],
  },

  /* ═══ MÓDULO 42 — Fiscalidad Avanzada del Inversor ══════════════ */
  {
    id:42, icon:'🧮', title:'Fiscalidad Avanzada del Inversor',
    desc:'Las estrategias legales que usan los ricos para pagar menos impuestos.',
    xp:35, tag:'AVANZADO', tagC:'gold', users:'13.200',
    steps:[
      {type:'content', tag:'🧮 Módulo 42', title:'Diferimiento Fiscal: El Superpower del Inversor',
        intro:'El principio más potente de la fiscalidad inversora: cada euro que no pagas en impuestos hoy sigue generando rentabilidad. El diferimiento fiscal es, en esencia, un préstamo sin interés del fisco que trabaja para ti décadas.',
        bullets:['📈 ETF acumulación: reinvierte dividendos sin tributar — más capital compuesto cada año','🔄 Traspaso entre fondos indexados en España: sin peaje fiscal hasta la venta final (no aplica a ETFs)','💰 Venta de minusvalías: compensa ganancias y reduce factura fiscal del año','📅 Diferir 20 años un impuesto del 21% sobre €50.000: esos €10.500 siguen generando retorno','⚠️ La norma de los 2 meses: no recompres el mismo activo en 2 meses tras vender con pérdidas'],
        fact:'Un inversor que tributa el 21% cada año sobre sus ganancias vs otro que difiere hasta el final: tras 20 años el segundo tiene €47.000 más sobre €100.000 invertidos. El diferimiento fiscal ES interés compuesto aplicado a impuestos.'},
      {type:'content', tag:'🧮 Módulo 42', title:'Tax Loss Harvesting: Cosechar Pérdidas',
        intro:'El tax loss harvesting es una técnica legal para reducir la factura fiscal: vender posiciones con pérdidas para compensar las ganancias del año. Conviertes el dolor de las pérdidas en un beneficio fiscal tangible.',
        bullets:['📋 Vender activos en pérdidas para compensar ganancias realizadas ese año','🔄 Inmediatamente después recomprar un activo similar (no el mismo — norma 2 meses)','💰 Las minusvalías compensan hasta el 25% de los dividendos recibidos ese año','📊 Ejemplo: +€8.000 en AAPL − €3.000 en posición perdedora = tributa solo €5.000','📅 El resto de minusvalías no compensadas: puedes arrastrarlas 4 años fiscales'],
        fact:'En EEUU, el tax loss harvesting sistemático puede añadir 0,5-1,5% de rentabilidad neta anual (datos Vanguard). En España la mecánica es similar aunque con normas propias.'},
      {type:'quiz', tag:'🧮 Quiz', title:'¿Por qué los fondos de inversión indexados tienen ventaja fiscal sobre los ETFs en España?',
        opts:['Tienen menores comisiones de gestión','Permiten traspasos entre fondos sin tributar hasta la venta final','Tienen tipos impositivos más bajos','Están exentos de IVA'], correct:1,
        exp:'En España, los fondos de inversión permiten traspasar dinero de un fondo a otro sin generar hecho imponible. Solo tributas al hacer la venta final. Los ETFs no tienen esta ventaja — cada venta tributa. Para estrategias con rebalanceos frecuentes, los fondos indexados ganan.'},
    ],
  },

  /* ═══ MÓDULO 43 — El Ciclo Económico y Tu Cartera ═══════════════ */
  {
    id:43, icon:'🔄', title:'El Ciclo Económico y Cómo Invertir en Cada Fase',
    desc:'Expansión, pico, recesión, recuperación. El mercado cotiza el futuro.',
    xp:30, tag:'AVANZADO', tagC:'blue', users:'11.400',
    steps:[
      {type:'content', tag:'🔄 Módulo 43', title:'Las 4 Fases del Ciclo Económico',
        intro:'La economía oscila en ciclos predecibles pero impredecibles en timing. Ray Dalio lleva décadas estudiando estos ciclos para Bridgewater, el mayor hedge fund del mundo. Entender las fases no sirve para predecir — sirve para no sorprenderse.',
        bullets:['📈 EXPANSIÓN: PIB crece, empleo sube, inflación moderada. Acciones y materias primas lideran','🏔️ PICO: inflación alta, tipos subiendo, crédito caro. Los bancos centrales frenan','📉 RECESIÓN: PIB cae, desempleo sube, beneficios bajan. Bonos del estado y sectores defensivos','🌱 RECUPERACIÓN: tipos bajos, estímulos. Acciones baratas, el mejor momento para entrar','⏱️ Duración media: ciclo completo 8-10 años, recesiones 12-18 meses de media'],
        fact:'El S&P 500 toca su mínimo de recesión de media 6 meses ANTES de que la economía real toque fondo. Cuando los medios proclaman "estamos en recesión", la bolsa ya lleva meses subiendo.'},
      {type:'quiz', tag:'🔄 Quiz', title:'¿Qué sectores tienden a hacerlo mejor durante una recesión económica?',
        opts:['Tecnología y consumo discrecional','Energía y materias primas','Utilities, salud y consumo básico','Inmobiliario y financieros'], correct:2,
        exp:'Los sectores defensivos (utilities, salud, consumo básico) aguantan mejor en recesión porque su demanda no cae con la economía: la gente sigue pagando la luz, comprando medicamentos y comprando comida aunque el PIB baje.'},
    ],
  },

  /* ═══ MÓDULO 44 — Cómo Leer Cuentas de una Empresa ═════════════ */
  {
    id:44, icon:'📋', title:'Cómo Leer las Cuentas de una Empresa',
    desc:'Balance, P&L y flujo de caja. Los tres documentos que lo dicen todo.',
    xp:35, tag:'AVANZADO', tagC:'gold', users:'9.600',
    steps:[
      {type:'content', tag:'📋 Módulo 44', title:'Los Tres Estados Financieros',
        intro:'Toda empresa pública publica tres documentos cada trimestre. Los inversores de value los leen mejor que los titulares del día.',
        bullets:['📊 Balance: ¿qué tiene y qué debe la empresa? Foto en un momento dado','📈 Cuenta de Resultados (P&L): ¿cuánto gana o pierde? Película de un período','💸 Flujo de Caja (Cash Flow): ¿cuánto dinero real entra? El más honesto de los tres','🔍 Beneficio contable manipulable; free cash flow, mucho menos','⚡ Regla Buffett: nunca inviertas en empresa cuyo flujo de caja libre no entiendes'],
        fact:'Enron, WorldCom y Wirecard tenían beneficios contables impecables antes de quebrar. Sus flujos de caja contaban otra historia. Los analistas que miraron el cash flow detectaron el fraude años antes.'},
      {type:'content', tag:'📋 Módulo 44', title:'Las 5 Métricas Clave',
        intro:'Cinco métricas capturan el 80% de la información relevante para valorar si una empresa merece tu dinero.',
        bullets:['💰 Free Cash Flow: dinero real generado — la métrica reina','📊 Margen EBITDA: cuánto retiene por cada euro de venta','🏦 Deuda neta / EBITDA: >3× es preocupante','📈 ROIC: rentabilidad sobre capital invertido. >15% es excelente','🔄 Crecimiento de ingresos a 5 años: la dirección y velocidad del negocio'],
        fact:'Apple genera >€100.000M de Free Cash Flow anual. Ese cash se usa para recomprar acciones y pagar dividendos. El FCF es lo que hace que una empresa valga algo real.'},
      {type:'quiz', tag:'📋 Quiz', title:'¿Por qué el Free Cash Flow es más fiable que el beneficio neto contable?',
        opts:['Porque es siempre mayor','Porque es mucho más difícil de manipular contablemente','Porque no incluye impuestos','Porque lo audita un organismo externo'], correct:1,
        exp:'El beneficio neto puede alterarse con criterios contables legales: amortizaciones, provisiones, reconocimiento de ingresos. El Free Cash Flow (dinero que entra en caja menos inversiones) es difícil de falsificar porque el efectivo es efectivo.'},
    ],
  },

  /* ═══ MÓDULO 45 — IF: El Plan Real ══════════════════════════════ */
  {
    id:45, icon:'🔑', title:'Independencia Financiera: El Plan Real',
    desc:'Más allá de los cálculos. Cómo construirlo paso a paso desde €0.',
    xp:30, tag:'PRÁCTICA', tagC:'green', users:'24.500',
    steps:[
      {type:'content', tag:'🔑 Módulo 45', title:'Los 4 Pilares de la IF',
        intro:'La independencia financiera no es lotería — es un sistema de cuatro pilares que se refuerzan mutuamente.',
        bullets:['💸 PILAR 1 — Ingresos: maximiza sueldo + ingresos paralelos','🏦 PILAR 2 — Ahorro: mínimo 20%, idealmente 30-50%. Determina el plazo más que cualquier otra variable','📈 PILAR 3 — Inversión: el ahorro sin invertir pierde contra la inflación','🛡️ PILAR 4 — Protección: fondo emergencia, seguro vida, diversificación. Sin esto todo es frágil'],
        fact:'Estudio del Trinity College: la variable que más reduce el plazo hasta la IF es la tasa de ahorro, no la rentabilidad de la cartera. Con 50% de ahorro, la IF es alcanzable en ~17 años independientemente del sueldo.'},
      {type:'content', tag:'🔑 Módulo 45', title:'La Tabla del Tiempo Hasta la IF',
        intro:'El tiempo que tardas en alcanzar la IF depende principalmente de tu tasa de ahorro. Esta tabla es el resultado de simulaciones con datos históricos reales.',
        bullets:['📊 10% de ahorro → ~37 años hasta IF','📊 20% → ~30 años','📊 30% → ~25 años','📊 50% → ~17 años','📊 75% → ~7 años','⚡ Cada 10 puntos de tasa de ahorro = ~5 años menos de trabajo'],
        fact:'Mr. Money Mustache alcanzó la IF con 30 años con €60.000/año de sueldo. Su tasa de ahorro era del 66%. Gastaba €20.000/año con €60.000 de ingreso. La clave no fue el sueldo.'},
      {type:'quiz', tag:'🔑 Quiz', title:'¿Qué variable tiene mayor impacto en el tiempo hasta la Independencia Financiera?',
        opts:['Elegir los mejores activos (mayor rentabilidad)','La tasa de ahorro (porcentaje que inviertes)','El sueldo inicial','Empezar en el momento exacto del mercado'], correct:1,
        exp:'Las simulaciones demuestran que la tasa de ahorro domina sobre todos los demás factores. Pasar del 20% al 40% de ahorro reduce ~10 años el plazo. Mejorar la rentabilidad del 7% al 9% solo reduce 3-4 años. Ahorra más primero, optimiza después.'},
    ],
  },

  /* ═══ MÓDULO 46 — Seguros: La Guía Sin Humo ════════════════════ */
  {
    id:46, icon:'☂️', title:'Seguros: La Guía Sin Humo',
    desc:'Los seguros que protegen tu patrimonio. Los que solo protegen al vendedor.',
    xp:20, tag:'PRÁCTICA', tagC:'green', users:'14.700',
    steps:[
      {type:'content', tag:'☂️ Módulo 46', title:'Los Seguros que Sí Necesitas',
        intro:'Un seguro es transferencia de riesgo: pagas algo pequeño y cierto para evitar algo grande e incierto. Regla: asegura solo lo que no podrías pagar con tu propio capital.',
        bullets:['❤️ Vida: si tienes personas dependientes económicamente (hijos, pareja)','🏥 Salud: para reducir esperas o acceso a especialistas. El más usado','🏠 Hogar: obligatorio con hipoteca, recomendable siempre','♿ Invalidez: el más infravalorado. Tu capacidad de generar ingresos es tu mayor activo','🚗 Coche: RC obligatorio. Daños propios si el coche vale >€8.000'],
        fact:'La probabilidad de invalidez permanente antes de jubilarte (a los 35) es del 25%. 6 veces mayor que la de muerte prematura. Sin embargo, muy poca gente tiene seguro de invalidez.'},
      {type:'content', tag:'☂️ Módulo 46', title:'Los Seguros que Deberías Cancelar',
        intro:'La industria crea seguros que se venden emocionalmente pero que matemáticamente no tienen sentido. Si puedes pagar la pérdida con tu fondo de emergencia, el seguro no vale la pena.',
        bullets:['❌ Seguro de móvil: con franquicia alta, pagas casi lo mismo que el arreglo','❌ Garantía extendida: margen para el vendedor del 80%. Casi nadie la usa','❌ Seguro de viaje básico: tarjeta premium o seguro de salud ya cubren lo importante','❌ Unit-linked (seguro + inversión): hace ambas cosas mal y con altas comisiones','⚠️ Seguros vinculados a hipoteca del banco: suelen ser 30-50% más caros que en mercado libre'],
        fact:'Las garantías extendidas tienen un margen de beneficio del 50-70% para el vendedor. Si los fabricantes creyeran que los productos van a averiarse antes de lo normal, no ofrecerían la garantía extendida.'},
      {type:'quiz', tag:'☂️ Quiz', title:'¿Cuál es el criterio correcto para contratar un seguro?',
        opts:['Contratar todos los disponibles para máxima protección','Asegurar solo lo que no podrías pagar con tu propio capital','Solo contratar los obligatorios por ley','Nunca contratar seguros porque son un gasto'], correct:1,
        exp:'El seguro tiene sentido cuando la pérdida potencial desestabilizaría tu situación financiera. Para pérdidas pequeñas que puedes absorber (móvil, electrodoméstico), la autoseguranza con el fondo de emergencia es siempre más económica.'},
    ],
  },

  /* ═══ MÓDULO 47 — El Millonario de al Lado ══════════════════════ */
  {
    id:47, icon:'🏘️', title:'El Millonario de al Lado: Lo Que No Se Ve',
    desc:'El libro que cambió cómo entendemos la riqueza real.',
    xp:20, tag:'PSICOLOGÍA', tagC:'purple', users:'29.300',
    steps:[
      {type:'content', tag:'🏘️ Módulo 47', title:'Riqueza vs Apariencia de Riqueza',
        intro:'Thomas Stanley estudió 20 años a los millonarios americanos. Conclusión contraintuitiva: la mayoría no vive en mansiones ni conduce Ferrari. Viven en barrios normales, conducen coches usados y tienen mucho dinero porque no lo gastan demostrándolo.',
        bullets:['🏠 El 80% vive en casa propia con hipoteca modesta','🚗 Coche más vendido entre millonarios americanos: Toyota y Ford','💼 Mayoría son autónomos o pequeños empresarios, no ejecutivos de grandes empresas','👔 La riqueza se construye acumulando, no exhibiendo','🎓 Viven por debajo de sus posibilidades deliberadamente — no por necesidad'],
        fact:'Quien conduce un Ferrari de €200.000 a menudo tiene menos patrimonio neto que quien conduce un Volkswagen viejo. El Ferrari es señal de que ese dinero ya no está disponible para crear más riqueza.'},
      {type:'content', tag:'🏘️ Módulo 47', title:'Los 7 Factores del Millonario de al Lado',
        intro:'Stanley identificó 7 denominadores comunes en personas que construyen riqueza real, independientemente del sueldo.',
        bullets:['1️⃣ Viven siempre por debajo de sus posibilidades','2️⃣ Asignan eficientemente tiempo, energía y dinero hacia construir riqueza','3️⃣ La IF importa más que el estatus social','4️⃣ Sus padres no les dieron dinero — los hizo más fuertes','5️⃣ Sus hijos son autosuficientes — los "regalos" excesivos destrozan la motivación','6️⃣ Identifican oportunidades de mercado que otros ignoran','7️⃣ Eligieron (y cambiaron) su profesión para maximizar ingresos'],
        fact:'Ingreso promedio de los millonarios estudiados: €130.000/año. Patrimonio neto medio: €3,7 millones. ¿Cómo? Ahorrando el 20%+ durante décadas y sin gastar para impresionar a nadie.'},
      {type:'quiz', tag:'🏘️ Quiz', title:'¿Cuál es la característica más común entre personas que construyen riqueza real?',
        opts:['Heredar capital inicial','Tener sueldo muy alto','Vivir consistentemente por debajo de sus posibilidades','Invertir en productos sofisticados'], correct:2,
        exp:'La variable más correlacionada con la acumulación de riqueza no es el ingreso sino el comportamiento: gastar consistentemente menos de lo que se gana. Muchos con ingresos altos tienen patrimonio neto bajo por el lifestyle creep.'},
    ],
  },

  /* ═══ MÓDULO 48 — Inversión ESG ════════════════════════════════ */
  {
    id:48, icon:'🌱', title:'ESG: Invertir con Valores',
    desc:'Qué es la inversión responsable y si realmente funciona.',
    xp:25, tag:'TENDENCIAS', tagC:'blue', users:'12.100',
    steps:[
      {type:'content', tag:'🌱 Módulo 48', title:'Qué Significa ESG',
        intro:'ESG = Environmental, Social, Governance. Los fondos ESG filtran empresas según criterios no solo financieros: huella de carbono, condiciones laborales, transparencia del consejo...',
        bullets:['🌍 Environmental: emisiones CO2, gestión de residuos, energías renovables','👥 Social: condiciones laborales, diversidad, cadena de suministro ética','🏛️ Governance: independencia del consejo, remuneración ejecutiva, transparencia','📊 Calificaciones de MSCI o Sustainalytics (de AAA a CCC)','⚠️ Problema: correlación entre agencias de solo el 60% — inconsistencias importantes'],
        fact:'Tesla tiene puntuación ESG muy baja en muchas agencias (condiciones laborales, gobernanza) pero es símbolo del coche eléctrico. Exxon, petrolera, tiene ESG alta por su gobernanza. El sistema tiene contradicciones claras.'},
      {type:'content', tag:'🌱 Módulo 48', title:'ESG: ¿Funciona Financieramente?',
        intro:'La gran pregunta: ¿los fondos ESG sacrifican rentabilidad por valores? Los datos son mixtos pero alentadores para el largo plazo.',
        bullets:['📊 MSCI World ESG vs MSCI World estándar en 10 años: diferencia < 0,3% anual','💰 Empresas ESG tienen mejor gobernanza = menos escándalos = menos crashes fuertes','🔄 "Greenium": algunos activos ESG tienen prima de valoración por demanda institucional creciente','⚠️ Fondos temáticos ESG (solar, agua): más concentrados, más volátiles','✅ Para largo plazo: ETFs ESG globales son comparables a los convencionales'],
        fact:'En 2021, los fondos ESG captaron el 60% de todos los flujos de inversión en Europa. La regulación UE (Taxonomía Verde) está acelerando la adopción institucional masiva.'},
      {type:'quiz', tag:'🌱 Quiz', title:'¿Cuál es la principal debilidad del sistema de puntuación ESG actual?',
        opts:['Los fondos ESG siempre tienen menor rentabilidad','Las calificaciones ESG son muy inconsistentes entre agencias','El ESG solo aplica a grandes empresas','Los fondos ESG tienen siempre mayores comisiones'], correct:1,
        exp:'La correlación entre calificaciones ESG de MSCI y Sustainalytics es solo del 60% — vs el 99% entre agencias de rating de bonos. Tesla puede tener AAA en una agencia y CCC en otra. La falta de estandarización es el mayor problema del sistema ESG actual.'},
    ],
  },

  /* ════════════════════════════════════ */
  ,{
    id:49, icon:'💸', title:'Autónomos y Trabajadores por Cuenta Propia',
    desc:'Fiscalidad, deducciones y estrategia financiera del autónomo.',
    xp:30, tag:'ESPAÑA', tagC:'red', users:'22.400',
    steps:[
      {type:'content', tag:'💸 Módulo 49', title:'El Sistema Fiscal del Autónomo',
        intro:'Ser autónomo en España implica un sistema fiscal completamente diferente al del asalariado. Más libertad, pero también más responsabilidad — y más herramientas para optimizar.',
        bullets:['📋 Modelo 130: pago fraccionado trimestral del IRPF (20% del beneficio)','📊 Modelo 303: IVA trimestral (diferencia entre IVA repercutido y soportado)','💼 Gastos deducibles: local, vehículo (si es exclusivo), seguro médico, teléfono, formación','🏠 Home office: hasta 30% de los gastos del hogar si trabajas desde casa','💰 Cuota autónomo: €230-€500/mes según base (tarifa plana €80/mes primer año)'],
        fact:'Un autónomo puede deducirse hasta €500/año en formación, el 100% del seguro médico para él y su familia (hasta €500 por persona), y el 50% de las comidas de trabajo. El desconocimiento fiscal cuesta miles al año.'},
      {type:'quiz', tag:'💸 Quiz', title:'¿Qué porcentaje del beneficio paga el autónomo trimestralmente en el modelo 130?',
        opts:['10%','15%','20%','30%'], correct:2,
        exp:'El modelo 130 es un pago a cuenta del IRPF: el 20% del beneficio neto trimestral (ingresos - gastos deducibles). Si pagas demasiado durante el año, Hacienda te devuelve la diferencia en la declaración anual.'},
    ],
  },
  {
    id:50, icon:'🌐', title:'Finanzas para Expatriados y Nómadas Digitales',
    desc:'Residencia fiscal, cuentas internacionales y la regla de 183 días.',
    xp:25, tag:'GLOBAL', tagC:'blue', users:'12.600',
    steps:[
      {type:'content', tag:'🌐 Módulo 50', title:'Residencia Fiscal: Lo Que Determina Dónde Pagas',
        intro:'Si vives fuera de España más de 183 días, dejas de ser residente fiscal español. Esto tiene implicaciones enormes: cambias de régimen tributario completo. Es una de las decisiones con mayor impacto fiscal que puedes tomar.',
        bullets:['📅 183 días: regla básica para determinar residencia fiscal en España','🌍 Paraísos fiscales: lista negra española — cambiar allí tiene reglas especiales','💼 Modelo 720: obligatorio declarar bienes en el extranjero >50.000€','🏦 Ley Beckham: régimen especial para extranjeros que trabajan en España (tipo fijo 24% hasta €600K)','⚠️ Doble imposición: España tiene convenios con >100 países para evitarla'],
        fact:'Portugal ofreció el régimen RNH (Residente No Habitual) hasta 2023: tipos fijos del 20% para extranjeros. Atrajo a miles de nómadas digitales españoles que reducían su factura fiscal un 50%.'},
      {type:'quiz', tag:'🌐 Quiz', title:'¿Cuántos días debes pasar fuera de España para dejar de ser residente fiscal?',
        opts:['90 días','183 días','270 días','365 días'], correct:1,
        exp:'La regla de los 183 días: si pasas más de 183 días fuera de España en un año natural, dejas de ser residente fiscal. Pero Hacienda también mira dónde están tu familia y tu "centro de intereses económicos". No es solo contar días.'},
    ],
  },
  {
    id:51, icon:'🔐', title:'Seguridad Financiera Digital',
    desc:'Protege tu patrimonio digital de fraudes, phishing y ciberataques.',
    xp:20, tag:'PRÁCTICA', tagC:'green', users:'31.200',
    steps:[
      {type:'content', tag:'🔐 Módulo 51', title:'Las Amenazas Reales a tu Patrimonio Digital',
        intro:'El dinero digital requiere seguridad digital. El 90% de los fraudes financieros son evitables con medidas básicas que nadie te enseña. Un momento de descuido puede costarte años de ahorro.',
        bullets:['🎣 Phishing: emails/SMS falsos que imitan a tu banco. Nunca des credenciales por enlace','📱 SIM swapping: roban tu número para recibir los SMS de verificación. Activa la verificación por app','🔑 2FA de app (no SMS): Google Authenticator o Authy son infinitamente más seguros que el SMS','🏦 Cuenta corriente ≠ cuenta de inversión: no tengas todo en el mismo lugar','💾 Seed phrase de cripto: en papel, en lugar físico seguro — nunca digital ni en la nube'],
        fact:'En 2023, los españoles perdieron €330 millones en fraudes online financieros. El 70% de los casos comenzaron con un SMS o email aparentemente legítimo del banco. La primera línea de defensa es la duda.'},
      {type:'quiz', tag:'🔐 Quiz', title:'¿Cuál es la forma más segura de 2FA (doble factor de autenticación)?',
        opts:['SMS al teléfono móvil','Email de verificación','App de autenticación (Authy, Google Authenticator)','Pregunta de seguridad'], correct:2,
        exp:'El SMS puede ser interceptado (SIM swapping). El email puede estar comprometido. Las preguntas de seguridad son predecibles. Las apps de autenticación generan códigos locales que solo existen en tu dispositivo y expiran cada 30 segundos.'},
    ],
  },
  {
    id:52, icon:'🎓', title:'Educación Financiera de los Hijos',
    desc:'Cómo enseñar dinero a los más pequeños para que no partan de cero.',
    xp:20, tag:'VIDA', tagC:'purple', users:'25.800',
    steps:[
      {type:'content', tag:'🎓 Módulo 52', title:'Por Qué No Enseñamos Finanzas en Casa',
        intro:'El dinero es el tabú más grande en las familias españolas. No hablamos de sueldos, deudas ni inversiones. El resultado: los hijos llegan a adultos sin ninguna base financiera, repitiendo los mismos errores que sus padres.',
        bullets:['🐷 Hucha de 3 botes: gastar, ahorrar, donar. Desde los 5 años','💰 Paga semanal con responsabilidades: vincula el dinero al esfuerzo desde pequeños','🛒 Incluir a los hijos en decisiones de compra: explica el coste de oportunidad','📈 La primera inversión: abre una cuenta de custodia e invierte con ellos en un ETF','🗣️ Hablar de dinero sin vergüenza: los secretos financieros se heredan'],
        fact:'Warren Buffett compró su primera acción a los 11 años (Cities Service Preferred). A los 13, declaró impuestos por primera vez como vendedor de periódicos. La educación financiera temprana es el regalo más valioso que existe.'},
      {type:'quiz', tag:'🎓 Quiz', title:'¿Cuándo se puede empezar a enseñar conceptos financieros básicos a los niños?',
        opts:['Solo cuando empiezan el instituto','Solo cuando pueden hacer matemáticas avanzadas','Desde los 3-5 años con conceptos simples como el ahorro','No es apropiado hasta los 18 años'], correct:2,
        exp:'Desde los 3-5 años los niños entienden conceptos como "no hay suficiente dinero para todo" y "si ahorro ahora, puedo comprar lo que quiero después". La hucha de 3 botes (gastar/ahorrar/donar) es perfecta para esta edad.'},
    ],
  },


  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 41 — El Poder de los Hábitos Financieros
  ═══════════════════════════════════════════════════════════════════ */
  ,{
    id:53, icon:'🔄', title:'Hábitos Financieros que Cambian Todo',
    desc:'No es la estrategia perfecta. Es la rutina consistente.',
    xp:20, tag:'PSICOLOGÍA', tagC:'purple', users:'27.400',
    steps:[
      {type:'content', tag:'🔄 Módulo 41', title:'Por Qué los Buenos Planes Fracasan',
        intro:'Saber qué hacer es fácil. Hacerlo cada mes durante 20 años es lo difícil. La diferencia entre el inversor con €500.000 a los 60 y el que tiene €50.000 no es que uno supiera más — es que uno convirtió sus decisiones financieras en hábitos automáticos.',
        bullets:['🧠 Voluntad finita: cada decisión activa agota tu capacidad de autodisciplina','⚡ Automatización: lo que no requiere decisión, no puede fallar','📅 Inversión automática el día de cobro: no ves el dinero, no lo gastas','📊 "Pay yourself first": el ahorro va primero, el gasto va con lo que queda','🔁 El loop del hábito: señal → rutina → recompensa. Diseña cada uno conscientemente'],
        fact:'Un estudio de Vanguard comparó inversores con aportaciones automáticas vs manuales durante 10 años. Los automáticos tenían un patrimonio medio un 40% mayor. No porque fueran más listos — porque no fallaban.'},
      {type:'quiz', tag:'🔄 Quiz', title:'¿Por qué la inversión automática funciona mejor que la manual?',
        opts:['Porque los bancos ofrecen mejores tipos en aportaciones automáticas','Porque elimina la decisión mensual y el riesgo de no hacerlo','Porque invierte justo en el mejor momento del mes','Porque tiene ventajas fiscales automáticas'], correct:1,
        exp:'La inversión automática elimina la fricción y la necesidad de voluntad. Cada vez que debes "decidir" si aportar, arriesgas que algo te distraiga. Automático = siempre funciona, sin esfuerzo.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 42 — La Psicología del Precio y el Anclaje
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:54, icon:'⚓', title:'Sesgos de Precio: Cómo tu Mente te Engaña',
    desc:'El anclaje, el efecto dotación y por qué "barato" no siempre existe.',
    xp:25, tag:'PSICOLOGÍA', tagC:'purple', users:'16.800',
    steps:[
      {type:'content', tag:'⚓ Módulo 42', title:'El Sesgo de Anclaje',
        intro:'Cuando un piso vale €300.000 y lo rebajan a €260.000, parece una ganga. Pero si el precio justo fuera €220.000, sigues pagando €40.000 de más. El primer número que escuchas ancla todas las comparaciones siguientes — aunque sea arbitrario.',
        bullets:['⚓ Anclaje: el primer precio que ves distorsiona todos los siguientes','🏷️ "Precio tachado" en tiendas: el precio alto inventado es el ancla','📈 En bolsa: "ya bajó un 50%, está barato" — puede seguir bajando otro 80%','💰 Salario: quien pide primero ancla toda la negociación','🧠 Antídoto: pregunta "¿qué vale realmente?" antes de ver el precio'],
        fact:'Un experimento de Ariely (MIT): hacer girar una ruleta y luego estimar el precio de un vino. Quienes sacaron números altos estimaban precios un 60-120% más altos. El número completamente aleatorio ancló la respuesta.'},
      {type:'content', tag:'⚓ Módulo 42', title:'El Efecto Dotación: Por Qué Valoramos Más lo Nuestro',
        intro:'Las personas valoran más los objetos que ya poseen que los que no tienen. En inversión: queremos vender caro lo que compramos aunque el precio justo sea menor. No queremos realizar pérdidas aunque mentalmente ya existan.',
        bullets:['🎁 Efecto dotación: poseer algo aumenta su valor percibido un 250% o más','📉 Aversión a las pérdidas: una pérdida de €100 duele el doble que una ganancia de €100','🔒 Inversor que no vende en pérdidas: espera que "vuelva al precio de compra" aunque no tenga lógica','✂️ Stop-loss: herramienta para forzar la venta y evitar que el efecto dotación destruya más capital','💡 Truco: pregunta "si no lo tuviera, ¿lo compraría hoy a este precio?" Si no, vende.'],
        fact:'Kahneman y Tversky (Nobel de Economía 2002) cuantificaron la aversión a las pérdidas: las pérdidas duelen 2,5 veces más de lo que las ganancias equivalentes agradan. Esto explica el 80% de las malas decisiones de inversión.'},
      {type:'quiz', tag:'⚓ Quiz', title:'Compraste acciones a €50. Ahora valen €30. ¿Cuál es la decisión racional?',
        opts:['Mantener hasta que vuelvan a €50 para no materializar la pérdida','Evaluar si seguirías comprando HOY a €30 sabiendo lo que sabes','Vender inmediatamente y asumir la pérdida siempre','Comprar más para bajar el precio medio siempre'], correct:1,
        exp:'La pregunta correcta no es "¿vuelve a €50?" sino "¿si no tuviera estas acciones, las compraría hoy a €30?" Si la respuesta es no, el precio de compra es irrelevante. Es un coste hundido que no debe influir en decisiones futuras.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 43 — Gestión del Riesgo Real
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:55, icon:'🎲', title:'Gestión del Riesgo: Más Allá de la Diversificación',
    desc:'Volatilidad, drawdown, Sharpe ratio y cómo medir el riesgo de verdad.',
    xp:30, tag:'AVANZADO', tagC:'blue', users:'11.900',
    steps:[
      {type:'content', tag:'🎲 Módulo 43', title:'¿Qué es el Riesgo Realmente?',
        intro:'El riesgo no es solo "puedo perder dinero". Hay múltiples tipos de riesgo que el inversor debe manejar: riesgo de mercado (volatilidad), riesgo de liquidez (no poder vender), riesgo de concentración, riesgo de inflación y riesgo de longevidad.',
        bullets:['📊 Volatilidad: la desviación estándar de los retornos. Alta volatilidad = mayor incertidumbre','📉 Drawdown máximo: la mayor caída pico-a-valle históricamente. S&P500: -56% en 2008','⚖️ Ratio de Sharpe: rentabilidad extra por unidad de riesgo tomado. Más alto = mejor','🔒 Riesgo de liquidez: activos que no puedes vender rápido (inmobiliario, startups, PE)','⏰ Riesgo de longevidad: quedarte sin capital antes de morir'],
        fact:'El Bitcoin tiene una volatilidad anualizada del 70-90%. El S&P 500: 15-20%. Los bonos del Estado alemán: 5-7%. La volatilidad es el precio que pagas por la rentabilidad esperada.'},
      {type:'content', tag:'🎲 Módulo 43', title:'Cómo Gestionar el Riesgo Personal',
        intro:'La gestión del riesgo no es eliminar el riesgo — es tomar el riesgo correcto para tu situación. Un 25 años puede tolerar más riesgo (tiene tiempo). Un 60 años con pocos ahorros, no.',
        bullets:['📅 Horizonte temporal: más tiempo = puedes tomar más riesgo de mercado','💰 Capacidad financiera: con fondo de emergencia completo, el riesgo de mercado importa menos','🧠 Tolerancia emocional: si no puedes dormir con una caída del 40%, reduce riesgo','📊 Regla del 100-edad: porcentaje en renta variable = 100 - tu edad (regla simple, no perfecta)','🛡️ Seguro de vida e invalidez: protege el activo más valioso — tu capacidad de ganar dinero'],
        fact:'Un estudio de Vanguard: el error más costoso de los inversores no es la mala selección de activos sino la venta en pánico en los crashes. El riesgo de comportamiento supera al riesgo de mercado.'},
      {type:'quiz', tag:'🎲 Quiz', title:'¿Qué mide el "drawdown máximo" de una inversión?',
        opts:['La comisión máxima cobrada','La mayor pérdida desde un máximo hasta el siguiente mínimo','La volatilidad anualizada','El año de peor rentabilidad'], correct:1,
        exp:'El drawdown máximo es la peor caída posible que experimentaste si compraste en el peor momento. Para el S&P 500: -56% en 2008-09. Saber este número ayuda a calibrar si tu tolerancia al riesgo es real o teórica.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 44 — El Mercado Inmobiliario Español
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:56, icon:'🏘️', title:'Inmobiliario en España: La Guía Real',
    desc:'Burbuja, alquiler, zonas tensionadas y la verdad sobre el ladrillo.',
    xp:30, tag:'ESPAÑA', tagC:'red', users:'34.200',
    steps:[
      {type:'content', tag:'🏘️ Módulo 44', title:'El Precio de la Vivienda en España',
        intro:'España tiene uno de los mercados inmobiliarios más comentados de Europa. La burbuja de 2007 (y el crash posterior del -40%) marcó a toda una generación. La recuperación post-COVID y las tensiones de oferta han creado una nueva situación que no tiene respuestas fáciles.',
        bullets:['📈 Precio medio España 2024: ~€2.200/m² (vs €2.700 en el pico de 2007)','🏙️ Madrid/Barcelona: €4.500-€6.000/m² en zonas prime','📊 Esfuerzo para comprar vivienda: 8-9 años de sueldo bruto en las grandes ciudades','📉 Zona de burbuja: PER inmobiliario (precio/alquiler anual) > 25 en muchas ciudades','⚡ Tensión de oferta: Ley de Vivienda 2023 limitó subidas de alquiler en zonas tensionadas'],
        fact:'En 1970, un español de clase media tardaba ~3 años de sueldo en pagar una vivienda. En 2024: 8-9 años. La brecha entre salarios y precios inmobiliarios no ha parado de crecer en décadas.'},
      {type:'content', tag:'🏘️ Módulo 44', title:'Invertir en Vivienda para Alquiler: Los Números',
        intro:'La rentabilidad bruta del alquiler en España es del 5-7% en ciudades medianas y 3-4% en Madrid/Barcelona. Pero la neta, tras impuestos, gastos de mantenimiento, seguros y vacíos, suele ser 2-4%. Menos brillante que en el titular.',
        bullets:['📊 Rentabilidad bruta = alquiler anual / precio compra × 100','💸 Gastos típicos: IBI, comunidad, mantenimiento, seguro, vacíos = 25-35% del alquiler','🧾 Tributación: los ingresos por alquiler como persona física tributan en IRPF (hasta 47%)','⚖️ Reducción del 60%: en alquileres de vivienda habitual, el 60% del rendimiento está exento','📍 Mejor rentabilidad: ciudades medianas (Valencia, Málaga, Zaragoza) vs Madrid/Barcelona'],
        fact:'Un piso de €200.000 que alquila a €800/mes da una rentabilidad bruta del 4,8%. Menos gastos (30%), menos impuestos (IRPF 30%): rentabilidad neta real ~2,5%. El S&P 500 ha dado un 10% anual en el mismo período.'},
      {type:'quiz', tag:'🏘️ Quiz', title:'¿Qué es la "rentabilidad neta" del alquiler?',
        opts:['El alquiler mensual multiplicado por 12','El ingreso anual de alquiler menos todos los gastos e impuestos','El precio de venta menos el precio de compra','La apreciación anual del precio del inmueble'], correct:1,
        exp:'La rentabilidad neta descuenta todos los costes reales: IBI, comunidad, mantenimiento, seguros, periodos vacíos e impuestos. La bruta engaña — la neta es la verdad sobre lo que ganas.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 45 — Wealth Building: Las 3 Fases
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:57, icon:'🏗️', title:'Las 3 Fases para Construir Patrimonio',
    desc:'Supervivencia → Crecimiento → Protección. El mapa completo.',
    xp:25, tag:'FUNDAMENTAL', tagC:'green', users:'29.100',
    steps:[
      {type:'content', tag:'🏗️ Módulo 45', title:'Fase 1: Supervivencia Financiera',
        intro:'Antes de invertir un solo euro, necesitas tener los cimientos. Sin ellos, cualquier estrategia de inversión es un castillo en el aire que se derrumba al primer imprevisto.',
        bullets:['🛡️ Fondo de emergencia: 3-6 meses de gastos en cuenta remunerada','💳 Sin deudas de alto interés (>15% TAE)','📋 Seguro de salud, vida e invalidez básicos','🏠 No gastar más del 30% del ingreso en vivienda','✅ Cuando esto esté, y solo entonces, empieza a invertir'],
        fact:'El 60% de los españoles no podría aguantar 3 meses sin ingresos con sus ahorros actuales. La fase de supervivencia no es opcional — sin ella, el primer imprevisto destruye años de trabajo.'},
      {type:'content', tag:'🏗️ Módulo 45', title:'Fase 2: Crecimiento Agresivo',
        intro:'Una vez tienes los cimientos, el objetivo es hacer crecer el patrimonio lo más rápido posible. Esta fase es donde se construye la riqueza. Requiere alta tasa de ahorro, inversión sistemática y tolerancia al riesgo.',
        bullets:['📈 Máxima tasa de ahorro posible (objetivo: 30-50%)','🚀 Alta exposición a renta variable (80-100% de la cartera)','💼 Desarrollo de carrera para maximizar ingresos','🏢 Side business si es posible','⏰ Esta fase dura décadas — la paciencia es la clave'],
        fact:'La diferencia entre ahorrar el 20% vs el 40% del sueldo no es llegar antes a la meta — es llegar en la mitad del tiempo. Con el 50% de ahorro puedes "jubilarte" en 17 años desde cero.'},
      {type:'content', tag:'🏗️ Módulo 45', title:'Fase 3: Protección y Legado',
        intro:'Cuando tienes suficiente, el objetivo cambia: no perder lo que tienes. En esta fase se reduce el riesgo, se diversifica más, se planifica la herencia y se piensa en el impacto más allá del dinero.',
        bullets:['🛡️ Reducir renta variable (más bonos, inmobiliario, cash)','⚖️ Planificación sucesoria: testamento, seguros de vida, estructura patrimonial','🌍 Diversificación geográfica: no todo en un país o moneda','💸 La regla del 4% para retiradas sostenibles','🎯 Pregunta clave: "¿cuánto es suficiente?"'],
        fact:'"Si tienes suficiente para vivir el resto de tu vida haciendo lo que amas, eres más rico que el 99% del planeta." — Naval Ravikant'},
      {type:'quiz', tag:'🏗️ Quiz', title:'¿Qué debes tener ANTES de empezar a invertir en bolsa?',
        opts:['Al menos €10.000 de capital inicial','Fondo de emergencia y sin deudas de alto interés','Conocimiento avanzado de análisis técnico','Una cuenta en un broker profesional'], correct:1,
        exp:'Sin fondo de emergencia, cualquier gasto inesperado te forzará a vender inversiones — posiblemente en pérdidas. La deuda de alto interés garantiza una rentabilidad negativa segura. Estos cimientos van primero.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 46 — Cómo Leer un Balance de Empresa
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:58, icon:'📋', title:'Cómo Leer un Balance: Guía del Inversor',
    desc:'Activos, pasivos, patrimonio neto y las señales que revelan la salud real.',
    xp:30, tag:'AVANZADO', tagC:'blue', users:'13.700',
    steps:[
      {type:'content', tag:'📋 Módulo 46', title:'La Ecuación Contable Fundamental',
        intro:'Todo balance de empresa sigue una ecuación simple: Activos = Pasivos + Patrimonio Neto. Lo que tiene la empresa = lo que debe + lo que pertenece a los accionistas. Esta ecuación nunca falla.',
        bullets:['📦 Activo circulante: lo que se convierte en cash en <12 meses (caja, clientes, inventario)','🏭 Activo fijo: lo que dura más de un año (maquinaria, edificios, patentes)','💳 Pasivo corriente: lo que se debe en <12 meses (proveedores, deuda corto plazo)','🏦 Pasivo largo plazo: deuda a más de un año (bonos, préstamos bancarios)','💰 Patrimonio neto: lo que queda para los accionistas si se paga todo'],
        fact:'Enron tenía un balance aparentemente sólido antes de su colapso en 2001. Los auditores descubrieron $1.200 millones en pasivos ocultos en entidades especiales no consolidadas. Leer un balance requiere ir más allá de los números superficiales.'},
      {type:'content', tag:'📋 Módulo 46', title:'Las Métricas que Importan',
        intro:'El balance por sí solo dice poco. Cobran significado cuando calculas ratios que relacionan las diferentes partidas y las comparas con empresas del mismo sector.',
        bullets:['⚡ Current Ratio = Activo Circulante / Pasivo Corriente. >1,5 = sano','🏦 Deuda neta = Deuda total - Caja. Si es negativa, la empresa tiene más caja que deuda','📊 D/E Ratio = Deuda / Patrimonio. >2 puede ser preocupante según sector','💸 Tangible Book Value: lo que queda tras eliminar activos intangibles (marca, goodwill)','🎯 Return on Equity (ROE) = Beneficio / Patrimonio. >15% sostenido indica moat real'],
        fact:'Apple tiene más de $160.000M en caja neta. Berkshire Hathaway: $160.000M. Amazon: $70.000M. Estas reservas les dan ventaja competitiva enorme: pueden invertir en crisis cuando otros no pueden.'},
      {type:'quiz', tag:'📋 Quiz', title:'¿Qué indica un "Current Ratio" menor que 1?',
        opts:['La empresa está creciendo rápidamente','La empresa tiene más deudas a corto plazo que activos líquidos a corto plazo','La empresa es muy rentable','El precio de la acción es bajo'], correct:1,
        exp:'Current Ratio < 1 significa que la empresa debe más de lo que puede cobrar en el próximo año. No es automáticamente catastrófico (depende del sector), pero es una señal de alerta que requiere análisis.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 47 — La Economía del Comportamiento
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:59, icon:'🔬', title:'Economía del Comportamiento: Cómo Piensan los Ricos',
    desc:'Thaler, Kahneman y los sesgos que sabotean tus finanzas.',
    xp:25, tag:'PSICOLOGÍA', tagC:'purple', users:'20.300',
    steps:[
      {type:'content', tag:'🔬 Módulo 47', title:'Los 7 Sesgos que Destruyen el Patrimonio',
        intro:'La economía conductual estudia por qué las personas toman decisiones irracionales con el dinero de forma sistemática y predecible. Richard Thaler (Nobel 2017) y Daniel Kahneman (Nobel 2002) cartografiaron el mapa completo.',
        bullets:['💸 Contabilidad mental: €100 de nómina ≠ €100 de casino (aunque valen lo mismo)','🔁 Status quo: preferimos no cambiar aunque cambiar sea mejor','📅 Descuento hiperbólico: preferimos €90 hoy a €100 en un mes (arruina el ahorro)','📰 Heurística de disponibilidad: sobreestimamos lo que sale en las noticias','🎲 Ilusión de control: creemos controlar resultados aleatorios (market timing)','📈 Exceso de confianza: el 80% cree ser mejor conductor que la media','🐑 Comportamiento de manada: compramos cuando todos compran (máximos)'],
        fact:'Un estudio de Dalbar: el inversor medio del S&P 500 obtuvo un 3,7% anual en los últimos 30 años. El índice dio un 10,7%. La diferencia: 7% destruido por los propios sesgos del inversor.'},
      {type:'quiz', tag:'🔬 Quiz', title:'¿Qué es el "descuento hiperbólico"?',
        opts:['Preferir rentabilidades hipotéticas sobre rentabilidades reales','Preferir recompensas menores hoy sobre recompensas mayores en el futuro','Descontar el efecto de la inflación de forma excesiva','Sobrevalorar activos en momentos de euforia'], correct:1,
        exp:'El descuento hiperbólico explica por qué no ahorramos: el placer de gastar HOY es muy concreto, el beneficio de ahorrar en 30 años es abstracto. Nuestro cerebro descuenta el futuro de forma no lineal — el fondo automático lo compensa.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 48 — El Impuesto sobre el Patrimonio y la Planificación
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:60, icon:'⚖️', title:'Optimización Fiscal Avanzada en España',
    desc:'Patrimonio, herencias, plusvalías y las estructuras que usan los ricos.',
    xp:35, tag:'ESPAÑA', tagC:'red', users:'16.100',
    steps:[
      {type:'content', tag:'⚖️ Módulo 48', title:'El Impuesto sobre el Patrimonio',
        intro:'España es uno de los pocos países europeos que mantiene el impuesto sobre el patrimonio. Grava los activos netos por encima de un mínimo exento. Pero hay comunidades autónomas que lo bonifican al 100% — incluyendo Madrid.',
        bullets:['📊 Tipo: 0,2% a 3,5% sobre patrimonio neto que exceda el mínimo exento','💰 Mínimo exento general: €700.000 por persona (más exención de vivienda habitual hasta €300.000)','🏛️ Madrid: bonificación del 100% — en la práctica no se paga nada','🌍 Comparativa: Francia, Alemania y Reino Unido no tienen impuesto sobre el patrimonio','⚠️ Impuesto de Solidaridad de las Grandes Fortunas (>€3M): alternativo para Madrid desde 2023'],
        fact:'Una pareja con patrimonio de €2M en Madrid no paga impuesto sobre el patrimonio: cada uno tiene €1M, con €700K de mínimo exento + €300K de vivienda habitual = justo al límite. Planificación legal al 100%.'},
      {type:'content', tag:'⚖️ Módulo 48', title:'Impuesto de Sucesiones y Herencias',
        intro:'El impuesto de sucesiones varía enormemente por comunidad autónoma. La diferencia entre heredar en Madrid vs en otra comunidad puede ser de cientos de miles de euros. El desconocimiento es el enemigo.',
        bullets:['🏛️ Madrid: bonificación del 99% para cónyuge, descendientes y ascendientes','🌍 Cataluña, Andalucía, C. Valenciana: tipos más altos pero con bonificaciones crecientes','📋 Donaciones en vida: pueden ser fiscalmente más eficientes que la herencia','🏠 Transmisión de empresa familiar: reducción del 95% del valor en el IP si cumple requisitos','⚠️ Residencia fiscal: donde estás domiciliado determina qué normativa autonómica aplica'],
        fact:'Heredar €300.000 en Madrid: impuesto = €0 (bonificación 99%). El mismo importe en algunas comunidades puede generar €60.000-€90.000 de impuesto. La residencia fiscal es una decisión patrimonial de primer orden.'},
      {type:'quiz', tag:'⚖️ Quiz', title:'En España, ¿qué comunidad autónoma tiene una bonificación del 99% en el impuesto de sucesiones?',
        opts:['Cataluña','Andalucía','Madrid','País Vasco'], correct:2,
        exp:'Madrid aplica una bonificación del 99% en cuota del impuesto de sucesiones y donaciones entre familiares directos. Esto significa que en la práctica prácticamente no se paga. Es un factor importante en decisiones de residencia fiscal.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 49 — El Arte de los Ingresos Pasivos Reales
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:61, icon:'💤', title:'Ingresos Pasivos: Los Reales vs los del Gurú',
    desc:'Qué es realmente pasivo, cuánto esfuerzo requiere y los números honestos.',
    xp:25, tag:'AVANZADO', tagC:'gold', users:'38.700',
    steps:[
      {type:'content', tag:'💤 Módulo 49', title:'El Espectro: De Activo a Pasivo',
        intro:'"Ingreso pasivo" se ha convertido en el término más abusado del marketing financiero de Instagram. La realidad es que nada es completamente pasivo. La diferencia está en cuánto tiempo activo requiere por euro generado.',
        bullets:['📊 Dividendos/ETFs: el más pasivo. Cero gestión, rendimiento automático','🏠 Alquiler: semi-pasivo. Requiere gestión, reparaciones, relación con inquilinos','💻 Curso online: pasivo después del esfuerzo inicial (meses de creación)','📱 App/Software: pasivo tras el desarrollo (años de trabajo)','❌ "Hacer €5.000/mes mientras duermes en 30 días": siempre es mentira'],
        fact:'Robert Kiyosaki popularizó la idea de ingresos pasivos en 1997. Pero incluso su negocio de "educación financiera" requiere conferencias, libros y marketing activo. El verdadero pasivo tarda años en construirse.'},
      {type:'content', tag:'💤 Módulo 49', title:'Los Números Reales del Ingreso Pasivo',
        intro:'Para vivir de ingresos pasivos necesitas capital. El capital no cae del cielo. Entender cuánto necesitas y cuánto tiempo tardarás en acumularlo es el primer paso honesto.',
        bullets:['📊 Con ETF al 4% de retiro: para €1.000/mes necesitas €300.000 de capital','🏠 Con alquiler al 4% neto: para €800/mes necesitas €240.000 en inmuebles','💸 Dividendos al 4% yield: para €1.500/mes necesitas €450.000 en cartera','💼 Negocio automatizado: pueden superar el 20% de retorno, pero llevan 3-5 años','⏰ Tiempo para acumular €300.000 ahorrando €500/mes al 7%: ~27 años'],
        fact:'La definición legal de "rendimientos del capital mobiliario" (dividendos, intereses) en España cotiza entre el 19% y el 28%. El "ingreso pasivo" tiene su propio impuesto — planificarlo bien puede ahorrarte el 10% del total.'},
      {type:'quiz', tag:'💤 Quiz', title:'¿Cuánto capital necesitas para generar €1.000/mes usando la regla del 4%?',
        opts:['€120.000','€300.000','€500.000','€1.000.000'], correct:1,
        exp:'€1.000/mes = €12.000/año. Con la regla del 4%: necesitas €12.000 / 0,04 = €300.000 de capital. Con esa cantidad, puedes retirar el 4% anual indefinidamente sin agotar el patrimonio (históricamente).'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 50 — Globalización, Geopolítica y tu Cartera
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:62, icon:'🌍', title:'Geopolítica y Mercados: Lo que Debes Saber',
    desc:'Cómo las tensiones globales afectan a tus inversiones y qué hacer.',
    xp:25, tag:'GLOBAL', tagC:'blue', users:'19.400',
    steps:[
      {type:'content', tag:'🌍 Módulo 50', title:'Cómo la Geopolítica Mueve los Mercados',
        intro:'Los mercados financieros no existen en el vacío. Las guerras, las sanciones, los acuerdos comerciales y las elecciones mueven precios. Pero el inversor de largo plazo tiene una ventaja: el mercado siempre ha superado los eventos geopolíticos.',
        bullets:['⚔️ Guerras: generalmente caídas iniciales seguidas de recuperación rápida','🗳️ Elecciones: los mercados odian la incertidumbre más que cualquier resultado','🛢️ Commodities: petróleo, gas y materias primas reaccionan inmediatamente a tensiones','💱 Divisas: el dólar es el activo de refugio universal en tiempos de crisis','🌐 Diversificación global: distribuye el riesgo geopolítico entre 23+ países'],
        fact:'El S&P 500 ha subido durante guerras (Vietnam, Golf, Irak). El error es asumir que "esta vez es diferente". En el Pearl Harbor, el mercado cayó un 11% en días — y en 6 meses había recuperado todo.'},
      {type:'quiz', tag:'🌍 Quiz', title:'¿Cuál es la estrategia más robusta frente a riesgos geopolíticos?',
        opts:['Convertir todo a cash antes de cada crisis','Concentrarse en empresas del sector defensa','Diversificación global que distribuye el riesgo entre países','Invertir solo en bonos del gobierno alemán'], correct:2,
        exp:'La diversificación global (MSCI World, por ejemplo) distribuye el riesgo geopolítico entre 23 países. Si una región sufre, otras compensan. Es la única estrategia que no requiere predecir el próximo conflicto.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 51 — Conceptos Macroeconómicos para Inversores
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:63, icon:'📡', title:'Macroeconomía: El Mapa del Territorio',
    desc:'PIB, tipos de interés, inflación y ciclos — el lenguaje del inversor avanzado.',
    xp:30, tag:'AVANZADO', tagC:'blue', users:'14.800',
    steps:[
      {type:'content', tag:'📡 Módulo 51', title:'Las Variables Macro que Mueven los Mercados',
        intro:'El inversor que entiende macroeconomía no predice el futuro — entiende el contexto. No te dice cuándo comprar, pero sí en qué entorno estás y cómo afecta a tus activos.',
        bullets:['📈 PIB creciendo + inflación controlada = entorno ideal para acciones','📉 Recesión = beneficios empresariales bajan → bolsa baja','🔥 Inflación alta = BCE sube tipos → bonos bajan, hipotecas suben','💸 Tipos bajos = dinero barato → crecen bolsa, inmobiliario y cripto','🔄 El ciclo completo: expansión → pico → recesión → recuperación → expansión'],
        fact:'La curva de inversión del bono americano (tipos a corto > tipos a largo) ha precedido a las 7 últimas recesiones americanas con un adelanto de 12-18 meses. No es perfecta, pero es la mejor señal macro que tenemos.'},
      {type:'content', tag:'📡 Módulo 51', title:'El Banco Central Europeo y Tu Hipoteca',
        intro:'El BCE fija el tipo de interés de referencia para la eurozona. Este tipo determina el coste del dinero en toda Europa y afecta directamente a tus hipotecas, préstamos y depósitos. Entender cómo funciona es finanzas personales de primer orden.',
        bullets:['🏦 Tipo BCE → Tipo Euribor → Tu hipoteca variable','📊 Euribor 12 meses: el índice más usado en hipotecas variables españolas','📈 Cuando BCE sube tipos: hipoteca variable sube, depósitos mejoran, bonos bajan','📉 Cuando BCE baja tipos: hipoteca variable baja, depósitos empeoran, bonos suben','🎯 Hipoteca fija: te inmuniza contra los cambios del BCE — pagas estabilidad'],
        fact:'En 2022, el BCE subió tipos de 0% al 4,5% en solo 14 meses. Una hipoteca variable de €200.000 a 25 años pasó de €700/mes a €1.050/mes. +€350/mes de coste adicional de un año a otro.'},
      {type:'quiz', tag:'📡 Quiz', title:'Si el BCE sube los tipos de interés, ¿qué ocurre con el precio de los bonos existentes?',
        opts:['Suben porque ahora rinden más','Bajan porque los nuevos bonos son más atractivos','No cambian ya que el cupón es fijo','Depende de si son bonos públicos o corporativos'], correct:1,
        exp:'Relación inversa tipos-bonos: si el BCE emite nuevos bonos al 4%, nadie quiere tus bonos al 2%. Para que sean atractivos, su precio debe bajar hasta que la rentabilidad efectiva iguale el 4%. Tipos suben = precio bonos baja.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 52 — Tu Primer Millón: El Plan Concreto
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:64, icon:'🎯', title:'El Camino al Primer Millón: Plan Real',
    desc:'No motivación. Matemáticas, plazos y los pasos exactos.',
    xp:40, tag:'MASTER', tagC:'gold', users:'52.100',
    steps:[
      {type:'content', tag:'🎯 Módulo 52', title:'Las Matemáticas del Primer Millón',
        intro:'Un millón de euros no es inalcanzable para una persona normal. Es matemática y tiempo. El problema es que nadie te lo explica en términos concretos sin intentar venderte algo.',
        bullets:['💰 Ahorrando €500/mes al 8% anual → €1M en 37 años','💰 Ahorrando €1.000/mes al 8% anual → €1M en 27 años','💰 Ahorrando €2.000/mes al 8% anual → €1M en 19 años','💰 Ahorrando €500/mes al 8% + ingreso extra de €500/mes reinvertido → €1M en 26 años','⏰ La variable más poderosa no es cuánto ganas — es a qué edad empiezas'],
        fact:'Si empiezas a los 25 con €500/mes, tienes €1M a los 62. Si empiezas a los 35 con €1.000/mes (el doble), llegas a los 62 con €850.000. El que empezó con menos dinero llega con más. El tiempo es el activo.'},
      {type:'content', tag:'🎯 Módulo 52', title:'Los 5 Pasos No Negociables',
        intro:'Todo el mundo que ha alcanzado libertad financiera sin herencia ni lotería ha seguido una versión de estos mismos 5 pasos. No hay atajos — pero sí hay un camino probado.',
        bullets:['1️⃣ Maximiza tu ingreso activo: carrera, negociación, skills que pagan bien','2️⃣ Minimiza gastos fijos: vivienda <30% ingresos, no deuda de consumo','3️⃣ Automatiza el ahorro: el 20-40% del ingreso va a inversión el mismo día de cobro','4️⃣ Invierte en activos que generan retornos compuestos: ETFs globales + inmobiliario si aplica','5️⃣ No interrumpas el proceso: el mayor error es vender en los crashes o parar las aportaciones'],
        fact:'Morgan Housel en "La Psicología del Dinero": Ronald Read, conserje y empleado de gasolinera, dejó €8 millones al morir a los 92 años. Nunca tuvo un sueldo alto. Simplemente invirtió sistemáticamente en acciones durante 70 años y nunca vendió.'},
      {type:'quiz', tag:'🎯 Quiz', title:'Inviertes €500/mes al 8% anual. ¿Cuánto tendrás en 30 años?',
        opts:['€180.000 (lo aportado)','€330.000 (aproximadamente el doble)','€680.000 (más del triple por el interés compuesto)','€1.200.000 (imposible con esa cantidad)'], correct:2,
        exp:'€500/mes × 12 meses × 30 años = €180.000 aportados. Al 8% con interés compuesto = €679.000. El interés compuesto casi cuadruplica tu dinero. Y si hubieran sido 40 años: €1.50M. El tiempo es el multiplicador.'},
      {type:'quiz', tag:'🎯 Quiz', title:'¿Cuál es el factor MÁS importante para llegar al primer millón?',
        opts:['Elegir las mejores acciones','Empezar lo antes posible y ser constante','Tener un sueldo muy alto','Conocer el momento exacto para comprar y vender'], correct:1,
        exp:'Empezar pronto y no parar es estadísticamente el factor dominante. El 80% del millón se genera en los últimos 10 años gracias al interés compuesto sobre una base grande. Quien empieza a los 25 con €300/mes llega antes que quien empieza a los 40 con €1.500/mes.'},
    ],
  },
  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 65 — El Poder del Networking Financiero
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:65, icon:'🤝', title:'Networking que Construye Riqueza',
    desc:'Las personas que conoces determinan tu techo de ingresos más que tu CV.',
    xp:25, tag:'CARRERA', tagC:'blue', users:'16.200',
    steps:[
      {type:'content', tag:'🤝 Módulo 65', title:'Por Qué Tu Red Vale Más que Tu Título',
        intro:'El 70-80% de los empleos bien remunerados se cubren antes de publicarse. Los estudios son claros: las personas con redes fuertes ganan significativamente más a lo largo de su carrera y ascienden más rápido. El networking no es "hacer contactos" — es construir relaciones que generan valor mutuo.',
        bullets:['💼 El 80% de los puestos de trabajo se cubren por referidos — no por portales de empleo','📊 Los empleados referidos ganan de media un 8-15% más desde el primer día','🤝 Dar primero: ofrecer valor antes de pedir es la base del networking efectivo','🌐 LinkedIn: el 97% de los reclutadores lo usan — tu perfil es tu currículum vivo','☕ La reunión "para tomar un café" ha generado más millones que mil CVs'],
        fact:'Jeff Weiner, CEO de LinkedIn, calculó que cada conexión de primer grado en su red valdría estadísticamente unos $1.700 anuales en oportunidades de carrera.'},
      {type:'content', tag:'🤝 Módulo 65', title:'El Framework de Networking Efectivo',
        intro:'El networking de alto valor no es coleccionar contactos — es profundizar en relaciones selectas. La calidad supera a la cantidad de forma abrumadora.',
        bullets:['🎯 Los 50 más importantes: identifica las 50 personas más valiosas de tu industria y construye relación con ellas','📅 Sistema de seguimiento: cada 90 días, una razón genuina para contactar','💎 Dar antes de pedir: comparte artículos útiles, haz presentaciones, ayuda sin esperar nada','🎤 Habla en público: una ponencia te presenta ante 200 personas de una vez','✉️ Email frío perfecto: asunto específico, conexión genuina, petición concreta, máximo 5 líneas'],
        fact:'Charlie Munger dijo que las tres reglas de Berkshire son: socios confiables, trabajo interesante y precio razonable. La primera — socios confiables — siempre viene de networking previo.'},
      {type:'quiz', tag:'🤝 Quiz', title:'¿Qué porcentaje de empleos se cubre por networking antes de publicarse?',
        opts:['20-30%','50-60%','70-80%','Menos del 20%'], correct:2,
        exp:'Los estudios de LinkedIn y Harvard Business Review sitúan consistentemente entre el 70-80% los puestos que se cubren por referidos o contactos antes de (o sin) publicarse en portales de empleo.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 66 — Opciones y Derivados: La Caja de Pandora
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:66, icon:'🎲', title:'Opciones Financieras: Poder y Peligro',
    desc:'Los instrumentos que usan los profesionales. Y que arruinan a los aficionados.',
    xp:35, tag:'AVANZADO', tagC:'red', users:'8.100',
    steps:[
      {type:'content', tag:'🎲 Módulo 66', title:'Qué es una Opción Financiera',
        intro:'Una opción es el derecho (no la obligación) de comprar o vender un activo a un precio fijado (strike) hasta una fecha determinada (vencimiento). Pagas una prima por ese derecho. Las opciones pueden usarse para cubrir riesgo o para especular con apalancamiento extremo.',
        bullets:['📞 Call: derecho a COMPRAR el activo al precio strike','📤 Put: derecho a VENDER el activo al precio strike','💰 Prima: lo que pagas por la opción (máximo que puedes perder como comprador)','📅 Vencimiento: la opción vale €0 si no la ejerces antes de esa fecha','⚡ Apalancamiento: controlas 100 acciones con una prima de €100-500 — potencial de ×10 o ×0'],
        fact:'En la crisis de 2008, los bancos de Wall Street perdieron más de $450.000 millones en derivados. Un trader de JP Morgan ("La Ballena de Londres") perdió $6.200 millones en 2012 con posiciones en derivados de crédito.'},
      {type:'content', tag:'🎲 Módulo 66', title:'Estrategias Conservadoras con Opciones',
        intro:'Las opciones no son solo especulación. Los inversores más sofisticados las usan para generar ingresos regulares o proteger su cartera. Las estrategias covered call y cash-secured put son las más seguras para el inversor individual.',
        bullets:['📊 Covered Call: vendes el derecho a comprar tus acciones al strike — ingresos extra aunque la acción no suba','🛡️ Put protectora: compras un Put sobre acciones que tienes — seguro ante caídas','💵 Cash-Secured Put: vendes un Put prometiendo comprar acciones si caen — cobras prima y potencialmente compras barato','⚠️ Greeks: Delta, Gamma, Theta, Vega — las variables que afectan el precio de la opción','🚫 Lo que NO hacer: opciones naked (vender sin tener el activo) o estrategias no entendidas'],
        fact:'Warren Buffett vende Puts sobre empresas que quiere comprar a precios menores. En 2008 vendió Puts sobre índices y cobró $4.900 millones en primas. Si el mercado subía, ganaba. Si bajaba, compraba barato. Solo pierde si los índices bajan a 0.'},
      {type:'quiz', tag:'🎲 Quiz', title:'¿Cuál es el máximo que puedes perder comprando una opción Call?',
        opts:['El valor total del activo subyacente','La prima pagada por la opción','Infinito — no hay límite','El 50% del precio de las acciones'], correct:1,
        exp:'Como comprador de una opción, tu pérdida máxima es exactamente la prima que pagaste. Si la opción vence sin valor (out-of-the-money), pierdes solo la prima. Nunca puedes perder más. Esto es lo que diferencia al comprador del vendedor de opciones.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 67 — Psicología del Precio: Por qué el €9,99 Funciona
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:67, icon:'🧩', title:'Trampas de Precios que Vacían tu Cartera',
    desc:'Las empresas gastan millones para que compres más. Aprende a verlas.',
    xp:20, tag:'PSICOLOGÍA', tagC:'purple', users:'29.400',
    steps:[
      {type:'content', tag:'🧩 Módulo 67', title:'Los 8 Trucos de Precio que Usas Cada Día',
        intro:'El precio no es solo un número. Es una herramienta psicológica. Las grandes empresas invierten en equipos de "behavioral economists" cuyo único trabajo es maximizar cuánto pagas sin que te parezca caro. Conocer estos trucos te hace inmune.',
        bullets:['9️⃣ Precio encanto: €9,99 activa el "dígito izquierdo" — tu cerebro procesa €9, no €10','🎁 Bundling: juntar productos aumenta el valor percibido aunque el precio total sea mayor','⚡ Scarcity: "quedan 2 en stock" — urgencia artificial que bypasea la razón','🔗 Anchoring: el primer precio que ves ancla toda evaluación posterior','📦 Suscripción: €9,99/mes parece trivial; €119,88/año, no tanto'],
        fact:'Netflix descubrió que añadir un plan Premium caro (€17/mes) hacía que el plan Estándar (€13/mes) pareciera "razonable" aunque nadie eligiera el Premium. Efecto ancla en estado puro.'},
      {type:'quiz', tag:'🧩 Quiz', title:'¿Por qué €9,99 se percibe significativamente más barato que €10?',
        opts:['La diferencia real es de €0,01','El cerebro procesa el dígito de la izquierda primero e ignora los céntimos','Las tiendas tienen menos beneficio con €9,99','Es solo tradición comercial sin base psicológica'], correct:1,
        exp:'La "ilusión del dígito izquierdo" hace que el cerebro categorice €9,99 como "9 y algo" en lugar de "casi 10". Estudios demuestran que los precios terminados en .99 generan hasta un 30% más de ventas que precios redondos ligeramente más bajos.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 68 — Fiscalidad Internacional: El Mapa del Tesoro
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:68, icon:'🌍', title:'Fiscalidad Internacional para Nómadas',
    desc:'Cómo tributa un español que trabaja en remoto o vive en el extranjero.',
    xp:30, tag:'AVANZADO', tagC:'gold', users:'11.700',
    steps:[
      {type:'content', tag:'🌍 Módulo 68', title:'Residencia Fiscal: La Regla de los 183 Días',
        intro:'Tu residencia fiscal determina dónde pagas impuestos. En España eres residente fiscal si: pasas más de 183 días al año, o tu núcleo de intereses económicos está en España (empresa, familia, propiedades). No es lo mismo residencia civil que fiscal.',
        bullets:['📅 183 días: la regla principal — si superas este umbral en España, tributa aquí','🏠 Centro de intereses: aunque pases menos de 183 días, si tu familia y trabajo están en España, eres residente','⚠️ Paraísos fiscales: el modelo 7P obliga a declarar bienes en el extranjero (>50.000€)','🇵🇹 Régimen NHR Portugal: 10 años de flat tax del 10% para pensiones y 20% para ingresos profesionales','🇦🇪 EAU Dubai: 0% impuesto personal — destino favorito de empresarios digitales'],
        fact:'Hacienda tiene convenios de intercambio de información con más de 100 países. Las cuentas en el extranjero no declaradas generan multas del 150% del valor no declarado.'},
      {type:'quiz', tag:'🌍 Quiz', title:'¿Cuántos días debes pasar fuera de España para perder la residencia fiscal?',
        opts:['90 días','183 días','270 días','Basta con empadronarte en otro país'], correct:1,
        exp:'La regla general es 183 días, pero Hacienda también considera el "centro de intereses vitales". Si tu empresa, cónyuge e hijos están en España, puedes seguir siendo residente fiscal aunque pases menos de 183 días físicamente.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 69 — El Arte de Vender: Tu Habilidad Más Rentable
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:69, icon:'💬', title:'Vender: La Habilidad que Multiplica Todo',
    desc:'Quien sabe vender nunca pasa hambre. Ni económicamente ni en oportunidades.',
    xp:25, tag:'CARRERA', tagC:'blue', users:'19.800',
    steps:[
      {type:'content', tag:'💬 Módulo 69', title:'Por Qué Vender es la Habilidad Más Infravalorada',
        intro:'Vendes constantemente: cuando pides un aumento, cuando convences a tu jefe de tu idea, cuando negocias el alquiler, cuando consigues clientes para tu negocio. La persona que sabe vender siempre tiene opciones. La que no sabe, siempre espera que alguien le dé oportunidades.',
        bullets:['💰 Los mejores vendedores en España ganan €80.000-€200.000+ anuales','🧠 Vender es resolver problemas del otro — no convencer a nadie de nada','🎯 Framework SPIN: Situación, Problema, Implicación, Necesidad — el método más probado','🤝 El silencio vende: tras lanzar la propuesta, el primero en hablar pierde','📊 Objeciones = interés disfrazado: una objeción es una pregunta sin resolver'],
        fact:'Grant Cardone vendió €100M en inmuebles sin nunca haber estudiado. Charlie Munger dijo que la habilidad para vender es el multiplicador de todas las demás habilidades.'},
      {type:'quiz', tag:'💬 Quiz', title:'¿Qué debe hacer un vendedor tras presentar su propuesta?',
        opts:['Seguir explicando los beneficios del producto','Preguntar si tienen preguntas','Guardar silencio — el primero en hablar cede ventaja','Ofrecer un descuento inmediatamente'], correct:2,
        exp:'El "cierre por silencio" es una de las técnicas más efectivas. Tras presentar la propuesta, quien habla primero revela sus cartas. El silencio crea presión psicológica natural que empuja al comprador a responder.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 70 — El Balance General Personal
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:70, icon:'📋', title:'Tu Balance Personal: La Radiografía Financiera',
    desc:'Las empresas hacen su balance trimestral. ¿Cuándo hiciste el tuyo?',
    xp:20, tag:'PRÁCTICA', tagC:'green', users:'22.300',
    steps:[
      {type:'content', tag:'📋 Módulo 70', title:'Activos, Pasivos y Patrimonio Neto',
        intro:'Un balance personal funciona igual que el de una empresa: muestra lo que tienes (activos), lo que debes (pasivos) y la diferencia (patrimonio neto). Hacerlo una vez al año es el hábito más revelador de la gestión financiera personal.',
        bullets:['📈 ACTIVOS: efectivo, inversiones, inmuebles, vehículo, pensión privada acumulada','💳 PASIVOS: hipoteca pendiente, créditos al consumo, deuda de tarjetas, préstamos familiares','💎 PATRIMONIO NETO = Activos − Pasivos (el indicador más honesto de tu salud financiera)','📊 Objetivo: que el patrimonio neto crezca cada año aunque sea un 5%','🎯 Regla de Kiyosaki: activo = pone dinero en tu bolsillo; pasivo = lo saca'],
        fact:'Según el Banco de España, el patrimonio neto mediano de los hogares españoles es €207.800, pero con diferencias enormes: el 10% más rico tiene 50 veces más que el 10% más pobre.'},
      {type:'content', tag:'📋 Módulo 70', title:'Cómo Construir tu Balance en 30 Minutos',
        intro:'No necesitas un contable. Con una hoja de cálculo y honestidad es suficiente. El ejercicio de escribirlo todo en un sitio tiene un poder transformador: lo que se mide, mejora.',
        bullets:['1️⃣ Activos líquidos: suma todas las cuentas corrientes y depósitos','2️⃣ Activos de inversión: valor de mercado de acciones, ETFs, fondos, criptos','3️⃣ Activos inmobiliarios: valor estimado de inmuebles (conservador)','4️⃣ Otros activos: coche (precio de venta realista), plan de pensiones acumulado','5️⃣ Pasivos: saldo pendiente de TODAS las deudas — hipoteca, créditos, tarjetas'],
        fact:'Un estudio de la Universidad de Stanford encontró que las personas que escriben su net worth regularmente toman mejores decisiones financieras y ahorran un 34% más que las que no lo hacen.'},
      {type:'quiz', tag:'📋 Quiz', title:'Si tienes €150.000 en activos y €90.000 en pasivos, ¿cuál es tu patrimonio neto?',
        opts:['€240.000','€90.000','€60.000','Depende de los tipos de activos'], correct:2,
        exp:'Patrimonio neto = Activos − Pasivos = €150.000 − €90.000 = €60.000. Simple aritmética, pero el ejercicio de calcularlo obliga a ser honesto sobre todo lo que se debe y todo lo que realmente vale lo que se tiene.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 71 — La Mentalidad del Millonario Autodidacta
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:71, icon:'🧠', title:'La Mentalidad que Construye Riqueza Real',
    desc:'No es el dinero lo que hace ricos a los ricos. Es lo que piensan sobre el dinero.',
    xp:25, tag:'PSICOLOGÍA', tagC:'purple', users:'34.600',
    steps:[
      {type:'content', tag:'🧠 Módulo 71', title:'Los 5 Principios Mentales de los Constructores de Riqueza',
        intro:'Los estudios de Thomas Stanley (El Millonario de al Lado) de 1.000+ millonarios revelaron algo sorprendente: la mayoría no son herederos ni ejecutivos de grandes empresas. Son personas normales con hábitos de pensamiento muy concretos que se repiten una y otra vez.',
        bullets:['⏳ Largo plazo: las decisiones se evalúan en décadas, no en meses','🎲 Riesgo calculado: no evitan el riesgo, lo miden y lo toman con información','📚 Aprendizaje continuo: leen una media de 26 libros de no ficción al año','🚫 Deuda al consumo = nunca: no se endeudan para bienes que se deprecian','👥 Entorno elevador: rodean sus vidas de personas con mejores hábitos financieros que ellos'],
        fact:'El estudio original de Stanley encontró que el 80% de los millonarios americanos eran primera generación — su riqueza no fue heredada. El atributo más común: la disciplina de vivir por debajo de sus posibilidades durante décadas.'},
      {type:'quiz', tag:'🧠 Quiz', title:'Según el estudio de Thomas Stanley sobre millonarios, ¿cuántos eran herencia familiar?',
        opts:['Más del 70%','Alrededor del 50%','Menos del 20%','Aproximadamente el 40%'], correct:2,
        exp:'El 80% de los millonarios americanos estudiados por Stanley eran primera generación: construyeron su riqueza ellos mismos. La narrativa de que la riqueza se hereda principalmente es falsa para la mayoría de patrimonios significativos.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 72 — Mercado Inmobiliario: Ciclos y Oportunidades
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:72, icon:'🏙️', title:'El Ciclo Inmobiliario: Compra Cuando Nadie Quiere',
    desc:'El inmobiliario tiene ciclos predecibles. Quien los entiende, gana.',
    xp:30, tag:'INMOBILIARIO', tagC:'orange', users:'18.900',
    steps:[
      {type:'content', tag:'🏙️ Módulo 72', title:'Las 4 Fases del Ciclo Inmobiliario',
        intro:'El mercado inmobiliario no sube en línea recta. Tiene ciclos de 15-18 años (ciclo de Harrison) que se repiten con sorprendente regularidad. Entender la fase del ciclo en que estás es la ventaja más grande para invertir en inmobiliario.',
        bullets:['1️⃣ Recuperación: precios bajos, poca actividad, nadie quiere comprar — el mejor momento para entrar','2️⃣ Expansión: precios subiendo, crédito disponible, optimismo creciente','3️⃣ Hiperaprovisionamiento: construcción masiva, euforia, todos hablan de inmobiliario','4️⃣ Recesión: ajuste de precios, restricción del crédito, los optimistas venden con pérdidas','🇪🇸 España 2024: en fase 2 avanzada en grandes ciudades según indicadores de precios/rentas'],
        fact:'España vivió el ejemplo perfecto: burbuja 1997-2007 (+150% precios), crash 2008-2013 (−40% en media), recuperación 2014-2019, nuevo ciclo alcista 2020-. Cada ciclo tarda ~15 años. El siguiente mínimo: ~2033.'},
      {type:'quiz', tag:'🏙️ Quiz', title:'¿En qué fase del ciclo inmobiliario es mejor momento para comprar?',
        opts:['Expansión — cuando los precios llevan años subiendo','Hiperaprovisionamiento — cuando hay mucha oferta nueva','Recuperación — cuando nadie quiere comprar y los precios están bajos','Recesión — en el punto de máxima caída'], correct:2,
        exp:'La fase de Recuperación, al inicio del ciclo, ofrece los mejores precios y menos competencia. El problema es que nadie quiere comprar en esa fase porque el sentimiento es negativo. "Compra cuando haya sangre en las calles" — Barón de Rothschild.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 73 — Seguros de Vida: Protección Real vs Marketing
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:73, icon:'🛡️', title:'Seguros de Vida: Qué Necesitas Realmente',
    desc:'El sector seguros vive de que no entiendas lo que contratas.',
    xp:20, tag:'PROTECCIÓN', tagC:'green', users:'15.400',
    steps:[
      {type:'content', tag:'🛡️ Módulo 73', title:'El Único Seguro de Vida que Vale la Pena',
        intro:'Existen dos tipos básicos de seguro de vida: temporal (pagas una prima, si mueres en ese período cobran tus herederos, si no — no recuperas nada) y mixto/ahorro (pagas más, combina seguro con ahorro). El sector financiero gana más con el segundo. Matemáticamente casi siempre conviene el primero.',
        bullets:['⏱️ Seguro temporal puro: cobertura específica (10-30 años), prima baja, sin trampa','💰 Seguro mixto/Unit-Linked: comisiones altas, rentabilidad baja, para quien no quiere decidir','📊 Matemática: invierte la diferencia en un ETF y bate al seguro mixto en casi todos los escenarios','👶 ¿Cuándo sí tiene sentido? Si tienes dependientes y no tienes colchón de inversión','🎯 Capital asegurado recomendado: 5-10 veces tus ingresos anuales'],
        fact:'Un seguro de vida temporal para un hombre de 35 años sin enfermedades puede costar €15-25/mes por €200.000 de cobertura. El mismo capital en un seguro mixto puede costar €200-300/mes con rentabilidades inferiores al mercado.'},
      {type:'quiz', tag:'🛡️ Quiz', title:'¿Qué tipo de seguro de vida es financieramente más eficiente para la mayoría?',
        opts:['Seguro mixto con componente de ahorro','Unit-Linked vinculado a fondos de inversión','Seguro temporal puro + invertir la diferencia en ETFs','Seguro de vida entera (whole life)'], correct:2,
        exp:'La combinación seguro temporal puro + inversión separada en ETFs casi siempre supera al seguro mixto. El seguro mixto cobra comisiones por "gestionarlo todo junto" que erosionan la rentabilidad. Separa la protección del ahorro.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 74 — El Modelo Mental de la Escasez vs Abundancia
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:74, icon:'🌱', title:'Mentalidad de Escasez vs Abundancia',
    desc:'El mayor activo financiero que puedes desarrollar no es medible en euros.',
    xp:20, tag:'PSICOLOGÍA', tagC:'purple', users:'27.800',
    steps:[
      {type:'content', tag:'🌱 Módulo 74', title:'Cómo tu Mentalidad Determina tu Techo Financiero',
        intro:'La mentalidad de escasez ve el dinero como algo limitado que si alguien gana es porque otro pierde. La mentalidad de abundancia ve el valor como algo que se puede crear y expandir. Estas dos visiones llevan a decisiones completamente distintas y resultados opuestos a largo plazo.',
        bullets:['🚫 Escasez: "no puedo permitirme eso" vs Abundancia: "¿cómo puedo conseguirlo?"','🔒 Escasez: el dinero es para gastarlo mientras lo tienes vs Abundancia: el dinero trabaja para mí','😤 Escasez: envidia cuando otros tienen éxito vs Abundancia: el éxito de otros me inspira','📉 Escasez: evita el riesgo porque "no se puede perder lo poco que hay" vs Abundancia: gestiona el riesgo para crecer','🤝 Escasez: información = poder, no compartir vs Abundancia: compartir conocimiento genera más oportunidades'],
        fact:'Carol Dweck (Stanford) demostró que la "growth mindset" (mentalidad de crecimiento) predice mejores resultados financieros y profesionales con independencia del punto de partida. El cerebro es moldeable — los hábitos de pensamiento se pueden cambiar.'},
      {type:'quiz', tag:'🌱 Quiz', title:'¿Cuál es la diferencia clave entre mentalidad de escasez y abundancia?',
        opts:['La cantidad de dinero que tienen','Si el dinero se hereda o se gana','Cómo ven las oportunidades y el éxito de otros','El nivel educativo alcanzado'], correct:2,
        exp:'La diferencia no es cuánto dinero tienen sino cómo piensan. La mentalidad de abundancia ve las oportunidades donde la escasez ve obstáculos, y celebra el éxito ajeno como evidencia de que el éxito es posible.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 75 — Automatización Financiera: El Sistema que Trabaja Solo
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:75, icon:'⚙️', title:'Automatiza tus Finanzas y Libera tu Mente',
    desc:'El mejor sistema financiero es el que no requiere tu fuerza de voluntad.',
    xp:25, tag:'PRÁCTICA', tagC:'green', users:'31.200',
    steps:[
      {type:'content', tag:'⚙️ Módulo 75', title:'El Sistema de 3 Cuentas que Simplifica Todo',
        intro:'La automatización financiera elimina la necesidad de tomar decisiones repetidas. Cada decisión que eliminas mediante un sistema automático es una decisión que no puedes tomar mal. El objetivo: que tu dinero vaya al lugar correcto sin que tengas que pensar en ello.',
        bullets:['🏦 Cuenta 1 — Nómina: recibe el sueldo, nunca la toques','🎯 Cuenta 2 — Gastos fijos: alquiler, suministros, suscripciones — transferencia automática el día de cobro','📈 Cuenta 3 — Inversión/Ahorro: transferencia automática el día de cobro — "págate a ti primero"','🛒 Tarjeta de gastos variables: lo que queda en Cuenta 1 tras las transferencias — tu presupuesto real','🔄 El día de cobro, el dinero fluye solo: primero inversión, luego gastos fijos, luego el resto'],
        fact:'David Bach acuñó el concepto de "Automatic Millionaire": automatizar el ahorro antes de que el dinero llegue a tu cuenta corriente tiene más impacto que cualquier estrategia de inversión sofisticada.'},
      {type:'quiz', tag:'⚙️ Quiz', title:'¿Por qué "págate a ti primero" antes que pagar gastos es más efectivo?',
        opts:['Porque los gastos pueden esperar','Porque elimina la tentación de gastar antes de ahorrar','Porque genera más interés bancario','Porque es un requisito legal en España'], correct:1,
        exp:'"Págate a ti primero" significa transferir el ahorro/inversión el mismo día que cobras, antes de tocar el dinero. Si el ahorro es lo último que haces con lo que queda, siempre habrá algo más urgente. Si es lo primero, siempre ocurre.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 76 — Los Errores Financieros de los 20, 30 y 40
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:76, icon:'⏳', title:'Los Errores que Cuestan Una Fortuna según tu Edad',
    desc:'Cada década tiene sus trampas financieras. Conocerlas es evitarlas.',
    xp:25, tag:'FUNDAMENTAL', tagC:'green', users:'38.100',
    steps:[
      {type:'content', tag:'⏳ Módulo 76', title:'Los 20s: La Décadas Más Cara si se Desperdicia',
        intro:'Los 20 años son la ventana de tiempo más valiosa de tu vida financiera. El interés compuesto premia enormemente empezar aquí. Los errores de esta época cuestan 3-5 veces más que el mismo error a los 40.',
        bullets:['💸 Error 1: No empezar a invertir — €100/mes desde los 22 = €600.000 a los 65 (7%)','🎓 Error 2: Estudios sin ROI — máster de €20.000 en algo que gana €18.000/año','🏠 Error 3: Comprar piso demasiado pronto — ata capital e impide movilidad laboral','💳 Error 4: Deuda de consumo — coche a crédito, tarjeta revolving — destruye el fondo de emergencia','🎯 Lo correcto: fondo de emergencia primero, luego invertir aunque sea €50/mes, cultivar habilidades de alto valor'],
        fact:'Los €100/mes invertidos desde los 22 al 7% generan €600.000 a los 65. Los mismos €100/mes empezando a los 32: €300.000. El coste de esperar 10 años: €300.000. Son 10 años de espera que cuestan literalmente una fortuna.'},
      {type:'content', tag:'⏳ Módulo 76', title:'Los 30s y 40s: Nuevas Trampas, Nuevas Oportunidades',
        intro:'Los 30 traen más ingresos pero también más tentaciones de gasto. Los 40 son la última oportunidad real de cambiar la trayectoria financiera antes de la recta final hacia la jubilación.',
        bullets:['🏠 Trampa 30s: hipoteca demasiado grande que consume todo el margen de ahorro','👶 Trampa 30s: los hijos como excusa para no invertir — los hijos no impiden invertir €200/mes','🚗 Trampa 30s: lifestyle creep — sueldo ×2 pero también gastos ×2','📈 Oportunidad 40s: últimos 25 años de interés compuesto — sigue siendo tiempo suficiente','🎯 Lo correcto en 40s: maximizar plan de pensiones, cancelar deuda mala, revisar estrategia inmobiliaria'],
        fact:'El estudio CNMV 2023 encontró que el 62% de españoles de 40-50 años no tiene ningún ahorro para la jubilación fuera de la Seguridad Social. El sistema de pensiones no puede garantizar el nivel de vida actual de ese grupo.'},
      {type:'quiz', tag:'⏳ Quiz', title:'¿Cuánto más genera invertir €100/mes desde los 22 vs desde los 32?',
        opts:['Un 10% más','El doble (×2)','Un 50% más','Depende de la rentabilidad exacta'], correct:1,
        exp:'Con un 7% anual: desde los 22 = ~€600.000 a los 65. Desde los 32 = ~€300.000. Exactamente el doble. Esta diferencia se llama "la octava maravilla del mundo" — el interés compuesto actuando durante 10 años adicionales.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════
     MÓDULO 106 — Factor Investing
  ═══════════════════════════════════════════════════════ */
  {
    id:106, icon:'🔬',
    title:'Factor Investing: Los 5 Factores que Baten al Mercado',
    desc:'Los factores que la academia ha probado que mejoran el retorno a largo plazo',
    xp:28, tag:'AVANZADO', tagC:'blue', users:'18.200',
    steps:[
      { type:'content', tag:'🔬 Módulo 106',
        title:'Más Allá del Índice: Los Factores de Fama-French',
        intro:'Eugene Fama y Kenneth French demostraron en 1992 que ciertas características (factores) están estadísticamente ligadas a mayor rentabilidad. Hoy puedes acceder a ellos con un ETF.',
        bullets:[
          '📉 Value: empresas baratas (bajo P/B) superan al mercado a largo plazo',
          '📐 Size: las pequeñas empresas históricamente superan a las grandes',
          '💰 Profitability: alta rentabilidad operativa → mejor retorno',
          '📈 Momentum: lo que sube 12 meses tiende a seguir subiendo 3-6 meses',
          '⚠️ Requieren convicción y horizonte largo — pasan años sin funcionar',
          '🛒 ETFs: IWVL (value), IWMO (momentum), IWQU (quality) — TER ~0,30%',
        ],
        fact:'El Nobel 2013 fue compartido por Fama (mercados eficientes) y Shiller (mercados irracionales). Los factores explotan la tensión entre ambas teorías.',
      },
      { type:'quiz', tag:'🔬 Quiz',
        title:'¿Cuál de estos factores se explica principalmente por sesgos psicológicos?',
        opts:[
          {t:'Value — las empresas baratas asumen más riesgo real',            ok:false},
          {t:'Size — las pequeñas caps tienen más riesgo de quiebra',         ok:false},
          {t:'Momentum — los inversores reaccionan tarde a las noticias',      ok:true},
          {t:'Profitability — las empresas rentables pagan más impuestos',     ok:false},
        ],
        ok:'¡Correcto! El Momentum se explica por sesgos conductuales: los inversores infrareaccionan inicialmente a las noticias y después sobrereaaccionan, creando tendencias de 3-12 meses.',
        bad:'La respuesta es Momentum. Los inversores reaccionan tarde a las noticias creando tendencias explotables. Value y Size sí tienen componentes de riesgo reales.',
      },
      { type:'final', xp:28,
        msg:'¡Factor Investor desbloqueado! Conoces las herramientas que usan los mejores gestores cuantitativos.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     MÓDULO 107 — Finanzas en Pareja
  ═══════════════════════════════════════════════════════ */
  {
    id:107, icon:'💑',
    title:'Finanzas en Pareja: El Sistema que Evita Conflictos',
    desc:'El modelo de cuentas y conversaciones que previene el 22% de las rupturas por dinero',
    xp:22, tag:'PRÁCTICA', tagC:'green', users:'26.400',
    steps:[
      { type:'content', tag:'💑 Módulo 107',
        title:'El Dinero: Tercera Causa de Divorcio',
        intro:'El 22% de las rupturas tienen causa económica. No es incompatibilidad — es falta de sistema.',
        bullets:[
          '🏦 Todo común: máxima eficiencia, menor autonomía — ideal con ingresos similares',
          '💼 Todo separado: total autonomía pero ineficiencia fiscal y conflictos frecuentes',
          '✅ Híbrido (recomendado): cuenta conjunta para gastos fijos + cuentas individuales',
          '📊 Regla proporcional: cada uno aporta según su sueldo, no al 50/50',
          '📅 Reunión financiera mensual de 20 min: presupuesto, objetivos, imprevistos',
        ],
        fact:'Parejas que hablan de dinero ≥1 vez/mes tienen 20% menos conflictos y 18% más patrimonio a los 10 años (Cambridge, 2015).',
      },
      { type:'quiz', tag:'💑 Quiz',
        title:'Sueldos €2.000 y €3.000/mes. Gastos comunes €1.800. ¿Cuánto aporta cada uno con modelo proporcional?',
        opts:[
          {t:'€900 cada uno — el 50/50 es lo más justo',                    ok:false},
          {t:'€720 el de €2.000 y €1.080 el de €3.000',                    ok:true},
          {t:'Todo el de mayor sueldo',                                     ok:false},
          {t:'Depende de quién gastó más ese mes',                          ok:false},
        ],
        ok:'¡Exacto! 2.000/5.000=40%→€720. 3.000/5.000=60%→€1.080. Cada uno aporta el mismo porcentaje de su sueldo — equitativo cuando los ingresos difieren.',
        bad:'La respuesta es proporcional: €720 y €1.080. El 50/50 perjudica al de menor sueldo. La proporción mantiene la equidad relativa.',
      },
      { type:'final', xp:22,
        msg:'¡Sistema financiero en pareja dominado! El dinero como herramienta compartida, no como fuente de conflicto.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     MÓDULO 77 — Seguros Esenciales
  ═══════════════════════════════════════════════════════ */
  {
    id:77, icon:'🛡️',
    title:'Seguros Esenciales: Cuándo Son Imprescindibles',
    desc:'La protección que necesitas, sin pagar de más por lo que no necesitas',
    xp:20, tag:'PROTECCIÓN', tagC:'purple', users:'22.100',
    steps:[
      { type:'content', tag:'🛡️ Módulo 77',
        title:'Asegura lo que no Puedes Permitirte Perder',
        intro:'La mayoría está sobreasegurada en lo trivial e infraasegurada en lo importante.',
        bullets:[
          '✅ Seguro de vida: si tienes dependientes o hipoteca grande',
          '❌ Seguro de vida: innecesario sin dependientes ni deudas grandes',
          '💊 Salud privado: útil para reducir tiempos de espera',
          '⚠️ Suelen no valer: teléfono, garantía extendida, cancelación de viaje',
          '📐 Cobertura vida = mínimo 10 años de sueldo anual',
          '💶 Término 20 años a los 30 años: €15-30/mes para €300k',
        ],
        fact:'Regla de oro: asegura solo lo que no podrías pagar con tu propio capital si ocurre el siniestro.',
      },
      { type:'quiz', tag:'🛡️ Quiz',
        title:'Ana: 35 años, soltera, sin hijos, sin hipoteca, €80.000 de patrimonio. ¿Necesita seguro de vida?',
        opts:[
          {t:'Sí, siempre es bueno tenerlo por si acaso',                        ok:false},
          {t:'No — sin dependientes ni deudas, no aporta valor real',            ok:true},
          {t:'Sí, para cubrir sus gastos de sepelio',                            ok:false},
          {t:'Depende de su estado de salud',                                    ok:false},
        ],
        ok:'¡Correcto! El seguro de vida protege a quienes dependen económicamente de ti, no a ti mismo. Sin dependientes ni deudas que cubrir, es gasto innecesario.',
        bad:'La respuesta es NO. El seguro de vida protege a los dependientes económicos. Sin hijos, sin pareja dependiente y sin hipoteca, Ana no lo necesita.',
      },
      { type:'final', xp:20,
        msg:'¡Experto en protección financiera! Sabes cuándo un seguro protege de verdad y cuándo es solo un gasto.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     MÓDULO 78 — Economía del Comportamiento
  ═══════════════════════════════════════════════════════ */
  {
    id:78, icon:'🧩',
    title:'Economía del Comportamiento',
    desc:'Los 7 sesgos que te cuestan dinero y cómo neutralizarlos con sistemas',
    xp:25, tag:'PSICOLOGÍA', tagC:'purple', users:'29.700',
    steps:[
      { type:'content', tag:'🧩 Módulo 78',
        title:'Tu Cerebro No Está Diseñado Para Invertir',
        intro:'Thaler (Nobel 2017): somos predeciblemente irracionales con el dinero. No son errores aleatorios — son sesgos sistemáticos que los bancos explotan.',
        bullets:[
          '💔 Aversión a pérdidas: perder €100 duele 2,5× más que ganar €100',
          '⏰ Descuento hiperbólico: €100 hoy > €150 en un año (aunque el 50% sea extraordinario)',
          '⚓ Efecto ancla: el primer precio condiciona toda valoración posterior',
          '🔍 Sesgo de confirmación: buscamos información que confirma lo que ya creemos',
          '🐑 Efecto manada: compramos en máximos y vendemos en mínimos',
          '🧠 Contabilidad mental: el bonus se gasta más fácil que el sueldo',
          '🔧 Antídotos: DCA automático, no mirar la cartera >1 vez/mes, rebalanceo anual',
        ],
        fact:'El inversor medio obtiene un 3,9% anual mientras el mercado da un 10,3% (DALBAR). Los sesgos destruyen 6,4 pp de rentabilidad anual.',
      },
      { type:'quiz', tag:'🧩 Quiz',
        title:'Pedro tiene 50 acciones a €10 (ahora €15, +50%) y 50 a €20 (ahora €15, -25%). Necesita vender 50. ¿Cuáles elige la mayoría?',
        opts:[
          {t:'Las de €10 — materializa la ganancia',                       ok:true},
          {t:'Las de €20 — vende en pérdida para compensar fiscalmente',   ok:false},
          {t:'Las elige al azar — no hay sesgo aquí',                      ok:false},
          {t:'Las de €20 — promedia el precio a la baja',                  ok:false},
        ],
        ok:'¡Correcto! La mayoría vende las ganadoras (efecto disposición): el cerebro quiere "asegurar" ganancias y evita materializar pérdidas. Es lo contrario de lo racional.',
        bad:'La mayoría elige las de €10. Efecto disposición: los inversores venden ganadores pronto y mantienen perdedores esperando recuperación. Lo racional: evaluar perspectivas futuras, no el pasado.',
      },
      { type:'final', xp:25,
        msg:'¡Psicología financiera dominada! Conocer los sesgos te permite crear sistemas automáticos que los neutralicen.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     MÓDULO 79 — Inversión en Dividendos
  ═══════════════════════════════════════════════════════ */
  {
    id:79, icon:'🌱',
    title:'Inversión en Dividendos: Renta Pasiva que Crece Sola',
    desc:'Construye una máquina de ingresos que trabaja para ti sin que hagas nada',
    xp:24, tag:'DIVIDENDOS', tagC:'blue', users:'24.300',
    steps:[
      { type:'content', tag:'🌱 Módulo 79',
        title:'El Ingreso Pasivo que se Auto-acelera',
        intro:'Objetivo: construir una cartera que genere suficiente ingreso mensual para cubrir gastos sin vender nunca.',
        bullets:[
          '🏆 Dividend Kings: 50+ años consecutivos subiendo dividendo (P&G 67 años)',
          '📊 DRIP: reinvertir dividendo → más acciones → más dividendo (bola de nieve)',
          '⚠️ Yield Trap: dividendo >10% suele ser señal de alarma, no oportunidad',
          '✅ Mejor: empresa con 2-3% que lo sube un 7-10% anual durante décadas',
          '🌍 ETFs: VHYL, TDIV — diversificación instantánea en cientos de pagadoras',
          '🇪🇸 En España: tributan como rendimiento del capital mobiliario (19-27%)',
        ],
        fact:'€10.000 en Dividend Aristocrats en 2000 con DRIP = €87.000 en 2023. Sin reinversión = €52.000. El DRIP crea €35.000 extra.',
      },
      { type:'quiz', tag:'🌱 Quiz',
        title:'Empresa a €50 con dividendo €2/año (yield 4%). El precio cae a €40. ¿Qué ocurre con el yield?',
        opts:[
          {t:'Sube al 5% (€2/€40) — matemáticamente más atractivo',      ok:true},
          {t:'Baja porque la empresa vale menos',                         ok:false},
          {t:'No cambia — el dividendo es un importe fijo',               ok:false},
          {t:'La empresa reducirá el dividendo proporcional a la caída',  ok:false},
        ],
        ok:'¡Correcto! Yield = €2/€40 = 5%. Pero atención: yield alto por caída puede ser "yield trap" — los mismos problemas que causaron la caída pueden amenazar el pago.',
        bad:'El yield SUBE a 5% (€2/€40). Yield = Dividendo/Precio. Pero cuidado con la "yield trap": el dividendo puede no ser sostenible si la empresa tiene problemas reales.',
      },
      { type:'final', xp:24,
        msg:'¡Inversor de dividendos! Entiendes cómo construir una máquina de ingresos pasivos que crece sola año tras año.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     MÓDULO 80 — Cómo Leer un Balance
  ═══════════════════════════════════════════════════════ */
  {
    id:80, icon:'📋',
    title:'Cómo Leer un Balance en 5 Minutos',
    desc:'Detecta empresas sanas vs zombies financieros antes de invertir',
    xp:28, tag:'AVANZADO', tagC:'blue', users:'15.800',
    steps:[
      { type:'content', tag:'📋 Módulo 80',
        title:'El Lenguaje Secreto de los Balances',
        intro:'Un balance es la foto de salud financiera de una empresa. Saber leerlo te permite detectar problemas antes de que el mercado los descuente.',
        bullets:[
          '⚖️ Ecuación: Activos = Pasivos + Patrimonio Neto (siempre cuadra)',
          '💵 Activo Corriente: caja, inventario, cuentas a cobrar (<12 meses)',
          '🏭 Activo Fijo: maquinaria, inmuebles, intangibles (largo plazo)',
          '🔴 Alarma: caja negativa + deuda creciente = vive de financiación',
          '🔴 Alarma: goodwill >30% activos = adquisiciones a sobreprecio',
          '🔴 Alarma: inventario crece más que ventas = no se vende bien',
          '✅ Quick Ratio = (Activo Corriente − Inventario) / Pasivo Corriente > 1',
        ],
        fact:'Enron parecía fantástica en la cuenta de resultados. El balance escondía la bomba: activos inflados y pasivos fuera de balance.',
      },
      { type:'quiz', tag:'📋 Quiz',
        title:'Activo Corriente €500k, Inventario €300k, Pasivo Corriente €150k. ¿Cuál es el Quick Ratio?',
        opts:[
          {t:'QR = 3,3 — excelente liquidez total',                               ok:false},
          {t:'QR = 1,33 — puede pagar deudas sin liquidar inventario',            ok:true},
          {t:'QR = 0,5 — liquidez insuficiente',                                  ok:false},
          {t:'QR = 2,0 — justo en el límite de seguridad',                        ok:false},
        ],
        ok:'¡Correcto! QR = (500k − 300k) / 150k = 1,33. Un QR > 1 significa que puede cubrir deudas a corto sin liquidar el inventario — señal de buena salud financiera.',
        bad:'QR = 1,33. Fórmula: (Activo Corriente − Inventario) / Pasivo Corriente = (500k − 300k) / 150k = 1,33. QR > 1: puede pagar sus deudas inmediatas sin vender el stock.',
      },
      { type:'final', xp:28,
        msg:'¡Analista financiero! Puedes leer un balance y detectar la salud real de una empresa antes que el mercado.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     MÓDULO 81 — La Trampa del Sueldo Alto
  ═══════════════════════════════════════════════════════ */
  {
    id:81, icon:'💼',
    title:'La Trampa del Sueldo Alto',
    desc:'Por qué ganar más no siempre significa construir más riqueza',
    xp:22, tag:'MENTALIDAD', tagC:'purple', users:'31.500',
    steps:[
      { type:'content', tag:'💼 Módulo 81',
        title:'Ganar Mucho No Significa Ser Rico',
        intro:'HENRY (High Earner Not Rich Yet): personas con €80k-200k/año y poco patrimonio. La mayoría de millonarios son personas de ingresos medios con disciplina extraordinaria.',
        bullets:[
          '📈 Lifestyle creep: el sueldo sube pero los gastos suben más rápido',
          '👥 Efecto referencia social: se comparan con colegas, no con su yo anterior',
          '🚗 Consumo de estatus: señales externas que previenen la riqueza real',
          '💸 "Cuando gane más, ahorraré" — frase que destruye más patrimonio que cualquier crisis',
          '📊 La tasa de ahorro importa 4× más que el nivel de ingresos absoluto',
          '✅ Regla del Bonus: 50% de cada aumento directo a inversión automática',
        ],
        fact:'El 37% de estadounidenses con ingresos >€75.000/año viven al día (CNBC, 2022). El problema no es el sueldo — es la gestión.',
      },
      { type:'quiz', tag:'💼 Quiz',
        title:'Carlos: €90.000/año, ahorra el 5%. María: €40.000/año, ahorra el 25%. ¿Quién acumula más en 30 años al 7%?',
        opts:[
          {t:'Carlos — gana €50.000/año más',                                  ok:false},
          {t:'María — ahorra €10.000/año vs €4.500/año de Carlos',             ok:true},
          {t:'Carlos — con más sueldo accede a mejores activos',               ok:false},
          {t:'Depende de los gastos fijos de cada uno',                        ok:false},
        ],
        ok:'¡Correcto! María: 25%×€40.000=€10.000/año. Carlos: 5%×€90.000=€4.500/año. María ahorra €5.500 más anuales con €50.000 menos de sueldo. En 30 años: María ~€1.000.000, Carlos ~€450.000.',
        bad:'La respuesta es María. €10.000/año vs €4.500/año pese a ganar €50.000 menos. La tasa de ahorro (%) es el factor más determinante de la acumulación, no el nivel de ingresos.',
      },
      { type:'final', xp:22,
        msg:'¡Mentalidad correcta! La riqueza = (ingresos − gastos) × tiempo × interés compuesto.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     MÓDULO 82 — Educación Financiera para Tus Hijos
  ═══════════════════════════════════════════════════════ */
  {
    id:82, icon:'👶',
    title:'Educación Financiera para Tus Hijos',
    desc:'Las conversaciones y hábitos que pueden cambiar su vida financiera para siempre',
    xp:20, tag:'PRÁCTICA', tagC:'green', users:'19.400',
    steps:[
      { type:'content', tag:'👶 Módulo 82',
        title:'El Regalo Más Valioso que Puedes Darles',
        intro:'Cambridge (2013): los hábitos financieros se forman a los 7 años. Lo que aprenden en casa determina su relación con el dinero durante toda la vida.',
        bullets:[
          '👶 3-5 años: el dinero viene de trabajar. Alcancía con 3 partes: gastar, ahorrar, dar',
          '🎒 6-10 años: paga por tareas del hogar + objetivo de ahorro visible y concreto',
          '📱 11-15 años: presupuesto mensual para ropa y ocio con consecuencias reales',
          '💳 16+: primer trabajo, declaración supervisada, tarjeta débito con límite',
          '🧠 Marshmallow test: diferir la gratificación predice el éxito financiero futuro',
          '📈 €100/mes desde el nacimiento = ~€580.000 a los 65 años al 7%',
        ],
        fact:'El 67% de jóvenes de 18-25 años en España nunca ha hablado de dinero con sus padres (CNMV). Romper ese tabú es el mayor regalo financiero.',
      },
      { type:'quiz', tag:'👶 Quiz',
        title:'¿Cuál es la forma más efectiva de enseñar el valor del dinero a un niño de 8 años?',
        opts:[
          {t:'Paga fija incondicional — aprende a gestionar libremente',              ok:false},
          {t:'Paga semanal por tareas + objetivo de ahorro visible y concreto',      ok:true},
          {t:'No darle dinero hasta los 16',                                         ok:false},
          {t:'Abrir una cuenta de inversión sin explicarle nada aún',               ok:false},
        ],
        ok:'¡Correcto! Paga vinculada a contribución + objetivo visible: enseña el vínculo esfuerzo-recompensa y entrena la capacidad de diferir la gratificación.',
        bad:'La paga por tareas + objetivo concreto es lo más efectivo. La paga incondicional no enseña que el dinero viene del trabajo. El objetivo visible entrena la habilidad que más predice el éxito financiero futuro.',
      },
      { type:'final', xp:20,
        msg:'¡Formador financiero! El mayor regalo no es el dinero — es la educación para gestionarlo bien durante toda una vida.',
      },
    ],
  },

  /* ═══════════════════════════════════════════════════════
     MÓDULO 83 — Fiscalidad Avanzada del Inversor
  ═══════════════════════════════════════════════════════ */
  {
    id:83, icon:'📊',
    title:'Fiscalidad Avanzada del Inversor Español',
    desc:'Las estrategias legales que los asesores guardan para sus mejores clientes',
    xp:30, tag:'FISCALIDAD', tagC:'orange', users:'17.600',
    steps:[
      { type:'content', tag:'📊 Módulo 83',
        title:'El Inversor que Paga Menos (Legalmente)',
        intro:'Dos inversores con los mismos activos pueden pagar muy diferente en impuestos. La diferencia no es evasión — es planificación.',
        bullets:[
          '⏳ ETFs de acumulación: solo tributan al vender — compuesto actúa sobre el 100%',
          '🔄 Traspaso sin tributar: entre fondos de inversión (no ETFs) sin peaje fiscal',
          '📉 Loss harvesting: vende pérdidas antes de fin de año para compensar ganancias',
          '📋 Compensación: pérdidas compensan ganancias de los 4 años siguientes',
          '💡 Plan de pensiones: deducción inmediata hasta €1.500/año',
          '⚰️ Stepped-up basis: plusvalía del causante desaparece en la herencia',
        ],
        fact:'Mantener el mismo ETF 30 años vs rebalancear vendiendo cada año: el primero acumula hasta un 18% más de patrimonio solo por diferimiento fiscal.',
      },
      { type:'quiz', tag:'📊 Quiz',
        title:'€30.000 de plusvalías en ETF A y €20.000 de minusvalías en ETF B, ambos vendidos este año. ¿Cuánto tributa la base imponible?',
        opts:[
          {t:'€30.000 — plusvalías y minusvalías no se compensan',                   ok:false},
          {t:'€10.000 — ganancias y pérdidas del mismo año se compensan',            ok:true},
          {t:'€50.000 — se suman ambas operaciones brutas',                          ok:false},
          {t:'€0 — el saldo neto positivo se difiere al año siguiente',              ok:false},
        ],
        ok:'¡Correcto! Base = €30.000 − €20.000 = €10.000. Impuesto: 19%×€6.000 (€1.140) + 21%×€4.000 (€840) = €1.980. Sin compensación habrías pagado €5.040.',
        bad:'La respuesta correcta es €10.000. En España las ganancias y pérdidas del mismo año se compensan: €30.000 − €20.000 = €10.000. Las pérdidas sobrantes compensan ganancias de los 4 años siguientes.',
      },
      { type:'final', xp:30,
        msg:'¡Optimización fiscal dominada! El conocimiento tributario es uno de los activos más rentables de cualquier inversor.',
      },
    ],
  },

  /* ══════════════════════════════════════════════════════
     TRACK "DE 0 A PRIMER PISO" — Módulos 84-88 (Vivienda)
  ══════════════════════════════════════════════════════ */

  /* ─ M84 ─ ¿Cuándo tiene sentido comprar? ─ */
  {
    id:84, icon:'🏠', title:'¿Cuándo Tiene Sentido Comprar una Vivienda?',
    desc:'Price-to-Rent, horizonte temporal y estabilidad: la fórmula para no equivocarte',
    xp:22, tag:'VIVIENDA', tagC:'green', users:'28.400',
    steps:[
      {type:'content', tag:'🏠 Módulo 84', title:'El Error de los 300.000€',
        intro:'Comprar una vivienda es la mayor decisión financiera de la vida de la mayoría. Y también la más emocional. La regla Price-to-Rent te da un criterio objetivo.',
        bullets:[
          '📐 Price-to-Rent ratio = Precio piso / Alquiler anual. Madrid ~30-35, umbral neutral = 20',
          '📌 P/R <15 → comprar suele tener sentido. P/R >20 → alquilar es más eficiente económicamente',
          '⏳ Horizonte mínimo recomendado para comprar: 7-10 años (amortizar gastos de compraventa)',
          '📍 Estabilidad laboral y geográfica: si puede venir un cambio de ciudad en 3 años, alquila',
          '💰 Coste real de compra: precio + gastos (9-12%) + mantenimiento anual (1-2% del valor)',
          '🧮 Coste de oportunidad: la entrada invertida en ETF al 7% vs revalorización inmobiliaria histórica ~3% real',
        ],
        fact:'En Madrid y Barcelona el P/R supera 30. Para que comprar sea rentable vs alquilar necesitas un horizonte de al menos 10-12 años e IPC inmobiliario > IPC general.'},
      {type:'quiz', tag:'🏠 Quiz', title:'Piso a €250.000, alquiler equivalente €900/mes (€10.800/año). ¿Cuál es el P/R y qué indica?',
        opts:[
          {t:'P/R = 23,1 — zona neutral-cara, alquiler probablemente más eficiente',   ok:true},
          {t:'P/R = 3,6 — muy barato, comprar es claramente la mejor opción',           ok:false},
          {t:'P/R = 23,1 — siempre compensa comprar por encima de 20',                  ok:false},
          {t:'P/R = 10,8 — precio razonable, neutro',                                   ok:false},
        ],
        ok:'¡Correcto! P/R = €250.000/€10.800 = 23,1. Por encima de 20 el alquiler suele ser más eficiente económicamente, aunque entran otros factores (estabilidad, horizonte, tipos de interés).',
        bad:'P/R = €250.000/€10.800 = 23,1. Un ratio por encima de 20 indica que el alquiler es probablemente más eficiente financieramente. Comprar tiene sentido personal, pero el precio es elevado relativamente.'},
      {type:'final', xp:22, msg:'¡Decisor inmobiliario racional! Ya no te dejará llevar solo por emociones: tienes el P/R, el horizonte temporal y el coste de oportunidad.'},
    ],
  },

  /* ─ M85 ─ Los gastos ocultos de comprar una vivienda ─ */
  {
    id:85, icon:'💸', title:'Los Gastos Ocultos de Comprar una Vivienda',
    desc:'ITP, notaría, registro, hipoteca y mantenimiento: el 12% que nadie te dice',
    xp:20, tag:'VIVIENDA', tagC:'orange', users:'24.700',
    steps:[
      {type:'content', tag:'💸 Módulo 85', title:'El Piso de €200.000 que Cuesta €224.000',
        intro:'El precio de compraventa es solo el punto de partida. Los gastos añaden un 9-12% adicional que muchos compradores no tienen calculado. En vivienda de segunda mano el componente principal es el ITP.',
        bullets:[
          '🧾 ITP (segunda mano): 6-10% según comunidad autónoma. Andalucía 7%, Madrid 6%, Cataluña 10%',
          '📜 Notaría: €600-1.200 según el precio del inmueble (arancel regulado)',
          '🏛️ Registro de la Propiedad: €300-600 (arancel oficial)',
          '🏦 Gastos hipotecarios (post-2019): tasación (~€350) y gestoría (~€300) — la ley los carga al banco',
          '🔧 Mantenimiento anual: IBI (~€400-900), comunidad (~€80-200/mes), reparaciones (1% del valor)',
          '📊 Resumen para piso de €200.000: ITP €12.000 + notaría €900 + registro €450 + tasación €350 = ~€13.700 extra',
        ],
        fact:'Un piso nuevo (obra nueva) paga IVA del 10% + AJD (~1,5%) en lugar de ITP, lo que resulta similar o algo mayor. La diferencia fiscal entre CA puede ser de €8.000 en el mismo piso.'},
      {type:'quiz', tag:'💸 Quiz', title:'Compras segunda mano en Cataluña a €180.000. ¿Cuánto pagas solo de ITP?',
        opts:[
          {t:'€18.000 (ITP 10% en Cataluña)',  ok:true},
          {t:'€10.800 (ITP 6%)',                ok:false},
          {t:'€12.600 (ITP 7%)',                ok:false},
          {t:'No se paga ITP en Cataluña',      ok:false},
        ],
        ok:'¡Correcto! Cataluña aplica el 10% de ITP en segunda mano: €180.000 × 10% = €18.000. Es el tipo más alto de España junto con Extremadura.',
        bad:'Cataluña tiene ITP del 10%, de los más altos de España: €180.000 × 0,10 = €18.000. Añade notaría, registro y mantenimiento y el coste real supera €200.000.'},
      {type:'final', xp:20, msg:'¡Sin sorpresas fiscales! Ahora sabes exactamente qué reservar antes de firmar cualquier contrato de arras.'},
    ],
  },

  /* ─ M86 ─ Cómo preparar la entrada ─ */
  {
    id:86, icon:'🐷', title:'Cómo Preparar la Entrada para tu Primera Vivienda',
    desc:'Ahorro sistemático, cuánto necesitas realmente y el simulador de plazos',
    xp:22, tag:'VIVIENDA', tagC:'blue', users:'22.100',
    steps:[
      {type:'content', tag:'🐷 Módulo 86', title:'El Plan de Ahorro para la Entrada',
        intro:'Los bancos financian hasta el 80% del valor de tasación (menor entre tasación y precio). Necesitas mínimo el 20% del precio + gastos (9-12%). Para un piso de €200.000 son €40.000 + €13.700 = ~€54.000.',
        bullets:[
          '🏦 Regla bancaria: máximo 80% LTV (Loan-to-Value). El 20% va de tu bolsillo + los gastos',
          '📅 Plazo realista: €54.000 ahorrando €1.000/mes = 54 meses (4,5 años)',
          '📈 Con rentabilidad: €1.000/mes en fondo monetario al 3,5% durante 4 años = €52.400',
          '⚠️ No uses inversión en RV para la entrada si el horizonte es <5 años (volatilidad)',
          '✅ Vehículos recomendados: cuenta remunerada (hasta €5.000), fondo monetario (resto)',
          '🎯 Truco del 3 pasos: 1) fija objetivo (precio+12%), 2) automatiza transferencia, 3) fondo monetario',
        ],
        fact:'Bancos que ofrecen hasta el 90% LTV a menores de 35 años (ICO aval 2024-2025): Santander, CaixaBank, BBVA. El ICO avala el tramo entre el 80-90%, pero el tipo de interés sube 0,5-1 pp.'},
      {type:'quiz', tag:'🐷 Quiz', title:'Quieres comprar en 5 años. ¿Cuál es el mejor vehículo de ahorro para la entrada?',
        opts:[
          {t:'ETF de renta variable — mayor rentabilidad',                              ok:false},
          {t:'Fondo monetario o cuenta remunerada — capital garantizado y liquidez',    ok:true},
          {t:'Criptomonedas — potencial de revalorización rápida',                      ok:false},
          {t:'Plan de pensiones — deducción fiscal inmediata',                          ok:false},
        ],
        ok:'¡Correcto! La entrada es un objetivo de corto plazo (<5 años) con fecha fija. La volatilidad de la RV puede hacer que en el momento de comprar tengas menos del 50% del objetivo. El fondo monetario preserva el capital y da ~3-4% actual.',
        bad:'Fondo monetario o cuenta remunerada. Con horizonte de 5 años y objetivo fijo, la volatilidad de RV es inaceptable. El plan de pensiones no es líquido hasta la jubilación.'},
      {type:'final', xp:22, msg:'¡Plan de entrada activado! Ya sabes cuánto ahorrar, dónde ponerlo y cuándo estarás listo para comprar.'},
    ],
  },

  /* ─ M87 ─ Negociar la hipoteca ─ */
  {
    id:87, icon:'🏦', title:'Negociar la Hipoteca como un Profesional',
    desc:'Compara bancos, entiende TAE vs TIN, y domina la amortización anticipada',
    xp:26, tag:'VIVIENDA', tagC:'blue', users:'19.800',
    steps:[
      {type:'content', tag:'🏦 Módulo 87', title:'La Hipoteca que Elegiste o la que te Vendieron',
        intro:'La diferencia entre una hipoteca bien negociada y una estándar puede ser €30.000-50.000 en intereses totales. La mayoría va al banco de toda la vida sin comparar.',
        bullets:[
          '📊 TIN vs TAE: el TIN es solo el tipo de interés nominal. La TAE incluye comisiones y productos vinculados → SIEMPRE compara por TAE',
          '🔗 Vinculaciones: seguro hogar, seguro vida, plan de pensiones — bonifican el tipo pero cuestan más que el ahorro',
          '🔄 Variable (Euríbor+diferencial) vs Fija: en 2024 hipoteca fija 10-20 años a ~3,2% vs variable Euríbor+0,5-0,8%',
          '⏳ Amortización anticipada: prioriza amortizar en los primeros 5-8 años (cuando pagas más intereses)',
          '📐 Regla: cuota mensual máxima = 35% de ingresos netos mensuales',
          '🛒 Usar bróker hipotecario (Trioteca, Hipoo, iAhorro): gratis para el cliente y consiguen mejores condiciones',
        ],
        fact:'Con hipoteca de €160.000 a 25 años al 3,5% pagas €79.000 en intereses. Al 2,8% pagas €59.000. La diferencia de 0,7pp son €20.000 con los mismos años. Merece la pena negociar.'},
      {type:'quiz', tag:'🏦 Quiz', title:'Banco A: TIN 3,1%, sin vinculaciones. Banco B: TIN 2,5% con seguro vida obligatorio de €800/año. ¿Cuál es mejor?',
        opts:[
          {t:'Banco B siempre — tipo más bajo',                                                   ok:false},
          {t:'Depende: hay que calcular la TAE real incluyendo el seguro en ambos',               ok:true},
          {t:'Banco A siempre — sin vinculaciones es más libre',                                  ok:false},
          {t:'Son equivalentes — la diferencia en TIN compensa exactamente el seguro',            ok:false},
        ],
        ok:'¡Correcto! Solo la TAE real (que incorpora el coste del seguro vinculado) permite comparar. Con €800/año de seguro extra durante 25 años el Banco B puede ser más caro que el A pese al TIN menor.',
        bad:'La respuesta correcta es calcular la TAE real. Un seguro de €800/año durante 25 años son €20.000 extra. Incluirlo en el cálculo puede invertir qué oferta es mejor.'},
      {type:'final', xp:26, msg:'¡Negociador hipotecario! Nunca firmarás una hipoteca sin comparar TAE real, calcular vinculaciones y usar un bróker.'},
    ],
  },

  /* ─ M88 ─ Alquiler con opción a compra y alternativas ─ */
  {
    id:88, icon:'🔑', title:'Alquiler con Opción a Compra y Estrategias Alternativas',
    desc:'Opciones reales cuando el banco dice no o los precios están desbocados',
    xp:20, tag:'VIVIENDA', tagC:'purple', users:'16.300',
    steps:[
      {type:'content', tag:'🔑 Módulo 88', title:'Cuando el Camino Convencional Está Bloqueado',
        intro:'La lógica convencional "ahorra → hipoteca → piso" no funciona para muchos. Hay alternativas reales que pueden acelerar el acceso o mejorar las condiciones.',
        bullets:[
          '🔑 Alquiler con opción a compra: pagas una prima inicial (1-5% del precio) + mensualidad. % del alquiler descuenta del precio final. Plazo típico: 2-5 años',
          '🏚️ Vivienda para reformar: precio 15-30% inferior al de mercado. Requiere capital extra para reforma (500-800€/m²) pero genera equity inmediato',
          '👨‍👩‍👧 Compra compartida: co-propiedad con familiar o amigo — requiere contrato privado de co-propiedad ante notario',
          '🌍 Ciudades secundarias: Toledo, Murcia, Almería — rentabilidades alquiler 6-8% vs 3-4% en Madrid/Barcelona',
          '📋 VPO y ayudas: Plan Estatal de Vivienda 2022-2025, ayudas autonómicas para <35 años',
          '⚠️ Alq. opción a compra: el arrendador puede negarse a ejecutar la opción pasado el plazo — revisar el contrato con abogado',
        ],
        fact:'El Plan Estatal de Vivienda 2022-2025 incluye ayudas de hasta €10.800 para alquiler y subsidios para jóvenes <35 años comprando su primera vivienda en municipios <5.000 habitantes.'},
      {type:'quiz', tag:'🔑 Quiz', title:'Alquiler con opción a compra: prima inicial €4.000, mensualidad €900 (30% computa a precio). En 3 años, ¿cuánto descuenta del precio de compra?',
        opts:[
          {t:'€4.000 + €9.720 = €13.720 en total',    ok:true},
          {t:'Solo €4.000 (la prima)',                  ok:false},
          {t:'€32.400 (100% de las mensualidades)',     ok:false},
          {t:'€9.720 (solo las mensualidades)',         ok:false},
        ],
        ok:'¡Correcto! Prima €4.000 + (€900×12×3×30%) = €4.000 + €9.720 = €13.720. Este importe se descuenta del precio pactado al ejecutar la opción. Si no la ejecutas, lo pierdes.',
        bad:'Total = prima (€4.000) + parte computable de mensualidades (€900×36×30% = €9.720) = €13.720. Si decides no comprar, pierdes ese dinero.'},
      {type:'final', xp:20, msg:'¡Estratega inmobiliario! Conoces las rutas alternativas al camino convencional y sabes cuándo aplicar cada una.'},
    ],
  },

  /* ══════════════════════════════════════════════════════
     MÓDULOS AVANZADOS SUELTOS — 89-90
  ══════════════════════════════════════════════════════ */

  /* ─ M89 ─ Autónomo vs SL ─ */
  {
    id:89, icon:'⚖️', title:'Autónomo vs Sociedad Limitada: ¿Cuándo Constituir una SL?',
    desc:'Alta, cuotas 2024, deducciones reales y el umbral exacto en que la SL gana',
    xp:28, tag:'AVANZADO', tagC:'red', users:'20.500',
    steps:[
      {type:'content', tag:'⚖️ Módulo 89', title:'El Umbral que Cambia la Decisión',
        intro:'La pregunta no es si constituir una SL, sino a partir de qué facturación tiene sentido. Con cuota de autónomos tarifa plana €80/mes y tramos IRPF, el umbral suele estar entre €40.000-60.000 de beneficio neto.',
        bullets:[
          '👤 Autónomo: cuota mínima 2024 = €230/mes (base €960). Máxima = €590/mes (base €4.720). Sistema de cotización por ingresos reales desde 2023',
          '🏢 SL: tipo IS 25% (23% para PYMES <1M€ facturación en los primeros 2 años). Requiere capital social €3.000 y gastos de constitución ~€600-1.000',
          '📉 Ventaja SL: retener beneficios dentro de la empresa tributa al 23-25% vs IRPF autónomo que llega al 47% en tramos altos',
          '💼 Deducción autónomo: casa, coche, dietas, seguros, suministros (30% gastos casa si hay despacho)',
          '📋 Cuándo SL conviene: beneficio neto >€40.000-50.000 anuales, quieres proteger patrimonio personal, o tienes socios',
          '💡 Solución mixta: SL que te paga sueldo optimizado (cotizar mínimo viable) + retención de beneficios',
        ],
        fact:'Un autónomo con €70.000 de beneficio paga ~€28.000 en IRPF + €3.000 SS = €31.000 (44%). Una SL con mismo beneficio, retribución de €35.000 al socio: IRPF ~€8.500 + IS sobre €35.000 restante (~€8.000) = €16.500 total (23%). Ahorro: ~€14.500/año.'},
      {type:'quiz', tag:'⚖️ Quiz', title:'María factura €45.000, gastos deducibles €10.000, beneficio €35.000. ¿Le conviene una SL?',
        opts:[
          {t:'No — la SL solo compensa claramente por encima de €40.000-50.000 de beneficio neto',  ok:true},
          {t:'Sí — siempre es mejor tributar al 23% (IS) que al IRPF',                             ok:false},
          {t:'Sí — con SL elimina la cuota de autónomos completamente',                            ok:false},
          {t:'Depende solo del sector, no del beneficio',                                           ok:false},
        ],
        ok:'¡Correcto! Con €35.000 de beneficio el ahorro fiscal de la SL puede no compensar los costes de gestoría (~€1.500-2.500/año), obligaciones contables y la menor flexibilidad para sacar el dinero.',
        bad:'Con €35.000 de beneficio estás en la zona gris. Hay que calcular: coste gestoría SL (~€2.000/año), obligaciones adicionales, y si el ahorro fiscal supera ese coste. Generalmente el umbral está en €40.000-50.000 de beneficio neto.'},
      {type:'final', xp:28, msg:'¡Decisión empresarial tomada con datos! Ahora sabes cuándo el salto a SL es rentable y cuándo es burocracia innecesaria.'},
    ],
  },

  /* ─ M90 ─ REITs y dividendos mensuales ─ */
  {
    id:90, icon:'🏗️', title:'REITs y Dividendos Mensuales: Renta Pasiva Inmobiliaria',
    desc:'$O, $SCHD, VHYL: estrategia de renta pasiva, ejemplos reales y fiscalidad española',
    xp:26, tag:'AVANZADO', tagC:'red', users:'17.900',
    steps:[
      {type:'content', tag:'🏗️ Módulo 90', title:'Inmobiliario sin Comprar un Ladrillo',
        intro:'Los REITs (Real Estate Investment Trusts) dan exposición inmobiliaria con liquidez de bolsa. Obligados por ley a distribuir el 90% de sus beneficios. En España su equivalente son las SOCIMIs.',
        bullets:[
          '🏢 REITs EE.UU.: Realty Income $O — dividendo mensual, 55+ años sin reducirlo, yield ~5,5%',
          '📊 ETFs de dividendo: $SCHD (Schwab US Dividend Equity ETF) — 12 años de crecimiento consecutivo, yield ~3,7%',
          '🌍 VHYL (Vanguard FTSE All-World High Dividend): 1.800 empresas globales, yield ~3,5%, TER 0,22%',
          '🇪🇸 SOCIMIs españolas: Merlin Properties, Colonial — cotizan en BME, yield 4-6%',
          '💰 Fiscalidad dividendos España: retención en origen 15-30% (EEUU/UK) + declaración IRPF 19-28%',
          '📋 Clave: pedir devolución retención exceso vía Convenio Doble Imposición — formulario W-8BEN para EE.UU.',
        ],
        fact:'$1.000/mes de dividendos con yield 5% requiere cartera de €240.000 a precios 2024. Reinvirtiendo €500/mes durante 20 años al 7% total return alcanzas €245.000. El camino es largo pero los dividendos llegan mientras construyes.'},
      {type:'quiz', tag:'🏗️ Quiz', title:'Cobras dividendo de $O (REIT EE.UU.) de €1.000 brutos. EE.UU. retiene el 15% (convenio). ¿Cuánto incluyes en IRPF?',
        opts:[
          {t:'Solo €850 (el neto recibido)',                                               ok:false},
          {t:'€1.000 brutos; los €150 retenidos en EE.UU. deducen de la cuota española',   ok:true},
          {t:'€0 — ya tributó en origen no hay que declararlo en España',                   ok:false},
          {t:'€1.000 brutos sin ninguna deducción posible',                                  ok:false},
        ],
        ok:'¡Correcto! Se declara el íntegro (€1.000) como rendimiento del capital mobiliario. La retención de EE.UU. (€150) deduce de la cuota IRPF española. Si en España tocas pagar €190 (19%), pagas solo €40 más (€190-€150).',
        bad:'Se declara el íntegro €1.000. La retención americana (€150) opera como "deducción por doble imposición internacional" y reduce la cuota del IRPF. Si el tipo español es 19% → €190 cuota − €150 retención = €40 a pagar en España.'},
      {type:'final', xp:26, msg:'¡Inversor de renta inmobiliaria! Ya sabes cómo construir un flujo de dividendos mensuales con REITs, su fiscalidad real y los mejores vehículos.'},
    ],
  },

  // ── M91-M99: EXPANSIÓN EDUCATIVA ──────────────────────────────
  {
    id:91, icon:'📉', title:'Inflación Real vs Oficial: Protege tu Poder Adquisitivo',
    desc:'IPC vs inflación sentida, el impuesto silencioso y activos que protegen tu dinero',
    xp:24, tag:'AVANZADO', tagC:'red', users:'14.200',
    steps:[
      {type:'content', tag:'📉 Módulo 91', title:'El Ladrón Silencioso de tu Riqueza',
        intro:'La inflación es el coste de vida que sube mientras tu dinero parado se encoge. Con IPC al 3% anual, €100.000 en cuenta corriente valen €74.409 en términos reales tras 10 años. No perdiste dinero nominalmente, pero sí riqueza real.',
        bullets:[
          '📊 IPC oficial vs inflación sentida: el IPC mide una cesta media que no refleja tu consumo real (alquileres, energía y alimentación suben más que la media)',
          '🔥 El impuesto silencioso: nadie te lo cobra explícitamente pero erosiona el ahorro cada año sin excepción',
          '🏠 REITs e inmuebles: históricamente suben con o por encima de la inflación — el alquiler se ajusta al IPC',
          '📈 Acciones (RV): las empresas trasladan la inflación al precio de sus productos — protección a largo plazo',
          '🥇 Oro: reserva de valor histórica, pero sin rentabilidad por sí mismo; útil como cobertura, no como motor de crecimiento',
          '💰 TIPS / bonos indexados: ajustan su nominal al IPC, garantizan poder adquisitivo real pero con menor rentabilidad esperada',
          '🚨 Lo peor: cuentas remuneradas al 1% con IPC al 3% = pierdes 2% anual en términos reales',
        ],
        fact:'Dato real: un salario de €25.000 en 2010 necesitaría ser €34.800 en 2024 para mantener el mismo poder adquisitivo (inflación acumulada ~39%). La mayoría no ha tenido ese aumento.'},
      {type:'quiz', tag:'📉 Quiz', title:'Con IPC del 3% anual, ¿cuánto poder adquisitivo real pierdes en 10 años con €100.000 parados en cuenta corriente?',
        opts:[
          {t:'€3.000 (el 3% del primer año)',             ok:false},
          {t:'€25.591 (efecto compuesto 10 años)',        ok:true},
          {t:'€30.000 (3% x 10 años sin compuesto)',      ok:false},
          {t:'Nada — el dinero sigue siendo €100.000',    ok:false},
        ],
        ok:'¡Exacto! El efecto compuesto de la inflación es devastador: 100.000 x (1-0.03)^10 = €73.742. Pierdes ~€25.600 de poder adquisitivo aunque nominalmente tengas los mismos €100.000.',
        bad:'El efecto compuesto importa: 100.000 x (1-0.03)^10 = €73.742. Pierdes ~€25.600 de poder adquisitivo en 10 años. No es el 3% anual simple, es el 3% de un capital que va menguando.'},
      {type:'final', xp:24, msg:'¡Inmunizado contra el ladrón silencioso! Ya entiendes por qué el dinero parado pierde y qué activos protegen tu patrimonio real.'},
    ],
  },
  {
    id:92, icon:'📋', title:'Cómo Leer un Prospecto de ETF: IWDA, VWCE y CSPX',
    desc:'TER, tracking error, domicilio fiscal, réplica física vs sintética: todo lo que necesitas saber',
    xp:22, tag:'INVERSIÓN', tagC:'blue', users:'19.300',
    steps:[
      {type:'content', tag:'📋 Módulo 92', title:'El Documento que Pocos Leen (y Todos Deberían)',
        intro:'Antes de comprar cualquier ETF, el KIID o DICI (documento de datos fundamentales) y el folleto completo te dicen todo. Aprende a leerlos en 5 minutos.',
        bullets:[
          '💸 TER (Total Expense Ratio): coste anual total del ETF — IWDA 0,20% · VWCE 0,22% · CSPX 0,07% — cobra automáticamente del NAV, no lo ves en tu cuenta',
          '📏 Tracking Error: desviación anual entre el ETF y su índice — por encima de 0,5% anual es señal de alerta',
          '📏 Tracking Difference: diferencia real de rentabilidad vs el índice en el año — más importante que el TER aislado',
          '🏴󠁧󠁢󠁩󠁥󠁿 Domicilio fiscal Irlanda: los ETFs domiciliados en Irlanda (IWDA, VWCE, CSPX) aplican solo 15% retención en dividendos de EEUU (convenio IE-US). Luxemburgo pagaría 30%',
          '🔄 Réplica física: el ETF compra las acciones del índice directamente — más transparente',
          '🔄 Réplica sintética: usa swaps con contraparte — potencialmente más eficiente pero añade riesgo de contraparte',
          '💰 Acumulación (Acc) vs distribución (Dist): Acc reinvierte dividendos internamente (mejor en fase de acumulación por eficiencia fiscal en España)',
        ],
        fact:'Diferencia real a 30 años: €10.000 en ETF con TER 0,07% (CSPX) vs TER 1,5% (fondo activo típico) al 7% anual = €71.143 vs €42.478. El TER bajo supone €28.665 más en tu bolsillo.'},
      {type:'quiz', tag:'📋 Quiz', title:'¿Por qué los ETFs domiciliados en Irlanda son más eficientes fiscalmente para inversores españoles con acciones EEUU?',
        opts:[
          {t:'Porque Irlanda no cobra impuestos de ningún tipo',                                    ok:false},
          {t:'Por el convenio Irlanda-EEUU: solo 15% retención en dividendos americanos (vs 30%)', ok:true},
          {t:'Porque los ETFs irlandeses no reparten dividendos nunca',                             ok:false},
          {t:'Porque España tiene convenio especial con Irlanda para inversores',                   ok:false},
        ],
        ok:'¡Correcto! El convenio de doble imposición entre Irlanda y EEUU reduce la retención en dividendos americanos del 30% al 15%. Ese 15% adicional que se ahorra compone a lo largo de décadas en una diferencia enorme.',
        bad:'El convenio Irlanda-EEUU reduce la retención en dividendos americanos del 30% al 15%. Para un ETF que invierte en acciones de EEUU, esto supone una ventaja fiscal real y permanente frente a ETFs de otras jurisdicciones.'},
      {type:'final', xp:22, msg:'¡Analista de ETFs! Ya sabes comparar cualquier producto indexado: TER, tracking difference, domicilio y tipo de réplica. IWDA, VWCE y CSPX no tienen secretos para ti.'},
    ],
  },
  {
    id:93, icon:'🏛️', title:'El Sistema de Pensiones Español Explicado',
    desc:'Cómo se calculan los puntos, lagunas de cotización y cuánto cubrirá la pensión realmente',
    xp:25, tag:'PLANIFICACIÓN', tagC:'green', users:'22.100',
    steps:[
      {type:'content', tag:'🏛️ Módulo 93', title:'La Pensión que Realmente Cobrarás',
        intro:'El sistema público de pensiones español es de reparto: los trabajadores activos financian las pensiones actuales. Entender cómo funciona es esencial para planificar el ahorro complementario necesario.',
        bullets:[
          '📅 Base reguladora: media de las últimas 25 cotizaciones (en 2027 serán los mejores 25 de los últimos 29 años según la reforma)',
          '📊 Años cotizados: con 15 años tienes derecho al 50% de la base reguladora; el 100% se alcanza con 37 años y 3 meses (2027)',
          '⚠️ Lagunas de cotización: meses sin cotizar (paro sin prestación, cuidado de hijos) puntúan como salario mínimo — impactan especialmente a mujeres',
          '🎂 Edad legal: 65 años con 38 años cotizados, o 66 años y 8 meses en 2024 (subiendo a 67 en 2027)',
          '📉 Brecha real: pensión media en España ~€1.200/mes. Si tu último sueldo era €3.000, la pensión cubre solo el 40%. El resto, ahorro propio',
          '🛡️ Complemento: cada año que retrases la jubilación voluntariamente suma un porcentaje adicional a la pensión final',
        ],
        fact:'Ejemplo real: sueldo neto €2.500/mes. Pensión estimada €1.400/mes (56%). Necesita cubrir €1.100/mes de su bolsillo. Para generar €1.100/mes con retiro al 4% necesita un patrimonio de €330.000. ¿Cuánto estás ahorrando para eso?'},
      {type:'quiz', tag:'🏛️ Quiz', title:'¿Qué porcentaje de la base reguladora recibes con exactamente 37 años y 3 meses cotizados (en 2027)?',
        opts:[
          {t:'80% — necesitas más años para el 100%',             ok:false},
          {t:'100% — mínimo para pensión completa en 2027',       ok:true},
          {t:'115% — los años extra dan bonus sobre el 100%',     ok:false},
          {t:'70% — la pensión completa requiere 40 años',        ok:false},
        ],
        ok:'¡Correcto! Con 37 años y 3 meses de cotización (el mínimo en 2027 según la reforma), obtienes el 100% de la base reguladora. Recuerda que el 100% de la base no es tu sueldo completo, es la media de tus últimas cotizaciones.',
        bad:'Con 37 años y 3 meses cotizados obtienes el 100% de la base reguladora. Los años adicionales ya no suman más porcentaje, aunque sí puedes demorar la jubilación para obtener un complemento.'},
      {type:'final', xp:25, msg:'¡Experto en pensiones! Sabes cuánto cubrirá la pensión pública y cuánto necesitas generar con ahorro propio para mantener tu nivel de vida.'},
    ],
  },
  {
    id:94, icon:'🌍', title:'Nómada Digital: Fiscalidad y Estrategia en 2024',
    desc:'Residencia fiscal, convenios, régimen Beckham, Wise/Revolut y los riesgos reales del nómadismo',
    xp:26, tag:'AVANZADO', tagC:'red', users:'11.500',
    steps:[
      {type:'content', tag:'🌍 Módulo 94', title:'Trabajar desde Cualquier Lugar (sin Liarla con Hacienda)',
        intro:'Ser nómada digital tiene implicaciones fiscales críticas. Cada año que pasas más de 183 días en un país te conviertes en residente fiscal allí. Ignorarlo puede costarte multas de decenas de miles de euros.',
        bullets:[
          '📅 Regla 183 días: si pasas más de 183 días en España en un año natural eres residente fiscal aquí y tributan tus rentas mundiales',
          '🧾 Régimen Beckham (Impatriados): extranjeros que se trasladan a España por trabajo pueden tributar al 24% fijo sobre rentas hasta €600.000 durante 6 años',
          '🇵🇹 Portugal NHR: vigente hasta 2024, sustituido por el IFICI para áreas específicas — ya no disponible en su forma original',
          '✈️ Alternativas en 2024: Malta (flat tax para no-dom), Georgia (1% sobre ingresos extranjeros), Paraguay, Dubai (0% IRPF)',
          '🏦 Wise y Revolut Business aceptan residentes en múltiples países y facilitan cobros internacionales — no son soluciones fiscales',
          '⚠️ Riesgo real: cambiar de residencia fiscal sin asesor es una mina. El MODELO 720 y acuerdos con 100+ países hacen difícil eludir Hacienda sin hacerlo correctamente',
        ],
        fact:'Caso real: español que trabaja remotamente, mantiene domicilio en España, su empresa cotiza a la SS española y pasa 7 meses en Tailandia. Resultado: sigue siendo residente fiscal en España. La residencia fiscal no se pierde con comprar un billete de avión.'},
      {type:'quiz', tag:'🌍 Quiz', title:'Te mudas a Dubai en enero y pasas allí todo el año trabajando remotamente. ¿Cuándo dejas de ser residente fiscal en España?',
        opts:[
          {t:'Inmediatamente al cambiar tu domicilio en el padrón',                                  ok:false},
          {t:'Tras 5 años en Dubai',                                                                 ok:false},
          {t:'Al acreditar residencia fiscal en Dubai Y darte de baja en el IRPF español cumpliendo todos los requisitos', ok:true},
          {t:'Al cabo de 183 días fuera de España',                                                  ok:false},
        ],
        ok:'¡Correcto! Cambiar de residencia fiscal implica: baja en el censo español, acreditación de nueva residencia fiscal en el extranjero, y con países de baja tributación Hacienda puede aplicar la cláusula anti-elusión de 4 años adicionales. Imprescindible un asesor fiscal.',
        bad:'No basta con marcharse. Hacienda exige baja en el IRPF español, acreditación de nueva residencia fiscal, y en países de baja tributación hay una cláusula de 4 años adicionales de tributación en España. Sin asesor, el riesgo de cometer errores costosos es muy alto.'},
      {type:'final', xp:26, msg:'¡Estratega fiscal global! Conoces las reglas del nómadismo digital, los regímenes favorables reales y los riesgos de no hacerlo correctamente.'},
    ],
  },
  {
    id:95, icon:'🚨', title:'Cómo Detectar una Estafa de Inversión',
    desc:'Ponzi, pump & dump, chiringuitos financieros: señales reales y cómo verificar cualquier intermediario',
    xp:23, tag:'PSICOLOGÍA', tagC:'purple', users:'28.700',
    steps:[
      {type:'content', tag:'🚨 Módulo 95', title:'Si Suena Demasiado Bueno, Lo Es',
        intro:'Las estafas de inversión han crecido un 300% en España desde 2020. Conocer sus patrones te hace prácticamente inmune. Nadie cae en una estafa que reconoce.',
        bullets:[
          '🔴 Rentabilidad garantizada: en finanzas no existe garantía fuera de la renta fija soberana. "12% garantizado anual" = fraude con probabilidad >95%',
          '🔴 Urgencia artificial: "solo quedan 3 plazas" o "oferta válida 24h" — técnicas de presión para que no dé tiempo a verificar',
          '🔴 Opacidad total: no puedes ver cómo ganan dinero, no hay documentación regulatoria pública, equipo no verificable',
          '📊 Esquema Ponzi: pagan rentabilidades a los primeros con el dinero de los nuevos. Madoff: $65.000M. Afinsa/Forum Filatélico España: €3.000M a 350.000 inversores',
          '💹 Pump & Dump en crypto: promotores compran un activo, crean hype y venden en el pico. El 95% de altcoins con promesas de x10 siguen este patrón',
          '✅ Verificación España: todo intermediario debe estar registrado en la CNMV (cnmv.es). Compruébalo SIEMPRE antes de invertir un euro',
          '🛡️ Regla de oro: si no entiendes exactamente cómo genera rentabilidad, no inviertas. Nunca.',
        ],
        fact:'Caso FTX 2022: exchange con valoración de $32.000M que quebró en 72 horas. Los clientes no podían retirar su dinero. La única protección real: fondos de garantía de depósitos (hasta €100.000 en bancos europeos regulados) y regulación MIFID II.'},
      {type:'quiz', tag:'🚨 Quiz', title:'Te ofrecen un fondo con "15% anual garantizado, sin pérdidas en 8 años". ¿Cuál es la señal más clara de fraude?',
        opts:[
          {t:'El 15% es alto pero no imposible si el gestor es muy bueno',                           ok:false},
          {t:'"Garantizado" sin ningún año negativo en 8 años es estadísticamente imposible en mercados reales', ok:true},
          {t:'Solo es sospechoso si no están registrados en la CNMV',                               ok:false},
          {t:'Habría que ver el histórico completo antes de juzgar',                                 ok:false},
        ],
        ok:'¡Exacto! Ningún fondo real puede garantizar rentabilidad positiva todos los años — los mercados tienen años negativos inevitablemente (S&P 500: -38% en 2008, -19% en 2022). "Garantizado sin pérdidas" es una mentira matemática: indica esquema Ponzi o fraude.',
        bad:'La combinación "garantizado + sin ningún año negativo" es la señal más clara. Los mercados tienen años negativos inevitablemente. Cualquier producto que afirme rentabilidades positivas garantizadas todos los años es fraudulento por definición matemática. Verifica siempre en la CNMV.'},
      {type:'final', xp:23, msg:'¡Detector de fraudes activado! Reconoces los patrones Ponzi, el pump & dump y los chiringuitos financieros. Verifica siempre en la CNMV antes de invertir.'},
    ],
  },
  {
    id:96, icon:'📊', title:'Opciones y Derivados para Inversores Particulares',
    desc:'Call, put, prima, strike, covered call y por qué el 70-80% de compradores de opciones pierde dinero',
    xp:28, tag:'AVANZADO', tagC:'red', users:'9.800',
    steps:[
      {type:'content', tag:'📊 Módulo 96', title:'Instrumentos de Doble Filo',
        intro:'Las opciones son contratos que dan el derecho (no la obligación) a comprar o vender un activo a un precio fijo en una fecha futura. Son legítimos para cobertura, pero peligrosos para especulación sin formación.',
        bullets:[
          '📞 Call (opción de compra): derecho a comprar 100 acciones al precio strike. Ganas si el activo supera el strike antes del vencimiento. Si no llega, pierdes toda la prima pagada',
          '📉 Put (opción de venta): derecho a vender al precio strike. Útil como seguro de cartera — si el mercado cae, tu put sube compensando pérdidas',
          '💰 Prima: precio que pagas por la opción. Si el activo no llega al strike, pierdes el 100% de la prima invertida',
          '🛡️ Covered Call: ya tienes 100 acciones, vendes una call y cobras prima. Si el precio no supera el strike, la prima es tuya. Estrategia de ingresos para carteras existentes',
          '🎯 Iron Condor: vender una call OTM y una put OTM simultáneamente — ganas si el activo no se mueve mucho. Para mercados en rango lateral',
          '⚠️ El 70-80% de compradores pierde: el tiempo juega en contra (theta decay), la volatilidad implícita suele estar sobrepagada. Es un juego de suma cero',
          '🇪🇸 En España: MEFF para derivados sobre IBEX35; Interactive Brokers para mercados internacionales',
        ],
        fact:'Durante el Short Squeeze de GameStop (enero 2021), miles de inversores novatos compraron opciones call OTM cerca del pico y perdieron el 100% de su inversión en días. Las opciones amplifican tanto las ganancias (miles de %) como las pérdidas (-100%). Sin formación son más peligrosas que la bolsa directa.'},
      {type:'quiz', tag:'📊 Quiz', title:'Tienes 100 acciones de Inditex a €32. Vendes covered call strike €35, prima €0,50/acción. Inditex cierra a €38 al vencimiento. ¿Resultado?',
        opts:[
          {t:'€350: €300 revalorización (€32→€35) + €50 prima',                                    ok:true},
          {t:'€600 (€38-€32 x 100) porque conservas las acciones',                                  ok:false},
          {t:'Pérdida: tuviste que vender barato con el mercado arriba',                             ok:false},
          {t:'€50 de prima y conservas acciones a €38',                                              ok:false},
        ],
        ok:'¡Correcto! El comprador ejerce la call y tú vendes a €35 aunque el mercado esté a €38. Resultado: €300 de revalorización (€35-€32 x 100) + €50 de prima = €350. Sin covered call habrías ganado €600. Vendiste el techo a cambio de ingresos seguros, el coste fue no participar en €250 de subida adicional.',
        bad:'Con covered call, si el precio supera el strike el comprador ejerce y tú vendes a €35. Cobras €50 prima + €300 revalorización = €350. Sin la estrategia habrías ganado €600. La covered call da ingresos seguros a cambio de limitar el potencial alcista.'},
      {type:'final', xp:28, msg:'¡Conocedor de derivados! Entiendes calls, puts, covered calls y por qué estos instrumentos requieren formación antes de usarlos. Cobertura sí; especulación sin formación, nunca.'},
    ],
  },
  {
    id:97, icon:'🔢', title:'El Método de la X: Tu Número para la Independencia Financiera',
    desc:'Regla del 4%, número FIRE personal, lean/fat/barista/coast FIRE y años necesarios según tasa de ahorro',
    xp:27, tag:'PLANIFICACIÓN', tagC:'green', users:'31.400',
    steps:[
      {type:'content', tag:'🔢 Módulo 97', title:'Tu Número Mágico Tiene Nombre: X',
        intro:'X = tus gastos anuales x 25. Con ese patrimonio invertido puedes retirar el 4% anual indefinidamente (con alta probabilidad histórica) sin quedarte sin dinero. Este es el núcleo matemático de la independencia financiera.',
        bullets:[
          '📐 Regla del 4%: estudio Trinity (1998) — carteras 50-75% RV/RF aguantan 30 años de retiro al 4% en el 95% de escenarios históricos desde 1926',
          '🎯 Calcula tu X: gastos €18.000/año (€1.500/mes) = X de €450.000. Gastos €30.000/año = X de €750.000',
          '🌿 Lean FIRE: reducir gastos al mínimo para alcanzar X antes. Riesgo: poco margen ante imprevistos',
          '🏆 Fat FIRE: X muy alto para mantener estilo de vida actual (€40.000/año = X de €1.000.000+)',
          '☕ Barista FIRE: alcanzas la mitad de X y trabajas a tiempo parcial para cubrir el resto',
          '🏄 Coast FIRE: inviertes suficiente hoy para que, sin añadir más, el crecimiento llegue a X en la jubilación',
          '📊 Tasa de ahorro vs años para X (rentabilidad real 5%): 10%=51 años | 20%=37 | 30%=28 | 40%=22 | 50%=17 | 60%=12,5 años',
        ],
        fact:'Ejemplo: ganas €2.800/mes, gastos €1.800/mes, ahorras €1.000/mes (36%). Tu X = €540.000. Invirtiendo €1.000/mes al 7% nominal, en ~22 años tienes €540.000. Cada euro que reduces en gastos mensuales reduce tu X en €300 Y acelera el ahorro. Doble efecto multiplicador.'},
      {type:'quiz', tag:'🔢 Quiz', title:'Tus gastos son €2.000/mes. Ya tienes €57.000 ahorrados. ¿Cuánto te falta para tu X (regla x25)?',
        opts:[
          {t:'€543.000 (X es €600.000, tienes €57.000)',  ok:true},
          {t:'€243.000 (X sería €300.000)',               ok:false},
          {t:'€693.000 (X sería €750.000)',               ok:false},
          {t:'€143.000 (X sería €200.000)',               ok:false},
        ],
        ok:'¡Correcto! Gastos €2.000/mes = €24.000/año. X = €24.000 x 25 = €600.000. Con €57.000 actuales, te faltan €543.000. Invirtiendo €800/mes al 7% los alcanzarías en aproximadamente 21 años.',
        bad:'Gastos €2.000/mes = €24.000/año. X = €24.000 x 25 = €600.000. Con €57.000 ahorrados, te faltan €543.000. Ahora decide: ¿aumentas la tasa de ahorro o reduces gastos para acelerar el plazo?'},
      {type:'final', xp:27, msg:'¡Tu número X desbloqueado! Conoces tu meta de independencia financiera, las variantes FIRE y el impacto de la tasa de ahorro en los plazos. Ahora solo queda ejecutar.'},
    ],
  },
  {
    id:98, icon:'🧠', title:'Psicología del Precio y Neuromarketing Financiero',
    desc:'Precio ancla, efecto señuelo, dark patterns fintech y cómo el cerebro valora distinto efectivo vs tarjeta',
    xp:22, tag:'PSICOLOGÍA', tagC:'purple', users:'24.600',
    steps:[
      {type:'content', tag:'🧠 Módulo 98', title:'Tu Cerebro Gasta, tu Mente Decide',
        intro:'Las empresas invierten millones en estudiar cómo percibimos los precios. Entender estas técnicas es la mejor defensa contra el gasto impulsivo y las decisiones financieras irracionales.',
        bullets:[
          '⚓ Precio ancla: el primer precio que vemos fija la referencia mental. "Antes €2.000, ahora €1.200" parece ganga aunque valga €800. En negociaciones salariales, quien dice el primer número suele ganar',
          '🎯 Efecto señuelo: tres opciones donde la del medio parece razonable — el plan caro existe para hacer el medio parecer barato',
          '🔢 Precios terminados en ,99: el cerebro procesa €9,99 como aproximadamente €9. Reduce la percepción de gasto ~20%',
          '💳 Efectivo vs tarjeta: pagar con tarjeta duele menos psicológicamente — se gasta 12-18% más con tarjeta. Bizum añade otra capa de abstracción',
          '🔄 Suscripciones trampa: prueba gratuita con tarjeta obligatoria convierte al 40% en pagadores por inercia',
          '🌑 Dark patterns fintech: botón cancelar en gris diminuto, flujo de cancelación de 7 pasos, pausa de 3 meses antes que la cancelación real',
          '🛡️ Defensa práctica: lista de la compra antes de entrar | regla 24h para compras mayores de €50 | regla 72h para mayores de €200 | tarjeta prepago con presupuesto fijo',
        ],
        fact:'Experimento MIT (Ariely): misma botella de vino presentada como €5 o €45. Los que creían pagar €45 reportaron disfrutarla más Y los escáneres cerebrales mostraron mayor activación en áreas de placer. El precio no solo afecta la compra — afecta la experiencia posterior. El neuromarketing cambia la realidad percibida.'},
      {type:'quiz', tag:'🧠 Quiz', title:'App de música: Plan Básico €4,99 · Plan Familiar €14,99 · Plan Estudiante €4,99. ¿Qué técnica usa principalmente el Plan Estudiante?',
        opts:[
          {t:'Precio ancla — el Básico ancla la percepción del resto',                               ok:false},
          {t:'Segmentación por identidad: mismo precio, mayor valor percibido por la etiqueta Estudiante', ok:true},
          {t:'Descremado de precios por segmento de poder adquisitivo',                              ok:false},
          {t:'Efecto señuelo — el Familiar hace que el Estudiante parezca barato',                   ok:false},
        ],
        ok:'¡Correcto! Básico y Estudiante tienen el mismo precio (€4,99), pero la etiqueta genera mayor valor percibido e identidad. Además, el Plan Familiar actúa de ancla haciendo los €4,99 parecer una ganga. Las técnicas se superponen con frecuencia en el mismo diseño de precios.',
        bad:'El Estudiante y el Básico son iguales en precio pero la etiqueta apela a la identidad generando mayor satisfacción por el mismo dinero. El Familiar actúa como ancla. En la práctica ancla, identidad y señuelo se combinan en el mismo diseño.'},
      {type:'final', xp:22, msg:'¡Inmune al neuromarketing! Reconoces el precio ancla, el efecto señuelo y los dark patterns. Tu escudo: lista de la compra más regla de las 24 y 72 horas.'},
    ],
  },
  {
    id:99, icon:'🏛️', title:'La Cartera Permanente: Estabilidad en Cualquier Clima Económico',
    desc:'Harry Browne, All-Weather de Dalio, backtesting vs 100% RV y para qué perfil tiene sentido',
    xp:26, tag:'INVERSIÓN', tagC:'blue', users:'13.900',
    steps:[
      {type:'content', tag:'🏛️ Módulo 99', title:'La Cartera para Dormir Tranquilo',
        intro:'La Cartera Permanente de Harry Browne (1981) está diseñada para funcionar bien en los cuatro posibles estados de la economía. Sacrifica rentabilidad máxima a cambio de mínima volatilidad.',
        bullets:[
          '📐 Composición: 25% acciones (crecimiento) + 25% bonos largo plazo (deflación) + 25% oro (inflación/incertidumbre) + 25% liquidez (recesión/emergencias)',
          '📊 Lógica: en cada escenario macroeconómico uno de los cuatro activos lidera, amortiguando las caídas de los otros tres',
          '📈 Backtesting 1972-2023: rentabilidad anual ~6,5% nominal, volatilidad ~7%. Una cartera 100% RV global da ~10% pero con volatilidad ~15-18% y caídas máximas de -50%',
          '🌦️ All-Weather Portfolio (Ray Dalio): 30% acciones + 40% bonos LP + 15% bonos CP + 7,5% oro + 7,5% commodities — misma lógica de equilibrio entre escenarios',
          '📉 Problema actual: los bonos LP tuvieron su peor año en 200 años en 2022 (-25%). La correlación bonos-acciones cambia con inflación estructural',
          '🎯 Para quién tiene sentido: jubilados o próximos a jubilarse (horizonte menor de 10 años) | baja tolerancia psicológica a caídas | dinero que puede necesitarse pronto',
          '⚠️ Para quién NO tiene sentido: inversores jóvenes con horizonte mayor de 20 años — la RV bate a largo plazo y el tiempo absorbe la volatilidad',
        ],
        fact:'Comparativa real 1995-2023: €10.000 en Cartera Permanente = ~€58.000. €10.000 en S&P 500 = ~€185.000. La diferencia es +€127.000, pero en 2008-2009 el S&P cayó -55% mientras la CP caía solo -2%. El precio de la estabilidad es la rentabilidad. La pregunta correcta: ¿cuál es mejor para TI, tu horizonte y tu psicología?'},
      {type:'quiz', tag:'🏛️ Quiz', title:'Tienes 35 años, horizonte de 30 años y alta tolerancia al riesgo. ¿Qué estrategia te conviene mejor?',
        opts:[
          {t:'Cartera Permanente — siempre más segura que la RV',                                    ok:false},
          {t:'All-Weather de Dalio — la más sofisticada y equilibrada',                              ok:false},
          {t:'100% RV global — el largo plazo absorbe la volatilidad y maximiza el retorno',         ok:true},
          {t:'50% oro / 50% liquidez — máxima estabilidad posible',                                  ok:false},
        ],
        ok:'¡Correcto! Con 35 años y 30 de horizonte, la RV global ofrece el mejor retorno esperado a largo plazo. Tienes 30 años para recuperarte de cualquier crisis. La CP sacrifica ~€127.000 de rentabilidad potencial a cambio de menos volatilidad — un sacrificio sin sentido con tanto tiempo por delante.',
        bad:'Con 30 años de horizonte, el tiempo es tu mayor aliado. La RV global tiene el mejor retorno histórico y cualquier caída se recupera en ese horizonte. La CP sacrifica €127.000 de rentabilidad potencial. Tiene sentido para perfiles conservadores o con horizonte corto, no para inversores jóvenes.'},
      {type:'final', xp:26, msg:'¡Arquitecto de carteras completo! Conoces la Cartera Permanente, el All-Weather y sabes en qué contexto tiene sentido cada estrategia según tu horizonte y perfil de riesgo.'},
    ],
  },

  // ─── M100: Inflación real vs oficial ──────────────────────────
  {
    id:100, icon:'📉', title:'Inflación Real vs Oficial: El Impuesto Silencioso',
    desc:'IPC, inflación sentida, activos que protegen y por qué el dinero parado destruye tu poder adquisitivo',
    xp:24, tag:'FISCALIDAD', tagC:'yellow', users:'11.200',
    steps:[
      {type:'content', tag:'📉 Módulo 100', title:'El Impuesto que Nadie Vota',
        intro:'La inflación es el único impuesto que no necesita aprobación parlamentaria. Reduce silenciosamente el valor real de tu dinero mientras tú duermes. Entenderla es la diferencia entre preservar y perder riqueza.',
        bullets:[
          '📊 IPC vs inflación sentida: el IPC mide una cesta de consumo promedio. Pero si tu gasto se concentra en alimentos, vivienda o energía — que suben más que la media — tu inflación real es mayor que la oficial',
          '🧮 El "impuesto silencioso": con IPC del 3% anual, €100.000 en cuenta corriente durante 10 años equivalen a €74.409 de poder adquisitivo real. Pierdes €25.591 sin que nadie te lo quite directamente',
          '📐 Fórmula básica: Poder adquisitivo futuro = Capital × (1 − inflación)^años. Con 3% en 10 años: 100.000 × (0,97)^10 = €73.742',
          '🏛️ Activos que protegen (históricamente): acciones (crecimiento real), TIPS/bonos indexados a inflación (protección directa), REITs/inmobiliario (renta indexada), oro (valor refugio en inflación alta), commodities (correlación directa)',
          '⚠️ Activos que NO protegen: cuentas corrientes (0-0,5% — pierden contra inflación), depósitos a plazo al 2% con IPC del 3% = pérdida real del 1%, bonos fijos a largo plazo (su valor cae cuando sube la inflación)',
          '🔢 Regla práctica: rentabilidad REAL = rentabilidad nominal − inflación. Un fondo monetario al 3,5% con IPC del 3% solo da un 0,5% real. Apenas preservas',
          '🌍 España 2023: el IPC oficial fue 3,5%. Los alimentos subieron un 10,9%. Una familia que gasta el 30% en alimentación sufrió una inflación real del ~6,4%, muy por encima del IPC publicado',
        ],
        fact:'Caso histórico: si hubieras guardado €10.000 en efectivo en España en 2013 (cuando el IPC promedió el 1,5% anual), en 2023 tendrías los mismos billetes pero solo €8.610 de poder de compra real. La inflación acumulada de 10 años se comió €1.390 sin que nadie te los robara. El dinero parado siempre pierde.'},
      {type:'quiz', tag:'📉 Quiz', title:'Tienes €50.000 en una cuenta corriente remunerada al 1% anual. La inflación es del 3,5%. ¿Qué ocurre en términos reales al año?',
        opts:[
          {t:'Ganas €500 — el 1% es rentabilidad positiva',                                          ok:false},
          {t:'Pierdes aproximadamente €1.250 de poder adquisitivo real',                              ok:true},
          {t:'Empatas — la remuneración compensa la inflación',                                       ok:false},
          {t:'La inflación no afecta al dinero en cuenta bancaria',                                   ok:false},
        ],
        ok:'¡Exacto! Rentabilidad real = 1% − 3,5% = −2,5%. Sobre €50.000 eso son −€1.250 de poder adquisitivo real perdido en un año, aunque el saldo nominal sube €500. El dinero parado en cuentas de bajo rendimiento siempre pierde contra la inflación.',
        bad:'La clave es la rentabilidad REAL: 1% nominal − 3,5% inflación = −2,5% real. El saldo sube €500 nominalmente pero pierdes €1.250 de poder adquisitivo. €50.000 × (−2,5%) = −€1.250. Nunca confundas rentabilidad nominal con rentabilidad real.'},
      {type:'final', xp:24, msg:'¡Especialista antiinflación! Ya distingues entre el IPC oficial y la inflación real, conoces los activos que preservan el poder adquisitivo y entiendes por qué el dinero parado siempre pierde contra la inflación.'},
    ],
  },

  // ─── M101: Cómo leer un prospecto de ETF ──────────────────────
  {
    id:101, icon:'📋', title:'Cómo Leer un Prospecto de ETF: La Guía Definitiva',
    desc:'TER, tracking error, tracking difference, domicilio fiscal y réplica física vs sintética explicados con ejemplos reales',
    xp:26, tag:'INVERSIÓN', tagC:'blue', users:'9.800',
    steps:[
      {type:'content', tag:'📋 Módulo 101', title:'El Manual que Nadie Lee (y Debería)',
        intro:'Antes de invertir en cualquier ETF debes entender su prospecto (KIID/KID). En 5 datos clave puedes saber si un ETF es adecuado para ti. Ignorar esto puede costarte miles de euros en comisiones ocultas o impuestos innecesarios.',
        bullets:[
          '💰 TER (Total Expense Ratio): el coste anual del fondo expresado en porcentaje. VWCE cobra 0,22%/año — sobre €10.000 son €22/año. Los ETFs baratos de índice suelen estar entre 0,03% y 0,25%. Los ETFs activos o temáticos pueden superar el 0,75%',
          '📏 Tracking Error (TE): mide cuánto varía la rentabilidad del ETF respecto a su índice año a año. Un TE bajo (0,05-0,20%) indica réplica precisa. Un TE alto puede significar peor gestión o activos difíciles de replicar',
          '📐 Tracking Difference (TD): la diferencia acumulada entre el ETF y su índice en un período. Es más relevante que el TER porque incluye costes de préstamo de valores, rebalanceo y dividendos. Un ETF puede tener TER del 0,15% pero TD de −0,05% (bate al índice gracias al préstamo de valores)',
          '🏛️ Domicilio fiscal — por qué Irlanda gana: los ETFs domiciliados en Irlanda (UCITS IE) aplican retención en origen del 15% sobre dividendos de acciones americanas (gracias al tratado Irlanda-EE.UU.). Los domiciliados en Luxemburgo aplican 30%. Para un inversor europeo con VWCE (IE), ahorra un 15% en la retención de dividendos americanos. Enorme a largo plazo',
          '🔬 Réplica física vs sintética: réplica física = el ETF compra las acciones reales del índice (más transparente, riesgo contraparte bajo). Réplica sintética = usa swaps con un banco para replicar la rentabilidad (más eficiente en algunos índices, pero riesgo contraparte). Para índices grandes como S&P 500 o MSCI World, la réplica física es preferible',
          '📦 Acumulación vs distribución: acumulación (ACC) = los dividendos se reinvierten automáticamente. Distribución (DIS) = los dividendos se pagan en efectivo. Para inversores en acumulación de patrimonio, ACC es más eficiente fiscalmente en España (difiere el pago de impuestos)',
          '🔍 Ejemplo real comparado: IWDA (iShares Core MSCI World, IE, física, ACC) TER 0,20% | VWCE (Vanguard FTSE All-World, IE, física, ACC) TER 0,22% | CSPX (iShares Core S&P 500, IE, física, ACC) TER 0,07%. Los tres están domiciliados en Irlanda — ventaja fiscal garantizada para inversor español',
        ],
        fact:'Diferencia real del domicilio en 30 años: supongamos €100.000 invertidos en un ETF con rentabilidad bruta del 10% anual y dividendos del 2%. ETF en Luxemburgo: retención 30% sobre dividendos = pagas 0,6% extra/año. En 30 años, eso equivale a perder ~€28.000 de rentabilidad adicional frente a un ETF equivalente domiciliado en Irlanda. El domicilio fiscal puede valer más que la diferencia de TER entre fondos.'},
      {type:'quiz', tag:'📋 Quiz', title:'Un ETF tiene TER 0,10% pero su Tracking Difference es +0,35%. ¿Qué significa esto?',
        opts:[
          {t:'El ETF es muy barato — el TER siempre refleja el coste real',                           ok:false},
          {t:'El ETF rinde un 0,35% peor que su índice por año, el coste real supera al TER declarado', ok:true},
          {t:'El TD positivo significa que el ETF supera al índice',                                  ok:false},
          {t:'Solo importa el TER para comparar ETFs entre sí',                                       ok:false},
        ],
        ok:'¡Correcto! La Tracking Difference mide el coste real total. Un TD de +0,35% significa que el ETF rinde un 0,35% peor que su índice al año — más del triple que su TER del 0,10%. Esto puede deberse a costes de rebalanceo, retenciones fiscales sobre dividendos o ineficiencias de gestión. Siempre mira el TD, no solo el TER.',
        bad:'El TER solo es uno de los costes. La Tracking Difference (TD) mide la diferencia real de rentabilidad entre el ETF y su índice, incluyendo TODOS los costes y beneficios. Un TD de +0,35% positivo significa que el fondo rinde 0,35% peor que el índice. Un TD negativo (el ETF supera al índice) puede darse por ingresos del préstamo de valores.'},
      {type:'final', xp:26, msg:'¡Analista de ETFs certificado! Ahora sabes interpretar TER, TD, TE, domicilio fiscal y tipo de réplica. Con esto, puedes comparar ETFs como un profesional y elegir el más eficiente para tu perfil.'},
    ],
  },

  // ─── M102: El sistema de pensiones español ─────────────────────
  {
    id:102, icon:'👴', title:'El Sistema de Pensiones Español: Lo que Tu Jubilación No Te Cuenta',
    desc:'Cómo se calculan los puntos, lagunas de cotización, brecha de pensión real y cuánto necesitas ahorrar por tu cuenta',
    xp:28, tag:'AVANZADO', tagC:'red', users:'14.600',
    steps:[
      {type:'content', tag:'👴 Módulo 102', title:'La Pensión Real que Te Espera',
        intro:'El sistema de pensiones español paga aproximadamente el 60-75% de tu último sueldo si has cotizado 37 años. Pero la realidad media es distinta: la pensión media en España en 2024 es de ~€1.150/mes. Si tu sueldo es de €2.500/mes, la brecha es €1.350/mes. Necesitas cubrirla tú.',
        bullets:[
          '📐 Cómo se calcula tu pensión: base reguladora = media de tus bases de cotización de los últimos 25 años (en 2024, ampliándose a 28 años en 2027). El porcentaje aplicado depende de los años cotizados: con 37 años cotizados = 100% de la base reguladora. Cada año menos reduce el porcentaje',
          '📅 Edad legal de jubilación 2024: 66 años y 6 meses (si cotizaste menos de 37,6 años) o 65 años (si cotizaste 37 años y 6 meses o más). La edad efectiva media real es 64,7 años por jubilaciones anticipadas',
          '⚠️ Lagunas de cotización: períodos sin cotización (desempleo, excedencia, trabajo en negro, estudios sin beca) reducen la base reguladora o crean ceros en el cálculo. Una laguna de 5 años en un período computado puede reducir la pensión un 10-20%. Los primeros 2 años de laguna se cubren con la última base; el resto, con el 50% del mínimo',
          '📊 La brecha real de pensión: los datos de la Seguridad Social 2024 muestran que la pensión contributiva media de jubilación es €1.361/mes. Con vida media de 20 años en pensión (jubilación a 67, fallecimiento ~87), necesitas cubrir el déficit mensual durante 240 meses',
          '🧮 Cuánto necesitas ahorrar (regla del 4%): si la brecha es €1.000/mes (€12.000/año), necesitas un patrimonio de €300.000 (€12.000 ÷ 4% = €300.000) para que tu cartera lo genere de forma sostenible durante 30 años',
          '⏰ Complemento de maternidad/paternidad: padres/madres con 2+ hijos tienen un complemento de pensión por brecha de género. Revisa tu vida laboral en la Seguridad Social (importass.es) para detectar lagunas antes de que sean irrecuperables',
          '📱 Herramientas oficiales: el Simulador de Pensiones de la Seguridad Social (tu vida laboral + importass.es) te da una estimación personalizada. Consúltalo cada 5 años para ajustar tu plan de ahorro complementario',
        ],
        fact:'Simulación real: trabajador español, 40 años, sueldo neto €2.200/mes, 15 años cotizados. Estimación de pensión: ~€900/mes (a 65 años con 37 años de cotización acumulados). Brecha respecto a su sueldo actual: €1.300/mes. Para cubrirla con la regla del 4% necesita €390.000 de patrimonio propio. Ahorrando €400/mes desde hoy al 7% anual, llega a €390.000 en exactamente 25 años. El plan de pensiones privado no es un lujo — es una necesidad matemática.'},
      {type:'quiz', tag:'👴 Quiz', title:'Una persona jubilada cobra €1.400/mes de pensión pero gastaba €2.200/mes con su último sueldo. ¿Cuánto patrimonio necesita para cubrir la brecha con la regla del 4%?',
        opts:[
          {t:'€96.000 — 800 × 12 × 10 años',                                                        ok:false},
          {t:'€240.000 — 800 × 12 × 25 años',                                                       ok:false},
          {t:'€240.000 — aplicando la regla del 4% sobre €9.600 anuales de brecha',                   ok:true},
          {t:'€480.000 — necesita cubrir 40 años como margen de seguridad',                           ok:false},
        ],
        ok:'¡Exacto! Brecha anual = (€2.200 − €1.400) × 12 = €9.600/año. Regla del 4%: €9.600 ÷ 0,04 = €240.000 de patrimonio necesario. Con ese capital invertido al 4% de retiro sostenible, puede cubrir la brecha durante 30+ años sin agotar el patrimonio.',
        bad:'La regla del 4% dice: patrimonio necesario = gasto anual ÷ 4%. Brecha mensual = €800, brecha anual = €9.600. Patrimonio = €9.600 ÷ 0,04 = €240.000. Esta es la cantidad que necesitas en cartera para retirar €9.600/año de forma sostenible durante 30 años sin agotar el capital (estadísticamente, con una cartera 60/40).'},
      {type:'final', xp:28, msg:'¡Planificador de jubilación experto! Ahora entiendes cómo se calcula la pensión española, qué es la brecha de pensión y cómo usar la regla del 4% para calcular exactamente cuánto patrimonio propio necesitas para jubilarte con tu nivel de vida actual.'},
    ],
  },
  {
    id:103, icon:'⏱️', title:'La Regla del 72 y los Atajos Matemáticos del Inversor',
    desc:'Los cálculos mentales que todo inversor debe dominar: doblar dinero, inflación, regla del 4% y más',
    xp:18, tag:'FUNDAMENTOS', tagC:'green', users:'9.800',
    steps:[
      {type:'content', tag:'⏱️ Módulo 103', title:'Matemáticas Rápidas para Inversores',
        intro:'No necesitas una hoja de cálculo para tomar buenas decisiones financieras. Con cuatro reglas mentales puedes estimar proyecciones en segundos y evitar errores costosos.',
        bullets:[
          '🔢 Regla del 72: divide 72 entre la rentabilidad anual y obtienes los años para doblar tu dinero. Al 6% → 72÷6 = 12 años. Al 9% → 8 años. Al 12% → 6 años. También funciona al revés: ¿cuánto rinde si quieres doblar en 8 años? → 72÷8 = 9% necesario',
          '📉 Regla del 72 para inflación: con IPC al 3%, el poder adquisitivo de tu dinero se reduce a la mitad en 72÷3 = 24 años. Con IPC al 6% (como en 2022), en solo 12 años. El dinero parado en cuenta corriente pierde valor silenciosamente',
          '🎯 Regla del 4% (tasa de retiro segura): puedes retirar el 4% de tu cartera cada año durante 30+ años sin agotar el capital (estudio Trinity, 1998, carteras 60/40). Tu número FIRE = gastos anuales ÷ 4% = gastos × 25. Con €20.000/año de gastos: necesitas €500.000',
          '💡 Regla del 1%: si un gasto recurrente vale más del 1% de tu sueldo mensual, merece análisis. Ejemplo: sueldo €2.000, streaming €12 = 0,6% — trivial. Coche €400/mes = 20% — impacta enormemente en tu capacidad de ahorro e inversión',
          '📊 Regla del 10/20: destina el 10% de tus ingresos a inversión a largo plazo y no acumules deudas de consumo por encima del 20% de tus ingresos netos mensuales. Sencillo, sostenible y efectivo para empezar',
          '🧮 Rentabilidad real = rentabilidad nominal − inflación. Un fondo que rinde 8% con inflación al 3% da rentabilidad real del 5%. Al evaluar inversiones, usa siempre la rentabilidad real para comparar periodos distintos',
        ],
        fact:'Ejemplo real: €200/mes durante 30 años al 7% anual = €240.000 (regla del 72: dobla cada 10 años). Los primeros €200/mes valen más que los últimos porque tienen más tiempo para crecer. Esto es el interés compuesto en acción.'},
      {type:'quiz', tag:'⏱️ Quiz', title:'Aplicas la regla del 72: tienes un ETF que rinde el 9% anual. ¿En cuántos años doblas tu inversión?',
        opts:[
          {t:'6 años — 72 ÷ 12 = 6',   ok:false},
          {t:'8 años — 72 ÷ 9 = 8',    ok:true},
          {t:'9 años — igual que el %', ok:false},
          {t:'18 años — 72 ÷ 4 = 18',  ok:false},
        ],
        ok:'¡Exacto! Regla del 72: años para doblar = 72 ÷ rentabilidad. Con 9% anual: 72 ÷ 9 = 8 años. Una inversión de €10.000 al 9% anual se convierte en €20.000 en 8 años, €40.000 en 16 y €80.000 en 24 sin aportar un euro más.',
        bad:'La regla del 72 dice: años para doblar = 72 ÷ rentabilidad anual. Con 9%: 72 ÷ 9 = 8 años. No es lineal — el dinero no tarda el mismo tiempo siempre. Es exponencial: cada periodo duplica lo anterior.'},
      {type:'final', xp:18, msg:'¡Calculadora mental financiera activada! Ahora dominas la regla del 72, la regla del 4% y los atajos que los inversores expertos usan para tomar decisiones rápidas y acertadas sin calculadora.'},
    ],
  },
  {
    id:104, icon:'⚔️', title:'Fondos Indexados vs Gestión Activa: La Batalla Definitiva',
    desc:'Por qué el 85% de los fondos activos pierde contra el índice a largo plazo y cómo elegir donde invertir',
    xp:22, tag:'INVERSIÓN', tagC:'blue', users:'18.200',
    steps:[
      {type:'content', tag:'⚔️ Módulo 104', title:'Gestión Activa vs Pasiva: Los Datos Reales',
        intro:'La industria de fondos de inversión gestiona billones de euros prometiendo batir al mercado. Los datos muestran una realidad muy distinta. Entender esta batalla te ahorrará comisiones y malos rendimientos.',
        bullets:[
          '📊 Los datos del SPIVA Report (S&P, 2024): el 85% de los fondos de gestión activa de renta variable europea NO supera a su índice de referencia en un periodo de 10 años, y el 92% no lo supera en 20 años. No es incompetencia — es matemática. El mercado es la suma de todos los participantes; no todos pueden batirlo',
          '💸 El coste importa más de lo que crees: un fondo activo cobra de media 1,5-2% TER anual. Un ETF indexado cobra 0,07-0,20%. Diferencia: ~1,5% anual. Sobre €50.000 durante 30 años al 7% → el fondo activo te deja con €105.000 menos por comisiones puras. John Bogle (fundador de Vanguard) lo llamó "el coste del coste"',
          '🎯 ¿Por qué tan pocos gestores baten al mercado? (1) Sus propias comisiones son un lastre matemático ineludible. (2) El mercado ya descuenta toda la información pública — la ventaja informacional es casi imposible. (3) Los que baten al índice en 5 años rara vez lo hacen en los siguientes 5 (datos SPIVA: persistencia de los top-gestores = casi cero)',
          '✅ Cuándo puede tener sentido la gestión activa: mercados poco eficientes (small caps, mercados emergentes, deuda corporativa high yield), horizontes muy cortos, necesidad de estrategias con baja correlación con el mercado (alternative investments). Para el 95% de inversores particulares: no aplica',
          '🏆 La cartera índice básica del inversor español medio: 70% MSCI World (IWDA/VWCE) + 30% bonos o liquidez según horizonte. TER total: ~0,15%. Rebalanceo anual. Históricamente superior al 85% de fondos activos sin ningún esfuerzo ni conocimiento especial',
          '⚠️ El sesgo de supervivencia: cuando ves estadísticas de fondos, los fondos que cerraron o se fusionaron por mal rendimiento ya no aparecen. La realidad es aún peor que las estadísticas oficiales. Solo sobreviven los (pocos) que funcionaron — y los sesgamos como representativos',
        ],
        fact:'Caso real: el fondo de inversión activo más popular en España con 20 años de historia tiene rentabilidad anualizada del 4,8%. El MSCI World en el mismo periodo: 9,1% anualizado. Diferencia acumulada sobre €50.000: €178.000. La gestión activa cobró €126.000 de TER y rindió €52.000 menos que el índice. Total destrucción de valor: €178.000.'},
      {type:'quiz', tag:'⚔️ Quiz', title:'Un fondo activo cobra 1,8% TER y un ETF indexado cobra 0,15% TER. ¿Cuánto dinero adicional pierde el fondo activo sobre €30.000 en 20 años asumiendo la misma rentabilidad bruta del 7%?',
        opts:[
          {t:'Unos €2.000 — la diferencia de comisión es pequeña',  ok:false},
          {t:'Unos €18.000 — el coste se acumula enormemente',      ok:true},
          {t:'Exactamente €10.800 — 1,65% × 30.000 × 20 años',     ok:false},
          {t:'Solo €4.500 — menos del 15% del capital inicial',     ok:false},
        ],
        ok:'¡Correcto! El impacto del TER es brutal por el interés compuesto. €30.000 al 7% bruto durante 20 años = €116.000 (ETF 0,15%) vs €97.000 (fondo 1,80%). Diferencia: ~€19.000. La comisión anual del 1,65% no "resta" €495/año — ese dinero no crece, y la pérdida se multiplica con el tiempo.',
        bad:'Las comisiones no son lineales — se aplican sobre un capital que crece. 1,65% de diferencia en TER sobre €30.000 durante 20 años representa ~€18.000-20.000 menos en tu cartera final. Este es el verdadero coste oculto de la gestión activa cara.'},
      {type:'final', xp:22, msg:'¡Inversor ilustrado! Ahora entiendes por qué los datos apoyan la inversión indexada de bajo coste para la mayoría de inversores, cómo funcionan las comisiones compuestas y cuándo (raramente) puede tener sentido la gestión activa.'},
    ],
  },
  {
    id:105, icon:'📊', title:'El Presupuesto 50/30/20: Tu Primer Sistema de Finanzas Personales',
    desc:'La regla más sencilla y efectiva para organizar tus finanzas sin hojas de cálculo complicadas',
    xp:16, tag:'FUNDAMENTOS', tagC:'green', users:'23.400',
    steps:[
      {type:'content', tag:'📊 Módulo 105', title:'50/30/20: El Sistema que Sí Funciona',
        intro:'Elizabeth Warren (senadora y profesora de Harvard) popularizó en su libro "All Your Worth" (2005) la regla 50/30/20. Veinte años después, sigue siendo el sistema más recomendado por planificadores financieros para quienes empiezan a organizar su dinero.',
        bullets:[
          '🏠 50% — Necesidades (gastos fijos inamovibles): alquiler o hipoteca, alimentación básica, transporte al trabajo, facturas (luz, agua, internet), seguros obligatorios, mínimo de deudas. Si este bloque supera el 50% de tu neto, tienes un problema estructural: o tus ingresos son bajos o tu estilo de vida es demasiado caro para lo que ganas',
          '🎭 30% — Deseos (calidad de vida): restaurantes, viajes, ocio, ropa no esencial, suscripciones de entretenimiento, gym, hobbies. Este bloque no es "malo" — es lo que hace que el dinero valga la pena. Pero si comes el 40-50%, machaca tu capacidad de ahorro sin que te des cuenta',
          '💰 20% — Ahorro e inversión: dividido en tres sub-cubos: fondo de emergencia (3-6 meses de gastos) → amortización de deudas caras (>5% interés) → inversión a largo plazo (ETFs, plan de pensiones, etc.). Este 20% es el que construye tu patrimonio. Sin él, siempre estás a un imprevisto de la ruina financiera',
          '🇪🇸 Adaptación española real: con sueldo neto €1.600/mes → Necesidades: €800 (alquiler €650 + suministros €150), Deseos: €480 (ocio, restaurantes, ropa), Ahorro/inversión: €320 (150 fondo emergencia + 170 ETF). Parece poco, pero €170/mes al 7% anual durante 20 años = €87.000',
          '⚡ La variante 50/20/30 para aceleradores: si quieres FIRE o tienes deudas altas, voltea los dos últimos bloques — 50% necesidades, 20% deseos, 30% ahorro. El sacrificio en deseos durante 5-10 años puede comprimir 20 años del camino a la independencia financiera',
          '🔧 Cómo empezar en 3 pasos: (1) calcula tu neto mensual real (lo que llega a tu cuenta), (2) lista todos tus gastos del último mes y clasifícalos en N/D/A, (3) compara con los porcentajes objetivo y ajusta 1 bloque por mes. No necesitas app ni hoja de cálculo — una nota en el móvil es suficiente',
        ],
        fact:'Dato real: el gasto medio en suscripciones digitales de un español en 2024 supera €85/mes (Netflix, Spotify, Amazon Prime, Disney+, apps, etc.). Con sueldo neto de €1.800, eso representa casi el 5% del neto — solo en entretenimiento digital. Auditarlo cada trimestre suele liberar €30-50/mes para ahorro sin sentir el cambio.'},
      {type:'quiz', tag:'📊 Quiz', title:'Carmen gana €2.000 netos/mes. Según la regla 50/30/20, ¿cuánto debería destinar mensualmente a ahorro e inversión?',
        opts:[
          {t:'€200 — el 10%, es más realista para empezar',  ok:false},
          {t:'€400 — el 20% del sueldo neto',                ok:true},
          {t:'€600 — el 30% para llegar antes a FIRE',       ok:false},
          {t:'Lo que sobre después de pagar todo',           ok:false},
        ],
        ok:'¡Exacto! El 20% de €2.000 = €400/mes para ahorro e inversión. La regla 50/30/20 no dice "ahorra lo que sobre" — asigna el ahorro primero (pago automático a cuenta de inversión el día de cobro) y vives con el resto. Ese €400/mes al 7% durante 25 años = €324.000.',
        bad:'La regla 50/30/20 asigna el 20% a ahorro e inversión: 20% × €2.000 = €400/mes. El error más común es "ahorrar lo que sobre" — casi siempre el resultado es €0. El sistema funciona porque asigna el ahorro primero, como si fuera un gasto fijo más.'},
      {type:'final', xp:16, msg:'¡Sistema activado! Con la regla 50/30/20 tienes un marco sencillo y efectivo para organizar tus finanzas sin complejidad. Empieza este mes: calcula tu neto, lista tus gastos, clasifícalos y ajusta un bloque.'},
    ],
  },
]


// ═══ DATA — Bolsa, carreras, negocios ═══
/* ══════════════════════════════════════════════════════════════════
   data-game.js — Datos de Juego FinLearn
   ─ STOCKS        → acciones y ETFs del simulador de cartera
   ─ CAREERS       → carreras del simulador de vida (junior/senior/entrepreneur)
   ─ BUSINESSES    → negocios comprables en el simulador
   ─ LIFE_EVENTS   → decisiones del simulador de vida
   ─ BLACK_SWAN_EVENTS → crashs históricos para la sección educativa
   ─ Sin dependencias externas.
══════════════════════════════════════════════════════════════════ */

const STOCKS = [
  // ── ACTIVOS DESTACADOS (los 4 pedidos) ─────────────────
  {
    ticker:'VUSA', name:'Vanguard S&P 500', icon:'🇺🇸',
    bg:'#000f1a', sector:'etf', group:'etf', exchange:'LSE',
    price:480.20,
    dividendYield:1.3, per:22, featured:true,
    annualReturn:0.10,       // 10 % — media histórica S&P 500 durante 100 años
    annualVolatility:0.15,   // 15 % — volatilidad histórica del índice
    description:'Las 500 mayores empresas de EE.UU. TER 0.07%. El activo más estudiado de la historia de las finanzas.',
    fundamentals:{eps:21.8, pb:4.2, market:'35B USD', beta:1.0},
    historicalNote:'Dato real: +10% anual nominal / +7% real (sin inflación) — últimos 100 años',
  },
  {
    ticker:'AAPL', name:'Apple Inc.', icon:'🍎',
    bg:'#1a1a2e', sector:'tech', group:'usa', exchange:'NASDAQ',
    price:182.50,
    dividendYield:0.5, per:28, featured:true,
    annualReturn:0.28,       // 28 % — retorno anualizado 2014-2024
    annualVolatility:0.28,   // 28 % — volatilidad histórica
    description:'El fabricante del iPhone, Mac y servicios digitales. Primera empresa en superar los 3 billones de dólares de capitalización.',
    fundamentals:{eps:6.52, pb:45, market:'2.8T USD', beta:1.2},
    historicalNote:'Dato real: +28% anual últimos 10 años — el retorno pasado no garantiza el futuro',
  },
  {
    ticker:'BTC', name:'Bitcoin', icon:'₿',
    bg:'#1a0f00', sector:'crypto', group:'crypto', exchange:'—',
    price:62000,
    dividendYield:0, per:0, featured:true, isCrypto:true,
    annualReturn:0.50,       // ~50 % retorno geométrico histórico 2014-2024
    annualVolatility:0.80,   // 80 % — volatilidad real (caídas del 80 % × 3)
    description:'Primera criptomoneda. Oferta máxima de 21 millones de unidades programada matemáticamente. Halving cada 4 años.',
    fundamentals:{eps:0, pb:0, market:'1.2T USD', beta:3.5},
    historicalNote:'Dato real: +50% anual 10 años — con 3 crashes del 80%+. Solo inviertes lo que puedes perder.',
  },
  {
    ticker:'GOLD', name:'Oro (XAU/EUR)', icon:'🥇',
    bg:'#1a1500', sector:'commodity', group:'commodity', exchange:'SPOT',
    price:1870,
    dividendYield:0, per:0, featured:true,
    annualReturn:0.08,       // ~8 % últimos 20 años — superior al largo plazo histórico (5%)
    annualVolatility:0.12,   // 12 % — baja volatilidad, activo refugio
    description:'El activo refugio por excelencia durante 5.000 años. Protección frente a inflación, crisis bancarias y pérdida de valor de las monedas fiduciarias.',
    fundamentals:{eps:0, pb:0, market:'14T USD', beta:-0.1},
    historicalNote:'Dato real: +8% anual 2004-2024 — correlación negativa con renta variable en crisis',
  },

  // ── TECNOLOGÍA ──────────────────────────────────────────
  {ticker:'MSFT', name:'Microsoft',       icon:'🪟', bg:'#001a2e', sector:'tech',    group:'usa',    exchange:'NASDAQ', price:374.0,  dividendYield:0.8, per:35, annualReturn:0.30, annualVolatility:0.22, description:'Líder en cloud (Azure), software empresarial y gaming. Copilot AI transformando toda su suite.',          fundamentals:{eps:10.68, pb:14,  market:'2.8T USD', beta:0.9}},
  {ticker:'GOOGL', name:'Alphabet',       icon:'🔍', bg:'#1a2010', sector:'tech',    group:'usa',    exchange:'NASDAQ', price:141.8,  dividendYield:0,   per:25, annualReturn:0.20, annualVolatility:0.24, description:'Google: el buscador más usado del mundo + YouTube + Cloud + DeepMind AI.',                               fundamentals:{eps:5.68,  pb:6.5, market:'1.8T USD', beta:1.1}},
  {ticker:'NVDA',  name:'NVIDIA',         icon:'🎮', bg:'#0d1a0d', sector:'tech',    group:'usa',    exchange:'NASDAQ', price:495.0,  dividendYield:0.1, per:65, annualReturn:0.60, annualVolatility:0.55, description:'GPUs para gaming e IA. Sus chips H100 son la base del boom de inteligencia artificial.',               fundamentals:{eps:7.62,  pb:35,  market:'1.2T USD', beta:1.7}},
  {ticker:'TSLA',  name:'Tesla',          icon:'⚡', bg:'#1a0000', sector:'tech',    group:'usa',    exchange:'NASDAQ', price:248.0,  dividendYield:0,   per:75, annualReturn:0.30, annualVolatility:0.65, description:'Coches eléctricos, energía solar y almacenamiento. Alta volatilidad — puede moverse ±20% en días.',   fundamentals:{eps:3.31,  pb:12,  market:'790B USD', beta:2.1}},

  // ── ETFs ────────────────────────────────────────────────
  {ticker:'IWDA',  name:'iShares MSCI World', icon:'🌍', bg:'#001020', sector:'etf', group:'etf', exchange:'LSE',  price:89.4,   dividendYield:1.4, per:20, annualReturn:0.09, annualVolatility:0.14, description:'1.600 empresas de 23 países desarrollados. El ETF global más popular entre inversores europeos. TER 0.20%.', fundamentals:{eps:4.47, pb:2.8, market:'60B USD', beta:1.0}},
  {ticker:'EQQQ',  name:'Nasdaq 100 ETF',     icon:'💻', bg:'#0d0020', sector:'etf', group:'etf', exchange:'LSE',  price:446.2,  dividendYield:0.4, per:30, annualReturn:0.15, annualVolatility:0.20, description:'Las 100 mayores tecnológicas del Nasdaq. Alta concentración en Apple, Microsoft y NVIDIA.',               fundamentals:{eps:14.87, pb:8.1, market:'25B USD', beta:1.2}},

  // ── IBEX 35 ─────────────────────────────────────────────
  {ticker:'SAN',   name:'Banco Santander', icon:'🏦', bg:'#1a0010', sector:'ibex', group:'ibex', exchange:'BME', price:3.82,  dividendYield:6.2, per:6,  annualReturn:0.05, annualVolatility:0.25, description:'Mayor banco de la zona euro. Fuerte en América Latina y UK.',                                       fundamentals:{eps:0.64, pb:0.7, market:'65B EUR',  beta:1.4}},
  {ticker:'ITX',   name:'Inditex / Zara',  icon:'👗', bg:'#1a1a00', sector:'ibex', group:'ibex', exchange:'BME', price:38.5,  dividendYield:3.4, per:24, annualReturn:0.12, annualVolatility:0.18, description:'El mayor grupo textil del mundo. Propietario de Zara, Massimo Dutti, Bershka y 7 marcas más.',   fundamentals:{eps:1.60, pb:8.5, market:'120B EUR', beta:0.9}},
  {ticker:'IBE',   name:'Iberdrola',        icon:'🔋', bg:'#001a10', sector:'ibex', group:'ibex', exchange:'BME', price:11.8,  dividendYield:4.5, per:18, annualReturn:0.08, annualVolatility:0.16, description:'Líder mundial en energía renovable. Eólica, solar e hidroeléctrica en 30+ países.',              fundamentals:{eps:0.65, pb:1.8, market:'75B EUR',  beta:0.7}},
  {ticker:'TEF',   name:'Telefónica',       icon:'📱', bg:'#00001a', sector:'ibex', group:'ibex', exchange:'BME', price:3.95,  dividendYield:7.8, per:10, annualReturn:0.02, annualVolatility:0.20, description:'Operadora en España, Alemania, Brasil y Reino Unido. Alto dividendo.',                           fundamentals:{eps:0.39, pb:0.9, market:'22B EUR',  beta:0.8}},

  // ── EE.UU. ───────────────────────────────────────────────
  {ticker:'JNJ',   name:'Johnson & Johnson',  icon:'💊', bg:'#1a0000', sector:'health',  group:'usa',    exchange:'NYSE', price:152.0, dividendYield:3.1, per:15, annualReturn:0.08, annualVolatility:0.12, description:'Farmacéutica y dispositivos médicos. Dividendo creciente 60+ años (Dividend King).',           fundamentals:{eps:10.13, pb:5.2, market:'370B USD', beta:0.6}},
  {ticker:'BRK',   name:'Berkshire Hathaway', icon:'🎩', bg:'#1a0f00', sector:'usa',    group:'usa',    exchange:'NYSE', price:372.0, dividendYield:0,   per:21, annualReturn:0.10, annualVolatility:0.15, description:'Conglomerado de Warren Buffett. 50+ empresas subsidiarias + cartera de $350B en acciones.',  fundamentals:{eps:17.7,  pb:1.5, market:'800B USD', beta:0.8}},
  {ticker:'LVMH',  name:'LVMH Moët Hennessy', icon:'💎', bg:'#1a0020', sector:'europe', group:'europe', exchange:'PAR', price:722.0, dividendYield:1.8, per:22, annualReturn:0.18, annualVolatility:0.20, description:'El mayor grupo de lujo del mundo. Louis Vuitton, Dior, Tiffany, Moët & Chandon.',              fundamentals:{eps:32.8,  pb:5.0, market:'360B EUR', beta:0.9}},

  // ── CRYPTO ───────────────────────────────────────────────
  {ticker:'ETH',   name:'Ethereum',           icon:'🔷', bg:'#001020', sector:'crypto', group:'crypto', exchange:'—', price:2850, dividendYield:0, per:0, isCrypto:true, annualReturn:0.60, annualVolatility:0.90, description:'Plataforma de contratos inteligentes. Base de DeFi, NFTs y Web3. Lanzada en 2015.', fundamentals:{eps:0, pb:0, market:'340B USD', beta:3.2}},

  // ── SALUD Y FARMA ───────────────────────────────────────
  {ticker:'NVO',   name:'Novo Nordisk',      icon:'💉', bg:'#001a10', sector:'health', group:'europe', exchange:'CPH',   price:128.0, dividendYield:1.1, per:32, annualReturn:0.28, annualVolatility:0.30, description:'Líder mundial en diabetes y obesidad. Ozempic/Wegovy cambiando la medicina moderna.', fundamentals:{eps:4.0, pb:24, market:'580B EUR', beta:0.7}},
  {ticker:'PFE',   name:'Pfizer',            icon:'🔬', bg:'#00001a', sector:'health', group:'usa',    exchange:'NYSE',  price:27.5,  dividendYield:6.8, per:12, annualReturn:0.04, annualVolatility:0.22, description:'Gigante farmacéutico global. Alto dividendo, pipeline amplio. Creador de la vacuna COVID mRNA.', fundamentals:{eps:2.29, pb:1.8, market:'155B USD', beta:0.6}},

  // ── CONSUMO DEFENSIVO ────────────────────────────────────
  {ticker:'NESN',  name:'Nestlé',            icon:'☕', bg:'#1a0f00', sector:'consumer', group:'europe', exchange:'SIX', price:94.5,  dividendYield:3.2, per:20, annualReturn:0.07, annualVolatility:0.13, description:'El mayor grupo de alimentación del mundo. Nespresso, KitKat, Maggi. Dividendo creciente 25+ años.', fundamentals:{eps:4.72, pb:5.5, market:'245B CHF', beta:0.5}},
  {ticker:'KO',    name:'Coca-Cola',         icon:'🥤', bg:'#1a0000', sector:'consumer', group:'usa',    exchange:'NYSE',price:61.2,  dividendYield:3.1, per:24, annualReturn:0.09, annualVolatility:0.14, description:'200 países, 500 marcas. Dividend King con 62 años consecutivos de aumento de dividendo.', fundamentals:{eps:2.55, pb:10, market:'265B USD', beta:0.6}},

  // ── ENERGÍA ──────────────────────────────────────────────
  {ticker:'SHEL',  name:'Shell',             icon:'🛢️', bg:'#1a1500', sector:'energy', group:'europe', exchange:'LSE',  price:28.4,  dividendYield:4.2, per:9,  annualReturn:0.08, annualVolatility:0.25, description:'Supermajor energético global. Petróleo, gas natural y transición a renovables.', fundamentals:{eps:3.16, pb:1.1, market:'210B USD', beta:0.7}},

  // ── INMOBILIARIO / REITs ─────────────────────────────────
  {ticker:'VICI',  name:'VICI Properties',   icon:'🎰', bg:'#1a1000', sector:'reit', group:'usa', exchange:'NYSE',   price:31.8,  dividendYield:5.8, per:15, annualReturn:0.12, annualVolatility:0.18, description:'REIT de casinos y entretenimiento. Propietario de Caesars Palace y MGM Grand Las Vegas.', fundamentals:{eps:2.12, pb:1.8, market:'33B USD', beta:0.9}},

  // ── ETFs ADICIONALES ─────────────────────────────────────
  {ticker:'EMIM',  name:'iShares MSCI EM',   icon:'🌏', bg:'#001010', sector:'etf', group:'etf', exchange:'LSE',     price:29.8,  dividendYield:2.8, per:13, annualReturn:0.07, annualVolatility:0.20, description:'2.000 empresas emergentes: China, India, Brasil, Corea. Diversificación global real. TER 0.18%.', fundamentals:{eps:2.29, pb:1.7, market:'18B USD', beta:1.1}},
  {ticker:'XDWD',  name:'Xtrackers MSCI World', icon:'🗺️', bg:'#000a1a', sector:'etf', group:'etf', exchange:'XETRA',price:104.2, dividendYield:1.6, per:19, annualReturn:0.10, annualVolatility:0.14, description:'1.600 empresas de países desarrollados. Alternativa a IWDA con TER 0.19%. Acumulación.', fundamentals:{eps:5.49, pb:2.9, market:'12B USD', beta:1.0}},

  // ── TECNOLOGÍA ADICIONAL ─────────────────────────────────
  {ticker:'META',  name:'Meta Platforms',    icon:'📘', bg:'#00001a', sector:'tech', group:'usa', exchange:'NASDAQ', price:487.0, dividendYield:0.4, per:26, annualReturn:0.35, annualVolatility:0.38, description:'Facebook, Instagram, WhatsApp y Quest VR. 3.200M usuarios diarios activos.', fundamentals:{eps:18.73, pb:8.5, market:'1.2T USD', beta:1.3}},
  {ticker:'AMZN',  name:'Amazon',            icon:'📦', bg:'#1a1000', sector:'tech', group:'usa', exchange:'NASDAQ', price:185.0, dividendYield:0,   per:44, annualReturn:0.25, annualVolatility:0.32, description:'E-commerce + AWS (cloud líder mundial) + Prime + Ads. El negocio de cloud crece al 20% anual.', fundamentals:{eps:4.21, pb:8.2, market:'1.9T USD', beta:1.2}},

  // ── IBEX ADICIONAL ───────────────────────────────────────
  {ticker:'REP',   name:'Repsol',            icon:'⛽', bg:'#1a0a00', sector:'ibex', group:'ibex', exchange:'BME',    price:14.2,  dividendYield:6.1, per:7,  annualReturn:0.06, annualVolatility:0.22, description:'Multinacional energética española. Petróleo, gas y transición energética. Alto dividendo.', fundamentals:{eps:2.03, pb:0.8, market:'17B EUR', beta:0.9}},
  {ticker:'AMS',   name:'Amadeus IT',        icon:'✈️', bg:'#001020', sector:'ibex', group:'ibex', exchange:'BME',    price:67.8,  dividendYield:1.8, per:25, annualReturn:0.11, annualVolatility:0.25, description:'Líder mundial en tecnología para el sector turístico. Reservas de vuelos, hoteles y sistemas GDS.', fundamentals:{eps:2.71, pb:5.0, market:'30B EUR', beta:1.1}},
];

const CAREERS = [
  {
    id: 'intern',
    icon: '🎓',
    title: 'Becario',
    subtitle: 'El comienzo de todo',
    salary: 900,
    salaryRange: '€700 – €1.100/mes',
    lifestyleExtra: 0,
    xpRequired: 0,
    description: 'Prácticas remuneradas. Poco dinero pero invaluable para aprender y construir red de contactos. El momento de meter el 100% del sueldo en un fondo de emergencia.',
    pros: ['Sin responsabilidades', 'Aprendizaje brutal', 'Tiempo para estudiar'],
    cons: ['Sueldo de supervivencia', 'Sin estabilidad', 'Depende de que te contraten'],
    color: '#94a3b8',
    tasks: ['Preparar informes', 'Analizar datos', 'Apoyar al equipo'],
    lesson: 'Un becario que invierte €100/mes durante 40 años acaba con más dinero que un directivo que empieza a invertir a los 45.',
  },
  {
    id: 'junior',
    icon: '🌱',
    title: 'Junior / Empleado',
    subtitle: 'El punto de partida',
    salary: 1800,
    salaryRange: '€1.200 – €2.400/mes',
    lifestyleExtra: 0,
    xpRequired: 100,
    description: 'Sueldo predecible y estable. Mucho tiempo libre para aprender y construir el colchón financiero. El momento de automatizar el ahorro.',
    pros: ['Sueldo garantizado cada mes', 'Tiempo para invertir y aprender', 'Sin estrés operativo'],
    cons: ['Crecimiento lento', 'Techo salarial bajo', 'Dependes de un solo empleador'],
    color: 'var(--accent)',
    tasks: ['Gestionar proyectos', 'Presentaciones', 'Análisis de mercado'],
    lesson: 'Con un sueldo junior puedes construir riqueza si controlas los gastos. El 20% de ahorro es no negociable.',
  },
  {
    id: 'specialist',
    icon: '🔧',
    title: 'Especialista',
    subtitle: 'Experto en tu área',
    salary: 2800,
    salaryRange: '€2.200 – €3.800/mes',
    lifestyleExtra: 300,
    xpRequired: 350,
    description: 'Tu expertise tiene valor de mercado. Puedes freelancear, cobrar por consultoría puntual y negociar subidas. El lifestyle empieza a subir ligeramente.',
    pros: ['Mercado laboral fuerte', 'Freelance posible', 'Conocimiento diferencial'],
    cons: ['Primer golpe del lifestyle creep', 'Zona de confort peligrosa', 'Sin gestión de equipos'],
    color: '#38bdf8',
    tasks: ['Consultoría técnica', 'Formación interna', 'Auditorías'],
    lesson: 'El especialista que aprende a vender sus servicios multiplica su sueldo por 3 sin cambiar de empresa.',
  },
  {
    id: 'senior',
    icon: '💼',
    title: 'Senior / Manager',
    subtitle: 'Más dinero, más tentaciones',
    salary: 3800,
    salaryRange: '€3.000 – €6.000/mes',
    lifestyleExtra: 900,
    xpRequired: 500,
    description: 'Sueldo alto, pero el estilo de vida escala automáticamente. La trampa del "me lo merezco": el coche nuevo, el piso más grande, las vacaciones premium.',
    pros: ['Sueldo 2× mayor', 'Más opciones de inversión', 'Red de contactos premium'],
    cons: ['Gastos de estilo de vida +€900/mes', 'Más estrés y menos tiempo', 'Lifestyle creep difícil de revertir'],
    unlocks: ['saas', 'solar'],
    color: 'var(--accent2)',
    tasks: ['Liderar equipos', 'P&L management', 'Negociaciones clave'],
    lesson: '⚠️ Lifestyle creep: cuando el sueldo sube un 30% pero los gastos suben un 50%, en realidad eres más pobre.',
  },
  {
    id: 'director',
    icon: '🏛️',
    title: 'Director / VP',
    subtitle: 'Alto ejecutivo',
    salary: 7500,
    salaryRange: '€5.500 – €12.000/mes',
    lifestyleExtra: 2200,
    xpRequired: 1000,
    description: 'Bonus, stock options, coche de empresa. El sueldo es transformacional pero los impuestos y el estilo de vida se comen una parte enorme. Aquí empieza la planificación fiscal.',
    pros: ['Bonus anuales 2x-5x salario', 'Stock options', 'Influencia real en la empresa'],
    cons: ['IRPF marginal >45%', 'Lifestyle brutal: €2.200/mes extra', 'Alta exposición a despido'],
    unlocks: ['saas', 'solar', 'rental'],
    color: '#f0b429',
    tasks: ['Estrategia corporativa', 'Fusiones y adquisiciones', 'Board presentations'],
    lesson: 'A este nivel, la planificación fiscal (SL, EPSV, planes de pensiones) puede ahorrarte €20.000/año en impuestos.',
  },
  {
    id: 'clevel',
    icon: '👑',
    title: 'C-Level / CEO',
    subtitle: 'La cima del asalariado',
    salary: 18000,
    salaryRange: '€10.000 – €30.000/mes',
    lifestyleExtra: 5000,
    xpRequired: 2000,
    description: 'Máxima responsabilidad, máximo sueldo. Pero el estilo de vida C-Level es monstruoso: guardaespaldas, club de golf, jets privados ocasionales. El 80% del patrimonio debe estar invertido.',
    pros: ['Sueldo transformacional', 'Participación en beneficios', 'Acceso a inversiones privadas (PE, VC)'],
    cons: ['€5.000/mes en lifestyle obligatorio', 'Escrutinio máximo', 'Media de permanencia: 4 años'],
    unlocks: ['saas', 'solar', 'rental', 'lav', 'vend'],
    color: '#f43f5e',
    tasks: ['Visión estratégica', 'Capital allocation', 'Gestión de crisis'],
    lesson: 'El CEO que no invierte el 70% de su sueldo acaba sin nada cuando le despiden. El efectivo de un C-Level se evapora en 2 años si no trabaja.',
  },
  {
    id: 'entrepreneur',
    icon: '🚀',
    title: 'Emprendedor',
    subtitle: 'Alto riesgo, alto potencial',
    salary: 0,
    salaryRange: '€0 – €8.000/mes (variable)',
    lifestyleExtra: 400,
    xpRequired: 1500,
    description: 'Sin sueldo fijo. Algunos meses son brillantes, otros devastadores. El runway (meses de gastos ahorrados) es tu única red de seguridad. Desbloquea los negocios de mayor ROI.',
    pros: ['Potencial ilimitado', 'Desbloquea todos los negocios', 'Control total de tu tiempo'],
    cons: ['Sin sueldo garantizado', 'Alta incertidumbre mensual', 'Requiere fondo de emergencia sólido'],
    unlocks: ['rental', 'lav', 'vend'],
    color: '#a78bfa',
    tasks: ['Pitch a inversores', 'Product-market fit', 'Team building'],
    lesson: '💡 Los emprendedores exitosos mantienen 12 meses de gastos en efectivo antes de lanzarse.',
  },
  {
    id: 'investor',
    icon: '🏦',
    title: 'Inversor / Rentista',
    subtitle: 'El dinero trabaja para ti',
    salary: 0,
    salaryRange: 'Ingresos pasivos: €1.000 – €50.000+/mes',
    lifestyleExtra: 1500,
    xpRequired: 3000,
    description: 'Has alcanzado la independencia financiera. Vives de dividendos, rentas y plusvalías. No necesitas trabajar pero sigues tomando decisiones de inversión de alto impacto.',
    pros: ['Libertad total de tiempo', 'Ingresos escalables sin límite', 'Acceso a club deals y private equity'],
    cons: ['Aislamiento social posible', 'Gestión fiscal compleja', 'Riesgo de inflación en activos'],
    unlocks: ['rental', 'lav', 'vend', 'saas', 'solar'],
    color: '#00e5a0',
    tasks: ['Deal flow', 'Due diligence', 'Portfolio rebalancing'],
    lesson: 'La regla del 4%: si tienes €1.000.000 invertidos, puedes retirar €40.000/año indefinidamente.',
  },
];


/* ══════════════════════════════════════════════════════════════════
   CAREER EVENTS — Aparecen cada ~60 días de juego
   ─────────────────────────────────────────────────────────────────
   Cada evento tiene:
   · trigger: función que decide si puede aparecer según el estado
   · choices: array de decisiones, cada una con efectos en S
   · Solo aparece si el usuario tiene userName (ha hecho onboarding)
   · Solo se muestra cada evento UNA vez (guardado en S.seenCareerEvents)
══════════════════════════════════════════════════════════════════ */
const CAREER_EVENTS = [
  {
    id: 'negotiate_raise',
    icon: '💼',
    title: '¡Oportunidad de negociación!',
    desc: 'Tu empresa está contenta con tu trabajo. Es el momento de pedir un aumento. ¿Cómo lo planteas?',
    trigger: s => (s.career || 'junior') !== 'entrepreneur' && s.completedMods.length >= 3,
    choices: [
      {
        label: '📊 Con datos y métricas',
        desc: 'Preparas una presentación con tus logros medibles y benchmarks del sector.',
        effect: s => { s.lifeSalary = Math.round((s.lifeSalary || 1800) * 1.18); s.xp += 150; },
        result: '🎉 +18% de sueldo. Los datos convencen. +150 XP',
        type: 'positive',
      },
      {
        label: '🤝 Pidiendo directamente',
        desc: 'Vas al despacho de tu jefe y pides un aumento sin preparación previa.',
        effect: s => { s.lifeSalary = Math.round((s.lifeSalary || 1800) * 1.07); s.xp += 50; },
        result: '👍 +7% de sueldo. Funciona, pero podrías haber conseguido más. +50 XP',
        type: 'neutral',
      },
      {
        label: '😰 No hago nada',
        desc: 'La inflación erosiona tu sueldo real sin decir nada.',
        effect: s => { s.lifeSalary = Math.round((s.lifeSalary || 1800) * 0.97); },
        result: '📉 Tu sueldo real baja un 3% por la inflación. El silencio es caro.',
        type: 'negative',
      },
    ],
    lesson: '💡 Los profesionales que negocian activamente ganan un 18% más a lo largo de su carrera que los que esperan a que les suban solos.',
  },
  {
    id: 'side_project',
    icon: '🚀',
    title: 'Una idea de proyecto paralelo',
    desc: 'Se te ocurre una idea de negocio pequeño que podrías lanzar en tus horas libres. ¿Qué haces?',
    trigger: s => s.completedMods.length >= 5,
    choices: [
      {
        label: '⚡ Lo lanzas ahora, mínimo viable',
        desc: 'Dedicas 10h/semana a lanzar una versión simple lo antes posible.',
        effect: s => {
          s.cash    = (s.cash    || 0) + 800;
          s.xp     += 200;
          s.streak  = Math.max(s.streak, 5);
        },
        result: '🎉 +€800 primer mes, +200 XP. Primer ingreso como emprendedor.',
        type: 'positive',
      },
      {
        label: '📚 Estudias más antes de lanzar',
        desc: 'Completas 3 módulos más de FinLearn antes de empezar.',
        effect: s => { s.xp += 300; },
        result: '📚 +300 XP. Más preparado, pero el tiempo también cuesta.',
        type: 'neutral',
      },
      {
        label: '🛋️ Esperas al momento perfecto',
        desc: 'El momento perfecto nunca llega.',
        effect: s => {},
        result: '⏰ Sin cambios. El peor enemigo del emprendimiento es la espera perfecta.',
        type: 'negative',
      },
    ],
    lesson: '💡 El 90% de los proyectos fracasan por no empezar, no por empezar mal. Un MVP en 2 semanas enseña más que 6 meses de planificación.',
  },
  {
    id: 'job_offer',
    icon: '📨',
    title: 'Oferta de otra empresa',
    desc: 'Un headhunter te ofrece un puesto con +30% de sueldo pero más horas y más estrés. ¿Qué decides?',
    trigger: s => (s.lifeSalary || 1800) >= 1800 && s.gameDay >= 60,
    choices: [
      {
        label: '✅ Acepto la oferta',
        desc: '+30% de sueldo, pero lifestyle creep y menos tiempo libre.',
        effect: s => {
          s.lifeSalary = Math.round((s.lifeSalary || 1800) * 1.30);
          s.xp += 100;
        },
        result: '💰 +30% sueldo. Ojo con el lifestyle creep: más dinero ≠ más riqueza si gastas todo.',
        type: 'positive',
      },
      {
        label: '🤝 Uso la oferta para negociar',
        desc: 'Se lo cuentas a tu empresa actual para conseguir una contraoferta.',
        effect: s => {
          s.lifeSalary = Math.round((s.lifeSalary || 1800) * 1.15);
          s.xp += 150;
        },
        result: '🎯 Tu empresa iguala con +15% y mantienes tu equipo. +150 XP por la jugada.',
        type: 'positive',
      },
      {
        label: '❌ Rechazo sin negociar',
        desc: 'Quedas igual, pero perdiste una oportunidad de palanca.',
        effect: s => {},
        result: '😐 Sin cambios. Las ofertas externas son tu mayor herramienta de negociación.',
        type: 'neutral',
      },
    ],
    lesson: '💡 Cambiar de empresa cada 2-3 años incrementa el sueldo un 15-20% de media. La lealtad ciega es el lujo que no te puedes permitir.',
  },
  {
    id: 'training_budget',
    icon: '🎓',
    title: 'Presupuesto de formación',
    desc: 'Tu empresa tiene €1.500 de presupuesto de formación para ti. ¿En qué lo usas?',
    trigger: s => (s.career || 'junior') !== 'entrepreneur' && s.gameDay >= 90,
    choices: [
      {
        label: '📊 Curso de finanzas personales',
        desc: 'Directamente aplicable a tu vida. Conocimiento que no caduca.',
        effect: s => { s.xp += 400; s.lifeSalary = Math.round((s.lifeSalary || 1800) * 1.05); },
        result: '🧠 +400 XP, +5% sueldo. La educación financiera paga dividendos de por vida.',
        type: 'positive',
      },
      {
        label: '💻 Certificación técnica',
        desc: 'Una certificación en demanda que aumenta tu valor en el mercado.',
        effect: s => { s.xp += 250; s.lifeSalary = Math.round((s.lifeSalary || 1800) * 1.10); },
        result: '🏆 +250 XP, +10% sueldo. Habilidades técnicas = mayor sueldo directo.',
        type: 'positive',
      },
      {
        label: '🎉 No lo uso (caduca)',
        desc: 'Procrastinas y el presupuesto caduca al final del año.',
        effect: s => {},
        result: '😬 Presupuesto perdido. €1.500 de valor evaporado por no actuar.',
        type: 'negative',
      },
    ],
    lesson: '💡 Las empresas con mayor ROI de formación tienen un 218% más de ingresos por empleado. Tu formación es el activo que más controlas.',
  },
  {
    id: 'burnout_risk',
    icon: '🔥',
    title: 'Señales de agotamiento',
    desc: 'Llevas meses a máxima intensidad. Tu cuerpo y mente avisan. ¿Qué haces?',
    trigger: s => s.gameDay >= 120 && (s.career === 'senior' || s.career === 'entrepreneur'),
    choices: [
      {
        label: '🧘 Tomo vacaciones y desconecto',
        desc: 'Dos semanas fuera. Productividad a largo plazo vale más que el corto plazo.',
        effect: s => { s.xp += 100; s.streak = Math.max(s.streak, 10); },
        result: '✨ +100 XP. Vuelves con energía renovada. La sostenibilidad es la clave.',
        type: 'positive',
      },
      {
        label: '⚡ Aguanto, el trabajo es prioridad',
        desc: 'Pronto todo irá mejor… o no.',
        effect: s => { s.lifeSalary = Math.round((s.lifeSalary || 1800) * 0.95); },
        result: '📉 -5% productividad efectiva. El burnout cuesta más de lo que ahorra.',
        type: 'negative',
      },
      {
        label: '🔄 Cambio de ritmo y delego',
        desc: 'Redistribuyes tareas y pones límites reales.',
        effect: s => { s.xp += 200; },
        result: '🌿 +200 XP. Delegar es una habilidad directiva, no una debilidad.',
        type: 'positive',
      },
    ],
    lesson: '💡 El burnout le cuesta a la economía española más de €6.000M/año. La prevención vale 10x el tratamiento.',
  },
];

const BLACK_SWAN_EVENTS = [
  {
    name:      'Crash de las Punto-com',
    year:      '2000–2002',
    drop:      -49,
    icon:      '💻',
    context:   'El Nasdaq perdió un 78%. Las empresas .com sin beneficios cotizaban a valoraciones de ciencia ficción. La recuperación tardó 7 años.',
    lesson:    'Los inversores que mantuvieron carteras diversificadas (S&P 500) recuperaron todo en 5 años y siguieron creciendo.',
  },
  {
    name:      'Crisis Financiera Global',
    year:      '2008–2009',
    drop:      -56,
    icon:      '🏦',
    context:   'Lehman Brothers quebró. El S&P 500 cayó un 56% desde máximos. La mayor crisis desde 1929.',
    lesson:    'Quien compró S&P 500 en el mínimo de 2009 multiplicó su dinero por 7 en los siguientes 12 años.',
  },
  {
    name:      'Crisis COVID-19',
    year:      '2020',
    drop:      -34,
    icon:      '🦠',
    context:   'El mercado cayó un 34% en solo 33 días. La caída más rápida de la historia.',
    lesson:    'Fue también la recuperación más rápida: en 6 meses el S&P 500 recuperó máximos históricos.',
  },
  {
    name:      'Corrección de Inflación',
    year:      '2022',
    drop:      -25,
    icon:      '📈',
    context:   'La Fed subió tipos al ritmo más rápido en 40 años para combatir la inflación del 9%. Bonos y acciones cayeron juntos.',
    lesson:    'Las acciones de empresas con flujo de caja real (Value) aguantaron mucho mejor que las tecnológicas especulativas.',
  },
  {
    name:      'Flash Crash Cripto',
    year:      '2022',
    drop:      -65,
    icon:      '₿',
    context:   'Bitcoin perdió el 65% en un año. Terra/Luna colapsó a cero. FTX quebró con 8B$ de clientes atrapados.',
    lesson:    'La volatilidad del 80% histórico de Bitcoin es real. Diversificación y no invertir más del 5% en crypto son reglas de oro.',
  },
];

const BUSINESSES = [
  // ── NIVEL BÁSICO — disponibles para todos ──────────────
  {id:'cafe', icon:'☕', name:'Cafetería local', type:'Hostelería',
   tier:'basic', careerRequired:null, xpRequired:0,
   desc:'Pequeño café en zona céntrica. Flujo constante de clientes. El negocio físico más predecible.',
   cost:8000, monthlyRevenue:1200, monthlyExpenses:600, riskLevel:'low', roi:9, xpBonus:100,
   learnNote:'El negocio local clásico: bajo riesgo, ingresos predecibles, escalable con franquicia.',
   upgrades:[
     {id:'u1',name:'Máquina espresso premium',  desc:'+20% ticket medio',cost:2000, revBonus:240},
     {id:'u2',name:'App de delivery + fidelidad',desc:'+35% pedidos',    cost:3500, revBonus:420},
     {id:'u3',name:'Franquicia (2ª unidad)',     desc:'+80% ingresos',   cost:15000,revBonus:960},
   ]},

  {id:'ecomm', icon:'🛒', name:'Tienda online', type:'E-commerce',
   tier:'basic', careerRequired:null, xpRequired:200,
   desc:'Dropshipping + marca propia. Sin inventario físico. Escalable a nivel global.',
   cost:3000, monthlyRevenue:800, monthlyExpenses:200, riskLevel:'med', roi:20, xpBonus:80,
   learnNote:'E-commerce: margen bajo pero coste de arranque mínimo. El marketing lo es todo.',
   upgrades:[
     {id:'u1',name:'Meta Ads + retargeting',     desc:'+50% conversión', cost:1500, revBonus:400},
     {id:'u2',name:'White label (marca propia)', desc:'+70% margen',     cost:5000, revBonus:560},
     {id:'u3',name:'Canal Amazon + FBA',         desc:'+120% volumen',   cost:8000, revBonus:960},
   ]},

  {id:'yt', icon:'📺', name:'Canal de YouTube', type:'Contenido digital',
   tier:'basic', careerRequired:null, xpRequired:800,  // requiere haber aprendido suficiente
   desc:'Canal de finanzas personales. Empieza sin dinero pero necesitas credibilidad (XP). Ingresos variables.',
   cost:0,  // ¡gratis para empezar!
   monthlyRevenue:600, monthlyExpenses:60, riskLevel:'high', roi:0, xpBonus:60,
   isVolatile:true,   // los ingresos varían ±50% cada mes (viralidad)
   learnNote:'El creador de contenido es el negocio de menor coste inicial. El XP representa tu credibilidad y conocimiento.',
   upgrades:[
     {id:'u1',name:'Equipo grabación 4K + micro',desc:'+30% retención',  cost:2000, revBonus:180},
     {id:'u2',name:'Curso premium propio',       desc:'+200% ingresos',  cost:3000, revBonus:1200},
     {id:'u3',name:'Red de creadores + agencia', desc:'+400% escala',    cost:15000,revBonus:2400},
   ]},

  // ── NIVEL SENIOR — requiere carrera 'senior' ─────────────
  {id:'saas', icon:'💻', name:'Producto SaaS', type:'Software B2B',
   tier:'senior', careerRequired:'senior', xpRequired:500,
   desc:'Herramienta B2B con suscripción mensual (MRR). Alto riesgo de fracaso los primeros meses.',
   cost:12000, monthlyRevenue:2500, monthlyExpenses:400, riskLevel:'high', roi:25, xpBonus:150,
   failChance:0.12,   // 12% de probabilidad de perder el mes de ingresos (cliente churn severo)
   learnNote:'⚠️ El 90% de los SaaS fracasan antes de 2 años. El 10% superviviente genera retornos excepcionales.',
   upgrades:[
     {id:'u1',name:'API pública + marketplace',  desc:'+40% retención',  cost:4000, revBonus:1000},
     {id:'u2',name:'Plan Enterprise (contratos)',desc:'+60% precio',     cost:8000, revBonus:1500},
     {id:'u3',name:'Expansión EE.UU. + UK',      desc:'+150% MRR',       cost:20000,revBonus:3750},
   ]},

  {id:'solar', icon:'☀️', name:'Parque solar (tejados)', type:'Energía renovable',
   tier:'senior', careerRequired:'senior', xpRequired:400,
   desc:'Instalación fotovoltaica en edificios residenciales. Venta de excedentes a la red. Retorno predecible.',
   cost:6000, monthlyRevenue:180, monthlyExpenses:10, riskLevel:'low', roi:3.4, xpBonus:70,
   learnNote:'La energía solar tiene el payback más predecible de todos los activos físicos. Protegida contra inflación energética.',
   upgrades:[
     {id:'u1',name:'Baterías de almacenamiento',desc:'+40% autonomía',   cost:4000, revBonus:72},
     {id:'u2',name:'Segunda instalación',       desc:'+100% ingresos',   cost:6000, revBonus:180},
   ]},

  // ── NIVEL EMPRENDEDOR — requiere carrera 'entrepreneur' ──
  {id:'rental', icon:'🏠', name:'Inmueble en alquiler', type:'Inmobiliario',
   tier:'entrepreneur', careerRequired:'entrepreneur', xpRequired:1000,
   desc:'Apartamento en ciudad universitaria. Inquilinos estables 10 meses al año. Ingreso pasivo predecible.',
   cost:45000, monthlyRevenue:900, monthlyExpenses:150, riskLevel:'low', roi:2.0, xpBonus:200,
   learnNote:'El inmobiliario tiene el ROI más bajo en papel pero el apalancamiento bancario puede multiplicarlo ×5.',
   upgrades:[
     {id:'u1',name:'Reforma integral cocina-baño',desc:'+25% alquiler',  cost:8000, revBonus:225},
     {id:'u2',name:'Plataforma Airbnb turístico', desc:'+80% ingresos',  cost:3000, revBonus:720},
     {id:'u3',name:'Segundo piso (portfolio)',    desc:'+100% ingresos', cost:40000,revBonus:900},
   ]},

  {id:'lav', icon:'👔', name:'Lavandería automática', type:'Servicios',
   tier:'entrepreneur', careerRequired:'entrepreneur', xpRequired:1200,
   desc:'Local céntrico con máquinas de autoservicio 24/7. Cash flow inmediato. Sin empleados.',
   cost:25000, monthlyRevenue:1800, monthlyExpenses:700, riskLevel:'low', roi:5.2, xpBonus:120,
   learnNote:'Negocio de cash flow puro: sin inventario, sin empleados, sin estacionalidad. Favorito de los que buscan pasividad.',
   upgrades:[
     {id:'u1',name:'Zona plancha + doblado',    desc:'+25% ticket',      cost:5000, revBonus:450},
     {id:'u2',name:'App de reservas + fidelidad',desc:'+20% ocupación',  cost:3000, revBonus:360},
   ]},

  {id:'vend', icon:'🎰', name:'Red de vending', type:'Distribución',
   tier:'entrepreneur', careerRequired:'entrepreneur', xpRequired:1300,
   desc:'Máquinas expendedoras en oficinas, gimnasios y colegios. Escalable por unidades.',
   cost:5000, monthlyRevenue:700, monthlyExpenses:200, riskLevel:'med', roi:12, xpBonus:80,
   learnNote:'El vending es un negocio de volumen: una máquina da poco, pero 20 máquinas dan mucho con el mismo esfuerzo.',
   upgrades:[
     {id:'u1',name:'Máquinas IoT conectadas',   desc:'+30% eficiencia',  cost:3000, revBonus:210},
     {id:'u2',name:'Expansión a 10 máquinas',   desc:'+150% red',        cost:10000,revBonus:1050},
   ]},
  // ── NIVEL BÁSICO — nuevos ────────────────────────────────────
  {id:'newsletter', icon:'📧', name:'Newsletter de pago', type:'Contenido digital',
   tier:'basic', careerRequired:null, xpRequired:300,
   desc:'Newsletter semanal sobre finanzas e inversión. Beehiiv o Substack. Ingresos recurrentes por suscripción mensual.',
   cost:0, monthlyRevenue:400, monthlyExpenses:30, riskLevel:'med', roi:0, xpBonus:70,
   isVolatile:true,
   learnNote:'Un newsletter de 1.000 suscriptores a €5/mes = €5.000 MRR. El medio más predecible para creadores.',
   upgrades:[
     {id:'u1',name:'Patrocinios corporativos',  desc:'+150% ingresos',   cost:1000, revBonus:600},
     {id:'u2',name:'Curso premium adjunto',      desc:'+200% ingresos',  cost:2500, revBonus:800},
     {id:'u3',name:'Comunidad privada Discord',  desc:'+80% retención',  cost:1500, revBonus:320},
   ]},

  {id:'autoescuela', icon:'🚗', name:'Academia de conducción', type:'Educación',
   tier:'basic', careerRequired:null, xpRequired:150,
   desc:'Autoescuela en ciudad media. Demanda constante. Alta barrera de entrada por licencias. Bajo riesgo de disrupción digital.',
   cost:18000, monthlyRevenue:3200, monthlyExpenses:1800, riskLevel:'low', roi:8, xpBonus:90,
   learnNote:'Negocio regulado = protección frente a competencia. Las barreras de entrada son el foso de un negocio.',
   upgrades:[
     {id:'u1',name:'Simuladores de conducción',  desc:'+20% aprobados',  cost:8000, revBonus:640},
     {id:'u2',name:'Segunda sede + flota',        desc:'+80% capacidad', cost:20000,revBonus:2560},
   ]},

  {id:'podcast', icon:'🎙️', name:'Podcast monetizado', type:'Contenido digital',
   tier:'basic', careerRequired:null, xpRequired:600,
   desc:'Podcast semanal sobre dinero y carrera. Patrocinadores desde 5.000 descargas/episodio. El formato de audio crece un 20% anual.',
   cost:800, monthlyRevenue:350, monthlyExpenses:40, riskLevel:'high', roi:0, xpBonus:50,
   isVolatile:true,
   learnNote:'El podcast tiene el CAC (coste de adquisición de oyente) más bajo de todos los medios. La fidelidad es brutal.',
   upgrades:[
     {id:'u1',name:'Equipo Shure + estudio',     desc:'+40% calidad/retención',cost:1500,revBonus:140},
     {id:'u2',name:'Red de patrocinadores',       desc:'+200% CPM',     cost:2000, revBonus:700},
     {id:'u3',name:'Versión premium Patreon',     desc:'+120% ingresos',cost:500,  revBonus:420},
   ]},

  {id:'app_movil', icon:'📱', name:'App móvil (freemium)', type:'Software B2C',
   tier:'basic', careerRequired:null, xpRequired:700,
   desc:'App de productividad o salud con modelo freemium. Las apps top ganan el 95% de sus ingresos en el 5% de usuarios premium.',
   cost:5000, monthlyRevenue:600, monthlyExpenses:100, riskLevel:'high', roi:10, xpBonus:100,
   isVolatile:true,
   failChance:0.08,
   learnNote:'El modelo freemium funciona con volumen. Necesitas 100 usuarios gratis para conseguir 1 de pago. La retención lo es todo.',
   upgrades:[
     {id:'u1',name:'ASO + campaña TikTok',       desc:'+80% descargas',  cost:3000,revBonus:480},
     {id:'u2',name:'Plan B2B para empresas',      desc:'+150% ARPU',     cost:6000,revBonus:900},
     {id:'u3',name:'Expansión internacional',    desc:'+200% mercado',   cost:12000,revBonus:1200},
   ]},

  // ── NIVEL SENIOR — nuevos ─────────────────────────────────────
  {id:'clinica', icon:'🏥', name:'Clínica dental privada', type:'Salud',
   tier:'senior', careerRequired:'senior', xpRequired:600,
   desc:'Clínica con 2 consultas. Ortodoncia + implantes = ticket alto. Clientes recurrentes de por vida. El sector salud es anticíclico.',
   cost:60000, monthlyRevenue:8000, monthlyExpenses:3500, riskLevel:'low', roi:5.5, xpBonus:180,
   learnNote:'Los servicios de salud son la categoría más resiliente en recesiones. La demanda es inelástica al precio.',
   upgrades:[
     {id:'u1',name:'Equipo radiografía digital', desc:'+25% diagnósticos', cost:15000,revBonus:2000},
     {id:'u2',name:'3ª consulta + especialista', desc:'+60% capacidad',   cost:25000,revBonus:4800},
     {id:'u3',name:'Franquicia modelo dental',   desc:'+200% escala',     cost:80000,revBonus:16000},
   ]},

  {id:'almacen', icon:'📦', name:'Almacén self-storage', type:'Inmobiliario',
   tier:'senior', careerRequired:'senior', xpRequired:500,
   desc:'30 trasteros en polígono. Contratos mensuales, alta retención. El self-storage tuvo retornos superiores al S&P500 en los últimos 20 años.',
   cost:35000, monthlyRevenue:2800, monthlyExpenses:400, riskLevel:'low', roi:6.9, xpBonus:130,
   learnNote:'El self-storage: sin inquilinos difíciles, sin mantenimiento de vivienda, sin estacionalidad. El negocio inmobiliario más olvidado.',
   upgrades:[
     {id:'u1',name:'Control acceso 24h + cámaras',desc:'+15% precio/m²',  cost:8000,revBonus:420},
     {id:'u2',name:'Módulos climatizados',         desc:'+40% ticket',    cost:15000,revBonus:1120},
     {id:'u3',name:'Segunda nave (50 trasteros)',  desc:'+100% ingresos', cost:30000,revBonus:2800},
   ]},

  {id:'agencia_ia', icon:'🤖', name:'Agencia de automatización IA', type:'Consultoría tech',
   tier:'senior', careerRequired:'senior', xpRequired:800,
   desc:'Implementas flujos de IA (n8n, Make, GPT APIs) para PYMEs. Proyectos de €2k-10k más mantenimiento mensual. El sector más caliente de 2024-2030.',
   cost:2000, monthlyRevenue:3500, monthlyExpenses:300, riskLevel:'med', roi:65, xpBonus:160,
   isVolatile:true,
   learnNote:'La IA no elimina empleos, elimina empresas que no la usan. Las agencias de automatización tienen ROI infinito si te especializas.',
   upgrades:[
     {id:'u1',name:'Equipo de 2 devs freelance',  desc:'+120% capacidad', cost:5000,revBonus:4200},
     {id:'u2',name:'Producto SaaS propio con IA',  desc:'+200% MRR',     cost:10000,revBonus:7000},
   ]},

  // ── NIVEL EMPRENDEDOR — nuevos ─────────────────────────────────
  {id:'hotel', icon:'🏨', name:'Apartahotel boutique', type:'Hostelería premium',
   tier:'entrepreneur', careerRequired:'entrepreneur', xpRequired:1500,
   desc:'6 habitaciones en ciudad turística. RevPAR de €85. Booking + Airbnb. El sector turístico español bate récords consecutivos.',
   cost:90000, monthlyRevenue:7000, monthlyExpenses:2500, riskLevel:'med', roi:5.5, xpBonus:250,
   learnNote:'El revenue management hotelero: precio dinámico que maximiza el RevPAR. Herramienta usada por Marriott, aplicable en 6 habitaciones.',
   upgrades:[
     {id:'u1',name:'Canal directo (web propia)',   desc:'+20% margen',    cost:4000,revBonus:1400},
     {id:'u2',name:'Experiencias premium (tours)', desc:'+30% ticket',    cost:6000,revBonus:2100},
     {id:'u3',name:'Segunda propiedad',            desc:'+100% ingresos', cost:85000,revBonus:7000},
   ]},

  {id:'holding', icon:'🏛️', name:'Holding de inversión familiar', type:'Estructura fiscal',
   tier:'entrepreneur', careerRequired:'entrepreneur', xpRequired:2000,
   desc:'Sociedad holding que agrupa tus negocios e inversiones. Tributación al 15% vs 47% IRPF personal. El vehículo que usan todos los grandes patrimonios.',
   cost:3000, monthlyRevenue:0, monthlyExpenses:200, riskLevel:'low', roi:0, xpBonus:300,
   learnNote:'Un holding no genera ingresos directos, pero reduce tu factura fiscal un 30-40% sobre los dividendos de tus otros negocios. El activo más rentable a largo plazo.',
   upgrades:[
     {id:'u1',name:'Asesor fiscal especializado',  desc:'−20% tributación', cost:5000,revBonus:500},
     {id:'u2',name:'Expansión internacional (BV)', desc:'−35% tributación', cost:15000,revBonus:1500},
   ]},

  {id:'fondo_inversion', icon:'📊', name:'Fondo de inversión privado', type:'Finanzas',
   tier:'entrepreneur', careerRequired:'entrepreneur', xpRequired:2500,
   desc:'Gestión de capital de 5-10 inversores privados. Comisión de gestión 2% + 20% de rentabilidad (carried interest). El modelo Berkshire a escala mini.',
   cost:10000, monthlyRevenue:1200, monthlyExpenses:300, riskLevel:'med', roi:11, xpBonus:400,
   learnNote:'El carried interest es el secreto de la riqueza de los gestores de fondos: ganas el 20% de los beneficios sin arriesgar ese capital.',
   upgrades:[
     {id:'u1',name:'Registro CNMV (EAF)',          desc:'+50% credibilidad/AUM',cost:8000,revBonus:600},
     {id:'u2',name:'Fondo II (10M€ AUM)',           desc:'+200% comisiones',cost:20000,revBonus:2400},
   ]},

];

const LIFE_EVENTS = [
  {id:'promotion',icon:'🎯',title:'Negociar un aumento de sueldo',desc:'Preparas una presentación con tus logros y pides un 20% de aumento.',type:'positive',
    condition:e=>e.lifeAge>=26,
    effects:{salaryMultiplier:1.2,happiness:10,xp:120,cost:0},
    narrative:'Conseguiste el aumento. Tu sueldo sube a €{salary}/mes. El mercado laboral premia a quien se valora.'},
  {id:'invest_start',icon:'📈',title:'Abrir cuenta de inversión',desc:'Destinas 100€/mes a un ETF global indexado. El primer paso es el más importante.',type:'positive',
    condition:e=>true,
    effects:{monthlyContrib:100,xp:150,happiness:5,cost:0},
    narrative:'Empezaste a invertir 100€/mes. En 20 años, a un 7% anual, tendrás €52.000.'},
  {id:'emergency_fund',icon:'🛡️',title:'Crear fondo de emergencia',desc:'Apartas 3 meses de gastos en una cuenta remunerada. La base de todo plan financiero.',type:'positive',
    condition:e=>true,
    effects:{balanceBonus:3000,xp:100,happiness:15,cost:1500},
    narrative:'Tienes 3 meses de colchón. Duermes mejor. El estrés financiero desaparece un 40%.'},
  {id:'side_hustle',icon:'💻',title:'Crear un proyecto secundario',desc:'Empiezas a freelancear en tu área de expertise. Potencial de €500-2000/mes extra.',type:'positive',
    condition:e=>e.lifeAge>=25,
    effects:{salaryBonus:600,xp:90,happiness:8,cost:500},
    narrative:'Tu proyecto lateral genera €600/mes extra. La diversificación de ingresos cambia todo.'},
  {id:'move_city',icon:'🏙️',title:'Mudarte a una ciudad con más oportunidades',desc:'Madrid o Barcelona ofrecen salarios un 30% más altos. El coste de vida sube, pero el neto también.',type:'neutral',
    condition:e=>e.lifeAge>=23,
    effects:{salaryMultiplier:1.3,expenseIncrease:400,xp:80,happiness:-5,cost:2000},
    narrative:'La mudanza fue dura pero el sueldo compensó. Nuevas oportunidades, nuevas personas.'},
  {id:'buy_car',icon:'🚗',title:'Comprar un coche nuevo',desc:'12.000€ de depreciación en 3 años. Alternativa: coche de segunda mano por 8.000€.',type:'negative',
    condition:e=>true,
    effects:{cost:12000,expenseIncrease:300,happiness:10,xp:30},
    narrative:'El coche te da libertad pero consume una parte importante de tu patrimonio.'},
  {id:'buy_house',icon:'🏠',title:'Comprar tu primera vivienda',desc:'Con hipoteca al 3.5% a 25 años. El sueño español con matemáticas reales.',type:'neutral',
    condition:e=>(S.cash||0)>=30000,
    effects:{cost:30000,expenseChange:-200,happiness:20,xp:125,balanceGrowth:0.02},
    narrative:'Firmaste la hipoteca. Cuota de €1.000/mes. El inmueble puede valer más en 20 años.'},
  {id:'kids',icon:'👶',title:'Tener un hijo',desc:'El mayor cambio de vida. +€800/mes de gastos. Inconmensurablemente más que eso.',type:'neutral',
    condition:e=>e.lifeAge>=28,
    effects:{expenseIncrease:800,happiness:25,xp:100,cost:0},
    narrative:'La perspectiva cambia. Inviertes más pensando en el futuro. La constancia se vuelve más fácil.'},
  {id:'divorce',icon:'💔',title:'Separación o divorcio',desc:'Impacto financiero real: reparto de patrimonio, gastos judiciales, reestructuración.',type:'negative',
    condition:e=>e.lifeAge>=30,
    effects:{patrimonyCut:0.4,expenseIncrease:200,happiness:-30,xp:50,cost:5000},
    narrative:'Una de las peores decisiones financieras involuntarias. Resiliencia y reconstrucción.'},
  {id:'health_insurance',icon:'🏥',title:'Contratar seguro de salud privado',desc:'€120/mes pero evitas esperas en pública y proteges tu mayor activo: tu salud.',type:'positive',
    condition:e=>true,
    effects:{expenseIncrease:120,happiness:10,xp:60,cost:0},
    narrative:'Protegiste tu salud. Los problemas médicos son el #1 de quiebras personales en EE.UU.'},
  {id:'pension_plan',icon:'💼',title:'Abrir plan de pensiones',desc:'1.500€/año deducibles en IRPF. Ahorro fiscal inmediato mientras construyes el futuro.',type:'positive',
    condition:e=>e.lifeAge>=28,
    effects:{salaryBonus:300,xp:130,happiness:8,cost:1500},
    narrative:'La deducción fiscal de 1.500€ te ahorra entre 285€ y 405€ en IRPF este año.'},
  {id:'retire_early',icon:'🏝️',title:'Retiro anticipado a los 50',desc:'Tienes suficiente patrimonio para vivir de rentas. La libertad financiera real.',type:'positive',
    condition:e=>e.lifeAge>=45&&(S.patrimony||0)>=500000,
    effects:{xp:1000,happiness:50,cost:0,salaryMultiplier:0},
    narrative:'Lo lograste. El 4% anual de tu patrimonio cubre todos tus gastos. Eres financieramente libre.'},
  {id:'masters_degree',icon:'🎓',title:'Hacer un máster',desc:'Un MBA o máster técnico puede aumentar tu salario un 30-40%. Coste: 15.000€.',type:'positive',
    condition:e=>e.lifeAge>=24&&e.lifeAge<=40,
    effects:{salaryMultiplier:1.35,xp:200,happiness:10,cost:15000},
    narrative:'Terminaste el máster. Tu empleabilidad sube y consigues un puesto mejor pagado.'},
  {id:'startup_exit',icon:'🚀',title:'Exit de startup',desc:'Vendiste tu participación en una startup. Recibes 80.000€ neto tras impuestos.',type:'positive',
    condition:e=>e.lifeAge>=30&&(S.career==='entrepreneur'),
    effects:{xp:400,happiness:30,cost:0,balanceBonus:80000},
    narrative:'Tu salida de la startup te da 80.000€ netos. Úsalo para invertir, no para gastar.'},
  {id:'inheritance',icon:'💼',title:'Recibir herencia familiar',desc:'Un familiar te deja 30.000€. ¿Lo inviertes o lo gastas?',type:'neutral',
    condition:e=>e.lifeAge>=30,
    effects:{balanceBonus:30000,xp:100,happiness:0,cost:0},
    narrative:'Tienes 30.000€ extra. La decisión sobre qué hacer con ellos definirá tu futuro financiero.'},
  {id:'lottery_small',icon:'🎰',title:'Premio pequeño de lotería',desc:'Te toca 5.000€ en un sorteo de empresa. Suerte que no cambia vidas, pero suma.',type:'positive',
    condition:e=>e.lifeAge>=22,
    effects:{balanceBonus:5000,xp:50,happiness:20,cost:0},
    narrative:'5.000€ inesperados. Los inversores los meten a ETFs. Los demás, de viaje.'},
  {id:'job_loss',icon:'💔',title:'Perder el empleo',desc:'Despido inesperado. Tienes subsidio por 6 meses pero tu salario baja un 40% hasta encontrar otro.',type:'negative',
    condition:e=>e.lifeAge>=25&&e.lifeAge<=55,
    effects:{salaryMultiplier:0.6,xp:80,happiness:-25,cost:0},
    narrative:'Despido. El fondo de emergencia que tenías (o no tenías) determina cómo sobrellevas estos meses.'},
  {id:'medical_emergency',icon:'🏥',title:'Emergencia médica',desc:'Gastos médicos imprevistos de 4.000€. La sanidad privada tiene coste.',type:'negative',
    condition:e=>e.lifeAge>=35,
    effects:{cost:4000,xp:30,happiness:-15,expenseIncrease:50},
    narrative:'La emergencia médica muestra por qué el fondo de emergencia no es opcional.'},
  {id:'sell_house',icon:'🏡',title:'Vender la vivienda',desc:'Tu casa se ha revalorizado un 35%. Vendes y liberas 60.000€ de plusvalía.',type:'positive',
    condition:e=>e.lifeAge>=40&&(S.mortgages||[]).length>0,
    effects:{balanceBonus:60000,xp:150,happiness:10,cost:0},
    narrative:'Vendiste con plusvalía. Ahora decides: reinvertir, comprar algo más barato o alquilar.'},
  {id:'international_move',icon:'✈️',title:'Mudanza internacional',desc:'Aceptas un puesto fuera. Salario 50% más alto pero coste de vida también sube.',type:'positive',
    condition:e=>e.lifeAge>=27&&e.lifeAge<=50,
    effects:{salaryMultiplier:1.5,expenseIncrease:400,xp:250,happiness:5,cost:3000},
    narrative:'Nueva ciudad, nueva vida. Tu carrera acelera pero también tus gastos.'},
  {id:'career_change',icon:'🔄',title:'Cambio de carrera',desc:'Cambiar de sector te motiva. Salario inicial 30% menor pero crecimiento potencial.',type:'neutral',
    condition:e=>e.lifeAge>=28,
    effects:{salaryMultiplier:0.7,xp:200,happiness:15,cost:0},
    narrative:'Cambio de sector. Los primeros meses son duros pero la motivación renace.'},
];


// ═══ DATA — Rankings, logros, config ═══
/* ══════════════════════════════════════════════════════════════════
   data-config.js — Configuración y Meta-datos FinLearn
   ─ RANKINGS          → tabla de líderes (estáticos, el jugador se inserta dinámicamente)
   ─ CHALLENGE         → datos del reto semanal
   ─ ACHIEVEMENTS      → logros desbloqueables
   ─ TICKERS           → mensajes del ticker de actividad social
   ─ SOCIAL_PROOF      → notificaciones de prueba social
   ─ FINANCIAL_FACTS   → datos financieros para la sección educativa
   ─ DAILY_QUESTIONS   → preguntas diarias de micro-lección
   ─ REWARDS           → cofres y badges de recompensa
   ─ IDENTITY_STAGES   → etapas de identidad del inversor
   ─ EXAM_QUESTION_POOL → pool de preguntas para el examen final
   ─ Sin dependencias externas.
══════════════════════════════════════════════════════════════════ */

const RANKINGS = [
  {n:'María S.',   em:'🦊', xp:8420, str:28, cl:'#ff6b35', pos:1 },
  {n:'Carlos M.',  em:'🐻', xp:7890, str:21, cl:'#0091ff', pos:2 },
  {n:'Ana P.',     em:'🦋', xp:7340, str:15, cl:'#a855f7', pos:3 },
  {n:'David R.',   em:'🦅', xp:6980, str:19, cl:'#00e5a0', pos:4 },
  {n:'Laura G.',   em:'🦁', xp:6450, str:12, cl:'#fbbf24', pos:5 },
  {n:'Pablo T.',   em:'🐯', xp:6100, str:9,  cl:'#ef4444', pos:6 },
  {n:'Elena V.',   em:'🦚', xp:5800, str:14, cl:'#10b981', pos:7 },
  {n:'Javier H.',  em:'🐺', xp:5650, str:8,  cl:'#6366f1', pos:8 },
  {n:'Lucía B.',   em:'🦜', xp:5420, str:11, cl:'#ec4899', pos:9 },
  {n:'Miguel A.',  em:'🦈', xp:5200, str:7,  cl:'#14b8a6', pos:10},
  {n:'Sofía N.',   em:'🦊', xp:5050, str:6,  cl:'#f59e0b', pos:11},
  {n:'Roberto C.', em:'🐸', xp:4950, str:5,  cl:'#84cc16', pos:12},
  {n:'Isabel M.',  em:'🦋', xp:4870, str:8,  cl:'#a855f7', pos:13},
  {n:'Fernando R.',em:'🦁', xp:4500, str:4,  cl:'#fbbf24', pos:14},
  {n:'Natalia P.', em:'🐉', xp:4200, str:3,  cl:'#6366f1', pos:15},
  // Note: the real user is inserted dynamically by _getLiveRankings()
  // based on their actual S.xp — they start at the bottom with 0 XP
  // and climb as they complete modules. No fake position.
];

const CHALLENGE = [
  {n:'María S.',em:'🦊',pct:86},{n:'Carlos M.',em:'🐻',pct:71},
  {n:'Tú',em:'🌱',pct:57,me:true},{n:'Laura G.',em:'🦁',pct:43},{n:'Pablo T.',em:'🐯',pct:29},
];

const ACHIEVEMENTS = [
  /* ── Aprendizaje ────────────────────────────────────────── */
  { id:'first_module', i:'💡', n:'Primer paso',
    desc:'Completa tu primer módulo de aprendizaje.',
    cat:'learn',  reward:{xp:100},
    check: s => s.completedMods.length >= 1 },
  { id:'mods_3',       i:'📖', n:'Estudiante curioso',
    desc:'Completa 3 módulos de aprendizaje.',
    cat:'learn',  reward:{xp:200},
    check: s => s.completedMods.length >= 3 },
  { id:'mods_5',       i:'📚', n:'Estudiante',
    desc:'Completa 5 módulos.',
    cat:'learn',  reward:{xp:300, cash:200},
    check: s => s.completedMods.length >= 5 },
  { id:'mods_10',      i:'🎓', n:'Analista',
    desc:'Completa 10 módulos.',
    cat:'learn',  reward:{xp:300, cash:300},
    check: s => s.completedMods.length >= 10 },
  { id:'mods_15',      i:'🧑‍🏫', n:'Consultor',
    desc:'Completa 15 módulos — vas por buen camino.',
    cat:'learn',  reward:{xp:500, cash:500},
    check: s => s.completedMods.length >= 15 },
  { id:'mods_all',     i:'🏆', n:'Maestro financiero',
    desc:'Completa todos los módulos disponibles.',
    cat:'learn',  reward:{xp:400, cash:1000},
    check: s => s.completedMods.length >= 30 },

  /* ── Racha ──────────────────────────────────────────────── */
  { id:'streak_3',     i:'🔥', n:'En racha',
    desc:'3 días consecutivos de aprendizaje.',
    cat:'streak', reward:{xp:75},
    check: s => s.streak >= 3 },
  { id:'streak_7',     i:'🔥', n:'Semana de fuego',
    desc:'7 días seguidos sin fallar.',
    cat:'streak', reward:{xp:150, cash:200},
    check: s => s.streak >= 7 },
  { id:'streak_14',    i:'🌋', n:'Dos semanas',
    desc:'14 días seguidos — constancia de élite.',
    cat:'streak', reward:{xp:300, cash:400},
    check: s => s.streak >= 14 },
  { id:'streak_30',    i:'🌋', n:'Imparable',
    desc:'30 días de racha. Leyenda.',
    cat:'streak', reward:{xp:500, cash:800},
    check: s => s.streak >= 30 },
  { id:'streak_60',    i:'💫', n:'Dos meses sin parar',
    desc:'60 días consecutivos. Solo el 0.1% llega aquí.',
    cat:'streak', reward:{xp:300, cash:600},
    check: s => s.streak >= 60 },

  /* ── XP / Nivel ─────────────────────────────────────────── */
  { id:'xp_500',       i:'⚡', n:'500 XP',
    desc:'Primera marca de experiencia acumulada.',
    cat:'xp',     reward:{xp:25},
    check: s => (s.xp||0) >= 500 },
  { id:'xp_1k',        i:'⚡', n:'1.000 XP',
    desc:'Acumula 1.000 puntos de experiencia.',
    cat:'xp',     reward:{xp:75},
    check: s => (s.xp||0) >= 1000 },
  { id:'xp_5k',        i:'💎', n:'5.000 XP',
    desc:'Acumula 5.000 XP — mente de inversor.',
    cat:'xp',     reward:{xp:300, cash:500},
    check: s => (s.xp||0) >= 5000 },
  { id:'xp_10k',       i:'👑', n:'Élite',
    desc:'10.000 XP — top absoluto.',
    cat:'xp',     reward:{xp:600, cash:1000},
    check: s => (s.xp||0) >= 10000 },
  { id:'xp_25k',       i:'🌟', n:'Leyenda viva',
    desc:'25.000 XP — solo el 1% llega aquí.',
    cat:'xp',     reward:{xp:300, cash:800},
    check: s => (s.xp||0) >= 25000 },

  /* ── Inversión ──────────────────────────────────────────── */
  { id:'first_stock',  i:'📈', n:'Primer inversor',
    desc:'Compra tu primera acción en la bolsa simulada.',
    cat:'invest', reward:{xp:150, cash:200},
    check: s => Object.keys(s.portfolio||{}).length >= 1 },
  { id:'first_sell',   i:'💵', n:'Realiza beneficios',
    desc:'Vende una posición — toma tus primeras ganancias.',
    cat:'invest', reward:{xp:150, cash:300},
    check: s => (s._totalSells||0) >= 1 },
  { id:'portfolio_5k', i:'💰', n:'Cartera €5k',
    desc:'Patrimonio total supera €5.000.',
    cat:'invest', reward:{xp:400, cash:500},
    check: s => (s.cash||0) + (s.invested||0) >= 5000 },
  { id:'portfolio_10k',i:'💰', n:'Cartera €10k',
    desc:'Patrimonio total supera €10.000.',
    cat:'invest', reward:{xp:800, cash:1000},
    check: s => (s.cash||0) + (s.invested||0) >= 10000 },
  { id:'portfolio_50k',i:'🚀', n:'Cartera €50k',
    desc:'Patrimonio total supera €50.000.',
    cat:'invest', reward:{xp:400, cash:1000},
    check: s => (s.cash||0) + (s.invested||0) >= 50000 },
  { id:'portfolio_100k',i:'🦁', n:'Cartera €100k',
    desc:'Seis cifras — el sueño de muchos, la realidad de pocos.',
    cat:'invest', reward:{xp:800, cash:2000},
    check: s => (s.cash||0) + (s.invested||0) >= 100000 },
  { id:'full_diversify',i:'🌐', n:'Cartera diversificada',
    desc:'5 activos distintos en cartera simultáneamente.',
    cat:'invest', reward:{xp:600, cash:1000},
    check: s => Object.keys(s.portfolio||{}).length >= 5 },
  { id:'first_div',    i:'💸', n:'Primer dividendo',
    desc:'Cobra tu primer dividendo pasivo.',
    cat:'invest', reward:{xp:200, cash:100},
    check: s => Object.values(s.portfolio||{}).some(p => (p.dividendsCollected||0) > 0) },
  { id:'div_100',      i:'💰', n:'€100 en dividendos',
    desc:'€100 acumulados en dividendos — renta pasiva real.',
    cat:'invest', reward:{xp:500, cash:500},
    check: s => (s.totalDividends||0) >= 100 },
  { id:'div_1000',     i:'🏦', n:'€1.000 en dividendos',
    desc:'€1.000 acumulados — la cartera ya trabaja para ti.',
    cat:'invest', reward:{xp:300, cash:400},
    check: s => (s.totalDividends||0) >= 1000 },
  { id:'beat_bogle',   i:'🤖', n:'Mejor que Bogle-Bot',
    desc:'Superaste el patrimonio del bot indexado.',
    cat:'invest', reward:{xp:400, cash:1000},
    check: s => (s.patrimony||0) > (SHADOW_INVESTORS.find(b=>b.id==='bogle')?.patrimony||99999) },

  /* ── Negocios ───────────────────────────────────────────── */
  { id:'first_biz',    i:'🏪', n:'Emprendedor',
    desc:'Abre tu primer negocio.',
    cat:'biz',    reward:{xp:300, cash:500},
    check: s => Object.keys(s.businesses||{}).length >= 1 },
  { id:'biz_2',        i:'🏬', n:'Dos negocios',
    desc:'Opera 2 negocios simultáneos.',
    cat:'biz',    reward:{xp:600, cash:1000},
    check: s => Object.keys(s.businesses||{}).length >= 2 },
  { id:'biz_3',        i:'🏙️', n:'Imperio',
    desc:'Opera 3 negocios simultáneos.',
    cat:'biz',    reward:{xp:250, cash:500},
    check: s => Object.keys(s.businesses||{}).length >= 3 },
  { id:'biz_income_10k',i:'🤑', n:'Flujo de caja',
    desc:'Genera €10.000 acumulados en ingresos de negocios.',
    cat:'biz',    reward:{xp:300, cash:600},
    check: s => Object.values(s.businesses||{}).reduce((a,b)=>a+(b.totalRevenue||0),0) >= 10000 },
  { id:'biz_income_50k',i:'👑', n:'Magnate',
    desc:'€50.000 acumulados en negocios — máquina de ingresos.',
    cat:'biz',    reward:{xp:700, cash:1500},
    check: s => Object.values(s.businesses||{}).reduce((a,b)=>a+(b.totalRevenue||0),0) >= 50000 },

  /* ── Tiempo de juego ────────────────────────────────────── */
  { id:'day_30',       i:'📅', n:'Mes jugado',
    desc:'30 días de juego completados.',
    cat:'time',   reward:{xp:400, cash:500},
    check: s => (s.gameDay||0) >= 30 },
  { id:'day_90',       i:'📆', n:'Trimestre',
    desc:'90 días de juego — un trimestre completo.',
    cat:'time',   reward:{xp:800, cash:1000},
    check: s => (s.gameDay||0) >= 90 },
  { id:'day_365',      i:'🌟', n:'Un año simulado',
    desc:'Completa un año completo de juego.',
    cat:'time',   reward:{xp:500, cash:1000},
    check: s => (s.gameDay||0) >= 365 },
  { id:'day_730',      i:'🎂', n:'Dos años',
    desc:'Dos años de juego — inversión a largo plazo.',
    cat:'time',   reward:{xp:1000, cash:2000},
    check: s => (s.gameDay||0) >= 730 },

  /* ── Vida financiera ────────────────────────────────────── */
  { id:'savings_goal', i:'🏦', n:'Fondo sólido',
    desc:'€10.000 acumulados en el fondo de ahorro.',
    cat:'life',   reward:{xp:500, cash:800},
    check: s => (s.balance||0) >= 10000 },
  { id:'homeowner',    i:'🏠', n:'Propietario',
    desc:'Has pagado tu primera hipoteca completamente.',
    cat:'life',   reward:{xp:300, cash:400},
    check: s => (s.mortgages||[]).some(m => m.paid) },
  { id:'debt_free',    i:'🔓', n:'Libre de Deudas',
    desc:'Cero deudas y cero hipotecas — libertad total.',
    cat:'life',   reward:{xp:400, cash:700},
    check: s => (s.debts||[]).length === 0 && (s.mortgages||[]).filter(m=>!m.paid).length === 0 && ((s._hadDebts||false) || (s._hadMortgages||false)) },

  /* ── Comportamental ─────────────────────────────────────── */
  { id:'paper_hands',  i:'🧻', n:'Manos de Papel',
    desc:'Vendiste durante un flash crash — la peor decisión que existe.',
    cat:'invest', reward:{},
    check: s => (s.paperHandsCount||0) >= 1 },
  { id:'diamond_hands',i:'💎', n:'Manos de Diamante',
    desc:'Mantuviste durante 2 crisis de mercado sin vender.',
    cat:'invest', reward:{xp:300, cash:500},
    check: s => (s.crisesSurvived||0) >= 2 },
  { id:'crisis_buyer', i:'🛒', n:'Comprador en Pánico',
    desc:'Compraste activos durante una crisis de mercado.',
    cat:'invest', reward:{xp:800, cash:1000},
    check: s => (s.crisisBuys||0) >= 1 },
];

const TICKERS = [
  'Alguien acaba de completar su primer módulo 🎉',
  'Nuevo usuario se unió al reto de 7 días 🔥',
  'Se acaba de obtener un certificado de Interés Compuesto 📜',
  'Alguien alcanzó la racha de 5 días consecutivos ⚡',
  'Nuevo inversor simuló su cartera por primera vez 📈',
  'Un usuario llegó al nivel Analista esta semana 💡',
];

const SOCIAL_PROOF = [
  ['👤 Carlos de Madrid','Acaba de completar ETFs · +200 XP','t-social'],
  ['🔥 ¡Racha legendaria!','María S. lleva 28 días consecutivos','t-fire'],
  ['📈 Nuevo en top 10','Elena ha subido del 12 al 7 esta semana','t-social'],
  ['🎯 1.200 completados hoy','Interés Compuesto: módulo más estudiado','t-success'],
  ['🏆 Certificado obtenido','Lucía de Sevilla completó su primer módulo','t-success'],
  ['⚡ Nivel subido','David acaba de alcanzar Nivel 13 · Inversor Elite','t-fire'],
];

const FINANCIAL_FACTS = [
  {
    text:   'El <em>S&P 500</em> ha rentado un <em>+10% anual</em> de media en los últimos 100 años, convirtiendo €1.000 en €117.000 con paciencia.',
    source: 'Fuente: Standard & Poors, 1926–2024',
  },
  {
    text:   'Una inflación del <em>3% anual</em> reduce el poder adquisitivo de €10.000 a <em>€7.374</em> en tan solo 10 años si no están invertidos.',
    source: 'Fuente: Banco Central Europeo, media 1999–2024',
  },
  {
    text:   'El <em>90% de los fondos activos</em> no bate al índice en períodos de 15+ años. Los ETF indexados de bajo coste ganan a los expertos.',
    source: 'Fuente: SPIVA Report, S&P Global 2024',
  },
  {
    text:   'Invertir <em>€200/mes</em> desde los 25 años al 7% genera <em>€525.000</em> a los 65. Esperar hasta los 35 te deja en solo €242.000.',
    source: 'Cálculo: interés compuesto mensual, 7% nominal anual',
  },
  {
    text:   'El <em>Oro</em> ha subido un <em>+8% anual</em> los últimos 20 años y tiene correlación negativa con bolsa: sube cuando los mercados caen.',
    source: 'Fuente: London Bullion Market Association, 2004–2024',
  },
  {
    text:   '<em>Bitcoin</em> ha caído más del <em>80% en tres ocasiones</em> distintas y aun así es el activo con mayor retorno de los últimos 10 años.',
    source: 'Fuente: CoinGecko, Bloomberg 2014–2024',
  },
  {
    text:   'La Regla del <em>72</em>: divide 72 entre tu rentabilidad anual y sabrás en cuántos años doblas tu dinero. Al 9%, son 8 años.',
    source: 'Matemática financiera — usada por Buffett y gestores de fondos',
  },
  {
    text:   'El <em>47% de los españoles</em> no podría hacer frente a un gasto imprevisto de €1.000. El fondo de emergencia es la prioridad número 1.',
    source: 'Fuente: Banco de España, Encuesta Financiera 2023',
  },
  {
    text:   '<em>Warren Buffett</em> generó el <em>97% de su riqueza</em> después de los 65 años. El interés compuesto necesita tiempo para hacer su magia.',
    source: 'Fuente: Berkshire Hathaway Annual Letter 2022',
  },
  {
    text:   'Las empresas que han pagado dividendos crecientes durante <em>50+ años</em> consecutivos se llaman "Dividend Kings" — existen 53 en EE.UU.',
    source: 'Fuente: S&P Dividend Aristocrats Index, 2024',
  },
  {
    text: 'Invertir <em>€200/mes</em> desde los 25 años al 7% genera <em>€525.000</em> a los 65. Empezar a los 35 con el mismo aporte solo genera <em>€243.000</em>.',
    source: 'Fuente: Cálculo de interés compuesto estándar',
  },
  {
    text: 'El <em>88% de los millonarios</em> en EE.UU. se hicieron ricos de forma gradual, no por herencias ni loterías, sino por ahorro constante e inversión indexada.',
    source: 'Fuente: National Study of Millionaires, Ramsey Solutions 2023',
  },
  {
    text: 'Una comisión del <em>2% anual</em> en un fondo de inversión puede consumir hasta el <em>40% de tu rentabilidad total</em> en 30 años frente a un indexado al 0,1%.',
    source: 'Fuente: Vanguard Research, 2023',
  },
  {
    text: 'El <em>70% de los españoles</em> no tiene ningún tipo de inversión. Solo el 12% invierte en bolsa directamente o a través de fondos.',
    source: 'Fuente: CNMV, Encuesta de Competencias Financieras 2023',
  },
  {
    text: 'La deuda en tarjeta revolving al <em>24% TAE</em>: €5.000 pagando solo el mínimo mensual tarda <em>más de 10 años</em> en liquidarse y cuesta el doble en intereses.',
    source: 'Fuente: Banco de España, simulador de crédito',
  },
  {
    text: 'El <em>50-30-20</em>: destina el 50% a necesidades, 30% a deseos y 20% a ahorro e inversión. Simple, pero solo el 23% de españoles lo cumple.',
    source: 'Fuente: ING Direct, Estudio de Ahorro Europeo 2023',
  },
  {
    text: 'La vivienda en España ha rentado un <em>+3,2% anual real</em> desde 1985, frente al <em>+7,5% real</em> del S&P 500 en el mismo período.',
    source: 'Fuente: Banco de España / Bloomberg, datos históricos',
  },
  {
    text: 'Un <em>fondo de emergencia</em> de 6 meses reduce la probabilidad de endeudarse en una crisis en un <em>68%</em>, según estudios de comportamiento financiero.',
    source: 'Fuente: Urban Institute, Financial Health Study 2022',
  },
  {
    text: 'El <em>interés compuesto</em> no es lineal: €1.000 al 10% durante 30 años son €17.449. Los últimos 10 años generan más que los primeros 20.',
    source: 'Fuente: Cálculo estándar de interés compuesto',
  },
  {
    text: 'España tiene <em>más bares por habitante</em> que cualquier país de Europa, y también una de las tasas de ahorro más bajas: solo el <em>8,1% del PIB</em>.',
    source: 'Fuente: Eurostat, Household Saving Rate 2023',
  },
  {
    text: 'Los <em>gestores activos</em> cobran de media un 1,5% de comisión anual. En 20 años, eso representa <em>€30.000 de diferencia</em> en una cartera de €100.000.',
    source: 'Fuente: Morningstar Active/Passive Barometer 2023',
  },
  {
    text: 'La <em>independencia financiera</em> no requiere ser rico: con gastos de €1.500/mes necesitas €450.000. Con €1.000/mes, solo €300.000.',
    source: 'Fuente: Regla del 4%, Trinity Study',
  },
  {
    text: 'El <em>82% de las personas</em> que fijan metas financieras específicas (con número y fecha) las consiguen. Sin metas concretas, solo el 23%.',
    source: 'Fuente: Dominican University Goal-Setting Study',
  },
  {
    text: 'Retrasar la compra de un smartphone de €1.000 un año e invertir ese dinero al 7% anual durante 20 años genera <em>€3.870</em>.',
    source: 'Fuente: Cálculo de coste de oportunidad estándar',
  },
  {
    text: 'El <em>Euríbor a 12 meses</em> ha oscilado entre el -0,5% (2021) y el +4,2% (2023), afectando a más de <em>4 millones de hipotecas variables</em> en España.',
    source: 'Fuente: Banco de España, 2023',
  },
];

const DAILY_QUESTIONS = [
  {
    title: 'Micro-lección: Regla del 72',
    sub:   'Responde para desbloquear los módulos de hoy',
    xp: 40,
    q: 'Si una inversión rinde el 9% anual, ¿cuántos años tarda en doblar tu dinero según la Regla del 72?',
    opts: ['6 años', '8 años', '10 años', '12 años'],
    correct: 1,
    explain: '72 ÷ 9 = 8 años. Esta regla mental es usada por todos los inversores profesionales para estimaciones rápidas.',
  },
  {
    title: 'Micro-lección: Interés Compuesto',
    sub:   '30 segundos para ganar tu XP diario',
    xp: 40,
    q: '¿Cuál es el principal motivo por el que la inflación destruye el ahorro en cuentas sin rentabilidad?',
    opts: ['Los bancos roban el dinero', 'El dinero pierde poder adquisitivo con el tiempo', 'Los tipos de interés suben', 'El gobierno cobra impuestos'],
    correct: 1,
    explain: 'Con inflación del 3.5%, 10.000€ valen solo 6.756€ en 10 años. El dinero parado se deprecia automáticamente.',
  },
  {
    title: 'Micro-lección: ETFs vs Fondos',
    sub:   'Un dato clave para empezar el día',
    xp: 40,
    q: '¿Qué porcentaje de fondos de gestión activa supera al índice de referencia en períodos de 15+ años?',
    opts: ['Menos del 10%', 'Alrededor del 30%', 'Aproximadamente el 50%', 'Más del 70%'],
    correct: 0,
    explain: 'Solo el ~10% de gestores activos supera al índice a largo plazo. Por eso los ETF indexados baten a la mayoría.',
  },
  {
    title: 'Micro-lección: Regla 50/30/20',
    sub:   'La base de toda libertad financiera',
    xp: 40,
    q: 'En la regla de presupuesto 50/30/20, ¿qué representa el 20%?',
    opts: ['Gastos de ocio', 'Alquiler o hipoteca', 'Ahorro e inversión obligatorio', 'Impuestos y seguros'],
    correct: 2,
    explain: 'El 20% es el ahorro e inversión no negociable. Págarte a ti primero, antes que a cualquier otro gasto.',
  },
  {
    title: 'Micro-lección: Diversificación',
    sub:   'Entiende el riesgo para ganar más',
    xp: 40,
    q: '¿Qué significa diversificar una cartera de inversión?',
    opts: ['Invertir todo en el activo más rentable', 'Distribuir el riesgo entre diferentes tipos de activos', 'Cambiar de inversión cada semana', 'Guardar efectivo en varios bancos'],
    correct: 1,
    explain: 'Diversificar = no poner todos los huevos en la misma cesta. Si un activo cae, los otros compensan. La base del riesgo controlado.',
  },
  {
    title: 'Micro-lección: Fondo de Emergencia',
    sub:   'El escudo financiero que todos necesitan',
    xp: 40,
    q: '¿Cuántos meses de gastos fijos debe cubrir un fondo de emergencia adecuado?',
    opts: ['1 mes', '3–6 meses', '12 meses', 'No es necesario si tienes tarjeta de crédito'],
    correct: 1,
    explain: '3–6 meses de gastos en liquidez inmediata. Te protege de despidos, reparaciones inesperadas y enfermedades sin tocar tus inversiones.',
  },
  {
    title: 'Micro-lección: Deuda vs Inversión',
    sub:   '¿Pagar deuda o invertir primero?',
    xp: 40,
    q: 'Tienes una deuda al 18% TAE y una inversión que rinde el 8% anual. ¿Qué deberías priorizar?',
    opts: ['Invertir, porque el mercado siempre sube', 'Pagar la deuda primero, su coste supera el rendimiento de la inversión', 'Hacer las dos cosas en partes iguales siempre', 'Refinanciar la deuda indefinidamente'],
    correct: 1,
    explain: 'Eliminar una deuda al 18% es equivalente a una inversión garantizada al 18% — ningún mercado te da eso sin riesgo. Primero elimina la deuda cara.',
  },
  {
    title: 'Micro-lección: Inflación Real',
    sub:   'El impuesto invisible que nadie ve',
    xp: 40,
    q: 'Si la inflación es del 4% anual y tu cuenta de ahorro da el 1%, ¿cuál es tu rentabilidad real?',
    opts: ['5% positivo', '3% positivo', '-3% negativo', '0% — se compensan'],
    correct: 2,
    explain: 'Rentabilidad real = rendimiento nominal − inflación = 1% − 4% = −3%. Pierdes poder adquisitivo aunque el saldo nominal crezca.',
  },
  {
    title: 'Micro-lección: Coste de Oportunidad',
    sub:   'El precio invisible de cada decisión',
    xp: 40,
    q: 'Gastas 200€/mes en suscripciones que no usas. Si los invirtieras al 8% durante 20 años, ¿cuánto perderías?',
    opts: ['48.000€ (solo lo aportado)', 'Unos 60.000€', 'Aproximadamente 118.000€', 'Más de 200.000€'],
    correct: 2,
    explain: '200€/mes × 240 meses al 8% anual = ≈118.589€. El coste de oportunidad de gastos prescindibles es siempre mucho mayor de lo que parece.',
  },
  {
    title: 'Micro-lección: Rebalanceo de Cartera',
    sub:   'Mantén el rumbo cuando el mercado fluctúa',
    xp: 40,
    q: 'Tu cartera objetivo es 80% renta variable / 20% renta fija. Tras un año el mercado sube y queda en 90/10. ¿Qué haces?',
    opts: ['Nada, dejar correr las ganancias', 'Rebalancear vendiendo variable y comprando fija hasta volver al 80/20', 'Vender todo para asegurar ganancias', 'Doblar la posición en variable porque está subiendo'],
    correct: 1,
    explain: 'Rebalancear significa vender lo que más ha subido (caro) y comprar lo que ha bajado (barato) para mantener el riesgo objetivo. Es disciplina, no emoción.',
  },
  {
    title: 'Micro-lección: Fondo de Emergencia',
    sub: 'Responde para ganar tu XP diario',
    xp: 40,
    q: '¿Cuántos meses de gastos deberías tener en tu fondo de emergencia?',
    opts: ['1 mes', '2 meses', '3-6 meses', '12 meses'],
    correct: 2,
    explain: '3-6 meses es el estándar recomendado. Menos te deja expuesto; más puede ser exceso de liquidez sin rentabilidad.',
  },
  {
    title: 'Micro-lección: Inflación',
    sub: '30 segundos para tu racha',
    xp: 40,
    q: 'Si la inflación es del 3% anual, ¿cuánto valdrán €100 de hoy en 10 años?',
    opts: ['€130', '€100', '€74', '€56'],
    correct: 2,
    explain: '€100 × (1-0.03)^10 ≈ €74. La inflación destruye el poder adquisitivo silenciosamente.',
  },
  {
    title: 'Micro-lección: ETF vs Fondo Activo',
    sub: 'Responde y mantén tu racha',
    xp: 40,
    q: '¿Qué porcentaje de fondos de gestión activa baten al índice en 10 años?',
    opts: ['Menos del 10%', 'Alrededor del 25%', 'Alrededor del 50%', 'Más del 75%'],
    correct: 0,
    explain: 'Según SPIVA, menos del 10% de fondos activos superan a su índice de referencia en un horizonte de 10 años.',
  },
  {
    title: 'Micro-lección: Deuda',
    sub: 'Tu acción financiera del día',
    xp: 40,
    q: 'Tienes €5.000 en deuda al 18% TAE. ¿Cuánto pagas en intereses al año si no reduces el principal?',
    opts: ['€500', '€900', '€1.800', '€2.500'],
    correct: 1,
    explain: '€5.000 × 18% = €900 al año solo en intereses. Eliminar deuda cara es la mejor inversión garantizada.',
  },
  {
    title: 'Micro-lección: Pensión Pública',
    sub: '30 segundos para tu XP',
    xp: 40,
    q: '¿Qué tasa de sustitución tiene de media la pensión pública española respecto al último salario?',
    opts: ['40%', '55%', '72%', '90%'],
    correct: 2,
    explain: 'España tiene una tasa de sustitución del ~72%, una de las más altas de Europa. Aun así, complementarla con ahorro privado es recomendable.',
  },
  {
    title: 'Micro-lección: Bolsa a largo plazo',
    sub: 'Responde para mantener tu racha',
    xp: 40,
    q: '¿Cuántos años consecutivos ha tenido rentabilidad negativa el S&P 500 como máximo en su historia?',
    opts: ['1 año', '2 años', '3 años', '5 años'],
    correct: 2,
    explain: 'El peor período fue 2000-2002 (3 años consecutivos negativos). En ningún período de 15+ años ha dado pérdidas.',
  },
  {
    title: 'Micro-lección: Regla del 4%',
    sub: 'Tu micro-test de hoy',
    xp: 40,
    q: 'Según la regla del 4%, si gastas €2.000/mes, ¿qué patrimonio necesitas para la independencia financiera?',
    opts: ['€240.000', '€360.000', '€600.000', '€1.200.000'],
    correct: 2,
    explain: '€2.000 × 12 × 25 = €600.000. La regla del 4% dice que puedes retirar el 4% anual indefinidamente.',
  },
  {
    title: 'Micro-lección: Euríbor',
    sub: 'Responde y gana XP',
    xp: 40,
    q: '¿Qué es el Euríbor?',
    opts: ['El tipo de cambio €/$ oficial', 'El índice al que se referencian las hipotecas variables en Europa', 'El IPC de la eurozona', 'El tipo de interés del BCE'],
    correct: 1,
    explain: 'El Euríbor (Euro Interbank Offered Rate) es el tipo al que los bancos europeos se prestan dinero entre sí, y al que se referencian la mayoría de hipotecas variables españolas.',
  },
  {
    title: 'Micro-lección: Coste de Oportunidad',
    sub: '30 segundos para tu racha financiera',
    xp: 40,
    q: 'Compras un coche de €20.000 al contado. ¿Cuál es el coste de oportunidad en 10 años al 7% de rentabilidad?',
    opts: ['€14.000', '€19.000', '€39.000', '€60.000'],
    correct: 2,
    explain: '€20.000 al 7% durante 10 años = €39.343. Ese es el coste real del coche: lo que no ganarás por haber gastado ese capital.',
  },
  {
    title: 'Micro-lección: Diversificación Geográfica',
    sub: 'Tu acción del día',
    xp: 40,
    q: '¿Qué porcentaje del PIB mundial representa el mercado bursátil estadounidense aproximadamente?',
    opts: ['25%', '40%', '60%', '75%'],
    correct: 2,
    explain: 'EE.UU. representa ~60% de la capitalización mundial. Un ETF global como MSCI World tiene exposición mayoritaria a EE.UU.',
  },
  {
    title: 'Micro-lección: Tipos de Interés',
    sub: 'Responde para ganar tu XP',
    xp: 40,
    q: 'Cuando el Banco Central Europeo sube los tipos de interés, ¿qué ocurre generalmente con los precios de los bonos?',
    opts: ['Suben', 'Se mantienen igual', 'Bajan', 'Depende del emisor'],
    correct: 2,
    explain: 'Tipos y precios de bonos tienen relación inversa. Si los tipos suben, los bonos existentes (con tipos más bajos) valen menos en el mercado secundario.',
  },
  {
    title: 'Micro-lección: Ahorro Automático',
    sub: '30 segundos para tu racha',
    xp: 40,
    q: '¿Qué estrategia de ahorro tiene mayor tasa de éxito según estudios de comportamiento financiero?',
    opts: ['Ahorrar lo que sobra a fin de mes', 'Pagar todas las deudas antes de ahorrar', 'Automatizar el ahorro el día de cobro', 'Revisar gastos semanalmente'],
    correct: 2,
    explain: 'Págarte a ti primero (Pay yourself first): automatizar el ahorro elimina la fricción y el sesgo del presente que nos hace gastar en lugar de ahorrar.',
  },
  {
    title: 'Micro-lección: TAE vs TIN',
    sub: 'Tu micro-test financiero',
    xp: 40,
    q: '¿Cuál es la diferencia entre TIN y TAE?',
    opts: ['Son lo mismo', 'TAE incluye comisiones y frecuencia de liquidación; TIN no', 'TIN incluye más costes que TAE', 'TAE es solo para hipotecas'],
    correct: 1,
    explain: 'La TAE (Tasa Anual Equivalente) incluye comisiones y la frecuencia de capitalización. Siempre compara por TAE, no por TIN.',
  },
  {
    title: 'Micro-lección: Dividendos',
    sub: 'Responde y mantén tu racha',
    xp: 40,
    q: '¿Qué retención fiscal aplica Hacienda sobre los dividendos en España (tramo base)?',
    opts: ['10%', '15%', '19%', '21%'],
    correct: 2,
    explain: 'Los dividendos tributan como rendimientos del capital mobiliario al 19% hasta €6.000, 21% de €6.000 a €50.000 y 23% a partir de €50.000.',
  },
  {
    title: 'Micro-lección: FIRE Movement',
    sub: 'Tu acción del día',
    xp: 40,
    q: '¿Qué significa el acrónimo FIRE en finanzas personales?',
    opts: ['Financial Independence, Retire Early', 'Fixed Income, Real Estate', 'Funds, Investments, Returns, Equity', 'Financial Index, Retire Efficiently'],
    correct: 0,
    explain: 'FIRE es un movimiento que busca la independencia financiera y jubilación anticipada mediante ahorro agresivo (50-70% del ingreso) e inversión pasiva.',
  },
  {
    title: 'Micro-lección: Plan de Pensiones',
    sub: 'Responde para ganar XP',
    xp: 40,
    q: '¿Cuál es el límite anual de aportación a un plan de pensiones individual en España (2024)?',
    opts: ['€1.500', '€3.000', '€8.000', '€10.000'],
    correct: 0,
    explain: 'Desde 2022 el límite es €1.500/año para planes individuales. Aportar hasta ese límite reduce tu base imponible del IRPF.',
  },
  {
    title: 'Micro-lección: Sesgo del Presente',
    sub: '30 segundos de educación financiera',
    xp: 40,
    q: '¿Qué sesgo cognitivo nos hace preferir €100 hoy a €150 en un año aunque la tasa implícita sea del 50%?',
    opts: ['Sesgo de confirmación', 'Efecto manada', 'Descuento hiperbólico', 'Aversión a la pérdida'],
    correct: 2,
    explain: 'El descuento hiperbólico nos hace sobrevalorar el presente frente al futuro. Es el principal enemigo del ahorro a largo plazo.',
  },
  {
    title: 'Micro-lección: Inflación vs Salario',
    sub: 'Tu micro-test de hoy',
    xp: 40,
    q: 'Si tu salario sube un 2% pero la inflación es del 4%, ¿qué ha pasado con tu poder adquisitivo real?',
    opts: ['Ha subido un 2%', 'Se ha mantenido igual', 'Ha bajado un 2%', 'Ha bajado un 4%'],
    correct: 2,
    explain: 'Salario real = (1+0.02)/(1+0.04) - 1 ≈ -1.9%. Tu poder de compra ha bajado aunque cobres más euros nominales.',
  },
  {
    title: 'Micro-lección: Índice de Precios',
    sub: 'Responde y gana tu XP diario',
    xp: 40,
    q: '¿Qué mide el IPC (Índice de Precios al Consumo)?',
    opts: ['El precio de las acciones en bolsa', 'La variación de precios de una cesta representativa de bienes y servicios', 'El tipo de cambio del euro', 'El coste de la vivienda'],
    correct: 1,
    explain: 'El IPC mide la variación de precios de una cesta de bienes y servicios representativa del consumo familiar. Es el indicador principal de la inflación.',
  },
];

const REWARDS = {
  chests: [
    {icon:'🎁', name:'Cofre de bronce', desc:'Una recompensa modesta pero merecida', xpBonus:50, color:'#c8773d'},
    {icon:'💰', name:'Cofre de plata', desc:'¡Buena suerte! Bonus de XP especial', xpBonus:100, color:'#94a3b8'},
    {icon:'🏆', name:'Cofre de oro', desc:'¡Rarísimo! XP de oro puro', xpBonus:200, color:'#fbbf24'},
  ],
  badges: [
    {icon:'⚡', name:'Rayo del Conocimiento', desc:'Badge raro · Solo el 8% lo consigue'},
    {icon:'🧠', name:'Mente Brillante', desc:'Badge raro · Pensamiento analítico elite'},
    {icon:'🔮', name:'Visionario Financiero', desc:'Badge raro · Ves más allá del presente'},
    {icon:'🦋', name:'Transformación', desc:'Badge raro · Tu mentalidad ha cambiado'},
  ],
};

const IDENTITY_STAGES = [
  {id:0, icon:'🌱', name:'Principiante', desc:'Empezando el camino', minMods:0, minXP:0, days:0},
  {id:1, icon:'💰', name:'Ahorrador', desc:'Dominas las bases', minMods:2, minXP:500, days:23},
  {id:2, icon:'📊', name:'Analista', desc:'Entiendes los mercados', minMods:5, minXP:2000, days:15},
  {id:3, icon:'💼', name:'Inversor', desc:'Inviertes con criterio', minMods:8, minXP:5000, days:40},
  {id:4, icon:'🏝️', name:'Independiente', desc:'Libertad financiera real', minMods:19, minXP:15000, days:120},
];

/* ── P4-B: Títulos de nivel por XP acumulado ─────────────────────── */
const LEVEL_XP_THRESHOLDS = (function() {
  // XP necesario para pasar de nivel N al N+1
  // Empieza en 200 XP y crece progresivamente hasta ~12.000 XP en los últimos niveles
  function xpForLevel(n) {
    return Math.round(200 * Math.pow(1 + (n - 1) * 0.13, 1.5) / 25) * 25;
  }
  const t = [0]; // t[0]=0 significa que el nivel 1 empieza en 0 XP acumulado
  for (let i = 1; i <= 50; i++) t.push(t[i - 1] + xpForLevel(i));
  return t;
})();

const LEVEL_TITLES = [
  { idx:0,  minXP:0,      title:'Aprendiz Financiero',    icon:'🌱', color:'#94a3b8', desc:'El camino comienza aquí. Cada experto fue una vez principiante.' },
  { idx:1,  minXP:500,    title:'Ahorrador Consciente',   icon:'💰', color:'#4ade80', desc:'Primera regla: gastar menos de lo que ganas.' },
  { idx:2,  minXP:1200,   title:'Gestor de Gastos',       icon:'📋', color:'#6ee7b7', desc:'Controlas tu dinero, no al revés.' },
  { idx:3,  minXP:2200,   title:'Inversor Novato',        icon:'📈', color:'#60a5fa', desc:'Tu dinero empieza a trabajar para ti.' },
  { idx:4,  minXP:3500,   title:'Cazador de Intereses',   icon:'🎯', color:'#818cf8', desc:'El interés compuesto ya es tu aliado.' },
  { idx:5,  minXP:5200,   title:'Analista en Prácticas',  icon:'🔍', color:'#c084fc', desc:'Lees balances, entiendes ratios.' },
  { idx:6,  minXP:7500,   title:'Estratega de Cartera',   icon:'♟️', color:'#e879f9', desc:'Diversificas con criterio propio.' },
  { idx:7,  minXP:10500,  title:'Gestor de Patrimonio',   icon:'💼', color:'#fb923c', desc:'Construyes riqueza con estrategia.' },
  { idx:8,  minXP:14500,  title:'Experto en ETFs',        icon:'🏦', color:'#fbbf24', desc:'Indexado, diversificado, imparable.' },
  { idx:9,  minXP:20000,  title:'Analista Financiero',    icon:'📊', color:'#f87171', desc:'Tu análisis supera al inversor medio.' },
  { idx:10, minXP:27000,  title:'Estratega Financiero',   icon:'🧠', color:'#00e5a0', desc:'Piensas en sistemas, no en eventos.' },
  { idx:11, minXP:36000,  title:'Especialista en Riesgo', icon:'⚖️', color:'#38bdf8', desc:'Calculas el riesgo antes de actuar.' },
  { idx:12, minXP:47000,  title:'Inversor de Valor',      icon:'💎', color:'#a78bfa', desc:'Compras valor, no precio.' },
  { idx:13, minXP:61000,  title:'Maestro del Ahorro',     icon:'🏆', color:'#fcd34d', desc:'Tu tasa de ahorro es tu superpoder.' },
  { idx:14, minXP:78000,  title:'Director de Inversiones',icon:'🏛️', color:'#f472b6', desc:'Pocos llegan aquí. Tu criterio manda.' },
  { idx:15, minXP:99000,  title:'Arquitecto Financiero',  icon:'🔭', color:'#34d399', desc:'Diseñas carteras que duran décadas.' },
  { idx:16, minXP:125000, title:'Gurú de los Mercados',   icon:'🌍', color:'#fb7185', desc:'Los mercados no te sorprenden.' },
  { idx:17, minXP:157000, title:'Magnate en Construcción',icon:'🏗️', color:'#a3e635', desc:'Tu patrimonio crece sin parar.' },
  { idx:18, minXP:196000, title:'Inversor Elite',         icon:'⚡', color:'#22d3ee', desc:'Top 5% de usuarios de FinLearn.' },
  { idx:19, minXP:243000, title:'Leyenda Financiera',     icon:'🌟', color:'#fbbf24', desc:'Tu nombre ya es referente.' },
  { idx:20, minXP:300000, title:'Maestro FinLearn',       icon:'👑', color:'#ff6b35', desc:'Cumbre alcanzada. El 1% del 1%.' },
];

const EXAM_QUESTION_POOL = [
  // ── Módulo 0: Interés Compuesto ──
  {
    q:'¿Cuál es el resultado de aplicar la Regla del 72 a una tasa del 6% anual?',
    opts:[
      {t:'El capital se dobla en 12 años',          ok:true},
      {t:'El capital se dobla en 6 años',           ok:false},
      {t:'El capital crece un 72% en 6 años',       ok:false},
      {t:'La regla solo aplica a tasas del 8%+',    ok:false},
    ],
    ok:'72 ÷ 6 = 12 años para doblar el capital. La Regla del 72 es una aproximación logarítmica válida entre el 2% y el 15% con menos del 1% de error.',
    bad:'La Regla del 72: divide 72 entre el porcentaje de rendimiento. 72 ÷ 6 = 12 años para doblar. Es una de las herramientas de cálculo mental más usadas por inversores profesionales.',
    module:'Interés Compuesto',
  },
  {
    q:'Si inviertes 1.000€ al 10% anual con interés compuesto, ¿cuánto tienes en 20 años?',
    opts:[
      {t:'€3.000 (interés simple: 1.000 + 200×10)',    ok:false},
      {t:'€6.727 (interés compuesto: 1.000×1,1^20)',   ok:true},
      {t:'€5.000 (media entre simple y compuesto)',     ok:false},
      {t:'€10.000 (suposición de 10% directo)',         ok:false},
    ],
    ok:'1.000 × (1,10)^20 = 1.000 × 6,7275 = 6.727€. Con interés simple serían solo 3.000€. La diferencia de 3.727€ es puro interés compuesto — intereses sobre intereses acumulados durante 20 años.',
    bad:'El cálculo correcto es 1.000 × (1,10)^20 = 6.727€. El interés simple daría 3.000€ (1.000 de capital + 200€/año × 10 años). La diferencia de 3.727€ demuestra la potencia exponencial del interés compuesto.',
    module:'Interés Compuesto',
  },
  {
    q:'¿Cuál de estos describe mejor el "coste de oportunidad" en finanzas personales?',
    opts:[
      {t:'El precio que paga un consumidor por una oportunidad de compra',              ok:false},
      {t:'El valor de la mejor alternativa a la que renuncias al tomar una decisión',  ok:true},
      {t:'Los intereses que pierdes al pagar una deuda anticipadamente',                ok:false},
      {t:'La comisión que cobra un broker por ejecutar una orden de compra',           ok:false},
    ],
    ok:'El coste de oportunidad es el valor de la mejor alternativa a la que renuncias. Si gastas 3€ en café en lugar de invertirlos, el coste de oportunidad no son 3€ sino los 3€ más todos los intereses compuestos que habrían generado durante décadas.',
    bad:'El coste de oportunidad es el valor de la alternativa no elegida. Al gastar dinero en consumo, renuncias a lo que ese dinero habría generado si se hubiera invertido. Este concepto obliga a pensar en el precio real de cada gasto.',
    module:'Interés Compuesto',
  },
  // ── Módulo 1: ETFs y Arquitectura ──
  {
    q:'¿Qué significa TER en el contexto de los fondos de inversión?',
    opts:[
      {t:'Total Earnings Rate — tasa de rentabilidad total del fondo',         ok:false},
      {t:'Total Expense Ratio — porcentaje anual de comisiones sobre el capital', ok:true},
      {t:'Tax Efficiency Ratio — eficiencia fiscal del producto financiero',   ok:false},
      {t:'Trading Execution Rate — coste de las operaciones internas del fondo', ok:false},
    ],
    ok:'TER (Total Expense Ratio) es el porcentaje anual que cobra el fondo sobre tu capital. Un ETF indexado cobra 0,03-0,20% vs 1,5-2,5% de los fondos activos. La diferencia compuesta a 30 años puede superar el 30% de tu patrimonio final.',
    bad:'TER = Total Expense Ratio. Es el coste anual total del fondo expresado como porcentaje del capital invertido. Incluye comisión de gestión, depositaría y otros gastos. Es el factor más determinante en la rentabilidad neta a largo plazo.',
    module:'Arquitectura de Cartera',
  },
  {
    q:'Según el SPIVA Report de S&P Global, ¿qué ocurre con la mayoría de fondos activos en períodos de 15+ años?',
    opts:[
      {t:'Baten al índice gracias a la gestión activa en mercados volátiles',          ok:false},
      {t:'Rinden igual que el índice pero con menor volatilidad',                     ok:false},
      {t:'No superan al índice de referencia — aproximadamente el 85-92% fracasa',    ok:true},
      {t:'Solo fracasan los fondos de pequeñas gestoras; las grandes siempre baten',  ok:false},
    ],
    ok:'El SPIVA Report analiza miles de fondos activos desde 2002. La conclusión es consistente: el 85-92% de los fondos activos no supera a su índice de referencia en períodos de 15+ años. Este dato es la base empírica más sólida para la inversión indexada.',
    bad:'El SPIVA Report de S&P Global demuestra sistemáticamente que el 85-92% de los fondos activos no supera al índice en períodos largos. El dato es consistente en EE.UU., Europa y mercados emergentes, y no ha mejorado a pesar de décadas de evolución de la industria.',
    module:'Arquitectura de Cartera',
  },
  // ── Módulo 2: Psicología ──
  {
    q:'El "sesgo de recencia" en inversión hace que los inversores:',
    opts:[
      {t:'Inviertan más en activos que recibieron premios recientes',                          ok:false},
      {t:'Sobreponderen eventos recientes al tomar decisiones, ignorando el largo plazo',      ok:true},
      {t:'Recuerden solo las pérdidas y olviden las ganancias',                               ok:false},
      {t:'Prefieran inversiones que conocen desde hace mucho tiempo',                          ok:false},
    ],
    ok:'El sesgo de recencia hace que los inversores asuman que lo que pasó recientemente seguirá pasando. Tras un crash, asumen que el mercado seguirá cayendo (y venden en el peor momento). Tras una racha alcista, asumen que continuará (y compran en el peor momento). Es uno de los sesgos más costosos del inversor típico.',
    bad:'El sesgo de recencia es la tendencia a sobreponderar eventos recientes. Tras un crash, el inversor cree que la caída continuará. Tras una subida fuerte, cree que seguirá subiendo. Ambas predicciones son erróneas estadísticamente — y llevan a comprar caro y vender barato.',
    module:'Psicología del Inversor',
  },
  {
    q:'¿Qué es la "aversión a las pérdidas" según Kahneman y Tversky?',
    opts:[
      {t:'La tendencia a evitar toda inversión que pueda perder valor',                   ok:false},
      {t:'El fenómeno por el que una pérdida duele psicológicamente ~2,5 veces más que una ganancia equivalente', ok:true},
      {t:'La incapacidad de vender activos en pérdidas por razones emocionales',         ok:false},
      {t:'El miedo irracional a perder el trabajo en períodos de recesión económica',    ok:false},
    ],
    ok:'Kahneman y Tversky demostraron que la utilidad de perder 100€ es aproximadamente 2,5 veces mayor en negativo que la utilidad de ganar 100€ en positivo. Este asimetría hace que los inversores sean demasiado aversos al riesgo en situaciones de pérdida, vendiendo en pánico cuando el mercado cae.',
    bad:'La aversión a las pérdidas (Prospect Theory, Nobel 2002) dice que una pérdida de X duele ~2,5 veces más que el placer de ganar X. Por eso los inversores venden activos en caída (para "parar el dolor") aunque la decisión racional sea mantener o comprar más.',
    module:'Psicología del Inversor',
  },
  // ── Módulo 3: Ciclo de la Deuda ──
  {
    q:'En el método Avalanche para eliminar deudas, ¿cuál es la deuda que se ataca primero?',
    opts:[
      {t:'La de menor saldo, para eliminarla rápido',                              ok:false},
      {t:'La de mayor saldo total, para reducir el capital pendiente',             ok:false},
      {t:'La de mayor tipo de interés, independientemente del saldo',              ok:true},
      {t:'La más reciente, porque tendrá peores condiciones',                      ok:false},
    ],
    ok:'El método Avalanche prioriza el tipo de interés, no el saldo. La deuda con mayor TAE destruye más patrimonio por euro de saldo pendiente cada mes que pasa. Eliminarla primero minimiza el total de intereses pagados durante todo el proceso. Es el método matemáticamente óptimo.',
    bad:'Avalanche = ataca el mayor tipo de interés primero. Una tarjeta al 22% destruye 22 céntimos de patrimonio por cada euro de deuda cada año. Un préstamo al 3% destruye solo 3 céntimos. Eliminar el 22% primero ahorra más dinero total aunque tarde más en verse la primera deuda a cero.',
    module:'Ciclo de la Deuda',
  },
  {
    q:'Según Ray Dalio, ¿qué caracteriza al "desapalancamiento bello" (beautiful deleveraging)?',
    opts:[
      {t:'La eliminación total de la deuda en la economía en el mínimo tiempo posible',   ok:false},
      {t:'El equilibrio entre austeridad, reestructuración y estímulo monetario moderado', ok:true},
      {t:'Una subida de tipos de interés para controlar la inflación del boom crediticio', ok:false},
      {t:'La condonación total de las deudas privadas por parte del Estado',               ok:false},
    ],
    ok:'El "beautiful deleveraging" de Dalio equilibra cuatro herramientas: austeridad (reduce gastos), reestructuración de deuda (quitas y refinanciaciones), redistribución (impuestos a los más ricos) y monetización moderada (el banco central imprime, pero no tanto como para causar hiperinflación). El balance entre deflación y reflación es lo que lo hace "bello".',
    bad:'El desapalancamiento bello de Dalio requiere equilibrar cuatro palancas simultáneamente: austeridad, reestructuración de deuda, redistribución fiscal y monetización moderada por el banco central. Demasiada austeridad lleva a depresión; demasiada monetización lleva a hiperinflación.',
    module:'Ciclo de la Deuda',
  },
  // ── Módulo 4: Fiscalidad e Inflación ──
  {
    q:'¿Cuál es la principal ventaja fiscal del "traspaso de fondos" en España para el inversor de largo plazo?',
    opts:[
      {t:'Los traspasos entre fondos están exentos de tributación indefinidamente',               ok:false},
      {t:'Puedes cambiar de fondo sin generar evento fiscal hasta la venta final',                ok:true},
      {t:'El traspaso permite deducir el importe en la Base General del IRPF',                   ok:false},
      {t:'Los fondos traspasados tributan al tipo reducido del 10%',                             ok:false},
    ],
    ok:'El traspaso de fondos en España permite mover el capital de un fondo a otro sin generar un evento fiscal (no hay tributación en la Base del Ahorro en el momento del traspaso). Solo se tributa cuando se realiza el reembolso final. Esto permite rebalancear la cartera de fondos sin coste fiscal y diferir la tributación indefinidamente.',
    bad:'El traspaso de fondos: puedes mover capital entre fondos de inversión españoles sin tributar en ese momento. Solo hay evento fiscal cuando realizas el reembolso (venta) final. Esta característica (no disponible en ETFs directamente) permite rebalancear y cambiar de estrategia sin coste fiscal inmediato.',
    module:'Fiscalidad e Inflación',
  },
  {
    q:'Tienes 20.000€ en cuenta corriente al 0%. La inflación anual es del 3,5%. ¿Cuánto poder adquisitivo pierdes en 5 años?',
    opts:[
      {t:'Nada, porque el dinero nominal sigue siendo 20.000€',                     ok:false},
      {t:'700€ (3,5% × 20.000€ × 1 año, sin considerar el compuesto)',             ok:false},
      {t:'Aproximadamente 3.224€ de poder adquisitivo (efecto compuesto 5 años)',   ok:true},
      {t:'El 3,5% exacto de 20.000€ cada año = 3.500€ totales',                   ok:false},
    ],
    ok:'Con inflación del 3,5% compuesto durante 5 años, el poder adquisitivo se reduce al 83,9% del original: 20.000€ × (1-0,035)^5 = 20.000 × 0,8388 = 16.776€ de poder adquisitivo real. Pérdida: 3.224€. No perdes el dinero nominal, pero pierdes lo que puedes comprar con él.',
    bad:'El poder adquisitivo real después de 5 años: 20.000 × (1−0,035)^5 = 20.000 × 0,8388 ≈ 16.776€. Pérdida de 3.224€ de poder adquisitivo. La inflación es "compuesta" también: el 3,5% del año 2 se aplica sobre los ya-reducidos 19.300€, no sobre los 20.000€ originales.',
    module:'Fiscalidad e Inflación',
  },
  // ── Preguntas adicionales de refuerzo ──
  {
    q:'¿Qué es el "market timing" y cuál es la evidencia empírica sobre su efectividad?',
    opts:[
      {t:'Comprar en mínimos y vender en máximos — funciona con el análisis técnico correcto',   ok:false},
      {t:'Predecir los movimientos de mercado — estadísticamente ineficaz para la mayoría',      ok:true},
      {t:'Ajustar la cartera según los ciclos económicos macroeconómicos estacionales',         ok:false},
      {t:'Un software de trading automático que optimiza el momento de cada operación',          ok:false},
    ],
    ok:'El market timing es intentar comprar en mínimos y vender en máximos. Décadas de evidencia empírica demuestran que es imposible hacerlo consistentemente incluso para gestores profesionales. Un estudio de Dalbar muestra que los inversores que intentan hacer market timing obtienen rentabilidades muy por debajo de quienes simplemente mantienen (buy & hold) con aportaciones regulares.',
    bad:'El market timing es estadísticamente ineficaz. Incluso si aciertas el timing en un crash, es casi imposible saber cuándo re-entrar. Estudios muestran que perderse los 10 mejores días de bolsa en 20 años reduce tu rentabilidad total a la mitad. Los mejores días suelen ocurrir justo después de los peores — cuando el pánico lleva a vender.',
    module:'Psicología del Inversor',
  },
  {
    q:'¿Qué representa el "alfa" en la gestión de carteras?',
    opts:[
      {t:'La volatilidad total de una cartera en relación al mercado',                        ok:false},
      {t:'La rentabilidad adicional obtenida por encima del benchmark gracias a la gestión', ok:true},
      {t:'La comisión de éxito que cobra un gestor sobre las ganancias',                     ok:false},
      {t:'La proporción de renta variable en una cartera equilibrada',                       ok:false},
    ],
    ok:'El alfa mide la rentabilidad generada por la habilidad del gestor, más allá de lo que el mercado (beta) habría dado. Un alfa positivo del 2% significa que el gestor superó al benchmark en un 2% ajustado por riesgo. El problema: la mayoría de los gestores generan alfa negativo a largo plazo (fees incluidas), lo que explica la superioridad estadística de los ETF indexados.',
    bad:'El alfa es el exceso de rentabilidad atribuible a la habilidad del gestor versus simplemente seguir al mercado. Un alfa de 0% significa que el gestor reprodujo exactamente el benchmark. Alfa negativo (el más frecuente a largo plazo) significa que habría sido mejor invertir en un ETF indexado.',
    module:'Arquitectura de Cartera',
  },
  /* ─ M108 ─ El poder del ahorro automático ─ */
  { id:108, icon:'🤖', title:'El Ahorro Automático: Paga Primero a Ti Mismo',
    desc:'Cómo automatizar el ahorro para que nunca dependa de tu fuerza de voluntad',
    xp:18, tag:'FUNDAMENTOS', tagC:'green', users:'31.200',
    steps:[
      { type:'content', tag:'🤖 M108', title:'La Fuerza de Voluntad es Finita',
        intro:'El 72% de las personas que intentan ahorrar "lo que sobre" a fin de mes no consiguen nada. La solución no es más disciplina — es menos fricción.',
        bullets:[
          '🤖 Regla del "págate primero": el día de cobro, transfiere automáticamente el % de ahorro ANTES de ver el dinero',
          '📅 Domiciliación el día +1 de cobro: si cobras el 28, el 29 ya sale hacia tu fondo o cuenta de ahorro',
          '📊 Empieza pequeño: el 5% es mejor que el 0%. Sube un 1% cada 3 meses sin sentirlo',
          '🏦 Cuenta separada sin tarjeta: el dinero que no ves no lo gastas. Cuenta de ahorro ≠ cuenta corriente',
          '⚡ Automatiza también la inversión: orden permanente de aportación mensual a tu ETF',
          '🎯 El objetivo: en 12 meses tener el ahorro tan automatizado que apenas lo notes',
        ],
        fact:'Los estudios de behavioral finance demuestran que automatizar el ahorro es 3 veces más eficaz que decidirlo mes a mes. El mejor momento para hacer la transferencia es siempre el mismo día, no "cuando pueda".'},
      { type:'quiz', title:'¿Cuál es la estrategia más eficaz para ahorrar consistentemente?',
        opts:[
          {t:'Ahorrar lo que sobre después de los gastos del mes', ok:false},
          {t:'Automatizar una transferencia el día de cobro antes de gastar', ok:true},
          {t:'Revisar los gastos semanalmente y ajustar', ok:false},
          {t:'Poner una cantidad fija el último día del mes', ok:false},
        ],
        ok:'¡Correcto! "Págate primero" + automatización elimina la decisión y la fricción. No depende de voluntad sino de un sistema.',
        bad:'Ahorrar "lo que sobre" es el método menos efectivo. La automatización al día de cobro elimina la tentación y garantiza consistencia.'},
      { type:'final', xp:18, msg:'¡Sistema de ahorro automatizado! Tu futuro yo te lo agradecerá sin que tengas que recordarlo.'},
    ]},
  /* ─ M109 ─ Cómo negociar tu sueldo ─ */
  { id:109, icon:'💼', title:'Negociación Salarial: Cobra lo que Vales',
    desc:'El guión exacto para pedir un aumento o negociar en una oferta de trabajo',
    xp:24, tag:'PRÁCTICA', tagC:'blue', users:'28.900',
    steps:[
      { type:'content', tag:'💼 M109', title:'El Mayor Error Financiero de tu Carrera',
        intro:'No negociar el salario en el primer trabajo puede costarte €200.000+ a lo largo de tu carrera. Cada aumento futuro parte de la base anterior. La primera cifra importa más de lo que crees.',
        bullets:[
          '🔍 Investiga primero: Glassdoor, LinkedIn Salary, InfoJobs — conoce el rango de mercado antes de sentarte',
          '💡 Ancla alto: da siempre la primera cifra tú. Quien ancla primero controla el rango de negociación',
          '🎯 Pide un 15-20% más de lo que aceptarías — deja espacio para ceder y quedar en tu objetivo real',
          '📊 Justifica con datos: "El rango de mercado para este rol en Madrid es €X-Y. Dada mi experiencia en Z, busco €X"',
          '⏸️ El silencio es tu aliado: después de dar tu cifra, calla. Quien habla primero pierde poder de negociación',
          '🤝 Si dicen no al dinero: negocia variables — días de teletrabajo, formación, revisión a 6 meses, bonus',
        ],
        fact:'Un estudio de Carnegie Mellon demostró que los profesionales que negocian su primer sueldo ganan €650.000 más a lo largo de su carrera que los que no negocian. La diferencia es una conversación de 10 minutos.'},
      { type:'quiz', title:'Te ofrecen €35.000 y tú quieres €38.000. ¿Cuál es la mejor respuesta?',
        opts:[
          {t:'"Muchas gracias, lo acepto"', ok:false},
          {t:'"Estaba pensando en algo más cercano a €42.000 para este rol"', ok:true},
          {t:'"Son muy pocos, no puedo aceptar menos de €38.000"', ok:false},
          {t:'"¿Podéis subir un poquito?"', ok:false},
        ],
        ok:'¡Correcto! Anclar en €42.000 deja espacio para ceder hasta tu objetivo real de €38.000. Justificado con el mercado es completamente profesional.',
        bad:'Anclar por encima de tu objetivo real y dejar espacio para negociar es la técnica correcta. Pedir directamente €38.000 o ser vago debilita tu posición.'},
      { type:'final', xp:24, msg:'¡Negociador salarial desbloqueado! Cada negociación que hagas desde hoy tendrá más impacto que mil horas de trabajo extra.'},
    ]},
  /* ─ M110 ─ Finanzas para freelancers ─ */
  { id:110, icon:'🎯', title:'Finanzas para Freelancers: el Sistema de las 4 Cuentas',
    desc:'Cómo gestionar ingresos irregulares, impuestos y ahorro cuando eres tu propio jefe',
    xp:26, tag:'PRÁCTICA', tagC:'orange', users:'21.400',
    steps:[
      { type:'content', tag:'🎯 M110', title:'El Problema del Freelance: Ingresos del Todo o Nada',
        intro:'El mayor riesgo financiero del freelance no es ganar poco — es gastar los meses buenos como si fueran siempre así. El sistema de 4 cuentas lo resuelve.',
        bullets:[
          '🏦 Cuenta 1 — Operaciones: todos los ingresos entran aquí. Solo se usa para cobrar clientes',
          '💰 Cuenta 2 — Impuestos (25-30%): el día que cobras, transfiere el 25-30% aquí. Es dinero de Hacienda, no tuyo',
          '🛡️ Cuenta 3 — Fondo reserva (3-6 meses gastos): los meses buenos repones. Los malos, tiras de aquí sin culpa',
          '📈 Cuenta 4 — Inversión: lo que sobre después de las 3 anteriores va a tu cartera ETF',
          '💸 Tarifa mínima viable: calcula tus costes fijos + cuota autónomo + IRPF + margen. Esa es tu tarifa suelo',
          '📅 Facturación proactiva: emite facturas los días 1 y 15. No esperes a que te las pidan',
        ],
        fact:'El 60% de los autónomos en España tienen problemas de liquidez en los trimestres de pago de IVA e IRPF porque no han separado ese dinero. El sistema de 4 cuentas lo hace automático.'},
      { type:'quiz', title:'Cobras €5.000 un mes como freelance. ¿Cuánto tranfieres inmediatamente a la cuenta de impuestos?',
        opts:[
          {t:'€0 — ya pagaré cuando llegue la declaración', ok:false},
          {t:'€1.250-€1.500 (25-30%)', ok:true},
          {t:'€500 (10%)', ok:false},
          {t:'Depende de si el cliente ya aplicó retención', ok:false},
        ],
        ok:'¡Correcto! 25-30% reservado desde el primer día evita la sorpresa de Hacienda. Con retención del 15%, la diferencia también va a la cuenta de impuestos.',
        bad:'Reservar 25-30% desde que cobras es la regla básica. Si el cliente aplica retención del 15%, aún necesitas reservar el diferencial para el pago fraccionado.'},
      { type:'final', xp:26, msg:'¡Sistema de 4 cuentas activado! Tus finanzas de freelance pasaron de caóticas a automáticas.'},
    ]},
  /* ─ M111 ─ Criptomonedas sin hype ─ */
  { id:111, icon:'₿', title:'Criptomonedas sin Hype: lo que Nadie te Cuenta',
    desc:'Bitcoin, altcoins, DeFi y NFTs: qué es real, qué es especulación y cómo no perder el dinero',
    xp:28, tag:'AVANZADO', tagC:'purple', users:'34.700',
    steps:[
      { type:'content', tag:'₿ M111', title:'Separar la Señal del Ruido',
        intro:'El 95% del contenido sobre crypto es marketing o especulación. Esta lección te da el marco para pensar con claridad, independientemente de si el mercado está en bull o bear.',
        bullets:[
          '⚡ Bitcoin: activo escaso (21M unidades), descentralizado, 15 años sin hackeo del protocolo. Reserva de valor debatida',
          '🎰 Altcoins: 99% terminan en cero. El 1% restante tiene utility real. Selección brutal por el mercado',
          '🏦 DeFi: finanzas sin intermediarios. Alto potencial, alto riesgo de smart contract, regulación pendiente',
          '🖼️ NFTs: la mayoría valían cero desde el principio. Excepción: utility real (gaming, acceso, IP)',
          '📊 Tamaño de posición: lo que inviertas en crypto debe ser dinero que podrías perder al 100% sin cambiar tu vida',
          '🔒 Custodia: "not your keys, not your coins". Exchange = riesgo contraparte (FTX, Celsius)',
        ],
        fact:'Bitcoin ha caído más del 80% al menos 4 veces en su historia y cada vez ha recuperado máximos. Pero el 90% de los altcoins que existían en 2017 valen hoy €0. La diferencia entre invertir y especular es el análisis, no el activo.'},
      { type:'quiz', title:'¿Cuál es la regla básica sobre el tamaño de posición en criptomonedas?',
        opts:[
          {t:'Máximo 50% de tu cartera — alta rentabilidad potencial', ok:false},
          {t:'Solo lo que puedas perder al 100% sin afectar tu plan financiero', ok:true},
          {t:'Igual que acciones: depende de tu horizonte temporal', ok:false},
          {t:'Nunca invertir en crypto — es pura especulación', ok:false},
        ],
        ok:'¡Correcto! La volatilidad extrema y el riesgo binario de las cryptos las coloca en la categoría de capital especulativo. Si no puedes dormir con un -80%, es demasiado.',
        bad:'La posición correcta en crypto es aquella cuya pérdida total no cambiaría tu plan financiero. No hay % universal — depende de tu patrimonio total y tolerancia al riesgo.'},
      { type:'final', xp:28, msg:'¡Mentalidad cripto calibrada! Ahora distingues entre inversión y especulación sin dejarte llevar por el FOMO.'},
    ]},
  /* ─ M112 ─ El coste de los malos hábitos financieros ─ */
  { id:112, icon:'☕', title:'El Latte Factor: El Coste Real de tus Pequeños Gastos',
    desc:'Cuánto cuestan realmente el café diario, Netflix y las compras impulsivas a largo plazo',
    xp:16, tag:'PSICOLOGÍA', tagC:'purple', users:'38.100',
    steps:[
      { type:'content', tag:'☕ M112', title:'€3 al Día vs €50.000 en 20 Años',
        intro:'David Bach popularizó el "Latte Factor": los pequeños gastos diarios que parecen insignificantes son, con interés compuesto, algunos de los mayores ladrones de riqueza.',
        bullets:[
          '☕ €3/día en café = €90/mes = €1.080/año. Invertido al 7% durante 20 años: €49.600',
          '📺 €15/mes Netflix + €10 Spotify + €13 HBO = €38/mes = €9.880 en 20 años (sin invertir)',
          '🛍️ Las compras por impulso bajo €20: el cerebro las procesa como "casi gratis". Suman €200-400/mes',
          '🚗 El coche nuevo vs usado: diferencia de €10.000 invertida al 7% = €38.700 en 20 años',
          '⚠️ Contra-argumento: no se trata de dejar el café — se trata de ser CONSCIENTE del coste real',
          '🎯 Regla práctica: para cada gasto recurrente, calcula su coste a 20 años (×12×20×2.58 al 7%)',
        ],
        fact:'Si cada día de tu vida laboral (25-65 años) invirtieras los €3 del café en vez de gastarlo, acumularías €175.000. No es sobre el café — es sobre la consciencia financiera.'},
      { type:'quiz', title:'€5/día en gastos prescindibles. ¿Cuánto supone invertido al 7% durante 30 años?',
        opts:[
          {t:'~€18.000 (solo el ahorro sin rentabilidad)', ok:false},
          {t:'~€182.000 (interés compuesto durante 30 años)', ok:true},
          {t:'~€54.750 (5×365×30)', ok:false},
          {t:'~€35.000', ok:false},
        ],
        ok:'¡Correcto! €150/mes al 7% durante 30 años = ~€182.000. El interés compuesto transforma lo pequeño en grande con suficiente tiempo.',
        bad:'€5/día = €150/mes. Al 7% durante 30 años el interés compuesto los convierte en ~€182.000. La fórmula: PMT × ((1+r)^n-1)/r donde r=0.07/12, n=360.'},
      { type:'final', xp:16, msg:'¡Consciencia financiera activada! No se trata de privarte — se trata de elegir con información real sobre el coste de oportunidad.'},
    ]},
  /* ─ M113 ─ Inversión sostenible ESG ─ */
  { id:113, icon:'🌱', title:'Inversión ESG: ¿Rentabilidad o Greenwashing?',
    desc:'Qué es la inversión sostenible, cómo identificar el greenwashing y si realmente rinde menos',
    xp:22, tag:'INVERSIÓN', tagC:'green', users:'19.300',
    steps:[
      { type:'content', tag:'🌱 M113', title:'Verde, Pero ¿de Verdad?',
        intro:'ESG (Environmental, Social, Governance) ha pasado de nicho a mainstream. En 2023 había más de €35 billones en activos ESG. Pero el 40% de los fondos "sostenibles" no cumplían sus propias promesas.',
        bullets:[
          '🌍 E (Environmental): huella de carbono, eficiencia energética, gestión de residuos',
          '👥 S (Social): condiciones laborales, diversidad, relación con comunidades locales',
          '🏛️ G (Governance): transparencia, derechos accionistas, retribución ejecutiva',
          '⚠️ Greenwashing: fondo llama "sostenible" pero incluye petroleras, fabricantes de armas, tabaco',
          '📊 ¿Rinde menos? Meta-análisis de 2.000 estudios: los fondos ESG tienen performance similar o ligeramente mejor en el largo plazo',
          '🔍 Cómo verificar: busca el "SFDR Article 9" (el más estricto) y revisa el prospecto, no solo el nombre',
        ],
        fact:'El MSCI World ESG Leaders ha superado al MSCI World estándar en un 0,4% anual en los últimos 10 años. La diversificación inferior por excluir sectores no ha perjudicado el rendimiento.'},
      { type:'quiz', title:'¿Cuál es la clasificación SFDR más estricta para fondos sostenibles en Europa?',
        opts:[
          {t:'Article 6 — el estándar básico', ok:false},
          {t:'Article 8 — fondos que promocionan características ESG', ok:false},
          {t:'Article 9 — fondos con objetivo sostenible explícito y medible', ok:true},
          {t:'Article 12 — nivel máximo de sostenibilidad', ok:false},
        ],
        ok:'¡Correcto! SFDR Article 9 es el nivel más exigente: el fondo debe tener la inversión sostenible como objetivo principal y demostrar cómo lo mide.',
        bad:'La jerarquía SFDR es: Art.6 (estándar) < Art.8 (promociona ESG) < Art.9 (objetivo sostenible medible). Para evitar greenwashing, busca Art.9 y lee el prospecto.'},
      { type:'final', xp:22, msg:'¡Inversor sostenible informado! Ya distingues el verde real del marketing verde.'},
    ]},
  /* ─ M114 ─ El método de los sobres (presupuesto en efectivo) ─ */
  { id:114, icon:'✉️', title:'El Método de los Sobres: Presupuesto que Funciona de Verdad',
    desc:'El sistema de control de gastos más sencillo y efectivo, en versión física y digital',
    xp:14, tag:'FUNDAMENTOS', tagC:'green', users:'27.600',
    steps:[
      { type:'content', tag:'✉️ M114', title:'Cuando el Dinero Abstracto se Vuelve Real',
        intro:'Pagar con tarjeta activa menos dolor neurológico que pagar en efectivo. El método de sobres aprovecha esta psicología para controlar gastos de forma automática.',
        bullets:[
          '✉️ Idea básica: asigna efectivo o presupuesto digital a categorías al inicio del mes. Cuando el sobre se vacía, paras',
          '📂 Categorías típicas: alimentación, restaurantes, ocio, ropa, transporte, gastos imprevistos',
          '💳 Versión digital: YNAB, Fintonic, o simplemente cuentas separadas por categoría',
          '🧠 Por qué funciona: elimina la decisión "¿puedo permitirme esto?" — la respuesta es el saldo del sobre',
          '🔄 Regla de transferencias: puedes mover entre sobres, pero conscientemente, no automáticamente',
          '📊 El truco de los imprevistos: siempre hay un sobre "imprevistos" del 5-10%. No es capricho — es planificación real',
        ],
        fact:'Un experimento del MIT demostró que los participantes que pagaban con tarjeta gastaban un 83% más en una subasta que los que pagaban en efectivo. La abstracción del dinero digital reduce el dolor del pago.'},
      { type:'quiz', title:'El sobre de "restaurantes" de €150 se acaba el día 20. ¿Qué haces?',
        opts:[
          {t:'Usar la tarjeta — es solo €30 más, no pasa nada', ok:false},
          {t:'Parar o transferir conscientemente desde otro sobre con superávit', ok:true},
          {t:'Ignorar el método este mes y empezar de nuevo en enero', ok:false},
          {t:'Aumentar el presupuesto del sobre para el mes siguiente', ok:false},
        ],
        ok:'¡Correcto! El sobre vacío es información valiosa: o paras o ajustas conscientemente. Ambas opciones son válidas — la clave es la decisión deliberada, no el gasto automático.',
        bad:'El sobre vacío es la señal. Puedes transferir de otro sobre con superávit, pero conscientemente. Ignorarlo rompe el sistema. Si siempre se acaba el día 20, el presupuesto de ese sobre necesita revisión.'},
      { type:'final', xp:14, msg:'¡Sistema de sobres activado! Tienes el control de gastos más simple y efectivo que existe.'},
    ]},
  /* ─ M115 ─ Planificación de la jubilación ─ */
  { id:115, icon:'🏖️', title:'Planificar la Jubilación: Más Allá de la Pensión del Estado',
    desc:'Cuánto necesitas, cuándo empezar y qué vehículos usar para complementar la pensión pública',
    xp:26, tag:'AVANZADO', tagC:'red', users:'22.800',
    steps:[
      { type:'content', tag:'🏖️ M115', title:'La Brecha de Pensión que Nadie Calcula',
        intro:'El sistema público español cubre el 60-75% del último sueldo. El resto es tu responsabilidad. Empezar a los 30 vs a los 45 puede suponer una diferencia de €300.000 en el capital acumulado.',
        bullets:[
          '📊 La brecha de pensión: sueldo neto €2.500 → pensión estimada €1.500-1.800. Necesitas cubrir €700-1.000/mes',
          '⏰ Regla del 4%: para cubrir €700/mes extra necesitas un capital de €210.000 (700×12/0.04)',
          '📈 Vehículos en España: Plan de Pensiones (deducción IRPF, límite €1.500), PIAS, Fondo de Inversión',
          '💡 Planes de pensiones 2024: deducción máxima €1.500/año. Si tu empresa aporta: +€8.500 más',
          '🏦 Alternativa eficiente: ETF acumulación en cuenta de valores (sin límite, sin penalización de rescate)',
          '🎯 Regla del pulgar: ahorra el 10-15% de tu ingreso bruto desde los 30 para una jubilación cómoda',
        ],
        fact:'Si empiezas a ahorrar €300/mes para la jubilación a los 25 años (al 7%), acumulas €820.000 a los 65. Si empiezas a los 40, solo €220.000. Los 15 años de diferencia cuestan €600.000.'},
      { type:'quiz', title:'Para cubrir €800/mes extra en la jubilación usando la regla del 4%, ¿cuánto capital necesitas?',
        opts:[
          {t:'€96.000 (800×12×10)', ok:false},
          {t:'€240.000 (800×12/0.04)', ok:true},
          {t:'€480.000 (regla del 2%)', ok:false},
          {t:'€160.000', ok:false},
        ],
        ok:'¡Correcto! €800/mes = €9.600/año. Capital = €9.600 / 0.04 = €240.000. Con este capital y la regla del 4%, el dinero debería durar 30+ años.',
        bad:'Regla del 4%: Capital necesario = gasto anual / 0.04. €800×12 = €9.600/año. €9.600/0.04 = €240.000. Este es el objetivo de capital para esa renta vitalicia.'},
      { type:'final', xp:26, msg:'¡Plan de jubilación trazado! Sabes exactamente cuánto necesitas y cuándo empezar para llegar con margen.'},
    ]},

  /* ── M116 — FUNDAMENTOS ─────────────────────────────────── */
  { id:116, title:'La Regla del 72: Dobla tu Dinero sin Calculadora',
    xp:18, tag:'FUNDAMENTOS', tagC:'green', users:'18.400',
    steps:[
      { type:'content', tag:'🔢 M116', title:'La Regla del 72: Dobla tu Dinero sin Calculadora',
        intro:'¿Cuántos años necesitas para doblar una inversión? Divide 72 entre la rentabilidad anual y obtendrás la respuesta. Este truco mental tiene más de 500 años de antigüedad y sigue siendo 100% válido.',
        bullets:[
          '📐 Fórmula: años para doblar = 72 ÷ rentabilidad anual (%)',
          '💡 Ejemplos: al 6% → 12 años. Al 9% → 8 años. Al 12% → 6 años',
          '🔄 También funciona al revés: ¿a qué rentabilidad necesitas doblar en 10 años? 72÷10 = 7,2%',
          '⚠️ Para la inflación: con inflación al 4%, tu poder adquisitivo se reduce a la mitad en 18 años (72÷4)',
          '📊 Versión extendida: la regla del 69.3 es más precisa pero menos práctica; la del 72 es perfecta para cálculos rápidos',
          '🎯 Aplicación práctica: compara opciones de inversión mentalmente en segundos sin necesitar app',
        ],
        fact:'Una deuda con un interés del 24% (tarjeta de crédito típica) hace que lo que debes se duplique en exactamente 3 años si no pagas nada. 72÷24 = 3.'},
      { type:'quiz', title:'Con una rentabilidad del 8% anual, ¿en cuántos años se dobla una inversión según la regla del 72?',
        opts:[
          {t:'6 años', ok:false},
          {t:'9 años', ok:true},
          {t:'12 años', ok:false},
          {t:'16 años', ok:false},
        ],
        ok:'¡Exacto! 72 ÷ 8 = 9 años. La regla del 72 es una herramienta de estimación rápida increíblemente útil.',
        bad:'Recuerda: años = 72 ÷ rentabilidad. 72 ÷ 8 = 9 años. Pruébalo mentalmente con distintas rentabilidades hasta que sea automático.'},
      { type:'final', xp:18, msg:'¡Ahora puedes estimar el potencial de cualquier inversión en segundos! La regla del 72 es tuya para siempre.'},
    ]},

  /* ── M117 — INVERSIÓN ───────────────────────────────────── */
  { id:117, title:'Cómo Leer el Precio de un Fondo: NAV, TER y Comisiones Reales',
    xp:22, tag:'INVERSIÓN', tagC:'blue', users:'14.200',
    steps:[
      { type:'content', tag:'📋 M117', title:'Cómo Leer el Precio de un Fondo: NAV, TER y Comisiones Reales',
        intro:'Antes de invertir en cualquier fondo, hay tres números que debes entender. Ignorarlos puede costarte decenas de miles de euros a lo largo de tu vida inversora.',
        bullets:[
          '💰 NAV (Net Asset Value): precio por participación del fondo, calculado diariamente al cierre',
          '📊 TER (Total Expense Ratio): coste total anual en %. Incluye gestión, depositaría y más. Es lo que realmente pagas',
          '⚠️ Trampa habitual: el TER no incluye los costes de transacción internos del fondo (turnover costs)',
          '🔍 Cómo comparar: busca el KIID (documento de datos fundamentales) de cada fondo — es obligatorio en la UE',
          '💡 Referencia: TER < 0.20% = barato (indexado). TER 0.5-1% = moderado. TER > 1.5% = caro (activo)',
          '🎯 Diferencia de 1% de TER en 30 años sobre €50.000: supone ~€55.000 menos en el resultado final',
        ],
        fact:'El S&P 500 de Vanguard tiene un TER de 0,03%. El fondo de bolsa española medio de gestión activa cobra 1,5-2%. Esa diferencia de ~1,7% anual es prácticamente imposible de compensar con mejor selección de acciones.'},
      { type:'quiz', title:'¿Qué mide el TER (Total Expense Ratio) de un fondo de inversión?',
        opts:[
          {t:'La rentabilidad anual del fondo', ok:false},
          {t:'El coste total anual que se descuenta de la inversión', ok:true},
          {t:'El precio de cada participación', ok:false},
          {t:'El impuesto sobre las ganancias', ok:false},
        ],
        ok:'¡Correcto! El TER es el porcentaje anual que el fondo descuenta de tu inversión como coste de gestión. Un TER bajo es una ventaja enorme a largo plazo.',
        bad:'El TER (Total Expense Ratio) es el coste anual total del fondo expresado en porcentaje. Se descuenta automáticamente del rendimiento, por eso muchos inversores no lo notan hasta que hacen números.'},
      { type:'final', xp:22, msg:'¡Ya sabes leer las letras pequeñas de un fondo! Con este conocimiento tomarás mejores decisiones de inversión.'},
    ]},

  /* ── M118 — PSICOLOGÍA ──────────────────────────────────── */
  { id:118, title:'El Efecto Dotación: Por Qué no Vendemos lo que Deberíamos',
    xp:20, tag:'PSICOLOGÍA', tagC:'purple', users:'16.800',
    steps:[
      { type:'content', tag:'🧠 M118', title:'El Efecto Dotación: Por Qué no Vendemos lo que Deberíamos',
        intro:'Valoramos más lo que ya tenemos simplemente por poseerlo. Este sesgo, descrito por el Nobel de Economía Richard Thaler, nos hace mantener activos perdedores, no vender la casa a buen precio y quedarnos en trabajos que nos limitan.',
        bullets:[
          '🔬 Experimento clásico: a quienes se les da una taza la valoran el doble que quienes no la tienen, aunque sea idéntica',
          '📉 En inversión: nos resistimos a vender acciones en pérdidas esperando "recuperar", aunque sea irracional',
          '🏠 En inmobiliario: los vendedores piden precios un 25-30% más altos que el valor de mercado por el "apego"',
          '💼 En el trabajo: aguantamos malas condiciones porque "hemos invertido muchos años aquí" (sunk cost fallacy)',
          '🎯 Solución: antes de cualquier decisión pregúntate "si no tuviera esto hoy, ¿lo compraría a este precio?"',
          '📊 Regla del espejo: evalúa vender igual que evaluarías comprar — desde cero, sin historia',
        ],
        fact:'El efecto dotación es tan poderoso que en estudios de laboratorio, las personas exigen el DOBLE de dinero para ceder algo que lo que pagarían por adquirirlo. Conocer este sesgo es el primer paso para superarlo.'},
      { type:'quiz', title:'Tienes acciones en pérdidas del -30%. El efecto dotación te haría...',
        opts:[
          {t:'Venderlas inmediatamente para limitar pérdidas', ok:false},
          {t:'Mantenerlas esperando recuperar, aunque el análisis diga que vendas', ok:true},
          {t:'Comprar más para promediar el coste', ok:false},
          {t:'Diversificar a otro sector', ok:false},
        ],
        ok:'¡Exacto! El efecto dotación nos hace mantener lo que tenemos más de lo racional. La pregunta correcta es: "¿compraría estas acciones HOY a este precio?"',
        bad:'El efecto dotación nos hace sobrevalorar lo que ya poseemos. En acciones, esto se traduce en mantener posiciones perdedoras esperando recuperar, en lugar de evaluar si la tesis de inversión sigue siendo válida.'},
      { type:'final', xp:20, msg:'¡Identificado el sesgo! Ahora que sabes qué es el efecto dotación, podrás cuestionarte cuándo te afecta en tus decisiones financieras.'},
    ]},

  /* ── M119 — FISCALIDAD ──────────────────────────────────── */
  { id:119, title:'Modelo 720: El Formulario que Todo Inversor Internacional Debe Conocer',
    xp:24, tag:'FISCALIDAD', tagC:'yellow', users:'9.600',
    steps:[
      { type:'content', tag:'📋 M119', title:'Modelo 720: El Formulario que Todo Inversor Internacional Debe Conocer',
        intro:'Si tienes activos en el extranjero, Hacienda quiere saberlo. El Modelo 720 es la declaración de bienes en el extranjero. No presentarlo puede suponer multas desproporcionadas. Aquí te explicamos qué es y cuándo te afecta.',
        bullets:[
          '📌 Qué es: declaración informativa (no tributaria) de bienes y derechos en el extranjero',
          '⚠️ Cuándo obligatorio: si tienes más de €50.000 en cuentas bancarias extranjeras, valores o inmuebles fuera de España',
          '📅 Plazo: del 1 de enero al 31 de marzo del año siguiente (datos a 31/12)',
          '💡 Ejemplo: tienes €60.000 en IBKR (broker americano) → debes presentar el 720',
          '🔍 ETFs y fondos en brokers extranjeros: también computan. DeGiro, IBKR, Trading 212 = extranjero',
          '✅ Buena noticia: los ETFs acumulativos en brokers españoles (Myinvestor, Indexa) no requieren 720',
        ],
        fact:'En 2022 el Tribunal de Justicia de la UE declaró desproporcionadas las sanciones originales del 720. Desde 2023 las multas se han reducido significativamente, pero la obligación de declarar se mantiene intacta.'},
      { type:'quiz', title:'¿Cuándo estás obligado a presentar el Modelo 720?',
        opts:[
          {t:'Siempre que inviertas en bolsa extranjera', ok:false},
          {t:'Si tienes más de €50.000 en activos fuera de España', ok:true},
          {t:'Solo si tienes cuentas en paraísos fiscales', ok:false},
          {t:'Cuando generas plusvalías en activos extranjeros', ok:false},
        ],
        ok:'Correcto. El umbral es €50.000 por categoría (cuentas, valores o inmuebles). Por encima de ese importe, la declaración es obligatoria independientemente de si has obtenido beneficios o no.',
        bad:'El Modelo 720 se activa cuando tienes más de €50.000 en activos en el extranjero (cuentas, valores o inmuebles), independientemente de si has ganado o perdido dinero.'},
      { type:'final', xp:24, msg:'¡Ahora conoces una obligación fiscal que muchos inversores descubren con años de retraso! El 720 es informativo, no punitivo si lo presentas correctamente.'},
    ]},

  /* ── M120 — DEUDA ───────────────────────────────────────── */
  { id:120, title:'Refinanciación de Deuda: Cuándo y Cómo Hacerlo Bien',
    xp:22, tag:'DEUDA', tagC:'orange', users:'12.400',
    steps:[
      { type:'content', tag:'🔄 M120', title:'Refinanciación de Deuda: Cuándo y Cómo Hacerlo Bien',
        intro:'Refinanciar significa sustituir una deuda cara por una más barata. Hecho bien, puede ahorrarte miles de euros. Hecho mal, puede extender tu esclavitud financiera indefinidamente.',
        bullets:[
          '📉 Cuándo tiene sentido: cuando el nuevo tipo es al menos 1-1,5% inferior al actual y te quedan varios años de deuda',
          '💰 Hipoteca de variable a fijo: en 2024 puede tener sentido fijar si el diferencial es razonable y tienes aversión al riesgo',
          '⚠️ Costes ocultos: comisión de cancelación, notaría, tasación, registro. Calcula el break-even antes',
          '🧮 Fórmula del break-even: ahorro mensual / costes totales de refinanciación = meses para recuperar la inversión',
          '🏦 Negociación bancaria: pide primero a tu banco actual. Si te dicen no, usa esa oferta competidora en otro banco',
          '🎯 Reunificación de deudas: juntar varias deudas en una hipoteca puede bajar la cuota mensual pero alargar años y coste total',
        ],
        fact:'Reducir el tipo de una hipoteca de 200.000 € a 25 años del 4% al 3% supone un ahorro de aproximadamente €110 al mes y más de €32.000 en total. El trámite de subrogación cuesta entre €1.000-2.000. El break-even es en 10-18 meses.'},
      { type:'quiz', title:'Tienes una hipoteca al 4% y te ofrecen refinanciarla al 3,2%. Los costes del trámite son €1.500 y el ahorro mensual sería €80. ¿Cuándo recuperas la inversión?',
        opts:[
          {t:'6 meses', ok:false},
          {t:'Aproximadamente 19 meses', ok:true},
          {t:'3 años', ok:false},
          {t:'Nunca compensa', ok:false},
        ],
        ok:'¡Correcto! €1.500 ÷ €80/mes = 18,75 meses. A partir del mes 19, todo es ahorro neto. Si te quedan más de 2 años de hipoteca, refinanciar casi siempre compensa.',
        bad:'Break-even = costes ÷ ahorro mensual. €1.500 ÷ €80 = 18,75 meses. Aproximadamente 19 meses. Si la hipoteca dura más que eso (casi siempre), refinanciar es positivo.'},
      { type:'final', xp:22, msg:'¡Ahora sabes calcular si refinanciar compensa! Este análisis de break-even te ahorrará o ganará dinero real en algún momento de tu vida.'},
    ]},

  /* ── M121 — AVANZADO ────────────────────────────────────── */
  { id:121, title:'Dollar Cost Averaging vs. Lump Sum: ¿Cuál Gana?',
    xp:24, tag:'AVANZADO', tagC:'red', users:'19.200',
    steps:[
      { type:'content', tag:'📊 M121', title:'Dollar Cost Averaging vs. Lump Sum: ¿Cuál Gana?',
        intro:'Tienes €12.000 para invertir. ¿Los metes todos de golpe (lump sum) o los repartes en cuotas mensuales durante un año (DCA)? La ciencia tiene una respuesta clara, pero con un matiz psicológico importante.',
        bullets:[
          '📈 Datos históricos: el lump sum bate al DCA el 66-68% de las veces en mercados con tendencia alcista de largo plazo',
          '🧠 Por qué: los mercados suben más tiempo del que bajan. Invertir antes = más tiempo compuesto',
          '🛡️ Ventaja del DCA: reduce el riesgo de invertir en máximos. Si el mercado cae el mes siguiente, tu pérdida es menor',
          '😰 Factor psicológico clave: el lump sum es óptimo matemáticamente pero psicológicamente difícil. Si el mercado cae un 30% tras invertir todo, ¿lo aguantas sin vender?',
          '💡 Regla práctica: si tienes alta tolerancia al riesgo y horizonte largo → lump sum. Si eres nuevo o muy averso al riesgo → DCA',
          '🎯 La mejor estrategia es la que puedes mantener: una estrategia buena aplicada consistentemente supera a la óptima que abandonas',
        ],
        fact:'Un estudio de Vanguard (2012) analizó 12 mercados globales en períodos de 10 años. El lump sum fue superior al DCA 2 de cada 3 veces. El argumento principal: el tiempo en el mercado bate al timing del mercado.'},
      { type:'quiz', title:'¿En qué porcentaje de los casos históricos el lump sum supera al DCA según estudios de Vanguard?',
        opts:[
          {t:'Alrededor del 45%', ok:false},
          {t:'Alrededor del 55%', ok:false},
          {t:'Alrededor del 67%', ok:true},
          {t:'Siempre, el 100%', ok:false},
        ],
        ok:'¡Exacto! Aproximadamente 2 de cada 3 veces, invertir todo de golpe bate al DCA. Pero el tercio restante (cuando el mercado cae justo después) puede ser psicológicamente devastador.',
        bad:'El lump sum gana al DCA aproximadamente el 67% de las veces (2 de cada 3). La razón: los mercados suben la mayor parte del tiempo, y invertir antes significa más tiempo aprovechando esa subida.'},
      { type:'final', xp:24, msg:'¡Ahora entiendes el debate lump sum vs DCA con datos reales! La decisión correcta depende tanto de la matemática como de tu psicología inversora.'},
    ]},

  /* ── M122 — FUNDAMENTOS ─────────────────────────────────── */
  { id:122, title:'El Balance Personal: Tu Foto Financiera en 10 Minutos',
    xp:18, tag:'FUNDAMENTOS', tagC:'green', users:'21.600',
    steps:[
      { type:'content', tag:'📸 M122', title:'El Balance Personal: Tu Foto Financiera en 10 Minutos',
        intro:'Las empresas hacen un balance mensual. Tú deberías hacerlo al menos cada 6 meses. Activos menos pasivos = patrimonio neto. Esta cifra, y su evolución, es la métrica más importante de tu salud financiera.',
        bullets:[
          '📋 Activos: lo que tienes. Efectivo, cuentas de ahorro, inversiones, inmuebles, coche, pensión',
          '📋 Pasivos: lo que debes. Hipoteca, préstamos, tarjetas, deudas a familiares',
          '💰 Patrimonio neto = Activos − Pasivos. El objetivo es que este número crezca cada año',
          '📈 Métricas clave: tasa de ahorro (% ingresos), ratio de endeudamiento (deudas/activos), cobertura de emergencia (meses)',
          '🎯 Frecuencia recomendada: balance anual completo, revisión semestral rápida',
          '⚠️ Error común: no incluir el plan de pensiones ni el valor del coche (activos que deprecian = incluir a valor real)',
        ],
        fact:'El patrimonio neto medio de un español de 35-44 años es aproximadamente €90.000 según el Banco de España (2022). El 50% de ese patrimonio es inmobiliario. El 40% es la vivienda habitual.'},
      { type:'quiz', title:'Tienes: piso valorado en €180.000, hipoteca pendiente €120.000, ahorros €15.000, coche €8.000. ¿Cuál es tu patrimonio neto?',
        opts:[
          {t:'€83.000', ok:true},
          {t:'€203.000', ok:false},
          {t:'€75.000', ok:false},
          {t:'€60.000', ok:false},
        ],
        ok:'¡Correcto! Activos: 180.000 + 15.000 + 8.000 = €203.000. Pasivos: €120.000. Patrimonio neto = €83.000. ¡Ya sabes hacer tu balance!',
        bad:'Activos totales: 180.000 (piso) + 15.000 (ahorros) + 8.000 (coche) = €203.000. Pasivos: €120.000 (hipoteca). Patrimonio neto = 203.000 − 120.000 = €83.000.'},
      { type:'final', xp:18, msg:'¡Tu primer balance personal está listo! Esta habilidad, aplicada regularmente, te dará claridad financiera para siempre.'},
    ]},

  /* ── M123 — INVERSIÓN ───────────────────────────────────── */
  { id:123, title:'Bonos: El Activo que Todo Inversor Ignora (Y No Debería)',
    xp:22, tag:'INVERSIÓN', tagC:'blue', users:'11.800',
    steps:[
      { type:'content', tag:'💎 M123', title:'Bonos: El Activo que Todo Inversor Ignora (Y No Debería)',
        intro:'Los bonos son préstamos que haces a gobiernos o empresas. A cambio recibes intereses periódicos (cupones) y la devolución del capital al vencimiento. Son aburridos, sí. Pero en cartera cumplen una función que las acciones no pueden.',
        bullets:[
          '📌 Tipos principales: bonos soberanos (gobierno), corporativos (empresa), indexados a inflación (TIPS/linkers)',
          '📉 Relación inversa precio-yield: cuando los tipos suben, el precio de los bonos existentes baja (y viceversa)',
          '🛡️ Función en cartera: reducen la volatilidad total. En crashs de bolsa, los bonos soberanos suelen subir',
          '⚠️ Riesgo de duración: un bono a 30 años es mucho más sensible a variaciones de tipo que uno a 2 años',
          '💡 Para inversores jóvenes: poca exposición a bonos (80/20 o 90/10 acciones/bonos)',
          '🎯 Para inversores cerca de la jubilación: más bonos para proteger el capital acumulado (60/40 o 50/50)',
        ],
        fact:'En 2022, los bonos a largo plazo cayeron más del 30% — su peor año en décadas — porque los tipos subieron bruscamente del 0% al 4%. Esto rompió temporalmente la correlación negativa con la bolsa. Fue una anomalía histórica.'},
      { type:'quiz', title:'Si los tipos de interés suben del 2% al 4%, ¿qué le pasa al precio de un bono existente al 2%?',
        opts:[
          {t:'Sube porque ahora paga menos que el mercado', ok:false},
          {t:'No cambia porque el cupón está fijado', ok:false},
          {t:'Baja porque nadie quiere un bono al 2% cuando el mercado da el 4%', ok:true},
          {t:'Vence automáticamente', ok:false},
        ],
        ok:'¡Correcto! La relación precio-yield es inversa. Si el mercado ofrece 4%, un bono al 2% vale menos. Su precio baja hasta que su yield efectivo sea competitivo.',
        bad:'Relación inversa: tipos suben → precio del bono baja. Un bono que paga el 2% pierde atractivo cuando el mercado ofrece el 4%, así que su precio de mercado cae para que su yield real sea competitivo.'},
      { type:'final', xp:22, msg:'¡Ya entiendes los bonos y su rol en cartera! Este conocimiento te ayudará a construir una cartera más equilibrada y resistente.'},
    ]},

  /* ── M124 — PSICOLOGÍA ──────────────────────────────────── */
  { id:124, title:'Contabilidad Mental: El Truco que Hace que Gastes de Más',
    xp:20, tag:'PSICOLOGÍA', tagC:'purple', users:'17.400',
    steps:[
      { type:'content', tag:'🧠 M124', title:'Contabilidad Mental: El Truco que Hace que Gastes de Más',
        intro:'Tu cerebro no trata igual €100 en efectivo que €100 en un casino, aunque su valor sea idéntico. La contabilidad mental es el sesgo por el que asignamos distinto valor al dinero según su origen o su "etiqueta mental".',
        bullets:[
          '🎰 El dinero de la suerte: lo que ganamos fácil (herencia, premio, bonus inesperado) lo gastamos más fácil',
          '🏷️ El dinero etiquetado: mentalmente separamos "dinero del alquiler" de "dinero de vacaciones" aunque estén en la misma cuenta',
          '💳 El dinero plástico: pagar con tarjeta duele menos que con efectivo, lo que lleva a gastar más',
          '🔄 El dinero recuperado: si cancelas un seguro y ahorras €50/mes, ese dinero "desaparece" si no lo redirigimos conscientemente',
          '📊 Ejemplo práctico: un reembolso de €200 de la agencia tributaria → tendemos a gastarlo en ocio aunque debería ir a deuda',
          '🎯 Solución: trata todo el dinero igual. €1 de bonus = €1 de sueldo = €1 de herencia. Mismo destino, mismo criterio',
        ],
        fact:'Experimento clásico: las personas trabajan más horas para recuperar una pérdida de €50 que para ganar €50 adicionales. Y sin embargo, gastan más fácilmente si el dinero viene de una fuente "inesperada" como un premio o un reembolso.'},
      { type:'quiz', title:'Recibes una devolución de Hacienda de €400. Según la contabilidad mental, ¿qué harías inconscientemente?',
        opts:[
          {t:'Tratarlo igual que el sueldo y destinarlo a inversión o deuda', ok:false},
          {t:'Gastarlo más fácilmente porque "no esperabas ese dinero"', ok:true},
          {t:'Ahorrarlo inmediatamente por precaución', ok:false},
          {t:'Donarlo porque no lo habías planificado', ok:false},
        ],
        ok:'¡Exacto! La contabilidad mental nos hace tratar el dinero inesperado como "dinero de jugar". Saberlo te permite resistir el impulso y dar a ese dinero el mismo destino racional que al sueldo.',
        bad:'La contabilidad mental nos lleva a gastar más fácilmente el dinero que percibimos como "extra". El reembolso de €400 debería ir a los mismos destinos que cualquier ingreso, pero el cerebro lo trata como dinero "libre".'},
      { type:'final', xp:20, msg:'¡Sesgo detectado! Ahora que conoces la contabilidad mental, puedes interceptar el impulso antes de actuar. Todo el dinero vale lo mismo.'},
    ]},

  /* ── M125 — AVANZADO ────────────────────────────────────── */
  { id:125, title:'Factor Investing: Smart Beta y los Factores que Baten al Mercado',
    xp:28, tag:'AVANZADO', tagC:'red', users:'8.200',
    steps:[
      { type:'content', tag:'🔬 M125', title:'Factor Investing: Smart Beta y los Factores que Baten al Mercado',
        intro:'El Nobel Eugene Fama y Ken French demostraron que ciertas características de las acciones (factores) explican retornos superiores de forma sistemática y persistente. Esto dio origen al factor investing.',
        bullets:[
          '📊 Factor Valor (Value): acciones baratas relativas a fundamentales superan a las caras a largo plazo',
          '📈 Factor Tamaño (Size): empresas pequeñas (small caps) superan a las grandes en períodos largos',
          '⚡ Factor Momentum: acciones que han subido en los últimos 12 meses tienden a seguir subiendo a corto plazo',
          '🛡️ Factor Calidad (Quality): empresas con alta rentabilidad, bajo endeudamiento y estabilidad de beneficios',
          '📉 Factor Baja Volatilidad: acciones poco volátiles superan ajustadas por riesgo a las muy volátiles',
          '💡 Smart Beta: ETFs que replican índices ajustados por factores. Más caro que plain vanilla pero más barato que gestión activa',
        ],
        fact:'El modelo de 5 factores de Fama-French (2015) explica el 95% de la variación en retornos de carteras diversificadas. Los factores Valor y Tamaño tienen primas documentadas desde los años 1920 en datos históricos de EE.UU.'},
      { type:'quiz', title:'Según el factor Valor (Value), ¿qué tipo de acciones tienden a generar mayor rentabilidad a largo plazo?',
        opts:[
          {t:'Empresas tecnológicas de alto crecimiento', ok:false},
          {t:'Las más conocidas y populares del mercado', ok:false},
          {t:'Acciones baratas relativas a sus fundamentales', ok:true},
          {t:'Las de mayor capitalización bursátil', ok:false},
        ],
        ok:'¡Correcto! El factor Valor postula que acciones con ratios bajos (PER, P/B, P/CF) tienden a superar al mercado porque el mercado las infravalora sistemáticamente.',
        bad:'El factor Valor identifica acciones que cotizan por debajo de su valor fundamental (P/B bajo, PER bajo). Históricamente, estas "acciones baratas" superan al mercado a largo plazo por ser sistemáticamente ignoradas por los inversores.'},
      { type:'final', xp:28, msg:'¡Ahora conoces el factor investing! Esta es una herramienta de los inversores más sofisticados — y tú ya la entiendes.'},
    ]},

  /* ── M126 — FISCALIDAD ──────────────────────────────────── */
  { id:126, title:'Plusvalías del Muerto: Planificación Patrimonial Básica',
    xp:26, tag:'FISCALIDAD', tagC:'yellow', users:'7.800',
    steps:[
      { type:'content', tag:'🏛️ M126', title:'Plusvalías del Muerto: Planificación Patrimonial Básica',
        intro:'En España (y EE.UU.), cuando heredas acciones o inmuebles, la base de coste se "reajusta" al valor de mercado en el momento del fallecimiento. Esto elimina décadas de plusvalías tácitas. Es una de las mayores ventajas fiscales del sistema.',
        bullets:[
          '📌 Cómo funciona: si heredas acciones compradas a €10 y valen €100 cuando fallece el causante, tu coste es €100',
          '💡 Implicación: si las vendes justo tras heredar, tributas por €0 de ganancia aunque hayan subido €90',
          '🏠 En inmuebles: la plusvalía acumulada durante la vida del propietario no tributa por IRPF en la herencia',
          '⚠️ Sí tributa: el Impuesto de Sucesiones (varía enormemente por CCAA, de 0% en Madrid a hasta 34% en otras)',
          '🎯 Estrategia: donar en vida puede tener peores consecuencias fiscales que heredar. Siempre calcula ambas opciones',
          '📊 Planificación: testamento actualizado, seguro de vida para cubrir el IS, y ubicación en CCAA con IS bajo',
        ],
        fact:'En Madrid el Impuesto de Sucesiones tiene una bonificación del 99% para cónyuge e hijos directos. En Asturias puede llegar al 34% sin bonificaciones. La CCAA de residencia del fallecido determina cuánto paga la familia.'},
      { type:'quiz', title:'Heredas acciones de tu madre. Las compró a €5.000 y valen €40.000 hoy. Si las vendes inmediatamente, ¿cuánto IRPF pagas por la plusvalía?',
        opts:[
          {t:'El 19% sobre €35.000 de ganancia', ok:false},
          {t:'€0, porque tu base de coste es €40.000 al heredar', ok:true},
          {t:'El 21% sobre €40.000', ok:false},
          {t:'Depende del tiempo que las tengas', ok:false},
        ],
        ok:'¡Correcto! Al heredar, tu base de coste es el valor en la fecha de fallecimiento (€40.000). Si las vendes inmediatamente, tu plusvalía es €0 y no pagas IRPF por ello.',
        bad:'En España (y en muchos sistemas fiscales), la herencia "reajusta" la base de coste al valor actual. Si heredas acciones a €40.000, ese es tu precio de compra fiscal. Vendiéndolas inmediatamente, la ganancia patrimonial es €0.'},
      { type:'final', xp:26, msg:'¡Aprendida una de las mayores ventajas fiscales del sistema patrimonial! Este conocimiento puede valer decenas de miles de euros en decisiones de planificación familiar.'},
    ]},

  /* ── M127 — INVERSIÓN ───────────────────────────────────── */
  { id:127, title:'Rebalanceo de Cartera: El Mantenimiento que Nadie Hace',
    xp:22, tag:'INVERSIÓN', tagC:'blue', users:'13.400',
    steps:[
      { type:'content', tag:'⚖️ M127', title:'Rebalanceo de Cartera: El Mantenimiento que Nadie Hace',
        intro:'Una cartera 60/40 acciones/bonos que nunca se rebalancea puede acabar siendo 85/15 tras un mercado alcista. Esto cambia completamente el perfil de riesgo. El rebalanceo devuelve la cartera a su diseño original.',
        bullets:[
          '📐 Qué es: vender lo que más ha subido y comprar lo que más ha bajado para volver a los porcentajes objetivo',
          '🔄 Frecuencia: anual es suficiente para la mayoría. Algunos usan umbral (rebalancear si cualquier activo se desvía >5%)',
          '💡 Comprar barato, vender caro: el rebalanceo te obliga sistemáticamente a esta disciplina que resulta tan difícil emocionalmente',
          '💰 Rebalanceo eficiente: añadir las nuevas aportaciones al activo que está por debajo del objetivo (evita ventas y sus impuestos)',
          '⚠️ Fiscalidad en rebalanceo activo: vender para rebalancear genera plusvalías. En fondos es neutro si solo traspasas',
          '🎯 Resultado documentado: carteras rebalanceadas anualmente superan a carteras sin rebalancear ajustadas por riesgo',
        ],
        fact:'En 2009, tras el crash de 2008, una cartera 60/40 sin rebalancear había caído al 40/60. Los inversores que rebalancearon a principios de 2009 (comprando acciones en mínimos) obtuvieron retornos superiores el 200% en la siguiente década.'},
      { type:'quiz', title:'Tu cartera objetivo es 70% acciones / 30% bonos. Tras un año alcista, está al 80%/20%. ¿Qué haces para rebalancear?',
        opts:[
          {t:'Dejarla así porque las acciones están subiendo', ok:false},
          {t:'Vender acciones y comprar bonos hasta volver al 70/30', ok:true},
          {t:'Añadir más bonos y dejar las acciones igual', ok:false},
          {t:'Cambiar el objetivo de asignación al 80/20', ok:false},
        ],
        ok:'¡Exacto! Rebalancear significa vender acciones (que han subido) y comprar bonos (que están por debajo del objetivo). O bien, añadir solo bonos con las nuevas aportaciones para evitar ventas y sus impuestos.',
        bad:'Rebalancear implica volver al 70/30: vender el exceso de acciones y comprar bonos. Alternativamente, puedes añadir las próximas aportaciones solo a bonos hasta restaurar el equilibrio sin generar plusvalías.'},
      { type:'final', xp:22, msg:'¡Rebalanceo dominado! Esta disciplina sencilla pero incómoda es uno de los hábitos más poderosos de los inversores a largo plazo.'},
    ]},

  /* ── M128 — AVANZADO ────────────────────────────────────── */
  { id:128, title:'Cómo Invertir en Empresas Pequeñas (Small Caps) con Bajo Riesgo',
    xp:26, tag:'AVANZADO', tagC:'red', users:'10.200',
    steps:[
      { type:'content', tag:'🔭 M128', title:'Cómo Invertir en Empresas Pequeñas (Small Caps) con Bajo Riesgo',
        intro:'Las small caps (empresas de baja capitalización, generalmente <2.000M $) han superado históricamente a las large caps en casi todos los mercados durante el último siglo. Pero son más volátiles, menos líquidas y más difíciles de analizar.',
        bullets:[
          '📊 Prima histórica: small caps globales han ofrecido ~2% anual adicional frente a large caps en períodos de 20+ años',
          '⚠️ Riesgos específicos: menor liquidez, más exposición a ciclos económicos, información menos disponible',
          '💡 Forma más segura: ETFs de small cap (MSCI World Small Cap, Russell 2000) — diversificación de cientos de empresas',
          '🌍 Small cap value: la combinación de tamaño pequeño + barato tiene la prima histórica más alta (Fama-French)',
          '📈 Recomendación práctica: 10-20% de la cartera en small caps para capturar la prima sin concentrar el riesgo',
          '🏦 Brokers con ETFs small cap: Myinvestor (Vanguard Global Small-Cap), IBKR (iShares MSCI World Small Cap)',
        ],
        fact:'El ETF iShares MSCI World Small Cap tiene una TER de 0,35% e invierte en más de 3.400 empresas pequeñas de 23 países desarrollados. En los últimos 20 años ha superado al MSCI World estándar en aproximadamente 1,5% anual.'},
      { type:'quiz', title:'¿Cuál es la forma más segura de ganar exposición a small caps para un inversor individual?',
        opts:[
          {t:'Comprar acciones individuales de empresas pequeñas', ok:false},
          {t:'Un ETF diversificado de small caps', ok:true},
          {t:'Solo en momentos de crisis de mercado', ok:false},
          {t:'Fondos de capital riesgo (private equity)', ok:false},
        ],
        ok:'¡Correcto! Un ETF de small caps diversifica el riesgo idiosincrático entre cientos o miles de empresas pequeñas, capturando la prima histórica sin la concentración de elegir empresas individuales.',
        bad:'Los ETFs de small caps diversifican entre cientos de empresas pequeñas, eliminando el riesgo de que una quiebre y destruya tu inversión. Es la manera más eficiente de capturar la prima histórica de tamaño.'},
      { type:'final', xp:26, msg:'¡Small caps integradas en tu conocimiento inversor! Ahora sabes cuándo, cuánto y cómo añadir este factor a una cartera diversificada.'},
    ]},

  /* ── M129 — FUNDAMENTOS ─────────────────────────────────── */
  { id:129, title:'Automatiza tus Finanzas: El Sistema de los Ricos Sin Esfuerzo',
    xp:18, tag:'FUNDAMENTOS', tagC:'green', users:'24.800',
    steps:[
      { type:'content', tag:'⚙️ M129', title:'Automatiza tus Finanzas: El Sistema de los Ricos Sin Esfuerzo',
        intro:'La fuerza de voluntad es un recurso limitado. Depender de ella para ahorrar o invertir es un error garantizado. Los sistemas financieros automáticos eliminan la decisión y el esfuerzo. Configuras una vez y funciona para siempre.',
        bullets:[
          '📅 Día 1 del mes: tu sueldo llega. Ese mismo día se ejecutan las transferencias automáticas',
          '💰 Flujo recomendado: cuenta nómina → cuenta ahorro (10-20%) → broker/fondo (inversión) → cuenta gastos variables',
          '🏦 Hipoteca/alquiler: domiciliar el día 1, nunca después para evitar descubiertos y penalizaciones',
          '📱 Herramientas: Bizum programado, transferencias periódicas en app del banco, aportaciones automáticas en broker',
          '🔄 El truco del "págate primero": el ahorro/inversión se ejecuta ANTES de ver el dinero disponible para gastar',
          '🎯 Tiempo de configuración: 2-3 horas una vez. Tiempo de mantenimiento: 10 minutos al mes de revisión',
        ],
        fact:'Un estudio del MIT (2009) demostró que las personas con ahorro automatizado acumulan un 81% más de riqueza a los 5 años que las que ahorran de forma voluntaria, incluso con el mismo nivel de ingresos y misma tasa de ahorro planificada.'},
      { type:'quiz', title:'En el sistema de "págate primero", ¿cuándo se transfiere el dinero al ahorro/inversión?',
        opts:[
          {t:'Al final del mes con lo que sobre', ok:false},
          {t:'El mismo día que llega el sueldo, antes de gastar', ok:true},
          {t:'Cuando el mercado está bajo', ok:false},
          {t:'Mensualmente si llego al objetivo de gasto', ok:false},
        ],
        ok:'¡Exacto! "Págate primero" significa que el ahorro e inversión salen automáticamente el día del sueldo, antes de que puedas gastarlo. Lo que llega a la cuenta de gastos es ya el dinero disponible.',
        bad:'El principio de "págate primero" requiere que el ahorro e inversión se ejecuten automáticamente el mismo día del sueldo. Lo que queda en la cuenta de gastos diarios es el dinero realmente disponible.'},
      { type:'final', xp:18, msg:'¡Sistema de automatización diseñado! Implementar este flujo hoy puede ser la decisión financiera de mayor impacto que tomes este año.'},
    ]},

  /* ── M130 — PSICOLOGÍA ──────────────────────────────────── */
  { id:130, title:'El Poder del No: Cómo Decir No al Gasto Que No te Acerca a tus Metas',
    xp:20, tag:'PSICOLOGÍA', tagC:'purple', users:'22.000',
    steps:[
      { type:'content', tag:'🧠 M130', title:'El Poder del No: Cómo Decir No al Gasto Que No te Acerca a tus Metas',
        intro:'Cada gasto es una micro-decisión. La mayoría los hacemos en piloto automático, sin conexión con nuestros objetivos. Aprender a decir no a los gastos que no aportan valor real — sin culpa — es una habilidad financiera y emocional.',
        bullets:[
          '💡 El coste de oportunidad visible: antes de gastar €100, pregúntate "¿qué pierde mi yo futuro si gasto esto?"',
          '🎯 Defínelo en tiempo: €100 hoy al 7% en 20 años = €387. ¿El gasto vale €387 para tu yo de 2045?',
          '🚫 Gastos trampa más comunes: suscripciones olvidadas, comidas fuera por comodidad, moda rápida, gadgets de impulso',
          '💬 Cómo decir no socialmente: "Prefiero ahorrar para [objetivo concreto]" es suficiente. No necesitas justificarte',
          '🔄 Regla de las 24/48/72 horas: espera 24h antes de cualquier compra no planificada por debajo de €50. 48h para €100+. 72h para €500+',
          '📊 Revisión mensual de gastos: detecta los recurrentes sin valor. Cancelar €30/mes son €360 al año y €7.200 en 20 años con inversión',
        ],
        fact:'El americano medio gasta €219/mes en suscripciones activas, de las cuales usa activamente menos del 40%. En España el gasto en suscripciones digitales creció un 350% entre 2018 y 2024. ¿Cuántos servicios tienes olvidados?'},
      { type:'quiz', title:'Antes de una compra de impulso de €80, aplicas la regla del coste de oportunidad a 20 años (7%). ¿A cuánto equivale ese gasto en el futuro?',
        opts:[
          {t:'Unos €150', ok:false},
          {t:'Unos €200', ok:false},
          {t:'Unos €310', ok:true},
          {t:'Unos €500', ok:false},
        ],
        ok:'¡Correcto! €80 × (1,07)^20 ≈ €310. Ver el gasto presente en términos futuros es una de las herramientas más poderosas para resistir impulsos de consumo.',
        bad:'€80 al 7% durante 20 años = €80 × (1,07)^20 ≈ €310. Este ejercicio mental — transformar el coste presente en coste futuro — hace tangible el precio real de cada gasto de impulso.'},
      { type:'final', xp:20, msg:'¡Mentalidad de coste de oportunidad activada! Cada "no" a un gasto innecesario es un "sí" a tu libertad financiera futura.'},
    ]},
  { id:131, icon:'📊', title:'La Regla 50/30/20 Avanzada', desc:'El sistema de presupuesto más usado del mundo, adaptado a la realidad española.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'18.400',
    steps:[
      { type:'content', tag:'📖 M131', title:'Los tres cajones de tu sueldo',
        content:'<h3>El marco del 50/30/20</h3><p>Popularizado por la senadora y economista Elizabeth Warren en <em>All Your Worth</em>, este sistema divide tu sueldo neto en tres grandes bloques:</p><ul><li><strong>50% Necesidades</strong> — alquiler, comida, transporte, suministros, seguros obligatorios</li><li><strong>30% Deseos</strong> — ocio, restaurantes, suscripciones, ropa no esencial</li><li><strong>20% Ahorro e inversión</strong> — incluye deuda extra, fondo de emergencia y aportaciones</li></ul><p>La potencia del sistema no está en los porcentajes exactos, sino en <em>que cada euro tenga un destino</em>.</p>' },
      { type:'content', tag:'🇪🇸 M131', title:'Ajustándolo a España',
        content:'<h3>La trampa del alquiler</h3><p>En ciudades como Madrid o Barcelona, el alquiler solo ya consume el 40-50% del sueldo medio. El 50/30/20 tradicional se rompe. ¿Qué hacer?</p><p><strong>Opción 1:</strong> Convertir a 60/20/20 temporalmente, con plan claro para volver al 50/30/20 en 2-3 años (cambio de piso, subida salarial, compartir vivienda).</p><p><strong>Opción 2:</strong> Si el 50% no basta para necesidades, el problema no es tu presupuesto — es tu ingreso o tu coste de vida. Revisa una de las dos.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Sueldo neto €2.000. Alquiler €900, suministros €100, comida €350. ¿Qué % de necesidades tienes?', opts:['50%','60%','67,5%','75%'], ans:2, exp:'€1.350 / €2.000 = 67,5%. Estás muy por encima del 50% recomendado. El alquiler es la palanca principal.' },
      { type:'final', xp:100, msg:'Ya manejas el framework de presupuesto más extendido. El objetivo no es la perfección — es la consciencia.' },
    ]},
  { id:132, icon:'💹', title:'Tasa de Ahorro: La Métrica que Importa', desc:'Más importante que tu sueldo. La tasa de ahorro decide cuándo serás libre.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'15.200',
    steps:[
      { type:'content', tag:'📖 M132', title:'El verdadero termómetro financiero',
        content:'<h3>No es cuánto ganas, es cuánto guardas</h3><p>La <strong>tasa de ahorro</strong> es el porcentaje de tu ingreso neto que apartas para ahorrar o invertir. Es la métrica más correlacionada con la libertad financiera futura, por encima del salario bruto.</p><p>Cálculo simple:</p><p><code>(Ingreso neto − gastos) / Ingreso neto × 100</code></p><p>Según estudios del movimiento FIRE:</p><ul><li><strong>10%</strong> — tasa media española. Jubilación a los 67 dependiendo de la pensión pública.</li><li><strong>20%</strong> — tasa saludable. Libertad financiera posible a los 55-60.</li><li><strong>50%+</strong> — tasa FIRE. Libertad posible en 15-20 años desde el primer euro.</li></ul>' },
      { type:'content', tag:'⏱️ M132', title:'El cálculo que cambia vidas',
        content:'<h3>Años hasta la libertad</h3><p>Con una rentabilidad real del 5% anual tras inflación, los años que tardas en alcanzar independencia financiera según tu tasa de ahorro son aproximadamente:</p><ul><li>Ahorras <strong>10%</strong> → 51 años</li><li>Ahorras <strong>20%</strong> → 37 años</li><li>Ahorras <strong>30%</strong> → 28 años</li><li>Ahorras <strong>50%</strong> → 17 años</li><li>Ahorras <strong>70%</strong> → 8,5 años</li></ul><p>Doblar tu tasa de ahorro no recorta el tiempo a la mitad — lo recorta a una fracción. Es la palanca más potente de las finanzas personales.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué tiene mayor impacto en tu independencia financiera?', opts:['Ganar 20% más y gastarlo todo','Mantener ingresos y ahorrar 20% más','Invertir en acciones de moda','Heredar €10.000'], ans:1, exp:'Ahorrar más mueve la aguja exponencialmente. Ganar más sin ahorrar no cambia nada estructuralmente.' },
      { type:'final', xp:100, msg:'Tu tasa de ahorro es el dato más importante de tus finanzas. Cuídala como a tu salud.' },
    ]},
  { id:133, icon:'💸', title:'Flujo de Caja Personal', desc:'Qué entra, qué sale. Sin esto, todo lo demás es humo.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'12.800',
    steps:[
      { type:'content', tag:'📖 M133', title:'El cash flow doméstico',
        content:'<h3>Tu empresa se llama Tú S.A.</h3><p>Las empresas mejor gestionadas vigilan su flujo de caja diariamente. Tu economía personal funciona igual: el flujo de caja es la diferencia entre lo que entra y lo que sale cada mes.</p><p><strong>Flujo positivo:</strong> entra más de lo que sale. Construyes patrimonio.</p><p><strong>Flujo neutro:</strong> vas llegando a fin de mes sin margen. Estancado.</p><p><strong>Flujo negativo:</strong> sale más de lo que entra. Te endeudas o consumes ahorros.</p><p>Un error frecuente: confundir <em>patrimonio</em> (stock) con <em>flujo</em> (movimiento). Puedes tener €50.000 ahorrados y un flujo mensual negativo — estás quemando tu reserva.</p>' },
      { type:'content', tag:'📒 M133', title:'Contabilidad básica, sin hojas de cálculo',
        content:'<h3>Tres herramientas gratuitas</h3><ol><li><strong>App del banco</strong> — casi todas categorizan gastos automáticamente. Revísalas el día 1 de cada mes.</li><li><strong>Tarjeta única para gastos variables</strong> — una tarjeta específica para "deseos". Ves el total al instante.</li><li><strong>Transferencia automática al cobrar</strong> — el día del sueldo, que se vaya el ahorro. Lo que queda es lo gastable.</li></ol><p>El método más antiguo y efectivo: <em>pay yourself first</em>. Págate tú primero antes que a nadie. Si lo haces al final del mes, no queda nada — siempre.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes €30.000 ahorrados, gastas €2.200/mes y cobras €2.000/mes. ¿Qué describe mejor tu situación?', opts:['Rico porque tienes €30.000','Patrimonio alto pero flujo negativo — consumes ahorros','Perfecto, vas sobrado','Flujo neutro, todo estable'], ans:1, exp:'Tener patrimonio pero gastar más de lo que ingresas es consumir ahorros. El flujo de caja es la métrica que revela la realidad día a día.' },
      { type:'final', xp:100, msg:'Flujo de caja bajo control = tranquilidad mental. Revísalo cada 30 días sin excepción.' },
    ]},
  { id:134, icon:'🏛️', title:'Patrimonio Neto Real', desc:'La foto de tu riqueza de verdad: activos menos deudas. Sin autoengaños.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'14.600',
    steps:[
      { type:'content', tag:'📖 M134', title:'El cálculo que no puedes fingir',
        content:'<h3>Patrimonio neto = Activos − Pasivos</h3><p>Tu patrimonio neto es la única métrica que no se puede manipular. Mide lo que realmente tienes si liquidaras todo hoy.</p><p><strong>Activos</strong> (lo que tienes):</p><ul><li>Cuenta corriente y ahorro</li><li>Inversiones (acciones, ETFs, fondos, plan de pensiones)</li><li>Vivienda al valor de mercado actual</li><li>Coche al valor de mercado (suele depreciar 20% al año)</li><li>Efectivo</li></ul><p><strong>Pasivos</strong> (lo que debes):</p><ul><li>Hipoteca pendiente</li><li>Préstamos personales</li><li>Tarjetas de crédito no pagadas</li><li>Deudas familiares, hacienda, etc.</li></ul>' },
      { type:'content', tag:'📈 M134', title:'La trampa del "vale tanto"',
        content:'<h3>Patrimonio real vs patrimonio declarado</h3><p>Mucha gente dice "mi casa vale €300.000" pero deben €220.000 de hipoteca. Patrimonio real en vivienda: <strong>€80.000</strong>, no €300.000.</p><p>Los expertos como Thomas J. Stanley (<em>The Millionaire Next Door</em>) descubrieron que la mayoría de millonarios tienen <strong>patrimonio neto alto pero perfil modesto</strong> — porque distinguen entre parecer rico y ser rico. Un coche caro es un pasivo que reduce tu patrimonio neto cada año.</p><p>Calcula tu patrimonio cada 3 meses. Es la gráfica que debe subir.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes €20.000 ahorrados, €80.000 invertidos, casa de €250.000 con €180.000 de hipoteca, coche de €15.000 y €8.000 de préstamo personal. ¿Cuál es tu patrimonio neto?', opts:['€385.000','€185.000','€177.000','€105.000'], ans:2, exp:'(20k + 80k + 250k + 15k) − (180k + 8k) = €365k − €188k = €177k. La casa no es tuya entera; el coche es un activo que decrece.' },
      { type:'final', xp:100, msg:'Calcula tu patrimonio neto hoy. Es tu punto de partida honesto.' },
    ]},
  { id:135, icon:'🧱', title:'Gastos Fijos vs Variables', desc:'La clasificación que revela dónde hay margen real.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'11.300',
    steps:[
      { type:'content', tag:'📖 M135', title:'Dos naturalezas muy distintas',
        content:'<h3>Los gastos no son iguales</h3><p>Clasificar tus gastos en <strong>fijos</strong> y <strong>variables</strong> es el primer paso para optimizarlos.</p><p><strong>Gastos fijos</strong> — se repiten cada mes con el mismo importe o uno muy similar:</p><ul><li>Alquiler o hipoteca</li><li>Suministros base (luz fija, internet, móvil)</li><li>Seguros</li><li>Gimnasio, suscripciones digitales</li><li>Cuotas de préstamos</li></ul><p><strong>Gastos variables</strong> — cambian mes a mes:</p><ul><li>Comida (supermercado + restaurantes)</li><li>Ocio y entretenimiento</li><li>Ropa, regalos, caprichos</li><li>Gasolina, transporte puntual</li></ul>' },
      { type:'content', tag:'⚙️ M135', title:'Dónde está el margen real',
        content:'<h3>La regla de los expertos</h3><p>Un principio clave: <strong>los gastos fijos son más fáciles de recortar, aunque cueste más decidir</strong>. Renegociar el alquiler una vez o cambiar de compañía móvil ahorra dinero cada mes, sin esfuerzo continuo.</p><p>Los variables son más visibles pero más difíciles de recortar de forma sostenida — implican disciplina diaria.</p><p><strong>Estrategia óptima:</strong></p><ol><li>Una vez al año, audita todos los fijos y recórtalos (operadores, suscripciones, seguros)</li><li>Define un presupuesto variable semanal (no mensual) — el cerebro no maneja bien 30 días</li><li>Automatiza el ahorro antes de que llegue a la cuenta variable</li></ol>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué estrategia tiene mayor impacto duradero con menor esfuerzo diario?', opts:['Comer menos fuera','Cambiar a un plan móvil más barato','Comprar ropa de segunda mano','Caminar en lugar de coger taxi'], ans:1, exp:'Renegociar un gasto fijo una vez ahorra durante meses o años sin esfuerzo continuo. Los variables requieren disciplina diaria.' },
      { type:'final', xp:100, msg:'Audita tus fijos una vez al año. Te regalará cientos de euros sin cambiar tu estilo de vida.' },
    ]},
  { id:136, icon:'🪙', title:'Inflación y Poder Adquisitivo', desc:'El impuesto invisible que nadie votó. Cómo destruye tus ahorros si no actúas.', xp:110, tag:'FUNDAMENTOS', tagC:'green', users:'16.900',
    steps:[
      { type:'content', tag:'📖 M136', title:'El ladrón silencioso',
        content:'<h3>Qué es la inflación realmente</h3><p>La inflación mide cuánto suben los precios en un periodo. Si la inflación anual es 4%, lo que hoy cuesta €100 costará €104 el año que viene.</p><p>Esto significa que <strong>el dinero parado en una cuenta sin remunerar pierde valor cada año</strong>. No porque desaparezca, sino porque compra menos.</p><p>Ejemplo real: €10.000 en una cuenta al 0% durante 10 años con inflación media del 3%:</p><p>Valor nominal: €10.000<br>Valor real (poder de compra): <strong>€7.374</strong></p><p>Perdiste €2.626 sin que nadie te robara.</p>' },
      { type:'content', tag:'🛡️ M136', title:'Cómo proteger tu dinero',
        content:'<h3>El mínimo vital: batir la inflación</h3><p>Tu objetivo como inversor no es "ganar dinero" — es como mínimo <strong>mantener tu poder adquisitivo</strong>. Si la inflación es 3% y tus ahorros rentan 1%, estás perdiendo 2% real cada año.</p><p>Activos que históricamente han batido la inflación a largo plazo:</p><ul><li><strong>Bolsa global</strong> (S&P 500, MSCI World): ~7% real anual</li><li><strong>Inmuebles en zonas con demanda</strong>: ~3-4% real + alquiler</li><li><strong>Bonos ligados a la inflación</strong>: 0-2% real pero garantizados</li></ul><p>Activos que pierden contra la inflación: cuentas corrientes sin remunerar, efectivo en casa y depósitos a corto plazo al 0%.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes €20.000 en cuenta al 0%. Inflación media 3%. ¿Qué pasa en 10 años?', opts:['Siguen valiendo €20.000','Tu poder de compra baja a €14.900 reales','El banco te quita el 3%','Ganas €6.000 de intereses'], ans:1, exp:'€20.000 × (1-0.03)^10 ≈ €14.900. Pierdes poder adquisitivo sin que se mueva el saldo nominal.' },
      { type:'final', xp:110, msg:'Entender la inflación es el primer paso para invertir. Sin esto, ahorrar no basta.' },
    ]},
  { id:137, icon:'📈', title:'Euríbor: El Tipo que Mueve tu Hipoteca', desc:'Qué es, cómo se calcula y por qué determina lo que pagas cada mes.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'13.700',
    steps:[
      { type:'content', tag:'📖 M137', title:'El índice europeo de referencia',
        content:'<h3>Euríbor sin tecnicismos</h3><p>El <strong>Euríbor</strong> (Euro Interbank Offered Rate) es el tipo al que los bancos europeos se prestan dinero entre sí. Es el índice al que se referencian la mayoría de hipotecas variables en España.</p><p>Existen varios plazos — a 1 semana, 1 mes, 3 meses, 6 meses y 12 meses. El más común para hipotecas es el <strong>Euríbor a 12 meses</strong>.</p><p>Su valor depende de las expectativas de tipos del BCE. Cuando el BCE sube tipos, el Euríbor sube. Cuando baja, el Euríbor baja.</p>' },
      { type:'content', tag:'💶 M137', title:'Impacto real en tu cuota',
        content:'<h3>El cálculo de tu hipoteca variable</h3><p>Tu cuota = <strong>(Euríbor + diferencial del banco) aplicado al capital pendiente</strong>.</p><p>Ejemplo: hipoteca de €150.000 a 25 años, diferencial +0,8%:</p><ul><li>Euríbor al <strong>-0,5%</strong> (2021) → cuota ~€530/mes</li><li>Euríbor al <strong>4,0%</strong> (2023) → cuota ~€820/mes</li></ul><p>Una subida del 4,5% puede añadir <strong>€290/mes = €3.480/año</strong> a tu cuota. Por eso existe la hipoteca fija.</p><p>El Euríbor se revisa normalmente cada 6 o 12 meses según contrato.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿A qué referencia se ajustan la mayoría de hipotecas variables en España?', opts:['IPC','Euríbor 12 meses','Tipo del BCE','Prima de riesgo'], ans:1, exp:'El Euríbor a 12 meses es la referencia más usada para hipotecas variables en España.' },
      { type:'final', xp:100, msg:'Revisa la evolución del Euríbor antes de firmar cualquier hipoteca variable.' },
    ]},
  { id:138, icon:'📑', title:'TAE vs TIN: Cuál es la Cifra que Importa', desc:'El truco de marketing que usan bancos y tarjetas. Nunca más te engañen.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'15.400',
    steps:[
      { type:'content', tag:'📖 M138', title:'Dos siglas, una trampa',
        content:'<h3>La diferencia clave</h3><p><strong>TIN</strong> (Tipo de Interés Nominal): es el interés "puro" del préstamo o depósito. No incluye comisiones ni frecuencia de liquidación.</p><p><strong>TAE</strong> (Tasa Anual Equivalente): incluye TIN + comisiones + periodicidad de pagos. Es el coste real anual.</p><p>Por ley, todos los productos financieros deben mostrar la TAE. Pero muchos anuncios destacan solo el TIN porque es menor.</p><p>Ejemplo: préstamo con TIN 5% pero 1% de comisión de apertura y pagos mensuales → TAE real ~5,5%.</p>' },
      { type:'content', tag:'🔍 M138', title:'Cómo comparar productos',
        content:'<h3>La regla de oro</h3><ul><li>Al comparar <strong>préstamos</strong> (deuda): elige el que tenga <em>menor TAE</em></li><li>Al comparar <strong>depósitos o cuentas remuneradas</strong>: elige el que tenga <em>mayor TAE</em></li></ul><p>Caso típico: dos tarjetas de crédito.</p><p>Tarjeta A: "TIN 12% — ¡oferta!" Pero con TAE 24% (comisión anual + revolving).</p><p>Tarjeta B: "TAE 15%" sin letra pequeña. Es más barata aunque parezca más cara al leer.</p><p>Siempre mira la TAE. Es la cifra que la ley obliga a publicar y la única comparable.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Un préstamo ofrece "solo 4,5% TIN" pero la TAE es 7,2%. ¿Qué significa?', opts:['Es un error del banco','Hay comisiones o pagos frecuentes que elevan el coste real','La TAE siempre es superior por ley','El TIN es más importante'], ans:1, exp:'La diferencia entre TIN y TAE la explican las comisiones y la frecuencia de liquidación. La TAE refleja el coste real anual.' },
      { type:'final', xp:100, msg:'Regla simple: ignora el TIN en marketing, compara siempre por TAE.' },
    ]},
  { id:139, icon:'📄', title:'Cómo Leer tu Nómina Línea por Línea', desc:'El documento que firmas cada mes sin entender. Lo descifras en 10 minutos.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'17.200',
    steps:[
      { type:'content', tag:'📖 M139', title:'Anatomía de una nómina española',
        content:'<h3>Las tres grandes secciones</h3><p>Una nómina tiene tres partes claras:</p><p><strong>1. Devengos</strong> — lo que te pagan bruto:</p><ul><li>Salario base</li><li>Complementos (antigüedad, puesto, idiomas)</li><li>Pagas extras prorrateadas o no</li><li>Horas extras, pluses</li></ul><p><strong>2. Deducciones</strong> — lo que te descuentan:</p><ul><li>Cotización Seguridad Social (4,7% aprox del trabajador)</li><li>IRPF (retención variable según salario y situación familiar)</li><li>Otros descuentos (desempleo, formación)</li></ul><p><strong>3. Líquido a percibir</strong> — lo que te ingresan realmente.</p>' },
      { type:'content', tag:'💡 M139', title:'Los números que debes vigilar',
        content:'<h3>Lo importante en tu nómina</h3><p><strong>Base de cotización:</strong> determina tu pensión futura, paro y bajas. Cuanto mayor, mejor cobertura futura — aunque implique más descuento hoy.</p><p><strong>Porcentaje de IRPF retenido:</strong> Hacienda lo ajusta. Si te retienen más de lo que debes, te devuelven en la declaración. Si retienen menos, pagas. Es un saldo, no un regalo.</p><p><strong>Pagas extras:</strong> 14 pagas (12 + 2 extras) es lo estándar. Si están prorrateadas, cobras lo mismo los 12 meses. Si no, en junio y diciembre cobras doble.</p><p>Tip: guarda tus nóminas. Te las pedirán para alquileres, hipotecas, prestamos y trámites administrativos.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Por qué la base de cotización alta es importante a largo plazo?', opts:['Permite ganar más hoy','Determina tu pensión futura, paro y prestaciones','Reduce el IRPF','Es obligatorio por ley'], ans:1, exp:'La base de cotización alta significa mejor pensión futura, mayor prestación por desempleo y mejores coberturas de la Seguridad Social.' },
      { type:'final', xp:100, msg:'Si entiendes tu nómina, puedes detectar errores y negociar mejor tu salario.' },
    ]},
  { id:140, icon:'🏦', title:'Cuentas Bancarias: Corrientes, Remuneradas, Ahorro', desc:'No todas las cuentas son iguales. Elegir la correcta puede darte €500/año.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'14.100',
    steps:[
      { type:'content', tag:'📖 M140', title:'Los tres tipos fundamentales',
        content:'<h3>Cuenta corriente</h3><p>La cuenta "de toda la vida". Sirve para recibir nómina, domiciliar recibos y usar la tarjeta. Rentabilidad: <strong>0%</strong>. Comisiones: altas si no cumples requisitos.</p><h3>Cuenta remunerada</h3><p>Funciona igual que una corriente pero te paga un interés (2-4% habitual en 2024). Suele tener condiciones: nómina domiciliada, importe máximo remunerado (€30.000-€50.000 típico).</p><h3>Cuenta de ahorro</h3><p>Sin tarjeta ni movimientos frecuentes. Rentabilidad similar o superior a remunerada. Ideal para fondo de emergencia.</p>' },
      { type:'content', tag:'⚙️ M140', title:'La estructura óptima',
        content:'<h3>El sistema de dos o tres cuentas</h3><p><strong>Cuenta 1 — Operativa (corriente):</strong> donde llega tu sueldo. De aquí se pagan recibos y gastos variables con tarjeta.</p><p><strong>Cuenta 2 — Fondo de emergencia (remunerada o ahorro):</strong> 3-6 meses de gastos. Separada mentalmente: no es "dinero disponible".</p><p><strong>Cuenta 3 — Inversión (broker):</strong> donde van las aportaciones mensuales a ETFs o fondos indexados.</p><p>El principio: <em>separar dinero de gasto, de emergencia y de inversión en cuentas distintas</em>. Reduce la tentación de gastar el ahorro.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Dónde deberías guardar tu fondo de emergencia?', opts:['En la cuenta corriente con tarjeta','En efectivo en casa','En cuenta remunerada o de ahorro separada','Todo invertido en bolsa'], ans:2, exp:'Separado de la cuenta operativa (para no gastarlo) pero líquido y accesible (no invertido). Cuenta remunerada o de ahorro es perfecta.' },
      { type:'final', xp:100, msg:'Si todavía tienes todo en una sola cuenta, es el momento de separar.' },
    ]},
  { id:141, icon:'🚨', title:'Fondo de Emergencia Avanzado', desc:'No es solo "3 meses de gastos". La versión experta que pocos conocen.', xp:110, tag:'FUNDAMENTOS', tagC:'green', users:'13.500',
    steps:[
      { type:'content', tag:'📖 M141', title:'Por qué 3 meses es el mínimo, no la meta',
        content:'<h3>El cálculo correcto</h3><p>El consejo clásico de "3 meses de gastos" es el <strong>mínimo absoluto</strong>. El fondo ideal depende de tu perfil:</p><ul><li><strong>Empleado fijo con pareja que trabaja:</strong> 3 meses de gastos</li><li><strong>Empleado fijo soltero:</strong> 4-5 meses</li><li><strong>Empleado con contrato temporal:</strong> 6 meses</li><li><strong>Freelance o autónomo:</strong> 6-12 meses</li><li><strong>Emprendedor sin ingresos estables:</strong> 12-18 meses</li></ul><p>La clave no es el número — es la <strong>capacidad de dormir tranquilo</strong> ante una emergencia.</p>' },
      { type:'content', tag:'💡 M141', title:'Dónde guardarlo y en qué formato',
        content:'<h3>El fondo de emergencia en capas</h3><p>Los expertos recomiendan dividir el fondo en tres niveles:</p><p><strong>Capa 1 — Liquidez total (30% del fondo):</strong> cuenta remunerada con disponibilidad inmediata. Para imprevistos del día a día.</p><p><strong>Capa 2 — Disponibilidad 1-3 días (50%):</strong> cuenta de ahorro o depósito con retirada rápida pero no instantánea. Evita tentaciones.</p><p><strong>Capa 3 — Corto plazo (20%):</strong> letras del tesoro o monetarios. Rentabilidad superior a costa de liquidez más lenta.</p><p>Error común: tener todo el fondo en la cuenta corriente (capa 1) — pierde valor contra inflación y tientas gastarlo.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Eres freelance con gastos de €1.800/mes. ¿Cuánto debería ser tu fondo de emergencia?', opts:['€3.600 (2 meses)','€5.400 (3 meses)','€10.800 (6 meses)','€21.600 (12 meses)'], ans:3, exp:'Freelance o autónomo: 6-12 meses mínimo por la inestabilidad de ingresos. 12 meses (€21.600) es lo recomendable.' },
      { type:'final', xp:110, msg:'Un fondo de emergencia completo es la mayor pausa mental que puedes comprar.' },
    ]},
  { id:142, icon:'🎯', title:'Objetivos SMART Financieros', desc:'La diferencia entre soñar con ser rico y llegar a serlo.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'10.800',
    steps:[
      { type:'content', tag:'📖 M142', title:'El framework que multiplica por 3 el éxito',
        content:'<h3>SMART aplicado al dinero</h3><p>Un estudio de la Dominican University demostró que fijar objetivos específicos con número y fecha multiplica por 3 la probabilidad de conseguirlos. El framework SMART significa:</p><ul><li><strong>S</strong>pecific (específico): "ahorrar dinero" no vale, "ahorrar €5.000"</li><li><strong>M</strong>easurable (medible): con número exacto</li><li><strong>A</strong>chievable (alcanzable): realista dado tu ingreso</li><li><strong>R</strong>elevant (relevante): conectado con un objetivo mayor</li><li><strong>T</strong>ime-bound (con fecha): deadline concreto</li></ul><p>Ejemplo malo: "quiero ahorrar más".<br>Ejemplo SMART: "quiero tener <strong>€12.000</strong> de fondo de emergencia el <strong>31 de diciembre de 2026</strong>, ahorrando <strong>€400/mes</strong>".</p>' },
      { type:'content', tag:'🪜 M142', title:'El sistema de metas por horizontes',
        content:'<h3>Tres horizontes, tres metas</h3><p>Para no sentirte abrumado, divide tus objetivos por plazo:</p><p><strong>Corto plazo (0-2 años):</strong></p><ul><li>Fondo de emergencia completo</li><li>Liquidar tarjeta de crédito</li><li>Ahorrar para un curso o formación</li></ul><p><strong>Medio plazo (2-7 años):</strong></p><ul><li>Entrada para una vivienda</li><li>Libertad laboral parcial</li><li>Empezar un negocio</li></ul><p><strong>Largo plazo (7+ años):</strong></p><ul><li>Independencia financiera</li><li>Jubilación complementaria</li><li>Herencia para hijos</li></ul><p>Una meta por cada horizonte. Más de tres te dispersa.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Cuál de estos es un objetivo SMART correctamente formulado?', opts:['Quiero ser rico algún día','Voy a ahorrar este año','Tendré €30.000 invertidos para el 31 de diciembre de 2027','Ahorrar un poco cada mes'], ans:2, exp:'Solo el tercero es específico (€30.000), medible, con fecha concreta y potencialmente alcanzable. Los demás son deseos, no objetivos.' },
      { type:'final', xp:100, msg:'Escribe tus 3 metas SMART hoy. Las que no están en papel no existen.' },
    ]},
  { id:143, icon:'🤖', title:'Pay Yourself First: El Hábito del 1%', desc:'El hábito más importante para cualquier persona que quiera ser rica.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'18.700',
    steps:[
      { type:'content', tag:'📖 M143', title:'La regla que divide ricos y pobres',
        content:'<h3>Págate tú primero</h3><p>Popularizada por George S. Clason en <em>El Hombre Más Rico de Babilonia</em> (1926), la regla es simple: <strong>antes de pagar a nadie más, págate a ti mismo</strong>.</p><p>La mayoría de personas hacen esto:</p><p>Ingresos − Gastos = Ahorro (lo que queda, si queda)</p><p>Los ricos hacen esto:</p><p>Ingresos − Ahorro = Gastos (lo que puedes usar)</p><p>La diferencia es brutal. Invirtiendo el 10-20% del sueldo el día que llega, <strong>nunca lo tienes mentalmente disponible para gastar</strong>.</p>' },
      { type:'content', tag:'⚙️ M143', title:'Cómo automatizarlo en 15 minutos',
        content:'<h3>El sistema del día 1</h3><p>El día que cobras — o el día 1 de cada mes — debe ejecutarse automáticamente esto:</p><ol><li>Transferencia al fondo de emergencia (mientras no esté completo)</li><li>Transferencia al broker/fondo de inversión (aportación mensual fija)</li><li>Transferencia a cuentas de objetivos específicos (vivienda, viaje, etc.)</li></ol><p>Todo <strong>programado por el banco</strong>, no manual. Si depende de tu fuerza de voluntad, fallará.</p><p>Empieza con el 1% si no puedes más. Sube 1% cada tres meses. En 2 años estás en el 10%. En 5 años, en el 20%.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Cuál es el orden correcto para "pay yourself first"?', opts:['Pagar facturas → Gastar en ocio → Ahorrar lo que quede','Ahorrar automáticamente → Pagar facturas → Gastar lo que quede','Ganar más → Gastar más → Ahorrar más','No importa el orden, lo importante es ahorrar'], ans:1, exp:'Ahorrar primero (automatizado), luego pagar necesidades y finalmente disponer de lo que queda. Este orden elimina la dependencia de la fuerza de voluntad.' },
      { type:'final', xp:100, msg:'Programa la transferencia automática hoy. Es la decisión financiera más rentable que puedes tomar.' },
    ]},
  { id:144, icon:'📋', title:'Presupuesto Zero-Based', desc:'El sistema militar que asigna cada euro antes de gastarlo.', xp:110, tag:'FUNDAMENTOS', tagC:'green', users:'9.400',
    steps:[
      { type:'content', tag:'📖 M144', title:'Cada euro tiene un nombre',
        content:'<h3>El principio zero-based</h3><p>El presupuesto zero-based, popularizado por Dave Ramsey en <em>Total Money Makeover</em>, exige que <strong>Ingresos − Asignaciones = €0 exactos</strong>.</p><p>No se trata de gastarlo todo — se trata de que cada euro tenga un destino asignado <em>antes</em> de que empiece el mes:</p><ul><li>Alquiler: €700</li><li>Comida: €400</li><li>Transporte: €150</li><li>Ocio: €200</li><li>Ahorro: €500</li><li>Inversión: €300</li><li>Gastos imprevistos: €150</li><li>...</li></ul><p>Total = ingresos del mes. Ni un euro suelto.</p>' },
      { type:'content', tag:'🎖️ M144', title:'Por qué funciona tan bien',
        content:'<h3>La ciencia del efecto</h3><p>Tres razones por las que el zero-based es imbatible:</p><p><strong>1. Elimina el "dinero fantasma":</strong> ese dinero que está en tu cuenta sin propósito claro y acaba gastado en cosas que no recuerdas.</p><p><strong>2. Visibiliza las fugas:</strong> si en tu presupuesto no queda dinero para ocio, no puedes gastar en ocio sin sacarlo de otra partida. La decisión es consciente.</p><p><strong>3. Convierte el ahorro en gasto:</strong> asignar €500 al ahorro lo convierte en una "factura" igual de obligatoria que el alquiler. No es opcional.</p><p>Se hace una vez al mes, tarda 30-45 minutos. Apps como YNAB o EveryDollar lo facilitan, pero basta una hoja de papel.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué significa "zero-based budget"?', opts:['Empezar sin dinero en la cuenta','Cada euro del ingreso debe tener un destino asignado de antemano','Presupuesto para personas sin ingresos','Ahorrar el 100% del sueldo'], ans:1, exp:'Zero-based significa que ingresos menos asignaciones suma cero — cada euro está presupuestado antes del mes.' },
      { type:'final', xp:110, msg:'Haz tu primer zero-based budget este mes. Cambia tu relación con el dinero.' },
    ]},
  { id:145, icon:'💰', title:'El Mito del Salario: Por Qué Ganar Más No Te Hace Rico', desc:'La razón psicológica por la que la mayoría nunca acumula patrimonio, aunque gane más.', xp:110, tag:'FUNDAMENTOS', tagC:'green', users:'20.100',
    steps:[
      { type:'content', tag:'📖 M145', title:'Lifestyle creep: el enemigo silencioso',
        content:'<h3>El fenómeno que arruina altos salarios</h3><p>El <strong>lifestyle creep</strong> (inflación del estilo de vida) es la tendencia a gastar más conforme ganas más. Suena obvio, pero es la razón número uno por la que personas con salarios de €60.000, €100.000 o €200.000 acaban sin ahorros.</p><p>Un estudio del Bank of America de 2023 mostró que:</p><ul><li>El <strong>33% de personas con ingresos de €150.000+</strong> vive al día</li><li>La tasa de ahorro <strong>no sube</strong> significativamente con el salario — sube el gasto</li></ul><p>Si siempre gastas un 95% de lo que ingresas, ganar el doble no te hace más rico — solo aumenta tu nivel de vida en proporción.</p>' },
      { type:'content', tag:'🧠 M145', title:'La fórmula de la riqueza real',
        content:'<h3>El ratio que importa: Gap de ahorro</h3><p>La riqueza se construye con la <strong>brecha entre lo que ganas y lo que gastas</strong>. No con ninguna de las dos cifras por separado.</p><p><strong>Escenario A:</strong> gana €2.000, gasta €1.500, ahorra €500 → tasa 25%</p><p><strong>Escenario B:</strong> gana €10.000, gasta €9.500, ahorra €500 → tasa 5%</p><p>El escenario B aparenta más éxito pero acumula patrimonio <em>más despacio</em>.</p><p>Reglas para evitar el lifestyle creep:</p><ul><li>Ante una subida salarial: ahorra al menos el 50% del incremento</li><li>No actualices coche, piso o estilo de vida cada vez que sube el sueldo</li><li>Automatiza el ahorro al porcentaje, no al importe fijo</li></ul>' },
      { type:'quiz', tag:'🧠 TEST', q:'Cobras €2.000, te suben el sueldo a €3.000. ¿Qué haces según la mejor práctica?', opts:['Gasto los €1.000 extra para mejorar mi vida','Ahorro €500 y me permito €500 extra de gasto','Gasto todo, me lo merezco','Ahorro los €1.000 completos'], ans:1, exp:'Ahorrar el 50% del incremento (€500) y permitirte mejorar un poco con el otro 50% evita el lifestyle creep pero permite disfrute gradual.' },
      { type:'final', xp:110, msg:'Ganar más no te hace rico. Gastar menos de lo que ganas sí.' },
    ]},
  { id:146, icon:'🎯', title:'Asset Allocation: La Decisión que Vale el 90%', desc:'Qué porcentaje en acciones, bonos y efectivo. La elección que determina tu rentabilidad.', xp:120, tag:'INVERSIÓN', tagC:'blue', users:'12.300',
    steps:[
      { type:'content', tag:'📖 M146', title:'El estudio que lo cambió todo',
        content:'<h3>Brinson, Hood & Beebower — 1986</h3><p>Un estudio histórico analizó la rentabilidad de 91 grandes fondos de pensiones durante 10 años. Resultado: <strong>el 93,6% de la variabilidad de rentabilidad se explicaba por el asset allocation</strong> — no por el stock picking ni el market timing.</p><p>En otras palabras: elegir qué porcentaje va a acciones vs bonos vs efectivo importa mucho más que elegir <em>qué</em> acción comprar.</p><p>La regla clásica del 100:</p><p><strong>% en acciones = 100 − tu edad</strong></p><p>A los 30 años: 70% acciones, 30% renta fija. A los 60: 40% acciones, 60% renta fija.</p><p>Variantes modernas (120-edad) ajustan por mayor esperanza de vida.</p>' },
      { type:'content', tag:'⚖️ M146', title:'Más allá de la edad',
        content:'<h3>Factores que ajustan tu allocation</h3><p>La regla de 100-edad es un punto de partida. Ajustes recomendados:</p><ul><li><strong>Tolerancia al riesgo alta:</strong> +10% en acciones</li><li><strong>Estabilidad laboral baja:</strong> -10% en acciones (necesitas más liquidez)</li><li><strong>Horizonte &gt;20 años:</strong> +10-20% en acciones</li><li><strong>Necesidad de ingresos pasivos:</strong> +10% en bonos o dividendo</li></ul><p>Carteras modelo populares:</p><ul><li><strong>All Weather (Ray Dalio):</strong> 30% acciones, 40% bonos largos, 15% bonos medios, 7,5% oro, 7,5% commodities</li><li><strong>Three-Fund (Bogle):</strong> 60% bolsa US, 20% bolsa internacional, 20% bonos</li><li><strong>Permanent Portfolio (Harry Browne):</strong> 25% acciones, 25% bonos largos, 25% oro, 25% efectivo</li></ul>' },
      { type:'quiz', tag:'🧠 TEST', q:'Según el estudio Brinson-Hood-Beebower, ¿qué determina la mayoría de la rentabilidad de una cartera?', opts:['Elegir las mejores acciones','Entrar y salir en el momento correcto','El asset allocation (qué % en cada tipo de activo)','Pagar comisiones bajas'], ans:2, exp:'El 93,6% de la variabilidad viene del asset allocation. Stock picking y market timing explican apenas el 6,4%.' },
      { type:'final', xp:120, msg:'Define tu asset allocation antes de comprar nada. Es la decisión que más impactará tu retorno.' },
    ]},
  { id:147, icon:'📊', title:'Backtest y Performance Real', desc:'Por qué los "+15% anual histórico" suelen ser marketing. Cómo leerlos bien.', xp:120, tag:'INVERSIÓN', tagC:'blue', users:'9.800',
    steps:[
      { type:'content', tag:'📖 M147', title:'Los 4 sesgos del backtest',
        content:'<h3>Lo que no te cuentan los gráficos bonitos</h3><p>Un backtest es una simulación de cómo habría rendido una estrategia en el pasado. Parece objetivo, pero tiene sesgos brutales:</p><p><strong>1. Survivorship bias (sesgo del superviviente):</strong> los índices incluyen solo empresas vivas hoy. Las que quebraron se eliminan. Esto infla la rentabilidad histórica en un 1-2% anual.</p><p><strong>2. Lookback bias:</strong> diseñar la estrategia conociendo ya el resultado. Es como predecir el ganador del mundial después de verlo.</p><p><strong>3. Data mining:</strong> probar 1000 estrategias hasta encontrar una que funcionó por pura casualidad.</p><p><strong>4. Costes ignorados:</strong> la mayoría de backtests omiten comisiones, impuestos y slippage (diferencia entre precio teórico y ejecutado).</p>' },
      { type:'content', tag:'🔍 M147', title:'Cómo evaluar una rentabilidad real',
        content:'<h3>Las 3 preguntas que debes hacer</h3><p>Antes de creer que un fondo o estrategia "rinde X% anual":</p><p><strong>1. ¿Es rentabilidad neta o bruta?</strong> Neta = después de comisiones e impuestos. Bruta = antes. Un fondo con 7% bruto y 2% de TER te da 5% neto real.</p><p><strong>2. ¿Es CAGR o rentabilidad media aritmética?</strong> La media aritmética infla. Si un año ganas 100% y al siguiente pierdes 50%, la media aritmética dice "25% anual" — pero tu CAGR real es 0%.</p><p><strong>3. ¿Incluye el peor escenario?</strong> Un fondo con 12% medio que tiene un -60% en 2008 puede quebrar tu tolerancia emocional y tu cartera real.</p><p>Fuentes fiables de rentabilidades reales: Morningstar, MSCI, portalesfinancieros oficiales.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Un fondo ganó +100% un año y perdió -50% al siguiente. ¿Cuál es el CAGR real?', opts:['+50% anual','+25% anual','0% anual (sin ganar nada)','-25% anual'], ans:2, exp:'€100 → €200 → €100. Has vuelto al punto de partida. CAGR = 0%. La media aritmética engaña.' },
      { type:'final', xp:120, msg:'Nunca inviertas basándote en rentabilidad pasada sin entender cómo se calculó.' },
    ]},
  { id:148, icon:'🧾', title:'Impuestos en Inversión: Net Returns Reales', desc:'El 19-28% que se queda Hacienda convierte el 7% en 5,4%. El detalle que cambia todo.', xp:120, tag:'INVERSIÓN', tagC:'blue', users:'14.700',
    steps:[
      { type:'content', tag:'📖 M148', title:'La tributación española de inversiones',
        content:'<h3>Tramos de rendimientos del capital mobiliario (2024)</h3><p>En España, los rendimientos de inversión tributan así:</p><ul><li>Hasta <strong>€6.000</strong>: 19%</li><li>De €6.000 a <strong>€50.000</strong>: 21%</li><li>De €50.000 a <strong>€200.000</strong>: 23%</li><li>De €200.000 a <strong>€300.000</strong>: 27%</li><li>Más de €300.000: 28%</li></ul><p>Aplica a:</p><ul><li>Plusvalías (compraste a €100, vendes a €200 → tributa €100)</li><li>Dividendos</li><li>Intereses de depósitos y bonos</li><li>Fondos de inversión al rescatarlos</li></ul><p><strong>Importante:</strong> si mantienes un fondo traspasándolo, no tributas. Esto se llama "diferimiento fiscal" y es una ventaja fiscal enorme frente a ETFs en España.</p>' },
      { type:'content', tag:'💰 M148', title:'Estrategias legales de optimización',
        content:'<h3>Cómo pagar menos legalmente</h3><p><strong>1. Diferimiento con fondos:</strong> traspasar entre fondos no tributa. Los ETFs sí. Para un inversor español, fondos indexados &gt; ETFs puramente por fiscalidad.</p><p><strong>2. Aprovechar pérdidas:</strong> si tienes plusvalías y minusvalías, se compensan. Vender algo con pérdida antes de fin de año puede reducir tu factura fiscal.</p><p><strong>3. Plan de pensiones:</strong> reduce base imponible hoy (aportación máxima €1.500/año). Tributa al rescate pero con base menor si coincide con tramo bajo.</p><p><strong>4. Orden de ventas:</strong> en una misma acción, se aplica FIFO (first in, first out). Vender las más antiguas puede tener diferente tributación que las nuevas.</p><p><strong>5. Herencias y donaciones:</strong> la plusvalía se "resetea" en una transmisión mortis causa en muchos casos.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes €8.000 de plusvalías en bolsa. ¿Cuánto tributas en IRPF (2024)?', opts:['€800 (10%)','€1.530','€1.560','€1.600'], ans:2, exp:'Primeros €6.000 al 19% = €1.140. Siguientes €2.000 al 21% = €420. Total €1.560.' },
      { type:'final', xp:120, msg:'Tu rentabilidad real es siempre la NETA después de impuestos. Pónsela en el Excel.' },
    ]},
  { id:149, icon:'⚖️', title:'Market Cap vs Equal Weight: No Todos los Índices son Iguales', desc:'La diferencia que explica por qué tu ETF S&P 500 no se parece al del primo.', xp:120, tag:'INVERSIÓN', tagC:'blue', users:'8.900',
    steps:[
      { type:'content', tag:'📖 M149', title:'Los dos grandes esquemas de ponderación',
        content:'<h3>Market cap weighted vs equal weighted</h3><p>Cuando compras un "S&P 500", lo que compras depende de cómo se ponderen las 500 empresas:</p><p><strong>Market cap weighted (capitalización):</strong> cada empresa pesa en proporción a su valor bursátil. En 2024, Apple + Microsoft + NVIDIA + Amazon + Meta + Google pesan ~30% del S&P 500 entero. Si te va bien a estas 6, te va bien al índice.</p><p><strong>Equal weighted (peso igual):</strong> cada empresa pesa 1/500 = 0,2%. Apple pesa lo mismo que la empresa número 500 del índice.</p><p>La diferencia parece sutil. No lo es.</p>' },
      { type:'content', tag:'📈 M149', title:'Impacto real en rentabilidad',
        content:'<h3>El caso del S&P 500 en 2023-2024</h3><p>En 2023:</p><ul><li>S&P 500 <strong>Market Cap</strong>: +26% (gracias a "Magnificent 7": Apple, Microsoft, Google, Amazon, NVIDIA, Meta, Tesla)</li><li>S&P 500 <strong>Equal Weight</strong>: +13,9%</li></ul><p>Cuando los grandes tiran, market cap bate. Cuando hay rotación a small caps, equal weight bate.</p><p><strong>Ventajas de Market Cap:</strong></p><ul><li>Menor rotación → menos comisiones</li><li>Refleja mejor el "tamaño real" de la economía</li><li>Liquidez máxima</li></ul><p><strong>Ventajas de Equal Weight:</strong></p><ul><li>Exposición real a small/mid caps</li><li>Menos dependiente de pocas empresas (diversificación real)</li><li>Históricamente bate ligeramente a largo plazo (factor size)</li></ul><p>Combinar ambos (60% market cap + 40% equal weight) es una estrategia balanceada.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué diferencia principal hay entre S&P 500 Market Cap y S&P 500 Equal Weight?', opts:['Tienen distintas empresas','Market Cap pondera por tamaño; Equal Weight da mismo peso a las 500','Equal Weight solo tiene 50 empresas','No hay diferencia real'], ans:1, exp:'Mismas 500 empresas. Diferente ponderación: Market Cap premia a las grandes; Equal Weight las trata por igual.' },
      { type:'final', xp:120, msg:'Antes de comprar un ETF, mira cómo pondera. No todos los S&P 500 son el mismo S&P 500.' },
    ]},
  { id:150, icon:'❄️', title:'Snowball vs Avalanche: Cómo Amortizar Deudas', desc:'Dos métodos probados. Matemáticamente uno gana, pero el otro es más efectivo en la práctica.', xp:120, tag:'DEUDA', tagC:'orange', users:'16.800',
    steps:[
      { type:'content', tag:'📖 M150', title:'Los dos métodos clásicos',
        content:'<h3>Snowball (Bola de Nieve)</h3><p>Popularizado por Dave Ramsey. Ordenas tus deudas <strong>de menor a mayor saldo</strong> e ignoras el tipo de interés. Pagas el mínimo en todas y atacas la más pequeña con todo el extra disponible.</p><p><em>Ventaja psicológica:</em> liquidas la primera deuda rápido, ganas dopamina y sigues motivado.</p><h3>Avalanche (Avalancha)</h3><p>Ordenas por <strong>tipo de interés</strong>, de mayor a menor. Atacas la del interés más alto primero, independientemente del saldo.</p><p><em>Ventaja matemática:</em> pagas menos intereses totales. Puede ahorrarte cientos o miles de euros.</p>' },
      { type:'content', tag:'🧠 M150', title:'Cuál elegir en la práctica',
        content:'<h3>La respuesta depende de ti</h3><p>Estudios del Journal of Consumer Research demuestran que el <strong>snowball genera más adherencia emocional</strong>. Personas que empezaron con snowball completan el plan un 15% más que avalanche.</p><p>Avalanche es óptimo solo si:</p><ul><li>Tienes alta disciplina financiera</li><li>La diferencia de tipos entre deudas es grande (&gt;5%)</li><li>El ahorro en intereses supera los €500</li></ul><p>Snowball es mejor si:</p><ul><li>Tienes muchas deudas pequeñas</li><li>Necesitas victorias rápidas para no rendirte</li><li>Los tipos son similares entre deudas</li></ul><p>Híbrido recomendado: snowball pero saltándote las deudas con interés &gt;20% (revolving), que atacas primero independientemente del saldo.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes 3 deudas: €500 al 4%, €2.000 al 8%, €500 al 22%. ¿Cuál atacas primero con método híbrido?', opts:['La de €500 al 4% (menor saldo)','La de €500 al 22% (interés muy alto)','La de €2.000 al 8% (mayor saldo)','Todas por igual'], ans:1, exp:'Al 22% es revolving típico — ataca primero por los intereses destructivos. Luego snowball normal (la otra de €500, después la de €2.000).' },
      { type:'final', xp:120, msg:'El mejor método es el que terminas. Elige el que te mantenga en marcha.' },
    ]},
  { id:151, icon:'💳', title:'La Trampa del Revolving: TAE 24% Explicada', desc:'La peor deuda al consumidor en España. Cómo identificarla y salir de ella.', xp:120, tag:'DEUDA', tagC:'orange', users:'19.500',
    steps:[
      { type:'content', tag:'📖 M151', title:'Qué es la tarjeta revolving',
        content:'<h3>El producto financiero más tóxico legal</h3><p>Una tarjeta revolving es un crédito rotatorio donde <strong>pagas una cuota mensual fija</strong>. Suena cómodo pero tiene dos trampas:</p><ul><li>La cuota mensual es muy baja (1-3% del saldo)</li><li>El TAE típico es <strong>20-27%</strong> anual</li></ul><p>Resultado: el interés crece más rápido que lo que amortizas. Deuda de por vida.</p><p>Ejemplo real: €5.000 al 24% TAE pagando €100/mes:</p><ul><li>Tardas <strong>más de 10 años</strong> en liquidarla</li><li>Acabas pagando <strong>€11.800</strong> (€5.000 principal + €6.800 intereses)</li></ul><p>El Tribunal Supremo español ha declarado nulas varias tarjetas revolving por "interés usurario" desde 2020.</p>' },
      { type:'content', tag:'🚨 M151', title:'Cómo identificarla y salir',
        content:'<h3>Señales de alarma</h3><ul><li>Cuota mensual fija independiente de lo que hayas gastado</li><li>TAE superior al 18%</li><li>Cuota mínima inferior al 5% del saldo total</li><li>Contrato habla de "crédito al consumo" o "crédito flexible"</li></ul><p><strong>Nombres comerciales frecuentes:</strong> "Pago flexible", "Pago fácil", "Revolving", "Crédito rotativo".</p><h3>Plan de escape</h3><ol><li><strong>Cortar el uso:</strong> destruir tarjeta o bloquearla.</li><li><strong>Avalanche agresivo:</strong> atacar con el máximo extra posible.</li><li><strong>Préstamo de consolidación:</strong> pedir préstamo personal al 7-10% para liquidarla (mejor TAE).</li><li><strong>Reclamación judicial:</strong> si TAE &gt;20%, contacta con asociaciones de consumidores (ADICAE, OCU). Muchas devoluciones exitosas.</li></ol>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Por qué es tan peligrosa una tarjeta revolving?', opts:['Tiene cuotas variables','El interés crece más rápido que lo que amortizas con la cuota mínima','Es ilegal','Solo la usan personas ricas'], ans:1, exp:'La cuota baja (1-3%) combinada con TAE 24% hace que el interés supere lo amortizado. Deuda permanente.' },
      { type:'final', xp:120, msg:'Si tienes una tarjeta revolving, cancélala hoy. Es la deuda más destructiva del sistema.' },
    ]},
  { id:152, icon:'🔗', title:'Consolidación de Deudas: Cuándo Tiene Sentido', desc:'Agrupar varias deudas en una. A veces salva, a veces empeora. El análisis claro.', xp:120, tag:'DEUDA', tagC:'orange', users:'11.400',
    steps:[
      { type:'content', tag:'📖 M152', title:'Qué es la consolidación',
        content:'<h3>Juntar todas tus deudas en una sola</h3><p>La consolidación de deudas significa pedir un <strong>préstamo nuevo</strong> (personal, hipotecario o al consumo) y usarlo para liquidar todas tus deudas existentes. Quedas con una sola deuda, una cuota mensual y un tipo de interés.</p><p><strong>Tiene sentido si:</strong></p><ul><li>El TAE nuevo es significativamente menor (mínimo 3-5% menos)</li><li>Reduces la cuota mensual total</li><li>Tienes disciplina para no volver a endeudarte</li></ul><p><strong>NO tiene sentido si:</strong></p><ul><li>El plazo se alarga mucho (más intereses totales aunque la cuota sea menor)</li><li>Pagas comisiones de apertura &gt;2% del capital</li><li>Hipotecas la vivienda para consolidar deuda al consumo (peligroso)</li></ul>' },
      { type:'content', tag:'🧮 M152', title:'El cálculo que debes hacer',
        content:'<h3>Comparación real: ejemplo numérico</h3><p>Situación actual:</p><ul><li>Tarjeta 1: €2.000 al 22% TAE</li><li>Tarjeta 2: €1.500 al 18% TAE</li><li>Préstamo coche: €3.500 al 8% TAE</li></ul><p>Total: €7.000 con TAE media ponderada ~15%. Cuota total mensual: ~€350.</p><p><strong>Opción A: consolidación al 9% TAE a 5 años</strong></p><ul><li>Cuota: €145/mes</li><li>Total pagado: €8.700 (€1.700 intereses)</li></ul><p><strong>Opción B: avalanche sin consolidar</strong></p><ul><li>Seguir cuota actual €350/mes</li><li>Terminas en ~24 meses</li><li>Total pagado: €8.400 (€1.400 intereses)</li></ul><p>La consolidación baja la presión mensual pero aumenta el total. <em>La clave: ¿podrás mantener los €350/mes con fuerza de voluntad?</em> Si no, consolida.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Cuándo NO conviene consolidar deudas?', opts:['Cuando bajas el TAE considerable','Cuando alargas mucho el plazo y pagas más intereses totales','Cuando simplificas tus pagos','Cuando evitas impagos'], ans:1, exp:'Alargar el plazo baja la cuota pero puede duplicar los intereses totales. Siempre compara el coste final, no solo la cuota mensual.' },
      { type:'final', xp:120, msg:'Consolida solo si el ahorro real (no la cuota) es significativo Y mantienes disciplina.' },
    ]},
  { id:153, icon:'🏅', title:'Tu Credit Score en España: CIRBE y Asnef', desc:'Los registros que te clasifican sin que lo sepas. Cómo consultarlos y limpiarlos.', xp:110, tag:'DEUDA', tagC:'orange', users:'13.200',
    steps:[
      { type:'content', tag:'📖 M153', title:'Los dos registros que importan',
        content:'<h3>CIRBE (Central de Información de Riesgos del Banco de España)</h3><p>Registro <strong>oficial y gratuito</strong> donde constan todos tus préstamos e hipotecas superiores a €9.000. Los bancos lo consultan antes de concederte crédito.</p><p>Incluye:</p><ul><li>Hipotecas activas</li><li>Préstamos personales y al consumo &gt;€9.000</li><li>Tarjetas de crédito con saldo</li></ul><p><strong>No incluye impagos</strong> — solo saldos vivos.</p><h3>ASNEF (Asociación Nacional de Establecimientos Financieros de Crédito)</h3><p>Registro <strong>privado de morosos</strong>. Te incluyen cuando:</p><ul><li>Dejas impagado un recibo de teléfono, luz, banco...</li><li>Debes más de €50 a una empresa socia de ASNEF</li></ul><p>Estar en ASNEF te cierra las puertas a hipotecas, préstamos y contratos de suministros.</p>' },
      { type:'content', tag:'🧹 M153', title:'Cómo consultar y limpiar',
        content:'<h3>Acceso gratuito por ley</h3><p><strong>CIRBE:</strong> vas a la sede electrónica del Banco de España con certificado digital o DNI electrónico. Consulta gratis y online.</p><p><strong>ASNEF:</strong> derecho a solicitar por escrito qué datos tienen de ti (Ley Orgánica de Protección de Datos). Correo postal certificado o formulario web de ASNEF Consumer.</p><h3>Salir de ASNEF</h3><ol><li><strong>Pagar la deuda:</strong> una vez pagada, exige por burofax que te eliminen del fichero en 30 días (LOPD).</li><li><strong>Reclamar si el dato es erróneo:</strong> carta certificada a ASNEF + reclamación en AEPD si no responden.</li><li><strong>Caducidad:</strong> las deudas se eliminan solas a los 5 años desde el impago.</li></ol><p>Estar en ASNEF por €80 mal gestionados puede impedirte una hipoteca de €200.000. Tómalo en serio.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Pagaste una deuda que te había metido en ASNEF. ¿Qué hacer después?', opts:['Esperar a que caduque en 5 años','Exigir por burofax que te eliminen en 30 días','Nada, es automático','Cambiar de banco'], ans:1, exp:'Por ley, una vez pagada la deuda debes exigir la baja. No es automática — exigir con burofax es el método más efectivo.' },
      { type:'final', xp:110, msg:'Consulta tu CIRBE y ASNEF una vez al año. Descubrir errores te puede salvar una hipoteca.' },
    ]},
  { id:154, icon:'⚖️', title:'Ratio Deuda/Ingresos: Tu Salud Financiera en un Número', desc:'El indicador que usan los bancos para decidir si te prestan. Y por qué debería importarte.', xp:110, tag:'DEUDA', tagC:'orange', users:'10.200',
    steps:[
      { type:'content', tag:'📖 M154', title:'El cálculo del ratio',
        content:'<h3>Qué es y cómo se calcula</h3><p>El <strong>ratio deuda/ingresos (DTI en inglés)</strong> mide qué porcentaje de tu ingreso mensual se va en pagar deudas.</p><p><strong>Fórmula:</strong></p><p>DTI = (Total cuotas mensuales de deuda ÷ Ingreso mensual neto) × 100</p><p>Ejemplo: ingresas €2.000 netos, pagas €400 de hipoteca, €80 de préstamo coche y €50 mínimo de tarjeta.</p><p>DTI = (530 ÷ 2.000) × 100 = <strong>26,5%</strong></p><h3>Interpretación por tramos</h3><ul><li><strong>&lt;20%:</strong> excelente. Bancos te conceden lo que pidas.</li><li><strong>20-35%:</strong> saludable. Margen cómodo para emergencias.</li><li><strong>35-43%:</strong> al límite. Bancos dudarán en concederte más crédito.</li><li><strong>&gt;43%:</strong> zona peligrosa. Cualquier imprevisto te rompe.</li></ul>' },
      { type:'content', tag:'🎯 M154', title:'Cómo bajarlo estratégicamente',
        content:'<h3>Tres palancas para mejorar tu ratio</h3><p><strong>1. Subir ingresos:</strong> negociar aumento, side hustle, alquilar una habitación. Cada €100 extra de ingreso neto baja tu DTI.</p><p><strong>2. Bajar deudas:</strong> amortizar capital reduce cuotas o elimina deudas. La deuda más tóxica (mayor ratio cuota/saldo) debe ir primero.</p><p><strong>3. Alargar plazos (cuidadosamente):</strong> refinanciar a plazo más largo baja la cuota y por tanto el DTI, aunque pagues más intereses totales. Útil si estás al límite.</p><h3>El DTI para comprar vivienda</h3><p>Los bancos españoles aplican esta regla: la cuota de hipoteca no debe superar el <strong>30-35% de tus ingresos netos</strong>, sumando resto de deudas. Si tu DTI actual (sin hipoteca) es 15%, te prestarán hasta cuota que sume 35% total = 20% adicional en hipoteca.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Ganas €2.500 netos. Pagas €900 de hipoteca, €120 del coche, €60 tarjeta. ¿Tu DTI es?', opts:['30% (saludable)','35% (al límite)','43,2% (zona peligrosa)','50% (crisis)'], ans:2, exp:'(900+120+60) / 2500 × 100 = 43,2%. Estás en zona peligrosa — un imprevisto puede romperte.' },
      { type:'final', xp:110, msg:'Calcula tu DTI hoy. Es el número de una cifra más importante de tu salud financiera.' },
    ]},
  { id:155, icon:'📃', title:'Préstamos Personales: Cuándo Sí, Cuándo No', desc:'La línea fina entre herramienta útil y trampa. El criterio experto.', xp:100, tag:'DEUDA', tagC:'orange', users:'12.700',
    steps:[
      { type:'content', tag:'📖 M155', title:'Los casos donde tiene sentido',
        content:'<h3>Préstamo personal justificado</h3><p>Contrariamente al mantra "todo endeudamiento es malo", hay situaciones donde un préstamo personal es la mejor decisión:</p><ul><li><strong>Consolidación de deuda cara:</strong> cambiar tarjetas al 22% por préstamo al 8% = ahorro real.</li><li><strong>Gasto médico urgente:</strong> imposible esperar a ahorrar. Ojo al TAE.</li><li><strong>Formación con alto ROI:</strong> un máster que aumentará tu salario 30-40% puede justificar endeudamiento al 5-7%.</li><li><strong>Oportunidad de negocio con retorno claro:</strong> compra de activo productivo con rentabilidad &gt; interés del préstamo.</li><li><strong>Reforma necesaria de vivienda:</strong> no estética, sino funcional (tejado, caldera, saneamiento).</li></ul>' },
      { type:'content', tag:'🚫 M155', title:'Los casos donde NO tiene sentido',
        content:'<h3>Préstamo personal destructivo</h3><p>Nunca pidas un préstamo personal para:</p><ul><li><strong>Vacaciones:</strong> pagar €3.000 al 9% durante 4 años = €3.600. Endeudarte para ocio es lifestyle creep tóxico.</li><li><strong>Coche de capricho:</strong> un coche es un pasivo que deprecia. Préstamo + depreciación = doble pérdida.</li><li><strong>Bodas de €20.000+:</strong> empezar matrimonio endeudado predice divorcio. Estudios lo confirman.</li><li><strong>Invertir en bolsa o crypto:</strong> apalancarte con deuda para invertir es trading profesional. No para particulares.</li><li><strong>Tecnología de último modelo:</strong> iPhone financiado a 24 meses al 15% TAE es una de las peores decisiones estadísticas.</li></ul><h3>Checklist antes de firmar</h3><ol><li>¿Puedo pagar la cuota con margen de seguridad del 20%?</li><li>¿El TAE es &lt;10%? Si no, negocia o busca otro.</li><li>¿El uso generará retorno económico, formativo o de salud? Si no, piensa 30 días antes.</li></ol>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Cuál es el criterio principal para que un préstamo personal tenga sentido financiero?', opts:['Que sea barato (&lt;10% TAE)','Que lo necesites urgentemente','Que el destino genere retorno económico, formativo o de salud superior al coste','Que lo pueda pagar a cómodos plazos'], ans:2, exp:'Un préstamo se justifica cuando el retorno (económico, formativo, salud) supera el coste total con intereses. Si no, erosiona patrimonio.' },
      { type:'final', xp:100, msg:'Antes de firmar un préstamo, pregúntate: "¿Pagaría este gasto si tuviera que ahorrarlo primero?"' },
    ]},
  { id:156, icon:'⚡', title:'Microcréditos: La Trampa del Día', desc:'TAE del 800% es real. Cómo los reconoces y por qué son peligrosos.', xp:110, tag:'DEUDA', tagC:'orange', users:'8.900',
    steps:[
      { type:'content', tag:'📖 M156', title:'Qué son y cómo operan',
        content:'<h3>Los "préstamos rápidos" sin aval</h3><p>Microcréditos (Vivus, Cashper, Creditea, Wandoo, etc.) son préstamos pequeños (€50-€1.000) con plazo muy corto (7-30 días) y aprobación instantánea sin aval ni nómina.</p><p><strong>Características</strong>:</p><ul><li>TAE típico: <strong>300-2.000%</strong> anual (sí, bien leído)</li><li>Comisión inicial: €20-€50 por cada €100 prestados</li><li>Penalización por impago: 5-10% del principal cada semana</li></ul><p>Ejemplo: préstamo de €300 a devolver en 30 días. Comisión €90. TAE real: ~1.100%.</p><p>Están regulados pero no prohibidos. La Ley de Crédito al Consumo (2014) exige transparencia en TAE pero no limita tipos.</p>' },
      { type:'content', tag:'🕳️ M156', title:'El círculo vicioso del microcrédito',
        content:'<h3>Cómo te atrapa el sistema</h3><p>El perfil típico: persona con ingresos bajos, necesidad urgente, sin acceso a bancos. Pide €300 para un imprevisto.</p><p><strong>Mes 1:</strong> no puede devolver. Refinancia pagando solo intereses.</p><p><strong>Mes 2:</strong> la deuda crece. Pide otro microcrédito para pagar el primero.</p><p><strong>Mes 3:</strong> ya debe a 3 empresas. Sale en ASNEF. Los bancos le cierran las puertas.</p><p>Un 38% de usuarios de microcréditos acaba en espiral según estudios del Banco de España.</p><h3>Alternativas reales</h3><ul><li><strong>Cooperativas de crédito:</strong> Caja de Ingenieros, Caja Laboral — TAE 6-10%</li><li><strong>Préstamo familiar con papel:</strong> acuerdo escrito, sin intereses</li><li><strong>Vender algo de valor:</strong> Wallapop, Cash Converters — recuperas liquidez sin deuda</li><li><strong>Ayudas públicas:</strong> Cáritas, Servicios Sociales, Fondos de ayuda municipales</li><li><strong>Anticipo de nómina:</strong> algunas empresas lo facilitan</li></ul>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué TAE típico tiene un microcrédito como Vivus o Creditea?', opts:['5-10%','18-25%','80-150%','300-2.000%'], ans:3, exp:'TAE típico 300-2.000%. Son legales pero destructivos. Nunca son la solución — son la trampa.' },
      { type:'final', xp:110, msg:'Si alguna vez piensas en pedir un microcrédito, busca una alternativa. Cualquiera es mejor.' },
    ]},
  { id:157, icon:'🛡️', title:'Seguros de Vida: Cuándo Sí, Cuándo No', desc:'El seguro que muchos tienen sin necesitar y otros necesitan sin tener.', xp:110, tag:'DEUDA', tagC:'orange', users:'11.300',
    steps:[
      { type:'content', tag:'📖 M157', title:'Qué seguro de vida necesitas',
        content:'<h3>Los dos tipos principales</h3><p><strong>Seguro de vida TEMPORAL (term life):</strong> pagas una prima anual baja durante un plazo fijo (10, 20, 30 años). Si mueres en ese plazo, tus beneficiarios cobran una suma. Si no mueres, el contrato expira sin retorno.</p><p><strong>Seguro de vida ENTERA (whole life):</strong> cobertura vitalicia. Prima mucho más alta. Suele incluir componente de ahorro/inversión.</p><h3>Regla experta</h3><p>El 95% de personas necesitan solo seguro temporal. Es 5-10 veces más barato y cumple la función real: proteger a dependientes mientras los construyas financieramente.</p><p>El seguro de vida entera suele ser un producto empaquetado caro vendido con comisiones altas. Solo tiene sentido en planificación patrimonial compleja (herencias grandes, optimización fiscal avanzada).</p>' },
      { type:'content', tag:'✅ M157', title:'Cuánto y cuándo contratarlo',
        content:'<h3>La fórmula del capital correcto</h3><p>Fórmula DIME (Debt + Income + Mortgage + Education):</p><ul><li><strong>D</strong>ebt: todas tus deudas actuales</li><li><strong>I</strong>ncome: 10 años de tu ingreso neto</li><li><strong>M</strong>ortgage: saldo pendiente de hipoteca</li><li><strong>E</strong>ducation: formación futura de hijos</li></ul><p>Ejemplo: €20.000 deudas + €24.000 × 10 = €240.000 + €120.000 hipoteca + €80.000 educación = <strong>€460.000 de capital asegurado</strong>.</p><h3>Cuándo NO lo necesitas</h3><ul><li>No tienes personas económicamente dependientes</li><li>Eres soltero sin hijos ni padres que dependan de tus ingresos</li><li>Ya tienes patrimonio suficiente para cubrir las necesidades de tus herederos (auto-aseguramiento)</li></ul><p>La prima típica de un seguro temporal 30 años para no fumador sano de 30 años: <strong>€200-€400 al año</strong> por €300.000 de capital. Muy asequible.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes 32 años, casado, 2 hijos, €150k hipoteca pendiente, ganas €2.500 netos/mes. ¿Qué seguro de vida necesitas?', opts:['No necesitas seguro','Seguro temporal 20-25 años por ~€400.000','Seguro de vida entera por €100.000','Solo uno muy básico'], ans:1, exp:'Perfil típico que necesita seguro temporal por un capital que cubra hipoteca + años de ingresos + educación hijos. Fórmula DIME da ~€400k.' },
      { type:'final', xp:110, msg:'Seguro de vida temporal: barato y efectivo. Evita los productos complicados con componente de ahorro.' },
    ]},
  { id:158, icon:'🏠', title:'Seguro de Hogar: Cobertura Óptima, Ni Más Ni Menos', desc:'Lo que realmente necesitas cubrir. Los extras que son marketing.', xp:100, tag:'DEUDA', tagC:'orange', users:'10.500',
    steps:[
      { type:'content', tag:'📖 M158', title:'Las tres coberturas esenciales',
        content:'<h3>Qué cubre un seguro de hogar típico</h3><p>Un seguro de hogar tiene tres patas:</p><p><strong>1. Continente:</strong> la estructura (paredes, suelos, instalaciones fijas). Si eres propietario, el banco suele exigirlo con la hipoteca.</p><p><strong>2. Contenido:</strong> tus pertenencias (muebles, electrodomésticos, ropa, joyas). Si alquilas, es lo único que aseguras.</p><p><strong>3. Responsabilidad civil:</strong> daños a terceros causados por tu vivienda (escape de agua que daña al vecino, por ejemplo). Es la cobertura más infravalorada.</p><h3>Cálculo correcto de capitales</h3><ul><li>Continente: valor de reconstrucción (NO el precio de mercado). Suele ser 60-70% del precio de compra.</li><li>Contenido: inventario real, no estimación rápida. Incluye electrónicos, muebles, ropa.</li><li>Responsabilidad civil: mínimo €150.000, ideal €300.000.</li></ul>' },
      { type:'content', tag:'💸 M158', title:'Los extras que NO necesitas',
        content:'<h3>Marketing en el seguro de hogar</h3><p>Coberturas frecuentes que suelen ser innecesarias:</p><ul><li><strong>Asistencia informática:</strong> 90% de problemas se solucionan con Google</li><li><strong>Servicio de manitas incluido:</strong> viene con coberturas muy limitadas, acabas pagando por encima</li><li><strong>Robo en el exterior:</strong> ya lo cubre tu seguro de responsabilidad civil o el comercial</li><li><strong>Todo riesgo accidental:</strong> cobertura muy amplia pero prima 2-3x más cara. Innecesaria salvo perfiles con niños pequeños o patrimonio muy alto</li><li><strong>Joyas de alto valor:</strong> cobertura específica por encima de un límite. Si no tienes joyas valiosas, ignóralo</li></ul><p>Estrategia óptima: contratar cobertura básica pero con capitales suficientes + responsabilidad civil alta. Suele salir por €200-350 al año.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué cobertura es la más importante y subestimada en un seguro de hogar?', opts:['Todo riesgo accidental','Responsabilidad civil','Asistencia informática','Joyas de alto valor'], ans:1, exp:'La RC cubre daños a terceros. Un escape de agua que afecta al vecino de abajo puede costar decenas de miles. La cobertura básica suele incluirla, pero revisa el capital.' },
      { type:'final', xp:100, msg:'Ajusta tu seguro de hogar: capital correcto, RC alta, sin extras innecesarios.' },
    ]},
  { id:159, icon:'🏥', title:'Seguro de Salud Privado vs Seguridad Social', desc:'Cuándo merece la pena pagar €60/mes extra cuando tienes sanidad pública gratuita.', xp:110, tag:'DEUDA', tagC:'orange', users:'14.200',
    steps:[
      { type:'content', tag:'📖 M159', title:'La realidad del sistema español',
        content:'<h3>Lo que da y lo que no la Seguridad Social</h3><p>La sanidad pública española está entre las mejores del mundo en <strong>cirugía mayor, urgencias vitales, oncología y cardiología</strong>. Es inigualable.</p><p>Limitaciones reales del sistema público:</p><ul><li>Listas de espera: pruebas diagnósticas no urgentes (3-12 meses)</li><li>Especialistas: consulta de traumatología, dermatología, ginecología (2-6 meses)</li><li>Pruebas de imagen no urgentes (resonancia, TAC): 2-8 meses</li><li>Elección de médico o centro limitada</li></ul><p>Un seguro privado típico soluciona todo esto pagando <strong>€40-€80/mes</strong> (persona joven sana).</p>' },
      { type:'content', tag:'⚖️ M159', title:'Cuándo sí, cuándo no',
        content:'<h3>Perfil donde TIENE sentido</h3><ul><li>Familias con niños pequeños (pediatras sin espera)</li><li>Embarazadas que quieren elegir hospital y obstetra</li><li>Personas con problemas crónicos menores recurrentes</li><li>Autónomos (deducible fiscalmente hasta €500/año por titular + familiar)</li><li>Perfiles con ansiedad ante listas de espera</li></ul><h3>Perfil donde NO tiene sentido</h3><ul><li>Joven sano soltero con trabajo estable y pocas visitas médicas</li><li>Si ya tienes seguro privado a través de la empresa (evita duplicar)</li><li>Si tu presupuesto es justo y puedes priorizar ese dinero a ahorro/inversión</li></ul><h3>Alternativa intermedia</h3><p>Seguros de "reembolso" (pagas consultas privadas, el seguro te devuelve el 80-90%): más baratos y flexibles. También cuadros médicos reducidos con primas muy bajas (€25-€40/mes).</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué perfil se beneficia más claramente de un seguro de salud privado?', opts:['Joven sano con trabajo estable','Pensionista que ya no trabaja','Familia con niños pequeños que necesita pediatras sin espera','Estudiante universitario'], ans:2, exp:'Familias con niños pequeños son el perfil más claro: pediatras accesibles sin cita previa y rápida solución a catarros, otitis, urgencias no vitales.' },
      { type:'final', xp:110, msg:'Evalúa honestamente: ¿cuántas veces has ido al médico este año? Si son pocas, el dinero quizás rinde más invertido.' },
    ]},
  { id:160, icon:'🚗', title:'Seguro de Coche: Tercero, Terceros Ampliado o Todo Riesgo', desc:'Las tres modalidades explicadas con ejemplos. Cómo elegir sin pagar de más.', xp:100, tag:'DEUDA', tagC:'orange', users:'12.800',
    steps:[
      { type:'content', tag:'📖 M160', title:'Las tres modalidades',
        content:'<h3>Qué cubre cada una</h3><p><strong>Terceros (obligatorio por ley):</strong> cubre daños que tú causas a otros vehículos, personas o cosas. NO cubre los daños a tu propio coche.</p><p>Prima típica: <strong>€250-€450/año</strong>.</p><p><strong>Terceros ampliado:</strong> todo lo anterior + lunas + incendio + robo + asistencia en viaje. Sigue sin cubrir daños propios por accidente.</p><p>Prima típica: <strong>€400-€650/año</strong>.</p><p><strong>Todo riesgo:</strong> cubre tus propios daños aunque seas tú el culpable. Con o sin franquicia.</p><p>Prima típica: <strong>€700-€1.500/año</strong> según coche y perfil.</p>' },
      { type:'content', tag:'🎯 M160', title:'La regla del valor del coche',
        content:'<h3>Regla experta: todo riesgo cuando el coche vale más de €10.000</h3><p>El coste del todo riesgo tiene sentido si el valor del coche supera los €8.000-€10.000. Por debajo, pagas una prima alta para cubrir un activo que igualmente deprecia rápido.</p><p><strong>Coche nuevo (0-4 años) &gt; €15.000:</strong> todo riesgo con franquicia baja (€300-€500)</p><p><strong>Coche 5-8 años, €8.000-€15.000:</strong> todo riesgo con franquicia alta (€600-€1.000) o terceros ampliado</p><p><strong>Coche &gt; 8 años o &lt; €8.000:</strong> terceros o terceros ampliado</p><h3>La franquicia inteligente</h3><p>Aumentar la franquicia de €300 a €600 suele bajar la prima anual un 15-25%. Si no tienes accidentes frecuentes, te compensa.</p><p><strong>Evita:</strong></p><ul><li>Todo riesgo en coches &gt;10 años: pagas más en prima que el valor real del coche</li><li>Renovar con misma aseguradora sin comparar: primas suben 8-15% cada año automáticamente</li></ul>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes un coche de 2015 que vale €6.000. ¿Qué modalidad es más razonable?', opts:['Todo riesgo con franquicia baja','Todo riesgo sin franquicia','Terceros o terceros ampliado','Sin seguro'], ans:2, exp:'Con coches de valor bajo, todo riesgo no compensa. La prima puede acercarse al valor real del coche en pocos años. Terceros ampliado es óptimo.' },
      { type:'final', xp:100, msg:'Compara seguros cada año al renovar. La fidelidad te cuesta dinero.' },
    ]},
  { id:161, icon:'⚖️', title:'Responsabilidad Civil Personal: El Seguro que Nadie Conoce', desc:'Te proteges de demandas por daños accidentales. Prima ~€30/año, cobertura hasta €500.000.', xp:100, tag:'DEUDA', tagC:'orange', users:'8.400',
    steps:[
      { type:'content', tag:'📖 M161', title:'Qué es y por qué importa',
        content:'<h3>El seguro más asimétrico del mercado</h3><p>La <strong>Responsabilidad Civil Familiar o Personal</strong> cubre los daños que TÚ (o tu familia, perro, hijos) puedas causar accidentalmente a terceros en tu vida diaria.</p><p>Casos reales cubiertos:</p><ul><li>Tu hijo rompe el móvil de un compañero en el colegio</li><li>Tu perro muerde a alguien en el parque</li><li>Resbalas con un carrito en el supermercado y tiras a una persona</li><li>Se te cae una maceta del balcón y daña un coche aparcado</li><li>Practicas ciclismo y atropellas a un peatón</li></ul><p>Son casos que pueden generar indemnizaciones de €5.000 a €500.000. Sin cobertura, los pagas tú.</p>' },
      { type:'content', tag:'💡 M161', title:'Dónde y cuánto',
        content:'<h3>Cómo contratarlo</h3><p>Existen tres vías:</p><p><strong>1. Como complemento del seguro de hogar</strong> (lo más habitual). Ya viene incluido en casi todos los seguros de hogar con capital bajo (€60.000-€150.000). Eleva el capital a €300.000-€500.000 por un coste mínimo.</p><p><strong>2. Como seguro independiente.</strong> Primas desde <strong>€25-€60/año</strong> con coberturas de €300.000-€1.000.000. Insuperable relación prima/cobertura.</p><p><strong>3. Como complemento del seguro de coche o vida.</strong> Muchos aseguradoras lo ofrecen como añadido por pocos euros.</p><h3>Capitales recomendados</h3><ul><li>Mínimo: €300.000</li><li>Óptimo con familia: €500.000</li><li>Con hijos adolescentes o perros: €1.000.000</li></ul><p>En la era de las redes sociales y los juicios rápidos, este seguro es de los que más retorno dan en caso necesario.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿En cuál de estos casos te cubre la Responsabilidad Civil Personal?', opts:['Tu coche se avería','Te roban en casa','Tu hijo rompe el móvil de un compañero','Pierdes el trabajo'], ans:2, exp:'Daños accidentales a terceros causados por ti o tu familia. El móvil roto es un caso típico cubierto por la RC familiar.' },
      { type:'final', xp:100, msg:'Si no tienes RC personal o familiar, contrátala hoy. Por €30-€60/año es de los mejores seguros que puedes contratar.' },
    ]},
  { id:162, icon:'🚨', title:'Fondo de Emergencia vs Seguros: Cuál va Primero', desc:'La decisión de por dónde empezar. El orden correcto según los expertos.', xp:110, tag:'DEUDA', tagC:'orange', users:'9.700',
    steps:[
      { type:'content', tag:'📖 M162', title:'Las dos capas de protección',
        content:'<h3>El orden correcto</h3><p>Las finanzas personales tienen un orden lógico de protección ante imprevistos:</p><p><strong>Paso 1 — Fondo de emergencia (1.000€ mínimo):</strong> un colchón pequeño para emergencias menores (avería coche, electrodomésticos rotos, copago médico) sin recurrir a crédito.</p><p><strong>Paso 2 — Seguros obligatorios y críticos:</strong> coche (obligatorio), hogar (si propietario) y RC personal. Sin estos, un imprevisto grave te arruina aunque tengas ahorro.</p><p><strong>Paso 3 — Fondo de emergencia completo (3-6 meses de gastos):</strong> una vez protegido de catástrofes, amplías el colchón.</p><p><strong>Paso 4 — Seguros complementarios:</strong> vida (si tienes dependientes), salud privado (si las listas te afectan), invalidez.</p>' },
      { type:'content', tag:'💡 M162', title:'Por qué este orden',
        content:'<h3>La lógica estadística</h3><p>Los seguros cubren eventos de <strong>baja probabilidad pero alto impacto</strong> (accidente grave, incendio, muerte). El fondo de emergencia cubre eventos de <strong>alta probabilidad y bajo-medio impacto</strong> (reparación, gasto imprevisto).</p><p>Si solo tienes ahorros y no seguros: un evento catastrófico arrasa años de esfuerzo.</p><p>Si solo tienes seguros y no ahorros: pagas franquicias y copagos con tarjeta de crédito al 22%.</p><h3>Cómo distribuir €200 al mes al empezar</h3><p>Propuesta equilibrada para alguien sin ahorros ni seguros:</p><ul><li><strong>Primer mes:</strong> €100 al fondo inicial + €100 para contratar los seguros obligatorios anuales (prorrateo)</li><li><strong>Meses 2-3:</strong> €200 completar fondo inicial €1.000</li><li><strong>Meses 4-12:</strong> €200 a ampliar fondo hasta 3-6 meses de gastos</li><li><strong>Año 2:</strong> evaluar seguros complementarios según evolución familiar</li></ul>' },
      { type:'quiz', tag:'🧠 TEST', q:'Acabas de empezar tu vida laboral con €0 ahorros. ¿Qué priorizas primero?', opts:['Invertir en bolsa para aprovechar la juventud','Contratar 5 seguros para estar protegido','Fondo de emergencia pequeño (€1.000) + seguros obligatorios (coche, RC)','Pagar deudas al 5% con todo el ahorro'], ans:2, exp:'Primero un mínimo de €1.000 líquidos + seguros básicos obligatorios. Sin esto, cualquier imprevisto te endeuda a tipos altos.' },
      { type:'final', xp:110, msg:'Fondo de emergencia Y seguros. No es o uno o el otro — es ambos, en el orden correcto.' },
    ]},
  { id:163, icon:'🔄', title:'Refinanciación de Hipoteca: Cuándo y Cómo', desc:'El trámite que puede ahorrarte €30.000 en la vida útil de tu hipoteca.', xp:120, tag:'DEUDA', tagC:'orange', users:'11.900',
    steps:[
      { type:'content', tag:'📖 M163', title:'Cuándo tiene sentido refinanciar',
        content:'<h3>Las 4 situaciones claras</h3><p>Refinanciar tu hipoteca (subrogación a otro banco o novación con el mismo) tiene sentido si:</p><p><strong>1. Diferencial actual alto (&gt;1%):</strong> contratos antiguos con diferenciales de +2% o +3% sobre Euríbor. Hoy los nuevos están entre +0,5% y +1,2%.</p><p><strong>2. Cambio de variable a fija:</strong> si el Euríbor está bajo y proyectas que subirá, bloquear tipo fijo puede ahorrar mucho a largo plazo.</p><p><strong>3. Cambio de fija alta a variable o mixta:</strong> si firmaste al 4% fijo y ahora hay variables al 1,5% con Euríbor bajo, rebajas la cuota inmediatamente.</p><p><strong>4. Bajar plazo:</strong> si tu economía lo permite, acortar plazo reduce intereses totales pagados.</p>' },
      { type:'content', tag:'💰 M163', title:'Costes de refinanciar y cuándo compensa',
        content:'<h3>Los costes reales</h3><p>Refinanciar tiene costes. Ten en cuenta:</p><ul><li><strong>Tasación:</strong> €250-€500</li><li><strong>Notaría y registro:</strong> €500-€1.000</li><li><strong>Comisión por novación o subrogación:</strong> 0-1% del capital pendiente (negociable)</li><li><strong>Gestoría:</strong> €200-€400</li></ul><p>Total típico: <strong>€1.500-€2.500</strong>.</p><h3>Punto de equilibrio</h3><p>Calcula: ¿cuánto ahorras al mes con la nueva hipoteca? ¿Cuántos meses necesitas para recuperar los €2.000 de gastos?</p><p>Regla rápida: si la diferencia de tipo es &gt;0,8% o ahorras &gt;€100/mes, suele compensar en &lt;2 años. Recuperas los costes y el resto es ganancia neta.</p><h3>Proceso</h3><ol><li>Obtén ofertas de 3-4 bancos competidores con oferta vinculante</li><li>Lleva la mejor a tu banco actual y pide novación con esas condiciones</li><li>Si no iguala, subrogación al nuevo banco</li></ol>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes hipoteca al 3,5% fijo, quedan 15 años y €120.000. Bancos te ofrecen 2,1% fijo. ¿Compensa refinanciar?', opts:['No, fidelidad al banco primero','Sí, diferencia &gt;1%, ahorro claro a largo plazo','Depende del color del banco','No, los costes siempre superan el ahorro'], ans:1, exp:'Diferencia del 1,4% en €120.000 durante 15 años = ahorros de €15.000-€20.000 en intereses. Los costes de refinanciar (€2.000) se recuperan en 6-12 meses.' },
      { type:'final', xp:120, msg:'Revisa las condiciones de tu hipoteca cada 2-3 años. Una refinanciación puede valer decenas de miles.' },
    ]},
  { id:164, icon:'🔁', title:'Hipoteca Variable a Fija: Cuándo Cambiar', desc:'El análisis experto para decidir si bloqueas tu tipo o aguantas con Euríbor.', xp:110, tag:'DEUDA', tagC:'orange', users:'13.600',
    steps:[
      { type:'content', tag:'📖 M164', title:'La decisión más importante del hipotecado',
        content:'<h3>Variable vs fija: el dilema eterno</h3><p>Históricamente la variable ha sido más barata a largo plazo (Euríbor suele estar entre 0-2% la mayor parte del tiempo), pero con volatilidad.</p><p><strong>Variable:</strong></p><ul><li>Ventaja: cuotas más bajas cuando Euríbor está bajo</li><li>Desventaja: cuota puede subir 30-50% si Euríbor se dispara</li></ul><p><strong>Fija:</strong></p><ul><li>Ventaja: cuota inmutable toda la vida del préstamo</li><li>Desventaja: si los tipos bajan, pagas de más durante años</li></ul><p><strong>Mixta:</strong> fija los primeros años (5-10), variable después. Compromiso.</p>' },
      { type:'content', tag:'🎯 M164', title:'La regla experta para decidir',
        content:'<h3>Tres factores clave</h3><p><strong>1. Horizonte temporal:</strong> si te quedan más de 10 años de hipoteca, la fija protege contra ciclos largos de tipos altos.</p><p><strong>2. Estabilidad de ingresos:</strong> si tus ingresos son estables y justos, fija te da tranquilidad. Si tienes margen amplio, variable te permite aprovechar bajadas.</p><p><strong>3. Ciclo económico:</strong> cuando los tipos están en mínimos históricos (Euríbor &lt;1%), suele ser buen momento para fijar. Cuando están altos, la variable recupera ventaja matemática a largo plazo.</p><h3>Reglas prácticas</h3><ul><li>Si el fijo que te ofrecen es &lt;1,5% por encima del variable actual → fijo suele ganar</li><li>Si tu cuota fija sería &gt;40% de tus ingresos → considera alargar plazo antes que elegir tipo</li><li>Nunca fijes un tipo &gt; 3,5% en ciclos de tipos altos (el techo histórico medio es ~4%)</li></ul>' },
      { type:'quiz', tag:'🧠 TEST', q:'Euríbor al 2%, te ofrecen fijo al 2,8% o variable Euríbor+0,8%. Estás en año 2 de 25. ¿Qué tiene más sentido?', opts:['Variable siempre gana a largo plazo','Fijo al 2,8% bloquea un buen tipo sin volatilidad','Variable pero con techo','Depende solo del riesgo personal'], ans:1, exp:'Con 23 años por delante y tipos moderados, bloquear 2,8% fijo es razonable. Sin sustos y competitivo.' },
      { type:'final', xp:110, msg:'La mejor hipoteca es la que te deja dormir tranquilo, no la que optimiza al céntimo.' },
    ]},
];

// Fix: los módulos 108-130 quedaron dentro de EXAM_QUESTION_POOL por error.
// Los extraemos a MODULES y limpiamos EXAM_QUESTION_POOL.
(function() {
  for (var i = EXAM_QUESTION_POOL.length - 1; i >= 0; i--) {
    if (EXAM_QUESTION_POOL[i] && typeof EXAM_QUESTION_POOL[i].id === 'number') {
      MODULES.push(EXAM_QUESTION_POOL[i]);
      EXAM_QUESTION_POOL.splice(i, 1);
    }
  }
  // Ordenar MODULES por id para consistencia
  MODULES.sort(function(a, b) {
    var aId = (a && typeof a.id === 'number') ? a.id : -1;
    var bId = (b && typeof b.id === 'number') ? b.id : -1;
    return aId - bId;
  });
})();


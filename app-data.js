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
            p:'Las ganancias de capital y dividendos tributan en la <strong>Base Imponible del Ahorro</strong> (IRPF 2025): hasta 6.000€ → 19%, de 6.000€ a 50.000€ → 21%, de 50.000€ a 200.000€ → 23%, de 200.000€ a 300.000€ → 27%, más de 300.000€ → 30%. El dato fundamental: <strong>no tributas mientras no vendes</strong>. Mientras mantienes el ETF, el interés compuesto crece sin que Hacienda corte su parte.'},
          {t:'hl', s:'info', label:'💡 ESTRATEGIA: DIFERIMIENTO FISCAL',
            p:'Si tienes ETFs accumulating (acumulación), los dividendos se reinvierten automáticamente sin generar evento fiscal. Solo tributas cuando vendes. Si mantienes 20 años sin vender, el 100% del interés compuesto trabaja para ti sin interrupciones fiscales. Al vender, pagas sobre la ganancia total — pero esa ganancia es mucho mayor que si hubieras tributado cada año por los dividendos distribuidos.'},
        ]
      },

      /* ── Quiz 1 ── */
      {type:'quiz',
        q:'Tienes una ganancia realizada de 12.000€ en la venta de un ETF y una pérdida realizada de 3.000€ en la venta de unas acciones. ¿Cuánto pagas en concepto de IRPF (base del ahorro) en España en 2025?',
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
            p:'Los planes de pensiones reducen la Base General del IRPF (hasta 1.500€/año): si tributas al marginal del 40%, cada 1.500€ aportados te devuelven 600€ en la declaración. El truco: al rescatar el plan en jubilación, tributan en la Base General — si tu pensión pública es baja, puede ser ventajoso. Los fondos de inversión no tienen deducción inmediata, pero permiten traspasos sin tributar (de fondo a fondo), diferimiento fiscal ilimitado y más liquidez. La elección óptima depende de tu tipo marginal actual vs el esperado en jubilación.'},
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
    id:6, icon:'🛍️', title:'Psicología del Gasto',
    desc:'Los sesgos cognitivos que vacían tu cuenta bancaria',
    xp:22, tag:'PSICOLOGÍA', tagC:'purple', users:'28.700',
    steps:[
      {type:'content', tag:'🧠 Módulo 7', title:'Por Qué Gastamos Más de lo que Planeamos',
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
      {type:'final', xp:22, msg:'¡Mente financiera activada! Reconoces el sesgo del presente, el efecto ancla y el dolor del plástico. Esas tres trampas vacían cuentas — ahora las verás antes de caer.'},
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
      {type:'content', tag:'📊 Módulo 8', title:'La Estrategia de Inversión Más Validada de la Historia',
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
      {type:'final', xp:28, msg:'¡Inversor indexado certificado! Sabes por qué el 90% de los gestores pierde y cómo construir una cartera global de bajo coste. Ahora solo falta ejecutar el plan.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 8 — Criptomonedas: Fundamentos Sin Ruido
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:8, icon:'₿', title:'Criptomonedas: Fundamentos',
    desc:'Entiende la blockchain sin el hype ni el miedo irracional',
    xp:24, tag:'CRIPTO', tagC:'orange', users:'22.100',
    steps:[
      {type:'content', tag:'₿ Módulo 9', title:'Bitcoin, Blockchain y el Sistema Financiero del Futuro',
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
            p:'La AEAT considera las criptomonedas como activos patrimoniales. Las ganancias tributan como <strong>ganancias patrimoniales en el IRPF</strong>: 19% hasta 6.000€, 21% entre 6.000-50.000€, 23% entre 50.000-200.000€, 27% entre 200.000-300.000€ y 30% a partir de 300.000€. Cada intercambio (BTC→ETH, no solo venta a euros) es un hecho imponible. Mantener un registro exhaustivo de todas las operaciones es obligatorio.'},
        ]
      },
      {type:'final', xp:24, msg:'¡Cripto con criterio! Entiendes la blockchain, la diferencia entre Bitcoin y Ethereum y la Regla del 5%. Sin FOMO, con estrategia y tamaño de posición correcto.'},
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
      {type:'content', tag:'📋 Módulo 10', title:'Cómo Pagar Menos Impuestos de Forma Legal',
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
      {type:'final', xp:26, msg:'¡Fiscalmente inteligente! Plan de pensiones, compensación de pérdidas, Modelo 720 y diferimiento fiscal: las herramientas legales que los ricos usan y están disponibles para todos.'},
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
      {type:'content', tag:'🏠 Módulo 11', title:'La Decisión Financiera Más Grande de Tu Vida',
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
      {type:'final', xp:25, msg:'¡Decisión inmobiliaria desbloqueada! El Price-to-Rent ratio, el coste de oportunidad y las condiciones reales de la compra inteligente: el análisis que nadie te había explicado.'},
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
      {type:'content', tag:'💡 Módulo 12', title:'El Sistema que Elizabeth Warren le Enseñó al Mundo',
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
      {type:'final', xp:18, msg:'¡Sistema en piloto automático! La regla 50/30/20 es tu nuevo framework. Automatiza el ahorro el día que cobras y el resto se ordena solo. Empieza este mes.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 12 — Inversión Inmobiliaria para Principiantes
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:12, icon:'🏢', title:'Inversión Inmobiliaria',
    desc:'Del piso de alquiler a los REITs: todas las formas de invertir en ladrillo',
    xp:27, tag:'INMOBILIARIO', tagC:'orange', users:'24.300',
    steps:[
      {type:'content', tag:'🏗️ Módulo 13', title:'Invertir en Inmuebles: Más Allá de Comprar un Piso',
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
      {type:'final', xp:27, msg:'¡Estratega inmobiliario completo! Desde el piso de alquiler hasta los REITs y el crowdfunding: ya conoces todas las formas de invertir en ladrillo y cuándo tiene sentido cada una.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 13 — Seguros Esenciales: Protege lo que Has Construido
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:13, icon:'🩺', title:'Seguros Esenciales',
    desc:'Cuáles contratar, cuáles evitar y cómo no pagar de más',
    xp:20, tag:'PROTECCIÓN', tagC:'purple', users:'17.900',
    steps:[
      {type:'content', tag:'🛡️ Módulo 14', title:'Seguros: Tu Red de Seguridad Financiera',
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
      {type:'final', xp:20, msg:'¡Red de seguridad financiera activa! Sabes qué seguros son imprescindibles, cuáles son marketing puro y cómo pagar hasta un 50% menos comparando correctamente cada año.'},
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
      {type:'content', tag:'⚖️ Módulo 15', title:'El Arma de Doble Filo del Dinero Prestado',
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
      {type:'final', xp:23, msg:'¡Apalancamiento inteligente dominado! La diferencia entre deuda que construye riqueza y deuda que la destruye, con el método Avalanche para eliminar la mala de forma sistemática.'},
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
      {type:'content', tag:'🔥 Módulo 16', title:'FIRE: Financial Independence, Retire Early',
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
      {type:'final', xp:29, msg:'¡Tu número FIRE calculado! Con la Regla del 4% y el multiplicador x25, ya sabes exactamente cuánto necesitas para la independencia financiera — y que la tasa de ahorro supera al nivel de ingresos.'},
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
      {type:'content', tag:'💸 Módulo 17', title:'Los Dividendos: El Dinero que Trabaja por Ti',
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
      {type:'final', xp:24, msg:'¡Máquina de dividendos en construcción! Dividend Yield, Dividend Growth, Aristocrats y yield traps: ya tienes todo lo necesario para construir un flujo de renta pasiva real y sostenible.'},
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
      {type:'content', tag:'🌍 Módulo 18', title:'El Sistema Nervioso de la Economía Global',
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
      {type:'final', xp:26, msg:'¡Mapa del sistema financiero global trazado! Renta variable, renta fija, Forex y materias primas: entiendes cómo los tipos de interés mueven todos los mercados y cómo posicionarte en cada ciclo.'},
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
      {type:'content', tag:'🏖️ Módulo 19', title:'Tu Jubilación: El Proyecto Financiero Más Importante',
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
      {type:'final', xp:25, msg:'¡Jubilación planificada con números reales! Conoces la brecha real de la pensión pública, los tres pilares del sistema y la secuencia óptima para acumular el complemento privado que necesitas.'},
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
      {type:'content', tag:'🚀 Módulo 20', title:'La Aritmética de los Ingresos Múltiples',
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
      {type:'final', xp:30, msg:'¡Arquitecto de ingresos múltiples! El 65% de los millonarios diversificó ingresos antes de serlo. Ya tienes el framework MVP para construir el tuyo sin dejar tu empleo actual.'},
    ],
  },


  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 20 — Psicología del Dinero: Por qué sabemos qué hacer y no lo hacemos
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:20, icon:'💭', title:'Psicología del Dinero',
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
      {type:'final', xp:30, msg:'¡Sesgos desarmados! La aversión a la pérdida, el anclaje y el market timing: los reconoces y sabes que la automatización los neutraliza. El tiempo en el mercado siempre supera al timing del mercado.'},
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
          {t:'text', h:'La base del ahorro: tipos del IRPF 2025',
            p:'En España, las ganancias de capital (vender con beneficio) y los dividendos tributan en la <strong>base del ahorro</strong>, separada de los ingresos del trabajo. Los tipos son: <strong>19%</strong> hasta 6.000€ de ganancia; <strong>21%</strong> de 6.000€ a 50.000€; <strong>23%</strong> de 50.000€ a 200.000€; <strong>27%</strong> de 200.000€ a 300.000€; <strong>30%</strong> por encima de 300.000€. Estos tipos son significativamente más bajos que los del trabajo (hasta 47%). Esto es una ventaja legal que los inversores deben aprovechar.'},
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
            p:'Las aportaciones a planes de pensiones <strong>reducen tu base imponible del IRPF de trabajo</strong> hasta 1.500€/año. Si tu tipo marginal es el 37%, cada 1.000€ que metes en el plan te ahorras 370€ en la declaración de la renta. El problema: al retirar el capital en jubilación tributa como renta del trabajo (hasta 47%). Por eso el plan de pensiones solo tiene sentido si tu tipo en activo es muy superior al que tendrás en jubilación.'},
          {t:'text', h:'Cuenta de valores: flexibilidad y fiscalidad del ahorro',
            p:'Una cuenta de valores estándar (en cualquier broker) tributa en la base del ahorro (19-30%) cuando vendes con beneficio. Sin límites de aportación, sin penalización por rescatar antes. La ventaja vs plan de pensiones: pagas siempre en la base del ahorro, nunca como renta del trabajo. <strong>Para la mayoría de inversores jóvenes con tipo marginal bajo, la cuenta de valores es más eficiente que el plan de pensiones.</strong>'},
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
      {type:'final', xp:35, msg:'¡Optimización fiscal del inversor desbloqueada! Base del ahorro, compensación de pérdidas, ETFs de acumulación y la secuencia óptima plan de pensiones/cuenta de valores: pagarás solo lo que la ley exige.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 22 — Inmobiliario: Comprar o Alquilar, y el REITs Alternativo
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:22, icon:'🏡', title:'Inmobiliario Inteligente',
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
      {type:'final', xp:30, msg:'¡Análisis inmobiliario dominado! La regla precio/alquiler, el coste real de comprar y los REITs como alternativa líquida: nunca más tomarás la decisión más grande de tu vida sin los números correctos.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 23 — Cripto: Tecnología, Riesgo y Cuánto Debe Representar
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:23, icon:'🛸', title:'Cripto Sin Hype',
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
      {type:'final', xp:30, msg:'¡Inversor cripto con criterio real! Entiendes el problema técnico que resuelve Bitcoin, su diferencia con Ethereum y por qué el tamaño de posición (máx 5-10%) es más decisivo que la elección del activo.'},
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
      {type:'final', xp:40, msg:'¡Independencia financiera calculada! Tu número FIRE, las variantes Lean/Barista/Fat y el impacto exponencial de la tasa de ahorro: la libertad financiera tiene matemáticas claras y tú ya las dominas.'},
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
      {type:'final', xp:30, msg:'¡Deuda domada! Conoces la diferencia entre deuda buena y mala, el método bola de nieve vs. avalancha, y cómo usar el apalancamiento con cabeza. La deuda bien gestionada es una herramienta, no una trampa.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 26 — ETFs e Indexación: La Estrategia que Bate al 90% de Gestores
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:26, icon:'🌟', title:'ETFs e Indexación',
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
      {type:'final', xp:35, msg:'¡Estrategia indexada dominada! Entiendes por qué el 90% de fondos activos pierden, cómo funcionan los ETFs, y cómo construir una cartera diversificada global con costes mínimos. Bogle estaría orgulloso.'},
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
      {type:'final', xp:30, msg:'¡Negociación desbloqueada! Conoces el anclaje, BATNA, el poder del silencio y cómo preparar una propuesta irrefutable. Un 10% más de sueldo vale más a largo plazo que cualquier ahorro puntual.'},
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
      {type:'final', xp:30, msg:'¡Inflación comprendida! Sabes cómo el 3% anual destruye el poder adquisitivo, qué activos protegen (renta variable, TIPS, inmuebles, oro) y por qué el efectivo es el único activo que siempre pierde contra la inflación.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 29 — El Fondo de Emergencia: El Cimiento de Todo
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:29, icon:'💵', title:'El Fondo de Emergencia',
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
      {type:'final', xp:20, msg:'¡Cimiento financiero construido! Tienes claro por qué el fondo de emergencia va primero, cuánto necesitas (3-6 meses de gastos), dónde guardarlo y cómo construirlo en 90 días. Sin este cimiento, todo lo demás es castillo sobre arena.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 30 — Análisis Técnico vs Fundamental
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:30, icon:'📰', title:'Análisis Técnico vs Fundamental',
    desc:'Dos formas de ver el mercado. Una de ellas funciona mejor.',
    xp:25, tag:'AVANZADO', tagC:'blue', users:'18.200',
    steps:[
      {type:'content', tag:'📊 Módulo 31', title:'¿Qué mueve el precio de una acción?',
        intro:'Todo inversor enfrenta la misma pregunta: ¿cuándo comprar? Hay dos grandes escuelas de respuesta. El análisis fundamental dice: estudia la empresa, sus ingresos, su deuda, su ventaja competitiva. El análisis técnico dice: estudia el gráfico, los patrones, el volumen. ¿Quién tiene razón?',
        bullets:['📐 Análisis fundamental: valora la empresa real (ingresos, EBITDA, moat)','📈 Análisis técnico: estudia patrones de precio y volumen','🧪 Ambos buscan predecir el futuro con herramientas del pasado','🎯 El consenso académico favorece claramente al fundamental para inversión a largo plazo'],
        fact:'Warren Buffett, el mejor inversor de la historia, jamás ha usado un gráfico de velas. Solo analiza los fundamentales de empresas.'},
      {type:'content', tag:'📊 Módulo 31', title:'Análisis Fundamental: El Motor Real',
        intro:'El análisis fundamental parte de una premisa simple: el precio de una acción debería reflejar el valor real de la empresa. Si el precio está por debajo del valor real → oportunidad de compra. Si está por encima → posible burbuja.',
        bullets:['💰 PER (Price-to-Earnings): cuántas veces pagas los beneficios. PER 15 = normal, PER 40 = caro','📦 P/B (Price-to-Book): pagas menos de lo que vale el activo neto','💸 Free Cash Flow: el dinero real que genera (más honesto que el beneficio contable)','🏰 Moat: la ventaja competitiva que protege los beneficios futuros (marca, red, coste de cambio)','📉 Deuda/EBITDA: cuántos años de beneficios necesita para pagar su deuda'],
        fact:'Peter Lynch analizó más de 1.000 empresas en persona antes de invertir. Su fondo Magellan batió al mercado 13 años consecutivos.'},
      {type:'content', tag:'📊 Módulo 31', title:'Análisis Técnico: Lo Que los Gráficos Dicen (y No)',
        intro:'El análisis técnico asume que "el precio lo descuenta todo" y que los patrones del pasado se repiten. Usa velas japonesas, medias móviles, RSI, MACD y soportes/resistencias para decidir cuándo entrar y salir.',
        bullets:['🕯️ Velas japonesas: cada vela = apertura, máximo, mínimo y cierre de un período','📉 Media móvil 200: separador entre tendencia alcista y bajista','📊 RSI > 70 = sobrecomprado, RSI < 30 = sobrevendido','🎯 Soportes/Resistencias: niveles donde el precio ha rebotado históricamente','⚠️ Problema: si todos ven el mismo patrón, el mercado lo arbitraje y deja de funcionar'],
        fact:'Un estudio del MIT analizó 50 años de datos del S&P 500: los patrones técnicos más usados no generan alpha estadísticamente significativo.'},
      {type:'quiz', tag:'📊 Quiz', title:'¿Qué métrica fundamental mide si una acción está cara?',
        opts:[{t:'El volumen de trading diario', ok:false},{t:'El PER (Price-to-Earnings Ratio)', ok:true},{t:'La media móvil de 200 días', ok:false},{t:'El número de analistas que la siguen', ok:false}],
        ok:'El PER compara el precio con los beneficios. Un PER de 15 significa que pagas 15 años de beneficios actuales. Por encima de 25-30 empieza a ser caro en términos históricos.',
        bad:'El PER compara el precio con los beneficios. Un PER de 15 significa que pagas 15 años de beneficios actuales. Por encima de 25-30 empieza a ser caro en términos históricos.'},
      {type:'quiz', tag:'📊 Quiz', title:'¿Cuál es la crítica principal al análisis técnico?',
        opts:[{t:'Requiere demasiado tiempo', ok:false},{t:'Los patrones reconocidos se arbitrajan y pierden efectividad', ok:true},{t:'Es demasiado complicado para el inversor medio', ok:false},{t:'Solo funciona en mercados alcistas', ok:false}],
        ok:'Si miles de traders ven el mismo "patrón de cabeza y hombros", actuarán antes de que se complete y destruirán el patrón. La eficiencia del mercado erosiona las señales técnicas.',
        bad:'Si miles de traders ven el mismo "patrón de cabeza y hombros", actuarán antes de que se complete y destruirán el patrón. La eficiencia del mercado erosiona las señales técnicas.'},
      {type:'final', xp:25, msg:'¡Dos escuelas dominadas! Entiendes el análisis fundamental (PER, FCF, moat) vs. técnico (velas, RSI, soportes). El académico y el inversor a largo plazo tienen claro cuál funciona mejor: los fundamentales ganan.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 31 — El Poder del Apalancamiento
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:31, icon:'💣', title:'Apalancamiento: Arma de Doble Filo',
    desc:'El apalancamiento puede multiplicar tus ganancias. O destruirte.',
    xp:30, tag:'RIESGO', tagC:'red', users:'12.800',
    steps:[
      {type:'content', tag:'⚖️ Módulo 32', title:'¿Qué es el Apalancamiento?',
        intro:'El apalancamiento es invertir con dinero prestado para amplificar el resultado. Si inviertes €10.000 propios y pides €90.000 prestados, controlas €100.000. Una subida del 10% te da €10.000 (100% sobre tu capital). Una bajada del 10% te deja sin nada.',
        bullets:['🔺 Apalancamiento 10:1 = controlas 10€ por cada 1€ propio','📈 Ganancias amplificadas proporcionalmente al apalancamiento','📉 Pérdidas igualmente amplificadas — asimétricas con la ruina','⚠️ Margin call: cuando las pérdidas superan tu capital, te cierran la posición','🏦 Hipoteca = apalancamiento controlado en inmobiliario (3:1 a 5:1 típico)'],
        fact:'LTCM, el fondo con los dos premios Nobel de Economía, quebró en 1998 con apalancamiento de 25:1. Perdió €4.600 millones en semanas.'},
      {type:'content', tag:'⚖️ Módulo 32', title:'Usos Razonables del Apalancamiento',
        intro:'No todo apalancamiento es especulación suicida. La hipoteca es apalancamiento. Un préstamo para montar un negocio rentable es apalancamiento. La clave está en el diferencial entre el coste del dinero y la rentabilidad del activo.',
        bullets:['🏠 Hipoteca al 3%: si el inmueble sube un 5% anual, el apalancamiento trabaja a tu favor','🏢 Préstamo empresarial al 6%: si el negocio da un 20%, el apalancamiento es inteligente','📊 ETFs apalancados 2x o 3x: para especulación a corto plazo, no para carteras a largo','💀 CFDs, opciones, futuros: apalancamientos de 50:1 a 100:1 — territorio de ruina para el 90%','✅ Regla: apalancamiento sensato = solo si el rendimiento esperado supera el coste del capital por margen amplio'],
        fact:'El 74% de los inversores minoristas en CFDs pierde dinero según la CNMV española. La principal causa: apalancamiento excesivo.'},
      {type:'quiz', tag:'⚖️ Quiz', title:'Tienes €5.000 e inviertes con apalancamiento 5:1 (controlas €25.000). El activo cae un 20%. ¿Cuánto pierdes?',
        opts:[{t:'€1.000 (20% de tus €5.000)', ok:false},{t:'€5.000 (toda tu inversión inicial)', ok:true},{t:'€25.000 (más de lo invertido)', ok:false},{t:'€2.500 (50% de tu capital)', ok:false}],
        ok:'Con 5:1 controlas €25.000. Una caída del 20% = €5.000 de pérdida = EXACTAMENTE tu capital inicial. Quedas a cero. Con 5:1 solo necesitas un movimiento del 20% en contra para perderlo todo.',
        bad:'Con 5:1 controlas €25.000. Una caída del 20% = €5.000 de pérdida = EXACTAMENTE tu capital inicial. Quedas a cero. Con 5:1 solo necesitas un movimiento del 20% en contra para perderlo todo.'},
      {type:'final', xp:30, msg:'¡Riesgo de apalancamiento comprendido! Sabes cómo amplifica ganancias Y pérdidas simétricamente, cuándo tiene sentido (hipoteca, negocio rentable) y cuándo es trampa (CFDs, futuros). El 74% de minoristas pierde — tú ya sabes por qué.'},
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
      {type:'content', tag:'🕐 Módulo 33', title:'La Mecánica del Mercado',
        intro:'Cuando pulsas "comprar" en tu broker, no estás comprando directamente a otro inversor. Hay toda una infraestructura invisible: market makers, libros de órdenes, cámaras de compensación y reguladores. Entenderla te hace mejor inversor.',
        bullets:['📋 Libro de órdenes: lista de compradores (bid) y vendedores (ask) con sus precios','💹 Spread: diferencia entre bid y ask — el coste invisible de cada operación','🤝 Market maker: instituciones que garantizan liquidez comprando y vendiendo continuamente','⏰ Sesiones: NYSE (15:30-22:00 hora española), Bolsa Madrid (9:00-17:35)','📊 Pre-market y after-hours: volumen bajo, spreads amplios, precios menos fiables'],
        fact:'El spread del IBEX 35 en hora punta es 0,01%. En pre-market puede ser 10 veces mayor. Operar fuera de horario te sale caro.'},
      {type:'quiz', tag:'🕐 Quiz', title:'¿Qué es el "spread" en bolsa?',
        opts:[{t:'El impuesto sobre ganancias bursátiles', ok:false},{t:'La diferencia entre el precio de compra y el de venta', ok:true},{t:'El porcentaje de comisión del broker', ok:false},{t:'La diferencia entre el precio mínimo y máximo del día', ok:false}],
        ok:'El spread es el coste oculto de cada operación. Si el bid es 99,90€ y el ask es 100,10€, el spread es 0,20€. Cada vez que compras y vendes, pagas ese diferencial aunque el precio no se mueva.',
        bad:'El spread es el coste oculto de cada operación. Si el bid es 99,90€ y el ask es 100,10€, el spread es 0,20€. Cada vez que compras y vendes, pagas ese diferencial aunque el precio no se mueva.'},
      {type:'final', xp:20, msg:'¡Microestructura dominada! Conoces el libro de órdenes, market makers, spreads y por qué operar fuera de horario sale caro. Entiendes la maquinaria invisible que hay detrás de cada "comprar" que pulsas.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 33 — Comportamiento del Inversor en Crisis
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:33, icon:'🌊', title:'Cómo No Perder la Cabeza en un Crash',
    desc:'El manual de supervivencia psicológica para cuando el mercado se hunde.',
    xp:30, tag:'PSICOLOGÍA', tagC:'purple', users:'31.500',
    steps:[
      {type:'content', tag:'🧠 Módulo 34', title:'Por Qué el Crash del 2008 Arruinó a Gente con Razón',
        intro:'El S&P 500 cayó un 56% entre 2007 y 2009. Muchos inversores que tenían buenas empresas, bien diversificadas, vendieron con pérdidas en el peor momento. No porque su tesis fuera incorrecta, sino porque el pánico venció a la razón. Luego el mercado se recuperó y marcó nuevos máximos.',
        bullets:['📉 Crash = caída > 20% desde el máximo reciente','😱 El pánico es contagioso: las caídas se aceleran cuando todos venden a la vez','🧠 Corteza prefrontal vs amígdala: el miedo desconecta la razón','📺 Los medios amplifican el pánico — cada crash "es el peor de la historia"','📊 Históricamente: el S&P 500 se ha recuperado de TODOS los crashes, sin excepción'],
        fact:'Los inversores que vendieron en marzo de 2009 (el mínimo del crash de 2008) y no volvieron a entrar, perdieron la mayor recuperación de la historia: +400% en los siguientes 11 años.'},
      {type:'content', tag:'🧠 Módulo 34', title:'El Plan de Acción Para el Próximo Crash',
        intro:'El próximo crash llegará. No sabes cuándo. Lo que sí puedes hacer es prepararte emocionalmente y técnicamente ANTES de que ocurra, cuando no hay presión.',
        bullets:['📝 Escribe tu política de inversión: qué harás si cae 20%, 40%, 60%','💰 Ten el fondo de emergencia completo ANTES de invertir — sin él, te verás obligado a vender','📅 DCA automático: las aportaciones periódicas compran más barato en los crashes','🔕 Desconéctate de las noticias durante las caídas — cada headline está diseñado para el miedo','📊 Mira el gráfico histórico a 20 años: cada "crisis" parece un bache diminuto'],
        fact:'Un estudio de Fidelity analizó qué cuentas habían tenido mejor rendimiento en 10 años. El resultado: las de clientes que habían olvidado que tenían la cuenta.'},
      {type:'quiz', tag:'🧠 Quiz', title:'Un inversor tiene €50.000 en un ETF del S&P 500. El mercado cae 40%. ¿Cuál es la respuesta correcta?',
        opts:[{t:'Vender todo para evitar pérdidas mayores', ok:false},{t:'No hacer nada si el horizonte es +10 años y no necesitas ese dinero', ok:true},{t:'Pedir un préstamo para comprar más', ok:false},{t:'Cambiar a bonos del gobierno', ok:false}],
        ok:'Si el horizonte es largo plazo (>10 años) y tienes fondo de emergencia, la respuesta histórica correcta siempre ha sido mantener. Vender consolida las pérdidas y te hace perder la recuperación.',
        bad:'Si el horizonte es largo plazo (>10 años) y tienes fondo de emergencia, la respuesta histórica correcta siempre ha sido mantener. Vender consolida las pérdidas y te hace perder la recuperación.'},
      {type:'quiz', tag:'🧠 Quiz', title:'¿Qué es el "Dollar Cost Averaging" (DCA)?',
        opts:[{t:'Convertir euros a dólares para invertir en EE.UU.', ok:false},{t:'Invertir una cantidad fija periódicamente independientemente del precio', ok:true},{t:'Comprar solo cuando el mercado está en mínimos', ok:false},{t:'Diversificar entre dólares, euros y yenes', ok:false}],
        ok:'DCA = invertir €X cada mes pase lo que pase. En meses malos compras más unidades al mismo precio. En meses buenos, menos. El promedio del coste de adquisición mejora sistemáticamente sin necesidad de predecir el mercado.',
        bad:'DCA = invertir €X cada mes pase lo que pase. En meses malos compras más unidades al mismo precio. En meses buenos, menos. El promedio del coste de adquisición mejora sistemáticamente sin necesidad de predecir el mercado.'},
      {type:'final', xp:30, msg:'¡Cabeza fría en el crash! Tienes el plan: horizonte largo + DCA en caídas + no mirar la cartera diariamente. Los que vendieron en marzo de 2009 perdieron el +400% siguiente. Tú no cometerás ese error.'},
    ],
  },
];

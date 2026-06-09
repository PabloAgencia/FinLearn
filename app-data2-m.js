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
      { type:'content', tag:'🤖 M109', title:'La Fuerza de Voluntad es Finita',
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
  { id:109, icon:'🔃', title:'Negociación Salarial: Cobra lo que Vales',
    desc:'El guión exacto para pedir un aumento o negociar en una oferta de trabajo',
    xp:24, tag:'PRÁCTICA', tagC:'blue', users:'28.900',
    steps:[
      { type:'content', tag:'💼 M110', title:'El Mayor Error Financiero de tu Carrera',
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
  { id:110, icon:'🔀', title:'Finanzas para Freelancers: el Sistema de las 4 Cuentas',
    desc:'Cómo gestionar ingresos irregulares, impuestos y ahorro cuando eres tu propio jefe',
    xp:26, tag:'PRÁCTICA', tagC:'orange', users:'21.400',
    steps:[
      { type:'content', tag:'🎯 M111', title:'El Problema del Freelance: Ingresos del Todo o Nada',
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
  { id:111, icon:'♻️', title:'Criptomonedas sin Hype: lo que Nadie te Cuenta',
    desc:'Bitcoin, altcoins, DeFi y NFTs: qué es real, qué es especulación y cómo no perder el dinero',
    xp:28, tag:'AVANZADO', tagC:'purple', users:'34.700',
    steps:[
      { type:'content', tag:'₿ M112', title:'Separar la Señal del Ruido',
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
      { type:'content', tag:'☕ M113', title:'€3 al Día vs €50.000 en 20 Años',
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
  { id:113, icon:'🌎', title:'Inversión ESG: ¿Rentabilidad o Greenwashing?',
    desc:'Qué es la inversión sostenible, cómo identificar el greenwashing y si realmente rinde menos',
    xp:22, tag:'INVERSIÓN', tagC:'green', users:'19.300',
    steps:[
      { type:'content', tag:'🌱 M114', title:'Verde, Pero ¿de Verdad?',
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
      { type:'content', tag:'✉️ M115', title:'Cuando el Dinero Abstracto se Vuelve Real',
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
  { id:115, icon:'🤔', title:'Planificar la Jubilación: Más Allá de la Pensión del Estado',
    desc:'Cuánto necesitas, cuándo empezar y qué vehículos usar para complementar la pensión pública',
    xp:26, tag:'AVANZADO', tagC:'red', users:'22.800',
    steps:[
      { type:'content', tag:'🏖️ M116', title:'La Brecha de Pensión que Nadie Calcula',
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
  { id:116, icon:'🧫', title:'La Regla del 72: Dobla tu Dinero sin Calculadora',
    desc:'El truco matemático de 500 años que te dice en segundos cuándo se dobla cualquier inversión.',
    xp:18, tag:'FUNDAMENTOS', tagC:'green', users:'18.400',
    steps:[
      { type:'content', tag:'🔢 M117', title:'La Regla del 72: Dobla tu Dinero sin Calculadora',
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
  { id:117, icon:'🗿', title:'Cómo Leer el Precio de un Fondo: NAV, TER y Comisiones Reales',
    desc:'NAV, TER y KIID: los tres números que determinan si un fondo es barato o te está robando en silencio.',
    xp:22, tag:'INVERSIÓN', tagC:'blue', users:'14.200',
    steps:[
      { type:'content', tag:'📋 M118', title:'Cómo Leer el Precio de un Fondo: NAV, TER y Comisiones Reales',
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
  { id:118, icon:'🏷️', title:'El Efecto Dotación: Por Qué no Vendemos lo que Deberíamos',
    desc:'Por qué valoramos el doble lo que ya tenemos y cómo ese sesgo destruye tus decisiones financieras.',
    xp:20, tag:'PSICOLOGÍA', tagC:'purple', users:'16.800',
    steps:[
      { type:'content', tag:'🧠 M119', title:'El Efecto Dotación: Por Qué no Vendemos lo que Deberíamos',
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
  { id:119, icon:'🗼', title:'Modelo 720: El Formulario que Todo Inversor Internacional Debe Conocer',
    desc:'Si tienes más de €50.000 en activos fuera de España, Hacienda ya lo sabe. Lo que nadie te explica.',
    xp:24, tag:'FISCALIDAD', tagC:'yellow', users:'9.600',
    steps:[
      { type:'content', tag:'📋 M120', title:'Modelo 720: El Formulario que Todo Inversor Internacional Debe Conocer',
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
  { id:120, icon:'🤑', title:'Refinanciación de Deuda: Cuándo y Cómo Hacerlo Bien',
    desc:'Cuándo tiene sentido sustituir una deuda cara por una barata y el cálculo exacto que determina si compensa.',
    xp:22, tag:'DEUDA', tagC:'orange', users:'12.400',
    steps:[
      { type:'content', tag:'🔄 M121', title:'Refinanciación de Deuda: Cuándo y Cómo Hacerlo Bien',
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
  { id:121, icon:'💱', title:'Dollar Cost Averaging vs. Lump Sum: ¿Cuál Gana?',
    desc:'¿Todo de golpe o poco a poco? La ciencia tiene una respuesta clara, pero con un matiz psicológico crucial.',
    xp:24, tag:'AVANZADO', tagC:'red', users:'19.200',
    steps:[
      { type:'content', tag:'📊 M122', title:'Dollar Cost Averaging vs. Lump Sum: ¿Cuál Gana?',
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
  { id:122, icon:'📸', title:'El Balance Personal: Tu Foto Financiera en 10 Minutos',
    desc:'Activos menos pasivos igual a libertad. La métrica más honesta de tu salud financiera real.',
    xp:18, tag:'FUNDAMENTOS', tagC:'green', users:'21.600',
    steps:[
      { type:'content', tag:'📸 M123', title:'El Balance Personal: Tu Foto Financiera en 10 Minutos',
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
  { id:123, icon:'💎', title:'Bonos: El Activo que Todo Inversor Ignora (Y No Debería)',
    desc:'El activo aburrido que estabiliza carteras. Por qué los bonos no son optativos, son necesarios.',
    xp:22, tag:'INVERSIÓN', tagC:'blue', users:'11.800',
    steps:[
      { type:'content', tag:'💎 M124', title:'Bonos: El Activo que Todo Inversor Ignora (Y No Debería)',
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
  { id:124, icon:'💲', title:'Contabilidad Mental: El Truco que Hace que Gastes de Más',
    desc:'Por qué gastas más fácil el dinero inesperado y cómo el origen del dinero distorsiona tus decisiones.',
    xp:20, tag:'PSICOLOGÍA', tagC:'purple', users:'17.400',
    steps:[
      { type:'content', tag:'🧠 M125', title:'Contabilidad Mental: El Truco que Hace que Gastes de Más',
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
  { id:125, icon:'🟠', title:'Factor Investing: Smart Beta y los Factores que Baten al Mercado',
    desc:'Los cinco factores Nobel que explican el 95% de los retornos. Smart Beta sin el marketing vacío.',
    xp:28, tag:'AVANZADO', tagC:'red', users:'8.200',
    steps:[
      { type:'content', tag:'🔬 M126', title:'Factor Investing: Smart Beta y los Factores que Baten al Mercado',
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
  { id:126, icon:'🔵', title:'Plusvalías del Muerto: Planificación Patrimonial Básica',
    desc:'La ventaja fiscal de la herencia que puede ahorrarle a tu familia decenas de miles de euros en IRPF.',
    xp:26, tag:'FISCALIDAD', tagC:'yellow', users:'7.800',
    steps:[
      { type:'content', tag:'🏛️ M127', title:'Plusvalías del Muerto: Planificación Patrimonial Básica',
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
  { id:127, icon:'🔶', title:'Rebalanceo de Cartera: El Mantenimiento que Nadie Hace',
    desc:'El ajuste anual que la mayoría ignora y que mejora sistemáticamente los retornos ajustados por riesgo.',
    xp:22, tag:'INVERSIÓN', tagC:'blue', users:'13.400',
    steps:[
      { type:'content', tag:'⚖️ M128', title:'Rebalanceo de Cartera: El Mantenimiento que Nadie Hace',
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
  { id:128, icon:'🔭', title:'Cómo Invertir en Empresas Pequeñas (Small Caps) con Bajo Riesgo',
    desc:'Las small caps tienen la prima histórica más alta. Cómo capturarla sin el riesgo de elegirlas a mano.',
    xp:26, tag:'AVANZADO', tagC:'red', users:'10.200',
    steps:[
      { type:'content', tag:'🔭 M129', title:'Cómo Invertir en Empresas Pequeñas (Small Caps) con Bajo Riesgo',
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
  { id:129, icon:'🔷', title:'Automatiza tus Finanzas: El Sistema de los Ricos Sin Esfuerzo',
    desc:'Configura una vez y funciona para siempre. El sistema que elimina la fuerza de voluntad de la ecuación.',
    xp:18, tag:'FUNDAMENTOS', tagC:'green', users:'24.800',
    steps:[
      { type:'content', tag:'⚙️ M130', title:'Automatiza tus Finanzas: El Sistema de los Ricos Sin Esfuerzo',
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
  { id:130, icon:'🚫', title:'El Poder del No: Cómo Decir No al Gasto Que No te Acerca a tus Metas',
    desc:'Cada "no" a un gasto innecesario es un "sí" a tu libertad financiera. Sin culpa, con criterio.',
    xp:20, tag:'PSICOLOGÍA', tagC:'purple', users:'22.000',
    steps:[
      { type:'content', tag:'🧠 M131', title:'El Poder del No: Cómo Decir No al Gasto Que No te Acerca a tus Metas',
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
  { id:131, icon:'🔸', title:'La Regla 50/30/20 Avanzada', desc:'El sistema de presupuesto más usado del mundo, adaptado a la realidad española.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'18.400',
    steps:[
      { type:'content', tag:'📖 M132', title:'Los tres cajones de tu sueldo',
        content:'<h3>El marco del 50/30/20</h3><p>Popularizado por la senadora y economista Elizabeth Warren en <em>All Your Worth</em>, este sistema divide tu sueldo neto en tres grandes bloques:</p><ul><li><strong>50% Necesidades</strong> — alquiler, comida, transporte, suministros, seguros obligatorios</li><li><strong>30% Deseos</strong> — ocio, restaurantes, suscripciones, ropa no esencial</li><li><strong>20% Ahorro e inversión</strong> — incluye deuda extra, fondo de emergencia y aportaciones</li></ul><p>La potencia del sistema no está en los porcentajes exactos, sino en <em>que cada euro tenga un destino</em>.</p>' },
      { type:'content', tag:'🇪🇸 M132', title:'Ajustándolo a España',
        content:'<h3>La trampa del alquiler</h3><p>En ciudades como Madrid o Barcelona, el alquiler solo ya consume el 40-50% del sueldo medio. El 50/30/20 tradicional se rompe. ¿Qué hacer?</p><p><strong>Opción 1:</strong> Convertir a 60/20/20 temporalmente, con plan claro para volver al 50/30/20 en 2-3 años (cambio de piso, subida salarial, compartir vivienda).</p><p><strong>Opción 2:</strong> Si el 50% no basta para necesidades, el problema no es tu presupuesto — es tu ingreso o tu coste de vida. Revisa una de las dos.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Sueldo neto €2.000. Alquiler €900, suministros €100, comida €350. ¿Qué % de necesidades tienes?', opts:['50%','60%','67,5%','75%'], ans:2, exp:'€1.350 / €2.000 = 67,5%. Estás muy por encima del 50% recomendado. El alquiler es la palanca principal.' },
      { type:'final', xp:100, msg:'Ya manejas el framework de presupuesto más extendido. El objetivo no es la perfección — es la consciencia.' },
    ]},
  { id:132, icon:'💹', title:'Tasa de Ahorro: La Métrica que Importa', desc:'Más importante que tu sueldo. La tasa de ahorro decide cuándo serás libre.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'15.200',
    steps:[
      { type:'content', tag:'📖 M133', title:'El verdadero termómetro financiero',
        content:'<h3>No es cuánto ganas, es cuánto guardas</h3><p>La <strong>tasa de ahorro</strong> es el porcentaje de tu ingreso neto que apartas para ahorrar o invertir. Es la métrica más correlacionada con la libertad financiera futura, por encima del salario bruto.</p><p>Cálculo simple:</p><p><code>(Ingreso neto − gastos) / Ingreso neto × 100</code></p><p>Según estudios del movimiento FIRE:</p><ul><li><strong>10%</strong> — tasa media española. Jubilación a los 67 dependiendo de la pensión pública.</li><li><strong>20%</strong> — tasa saludable. Libertad financiera posible a los 55-60.</li><li><strong>50%+</strong> — tasa FIRE. Libertad posible en 15-20 años desde el primer euro.</li></ul>' },
      { type:'content', tag:'⏱️ M133', title:'El cálculo que cambia vidas',
        content:'<h3>Años hasta la libertad</h3><p>Con una rentabilidad real del 5% anual tras inflación, los años que tardas en alcanzar independencia financiera según tu tasa de ahorro son aproximadamente:</p><ul><li>Ahorras <strong>10%</strong> → 51 años</li><li>Ahorras <strong>20%</strong> → 37 años</li><li>Ahorras <strong>30%</strong> → 28 años</li><li>Ahorras <strong>50%</strong> → 17 años</li><li>Ahorras <strong>70%</strong> → 8,5 años</li></ul><p>Doblar tu tasa de ahorro no recorta el tiempo a la mitad — lo recorta a una fracción. Es la palanca más potente de las finanzas personales.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué tiene mayor impacto en tu independencia financiera?', opts:['Ganar 20% más y gastarlo todo','Mantener ingresos y ahorrar 20% más','Invertir en acciones de moda','Heredar €10.000'], ans:1, exp:'Ahorrar más mueve la aguja exponencialmente. Ganar más sin ahorrar no cambia nada estructuralmente.' },
      { type:'final', xp:100, msg:'Tu tasa de ahorro es el dato más importante de tus finanzas. Cuídala como a tu salud.' },
    ]},
  { id:133, icon:'🔹', title:'Flujo de Caja Personal', desc:'Qué entra, qué sale. Sin esto, todo lo demás es humo.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'12.800',
    steps:[
      { type:'content', tag:'📖 M134', title:'El cash flow doméstico',
        content:'<h3>Tu empresa se llama Tú S.A.</h3><p>Las empresas mejor gestionadas vigilan su flujo de caja diariamente. Tu economía personal funciona igual: el flujo de caja es la diferencia entre lo que entra y lo que sale cada mes.</p><p><strong>Flujo positivo:</strong> entra más de lo que sale. Construyes patrimonio.</p><p><strong>Flujo neutro:</strong> vas llegando a fin de mes sin margen. Estancado.</p><p><strong>Flujo negativo:</strong> sale más de lo que entra. Te endeudas o consumes ahorros.</p><p>Un error frecuente: confundir <em>patrimonio</em> (stock) con <em>flujo</em> (movimiento). Puedes tener €50.000 ahorrados y un flujo mensual negativo — estás quemando tu reserva.</p>' },
      { type:'content', tag:'📒 M134', title:'Contabilidad básica, sin hojas de cálculo',
        content:'<h3>Tres herramientas gratuitas</h3><ol><li><strong>App del banco</strong> — casi todas categorizan gastos automáticamente. Revísalas el día 1 de cada mes.</li><li><strong>Tarjeta única para gastos variables</strong> — una tarjeta específica para "deseos". Ves el total al instante.</li><li><strong>Transferencia automática al cobrar</strong> — el día del sueldo, que se vaya el ahorro. Lo que queda es lo gastable.</li></ol><p>El método más antiguo y efectivo: <em>pay yourself first</em>. Págate tú primero antes que a nadie. Si lo haces al final del mes, no queda nada — siempre.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes €30.000 ahorrados, gastas €2.200/mes y cobras €2.000/mes. ¿Qué describe mejor tu situación?', opts:['Rico porque tienes €30.000','Patrimonio alto pero flujo negativo — consumes ahorros','Perfecto, vas sobrado','Flujo neutro, todo estable'], ans:1, exp:'Tener patrimonio pero gastar más de lo que ingresas es consumir ahorros. El flujo de caja es la métrica que revela la realidad día a día.' },
      { type:'final', xp:100, msg:'Flujo de caja bajo control = tranquilidad mental. Revísalo cada 30 días sin excepción.' },
    ]},
  { id:134, icon:'📌', title:'Patrimonio Neto Real', desc:'La foto de tu riqueza de verdad: activos menos deudas. Sin autoengaños.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'14.600',
    steps:[
      { type:'content', tag:'📖 M135', title:'El cálculo que no puedes fingir',
        content:'<h3>Patrimonio neto = Activos − Pasivos</h3><p>Tu patrimonio neto es la única métrica que no se puede manipular. Mide lo que realmente tienes si liquidaras todo hoy.</p><p><strong>Activos</strong> (lo que tienes):</p><ul><li>Cuenta corriente y ahorro</li><li>Inversiones (acciones, ETFs, fondos, plan de pensiones)</li><li>Vivienda al valor de mercado actual</li><li>Coche al valor de mercado (suele depreciar 20% al año)</li><li>Efectivo</li></ul><p><strong>Pasivos</strong> (lo que debes):</p><ul><li>Hipoteca pendiente</li><li>Préstamos personales</li><li>Tarjetas de crédito no pagadas</li><li>Deudas familiares, hacienda, etc.</li></ul>' },
      { type:'content', tag:'📈 M135', title:'La trampa del "vale tanto"',
        content:'<h3>Patrimonio real vs patrimonio declarado</h3><p>Mucha gente dice "mi casa vale €300.000" pero deben €220.000 de hipoteca. Patrimonio real en vivienda: <strong>€80.000</strong>, no €300.000.</p><p>Los expertos como Thomas J. Stanley (<em>The Millionaire Next Door</em>) descubrieron que la mayoría de millonarios tienen <strong>patrimonio neto alto pero perfil modesto</strong> — porque distinguen entre parecer rico y ser rico. Un coche caro es un pasivo que reduce tu patrimonio neto cada año.</p><p>Calcula tu patrimonio cada 3 meses. Es la gráfica que debe subir.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes €20.000 ahorrados, €80.000 invertidos, casa de €250.000 con €180.000 de hipoteca, coche de €15.000 y €8.000 de préstamo personal. ¿Cuál es tu patrimonio neto?', opts:['€385.000','€185.000','€177.000','€105.000'], ans:2, exp:'(20k + 80k + 250k + 15k) − (180k + 8k) = €365k − €188k = €177k. La casa no es tuya entera; el coche es un activo que decrece.' },
      { type:'final', xp:100, msg:'Calcula tu patrimonio neto hoy. Es tu punto de partida honesto.' },
    ]},
  { id:135, icon:'🧱', title:'Gastos Fijos vs Variables', desc:'La clasificación que revela dónde hay margen real.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'11.300',
    steps:[
      { type:'content', tag:'📖 M136', title:'Dos naturalezas muy distintas',
        content:'<h3>Los gastos no son iguales</h3><p>Clasificar tus gastos en <strong>fijos</strong> y <strong>variables</strong> es el primer paso para optimizarlos.</p><p><strong>Gastos fijos</strong> — se repiten cada mes con el mismo importe o uno muy similar:</p><ul><li>Alquiler o hipoteca</li><li>Suministros base (luz fija, internet, móvil)</li><li>Seguros</li><li>Gimnasio, suscripciones digitales</li><li>Cuotas de préstamos</li></ul><p><strong>Gastos variables</strong> — cambian mes a mes:</p><ul><li>Comida (supermercado + restaurantes)</li><li>Ocio y entretenimiento</li><li>Ropa, regalos, caprichos</li><li>Gasolina, transporte puntual</li></ul>' },
      { type:'content', tag:'⚙️ M136', title:'Dónde está el margen real',
        content:'<h3>La regla de los expertos</h3><p>Un principio clave: <strong>los gastos fijos son más fáciles de recortar, aunque cueste más decidir</strong>. Renegociar el alquiler una vez o cambiar de compañía móvil ahorra dinero cada mes, sin esfuerzo continuo.</p><p>Los variables son más visibles pero más difíciles de recortar de forma sostenida — implican disciplina diaria.</p><p><strong>Estrategia óptima:</strong></p><ol><li>Una vez al año, audita todos los fijos y recórtalos (operadores, suscripciones, seguros)</li><li>Define un presupuesto variable semanal (no mensual) — el cerebro no maneja bien 30 días</li><li>Automatiza el ahorro antes de que llegue a la cuenta variable</li></ol>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué estrategia tiene mayor impacto duradero con menor esfuerzo diario?', opts:['Comer menos fuera','Cambiar a un plan móvil más barato','Comprar ropa de segunda mano','Caminar en lugar de coger taxi'], ans:1, exp:'Renegociar un gasto fijo una vez ahorra durante meses o años sin esfuerzo continuo. Los variables requieren disciplina diaria.' },
      { type:'final', xp:100, msg:'Audita tus fijos una vez al año. Te regalará cientos de euros sin cambiar tu estilo de vida.' },
    ]},
  { id:136, icon:'🪙', title:'Inflación y Poder Adquisitivo', desc:'El impuesto invisible que nadie votó. Cómo destruye tus ahorros si no actúas.', xp:110, tag:'FUNDAMENTOS', tagC:'green', users:'16.900',
    steps:[
      { type:'content', tag:'📖 M137', title:'El ladrón silencioso',
        content:'<h3>Qué es la inflación realmente</h3><p>La inflación mide cuánto suben los precios en un periodo. Si la inflación anual es 4%, lo que hoy cuesta €100 costará €104 el año que viene.</p><p>Esto significa que <strong>el dinero parado en una cuenta sin remunerar pierde valor cada año</strong>. No porque desaparezca, sino porque compra menos.</p><p>Ejemplo real: €10.000 en una cuenta al 0% durante 10 años con inflación media del 3%:</p><p>Valor nominal: €10.000<br>Valor real (poder de compra): <strong>€7.374</strong></p><p>Perdiste €2.626 sin que nadie te robara.</p>' },
      { type:'content', tag:'🛡️ M137', title:'Cómo proteger tu dinero',
        content:'<h3>El mínimo vital: batir la inflación</h3><p>Tu objetivo como inversor no es "ganar dinero" — es como mínimo <strong>mantener tu poder adquisitivo</strong>. Si la inflación es 3% y tus ahorros rentan 1%, estás perdiendo 2% real cada año.</p><p>Activos que históricamente han batido la inflación a largo plazo:</p><ul><li><strong>Bolsa global</strong> (S&P 500, MSCI World): ~7% real anual</li><li><strong>Inmuebles en zonas con demanda</strong>: ~3-4% real + alquiler</li><li><strong>Bonos ligados a la inflación</strong>: 0-2% real pero garantizados</li></ul><p>Activos que pierden contra la inflación: cuentas corrientes sin remunerar, efectivo en casa y depósitos a corto plazo al 0%.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes €20.000 en cuenta al 0%. Inflación media 3%. ¿Qué pasa en 10 años?', opts:['Siguen valiendo €20.000','Tu poder de compra baja a €14.900 reales','El banco te quita el 3%','Ganas €6.000 de intereses'], ans:1, exp:'€20.000 × (1-0.03)^10 ≈ €14.900. Pierdes poder adquisitivo sin que se mueva el saldo nominal.' },
      { type:'final', xp:110, msg:'Entender la inflación es el primer paso para invertir. Sin esto, ahorrar no basta.' },
    ]},
  { id:137, icon:'🏧', title:'Euríbor: El Tipo que Mueve tu Hipoteca', desc:'Qué es, cómo se calcula y por qué determina lo que pagas cada mes.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'13.700',
    steps:[
      { type:'content', tag:'📖 M138', title:'El índice europeo de referencia',
        content:'<h3>Euríbor sin tecnicismos</h3><p>El <strong>Euríbor</strong> (Euro Interbank Offered Rate) es el tipo al que los bancos europeos se prestan dinero entre sí. Es el índice al que se referencian la mayoría de hipotecas variables en España.</p><p>Existen varios plazos — a 1 semana, 1 mes, 3 meses, 6 meses y 12 meses. El más común para hipotecas es el <strong>Euríbor a 12 meses</strong>.</p><p>Su valor depende de las expectativas de tipos del BCE. Cuando el BCE sube tipos, el Euríbor sube. Cuando baja, el Euríbor baja.</p>' },
      { type:'content', tag:'💶 M138', title:'Impacto real en tu cuota',
        content:'<h3>El cálculo de tu hipoteca variable</h3><p>Tu cuota = <strong>(Euríbor + diferencial del banco) aplicado al capital pendiente</strong>.</p><p>Ejemplo: hipoteca de €150.000 a 25 años, diferencial +0,8%:</p><ul><li>Euríbor al <strong>-0,5%</strong> (2021) → cuota ~€530/mes</li><li>Euríbor al <strong>4,0%</strong> (2023) → cuota ~€820/mes</li></ul><p>Una subida del 4,5% puede añadir <strong>€290/mes = €3.480/año</strong> a tu cuota. Por eso existe la hipoteca fija.</p><p>El Euríbor se revisa normalmente cada 6 o 12 meses según contrato.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿A qué referencia se ajustan la mayoría de hipotecas variables en España?', opts:['IPC','Euríbor 12 meses','Tipo del BCE','Prima de riesgo'], ans:1, exp:'El Euríbor a 12 meses es la referencia más usada para hipotecas variables en España.' },
      { type:'final', xp:100, msg:'Revisa la evolución del Euríbor antes de firmar cualquier hipoteca variable.' },
    ]},
  { id:138, icon:'📑', title:'TAE vs TIN: Cuál es la Cifra que Importa', desc:'El truco de marketing que usan bancos y tarjetas. Nunca más te engañen.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'15.400',
    steps:[
      { type:'content', tag:'📖 M139', title:'Dos siglas, una trampa',
        content:'<h3>La diferencia clave</h3><p><strong>TIN</strong> (Tipo de Interés Nominal): es el interés "puro" del préstamo o depósito. No incluye comisiones ni frecuencia de liquidación.</p><p><strong>TAE</strong> (Tasa Anual Equivalente): incluye TIN + comisiones + periodicidad de pagos. Es el coste real anual.</p><p>Por ley, todos los productos financieros deben mostrar la TAE. Pero muchos anuncios destacan solo el TIN porque es menor.</p><p>Ejemplo: préstamo con TIN 5% pero 1% de comisión de apertura y pagos mensuales → TAE real ~5,5%.</p>' },
      { type:'content', tag:'🔍 M139', title:'Cómo comparar productos',
        content:'<h3>La regla de oro</h3><ul><li>Al comparar <strong>préstamos</strong> (deuda): elige el que tenga <em>menor TAE</em></li><li>Al comparar <strong>depósitos o cuentas remuneradas</strong>: elige el que tenga <em>mayor TAE</em></li></ul><p>Caso típico: dos tarjetas de crédito.</p><p>Tarjeta A: "TIN 12% — ¡oferta!" Pero con TAE 24% (comisión anual + revolving).</p><p>Tarjeta B: "TAE 15%" sin letra pequeña. Es más barata aunque parezca más cara al leer.</p><p>Siempre mira la TAE. Es la cifra que la ley obliga a publicar y la única comparable.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Un préstamo ofrece "solo 4,5% TIN" pero la TAE es 7,2%. ¿Qué significa?', opts:['Es un error del banco','Hay comisiones o pagos frecuentes que elevan el coste real','La TAE siempre es superior por ley','El TIN es más importante'], ans:1, exp:'La diferencia entre TIN y TAE la explican las comisiones y la frecuencia de liquidación. La TAE refleja el coste real anual.' },
      { type:'final', xp:100, msg:'Regla simple: ignora el TIN en marketing, compara siempre por TAE.' },
    ]},
  { id:139, icon:'📄', title:'Cómo Leer tu Nómina Línea por Línea', desc:'El documento que firmas cada mes sin entender. Lo descifras en 10 minutos.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'17.200',
    steps:[
      { type:'content', tag:'📖 M140', title:'Anatomía de una nómina española',
        content:'<h3>Las tres grandes secciones</h3><p>Una nómina tiene tres partes claras:</p><p><strong>1. Devengos</strong> — lo que te pagan bruto:</p><ul><li>Salario base</li><li>Complementos (antigüedad, puesto, idiomas)</li><li>Pagas extras prorrateadas o no</li><li>Horas extras, pluses</li></ul><p><strong>2. Deducciones</strong> — lo que te descuentan:</p><ul><li>Cotización Seguridad Social (4,7% aprox del trabajador)</li><li>IRPF (retención variable según salario y situación familiar)</li><li>Otros descuentos (desempleo, formación)</li></ul><p><strong>3. Líquido a percibir</strong> — lo que te ingresan realmente.</p>' },
      { type:'content', tag:'💡 M140', title:'Los números que debes vigilar',
        content:'<h3>Lo importante en tu nómina</h3><p><strong>Base de cotización:</strong> determina tu pensión futura, paro y bajas. Cuanto mayor, mejor cobertura futura — aunque implique más descuento hoy.</p><p><strong>Porcentaje de IRPF retenido:</strong> Hacienda lo ajusta. Si te retienen más de lo que debes, te devuelven en la declaración. Si retienen menos, pagas. Es un saldo, no un regalo.</p><p><strong>Pagas extras:</strong> 14 pagas (12 + 2 extras) es lo estándar. Si están prorrateadas, cobras lo mismo los 12 meses. Si no, en junio y diciembre cobras doble.</p><p>Tip: guarda tus nóminas. Te las pedirán para alquileres, hipotecas, prestamos y trámites administrativos.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Por qué la base de cotización alta es importante a largo plazo?', opts:['Permite ganar más hoy','Determina tu pensión futura, paro y prestaciones','Reduce el IRPF','Es obligatorio por ley'], ans:1, exp:'La base de cotización alta significa mejor pensión futura, mayor prestación por desempleo y mejores coberturas de la Seguridad Social.' },
      { type:'final', xp:100, msg:'Si entiendes tu nómina, puedes detectar errores y negociar mejor tu salario.' },
    ]},
  { id:140, icon:'📍', title:'Cuentas Bancarias: Corrientes, Remuneradas, Ahorro', desc:'No todas las cuentas son iguales. Elegir la correcta puede darte €500/año.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'14.100',
    steps:[
      { type:'content', tag:'📖 M141', title:'Los tres tipos fundamentales',
        content:'<h3>Cuenta corriente</h3><p>La cuenta "de toda la vida". Sirve para recibir nómina, domiciliar recibos y usar la tarjeta. Rentabilidad: <strong>0%</strong>. Comisiones: altas si no cumples requisitos.</p><h3>Cuenta remunerada</h3><p>Funciona igual que una corriente pero te paga un interés (2-4% habitual en 2024). Suele tener condiciones: nómina domiciliada, importe máximo remunerado (€30.000-€50.000 típico).</p><h3>Cuenta de ahorro</h3><p>Sin tarjeta ni movimientos frecuentes. Rentabilidad similar o superior a remunerada. Ideal para fondo de emergencia.</p>' },
      { type:'content', tag:'⚙️ M141', title:'La estructura óptima',
        content:'<h3>El sistema de dos o tres cuentas</h3><p><strong>Cuenta 1 — Operativa (corriente):</strong> donde llega tu sueldo. De aquí se pagan recibos y gastos variables con tarjeta.</p><p><strong>Cuenta 2 — Fondo de emergencia (remunerada o ahorro):</strong> 3-6 meses de gastos. Separada mentalmente: no es "dinero disponible".</p><p><strong>Cuenta 3 — Inversión (broker):</strong> donde van las aportaciones mensuales a ETFs o fondos indexados.</p><p>El principio: <em>separar dinero de gasto, de emergencia y de inversión en cuentas distintas</em>. Reduce la tentación de gastar el ahorro.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Dónde deberías guardar tu fondo de emergencia?', opts:['En la cuenta corriente con tarjeta','En efectivo en casa','En cuenta remunerada o de ahorro separada','Todo invertido en bolsa'], ans:2, exp:'Separado de la cuenta operativa (para no gastarlo) pero líquido y accesible (no invertido). Cuenta remunerada o de ahorro es perfecta.' },
      { type:'final', xp:100, msg:'Si todavía tienes todo en una sola cuenta, es el momento de separar.' },
    ]},
  { id:141, icon:'🗒️', title:'Fondo de Emergencia Avanzado', desc:'No es solo "3 meses de gastos". La versión experta que pocos conocen.', xp:110, tag:'FUNDAMENTOS', tagC:'green', users:'13.500',
    steps:[
      { type:'content', tag:'📖 M142', title:'Por qué 3 meses es el mínimo, no la meta',
        content:'<h3>El cálculo correcto</h3><p>El consejo clásico de "3 meses de gastos" es el <strong>mínimo absoluto</strong>. El fondo ideal depende de tu perfil:</p><ul><li><strong>Empleado fijo con pareja que trabaja:</strong> 3 meses de gastos</li><li><strong>Empleado fijo soltero:</strong> 4-5 meses</li><li><strong>Empleado con contrato temporal:</strong> 6 meses</li><li><strong>Freelance o autónomo:</strong> 6-12 meses</li><li><strong>Emprendedor sin ingresos estables:</strong> 12-18 meses</li></ul><p>La clave no es el número — es la <strong>capacidad de dormir tranquilo</strong> ante una emergencia.</p>' },
      { type:'content', tag:'💡 M142', title:'Dónde guardarlo y en qué formato',
        content:'<h3>El fondo de emergencia en capas</h3><p>Los expertos recomiendan dividir el fondo en tres niveles:</p><p><strong>Capa 1 — Liquidez total (30% del fondo):</strong> cuenta remunerada con disponibilidad inmediata. Para imprevistos del día a día.</p><p><strong>Capa 2 — Disponibilidad 1-3 días (50%):</strong> cuenta de ahorro o depósito con retirada rápida pero no instantánea. Evita tentaciones.</p><p><strong>Capa 3 — Corto plazo (20%):</strong> letras del tesoro o monetarios. Rentabilidad superior a costa de liquidez más lenta.</p><p>Error común: tener todo el fondo en la cuenta corriente (capa 1) — pierde valor contra inflación y tientas gastarlo.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Eres freelance con gastos de €1.800/mes. ¿Cuánto debería ser tu fondo de emergencia?', opts:['€3.600 (2 meses)','€5.400 (3 meses)','€10.800 (6 meses)','€21.600 (12 meses)'], ans:3, exp:'Freelance o autónomo: 6-12 meses mínimo por la inestabilidad de ingresos. 12 meses (€21.600) es lo recomendable.' },
      { type:'final', xp:110, msg:'Un fondo de emergencia completo es la mayor pausa mental que puedes comprar.' },
    ]},
  { id:142, icon:'✍️', title:'Objetivos SMART Financieros', desc:'La diferencia entre soñar con ser rico y llegar a serlo.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'10.800',
    steps:[
      { type:'content', tag:'📖 M143', title:'El framework que multiplica por 3 el éxito',
        content:'<h3>SMART aplicado al dinero</h3><p>Un estudio de la Dominican University demostró que fijar objetivos específicos con número y fecha multiplica por 3 la probabilidad de conseguirlos. El framework SMART significa:</p><ul><li><strong>S</strong>pecific (específico): "ahorrar dinero" no vale, "ahorrar €5.000"</li><li><strong>M</strong>easurable (medible): con número exacto</li><li><strong>A</strong>chievable (alcanzable): realista dado tu ingreso</li><li><strong>R</strong>elevant (relevante): conectado con un objetivo mayor</li><li><strong>T</strong>ime-bound (con fecha): deadline concreto</li></ul><p>Ejemplo malo: "quiero ahorrar más".<br>Ejemplo SMART: "quiero tener <strong>€12.000</strong> de fondo de emergencia el <strong>31 de diciembre de 2026</strong>, ahorrando <strong>€400/mes</strong>".</p>' },
      { type:'content', tag:'🪜 M143', title:'El sistema de metas por horizontes',
        content:'<h3>Tres horizontes, tres metas</h3><p>Para no sentirte abrumado, divide tus objetivos por plazo:</p><p><strong>Corto plazo (0-2 años):</strong></p><ul><li>Fondo de emergencia completo</li><li>Liquidar tarjeta de crédito</li><li>Ahorrar para un curso o formación</li></ul><p><strong>Medio plazo (2-7 años):</strong></p><ul><li>Entrada para una vivienda</li><li>Libertad laboral parcial</li><li>Empezar un negocio</li></ul><p><strong>Largo plazo (7+ años):</strong></p><ul><li>Independencia financiera</li><li>Jubilación complementaria</li><li>Herencia para hijos</li></ul><p>Una meta por cada horizonte. Más de tres te dispersa.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Cuál de estos es un objetivo SMART correctamente formulado?', opts:['Quiero ser rico algún día','Voy a ahorrar este año','Tendré €30.000 invertidos para el 31 de diciembre de 2027','Ahorrar un poco cada mes'], ans:2, exp:'Solo el tercero es específico (€30.000), medible, con fecha concreta y potencialmente alcanzable. Los demás son deseos, no objetivos.' },
      { type:'final', xp:100, msg:'Escribe tus 3 metas SMART hoy. Las que no están en papel no existen.' },
    ]},
  { id:143, icon:'🪖', title:'Pay Yourself First: El Hábito del 1%', desc:'El hábito más importante para cualquier persona que quiera ser rica.', xp:100, tag:'FUNDAMENTOS', tagC:'green', users:'18.700',
    steps:[
      { type:'content', tag:'📖 M144', title:'La regla que divide ricos y pobres',
        content:'<h3>Págate tú primero</h3><p>Popularizada por George S. Clason en <em>El Hombre Más Rico de Babilonia</em> (1926), la regla es simple: <strong>antes de pagar a nadie más, págate a ti mismo</strong>.</p><p>La mayoría de personas hacen esto:</p><p>Ingresos − Gastos = Ahorro (lo que queda, si queda)</p><p>Los ricos hacen esto:</p><p>Ingresos − Ahorro = Gastos (lo que puedes usar)</p><p>La diferencia es brutal. Invirtiendo el 10-20% del sueldo el día que llega, <strong>nunca lo tienes mentalmente disponible para gastar</strong>.</p>' },
      { type:'content', tag:'⚙️ M144', title:'Cómo automatizarlo en 15 minutos',
        content:'<h3>El sistema del día 1</h3><p>El día que cobras — o el día 1 de cada mes — debe ejecutarse automáticamente esto:</p><ol><li>Transferencia al fondo de emergencia (mientras no esté completo)</li><li>Transferencia al broker/fondo de inversión (aportación mensual fija)</li><li>Transferencia a cuentas de objetivos específicos (vivienda, viaje, etc.)</li></ol><p>Todo <strong>programado por el banco</strong>, no manual. Si depende de tu fuerza de voluntad, fallará.</p><p>Empieza con el 1% si no puedes más. Sube 1% cada tres meses. En 2 años estás en el 10%. En 5 años, en el 20%.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Cuál es el orden correcto para "pay yourself first"?', opts:['Pagar facturas → Gastar en ocio → Ahorrar lo que quede','Ahorrar automáticamente → Pagar facturas → Gastar lo que quede','Ganar más → Gastar más → Ahorrar más','No importa el orden, lo importante es ahorrar'], ans:1, exp:'Ahorrar primero (automatizado), luego pagar necesidades y finalmente disponer de lo que queda. Este orden elimina la dependencia de la fuerza de voluntad.' },
      { type:'final', xp:100, msg:'Programa la transferencia automática hoy. Es la decisión financiera más rentable que puedes tomar.' },
    ]},
  { id:144, icon:'🛖', title:'Presupuesto Zero-Based', desc:'El sistema militar que asigna cada euro antes de gastarlo.', xp:110, tag:'FUNDAMENTOS', tagC:'green', users:'9.400',
    steps:[
      { type:'content', tag:'📖 M145', title:'Cada euro tiene un nombre',
        content:'<h3>El principio zero-based</h3><p>El presupuesto zero-based, popularizado por Dave Ramsey en <em>Total Money Makeover</em>, exige que <strong>Ingresos − Asignaciones = €0 exactos</strong>.</p><p>No se trata de gastarlo todo — se trata de que cada euro tenga un destino asignado <em>antes</em> de que empiece el mes:</p><ul><li>Alquiler: €700</li><li>Comida: €400</li><li>Transporte: €150</li><li>Ocio: €200</li><li>Ahorro: €500</li><li>Inversión: €300</li><li>Gastos imprevistos: €150</li><li>...</li></ul><p>Total = ingresos del mes. Ni un euro suelto.</p>' },
      { type:'content', tag:'🎖️ M145', title:'Por qué funciona tan bien',
        content:'<h3>La ciencia del efecto</h3><p>Tres razones por las que el zero-based es imbatible:</p><p><strong>1. Elimina el "dinero fantasma":</strong> ese dinero que está en tu cuenta sin propósito claro y acaba gastado en cosas que no recuerdas.</p><p><strong>2. Visibiliza las fugas:</strong> si en tu presupuesto no queda dinero para ocio, no puedes gastar en ocio sin sacarlo de otra partida. La decisión es consciente.</p><p><strong>3. Convierte el ahorro en gasto:</strong> asignar €500 al ahorro lo convierte en una "factura" igual de obligatoria que el alquiler. No es opcional.</p><p>Se hace una vez al mes, tarda 30-45 minutos. Apps como YNAB o EveryDollar lo facilitan, pero basta una hoja de papel.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué significa "zero-based budget"?', opts:['Empezar sin dinero en la cuenta','Cada euro del ingreso debe tener un destino asignado de antemano','Presupuesto para personas sin ingresos','Ahorrar el 100% del sueldo'], ans:1, exp:'Zero-based significa que ingresos menos asignaciones suma cero — cada euro está presupuestado antes del mes.' },
      { type:'final', xp:110, msg:'Haz tu primer zero-based budget este mes. Cambia tu relación con el dinero.' },
    ]},
  { id:145, icon:'💰', title:'El Mito del Salario: Por Qué Ganar Más No Te Hace Rico', desc:'La razón psicológica por la que la mayoría nunca acumula patrimonio, aunque gane más.', xp:110, tag:'FUNDAMENTOS', tagC:'green', users:'20.100',
    steps:[
      { type:'content', tag:'📖 M146', title:'Lifestyle creep: el enemigo silencioso',
        content:'<h3>El fenómeno que arruina altos salarios</h3><p>El <strong>lifestyle creep</strong> (inflación del estilo de vida) es la tendencia a gastar más conforme ganas más. Suena obvio, pero es la razón número uno por la que personas con salarios de €60.000, €100.000 o €200.000 acaban sin ahorros.</p><p>Un estudio del Bank of America de 2023 mostró que:</p><ul><li>El <strong>33% de personas con ingresos de €150.000+</strong> vive al día</li><li>La tasa de ahorro <strong>no sube</strong> significativamente con el salario — sube el gasto</li></ul><p>Si siempre gastas un 95% de lo que ingresas, ganar el doble no te hace más rico — solo aumenta tu nivel de vida en proporción.</p>' },
      { type:'content', tag:'🧠 M146', title:'La fórmula de la riqueza real',
        content:'<h3>El ratio que importa: Gap de ahorro</h3><p>La riqueza se construye con la <strong>brecha entre lo que ganas y lo que gastas</strong>. No con ninguna de las dos cifras por separado.</p><p><strong>Escenario A:</strong> gana €2.000, gasta €1.500, ahorra €500 → tasa 25%</p><p><strong>Escenario B:</strong> gana €10.000, gasta €9.500, ahorra €500 → tasa 5%</p><p>El escenario B aparenta más éxito pero acumula patrimonio <em>más despacio</em>.</p><p>Reglas para evitar el lifestyle creep:</p><ul><li>Ante una subida salarial: ahorra al menos el 50% del incremento</li><li>No actualices coche, piso o estilo de vida cada vez que sube el sueldo</li><li>Automatiza el ahorro al porcentaje, no al importe fijo</li></ul>' },
      { type:'quiz', tag:'🧠 TEST', q:'Cobras €2.000, te suben el sueldo a €3.000. ¿Qué haces según la mejor práctica?', opts:['Gasto los €1.000 extra para mejorar mi vida','Ahorro €500 y me permito €500 extra de gasto','Gasto todo, me lo merezco','Ahorro los €1.000 completos'], ans:1, exp:'Ahorrar el 50% del incremento (€500) y permitirte mejorar un poco con el otro 50% evita el lifestyle creep pero permite disfrute gradual.' },
      { type:'final', xp:110, msg:'Ganar más no te hace rico. Gastar menos de lo que ganas sí.' },
    ]},
  { id:146, icon:'🚑', title:'Asset Allocation: La Decisión que Vale el 90%', desc:'Qué porcentaje en acciones, bonos y efectivo. La elección que determina tu rentabilidad.', xp:120, tag:'INVERSIÓN', tagC:'blue', users:'12.300',
    steps:[
      { type:'content', tag:'📖 M147', title:'El estudio que lo cambió todo',
        content:'<h3>Brinson, Hood & Beebower — 1986</h3><p>Un estudio histórico analizó la rentabilidad de 91 grandes fondos de pensiones durante 10 años. Resultado: <strong>el 93,6% de la variabilidad de rentabilidad se explicaba por el asset allocation</strong> — no por el stock picking ni el market timing.</p><p>En otras palabras: elegir qué porcentaje va a acciones vs bonos vs efectivo importa mucho más que elegir <em>qué</em> acción comprar.</p><p>La regla clásica del 100:</p><p><strong>% en acciones = 100 − tu edad</strong></p><p>A los 30 años: 70% acciones, 30% renta fija. A los 60: 40% acciones, 60% renta fija.</p><p>Variantes modernas (120-edad) ajustan por mayor esperanza de vida.</p>' },
      { type:'content', tag:'⚖️ M147', title:'Más allá de la edad',
        content:'<h3>Factores que ajustan tu allocation</h3><p>La regla de 100-edad es un punto de partida. Ajustes recomendados:</p><ul><li><strong>Tolerancia al riesgo alta:</strong> +10% en acciones</li><li><strong>Estabilidad laboral baja:</strong> -10% en acciones (necesitas más liquidez)</li><li><strong>Horizonte &gt;20 años:</strong> +10-20% en acciones</li><li><strong>Necesidad de ingresos pasivos:</strong> +10% en bonos o dividendo</li></ul><p>Carteras modelo populares:</p><ul><li><strong>All Weather (Ray Dalio):</strong> 30% acciones, 40% bonos largos, 15% bonos medios, 7,5% oro, 7,5% commodities</li><li><strong>Three-Fund (Bogle):</strong> 60% bolsa US, 20% bolsa internacional, 20% bonos</li><li><strong>Permanent Portfolio (Harry Browne):</strong> 25% acciones, 25% bonos largos, 25% oro, 25% efectivo</li></ul>' },
      { type:'quiz', tag:'🧠 TEST', q:'Según el estudio Brinson-Hood-Beebower, ¿qué determina la mayoría de la rentabilidad de una cartera?', opts:['Elegir las mejores acciones','Entrar y salir en el momento correcto','El asset allocation (qué % en cada tipo de activo)','Pagar comisiones bajas'], ans:2, exp:'El 93,6% de la variabilidad viene del asset allocation. Stock picking y market timing explican apenas el 6,4%.' },
      { type:'final', xp:120, msg:'Define tu asset allocation antes de comprar nada. Es la decisión que más impactará tu retorno.' },
    ]},
  { id:147, icon:'🦺', title:'Backtest y Performance Real', desc:'Por qué los "+15% anual histórico" suelen ser marketing. Cómo leerlos bien.', xp:120, tag:'INVERSIÓN', tagC:'blue', users:'9.800',
    steps:[
      { type:'content', tag:'📖 M148', title:'Los 4 sesgos del backtest',
        content:'<h3>Lo que no te cuentan los gráficos bonitos</h3><p>Un backtest es una simulación de cómo habría rendido una estrategia en el pasado. Parece objetivo, pero tiene sesgos brutales:</p><p><strong>1. Survivorship bias (sesgo del superviviente):</strong> los índices incluyen solo empresas vivas hoy. Las que quebraron se eliminan. Esto infla la rentabilidad histórica en un 1-2% anual.</p><p><strong>2. Lookback bias:</strong> diseñar la estrategia conociendo ya el resultado. Es como predecir el ganador del mundial después de verlo.</p><p><strong>3. Data mining:</strong> probar 1000 estrategias hasta encontrar una que funcionó por pura casualidad.</p><p><strong>4. Costes ignorados:</strong> la mayoría de backtests omiten comisiones, impuestos y slippage (diferencia entre precio teórico y ejecutado).</p>' },
      { type:'content', tag:'🔍 M148', title:'Cómo evaluar una rentabilidad real',
        content:'<h3>Las 3 preguntas que debes hacer</h3><p>Antes de creer que un fondo o estrategia "rinde X% anual":</p><p><strong>1. ¿Es rentabilidad neta o bruta?</strong> Neta = después de comisiones e impuestos. Bruta = antes. Un fondo con 7% bruto y 2% de TER te da 5% neto real.</p><p><strong>2. ¿Es CAGR o rentabilidad media aritmética?</strong> La media aritmética infla. Si un año ganas 100% y al siguiente pierdes 50%, la media aritmética dice "25% anual" — pero tu CAGR real es 0%.</p><p><strong>3. ¿Incluye el peor escenario?</strong> Un fondo con 12% medio que tiene un -60% en 2008 puede quebrar tu tolerancia emocional y tu cartera real.</p><p>Fuentes fiables de rentabilidades reales: Morningstar, MSCI, portalesfinancieros oficiales.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Un fondo ganó +100% un año y perdió -50% al siguiente. ¿Cuál es el CAGR real?', opts:['+50% anual','+25% anual','0% anual (sin ganar nada)','-25% anual'], ans:2, exp:'€100 → €200 → €100. Has vuelto al punto de partida. CAGR = 0%. La media aritmética engaña.' },
      { type:'final', xp:120, msg:'Nunca inviertas basándote en rentabilidad pasada sin entender cómo se calculó.' },
    ]},
  { id:148, icon:'🎖️', title:'Impuestos en Inversión: Net Returns Reales', desc:'El 19-28% que se queda Hacienda convierte el 7% en 5,4%. El detalle que cambia todo.', xp:120, tag:'INVERSIÓN', tagC:'blue', users:'14.700',
    steps:[
      { type:'content', tag:'📖 M149', title:'La tributación española de inversiones',
        content:'<h3>Tramos de rendimientos del capital mobiliario (2024)</h3><p>En España, los rendimientos de inversión tributan así:</p><ul><li>Hasta <strong>€6.000</strong>: 19%</li><li>De €6.000 a <strong>€50.000</strong>: 21%</li><li>De €50.000 a <strong>€200.000</strong>: 23%</li><li>De €200.000 a <strong>€300.000</strong>: 27%</li><li>Más de €300.000: 28%</li></ul><p>Aplica a:</p><ul><li>Plusvalías (compraste a €100, vendes a €200 → tributa €100)</li><li>Dividendos</li><li>Intereses de depósitos y bonos</li><li>Fondos de inversión al rescatarlos</li></ul><p><strong>Importante:</strong> si mantienes un fondo traspasándolo, no tributas. Esto se llama "diferimiento fiscal" y es una ventaja fiscal enorme frente a ETFs en España.</p>' },
      { type:'content', tag:'💰 M149', title:'Estrategias legales de optimización',
        content:'<h3>Cómo pagar menos legalmente</h3><p><strong>1. Diferimiento con fondos:</strong> traspasar entre fondos no tributa. Los ETFs sí. Para un inversor español, fondos indexados &gt; ETFs puramente por fiscalidad.</p><p><strong>2. Aprovechar pérdidas:</strong> si tienes plusvalías y minusvalías, se compensan. Vender algo con pérdida antes de fin de año puede reducir tu factura fiscal.</p><p><strong>3. Plan de pensiones:</strong> reduce base imponible hoy (aportación máxima €1.500/año). Tributa al rescate pero con base menor si coincide con tramo bajo.</p><p><strong>4. Orden de ventas:</strong> en una misma acción, se aplica FIFO (first in, first out). Vender las más antiguas puede tener diferente tributación que las nuevas.</p><p><strong>5. Herencias y donaciones:</strong> la plusvalía se "resetea" en una transmisión mortis causa en muchos casos.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes €8.000 de plusvalías en bolsa. ¿Cuánto tributas en IRPF (2024)?', opts:['€800 (10%)','€1.530','€1.560','€1.600'], ans:2, exp:'Primeros €6.000 al 19% = €1.140. Siguientes €2.000 al 21% = €420. Total €1.560.' },
      { type:'final', xp:120, msg:'Tu rentabilidad real es siempre la NETA después de impuestos. Pónsela en el Excel.' },
    ]},
  { id:149, icon:'🥈', title:'Market Cap vs Equal Weight: No Todos los Índices son Iguales', desc:'La diferencia que explica por qué tu ETF S&P 500 no se parece al del primo.', xp:120, tag:'INVERSIÓN', tagC:'blue', users:'8.900',
    steps:[
      { type:'content', tag:'📖 M150', title:'Los dos grandes esquemas de ponderación',
        content:'<h3>Market cap weighted vs equal weighted</h3><p>Cuando compras un "S&P 500", lo que compras depende de cómo se ponderen las 500 empresas:</p><p><strong>Market cap weighted (capitalización):</strong> cada empresa pesa en proporción a su valor bursátil. En 2024, Apple + Microsoft + NVIDIA + Amazon + Meta + Google pesan ~30% del S&P 500 entero. Si te va bien a estas 6, te va bien al índice.</p><p><strong>Equal weighted (peso igual):</strong> cada empresa pesa 1/500 = 0,2%. Apple pesa lo mismo que la empresa número 500 del índice.</p><p>La diferencia parece sutil. No lo es.</p>' },
      { type:'content', tag:'📈 M150', title:'Impacto real en rentabilidad',
        content:'<h3>El caso del S&P 500 en 2023-2024</h3><p>En 2023:</p><ul><li>S&P 500 <strong>Market Cap</strong>: +26% (gracias a "Magnificent 7": Apple, Microsoft, Google, Amazon, NVIDIA, Meta, Tesla)</li><li>S&P 500 <strong>Equal Weight</strong>: +13,9%</li></ul><p>Cuando los grandes tiran, market cap bate. Cuando hay rotación a small caps, equal weight bate.</p><p><strong>Ventajas de Market Cap:</strong></p><ul><li>Menor rotación → menos comisiones</li><li>Refleja mejor el "tamaño real" de la economía</li><li>Liquidez máxima</li></ul><p><strong>Ventajas de Equal Weight:</strong></p><ul><li>Exposición real a small/mid caps</li><li>Menos dependiente de pocas empresas (diversificación real)</li><li>Históricamente bate ligeramente a largo plazo (factor size)</li></ul><p>Combinar ambos (60% market cap + 40% equal weight) es una estrategia balanceada.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué diferencia principal hay entre S&P 500 Market Cap y S&P 500 Equal Weight?', opts:['Tienen distintas empresas','Market Cap pondera por tamaño; Equal Weight da mismo peso a las 500','Equal Weight solo tiene 50 empresas','No hay diferencia real'], ans:1, exp:'Mismas 500 empresas. Diferente ponderación: Market Cap premia a las grandes; Equal Weight las trata por igual.' },
      { type:'final', xp:120, msg:'Antes de comprar un ETF, mira cómo pondera. No todos los S&P 500 son el mismo S&P 500.' },
    ]},
  { id:150, icon:'❄️', title:'Snowball vs Avalanche: Cómo Amortizar Deudas', desc:'Dos métodos probados. Matemáticamente uno gana, pero el otro es más efectivo en la práctica.', xp:120, tag:'DEUDA', tagC:'orange', users:'16.800',
    steps:[
      { type:'content', tag:'📖 M151', title:'Los dos métodos clásicos',
        content:'<h3>Snowball (Bola de Nieve)</h3><p>Popularizado por Dave Ramsey. Ordenas tus deudas <strong>de menor a mayor saldo</strong> e ignoras el tipo de interés. Pagas el mínimo en todas y atacas la más pequeña con todo el extra disponible.</p><p><em>Ventaja psicológica:</em> liquidas la primera deuda rápido, ganas dopamina y sigues motivado.</p><h3>Avalanche (Avalancha)</h3><p>Ordenas por <strong>tipo de interés</strong>, de mayor a menor. Atacas la del interés más alto primero, independientemente del saldo.</p><p><em>Ventaja matemática:</em> pagas menos intereses totales. Puede ahorrarte cientos o miles de euros.</p>' },
      { type:'content', tag:'🧠 M151', title:'Cuál elegir en la práctica',
        content:'<h3>La respuesta depende de ti</h3><p>Estudios del Journal of Consumer Research demuestran que el <strong>snowball genera más adherencia emocional</strong>. Personas que empezaron con snowball completan el plan un 15% más que avalanche.</p><p>Avalanche es óptimo solo si:</p><ul><li>Tienes alta disciplina financiera</li><li>La diferencia de tipos entre deudas es grande (&gt;5%)</li><li>El ahorro en intereses supera los €500</li></ul><p>Snowball es mejor si:</p><ul><li>Tienes muchas deudas pequeñas</li><li>Necesitas victorias rápidas para no rendirte</li><li>Los tipos son similares entre deudas</li></ul><p>Híbrido recomendado: snowball pero saltándote las deudas con interés &gt;20% (revolving), que atacas primero independientemente del saldo.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes 3 deudas: €500 al 4%, €2.000 al 8%, €500 al 22%. ¿Cuál atacas primero con método híbrido?', opts:['La de €500 al 4% (menor saldo)','La de €500 al 22% (interés muy alto)','La de €2.000 al 8% (mayor saldo)','Todas por igual'], ans:1, exp:'Al 22% es revolving típico — ataca primero por los intereses destructivos. Luego snowball normal (la otra de €500, después la de €2.000).' },
      { type:'final', xp:120, msg:'El mejor método es el que terminas. Elige el que te mantenga en marcha.' },
    ]},
  { id:151, icon:'🥉', title:'La Trampa del Revolving: TAE 24% Explicada', desc:'La peor deuda al consumidor en España. Cómo identificarla y salir de ella.', xp:120, tag:'DEUDA', tagC:'orange', users:'19.500',
    steps:[
      { type:'content', tag:'📖 M152', title:'Qué es la tarjeta revolving',
        content:'<h3>El producto financiero más tóxico legal</h3><p>Una tarjeta revolving es un crédito rotatorio donde <strong>pagas una cuota mensual fija</strong>. Suena cómodo pero tiene dos trampas:</p><ul><li>La cuota mensual es muy baja (1-3% del saldo)</li><li>El TAE típico es <strong>20-27%</strong> anual</li></ul><p>Resultado: el interés crece más rápido que lo que amortizas. Deuda de por vida.</p><p>Ejemplo real: €5.000 al 24% TAE pagando €100/mes:</p><ul><li>Tardas <strong>más de 10 años</strong> en liquidarla</li><li>Acabas pagando <strong>€11.800</strong> (€5.000 principal + €6.800 intereses)</li></ul><p>El Tribunal Supremo español ha declarado nulas varias tarjetas revolving por "interés usurario" desde 2020.</p>' },
      { type:'content', tag:'🚨 M152', title:'Cómo identificarla y salir',
        content:'<h3>Señales de alarma</h3><ul><li>Cuota mensual fija independiente de lo que hayas gastado</li><li>TAE superior al 18%</li><li>Cuota mínima inferior al 5% del saldo total</li><li>Contrato habla de "crédito al consumo" o "crédito flexible"</li></ul><p><strong>Nombres comerciales frecuentes:</strong> "Pago flexible", "Pago fácil", "Revolving", "Crédito rotativo".</p><h3>Plan de escape</h3><ol><li><strong>Cortar el uso:</strong> destruir tarjeta o bloquearla.</li><li><strong>Avalanche agresivo:</strong> atacar con el máximo extra posible.</li><li><strong>Préstamo de consolidación:</strong> pedir préstamo personal al 7-10% para liquidarla (mejor TAE).</li><li><strong>Reclamación judicial:</strong> si TAE &gt;20%, contacta con asociaciones de consumidores (ADICAE, OCU). Muchas devoluciones exitosas.</li></ol>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Por qué es tan peligrosa una tarjeta revolving?', opts:['Tiene cuotas variables','El interés crece más rápido que lo que amortizas con la cuota mínima','Es ilegal','Solo la usan personas ricas'], ans:1, exp:'La cuota baja (1-3%) combinada con TAE 24% hace que el interés supere lo amortizado. Deuda permanente.' },
      { type:'final', xp:120, msg:'Si tienes una tarjeta revolving, cancélala hoy. Es la deuda más destructiva del sistema.' },
    ]},
  { id:152, icon:'🔗', title:'Consolidación de Deudas: Cuándo Tiene Sentido', desc:'Agrupar varias deudas en una. A veces salva, a veces empeora. El análisis claro.', xp:120, tag:'DEUDA', tagC:'orange', users:'11.400',
    steps:[
      { type:'content', tag:'📖 M153', title:'Qué es la consolidación',
        content:'<h3>Juntar todas tus deudas en una sola</h3><p>La consolidación de deudas significa pedir un <strong>préstamo nuevo</strong> (personal, hipotecario o al consumo) y usarlo para liquidar todas tus deudas existentes. Quedas con una sola deuda, una cuota mensual y un tipo de interés.</p><p><strong>Tiene sentido si:</strong></p><ul><li>El TAE nuevo es significativamente menor (mínimo 3-5% menos)</li><li>Reduces la cuota mensual total</li><li>Tienes disciplina para no volver a endeudarte</li></ul><p><strong>NO tiene sentido si:</strong></p><ul><li>El plazo se alarga mucho (más intereses totales aunque la cuota sea menor)</li><li>Pagas comisiones de apertura &gt;2% del capital</li><li>Hipotecas la vivienda para consolidar deuda al consumo (peligroso)</li></ul>' },
      { type:'content', tag:'🧮 M153', title:'El cálculo que debes hacer',
        content:'<h3>Comparación real: ejemplo numérico</h3><p>Situación actual:</p><ul><li>Tarjeta 1: €2.000 al 22% TAE</li><li>Tarjeta 2: €1.500 al 18% TAE</li><li>Préstamo coche: €3.500 al 8% TAE</li></ul><p>Total: €7.000 con TAE media ponderada ~15%. Cuota total mensual: ~€350.</p><p><strong>Opción A: consolidación al 9% TAE a 5 años</strong></p><ul><li>Cuota: €145/mes</li><li>Total pagado: €8.700 (€1.700 intereses)</li></ul><p><strong>Opción B: avalanche sin consolidar</strong></p><ul><li>Seguir cuota actual €350/mes</li><li>Terminas en ~24 meses</li><li>Total pagado: €8.400 (€1.400 intereses)</li></ul><p>La consolidación baja la presión mensual pero aumenta el total. <em>La clave: ¿podrás mantener los €350/mes con fuerza de voluntad?</em> Si no, consolida.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Cuándo NO conviene consolidar deudas?', opts:['Cuando bajas el TAE considerable','Cuando alargas mucho el plazo y pagas más intereses totales','Cuando simplificas tus pagos','Cuando evitas impagos'], ans:1, exp:'Alargar el plazo baja la cuota pero puede duplicar los intereses totales. Siempre compara el coste final, no solo la cuota mensual.' },
      { type:'final', xp:120, msg:'Consolida solo si el ahorro real (no la cuota) es significativo Y mantienes disciplina.' },
    ]},
  { id:153, icon:'🏅', title:'Tu Credit Score en España: CIRBE y Asnef', desc:'Los registros que te clasifican sin que lo sepas. Cómo consultarlos y limpiarlos.', xp:110, tag:'DEUDA', tagC:'orange', users:'13.200',
    steps:[
      { type:'content', tag:'📖 M154', title:'Los dos registros que importan',
        content:'<h3>CIRBE (Central de Información de Riesgos del Banco de España)</h3><p>Registro <strong>oficial y gratuito</strong> donde constan todos tus préstamos e hipotecas superiores a €9.000. Los bancos lo consultan antes de concederte crédito.</p><p>Incluye:</p><ul><li>Hipotecas activas</li><li>Préstamos personales y al consumo &gt;€9.000</li><li>Tarjetas de crédito con saldo</li></ul><p><strong>No incluye impagos</strong> — solo saldos vivos.</p><h3>ASNEF (Asociación Nacional de Establecimientos Financieros de Crédito)</h3><p>Registro <strong>privado de morosos</strong>. Te incluyen cuando:</p><ul><li>Dejas impagado un recibo de teléfono, luz, banco...</li><li>Debes más de €50 a una empresa socia de ASNEF</li></ul><p>Estar en ASNEF te cierra las puertas a hipotecas, préstamos y contratos de suministros.</p>' },
      { type:'content', tag:'🧹 M154', title:'Cómo consultar y limpiar',
        content:'<h3>Acceso gratuito por ley</h3><p><strong>CIRBE:</strong> vas a la sede electrónica del Banco de España con certificado digital o DNI electrónico. Consulta gratis y online.</p><p><strong>ASNEF:</strong> derecho a solicitar por escrito qué datos tienen de ti (Ley Orgánica de Protección de Datos). Correo postal certificado o formulario web de ASNEF Consumer.</p><h3>Salir de ASNEF</h3><ol><li><strong>Pagar la deuda:</strong> una vez pagada, exige por burofax que te eliminen del fichero en 30 días (LOPD).</li><li><strong>Reclamar si el dato es erróneo:</strong> carta certificada a ASNEF + reclamación en AEPD si no responden.</li><li><strong>Caducidad:</strong> las deudas se eliminan solas a los 5 años desde el impago.</li></ol><p>Estar en ASNEF por €80 mal gestionados puede impedirte una hipoteca de €200.000. Tómalo en serio.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Pagaste una deuda que te había metido en ASNEF. ¿Qué hacer después?', opts:['Esperar a que caduque en 5 años','Exigir por burofax que te eliminen en 30 días','Nada, es automático','Cambiar de banco'], ans:1, exp:'Por ley, una vez pagada la deuda debes exigir la baja. No es automática — exigir con burofax es el método más efectivo.' },
      { type:'final', xp:110, msg:'Consulta tu CIRBE y ASNEF una vez al año. Descubrir errores te puede salvar una hipoteca.' },
    ]},
  { id:154, icon:'🛟', title:'Ratio Deuda/Ingresos: Tu Salud Financiera en un Número', desc:'El indicador que usan los bancos para decidir si te prestan. Y por qué debería importarte.', xp:110, tag:'DEUDA', tagC:'orange', users:'10.200',
    steps:[
      { type:'content', tag:'📖 M155', title:'El cálculo del ratio',
        content:'<h3>Qué es y cómo se calcula</h3><p>El <strong>ratio deuda/ingresos (DTI en inglés)</strong> mide qué porcentaje de tu ingreso mensual se va en pagar deudas.</p><p><strong>Fórmula:</strong></p><p>DTI = (Total cuotas mensuales de deuda ÷ Ingreso mensual neto) × 100</p><p>Ejemplo: ingresas €2.000 netos, pagas €400 de hipoteca, €80 de préstamo coche y €50 mínimo de tarjeta.</p><p>DTI = (530 ÷ 2.000) × 100 = <strong>26,5%</strong></p><h3>Interpretación por tramos</h3><ul><li><strong>&lt;20%:</strong> excelente. Bancos te conceden lo que pidas.</li><li><strong>20-35%:</strong> saludable. Margen cómodo para emergencias.</li><li><strong>35-43%:</strong> al límite. Bancos dudarán en concederte más crédito.</li><li><strong>&gt;43%:</strong> zona peligrosa. Cualquier imprevisto te rompe.</li></ul>' },
      { type:'content', tag:'🎯 M155', title:'Cómo bajarlo estratégicamente',
        content:'<h3>Tres palancas para mejorar tu ratio</h3><p><strong>1. Subir ingresos:</strong> negociar aumento, side hustle, alquilar una habitación. Cada €100 extra de ingreso neto baja tu DTI.</p><p><strong>2. Bajar deudas:</strong> amortizar capital reduce cuotas o elimina deudas. La deuda más tóxica (mayor ratio cuota/saldo) debe ir primero.</p><p><strong>3. Alargar plazos (cuidadosamente):</strong> refinanciar a plazo más largo baja la cuota y por tanto el DTI, aunque pagues más intereses totales. Útil si estás al límite.</p><h3>El DTI para comprar vivienda</h3><p>Los bancos españoles aplican esta regla: la cuota de hipoteca no debe superar el <strong>30-35% de tus ingresos netos</strong>, sumando resto de deudas. Si tu DTI actual (sin hipoteca) es 15%, te prestarán hasta cuota que sume 35% total = 20% adicional en hipoteca.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Ganas €2.500 netos. Pagas €900 de hipoteca, €120 del coche, €60 tarjeta. ¿Tu DTI es?', opts:['30% (saludable)','35% (al límite)','43,2% (zona peligrosa)','50% (crisis)'], ans:2, exp:'(900+120+60) / 2500 × 100 = 43,2%. Estás en zona peligrosa — un imprevisto puede romperte.' },
      { type:'final', xp:110, msg:'Calcula tu DTI hoy. Es el número de una cifra más importante de tu salud financiera.' },
    ]},
  { id:155, icon:'📃', title:'Préstamos Personales: Cuándo Sí, Cuándo No', desc:'La línea fina entre herramienta útil y trampa. El criterio experto.', xp:100, tag:'DEUDA', tagC:'orange', users:'12.700',
    steps:[
      { type:'content', tag:'📖 M156', title:'Los casos donde tiene sentido',
        content:'<h3>Préstamo personal justificado</h3><p>Contrariamente al mantra "todo endeudamiento es malo", hay situaciones donde un préstamo personal es la mejor decisión:</p><ul><li><strong>Consolidación de deuda cara:</strong> cambiar tarjetas al 22% por préstamo al 8% = ahorro real.</li><li><strong>Gasto médico urgente:</strong> imposible esperar a ahorrar. Ojo al TAE.</li><li><strong>Formación con alto ROI:</strong> un máster que aumentará tu salario 30-40% puede justificar endeudamiento al 5-7%.</li><li><strong>Oportunidad de negocio con retorno claro:</strong> compra de activo productivo con rentabilidad &gt; interés del préstamo.</li><li><strong>Reforma necesaria de vivienda:</strong> no estética, sino funcional (tejado, caldera, saneamiento).</li></ul>' },
      { type:'content', tag:'🚫 M156', title:'Los casos donde NO tiene sentido',
        content:'<h3>Préstamo personal destructivo</h3><p>Nunca pidas un préstamo personal para:</p><ul><li><strong>Vacaciones:</strong> pagar €3.000 al 9% durante 4 años = €3.600. Endeudarte para ocio es lifestyle creep tóxico.</li><li><strong>Coche de capricho:</strong> un coche es un pasivo que deprecia. Préstamo + depreciación = doble pérdida.</li><li><strong>Bodas de €20.000+:</strong> empezar matrimonio endeudado predice divorcio. Estudios lo confirman.</li><li><strong>Invertir en bolsa o crypto:</strong> apalancarte con deuda para invertir es trading profesional. No para particulares.</li><li><strong>Tecnología de último modelo:</strong> iPhone financiado a 24 meses al 15% TAE es una de las peores decisiones estadísticas.</li></ul><h3>Checklist antes de firmar</h3><ol><li>¿Puedo pagar la cuota con margen de seguridad del 20%?</li><li>¿El TAE es &lt;10%? Si no, negocia o busca otro.</li><li>¿El uso generará retorno económico, formativo o de salud? Si no, piensa 30 días antes.</li></ol>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Cuál es el criterio principal para que un préstamo personal tenga sentido financiero?', opts:['Que sea barato (&lt;10% TAE)','Que lo necesites urgentemente','Que el destino genere retorno económico, formativo o de salud superior al coste','Que lo pueda pagar a cómodos plazos'], ans:2, exp:'Un préstamo se justifica cuando el retorno (económico, formativo, salud) supera el coste total con intereses. Si no, erosiona patrimonio.' },
      { type:'final', xp:100, msg:'Antes de firmar un préstamo, pregúntate: "¿Pagaría este gasto si tuviera que ahorrarlo primero?"' },
    ]},
  { id:156, icon:'⚡', title:'Microcréditos: La Trampa del Día', desc:'TAE del 800% es real. Cómo los reconoces y por qué son peligrosos.', xp:110, tag:'DEUDA', tagC:'orange', users:'8.900',
    steps:[
      { type:'content', tag:'📖 M157', title:'Qué son y cómo operan',
        content:'<h3>Los "préstamos rápidos" sin aval</h3><p>Microcréditos (Vivus, Cashper, Creditea, Wandoo, etc.) son préstamos pequeños (€50-€1.000) con plazo muy corto (7-30 días) y aprobación instantánea sin aval ni nómina.</p><p><strong>Características</strong>:</p><ul><li>TAE típico: <strong>300-2.000%</strong> anual (sí, bien leído)</li><li>Comisión inicial: €20-€50 por cada €100 prestados</li><li>Penalización por impago: 5-10% del principal cada semana</li></ul><p>Ejemplo: préstamo de €300 a devolver en 30 días. Comisión €90. TAE real: ~1.100%.</p><p>Están regulados pero no prohibidos. La Ley de Crédito al Consumo (2014) exige transparencia en TAE pero no limita tipos.</p>' },
      { type:'content', tag:'🕳️ M157', title:'El círculo vicioso del microcrédito',
        content:'<h3>Cómo te atrapa el sistema</h3><p>El perfil típico: persona con ingresos bajos, necesidad urgente, sin acceso a bancos. Pide €300 para un imprevisto.</p><p><strong>Mes 1:</strong> no puede devolver. Refinancia pagando solo intereses.</p><p><strong>Mes 2:</strong> la deuda crece. Pide otro microcrédito para pagar el primero.</p><p><strong>Mes 3:</strong> ya debe a 3 empresas. Sale en ASNEF. Los bancos le cierran las puertas.</p><p>Un 38% de usuarios de microcréditos acaba en espiral según estudios del Banco de España.</p><h3>Alternativas reales</h3><ul><li><strong>Cooperativas de crédito:</strong> Caja de Ingenieros, Caja Laboral — TAE 6-10%</li><li><strong>Préstamo familiar con papel:</strong> acuerdo escrito, sin intereses</li><li><strong>Vender algo de valor:</strong> Wallapop, Cash Converters — recuperas liquidez sin deuda</li><li><strong>Ayudas públicas:</strong> Cáritas, Servicios Sociales, Fondos de ayuda municipales</li><li><strong>Anticipo de nómina:</strong> algunas empresas lo facilitan</li></ul>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué TAE típico tiene un microcrédito como Vivus o Creditea?', opts:['5-10%','18-25%','80-150%','300-2.000%'], ans:3, exp:'TAE típico 300-2.000%. Son legales pero destructivos. Nunca son la solución — son la trampa.' },
      { type:'final', xp:110, msg:'Si alguna vez piensas en pedir un microcrédito, busca una alternativa. Cualquiera es mejor.' },
    ]},
  { id:157, icon:'🧯', title:'Seguros de Vida: Cuándo Sí, Cuándo No', desc:'El seguro que muchos tienen sin necesitar y otros necesitan sin tener.', xp:110, tag:'DEUDA', tagC:'orange', users:'11.300',
    steps:[
      { type:'content', tag:'📖 M158', title:'Qué seguro de vida necesitas',
        content:'<h3>Los dos tipos principales</h3><p><strong>Seguro de vida TEMPORAL (term life):</strong> pagas una prima anual baja durante un plazo fijo (10, 20, 30 años). Si mueres en ese plazo, tus beneficiarios cobran una suma. Si no mueres, el contrato expira sin retorno.</p><p><strong>Seguro de vida ENTERA (whole life):</strong> cobertura vitalicia. Prima mucho más alta. Suele incluir componente de ahorro/inversión.</p><h3>Regla experta</h3><p>El 95% de personas necesitan solo seguro temporal. Es 5-10 veces más barato y cumple la función real: proteger a dependientes mientras los construyas financieramente.</p><p>El seguro de vida entera suele ser un producto empaquetado caro vendido con comisiones altas. Solo tiene sentido en planificación patrimonial compleja (herencias grandes, optimización fiscal avanzada).</p>' },
      { type:'content', tag:'✅ M158', title:'Cuánto y cuándo contratarlo',
        content:'<h3>La fórmula del capital correcto</h3><p>Fórmula DIME (Debt + Income + Mortgage + Education):</p><ul><li><strong>D</strong>ebt: todas tus deudas actuales</li><li><strong>I</strong>ncome: 10 años de tu ingreso neto</li><li><strong>M</strong>ortgage: saldo pendiente de hipoteca</li><li><strong>E</strong>ducation: formación futura de hijos</li></ul><p>Ejemplo: €20.000 deudas + €24.000 × 10 = €240.000 + €120.000 hipoteca + €80.000 educación = <strong>€460.000 de capital asegurado</strong>.</p><h3>Cuándo NO lo necesitas</h3><ul><li>No tienes personas económicamente dependientes</li><li>Eres soltero sin hijos ni padres que dependan de tus ingresos</li><li>Ya tienes patrimonio suficiente para cubrir las necesidades de tus herederos (auto-aseguramiento)</li></ul><p>La prima típica de un seguro temporal 30 años para no fumador sano de 30 años: <strong>€200-€400 al año</strong> por €300.000 de capital. Muy asequible.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes 32 años, casado, 2 hijos, €150k hipoteca pendiente, ganas €2.500 netos/mes. ¿Qué seguro de vida necesitas?', opts:['No necesitas seguro','Seguro temporal 20-25 años por ~€400.000','Seguro de vida entera por €100.000','Solo uno muy básico'], ans:1, exp:'Perfil típico que necesita seguro temporal por un capital que cubra hipoteca + años de ingresos + educación hijos. Fórmula DIME da ~€400k.' },
      { type:'final', xp:110, msg:'Seguro de vida temporal: barato y efectivo. Evita los productos complicados con componente de ahorro.' },
    ]},
  { id:158, icon:'🪛', title:'Seguro de Hogar: Cobertura Óptima, Ni Más Ni Menos', desc:'Lo que realmente necesitas cubrir. Los extras que son marketing.', xp:100, tag:'DEUDA', tagC:'orange', users:'10.500',
    steps:[
      { type:'content', tag:'📖 M159', title:'Las tres coberturas esenciales',
        content:'<h3>Qué cubre un seguro de hogar típico</h3><p>Un seguro de hogar tiene tres patas:</p><p><strong>1. Continente:</strong> la estructura (paredes, suelos, instalaciones fijas). Si eres propietario, el banco suele exigirlo con la hipoteca.</p><p><strong>2. Contenido:</strong> tus pertenencias (muebles, electrodomésticos, ropa, joyas). Si alquilas, es lo único que aseguras.</p><p><strong>3. Responsabilidad civil:</strong> daños a terceros causados por tu vivienda (escape de agua que daña al vecino, por ejemplo). Es la cobertura más infravalorada.</p><h3>Cálculo correcto de capitales</h3><ul><li>Continente: valor de reconstrucción (NO el precio de mercado). Suele ser 60-70% del precio de compra.</li><li>Contenido: inventario real, no estimación rápida. Incluye electrónicos, muebles, ropa.</li><li>Responsabilidad civil: mínimo €150.000, ideal €300.000.</li></ul>' },
      { type:'content', tag:'💸 M159', title:'Los extras que NO necesitas',
        content:'<h3>Marketing en el seguro de hogar</h3><p>Coberturas frecuentes que suelen ser innecesarias:</p><ul><li><strong>Asistencia informática:</strong> 90% de problemas se solucionan con Google</li><li><strong>Servicio de manitas incluido:</strong> viene con coberturas muy limitadas, acabas pagando por encima</li><li><strong>Robo en el exterior:</strong> ya lo cubre tu seguro de responsabilidad civil o el comercial</li><li><strong>Todo riesgo accidental:</strong> cobertura muy amplia pero prima 2-3x más cara. Innecesaria salvo perfiles con niños pequeños o patrimonio muy alto</li><li><strong>Joyas de alto valor:</strong> cobertura específica por encima de un límite. Si no tienes joyas valiosas, ignóralo</li></ul><p>Estrategia óptima: contratar cobertura básica pero con capitales suficientes + responsabilidad civil alta. Suele salir por €200-350 al año.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué cobertura es la más importante y subestimada en un seguro de hogar?', opts:['Todo riesgo accidental','Responsabilidad civil','Asistencia informática','Joyas de alto valor'], ans:1, exp:'La RC cubre daños a terceros. Un escape de agua que afecta al vecino de abajo puede costar decenas de miles. La cobertura básica suele incluirla, pero revisa el capital.' },
      { type:'final', xp:100, msg:'Ajusta tu seguro de hogar: capital correcto, RC alta, sin extras innecesarios.' },
    ]},
  { id:159, icon:'🏥', title:'Seguro de Salud Privado vs Seguridad Social', desc:'Cuándo merece la pena pagar €60/mes extra cuando tienes sanidad pública gratuita.', xp:110, tag:'DEUDA', tagC:'orange', users:'14.200',
    steps:[
      { type:'content', tag:'📖 M160', title:'La realidad del sistema español',
        content:'<h3>Lo que da y lo que no la Seguridad Social</h3><p>La sanidad pública española está entre las mejores del mundo en <strong>cirugía mayor, urgencias vitales, oncología y cardiología</strong>. Es inigualable.</p><p>Limitaciones reales del sistema público:</p><ul><li>Listas de espera: pruebas diagnósticas no urgentes (3-12 meses)</li><li>Especialistas: consulta de traumatología, dermatología, ginecología (2-6 meses)</li><li>Pruebas de imagen no urgentes (resonancia, TAC): 2-8 meses</li><li>Elección de médico o centro limitada</li></ul><p>Un seguro privado típico soluciona todo esto pagando <strong>€40-€80/mes</strong> (persona joven sana).</p>' },
      { type:'content', tag:'⚖️ M160', title:'Cuándo sí, cuándo no',
        content:'<h3>Perfil donde TIENE sentido</h3><ul><li>Familias con niños pequeños (pediatras sin espera)</li><li>Embarazadas que quieren elegir hospital y obstetra</li><li>Personas con problemas crónicos menores recurrentes</li><li>Autónomos (deducible fiscalmente hasta €500/año por titular + familiar)</li><li>Perfiles con ansiedad ante listas de espera</li></ul><h3>Perfil donde NO tiene sentido</h3><ul><li>Joven sano soltero con trabajo estable y pocas visitas médicas</li><li>Si ya tienes seguro privado a través de la empresa (evita duplicar)</li><li>Si tu presupuesto es justo y puedes priorizar ese dinero a ahorro/inversión</li></ul><h3>Alternativa intermedia</h3><p>Seguros de "reembolso" (pagas consultas privadas, el seguro te devuelve el 80-90%): más baratos y flexibles. También cuadros médicos reducidos con primas muy bajas (€25-€40/mes).</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué perfil se beneficia más claramente de un seguro de salud privado?', opts:['Joven sano con trabajo estable','Pensionista que ya no trabaja','Familia con niños pequeños que necesita pediatras sin espera','Estudiante universitario'], ans:2, exp:'Familias con niños pequeños son el perfil más claro: pediatras accesibles sin cita previa y rápida solución a catarros, otitis, urgencias no vitales.' },
      { type:'final', xp:110, msg:'Evalúa honestamente: ¿cuántas veces has ido al médico este año? Si son pocas, el dinero quizás rinde más invertido.' },
    ]},
  { id:160, icon:'🚗', title:'Seguro de Coche: Tercero, Terceros Ampliado o Todo Riesgo', desc:'Las tres modalidades explicadas con ejemplos. Cómo elegir sin pagar de más.', xp:100, tag:'DEUDA', tagC:'orange', users:'12.800',
    steps:[
      { type:'content', tag:'📖 M161', title:'Las tres modalidades',
        content:'<h3>Qué cubre cada una</h3><p><strong>Terceros (obligatorio por ley):</strong> cubre daños que tú causas a otros vehículos, personas o cosas. NO cubre los daños a tu propio coche.</p><p>Prima típica: <strong>€250-€450/año</strong>.</p><p><strong>Terceros ampliado:</strong> todo lo anterior + lunas + incendio + robo + asistencia en viaje. Sigue sin cubrir daños propios por accidente.</p><p>Prima típica: <strong>€400-€650/año</strong>.</p><p><strong>Todo riesgo:</strong> cubre tus propios daños aunque seas tú el culpable. Con o sin franquicia.</p><p>Prima típica: <strong>€700-€1.500/año</strong> según coche y perfil.</p>' },
      { type:'content', tag:'🎯 M161', title:'La regla del valor del coche',
        content:'<h3>Regla experta: todo riesgo cuando el coche vale más de €10.000</h3><p>El coste del todo riesgo tiene sentido si el valor del coche supera los €8.000-€10.000. Por debajo, pagas una prima alta para cubrir un activo que igualmente deprecia rápido.</p><p><strong>Coche nuevo (0-4 años) &gt; €15.000:</strong> todo riesgo con franquicia baja (€300-€500)</p><p><strong>Coche 5-8 años, €8.000-€15.000:</strong> todo riesgo con franquicia alta (€600-€1.000) o terceros ampliado</p><p><strong>Coche &gt; 8 años o &lt; €8.000:</strong> terceros o terceros ampliado</p><h3>La franquicia inteligente</h3><p>Aumentar la franquicia de €300 a €600 suele bajar la prima anual un 15-25%. Si no tienes accidentes frecuentes, te compensa.</p><p><strong>Evita:</strong></p><ul><li>Todo riesgo en coches &gt;10 años: pagas más en prima que el valor real del coche</li><li>Renovar con misma aseguradora sin comparar: primas suben 8-15% cada año automáticamente</li></ul>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes un coche de 2015 que vale €6.000. ¿Qué modalidad es más razonable?', opts:['Todo riesgo con franquicia baja','Todo riesgo sin franquicia','Terceros o terceros ampliado','Sin seguro'], ans:2, exp:'Con coches de valor bajo, todo riesgo no compensa. La prima puede acercarse al valor real del coche en pocos años. Terceros ampliado es óptimo.' },
      { type:'final', xp:100, msg:'Compara seguros cada año al renovar. La fidelidad te cuesta dinero.' },
    ]},
  { id:161, icon:'🪝', title:'Responsabilidad Civil Personal: El Seguro que Nadie Conoce', desc:'Te proteges de demandas por daños accidentales. Prima ~€30/año, cobertura hasta €500.000.', xp:100, tag:'DEUDA', tagC:'orange', users:'8.400',
    steps:[
      { type:'content', tag:'📖 M162', title:'Qué es y por qué importa',
        content:'<h3>El seguro más asimétrico del mercado</h3><p>La <strong>Responsabilidad Civil Familiar o Personal</strong> cubre los daños que TÚ (o tu familia, perro, hijos) puedas causar accidentalmente a terceros en tu vida diaria.</p><p>Casos reales cubiertos:</p><ul><li>Tu hijo rompe el móvil de un compañero en el colegio</li><li>Tu perro muerde a alguien en el parque</li><li>Resbalas con un carrito en el supermercado y tiras a una persona</li><li>Se te cae una maceta del balcón y daña un coche aparcado</li><li>Practicas ciclismo y atropellas a un peatón</li></ul><p>Son casos que pueden generar indemnizaciones de €5.000 a €500.000. Sin cobertura, los pagas tú.</p>' },
      { type:'content', tag:'💡 M162', title:'Dónde y cuánto',
        content:'<h3>Cómo contratarlo</h3><p>Existen tres vías:</p><p><strong>1. Como complemento del seguro de hogar</strong> (lo más habitual). Ya viene incluido en casi todos los seguros de hogar con capital bajo (€60.000-€150.000). Eleva el capital a €300.000-€500.000 por un coste mínimo.</p><p><strong>2. Como seguro independiente.</strong> Primas desde <strong>€25-€60/año</strong> con coberturas de €300.000-€1.000.000. Insuperable relación prima/cobertura.</p><p><strong>3. Como complemento del seguro de coche o vida.</strong> Muchos aseguradoras lo ofrecen como añadido por pocos euros.</p><h3>Capitales recomendados</h3><ul><li>Mínimo: €300.000</li><li>Óptimo con familia: €500.000</li><li>Con hijos adolescentes o perros: €1.000.000</li></ul><p>En la era de las redes sociales y los juicios rápidos, este seguro es de los que más retorno dan en caso necesario.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿En cuál de estos casos te cubre la Responsabilidad Civil Personal?', opts:['Tu coche se avería','Te roban en casa','Tu hijo rompe el móvil de un compañero','Pierdes el trabajo'], ans:2, exp:'Daños accidentales a terceros causados por ti o tu familia. El móvil roto es un caso típico cubierto por la RC familiar.' },
      { type:'final', xp:100, msg:'Si no tienes RC personal o familiar, contrátala hoy. Por €30-€60/año es de los mejores seguros que puedes contratar.' },
    ]},
  { id:162, icon:'🪜', title:'Fondo de Emergencia vs Seguros: Cuál va Primero', desc:'La decisión de por dónde empezar. El orden correcto según los expertos.', xp:110, tag:'DEUDA', tagC:'orange', users:'9.700',
    steps:[
      { type:'content', tag:'📖 M163', title:'Las dos capas de protección',
        content:'<h3>El orden correcto</h3><p>Las finanzas personales tienen un orden lógico de protección ante imprevistos:</p><p><strong>Paso 1 — Fondo de emergencia (1.000€ mínimo):</strong> un colchón pequeño para emergencias menores (avería coche, electrodomésticos rotos, copago médico) sin recurrir a crédito.</p><p><strong>Paso 2 — Seguros obligatorios y críticos:</strong> coche (obligatorio), hogar (si propietario) y RC personal. Sin estos, un imprevisto grave te arruina aunque tengas ahorro.</p><p><strong>Paso 3 — Fondo de emergencia completo (3-6 meses de gastos):</strong> una vez protegido de catástrofes, amplías el colchón.</p><p><strong>Paso 4 — Seguros complementarios:</strong> vida (si tienes dependientes), salud privado (si las listas te afectan), invalidez.</p>' },
      { type:'content', tag:'💡 M163', title:'Por qué este orden',
        content:'<h3>La lógica estadística</h3><p>Los seguros cubren eventos de <strong>baja probabilidad pero alto impacto</strong> (accidente grave, incendio, muerte). El fondo de emergencia cubre eventos de <strong>alta probabilidad y bajo-medio impacto</strong> (reparación, gasto imprevisto).</p><p>Si solo tienes ahorros y no seguros: un evento catastrófico arrasa años de esfuerzo.</p><p>Si solo tienes seguros y no ahorros: pagas franquicias y copagos con tarjeta de crédito al 22%.</p><h3>Cómo distribuir €200 al mes al empezar</h3><p>Propuesta equilibrada para alguien sin ahorros ni seguros:</p><ul><li><strong>Primer mes:</strong> €100 al fondo inicial + €100 para contratar los seguros obligatorios anuales (prorrateo)</li><li><strong>Meses 2-3:</strong> €200 completar fondo inicial €1.000</li><li><strong>Meses 4-12:</strong> €200 a ampliar fondo hasta 3-6 meses de gastos</li><li><strong>Año 2:</strong> evaluar seguros complementarios según evolución familiar</li></ul>' },
      { type:'quiz', tag:'🧠 TEST', q:'Acabas de empezar tu vida laboral con €0 ahorros. ¿Qué priorizas primero?', opts:['Invertir en bolsa para aprovechar la juventud','Contratar 5 seguros para estar protegido','Fondo de emergencia pequeño (€1.000) + seguros obligatorios (coche, RC)','Pagar deudas al 5% con todo el ahorro'], ans:2, exp:'Primero un mínimo de €1.000 líquidos + seguros básicos obligatorios. Sin esto, cualquier imprevisto te endeuda a tipos altos.' },
      { type:'final', xp:110, msg:'Fondo de emergencia Y seguros. No es o uno o el otro — es ambos, en el orden correcto.' },
    ]},
  { id:163, icon:'🧲', title:'Refinanciación de Hipoteca: Cuándo y Cómo', desc:'El trámite que puede ahorrarte €30.000 en la vida útil de tu hipoteca.', xp:120, tag:'DEUDA', tagC:'orange', users:'11.900',
    steps:[
      { type:'content', tag:'📖 M164', title:'Cuándo tiene sentido refinanciar',
        content:'<h3>Las 4 situaciones claras</h3><p>Refinanciar tu hipoteca (subrogación a otro banco o novación con el mismo) tiene sentido si:</p><p><strong>1. Diferencial actual alto (&gt;1%):</strong> contratos antiguos con diferenciales de +2% o +3% sobre Euríbor. Hoy los nuevos están entre +0,5% y +1,2%.</p><p><strong>2. Cambio de variable a fija:</strong> si el Euríbor está bajo y proyectas que subirá, bloquear tipo fijo puede ahorrar mucho a largo plazo.</p><p><strong>3. Cambio de fija alta a variable o mixta:</strong> si firmaste al 4% fijo y ahora hay variables al 1,5% con Euríbor bajo, rebajas la cuota inmediatamente.</p><p><strong>4. Bajar plazo:</strong> si tu economía lo permite, acortar plazo reduce intereses totales pagados.</p>' },
      { type:'content', tag:'💰 M164', title:'Costes de refinanciar y cuándo compensa',
        content:'<h3>Los costes reales</h3><p>Refinanciar tiene costes. Ten en cuenta:</p><ul><li><strong>Tasación:</strong> €250-€500</li><li><strong>Notaría y registro:</strong> €500-€1.000</li><li><strong>Comisión por novación o subrogación:</strong> 0-1% del capital pendiente (negociable)</li><li><strong>Gestoría:</strong> €200-€400</li></ul><p>Total típico: <strong>€1.500-€2.500</strong>.</p><h3>Punto de equilibrio</h3><p>Calcula: ¿cuánto ahorras al mes con la nueva hipoteca? ¿Cuántos meses necesitas para recuperar los €2.000 de gastos?</p><p>Regla rápida: si la diferencia de tipo es &gt;0,8% o ahorras &gt;€100/mes, suele compensar en &lt;2 años. Recuperas los costes y el resto es ganancia neta.</p><h3>Proceso</h3><ol><li>Obtén ofertas de 3-4 bancos competidores con oferta vinculante</li><li>Lleva la mejor a tu banco actual y pide novación con esas condiciones</li><li>Si no iguala, subrogación al nuevo banco</li></ol>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tienes hipoteca al 3,5% fijo, quedan 15 años y €120.000. Bancos te ofrecen 2,1% fijo. ¿Compensa refinanciar?', opts:['No, fidelidad al banco primero','Sí, diferencia &gt;1%, ahorro claro a largo plazo','Depende del color del banco','No, los costes siempre superan el ahorro'], ans:1, exp:'Diferencia del 1,4% en €120.000 durante 15 años = ahorros de €15.000-€20.000 en intereses. Los costes de refinanciar (€2.000) se recuperan en 6-12 meses.' },
      { type:'final', xp:120, msg:'Revisa las condiciones de tu hipoteca cada 2-3 años. Una refinanciación puede valer decenas de miles.' },
    ]},
  { id:164, icon:'🔁', title:'Hipoteca Variable a Fija: Cuándo Cambiar', desc:'El análisis experto para decidir si bloqueas tu tipo o aguantas con Euríbor.', xp:110, tag:'DEUDA', tagC:'orange', users:'13.600',
    steps:[
      { type:'content', tag:'📖 M165', title:'La decisión más importante del hipotecado',
        content:'<h3>Variable vs fija: el dilema eterno</h3><p>Históricamente la variable ha sido más barata a largo plazo (Euríbor suele estar entre 0-2% la mayor parte del tiempo), pero con volatilidad.</p><p><strong>Variable:</strong></p><ul><li>Ventaja: cuotas más bajas cuando Euríbor está bajo</li><li>Desventaja: cuota puede subir 30-50% si Euríbor se dispara</li></ul><p><strong>Fija:</strong></p><ul><li>Ventaja: cuota inmutable toda la vida del préstamo</li><li>Desventaja: si los tipos bajan, pagas de más durante años</li></ul><p><strong>Mixta:</strong> fija los primeros años (5-10), variable después. Compromiso.</p>' },
      { type:'content', tag:'🎯 M165', title:'La regla experta para decidir',
        content:'<h3>Tres factores clave</h3><p><strong>1. Horizonte temporal:</strong> si te quedan más de 10 años de hipoteca, la fija protege contra ciclos largos de tipos altos.</p><p><strong>2. Estabilidad de ingresos:</strong> si tus ingresos son estables y justos, fija te da tranquilidad. Si tienes margen amplio, variable te permite aprovechar bajadas.</p><p><strong>3. Ciclo económico:</strong> cuando los tipos están en mínimos históricos (Euríbor &lt;1%), suele ser buen momento para fijar. Cuando están altos, la variable recupera ventaja matemática a largo plazo.</p><h3>Reglas prácticas</h3><ul><li>Si el fijo que te ofrecen es &lt;1,5% por encima del variable actual → fijo suele ganar</li><li>Si tu cuota fija sería &gt;40% de tus ingresos → considera alargar plazo antes que elegir tipo</li><li>Nunca fijes un tipo &gt; 3,5% en ciclos de tipos altos (el techo histórico medio es ~4%)</li></ul>' },
      { type:'quiz', tag:'🧠 TEST', q:'Euríbor al 2%, te ofrecen fijo al 2,8% o variable Euríbor+0,8%. Estás en año 2 de 25. ¿Qué tiene más sentido?', opts:['Variable siempre gana a largo plazo','Fijo al 2,8% bloquea un buen tipo sin volatilidad','Variable pero con techo','Depende solo del riesgo personal'], ans:1, exp:'Con 23 años por delante y tipos moderados, bloquear 2,8% fijo es razonable. Sin sustos y competitivo.' },
      { type:'final', xp:110, msg:'La mejor hipoteca es la que te deja dormir tranquilo, no la que optimiza al céntimo.' },
    ]},
  { id:165, icon:'📜', title:'Cláusulas Abusivas en Hipotecas', desc:'Suelo, IRPH, vencimiento anticipado. Las que el Tribunal Supremo ha tumbado y puedes reclamar.', xp:120, tag:'DEUDA', tagC:'orange', users:'10.600',
    steps:[
      { type:'content', tag:'📖 M166', title:'Las cláusulas más tumbadas por los tribunales',
        content:'<h3>Cláusula suelo</h3><p>Limitaba la bajada del Euríbor: aunque el índice estuviera en -0,5%, tú pagabas un mínimo del 3% o 4%. Declaradas nulas masivamente desde 2016 por falta de transparencia. Se pueden reclamar con retroactividad total.</p><h3>IRPH (Índice de Referencia de Préstamos Hipotecarios)</h3><p>Índice alternativo al Euríbor usado por algunos bancos entre 1999-2013. Siempre estuvo 1-2 puntos por encima del Euríbor. El Tribunal de Justicia de la UE lo declaró susceptible de ser abusivo en 2020.</p><h3>Vencimiento anticipado</h3><p>Permitía al banco exigir el pago total de la hipoteca con 1 solo impago. Tumbada en 2019: ahora se exige un mínimo de 12 impagos.</p><h3>Gastos hipotecarios</h3><p>Hasta 2018, muchos bancos cargaban al cliente notaría, registro, tasación y gestoría. El TS estableció que deben pagar el banco. Reclamable.</p>' },
      { type:'content', tag:'💼 M166', title:'Cómo reclamar',
        content:'<h3>Proceso paso a paso</h3><ol><li><strong>Consigue tu escritura hipotecaria</strong> — la firmada ante notario. Revísala con una asociación de consumidores (OCU, ADICAE) o abogado especializado.</li><li><strong>Reclamación extrajudicial al banco</strong> — por burofax, citando la cláusula específica y jurisprudencia. Tienes 2 meses de plazo para respuesta.</li><li><strong>Si no responde o deniega:</strong> demanda judicial. Los costes los asume el banco si ganas (muy frecuente).</li></ol><p><strong>Plazo de reclamación:</strong> desde que la cláusula se declara nula, puedes reclamar todo lo cobrado indebidamente desde la firma de la hipoteca (retroactividad total). Sin prescripción en cláusulas abusivas según jurisprudencia actual.</p><h3>Abogados "a éxito"</h3><p>Muchos despachos trabajan a éxito: cobran 20-30% de lo recuperado, solo si ganan. Sin coste si pierden. Útil para reclamaciones sencillas.</p><p><strong>Evita:</strong> plataformas que cobran €500-€2.000 por adelantado prometiendo éxito. La gran mayoría son legales pero caras — puedes conseguirlo gratis con una asociación de consumidores.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué cláusula hipotecaria permitía al banco ejecutar la vivienda con solo 1 impago?', opts:['Cláusula suelo','IRPH','Vencimiento anticipado','Gastos hipotecarios'], ans:2, exp:'Vencimiento anticipado. Tumbada en 2019 — ahora se exige mínimo 12 mensualidades impagadas.' },
      { type:'final', xp:120, msg:'Revisa tu escritura hipotecaria. Podría haber varios miles de euros por reclamar.' },
    ]},
  { id:166, icon:'🆘', title:'Ley de Segunda Oportunidad', desc:'El mecanismo legal para salir de deudas imposibles. La bancarrota personal española.', xp:120, tag:'DEUDA', tagC:'orange', users:'7.800',
    steps:[
      { type:'content', tag:'📖 M167', title:'Qué es y cómo funciona',
        content:'<h3>El reset legal de deudas</h3><p>Regulada desde 2015 (Ley 25/2015) y reformada en 2022, la <strong>Ley de Segunda Oportunidad</strong> permite a personas físicas cancelar total o parcialmente sus deudas cuando están en situación de insolvencia y han actuado de buena fe.</p><p><strong>Requisitos:</strong></p><ul><li>Persona física (no empresa)</li><li>Deudas no superiores a €5 millones</li><li>No haber sido condenado por delitos económicos</li><li>Haber intentado un acuerdo extrajudicial previo</li><li>Actuación de buena fe (no haber ocultado bienes, no haber generado las deudas con fraude)</li></ul><h3>Resultado del proceso</h3><p>Un juez puede declarar el <strong>BEPI (Beneficio de Exoneración del Pasivo Insatisfecho)</strong>: cancelación total o parcial de las deudas restantes tras liquidar tu patrimonio.</p><p>Deudas no exonerables: alimentos a hijos, multas penales, deudas de Seguridad Social (parcialmente) y Hacienda (parcialmente, limite €10.000 por acreedor).</p>' },
      { type:'content', tag:'⚖️ M167', title:'Cuándo considerarlo',
        content:'<h3>Perfil típico que accede</h3><ul><li>Emprendedores con empresa cerrada avalada personalmente</li><li>Personas con tarjetas revolving y microcréditos acumulados &gt;€30.000</li><li>Víctimas de avales familiares (avalaron a alguien que no pagó)</li><li>Divorciados con obligaciones que no pueden cumplir</li><li>Víctimas de enfermedad/accidente grave con gastos acumulados</li></ul><h3>Proceso abreviado</h3><ol><li><strong>Acuerdo extrajudicial de pagos:</strong> mediador negocia con acreedores durante 3 meses. Si hay acuerdo: plan de pagos. Si no: siguiente paso.</li><li><strong>Concurso consecutivo:</strong> se declara en juzgado, se liquida patrimonio (no vivienda habitual en la reforma 2022).</li><li><strong>Solicitud de BEPI:</strong> tras liquidación, juez valora y exonera deudas restantes.</li></ol><p><strong>Duración:</strong> 6 meses a 2 años.</p><p><strong>Coste:</strong> procurador + abogado + notaría. Total típico €1.500-€4.000 (hay justicia gratuita si reúnes requisitos económicos).</p><p><strong>Consecuencia:</strong> entras en ASNEF y CIRBE 5 años. Pero sales de deudas imposibles.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Qué tipo de deudas NO se pueden cancelar con la Ley de Segunda Oportunidad?', opts:['Deudas de tarjeta de crédito','Préstamos personales','Pensión de alimentos a hijos','Hipotecas'], ans:2, exp:'La pensión de alimentos a hijos no es exonerable. Es el único tipo de deuda personal que siempre se mantiene.' },
      { type:'final', xp:120, msg:'Si tus deudas superan lo que puedes pagar en 5 años, es hora de hablar con un abogado especializado.' },
    ]},
  { id:167, icon:'🪤', title:'Cobertura ante Invalidez Temporal', desc:'Qué cobras si una enfermedad o accidente te impide trabajar. Lo que nadie te explica.', xp:110, tag:'DEUDA', tagC:'orange', users:'8.300',
    steps:[
      { type:'content', tag:'📖 M168', title:'Lo que paga la Seguridad Social',
        content:'<h3>La baja laboral: los tres tramos</h3><p>Cuando una enfermedad común o accidente no laboral te impide trabajar (Incapacidad Temporal):</p><p><strong>Días 1-3:</strong> no cobras nada (salvo convenio colectivo mejor).</p><p><strong>Días 4-20:</strong> cobras el <strong>60% de tu base reguladora</strong>.</p><p><strong>Día 21 en adelante:</strong> cobras el <strong>75% de tu base reguladora</strong>, hasta un máximo de 12 meses (prorrogables a 18 y, excepcionalmente, 24).</p><p><strong>Accidente laboral o enfermedad profesional:</strong> desde el día siguiente, cobras el <strong>75%</strong>.</p><p>La <strong>base reguladora</strong> no es tu sueldo neto — es la base de cotización del mes anterior dividida entre 30. Suele ser bastante inferior a lo que cobras.</p>' },
      { type:'content', tag:'🛡️ M168', title:'Complementos privados: cuándo sí',
        content:'<h3>Los seguros de baja laboral</h3><p>Existen seguros privados que <strong>complementan</strong> la prestación pública, pagando una cantidad adicional fija o un porcentaje.</p><p><strong>Tipos:</strong></p><ul><li><strong>Subsidio diario:</strong> €20-€50 al día mientras estás de baja (tope 12-24 meses)</li><li><strong>Capital único:</strong> pago único si la baja supera X días (30, 60, 90)</li><li><strong>Seguro de invalidez permanente:</strong> pago único o renta si quedas incapacitado permanentemente</li></ul><p><strong>Prima típica:</strong> €20-€60 al mes según coberturas y edad.</p><h3>Perfiles donde TIENE sentido</h3><ul><li>Autónomos (la prestación pública de autónomos es menor)</li><li>Oficios de riesgo físico (construcción, transporte, manipulación)</li><li>Personas con hipoteca alta y sin ahorros</li><li>Trabajadores con sueldos variables altos (comerciales, freelance)</li></ul><p><strong>Evita</strong> los seguros de baja laboral para empleados con buena cobertura pública + fondo de emergencia de 6 meses. Son innecesarios.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Estás de baja por enfermedad común. ¿Cuánto cobras los primeros 3 días?', opts:['100% del sueldo','75% del sueldo','60% del sueldo','Nada (salvo convenio)'], ans:3, exp:'Los 3 primeros días no cobras nada salvo que tu convenio colectivo mejore la prestación. Es una de las cosas más desconocidas del sistema.' },
      { type:'final', xp:110, msg:'Calcula cuánto cobrarías realmente si te pones de baja. Si no cubre tus gastos, necesitas fondo de emergencia o seguro complementario.' },
    ]},
  { id:168, icon:'👔', title:'Planificación ante Desempleo', desc:'El checklist de supervivencia antes de que llegue. Y qué hacer si ya llegó.', xp:110, tag:'DEUDA', tagC:'orange', users:'11.700',
    steps:[
      { type:'content', tag:'📖 M169', title:'Lo que cobra un desempleado en España',
        content:'<h3>La prestación por desempleo</h3><p>Si has cotizado al menos 360 días en los últimos 6 años:</p><p><strong>Primeros 180 días:</strong> 70% de tu base reguladora media de los últimos 180 días cotizados.</p><p><strong>A partir del día 181:</strong> 60% de esa base.</p><p><strong>Duración:</strong> entre 4 meses (si cotizaste 360 días) y 24 meses (si cotizaste 2.160+ días).</p><p><strong>Topes:</strong></p><ul><li>Mínimo: ~€560/mes (soltero) — ~€750/mes (con 2 hijos)</li><li>Máximo: ~€1.225/mes (soltero) — ~€1.575/mes (con 2 hijos)</li></ul><p>Tras agotar la prestación contributiva, puedes acceder al <strong>subsidio por desempleo</strong>: ~€480/mes durante 6-30 meses según edad y responsabilidades familiares.</p>' },
      { type:'content', tag:'🧰 M169', title:'Plan de supervivencia',
        content:'<h3>Si aún trabajas: prepárate ahora</h3><ol><li><strong>Fondo de emergencia de 6 meses:</strong> mínimo absoluto para el perfil medio</li><li><strong>CV actualizado y LinkedIn activo:</strong> no esperes a necesitarlo</li><li><strong>Red de contactos profesional:</strong> 70% de los trabajos no se publican, se consiguen por contactos</li><li><strong>Plan B identificado:</strong> sectores alternativos donde tu experiencia encaja</li></ol><h3>Si acabas de ser despedido</h3><ol><li><strong>Solicita el paro en &lt;15 días hábiles</strong> desde la baja efectiva (si no, pierdes días de prestación)</li><li><strong>Revisa la carta de despido:</strong> si el despido es improcedente, puedes reclamar mayor indemnización</li><li><strong>Ajusta gastos variables al 40%:</strong> antes de tocar el fondo</li><li><strong>Aplica a 5-10 ofertas/semana</strong> desde el primer día</li><li><strong>Formación en paro:</strong> cursos subvencionados, Cupón SEPE hasta €1.500 para formación</li></ol><p><strong>Error típico:</strong> esperar 2-3 meses "descansando" antes de buscar trabajo. Cada mes sin buscar reduce un 10% la probabilidad de encontrar con salario similar.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Te despiden con 5 años cotizados. ¿Cuánto tiempo cobrarás paro aproximadamente?', opts:['3 meses','6 meses','12-18 meses','24 meses'], ans:2, exp:'Con 5 años cotizados (1.800 días), tendrás derecho a unos 18 meses de prestación contributiva. La fórmula es aproximadamente 1 mes de paro por cada 3 cotizados.' },
      { type:'final', xp:110, msg:'El mejor seguro contra el desempleo es un fondo de emergencia de 6 meses y una red profesional activa.' },
    ]},
  { id:169, icon:'💔', title:'Riesgo Financiero del Divorcio', desc:'La crisis vital que más patrimonios destruye. Preparación legal y financiera.', xp:110, tag:'DEUDA', tagC:'orange', users:'9.400',
    steps:[
      { type:'content', tag:'📖 M170', title:'El coste real de un divorcio',
        content:'<h3>Estadísticas que debes conocer</h3><p>Un divorcio reduce el patrimonio medio de cada ex-cónyuge en un <strong>45-60%</strong>, según estudios del Banco Central Europeo. Las razones:</p><ul><li>Duplicación inmediata de gastos (dos hogares, dos facturas)</li><li>Reparto de bienes por mitades (gananciales) o según aportaciones (separación)</li><li>Pensiones de alimentos y compensatoria</li><li>Costes legales: abogado + procurador + notaría = €2.000-€15.000</li></ul><p>Además del impacto emocional, es una crisis financiera que puede durar 10+ años en recuperarse.</p><h3>Regímenes económicos matrimoniales en España</h3><ul><li><strong>Gananciales</strong> (defecto en mayor parte del país): todo lo ganado durante el matrimonio se divide al 50%</li><li><strong>Separación de bienes</strong> (defecto en Cataluña, Baleares, Comunidad Valenciana): cada uno mantiene lo suyo</li><li><strong>Participación</strong>: intermedio. Casi no se usa</li></ul>' },
      { type:'content', tag:'🛡️ M170', title:'Preparación preventiva',
        content:'<h3>Antes del matrimonio: capitulaciones</h3><p>Las capitulaciones matrimoniales son un documento notarial que define el régimen económico del matrimonio. Se pueden firmar antes o durante el matrimonio.</p><p>Cuándo tiene sentido separación de bienes:</p><ul><li>Un cónyuge tiene patrimonio o empresa previa considerable</li><li>Un cónyuge es autónomo o emprendedor (el otro no responde con su patrimonio por deudas)</li><li>Hijos de relaciones previas que heredan parte del patrimonio</li><li>Diferencia grande de ingresos entre los dos</li></ul><h3>Durante el matrimonio</h3><ul><li>Mantén cuentas separadas + una común para gastos compartidos</li><li>Documenta aportaciones individuales importantes (herencias, ahorros previos)</li><li>No hagas avales cruzados para gastos personales del otro</li><li>Guarda escrituras de propiedades familiares y comprobantes</li></ul><h3>Si el divorcio es inevitable</h3><ol><li>Intenta <strong>mediación familiar</strong> primero: 10x más barata que divorcio contencioso</li><li>Divorcio de mutuo acuerdo si es posible: ~€800-€2.000 total</li><li>Si hay hijos menores: prioriza acuerdo sobre custodia antes que sobre dinero</li></ol>' },
      { type:'quiz', tag:'🧠 TEST', q:'Eres autónomo con negocio creciente. ¿Qué régimen matrimonial te protege más?', opts:['Gananciales, todo al 50%','Separación de bienes, cada uno responde de lo suyo','No importa, es igual','Solo el que proponga el notario'], ans:1, exp:'Separación de bienes protege al otro cónyuge de posibles deudas empresariales. En gananciales, el negocio y sus deudas entrarían en el patrimonio común.' },
      { type:'final', xp:110, msg:'El régimen matrimonial es la decisión financiera más importante de tu vida en pareja. Revísalo antes o en los primeros años.' },
    ]},
  { id:170, icon:'⚱️', title:'Herencia con Deudas: Aceptar o Renunciar', desc:'Heredar en España puede arruinarte si lo haces mal. La decisión correcta paso a paso.', xp:120, tag:'DEUDA', tagC:'orange', users:'10.100',
    steps:[
      { type:'content', tag:'📖 M171', title:'Las tres opciones al heredar',
        content:'<h3>Aceptar, renunciar o aceptar a beneficio de inventario</h3><p>Cuando alguien muere, sus herederos tienen 3 opciones en España:</p><p><strong>1. Aceptar (pura y simple):</strong> recibes todos los bienes pero también <strong>respondes de las deudas del fallecido con tu propio patrimonio</strong>. Si las deudas superan los bienes, pagas tú.</p><p><strong>2. Renunciar a la herencia:</strong> no recibes nada pero tampoco respondes de nada. Tu parte pasa al siguiente llamado (hijos, sobrinos, etc.). Es irrevocable.</p><p><strong>3. Aceptar a beneficio de inventario:</strong> la opción inteligente. Recibes los bienes pero solo respondes con ellos. Si las deudas superan los bienes, te quedas con lo que haya. Nunca pagas con tu propio patrimonio.</p><p>El problema: <strong>mucha gente acepta "pura y simple" sin saberlo</strong> — basta con coger algún bien sin formalizar nada.</p>' },
      { type:'content', tag:'🔍 M171', title:'Proceso correcto',
        content:'<h3>Pasos antes de tomar cualquier decisión</h3><ol><li><strong>NO toques nada de la herencia</strong> durante el proceso. Coger un mueble o retirar dinero de una cuenta puede considerarse aceptación tácita.</li><li><strong>Solicita en el Registro General de Actos de Última Voluntad</strong> si hay testamento.</li><li><strong>Inventario de bienes:</strong> qué tenía el fallecido (cuentas, inmuebles, coches, empresas, inversiones).</li><li><strong>Inventario de deudas:</strong> hipotecas, préstamos, tarjetas, deudas fiscales. Consulta CIRBE del fallecido.</li><li><strong>Compara:</strong> si bienes &gt; deudas → aceptar (puro o beneficio de inventario).</li><li>Si deudas &gt; bienes → renunciar o aceptar a beneficio de inventario.</li></ol><h3>Plazos</h3><ul><li>Tienes <strong>6 meses desde la muerte</strong> para declarar el Impuesto de Sucesiones (prorrogable otros 6 meses)</li><li>Puedes aceptar o renunciar sin plazo legal estricto, pero si alguien te reclama debes pronunciarte en 30 días</li></ul><p><strong>Aceptar a beneficio de inventario</strong>: es gratis y se hace ante notario. Cualquier heredero puede exigirlo. Es la opción segura casi siempre.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Tu padre fallece. No sabes si tenía deudas ocultas. ¿Qué opción elegir por defecto?', opts:['Aceptar pura y simple','Renunciar sin más','Aceptar a beneficio de inventario','Esperar 2 años'], ans:2, exp:'Aceptar a beneficio de inventario es la opción por defecto inteligente: recibes los bienes pero nunca respondes con patrimonio propio si aparecen deudas desconocidas.' },
      { type:'final', xp:120, msg:'Si heredas, actúa lento y con asesor. Una decisión precipitada puede costarte décadas.' },
    ]},
  { id:171, icon:'🏰', title:'Protección Patrimonial Básica', desc:'Las estructuras legales que separan tu patrimonio personal del profesional.', xp:120, tag:'DEUDA', tagC:'orange', users:'8.700',
    steps:[
      { type:'content', tag:'📖 M172', title:'Por qué proteger el patrimonio',
        content:'<h3>El principio: "todo responde de todo"</h3><p>En España, un particular responde con <strong>todo su patrimonio presente y futuro</strong> de cualquier deuda que contraiga (artículo 1911 del Código Civil). Un autónomo más todavía: su empresa y su patrimonio personal son lo mismo legalmente.</p><p>Esto significa:</p><ul><li>Si tu negocio quiebra: embargan tu vivienda habitual (salvo ciertos casos)</li><li>Si te demandan por RC y pierdes: embargan tus cuentas, coche, propiedades</li><li>Si debes a Hacienda: embargan tu nómina y cuentas</li></ul><h3>Las tres capas de protección</h3><p><strong>Capa 1:</strong> estructuras legales (SL, SLU, SCP)</p><p><strong>Capa 2:</strong> seguros (RC profesional y personal)</p><p><strong>Capa 3:</strong> diversificación y titularidad</p>' },
      { type:'content', tag:'🏛️ M172', title:'Estructuras legales básicas',
        content:'<h3>Sociedades limitadas (SL/SLU)</h3><p>Al crear una SL, el patrimonio empresarial queda separado del personal. Las deudas de la empresa no alcanzan a tu casa o ahorros (salvo avales personales firmados, que sí te exponen).</p><p><strong>Capital mínimo desde 2022:</strong> €1. Antes era €3.000. Ha democratizado la constitución de SL.</p><p><strong>Coste de constitución:</strong> €300-€800 entre notaría, registro y gestoría.</p><p><strong>Coste de mantenimiento:</strong> €1.500-€3.000/año (gestoría + impuesto sociedades + libros contables).</p><h3>Emprendedor de Responsabilidad Limitada (ERL)</h3><p>Alternativa para autónomos: registras tu vivienda habitual en el Registro Mercantil como "no embargable". La protege de deudas profesionales futuras (no anteriores, no de Hacienda, no de Seguridad Social). Coste: ~€100.</p><h3>Otras herramientas</h3><ul><li><strong>Titularidad en nombre del cónyuge</strong> (con separación de bienes): legítimo si no es fraude de acreedores</li><li><strong>Pactos sucesorios</strong> (en algunas CCAA): adelantan la herencia protegiendo del patrimonio del heredero futuro</li><li><strong>Seguros de vida</strong> con beneficiario nombrado: no entran en la herencia, se pagan directamente al beneficiario</li></ul>' },
      { type:'quiz', tag:'🧠 TEST', q:'Eres autónomo con riesgo de deudas empresariales. ¿Qué estructura te protege más el patrimonio personal?', opts:['Seguir como autónomo','Crear una SL/SLU','Declararte insolvente','Comprar un seguro de RC'], ans:1, exp:'Una SL separa legalmente el patrimonio empresarial del personal. Es la primera línea de protección patrimonial para cualquier autónomo con exposición real.' },
      { type:'final', xp:120, msg:'Si tienes patrimonio que proteger o negocio con riesgo, consulta un abogado sobre estructura legal. Vale la inversión.' },
    ]},
  { id:172, icon:'🎠', title:'Declaración de la Renta: Trucos que Ahorran Dinero', desc:'Las deducciones olvidadas y los errores caros. Cómo maximizar tu devolución legalmente.', xp:120, tag:'FISCALIDAD', tagC:'gold', users:'16.700',
    steps:[
      { type:'content', tag:'📖 M173', title:'Deducciones que olvidan el 70% de contribuyentes',
        content:'<h3>Autonómicas poco conocidas</h3><p>Las deducciones autonómicas varían por comunidad. Muchos contribuyentes desconocen las que les aplican:</p><ul><li><strong>Andalucía:</strong> deducción por familia numerosa, discapacidad, adquisición de vivienda en zonas despobladas, ayuda doméstica legalizada</li><li><strong>Madrid:</strong> nacimiento/adopción (€600-€1.500), acogimiento, cuidado de ascendientes</li><li><strong>Cataluña:</strong> alquiler de vivienda habitual para jóvenes, nacimiento, viudedad</li><li><strong>Valencia:</strong> alquiler vivienda habitual, conciliación familiar, familia monoparental</li></ul><h3>Deducciones estatales infrautilizadas</h3><ul><li><strong>Donativos a ONG:</strong> 80% de los primeros €150, 35% del resto. Llega al 40% si es donación habitual</li><li><strong>Planes de pensiones:</strong> hasta €1.500/año reduce base imponible (ahorro real 19-47% según tu tramo)</li><li><strong>Deducción por maternidad:</strong> €1.200/año por hijo menor de 3 años (y €1.000 adicional por guardería)</li><li><strong>Sindicatos y colegios profesionales:</strong> 100% de las cuotas (máximo €500)</li><li><strong>Alquiler anterior a 2015:</strong> sigue aplicándose si tenías contrato</li></ul>' },
      { type:'content', tag:'⚠️ M173', title:'Errores que pagan caros',
        content:'<h3>Lo que la mayoría hace mal</h3><p><strong>1. Aceptar el borrador sin revisar.</strong> Hacienda NO conoce todos tus gastos deducibles. El borrador parte de lo que ellos saben. Siempre revisa deducción por deducción.</p><p><strong>2. No declarar rentas en el extranjero.</strong> Si tienes dividendos de acciones USA, intereses de cuentas fuera o cuentas con &gt;€50.000 fuera de España, tienes obligación (Modelo 720). La sanción mínima es €10.000.</p><p><strong>3. Vender con plusvalía sin compensar minusvalías.</strong> Antes de vender en diciembre, revisa si tienes pérdidas latentes que puedan compensar.</p><p><strong>4. No aprovechar conjunto vs individual.</strong> Parejas casadas pueden elegir. Simula ambas: suele cambiar varios cientos de euros.</p><p><strong>5. Olvidar el IRPF de oposiciones.</strong> Los gastos en formación para oposición son deducibles si los justificas.</p><h3>Los plazos</h3><ul><li>Inicio: <strong>3 de abril</strong> (aprox.)</li><li>Fin voluntario: <strong>30 de junio</strong></li><li>Si sale a pagar: 2 plazos opcionales (60% junio, 40% noviembre)</li><li>Si sale a devolver: plazo hasta finales de año habitualmente</li></ul>' },
      { type:'quiz', tag:'🧠 TEST', q:'¿Cuál es la deducción estatal más infrautilizada por las familias con hijos pequeños?', opts:['Planes de pensiones','Deducción por maternidad de €1.200 + €1.000 por guardería','Donativos a ONG','Cuotas sindicales'], ans:1, exp:'Muchas madres no solicitan la deducción por maternidad de €1.200/año por hijo &lt;3 años + €1.000 por gastos de guardería. Son hasta €2.200 anuales.' },
      { type:'final', xp:120, msg:'Revisa tu declaración línea por línea. Las deducciones olvidadas pueden valer cientos o miles de euros al año.' },
    ]},
  { id:173, icon:'🎡', title:'Tributación de Criptomonedas en España', desc:'Lo que Hacienda ya sabe (todo) y cómo tributar bien. Evita problemas graves.', xp:120, tag:'FISCALIDAD', tagC:'gold', users:'13.400',
    steps:[
      { type:'content', tag:'📖 M174', title:'Las tres operaciones y cómo tributan',
        content:'<h3>Cada operación genera una obligación fiscal</h3><p><strong>1. Compra con euros → Hold:</strong> no genera tributación. Comprar Bitcoin y mantenerlo no tributa.</p><p><strong>2. Venta de cripto por euros:</strong> tributa como ganancia/pérdida patrimonial en el IRPF.</p><ul><li>Hasta €6.000 → 19%</li><li>€6.000-€50.000 → 21%</li><li>€50.000-€200.000 → 23%</li><li>&gt;€200.000 → 27-28%</li></ul><p><strong>3. Intercambio cripto por cripto (swap):</strong> ¡SÍ tributa aunque no pases por euros! Si cambias BTC por ETH, es una venta fiscal al precio de mercado en el momento. Muchos lo desconocen.</p><h3>Staking, lending y airdrops</h3><ul><li><strong>Staking rewards:</strong> tributan como rendimiento del capital mobiliario al mismo tramo que dividendos</li><li><strong>Airdrops:</strong> tributan como ganancia patrimonial al valor de mercado cuando los recibes</li><li><strong>DeFi lending:</strong> intereses tributan como rendimiento del capital mobiliario</li><li><strong>Mining:</strong> tributa como actividad económica (autónomo)</li></ul>' },
      { type:'content', tag:'🔍 M174', title:'Modelo 721 y declaración',
        content:'<h3>Hacienda YA sabe lo que tienes</h3><p>Desde 2023, todos los exchanges que operan en España (Binance, Coinbase, Kraken, Bit2Me) están obligados a reportar las operaciones de sus usuarios a Hacienda. La información incluye saldos, movimientos y titulares.</p><p>No declarar ya no es una opción viable.</p><h3>Modelo 721 (informativo)</h3><p>Obligatorio si tienes cripto en exchanges fuera de España por más de €50.000:</p><ul><li>Se presenta entre el 1 de enero y el 31 de marzo</li><li>Es informativo, no implica pagar</li><li>Sanción por no presentarlo: €10.000 mínimo</li></ul><h3>Método de cálculo: FIFO</h3><p>Hacienda aplica <strong>FIFO (First In, First Out)</strong>: cuando vendes, se considera que vendes primero las monedas que compraste primero.</p><p>Ejemplo: compraste 1 BTC a €10.000 en 2020 y otro a €50.000 en 2023. Si vendes 1 BTC hoy a €60.000:</p><ul><li>Ganancia declarable: €60.000 - €10.000 = €50.000 (el primero que compraste)</li><li>Tributas ~€10.500 de IRPF</li></ul><p>Llevar registro exhaustivo de TODAS las operaciones es obligatorio. Apps como CoinTracking, Kryptos o Koinly automatizan esto.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Cambias 1 BTC por 20 ETH sin pasar por euros. ¿Esto tributa en España?', opts:['No, solo tributa al vender a euros','Sí, es una venta fiscal al precio de mercado del momento','Solo si ganas más de €6.000','Solo en el exchange'], ans:1, exp:'Sí, cualquier swap cripto-cripto se considera venta fiscal al valor de mercado del momento. Es el error más frecuente y caro.' },
      { type:'final', xp:120, msg:'Si tienes cripto, lleva registro perfecto de operaciones. Hacienda ya lo sabe todo.' },
    ]},
  { id:174, icon:'🎢', title:'Optimización Fiscal para Inversores', desc:'Tax loss harvesting, FIFO, compensación de pérdidas. Técnicas que ahorran miles.', xp:130, tag:'FISCALIDAD', tagC:'gold', users:'11.200',
    steps:[
      { type:'content', tag:'📖 M175', title:'Compensación de ganancias y pérdidas',
        content:'<h3>Las reglas básicas de compensación</h3><p>En España, las ganancias y pérdidas patrimoniales se agrupan y compensan según estas reglas:</p><p><strong>1. Compensación horizontal dentro del ejercicio:</strong></p><ul><li>Ganancias y pérdidas patrimoniales se compensan entre sí</li><li>Rendimientos del capital mobiliario (dividendos, intereses) se compensan entre sí</li></ul><p><strong>2. Compensación cruzada (hasta 25%):</strong> si te quedan pérdidas patrimoniales tras compensar, puedes compensar hasta el 25% con rendimientos positivos del capital mobiliario (y viceversa).</p><p><strong>3. Traslado a años futuros:</strong> las pérdidas no compensadas se pueden aplicar los <strong>4 ejercicios siguientes</strong>.</p><h3>Tax loss harvesting: cosecha de pérdidas</h3><p>Técnica clave: vender posiciones con pérdida latente para "crystalizar" la pérdida fiscal y compensar ganancias.</p><p>Ejemplo: tienes €5.000 de plusvalía en un ETF y -€3.000 de minusvalía en otro. Si vendes ambos: tributas solo por €2.000 netos, ahorrando tributación de €570 (19% de €3.000).</p>' },
      { type:'content', tag:'⚠️ M175', title:'Las reglas anti-abuso y estrategias avanzadas',
        content:'<h3>Regla de los dos meses</h3><p>Hacienda impide vender con pérdida y recomprar el mismo activo en los <strong>2 meses siguientes</strong> (1 año si son valores cotizados en mercados no organizados). Si lo haces, la pérdida NO es deducible.</p><p><strong>Solución legal:</strong> vende el activo con pérdida y compra otro similar pero no idéntico. Por ejemplo, vender iShares Core S&P 500 y comprar Vanguard S&P 500 ETF. Son distintos productos aunque el subyacente sea el mismo índice.</p><h3>FIFO y orden de venta</h3><p>Cuando tienes varias compras del mismo activo, Hacienda aplica FIFO obligatoriamente: vendes primero las más antiguas. A veces las más antiguas tienen mayor plusvalía latente, lo que eleva tu factura fiscal.</p><p>Solución: considerar vender por "lotes" activos idénticos comprados en distintas fechas, guardando las más antiguas para cuando tengas pérdidas que compensar.</p><h3>Aportaciones a planes de pensiones</h3><p>Aporta hasta €1.500/año al cierre del ejercicio si ves que te quedan beneficios altos que bajar. Tu base imponible baja en €1.500 y tu IRPF ahorra entre 19-47% dependiendo de tu tramo.</p><h3>Diferimiento con fondos indexados</h3><p>Los fondos de inversión permiten <strong>traspasos entre fondos sin tributar</strong>. Los ETFs NO. Si vas a rotar cartera con frecuencia, prioriza fondos indexados sobre ETFs por este motivo puramente fiscal.</p>' },
      { type:'quiz', tag:'🧠 TEST', q:'Vendes un ETF con -€2.000 de pérdida y compras otro ETF similar (mismo índice, distinto emisor) a los 10 días. ¿Es deducible la pérdida?', opts:['No, aplica la regla de los 2 meses','Sí, porque el producto es distinto aunque el subyacente sea similar','Solo el 50%','Depende de Hacienda'], ans:1, exp:'La regla de los 2 meses aplica cuando recompras valores "homogéneos" (mismo ISIN o valores idénticos). Distintos ETFs del mismo índice son productos distintos: la pérdida es deducible.' },
      { type:'final', xp:130, msg:'Revisa tu cartera en diciembre. Tax loss harvesting bien ejecutado ahorra cientos de euros al año.' },
    ]},

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 175 — La Regla del 50/30/20: Presupuesto Sin Esfuerzo
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: 175, icon: '💶', title: 'La Regla del 50/30/20: Presupuesto Sin Esfuerzo',
    desc: 'El sistema de presupuesto más simple y efectivo para ordenar tus finanzas',
    xp: 25, tag: 'FUNDAMENTOS', tagC: '#00e5a0',
    steps: [

      {type:'content', title:'Cómo Funciona la Regla del 50/30/20',
        blocks:[
          {t:'text', h:'El sistema que usaba Elizabeth Warren',
            p:'La <strong>regla del 50/30/20</strong> fue popularizada por la senadora y profesora de Harvard Elizabeth Warren en su libro "All Your Worth". La idea es brutalmente simple: divides tu ingreso neto en tres bloques porcentuales fijos. Sin hojas de cálculo complicadas, sin apps de seguimiento obsesivo. Solo tres números que, si respetas, te garantizan un avance financiero real.'},
          {t:'text', h:'Los tres bloques con sueldo de 2.000€ netos',
            p:'Con un sueldo neto de <strong>2.000€/mes</strong> (sueldo medio en España en 2025): el <strong>50% son 1.000€</strong> para necesidades (alquiler, comida, suministros, transporte al trabajo, seguro médico), el <strong>30% son 600€</strong> para deseos (restaurantes, viajes, suscripciones, ropa no esencial), y el <strong>20% son 400€</strong> para ahorro e inversión. Esos 400€ al mes durante 20 años al 7% generan <strong>208.000€</strong>.'},
          {t:'stats', items:[
            {v:'50%', l:'Necesidades: alquiler, comida, luz, transporte, seguros obligatorios'},
            {v:'30%', l:'Deseos: ocio, restaurantes, viajes, Netflix, ropa no esencial'},
            {v:'20%', l:'Ahorro/inversión: fondo de emergencia, ETFs, plan de pensiones'},
          ]},
          {t:'hl', s:'', label:'QUÉ ES NECESIDAD VS DESEO',
            p:'Esta es la frontera más discutida de la regla. El <strong>alquiler es necesidad</strong>; el piso de 1.200€ cuando podrías vivir en uno de 800€ no lo es del todo. Netflix de 18€ es deseo. <strong>Internet es necesidad</strong> si trabajas desde casa. El gimnasio básico puede ser necesidad si es tu única actividad física. La regla no es rígida — es un marco. Lo que sí está claro: si tus necesidades superan el 50%, tienes un problema de gasto fijo que resolver.'},
        ]
      },

      {type:'quiz',
        q:'María cobra 2.400€ netos al mes. Según la regla 50/30/20, ¿cuánto debería destinar al ahorro e inversión cada mes?',
        opts:[
          {t:'€400 (20% de 2.000€)', ok:false},
          {t:'€480 (20% de 2.400€)', ok:true},
          {t:'€600 (30% de 2.000€)', ok:false},
          {t:'€240 (10% de 2.400€)', ok:false},
        ],
        ok:'¡Correcto! El 20% siempre se aplica sobre el ingreso neto real. 2.400 × 0,20 = 480€. Si María invierte esos 480€/mes al 7% durante 25 años, acumula 384.000€. El porcentaje es fijo, la base cambia con el sueldo.',
        bad:'La respuesta es 480€. La regla se aplica sobre el ingreso neto real de cada mes: 2.400 × 20% = 480€. Un error frecuente es aplicarla sobre un sueldo "redondo" diferente al real. Calcula siempre sobre lo que entra en tu cuenta.',
      },

      {type:'content', title:'Adaptar la Regla a Tu Situación Real',
        blocks:[
          {t:'text', h:'¿Qué pasa si tus necesidades superan el 50%?',
            p:'En ciudades como Madrid o Barcelona, el alquiler solo puede comerse el 40-50% del sueldo. Si estás en esa situación, la regla se ajusta: primero ataca los gastos fijos más caros (¿puedes cambiar de piso?, ¿de ciudad?), y mientras, preserva el porcentaje de ahorro aunque sea al 10%. <strong>Ahorrar el 10% es infinitamente mejor que no ahorrar nada</strong> esperando llegar al 20%.'},
          {t:'hl', s:'info', label:'💡 EL TRUCO DEL PAGO AUTOMÁTICO',
            p:'El día que cobras, programa una <strong>transferencia automática del 20%</strong> hacia una cuenta separada de ahorro/inversión. Así el dinero "desaparece" antes de que puedas gastarlo. Este sistema, llamado "págate a ti primero", elimina la fricción de decidir cada mes cuánto ahorrar. Lo que no ves, no lo gastas. Lo aplican el 87% de las personas con patrimonio neto positivo.'},
        ]
      },

      {type:'quiz',
        q:'Carlos tiene estas salidas mensuales: alquiler 700€, comida 300€, suministros 100€, gimnasio 40€, streaming 25€, salidas 200€, ropa 150€, ahorro 200€. Su sueldo neto es 1.800€. ¿Sigue la regla 50/30/20?',
        opts:[
          {t:'Sí, está perfectamente equilibrado', ok:false},
          {t:'No, el bloque de ahorro es insuficiente: debería ser 360€', ok:true},
          {t:'No, los deseos superan el 30% permitido', ok:false},
          {t:'No, las necesidades superan el 50%', ok:false},
        ],
        ok:'Exacto. El 20% de 1.800€ son 360€ de ahorro, pero Carlos solo ahorra 200€ (11%). Sus necesidades: 700+300+100 = 1.100€ (61%, por encima del 50%). Tiene dos problemas: gastos fijos altos Y ahorro insuficiente. Prioridad: reducir el gasto fijo.',
        bad:'El fallo está en el ahorro: 20% de 1.800€ = 360€, pero Carlos ahorra 200€. Además, sus necesidades (1.100€) suponen el 61% del sueldo, superando el límite del 50%. Para cumplir la regla necesita reducir gastos fijos o aumentar ingresos.',
      },

      {type:'final', xp:25, msg:'Ya tienes el sistema de presupuesto más poderoso y simple. Empieza calculando tus tres bloques este mes.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 176 — Euríbor: Por Qué Sube Tu Hipoteca
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: 176, icon: '🏤', title: 'Euríbor: Por Qué Sube Tu Hipoteca',
    desc: 'El índice que mueve millones de hipotecas en España y cómo afecta a la tuya',
    xp: 28, tag: 'VIVIENDA', tagC: '#34d399',
    steps: [

      {type:'content', title:'Qué Es el Euríbor y Quién Lo Controla',
        blocks:[
          {t:'text', h:'El termómetro del dinero en Europa',
            p:'El <strong>Euríbor (Euro Interbank Offered Rate)</strong> es el tipo de interés al que los grandes bancos europeos se prestan dinero entre sí a distintos plazos. El más relevante para hipotecas es el <strong>Euríbor a 12 meses</strong>. No lo fija el BCE directamente — lo publica el EMMI (European Money Markets Institute) cada día hábil calculando la media de las ofertas de los principales bancos de la eurozona.'},
          {t:'text', h:'La palanca del BCE: los tipos de interés oficiales',
            p:'El <strong>Banco Central Europeo (BCE)</strong> fija el "tipo de facilidad de depósito", que es el interés al que paga a los bancos por guardar dinero. Cuando el BCE sube tipos (como hizo entre 2022 y 2023, de 0% a 4,5%), prestar dinero entre bancos se encarece y el Euríbor sube en paralelo. Cuando baja tipos (como en 2024-2025, hasta el 2,5%), el Euríbor también cae. El Euríbor es básicamente la sombra de la política monetaria del BCE.'},
          {t:'stats', items:[
            {v:'0,00%', l:'Euríbor en enero 2022 — hipotecas baratas históricas'},
            {v:'4,16%', l:'Euríbor en octubre 2023 — máximo en 15 años'},
            {v:'~2,4%', l:'Euríbor aproximado en mayo 2025 — tras bajadas del BCE'},
          ]},
          {t:'hl', s:'', label:'CÓMO AFECTA A TU CUOTA MENSUAL',
            p:'Una <strong>hipoteca variable de 200.000€ a 25 años</strong> con diferencial de Euríbor + 0,89%: con Euríbor al 0% la cuota era ~840€/mes. Con Euríbor al 4,16%, la cuota subió a ~1.190€/mes — <strong>350€ más al mes, 4.200€ más al año</strong>. Con Euríbor al 2,4% la cuota es ~1.040€/mes. Cada punto porcentual del Euríbor mueve la cuota aproximadamente 90-100€/mes en una hipoteca de este tamaño.'},
        ]
      },

      {type:'quiz',
        q:'Tienes una hipoteca variable de 200.000€ a 25 años con Euríbor + 0,89%. En tu revisión anual el Euríbor ha subido de 2,40% a 3,40%. ¿Cuánto sube aproximadamente tu cuota mensual?',
        opts:[
          {t:'Unos 20-30€/mes más', ok:false},
          {t:'Unos 90-100€/mes más', ok:true},
          {t:'Unos 200€/mes más', ok:false},
          {t:'La cuota no cambia hasta que termina el plazo', ok:false},
        ],
        ok:'Correcto. En una hipoteca de 200.000€ a 25 años, cada punto porcentual de subida del Euríbor equivale a aproximadamente 90-100€/mes de incremento en la cuota. Subida de 1 punto: de ~1.040€ a ~1.130€/mes. Es un impacto real y acumulado que conviene tener previsto.',
        bad:'La respuesta es unos 90-100€ más al mes. Las hipotecas variables de este tamaño se mueven en esa horquilla por cada punto porcentual de cambio en el Euríbor. Subirá de aproximadamente 1.040€ a 1.130€/mes. La revisión anual aplica el nuevo Euríbor al capital pendiente restante.',
      },

      {type:'content', title:'Hipoteca Fija vs Variable: El Análisis Real',
        blocks:[
          {t:'text', h:'Cuándo conviene cada tipo',
            p:'La <strong>hipoteca fija</strong> te protege de subidas del Euríbor pero suele tener un tipo inicial más alto (en 2025, entre 2,8% y 3,5%). La <strong>hipoteca variable</strong> arranca más baja (Euríbor + 0,5-1%) pero asumes el riesgo de que el Euríbor suba. La clave es tu perfil: si no podrías pagar 300-400€ más al mes si el Euríbor volviera al 4%, la fija es la opción correcta aunque sea más cara en escenario base.'},
          {t:'hl', s:'info', label:'💡 LA REVISIÓN ANUAL: CÓMO LEERLA',
            p:'Cuando tu banco te manda la carta de revisión anual, el nuevo tipo se calcula como: <strong>Euríbor del mes de revisión + tu diferencial</strong>. Si tu diferencial es 0,89% y el Euríbor en tu mes de revisión está al 2,40%, tu nuevo tipo es 3,29% TIN. El banco aplica ese tipo al capital pendiente (no al original) y recalcula la cuota para los próximos 12 meses. Guarda la carta — tienes 30 días para negociar si no estás de acuerdo.'},
        ]
      },

      {type:'quiz',
        q:'El BCE baja sus tipos de interés del 3% al 2,5%. ¿Qué efecto cabe esperar en el Euríbor a 12 meses en las semanas siguientes?',
        opts:[
          {t:'El Euríbor sube porque los bancos piden más por prestarse dinero', ok:false},
          {t:'El Euríbor baja, porque el coste del dinero interbancario se abarata', ok:true},
          {t:'El Euríbor no cambia, solo lo mueve la inflación', ok:false},
          {t:'El Euríbor sube porque hay menos liquidez en el sistema', ok:false},
        ],
        ok:'Correcto. El Euríbor sigue de cerca las decisiones del BCE. Cuando el BCE baja tipos, los bancos pueden financiarse más barato y el tipo al que se prestan entre sí (Euríbor) también cae. No es instantáneo — suele tardar días o semanas en reflejarse — pero la dirección es siempre la misma.',
        bad:'Cuando el BCE baja tipos, el Euríbor baja. El BCE controla el precio del dinero en la economía: si bajar tipos abarata la financiación para los bancos, estos también se prestan entre sí más barato, y eso es exactamente lo que mide el Euríbor.',
      },

      {type:'final', xp:28, msg:'Ahora entiendes por qué sube o baja tu hipoteca y qué mirar en la carta de revisión anual.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 177 — Inflación: El Enemigo Silencioso
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: 177, icon: '🎈', title: 'Inflación: El Enemigo Silencioso',
    desc: 'Cómo el IPC destruye tu poder adquisitivo sin que lo notes, y qué hacer',
    xp: 25, tag: 'FUNDAMENTOS', tagC: '#00e5a0',
    steps: [

      {type:'content', title:'Qué Es la Inflación y Cómo la Mide el IPC',
        blocks:[
          {t:'text', h:'El precio de la cesta de la compra del Estado',
            p:'La <strong>inflación</strong> es la subida generalizada y sostenida del nivel de precios. El INE (Instituto Nacional de Estadística) la mide a través del <strong>IPC (Índice de Precios al Consumo)</strong>, que rastrea mensualmente el coste de una cesta de 479 productos y servicios que representa el gasto típico de un hogar español: comida, ropa, transporte, vivienda, ocio, salud. Cuando el IPC sube un 3%, esa cesta cuesta un 3% más que hace un año.'},
          {t:'text', h:'Los datos recientes en España',
            p:'España vivió una inflación del <strong>8,7% en 2022</strong> — la más alta en 40 años — impulsada por la energía y los alimentos tras la invasión de Ucrania. En 2023 bajó al 3,5% y en 2024 se estabilizó alrededor del 2,8%. El objetivo del BCE es mantener la inflación en torno al <strong>2% anual</strong>. Parece poco, pero a ese ritmo los precios se doblan en 36 años (Regla del 72: 72÷2=36).'},
          {t:'stats', items:[
            {v:'8,7%', l:'Inflación en España en 2022 — la más alta desde 1984'},
            {v:'2,8%', l:'Inflación media estimada en España en 2024'},
            {v:'36 años', l:'Tiempo para que los precios se dupliquen al 2% anual (R72)'},
          ]},
          {t:'hl', s:'warn', label:'EL COSTE REAL DE DEJAR DINERO EN CUENTA CORRIENTE',
            p:'Si tienes <strong>10.000€ en cuenta corriente al 0% de interés</strong> con una inflación del 3%, al cabo de un año tu dinero sigue siendo 10.000€ nominales — pero solo puede comprar lo equivalente a <strong>9.709€ de hoy</strong>. Pierdes 291€ de poder adquisitivo sin hacer nada, sin moverlo. En 10 años a ese ritmo, tu poder de compra habrá caído a <strong>7.374€</strong> (el 73% del valor original). El "no perder" en una cuenta sin interés es en realidad perder con certeza.'},
        ]
      },

      {type:'quiz',
        q:'Tienes 20.000€ en una cuenta corriente al 0% de interés. La inflación es del 3% anual. ¿Cuánto poder adquisitivo pierdes en términos reales durante ese año?',
        opts:[
          {t:'Cero, el dinero sigue siendo 20.000€', ok:false},
          {t:'Unos 600€ de poder adquisitivo real', ok:true},
          {t:'Unos 200€, porque la inflación solo afecta a los préstamos', ok:false},
          {t:'Unos 3.000€, porque pierdes el 15% en 5 años', ok:false},
        ],
        ok:'Correcto. 20.000 × 3% = 600€ de poder adquisitivo perdido ese año. Tu cuenta dice 20.000€ pero solo puedes comprar lo equivalente a 19.400€ del año anterior. Este es el coste silencioso e invisible de no invertir el dinero que no necesitas a corto plazo.',
        bad:'La respuesta es 600€. Con inflación del 3%: 20.000 × 0,03 = 600€ de pérdida de poder adquisitivo en un año. El dinero nominalmente sigue ahí, pero compra menos. Si esto se repite 10 años, pierdes el 26% del poder de compra total.',
      },

      {type:'content', title:'Cómo Proteger Tu Dinero de la Inflación',
        blocks:[
          {t:'text', h:'La tasa de interés real: el número que importa',
            p:'La <strong>tasa de interés real</strong> es la diferencia entre el rendimiento nominal de tu inversión y la inflación: si tu depósito paga el 3% TAE y la inflación es del 3%, tu tasa real es <strong>0%</strong> — no ganas ni pierdes poder adquisitivo. Solo cuando el rendimiento supera la inflación creces en términos reales. Un ETF global con rendimiento histórico del 7-8% anual, frente a inflación del 2-3%, ofrece una tasa real del 4-5%: eso sí es crecer.'},
          {t:'hl', s:'info', label:'💡 QUÉ ACTIVOS BATEN HISTÓRICAMENTE A LA INFLACIÓN',
            p:'Los activos que históricamente han superado la inflación en España: <strong>renta variable (acciones/ETFs)</strong> — 6-9% nominal histórico; <strong>inmuebles</strong> — 3-5% nominal en zonas urbanas; <strong>TIPS (bonos indexados a inflación)</strong> — rendimiento real garantizado positivo; <strong>depósitos bancarios</strong> — solo baten la inflación cuando los tipos de interés son altos. Las <strong>cuentas corrientes al 0%</strong> y el efectivo bajo el colchón son los únicos activos que garantizan perder contra la inflación.'},
        ]
      },

      {type:'quiz',
        q:'Un depósito bancario paga el 2,5% TAE. La inflación actual es del 3,2%. ¿Cuál es la tasa de interés real de ese depósito?',
        opts:[
          {t:'+2,5% real, porque el interés nominal es positivo', ok:false},
          {t:'-0,7% real, estás perdiendo poder adquisitivo', ok:true},
          {t:'+5,7% real (suma de ambas tasas)', ok:false},
          {t:'0% real, se neutralizan exactamente', ok:false},
        ],
        ok:'Correcto. Tasa real = tipo nominal − inflación = 2,5% − 3,2% = −0,7%. Aunque el depósito paga intereses positivos, no compensan la inflación. Tu dinero crece en términos nominales pero pierde poder de compra real. Es mejor que el 0%, pero sigue siendo insuficiente en un entorno de inflación alta.',
        bad:'La tasa real es 2,5% − 3,2% = −0,7%. Esto significa que aunque el depósito te paga intereses, la inflación los supera: cada año pierdes 0,7% de poder adquisitivo real. Para no perder contra la inflación, necesitas rendimientos superiores a ella.',
      },

      {type:'final', xp:25, msg:'La inflación es silenciosa pero medible. Ahora sabes calcular cuánto te cuesta no invertir.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 178 — Diversificación: No Pongas Todos los Huevos en la Misma Cesta
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: 178, icon: '🧺', title: 'Diversificación: No Pongas Todos los Huevos en la Misma Cesta',
    desc: 'La única estrategia gratuita para reducir riesgo sin sacrificar rentabilidad',
    xp: 30, tag: 'INVERSIÓN', tagC: '#60a5fa',
    steps: [

      {type:'content', title:'Por Qué Diversificar Reduce el Riesgo sin Coste',
        blocks:[
          {t:'text', h:'Correlación: el concepto que lo explica todo',
            p:'Dos activos con <strong>correlación +1</strong> se mueven exactamente igual: si uno cae un 10%, el otro también. Con <strong>correlación −1</strong>, cuando uno cae el otro sube. Con <strong>correlación 0</strong>, se mueven de forma independiente. Combinar activos con correlación baja o negativa reduce la volatilidad de la cartera sin reducir su rendimiento esperado — eso es exactamente lo que hace la diversificación. Harry Markowitz ganó el Nobel de Economía (1990) por demostrar esto matemáticamente.'},
          {t:'text', h:'Diversificación geográfica y por tipo de activo',
            p:'Meter todo en empresas españolas es apostar por el 0,7% de la economía mundial. Un <strong>ETF global MSCI World</strong> da exposición a más de 1.500 empresas de 23 países desarrollados en un solo producto. La <strong>diversificación por activos</strong> — combinar acciones con bonos, por ejemplo — reduce la volatilidad porque cuando la renta variable cae (crisis bursátil), los bonos de gobierno suelen subir porque los inversores buscan refugio.'},
          {t:'stats', items:[
            {v:'1.500+', l:'Empresas en un ETF MSCI World — en un solo producto'},
            {v:'−0,3', l:'Correlación histórica aproximada entre acciones y bonos soberanos'},
            {v:'0,7%', l:'Peso de España en la economía mundial — diversificar es imprescindible'},
          ]},
          {t:'hl', s:'', label:'EL PORTFOLIO 80/20: RENTABILIDAD CON AMORTIGUADOR',
            p:'Un portfolio clásico para inversor con horizonte largo es <strong>80% acciones globales (ETF MSCI World) + 20% bonos de gobierno (ETF Aggregate)</strong>. Históricamente (1970-2024): rendimiento anual ~8,5%, máxima caída en crisis del −35% (vs −55% en cartera 100% acciones). El bono no es para ganar más — es para poder aguantar las caídas sin vender en pánico. La diversificación es el único "free lunch" en finanzas.'},
        ]
      },

      {type:'quiz',
        q:'Tienes todo tu dinero invertido en acciones de Inditex. Un amigo te sugiere mover parte a un ETF MSCI World. ¿Qué ventaja concreta consigues?',
        opts:[
          {t:'Una rentabilidad garantizada más alta', ok:false},
          {t:'Menor riesgo específico de empresa sin reducir rentabilidad esperada', ok:true},
          {t:'Pagar menos impuestos al vender', ok:false},
          {t:'Mayor liquidez, ya que los ETFs son más fáciles de vender', ok:false},
        ],
        ok:'Correcto. Al diversificar eliminas el riesgo específico de empresa (que Inditex tenga un escándalo, que cambie la moda, que un competidor la destruya). Ese riesgo específico no te paga ninguna prima de rentabilidad extra — lo asumes gratis. Diversificar lo elimina sin coste en términos de rendimiento esperado.',
        bad:'La respuesta es menor riesgo específico sin reducir rentabilidad esperada. Concentrar en una empresa añade riesgo que el mercado no remunera. Si Inditex quiebra, pierdes todo. Si diversificas en 1.500 empresas, el fallo de una apenas te afecta. La rentabilidad esperada es similar, el riesgo mucho menor.',
      },

      {type:'content', title:'Cómo Diversificar en la Práctica con Poco Dinero',
        blocks:[
          {t:'text', h:'Un ETF global ya es diversificación real',
            p:'No necesitas comprar 30 acciones distintas para diversificar. Un único <strong>ETF indexado al MSCI World</strong> (como el iShares Core MSCI World o el Vanguard FTSE All-World) te da exposición a más de 1.500 empresas de todo el mundo con una comisión anual de 0,12-0,22%. Para una cartera completa, añadir un ETF de bonos y quizás un ETF de mercados emergentes (10-15%) es suficiente para la mayoría de inversores particulares.'},
          {t:'hl', s:'info', label:'💡 LA DIVERSIFICACIÓN QUE NO DIVERSIFICA',
            p:'Tener 5 fondos diferentes de grandes empresas europeas <strong>no diversifica</strong>: tienen correlación altísima y caen juntos en las mismas crisis. Diversificación real implica activos con comportamientos distintos: acciones de distintas geografías, bonos, quizás una pequeña posición en materias primas. También existe el <strong>sesgo doméstico</strong> (home bias): los españoles invierten demasiado en Ibex 35, que en crisis sectoriales locales sufre más. El mundo es más grande que España.'},
        ]
      },

      {type:'quiz',
        q:'Un inversor tiene: 40% en acciones españolas (Ibex 35), 40% en acciones europeas y 20% en bonos alemanes. ¿Cuál es el principal riesgo no diversificado de esta cartera?',
        opts:[
          {t:'Tiene demasiados bonos, debería ser solo acciones', ok:false},
          {t:'Concentración geográfica en Europa: falta exposición global (EE. UU., Asia, emergentes)', ok:true},
          {t:'Demasiada diversificación, complica la gestión innecesariamente', ok:false},
          {t:'Los bonos alemanes y las acciones españolas tienen correlación negativa, lo que destruye rentabilidad', ok:false},
        ],
        ok:'Correcto. Esta cartera tiene un fuerte sesgo europeo: Europa representa ~15% del PIB mundial. Si Europa entra en recesión severa, toda la parte de renta variable cae a la vez. La diversificación real requiere exposición a EE. UU. (60% del MSCI World), Asia y mercados emergentes. Un ETF MSCI World resolvería esto automáticamente.',
        bad:'El problema es la concentración geográfica en Europa. Si hubiera una crisis específicamente europea (y las hay: deuda soberana 2011-2012, crisis energética 2022), ambos bloques de renta variable caerían simultáneamente. Añadir un ETF global que incluya EE. UU. y Asia reduciría significativamente ese riesgo.',
      },

      {type:'final', xp:30, msg:'La diversificación es gratuita y reduce el riesgo real. Un ETF global es el punto de partida perfecto.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 179 — El Poder del DCA: Invierte sin Pensar en el Mercado
  ═══════════════════════════════════════════════════════════════════ */
  {
    id: 179, icon: '📆', title: 'El Poder del DCA: Invierte sin Pensar en el Mercado',
    desc: 'La estrategia que elimina el market timing y convierte la volatilidad en aliada',
    xp: 30, tag: 'INVERSIÓN', tagC: '#60a5fa',
    steps: [

      {type:'content', title:'Qué Es el DCA y Por Qué Funciona',
        blocks:[
          {t:'text', h:'Dollar Cost Averaging: la mecánica simple',
            p:'El <strong>DCA (Dollar Cost Averaging)</strong> o promediación del coste consiste en invertir una cantidad fija y periódica independientemente del precio del mercado. Inviertes 200€ cada mes el día 1, suba o baje la bolsa. Cuando el mercado está bajo, tus 200€ compran más participaciones. Cuando está alto, compran menos. El resultado a largo plazo es que el <strong>precio medio de compra</strong> de tus participaciones siempre es inferior al precio promedio del mercado en ese período.'},
          {t:'text', h:'Por qué elimina el problema del market timing',
            p:'El <strong>market timing</strong> —intentar comprar en mínimos y vender en máximos— es estadísticamente imposible de hacer de forma consistente, incluso para los profesionales. Estudios de Vanguard muestran que el inversor medio que intenta hacer timing obtiene entre <strong>1,5% y 2% anual menos</strong> que quien simplemente invierte de forma sistemática. El DCA elimina la ecuación emocional: no tienes que decidir si es buen momento porque siempre lo es.'},
          {t:'stats', items:[
            {v:'−1,5%', l:'Rentabilidad anual que pierde el inversor medio por intentar hacer timing (Vanguard)'},
            {v:'200€/mes', l:'Aportación mensual durante 10 años al 7%: resultado final ~34.600€'},
            {v:'24.000€', l:'Total aportado en 10 años (200€×12×10) — el resto son intereses compuestos'},
          ]},
          {t:'hl', s:'', label:'DCA vs INVERSIÓN DE GOLPE: ¿CUÁL GANA?',
            p:'Matemáticamente, si el mercado sube de forma continua, <strong>invertir todo de golpe (lump sum)</strong> gana al DCA porque más capital trabaja más tiempo. Vanguard analizó datos históricos y concluyó que lump sum bate al DCA en el <strong>67% de los casos</strong> con horizonte de 10 años. Pero el 33% restante (mercado lateral o bajista al principio) el DCA gana. La razón real para usar DCA no es matemática: es <strong>psicológica y práctica</strong>. La mayoría no tiene 24.000€ para invertir de golpe — los gana mes a mes.'},
        ]
      },

      {type:'quiz',
        q:'En enero inviertes 200€ en un ETF a 100€/participación (2 participaciones). En febrero el ETF cae a 80€ y vuelves a invertir 200€ (2,5 participaciones). En marzo sube a 120€ y vuelves a invertir 200€ (1,67 participaciones). ¿Cuál es tu precio medio de compra por participación?',
        opts:[
          {t:'100€ (precio del primer mes)', ok:false},
          {t:'Unos 95,2€ (precio medio ponderado real)', ok:true},
          {t:'100€ (media simple de 100+80+120÷3)', ok:false},
          {t:'80€ (el precio mínimo alcanzado)', ok:false},
        ],
        ok:'Correcto. Total invertido: 600€. Total participaciones: 2 + 2,5 + 1,67 = 6,17. Precio medio real: 600 ÷ 6,17 = 97,2€. Es inferior a la media aritmética de precios (100€). Cuando compraste en el mes barato (80€) adquiriste más participaciones, lo que arrastra el promedio hacia abajo. Esto es exactamente la ventaja del DCA.',
        bad:'El precio medio real es 600€ ÷ 6,17 participaciones = 97,2€. Menor que la media aritmética de precios (100€). Cuando el precio cae, tus 200€ fijos compran más unidades, lo que reduce el coste medio. Es la mecánica clave del DCA: compras más barato en promedio que el precio promedio del período.',
      },

      {type:'content', title:'Cómo Implementar el DCA en España',
        blocks:[
          {t:'text', h:'La automatización como clave del éxito',
            p:'El DCA funciona cuando se <strong>automatiza completamente</strong>. La mayoría de brokers españoles (MyInvestor, DEGIRO, Indexa Capital, inbestMe) permiten programar aportaciones periódicas automáticas a fondos indexados o ETFs. El día que decides hacerlo manual — "este mes espero que baje un poco" — has roto la estrategia y vuelves al market timing. La potencia del DCA viene de su automaticidad: no piensas, no dudas, no te emocionas.'},
          {t:'hl', s:'info', label:'💡 DCA DURANTE 10 AÑOS VS INVERSIÓN ÚNICA',
            p:'Escenario: <strong>200€/mes durante 10 años al 7% anual</strong> → resultado: ~34.600€ sobre 24.000€ aportados. Escenario alternativo: <strong>24.000€ invertidos de golpe</strong> al inicio al 7% → resultado: ~47.200€. La inversión única gana 12.600€ más en este escenario de mercado alcista. Pero si el mercado cae un 40% el primer año, la inversión única pierde 9.600€ de entrada; el DCA apenas lo nota porque sigue comprando barato. Para quien genera ingresos mensualmente, el DCA es la única opción real — y es excelente.'},
        ]
      },

      {type:'quiz',
        q:'Pedro tiene 12.000€ ahorrados y decide invertirlos en un ETF global durante 12 meses con DCA (1.000€/mes). Ana invierte sus 12.000€ de golpe en enero. El mercado cae un 30% en marzo y no se recupera hasta diciembre. ¿Quién tiene mejor resultado a final de año?',
        opts:[
          {t:'Ana, porque invirtió antes de la caída y se recuperó entera', ok:false},
          {t:'Pedro, porque el DCA le permitió comprar barato durante la caída', ok:true},
          {t:'Empatan, ya que ambos invierten el mismo capital total', ok:false},
          {t:'Depende de la fecha exacta de la recuperación', ok:false},
        ],
        ok:'Correcto. Ana invirtió los 12.000€ justo antes de una caída del 30% — en marzo valían 8.400€. Pedro siguió comprando durante la caída a precios baratos: sus participaciones de marzo a noviembre tienen un coste muy inferior al de Ana. Al recuperarse el mercado en diciembre, Pedro sale con mejor precio medio de compra y mayor rentabilidad.',
        bad:'Pedro sale mejor parado. Ana invirtió todo antes de la caída y sufrió el −30% sobre los 12.000€ completos. Pedro, al comprar de forma escalonada, adquirió la mayoría de sus participaciones a precios reducidos durante la caída. Al recuperarse el mercado, el precio medio de Pedro es inferior al de Ana, y su rentabilidad final mayor.',
      },

      {type:'final', xp:30, msg:'El DCA convierte la volatilidad en tu aliada. Automatiza una aportación mensual y deja que el tiempo haga el trabajo.'},
    ],
  },

  {
    id: 180, icon: '🧭', title: 'Fondos Indexados: La Estrategia que Bate al 90%',
    desc: 'Por qué el 90% de los gestores activos pierde contra el índice y cómo aprovecharlo',
    xp: 30, tag: 'INVERSIÓN', tagC: '#60a5fa',
    steps: [

      {type:'content', title:'Qué Es un Fondo Indexado y Por Qué Existe',
        blocks:[
          {t:'text', h:'Replicar el mercado en lugar de intentar batirlo',
            p:'Un <strong>fondo indexado</strong> es un fondo de inversión que replica automáticamente un índice bursátil — por ejemplo el S&P 500 (500 mayores empresas de EEUU), el MSCI World (1.600 empresas de 23 países desarrollados) o el IBEX 35. No hay un gestor eligiendo acciones: el fondo simplemente compra todas las empresas del índice en la misma proporción. El resultado es que obtienes exactamente la rentabilidad del mercado, menos una comisión mínima. La idea fue de <strong>John Bogle</strong>, fundador de Vanguard, en 1976. Hoy gestiona billones de euros.'},
          {t:'text', h:'El dato SPIVA: el 90% de los gestores pierde contra el índice',
            p:'El informe <strong>SPIVA (S&P Indices vs. Active) 2024</strong> analiza si los fondos activos baten a su índice de referencia. Resultado en España: el <strong>90,3% de los fondos de renta variable española activos</strong> obtuvieron peor rentabilidad que el IBEX en los últimos 10 años. A nivel global, el 92% de los fondos activos de renta variable estadounidense no batieron al S&P 500 en 15 años. No es que los gestores sean malos — es que <strong>las comisiones se comen la diferencia</strong> y el mercado es eficiente: no hay información que el gestor tenga que el mercado no descuente ya.'},
          {t:'stats', items:[
            {v:'90,3%', l:'Fondos activos españoles que no batieron al índice en 10 años (SPIVA 2024)'},
            {v:'0,07%', l:'TER (comisión anual) típico de un fondo indexado global en MyInvestor'},
            {v:'1,5%–2%', l:'TER medio de un fondo activo español — 20-30 veces más caro'},
          ]},
          {t:'hl', s:'', label:'LA DESTRUCCIÓN DE RIQUEZA DE LAS COMISIONES',
            p:'<strong>Ejemplo real a 20 años:</strong> inviertes 10.000€ al 7% anual. Con fondo indexado al <strong>0,07% de comisión</strong>: resultado final ~38.450€. Con fondo activo al <strong>1,5% de comisión</strong>: resultado final ~30.900€. <strong>Diferencia: 7.550€</strong> — el 75% de lo que invertiste al inicio, perdido solo en comisiones. Y eso asumiendo que el fondo activo iguala al índice, cuando la mayoría lo supera. Las comisiones son el mayor destructor silencioso de riqueza del inversor minorista.'},
        ]
      },

      {type:'quiz',
        q:'Inviertes 10.000€ a 20 años con una rentabilidad bruta del 7% anual. Fondo A: TER 0,07%. Fondo B: TER 1,5%. ¿Cuánto dinero pierdes aproximadamente con el Fondo B respecto al Fondo A?',
        opts:[
          {t:'Unos 1.430€ (la diferencia de comisiones acumuladas)', ok:false},
          {t:'Unos 7.550€ (efecto del interés compuesto sobre las comisiones)', ok:true},
          {t:'No pierdes nada si el fondo activo bate al mercado ese año', ok:false},
          {t:'Exactamente 1,43% × 10.000€ × 20 años = 2.860€', ok:false},
        ],
        ok:'Correcto. La diferencia no es lineal: el interés compuesto multiplica el impacto. Con TER 0,07% obtienes ~38.450€. Con TER 1,5% obtienes ~30.900€. La diferencia es ~7.550€ — mucho más que simplemente multiplicar la diferencia de comisión por años, porque las comisiones reducen el capital que genera intereses cada año.',
        bad:'El impacto real es ~7.550€, no la suma lineal de las comisiones. El interés compuesto actúa sobre el capital neto: cada año las comisiones del fondo activo reducen el capital base, y ese capital reducido genera menos intereses los años siguientes. Es el efecto compuesto funcionando en tu contra. Fondo indexado: ~38.450€. Fondo activo: ~30.900€.',
      },

      {type:'content', title:'Fondo Indexado vs ETF: La Diferencia Práctica',
        blocks:[
          {t:'text', h:'Dos formas de indexarse: misma filosofía, diferente mecánica',
            p:'Un <strong>ETF (Exchange Traded Fund)</strong> es también un fondo indexado, pero cotiza en bolsa como una acción: puedes comprarlo y venderlo en tiempo real durante el horario de mercado. Un <strong>fondo indexado tradicional</strong> se suscribe y reembolsa una vez al día al valor liquidativo de cierre. Para el inversor de largo plazo, la diferencia es irrelevante. La ventaja práctica del ETF es la comisión: los ETFs indexados (iShares, Vanguard, Amundi) tienen TERs de <strong>0,04% a 0,25%</strong>. En España los ETFs tributan igual que las acciones (no tienen el beneficio del traspaso sin peaje fiscal), por lo que para cuentas normales los fondos indexados suelen ser más eficientes fiscalmente.'},
          {t:'hl', s:'info', label:'💡 CÓMO EMPEZAR EN ESPAÑA: PLATAFORMAS RECOMENDADAS',
            p:'<strong>MyInvestor</strong>: broker español, fondos indexados de Vanguard, iShares y Amundi desde 1€. Fondo más popular: Vanguard Global Stock Index (MSCI World, TER 0,18%) o Amundi MSCI World (TER 0,12%). Sin comisión de custodia. <strong>Trade Republic</strong>: broker europeo, ETFs desde 1€ con planes de ahorro automáticos sin comisión. Ideal para ETFs. <strong>Indexa Capital</strong>: gestión automatizada de carteras indexadas desde 10.000€, perfecta si no quieres elegir. Evita los "fondos indexados" de tu banco de toda la vida — suelen tener TER entre 0,5% y 1%, que elimina parte de la ventaja.'},
        ]
      },

      {type:'quiz',
        q:'¿Cuál es la principal ventaja fiscal de los fondos indexados tradicionales frente a los ETFs para un inversor español con cuenta de valores normal?',
        opts:[
          {t:'Los fondos indexados tienen siempre comisiones más bajas que los ETFs', ok:false},
          {t:'Puedes traspasar entre fondos sin tributar por las plusvalías hasta que reembolsas', ok:true},
          {t:'Los ETFs no replican índices internacionales', ok:false},
          {t:'Los fondos indexados están garantizados por el Estado', ok:false},
        ],
        ok:'Correcto. En España, los fondos de inversión tradicionales (incluidos los indexados) tienen el "beneficio del traspaso": puedes mover dinero de un fondo a otro sin tributar por las plusvalías generadas hasta ese momento. Solo pagas impuestos cuando retiras el dinero. Los ETFs tributan como acciones: cada venta genera un hecho imponible. Para inversión a largo plazo con rebalanceos, los fondos indexados tradicionales son más eficientes fiscalmente.',
        bad:'La ventaja clave es fiscal. En España puedes traspasar dinero entre fondos de inversión sin pagar impuestos por las plusvalías — el "peaje fiscal" se difiere hasta el reembolso final. Con ETFs, cada venta tributa inmediatamente. Esto hace que los fondos indexados tradicionales sean más eficientes para estrategias de largo plazo con rebalanceos periódicos.',
      },

      {type:'final', xp:30, msg:'Ahora sabes por qué el 90% de los gestores pierde contra el índice y cómo acceder al mercado global con menos de 0,20% de comisión anual.'},
    ],
  },

  {
    id: 181, icon: '🛒', title: 'Psicología del Precio: Por Qué Compras Lo Que No Necesitas',
    desc: 'Los trucos cognitivos que usan las marcas para vaciar tu cartera sin que te des cuenta',
    xp: 28, tag: 'PSICOLOGÍA', tagC: '#c084fc',
    steps: [

      {type:'content', title:'Anchoring y El Precio Tachado: El Truco Más Viejo',
        blocks:[
          {t:'text', h:'El anclaje: tu cerebro se queda con el primer número',
            p:'El <strong>anchoring (efecto ancla)</strong> es uno de los sesgos cognitivos más poderosos en el consumo: cuando ves un precio, tu cerebro lo usa como referencia para evaluar si lo siguiente es caro o barato. El primer número que ves "ancla" tu percepción. Un vino de 50€ al lado de uno de 150€ parece barato. La misma camisa a 39,99€ al lado de otra a 89,99€ parece una ganga. <strong>La percepción de precio no es absoluta, es relativa al ancla</strong>. Los comercios lo saben y diseñan sus lineales, catálogos y páginas web para que veas el precio más caro primero.'},
          {t:'text', h:'El precio tachado: la mentira legal más extendida',
            p:'El <strong>precio tachado</strong> ("antes 99€, ahora 59€") activa el anchoring de forma brutal: tu cerebro calcula el ahorro imaginario (40€) en lugar del coste real (59€). El problema: en muchos casos el precio "original" nunca fue real o estuvo activo solo 1-2 días para poder tacharlo legalmente. En España la directiva europea 2019/2161 obliga a que el precio de referencia sea el precio más bajo de los últimos 30 días — pero las marcas lo cumplen subiendo el precio 30 días antes del Black Friday y luego "rebajándolo". El precio tachado <strong>no te dice nada sobre si algo es barato</strong>; solo manipula tu ancla mental.'},
          {t:'stats', items:[
            {v:'40%', l:'Aumento en conversión de ventas cuando se muestra precio "tachado" vs precio solo (estudio Nielsen)'},
            {v:'3×', l:'Las personas pagan hasta 3 veces más si el ancla inicial es alta (estudio Ariely, MIT)'},
            {v:'30 días', l:'Período mínimo legal que debe llevar el precio de referencia para poder tacharlo en España'},
          ]},
          {t:'hl', s:'', label:'FOMO DEL CONSUMIDOR: LA URGENCIA FABRICADA',
            p:'El <strong>FOMO (Fear Of Missing Out)</strong> aplicado al consumo explota tu aversión a la pérdida: "solo quedan 3 unidades", "oferta termina en 02:47:13", "10 personas están mirando esto ahora". Amazon, Booking y Zalando son maestros de esta técnica. El contador regresivo te hace sentir que si no compras ahora, perderás algo. En muchos casos el contador se reinicia o el stock "limitado" se repone al instante. <strong>La urgencia real es casi siempre fabricada</strong>. Una regla simple: si necesitas decidir en menos de 10 minutos, la decisión probablemente no deberías tomarla.'},
        ]
      },

      {type:'quiz',
        q:'Entras a una tienda online. Ves una chaqueta con precio original 120€ tachado, ahora a 72€. Debajo, otra chaqueta similar a 65€ sin descuento. ¿Cuál es el efecto cognitivo que te hace percibir la chaqueta de 72€ como mejor opción, aunque sea más cara?',
        opts:[
          {t:'Efecto halo: asumes que la chaqueta cara es de mejor calidad', ok:false},
          {t:'Anchoring: el precio tachado de 120€ ancla tu referencia y 72€ parece barato', ok:true},
          {t:'Aversión al riesgo: la chaqueta sin descuento parece más arriesgada', ok:false},
          {t:'Disonancia cognitiva: te resistes a comprar la más barata por orgullo', ok:false},
        ],
        ok:'Correcto. El anchoring hace que tu cerebro procese 72€ como "28€ más barato que 120€" en lugar de "7€ más caro que 65€". La referencia mental cambia de la alternativa real (65€) al precio tachado fabricado (120€). El resultado: pagas 10% más creyendo que ahorras. Este mecanismo es el núcleo del precio tachado y lo usan todas las plataformas de e-commerce.',
        bad:'Es anchoring. El precio tachado (120€) se convierte en tu ancla mental. En lugar de comparar las dos chaquetas entre sí (72€ vs 65€), tu cerebro calcula el "ahorro" respecto al ancla: 120€ − 72€ = 48€ ahorrados. Eso distorsiona completamente tu percepción. La chaqueta de 72€ es en realidad un 10% más cara que la alternativa sin manipulación.',
      },

      {type:'content', title:'Mental Accounting: Cómo Tu Cerebro Crea Cuentas Falsas',
        blocks:[
          {t:'text', h:'El dinero no es fungible para tu cerebro',
            p:'La <strong>contabilidad mental (mental accounting)</strong>, concepto del Nobel Richard Thaler, describe cómo las personas asignan el dinero a "cuentas" mentales separadas que no se comunican entre sí. El dinero de la nómina lo tratas con cuidado. El dinero de un regalo o de una devolución de Hacienda lo gastas con más alegría, aunque valen igual. El dinero en una tarjeta de regalo lo gastas más fácil que el efectivo. <strong>El dinero siempre vale lo mismo independientemente de su origen o formato</strong>, pero tu cerebro no lo trata así. Las empresas explotan este sesgo: las tarjetas regalo, los puntos de fidelización y el cashback crean "cuentas mentales" separadas para hacerte gastar más.'},
          {t:'hl', s:'info', label:'💡 LA REGLA DE LOS 10 MINUTOS Y EL COSTE POR USO',
            p:'Dos técnicas para contrarrestar los sesgos de precio. <strong>Regla de los 10 minutos</strong>: ante una compra no planificada, espera 10 minutos antes de decidir. El 60% de las compras impulsivas desaparecen en ese tiempo (estudio Journal of Consumer Research 2022). <strong>Coste por uso</strong>: en lugar de pensar en el precio total, calcula cuánto costará cada vez que lo uses. Un abrigo de 200€ que uses 100 veces = 2€ por uso. Una prenda de 30€ que uses 3 veces = 10€ por uso. La "ganga" muchas veces es lo que más caro sale por uso. Esta perspectiva rompe el anchoring y el efecto precio tachado.'},
        ]
      },

      {type:'quiz',
        q:'Recibes 500€ de devolución de la declaración de la renta. Dos semanas después tienes un gasto de fontanería imprevisto de 500€. Según la contabilidad mental, ¿cómo reaccionará la mayoría de personas?',
        opts:[
          {t:'Con indiferencia: 500€ de gasto equivale exactamente a los 500€ recibidos', ok:false},
          {t:'Con más dolor por el gasto de lo que sintieron placer por el ingreso', ok:true},
          {t:'Sin dolor porque mentalmente ya "tenían" esos 500€ extra disponibles', ok:false},
          {t:'Con placer porque el balance neto es cero y no han perdido nada', ok:false},
        ],
        ok:'Correcto. La aversión a la pérdida (Kahneman y Tversky) dice que perder 500€ duele aproximadamente el doble de lo que alegra ganarlos. Aunque el balance neto es cero, el gasto inesperado de fontanería genera mucho más malestar que el placer de la devolución. La mayoría también mantiene "cuentas separadas": el dinero de Hacienda ya lo habían mentalmente gastado en otra cosa, así que la fontanería se siente como una pérdida pura.',
        bad:'La mayoría sentirá más dolor por el gasto que placer por el ingreso. Es la aversión a la pérdida: perder pesa psicológicamente unas 2 veces más que ganar la misma cantidad. Además, la contabilidad mental ya había "asignado" el dinero de Hacienda a una cuenta mental concreta, así que la fontanería se siente como un gasto adicional, no como compensación.',
      },

      {type:'final', xp:28, msg:'Conocer estos sesgos no los elimina, pero sí los debilita. La próxima vez que veas un precio tachado, pregúntate: ¿cuánto cuesta realmente comparado con la alternativa?'},
    ],
  },

  {
    id: 182, icon: '📒', title: 'Autónomos: Cuánto Pagar de Impuestos Realmente',
    desc: 'El sistema de cotización por ingresos reales, el modelo 130 y los gastos que sí puedes deducir',
    xp: 32, tag: 'FISCALIDAD', tagC: '#fbbf24',
    steps: [

      {type:'content', title:'Cotización por Ingresos Reales: El Sistema Desde 2023',
        blocks:[
          {t:'text', h:'El nuevo sistema de 15 tramos desde enero 2023',
            p:'Desde el 1 de enero de 2023, los autónomos en España cotizan a la Seguridad Social en función de sus <strong>ingresos netos reales</strong> (rendimientos netos previstos), no por una cuota fija elegida libremente. Hay <strong>15 tramos</strong>: desde la cuota mínima de <strong>200€/mes</strong> para rendimientos netos inferiores a 670€/mes, hasta <strong>590€/mes</strong> para rendimientos netos superiores a 6.000€/mes. En 2025 la base mínima es 653,59€/mes y la cuota mínima resultante ronda los 200€/mes. Debes declarar una previsión de ingresos al inicio del año y regularizar al cierre. Si declaras de más, te devuelven; si declaras de menos, pagas la diferencia.'},
          {t:'text', h:'Cómo calcular el rendimiento neto para elegir tramo',
            p:'El <strong>rendimiento neto</strong> para elegir el tramo de cotización se calcula como: <strong>Ingresos − Gastos deducibles − 7% de deducción por gastos de difícil justificación</strong> (para autónomos en estimación directa simplificada). Ejemplo: autónomo con 30.000€ de ingresos anuales, 8.000€ de gastos deducibles reales. Rendimiento bruto: 22.000€. Menos 7%: 22.000€ × 0,93 = 20.460€ anuales = 1.705€/mes. Ese dato determina tu tramo de cotización. En 2025 para ese nivel la cuota ronda los <strong>294€/mes</strong>.'},
          {t:'stats', items:[
            {v:'200€', l:'Cuota mínima mensual autónomos 2025 (tramo 1, ingresos netos <670€/mes)'},
            {v:'294€', l:'Cuota aproximada para rendimiento neto de 1.700€/mes (tramo 7-8)'},
            {v:'590€', l:'Cuota máxima 2025 (tramo 15, rendimientos netos >6.000€/mes)'},
          ]},
          {t:'hl', s:'', label:'GASTOS DEDUCIBLES REALES QUE MUCHOS AUTÓNOMOS NO APLICAN',
            p:'Gastos deducibles en estimación directa simplificada (con factura): <strong>cuota de autónomos</strong> (íntegra), <strong>alquiler de oficina o despacho</strong>, <strong>suministros si trabajas desde casa</strong> (30% de la parte proporcional de la vivienda afecta), <strong>material de oficina</strong>, <strong>servicios de gestoría/asesoría</strong>, <strong>formación relacionada con la actividad</strong>, <strong>gastos de marketing y publicidad</strong>, <strong>vehículo</strong> (solo si está afecto al 100% a la actividad y puedes justificarlo), <strong>dietas</strong> (hasta 26,67€/día en España, 48,08€ en extranjero, con justificación). El gasto deducible reduce tu base imponible de IRPF y también tu rendimiento neto para el cálculo de la cuota de autónomos.'},
        ]
      },

      {type:'quiz',
        q:'Eres autónomo en estimación directa simplificada. En el primer trimestre tienes: ingresos 4.000€, gastos deducibles 1.000€. ¿Cuánto debes pagar en el modelo 130 de IRPF de ese trimestre?',
        opts:[
          {t:'400€ (20% sobre los ingresos brutos de 4.000€)', ok:false},
          {t:'750€ (25% sobre los ingresos brutos)', ok:false},
          {t:'300€ (20% sobre el rendimiento neto de 3.000€)', ok:true},
          {t:'Nada, el modelo 130 solo se paga si superas 10.000€ trimestrales', ok:false},
        ],
        ok:'Correcto. El modelo 130 (pago fraccionado de IRPF) se calcula como el 20% del rendimiento neto del trimestre: Ingresos (4.000€) − Gastos deducibles (1.000€) = Rendimiento neto 3.000€. El 20% de 3.000€ = 600€. Pero puedes restar las retenciones de facturas emitidas con IRPF y las cuotas de autónomos pagadas. Si tienes 0€ retenido y cuota de autónomos 300€: 600€ − 300€ = 300€ a pagar. La respuesta más limpia sin retenciones y descontando la cuota es 300€.',
        bad:'El modelo 130 aplica el 20% sobre el rendimiento neto trimestral (ingresos menos gastos deducibles), no sobre los ingresos brutos. Rendimiento neto: 4.000€ − 1.000€ = 3.000€. El 20% es 600€. A eso se restan las retenciones ya practicadas en tus facturas y la cuota de autónomos del trimestre (~300€ en este caso), resultando aproximadamente 300€ a pagar.',
      },

      {type:'content', title:'La Declaración de la Renta del Autónomo: Lo Que Cambia',
        blocks:[
          {t:'text', h:'IRPF anual: los pagos fraccionados a cuenta',
            p:'Los modelos 130 que pagas cada trimestre son <strong>pagos a cuenta del IRPF anual</strong>. En la declaración de la renta (modelo 100, abril-junio del año siguiente), calculas tu IRPF total del año y restas lo ya pagado con los 4 modelos 130. Si pagaste de más, te devuelven. Si pagaste de menos, pagas la diferencia. Los autónomos también tienen que presentar el <strong>modelo 303</strong> de IVA trimestralmente (IVA repercutido menos IVA soportado) y el modelo 390 anual de resumen de IVA. La gestoría media en España cobra entre <strong>80€ y 150€/mes</strong> por llevar todo esto — suele ser el gasto más rentable que puede hacer un autónomo.'},
          {t:'hl', s:'info', label:'💡 LA TARIFA PLANA Y BONIFICACIONES 2025',
            p:'Si te das de alta como autónomo por primera vez (o si no has sido autónomo los últimos 2 años), tienes derecho a la <strong>tarifa plana de 80€/mes durante los primeros 12 meses</strong>, independientemente de tus ingresos. Algunos ayuntamientos y comunidades autónomas añaden bonificaciones adicionales. En el segundo año la cuota sube progresivamente. Importante: la tarifa plana no exime de presentar el modelo 130 ni el 303 — solo reduce la cuota de Seguridad Social. Tampoco se aplica si ya disfrutaste de ella en el alta anterior.'},
        ]
      },

      {type:'quiz',
        q:'Un autónomo cobra a sus clientes sin retención de IRPF en las facturas. ¿Qué consecuencia tiene esto en su modelo 130 trimestral?',
        opts:[
          {t:'No tiene que presentar el modelo 130 si no tiene retenciones', ok:false},
          {t:'Paga el 20% completo del rendimiento neto sin poder restar retenciones previas', ok:true},
          {t:'Puede aplazar el pago de IRPF hasta la declaración anual', ok:false},
          {t:'La Agencia Tributaria le aplica un recargo automático del 5%', ok:false},
        ],
        ok:'Correcto. Las retenciones de IRPF en facturas son anticipos que tus clientes ingresan directamente a Hacienda por ti. Si no las aplicas (muchos autónomos que trabajan con particulares no pueden), no hay nada que restar en el modelo 130 y pagas el 20% del rendimiento neto íntegro cada trimestre. La desventaja es que el pago de tesorería es mayor. La ventaja: cobras el importe íntegro de tus facturas sin que el cliente te retenga nada.',
        bad:'Sin retenciones en facturas, el modelo 130 recoge el 20% del rendimiento neto sin poder restar anticipos ya ingresados. Sí es obligatorio presentarlo (salvo que el 70% de tus ingresos ya lleven retención). La obligación de presentar el modelo 130 existe independientemente de si tienes retenciones o no; la diferencia es solo cuánto sale a pagar.',
      },

      {type:'final', xp:32, msg:'Entender tu fiscalidad como autónomo es dinero directo en tu bolsillo. Cada euro deducible que no aplicas es un euro que regalas a Hacienda innecesariamente.'},
    ],
  },

  {
    id: 183, icon: '🏯', title: 'Bonos del Estado: La Inversión Conservadora',
    desc: 'Letras, bonos y obligaciones del Tesoro español: cómo funcionan, qué rentabilidad ofrecen y cómo comprarlos',
    xp: 27, tag: 'INVERSIÓN', tagC: '#60a5fa',
    steps: [

      {type:'content', title:'Letras, Bonos y Obligaciones: Las Tres Formas de Prestar al Estado',
        blocks:[
          {t:'text', h:'La deuda pública como instrumento de inversión',
            p:'Cuando el Estado necesita financiación emite <strong>deuda pública</strong>: tú prestas dinero al Estado y él te devuelve el capital más un interés pactado. Hay tres tipos según el plazo: <strong>Letras del Tesoro</strong> (3, 6, 9 o 12 meses) — son al descuento: compras por menos del nominal y recibes el nominal al vencer; <strong>Bonos del Estado</strong> (2 y 5 años) — pagan un cupón anual fijo y devuelven el nominal al vencimiento; <strong>Obligaciones del Estado</strong> (10, 15, 30 y 50 años) — igual que los bonos pero a más largo plazo. En todos los casos el emisor es el <strong>Tesoro Público español</strong> y el riesgo de impago es prácticamente nulo para los plazos cortos (las agencias de rating califican a España con Baa1/A− en 2025).'},
          {t:'text', h:'Rentabilidades actuales en 2025',
            p:'Tras el ciclo de subidas del BCE de 2022-2023 y las bajadas de 2024-2025, las rentabilidades de la deuda española en mayo de 2025 son: <strong>Letras a 12 meses: ~2,7-2,9%</strong> TAE; <strong>Bonos a 5 años: ~2,9-3,1%</strong>; <strong>Obligaciones a 10 años: ~3,2-3,4%</strong>. Son rentabilidades reales netas mejores que la cuenta corriente media española (que paga ~0,1-0,5%) y comparables a los mejores depósitos, pero con la ventaja de poder venderse en el mercado secundario antes del vencimiento. Punto importante: la rentabilidad de la deuda pública <strong>tributa como rendimiento del capital mobiliario</strong> al tipo de la base del ahorro (19%-28% en función del tramo).'},
          {t:'stats', items:[
            {v:'~2,8%', l:'Rentabilidad aproximada Letra del Tesoro a 12 meses (mayo 2025)'},
            {v:'~3,3%', l:'Rentabilidad aproximada Obligación del Estado a 10 años (mayo 2025)'},
            {v:'1.000€', l:'Nominal mínimo para suscribir deuda pública en tesoro.es (subasta competitiva)'},
          ]},
          {t:'hl', s:'', label:'CÓMO COMPRAR EN TESORO.ES: EL PROCESO PASO A PASO',
            p:'Puedes comprar deuda pública directamente sin intermediarios en <strong>tesoro.es</strong> (cuenta directa del Tesoro, sin comisiones) o a través de tu banco o broker (con comisiones de 0,1%-0,5%). En tesoro.es: necesitas certificado digital o Cl@ve; accedes a "Cuenta directa en el Tesoro"; seleccionas el tipo (Letra, Bono, Obligación), el importe y el tipo de orden (no competitiva = aceptas el precio de la subasta, recomendado para particulares). El dinero se carga en tu cuenta bancaria el día de la subasta y al vencimiento recibes el nominal más intereses directamente en tu cuenta. <strong>Comisión del Tesoro: 0€</strong>.'},
        ]
      },

      {type:'quiz',
        q:'Tienes un bono del Estado al 3% con vencimiento en 5 años. Los tipos de interés suben significativamente. ¿Qué ocurre con el precio de mercado de tu bono si necesitas venderlo antes del vencimiento?',
        opts:[
          {t:'El precio sube porque los tipos más altos atraen más compradores', ok:false},
          {t:'El precio baja porque los nuevos bonos emitidos ofrecen más rentabilidad', ok:true},
          {t:'El precio no cambia porque el cupón está fijo en contrato', ok:false},
          {t:'El precio sube porque el Estado garantiza el nominal más los intereses', ok:false},
        ],
        ok:'Correcto. La relación precio/rentabilidad de los bonos es inversa: cuando los tipos suben, se emiten nuevos bonos con cupones más altos. Tu bono al 3% es menos atractivo que los nuevos al 4%, así que su precio en el mercado secundario baja hasta que la rentabilidad efectiva se iguala con la de los nuevos emisiones. Si lo mantienes hasta vencimiento no te afecta — cobras el cupón pactado y el nominal. El riesgo de tipos solo se materializa si vendes antes del vencimiento.',
        bad:'Relación inversa: cuando los tipos suben, los bonos existentes de cupón fijo bajan de precio en el mercado secundario. Un bono al 3% no puede competir con los nuevos al 4% a igual precio, así que su precio cae hasta que la rentabilidad efectiva se equipara. Si lo mantienes hasta vencimiento, cobras exactamente lo pactado. El riesgo de tipos de interés en bonos solo se realiza si vendes antes del vencimiento.',
      },

      {type:'content', title:'Deuda Pública vs Depósitos vs Fondos Monetarios',
        blocks:[
          {t:'text', h:'Tres opciones conservadoras para el dinero que no quieres en bolsa',
            p:'Para capital que necesitas conservar con rentabilidad moderada tienes tres opciones principales en 2025: <strong>Letras del Tesoro</strong> (~2,8% TAE, 0 comisiones vía tesoro.es, plazo fijo hasta vencimiento, tributa al cobrar); <strong>Depósitos bancarios</strong> (0,5%-3,5% TAE según banco, cubiertos por el FGD hasta 100.000€ por banco y titular, liquidez limitada al vencimiento); <strong>Fondos monetarios</strong> (0,5%-3% neto tras comisiones, liquidez diaria, ventaja del traspaso sin peaje fiscal entre fondos). Para importes superiores a 100.000€ el Tesoro es preferible al depósito porque no hay límite de cobertura — el Estado español respalda íntegro el nominal.'},
          {t:'hl', s:'info', label:'💡 EL RIESGO REAL DE LAS LETRAS DEL TESORO',
            p:'Las Letras del Tesoro son consideradas <strong>activos libres de riesgo de crédito</strong> en el contexto europeo: la probabilidad de que España no devuelva una letra a 12 meses es prácticamente cero. Sin embargo, tienen dos riesgos menores que conviene conocer: <strong>Riesgo de tipos</strong> (si vendes antes del vencimiento y los tipos han subido, el precio de mercado puede ser inferior al precio de compra); <strong>Riesgo de reinversión</strong> (cuando vence la letra, si los tipos han bajado, la siguiente letra te pagará menos). Para los plazos cortos (3-12 meses) y manteniéndolas hasta vencimiento, la rentabilidad está prácticamente garantizada. Son la mejor opción para el fondo de emergencia que genera algo de rentabilidad.'},
        ]
      },

      {type:'quiz',
        q:'Compras una Letra del Tesoro a 12 meses con un nominal de 10.000€ por 9.730€ (al descuento). ¿Cuál es la rentabilidad bruta aproximada y cuánto pagas de impuestos si tu tramo de ahorro es el 19%?',
        opts:[
          {t:'Rentabilidad 2,7%; impuestos: ~51,3€', ok:true},
          {t:'Rentabilidad 2,7%; no tributa porque la ganancia es inferior a 1.000€', ok:false},
          {t:'Rentabilidad 10%; impuestos: 190€', ok:false},
          {t:'Rentabilidad 2,7%; impuestos: 270€ porque tributa sobre el nominal', ok:false},
        ],
        ok:'Correcto. Ganancia bruta: 10.000€ − 9.730€ = 270€. Rentabilidad: 270÷9.730 = 2,77% TAE aproximado. Impuesto al 19%: 270€ × 0,19 = 51,3€. Rentabilidad neta: 270€ − 51,3€ = 218,7€ sobre 9.730€ invertidos = 2,25% neto. Las letras al descuento tributan por la diferencia entre precio de compra y nominal recibido, como rendimiento del capital mobiliario en la base del ahorro.',
        bad:'Ganancia: 10.000 − 9.730 = 270€. Rentabilidad bruta: 270÷9.730 ≈ 2,77%. Impuestos al 19%: 270 × 0,19 = 51,3€. La letra tributa por la diferencia entre lo pagado y el nominal recibido, como rendimiento del capital mobiliario en la declaración de la renta. No hay exención por ser pública ni por ser inferior a ningún umbral. La rentabilidad neta resultante es aproximadamente el 2,25%.',
      },

      {type:'final', xp:27, msg:'Ahora puedes comprar Letras del Tesoro en tesoro.es sin pagar comisiones y entiendes por qué los tipos de interés y el precio de los bonos siempre se mueven en direcciones opuestas.'},
    ],
  },

  {
    id: 184, icon: '🔒', title: 'Seguros: Los Que Necesitas y Los Que Son un Engaño',
    desc: 'Distingue los seguros imprescindibles de los que solo enriquecen a las aseguradoras',
    xp: 28, tag: 'AVANZADO', tagC: '#f87171',
    steps: [

      {type:'content', title:'Los Seguros Imprescindibles: Cuándo Sí Merece la Pena',
        blocks:[
          {t:'text', h:'La regla básica del seguro: cúbrete contra lo que no podrías absorber',
            p:'Un seguro solo tiene sentido cuando el evento cubierto tendría un <strong>impacto financiero catastrófico</strong> que no podrías asumir con tu patrimonio actual. La prima (lo que pagas) siempre es estadísticamente superior al valor esperado del siniestro — si no, las aseguradoras no ganarían dinero. El seguro no es un mecanismo de ahorro ni de inversión; es una <strong>transferencia de riesgo</strong>. Por tanto, solo debes asegurar lo que, si ocurriera, te dejaría en una situación financiera irreversible. Bajo esa lógica, los seguros verdaderamente imprescindibles son pocos.'},
          {t:'text', h:'Los tres seguros que sí tienen sentido',
            p:'<strong>1. Seguro de vida (si tienes dependientes):</strong> Si tienes hijos menores o personas que dependen económicamente de ti y tú falleces, necesitan un capital para sostenerse. Un seguro de vida temporal (no unit-linked, no ahorro) para un adulto sano de 35 años cuesta entre <strong>15-30€/mes</strong> para un capital de 200.000€. Si no tienes dependientes o tienes suficiente patrimonio para cubrirlos, no necesitas seguro de vida. <strong>2. Seguro de hogar:</strong> obligatorio si tienes hipoteca (la entidad lo exige), muy recomendable si tienes propiedades. Cubre daños estructurales y de contenido. Precio medio: 200-400€/año. <strong>3. Seguro de salud si eres autónomo:</strong> deducible íntegramente (hasta 500€/persona/año tú, cónyuge e hijos), cubre la asistencia privada rápida y compensa si no puedes permitirte esperas de la sanidad pública.'},
          {t:'stats', items:[
            {v:'15-30€', l:'Coste mensual de un seguro de vida temporal 200.000€ para persona sana de 35 años'},
            {v:'500€', l:'Deducción máxima en IRPF del seguro de salud para autónomos (por persona cubierta, 2025)'},
            {v:'73%', l:'De los seguros de protección de pagos reclamados que no se cobran por las exclusiones (Organización de Consumidores OCU)'},
          ]},
          {t:'hl', s:'', label:'LA REGLA DEL AUTOSEGURO',
            p:'El <strong>autoseguro</strong> consiste en reservar tú mismo el dinero que pagarías de prima para cubrir eventos de bajo coste. Si un electrodoméstico que vale 500€ tiene una garantía extendida de 80€/año, en 6 años habrás pagado 480€ — casi el valor del aparato. En cambio, si apartas 80€ al mes en un fondo de emergencia, en 6 meses tienes 480€ disponibles para cualquier imprevisto. El autoseguro es superior en cualquier evento cuyo coste <strong>podrías absorber sin cambiar tu estilo de vida</strong>. La frontera habitual: eventos por debajo de 2.000-3.000€ son candidatos al autoseguro; por encima, vale la pena analizar un seguro.'},
        ]
      },

      {type:'quiz',
        q:'¿En cuál de estas situaciones es el seguro de vida IMPRESCINDIBLE desde una perspectiva financiera racional?',
        opts:[
          {t:'Persona soltera de 28 años sin hijos, con 15.000€ de ahorros y sin deudas', ok:false},
          {t:'Pareja con dos hijos menores, hipoteca de 180.000€ y un solo salario de 2.000€/mes', ok:true},
          {t:'Jubilado de 70 años con pensión de 1.400€/mes y piso en propiedad sin cargas', ok:false},
          {t:'Autónomo sin hijos que quiere dejar herencia a sus padres mayores', ok:false},
        ],
        ok:'Correcto. El seguro de vida es imprescindible cuando hay dependientes que no podrían sobrevivir financieramente sin tus ingresos. Una pareja con dos hijos menores, una hipoteca de 180.000€ y un solo salario es el caso paradigmático: si el sustentador fallece, la familia no puede pagar la hipoteca ni los gastos corrientes. El capital del seguro de vida (por ejemplo 250.000€) cubre la hipoteca y da margen a la familia para reorganizarse. En los demás casos no hay dependientes o hay patrimonio suficiente.',
        bad:'El caso que justifica el seguro de vida es cuando tienes dependientes que no podrían subsistir económicamente sin tus ingresos. La pareja con dos hijos, hipoteca y un solo salario es el caso más claro. La persona soltera sin hijos no tiene a quién proteger. El jubilado ya no tiene la hipoteca y tiene pensión propia. El autónomo sin hijos puede cubrir a sus padres con otros mecanismos si lo desea. El seguro de vida cubre incapacidad financiera de los dependientes, no la tristeza de los herederos.',
      },

      {type:'content', title:'Los Seguros Trampa: Dónde Te Quitan el Dinero',
        blocks:[
          {t:'text', h:'Los seguros que casi nunca deberías contratar',
            p:'<strong>Garantía extendida</strong> en electrodomésticos y electrónica: márgenes de beneficio del 50-80% para el vendedor, exclusiones que cubren la mayoría de averías reales (daño por caída, líquidos, mal uso). La OCU recomienda sistemáticamente rechazarla. <strong>Seguro de protección de pagos o "seguro de crédito"</strong>: vinculado a hipotecas, préstamos o tarjetas, cubre las cuotas si te quedas en paro o incapacitado. Las exclusiones suelen dejar fuera la mayoría de situaciones reales (autónomos excluidos, período de carencia de 3-6 meses, desempleo voluntario excluido). Precio: 0,5%-1% del capital anual. Mejor alternativa: fondo de emergencia de 6 meses. <strong>Seguro de vida "de ahorro" o unit-linked</strong>: no es un seguro real, es un producto de inversión disfrazado con comisiones altísimas. Siempre es peor que un fondo indexado + un seguro de vida por separado.'},
          {t:'hl', s:'info', label:'💡 CÓMO REVISAR TU CARTERA DE SEGUROS AHORA',
            p:'Haz este ejercicio: lista todos tus seguros actuales y su coste anual. Para cada uno pregúntate: <strong>(1) ¿Qué evento exacto cubre?</strong> (2) ¿Podría absorber ese coste yo mismo con mis ahorros actuales? (3) ¿He leído las exclusiones? Si la respuesta al punto 2 es sí o al punto 3 es no, tienes un candidato a cancelar o al menos a revisar. El ahorro medio detectado por la OCU en sus análisis es de <strong>400-600€/año</strong> para una familia media que revisa su cartera de seguros eliminando los superfluos y renegociando los necesarios con otras aseguradoras. Compara precios en comparadores como Acierto, Rastreator o Kelisto antes de renovar cualquier seguro.'},
        ]
      },

      {type:'quiz',
        q:'Compras un ordenador de 900€. El vendedor te ofrece una garantía extendida de 3 años por 120€. ¿Cuál es la alternativa más racional desde el punto de vista del autoseguro?',
        opts:[
          {t:'Aceptar la garantía porque el ordenador es caro y puede romperse', ok:false},
          {t:'Rechazarla y apartar 120€ en tu fondo de emergencia para imprevistos tecnológicos', ok:true},
          {t:'Aceptarla solo si el vendedor es de confianza', ok:false},
          {t:'Pedir descuento sobre el precio del ordenador a cambio de contratar la garantía', ok:false},
        ],
        ok:'Correcto. La garantía extendida tiene márgenes de hasta el 80% para el vendedor: de esos 120€, quizá 24€ se destinan a cubrir siniestros reales. Si apartas 120€ en tu fondo de emergencia, tienes ese capital disponible para cualquier avería (no solo del ordenador) sin exclusiones ni burocracia. Además, la garantía legal de 3 años ya cubre defectos de fabricación. El autoseguro es superior para cualquier evento cuyo coste puedas absorber.',
        bad:'El autoseguro es superior aquí. Los 120€ en tu fondo de emergencia cubren cualquier avería sin exclusiones, mientras que la garantía extendida excluye daño por caída, líquidos y mal uso (las averías más comunes). Además, ya tienes 3 años de garantía legal. Si el ordenador se avería por un defecto de fabricación, la garantía legal lo cubre. Si se avería por un accidente, la garantía extendida probablemente no lo cubre de todos modos.',
      },

      {type:'final', xp:28, msg:'Un buen análisis de seguros no es comprar más coberturas — es entender exactamente qué riesgos tienes que transferir y cuáles puedes asumir tú mismo con un fondo de emergencia sólido.'},
    ],
  },

];

const MODULE_REAL_ACTIONS_MAP = {
  'FUNDAMENTAL':  { emoji:'💡', action:'Esta semana calcula tu tasa de ahorro: (ingresos − gastos) ÷ ingresos × 100. Si es menor del 10%, ponlo como objetivo este mes.' },
  'INVERSIÓN':    { emoji:'📊', action:'Entra en MyInvestor.es o DEGIRO y calcula cuánto crecería €100/mes a 7% anual durante 20 años. Solo para verlo real.' },
  'PSICOLOGÍA':   { emoji:'🧠', action:'Antes de tu próxima compra mayor de €30, espera 48 horas. Anota si sigues queriéndola. Es el truco más barato para ahorrar.' },
  'MENTALIDAD':   { emoji:'🧘', action:'Identifica un gasto recurrente que haces por inercia, no por satisfacción real. ¿Podrías reducirlo o eliminarlo este mes?' },
  'DEUDA':        { emoji:'✂️', action:'Lista tus deudas actuales con su tipo de interés. Ordénalas de mayor a menor TAE. Eso es tu orden de ataque correcto.' },
  'ECONOMÍA':     { emoji:'📈', action:'Configura una alerta de precio en Google Finance para un activo o índice que quieras seguir de cerca.' },
  'FISCALIDAD':   { emoji:'🧾', action:'Abre tu última nómina. Comprueba tu porcentaje de retención IRPF. ¿Es correcto para tu tramo de ingresos anuales?' },
  'VIVIENDA':     { emoji:'🏠', action:'Calcula tu ratio hipoteca/ingresos: cuota mensual ÷ ingresos netos × 100. Por encima del 30% hay riesgo. ¿Dónde estás tú?' },
  'INMOBILIARIO': { emoji:'🏗️', action:'Calcula el PER de un inmueble que conozcas: precio de compra ÷ alquiler anual bruto. Por encima de 20 años, la rentabilidad es baja.' },
  'PRESUPUESTO':  { emoji:'📋', action:'Abre el extracto bancario del mes pasado y clasifica tus gastos en: fijos, variables y ocio. Encontrarás fugas que no sabías que tenías.' },
  'FIRE':         { emoji:'🏝️', action:'Calcula tu número FIRE: gastos anuales × 25. Ese es el patrimonio que necesitas para vivir de tus inversiones. ¿Cuánto te falta?' },
  'CRIPTO':       { emoji:'₿', action:'Si decides invertir en cripto, fija una regla antes: nunca más del 5% de tu cartera y solo capital que puedas perder íntegro.' },
  'PROTECCIÓN':   { emoji:'🛡️', action:'Revisa qué seguros tienes activos. ¿Pagas alguno duplicado? ¿Te falta alguno crítico (hogar, vida, incapacidad)?' },
  'AVANZADO':     { emoji:'🚀', action:'Revisa si tu cartera tiene exposición a al menos 3 zonas geográficas distintas. La diversificación geográfica reduce el riesgo sistémico.' },
  'RETO FINAL':   { emoji:'🏆', action:'Escribe 3 decisiones financieras concretas que vas a implementar este mes basadas en lo que has aprendido hoy.' },
  'fundamentos':  { emoji:'💡', action:'Esta semana calcula tu tasa de ahorro: (ingresos − gastos) ÷ ingresos × 100. Si es menor del 10%, ponlo como objetivo este mes.' },
  'inversion':    { emoji:'📊', action:'Entra en MyInvestor.es o DEGIRO y calcula cuánto crecería €100/mes a 7% anual durante 20 años. Solo para verlo real.' },
  'deuda':        { emoji:'✂️', action:'Lista tus deudas actuales con su tipo de interés. Ordénalas de mayor a menor TAE. Eso es tu orden de ataque correcto.' },
  'fiscalidad':   { emoji:'🧾', action:'Abre tu última nómina. Comprueba tu porcentaje de retención IRPF. ¿Es correcto para tu tramo de ingresos anuales?' },
  'psicologia':   { emoji:'🧠', action:'Antes de tu próxima compra mayor de €30, espera 48 horas. Anota si sigues queriéndola. Es el truco más barato para ahorrar.' },
  'avanzado':     { emoji:'🚀', action:'Revisa si tu cartera tiene exposición a al menos 3 zonas geográficas distintas. La diversificación geográfica reduce el riesgo sistémico.' },
  'vivienda':     { emoji:'🏠', action:'Calcula tu ratio hipoteca/ingresos: cuota mensual ÷ ingresos netos × 100. Por encima del 30% hay riesgo. ¿Dónde estás tú?' },
};

const WEEKLY_ACTIONS = [
  { id:'wa_cancel_sub', icon:'✂️', title:'Cancela 1 suscripción que no uses', desc:'Abre tus suscripciones activas (Netflix, Spotify, gym, cloud...) y cancela la que menos uses este mes.', xp:120, savingEst:15 },
  { id:'wa_negotiate_mobile', icon:'📱', title:'Negocia tu factura del móvil', desc:'Llama a tu compañía y pide descuento por fidelidad. El 70% de peticiones consiguen 5-15€/mes de descuento.', xp:150, savingEst:10 },
  { id:'wa_cirbe_check', icon:'🏦', title:'Consulta tu CIRBE gratis', desc:'Entra en la sede del Banco de España con tu DNI electrónico y revisa qué préstamos figuran a tu nombre.', xp:100, savingEst:0 },
  { id:'wa_asnef_check', icon:'🔍', title:'Consulta si estás en ASNEF', desc:'Pide por escrito a ASNEF qué datos tienen sobre ti. Si hay algún error, exige corrección.', xp:100, savingEst:0 },
  { id:'wa_auto_transfer', icon:'🤖', title:'Activa transferencia automática de ahorro', desc:'Programa una transferencia automática el día del cobro al ahorro. Empieza con €50 si no puedes más.', xp:150, savingEst:50 },
  { id:'wa_audit_insurance', icon:'🛡️', title:'Compara tu seguro de coche', desc:'Compara tu seguro actual en Rastreator o Acierto. Muchos ahorran €100-300 al año cambiando.', xp:130, savingEst:15 },
  { id:'wa_compare_power', icon:'💡', title:'Compara tu factura de luz', desc:'Entra en el comparador de la CNMC y compara tu tarifa de luz. Pasar a tarifa regulada PVPC suele ahorrar €10-30/mes.', xp:130, savingEst:20 },
  { id:'wa_check_revolving', icon:'💳', title:'Revisa si tienes tarjeta revolving', desc:'Mira el contrato de tus tarjetas. Si el TAE supera el 20% y pagas cuota fija, probablemente sea revolving. Cancélala.', xp:150, savingEst:40 },
  { id:'wa_budget_3cat', icon:'📊', title:'Categoriza tus gastos del último mes', desc:'Mira el extracto bancario y clasifica tus gastos en 3 grupos: fijos, variables y ocio. Encontrarás fugas.', xp:120, savingEst:30 },
  { id:'wa_unsub_amazon', icon:'📦', title:'Audita tus compras recurrentes', desc:'Revisa Amazon, iTunes/Play Store y bancos. Cancela cualquier suscripción que no recuerdes haber activado.', xp:110, savingEst:20 },
  { id:'wa_open_broker', icon:'📈', title:'Abre cuenta en un broker con bajas comisiones', desc:'DEGIRO, MyInvestor, IBKR... compara y abre una cuenta (aún sin ingresar dinero). Elimina la fricción futura.', xp:140, savingEst:0 },
  { id:'wa_auto_invest', icon:'🎯', title:'Programa tu primera aportación mensual', desc:'Automatiza una aportación mensual a un fondo indexado. Empieza con €50 si no puedes más. El hábito vale más que la cantidad.', xp:180, savingEst:0 },
  { id:'wa_mortgage_review', icon:'🏠', title:'Revisa las condiciones de tu hipoteca', desc:'Abre tu escritura hipotecaria. Anota: tipo (fijo/variable), diferencial y comisiones. Compara con ofertas actuales.', xp:130, savingEst:0 },
  { id:'wa_will_check', icon:'📜', title:'Revisa si tienes testamento', desc:'Ir al notario cuesta €40 y evita meses de problemas a tu familia. Si tienes patrimonio o hijos, es obligación.', xp:100, savingEst:0 },
  { id:'wa_declutter_app', icon:'🗑️', title:'Elimina apps que te hacen gastar', desc:'Desinstala de tu móvil las apps de compra compulsiva (Amazon, Shein, Wallapop compras, delivery). Reduces compras impulsivas.', xp:110, savingEst:25 },
  { id:'wa_check_noms', icon:'📄', title:'Revisa tu última nómina', desc:'Abre tu nómina. ¿Entiendes todos los conceptos? Identifica base de cotización y retención IRPF.', xp:100, savingEst:0 },
  { id:'wa_compare_bank', icon:'🏦', title:'Compara comisiones de tu banco', desc:'Revisa qué pagas al banco este año en mantenimiento y comisiones. Si supera €80, hay alternativas gratuitas.', xp:120, savingEst:10 },
  { id:'wa_small_debt', icon:'💰', title:'Paga la deuda más pequeña que tengas', desc:'Si tienes varias deudas, liquida la más pequeña entera con lo que puedas. Victoria rápida que motiva.', xp:150, savingEst:0 },
  { id:'wa_irpf_sim', icon:'🧾', title:'Simula tu declaración de la renta', desc:'Usa el simulador oficial de Hacienda o uno comercial. Descubre deducciones que no aprovechabas.', xp:130, savingEst:100 },
  { id:'wa_emergency_start', icon:'🚨', title:'Transfiere €100 al fondo de emergencia', desc:'Abre una cuenta remunerada y mete €100. El inicio es lo más difícil. Empieza hoy.', xp:140, savingEst:0 },
  { id:'wa_one_noexp', icon:'🚫', title:'Hoy: día sin gastos variables', desc:'24 horas sin gastar en nada que no sea obligatorio. Ni cafés, ni delivery, ni compras. Reinicia el hábito.', xp:100, savingEst:15 },
  { id:'wa_meal_prep', icon:'🍱', title:'Prepara tu comida 3 días esta semana', desc:'Cada comida en casa en vez de fuera ahorra €8-12. Tres días = €25-35 extra cada semana.', xp:100, savingEst:30 },
  { id:'wa_books_finance', icon:'📚', title:'Empieza un libro financiero clásico', desc:'Elige uno: "Padre Rico Padre Pobre", "El Hombre Más Rico de Babilonia", "Your Money or Your Life". Biblioteca pública.', xp:100, savingEst:0 },
  { id:'wa_track_day', icon:'✏️', title:'Apunta cada euro que gastes hoy', desc:'Durante un día entero, anota cada compra. Verás tu comportamiento real, no el percibido.', xp:110, savingEst:15 },
  { id:'wa_salary_goal', icon:'🎯', title:'Define tu objetivo de sueldo en 3 años', desc:'Pon un número concreto. Ej: "quiero cobrar €2.800 netos/mes el 1/1/2028". Escríbelo en tu móvil.', xp:100, savingEst:0 },
  { id:'wa_side_hustle', icon:'💼', title:'Lista 3 ideas de ingreso extra', desc:'Escribe 3 formas concretas de generar €100-300 extra al mes con tus skills actuales. Sin filtrar.', xp:110, savingEst:0 },
  { id:'wa_networth_calc', icon:'📊', title:'Calcula tu patrimonio neto real', desc:'Suma todo lo que tienes (cuentas + inversiones + casa). Resta todo lo que debes. Ese número es tu punto de partida.', xp:130, savingEst:0 },
  { id:'wa_subscription_audit', icon:'🔍', title:'Lista TODAS tus suscripciones activas', desc:'Haz una lista exhaustiva: streaming, apps, gym, nube, juegos, revistas. Calcula el total mensual. Te sorprenderás.', xp:120, savingEst:25 },
  { id:'wa_price_compare_week', icon:'🛒', title:'Compara precios antes de cualquier compra >€30', desc:'Durante 7 días, ANTES de comprar algo de más de €30, compara en Google Shopping o Idealo. Mínimo 2 tiendas.', xp:110, savingEst:20 },
  { id:'wa_freelance_stripe', icon:'💳', title:'Revisa comisiones de pago que pagas', desc:'Si eres autónomo o cobras por plataformas (PayPal, Stripe, Bizum Pro), suma comisiones del último mes. Negocia o cambia.', xp:120, savingEst:15 },
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


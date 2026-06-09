MODULES.push.apply(MODULES,[

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 34 — Value Investing: Comprar Empresas, No Acciones
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:34, icon:'🔍', title:'Value Investing: La Filosofía de Buffett',
    desc:'Comprar €1 de valor pagando 60 céntimos. El método que construyó fortunas.',
    xp:30, tag:'AVANZADO', tagC:'gold', users:'22.100',
    steps:[
      {type:'content', tag:'🔍 Módulo 35', title:'¿Qué es el Value Investing?',
        intro:'Benjamin Graham (mentor de Buffett) definió la inversión con una analogía: el mercado es Mr. Market, un socio maníaco-depresivo que cada día te ofrece un precio diferente por tu parte del negocio. A veces está eufórico y pide demasiado. A veces está deprimido y regala el precio. Tu trabajo: comprar cuando está deprimido.',
        bullets:['💰 Valor intrínseco: lo que realmente vale la empresa, independientemente del precio de mercado','🛡️ Margen de seguridad: comprar por debajo del valor intrínseco para protegerte si te equivocas','🏰 Moat (foso económico): la ventaja que protege a la empresa de la competencia','📈 Inversión, no especulación: el objetivo es ser propietario de un negocio, no adivinar precios','⏳ Horizonte largo: "mi horizonte favorito es para siempre" — Buffett'],
        fact:'Si hubieras invertido €10.000 en Berkshire Hathaway (la empresa de Buffett) en 1965, hoy tendrías más de €250 millones. El S&P 500 en el mismo período: €2,5 millones.'},
      {type:'content', tag:'🔍 Módulo 35', title:'Cómo Identificar Empresas de Calidad',
        intro:'No toda empresa barata es una oportunidad. Graham distinguía entre la "trampa de valor" (empresa barata porque está en declive) y la auténtica oportunidad (empresa de calidad temporalmente infravalorada).',
        bullets:['📊 ROE > 15% sostenido: la empresa genera buena rentabilidad con su capital propio','💸 Márgenes crecientes: el pricing power indica moat real','🏦 Deuda conservadora: Deuda/EBITDA < 3x, preferiblemente < 2x','📈 Crecimiento de beneficios a 10 años: si no puedes proyectar 10 años, no entiendes el negocio','🎯 Insider ownership: cuando los directivos poseen acciones, sus intereses coinciden con los tuyos'],
        fact:'Buffett nunca invirtió en Amazon, Google o Facebook porque decía que no entendía cómo serían en 10 años. Su regla: si no puedes explicarlo simplemente, no lo compres.'},
      {type:'quiz', tag:'🔍 Quiz', title:'¿Qué es el "margen de seguridad" en value investing?',
        opts:[{t:'El seguro de cartera obligatorio', ok:false},{t:'La diferencia entre el precio pagado y el valor intrínseco estimado', ok:true},{t:'El stop-loss automático', ok:false},{t:'El porcentaje de bonos en cartera', ok:false}],
        ok:'Si calculas que una empresa vale €100/acción y la compras a €60, tu margen de seguridad es 40%. Ese margen protege tu inversión si tu valoración tiene errores — que siempre los tiene.',
        bad:'Si calculas que una empresa vale €100/acción y la compras a €60, tu margen de seguridad es 40%. Ese margen protege tu inversión si tu valoración tiene errores — que siempre los tiene.'},
      {type:'final', xp:30, msg:'¡Filosofía de Buffett interiorizada! Entiendes el margen de seguridad, el moat, el círculo de competencia y por qué el value investing funciona a largo plazo. Mr. Market es tu aliado, no tu jefe.'},
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
      {type:'content', tag:'👴 Módulo 36', title:'Cómo Funciona la Pensión Pública en España',
        intro:'España tiene un sistema de pensiones de reparto: los trabajadores activos pagan las pensiones de los jubilados actuales. No hay ninguna cuenta con "tu dinero" esperándote. Tu cotización de hoy paga la pensión de tu abuelo hoy.',
        bullets:['💸 Sistema de reparto: trabajadores actuales → pensiones actuales (no es tu ahorro)','📊 Tasa de sustitución media: la pensión pública cubre ~70-75% del último sueldo en España','📉 Problema demográfico: cada vez menos trabajadores por jubilado (de 4:1 a 2:1 en 2050)','📋 Se necesitan 25 años cotizados para el 100% de la base reguladora','⚠️ El Fondo de Reserva (la "hucha de las pensiones") pasó de €66.800M en 2011 a casi cero'],
        fact:'Según el Banco de España, sin reformas estructurales el déficit del sistema de pensiones alcanzará el 3,5% del PIB en 2050. La pensión media actual es de €1.234/mes.'},
      {type:'content', tag:'👴 Módulo 36', title:'Tu Estrategia Complementaria Obligatoria',
        intro:'La pensión pública quizás no desaparezca, pero sí se reducirá en términos reales. La solución no es política — es personal. Construir un segundo pilar de pensión privada no es opcional si quieres mantener tu nivel de vida.',
        bullets:['📊 Plan de pensiones individual: deducción fiscal de hasta €1.500/año en España (desde 2021)','🏢 Plan de empresa: aportaciones del empleador, frecuentemente gratuitas — siempre maximizar','📈 EPSV (País Vasco): hasta €5.000/año deducibles, muy superior al plan de pensiones estatal','💼 Cuenta de valores con ETFs: más flexible que el plan de pensiones pero sin ventaja fiscal','🔢 Regla práctica: la mitad de tu edad como porcentaje del ingreso a destinar a pensión (25 años → 12,5%)'],
        fact:'Si a los 25 años inviertes €200/mes en un ETF global y lo mantienes hasta los 65, con un 8% anual tendrás €620.000. Empezar a los 35 con €400/mes: €540.000. El tiempo gana.'},
      {type:'quiz', tag:'👴 Quiz', title:'¿Cuántos años cotizados se necesitan en España para cobrar el 100% de la pensión?',
        opts:[{t:'20 años', ok:false},{t:'25 años', ok:false},{t:'35 años', ok:true},{t:'45 años', ok:false}],
        ok:'Desde la reforma de 2013, se necesitan 37 años cotizados para el 100% (y este umbral sigue subiendo). Con 25 años cotizados se obtiene aproximadamente el 50% de la base reguladora.',
        bad:'Desde la reforma de 2013, se necesitan 37 años cotizados para el 100% (y este umbral sigue subiendo). Con 25 años cotizados se obtiene aproximadamente el 50% de la base reguladora.'},
      {type:'quiz', tag:'👴 Quiz', title:'¿Por qué el sistema de pensiones español tiene problemas estructurales?',
        opts:[{t:'Porque la gente cobra demasiado tiempo la pensión', ok:false},{t:'Porque hay cada vez menos trabajadores por jubilado (demografía)', ok:true},{t:'Porque los gestores del sistema invierten mal', ok:false},{t:'Porque las cotizaciones son demasiado bajas', ok:false}],
        ok:'El ratio de trabajadores por jubilado ha caído de 4:1 a 2,5:1 y seguirá cayendo. Con menos cotizantes sosteniendo más pensionistas, el sistema de reparto tiene tensiones crecientes.',
        bad:'El ratio de trabajadores por jubilado ha caído de 4:1 a 2,5:1 y seguirá cayendo. Con menos cotizantes sosteniendo más pensionistas, el sistema de reparto tiene tensiones crecientes.'},
      {type:'final', xp:25, msg:'¡Sistema de pensiones sin ilusiones! Conoces la realidad del sistema de reparto, la demografía que lo tensiona y por qué el ahorro privado complementario ya no es opcional sino necesario.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 36 — Bonos y Renta Fija: El Activo que Nadie Explica
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:36, icon:'💴', title:'Bonos y Renta Fija: El Activo Invisible',
    desc:'Qué son, cómo funcionan y cuándo tienen sentido en tu cartera.',
    xp:25, tag:'FUNDAMENTAL', tagC:'green', users:'15.300',
    steps:[
      {type:'content', tag:'🏛️ Módulo 37', title:'Qué es un Bono',
        intro:'Un bono es un préstamo que haces a un gobierno o empresa. Ellos reciben tu dinero hoy y se comprometen a devolvértelo en una fecha futura (vencimiento) más intereses periódicos (cupón). Es deuda para el emisor, inversión para ti.',
        bullets:['📋 Emisor: gobierno (soberano) o empresa (corporativo)','💰 Cupón: interés periódico que recibes (ej: 3% anual)','📅 Vencimiento: cuando te devuelven el principal (1, 5, 10, 30 años)','⚖️ Relación inversa precio-tipo de interés: si suben los tipos, el precio del bono baja','🔒 Calificación crediticia: AAA (seguro) a D (en impago) según Moody\'s, S&P, Fitch'],
        fact:'España emite bonos a 10 años. En 2022 pagaba el 3,5% de interés. En 2021, con tipos negativos, pagaba el -0,05% — los inversores pagaban por prestarle dinero al estado español.'},
      {type:'content', tag:'🏛️ Módulo 37', title:'¿Cuándo Incluir Bonos en Tu Cartera?',
        intro:'La cartera clásica 60/40 (60% acciones, 40% bonos) ha sido el estándar durante décadas. Los bonos amortiguan las caídas de la bolsa porque cuando hay crisis, los inversores huyen a la seguridad de los bonos del estado.',
        bullets:['🔄 Correlación negativa histórica: cuando las acciones caen, los bonos tienden a subir','📅 A más edad → más bonos: menos tiempo para recuperarse de una crisis','📊 Bonos del Estado > Bonos Corporativos en términos de seguridad','🌍 Fondos de bonos: diversifican el riesgo de crédito entre muchos emisores','⚠️ 2022: año excepcional donde acciones Y bonos cayeron simultáneamente (inflación rompió la correlación)'],
        fact:'La cartera 60/40 perdió un 16% en 2022 — su peor año desde 1937. La razón: la inflación destruyó el valor de los bonos al mismo tiempo que el alza de tipos hundía las acciones.'},
      {type:'quiz', tag:'🏛️ Quiz', title:'Si suben los tipos de interés, ¿qué pasa con el precio de los bonos existentes?',
        opts:[{t:'Suben porque pagan más interés', ok:false},{t:'Bajan porque los nuevos bonos son más atractivos', ok:true},{t:'Se mantienen iguales', ok:false},{t:'Depende del emisor', ok:false}],
        ok:'Los bonos existentes pagan un cupón fijo (ej: 2%). Si se emiten nuevos bonos al 4%, nadie querrá el tuyo al 2% a menos que su precio baje para igualar la rentabilidad efectiva. Tipos arriba → precios de bonos abajo.',
        bad:'Los bonos existentes pagan un cupón fijo (ej: 2%). Si se emiten nuevos bonos al 4%, nadie querrá el tuyo al 2% a menos que su precio baje para igualar la rentabilidad efectiva. Tipos arriba → precios de bonos abajo.'},
      {type:'final', xp:25, msg:'¡Renta fija desmitificada! Sabes que tipos arriba = precio de bonos abajo, diferencias entre bonos corporativos y soberanos, y cómo los bonos encajan (o no) en una cartera según tu horizonte temporal.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 37 — El Arte de la Negociación Financiera Personal
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:37, icon:'🗣️', title:'Negocia Todo: Hipoteca, Sueldo, Seguros',
    desc:'El dinero que no negocias es dinero que regalaS. Cada conversación tiene precio.',
    xp:25, tag:'PRÁCTICA', tagC:'green', users:'19.800',
    steps:[
      {type:'content', tag:'🤝 Módulo 38', title:'La Hipoteca: Tu Mayor Negociación',
        intro:'Una hipoteca de €200.000 a 30 años: la diferencia entre el 2% y el 2,5% de interés es €18.000 en intereses totales. Nadie viene a ofrecerte el mejor precio — tienes que pedirlo, y comparar entre al menos 3 entidades.',
        bullets:['🏦 Pide oferta a mínimo 3 bancos: el primero siempre deja margen','📊 Mejora tu scoring: cuanto mejor tu situación financiera, menor el tipo que consigues','🔄 Subrogación: puedes llevarte tu hipoteca a otro banco si te dan mejores condiciones','💼 Broker hipotecario: gestionan la negociación por ti (cobran €1.000-€3.000 pero ahorran más)','⚠️ TIN vs TAE: el TIN es el tipo "nominal", el TAE incluye todos los gastos — compara el TAE'],
        fact:'El banco Santander tiene instrucción interna de poder bajar el tipo hasta un 0,2% si el cliente amenaza con irse. El 80% de los clientes no lo saben y nunca lo piden.'},
      {type:'content', tag:'🤝 Módulo 38', title:'Seguros, Telefonía y Servicios: El Ritual Anual',
        intro:'Los seguros de hogar, auto y vida suben entre un 5-15% cada año "automáticamente". Las compañías cuentan con que la mayoría de clientes no llamará. Llamar tarda 15 minutos y puede ahorrarte €300 al año.',
        bullets:['📞 Llama a tu aseguradora en la renovación anual y pide retención','📊 Ten la oferta de la competencia antes de llamar (3 minutos en comparador)','💬 Script: "Tengo oferta de X por €Y menos. ¿Podéis igualarla o la tramito?"','📱 Telefonía: cambiar de operador cada 2 años suele ahorrar €200-€500/año','🏠 Suministros: comparar luz y gas tarda 10 minutos y puede ahorrar €150-€300/año'],
        fact:'Un estudio del OCU reveló que el 67% de los españoles nunca ha negociado su seguro de hogar. Los que sí lo hacen consiguen descuentos medios del 18%.'},
      {type:'quiz', tag:'🤝 Quiz', title:'¿Cuál es la diferencia entre TIN y TAE en una hipoteca?',
        opts:[{t:'El TIN incluye todos los gastos, el TAE solo el interés base', ok:false},{t:'El TAE incluye todos los gastos y comisiones, el TIN solo el interés puro', ok:true},{t:'Son lo mismo expresado de forma diferente', ok:false},{t:'El TIN es para préstamos, el TAE para hipotecas', ok:false}],
        ok:'El TIN (Tipo de Interés Nominal) es solo el interés. El TAE incluye además comisiones, seguros vinculados y otros gastos. Siempre compara el TAE para tener el coste real de dos hipotecas.',
        bad:'El TIN (Tipo de Interés Nominal) es solo el interés. El TAE incluye además comisiones, seguros vinculados y otros gastos. Siempre compara el TAE para tener el coste real de dos hipotecas.'},
      {type:'final', xp:25, msg:'¡Negociación total desbloqueada! No solo el sueldo: hipoteca, seguros, contratos. Cada negociación bien hecha puede valer miles de euros. Ahora tienes el método para cada situación.'},
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
      {type:'content', tag:'🧾 Módulo 39', title:'Cómo Funciona el IRPF del Inversor',
        intro:'En España, las ganancias de inversión tienen su propio tramo impositivo: la base imponible del ahorro. No pagas lo mismo por tu sueldo que por tus plusvalías bursátiles. Entender esto es dinero directo.',
        bullets:['📊 Hasta €6.000: 19% de impuestos sobre plusvalías','📊 €6.000 – €50.000: 21%','📊 €50.000 – €200.000: 23%','📊 Más de €200.000: 27%','🔄 Compensación: pérdidas computan contra ganancias (hasta 25% de los dividendos)','📅 Diferimiento: no tributas hasta que vendes — los ETFs de acumulación aprovechan esto al máximo'],
        fact:'Si tienes minusvalías en acciones A y plusvalías en acciones B, puedes vender ambas para compensar y reducir tu factura fiscal. La llamada "venta de minusvalías" es 100% legal y utilizada por todos los inversores profesionales.'},
      {type:'content', tag:'🧾 Módulo 39', title:'Deducciones que el 90% Ignora',
        intro:'La declaración de la renta tiene deducciones que la mayoría de contribuyentes no aplica por desconocimiento. Cada deducción no aprovechada es dinero regalado a Hacienda.',
        bullets:['🏠 Deducción por alquiler de vivienda habitual (si el contrato es anterior a 2015): 10,05%','👶 Mínimo familiar: €2.400 por el primer hijo, más por siguientes','♿ Discapacidad: reducciones de hasta €9.000 según grado','📚 Deducción por donativos a ONGs: 80% de los primeros €150, 35% el resto','💼 Gastos deducibles como autónomo: seguro médico, teléfono, ordenador, formación'],
        fact:'Según Hacienda, el 35% de los contribuyentes que hace la renta por los datos fiscales de Hacienda paga más de lo que debería por no revisar ni añadir sus deducciones.'},
      {type:'quiz', tag:'🧾 Quiz', title:'¿Qué tipo de IRPF pagas en España por ganancias bursátiles hasta €6.000?',
        opts:[{t:'El mismo que por tu sueldo (hasta 47%)', ok:false},{t:'19%', ok:true},{t:'15%', ok:false},{t:'12%', ok:false}],
        ok:'Las plusvalías tributan en la "base del ahorro" separada del trabajo. Hasta €6.000 de ganancia, el tipo es 19%. Es más ventajoso que el tipo marginal del trabajo, que puede llegar al 47%.',
        bad:'Las plusvalías tributan en la "base del ahorro" separada del trabajo. Hasta €6.000 de ganancia, el tipo es 19%. Es más ventajoso que el tipo marginal del trabajo, que puede llegar al 47%.'},
      {type:'final', xp:30, msg:'¡Declaración de la renta optimizada! Conoces las deducciones autonómicas, el tratamiento de plusvalías, cómo funciona el plan de pensiones fiscalmente y por qué revisar siempre el borrador antes de confirmarlo.'},
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
      {type:'content', tag:'🎯 Módulo 40', title:'Por Qué el Presupuesto Tradicional Falla',
        intro:'El presupuesto tradicional funciona así: ganas X, gastas lo que necesitas, lo que sobra lo ahorras. El problema: siempre hay algo más que "necesitar" y el ahorro queda reducido a las migajas. El presupuesto base cero invierte el orden.',
        bullets:['🔄 Base cero: cada mes empiezas desde €0 y asignas cada euro a un destino','💸 Primero: apartar el ahorro e inversión (como si fuera una factura obligatoria)','📊 Segundo: gastos fijos (alquiler, hipoteca, seguros, suscripciones)','🍕 Tercero: gastos variables (comida, ocio, ropa) — lo que sobra, no lo que te apetece','✅ Regla: si un gasto no está en el presupuesto, no existe'],
        fact:'Dave Ramsey, que ayudó a 5 millones de personas a salir de deudas, dice que el presupuesto base cero es la herramienta número uno. La mayoría de sus clientes descubren en el primer mes que gastaban €300-€500 en cosas que ni recuerdan.'},
      {type:'content', tag:'🎯 Módulo 40', title:'Implementar el Sistema en 30 Minutos',
        intro:'El presupuesto base cero requiere 30 minutos al inicio de cada mes y 5 minutos de seguimiento diario. No es un sacrificio — es elegir conscientemente qué haces con tu dinero en lugar de que el dinero "decida" por ti.',
        bullets:['1️⃣ Lista todos tus ingresos del mes (bruto y neto)','2️⃣ Escribe cada categoría de gasto con su límite máximo','3️⃣ Suma gastos + ahorro: debe igualar exactamente tus ingresos','4️⃣ Cuando una categoría se agote, paro — sin excepciones','5️⃣ Ajusta el mes siguiente según lo que salió diferente'],
        fact:'Un estudio de la Universidad de Utah encontró que las personas que escriben su presupuesto mensual tienen una tasa de ahorro un 38% mayor que las que no lo hacen, con los mismos ingresos.'},
      {type:'quiz', tag:'🎯 Quiz', title:'¿Cuál es la diferencia principal entre presupuesto tradicional y base cero?',
        opts:[{t:'El base cero no permite ningún gasto en ocio', ok:false},{t:'En el base cero asignas un destino a CADA euro antes de gastarlo', ok:true},{t:'El base cero solo funciona con ingresos altos', ok:false},{t:'El base cero es mensual, el tradicional anual', ok:false}],
        ok:'En el presupuesto base cero, Ingresos - Gastos - Ahorro = €0. Cada euro tiene un nombre y un destino antes de que llegues a fin de mes. No hay "lo que sobra al final" — eso ya estaba planeado.',
        bad:'En el presupuesto base cero, Ingresos - Gastos - Ahorro = €0. Cada euro tiene un nombre y un destino antes de que llegues a fin de mes. No hay "lo que sobra al final" — eso ya estaba planeado.'},
      {type:'final', xp:20, msg:'¡Presupuesto base cero dominado! Cada euro tiene nombre y destino antes de que llegues a fin de mes. No hay "lo que sobra" — eso se llamaba caos. Ahora se llama plan.'},
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
      {type:'content', tag:'🦄 Módulo 41', title:'El Ciclo de Vida de una Startup',
        intro:'Una startup no es una empresa pequeña. Es una apuesta por un modelo de negocio escalable. La gran mayoría muere. Las que sobreviven pueden multiplicar el capital invertido por 100 o por 1.000. Entender las fases es clave para evaluar el riesgo.',
        bullets:['🌱 Pre-seed: idea y equipo fundador. El dinero viene de FFF (Friends, Family, Fools)','🌿 Seed: primer producto y tracción inicial. Business angels y fondos semilla (€100K-€2M)','🌳 Serie A: modelo probado, escalar. VCs tradicionales (€5M-€25M)','🚀 Serie B/C: escala internacional, preparar IPO. €50M-€500M','💥 Exit: IPO en bolsa o venta a empresa grande (el momento donde los inversores cobran)'],
        fact:'Sequoia Capital invirtió €250.000 en Google en 1999. Cuando Google salió a bolsa en 2004, esa inversión valía €4.300 millones. Rentabilidad: 17.200x. Pero por cada Google, hay 999 startups que no devuelven nada.'},
      {type:'content', tag:'🦄 Módulo 41', title:'¿Puede el Inversor Minorista Acceder a Esto?',
        intro:'El venture capital ha sido históricamente reservado a grandes inversores y fondos. Pero han aparecido vías de acceso para el inversor con menos capital, con sus ventajas y limitaciones claras.',
        bullets:['👼 Inversión ángel: invertir directamente en startups (mínimo €5.000-€25.000, alta iliquidez)','🌐 Plataformas de equity crowdfunding: Seedrs, Crowdcube (desde €100, muchas quiebran)','📊 Fondos de VC: vehículos especializados (mínimos €100K+, típicamente para institucionales)','🏛️ ETFs de Innovation: ARK Innovation, etc. (acceso líquido a empresas growth, no early stage)','⚠️ Regla de oro: nunca más del 5-10% de tu cartera en activos alternativos de alto riesgo'],
        fact:'El 90% de las startups quiebra en los primeros 5 años. El 1% de las que sobreviven generan el 99% de los retornos del sector. La distribución de retornos en VC es la más extrema de todos los activos financieros.'},
      {type:'quiz', tag:'🦄 Quiz', title:'¿Qué es un "unicornio" en el mundo startup?',
        opts:[{t:'Una startup con tecnología de IA generativa', ok:false},{t:'Una startup valorada en más de $1.000 millones', ok:true},{t:'Una startup que cotiza en bolsa', ok:false},{t:'Una startup que ha conseguido ser rentable', ok:false}],
        ok:'El término lo acuñó la inversora Aileen Lee en 2013 para describir startups privadas con valoración >$1.000M. Los llamó unicornios porque eran tan raros como esa criatura. Hoy hay más de 1.200 unicornios en el mundo.',
        bad:'El término lo acuñó la inversora Aileen Lee en 2013 para describir startups privadas con valoración >$1.000M. Los llamó unicornios porque eran tan raros como esa criatura. Hoy hay más de 1.200 unicornios en el mundo.'},
      {type:'final', xp:35, msg:'¡Mundo startup descifrado! Entiendes rondas de inversión (seed, serie A, B, C), dilución, valoración, y por qué el 90% de startups fracasa. Si algún día inviertes en una, ya sabrás qué preguntar.'},
    ],
  },

  /* ═══ MÓDULO 41 — Gestión del Riesgo Personal ════════════════════ */
  {
    id:41, icon:'🛠️', title:'Gestión del Riesgo Personal',
    desc:'Cuánto riesgo puedes permitirte realmente. No el que crees.',
    xp:25, tag:'FUNDAMENTAL', tagC:'green', users:'16.800',
    steps:[
      {type:'content', tag:'🛡️ Módulo 42', title:'Riesgo: Capacidad vs Tolerancia',
        intro:'Todos dicen tener "perfil moderado" hasta que la cartera cae un 30%. El riesgo tiene tres dimensiones reales: capacidad (¿puedes permitirte perder?), tolerancia (¿puedes dormir bien perdiendo?) y necesidad (¿cuánto riesgo requiere tu objetivo?). El más restrictivo de los tres manda.',
        bullets:['💪 Capacidad: si necesitas el dinero en 3 años, no puedes arriesgar que caiga 40%','🧠 Tolerancia: el 74% de inversores "agresivos" vendió en las 6 semanas del crash de 2020','🎯 Necesidad: para multiplicar por 3 en 10 años necesitas renta variable — no queda otra','📅 Horizonte largo = más riesgo posible. El tiempo cura las caídas','⚖️ Regla: el dinero que podrías necesitar en <5 años no va a renta variable'],
        fact:'Un estudio de Dalbar: el inversor medio de fondos de acciones obtuvo 4,35% anual durante 30 años mientras el S&P 500 daba 10,65%. La diferencia: el comportamiento (vender en caídas, comprar en euforia).'},
      {type:'content', tag:'🛡️ Módulo 42', title:'La Regla del 110 y el Asset Allocation por Edad',
        intro:'La asignación de activos (qué porcentaje va a acciones, bonos y cash) es la decisión más importante de tu cartera — más que qué acciones concretas eliges.',
        bullets:['📐 Regla del 110: % en acciones = 110 − tu edad. Con 30 años → 80% acciones','📅 Horizonte <3 años: 0% en renta variable. Mercado puede estar caído justo cuando lo necesitas','💰 3-10 años: 40-70% acciones según tolerancia','🚀 +10 años: 80-100% acciones históricamente óptimo','🔄 Reajustar cada 5 años conforme te acercas al objetivo'],
        fact:'Vanguard: invertir 100% en acciones desde los 25 a los 65, en el 96% de simulaciones históricas tienes más dinero que con cualquier otra combinación. El tiempo es el mejor diversificador.'},
      {type:'quiz', tag:'🛡️ Quiz', title:'¿Qué porcentaje en acciones corresponde a una persona de 35 años según la regla del 110?',
        opts:[{t:'35%', ok:false},{t:'55%', ok:false},{t:'75%', ok:true},{t:'90%', ok:false}],
        ok:'110 − 35 = 75% en acciones. La regla del 110 (o 120 para perfiles agresivos) ajusta la exposición a renta variable según edad: a más joven, más tiempo para recuperar caídas, más acciones. A medida que se acerca la jubilación, se reduce el riesgo gradualmente.',
        bad:'110 − 35 = 75% en acciones. La regla del 110 (o 120 para perfiles agresivos) ajusta la exposición a renta variable según edad: a más joven, más tiempo para recuperar caídas, más acciones. A medida que se acerca la jubilación, se reduce el riesgo gradualmente.'},
      {type:'final', xp:25, msg:'¡Gestión de riesgo personal dominada! Seguro de vida, invalidez, hogar, salud: sabes cuándo cada uno tiene sentido y cuándo es un gasto innecesario. El riesgo catastrófico se asegura; el cotidiano, se absorbe.'},
    ],
  },

  /* ═══ MÓDULO 42 — Fiscalidad Avanzada del Inversor ══════════════ */
  {
    id:42, icon:'🧮', title:'Fiscalidad Avanzada del Inversor',
    desc:'Las estrategias legales que usan los ricos para pagar menos impuestos.',
    xp:35, tag:'AVANZADO', tagC:'gold', users:'13.200',
    steps:[
      {type:'content', tag:'🧮 Módulo 43', title:'Diferimiento Fiscal: El Superpower del Inversor',
        intro:'El principio más potente de la fiscalidad inversora: cada euro que no pagas en impuestos hoy sigue generando rentabilidad. El diferimiento fiscal es, en esencia, un préstamo sin interés del fisco que trabaja para ti décadas.',
        bullets:['📈 ETF acumulación: reinvierte dividendos sin tributar — más capital compuesto cada año','🔄 Traspaso entre fondos indexados en España: sin peaje fiscal hasta la venta final (no aplica a ETFs)','💰 Venta de minusvalías: compensa ganancias y reduce factura fiscal del año','📅 Diferir 20 años un impuesto del 21% sobre €50.000: esos €10.500 siguen generando retorno','⚠️ La norma de los 2 meses: no recompres el mismo activo en 2 meses tras vender con pérdidas'],
        fact:'Un inversor que tributa el 21% cada año sobre sus ganancias vs otro que difiere hasta el final: tras 20 años el segundo tiene €47.000 más sobre €100.000 invertidos. El diferimiento fiscal ES interés compuesto aplicado a impuestos.'},
      {type:'content', tag:'🧮 Módulo 43', title:'Tax Loss Harvesting: Cosechar Pérdidas',
        intro:'El tax loss harvesting es una técnica legal para reducir la factura fiscal: vender posiciones con pérdidas para compensar las ganancias del año. Conviertes el dolor de las pérdidas en un beneficio fiscal tangible.',
        bullets:['📋 Vender activos en pérdidas para compensar ganancias realizadas ese año','🔄 Inmediatamente después recomprar un activo similar (no el mismo — norma 2 meses)','💰 Las minusvalías compensan hasta el 25% de los dividendos recibidos ese año','📊 Ejemplo: +€8.000 en AAPL − €3.000 en posición perdedora = tributa solo €5.000','📅 El resto de minusvalías no compensadas: puedes arrastrarlas 4 años fiscales'],
        fact:'En EEUU, el tax loss harvesting sistemático puede añadir 0,5-1,5% de rentabilidad neta anual (datos Vanguard). En España la mecánica es similar aunque con normas propias.'},
      {type:'quiz', tag:'🧮 Quiz', title:'¿Por qué los fondos de inversión indexados tienen ventaja fiscal sobre los ETFs en España?',
        opts:[{t:'Tienen menores comisiones de gestión', ok:false},{t:'Permiten traspasos entre fondos sin tributar hasta la venta final', ok:true},{t:'Tienen tipos impositivos más bajos', ok:false},{t:'Están exentos de IVA', ok:false}],
        ok:'En España, los fondos de inversión permiten traspasar dinero de un fondo a otro sin generar hecho imponible. Solo tributas al hacer la venta final. Los ETFs no tienen esta ventaja — cada venta tributa. Para estrategias con rebalanceos frecuentes, los fondos indexados ganan.',
        bad:'En España, los fondos de inversión permiten traspasar dinero de un fondo a otro sin generar hecho imponible. Solo tributas al hacer la venta final. Los ETFs no tienen esta ventaja — cada venta tributa. Para estrategias con rebalanceos frecuentes, los fondos indexados ganan.'},
      {type:'final', xp:35, msg:'¡Fiscalidad inversora avanzada! Fondos vs. ETFs (traspaso sin tributar), FIFO, compensación de pérdidas, plus/menos valías diferidas. El inversor fiscal eficiente gana más sin cambiar su cartera.'},
    ],
  },

  /* ═══ MÓDULO 43 — El Ciclo Económico y Tu Cartera ═══════════════ */
  {
    id:43, icon:'📅', title:'El Ciclo Económico y Cómo Invertir en Cada Fase',
    desc:'Expansión, pico, recesión, recuperación. El mercado cotiza el futuro.',
    xp:30, tag:'AVANZADO', tagC:'blue', users:'11.400',
    steps:[
      {type:'content', tag:'🔄 Módulo 44', title:'Las 4 Fases del Ciclo Económico',
        intro:'La economía oscila en ciclos predecibles pero impredecibles en timing. Ray Dalio lleva décadas estudiando estos ciclos para Bridgewater, el mayor hedge fund del mundo. Entender las fases no sirve para predecir — sirve para no sorprenderse.',
        bullets:['📈 EXPANSIÓN: PIB crece, empleo sube, inflación moderada. Acciones y materias primas lideran','🏔️ PICO: inflación alta, tipos subiendo, crédito caro. Los bancos centrales frenan','📉 RECESIÓN: PIB cae, desempleo sube, beneficios bajan. Bonos del estado y sectores defensivos','🌱 RECUPERACIÓN: tipos bajos, estímulos. Acciones baratas, el mejor momento para entrar','⏱️ Duración media: ciclo completo 8-10 años, recesiones 12-18 meses de media'],
        fact:'El S&P 500 toca su mínimo de recesión de media 6 meses ANTES de que la economía real toque fondo. Cuando los medios proclaman "estamos en recesión", la bolsa ya lleva meses subiendo.'},
      {type:'quiz', tag:'🔄 Quiz', title:'¿Qué sectores tienden a hacerlo mejor durante una recesión económica?',
        opts:[{t:'Tecnología y consumo discrecional', ok:false},{t:'Energía y materias primas', ok:false},{t:'Utilities, salud y consumo básico', ok:true},{t:'Inmobiliario y financieros', ok:false}],
        ok:'Los sectores defensivos (utilities, salud, consumo básico) aguantan mejor en recesión porque su demanda no cae con la economía: la gente sigue pagando la luz, comprando medicamentos y comprando comida aunque el PIB baje.',
        bad:'Los sectores defensivos (utilities, salud, consumo básico) aguantan mejor en recesión porque su demanda no cae con la economía: la gente sigue pagando la luz, comprando medicamentos y comprando comida aunque el PIB baje.'},
      {type:'final', xp:30, msg:'¡Ciclo económico mapeado! Expansión → pico → recesión → recuperación: sabes qué sectores funcionan en cada fase y por qué los indicadores adelantados son más valiosos que los datos del PIB de ayer.'},
    ],
  },

  /* ═══ MÓDULO 44 — Cómo Leer Cuentas de una Empresa ═════════════ */
  {
    id:44, icon:'🗂️', title:'Cómo Leer las Cuentas de una Empresa',
    desc:'Balance, P&L y flujo de caja. Los tres documentos que lo dicen todo.',
    xp:35, tag:'AVANZADO', tagC:'gold', users:'9.600',
    steps:[
      {type:'content', tag:'📋 Módulo 45', title:'Los Tres Estados Financieros',
        intro:'Toda empresa pública publica tres documentos cada trimestre. Los inversores de value los leen mejor que los titulares del día.',
        bullets:['📊 Balance: ¿qué tiene y qué debe la empresa? Foto en un momento dado','📈 Cuenta de Resultados (P&L): ¿cuánto gana o pierde? Película de un período','💸 Flujo de Caja (Cash Flow): ¿cuánto dinero real entra? El más honesto de los tres','🔍 Beneficio contable manipulable; free cash flow, mucho menos','⚡ Regla Buffett: nunca inviertas en empresa cuyo flujo de caja libre no entiendes'],
        fact:'Enron, WorldCom y Wirecard tenían beneficios contables impecables antes de quebrar. Sus flujos de caja contaban otra historia. Los analistas que miraron el cash flow detectaron el fraude años antes.'},
      {type:'content', tag:'📋 Módulo 45', title:'Las 5 Métricas Clave',
        intro:'Cinco métricas capturan el 80% de la información relevante para valorar si una empresa merece tu dinero.',
        bullets:['💰 Free Cash Flow: dinero real generado — la métrica reina','📊 Margen EBITDA: cuánto retiene por cada euro de venta','🏦 Deuda neta / EBITDA: >3× es preocupante','📈 ROIC: rentabilidad sobre capital invertido. >15% es excelente','🔄 Crecimiento de ingresos a 5 años: la dirección y velocidad del negocio'],
        fact:'Apple genera >€100.000M de Free Cash Flow anual. Ese cash se usa para recomprar acciones y pagar dividendos. El FCF es lo que hace que una empresa valga algo real.'},
      {type:'quiz', tag:'📋 Quiz', title:'¿Por qué el Free Cash Flow es más fiable que el beneficio neto contable?',
        opts:[{t:'Porque es siempre mayor', ok:false},{t:'Porque es mucho más difícil de manipular contablemente', ok:true},{t:'Porque no incluye impuestos', ok:false},{t:'Porque lo audita un organismo externo', ok:false}],
        ok:'El beneficio neto puede alterarse con criterios contables legales: amortizaciones, provisiones, reconocimiento de ingresos. El Free Cash Flow (dinero que entra en caja menos inversiones) es difícil de falsificar porque el efectivo es efectivo.',
        bad:'El beneficio neto puede alterarse con criterios contables legales: amortizaciones, provisiones, reconocimiento de ingresos. El Free Cash Flow (dinero que entra en caja menos inversiones) es difícil de falsificar porque el efectivo es efectivo.'},
      {type:'final', xp:35, msg:'¡Cuentas de empresa leídas! Balance (activo, pasivo, patrimonio), cuenta de resultados (EBITDA, FCF) y flujo de caja. Ya puedes distinguir una empresa sana de una con contabilidad creativa.'},
    ],
  },

  /* ═══ MÓDULO 45 — IF: El Plan Real ══════════════════════════════ */
  {
    id:45, icon:'🔑', title:'Independencia Financiera: El Plan Real',
    desc:'Más allá de los cálculos. Cómo construirlo paso a paso desde €0.',
    xp:30, tag:'PRÁCTICA', tagC:'green', users:'24.500',
    steps:[
      {type:'content', tag:'🔑 Módulo 46', title:'Los 4 Pilares de la IF',
        intro:'La independencia financiera no es lotería — es un sistema de cuatro pilares que se refuerzan mutuamente.',
        bullets:['💸 PILAR 1 — Ingresos: maximiza sueldo + ingresos paralelos','🏦 PILAR 2 — Ahorro: mínimo 20%, idealmente 30-50%. Determina el plazo más que cualquier otra variable','📈 PILAR 3 — Inversión: el ahorro sin invertir pierde contra la inflación','🛡️ PILAR 4 — Protección: fondo emergencia, seguro vida, diversificación. Sin esto todo es frágil'],
        fact:'Estudio del Trinity College: la variable que más reduce el plazo hasta la IF es la tasa de ahorro, no la rentabilidad de la cartera. Con 50% de ahorro, la IF es alcanzable en ~17 años independientemente del sueldo.'},
      {type:'content', tag:'🔑 Módulo 46', title:'La Tabla del Tiempo Hasta la IF',
        intro:'El tiempo que tardas en alcanzar la IF depende principalmente de tu tasa de ahorro. Esta tabla es el resultado de simulaciones con datos históricos reales.',
        bullets:['📊 10% de ahorro → ~37 años hasta IF','📊 20% → ~30 años','📊 30% → ~25 años','📊 50% → ~17 años','📊 75% → ~7 años','⚡ Cada 10 puntos de tasa de ahorro = ~5 años menos de trabajo'],
        fact:'Mr. Money Mustache alcanzó la IF con 30 años con €60.000/año de sueldo. Su tasa de ahorro era del 66%. Gastaba €20.000/año con €60.000 de ingreso. La clave no fue el sueldo.'},
      {type:'quiz', tag:'🔑 Quiz', title:'¿Qué variable tiene mayor impacto en el tiempo hasta la Independencia Financiera?',
        opts:[{t:'Elegir los mejores activos (mayor rentabilidad)', ok:false},{t:'La tasa de ahorro (porcentaje que inviertes)', ok:true},{t:'El sueldo inicial', ok:false},{t:'Empezar en el momento exacto del mercado', ok:false}],
        ok:'Las simulaciones demuestran que la tasa de ahorro domina sobre todos los demás factores. Pasar del 20% al 40% de ahorro reduce ~10 años el plazo. Mejorar la rentabilidad del 7% al 9% solo reduce 3-4 años. Ahorra más primero, optimiza después.',
        bad:'Las simulaciones demuestran que la tasa de ahorro domina sobre todos los demás factores. Pasar del 20% al 40% de ahorro reduce ~10 años el plazo. Mejorar la rentabilidad del 7% al 9% solo reduce 3-4 años. Ahorra más primero, optimiza después.'},
      {type:'final', xp:30, msg:'¡Plan de independencia financiera trazado! Tu número FIRE real, tasa de ahorro necesaria, horizonte temporal. No es un sueño de influencer — son matemáticas. Y ahora las conoces.'},
    ],
  },

  /* ═══ MÓDULO 46 — Seguros: La Guía Sin Humo ════════════════════ */
  {
    id:46, icon:'☂️', title:'Seguros: La Guía Sin Humo',
    desc:'Los seguros que protegen tu patrimonio. Los que solo protegen al vendedor.',
    xp:20, tag:'PRÁCTICA', tagC:'green', users:'14.700',
    steps:[
      {type:'content', tag:'☂️ Módulo 47', title:'Los Seguros que Sí Necesitas',
        intro:'Un seguro es transferencia de riesgo: pagas algo pequeño y cierto para evitar algo grande e incierto. Regla: asegura solo lo que no podrías pagar con tu propio capital.',
        bullets:['❤️ Vida: si tienes personas dependientes económicamente (hijos, pareja)','🏥 Salud: para reducir esperas o acceso a especialistas. El más usado','🏠 Hogar: obligatorio con hipoteca, recomendable siempre','♿ Invalidez: el más infravalorado. Tu capacidad de generar ingresos es tu mayor activo','🚗 Coche: RC obligatorio. Daños propios si el coche vale >€8.000'],
        fact:'La probabilidad de invalidez permanente antes de jubilarte (a los 35) es del 25%. 6 veces mayor que la de muerte prematura. Sin embargo, muy poca gente tiene seguro de invalidez.'},
      {type:'content', tag:'☂️ Módulo 47', title:'Los Seguros que Deberías Cancelar',
        intro:'La industria crea seguros que se venden emocionalmente pero que matemáticamente no tienen sentido. Si puedes pagar la pérdida con tu fondo de emergencia, el seguro no vale la pena.',
        bullets:['❌ Seguro de móvil: con franquicia alta, pagas casi lo mismo que el arreglo','❌ Garantía extendida: margen para el vendedor del 80%. Casi nadie la usa','❌ Seguro de viaje básico: tarjeta premium o seguro de salud ya cubren lo importante','❌ Unit-linked (seguro + inversión): hace ambas cosas mal y con altas comisiones','⚠️ Seguros vinculados a hipoteca del banco: suelen ser 30-50% más caros que en mercado libre'],
        fact:'Las garantías extendidas tienen un margen de beneficio del 50-70% para el vendedor. Si los fabricantes creyeran que los productos van a averiarse antes de lo normal, no ofrecerían la garantía extendida.'},
      {type:'quiz', tag:'☂️ Quiz', title:'¿Cuál es el criterio correcto para contratar un seguro?',
        opts:[{t:'Contratar todos los disponibles para máxima protección', ok:false},{t:'Asegurar solo lo que no podrías pagar con tu propio capital', ok:true},{t:'Solo contratar los obligatorios por ley', ok:false},{t:'Nunca contratar seguros porque son un gasto', ok:false}],
        ok:'El seguro tiene sentido cuando la pérdida potencial desestabilizaría tu situación financiera. Para pérdidas pequeñas que puedes absorber (móvil, electrodoméstico), la autoseguranza con el fondo de emergencia es siempre más económica.',
        bad:'El seguro tiene sentido cuando la pérdida potencial desestabilizaría tu situación financiera. Para pérdidas pequeñas que puedes absorber (móvil, electrodoméstico), la autoseguranza con el fondo de emergencia es siempre más económica.'},
      {type:'final', xp:20, msg:'¡Seguros sin humo! Vida, invalidez, hogar, salud: sabes qué coberturas necesitas realmente, cuáles son solapadas y cómo no pagar de más. Un buen análisis de seguros ahorra cientos al año.'},
    ],
  },

  /* ═══ MÓDULO 47 — El Millonario de al Lado ══════════════════════ */
  {
    id:47, icon:'🏘️', title:'El Millonario de al Lado: Lo Que No Se Ve',
    desc:'El libro que cambió cómo entendemos la riqueza real.',
    xp:20, tag:'PSICOLOGÍA', tagC:'purple', users:'29.300',
    steps:[
      {type:'content', tag:'🏘️ Módulo 48', title:'Riqueza vs Apariencia de Riqueza',
        intro:'Thomas Stanley estudió 20 años a los millonarios americanos. Conclusión contraintuitiva: la mayoría no vive en mansiones ni conduce Ferrari. Viven en barrios normales, conducen coches usados y tienen mucho dinero porque no lo gastan demostrándolo.',
        bullets:['🏠 El 80% vive en casa propia con hipoteca modesta','🚗 Coche más vendido entre millonarios americanos: Toyota y Ford','💼 Mayoría son autónomos o pequeños empresarios, no ejecutivos de grandes empresas','👔 La riqueza se construye acumulando, no exhibiendo','🎓 Viven por debajo de sus posibilidades deliberadamente — no por necesidad'],
        fact:'Quien conduce un Ferrari de €200.000 a menudo tiene menos patrimonio neto que quien conduce un Volkswagen viejo. El Ferrari es señal de que ese dinero ya no está disponible para crear más riqueza.'},
      {type:'content', tag:'🏘️ Módulo 48', title:'Los 7 Factores del Millonario de al Lado',
        intro:'Stanley identificó 7 denominadores comunes en personas que construyen riqueza real, independientemente del sueldo.',
        bullets:['1️⃣ Viven siempre por debajo de sus posibilidades','2️⃣ Asignan eficientemente tiempo, energía y dinero hacia construir riqueza','3️⃣ La IF importa más que el estatus social','4️⃣ Sus padres no les dieron dinero — los hizo más fuertes','5️⃣ Sus hijos son autosuficientes — los "regalos" excesivos destrozan la motivación','6️⃣ Identifican oportunidades de mercado que otros ignoran','7️⃣ Eligieron (y cambiaron) su profesión para maximizar ingresos'],
        fact:'Ingreso promedio de los millonarios estudiados: €130.000/año. Patrimonio neto medio: €3,7 millones. ¿Cómo? Ahorrando el 20%+ durante décadas y sin gastar para impresionar a nadie.'},
      {type:'quiz', tag:'🏘️ Quiz', title:'¿Cuál es la característica más común entre personas que construyen riqueza real?',
        opts:[{t:'Heredar capital inicial', ok:false},{t:'Tener sueldo muy alto', ok:false},{t:'Vivir consistentemente por debajo de sus posibilidades', ok:true},{t:'Invertir en productos sofisticados', ok:false}],
        ok:'La variable más correlacionada con la acumulación de riqueza no es el ingreso sino el comportamiento: gastar consistentemente menos de lo que se gana. Muchos con ingresos altos tienen patrimonio neto bajo por el lifestyle creep.',
        bad:'La variable más correlacionada con la acumulación de riqueza no es el ingreso sino el comportamiento: gastar consistentemente menos de lo que se gana. Muchos con ingresos altos tienen patrimonio neto bajo por el lifestyle creep.'},
      {type:'final', xp:20, msg:'¡El millonario real descubierto! Ingresos altos ≠ riqueza. Tasa de ahorro alta + tiempo + activos productivos = patrimonio real. El lujo visible suele ir de la mano con el balance invisible destruido.'},
    ],
  },

  /* ═══ MÓDULO 48 — Inversión ESG ════════════════════════════════ */
  {
    id:48, icon:'🌱', title:'ESG: Invertir con Valores',
    desc:'Qué es la inversión responsable y si realmente funciona.',
    xp:25, tag:'TENDENCIAS', tagC:'blue', users:'12.100',
    steps:[
      {type:'content', tag:'🌱 Módulo 49', title:'Qué Significa ESG',
        intro:'ESG = Environmental, Social, Governance. Los fondos ESG filtran empresas según criterios no solo financieros: huella de carbono, condiciones laborales, transparencia del consejo...',
        bullets:['🌍 Environmental: emisiones CO2, gestión de residuos, energías renovables','👥 Social: condiciones laborales, diversidad, cadena de suministro ética','🏛️ Governance: independencia del consejo, remuneración ejecutiva, transparencia','📊 Calificaciones de MSCI o Sustainalytics (de AAA a CCC)','⚠️ Problema: correlación entre agencias de solo el 60% — inconsistencias importantes'],
        fact:'Tesla tiene puntuación ESG muy baja en muchas agencias (condiciones laborales, gobernanza) pero es símbolo del coche eléctrico. Exxon, petrolera, tiene ESG alta por su gobernanza. El sistema tiene contradicciones claras.'},
      {type:'content', tag:'🌱 Módulo 49', title:'ESG: ¿Funciona Financieramente?',
        intro:'La gran pregunta: ¿los fondos ESG sacrifican rentabilidad por valores? Los datos son mixtos pero alentadores para el largo plazo.',
        bullets:['📊 MSCI World ESG vs MSCI World estándar en 10 años: diferencia < 0,3% anual','💰 Empresas ESG tienen mejor gobernanza = menos escándalos = menos crashes fuertes','🔄 "Greenium": algunos activos ESG tienen prima de valoración por demanda institucional creciente','⚠️ Fondos temáticos ESG (solar, agua): más concentrados, más volátiles','✅ Para largo plazo: ETFs ESG globales son comparables a los convencionales'],
        fact:'En 2021, los fondos ESG captaron el 60% de todos los flujos de inversión en Europa. La regulación UE (Taxonomía Verde) está acelerando la adopción institucional masiva.'},
      {type:'quiz', tag:'🌱 Quiz', title:'¿Cuál es la principal debilidad del sistema de puntuación ESG actual?',
        opts:[{t:'Los fondos ESG siempre tienen menor rentabilidad', ok:false},{t:'Las calificaciones ESG son muy inconsistentes entre agencias', ok:true},{t:'El ESG solo aplica a grandes empresas', ok:false},{t:'Los fondos ESG tienen siempre mayores comisiones', ok:false}],
        ok:'La correlación entre calificaciones ESG de MSCI y Sustainalytics es solo del 60% — vs el 99% entre agencias de rating de bonos. Tesla puede tener AAA en una agencia y CCC en otra. La falta de estandarización es el mayor problema del sistema ESG actual.',
        bad:'La correlación entre calificaciones ESG de MSCI y Sustainalytics es solo del 60% — vs el 99% entre agencias de rating de bonos. Tesla puede tener AAA en una agencia y CCC en otra. La falta de estandarización es el mayor problema del sistema ESG actual.'},
      {type:'final', xp:25, msg:'¡Inversión ESG desmitificada! Sabes distinguir washing de inversión responsable real, cómo analizar ratings ESG y si realmente sacrificas rentabilidad por valores. Spoiler: a largo plazo, no necesariamente.'},
    ],
  },

  /* ════════════════════════════════════ */
  ,{
    id:49, icon:'🧳', title:'Autónomos y Trabajadores por Cuenta Propia',
    desc:'Fiscalidad, deducciones y estrategia financiera del autónomo.',
    xp:30, tag:'ESPAÑA', tagC:'red', users:'22.400',
    steps:[
      {type:'content', tag:'💸 Módulo 50', title:'El Sistema Fiscal del Autónomo',
        intro:'Ser autónomo en España implica un sistema fiscal completamente diferente al del asalariado. Más libertad, pero también más responsabilidad — y más herramientas para optimizar.',
        bullets:['📋 Modelo 130: pago fraccionado trimestral del IRPF (20% del beneficio)','📊 Modelo 303: IVA trimestral (diferencia entre IVA repercutido y soportado)','💼 Gastos deducibles: local, vehículo (si es exclusivo), seguro médico, teléfono, formación','🏠 Home office: hasta 30% de los gastos del hogar si trabajas desde casa','💰 Cuota autónomo: €230-€500/mes según base (tarifa plana €80/mes primer año)'],
        fact:'Un autónomo puede deducirse hasta €500/año en formación, el 100% del seguro médico para él y su familia (hasta €500 por persona), y el 50% de las comidas de trabajo. El desconocimiento fiscal cuesta miles al año.'},
      {type:'quiz', tag:'💸 Quiz', title:'¿Qué porcentaje del beneficio paga el autónomo trimestralmente en el modelo 130?',
        opts:[{t:'10%', ok:false},{t:'15%', ok:false},{t:'20%', ok:true},{t:'30%', ok:false}],
        ok:'El modelo 130 es un pago a cuenta del IRPF: el 20% del beneficio neto trimestral (ingresos - gastos deducibles). Si pagas demasiado durante el año, Hacienda te devuelve la diferencia en la declaración anual.',
        bad:'El modelo 130 es un pago a cuenta del IRPF: el 20% del beneficio neto trimestral (ingresos - gastos deducibles). Si pagas demasiado durante el año, Hacienda te devuelve la diferencia en la declaración anual.'},
      {type:'final', xp:30, msg:'¡Finanzas de autónomo dominadas! Régimen de módulos vs. estimación directa, cuota autónomo, IVA trimestral, provisiones para impuestos. Ser autónomo inteligente es saber cuánto es tuyo realmente de cada factura.'},
    ],
  },
  {
    id:50, icon:'🌐', title:'Finanzas para Expatriados y Nómadas Digitales',
    desc:'Residencia fiscal, cuentas internacionales y la regla de 183 días.',
    xp:25, tag:'GLOBAL', tagC:'blue', users:'12.600',
    steps:[
      {type:'content', tag:'🌐 Módulo 51', title:'Residencia Fiscal: Lo Que Determina Dónde Pagas',
        intro:'Si vives fuera de España más de 183 días, dejas de ser residente fiscal español. Esto tiene implicaciones enormes: cambias de régimen tributario completo. Es una de las decisiones con mayor impacto fiscal que puedes tomar.',
        bullets:['📅 183 días: regla básica para determinar residencia fiscal en España','🌍 Paraísos fiscales: lista negra española — cambiar allí tiene reglas especiales','💼 Modelo 720: obligatorio declarar bienes en el extranjero >50.000€','🏦 Ley Beckham: régimen especial para extranjeros que trabajan en España (tipo fijo 24% hasta €600K)','⚠️ Doble imposición: España tiene convenios con >100 países para evitarla'],
        fact:'Portugal ofreció el régimen RNH (Residente No Habitual) hasta 2023: tipos fijos del 20% para extranjeros. Atrajo a miles de nómadas digitales españoles que reducían su factura fiscal un 50%.'},
      {type:'quiz', tag:'🌐 Quiz', title:'¿Cuántos días debes pasar fuera de España para dejar de ser residente fiscal?',
        opts:[{t:'90 días', ok:false},{t:'183 días', ok:true},{t:'270 días', ok:false},{t:'365 días', ok:false}],
        ok:'La regla de los 183 días: si pasas más de 183 días fuera de España en un año natural, dejas de ser residente fiscal. Pero Hacienda también mira dónde están tu familia y tu "centro de intereses económicos". No es solo contar días.',
        bad:'La regla de los 183 días: si pasas más de 183 días fuera de España en un año natural, dejas de ser residente fiscal. Pero Hacienda también mira dónde están tu familia y tu "centro de intereses económicos". No es solo contar días.'},
      {type:'final', xp:25, msg:'¡Expatriado financieramente preparado! Residencia fiscal, convenios de doble imposición, cuenta en destino, pensión prorrata. La globalización tiene sus ventajas fiscales — si sabes dónde mirar.'},
    ],
  },
  {
    id:51, icon:'🔐', title:'Seguridad Financiera Digital',
    desc:'Protege tu patrimonio digital de fraudes, phishing y ciberataques.',
    xp:20, tag:'PRÁCTICA', tagC:'green', users:'31.200',
    steps:[
      {type:'content', tag:'🔐 Módulo 52', title:'Las Amenazas Reales a tu Patrimonio Digital',
        intro:'El dinero digital requiere seguridad digital. El 90% de los fraudes financieros son evitables con medidas básicas que nadie te enseña. Un momento de descuido puede costarte años de ahorro.',
        bullets:['🎣 Phishing: emails/SMS falsos que imitan a tu banco. Nunca des credenciales por enlace','📱 SIM swapping: roban tu número para recibir los SMS de verificación. Activa la verificación por app','🔑 2FA de app (no SMS): Google Authenticator o Authy son infinitamente más seguros que el SMS','🏦 Cuenta corriente ≠ cuenta de inversión: no tengas todo en el mismo lugar','💾 Seed phrase de cripto: en papel, en lugar físico seguro — nunca digital ni en la nube'],
        fact:'En 2023, los españoles perdieron €330 millones en fraudes online financieros. El 70% de los casos comenzaron con un SMS o email aparentemente legítimo del banco. La primera línea de defensa es la duda.'},
      {type:'quiz', tag:'🔐 Quiz', title:'¿Cuál es la forma más segura de 2FA (doble factor de autenticación)?',
        opts:[{t:'SMS al teléfono móvil', ok:false},{t:'Email de verificación', ok:false},{t:'App de autenticación (Authy, Google Authenticator)', ok:true},{t:'Pregunta de seguridad', ok:false}],
        ok:'El SMS puede ser interceptado (SIM swapping). El email puede estar comprometido. Las preguntas de seguridad son predecibles. Las apps de autenticación generan códigos locales que solo existen en tu dispositivo y expiran cada 30 segundos.',
        bad:'El SMS puede ser interceptado (SIM swapping). El email puede estar comprometido. Las preguntas de seguridad son predecibles. Las apps de autenticación generan códigos locales que solo existen en tu dispositivo y expiran cada 30 segundos.'},
      {type:'final', xp:20, msg:'¡Seguridad digital financiera activada! 2FA, contraseñas únicas, phishing, revisión de extractos. La mayor amenaza a tu patrimonio digital no es el mercado — es el descuido de seguridad.'},
    ],
  },
  {
    id:52, icon:'🎓', title:'Educación Financiera de los Hijos',
    desc:'Cómo enseñar dinero a los más pequeños para que no partan de cero.',
    xp:20, tag:'VIDA', tagC:'purple', users:'25.800',
    steps:[
      {type:'content', tag:'🎓 Módulo 53', title:'Por Qué No Enseñamos Finanzas en Casa',
        intro:'El dinero es el tabú más grande en las familias españolas. No hablamos de sueldos, deudas ni inversiones. El resultado: los hijos llegan a adultos sin ninguna base financiera, repitiendo los mismos errores que sus padres.',
        bullets:['🐷 Hucha de 3 botes: gastar, ahorrar, donar. Desde los 5 años','💰 Paga semanal con responsabilidades: vincula el dinero al esfuerzo desde pequeños','🛒 Incluir a los hijos en decisiones de compra: explica el coste de oportunidad','📈 La primera inversión: abre una cuenta de custodia e invierte con ellos en un ETF','🗣️ Hablar de dinero sin vergüenza: los secretos financieros se heredan'],
        fact:'Warren Buffett compró su primera acción a los 11 años (Cities Service Preferred). A los 13, declaró impuestos por primera vez como vendedor de periódicos. La educación financiera temprana es el regalo más valioso que existe.'},
      {type:'quiz', tag:'🎓 Quiz', title:'¿Cuándo se puede empezar a enseñar conceptos financieros básicos a los niños?',
        opts:[{t:'Solo cuando empiezan el instituto', ok:false},{t:'Solo cuando pueden hacer matemáticas avanzadas', ok:false},{t:'Desde los 3-5 años con conceptos simples como el ahorro', ok:true},{t:'No es apropiado hasta los 18 años', ok:false}],
        ok:'Desde los 3-5 años los niños entienden conceptos como "no hay suficiente dinero para todo" y "si ahorro ahora, puedo comprar lo que quiero después". La hucha de 3 botes (gastar/ahorrar/donar) es perfecta para esta edad.',
        bad:'Desde los 3-5 años los niños entienden conceptos como "no hay suficiente dinero para todo" y "si ahorro ahora, puedo comprar lo que quiero después". La hucha de 3 botes (gastar/ahorrar/donar) es perfecta para esta edad.'},
    ],
  },


  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 41 — El Poder de los Hábitos Financieros
  ═══════════════════════════════════════════════════════════════════ */
  ,{
    id:53, icon:'⭐', title:'Hábitos Financieros que Cambian Todo',
    desc:'No es la estrategia perfecta. Es la rutina consistente.',
    xp:20, tag:'PSICOLOGÍA', tagC:'purple', users:'27.400',
    steps:[
      {type:'content', tag:'🔄 Módulo 42', title:'Por Qué los Buenos Planes Fracasan',
        intro:'Saber qué hacer es fácil. Hacerlo cada mes durante 20 años es lo difícil. La diferencia entre el inversor con €500.000 a los 60 y el que tiene €50.000 no es que uno supiera más — es que uno convirtió sus decisiones financieras en hábitos automáticos.',
        bullets:['🧠 Voluntad finita: cada decisión activa agota tu capacidad de autodisciplina','⚡ Automatización: lo que no requiere decisión, no puede fallar','📅 Inversión automática el día de cobro: no ves el dinero, no lo gastas','📊 "Pay yourself first": el ahorro va primero, el gasto va con lo que queda','🔁 El loop del hábito: señal → rutina → recompensa. Diseña cada uno conscientemente'],
        fact:'Un estudio de Vanguard comparó inversores con aportaciones automáticas vs manuales durante 10 años. Los automáticos tenían un patrimonio medio un 40% mayor. No porque fueran más listos — porque no fallaban.'},
      {type:'quiz', tag:'🔄 Quiz', title:'¿Por qué la inversión automática funciona mejor que la manual?',
        opts:[{t:'Porque los bancos ofrecen mejores tipos en aportaciones automáticas', ok:false},{t:'Porque elimina la decisión mensual y el riesgo de no hacerlo', ok:true},{t:'Porque invierte justo en el mejor momento del mes', ok:false},{t:'Porque tiene ventajas fiscales automáticas', ok:false}],
        ok:'La inversión automática elimina la fricción y la necesidad de voluntad. Cada vez que debes "decidir" si aportar, arriesgas que algo te distraiga. Automático = siempre funciona, sin esfuerzo.',
        bad:'La inversión automática elimina la fricción y la necesidad de voluntad. Cada vez que debes "decidir" si aportar, arriesgas que algo te distraiga. Automático = siempre funciona, sin esfuerzo.'},
      {type:'final', xp:20, msg:'¡Hábitos financieros instaurados! Revisión mensual, automatización del ahorro, regla de 24h antes de compras impulsivas. Los hábitos correctos hacen el trabajo aunque no pienses en dinero cada día.'},
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
      {type:'content', tag:'⚓ Módulo 43', title:'El Sesgo de Anclaje',
        intro:'Cuando un piso vale €300.000 y lo rebajan a €260.000, parece una ganga. Pero si el precio justo fuera €220.000, sigues pagando €40.000 de más. El primer número que escuchas ancla todas las comparaciones siguientes — aunque sea arbitrario.',
        bullets:['⚓ Anclaje: el primer precio que ves distorsiona todos los siguientes','🏷️ "Precio tachado" en tiendas: el precio alto inventado es el ancla','📈 En bolsa: "ya bajó un 50%, está barato" — puede seguir bajando otro 80%','💰 Salario: quien pide primero ancla toda la negociación','🧠 Antídoto: pregunta "¿qué vale realmente?" antes de ver el precio'],
        fact:'Un experimento de Ariely (MIT): hacer girar una ruleta y luego estimar el precio de un vino. Quienes sacaron números altos estimaban precios un 60-120% más altos. El número completamente aleatorio ancló la respuesta.'},
      {type:'content', tag:'⚓ Módulo 43', title:'El Efecto Dotación: Por Qué Valoramos Más lo Nuestro',
        intro:'Las personas valoran más los objetos que ya poseen que los que no tienen. En inversión: queremos vender caro lo que compramos aunque el precio justo sea menor. No queremos realizar pérdidas aunque mentalmente ya existan.',
        bullets:['🎁 Efecto dotación: poseer algo aumenta su valor percibido un 250% o más','📉 Aversión a las pérdidas: una pérdida de €100 duele el doble que una ganancia de €100','🔒 Inversor que no vende en pérdidas: espera que "vuelva al precio de compra" aunque no tenga lógica','✂️ Stop-loss: herramienta para forzar la venta y evitar que el efecto dotación destruya más capital','💡 Truco: pregunta "si no lo tuviera, ¿lo compraría hoy a este precio?" Si no, vende.'],
        fact:'Kahneman y Tversky (Nobel de Economía 2002) cuantificaron la aversión a las pérdidas: las pérdidas duelen 2,5 veces más de lo que las ganancias equivalentes agradan. Esto explica el 80% de las malas decisiones de inversión.'},
      {type:'quiz', tag:'⚓ Quiz', title:'Compraste acciones a €50. Ahora valen €30. ¿Cuál es la decisión racional?',
        opts:[{t:'Mantener hasta que vuelvan a €50 para no materializar la pérdida', ok:false},{t:'Evaluar si seguirías comprando HOY a €30 sabiendo lo que sabes', ok:true},{t:'Vender inmediatamente y asumir la pérdida siempre', ok:false},{t:'Comprar más para bajar el precio medio siempre', ok:false}],
        ok:'La pregunta correcta no es "¿vuelve a €50?" sino "¿si no tuviera estas acciones, las compraría hoy a €30?" Si la respuesta es no, el precio de compra es irrelevante. Es un coste hundido que no debe influir en decisiones futuras.',
        bad:'La pregunta correcta no es "¿vuelve a €50?" sino "¿si no tuviera estas acciones, las compraría hoy a €30?" Si la respuesta es no, el precio de compra es irrelevante. Es un coste hundido que no debe influir en decisiones futuras.'},
      {type:'final', xp:25, msg:'¡Sesgos de precio desmontados! Anclaje, efecto señuelo, precio redondo, comparación relativa. El precio que ves es una historia que te cuentan. Ahora sabes cómo decodificarla antes de pagar.'},
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
      {type:'content', tag:'🎲 Módulo 44', title:'¿Qué es el Riesgo Realmente?',
        intro:'El riesgo no es solo "puedo perder dinero". Hay múltiples tipos de riesgo que el inversor debe manejar: riesgo de mercado (volatilidad), riesgo de liquidez (no poder vender), riesgo de concentración, riesgo de inflación y riesgo de longevidad.',
        bullets:['📊 Volatilidad: la desviación estándar de los retornos. Alta volatilidad = mayor incertidumbre','📉 Drawdown máximo: la mayor caída pico-a-valle históricamente. S&P500: -56% en 2008','⚖️ Ratio de Sharpe: rentabilidad extra por unidad de riesgo tomado. Más alto = mejor','🔒 Riesgo de liquidez: activos que no puedes vender rápido (inmobiliario, startups, PE)','⏰ Riesgo de longevidad: quedarte sin capital antes de morir'],
        fact:'El Bitcoin tiene una volatilidad anualizada del 70-90%. El S&P 500: 15-20%. Los bonos del Estado alemán: 5-7%. La volatilidad es el precio que pagas por la rentabilidad esperada.'},
      {type:'content', tag:'🎲 Módulo 44', title:'Cómo Gestionar el Riesgo Personal',
        intro:'La gestión del riesgo no es eliminar el riesgo — es tomar el riesgo correcto para tu situación. Un 25 años puede tolerar más riesgo (tiene tiempo). Un 60 años con pocos ahorros, no.',
        bullets:['📅 Horizonte temporal: más tiempo = puedes tomar más riesgo de mercado','💰 Capacidad financiera: con fondo de emergencia completo, el riesgo de mercado importa menos','🧠 Tolerancia emocional: si no puedes dormir con una caída del 40%, reduce riesgo','📊 Regla del 100-edad: porcentaje en renta variable = 100 - tu edad (regla simple, no perfecta)','🛡️ Seguro de vida e invalidez: protege el activo más valioso — tu capacidad de ganar dinero'],
        fact:'Un estudio de Vanguard: el error más costoso de los inversores no es la mala selección de activos sino la venta en pánico en los crashes. El riesgo de comportamiento supera al riesgo de mercado.'},
      {type:'quiz', tag:'🎲 Quiz', title:'¿Qué mide el "drawdown máximo" de una inversión?',
        opts:[{t:'La comisión máxima cobrada', ok:false},{t:'La mayor pérdida desde un máximo hasta el siguiente mínimo', ok:true},{t:'La volatilidad anualizada', ok:false},{t:'El año de peor rentabilidad', ok:false}],
        ok:'El drawdown máximo es la peor caída posible que experimentaste si compraste en el peor momento. Para el S&P 500: -56% en 2008-09. Saber este número ayuda a calibrar si tu tolerancia al riesgo es real o teórica.',
        bad:'El drawdown máximo es la peor caída posible que experimentaste si compraste en el peor momento. Para el S&P 500: -56% en 2008-09. Saber este número ayuda a calibrar si tu tolerancia al riesgo es real o teórica.'},
      {type:'final', xp:30, msg:'¡Riesgo avanzado comprendido! Correlación, volatilidad real, VaR, cola larga, cisnes negros. Diversificación básica no basta — necesitas entender qué activos realmente descorrelacionan cuando más importa.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 44 — El Mercado Inmobiliario Español
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:56, icon:'🌇', title:'Inmobiliario en España: La Guía Real',
    desc:'Burbuja, alquiler, zonas tensionadas y la verdad sobre el ladrillo.',
    xp:30, tag:'ESPAÑA', tagC:'red', users:'34.200',
    steps:[
      {type:'content', tag:'🏘️ Módulo 45', title:'El Precio de la Vivienda en España',
        intro:'España tiene uno de los mercados inmobiliarios más comentados de Europa. La burbuja de 2007 (y el crash posterior del -40%) marcó a toda una generación. La recuperación post-COVID y las tensiones de oferta han creado una nueva situación que no tiene respuestas fáciles.',
        bullets:['📈 Precio medio España 2024: ~€2.200/m² (vs €2.700 en el pico de 2007)','🏙️ Madrid/Barcelona: €4.500-€6.000/m² en zonas prime','📊 Esfuerzo para comprar vivienda: 8-9 años de sueldo bruto en las grandes ciudades','📉 Zona de burbuja: PER inmobiliario (precio/alquiler anual) > 25 en muchas ciudades','⚡ Tensión de oferta: Ley de Vivienda 2023 limitó subidas de alquiler en zonas tensionadas'],
        fact:'En 1970, un español de clase media tardaba ~3 años de sueldo en pagar una vivienda. En 2024: 8-9 años. La brecha entre salarios y precios inmobiliarios no ha parado de crecer en décadas.'},
      {type:'content', tag:'🏘️ Módulo 45', title:'Invertir en Vivienda para Alquiler: Los Números',
        intro:'La rentabilidad bruta del alquiler en España es del 5-7% en ciudades medianas y 3-4% en Madrid/Barcelona. Pero la neta, tras impuestos, gastos de mantenimiento, seguros y vacíos, suele ser 2-4%. Menos brillante que en el titular.',
        bullets:['📊 Rentabilidad bruta = alquiler anual / precio compra × 100','💸 Gastos típicos: IBI, comunidad, mantenimiento, seguro, vacíos = 25-35% del alquiler','🧾 Tributación: los ingresos por alquiler como persona física tributan en IRPF (hasta 47%)','⚖️ Reducción del 60%: en alquileres de vivienda habitual, el 60% del rendimiento está exento','📍 Mejor rentabilidad: ciudades medianas (Valencia, Málaga, Zaragoza) vs Madrid/Barcelona'],
        fact:'Un piso de €200.000 que alquila a €800/mes da una rentabilidad bruta del 4,8%. Menos gastos (30%), menos impuestos (IRPF 30%): rentabilidad neta real ~2,5%. El S&P 500 ha dado un 10% anual en el mismo período.'},
      {type:'quiz', tag:'🏘️ Quiz', title:'¿Qué es la "rentabilidad neta" del alquiler?',
        opts:[{t:'El alquiler mensual multiplicado por 12', ok:false},{t:'El ingreso anual de alquiler menos todos los gastos e impuestos', ok:true},{t:'El precio de venta menos el precio de compra', ok:false},{t:'La apreciación anual del precio del inmueble', ok:false}],
        ok:'La rentabilidad neta descuenta todos los costes reales: IBI, comunidad, mantenimiento, seguros, periodos vacíos e impuestos. La bruta engaña — la neta es la verdad sobre lo que ganas.',
        bad:'La rentabilidad neta descuenta todos los costes reales: IBI, comunidad, mantenimiento, seguros, periodos vacíos e impuestos. La bruta engaña — la neta es la verdad sobre lo que ganas.'},
      {type:'final', xp:30, msg:'¡Mercado inmobiliario español dominado! PER inmobiliario, rent vs. buy, zonas tensionadas, hipoteca vs. alquiler a largo plazo. El ladrillo tiene su lógica — y ahora la tienes tú también.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 45 — Wealth Building: Las 3 Fases
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:57, icon:'📐', title:'Las 3 Fases para Construir Patrimonio',
    desc:'Supervivencia → Crecimiento → Protección. El mapa completo.',
    xp:25, tag:'FUNDAMENTAL', tagC:'green', users:'29.100',
    steps:[
      {type:'content', tag:'🏗️ Módulo 46', title:'Fase 1: Supervivencia Financiera',
        intro:'Antes de invertir un solo euro, necesitas tener los cimientos. Sin ellos, cualquier estrategia de inversión es un castillo en el aire que se derrumba al primer imprevisto.',
        bullets:['🛡️ Fondo de emergencia: 3-6 meses de gastos en cuenta remunerada','💳 Sin deudas de alto interés (>15% TAE)','📋 Seguro de salud, vida e invalidez básicos','🏠 No gastar más del 30% del ingreso en vivienda','✅ Cuando esto esté, y solo entonces, empieza a invertir'],
        fact:'El 60% de los españoles no podría aguantar 3 meses sin ingresos con sus ahorros actuales. La fase de supervivencia no es opcional — sin ella, el primer imprevisto destruye años de trabajo.'},
      {type:'content', tag:'🏗️ Módulo 46', title:'Fase 2: Crecimiento Agresivo',
        intro:'Una vez tienes los cimientos, el objetivo es hacer crecer el patrimonio lo más rápido posible. Esta fase es donde se construye la riqueza. Requiere alta tasa de ahorro, inversión sistemática y tolerancia al riesgo.',
        bullets:['📈 Máxima tasa de ahorro posible (objetivo: 30-50%)','🚀 Alta exposición a renta variable (80-100% de la cartera)','💼 Desarrollo de carrera para maximizar ingresos','🏢 Side business si es posible','⏰ Esta fase dura décadas — la paciencia es la clave'],
        fact:'La diferencia entre ahorrar el 20% vs el 40% del sueldo no es llegar antes a la meta — es llegar en la mitad del tiempo. Con el 50% de ahorro puedes "jubilarte" en 17 años desde cero.'},
      {type:'content', tag:'🏗️ Módulo 46', title:'Fase 3: Protección y Legado',
        intro:'Cuando tienes suficiente, el objetivo cambia: no perder lo que tienes. En esta fase se reduce el riesgo, se diversifica más, se planifica la herencia y se piensa en el impacto más allá del dinero.',
        bullets:['🛡️ Reducir renta variable (más bonos, inmobiliario, cash)','⚖️ Planificación sucesoria: testamento, seguros de vida, estructura patrimonial','🌍 Diversificación geográfica: no todo en un país o moneda','💸 La regla del 4% para retiradas sostenibles','🎯 Pregunta clave: "¿cuánto es suficiente?"'],
        fact:'"Si tienes suficiente para vivir el resto de tu vida haciendo lo que amas, eres más rico que el 99% del planeta." — Naval Ravikant'},
      {type:'quiz', tag:'🏗️ Quiz', title:'¿Qué debes tener ANTES de empezar a invertir en bolsa?',
        opts:[{t:'Al menos €10.000 de capital inicial', ok:false},{t:'Fondo de emergencia y sin deudas de alto interés', ok:true},{t:'Conocimiento avanzado de análisis técnico', ok:false},{t:'Una cuenta en un broker profesional', ok:false}],
        ok:'Sin fondo de emergencia, cualquier gasto inesperado te forzará a vender inversiones — posiblemente en pérdidas. La deuda de alto interés garantiza una rentabilidad negativa segura. Estos cimientos van primero.',
        bad:'Sin fondo de emergencia, cualquier gasto inesperado te forzará a vender inversiones — posiblemente en pérdidas. La deuda de alto interés garantiza una rentabilidad negativa segura. Estos cimientos van primero.'},
      {type:'final', xp:25, msg:'¡Las 3 fases del patrimonio claras! Acumulación (máximo ahorro) → crecimiento (optimización) → preservación (gestión del riesgo). Cada fase tiene sus reglas — mezclarlas es el error más caro.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 46 — Cómo Leer un Balance de Empresa
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:58, icon:'🗃️', title:'Cómo Leer un Balance: Guía del Inversor',
    desc:'Activos, pasivos, patrimonio neto y las señales que revelan la salud real.',
    xp:30, tag:'AVANZADO', tagC:'blue', users:'13.700',
    steps:[
      {type:'content', tag:'📋 Módulo 47', title:'La Ecuación Contable Fundamental',
        intro:'Todo balance de empresa sigue una ecuación simple: Activos = Pasivos + Patrimonio Neto. Lo que tiene la empresa = lo que debe + lo que pertenece a los accionistas. Esta ecuación nunca falla.',
        bullets:['📦 Activo circulante: lo que se convierte en cash en <12 meses (caja, clientes, inventario)','🏭 Activo fijo: lo que dura más de un año (maquinaria, edificios, patentes)','💳 Pasivo corriente: lo que se debe en <12 meses (proveedores, deuda corto plazo)','🏦 Pasivo largo plazo: deuda a más de un año (bonos, préstamos bancarios)','💰 Patrimonio neto: lo que queda para los accionistas si se paga todo'],
        fact:'Enron tenía un balance aparentemente sólido antes de su colapso en 2001. Los auditores descubrieron $1.200 millones en pasivos ocultos en entidades especiales no consolidadas. Leer un balance requiere ir más allá de los números superficiales.'},
      {type:'content', tag:'📋 Módulo 47', title:'Las Métricas que Importan',
        intro:'El balance por sí solo dice poco. Cobran significado cuando calculas ratios que relacionan las diferentes partidas y las comparas con empresas del mismo sector.',
        bullets:['⚡ Current Ratio = Activo Circulante / Pasivo Corriente. >1,5 = sano','🏦 Deuda neta = Deuda total - Caja. Si es negativa, la empresa tiene más caja que deuda','📊 D/E Ratio = Deuda / Patrimonio. >2 puede ser preocupante según sector','💸 Tangible Book Value: lo que queda tras eliminar activos intangibles (marca, goodwill)','🎯 Return on Equity (ROE) = Beneficio / Patrimonio. >15% sostenido indica moat real'],
        fact:'Apple tiene más de $160.000M en caja neta. Berkshire Hathaway: $160.000M. Amazon: $70.000M. Estas reservas les dan ventaja competitiva enorme: pueden invertir en crisis cuando otros no pueden.'},
      {type:'quiz', tag:'📋 Quiz', title:'¿Qué indica un "Current Ratio" menor que 1?',
        opts:[{t:'La empresa está creciendo rápidamente', ok:false},{t:'La empresa tiene más deudas a corto plazo que activos líquidos a corto plazo', ok:true},{t:'La empresa es muy rentable', ok:false},{t:'El precio de la acción es bajo', ok:false}],
        ok:'Current Ratio < 1 significa que la empresa debe más de lo que puede cobrar en el próximo año. No es automáticamente catastrófico (depende del sector), pero es una señal de alerta que requiere análisis.',
        bad:'Current Ratio < 1 significa que la empresa debe más de lo que puede cobrar en el próximo año. No es automáticamente catastrófico (depende del sector), pero es una señal de alerta que requiere análisis.'},
      {type:'final', xp:30, msg:'¡Balance de empresa descifrado! Activos corrientes vs. no corrientes, pasivos, ratio de liquidez, endeudamiento. Ahora puedes saber si una empresa tiene dinero de verdad o una fachada contable bien pintada.'},
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
      {type:'content', tag:'🔬 Módulo 48', title:'Los 7 Sesgos que Destruyen el Patrimonio',
        intro:'La economía conductual estudia por qué las personas toman decisiones irracionales con el dinero de forma sistemática y predecible. Richard Thaler (Nobel 2017) y Daniel Kahneman (Nobel 2002) cartografiaron el mapa completo.',
        bullets:['💸 Contabilidad mental: €100 de nómina ≠ €100 de casino (aunque valen lo mismo)','🔁 Status quo: preferimos no cambiar aunque cambiar sea mejor','📅 Descuento hiperbólico: preferimos €90 hoy a €100 en un mes (arruina el ahorro)','📰 Heurística de disponibilidad: sobreestimamos lo que sale en las noticias','🎲 Ilusión de control: creemos controlar resultados aleatorios (market timing)','📈 Exceso de confianza: el 80% cree ser mejor conductor que la media','🐑 Comportamiento de manada: compramos cuando todos compran (máximos)'],
        fact:'Un estudio de Dalbar: el inversor medio del S&P 500 obtuvo un 3,7% anual en los últimos 30 años. El índice dio un 10,7%. La diferencia: 7% destruido por los propios sesgos del inversor.'},
      {type:'quiz', tag:'🔬 Quiz', title:'¿Qué es el "descuento hiperbólico"?',
        opts:[{t:'Preferir rentabilidades hipotéticas sobre rentabilidades reales', ok:false},{t:'Preferir recompensas menores hoy sobre recompensas mayores en el futuro', ok:true},{t:'Descontar el efecto de la inflación de forma excesiva', ok:false},{t:'Sobrevalorar activos en momentos de euforia', ok:false}],
        ok:'El descuento hiperbólico explica por qué no ahorramos: el placer de gastar HOY es muy concreto, el beneficio de ahorrar en 30 años es abstracto. Nuestro cerebro descuenta el futuro de forma no lineal — el fondo automático lo compensa.',
        bad:'El descuento hiperbólico explica por qué no ahorramos: el placer de gastar HOY es muy concreto, el beneficio de ahorrar en 30 años es abstracto. Nuestro cerebro descuenta el futuro de forma no lineal — el fondo automático lo compensa.'},
      {type:'final', xp:25, msg:'¡Economía conductual interiorizada! Loss aversion, contabilidad mental, exceso de confianza, efecto manada. Saber cómo funciona tu cerebro con el dinero es la primera línea de defensa contra tus propios errores.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 48 — El Impuesto sobre el Patrimonio y la Planificación
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:60, icon:'🖊️', title:'Optimización Fiscal Avanzada en España',
    desc:'Patrimonio, herencias, plusvalías y las estructuras que usan los ricos.',
    xp:35, tag:'ESPAÑA', tagC:'red', users:'16.100',
    steps:[
      {type:'content', tag:'⚖️ Módulo 49', title:'El Impuesto sobre el Patrimonio',
        intro:'España es uno de los pocos países europeos que mantiene el impuesto sobre el patrimonio. Grava los activos netos por encima de un mínimo exento. Pero hay comunidades autónomas que lo bonifican al 100% — incluyendo Madrid.',
        bullets:['📊 Tipo: 0,2% a 3,5% sobre patrimonio neto que exceda el mínimo exento','💰 Mínimo exento general: €700.000 por persona (más exención de vivienda habitual hasta €300.000)','🏛️ Madrid: bonificación del 100% — en la práctica no se paga nada','🌍 Comparativa: Francia, Alemania y Reino Unido no tienen impuesto sobre el patrimonio','⚠️ Impuesto de Solidaridad de las Grandes Fortunas (>€3M): alternativo para Madrid desde 2023'],
        fact:'Una pareja con patrimonio de €2M en Madrid no paga impuesto sobre el patrimonio: cada uno tiene €1M, con €700K de mínimo exento + €300K de vivienda habitual = justo al límite. Planificación legal al 100%.'},
      {type:'content', tag:'⚖️ Módulo 49', title:'Impuesto de Sucesiones y Herencias',
        intro:'El impuesto de sucesiones varía enormemente por comunidad autónoma. La diferencia entre heredar en Madrid vs en otra comunidad puede ser de cientos de miles de euros. El desconocimiento es el enemigo.',
        bullets:['🏛️ Madrid: bonificación del 99% para cónyuge, descendientes y ascendientes','🌍 Cataluña, Andalucía, C. Valenciana: tipos más altos pero con bonificaciones crecientes','📋 Donaciones en vida: pueden ser fiscalmente más eficientes que la herencia','🏠 Transmisión de empresa familiar: reducción del 95% del valor en el IP si cumple requisitos','⚠️ Residencia fiscal: donde estás domiciliado determina qué normativa autonómica aplica'],
        fact:'Heredar €300.000 en Madrid: impuesto = €0 (bonificación 99%). El mismo importe en algunas comunidades puede generar €60.000-€90.000 de impuesto. La residencia fiscal es una decisión patrimonial de primer orden.'},
      {type:'quiz', tag:'⚖️ Quiz', title:'En España, ¿qué comunidad autónoma tiene una bonificación del 99% en el impuesto de sucesiones?',
        opts:[{t:'Cataluña', ok:false},{t:'Andalucía', ok:false},{t:'Madrid', ok:true},{t:'País Vasco', ok:false}],
        ok:'Madrid aplica una bonificación del 99% en cuota del impuesto de sucesiones y donaciones entre familiares directos. Esto significa que en la práctica prácticamente no se paga. Es un factor importante en decisiones de residencia fiscal.',
        bad:'Madrid aplica una bonificación del 99% en cuota del impuesto de sucesiones y donaciones entre familiares directos. Esto significa que en la práctica prácticamente no se paga. Es un factor importante en decisiones de residencia fiscal.'},
      {type:'final', xp:35, msg:'¡Fiscalidad española optimizada! ETVE, holding familiar, planes de pensiones, SOCIMI, Beckham Law. El contribuyente informado paga lo que debe, ni un euro más. La optimización fiscal es legal y es inteligente.'},
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
      {type:'content', tag:'💤 Módulo 50', title:'El Espectro: De Activo a Pasivo',
        intro:'"Ingreso pasivo" se ha convertido en el término más abusado del marketing financiero de Instagram. La realidad es que nada es completamente pasivo. La diferencia está en cuánto tiempo activo requiere por euro generado.',
        bullets:['📊 Dividendos/ETFs: el más pasivo. Cero gestión, rendimiento automático','🏠 Alquiler: semi-pasivo. Requiere gestión, reparaciones, relación con inquilinos','💻 Curso online: pasivo después del esfuerzo inicial (meses de creación)','📱 App/Software: pasivo tras el desarrollo (años de trabajo)','❌ "Hacer €5.000/mes mientras duermes en 30 días": siempre es mentira'],
        fact:'Robert Kiyosaki popularizó la idea de ingresos pasivos en 1997. Pero incluso su negocio de "educación financiera" requiere conferencias, libros y marketing activo. El verdadero pasivo tarda años en construirse.'},
      {type:'content', tag:'💤 Módulo 50', title:'Los Números Reales del Ingreso Pasivo',
        intro:'Para vivir de ingresos pasivos necesitas capital. El capital no cae del cielo. Entender cuánto necesitas y cuánto tiempo tardarás en acumularlo es el primer paso honesto.',
        bullets:['📊 Con ETF al 4% de retiro: para €1.000/mes necesitas €300.000 de capital','🏠 Con alquiler al 4% neto: para €800/mes necesitas €240.000 en inmuebles','💸 Dividendos al 4% yield: para €1.500/mes necesitas €450.000 en cartera','💼 Negocio automatizado: pueden superar el 20% de retorno, pero llevan 3-5 años','⏰ Tiempo para acumular €300.000 ahorrando €500/mes al 7%: ~27 años'],
        fact:'La definición legal de "rendimientos del capital mobiliario" (dividendos, intereses) en España cotiza entre el 19% y el 28%. El "ingreso pasivo" tiene su propio impuesto — planificarlo bien puede ahorrarte el 10% del total.'},
      {type:'quiz', tag:'💤 Quiz', title:'¿Cuánto capital necesitas para generar €1.000/mes usando la regla del 4%?',
        opts:[{t:'€120.000', ok:false},{t:'€300.000', ok:true},{t:'€500.000', ok:false},{t:'€1.000.000', ok:false}],
        ok:'€1.000/mes = €12.000/año. Con la regla del 4%: necesitas €12.000 / 0,04 = €300.000 de capital. Con esa cantidad, puedes retirar el 4% anual indefinidamente sin agotar el patrimonio (históricamente).',
        bad:'€1.000/mes = €12.000/año. Con la regla del 4%: necesitas €12.000 / 0,04 = €300.000 de capital. Con esa cantidad, puedes retirar el 4% anual indefinidamente sin agotar el patrimonio (históricamente).'},
      {type:'final', xp:25, msg:'¡Ingresos pasivos reales identificados! Dividendos, rentas de alquiler, regalías, intereses vs. los «pasivos» que requieren trabajo constante. La clave no es el nombre — es si el dinero entra mientras duermes.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 50 — Globalización, Geopolítica y tu Cartera
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:62, icon:'🗺️', title:'Geopolítica y Mercados: Lo que Debes Saber',
    desc:'Cómo las tensiones globales afectan a tus inversiones y qué hacer.',
    xp:25, tag:'GLOBAL', tagC:'blue', users:'19.400',
    steps:[
      {type:'content', tag:'🌍 Módulo 51', title:'Cómo la Geopolítica Mueve los Mercados',
        intro:'Los mercados financieros no existen en el vacío. Las guerras, las sanciones, los acuerdos comerciales y las elecciones mueven precios. Pero el inversor de largo plazo tiene una ventaja: el mercado siempre ha superado los eventos geopolíticos.',
        bullets:['⚔️ Guerras: generalmente caídas iniciales seguidas de recuperación rápida','🗳️ Elecciones: los mercados odian la incertidumbre más que cualquier resultado','🛢️ Commodities: petróleo, gas y materias primas reaccionan inmediatamente a tensiones','💱 Divisas: el dólar es el activo de refugio universal en tiempos de crisis','🌐 Diversificación global: distribuye el riesgo geopolítico entre 23+ países'],
        fact:'El S&P 500 ha subido durante guerras (Vietnam, Golf, Irak). El error es asumir que "esta vez es diferente". En el Pearl Harbor, el mercado cayó un 11% en días — y en 6 meses había recuperado todo.'},
      {type:'quiz', tag:'🌍 Quiz', title:'¿Cuál es la estrategia más robusta frente a riesgos geopolíticos?',
        opts:[{t:'Convertir todo a cash antes de cada crisis', ok:false},{t:'Concentrarse en empresas del sector defensa', ok:false},{t:'Diversificación global que distribuye el riesgo entre países', ok:true},{t:'Invertir solo en bonos del gobierno alemán', ok:false}],
        ok:'La diversificación global (MSCI World, por ejemplo) distribuye el riesgo geopolítico entre 23 países. Si una región sufre, otras compensan. Es la única estrategia que no requiere predecir el próximo conflicto.',
        bad:'La diversificación global (MSCI World, por ejemplo) distribuye el riesgo geopolítico entre 23 países. Si una región sufre, otras compensan. Es la única estrategia que no requiere predecir el próximo conflicto.'},
      {type:'final', xp:25, msg:'¡Geopolítica y mercados conectados! Sanciones, materias primas, divisas de reserva, riesgo político. El mundo es el mercado más grande — y ahora entiendes cómo los eventos globales mueven tu cartera.'},
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
      {type:'content', tag:'📡 Módulo 52', title:'Las Variables Macro que Mueven los Mercados',
        intro:'El inversor que entiende macroeconomía no predice el futuro — entiende el contexto. No te dice cuándo comprar, pero sí en qué entorno estás y cómo afecta a tus activos.',
        bullets:['📈 PIB creciendo + inflación controlada = entorno ideal para acciones','📉 Recesión = beneficios empresariales bajan → bolsa baja','🔥 Inflación alta = BCE sube tipos → bonos bajan, hipotecas suben','💸 Tipos bajos = dinero barato → crecen bolsa, inmobiliario y cripto','🔄 El ciclo completo: expansión → pico → recesión → recuperación → expansión'],
        fact:'La curva de inversión del bono americano (tipos a corto > tipos a largo) ha precedido a las 7 últimas recesiones americanas con un adelanto de 12-18 meses. No es perfecta, pero es la mejor señal macro que tenemos.'},
      {type:'content', tag:'📡 Módulo 52', title:'El Banco Central Europeo y Tu Hipoteca',
        intro:'El BCE fija el tipo de interés de referencia para la eurozona. Este tipo determina el coste del dinero en toda Europa y afecta directamente a tus hipotecas, préstamos y depósitos. Entender cómo funciona es finanzas personales de primer orden.',
        bullets:['🏦 Tipo BCE → Tipo Euribor → Tu hipoteca variable','📊 Euribor 12 meses: el índice más usado en hipotecas variables españolas','📈 Cuando BCE sube tipos: hipoteca variable sube, depósitos mejoran, bonos bajan','📉 Cuando BCE baja tipos: hipoteca variable baja, depósitos empeoran, bonos suben','🎯 Hipoteca fija: te inmuniza contra los cambios del BCE — pagas estabilidad'],
        fact:'En 2022, el BCE subió tipos de 0% al 4,5% en solo 14 meses. Una hipoteca variable de €200.000 a 25 años pasó de €700/mes a €1.050/mes. +€350/mes de coste adicional de un año a otro.'},
      {type:'quiz', tag:'📡 Quiz', title:'Si el BCE sube los tipos de interés, ¿qué ocurre con el precio de los bonos existentes?',
        opts:[{t:'Suben porque ahora rinden más', ok:false},{t:'Bajan porque los nuevos bonos son más atractivos', ok:true},{t:'No cambian ya que el cupón es fijo', ok:false},{t:'Depende de si son bonos públicos o corporativos', ok:false}],
        ok:'Relación inversa tipos-bonos: si el BCE emite nuevos bonos al 4%, nadie quiere tus bonos al 2%. Para que sean atractivos, su precio debe bajar hasta que la rentabilidad efectiva iguale el 4%. Tipos suben = precio bonos baja.',
        bad:'Relación inversa tipos-bonos: si el BCE emite nuevos bonos al 4%, nadie quiere tus bonos al 2%. Para que sean atractivos, su precio debe bajar hasta que la rentabilidad efectiva iguale el 4%. Tipos suben = precio bonos baja.'},
      {type:'final', xp:30, msg:'¡Macroeconomía del inversor dominada! PIB, inflación, tipos de interés, balanza de pagos. No necesitas predecir el ciclo — necesitas no sorprenderte cuando cambia. Ahora tienes el mapa del territorio.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 52 — Tu Primer Millón: El Plan Concreto
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:64, icon:'🥇', title:'El Camino al Primer Millón: Plan Real',
    desc:'No motivación. Matemáticas, plazos y los pasos exactos.',
    xp:40, tag:'MASTER', tagC:'gold', users:'52.100',
    steps:[
      {type:'content', tag:'🎯 Módulo 53', title:'Las Matemáticas del Primer Millón',
        intro:'Un millón de euros no es inalcanzable para una persona normal. Es matemática y tiempo. El problema es que nadie te lo explica en términos concretos sin intentar venderte algo.',
        bullets:['💰 Ahorrando €500/mes al 8% anual → €1M en 37 años','💰 Ahorrando €1.000/mes al 8% anual → €1M en 27 años','💰 Ahorrando €2.000/mes al 8% anual → €1M en 19 años','💰 Ahorrando €500/mes al 8% + ingreso extra de €500/mes reinvertido → €1M en 26 años','⏰ La variable más poderosa no es cuánto ganas — es a qué edad empiezas'],
        fact:'Si empiezas a los 25 con €500/mes, tienes €1M a los 62. Si empiezas a los 35 con €1.000/mes (el doble), llegas a los 62 con €850.000. El que empezó con menos dinero llega con más. El tiempo es el activo.'},
      {type:'content', tag:'🎯 Módulo 53', title:'Los 5 Pasos No Negociables',
        intro:'Todo el mundo que ha alcanzado libertad financiera sin herencia ni lotería ha seguido una versión de estos mismos 5 pasos. No hay atajos — pero sí hay un camino probado.',
        bullets:['1️⃣ Maximiza tu ingreso activo: carrera, negociación, skills que pagan bien','2️⃣ Minimiza gastos fijos: vivienda <30% ingresos, no deuda de consumo','3️⃣ Automatiza el ahorro: el 20-40% del ingreso va a inversión el mismo día de cobro','4️⃣ Invierte en activos que generan retornos compuestos: ETFs globales + inmobiliario si aplica','5️⃣ No interrumpas el proceso: el mayor error es vender en los crashes o parar las aportaciones'],
        fact:'Morgan Housel en "La Psicología del Dinero": Ronald Read, conserje y empleado de gasolinera, dejó €8 millones al morir a los 92 años. Nunca tuvo un sueldo alto. Simplemente invirtió sistemáticamente en acciones durante 70 años y nunca vendió.'},
      {type:'quiz', tag:'🎯 Quiz', title:'Inviertes €500/mes al 8% anual. ¿Cuánto tendrás en 30 años?',
        opts:[{t:'€180.000 (lo aportado)', ok:false},{t:'€330.000 (aproximadamente el doble)', ok:false},{t:'€680.000 (más del triple por el interés compuesto)', ok:true},{t:'€1.200.000 (imposible con esa cantidad)', ok:false}],
        ok:'€500/mes × 12 meses × 30 años = €180.000 aportados. Al 8% con interés compuesto = €679.000. El interés compuesto casi cuadruplica tu dinero. Y si hubieran sido 40 años: €1.50M. El tiempo es el multiplicador.',
        bad:'€500/mes × 12 meses × 30 años = €180.000 aportados. Al 8% con interés compuesto = €679.000. El interés compuesto casi cuadruplica tu dinero. Y si hubieran sido 40 años: €1.50M. El tiempo es el multiplicador.'},
      {type:'quiz', tag:'🎯 Quiz', title:'¿Cuál es el factor MÁS importante para llegar al primer millón?',
        opts:[{t:'Elegir las mejores acciones', ok:false},{t:'Empezar lo antes posible y ser constante', ok:true},{t:'Tener un sueldo muy alto', ok:false},{t:'Conocer el momento exacto para comprar y vender', ok:false}],
        ok:'Empezar pronto y no parar es estadísticamente el factor dominante. El 80% del millón se genera en los últimos 10 años gracias al interés compuesto sobre una base grande. Quien empieza a los 25 con €300/mes llega antes que quien empieza a los 40 con €1.500/mes.',
        bad:'Empezar pronto y no parar es estadísticamente el factor dominante. El 80% del millón se genera en los últimos 10 años gracias al interés compuesto sobre una base grande. Quien empieza a los 25 con €300/mes llega antes que quien empieza a los 40 con €1.500/mes.'},
      {type:'final', xp:40, msg:'¡El camino al primer millón trazado! Tasa de ahorro + tiempo + rentabilidad compuesta + ingresos crecientes. No hay atajo — pero sí hay un plan. Y ahora el tuyo está definido con números reales.'},
    ],
  },
  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 65 — El Poder del Networking Financiero
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:65, icon:'🕸️', title:'Networking que Construye Riqueza',
    desc:'Las personas que conoces determinan tu techo de ingresos más que tu CV.',
    xp:25, tag:'CARRERA', tagC:'blue', users:'16.200',
    steps:[
      {type:'content', tag:'🤝 Módulo 66', title:'Por Qué Tu Red Vale Más que Tu Título',
        intro:'El 70-80% de los empleos bien remunerados se cubren antes de publicarse. Los estudios son claros: las personas con redes fuertes ganan significativamente más a lo largo de su carrera y ascienden más rápido. El networking no es "hacer contactos" — es construir relaciones que generan valor mutuo.',
        bullets:['💼 El 80% de los puestos de trabajo se cubren por referidos — no por portales de empleo','📊 Los empleados referidos ganan de media un 8-15% más desde el primer día','🤝 Dar primero: ofrecer valor antes de pedir es la base del networking efectivo','🌐 LinkedIn: el 97% de los reclutadores lo usan — tu perfil es tu currículum vivo','☕ La reunión "para tomar un café" ha generado más millones que mil CVs'],
        fact:'Jeff Weiner, CEO de LinkedIn, calculó que cada conexión de primer grado en su red valdría estadísticamente unos $1.700 anuales en oportunidades de carrera.'},
      {type:'content', tag:'🤝 Módulo 66', title:'El Framework de Networking Efectivo',
        intro:'El networking de alto valor no es coleccionar contactos — es profundizar en relaciones selectas. La calidad supera a la cantidad de forma abrumadora.',
        bullets:['🎯 Los 50 más importantes: identifica las 50 personas más valiosas de tu industria y construye relación con ellas','📅 Sistema de seguimiento: cada 90 días, una razón genuina para contactar','💎 Dar antes de pedir: comparte artículos útiles, haz presentaciones, ayuda sin esperar nada','🎤 Habla en público: una ponencia te presenta ante 200 personas de una vez','✉️ Email frío perfecto: asunto específico, conexión genuina, petición concreta, máximo 5 líneas'],
        fact:'Charlie Munger dijo que las tres reglas de Berkshire son: socios confiables, trabajo interesante y precio razonable. La primera — socios confiables — siempre viene de networking previo.'},
      {type:'quiz', tag:'🤝 Quiz', title:'¿Qué porcentaje de empleos se cubre por networking antes de publicarse?',
        opts:[{t:'20-30%', ok:false},{t:'50-60%', ok:false},{t:'70-80%', ok:true},{t:'Menos del 20%', ok:false}],
        ok:'Los estudios de LinkedIn y Harvard Business Review sitúan consistentemente entre el 70-80% los puestos que se cubren por referidos o contactos antes de (o sin) publicarse en portales de empleo.',
        bad:'Los estudios de LinkedIn y Harvard Business Review sitúan consistentemente entre el 70-80% los puestos que se cubren por referidos o contactos antes de (o sin) publicarse en portales de empleo.'},
      {type:'final', xp:25, msg:'¡Networking de alto valor comprendido! No es coleccionar tarjetas — es crear valor para otros primero. Las conexiones correctas multiplican oportunidades, información y capital mejor que cualquier bróker.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 66 — Opciones y Derivados: La Caja de Pandora
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:66, icon:'🎭', title:'Opciones Financieras: Poder y Peligro',
    desc:'Los instrumentos que usan los profesionales. Y que arruinan a los aficionados.',
    xp:35, tag:'AVANZADO', tagC:'red', users:'8.100',
    steps:[
      {type:'content', tag:'🎲 Módulo 67', title:'Qué es una Opción Financiera',
        intro:'Una opción es el derecho (no la obligación) de comprar o vender un activo a un precio fijado (strike) hasta una fecha determinada (vencimiento). Pagas una prima por ese derecho. Las opciones pueden usarse para cubrir riesgo o para especular con apalancamiento extremo.',
        bullets:['📞 Call: derecho a COMPRAR el activo al precio strike','📤 Put: derecho a VENDER el activo al precio strike','💰 Prima: lo que pagas por la opción (máximo que puedes perder como comprador)','📅 Vencimiento: la opción vale €0 si no la ejerces antes de esa fecha','⚡ Apalancamiento: controlas 100 acciones con una prima de €100-500 — potencial de ×10 o ×0'],
        fact:'En la crisis de 2008, los bancos de Wall Street perdieron más de $450.000 millones en derivados. Un trader de JP Morgan ("La Ballena de Londres") perdió $6.200 millones en 2012 con posiciones en derivados de crédito.'},
      {type:'content', tag:'🎲 Módulo 67', title:'Estrategias Conservadoras con Opciones',
        intro:'Las opciones no son solo especulación. Los inversores más sofisticados las usan para generar ingresos regulares o proteger su cartera. Las estrategias covered call y cash-secured put son las más seguras para el inversor individual.',
        bullets:['📊 Covered Call: vendes el derecho a comprar tus acciones al strike — ingresos extra aunque la acción no suba','🛡️ Put protectora: compras un Put sobre acciones que tienes — seguro ante caídas','💵 Cash-Secured Put: vendes un Put prometiendo comprar acciones si caen — cobras prima y potencialmente compras barato','⚠️ Greeks: Delta, Gamma, Theta, Vega — las variables que afectan el precio de la opción','🚫 Lo que NO hacer: opciones naked (vender sin tener el activo) o estrategias no entendidas'],
        fact:'Warren Buffett vende Puts sobre empresas que quiere comprar a precios menores. En 2008 vendió Puts sobre índices y cobró $4.900 millones en primas. Si el mercado subía, ganaba. Si bajaba, compraba barato. Solo pierde si los índices bajan a 0.'},
      {type:'quiz', tag:'🎲 Quiz', title:'¿Cuál es el máximo que puedes perder comprando una opción Call?',
        opts:[{t:'El valor total del activo subyacente', ok:false},{t:'La prima pagada por la opción', ok:true},{t:'Infinito — no hay límite', ok:false},{t:'El 50% del precio de las acciones', ok:false}],
        ok:'Como comprador de una opción, tu pérdida máxima es exactamente la prima que pagaste. Si la opción vence sin valor (out-of-the-money), pierdes solo la prima. Nunca puedes perder más. Esto es lo que diferencia al comprador del vendedor de opciones.',
        bad:'Como comprador de una opción, tu pérdida máxima es exactamente la prima que pagaste. Si la opción vence sin valor (out-of-the-money), pierdes solo la prima. Nunca puedes perder más. Esto es lo que diferencia al comprador del vendedor de opciones.'},
      {type:'final', xp:35, msg:'¡Opciones financieras desmitificadas! Calls, puts, primas, vencimiento, griegas básicas (delta, theta). Son herramientas de cobertura poderosas — y trampas de ruina si se usan sin entenderlas. Ahora las entiendes.'},
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
      {type:'content', tag:'🧩 Módulo 68', title:'Los 8 Trucos de Precio que Usas Cada Día',
        intro:'El precio no es solo un número. Es una herramienta psicológica. Las grandes empresas invierten en equipos de "behavioral economists" cuyo único trabajo es maximizar cuánto pagas sin que te parezca caro. Conocer estos trucos te hace inmune.',
        bullets:['9️⃣ Precio encanto: €9,99 activa el "dígito izquierdo" — tu cerebro procesa €9, no €10','🎁 Bundling: juntar productos aumenta el valor percibido aunque el precio total sea mayor','⚡ Scarcity: "quedan 2 en stock" — urgencia artificial que bypasea la razón','🔗 Anchoring: el primer precio que ves ancla toda evaluación posterior','📦 Suscripción: €9,99/mes parece trivial; €119,88/año, no tanto'],
        fact:'Netflix descubrió que añadir un plan Premium caro (€17/mes) hacía que el plan Estándar (€13/mes) pareciera "razonable" aunque nadie eligiera el Premium. Efecto ancla en estado puro.'},
      {type:'quiz', tag:'🧩 Quiz', title:'¿Por qué €9,99 se percibe significativamente más barato que €10?',
        opts:[{t:'La diferencia real es de €0,01', ok:false},{t:'El cerebro procesa el dígito de la izquierda primero e ignora los céntimos', ok:true},{t:'Las tiendas tienen menos beneficio con €9,99', ok:false},{t:'Es solo tradición comercial sin base psicológica', ok:false}],
        ok:'La "ilusión del dígito izquierdo" hace que el cerebro categorice €9,99 como "9 y algo" en lugar de "casi 10". Estudios demuestran que los precios terminados en .99 generan hasta un 30% más de ventas que precios redondos ligeramente más bajos.',
        bad:'La "ilusión del dígito izquierdo" hace que el cerebro categorice €9,99 como "9 y algo" en lugar de "casi 10". Estudios demuestran que los precios terminados en .99 generan hasta un 30% más de ventas que precios redondos ligeramente más bajos.'},
      {type:'final', xp:20, msg:'¡Trampas de precios neutralizadas! Suscripciones ocultas, upsells emocionales, comparadores sesgados, precios anclados. Cada trampa identificada es dinero que queda en tu bolsillo.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 68 — Fiscalidad Internacional: El Mapa del Tesoro
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:68, icon:'✈️', title:'Fiscalidad Internacional para Nómadas',
    desc:'Cómo tributa un español que trabaja en remoto o vive en el extranjero.',
    xp:30, tag:'AVANZADO', tagC:'gold', users:'11.700',
    steps:[
      {type:'content', tag:'🌍 Módulo 69', title:'Residencia Fiscal: La Regla de los 183 Días',
        intro:'Tu residencia fiscal determina dónde pagas impuestos. En España eres residente fiscal si: pasas más de 183 días al año, o tu núcleo de intereses económicos está en España (empresa, familia, propiedades). No es lo mismo residencia civil que fiscal.',
        bullets:['📅 183 días: la regla principal — si superas este umbral en España, tributa aquí','🏠 Centro de intereses: aunque pases menos de 183 días, si tu familia y trabajo están en España, eres residente','⚠️ Paraísos fiscales: el modelo 7P obliga a declarar bienes en el extranjero (>50.000€)','🇵🇹 Régimen NHR Portugal: 10 años de flat tax del 10% para pensiones y 20% para ingresos profesionales','🇦🇪 EAU Dubai: 0% impuesto personal — destino favorito de empresarios digitales'],
        fact:'Hacienda tiene convenios de intercambio de información con más de 100 países. Las cuentas en el extranjero no declaradas generan multas del 150% del valor no declarado.'},
      {type:'quiz', tag:'🌍 Quiz', title:'¿Cuántos días debes pasar fuera de España para perder la residencia fiscal?',
        opts:[{t:'90 días', ok:false},{t:'183 días', ok:true},{t:'270 días', ok:false},{t:'Basta con empadronarte en otro país', ok:false}],
        ok:'La regla general es 183 días, pero Hacienda también considera el "centro de intereses vitales". Si tu empresa, cónyuge e hijos están en España, puedes seguir siendo residente fiscal aunque pases menos de 183 días físicamente.',
        bad:'La regla general es 183 días, pero Hacienda también considera el "centro de intereses vitales". Si tu empresa, cónyuge e hijos están en España, puedes seguir siendo residente fiscal aunque pases menos de 183 días físicamente.'},
      {type:'final', xp:30, msg:'¡Fiscalidad internacional para nómadas dominada! Residencia fiscal efectiva, 183 días, convenios, CFC rules, exit tax. Vivir en el mundo es posible — con la estructura correcta y asesoría especializada.'},
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
      {type:'content', tag:'💬 Módulo 70', title:'Por Qué Vender es la Habilidad Más Infravalorada',
        intro:'Vendes constantemente: cuando pides un aumento, cuando convences a tu jefe de tu idea, cuando negocias el alquiler, cuando consigues clientes para tu negocio. La persona que sabe vender siempre tiene opciones. La que no sabe, siempre espera que alguien le dé oportunidades.',
        bullets:['💰 Los mejores vendedores en España ganan €80.000-€200.000+ anuales','🧠 Vender es resolver problemas del otro — no convencer a nadie de nada','🎯 Framework SPIN: Situación, Problema, Implicación, Necesidad — el método más probado','🤝 El silencio vende: tras lanzar la propuesta, el primero en hablar pierde','📊 Objeciones = interés disfrazado: una objeción es una pregunta sin resolver'],
        fact:'Grant Cardone vendió €100M en inmuebles sin nunca haber estudiado. Charlie Munger dijo que la habilidad para vender es el multiplicador de todas las demás habilidades.'},
      {type:'quiz', tag:'💬 Quiz', title:'¿Qué debe hacer un vendedor tras presentar su propuesta?',
        opts:[{t:'Seguir explicando los beneficios del producto', ok:false},{t:'Preguntar si tienen preguntas', ok:false},{t:'Guardar silencio — el primero en hablar cede ventaja', ok:true},{t:'Ofrecer un descuento inmediatamente', ok:false}],
        ok:'El "cierre por silencio" es una de las técnicas más efectivas. Tras presentar la propuesta, quien habla primero revela sus cartas. El silencio crea presión psicológica natural que empuja al comprador a responder.',
        bad:'El "cierre por silencio" es una de las técnicas más efectivas. Tras presentar la propuesta, quien habla primero revela sus cartas. El silencio crea presión psicológica natural que empuja al comprador a responder.'},
      {type:'final', xp:25, msg:'¡Habilidad de venta desbloqueada! El embudo, el SPIN selling, el cierre sin presión, el seguimiento. Vender es la habilidad que multiplica el valor de todas las demás. Y todos vendemos algo siempre.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 70 — El Balance General Personal
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:70, icon:'🗳️', title:'Tu Balance Personal: La Radiografía Financiera',
    desc:'Las empresas hacen su balance trimestral. ¿Cuándo hiciste el tuyo?',
    xp:20, tag:'PRÁCTICA', tagC:'green', users:'22.300',
    steps:[
      {type:'content', tag:'📋 Módulo 71', title:'Activos, Pasivos y Patrimonio Neto',
        intro:'Un balance personal funciona igual que el de una empresa: muestra lo que tienes (activos), lo que debes (pasivos) y la diferencia (patrimonio neto). Hacerlo una vez al año es el hábito más revelador de la gestión financiera personal.',
        bullets:['📈 ACTIVOS: efectivo, inversiones, inmuebles, vehículo, pensión privada acumulada','💳 PASIVOS: hipoteca pendiente, créditos al consumo, deuda de tarjetas, préstamos familiares','💎 PATRIMONIO NETO = Activos − Pasivos (el indicador más honesto de tu salud financiera)','📊 Objetivo: que el patrimonio neto crezca cada año aunque sea un 5%','🎯 Regla de Kiyosaki: activo = pone dinero en tu bolsillo; pasivo = lo saca'],
        fact:'Según el Banco de España, el patrimonio neto mediano de los hogares españoles es €207.800, pero con diferencias enormes: el 10% más rico tiene 50 veces más que el 10% más pobre.'},
      {type:'content', tag:'📋 Módulo 71', title:'Cómo Construir tu Balance en 30 Minutos',
        intro:'No necesitas un contable. Con una hoja de cálculo y honestidad es suficiente. El ejercicio de escribirlo todo en un sitio tiene un poder transformador: lo que se mide, mejora.',
        bullets:['1️⃣ Activos líquidos: suma todas las cuentas corrientes y depósitos','2️⃣ Activos de inversión: valor de mercado de acciones, ETFs, fondos, criptos','3️⃣ Activos inmobiliarios: valor estimado de inmuebles (conservador)','4️⃣ Otros activos: coche (precio de venta realista), plan de pensiones acumulado','5️⃣ Pasivos: saldo pendiente de TODAS las deudas — hipoteca, créditos, tarjetas'],
        fact:'Un estudio de la Universidad de Stanford encontró que las personas que escriben su net worth regularmente toman mejores decisiones financieras y ahorran un 34% más que las que no lo hacen.'},
      {type:'quiz', tag:'📋 Quiz', title:'Si tienes €150.000 en activos y €90.000 en pasivos, ¿cuál es tu patrimonio neto?',
        opts:[{t:'€240.000', ok:false},{t:'€90.000', ok:false},{t:'€60.000', ok:true},{t:'Depende de los tipos de activos', ok:false}],
        ok:'Patrimonio neto = Activos − Pasivos = €150.000 − €90.000 = €60.000. Simple aritmética, pero el ejercicio de calcularlo obliga a ser honesto sobre todo lo que se debe y todo lo que realmente vale lo que se tiene.',
        bad:'Patrimonio neto = Activos − Pasivos = €150.000 − €90.000 = €60.000. Simple aritmética, pero el ejercicio de calcularlo obliga a ser honesto sobre todo lo que se debe y todo lo que realmente vale lo que se tiene.'},
      {type:'final', xp:20, msg:'¡Balance personal radiografiado! Activos (lo que tienes) − Pasivos (lo que debes) = Patrimonio neto. Una cifra. Una vez al año. La única métrica que importa para saber si tu vida financiera avanza.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 71 — La Mentalidad del Millonario Autodidacta
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:71, icon:'💪', title:'La Mentalidad que Construye Riqueza Real',
    desc:'No es el dinero lo que hace ricos a los ricos. Es lo que piensan sobre el dinero.',
    xp:25, tag:'PSICOLOGÍA', tagC:'purple', users:'34.600',
    steps:[
      {type:'content', tag:'🧠 Módulo 72', title:'Los 5 Principios Mentales de los Constructores de Riqueza',
        intro:'Los estudios de Thomas Stanley (El Millonario de al Lado) de 1.000+ millonarios revelaron algo sorprendente: la mayoría no son herederos ni ejecutivos de grandes empresas. Son personas normales con hábitos de pensamiento muy concretos que se repiten una y otra vez.',
        bullets:['⏳ Largo plazo: las decisiones se evalúan en décadas, no en meses','🎲 Riesgo calculado: no evitan el riesgo, lo miden y lo toman con información','📚 Aprendizaje continuo: leen una media de 26 libros de no ficción al año','🚫 Deuda al consumo = nunca: no se endeudan para bienes que se deprecian','👥 Entorno elevador: rodean sus vidas de personas con mejores hábitos financieros que ellos'],
        fact:'El estudio original de Stanley encontró que el 80% de los millonarios americanos eran primera generación — su riqueza no fue heredada. El atributo más común: la disciplina de vivir por debajo de sus posibilidades durante décadas.'},
      {type:'quiz', tag:'🧠 Quiz', title:'Según el estudio de Thomas Stanley sobre millonarios, ¿cuántos eran herencia familiar?',
        opts:[{t:'Más del 70%', ok:false},{t:'Alrededor del 50%', ok:false},{t:'Menos del 20%', ok:true},{t:'Aproximadamente el 40%', ok:false}],
        ok:'El 80% de los millonarios americanos estudiados por Stanley eran primera generación: construyeron su riqueza ellos mismos. La narrativa de que la riqueza se hereda principalmente es falsa para la mayoría de patrimonios significativos.',
        bad:'El 80% de los millonarios americanos estudiados por Stanley eran primera generación: construyeron su riqueza ellos mismos. La narrativa de que la riqueza se hereda principalmente es falsa para la mayoría de patrimonios significativos.'},
      {type:'final', xp:25, msg:'¡Mentalidad de riqueza real instalada! Abundancia vs. escasez, paciencia vs. gratificación inmediata, largo plazo vs. corto. Las decisiones financieras correctas no nacen de las cifras — nacen de cómo las ves.'},
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
      {type:'content', tag:'🏙️ Módulo 73', title:'Las 4 Fases del Ciclo Inmobiliario',
        intro:'El mercado inmobiliario no sube en línea recta. Tiene ciclos de 15-18 años (ciclo de Harrison) que se repiten con sorprendente regularidad. Entender la fase del ciclo en que estás es la ventaja más grande para invertir en inmobiliario.',
        bullets:['1️⃣ Recuperación: precios bajos, poca actividad, nadie quiere comprar — el mejor momento para entrar','2️⃣ Expansión: precios subiendo, crédito disponible, optimismo creciente','3️⃣ Hiperaprovisionamiento: construcción masiva, euforia, todos hablan de inmobiliario','4️⃣ Recesión: ajuste de precios, restricción del crédito, los optimistas venden con pérdidas','🇪🇸 España 2024: en fase 2 avanzada en grandes ciudades según indicadores de precios/rentas'],
        fact:'España vivió el ejemplo perfecto: burbuja 1997-2007 (+150% precios), crash 2008-2013 (−40% en media), recuperación 2014-2019, nuevo ciclo alcista 2020-. Cada ciclo tarda ~15 años. El siguiente mínimo: ~2033.'},
      {type:'quiz', tag:'🏙️ Quiz', title:'¿En qué fase del ciclo inmobiliario es mejor momento para comprar?',
        opts:[{t:'Expansión — cuando los precios llevan años subiendo', ok:false},{t:'Hiperaprovisionamiento — cuando hay mucha oferta nueva', ok:false},{t:'Recuperación — cuando nadie quiere comprar y los precios están bajos', ok:true},{t:'Recesión — en el punto de máxima caída', ok:false}],
        ok:'La fase de Recuperación, al inicio del ciclo, ofrece los mejores precios y menos competencia. El problema es que nadie quiere comprar en esa fase porque el sentimiento es negativo. "Compra cuando haya sangre en las calles" — Barón de Rothschild.',
        bad:'La fase de Recuperación, al inicio del ciclo, ofrece los mejores precios y menos competencia. El problema es que nadie quiere comprar en esa fase porque el sentimiento es negativo. "Compra cuando haya sangre en las calles" — Barón de Rothschild.'},
      {type:'final', xp:30, msg:'¡Ciclo inmobiliario dominado! Pico, crisis, suelo, recuperación: sabes cuándo el mercado está caro y cuándo nadie quiere comprar (que suele ser cuando deberías). El inmobiliario tiene sus patrones — y ahora los conoces.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 73 — Seguros de Vida: Protección Real vs Marketing
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:73, icon:'🔏', title:'Seguros de Vida: Qué Necesitas Realmente',
    desc:'El sector seguros vive de que no entiendas lo que contratas.',
    xp:20, tag:'PROTECCIÓN', tagC:'green', users:'15.400',
    steps:[
      {type:'content', tag:'🛡️ Módulo 74', title:'El Único Seguro de Vida que Vale la Pena',
        intro:'Existen dos tipos básicos de seguro de vida: temporal (pagas una prima, si mueres en ese período cobran tus herederos, si no — no recuperas nada) y mixto/ahorro (pagas más, combina seguro con ahorro). El sector financiero gana más con el segundo. Matemáticamente casi siempre conviene el primero.',
        bullets:['⏱️ Seguro temporal puro: cobertura específica (10-30 años), prima baja, sin trampa','💰 Seguro mixto/Unit-Linked: comisiones altas, rentabilidad baja, para quien no quiere decidir','📊 Matemática: invierte la diferencia en un ETF y bate al seguro mixto en casi todos los escenarios','👶 ¿Cuándo sí tiene sentido? Si tienes dependientes y no tienes colchón de inversión','🎯 Capital asegurado recomendado: 5-10 veces tus ingresos anuales'],
        fact:'Un seguro de vida temporal para un hombre de 35 años sin enfermedades puede costar €15-25/mes por €200.000 de cobertura. El mismo capital en un seguro mixto puede costar €200-300/mes con rentabilidades inferiores al mercado.'},
      {type:'quiz', tag:'🛡️ Quiz', title:'¿Qué tipo de seguro de vida es financieramente más eficiente para la mayoría?',
        opts:[{t:'Seguro mixto con componente de ahorro', ok:false},{t:'Unit-Linked vinculado a fondos de inversión', ok:false},{t:'Seguro temporal puro + invertir la diferencia en ETFs', ok:true},{t:'Seguro de vida entera (whole life)', ok:false}],
        ok:'La combinación seguro temporal puro + inversión separada en ETFs casi siempre supera al seguro mixto. El seguro mixto cobra comisiones por "gestionarlo todo junto" que erosionan la rentabilidad. Separa la protección del ahorro.',
        bad:'La combinación seguro temporal puro + inversión separada en ETFs casi siempre supera al seguro mixto. El seguro mixto cobra comisiones por "gestionarlo todo junto" que erosionan la rentabilidad. Separa la protección del ahorro.'},
      {type:'final', xp:20, msg:'¡Seguros de vida bien calibrados! Capital necesario = gastos familiares × años de dependencia − activos actuales. Sin bajo-asegurar ni sobre-asegurar. El seguro de vida correcto protege, no arruina.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════════════════
     MÓDULO 74 — El Modelo Mental de la Escasez vs Abundancia
  ═══════════════════════════════════════════════════════════════════ */
  {
    id:74, icon:'☮️', title:'Mentalidad de Escasez vs Abundancia',
    desc:'El mayor activo financiero que puedes desarrollar no es medible en euros.',
    xp:20, tag:'PSICOLOGÍA', tagC:'purple', users:'27.800',
    steps:[
      {type:'content', tag:'🌱 Módulo 75', title:'Cómo tu Mentalidad Determina tu Techo Financiero',
        intro:'La mentalidad de escasez ve el dinero como algo limitado que si alguien gana es porque otro pierde. La mentalidad de abundancia ve el valor como algo que se puede crear y expandir. Estas dos visiones llevan a decisiones completamente distintas y resultados opuestos a largo plazo.',
        bullets:['🚫 Escasez: "no puedo permitirme eso" vs Abundancia: "¿cómo puedo conseguirlo?"','🔒 Escasez: el dinero es para gastarlo mientras lo tienes vs Abundancia: el dinero trabaja para mí','😤 Escasez: envidia cuando otros tienen éxito vs Abundancia: el éxito de otros me inspira','📉 Escasez: evita el riesgo porque "no se puede perder lo poco que hay" vs Abundancia: gestiona el riesgo para crecer','🤝 Escasez: información = poder, no compartir vs Abundancia: compartir conocimiento genera más oportunidades'],
        fact:'Carol Dweck (Stanford) demostró que la "growth mindset" (mentalidad de crecimiento) predice mejores resultados financieros y profesionales con independencia del punto de partida. El cerebro es moldeable — los hábitos de pensamiento se pueden cambiar.'},
      {type:'quiz', tag:'🌱 Quiz', title:'¿Cuál es la diferencia clave entre mentalidad de escasez y abundancia?',
        opts:[{t:'La cantidad de dinero que tienen', ok:false},{t:'Si el dinero se hereda o se gana', ok:false},{t:'Cómo ven las oportunidades y el éxito de otros', ok:true},{t:'El nivel educativo alcanzado', ok:false}],
        ok:'La diferencia no es cuánto dinero tienen sino cómo piensan. La mentalidad de abundancia ve las oportunidades donde la escasez ve obstáculos, y celebra el éxito ajeno como evidencia de que el éxito es posible.',
        bad:'La diferencia no es cuánto dinero tienen sino cómo piensan. La mentalidad de abundancia ve las oportunidades donde la escasez ve obstáculos, y celebra el éxito ajeno como evidencia de que el éxito es posible.'},
      {type:'final', xp:20, msg:'¡Mentalidad de abundancia activada! La escasez se retroalimenta: malas decisiones, cortoplacismo, envidia. La abundancia también: inversión, colaboración, largo plazo. Es un ciclo — y tú eliges en cuál entrar.'},
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
      {type:'content', tag:'⚙️ Módulo 76', title:'El Sistema de 3 Cuentas que Simplifica Todo',
        intro:'La automatización financiera elimina la necesidad de tomar decisiones repetidas. Cada decisión que eliminas mediante un sistema automático es una decisión que no puedes tomar mal. El objetivo: que tu dinero vaya al lugar correcto sin que tengas que pensar en ello.',
        bullets:['🏦 Cuenta 1 — Nómina: recibe el sueldo, nunca la toques','🎯 Cuenta 2 — Gastos fijos: alquiler, suministros, suscripciones — transferencia automática el día de cobro','📈 Cuenta 3 — Inversión/Ahorro: transferencia automática el día de cobro — "págate a ti primero"','🛒 Tarjeta de gastos variables: lo que queda en Cuenta 1 tras las transferencias — tu presupuesto real','🔄 El día de cobro, el dinero fluye solo: primero inversión, luego gastos fijos, luego el resto'],
        fact:'David Bach acuñó el concepto de "Automatic Millionaire": automatizar el ahorro antes de que el dinero llegue a tu cuenta corriente tiene más impacto que cualquier estrategia de inversión sofisticada.'},
      {type:'quiz', tag:'⚙️ Quiz', title:'¿Por qué "págate a ti primero" antes que pagar gastos es más efectivo?',
        opts:[{t:'Porque los gastos pueden esperar', ok:false},{t:'Porque elimina la tentación de gastar antes de ahorrar', ok:true},{t:'Porque genera más interés bancario', ok:false},{t:'Porque es un requisito legal en España', ok:false}],
        ok:'"Págate a ti primero" significa transferir el ahorro/inversión el mismo día que cobras, antes de tocar el dinero. Si el ahorro es lo último que haces con lo que queda, siempre habrá algo más urgente. Si es lo primero, siempre ocurre.',
        bad:'"Págate a ti primero" significa transferir el ahorro/inversión el mismo día que cobras, antes de tocar el dinero. Si el ahorro es lo último que haces con lo que queda, siempre habrá algo más urgente. Si es lo primero, siempre ocurre.'},
      {type:'final', xp:25, msg:'¡Finanzas automatizadas! Ahorro automático el día 1, inversión programada, pagos automáticos. Cuando el sistema trabaja sin que lo pienses, la disciplina deja de necesitarse. Automatiza y libera tu mente.'},
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
      {type:'content', tag:'⏳ Módulo 77', title:'Los 20s: La Décadas Más Cara si se Desperdicia',
        intro:'Los 20 años son la ventana de tiempo más valiosa de tu vida financiera. El interés compuesto premia enormemente empezar aquí. Los errores de esta época cuestan 3-5 veces más que el mismo error a los 40.',
        bullets:['💸 Error 1: No empezar a invertir — €100/mes desde los 22 = €600.000 a los 65 (7%)','🎓 Error 2: Estudios sin ROI — máster de €20.000 en algo que gana €18.000/año','🏠 Error 3: Comprar piso demasiado pronto — ata capital e impide movilidad laboral','💳 Error 4: Deuda de consumo — coche a crédito, tarjeta revolving — destruye el fondo de emergencia','🎯 Lo correcto: fondo de emergencia primero, luego invertir aunque sea €50/mes, cultivar habilidades de alto valor'],
        fact:'Los €100/mes invertidos desde los 22 al 7% generan €600.000 a los 65. Los mismos €100/mes empezando a los 32: €300.000. El coste de esperar 10 años: €300.000. Son 10 años de espera que cuestan literalmente una fortuna.'},
      {type:'content', tag:'⏳ Módulo 77', title:'Los 30s y 40s: Nuevas Trampas, Nuevas Oportunidades',
        intro:'Los 30 traen más ingresos pero también más tentaciones de gasto. Los 40 son la última oportunidad real de cambiar la trayectoria financiera antes de la recta final hacia la jubilación.',
        bullets:['🏠 Trampa 30s: hipoteca demasiado grande que consume todo el margen de ahorro','👶 Trampa 30s: los hijos como excusa para no invertir — los hijos no impiden invertir €200/mes','🚗 Trampa 30s: lifestyle creep — sueldo ×2 pero también gastos ×2','📈 Oportunidad 40s: últimos 25 años de interés compuesto — sigue siendo tiempo suficiente','🎯 Lo correcto en 40s: maximizar plan de pensiones, cancelar deuda mala, revisar estrategia inmobiliaria'],
        fact:'El estudio CNMV 2023 encontró que el 62% de españoles de 40-50 años no tiene ningún ahorro para la jubilación fuera de la Seguridad Social. El sistema de pensiones no puede garantizar el nivel de vida actual de ese grupo.'},
      {type:'quiz', tag:'⏳ Quiz', title:'¿Cuánto más genera invertir €100/mes desde los 22 vs desde los 32?',
        opts:[{t:'Un 10% más', ok:false},{t:'El doble (×2)', ok:true},{t:'Un 50% más', ok:false},{t:'Depende de la rentabilidad exacta', ok:false}],
        ok:'Con un 7% anual: desde los 22 = ~€600.000 a los 65. Desde los 32 = ~€300.000. Exactamente el doble. Esta diferencia se llama "la octava maravilla del mundo" — el interés compuesto actuando durante 10 años adicionales.',
        bad:'Con un 7% anual: desde los 22 = ~€600.000 a los 65. Desde los 32 = ~€300.000. Exactamente el doble. Esta diferencia se llama "la octava maravilla del mundo" — el interés compuesto actuando durante 10 años adicionales.'},
      {type:'final', xp:25, msg:'¡Errores por edad identificados y evitados! A los 20: no invertir. A los 30: no diversificar. A los 40: no calcular la pensión. A los 50: demasiado riesgo o demasiado poco. Ahora sabes cuáles evitar en cada etapa.'},
    ],
  },

  /* ═══════════════════════════════════════════════════════
     MÓDULO 106 — Factor Investing
  ═══════════════════════════════════════════════════════ */
  {
    id:106, icon:'⚗️',
    title:'Factor Investing: Los 5 Factores que Baten al Mercado',
    desc:'Los factores que la academia ha probado que mejoran el retorno a largo plazo',
    xp:28, tag:'AVANZADO', tagC:'blue', users:'18.200',
    steps:[
      { type:'content', tag:'🔬 Módulo 107',
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
      { type:'content', tag:'💑 Módulo 108',
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
    id:77, icon:'📝',
    title:'Seguros Esenciales: Cuándo Son Imprescindibles',
    desc:'La protección que necesitas, sin pagar de más por lo que no necesitas',
    xp:20, tag:'PROTECCIÓN', tagC:'purple', users:'22.100',
    steps:[
      { type:'content', tag:'🛡️ Módulo 78',
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
    id:78, icon:'🃏',
    title:'Economía del Comportamiento',
    desc:'Los 7 sesgos que te cuestan dinero y cómo neutralizarlos con sistemas',
    xp:25, tag:'PSICOLOGÍA', tagC:'purple', users:'29.700',
    steps:[
      { type:'content', tag:'🧩 Módulo 79',
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
    id:79, icon:'🍀',
    title:'Inversión en Dividendos: Renta Pasiva que Crece Sola',
    desc:'Construye una máquina de ingresos que trabaja para ti sin que hagas nada',
    xp:24, tag:'DIVIDENDOS', tagC:'blue', users:'24.300',
    steps:[
      { type:'content', tag:'🌱 Módulo 80',
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
    id:80, icon:'📗',
    title:'Cómo Leer un Balance en 5 Minutos',
    desc:'Detecta empresas sanas vs zombies financieros antes de invertir',
    xp:28, tag:'AVANZADO', tagC:'blue', users:'15.800',
    steps:[
      { type:'content', tag:'📋 Módulo 81',
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
      { type:'content', tag:'💼 Módulo 82',
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
      { type:'content', tag:'👶 Módulo 83',
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
    id:83, icon:'✏️',
    title:'Fiscalidad Avanzada del Inversor Español',
    desc:'Las estrategias legales que los asesores guardan para sus mejores clientes',
    xp:30, tag:'FISCALIDAD', tagC:'orange', users:'17.600',
    steps:[
      { type:'content', tag:'📊 Módulo 84',
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
    id:84, icon:'🏪', title:'¿Cuándo Tiene Sentido Comprar una Vivienda?',
    desc:'Price-to-Rent, horizonte temporal y estabilidad: la fórmula para no equivocarte',
    xp:22, tag:'VIVIENDA', tagC:'green', users:'28.400',
    steps:[
      {type:'content', tag:'🏠 Módulo 85', title:'El Error de los 300.000€',
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
    id:85, icon:'🔦', title:'Los Gastos Ocultos de Comprar una Vivienda',
    desc:'ITP, notaría, registro, hipoteca y mantenimiento: el 12% que nadie te dice',
    xp:20, tag:'VIVIENDA', tagC:'orange', users:'24.700',
    steps:[
      {type:'content', tag:'💸 Módulo 86', title:'El Piso de €200.000 que Cuesta €224.000',
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
      {type:'content', tag:'🐷 Módulo 87', title:'El Plan de Ahorro para la Entrada',
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
      {type:'content', tag:'🏦 Módulo 88', title:'La Hipoteca que Elegiste o la que te Vendieron',
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
    id:88, icon:'🗝️', title:'Alquiler con Opción a Compra y Estrategias Alternativas',
    desc:'Opciones reales cuando el banco dice no o los precios están desbocados',
    xp:20, tag:'VIVIENDA', tagC:'purple', users:'16.300',
    steps:[
      {type:'content', tag:'🔑 Módulo 89', title:'Cuando el Camino Convencional Está Bloqueado',
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
    id:89, icon:'🏬', title:'Autónomo vs Sociedad Limitada: ¿Cuándo Constituir una SL?',
    desc:'Alta, cuotas 2024, deducciones reales y el umbral exacto en que la SL gana',
    xp:28, tag:'AVANZADO', tagC:'red', users:'20.500',
    steps:[
      {type:'content', tag:'⚖️ Módulo 90', title:'El Umbral que Cambia la Decisión',
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
    id:90, icon:'🏣', title:'REITs y Dividendos Mensuales: Renta Pasiva Inmobiliaria',
    desc:'$O, $SCHD, VHYL: estrategia de renta pasiva, ejemplos reales y fiscalidad española',
    xp:26, tag:'AVANZADO', tagC:'red', users:'17.900',
    steps:[
      {type:'content', tag:'🏗️ Módulo 91', title:'Inmobiliario sin Comprar un Ladrillo',
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
    id:94, icon:'🌴', title:'Nómada Digital: Fiscalidad y Estrategia en 2024',
    desc:'Residencia fiscal, convenios, régimen Beckham, Wise/Revolut y los riesgos reales del nómadismo',
    xp:26, tag:'AVANZADO', tagC:'red', users:'11.500',
    steps:[
      {type:'content', tag:'🌍 Módulo 95', title:'Trabajar desde Cualquier Lugar (sin Liarla con Hacienda)',
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
      {type:'content', tag:'🚨 Módulo 96', title:'Si Suena Demasiado Bueno, Lo Es',
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
    id:96, icon:'🎰', title:'Opciones y Derivados para Inversores Particulares',
    desc:'Call, put, prima, strike, covered call y por qué el 70-80% de compradores de opciones pierde dinero',
    xp:28, tag:'AVANZADO', tagC:'red', users:'9.800',
    steps:[
      {type:'content', tag:'📊 Módulo 97', title:'Instrumentos de Doble Filo',
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
      {type:'content', tag:'🔢 Módulo 98', title:'Tu Número Mágico Tiene Nombre: X',
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
    id:98, icon:'🔮', title:'Psicología del Precio y Neuromarketing Financiero',
    desc:'Precio ancla, efecto señuelo, dark patterns fintech y cómo el cerebro valora distinto efectivo vs tarjeta',
    xp:22, tag:'PSICOLOGÍA', tagC:'purple', users:'24.600',
    steps:[
      {type:'content', tag:'🧠 Módulo 99', title:'Tu Cerebro Gasta, tu Mente Decide',
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
    id:99, icon:'⛵', title:'La Cartera Permanente: Estabilidad en Cualquier Clima Económico',
    desc:'Harry Browne, All-Weather de Dalio, backtesting vs 100% RV y para qué perfil tiene sentido',
    xp:26, tag:'INVERSIÓN', tagC:'blue', users:'13.900',
    steps:[
      {type:'content', tag:'🏛️ Módulo 100', title:'La Cartera para Dormir Tranquilo',
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
    id:100, icon:'🌡️', title:'Inflación Real vs Oficial: El Impuesto Silencioso',
    desc:'IPC, inflación sentida, activos que protegen y por qué el dinero parado destruye tu poder adquisitivo',
    xp:24, tag:'FISCALIDAD', tagC:'yellow', users:'11.200',
    steps:[
      {type:'content', tag:'📉 Módulo 101', title:'El Impuesto que Nadie Vota',
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
    id:101, icon:'📖', title:'Cómo Leer un Prospecto de ETF: La Guía Definitiva',
    desc:'TER, tracking error, tracking difference, domicilio fiscal y réplica física vs sintética explicados con ejemplos reales',
    xp:26, tag:'INVERSIÓN', tagC:'blue', users:'9.800',
    steps:[
      {type:'content', tag:'📋 Módulo 102', title:'El Manual que Nadie Lee (y Debería)',
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
    id:102, icon:'🌅', title:'El Sistema de Pensiones Español: Lo que Tu Jubilación No Te Cuenta',
    desc:'Cómo se calculan los puntos, lagunas de cotización, brecha de pensión real y cuánto necesitas ahorrar por tu cuenta',
    xp:28, tag:'AVANZADO', tagC:'red', users:'14.600',
    steps:[
      {type:'content', tag:'👴 Módulo 103', title:'La Pensión Real que Te Espera',
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
      {type:'content', tag:'⏱️ Módulo 104', title:'Matemáticas Rápidas para Inversores',
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
      {type:'content', tag:'⚔️ Módulo 105', title:'Gestión Activa vs Pasiva: Los Datos Reales',
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
]);


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


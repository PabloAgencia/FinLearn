# AUDITORÍA FINLEARN — Documento Completo
**Fecha:** 10 junio 2026 (actualizado 5 julio 2026 — ver sección 0)
**Versión de estado:** `finlearn_v9_state`  
**Arquitectura:** Vanilla JS PWA · ~40 archivos JS · Sin framework

---

## 0. ACTUALIZACIÓN — 5 JULIO 2026 (rama `develop`, pendiente merge a `main`)

Sesión de lanzamiento: paywall unificado, onboarding recortado, home reorganizado
con acordeones, micro-animaciones, y QA real en navegador (móvil + escritorio)
que encontró y corrigió varios bugs de producción no detectados en esta auditoría.

### Resuelto desde esta auditoría
- **5.1 / P1 — Calc-gate genérico** → ✅ RESUELTO. Las 11 calculadoras muestran ahora
  2 beneficios específicos de lo que se bloquea (`_CG_PERKS` en `app-calc-gate.js`).
- **5.9 — Paywall sin coherencia** → ✅ RESUELTO. `m-paywall` y `m-premium-saas`
  muestran los mismos 6 beneficios y el mismo nombre ("Elite"); antes prometía
  "gratis ahora" y llevaba a un pago real de 7,99€/mes.
- **6.2 — MODULES con entradas null** → ✅ RESUELTO. Blindados todos los
  `.map`/`.find` sin guardia en `app-ui.js`, `app-supabase.js`, `app-state.js`,
  `app-ui2.js`, `app-ui2B.js`, `app-uiB.js`. El origen exacto de las 2 entradas
  inválidas al final del array no se identificó (no está en el código fuente
  como literal, posible artefacto del pipeline de generación de contenido).
- **B6 — Sin referral UI** → ✅ YA NO APLICA. Se encontró en QA que la UI de
  referidos (código para compartir + campo "añadir amigo") ya existe en el
  home, contradiciendo esta auditoría — verificar antes de repetir este punto.

### Bugs nuevos encontrados y corregidos (no estaban en esta auditoría)
- Handoff roto entre pantalla de subir de nivel y modal de celebración si el
  usuario no clicaba antes del auto-cierre a 5s (`_dismissLevelUpOverlay()`).
- Modal de racha diaria (`.sc-modal-backdrop`) sin `align-items:center` en
  pantallas anchas — aparecía pegado abajo en vez de centrado.
- Rejilla de avatares del onboarding (4 columnas) desbordaba a la derecha en
  móviles <400px de ancho.
- Los botones "Continuar" de onboarding (objetivo y nombre) solo se veían
  desactivados pero dejaban avanzar sin elegir nada — el guard de JS
  comprobaba `S.goal`, que tiene un default no-vacío en `DEFAULTS`.
- Enlaces de "Acciones de hoy" que apuntaban a secciones movidas dentro de
  los nuevos acordeones "Explorar más" no hacían nada (`scrollIntoView`
  sobre un elemento con `display:none` no funciona) — nueva función
  `scrollToHomeTarget()` en `app-tools3.js` abre el acordeón antes de scrollear.
- Escudos de racha: protegían la racha entera sin importar cuántos días
  llevaras fuera (podía ser 1 semana). Ahora solo cubren 1 día de ausencia,
  como Duolingo — 2+ días seguidos rompen la racha igual.
- Lección aprendida sobre caché: un fix en el repo no basta si no se
  bumpea `?v=X.X.X` del archivo en `index.html` — el CDN/SW puede seguir
  sirviendo la versión vieja aunque el deploy sea correcto.

### ✅ Completado tras el merge a main (misma sesión, rondas siguientes)
- Botón "atrás" unificado en TODA la app (`.nav-back` circular glassmorphism +
  icono SVG + `SFX.back()`) — incluye calculadoras, Perfil, Ranking, Simulador
  de Vida, Mi Futuro, Estilos de Vida, Guías y su lector. Los botones de texto
  completo dentro de una pila (ej. "Volver al inicio" en certificado/resumen
  de quiz) solo llevan el sonido, no el icono, porque encogerlos rompía el
  layout — decisión consciente, no descuido.
- 4 sonidos reales (`sfx/check1.mp3`, `check2.mp3`, `checkfail.mp3`,
  `notification.mp3`) sustituyendo los tonos sintetizados de acierto/fallo/
  módulo completado + nuevo aviso pasivo de racha (escudo auto-activado).
  La Acción del Día (DCA) no tenía NINGÚN sonido — añadido.
- **Bug de precio real en Stripe**: el modal de pago (`m-premium-saas`)
  mostraba "7,99€/mes" pero el price ID real en Stripe cobraba 9€/mes
  (65€/año) — verificado por Pablo en su Dashboard. Los price ID antiguos
  tenían suscripciones de test activas y no se podían editar (Stripe
  los hace inmutables); se archivaron y se crearon 2 nuevos a 7,99€/mes y
  57,99€/año, decisión de precio para reducir fricción en la semana de
  lanzamiento (más fácil subir precio después que bajarlo).
- **Selector de plan Mensual/Anual no daba feedback visual**: `SAAS_selectPlan()`
  ponía la clase `active` pero el CSS (`appB.css`) esperaba `saas-plan-active`
  — nunca coincidían. El plan Anual parecía "pegado" solo por su propio
  borde dorado de "recomendado", sin relación con la selección real.
- **URL de retorno de Stripe** apuntaba a `https://finlearn.app` (dominio no
  configurado) en vez de `https://finlearn.pages.dev` — cualquiera que
  completara un pago real se habría quedado en una URL rota tras pagar.
- **Tarjeta "Anual" desbordaba el modal**: bug clásico de CSS Grid — los
  items no se encogen por debajo de su contenido mínimo por defecto
  (`min-width:auto`). Con el precio/nota más largos que antes, la tarjeta
  se salía del modal. Arreglado con `min-width:0` + tope de ancho en la
  insignia dorada.

### 🔴 PENDIENTE ANTES DE LANZAR — Stripe modo LIVE
Todo el trabajo de pagos de hoy es en modo **test** de Stripe. Antes de
lanzar de verdad hay que:
1. Crear el mismo producto + 2 precios (7,99€/mes, 57,99€/año) en el lado
   **live** del Dashboard de Stripe (test y live son entornos 100% separados,
   los price ID de hoy NO sirven en live).
2. Pasar los 2 price ID nuevos (live) para actualizar `SAAS_startPayment()`
   en `app-game.js`.
3. Cambiar `STRIPE_SECRET_KEY` en las variables de entorno de Cloudflare
   Pages de la clave de test a la clave live.
4. Volver a probar el flujo completo de pago con una tarjeta real (o la
   primera venta real hace de prueba, con cuidado).

### Pendiente de esta sesión
- Unificar los 3 estilos de botón "atrás" distintos que coexisten — ✅ HECHO, ver arriba.
- Merge `develop` → `main` — ✅ HECHO (commit `31ef31b`, verificado en producción).

---

## 1. MAPA DE NAVEGACIÓN

### Bottom Nav (5 botones)
```
[🏠 Inicio] [📚 Aprender] [🧮 Calculadoras] [📊 Bolsa] [👤 Perfil]
  s-home      s-learn       s-tools           s-portfolio  s-profile
```

### Pantallas principales
| ID | Nombre | Acceso | Estado |
|---|---|---|---|
| `s-home` | Dashboard / Inicio | Tab nav | ✅ Implementado |
| `s-learn` | Módulos de aprendizaje | Tab nav | ✅ Implementado |
| `s-tools` | Calculadoras (ex-Laboratorio) | Tab nav | ✅ Implementado |
| `s-portfolio` | Simulador de Bolsa | Tab nav | ✅ Implementado |
| `s-profile` | Perfil / Stats | Tab nav | ✅ Implementado |
| `s-life` | Simulador de Vida | Desde Tools o Profile | ✅ Implementado |
| `s-business` | Simulador de Negocios | Desde Tools | ✅ Implementado |
| `s-leaderboard` | Rankings | Desde Home o Profile | ✅ Implementado |

### Pantallas / Modales especiales
| ID | Nombre | Disparador |
|---|---|---|
| `m-onboarding` | Onboarding 4 pasos | Primera visita |
| `m-module` | Módulo de aprendizaje | Click en módulo |
| `m-quiz` | Quiz del módulo | Final de lección |
| `m-duel` | Duelo de quiz (vs bot) | Desde home |
| `m-paywall` | Paywall premium | Ciertas funciones |
| `m-lab` | Modal calculadora (creado dinámicamente) | `openTool(id)` |
| `m-stock` | Modal detalle de acción | Click en acción |
| `m-boss` | Boss semanal | Trigger automático semanal |
| `m-streak` | Racha + shield | Al perder racha |
| `m-year` | Resumen anual | Cada año de juego |
| `m-daily` | Check-in diario / Misiones | Desde home |

### Flujo de navegación entre pantallas
```
Landing → Onboarding (4 pasos) → Home
Home ─────┬─ Módulo activo → Quiz → Completado → Home
          ├─ Calculadoras → openTool(id) → Modal calculadora
          │                              └─ Calc gate si no registrado
          ├─ Bolsa → Detalle acción → Comprar/Vender
          ├─ Vida → Decisiones de vida → Home
          ├─ Negocios → Adquirir/Vender negocio → Home
          ├─ Rankings → Leaderboard → Home
          ├─ Perfil → Config / Stats
          └─ (periódico) Boss semanal / Resumen anual / Crisis de mercado
```

---

## 2. FUNCIONALIDADES — Estado real

### ✅ Completamente implementadas
| Funcionalidad | Archivo principal | Detalles |
|---|---|---|
| Onboarding con 7 perfiles | `app-onboarding.js` | Quiz 4 pasos: objetivo → nivel → tiempo → reveal |
| 183 módulos de aprendizaje | `app-data.js` | Steps: content + quiz + final. XP por completar |
| Sistema XP + niveles | `app-state.js` | XP → level → titulo desbloqueado |
| Racha diaria + shields | `app-state.js` | Max 2 escudos consumibles |
| 11 calculadoras financieras | `app-extrasB.js` + `app-tools*.js` | Ver Sección 4 |
| Calc-gate (teaser → registro) | `app-calc-gate.js` | Muestra resultado parcial, pide registro para ver completo |
| Simulador de Bolsa | `app-game.js` | 21 activos (ETFs, stocks, crypto, commodidades, IBEX) |
| Simulador de Negocios | `app-game.js` | BUSINESSES array, ingresos pasivos mensuales |
| Simulador de Vida | `app-game.js` / `app-simulator.js` | Eventos de vida, decisiones, carrera |
| Leaderboard con bots | `app-toolsC.js` | 8 bot players + 3 Shadow Investors con estrategia propia |
| Duelo de quiz (vs bot) | `app-tools2C.js` | 10 preguntas de banco de 25, timer 15s, bot acierta 65% |
| Auth Supabase | `app-supabase.js` | Email+password + Google OAuth |
| Cloud sync | `app-supabase.js` | Tabla `user_state`, upsert por `user_id` |
| Premium / Stripe | `app-game.js` | Real: monthly + annual priceIds configurados |
| PWA + Service Worker | `sw.js` | Cacheo offline, push notifications |
| Push notifications | `app-push.js` | /api/push-subscribe |
| Sistema de misiones semanales | `app-state.js` | Tick en `tickMission()`, reset semanal |
| Logros / Achievements | `app-game2.js` | `checkAchievements()` |
| Boss semanal | `app-boss-weekly.js` | Quiz especial con recompensa |
| Referral system | `app-onboarding.js` + `/api/referral-complete` | Código en URL, API de completado |
| Salud financiera (score 0-100) | `app-ui.js` | 4 factores: emergencia, inversión, constancia, aprendizaje |
| Perfil financiero real (F25) | `app-state.js` | realAssets + realDebts → realPatrimony |
| Plan de acción personalizado (F27) | `app-state.js` | actionPlan array con estados |
| Ambient background | `app-tools.js` | Canvas con partículas flotantes (€, %, ↑) |
| Tema light/dark | `app-state.js` | S.lightMode + body.classList |
| Coach IA | `/api/coach.js` | Cloudflare Function, unknown si está conectado al UI |
| Market API | `/api/market.js` | Precios de mercado externos, unknown nivel de integración |

### ⚠️ Parcialmente implementadas
| Funcionalidad | Problema detectado |
|---|---|
| Patrimonio real (F25) | `realAssets/realDebts` en estado pero UI de captura: unknown (no testeado) |
| Plan de acción (F27) | `actionPlan` en estado, lógica de generación: unknown |
| Market API real | `/api/market.js` + `/api/market-history.js` existen como CF Functions — nivel de integración con UI: unknown |
| Coach IA | `/api/coach.js` existe — integración con UI: unknown |
| Notificaciones push | Infraestructura lista, activación en UI: unknown |
| Resumen anual | Trigger confirmado (S.gameYear avanza), contenido del modal `m-year`: unknown |
| Carrera profesional | `changeCareer()` implementado, pantalla de carrera: unknown |

### ❌ No implementadas / Mock
| Funcionalidad | Estado |
|---|---|
| Análisis de gastos (OCR/import) | No existe |
| Conexión bancaria real | No existe |
| Social / comunidad real | Rankings son solo bots |
| Modo multijugador real en duelo | Bot fijo al 65% de acierto |
| Calculadora de pensiones pública | No existe (hay FIRE pero no sistema de pensiones) |

---

## 3. FLUJO DE USUARIO

### 3.1 Primera visita (usuario nuevo)
```
1. Carga app → splash screen → fade out
2. Sin estado guardado → abre m-onboarding automáticamente
3. Onboarding paso 1: selección de objetivo (6 opciones + libertad financiera)
4. Onboarding paso 2: nivel inversor (zero / saving / investing / active)
5. Onboarding paso 3: tiempo diario disponible (5 / 15 / 30 min)
6. Onboarding paso 4: reveal de perfil personalizado (7 perfiles posibles)
7. → Home con estado inicial configurado según perfil
```

### 3.2 Sesión de aprendizaje (usuario registrado)
```
1. Home → card del módulo activo (recomendado según branch)
2. Click → abre m-module con lección (bloques: text, stats, formula, hl)
3. Scroll hasta final → botón "Listo" → quiz
4. Quiz: 4 opciones, feedback inmediato, XP al acertar
5. Paso final del módulo → modal completado + XP + posible achievement
6. Volver a Home → Dashboard actualizado
```

### 3.3 Uso de calculadora (usuario no registrado)
```
1. Calculadoras → click en cualquier calculadora
2. Abre modal con inputs
3. Introduce datos y calcula
4. Ve resultado PARCIAL (resumido/borroso)
5. Aparece calc-gate-panel: CTA "Ver resultado completo"
6. Click → opciones: Registrarse o Iniciar sesión
7. Tras auth → resultado completo se revela + ocultan el gate
```

### 3.4 Uso de calculadora (usuario registrado)
```
1. Calculadoras → click
2. Introduce datos → calcula
3. Ve resultado completo directamente (sin gate)
```

### 3.5 Simulador de Bolsa
```
1. Tab Bolsa → lista de 21 activos (filtros: ETF / Stock / Crypto / Commodity)
2. Click en activo → m-stock con chart mini, precio actual, cambio %
3. Ajustar cantidad (+/-) → Ver coste total
4. Comprar → descuenta de S.cash → actualiza S.portfolio + S.invested
5. El "mercado" simula variación de precios cada game-day
6. Dividendos automáticos cada cierto tiempo
7. Crisis de mercado: evento especial con decisión (vender / comprar / aguantar)
```

### 3.6 Flujo premium
```
1. Usuario toca función premium → PM_showPaywall()
2. Modal paywall → comparativa free vs premium
3. Click "Mensual" o "Anual" → SAAS_startPayment()
4. → /api/stripe-checkout → redirect a Stripe
5. Pago → stripe-webhook → sbSetPremium(userId, '1')
6. S._premium = '1' → isPremium() = true → funciones desbloqueadas
```

---

## 4. CALCULADORAS — Descripción completa

Hay **11 calculadoras** organizadas en 3 grupos + 3 simuladores vinculados.

---

### 4.1 🔥 Proyector FIRE (`fire`)
**Objetivo:** Calcular el año de libertad financiera (Financial Independence, Retire Early).  
**Inputs:** Gastos mensuales, patrimonio actual, aportación mensual, rentabilidad esperada (%).  
**Outputs:** FIRE Number (25× gastos anuales), proyección gráfica a 30 años, año estimado de libertad.  
**Lógica:** Simula acumulación compuesta hasta cruzar el FIRE Number. Regla del 4%.  
**UX:** Gráfico de línea (Chart.js). Calc-gate activo para usuarios no registrados.  
**Estado:** ✅ Implementado.

---

### 4.2 🏠 Hipoteca vs Alquiler (`hipoteca`)
**Objetivo:** Comparar coste total de comprar vs alquilar una vivienda.  
**Inputs:** Precio de compra, porcentaje de entrada, años hipoteca, TIN, gastos de mantenimiento, alquiler equivalente, revalorización anual del inmueble.  
**Outputs:** Coste total de comprar, coste total de alquilar, punto de equilibrio (año), veredicto.  
**Lógica:** Actualiza ambas series de coste en función del tiempo, cruza cuando comprar sale rentable.  
**UX:** Tabla comparativa + gráfico. Price-to-Rent ratio implícito.  
**Estado:** ✅ Implementado.

---

### 4.3 🏦 Simulador Hipoteca (`simhipoteca`)
**Objetivo:** Calcular cuota mensual, TAE real y tabla de amortización.  
**Inputs:** Capital, plazo (años), TIN, tipo (fijo/variable), posible Euríbor + diferencial.  
**Outputs:** Cuota mensual, total a pagar, total intereses, TAE real, tabla de amortización.  
**Lógica:** Fórmula estándar de amortización francesa.  
**UX:** Tabla de amortización expandible.  
**Estado:** ✅ Implementado.

---

### 4.4 🛡️ Fondo de Emergencia (`emergencia`)
**Objetivo:** Calcular cuánto ahorrar y en cuánto tiempo llegarás al objetivo.  
**Inputs:** Gastos mensuales, ahorro mensual disponible, meses objetivo (3, 6 o personalizado).  
**Outputs:** Objetivo de fondo, meses para alcanzarlo, estado actual (si se configura).  
**Lógica:** División simple + proyección lineal.  
**UX:** Progress bar visual hacia el objetivo.  
**Estado:** ✅ Implementado.

---

### 4.5 📈 Interés Compuesto (`compound`) — T5
**Objetivo:** Proyectar el valor futuro de una inversión con aportaciones periódicas.  
**Inputs:** Capital inicial (`t5-init`), aportación mensual (`t5-month`), años, rentabilidad anual (%).  
**Outputs:** Valor futuro total, desglose capital aportado vs intereses generados, gráfico.  
**Lógica:** `FV = P×(1+r)^n + C×[(1+r)^n - 1]/r`  
**UX:** Gráfico de área stacked (capital vs intereses). Primera calculadora del onboarding.  
**Estado:** ✅ Implementado. Calc-gate activo.

---

### 4.6 📆 DCA vs Lump Sum (`dca`)
**Objetivo:** Comparar invertir periódicamente (DCA) vs de golpe (Lump Sum).  
**Inputs:** Capital total a invertir, plazo, frecuencia DCA, rentabilidad esperada.  
**Outputs:** Valor final DCA, valor final Lump Sum, diferencia, veredicto según horizonte.  
**Lógica:** Simula ambas estrategias con la misma rentabilidad histórica media.  
**UX:** Gráfico comparativo de ambas curvas.  
**Estado:** ✅ Implementado.

---

### 4.7 ⚡ Regla del 72 (`regla72`)
**Objetivo:** Calcular en cuántos años se dobla el capital a una tasa dada.  
**Inputs:** Tasa de interés anual (%).  
**Outputs:** Años para doblar (72/tasa), comparación con varias tasas comunes.  
**Lógica:** `Años = 72 / tasa`. Simple.  
**UX:** Resultado inmediato, tabla de referencia de tasas comunes.  
**Estado:** ✅ Implementado. Calculadora más rápida (0 inputs bloqueantes).

---

### 4.8 ❄️ Bola de Nieve (`snowball`)
**Objetivo:** Comparar estrategias Snowball (menor saldo primero) vs Avalanche (mayor TAE primero).  
**Inputs:** Lista de deudas con saldo, TAE y pago mínimo. Dinero extra mensual disponible.  
**Outputs:** Meses para liquidar cada deuda en cada estrategia, total de intereses pagados, gráfico de payoff.  
**Lógica:** Simula mes a mes hasta saldo = 0 en ambas estrategias.  
**UX:** Visualización side-by-side de las dos estrategias.  
**Estado:** ✅ Implementado.

---

### 4.9 💳 Coste Real de la Deuda (`deuda`)
**Objetivo:** Mostrar el coste real (total intereses) de una tarjeta o préstamo pagando mínimos.  
**Inputs:** Saldo actual, TAE, pago mensual (mínimo o personalizado).  
**Outputs:** Meses para liquidar, total intereses, coste real total, comparación con pago acelerado.  
**Lógica:** Amortización mes a mes, calcula interés cada período.  
**UX:** "Alerta" visual cuando el coste real supera el doble del capital.  
**Estado:** ✅ Implementado.

---

### 4.10 🧾 Simulador IRPF 2025 (`irpf`)
**Objetivo:** Calcular cuota íntegra del IRPF y tipo efectivo para España 2025.  
**Inputs:** Salario bruto anual, situación familiar (soltero/casado/hijos), CCAA (tramos autonómicos).  
**Outputs:** Cuota íntegra estatal + autonómica, tipo marginal, tipo efectivo, neto anual estimado.  
**Lógica:** Tramos del IRPF 2025 (estatal + autonómico según CCAA seleccionada).  
**UX:** Desglose visual por tramos.  
**Estado:** ✅ Implementado. Nota: tramos autonómicos: nivel de detalle unknown.

---

### 4.11 💎 Net Worth Tracker (`networth`) — T6
**Objetivo:** Calcular y trackear el patrimonio neto real con histórico.  
**Inputs:** Activos (ahorro, inversiones, inmueble, pensión, otros), pasivos (hipoteca, préstamos, tarjetas).  
**Outputs:** Patrimonio neto = activos - pasivos, histórico de snapshots.  
**Lógica:** Suma de activos menos suma de pasivos. Snapshot guardado en localStorage con fecha.  
**UX:** Botón "Guardar snapshot" → toast de confirmación → histórico en lista.  
**Estado:** ✅ Implementado. Bug corregido en esta sesión (toast incorrecto).

---

### Simuladores (acceso desde pantalla Calculadoras)
| Simulador | Descripción | Estado |
|---|---|---|
| 📊 Bolsa | Compra/venta de 21 activos con precios simulados. Donut chart de cartera. Dividendos. Crisis de mercado. | ✅ |
| 🌍 Vida | Decisiones de vida (comprar casa, cambiar trabajo, tener hijos) con impacto financiero simulado. | ✅ |
| 🏪 Negocios | Adquirir negocios con coste de entrada y flujo de caja mensual pasivo. | ✅ |

---

## 5. PROBLEMAS UX/UI DETECTABLES

### 5.1 Fricción de registro — Alta — ✅ RESUELTO 5 jul 2026 (ver sección 0)
**Problema:** El calc-gate muestra el CTA de registro dentro del modal de la calculadora, sin contexto de por qué registrarse o qué valor adicional obtiene el usuario al hacerlo. El CTA es genérico.  
**Impacto:** Alta tasa de abandono en el punto de mayor intención del usuario (acaba de calcular algo).  
**Sugerencia:** Personalizar el mensaje del gate según la calculadora. "Regístrate para ver tu fecha exacta de libertad financiera" > "Para ver el resultado completo".

### 5.2 Onboarding — Falta de ancla emocional inmediata
**Problema:** El onboarding recoge objetivo, nivel y tiempo, pero termina con un reveal de perfil que no es accionable. El usuario no sabe qué hacer después.  
**Impacto:** Los usuarios que no saben qué hacer primero se pierden en el home.  
**Sugerencia:** Al final del onboarding, llevar directamente al módulo sugerido (`suggestedModuleId`), no al home genérico.

### 5.3 Bottom nav — Sobrecargar con simuladores
**Problema:** Bolsa está en el tab nav a nivel igual que Aprender. Los simuladores son secundarios para usuarios en fase de aprendizaje (la mayoría al inicio).  
**Impacto:** Distracción. Usuarios de aprendizaje se van a jugar a la bolsa y no completan módulos.

### 5.4 Calculadoras — Sin educación contextual
**Problema:** Las calculadoras son herramientas puras, sin contexto pedagógico. Después de calcular el FIRE Number, el usuario no sabe qué hacer con esa información.  
**Impacto:** La calculadora no convierte en completar un módulo relacionado.  
**Sugerencia:** Después de calcular, mostrar CTA hacia el módulo relacionado ("Aprende a optimizar tu FIRE Number → Módulo FIRE").

### 5.5 Racha diaria — Sin micro-reminder visible
**Problema:** El sistema de racha existe y tiene shields, pero no hay un reminder visible en home sobre cuánto tiempo queda para perder la racha del día.  
**Impacto:** Los usuarios olvidan entrar y pierden rachas.

### 5.6 Modal calculadora — Sin deep link
**Problema:** Las calculadoras se abren como modales dinámicos sin URL propia. No se puede compartir un resultado concreto ni llegar directamente desde una notificación push a una calculadora específica.  
**Impacto:** Limita retargeting y sharing.

### 5.7 Leaderboard — Desconfianza latente
**Problema:** Todos los rivales del ranking son bots (BOT_PLAYERS + SHADOW_INVESTORS). Esto es correcto para MVP, pero usuarios avanzados lo pueden detectar (los bots tienen nombres/emojis fijos y comportamiento predecible).  
**Impacto:** Cuando se detecta, se destruye la motivación de competir.

### 5.8 Dashboard — Proyección sin contexto de riesgo
**Problema:** El home muestra proyecciones a 10/20/30 años con rentabilidad fija elegida por el usuario (default 7%). Sin ningún aviso de que es una estimación y puede variar.  
**Impacto:** Puede crear expectativas irrealistas. Riesgo regulatorio en el futuro.

### 5.9 Premium paywall — Sin prueba gratuita clara — ✅ COHERENCIA RESUELTA 5 jul 2026 (ver sección 0; el trial de 7 días sigue sin implementar, ver P8)
**Problema:** El paywall aparece sin haber mostrado claramente qué funciones son premium antes de llegar al muro. El usuario no sabe qué pierde.  
**Impacto:** Conversión baja: el usuario no percibe el valor diferencial antes de pagar.

---

## 6. RIESGOS TÉCNICOS

### 6.1 Estado versión — Migración sin safety net
**Riesgo:** La clave de localStorage es `finlearn_v9_state`. Si cambia la estructura del estado en una actualización y hay usuarios con v9, `loadState()` puede cargar un estado parcialmente compatible sin error visible.  
**Severidad:** Alta. Puede causar crashes silenciosos o datos corruptos.  
**Mitigación actual:** Campos nuevos tienen valores default en DEFAULTS. Insuficiente para cambios de estructura.  
**Recomendación:** Añadir un campo `_schemaVersion` en DEFAULTS y un migration runner en `loadState()`.

### 6.2 MODULES — 2 entradas null — ✅ RESUELTO 5 jul 2026 (ver sección 0)
**Riesgo:** `MODULES` contiene 2 entradas `null` o `undefined`. Cualquier `.find()`, `.filter()` o acceso a `.id` sin null-guard crashea.  
**Severidad:** Media. Ya corregido en `_getNextRecommendedMod`. Pueden existir otros puntos sin null-guard.  
**Recomendación:** Limpiar el array de datos eliminando los nulls, o añadir null-guard en todos los iteradores de MODULES.

### 6.3 Supabase sync — Sin retry ni conflicto
**Riesgo:** `sbSaveState()` hace upsert pero sin manejo de offline/retry. Si el usuario edita en dos dispositivos, el último save gana sin merge.  
**Severidad:** Media. Pérdida de progreso posible en multi-device.  
**Recomendación:** Comparar `lastSessionTs` antes de sobrescribir. En conflicto, el de mayor timestamp gana.

### 6.4 S._sbUser — Stale closure en app-calc-gate.js
**Riesgo:** Corregido en esta sesión. La versión original comprobaba `window._sbUser` manualmente en lugar de usar el auth listener de Supabase. Si hay otros lugares con el mismo patrón, pueden no detectar login correctamente.  
**Recomendación:** Grep de `window._sbUser` y `_sbUser` en todos los archivos para verificar.

### 6.5 Stripe priceIds — Hardcoded en código fuente
**Riesgo:** Los priceIds de Stripe están en `app-game.js` (código cliente, visible en producción).  
**Severidad:** Baja (son IDs públicos, no secretos). Pero si se cambian en Stripe, hay que actualizar el código y redeploy.  
**Recomendación:** Cargar desde config o desde la API si se quiere flexibilidad.

### 6.6 Service Worker — Cache stale sin versión
**Riesgo:** `sw.js` cachea assets para offline. Si el cache no se invalida correctamente en deploys, usuarios pueden tener versiones viejas del JS.  
**Severidad:** Media. Puede causar inconsistencias entre código y estado.  
**Recomendación:** Verificar que el SW tiene un CACHE_VERSION que cambia en cada deploy.

### 6.7 API Functions — Secrets en Cloudflare Workers
**Riesgo:** `/api/stripe-checkout.js`, `/api/coach.js` etc. requieren secrets (Stripe secret key, Supabase service key, AI API key). Si no están configurados como Cloudflare environment variables, fallarán silenciosamente.  
**Estado:** unknown — no se ha verificado el deploy de Functions.

### 6.8 Toast API — Llamadas con firma incorrecta (parcialmente corregido)
**Riesgo:** Se encontraron y corrigieron 5 llamadas con la firma antigua (`showToast` o args en orden incorrecto). Pueden existir más en archivos no auditados.  
**Recomendación:** `grep -r "showToast\|toast(" . --include="*.js"` para verificar firma completa.

---

## 7. BLOQUEADORES DE CRECIMIENTO (si lanzas hoy)

### B1 — Sin analytics → no sabes dónde abandonan los usuarios
Sin Mixpanel, Amplitude ni siquiera GA4. No puedes saber en qué paso del onboarding se van, qué calculadoras usan más, cuántos llegan al calc-gate pero no se registran, ni cuántos módulos completan.  
**Impacto:** Imposible optimizar conversión sin datos.

### B2 — Sin email de activación ni retención
No hay emails de bienvenida, ni de "vuelve que llevas 3 días sin entrar", ni de "desbloqueaste X". El push notification está implementado pero la activación en UI es unknown.  
**Impacto:** Retención a 7 días probablemente muy baja (<20%).

### B3 — El leaderboard es fake y visible
Cuando un usuario lleva 2 semanas y ve que los "competidores" no crecen de forma natural, se rompe la ilusión. No hay usuarios reales compitiendo.  
**Impacto:** El mayor motor viral (competencia social) no funciona sin masa crítica.

### B4 — Sin SEO ni landing pública indexable
La app es una SPA con onboarding directo. No hay páginas de contenido indexables ("qué es el interés compuesto", "calculadora hipoteca España") que puedan atraer tráfico orgánico.  
**Impacto:** Sin canal de adquisición gratuito escalable.

### B5 — Premium sin prueba real
El free tier da acceso parcial a calculadoras (via gate), pero el usuario no experimenta qué es premium antes de ver el paywall. No hay trial gratuito de 7 días.  
**Impacto:** CAC alto, LTV incierto.

### B6 — Sin referral visible en UI — ❌ YA NO APLICA, ver sección 0
El sistema de referidos existe en backend (`/api/referral-complete`, detección de código en URL) pero no hay UI visible para que el usuario genere y comparta su propio código de referido.  
**Impacto:** El canal viral más barato no está activo.

---

## 8. PRIORIDADES DE CONVERSIÓN (mayor impacto primero)

### P1 — Personalizar el calc-gate por calculadora ⭐⭐⭐⭐⭐ — ✅ HECHO 5 jul 2026
**Por qué es el #1:** Es el punto de mayor intención en toda la app. El usuario acaba de calcular algo importante para su vida. El CTA genérico desperdicia ese momento.  
**Qué hacer:** En cada calculadora, el gate muestra el dato bloqueado que más duele ("Tu fecha de libertad financiera es... [desbloqueada]") y el CTA es específico ("Descubre cuándo te liberas").  
**Esfuerzo:** Bajo. Es cambiar el texto del gate por calculadora.  
**Impacto esperado:** +30-50% en conversión de registro desde calculadoras.

### P2 — Onboarding → módulo directo (sin pasar por home) ⭐⭐⭐⭐
**Por qué:** El primer módulo completado es el mayor predictor de retención a 7 días.  
**Qué hacer:** Al finalizar onboarding, botón CTA que lleva directamente a `suggestedModuleId` en lugar de al home.  
**Esfuerzo:** Bajo.

### P3 — Activar push notifications con un hook de valor ⭐⭐⭐⭐
**Por qué:** La infraestructura ya existe. Solo falta el momento correcto para pedirlo.  
**Qué hacer:** Pedir permiso de notificaciones justo después de completar el primer módulo ("¿Quieres que te avise cuando tu racha esté en riesgo?"), no al entrar frío.  
**Esfuerzo:** Bajo.

### P4 — Añadir analytics básicos ⭐⭐⭐⭐
**Por qué:** Sin datos, todo lo demás es especulación.  
**Qué hacer:** Añadir eventos mínimos: `onboarding_complete`, `module_complete`, `calc_used`, `gate_shown`, `gate_converted`, `paywall_shown`, `paywall_converted`.  
**Esfuerzo:** Medio. Una función `track(event, props)` + PostHog o Mixpanel free tier.

### P5 — UI del referral program ⭐⭐⭐
**Por qué:** El backend ya existe. El coste de adquisición vía referidos es ~0.  
**Qué hacer:** En Perfil, un botón "Invita a un amigo" que genera y copia el link con el código personal.  
**Esfuerzo:** Bajo.

### P6 — Landing de SEO para las calculadoras ⭐⭐⭐
**Por qué:** "calculadora hipoteca españa 2025" tiene 10k+ búsquedas/mes. Las calculadoras de FinLearn son competitivas.  
**Qué hacer:** Páginas estáticas `/calculadora-hipoteca`, `/calculadora-fire`, etc. con la calculadora embebida y texto SEO.  
**Esfuerzo:** Medio.

### P7 — Email de retención D3/D7 ⭐⭐⭐
**Por qué:** La mayoría de usuarios que no vuelven en 3 días no vuelven nunca.  
**Qué hacer:** Email automático a los 3 días de inactividad con el progreso del usuario ("Llevas 450 XP, estás al 23% del nivel 4. Tu racha de 5 días está en riesgo.").  
**Esfuerzo:** Medio (requiere email service: Resend, Mailgun, etc.).

### P8 — Trial premium de 7 días ⭐⭐
**Por qué:** El usuario no puede valorar premium sin probarlo.  
**Qué hacer:** Al completar el módulo 5, ofrecer 7 días de premium gratuito sin tarjeta.  
**Esfuerzo:** Medio (requiere lógica de expiración en Supabase).

---

## RESUMEN EJECUTIVO

**Estado de la app:** Funcionalmente completa para MVP. 183 módulos, 11 calculadoras, 3 simuladores, auth, pagos reales y PWA. La base técnica es sólida.

**Riesgo técnico principal:** Migración de estado sin versionado (`_schemaVersion` ausente) y 2 entradas null en MODULES que ya han causado un crash detectado en testing.

**Mayor oportunidad de conversión:** El calc-gate captura usuarios en el momento de máxima intención pero el mensaje es genérico. Personalizarlo es el cambio de mayor impacto con menor esfuerzo.

**Bloqueador #1 para escalar:** Sin analytics no se puede optimizar. Es la primera inversión técnica que hay que hacer.

**Lo que más falta:** Retención post-registro (email D3/D7), referral UI visible, y SEO para captar tráfico orgánico de las calculadoras.

---

*Auditoría generada el 10/06/2026 sobre código fuente directo + verificación Playwright (34/34 tests PASS).*

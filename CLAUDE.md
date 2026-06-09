# FinLearn — CLAUDE.md

PWA de educación financiera en español. Vanilla JS puro, sin frameworks, sin build step.
Abrir `index.html` directamente en el navegador.

---

## Arquitectura de archivos

Scripts cargados en `index.html` en este orden exacto (no cambiar):

| # | Archivo | Líneas | Contenido principal |
|---|---------|--------|---------------------|
| 1 | `app-data.js` | 1837 | MODULES[] módulos 0-33 |
| 2 | `app-data-m.js` | 1858 | MODULES.push() módulos 34-107 |
| 3 | `app-data2.js` | 1437 | STOCKS, CAREERS, CAREER_EVENTS, BUSINESSES, ACHIEVEMENTS, LEVEL_* |
| 4 | `app-data2-m.js` | 1878 | EXAM_QUESTION_POOL (push módulos 108-174), MODULE_REAL_ACTIONS_MAP, WEEKLY_ACTIONS |
| 5 | `app-state.js` | — | Estado global `S`, `DEFAULTS`, `GAME`, `saveState()`, `loadState()` |
| 6 | `app-supabase.js` | — | Integración Supabase |
| 7 | `app-ui.js` | 1476 | Renderizado de home, módulos, bolsa, onboarding |
| 8 | `app-uiB.js` | 1524 | Simuladores vida/negocio, carrera, certificados, más render |
| 9 | `app-ui2.js` | 1720 | F25 (presupuesto), F27 (plan de acción) |
| 10 | `app-ui2B.js` | 1763 | finishOnboarding, más render avanzado |
| 11 | `app-game.js` | 1531 | XP, niveles, logros, bolsa/negocio/vida |
| 12 | `app-game2.js` | 1057 | renderDailyDelta, combo, SAAS, PWA, B2B |
| 13 | `app-tools.js` | 1984 | initApp, legal, CHART, roulette, streak, SFX, HAPTIC, debt, career |
| 14 | `app-toolsB.js` | 1697 | MUSIC, splash, tutorial, crisis, life events, news, patrimony chart |
| 15 | `app-toolsC.js` | 445 | BOT_PLAYERS, rankings, mortgages |
| 16 | `app-tools2.js` | 1009 | SCENARIOS, WhatIf, FIRE, STREAMER, secret achievements |
| 17 | `app-tools2B.js` | 1280 | AI_COACH |
| 18 | `app-tools2C.js` | 924 | Portfolio donut, DUEL, FinAI config, job offers, window exports, theme |
| 19 | `app-tools3.js` | 1990 | MISSION_POOL, lifestyle, econ news, stats screen, CAL, ledger |
| 20 | `app-tools3B.js` | 1987 | F28-F43 (branches, daily chest, leagues, streaks, daily challenge, etc.) |
| 21 | `app-extras.js` | 1112 | Features adicionales parte 1 |
| 22 | `app-extrasB.js` | 1282 | renderToolsScreen + más features |
| 23 | `app-extras2.js` | 1182 | Features adicionales parte 3 |
| 24 | `app-extras2B.js` | 1189 | CERT_openBranch + features finales |

CSS (en orden): `app.css` → `appB.css` → `appC.css` → `appD.css` → `app2.css` → `app2B.css` → `app2C.css` → `app2D.css` → `app-extra.css`
(Cada parte ~1900-2050 líneas)

**Todas las variables son globales entre archivos. No hay `import`/`export`. No hay build step.**

---

## Estado de los módulos

- **181 módulos** en total:
  - 171 módulos en **formato antiguo** (IDs 0–174, no todos correlativos)
  - 10 módulos en **formato nuevo** (IDs 175–184)
- **Siguiente ID libre: 185**
- IDs eliminados (duplicados): 91, 92, 93, 105

Para validar el array MODULES y la consistencia con F28_BRANCHES:
```bash
node analyze-modules.js
```

---

## Estructura de un módulo

### Formato antiguo (IDs 0–174, todos correlativos)

```js
{
  id:NNN,                   // sin espacio después de los dos puntos
  icon:'📊',                // emoji único — no repetir ninguno existente
  title:'Título del módulo',
  desc:'Subtítulo corto de una línea',
  xp:100, tag:'CATEGORÍA', tagC:'green', users:'12.400',
  steps:[
    // ── Paso de contenido ──────────────────────────────────────────────────
    { type:'content', tag:'📊 Módulo NNN',
      title:'Título de la sección',
      intro:'Párrafo introductorio.',
      bullets:['🔑 Punto 1', '📈 Punto 2', '💡 Punto 3'],
      fact:'Dato curioso o estadística impactante.' },

    // ── Paso de quiz (formato CORRECTO) ────────────────────────────────────
    { type:'quiz', tag:'🧠 Quiz', title:'¿Pregunta?',
      opts:[
        {t:'Opción A',        ok:false},
        {t:'Opción correcta', ok:true},
        {t:'Opción C',        ok:false},
        {t:'Opción D',        ok:false},
      ],
      ok:'Explicación cuando acierta.',
      bad:'Explicación cuando falla.' },

    // ── Paso final (OBLIGATORIO — sin él el módulo no se completa) ─────────
    { type:'final', xp:100, msg:'Mensaje de felicitación personalizado.' }
  ]
}
```

### Formato nuevo (IDs 175–184, próximos a partir de 185)

```js
{
  id: NNN,                  // con espacio después de los dos puntos
  icon: '📊',               // emoji único
  title: 'Título del módulo',
  desc: 'Subtítulo corto de una línea',
  xp: 25, tag: 'CATEGORÍA', tagC: '#hex_color',
  steps: [
    // ── Paso de contenido con bloques ────────────────────────────────────
    { type: 'content', title: 'Título de la sección',
      blocks: [
        { t: 'text', h: 'Subtítulo del bloque', p: 'Párrafo HTML.' },
        { t: 'list', h: 'Lista', items: ['Punto 1', 'Punto 2'] },
        { t: 'stat', label: 'Dato clave', value: '42%' },
      ] },

    // ── Paso de quiz (mismo formato que antiguo) ─────────────────────────
    { type: 'quiz', tag: '🧠 Quiz', title: '¿Pregunta?',
      opts: [
        { t: 'Opción A',        ok: false },
        { t: 'Opción correcta', ok: true  },
      ],
      ok: 'Explicación cuando acierta.',
      bad: 'Explicación cuando falla.' },

    // ── Paso final ────────────────────────────────────────────────────────
    { type: 'final', xp: 25, msg: 'Mensaje de felicitación.' }
  ]
}
```

> **IMPORTANTE:** El paso `{type:'final'}` es obligatorio en todos los módulos. Sin él, el usuario no puede marcar el módulo como completado y no recibe XP.

---

## Formato de quiz — formato antiguo ROTO (no usar)

```js
// ❌ FORMATO ANTIGUO — ya eliminado de todos los módulos
{ type: 'quiz', opts: ['A','B','C','D'], correct: 1, exp: 'Explicación.' }

// ✅ FORMATO CORRECTO
{ type: 'quiz', opts: [{t:'A',ok:false},{t:'B',ok:true},{t:'C',ok:false},{t:'D',ok:false}], ok:'...', bad:'...' }
```

---

## Flujo de render

```
renderHomeScreen()
  ├── updateUIFromState()   ← actualiza DOM con estado actual
  └── renderModules()       ← pinta el grid de módulos

refreshUI()
  ├── renderModules()
  ├── updateProgressText()
  └── updateUIFromState()
```

---

## Variables y constantes críticas

| Variable | Valor | Dónde |
|----------|-------|-------|
| `S` | Objeto de estado global | `app-state.js` |
| `DEFAULTS` | Estado inicial con todos los campos | `app-state.js` |
| `GAME` | Estado de sesión efímero (no persiste) | `app-state.js` |
| `MODULES` | Array de módulos | `app-data.js` |
| `F28_BRANCHES` | Ramas del árbol de aprendizaje | `app-tools.js` |
| `xpPerLevel` | **1200** — aparece 3 veces en `app-ui.js` | `app-ui.js` |
| `LS_KEY` | `'finlearn_v9_state'` | `app-state.js` |

---

## Reglas

### SIEMPRE
- Buscar en TODOS los archivos antes de cambiar algo (una constante puede estar en 3 sitios)
- Confirmar qué archivos se van a tocar antes de tocarlos
- Verificar sintaxis JS después de cada cambio (`node -e "require('./app-data.js')"`)
- Todo nuevo módulo necesita icono único (todos los 181 actuales ya tienen iconos únicos)

### NUNCA
- Tocar código fuera del scope de lo pedido
- Añadir módulos con IDs ya existentes
- Poner en `F28_BRANCHES` un ID que no exista en `MODULES`
- Cambiar `xpPerLevel` a ningún valor distinto de **1200**
- Revertir los bugs ya corregidos (ver sección siguiente)
- Usar `import`/`export` ni convertir a ES6 modules
- Reordenar los `<script>` en `index.html`
- Usar el formato antiguo de quiz (`opts:[string], correct:N, exp:`)

---

## Bugs corregidos — no revertir

### Bugs de código (`app-state.js`)
1. **Timezone en streak** — `toISOString()` usaba UTC y rompía rachas para usuarios no-UTC → cambiado a `toLocaleDateString('sv')` (YYYY-MM-DD en hora local)
2. **Migración balance→cash** — condición `&& S.cash <= 5000` impedía la migración → eliminada; ahora siempre fusiona `S.balance` en `S.cash`
3. **xpMultiplierExpiry nunca comprobado** — el multiplicador de XP temporal nunca expiraba al recargar → añadida comprobación al inicio de `loadState()`

### Bugs de datos (`app-data.js` y `app-tools.js`)
4. **Módulos 6–29 sin paso final** — 24 módulos no tenían `{type:'final'}` → añadido a todos
5. **Módulos 30–76 con formato de quiz roto** — 51 quizzes usaban `opts:[strings]` + `correct:N` + `exp:` → convertidos al formato correcto con `opts:[{t,ok}]` + `ok:` + `bad:`; además se añadió `{type:'final'}` a los 47 módulos de ese bloque
6. **Módulos duplicados** — eliminados 91, 92, 93, 105 (versiones más cortas de 100, 101, 102, 11)
7. **Iconos duplicados (88 viejos + 8 nuevos)** — 88 módulos 0-174 compartían icono; después de añadir módulos 175-184, otros 8 quedaron duplicados → todos los **181 módulos tienen icono único**
8. **`F28_BRANCHES` con IDs inválidos** — contenía 91, 92, 93, 105 (borrados) y faltaban 49 y 53 → limpiado y completado; **todos los 181 módulos mapeados en sus ramas correctas**
9. **`renderModules()` llamado dos veces en `renderHomeScreen()`** → una llamada eliminada
10. **`xpPerLevel = 1500`** → corregido a 1200
11. **`updateProgressText` usaba `MODULES.length`** → usa `filter` por `typeof id`
12. **Tags de steps con off-by-one** — módulos 6-107 usaban `'X Módulo N'` (id) en vez de `'X Módulo N+1'`; módulos 108-174 usaban `'X MN'` en vez de `'X MN+1'` → corregidos 231 tags en total

### Arquitectura especial (no cambiar)
- Módulos 108-174 están definidos dentro de `EXAM_QUESTION_POOL` en `app-data.js`; el IIFE los mueve a `MODULES` en tiempo de ejecución
- Los módulos 175-184 usan `id: N,` (con espacio) y `blocks:[]` en los steps en lugar de `bullets:[]+fact:`
- `FINANCIAL_FACTS` y `DAILY_QUESTIONS` usan su propio formato de quiz (`q:`, `correct:N`, `explain:`) — **no confundir ni cambiar al formato de módulo**

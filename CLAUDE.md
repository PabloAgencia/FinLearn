# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

FinLearn is a Spanish-language personal finance education PWA (Progressive Web App). Vanilla JS, no framework, no build step — open `index.html` directly in a browser.

## How to run / verify changes

No build or install step. Open `index.html` in a browser, then:
- Open DevTools (F12) → Console → no red errors
- Navigate 2–3 modules and complete a quiz
- If something breaks: Ctrl+Z the touched file and report the exact error

To validate the MODULES array and F28_BRANCHES consistency:
```bash
node analyze-modules.js
```

## Architecture

### Script loading order (must not change)
All variables are global — no ES6 modules, no `import`/`export`. Scripts load in this exact order via `<script>` tags in `index.html`:

1. `app-data.js` — `MODULES[]` array, IDs 0–130+
2. `app-state.js` — global state object `S`, `DEFAULTS`, `GAME`, `saveState()`, `loadState()`, `clearState()`
3. `app-game.js` — stock/business/career/life simulators, XP and level logic
4. `app-tools.js` — `F28_BRANCHES`, calculators, advanced features
5. `app-ui.js` — all screen rendering
6. `app-extras.js` — additional features
7. `app.js` — main entry point

CSS: `app.css` (main) + `app-extra.css` (extras)

### State flow
```
App starts → loadState() reads localStorage → fills S
User action → modifies S directly → saveState() writes S to localStorage
Reload      → loadState() restores exact state
```

### Render flow
```
renderHomeScreen()
  ├── updateUIFromState()   ← updates DOM from current state
  └── renderModules()       ← paints module grid

refreshUI()
  ├── renderModules()
  ├── updateProgressText()
  └── updateUIFromState()
```

### Critical globals
- `S` — live state object (app-state.js)
- `MODULES` — module array (app-data.js), IDs 0–130+
- `GAME` — transient game state: stock prices, active filters
- `F28_BRANCHES` — branch definitions in app-tools.js; every ID listed here must exist in MODULES
- `xpPerLevel = 1200` — appears 3 times in app-ui.js; do not change

## Module structure (for adding new modules)

Next free ID is 175 (IDs 0–174 are in use). Each module:
```js
{
  id: N,
  icon: '📊',
  title: 'Title',
  desc: 'One-line subtitle',
  xp: 100,
  tag: 'CATEGORY',
  tagC: 'green',   // green | blue | purple | orange | red | gold | yellow
  users: '12.400',
  steps: [
    { type: 'content', tag: '📖 M131', title: 'Title', content: '<h3>…</h3><p>…</p>' },
    { type: 'quiz', tag: '🧠 TEST', q: '?', opts: ['A','B','C','D'], ans: 0, exp: 'Explanation.' }
  ]
}
```

## Rules

### Always
- Search ALL files before changing anything (a constant like `xpPerLevel` can appear in 3 places)
- Confirm which files will be touched before touching them

### Never
- Touch code outside the scope of what was asked
- Add module IDs that already exist
- Add IDs to `F28_BRANCHES` that don't exist in `MODULES`
- Change `xpPerLevel` to any value other than 1200
- Add `import`/`export` or convert to ES6 modules
- Reorder `<script>` tags in `index.html`

## Known fixed bugs — do not revert
1. `F28_BRANCHES` had invalid IDs 108–130 → removed
2. `renderModules()` was called twice in `renderHomeScreen()` → one call removed
3. `grid.style.display` not managed explicitly → fixed
4. `xpPerLevel = 1500` → changed to 1200
5. `updateProgressText` used `MODULES.length` → now filters by `typeof id`
6. API keys (Stripe, Gemini) were hardcoded → moved to `process.env` variables
7. `tag-yellow` CSS class was missing → added to app.css
8. `openFinAIConfig()` used `finlearn_api_key` → unified to `finai_api_key`
9. `analyze-modules.js` crashed with `let MODULES` conflict → changed to `var MODULES`

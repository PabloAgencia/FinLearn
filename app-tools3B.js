function downloadLedgerCSV() {
  _initLedger();
  const entries = S.ledger || [];
  if (entries.length === 0) {
    toast('⚠️ Historial vacío', 'Aún no hay movimientos que exportar.', 't-warn');
    return;
  }

  const BOM = '\uFEFF'; // BOM para que Excel abra UTF-8 correctamente
  const header = ['Fecha', 'Día juego', 'Tipo', 'Categoría', 'Descripción', 'Importe (€)', 'Saldo tras op. (€)'];

  const rows = entries.map(function(e) {
    var date = new Date(e.ts).toLocaleDateString('es-ES', { year:'numeric', month:'2-digit', day:'2-digit' });
    var time = new Date(e.ts).toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' });
    var dateStr = date + ' ' + time;
    var sign = e.type === 'in' ? '+' : '-';
    var amount = sign + e.amount.toFixed(2);
    var desc = '"' + (e.desc || '').replace(/"/g, '""') + '"';
    return [
      dateStr,
      e.gameDay || 0,
      e.type === 'in' ? 'Entrada' : 'Salida',
      e.cat || 'other',
      desc,
      amount,
      (e.balanceAfter || 0).toFixed(2)
    ].join(';');
  });

  var csv = BOM + header.join(';') + '\n' + rows.join('\n');
  var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'finlearn-historial-' + new Date().toISOString().slice(0,10) + '.csv';
  document.body.appendChild(a);
  a.click();
  setTimeout(function() { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
  toast('✅ CSV exportado', entries.length + ' movimientos descargados.', 't-success');
}

window._ledgerAdd         = _ledgerAdd;
window.renderLedger       = renderLedger;
window.toggleLedger       = toggleLedger;
window.downloadLedgerCSV        = downloadLedgerCSV;
window.switchPatrimonyTab        = switchPatrimonyTab;
window.renderPatrimonyDailyChart = renderPatrimonyDailyChart;
window.renderPatrimonyChartAuto  = renderPatrimonyChartAuto;

// F25 — Tracker Patrimonio Real
window.F25_open       = F25_open;
window.F25_close      = F25_close;
window.F25_tab        = F25_tab;
window.F25_liveUpdate = F25_liveUpdate;
window.F25_save       = F25_save;

// F27 — Plan de Acción Personalizado
window.F27_render    = F27_render;
window.F27_refresh   = F27_refresh;
window.F27_stepDone  = F27_stepDone;
window.F27_stepUndo  = F27_stepUndo;
window.F27_openModule = F27_openModule;

/* ══════════════════════════════════════════════════════════════════
   F28 — SKILL TREE VISUAL
   Mapa visual de módulos organizado en 6 ramas temáticas.
   Nodos conectados, estados: locked / available / completed.
   Animación de unlock al completar un módulo.
══════════════════════════════════════════════════════════════════ */

const F28_BRANCHES = [
  {
    id: 'fundamentos', label: 'Fundamentos', emoji: '🏗️', color: '#00e5a0',
    mods: [0, 11, 29, 39, 57, 70, 75, 103, 108, 114, 116, 122, 129, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 175, 177]
  },
  {
    id: 'inversion', label: 'Inversión', emoji: '📈', color: '#60a5fa',
    mods: [1, 7, 16, 26, 30, 32, 34, 36, 48, 58, 61, 62, 66, 96, 99, 101, 104, 106, 113, 117, 121, 123, 125, 127, 128, 146, 147, 148, 149, 178, 179, 180, 183]
  },
  {
    id: 'deuda', label: 'Deuda & Riesgo', emoji: '🔄', color: '#fb923c',
    mods: [3, 14, 25, 31, 37, 41, 55, 120, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171]
  },
  {
    id: 'fiscalidad', label: 'Fiscalidad', emoji: '🧾', color: '#fbbf24',
    mods: [4, 9, 21, 28, 38, 42, 49, 51, 60, 68, 83, 94, 100, 110, 119, 126, 172, 173, 174, 182]
  },
  {
    id: 'psicologia', label: 'Psicología', emoji: '🧠', color: '#c084fc',
    mods: [2, 6, 20, 33, 53, 54, 59, 67, 71, 74, 78, 95, 98, 107, 112, 118, 124, 130, 181]
  },
  {
    id: 'avanzado', label: 'Avanzado', emoji: '🚀', color: '#f87171',
    mods: [5, 8, 10, 12, 13, 15, 17, 18, 19, 22, 23, 24, 27, 35, 40, 43, 44, 45, 46, 47, 50, 52, 56, 63, 64, 65, 69, 72, 73, 76, 77, 79, 80, 81, 82, 89, 90, 97, 102, 109, 111, 115, 184]
  },
  {
    id: 'vivienda', label: 'Vivienda', emoji: '🏠', color: '#34d399',
    mods: [84, 85, 86, 87, 88, 176]
  }
];

let _f28Expanded = false;
let _f28LastUnlock = null; // modId that just unlocked (for animation)

function F28_render() {
  const container = document.getElementById('f28-skill-tree');
  if (!container) return;

  const completed = new Set(S.completedMods || []);
  const suggested = S.suggestedModuleId;
  const showRows = _f28Expanded ? 99 : 2; // how many branches to show fully

  let html = '';

  F28_BRANCHES.forEach((branch, bIdx) => {
    const branchCompleted = branch.mods.filter(id => completed.has(id)).length;
    const branchTotal = branch.mods.length;
    const pct = Math.round((branchCompleted / branchTotal) * 100);
    const isCollapsed = !_f28Expanded && bIdx >= 2;

    if (isCollapsed) return;

    html += `<div class="f28-branch" data-branch="${branch.id}">
      <div class="f28-branch-header">
        <span class="f28-branch-emoji">${branch.emoji}</span>
        <span class="f28-branch-name">${branch.label}</span>
        <div class="f28-branch-bar">
          <div class="f28-branch-fill" style="width:${pct}%;background:${branch.color}"></div>
        </div>
        <span class="f28-branch-pct" style="color:${branch.color}">${branchCompleted}/${branchTotal}</span>
      </div>
      <div class="f28-nodes-row">`;

    branch.mods.forEach((modId, idx) => {
      const mod = (typeof MODULES !== 'undefined') ? MODULES.find(m => m && m.id === modId) : null;
      if (!mod) return;
      const isDone = completed.has(modId);
      // Branch-local lock: first node always unlocked, others need previous in branch done
      const prevDone = idx === 0 || completed.has(branch.mods[idx - 1]);
      const isLocked = !isDone && !prevDone;
      const isAvailable = !isDone && !isLocked;
      const isSuggested = modId === suggested && !isDone;
      const isNewUnlock = modId === _f28LastUnlock;

      let nodeClass = 'f28-node';
      if (isDone) nodeClass += ' f28-done';
      else if (isLocked) nodeClass += ' f28-locked';
      else nodeClass += ' f28-available';
      if (isSuggested) nodeClass += ' f28-suggested';
      if (isNewUnlock) nodeClass += ' f28-unlock-anim';

      const shortTitle = mod.title.length > 14 ? mod.title.substring(0, 13) + '…' : mod.title;
      const clickHandler = (isDone || isAvailable) ? `onclick="startModule(${modId})"` : '';
      const connector = idx < branch.mods.length - 1
        ? `<div class="f28-connector${isDone ? ' f28-conn-done' : ''}" style="background:${isDone ? branch.color : 'rgba(255,255,255,0.12)'}"></div>`
        : '';

      html += `
        <div class="f28-node-wrap">
          <div class="${nodeClass}" ${clickHandler}
               style="--branch-color:${branch.color}"
               title="${mod.title}">
            <div class="f28-node-icon">${isDone ? '✓' : isLocked ? '🔒' : mod.icon}</div>
            ${isSuggested ? '<div class="f28-suggested-ring"></div>' : ''}
          </div>
          <div class="f28-node-label">${shortTitle}</div>
        </div>
        ${connector}`;
    });

    html += `</div></div>`;
  });

  container.innerHTML = `
    <div class="f28-tree-inner">
      ${html}
    </div>
    <div class="f28-expand-wrap">
      <button class="btn btn-ghost btn-sm f28-expand-btn" onclick="F28_toggle()">
        ${_f28Expanded
          ? 'Mostrar menos ▴'
          : `Ver mapa completo (${F28_BRANCHES.reduce((a,b)=>a+b.mods.length,0)} módulos) ▾`}
      </button>
    </div>`;
}

function F28_toggle() {
  _f28Expanded = !_f28Expanded;
  F28_render();
  if (!_f28Expanded) {
    document.getElementById('f28-skill-tree')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * F28_onModuleComplete — llama tras completar un módulo para animar el unlock.
 * Pasar el modId recién completado. Encuentra el siguiente en la rama y anima.
 */
function F28_onModuleComplete(doneModId) {
  _f28LastUnlock = null;
  // Find which branch and next module
  for (const branch of F28_BRANCHES) {
    const idx = branch.mods.indexOf(doneModId);
    if (idx !== -1 && idx + 1 < branch.mods.length) {
      _f28LastUnlock = branch.mods[idx + 1];
      break;
    }
  }
  F28_render();
  // Clear animation flag after animation completes
  setTimeout(() => {
    _f28LastUnlock = null;
    const unlockEl = document.querySelector('.f28-unlock-anim');
    if (unlockEl) unlockEl.classList.remove('f28-unlock-anim');
  }, 1200);
}

window.F28_render  = F28_render;
window.F28_toggle  = F28_toggle;
window.F28_onModuleComplete = F28_onModuleComplete;

/* ══════════════════════════════════════════════════════════════════
   F29 — CAJA SORPRESA DIARIA
   Variable reward diario. Recompensas ponderadas aleatorias.
   Persiste en S.lastSurpriseBoxDate.
══════════════════════════════════════════════════════════════════ */

const F29_REWARDS = [
  // weight, type, generator
  { w:40, type:'xp',         gen: () => { const v = [50,75,100,150,200][Math.floor(Math.random()*5)]; return { icon:'⚡', title:`+${v} XP`, desc:'¡Bonus de experiencia!', value: v }; }},
  { w:25, type:'fact',       gen: () => {
      const facts = [
        { icon:'💡', title:'Dato Exclusivo', desc:'El 90% de los fondos de gestión activa no baten al mercado a 15 años. Los indexados, sí.' },
        { icon:'📊', title:'Estadística Real', desc:'Invertir 200€/mes durante 30 años al 7% genera más de 220.000€. Sin tocarlos.' },
        { icon:'🧠', title:'Psicología', desc:'El efecto del anclaje hace que el primer precio que ves determina si algo te parece caro o barato.' },
        { icon:'🏦', title:'Dato Bancario', desc:'Los bancos españoles cobran de media 1,8% en comisiones de gestión. En un ETF: 0,07%.' },
        { icon:'📈', title:'Historia del Mercado', desc:'El S&P 500 ha tenido retorno positivo en el 73% de los años desde 1928, incluyendo crisis.' },
        { icon:'💰', title:'El Coste del Miedo', desc:'Quedarte fuera del mercado solo los 10 mejores días de la última década te cuesta un 54% de rentabilidad.' },
      ];
      return facts[Math.floor(Math.random() * facts.length)];
  }},
  { w:15, type:'multiplier', gen: () => ({ icon:'🚀', title:'Multiplicador x2', desc:'Tu próximo módulo da el doble de XP durante 1 hora.', value: Date.now() + 3600000 }) },
  { w:10, type:'streak',     gen: () => ({ icon:'🛡️', title:'Escudo de Racha', desc:'Tu racha está protegida hoy. Puedes faltar sin perderla.', value: true }) },
  { w:10, type:'badge',      gen: () => {
      const badges = ['🌟 Explorador Curioso','🎯 Enfocado','💎 Constante','🔥 Imparable','⚡ Veloz'];
      const b = badges[Math.floor(Math.random() * badges.length)];
      return { icon:'🏅', title:'Badge Sorpresa', desc:`Has ganado el badge ${b}` };
  }},
];

function F29_getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function F29_hasOpened() {
  return S.lastSurpriseBoxDate === F29_getTodayKey();
}

function F29_pickReward() {
  const total = F29_REWARDS.reduce((a, r) => a + r.w, 0);
  let rand = Math.random() * total;
  for (const r of F29_REWARDS) {
    rand -= r.w;
    if (rand <= 0) return { type: r.type, ...r.gen() };
  }
  return { type: 'xp', ...F29_REWARDS[0].gen() };
}

function F29_applyReward(reward) {
  if (reward.type === 'xp') {
    S.xp = (S.xp || 0) + reward.value;
    S.totalXPtoday = (S.totalXPtoday || 0) + reward.value;
    saveState();
    if (typeof spawnXP === 'function') spawnXP('+' + reward.value + ' XP');
  } else if (reward.type === 'multiplier') {
    S.xpMultiplierExpiry = reward.value; // timestamp hasta el que aplica x2
    saveState();
  } else if (reward.type === 'streak') {
    S.streakShields = Math.min(3, (S.streakShields || 0) + 1); // cap 3
    saveState();
  } else if (reward.type === 'badge') {
    if (!Array.isArray(S.surpriseBadges)) S.surpriseBadges = [];
    S.surpriseBadges.push(reward.title);
    if (S.surpriseBadges.length > 200) S.surpriseBadges = S.surpriseBadges.slice(-200);
    saveState();
  }
}

function F29_render() {
  const el = document.getElementById('f29-surprise-box');
  if (!el) return;

  const opened = F29_hasOpened();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  const missedYesterday = S.lastSurpriseBoxDate && S.lastSurpriseBoxDate !== F29_getTodayKey() && S.lastSurpriseBoxDate === yesterdayKey;

  if (opened && S._f29LastReward) {
    // Already opened: show reward
    const r = S._f29LastReward;
    el.innerHTML = `
      <div class="f29-opened">
        <div class="f29-reward-icon">${r.icon}</div>
        <div class="f29-reward-title">${r.title}</div>
        <div class="f29-reward-desc">${r.desc}</div>
        <div class="f29-next-label">Vuelve mañana para otra caja 🎁</div>
      </div>`;
    return;
  }

  el.innerHTML = `
    <div class="f29-box-wrap" onclick="F29_open()">
      ${missedYesterday ? '<div class="f29-notif-badge">!</div>' : ''}
      <div class="f29-box-icon">🎁</div>
      <div class="f29-box-text">
        <div class="f29-box-title">${missedYesterday ? '¡Tienes una caja sin abrir!' : 'Tu caja sorpresa de hoy'}</div>
        <div class="f29-box-sub">Toca para revelar tu recompensa</div>
      </div>
      <div class="f29-box-arrow">→</div>
    </div>`;
}

function F29_open() {
  if (F29_hasOpened()) return;

  const el = document.getElementById('f29-surprise-box');
  if (!el) return;

  const reward = F29_pickReward();

  // Save state
  S.lastSurpriseBoxDate = F29_getTodayKey();
  S._f29LastReward = reward;
  saveState();

  // Apply reward effect
  F29_applyReward(reward);

  // Animate open
  el.innerHTML = `<div class="f29-opening"><div class="f29-box-explode">🎁</div></div>`;

  setTimeout(() => {
    el.innerHTML = `
      <div class="f29-opened f29-reveal-anim">
        <div class="f29-reward-icon">${reward.icon}</div>
        <div class="f29-reward-title">${reward.title}</div>
        <div class="f29-reward-desc">${reward.desc}</div>
        <div class="f29-particles">✨🌟⚡✨🌟⚡</div>
      </div>`;

    // Show toast
    if (typeof toast === 'function') {
      toast(reward.icon + ' ' + reward.title, reward.desc, 't-success');
    }
  }, 600);
}

window.F29_render = F29_render;
window.F29_open   = F29_open;

/* ══════════════════════════════════════════════════════════════════
   F26 — TARJETAS DE COMPARTIR
   Canvas 1080×1080px generado al completar módulo o alcanzar hito.
   Diseño oscuro con gradiente. Botón navigator.share() con fallback.
══════════════════════════════════════════════════════════════════ */

function F26_generateCard(opts) {
  // opts: { type:'module'|'milestone', title, subtitle, stat, emoji, color }
  const canvas = document.createElement('canvas');
  canvas.width  = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  const color = opts.color || '#00e5a0';

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, 1080, 1080);
  bg.addColorStop(0, '#060810');
  bg.addColorStop(0.5, '#0d1220');
  bg.addColorStop(1, '#060810');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1080);

  // Glow circle
  const glow = ctx.createRadialGradient(540, 480, 0, 540, 480, 380);
  glow.addColorStop(0, color + '22');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1080, 1080);

  // Border
  ctx.strokeStyle = color + '44';
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, 1000, 1000);

  // Corner accents
  const accentLen = 60;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  [[40,40],[1040,40],[40,1040],[1040,1040]].forEach(([x,y]) => {
    const dx = x === 40 ? accentLen : -accentLen;
    const dy = y === 40 ? accentLen : -accentLen;
    ctx.beginPath(); ctx.moveTo(x, y + dy); ctx.lineTo(x, y); ctx.lineTo(x + dx, y); ctx.stroke();
  });

  // Big emoji
  ctx.font = '160px serif';
  ctx.textAlign = 'center';
  ctx.fillText(opts.emoji || '🏆', 540, 380);

  // Achievement label
  ctx.font = 'bold 52px system-ui, sans-serif';
  ctx.fillStyle = color;
  ctx.fillText(opts.type === 'module' ? '✓ MÓDULO COMPLETADO' : '🏆 HITO ALCANZADO', 540, 500);

  // Main title
  ctx.font = 'bold 68px system-ui, sans-serif';
  ctx.fillStyle = '#ffffff';
  const titleLines = _F26_wrapText(ctx, opts.title || '', 900);
  titleLines.forEach((line, i) => ctx.fillText(line, 540, 590 + i * 78));

  // Stat
  if (opts.stat) {
    ctx.font = '38px system-ui, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText(opts.stat, 540, 590 + titleLines.length * 78 + 50);
  }

  // Divider
  const divY = 820;
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(100, divY); ctx.lineTo(980, divY); ctx.stroke();

  // Footer: FinLearn branding
  ctx.font = 'bold 36px system-ui, sans-serif';
  ctx.fillStyle = color;
  ctx.fillText('FinLearn', 540, 880);
  ctx.font = '28px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.fillText('Aprende finanzas personales en 1 minuto al día', 540, 928);

  return canvas;
}

function _F26_wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  words.forEach(w => {
    const test = current ? current + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = w;
    } else {
      current = test;
    }
  });
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

async function F26_share(opts) {
  const canvas = F26_generateCard(opts);

  canvas.toBlob(async (blob) => {
    const file = new File([blob], 'finlearn-logro.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'FinLearn — ' + (opts.title || 'Logro'),
          text: '¡Acabo de completar un módulo en FinLearn! 📈 Aprende finanzas personales en 1 minuto al día.',
          files: [file]
        });
        return;
      } catch(e) { /* fallthrough to download */ }
    }

    // Fallback: download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finlearn-logro.png';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
    if (typeof toast === 'function') {
      toast('📥 Imagen descargada', 'Compártela en tus redes sociales.', 't-success');
    }
  }, 'image/png');
}

/**
 * F26_showModuleShare — muestra modal de compartir tras completar un módulo.
 * Llama desde el modal de celebración existente.
 */
function F26_showModuleShare(modTitle, modIcon, xpGained) {
  const modal = document.getElementById('f26-share-modal');
  if (!modal) return;

  const opts = {
    type: 'module',
    title: modTitle,
    subtitle: 'Módulo completado',
    emoji: modIcon || '📈',
    stat: `+${xpGained || 0} XP · ${(S.completedMods || []).length} módulos completados`,
    color: '#00e5a0'
  };

  // Preview canvas
  const canvas = F26_generateCard(opts);
  const preview = document.getElementById('f26-canvas-preview');
  if (preview) {
    preview.innerHTML = '';
    canvas.style.width  = '100%';
    canvas.style.height = 'auto';
    canvas.style.borderRadius = '12px';
    preview.appendChild(canvas);
  }

  document.getElementById('f26-share-btn').onclick = () => F26_share(opts);
  modal.style.display = 'flex';
}

function F26_closeModal() {
  const modal = document.getElementById('f26-share-modal');
  if (modal) modal.style.display = 'none';
}

window.F26_share           = F26_share;
window.F26_showModuleShare = F26_showModuleShare;
window.F26_closeModal      = F26_closeModal;
window.F26_generateCard    = F26_generateCard;

/* ══════════════════════════════════════════════════════════════════
   F30 — MISIONES GRUPALES
   Grupo de 5 simulados + usuario. Misión semanal compartida.
   Progreso social visible. Presión positiva.
══════════════════════════════════════════════════════════════════ */

const F30_MEMBERS = [
  { name:'Ana García',    avatar:'👩' },
  { name:'Carlos López',  avatar:'👨' },
  { name:'María Ruiz',    avatar:'👩‍💼' },
  { name:'David Martín',  avatar:'🧑' },
  { name:'Sofía Torres',  avatar:'👩‍🎓' },
];

const F30_MISSIONS = [
  { id:'m1', title:'Completad 3 módulos entre todos', target:3, type:'mods' },
  { id:'m2', title:'Ganad 500 XP en grupo esta semana', target:500, type:'xp' },
  { id:'m3', title:'Completad 5 módulos en 7 días', target:5, type:'mods' },
  { id:'m4', title:'Mantened 3 días de racha en el grupo', target:3, type:'streak' },
];

function F30_getWeekKey() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

function F30_init() {
  const wk = F30_getWeekKey();
  if (!S.groupMission || S.groupMission.weekKey !== wk) {
    // New week: new mission
    const mission = F30_MISSIONS[Math.floor(Math.random() * F30_MISSIONS.length)];
    S.groupMission = {
      weekKey: wk,
      missionId: mission.id,
      userProgress: 0,
      memberProgress: F30_MEMBERS.map(m => ({
        name: m.name,
        avatar: m.avatar,
        progress: Math.floor(Math.random() * Math.ceil(mission.target * 0.6))
      })),
      userLastActiveKey: null,
    };
    saveState();
  }
}

function F30_getMission() {
  return F30_MISSIONS.find(m => m.id === (S.groupMission?.missionId || 'm1')) || F30_MISSIONS[0];
}

function F30_getTotalProgress() {
  if (!S.groupMission) return 0;
  const memberTotal = (S.groupMission.memberProgress || []).reduce((a, m) => a + m.progress, 0);
  return memberTotal + (S.groupMission.userProgress || 0);
}

function F30_render() {
  const el = document.getElementById('f30-group-mission');
  if (!el) return;
  el.innerHTML = ''; el.style.display = 'none'; return;

  F30_init();
  const gm = S.groupMission;
  const mission = F30_getMission();
  const total = F30_getTotalProgress();
  const pct = Math.min(100, Math.round((total / mission.target) * 100));
  const done = total >= mission.target;

  const todayKey = new Date().toISOString().slice(0, 10);
  const userInactive = gm.userLastActiveKey && gm.userLastActiveKey !== todayKey;
  const daysSinceActive = userInactive ? Math.floor((Date.now() - new Date(gm.userLastActiveKey)) / 86400000) : 0;

  el.innerHTML = `
    <div class="f30-card${done ? ' f30-done' : ''}">
      <div class="f30-header">
        <span class="f30-icon">👥</span>
        <span class="f30-title">Misión Grupal</span>
        <span class="f30-week-badge">Esta semana</span>
      </div>
      <div class="f30-mission-text">"${mission.title}"</div>
      ${userInactive && daysSinceActive >= 2 ? `<div class="f30-nudge">⚠️ Llevas ${daysSinceActive} días sin contribuir al grupo. ¡Tus compañeros te necesitan!</div>` : ''}
      <div class="f30-progress-bar">
        <div class="f30-progress-fill ${done ? 'f30-fill-done' : ''}" style="width:${pct}%"></div>
      </div>
      <div class="f30-progress-label">${total}/${mission.target} ${done ? '✓ ¡Completada!' : ''}</div>
      <div class="f30-members">
        ${F30_MEMBERS.map((m, i) => {
          const mp = (gm.memberProgress || [])[i];
          const prog = mp ? mp.progress : 0;
          const contrib = prog > 0;
          return `<div class="f30-member ${contrib ? 'f30-member-active' : ''}">
            <div class="f30-member-av">${m.avatar}</div>
            <div class="f30-member-name">${m.name.split(' ')[0]}</div>
            <div class="f30-member-prog">${prog}</div>
          </div>`;
        }).join('')}
        <div class="f30-member f30-member-you ${(gm.userProgress||0) > 0 ? 'f30-member-active' : ''}">
          <div class="f30-member-av">🙋</div>
          <div class="f30-member-name">Tú</div>
          <div class="f30-member-prog">${gm.userProgress || 0}</div>
        </div>
      </div>
    </div>`;
}

function F30_recordModuleComplete() {
  if (!S.groupMission) F30_init();
  const todayKey = new Date().toISOString().slice(0, 10);
  S.groupMission.userProgress = (S.groupMission.userProgress || 0) + 1;
  S.groupMission.userLastActiveKey = todayKey;

  // Simulate other members progressing
  S.groupMission.memberProgress = S.groupMission.memberProgress.map(m => {
    if (Math.random() < 0.35 && m.progress < F30_getMission().target) {
      return { ...m, progress: m.progress + 1 };
    }
    return m;
  });
  saveState();
  F30_render();
}

window.F30_render              = F30_render;
window.F30_recordModuleComplete = F30_recordModuleComplete;
window.F30_init                = F30_init;

/* ══════════════════════════════════════════════════════════════════
   F31 — BADGES DE IDENTIDAD EVOLUTIVOS
   Badges que evolucionan según decisiones y logros del usuario.
   Visibles bajo el avatar en el perfil y en el ranking.
══════════════════════════════════════════════════════════════════ */

function F31_getBadges() {
  const badges = [];
  const completed = new Set(S.completedMods || []);
  const streak = S.streak || 0;
  const xp = S.xp || 0;
  const hasRealPatrimony = S.realPatrimony > 0 || (S.realAssets && S.realAssets.length > 0);

  // Indexador: 3+ módulos de ETF/Inversión
  const etfMods = [1, 7, 16, 26, 30, 36, 66];
  const etfDone = etfMods.filter(id => completed.has(id)).length;
  if (etfDone >= 3) badges.push({ id:'indexador', icon:'📊', label:'Indexador', desc:`Has completado ${etfDone} módulos de inversión`, color:'#60a5fa' });

  // Racha 60 días: corona
  if (streak >= 60) badges.push({ id:'corona', icon:'👑', label:'Rey de la Racha', desc:`${streak} días consecutivos`, color:'#fbbf24' });
  else if (streak >= 30) badges.push({ id:'fuego', icon:'🔥', label:'En Llamas', desc:`${streak} días de racha`, color:'#fb923c' });
  else if (streak >= 7) badges.push({ id:'racha', icon:'⚡', label:'Con Racha', desc:`${streak} días seguidos`, color:'#a855f7' });

  // Inversor Real: patrimonio configurado
  if (hasRealPatrimony) badges.push({ id:'real', icon:'💼', label:'Inversor Real', desc:'Patrimonio real configurado', color:'#00e5a0' });

  // Maestro: 20+ módulos
  if (completed.size >= 20) badges.push({ id:'maestro', icon:'🎓', label:'Maestro', desc:`${completed.size} módulos completados`, color:'#c084fc' });
  else if (completed.size >= 10) badges.push({ id:'avanzado', icon:'📚', label:'Avanzado', desc:`${completed.size} módulos`, color:'#60a5fa' });
  else if (completed.size >= 5) badges.push({ id:'aprendiz', icon:'🌱', label:'Aprendiz', desc:`${completed.size} módulos`, color:'#00e5a0' });
  else if (completed.size >= 1) badges.push({ id:'inicio', icon:'🚀', label:'Comenzando', desc:'Primer módulo completado', color:'#fb923c' });

  // XP milestones
  if (xp >= 5000) badges.push({ id:'xp5k', icon:'💎', label:'Élite', desc:`${xp.toLocaleString()} XP totales`, color:'#fbbf24' });
  else if (xp >= 1000) badges.push({ id:'xp1k', icon:'⭐', label:'Estrella', desc:`${xp.toLocaleString()} XP`, color:'#fbbf24' });

  return badges;
}

function F31_renderBadges(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const badges = F31_getBadges();
  if (badges.length === 0) {
    el.innerHTML = '<div class="f31-no-badges">Completa módulos para ganar badges</div>';
    return;
  }
  el.innerHTML = badges.map(b => `
    <div class="f31-badge" title="${b.desc}" style="--badge-color:${b.color}">
      <div class="f31-badge-icon">${b.icon}</div>
      <div class="f31-badge-label">${b.label}</div>
    </div>`).join('');
}

window.F31_getBadges    = F31_getBadges;
window.F31_renderBadges = F31_renderBadges;

/* ══════════════════════════════════════════════════════════════════
   F32 — LIGAS SEMANALES
   Grupos de ~20 usuarios simulados por nivel. 4 ligas: Bronce → Plata → Oro → Diamante.
   Top 5 por XP semanal suben de liga, los 5 últimos bajan.
   Palanca psicológica: Loss aversion — el miedo a bajar retiene más que el deseo de subir.
   Persiste en S.league, S.leagueWeekXP, S.leagueWeekXPBase, S.leagueWeekKey, S.leagueSeed.
══════════════════════════════════════════════════════════════════ */

// ── Configuración de ligas ──────────────────────────────────────
const F32_LEAGUES = {
  bronze:  { id:'bronze',  label:'Bronce',   icon:'🥉', next:'silver',  prev:null,       color:'#cd7f32', pos:0 },
  silver:  { id:'silver',  label:'Plata',    icon:'🥈', next:'gold',    prev:'bronze',   color:'#c0c0c0', pos:1 },
  gold:    { id:'gold',    label:'Oro',      icon:'🥇', next:'diamond', prev:'silver',   color:'#ffd700', pos:2 },
  diamond: { id:'diamond', label:'Diamante', icon:'💎', next:null,      prev:'gold',     color:'#a5f3fc', pos:3 },
};

// Rivales con nombres españoles realistas, con avatares variados
const F32_RIVAL_POOL = [
  { name:'Alejandro M.', av:'👨' }, { name:'Sofía R.',      av:'👩' },
  { name:'Carlos P.',    av:'🧑' }, { name:'María G.',      av:'👩‍💼' },
  { name:'David L.',     av:'👨‍💻' }, { name:'Lucía T.',      av:'👩‍🎓' },
  { name:'Javier S.',    av:'👨‍🏫' }, { name:'Ana C.',        av:'🧕' },
  { name:'Pablo F.',     av:'🧔' }, { name:'Isabel V.',     av:'👩‍🔬' },
  { name:'Miguel A.',    av:'👴' }, { name:'Cristina B.',   av:'👩‍🏫' },
  { name:'Roberto N.',   av:'👨‍🏭' }, { name:'Laura E.',      av:'💁‍♀️' },
  { name:'Sergio O.',    av:'🙎‍♂️' }, { name:'Patricia K.',   av:'👩‍🎨' },
  { name:'Andrés H.',    av:'🧑‍🎤' }, { name:'Carmen D.',     av:'🧓' },
  { name:'Rubén I.',     av:'👦' }, { name:'Nuria W.',      av:'👧' },
  { name:'Álvaro J.',    av:'🧑‍💼' }, { name:'Beatriz Q.',    av:'🙆‍♀️' },
  { name:'Fernando U.',  av:'👨‍🎓' }, { name:'Raquel Y.',     av:'👱‍♀️' },
  { name:'Jorge Z.',     av:'🧑‍🏫' }, { name:'Marta X.',      av:'🧑‍🎓' },
];

// Rangos de XP semanal por liga (para simular rivales creíbles)
const F32_RIVAL_XP_RANGES = {
  bronze:  [20,  220],
  silver:  [80,  420],
  gold:    [150, 650],
  diamond: [300, 900],
};

// ── Helpers de semana ───────────────────────────────────────────

/** Devuelve la clave de la semana actual en formato 'YYYY-Www' (semana ISO) */
function F32_getWeekKey() {
  const d = new Date();
  const jan4 = new Date(d.getFullYear(), 0, 4); // el 4 de enero siempre está en la semana 1
  const weekNum = Math.ceil(((d - jan4) / 86400000 + jan4.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2,'0')}`;
}

/** Milisegundos hasta el próximo lunes 00:00 */
function F32_msUntilMonday() {
  const now = new Date();
  const ms  = now.getTime();
  const day = now.getDay(); // 0=dom … 6=sáb
  const daysUntilMonday = day === 0 ? 1 : (8 - day) % 7 || 7;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(0, 0, 0, 0);
  return nextMonday.getTime() - ms;
}

/** Formatea ms como "Xd Xh Xm" */
function F32_formatCountdown(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// ── Pseudo-RNG determinista ─────────────────────────────────────
/** LCG simple, seed determinista por semana+liga para que los rivales no cambien al refrescar */
function F32_rng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Inicialización y reset semanal ─────────────────────────────

/**
 * F32_init — Inicializa / actualiza el estado de la liga.
 * Debe llamarse en renderHomeScreen y cuando se inicie la app.
 * - Detecta cambio de semana → aplica ascenso/descenso y resetea XP base
 * - Primera vez → asigna seed y clave
 */
function F32_init() {
  const currentWeek = F32_getWeekKey();

  if (!S.leagueWeekKey) {
    // Primera vez: inicializar
    S.leagueWeekKey     = currentWeek;
    S.leagueWeekXPBase  = S.xp || 0;
    S.leagueWeekXP      = 0;
    S.leagueSeed        = Math.floor(Math.random() * 9999999);
    if (!S.league) S.league = 'bronze';
    saveState();
    return;
  }

  if (S.leagueWeekKey !== currentWeek) {
    // ¡Nueva semana! Calcular posición final de la semana anterior
    const weekXP    = Math.max(0, (S.xp || 0) - (S.leagueWeekXPBase || 0));
    const rivals    = F32_generateRivals(S.league, S.leagueSeed);
    const allUsers  = [...rivals, { isYou:true, xp: weekXP }];
    allUsers.sort((a,b) => b.xp - a.xp);
    const yourPos   = allUsers.findIndex(u => u.isYou) + 1; // 1-based
    const total     = allUsers.length;

    const leagueInfo = F32_LEAGUES[S.league] || F32_LEAGUES.bronze;
    const promoted   = yourPos <= 5 && leagueInfo.next !== null;
    const relegated  = yourPos > (total - 5) && leagueInfo.prev !== null;

    const oldLeague = S.league;
    if (promoted)  {
      S.league = leagueInfo.next;
      S.leaguePromotedFrom = oldLeague;
      toast(`🎉 ¡Subiste a liga ${F32_LEAGUES[S.league].label}!`,
        `Quedaste ${yourPos}º la semana pasada. ¡Sigue así!`, 't-success');
    } else if (relegated) {
      S.league = leagueInfo.prev;
      S.leaguePromotedFrom = null;
      toast(`⚠️ Bajaste a liga ${F32_LEAGUES[S.league].label}`,
        `Quedaste ${yourPos}º de ${total}. Esta semana lo recuperas.`, 't-warn');
    } else {
      S.leaguePromotedFrom = null;
    }

    // Resetear para nueva semana
    S.leagueWeekKey    = currentWeek;
    S.leagueWeekXPBase = S.xp || 0;
    S.leagueWeekXP     = 0;
    S.leagueSeed       = Math.floor(Math.random() * 9999999);
    saveState();
  } else {
    // Misma semana: actualizar el XP de esta semana
    S.leagueWeekXP = Math.max(0, (S.xp || 0) - (S.leagueWeekXPBase || 0));
  }
}

// ── Generar rivales ─────────────────────────────────────────────

/**
 * F32_generateRivals — Genera 19 rivales simulados con XP creíble para la liga.
 * Usa seed determinista para que sean estables durante la semana.
 */
function F32_generateRivals(leagueName, seed) {
  const rng   = F32_rng((seed || 1) + (leagueName.charCodeAt(0) || 66));
  const range = F32_RIVAL_XP_RANGES[leagueName] || F32_RIVAL_XP_RANGES.bronze;
  const pool  = [...F32_RIVAL_POOL];

  // Shuffle del pool con rng determinista
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Tomar 19 rivales y asignarles XP aleatorio dentro del rango de la liga
  return pool.slice(0, 19).map(p => ({
    name:  p.name,
    av:    p.av,
    xp:    Math.floor(rng() * (range[1] - range[0])) + range[0],
    isYou: false,
  }));
}

// ── Renderizado ─────────────────────────────────────────────────

let F32_countdownInterval = null;

function F32_render() {
  const el = document.getElementById('f32-league-widget') || document.getElementById('f32-profile-league');
  if (!el) return;

  F32_init();

  const league    = F32_LEAGUES[S.league] || F32_LEAGUES.bronze;
  const weekXP    = Math.max(0, (S.xp || 0) - (S.leagueWeekXPBase || 0));
  const rivals    = F32_generateRivals(S.league, S.leagueSeed);
  const you       = { name: S.userName || 'Tú', av: S.avatar || '🌱', xp: weekXP, isYou: true };

  // Construir ranking completo y ordenar
  const allUsers = [...rivals, you];
  allUsers.sort((a, b) => b.xp - a.xp);
  const yourPos  = allUsers.findIndex(u => u.isYou) + 1; // 1-based
  const total    = allUsers.length;

  // Zona de ascenso: posiciones 1-5 / descenso: posiciones 16-20
  const PROMO_ZONE    = 5;
  const RELEGATE_ZONE = total - 5;
  const inDanger      = yourPos > RELEGATE_ZONE && (F32_LEAGUES[S.league] || {}).prev;

  // Determinar qué filas mostrar: 5 por encima y 5 por debajo + tú
  const youIdx    = yourPos - 1; // 0-based
  const showStart = Math.max(0, Math.min(youIdx - 5, total - 11));
  const showEnd   = Math.min(total - 1, showStart + 10);
  const visible   = allUsers.slice(showStart, showEnd + 1);

  // Comprobar aviso de domingo (zona peligro)
  const isSunday = new Date().getDay() === 0;
  if (isSunday && inDanger) {
    const xpToSafe = allUsers[RELEGATE_ZONE - 1].xp - weekXP + 1;
    if (xpToSafe > 0) {
      // Solo avisar una vez por sesión usando un flag de sesión
      if (!window._f32WarnedThisSession) {
        window._f32WarnedThisSession = true;
        setTimeout(() => {
          toast(`⚠️ Liga en peligro — posición ${yourPos}`,
            `Estás a ${xpToSafe} XP de zona segura. ¡Tienes hasta mañana!`, 't-warn');
        }, 3000);
      }
    }
  }

  // Construir HTML
  const badgeClass  = `f32-league-badge f32-badge-${league.id}${S.leaguePromotedFrom ? ' f32-badge-promoted' : ''}`;

  let rowsHTML = '';
  let lastWasYou = false;

  visible.forEach((user, localIdx) => {
    const globalPos = showStart + localIdx + 1; // 1-based global position
    const isPromo   = globalPos <= PROMO_ZONE;
    const isRelegate = globalPos > RELEGATE_ZONE;
    const rowClass  = user.isYou
      ? 'f32-row f32-row-you'
      : isPromo    ? 'f32-row f32-row-promo'
      : isRelegate ? 'f32-row f32-row-relegate'
      : 'f32-row';

    const posClass  = globalPos <= 3 ? 'f32-pos f32-pos-top' : 'f32-pos';
    const posIcon   = globalPos === 1 ? '🥇' : globalPos === 2 ? '🥈' : globalPos === 3 ? '🥉' : globalPos;

    let zoneLabel = '';
    if (isPromo)    zoneLabel = `<span class="f32-zone-label f32-zone-up">▲ SUBE</span>`;
    if (isRelegate) zoneLabel = `<span class="f32-zone-label f32-zone-down">▼ BAJA</span>`;

    const nameClass = user.isYou ? 'f32-name f32-name-you' : 'f32-name';
    const xpClass   = user.isYou ? 'f32-xp-val f32-xp-you' : 'f32-xp-val';

    // Añadir divisor si hay salto en posiciones (solo cuando showStart > 0 y es la primera fila)
    if (localIdx === 0 && showStart > 0) {
      rowsHTML += `<div class="f32-divider">· · ·</div>`;
    }

    rowsHTML += `
      <div class="${rowClass}">
        <div class="${posClass}">${posIcon}</div>
        <div class="f32-av">${user.av}</div>
        <div class="${nameClass}">${user.name}</div>
        ${zoneLabel}
        <div class="${xpClass}">${user.xp.toLocaleString('es-ES')} XP</div>
      </div>`;

    lastWasYou = user.isYou;
  });

  if (showEnd < total - 1) {
    rowsHTML += `<div class="f32-divider">· · ·</div>`;
  }

  const dangerBanner = inDanger
    ? `<div class="f32-warning">⚡ Estás en posición ${yourPos} — zona de descenso. Gana más XP esta semana para mantenerte.</div>`
    : '';

  const msLeft = F32_msUntilMonday();

  el.innerHTML = `
    <div class="f32-wrap">
      <div class="f32-header">
        <div class="${badgeClass}">${league.icon} ${league.label}</div>
        <div class="f32-header-info">
          <div class="f32-header-title">Posición ${yourPos} de ${total}</div>
          <div class="f32-header-sub">Liga semanal · Top 5 ascienden</div>
        </div>
        <div class="f32-week-xp">
          <div class="f32-week-xp-val">${weekXP.toLocaleString('es-ES')}</div>
          <div class="f32-week-xp-lab">XP esta semana</div>
        </div>
      </div>
      <div class="f32-rank-list">${rowsHTML}</div>
      ${dangerBanner}
      <div class="f32-footer">
        <div class="f32-footer-info">🏅 ${PROMO_ZONE} ascienden · ${total - RELEGATE_ZONE} descienden</div>
        <div class="f32-reset-label" id="f32-countdown">Reinicia en ${F32_formatCountdown(msLeft)}</div>
      </div>
      <div class="f32-challenge-row">
        <button class="f32-challenge-btn" onclick="F32_challengeFriend()">🏆 Reta a un amigo</button>
      </div>
    </div>`;

  // Actualizar contador en tiempo real
  if (F32_countdownInterval) clearInterval(F32_countdownInterval);
  F32_countdownInterval = setInterval(() => {
    const cdEl = document.getElementById('f32-countdown');
    if (cdEl) cdEl.textContent = `Reinicia en ${F32_formatCountdown(F32_msUntilMonday())}`;
    else clearInterval(F32_countdownInterval);
  }, 30000);

  // Limpiar flag de promoción después de mostrar la animación
  if (S.leaguePromotedFrom) {
    setTimeout(() => { S.leaguePromotedFrom = null; saveState(); }, 1200);
  }
}

window.F32_render = F32_render;
window.F32_init   = F32_init;

function F32_challengeFriend() {
  var league  = F32_LEAGUES[S.league] || F32_LEAGUES.bronze;
  var weekXP  = Math.max(0, (S.xp || 0) - (S.leagueWeekXPBase || 0));
  var yourPos = 0;
  try {
    var rivals = F32_generateRivals(S.league, S.leagueSeed);
    var you    = { xp: weekXP, isYou: true };
    var all    = rivals.concat([you]);
    all.sort(function(a,b) { return b.xp - a.xp; });
    yourPos = all.findIndex(function(u) { return u.isYou; }) + 1;
  } catch(e) {}
  var text = '🏆 Estoy en posici\xF3n ' + (yourPos || '?') + ' en la liga ' + league.label + ' de FinLearn con ' + weekXP.toLocaleString('es') + ' XP esta semana. \xBFPuedes superarme? → ' + window.location.origin;
  if (navigator.share) {
    navigator.share({ title: 'Te reto en FinLearn', text: text }).catch(function() {});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      if (typeof toast === 'function') toast('📋 Reto copiado', 'P\xE9galo en WhatsApp o Instagram.', 't-success');
    });
  }
}
window.F32_challengeFriend = F32_challengeFriend;

/* ══════════════════════════════════════════════════════════════════
   F33 — STREAK IDENTITY UPGRADE
   El streak como identidad visual progresiva de 5 tiers.
   Sistema Earn Back: 24h para recuperar la racha completando 2 módulos.
   Persiste en S.streakBrokeAt, S.streakEarnBackMods.
══════════════════════════════════════════════════════════════════ */

// ── Configuración de tiers ──────────────────────────────────────
const F33_TIERS = [
  { min:   0, max:   6, tier: 0, label: 'Racha inicial',   navClass: '',       icon: '🔥' },
  { min:   7, max:  29, tier: 1, label: 'En racha',        navClass: 'f33-t1', icon: '🔥' },
  { min:  30, max:  59, tier: 2, label: 'Imparable',       navClass: 'f33-t2', icon: '👑🔥' },
  { min:  60, max:  99, tier: 3, label: 'Aura de élite',   navClass: 'f33-t3', icon: '🔥' },
  { min: 100, max: Infinity, tier: 4, label: 'Leyenda',    navClass: 'f33-t4', icon: '🌟🔥' },
];

/** Devuelve el tier object para un valor de streak dado */
function F33_getTier(streak) {
  return F33_TIERS.find(t => streak >= t.min && streak <= t.max) || F33_TIERS[0];
}

// ── Nav pill: actualización visual ─────────────────────────────

/**
 * F33_updateNavStreak — Actualiza el nav-pill de streak con el tier visual correcto.
 * Sustituye al setEl simple para los 3 puntos donde se llama en updateUIFromState.
 */
function F33_updateNavStreak() {
  const streak = S.streak || 0;
  const tierObj = F33_getTier(streak);

  // Actualizar número
  const numEl = document.getElementById('nav-streak');
  if (numEl) numEl.textContent = streak;

  // Actualizar clase tier en el pill
  const pill = numEl ? numEl.closest('.nav-pill.streak') : null;
  if (!pill) return;

  // Limpiar clases anteriores de F33
  pill.classList.remove('f33-t1', 'f33-t2', 'f33-t3', 'f33-t4');

  if (tierObj.tier > 0) {
    pill.classList.add(tierObj.navClass);
  }

  // Emoji del tier delante del número
  const textBefore = pill.childNodes[0]; // textNode "🔥 "
  if (textBefore && textBefore.nodeType === Node.TEXT_NODE) {
    textBefore.textContent = tierObj.icon + ' ';
  }

  // Tier 4: partícula flotante
  let particle = pill.querySelector('.f33-particle');
  if (tierObj.tier === 4) {
    if (!particle) {
      particle = document.createElement('span');
      particle.className = 'f33-particle';
      particle.textContent = '✨';
      pill.appendChild(particle);
    }
  } else if (particle) {
    particle.remove();
  }
}

// ── Earn Back system ────────────────────────────────────────────

/**
 * F33_checkEarnBack — Llamada cada vez que el usuario completa un módulo.
 * Si está en ventana de Earn Back (24h tras romper racha):
 *   - Incrementa contador de módulos
 *   - Si llega a 2: restaura racha a 1 con animación especial
 */
function F33_checkEarnBack() {
  if (!S.streakBrokeAt) return;

  const now        = Date.now();
  const msElapsed  = now - S.streakBrokeAt;
  const WINDOW_24H = 24 * 60 * 60 * 1000;

  if (msElapsed > WINDOW_24H) {
    // Expiró la ventana de Earn Back — limpiar
    S.streakBrokeAt      = null;
    S.streakEarnBackMods = 0;
    saveState();
    return;
  }

  // Dentro de la ventana: contar módulo
  S.streakEarnBackMods = (S.streakEarnBackMods || 0) + 1;

  if (S.streakEarnBackMods >= 2) {
    // ¡Racha recuperada!
    S.streak             = 1;
    S.streakBrokeAt      = null;
    S.streakEarnBackMods = 0;
    saveState();

    // Animación y mensaje de recuperación
    setTimeout(() => {
      toast('⚡ ¡Racha recuperada!',
        '2 módulos seguidos. Tu constancia te define. Sigue así.', 't-success');
      if (typeof spawnXP === 'function') spawnXP('+¡RACHA!');
    }, 800);

    // Actualizar banner y nav
    if (typeof F33_renderBanner     === 'function') F33_renderBanner();
    if (typeof F33_updateNavStreak  === 'function') F33_updateNavStreak();
  } else {
    // Primer módulo completado — actualizar banner para mostrar progreso
    saveState();
    if (typeof F33_renderBanner === 'function') F33_renderBanner();
    toast('⚡ ¡Módulo 1/2!',
      'Un módulo más y recuperas tu racha. ¡No pares ahora!', 't-warn');
  }
}

// ── Banner Earn Back en el home ─────────────────────────────────

let _f33BannerInterval = null;

/**
 * F33_renderBanner — Renderiza (o esconde) el banner de "Racha en peligro"
 * en el div #f33-earn-back-banner del home.
 */
function F33_renderBanner() {
  const el = document.getElementById('f33-earn-back-banner');
  if (!el) return;

  // Limpiar timer anterior
  if (_f33BannerInterval) { clearInterval(_f33BannerInterval); _f33BannerInterval = null; }

  // Sin streakBrokeAt → ocultar
  if (!S.streakBrokeAt) { el.style.display = 'none'; return; }

  const now        = Date.now();
  const WINDOW_24H = 24 * 60 * 60 * 1000;
  const msLeft     = (S.streakBrokeAt + WINDOW_24H) - now;

  if (msLeft <= 0) {
    // Ventana expirada — limpiar estado y ocultar
    S.streakBrokeAt      = null;
    S.streakEarnBackMods = 0;
    saveState();
    el.style.display = 'none';
    return;
  }

  el.style.display = 'block';

  const modsLeft = Math.max(0, 2 - (S.streakEarnBackMods || 0));
  const done0    = (S.streakEarnBackMods || 0) >= 1;
  const done1    = (S.streakEarnBackMods || 0) >= 2;

  function _formatTime(ms) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  el.innerHTML = `
    <div class="f33-earn-back">
      <div class="f33-earn-back-icon">⚡</div>
      <div class="f33-earn-back-body">
        <div class="f33-earn-back-title">Racha en peligro — completa ${modsLeft} módulo${modsLeft !== 1 ? 's' : ''} más</div>
        <div class="f33-earn-back-sub">Tienes ${_formatTime(msLeft)} para recuperar tu racha completando 2 módulos seguidos. No te regala nada — la conquistas.</div>
        <div class="f33-earn-back-dots">
          <div class="f33-dot${done0 ? ' done' : ''}"></div>
          <div class="f33-dot${done1 ? ' done' : ''}"></div>
        </div>
      </div>
      <div class="f33-earn-back-timer" id="f33-banner-timer">${_formatTime(msLeft)}</div>
    </div>`;

  // Actualizar countdown cada minuto
  _f33BannerInterval = setInterval(() => {
    if (!S.streakBrokeAt) { clearInterval(_f33BannerInterval); F33_renderBanner(); return; }
    const msl = (S.streakBrokeAt + WINDOW_24H) - Date.now();
    const timerEl = document.getElementById('f33-banner-timer');
    if (timerEl) timerEl.textContent = _formatTime(Math.max(0, msl));
    if (msl <= 0) {
      if (_f33BannerInterval) clearInterval(_f33BannerInterval);
      F33_renderBanner(); // re-render para ocultar
    }
  }, 60000);
}

window.F33_updateNavStreak = F33_updateNavStreak;
window.F33_getTier         = F33_getTier;
window.F33_checkEarnBack   = F33_checkEarnBack;
window.F33_renderBanner    = F33_renderBanner;

/* ══════════════════════════════════════════════════════════════════
   F34 — RETO DIARIO CON CUENTA ATRÁS
   Un reto nuevo cada día generado a las 00:00.
   Tipos: module (rama), xp, quiz, streak.
   Premio: XP extra + badge temporal único (no recuperable).
   FOMO temporal: desaparece a medianoche con animación de expirado.
   Persiste: S.dailyChallengeKey, S.dailyChallengeCompleted,
             S.dailyChallengeClaimed, S.dailyChallengeProgress,
             S.dailyChallengeType, S.dailyChallengeTag,
             S.dailyChallengeTarget, S.dailyChallengeXPReward.
══════════════════════════════════════════════════════════════════ */

// ── Configuración de tipos de reto ─────────────────────────────
const F34_CHALLENGE_TYPES = [
  {
    type: 'module',
    icon: '📚',
    label: 'Reto de Módulo',
    generate(seed) {
      // Elegir una rama aleatoria con módulos no completados
      const tags = ['FUNDAMENTAL','INVERSIÓN','MENTALIDAD','PSICOLOGÍA',
                    'FISCALIDAD','VIVIENDA','PRESUPUESTO','DEUDA','FIRE',
                    'DIVIDENDOS','MERCADOS','JUBILACIÓN','CRYPTO','AHORRO'];
      const rng = F34_rng(seed + 1);
      const tag = tags[Math.floor(rng() * tags.length)];
      const pendingMods = (typeof MODULES !== 'undefined' && Array.isArray(S.completedMods))
        ? MODULES.filter(m => m && typeof m.id === 'number' && !S.completedMods.includes(m.id) && m.tag && m.tag.toUpperCase().includes(tag))
        : [];
      const rng2 = F34_rng(seed + 7);
      const picked = pendingMods.length > 0 ? pendingMods[Math.floor(rng2() * pendingMods.length)] : null;
      return {
        tag,
        target: 1,
        xpReward: 100 + Math.floor(rng() * 5) * 25,  // 100, 125, 150, 175, 200
        desc: `Completa 1 módulo de la rama <strong>${tag}</strong> antes de medianoche.`,
        moduleId: picked ? picked.id : null,
      };
    },
  },
  {
    type: 'xp',
    icon: '⚡',
    label: 'Reto de XP',
    generate(seed) {
      const rng = F34_rng(seed + 2);
      const targets = [50, 75, 100, 150, 200];
      const target = targets[Math.floor(rng() * targets.length)];
      return {
        tag: '',
        target,
        xpReward: Math.round(target * 0.5),
        desc: `Gana <strong>${target} XP</strong> hoy completando módulos o quizzes.`,
      };
    },
  },
  {
    type: 'quiz',
    icon: '🎯',
    label: 'Reto de Quizzes',
    generate(seed) {
      const rng = F34_rng(seed + 3);
      const targets = [3, 5, 7, 10];
      const target = targets[Math.floor(rng() * targets.length)];
      return {
        tag: '',
        target,
        xpReward: target * 15,
        desc: `Responde correctamente <strong>${target} quiz${target > 1 ? 'zes' : ''}</strong> hoy.`,
      };
    },
  },
  {
    type: 'streak',
    icon: '🔥',
    label: 'Reto de Racha',
    generate(seed) {
      return {
        tag: '',
        target: 1,
        xpReward: 75,
        desc: 'Mantén tu <strong>racha activa</strong> completando al menos 1 módulo hoy.',
      };
    },
  },
];

// ── Pseudo-RNG determinista (mismo patrón que F32) ──────────────
function F34_rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ── Key de hoy ──────────────────────────────────────────────────
function F34_todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/** Milisegundos hasta medianoche */
function F34_msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime() - now.getTime();
}

function F34_formatCountdown(ms) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0)  return `${h}h ${String(m).padStart(2,'0')}m`;
  if (m >= 1) return `${m}m ${String(s).padStart(2,'0')}s`;
  return `${s}s`;
}

// ── Generación del reto del día ─────────────────────────────────

/**
 * F34_getOrGenerate — Devuelve el reto del día, generándolo si es nuevo.
 * Usa la fecha como seed para que el reto sea determinista (mismo para todos).
 */
function F34_getOrGenerate() {
  const today = F34_todayKey();

  // Si es un día nuevo o no hay reto, generar uno nuevo
  if (S.dailyChallengeKey !== today) {
    // Seed basado en fecha + id de usuario (stable pero único)
    const dateSeed = parseInt(today.replace(/-/g, ''), 10) % 9999999;
    const rng = F34_rng(dateSeed);

    // Elegir tipo de reto de forma rotativa pero con algo de azar
    const typeIdx = Math.floor(rng() * F34_CHALLENGE_TYPES.length);
    const typeDef = F34_CHALLENGE_TYPES[typeIdx];
    const generated = typeDef.generate(dateSeed);

    S.dailyChallengeKey       = today;
    S.dailyChallengeType      = typeDef.type;
    S.dailyChallengeTag       = generated.tag || '';
    S.dailyChallengeTarget    = generated.target;
    S.dailyChallengeXPReward  = generated.xpReward;
    S.dailyChallengeCompleted = false;
    S.dailyChallengeClaimed   = false;
    S.dailyChallengeProgress  = 0;
    saveState();
  }

  const typeDef = F34_CHALLENGE_TYPES.find(t => t.type === S.dailyChallengeType)
    || F34_CHALLENGE_TYPES[0];

  return {
    type:      S.dailyChallengeType,
    tag:       S.dailyChallengeTag,
    target:    S.dailyChallengeTarget,
    xpReward:  S.dailyChallengeXPReward,
    progress:  S.dailyChallengeProgress || 0,
    completed: S.dailyChallengeCompleted,
    claimed:   S.dailyChallengeClaimed,
    icon:      typeDef.icon,
    label:     typeDef.label,
    desc:      typeDef.generate(parseInt(today.replace(/-/g,''),10) % 9999999).desc,
  };
}

// ── Hooks de progreso ───────────────────────────────────────────

/** Llamado cuando se completa un módulo (hookea F34 tipo 'module' y 'streak') */
function F34_onModuleComplete(mod) {
  if (S.dailyChallengeKey !== F34_todayKey()) return;
  if (S.dailyChallengeCompleted) return;

  const type = S.dailyChallengeType;
  let advanced = false;

  if (type === 'streak') {
    S.dailyChallengeProgress = 1;
    advanced = true;
  } else if (type === 'module') {
    const modTag = (mod && mod.tag) ? mod.tag : '';
    if (modTag === S.dailyChallengeTag || S.dailyChallengeTag === '') {
      S.dailyChallengeProgress = (S.dailyChallengeProgress || 0) + 1;
      advanced = true;
    }
  }

  if (advanced) F34_checkComplete();
}

/** Llamado cuando se responde correctamente un quiz */
function F34_onQuizCorrect() {
  if (S.dailyChallengeKey !== F34_todayKey()) return;
  if (S.dailyChallengeCompleted) return;
  if (S.dailyChallengeType !== 'quiz') return;

  S.dailyChallengeProgress = (S.dailyChallengeProgress || 0) + 1;
  F34_checkComplete();
}

/** Llamado cuando se gana XP (hookear desde el sitio central de ganancia XP) */
function F34_onXPGained(amount) {
  if (S.dailyChallengeKey !== F34_todayKey()) return;
  if (S.dailyChallengeCompleted) return;
  if (S.dailyChallengeType !== 'xp') return;

  S.dailyChallengeProgress = (S.dailyChallengeProgress || 0) + (amount || 0);
  F34_checkComplete();
}

/** Comprueba si el reto está completado y actualiza estado */
function F34_checkComplete() {
  if (S.dailyChallengeProgress >= S.dailyChallengeTarget) {
    S.dailyChallengeCompleted = true;
    saveState();
    // Re-renderizar para mostrar CTA de reclamar
    if (typeof F34_render === 'function') setTimeout(F34_render, 100);
    toast('🎯 ¡Reto diario completado!',
      `Reclama tu premio: +${S.dailyChallengeXPReward} XP`, 't-success');
  } else {
    saveState();
    if (typeof F34_render === 'function') setTimeout(F34_render, 100);
  }
}

/** F34_claim — El usuario reclama el premio del reto completado */
function F34_claim() {
  if (!S.dailyChallengeCompleted || S.dailyChallengeClaimed) return;
  if (S.dailyChallengeKey !== F34_todayKey()) return;

  const xp = S.dailyChallengeXPReward || 100;
  S.xp += xp;
  F34_onXPGained(xp);
  S.dailyChallengeClaimed = true;
  saveState();

  spawnXP('+' + xp + ' XP');
  if (typeof confetti === 'function') confetti();

  // Badge temporal del día
  if (!Array.isArray(S.surpriseBadges)) S.surpriseBadges = [];
  const today = F34_todayKey();
  S.surpriseBadges.push(`🎯 Reto ${today}`);
  if (S.surpriseBadges.length > 200) S.surpriseBadges = S.surpriseBadges.slice(-200);
  saveState();

  if (typeof checkAchievements === 'function') checkAchievements();
  if (typeof F34_render === 'function') F34_render();
}

// ── Countdown timer ─────────────────────────────────────────────
let _f34Interval = null;

// ── Renderizado ─────────────────────────────────────────────────

function F34_render() {
  const el = document.getElementById('f34-daily-challenge');
  if (!el) return;

  // Limpiar timer anterior
  if (_f34Interval) { clearInterval(_f34Interval); _f34Interval = null; }

  const ch = F34_getOrGenerate();
  const msLeft = F34_msUntilMidnight();
  const pct = ch.target > 0
    ? Math.min(100, Math.round((ch.progress / ch.target) * 100))
    : 0;
  const isUrgent = msLeft < 2 * 3600 * 1000; // < 2 horas

  // Construir HTML según estado
  let stateClass, tagClass, tagLabel, bodyHTML;

  if (ch.claimed) {
    // ── Estado: RECLAMADO ──────────────────────────────────────
    stateClass = 'f34-done';
    tagClass   = 'f34-tag-done';
    tagLabel   = '✅ COMPLETADO';
    bodyHTML   = `
      <div class="f34-body">
        <div class="f34-claimed-banner">
          <span style="font-size:22px;">${ch.icon}</span>
          <span>Reto de hoy superado · <strong>+${ch.xpReward} XP</strong> reclamados. Vuelve mañana para el siguiente.</span>
        </div>
      </div>`;

  } else if (ch.completed) {
    // ── Estado: COMPLETADO — pendiente de reclamar ─────────────
    stateClass = 'f34-done';
    tagClass   = 'f34-tag-done';
    tagLabel   = '🎯 ¡COMPLETADO!';
    bodyHTML   = `
      <div class="f34-body">
        <div class="f34-desc">${ch.desc}</div>
        <div class="f34-reward-row">
          <div class="f34-reward-icon">🏆</div>
          <div class="f34-reward-text">Premio de hoy (sólo disponible hoy)</div>
          <div class="f34-reward-xp">+${ch.xpReward} XP</div>
        </div>
        <button class="f34-claim-btn f34-pulse-cta" onclick="F34_claim()">
          🎁 Reclamar premio
        </button>
      </div>`;

  } else {
    // ── Estado: ACTIVO — en progreso ───────────────────────────
    stateClass = 'f34-active';
    tagClass   = 'f34-tag-active';
    tagLabel   = '⏳ RETO DE HOY';

    const progressHTML = `
      <div class="f34-progress-wrap${pct === 100 ? ' f34-progress-done' : ''}">
        <div class="f34-progress-bar">
          <div class="f34-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="f34-progress-label">
          <span>Progreso</span>
          <span>${ch.progress} / ${ch.target}${ch.type === 'xp' ? ' XP' : ''}</span>
        </div>
      </div>`;

    bodyHTML = `
      <div class="f34-body">
        <div class="f34-desc">${ch.desc}</div>
        ${progressHTML}
        ${(ch.type === 'module' && ch.moduleId != null)
          ? `<button onclick="openModule(${ch.moduleId})" style="margin-top:8px;width:100%;padding:10px;background:rgba(0,229,160,.1);border:1px solid rgba(0,229,160,.25);border-radius:10px;color:var(--accent);font-weight:700;font-size:12px;cursor:pointer;">→ Ir al módulo del reto</button>`
          : ''}
        <div class="f34-reward-row">
          <div class="f34-reward-icon">🎁</div>
          <div class="f34-reward-text">Premio único de hoy — expira a medianoche</div>
          <div class="f34-reward-xp">+${ch.xpReward} XP</div>
        </div>
      </div>`;
  }

  const countdownClass = isUrgent && !ch.claimed ? ' f34-countdown-urgent' : '';
  const countdownHTML = !ch.claimed ? `
    <div class="f34-countdown-pill${countdownClass}" id="f34-cd-pill">
      <div class="f34-countdown-val" id="f34-cd-val">${F34_formatCountdown(msLeft)}</div>
      <div class="f34-countdown-lab">restante</div>
    </div>` : '';

  el.innerHTML = `
    <div class="f34-wrap ${stateClass}" id="f34-inner">
      <div class="f34-header">
        <div class="f34-type-icon">${ch.icon}</div>
        <div class="f34-header-body">
          <div class="f34-header-title">${ch.label}</div>
          <div class="f34-header-sub">Nuevo reto cada día · No se puede recuperar</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
          <div class="f34-tag ${tagClass}">${tagLabel}</div>
          ${countdownHTML}
        </div>
      </div>
      ${bodyHTML}
    </div>`;

  // Ticker de cuenta atrás en tiempo real (solo si no está reclamado)
  if (!ch.claimed) {
    _f34Interval = setInterval(() => {
      const cdEl = document.getElementById('f34-cd-val');
      const pillEl = document.getElementById('f34-cd-pill');
      const ms = F34_msUntilMidnight();

      if (ms <= 0) {
        // Expirado — animación y re-render
        clearInterval(_f34Interval);
        const inner = document.getElementById('f34-inner');
        if (inner) inner.classList.add('f34-expire-anim');
        setTimeout(() => F34_render(), 900);
        return;
      }

      if (cdEl) cdEl.textContent = F34_formatCountdown(ms);
      if (pillEl) {
        if (ms < 2 * 3600 * 1000) pillEl.classList.add('f34-countdown-urgent');
        else pillEl.classList.remove('f34-countdown-urgent');
      }
    }, 1000);
  }
}

window.F34_render           = F34_render;
window.F34_claim            = F34_claim;
window.F34_onModuleComplete = F34_onModuleComplete;
window.F34_onQuizCorrect    = F34_onQuizCorrect;
window.F34_onXPGained       = F34_onXPGained;
window.F34_checkComplete    = F34_checkComplete;


/* ══════════════════════════════════════════════════════════════════
   F41 — ESCUDO DE RACHA (UI visible en home)
   ─────────────────────────────────────────────────────────────────
   La lógica de consumo ya está en loadState().
   Aquí sólo la función de compra con XP y el render del icono
   en el header de la home (si existe el elemento #streak-shield-icon).
══════════════════════════════════════════════════════════════════ */

function F41_buyShield() {
  // Los escudos NO se compran con XP — solo se consiguen en cofres o en rachas hito
  toast('🛡️ Escudos de Racha', 'Los escudos no se compran — se consiguen en los cofres o al alcanzar rachas hito (7, 14, 30, 100 días). ¡Sigue estudiando!', 't-info');
}

function F41_renderShield() {
  const el = document.getElementById('streak-shield-icon');
  if (!el) return;
  const n = S.streakShields || 0;
  if (n > 0) {
    el.innerHTML = `<span class="shield-icon shield-active" title="${n} escudo(s) — protege tu racha si pierdes un día" onclick="F41_buyShield()">🛡️<span class="shield-count">${n}</span></span>`;
  } else {
    el.innerHTML = `<span class="shield-icon shield-empty" title="Sin escudos — gánalos en los cofres" onclick="F41_buyShield()">🛡️</span>`;
  }
}

window.F41_buyShield  = F41_buyShield;
window.F41_renderShield = F41_renderShield;


/* ══════════════════════════════════════════════════════════════════
   F42 — PROBLEMA FINANCIERO DEL DÍA
   ─────────────────────────────────────────────────────────────────
   90 problemas, se selecciona por índice del día del año.
   Máx 3 intentos. Botón compartir Wordle-style.
══════════════════════════════════════════════════════════════════ */

const DAILY_PROBLEMS = [
  { q: '¿Cuál es la regla del 72 para doblar tu inversión?', opts: ['Divide 72 entre el tipo de interés anual', 'Multiplica 72 por el número de años', 'Suma 72 al rendimiento esperado', 'Divide el capital entre 72'], ans: 0, exp: 'La regla del 72 dice: 72 ÷ tipo de interés = años para doblar. Con un 6% anual doblas en 12 años.' },
  { q: 'Tienes €10.000. ¿Cuánto tendrás en 10 años con un 7% anual compuesto?', opts: ['€17.000', '€19.672', '€17.500', '€21.000'], ans: 1, exp: '10.000 × (1,07)^10 = €19.672. El interés compuesto acelera el crecimiento con el tiempo.' },
  { q: '¿Qué es el "expense ratio" de un ETF?', opts: ['El coste anual de gestión sobre el patrimonio', 'El beneficio anual del ETF', 'La diferencia entre precio de compra y venta', 'El dividendo anual del ETF'], ans: 0, exp: 'El expense ratio es el coste anual de gestión cobrado sobre el patrimonio del fondo. Un 0,1% es barato; 2% es caro.' },
  { q: 'Un presupuesto sigue la regla 50/30/20. ¿Qué porcentaje va a ahorro?', opts: ['50%', '30%', '20%', '10%'], ans: 2, exp: '50% necesidades, 30% deseos, 20% ahorro e inversión. Es una guía básica muy efectiva.' },
  { q: 'Tienes deuda al 18% y una inversión que da 7%. ¿Qué haces primero?', opts: ['Invertir, siempre maximizar retorno', 'Pagar la deuda del 18% primero', 'Hacer las dos cosas a partes iguales', 'Ignorar la deuda por ahora'], ans: 1, exp: 'Pagar deuda al 18% es un retorno garantizado del 18%. Ninguna inversión te da eso de forma segura.' },
  { q: '¿Qué es la diversificación en inversión?', opts: ['Concentrar todo en el activo más rentable', 'Distribuir el capital entre distintos activos para reducir riesgo', 'Invertir solo en índices', 'Cambiar de inversión cada semana'], ans: 1, exp: 'Diversificar reduce el riesgo sin reducir el retorno esperado a largo plazo. Es la única comida gratis en finanzas.' },
  { q: 'Un ETF del S&P 500 cae 30%. ¿Cuál es la mejor acción histórica?', opts: ['Vender todo y esperar', 'Comprar más aprovechando el descuento', 'No hacer nada y esperar', 'Las opciones B y C son correctas'], ans: 3, exp: 'Históricamente, mantener y comprar en caídas maximiza el retorno a largo plazo. Vender es casi siempre el peor movimiento.' },
  { q: '¿Cuánto necesitas ahorrar para 25 años de "FIRE" con €2.000/mes de gasto?', opts: ['€300.000', '€480.000', '€600.000', '€720.000'], ans: 2, exp: 'Regla del 4%: gasto anual × 25. €24.000 × 25 = €600.000. Esto asegura 30+ años sin agotar el capital.' },
  { q: '¿Qué significa que un bono tiene "vencimiento" a 10 años?', opts: ['Que solo puedes venderlo en 10 años', 'Que el emisor devuelve el principal en 10 años', 'Que genera intereses durante 10 meses', 'Que su valor aumenta un 10% al año'], ans: 1, exp: 'Al vencimiento, el emisor del bono devuelve el nominal (principal). Mientras tanto paga cupones (intereses periódicos).' },
  { q: '€500/mes durante 30 años al 7% anual. ¿Cuánto acumulas?', opts: ['€180.000', '€340.000', '€568.000', '€1.000.000'], ans: 2, exp: '€500 × 12 × 30 = €180.000 aportado. El resto (€388.000) es puro interés compuesto. Así funciona invertir regularmente.' },
  { q: '¿Cuál es el mayor error al invertir a largo plazo?', opts: ['Comprar índices globales', 'Salir del mercado en momentos de pánico', 'Reinvertir los dividendos', 'Invertir cada mes independientemente del precio'], ans: 1, exp: 'Vender en pánico cristaliza las pérdidas. Los mercados siempre han recuperado. El tiempo en el mercado bate al timing del mercado.' },
  { q: '¿Qué es el "coste de oportunidad"?', opts: ['El coste de mantener dinero en efectivo', 'Lo que renuncias al elegir una opción sobre otra', 'Los impuestos de una inversión', 'El coste de abrir una cuenta de inversión'], ans: 1, exp: 'Si eliges mantener €10.000 en cuenta corriente en vez de invertirlos al 7%, tu coste de oportunidad es €700/año.' },
  { q: 'Inflación al 3% anual. €100.000 en cuenta sin interés. ¿Cuánto vale en 10 años?', opts: ['€100.000 (mismo valor nominal)', '€130.000', '€74.400', '€85.000'], ans: 2, exp: '100.000 × (0,97)^10 ≈ €74.400 en poder adquisitivo real. La inflación destruye el dinero que no crece.' },
  { q: '¿Qué ventaja fiscal tiene un plan de pensiones en España?', opts: ['Los rendimientos están exentos de impuestos', 'Las aportaciones deducen en la base imponible del IRPF', 'No tributa al rescatarlo', 'Está exento del impuesto de patrimonio'], ans: 1, exp: 'Las aportaciones a planes de pensiones reducen la base imponible del IRPF (hasta €1.500/año en 2024). Al rescatarlo sí tributa.' },
  { q: '¿Qué es el "dollar cost averaging" (DCA)?', opts: ['Comprar solo cuando el mercado baja', 'Invertir una cantidad fija de forma periódica', 'Comprar solo en dólares', 'Calcular el promedio de tus inversiones'], ans: 1, exp: 'DCA = invertir la misma cantidad cada mes, sin importar el precio. Reduce el riesgo de entrar en máximos.' },
  { q: 'Tienes un crédito personal al 8% y un seguro de vida que "rinde" un 4%. ¿Qué deberías hacer?', opts: ['Mantener ambos', 'Cancelar el seguro y pagar el crédito', 'Contratar más seguro', 'Refinanciar el crédito'], ans: 1, exp: 'Si el crédito cuesta más de lo que rinde el seguro, la operación neta es negativa. Cancelar el seguro para pagar deuda cara es mejor.' },
  { q: '¿Cuál de estos activos NO suele estar correlacionado con la bolsa?', opts: ['Acciones tech', 'Bonos del estado a largo plazo', 'ETFs del S&P 500', 'Fondos de renta variable'], ans: 1, exp: 'Los bonos del estado suelen subir cuando la bolsa baja (activo refugio). Son el mejor complemento diversificador clásico.' },
  { q: '¿Qué es la "liquidez" de un activo?', opts: ['Su rentabilidad en el tiempo', 'La facilidad y rapidez para convertirlo en efectivo', 'Su precio en el mercado', 'El dividendo que paga'], ans: 1, exp: 'Un inmueble es poco líquido (meses para vender). Una acción en bolsa es muy líquida (se vende en segundos). La liquidez tiene un precio.' },
  { q: 'La Fed sube los tipos de interés. ¿Qué suele pasar con los bonos existentes?', opts: ['Suben de precio', 'Bajan de precio', 'No cambian', 'Se amortizan anticipadamente'], ans: 1, exp: 'Cuando suben los tipos, los bonos existentes valen menos (pagan menos que los nuevos). Precio del bono y tipos se mueven inversamente.' },
  { q: '¿Cuántas veces multiplica el interés compuesto €1.000 en 30 años al 10%?', opts: ['3 veces (€3.000)', '10 veces (€10.000)', '17 veces (€17.449)', '30 veces (€30.000)'], ans: 2, exp: '1.000 × (1,10)^30 = €17.449. El interés sobre el interés crea un efecto bola de nieve que se dispara en los últimos años.' },
  { q: '¿Qué es el "rebalanceo" de cartera?', opts: ['Cambiar toda la cartera por activos mejores', 'Vender los activos que más han subido y comprar los que más han bajado para mantener la asignación objetivo', 'Reinvertir dividendos', 'Añadir dinero nuevo cada mes'], ans: 1, exp: 'El rebalanceo mantiene tu asignación objetivo (ej: 80% acciones, 20% bonos) y te obliga a comprar barato y vender caro.' },
  { q: '¿Qué ratio usa Buffett para valorar si la bolsa está cara o barata?', opts: ['P/E ratio', 'Ratio de Buffett (capitalización bolsa / PIB)', 'Ratio de Sharpe', 'Beta del mercado'], ans: 1, exp: 'El Buffett Indicator = capitalización total de la bolsa ÷ PIB del país. Por encima de 120% = cara. Por debajo de 80% = barata.' },
  { q: 'Un fondo con "beta de 1,3" significa que:', opts: ['Da un 1,3% más que el mercado', 'Si el mercado sube 10%, sube un 13% (y baja más en caídas)', 'Tiene una volatilidad del 1,3%', 'Cobra un 1,3% de comisión'], ans: 1, exp: 'Beta > 1 = más volátil que el mercado. Beta 1,3 amplifica los movimientos: +10% mercado → +13% fondo, y viceversa.' },
  { q: '¿Cuál es la principal ventaja de los ETFs sobre los fondos de inversión activos?', opts: ['Mayor rentabilidad garantizada', 'Menores comisiones y gestión pasiva que suele superar a los activos a largo plazo', 'Más diversificación', 'Liquidez diaria'], ans: 1, exp: 'El 90%+ de los fondos activos no supera al índice a 10+ años, y cobran 5-10x más en comisiones. El coste importa mucho a largo plazo.' },
  { q: '¿Qué es el "efecto Latte" en finanzas personales?', opts: ['Una estrategia de inversión en commodities', 'Los pequeños gastos diarios que acumulados impiden la riqueza', 'Un tipo de fondo de café', 'La inflación en productos básicos'], ans: 1, exp: '€5/día en café = €1.825/año. Invertidos al 7% durante 30 años = €185.000. Los pequeños gastos tienen un coste de oportunidad enorme.' },
  { q: '¿Qué significa "apalancamiento" en inversión?', opts: ['Invertir en varios países', 'Usar dinero prestado para ampliar la inversión (y el riesgo)', 'Diversificar en diferentes sectores', 'Invertir solo en mercados alcistas'], ans: 1, exp: 'El apalancamiento amplifica ganancias Y pérdidas. Con €10.000 propios y €10.000 prestados, si baja un 50%, pierdes todo.' },
  { q: '¿Cuándo se dice que un activo está "en territorio de corrección"?', opts: ['Cuando baja menos del 5%', 'Cuando baja entre el 10% y el 20% desde máximos', 'Cuando baja más del 30%', 'Cuando sube más del 20%'], ans: 1, exp: 'Corrección = caída del 10-20%. Caída del 20%+ se llama "mercado bajista" (bear market). Correcciones son normales y frecuentes.' },
  { q: 'Tienes €15.000 y vas a comprar un coche. Opción A: contado. Opción B: financiado al 5% en 5 años. ¿Cuál cuesta más?', opts: ['Las dos cuestan lo mismo', 'La opción A (contado)', 'La opción B (financiado)', 'Depende del modelo'], ans: 2, exp: 'El coche financiado al 5% en 5 años cuesta €15.000 + intereses (≈€1.985 extra). Y el coste de oportunidad del dinero contado también existe.' },
  { q: '¿Qué es la "curva de interés invertida" y por qué asusta a los inversores?', opts: ['Cuando los bonos a corto plazo pagan más que los de largo plazo, señal histórica de recesión', 'Cuando los tipos bajan de golpe', 'Un tipo de gráfico de análisis técnico', 'Cuando los bonos pierden valor'], ans: 0, exp: 'La curva invertida (bonos 2y > bonos 10y) ha precedido cada recesión de EEUU en los últimos 50 años. No es garantía, pero es señal.' },
  { q: 'Si reinviertes dividendos durante 20 años vs no reinvertirlos, ¿cuánto más ganas aproximadamente?', opts: ['Un 10-15% más', 'Un 30-40% más', '2-3 veces más', 'Lo mismo, los dividendos no cambian el retorno total'], ans: 2, exp: 'Reinvertir dividendos y dejar que compoundem puede llegar a doblar o triplicar el resultado final en 20+ años. Es el poder del interés compuesto.' },
  { q: '¿Qué es la "prima de riesgo" de la bolsa española?', opts: ['El diferencial entre la rentabilidad esperada de la bolsa y la del bono sin riesgo', 'El impuesto sobre plusvalías', 'La diferencia de rentabilidad entre España y Alemania', 'La volatilidad anualizada del IBEX'], ans: 0, exp: 'Prima de riesgo = retorno esperado bolsa - bono sin riesgo (letras del tesoro). Históricamente 4-7% en España. Compensa el riesgo asumido.' },
  { q: '¿Qué es "aportar a la mochila"? (inversión indexada)', opts: ['Un fondo de inversión específico', 'Invertir cada mes independientemente del precio del mercado', 'Ahorrar en una cuenta especial', 'Repartir inversiones entre renta fija y variable'], ans: 1, exp: '"Aportar a la mochila" = DCA (Dollar Cost Averaging). Cada mes pones una aportación fija, sin intentar adivinar el mejor momento.' },
  { q: 'Tienes €5.000 de fondo de emergencia en un banco al 0%. La inflación es 4%. ¿Cuánto pierdes en poder adquisitivo en 1 año?', opts: ['€0 (no pierdes nada nominalmente)', '€200', '€400', '€1.000'], ans: 1, exp: 'En términos nominales tienes €5.000. Pero en poder real, €5.000 × 0,96 = €4.800. Pierdes €200 de poder de compra. La inflación es un impuesto silencioso.' },
  { q: '¿Cuándo conviene usar un robo-advisor vs gestionar tu propia cartera de ETFs?', opts: ['El robo-advisor siempre es mejor por su tecnología', 'Gestionar tú mismo es mejor si ya entiendes la inversión indexada y buscas mínimas comisiones', 'El robo-advisor es mejor para todo el mundo', 'Ninguno de los dos tiene sentido'], ans: 1, exp: 'Los robo-advisors cobran 0,5-1% sobre los ETFs. Si ya sabes elegir ETFs tú mismo, puedes replicarlos por 0,05-0,2%. Pero para empezar, los robo son excelentes.' },
  { q: '¿Qué es el "riesgo de longevidad"?', opts: ['El riesgo de morir antes de recuperar tu inversión', 'El riesgo de vivir más tiempo del que tu dinero puede durar', 'El riesgo de invertir en empresas muy antiguas', 'El riesgo de la inflación a largo plazo'], ans: 1, exp: 'El riesgo de longevidad es sobrevivir a tus ahorros. Con FIRE y la regla del 4%, hay que asegurarse que el dinero dure 30-40+ años.' },
  { q: 'Si quieres jubilarte en 15 años con €1.500/mes de "sueldo pasivo", ¿cuánto necesitas acumular?', opts: ['€225.000', '€270.000', '€450.000', '€630.000'], ans: 2, exp: '€1.500/mes = €18.000/año. Con regla del 4%: €18.000 ÷ 0,04 = €450.000. Necesitas ese capital invertido al 4% de retiro sostenible.' },
  { q: '¿Qué es el "value averaging" a diferencia del DCA?', opts: ['Es lo mismo que DCA', 'Inviertes más cuando el mercado ha bajado y menos cuando ha subido para mantener un objetivo de valor', 'Inviertes solo cuando el valor cae', 'Compras siempre el activo de mayor valor'], ans: 1, exp: 'Value averaging: si tu objetivo es crecer €500/mes y el mercado subió, inviertes menos; si bajó, inviertes más. Más complejo que DCA pero potencialmente más eficiente.' },
  { q: '¿Cuál es el "sesgo del presente" en psicología financiera?', opts: ['Preferir invertir en empresas del presente', 'Valorar las recompensas inmediatas desproporcionadamente más que las futuras', 'Analizar solo datos actuales del mercado', 'Invertir solo en activos presentes'], ans: 1, exp: 'El sesgo del presente nos hace preferir €100 hoy vs €120 en un año, aunque el 20% en un año supere cualquier inversión. Es la raíz de la falta de ahorro.' },
  { q: 'ETF de acumulación vs distribución: ¿cuál es más eficiente fiscalmente en España mientras no necesitas rentas?', opts: ['Distribución, porque cobras dividendos', 'Acumulación, porque reinvierte automáticamente sin tributar por dividendos', 'Son iguales fiscalmente', 'Depende de tu tipo marginal'], ans: 1, exp: 'ETF acumulación reinvierte dividendos sin pasar por tu IRPF. Solo tributas al vender. Fiscalmente más eficiente si no necesitas rentas ahora.' },
  { q: '¿Qué es la "ilusión monetaria"?', opts: ['Creer que el dinero tiene más valor del real', 'Confundir el aumento nominal de salario con aumento real (sin considerar inflación)', 'Un truco de marketing bancario', 'La creencia de que el dinero da la felicidad'], ans: 1, exp: 'Ilusión monetaria: te suben el sueldo un 3% pero la inflación es 5%. Nominalmente ganas más, pero en términos reales pierdes poder adquisitivo.' },
  { q: 'Una acción tiene un PER (Price-to-Earnings) de 30. ¿Qué significa?', opts: ['Que el dividendo es del 30%', 'Que pagas 30 veces los beneficios anuales de la empresa', 'Que la empresa tiene 30 años de historia', 'Que la acción ha subido un 30%'], ans: 1, exp: 'PER 30 = a precios actuales, pagarías 30 años de beneficios para "comprar" la empresa. Un PER bajo suele indicar empresa barata, pero hay excepciones.' },
  { q: '¿Qué diferencia hay entre rentabilidad nominal y real?', opts: ['No hay diferencia', 'Rentabilidad real = nominal - inflación', 'Rentabilidad real = nominal + impuestos', 'Rentabilidad nominal es siempre mayor que la real'], ans: 1, exp: 'Si tu inversión sube 8% y la inflación es 3%, tu rentabilidad real es 5%. Es lo que importa para ver si realmente mejoras tu poder adquisitivo.' },
  { q: '¿Cuándo es mala idea la deuda hipotecaria?', opts: ['Siempre es mala idea', 'Cuando el tipo de interés supera la rentabilidad esperada de invertir ese dinero a largo plazo', 'Nunca, siempre es mejor tener casa', 'Solo cuando los tipos suben'], ans: 1, exp: 'Si la hipoteca es al 4,5% y los mercados dan históricamente 7%, hay un debate. Pero psicológicamente y en términos de riesgo, muchos prefieren primero pagar la hipoteca.' },
  { q: '¿Qué es un "fondo de emergencia" y cuánto debería cubrir?', opts: ['Un fondo de inversión para emergencias médicas', 'Entre 3 y 6 meses de gastos, en cuenta muy líquida', 'Todo tu ahorro, para estar siempre preparado', '12 meses de ingresos'], ans: 1, exp: 'El fondo de emergencia (3-6 meses de gastos) debe ser líquido y seguro (no en bolsa). Evita que vendas inversiones en mal momento por imprevistos.' },
  { q: '¿Qué es el "riesgo de concentración" en tu cartera?', opts: ['Invertir en activos complejos', 'Tener demasiado capital en pocos activos o un solo sector', 'No diversificar geográficamente', 'Las opciones B y C son correctas'], ans: 3, exp: 'Concentración = poco diversificado. Tener el 70% en empresas tech españolas es altísimo riesgo de concentración. Un índice global lo elimina casi.' },
  { q: 'Tienes €2.000/mes de renta. El alquiler de un piso es €600. ¿Cuál es el ratio deuda-ingresos recomendado para una hipoteca?', opts: ['Máximo 20% de ingresos (€400/mes)', 'Máximo 33% de ingresos (€660/mes)', 'Máximo 50% de ingresos (€1.000/mes)', 'No hay límite recomendado'], ans: 1, exp: 'La regla del 33% dice que el pago de la hipoteca no debería superar el 33% de los ingresos netos. Bancos suelen exigir máximo 35-40%.' },
  { q: '¿Qué es el "factor de éxito seguro" (safe withdrawal rate)?', opts: ['El interés anual que da un bono del estado', 'El porcentaje anual que puedes retirar de tu cartera sin agotarla en 30 años', 'La tasa de éxito de los fondos activos', 'El tipo de interés mínimo recomendado'], ans: 1, exp: 'La regla del 4% dice que puedes retirar ese porcentaje anualmente sin agotar tu cartera en 30+ años históricamente. Es la base del FIRE.' },
  { q: 'Tu empresa te ofrece matching de plan de pensiones 1:1 hasta el 5% de tu salario. ¿Deberías aprovecharlo?', opts: ['No, los planes de pensiones no merecen la pena', 'Sí, es un retorno inmediato del 100% antes de impuestos', 'Solo si el plan tiene buenos fondos', 'Solo si piensas jubilarte pronto'], ans: 1, exp: 'Matching 1:1 = doblas el dinero instantáneamente. Es el activo financiero más rentable que existe. Siempre hay que aprovechar el matching hasta el límite.' },
  { q: '¿Cuál es la diferencia entre un activo y un pasivo según Kiyosaki?', opts: ['Activo tiene más valor que el pasivo', 'Activo pone dinero en tu bolsillo; pasivo te lo saca', 'Activo es tangible; pasivo es digital', 'No hay diferencia real'], ans: 1, exp: 'Kiyosaki: tu coche propio es un pasivo (gastos > ingresos). Una vivienda en alquiler es un activo (ingresos > gastos). La riqueza se construye con activos.' },
  { q: 'Si el S&P 500 ha dado un 10% anual histórico en dólares y la inflación americana media es 3%, ¿cuál es la rentabilidad real media?', opts: ['13%', '10%', '7%', '3%'], ans: 2, exp: '10% - 3% = 7% real. Es la cifra que se usa para calcular proyecciones reales de FIRE. La inflación siempre se resta al rendimiento nominal.' },
  { q: '¿Qué es el "bias de anclaje" en finanzas?', opts: ['Confiar solo en el asesor financiero del banco', 'Darle demasiado peso al primer precio que viste al tomar una decisión', 'Invertir siempre en el mismo activo', 'El miedo a vender con pérdidas'], ans: 1, exp: 'Sesgo de anclaje: si un piso costaba €300.000 y ahora vale €280.000, lo vemos como barato aunque el precio justo sea €240.000. El precio histórico te ancla.' },
  { q: '¿Por qué el coste total de una hipoteca a 30 años suele doblar el precio del piso?', opts: ['Por los impuestos de compraventa', 'Por los intereses acumulados durante 30 años sobre el capital pendiente', 'Por los gastos de notaría y registro', 'Por las comisiones del banco'], ans: 1, exp: 'En una hipoteca a 30 años al 3%, por cada €100.000 de capital pagas unos €151.000 total. Los intereses acumulados son enormes.' },
  { q: '¿Qué ventaja da el "efecto del primer año" en la jubilación (sequence of returns risk)?', opts: ['Los primeros años de inversión son los más importantes', 'Una caída grave justo al jubilarte es mucho más dañina que la misma caída 15 años después', 'Los retornos son más altos al principio', 'El primer año es el más fácil fiscalmente'], ans: 1, exp: 'El riesgo de secuencia: si el mercado cae 40% justo cuando empiezas a retirar (FIRE), puede agotar el capital. Por eso se aconseja tener 2-3 años en efectivo al jubilarse.' },
  { q: '¿Qué son los "dividendos aristocratas"?', opts: ['Empresas que pagan dividendos muy altos', 'Empresas que han aumentado sus dividendos durante 25+ años consecutivos', 'Fondos de inversión especializados en dividendos', 'ETFs con los mejores dividendos del año'], ans: 1, exp: 'Los Dividend Aristocrats son empresas del S&P 500 que han aumentado su dividendo cada año durante 25+ años. Señal de solidez y disciplina financiera.' },
  { q: '¿Qué es la "beta smart" o factor investing?', opts: ['Invertir solo en empresas con alta beta', 'Estrategias sistemáticas que buscan fuentes de retorno superiores al mercado (value, momentum, quality)', 'Un algoritmo de trading de alta frecuencia', 'Fondos cotizados con gestión activa'], ans: 1, exp: 'Factor investing = smart beta. Sobreponderar factores probados (value, momentum, size, quality) que históricamente superan al mercado. Más que gestión pasiva pura.' },
  { q: '¿Cuándo conviene amortizar hipoteca vs invertir en bolsa?', opts: ['Siempre amortizar: la deuda es siempre mala', 'Depende: si el tipo hipotecario < retorno esperado de bolsa, puede convenir invertir. Si es fijo bajo (< 2%), invertir. Si es variable alto, amortizar.', 'Siempre invertir, la bolsa siempre gana', 'Son equivalentes siempre'], ans: 1, exp: 'Con hipoteca fija al 1,5% y bolsa histórica al 7%, matemáticamente conviene invertir. Pero la deuda tiene riesgo y la bolsa tiene volatilidad. El perfil psicológico importa.' },
  { q: '¿Qué es el "error de supervivencia" en inversión?', opts: ['Invertir solo en empresas grandes que ya sobrevivieron', 'El sesgo de ver solo los fondos o inversiones que tuvieron éxito, ignorando todos los que quebraron', 'La tendencia a no vender activos que bajan', 'Confundir rentabilidad nominal con real'], ans: 1, exp: 'Survivorship bias: cuando ves fondos con 15% anual, olvidas los 1.000 fondos que quebraron. Los datos de éxito están sesgados por los supervivientes.' },
  { q: '¿Por qué no deberías invertir en bolsa dinero que vayas a necesitar en menos de 5 años?', opts: ['Porque los brokers cobran comisiones extra por plazos cortos', 'Porque la bolsa puede bajar un 50% en ese plazo y no habría tiempo de recuperarse antes de necesitar el dinero', 'Porque la bolsa solo paga dividendos a largo plazo', 'Porque hay límites legales para inversiones cortas'], ans: 1, exp: 'La bolsa puede tardar 5-10 años en recuperar una caída grave. Si necesitas el dinero en 2 años y cae un 40%, tendrías que vender en pérdidas. Horizonte temporal = clave.' },
  { q: '¿Qué ventaja aporta un ETF de "distribución" para una persona en FIRE?', opts: ['Mayor rentabilidad total', 'Genera rentas periódicas (dividendos) sin tener que vender participaciones', 'Menores comisiones que el de acumulación', 'Mejor tratamiento fiscal siempre'], ans: 1, exp: 'En FIRE, el ETF de distribución paga dividendos que cubren gastos sin tener que vender participaciones. Ideal para no depender del timing del mercado para retirar.' },
  { q: '¿Cuál es el "ratio de Sharpe" y qué mide?', opts: ['La comisión anual de un fondo', 'El retorno de la inversión ajustado por el riesgo asumido (volatilidad)', 'La correlación entre dos activos', 'El porcentaje de dividendos sobre el precio'], ans: 1, exp: 'Sharpe = (retorno - tasa libre de riesgo) / volatilidad. Un Sharpe > 1 es bueno: obtienes más retorno por unidad de riesgo. Compara fondos ajustando por riesgo.' },
  { q: 'Tienes €30.000 y decides invertirlos todos en el S&P 500 de golpe vs en 12 meses (DCA). ¿Cuál suele ser mejor históricamente?', opts: ['DCA, siempre reduce el riesgo', 'Invertir todo de golpe (lump sum) estadísticamente da mejores resultados en ~2/3 de los casos', 'Son iguales estadísticamente', 'DCA es mejor en mercados alcistas'], ans: 1, exp: 'Invertir todo de golpe (lump sum) es estadísticamente mejor en ~65% de los casos porque el mercado tiende a subir con el tiempo. Pero DCA reduce la ansiedad psicológica.' },
  { q: '¿Qué es el "rebalanceo fiscal eficiente" (tax-loss harvesting)?', opts: ['Pagar menos impuestos declarando pérdidas ficticias', 'Vender activos en pérdidas para compensar plusvalías fiscalmente, y comprar activos similares para mantener la exposición', 'Un tipo de cuenta de inversión exenta', 'Cambiar domicilio fiscal para pagar menos'], ans: 1, exp: 'Tax-loss harvesting: si una posición baja, la vendes (realizas la pérdida fiscal), compras un activo similar y compensas ganancias de otras posiciones. Legal y eficiente.' },
  { q: '¿Por qué el oro no es una buena inversión a muy largo plazo según los datos históricos?', opts: ['Porque es ilegal en muchos países', 'Porque su rentabilidad real a 100+ años es prácticamente 0% (solo preserva valor vs inflación)', 'Porque genera costes de almacenamiento', 'Las opciones B y C son correctas'], ans: 3, exp: 'El oro históricamente preserva poder adquisitivo pero no genera rentabilidad real significativa. €100 en oro en 1900 = €100 en valor real hoy. La bolsa: €100 → €50.000+.' },
  { q: '¿Qué es una "corrección del 10%" diferente de un "mercado bajista"?', opts: ['Son lo mismo', 'Corrección: caída del 10-20% (normal, frecuente). Bajista: caída >20% sostenida (raro, grave)', 'Corrección: caída rápida. Bajista: caída lenta', 'Solo afecta a diferentes mercados'], ans: 1, exp: 'Correcciones del 10% ocurren casi cada año. Bear markets (>20%) son raros (cada 4-5 años). Confundirlos lleva a vender en correcciones innecesariamente.' },
  { q: '¿Cuándo tiene sentido abrir una cuenta en un broker internacional vs banco español?', opts: ['Nunca, el banco siempre es más seguro', 'Cuando buscas acceso a más mercados y menores comisiones, aceptando más complejidad en la declaración', 'Solo si inviertes más de €100.000', 'Solo si eres residente fiscal en otro país'], ans: 1, exp: 'Brokers como Interactive Brokers, DEGIRO o Lightyear ofrecen acceso global con comisiones mucho menores. La declaración es algo más compleja (modelo 720 si > €50.000 en el extranjero).' },
  { q: '¿Qué es el "índice de miseria" y para qué sirve?', opts: ['Un índice de deuda personal', 'La suma de la tasa de desempleo y la tasa de inflación de un país', 'Un indicador de pobreza absoluta', 'El índice de volatilidad del mercado'], ans: 1, exp: 'Índice de miseria = desempleo + inflación. Mide el "dolor económico" de la población. Útil para comparar países y decidir dónde invertir en deuda soberana.' },
  { q: '¿Qué impacto tiene el "rebalanceo anual" en el riesgo de una cartera 80/20?', opts: ['Ninguno, el riesgo es siempre igual', 'Mantiene la asignación objetivo y puede mejorar el retorno ajustado por riesgo entre 0,5-1% anual', 'Aumenta el riesgo al vender lo que sube', 'Solo tiene ventaja fiscal'], ans: 1, exp: 'Sin rebalancear, una cartera 80/20 puede volverse 95/5 en un mercado alcista. El rebalanceo vende lo que subió (acciones) y compra lo que bajó (bonos): compra barato, vende caro.' },
  { q: '¿Cuál es la diferencia entre un fondo indexado y un ETF indexado?', opts: ['No hay diferencia', 'El ETF cotiza en bolsa intradiariamente como una acción; el fondo indexado solo al precio de cierre diario. Ambos replican el mismo índice.', 'El ETF tiene comisiones más altas', 'El fondo indexado es más arriesgado'], ans: 1, exp: 'ETF y fondo indexado son similares en concepto. La diferencia es la liquidez (ETF = intradiaria), el mínimo de inversión (fondos pueden tener mínimos) y el acceso (ETF necesita broker).' },
  { q: '¿Qué es la "teoría del mercado eficiente" (EMH)?', opts: ['Los mercados siempre suben a largo plazo', 'Los precios de los activos reflejan toda la información disponible, haciendo imposible batir el mercado consistentemente', 'Los mercados son eficientes solo en EE.UU.', 'El mercado siempre valora correctamente las empresas'], ans: 1, exp: 'EMH implica que si los precios ya reflejan todo, no puedes tener información ventajosa. La evidencia empírica apoya fuertemente la gestión indexada sobre la activa.' },
  { q: '¿Qué es el "put protector" como estrategia de cobertura?', opts: ['Comprar acciones baratas', 'Comprar una opción de venta sobre un activo que posees para limitar las pérdidas máximas', 'Un tipo de seguro de depósito bancario', 'Vender acciones en corto para cubrirse'], ans: 1, exp: 'El put protector = compras el derecho a vender tu activo a un precio fijo (strike). Si cae, limitas la pérdida al strike. Funciona como un seguro. Tiene un coste (la prima).' },
  { q: '¿Cuánto puede tardar el mercado en recuperar una caída tipo 2008 (-50%)?', opts: ['1-2 años máximo', '3-5 años aproximadamente', 'Puede tardar 10+ años (el S&P tardó 5 años en recuperar el máximo, ajustado por inflación tardó más)', 'El mercado no siempre recupera'], ans: 2, exp: 'El S&P 500 tardó ≈5 años en recuperar nominalmente el máximo de 2007. Ajustado por inflación, más de 7 años. Por eso el horizonte temporal es crucial antes de invertir.' },
  { q: '¿Qué ventaja tiene un plan de ahorro sistemático (DCA mensual) en términos psicológicos?', opts: ['Maximiza el retorno en todos los escenarios', 'Elimina la necesidad de tomar decisiones basadas en el mercado y reduce el sesgo del timing', 'Es obligatorio por ley en España', 'No tiene ventajas psicológicas'], ans: 1, exp: 'El DCA automatizado elimina la tentación de "esperar el momento perfecto" y el pánico en caídas. La automatización es el mayor superpoder del inversor minorista.' },
  { q: '¿Qué es el "efecto de disposición" (disposition effect)?', opts: ['La tendencia a invertir en activos familiares', 'Vender demasiado pronto los activos que ganan y mantener demasiado tiempo los que pierden', 'La preferencia por dividendos vs plusvalías', 'Comprar siempre en máximos por el FOMO'], ans: 1, exp: 'El efecto disposición es el opuesto a lo racional: vendemos lo que sube (realizamos beneficios para sentirnos bien) y aguantamos lo que baja (esperando recuperar). Es un enorme destructor de rentabilidad.' },
  { q: 'Inflación 3%, retorno de tu cartera 8%, tipo impositivo sobre plusvalías 21%. ¿Cuál es tu rentabilidad real neta?', opts: ['5%', '4,68%', '6,32%', '3,08%'], ans: 1, exp: '8% - 21% de impuestos = 6,32% neto nominal. 6,32% - 3% inflación = 3,32% real. Nota: simplificado, pues el impuesto se paga al vender y la inflación se aplica también al coste base.' },
  { q: '¿Qué es el "risk parity" en gestión de carteras?', opts: ['Dividir la cartera en partes iguales', 'Asignar capital de forma que cada activo contribuya la misma cantidad de riesgo (volatilidad) a la cartera', 'Invertir solo en activos sin riesgo', 'El mismo concepto que diversificación'], ans: 1, exp: 'Risk parity: en vez de 60/40 en capital, ajustas para que acciones y bonos contribuyan el mismo riesgo. Como los bonos son menos volátiles, te apalancas más en ellos. Bridgewater lo popularizó.' },
  { q: '¿Cuál es el principal riesgo de invertir en bonos corporativos de alto rendimiento (high yield)?', opts: ['Riesgo de tipo de interés solamente', 'Riesgo de crédito: que la empresa emisora no pueda pagar los intereses o el principal (impago/default)', 'Riesgo de iliquidez exclusivamente', 'No tienen riesgo adicional respecto a bonos del estado'], ans: 1, exp: 'Los bonos high yield pagan más porque el emisor tiene mayor probabilidad de impago. El riesgo principal es el crédito: que la empresa quiebre y no pueda devolver el dinero.' },
  { q: 'Si un activo tiene una "correlación de -0,8" con otro, ¿qué significa para tu cartera?', opts: ['Los activos se mueven en la misma dirección', 'Cuando uno sube el otro suele bajar, reduciendo drásticamente el riesgo de la cartera combinada', 'La correlación no afecta al riesgo', 'Solo importa la correlación positiva'], ans: 1, exp: 'Correlación -0,8 es casi perfectamente inversa. Combinar activos con correlación negativa reduce el riesgo sin sacrificar tanto retorno. Es la base de la diversificación eficiente.' },
  { q: '¿Qué es la "prima de liquidez" en los mercados?', opts: ['El descuento que dan los brokers por operar mucho', 'El exceso de retorno exigido a activos menos líquidos para compensar el riesgo de no poder venderlos rápido', 'El diferencial entre compra y venta de una acción', 'El coste de mantener efectivo en cartera'], ans: 1, exp: 'Los activos ilíquidos (capital riesgo, inmobiliario) exigen un retorno extra (prima de liquidez) para compensar que no puedes venderlos rápido. Históricamente 2-4% adicional.' },
  { q: '¿Por qué "comprar un piso para no tirar el dinero al alquiler" es un análisis incompleto?', opts: ['Es completamente correcto, siempre conviene comprar', 'Ignorar el coste de oportunidad del capital inmovilizado, los intereses hipotecarios, impuestos y mantenimiento hace la comparación injusta', 'Solo depende del precio del alquiler', 'Solo aplica en ciudades caras'], ans: 1, exp: 'Comprar también tiene costes: intereses hipotecarios, IBI, mantenimiento, seguro, gastos de compraventa (10-15% del precio). El alquiler no es "tirar dinero" si el resto se invierte bien.' },
  { q: '¿Cuál es la diferencia entre riesgo sistemático e idiosincrático en una cartera?', opts: ['No hay diferencia', 'Sistemático: riesgo del mercado entero (no diversificable). Idiosincrático: riesgo propio de cada empresa (sí diversificable)', 'Sistemático se puede eliminar; idiosincrático no', 'Solo el idiosincrático importa para el inversor'], ans: 1, exp: 'El riesgo de mercado (sistemático) afecta a todo: crises, guerras, inflación. No se puede evitar. El riesgo empresa (idiosincrático) se elimina diversificando con 20-30 activos no correlacionados.' },
  { q: '¿Qué es el "momentum investing" y tiene base académica?', opts: ['Invertir en lo que bajó para que rebote', 'Invertir en activos que han subido recientemente porque tienden a seguir subiendo a corto-medio plazo. Sí tiene evidencia académica sólida.', 'Es solo especulación sin base científica', 'Invertir siguiendo las noticias del momento'], ans: 1, exp: 'El momentum es uno de los factores más robustos documentados (Jegadeesh & Titman, 1993). Los activos que subieron en los últimos 3-12 meses tienden a seguir subiendo en los próximos 3-6 meses.' },
  { q: '¿Cuándo tiene sentido contratar un asesor financiero independiente (fee-only)?', opts: ['Nunca, puedes hacerlo todo tú', 'Cuando la complejidad (herencias, divorcio, empresa, FIRE cercano, muchos activos) supera lo que puedes gestionar solo', 'Siempre, para cualquier cantidad', 'Solo si tienes más de €1.000.000'], ans: 1, exp: 'Un fee-only advisor cobra por hora/servicio, sin comisiones de producto. Tiene sentido en situaciones complejas donde el valor que añade supera claramente su coste.' },
  { q: '¿Qué es el "CAPE ratio" (Cyclically Adjusted Price-Earnings) de Shiller?', opts: ['El PER del S&P 500 en tiempo real', 'El PER ajustado por el promedio de beneficios de los últimos 10 años (suaviza el ciclo económico)', 'El ratio de capitalización del mercado total', 'La correlación ajustada entre precio y beneficios'], ans: 1, exp: 'CAPE = precio / media de beneficios reales de los últimos 10 años. Suaviza los ciclos. Un CAPE alto (>30) históricamente predice retornos futuros más bajos. Robert Shiller ganó el Nobel por esto.' },
  { q: '¿Qué es el "asset allocation" y qué porcentaje de rentabilidad explica?', opts: ['Elegir qué acciones concretas comprar; explica el 30%', 'La distribución entre clases de activos (acciones, bonos, etc.); estudios muestran que explica el 90%+ de la rentabilidad', 'El número de activos en cartera; explica el 50%', 'El timing de entrada; explica el 70%'], ans: 1, exp: 'Según el estudio de Brinson, Hood y Beebower, el asset allocation explica más del 90% de la rentabilidad a largo plazo. Elegir qué porcentaje va a acciones vs bonos importa más que qué acciones concretas.' },
  { q: '¿Qué mide el índice MSCI World?', opts: ['Las 500 mayores empresas de EEUU', 'La evolución de las bolsas de los principales países desarrollados (~1.500 empresas de 23 países)', 'Solo el mercado europeo', 'Los mercados emergentes globales'], ans: 1, exp: 'El MSCI World incluye ~1.500 empresas de 23 países desarrollados. EE.UU. pesa ~65%. Es la referencia para carteras globales de renta variable.' },
  { q: '¿Qué es la "tasa interna de retorno" (TIR o IRR)?', opts: ['El tipo de interés nominal de un préstamo', 'La tasa que hace el VAN = 0; representa el retorno real anualizado de la inversión', 'El retorno nominal anual del activo', 'La tasa de inflación implícita'], ans: 1, exp: 'La TIR es el retorno efectivo anualizado considerando todos los flujos de caja. Si TIR > coste de capital, la inversión crea valor. Es imprescindible para comparar proyectos con distintos plazos.' },
  { q: '¿Qué es el "VIX" y por qué se llama "índice del miedo"?', opts: ['La volatilidad histórica del S&P 500', 'La expectativa del mercado sobre la volatilidad futura del S&P 500 implícita en los precios de opciones', 'La desviación estándar diaria del mercado', 'El índice de correlación global'], ans: 1, exp: 'VIX > 30 señala pánico extremo (2008, 2020). VIX < 15 señala complacencia. Muchos inversores lo usan como señal contraria: comprar cuando el miedo es alto.' },
  { q: '¿Por qué es ilegal el "insider trading" (uso de información privilegiada)?', opts: ['No es ilegal si la información es correcta', 'Daña la igualdad del mercado y puede acarrear cárcel y multas millonarias', 'Solo está prohibido para directivos de grandes empresas', 'Solo está prohibido en EEUU'], ans: 1, exp: 'El insider trading es delito penal en todos los mercados regulados. Los reguladores (SEC, CNMV) tienen herramientas sofisticadas para detectar patrones inusuales de operaciones previas a anuncios.' },
  { q: '¿Qué diferencia hay entre el S&P 500 "de precio" y "total return"?', opts: ['Son idénticos', 'El total return incluye la reinversión de dividendos, dando un retorno significativamente mayor a largo plazo', 'El de precio incluye dividendos; el total return no', 'Solo difieren en la metodología de cálculo'], ans: 1, exp: 'El S&P 500 price-only da ~7% anual histórico. El total return (con dividendos reinvertidos) da ~10%. A 30 años, la diferencia es enorme: €10.000 → €76.000 vs €174.000.' },
  { q: '¿Cuál es la "regla del inversor perezoso" más eficiente según la investigación académica?', opts: ['Invertir en acciones que subieron el año anterior', 'Comprar un ETF de mercado global y no hacer nada (buy & hold indefinido)', 'Rebalancear mensualmente para aprovechar la volatilidad', 'Invertir en el sector con mejor comportamiento de los últimos 3 años'], ans: 1, exp: 'El buy & hold de un ETF global diversificado supera a la gran mayoría de estrategias activas tras costes a largo plazo. La simplicidad es una estrategia, no una renuncia.' },
];

// ── Helpers internos ────────────────────────────────────────────

function _f42_todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function _f42_problemIndex() {
  const now  = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return dayOfYear % DAILY_PROBLEMS.length;
}

function F42_render() {
  const el = document.getElementById('f42-daily-problem');
  if (!el) return;

  const today   = _f42_todayKey();
  const idx     = _f42_problemIndex();
  const problem = DAILY_PROBLEMS[idx];
  const dp      = S.dailyProblem || {};
  const isTodayDone = dp.date === today && dp.solved;

  // Countdown
  const msLeft  = new Date(today + 'T23:59:59').getTime() - Date.now() + 1000;
  const h = Math.floor(msLeft / 3600000);
  const m = Math.floor((msLeft % 3600000) / 60000);
  const cdStr = `${h}h ${m}m`;

  if (isTodayDone) {
    el.innerHTML = `
      <div class="f42-card f42-solved">
        <div class="f42-header-row">
          <span class="f42-icon">📅</span>
          <span class="f42-title">Problema del Día #${idx + 1}</span>
          <span class="f42-badge f42-badge-done">✅ Resuelto</span>
        </div>
        <div class="f42-emoji-grid">${dp.emojis || ''}</div>
        <div class="f42-share-row">
          <button class="f42-share-btn" onclick="F42_share()">📤 Compartir resultado</button>
          <span class="f42-countdown">Próximo en ${cdStr}</span>
        </div>
      </div>`;
  } else {
    const attLeft = 3 - (dp.date === today ? (dp.attempts || 0) : 0);
    el.innerHTML = `
      <div class="f42-card f42-active">
        <div class="f42-header-row">
          <span class="f42-icon">🧩</span>
          <span class="f42-title">Problema del Día #${idx + 1}</span>
          <span class="f42-badge f42-badge-active">🔴 Sin resolver</span>
        </div>
        <div class="f42-question">${problem.q}</div>
        <div class="f42-opts" id="f42-opts">
          ${problem.opts.map((o, i) => `<button class="f42-opt" onclick="F42_answer(${i})">${o}</button>`).join('')}
        </div>
        <div class="f42-fb" id="f42-fb"></div>
        <div class="f42-meta">Intentos restantes: <strong>${attLeft}</strong> · Nuevo problema en ${cdStr}</div>
      </div>`;

    // Si ya respondió hoy pero no resolvió, deshabilitar opciones ya usadas
    if (dp.date === today && dp.attempts > 0 && !dp.solved) {
      // Restaurar intentos anteriores en visual
    }
  }
}

function F42_answer(chosen) {
  const today   = _f42_todayKey();
  const idx     = _f42_problemIndex();
  const problem = DAILY_PROBLEMS[idx];

  if (!S.dailyProblem || S.dailyProblem.date !== today) {
    S.dailyProblem = { date: today, solved: false, attempts: 0, emojis: '' };
  }
  if (S.dailyProblem.solved || S.dailyProblem.attempts >= 3) return;

  S.dailyProblem.attempts++;
  const correct = chosen === problem.ans;
  const attempt = S.dailyProblem.attempts;

  // Emoji grid
  const green = '🟩', yellow = '🟨', red = '🟥', black = '⬛';
  let emojiRow = '';
  if (correct) {
    emojiRow = Array(3).fill(attempt === 1 ? green : attempt === 2 ? yellow : red).join('') + Array(3 - attempt).fill(black).join('');
  } else {
    emojiRow = (S.dailyProblem.emojis || '') + (attempt === 3 ? '🟥' : '⬜');
  }
  S.dailyProblem.emojis = (S.dailyProblem.emojis || '') + (correct ? (attempt === 1 ? '🟩' : attempt === 2 ? '🟨' : '🟧') : '🟥');

  const fbEl = document.getElementById('f42-fb');

  if (correct) {
    S.dailyProblem.solved = true;
    const xpMap = [50, 30, 10];
    const xpGain = Math.round(xpMap[attempt - 1] * (S.xpMultiplier || 1));
    S.xp += xpGain;
    if (typeof F34_onXPGained === 'function') F34_onXPGained(xpGain);
    spawnXP('+' + xpGain + ' XP');
    saveState();
    if (typeof checkAchievements === 'function') checkAchievements();
    SFX.correct && SFX.correct();
    if (fbEl) fbEl.innerHTML = `<div class="f42-fb-ok">✅ ¡Correcto! +${xpGain} XP<br><small>${problem.exp}</small></div>`;
    setTimeout(F42_render, 1400);
  } else {
    if (S.dailyProblem.attempts >= 3) {
      S.xp += 5;
      if (typeof F34_onXPGained === 'function') F34_onXPGained(5);
      saveState();
      if (fbEl) fbEl.innerHTML = `<div class="f42-fb-bad">❌ Sin más intentos. +5 XP de consolación<br><small><strong>Respuesta correcta:</strong> ${problem.opts[problem.ans]}<br>${problem.exp}</small></div>`;
      setTimeout(F42_render, 2000);
    } else {
      saveState();
      if (fbEl) fbEl.innerHTML = `<div class="f42-fb-bad">❌ Incorrecto. Te quedan ${3 - S.dailyProblem.attempts} intento(s).</div>`;
      // Deshabilitar la opción elegida
      const opts = document.querySelectorAll('.f42-opt');
      if (opts[chosen]) opts[chosen].disabled = true;
    }
  }
}

function F42_share() {
  const today = _f42_todayKey();
  const idx   = _f42_problemIndex();
  const dp    = S.dailyProblem;
  if (!dp || dp.date !== today) return;
  const text = `FinLearn Problema del Día #${idx + 1} 💰\nResuelto en ${dp.attempts} intento(s)\n${dp.emojis}\n¿Lo consigues tú? ${window.location.origin}`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => toast('📋 Copiado', 'Pega el resultado donde quieras.', 't-success'));
  } else {
    prompt('Copia este texto:', text);
  }
}

window.F42_render = F42_render;
window.F42_answer = F42_answer;
window.F42_share  = F42_share;


/* ══════════════════════════════════════════════════════════════════
   F43 — RENTABILIDAD PASIVA OFFLINE
   ─────────────────────────────────────────────────────────────────
   Calcula los rendimientos de la cartera durante el tiempo ausente
   y los presenta con un modal al volver.
══════════════════════════════════════════════════════════════════ */

function F43_checkOfflineEarnings() {
  if (!S.userName) return;
  const lastSeen = S.lastSeen || 0;
  if (!lastSeen) { S.lastSeen = Date.now(); saveState(); return; }
  const minAway = (Date.now() - lastSeen) / 60000;
  if (minAway < 30) return; // menos de 30 min — no mostrar
  if ((S.invested || 0) < 500 && Object.keys(S.portfolio || {}).length === 0) {
    // Sin cartera: mensaje motivador
    const fakeEarnings = +(500 * (0.07 / 365 / 24 / 60) * Math.min(minAway, 72 * 60)).toFixed(2);
    if (fakeEarnings > 0.01) {
      _f43_showModal(0, minAway, fakeEarnings, true);
    }
    return;
  }

  const cappedMin = Math.min(minAway, 72 * 60);
  const annualReturn = 0.07;
  const ratePerMin = annualReturn / 365 / 24 / 60;
  let earnings = 0;

  // Calcular por cada posición en cartera
  Object.entries(S.portfolio || {}).forEach(([ticker, pos]) => {
    const price = (GAME.stockPrices || {})[ticker] || 0;
    const value = pos.shares * price;
    earnings += value * ratePerMin * cappedMin;
  });

  // Si no hay posiciones pero sí S.invested
  if (earnings === 0 && S.invested > 0) {
    earnings = S.invested * ratePerMin * cappedMin;
  }

  earnings = +earnings.toFixed(2);
  if (earnings < 0.05) return;

  _f43_showModal(earnings, minAway, 0, false);
}

function _f43_showModal(earnings, minAway, fakeEarnings, isMotivator) {
  const hoursAway = (minAway / 60).toFixed(1);
  let modal = document.getElementById('m-f43-offline');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-f43-offline';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  if (isMotivator) {
    modal.innerHTML = `
      <div class="modal-box f43-modal">
        <div class="f43-icon">💡</div>
        <div class="f43-title">Mientras estabas fuera…</div>
        <div class="f43-sub">Con €500 invertidos habrías generado <strong>€${fakeEarnings.toFixed(2)}</strong> pasivos</div>
        <p class="f43-tip">Las inversiones trabajan 24/7 por ti. ¡Empieza a invertir hoy!</p>
        <button class="btn btn-primary btn-block" onclick="closeModal('m-f43-offline');goTo('portfolio')">📈 Ir a la bolsa</button>
        <button class="btn btn-ghost btn-block" onclick="closeModal('m-f43-offline')">Cerrar</button>
      </div>`;
  } else {
    modal.innerHTML = `
      <div class="modal-box f43-modal">
        <div class="f43-coins-anim">💰💰💰</div>
        <div class="f43-title">¡Bienvenido de vuelta!</div>
        <div class="f43-sub">Mientras estabas <strong>${hoursAway}h</strong> fuera, tu cartera generó:</div>
        <div class="f43-amount">+€${earnings.toFixed(2)}</div>
        <div class="f43-note">Rendimiento pasivo estimado al 7% anual</div>
        <div class="f43-actions">
          <button class="btn btn-primary" onclick="F43_reinvest(${earnings})">♻️ Reinvertir</button>
          <button class="btn btn-ghost" onclick="F43_keepCash(${earnings})">💵 Guardar en efectivo</button>
        </div>
      </div>`;
  }
  openModal('m-f43-offline');
}

function F43_reinvest(amount) {
  S.invested = (S.invested || 0) + amount;
  S.patrimony = (S.patrimony || 0) + amount;
  saveState();
  closeModal('m-f43-offline');
  toast('♻️ Reinvertido', `€${amount.toFixed(2)} añadidos a tu cartera.`, 't-success');
}

function F43_keepCash(amount) {
  S.cash = (S.cash || 0) + amount;
  S.patrimony = (S.patrimony || 0) + amount;
  saveState();
  closeModal('m-f43-offline');
  toast('💵 Efectivo añadido', `€${amount.toFixed(2)} en tu cuenta.`, 't-success');
}

window.F43_checkOfflineEarnings = F43_checkOfflineEarnings;
window.F43_reinvest = F43_reinvest;
window.F43_keepCash = F43_keepCash;



function CERT_openBranch(branch) {
  const modal = document.getElementById('cert-branch-modal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  const bossData = BOSS_DATA[branch.id];
  modal.innerHTML = `
    <div class="certb-container">
      <div class="certb-fireworks">
        ${Array.from({length:12},(_,i)=>`<div class="certb-spark certb-spark-${i}" style="--c:${branch.color}"></div>`).join('')}
      </div>
      <div class="certb-inner">
        <div class="certb-badge" style="border-color:${branch.color}">
          <div class="certb-badge-emoji">${branch.emoji}</div>
          <div class="certb-badge-label" style="color:${branch.color}">CERTIFICADO</div>
        </div>
        <div class="certb-title">Rama completada</div>
        <div class="certb-branch-name">${branch.label}</div>
        <div class="certb-user">${S.userName || 'Explorador'}</div>
        <div class="certb-modules">${branch.mods.length} módulos · ${new Date().toLocaleDateString('es-ES', {day:'numeric',month:'long',year:'numeric'})}</div>
        <div class="certb-actions">
          <button class="btn btn-primary" onclick="CERT_download('${branch.id}','${branch.label}','${branch.emoji}','${branch.color}')">⬇️ Descargar certificado</button>
          <button class="btn btn-ghost btn-sm" onclick="CERT_shareBranch('${branch.id}')">📤 Compartir</button>
          <button class="btn btn-ghost btn-sm" onclick="CERT_closeBranch()">Cerrar</button>
        </div>
      </div>
    </div>
  `;
}

function CERT_download(branchId, branchLabel, emoji, color) {
  try {
    const canvas = document.createElement('canvas');
    canvas.width  = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 1200, 800);
    grad.addColorStop(0, '#060810');
    grad.addColorStop(0.5, '#0d1220');
    grad.addColorStop(1, '#060810');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 800);

    // Glow overlay
    const radGrad = ctx.createRadialGradient(600, 400, 0, 600, 400, 600);
    radGrad.addColorStop(0, color + '22');
    radGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Border
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, 1140, 740);
    ctx.strokeStyle = color + '44';
    ctx.lineWidth = 1;
    ctx.strokeRect(40, 40, 1120, 720);

    // FinLearn logo text
    ctx.fillStyle = color;
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✦ FINLEARN', 600, 90);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 52px Arial';
    ctx.fillText('CERTIFICADO DE DOMINIO', 600, 200);

    // Subtitle
    ctx.fillStyle = '#a0a8c0';
    ctx.font = '28px Arial';
    ctx.fillText('Este certificado acredita que', 600, 265);

    // User name
    ctx.fillStyle = color;
    ctx.font = 'bold 68px Arial';
    ctx.fillText(S.userName || 'Explorador Financiero', 600, 380);

    // Line under name
    ctx.strokeStyle = color + '66';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 405); ctx.lineTo(1000, 405);
    ctx.stroke();

    // Branch info
    ctx.fillStyle = '#ffffff';
    ctx.font = '32px Arial';
    ctx.fillText('ha completado la rama', 600, 455);

    ctx.fillStyle = color;
    ctx.font = 'bold 48px Arial';
    ctx.fillText(emoji + ' ' + branchLabel, 600, 530);

    // Modules count
    const branch = F28_BRANCHES.find(b => b.id === branchId);
    ctx.fillStyle = '#a0a8c0';
    ctx.font = '22px Arial';
    ctx.fillText((branch ? branch.mods.length : '?') + ' módulos completados · FinLearn Academy', 600, 585);

    // Date
    ctx.fillStyle = '#6b7590';
    ctx.font = '20px Arial';
    ctx.fillText('Emitido el ' + new Date().toLocaleDateString('es-ES', {day:'numeric',month:'long',year:'numeric'}), 600, 680);

    // Corner decorations
    const corners = [[80,80],[1120,80],[80,720],[1120,720]];
    corners.forEach(([x,y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI*2);
      ctx.fillStyle = color + '44';
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Download
    const link = document.createElement('a');
    link.download = `FinLearn_Certificado_${branchLabel.replace(/\s/g,'_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    if (typeof toast === 'function') toast('🏆 Certificado descargado', branchLabel, 't-success');
  } catch(e) { console.warn('CERT_download error', e); }
}

function CERT_shareBranch(branchId) {
  const branch = F28_BRANCHES.find(b => b.id === branchId);
  if (!branch) return;
  const text = `🏆 Acabo de completar la rama "${branch.label}" ${branch.emoji} en FinLearn. ${branch.mods.length} módulos dominados. ¿Tú dónde estás? 👉 ${window.location.origin}`;
  if (navigator.share) {
    navigator.share({ title: 'Certificado FinLearn', text });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      if (typeof toast === 'function') toast('📋 Copiado', 'Pégalo en tus redes', 't-success');
    });
  }
}

function CERT_closeBranch() {
  const modal = document.getElementById('cert-branch-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Botón en perfil para ver certificados y abrir test
function CERT_openFromProfile(branchId) {
  const branch = F28_BRANCHES.find(b => b.id === branchId);
  if (branch) CERT_openBranch(branch);
}

window.CERT_checkBranch   = CERT_checkBranch;
window.CERT_openBranch    = CERT_openBranch;
window.CERT_download      = CERT_download;
window.CERT_shareBranch   = CERT_shareBranch;
window.CERT_closeBranch   = CERT_closeBranch;
window.CERT_openFromProfile = CERT_openFromProfile;

/* ─────────────────────────────────────────────────────────────────
   PROF_renderGamifCards — Personality + Certs en pantalla de perfil
───────────────────────────────────────────────────────────────── */
function PROF_renderGamifCards() {
  const el = document.getElementById('prof-gamif-cards');
  if (!el) return;

  // Personality card
  const pt = S.personalityType ? PERSONALITY_TYPES[S.personalityType] : null;
  const personalityCard = `
    <div class="prof-gamif-section">
      <div class="prof-gamif-title">🧠 Personalidad Financiera</div>
      ${pt ? `
        <div class="prof-pt-card" style="--pt-color:${pt.color}" onclick="PERS_open()">
          <div class="prof-pt-emoji">${pt.emoji}</div>
          <div class="prof-pt-info">
            <div class="prof-pt-name">${pt.name}</div>
            <div class="prof-pt-sub">${pt.subtitle}</div>
          </div>
          <span class="prof-pt-retake">Repetir →</span>
        </div>
      ` : `
        <button class="prof-pt-cta" onclick="PERS_open()">
          <span>🧠</span>
          <div>
            <div class="prof-pt-cta-title">Descubre tu perfil financiero</div>
            <div class="prof-pt-cta-sub">8 preguntas · 4 arquetipos · Shareable</div>
          </div>
          <span>›</span>
        </button>
      `}
    </div>
  `;

  // Branch certs
  const certs = S.branchCerts || [];
  const certsCard = `
    <div class="prof-gamif-section">
      <div class="prof-gamif-title">🏆 Certificados de Rama</div>
      ${certs.length === 0 ? `
        <div class="prof-certs-empty">Completa todos los módulos de una rama para obtener tu certificado descargable.</div>
      ` : `
        <div class="prof-certs-grid">
          ${certs.map(branchId => {
            const branch = F28_BRANCHES.find(b => b.id === branchId);
            if (!branch) return '';
            return `
              <div class="prof-cert-item" onclick="CERT_openFromProfile('${branch.id}')" style="border-color:${branch.color}22">
                <div class="prof-cert-emoji">${branch.emoji}</div>
                <div class="prof-cert-label">${branch.label}</div>
                <button class="prof-cert-dl" onclick="event.stopPropagation();CERT_download('${branch.id}','${branch.label}','${branch.emoji}','${branch.color}')">⬇️</button>
              </div>
            `;
          }).join('')}
        </div>
      `}
      ${F28_BRANCHES.filter(b => !certs.includes(b.id)).length > 0 ? `
        <div class="prof-certs-pending">${F28_BRANCHES.filter(b => !certs.includes(b.id)).length} ramas pendientes</div>
      ` : '<div class="prof-certs-complete">🎉 ¡Todas las ramas completadas!</div>'}
    </div>
  `;

  // Boss battles summary
  const beaten = S.bossBeaten || [];
  const bossCard = `
    <div class="prof-gamif-section">
      <div class="prof-gamif-title">⚔️ Boss Battles</div>
      <div class="prof-boss-grid">
        ${F28_BRANCHES.map(branch => {
          const b = beaten.includes(branch.id);
          return `
            <div class="prof-boss-item ${b ? 'prof-boss-won' : ''}" ${b ? '' : `onclick="BOSS_open('${branch.id}')"`} title="${b ? 'Derrotado' : 'Click para intentarlo'}">
              <span>${branch.emoji}</span>
              <span class="prof-boss-status">${b ? '⚔️' : '🔒'}</span>
            </div>
          `;
        }).join('')}
      </div>
      <div class="prof-boss-score">${beaten.length} / ${F28_BRANCHES.length} bosses derrotados</div>
    </div>
  `;

  el.innerHTML = personalityCard + certsCard + bossCard;
}

window.PROF_renderGamifCards = PROF_renderGamifCards;


/* ══════════════════════════════════════════════════════════════════
   HEATMAP DE ACTIVIDAD — Real dates (YYYY-MM-DD)
   Registra módulos completados por fecha real.
══════════════════════════════════════════════════════════════════ */
function HEATMAP_record() {
  const today = new Date().toISOString().slice(0, 10);
  if (!S.activityLog) S.activityLog = {};
  S.activityLog[today] = (S.activityLog[today] || 0) + 1;
  saveState();
}

function HEATMAP_render() {
  const wrap = document.getElementById('st-heatmap-wrap');
  if (!wrap) return;

  const log    = S.activityLog || {};
  const today  = new Date();
  const DAYS   = 364; // 52 semanas
  const cols   = 52;
  const rows   = 7;
  const cs     = 10; // cell size
  const gap    = 2;
  const W      = cols * (cs + gap);
  const H      = rows * (cs + gap) + 22;

  // Generar fecha desde hace 364 días
  function dateStr(daysAgo) {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().slice(0, 10);
  }

  // Alinear inicio al lunes más cercano
  const todayDow = today.getDay(); // 0=dom
  const totalCells = cols * rows;

  let cells = '';
  let maxAct = Math.max(1, ...Object.values(log));

  for (let c = cols - 1; c >= 0; c--) {
    for (let r = rows - 1; r >= 0; r--) {
      const cellIdx = (cols - 1 - c) * rows + (rows - 1 - r);
      const daysAgo = DAYS - cellIdx;
      if (daysAgo < 0) continue;
      const ds   = dateStr(daysAgo);
      const act  = log[ds] || 0;
      const isToday = daysAgo === 0;
      const streak = S.streak > 0 && daysAgo < S.streak;

      let fill;
      if (act === 0 && !isToday) {
        fill = 'rgba(255,255,255,0.04)';
      } else if (streak && act > 0) {
        fill = '#f0b429'; // gold for streak days
      } else if (act >= 3) {
        fill = '#00e5a0';
      } else if (act >= 1) {
        fill = '#00b880';
      } else {
        fill = isToday ? 'rgba(0,229,160,0.15)' : 'rgba(255,255,255,0.04)';
      }

      const x = c * (cs + gap);
      const y = r * (cs + gap) + 20;
      const label = ds + (act > 0 ? ': ' + act + ' módulo' + (act > 1 ? 's' : '') : ': sin actividad');
      cells += `<rect x="${x}" y="${y}" width="${cs}" height="${cs}" rx="2" fill="${fill}"><title>${label}</title></rect>`;
    }
  }

  // Month labels
  let mLabels = '';
  const monthNames = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  let lastMonth = -1;
  for (let c = 0; c < cols; c++) {
    const daysAgo = DAYS - c * rows;
    if (daysAgo < 0) continue;
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    const m = d.getMonth();
    if (m !== lastMonth) {
      lastMonth = m;
      mLabels += `<text x="${c * (cs + gap)}" y="12" font-size="8" fill="#475569">${monthNames[m]}</text>`;
    }
  }

  // Total actividad
  const totalMods = Object.values(log).reduce((a, b) => a + b, 0);
  const activeDays = Object.keys(log).length;

  wrap.innerHTML =
    `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <span style="font-size:12px;color:var(--text2);font-weight:600;">📅 Actividad — últimas 52 semanas</span>
      <span style="font-size:11px;color:var(--text3);">${activeDays} días · ${totalMods} módulos</span>
    </div>` +
    `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;display:block;margin:0 auto;overflow:visible">` +
    mLabels + cells +
    `</svg>` +
    `<div class="st-heatmap-legend">
      <span style="color:var(--text3);font-size:11px">Sin actividad</span>
      <div class="st-hm-sq" style="background:rgba(255,255,255,.04)"></div>
      <div class="st-hm-sq" style="background:#00b880"></div>
      <div class="st-hm-sq" style="background:#00e5a0"></div>
      <div class="st-hm-sq" style="background:#f0b429"></div>
      <span style="color:var(--text3);font-size:11px">Racha activa</span>
    </div>`;
}

window.HEATMAP_record = HEATMAP_record;
window.HEATMAP_render = HEATMAP_render;


/* ══════════════════════════════════════════════════════════════════
   SPEEDRUN MODE — Cronómetro por módulo, récords guardados en S
══════════════════════════════════════════════════════════════════ */
let _speedrunActive   = false;
let _speedrunModId    = null;
let _speedrunStart    = 0;
let _speedrunInterval = null;

function SPEEDRUN_start(modId) {
  // Iniciar módulo en modo speedrun
  _speedrunActive = true;
  _speedrunModId  = modId;
  _speedrunStart  = Date.now();

  // Mostrar timer en lesson screen
  const wrap = document.getElementById('speedrun-timer-wrap');
  if (wrap) wrap.style.display = 'flex';

  if (_speedrunInterval) clearInterval(_speedrunInterval);
  _speedrunInterval = setInterval(() => {
    const secs = Math.floor((Date.now() - _speedrunStart) / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    const el = document.getElementById('speedrun-timer-display');
    if (el) el.textContent = `${m}:${s.toString().padStart(2,'0')}`;
  }, 500);

  startModule(modId);
}

function SPEEDRUN_stop() {
  _speedrunActive = false;
  _speedrunModId  = null;
  if (_speedrunInterval) { clearInterval(_speedrunInterval); _speedrunInterval = null; }
  const wrap = document.getElementById('speedrun-timer-wrap');
  if (wrap) wrap.style.display = 'none';
}

function SPEEDRUN_onComplete(modId) {
  if (!_speedrunActive || _speedrunModId !== modId) return;
  const elapsed = Math.floor((Date.now() - _speedrunStart) / 1000);
  const prev    = (S.speedrunRecords || {})[modId];
  const isNew   = !prev || elapsed < prev;

  if (isNew) {
    if (!S.speedrunRecords) S.speedrunRecords = {};
    S.speedrunRecords[modId] = elapsed;
    saveState();
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    setTimeout(() => toast('⚡ ¡Nuevo récord speedrun!', `${m}:${s.toString().padStart(2,'0')} en este módulo`, 't-success'), 1200);
  }
  // P4-C: tick misión speedrun si < 3 minutos (180 s)
  if (elapsed <= 180 && typeof tickMission === 'function') tickMission('speedrun', 1);
  SPEEDRUN_stop();
}

function SPEEDRUN_renderRecords() {
  const el = document.getElementById('speedrun-records-list');
  if (!el) return;
  const records = S.speedrunRecords || {};
  const entries = Object.entries(records)
    .map(([id, secs]) => ({ id: +id, secs, mod: MODULES.find(m => m && m.id === +id) }))
    .filter(e => e.mod)
    .sort((a, b) => a.secs - b.secs)
    .slice(0, 5);

  if (entries.length === 0) {
    el.innerHTML = '<div style="color:var(--text3);font-size:13px;text-align:center;padding:16px 0;">Aún no tienes récords. Usa ⚡ Speedrun en cualquier módulo.</div>';
    return;
  }

  el.innerHTML = entries.map((e, i) => {
    const m = Math.floor(e.secs / 60);
    const s = e.secs % 60;
    const medals = ['🥇','🥈','🥉','4️⃣','5️⃣'];
    return `<div class="speedrun-record-row">
      <span class="sr-medal">${medals[i]}</span>
      <span class="sr-icon">${e.mod.icon}</span>
      <div class="sr-info">
        <div class="sr-title">${e.mod.title}</div>
        <div class="sr-branch">${e.mod.tag}</div>
      </div>
      <div class="sr-time">${m}:${s.toString().padStart(2,'0')}</div>
    </div>`;
  }).join('');
}

window.SPEEDRUN_start    = SPEEDRUN_start;
window.SPEEDRUN_stop     = SPEEDRUN_stop;
window.SPEEDRUN_onComplete = SPEEDRUN_onComplete;
window.SPEEDRUN_renderRecords = SPEEDRUN_renderRecords;


/* ══════════════════════════════════════════════════════════════════
   SEASONAL EVENTS — Eventos por fecha real del calendario
══════════════════════════════════════════════════════════════════ */
const SEASONAL_EVENTS = [
  {
    id:     'fire_enero',
    name:   '🔥 Reto FIRE de Enero',
    desc:   'Todo el mes de enero — módulos de libertad financiera con XP ×1.5',
    color:  '#e25822',
    accent: '#ff7043',
    xpMult: 1.5,
    check:  (d) => d.getMonth() === 0, // enero
    rewardDesc: 'Cofre Especial + Badge "Guerrero FIRE"',
    modHighlight: ['inversion', 'avanzado'],
    badge:  '🔥 Guerrero FIRE',
  },
  {
    id:     'renta_marzo',
    name:   '💰 Campaña de la Renta',
    desc:   '1-15 de marzo — domina el IRPF antes de la campaña',
    color:  '#1a73e8',
    accent: '#42a5f5',
    xpMult: 1.0,
    check:  (d) => d.getMonth() === 2 && d.getDate() <= 15, // 1-15 marzo
    rewardDesc: 'Cofre Especial + Badge "Maestro Fiscal"',
    modHighlight: ['fiscalidad'],
    badge:  '💸 Maestro Fiscal',
  },
  {
    id:     'blackfriday_nov',
    name:   '🛒 Black Friday Inversor',
    desc:   '25-30 nov — reto anti-consumismo, psicología del gasto',
    color:  '#212121',
    accent: '#ffd600',
    xpMult: 1.0,
    check:  (d) => d.getMonth() === 10 && d.getDate() >= 25, // 25-30 nov
    rewardDesc: 'Cofre Especial + Badge "Inversor Consciente"',
    modHighlight: ['psicologia'],
    badge:  '🧠 Inversor Consciente',
  },
  {
    id:     'balance_dic',
    name:   '🎁 Balance Financiero Anual',
    desc:   'Diciembre — revisa tu año y calcula tu patrimonio neto',
    color:  '#2e7d32',
    accent: '#66bb6a',
    xpMult: 1.0,
    check:  (d) => d.getMonth() === 11, // diciembre
    rewardDesc: 'Cofre Especial + Badge "Planificador del Año"',
    modHighlight: ['fundamentos', 'avanzado'],
    badge:  '📊 Planificador del Año',
  },
];

function SEA_getActiveEvent() {
  const now = new Date();
  return SEASONAL_EVENTS.find(e => e.check(now)) || null;
}

function SEA_render() {
  const banner = document.getElementById('seasonal-banner');
  if (!banner) return;
  const ev = SEA_getActiveEvent();
  if (!ev) { banner.style.display = 'none'; return; }

  banner.style.display = 'block';
  banner.innerHTML = `
    <div class="seasonal-banner-inner" style="--sea-color:${ev.color};--sea-accent:${ev.accent};">
      <div class="sea-left">
        <div class="sea-name">${ev.name}</div>
        <div class="sea-desc">${ev.desc}</div>
        ${ev.xpMult > 1 ? `<div class="sea-mult-badge">⚡ XP ×${ev.xpMult}</div>` : ''}
      </div>
      <button class="sea-cta-btn" onclick="SEA_openDetail()">Ver reto →</button>
    </div>`;
}

function SEA_openDetail() {
  const ev = SEA_getActiveEvent();
  if (!ev) return;
  const rewardKey = ev.id + '_' + new Date().getFullYear();
  const claimed   = (S.seenSeasonalRewards || []).includes(rewardKey);

  const html = `
    <div style="padding:24px;text-align:center;">
      <div style="font-size:40px;margin-bottom:12px;">${ev.name.split(' ')[0]}</div>
      <div style="font-size:20px;font-weight:700;margin-bottom:8px;">${ev.name}</div>
      <div style="color:var(--text2);font-size:14px;margin-bottom:20px;">${ev.desc}</div>
      ${ev.xpMult > 1 ? `<div class="sea-modal-mult">⚡ XP ×${ev.xpMult} activo todo el evento</div>` : ''}
      <div class="sea-reward-box">
        <div style="font-size:13px;font-weight:600;color:var(--text1);">🎁 Recompensa al completar el reto:</div>
        <div style="font-size:13px;color:var(--text2);margin-top:4px;">${ev.rewardDesc}</div>
      </div>
      ${claimed
        ? `<div class="sea-claimed">✅ ¡Recompensa reclamada!</div>`
        : `<button class="btn btn-primary" style="margin-top:20px;width:100%;" onclick="SEA_claimReward('${rewardKey}','${ev.badge}')">🎁 Reclamar recompensa del evento</button>`
      }
      <button class="btn btn-ghost" style="margin-top:12px;width:100%;" onclick="closeModal('m-sea')">Cerrar</button>
    </div>`;

  let modal = document.getElementById('m-sea');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-sea';
    modal.className = 'modal-overlay';
    modal.innerHTML = `<div class="modal-card" style="max-width:400px;">${html}</div>`;
    document.body.appendChild(modal);
  } else {
    modal.querySelector('.modal-card').innerHTML = html;
  }
  openModal('m-sea');
}

function SEA_claimReward(rewardKey, badge) {
  if (!S.seenSeasonalRewards) S.seenSeasonalRewards = [];
  if (S.seenSeasonalRewards.includes(rewardKey)) return;
  S.seenSeasonalRewards.push(rewardKey);
  // Dar cofre especial (gold — 'epic' no existe en CHEST_REWARDS)
  if (!S.chestsAvailable) S.chestsAvailable = [];
  S.chestsAvailable.push({ type: 'gold', earnedAt: Date.now() });
  // Dar XP bonus
  S.xp += 300;
  if (typeof F34_onXPGained === 'function') F34_onXPGained(300);
  saveState();
  checkAchievements();
  closeModal('m-sea');
  toast('🎁 ¡Recompensa reclamada!', badge + ' · +300 XP · Cofre Oro', 't-success');
  if (typeof F44_render === 'function') F44_render();
}

// Hook: aplicar multiplicador de evento al ganar XP (solo para módulos)
function SEA_getXPMult() {
  const ev = SEA_getActiveEvent();
  return ev ? (ev.xpMult || 1) : 1;
}

window.SEA_render      = SEA_render;
window.SEA_openDetail  = SEA_openDetail;
window.SEA_claimReward = SEA_claimReward;
window.SEA_getXPMult   = SEA_getXPMult;

function _renderGroupMissionEpic() {
  const el = document.getElementById('challenge-card') || document.getElementById('group-mission-card');
  if (!el) return;
  const S_ = window.S || {};
  const goal = 100000;
  const progress = Math.min(goal, (S_._groupXP || 0) + (S_.xp || 0));
  const pct = Math.round((progress / goal) * 100);
  const daysLeft = 7 - (new Date().getDay());
  const msg = pct < 25 ? '🌱 Está comenzando. Tu XP suma al equipo.'
            : pct < 50 ? '🔥 ¡Vamos por buen camino! Cada módulo cuenta.'
            : pct < 75 ? '⚡ Más de la mitad. El objetivo está cerca.'
            : pct < 100 ? '🎯 ¡A por el último empujón! Faltan pocas horas.'
            : '🏆 ¡META CONSEGUIDA! Todos ganan recompensa grupal.';
  el.innerHTML = `
    <div style="padding:18px 20px;background:linear-gradient(135deg,rgba(108,99,255,.12),rgba(245,166,35,.08));border:1px solid rgba(108,99,255,.2);border-radius:18px;position:relative;overflow:hidden;">
      <div style="position:absolute;top:-20px;right:-20px;font-size:80px;opacity:.08;">🌍</div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;position:relative;">
        <div style="font-size:22px;">🌍</div>
        <div style="flex:1;">
          <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:15px;color:var(--text1);">Misión Global de la Semana</div>
          <div style="font-size:11px;color:var(--text2);">${daysLeft} días restantes · Objetivo colectivo</div>
        </div>
        <div style="background:rgba(245,166,35,.15);border:1px solid rgba(245,166,35,.3);padding:4px 10px;border-radius:99px;font-size:10px;font-weight:800;color:#f5a623;">+500 XP</div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text2);margin-bottom:6px;">
        <span>${progress.toLocaleString('es')} XP</span>
        <span style="font-weight:700;color:var(--text1);">${goal.toLocaleString('es')} XP</span>
      </div>
      <div style="height:12px;background:rgba(0,0,0,.3);border-radius:99px;overflow:hidden;position:relative;">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#6c63ff,#f5a623);border-radius:99px;transition:width .6s;box-shadow:0 0 12px rgba(245,166,35,.4);position:relative;">
          ${pct > 5 ? `<div style="position:absolute;right:4px;top:50%;transform:translateY(-50%);font-size:10px;font-weight:800;color:#000;">${pct}%</div>` : ''}
        </div>
      </div>
      <div style="margin-top:12px;font-size:12px;color:var(--text2);text-align:center;font-style:italic;">${msg}</div>
    </div>`;
}
window._renderGroupMissionEpic = _renderGroupMissionEpic;


/* ══════════════════════════════════════════════════════════════════
   RUTA — Quiz de 3 preguntas para personalizar la ruta de aprendizaje
   ─────────────────────────────────────────────────────────────────
   · 3 preguntas: nivel actual, objetivo y área de enfoque
   · Resultado: actualiza S.goal, S.investorLevel, S.suggestedBranchId,
     S.suggestedModuleId y re-renderiza el home
══════════════════════════════════════════════════════════════════ */

var _ruta_answers = {};
var _ruta_step    = 0;

var RUTA_STEPS = [
  {
    q: '¿Cuál es tu situación financiera ahora?',
    key: 'level',
    opts: [
      { label: '🌱 Sin ahorros todavía',     val: 'zero' },
      { label: '💰 Algo ahorrado, sin invertir', val: 'saving' },
      { label: '📈 Ya invierto algo',         val: 'investing' },
      { label: '🚀 Inversor activo',          val: 'active' },
    ]
  },
  {
    q: '¿Cuál es tu objetivo principal?',
    key: 'goal',
    opts: [
      { label: '🏝️ Libertad financiera',      val: 'freedom' },
      { label: '🔄 Salir de deudas',          val: 'debt' },
      { label: '🏠 Comprar casa',             val: 'house' },
      { label: '📊 Construir cartera',        val: 'invest' },
    ]
  },
  {
    q: '¿Qué quieres aprender primero?',
    key: 'branch',
    opts: [
      { label: '🏗️ Fundamentos del dinero',  val: 'fundamentos' },
      { label: '📈 Inversión y bolsa',        val: 'inversion' },
      { label: '🔄 Gestión de deudas',        val: 'deuda' },
      { label: '🧠 Psicología financiera',    val: 'psicologia' },
    ]
  }
];

function RUTA_openQuiz() {
  _ruta_answers = {};
  _ruta_step    = 0;

  var modal = document.createElement('div');
  modal.id  = 'ruta-quiz-overlay';
  modal.className = 'ruta-overlay';
  modal.innerHTML = '<div class="ruta-modal" id="ruta-modal-inner"></div>';
  modal.addEventListener('click', function(e) {
    if (e.target === modal) RUTA_closeQuiz();
  });
  document.body.appendChild(modal);
  RUTA_renderStep();
  requestAnimationFrame(function() { modal.classList.add('ruta-overlay-in'); });
}

function RUTA_closeQuiz() {
  var overlay = document.getElementById('ruta-quiz-overlay');
  if (overlay) {
    overlay.classList.remove('ruta-overlay-in');
    setTimeout(function() { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 260);
  }
}

function RUTA_renderStep() {
  var inner = document.getElementById('ruta-modal-inner');
  if (!inner) return;

  var step = RUTA_STEPS[_ruta_step];
  var progressPct = Math.round((_ruta_step / RUTA_STEPS.length) * 100);

  inner.innerHTML = `
    <div class="ruta-header">
      <div class="ruta-progress-bar"><div class="ruta-progress-fill" style="width:${progressPct}%"></div></div>
      <div class="ruta-step-lbl">${_ruta_step + 1} / ${RUTA_STEPS.length}</div>
      <button class="ruta-close-btn" onclick="RUTA_closeQuiz()">✕</button>
    </div>
    <div class="ruta-question">${step.q}</div>
    <div class="ruta-opts">
      ${step.opts.map(function(o) {
        return '<button class="ruta-opt" onclick="RUTA_pick(\'' + step.key + '\',\'' + o.val + '\',this)">' + o.label + '</button>';
      }).join('')}
    </div>
    ${_ruta_step > 0 ? '<button class="ruta-back-btn" onclick="RUTA_back()">← Anterior</button>' : ''}`;
}

function RUTA_pick(key, val, btn) {
  _ruta_answers[key] = val;
  var opts = document.querySelectorAll('.ruta-opt');
  opts.forEach(function(o) { o.classList.remove('ruta-opt-sel'); });
  if (btn) btn.classList.add('ruta-opt-sel');

  setTimeout(function() {
    _ruta_step++;
    if (_ruta_step < RUTA_STEPS.length) {
      RUTA_renderStep();
    } else {
      RUTA_finish();
    }
  }, 280);
}

function RUTA_back() {
  if (_ruta_step > 0) {
    _ruta_step--;
    RUTA_renderStep();
  }
}

function RUTA_finish() {
  var level  = _ruta_answers.level  || S.investorLevel || 'zero';
  var goal   = _ruta_answers.goal   || S.goal          || 'freedom';
  var branch = _ruta_answers.branch || null;

  // Goal label
  var goalLabels = {
    freedom: '🏝️ Libertad financiera', debt: '🔄 Salir de deudas',
    house:   '🏠 Comprar casa',         invest: '📊 Construir cartera',
    retire:  '🎯 Jubilación',           emergency: '🛡️ Fondo emergencia',
  };

  S.investorLevel = level;
  S.goal          = goal;
  S.goalLabel     = goalLabels[goal] || S.goalLabel || '🏝️ Libertad financiera';

  // Si el usuario eligió rama explícitamente, usar esa; si no, calcularla
  if (branch) {
    S.suggestedBranchId = branch;
  } else if (typeof _ob_getSuggestedBranch === 'function') {
    S.suggestedBranchId = _ob_getSuggestedBranch();
  }

  // Calcular módulo sugerido dentro de la rama elegida
  if (typeof F28_BRANCHES !== 'undefined' && typeof MODULES !== 'undefined') {
    var b = F28_BRANCHES.find(function(x) { return x.id === S.suggestedBranchId; });
    if (b) {
      var completedSet = new Set(S.completedMods || []);
      var nextMod = b.mods.find(function(id) { return !completedSet.has(id); });
      if (nextMod != null) S.suggestedModuleId = nextMod;
    }
  }

  if (typeof _ob_buildHeroMsg === 'function') S.onboardHeroMsg = _ob_buildHeroMsg();

  if (typeof saveState === 'function') saveState();

  RUTA_closeQuiz();

  if (typeof renderLearningPathCard === 'function') renderLearningPathCard();
  if (typeof _f24_renderHeroMsg === 'function') _f24_renderHeroMsg();
  if (typeof _f24_highlightSuggestedModule === 'function') _f24_highlightSuggestedModule();

  var bData = (typeof F28_BRANCHES !== 'undefined') ? F28_BRANCHES.find(function(x) { return x.id === S.suggestedBranchId; }) : null;
  if (typeof toast === 'function') {
    toast('🎯 Ruta actualizada', bData ? ('Tu ruta: ' + bData.label) : 'Ruta personalizada lista', 't-success');
  }
}

window.RUTA_openQuiz  = RUTA_openQuiz;


/* ══════════════════════════════════════════════════════════════════
   MARKET — Datos de mercado reales vía Cloudflare Function → Yahoo Finance
   ─────────────────────────────────────────────────────────────────
   · Fetches batch quotes para todos los tickers al cargar la bolsa
   · Aplica el % de cambio real del día a los precios simulados
   · Fetches historial real (1 mes de cierres diarios) al abrir un stock
   · Cache 15 min en memoria para quotes, 1h para historial
   · Fallback silencioso a simulación si la API no está disponible
══════════════════════════════════════════════════════════════════ */

var MARKET = (function() {

  var _cache     = null;  // { ts: Date.now(), data: {appTicker: {price,changePct,...}} }
  var _histCache = {};    // { appTicker: { ts, closes: [] } }
  var _CACHE_TTL  = 15 * 60 * 1000;  // 15 min
  var _HIST_TTL   = 60 * 60 * 1000;  // 1 hora

  // app ticker → Yahoo Finance symbol
  var _MAP = {
    AAPL:  'AAPL',
    MSFT:  'MSFT',
    NVDA:  'NVDA',
    TSLA:  'TSLA',
    GOOGL: 'GOOGL',
    META:  'META',
    AMZN:  'AMZN',
    JNJ:   'JNJ',
    BRK:   'BRK-B',
    KO:    'KO',
    NVO:   'NVO',
    PFE:   'PFE',
    VICI:  'VICI',
    BTC:   'BTC-USD',
    ETH:   'ETH-USD',
    GOLD:  'GC=F',
    VUSA:  'VUSA.L',
    IWDA:  'IWDA.L',
    EQQQ:  'EQQQ.L',
    SHEL:  'SHEL.L',
    EMIM:  'EMIM.L',
    SAN:   'SAN.MC',
    ITX:   'ITX.MC',
    IBE:   'IBE.MC',
    TEF:   'TEF.MC',
    REP:   'REP.MC',
    AMS:   'AMS.MC',
    LVMH:  'MC.PA',
    NESN:  'NESN.SW',
    XDWD:  'XDWD.DE',
  };

  // Reverse map: yahoo symbol → app ticker
  var _REV = {};
  Object.keys(_MAP).forEach(function(app) { _REV[_MAP[app]] = app; });

  function init() {
    _fetchQuotes();
    // Refresh cada 15 min si la ventana está activa
    setInterval(function() {
      if (!document.hidden) _fetchQuotes();
    }, _CACHE_TTL);
  }

  function _fetchQuotes() {
    if (_cache && (Date.now() - _cache.ts) < _CACHE_TTL) return;

    var yahooSyms = Object.values(_MAP).join(',');
    fetch('/api/market?symbols=' + encodeURIComponent(yahooSyms))
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(json) {
        if (!json || !json.ok || !json.data) return;

        _cache = { ts: Date.now(), data: {} };
        Object.keys(json.data).forEach(function(yahooSym) {
          var appTicker = _REV[yahooSym];
          if (!appTicker) return;
          var q = json.data[yahooSym];
          _cache.data[appTicker] = q;

          // Aplicar % de cambio real al precio base simulado
          var stock = (typeof STOCKS !== 'undefined') && STOCKS.find(function(s) { return s.ticker === appTicker; });
          var base = (stock && stock.price) || (GAME.stockPrices && GAME.stockPrices[appTicker]) || 1;
          var newPrice = +(base * (1 + (q.changePct || 0) / 100)).toFixed(2);
          if (newPrice > 0 && typeof GAME !== 'undefined') {
            GAME.stockPrices[appTicker] = newPrice;
            if (GAME.priceHistory && GAME.priceHistory[appTicker]) {
              GAME.priceHistory[appTicker].push(newPrice);
              if (GAME.priceHistory[appTicker].length > 60) GAME.priceHistory[appTicker].shift();
            }
          }
        });

        GAME._realPrices = true;
        _updateBadge();
      })
      .catch(function(e) {
        console.warn('[MARKET] quotes error:', e);
      });
  }

  function fetchHistory(appTicker, onDone) {
    // Si hay cache válido, devolver inmediatamente
    var cached = _histCache[appTicker];
    if (cached && (Date.now() - cached.ts) < _HIST_TTL) {
      if (onDone) onDone(cached.closes);
      return;
    }

    var yahooSym = _MAP[appTicker];
    if (!yahooSym) return;

    fetch('/api/market-history?symbol=' + encodeURIComponent(yahooSym) + '&range=1mo')
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(json) {
        if (!json || !json.ok || !json.closes || json.closes.length < 5) return;
        _histCache[appTicker] = { ts: Date.now(), closes: json.closes };
        // Actualizar priceHistory con datos reales (hasta 60 puntos)
        if (typeof GAME !== 'undefined' && GAME.priceHistory) {
          GAME.priceHistory[appTicker] = json.closes.slice(-60);
        }
        if (onDone) onDone(json.closes);
      })
      .catch(function() { /* silencioso */ });
  }

  function getQuote(appTicker) {
    return (_cache && _cache.data && _cache.data[appTicker]) || null;
  }

  function _updateBadge() {
    var el = document.getElementById('mkt-real-badge');
    if (el) el.style.display = GAME._realPrices ? '' : 'none';
    // Actualizar lista si está visible
    var portScreen = document.getElementById('s-portfolio');
    if (portScreen && portScreen.classList.contains('active')) {
      if (typeof renderStockList === 'function') renderStockList(GAME.currentStockFilter || 'all');
    }
  }

  return { init: init, fetchHistory: fetchHistory, getQuote: getQuote };
})();

window.MARKET = MARKET;
window.RUTA_closeQuiz = RUTA_closeQuiz;
window.RUTA_pick      = RUTA_pick;
window.RUTA_back      = RUTA_back;
window.RUTA_finish    = RUTA_finish;

/* ══════════════════════════════════════════════════════════════════
   AUDIO — Modo lectura en voz alta (Web Speech API)
   Botón 🔊 en el top-nav de la pantalla de lección.
   Lee título, intro, bullets, párrafos y datos clave del paso actual.
══════════════════════════════════════════════════════════════════ */
const AUDIO = (function() {
  var _reading = false;
  var _btn = null;

  function _getBtn() {
    return _btn || (_btn = document.getElementById('audio-read-btn'));
  }

  function _setReading(v) {
    _reading = v;
    var b = _getBtn();
    if (!b) return;
    b.textContent = v ? '⏸' : '🔊';
    b.classList.toggle('audio-reading', v);
    b.title = v ? 'Pausar lectura' : 'Leer en voz alta';
  }

  function stop() {
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
    _setReading(false);
  }

  function _stripHtml(str) {
    return (str || '').replace(/<[^>]+>/g, '').replace(/&[a-zA-Z]+;/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function _extractText(step) {
    if (!step) return '';
    var parts = [];
    if (step.title)  parts.push(step.title);
    if (step.intro)  parts.push(step.intro);
    if (step.blocks && step.blocks.length) {
      step.blocks.forEach(function(b) {
        if (b.h) parts.push(b.h);
        if (b.p) parts.push(b.p);
        if (b.t === 'formula' && b.l) parts.push('Fórmula: ' + b.l);
        if (b.t === 'stats' && b.items) b.items.forEach(function(s) { parts.push(s.l + ': ' + s.v); });
        if (b.t === 'hl' && b.p) parts.push((b.label ? b.label + '. ' : '') + b.p);
      });
    }
    if (step.bullets && step.bullets.length) step.bullets.forEach(function(b) { parts.push(b); });
    if (step.p)    parts.push(step.p);
    if (step.fact) parts.push('Dato clave: ' + step.fact);
    if (step.type === 'quiz') {
      if (step.q) parts.push(step.q);
      if (step.opts) step.opts.forEach(function(o, i) { parts.push('ABCD'[i] + ': ' + o.t); });
    }
    return parts.map(_stripHtml).filter(Boolean).join('. ');
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) {
      if (typeof toast === 'function') toast('❌ Sin soporte', 'Tu navegador no soporta síntesis de voz', 't-warn');
      return;
    }
    stop();
    if (!text) return;
    var utt = new SpeechSynthesisUtterance(text);
    utt.lang  = 'es-ES';
    utt.rate  = 0.93;
    utt.pitch = 1.0;
    utt.onstart = function() { _setReading(true); };
    utt.onend   = function() { _setReading(false); };
    utt.onerror = function() { _setReading(false); };
    speechSynthesis.speak(utt);
  }

  function toggle() {
    if (_reading) { stop(); return; }
    if (typeof S === 'undefined' || !S.currentMod) return;
    var step = S.currentMod.steps[S.step];
    speak(_extractText(step));
  }

  return { stop: stop, speak: speak, toggle: toggle };
})();

window.AUDIO = AUDIO;

/* ══════════════════════════════════════════════════════════════════
   AVATAR_AI — Avatares generados con IA via DiceBear API
   Sprites pixel-art únicos por nombre de usuario. Primera carga
   desde CDN (instant), cacheados en localStorage para offline PWA.
   Fallback: gradiente procedural canvas si no hay red.
   Estilo: pixel-art (RPG financiero). Sin API key, sin coste.
══════════════════════════════════════════════════════════════════ */
const AVATAR_AI = (function() {
  var STYLE = 'pixel-art';
  var BASE  = 'https://api.dicebear.com/9.x/' + STYLE + '/svg';
  var BG    = '07101f';

  // Mapa nombre normalizado → sprite local
  var SPRITE_MAP = {
    'novato':     'icons/Sprites/novato.png',
    'aprendiz':   'icons/Sprites/novato.png',
    'estratega':  'icons/Sprites/estratega.png',
    'visionario': 'icons/Sprites/visionario.png',
    'cristal':    'icons/Sprites/cristal.png',
    'llama':      'icons/Sprites/llama.png',
    'cohete':     'icons/Sprites/cohete.png',
    'dragon':     'icons/Sprites/dragon.png',
    'rayo':       'icons/Sprites/rayo.png',
    'relampago':  'icons/Sprites/rayo.png'
  };

  function _normalize(name) {
    return name.trim().toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  function _key(name) {
    return 'fl_av3_' + _normalize(name).slice(0, 24);
  }

  function _url(name) {
    return BASE + '?seed=' + encodeURIComponent(name) +
      '&backgroundColor=' + BG + '&scale=88&radius=12';
  }

  // Redimensiona al máx 300px y elimina píxeles claros (R,G,B > 220)
  function _removeWhiteBg(src, cb) {
    var img = new Image();
    img.onload = function() {
      var MAX = 300;
      var ratio = Math.min(MAX / (img.naturalWidth || img.width), MAX / (img.naturalHeight || img.height), 1);
      var w = Math.round((img.naturalWidth  || img.width)  * ratio) || 1;
      var h = Math.round((img.naturalHeight || img.height) * ratio) || 1;
      var c = document.createElement('canvas');
      c.width = w; c.height = h;
      var ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      try {
        var data = ctx.getImageData(0, 0, w, h);
        var d = data.data;
        for (var i = 0; i < d.length; i += 4) {
          if (d[i] > 220 && d[i+1] > 220 && d[i+2] > 220) d[i+3] = 0;
        }
        ctx.putImageData(data, 0, 0);
        cb(c.toDataURL('image/png'));
      } catch(e) { cb(src); }
    };
    img.onerror = function() { cb(src); };
    img.src = src;
  }

  // Inyecta sprite (face-crop en nav, face-crop en prof-av)
  function _injectSprite(src) {
    var targets = [
      { id: 'home-nav-av', sz: '32px', pos: 'center 10%' },
      { id: 'prof-av',     sz: '76px', pos: 'center 12%' }
    ];
    targets.forEach(function(t) {
      var el = document.getElementById(t.id);
      if (!el) return;
      var img = el.querySelector('.fl-gen-av');
      if (!img) {
        img = document.createElement('img');
        img.className = 'fl-gen-av';
        img.alt = '';
        el.insertBefore(img, el.firstChild);
      }
      img.src = src;
      img.style.cssText = 'display:block;width:' + t.sz + ';height:' + t.sz
        + ';border-radius:50%;object-fit:cover;object-position:' + t.pos
        + ';pointer-events:none;image-rendering:pixelated;';
      Array.from(el.childNodes).forEach(function(n) {
        if (n.nodeType === 3) n.textContent = '';
      });
    });
  }

  // Inyecta DiceBear (círculo estándar)
  function _inject(src) {
    [['home-nav-av', '32px'], ['prof-av', '76px']].forEach(function(t) {
      var el = document.getElementById(t[0]);
      if (!el) return;
      var img = el.querySelector('.fl-gen-av');
      if (!img) {
        img = document.createElement('img');
        img.className = 'fl-gen-av';
        img.alt = '';
        img.style.cssText = 'display:block;border-radius:50%;object-fit:cover;pointer-events:none;';
        el.insertBefore(img, el.firstChild);
      }
      img.src = src;
      img.style.width = img.style.height = t[1];
      Array.from(el.childNodes).forEach(function(n) {
        if (n.nodeType === 3) n.textContent = '';
      });
    });
  }

  function _fallback(name) {
    var PALS = [
      ['#00e5a0','#0091ff'],['#c084fc','#f87171'],['#fbbf24','#fb923c'],
      ['#60a5fa','#818cf8'],['#34d399','#fbbf24'],['#f87171','#c084fc']
    ];
    var h = 5381;
    for (var i = 0; i < name.length; i++) h = ((h << 5) + h + name.charCodeAt(i)) | 0;
    h = Math.abs(h);
    var pal = PALS[h % PALS.length];
    var sz = 128;
    var c = document.createElement('canvas'); c.width = c.height = sz;
    var x = c.getContext('2d');
    x.fillStyle = '#07101f'; x.fillRect(0, 0, sz, sz);
    [[.3,.3,pal[0]],[.65,.55,pal[1]],[.45,.7,pal[0]]].forEach(function(o) {
      var g = x.createRadialGradient(o[0]*sz,o[1]*sz,0,o[0]*sz,o[1]*sz,sz*.42);
      g.addColorStop(0, o[2]+'99'); g.addColorStop(1,'transparent');
      x.fillStyle = g; x.fillRect(0,0,sz,sz);
    });
    x.shadowColor = pal[0]; x.shadowBlur = 14;
    x.fillStyle = 'rgba(255,255,255,.9)';
    x.font = 'bold 52px Syne,Arial'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(name[0].toUpperCase(), sz/2, sz/2+2);
    return c.toDataURL();
  }

  function apply(name) {
    if (!name) return;
    var key = _normalize(name);
    var spritePath = SPRITE_MAP[key];

    if (spritePath) {
      var cKey = 'fl_sprite2_' + key;
      try {
        var cached = localStorage.getItem(cKey);
        if (cached) { _injectSprite(cached); return; }
      } catch(e) {}
      // todos los sprites necesitan eliminar fondo blanco
      _removeWhiteBg(spritePath, function(dataUrl) {
        _injectSprite(dataUrl);
        try { localStorage.setItem(cKey, dataUrl); } catch(e) {}
      });
      return;
    }

    // Fallback DiceBear para nombres no mapeados
    var lsKey = _key(name);
    try {
      var cached2 = localStorage.getItem(lsKey);
      if (cached2) { _inject(cached2); return; }
    } catch(e) {}
    var direct = _url(name);
    _inject(direct);
    fetch(direct).then(function(r) {
      return r.ok ? r.text() : Promise.reject();
    }).then(function(svg) {
      try {
        var encoded = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        localStorage.setItem(lsKey, encoded);
        _inject(encoded);
      } catch(e) {}
    }).catch(function() {
      _inject(_fallback(name));
    });
  }

  // Procesa novato al iniciar para que el grid muestre bg transparente
  function init() {
    var cKey = 'fl_sprite2_novato';
    function updateGridImgs(src) {
      document.querySelectorAll('img.av-sprite[data-sprite="novato"]').forEach(function(img) {
        img.src = src;
      });
    }
    try {
      var cached = localStorage.getItem(cKey);
      if (cached) { updateGridImgs(cached); return; }
    } catch(e) {}
    _removeWhiteBg('icons/Sprites/novato.png', function(dataUrl) {
      try { localStorage.setItem(cKey, dataUrl); } catch(e) {}
      updateGridImgs(dataUrl);
    });
  }

  return { apply: apply, url: _url, init: init };
})();
window.AVATAR_AI = AVATAR_AI;
// Procesar sprites que necesitan bg removal en cuanto el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { AVATAR_AI.init(); });
} else {
  setTimeout(function() { AVATAR_AI.init(); }, 80);
}

/* ══════════════════════════════════════════════════════════════════
   MICRO-ANIMATIONS — XP counter, streak glow, home stagger
══════════════════════════════════════════════════════════════════ */

// Count-up animation para el contador de XP en el nav
function _animateNum(el, from, to, ms) {
  if (!el || from === to) return;
  ms = ms || 650;
  var start = performance.now();
  var diff  = to - from;
  function step(now) {
    var t = Math.min((now - start) / ms, 1);
    var eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
    el.textContent = Math.round(from + diff * eased).toLocaleString('es') + ' XP';
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = to.toLocaleString('es') + ' XP';
  }
  requestAnimationFrame(step);
}
window._animateNum = _animateNum;

// Stagger de tarjetas al entrar al home (solo primera vez por visita)
var _homeStaggerCount = 0;
function _staggerHomeItems() {
  var inner = document.querySelector('.home-inner');
  if (!inner) return;
  var items = Array.from(inner.children).filter(function(el) {
    return el.offsetHeight > 0; // solo visibles
  });
  items.forEach(function(el, i) {
    el.style.animationDelay = (i * 48) + 'ms';
    el.classList.remove('home-item-in');
    void el.offsetWidth; // force reflow
    el.classList.add('home-item-in');
  });
  _homeStaggerCount++;
}
window._staggerHomeItems = _staggerHomeItems;

/* ══════════════════════════════════════════════════════════════════
   RIPPLE — Efecto de onda en todos los botones .btn al pulsar
   El CSS (.btn-ripple / @keyframes rippleAnim) ya existe en app.css.
   Este listener delega en document para cubrir botones inyectados
   dinámicamente en innerHTML.
══════════════════════════════════════════════════════════════════ */
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.btn');
  if (!btn) return;
  var rect = btn.getBoundingClientRect();
  var size = Math.max(rect.width, rect.height) * 1.8;
  var x = e.clientX - rect.left - size / 2;
  var y = e.clientY - rect.top  - size / 2;
  var ripple = document.createElement('span');
  ripple.className = 'btn-ripple';
  ripple.style.cssText = 'width:' + size + 'px;height:' + size + 'px;left:' + x + 'px;top:' + y + 'px;';
  btn.appendChild(ripple);
  setTimeout(function() { ripple.remove(); }, 600);
}, { passive: true });

/* ══════════════════════════════════════════════════════════════════
   F35 — MISIONES DIARIAS (3 simultáneas)
   ─────────────────────────────────────────────────────────────────
   3 misiones distintas cada día (module, quiz, xp).
   Se generan deterministas por fecha. Cada una tiene su propio
   progreso y premio. Completar las 3 da un cofre bonus.
══════════════════════════════════════════════════════════════════ */

var F35_QUEST_DEFS = [
  { type:'module', icon:'📚', label:'Módulos',  gen:function(rng){ var n=[2,3,2,3,2][Math.floor(rng()*5)]; return { target:n, xp:n*40, desc:'Completa <strong>'+n+' módulo'+(n>1?'s':'')+'</strong> hoy' }; } },
  { type:'quiz',   icon:'🎯', label:'Quizzes',  gen:function(rng){ var n=[5,7,5,10,7][Math.floor(rng()*5)]; return { target:n, xp:n*12, desc:'Acierta <strong>'+n+' quiz'+(n>1?'zes':'')+'</strong> hoy' }; } },
  { type:'xp',     icon:'⚡', label:'XP',        gen:function(rng){ var t=[80,100,80,150,100][Math.floor(rng()*5)]; return { target:t, xp:Math.round(t*0.4), desc:'Gana <strong>'+t+' XP</strong> hoy' }; } },
];

function _f35_rng(seed) {
  var s = (seed >>> 0);
  return function() { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function _f35_todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function F35_getOrGenerate() {
  var today = _f35_todayKey();
  if (S.dailyQuestsKey === today && Array.isArray(S.dailyQuests) && S.dailyQuests.length === 3) {
    return S.dailyQuests;
  }
  var seed = parseInt(today.replace(/-/g,''), 10) % 9999999;
  var rng  = _f35_rng(seed);
  var quests = F35_QUEST_DEFS.map(function(def) {
    var g = def.gen(_f35_rng(seed + def.type.charCodeAt(0)));
    return { type:def.type, icon:def.icon, label:def.label, desc:g.desc, target:g.target, xpReward:g.xp, progress:0, done:false, claimed:false };
  });
  S.dailyQuests    = quests;
  S.dailyQuestsKey = today;
  S.dailyQuestsBonus = false;
  saveState();
  return quests;
}

function F35_render() {
  var el = document.getElementById('f35-quest-board');
  if (!el) return;
  var quests = F35_getOrGenerate();
  var today  = _f35_todayKey();
  if (S.dailyQuestsKey !== today) { S.dailyQuests = null; quests = F35_getOrGenerate(); }

  var allDone    = quests.every(function(q) { return q.done; });
  var allClaimed = quests.every(function(q) { return q.claimed; });

  var bonusHTML = '';
  if (allDone && !S.dailyQuestsBonus) {
    bonusHTML = '<button class="f35-bonus-btn f35-pulse" onclick="F35_claimBonus()">🎁 Reclamar cofre bonus</button>';
  } else if (S.dailyQuestsBonus) {
    bonusHTML = '<div class="f35-bonus-done">✅ Cofre bonus reclamado · Vuelve mañana</div>';
  } else {
    bonusHTML = '<div class="f35-bonus-hint">Completa las 3 misiones para ganar un cofre bonus 🎁</div>';
  }

  el.innerHTML = '<div class="f35-wrap">'
    + '<div class="f35-header"><span class="f35-title">🗓️ Misiones del Día</span>'
    + '<span class="f35-sub">' + quests.filter(function(q){return q.done;}).length + '/3 completadas</span></div>'
    + '<div class="f35-list">'
    + quests.map(function(q, i) {
        var pct = q.target > 0 ? Math.min(100, Math.round((q.progress / q.target) * 100)) : 0;
        var cls = q.claimed ? 'f35-quest f35-quest-done' : (q.done ? 'f35-quest f35-quest-ready' : 'f35-quest');
        var actionHTML = q.claimed
          ? '<span class="f35-claimed-lbl">✅ +' + q.xpReward + ' XP</span>'
          : (q.done
            ? '<button class="f35-claim-btn f35-pulse" onclick="F35_claimQuest(' + i + ')">Reclamar +' + q.xpReward + ' XP</button>'
            : '<div class="f35-prog"><div class="f35-prog-fill" style="width:' + pct + '%;"></div></div><span class="f35-prog-lbl">' + q.progress + '/' + q.target + (q.type==='xp'?' XP':'') + ' · +' + q.xpReward + ' XP</span>');
        return '<div class="' + cls + '">'
          + '<span class="f35-icon">' + q.icon + '</span>'
          + '<div class="f35-info"><div class="f35-desc">' + q.desc + '</div>' + actionHTML + '</div>'
          + '</div>';
      }).join('')
    + '</div>'
    + '<div class="f35-bonus-row">' + bonusHTML + '</div>'
    + '</div>';
}

function F35_claimQuest(idx) {
  var quests = S.dailyQuests;
  if (!quests || !quests[idx]) return;
  var q = quests[idx];
  if (!q.done || q.claimed) return;
  q.claimed = true;
  S.xp += q.xpReward;
  if (typeof F34_onXPGained === 'function') F34_onXPGained(q.xpReward);
  spawnXP('+' + q.xpReward + ' XP');
  if (typeof SFX !== 'undefined' && SFX.correct) SFX.correct();
  saveState();
  if (typeof checkAchievements === 'function') checkAchievements();
  F35_render();
}

function F35_claimBonus() {
  if (!S.dailyQuests || !S.dailyQuests.every(function(q){return q.done;})) return;
  if (S.dailyQuestsBonus) return;
  S.dailyQuestsBonus = true;
  if (typeof F44_earnChest === 'function') F44_earnChest('silver');
  else if (typeof spawnXP === 'function') spawnXP('+1 Cofre Plata 🥈');
  if (typeof confetti === 'function') confetti();
  if (typeof SFX !== 'undefined' && SFX.levelUp) SFX.levelUp();
  saveState();
  toast('🎁 ¡Cofre Plata ganado!', 'Completaste las 3 misiones del día. ¡Increíble constancia!', 't-success');
  F35_render();
  if (typeof F44_render === 'function') F44_render();
}

// ── Hooks de progreso (llamados desde quiz/módulo/XP) ─────────────

function F35_onModuleComplete() {
  var quests = F35_getOrGenerate();
  var today  = _f35_todayKey();
  if (S.dailyQuestsKey !== today) return;
  var changed = false;
  quests.forEach(function(q) {
    if (q.type === 'module' && !q.done) {
      q.progress = Math.min(q.target, (q.progress || 0) + 1);
      if (q.progress >= q.target) q.done = true;
      changed = true;
    }
  });
  if (changed) { saveState(); setTimeout(F35_render, 100); }
}

function F35_onQuizCorrect() {
  var quests = F35_getOrGenerate();
  var today  = _f35_todayKey();
  if (S.dailyQuestsKey !== today) return;
  var changed = false;
  quests.forEach(function(q) {
    if (q.type === 'quiz' && !q.done) {
      q.progress = Math.min(q.target, (q.progress || 0) + 1);
      if (q.progress >= q.target) q.done = true;
      changed = true;
    }
  });
  if (changed) { saveState(); setTimeout(F35_render, 100); }
}

function F35_onXPGained(amount) {
  var quests = F35_getOrGenerate();
  var today  = _f35_todayKey();
  if (S.dailyQuestsKey !== today) return;
  var changed = false;
  quests.forEach(function(q) {
    if (q.type === 'xp' && !q.done) {
      q.progress = Math.min(q.target, (q.progress || 0) + (amount || 0));
      if (q.progress >= q.target) q.done = true;
      changed = true;
    }
  });
  if (changed) { saveState(); setTimeout(F35_render, 200); }
}

window.F35_render         = F35_render;
window.F35_claimQuest     = F35_claimQuest;
window.F35_claimBonus     = F35_claimBonus;
window.F35_onModuleComplete = F35_onModuleComplete;
window.F35_onQuizCorrect  = F35_onQuizCorrect;
window.F35_onXPGained     = F35_onXPGained;


/* ══════════════════════════════════════════════════════════════════
   F50 — POWER-UP SHOP
   ─────────────────────────────────────────────────────────────────
   Tienda de mejoras temporales compradas con XP.
   Items: XP ×2 (1h), Pista de Quiz, Escudo de Racha extra.
   Accesible desde un botón en el home.
══════════════════════════════════════════════════════════════════ */

var F50_ITEMS = [
  {
    id:    'xp2',
    icon:  '⚡',
    label: 'XP ×2 durante 1h',
    desc:  'Duplica el XP de todos los módulos y quizzes durante 60 minutos.',
    cost:  150,
    color: '#f0b429',
    canBuy: function() { return Date.now() >= (S.xpMultiplierExpiry || 0); },
    apply:  function() {
      S.xpMultiplierExpiry = Date.now() + 3600000;
      toast('⚡ ¡XP ×2 activado!', 'Tienes 1 hora de XP doble. ¡Estudia rápido!', 't-success');
    },
    status: function() {
      if (Date.now() < (S.xpMultiplierExpiry || 0)) {
        var minLeft = Math.ceil((S.xpMultiplierExpiry - Date.now()) / 60000);
        return '⚡ Activo — ' + minLeft + 'm restantes';
      }
      return null;
    }
  },
  {
    id:    'hint',
    icon:  '💡',
    label: 'Pista de Quiz',
    desc:  'Elimina 2 opciones incorrectas en el próximo quiz. Se usa automáticamente.',
    cost:  75,
    color: '#00e5a0',
    canBuy: function() { return (S.quizHints || 0) < 3; },
    apply:  function() {
      S.quizHints = Math.min(3, (S.quizHints || 0) + 1);
      toast('💡 Pista comprada', 'Se eliminará 2 opciones en el próximo quiz. Tienes ' + S.quizHints + '.', 't-success');
    },
    status: function() {
      var h = S.quizHints || 0;
      return h > 0 ? ('💡 ' + h + ' pista' + (h > 1 ? 's' : '') + ' disponible' + (h > 1 ? 's' : '')) : null;
    }
  },
  {
    id:    'shield',
    icon:  '🛡️',
    label: 'Escudo de Racha',
    desc:  'Protege tu racha 1 día aunque no estudies. Máximo 3 escudos.',
    cost:  200,
    color: '#60a5fa',
    canBuy: function() { return (S.streakShields || 0) < 3; },
    apply:  function() {
      S.streakShields = Math.min(3, (S.streakShields || 0) + 1);
      if (typeof _updateShieldUI === 'function') _updateShieldUI();
      toast('🛡️ Escudo comprado', 'Tu racha está protegida ' + S.streakShields + ' día(s) extra.', 't-success');
    },
    status: function() {
      var sh = S.streakShields || 0;
      return sh > 0 ? ('🛡️ ' + sh + ' escudo' + (sh > 1 ? 's' : '')) : null;
    }
  },
];

function F50_open() {
  var modal = document.getElementById('m-f50-shop');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-f50-shop';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  var xp = Math.round(S.xp || 0);
  var itemsHTML = F50_ITEMS.map(function(item) {
    var canAfford = xp >= item.cost;
    var canBuy    = item.canBuy();
    var status    = item.status();
    var disabled  = !canAfford || !canBuy;
    var btnLabel  = !canAfford ? 'Faltan ' + (item.cost - xp) + ' XP' : (!canBuy ? 'Máximo alcanzado' : 'Comprar — ' + item.cost + ' XP');
    return '<div class="f50-item" style="--f50-color:' + item.color + '">'
      + '<div class="f50-item-icon">' + item.icon + '</div>'
      + '<div class="f50-item-body">'
      +   '<div class="f50-item-label">' + item.label + '</div>'
      +   '<div class="f50-item-desc">' + item.desc + '</div>'
      +   (status ? '<div class="f50-item-status">' + status + '</div>' : '')
      + '</div>'
      + '<button class="f50-buy-btn' + (disabled ? ' f50-btn-disabled' : '') + '" '
      + (disabled ? 'disabled' : 'onclick="F50_buy(\'' + item.id + '\')"') + '>'
      + btnLabel + '</button>'
      + '</div>';
  }).join('');

  modal.innerHTML = '<div class="modal-box f50-modal">'
    + '<div class="f50-header">'
    +   '<span class="f50-title">⚡ Tienda de Mejoras</span>'
    +   '<button class="modal-close-btn" onclick="closeModal(\'m-f50-shop\')">✕</button>'
    + '</div>'
    + '<div class="f50-balance">Tu saldo: <strong>' + xp.toLocaleString('es') + ' XP</strong></div>'
    + '<div class="f50-list">' + itemsHTML + '</div>'
    + '<div class="f50-footer">Los power-ups usan tu XP acumulado. Tu nivel no baja.</div>'
    + '</div>';

  openModal('m-f50-shop');
}

function F50_buy(itemId) {
  var item = F50_ITEMS.find(function(i) { return i.id === itemId; });
  if (!item) return;
  if ((S.xp || 0) < item.cost) { toast('❌ XP insuficiente', 'Necesitas ' + item.cost + ' XP.', 't-warn'); return; }
  if (!item.canBuy()) { toast('⚠️ No disponible', 'Ya tienes el máximo de este power-up.', 't-warn'); return; }

  S.xp -= item.cost;
  item.apply();
  saveState();
  if (typeof checkAchievements === 'function') checkAchievements();
  if (typeof SFX !== 'undefined' && SFX.xp) SFX.xp();
  F50_open(); // refresca el modal con saldo actualizado
}

window.F50_open = F50_open;
window.F50_buy  = F50_buy;

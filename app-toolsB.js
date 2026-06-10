const NOTIFS = {
  _granted: false,

  async requestPermission() {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') { this._granted = true; return true; }
    if (Notification.permission === 'denied')  return false;
    const result = await Notification.requestPermission();
    this._granted = result === 'granted';
    return this._granted;
  },

  _show(title, body, icon, tag) {
    if (!this._granted || Notification.permission !== 'granted') return;
    try {
      const n = new Notification(title, {
        body, icon: icon || '🎯',
        tag: tag || 'finlearn',
        badge: './icons/icon-96.png',
        silent: false,
      });
      n.onclick = () => { window.focus(); n.close(); };
    } catch(e) {}
  },

  // Schedule a one-shot notification N ms from now
  schedule(ms, title, body, tag) {
    if (!this._granted) return;
    setTimeout(() => this._show(title, body, '📈', tag), ms);
  },

  // Call after completing first module — ask permission + schedule daily reminder
  async onFirstModule() {
    const ok = await this.requestPermission();
    if (!ok) return;
    // Schedule: come back tomorrow
    const H23 = 23 * 60 * 60 * 1000;
    this.schedule(H23,
      '🔥 Tu racha te espera',
      'Lleva ' + (S.streak || 1) + ' días seguidos. No lo rompas hoy.',
      'streak-reminder'
    );
  },

  // Streak at risk — fire if user hasn't opened in 20h
  scheduleStreakReminder() {
    if (!this._granted) return;
    const H20 = 20 * 60 * 60 * 1000;
    this.schedule(H20,
      '⚡ ¡Racha en peligro!',
      'Tu racha de ' + (S.streak || 1) + ' días termina a medianoche. 1 minuto es suficiente.',
      'streak-risk'
    );
  },

  // Salary received notification
  notifySalary(amount) {
    this._show(
      '💼 Sueldo recibido',
      '+€' + Math.round(amount).toLocaleString('es') + ' ingresados este mes de juego',
      '💼', 'salary'
    );
  },

  // Subscribe to Web Push via Service Worker — requiere VAPID configurado en Cloudflare env vars
  async subscribePush() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    const VAPID_PUBLIC = window._VAPID_PUBLIC || '';
    if (!VAPID_PUBLIC) return; // no configurado aún
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: _urlBase64ToUint8Array(VAPID_PUBLIC),
      });
      await fetch('/api/push-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON(), userId: S.friendCode || '' }),
      }).catch(() => {});
    } catch(e) {}
  },
};

// Auto-init: restore permission state
if ('Notification' in window && Notification.permission === 'granted') {
  NOTIFS._granted = true;
}

function _urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw     = window.atob(base64);
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

/* ══════════════════════════════════════════════════════════════════
   SHARE CARD — Genera imagen PNG con Canvas para compartir
   ─────────────────────────────────────────────────────────────────
   Crea una tarjeta 1080×1080 (Instagram) con:
   · Fondo oscuro + gradiente de color
   · Patrimonio destacado
   · Nivel + racha
   · Branding FinLearn
   · Usa navigator.share si está disponible (móvil nativo)
══════════════════════════════════════════════════════════════════ */
function generateShareCard() {
  const canvas = document.createElement('canvas');
  canvas.width  = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  // ── Background ───────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, 1080, 1080);
  bg.addColorStop(0,   '#060810');
  bg.addColorStop(0.5, '#0d1420');
  bg.addColorStop(1,   '#060810');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1080);

  // ── Accent orb ───────────────────────────────────────────
  const orb = ctx.createRadialGradient(200, 200, 0, 200, 200, 600);
  orb.addColorStop(0, 'rgba(0,229,160,0.18)');
  orb.addColorStop(1, 'transparent');
  ctx.fillStyle = orb;
  ctx.fillRect(0, 0, 1080, 1080);

  const orb2 = ctx.createRadialGradient(900, 900, 0, 900, 900, 500);
  orb2.addColorStop(0, 'rgba(110,86,255,0.14)');
  orb2.addColorStop(1, 'transparent');
  ctx.fillStyle = orb2;
  ctx.fillRect(0, 0, 1080, 1080);

  // ── Logo ─────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '600 36px system-ui, sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('FINLEARN', 80, 80);

  // ── Main label ───────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '500 48px system-ui';
  ctx.fillText('Mi patrimonio actual', 80, 320);

  // ── Patrimony big number ──────────────────────────────────
  const patr = Math.round(S.patrimony || 0);
  const patrStr = '€' + patr.toLocaleString('es');
  ctx.fillStyle = '#00e5a0';
  ctx.font      = 'bold 144px system-ui';
  // Shrink if too long
  const metrics = ctx.measureText(patrStr);
  if (metrics.width > 900) ctx.font = 'bold 96px system-ui';
  ctx.fillText(patrStr, 80, 480);

  // ── Divider line ─────────────────────────────────────────
  ctx.strokeStyle = 'rgba(0,229,160,0.3)';
  ctx.lineWidth   = 2;
  ctx.beginPath(); ctx.moveTo(80, 540); ctx.lineTo(1000, 540); ctx.stroke();

  // ── Stats row ────────────────────────────────────────────
  const stats = [
    { label: 'Nivel', value: 'Lv.' + (S.level || 1) },
    { label: 'Racha', value: (S.streak || 0) + '🔥 días' },
    { label: 'Módulos', value: (S.completedMods || []).length + '/30' },
    { label: 'XP Total', value: (S.xp || 0).toLocaleString('es') + ' XP' },
  ];
  stats.forEach((st, i) => {
    const x = 80 + i * 240;
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font      = '500 32px system-ui';
    ctx.fillText(st.label, x, 630);
    ctx.fillStyle = '#fff';
    ctx.font      = 'bold 52px system-ui';
    ctx.fillText(st.value, x, 700);
  });

  // ── Projection ───────────────────────────────────────────
  const proj10 = Math.round(calcCompound(S.patrimony||0, S.monthlyContribution||200, S.expectedReturn||7, 10));
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font      = '500 38px system-ui';
  ctx.fillText('En 10 años a este ritmo:', 80, 820);
  ctx.fillStyle = '#f0b429';
  ctx.font      = 'bold 80px system-ui';
  ctx.fillText('€' + proj10.toLocaleString('es'), 80, 910);

  // ── Footer tag ───────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font      = '500 30px system-ui';
  ctx.fillText('finlearn.app · Aprende. Invierte. Libérate.', 80, 1020);

  return canvas;
}

async function shareProgress() {
  HAPTIC.medium();
  const canvas = generateShareCard();

  // Try native share (mobile)
  if (navigator.share && navigator.canShare) {
    try {
      canvas.toBlob(async blob => {
        const file = new File([blob], 'finlearn-progreso.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Mi progreso en FinLearn',
            text: '¡Llevo €' + Math.round(S.patrimony||0).toLocaleString('es') + ' de patrimonio y nivel ' + (S.level||1) + '!',
            files: [file],
          });
          return;
        }
        _downloadShareCard(canvas);
      }, 'image/png');
      return;
    } catch(e) {}
  }

  // Fallback: download image
  _downloadShareCard(canvas);
}

function _downloadShareCard(canvas) {
  const a = document.createElement('a');
  a.download = 'finlearn-progreso.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  toast('📸 Imagen guardada', 'Comparte tu progreso en Instagram o WhatsApp', 't-success');
}

/* ══════════════════════════════════════════════════════════════════
   CAREER EVENT ENGINE
══════════════════════════════════════════════════════════════════ */

function _checkCareerEvent() {
  if (!S.userName) return;
  if (!Array.isArray(S.seenCareerEvents)) S.seenCareerEvents = [];

  // Find an event that: hasn't been seen AND whose trigger passes
  const available = CAREER_EVENTS.filter(e =>
    !S.seenCareerEvents.includes(e.id) && e.trigger(S)
  );
  if (available.length === 0) return;

  // Pick the first available (they're ordered by progression)
  const event = available[0];
  _showCareerEventModal(event);
}

function _showCareerEventModal(event) {
  let modal = document.getElementById('m-career-event');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-career-event';
    modal.className = 'modal-overlay';
    modal.style.display = 'none';
    document.body.appendChild(modal);
  }

  const choicesHTML = event.choices.map((c, i) => `
    <button class="career-choice-btn choice-${c.type}" onclick="pickCareerChoice('${event.id}', ${i})">
      <div class="ccb-label">${c.label}</div>
      <div class="ccb-desc">${c.desc}</div>
    </button>`).join('');

  modal.innerHTML = `
    <div class="modal-box career-event-modal">
      <div class="cev-icon">${event.icon}</div>
      <div class="cev-title">${event.title}</div>
      <div class="cev-desc">${event.desc}</div>
      <div class="cev-choices">${choicesHTML}</div>
      <div class="cev-lesson">${event.lesson}</div>
    </div>`;

  modal.style.display = 'flex';
  SFX.xp();
}

function pickCareerChoice(eventId, choiceIdx) {
  const event  = CAREER_EVENTS.find(e => e.id === eventId);
  if (!event) return;
  const choice = event.choices[choiceIdx];
  if (!choice) return;

  // Apply effect
  const _xpBefore = S.xp || 0;
  try { choice.effect(S); } catch(e) {}
  const _xpDelta = (S.xp || 0) - _xpBefore;
  if (_xpDelta > 0 && typeof F34_onXPGained === 'function') F34_onXPGained(_xpDelta);
  recalcPatrimony();

  // Mark as seen
  if (!Array.isArray(S.seenCareerEvents)) S.seenCareerEvents = [];
  S.seenCareerEvents.push(eventId);
  saveState();

  // Close modal
  const modal = document.getElementById('m-career-event');
  if (modal) modal.style.display = 'none';

  // Show result toast
  const type = choice.type === 'positive' ? 't-success' :
               choice.type === 'negative' ? 't-danger'  : 't-social';
  toast(event.icon + ' ' + event.title, choice.result, type);

  if (choice.type === 'positive') { SFX.correct(); HAPTIC.success(); confetti(); }
  else if (choice.type === 'negative') SFX.wrong();

  // Update salary display if on life screen
  renderCareerCard();
  updateUIFromState();
  checkAchievements();
}


/* ══════════════════════════════════════════════════════════════════
   YEAR-END SUMMARY — Resumen épico al final de cada año de juego
   Aparece automáticamente cuando gameDay alcanza múltiplo de 365.
══════════════════════════════════════════════════════════════════ */
function _showYearEndSummary(year) {
  // ── Calcular estadísticas del año ────────────────────────
  const patrimonyEnd   = S.patrimony || 0;
  const patrimonyStart = S.yearStartPatrimony || 0;
  const patrimonyGain  = patrimonyEnd - patrimonyStart;
  const patrimonyPct   = patrimonyStart > 0
    ? ((patrimonyGain / patrimonyStart) * 100).toFixed(1)
    : null;

  const xpGained   = (S.xp || 0) - (S.yearStartXP || 0);
  const modsGained = (S.completedMods || []).length - (S.yearStartMods || 0);
  const divYear    = S.yearDividends  || 0;
  const bizYear    = S.yearBizIncome  || 0;
  const salary     = calcMonthlySalary();
  const totalIncome= salary * 12 + bizYear;

  // ── Highlight stat (best thing that happened) ───────────
  let highlight = '';
  if (divYear > 500)
    highlight = `💸 Cobraste <strong>€${Math.round(divYear).toLocaleString('es')}</strong> en dividendos este año`;
  else if (bizYear > 2000)
    highlight = `🏪 Tus negocios generaron <strong>€${Math.round(bizYear).toLocaleString('es')}</strong>`;
  else if (modsGained >= 5)
    highlight = `🎓 Completaste <strong>${modsGained} módulos</strong> — nivel de conocimiento élite`;
  else if (patrimonyGain > 1000)
    highlight = `📈 Tu patrimonio creció <strong>€${Math.round(patrimonyGain).toLocaleString('es')}</strong>`;
  else
    highlight = `⚡ Ganaste <strong>${xpGained.toLocaleString('es')} XP</strong> este año`;

  // ── Personal message based on performance ───────────────
  let msg = '';
  if (patrimonyPct && parseFloat(patrimonyPct) >= 10)
    msg = '🔥 Año excepcional. Sigues por encima de la inflación y del mercado.';
  else if (modsGained >= 3)
    msg = '📚 Gran año de aprendizaje. El conocimiento que has ganado nunca se devalúa.';
  else if (S.streak >= 30)
    msg = '💎 La constancia es tu superpoder. 30+ días de racha lo dice todo.';
  else
    msg = '🌱 Cada año es un ladrillo más. El interés compuesto necesita tiempo.';

  // ── Inject modal ─────────────────────────────────────────
  let modal = document.getElementById('m-year-end');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-year-end';
    modal.className = 'modal-overlay';
    modal.style.display = 'none';
    document.body.appendChild(modal);
  }

  const pctBadge = patrimonyPct !== null
    ? `<div class="ye-pct ${parseFloat(patrimonyPct) >= 0 ? 'pos' : 'neg'}">${parseFloat(patrimonyPct) >= 0 ? '+' : ''}${patrimonyPct}%</div>`
    : '';

  modal.innerHTML = `
    <div class="modal-box year-end-modal">
      <div class="ye-fireworks">🎆</div>
      <div class="ye-eyebrow">RESUMEN DEL AÑO ${year}</div>
      <div class="ye-title">¡Otro año más libre!</div>
      <div class="ye-patrimony">
        <div class="ye-patrimony-label">Patrimonio total</div>
        <div class="ye-patrimony-val">€${Math.round(patrimonyEnd).toLocaleString('es')}</div>
        ${pctBadge}
      </div>
      <div class="ye-stats">
        <div class="ye-stat">
          <div class="ye-stat-icon">⚡</div>
          <div class="ye-stat-val">${xpGained.toLocaleString('es')}</div>
          <div class="ye-stat-lab">XP ganados</div>
        </div>
        <div class="ye-stat">
          <div class="ye-stat-icon">📚</div>
          <div class="ye-stat-val">${modsGained}</div>
          <div class="ye-stat-lab">Módulos</div>
        </div>
        <div class="ye-stat">
          <div class="ye-stat-icon">💸</div>
          <div class="ye-stat-val">€${Math.round(divYear).toLocaleString('es')}</div>
          <div class="ye-stat-lab">Dividendos</div>
        </div>
        <div class="ye-stat">
          <div class="ye-stat-icon">🏪</div>
          <div class="ye-stat-val">€${Math.round(bizYear).toLocaleString('es')}</div>
          <div class="ye-stat-lab">Negocios</div>
        </div>
      </div>
      <div class="ye-highlight">${highlight}</div>
      <div class="ye-msg">${msg}</div>
      <div class="ye-next">
        <div class="ye-next-label">Objetivo año ${year + 1}</div>
        <div class="ye-next-val">€${Math.round(patrimonyEnd * 1.10).toLocaleString('es')}</div>
        <div class="ye-next-sub">+10% con tu ritmo actual</div>
      </div>
      <button class="btn btn-primary btn-block" style="margin-top:20px;" onclick="closeYearEnd()">
        🚀 A por el año ${year + 1}
      </button>
    </div>`;

  modal.style.display = 'flex';
  SFX.levelUp();
  HAPTIC.levelUp();
  confetti();
  setTimeout(confetti, 600);
  setTimeout(confetti, 1200);
  checkAchievements();
}

function closeYearEnd() {
  const modal = document.getElementById('m-year-end');
  if (modal) {
    modal.classList.add('modal-out');
    setTimeout(() => { modal.style.display = 'none'; modal.classList.remove('modal-out'); }, 300);
  }
}

/* ══════════════════════════════════════════════════════════════════
   MUSIC ENGINE — Lo-Fi Beat Procedural (Web Audio API)
   ─────────────────────────────────────────────────────────────────
   Sin archivos externos. Genera un beat lo-fi chill proceduralmente:
   · Kick drum (oscilador sub pitchbend)
   · Hi-hat (ruido blanco filtrado)
   · Bass line (escala pentatónica menor)
   · Chord pads (osciladores suavizados)
   · BPM: 80 — tempo ideal para concentración/dopamina suave
   · Se activa solo tras interacción del usuario (política autoplay)
══════════════════════════════════════════════════════════════════ */
const MUSIC = (() => {
  let _ctx = null;
  let _playing = false;
  let _masterGain = null;
  let _scheduledNodes = [];
  let _nextBeat = 0;
  let _beatTimer = null;
  const BPM = 80;
  const BEAT_S = 60 / BPM;
  const STEP_S = BEAT_S / 2; // 8th notes

  // Pentatonic minor scale in C: C2 Eb2 F2 G2 Bb2 C3
  const BASS_NOTES = [65.41, 77.78, 87.31, 98.00, 116.54, 130.81];
  const CHORD_NOTES = [[130.81,155.56,174.61],[98.00,116.54,146.83],[87.31,104.17,130.81]];

  // Bass pattern (16 steps, 0=rest, 1-6=note index)
  const BASS_PAT = [1,0,0,3, 0,0,2,0, 1,0,0,4, 0,3,0,0];
  // Kick pattern
  const KICK_PAT = [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,1,0];
  // Hat pattern
  const HAT_PAT  = [0,1,0,1, 0,1,0,1, 0,1,0,1, 0,1,0,1];

  let _step = 0;
  let _chordIdx = 0;
  let _chordTimer = 0;

  function ctx() {
    if (!_ctx) {
      _ctx = new (window.AudioContext || window.webkitAudioContext)();
      _masterGain = _ctx.createGain();
      _masterGain.gain.setValueAtTime((_volume || 0.7) * 0.25, _ctx.currentTime) // quiet ambient
      _masterGain.connect(_ctx.destination);
    }
    return _ctx;
  }

  function _kick(t) {
    const c = ctx();
    const g = c.createGain();
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    g.connect(_masterGain);
    const o = c.createOscillator();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    o.connect(g);
    o.start(t); o.stop(t + 0.35);
  }

  function _hat(t, open) {
    const c = ctx();
    const dur = open ? 0.12 : 0.04;
    const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const filt = c.createBiquadFilter();
    filt.type = 'highpass';
    filt.frequency.value = 8000;
    const g = c.createGain();
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filt); filt.connect(g); g.connect(_masterGain);
    src.start(t); src.stop(t + dur);
  }

  function _bass(t, freq) {
    const c = ctx();
    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = freq;
    const filt = c.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(400, t);
    filt.frequency.exponentialRampToValueAtTime(200, t + STEP_S * 0.8);
    const g = c.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + STEP_S * 0.85);
    o.connect(filt); filt.connect(g); g.connect(_masterGain);
    o.start(t); o.stop(t + STEP_S);
  }

  function _chord(t, notes) {
    const c = ctx();
    notes.forEach(freq => {
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq * 2; // up one octave for pads
      const g = c.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.3);
      g.gain.exponentialRampToValueAtTime(0.001, t + BEAT_S * 3.8);
      o.connect(g); g.connect(_masterGain);
      o.start(t); o.stop(t + BEAT_S * 4);
    });
  }

  function _schedule() {
    if (!_playing) return;
    const c = ctx();
    const ahead = 0.1;
    while (_nextBeat < c.currentTime + ahead) {
      const t = _nextBeat;
      const s = _step % 16;

      if (KICK_PAT[s]) _kick(t);
      if (HAT_PAT[s])  _hat(t, false);
      if (BASS_PAT[s]) _bass(t, BASS_NOTES[BASS_PAT[s] - 1]);

      // Chord every 4 beats (every 8 steps)
      if (s === 0) {
        _chord(t, CHORD_NOTES[_chordIdx % CHORD_NOTES.length]);
        _chordIdx++;
      }

      _step++;
      _nextBeat += STEP_S;
    }
    _beatTimer = setTimeout(_schedule, 20);
  }

  function start() {
    if (_playing) return;
    _playing = true;
    const c = ctx();
    if (c.state === 'suspended') c.resume();
    _nextBeat = c.currentTime + 0.05;
    _schedule();
    _renderMusicBtn();
  }

  function stop() {
    _playing = false;
    if (_beatTimer) clearTimeout(_beatTimer);
    _renderMusicBtn();
  }

  function isPlaying() {
    return _playing;
  }

  function toggle() {
    _playing ? stop() : start();
  }

  function setVolume(v) {
    // v: 0.0 → 1.0
    const vol = Math.max(0, Math.min(1, v));
    if (_masterGain) {
      _masterGain.gain.cancelScheduledValues(_ctx.currentTime);
      _masterGain.gain.linearRampToValueAtTime(vol * 0.35, _ctx.currentTime + 0.1);
    }
    _volume = vol;
  }

  let _volume = 0.7; // default volume

  function _renderMusicBtn() {
    const btn = document.getElementById('music-control');
    if (!btn) return;
    const vol = Math.round((_volume || 0.7) * 100);
    btn.innerHTML = `
      <div class="music-widget">
        <button class="music-toggle-btn ${_playing ? 'music-on' : ''}"
          onclick="MUSIC.toggle()"
          title="${_playing ? 'Pausar' : 'Activar'} música">
          ${_playing ? '🎵' : '🔇'}
        </button>
        <div class="music-vol-wrap">
          <input type="range" class="music-vol-slider" min="0" max="100" value="${vol}"
            style="--val:${vol}%"
            oninput="const v=this.value/100; MUSIC.setVolume(v); window._savedMusicVol=v; document.getElementById('music-vol-pct').textContent=this.value+'%'; this.style.setProperty('--val',this.value+'%');"
            title="Volumen">
          <span class="music-vol-pct" id="music-vol-pct">${vol}%</span>
        </div>
      </div>`;
  }

  // Auto-start on first user interaction
  function _autoStart() {
    // iOS/Android: AudioContext must be created AND resumed inside a user gesture.
    // We call ctx() to create it, then explicitly resume() before starting the music.
    const c = ctx();
    if (c.state === 'suspended') {
      c.resume().then(() => {
        if (!_playing) start();
      }).catch(() => {});
    } else if (!_playing) {
      start();
    }
  }

  // Unlock AudioContext on ANY touch/click (needed for iOS which suspends after creation)
  function _unlockAudio() {
    const c = ctx();
    if (c.state === 'suspended') c.resume().catch(() => {});
  }

  return { start, stop, toggle, setVolume, isPlaying, getVolume: () => _volume, init() {
    // Use passive touch handlers for performance on mobile
    document.addEventListener('click',      _autoStart,    { once: true, passive: true });
    document.addEventListener('touchstart', _autoStart,    { once: true, passive: true });
    document.addEventListener('touchend',   _unlockAudio,  { once: true, passive: true });
    setTimeout(_renderMusicBtn, 500);
  }};
})();


/* ══════════════════════════════════════════════════════════════════
   SPLASH SCREEN — Pantalla de carga animada
   Muestra progreso mientras el JS inicializa. Se oculta en 1.8s.
══════════════════════════════════════════════════════════════════ */
function _showSplash() {
  const splash = document.getElementById('app-splash');
  if (!splash) return;
  splash.style.display = 'flex';

  const hints = [
    'Cargando tu universo financiero…',
    'Inicializando mercados en vivo…',
    'Preparando tus módulos…',
    'Calculando proyecciones…',
    '¡Listo para invertir!',
  ];
  const bar  = document.getElementById('splash-bar');
  const hint = document.getElementById('splash-hint');
  let prog = 0;
  let hIdx = 0;

  const iv = setInterval(() => {
    prog += Math.random() * 22 + 8;
    if (prog > 100) prog = 100;
    if (bar)  bar.style.width = prog + '%';
    if (hint) hint.textContent = hints[Math.min(hIdx++, hints.length - 1)];
    if (prog >= 100) clearInterval(iv);
  }, 260);

  // GARANTÍA: ocultar siempre a los 2.5s aunque falle cualquier otra cosa
  setTimeout(_hideSplash, 2500);
}

function _hideSplash() {
  const splash = document.getElementById('app-splash');
  if (!splash) return;
  splash.style.pointerEvents = 'none';
  splash.style.opacity = '0';
  splash.style.display = 'none';
  splash.classList.add('splash-out');
}


/* ══════════════════════════════════════════════════════════════════
   INTERACTIVE TUTORIAL — Guía de primer uso paso a paso
   ─────────────────────────────────────────────────────────────────
   · 6 pasos con highlight del elemento real en pantalla
   · Solo aparece la primera vez (S.hasSeenTutorial)
   · Saltable en cualquier momento
   · Haptic + sound en cada paso
══════════════════════════════════════════════════════════════════ */
const TUTORIAL_STEPS = [
  {
    icon: '🎓',
    title: '¡Bienvenido a FinLearn!',
    desc: 'Módulos de 5 minutos, conocimiento que puedes aplicar hoy. La constancia es lo que separa a quienes consiguen libertad financiera de los que no.',
  },
  {
    icon: '🔥',
    title: 'Mantén tu racha',
    desc: 'Un módulo al día mantiene la racha viva. Las rachas desbloquean recompensas y construyen el hábito más valioso que existe.',
  },
  {
    icon: '📈',
    title: 'Simulador financiero',
    desc: 'Invierte, gestiona negocios y simula crisis — todo con dinero virtual basado en tu situación real.',
  },
  {
    icon: '🚀',
    title: '¡Tu primera lección!',
    desc: 'Hemos elegido el módulo perfecto según tu objetivo. 5 minutos que valen miles de euros.',
  },
];

let _tutStep = 0;

function startTutorial() {
  if (S.hasSeenTutorial || localStorage.getItem('fl_tutorial_done')) return;
  localStorage.setItem('fl_tutorial_done', '1');
  _tutStep = 0;
  S.hasSeenTutorial = true;
  saveState();
  document.getElementById('tutorial-overlay').style.display = 'flex';
  _renderTutStep();
}

function _renderTutStep() {
  const step = TUTORIAL_STEPS[_tutStep];
  if (!step) { endTutorial(); return; }

  setEl('tut-icon',  step.icon);
  setEl('tut-title', step.title);
  setEl('tut-desc',  step.desc);

  const nextBtn = document.getElementById('tut-next-btn');
  if (nextBtn) nextBtn.textContent = _tutStep === TUTORIAL_STEPS.length - 1 ? '¡Vamos a por ello! 🚀' : 'Siguiente →';

  // Dots
  const dots = document.getElementById('tut-dots');
  if (dots) {
    dots.innerHTML = TUTORIAL_STEPS.map((_, i) =>
      `<div class="tut-dot ${i === _tutStep ? 'active' : ''}"></div>`
    ).join('');
  }

  const hl   = document.getElementById('tut-highlight');
  const arr  = document.getElementById('tut-arrow');
  const card = document.getElementById('tut-card');
  if (hl)   hl.style.display  = 'none';
  if (arr)  arr.style.display = 'none';
  if (card) {
    card.style.position  = '';
    card.style.top       = '';
    card.style.left      = '';
    card.style.right     = '';
    card.style.bottom    = '';
    card.style.margin    = '';
    card.style.transform = '';
  }

  SFX.xp();
  HAPTIC.light();
}

function tutorialNext() {
  _tutStep++;
  if (_tutStep >= TUTORIAL_STEPS.length) { endTutorial(); return; }
  _renderTutStep();
}

function skipTutorial() {
  endTutorial();
}

function endTutorial() {
  document.getElementById('tutorial-overlay').style.display = 'none';
  S.hasSeenTutorial = true;
  localStorage.setItem('fl_tutorial_done', '1');
  saveState();
  // Auto-launch first recommended module
  setTimeout(() => {
    const modId = (S.suggestedModuleId !== undefined && S.suggestedModuleId !== null) ? S.suggestedModuleId : 0;
    toast('🎯 ¡Tu primera lección te espera!', 'Empieza ahora — son solo 5 minutos 🚀', 't-success');
    setTimeout(() => { if (typeof startModule === 'function') startModule(modId); }, 600);
  }, 400);
}


/* ══════════════════════════════════════════════════════════════════
   MARKET CRISIS ENGINE — Eventos aleatorios que afectan el mercado
   ─────────────────────────────────────────────────────────────────
   · Se dispara cada ~180 días de juego (±60 días de aleatoriedad)
   · 3 tipos: CRASH (-20% a -45%), BURBUJA (+30% a +60%), TIPOS (efecto mixto)
   · Afecta TODOS los precios de GAME.stockPrices en tiempo real
   · Modal educativo con contexto histórico y decisión del jugador
   · Recuperación gradual durante los siguientes 30-90 días
══════════════════════════════════════════════════════════════════ */
const CRISIS_EVENTS = [
  {
    id: 'crash_tech',
    type: 'crash',
    icon: '🔴',
    name: 'Crash Tecnológico',
    severity: 0.72, // multiplier applied to all prices
    desc: 'Las valoraciones del sector tech eran insostenibles. El mercado corrige con fuerza. Los inversores con liquidez tienen la oportunidad de su vida.',
    affectedSectors: ['tech', 'crypto'],
    crashMult: { tech: 0.62, crypto: 0.45, default: 0.82 },
    recoveryDays: 60,
    lesson: '💡 Los crashes son normales. El S&P 500 ha tenido correcciones del 20%+ 26 veces en 100 años — y se ha recuperado el 100% de las veces.',
    choices: [
      { label: '😨 Vendo todo para preservar capital', effect: s => { s.cash = (s.cash||0) + Object.entries(s.portfolio||{}).reduce((a,[t,p]) => a + (GAME.stockPrices[t]||0)*p.shares*0.85, 0); s.portfolio = {}; }, result: 'Vendiste con -15% de pérdida. Realizaste las pérdidas permanentemente. El mercado tardó 8 meses en recuperar.', type: 'negative' },
      { label: '💎 Mantengo y no miro los precios', effect: s => { s.xp += 200; }, result: '+200 XP. Decisión correcta. Los inversores que mantuvieron en 2008 recuperaron todo en 3 años y triplicaron en 10.', type: 'positive' },
      { label: '🚀 Compro más — es una oportunidad', effect: s => { const extra = Math.min(s.cash||0, 2000); s.cash = (s.cash||0) - extra; s.balance = (s.balance||0) + extra; s.xp += 400; }, result: '¡Compraste en mínimos! +400 XP. Este es el movimiento de los grandes inversores.', type: 'positive' },
    ],
  },
  {
    id: 'bubble_meme',
    type: 'bubble',
    icon: '🟢',
    name: 'Burbuja Especulativa',
    desc: 'La euforia del mercado empuja los precios muy por encima de su valor real. Todo sube. La tentación de comprar es máxima — pero la historia advierte.',
    affectedSectors: ['all'],
    crashMult: { default: 1.45 },
    recoveryDays: 45,
    lesson: '⚠️ "Cuando el taxista te da consejos de bolsa, es hora de vender." — Warren Buffett. La euforia es el peor momento para comprar.',
    choices: [
      { label: '🤑 Compro todo, el mercado solo sube', effect: s => { s.xp -= 50; }, result: '-50 XP. Comprar en máximos de euforia es el error más caro del inversor retail. La burbuja explota en 60 días.', type: 'negative' },
      { label: '⚖️ Rebalanceo — vendo lo que sobrepesa', effect: s => { s.xp += 250; s.cash = (s.cash||0) + 800; }, result: '+250 XP, +€800 realizados. El rebalanceo automático te hizo vender caro. Trabajo bien hecho.', type: 'positive' },
      { label: '📊 Mantengo mi plan sin cambios', effect: s => { s.xp += 150; }, result: '+150 XP. Ignorar el ruido del mercado y mantener el plan es difícil y correcto.', type: 'positive' },
    ],
  },
  {
    id: 'rates_hike',
    type: 'tipos',
    icon: '🏛️',
    name: 'Subida Brusca de Tipos',
    desc: 'El Banco Central sube tipos de interés al 4,5% para combatir la inflación. Bonos y renta fija suben. Las acciones, especialmente growth, caen.',
    affectedSectors: ['bonds', 'tech'],
    crashMult: { bonds: 1.12, tech: 0.78, default: 0.88 },
    recoveryDays: 90,
    lesson: '💡 Tipos altos = bonos más atractivos = dinero sale de bolsa. Los valores "value" (bancos, energía) resisten mejor que "growth" (tech) en este entorno.',
    choices: [
      { label: '🏦 Diversifico con renta fija / bonos', effect: s => { s.xp += 300; s.cash = (s.cash||0) + 600; }, result: '+300 XP, +€600. Los bonos rinden más ahora. Diversificación inteligente.', type: 'positive' },
      { label: '📉 Reduzco exposición a acciones tech', effect: s => { s.xp += 150; }, result: '+150 XP. Ajustar el portfolio al entorno macroeconómico es gestión activa real.', type: 'positive' },
      { label: '🙈 Ignoro la macro, sigo igual', effect: s => { s.xp += 50; }, result: '+50 XP. No es el peor movimiento — pero entender los ciclos mejora tus decisiones.', type: 'neutral' },
    ],
  },
  {
    id: 'recession',
    type: 'crash',
    icon: '📉',
    name: 'Recesión Económica',
    desc: '2 trimestres consecutivos de contracción del PIB. El desempleo sube. Los mercados anticipan menores beneficios empresariales y caen con fuerza.',
    affectedSectors: ['all'],
    crashMult: { default: 0.70 },
    recoveryDays: 120,
    lesson: '💡 Las recesiones duran una media de 11 meses. Las expansiones duran 4,5 años. Los inversores pacientes que no venden en recesión capturan toda la recuperación.',
    choices: [
      { label: '💵 Acumulo liquidez para el rebote', effect: s => { s.xp += 200; s.cash = (s.cash||0) + 500; }, result: '+200 XP. Mantener liquidez en recesión para comprar en mínimos es estrategia de élite.', type: 'positive' },
      { label: '🛡️ Me refugio en oro y defensivos', effect: s => { s.xp += 180; }, result: '+180 XP. Activos defensivos (utilities, consumo básico, oro) protegen en recesión.', type: 'positive' },
      { label: '😱 Vendo y espero a que se calme', effect: s => { s.xp -= 100; s.cash = (s.cash||0) + Object.entries(s.portfolio||{}).reduce((a,[t,p]) => a + (GAME.stockPrices[t]||0)*p.shares*0.75,0)*0.4; }, result: '-100 XP. Vender en pánico y esperar "que se calme" es la receta para perderse el rebote.', type: 'negative' },
    ],
  },
];

let _crisisActive = false;
let _crisisRecoveryStep = 0;
let _crisisRecoveryTotal = 0;
let _crisisRecoveryMult = {};

function _checkMarketCrisis() {
  if (_crisisActive) return;
  if (!S.userName) return;
  if (!Array.isArray(S.seenCrisisEvents)) S.seenCrisisEvents = [];

  // Trigger every 180 game days ±60 randomness
  const nextCrisis = S.nextCrisisDay || 180;
  if (S.gameDay < nextCrisis) return;

  // Pick unseen event, or reset if all seen
  let available = CRISIS_EVENTS.filter(e => !S.seenCrisisEvents.includes(e.id));
  if (available.length === 0) { S.seenCrisisEvents = []; available = CRISIS_EVENTS; }
  const event = available[Math.floor(Math.random() * available.length)];

  // Schedule next crisis
  S.nextCrisisDay = S.gameDay + 150 + Math.floor(Math.random() * 60);
  S.seenCrisisEvents.push(event.id);

  setTimeout(() => _triggerCrisis(event), 800);
}

function _triggerCrisis(event) {
  _crisisActive = true;

  // Apply price shock immediately
  const mult = event.crashMult || {};
  STOCKS.forEach(s => {
    const m = mult[s.sector] ?? mult.default ?? 1;
    GAME.stockPrices[s.ticker] = +(GAME.stockPrices[s.ticker] * m).toFixed(2);
    // Add crash candle to history
    GAME.priceHistory[s.ticker].push(GAME.stockPrices[s.ticker]);
    if (GAME.priceHistory[s.ticker].length > 60) GAME.priceHistory[s.ticker].shift();
  });

  // Set up recovery
  _crisisRecoveryTotal = event.recoveryDays || 60;
  _crisisRecoveryStep  = 0;
  // Recovery target: return to 95% of pre-crash for crash, 85% of bubble peak for bubble
  _crisisRecoveryMult  = event.type === 'crash' ? { default: 1.012 } :
                         event.type === 'bubble' ? { default: 0.992 } :
                         { default: 1.005 };

  // Show crisis modal
  _showCrisisModal(event);

  // Screen shake
  document.body.classList.add('market-shake');
  setTimeout(() => document.body.classList.remove('market-shake'), 600);

  // Sound + haptic
  SFX.wrong();
  if (event.type !== 'bubble') { HAPTIC.heavy(); } else { HAPTIC.success(); }

  // Update ticker
  _renderPriceTicker();
}

let _crisisCountdownTimer = null;
let _crisisSec = 60;

function _showCrisisModal(event) {
  _crisisSec = 60;
  if (_crisisCountdownTimer) { clearInterval(_crisisCountdownTimer); _crisisCountdownTimer = null; }

  let modal = document.getElementById('m-crisis');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-crisis';
    modal.className = 'modal-overlay';
    modal.style.display = 'none';
    document.body.appendChild(modal);
  }

  const isCrash  = event.type === 'crash' || event.type === 'tipos' || event.type === 'recession';
  const headerCol = isCrash ? '#ff4b5c' : '#00e5a0';

  function buildInner(secs) {
    const urgentCls = secs <= 15 ? ' mc-urgent' : secs <= 30 ? ' mc-warn' : '';
    const dashOffset = Math.round(220 - (secs / 60) * 220);
    const choicesHTML = event.choices.map((c, i) =>
      '<button class="mc-decision-btn choice-' + c.type + '" onclick="pickCrisisChoice(\'' + event.id + '\',' + i + ')">' +
        '<div class="mc-dec-label">' + c.label + '</div>' +
      '</button>'
    ).join('');
    return '<div class="modal-box mc-modal' + urgentCls + '">' +
      '<div class="mc-alert-bar" style="background:' + headerCol + '20;color:' + headerCol + '">\uD83D\uDEA8 EVENTO DE MERCADO</div>' +
      '<div class="crisis-icon" style="color:' + headerCol + ';font-size:40px;margin:8px 0">' + event.icon + '</div>' +
      '<div class="crisis-title">' + event.name + '</div>' +
      '<div class="crisis-desc">' + event.desc + '</div>' +
      '<div class="mc-countdown-wrap">' +
        '<svg viewBox="0 0 80 80" width="72" height="72" style="transform:rotate(-90deg)">' +
          '<circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="5"/>' +
          '<circle cx="40" cy="40" r="35" fill="none" stroke="' + headerCol + '" stroke-width="5"' +
          ' stroke-dasharray="220" stroke-dashoffset="' + dashOffset + '"' +
          ' style="transition:stroke-dashoffset .95s linear" id="mc-ring"/>' +
        '</svg>' +
        '<div class="mc-countdown-center">' +
          '<div class="mc-countdown-val" id="mc-secs">' + secs + '</div>' +
          '<div class="mc-countdown-label">seg</div>' +
        '</div>' +
      '</div>' +
      '<div class="mc-decisions">' + choicesHTML + '</div>' +
    '</div>';
  }

  modal.innerHTML = buildInner(_crisisSec);
  modal.style.display = 'flex';

  _crisisCountdownTimer = setInterval(function() {
    _crisisSec--;
    const secsEl = document.getElementById('mc-secs');
    const ringEl = document.getElementById('mc-ring');
    if (secsEl) secsEl.textContent = _crisisSec;
    if (ringEl) ringEl.style.strokeDashoffset = Math.round(220 - (_crisisSec / 60) * 220);
    const box = modal.querySelector('.modal-box');
    if (box) {
      box.classList.remove('mc-urgent', 'mc-warn');
      if (_crisisSec <= 15) box.classList.add('mc-urgent');
      else if (_crisisSec <= 30) box.classList.add('mc-warn');
    }
    if (_crisisSec <= 0) {
      clearInterval(_crisisCountdownTimer);
      _crisisCountdownTimer = null;
      pickCrisisChoice(event.id, 1); // auto: mantener
    }
  }, 1000);
}

function pickCrisisChoice(eventId, idx) {
  if (_crisisCountdownTimer) { clearInterval(_crisisCountdownTimer); _crisisCountdownTimer = null; }
  const event  = CRISIS_EVENTS.find(e => e.id === eventId);
  if (!event) return;
  const choice = event.choices[idx];
  if (!choice) return;

  const patrimonyBefore = S.patrimony || 0;
  try { choice.effect(S); } catch(e) {}
  recalcPatrimony();
  saveState();

  // Show summary modal
  const modal = document.getElementById('m-crisis');
  if (modal) {
    const delta = (S.patrimony || 0) - patrimonyBefore;
    const deltaCol = delta >= 0 ? '#00e5a0' : '#ef4444';
    const deltaSign = delta >= 0 ? '+' : '';
    const typeClass = choice.type === 'positive' ? 't-success' : choice.type === 'negative' ? 't-danger' : '';

    // Alternatives summary
    const altsHTML = event.choices.map((c, i) =>
      '<div class="mc-alt-row' + (i === idx ? ' mc-alt-chosen' : '') + '">' +
        '<span class="mc-alt-icon">' + c.label.slice(0,2) + '</span>' +
        '<div><div class="mc-alt-result">' + c.result + '</div></div>' +
      '</div>'
    ).join('');

    modal.innerHTML =
      '<div class="modal-box mc-modal mc-summary">' +
        '<div class="mc-sum-header">' +
          '<div class="mc-sum-icon">' + choice.label.slice(0,2) + '</div>' +
          '<div class="mc-sum-title">Elegiste: ' + choice.label.slice(2).trim() + '</div>' +
        '</div>' +
        '<div class="mc-patrimony-delta">' +
          '<div class="mc-pd-label">Impacto en patrimonio</div>' +
          '<div class="mc-pd-val" style="color:' + deltaCol + '">' + deltaSign + '\u20ac' + Math.abs(delta).toLocaleString('es') + '</div>' +
        '</div>' +
        '<div class="mc-sum-result ' + typeClass + '">' + choice.result + '</div>' +
        '<div class="card mc-alternatives" style="margin-top:12px">' +
          '<div class="mc-alts-title">\uD83D\uDCD6 Las 3 opciones comparadas</div>' +
          altsHTML +
        '</div>' +
        '<div class="mc-lesson-box">' +
          '<div class="mc-lesson-text">' + event.lesson + '</div>' +
        '</div>' +
        '<button class="btn btn-primary btn-block" style="margin-top:16px"' +
        ' onclick="document.getElementById(\'m-crisis\').style.display=\'none\';checkAchievements();updateUIFromState();">' +
          '\uD83D\uDE80 Continuar' +
        '</button>' +
      '</div>';
  }

  if (choice.type === 'positive') { SFX.correct(); HAPTIC.success(); }
  else { SFX.wrong(); }
}

function _stepCrisisRecovery() {
  if (!_crisisActive) return;
  _crisisRecoveryStep++;
  const mult = _crisisRecoveryMult.default || 1.01;
  STOCKS.forEach(s => {
    GAME.stockPrices[s.ticker] = +(GAME.stockPrices[s.ticker] * (0.998 + Math.random() * 0.008 + (mult - 1))).toFixed(2);
  });
  if (_crisisRecoveryStep >= _crisisRecoveryTotal) {
    _crisisActive = false;
  }
}


/* ══════════════════════════════════════════════════════════════════
   RANDOM LIFE EVENTS — Eventos cotidianos que obligan a usar el
   fondo de emergencia y añaden realismo al simulador
   ─────────────────────────────────────────────────────────────────
   · Se disparan cada 45-90 días de juego de forma aleatoria
   · Mezcla de golpes negativos (realismo) y positivos (dopamina)
   · Conectan directamente con los módulos educativos
══════════════════════════════════════════════════════════════════ */
const RANDOM_LIFE_EVENTS = [
  // GOLPES — requieren fondo de emergencia
  { id:'boiler',    icon:'🔧', type:'bad',
    title:'Se ha roto la caldera',
    desc:'Justo en enero. El fontanero dice que es urgente. No hay opción.',
    cost: 650, lesson:'¿Tenías fondo de emergencia? Para esto existe.',
    trigger: s => s.gameDay > 30 },
  { id:'car_repair', icon:'🚗', type:'bad',
    title:'Avería del coche',
    desc:'El motor de arranque ha muerto. Sin coche no puedes trabajar.',
    cost: 480, lesson:'Los coches son el activo que más dinero destruye silenciosamente.',
    trigger: s => s.gameDay > 45 },
  { id:'medical',   icon:'🏥', type:'bad',
    title:'Gasto médico inesperado',
    desc:'Una revisión rutinaria revela algo que hay que tratar pronto. La sanidad privada pasa factura.',
    cost: 900, lesson:'La salud tiene un coste real. El seguro médico privado vale ~€80/mes.',
    trigger: s => s.gameDay > 60 },
  { id:'fine',      icon:'📋', type:'bad',
    title:'Multa de tráfico',
    desc:'Un radar en la autovía. 100 km/h en zona de 90. Sin puntos, pero con factura.',
    cost: 200, lesson:'Los imprevistos pequeños son los más frecuentes. El fondo de emergencia también cubre estos.',
    trigger: s => true },
  { id:'rent_hike', icon:'🏠', type:'bad',
    title:'Subida del alquiler',
    desc:'Tu casero actualiza el contrato al IPC. +8% este año. La inflación afecta a todo.',
    cost: 120 * 12, lesson:'La inflación del alquiler es el mayor destructor de ahorro para quien no tiene vivienda propia.',
    trigger: s => s.gameDay > 90 },
  { id:'laptop',    icon:'💻', type:'bad',
    title:'El portátil se ha muerto',
    desc:'Pantalla negra. Datos sin backup. El técnico dice que no tiene solución.',
    cost: 750, lesson:'La depreciación tecnológica es real. El seguro del hogar a veces cubre esto.',
    trigger: s => true },

  // GOLPES MEDIOS — decisiones
  { id:'friend_debt', icon:'🤝', type:'choice',
    title:'Un amigo te pide dinero',
    desc:'Tu mejor amigo pasa por un mal momento y te pide 1.000€. "Te lo devuelvo en 3 meses."',
    lesson:'El 70% de los préstamos a amigos no se devuelven. Solo presta lo que puedas permitirte perder.',
    choices: [
      { label:'💸 Le presto los 1.000€', effect: s => { s.cash = Math.max(0, (s.cash||0) - 1000); }, result:'−€1.000. Ahora esperas. La amistad y el dinero rara vez se llevan bien.', type:'negative' },
      { label:'🎁 Le doy 200€ como regalo', effect: s => { s.cash = Math.max(0, (s.cash||0) - 200); s.xp += 50; }, result:'−€200. Ayudas sin comprometer tus finanzas. +50 XP por inteligencia emocional.', type:'neutral' },
      { label:'❌ No puedo, mis finanzas no están para eso', effect: s => { s.xp += 80; }, result:'+80 XP por mantener límites financieros. Diferenciar entre ser generoso y ser imprudente es madurez.', type:'positive' },
    ],
    trigger: s => (s.cash||0) > 1000 },

  // GOLPES POSITIVOS — dopamina
  { id:'inheritance', icon:'🎁', type:'good',
    title:'Herencia inesperada',
    desc:'Un tío lejano del que apenas sabías ha fallecido y te ha dejado algo. El notario ha llamado.',
    gain: 2800, lesson:'Las herencias inesperadas son uno de los principales eventos que cambian trayectorias financieras. Invierte, no gastes.',
    trigger: s => s.gameDay > 30 },
  { id:'bonus',     icon:'🏆', type:'good',
    title:'Bonus de empresa',
    desc:'Resultados record este trimestre. El bonus llega por sorpresa a la cuenta.',
    gain: 1200, lesson:'Un bonus extra invertido inmediatamente tiene el mayor impacto. Antes de gastarlo: invierte el 70%.',
    trigger: s => (s.career||'junior') !== 'entrepreneur' },
  { id:'cashback',  icon:'💳', type:'good',
    title:'Cashback acumulado',
    desc:'Tu tarjeta de crédito sin comisión lleva meses acumulando el 1%. Hoy te ingresan el total.',
    gain: 180, lesson:'Las tarjetas sin comisión con cashback son dinero gratis si pagas el saldo completo cada mes.',
    trigger: s => true },
  { id:'tax_return', icon:'📊', type:'good',
    title:'Devolución de la Renta',
    desc:'Hacienda te devuelve más de lo esperado. Las deducciones del plan de pensiones han funcionado.',
    gain: 650, lesson:'Optimizar la declaración de la renta puede suponer cientos de euros. Vale la pena entender las deducciones.',
    trigger: s => s.gameDay > 120 },
  { id:'freelance', icon:'💼', type:'good',
    title:'Ingreso freelance inesperado',
    desc:'Un contacto de LinkedIn te pide un proyecto puntual. Dos semanas de trabajo, buen precio.',
    gain: 900, lesson:'Un segundo flujo de ingresos, aunque sea esporádico, acelera exponencialmente la acumulación de patrimonio.',
    trigger: s => s.completedMods.length >= 5 },
];

/* Age events function */
function _checkAgeEvents() {
  if (!S.userName) return;
  const age = S.lifeAge || 25;

  // Jubilacion a los 67
  if (age >= 67 && !S.retirementEventFired) {
    S.retirementEventFired = true;
    saveState();
    setTimeout(function() {
      var bonus = 5000;
      S.cash = (S.cash || 0) + bonus;
      recalcPatrimony();
      _ledgerAdd('in', 'life_event', '🎉 Jubilación · Edad ' + age + ' — pensión inicial', bonus);
      saveState();
      toast('🎉 ¡Jubilación!', 'Has alcanzado los ' + age + ' años. Recibes €' + bonus.toLocaleString('es') + ' como pensión inicial. Hora de vivir de tus inversiones.', 't-success');
    }, 1500);
  }

  // Revision de cartera a los 45
  if (age >= 45 && !S.portfolioReviewSuggested) {
    S.portfolioReviewSuggested = true;
    saveState();
    setTimeout(function() {
      toast('📊 Revisión de cartera recomendada', 'Con ' + age + ' años es buen momento para revisar tu estrategia: reduce riesgo, diversifica y ajusta tu horizonte temporal.', 't-info');
    }, 3000);
  }
}

let _nextLifeEventDay = 45 + Math.floor(Math.random() * 30);

function _checkRandomLifeEvent() {
  if (!S.userName) return;
  if (S.gameDay < (_nextLifeEventDay || 45)) return;

  // Schedule next event
  _nextLifeEventDay = S.gameDay + 40 + Math.floor(Math.random() * 50);

  // Pick eligible event not seen recently
  if (!Array.isArray(S.recentLifeEvents)) S.recentLifeEvents = [];
  const eligible = RANDOM_LIFE_EVENTS.filter(e =>
    !S.recentLifeEvents.includes(e.id) && e.trigger(S)
  );
  if (!eligible.length) { S.recentLifeEvents = []; return; }

  const ev = eligible[Math.floor(Math.random() * eligible.length)];
  S.recentLifeEvents.push(ev.id);
  if (S.recentLifeEvents.length > 6) S.recentLifeEvents.shift();

  setTimeout(() => _showLifeEventModal(ev), 1200);
}

function _showLifeEventModal(ev) {
  let modal = document.getElementById('m-life-random');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-life-random';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const isBad  = ev.type === 'bad';
  const isGood = ev.type === 'good';
  const col    = isBad ? 'var(--danger)' : isGood ? 'var(--accent)' : '#f0b429';

  let bodyHTML = '';

  if (ev.type === 'bad') {
    const hasFund = (S.cash || 0) >= ev.cost;
    bodyHTML = `
      <div class="le-amount" style="color:${col};">−€${ev.cost.toLocaleString('es')}</div>
      <div class="le-fund-status" style="color:${hasFund ? 'var(--accent)' : 'var(--danger)'};">
        ${hasFund ? '✅ Tu fondo de emergencia lo cubre' : '⚠️ No tienes suficiente efectivo'}
      </div>
      <div class="le-lesson">${ev.lesson}</div>
      <button class="btn btn-primary btn-block" style="margin-top:16px;" onclick="resolveLifeEvent('${ev.id}','pay')">
        ${hasFund ? `Pagar €${ev.cost.toLocaleString('es')}` : `Pagar lo que puedo (−€${Math.min(ev.cost, S.cash||0).toLocaleString('es')})`}
      </button>`;
  } else if (ev.type === 'good') {
    bodyHTML = `
      <div class="le-amount" style="color:${col};">+€${ev.gain.toLocaleString('es')}</div>
      <div class="le-lesson">${ev.lesson}</div>
      <div style="display:flex;gap:8px;margin-top:16px;">
        <button class="btn btn-primary" style="flex:1;" onclick="resolveLifeEvent('${ev.id}','invest')">💹 Invertir 70%</button>
        <button class="btn btn-secondary" style="flex:1;" onclick="resolveLifeEvent('${ev.id}','save')">🏦 Guardar todo</button>
      </div>`;
  } else {
    // choice event
    bodyHTML = `
      <div class="le-lesson" style="margin-bottom:14px;">${ev.lesson}</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${ev.choices.map((c,i) => `<button class="career-choice-btn choice-${c.type}" onclick="resolveLifeEvent('${ev.id}','choice_${i}')">${c.label}</button>`).join('')}
      </div>`;
  }

  modal.innerHTML = `
    <div class="modal-box le-modal">
      <div class="le-icon">${ev.icon}</div>
      <div class="le-type" style="color:${col};">${isBad ? '⚠️ IMPREVISTO' : isGood ? '🎉 BUENAS NOTICIAS' : '🤔 DECISIÓN'}</div>
      <div class="le-title">${ev.title}</div>
      <div class="le-desc">${ev.desc}</div>
      ${bodyHTML}
    </div>`;
  modal.style.display = 'flex';

  if (isBad)  { SFX.wrong();   HAPTIC.error(); }
  if (isGood) { SFX.correct(); HAPTIC.success(); confetti(); }
  if (ev.type === 'choice') SFX.xp();
}

function resolveLifeEvent(eventId, action) {
  const ev = RANDOM_LIFE_EVENTS.find(e => e.id === eventId);
  if (!ev) return;
  const modal = document.getElementById('m-life-random');
  if (modal) modal.style.display = 'none';

  if (ev.type === 'bad') {
    const cost = Math.min(ev.cost, S.cash || 0);
    S.cash = Math.max(0, (S.cash||0) - cost);
    recalcPatrimony();
    if (cost > 0) _ledgerAdd('out', 'life_event', ev.icon + ' ' + ev.title, cost);
    spawnMoney('−€' + cost.toLocaleString('es'), '#ff4b5c');
    toast(ev.icon + ' ' + ev.title, `−€${cost.toLocaleString('es')} de tu efectivo`, 't-danger');
  } else if (ev.type === 'good') {
    if (action === 'invest') {
      const inv = Math.round(ev.gain * 0.7);
      const sav = ev.gain - inv;
      S.cash    = (S.cash||0) + sav;
      S.invested = (S.invested||0) + inv;
      S.xp += 150;
      if (typeof F34_onXPGained === 'function') F34_onXPGained(150);
      recalcPatrimony();
      _ledgerAdd('in', 'reward', ev.icon + ' ' + ev.title + ' (invertido)', ev.gain);
      spawnMoney('+€' + ev.gain.toLocaleString('es'), '#00e5a0');
      toast(ev.icon + ' ' + ev.title, `+€${inv.toLocaleString('es')} invertidos + €${sav} guardados · +150 XP`, 't-success');
    } else {
      S.cash = (S.cash||0) + ev.gain;
      recalcPatrimony();
      _ledgerAdd('in', 'reward', ev.icon + ' ' + ev.title, ev.gain);
      spawnMoney('+€' + ev.gain.toLocaleString('es'), '#00e5a0');
      toast(ev.icon + ' ' + ev.title, `+€${ev.gain.toLocaleString('es')} en efectivo`, 't-success');
    }
  } else {
    const idx = parseInt(action.replace('choice_', ''));
    const ch  = ev.choices[idx];
    if (ch) {
      const _xpBefore = S.xp || 0;
      try { ch.effect(S); } catch(e) {}
      const _xpDelta = (S.xp || 0) - _xpBefore;
      if (_xpDelta > 0 && typeof F34_onXPGained === 'function') F34_onXPGained(_xpDelta);
      recalcPatrimony();
      toast(ev.icon + ' ' + ev.title, ch.result, ch.type === 'positive' ? 't-success' : ch.type === 'negative' ? 't-danger' : 't-social');
    }
  }

  saveState();
  updateUIFromState();
  checkAchievements();
}


/* ══════════════════════════════════════════════════════════════════
   MARKET NEWS FEED — Noticias que mueven precios en tiempo real
   ─────────────────────────────────────════════════════════════════
   · Se dispara cada 20-40 ticks del precio (80-160s reales)
   · Aparece como banner en la parte superior
   · Afecta precios de sectores específicos ±2-8%
══════════════════════════════════════════════════════════════════ */
const MARKET_NEWS = [
  { headline:'🏦 BCE sube tipos +0,25% — bonos suben, tech presionado', sector:'tech', mult:0.97, positive:false },
  { headline:'🤖 NVIDIA bate estimaciones: beneficio récord en IA', sector:'tech', mult:1.06, positive:true },
  { headline:'🛢️ OPEP recorta producción — petróleo +8%', sector:'commodity', mult:1.05, positive:true },
  { headline:'📉 Dato IPC EEUU: inflación persiste en 3,4%', sector:'all', mult:0.98, positive:false },
  { headline:'🇨🇳 China estimula economía: mercados emergentes +3%', sector:'etf', mult:1.04, positive:true },
  { headline:'⚡ Crisis energética en Europa: utilities bajo presión', sector:'commodity', mult:0.95, positive:false },
  { headline:'💊 Aprobación FDA de nuevo fármaco — healthcare +4%', sector:'health', mult:1.04, positive:true },
  { headline:'🏠 Datos inmobiliario EEUU: sector residencial frena', sector:'realestate', mult:0.96, positive:false },
  { headline:'🚀 SpaceX IPO rumoreada — sector aeroespacial al alza', sector:'tech', mult:1.03, positive:true },
  { headline:'🌍 Tensión geopolítica — oro como refugio sube +2%', sector:'commodity', mult:1.03, positive:true },
  { headline:'📊 FED mantiene tipos — mercado respira aliviado', sector:'all', mult:1.02, positive:true },
  { headline:'💸 Dólar se fortalece — exportadoras europeas caen', sector:'etf', mult:0.97, positive:false },
  { headline:'🔋 Tesla anuncia batería de nueva generación +15% autonomía', sector:'tech', mult:1.05, positive:true },
  { headline:'🏦 Quiebra banco regional EEUU — sector financiero -3%', sector:'all', mult:0.97, positive:false },
  { headline:'📱 Apple supera 1B de iPhones activos — máximos históricos', sector:'tech', mult:1.03, positive:true },
];

let _newsTickCount = 0;
const NEWS_INTERVAL = 25 + Math.floor(Math.random() * 20);

function _checkMarketNews() {
  _newsTickCount++;
  if (_newsTickCount % NEWS_INTERVAL !== 0) return;

  const news = MARKET_NEWS[Math.floor(Math.random() * MARKET_NEWS.length)];

  // Apply price effect
  STOCKS.forEach(s => {
    const applies = news.sector === 'all' ||
                    s.sector   === news.sector ||
                    (news.sector === 'tech' && ['AAPL','MSFT','NVDA','TSLA','AMZN'].includes(s.ticker)) ||
                    (news.sector === 'etf'  && ['MSCI','SP500','IBEX'].includes(s.ticker)) ||
                    (news.sector === 'commodity' && ['GOLD','OIL'].includes(s.ticker));
    if (applies) {
      const jitter = 0.99 + Math.random() * 0.02;
      GAME.stockPrices[s.ticker] = +((GAME.stockPrices[s.ticker] || s.price) * news.mult * jitter).toFixed(2);
    }
  });

  // Show news banner
  _showNewsBanner(news);
  _renderPriceTicker();
}

function _showNewsBanner(news) {
  // Update euribor if BCE-related news
  if (news && news.headline) _updateEuriborFromNews(news.headline);

  let banner = document.getElementById('news-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'news-banner';
    banner.className = 'news-banner';
    document.getElementById('s-home')?.prepend(banner) || document.body.prepend(banner);
  }
  banner.innerHTML = news.headline;
  banner.className = 'news-banner ' + (news.positive ? 'news-positive' : 'news-negative');
  banner.style.opacity = '1';
  banner.style.transform = 'translateY(0)';
  setTimeout(() => {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(-20px)';
  }, 4000);
}


/* ══════════════════════════════════════════════════════════════════
   PATRIMONY CHART — Curva histórica con Chart.js
   ─────────────────────────────────────────────────────────────────
   · Se muestra en el home debajo del patrimonio actual
   · Línea del jugador (verde) + proyección (punteada dorada)
   · Solo visible si hay ≥2 puntos de historia
══════════════════════════════════════════════════════════════════ */
let _patrimonyChartInst = null;

function renderPatrimonyChart() {
  const canvas = document.getElementById('patrimony-chart');
  if (!canvas) return;

  const history = S.patrimonyHistory || [];
  // Add current point
  const points = [
    ...history.map(h => ({ x: `Año ${h.year}`, y: h.value })),
    { x: `Año ${S.gameYear||1} (actual)`, y: Math.round(S.patrimony||0) },
  ];

  if (points.length < 2) {
    canvas.parentElement.style.display = 'none';
    return;
  }
  canvas.parentElement.style.display = 'block';

  // Projection: 5 more years
  const lastVal = points[points.length-1].y;
  const projPoints = [lastVal];
  for (let i = 1; i <= 5; i++) {
    projPoints.push(Math.round(calcCompound(lastVal, S.monthlyContribution||200, S.expectedReturn||7, i)));
  }

  const labels    = points.map(p => p.x);
  const projLabels = points.map(p => p.x).concat(
    Array.from({length:5},(_,i)=>`+${i+1}a`)
  );

  if (_patrimonyChartInst) _patrimonyChartInst.destroy();

  _patrimonyChartInst = new Chart(canvas, {
    type: 'line',
    data: {
      labels: projLabels,
      datasets: [
        {
          label: 'Tu patrimonio',
          data: [...points.map(p=>p.y), ...Array(5).fill(null)],
          borderColor: '#00e5a0',
          backgroundColor: (ctx) => {
            const chart = ctx.chart;
            const {ctx: c, chartArea} = chart;
            if (!chartArea) return 'rgba(0,229,160,0.08)';
            const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0,   'rgba(0,229,160,0.28)');
            gradient.addColorStop(0.6, 'rgba(0,229,160,0.08)');
            gradient.addColorStop(1,   'rgba(0,229,160,0.0)');
            return gradient;
          },
          borderWidth: 2.5,
          pointRadius: 4,
          pointBackgroundColor: '#00e5a0',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Proyección',
          data: [...Array(points.length-1).fill(null), ...projPoints],
          borderColor: '#f0b429',
          borderWidth: 2,
          borderDash: [6,4],
          pointRadius: 3,
          pointBackgroundColor: '#f0b429',
          tension: 0.4,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => '€' + Math.round(ctx.parsed.y).toLocaleString('es'),
          },
        },
      },
      scales: {
        x: { ticks: { color: ()=>document.body.classList.contains('light-mode')?'rgba(60,50,30,.5)':'rgba(255,255,255,.4)', font:{size:9} }, grid: { color: ()=>document.body.classList.contains('light-mode')?'rgba(60,50,30,.08)':'rgba(255,255,255,.05)' } },
        y: {
          ticks: { color: ()=>document.body.classList.contains('light-mode')?'rgba(60,50,30,.5)':'rgba(255,255,255,.4)', font:{size:9},
            callback: v => '€' + (v>=1000 ? (v/1000).toFixed(0)+'k' : v) },
          grid: { color: ()=>document.body.classList.contains('light-mode')?'rgba(60,50,30,.08)':'rgba(255,255,255,.05)' },
        },
      },
    },
  });
}


/* ══════════════════════════════════════════════════════════════════
   PATRIMONY DAILY CHART — SVG puro, sin librerías
   · Visible desde el día 2 (no espera fin de año)
   · Rolling últimos 90 días o todos si < 90
   · Tooltip interactivo con mousemove / touchmove
   · Tab "Días" (SVG) y "Años" (Chart.js anual existente)
══════════════════════════════════════════════════════════════════ */

let _patrimonyTab = 'daily';

function switchPatrimonyTab(tab) {
  _patrimonyTab = tab;
  const dailyWrap = document.getElementById('patr-daily-wrap');
  const yearsWrap = document.getElementById('patr-yearly-wrap');
  const tabDaily  = document.getElementById('pct-tab-daily');
  const tabYears  = document.getElementById('pct-tab-years');
  if (tab === 'daily') {
    if (dailyWrap) dailyWrap.style.display = 'block';
    if (yearsWrap) yearsWrap.style.display = 'none';
    if (tabDaily)  { tabDaily.classList.add('active'); }
    if (tabYears)  { tabYears.classList.remove('active'); }
    renderPatrimonyDailyChart();
  } else {
    if (dailyWrap) dailyWrap.style.display = 'none';
    if (yearsWrap) yearsWrap.style.display = 'block';
    if (tabYears)  { tabYears.classList.add('active'); }
    if (tabDaily)  { tabDaily.classList.remove('active'); }
    renderPatrimonyChartAuto();
  }
}

function renderPatrimonyDailyChart() {
  const wrap = document.getElementById('patr-daily-wrap');
  if (!wrap) return;
  if (!Array.isArray(S.patrimonyDaily)) S.patrimonyDaily = [];
  const allPoints = S.patrimonyDaily;
  if (allPoints.length < 2) {
    wrap.innerHTML = '<div class="patr-chart-empty">El historial diario aparece a partir del segundo día de juego.</div>';
    return;
  }
  const pts    = allPoints.length > 90 ? allPoints.slice(-90) : allPoints;
  const values = pts.map(function(p) { return p.value; });
  const days   = pts.map(function(p) { return p.day; });
  const minV   = Math.min.apply(null, values);
  const maxV   = Math.max.apply(null, values);
  const rangeV = maxV - minV || 1;
  const firstV = values[0];
  const lastV  = values[values.length - 1];
  const deltaV = lastV - firstV;
  const deltaPct = firstV > 0 ? ((deltaV / firstV) * 100).toFixed(1) : '0.0';
  const deltaPos = deltaV >= 0;

  var VW = 360, VH = 130, PL = 52, PR = 12, PT = 18, PB = 30;
  var CW = VW - PL - PR, CH = VH - PT - PB;
  var n  = pts.length;

  function xOf(i)  { return PL + (i / (n - 1)) * CW; }
  function yOf(v)  { return PT + CH - ((v - minV) / rangeV) * CH; }

  function buildPath(vals) {
    var coords = vals.map(function(v, i) { return [xOf(i), yOf(v)]; });
    var d = 'M' + coords[0][0].toFixed(1) + ',' + coords[0][1].toFixed(1);
    for (var i = 1; i < coords.length; i++) {
      var prev = coords[i-1], curr = coords[i];
      var cpx = (prev[0] + curr[0]) / 2;
      d += ' C' + cpx.toFixed(1) + ',' + prev[1].toFixed(1) +
           ' '  + cpx.toFixed(1) + ',' + curr[1].toFixed(1) +
           ' '  + curr[0].toFixed(1) + ',' + curr[1].toFixed(1);
    }
    return d;
  }

  var linePath = buildPath(values);
  var lastX    = xOf(n - 1).toFixed(1);
  var lastY    = yOf(lastV).toFixed(1);
  var fillPath = linePath + ' L' + lastX + ',' + (PT + CH).toFixed(1) +
                 ' L' + PL + ',' + (PT + CH).toFixed(1) + ' Z';

  function fmtV(v) {
    return v >= 1000000 ? (v/1000000).toFixed(1)+'M' :
           v >= 1000    ? (v/1000).toFixed(0)+'k'    : Math.round(v).toString();
  }

  var yTickVals = [minV, minV + rangeV * 0.5, maxV];
  var yTicksHTML = yTickVals.map(function(v) {
    return '<text x="' + (PL-4) + '" y="' + (yOf(v)+3.5).toFixed(1) + '"' +
           ' text-anchor="end" font-size="8" fill="rgba(255,255,255,0.35)"' +
           ' font-family="DM Mono,monospace">\u20ac' + fmtV(Math.round(v)) + '</text>';
  }).join('');

  var xIdxs = [0, Math.floor((n-1)/2), n-1];
  var xTicksHTML = xIdxs.map(function(i) {
    return '<text x="' + xOf(i).toFixed(1) + '" y="' + (VH-4) + '"' +
           ' text-anchor="middle" font-size="8" fill="rgba(255,255,255,0.30)"' +
           ' font-family="DM Mono,monospace">D' + days[i] + '</text>';
  }).join('');

  var badgeCol  = deltaPos ? '#00e5a0' : '#ef4444';
  var badgeSign = deltaPos ? '+' : '';
  var gid       = 'pdg' + (Date.now() % 99999);
  var badgeX    = VW - PR - 72;

  var svgHTML =
    '<svg id="patr-svg-el" viewBox="0 0 ' + VW + ' ' + VH + '" preserveAspectRatio="none"' +
    ' style="width:100%;height:130px;display:block;overflow:visible;">' +
    '<defs>' +
    '<linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0%" stop-color="#00e5a0" stop-opacity="0.28"/>' +
    '<stop offset="75%" stop-color="#00e5a0" stop-opacity="0.05"/>' +
    '<stop offset="100%" stop-color="#00e5a0" stop-opacity="0"/>' +
    '</linearGradient></defs>' +
    // grid lines
    yTickVals.map(function(v) {
      return '<line x1="' + PL + '" y1="' + yOf(v).toFixed(1) + '" x2="' + (VW-PR) + '" y2="' + yOf(v).toFixed(1) + '"' +
             ' stroke="rgba(255,255,255,0.05)" stroke-width="1"/>';
    }).join('') +
    // fill + line
    '<path d="' + fillPath + '" fill="url(#' + gid + ')"/>' +
    '<path d="' + linePath + '" fill="none" stroke="#00e5a0" stroke-width="2"' +
    ' stroke-linecap="round" stroke-linejoin="round"/>' +
    // last point
    '<circle cx="' + lastX + '" cy="' + lastY + '" r="4" fill="#00e5a0"/>' +
    '<circle cx="' + lastX + '" cy="' + lastY + '" r="8" fill="#00e5a0" opacity="0.15"/>' +
    // labels
    yTicksHTML + xTicksHTML +
    // delta badge
    '<rect x="' + badgeX + '" y="' + (PT-13) + '" width="72" height="16" rx="8"' +
    ' fill="' + badgeCol + '" opacity="0.15"/>' +
    '<text x="' + (badgeX+36) + '" y="' + (PT-2) + '"' +
    ' text-anchor="middle" font-size="9" font-weight="700" fill="' + badgeCol + '"' +
    ' font-family="DM Mono,monospace">' + badgeSign + deltaPct + '% (' + n + 'd)</text>' +
    // hover zone
    '<rect id="patr-hz" x="' + PL + '" y="' + PT + '" width="' + CW + '" height="' + CH + '"' +
    ' fill="transparent" style="cursor:crosshair;"/>' +
    '<line id="patr-hl" x1="0" y1="' + PT + '" x2="0" y2="' + (PT+CH) + '"' +
    ' stroke="rgba(255,255,255,0.22)" stroke-width="1" stroke-dasharray="3,2" opacity="0" pointer-events="none"/>' +
    '<circle id="patr-hd" cx="0" cy="0" r="3.5" fill="white" opacity="0" pointer-events="none"/>' +
    '</svg>' +
    '<div id="patr-tip" style="display:none;position:absolute;top:6px;left:50%;transform:translateX(-50%);\
background:rgba(6,8,16,0.92);border:1px solid rgba(255,255,255,0.12);border-radius:8px;\
padding:5px 10px;font-size:11px;color:#e2e8f0;font-family:\'DM Mono\',monospace;\
pointer-events:none;white-space:nowrap;z-index:10;"></div>';

  wrap.style.position = 'relative';
  wrap.innerHTML = svgHTML;

  var svgEl = document.getElementById('patr-svg-el');
  var zone  = document.getElementById('patr-hz');
  var hLine = document.getElementById('patr-hl');
  var hDot  = document.getElementById('patr-hd');
  var tip   = document.getElementById('patr-tip');
  if (!zone) return;

  function getIdx(clientX) {
    var rect = svgEl.getBoundingClientRect();
    var svgX = ((clientX - rect.left) / rect.width) * VW;
    var i    = Math.round(((svgX - PL) / CW) * (n - 1));
    return Math.max(0, Math.min(n - 1, i));
  }
  function showTip(clientX) {
    var i  = getIdx(clientX);
    var px = xOf(i), py = yOf(values[i]);
    if (hLine) { hLine.setAttribute('x1', px.toFixed(1)); hLine.setAttribute('x2', px.toFixed(1)); hLine.setAttribute('opacity','1'); }
    if (hDot)  { hDot.setAttribute('cx', px.toFixed(1)); hDot.setAttribute('cy', py.toFixed(1)); hDot.setAttribute('opacity','1'); }
    if (tip) {
      var d = values[i] - values[0];
      tip.textContent = 'D\xeda ' + days[i] + ': \u20ac' + values[i].toLocaleString('es') + '  ' + (d>=0?'+':'') + '\u20ac' + Math.round(d).toLocaleString('es');
      tip.style.display = 'block';
    }
  }
  function hideTip() {
    if (hLine) hLine.setAttribute('opacity','0');
    if (hDot)  hDot.setAttribute('opacity','0');
    if (tip)   tip.style.display = 'none';
  }
  zone.addEventListener('mousemove',  function(e) { showTip(e.clientX); });
  zone.addEventListener('mouseleave', hideTip);
  zone.addEventListener('touchmove',  function(e) { e.preventDefault(); showTip(e.touches[0].clientX); }, { passive:false });
  zone.addEventListener('touchend',   hideTip);
}

function renderPatrimonyChartAuto() {
  var wrap = document.getElementById('patr-chart-wrap');
  if (!wrap) return;
  if (!Array.isArray(S.patrimonyDaily)) S.patrimonyDaily = [];
  var hasDailyData  = S.patrimonyDaily.length >= 2;
  var hasYearlyData = (S.patrimonyHistory || []).length >= 1;
  if (!hasDailyData && !hasYearlyData) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  switchPatrimonyTab(_patrimonyTab);
}




/* ══════════════════════════════════════════════════════════════════
   SMART BOT RANKING — Bots con patrimonio real y comportamiento
   dinámico. Se mueven cada semana de juego con pequeña aleatoriedad
══════════════════════════════════════════════════════════════════ */

/* ═══ app-push.js — Push Notifications FinLearn ══════════════════
   Sistema de notificaciones inteligentes:
   · Permiso: bottom-sheet bonito antes del prompt nativo
   · Scheduling: programa notifs del día al abrir la app
   · 4 tipos: racha en riesgo, premio diario, boss semanal, regreso
   · Real Web Push: suscripción VAPID guardada en Cloudflare
══════════════════════════════════════════════════════════════════ */

// Clave pública VAPID — generar con: npx web-push generate-vapid-keys
// Sustituir con la clave real antes de desplegar
var PUSH_VAPID_PUBLIC_KEY = 'BJF4LPNgqIETDRWanXAdXpMTp-rWUc-nY7L_U7VfL6zUNCSnKIxy3n8LllsdcxIMitR7L1CCP3DjuaQekogGodU';

var _pushTimers = []; // setTimeout IDs para cancelar si el usuario abre antes de hora

/* ─── Helpers de estado ───────────────────────────────────────── */
function _pushTodayISO() { return new Date().toISOString().slice(0, 10); }

function _pushRewardClaimedToday() {
  var dc = S.loginDayCount || 1;
  return Array.isArray(S.claimedDays) && S.claimedDays.includes(dc);
}

function _pushActiveToday() {
  if (!S.lastLoginTimestamp) return false;
  var todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  return S.lastLoginTimestamp >= todayStart.getTime();
}

function _pushMsUntil(hour, min) {
  var d = new Date();
  var target = new Date(d);
  target.setHours(hour, min, 0, 0);
  if (target <= d) return -1; // ya pasó hoy
  return target - d;
}

/* ─── Inicialización ─────────────────────────────────────────── */
function PUSH_init() {
  if (!('Notification' in window)) return;

  // Cancelar timers previos de sesión anterior
  _pushTimers.forEach(function(id) { clearTimeout(id); });
  _pushTimers = [];

  var perm = Notification.permission;

  // Si ya tiene permiso, programar las de hoy y suscribir Web Push
  if (perm === 'granted') {
    PUSH_scheduleToday();
    PUSH_subscribe();
    return;
  }

  // Si no denegó, decidir si mostrar el sheet de solicitud
  if (perm !== 'denied' && !S.pushAsked) {
    // Solo mostrar tras el 2º día de uso (no el primer día)
    var daysActive = S.daysActive || 0;
    if (daysActive >= 2) {
      // Retraso de 4s para no interrumpir el flujo de bienvenida
      setTimeout(PUSH_showPermissionSheet, 4000);
    }
  }
}

/* ─── Sheet de permiso (UI bonita antes del prompt nativo) ───── */
function PUSH_showPermissionSheet() {
  if (Notification.permission !== 'default') return;
  if (S.pushAsked) return;

  var existing = document.getElementById('m-push-sheet');
  if (existing) existing.remove();

  var sheet = document.createElement('div');
  sheet.id = 'm-push-sheet';
  sheet.className = 'push-sheet-overlay';
  sheet.innerHTML = `
    <div class="push-sheet">
      <div class="push-sheet-handle"></div>

      <div class="push-sheet-icon">🔔</div>
      <div class="push-sheet-title">Nunca pierdas tu racha</div>
      <div class="push-sheet-sub">Activa las notificaciones y FinLearn te avisará en el momento justo</div>

      <div class="push-examples">
        <div class="push-ex push-ex-streak">
          <div class="push-ex-app">
            <img src="./icons/icon-96.png" class="push-ex-icon" onerror="this.textContent='🔥';this.style.fontSize='18px'">
            <span class="push-ex-appname">FinLearn</span>
            <span class="push-ex-time">ahora</span>
          </div>
          <div class="push-ex-title">🔥 Tu racha de ${S.streak || 1} días en juego</div>
          <div class="push-ex-body">Son las 20:00 y aún no has entrado. ¡1 minuto es suficiente!</div>
        </div>
        <div class="push-ex push-ex-boss">
          <div class="push-ex-app">
            <img src="./icons/icon-96.png" class="push-ex-icon" onerror="this.textContent='⚔️';this.style.fontSize='18px'">
            <span class="push-ex-appname">FinLearn</span>
            <span class="push-ex-time">lun</span>
          </div>
          <div class="push-ex-title">⚔️ Nuevo Boss Semanal activo</div>
          <div class="push-ex-body">Esta semana: El Especulador. 3 preguntas · 500 XP en juego.</div>
        </div>
      </div>

      <div class="push-sheet-perks">
        <div class="push-perk">✅ Recordatorio de racha diaria a las 20:00</div>
        <div class="push-perk">🎁 Aviso cuando tu premio diario esté listo</div>
        <div class="push-perk">⚔️ Notificación del boss semanal cada lunes</div>
        <div class="push-perk">🔕 Sin spam — máximo 1 notificación al día</div>
      </div>

      <button class="push-btn-primary" onclick="PUSH_requestPermission()">
        🔔 Activar notificaciones
      </button>
      <button class="push-btn-ghost" onclick="PUSH_dismissSheet()">
        Ahora no
      </button>
    </div>`;

  document.body.appendChild(sheet);

  // Animación de entrada
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      sheet.classList.add('push-sheet-visible');
    });
  });
}

function PUSH_dismissSheet() {
  S.pushAsked = true;
  S.pushDismissedAt = Date.now();
  if (typeof saveState === 'function') saveState();
  _pushRemoveSheet();
}

function _pushRemoveSheet() {
  var sheet = document.getElementById('m-push-sheet');
  if (!sheet) return;
  sheet.classList.remove('push-sheet-visible');
  setTimeout(function() { if (sheet.parentNode) sheet.remove(); }, 350);
}

/* ─── Solicitar permiso real + suscribir ─────────────────────── */
function PUSH_requestPermission() {
  _pushRemoveSheet();
  S.pushAsked = true;
  if (typeof saveState === 'function') saveState();

  Notification.requestPermission().then(function(perm) {
    if (perm === 'granted') {
      if (typeof toast === 'function') toast('🔔 Notificaciones activadas', 'Te avisaremos cuando tu racha esté en riesgo.', 't-success');
      PUSH_scheduleToday();
      PUSH_subscribe();
    }
  });
}

/* ─── Suscripción Web Push (para notificaciones reales del servidor) ─ */
function PUSH_subscribe() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  if (Notification.permission !== 'granted') return;

  navigator.serviceWorker.ready.then(function(reg) {
    reg.pushManager.getSubscription().then(function(existing) {
      if (existing) { _pushSaveSubscription(existing); return; }

      var key = PUSH_VAPID_PUBLIC_KEY;
      if (!key || key.length < 20) return;

      try {
        var keyBytes = _pushUrlBase64ToUint8Array(key);
        reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes })
          .then(function(sub) { _pushSaveSubscription(sub); })
          .catch(function(e) { console.warn('[PUSH] subscribe error:', e); });
      } catch(e) { console.warn('[PUSH] key conversion error:', e); }
    });
  });
}

function _pushSaveSubscription(sub) {
  try {
    var user = typeof getSBUser === 'function' ? getSBUser() : null;
    if (!user) return;
    var j = sub.toJSON();
    getSB().from('push_subscriptions').upsert({
      user_id:  user.id,
      endpoint: j.endpoint,
      p256dh:   j.keys.p256dh,
      auth:     j.keys.auth,
    }, { onConflict: 'endpoint' }).then(function() {});
  } catch(e) {}
}

function _pushUrlBase64ToUint8Array(base64) {
  var padding = '='.repeat((4 - base64.length % 4) % 4);
  var b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  var raw = atob(b64);
  var arr = new Uint8Array(raw.length);
  for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

/* ─── Programar notificaciones del día ──────────────────────── */
function PUSH_scheduleToday() {
  if (Notification.permission !== 'granted') return;

  // Limpiar timers de sesión anterior
  _pushTimers.forEach(function(id) { clearTimeout(id); });
  _pushTimers = [];

  var now = new Date();
  var today = now.toISOString().slice(0, 10);

  // ① Racha en riesgo — 20:00 si no ha habido actividad hoy
  var msStreak = _pushMsUntil(20, 0);
  if (msStreak > 0 && (S.streak || 0) > 0) {
    var idStreak = setTimeout(function() {
      // Re-comprobar en el momento de disparar (podría haber entrado)
      if (!_pushActiveToday()) {
        _pushFireLocal({
          title: '🔥 Tu racha de ' + (S.streak || 1) + ' d\xEDas en peligro',
          body: '¡Son las 8 pm! Únete 1 minuto y salva tu racha. El tiempo corre…',
          tag: 'streak-risk',
          url: './',
        });
      }
    }, msStreak);
    _pushTimers.push(idStreak);
  }

  // ② Premio diario sin reclamar — 19:00
  var msReward = _pushMsUntil(19, 0);
  if (msReward > 0 && !_pushRewardClaimedToday()) {
    var idReward = setTimeout(function() {
      if (!_pushRewardClaimedToday()) {
        _pushFireLocal({
          title: '🎁 Tu premio diario te espera',
          body: 'Haz girar la ruleta y gana tu recompensa del d\xEDa ' + (S.loginDayCount || 1) + '. \xA1Es tuya!',
          tag: 'daily-reward',
          url: './',
        });
      }
    }, msReward);
    _pushTimers.push(idReward);
  }

  // ③ Boss semanal — lunes 10:00 si no combatido esta semana
  var monday = 1; // getDay()
  if (now.getDay() === monday) {
    var msBoss = _pushMsUntil(10, 0);
    if (msBoss > 0) {
      var weekKey = typeof _wbGetWeekKey === 'function' ? _wbGetWeekKey() : '';
      if (S.weeklyBossKey !== weekKey) {
        var idBoss = setTimeout(function() {
          _pushFireLocal({
            title: '⚔️ Nuevo Boss Semanal activo',
            body: '\xBFPuedes derrotar al jefe de esta semana? 3 preguntas \xB7 500 XP en juego.',
            tag: 'weekly-boss',
            url: './',
          });
        }, msBoss);
        _pushTimers.push(idBoss);
      }
    }
  }

  // ④ Noticias del día — 12:00 si no leídas
  var msNews = _pushMsUntil(12, 0);
  if (msNews > 0 && S.newsReadKey !== today) {
    var boss = typeof _wbGetBoss === 'function' ? _wbGetBoss() : null;
    var ev   = typeof _newsGetTodayEvent === 'function' ? _newsGetTodayEvent() : null;
    if (ev) {
      var idNews = setTimeout(function() {
        if (S.newsReadKey !== today) {
          _pushFireLocal({
            title: '📰 ' + ev.headline.slice(0, 60) + (ev.headline.length > 60 ? '…' : ''),
            body: 'Nuevo evento de actualidad. Responde el quiz y gana ' + ev.xp + ' XP.',
            tag: 'news-event',
            url: './',
          });
        }
      }, msNews);
      _pushTimers.push(idNews);
    }
  }

  // Enviar schedule al SW para notificaciones de fondo
  _pushSendScheduleToSW();
}

/* ─── Disparar notificación local (misma sesión o PWA instalada) ─ */
function _pushFireLocal(opts) {
  if (Notification.permission !== 'granted') return;
  try {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(function(reg) {
        reg.showNotification(opts.title, {
          body:    opts.body,
          icon:    './icons/icon-192.png',
          badge:   './icons/icon-96.png',
          tag:     opts.tag || 'finlearn',
          vibrate: [120, 60, 120],
          requireInteraction: false,
          data:    { url: opts.url || './' },
          actions: opts.actions || [],
        });
      });
    } else {
      new Notification(opts.title, { body: opts.body, icon: './icons/icon-192.png', tag: opts.tag });
    }
  } catch(e) {}
}

/* ─── Enviar schedule al SW para notifs cuando la app está cerrada ─ */
function _pushSendScheduleToSW() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready.then(function(reg) {
    if (!reg.active) return;
    var today = new Date().toISOString().slice(0, 10);
    var schedule = [];

    // Racha
    var ms20 = _pushMsUntil(20, 0);
    if (ms20 > 0 && (S.streak || 0) > 0) {
      schedule.push({
        id: 'streak-risk-' + today,
        fireAt: Date.now() + ms20,
        title: '🔥 Tu racha de ' + (S.streak || 1) + ' d\xEDas en peligro',
        body: '¡Son las 8 pm! Únete 1 minuto y salva tu racha.',
        tag: 'streak-risk',
        url: './',
      });
    }

    // Premio
    var ms19 = _pushMsUntil(19, 0);
    if (ms19 > 0 && !_pushRewardClaimedToday()) {
      schedule.push({
        id: 'daily-reward-' + today,
        fireAt: Date.now() + ms19,
        title: '🎁 Tu premio diario te espera',
        body: 'Haz girar la ruleta. ¡Tu recompensa del d\xEDa ' + (S.loginDayCount || 1) + ' es tuya!',
        tag: 'daily-reward',
        url: './',
      });
    }

    if (schedule.length > 0) {
      reg.active.postMessage({ type: 'SCHEDULE_NOTIFICATIONS', schedule: schedule });
    }

    // Cancelar notificaciones pasadas (usuario ya entró)
    reg.active.postMessage({ type: 'CANCEL_NOTIFICATIONS', ids: ['streak-risk-' + today, 'daily-reward-' + today] });
  }).catch(function() {});
}

/* ─── Limpiar timers activos (llamar al abrir la app) ────────── */
function PUSH_cancelToday() {
  _pushTimers.forEach(function(id) { clearTimeout(id); });
  _pushTimers = [];

  // Cerrar notificaciones del sistema que ya no son relevantes
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function(reg) {
      reg.getNotifications({ tag: 'streak-risk' }).then(function(notifs) { notifs.forEach(function(n) { n.close(); }); });
      reg.getNotifications({ tag: 'daily-reward' }).then(function(notifs) { notifs.forEach(function(n) { n.close(); }); });
    }).catch(function() {});
  }
}

/* ─── Diagnóstico: panel de configuración de notificaciones ──── */
function PUSH_openSettings() {
  var perm = Notification.permission;
  var modal = document.getElementById('m-push-settings');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-push-settings';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  var statusLabel = perm === 'granted' ? '🟢 Activadas' : (perm === 'denied' ? '🔴 Bloqueadas en el navegador' : '⚪ No activadas');
  var statusColor = perm === 'granted' ? '#00e5a0' : (perm === 'denied' ? '#ff4444' : 'var(--text2)');

  var actionBtn = perm === 'denied'
    ? '<div style="font-size:13px;color:var(--text2);text-align:center;padding:8px 0;">Para reactivarlas, ve a Configuración del navegador → Privacidad → Notificaciones → FinLearn.</div>'
    : (perm === 'granted'
      ? '<button class="push-settings-btn-ghost" onclick="PUSH_testNotification()">Enviar notificación de prueba</button>'
      : '<button class="push-btn-primary" style="margin-top:8px;" onclick="PUSH_requestPermission();closeModal(\'m-push-settings\')">🔔 Activar notificaciones</button>');

  modal.innerHTML = '<div class="sc-modal-backdrop" onclick="closeModal(\'m-push-settings\')">'
    + '<div class="push-settings-box" onclick="event.stopPropagation()">'
    + '<button class="sc-modal-close" onclick="closeModal(\'m-push-settings\')">&#x2715;</button>'
    + '<div style="font-size:28px;text-align:center;margin-bottom:8px;">🔔</div>'
    + '<div style="font-size:17px;font-weight:800;text-align:center;margin-bottom:4px;">Notificaciones</div>'
    + '<div style="font-size:13px;color:' + statusColor + ';text-align:center;font-weight:600;margin-bottom:20px;">' + statusLabel + '</div>'
    + (perm === 'granted' ? _pushSettingsActiveHTML() : '')
    + actionBtn
    + '<button class="push-settings-btn-ghost" onclick="closeModal(\'m-push-settings\')" style="margin-top:8px;">Cerrar</button>'
    + '</div></div>';

  openModal('m-push-settings');
}

function _pushSettingsActiveHTML() {
  return '<div class="push-settings-list">'
    + '<div class="push-setting-row"><span>🔥 Racha en riesgo (20:00)</span><span class="push-setting-on">ON</span></div>'
    + '<div class="push-setting-row"><span>🎁 Premio diario (19:00)</span><span class="push-setting-on">ON</span></div>'
    + '<div class="push-setting-row"><span>⚔️ Boss semanal (lunes 10:00)</span><span class="push-setting-on">ON</span></div>'
    + '<div class="push-setting-row"><span>📰 Eventos de actualidad (12:00)</span><span class="push-setting-on">ON</span></div>'
    + '</div>';
}

function PUSH_testNotification() {
  _pushFireLocal({
    title: '🔔 Prueba de notificación',
    body: '¡Las notificaciones de FinLearn funcionan correctamente!',
    tag: 'test',
    url: './',
  });
  if (typeof toast === 'function') toast('🔔 Notificación enviada', 'Mírala en tu barra de estado', 't-success');
}

window.PUSH_init              = PUSH_init;
window.PUSH_showPermissionSheet = PUSH_showPermissionSheet;
window.PUSH_requestPermission = PUSH_requestPermission;
window.PUSH_dismissSheet      = PUSH_dismissSheet;
window.PUSH_scheduleToday     = PUSH_scheduleToday;
window.PUSH_cancelToday       = PUSH_cancelToday;
window.PUSH_openSettings      = PUSH_openSettings;
window.PUSH_testNotification  = PUSH_testNotification;
window.PUSH_subscribe         = PUSH_subscribe;

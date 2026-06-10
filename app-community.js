/* ══ COMMUNITY FEED ═══════════════════════════════════════════════
   Feed de actividad: eventos propios del usuario + actividad
   simulada de la comunidad.

   API pública (window._FEED):
     · write(type, payload)          — registra un evento del usuario
     · render(elementOrId, limit)    — renderiza el feed en un contenedor
     · renderScreen()                — renderiza la pantalla s-community completa

   Supabase: cuando el usuario está autenticado y la tabla
   `community_feed` existe, también escribe y lee eventos reales.
   Si la tabla no existe, falla silenciosamente (offline-first).
══════════════════════════════════════════════════════════════════ */

var _FEED = (function () {

  var MAX_LOCAL = 50;

  var BOTS = [
    { name: 'María S.',   av: '🦊' },
    { name: 'Carlos M.',  av: '🐻' },
    { name: 'Ana P.',     av: '🦋' },
    { name: 'David R.',   av: '🦅' },
    { name: 'Laura G.',   av: '🌺' },
    { name: 'Javier T.',  av: '🦁' },
    { name: 'Sara M.',    av: '🐝' },
  ];

  var TEMPLATES = [
    { type: 'module_complete', payload: { title: 'El Interés Compuesto',      xp: 20 } },
    { type: 'module_complete', payload: { title: 'La Regla del 72',            xp: 15 } },
    { type: 'module_complete', payload: { title: 'FIRE: Libertad Financiera',  xp: 30 } },
    { type: 'module_complete', payload: { title: 'ETFs para principiantes',    xp: 25 } },
    { type: 'module_complete', payload: { title: 'Fondos indexados globales',  xp: 25 } },
    { type: 'module_complete', payload: { title: 'Cómo salir de deudas',       xp: 20 } },
    { type: 'level_up',        payload: { level: 4  } },
    { type: 'level_up',        payload: { level: 7  } },
    { type: 'level_up',        payload: { level: 11 } },
    { type: 'streak',          payload: { days: 7   } },
    { type: 'streak',          payload: { days: 14  } },
    { type: 'streak',          payload: { days: 30  } },
    { type: 'achievement',     payload: { title: 'Primera inversión'        } },
    { type: 'achievement',     payload: { title: '5 módulos completados'    } },
    { type: 'achievement',     payload: { title: 'Racha de 7 días'          } },
    { type: 'calc_used',       payload: { name: 'Proyector FIRE'            } },
    { type: 'calc_used',       payload: { name: 'Hipoteca vs Alquiler'      } },
    { type: 'calc_used',       payload: { name: 'Interés Compuesto'         } },
    { type: 'savings',         payload: { amount: 280, pct: 18 } },
    { type: 'savings',         payload: { amount: 450, pct: 22 } },
    { type: 'savings',         payload: { amount: 610, pct: 31 } },
    { type: 'duel_win',        payload: { score: 8, total: 10 } },
    { type: 'duel_win',        payload: { score: 9, total: 10 } },
  ];

  /* ── Formateadores por tipo ── */
  function _fmt(ev) {
    var n = ev.me ? (S && S.userName ? S.userName : 'Tú') : ev.name;
    var p = ev.payload || {};
    switch (ev.type) {
      case 'module_complete':
        return { icon: '📚', text: '<strong>' + n + '</strong> completó "<em>' + (p.title || 'un módulo') + '</em>" <span style="color:var(--accent)">+' + (p.xp || 0) + ' XP</span>' };
      case 'level_up':
        return { icon: '⭐', text: '<strong>' + n + '</strong> alcanzó el <strong style="color:var(--gold)">nivel ' + p.level + '</strong>' };
      case 'streak':
        return { icon: '🔥', text: '<strong>' + n + '</strong> lleva <strong>' + p.days + ' días</strong> de racha consecutiva' };
      case 'calc_used':
        return { icon: '🧮', text: '<strong>' + n + '</strong> usó <em>' + (p.name || 'una calculadora') + '</em>' };
      case 'achievement':
        return { icon: '🏆', text: '<strong>' + n + '</strong> desbloqueó "<em>' + (p.title || 'un logro') + '</em>"' };
      case 'duel_win':
        return { icon: '⚔️', text: '<strong>' + n + '</strong> ganó un duelo con <strong>' + p.score + '/' + p.total + '</strong>' };
      case 'savings':
        return { icon: '💰', text: '<strong>' + n + '</strong> ahorró €<strong>' + (p.amount || 0).toLocaleString('es') + '</strong> este mes (' + (p.pct || 0) + '% de tasa)' };
      case 'premium':
        return { icon: '💎', text: '<strong>' + n + '</strong> se unió a <strong>FinLearn Premium</strong>' };
      case 'fire_calc':
        return { icon: '🏝️', text: '<strong>' + n + '</strong> calculó su número FIRE: <strong style="color:var(--gold)">€' + (p.fireNumber || 0).toLocaleString('es') + '</strong>' };
      default:
        return { icon: '✨', text: '<strong>' + n + '</strong> está activo en FinLearn' };
    }
  }

  function _timeAgo(ts) {
    var diff = Date.now() - ts;
    var min  = Math.floor(diff / 60000);
    if (min < 2)  return 'ahora mismo';
    if (min < 60) return 'hace ' + min + 'm';
    var h = Math.floor(min / 60);
    if (h < 24)   return 'hace ' + h + 'h';
    var d = Math.floor(h / 24);
    return d === 1 ? 'ayer' : 'hace ' + d + 'd';
  }

  /* ── Genera eventos de bots (deterministas para no cambiar en cada render) ── */
  function _botEvents() {
    var now   = Date.now();
    var h     = 3600000;
    var events = [];
    BOTS.forEach(function (bot, i) {
      var seed1 = (i * 3     + Math.floor(now / (h * 5))) % TEMPLATES.length;
      var seed2 = (i * 3 + 1 + Math.floor(now / (h * 9))) % TEMPLATES.length;
      var t1 = TEMPLATES[seed1];
      var t2 = TEMPLATES[seed2];
      events.push(Object.assign({}, t1, { payload: Object.assign({}, t1.payload), id: 'bot_' + i + '_0', ts: now - (i + 1) * h * 2.1, me: false, name: bot.name, av: bot.av }));
      if (i < 5) {
        events.push(Object.assign({}, t2, { payload: Object.assign({}, t2.payload), id: 'bot_' + i + '_1', ts: now - (i + 1) * h * 6.4, me: false, name: bot.name, av: bot.av }));
      }
    });
    return events;
  }

  /* ── Registra un evento del usuario actual ── */
  function write(type, payload) {
    if (typeof S === 'undefined') return;
    if (!Array.isArray(S._feedEvents)) S._feedEvents = [];
    var ev = {
      id:      Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      type:    type,
      payload: payload || {},
      ts:      Date.now(),
      me:      true,
      name:    (S && S.userName) || 'Tú',
      av:      (S && S.avatar)   || '🌱',
    };
    S._feedEvents.unshift(ev);
    if (S._feedEvents.length > MAX_LOCAL) S._feedEvents.length = MAX_LOCAL;
    _pushSupabase(ev);
  }

  /* ── Push a Supabase (falla silenciosamente si la tabla no existe) ── */
  function _pushSupabase(ev) {
    if (!window._sb || !window._sbUser) return;
    try {
      window._sb.from('community_feed').insert({
        user_id:    window._sbUser.id,
        user_name:  ev.name,
        user_avatar: ev.av,
        event_type: ev.type,
        payload:    ev.payload,
      }).then(function () {}).catch(function () {});
    } catch (_) {}
  }

  /* ── Lee eventos reales de Supabase y los mezcla con los locales ── */
  var _sbEvents    = [];
  var _sbLastFetch = 0;

  function _fetchSupabase() {
    if (!window._sb || !window._sbUser) return;
    var now = Date.now();
    if (now - _sbLastFetch < 60000) return; // rate limit: máx 1 fetch/min
    _sbLastFetch = now;
    try {
      window._sb
        .from('community_feed')
        .select('user_name,user_avatar,event_type,payload,created_at')
        .neq('user_id', window._sbUser.id)
        .order('created_at', { ascending: false })
        .limit(20)
        .then(function (res) {
          if (!res || res.error || !res.data) return;
          _sbEvents = res.data.map(function (r) {
            return {
              id:      'sb_' + r.created_at,
              type:    r.event_type,
              payload: r.payload || {},
              ts:      new Date(r.created_at).getTime(),
              me:      false,
              name:    r.user_name  || 'Explorador',
              av:      r.user_avatar || '🌱',
            };
          });
        }).catch(function () {});
    } catch (_) {}
  }

  /* ── Renderiza el feed en un elemento ── */
  function render(target, limit) {
    var el = typeof target === 'string' ? document.getElementById(target) : target;
    if (!el) return;

    _fetchSupabase();

    var personal = (S && Array.isArray(S._feedEvents)) ? S._feedEvents.slice(0, 20) : [];
    var remote   = _sbEvents;
    var bots     = _botEvents();

    // Mezcla: personales > remotos reales > bots
    var combined = personal.concat(remote).concat(bots);
    // Deduplicar por id
    var seen = {};
    combined = combined.filter(function (ev) {
      if (seen[ev.id]) return false;
      seen[ev.id] = true;
      return true;
    });
    combined.sort(function (a, b) { return b.ts - a.ts; });
    combined = combined.slice(0, limit || 15);

    if (combined.length === 0) {
      el.innerHTML = '<p style="text-align:center;color:var(--text3);font-size:13px;padding:20px 0;">Completa tu primer módulo para ver actividad aquí</p>';
      return;
    }

    el.innerHTML = combined.map(function (ev) {
      var fmt  = _fmt(ev);
      var ago  = _timeAgo(ev.ts);
      var mine = ev.me;
      return '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border);">'
        + '<div style="width:36px;height:36px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:19px;background:var(--bg2);border-radius:50%;' + (mine ? 'border:2px solid var(--accent);' : '') + '">' + ev.av + '</div>'
        + '<div style="flex:1;min-width:0;">'
        + '<div style="font-size:13px;color:var(--text1);line-height:1.45;">' + fmt.text + '</div>'
        + '<div style="display:flex;align-items:center;gap:5px;margin-top:3px;">'
        + '<span style="font-size:11px;">' + fmt.icon + '</span>'
        + '<span style="font-size:11px;color:var(--text3);">' + ago + '</span>'
        + (mine ? '<span style="font-size:10px;color:var(--accent);font-weight:700;margin-left:4px;">TÚ</span>' : '')
        + '</div>'
        + '</div>'
        + '</div>';
    }).join('');
  }

  /* ── Renderiza la pantalla completa s-community ── */
  function renderScreen() {
    var el = document.getElementById('s-community');
    if (!el) return;

    var bodyEl = el.querySelector('#community-feed-full');
    if (!bodyEl) return;

    render(bodyEl, 30);

    // Stats strip
    var totalUsers = 4820 + Math.floor((Date.now() / 3600000) % 200);
    var activeToday = 312 + Math.floor((Date.now() / 600000) % 50);
    var statsEl = el.querySelector('#community-stats');
    if (statsEl) {
      statsEl.innerHTML = ''
        + '<div class="comm-stat"><div class="comm-stat-val">' + totalUsers.toLocaleString('es') + '</div><div class="comm-stat-lbl">Usuarios</div></div>'
        + '<div class="comm-stat"><div class="comm-stat-val" style="color:var(--accent);">' + activeToday + '</div><div class="comm-stat-lbl">Activos hoy</div></div>'
        + '<div class="comm-stat"><div class="comm-stat-val" style="color:var(--gold);">' + (S && S.completedMods ? S.completedMods.length : 0) + '</div><div class="comm-stat-lbl">Tus módulos</div></div>';
    }
  }

  return { write: write, render: render, renderScreen: renderScreen };

})();

window._FEED = _FEED;

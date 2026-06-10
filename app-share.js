/* ═══ app-share.js — Compartir racha + Sistema de referidos ═════
   shareStats()        → genera imagen Canvas y abre share sheet
   showReferralSheet() → modal con código de referido + CTA
══════════════════════════════════════════════════════════════════ */

function generateShareCanvas(cb) {
  var canvas = document.createElement('canvas');
  canvas.width  = 1080;
  canvas.height = 1080;
  var ctx = canvas.getContext('2d');

  // Background
  var bg = ctx.createLinearGradient(0, 0, 1080, 1080);
  bg.addColorStop(0, '#0a0a12');
  bg.addColorStop(1, '#0d1117');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1080);

  // Green glow top-left
  var glow = ctx.createRadialGradient(160, 160, 0, 160, 160, 480);
  glow.addColorStop(0, 'rgba(0,229,160,.14)');
  glow.addColorStop(1, 'rgba(0,229,160,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, 1080, 1080);

  // Border
  ctx.strokeStyle = 'rgba(0,229,160,.2)';
  ctx.lineWidth   = 3;
  ctx.strokeRect(2, 2, 1076, 1076);

  var streak = S.streak || 0;
  var level  = S.level  || 1;
  var xp     = S.xp     || 0;
  var name   = S.userName || '';

  // App name
  ctx.font      = '700 38px -apple-system, sans-serif';
  ctx.fillStyle = '#00e5a0';
  ctx.fillText('FinLearn', 72, 110);

  // Flame emoji + streak number
  ctx.font      = '160px -apple-system, sans-serif';
  ctx.fillText('🔥', 60, 390);

  ctx.font      = '900 200px -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(streak, 260, 390);

  ctx.font      = '500 52px -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,.5)';
  ctx.fillText('d\xEDas de racha', 264, 450);

  // Divider
  ctx.fillStyle = 'rgba(255,255,255,.08)';
  ctx.fillRect(72, 510, 936, 2);

  // Stats
  ctx.font      = '700 52px -apple-system, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Nivel ' + level, 72, 600);

  ctx.font      = '500 44px -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,.45)';
  ctx.fillText(xp.toLocaleString('es') + ' XP', 72, 660);

  if (name) {
    ctx.font      = '500 36px -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,.3)';
    ctx.fillText(name, 72, 740);
  }

  // CTA
  ctx.font      = '600 32px -apple-system, sans-serif';
  ctx.fillStyle = '#00e5a0';
  ctx.fillText('Aprende finanzas jugando → finlearn.app', 72, 960);

  canvas.toBlob(function(blob) { if (cb) cb(blob); }, 'image/png');
}

function shareStats() {
  var streak = S.streak || 0;
  var shareText = '🔥 Llevo ' + streak + ' d\xEDas seguidos aprendiendo finanzas en FinLearn. \xBFMe superas?';

  generateShareCanvas(function(blob) {
    var file = new File([blob], 'finlearn-racha.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: 'Mi racha en FinLearn', text: shareText })
        .catch(function() {});
    } else if (navigator.share) {
      navigator.share({ title: 'Mi racha en FinLearn', text: shareText + ' ' + window.location.origin })
        .catch(function() {});
    } else {
      var url = URL.createObjectURL(blob);
      var a   = document.createElement('a');
      a.href     = url;
      a.download = 'finlearn-racha.png';
      a.click();
      URL.revokeObjectURL(url);
    }
  });
}

function showReferralSheet() {
  if (!S.referralCode) {
    var base = (S.userName || 'FL').replace(/\s+/g, '').toUpperCase().slice(0, 4);
    S.referralCode = base + Math.random().toString(36).slice(2, 6).toUpperCase();
    if (typeof saveState === 'function') saveState();
  }

  var shareUrl = location.origin + '/?ref=' + S.referralCode;

  var modal = document.getElementById('m-referral');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-referral';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = '<div class="sc-modal-backdrop" style="align-items:center;padding:20px;" onclick="closeModal(\'m-referral\')">'
    + '<div class="sc-modal-box ref-modal-box" style="border-radius:20px;max-height:90vh;" onclick="event.stopPropagation()">'
    + '<button class="sc-modal-close" onclick="closeModal(\'m-referral\')">&#x2715;</button>'
    + '<div style="font-size:48px;text-align:center;margin-bottom:8px;">🎁</div>'
    + '<div style="font-size:20px;font-weight:900;color:var(--text);text-align:center;margin-bottom:6px;">Invita a tus amigos</div>'
    + '<div style="font-size:13px;color:var(--text2);text-align:center;margin-bottom:18px;">Tu amigo recibir\xE1 <strong style="color:var(--accent)">+500 XP</strong> al unirse con tu enlace</div>'
    + '<div class="ref-code-box" onclick="_copyRefCode(\'' + shareUrl + '\')">'
    +   '<div class="ref-code-label">Tu c\xF3digo de invitaci\xF3n</div>'
    +   '<div class="ref-code-val">' + S.referralCode + '</div>'
    +   '<div class="ref-code-copy">📋 Toca para copiar el enlace</div>'
    + '</div>'
    + '<button class="sc-spin-btn" style="margin-top:14px;max-width:100%;" onclick="_shareRefLink(\'' + shareUrl + '\')">&#x1F4E4; Compartir enlace</button>'
    + '</div></div>';

  if (typeof openModal === 'function') openModal('m-referral');
}

function _copyRefCode(url) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(function() {
      if (typeof toast === 'function') toast('📋 Copiado', 'Enlace copiado. \xA1Comp\xE1rtelo con tus amigos!', 't-success');
    }).catch(function() { _fallbackCopy(url); });
  } else {
    _fallbackCopy(url);
  }
}

function _fallbackCopy(url) {
  var ta = document.createElement('textarea');
  ta.value = url;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(ta);
  if (typeof toast === 'function') toast('📋 Copiado', 'Enlace listo para pegar.', 't-success');
}

function _shareRefLink(url) {
  if (navigator.share) {
    navigator.share({
      title: 'Aprende finanzas conmigo en FinLearn',
      text: 'Unirse con mi enlace y recibe +500 XP de regalo 🎁',
      url: url
    }).catch(function() { _copyRefCode(url); });
  } else {
    _copyRefCode(url);
  }
}

window.shareStats        = shareStats;
window.showReferralSheet = showReferralSheet;
window._copyRefCode      = _copyRefCode;
window._shareRefLink     = _shareRefLink;

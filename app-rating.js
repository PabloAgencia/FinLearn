/* ═══ app-rating.js — NPS en momentos de euforia ════════════════
   _checkShowRating()  → evalúa si es buen momento para pedir rating
   _showRatingModal()  → muestra el modal con 5 estrellas
══════════════════════════════════════════════════════════════════ */

var _ratScore = 0;

function _checkShowRating() {
  if (window._ratingShownThisSession) return;
  var level  = S.level  || 1;
  var streak = S.streak || 0;
  var isMilestoneLevel = level > 1 && level % 5 === 0;
  var isStreakMilestone = streak === 7 || streak === 14 || streak === 30;
  if (!isMilestoneLevel && !isStreakMilestone) return;
  // Permitir nuevo prompt en cada milestone de nivel
  if (isMilestoneLevel && (S.ratingShownAtLevel || 0) >= level) return;
  window._ratingShownThisSession = true;
  setTimeout(_showRatingModal, 1400);
}

function _showRatingModal() {
  var modal = document.getElementById('m-rating');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'm-rating';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  var stars = [1,2,3,4,5].map(function(n) {
    return '<button class="rat-star" id="rat-s' + n + '" onclick="_ratSelect(' + n + ')">⭐</button>';
  }).join('');

  modal.innerHTML = '<div class="sc-modal-backdrop" onclick="closeModal(\'m-rating\')">'
    + '<div class="sc-modal-box rat-box" onclick="event.stopPropagation()">'
    +   '<button class="sc-modal-close" onclick="closeModal(\'m-rating\')">&#x2715;</button>'
    +   '<div style="font-size:44px;text-align:center;margin-bottom:6px;">🌟</div>'
    +   '<div class="rat-title">\xBFCu\xE1nto recomendar\xEDas FinLearn?</div>'
    +   '<div class="rat-sub">Tu opini\xF3n nos ayuda a mejorar para todos</div>'
    +   '<div class="rat-stars-row">' + stars + '</div>'
    +   '<div id="rat-feedback" style="display:none;margin-top:12px;">'
    +     '<textarea id="rat-text" class="rat-textarea" placeholder="\xBFQu\xE9 mejorar\xEDas?"></textarea>'
    +     '<button class="sc-spin-btn" style="margin-top:8px;font-size:14px;padding:12px;max-width:100%;" onclick="_ratSubmit()">Enviar feedback</button>'
    +   '</div>'
    + '</div></div>';

  openModal('m-rating');
}

function _ratSelect(n) {
  _ratScore = n;
  for (var i = 1; i <= 5; i++) {
    var el = document.getElementById('rat-s' + i);
    if (el) el.style.opacity = i <= n ? '1' : '.25';
  }
  if (n >= 4) {
    setTimeout(_ratSubmit, 350);
  } else {
    var fb = document.getElementById('rat-feedback');
    if (fb) fb.style.display = 'block';
  }
}

function _ratSubmit() {
  S.ratingShown = true;
  S.ratingShownAtLevel = S.level || 1;
  S.ratingScore = _ratScore;
  saveState();
  closeModal('m-rating');

  if (_ratScore >= 4) {
    setTimeout(function() {
      if (typeof toast === 'function') toast('🙏 \xA1Gracias!', 'Comparte FinLearn con tus amigos 🚀', 't-success');
      setTimeout(function() { if (typeof shareStats === 'function') shareStats(); }, 900);
    }, 200);
  } else {
    if (typeof toast === 'function') toast('🙏 Gracias por tu feedback', 'Lo tendremos en cuenta para mejorar.', 't-success');
  }
}

window._checkShowRating = _checkShowRating;
window._ratSelect       = _ratSelect;
window._ratSubmit       = _ratSubmit;

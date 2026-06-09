/* ═══ app-simulator.js — Cartera de inversión virtual ═══════════
   SIM_renderWidget() → tarjeta compacta en home
   SIM_open()         → modal completo con activos + compraventa
══════════════════════════════════════════════════════════════════ */

var SIM_ASSETS = [
  { id:'sp500', name:'S&P 500 ETF',  icon:'📊', base:100,   vol:.012, color:'#00e5a0', desc:'Las 500 mayores empresas de EE.UU.' },
  { id:'btc',   name:'Bitcoin',      icon:'🟠', base:45000, vol:.045, color:'#f7931a', desc:'La criptomoneda original' },
  { id:'apple', name:'Apple',        icon:'🍎', base:185,   vol:.018, color:'#aaaaaa', desc:'La empresa más valiosa del mundo' },
  { id:'tesla', name:'Tesla',        icon:'⚡', base:250,   vol:.038, color:'#e82127', desc:'Coches eléctricos e innovación' },
  { id:'gold',  name:'Oro',          icon:'🥇', base:2000,  vol:.008, color:'#ffd700', desc:'El activo refugio clásico' },
  { id:'bonds', name:'Bonos 10 años',icon:'🏦', base:100,   vol:.003, color:'#74b9ff', desc:'Renta fija segura y estable' },
];

var _simCache    = {};
var SIM_BASE_DAY = new Date('2024-01-01').getTime();

function _simHash(str) {
  var h = 0;
  for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return Math.abs(h) || 1;
}

function _simLcg(seed) {
  seed = (Math.imul ? Math.imul(seed, 1664525) : seed * 1664525) + 1013904223;
  return ((seed >>> 0) / 0xFFFFFFFF);
}

function _simDays(dateStr) {
  return Math.max(0, Math.floor((new Date(dateStr).getTime() - SIM_BASE_DAY) / 86400000));
}

function SIM_getPrice(assetId, dateStr) {
  var d = dateStr || new Date().toISOString().slice(0, 10);
  var key = assetId + '|' + d;
  if (_simCache[key]) return _simCache[key];

  var asset = SIM_ASSETS.find(function(a) { return a.id === assetId; });
  if (!asset) return 0;
  var days  = _simDays(d);
  var price = asset.base;
  for (var i = 0; i <= days; i++) {
    var s   = _simHash(assetId + i);
    var rnd = _simLcg(s) * 2 - 1;
    price  *= (1 + rnd * asset.vol + 0.0001);
  }
  price = Math.max(asset.base * 0.1, price);
  _simCache[key] = price;
  return price;
}

function SIM_getDayReturn(assetId, dateStr) {
  var d  = dateStr || new Date().toISOString().slice(0, 10);
  var d1 = new Date(d); d1.setDate(d1.getDate() - 1);
  var cur = SIM_getPrice(assetId, d);
  var prv = SIM_getPrice(assetId, d1.toISOString().slice(0, 10));
  return prv > 0 ? (cur - prv) / prv : 0;
}

function SIM_init() {
  if (S.sim) return;
  S.sim = { cash: 10000, holdings: {}, startValue: 10000, startDate: new Date().toISOString().slice(0, 10) };
  saveState();
}

function SIM_portfolioValue() {
  if (!S.sim) return 10000;
  var today = new Date().toISOString().slice(0, 10);
  var total = S.sim.cash || 0;
  Object.keys(S.sim.holdings || {}).forEach(function(id) {
    var h = S.sim.holdings[id];
    if (h && h.units > 0) total += h.units * SIM_getPrice(id, today);
  });
  return total;
}

function SIM_renderWidget() {
  var el = document.getElementById('sim-widget');
  if (!el || !S.userName) return;

  if (!S.sim) {
    el.innerHTML = '<div class="sim-cta-card" onclick="SIM_open()">'
      + '<div class="sim-cta-left">'
      +   '<div class="sim-cta-icon">💼</div>'
      +   '<div><div class="sim-cta-title">Cartera Virtual</div>'
      +   '<div class="sim-cta-sub">Invierte €10.000 virtuales en bolsa, cripto y más sin riesgo real</div></div>'
      + '</div>'
      + '<div class="sim-cta-arr">→</div>'
      + '</div>';
    return;
  }

  var today   = new Date().toISOString().slice(0, 10);
  var total   = SIM_portfolioValue();
  var gain    = total - (S.sim.startValue || 10000);
  var gainPct = (gain / (S.sim.startValue || 10000) * 100).toFixed(1);
  var pos     = gain >= 0;

  var pills = Object.keys(S.sim.holdings || {})
    .filter(function(id) { return S.sim.holdings[id].units > 0; })
    .map(function(id) {
      var asset = SIM_ASSETS.find(function(a) { return a.id === id; });
      var ret   = SIM_getDayReturn(id, today);
      var cls   = ret >= 0 ? 'sim-pill sim-pos-pill' : 'sim-pill sim-neg-pill';
      return '<span class="' + cls + '">' + (asset ? asset.icon : id) + ' ' + (ret >= 0 ? '+' : '') + (ret * 100).toFixed(1) + '%</span>';
    }).slice(0, 3).join('');

  el.innerHTML = '<div class="sim-widget-card" onclick="SIM_open()">'
    + '<div class="sim-w-top">'
    +   '<span class="sim-w-label">💼 Cartera Virtual</span>'
    +   '<span class="' + (pos ? 'sim-pos' : 'sim-neg') + ' sim-w-ret">' + (pos ? '+' : '') + gainPct + '%</span>'
    + '</div>'
    + '<div class="sim-w-value">€' + Math.round(total).toLocaleString('es') + '</div>'
    + (pills ? '<div class="sim-pills-row">' + pills + '</div>' : '<div class="sim-w-hint">Toca para gestionar tu cartera</div>')
    + '</div>';
}

function SIM_open() {
  SIM_init();
  var today = new Date().toISOString().slice(0, 10);
  var total = SIM_portfolioValue();
  var gain  = total - (S.sim.startValue || 10000);
  var pos   = gain >= 0;

  var assetsHTML = SIM_ASSETS.map(function(asset) {
    var price   = SIM_getPrice(asset.id, today);
    var dayRet  = SIM_getDayReturn(asset.id, today);
    var holding = S.sim.holdings[asset.id];
    var holdVal = holding ? (holding.units * price) : 0;
    var invested = holding ? (holding.invested || 0) : 0;
    var pnl     = holdVal - invested;

    var holdHTML = holdVal > 0.5
      ? '<div class="sim-hold-wrap">'
      +   '<span class="sim-hold-val">€' + Math.round(holdVal).toLocaleString('es') + '</span>'
      +   '<span class="' + (pnl >= 0 ? 'sim-pos' : 'sim-neg') + ' sim-hold-pnl">' + (pnl >= 0 ? '+' : '') + '€' + Math.abs(pnl).toFixed(0) + '</span>'
      + '</div>'
      : '';

    return '<div class="sim-asset-row">'
      + '<div class="sim-asset-icon">' + asset.icon + '</div>'
      + '<div class="sim-asset-body">'
      +   '<div class="sim-asset-name">' + asset.name + '</div>'
      +   '<div class="sim-asset-price">€' + (price < 1000 ? price.toFixed(2) : Math.round(price).toLocaleString('es'))
      +   ' <span class="' + (dayRet >= 0 ? 'sim-pos' : 'sim-neg') + '">' + (dayRet >= 0 ? '+' : '') + (dayRet * 100).toFixed(2) + '%</span></div>'
      + '</div>'
      + holdHTML
      + '<button class="sim-invest-btn" onclick="event.stopPropagation();SIM_openBuy(\'' + asset.id + '\')">Invertir</button>'
      + '</div>';
  }).join('');

  var modal = document.getElementById('m-simulator');
  if (!modal) { modal = document.createElement('div'); modal.id = 'm-simulator'; modal.className = 'modal-overlay'; document.body.appendChild(modal); }

  modal.innerHTML = '<div class="sc-modal-backdrop" onclick="closeModal(\'m-simulator\')">'
    + '<div class="sim-modal-box" onclick="event.stopPropagation()">'
    +   '<div class="sim-modal-header">'
    +     '<button class="sc-modal-close" onclick="closeModal(\'m-simulator\')">&#x2715;</button>'
    +     '<div class="sim-modal-title">💼 Cartera Virtual</div>'
    +     '<div class="sim-modal-value">€' + Math.round(total).toLocaleString('es') + '</div>'
    +     '<div class="' + (pos ? 'sim-pos' : 'sim-neg') + ' sim-modal-ret">' + (pos ? '+' : '') + '€' + Math.abs(gain).toFixed(0) + ' (' + (pos ? '+' : '') + (gain / (S.sim.startValue || 10000) * 100).toFixed(2) + '%)</div>'
    +     '<div class="sim-modal-cash">💵 Disponible: <strong>€' + Math.round(S.sim.cash || 0).toLocaleString('es') + '</strong></div>'
    +   '</div>'
    +   '<div class="sim-modal-scroll">'
    +     '<div class="sim-section-label">Activos disponibles</div>'
    +     assetsHTML
    +   '</div>'
    + '</div></div>';

  openModal('m-simulator');
}

var _simBuyId = null;

function SIM_openBuy(assetId) {
  _simBuyId = assetId;
  var asset   = SIM_ASSETS.find(function(a) { return a.id === assetId; });
  if (!asset) return;
  var today   = new Date().toISOString().slice(0, 10);
  var price   = SIM_getPrice(assetId, today);
  var cash    = S.sim.cash || 0;
  var holding = S.sim.holdings[assetId];
  var holdVal = holding ? (holding.units * price) : 0;

  var buyBtns = [100, 500, 1000, 2500].filter(function(a) { return a <= cash + 0.5; })
    .map(function(a) { return '<button class="sim-quick-btn" onclick="SIM_buy(\'' + assetId + '\',' + a + ')">€' + a.toLocaleString('es') + '</button>'; }).join('');

  var sellHTML = holdVal > 1
    ? '<div class="sim-sell-section">'
    +   '<div class="sim-section-label">Tienes €' + holdVal.toFixed(0) + ' en ' + asset.name + '</div>'
    +   '<div class="sim-quick-row">'
    +     '<button class="sim-sell-btn" onclick="SIM_sell(\'' + assetId + '\',.25)">Vender 25%</button>'
    +     '<button class="sim-sell-btn" onclick="SIM_sell(\'' + assetId + '\',.5)">50%</button>'
    +     '<button class="sim-sell-btn" onclick="SIM_sell(\'' + assetId + '\',1)">Todo</button>'
    +   '</div></div>'
    : '';

  var buy = document.getElementById('m-sim-buy');
  if (!buy) { buy = document.createElement('div'); buy.id = 'm-sim-buy'; buy.className = 'modal-overlay'; document.body.appendChild(buy); }

  buy.innerHTML = '<div class="sc-modal-backdrop" onclick="closeModal(\'m-sim-buy\')">'
    + '<div class="sim-buy-box" onclick="event.stopPropagation()">'
    +   '<button class="sc-modal-close" onclick="closeModal(\'m-sim-buy\')">&#x2715;</button>'
    +   '<div class="sim-buy-icon">' + asset.icon + '</div>'
    +   '<div class="sim-buy-name">' + asset.name + '</div>'
    +   '<div class="sim-buy-price">€' + (price < 1000 ? price.toFixed(2) : Math.round(price).toLocaleString('es')) + ' por unidad</div>'
    +   '<div class="sim-section-label">¿Cuánto invertir?</div>'
    +   (buyBtns ? '<div class="sim-quick-row">' + buyBtns + '</div>' : '<div style="font-size:13px;color:var(--text3);text-align:center;">Sin capital suficiente</div>')
    +   sellHTML
    + '</div></div>';

  openModal('m-sim-buy');
}

function SIM_buy(assetId, euros) {
  if (!S.sim) SIM_init();
  if (euros > (S.sim.cash || 0) + 0.5) {
    if (typeof toast === 'function') toast('💵 Sin fondos', 'No tienes suficiente capital disponible.', 't-warn');
    return;
  }
  var today   = new Date().toISOString().slice(0, 10);
  var price   = SIM_getPrice(assetId, today);
  var units   = euros / price;
  if (!S.sim.holdings[assetId]) S.sim.holdings[assetId] = { units: 0, invested: 0 };
  S.sim.holdings[assetId].units    += units;
  S.sim.holdings[assetId].invested  = (S.sim.holdings[assetId].invested || 0) + euros;
  S.sim.cash -= euros;

  S.xp = (S.xp || 0) + 10;
  saveState();

  var asset = SIM_ASSETS.find(function(a) { return a.id === assetId; });
  if (typeof toast === 'function') toast(asset.icon + ' Invertido', '€' + euros.toLocaleString('es') + ' en ' + asset.name + ' — ' + units.toFixed(4) + ' unidades.', 't-success');
  if (typeof spawnXP === 'function') spawnXP('+10 XP 💼');

  closeModal('m-sim-buy');
  setTimeout(function() { SIM_open(); SIM_renderWidget(); }, 200);
}

function SIM_sell(assetId, pct) {
  if (!S.sim || !S.sim.holdings[assetId]) return;
  var today    = new Date().toISOString().slice(0, 10);
  var price    = SIM_getPrice(assetId, today);
  var h        = S.sim.holdings[assetId];
  var sold     = h.units * pct;
  var proceeds = sold * price;

  h.units    -= sold;
  h.invested  = Math.max(0, (h.invested || 0) * (1 - pct));
  S.sim.cash += proceeds;
  if (h.units < 0.0001) delete S.sim.holdings[assetId];

  saveState();
  var asset = SIM_ASSETS.find(function(a) { return a.id === assetId; });
  if (typeof toast === 'function') toast(asset.icon + ' Vendido', '€' + proceeds.toFixed(0) + ' de vuelta a tu cartera.', 't-success');

  closeModal('m-sim-buy');
  setTimeout(function() { SIM_open(); SIM_renderWidget(); }, 200);
}

window.SIM_open         = SIM_open;
window.SIM_openBuy      = SIM_openBuy;
window.SIM_buy          = SIM_buy;
window.SIM_sell         = SIM_sell;
window.SIM_renderWidget = SIM_renderWidget;

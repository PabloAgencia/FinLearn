function renderPortfolioSummary() {
  if (!S.portfolio) return;
  let totalVal = 0, totalInvested = 0;
  Object.entries(S.portfolio).forEach(([ticker, pos]) => {
    const price = GAME.stockPrices[ticker] || STOCKS.find(s => s.ticker === ticker)?.price || 0;
    totalVal     += price * pos.shares;
    totalInvested += pos.avgPrice * pos.shares;
  });
  const gains = totalVal - totalInvested;
  const pct   = totalInvested > 0 ? (gains / totalInvested * 100).toFixed(2) : 0;
  const up    = gains >= 0;

  setEl('port-total-val', '€' + totalVal.toFixed(2));
  setEl('port-total-change', `${up ? '+' : ''}€${gains.toFixed(2)} (${up ? '+' : ''}${pct}%) total`);
  const changeEl = document.getElementById('port-total-change');
  if (changeEl) changeEl.className = `port-change ${up ? 'up' : 'down'}`;
  setEl('port-invested-val', '€' + totalInvested.toFixed(0));
  setEl('port-gains-val', (up ? '+' : '') + '€' + gains.toFixed(0));
  setEl('port-divs-val', '€' + (S.totalDividends || 0).toFixed(2));
  setEl('port-cash-nav', fmtPrice(S.cash || 0));

  // Mostrar efectivo real vs nominal si hay inflación acumulada
  if ((S.gameYear || 0) > 0) {
    const realCash = getCashRealValue();
    const lostPct  = ((1 - realCash / S.cash) * 100).toFixed(1);
    const infoEl   = document.getElementById('port-inflation-info');
    if (infoEl) {
      infoEl.innerHTML = `💸 Efectivo: ${fmtPrice(S.cash)} nominal · <span style="color:var(--danger);">${fmtPrice(realCash)} real (−${lostPct}% por inflación)</span>`;
      infoEl.style.display = 'block';
    }
  }

  renderMyPositions();
}


function renderMyPositions() {
  const section = document.getElementById('port-positions-section');
  const list    = document.getElementById('port-positions');
  if (!section || !list) return;
  const owned = Object.entries(S.portfolio || {}).filter(([, p]) => p.shares > 0);
  if (!owned.length) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  list.innerHTML = owned.map(([ticker, pos]) => {
    const stock = STOCKS.find(s => s.ticker === ticker);
    if (!stock) return '';
    const price = GAME.stockPrices[ticker] || stock.price;
    const val   = price * pos.shares;
    const pnl   = (price - pos.avgPrice) * pos.shares;
    const up    = pnl >= 0;
    return `<div class="stock-card owned" onclick="openStockModal('${ticker}')">
      <div class="sc-logo" style="background:${stock.bg};">${stock.icon}</div>
      <div class="sc-info">
        <div class="sc-name">${stock.name}</div>
        <div class="sc-ticker">${ticker} · ${pos.shares} uds · Coste medio: ${fmtPrice(pos.avgPrice)}</div>
        <div class="sc-owned">Dividendos: €${(pos.dividendsCollected || 0).toFixed(2)} · Año juego ${S.gameYear || 0}</div>
      </div>
      <div class="sc-right">
        <div class="sc-price">€${val.toFixed(0)}</div>
        <div class="sc-pct ${up ? 'up' : 'down'}">${up ? '+' : ''}€${pnl.toFixed(2)}</div>
      </div>
    </div>`;
  }).join('');
}


function renderMiniChart(ticker) {
  const hist = GAME.priceHistory[ticker] || [];
  const el   = document.getElementById('sdh-chart');
  if (!el || hist.length < 2) return;
  const min  = Math.min(...hist);
  const max  = Math.max(...hist);
  const range = max - min || 1;
  const w = 320, h = 68;
  const pts = hist.map((v, i) =>
    `${(i / (hist.length - 1)) * w},${h - ((v - min) / range) * (h - 8) + 4}`
  ).join(' ');
  const up  = hist[hist.length - 1] >= hist[0];
  const col = up ? '#00e5a0' : '#ef4444';
  el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="${col}" stop-opacity=".3"/>
      <stop offset="100%" stop-color="${col}" stop-opacity="0"/>
    </linearGradient></defs>
    <polygon points="${pts} ${w},${h} 0,${h}" fill="url(#cg)"/>
    <polyline points="${pts}" fill="none" stroke="${col}" stroke-width="2"/>
  </svg>`;
}


function updateQtyDisplay() {
  if (!GAME.currentStock) return;
  const price  = GAME.stockPrices[GAME.currentStock.ticker] || GAME.currentStock.price;
  const qtyEl  = document.getElementById('stock-qty');
  if (qtyEl) {
    if (qtyEl.tagName === 'INPUT') qtyEl.value = GAME.stockQty;
    else qtyEl.textContent = GAME.stockQty;
  }
  setEl('stock-total', 'Total: ' + fmtPrice(price * GAME.stockQty));
}


function showDividendPopup(stock, amount) {
  toast('💰 Dividendos recibidos', `Has recibido ${amount.toFixed(2)}€ en dividendos de ${stock.ticker}`, 't-success');
}


/* ── Negocios (Business game) ─────────────────────────────── */


function renderBusinesses() {
  const available  = document.getElementById('businesses-list');
  const mySection  = document.getElementById('my-businesses-section');
  const myList     = document.getElementById('my-businesses-list');
  if (!available) return;

  const owned = Object.keys(S.businesses || {});

  // ── Mis negocios activos ──────────────────────────────
  const myBizsHtml = owned.map(id => {
    const biz   = BUSINESSES.find(b => b.id === id);
    const state = S.businesses[id];
    if (!biz) return '';
    const rev    = calcBizRevenue(id);
    const profit = rev - biz.monthlyExpenses;
    const upgCount = (state.upgrades || []).length;
    const maxUpg   = biz.upgrades?.length || 0;
    const isVol    = biz.isVolatile ? '<span style="font-size:10px;color:var(--accent3);">⚡ variable</span>' : '';
    const isFail   = biz.failChance ? `<span style="font-size:10px;color:var(--loss);">⚠️ riesgo ${Math.round(biz.failChance*100)}%/mes</span>` : '';
    return `<div class="biz-card owned" onclick="openBizModal('${id}')">
      <div class="bc-top">
        <div class="bc-icon" style="background:rgba(251,191,36,.1);">${biz.icon}</div>
        <div class="bc-info">
          <div class="bc-name">${biz.name}</div>
          <div class="bc-type">${biz.type} ${isVol}${isFail}</div>
        </div>
        <div class="bc-right">
          <div style="color:var(--gain);font-family:'DM Mono',monospace;font-size:14px;font-weight:700;">+€${profit.toFixed(0)}/mes</div>
          <div style="font-size:10px;color:var(--text2);margin-top:2px;">Beneficio neto</div>
        </div>
      </div>
      <div class="biz-progress">
        <div class="biz-prog-label">
          <span>Mejoras ${upgCount}/${maxUpg}</span>
          <span style="color:var(--gold);">ROI ${calcBizROI(id).toFixed(1)}%</span>
        </div>
        <div class="biz-level-bar"><div class="biz-level-fill" style="width:${maxUpg ? upgCount/maxUpg*100 : 0}%;"></div></div>
      </div>
    </div>`;
  }).join('');
  if (myList)    myList.innerHTML = myBizsHtml;
  if (mySection) mySection.style.display = owned.length > 0 ? 'block' : 'none';

  // ── Marketplace — categorizado por tier ──────────────
  const notOwned = BUSINESSES.filter(b => !owned.includes(b.id));
  const tiers = [
    { id:'basic',        label:'🌱 Para todos',          color:'var(--accent)' },
    { id:'senior',       label:'💼 Nivel Senior',         color:'var(--accent2)' },
    { id:'entrepreneur', label:'🚀 Nivel Emprendedor',    color:'var(--accent3)' },
  ];

  available.innerHTML = tiers.map(tier => {
    const bizsInTier = notOwned.filter(b => b.tier === tier.id);
    if (!bizsInTier.length) return '';

    const cards = bizsInTier.map(biz => {
      const canAfford = (S.cash || 0) >= biz.cost;
      const unlocked  = isBusinessUnlocked(biz);
      const lockReason = getBusinessLockReason(biz);
      const isLocked  = !unlocked;

      const riskBadge = {low:'🟢 Bajo',med:'🟡 Medio',high:'🔴 Alto'}[biz.riskLevel] || biz.riskLevel;
      const specialBadge = biz.isVolatile  ? '<span class="biz-tag" style="background:rgba(255,107,53,.1);color:var(--accent3);">⚡ Ingresos variables</span>' :
                           biz.failChance  ? `<span class="biz-tag" style="background:rgba(255,75,92,.1);color:var(--loss);">⚠️ ${Math.round(biz.failChance*100)}% fracaso/mes</span>` : '';
      const freeBadge  = biz.cost === 0   ? '<span class="biz-tag" style="background:rgba(0,255,136,.1);color:var(--gain);">✅ Gratis</span>' : '';

      return `<div class="biz-card ${isLocked?'locked':''} ${!canAfford&&!isLocked?'locked':''}"
                   onclick="${!isLocked&&canAfford?`openBizModal('${biz.id}')`:''}"
                   style="${isLocked||!canAfford?'cursor:not-allowed;':''}">
        <div class="bc-top">
          <div class="bc-icon" style="background:rgba(251,191,36,.07);">${biz.icon}</div>
          <div class="bc-info">
            <div class="bc-name">${biz.name}</div>
            <div class="bc-type">${biz.type}</div>
          </div>
          <div class="bc-right">
            ${biz.cost > 0 ? `<div class="bc-price">${fmtPrice(biz.cost)}</div>` : '<div class="bc-price" style="color:var(--gain);">Gratis</div>'}
            <div class="bc-revenue">+€${(biz.monthlyRevenue - biz.monthlyExpenses).toFixed(0)}/mes neto</div>
          </div>
        </div>
        ${isLocked ? `<div style="font-size:11px;color:var(--loss);margin-bottom:8px;padding:6px 10px;background:rgba(255,75,92,.07);border-radius:6px;">${lockReason}</div>` : ''}
        <div class="biz-stats-row">
          <span class="biz-tag risk-${biz.riskLevel}">${riskBadge} riesgo</span>
          ${specialBadge}${freeBadge}
          <span class="biz-tag" style="background:rgba(168,85,247,.1);color:var(--accent4);">ROI ${biz.cost > 0 ? (((biz.monthlyRevenue - biz.monthlyExpenses) * 12 / biz.cost) * 100).toFixed(1) : '∞'}%/año</span>
          ${!isLocked && !canAfford ? '<span class="biz-tag" style="background:rgba(239,68,68,.1);color:var(--danger);">Sin fondos</span>' : ''}
        </div>
        <div style="font-size:11px;color:var(--text3);margin-top:8px;line-height:1.4;border-top:1px solid var(--border);padding-top:8px;">💡 ${biz.learnNote||biz.desc}</div>
      </div>`;
    }).join('');

    return `<div class="biz-tier-section">
      <div class="biz-tier-header" style="border-left:3px solid ${tier.color};">
        <span style="color:${tier.color};font-weight:700;">${tier.label}</span>
      </div>
      ${cards}
    </div>`;
  }).join('');

  renderBizCashflow();
}


function renderBizCashflow() {
  const owned = Object.keys(S.businesses||{});
  let gross=0, exp=0;
  owned.forEach(id=>{
    const biz=BUSINESSES.find(b=>b.id===id);
    if(!biz) return;
    gross+=calcBizRevenue(id);
    exp+=biz.monthlyExpenses;
  });
  const net=gross-exp;
  setEl('biz-total-cashflow',(net>=0?'+':'')+'€'+net.toFixed(0)+'/mes');
  setEl('biz-gross','€'+gross.toFixed(0));
  setEl('biz-expenses','-€'+exp.toFixed(0));
  setEl('biz-count',owned.length);
  setEl('biz-cash-pill','💰 '+fmtPrice(S.cash||0));
  setEl('biz-cf-sub', owned.length>0
    ? `${owned.length} ${owned.length===1?'negocio activo':'negocios activos'} · Próximo cobro el día 1`
    : 'Adquiere negocios para generar ingresos pasivos');
  setEl('biz-cash-display', '€'+Math.round(S.cash||0).toLocaleString('es'));
}


/* ── Simulador de vida ────────────────────────────────────── */



// ═══ UI — Social ═══
/* ══════════════════════════════════════════════════════════════════
   ui-social.js — Rankings · Podio · Logros · Actividad · Datos financieros · Countdown
   ─ Importa solo lo necesario de data.js y state.js.
   ─ No importa de script.js → sin dependencias circulares.
   ─ Las funciones de negocio (addXP, etc.) se acceden via window.*
     porque script.js las expone al arrancar la app.
══════════════════════════════════════════════════════════════════ */



function renderChallengeMembers() {
  document.getElementById('chal-members').innerHTML = CHALLENGE.map(u => `
    <div class="chal-row">
      <span style="font-size:16px;">${u.em}</span>
      <span class="chal-name ${u.me?'me':''}">${u.me ? S.userName || u.n : u.n}</span>
      <div class="chal-pbar"><div class="pbar"><div class="pbar-fill ${u.me?'':'purple'}" style="width:${u.pct}%;${u.me?'':''}"></div></div></div>
      <span class="chal-pct">${u.pct}%</span>
    </div>
  `).join('');
}


/* ── Rankings & Podio ─────────────────────────────────────── */


function renderHomeRank() {
  const list = _getLiveRankingsEnhanced();
  const top  = list.slice(0, 5);
  const me   = list.find(r => r.me);
  const rows = (me && !top.includes(me)) ? [...top, me] : top;
  const html = rows.map(rankRow).join('');
  const el = document.getElementById('home-rank-list');
  if (el) el.innerHTML = html;
  const profileEl = document.getElementById('home-rank-list-profile');
  if (profileEl) profileEl.innerHTML = html;
}


function rankRow(r) {
  const medals = {1:'🥇',2:'🥈',3:'🥉'};
  let nameHtml;
  if (r.me) {
    nameHtml = (S.userName || 'Tú') + ' <span style="color:var(--accent);font-size:10px;">TÚ</span>';
  } else if (r.shadow) {
    nameHtml = `${r.n} <span class="shadow-badge">${r.badge}</span>`;
  } else {
    nameHtml = r.n;
  }
  const shadowClass = r.shadow ? 'shadow-investor' : '';

  // F33: streak identity visual en el ranking
  const streak = r.str || 0;
  let streakHtml = '';
  if (r.shadow) {
    streakHtml = '—';
  } else if (streak >= 100) {
    streakHtml = `<span class="f33-rank-streak f33-rank-legend" title="Leyenda — ${streak} días">👑🔥<span class="f33-rsn">${streak}</span></span>`;
  } else if (streak >= 60) {
    streakHtml = `<span class="f33-rank-streak f33-rank-aura" title="${streak} días de racha">🔥<span class="f33-rsn">${streak}</span></span>`;
  } else if (streak >= 30) {
    streakHtml = `<span class="f33-rank-streak f33-rank-crown" title="${streak} días de racha">👑🔥<span class="f33-rsn">${streak}</span></span>`;
  } else if (streak >= 7) {
    streakHtml = `<span class="f33-rank-streak f33-rank-hot" title="${streak} días de racha">🔥<span class="f33-rsn">${streak}</span></span>`;
  } else {
    streakHtml = `<span class="f33-rank-streak">🔥${streak}</span>`;
  }

  const rowExtra = streak >= 100 ? ' f33-row-legend' : streak >= 60 ? ' f33-row-aura' : '';
  return `
  <div class="rank-row ${r.me ? 'me' : ''} ${shadowClass}${rowExtra}" ${r.shadow ? `title="${r.tip}"` : ''}>
    <div class="rank-pos">${medals[r.pos] || r.pos}</div>
    <div class="rank-av" style="background:linear-gradient(135deg,${r.cl}44,${r.cl}18);font-size:15px;">${r.em}</div>
    <div class="rank-name">${nameHtml}</div>
    <div class="rank-str">${streakHtml}</div>
    <div class="rank-xp">${r.xp.toLocaleString('es')} XP</div>
  </div>`;
}


function renderFullRank() {
  const list = _getLiveRankingsEnhanced();
  const el = document.getElementById('full-rank-list');
  if (el) el.innerHTML = list.map(rankRow).join('');
}


function renderPodium() {
  const list  = _getLiveRankingsEnhanced();
  const t     = list.slice(0, 3);
  const order = [t[1], t[0], t[2]];
  const cls   = ['second', 'first', 'third'];
  const hs    = [58, 75, 44];
  const el = document.getElementById('podium');
  if (!el) return;
  const weeklyXP = Math.max(0, (S.xp || 0) - (S.leagueWeekXPBase || 0));
  if (weeklyXP === 0 && (S.completedMods || []).length === 0) {
    el.innerHTML = `<div style="padding:24px;text-align:center;background:var(--surface);border-radius:16px;border:1px dashed var(--border);">
      <div style="font-size:36px;margin-bottom:8px;opacity:.5;">🏆</div>
      <div style="font-size:13px;color:var(--text2);">Completa tu primer módulo para aparecer en el ranking.</div>
    </div>`;
    return;
  }
  el.innerHTML = order.map((r, i) => r ? `
    <div class="pd-slot ${cls[i]}">
      <div class="pd-name">${r.n.split(' ')[0]}</div>
      <div class="pd-av" style="background:linear-gradient(135deg,${r.cl}44,${r.cl}18);font-size:${i===1?22:17}px;">${r.em}</div>
      <div class="pd-block" style="height:${hs[i]}px;">${r.pos}</div>
      <div class="pd-xp">${r.xp.toLocaleString('es')} XP</div>
    </div>` : '').join('');
}


function renderAchievements() {
  const el = document.getElementById('ach-grid');
  if (!el) return;

  const unlocked = S.unlockedAchs || [];
  const total    = ACHIEVEMENTS.length;
  const doneCount= unlocked.length;

  el.className = 'ach-grid-v2';
  el.innerHTML = ACHIEVEMENTS.map(a => {
    const ok = unlocked.includes(a.id) || (a.check && a.check(S));
    return `<div class="ach-v2 ${ok ? 'unlocked' : 'locked'}">
      ${ok ? '<div class="ach-v2-check">✓</div>' : ''}
      <div class="ach-v2-icon">${ok ? a.i : '🔒'}</div>
      <div class="ach-v2-name">${a.n}</div>
      <div class="ach-v2-desc">${a.desc}</div>
    </div>`;
  }).join('');

  // Summary line above grid
  const summary = el.previousElementSibling;
  if (summary && summary.classList.contains('ach-summary')) {
    summary.textContent = `${doneCount} de ${total} desbloqueados`;
  }
}


function renderActivity() {
  const el = document.getElementById('activity-list');
  if (!el) return;
  const acts = [];
  (S.completedMods || []).slice().reverse().forEach((modId, i) => {
    const mod = MODULES.find(m => m.id === modId);
    if (!mod) return;
    const hoursAgo = (i + 1) * 2;
    const timeStr = hoursAgo < 24 ? (hoursAgo <= 1 ? 'Hace 1h' : 'Hace ' + hoursAgo + 'h')
                  : (hoursAgo < 48 ? 'Ayer' : 'Hace ' + Math.floor(hoursAgo/24) + ' días');
    acts.push({i: mod.icon, txt: 'Completaste <strong>' + mod.title + '</strong>', xp: '+' + mod.xp + ' XP', t: timeStr});
  });
  if (S.streak >= 3) acts.push({i:'🔥', txt:'Racha de <strong>' + S.streak + ' días</strong> activa', xp:'', t:'Activo'});
  acts.push({i:'🌱', txt:'Te uniste a <strong>FinLearn</strong>', xp:'+100 XP', t: S.startDate || 'Inicio'});
  if (acts.length === 1 && !S.completedMods.length) {
    el.innerHTML = '<div style="color:var(--text3);font-size:13px;padding:16px 0;text-align:center;">Completa tu primera lección para ver tu actividad aquí 🚀</div>';
    return;
  }
  el.innerHTML = acts.slice(0,8).map(a => `
    <div class="activity-item">
      <div class="ai-icon">${a.i}</div>
      <div style="flex:1;"><div class="ai-text">${a.txt}</div><div class="ai-time">${a.t}</div></div>
      ${a.xp ? `<div class="tag tag-green">${a.xp}</div>` : ''}
    </div>
  `).join('');
}


function updateCountdown() {
  const end = new Date(); end.setDate(end.getDate()+3); end.setHours(23,59,59);
  const d = end - new Date();
  const str = `${Math.floor(d/86400000)}d ${Math.floor((d%86400000)/3600000)}h ${Math.floor((d%3600000)/60000)}m`;
  ['chal-countdown','rank-reset'].forEach(id => { const el=document.getElementById(id); if(el) el.textContent=str.replace(' min',''); });
}


/* ── Portfolio & Stocks ───────────────────────────────────── */


function renderFact(idx) {
  const fact = FINANCIAL_FACTS[idx];
  const textEl  = document.getElementById('facts-text');
  const srcEl   = document.getElementById('facts-source');
  const dotsEl  = document.getElementById('facts-dots');
  if (textEl)  textEl.innerHTML  = fact.text;
  if (srcEl)   srcEl.textContent = fact.source;
  if (dotsEl) {
    dotsEl.innerHTML = FINANCIAL_FACTS.map((_, i) =>
      `<div class="facts-dot${i === idx ? ' active' : ''}" onclick="goToFact(${i})"></div>`
    ).join('');
  }
}



// ═══ UI — Vida ═══
/* ══════════════════════════════════════════════════════════════════
   ui-life.js — Simulador de vida · Patrimonio growth · Notificaciones · Badges · XP pop
   ─ Importa solo lo necesario de data.js y state.js.
   ─ No importa de script.js → sin dependencias circulares.
   ─ Las funciones de negocio (addXP, etc.) se acceden via window.*
     porque script.js las expone al arrancar la app.
══════════════════════════════════════════════════════════════════ */



function renderPatrimonyGrowthBanner(current, growthPct) {
  const bannerEl = document.getElementById('patrimony-growth-banner');
  if (!bannerEl) return;

  const isGrowth = growthPct >= 0;
  const arrow    = isGrowth ? '↑' : '↓';
  const color    = isGrowth ? 'var(--gain)' : 'var(--loss)';
  const bgColor  = isGrowth ? 'rgba(0,255,136,.05)' : 'rgba(255,75,92,.05)';
  const bdColor  = isGrowth ? 'rgba(0,255,136,.15)' : 'rgba(255,75,92,.15)';

  const history  = S.patrimonyHistory || [];
  const sparkSVG = buildSparkline(history.map(h => h.value));

  bannerEl.style.cssText   = `background:${bgColor};border:1px solid ${bdColor};border-radius:14px;padding:14px 16px;margin-bottom:16px;`;
  bannerEl.style.display   = 'block';

  const yearLabel = `Año de juego ${S.gameYear || 0}`;
  const absChange = Math.abs(current - (S.lastYearPatrimony || current));

  bannerEl.innerHTML = `
    <div style="display:flex;align-items:flex-start;gap:12px;">
      <div style="flex:1;">
        <div style="font-family:'DM Mono',monospace;font-size:10px;color:var(--text2);letter-spacing:.08em;margin-bottom:4px;">${yearLabel.toUpperCase()} · TU PATRIMONIO</div>
        <div style="font-family:'Syne',sans-serif;font-weight:800;font-size:22px;color:var(--text);">€${Math.round(current).toLocaleString('es')}</div>
        <div style="font-size:13px;margin-top:4px;color:${color};font-weight:700;">
          ${arrow} ${isGrowth ? '+' : ''}${growthPct.toFixed(1)}% este año
          <span style="font-size:11px;color:var(--text2);font-weight:400;"> (${isGrowth ? '+' : '-'}€${Math.round(absChange).toLocaleString('es')})</span>
        </div>
        <div style="font-size:11px;color:var(--text2);margin-top:6px;line-height:1.4;">
          ${getPatrimonyMessage(growthPct, current)}
        </div>
      </div>
      <div style="width:80px;flex-shrink:0;">${sparkSVG}</div>
    </div>`;
}


function renderLifeScreen() {
  setEl('life-name', S.userName||'Tú');
  setEl('life-avatar-big', S.avatar||'🌱');
  const age = S.lifeAge||25;
  setEl('ls-age', age);
  setEl('life-age-label', `Edad: ${age} años`);
  const stage = age<30?'🌱 APRENDIZ':age<40?'📊 ANALISTA':age<50?'💼 INVERSOR':'🏝️ LIBRE';
  setEl('life-stage-label', stage);
  // Net worth
  const netWorth = (S.cash||0)+(S.balance||0)+
    Object.entries(S.portfolio||{}).reduce((acc,[t,p])=>acc+(GAME.stockPrices[t]||STOCKS.find(s=>s.ticker===t)?.price||0)*p.shares,0)+
    Object.keys(S.businesses||{}).reduce((acc,id)=>acc+(BUSINESSES.find(b=>b.id===id)?.cost||0)*0.8,0);
  S.patrimony = netWorth;
  setEl('ls-net-worth', netWorth>=1000?'€'+Math.round(netWorth/1000)+'k':'€'+Math.round(netWorth));
  // Monthly net
  const income = (S.lifeSalary||1800) +
    Object.keys(S.businesses||{}).reduce((acc,id)=>acc+(calcBizRevenue(id)-(BUSINESSES.find(b=>b.id===id)?.monthlyExpenses||0)),0);
  const exp = Object.values(S.lifeExpenses||{rent:0,food:0,transport:0,leisure:0,other:0}).reduce((a,b)=>a+b,0) +
    (S.monthlyContribution||0);
  const net = income - exp;
  setEl('ls-monthly-net', (net>=0?'+':'')+'€'+Math.round(net));
  // Happiness
  const h = Math.min(100,Math.max(0,S.lifeHappiness||70));
  setEl('ls-happiness', h>=80?'😄':h>=60?'😊':h>=40?'😐':h>=20?'😟':'😢');
  // Monthly flow breakdown
  renderLifeMonthlyFlow(income, exp);
  // Life events
  renderLifeEvents();
}


function renderLifeMonthlyFlow(income, expenses) {
  const el = document.getElementById('life-monthly-flow');
  if(!el) return;
  const sal = S.lifeSalary||1800;
  const bizNet = Object.keys(S.businesses||{}).reduce((acc,id)=>acc+(calcBizRevenue(id)-(BUSINESSES.find(b=>b.id===id)?.monthlyExpenses||0)),0);
  const expObj = S.lifeExpenses||{rent:0,food:0,transport:0,leisure:0,other:0};
  const totalExp = Object.values(expObj).reduce((a,b)=>a+b,0)+(S.monthlyContribution||0);
  const rows = [
    {icon:'💼',label:'Sueldo neto',amount:sal,type:'in'},
    bizNet>0?{icon:'🏪',label:'Negocios',amount:bizNet,type:'in'}:null,
    {icon:'🏠',label:'Vivienda (alquiler/hipoteca)',amount:expObj.rent||700,type:'out'},
    {icon:'🍽️',label:'Alimentación',amount:expObj.food||300,type:'out'},
    {icon:'🚗',label:'Transporte',amount:expObj.transport||100,type:'out'},
    {icon:'🎭',label:'Ocio y entretenimiento',amount:expObj.leisure||200,type:'out'},
    {icon:'📦',label:'Otros gastos',amount:expObj.other||150,type:'out'},
    S.monthlyContribution>0?{icon:'📈',label:'Inversión mensual',amount:S.monthlyContribution,type:'out'}:null,
  ].filter(Boolean);
  const totalIn = rows.filter(r=>r.type==='in').reduce((a,r)=>a+r.amount,0);
  const net = income-totalExp;
  el.innerHTML = rows.map(r=>`
    <div class="mf-row">
      <div class="mf-icon">${r.icon}</div>
      <div class="mf-label">${r.label}</div>
      <div class="mf-amount ${r.type}">${r.type==='in'?'+':'-'}€${r.amount.toLocaleString('es')}</div>
    </div>`).join('')+`
    <div class="mf-row" style="margin-top:6px;padding-top:10px;border-top:1px solid var(--border2);">
      <div class="mf-icon">${net>=0?'💚':'🔴'}</div>
      <div class="mf-label" style="font-weight:700;color:var(--text);">Ahorro neto mensual</div>
      <div class="mf-amount ${net>=0?'in':'out'}" style="font-family:'Syne',sans-serif;font-weight:800;font-size:16px;">${net>=0?'+':'-'}€${Math.abs(net).toLocaleString('es')}</div>
    </div>`;
}


function renderLifeEvents() {
  const el = document.getElementById('life-events-list');
  if(!el) return;
  const taken = (S.lifeEvents||[]).map(e=>e.id);
  const available = LIFE_EVENTS.filter(e=>!taken.includes(e.id)&&(!e.condition||e.condition(S)));
  el.innerHTML = available.slice(0,6).map(ev=>`
    <div class="life-event-card ${ev.type}" onclick="takeLifeEvent('${ev.id}')">
      <div class="lec-top">
        <div class="lec-icon">${ev.icon}</div>
        <div class="lec-info">
          <div class="lec-title">${ev.title}</div>
          <div class="lec-desc">${ev.desc}</div>
        </div>
        ${ev.effects.cost>0?`<div class="lec-cost"><div class="lec-cost-val">${fmtPrice(ev.effects.cost)}</div><div class="lec-cost-lab">Coste</div></div>`:''}
      </div>
      <div class="lec-impact">
        ${ev.effects.xp?`<span class="lec-badge xp">+${ev.effects.xp} XP</span>`:''}
        ${ev.effects.salaryMultiplier&&ev.effects.salaryMultiplier>1?`<span class="lec-badge income">+Sueldo ${Math.round((ev.effects.salaryMultiplier-1)*100)}%</span>`:''}
        ${ev.effects.salaryBonus?`<span class="lec-badge income">+€${ev.effects.salaryBonus}/mes</span>`:''}
        ${ev.effects.expenseIncrease?`<span class="lec-badge expense">-€${ev.effects.expenseIncrease}/mes</span>`:''}
        ${ev.effects.cost>0?`<span class="lec-badge expense">Pago único</span>`:''}
        ${ev.effects.happiness>0?`<span class="lec-badge income">+${ev.effects.happiness} bienestar</span>`:`<span class="lec-badge expense">${ev.effects.happiness} bienestar</span>`}
      </div>
    </div>`).join('');
  if(available.length===0) el.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text2);font-size:14px;">🎉 Has completado todos los eventos disponibles en tu etapa de vida actual.</div>`;
}


/* ── DCA & Patrimonio ─────────────────────────────────────── */


function showBadgeNotification(icon, name, desc) {
  const el = document.createElement('div');
  el.className = 'badge-notif';
  el.innerHTML = `
    <span class="bn-icon-big">${icon}</span>
    <div>
      <div class="bn-text">¡Badge desbloqueado! ${name}</div>
      <div class="bn-sub">${desc}</div>
    </div>
  `;
  document.body.appendChild(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 400);
  }, 4000);
}


function spawnXPv2(text, source) {
  const el = document.createElement('div');
  el.className = 'xp-pop-v2';
  const colors = {dca:'#00e5a0', quiz:'#0091ff', module:'#fbbf24', default:'#00e5a0'};
  el.style.color = colors[source] || colors.default;
  el.textContent = text;
  const x = 30 + Math.random() * 40;
  el.style.cssText += `left:${x}%;top:60%;`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1400);
}


function showXPMilestone(milestone) {
  const wrap = document.createElement('div');
  wrap.className = 'xp-milestone';
  wrap.innerHTML = `
    <div class="xp-milestone-inner">
      <div class="milestone-xp">⚡ ${milestone} XP</div>
      <div class="milestone-label">¡Nuevo hito alcanzado! Sigue así 🔥</div>
    </div>
  `;
  document.body.appendChild(wrap);
  setTimeout(() => {
    wrap.style.animation = 'milestoneIn .3s ease reverse';
    setTimeout(() => wrap.remove(), 350);
  }, 1800);
  toast(`⚡ ¡Hito ${milestone} XP!`, 'Cada 100 XP te acerca más a tu independencia financiera', 't-fire');
}


/* ── Streak Milestones ──────────────────────────────────────── */
var _STREAK_MILESTONES = [
  { days: 3,   xp: 50,   emoji: '🔥', title: '¡3 días seguidos!', msg: 'El hábito empieza aquí. El 70% no llega al día 3.' },
  { days: 7,   xp: 100,  emoji: '🦅', title: '¡Una semana de racha!', msg: 'Estás en el top 30% de usuarios. La constancia es tu ventaja.' },
  { days: 14,  xp: 200,  emoji: '💎', title: '¡14 días imparables!', msg: 'Dos semanas. Solo el 15% llega aquí. Tu cerebro ya está cambiando.' },
  { days: 30,  xp: 500,  emoji: '👑', title: '¡Un mes de racha!', msg: 'TOP 5%. Un mes de educación financiera diaria. Eres diferente.' },
  { days: 100, xp: 1000, emoji: '🌟', title: '¡100 DÍAS DE RACHA!', msg: 'Legendario. Menos del 1% llega aquí. Tu futuro financiero ya es diferente.' },
];

function _checkStreakMilestone(streak) {
  var milestones = S.streakMilestonesGiven || [];
  var hit = null;
  for (var i = 0; i < _STREAK_MILESTONES.length; i++) {
    var m = _STREAK_MILESTONES[i];
    if (streak === m.days && milestones.indexOf(m.days) === -1) { hit = m; break; }
  }
  if (!hit) return;
  milestones.push(hit.days);
  S.streakMilestonesGiven = milestones;
  S.xp = (S.xp || 0) + hit.xp;
  setTimeout(function() { _showStreakMilestone(hit); }, 1200);
}

function _showStreakMilestone(m) {
  SFX.levelUp && SFX.levelUp();
  confetti && confetti();
  var el = document.createElement('div');
  el.id = 'streak-milestone-overlay';
  el.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(6,8,16,.92);backdrop-filter:blur(8px);animation:fadeInFast .25s ease;';
  el.innerHTML =
    '<div style="text-align:center;padding:32px 24px;max-width:340px;">' +
      '<div style="font-size:80px;margin-bottom:16px;animation:celPop .5s cubic-bezier(.34,1.56,.64,1);">' + m.emoji + '</div>' +
      '<div style="font-family:\'Syne\',sans-serif;font-weight:800;font-size:28px;color:#fff;margin-bottom:8px;">' + m.title + '</div>' +
      '<div style="font-size:15px;color:rgba(255,255,255,.7);line-height:1.6;margin-bottom:20px;">' + m.msg + '</div>' +
      '<div style="display:inline-block;background:rgba(0,229,160,.15);border:1px solid var(--accent);border-radius:20px;padding:8px 20px;font-size:15px;font-weight:700;color:var(--accent);margin-bottom:28px;">+' + m.xp + ' XP de recompensa 🔥' + m.days + '</div>' +
      '<br><button onclick="document.getElementById(\'streak-milestone-overlay\').remove();" style="background:var(--accent);color:#000;border:none;border-radius:12px;padding:14px 40px;font-size:16px;font-weight:800;cursor:pointer;font-family:\'Syne\',sans-serif;">¡A por más! →</button>' +
    '</div>';
  document.body.appendChild(el);
  el.addEventListener('click', function(e) { if (e.target === el) el.remove(); });
}
window._checkStreakMilestone = _checkStreakMilestone;

/* ── Identidad & Perfil ───────────────────────────────────── */



// ═══ SCRIPT — Nav ═══
/* ══════════════════════════════════════════════════════════════════
   script-nav.js — Navegación y Renderizado de Pantalla Principal

   ¿QUÉ ES ESTO Y POR QUÉ EXISTE?
   ─────────────────────────────────────────────────────────────────
   Este archivo es el núcleo de la navegación de FinLearn.
   Controla qué pantalla se muestra y orquesta el renderizado
   inicial de cada sección cuando el usuario navega a ella.

   REGLA CRÍTICA: Este archivo NO importa de ningún otro script-*.js
   porque es el nodo raíz del grafo de dependencias. Todos los demás
   script-*.js pueden importar goTo de aquí, pero este archivo
   no puede importar de ellos → cero riesgo de dependencias circulares.

   QUÉ EXPORTA:
   · goTo(screen)              → navega a una pantalla por nombre lógico
   · showScreen(id)            → muestra un div.screen por su id HTML
   · safeGoHome()              → confirma antes de salir de una lección
   · renderHomeScreen()        → orquesta el renderizado completo del home
   · renderProfileScreen()     → renderiza la pantalla de perfil
   · renderDCA()               → renderiza la pregunta de acción diaria
   · answerDCA(chosen, correct, explanation) → procesa la respuesta DCA
   · _renderTicker()           → inicia el ticker de prueba social (rotación)
   · _renderFacts()            → inicia la rotación de datos financieros
   · _updateInactionModule()   → actualiza el módulo "coste de inacción"
══════════════════════════════════════════════════════════════════ */





/* ══════════════════════════════════════════════════════════════════
   NAVEGACIÓN PRINCIPAL
══════════════════════════════════════════════════════════════════ */

/**
 * goTo — Navega a una pantalla por nombre lógico.
 * ─────────────────────────────────────────────────────────────────
 * El map traduce nombres semánticos ('home', 'rank'…) a ids de div
 * HTML. Esto desacopla el código de los ids del HTML: si cambias
 * el id de un div, solo tocas el map aquí.
 *
 * También gestiona:
 * · El bottom nav (qué item queda activo)
 * · Ocultar el bottom nav en pantallas de flujo (lesson, cert…)
 * · Llamar al renderizado específico de cada pantalla
 */
function goTo(screen) {
  if (typeof closeToolModal === 'function') closeToolModal();
  const map = {
    home:      's-home',
    onboard:   's-onboard',
    lesson:    's-lesson',
    cert:      's-cert',
    rank:      's-rank',
    profile:   's-profile',
    stats:     's-stats',
    portfolio: 's-portfolio',
    business:  's-business',
    life:      's-life',
    future:    's-future',
    lifestyle: 's-lifestyle',
    tools:     's-tools',
    guides:    's-guides',
    realmoney: 's-realmoney',
  };
  const id = map[screen] || screen;
  document.querySelectorAll('.modal-overlay').forEach(m => {
    if (m.classList.contains('open') && !m.id.startsWith('m-guide-reader')) {
      m.remove();
    }
  });
  document.querySelectorAll('[data-animation-active]').forEach(el => {
    el.removeAttribute('data-animation-active');
  });
  if (window._activeTimers) {
    window._activeTimers.forEach(clearTimeout);
    window._activeTimers = [];
  }
  // Limpiar modales huérfanos al cambiar de pantalla
  document.querySelectorAll('.modal-overlay.open').forEach(m => {
    if (!m.id.startsWith('m-guide-reader')) {
      m.classList.remove('open');
      m.style.display = 'none';
    }
  });
  showScreen(id);

  // Actualizar bottom nav (marca el ítem activo)
  document.querySelectorAll('.bn-item').forEach(b => b.classList.remove('active'));
  const bn = document.getElementById('bn-' + screen);
  if (bn) bn.classList.add('active');

  // Ocultar bottom nav en pantallas de flujo (sin nav)
  const bottomNav = document.getElementById('bottom-nav');
  if (bottomNav) {
    const noNav = ['s-onboard', 's-lesson', 's-cert', 's-future', 's-lifestyle'];
    bottomNav.classList.toggle('hidden', noNav.includes(id));
  }

  // Renderizado específico por pantalla
  if (screen === 'home')      { renderHomeScreen(); if ((Date.now() - _appStartTime) > 30000) setTimeout(() => AI_COACH.proactiveCheck(), 2000); }
  if (screen === 'rank')      { renderFullRank(); renderPodium(); }
  if (screen === 'profile')   { renderProfileScreen(); }
  if (screen === 'stats')     { renderStatsScreen(); }
  if (screen === 'portfolio') {
    renderPortfolioSummary(); renderStockList(); renderMyPositions();
    setTimeout(() => CHART.init(), 50); setTimeout(renderPortfolioDonut, 120);
    // Refresh datos reales al entrar en bolsa
    if (typeof MARKET !== 'undefined') MARKET.init();
  }
  if (screen === 'business')  { renderBusinesses(); renderBizCashflow(); }
  if (screen === 'life')      { renderLifeScreen(); renderCareerCard(); renderLifeEvents(); }
  if (screen === 'lifestyle') { setTimeout(renderLifestyleComparator, 60); }
  if (screen === 'tools')     { if (typeof renderToolsScreen === 'function') renderToolsScreen(); }
  if (screen === 'guides')    { if (typeof renderGuidesScreen === 'function') renderGuidesScreen(); }
  if (screen === 'realmoney') {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('s-realmoney');
    if (el) el.classList.add('active');
    if (typeof _rmLoad === 'function') _rmLoad();
  }
}

/**
 * showScreen — Muestra un div.screen por su id HTML.
 * Quita la clase 'active' de todas las pantallas y la añade solo a la target.
 * También resetea el scroll al top (para que no aparezca a mitad de página).
 */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('active');
    el.scrollTop = 0;
  }
}

/**
 * safeGoHome — Sale de la lección con confirmación previa.
 * Guarda el estado antes de salir para no perder el progreso.
 */
function safeGoHome() {
  if (confirm('¿Salir de la lección? Tu progreso se guardará.')) {
    // Cancelar speedrun si estaba activo
    if (typeof SPEEDRUN_stop === 'function') SPEEDRUN_stop();
    saveState();
    goTo('home');
  }
}


/* ══════════════════════════════════════════════════════════════════
   RENDERIZADO DE PANTALLAS
══════════════════════════════════════════════════════════════════ */

/**
 * renderHomeScreen — Orquesta el renderizado completo del home.
 * ─────────────────────────────────────────────────────────────────
 * Llama a todas las funciones de ui.js que pintan secciones del home.
 * El orden importa: updateUIFromState() va primero porque inicializa
 * elementos que los demás renderers asumen que ya existen.
 */
function renderHomeScreen() {
  AMBIENT.init();
  // Ocultar splash/skeleton si sigue visible
  const splash = document.getElementById('app-splash');
  if (splash) splash.style.display = 'none';
  const skeleton = document.getElementById('home-skeleton');
  if (skeleton) skeleton.style.display = 'none';
  updateUIFromState();
  renderModules();
  renderHomeRank();
  // renderChallengeMembers(); — chal-members removed from home
  renderHealthScore();
  renderFinancialProfile();
  renderTemporalProgress();
  renderIdentity();
  renderDynamicMessage();
  updateProjection();
  _renderFacts();
  renderDCA();
  const dcaStreakEl = document.getElementById('dca-streak-nav');
  if (dcaStreakEl) dcaStreakEl.textContent = S.streak || 0;
  if (typeof renderMissionsCard === 'function') renderMissionsCard();
  // F24: personalized hero message + suggested module badge
  _f24_renderHeroMsg();
  _f24_highlightSuggestedModule();
  // F3X: Rutas de aprendizaje personalizadas
  if (typeof renderLearningPathCard === 'function') renderLearningPathCard();
  // F27: plan de acción personalizado
  if (typeof F27_render === 'function') F27_render();
  // F28: Skill Tree / vista módulos
  switchModView(_modView);
  // F29: Caja Sorpresa Diaria
  if (typeof F29_render === 'function') F29_render();
  // F30: Misiones Grupales
  if (typeof F30_render === 'function') F30_render();
  // F31: Badges de Identidad
  if (typeof F31_renderBadges === 'function') F31_renderBadges('f31-home-badges');
  // F32: Ligas Semanales (una sola llamada)
  if (typeof F32_render === 'function') F32_render();
  // Streak card: racha + ruleta diaria
  if (typeof renderStreakCard === 'function') renderStreakCard();
  // F33: Streak Identity — banner Earn Back
  if (typeof F33_renderBanner === 'function') F33_renderBanner();
  // F34: Reto Diario
  if (typeof F34_render === 'function') F34_render();
  // F35: Misiones Diarias (3 simultáneas)
  if (typeof F35_render === 'function') F35_render();
  // F42: Problema del Día
  if (typeof F42_render === 'function') F42_render();
  // F44: Cofres
  if (typeof F44_render === 'function') F44_render();
  // F45: Eventos de Mercado
  if (typeof F45_checkTrigger === 'function') F45_checkTrigger();
  // F46: Hearts UI
  if (typeof F46_renderHearts === 'function') F46_renderHearts();
  // F48: Resumen Semanal
  if (typeof F48_checkShow === 'function') F48_checkShow();
  // F41: Escudo de racha
  if (typeof F41_renderShield === 'function') F41_renderShield();
  // M1: Doble XP banner
  if (typeof M1_checkDoubleXP === 'function') M1_checkDoubleXP();
  // M3: Friend streak
  if (typeof M3_render === 'function') M3_render();
  // Daily Hub (resumen diario de acciones pendientes)
  renderDailyHub();
  // F14: actualizar indicador de flashcards pendientes
  if (typeof _FC !== 'undefined' && _FC.updateEntryUI) _FC.updateEntryUI();
  // M2: Prestige check
  if (typeof M2_checkPrestige === 'function') M2_checkPrestige();
  // P4-A: Banner racha en riesgo (≥20:00 sin actividad)
  if (typeof renderStreakRiskBanner === 'function') renderStreakRiskBanner();
  // SEASONAL: banner de evento activo
  if (typeof SEA_render === 'function') { try { SEA_render(); } catch(e) { console.warn('[SEA]', e); } }
  renderIncomePanel();
  _renderStreakRepairBanner();
  _renderStreakDangerBanner();
  if (!document.getElementById('challenge-card')) {
    const cardWrap = document.createElement('div');
    cardWrap.id = 'challenge-card';
    cardWrap.style.cssText = 'margin:12px 16px;';
    const homeScreen = document.getElementById('s-home');
    if (homeScreen) homeScreen.appendChild(cardWrap);
  }
  _renderRealMoneyHomeCard();
  _renderWeeklyActionCard();
  // misión grupal pasa a Laboratorio
  renderHomeCTA();
  // Micro-animation: stagger de cards al entrar al home
  if (typeof _staggerHomeItems === 'function') setTimeout(_staggerHomeItems, 40);
}

function _getNextRecommendedMod() {
  if (typeof MODULES === 'undefined') return null;
  // Prioridad 1: módulo sugerido en onboarding
  if (S.suggestedModuleId) {
    const suggested = MODULES.find(m => m.id === S.suggestedModuleId && !S.completedMods.includes(m.id));
    if (suggested) return suggested;
  }
  // Prioridad 2: primer módulo no completado de la rama activa
  const activeBranch = S._activeBranch || 'fundamentos';
  const branchMod = MODULES.find(m =>
    (m.branch || m.category || '') === activeBranch && !S.completedMods.includes(m.id)
  );
  if (branchMod) return branchMod;
  // Prioridad 3: cualquier módulo no completado
  return MODULES.find(m => !S.completedMods.includes(m.id)) || null;
}

function renderDailyHub() {
  const el = document.getElementById('daily-hub');
  if (!el) return;

  const dcaDone   = !!S.dcaDone;
  const nextMod   = _getNextRecommendedMod();
  const missions  = (S._mw_missions || []).filter(m => !m.done);
  const nearMission = missions.sort((a, b) => (b.progress / b.goal) - (a.progress / a.goal))[0];

  // Calcular cuántas acciones diarias quedan
  const actions = [];
  if (!dcaDone) actions.push({ icon:'💰', label:'Pregunta del día pendiente', onclick:"goTo('home');setTimeout(function(){var el=document.getElementById('dca-card');if(el)el.scrollIntoView({behavior:'smooth',block:'center'});},400)" });
  if (nextMod)  actions.push({ icon:'📖', label:`Módulo: ${nextMod.title}`, onclick:`startModule(${nextMod.id})` });
  if (nearMission) {
    const pct = Math.round((nearMission.progress / nearMission.goal) * 100);
    actions.push({ icon:'🎯', label:`${nearMission.title} (${pct}%)`, onclick:"goTo('home');setTimeout(function(){var el=document.getElementById('missions-card');if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},400)" });
  }

  if (actions.length === 0) {
    el.innerHTML = `
      <div style="background:linear-gradient(135deg,rgba(0,229,160,.12),rgba(0,229,160,.04));border:1px solid rgba(0,229,160,.25);border-radius:16px;padding:14px 16px;margin:0 0 4px;display:flex;align-items:center;gap:12px;">
        <span style="font-size:28px;">✅</span>
        <div>
          <div style="font-size:13px;font-weight:700;color:var(--accent);">¡Todo completado hoy!</div>
          <div style="font-size:11px;color:var(--text2);">Vuelve mañana para seguir tu racha.</div>
        </div>
      </div>`;
    return;
  }

  const items = actions.slice(0, 3).map(a => `
    <button onclick="${a.onclick}" style="display:flex;align-items:center;gap:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px 12px;width:100%;cursor:pointer;text-align:left;margin-bottom:6px;">
      <span style="font-size:20px;flex-shrink:0;">${a.icon}</span>
      <span style="font-size:12px;font-weight:600;color:var(--text1);">${a.label}</span>
      <span style="margin-left:auto;font-size:11px;color:var(--accent);">→</span>
    </button>`).join('');

  el.innerHTML = `
    <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:14px 14px 8px;margin:0 0 4px;">
      <div style="font-size:10px;font-weight:800;letter-spacing:.1em;color:var(--text3);margin-bottom:10px;">ACCIONES DE HOY</div>
      ${items}
    </div>`;
}

function renderHomeCTA() {
  var el = document.getElementById('home-continue-cta');
  if (!el) return;
  var completed = S.completedMods || [];
  if (completed.length === 0) { el.style.display = 'none'; return; }
  var targetId = null;
  if (S.suggestedModuleId != null && completed.indexOf(S.suggestedModuleId) === -1) {
    targetId = S.suggestedModuleId;
  }
  if (targetId === null && typeof MODULES !== 'undefined') {
    for (var i = 0; i < MODULES.length; i++) {
      var m = MODULES[i];
      if (m && typeof m.id === 'number' && completed.indexOf(m.id) === -1) { targetId = m.id; break; }
    }
  }
  if (targetId === null) { el.style.display = 'none'; return; }
  var mod = null;
  if (typeof MODULES !== 'undefined') {
    for (var j = 0; j < MODULES.length; j++) {
      if (MODULES[j] && MODULES[j].id === targetId) { mod = MODULES[j]; break; }
    }
  }
  if (!mod) { el.style.display = 'none'; return; }
  var isSuggested = (targetId === S.suggestedModuleId);
  var ctaLabel = isSuggested ? 'Módulo recomendado para ti' : 'Continúa donde lo dejaste';
  el.style.display = 'block';
  el.innerHTML = '<button onclick="startModule(' + targetId + ')" style="' +
    'display:flex;align-items:center;gap:12px;width:100%;' +
    'background:linear-gradient(135deg,var(--bg2) 0%,rgba(0,229,160,0.08) 100%);' +
    'border:1.5px solid var(--accent);border-radius:16px;padding:14px 16px;' +
    'cursor:pointer;text-align:left;position:relative;overflow:hidden;' +
    'animation:ctaPulse 2.4s ease-in-out infinite;">' +
    '<div style="font-size:36px;flex-shrink:0;line-height:1;">' + mod.icon + '</div>' +
    '<div style="flex:1;min-width:0;">' +
      '<div style="font-size:11px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:.6px;margin-bottom:2px;">' + ctaLabel + '</div>' +
      '<div style="font-size:15px;font-weight:800;color:var(--text1);font-family:\'Syne\',sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + mod.title + '</div>' +
    '</div>' +
    '<div style="font-size:13px;font-weight:700;color:var(--accent);flex-shrink:0;">Continuar →</div>' +
  '</button>';
}
window.renderHomeCTA = renderHomeCTA;

/**
 * renderProfileScreen — Renderiza la pantalla de perfil.
 * Actualiza todos los datos del perfil desde S.
 */
/**
 * _f24_renderHeroMsg — Muestra el mensaje personalizado del onboarding en el hero card.
 * Solo visible si el usuario tiene un onboardHeroMsg generado en el onboarding.
 */
function _f24_renderHeroMsg() {
  const el = document.getElementById('ob-hero-msg');
  if (!el) return;
  if (S.onboardHeroMsg) {
    el.textContent = S.onboardHeroMsg;
    el.style.display = 'block';
  } else {
    el.style.display = 'none';
  }
}

/**
 * _f24_highlightSuggestedModule — Añade badge "PARA TI 🎯" al módulo sugerido.
 * Solo se muestra si el módulo aún no está completado.
 */
function _f24_highlightSuggestedModule() {
  // Limpiar badges previos
  document.querySelectorAll('.mod-suggested-badge').forEach(b => b.remove());
  if (S.suggestedModuleId == null) return;
  const modId = S.suggestedModuleId;
  if ((S.completedMods || []).includes(modId)) return; // ya completado, no mostrar

  // Buscar la tarjeta del módulo por su atributo data-mod-id o por orden
  const cards = document.querySelectorAll('.mod-card[data-mod-id]');
  let target = null;
  cards.forEach(card => {
    if (parseInt(card.dataset.modId, 10) === modId) target = card;
  });
  if (!target) {
    // fallback: buscar por índice si no hay data-mod-id
    const allCards = document.querySelectorAll('.mod-card');
    if (allCards[modId]) target = allCards[modId];
  }
  if (!target) return;

  const badge = document.createElement('div');
  badge.className = 'mod-suggested-badge';
  badge.textContent = '🎯 Para ti';
  target.style.position = 'relative';
  target.appendChild(badge);
  // Scroll suave hacia el módulo sugerido (solo la primera vez)
  if (!S._suggestedScrolled) {
    S._suggestedScrolled = true;
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 800);
  }
}


/* ══════════════════════════════════════════════════════════════════
   F3X — RUTAS DE APRENDIZAJE PERSONALIZADAS
   ─────────────────────────────────────────────────────────────────
   Card en home con la rama recomendada según goal + investorLevel.
   Muestra los próximos módulos pendientes de la rama y permite
   cambiar la ruta con un quiz de 3 preguntas.
══════════════════════════════════════════════════════════════════ */

function renderLearningPathCard() {
  var el = document.getElementById('learning-path-card');
  if (!el) return;

  if (typeof F28_BRANCHES === 'undefined' || typeof MODULES === 'undefined') {
    el.style.display = 'none';
    return;
  }

  var branchId = S.suggestedBranchId;
  // Retrocompatibilidad: usuarios anteriores sin suggestedBranchId
  if (!branchId && S.suggestedModuleId != null) {
    branchId = _ob_getSuggestedBranch();
    S.suggestedBranchId = branchId;
  }
  if (!branchId && !S.goal && !S.investorLevel) {
    // Usuario nuevo sin perfil — mostrar teaser
    el.style.display = '';
    el.innerHTML = `
      <div class="lp-teaser" onclick="if(typeof RUTA_openQuiz==='function')RUTA_openQuiz()">
        <div class="lp-teaser-icon">🎯</div>
        <div class="lp-teaser-text">
          <div class="lp-teaser-title">Descubre tu ruta de aprendizaje</div>
          <div class="lp-teaser-sub">3 preguntas · Ruta personalizada en segundos</div>
        </div>
        <span class="lp-teaser-arrow">›</span>
      </div>`;
    return;
  }

  if (!branchId) branchId = _ob_getSuggestedBranch();

  var branch = F28_BRANCHES.find(function(b) { return b.id === branchId; });
  if (!branch) { el.style.display = 'none'; return; }

  var completed = S.completedMods || [];
  var pendingMods = branch.mods
    .filter(function(id) { return !completed.includes(id); })
    .slice(0, 3)
    .map(function(id) { return MODULES.find(function(m) { return m && m.id === id; }); })
    .filter(Boolean);

  var done = branch.mods.filter(function(id) { return completed.includes(id); }).length;
  var total = branch.mods.length;
  var pct = total > 0 ? Math.round((done / total) * 100) : 0;

  var modsHtml = pendingMods.length > 0
    ? pendingMods.map(function(m) {
        return '<div class="lp-mod-item" onclick="if(typeof startModule===\'function\')startModule(' + m.id + ')">' +
               '<span class="lp-mod-icon">' + (m.icon || '📖') + '</span>' +
               '<span class="lp-mod-title">' + (m.title || 'Módulo') + '</span>' +
               '<span class="lp-mod-arrow">›</span></div>';
      }).join('')
    : '<div class="lp-done-msg">🎉 ¡Rama completada! Empieza otra.</div>';

  el.style.display = '';
  el.innerHTML = `
    <div class="lp-card">
      <div class="lp-header">
        <div class="lp-branch-info">
          <span class="lp-emoji">${branch.emoji}</span>
          <div>
            <div class="lp-title">Tu ruta: <strong>${branch.label}</strong></div>
            <div class="lp-sub">${done}/${total} módulos · ${pct}% completado</div>
          </div>
        </div>
        <button class="lp-change-btn" onclick="if(typeof RUTA_openQuiz==='function')RUTA_openQuiz()" title="Cambiar ruta">✏️</button>
      </div>
      <div class="lp-progress-bar"><div class="lp-progress-fill" style="width:${pct}%;background:${branch.color}"></div></div>
      <div class="lp-mods">${modsHtml}</div>
    </div>`;
}

window.renderLearningPathCard = renderLearningPathCard;

/* ══════════════════════════════════════════════════════════════════
   F25 — TRACKER DE PATRIMONIO REAL
   ─────────────────────────────────────────────────────────────────
   Permite al usuario introducir su situación financiera real:
   activos (cuenta corriente, fondos, acciones, inmueble, pensión,
   otros) y deudas (hipoteca, préstamos, tarjetas).

   Al guardar:
   · Calcula S.realPatrimony (neto real)
   · Actualiza el hero card con badge "Real vs Simulado"
   · Genera análisis de salud financiera con datos reales
   · Construye recomendación personalizada

   API pública:
   · F25_open()          → abre el modal
   · F25_close()         → cierra el modal
   · F25_tab(name)       → cambia entre 'assets'|'debts'|'summary'
   · F25_liveUpdate()    → recalcula totales en tiempo real
   · F25_save()          → guarda, calcula y va al summary
══════════════════════════════════════════════════════════════════ */

/** Abre el modal y precarga valores guardados si existen. */
function F25_open() {
  if (!isPremium()) { PM_showPaywall('f25'); return; }
  openModal('m-real-patrimony');
  F25_tab('assets');
  F25_preload();
}

/** Cierra el modal y refresca el hero card. */
function F25_close() {
  closeModal('m-real-patrimony');
  renderFinancialProfile();
  _f25_renderHeroBadge();
}

/** Cambia entre los tres paneles del modal. */
function F25_tab(name) {
  ['assets','debts','summary'].forEach(t => {
    const tab   = document.getElementById('rpt-tab-'  + t);
    const panel = document.getElementById('rpt-panel-' + t);
    if (tab)   tab.classList.toggle('active',   t === name);
    if (panel) panel.classList.toggle('active', t === name);
  });
  if (name === 'summary' && S.realPatrimony !== null) F25_renderSummary();
}

/**
 * Precarga los inputs con los datos guardados en S.realAssets/realDebts.
 * Así el usuario puede actualizar sin volver a teclear todo.
 */
function F25_preload() {
  const a = S.realAssets || {};
  const d = S.realDebts  || {};
  const pairs = [
    ['rpt-checking', a.checking], ['rpt-funds',    a.funds],
    ['rpt-stocks',   a.stocks],   ['rpt-property', a.property],
    ['rpt-pension',  a.pension],  ['rpt-other',    a.other],
    ['rpt-mortgage', d.mortgage], ['rpt-loans',    d.loans],
    ['rpt-cards',    d.cards],
  ];
  pairs.forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val > 0 ? val : '';
  });

  // Última actualización
  const dateEl = document.getElementById('rpt-last-update');
  if (dateEl) {
    dateEl.textContent = S.realPatrimonyDate
      ? 'Actualizado el ' + new Date(S.realPatrimonyDate).toLocaleDateString('es-ES', { day:'numeric', month:'short', year:'numeric' })
      : 'Nunca actualizado';
  }
  F25_liveUpdate();
}

/** Recalcula totales en tiempo real mientras el usuario escribe. */
function F25_liveUpdate() {
  function v(id) { return parseFloat(document.getElementById(id)?.value) || 0; }
  const totalAssets = v('rpt-checking') + v('rpt-funds') + v('rpt-stocks') +
                      v('rpt-property') + v('rpt-pension') + v('rpt-other');
  const totalDebts  = v('rpt-mortgage') + v('rpt-loans') + v('rpt-cards');
  const net         = totalAssets - totalDebts;

  function fmt(n) { return (n < 0 ? '-€' : '€') + Math.abs(Math.round(n)).toLocaleString('es-ES'); }
  setEl('rpt-total-assets', fmt(totalAssets));
  setEl('rpt-total-debts',  fmt(totalDebts));
  const netEl = document.getElementById('rpt-net-preview');
  if (netEl) {
    netEl.textContent = fmt(net);
    netEl.style.color = net >= 0 ? 'var(--accent)' : 'var(--danger)';
  }

  // Actualizar slider visual del input activo
  const slider = document.getElementById('rpt-assets-bar');
  if (slider && totalAssets > 0) {
    slider.style.width = Math.min((totalDebts / totalAssets) * 100, 100) + '%';
  }
}

/**
 * Guarda los datos, calcula patrimonio neto real y va al resumen.
 */
function F25_save() {
  function v(id) { return parseFloat(document.getElementById(id)?.value) || 0; }

  const assets = {
    checking: v('rpt-checking'), funds:    v('rpt-funds'),
    stocks:   v('rpt-stocks'),   property: v('rpt-property'),
    pension:  v('rpt-pension'),  other:    v('rpt-other'),
  };
  const debts = {
    mortgage: v('rpt-mortgage'), loans: v('rpt-loans'), cards: v('rpt-cards'),
  };
  const totalAssets = Object.values(assets).reduce((s,x) => s + x, 0);
  const totalDebts  = Object.values(debts).reduce((s,x) => s + x, 0);
  const realNet     = totalAssets - totalDebts;

  S.realAssets       = assets;
  S.realDebts        = debts;
  S.realPatrimony    = realNet;
  S.realPatrimonyDate = new Date().toISOString();

  // Regenerar hero message con datos reales
  S.onboardHeroMsg = _ob_buildHeroMsg();
  // F27: invalidar plan para que se regenere con datos reales
  S._actionPlanHash = null;

  saveState();

  // Actualizar fecha en modal
  const dateEl = document.getElementById('rpt-last-update');
  if (dateEl) dateEl.textContent = 'Actualizado hoy';

  // Ir al resumen
  F25_tab('summary');
  F25_renderSummary();

  toast('✅ Patrimonio real guardado', `Neto: ${(realNet<0?'-€':'€') + Math.abs(Math.round(realNet)).toLocaleString('es-ES')}`, 't-success');
}

/**
 * Renderiza el panel de resumen con breakdown, health score y comparativa.
 */
function F25_renderSummary() {
  if (S.realPatrimony === null) return;
  const a = S.realAssets || {};
  const d = S.realDebts  || {};
  const totalA = Object.values(a).reduce((s,x) => s + x, 0);
  const totalD = Object.values(d).reduce((s,x) => s + x, 0);
  const net    = S.realPatrimony;

  function fmt(n) { return (n < 0 ? '-€' : '€') + Math.abs(Math.round(n)).toLocaleString('es-ES'); }

  // ── Patrimonio neto ──────────────────────────────────────────
  const amtEl = document.getElementById('rpt-sn-amount');
  if (amtEl) {
    amtEl.textContent = fmt(net);
    amtEl.style.color = net >= 0 ? 'var(--accent)' : 'var(--danger)';
  }
  const dateEl = document.getElementById('rpt-sn-date');
  if (dateEl) {
    dateEl.textContent = new Date(S.realPatrimonyDate).toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' });
  }

  // ── Breakdown barras ─────────────────────────────────────────
  const breakdown = document.getElementById('rpt-breakdown');
  if (breakdown) {
    const items = [
      { label:'Cuenta corriente', val: a.checking, color:'var(--accent)',  icon:'🏧' },
      { label:'Fondos/ETFs',      val: a.funds,    color:'var(--accent2)', icon:'📈' },
      { label:'Acciones',         val: a.stocks,   color:'#06b6d4',        icon:'🏢' },
      { label:'Inmueble',         val: a.property, color:'#f59e0b',        icon:'🏠' },
      { label:'Plan pensiones',   val: a.pension,  color:'#a78bfa',        icon:'🌅' },
      { label:'Otros activos',    val: a.other,    color:'var(--text3)',   icon:'📦' },
      { label:'Hipoteca',         val:-d.mortgage, color:'var(--danger)',  icon:'🏠' },
      { label:'Préstamos',        val:-d.loans,    color:'#ef4444',        icon:'🚗' },
      { label:'Tarjetas',         val:-d.cards,    color:'#f97316',        icon:'💳' },
    ].filter(x => x.val !== 0);

    const maxAbs = Math.max(...items.map(x => Math.abs(x.val)), 1);
    breakdown.innerHTML = '<div class="rpt-bd-title">Desglose</div>' +
      items.map(x => {
        const w = (Math.abs(x.val) / maxAbs * 100).toFixed(1);
        const isDebt = x.val < 0;
        return `<div class="rpt-bd-row">
          <div class="rpt-bd-label">${x.icon} ${x.label}</div>
          <div class="rpt-bd-bar-wrap">
            <div class="rpt-bd-bar" style="width:${w}%;background:${x.color};opacity:${isDebt?.7:1};"></div>
          </div>
          <div class="rpt-bd-val" style="color:${x.val<0?'var(--danger)':'var(--text)'}">${fmt(x.val)}</div>
        </div>`;
      }).join('');
  }

  // ── Health score REAL ────────────────────────────────────────
  const score = _f25_calcRealHealthScore(a, d, totalA, totalD);
  const healthCard = document.getElementById('rpt-health-card');
  if (healthCard) {
    const level  = score >= 70 ? { label:'Buena', color:'var(--accent)' }
                 : score >= 40 ? { label:'Media', color:'#f59e0b' }
                 : { label:'Mejorable', color:'var(--danger)' };
    const details = _f25_healthDetails(a, d, totalA, totalD, net);
    healthCard.innerHTML = `
      <div class="rpt-hc-row">
        <div>
          <div class="rpt-hc-title">Salud financiera real</div>
          <div class="rpt-hc-sub">${details.summary}</div>
        </div>
        <div class="rpt-hc-score" style="color:${level.color}">${score}<span style="font-size:14px">/100</span></div>
      </div>
      <div class="rpt-hc-bar-wrap">
        <div class="rpt-hc-bar-fill" style="width:${score}%;background:${level.color};"></div>
      </div>
      <div class="rpt-hc-items">
        ${details.items.map(i => `<div class="rpt-hc-item ${i.ok?'ok':'warn'}">${i.ok?'✓':'⚠'} ${i.text}</div>`).join('')}
      </div>`;
  }

  // ── Comparativa simulado vs real ─────────────────────────────
  const compareCard = document.getElementById('rpt-compare-card');
  if (compareCard) {
    const simulated = S.patrimony || 0;
    const diff      = net - simulated;
    const hasSim    = simulated !== 0 || S.completedMods.length > 0;
    if (hasSim) {
      compareCard.innerHTML = `
        <div class="rpt-cc-title">Simulado vs Real</div>
        <div class="rpt-cc-row">
          <div class="rpt-cc-block">
            <div class="rpt-cc-label">🎮 Simulado</div>
            <div class="rpt-cc-val b">${fmt(simulated)}</div>
          </div>
          <div class="rpt-cc-vs">vs</div>
          <div class="rpt-cc-block">
            <div class="rpt-cc-label">🏦 Real</div>
            <div class="rpt-cc-val" style="color:${net>=0?'var(--accent)':'var(--danger)'}">${fmt(net)}</div>
          </div>
        </div>
        <div class="rpt-cc-diff" style="color:${diff>=0?'var(--accent)':'var(--danger)'}">
          ${diff >= 0 ? '▲' : '▼'} ${fmt(Math.abs(diff))} ${diff >= 0 ? 'más' : 'menos'} que el simulador
        </div>`;
      compareCard.style.display = 'block';
    } else {
      compareCard.style.display = 'none';
    }
  }

  // ── Recomendación personalizada ──────────────────────────────
  const adviceCard = document.getElementById('rpt-advice-card');
  if (adviceCard) {
    const advice = _f25_buildAdvice(a, d, totalA, totalD, net, score);
    adviceCard.innerHTML = `
      <div class="rpt-adv-title">💡 Próximos pasos para ti</div>
      ${advice.map(a => `<div class="rpt-adv-item">${a}</div>`).join('')}`;
  }

  // Actualizar hero badge tras guardar
  _f25_renderHeroBadge();
}

/**
 * Calcula score de salud financiera con datos reales (0-100).
 * Cuatro dimensiones: liquidez, inversión, deuda, diversificación.
 */
function _f25_calcRealHealthScore(assets, debts, totalA, totalD) {
  const income = S.income || S.lifeSalary || 1800;
  let score = 0;

  // 1. Liquidez: cuenta corriente ≥ 3 meses de gastos (25 pts)
  const monthlyExpenses = income * 0.7;
  const emergencyTarget = monthlyExpenses * 3;
  score += Math.min(25, (assets.checking / Math.max(emergencyTarget, 1)) * 25);

  // 2. Inversión: fondos+ETFs+acciones como % del total activos (25 pts)
  const invested = (assets.funds || 0) + (assets.stocks || 0);
  if (totalA > 0) score += Math.min(25, (invested / totalA) * 50);

  // 3. Ratio deuda/activos: menos deuda = mejor (25 pts)
  if (totalA > 0) score += Math.max(0, 25 - (totalD / Math.max(totalA, 1)) * 50);
  else score += totalD === 0 ? 25 : 0;

  // 4. Diversificación: cuántos tipos de activos distintos tiene (25 pts)
  const types = [assets.checking, assets.funds, assets.stocks, assets.property, assets.pension, assets.other]
    .filter(x => x > 0).length;
  score += Math.min(25, (types / 4) * 25);

  return Math.round(Math.min(100, Math.max(0, score)));
}

/**
 * Genera los ítems de detalle del health score real.
 */
function _f25_healthDetails(assets, debts, totalA, totalD, net) {
  const income = S.income || S.lifeSalary || 1800;
  const emergency = (assets.checking || 0) >= income * 2.1;  // ≥ 3 meses
  const hasInvested = (assets.funds || 0) + (assets.stocks || 0) > 0;
  const debtRatio = totalA > 0 ? totalD / totalA : 1;
  const hasPension = (assets.pension || 0) > 0;

  const items = [
    { ok: emergency,                   text: emergency ? 'Fondo de emergencia cubierto' : 'Fondo de emergencia insuficiente (< 3 meses)' },
    { ok: hasInvested,                 text: hasInvested ? 'Tienes activos invertidos' : 'Sin fondos ni acciones — tu dinero no trabaja' },
    { ok: debtRatio < 0.4,             text: debtRatio < 0.4 ? `Ratio deuda/activos saludable (${(debtRatio*100).toFixed(0)}%)` : `Ratio deuda/activos alto (${(debtRatio*100).toFixed(0)}%)` },
    { ok: hasPension,                  text: hasPension ? 'Preparando la jubilación' : 'Sin plan de pensiones — considera empezar' },
    { ok: net >= 0,                    text: net >= 0 ? 'Patrimonio neto positivo' : 'Patrimonio neto negativo — las deudas superan activos' },
  ];

  const okCount = items.filter(i => i.ok).length;
  const summary = okCount >= 4 ? 'Situación sólida — optimiza lo que tienes'
                : okCount >= 2 ? 'Base en construcción — hay pasos claros'
                : 'Punto de partida — cada módulo suma';
  return { items, summary };
}

/**
 * Genera 2-3 recomendaciones personalizadas según los datos reales.
 */
function _f25_buildAdvice(assets, debts, totalA, totalD, net, score) {
  const advice = [];
  const income  = S.income || S.lifeSalary || 1800;
  const checking = assets.checking || 0;
  const invested  = (assets.funds || 0) + (assets.stocks || 0);
  const cards     = debts.cards  || 0;
  const loans     = debts.loans  || 0;

  // Prioridad 1: deuda cara
  if (cards > 500)
    advice.push(`💳 Tienes ${('€' + cards.toLocaleString('es-ES'))} en tarjetas. Es tu deuda más cara (18-24% TAE) — eliminarla primero da un retorno garantizado.`);
  else if (loans > 2000)
    advice.push(`🚗 Con ${('€' + loans.toLocaleString('es-ES'))} en préstamos, amortizar antes de invertir puede ser lo más rentable según el tipo de interés.`);

  // Prioridad 2: fondo de emergencia
  if (checking < income * 2.1)
    advice.push(`🛡️ Objetivo inmediato: llegar a ${('€' + Math.round(income * 3).toLocaleString('es-ES'))} en cuenta corriente (3 meses de gastos). Esto te da tranquilidad para invertir con cabeza.`);

  // Prioridad 3: invertir
  if (checking >= income * 3 && invested === 0)
    advice.push(`📈 Tienes liquidez pero sin inversión — tu dinero pierde poder adquisitivo con la inflación. Un ETF indexado global es el primer paso.`);
  else if (invested > 0 && invested / totalA < 0.2)
    advice.push(`🎯 Solo el ${((invested/totalA)*100).toFixed(0)}% de tus activos está invertido. Aumentar esta proporción acelerará tu patrimonio significativamente.`);

  // Prioridad 4: pensión
  if (!assets.pension && net > 10000)
    advice.push(`🌅 Con patrimonio positivo, considera abrir un plan de pensiones o alternativa (PIAS) — el beneficio fiscal es inmediato.`);

  // Fallback
  if (advice.length === 0)
    advice.push(`✨ Tu situación es sólida. El siguiente nivel es optimizar la rentabilidad de lo que ya tienes: diversificación geográfica y rebalanceo anual.`);

  return advice.slice(0, 3);
}

/**
 * Actualiza el hero card del home con el badge "Real" cuando hay datos reales.
 * Diferencia visual clara entre "Patrimonio simulado" y "Patrimonio real".
 */

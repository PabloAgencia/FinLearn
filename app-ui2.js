function _f25_renderHeroBadge() {
  const eyebrow  = document.getElementById('fpcard-eyebrow');
  const badge    = document.getElementById('hero-real-badge');
  const btn      = document.getElementById('hero-real-btn-label');
  const heroCard = document.getElementById('finprofile-card');

  if (S.realPatrimony !== null) {
    // Hay datos reales — mostrar badge con comparativa
    if (eyebrow) eyebrow.textContent = 'Patrimonio simulado';
    if (badge) {
      const net = S.realPatrimony;
      const sim = S.patrimony || 0;
      const diff = net - sim;
      badge.innerHTML = `<span class="hrb-label">Real</span><span class="hrb-val" style="color:${net>=0?'var(--accent)':'var(--danger)'}">
        ${net < 0 ? '-' : ''}€${Math.abs(Math.round(net)).toLocaleString('es-ES')}</span>
        ${diff !== 0 ? `<span class="hrb-diff" style="color:${diff>=0?'var(--accent)':'var(--danger)'}">
          ${diff>=0?'▲':'▼'} €${Math.abs(Math.round(diff)).toLocaleString('es-ES')}</span>` : ''}`;
      badge.style.display = 'flex';
    }
    if (btn) btn.textContent = '✏️ Actualizar datos';
    if (heroCard) heroCard.classList.add('has-real-data');
  } else {
    // Sin datos reales todavía
    if (eyebrow) eyebrow.textContent = 'Patrimonio simulado';
    if (badge)   badge.style.display = 'none';
    if (btn)     btn.textContent = '📊 Mi patrimonio real';
    if (heroCard) heroCard.classList.remove('has-real-data');
  }
}


/* ══════════════════════════════════════════════════════════════════
   F27 — PLAN DE ACCIÓN PERSONALIZADO
   ─────────────────────────────────────────────────────────────────
   El plan de acción más importante de la app: convierte al
   "ahorrador paralizado" en un inversor activo dándole pasos
   concretos, ordenados y con cantidades reales calculadas desde
   sus datos (F24 + F25).

   FILOSOFÍA DE DISEÑO:
   · Nunca más de 5 pasos — los planes largos abruman
   · Cada paso tiene UNA acción clara, no conceptos
   · Las cantidades son reales (calculadas desde realAssets/income)
   · Orden de prioridad financiera universal:
       1. Fondo de emergencia
       2. Deuda cara (tarjetas > préstamos > hipoteca)
       3. Primera inversión indexada
       4. Automatizar aportación mensual
       5. Optimizar/diversificar según objetivo

   ESTADO EN S:
   · S.actionPlan   = [{ id, status:'pending'|'done'|'active', … }]
   · S.actionPlanTs = timestamp de cuando se generó el plan

   API pública:
   · F27_render()    → renderiza el widget en el home
   · F27_refresh()   → regenera el plan (cuando cambian datos de F24/F25)
   · F27_stepDone(id)→ marca un paso como completado
   · F27_generate()  → calcula y devuelve el array de pasos
══════════════════════════════════════════════════════════════════ */

/**
 * F27_generate — El corazón de F27.
 * Calcula un plan de 3-5 pasos personalizado basado en la situación
 * financiera real del usuario. Devuelve un array de steps.
 *
 * Cada step: {
 *   id:       string único
 *   icon:     emoji
 *   category: 'emergencia'|'deuda'|'inversion'|'automatizar'|'optimizar'
 *   title:    string corto (<50 chars)
 *   body:     string descriptivo con cantidad real
 *   amount:   número (puede ser null)
 *   amountLabel: string formateado
 *   cta:      string — texto del botón de acción
 *   ctaAction: 'module'|'f25'|'external'|'none'
 *   ctaTarget: moduleId | null
 *   urgency:  'high'|'medium'|'low'
 *   status:   'active'|'pending'|'done'
 * }
 */
function F27_generate() {
  const a     = S.realAssets  || {};
  const d     = S.realDebts   || {};
  const steps = [];

  // ── Datos del usuario ──────────────────────────────────────────
  const income    = S.income    || S.lifeSalary || 1800;
  const monthly   = S.monthlyContribution || 0;
  const goal      = S.goal      || 'freedom';
  const level     = S.investorLevel || 'zero';
  const checking  = a.checking  || 0;
  const funds     = a.funds     || 0;
  const stocks    = a.stocks    || 0;
  const property  = a.property  || 0;
  const pension   = a.pension   || 0;
  const mortgage  = d.mortgage  || 0;
  const loans     = d.loans     || 0;
  const cards     = d.cards     || 0;
  const totalA    = checking + funds + stocks + property + pension + (a.other||0);
  const totalD    = mortgage + loans + cards;
  const netWorth  = totalA - totalD;

  // Fondo de emergencia objetivo: 3-6 meses de gastos estimados
  const monthlyExpenses = income * 0.7;
  const emergencyMin    = Math.round(monthlyExpenses * 3);
  const emergencyIdeal  = Math.round(monthlyExpenses * 6);
  const hasEmergency    = checking >= emergencyMin;
  const invested        = funds + stocks;
  const hasInvestment   = invested > 0 || level === 'investing' || level === 'active';

  function fmt(n) {
    return '€' + Math.round(n).toLocaleString('es-ES');
  }

  // ─────────────────────────────────────────────────────────────
  // PASO A: Fondo de emergencia
  // ─────────────────────────────────────────────────────────────
  if (!hasEmergency) {
    const gap     = emergencyMin - checking;
    const months  = monthly > 0 ? Math.ceil(gap / monthly) : null;
    steps.push({
      id: 'emergency',
      icon: '🛡️',
      category: 'emergencia',
      title: 'Crea tu fondo de emergencia',
      body: `Necesitas ${fmt(emergencyMin)} en cuenta corriente (3 meses de gastos). Ahora tienes ${fmt(checking)} — te faltan ${fmt(gap)}.${months ? ` Con ${fmt(monthly)}/mes lo consigues en ${months} ${months===1?'mes':'meses'}.` : ' Define una aportación mensual para calcularlo.'}`,
      amount: gap,
      amountLabel: fmt(gap),
      cta: 'Ver módulo: Fondo de Emergencia',
      ctaAction: 'module',
      ctaTarget: 29,
      urgency: 'high',
      status: 'active',
    });
  }

  // ─────────────────────────────────────────────────────────────
  // PASO B: Deuda cara — tarjetas primero (mayor TAE)
  // ─────────────────────────────────────────────────────────────
  if (cards > 200) {
    const months = monthly > 0 ? Math.ceil(cards / (monthly * 0.7)) : null;
    steps.push({
      id: 'cards',
      icon: '💳',
      category: 'deuda',
      title: 'Elimina la deuda de tarjetas',
      body: `Tienes ${fmt(cards)} en tarjetas al ~20% TAE. Esta deuda crece ${fmt(Math.round(cards*0.2/12))}/mes en intereses. Antes de invertir nada, este es tu mejor "rendimiento garantizado".${months ? ` En ~${months} meses puedes liquidarla.` : ''}`,
      amount: cards,
      amountLabel: fmt(cards),
      cta: 'Aprender: Deuda Inteligente',
      ctaAction: 'module',
      ctaTarget: 25,
      urgency: 'high',
      status: cards > 0 && !hasEmergency ? 'pending' : 'active',
    });
  } else if (loans > 3000) {
    steps.push({
      id: 'loans',
      icon: '🔓',
      category: 'deuda',
      title: 'Amortiza tus préstamos',
      body: `Tienes ${fmt(loans)} en préstamos. Si el tipo de interés supera el 5%, amortizar es más rentable que invertir. Calcula exactamente cuánto te cuesta cada euro de deuda.`,
      amount: loans,
      amountLabel: fmt(loans),
      cta: 'Calcular: ¿Amortizar o invertir?',
      ctaAction: 'module',
      ctaTarget: 14,
      urgency: 'medium',
      status: 'pending',
    });
  }

  // ─────────────────────────────────────────────────────────────
  // PASO C: Primera inversión
  // ─────────────────────────────────────────────────────────────
  if (hasEmergency && !hasInvestment && checking > emergencyMin) {
    const toInvest = Math.round(checking - emergencyMin);
    const proj10   = calcCompound(toInvest, monthly, 8, 10);
    steps.push({
      id: 'first_invest',
      icon: '📈',
      category: 'inversion',
      title: `Mueve ${fmt(toInvest)} a un ETF global`,
      body: `Tienes ${fmt(checking - emergencyMin)} por encima de tu fondo de emergencia sin trabajar. Invertido en un ETF MSCI World (VWCE/IWDA) al 8% histórico, en 10 años serían ${fmt(proj10)}.`,
      amount: toInvest,
      amountLabel: fmt(toInvest),
      cta: 'Aprender: ETFs e Indexación',
      ctaAction: 'module',
      ctaTarget: 26,
      urgency: 'high',
      status: 'active',
    });
  } else if (hasEmergency && hasInvestment && level === 'saving') {
    // Tiene algo invertido pero puede mejorar
    const toAdd = Math.round(Math.max(0, checking - emergencyIdeal));
    if (toAdd > 500) {
      steps.push({
        id: 'add_invest',
        icon: '📊',
        category: 'inversion',
        title: `Aumenta tu cartera en ${fmt(toAdd)}`,
        body: `Tienes ${fmt(toAdd)} extra en cuenta que supera tu colchón ideal. Añadirlos a tu cartera indexada acelera tu camino hacia ${goal === 'freedom' ? 'la libertad financiera' : 'tu objetivo'}.`,
        amount: toAdd,
        amountLabel: fmt(toAdd),
        cta: 'Ver: Arquitectura de Cartera',
        ctaAction: 'module',
        ctaTarget: 1,
        urgency: 'medium',
        status: 'active',
      });
    }
  }

  // ─────────────────────────────────────────────────────────────
  // PASO D: Automatizar aportación mensual
  // ─────────────────────────────────────────────────────────────
  if (monthly === 0) {
    steps.push({
      id: 'automate_zero',
      icon: '🔁',
      category: 'automatizar',
      title: 'Define tu aportación mensual',
      body: `No tienes configurada ninguna aportación mensual. Incluso ${fmt(50)}/mes al 8% durante 30 años = ${fmt(calcCompound(0,50,8,30))}. Elige una cantidad y ponla en automático.`,
      amount: null,
      amountLabel: null,
      cta: 'Aprender: El hábito del inversor',
      ctaAction: 'module',
      ctaTarget: 0,
      urgency: 'high',
      status: 'active',
    });
  } else if (monthly > 0) {
    const pct = income > 0 ? (monthly / income * 100).toFixed(0) : null;
    const proj20 = calcCompound(Math.max(0, netWorth), monthly, 8, 20);
    steps.push({
      id: 'automate',
      icon: '🔁',
      category: 'automatizar',
      title: `Automatiza ${fmt(monthly)}/mes`,
      body: `Tienes configurados ${fmt(monthly)}/mes ${pct ? `(${pct}% de tus ingresos)` : ''}. Asegúrate de que sale automáticamente el día 1 de cada mes a tu broker — la automatización elimina la fricción y los errores emocionales.${proj20 ? ` En 20 años: ${fmt(proj20)}.` : ''}`,
      amount: monthly,
      amountLabel: fmt(monthly) + '/mes',
      cta: 'Ver: Psicología del Inversor',
      ctaAction: 'module',
      ctaTarget: 2,
      urgency: 'low',
      status: 'pending',
    });
  }

  // ─────────────────────────────────────────────────────────────
  // PASO E: Optimización / siguiente nivel según objetivo
  // ─────────────────────────────────────────────────────────────
  const optimizeMap = {
    freedom: {
      icon: '🏝️', title: 'Calcula tu número FIRE',
      body: `Tu objetivo es la libertad financiera. La Regla del 4% dice que necesitas ${fmt((income*12*25))} en cartera para vivir de las rentas. ${netWorth > 0 ? `Ya llevas ${fmt(netWorth)} — vas al ${((netWorth/(income*12*25))*100).toFixed(1)}% del camino.` : 'El primer paso ya está dado: educarte.'}`,
      cta: 'Módulo FIRE',  ctaTarget: 24, urgency: 'medium'
    },
    house: {
      icon: '🏠', title: 'Calcula cuándo podrás comprar',
      body: `Para una entrada del 20% en una vivienda media necesitarás entre €40.000-€80.000. Con ${fmt(monthly)}/mes lo consigues en ${monthly>0?Math.ceil(60000/monthly)+' meses':'— define una aportación'}.`,
      cta: 'Módulo Alquiler vs Compra', ctaTarget: 10, urgency: 'medium'
    },
    retire: {
      icon: '🌅', title: 'Construye tu plan de pensiones',
      body: pension > 0 ? `Tienes ${fmt(pension)} en pensiones. El objetivo es acumular 20x tu salario anual — ahora llevas ${fmt(pension)} de ${fmt(income*12*20)}.` : `No tienes plan de pensiones. Las aportaciones tienen beneficio fiscal inmediato. Aunque sea ${fmt(100)}/mes marca la diferencia.`,
      cta: 'Módulo Jubilación', ctaTarget: 18, urgency: 'medium'
    },
    debt: {
      icon: '💪', title: 'Plan de liquidación de deudas',
      body: totalD > 0 ? `Total deudas: ${fmt(totalD)}. La estrategia avalancha (mayor TAE primero) te ahorra más dinero. La bola de nieve (menor saldo primero) te da más victorias psicológicas.` : '✅ No tienes deudas — empieza a invertir todo tu capital disponible.',
      cta: 'Módulo Deuda Inteligente', ctaTarget: 25, urgency: totalD > 0 ? 'high' : 'low'
    },
    invest: {
      icon: '📊', title: 'Diversifica tu cartera',
      body: invested > 0 ? `Tienes ${fmt(invested)} invertido. El siguiente nivel es diversificación geográfica: 80% global (VWCE) + 10% emergentes + 10% bonos si tu horizonte es < 10 años.` : `Estás listo para empezar. Un ETF indexado global (VWCE o IWDA) con costes < 0.25% TER es el punto de partida óptimo.`,
      cta: 'Módulo ETFs e Indexación', ctaTarget: 26, urgency: 'medium'
    },
    emergency: {
      icon: '🛡️', title: 'Amplía el fondo a 6 meses',
      body: checking >= emergencyMin ? `Tienes ${fmt(checking)} cubriendo ${Math.floor(checking/monthlyExpenses)} meses de gastos. El objetivo ideal son 6 meses (${fmt(emergencyIdeal)}).` : `Prioritario: llegar a ${fmt(emergencyMin)} antes de invertir nada.`,
      cta: 'Módulo Fondo de Emergencia', ctaTarget: 29, urgency: 'medium'
    },
  };

  const opt = optimizeMap[goal] || optimizeMap.freedom;
  steps.push({
    id: 'optimize_' + goal,
    icon: opt.icon,
    category: 'optimizar',
    title: opt.title,
    body: opt.body,
    amount: null,
    amountLabel: null,
    cta: opt.cta,
    ctaAction: 'module',
    ctaTarget: opt.ctaTarget,
    urgency: opt.urgency,
    status: 'pending',
  });

  // ─────────────────────────────────────────────────────────────
  // Limitar a 5 pasos máximo. Priorizar: high > medium > low
  // y respetar el orden financiero lógico
  // ─────────────────────────────────────────────────────────────
  const prioritized = steps
    .filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i) // deduplicar
    .slice(0, 5);

  // Sincronizar con el estado guardado (preservar 'done')
  const existing = S.actionPlan || [];
  return prioritized.map((step, idx) => {
    const saved = existing.find(e => e.id === step.id);
    return {
      ...step,
      status: saved?.status === 'done' ? 'done' : (idx === 0 ? 'active' : step.status),
      order: idx,
    };
  });
}

/**
 * F27_render — Renderiza el widget del plan de acción en el home screen.
 * Solo visible si el usuario tiene userName (ha hecho onboarding).
 */
function F27_render() {
  if (!isPremium()) {
    const el = document.getElementById('f27-action-plan');
    if (el) {
      el.style.display = 'block';
      el.innerHTML = `<div style="padding:16px;text-align:center;background:var(--surface);border-radius:16px;border:1px solid var(--border);">
        <div style="font-size:28px;margin-bottom:8px;">🗺️</div>
        <div style="font-weight:700;font-size:15px;color:var(--text1);margin-bottom:4px;">Plan de Acción Personalizado</div>
        <div style="font-size:13px;color:var(--text2);margin-bottom:12px;">Pasos concretos según tu situación real.</div>
        <button class="btn btn-primary btn-sm" onclick="PM_showPaywall('f27')">✦ Desbloquear con Elite</button>
      </div>`;
    }
    return;
  }
  const card = document.getElementById('f27-action-plan');
  if (!card) return;

  // Ocultar si no hay usuario o si es muy nuevo (sin datos relevantes)
  if (!S.userName) { card.style.display = 'none'; return; }

  // Generar plan si no existe o si los datos cambiaron desde la última vez
  const dataHash = _f27_dataHash();
  if (!S.actionPlan || S.actionPlan.length === 0 || S._actionPlanHash !== dataHash) {
    S.actionPlan      = F27_generate();
    S._actionPlanHash = dataHash;
  }

  const steps    = S.actionPlan;
  const total    = steps.length;
  const done     = steps.filter(s => s.status === 'done').length;
  const pct      = total > 0 ? Math.round((done / total) * 100) : 0;
  const circ     = 113; // 2π×18
  const offset   = circ - (pct / 100) * circ;

  // Progress ring
  const ringFg = document.getElementById('f27-ring-fg');
  if (ringFg) {
    ringFg.style.strokeDashoffset = offset;
    ringFg.style.stroke = pct >= 80 ? 'var(--accent)' : pct >= 40 ? 'var(--accent2)' : 'var(--gold)';
  }
  setEl('f27-ring-label', `${done}/${total}`);

  // Barra global
  const bar = document.getElementById('f27-global-bar');
  if (bar) bar.style.width = pct + '%';

  // Sub-headline contextual
  const nextActive = steps.find(s => s.status !== 'done');
  const subTexts = {
    0:   `${S.userName ? S.userName.split(' ')[0] : 'Tú'}, aquí están tus próximos pasos reales.`,
    100: '🎉 ¡Plan completado! Tu situación financiera ha mejorado significativamente.',
  };
  setEl('f27-plan-sub', subTexts[pct] ||
    `${done} de ${total} pasos completados · Siguiente: ${nextActive?.title || '—'}`);

  // Renderizar steps
  const stepsEl = document.getElementById('f27-steps');
  if (stepsEl) {
    stepsEl.innerHTML = steps.map((step, i) => _f27_buildStepHTML(step, i)).join('');
  }

  // Footer motivacional
  const footerEl = document.getElementById('f27-plan-footer');
  if (footerEl) footerEl.innerHTML = _f27_buildFooter(steps, done, total);

  // Botón refresh: mostrar si el usuario ha actualizado sus datos de F25 recientemente
  const refreshBtn = document.getElementById('f27-refresh-btn');
  if (refreshBtn) {
    const hasNewData = S.realPatrimonyDate &&
      new Date(S.realPatrimonyDate) > new Date(S._actionPlanGeneratedAt || 0);
    refreshBtn.style.display = hasNewData && done < total ? 'block' : 'none';
  }

  card.style.display = 'block';
  // Animación de entrada solo la primera vez
  if (!card.dataset.shown) {
    card.dataset.shown = '1';
    card.style.animation = 'fadeUp .5s ease';
  }
}

/**
 * _f27_buildStepHTML — Construye el HTML de un step individual.
 */
function _f27_buildStepHTML(step, index) {
  const isDone    = step.status === 'done';
  const isActive  = step.status === 'active';
  const isPending = step.status === 'pending';

  const urgencyColor = {
    high:   'var(--danger)',
    medium: 'var(--gold)',
    low:    'var(--accent)',
  }[step.urgency] || 'var(--text3)';

  const statusClass = isDone ? 'f27-step-done' : isActive ? 'f27-step-active' : 'f27-step-pending';

  return `
  <div class="f27-step ${statusClass}" id="f27-step-${step.id}">
    <!-- Step indicator -->
    <div class="f27-step-indicator">
      <div class="f27-step-num ${isDone?'done':isActive?'active':'pending'}">
        ${isDone ? '✓' : index + 1}
      </div>
      ${index < (S.actionPlan?.length||0)-1 ? '<div class="f27-step-line"></div>' : ''}
    </div>

    <!-- Step content -->
    <div class="f27-step-body">
      <div class="f27-step-header">
        <span class="f27-step-icon">${step.icon}</span>
        <div class="f27-step-title-wrap">
          <div class="f27-step-title">${step.title}</div>
          ${step.urgency === 'high' && !isDone ? `<span class="f27-urgency-tag" style="background:${urgencyColor}20;color:${urgencyColor}">PRIORITARIO</span>` : ''}
          ${isDone ? '<span class="f27-done-tag">COMPLETADO ✓</span>' : ''}
        </div>
      </div>

      <div class="f27-step-desc ${isDone?'f27-step-desc-done':''}">${step.body}</div>

      ${step.amountLabel && !isDone ? `
        <div class="f27-step-amount">
          <span class="f27-amount-label">Importe: </span>
          <span class="f27-amount-val">${step.amountLabel}</span>
        </div>` : ''}

      <!-- Acciones -->
      <div class="f27-step-actions ${isDone?'':''}">
        ${!isDone && step.ctaAction === 'module' && step.ctaTarget !== null ? `
          <button class="f27-cta-btn" onclick="F27_openModule(${step.ctaTarget}, '${step.id}')">
            <span>📖 ${step.cta}</span>
            <span class="f27-cta-arrow">→</span>
          </button>` : ''}
        ${!isDone ? (() => {
          const needsMod = step.ctaAction === 'module' && step.ctaTarget !== null && step.ctaTarget !== undefined;
          const modDone  = needsMod && (S.completedMods || []).includes(step.ctaTarget);
          if (needsMod && !modDone) {
            return `<button class="f27-done-btn f27-done-btn-locked" onclick="F27_stepDone('${step.id}')" title="Completa el módulo primero">
              🔒 Completa el módulo primero
            </button>`;
          }
          return `<button class="f27-done-btn" onclick="F27_stepDone('${step.id}')">
            ✓ Marcar como hecho
          </button>`;
        })() : `
          <button class="f27-undo-btn" onclick="F27_stepUndo('${step.id}')">
            Deshacer
          </button>`}
      </div>
    </div>
  </div>`;
}

/**
 * _f27_buildFooter — Construye el mensaje motivacional del footer.
 */
function _f27_buildFooter(steps, done, total) {
  const monthly   = S.monthlyContribution || 0;
  const netWorth  = S.realPatrimony !== null ? S.realPatrimony : (S.patrimony || 0);
  const proj10    = calcCompound(Math.max(0, netWorth), monthly, 8, 10);
  const allDone   = done === total;

  if (allDone) {
    return `<div class="f27-footer-msg f27-footer-success">
      🏆 Has completado todos los pasos de tu plan. Tu patrimonio está optimizado.
      <strong>Siguiente nivel: diversifica globalmente y aumenta tu aportación mensual.</strong>
    </div>`;
  }

  if (!S.realPatrimony && !S.realAssets) {
    return `<div class="f27-footer-msg f27-footer-tip">
      💡 <strong>Tip:</strong> Introduce tus datos reales con el botón "📊 Mi patrimonio real" para que este plan use tus números exactos.
    </div>`;
  }

  if (monthly > 0) {
    return `<div class="f27-footer-msg">
      📊 Si sigues tu plan y mantienes ${fmtPrice(monthly)}/mes, en 10 años tendrás <strong>${fmtPrice(proj10)}</strong>.
      Cada paso completado acelera ese número.
    </div>`;
  }

  return `<div class="f27-footer-msg f27-footer-tip">
    🎯 Completa el paso 1 hoy. La diferencia entre querer y tener dinero es empezar.
  </div>`;
}

/**
 * F27_stepDone — Marca un paso como completado.
 * Guarda en S, re-renderiza y lanza celebración si es el último.
 */
/**
 * _f27_penaltyShake — Animación de castigo cuando el usuario intenta
 * marcar un paso como hecho sin haber completado el módulo vinculado.
 */
function _f27_penaltyShake(id) {
  const el = document.getElementById('f27-step-' + id);
  if (!el) return;

  // Shake visual
  el.classList.add('f27-penalty-shake');
  setTimeout(() => el.classList.remove('f27-penalty-shake'), 600);

  // Encontrar nombre del módulo vinculado
  const step = (S.actionPlan || []).find(s => s.id === id);
  const modId = step && step.ctaTarget;
  const mod = (typeof MODULES !== 'undefined') ? MODULES.find(m => m && m.id === modId) : null;
  const modName = mod ? mod.title : 'el módulo vinculado';

  // Toast informativo, no acusatorio
  if (typeof toast === 'function') {
    toast('📖 Completa el módulo primero', `"${modName}" debe estar completado para marcar este paso.`, 't-warn');
  }

  // Highlight del botón CTA como guía
  const ctaBtn = el.querySelector('.f27-cta-btn');
  if (ctaBtn) {
    ctaBtn.classList.add('f27-cta-pulse');
    setTimeout(() => ctaBtn.classList.remove('f27-cta-pulse'), 2000);
  }
}

function F27_stepDone(id) {
  if (!S.actionPlan) return;
  const step = S.actionPlan.find(s => s.id === id);
  if (!step || step.status === 'done') return;

  // ── Validación: si el paso tiene módulo vinculado, debe estar completado de verdad
  if (step.ctaAction === 'module' && step.ctaTarget !== null && step.ctaTarget !== undefined) {
    const modCompleted = (S.completedMods || []).includes(step.ctaTarget);
    if (!modCompleted) {
      _f27_penaltyShake(id);
      return;
    }
  }

  step.status = 'done';

  // Activar el siguiente paso pendiente
  const nextPending = S.actionPlan.find(s => s.status !== 'done');
  if (nextPending) nextPending.status = 'active';

  saveState();
  F27_render();

  // Celebración proporcional
  const done  = S.actionPlan.filter(s => s.status === 'done').length;
  const total = S.actionPlan.length;
  const xpReward = 30;
  S.xp += xpReward;
  F34_onXPGained(xpReward);
  spawnXP(xpReward);
  saveState();

  if (done === total) {
    // Plan completado
    setTimeout(() => {
      confetti();
      toast('🎉 ¡Plan completado!', 'Has optimizado tu situación financiera real.', 't-success');
    }, 300);
  } else {
    toast('✅ Paso completado', `+${xpReward} XP · ${total - done} pasos restantes`, 't-success');
  }
}

/**
 * F27_stepUndo — Deshace la marca de completado de un paso.
 */
function F27_stepUndo(id) {
  if (!S.actionPlan) return;
  const step = S.actionPlan.find(s => s.id === id);
  if (step) { step.status = 'pending'; }
  saveState();
  F27_render();
}

/**
 * F27_openModule — Abre el módulo de aprendizaje vinculado a un paso
 * y opcionalmente marca el paso como "en progreso".
 */
function F27_openModule(moduleId, stepId) {
  if (typeof startModule === 'function') {
    startModule(moduleId);
  }
}

/**
 * F27_refresh — Regenera el plan cuando los datos del usuario cambian.
 * Preserva los steps ya marcados como 'done'.
 */
function F27_refresh() {
  const prevDone = (S.actionPlan || [])
    .filter(s => s.status === 'done')
    .map(s => s.id);

  S.actionPlan = F27_generate().map(step => ({
    ...step,
    status: prevDone.includes(step.id) ? 'done' : step.status,
  }));
  S._actionPlanHash      = _f27_dataHash();
  S._actionPlanGeneratedAt = new Date().toISOString();
  saveState();
  F27_render();
  toast('🔄 Plan actualizado', 'Calculado con tus datos más recientes.', 't-success');
}

/**
 * _f27_dataHash — Hash ligero para detectar si los datos del usuario
 * han cambiado desde la última vez que se generó el plan.
 */
function _f27_dataHash() {
  const key = [
    S.goal, S.investorLevel, S.monthlyContribution,
    S.income, S.realPatrimony,
    JSON.stringify(S.realAssets), JSON.stringify(S.realDebts)
  ].join('|');
  // djb2 hash
  let h = 5381;
  for (let i = 0; i < key.length; i++) h = ((h << 5) + h) ^ key.charCodeAt(i);
  return h >>> 0;
}

function renderProfileScreen() {
  updateUIFromState();
  renderAchievements();
  renderActivity();
  renderXPChart();
  renderDebtTracker();
  // F13: certificado visible cuando hay 10+ módulos
  const _certCard = document.getElementById('prof-cert-card');
  const _certBtn  = document.getElementById('prof-cert-btn');
  const _mods     = (S.completedMods||[]).length;
  if (_certCard) _certCard.style.display = _mods >= 10 ? 'flex' : 'none';
  if (_certBtn)  _certBtn.style.display  = _mods >= 10 ? 'flex' : 'none';
  // F19: mostrar perfil inversor si existe
  const _invCard = document.getElementById('investor-profile-card');
  const _invBtn  = document.getElementById('inv-test-btn') || document.querySelector('.inv-test-btn');
  const _invProf = S.investorProfile;
  if (_invCard) {
    if (_invProf) {
      _invCard.style.display = 'flex';
      _invCard.innerHTML = '<span class="inv-prof-icon" style="color:'+_invProf.color+';">'+_invProf.icon+'</span>'
        + '<div class="inv-prof-info"><div class="inv-prof-label" style="color:'+_invProf.color+';">'+_invProf.label+'</div>'
        + '<div class="inv-prof-sub">'+INVESTOR_PROFILES[_invProf.id.slice(0,1)]?.tagline+'</div></div>'
        + '<button class="btn btn-ghost btn-sm" onclick="INVESTOR_TEST.open()" style="font-size:11px;flex-shrink:0;">Repetir</button>';
      if (_invBtn) {
        document.getElementById('inv-test-title').textContent = 'Tu perfil: '+_invProf.label;
        document.getElementById('inv-test-sub').textContent   = 'Pulsa para ver tu cartera recomendada';
        document.getElementById('inv-test-icon').textContent  = _invProf.icon;
      }
    } else {
      _invCard.style.display = 'none';
    }
  }
  setEl('prof-name',          S.userName || 'Explorador');
  setEl('prof-handle',        `@${(S.userName || 'usuario').toLowerCase().replace(/\s+/g, '')} · Nivel ${S.level}`);
  setEl('prof-xp-total',      S.xp);
  setEl('prof-streak-val',    '🔥' + S.streak);
  const maxStr = Math.max(S.maxStreak || 0, S.streak || 0);
  const maxEl = document.getElementById('prof-max-streak-val');
  if (maxEl) maxEl.textContent = '🏅 ' + maxStr;
  setEl('prof-modules-count', S.completedMods.length);
  // prof-av: no usar setEl — borraría el sprite inyectado por AVATAR_AI
  (function() {
    var _pa = document.getElementById('prof-av');
    if (_pa && !_pa.querySelector('.fl-gen-av')) _pa.textContent = S.avatar || '🌱';
  })();
  setEl('prof-goal-txt',      S.goalLabel || '🏝️ Libertad financiera');

  // P4-B: render tabla de rangos en el perfil
  renderLevelTitlesPanel();

  // P3-B: Estadísticas personales
  (function() {
    const weekXP     = Math.max(0, (S.xp || 0) - (S.leagueWeekXPBase || 0));
    const snap       = S.weeklySnapshot || {};
    const prevXP     = snap.prev ? Math.max(0, (snap.cur?.xp || S.xp) - (snap.prev?.xp || 0)) : null;
    const studyH     = S.totalStudyMinutes ? (S.totalStudyMinutes < 60
                         ? S.totalStudyMinutes + ' min'
                         : Math.floor(S.totalStudyMinutes / 60) + 'h ' + (S.totalStudyMinutes % 60) + 'min') : '—';
    // Rama más avanzada
    const completed  = S.completedMods || [];
    const topBranch  = F28_BRANCHES.reduce((best, b) => {
      const pct = b.mods.length ? (b.mods.filter(id => completed.includes(id)).length / b.mods.length) : 0;
      return pct > (best.pct || 0) ? { pct, label: b.emoji + ' ' + b.label } : best;
    }, { pct: 0, label: '—' });
    setEl('prof-week-xp',    weekXP.toLocaleString('es') + ' XP');
    setEl('prof-lastweek-xp', prevXP !== null ? prevXP.toLocaleString('es') + ' XP' : '—');
    setEl('prof-study-time', studyH);
    setEl('prof-top-branch', topBranch.pct > 0 ? topBranch.label : '—');
    // Delta XP semana vs anterior
    const deltaRow = document.getElementById('prof-xp-delta-row');
    if (deltaRow && prevXP !== null && weekXP > 0) {
      const diff = weekXP - prevXP;
      const pctDiff = prevXP > 0 ? Math.abs(Math.round((diff / prevXP) * 100)) : null;
      const icon = diff >= 0 ? '📈' : '📉';
      const txt  = diff >= 0
        ? `Ganaste ${diff.toLocaleString('es')} XP más que la semana pasada${pctDiff ? ' (+' + pctDiff + '%)' : ''}`
        : `Ganaste ${Math.abs(diff).toLocaleString('es')} XP menos que la semana pasada${pctDiff ? ' (-' + pctDiff + '%)' : ''}`;
      setEl('prof-xp-delta-icon', icon);
      setEl('prof-xp-delta-txt',  txt);
      deltaRow.style.display = 'flex';
    } else if (deltaRow) {
      deltaRow.style.display = 'none';
    }
  })();

  const _modTotal = MODULES.filter(function(m){return m&&typeof m.id==='number';}).length;
  const pct  = Math.round((S.completedMods.length / _modTotal) * 100);
  setEl('prof-goal-pct', pct + '%');
  const fill = document.getElementById('prof-goal-fill');
  if (fill) fill.style.width = pct + '%';
  setEl('progress-text-profile', `${S.completedMods.length} de ${_modTotal}`);

  // PRIORIDAD 2: Personality Test + Branch Certs cards
  if (typeof PROF_renderGamifCards === 'function') PROF_renderGamifCards();
  // SPEEDRUN records
  if (typeof SPEEDRUN_renderRecords === 'function') { try { SPEEDRUN_renderRecords(); } catch(e) {} }
  renderStreakBadges();
  _renderProfileFinancialHealth();
}


function _renderProfileFinancialHealth() {
  var el = document.getElementById('prof-fin-health');
  if (!el) return;
  var hist    = S._realMoneyHistory || [];
  var total   = S._realMoneyTotal || 0;
  var actions = S._realActionsCount || 0;
  if (hist.length === 0 && actions === 0) {
    el.style.display = 'none'; return;
  }
  el.style.display = 'block';
  var last = hist.length > 0 ? hist[hist.length - 1] : null;
  var lastSavings  = last ? (last.savings || 0) : 0;
  var lastExpenses = last ? (last.totalExpenses || 0) : 0;
  var lastRate     = (last && last.income > 0) ? Math.round((lastSavings / last.income) * 100) : null;
  var rateColor    = lastRate === null ? 'var(--text2)' : lastRate >= 20 ? '#00e5a0' : lastRate >= 10 ? '#f5a623' : '#ef4444';
  var rateLabel    = lastRate === null ? '—' : lastRate + '%';

  // FIRE calc
  var fireTarget = lastExpenses > 0 ? Math.round(lastExpenses * 12 * 25) : 0;
  var fireYrsHtml = '';
  if (fireTarget > 0 && lastSavings > 0) {
    var mRate = 0.07 / 12;
    var pv = (S.realPatrimony != null && S.realPatrimony > 0) ? S.realPatrimony : total;
    var v = pv, months = 0;
    while (v < fireTarget && months < 600) { v = v * (1 + mRate) + lastSavings; months++; }
    var yrs = months < 600 ? Math.ceil(months / 12) : null;
    fireYrsHtml = yrs !== null
      ? '<span style="color:var(--accent);font-weight:700;">' + yrs + ' años</span> para independencia financiera'
      : 'Aumenta tu ahorro para calcular tu independencia';
  }

  el.innerHTML = '<div style="background:linear-gradient(135deg,rgba(0,229,160,.08),rgba(0,229,160,.02));border:1px solid rgba(0,229,160,.2);border-radius:16px;padding:18px;cursor:pointer;" onclick="goTo(\'realmoney\')">'
    + '<div style="font-size:11px;font-weight:800;color:#00e5a0;letter-spacing:.08em;margin-bottom:14px;">💰 MI SITUACIÓN FINANCIERA REAL</div>'
    + '<div style="display:flex;gap:10px;margin-bottom:' + (fireYrsHtml ? '12px' : '0') + ';">'
      + '<div style="flex:1;background:var(--bg);border-radius:10px;padding:10px;">'
        + '<div style="font-size:10px;color:var(--text2);margin-bottom:3px;">AHORROS ACUMULADOS</div>'
        + '<div style="font-family:\'Syne\',sans-serif;font-size:20px;font-weight:800;color:#00e5a0;">€' + total.toLocaleString('es') + '</div>'
      + '</div>'
      + '<div style="flex:1;background:var(--bg);border-radius:10px;padding:10px;">'
        + '<div style="font-size:10px;color:var(--text2);margin-bottom:3px;">TASA DE AHORRO</div>'
        + '<div style="font-family:\'Syne\',sans-serif;font-size:20px;font-weight:800;color:' + rateColor + ';">' + rateLabel + '</div>'
      + '</div>'
      + '<div style="flex:1;background:var(--bg);border-radius:10px;padding:10px;">'
        + '<div style="font-size:10px;color:var(--text2);margin-bottom:3px;">ACCIONES REALES</div>'
        + '<div style="font-family:\'Syne\',sans-serif;font-size:20px;font-weight:800;color:var(--gold);">' + actions + '</div>'
      + '</div>'
    + '</div>'
    + (fireYrsHtml ? '<div style="font-size:12px;color:var(--text2);padding-top:10px;border-top:1px solid rgba(0,229,160,.15);">🏝️ ' + fireYrsHtml + '</div>' : '')
  + '</div>';
}
window._renderProfileFinancialHealth = _renderProfileFinancialHealth;

/* ── P4-B: Panel de rangos en el perfil ─────────────────────────── */
/**
 * renderLevelTitlesPanel — Renderiza la tabla visual de todos los títulos
 * de rango en el perfil, marcando el actual y el progreso hacia el siguiente.
 */
function renderLevelTitlesPanel() {
  const container = document.getElementById('level-titles-panel');
  if (!container) return;
  const currentXP = S.xp || 0;
  const currentIdx = getLevelTitle(currentXP).idx;

  let html = '<div class="ltp-header"><span class="ltp-title">🏅 Tu Rango</span></div>';
  html += '<div class="ltp-list">';

  LEVEL_TITLES.forEach((t, i) => {
    const isActive  = i === currentIdx;
    const isDone    = i < currentIdx;
    const isLocked  = i > currentIdx;
    const nextT     = LEVEL_TITLES[i + 1];
    let progressBar = '';

    if (isActive && nextT) {
      const xpInRange  = currentXP - t.minXP;
      const rangeSize  = nextT.minXP - t.minXP;
      const pct        = Math.min(100, Math.round((xpInRange / rangeSize) * 100));
      const xpLeft     = nextT.minXP - currentXP;
      progressBar = `
        <div class="ltp-progress-wrap">
          <div class="ltp-progress-bar" style="background:${t.color}20;">
            <div class="ltp-progress-fill" style="width:${pct}%;background:${t.color};"></div>
          </div>
          <span class="ltp-progress-label">${xpLeft.toLocaleString('es')} XP para siguiente rango</span>
        </div>`;
    }

    html += `
      <div class="ltp-row${isActive ? ' ltp-row--active' : ''}${isDone ? ' ltp-row--done' : ''}${isLocked ? ' ltp-row--locked' : ''}"
           style="${isActive ? '--rank-color:' + t.color + ';' : ''}">
        <div class="ltp-icon" style="color:${isLocked ? '#444' : t.color}">${isLocked ? '🔒' : t.icon}</div>
        <div class="ltp-info">
          <div class="ltp-name" style="color:${isLocked ? '#555' : (isActive ? t.color : '#aaa')}">${t.title}</div>
          <div class="ltp-xp-req">${t.minXP === 0 ? 'Rango inicial' : 'Desde ' + t.minXP.toLocaleString('es') + ' XP'}</div>
          ${isActive ? '<div class="ltp-desc">' + t.desc + '</div>' : ''}
          ${progressBar}
        </div>
        ${isDone ? '<div class="ltp-check">✅</div>' : ''}
        ${isActive ? '<div class="ltp-current-badge" style="background:' + t.color + '15;color:' + t.color + ';border-color:' + t.color + '40;">ACTUAL</div>' : ''}
      </div>`;
  });

  html += '</div>';
  container.innerHTML = html;
}
window.renderLevelTitlesPanel = renderLevelTitlesPanel;


/* ══════════════════════════════════════════════════════════════════
   P4-D — CARTA DE PERSONAJE (Character Card)
   Pantalla tipo carta de jugador, exportable/compartible.
   Sin canvas — todo CSS/HTML generado dinámicamente.
══════════════════════════════════════════════════════════════════ */

/**
 * GOAL_MOTTOS — frases motivacionales según S.goal del usuario.
 */
const GOAL_MOTTOS = {
  freedom:    '"La libertad financiera no es un destino, es un hábito diario."',
  save:       '"Cada euro ahorrado es un voto por tu futuro yo."',
  invest:     '"El mercado recompensa la paciencia, no la impaciencia."',
  house:      '"Tu hogar no es solo un activo — es la base de tu plan financiero."',
  business:   '"El mejor negocio en el que puedes invertir eres tú mismo."',
};

/**
 * openCharCard() — Renderiza y abre la carta de personaje.
 */
function openCharCard() {
  const el = document.getElementById('m-char-card');
  if (!el) return;

  const titleData    = getLevelTitle(S.xp || 0);
  const completed    = S.completedMods || [];
  const totalMods    = MODULES.filter(function(m){return m&&typeof m.id==='number';}).length;
  const pct          = totalMods > 0 ? Math.round((completed.length / totalMods) * 100) : 0;
  const streak       = S.streak || 0;
  const name         = S.userName || 'Explorador';
  const avatar       = S.avatar || '🌱';
  const profColor    = S.profileColor || '#00e5a0';
  const goal         = S.goal || 'freedom';
  const motto        = GOAL_MOTTOS[goal] || GOAL_MOTTOS.freedom;
  const joinDate     = S.joinDate ? new Date(S.joinDate).toLocaleDateString('es-ES', {month:'short', year:'numeric'}) : 'Hoy';

  // Top 3 logros desbloqueados
  const earnedAchs   = (S.unlockedAchs || []);
  const top3Achs     = ACHIEVEMENTS.filter(a => earnedAchs.includes(a.id)).slice(0, 3);

  // Progreso por rama (% completado)
  const branchBars   = F28_BRANCHES.map(b => {
    const done = b.mods.filter(id => completed.includes(id)).length;
    const pctB = b.mods.length > 0 ? Math.round((done / b.mods.length) * 100) : 0;
    return { label: b.emoji + ' ' + b.label, pct: pctB, color: b.color };
  });

  // Handle de usuario
  const handle = '@' + name.toLowerCase().replace(/\s+/g, '') + ' · FinLearn';

  const cardEl = document.getElementById('char-card-inner');
  if (!cardEl) return;

  cardEl.style.setProperty('--card-accent', profColor);

  cardEl.innerHTML = `
    <div class="cc-header" style="background:linear-gradient(135deg,${profColor}22 0%,${profColor}08 100%);border-bottom:1px solid ${profColor}30;">
      <div class="cc-avatar" style="border-color:${profColor};box-shadow:0 0 18px ${profColor}55;">${avatar}</div>
      <div class="cc-header-info">
        <div class="cc-name">${name}</div>
        <div class="cc-handle" style="color:${profColor};">${titleData.icon} ${titleData.title}</div>
        <div class="cc-meta">📅 Desde ${joinDate} · ${handle}</div>
      </div>
    </div>
    <div class="cc-stats-row">
      <div class="cc-stat">
        <div class="cc-stat-val" style="color:${profColor};">${(S.xp||0).toLocaleString('es')}</div>
        <div class="cc-stat-lbl">XP Total</div>
      </div>
      <div class="cc-stat">
        <div class="cc-stat-val" style="color:#f59e0b;">🔥${streak}</div>
        <div class="cc-stat-lbl">Racha</div>
      </div>
      <div class="cc-stat">
        <div class="cc-stat-val" style="color:#60a5fa;">${completed.length}</div>
        <div class="cc-stat-lbl">Módulos</div>
      </div>
      <div class="cc-stat">
        <div class="cc-stat-val" style="color:#c084fc;">${earnedAchs.length}</div>
        <div class="cc-stat-lbl">Logros</div>
      </div>
    </div>
    <div class="cc-progress-global">
      <div class="cc-prog-label">
        <span>Progreso global</span><span style="color:${profColor};font-weight:700;">${pct}%</span>
      </div>
      <div class="cc-prog-track"><div class="cc-prog-fill" style="width:${pct}%;background:${profColor};"></div></div>
    </div>
    <div class="cc-branches">
      ${branchBars.map(b => `
        <div class="cc-branch-row">
          <div class="cc-branch-label">${b.label}</div>
          <div class="cc-branch-track">
            <div class="cc-branch-fill" style="width:${b.pct}%;background:${b.color};"></div>
          </div>
          <div class="cc-branch-pct" style="color:${b.color};">${b.pct}%</div>
        </div>`).join('')}
    </div>
    ${top3Achs.length > 0 ? `
    <div class="cc-achs">
      <div class="cc-achs-label">Logros destacados</div>
      <div class="cc-achs-row">
        ${top3Achs.map(a => `<div class="cc-ach-badge" title="${a.n}">${a.i}</div>`).join('')}
      </div>
    </div>` : ''}
    <div class="cc-motto">${motto}</div>
    <div class="cc-footer">finlearn.app · ${new Date().getFullYear()}</div>
  `;

  openModal('m-char-card');
}

/**
 * shareCharCard() — Comparte la carta usando navigator.share o copia al portapapeles.
 */
function shareCharCard() {
  const titleData = getLevelTitle(S.xp || 0);
  const name      = S.userName || 'Un usuario';
  const streak    = S.streak || 0;
  const completed = (S.completedMods || []).length;
  const achs      = (S.unlockedAchs || []).length;

  const text = `🏆 Mi carta de personaje en FinLearn\n\n👤 ${name} — ${titleData.icon} ${titleData.title}\n⚡ ${(S.xp||0).toLocaleString('es')} XP · 🔥 ${streak} días de racha\n📚 ${completed} módulos completados · 🏅 ${achs} logros\n\n¡Aprende finanzas reales y compite conmigo! → ${window.location.origin}`;

  if (navigator.share) {
    navigator.share({ title: 'Mi carta FinLearn', text }).catch(() => {});
  } else {
    navigator.clipboard?.writeText(text).then(() => {
      toast('📋 Copiado', 'Texto copiado al portapapeles. ¡Pégalo donde quieras!', 't-success');
    }).catch(() => {
      toast('📋 Tu carta', text, 't-info');
    });
  }
  HAPTIC.light();
}

window.openCharCard  = openCharCard;
window.shareCharCard = shareCharCard;


/* ══════════════════════════════════════════════════════════════════
   ACCIÓN DIARIA (DCA)
   ─────────────────────────────────────────────────────────────────
   DCA = Dollar Cost Averaging. En FinLearn es la "acción del día":
   una pregunta corta que el usuario responde para mantener su racha.
   Responderla correctamente da +80 XP y +1 día de racha.
══════════════════════════════════════════════════════════════════ */

/**
 * renderDCA — Renderiza la tarjeta de pregunta diaria.
 * Si ya se respondió hoy (S.dcaDone), muestra la vista de completado.
 * Si no, elige una pregunta aleatoria de DAILY_QUESTIONS.
 */
function renderDCA() {
  if (S.dcaDone) {
    document.getElementById('dca-not-done')?.style?.setProperty('display', 'none');
    const done = document.getElementById('dca-done');
    if (done) done.style.display = 'block';
    return;
  }

  // Seed diaria: misma pregunta todo el día, no se puede eludir recargando
  const _dcaSeed = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const _dcaIdx = parseInt(_dcaSeed, 10) % DAILY_QUESTIONS.length;
  const q = DAILY_QUESTIONS[_dcaIdx];
  if (!q) return;

  setEl('dca-q-title', q.q || q.question || q.title || 'Reto de hoy');
  setEl('dca-q-text',  '');
  const opts = document.getElementById('dca-q-opts');
  const options = q.options || q.opts || [];
  if (opts && options.length) {
    opts.innerHTML = options.map((o, i) =>
      `<button class="dca-opt" onclick="answerDCA(${i},${q.correct},'${encodeURIComponent(q.explain || q.explanation || '')}')">${o}</button>`
    ).join('');
  }
}

/**
 * answerDCA — Procesa la respuesta del usuario a la pregunta DCA.
 * ─────────────────────────────────────────────────────────────────
 * · Marca visualmente la opción correcta e incorrecta
 * · Suma XP y actualiza la racha
 * · Desbloquea el contenido premium del día (updateDCALock)
 * · Expuesto a window porque es llamado desde onclick="" en renderDCA
 */
function answerDCA(chosen, correct, explanation) {
  if (S.dcaDone) return;
  const opts = document.querySelectorAll('.dca-opt');
  opts.forEach((b, i) => {
    b.disabled = true;
    if (i === correct)               b.classList.add('correct');
    if (i === chosen && chosen !== correct) b.classList.add('wrong');
  });

  const isCorrect = chosen === correct;
  const _dcaMult  = _comboHit(isCorrect);
  const xpGained  = isCorrect ? Math.round(80 * _dcaMult) : 0;

  if (typeof SFX !== 'undefined') { isCorrect ? SFX.correct() : SFX.wrong(); }
  S.xp           += xpGained;
  S.totalXPtoday += xpGained;
  if (xpGained > 0) F34_onXPGained(xpGained);
  S.dcaDone       = true;
  S.dcaDate       = new Date().toISOString().slice(0, 10);
  // Racha: sube solo si aciertas; si fallas, mantiene el valor actual (nunca fuerza a 1)
  if (isCorrect) {
    S.streak = (S.streak || 0) + 1;
    _checkStreakMilestone(S.streak);
  }
  S.maxStreak = Math.max(S.maxStreak || 0, S.streak || 0);
  if (isCorrect && typeof F34_onXPGained === 'function') F34_onXPGained(xpGained);
  saveState();
  checkAchievements();
  updateDCALock(true);

  setTimeout(() => {
    document.getElementById('dca-not-done')?.style?.setProperty('display', 'none');
    const done = document.getElementById('dca-done');
    setEl('dca-done-msg', isCorrect ? '¡Correcto! 🎯' : '❌ Respuesta incorrecta');
    setEl('dca-done-sub', isCorrect ? `Has ganado +${xpGained} XP · Racha: 🔥${S.streak}` : `Sin XP hoy. Vuelve mañana y acierta para +80 XP y mantener tu racha.`);
    if (done) done.style.display = 'block';
    if (xpGained > 0) spawnXP('+' + xpGained + ' XP');
    if (isCorrect) toast('🎯 ¡Correcto!', '+' + xpGained + ' XP ganados', 't-success');
    else toast('❌ Incorrecto', 'Sin XP · Vuelve mañana para mantener tu racha', 't-error');
    renderDailyHub();
    updateUIFromState();
  }, 900);
}


function shareDCA() {
  var streak = (typeof S !== 'undefined' && S.streak) || 0;
  var text = '🎯 He completado el reto financiero del día en FinLearn. Llevo ' + streak + ' días de racha. ¡Aprende finanzas en 1 minuto al día!';
  var url = window.location.origin;
  if (navigator.share) {
    navigator.share({ title: 'FinLearn — Reto diario', text: text, url: url }).catch(function() {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text + ' ' + url).then(function() {
      if (typeof toast === 'function') toast('📋 Copiado', 'Pega el mensaje donde quieras compartirlo', 't-success');
    });
  }
}
window.shareDCA = shareDCA;

/* ══════════════════════════════════════════════════════════════════
   WIDGETS DE HOME
══════════════════════════════════════════════════════════════════ */

/**
 * _renderTicker — Inicia el ticker de prueba social.
 * Rota los mensajes de SOCIAL_PROOF cada 5 segundos con fade.
 * El prefijo _ indica función interna (no se expone a window).
 */
let _tickerRunning = false;
function _renderTicker() {
  const el = document.getElementById('ticker-inner');
  if (!el || !SOCIAL_PROOF?.length || _tickerRunning) return;
  _tickerRunning = true;
  let idx = 0;
  const rotate = () => {
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent   = SOCIAL_PROOF[idx % SOCIAL_PROOF.length];
      el.style.opacity = '1';
      idx++;
    }, 400);
  };
  rotate();
  setInterval(rotate, 5000);
}

/**
 * _renderFacts — Inicia la rotación de datos financieros curiosos.
 * Cambia cada 9 segundos con fade animado.
 */
let _factsRunning = false;
function _renderFacts() {
  if (!FINANCIAL_FACTS?.length || _factsRunning) return;
  _factsRunning = true;
  let idx = 0;
  const show = (i) => {
    const f   = FINANCIAL_FACTS[i];
    if (!f) return;
    const el  = document.getElementById('facts-text');
    const src = document.getElementById('facts-source');
    if (el)  { el.style.opacity = '0';  setTimeout(() => { el.innerHTML   = f.text   || f;  el.style.opacity  = '1'; }, 300); }
    if (src) { src.style.opacity = '0'; setTimeout(() => { src.textContent = f.source || ''; src.style.opacity = '1'; }, 300); }
  };
  show(0);
  setInterval(() => { idx = (idx + 1) % FINANCIAL_FACTS.length; show(idx); }, 8000);
}

/**
 * _updateInactionModule — Calcula el coste diario de no invertir.
 * ─────────────────────────────────────────────────────────────────
 * Fórmula: pérdida_diaria = aportación_anual × rentabilidad / 365
 * Es un motivador conductual: muestra cuánto "pierde" el usuario
 * cada día que no invierte su dinero.
 */
function _updateInactionModule() {
  const monthly   = S.monthlyContribution || 200;
  const dailyLoss = ((monthly * 12 * (S.expectedReturn || 7) / 100) / 365).toFixed(2);
  setEl('ina-amount', `−€${dailyLoss}`);
  setEl('ina-desc',   `Cada día sin invertir pierdes €${dailyLoss} de tu futuro. Basado en tu proyección al ${S.expectedReturn || 7}% anual con ${monthly}€/mes.`);
}


// ═══ SCRIPT — Onboarding ═══
/* ══════════════════════════════════════════════════════════════════
   script-onboarding.js — Onboarding y Configuración Inicial

   ¿QUÉ ES ESTO Y POR QUÉ EXISTE?
   ─────────────────────────────────────────────────────────────────
   El onboarding es el flujo de bienvenida de 4 pasos:
     1. Seleccionar objetivo financiero (libertad, casa, retiro…)
     2. Elegir nombre y avatar
     3. Ver proyección de patrimonio basada en aportación mensual
     4. Introducir datos financieros reales (ahorros, aportación, retorno)

   También incluye el landing overlay de primera visita y la gestión
   del modal de avatar (accesible también desde el perfil).

   DEPENDENCIAS:
   · Importa goTo de script-nav.js (navegar a home tras finalizar)
   · No importa de ningún otro script-* → sin circulares

   QUÉ EXPORTA:
   · GR_landingCTA()              → acción del botón CTA del landing
   · GR_initLanding()             → muestra u oculta el landing overlay
   · selectGoal(key, label)       → selecciona un objetivo financiero
   · pickAvatar(emoji, name)      → elige avatar en el onboarding
   · pickAvatar2(emoji, name)     → elige avatar desde el modal de perfil
   · validateObs2()               → valida el campo de nombre del onboarding
   · obNext(step)                 → avanza al siguiente paso del onboarding
   · finishOnboarding()           → completa el onboarding y va al home
   · _renderProjectionStep()      → calcula y muestra la proyección del paso 3
   · _updateFinPreviewOnboarding()→ actualiza preview en tiempo real del paso 4
══════════════════════════════════════════════════════════════════ */



/* ══════════════════════════════════════════════════════════════════
   LANDING OVERLAY
   ─────────────────────────────────────────────────────────────────
   El landing overlay se muestra solo en la primera visita del usuario.
   Una vez visto, se marca en localStorage para no volver a aparecer.
══════════════════════════════════════════════════════════════════ */

/**
 * GR_landingCTA — Acción del botón principal del landing.
 * Si el usuario ya completó el onboarding, va al home directamente.
 * Si no, abre el onboarding.
 */
function GR_landingCTA() {
  const landing = document.getElementById('gr-landing-overlay');
  if (landing) landing.style.display = 'none';
  if (S.userName) {
    goTo('home');
  } else {
    showScreen('s-onboard');
    setTimeout(_hideSplash, 600);
  }
  try { localStorage.setItem('fl_landing', 'true'); } catch (e) { }
}

/**
 * GR_initLanding — Decide si mostrar u ocultar el landing overlay.
 * · Lo muestra solo si el usuario nunca lo vio Y no tiene nombre.
 * · En cualquier otro caso lo oculta.
 */
function GR_initLanding() {
  const overlay = document.getElementById('gr-landing-overlay');
  if (!overlay) return;
  try {
    const seen = localStorage.getItem('fl_landing');
    overlay.style.display = (seen || S.userName) ? 'none' : 'flex';
  } catch (e) {
    overlay.style.display = 'none';
  }
}

// showScreen ya definida en script-nav


/* ══════════════════════════════════════════════════════════════════
   PASO 1 — OBJETIVO FINANCIERO
══════════════════════════════════════════════════════════════════ */

/**
 * selectGoal — Selecciona un objetivo financiero del onboarding.
 * ─────────────────────────────────────────────────────────────────
 * Marca la tarjeta visual seleccionada y activa el botón de continuar.
 * key: 'freedom' | 'house' | 'retire' | 'emergency' | etc.
 */
function selectGoal(key, label) {
  S.goal      = key;
  S.goalLabel = label;
  document.querySelectorAll('.goal-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById('g-' + key);
  if (card) card.classList.add('selected');
  const btn = document.getElementById('ob-s1-btn');
  if (btn) {
    btn.style.opacity = '1';
    btn.style.cursor  = 'pointer';
  }
}


/* ══════════════════════════════════════════════════════════════════
   PASO 2 — NOMBRE Y AVATAR
══════════════════════════════════════════════════════════════════ */

/**
 * pickAvatar — Elige avatar durante el onboarding.
 * Marca visualmente el avatar seleccionado y actualiza S.avatar.
 */
function pickAvatar(emoji, name) {
  S.avatar = emoji; S.avatarName = name;
  document.querySelectorAll('.av-opt').forEach(o => o.classList.remove('sel'));
  const opt = document.querySelector(`.av-opt[data-av="${emoji}"]`);
  if (opt) opt.classList.add('sel');
  const selAv = document.getElementById('ob-sel-av');
  if (selAv) selAv.textContent = emoji;
  validateObs2();
}

/**
 * pickAvatar2 — Elige avatar desde el modal de perfil (post-onboarding).
 * ─────────────────────────────────────────────────────────────────
 * Diferencia con pickAvatar: este también actualiza los avatares
 * visibles en el nav y el perfil, y cierra el modal.
 */
function pickAvatar2(emoji, name) {
  S.avatar = emoji; S.avatarName = name;
  document.querySelectorAll('#m-avatar .av-opt').forEach(o => o.classList.remove('sel'));
  const opt = document.querySelector(`#m-avatar .av-opt[data-av="${emoji}"]`) ||
    [...document.querySelectorAll('#m-avatar .av-opt')]
      .find(o => o.querySelector('.av-em')?.textContent === emoji);
  if (opt) opt.classList.add('sel');
  saveState();
  closeModal('m-avatar');
  // Inyectar sprite nuevo (quita emoji anterior, aplica sprite sin fondo)
  if (typeof AVATAR_AI !== 'undefined') AVATAR_AI.apply(name);
  toast('✅ Avatar actualizado', 'Tu nuevo avatar está activo', 't-success');
}

/**
 * validateObs2 — Valida el campo de nombre del onboarding.
 * Activa el botón "Continuar" solo si el nombre tiene ≥2 caracteres.
 */
function validateObs2() {
  const inp = document.getElementById('ob-name-input');
  const btn = document.getElementById('ob-s2-btn');
  if (!inp || !btn) return;
  const ok           = inp.value.trim().length >= 2;
  btn.style.opacity  = ok ? '1'           : '0.4';
  btn.style.cursor   = ok ? 'pointer'     : 'not-allowed';
}


/* ══════════════════════════════════════════════════════════════════
   NAVEGACIÓN ENTRE PASOS DEL ONBOARDING
══════════════════════════════════════════════════════════════════ */

/**
 * obNext — Avanza al siguiente paso del onboarding.
 * ─────────────────────────────────────────────────────────────────
 * Lee el nombre del input antes de avanzar (por si el usuario
 * escribió y no hizo blur). Activa el paso correspondiente
 * y llama al setup específico si hace falta.
 */
/* ── Datos de la profesión seleccionada en onboarding ───────── */
let _ob_selected_career = null;

/**
 * _ob_renderProfessions — Renderiza la cuadrícula de profesiones en ob-sprof.
 * Muestra sólo las 6 carreras iniciales (hasta entrepreneur).
 */
function _ob_renderProfessions() {
  const grid = document.getElementById('ob-prof-grid');
  if (!grid) return;

  // Mostrar solo las que son elegibles al inicio (salary > 0 o intern)
  const startable = CAREERS.filter(c =>
    ['intern','junior','specialist','senior','director','entrepreneur'].includes(c.id)
  );

  grid.innerHTML = startable.map(c => `
    <div class="ob-prof-card ${_ob_selected_career === c.id ? 'selected' : ''}"
         id="ob-pc-${c.id}" onclick="_ob_selectCareer('${c.id}')">
      <div class="ob-pc-icon">${c.icon}</div>
      <div class="ob-pc-title">${c.title}</div>
      <div class="ob-pc-salary">${c.salaryRange}</div>
    </div>
  `).join('');
}

function _ob_selectCareer(id) {
  _ob_selected_career = id;
  // Actualizar selección visual
  document.querySelectorAll('.ob-prof-card').forEach(el => el.classList.remove('selected'));
  const sel = document.getElementById('ob-pc-' + id);
  if (sel) sel.classList.add('selected');

  // Mostrar detalle
  const career  = CAREERS.find(c => c.id === id);
  const detail  = document.getElementById('ob-prof-detail');
  if (career && detail) {
    detail.style.display = 'block';
    detail.innerHTML = `
      <div class="ob-pd-desc">${career.description}</div>
      <div class="ob-pd-pros-cons">
        <div class="ob-pd-col">
          ${career.pros.map(p=>`<div class="ob-pd-item ob-pd-pro">✓ ${p}</div>`).join('')}
        </div>
        <div class="ob-pd-col">
          ${career.cons.map(c=>`<div class="ob-pd-item ob-pd-con">✗ ${c}</div>`).join('')}
        </div>
      </div>
      <div class="ob-pd-lesson">"${career.lesson}"</div>`;
  }

  // Habilitar botón continuar
  const btn = document.getElementById('ob-sprof-btn');
  if (btn) {
    btn.style.opacity = '1';
    btn.style.cursor  = 'pointer';
  }

  // Pre-rellenar ingresos en step 4 con el sueldo de la carrera.
  // Solo sobreescribe si el usuario no lo ha editado manualmente.
  const incomeInput = document.getElementById('ob-income');
  if (incomeInput && career.salary > 0 && !incomeInput.dataset.manualEdit) {
    incomeInput.value = career.salary;
  }
}

/* ══════════════════════════════════════════════════════════════════
   F24 — ONBOARDING PERSONALIZADO: Nuevos pasos y helpers
══════════════════════════════════════════════════════════════════ */

/**
 * selectInvestorLevel — Selecciona el nivel de conocimiento del usuario.
 * Activa la tarjeta visual y habilita el botón de continuar.
 */
function selectInvestorLevel(level, label) {
  S.investorLevel = level;
  document.querySelectorAll('.ob-level-card').forEach(c => c.classList.remove('selected'));
  const card = document.getElementById('lvl-' + level);
  if (card) card.classList.add('selected');
  const btn = document.getElementById('ob-s3-btn');
  if (btn) {
    btn.style.opacity = '1';
    btn.style.cursor  = 'pointer';
  }
}

/**
 * _ob_updateMonthlySlider — Actualiza display + proyecciones en tiempo real
 * mientras el usuario arrastra el slider de aportación mensual.
 */
function _ob_updateMonthlySlider() {
  const slider = document.getElementById('ob-monthly-slider');
  if (!slider) return;
  const val = parseInt(slider.value, 10) || 0;
  const pct = (val / 2000 * 100).toFixed(1);
  slider.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--border2) ${pct}%)`;

  const display = document.getElementById('ob-monthly-display');
  if (display) display.textContent = '€' + val.toLocaleString('es-ES');

  if (val === 0) {
    setEl('fp-10y-final', '—');
    setEl('fp-20y-final', '—');
    setEl('fp-30y-final', '—');
    return;
  }

  const p10 = Math.round(calcCompound(0, val, 8, 10));
  const p20 = Math.round(calcCompound(0, val, 8, 20));
  const p30 = Math.round(calcCompound(0, val, 8, 30));
  setEl('fp-10y-final', fmtPrice(p10));
  setEl('fp-20y-final', fmtPrice(p20));
  setEl('fp-30y-final', fmtPrice(p30));

  // Insight contextual según importe
  let insight = '';
  if (val < 50)       insight = '🌱 Pequeño pero poderoso. La constancia gana a la cantidad.';
  else if (val < 200) insight = '📈 Con esto ya superas a la mayoría de ahorradores en España.';
  else if (val < 500) insight = '🔥 Excelente base. Estás en el top 20% de inversores habituales.';
  else if (val < 1000)insight = '🚀 Con esta aportación alcanzas la libertad financiera antes de los 55.';
  else                insight = '👑 Nivel élite. Alcanzarás la independencia financiera mucho antes.';
  // ob-mp-insight: elemento eliminado del onboarding

  // Pre-configurar S.monthlyContribution en tiempo real para que el paso 3 use el valor
  S.monthlyContribution = val;
}

/**
 * _ob_getSuggestedModule — Devuelve el id del módulo más relevante
 * según el objetivo financiero y el nivel del usuario.
 */
function _ob_getSuggestedModule() {
  const goal  = S.goal  || 'freedom';
  const level = S.investorLevel || 'zero';
  const map = {
    freedom:   { zero: 0, saving: 0, investing: 1, active: 4 },
    debt:      { zero: 2, saving: 2, investing: 2, active: 2 },
    house:     { zero: 5, saving: 5, investing: 3, active: 4 },
    retire:    { zero: 0, saving: 1, investing: 4, active: 4 },
    invest:    { zero: 0, saving: 0, investing: 1, active: 4 },
    emergency: { zero: 5, saving: 5, investing: 5, active: 3 },
  };
  return (map[goal] || map.freedom)[level] ?? 0;
}

function _ob_getSuggestedBranch() {
  const goal  = S.goal  || 'freedom';
  const level = S.investorLevel || 'zero';
  const map = {
    freedom:   { zero: 'fundamentos', saving: 'fundamentos', investing: 'inversion',  active: 'avanzado'    },
    debt:      { zero: 'deuda',       saving: 'deuda',       investing: 'deuda',       active: 'deuda'        },
    house:     { zero: 'fundamentos', saving: 'vivienda',    investing: 'vivienda',    active: 'inversion'    },
    retire:    { zero: 'fundamentos', saving: 'fundamentos', investing: 'inversion',   active: 'avanzado'     },
    invest:    { zero: 'fundamentos', saving: 'inversion',   investing: 'inversion',   active: 'avanzado'     },
    emergency: { zero: 'fundamentos', saving: 'fundamentos', investing: 'inversion',   active: 'inversion'    },
  };
  return (map[goal] || map.freedom)[level] || 'fundamentos';
}

/**
 * _ob_buildHeroMsg — Construye el mensaje personalizado para el hero card.
 * Calcula cuánto necesitas al mes y en cuántos años para tu objetivo.
 */
function _ob_buildHeroMsg() {
  const goal    = S.goal  || 'freedom';
  const level   = S.investorLevel || 'zero';
  const monthly = S.monthlyContribution || 200;
  const name    = S.userName || 'tú';

  const goalLabels = {
    freedom:   'libertad financiera',
    debt:      'eliminar tus deudas',
    house:     'comprar tu vivienda',
    retire:    'tu jubilación ideal',
    invest:    'construir cartera',
    emergency: 'tu fondo de emergencia',
  };
  const goalLabel = goalLabels[goal] || goalLabels.freedom;

  if (goal === 'debt') {
    const debt = S.patrimony < 0 ? Math.abs(S.patrimony) : 5000;
    const months = monthly > 0 ? Math.ceil(debt / monthly) : 0;
    const yrs = months > 0 ? Math.round(months / 12 * 10) / 10 : '?';
    return `💪 Con ${fmtPrice(monthly)}/mes puedes eliminar tus deudas en ~${yrs} años. Empieza por el módulo de Deuda Inteligente.`;
  }
  if (goal === 'emergency') {
    const target = (S.income || 1800) * 3;
    const months = monthly > 0 ? Math.ceil(target / monthly) : 0;
    return `🛡️ Con ${fmtPrice(monthly)}/mes tendrás tu fondo de emergencia de ${fmtPrice(target)} en ~${months} meses.`;
  }
  if (goal === 'house') {
    const target = 40000; // entrada típica en España
    const months = monthly > 0 ? Math.ceil(target / monthly) : 0;
    const yrs = Math.round(months / 12 * 10) / 10;
    return `🏠 Para ${fmtPrice(target)} de entrada necesitas ${fmtPrice(monthly)}/mes durante ~${yrs} años. ¡Vas bien!`;
  }

  // FIRE para freedom / retire / invest
  const fireTarget = (S.income || 1800) * 12 * 25; // regla del 4%
  const r = 0.08 / 12;
  let yearsToFire = 0;
  if (monthly > 0) {
    // Meses hasta alcanzar fireTarget con aportación mensual al 8%
    const months = Math.log(1 + (fireTarget * r) / monthly) / Math.log(1 + r);
    yearsToFire = Math.round(months / 12);
  }
  const levelTips = {
    zero:      'Empieza por el módulo de Interés Compuesto — cambia todo.',
    saving:    'El siguiente paso es poner tu ahorro a trabajar en ETFs.',
    investing: 'Optimiza tu cartera con diversificación inteligente.',
    active:    'Descubre estrategias avanzadas para acelerar tu FIRE.',
  };
  const tip = levelTips[level] || levelTips.zero;
  if (yearsToFire > 0 && yearsToFire < 100) {
    return `🏝️ Para tu ${goalLabel} con ${fmtPrice(monthly)}/mes llegarás en ~${yearsToFire} años. ${tip}`;
  }
  return `🏝️ Cada mes que inviertes acerca tu ${goalLabel}. ${tip}`;
}

function obNext(step) {
  // Guardar nombre si venimos del paso 2
  const inp = document.getElementById('ob-name-input');
  if (inp && inp.value.trim()) S.userName = inp.value.trim();

  document.querySelectorAll('.ob-step').forEach(s => s.classList.remove('active'));

  const next = document.getElementById('ob-s' + step);
  if (next) next.classList.add('active');

  if (step === 3) {
    if (typeof _obQuizInit === 'function') _obQuizInit();
  } else if (step === 4) {
    _renderProjectionStepFinal();
    if (typeof _ob_renderProfessions === 'function') _ob_renderProfessions();
  } else if (step === 5) {
    // Paso final: hora de recordatorio
  }
}

function _obSelectTime(hour) {
  document.querySelectorAll('.ob-time-btn').forEach(b => b.classList.remove('selected'));
  if (event && event.target) event.target.classList.add('selected');
  S._reminderHour = hour;
  saveState();
}
window._obSelectTime = _obSelectTime;

function _ob_initNumericInputs() {
  if (typeof makeNumericControl !== 'function') return;
  makeNumericControl({ inputId:'ob-savings',    min:0,  max:500000, suffix:'€', onChange: _renderProjectionStepFinal });
  makeNumericControl({ inputId:'ob-income',     min:0,  max:30000,  suffix:'€', onChange: _renderProjectionStepFinal });
  makeNumericControl({ inputId:'ob-debt-total', min:0,  max:500000, suffix:'€', onChange: _renderProjectionStepFinal });
  makeNumericControl({ inputId:'ob-age',        min:16, max:80,     suffix:'',  step:1,   onChange: _renderProjectionStepFinal });
}

function _renderProjectionStepFinal() {
  const savings  = parseFloat(document.getElementById('ob-savings')?.value)       || 0;
  const monthly  = parseFloat(document.getElementById('ob-monthly-slider')?.value) || Math.round((parseFloat(document.getElementById('ob-income')?.value)||1800) * 0.15);
  const rate     = 7;
  const debt     = parseFloat(document.getElementById('ob-debt-total')?.value)      || 0;
  const income   = parseFloat(document.getElementById('ob-income')?.value)          || 0;

  // Mostrar carrera asignada automáticamente
  const autoCareerEl = document.getElementById('ob-career-auto');
  if (autoCareerEl && income > 0) {
    const careerId = income < 900 ? 'intern' : income < 1600 ? 'junior' : income < 2500 ? 'specialist' : income < 4000 ? 'senior' : income < 8000 ? 'director' : 'entrepreneur';
    const careerData = { intern:{icon:'🎓',label:'Becario'}, junior:{icon:'🌱',label:'Junior / Empleado'}, specialist:{icon:'🔧',label:'Especialista'}, senior:{icon:'💼',label:'Senior / Manager'}, director:{icon:'🏛️',label:'Director / VP'}, entrepreneur:{icon:'🚀',label:'Emprendedor'} };
    const cd = careerData[careerId] || careerData.junior;
    document.getElementById('ob-career-icon').textContent = cd.icon;
    document.getElementById('ob-career-label').textContent = cd.label;
    document.getElementById('ob-career-salary').textContent = `€${income.toLocaleString('es')}/mes según tus ingresos`;
    autoCareerEl.style.display = 'block';
  }

  const patrimony = Math.max(0, savings - debt);
  const result10  = calcCompound(patrimony, monthly, rate, 10);
  const result20  = calcCompound(patrimony, monthly, rate, 20);
  const result30  = calcCompound(patrimony, monthly, rate, 30);

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = fmtPrice(val); };
  set('fp-today-final', patrimony);
  set('fp-10y-final',   result10);
  set('fp-20y-final',   result20);

  // 30y number: count-up for wow effect
  const el30 = document.getElementById('fp-30y-final');
  if (el30) {
    const target = Math.round(result30);
    const start  = parseInt(el30.dataset.prev || '0', 10);
    el30.dataset.prev = target;
    let frame = 0;
    const frames = 40;
    const tick = () => {
      frame++;
      const pct = frame / frames;
      const eased = 1 - Math.pow(1 - pct, 3);
      el30.textContent = fmtPrice(Math.round(start + (target - start) * eased));
      if (frame < frames) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // Motivational context line below projection
  const motivEl = document.getElementById('ob-proj-motivation');
  if (motivEl && result30 > 0) {
    const monthly = parseFloat(document.getElementById('ob-monthly-slider')?.value) || Math.round((income || 1800) * 0.15);
    motivEl.textContent = `Ahorrando solo ${fmtPrice(monthly)}/mes, el interés compuesto hace el resto. Eso es libertad financiera.`;
    motivEl.style.display = 'block';
  }
}

/**
 * _renderProjectionStep — Calcula y muestra la proyección del paso 3.
 * Ahora usa el valor del slider de aportación mensual si está disponible.
 */
function _renderProjectionStep() {
  const monthly = S.monthlyContribution || 200;
  const result  = calcCompound(0, monthly, 8, 30);
  const projEl  = document.getElementById('ob-proj-amount');
  if (projEl) projEl.textContent = fmtPrice(result);

  // Actualizar el subtítulo con la aportación real elegida
  const sub = document.getElementById('ob-s3-sub');
  if (sub && monthly > 0) {
    sub.innerHTML = `Si inviertes <strong style="color:var(--accent)">${fmtPrice(monthly)}/mes</strong> y mantienes el hábito de aprender…`;
  }
}

/**
 * _updateFinPreviewOnboarding — Actualiza la preview financiera en tiempo real.
 * Llamada cuando el usuario mueve los sliders del paso 4.
 * Lee los inputs y recalcula las proyecciones a 10, 20 y 30 años.
 */
function _updateFinPreviewOnboarding() {
  const savings   = parseFloat(document.getElementById('ob-savings')?.value)    || 0;
  const monthly   = parseFloat(document.getElementById('ob-monthly')?.value)    || 200;
  const ret       = parseFloat(document.getElementById('ob-return')?.value)     || 7;
  const income    = parseFloat(document.getElementById('ob-income')?.value)     || 0;
  const debtTotal = parseFloat(document.getElementById('ob-debt-total')?.value) || 0;
  const age       = parseFloat(document.getElementById('ob-age')?.value)        || 30;

  const netWorth = savings - debtTotal;
  setEl('fp-today-final', fmtPrice(netWorth));
  setEl('fp-10y-final',   fmtPrice(calcCompound(Math.max(0, netWorth), monthly, ret, 10)));
  setEl('fp-20y-final',   fmtPrice(calcCompound(Math.max(0, netWorth), monthly, ret, 20)));
  setEl('fp-30y-final',   fmtPrice(calcCompound(Math.max(0, netWorth), monthly, ret, 30)));

  // ── Live health score ────────────────────────────────────────
  let score = 0;
  // Emergency fund: savings >= 3 months expenses (estimated as 30% of income)
  const monthlyExpenses = income ? income * 0.7 : 1500;
  const emergencyTarget = monthlyExpenses * 3;
  score += Math.min(25, (savings / Math.max(emergencyTarget, 1)) * 25);
  // Savings rate: monthly / income
  if (income > 0) score += Math.min(25, (monthly / income) * 100);
  // Debt ratio: lower is better
  if (income > 0) score += Math.max(0, 25 - (debtTotal / (income * 12)) * 25);
  else score += debtTotal === 0 ? 25 : 10;
  // Age factor: younger = more time = bonus
  score += Math.min(25, Math.max(0, (65 - age) / 40 * 25));
  score = Math.round(Math.min(100, Math.max(0, score)));

  const scoreEl = document.getElementById('fp-health-score');
  if (scoreEl) {
    scoreEl.textContent = score + '%';
    scoreEl.style.color = score >= 70 ? 'var(--accent)' : score >= 40 ? '#f59e0b' : 'var(--danger)';
  }

  // ── Personalized insight ─────────────────────────────────────
  const insightEl = document.getElementById('fp-insight');
  if (insightEl) {
    let insight = '';
    if (debtTotal > savings * 2 && debtTotal > 0)
      insight = '💡 Con deudas altas, tu prioridad es el módulo de Deuda Inteligente primero.';
    else if (income > 0 && monthly / income < 0.1)
      insight = '💡 Ahorras menos del 10% de tus ingresos. ¡Pequeños ajustes hacen grandes diferencias!';
    else if (age < 30)
      insight = '🚀 Empezar joven es tu mayor ventaja. El tiempo multiplica cada euro que inviertes.';
    else if (age > 50)
      insight = '⏰ Cada mes cuenta. Maximizar el ahorro ahora marca la diferencia para tu retiro.';
    else if (score >= 70)
      insight = '🌟 Tu situación financiera es sólida. Vamos a optimizarla con educación.';
    else
      insight = '💪 Desde aquí solo se sube. FinLearn te dará el mapa exacto para mejorar.';
    insightEl.textContent = insight;
  }
}


/* ══════════════════════════════════════════════════════════════════
   FINALIZAR ONBOARDING
══════════════════════════════════════════════════════════════════ */

/**
 * finishOnboarding — Completa el onboarding y lanza la app.
 * ─────────────────────────────────────────────────────────────────
 * 1. Lee los datos financieros introducidos en el paso 4
 * 2. Guarda todo en S y persiste
 * 3. Navega al home con celebración (confeti + toast)
 * 4. Muestra el modal de registro 3s después (growth loop)
 */

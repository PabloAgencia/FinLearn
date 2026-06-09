const AI_COACH = (() => {
  let _lastAdviceTime = 0;
  const COOLDOWN_MS   = 120_000; // 2 min entre consejos proactivos

  // ─── API key desde localStorage (nunca en el código) ──────────
  function _getApiKey()      { return localStorage.getItem('finai_api_key') || ''; }
  function _getApiProvider() { return localStorage.getItem('finai_api_provider') || 'anthropic'; }

  /* ── fetchFinAIResponse ─────────────────────────────────────
     Llama a la API con contexto real del jugador.
     Soporta: anthropic (Claude) | deepseek | openai
     Si falla devuelve respuesta estática: el juego NUNCA se rompe.
  ─────────────────────────────────────────────────────────────*/
  async function fetchFinAIResponse(userQuestion, staticFallback) {
    const FINAI_API_KEY      = _getApiKey();
    const FINAI_API_PROVIDER = _getApiProvider();

    // Si no hay key propia pero es premium, usar endpoint propio
    // Usuario gratis: retorna fallback inmediato sin error
    if (!FINAI_API_KEY && !isPremium()) return staticFallback;
    if (!FINAI_API_KEY && isPremium()) {
      try {
        if (!navigator.onLine) return '📵 Sin conexión. El FinAI Coach no está disponible offline.';
        const context = 'Nombre: ' + (S.userName||'Explorador')
          + ' | Nivel: ' + (S.level||1)
          + ' | XP: ' + (S.xp||0)
          + ' | Racha: ' + (S.streak||0) + 'd'
          + ' | Módulos: ' + (S.completedMods||[]).length
          + ' | Cash: €' + Math.round(S.cash||0)
          + ' | Patrimonio: €' + Math.round(S.patrimony||0)
          + ' | Carrera: ' + (S.career||'junior');
        const res = await fetch('/api/coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: userQuestion, context }),
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        if (data.text) {
          _coachHistory.push({ q: userQuestion.slice(0,120), a: data.text });
          if (_coachHistory.length > 6) _coachHistory.shift();
          return data.text;
        }
      } catch(e) {
        if (!navigator.onLine) return '📵 Sin conexión. Vuelve cuando tengas internet.';
        return '⚠️ El coach está sobrecargado ahora mismo. Inténtalo en 30 segundos.';
      }
    }

    if (!FINAI_API_KEY) return staticFallback;

    // Construir contexto financiero del jugador
    const totalDebt  = (S.debts||[]).reduce((a,d)=>a+(d.balance||0),0);
    const bizIncome  = Math.round((S.yearBizIncome||0)/12);
    const holdings   = Object.keys(S.portfolio||{}).filter(k=>S.portfolio[k]>0).join(', ') || 'ninguna';
    const gameYear   = S.gameYear || 1;

    // ── Contexto enriquecido del jugador ─────────────────────
    const healthScore    = typeof calcHealthScore === 'function' ? calcHealthScore() : 0;
    const savingsRate    = (S.lifeSalary||0) > 0 ? Math.round(((S.monthlyContribution||0)/(S.lifeSalary||1))*100) : 0;
    const fireNumber     = Math.round((S.lifeSalary||1800)*0.6*12*25);
    const firePct        = fireNumber > 0 ? Math.round((S.patrimony||0)/fireNumber*100) : 0;
    const portfolioBreakdown = Object.entries(S.portfolio||{})
      .filter(function(e){ return e[1].shares > 0; })
      .map(function(e){ var tk=e[0],p=e[1]; var price=(GAME.stockPrices&&GAME.stockPrices[tk])||(typeof STOCKS!=='undefined'&&STOCKS.find(function(s){return s.ticker===tk;})?.price)||0; return tk+':'+p.shares+'acc(€'+Math.round(price*p.shares)+')'; })
      .join(', ') || 'ninguna';
    const bizDetails = Object.entries(S.businesses||{})
      .map(function(e){ var b=typeof BUSINESSES!=='undefined'&&BUSINESSES.find(function(x){return x.id===e[0];}); return b?b.name:e[0]; })
      .join(', ') || 'ninguno';
    const missionsDone   = Array.isArray(S._mw_missions) ? S._mw_missions.filter(function(m){return m.done;}).length : 0;
    const achievCount    = typeof ACHIEVEMENTS !== 'undefined' ? ACHIEVEMENTS.filter(function(a){return a.earned;}).length : 0;
    const patrimonyTrend = (function(){
      var pd = S.patrimonyDaily || [];
      if (pd.length < 5) return 'insuficientes datos';
      var last5 = pd.slice(-5).map(function(p){return p.value;});
      var delta = last5[last5.length-1] - last5[0];
      return (delta >= 0 ? '+' : '') + Math.round(delta).toLocaleString('es') + '€ últimos 5 días';
    })();
    const conversationCtx = _coachHistory.length > 0
      ? '\nCONVERSACIÓN PREVIA (contexto):\n' + _coachHistory.slice(-3).map(function(h){return 'P:'+h.q+'\nR:'+h.a.slice(0,100);}).join('\n')
      : '';

    const systemPrompt = 'Eres FinAI, el coach financiero personal de ' + (S.userName||'este jugador') + ' en FinLearn.'
      + '\nRespondes SIEMPRE en español, de forma directa y concisa (2-3 frases máximo).'
      + '\nUsas los números EXACTOS del jugador. Nunca das disclaimers legales. Eres directo, útil, motivador.'
      + '\nSi el usuario hace pregunta de seguimiento, tienes en cuenta la conversación previa.'
      + '\n\nESTADO DEL JUGADOR:'
      + '\nNombre: ' + (S.userName||'Explorador') + ' | Edad: ' + (S.lifeAge||25) + 'a | Año juego: ' + gameYear
      + '\nPatrimonio: €' + Math.round(S.patrimony||0).toLocaleString('es') + ' | Cash: €' + Math.round(S.cash||0).toLocaleString('es') + ' | Invertido: €' + Math.round(S.invested||0).toLocaleString('es')
      + '\nSalario/mes: €' + Math.round(S.lifeSalary||0).toLocaleString('es') + ' | Tasa ahorro: ' + savingsRate + '% | Deuda: €' + Math.round(totalDebt).toLocaleString('es')
      + '\nCartera: ' + portfolioBreakdown
      + '\nNegocios: ' + bizDetails + ' | Ingresos biz/mes: €' + bizIncome.toLocaleString('es')
      + '\nSalud financiera: ' + healthScore + '/100 | Racha: ' + (S.streak||0) + 'd | XP: ' + (S.xp||0)
      + '\nMódulos: ' + (S.completedMods||[]).length + ' | Misiones: ' + missionsDone + ' | Logros: ' + achievCount
      + '\nFIRE: ' + firePct + '% de €' + fireNumber.toLocaleString('es')
      + '\nTendencia patrimonio: ' + patrimonyTrend
      + (typeof _activeScenario !== 'undefined' && _activeScenario ? '\nESCENARIO: "' + _activeScenario.name + '"' : '')
      + conversationCtx;

    // P8-A: Sin conexión → mensaje amigable
    if (!navigator.onLine) return '📵 Sin conexión. El FinAI Coach no está disponible offline, pero el resto de FinLearn sí funciona. ¡Vuelve cuando tengas conexión!';

    const endpoints = {
      anthropic: { url: 'https://api.anthropic.com/v1/messages', model: 'claude-sonnet-4-20250514' },
      deepseek:  { url: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat' },
      openai:    { url: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' },
    };
    const ep = endpoints[FINAI_API_PROVIDER] || endpoints.anthropic;

    try {
      let res;
      if (FINAI_API_PROVIDER === 'anthropic') {
        res = await fetch(ep.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': FINAI_API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: ep.model,
            max_tokens: 200,
            system: systemPrompt,
            messages: [{ role: 'user', content: userQuestion }],
          }),
          signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const text = data.content?.[0]?.text?.trim();
        if (!text) throw new Error('empty response');
        _coachHistory.push({ q: userQuestion.slice(0,120), a: text });
        if (_coachHistory.length > 6) _coachHistory.shift();
        return text;
      } else {
        res = await fetch(ep.url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${FINAI_API_KEY}` },
          body: JSON.stringify({
            model: ep.model,
            max_tokens: 180,
            temperature: 0.7,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user',   content: userQuestion },
            ],
          }),
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (!text) throw new Error('empty response');
        _coachHistory.push({ q: userQuestion.slice(0,120), a: text });
        if (_coachHistory.length > 6) _coachHistory.shift();
        return text;
      }
    } catch (err) {
      console.warn('[FinAI] API error, using fallback:', err.message);
      return staticFallback;
    }
  }

  /* ── Motor de análisis financiero inteligente — 60+ reglas ─────────
     Sin API key. Analiza S en tiempo real y genera consejos personalizados.
  ─────────────────────────────────────────────────────────────────── */
  function _analyze() {
    const patrimony   = S.patrimony   || 0;
    const cash        = S.cash        || 0;
    const invested    = S.invested    || 0;
    const salary      = S.lifeSalary  || calcMonthlySalary?.() || 0;
    const totalDebt   = (S.debts||[]).reduce((a,d)=>a+(d.balance||0),0);
    const highDebt    = (S.debts||[]).filter(d=>(d.rate||0)>=15);
    const mortgage    = (S.mortgages||[]).filter(m=>!m.paid);
    const savingsRate = salary > 0 ? Math.round((S.monthlyContribution||0)/salary*100) : 0;
    const cashPct     = patrimony > 0 ? Math.round(cash/patrimony*100) : 100;
    const career      = getCurrentCareer?.() || { id:'junior' };
    const mods        = (S.completedMods||[]).length;
    const gameYear    = S.gameYear || 1;
    const fireNumber  = salary > 0 ? salary * 0.6 * 12 * 25 : 1;
    const firePct     = fireNumber > 0 ? Math.round(patrimony/fireNumber*100) : 0;
    const inflLoss    = Math.round(cash * 0.035 / 12);
    const divIncome   = Math.round((S.totalDividends||0) / Math.max(1, gameYear));
    const holdings    = Object.keys(S.portfolio||{}).filter(k=>(S.portfolio[k].shares||0)>0);
    const streak      = S.streak || 0;
    const bizIncome   = Math.round((S.yearBizIncome||0)/12);
    const debtVsInv   = totalDebt > 0 && invested > 0;
    const tips = [];

    // 1. Cash excesivo
    if (cashPct > 50 && cash > 2000)
      tips.push(`Tienes el ${cashPct}% de tu patrimonio en cash (€${cash.toLocaleString('es')}). La inflación te roba €${inflLoss}/mes. Invierte al menos el 30% en un ETF indexado.`);
    if (cash > 10000 && invested < 1000)
      tips.push(`€${cash.toLocaleString('es')} parados mientras el mercado lleva décadas dando ~10% anual. Cada mes que esperas es rentabilidad perdida para siempre.`);

    // 2. Deuda de alto interés
    if (highDebt.length > 0 && debtVsInv) {
      const worstDebt = [...highDebt].sort((a,b)=>b.rate-a.rate)[0];
      tips.push(`Tienes deuda al ${worstDebt.rate}% TAE (€${Math.round(worstDebt.balance).toLocaleString('es')}) e inversión simultánea = pérdida matemática. Pagar esa deuda da un ${worstDebt.rate}% garantizado.`);
    }
    if (highDebt.length > 0) {
      const totalHigh  = highDebt.reduce((a,d)=>a+(d.balance||0),0);
      const monthlyInt = highDebt.reduce((a,d)=>a+(d.balance*d.rate/100/12),0);
      tips.push(`Tus deudas de alto interés te cuestan €${Math.round(monthlyInt)}/mes en intereses. €${Math.round(totalHigh).toLocaleString('es')} a liquidar antes de invertir más.`);
    }

    // 3. Tasa de ahorro baja
    if (salary > 0 && savingsRate < 10 && savingsRate >= 0)
      tips.push(`Ahorras solo el ${savingsRate}% de tu sueldo. La regla mínima es 20%. Con €${salary.toLocaleString('es')}/mes deberías apartar €${Math.round(salary*0.2).toLocaleString('es')} automáticamente el día de cobro.`);
    if (salary > 0 && savingsRate >= 40)
      tips.push(`Tasa de ahorro del ${savingsRate}%. Top 5% mundial. Sigue así y el interés compuesto hará el trabajo pesado.`);
    if (salary > 0 && savingsRate >= 20 && savingsRate < 30)
      tips.push(`Tasa del ${savingsRate}%: bien por encima del mínimo. Llegar al 30% adelantaría tu independencia financiera varios años.`);

    // 4. Fondo de emergencia
    const monthlyExpenses = Math.round(salary * 0.5 + (career.lifestyleExtra||0));
    if (cash < monthlyExpenses * 3 && salary > 0)
      tips.push(`Tienes €${cash.toLocaleString('es')} pero necesitas al menos €${(monthlyExpenses*3).toLocaleString('es')} (3 meses de gastos) antes de invertir agresivamente.`);
    if (cash >= monthlyExpenses * 6 && cashPct < 30)
      tips.push(`Fondo de emergencia sólido (${Math.round(cash/monthlyExpenses)} meses). El excedente sobre 6 meses debería estar invertido generando rentabilidad.`);

    // 5. Hipoteca vs inversión
    if (mortgage.length > 0 && invested > 5000) {
      const r = mortgage[0].rate || 3.2;
      tips.push(r < 3.5
        ? `Hipoteca al ${r}% con inversión en bolsa: matemáticamente mejor invertir (bolsa ~10% histórico vs ${r}% hipoteca).`
        : `Hipoteca al ${r}%: en el umbral. Amortizar extra ahora tiene una rentabilidad garantizada del ${r}%.`);
    }

    // 6. Diversificación
    if (holdings.length === 1 && invested > 5000)
      tips.push(`Toda la cartera en ${holdings[0]}. Un ETF MSCI World te da 1.500 empresas de golpe con la misma inversión.`);
    if (holdings.length === 0 && cash > 3000)
      tips.push(`€${cash.toLocaleString('es')} en cuenta y cero en bolsa. El S&P 500 lleva 35 años dando un 10,7% anual. ¿Cuánto más esperas?`);
    if (holdings.length >= 6)
      tips.push(`${holdings.length} activos — buena diversificación. Cada posición debería tener una tesis clara.`);

    // 7. FIRE
    if (firePct >= 100)
      tips.push(`🔥 Tu patrimonio supera tu número FIRE. La regla del 4% te da €${Math.round(patrimony*0.04/12).toLocaleString('es')}/mes de por vida.`);
    else if (firePct >= 75)
      tips.push(`${firePct}% del FIRE alcanzado. Recta final. Cada aportación ahora tiene más impacto por el compuesto acumulado.`);
    else if (firePct >= 50)
      tips.push(`Al ${firePct}% del FIRE. La segunda mitad se construye más rápido — el compuesto ya trabaja.`);
    else if (firePct >= 25)
      tips.push(`${firePct}% hacia el FIRE. Con €${(S.monthlyContribution||0).toLocaleString('es')}/mes el compuesto empieza a ser tu mejor empleado.`);

    // 8. Dividendos
    if (divIncome > 0 && salary > 0 && divIncome < salary * 0.1)
      tips.push(`Cobras ~€${divIncome.toLocaleString('es')}/año en dividendos — el ${Math.round(divIncome/12/Math.max(1,salary)*100)}% de tu sueldo como ingreso pasivo.`);
    if (salary > 0 && divIncome >= salary * 0.5)
      tips.push(`🎯 Dividendos de €${divIncome.toLocaleString('es')}/año: cubren el ${Math.round(divIncome/12/Math.max(1,salary)*100)}% de tu sueldo. Libertad real en construcción.`);

    // 9. Carrera
    if (career.id === 'intern' && gameYear >= 2)
      tips.push(`${gameYear} años de becario. El salto a Junior cambia tus posibilidades de ahorro significativamente.`);
    if (career.id === 'senior' && (career.lifestyleExtra||0) > 0 && savingsRate < 25)
      tips.push(`Lifestyle creep detectado: €${career.lifestyleExtra}/mes de gasto estructural extra. Con tu sueldo, el 25% de ahorro es el mínimo razonable.`);
    if (career.id === 'entrepreneur' && bizIncome < 1000)
      tips.push(`Emprendedor con €${bizIncome}/mes de negocios. Zona peligrosa — necesitas 12 meses de gastos en reserva.`);

    // 10. Educación
    if (mods < 5 && gameYear >= 2)
      tips.push(`${mods} módulos en ${gameYear} años de juego. El conocimiento financiero es el activo más seguro.`);
    if (mods >= 20 && mods < 50)
      tips.push(`${mods} módulos — superas al 85% en educación financiera. Ahora aplícalo.`);
    if (mods >= 50)
      tips.push(`${mods} módulos. Nivel experto. ¿Cómo refleja tu cartera real lo que has aprendido?`);

    // 11. Negocios
    const bizCount = Object.keys(S.businesses||{}).length;
    if (bizCount === 0 && salary > 2000 && cash > 5000)
      tips.push(`€${cash.toLocaleString('es')} en cash y €${salary.toLocaleString('es')}/mes: tienes base para lanzar un negocio con ingresos sin techo.`);
    if (bizCount >= 2 && salary > 0 && bizIncome > salary)
      tips.push(`Tus negocios (€${bizIncome.toLocaleString('es')}/mes) ya superan tu sueldo. El active income deja de ser el centro.`);

    // 12. Racha
    if (streak >= 30 && mods >= 10)
      tips.push(`${streak} días de racha y ${mods} módulos: la consistencia bate al talento en finanzas.`);
    if (streak === 0 && mods > 0)
      tips.push(`La racha se ha roto. Los hábitos financieros funcionan igual que el interés compuesto: la consistencia es todo. Hoy es el día.`);

    // 13. Crypto concentración
    const cryptoH = holdings.filter(t => ['BTC','ETH'].includes(t));
    if (cryptoH.length > 0 && invested > 0) {
      const cryptoVal = cryptoH.reduce((s,t) => {
        const q = (S.portfolio[t]?.shares||0);
        const p = (GAME.stockPrices&&GAME.stockPrices[t]) || (STOCKS?.find(x=>x.ticker===t)?.price||0);
        return s + q*p;
      }, 0);
      const cryptoPct = Math.round(cryptoVal/invested*100);
      if (cryptoPct > 20)
        tips.push(`${cryptoPct}% de la cartera en cripto — encima del 10% recomendado. Un -80% (histórico BTC) sería €${Math.round(cryptoVal*0.8).toLocaleString('es')} de pérdida.`);
    }

    // 14. Situación óptima
    if (tips.length === 0)
      tips.push(`Situación sólida: €${patrimony.toLocaleString('es')} de patrimonio, ahorro del ${savingsRate}%, ${mods} módulos completados. Mantén el rumbo.`);

    return tips;
  }

  function _showBubble(text) {
    if (localStorage.getItem('finai_quiet') === '1') return;
    let bubble = document.getElementById('coach-bubble');
    if (!bubble) {
      bubble = document.createElement('div');
      bubble.id        = 'coach-bubble';
      bubble.className = 'coach-bubble';
      document.body.appendChild(bubble);
    }
    bubble.innerHTML = `
      <div class="coach-avatar">🤖</div>
      <div class="coach-content">
        <div class="coach-label">FinAI</div>
        <div class="coach-text" id="coach-text"></div>
        <div style="display:flex;gap:6px;margin-top:6px;align-items:center;">
          <button class="coach-ask-btn" onclick="AI_COACH.askQuestion()">Preguntar →</button>
          <button class="coach-close" onclick="document.getElementById('coach-bubble').classList.remove('coach-visible')" style="background:none;border:none;color:rgba(255,255,255,.3);cursor:pointer;font-size:13px;padding:2px 4px;">✕</button>
          <button onclick="localStorage.setItem('finai_quiet','1');document.getElementById('coach-bubble').classList.remove('coach-visible')" style="background:none;border:none;color:rgba(255,255,255,.2);cursor:pointer;font-size:11px;padding:2px 4px;" title="No volver a mostrar">🔕</button>
        </div>
      </div>`;
    bubble.classList.add('coach-visible');

    // Typewriter effect
    const el = document.getElementById('coach-text');
    let i = 0;
    el.textContent = '';
    const iv = setInterval(() => {
      if (i < text.length) { el.textContent += text[i++]; }
      else clearInterval(iv);
    }, 18);

    // Auto-hide after 14s
    setTimeout(() => bubble?.classList.remove('coach-visible'), 14000);
  }

  function proactiveCheck() {
    const now = Date.now();
    if (now - _lastAdviceTime < COOLDOWN_MS) return;
    if (!S.userName) return;
    _lastAdviceTime = now;
    const tips = _prioritizeTips(_analyze());
    const situation = _detectSituation();
    let tip;
    if (situation === 'thriving')
      tip = tips.find(t=>t.includes('FIRE')||t.includes('dividendo')||t.includes('módulo')) || tips[0];
    else if (situation === 'struggling')
      tip = tips.find(t=>t.includes('deuda')||t.includes('emergencia')||t.includes('cash')||t.includes('interés')) || tips[0];
    else
      tip = tips[0];
    setTimeout(() => _showBubble(tip), 1800);
  }

  // ── 30 preguntas reales con respuestas dinámicas ─────────────
  const ALL_QUESTIONS = [
    { q:'¿Debería amortizar hipoteca o invertir?', fn:()=>{
      const m=(S.mortgages||[]).find(x=>!x.paid);
      if(!m) return '🏠 Sin hipoteca activa. Invierte el máximo en renta variable — el tiempo en el mercado vence al timing perfectamente.';
      const r=m.rate||3.2;
      const alt=[
        r<3.5?`Tu hipoteca está al ${r}%. La bolsa da ~10% histórico. Matemáticamente, invertir gana. Pero la paz mental de no deber también tiene valor.`
             :`Con hipoteca al ${r}% amortizar renta casi lo mismo que la bolsa, sin riesgo. Considera 50/50.`,
        r<3.5?`Un ${r}% de interés hipotecario es dinero barato. Cada euro que inviertes en lugar de amortizar genera ~6% más de retorno esperado a largo plazo.`
             :`Hipoteca al ${r}%: en el límite del break-even vs bolsa. Si te queda mucho plazo, amortiza para reducir exposición al riesgo de tipos.`,
      ];
      return alt[Math.floor(Math.random()*alt.length)];
    }},
    { q:'¿Estoy ahorrando suficiente?', fn:()=>{
      const sal=S.lifeSalary||1800; const sr=Math.round((S.monthlyContribution||0)/sal*100);
      const alts=[
        sr>=20?`✅ ${sr}% de tasa de ahorro. Estás en el top 20% de ahorradores. Con €${(S.monthlyContribution||0).toLocaleString('es')}/mes y 30 años de interés compuesto, el resultado es contundente.`
              :`❌ Solo el ${sr}%. Necesitas al menos 20% (€${Math.round(sal*.2).toLocaleString('es')}/mes). Automatízalo el día de cobro — lo que no ves, no lo gastas.`,
        sr>=20?`Tasa del ${sr}% — excelente. La regla dice 20%, tú superas eso. Cada punto porcentual adicional reduce años de trabajo activo significativamente.`
              :`${sr}% de ahorro cuando el mínimo es 20%. Tienes una brecha de €${Math.round(sal*.2-(S.monthlyContribution||0)).toLocaleString('es')}/mes. Revisa qué suscripciones o gastos puedes eliminar.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo llego antes al FIRE?', fn:()=>{
      const sal=S.lifeSalary||1800; const fire=sal*.6*12*25;
      const diff=Math.max(0,fire-(S.patrimony||0));
      const pct=Math.round((S.patrimony||0)/fire*100);
      const alts=[
        `Tu FIRE number es €${Math.round(fire).toLocaleString('es')}. Vas por el ${pct}%. Los tres aceleradores: ganar más, gastar menos, invertir antes. Cada €100/mes extra equivale a ~2 años menos de trabajo.`,
        `Con €${Math.round(diff).toLocaleString('es')} por delante para el FIRE, el tiempo es tu palanca más potente. Aumentar la tasa de ahorro un 5% reduce el plazo más que doblar el sueldo manteniendo el mismo estilo de vida.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué hago con mi deuda?', fn:()=>{
      const ds=S.debts||[];
      if(!ds.length){
        const alts=['Sin deudas. Toda tu capacidad de ahorro puede ir directamente a inversión. Esa es una ventaja enorme — mantenla.','Limpio de deudas. El siguiente paso: construir el fondo de emergencia si no lo tienes y luego invertir sistemáticamente.'];
        return alts[Math.floor(Math.random()*alts.length)];
      }
      const worst=[...ds].sort((a,b)=>b.rate-a.rate)[0];
      const totalInt=Math.round(ds.reduce((s,d)=>s+(d.balance*d.rate/100/12),0));
      const alts=[
        `Avalanche: ataca ${worst.name} al ${worst.rate}% primero. Te cuesta €${totalInt}/mes en intereses ahora mismo — dinero regalado al banco.`,
        `Tienes €${totalInt}/mes yendo a intereses. Cada euro extra que pongas en tu deuda más cara (${worst.name} al ${worst.rate}%) genera un retorno garantizado del ${worst.rate}%.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cuánto tengo en cada inversión?', fn:()=>{
      const h=Object.entries(S.portfolio||{}).filter(([,q])=>q>0);
      if(!h.length){
        const alts=['Cartera vacía. Empieza con un ETF global (MSCI World o S&P 500). Diversificación instantánea en 1.500+ empresas.','Sin posiciones. VUSA o IWDA como primer ETF es el punto de entrada más sensato. Complejidad cero, diversificación máxima.'];
        return alts[Math.floor(Math.random()*alts.length)];
      }
      const total=h.reduce((s,[t,q])=>{const p=GAME.stockPrices[t]||(STOCKS.find(x=>x.ticker===t)?.price||0);return s+q*p;},0);
      const breakdown=h.map(([t,q])=>{const p=GAME.stockPrices[t]||(STOCKS.find(x=>x.ticker===t)?.price||0);const v=q*p;return `${t} ${Math.round(v/total*100)}%`;}).join(' · ');
      return `Cartera €${Math.round(total).toLocaleString('es')}: ${breakdown}. ${h.length===1?'Concentrada en un activo — considera diversificar.':h.length>=5?'Buena diversificación por activos.':''}`;
    }},
    { q:'¿Cuándo podré jubilarme?', fn:()=>{
      const sal=S.lifeSalary||1800; const expenses=sal*.6*12;
      const fire=expenses*25; const pat=S.patrimony||0;
      const monthlyInvest=S.monthlyContribution||0;
      if(monthlyInvest<=0) return 'Sin aportaciones mensuales configuradas. Define cuánto inviertes al mes para calcular tu proyección de jubilación.';
      const r=((S.expectedReturn||7)/100)/12;
      let acc=pat; let months=0;
      while(acc<fire&&months<600){acc=acc*(1+r)+monthlyInvest;months++;}
      const years=Math.round(months/12);
      const retireAge=(S.lifeAge||25)+years;
      return months>=600?`Con las aportaciones actuales (€${monthlyInvest}/mes) el objetivo FIRE (€${Math.round(fire).toLocaleString('es')}) no es alcanzable en 50 años. Necesitas invertir más o reducir gastos futuros previstos.`
        :`Con €${monthlyInvest.toLocaleString('es')}/mes alcanzas el FIRE en ~${years} años (a los ~${retireAge} años). Cada €100 extra al mes recorta el plazo.`;
    }},
    { q:'¿Tengo fondo de emergencia suficiente?', fn:()=>{
      const sal=S.lifeSalary||1800; const career=getCurrentCareer?.();
      const lifestyle=career?.lifestyleExtra||0;
      const monthlyExpenses=Math.round(sal*.5+lifestyle);
      const needed3=monthlyExpenses*3; const needed6=monthlyExpenses*6;
      const cash=S.cash||0;
      const alts=[
        cash>=needed6?`✅ Con €${cash.toLocaleString('es')} cubres ${Math.round(cash/monthlyExpenses)} meses de gastos. Fondo de emergencia sólido. Todo lo que supere 6 meses debería ir a inversión.`
        :cash>=needed3?`⚠️ Tienes ${Math.round(cash/monthlyExpenses)} meses de cobertura. Lo mínimo son 3, lo ideal son 6 (€${needed6.toLocaleString('es')} en tu caso). Sigue construyendo antes de invertir más.`
        :`❌ Solo ${Math.round(cash/monthlyExpenses*10)/10} meses de cobertura. Necesitas €${needed3.toLocaleString('es')} mínimo antes de invertir en renta variable. Un imprevisto te obligaría a vender en el peor momento.`,
        cash>=needed6?`Fondo de emergencia: ${Math.round(cash/monthlyExpenses)} meses. Excelente. El objetivo oficial es 3-6 meses; tú lo superas.`
        :`Con €${cash.toLocaleString('es')} y gastos mensuales de ~€${monthlyExpenses.toLocaleString('es')}, tienes ${(cash/monthlyExpenses).toFixed(1)} meses de cobertura. El mínimo es 3, el ideal 6.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué ETF debería comprar?', fn:()=>{
      const invested=S.invested||0;
      const h=Object.keys(S.portfolio||{}).filter(k=>S.portfolio[k]>0);
      const alts=[
        invested<5000?'Para empezar: VUSA (S&P 500) o IWDA (MSCI World). Comisiones mínimas, liquidez máxima. Diversificación automática en 500-1.500 empresas globales.'
        :h.length<=2?`Tienes €${invested.toLocaleString('es')} invertidos en ${h.length} activo(s). Considera añadir EMIM (mercados emergentes) para completar la cobertura global.`
        :`Con €${invested.toLocaleString('es')} en ${h.length} activos ya tienes buena base. Mantener y aportar sistemáticamente bate a cualquier estrategia activa estadísticamente.`,
        'Los ETFs de acumulación (Acc) reinvierten dividendos automáticamente — más eficientes fiscalmente en España que los de distribución. VWCE y IWDA son los más populares entre inversores españoles.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo diversifico mejor?', fn:()=>{
      const h=Object.entries(S.portfolio||{}).filter(([,q])=>q>0);
      const hasCrypto=h.some(([t])=>['BTC','ETH'].includes(t));
      const hasStocks=h.some(([t])=>!['BTC','ETH','GOLD'].includes(t));
      if(!h.length) return 'Sin inversiones aún. La diversificación empieza con un ETF global — 1 solo producto que ya diversifica en 1.500 empresas de 23 países.';
      const alts=[
        `Diversificación real = activos que no se mueven juntos. Acciones + Bonos + Inmobiliario (REITs) + algo de cash. ${hasCrypto?'Tienes cripto: máximo 5% de la cartera por su volatilidad.':'Considera añadir un fondo de bonos cuando te acerques a la jubilación.'}`,
        `${h.length} activos en cartera. La diversificación por geografía (Europa, EE.UU., emergentes) y sector (tecnología, salud, consumo) reduce el riesgo sin reducir rentabilidad esperada.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Vale la pena un plan de pensiones?', fn:()=>{
      const sal=S.lifeSalary||1800;
      const anual=sal*12;
      const deduccion=Math.min(1500,anual*.3);
      const tipo=anual>60000?0.45:anual>35200?0.37:anual>20200?0.30:0.19;
      const ahorro=Math.round(deduccion*tipo);
      const alts=[
        `Con tu sueldo de €${sal.toLocaleString('es')}/mes, aportar el máximo a plan de pensiones (€${deduccion.toLocaleString('es')}/año) te ahorra ~€${ahorro.toLocaleString('es')} en IRPF este año. Es una rentabilidad garantizada del ${Math.round(tipo*100)}% inmediata.`,
        `El plan de pensiones en España: deducción fiscal de hasta €1.500/año. Con tipo marginal del ${Math.round(tipo*100)}%, cada €1.500 aportados te ahorran €${Math.round(1500*tipo)} en la renta. Dinero gratis del fisco.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cuánto me cuesta la inflación?', fn:()=>{
      const cash=S.cash||0; const invested=S.invested||0;
      const inflacion=0.035;
      const perdidaCash=Math.round(cash*inflacion/12);
      const perdidaAnual=Math.round(cash*inflacion);
      const alts=[
        `Con €${cash.toLocaleString('es')} en cash, la inflación del 3.5% te roba €${perdidaCash}/mes (€${perdidaAnual}/año) en poder adquisitivo. Ese dinero desaparece sin que lo veas.`,
        `€${cash.toLocaleString('es')} parados = €${perdidaAnual}/año de poder adquisitivo perdido por inflación. ${invested>0?`Tus €${invested.toLocaleString('es')} invertidos al menos combaten la inflación.`:'Sin inversiones, la inflación gana por goleada.'}`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo negocio un aumento de sueldo?', fn:()=>{
      const sal=S.lifeSalary||1800;
      const objetivo=Math.round(sal*1.2);
      const alts=[
        `Para negociar el sueldo de €${sal.toLocaleString('es')} a €${objetivo.toLocaleString('es')} (+20%): 1) Documenta logros con números. 2) Investiga el mercado (Glassdoor, LinkedIn). 3) Pide reunión específica para ello. 4) Empieza por arriba del objetivo real.`,
        `Script probado: "He investigado el mercado y para mi perfil el rango es €${Math.round(sal*1.15).toLocaleString('es')}-€${Math.round(sal*1.25).toLocaleString('es')}. ¿Podemos hablarlo?" — nunca seas tú quien diga el número primero.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Criptomonedas sí o no?', fn:()=>{
      const pat=S.patrimony||0;
      const maxCrypto=Math.round(pat*0.05);
      const h=Object.entries(S.portfolio||{}).filter(([t,q])=>['BTC','ETH'].includes(t)&&q>0);
      const cryptoVal=h.reduce((s,[t,q])=>{const p=GAME.stockPrices[t]||(STOCKS.find(x=>x.ticker===t)?.price||0);return s+q*p;},0);
      const cryptoPct=pat>0?Math.round(cryptoVal/pat*100):0;
      const alts=[
        cryptoPct>10?`Tienes el ${cryptoPct}% en cripto. Por encima del 5-10% recomendado para activos especulativos. Alta correlación y volatilidad —considera rebalancear.`
        :cryptoPct>0?`${cryptoPct}% en cripto — dentro del rango aceptable (<10%). Si crees en el activo, manten. Si no lo entiendes, reduce.`
        :`Sin cripto. El 5% máximo de la cartera en BTC es lo que recomienda la mayoría de gestores. Ni más ni menos. Y solo si entiendes lo que compras.`,
        'Bitcoin tiene 15 años de historia. Ha caído >80% tres veces y se ha recuperado las tres. Es el activo más volátil y más rentable de la última década. Todo en el mismo paquete.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué hago si pierdo el trabajo?', fn:()=>{
      const cash=S.cash||0; const sal=S.lifeSalary||1800;
      const months=sal>0?Math.round(cash/(sal*.6)):0;
      const alts=[
        `Con €${cash.toLocaleString('es')} en cash y gastos de ~€${Math.round(sal*.6).toLocaleString('es')}/mes tienes ${months} meses de cobertura. ${months>=6?'Margen cómodo para buscar trabajo sin presión.':months>=3?'Mínimo suficiente. Prioriza buscar trabajo.':'Margen crítico — activa el modo ahorro extremo desde el día 1.'}`,
        `Protocolo de emergencia laboral: 1) No toques las inversiones si puedes evitarlo. 2) Reduce gastos al mínimo vital. 3) Activa prestación por desempleo inmediatamente. 4) Red de contactos: el 80% de empleos se consiguen por networking.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo ahorrar con sueldo bajo?', fn:()=>{
      const sal=S.lifeSalary||1800;
      const min20=Math.round(sal*.2);
      const min10=Math.round(sal*.1);
      const alts=[
        `Con €${sal.toLocaleString('es')}/mes, el 10% son €${min10.toLocaleString('es')}/mes. Empieza ahí. Automatiza ese ingreso el día de cobro. En 3 meses no lo echarás de menos y habrás ahorrado €${(min10*3).toLocaleString('es')}.`,
        `Sueldo bajo no significa no poder ahorrar. Significa que los pequeños cambios de gasto tienen más impacto: cancelar 2 suscripciones (€30), comer de tupper 3 días/semana (€60), revisar seguro de móvil (€15) = €${105}/mes sin grandes sacrificios.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el interés compuesto realmente?', fn:()=>{
      const mc=S.monthlyContribution||200;
      const simFn=(monthly,rate,years)=>{let acc=0;const mr=rate/100/12;for(let i=0;i<years*12;i++){acc=(acc+monthly)*(1+mr);}return Math.round(acc);};
      const v10=simFn(mc,7,10); const v30=simFn(mc,7,30);
      const alts=[
        `Con €${mc}/mes al 7% anual: en 10 años tienes €${v10.toLocaleString('es')}. En 30 años: €${v30.toLocaleString('es')}. La diferencia no es proporcional — es exponencial. Los últimos 10 años generan más que los primeros 20.`,
        `Interés compuesto: ganas interés sobre el interés. €10.000 al 7% = €700 el año 1. Pero el año 30 genera €7.600 de interés anual sobre el mismo capital inicial. El dinero se auto-acelera.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cuánto gano realmente con mis inversiones?', fn:()=>{
      const invested=S.invested||0;
      if(!invested) return 'Sin inversiones activas. No hay retorno que calcular. Cada día sin invertir es interés compuesto que pierdes.';
      const ret=((S.expectedReturn||7)/100);
      const monthlyReturn=Math.round(invested*ret/12);
      const alts=[
        `Con €${invested.toLocaleString('es')} invertidos al ${S.expectedReturn||7}% esperado, generas ~€${monthlyReturn.toLocaleString('es')}/mes en rentabilidad (no realizada). Ese dinero trabaja sin que hagas nada.`,
        `Tu cartera de €${invested.toLocaleString('es')} a largo plazo: €${Math.round(invested*Math.pow(1+(S.expectedReturn||7)/100,10)).toLocaleString('es')} en 10 años, €${Math.round(invested*Math.pow(1+(S.expectedReturn||7)/100,20)).toLocaleString('es')} en 20 años. Solo dejando el dinero quieto.`,
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Debería invertir aunque tenga poca cantidad?', fn:()=>{
      const alts=[
        'Sí, siempre. €50/mes durante 40 años al 7% = €131.000. El mismo dinero esperando 10 años para "tener más" = €65.000. El tiempo perdido no se recupera nunca.',
        'Con €1 ya puedes comprar fracciones de ETF en muchos brokers. La cantidad importa menos que el hábito. Un inversor que aporta €100/mes 30 años supera a quien aporta €1.000/mes durante 10.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Es buen momento para invertir ahora?', fn:()=>{
      const alts=[
        'El mejor momento para invertir fue hace 10 años. El segundo mejor momento es hoy. Nadie — ni los mejores gestores del mundo — sabe predecir el mercado de forma consistente.',
        'El "market timing" destruye más rentabilidad que cualquier comisión. Un estudio de Schwab demostró que incluso invertir siempre en el peor día del año supera a quedarse esperando el "momento perfecto".',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el rebalanceo de cartera?', fn:()=>{
      const alts=[
        'Rebalancear = volver a tu asignación objetivo cuando un activo crece demasiado. Si quieres 80% acciones y el bull market lo lleva al 95%, vendes acciones y compras bonos para volver al 80%. Fuerza a comprar barato y vender caro automáticamente.',
        'Frecuencia óptima de rebalanceo: anual o cuando un activo se desvía >5% del objetivo. Menos = más eficiente fiscalmente (menos eventos tributables). El rebalanceo automático de los fondos mixtos es una ventaja real.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},

    { q:'¿Qué es un ETF indexado vs fondo activo?', fn:()=>{
      const alts=[
        'Los fondos activos cobran 1,5-2,5%/año y el 90% no bate al índice en 15 años (datos SPIVA). Un ETF indexado cobra 0,07-0,25%/año y replica el mercado exactamente. La diferencia de comisión en 30 años sobre €100.000 supera €400.000 en rentabilidad perdida.',
        'Buffett apostó €1M a que ningún fondo activo batiría al S&P 500 en 10 años. Ganó fácil. La matemática es simple: si el mercado da X, los fondos activos dan X menos comisiones. Imposible ganar en media. Usa gestión pasiva.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el TER de un fondo?', fn:()=>{
      const alts=[
        'TER = Total Expense Ratio. La comisión anual total del fondo. VUSA cobra 0,07%, un fondo activo cobra 1,8%. Diferencia sobre €100.000 en 30 años: más de €500.000 en rentabilidad. El TER es el coste más importante para comparar fondos.',
        '0,07% vs 1,8% parece poca diferencia. Pero el 1,8% sobre €200.000 son €3.600/año que no se reinvierten. En 30 años con interés compuesto, esa diferencia acumulada supera el capital inicial. El coste importa más que casi cualquier otra decisión.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo tributan mis ETFs en España?', fn:()=>{
      const invested=S.invested||0; const gain=Math.round(invested*0.3);
      const tax=gain<=6000?Math.round(gain*0.19):gain<=50000?Math.round(6000*0.19+(gain-6000)*0.21):Math.round(6000*0.19+44000*0.21+(gain-50000)*0.23);
      const alts=[
        `Plusvalías de ETFs: hasta €6.000 al 19%, €6.001-€50.000 al 21%, €50.001-€200.000 al 23%, más de €200.000 al 27%. ${invested>0?`Con tus €${invested.toLocaleString('es')} invertidos, una ganancia del 30% pagaría ~€${tax.toLocaleString('es')} de impuestos al vender.`:'Mientras no vendes, no tributas. El diferimiento fiscal multiplica el interés compuesto.'}`,
        'Los ETFs de ACUMULACIÓN reinvierten dividendos sin tributar en cada pago. Solo tributas al vender. Mucho más eficiente que los de DISTRIBUCIÓN, que te obligan a declarar cada dividendo como rendimiento del capital mobiliario.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el lifestyle creep?', fn:()=>{
      const career=getCurrentCareer?.(); const lc=career?.lifestyleExtra||0;
      const alts=[
        `Lifestyle creep: cuando tu sueldo sube pero los gastos suben igual o más, quedándote financieramente igual. ${lc>0?`Tu carrera tiene €${lc.toLocaleString('es')}/mes de gasto extra. Sin control consciente, ese dinero desaparece sin construir patrimonio.`:'El antídoto: cada subida de sueldo, incrementa primero el porcentaje de ahorro, luego el gasto.'}`,
        'El directivo que gana €8.000/mes y gasta €7.800 es más pobre financieramente que el junior que gana €2.000 y ahorra €600. El lifestyle creep destruye más patrimonio que la crisis de 2008 para la mayoría de familias.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cuánto necesito para vivir de las rentas?', fn:()=>{
      const sal=S.lifeSalary||1800; const gastos=Math.round(sal*0.7*12);
      const fireNum=gastos*25; const fire4=Math.round(gastos/12);
      const alts=[
        `Con tus gastos estimados de €${gastos.toLocaleString('es')}/año, necesitas €${fireNum.toLocaleString('es')} invertidos al 4% para vivir de rentas indefinidamente. Eso genera €${fire4.toLocaleString('es')}/mes — exactamente tus gastos. Regla del 4%.`,
        `Número FIRE = gastos anuales × 25. Si gastas €${fire4.toLocaleString('es')}/mes (€${gastos.toLocaleString('es')}/año) necesitas €${fireNum.toLocaleString('es')} invertidos. Con ese capital, retiras el 4% anual y el dinero dura estadísticamente 30+ años.`,
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Es mejor alquilar o comprar?', fn:()=>{
      const cash=S.cash||0;
      const alts=[
        `Comprar gana si te quedas >10 años, tienes estabilidad laboral y el ratio precio/alquiler anual es <20. ${cash>=20000?'Tienes base para la entrada. Calcula si la zona tiene ratio razonable.':'Primero necesitas 20% de entrada + 10% en gastos notariales/ITP antes de plantearlo.'}`,
        'Alquilar no es tirar el dinero — pagas flexibilidad y liquidez. Comprar tiene costes del 10-15% al entrar y 6-10% al salir. El break-even real frente al alquiler es de 7-12 años según ciudad. Haz los números antes de decidir por emoción.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es un REIT?', fn:()=>{
      const alts=[
        'REIT = Real Estate Investment Trust. Un fondo que invierte en inmuebles y cotiza en bolsa. Da exposición inmobiliaria desde €100, sin hipoteca ni inquilinos. Por ley distribuyen el 90% de beneficios como dividendo. Liquidez total vs inmueble físico.',
        'Los REITs permiten invertir en oficinas, centros comerciales u hospitales con cualquier cantidad. Ventaja: liquidez y diversificación. Desventaja: más correlación con bolsa que el ladrillo físico. Acceso vía ETFs de REITs como IWDP o VNQI.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué riesgo tiene mi cartera?', fn:()=>{
      const h=Object.entries(S.portfolio||{}).filter(([,q])=>q>0);
      const total=h.reduce((s,[t,q])=>{const p=GAME.stockPrices[t]||(STOCKS.find(x=>x.ticker===t)?.price||0);return s+q*p;},0);
      const hasCrypto=h.filter(([t])=>['BTC','ETH'].includes(t));
      const cryptoVal=hasCrypto.reduce((s,[t,q])=>{const p=GAME.stockPrices[t]||(STOCKS.find(x=>x.ticker===t)?.price||0);return s+q*p;},0);
      const cryptoPct=total>0?Math.round(cryptoVal/total*100):0;
      if(!h.length) return 'Sin cartera: riesgo de mercado cero, pero riesgo de inflación alto. Todo en cash pierde poder adquisitivo cada año.';
      const alts=[
        `${h.length} posiciones, €${Math.round(total).toLocaleString('es')} total. ${cryptoPct>20?`⚠️ ${cryptoPct}% en cripto — riesgo muy alto. Un crash del 80% (histórico en BTC) supondría €${Math.round(total*cryptoPct/100*0.8).toLocaleString('es')} de pérdida.`:cryptoPct>0?`${cryptoPct}% en cripto — exposición especulativa presente.`:'Sin cripto — perfil de riesgo moderado.'}`,
        `Con €${Math.round(total).toLocaleString('es')} en cartera, un crash del 40% (como 2008) implica €${Math.round(total*0.4).toLocaleString('es')} de caída temporal. La pregunta clave: ¿mantienes sin vender con esa pérdida sobre el papel?`,
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el Euríbor?', fn:()=>{
      const mort=(S.mortgages||[]).find(x=>!x.paid&&(x.type||'variable')==='variable');
      const alts=[
        `El Euríbor es el tipo al que los bancos europeos se prestan entre sí. La mayoría de hipotecas variables en España = Euríbor + diferencial. ${mort?`Si el Euríbor sube 1%, tu cuota sube ~€${Math.round((mort.principal||100000)*0.01/12)}/mes.`:'Pasó del -0,5% (2022) al 4,2% (2023). Diferencia en €200.000 a 30 años: +€400/mes.'}`,
        'El Euríbor llegó a -0,5% en 2021 (cuotas mínimas históricas) y al 4,2% en 2023. La diferencia en cuota mensual para €200.000 a 30 años supera €400/mes. Por eso la hipoteca fija da certeza a cambio de pagar algo más al inicio.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el MSCI World?', fn:()=>{
      const alts=[
        'MSCI World: ~1.500 empresas de 23 países desarrollados. EEUU 69%, Europa 15%, Japón 6%. Un ETF que lo replique (IWDA) da exposición global automática con TER de 0,2%. Ha dado ~10,5% anual de media en los últimos 30 años.',
        'MSCI World vs ACWI: World solo incluye países desarrollados. ACWI añade mercados emergentes (China, India, Brasil — 10% del índice). VWCE replica el ACWI. Para la mayoría de inversores a largo plazo, cualquiera de los dos es excelente punto de partida.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el coste de oportunidad?', fn:()=>{
      const cash=S.cash||0; const lost=Math.round(cash*0.07/12);
      const alts=[
        `Coste de oportunidad = lo que dejas de ganar por elegir una opción. ${cash>3000?`Tus €${cash.toLocaleString('es')} en cash tienen un coste de ~€${lost.toLocaleString('es')}/mes (lo que ganarían al 7% en bolsa que no estás ganando).`:'Cada euro en cash pierde frente a invertirlo. El coste no es visible, pero es tan real como cualquier gasto.'}`,
        'Coste de oportunidad del efectivo: al 7% histórico de la bolsa, €10.000 sin invertir 10 años = €9.672 de retorno perdido. No aparece en ningún extracto bancario, pero se acumula en silencio año tras año.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué son los Dividend Aristocrats?', fn:()=>{
      const alts=[
        'Dividend Aristocrats: empresas del S&P 500 con 25+ años consecutivos aumentando su dividendo. ~65 empresas: Coca-Cola, J&J, Procter & Gamble... La selección elimina empresas frágiles automáticamente — una empresa en problemas recorta el dividendo antes de 25 años.',
        'Invertir en Dividend Aristocrats da: dividendo creciente (anti-inflación), empresas con moat probado y menor volatilidad que el mercado general. El trade-off: menor crecimiento de precio que tecnológicas en mercados alcistas. Perfectas para inversores que buscan renta pasiva creciente.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo protejo mi patrimonio de la inflación?', fn:()=>{
      const pat=S.patrimony||0; const cash=S.cash||0;
      const cashPct=pat>0?Math.round(cash/pat*100):100; const perdida=Math.round(cash*0.035);
      const alts=[
        `Activos anti-inflación: acciones (empresas suben precios), inmobiliario (rentas suben con IPC), oro, bonos ligados a inflación (TIPS). ${cashPct>40?`Con el ${cashPct}% en cash, la inflación te roba €${perdida.toLocaleString('es')}/año en poder adquisitivo.`:'Tu cartera con activos reales combate la inflación activamente.'}`,
        `La inflación del 3,5% sobre €${(cash||10000).toLocaleString('es')} son €${Math.round((cash||10000)*0.035).toLocaleString('es')}/año desaparecidos. En 20 años sin invertir, €100.000 valen €50.000 en términos reales. Única defensa: activos reales.`,
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cuándo debo vender una inversión?', fn:()=>{
      const alts=[
        'Razones VÁLIDAS para vender: tu tesis de inversión ha cambiado, el activo supera tu % objetivo (rebalanceo), o necesitas el dinero planificado. Razón INVÁLIDA: "ha bajado y me da pánico" o "ha subido mucho y quiero asegurar". Esas decisiones emocionales destruyen rentabilidad.',
        '"El mercado transfiere riqueza de los impacientes a los pacientes" — Buffett. Vende solo si el negocio o activo ha cambiado fundamentalmente, no si el precio fluctúa. Las fluctuaciones son ruido; el valor a largo plazo es la señal.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo funciona la tarjeta revolving?', fn:()=>{
      const alts=[
        'Las tarjetas revolving cobran 22-28% TAE — el crédito más caro legalmente. Con €2.000 al 24% TAE pagando el mínimo de €60/mes: tardas 4 años en pagar y los intereses totales son €800 — un 40% extra. Es la trampa financiera número uno en España.',
        '⚠️ Revolving = veneno financiero. €1.000 en revolving al 24% = €240/año en intereses puros. Cancélala antes de cualquier inversión. No hay bolsa que compense un 24% garantizado de coste.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es la regla del 4%?', fn:()=>{
      const sal=S.lifeSalary||1800; const gastos=Math.round(sal*0.7);
      const fire=gastos*12*25;
      const alts=[
        `La regla del 4%: si tienes suficiente capital invertido, puedes retirar el 4% anual indefinidamente (con alta probabilidad de que el dinero dure 30+ años). Con tus gastos estimados de €${gastos.toLocaleString('es')}/mes necesitas €${fire.toLocaleString('es')} invertidos.`,
        'La regla del 4% viene del estudio Trinity (1998): carteras 60% acciones / 40% bonos han sobrevivido 30+ años con retiradas del 4% anual en el 95% de períodos históricos. Es el fundamento del movimiento FIRE.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el VWCE?', fn:()=>{
      const alts=[
        'VWCE (Vanguard FTSE All-World Acc): ~3.700 empresas de 47 países desarrollados + emergentes. TER 0,22%. Acumulación = reinvierte dividendos automáticamente. Es literalmente "compra el mundo entero" en un producto. El ETF más popular entre inversores europeos a largo plazo.',
        'VWCE vs IWDA: VWCE incluye emergentes (China, India, Brasil — ~10% del fondo). IWDA solo países desarrollados, TER 0,20%. Para la mayoría de inversores a largo plazo la diferencia es mínima. Ambos son excelentes opciones de cartera núcleo.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es la cartera permanente?', fn:()=>{
      const alts=[
        'Harry Browne: 25% acciones + 25% bonos largos + 25% oro + 25% cash. Desde 1972 da ~8% anual con caída máxima del -12%. Cada cuadrante protege en un escenario distinto: acciones (crecimiento), bonos (deflación), oro (inflación), cash (recesión). Rebalanceo anual.',
        '25/25/25/25. Suena aburrida, lo es. Pero ha sobrevivido stagflación, crisis del petróleo, 2008 y COVID. Rentabilidad moderada, volatilidad mínima. Perfecta para quienes priorizan proteger sobre multiplicar.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo funciona la amortización anticipada?', fn:()=>{
      const mort=(S.mortgages||[]).find(x=>!x.paid);
      if(!mort) return 'Sin hipoteca activa. Para el futuro: negocia la comisión por amortización anticipada a 0% cuando firmes — es negociable y puede ahorrarte miles.';
      const alts=[
        `Cada €1.000 que amortizas anticipadamente reduce el capital pendiente y por tanto los intereses futuros. ${(mort.rate||3)>3.5?'Con tu tipo actual, amortizar tiene sentido matemático claro.':'Con tipo bajo, la bolsa históricamente supera al ahorro en intereses hipotecarios.'} Dos opciones: reducir plazo (ahorras más) o reducir cuota (más flexibilidad mensual).`,
        'Amortizar plazo vs cuota: si reduces plazo, pagas lo mismo pero acabas antes y ahorras más intereses totales. Si reduces cuota, liberas cash mensual pero el ahorro en intereses es menor. Si tienes estabilidad laboral: reduce plazo.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el ratio PER?', fn:()=>{
      const alts=[
        'PER = Precio / Beneficio por acción. Si una empresa cotiza a €100 y gana €7/acción, su PER es 14,3 — pagas 14,3 años de beneficios actuales. Histórico S&P 500: PER medio 15-17. Por encima de 25-30 empieza a ser caro salvo crecimiento extraordinario justificado.',
        'PER 10 = barato (o empresa en declive). PER 20 = valoración normal. PER 40+ = expectativas de crecimiento altísimas (arriesgado si no se cumplen). NVIDIA llegó a PER 70 en 2024. El contexto de tipos de interés también importa: con tipos altos, el PER razonable es menor.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cuánto cobra un broker en España?', fn:()=>{
      const alts=[
        'Brokers recomendados para ETFs en España: Interactive Brokers (0,05% mín €1), Trade Republic (€1 fijo), DeGiro (€0 en ETFs seleccionados + €1/trimestre). Evita bancos tradicionales — cobran 0,25-0,5% por operación, hasta 50× más que los brokers low-cost.',
        'El coste del broker importa más de lo que parece. €300/mes en ETF durante 30 años: con 0,1% de comisión acumulas €12.000 más que con 0,5%. Los brokers low-cost han democratizado la inversión — no tiene sentido usar los caros.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué son los fondos de inversión indexados?', fn:()=>{
      const alts=[
        'Un fondo indexado replica un índice (S&P 500, MSCI World) automáticamente sin gestor activo. Comisiones mínimas (0,05-0,3%/año), diversificación instantánea, sin necesidad de análisis. John Bogle (Vanguard) los inventó en 1976 y democratizó la inversión.',
        'La diferencia entre fondo indexado y ETF es operativa: el fondo se compra al NAV del día, el ETF cotiza en bolsa en tiempo real. En España los fondos indexados permiten traspaso sin tributar — ventaja fiscal relevante para rebalanceos.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es la diversificación temporal (DCA)?', fn:()=>{
      const mc=S.monthlyContribution||200;
      const alts=[
        `DCA = invertir €${mc.toLocaleString('es')}/mes pase lo que pase, sin mirar el precio. En meses malos compras más unidades. En meses buenos, menos. El coste promedio mejora sistemáticamente sin necesidad de predecir el mercado. El 95% de inversores debería usar DCA.`,
        'Un estudio de Vanguard: inversión de golpe vs DCA en períodos de 10 años. La de golpe ganó en 2/3 de períodos (el mercado sube más tiempo del que baja). Pero DCA reduce ansiedad y el riesgo de comprar justo antes de un crash. Para la mayoría: DCA automático y olvidarse.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo construyo una cartera desde cero?', fn:()=>{
      const cash=S.cash||0; const inv=S.invested||0;
      const alts=[
        `Cartera desde cero en 4 pasos: 1) Fondo de emergencia (3-6 meses de gastos). ${cash>3000?'✅ Tienes algo de base.':'Primero esto.'} 2) ETF core global (VWCE o IWDA — 80-90% de la cartera). 3) Aportaciones automáticas mensuales. 4) No tocar en 10+ años.`,
        'La cartera más sencilla que funciona: 100% VWCE o IWDA. Un ETF. 3.700 empresas de 47 países. Aportación automática mensual. Revisión anual. El 90% de los "portfolios complejos" de 15 activos tienen peor rentabilidad ajustada al riesgo.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es el impuesto de sucesiones?', fn:()=>{
      const pat=S.patrimony||0;
      const alts=[
        `El impuesto de sucesiones en España varía mucho por comunidad autónoma: Madrid y Canarias casi lo han eliminado (<1% efectivo). Cataluña y Asturias pueden llegar al 34%. Con un patrimonio de €${pat.toLocaleString('es')}, la planificación sucesoria puede ahorrar decenas de miles a tus herederos.`,
        'Estrategias legales para reducir sucesiones: donaciones en vida (reducción del 95% en algunos casos), seguros de vida (quedan fuera de la herencia), SL familiar (valoración reducida), testamento optimizado. Consulta un asesor fiscal cuando el patrimonio supere €200.000.',
      ]; return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es un fondo indexado?', fn:()=>{
      const alts=[
        'Un fondo indexado replica un índice (S&P 500, MSCI World) comprando todas sus empresas en proporción. Sin gestor que decida, sin análisis — solo seguir el mercado. Resultado: bate al 85% de los fondos activos a 15 años, con comisiones 10 veces menores.',
        'Vanguard, fundada por John Bogle en 1975, demostró que los fondos indexados baten sistemáticamente a los gestores activos. Hoy gestionan más de $8 billones. La revolución silenciosa de las finanzas personales.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es la diversificación real?', fn:()=>{
      const alts=[
        'Diversificación real ≠ tener muchas acciones del mismo sector. MSCI World = 23 países · 1.500 empresas · 11 sectores. Eso es diversificación. 10 empresas tecnológicas españolas no lo es. Busca activos que se muevan de forma diferente entre sí.',
        'La correlación lo es todo. En 2022 acciones y bonos cayeron juntos (correlación 1). En otros crashs, los bonos subieron. La diversificación funciona cuando los activos tienen correlación baja o negativa entre sí, no por tener muchos.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Dónde guardo el fondo de emergencia?', fn:()=>{
      const alts=[
        'El fondo de emergencia debe estar en: 1) Cuenta remunerada (Revolut, Trade Republic: 3-4% TAE), 2) Letras del Tesoro a 3-6 meses (4% sin riesgo), 3) Fondo monetario. NUNCA en bolsa ni en fondos con riesgo. Debe estar disponible en 24-48h.',
        'Trade Republic paga actualmente ~4% TAE en cuenta corriente sin plazo. Revolut hasta 4,5% para suscriptores premium. Las letras del Tesoro español a 3 meses han dado 3,5-4% en 2024. Tres opciones sólidas para tu fondo de emergencia.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué broker usar en España?', fn:()=>{
      const alts=[
        'Para ETFs e indexación en España: MyInvestor (sin mínimo, amplio catálogo), DEGIRO (muy barato para bolsa directa), Interactive Brokers (el mejor para carteras grandes). Evita los brokers de banco tradicional — sus comisiones pueden ser 10-20 veces más caras.',
        'Criterios para elegir broker: 1) Regulado por CNMV/ESMA (seguridad). 2) Comisiones de compra-venta. 3) Custodia anual (muchos cobran 0%). 4) Catálogo de fondos y ETFs. 5) Facilidad de uso. Para empezar: MyInvestor o Trade Republic tienen todo.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo funciona la bolsa en un crash?', fn:()=>{
      const alts=[
        'En un crash: 1) Cae el precio porque más gente vende que compra. 2) Los margin calls fuerzan ventas automáticas. 3) Los medios amplifican el pánico. 4) Los inversores emocionales venden en el peor momento. 5) Los inversores disciplinados compran barato. El crash es una transferencia de riqueza de los impacientes a los pacientes.',
        'Los crashes más grandes de la historia: 1929 (-86%), 1973 (-48%), 2000 (-49%), 2008 (-56%), 2020 (-34%). En todos los casos el mercado se recuperó y superó los máximos anteriores. La pregunta no es si caerá, sino si estarás para la recuperación.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué pasa si quiebra mi broker?', fn:()=>{
      const alts=[
        'Si quiebra tu broker, tus activos están separados del balance del broker (son tuyos, no suyos). En España el Fondo de Garantía de Inversiones (FOGAIN) cubre hasta €100.000 por inversor. Para brokers europeos: el SIPC estadounidense cubre $500.000. No es lo mismo que perder el dinero.',
        'Los activos que compras en un broker (acciones, ETFs) los posees tú — el broker solo los custodia. Si quiebra Degiro o MyInvestor, tus acciones siguen siendo tuyas y se transfieren a otro custodio. Sí puedes perder dinero en efectivo no invertido por encima de €100.000.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué son los REITs?', fn:()=>{
      const alts=[
        'REITs (Real Estate Investment Trusts): empresas que poseen y gestionan inmuebles (oficinas, centros comerciales, residencias de estudiantes, hospitales). Cotizan en bolsa como acciones. Están obligadas a repartir el 90% del beneficio como dividendo. Inmobiliario sin hipoteca ni gestión.',
        'Ventajas REITs vs piso en alquiler: diversificación instantánea en cientos de inmuebles, liquidez total (vendes en segundos), sin gestión de inquilinos, inversión desde €10, dividendos periódicos. Desventaja: correlación alta con la bolsa en los crashes. Excelente para el 5-10% de una cartera.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo afecta el tipo de cambio a mis inversiones?', fn:()=>{
      const alts=[
        'Si inviertes en ETFs del S&P 500 en euros, tienes exposición al dólar. Si el dólar sube vs el euro, ganas más. Si cae, ganas menos. Los ETFs con divisa cubierta (hedged) eliminan este riesgo pero cuestan ~0,5-1% anual extra. Para plazos largos (+15 años), la cobertura raramente vale la pena.',
        'El riesgo de divisa es real pero se suele sobrevalorar en inversión indexada global. Si inviertes en MSCI World, tienes exposición a 23 divisas — se diversifican entre sí. Solo si tu cartera es muy concentrada en una moneda (solo EE.UU.) tiene sentido valorar la cobertura.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Qué es la tasa interna de retorno (TIR)?', fn:()=>{
      const alts=[
        'La TIR es la rentabilidad anualizada real de una inversión. Si compras un piso por €150.000, recibes €800/mes de alquiler y lo vendes a €180.000 en 10 años, tu TIR es ~7,3% anual. Es la métrica que permite comparar cualquier inversión en igualdad de condiciones.',
        'TIR vs rentabilidad simple: la diferencia importa. Una inversión que dobla en 10 años tiene una TIR del 7,2%. Una que dobla en 5 años tiene una TIR del 14,9%. El tiempo cambia completamente la ecuación. Siempre compara inversiones por TIR, no por retorno total.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},
    { q:'¿Cómo funciona el sistema bancario?', fn:()=>{
      const alts=[
        'Los bancos toman tu depósito (te pagan 0,5-2%) y lo prestan a otros al 4-15%. La diferencia (margen de intereses) es su beneficio. Con el dinero que depositas, prestan 9 veces más (reserva fraccionaria). Por eso los bancos son sistémicamente importantes — y por eso se rescatan.',
        'Cuando depositas €1.000 en el banco, el banco puede crear €9.000 adicionales en préstamos (con reserva del 10%). El BCE controla los tipos para regular cuánto se presta y a qué coste. Cuando el BCE sube tipos, los préstamos se encarecen y la economía se enfría — y viceversa.',
      ];
      return alts[Math.floor(Math.random()*alts.length)];
    }},

    // ── Preguntas nuevas ─────────────────────────────────────────────
    { q:'¿Cómo controlo mi psicología en los crashes?', fn:()=>{
      const inv=S.invested||0;
      const opts=[
        `Un crash del 40% sobre €${inv.toLocaleString('es')} = €${Math.round(inv*0.4).toLocaleString('es')} de caída temporal. ¿Mantendrías sin vender? Si la respuesta es no, ajusta tu exposición ahora, no durante el crash.`,
        'El inversor medio obtiene un 3,9% anual mientras el mercado da un 10,3%. La diferencia es comportamiento: vendes en mínimos por pánico y compras en máximos por euforia. Solución: DCA automático y no mirar la cartera más de una vez al mes.',
      ];
      return opts[Math.floor(Math.random()*opts.length)];
    }},
    { q:'¿Qué es el Factor Investing?', fn:()=>{
      const opts=[
        'Factor investing: invertir según características ligadas a mayor rentabilidad. Los 5 factores probados: Value (empresas baratas), Size (pequeñas caps), Profitability (alta rentabilidad), Investment (conservador) y Momentum (tendencia).',
        'ETFs de factores: IWVL (value), IWMO (momentum), IWQU (quality) — TER ~0,30%. Una cartera multifactor combina varios para diversificar el riesgo de factor. Fama y French los validaron académicamente en 1992.',
      ];
      return opts[Math.floor(Math.random()*opts.length)];
    }},
    { q:'¿Qué es el FIRE Lean vs Fat FIRE?', fn:()=>{
      const sal=S.lifeSalary||1800;
      const lean=Math.round(sal*.5*12*25); const fat=Math.round(sal*1.2*12*25);
      return `Lean FIRE: vivir con lo mínimo — €${Math.round(sal*.5).toLocaleString('es')}/mes, necesitas €${lean.toLocaleString('es')}. Fat FIRE: mantener el estilo actual — €${Math.round(sal*1.2).toLocaleString('es')}/mes, necesitas €${fat.toLocaleString('es')}. La mayoría busca el punto medio con margen de seguridad.`;
    }},
    { q:'¿Cómo funciona la economía del comportamiento?', fn:()=>{
      return 'Thaler (Nobel 2017): somos predeciblemente irracionales. Sesgos clave: aversión a pérdidas (perder €100 duele 2,5× más que ganar €100), descuento hiperbólico (preferimos €100 hoy a €150 en un año), efecto ancla (el primer precio condiciona todo). Conocerlos es la única defensa real.';
    }},
    { q:'¿Qué es el presupuesto 50/30/20?', fn:()=>{
      const sal=S.lifeSalary||1800;
      return `50% necesidades (€${Math.round(sal*.5).toLocaleString('es')}/mes), 30% deseos (€${Math.round(sal*.3).toLocaleString('es')}/mes), 20% ahorro/deuda (€${Math.round(sal*.2).toLocaleString('es')}/mes). Es el punto de partida — ajusta el 20% hacia arriba.`;
    }},
    { q:'¿Cómo reduzco mis gastos sin sacrificar calidad de vida?', fn:()=>{
      const sal=S.lifeSalary||1800;
      return `Regla de las 24h: ante cualquier compra >€50, espera un día. El 40% no se realizan. Con €${sal.toLocaleString('es')}/mes, revisar suscripciones (€30), comer de tupper 3 días (€60) y el seguro del móvil (€15) libera €105/mes — €38.000 extra en 30 años al 7%.`;
    }},
    { q:'¿Cómo funciona el plan de pensiones en España?', fn:()=>{
      const sal=S.lifeSalary||1800;
      const tipo=(sal*12)>35200?0.37:(sal*12)>20200?0.30:0.19;
      return `Aportación máxima deducible: €1.500/año. Con tipo marginal del ${Math.round(tipo*100)}%, aportar €1.500 te ahorra €${Math.round(1500*tipo)} en la declaración. Tributa al rescatar, pero el diferimiento del compuesto durante décadas compensa.`;
    }},
    { q:'¿Cómo tributa la bolsa en España?', fn:()=>{
      return 'Plusvalías: 19% hasta €6.000, 21% de €6.001 a €50.000, 23% de €50.001 a €200.000, 27% por encima. Los ETFs de acumulación difieren el impuesto hasta la venta — ventaja fiscal enorme para el largo plazo.';
    }},
    { q:'¿Qué seguro de vida necesito?', fn:()=>{
      const sal=S.lifeSalary||1800;
      return `Necesitas seguro de vida si tienes dependientes (hijos, pareja sin ingresos) o hipoteca grande. Cobertura mínima: 10 años de sueldo (€${(sal*12*10).toLocaleString('es')}). Sin dependientes ni deudas grandes: no lo necesitas.`;
    }},
    { q:'¿Qué son las finanzas en pareja?', fn:()=>{
      return 'Tres modelos: Todo común (eficiente, menos autonomía), Todo separado (autónomo, ineficiente), Híbrido (recomendado): cuenta conjunta para gastos fijos + cuentas individuales. La regla proporcional — cada uno aporta según su sueldo — es la más equitativa.';
    }},

  ];

  // ─── helpers ────────────────────────────────────────────────
  let _shownQIndices  = [];
  let _coachHistory   = []; // [{q, a}] últimas 6 exchanges


  function _themeColor(dark, light) {
    return document.body.classList.contains('light-mode') ? light : dark;
  }

  function _fmt(n) { return Math.round(n).toLocaleString('es'); }

  function _getRandomQs(n, excludeIdx) {
    const pool  = ALL_QUESTIONS.map((_,i)=>i).filter(i=>i!==excludeIdx);
    const fresh = pool.filter(i=>!_shownQIndices.includes(i));
    const src   = fresh.length >= n ? fresh : pool;
    const copy  = [...src], picked = [];
    while(picked.length < n && copy.length) {
      picked.push(copy.splice(Math.floor(Math.random()*copy.length),1)[0]);
    }
    _shownQIndices = [..._shownQIndices.slice(-10), ...picked];
    return picked;
  }

  function _getAnswer(idx) {
    const qt = ALL_QUESTIONS[idx];
    if (!qt) return '—';
    try { return qt.fn(); }
    catch(e) { return 'No tengo datos suficientes ahora mismo.'; }
  }

  /* Ordena tips por urgencia (deuda > emergency > diversif > educación) */
  function _prioritizeTips(tips) {
    const PRIORITY_KEYWORDS = ['deuda','interés','hipoteca','emergencia','concentrad','€0','cero','parad'];
    return tips.slice().sort(function(a,b) {
      var sa = PRIORITY_KEYWORDS.filter(function(k){ return a.toLowerCase().includes(k); }).length;
      var sb = PRIORITY_KEYWORDS.filter(function(k){ return b.toLowerCase().includes(k); }).length;
      return sb - sa;
    });
  }

  /* Genera preguntas contextuales basadas en el estado real de S */
  function _getContextualQs() {
    var qs = [];
    var totalDebt = (S.debts||[]).reduce(function(a,d){ return a+(d.balance||0); }, 0);
    var holdings  = Object.keys(S.portfolio||{}).filter(function(k){ return (S.portfolio[k].shares||0) > 0; });
    var mods      = (S.completedMods||[]).length;
    var firePct   = Math.round((S.patrimony||0) / Math.max(1,(S.lifeSalary||1800)*0.6*12*25)*100);
    var cash      = S.cash||0;
    var savRate   = (S.lifeSalary||0) > 0 ? Math.round((S.monthlyContribution||0)/(S.lifeSalary||1)*100) : 0;
    // Context-specific first
    if (totalDebt > 0)       qs.push({ q: '¿Cómo ataco mi deuda de ' + Math.round(totalDebt).toLocaleString('es') + '€?', fn: function(){ return _getAnswer(ALL_QUESTIONS.findIndex(function(x){ return x.q.includes('deuda'); })); } });
    if (holdings.length > 0) qs.push({ q: '¿Está bien diversificada mi cartera de ' + holdings.join(', ') + '?', fn: function(){ return _getAnswer(ALL_QUESTIONS.findIndex(function(x){ return x.q.includes('inversión'); })); } });
    if (cash > 5000)         qs.push({ q: '¿Qué hago con los ' + Math.round(cash).toLocaleString('es') + '€ que tengo parados?', fn: function(){ return 'Con ' + Math.round(cash).toLocaleString('es') + '€ en cash podrías invertir en ETFs o reforzar el fondo de emergencia primero.'; } });
    if (savRate < 15)        qs.push({ q: '¿Cómo subo mi tasa de ahorro del ' + savRate + '%?', fn: function(){ return _getAnswer(ALL_QUESTIONS.findIndex(function(x){ return x.q.includes('ahorrando'); })); } });
    if (firePct < 100)       qs.push({ q: '¿Cuánto me falta para el FIRE? Voy por el ' + firePct + '%', fn: function(){ return _getAnswer(ALL_QUESTIONS.findIndex(function(x){ return x.q.includes('FIRE'); })); } });
    if (mods < 5)            qs.push({ q: '¿Qué módulo debería completar ahora?', fn: function(){ return 'Con ' + mods + ' módulos completados, el siguiente es clave. El interés compuesto y la diversificación son los más impactantes.'; } });
    // Fill with ALL_QUESTIONS if needed
    var fallbackIdxs = _getRandomQs(Math.max(0, 5 - qs.length));
    fallbackIdxs.forEach(function(i) { qs.push({ q: ALL_QUESTIONS[i].q, fn: function(){ return _getAnswer(i); }, _idx: i }); });
    return qs.slice(0, 5);
  }


  /* Detecta la situación del jugador */
  function _detectSituation() {
    const streak   = S.streak || 0;
    const weekXP   = S.weeklySnapshot?.current?.xp || 0;
    const highDebt = (S.debts||[]).filter(d=>(d.rate||0)>=15);
    const firePct  = (S.lifeSalary||0) > 0
      ? Math.round((S.patrimony||0) / ((S.lifeSalary||1800)*0.6*12*25) * 100) : 0;
    if (streak >= 7 && weekXP >= 100 && firePct >= 30) return 'thriving';
    if (highDebt.length > 0 || streak === 0) return 'struggling';
    return 'neutral';
  }

  /* Genera un plan de 3 acciones concretas para esta semana */
  function _buildWeeklyPlan() {
    const plan    = [];
    const sal     = S.lifeSalary || 1800;
    const mc      = S.monthlyContribution || 0;
    const cash    = S.cash || 0;
    const invested = S.invested || 0;
    const highDebt = (S.debts||[]).filter(d=>(d.rate||0)>=15);
    const mods     = (S.completedMods||[]).length;
    const streak   = S.streak || 0;
    const mExp     = Math.round(sal * 0.5);
    const firePct  = sal > 0 ? Math.round((S.patrimony||0) / (sal*0.6*12*25) * 100) : 0;
    const wMods    = S.weeklySnapshot?.current?.mods || 0;

    // Acción 1 — más urgente
    if (highDebt.length > 0) {
      const w = [...highDebt].sort((a,b)=>b.rate-a.rate)[0];
      plan.push(`💳 Esta semana: pon €${Math.min(Math.round(cash*0.1)||50,500).toLocaleString('es')} extra en deuda ${w.name||'cara'} (${w.rate}% TAE) — retorno garantizado.`);
    } else if (cash < mExp * 3) {
      plan.push(`🛡️ Esta semana: transfiere €${Math.min(Math.round(cash*0.05)||50,300).toLocaleString('es')} a cuenta de ahorro para el fondo de emergencia.`);
    } else if (mc === 0) {
      plan.push(`📈 Esta semana: configura una aportación automática al broker — aunque sean €${Math.max(50,Math.round(sal*0.1)).toLocaleString('es')}/mes.`);
    } else {
      plan.push(`📈 Esta semana: confirma que tu aportación de €${mc.toLocaleString('es')}/mes está programada.`);
    }

    // Acción 2 — educación
    if (wMods < 2) {
      const nextMod = typeof MODULES !== 'undefined' ? MODULES.find(m=>!(S.completedMods||[]).includes(m.id)) : null;
      plan.push(`🎓 Esta semana: completa ${2-wMods} módulo${2-wMods>1?'s':''}${nextMod?` — empieza con "${nextMod.title}"`:''}.`);
    } else {
      plan.push(`✅ Educación OK: ${wMods} módulo${wMods>1?'s':''} completados esta semana.`);
    }

    // Acción 3 — según estado FIRE y racha
    if (firePct >= 80)
      plan.push(`🔥 Esta semana: revisa si tu asignación de activos es óptima para la fase final del FIRE.`);
    else if (streak < 3)
      plan.push(`🔥 Esta semana: mantén 3 días seguidos de actividad — cada racha empieza con el primer día.`);
    else if (invested > 0)
      plan.push(`📊 Esta semana: revisa tu cartera — ¿algún activo se ha desviado >10% del objetivo?`);
    else
      plan.push(`🚀 Esta semana: abre cuenta en un broker low-cost. Trade Republic y DeGiro: proceso online de 10 min.`);

    return plan;
  }

  function _typewrite(el, text, speed=11) {
    el.textContent = '';
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) el.textContent += text[i++];
      else clearInterval(iv);
    }, speed);
  }

  function _renderQButtons(qIndices) {
    const wrap = document.getElementById('coach-q-wrap');
    if (!wrap) return;
    wrap.innerHTML = '';
    qIndices.forEach(idx => {
      const btn = document.createElement('button');
      btn.className = 'coach-q-btn';
      btn.textContent = ALL_QUESTIONS[idx].q;
      btn.dataset.idx = idx;
      wrap.appendChild(btn);
    });
  }

  function askQuestion() {
    if (!isPremium()) { PM_showPaywall('coach'); return; }
    let modal = document.getElementById('m-coach');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'm-coach';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const tips      = _prioritizeTips(_analyze()); // ordenados por urgencia
    const totalDebt = (S.debts||[]).reduce((a,d)=>a+(d.balance||0),0);
    const healthScore = typeof calcHealthScore === 'function' ? calcHealthScore() : 0;
    const savRate   = (S.lifeSalary||0) > 0 ? Math.round(((S.monthlyContribution||0)/(S.lifeSalary||1))*100) : 0;
    const firePct   = Math.round((S.patrimony||0)/Math.max(1,(S.lifeSalary||1800)*0.6*12*25)*100);

    // Top 3 insights prioritizados
    const insights = tips.slice(0,3);

    const plan = _buildWeeklyPlan();
    modal.innerHTML =
      '<div class="modal-box coach-modal-box">' +
        '<button class="modal-close" onclick="document.getElementById(\'m-coach\').style.display=\'none\'">✕</button>' +

        // Header
        '<div class="coach-modal-header">' +
          '<div class="coach-modal-avatar">🤖</div>' +
          '<div style="flex:1">' +
            '<div class="coach-modal-title">FinAI Coach</div>' +
            '<div class="coach-modal-sub">' + (_getApiKey() ? '🟢 IA activa · respuestas reales' : '⚪ Modo análisis local · <a href="#" onclick="AI_COACH.openSettings()" style="color:var(--accent);">Activar IA real →</a>') + '</div>' +
          '</div>' +
          '<button class="coach-settings-btn" onclick="AI_COACH.openSettings()" title="Configurar IA">⚙️</button>' +
          '<button style="background:none;border:none;color:rgba(255,255,255,.4);font-size:18px;cursor:pointer;padding:4px 6px;line-height:1;flex-shrink:0;" onclick="document.getElementById(\'m-coach\').style.display=\'none\'">✕</button>' +
        '</div>' +

        // Stats bar
        '<div class="coach-stats-bar">' +
          '<div class="coach-stat-pill"><span class="coach-stat-icon">💰</span><span>€' + _fmt(S.patrimony||0) + '</span></div>' +
          '<div class="coach-stat-pill"><span class="coach-stat-icon">💚</span><span>' + healthScore + '/100</span></div>' +
          '<div class="coach-stat-pill"><span class="coach-stat-icon">📈</span><span>' + firePct + '% FIRE</span></div>' +
          '<div class="coach-stat-pill"><span class="coach-stat-icon">🔥</span><span>' + (S.streak||0) + 'd racha</span></div>' +
        '</div>' +

        // Insights prioritizados (top 3)
        '<div class="coach-insights-wrap" id="coach-insights-wrap">' +
          '<div class="coach-section-lbl">💡 Tus insights de ahora</div>' +
          insights.map(function(tip, i) {
            return '<div class="coach-insight-row" data-tip="' + i + '">' +
              '<div class="coach-insight-num">' + (i+1) + '</div>' +
              '<div class="coach-insight-text">' + tip + '</div>' +
            '</div>';
          }).join('') +
        '</div>' +

        // Plan semanal
        (plan.length > 0 ? (
          '<div class="coach-section-lbl" style="margin-top:14px;">📋 Tu plan para esta semana</div>' +
          '<div class="coach-plan-wrap">' +
          plan.map(function(p,i){
            return '<div class="coach-plan-row"><div class="coach-plan-num">'+(i+1)+'</div><div class="coach-plan-text">'+p+'</div></div>';
          }).join('') +
          '</div>'
        ) : '') +

        // Preguntas contextuales
        '<div class="coach-section-lbl" style="margin-top:14px;">🎯 Pregúntame algo concreto</div>' +
        '<div id="coach-q-wrap" class="coach-q-wrap"></div>' +

        // Free text input
        '<div class="coach-input-row">' +
          '<input id="coach-free-input" class="coach-free-input" type="text" placeholder="Escribe tu pregunta aquí..." maxlength="200"/>' +
          '<button class="coach-send-btn" id="coach-send-btn">↑</button>' +
        '</div>' +

        // Response area
        '<div id="coach-response" class="coach-response-area" style="display:none;">' +
          '<div class="coach-resp-label">💬 FinAI responde</div>' +
          '<div id="coach-ans-text"></div>' +
        '</div>' +
      '</div>';

    modal.style.display = 'flex';

    // Render contextual question buttons
    _renderContextualQButtons();

    // Question button click
    const wrap = document.getElementById('coach-q-wrap');
    if (wrap) {
      wrap.addEventListener('click', function(e) {
        const btn = e.target.closest('.coach-q-btn');
        if (!btn) return;
        _handleCoachQuestion(btn.dataset.question, btn.dataset.static || '');
        SFX?.xp?.(); HAPTIC?.light?.();
      });
    }

    // Free text send
    const sendBtn = document.getElementById('coach-send-btn');
    const input   = document.getElementById('coach-free-input');
    function _doSend() {
      const q = (input?.value || '').trim();
      if (!q) return;
      input.value = '';
      _handleCoachQuestion(q, null);
    }
    if (sendBtn) sendBtn.addEventListener('click', _doSend);
    if (input)   input.addEventListener('keydown', function(e) { if (e.key === 'Enter') _doSend(); });

    // Insight row click → expand
    const insWrap = document.getElementById('coach-insights-wrap');
    if (insWrap) {
      insWrap.addEventListener('click', function(e) {
        const row = e.target.closest('.coach-insight-row');
        if (!row) return;
        const i   = parseInt(row.dataset.tip, 10);
        const tip = insights[i];
        if (tip) _handleCoachQuestion(tip, tip);
      });
    }
  }

  function _renderContextualQButtons() {
    const wrap = document.getElementById('coach-q-wrap');
    if (!wrap) return;
    const ctxQs = _getContextualQs();
    wrap.innerHTML = '';
    ctxQs.forEach(function(cq) {
      const btn = document.createElement('button');
      btn.className = 'coach-q-btn';
      btn.textContent = cq.q;
      btn.dataset.question = cq.q;
      const sta = (function(){ try { return cq.fn(); } catch(e){ return ''; } })();
      btn.dataset.static = sta;
      wrap.appendChild(btn);
    });
  }

  function _handleCoachQuestion(question, staticFallback) {
    const respEl = document.getElementById('coach-response');
    const ansEl  = document.getElementById('coach-ans-text');
    if (!respEl || !ansEl) return;
    respEl.style.display = 'block';
    ansEl.textContent = '⏳ Analizando…';
    const fallback = staticFallback || _analyze()[0] || 'Revisa tu situación financiera y actúa hoy.';
    fetchFinAIResponse(question, fallback).then(function(answer) {
      _typewrite(ansEl, answer);
    });
    // Scroll into view
    setTimeout(function() { respEl.scrollIntoView({ behavior:'smooth', block:'nearest' }); }, 100);
  }

  function _answerQ(idx) {
    const ansEl = document.getElementById('coach-ans-text');
    if (ansEl) _typewrite(ansEl, _getAnswer(idx));
  }

  function sendQ(customQuestion) {
    if (!customQuestion) return;
    if (document.getElementById('m-coach')?.style.display !== 'flex') {
      AI_COACH.askQuestion();
      setTimeout(function() { _handleCoachQuestion(customQuestion, null); }, 300);
    } else {
      _handleCoachQuestion(customQuestion, null);
    }
  }

  function openSettings() {
    let modal = document.getElementById('m-coach-settings');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'm-coach-settings';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }
    const curKey  = localStorage.getItem('finai_api_key') || '';
    const curProv = localStorage.getItem('finai_api_provider') || 'anthropic';
    modal.innerHTML = `
      <div class="modal-box coach-settings-box">
        <button class="modal-close" onclick="closeModal('m-coach-settings')">✕</button>
        <div class="cs-header">
          <div class="cs-icon">🤖</div>
          <div>
            <div class="cs-title">Configurar FinAI</div>
            <div class="cs-sub">Conecta tu propia API para respuestas reales</div>
          </div>
        </div>

        <div class="cs-provider-row">
          <label class="cs-label">Proveedor de IA</label>
          <div class="cs-provider-btns" id="cs-provider-btns">
            ${['anthropic','deepseek','openai'].map(p => `
              <button class="cs-prov-btn${curProv===p?' cs-prov-active':''}" onclick="document.querySelectorAll('.cs-prov-btn').forEach(b=>b.classList.remove('cs-prov-active'));this.classList.add('cs-prov-active');document.getElementById('cs-key-input').placeholder=AI_COACH._keyPlaceholder('${p}');document.getElementById('cs-api-link').href=AI_COACH._apiLink('${p}');document.getElementById('cs-api-link').textContent='Obtener clave de '+AI_COACH._provName('${p}');this.dataset.sel='1';" data-prov="${p}">
                ${{anthropic:'🟣 Claude (Anthropic)',deepseek:'🔵 DeepSeek (barato)',openai:'🟢 ChatGPT (OpenAI)'}[p]}
              </button>`).join('')}
          </div>
        </div>

        <div class="cs-field">
          <label class="cs-label">API Key</label>
          <input id="cs-key-input" class="cs-input" type="password"
            value="${curKey}"
            placeholder="${_keyPlaceholder(curProv)}"/>
          <div class="cs-key-hint">Tu clave se guarda solo en este dispositivo. Nunca sale al exterior.</div>
        </div>

        <a id="cs-api-link" class="cs-link" href="${_apiLink(curProv)}" target="_blank" rel="noopener">
          Obtener clave de ${_provName(curProv)} →
        </a>

        <div class="cs-cost-note">
          💡 <strong>Coste estimado:</strong> Claude Sonnet ~$0,003/respuesta · DeepSeek ~$0,0003/respuesta · GPT-4o-mini ~$0,0002/respuesta
        </div>

        <div class="cs-actions">
          <button class="btn btn-primary" onclick="AI_COACH.saveSettings()">💾 Guardar y activar</button>
          ${curKey ? `<button class="btn btn-ghost" onclick="AI_COACH.clearSettings()">🗑️ Borrar key</button>` : ''}
        </div>
        <div id="cs-feedback" style="margin-top:10px;font-size:.82rem;text-align:center;"></div>
      </div>`;
    openModal('m-coach-settings');
  }

  function _keyPlaceholder(prov) {
    return {anthropic:'sk-ant-api03-…', deepseek:'sk-…', openai:'sk-…'}[prov] || 'sk-…';
  }
  function _apiLink(prov) {
    return {anthropic:'https://console.anthropic.com/keys', deepseek:'https://platform.deepseek.com/api_keys', openai:'https://platform.openai.com/api-keys'}[prov] || '#';
  }
  function _provName(prov) {
    return {anthropic:'Anthropic', deepseek:'DeepSeek', openai:'OpenAI'}[prov] || prov;
  }

  function saveSettings() {
    const key    = (document.getElementById('cs-key-input')?.value || '').trim();
    const active = document.querySelector('.cs-prov-btn.cs-prov-active');
    const prov   = active?.dataset?.prov || 'anthropic';
    const fb     = document.getElementById('cs-feedback');

    if (!key) { if (fb) fb.textContent = '⚠️ Introduce una API key válida.'; return; }
    if (!key.startsWith('sk-')) { if (fb) { fb.style.color = 'var(--loss)'; fb.textContent = '⚠️ La key debe empezar por sk-'; } return; }

    localStorage.setItem('finai_api_key', key);
    localStorage.setItem('finai_api_provider', prov);
    if (fb) { fb.style.color = 'var(--gain)'; fb.textContent = '✅ FinAI activado con ' + _provName(prov) + ' · Cierra y vuelve a abrir el coach'; }
    SFX?.xp?.();
    setTimeout(() => closeModal('m-coach-settings'), 1800);
  }

  function clearSettings() {
    localStorage.removeItem('finai_api_key');
    localStorage.removeItem('finai_api_provider');
    closeModal('m-coach-settings');
    toast('🗑️ API key eliminada', 'FinAI vuelve al modo análisis local.', 't-warn');
  }

  return { proactiveCheck, askQuestion, sendQ, _answerQ, _renderQButtons, _analyze, fetchFinAIResponse, openSettings, saveSettings, clearSettings, _keyPlaceholder, _apiLink, _provName };
})();



/* ══════════════════════════════════════════════════════════════════
   PORTFOLIO DONUT CHART — Composición de cartera en tiempo real
   ─────────────────────────────────────────────────────────────────
   · Gráfico tipo donut con Chart.js
   · Colores neón sobre fondo oscuro (terminal de trading)
   · Muestra % de cada activo + valor total en el centro
   · Se actualiza en tiempo real con los precios
══════════════════════════════════════════════════════════════════ */

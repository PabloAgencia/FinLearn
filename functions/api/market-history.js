// GET /api/market-history?symbol=AAPL&range=1mo
// Cloudflare Pages Function — historial de cierre diario para mini-chart
// Devuelve { ok: true, closes: [123.4, 125.6, ...], timestamps: [...] }

export async function onRequest(context) {
  const url    = new URL(context.request.url);
  const symbol = url.searchParams.get('symbol') || '';
  const range  = url.searchParams.get('range')  || '1mo';
  if (!symbol) return json({ ok: false, error: 'No symbol' }, 400);

  const yahooUrl =
    'https://query1.finance.yahoo.com/v8/finance/chart/' +
    encodeURIComponent(symbol) +
    '?interval=1d&range=' + encodeURIComponent(range);

  try {
    const resp = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });
    if (!resp.ok) return json({ ok: false, error: 'Yahoo error ' + resp.status }, 502);

    const raw = await resp.json();
    const result = raw?.chart?.result?.[0];
    if (!result) return json({ ok: false, error: 'No data' }, 404);

    const closes     = result.indicators?.quote?.[0]?.close ?? [];
    const timestamps = result.timestamp ?? [];
    const clean      = closes.map(v => v != null ? +v.toFixed(4) : null).filter(v => v !== null);

    return json({ ok: true, closes: clean, timestamps }, 200, 3600); // cache 1h
  } catch (e) {
    return json({ ok: false, error: String(e) }, 502);
  }
}

function json(body, status = 200, maxAge = 0) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      ...(maxAge > 0 ? { 'Cache-Control': `public, max-age=${maxAge}` } : {}),
    },
  });
}

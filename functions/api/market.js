// GET /api/market?symbols=AAPL,MSFT,BTC-USD
// Cloudflare Pages Function — proxy a Yahoo Finance para evitar CORS
// Devuelve { ok: true, data: { "AAPL": { price, changePct, prevClose, high, low, volume } } }

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const symbols = url.searchParams.get('symbols') || '';
  if (!symbols) return json({ ok: false, error: 'No symbols' }, 400);

  const yahooUrl =
    'https://query1.finance.yahoo.com/v7/finance/quote?symbols=' +
    encodeURIComponent(symbols) +
    '&fields=regularMarketPrice,regularMarketChangePercent,regularMarketPreviousClose,' +
    'regularMarketDayHigh,regularMarketDayLow,regularMarketVolume';

  try {
    const resp = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    });
    if (!resp.ok) return json({ ok: false, error: 'Yahoo error ' + resp.status }, 502);

    const raw = await resp.json();
    const results = raw?.quoteResponse?.result || [];
    const data = {};
    results.forEach(q => {
      if (!q.symbol) return;
      data[q.symbol] = {
        price:     q.regularMarketPrice           ?? null,
        changePct: q.regularMarketChangePercent   ?? 0,
        prevClose: q.regularMarketPreviousClose   ?? null,
        high:      q.regularMarketDayHigh         ?? null,
        low:       q.regularMarketDayLow          ?? null,
        volume:    q.regularMarketVolume          ?? null,
      };
    });

    return json({ ok: true, data }, 200, 900); // cache 15 min
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

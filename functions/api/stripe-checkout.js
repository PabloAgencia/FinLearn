// POST /api/stripe-checkout — Crea sesión de pago Stripe
// Cloudflare Pages Function — env.STRIPE_SECRET_KEY

export async function onRequestPost(context) {
  const { request, env } = context;
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { priceId, userId, userEmail } = body || {};
  if (!priceId) return json({ error: 'No priceId' }, 400);

  // Llamada directa a la API de Stripe (compatible con Cloudflare Workers edge runtime)
  const params = new URLSearchParams({
    mode: 'subscription',
    'payment_method_types[0]': 'card',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    success_url: 'https://finlearn.app/?premium=1&session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'https://finlearn.app/?cancelled=1',
    'metadata[userId]': userId || '',
  });
  if (userEmail) params.set('customer_email', userEmail);

  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    const data = await res.json();
    if (!res.ok) return json({ error: data.error?.message || 'Stripe error' }, 500);
    return json({ url: data.url });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
}

export async function onRequest(context) {
  if (context.request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  return onRequestPost(context);
}

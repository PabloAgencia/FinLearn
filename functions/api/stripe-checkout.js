export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return new Response(null, { status: 405 });

  let priceId, userId, userEmail;
  try {
    ({ priceId, userId, userEmail } = await request.json());
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  if (!priceId) return json({ error: 'No priceId' }, 400);

  const origin = new URL(request.url).origin;

  const params = new URLSearchParams({
    mode: 'subscription',
    'payment_method_types[]': 'card',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    success_url: `${origin}/?premium=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/?cancelled=1`,
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
    return json({ error: e.message }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

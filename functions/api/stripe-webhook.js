// POST /api/stripe-webhook — Webhook de Stripe para activar Premium
// Cloudflare Pages Function — env.STRIPE_SECRET_KEY, env.STRIPE_WEBHOOK_SECRET, env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY

export async function onRequestPost(context) {
  const { request, env } = context;
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

  const rawBody = await request.text();
  const sig     = request.headers.get('stripe-signature');

  // Verificar firma del webhook usando la Web Crypto API (compatible con Cloudflare Workers)
  let event;
  try {
    event = await verifyStripeWebhook(rawBody, sig, env.STRIPE_WEBHOOK_SECRET || '');
  } catch (e) {
    return json({ error: 'Webhook error: ' + e.message }, 400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId  = session.metadata?.userId;
    if (userId && env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
      try {
        // Leer estado actual
        const r = await fetch(`${env.SUPABASE_URL}/rest/v1/user_state?user_id=eq.${userId}&select=state`, {
          headers: { apikey: env.SUPABASE_SERVICE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}` },
        });
        const rows = await r.json();
        const currentState = rows?.[0]?.state || {};
        // Actualizar con _premium: '1'
        await fetch(`${env.SUPABASE_URL}/rest/v1/user_state`, {
          method: 'POST',
          headers: {
            apikey: env.SUPABASE_SERVICE_KEY,
            Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify({ user_id: userId, state: { ...currentState, _premium: '1' }, updated_at: new Date().toISOString() }),
        });
      } catch (e) {
        console.error('Supabase error:', e);
      }
    }
  }

  return json({ received: true });
}

// Verificación HMAC-SHA256 nativa (sin depender de la SDK de Stripe)
async function verifyStripeWebhook(payload, sigHeader, secret) {
  if (!sigHeader) throw new Error('Missing stripe-signature');
  const parts     = Object.fromEntries(sigHeader.split(',').map(p => p.split('=')));
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) throw new Error('Invalid signature header');

  const enc     = new TextEncoder();
  const key     = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signed  = await crypto.subtle.sign('HMAC', key, enc.encode(`${timestamp}.${payload}`));
  const expected = Array.from(new Uint8Array(signed)).map(b => b.toString(16).padStart(2, '0')).join('');

  if (expected !== signature) throw new Error('Signature mismatch');
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp)) > 300) throw new Error('Timestamp too old');

  return JSON.parse(payload);
}

export async function onRequest(context) {
  if (context.request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  return onRequestPost(context);
}

// POST /api/push-subscribe — Guarda suscripción Web Push
// Cloudflare Pages Function — env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY

export async function onRequestPost(context) {
  const { request, env } = context;
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { subscription, userId } = body || {};
  if (!subscription?.endpoint) return json({ error: 'Missing subscription' }, 400);

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) return json({ ok: true });

  try {
    const r = await fetch(`${env.SUPABASE_URL}/rest/v1/push_subscriptions`, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ user_id: userId || 'anonymous', subscription: JSON.stringify(subscription), updated_at: new Date().toISOString() }),
    });
    if (!r.ok) return json({ error: await r.text() }, 500);
    return json({ ok: true });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
}

export async function onRequest(context) {
  if (context.request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  return onRequestPost(context);
}

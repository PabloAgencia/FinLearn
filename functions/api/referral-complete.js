// POST /api/referral-complete — Registra referido completado
// Cloudflare Pages Function — env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY

export async function onRequestPost(context) {
  const { request, env } = context;
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { referrerCode, newUserCode } = body || {};
  if (!referrerCode) return json({ error: 'Missing referrerCode' }, 400);

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_KEY) return json({ ok: true, bonus: 0 });

  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/referrals`, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=ignore-duplicates',
      },
      body: JSON.stringify({ referrer_code: referrerCode.toUpperCase(), new_user_code: newUserCode || '', completed_at: new Date().toISOString() }),
    });
    return json({ ok: true, xpBonus: 500 });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
}

export async function onRequest(context) {
  if (context.request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  return onRequestPost(context);
}

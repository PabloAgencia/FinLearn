export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return new Response(null, { status: 405 });

  const rawBody = await request.text();
  const sigHeader = request.headers.get('stripe-signature') || '';

  let event;
  try {
    event = await verifyStripeSignature(rawBody, sigHeader, env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    return json({ error: 'Webhook error: ' + e.message }, 400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    if (userId) await updatePremium(userId, env);
  }

  return json({ received: true });
}

async function verifyStripeSignature(payload, sigHeader, secret) {
  let timestamp = '';
  const signatures = [];
  for (const part of sigHeader.split(',')) {
    const eq = part.indexOf('=');
    const k = part.slice(0, eq);
    const v = part.slice(eq + 1);
    if (k === 't') timestamp = v;
    else if (k === 'v1') signatures.push(v);
  }
  if (!timestamp || signatures.length === 0) throw new Error('Invalid signature header');
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) throw new Error('Timestamp too old');

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBytes = await crypto.subtle.sign(
    'HMAC', key,
    new TextEncoder().encode(`${timestamp}.${payload}`)
  );
  const expected = Array.from(new Uint8Array(sigBytes))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  if (!signatures.includes(expected)) throw new Error('Signature mismatch');
  return JSON.parse(payload);
}

async function updatePremium(userId, env) {
  const base = `${env.SUPABASE_URL}/rest/v1/user_state`;
  const headers = {
    apikey: env.SUPABASE_ANON_KEY,
    Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };

  const getRes = await fetch(
    `${base}?user_id=eq.${encodeURIComponent(userId)}&select=state`,
    { headers }
  );
  const rows = await getRes.json();
  const currentState = (Array.isArray(rows) && rows[0]?.state) || {};

  await fetch(base, {
    method: 'POST',
    headers: { ...headers, Prefer: 'resolution=merge-duplicates' },
    body: JSON.stringify({
      user_id: userId,
      state: { ...currentState, _premium: '1' },
      updated_at: new Date().toISOString(),
    }),
  });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

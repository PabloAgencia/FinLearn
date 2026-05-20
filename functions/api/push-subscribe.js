// POST /api/push-subscribe — Saves a Web Push subscription for a user
// Body: { subscription: PushSubscriptionJSON, userId: string }
// Stores in Supabase table `push_subscriptions(user_id, subscription, updated_at)`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { subscription, userId } = body || {};
  if (!subscription?.endpoint) return res.status(400).json({ error: 'Missing subscription' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    // Supabase not configured — accept silently (dev mode)
    return res.status(200).json({ ok: true });
  }

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        user_id:      userId || 'anonymous',
        subscription: JSON.stringify(subscription),
        updated_at:   new Date().toISOString(),
      }),
    });
    if (!r.ok) {
      const err = await r.text();
      return res.status(500).json({ error: err });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}

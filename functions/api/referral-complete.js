// POST /api/referral-complete — Registra un referido completado y bonifica al referidor
// Body: { referrerCode: string, newUserCode: string }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const { referrerCode, newUserCode } = body || {};
  if (!referrerCode) return res.status(400).json({ error: 'Missing referrerCode' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(200).json({ ok: true, bonus: 0 });
  }

  try {
    // Registrar el referido en la tabla referrals
    await fetch(`${SUPABASE_URL}/rest/v1/referrals`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=ignore-duplicates',
      },
      body: JSON.stringify({
        referrer_code: referrerCode.toUpperCase(),
        new_user_code: newUserCode || '',
        completed_at:  new Date().toISOString(),
      }),
    });

    return res.status(200).json({ ok: true, xpBonus: 500 });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}

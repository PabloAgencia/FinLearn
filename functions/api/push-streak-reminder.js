// GET /api/push-streak-reminder — Cron job (20:00 UTC diario)
// Envía notificaciones push a usuarios con racha activa que no han abierto la app hoy.
// Requiere: SUPABASE_URL, SUPABASE_SERVICE_KEY, VAPID_PUBLIC, VAPID_PRIVATE, VAPID_SUBJECT

import webpush from 'web-push';

export default async function handler(req, res) {
  // Vercel Cron llama con GET + cabecera Authorization
  const auth = req.headers['authorization'];
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!SUPABASE_URL || !SUPABASE_KEY) return res.status(200).json({ skipped: true });

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:hola@finlearn.app',
    process.env.VAPID_PUBLIC,
    process.env.VAPID_PRIVATE,
  );

  // Obtener todas las suscripciones activas
  const r = await fetch(`${SUPABASE_URL}/rest/v1/push_subscriptions?select=*`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!r.ok) return res.status(500).json({ error: await r.text() });

  const rows = await r.json();
  let sent = 0;
  let failed = 0;

  await Promise.all(rows.map(async row => {
    try {
      const sub = JSON.parse(row.subscription);
      await webpush.sendNotification(sub, JSON.stringify({
        title: '🔥 FinLearn — Tu racha',
        body:  '¡No rompas tu racha hoy! 1 minuto es suficiente.',
        tag:   'streak-daily',
        url:   'https://finlearn.app/',
      }));
      sent++;
    } catch {
      failed++;
    }
  }));

  return res.status(200).json({ sent, failed, total: rows.length });
}

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import webpush from "npm:web-push";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    webpush.setVapidDetails(
      Deno.env.get("VAPID_SUBJECT")!,
      Deno.env.get("VAPID_PUBLIC_KEY")!,
      Deno.env.get("VAPID_PRIVATE_KEY")!
    );

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const body = await req.json().catch(() => ({}));
    const title   = body.title   || "FinLearn 💡";
    const message = body.message || "¡Tu pregunta del día te espera! Responde y mantén tu racha.";

    // Si se pasa user_id solo notifica a ese usuario, si no a todos
    let query = supabase.from("push_subscriptions").select("*");
    if (body.user_id) query = query.eq("user_id", body.user_id);

    const { data: subs, error } = await query;
    if (error) throw error;

    const payload = JSON.stringify({
      title,
      body: message,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-72.png",
      url: "/"
    });

    const results = await Promise.allSettled(
      subs.map(s =>
        webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload
        )
      )
    );

    // Eliminar suscripciones caducadas (410 Gone)
    const expired = subs.filter((_, i) => {
      const r = results[i];
      return r.status === "rejected" && r.reason?.statusCode === 410;
    });
    if (expired.length > 0) {
      await supabase
        .from("push_subscriptions")
        .delete()
        .in("endpoint", expired.map(s => s.endpoint));
    }

    const sent   = results.filter(r => r.status === "fulfilled").length;
    const failed = results.filter(r => r.status === "rejected").length;

    return new Response(
      JSON.stringify({ sent, failed, total: subs.length }),
      { headers: { ...cors, "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } }
    );
  }
});

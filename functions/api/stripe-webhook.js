import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    httpClient: Stripe.createFetchHttpClient(),
  });

  const rawBody = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Webhook error: ' + e.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    if (userId) {
      const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
      try {
        const { data: existing } = await supabase
          .from('user_state')
          .select('state')
          .eq('user_id', userId)
          .single();
        const currentState = existing?.state || {};
        await supabase
          .from('user_state')
          .upsert({
            user_id: userId,
            state: { ...currentState, _premium: '1' },
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
      } catch (e) {
        console.error('Supabase error:', e);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

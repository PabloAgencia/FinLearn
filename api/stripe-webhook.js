import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  'https://qurxeuqoprcjstipvfcb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1cnhldXFvcHJjanN0aXB2ZmNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MjcwMTMsImV4cCI6MjA5MTUwMzAxM30.h1wUJzYM2J_bgezlb9zRa456ezDA81LNcAExp3ILLL8'
);

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (e) {
    return res.status(400).json({ error: 'Webhook error: ' + e.message });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    if (userId) {
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
      } catch(e) {
        console.error('Supabase error:', e);
      }
    }
  }

  res.status(200).json({ received: true });
}

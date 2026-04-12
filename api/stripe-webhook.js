import Stripe from 'stripe');

const stripe = new Stripe('sk_test_51TLSb4Qn1UY1PTsHCH9mT7XXakNhg2wfDM1nu5zXPPtVzq4vrvlC9hjlDdsFdIHfFPxF6VwPsig8IRv8Cz32w92r009OzeWFs0');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (e) {
    return res.status(400).json({ error: 'Webhook error: ' + e.message });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Payment success:', session.customer_email, session.metadata?.userId);
    // Aquí conectaremos con Supabase para marcar premium
  }

  res.status(200).json({ received: true });
}
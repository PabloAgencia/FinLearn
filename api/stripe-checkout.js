import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { priceId, userId, userEmail } = req.body;
  if (!priceId) return res.status(400).json({ error: 'No priceId' });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://finlearn.app/?premium=1&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://finlearn.app/?cancelled=1',
      customer_email: userEmail || undefined,
      metadata: { userId: userId || '' },
    });
    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
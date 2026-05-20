// POST /api/coach — FinAI Coach usando Groq (llama-3.3-70b-versatile)
// Cloudflare Pages Function — env.GROQ_API_KEY

export async function onRequestPost(context) {
  const { request, env } = context;
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { question, context: userContext } = body || {};
  if (!question) return json({ error: 'No question' }, 400);
  if (!env.GROQ_API_KEY) return json({ error: 'Coach no disponible', text: 'El coach no está configurado en este momento.' }, 503);

  const systemPrompt = `Eres FinAI, el coach financiero personal dentro de FinLearn. Responde SIEMPRE en español, de forma concisa (máximo 3 frases), práctica y personalizada según el contexto del usuario. No uses markdown, solo texto plano.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 200,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: `Contexto del usuario:\n${userContext || 'Sin contexto'}\n\nPregunta: ${question}` },
        ],
      }),
    });

    const data = await res.json();
    if (!res.ok) return json({ error: data.error?.message || 'Groq error', text: 'El coach no está disponible ahora mismo.' }, 500);

    const text = data.choices?.[0]?.message?.content?.trim() || 'No pude generar una respuesta.';
    return json({ text });
  } catch (e) {
    return json({ error: String(e), text: 'El coach no está disponible ahora mismo.' }, 500);
  }
}

export async function onRequest(context) {
  if (context.request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  return onRequestPost(context);
}

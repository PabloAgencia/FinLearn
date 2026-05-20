// POST /api/coach — FinAI Coach usando Gemini 1.5 Flash
// Cloudflare Pages Function — env.GEMINI_API_KEY

export async function onRequestPost(context) {
  const { request, env } = context;
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Invalid JSON' }, 400); }

  const { question, context: userContext } = body || {};
  if (!question) return json({ error: 'No question' }, 400);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text:
            `Eres FinAI, un coach financiero personal dentro de FinLearn. Responde en español, de forma concisa (máximo 3 frases), práctica y personalizada.\n\nContexto del usuario:\n${userContext || 'Sin contexto'}\n\nPregunta: ${question}`
          }] }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
        }),
      }
    );
    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar una respuesta.';
    return json({ text });
  } catch (e) {
    return json({ error: 'Error del servidor', text: 'El coach no está disponible ahora mismo.' }, 500);
  }
}

export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  return onRequestPost(context);
}

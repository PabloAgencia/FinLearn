export async function onRequest({ request, env }) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let question, context;
  try {
    ({ question, context } = await request.json());
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!question) {
    return new Response(JSON.stringify({ error: 'No question' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Eres FinAI, un coach financiero personal dentro de FinLearn. Responde en español, de forma concisa (máximo 3 frases), práctica y personalizada.\n\nContexto del usuario:\n${context || 'Sin contexto'}\n\nPregunta: ${question}`,
            }],
          }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      const errMsg = data.error?.message || JSON.stringify(data);
      return new Response(JSON.stringify({ text: `Error Gemini: ${errMsg}` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar una respuesta.';
    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: 'Error del servidor', text: 'El coach no está disponible ahora mismo.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

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
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: 'Eres FinAI, un coach financiero personal dentro de FinLearn. Responde en español, de forma concisa (máximo 3 frases), práctica y personalizada.',
            },
            {
              role: 'user',
              content: `Contexto del usuario:\n${context || 'Sin contexto'}\n\nPregunta: ${question}`,
            },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      const errMsg = data.error?.message || JSON.stringify(data);
      return new Response(JSON.stringify({ text: `Error del coach: ${errMsg}` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const text = data.choices?.[0]?.message?.content || 'No pude generar una respuesta.';
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

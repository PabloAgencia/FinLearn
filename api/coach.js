export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, context } = req.body;
  if (!question) return res.status(400).json({ error: 'No question' });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Eres FinAI, un coach financiero personal dentro de FinLearn. Responde en español, de forma concisa (máximo 3 frases), práctica y personalizada.\n\nContexto del usuario:\n${context || 'Sin contexto'}\n\nPregunta: ${question}`
            }]
          }],
          generationConfig: { maxOutputTokens: 200, temperature: 0.7 }
        })
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude generar una respuesta.';
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: 'Error del servidor', text: 'El coach no está disponible ahora mismo.' });
  }
}
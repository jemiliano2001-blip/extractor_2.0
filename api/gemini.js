// Este código se ejecuta en un servidor, no en el navegador.

export default async function handler(request, response) {
  // 1. Solo permitir peticiones POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Obtener el 'prompt' que envió el frontend
  const { prompt } = request.body;
  if (!prompt) {
    return response.status(400).json({ error: 'Prompt is required' });
  }

  // 3. Obtener la API Key de forma segura desde las "Environment Variables" del servidor.
  //    NUNCA la escribas directamente aquí.
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: 'API key not configured on server' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    // 4. Llamar a la API de Google desde el servidor
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      console.error('Google API Error:', errorData);
      return response.status(geminiResponse.status).json({ error: 'Failed to fetch data from Google API' });
    }
    
    // 5. Enviar la respuesta de vuelta al frontend
    const data = await geminiResponse.json();
    response.status(200).json(data);

  } catch (error) {
    console.error('Internal Server Error:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
}
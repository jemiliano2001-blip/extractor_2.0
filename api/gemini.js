// Importa el SDK de Google Generative AI
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Exporta la función serverless de Vercel
export default async function handler(req, res) {
  // 1. Configuración de seguridad y método
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // 2. Obtener la clave de API de las variables de entorno
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "La variable de entorno GEMINI_API_KEY no está configurada." });
  }

  // 3. Obtener el prompt del cuerpo de la petición
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "No se proporcionó un 'prompt' en el cuerpo de la solicitud." });
  }

  try {
    // 4. Inicializar el modelo de IA de Google
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // VERSIÓN FINAL: Usando el modelo más reciente "flash" y forzando la salida a JSON
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash-latest",
        generationConfig: { responseMimeType: "application/json" }
    });

    // 5. Generar contenido y obtener la respuesta
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 6. Enviar la respuesta de vuelta al cliente
    res.status(200).json({ text: text });

  } catch (error) {
    // 7. Manejo de errores mejorado para dar más detalles
    console.error("Error al llamar a la API de Gemini:", error);
    res.status(500).json({ error: `Error en la función del servidor: ${error.message}` });
  }
}





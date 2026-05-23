import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { config } from 'dotenv';

config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for generating travel itinerary
  app.post('/api/generate-itinerary', async (req, res) => {
    try {
      const { destination, days, budget, tripType, geminiApiKey } = req.body;

      if (!destination || !days || !budget || !tripType) {
        return res.status(400).json({ error: 'Faltan parámetros requeridos.' });
      }

      const apiKey = geminiApiKey || process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: 'La API de Gemini no está configurada.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      
       const prompt = `Eres un Agente de Viajes Experto y un planificador de itinerarios hiper-personalizados.
Tu objetivo es generar planes de viaje optimizados, realistas y detallados basados en el destino humano.

Detalles Solicitados:
- Destino: ${destination}
- Días: ${days} 
- Presupuesto: ${budget}
- Tipo de Viaje: ${tripType}

REGLAS ESTRICTAS:
1. Genera un itinerario agrupado por días (del 1 al ${days}). 
2. Para cada día, proporciona exactamente: Mañana, Almuerzo (incluyendo comida local o restaurantes acordes), Tarde, y Noche.
3. Adaptación al Presupuesto de nivel '${budget}' y Tipo de Viaje '${tripType}':
   - Presupuesto Bajo: Parques, museos gratuitos, transporte público, comida callejera/mercados locales.
   - Presupuesto Medio: Mezcla de atracciones pagas con libres, transporte mixto, restaurantes moderados.
   - Presupuesto Alto: Tours privados, experiencias exclusivas, cenas de alta cocina / Michelin, traslados privados.
   - Aventura: Actividades físicas, exploración, naturaleza.
   - Familiar: Actividades para niños, ritmo más relajado, fácil acceso.
   - Relajación: Spa, playas, paseos tranquilos, evitar sobrecargar el día.
4. Realismo Geográfico: Agrupa actividades por cercanía.
5. Al final, proporciona exactamente 3 tips esenciales del destino: el mejor medio de transporte a usar, zonas seguras para alojarse o transitar, y una estafa común a evitar.`;

      // Define the strict structured output schema
      const schema = {
        type: Type.OBJECT,
        properties: {
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayNumber: { type: Type.INTEGER, description: 'Día número (ej. 1)' },
                morning: { type: Type.STRING, description: 'Actividades de la mañana' },
                lunch: { type: Type.STRING, description: 'Recomendaciones y comida local para el almuerzo' },
                afternoon: { type: Type.STRING, description: 'Actividades de la tarde' },
                night: { type: Type.STRING, description: 'Actividades de la noche' },
              },
              required: ['dayNumber', 'morning', 'lunch', 'afternoon', 'night'],
            },
          },
          tips: {
            type: Type.OBJECT,
            properties: {
              transport: { type: Type.STRING, description: 'Mejor medio de transporte local' },
              safeZones: { type: Type.STRING, description: 'Zonas seguras' },
              commonScam: { type: Type.STRING, description: 'Estafa común o trampa para turistas a evitar' },
            },
            required: ['transport', 'safeZones', 'commonScam'],
          },
        },
        required: ['days', 'tips'],
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0.7,
        },
      });

      const responseText = response.text || '';
      const parsedData = JSON.parse(responseText);

      res.json(parsedData);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      res.status(500).json({ error: 'Hubo un error al generar tu itinerario. Intenta de nuevo.' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // In Express v4 (as per package.json), we use '*' 
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);

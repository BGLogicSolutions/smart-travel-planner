import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { config } from 'dotenv';
import rateLimit from 'express-rate-limit';

config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '1mb' }));

  // Rate limiter para la API (100 peticiones por IP cada 15 minutos)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' }
  });
  app.use('/api/', limiter);

  // API Route for generating travel itinerary
  app.post('/api/generate-itinerary', async (req, res) => {
    try {
      const { destination, days, budget, tripType, geminiApiKey } = req.body;

      // Validación Zod
      const { z } = await import('zod');
      const schema = z.object({
        destination: z.string().min(1, 'Destino requerido').max(100),
        days: z.number().int().positive('Días debe ser positivo'),
        budget: z.enum(['bajo', 'medio', 'alto']),
        tripType: z.enum(['Aventura', 'Familiar', 'Relajación'])
      });
      schema.parse({ destination, days, budget, tripType });

      const apiKey = geminiApiKey || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'API key de Gemini no configurada' });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Eres un Agente de Viajes Experto...
      (mismo prompt original, ya corregido)`;

      const schemaOutput = {
        type: Type.OBJECT,
        properties: {
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayNumber: { type: Type.INTEGER },
                morning: { type: Type.STRING },
                lunch: { type: Type.STRING },
                afternoon: { type: Type.STRING },
                night: { type: Type.STRING },
              },
              required: ['dayNumber', 'morning', 'lunch', 'afternoon', 'night'],
            },
          },
          tips: {
            type: Type.OBJECT,
            properties: {
              transport: { type: Type.STRING },
              safeZones: { type: Type.STRING },
              commonScam: { type: Type.STRING },
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
          responseSchema: schemaOutput,
          temperature: 0.7,
        },
      });

      // --- CORRECCIÓN CRÍTICA ---
      const text = response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        return res.status(500).json({ error: 'No se pudo obtener respuesta de la IA' });
      }
      const parsedData = JSON.parse(text);

      res.json(parsedData);
    } catch (error: any) {
      console.error('Error generating itinerary:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Datos inválidos', details: error.errors });
      }
      res.status(500).json({ error: 'Error interno al generar itinerario' });
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);

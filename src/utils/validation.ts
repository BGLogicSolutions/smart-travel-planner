import { z } from 'zod';

export const travelRequestSchema = z.object({
  destination: z.string().min(1).max(100),
  days: z.number().int().positive(),
  budget: z.enum(['bajo', 'medio', 'alto']),
  tripType: z.enum(['Aventura', 'Familiar', 'Relajación'])
});

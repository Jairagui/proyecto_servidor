import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z.string().min(1, 'es obligatorio'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET '),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('Variables de entorno inválidas (revisa .env.example:');
  parsed.error.issues.forEach((i) => console.error(`- ${i.path.join('.')}: ${i.message}`));
  process.exit(1);
}

export const env = parsed.data;

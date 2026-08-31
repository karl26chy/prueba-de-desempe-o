import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Esquema centralizado: falla rápido si faltan variables obligatorias
const envSchema = z
  .object({
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DB_HOST: z.string().min(1).default('localhost'),
    DB_PORT: z.coerce.number().int().min(1).max(65535).default(5432),
    DB_NAME: z.string().min(1).default('app_db'),
    DB_USER: z.string().min(1).default('postgres'),
    DB_PASSWORD: z.string().min(1).default('postgres'),
    DB_DIALECT: z.enum(['postgres']).default('postgres'),
    JWT_SECRET: z.string().min(1).default('supersecret_jwt_key_change_me'),
    JWT_REFRESH_SECRET: z.string().min(1).default('superrefresh_secret_change_me'),
    JWT_EXPIRES_IN: z.string().min(1).default('15m'),
    JWT_REFRESH_EXPIRES_IN: z.string().min(1).default('7d'),
    CORS_ORIGIN: z.string().min(1).default('*'),
    // URL base para Swagger sin hardcodear localhost
    API_URL: z.string().url().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === 'production') {
      const insecure = ['supersecret_jwt_key_change_me', 'superrefresh_secret_change_me', 'change_me'];
      const isInsecure = (v: string) => insecure.some((s) => v.includes(s)) || v.length < 32;
      if (isInsecure(data.JWT_SECRET)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['JWT_SECRET'],
          message: 'JWT_SECRET must be set to a secure value (>=32 chars) in production',
        });
      }
      if (isInsecure(data.JWT_REFRESH_SECRET)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['JWT_REFRESH_SECRET'],
          message: 'JWT_REFRESH_SECRET must be set to a secure value (>=32 chars) in production',
        });
      }
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

const p = parsed.data;

export const env = {
  port: p.PORT,
  nodeEnv: p.NODE_ENV,
  db: {
    host: p.DB_HOST,
    port: p.DB_PORT,
    name: p.DB_NAME,
    user: p.DB_USER,
    password: p.DB_PASSWORD,
    dialect: p.DB_DIALECT,
  },
  jwt: {
    secret: p.JWT_SECRET,
    refreshSecret: p.JWT_REFRESH_SECRET,
    expiresIn: p.JWT_EXPIRES_IN,
    refreshExpiresIn: p.JWT_REFRESH_EXPIRES_IN,
  },
  corsOrigin: p.CORS_ORIGIN,
  apiUrl: p.API_URL || `http://localhost:${p.PORT}`,
};

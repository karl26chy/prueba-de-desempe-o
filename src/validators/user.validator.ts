import { z } from 'zod';

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    role: z.enum(['user', 'admin']).optional(),
  }),
  params: z.object({
    id: z.string().uuid('ID debe ser UUID'),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID debe ser UUID'),
  }),
});

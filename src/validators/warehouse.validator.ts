import { z } from 'zod';

export const createWarehouseSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Nombre mínimo 2 caracteres').max(100),
    location: z.string().min(1, 'Ubicación requerida').max(200),
  }),
});

export const updateWarehouseSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Nombre mínimo 2 caracteres').max(100).optional(),
    location: z.string().min(1, 'Ubicación requerida').max(200).optional(),
  }),
  params: z.object({
    id: z.string().uuid('ID debe ser UUID'),
  }),
});

export const warehouseIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID debe ser UUID'),
  }),
});

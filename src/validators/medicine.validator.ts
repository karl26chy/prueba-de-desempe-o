import { z } from 'zod';

export const createMedicineSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Nombre mínimo 2 caracteres').max(100),
    description: z.string().min(1, 'Descripción requerida').max(200),
    unit: z.string().min(1, 'Unidad requerida').max(50),
  }),
});

export const updateMedicineSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Nombre mínimo 2 caracteres').max(100).optional(),
    description: z.string().min(1, 'Descripción requerida').max(200).optional(),
    unit: z.string().min(1, 'Unidad requerida').max(50).optional(),
  }),
  params: z.object({
    id: z.string().uuid('ID debe ser UUID'),
  }),
});

export const medicineIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID debe ser UUID'),
  }),
});

import { z } from 'zod';

export const createClinicSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Nombre mínimo 2 caracteres').max(100),
    nit: z.string().min(1, 'NIT requerido').max(50),
    address: z.string().min(1, 'Dirección requerida').max(200),
    phone: z.string().min(1, 'Teléfono requerido').max(50),
  }),
});

export const updateClinicSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Nombre mínimo 2 caracteres').max(100).optional(),
    nit: z.string().min(1, 'NIT requerido').max(50).optional(),
    address: z.string().min(1, 'Dirección requerida').max(200).optional(),
    phone: z.string().min(1, 'Teléfono requerido').max(50).optional(),
  }),
  params: z.object({
    id: z.string().uuid('ID debe ser UUID'),
  }),
});

export const clinicIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID debe ser UUID'),
  }),
});

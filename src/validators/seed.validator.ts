import { z } from 'zod';

const userSeedSchema = z
  .object({
    id: z.string().uuid('ID debe ser UUID').optional(),
    name: z.string().min(2, 'Nombre mínimo 2 caracteres').max(100),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Password mínimo 6 caracteres').max(100),
    role: z.enum(['ADMIN', 'GESTOR_SOLICITUDES']).optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

const clinicSeedSchema = z
  .object({
    id: z.string().uuid('ID debe ser UUID').optional(),
    name: z.string().min(2, 'Nombre mínimo 2 caracteres').max(100),
    nit: z.string().min(1, 'NIT requerido').max(50),
    address: z.string().min(1, 'Dirección requerida').max(200),
    phone: z.string().min(1, 'Teléfono requerido').max(50),
    isActive: z.boolean().optional(),
  })
  .strict();

const warehouseSeedSchema = z
  .object({
    id: z.string().uuid('ID debe ser UUID').optional(),
    name: z.string().min(2, 'Nombre mínimo 2 caracteres').max(100),
    location: z.string().min(1, 'Ubicación requerida').max(200),
    isActive: z.boolean().optional(),
  })
  .strict();

const medicineSeedSchema = z
  .object({
    id: z.string().uuid('ID debe ser UUID').optional(),
    name: z.string().min(2, 'Nombre mínimo 2 caracteres').max(100),
    description: z.string().min(1, 'Descripción requerida').max(200),
    unit: z.string().min(1, 'Unidad requerida').max(50),
    isActive: z.boolean().optional(),
  })
  .strict();

export const seedFileSchema = z
  .object({
    users: z.array(userSeedSchema).max(500, 'Máximo 500 usuarios').optional(),
    clinics: z.array(clinicSeedSchema).max(500, 'Máximo 500 clínicas').optional(),
    warehouses: z.array(warehouseSeedSchema).max(500, 'Máximo 500 almacenes').optional(),
    medicines: z.array(medicineSeedSchema).max(500, 'Máximo 500 medicamentos').optional(),
  })
  .strict()
  .refine((data) => !!(data.users || data.clinics || data.warehouses || data.medicines), {
    message: 'Debe proporcionar al menos una de: users, clinics, warehouses, medicines',
  });

export type SeedFileInput = z.infer<typeof seedFileSchema>;
export type UserSeedInput = z.infer<typeof userSeedSchema>;
export type ClinicSeedInput = z.infer<typeof clinicSeedSchema>;
export type WarehouseSeedInput = z.infer<typeof warehouseSeedSchema>;
export type MedicineSeedInput = z.infer<typeof medicineSeedSchema>;

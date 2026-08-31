import { z } from 'zod';

export const createInventorySchema = z.object({
  body: z
    .object({
      warehouseId: z.string().uuid('warehouseId debe ser UUID'),
      medicineId: z.string().uuid('medicineId debe ser UUID'),
      quantity: z.number().int('quantity debe ser entero').min(0, 'quantity no puede ser negativa'),
    })
    .strict(),
});

export const updateInventorySchema = z.object({
  body: z
    .object({
      quantity: z.number().int('quantity debe ser entero').min(0, 'quantity no puede ser negativa').optional(),
    })
    .strict(),
  params: z.object({
    id: z.string().uuid('ID debe ser UUID'),
  }),
});

export const inventoryIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID debe ser UUID'),
  }),
});

import { z } from 'zod';
import { SUPPLY_REQUEST_STATUSES } from '../models/supply-request.model';

export const createSupplyRequestSchema = z.object({
  body: z
    .object({
      clinicId: z.string().uuid('clinicId debe ser UUID'),
      medicineId: z.string().uuid('medicineId debe ser UUID'),
      warehouseId: z.string().uuid('warehouseId debe ser UUID').nullable().optional(),
      quantity: z.number().int('quantity debe ser entero').min(1, 'quantity debe ser mayor que 0'),
    })
    .strict(),
});

export const updateSupplyRequestSchema = z.object({
  body: z
    .object({
      status: z.enum(SUPPLY_REQUEST_STATUSES).optional(),
      warehouseId: z.string().uuid('warehouseId debe ser UUID').nullable().optional(),
      quantity: z.number().int('quantity debe ser entero').min(1, 'quantity debe ser mayor que 0').optional(),
    })
    .strict(),
  params: z.object({
    id: z.string().uuid('ID debe ser UUID'),
  }),
});

export const supplyRequestIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID debe ser UUID'),
  }),
});

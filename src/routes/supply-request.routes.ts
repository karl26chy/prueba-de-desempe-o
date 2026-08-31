import { Router } from 'express';
import { supplyRequestController } from '../controllers/supply-request.controller';
import { authenticate, authorize, AuthRequest } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createSupplyRequestSchema,
  updateSupplyRequestSchema,
  supplyRequestIdParamSchema,
} from '../validators/supply-request.validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: SupplyRequests
 *   description: Gestión de solicitudes de suministro (ADMIN)
 */

/**
 * @swagger
 * /api/supply-requests:
 *   post:
 *     summary: Crear solicitud de suministro
 *     tags: [SupplyRequests]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clinicId, medicineId, quantity]
 *             properties:
 *               clinicId: { type: string, format: uuid }
 *               medicineId: { type: string, format: uuid }
 *               warehouseId: { type: string, format: uuid }
 *               quantity: { type: integer, minimum: 1 }
 *     responses:
 *       201: { description: Solicitud creada }
 *       404: { description: Clínica/medicamento/almacén no encontrado }
 */
router.post(
  '/',
  authorize('ADMIN'),
  validate(createSupplyRequestSchema),
  (req, res, next) => supplyRequestController.create(req as AuthRequest, res, next)
);

/**
 * @swagger
 * /api/supply-requests:
 *   get:
 *     summary: Listar solicitudes
 *     tags: [SupplyRequests]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de solicitudes }
 */
router.get('/', authorize('ADMIN'), (req, res, next) => supplyRequestController.getAll(req, res, next));

/**
 * @swagger
 * /api/supply-requests/{id}:
 *   get:
 *     summary: Obtener solicitud por ID
 *     tags: [SupplyRequests]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Solicitud }
 *       404: { description: No encontrada }
 */
router.get(
  '/:id',
  authorize('ADMIN'),
  validate(supplyRequestIdParamSchema),
  (req, res, next) => supplyRequestController.getById(req, res, next)
);

/**
 * @swagger
 * /api/supply-requests/{id}:
 *   put:
 *     summary: Actualizar solicitud
 *     tags: [SupplyRequests]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status: { type: string, enum: [PENDING, APPROVED, REJECTED, DELIVERED] }
 *               warehouseId: { type: string, format: uuid }
 *               quantity: { type: integer, minimum: 1 }
 *     responses:
 *       200: { description: Solicitud actualizada }
 */
router.put(
  '/:id',
  authorize('ADMIN'),
  validate(updateSupplyRequestSchema),
  (req, res, next) => supplyRequestController.update(req, res, next)
);

/**
 * @swagger
 * /api/supply-requests/{id}:
 *   delete:
 *     summary: Eliminar solicitud
 *     tags: [SupplyRequests]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Solicitud eliminada }
 */
router.delete(
  '/:id',
  authorize('ADMIN'),
  validate(supplyRequestIdParamSchema),
  (req, res, next) => supplyRequestController.delete(req, res, next)
);

export default router;

import { Router } from 'express';
import { inventoryController } from '../controllers/inventory.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createInventorySchema, updateInventorySchema, inventoryIdParamSchema } from '../validators/inventory.validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Inventories
 *   description: Gestión de inventario (ADMIN)
 */

/**
 * @swagger
 * /api/inventories:
 *   post:
 *     summary: Crear registro de inventario
 *     tags: [Inventories]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [warehouseId, medicineId, quantity]
 *             properties:
 *               warehouseId: { type: string, format: uuid }
 *               medicineId: { type: string, format: uuid }
 *               quantity: { type: integer, minimum: 0 }
 *     responses:
 *       201: { description: Inventario creado }
 *       409: { description: Inventario ya existe }
 */
router.post('/', authorize('ADMIN'), validate(createInventorySchema), (req, res, next) => inventoryController.create(req, res, next));

/**
 * @swagger
 * /api/inventories:
 *   get:
 *     summary: Listar inventarios
 *     tags: [Inventories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de inventarios }
 */
router.get('/', authorize('ADMIN'), (req, res, next) => inventoryController.getAll(req, res, next));

/**
 * @swagger
 * /api/inventories/{id}:
 *   get:
 *     summary: Obtener inventario por ID
 *     tags: [Inventories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Inventario }
 *       404: { description: No encontrado }
 */
router.get('/:id', authorize('ADMIN'), validate(inventoryIdParamSchema), (req, res, next) => inventoryController.getById(req, res, next));

/**
 * @swagger
 * /api/inventories/{id}:
 *   put:
 *     summary: Actualizar cantidad de inventario
 *     tags: [Inventories]
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
 *               quantity: { type: integer, minimum: 0 }
 *     responses:
 *       200: { description: Inventario actualizado }
 */
router.put('/:id', authorize('ADMIN'), validate(updateInventorySchema), (req, res, next) => inventoryController.update(req, res, next));

/**
 * @swagger
 * /api/inventories/{id}:
 *   delete:
 *     summary: Eliminar inventario (físico)
 *     tags: [Inventories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Inventario eliminado }
 */
router.delete('/:id', authorize('ADMIN'), validate(inventoryIdParamSchema), (req, res, next) => inventoryController.delete(req, res, next));

export default router;

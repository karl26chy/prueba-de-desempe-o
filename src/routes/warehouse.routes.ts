import { Router } from 'express';
import { warehouseController } from '../controllers/warehouse.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createWarehouseSchema, updateWarehouseSchema, warehouseIdParamSchema } from '../validators/warehouse.validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Warehouses
 *   description: CRUD almacenes (ADMIN)
 */

/**
 * @swagger
 * /api/warehouses:
 *   post:
 *     summary: Crear almacén
 *     tags: [Warehouses]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, location]
 *             properties:
 *               name: { type: string }
 *               location: { type: string }
 *     responses:
 *       201: { description: Almacén creado }
 *       400: { description: Validación fallida }
 *       401: { description: No autenticado }
 *       403: { description: No autorizado }
 */
router.post('/', authorize('ADMIN'), validate(createWarehouseSchema), (req, res, next) => warehouseController.create(req, res, next));

/**
 * @swagger
 * /api/warehouses:
 *   get:
 *     summary: Listar almacenes activos
 *     tags: [Warehouses]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de almacenes }
 *       401: { description: No autenticado }
 *       403: { description: No autorizado }
 */
router.get('/', authorize('ADMIN'), (req, res, next) => warehouseController.getAll(req, res, next));

/**
 * @swagger
 * /api/warehouses/{id}:
 *   get:
 *     summary: Obtener almacén por ID
 *     tags: [Warehouses]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Almacén }
 *       400: { description: UUID inválido }
 *       401: { description: No autenticado }
 *       403: { description: No autorizado }
 *       404: { description: No encontrado }
 */
router.get('/:id', authorize('ADMIN'), validate(warehouseIdParamSchema), (req, res, next) => warehouseController.getById(req, res, next));

/**
 * @swagger
 * /api/warehouses/{id}:
 *   put:
 *     summary: Actualizar almacén
 *     tags: [Warehouses]
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
 *               name: { type: string }
 *               location: { type: string }
 *     responses:
 *       200: { description: Almacén actualizado }
 *       400: { description: Validación fallida }
 *       401: { description: No autenticado }
 *       403: { description: No autorizado }
 *       404: { description: No encontrado }
 */
router.put('/:id', authorize('ADMIN'), validate(updateWarehouseSchema), (req, res, next) => warehouseController.update(req, res, next));

/**
 * @swagger
 * /api/warehouses/{id}:
 *   delete:
 *     summary: Desactivar almacén (baja lógica)
 *     tags: [Warehouses]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Almacén desactivado }
 *       400: { description: UUID inválido }
 *       401: { description: No autenticado }
 *       403: { description: No autorizado }
 *       404: { description: No encontrado }
 */
router.delete('/:id', authorize('ADMIN'), validate(warehouseIdParamSchema), (req, res, next) => warehouseController.delete(req, res, next));

export default router;

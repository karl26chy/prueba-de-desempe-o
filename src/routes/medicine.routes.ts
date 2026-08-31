import { Router } from 'express';
import { medicineController } from '../controllers/medicine.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createMedicineSchema, updateMedicineSchema, medicineIdParamSchema } from '../validators/medicine.validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Medicines
 *   description: CRUD medicamentos (ADMIN)
 */

/**
 * @swagger
 * /api/medicines:
 *   post:
 *     summary: Crear medicamento
 *     tags: [Medicines]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, unit]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               unit: { type: string }
 *     responses:
 *       201: { description: Medicamento creado }
 *       409: { description: Medicamento ya registrado }
 */
router.post('/', authorize('ADMIN'), validate(createMedicineSchema), (req, res, next) => medicineController.create(req, res, next));

/**
 * @swagger
 * /api/medicines:
 *   get:
 *     summary: Listar medicamentos activos
 *     tags: [Medicines]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de medicamentos }
 */
router.get('/', authorize('ADMIN'), (req, res, next) => medicineController.getAll(req, res, next));

/**
 * @swagger
 * /api/medicines/{id}:
 *   get:
 *     summary: Obtener medicamento por ID
 *     tags: [Medicines]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Medicamento }
 *       404: { description: No encontrado }
 */
router.get('/:id', authorize('ADMIN'), validate(medicineIdParamSchema), (req, res, next) => medicineController.getById(req, res, next));

/**
 * @swagger
 * /api/medicines/{id}:
 *   put:
 *     summary: Actualizar medicamento
 *     tags: [Medicines]
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
 *               description: { type: string }
 *               unit: { type: string }
 *     responses:
 *       200: { description: Medicamento actualizado }
 *       409: { description: Medicamento ya registrado }
 */
router.put('/:id', authorize('ADMIN'), validate(updateMedicineSchema), (req, res, next) => medicineController.update(req, res, next));

/**
 * @swagger
 * /api/medicines/{id}:
 *   delete:
 *     summary: Desactivar medicamento (baja lógica)
 *     tags: [Medicines]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Medicamento desactivado }
 */
router.delete('/:id', authorize('ADMIN'), validate(medicineIdParamSchema), (req, res, next) => medicineController.delete(req, res, next));

export default router;

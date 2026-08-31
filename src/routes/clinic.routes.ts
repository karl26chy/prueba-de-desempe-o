import { Router } from 'express';
import { clinicController } from '../controllers/clinic.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createClinicSchema, updateClinicSchema, clinicIdParamSchema } from '../validators/clinic.validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Clinics
 *   description: CRUD clínicas (ADMIN)
 */

/**
 * @swagger
 * /api/clinics:
 *   post:
 *     summary: Crear clínica
 *     tags: [Clinics]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, nit, address, phone]
 *             properties:
 *               name: { type: string }
 *               nit: { type: string }
 *               address: { type: string }
 *               phone: { type: string }
 *     responses:
 *       201: { description: Clínica creada }
 *       409: { description: NIT ya registrado }
 */
router.post('/', authorize('ADMIN'), validate(createClinicSchema), (req, res, next) => clinicController.create(req, res, next));

/**
 * @swagger
 * /api/clinics:
 *   get:
 *     summary: Listar clínicas activas
 *     tags: [Clinics]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de clínicas }
 */
router.get('/', authorize('ADMIN'), (req, res, next) => clinicController.getAll(req, res, next));

/**
 * @swagger
 * /api/clinics/{id}:
 *   get:
 *     summary: Obtener clínica por ID
 *     tags: [Clinics]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Clínica }
 *       404: { description: No encontrada }
 */
router.get('/:id', authorize('ADMIN'), validate(clinicIdParamSchema), (req, res, next) => clinicController.getById(req, res, next));

/**
 * @swagger
 * /api/clinics/{id}:
 *   put:
 *     summary: Actualizar clínica
 *     tags: [Clinics]
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
 *               nit: { type: string }
 *               address: { type: string }
 *               phone: { type: string }
 *     responses:
 *       200: { description: Clínica actualizada }
 *       409: { description: NIT ya registrado }
 */
router.put('/:id', authorize('ADMIN'), validate(updateClinicSchema), (req, res, next) => clinicController.update(req, res, next));

/**
 * @swagger
 * /api/clinics/{id}:
 *   delete:
 *     summary: Desactivar clínica (baja lógica)
 *     tags: [Clinics]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Clínica desactivada }
 */
router.delete('/:id', authorize('ADMIN'), validate(clinicIdParamSchema), (req, res, next) => clinicController.delete(req, res, next));

export default router;

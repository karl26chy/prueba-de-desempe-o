import { Router } from 'express';
import { upload } from '../middlewares/upload.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { seedController } from '../controllers/seed.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Seed
 *   description: Seeder mediante JSON + Multer (ADMIN)
 */

/**
 * @swagger
 * /api/seed/import:
 *   post:
 *     summary: Importar datos iniciales desde JSON (ADMIN)
 *     tags: [Seed]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Archivo JSON con users, clinics, warehouses, medicines (max 2MB)
 *     responses:
 *       201: { description: Datos importados correctamente }
 *       400: { description: Archivo requerido / JSON malformado / validación }
 *       401: { description: No autenticado }
 *       403: { description: No autorizado }
 *       409: { description: Duplicado (email/nit/name) }
 */
router.post(
  '/import',
  upload.single('file'),
  authenticate,
  authorize('ADMIN'),
  (req, res, next) => seedController.import(req, res, next)
);

export default router;

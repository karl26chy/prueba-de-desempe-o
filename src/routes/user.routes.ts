import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateUserSchema, userIdParamSchema } from '../validators/user.validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: CRUD usuarios (protegido)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de usuarios }
 */
router.get('/', authorize('ADMIN'), (req, res, next) => userController.getAll(req, res, next));

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Usuario }
 *       404: { description: No encontrado }
 */
router.get('/:id', validate(userIdParamSchema), (req, res, next) => userController.getById(req, res, next));

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar usuario (admin o self - simplificado a auth general)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               role: { type: string, enum: [user, admin] }
 *     responses:
 *       200: { description: Usuario actualizado }
 */
router.put('/:id', validate(updateUserSchema), authorize('ADMIN'), (req, res, next) => userController.update(req, res, next));

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar usuario (solo admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Eliminado }
 *       403: { description: No autorizado }
 */
router.delete('/:id', validate(userIdParamSchema), authorize('ADMIN'), (req, res, next) => userController.delete(req, res, next));

export default router;

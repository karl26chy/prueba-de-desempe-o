import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema, refreshSchema } from '../validators/auth.validator';
import { authenticate, AuthRequest } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y JWT
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: Carlos }
 *               email: { type: string, example: carlos@test.com }
 *               password: { type: string, example: 123456 }
 *               role: { type: string, enum: [ADMIN, GESTOR_SOLICITUDES], example: GESTOR_SOLICITUDES }
 *     responses:
 *       201: { description: Usuario creado }
 *       409: { description: Email ya registrado }
 */
router.post('/register', validate(registerSchema), (req, res, next) => authController.register(req, res, next));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login y obtención de tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: carlos@test.com }
 *               password: { type: string, example: 123456 }
 *     responses:
 *       200: { description: Login exitoso }
 *       401: { description: Credenciales inválidas }
 */
router.post('/login', validate(loginSchema), (req, res, next) => authController.login(req, res, next));

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renovar accessToken con refreshToken
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: Tokens renovados }
 */
router.post('/refresh', validate(refreshSchema), (req, res, next) => authController.refresh(req, res, next));

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Perfil }
 *       401: { description: No autenticado }
 */
router.get('/me', authenticate, (req, res, next) => authController.me(req as AuthRequest, res, next));

export default router;

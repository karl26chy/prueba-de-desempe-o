import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import clinicRoutes from './clinic.routes';
import warehouseRoutes from './warehouse.routes';
import medicineRoutes from './medicine.routes';
import inventoryRoutes from './inventory.routes';
import supplyRequestRoutes from './supply-request.routes';
import seedRoutes from './seed.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clinics', clinicRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/medicines', medicineRoutes);
router.use('/inventories', inventoryRoutes);
router.use('/supply-requests', supplyRequestRoutes);
router.use('/seed', seedRoutes);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Healthcheck
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: ok }
 *                 timestamp: { type: string, format: date-time }
 */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;

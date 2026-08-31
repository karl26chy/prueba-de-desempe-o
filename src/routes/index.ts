import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import clinicRoutes from './clinic.routes';
import warehouseRoutes from './warehouse.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clinics', clinicRoutes);
router.use('/warehouses', warehouseRoutes);

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;

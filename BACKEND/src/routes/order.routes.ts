import { Router } from 'express';
import * as ctrl from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, ctrl.create);
router.get('/my-orders', authenticate, ctrl.myOrders);
router.get('/', authenticate, authorize('admin'), ctrl.listAll); // solo admin

export default router;

import { Router } from 'express';
import * as ctrl from '../controllers/order.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, ctrl.create);
router.get('/my-orders', authenticate, ctrl.myOrders);

export default router;

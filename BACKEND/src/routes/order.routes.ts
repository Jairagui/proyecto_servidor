import { Router } from 'express';
import * as ctrl from '../controllers/order.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/my-orders', authenticate, ctrl.myOrders);
router.post('/', authenticate, ctrl.create);

export default router;

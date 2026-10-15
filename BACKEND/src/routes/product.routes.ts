import { Router } from 'express';
import * as ctrl from '../controllers/product.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', ctrl.list);                       // público
router.get('/:id', ctrl.get);                     // público
router.post('/', authenticate, ctrl.create);      // requiere JWT (roles: siguiente entrega)

export default router;

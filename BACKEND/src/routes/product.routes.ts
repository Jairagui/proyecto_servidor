import { Router } from 'express';
import * as ctrl from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', ctrl.list);                       // público
router.get('/:id', ctrl.get);                     // público
router.post('/', authenticate, authorize('admin'), ctrl.create);      // requiere JWT y rol admin
router.put('/:id', authenticate, authorize('admin'), ctrl.update);    // solo admin
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove); // solo admin

export default router;

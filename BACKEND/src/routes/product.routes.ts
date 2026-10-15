import { Router } from 'express';
import * as ctrl from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Lectura pública. OJO: /filter y /max-price van antes de /:id
router.get('/', ctrl.list);
router.get('/filter', ctrl.filter);
router.get('/max-price', ctrl.maxPrice);
router.get('/:id', ctrl.get);

// Escritura: solo admin
router.post('/', authenticate, authorize('admin'), ctrl.create);
router.put('/:id', authenticate, authorize('admin'), ctrl.update);
router.delete('/:id', authenticate, authorize('admin'), ctrl.remove);

export default router;

import { Router } from 'express';
import * as ctrl from '../controllers/user.controller';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', authenticate, ctrl.me);
router.get('/', authenticate, authorize('admin'), ctrl.list);                 // solo admin
router.patch('/:id/role', authenticate, authorize('admin'), ctrl.changeRole); // solo admin

export default router;

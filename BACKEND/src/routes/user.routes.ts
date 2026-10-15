import { Router } from 'express';
import * as ctrl from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/', ctrl.register);
router.post('/login', ctrl.login);
router.get('/me', authenticate, ctrl.me);

export default router;

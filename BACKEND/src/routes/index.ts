import { Router } from 'express';
import userRoutes from './user.routes';

const api = Router();

api.get('/health', (_req, res) => res.json({ status: 'ok' }));
api.use('/users', userRoutes);

export default api;

import { Router } from 'express';
import userRoutes from './user.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';

const api = Router();

api.get('/health', (_req, res) => res.json({ status: 'ok' }));
api.use('/users', userRoutes);
api.use('/products', productRoutes);
api.use('/orders', orderRoutes);

export default api;

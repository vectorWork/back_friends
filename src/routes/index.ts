import { Router } from 'express';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import productRoutes from './product.routes';
import authRoutes from './auth.routes';
import ProductoComandaRoutes from './productoComanda.routes';
import ComandaRoutes from './comanda.routes';
const router = Router();

router.use('/meseros', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/auth', authRoutes);
router.use('/producto_comanda', ProductoComandaRoutes);
router.use('/comanda', ComandaRoutes);

export default router;

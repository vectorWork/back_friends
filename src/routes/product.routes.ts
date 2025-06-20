import { Router } from 'express';
import {
  createProduct, 
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from '../controllers/product.controller.js';

const router = Router();

router.post('/products', createProduct);
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProductById);
router.delete('/products/:id', deleteProductById);

export default router;
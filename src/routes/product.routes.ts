import { Router } from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
} from '../controllers/product.controller';

const router = Router();

router.post('/create', createProduct);
router.get('/get/:id', getAllProducts);
router.get('/getById/:id', getProductById);
router.put('/update/:id', updateProductById);
router.delete('/delete/:id', deleteProductById);

export default router;

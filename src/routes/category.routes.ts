import { Router } from 'express';
import {
  createCategory, 
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} from '../controllers/category.controller';

const router = Router();

router.post('/categories', createCategory);
router.get('/categories', getAllCategories);
router.get('/categories/:id', getCategoryById);
router.put('/categories/:id', updateCategoryById);
router.delete('/categories/:id', deleteCategoryById);

export default router;
import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} from '../controllers/category.controller';

const router = Router();

router.post('/create', createCategory);
router.get('/getCategories', getAllCategories);
router.get('/getById/:id', getCategoryById);
router.put('/update/:id', updateCategoryById);
router.delete('/delete/:id', deleteCategoryById);

export default router;

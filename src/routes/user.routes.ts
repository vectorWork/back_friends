import { Router } from 'express';
import userController from '../controllers/mesero.controller';

const router = Router();

router.post('/create', userController.createUser);
router.get('/getAll', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/update/:id', userController.updateUserById);
router.delete('/delete/:id', userController.deleteUserById);

export default router;

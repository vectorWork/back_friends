import { Router } from 'express';
import userController from '../controllers/user.controller';
var router = Router();
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUserById);
router.delete('/:id', userController.deleteUserById);
export default router;
//# sourceMappingURL=user.routes.js.map
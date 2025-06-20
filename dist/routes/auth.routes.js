import { Router } from 'express';
import { validateAdmin } from '../controllers/auth.controller.js';
var router = Router();
router.post('/admin', validateAdmin);
export default router;
//# sourceMappingURL=auth.routes.js.map
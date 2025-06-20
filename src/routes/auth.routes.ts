import { Router } from 'express';
import { validateAdmin } from '../controllers/auth.controller.js';

const router = Router();

router.post('/admin', validateAdmin);

export default router;
import { Router } from 'express';
import { validateAdmin } from '../controllers/auth.controller';

const router = Router();

router.post('/admin', validateAdmin);

export default router;
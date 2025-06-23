import express from 'express';
import { createProductoComandas, getProductoComandasByComandaId } from '../controllers/productoComanda.controller';

const router = express.Router();

router.post('/create', createProductoComandas);

router.get('/comanda/:comandaId', getProductoComandasByComandaId);

export default router;
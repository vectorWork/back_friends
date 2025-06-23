import express from 'express';
import { getAllComandas, getComandaById, createComanda, updateComanda, deleteComanda, getComandaByCodigo } from '../controllers/comanda.controller';
;
const router = express.Router();

router.get('/getAll', getAllComandas);
router.get('/:id', getComandaById);
router.post('/create', createComanda);
router.put('/update/:id', updateComanda);
router.delete('/delete/:id', deleteComanda);
router.get('/code/:codigo', getComandaByCodigo);

export default router;
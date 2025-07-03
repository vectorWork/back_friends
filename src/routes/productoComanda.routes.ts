import express from "express";
import {
  createProductoComandas,
  getProductoComandasByComandaId,
  getProductoComandasByDate,
} from "../controllers/productoComanda.controller";

const router = express.Router();

router.post("/create", createProductoComandas);

router.get("/comanda/:comandaId", getProductoComandasByComandaId);
router.put("/date", getProductoComandasByDate);

export default router;

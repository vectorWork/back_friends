import { Request, Response } from 'express';
import { Comanda, IComanda } from '../models/comanda.model';
import { generateNextCode } from '../helper/comandaCodeGenerator';

// Get all comandas
export const getAllComandas = async (req: Request, res: Response) => {
  try {
    const comandas: IComanda[] = await Comanda.find();
    res.status(200).json(comandas);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single comanda by ID
export const getComandaById = async (req: Request, res: Response) => {
  try {
    const comanda: IComanda | null = await Comanda.findById(req.params.id);
    if (comanda) {
      res.status(200).json(comanda);
    } else {
      res.status(404).json({ message: 'Comanda not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new comanda
export const createComanda = async (req: Request, res: Response) => {
  try {
    const nextCode = await generateNextCode();
    const comanda: IComanda = new Comanda({
      codigo: nextCode,
      // Add other fields based on your Comanda schema
      // example: field1: req.body.field1,
    });

    const newComanda: IComanda = await comanda.save();
    res.status(201).json(newComanda);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update a comanda by ID
export const updateComanda = async (req: Request, res: Response) => {
  try {
    const comanda: IComanda | null = await Comanda.findById(req.params.id);
    if (comanda) {
      // Update fields based on your Comanda schema
      // example: comanda.field1 = req.body.field1;
      const updatedComanda: IComanda = await comanda.save();
      res.status(200).json(updatedComanda);
    } else {
      res.status(404).json({ message: 'Comanda not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a comanda by ID
export const deleteComanda = async (req: Request, res: Response) => {
  try {
    const comanda: IComanda | null = await Comanda.findByIdAndDelete(req.params.id);
    if (comanda) {
      res.status(200).json({ message: 'Comanda deleted' });
    } else {
      res.status(404).json({ message: 'Comanda not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single comanda by code
export const getComandaByCodigo = async (req: Request, res: Response) => {
  try {
    const comanda: IComanda | null = await Comanda.findOne({ codigo: req.params.codigo });
    if (comanda) {
      res.status(200).json(comanda);
    } else {
      res.status(404).json({ message: 'Comanda not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

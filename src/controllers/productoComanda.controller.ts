import { Request, Response } from 'express';
import  ProductoComanda,{ IProductoComanda } from '../models/producto_comanda.model';
import {Comanda} from '../models/comanda.model'; // Import Comanda model
import mongoose from 'mongoose'; // Import mongoose for aggregation
import { generateNextCode } from '../helper/comandaCodeGenerator'; // Import the code generator

export const createProductoComandas = async (req: Request, res: Response) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: 'Invalid request body. productIds (array) is required.' });
    }

    // Create a new Comanda document
    const nextCode = await generateNextCode();
    const newComanda = await Comanda.create({ codigo: nextCode });

    const productoComandaDocuments: any[] = productIds.map((productId: any) => ({
      idComanda: newComanda._id, // Use the _id of the newly created comanda
      idProducto: productId._id,
    }));

    await ProductoComanda.insertMany(productoComandaDocuments);

    res.status(201).json({ message: 'Comanda and ProductoComanda documents created successfully', comanda: newComanda });
  } catch (error) {
    console.error('Error creating ProductoComanda documents:', error);
    res.status(500).json({ message: 'Error creating ProductoComanda documents', error });
  }
};

export const getProductoComandasByComandaId = async (req: Request, res: Response) => {
  try {
    const { comandaId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(comandaId)) {
      return res.status(400).json({ message: 'Invalid Comanda ID' });
    }

    const result = await ProductoComanda.aggregate([
      {
        $match: {
          idComanda: new mongoose.Types.ObjectId(comandaId),
        },
      },
      {
        $lookup: {
          from: 'comandas', // The name of the comanda collection
          localField: 'idComanda',
          foreignField: '_id',
          as: 'comandaDetails',
        },
      },
      {
        $unwind: '$comandaDetails',
      },
      {
        $lookup: {
          from: 'products', // The name of the product collection
          localField: 'idProducto',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$productDetails',
      },
      {
        $group: {
          _id: '$idComanda',
          comanda: { $first: '$comandaDetails.codigo' },
          productos: { $push: '$productDetails' },
        },
      },
      {
        $project: {
          _id: 0,
          comanda: 1,
          productos: 1,
        },
      },
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No ProductoComandas found for this Comanda ID' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting ProductoComandas by Comanda ID:', error);
    res.status(500).json({ message: 'Error getting ProductoComandas by Comanda ID', error });
  }
};
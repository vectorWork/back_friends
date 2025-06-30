import { Request, Response } from 'express';
import ProductoComanda, {
  IProductoComanda,
} from '../models/producto_comanda.model';
import { Comanda } from '../models/comanda.model';
import mongoose from 'mongoose';
import { generateNextCode } from '../helper/comandaCodeGenerator';
import { log } from 'console';

export const createProductoComandas = async (req: Request, res: Response) => {
  try {
    const { ProductosCocina, ProductosBarra } = req.body;
    console.log(req.body);
    const productoBarraComandaDocuments: any[] = [];
    const productoCocinaComandaDocuments: any[] = [];
    let newComandaCocina;
    let newComandaBarra;
    // Create a new Comanda document
    if (ProductosCocina.length > 0) {
      const nextCode = await generateNextCode();
      newComandaCocina = await Comanda.create({
        codigo: nextCode,
        mesero: req.body.mesero,
        mesa: req.body.mesa,
      });
      ProductosCocina.forEach((product: any) => {
        const cantidad = product.Cantidad || 1;
        for (let i = 0; i < cantidad; i++) {
          productoCocinaComandaDocuments.push({
            idComanda: newComandaCocina._id,
            idProducto: product._id,
          });
        }
      });

      await ProductoComanda.insertMany(productoCocinaComandaDocuments);
    }
    if (ProductosBarra.length > 0) {
      const nextCode = await generateNextCode();
      newComandaBarra = await Comanda.create({
        codigo: nextCode,
        mesero: req.body.mesero,
        mesa: req.body.mesa,
      });
      // Generar los documentos de ProductoComanda según la cantidad de cada producto
      ProductosBarra.forEach((product: any) => {
        const cantidad = product.Cantidad || 1;
        for (let i = 0; i < cantidad; i++) {
          productoBarraComandaDocuments.push({
            idComanda: newComandaBarra._id,
            idProducto: product._id,
          });
        }
      });

      await ProductoComanda.insertMany(productoBarraComandaDocuments);
    }

    res.status(201).json({
      message: 'Comanda and ProductoComanda documents created successfully',
      newComandaBarra,
      newComandaCocina,
    });
  } catch (error) {
    console.error('Error creating ProductoComanda documents:', error);
    res
      .status(500)
      .json({ message: 'Error creating ProductoComanda documents', error });
  }
};

export const getProductoComandasByComandaId = async (
  req: Request,
  res: Response
) => {
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
      return res
        .status(404)
        .json({ message: 'No ProductoComandas found for this Comanda ID' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting ProductoComandas by Comanda ID:', error);
    res
      .status(500)
      .json({ message: 'Error getting ProductoComandas by Comanda ID', error });
  }
};

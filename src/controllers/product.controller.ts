import { Request, Response } from 'express';
import Product from '../models/product.model';
import { log } from 'console';

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    let producto: any = req.body;
    producto.categoriaId = req.body.categoriaId._id;
    const product = new Product(producto);
    await product.save();
    const populatedProduct = await Product.findById(product._id).populate(
      'categoriaId'
    );

    res.status(201).json(populatedProduct);
  } catch (error: any) {
    console.log('Error creating product:', error);

    res.status(400).json({ error: error.message });
  }
};

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    let categoriaId = req.params.id;
    const products = await Product.find({
      categoriaId,
      eliminatedAt: null,
    }).populate('categoriaId');
    res.status(200).send(products);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      eliminatedAt: null,
    }).populate('categoriaId');
    if (!product) {
      return res.status(404).send();
    }
    res.status(200).send(product);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

// Update a product by ID
export const updateProductById = async (req: Request, res: Response) => {
  try {
    let producto: any = req.body;
    producto.categoriaId = req.body.categoriaId._id;

    let productoActualizado = await Product.findByIdAndUpdate(
      producto._id,
      producto
    );

    res.status(200).send(productoActualizado);
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
};

// Delete a product by ID (soft delete)
export const deleteProductById = async (req: Request, res: Response) => {
  try {
    let producto: any = req.body;
    producto.categoriaId = req.body.categoriaId._id;

    let productoEliminado = await Product.findByIdAndDelete(
      producto._id,
      producto
    );
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

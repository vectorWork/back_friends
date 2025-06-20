import { Request, Response } from 'express';
import Product from '../models/product.model.js';


// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
};

// Get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ eliminatedAt: null }).populate('categoriaId');
    res.status(200).send(products);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, eliminatedAt: null }).populate('categoriaId');
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
  const updates = Object.keys(req.body);
  const allowedUpdates = ['nombre', 'categoriaId', 'precio'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const product = await Product.findOne({ _id: req.params.id, eliminatedAt: null });

    if (!product) {
      return res.status(404).send();
    }

    updates.forEach((update) => (product as any)[update] = req.body[update]);
    await product.save();

    res.status(200).send(product);
  } catch (error: any) {
    res.status(400).send({ error: error.message });
  }
};

// Delete a product by ID (soft delete)
export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, eliminatedAt: null });

    if (!product) {
      return res.status(404).send();
    }

    product.eliminatedAt = new Date();
    await product.save();

    res.status(200).send(product);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};
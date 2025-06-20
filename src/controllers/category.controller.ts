import { Request, Response } from 'express';
import Category from '../models/category.model.js';
// No helper imports in this file to update.

export const createCategory = async (req: Request, res: Response) => {
  try {
    const newCategory = new Category(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({ eliminatedAt: null });
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.eliminatedAt !== null) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategoryById = async (req: Request, res: Response) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedCategory || updatedCategory.eliminatedAt !== null) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(updatedCategory);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategoryById = async (req: Request, res: Response) => {
  try {
    const deletedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { eliminatedAt: new Date() },
      { new: true }
    );
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category soft deleted', category: deletedCategory });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
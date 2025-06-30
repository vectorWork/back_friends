import { Request, Response } from 'express';
import Mesero from '../models/mesero.model';

// Create a new user
const createUser = async (req: Request, res: Response) => {
  try {
    const user = new Mesero(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all users
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await Mesero.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get a single user by ID
const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await Mesero.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a user by ID
const updateUserById = async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);

  try {
    const user = await Mesero.findById(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    const updatedMesero = await Mesero.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a user by ID
const deleteUserById = async (req: Request, res: Response) => {
  try {
    const user = await Mesero.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).send();
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};

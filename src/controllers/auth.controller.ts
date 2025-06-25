import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Admin from '../models/admin.model';

export const validateAdmin = async (req: Request, res: Response) => {
  const { password } = req.body;

  const admin = await Admin.findOne({ name: 'admin' });

  if (!admin) {
    return res
      .status(401)
      .json({ isValid: false, message: 'Admin user not found' });
  }

  const isMatch = await bcrypt.compare(password, admin.password);

  if (isMatch) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
};

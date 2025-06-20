import Admin from '../models/admin.model';
import bcrypt from 'bcrypt';

export const createAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments({ name: 'admin' });

    if (adminCount === 0) {
      const newAdmin = new Admin({
        name: 'admin',
        // Hash the password before saving
        password: await bcrypt.hash('12300..A', 10), 
      });
      await newAdmin.save();
      console.log('Default admin user created.');
    } else {
      console.log('Default admin user already exists.');
    }
  } catch (error) {
    console.error('Error creating default admin user:', error);
  }
};
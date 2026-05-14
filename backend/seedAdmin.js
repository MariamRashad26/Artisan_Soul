import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    const adminExists = await User.findOne({ email: 'admin@shoefactory.com' });

    if (adminExists) {
      console.log('Admin already exists!');
      process.exit();
    }

    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@shoefactory.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin User Seeding Successful!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();

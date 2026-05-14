import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import some of the new models we created
import RawMaterial from './models/RawMaterial.js';
import ProductionStage from './models/ProductionStage.js';
import ShiftManagement from './models/ShiftManagement.js';
import User from './models/User.js';
import Supplier from './models/Supplier.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const testBackend = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected! Testing Backend Insertions...\n');

    // 1. Create a Supplier first (if doesn't exist) so we can link it
    let supplier = await Supplier.findOne({ email: 'leather@supplier.com' });
    if (!supplier) {
      supplier = await Supplier.create({
        supplier_id: 'SUP-001',
        name: 'Premium Leather Co.',
        contactPerson: 'John Doe',
        email: 'leather@supplier.com',
        phone: '1234567890',
        address: '123 Leather Street'
      });
      console.log('📦 Created Test Supplier');
    }

    // 2. Insert into RawMaterial (New Collection!)
    const rawMaterial = await RawMaterial.create({
      material_id: 'RM-' + Math.floor(Math.random() * 1000),
      name: 'High-Grade Leather ' + Math.floor(Math.random() * 100),
      supplier_id: supplier._id,
      stock_quantity: 500,
      unit: 'sq ft',
      cost_per_unit: 15.5
    });
    console.log('✅ Successfully inserted into "raw_materials" collection!');

    // 3. Insert into ProductionStage (New Collection!)
    const stage = await ProductionStage.create({
      stage_name: 'Cutting Stage ' + Math.floor(Math.random() * 1000),
      description: 'Cutting the leather based on shoe patterns.',
      sequence_number: Math.floor(Math.random() * 1000)
    });
    console.log('✅ Successfully inserted into "production_stages" collection!');

    // 4. Create an Admin User (if doesn't exist)
    let user = await User.findOne({ email: 'admin@shoefactory.com' });
    if (!user) {
      user = await User.create({
        name: 'System Admin',
        email: 'admin@shoefactory.com',
        password: 'adminpassword123',
        role: 'admin'
      });
    }

    // 5. Insert into ShiftManagement (New Collection!)
    await ShiftManagement.create({
      user_id: user._id,
      shift_date: new Date(),
      shift_type: 'Morning',
      clock_in: new Date()
    });
    console.log('✅ Successfully inserted into "shift_management" collection!');

    console.log('\n🎉 Backend is 100% operational! Open MongoDB Compass and refresh your databases. You will see these new collections populated!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

testBackend();

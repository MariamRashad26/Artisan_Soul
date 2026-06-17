/**
 * Seed Script — Artisan Soul
 * Creates default admin and artisan accounts directly in MongoDB.
 * Run: node backend/seedUsers.js
 * 
 * These accounts are pre-verified — no email required.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

// Inline schema to avoid ESM circular issues
import connectDB from './config/db.js';
import User from './models/User.js';

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@artisansoul.com',
    password: 'i',
    role: 'admin',
    isVerified: true,
  },
  {
    name: 'Master Artisan',
    email: 'artisan@artisansoul.com',
    password: 'Artisan@1234',
    role: 'artisan',
    isVerified: true,
  },
];

const seed = async () => {
  await connectDB();

  console.log('\n🌱  Starting seed...\n');

  for (const userData of seedUsers) {
    const existing = await User.findOne({ email: userData.email });

    if (existing) {
      console.log(`⚠️  Skipped: ${userData.email} already exists (role: ${existing.role})`);
      continue;
    }

    await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password, // pre-save hook hashes it
      role: userData.role,
      isVerified: true, // bypass email verification
    });

    console.log(`✅  Created [${userData.role}] → ${userData.email}  (password: ${userData.password})`);
  }

  console.log('\n🎉  Seed complete!\n');
  console.log('--------------------------------------------');
  console.log(' Admin Login:');
  console.log('   Email   : admin@artisansoul.com');
  console.log('   Password: Admin@1234');
  console.log('   URL     : http://localhost:5173/login');
  console.log('');
  console.log(' Artisan Login:');
  console.log('   Email   : artisan@artisansoul.com');
  console.log('   Password: Artisan@1234');
  console.log('   URL     : http://localhost:5173/login');
  console.log('--------------------------------------------\n');

  mongoose.connection.close();
};

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  mongoose.connection.close();
  process.exit(1);
});

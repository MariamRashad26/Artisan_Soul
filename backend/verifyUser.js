/**
 * Manual Email Verification Script
 * Usage: node backend/verifyUser.js mariamrashad799@gmail.com
 *
 * Use this when Gmail SMTP isn't working and a user can't verify via email.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

const email = process.argv[2];

if (!email) {
  console.error('\n❌  Please provide an email address.');
  console.error('    Usage: node backend/verifyUser.js your@email.com\n');
  process.exit(1);
}

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected\n');

  const user = await User.findOne({ email });

  if (!user) {
    console.error(`❌  No account found with email: ${email}`);
    process.exit(1);
  }

  if (user.isVerified) {
    console.log(`✅  Account already verified: ${email}`);
    console.log(`    Role: ${user.role}`);
    console.log(`    You can log in at http://localhost:5173/login\n`);
    process.exit(0);
  }

  user.isVerified = true;
  user.verifyToken = undefined;
  user.verifyTokenExpiry = undefined;
  await user.save();

  console.log('--------------------------------------------');
  console.log(`✅  Account verified: ${email}`);
  console.log(`    Name : ${user.name}`);
  console.log(`    Role : ${user.role}`);
  console.log(`    Login: http://localhost:5173/login`);
  console.log('--------------------------------------------\n');
  process.exit(0);
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}

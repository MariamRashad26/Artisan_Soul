import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'artisan'],
      default: 'user',
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    preferredMeasurement: {
      type: String,
      default: 'EU Sizing',
    },
    leatherPriority: {
      type: String,
      default: 'Cognac Calfskin',
    },
    tierPoints: {
      type: Number,
      default: 1000,
    },
    // Email verification
    isVerified: {
      type: Boolean,
      default: true,
    },
    verifyToken: {
      type: String,
    },
    verifyTokenExpiry: {
      type: Date,
    },
    // Password reset
    resetToken: {
      type: String,
    },
    resetTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    if (typeof next === 'function') next();
    return;
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    if (typeof next === 'function') next();
  } catch (err) {
    if (typeof next === 'function') next(err);
    else throw err;
  }
});

const User = mongoose.model('User', userSchema);

export default User;

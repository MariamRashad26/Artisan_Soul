import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const requiresVerification = process.env.EMAIL_VERIFICATION_REQUIRED === 'true';
    let verifyToken = undefined;
    let verifyTokenExpiry = undefined;

    if (requiresVerification) {
      verifyToken = crypto.randomBytes(32).toString('hex');
      verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
      isVerified: !requiresVerification,
      verifyToken,
      verifyTokenExpiry,
    });

    if (user) {
      if (requiresVerification) {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;
        const html = `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fafaf9;">
            <h2 style="color: #1c1917; font-size: 1.5rem; margin-bottom: 8px;">Verify Your Account — Artisan Soul</h2>
            <p style="color: #57534e; font-size: 0.95rem; line-height: 1.6;">Thank you for registering at Artisan Soul. Click the button below to verify your email address and activate your account.</p>
            <a href="${verifyUrl}" style="display: inline-block; margin: 24px 0; padding: 14px 32px; background: #1c1917; color: white; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">Verify My Account</a>
            <p style="color: #a8a29e; font-size: 0.8rem;">If you did not create this account, please ignore this email.</p>
          </div>
        `;

        let emailSent = false;
        try {
          await sendEmail(email, 'Verify your Artisan Soul account', html);
          emailSent = true;
        } catch (emailErr) {
          console.error(`[Register] Verification email failed to send: ${emailErr.message}`);
        }

        return res.status(201).json({
          message: 'Registration successful! Please verify your email to log in.',
          requiresVerification: true,
          emailSent,
          devVerifyUrl: verifyUrl, // Expose for easy testing/dev flow bypass if SMTP fails
        });
      }

      // Return token immediately for auto-login
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        requiresVerification: false,
        message: 'Registration successful! Welcome to Artisan Soul.',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`[Auth][login] Attempt for email: ${email}`);

    const user = await User.findOne({ email });

    if (!user) {
      console.log(`[Auth][login] No user found for: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      console.log(`[Auth][login] User not verified: ${email}`);
      return res.status(403).json({ message: 'Please verify your email before logging in. Check your inbox for the verification link.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      console.log(`[Auth][login] Password mismatch for: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`[Auth][login] Success: ${email}`);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot password — send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal whether email exists
      return res.json({ message: 'If that email is registered, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fafaf9;">
        <h2 style="color: #1c1917; font-size: 1.5rem; margin-bottom: 8px;">Password Reset — Artisan Soul</h2>
        <p style="color: #57534e; font-size: 0.95rem; line-height: 1.6;">We received a request to reset your password. Click the button below to set a new password.</p>
        <a href="${resetUrl}" style="display: inline-block; margin: 24px 0; padding: 14px 32px; background: #1c1917; color: white; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">Reset My Password</a>
        <p style="color: #a8a29e; font-size: 0.8rem;">This link expires in 1 hour. If you did not request this, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail(email, 'Reset your Artisan Soul password', html);
      console.log(`[ForgotPassword] ✅ Reset email sent to ${email}`);
      res.json({ message: 'If that email is registered, a reset link has been sent.' });
    } catch (emailErr) {
      console.error(`[ForgotPassword] ❌ Email failed: ${emailErr.message}`);
      console.log(`[ForgotPassword] FALLBACK reset URL: ${resetUrl}`);
      res.json({
        message: 'If that email is registered, a reset link has been sent.',
        devResetUrl: resetUrl // Expose fallback URL during development if SMTP fails
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset link.' });
    }

    user.password = password; // pre-save hook will hash it
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        preferredMeasurement: user.preferredMeasurement || 'EU Sizing',
        leatherPriority: user.leatherPriority || 'Cognac Calfskin',
        tierPoints: user.tierPoints || 1000,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      if (req.body.phone !== undefined) user.phone = req.body.phone;
      if (req.body.address !== undefined) user.address = req.body.address;
      if (req.body.preferredMeasurement !== undefined) user.preferredMeasurement = req.body.preferredMeasurement;
      if (req.body.leatherPriority !== undefined) user.leatherPriority = req.body.leatherPriority;
      if (req.body.tierPoints !== undefined) user.tierPoints = req.body.tierPoints;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        preferredMeasurement: updatedUser.preferredMeasurement,
        leatherPriority: updatedUser.leatherPriority,
        tierPoints: updatedUser.tierPoints,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private (admin)
export const getUsers = async (req, res) => {
  try {
    const query = {};
    if (req.query.role) {
      query.role = req.query.role;
    }
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user details (Admin)
// @route   PUT /api/auth/users/:id
// @access  Private (admin)
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.address !== undefined) user.address = req.body.address;
    if (req.body.preferredMeasurement !== undefined) user.preferredMeasurement = req.body.preferredMeasurement;
    if (req.body.leatherPriority !== undefined) user.leatherPriority = req.body.leatherPriority;
    if (req.body.tierPoints !== undefined) user.tierPoints = req.body.tierPoints;

    const updated = await user.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a user (Admin)
// @route   DELETE /api/auth/users/:id
// @access  Private (admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'User removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create staff account (admin or artisan) — Admin only
// @route   POST /api/auth/create-staff
// @access  Private (admin)
export const createStaffAccount = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    const validRoles = ['admin', 'artisan'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Role must be admin or artisan' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      isVerified: true, // Staff accounts are pre-verified by admin
    });

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} account created successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    // Always respond the same to avoid enumeration
    const okMessage = 'If that email is registered and unverified, a new verification link has been sent.';

    if (!user || user.isVerified) {
      return res.json({ message: okMessage });
    }

    // Generate a fresh token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    user.verifyToken = verifyToken;
    user.verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;
    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #fafaf9;">
        <h2 style="color: #1c1917; font-size: 1.5rem; margin-bottom: 8px;">Verify your Artisan Soul account</h2>
        <p style="color: #57534e; font-size: 0.95rem; line-height: 1.6;">Dear ${user.name},</p>
        <p style="color: #57534e; font-size: 0.95rem; line-height: 1.6;">You requested a new verification link. Click the button below to verify your email address.</p>
        <a href="${verifyUrl}" style="display: inline-block; margin: 24px 0; padding: 14px 32px; background: #BD510D; color: white; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">Verify My Account</a>
        <p style="color: #a8a29e; font-size: 0.8rem;">This link expires in 24 hours. If you did not register, please ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail(email, 'Verify your Artisan Soul account', html);
      console.log(`[Resend] ✅ Verification email sent to ${email}`);
      res.json({ message: okMessage });
    } catch (emailErr) {
      console.error(`[Resend] ❌ Email failed: ${emailErr.message}`);
      console.log(`[Resend] FALLBACK — Verify this account manually: ${verifyUrl}`);
      res.json({
        message: okMessage,
        devVerifyUrl: verifyUrl // Expose fallback URL during development if SMTP fails
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

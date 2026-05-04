// ============================================
// PHASE 4: AUTHENTICATION CONTROLLER
// Signup aur login logic
// ============================================

import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// ============ SIGNUP CONTROLLER ============

export const signup = async (req, res) => {
  try {
    // Step 1: Request data extract karo
    const { name, email, password, confirmPassword } = req.body;

    // Step 2: Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
        code: 'MISSING_FIELDS'
      });
    }

    // Step 3: Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
        code: 'PASSWORD_MISMATCH'
      });
    }

    // Step 4: Email already exists check
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        code: 'EMAIL_EXISTS'
      });
    }

    // Step 5: New user create karo
    const user = new User({
      name,
      email: email.toLowerCase(),
      password
    });

    // Save karo (password automatically encrypt hota hai pre-save hook se)
    await user.save();

    // Step 6: JWT Token generate karo
    const token = jwt.sign(
      {
        // Payload - Token mein ye data encode hoga
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      // Secret key - Token encrypt karne ke liye
      // Explanation:
      // - Secret key = Password like
      // - Agar leak ho toh hacker tokens ban sakte hain

      {
        // Options
        expiresIn: process.env.JWT_EXPIRE || '7d'
        // Token expire kab hoga
        // 7d = 7 days baad invalid hoga
      }
    );
    // Token structure:
    // ┌─────────┬─────────┬───────────┐
    // │ HEADER  │ PAYLOAD │ SIGNATURE │
    // └─────────┴─────────┴───────────┘
    // Header: Algorithm (HS256)
    // Payload: User data (userId, email, role)
    // Signature: Encrypted hash (secret key se)

    // Step 7: Response send karo
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Signup error:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Signup failed',
      code: 'SIGNUP_ERROR'
    });
  }
};

// ============ LOGIN CONTROLLER ============

export const login = async (req, res) => {
  try {
    // Step 1: Request data extract karo
    const { email, password } = req.body;

    // Step 2: Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    // Step 3: Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        code: 'INVALID_EMAIL'
      });
    }

    // Step 4: User find karo WITH PASSWORD
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password');
    // Explanation:
    // - select('+password') = Password field explicitly include karo
    // - Kyun? Schema mein select: false set hai (privacy ke liye)
    // - Login mein password chahiye verification ke liye

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        // Alag message nahi dete (email hai ya password galti)
        // Kyun? Security - hacker ko pata nahi chalega kaun sahi hai
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Step 5: Password compare karo
    const isPasswordValid = await user.comparePassword(password);
    // comparePassword = Schema mein define kiya tha
    // bcrypt.compare() use karta hai

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    // Step 6: Last login update karo
    user.lastLogin = new Date();
    await user.save();

    // Step 7: JWT Token generate karo
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Step 8: Response send karo
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Login failed',
      code: 'LOGIN_ERROR'
    });
  }
};

// ============ GET PROFILE ============

export const getProfile = async (req, res) => {
  try {
    // req.user = Token se decoded data (authMiddleware ne set kiya)
    const userId = req.user.userId;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ REFRESH TOKEN ============

export const refreshToken = async (req, res) => {
  try {
    // Step 1: Old token se user info get karo
    const userId = req.user.userId;

    // Step 2: User verify karo (still exists)
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Step 3: New token generate karo
    const newToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(200).json({
      success: true,
      message: 'Token refreshed',
      token: newToken
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ LOGOUT ============
// Note: JWT stateless hai, server-side logout nahi hota
// Mobile app ko localStorage/secureStorage se token delete karna padta hai

export const logout = async (req, res) => {
  // Server-side: Bas success response
  // Client-side: localStorage.removeItem('token')

  res.status(200).json({
    success: true,
    message: 'Logout successful. Please remove token from your device.'
  });
};

// ============ CHANGE PASSWORD ============

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Step 1: Validation
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old and new password required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match'
      });
    }

    // Step 2: User fetch karo WITH OLD PASSWORD
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Step 3: Old password verify karo
    const isOldPasswordValid = await user.comparePassword(oldPassword);

    if (!isOldPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect'
      });
    }

    // Step 4: New password set karo
    user.password = newPassword;
    await user.save();
    // Pre-save hook automatically encrypt karega

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ FORGOT PASSWORD (Email bhejo) ============

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email required'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Security: Email na hoy toh bhi success send karo
      // Kyun? Hacker ko pata nahi chalega kaunse emails registered hain
      return res.status(200).json({
        success: true,
        message: 'If email exists, password reset link sent'
      });
    }

    // Token generate karo (short expiry - 30 minutes)
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    // TODO: Email send karo resetToken ke saath
    // sendResetPasswordEmail(user.email, resetToken);

    res.status(200).json({
      success: true,
      message: 'If email exists, password reset link sent',
      // Production mein seedha token nahi dete
      // Email mein link bhejte hain
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

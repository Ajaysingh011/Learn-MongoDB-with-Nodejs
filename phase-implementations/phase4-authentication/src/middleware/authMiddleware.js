// ============================================
// PHASE 4: AUTH MIDDLEWARE
// Protected routes ke liye token verify karna
// ============================================

import jwt from 'jsonwebtoken';

// ============ AUTH MIDDLEWARE ============

export const authMiddleware = (req, res, next) => {
  try {
    // Step 1: Token header se nikalo
    const authHeader = req.headers.authorization;
    // Explanation:
    // - Authorization header mein token hota hai
    // - Format: "Bearer <token>"
    // - Example: "Bearer eyJhbGc..."

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No authorization header',
        code: 'NO_TOKEN'
      });
    }

    // Step 2: "Bearer " part remove karo
    const token = authHeader.split(' ')[1];
    // Explanation:
    // - split(' ') = Space se split karo
    // - [0] = "Bearer"
    // - [1] = Actual token
    // - "Bearer abc123def" → token = "abc123def"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format',
        code: 'INVALID_TOKEN_FORMAT'
      });
    }

    // Step 3: Token verify karo
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
      // Explanation:
      // - jwt.verify() = Token ko decrypt aur verify karta hai
      // - Secret key match nahi karte toh error throw karega
      // - Token expired hote toh error aayega
    );
    // decoded = { userId: "...", email: "...", role: "..." }

    // Step 4: User info ko request mein attach karo
    req.user = decoded;
    // Explanation:
    // - Ab controllers mein req.user accessible hai
    // - req.user.userId = Logged-in user ka ID
    // - req.user.email = Logged-in user ka email

    // Step 5: Next middleware/handler ko call karo
    next();
    // Agar token valid toh agle step par jaao

  } catch (error) {
    // Token verification failed

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      code: 'AUTH_FAILED'
    });
  }
};

// ============ OPTIONAL AUTH MIDDLEWARE ============
// Token optional hai - hoy toh info set karo, nahi toh continue

export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
      // Token nahi hai toh bas continue karo
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();

  } catch (error) {
    // Token invalid toh bhi continue karo
    next();
  }
};

// ============ ROLE-BASED AUTHORIZATION ============

export const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user.role check karo

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(', ')}`,
        code: 'INSUFFICIENT_ROLE'
      });
      // 403 = Forbidden (authenticated but not authorized)
    }

    next();
  };
};

// Usage:
// router.delete('/users/:id', authMiddleware, authorize('admin'), deleteUser);
// Sirf admin hi users delete kar sakte hain

// ============ RATE LIMIT MIDDLEWARE ============
// Spam attacks se protect karne ke liye

import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes window
  max: 5,                     // 5 attempts max
  message: 'Too many login attempts, try again later',
  skipSuccessfulRequests: true,
  // Successful requests count nahi hote
  // Sirf failed attempts count hote hain
  standardHeaders: true,
  legacyHeaders: false
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later'
});

// Usage:
// router.post('/login', loginLimiter, authController.login);
// router.use('/api/', apiLimiter);

// ============ CUSTOM ERROR HANDLER ============

export const errorHandler = (err, req, res, next) => {
  // Error handling middleware
  // Must have 4 parameters: err, req, res, next
  // Express automatically calls this for errors

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  console.error(`[${new Date().toISOString()}] Error:`, {
    message,
    statusCode,
    path: req.path,
    method: req.method
  });

  res.status(statusCode).json({
    success: false,
    message,
    // Development mein stack trace dikhao
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Usage:
// app.use(errorHandler);  // Last middleware mein

// ============ VALIDATION MIDDLEWARE ============

import { body, validationResult } from 'express-validator';

export const validateSignup = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('email')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/[0-9]/).withMessage('Password must contain a number'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

export const validateLogin = [
  body('email')
    .isEmail().withMessage('Invalid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password required')
];

export const validate = (req, res, next) => {
  // Validation results check karo

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  next();
};

// Usage:
// router.post('/signup', validateSignup, validate, authController.signup);

// ============ LOGGING MIDDLEWARE ============

export const logger = (req, res, next) => {
  const start = Date.now();

  // Response complete hone par log karo
  res.on('finish', () => {
    const duration = Date.now() - start;

    console.log(`
[${new Date().toISOString()}] ${req.method} ${req.path}
Status: ${res.statusCode} | Duration: ${duration}ms
IP: ${req.ip}
    `);
  });

  next();
};

// Usage: app.use(logger);

// ============ CORS MIDDLEWARE ============

import cors from 'cors';

export const corsConfig = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Usage: app.use(cors(corsConfig));

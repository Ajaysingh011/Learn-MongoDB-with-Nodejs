# 🚀 Quick Start Guide

**From 0 to working backend in 30 minutes**

---

## Step 1: Copy Files to Your Project (5 min)

```bash
# Navigate to your project
cd /path/to/your/project

# Copy all phase files
cp -r phase-implementations/* .
```

---

## Step 2: Install Dependencies (5 min)

```bash
npm install
```

---

## Step 3: Setup Environment (3 min)

Create `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mobile-app-db
NODE_ENV=development
JWT_SECRET=my_super_secret_key_that_is_at_least_32_characters_long_123456789
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## Step 4: Create src Folder Structure (2 min)

```bash
mkdir -p src/{config,models,controllers,routes,middleware}
```

---

## Step 5: Copy Files to src

```bash
# Copy server.js
cp phase1-setup/src/server.js src/

# Copy database config
cp phase2-mongodb/src/config/database.js src/config/

# Copy models
cp phase3-crud/src/models/User.js src/models/

# Copy controllers
cp phase3-crud/src/controllers/userController.js src/controllers/
cp phase4-authentication/src/controllers/authController.js src/controllers/

# Copy middleware
cp phase4-authentication/src/middleware/authMiddleware.js src/middleware/
```

---

## Step 6: Create Routes File

Create `src/routes/authRoutes.js`:

```javascript
// ============================================
// AUTHENTICATION ROUTES
// ============================================

import express from 'express';
import * as authController from '../controllers/authController.js';
import { authMiddleware, loginLimiter } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', authController.signup);
router.post('/login', loginLimiter, authController.login);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.post('/refresh-token', authMiddleware, authController.refreshToken);
router.post('/change-password', authMiddleware, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/logout', authMiddleware, authController.logout);

export default router;
```

Create `src/routes/userRoutes.js`:

```javascript
// ============================================
// USER CRUD ROUTES
// ============================================

import express from 'express';
import * as userController from '../controllers/userController.js';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// CRUD routes
router.post('/users', authMiddleware, userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/search', userController.searchUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', authMiddleware, userController.updateUser);
router.delete('/users/:id', authMiddleware, authorize('admin'), userController.deleteUser);
router.post('/users/bulk-delete', authMiddleware, authorize('admin'), userController.deleteMultipleUsers);

export default router;
```

---

## Step 7: Update server.js

Replace `src/server.js` content:

```javascript
// ============================================
// MAIN SERVER FILE
// ============================================

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/database.js';
import { errorHandler, logger, apiLimiter } from './middleware/authMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load environment variables
dotenv.config();

// Connect to database
await connectDB();

// Initialize Express app
const app = express();

// ============ MIDDLEWARE ============

// Logging
app.use(logger);

// Body parsing
app.use(express.json());

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));

// Rate limiting
app.use(apiLimiter);

// ============ ROUTES ============

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date()
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

// User routes
app.use('/api', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Error handler (must be last)
app.use(errorHandler);

// ============ START SERVER ============

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  ✅ SERVER RUNNING                         ║
╠════════════════════════════════════════════╣
║  Port: ${PORT}                              ║
║  Environment: ${process.env.NODE_ENV}              ║
║  URL: http://localhost:${PORT}              ║
║  Health: http://localhost:${PORT}/api/health║
╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;
```

---

## Step 8: Start Server (2 min)

```bash
# Start development server
npm run dev

# Expected output:
# ✅ SERVER RUNNING
# Port: 5000
# URL: http://localhost:5000
# ✅ MONGODB CONNECTED
```

---

## Step 9: Test Endpoints (5 min)

### Test 1: Health Check

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test 2: Signup

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raj Kumar",
    "email": "raj@gmail.com",
    "password": "123456",
    "confirmPassword": "123456"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "_id": "507f...",
    "name": "Raj Kumar",
    "email": "raj@gmail.com"
  }
}
```

### Test 3: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "raj@gmail.com",
    "password": "123456"
  }'
```

### Test 4: Get All Users

```bash
curl http://localhost:5000/api/users?page=1&limit=10
```

### Test 5: Protected Route (Get Profile)

```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with token from signup/login response.

---

## 🎉 Done!

Your backend is now running with:

✅ **Express server** - HTTP requests handle karne ke liye
✅ **MongoDB connection** - Database operations
✅ **User model** - Schema with validations
✅ **CRUD operations** - Create, Read, Update, Delete
✅ **Authentication** - Signup, Login, JWT tokens
✅ **Error handling** - Centralized error middleware
✅ **Rate limiting** - Prevent brute force attacks
✅ **Input validation** - Express validator

---

## 📝 Project Structure

```
your-project/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   └── User.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── userRoutes.js
│   └── server.js
├── .env
├── .gitignore
├── package.json
└── package-lock.json
```

---

## 🔗 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | ❌ | Register new user |
| POST | /api/auth/login | ❌ | User login |
| GET | /api/auth/profile | ✅ | Get logged-in user profile |
| POST | /api/auth/refresh-token | ✅ | Refresh JWT token |
| POST | /api/auth/change-password | ✅ | Change password |
| POST | /api/users | ✅ | Create user |
| GET | /api/users | ❌ | Get all users (paginated) |
| GET | /api/users/search | ❌ | Search users with filters |
| GET | /api/users/:id | ❌ | Get single user |
| PUT | /api/users/:id | ✅ | Update user |
| DELETE | /api/users/:id | ✅ | Delete user |

---

## 🛠️ Troubleshooting

**Error: EADDRINUSE - Port already in use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

**Error: MongoDB connection failed**
```bash
# Make sure MongoDB is running
mongod

# Check MONGODB_URI in .env
# Default: mongodb://localhost:27017/mobile-app-db
```

**Error: Token verification failed**
```bash
# Make sure JWT_SECRET is set in .env
# And Authorization header format: Bearer <token>
```

---

## 📚 Next Steps

1. Read **COMPLETE_BACKEND_GUIDE.md** for deep understanding
2. Implement advanced features (Phase 5-6)
3. Add email verification
4. Setup database indexing for performance
5. Deploy to production (Heroku, Railway, AWS)

---

**Happy coding! 🚀**

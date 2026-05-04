# 📚 Phase Implementations - MongoDB + Node.js Backend

**Complete working code examples for each phase from the COMPLETE_BACKEND_GUIDE.md**

This folder contains fully-explained, production-ready code for building a MongoDB + Node.js backend for mobile apps.

---

## 📁 Folder Structure

```
phase-implementations/
├── phase1-setup/              ← Server setup & basic configuration
│   ├── package.json           ← Dependencies
│   ├── .env.example           ← Environment variables template
│   ├── .gitignore             ← Git ignore rules
│   └── src/
│       └── server.js          ← Express server with middleware
│
├── phase2-mongodb/            ← Database connection
│   └── src/
│       └── config/
│           └── database.js    ← MongoDB connection logic
│
├── phase3-crud/               ← CRUD operations
│   ├── src/
│   │   ├── models/
│   │   │   └── User.js        ← Mongoose schema & validations
│   │   └── controllers/
│   │       └── userController.js  ← Create, Read, Update, Delete logic
│   └── EXAMPLE_ROUTES.md      ← How to use these controllers
│
├── phase4-authentication/     ← Authentication & JWT
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.js  ← Signup, Login, Token refresh
│   │   └── middleware/
│   │       └── authMiddleware.js  ← Token verification & protection
│   └── POSTMAN_EXAMPLES.md    ← API testing guide
│
├── phase5-advanced/           ← Optimization & best practices
│   └── (coming soon)
│
├── phase6-production/         ← Deployment & monitoring
│   └── (coming soon)
│
└── README.md                  ← This file
```

---

## 🚀 How to Use

### Step 1: Setup Project

```bash
# Copy phase1-setup folder ke files ko apne project mein
cp -r phase1-setup/* /path/to/your/project/

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env file aur apne values fill karo
```

### Step 2: Configure Environment

Edit `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mobile-app-db
NODE_ENV=development
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
```

### Step 3: Copy Database Configuration

```bash
# phase2-mongodb se database.js copy karo
cp phase2-mongodb/src/config/database.js src/config/database.js

# server.js mein import karo
# import { connectDB } from './config/database.js';
# connectDB();
```

### Step 4: Copy Models

```bash
# phase3-crud se User.js copy karo
cp phase3-crud/src/models/User.js src/models/User.js
```

### Step 5: Copy Controllers

```bash
# CRUD controllers
cp phase3-crud/src/controllers/userController.js src/controllers/userController.js

# Auth controllers
cp phase4-authentication/src/controllers/authController.js src/controllers/authController.js
```

### Step 6: Copy Middleware

```bash
# Auth middleware
cp phase4-authentication/src/middleware/authMiddleware.js src/middleware/authMiddleware.js
```

### Step 7: Create Routes

```javascript
// src/routes/userRoutes.js

import express from 'express';
import * as userController from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// CRUD routes
router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.get('/users/search', userController.searchUsers);
router.put('/users/:id', authMiddleware, userController.updateUser);
router.delete('/users/:id', authMiddleware, userController.deleteUser);

export default router;
```

### Step 8: Update server.js

```javascript
import { connectDB } from './config/database.js';
import userRoutes from './routes/userRoutes.js';

// Connect to database
await connectDB();

// Mount routes
app.use('/api', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

---

## 📝 File Explanations

### Phase 1: Server Setup

**Files:**
- `package.json` - All dependencies listed
- `.env.example` - Environment variables template
- `.gitignore` - Files to ignore in git
- `src/server.js` - Express server setup

**What it does:**
- Express app initialize
- JSON middleware
- CORS configuration
- Basic routes (hello, health, info)
- Error handling (404)

**Line-by-line explanations:** ✅ Included in code

---

### Phase 2: Database Connection

**File:**
- `src/config/database.js` - MongoDB connection

**What it does:**
- Connect to MongoDB
- Error handling
- Connection events
- Graceful disconnection

**Line-by-line explanations:** ✅ Included in code

---

### Phase 3: CRUD Operations

**Files:**
- `src/models/User.js` - Mongoose schema
- `src/controllers/userController.js` - CRUD logic

**Schema Fields:**
- name (String, required)
- email (String, unique, required)
- password (String, select:false)
- phone, bio, profilePicture (Optional)
- isActive, role (Boolean/String)
- createdAt, updatedAt, lastLogin (Timestamps)

**Controllers:**
- `createUser()` - POST /api/users
- `getAllUsers()` - GET /api/users (with pagination)
- `getUserById()` - GET /api/users/:id
- `searchUsers()` - GET /api/users/search (with filters)
- `updateUser()` - PUT /api/users/:id
- `deleteUser()` - DELETE /api/users/:id
- `deleteMultipleUsers()` - DELETE multiple users

**Line-by-line explanations:** ✅ Included in code

---

### Phase 4: Authentication

**Files:**
- `src/controllers/authController.js` - Auth logic
- `src/middleware/authMiddleware.js` - Token verification

**Auth Controllers:**
- `signup()` - User registration with JWT token
- `login()` - User login with JWT token
- `getProfile()` - Get logged-in user profile
- `refreshToken()` - Generate new token
- `changePassword()` - Change user password
- `forgotPassword()` - Password reset (email)

**Middleware:**
- `authMiddleware()` - Verify JWT token
- `optionalAuth()` - Optional token verification
- `authorize()` - Role-based access control
- `loginLimiter` - Prevent brute force
- `apiLimiter` - Rate limiting
- `errorHandler()` - Centralized error handling
- `validate()` - Input validation
- `logger()` - Request logging

**Line-by-line explanations:** ✅ Included in code

---

## 🔧 Usage Examples

### Example 1: Create User

```javascript
// POST /api/users
// Body:
{
  "name": "Rajesh Singh",
  "email": "raj@gmail.com",
  "password": "123456",
  "confirmPassword": "123456",
  "phone": "9876543210"
}

// Response (201 Created):
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Rajesh Singh",
    "email": "raj@gmail.com",
    "phone": "9876543210",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Example 2: Get All Users (Paginated)

```javascript
// GET /api/users?page=1&limit=10

// Response:
{
  "success": true,
  "data": [
    { "_id": "...", "name": "Raj", "email": "raj@..." },
    { "_id": "...", "name": "Priya", "email": "priya@..." }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Example 3: Search with Filter

```javascript
// GET /api/users/search?name=Raj&minAge=25&maxAge=35&page=1

// Response: Filtered users
```

### Example 4: Signup with JWT

```javascript
// POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@gmail.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}

// Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@gmail.com",
    "role": "user"
  }
}
```

### Example 5: Protected Route

```javascript
// GET /api/profile
// Headers: Authorization: Bearer eyJhbGc...

// Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@gmail.com",
    "role": "user"
  }
}
```

---

## ⚙️ Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 5000 | Server port |
| MONGODB_URI | - | Database connection string |
| NODE_ENV | development | Environment type |
| JWT_SECRET | - | Token encryption key |
| JWT_EXPIRE | 7d | Token validity period |
| BCRYPT_ROUNDS | 10 | Password encryption rounds |
| ALLOWED_ORIGINS | * | CORS allowed domains |

### Pagination

```javascript
// Default: page=1, limit=10
// Max limit: 100 (for mobile optimization)

// Formula:
skip = (page - 1) * limit
// Page 1: skip 0
// Page 2: skip 10
// Page 3: skip 20
```

### Filtering

```javascript
// Supported operators:
// $regex: Pattern matching (name search)
// $gte: Greater than or equal (age >= 20)
// $lte: Less than or equal (age <= 30)
// $in: Is in array
```

---

## 🔐 Security Features

✅ **Password Encryption** - bcrypt with 10 rounds
✅ **JWT Tokens** - Signed and time-limited
✅ **Role-based Access** - Admin, user, moderator
✅ **Rate Limiting** - Prevent brute force attacks
✅ **Input Validation** - express-validator
✅ **CORS Protection** - Control allowed origins
✅ **SQL Injection Prevention** - MongoDB with Mongoose
✅ **Error Handling** - Centralized error middleware

---

## 🧪 Testing with Postman

1. Import the routes into Postman
2. Set `{{baseURL}}` = `http://localhost:5000`
3. Test each endpoint

**Sample Tests:**
- POST /api/auth/signup → Get token
- POST /api/auth/login → Verify password
- GET /api/profile → Use token in headers
- GET /api/users?page=1 → Pagination test
- PUT /api/users/:id → Update with auth

---

## 📚 Additional Resources

- **COMPLETE_BACKEND_GUIDE.md** - Full theory and concepts
- **express-validator** - Input validation docs
- **mongoose** - MongoDB ODM docs
- **jsonwebtoken** - JWT implementation

---

## 🚀 Next Steps

1. ✅ Setup Phase 1 (server)
2. ✅ Configure Phase 2 (database)
3. ✅ Implement Phase 3 (CRUD)
4. ✅ Add Phase 4 (authentication)
5. ⏳ Phase 5 (advanced concepts - coming soon)
6. ⏳ Phase 6 (production - coming soon)

---

## 💡 Tips

- **Read code carefully** - Every line has Hinglish explanation
- **Test each endpoint** - Use Postman/Insomnia
- **Check .env file** - All variables configured
- **Understand middleware** - Order matters in Express
- **Error messages** - Help debug issues

---

**Happy Coding! 🚀**

For questions or issues, refer to COMPLETE_BACKEND_GUIDE.md

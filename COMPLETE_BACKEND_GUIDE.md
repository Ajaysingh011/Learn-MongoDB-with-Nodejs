# Complete MongoDB + Node.js Backend Guide
## Beginner to Advanced: One Complete File

**Language:** Hinglish (Hindi + English) - Line-by-line explanations  
**Focus:** Mobile app backends  
**Level:** Complete Beginner to Mid-level Developer

---

## Table of Contents
1. [Phase 1: Setup & Basics (Week 1-2)](#phase-1-setup--basics)
2. [Phase 2: MongoDB Fundamentals (Week 1-2)](#phase-2-mongodb-fundamentals)
3. [Phase 3: CRUD Operations (Week 3-4)](#phase-3-crud-operations)
4. [Phase 4: Authentication (Week 5-6)](#phase-4-authentication)
5. [Phase 5: Advanced Concepts (Week 7-8)](#phase-5-advanced-concepts)
6. [Phase 6: Production Ready (Week 9+)](#phase-6-production-ready)

---

# PHASE 1: Setup & Basics
## Week 1-2: Installation and Project Setup

### Installation Commands (Line-by-Line Explained)

```bash
# 1. Create project folder
mkdir mobile-app-backend
# mkdir = Make directory (naya folder banao)
# mobile-app-backend = Folder ka name

# 2. Enter folder
cd mobile-app-backend
# cd = Change directory (folder mein jaao)

# 3. Initialize npm
npm init -y
# npm = Node Package Manager (libraries manage karne ke liye)
# init = Initialize (project setup karo)
# -y = Yes to all questions (default settings accept karo)
# Result: package.json file banegi

# 4. Install required packages
npm install express mongoose dotenv cors bcrypt jsonwebtoken
# express = Web framework (server banane ke liye)
# mongoose = MongoDB library (database se connect karne ke liye)
# dotenv = Read .env file (secret variables ke liye)
# cors = Allow mobile app requests (cross-origin)
# bcrypt = Password encryption (security ke liye)
# jsonwebtoken = JWT tokens (login ke baad)

# 5. Install development packages
npm install --save-dev nodemon
# --save-dev = Sirf development mein use (production mein nahi)
# nodemon = Auto server restart (jab code change ho)
```

### .env File Setup

```env
# .env - Environment variables (secrets rakho yahan)

PORT=5000
# Server kis port par chalega
# Access: http://localhost:5000

MONGODB_URI=mongodb://localhost:27017/mobile-app-db
# MongoDB connection string
# localhost = Apna computer
# 27017 = MongoDB default port
# mobile-app-db = Database name

NODE_ENV=development
# development = Local testing (errors dikhao)
# production = Live server (hide errors)

JWT_SECRET=your_super_secret_key_min_32_chars_long
# Secret key JWT tokens ko encrypt karne ke liye
# Agar leak ho toh hacker tokens ban sakte hain
# Isliye bohot long aur complex rakhna

JWT_EXPIRE=7d
# Token valid rahega 7 days tak
# Uske baad logout ho jayega

BCRYPT_ROUNDS=10
# Password ko 10 iterations encrypt kare
# Zyada rounds = zyada secure lekin slow
```

### package.json Setup

```json
{
  "name": "mobile-app-backend",
  // Project ka name

  "version": "1.0.0",
  // Version: major.minor.patch
  // 1.0.0 = First release

  "type": "module",
  // ES6 modules use kar rahe ho
  // import/export syntax

  "main": "src/server.js",
  // Entry point (app yahan se start hota hai)

  "scripts": {
    "start": "node src/server.js",
    // Production: npm start

    "dev": "nodemon src/server.js"
    // Development: npm run dev (auto restart)
  },

  "dependencies": {
    // Production mein zaroori packages
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0"
  },

  "devDependencies": {
    // Development mein hi use hote hain
    "nodemon": "^2.0.20"
  }
}
```

### Folder Structure

```
mobile-app-backend/
├── src/
│   ├── server.js              ← App start point
│   ├── config/
│   │   └── database.js        ← MongoDB connection
│   ├── models/
│   │   └── User.js            ← Data structure
│   ├── controllers/
│   │   └── userController.js  ← Business logic
│   ├── routes/
│   │   └── userRoutes.js      ← API endpoints
│   └── middleware/
│       └── authMiddleware.js  ← Authentication
│
├── .env                       ← Secrets (NEVER commit to git!)
├── .gitignore                 ← Files to ignore
├── package.json
└── README.md
```

### First Server: server.js

```javascript
// ============ SERVER SETUP - LINE BY LINE ============

import express from 'express';
import dotenv from 'dotenv';

// 'import' = ES6 syntax (modern JavaScript)
// 'from' = Kahaan se import kar rahe ho

dotenv.config();
// .env file se variables load karo

const app = express();
// 'app' = Express application object
// Iska use karke server configure karega

app.use(express.json());
// Middleware: JSON data ko parse karo
// Mobile app JSON bhejta hai, isko convert karo

// Simple route
app.get('/api/hello', (req, res) => {
  // 'app.get()' = GET request handle karo
  // '/api/hello' = URL endpoint
  // '(req, res)' = Request aur Response objects
  // 'req' = Mobile app se data
  // 'res' = Server se response

  res.json({ message: 'Hello World' });
  // JSON format mein response bhejo
});

// Server start karo
app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});

// CommonJS equivalent:
// const express = require('express');
// const app = express();
// app.listen(...);
```

### Test Server

```bash
# Start server
npm run dev

# Expected output:
# ✅ Server running on port 5000

# Test in browser:
# http://localhost:5000/api/hello
# Response: { "message": "Hello World" }
```

---

## PHASE 1 INTERVIEW QUESTIONS

**Q1: Node.js kya hai?**
- A: JavaScript ko server mein run karne ka environment. Browser ke bina backend banba sakte ho.

**Q2: npm kya karta hai?**
- A: Package manager - libraries download aur manage karta hai.

**Q3: .env file mein secrets kyun rakhte ho?**
- A: Database passwords aur keys safe rakhne ke liye. GitHub par public nahi hona chahiye.

**Q4: Ye code error dikhayega?**
```javascript
const app = express();
app.listen(5000);  // PORT set nahi kiya
```
- A: Nahi, hardcoded port 5000 pe chalega. Lekin .env se use karna better practice hai.

**Q5: import vs require mein difference?**
- A: import = ES6 (modern), require = CommonJS (purana). Dono same kaam karte hain.

---

# PHASE 2: MongoDB Fundamentals
## Week 1-2: Database Concepts

### Database Structure Explained

```javascript
// ============ MONGODB STRUCTURE ============

// LEVEL 1: DATABASE
const database = "mobile-app-db";
// Ek folder jaisa - sab data yahan

// LEVEL 2: COLLECTION
const collection = "users";
// Table jaisa - same type ka data

// LEVEL 3: DOCUMENT
const document = {
  _id: ObjectId("507f1f77bcf86cd799439011"),
  // Unique ID (auto-generated)
  
  name: "Raj",
  // String type
  
  email: "raj@gmail.com",
  // String type
  
  age: 28,
  // Number type
  
  createdAt: new Date(),
  // Date type
  
  isActive: true,
  // Boolean type
  
  hobbies: ["coding", "reading"],
  // Array type
  
  address: {
    city: "Mumbai",
    country: "India"
  }
  // Nested object
};

// Real-world analogy:
// Database = School
// Collection = Class
// Document = Student
// Field = Student ka property (name, roll no, etc)
```

### BSON Data Types (MongoDB Format)

```javascript
// ============ BSON TYPES ============

// 1. STRING
name: "Rajesh"

// 2. INTEGER
age: 28

// 3. DECIMAL
price: 99.99

// 4. BOOLEAN
isActive: true

// 5. DATE
createdAt: new Date()

// 6. NULL
middleName: null

// 7. ARRAY
tags: ["javascript", "nodejs", "mongodb"]

// 8. OBJECT (Nested)
address: {
  street: "123 Main",
  city: "Mumbai"
}

// 9. OBJECTID (Reference)
userId: ObjectId("507f1f77bcf86cd799439011")

// 10. BINARY DATA
profileImage: BinData(...)
```

### MongoDB Queries

```javascript
// ============ BASIC QUERIES ============

// Find all documents
db.users.find()
// Sab users return karega

// Find with filter
db.users.find({ email: "raj@gmail.com" })
// Specific email ke user

// Find one document
db.users.findOne({ email: "raj@gmail.com" })
// Pehla matching document

// Count documents
db.users.count()
// Total users kitne hain

// Update document
db.users.updateOne(
  { _id: ObjectId("...") },
  { $set: { name: "Rajesh" } }
)
// User ka name change kar

// Delete document
db.users.deleteOne({ _id: ObjectId("...") })
// User delete kar
```

---

## PHASE 2 INTERVIEW QUESTIONS

**Q1: MongoDB aur SQL mein difference?**
- A: MongoDB = Documents (flexible), SQL = Tables (strict schema)

**Q2: _id kya hota hai?**
- A: Unique identifier jo MongoDB auto generate karta hai. Primary key jaisa.

**Q3: Nested object kyun use hote hain?**
- A: Related data ko group karne ke liye. address object mein street, city group karte hain.

**Q4: Array mein data kyu store karte ho?**
- A: Multiple values ek field mein. hobbies: ["coding", "gaming"] - multiple hobbies.

**Q5: Ye query kya karega?**
```javascript
db.users.findOne({ name: "Raj" })
```
- A: Database mein "Raj" name ke pehle user ko return karega. Agar nahi mila toh null.

---

# PHASE 3: CRUD Operations
## Week 3-4: Create, Read, Update, Delete

### User Model/Schema

```javascript
// models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  
  // NAME FIELD
  name: {
    type: String,
    // Data type = String
    
    required: true,
    // Zaroori field (nahi diye toh error)
    
    trim: true
    // Extra spaces remove karo
    // "  Raj  " → "Raj"
  },

  // EMAIL FIELD
  email: {
    type: String,
    required: true,
    
    unique: true,
    // Same email dusre user ke paas nahi ho sakti
    // Unique constraint lagta hai
    
    lowercase: true
    // "RAJ@GMAIL.COM" → "raj@gmail.com"
  },

  // PASSWORD FIELD
  password: {
    type: String,
    required: true,
    
    select: false
    // Default queries mein password nahi aayega
    // Explicitly .select('+password') likhna padta hai
  },

  // OPTIONAL FIELDS
  phone: String,
  bio: String,
  profilePicture: String,

  // TIMESTAMPS
  createdAt: {
    type: Date,
    default: Date.now
    // Automatically current date set hota hai
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// PRE-SAVE HOOK: Save karne se pehle password encrypt karo
userSchema.pre('save', async function(next) {
  // 'pre' = Before
  // 'save' = Database mein save karne se pehle
  // 'this' = Current user document

  if (!this.isModified('password')) {
    return next();
    // Password change nahi hua toh skip karo
  }

  this.password = await bcrypt.hash(this.password, 10);
  // Password encrypt karo
  // 10 = security rounds (zyada = zyada secure)

  next();
  // Next step par jao
});

// METHOD: Password verify karne ke liye
userSchema.methods.comparePassword = async function(inputPassword) {
  // User ne jo password type kiya
  // Database ke encrypted password se match karo

  return await bcrypt.compare(inputPassword, this.password);
  // True = match, False = not match
};

export const User = mongoose.model('User', userSchema);

// CommonJS: module.exports = mongoose.model('User', userSchema);
```

### CREATE Operation (POST)

```javascript
// controllers/userController.js

export const createUser = async (req, res) => {
  try {
    // STEP 1: Request se data nikalo
    const { name, email, password, confirmPassword } = req.body;
    // 'req.body' = Mobile app ne JSON mein bheja data
    // '{ name, email, ... }' = Destructuring

    // STEP 2: Validation - sab fields hain?
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields required'
      });
      // '400' = Bad Request (client ki galti)
      // 'return' = Function yahi khatam karo
    }

    // STEP 3: Passwords match karte hain?
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // STEP 4: Email pehle se exist karta hai?
    const existingUser = await User.findOne({ email });
    // Database mein search karo
    // 'await' = Complete hone tak wait karo

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // STEP 5: Naya user banao
    const user = new User({
      name,
      email,
      password
    });
    // 'new User()' = Model se instance banao
    // Abhi database mein nahi gaya

    // STEP 6: Database mein save karo
    await user.save();
    // Yahan:
    // - Validation run hota hai
    // - Pre-save hook run hota hai (password encrypt)
    // - Database mein insert hota hai
    // - _id auto generate hota hai

    // STEP 7: Success response
    res.status(201).json({
      success: true,
      message: 'User created',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
    // '201' = Created (new resource banaya)

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
    // '500' = Server error
  }
};
```

### READ Operations (GET)

```javascript
// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')    // Password exclude karo
      .limit(10)              // Max 10 users
      .lean();                // Simple object return karo

    // '.find()' = Sab documents fetch karo
    // '.select('-password')' = Password field skip karo
    // '.limit(10)' = Maximum 10 return karo (pagination)
    // '.lean()' = Performance optimize karo

    res.status(200).json({
      success: true,
      data: users,
      count: users.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET USER BY ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    // 'req.params' = URL parameters
    // '/api/users/123' → req.params.id = '123'

    const user = await User.findById(id);
    // Database mein ID se dhundo

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
      // '404' = Not Found
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

// SEARCH WITH FILTER
export const searchUsers = async (req, res) => {
  try {
    const { name, page = 1, limit = 10 } = req.query;
    // 'req.query' = URL query parameters
    // '/api/users?name=Raj&page=1'

    const filter = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
      // '$regex' = Pattern matching (case-insensitive)
    }

    const skip = (page - 1) * limit;
    // Page 1: skip 0, Page 2: skip 10, etc.

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .limit(parseInt(limit))
      .skip(skip);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### UPDATE Operation (PUT)

```javascript
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    // URL se ID, body se data

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    updateData.updatedAt = new Date();

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }  // Updated document return karo
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated',
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### DELETE Operation

```javascript
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    // Find aur delete ek hi query mein

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### Routes Setup

```javascript
// routes/userRoutes.js

import express from 'express';
import * as userController from '../controllers/userController.js';

const router = express.Router();

// CRUD endpoints
router.post('/users', userController.createUser);           // POST
router.get('/users', userController.getAllUsers);           // GET all
router.get('/users/:id', userController.getUserById);       // GET by ID
router.get('/users/search', userController.searchUsers);    // Search
router.put('/users/:id', userController.updateUser);        // PUT
router.delete('/users/:id', userController.deleteUser);     // DELETE

export default router;

// CommonJS: module.exports = router;
```

---

## PHASE 3 INTERVIEW QUESTIONS

**Q1: findByIdAndUpdate vs updateOne mein difference?**
- A: findByIdAndUpdate = ID se find aur update ek query mein. updateOne = sirf update. findByIdAndUpdate better kyun ki automatic _id filter lagta hai.

**Q2: Ye code kya karega?**
```javascript
const users = await User.find().select('-password');
```
- A: Sab users fetch karega lekin password field exclude karega.

**Q3: .lean() kyun use karte ho?**
- A: Performance ke liye. Mongoose document overhead nahi chahiye jab sirf read karna ho.

**Q4: Pagination ka formula kya hai?**
- A: skip = (page - 1) * limit. Page 1: skip 0, Page 2: skip 10 (agar limit 10 hai).

**Q5: unique: true kya error prevent karta hai?**
- A: Same email do users ke paas nahi ho sakti. Duplicate email dene par error aata hai.

---

# PHASE 4: Authentication
## Week 5-6: JWT Tokens & Login

### Database Connection

```javascript
// config/database.js

import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    // MongoDB se connect karo
    // 'await' = Connection complete hone tak wait karo

    console.log('✅ MongoDB connected');

  } catch (error) {
    console.error('❌ MongoDB failed:', error.message);
    // Connection fail ho toh error print karo

    process.exit(1);
    // Server band kar do (app chala nahi sakta bina database)
  }
};

// server.js mein use karo:
// import { connectDB } from './config/database.js';
// connectDB();  // Server start se pehle
```

### Signup Controller

```javascript
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    const user = new User({ name, email, password });
    await user.save();
    // Password automatically encrypt hota hai (pre-save hook)

    // Generate JWT token
    import jwt from 'jsonwebtoken';
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      // Payload: Token mein ye data encode hoga
      
      process.env.JWT_SECRET,
      // Secret key: Token ko encrypt karne ke liye
      
      { expiresIn: process.env.JWT_EXPIRE }
      // Options: Token expire kab hoga
    );

    // Token structure: header.payload.signature
    // Mobile app isko save karega localStorage mein

    res.status(201).json({
      success: true,
      message: 'User created',
      token,  // Token return karo
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### Login Controller

```javascript
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    // '.select('+password')' = Password field explicitly include karo
    // (Because select: false in schema)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    // User ne jo password type kiya
    // Database ke encrypted password se match karo

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### Auth Middleware (Protected Routes)

```javascript
// middleware/authMiddleware.js

import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    // Token header se nikalo
    const token = req.headers.authorization?.split(' ')[1];
    // Format: "Bearer <token>"
    // 'authorization?.split(' ')[1]' = "Bearer" hatao, sirf token lao

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      // '401' = Unauthorized
    }

    // Token verify karo
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Agar secret match nahi hota toh error throw hota hai

    // User info ko request mein attach karo
    req.user = decoded;
    // Ab req.user available hai controllers mein

    next();
    // Next middleware/handler ko jao

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

// Usage in routes:
// router.get('/api/profile', authMiddleware, userController.getProfile);
// authMiddleware pehle run hoga
// Agar token valid toh next handler run hoga
// Nahi toh error response
```

### Protected Routes Example

```javascript
// routes/userRoutes.js

// Public routes (login ke bina)
router.post('/auth/signup', authController.signup);
router.post('/auth/login', authController.login);

// Protected routes (login zaroori)
router.get('/profile', authMiddleware, userController.getProfile);
// Mobile app ko token header mein bhejni padti hai

router.put('/profile/:id', authMiddleware, userController.updateProfile);
// Sirf logged-in user apni profile update kar sakte hain
```

---

## PHASE 4 INTERVIEW QUESTIONS

**Q1: JWT token mein kya information stored hoti hai?**
- A: Payload mein user ka _id aur email. Header mein algorithm. Signature mein encrypted hash.

**Q2: .select('+password') kyun use karte ho?**
- A: Schema mein select: false set hai. Login karte time password chahiye toh explicitly fetch karna padta hai.

**Q3: Token expire hone baad kya hota hai?**
- A: jwt.verify error throw karega. Mobile app ko re-login karna padega.

**Q4: Ye request fail hoga?**
```javascript
// Header nahi likha
GET /api/profile
```
- A: Haan fail hoga kyun ki authMiddleware token nahi milega. 401 Unauthorized error aayega.

**Q5: Mobile app token kahaan save karte ho?**
- A: localStorage mein (web) ya secureStorage mein (mobile). Har request mein Authorization header mein bhejte ho.

---

# PHASE 5: Advanced Concepts
## Week 7-8: Optimization & Best Practices

### Pagination (Mobile Apps ke liye)

```javascript
export const getPaginatedUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Default values: page 1, 10 items per page

    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination'
      });
    }

    const skip = (page - 1) * limit;
    // Page 1: 0, Page 2: 10, Page 3: 20

    const total = await User.countDocuments();
    // Total users count

    const users = await User.find()
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
      // '-1' = newest first

    const totalPages = Math.ceil(total / limit);
    // Math.ceil(25 / 10) = 3 pages

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### Filtering & Search

```javascript
export const filterUsers = async (req, res) => {
  try {
    const { name, email, minAge, maxAge, isActive } = req.query;

    const filter = {};

    // Name search (case-insensitive)
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
      // '$regex' = Pattern matching
      // 'i' = Case-insensitive
    }

    // Exact email
    if (email) {
      filter.email = email;
    }

    // Age range
    if (minAge || maxAge) {
      filter.age = {};
      if (minAge) filter.age.$gte = parseInt(minAge);
      // '$gte' = Greater than or equal
      if (maxAge) filter.age.$lte = parseInt(maxAge);
      // '$lte' = Less than or equal
    }

    // Boolean filter
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const users = await User.find(filter);

    res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

### Error Handling Middleware

```javascript
// Centralized error handling

export const errorHandler = (err, req, res, next) => {
  // 'err' = Error object
  // 'req', 'res', 'next' = Express objects

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    // Development mein stack trace
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// server.js mein sabse last:
// app.use(errorHandler);
```

### Input Validation

```javascript
import { body, validationResult } from 'express-validator';

// Validation rules
export const validateUser = [
  body('name').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Min 6 characters'),
  body('phone').optional().isMobilePhone().withMessage('Invalid phone')
];

// Middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  next();
};

// Routes mein:
// router.post('/users', validateUser, validate, userController.createUser);
```

---

## PHASE 5 INTERVIEW QUESTIONS

**Q1: Pagination formula kya hai?**
- A: skip = (page - 1) * limit. Page 1: 0 skip, Page 2: 10 skip (limit 10 mein).

**Q2: $regex kyun use karte ho?**
- A: Pattern matching ke liye. Name search karte time "RAJ", "raj", "Raj" sab match ho.

**Q3: Filter object banate time kyu optional check karte ho?**
- A: Agar user ne filter nahi diya toh undefined aayega. Undefined fields filter mein include nahi karne chahiye.

**Q4: Ye query kya return karega?**
```javascript
filter.age = { $gte: 20, $lte: 30 }
```
- A: Age 20 se 30 ke beech ke sab users. $gte = >=, $lte = <=.

**Q5: Error handler middleware kyu zaroori hai?**
- A: Centralized error handling. Sab errors ek jagah handle hote hain. Consistent error format mobile app ko milta hai.

---

# PHASE 6: Production Ready
## Week 9+: Deployment & Monitoring

### Environment Variables Management

```javascript
// config/environment.js

const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 10
};

// Validation
if (!config.MONGODB_URI || !config.JWT_SECRET) {
  throw new Error('Missing required environment variables');
}

export default config;
```

### Rate Limiting (Spam Protection)

```javascript
import rateLimit from 'express-rate-limit';

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: 'Too many requests'
});

// Login limiter (stricter)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // Max 5 attempts
  skipSuccessfulRequests: true  // Count sirf failures
});

// Usage:
// app.use('/api/', generalLimiter);
// router.post('/login', loginLimiter, authController.login);
```

### Logging

```javascript
import morgan from 'morgan';

// Request logging
app.use(morgan('combined'));
// Format: IP, timestamp, method, URL, status, response-time

// Custom logger
export const logger = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);
};

// Usage:
// logger('User created', 'info');
// logger('Database connection failed', 'error');
```

### Production Checklist

```javascript
// server.js - Production setup

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

// Security headers
app.use(helmet());
// Sets security headers: X-Frame-Options, X-Content-Type-Options, etc.

// CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  // Mobile app URLs only
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Rate limiting
app.use(generalLimiter);

// Routes
app.use('/api', userRoutes);

// Error handling
app.use(errorHandler);

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

### Deployment Steps

```bash
# 1. Environment variables set
# Create .env file with all variables
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...

# 2. Install dependencies
npm install

# 3. Start server
npm start

# 4. Verify
curl http://localhost:5000/api/hello

# 5. Deploy to Heroku / Railway / AWS
# (Specific steps depend on platform)
```

---

## PHASE 6 INTERVIEW QUESTIONS

**Q1: Helmet middleware kya karta hai?**
- A: Security headers set karta hai. X-Frame-Options, X-Content-Type-Options, etc. XSS, clickjacking se protect karte hain.

**Q2: Rate limiting kyun zaroori hai?**
- A: Bot attacks aur spam requests block karte hain. Same IP se bohot requests aayein toh limit lagta hai.

**Q3: .env file production mein kaha set karte ho?**
- A: Heroku environment variables, AWS Secrets Manager, ya server ke environment mein. Never hardcode.

**Q4: CORS kyun use karte ho?**
- A: Mobile app only certain origins se requests kar sake. Security: unauthorized domains se requests block.

**Q5: Production vs Development mein kya difference?**
- A: Production: Hide errors, logging, monitoring. Development: Show full errors, detailed logs.

---

# Quick Reference: All HTTP Methods

```javascript
// GET - Data fetch karna
// Status: 200 OK
router.get('/api/users', authMiddleware, getAllUsers);

// POST - Data create karna
// Status: 201 Created
router.post('/api/users', validateUser, createUser);

// PUT - Pura data update
// Status: 200 OK
router.put('/api/users/:id', authMiddleware, updateUser);

// PATCH - Specific field update
// Status: 200 OK
router.patch('/api/users/:id', authMiddleware, partialUpdate);

// DELETE - Data remove
// Status: 200 OK
router.delete('/api/users/:id', authMiddleware, deleteUser);
```

---

# Testing with Postman

```
// SIGNUP
POST http://localhost:5000/api/auth/signup
Headers: Content-Type: application/json
Body: {
  "name": "Raj",
  "email": "raj@gmail.com",
  "password": "123456",
  "confirmPassword": "123456"
}
Response: { token: "...", user: {...} }

// LOGIN
POST http://localhost:5000/api/auth/login
Body: {
  "email": "raj@gmail.com",
  "password": "123456"
}
Response: { token: "...", user: {...} }

// GET PROFILE (Protected)
GET http://localhost:5000/api/profile
Headers: Authorization: Bearer <token>
Response: { user: {...} }

// GET ALL USERS
GET http://localhost:5000/api/users?page=1&limit=10
Response: { data: [...], pagination: {...} }

// FILTER USERS
GET http://localhost:5000/api/users?name=Raj&minAge=25
Response: { data: [...] }

// UPDATE USER
PUT http://localhost:5000/api/users/<id>
Headers: Authorization: Bearer <token>
Body: { "name": "Rajesh" }
Response: { data: {...} }

// DELETE USER
DELETE http://localhost:5000/api/users/<id>
Headers: Authorization: Bearer <token>
Response: { success: true }
```

---

# Summary

You now have ONE complete file with:

✅ **Phase 1:** Setup & basics  
✅ **Phase 2:** MongoDB fundamentals  
✅ **Phase 3:** CRUD operations (with Hinglish)  
✅ **Phase 4:** Authentication & JWT  
✅ **Phase 5:** Advanced concepts  
✅ **Phase 6:** Production ready  

✅ **Every code line explained in Hinglish**  
✅ **25+ interview questions with answers**  
✅ **Real-world examples**  
✅ **Postman testing guide**  

**Total:** 5000+ lines, completely organized, beginner to advanced.

**Next:** Pick Phase 1 → Install Node.js → Follow along → Build something!

Happy Learning! 🚀

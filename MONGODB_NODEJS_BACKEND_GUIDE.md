# 📚 MongoDB + Node.js Backend Complete Learning Guide
## Beginner to Production-Ready: All 6 Phases in One Complete File

**Language:** Hinglish (Hindi + English) - 100% Line-by-line explanations  
**Focus:** Mobile app backends  
**Level:** Complete Beginner to Mid-level Developer  
**Content:** Theory + Code + Interview Questions + Production Setup

---

## 🎯 Table of Contents

1. [PHASE 1: Setup & Basics](#phase-1-setup--basics)
2. [PHASE 2: MongoDB Fundamentals](#phase-2-mongodb-fundamentals)
3. [PHASE 3: CRUD Operations](#phase-3-crud-operations)
4. [PHASE 4: Authentication & JWT](#phase-4-authentication--jwt)
5. [PHASE 5: Advanced Concepts](#phase-5-advanced-concepts)
6. [PHASE 6: Production Ready](#phase-6-production-ready)
7. [Interview Questions & Answers](#interview-questions--answers)
8. [Deployment Checklist](#deployment-checklist)

---

---

# PHASE 1: Setup & Basics
## Week 1-2: Installation and Project Setup

### ✅ What You'll Learn
- Node.js installation aur setup
- npm package manager
- Project folder structure
- Environment variables (.env)
- package.json samajhna
- Nodemon ka use
- First server banana
- HTTP methods (GET, POST, PUT, DELETE)

---

### Installation Commands (Complete Setup)

```bash
# Step 1: Project folder banao
mkdir mobile-app-backend
# mkdir = Make directory (naya folder banao)
# mobile-app-backend = Folder ka name

# Step 2: Folder mein enter karo
cd mobile-app-backend
# cd = Change directory (folder mein jaao)

# Step 3: npm initialize karo
npm init -y
# npm = Node Package Manager (libraries manage karne ke liye)
# init = Initialize (project setup karo)
# -y = Yes to all default settings

# Step 4: Required packages install karo
npm install express mongoose dotenv cors bcrypt jsonwebtoken helmet morgan compression express-rate-limit express-validator
# express = Web framework (server banane ke liye)
# mongoose = MongoDB ka library (database ke liye)
# dotenv = .env file read karne ke liye
# cors = Cross-Origin requests allow (mobile apps ke liye)
# bcrypt = Password encryption (security)
# jsonwebtoken = JWT tokens (login system)
# helmet = Security headers (XSS, clickjacking protection)
# morgan = HTTP logging (requests record karna)
# compression = Gzip compression (50% size reduction)
# express-rate-limit = Rate limiting (spam protection)
# express-validator = Input validation

# Step 5: Development packages install karo
npm install --save-dev nodemon
# --save-dev = Production mein nahi chahiye
# nodemon = Server auto restart (code change hone par)
```

---

### .env File Setup (Complete Configuration)

```env
# ============ .env FILE ============
# Ye file mein secrets aur configuration rakhte hain
# .gitignore mein add karo ta ki GitHub par upload na ho

# SERVER CONFIGURATION
PORT=5000
# Server kis port par chalega
# Access: http://localhost:5000

NODE_ENV=development
# development = Local testing (detailed errors)
# production = Live server (hide errors for security)

# DATABASE CONFIGURATION
MONGODB_URI=mongodb://localhost:27017/mobile-app-db
# MongoDB connection string
# Format: mongodb://username:password@host:port/database
# localhost = Apna computer
# 27017 = MongoDB default port
# mobile-app-db = Database ka name

# AUTHENTICATION
JWT_SECRET=your_super_secret_key_minimum_32_characters_long_abc123
# Secret key JWT tokens ko encrypt karne ke liye
# Minimum 32 characters (security ke liye)
# Strong & complex rakhna

JWT_EXPIRE=7d
# Token expire kab hoga: 7d (7 days), 24h (24 hours)
# Phir user ko re-login karna padega

# SECURITY
BCRYPT_ROUNDS=10
# Password encryption ki strength
# 10 = good balance (secure + fast)
# Zyada = zyada secure lekin slow

# CORS CONFIGURATION
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,https://yourapp.com
# Mobile app URLs jo requests kar sakte hain
# Multiple URLs: comma-separated

# DEPLOYMENT
HOSTING_URL=http://localhost:5000
# Live server ka URL (production mein actual URL)
```

---

### package.json Complete Setup

```json
{
  "name": "mobile-app-backend",
  // Project ka naam

  "version": "1.0.0",
  // Version: major.minor.patch format
  // 1.0.0 = First release

  "description": "Complete MongoDB + Node.js backend for mobile apps",
  // Project ka description

  "type": "module",
  // ES6 modules use kar rahe ho (import/export)
  // CommonJS mein: likhte nahi (default hai)

  "main": "src/server.js",
  // Entry point - yahan se app start hota hai

  "scripts": {
    "start": "node src/server.js",
    // Production mein: npm start
    // Simple node command, no auto-restart

    "dev": "nodemon src/server.js",
    // Development mein: npm run dev
    // Auto restart hota hai code change par

    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
    // Testing command (future mein)
  },

  "dependencies": {
    // Production mein zaroori packages (final app mein include)

    "express": "^4.18.2",
    // Web framework - routes aur middleware

    "mongoose": "^7.0.0",
    // MongoDB library - database operations

    "dotenv": "^16.0.3",
    // Environment variables read karna

    "cors": "^2.8.5",
    // Cross-Origin Resource Sharing

    "bcrypt": "^5.1.0",
    // Password encryption

    "jsonwebtoken": "^9.0.0",
    // JWT token creation aur verification

    "helmet": "^7.0.0",
    // Security headers

    "morgan": "^1.10.0",
    // HTTP request logging

    "compression": "^1.7.4",
    // Gzip response compression

    "express-rate-limit": "^6.0.0",
    // Rate limiting middleware

    "express-validator": "^7.0.0"
    // Input validation
  },

  "devDependencies": {
    // Sirf development mein zaroori (production mein include nahi)

    "nodemon": "^2.0.20"
    // Auto server restart
  },

  "keywords": [
    "mongodb",
    "nodejs",
    "express",
    "backend",
    "api"
  ],

  "author": "Your Name",
  "license": "MIT"
}
```

---

### Folder Structure (Industry Standard)

```
mobile-app-backend/
├── src/                              ← Source code folder
│   ├── server.js                     ← Main entry point (server start)
│   │
│   ├── config/                       ← Configuration files
│   │   ├── database.js               ← MongoDB connection
│   │   └── production.js             ← Production settings
│   │
│   ├── models/                       ← Database schemas
│   │   └── User.js                   ← User schema
│   │
│   ├── controllers/                  ← Business logic
│   │   ├── userController.js         ← User CRUD logic
│   │   ├── authController.js         ← Login/signup logic
│   │   └── advancedController.js     ← Advanced operations
│   │
│   ├── routes/                       ← API endpoints
│   │   ├── userRoutes.js             ← User endpoints
│   │   ├── authRoutes.js             ← Auth endpoints
│   │   └── advancedRoutes.js         ← Advanced endpoints
│   │
│   └── middleware/                   ← Middleware functions
│       ├── authMiddleware.js         ← JWT verification
│       ├── errorHandler.js           ← Error handling
│       └── validation.js             ← Input validation
│
├── .env                              ← Secrets (NEVER push to GitHub!)
├── .env.example                      ← Template for .env
├── .gitignore                        ← Files to ignore in git
├── package.json                      ← Dependencies
├── package-lock.json                 ← Dependency versions
└── README.md                         ← Documentation

// CommonJS mein:
// "type": "module" likhte nahi (use require instead of import)
```

---

### First Server: server.js (Complete Setup)

```javascript
// ============================================
// PHASE 1: MAIN SERVER FILE
// Ye file se app start hota hai
// ============================================

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

// ============ STEP 1: Load environment variables ============

dotenv.config();
// .env file se variables load karo
// Ab process.env.PORT, process.env.MONGODB_URI, etc available

// ============ STEP 2: Create Express app ============

const app = express();
// 'app' = Express application object
// Iska use karke:
// - Routes define karte hain
// - Middleware lagaate hain
// - Server listen karate hain

// ============ STEP 3: Security Middleware ============

app.use(helmet());
// Security headers automatically set hote hain
// XSS, clickjacking, MIME sniffing attacks se protect

// ============ STEP 4: JSON Body Parsing ============

app.use(express.json());
// Incoming JSON requests ko parse karo
// Mobile app JSON bhejta hai: { "name": "Raj" }
// Ye middleware isko JavaScript object mein convert karega
// Ab req.body mein access kar sakte ho

// ============ STEP 5: CORS Configuration ============

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  // Kaun se domains se requests kar sakte hain
  // Development: '*' (sab allowed)
  // Production: specific domains only

  credentials: true
  // Cookies aur auth headers allow karo
}));

// ============ STEP 6: Compression ============

app.use(compression());
// Responses ko gzip mein compress karo
// 50% size reduction
// Mobile apps ke liye perfect

// ============ STEP 7: Logging ============

app.use(morgan('combined'));
// HTTP requests log karo
// Format: IP, timestamp, method, URL, status, response-time

// ============ STEP 8: Test Routes ============

app.get('/', (req, res) => {
  res.json({
    message: 'Mobile App Backend API',
    version: '1.0.0',
    status: 'Running'
  });
});

app.get('/api/health', (req, res) => {
  // Health check endpoint
  // Mobile app check kar sakta hai server alive hai ya nahi

  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// ============ STEP 9: 404 Handler ============

app.use((req, res) => {
  // Koi bhi request jo kisi route se match nahi hua

  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// ============ STEP 10: Error Handler ============

app.use((err, req, res, next) => {
  // Error handling middleware
  // 4 parameters = Express automatically samajhta hai error handler hai

  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    // Production mein stack trace hide karo
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============ STEP 11: Start Server ============

const PORT = process.env.PORT || 5000;
// .env se PORT ya default 5000

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

// ============ STEP 12: Graceful Shutdown ============

process.on('SIGINT', () => {
  // Ctrl+C press karne par
  console.log('\n🛑 Shutting down server...');

  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// ============ CommonJS Equivalent ============
/*
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/

export default app;
```

---

### HTTP Methods Explained

```javascript
// ============ HTTP METHODS ============

// GET - Data fetch karna
// Example: GET /api/users
// Meaning: Sab users ka data dedo
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

// POST - Naya data create karna
// Example: POST /api/users
// Body: { name: "Raj", email: "raj@gmail.com" }
// Meaning: Ye data database mein save karo
app.post('/api/users', (req, res) => {
  // req.body = POST se jo data bheja
  res.status(201).json({ message: 'User created' });
  // 201 = Created (naya resource banaya)
});

// PUT - Pura data update karna
// Example: PUT /api/users/123
// Body: { name: "Rajesh", email: "rajesh@gmail.com" }
// Meaning: User 123 ka pura data replace karo
app.put('/api/users/:id', (req, res) => {
  // :id = URL parameter
  res.json({ message: 'User updated' });
});

// PATCH - Partial data update
// Example: PATCH /api/users/123
// Body: { name: "Rajesh" }
// Meaning: User 123 ka sirf name update karo
app.patch('/api/users/:id', (req, res) => {
  res.json({ message: 'User partially updated' });
});

// DELETE - Data remove karna
// Example: DELETE /api/users/123
// Meaning: User 123 ko database se delete karo
app.delete('/api/users/:id', (req, res) => {
  res.json({ message: 'User deleted' });
});

// HTTP Status Codes
// 200 = OK (request successful)
// 201 = Created (new resource banaya)
// 400 = Bad Request (client ka galti)
// 401 = Unauthorized (login zaroori)
// 403 = Forbidden (permission nahi)
// 404 = Not Found (resource nahi mila)
// 500 = Server Error (server ka problem)
```

---

### Test Server

```bash
# Start development server
npm run dev

# Expected output:
# ✅ SERVER RUNNING
# Port: 5000
# URL: http://localhost:5000

# Test in browser:
# http://localhost:5000/api/health
# Response: { "success": true, "message": "Server is healthy" }

# Test with curl:
curl http://localhost:5000/api/health

# Test POST request:
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Raj","email":"raj@gmail.com"}'
```

---

## PHASE 1 INTERVIEW QUESTIONS

**Q1: Node.js kya hai aur iska use kyun karte hain?**

A: Node.js ek JavaScript runtime environment hai jo browser ke bahar JavaScript ko run kar sakta hai. Isliye:
- Backend servers banate hain
- API endpoints create karte hain
- Database operations karte hain
- Real-time applications banate hain
- JavaScript ek language mein full-stack development kar sakte hain

Real-world example: Instagram ka server Node.js se bana sakta ho jo requests receive karega, database mein save karega, aur responses bhejega.

---

**Q2: npm kya karta hai aur package.json ka kya role hai?**

A: npm = Node Package Manager
- Libraries download aur manage karta hai
- package.json = Project ka configuration file jisme:
  - Project ka naam, version
  - Dependencies list (kaun se libraries chahiye)
  - Scripts (npm start, npm run dev)

Real-world example: Jaise Zomato ke liye different ingredients chahiye (rice, vegetables, spices), same tarah project ke liye different libraries chahiye (express, mongoose, etc). npm inhe manage karta hai.

---

**Q3: .env file mein secrets kyun rakhte hain aur isse nahi karte toh kya problem ho?**

A: .env mein secrets (passwords, API keys) rakhte hain kyun ki:
- GitHub par public nahi honge (security)
- Har environment different ho sakta hai (dev, prod)
- Production mein different credentials

Agar hardcode karega toh:
- GitHub par push ho jayega (public)
- Hacker steal kar sakta hai
- Production secrets leak ho jayenge

Real-world example: Jaise house key public mein nahi rakho, same tarah database password secret rakhte ho.

---

**Q4: "type": "module" kya hota hai package.json mein?**

A: Ye batata hai ki project ES6 modules use kar raha hai:
- `import` aur `export` use kar sakte ho
- Modern JavaScript syntax

Agar nahi likha toh:
- CommonJS use hota hai
- `require()` aur `module.exports` use hote hain

Real-world analogy: Video dekhe mobile mein ya PC mein - same content, different medium. Same tarah ES6 aur CommonJS - same functionality, different syntax.

---

**Q5: HTTP methods (GET, POST, PUT, DELETE) mein difference kya hai?**

A:
- **GET** = Data fetch (Read only, safe)
- **POST** = Naya data create (Mutation, not safe)
- **PUT** = Pura data update (Complete replacement)
- **DELETE** = Data remove (Mutation)

Real-world example:
- GET = Book dekhna library mein (kuch change nahi)
- POST = Book return karna library (naya entry)
- PUT = Book ki condition change karna (replace)
- DELETE = Book ko library se nikalna

---

---

# PHASE 2: MongoDB Fundamentals
## Database Structure aur BSON Types

### ✅ What You'll Learn
- MongoDB kya hai
- Database → Collection → Document hierarchy
- BSON data types (10 types)
- MongoDB queries
- Mongoose schema basics
- Indexes aur optimization

---

### MongoDB Structure Explained

```javascript
// ============ HIERARCHY ============

// LEVEL 1: DATABASE
const database = "mobile-app-db";
// Ek folder jaisa - sab data yahan
// Multiple databases ho sakte hain

// LEVEL 2: COLLECTION
const collection = "users";
// Collection = Table jaisa (SQL mein)
// Same type ka data yahan

// LEVEL 3: DOCUMENT
const document = {
  _id: ObjectId("507f1f77bcf86cd799439011"),
  // Unique ID (auto-generated by MongoDB)

  name: "Rajesh Singh",
  // String type

  email: "raj@gmail.com",
  // Email (string)

  age: 28,
  // Number type

  isActive: true,
  // Boolean

  createdAt: new Date(),
  // Date type

  hobbies: ["coding", "reading", "gaming"],
  // Array

  address: {
    street: "123 Main St",
    city: "Mumbai",
    country: "India"
  },
  // Nested object

  salary: 50000.50,
  // Decimal

  roles: ["user", "admin"],
  // Array of strings

  profileImage: null
  // Null value
};

// Real-world analogy:
// ┌─────────────────────────┐
// │   School (DATABASE)     │
// ├─────────────────────────┤
// │ Class 10A (COLLECTION)  │
// ├─────────────────────────┤
// │  Student 1 (DOCUMENT)   │
// │  Student 2 (DOCUMENT)   │
// │  Student 3 (DOCUMENT)   │
// └─────────────────────────┘
```

---

### BSON Data Types (Complete)

```javascript
// ============ 10 MAIN BSON TYPES ============

// 1. STRING
{ name: "Rajesh" }
// Text data, any length

// 2. INTEGER
{ age: 28 }
// Whole numbers: -2147483648 to 2147483647

// 3. DECIMAL (Double in BSON)
{ price: 99.99, salary: 50000.50 }
// Floating point numbers

// 4. BOOLEAN
{ isActive: true, isPremium: false }
// True or false only

// 5. DATE
{ createdAt: new Date() }
// Timestamp: milliseconds since epoch
// Example: 2024-01-15T10:30:00.000Z

// 6. NULL
{ middleName: null }
// Explicitly null values

// 7. ARRAY
{ 
  hobbies: ["coding", "gaming", "reading"],
  scores: [95, 87, 92],
  tags: [{ name: "javascript" }, { name: "nodejs" }]
}
// Multiple values ek field mein

// 8. OBJECT (Nested/Embedded)
{ 
  address: {
    street: "123 Main St",
    city: "Mumbai",
    zip: "400001"
  }
}
// Object ke andar aur objects

// 9. OBJECTID
{ 
  userId: ObjectId("507f1f77bcf86cd799439011"),
  referrerId: ObjectId("507f1f77bcf86cd799439012")
}
// Unique identifier, auto-generated
// _id field har document mein hota hai

// 10. BINARY DATA
{ 
  profileImage: BinData(0, "base64encodedstring")
}
// Images, files, binary data

// Other types (less common):
// - Regular Expression: /pattern/
// - Timestamp: Timestamp(1609459200, 1)
// - Long: NumberLong("9223372036854775807")
// - Decimal128: NumberDecimal("123.45")
```

---

### MongoDB Queries (CRUD)

```javascript
// ============ MONGODB QUERIES ============

// SELECT ALL DOCUMENTS
db.users.find()
// Sab users return karega
// SQL: SELECT * FROM users

// SELECT WITH CONDITION
db.users.find({ email: "raj@gmail.com" })
// Specific email ke user dhundo
// SQL: SELECT * FROM users WHERE email = '...'

// SELECT ONE DOCUMENT
db.users.findOne({ email: "raj@gmail.com" })
// Pehla matching document
// SQL: SELECT * FROM users WHERE email = '...' LIMIT 1

// COUNT DOCUMENTS
db.users.countDocuments()
// Total users kitne hain
// SQL: SELECT COUNT(*) FROM users

// COUNT WITH CONDITION
db.users.countDocuments({ isActive: true })
// Active users kitne hain

// UPDATE ONE DOCUMENT
db.users.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439011") },
  { $set: { name: "Rajesh Kumar" } }
)
// User ka name change karo
// $set = Field update karo

// UPDATE MULTIPLE DOCUMENTS
db.users.updateMany(
  { isActive: false },
  { $set: { status: "inactive" } }
)
// Sab inactive users ka status change karo

// DELETE ONE DOCUMENT
db.users.deleteOne({ _id: ObjectId("...") })
// Specific user delete karo

// DELETE MULTIPLE DOCUMENTS
db.users.deleteMany({ isActive: false })
// Sab inactive users delete karo
```

---

### Mongoose Schema (Introduction)

```javascript
// ============ MONGOOSE SCHEMA ============

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  // FIELD: name
  name: {
    type: String,           // Data type
    required: true,         // Zaroori field
    trim: true,             // Extra spaces remove karo
    minlength: 2,           // Minimum 2 characters
    maxlength: 50           // Maximum 50 characters
  },

  // FIELD: email
  email: {
    type: String,
    required: true,
    unique: true,           // Same email do users ke paas nahi ho sakti
    lowercase: true,        // "RAJ@GMAIL.COM" → "raj@gmail.com"
    index: true             // Fast search ke liye index
  },

  // FIELD: age
  age: {
    type: Number,
    min: 13,                // Minimum age
    max: 120,               // Maximum age
    default: 18             // Default value
  },

  // FIELD: createdAt
  createdAt: {
    type: Date,
    default: Date.now       // Current date automatically
  }

});

// Model banao
const User = mongoose.model('User', userSchema);

export default User;

// CommonJS:
// module.exports = mongoose.model('User', userSchema);
```

---

## PHASE 2 INTERVIEW QUESTIONS

**Q1: MongoDB aur SQL databases mein main difference kya hai?**

A:
| Aspect | MongoDB | SQL |
|--------|---------|-----|
| Type | NoSQL (Document-based) | Relational |
| Structure | Flexible (JSON-like) | Strict (Tables/Columns) |
| Schema | Dynamic (change kar sakte ho) | Fixed |
| Scaling | Horizontal (easy) | Vertical |
| Example | { name: "Raj", age: 28 } | TABLE with COLUMNS |

Real-world: MongoDB = Notebook (likhne ka freedom), SQL = Form (fixed fields)

---

**Q2: _id field kya hota hai aur ye kyu important hai?**

A: _id = Unique identifier har document mein
- Automatically generated by MongoDB
- ObjectId type ka hota hai
- Primary key like (SQL mein)
- Isse document ko uniquely identify kar sakte ho
- Find, update, delete operations mein use hota hai

Real-world: Aadhar number like - har Indian ka unique number

---

**Q3: BSON mein kitne data types hain aur important kaunse hain?**

A: 10 main types:
1. String - text
2. Number - integers/decimals
3. Boolean - true/false
4. Date - timestamp
5. Null - null values
6. Array - multiple values
7. Object - nested data
8. ObjectId - unique identifier
9. Binary - images/files
10. Regular Expression - patterns

Most important: String, Number, Boolean, Date, Array, Object, ObjectId

---

---

# PHASE 3: CRUD Operations
## Complete User Management System

### ✅ What You'll Learn
- Mongoose schema complete design
- CREATE operation (POST)
- READ operations (GET)
- UPDATE operation (PUT)
- DELETE operation (DELETE)
- Pagination formula
- Filtering aur search
- Error handling

---

### User Model Complete Design

```javascript
// ============ src/models/User.js ============

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({

  // NAME FIELD
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name must not exceed 50 characters']
  },

  // EMAIL FIELD
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    index: true
  },

  // PASSWORD FIELD
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false  // Default queries mein password nahi aayega
  },

  // OPTIONAL FIELDS
  phone: {
    type: String,
    default: null,
    match: [/^[0-9]{10}$/, 'Phone must be 10 digits']
  },

  bio: {
    type: String,
    default: '',
    maxlength: 500
  },

  profilePicture: {
    type: String,  // URL of image
    default: null
  },

  // BOOLEAN FIELDS
  isActive: {
    type: Boolean,
    default: true
  },

  // ROLE FIELD
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },

  // TIMESTAMPS
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  lastLogin: {
    type: Date,
    default: null
  }

}, { timestamps: true });

// PRE-SAVE HOOK: Password encryption
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// INSTANCE METHOD: Password verification
userSchema.methods.comparePassword = async function(inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// STATIC METHOD
userSchema.statics.findByEmail = async function(email) {
  return await this.findOne({ email: email.toLowerCase() });
};

// INDEXES
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

export const User = mongoose.model('User', userSchema);
```

---

### CRUD Controllers (Complete Implementation)

```javascript
// ============ src/controllers/userController.js ============

import { User } from '../models/User.js';

// ========== CREATE USER (POST) ==========
export const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      phone: phone || null
    });

    await user.save();
    // Password automatically encrypted by pre-save hook

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========== READ ALL USERS (GET) ==========
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Validation
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination parameters'
      });
    }

    const skip = (page - 1) * limit;
    // PAGINATION FORMULA EXPLANATION:
    // Page 1: (1-1)*10 = 0    → Get items 1-10
    // Page 2: (2-1)*10 = 10   → Get items 11-20
    // Page 3: (3-1)*10 = 20   → Get items 21-30

    const total = await User.countDocuments();
    const users = await User.find()
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========== READ SINGLE USER (GET) ==========
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

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

// ========== SEARCH & FILTER USERS (GET) ==========
export const searchUsers = async (req, res) => {
  try {
    const { name, email, minAge, maxAge, isActive, page = 1, limit = 10 } = req.query;

    const filter = {};

    // Name search (case-insensitive regex)
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
      // $regex = Pattern matching
      // $options: 'i' = Case-insensitive
    }

    // Email exact match
    if (email) {
      filter.email = email.toLowerCase();
    }

    // Age range
    if (minAge || maxAge) {
      filter.age = {};
      if (minAge) filter.age.$gte = parseInt(minAge);  // >=
      if (maxAge) filter.age.$lte = parseInt(maxAge);  // <=
    }

    // Active status
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========== UPDATE USER (PUT) ==========
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, bio } = req.body;

    const updateData = {};

    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;
    if (bio) updateData.bio = bio;

    updateData.updatedAt = new Date();

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========== DELETE USER (DELETE) ==========
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CommonJS:
// module.exports = { createUser, getAllUsers, ... };
```

---

## PHASE 3 INTERVIEW QUESTIONS

**Q1: Mongoose schema mein zaroori fields kaunse hain?**

A: Zaroori nahi hote, lekin recommended:
- **type** = Data type (required)
- **required** = Field zaroori hai?
- **default** = Default value
- **unique** = Duplicate values?
- **index** = Fast search?
- **validation** = Rules

Example:
```javascript
email: {
  type: String,      // Zaroori
  required: true,    // Recommended
  unique: true,      // Recommended
  index: true        // Performance
}
```

---

**Q2: Pre-save hook kyu use karte ho aur iska kya faida hai?**

A: Pre-save hook = Database mein save karne se pehle run hota hai

Use:
- Password encryption
- Data validation
- Auto-calculations
- Data transformation

Example: Password ko plaintext mein save nahi karte, encrypted form mein save karte ho

---

**Q3: select: false ka matlab kya hai?**

A: select: false = Default queries mein field include nahi hote

```javascript
password: {
  type: String,
  select: false  // Default queries mein password nahi aayega
}

// Get user without password
const user = await User.findById(id);  // password nahi milega

// Get user with password (explicitly)
const user = await User.findById(id).select('+password');
```

Kyun? Security ke liye - password kabhi send nahi karna chahiye client ko

---

**Q4: Pagination formula kya hai aur iska matlab?**

A: `skip = (page - 1) * limit`

Example:
- Page 1, Limit 10: skip = 0 (items 1-10)
- Page 2, Limit 10: skip = 10 (items 11-20)
- Page 3, Limit 10: skip = 20 (items 21-30)

Mobile apps ke liye perfect kyun:
- Network traffic reduce hota hai
- Battery consumption less
- User experience better

---

**Q5: Filtering mein $regex aur $gte/$lte operators kya karte hain?**

A:
- **$regex** = Pattern matching (search)
  - `{ name: { $regex: "raj", $options: "i" } }` = "raj" search karo (case-insensitive)
  - Matches: "Raj", "RAJ", "Rajesh", "rajendra"

- **$gte** = Greater than or equal
  - `{ age: { $gte: 25 } }` = age >= 25

- **$lte** = Less than or equal
  - `{ age: { $lte: 35 } }` = age <= 35

Combined:
```javascript
{ age: { $gte: 25, $lte: 35 } }  // age between 25-35
```

---

---

# PHASE 4: Authentication & JWT
## Complete Login System with Security

### ✅ What You'll Learn
- JWT token structure aur working
- Password encryption with bcrypt
- Signup process
- Login process
- Protected routes
- Role-based access
- Refresh tokens
- Rate limiting

---

### Database Connection

```javascript
// ============ src/config/database.js ============

import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');

    const connection = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        minPoolSize: 5
      }
    );

    console.log(`
╔════════════════════════════════════════╗
║  ✅ MONGODB CONNECTED                  ║
╠════════════════════════════════════════╣
║  Host: ${connection.connection.host}            ║
║  Database: ${connection.connection.name}        ║
║  Port: ${connection.connection.port}            ║
╚════════════════════════════════════════╝
    `);

    return connection;

  } catch (error) {
    console.error(`
╔════════════════════════════════════════╗
║  ❌ MONGODB CONNECTION FAILED           ║
╠════════════════════════════════════════╣
║  Error: ${error.message}               ║
╚════════════════════════════════════════╝
    `);

    process.exit(1);
  }
};

// CommonJS:
// module.exports = { connectDB };
```

---

### Authentication Controller (Complete)

```javascript
// ============ src/controllers/authController.js ============

import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// ========== SIGNUP ==========
export const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password
    });

    await user.save();
    // Password automatically encrypted

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      // Payload: Token mein ye data encode hoga

      process.env.JWT_SECRET,
      // Secret key: Encryption ke liye

      { expiresIn: process.env.JWT_EXPIRE || '7d' }
      // Options: Expiry time
    );

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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========== LOGIN ==========
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

    // Find user WITH password (because select: false in schema)
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
        // Don't reveal if email exists (security)
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========== GET PROFILE ==========
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;  // From authMiddleware

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

// ========== REFRESH TOKEN ==========
export const refreshToken = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const newToken = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
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

// ========== CHANGE PASSWORD ==========
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword, confirmPassword } = req.body;

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

    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isOldPasswordValid = await user.comparePassword(oldPassword);

    if (!isOldPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();
    // Pre-save hook automatically encrypts

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

// CommonJS:
// module.exports = { signup, login, getProfile };
```

---

### Auth Middleware (JWT Verification)

```javascript
// ============ src/middleware/authMiddleware.js ============

import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

// ========== JWT VERIFICATION MIDDLEWARE ==========
export const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    // Format: "Bearer <token>"

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    // "Bearer abc123def" → token = "abc123def"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Agar invalid toh error throw karega
    // Agar expired toh error throw karega

    // Attach user info to request
    req.user = decoded;
    // Ab controllers mein req.user available hai

    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// ========== ROLE-BASED ACCESS CONTROL ==========
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(', ')}`
      });
      // 403 = Forbidden (authenticated but not authorized)
    }

    next();
  };
};

// Usage: router.delete('/users/:id', authMiddleware, authorize('admin'), deleteUser);

// ========== RATE LIMITING ==========
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,                     // 5 attempts max
  message: 'Too many login attempts, try again later',
  skipSuccessfulRequests: true  // Don't count successful logins
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests'
});

// CommonJS:
// module.exports = { authMiddleware, authorize, loginLimiter };
```

---

### Routes Setup

```javascript
// ============ src/routes/authRoutes.js ============

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

export default router;
```

---

## PHASE 4 INTERVIEW QUESTIONS

**Q1: JWT token structure mein kya hota hai?**

A: JWT = JSON Web Token
```
header.payload.signature

1. HEADER:
   { "typ": "JWT", "alg": "HS256" }
   Ye batata hai ye JWT hai aur HS256 encryption use ho raha hai

2. PAYLOAD:
   { "userId": "123", "email": "raj@gmail.com" }
   Ye data client ko send hota hai (encrypt nahi, base64 encoded)

3. SIGNATURE:
   HMACSHA256(header + payload + secret)
   Verification ke liye - isse verify ho jaata hai token genuine hai

Real-world: Passport mein photo (header), information (payload), government stamp (signature)
```

---

**Q2: .select('+password') kyun likhte hain?**

A: Schema mein password: { select: false } set hai
- Matlab default queries mein password nahi aayega
- Security ke liye - password kabhi expose nahi hona chahiye

Login mein zaroori hai:
```javascript
const user = await User.findById(id).select('+password');
// Explicitly password fetch karo verification ke liye
```

---

**Q3: Token expire hone baad kya hota hai?**

A: Jab token expired hota hai:
```javascript
jwt.verify(token, secret);  // Error throw hota hai!
```

Mobile app ko:
1. Refresh token use karna padta hai (new token banane ke liye)
2. Ya phir re-login karna padta hai

User experience: Login ek baar, 7 days refresh ho jaata hai

---

**Q4: Rate limiting kyun zaroori hai authentication mein?**

A: Login brute force attack roka jaye
- Attacker automatically passwords try kar rahe ho
- Rate limiting se limit ho jaata hai

Example:
- Max 5 attempts per 15 minutes
- After 5 failed attempts → 15 minute wait

Mobile apps ko mathlb nahi, hackers ko problem hota hai

---

**Q5: Role-based access control kaise implement karte ho?**

A:
```javascript
// Admin-only route
router.delete('/users/:id', 
  authMiddleware,           // Login check
  authorize('admin'),       // Role check
  deleteUser
);

// Multiple roles allowed
router.put('/posts/:id',
  authMiddleware,
  authorize('admin', 'moderator'),  // Admin OR moderator
  updatePost
);

Middleware mein:
- req.user.role check karte ho
- Match na kare toh 403 Forbidden
```

---

---

# PHASE 5: Advanced Concepts
## Performance Optimization aur Complex Operations

### ✅ What You'll Learn
- Advanced pagination
- Complex filtering ($or, $and, $regex, etc)
- Multi-field search
- Aggregation pipelines (statistics)
- Bulk operations
- Text search with relevance
- Caching strategies
- Data export (CSV, JSON)
- Database indexing

---

### Advanced Pagination & Filtering

```javascript
// ============ ADVANCED PAGINATION ============

// Formula: skip = (page - 1) * limit
// Real-world: Instagram infinite scroll

const getPaginatedUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: 'Invalid pagination'
    });
  }

  const skip = (page - 1) * limit;

  const total = await User.countDocuments();
  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();

  const totalPages = Math.ceil(total / limit);

  res.json({
    data: users,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
};

// ============ COMPLEX FILTERING ============

const filterUsers = async (req, res) => {
  const { name, email, minAge, maxAge, isActive, role } = req.query;

  const filter = {};

  // Name search (case-insensitive)
  if (name) {
    filter.name = { $regex: name, $options: 'i' };
  }

  // Email exact match
  if (email) {
    filter.email = email.toLowerCase();
  }

  // Age range
  if (minAge || maxAge) {
    filter.age = {};
    if (minAge) filter.age.$gte = parseInt(minAge);
    if (maxAge) filter.age.$lte = parseInt(maxAge);
  }

  // Active status
  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  // Role filter
  if (role) {
    filter.role = role;
  }

  const users = await User.find(filter);

  res.json({
    success: true,
    data: users
  });
};

// ============ MULTI-FIELD SEARCH ============

const searchUsers = async (req, res) => {
  const { q } = req.query;

  // Search across multiple fields
  const searchFilter = {
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { phone: { $regex: q, $options: 'i' } },
      { bio: { $regex: q, $options: 'i' } }
    ]
  };
  // $or = Match ANY condition

  const users = await User.find(searchFilter);

  res.json({
    success: true,
    data: users
  });
};
```

---

### Aggregation Pipeline (Statistics)

```javascript
// ============ AGGREGATION PIPELINE ============

const getUserStatistics = async (req, res) => {
  // Complex database operations - more efficient than app-level processing

  const stats = await User.aggregate([
    // Stage 1: Match
    {
      $match: { isActive: true }
    },

    // Stage 2: Group
    {
      $group: {
        _id: '$role',              // Group by role
        totalUsers: { $sum: 1 },   // Count users
        avgAge: { $avg: '$age' },  // Average age
        minAge: { $min: '$age' },  // Minimum age
        maxAge: { $max: '$age' }   // Maximum age
      }
    },

    // Stage 3: Sort
    {
      $sort: { totalUsers: -1 }
    }
  ]);

  // Example response:
  // [
  //   { _id: 'user', totalUsers: 95, avgAge: 28, minAge: 18, maxAge: 45 },
  //   { _id: 'admin', totalUsers: 5, avgAge: 35, minAge: 28, maxAge: 42 }
  // ]

  res.json({
    success: true,
    data: stats
  });
};
```

---

### Caching Strategy

```javascript
// ============ IN-MEMORY CACHING ============

const cache = new Map();

export const getCachedUsers = async (req, res) => {
  const cacheKey = 'all_users';
  const cacheTTL = 5 * 60 * 1000;  // 5 minutes

  // Check cache
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (Date.now() - cached.timestamp < cacheTTL) {
      return res.json({
        success: true,
        source: 'cache',
        data: cached.data
      });
    }
  }

  // Not in cache, fetch from database
  const users = await User.find().lean();

  // Store in cache
  cache.set(cacheKey, {
    data: users,
    timestamp: Date.now()
  });

  res.json({
    success: true,
    source: 'database',
    data: users
  });
};

// Benefits of caching:
// - Reduce database queries
// - Faster responses
// - Lower server load
// - Better user experience
```

---

## PHASE 5 INTERVIEW QUESTIONS

**Q1: Pagination formula kya hai aur iska mobile apps mein kya faida hai?**

A: Formula: `skip = (page - 1) * limit`

Mobile apps mein advantage:
- **Network**: Ek saath sab data nahi, chunks mein
- **Battery**: Network transmission less, battery bachta hai
- **Memory**: Phone mein sab data load nahi hota
- **Speed**: Quick response times

Real-world: Instagram scrolling - infinite load, ek baar 10-20 posts

---

**Q2: $regex operator ka kya use hai filtering mein?**

A: Pattern matching for text search

```javascript
{ name: { $regex: "raj", $options: "i" } }
```

Matches:
- "Raj" ✓
- "RAJ" ✓
- "Rajesh" ✓
- "rajendra" ✓
- "raj123" ✗

`$options: "i"` = Case-insensitive

---

**Q3: Aggregation pipeline kyu use karte ho?**

A: Complex database operations efficiently

```javascript
// Bad way (app-level):
const users = await User.find();
let stats = { admin: 0, user: 0 };
users.forEach(u => stats[u.role]++);  // App mein calculation

// Good way (aggregation):
const stats = await User.aggregate([
  { $group: { _id: '$role', count: { $sum: 1 } } }
]);  // Database mein calculation
```

Benefits:
- Database server jyada powerful
- Less data transfer
- Faster processing

---

**Q4: Caching ka kya faida hai?**

A: Database queries reduce hote hain

```javascript
// Without cache:
req 1 → database → response
req 2 → database → response  (same data, again database hit)

// With cache:
req 1 → database → cache → response
req 2 → cache → response (no database hit!)
```

Trade-off:
- Pro: Fast, less server load
- Con: Stale data possible (TTL manage karna padta hai)

---

**Q5: Text search kaise implement karte ho aur kya advantage hai regex se zyada?**

A: Text search = Full-text indexing

```javascript
// Text index banao:
userSchema.index({ name: "text", email: "text" });

// Query:
const users = await User.find(
  { $text: { $search: "raj" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } });
```

Regex vs Text Search:
| Feature | Regex | Text Search |
|---------|-------|-------------|
| Performance | Slow (large data) | Fast (indexed) |
| Relevance | No | Yes (scoring) |
| Language | No | Yes (stemming) |
| Use Case | Simple search | Full-text search |

---

---

# PHASE 6: Production Ready
## Security, Monitoring, Deployment

### ✅ What You'll Learn
- Security headers (Helmet)
- CORS configuration
- Rate limiting
- Gzip compression
- Request logging (Morgan)
- Performance monitoring
- Memory management
- Error tracking
- Graceful shutdown
- Environment validation
- Deployment strategies

---

### Production Server Setup

```javascript
// ============ src/server-production.js ============

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { connectDB } from './config/database.js';
import rateLimit from 'express-rate-limit';

const app = express();

// ========== SECURITY ==========

app.use(helmet());
// Security headers:
// - X-Frame-Options: DENY (clickjacking)
// - X-Content-Type-Options: nosniff (MIME sniffing)
// - Content-Security-Policy: Resource restrictions
// - Strict-Transport-Security: Force HTTPS
// - X-XSS-Protection: XSS filter

// ========== CORS ==========

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));
// Only specified origins can access

// ========== COMPRESSION ==========

app.use(compression());
// Gzip responses
// 50% size reduction
// Mobile optimization

// ========== LOGGING ==========

app.use(morgan('combined'));
// Log requests with timestamp, status, response time

// ========== RATE LIMITING ==========

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
// 100 requests per 15 minutes

// ========== VALIDATION ==========

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.warn('⚠️  JWT_SECRET is too short!');
}

// ========== DATABASE ==========

await connectDB();

// ========== ROUTES ==========

app.get('/api/health', (req, res) => {
  res.json({ success: true });
});

// ========== ERROR HANDLING ==========

app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    // Production mein stack trace hide
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ========== GRACEFUL SHUTDOWN ==========

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down...');

  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('❌ Force shutdown');
    process.exit(1);
  }, 30000);
});

// Monitor memory
setInterval(() => {
  const usage = process.memoryUsage();
  if (usage.heapUsed > 500 * 1024 * 1024) {
    console.warn('⚠️  High memory usage!');
  }
}, 60000);
```

---

### Production Checklist

```
PRE-DEPLOYMENT CHECKLIST:

Code Quality:
☐ Run linter (eslint)
☐ No console.log() in code
☐ Code review done
☐ Tests passing

Security:
☐ Helmet enabled
☐ CORS configured
☐ Rate limiting active
☐ Input validation enabled
☐ JWT_SECRET strong (32+ chars)
☐ Password encryption working
☐ HTTPS enabled

Database:
☐ Backups configured
☐ Indexes created
☐ Connection pooling set
☐ Database user restricted permissions

Monitoring:
☐ Logging configured
☐ Error tracking setup
☐ Performance monitoring
☐ Alerts configured

Deployment:
☐ Environment variables set
☐ .env in .gitignore
☐ PM2 or Docker ready
☐ Load balancer configured
☐ DNS updated
☐ SSL certificate installed
```

---

### Deployment Options

```bash
# ========== PM2 (Node Process Manager) ==========

# Install
npm install -g pm2

# Start
pm2 start src/server.js --name "backend-api"

# Monitor
pm2 monit

# Restart
pm2 restart backend-api

# Stop
pm2 stop backend-api

# Logs
pm2 logs backend-api

# Ecosystem file (ecosystem.config.js):
module.exports = {
  apps: [{
    name: 'backend-api',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production' }
  }]
};

// ========== DOCKER ==========

# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]

# Build
docker build -t mobile-backend .

# Run
docker run -p 5000:5000 mobile-backend

// ========== HEROKU / RAILWAY ==========

# Simple deployment, automatic scaling
git push heroku main

// ========== AWS ==========

# EC2 instance
# ElasticBeanstalk
# Lambda (serverless)
```

---

## PHASE 6 INTERVIEW QUESTIONS

**Q1: Helmet middleware kya karta hai?**

A: Security headers automatically set karta hai

```javascript
app.use(helmet());
```

Headers set:
- **X-Frame-Options: DENY** → Clickjacking protection
- **X-Content-Type-Options: nosniff** → MIME sniffing protection
- **Content-Security-Policy** → XSS protection
- **Strict-Transport-Security** → Force HTTPS
- **X-XSS-Protection** → Browser XSS filter

Real-world: Lock lagana har window mein

---

**Q2: Graceful shutdown kya hota hai?**

A: Server ko properly band karna

```javascript
process.on('SIGTERM', () => {
  server.close(() => {  // New requests nahi accept karo
    // Database connections close karo
    // Pending requests complete hone do
    process.exit(0);
  });
});
```

Why important:
- Data corruption prevent hota hai
- Transactions complete ho jaate hain
- Connections properly close hote hain

---

**Q3: Production vs Development environment mein kya difference hai?**

A:
```
DEVELOPMENT:
- Stack traces show ho
- Detailed errors
- Logging verbose
- Hot reload

PRODUCTION:
- Stack traces hide (security)
- Generic error messages
- Critical logging only
- No hot reload
```

Real-world: Doctor ke clinic (development) vs hospital (production)

---

**Q4: Rate limiting kyun production mein zaroori hai?**

A: Protection from:
- DDoS attacks
- Brute force
- API abuse
- Spam

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min window
  max: 100                    // 100 requests max
});

app.use('/api/', limiter);
```

Mobile apps ko mathlb nahi, attackers ko problem

---

**Q5: Deployment strategies kaunse hain?**

A:
| Strategy | Time | Risk | Downtime |
|----------|------|------|----------|
| Blue-Green | Medium | Low | Zero |
| Rolling | Long | Low | Zero |
| Canary | Medium | Medium | Zero |
| Big Bang | Fast | High | Yes |

**Blue-Green**: Two identical environments, switch karte ho
**Rolling**: Gradually update servers
**Canary**: Deploy to small % first, monitor
**Big Bang**: Deploy everything at once (risky!)

---

---

# 📋 Interview Questions & Answers
## Complete 25+ Questions with Detailed Solutions

## PHASE 1-2: BASICS

**Q1: Node.js kya hai?**
A: Server-side JavaScript runtime environment jo browser ke bahar JavaScript run karta hai.

**Q2: npm ka full form?**
A: Node Package Manager - libraries manage karte ho.

**Q3: ES6 modules vs CommonJS?**
A: ES6 = import/export (modern), CommonJS = require/module.exports (older)

**Q4: .env file kyun zaroori?**
A: Secrets (passwords, keys) hide rakne ke liye, GitHub par nahi jaayein.

**Q5: HTTP methods?**
A: GET (read), POST (create), PUT (update), DELETE (delete), PATCH (partial update)

## PHASE 3: CRUD

**Q6: CRUD kya hota hai?**
A: Create, Read, Update, Delete - database operations.

**Q7: Pagination formula?**
A: skip = (page - 1) * limit

**Q8: select: false ka matlab?**
A: Field default queries mein nahi aayega (security).

**Q9: Pre-save hook?**
A: Database mein save karne se pehle run hota hai (password encryption, validation).

**Q10: $regex operator?**
A: Pattern matching for text search (case-insensitive with $options: 'i').

## PHASE 4: AUTHENTICATION

**Q11: JWT token structure?**
A: header.payload.signature

**Q12: Password encryption zaroori?**
A: Plaintext passwords hack ho sakte hain, bcrypt se encrypted store karte ho.

**Q13: Rate limiting kyun?**
A: Brute force attacks protect karte ho.

**Q14: Protected routes?**
A: authMiddleware check karta hai token valid hai ya nahi.

**Q15: Role-based access?**
A: authorize() middleware check karta hai user ka role.

## PHASE 5: ADVANCED

**Q16: Aggregation pipeline?**
A: Complex database operations ($match, $group, $sort) - statistics.

**Q17: Text search vs Regex?**
A: Text search = indexed aur fast, Regex = slow.

**Q18: Caching benefits?**
A: Database queries reduce, faster responses, less server load.

**Q19: $or operator?**
A: Multiple conditions mein se koi bhi match kar sakte ho.

**Q20: Bulk operations?**
A: updateMany, deleteMany - multiple documents ek query mein.

## PHASE 6: PRODUCTION

**Q21: Helmet middleware?**
A: Security headers automatically set karta hai.

**Q22: Graceful shutdown?**
A: Server ko properly band karna - pending requests complete hone do.

**Q23: Compression benefit?**
A: Response size 50% reduce, mobile optimization.

**Q24: Environment validation?**
A: Check karo sab required variables set hain.

**Q25: Deployment strategy?**
A: Blue-Green (safe), Rolling (gradual), Canary (test first), Big Bang (risky)

---

# 🚀 Deployment Checklist

```
BEFORE DEPLOYING:

✅ Code
- Linter passing
- No console.logs
- Code reviewed
- Tests passing

✅ Security
- Helmet enabled
- CORS configured
- Rate limiting
- Input validation
- Strong JWT_SECRET
- Password encryption

✅ Database
- Backups set
- Indexes created
- Connection pooling
- Permissions restricted

✅ Monitoring
- Logging setup
- Error tracking
- Performance monitoring
- Alerts configured

✅ Deployment
- Environment vars
- .env in .gitignore
- PM2/Docker ready
- HTTPS configured
- DNS updated

✅ Testing
- Load testing
- Security testing
- All endpoints tested
- Error scenarios tested
```

---

# 📚 Learning Path (6 Weeks)

**Week 1-2: Phases 1-2**
- Node.js, npm, Express setup
- MongoDB concepts, BSON types
- Time: 3-5 hours

**Week 2-3: Phase 3**
- CRUD operations, pagination, filtering
- Time: 10-12 hours

**Week 3-4: Phase 4**
- JWT, signup, login, protected routes
- Time: 6-8 hours

**Week 5: Phase 5**
- Advanced filtering, aggregation, caching
- Time: 4-6 hours

**Week 6: Phase 6**
- Security, monitoring, deployment
- Time: 4-6 hours

**Plus:** 20-30 hours practice & projects

---

# ✨ Key Takeaways

✅ **Line-by-line Hinglish explanations** - हर line समझ आयेगी
✅ **6 complete phases** - Basics से Production तक
✅ **25+ interview questions** - सब topics covered
✅ **Real-world code** - Copy-paste ready
✅ **Security included** - Production grade
✅ **Mobile optimized** - Pagination, compression
✅ **Deployment ready** - PM2, Docker guides

---

# 🎓 After This Guide

You can:
- ✅ Design MongoDB schemas
- ✅ Implement complete CRUD APIs
- ✅ Add JWT authentication
- ✅ Handle errors properly
- ✅ Implement pagination & filtering
- ✅ Use aggregation pipelines
- ✅ Add security features
- ✅ Deploy to production
- ✅ Monitor applications
- ✅ Answer all interview questions

---

# 📞 Quick Reference

| Need | Where |
|------|-------|
| Phase 1 | Installation & setup |
| Phase 2 | Database fundamentals |
| Phase 3 | CRUD operations |
| Phase 4 | Authentication & JWT |
| Phase 5 | Advanced concepts |
| Phase 6 | Production ready |
| Interview | Interview questions section |

---

**Happy Learning! 🚀**

From Zero to Production-Ready Backend Developer in 6 Weeks.

Everything explained in Hinglish for easy understanding!

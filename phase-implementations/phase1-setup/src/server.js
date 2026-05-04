// ============================================
// PHASE 1: SERVER SETUP
// Ye file server ko start karta hai
// ============================================

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// ============ STEP 1: ENVIRONMENT VARIABLES LOAD KARO ============
dotenv.config();
// .env file se PORT, MONGODB_URI, JWT_SECRET etc load hoga
// Explanation:
// - dotenv = Package jo .env file read karta hai
// - config() = .env file ko process.env mein load karo

// ============ STEP 2: EXPRESS APP BANAO ============
const app = express();
// 'app' = Express application object
// Iska use karke:
// - Routes define karenge
// - Middleware lagayenge
// - Server start karenge

// ============ STEP 3: MIDDLEWARE CONFIGURE KARO ============

// Middleware 1: JSON parsing
app.use(express.json());
// Explanation:
// - express.json() = Incoming requests ka JSON body parse karega
// - Mobile app JSON bhejta hai: { "name": "Raj", "email": "..." }
// - Ye middleware isko JavaScript object mein convert karega
// - req.body mein access mil sakta hai

// Middleware 2: CORS (Cross-Origin Resource Sharing)
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  // Explanation:
  // - origin = Kaun kaun se domains requests kar sakte hain
  // - ALLOWED_ORIGINS.split(',') = Multiple URLs ko array mein convert karo
  // - '*' = Agar ALLOWED_ORIGINS nahi hai toh sab origins allow karo (dev ke liye)

  credentials: true
  // Cookies aur auth headers allow karo
}));

// ============ STEP 4: TEST ROUTES ============

// Route 1: Hello World
app.get('/api/hello', (req, res) => {
  // 'app.get()' = GET request handle karo
  // '/api/hello' = Endpoint path
  // '(req, res)' = Request aur Response objects

  res.json({
    message: 'Hello World from MongoDB Backend',
    status: 'Server is running'
  });
  // JSON response return karo
});

// Route 2: Health Check
app.get('/api/health', (req, res) => {
  // Mobile app server alive hai ya nahi check karne ke liye

  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// Route 3: Server Info
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Mobile App Backend',
    version: '1.0.0',
    phase: 'Phase 1 - Setup',
    features: [
      'Server setup',
      'CORS enabled',
      'Environment variables configured',
      'Ready for MongoDB connection'
    ]
  });
});

// ============ STEP 5: ERROR HANDLING - 404 ============

app.use((req, res) => {
  // Koi bhi request jo kisi route se match nahi hua

  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// ============ STEP 6: SERVER START KARO ============

const PORT = process.env.PORT || 5000;
// process.env.PORT = .env se value
// || 5000 = Agar .env mein PORT nahi hai toh default 5000

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  ✅ SERVER RUNNING                         ║
╠════════════════════════════════════════════╣
║  Port: ${PORT}                              ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
║  URL: http://localhost:${PORT}              ║
║  Test: http://localhost:${PORT}/api/hello   ║
╚════════════════════════════════════════════╝
  `);
});

// ============ STEP 7: GRACEFUL SHUTDOWN ============

process.on('SIGINT', () => {
  // Ctrl+C press karne par
  // Explanation:
  // - SIGINT = Interrupt signal (Ctrl+C)
  // - Graceful shutdown = Pending requests complete karo, fir server band karo

  console.log('\n🛑 Shutting down server gracefully...');

  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// ============ COMMON JS EQUIVALENT ============
/*
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
*/

export default app;

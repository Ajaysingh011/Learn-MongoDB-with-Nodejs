// ============================================
// PHASE 6: PRODUCTION SERVER
// Complete setup with security, logging, monitoring
// ============================================

import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from '../config/database.js';
import morgan from 'morgan';
import {
  securityConfig,
  corsConfig,
  productionLimiter,
  authLimiter,
  compressionConfig,
  validateEnvironment,
  performanceMonitoring
} from './config/production.js';

// ============ LOAD ENVIRONMENT VARIABLES ============

dotenv.config();

// Validate all required environment variables exist
validateEnvironment();

// ============ INITIALIZE EXPRESS APP ============

const app = express();

// ============ SECURITY MIDDLEWARE ============

// 1. Helmet - Security headers
app.use(securityConfig());
// Sets:
// - X-Frame-Options: DENY (clickjacking protection)
// - X-Content-Type-Options: nosniff (MIME sniffing protection)
// - Content-Security-Policy: Restrict resource loading
// - Strict-Transport-Security: Force HTTPS
// - X-XSS-Protection: Enable browser XSS filter

// 2. CORS - Cross-Origin Resource Sharing
app.use(require('cors')(corsConfig));
// Explanation:
// - Allow only specified origins
// - Credentials support for authentication
// - Whitelist methods and headers

// 3. Body parsing with size limit
app.use(express.json({ limit: '10mb' }));
// Limit: 10MB (prevent huge payload attacks)

app.use(express.urlencoded({ limit: '10mb' }));

// 4. Compression - Gzip responses
app.use(compressionConfig);
// Reduce response size by ~50%
// Mobile apps appreciate smaller payloads

// ============ LOGGING MIDDLEWARE ============

// Morgan - HTTP request logger
app.use(morgan('combined'));
// Log format: IP, timestamp, method, URL, status, response-time
// Example: 192.168.1.1 - - [15/Jan/2024:10:30:00 +0000] "GET /api/users HTTP/1.1" 200 1234

// Performance monitoring
app.use(performanceMonitoring);
// Log slow requests
// Flag requests > 1000ms as warnings

// ============ RATE LIMITING ============

// General API rate limiting
app.use('/api/', productionLimiter);
// 100 requests per 15 minutes per IP
// Explanation:
// - Prevent brute force attacks
// - Protect against DDoS
// - Fair usage enforcement

// Stricter rate limiting for auth endpoints
app.use('/api/auth/login', authLimiter);
// 5 attempts per 15 minutes
// skipSuccessfulRequests = Successful logins don't count

// ============ DATABASE CONNECTION ============

console.log('🔄 Connecting to MongoDB...');
await connectDB();
// Must connect before starting server
// Otherwise API won't work

// ============ HEALTH CHECK ENDPOINT ============

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    dbStatus: 'connected'  // Check in real app
  });
});

// ============ ROOT ENDPOINT ============

app.get('/', (req, res) => {
  res.json({
    message: 'Mobile App Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    documentation: '/api/docs'
  });
});

// ============ API ROUTES ============

// Import routes (add your routes here)
// import authRoutes from './routes/authRoutes.js';
// import userRoutes from './routes/userRoutes.js';
// app.use('/api/auth', authRoutes);
// app.use('/api', userRoutes);

// ============ 404 HANDLER ============

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method,
    timestamp: new Date()
  });
});

// ============ ERROR HANDLING MIDDLEWARE ============

app.use((err, req, res, next) => {
  // Explanation:
  // - 4 parameters (err, req, res, next) = Error handling middleware
  // - Express automatically routes errors here

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Log error
  console.error(`
╔════════════════════════════════════════╗
║  ERROR OCCURRED                        ║
╠════════════════════════════════════════╣
║  Status: ${statusCode}                    ║
║  Message: ${message}                    ║
║  Path: ${req.path}                      ║
║  Time: ${new Date().toISOString()}      ║
╚════════════════════════════════════════╝
  `);

  // Security: Don't leak stack trace in production
  const response = {
    success: false,
    message,
    statusCode
  };

  // In development: Include stack trace
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = err;
  }

  res.status(statusCode).json(response);
});

// ============ GRACEFUL SHUTDOWN ============

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  ✅ PRODUCTION SERVER RUNNING                         ║
║                                                        ║
╠════════════════════════════════════════════════════════╣
║  Port: ${PORT}                                          ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
║  URL: http://localhost:${PORT}                          ║
║  Health: http://localhost:${PORT}/api/health           ║
║  Mode: PRODUCTION                                      ║
║  Compression: Enabled (gzip)                          ║
║  Security: Helmet enabled                            ║
║  Rate Limiting: Active                               ║
║  Logging: Morgan + Custom                            ║
╚════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown on SIGTERM (deployment stop signal)
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, shutting down gracefully...');

  server.close(() => {
    console.log('✅ Server closed');

    // Close database connections
    // await disconnectDB();

    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    console.error('❌ Could not close connections in time, forcing shutdown');
    process.exit(1);
  }, 30000);
});

// Graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received, shutting down...');

  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  // In production: Send to error tracking service (Sentry)
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  // In production: Send to error tracking service
});

// ============ MONITORING SETUP ============

// Memory usage monitoring
setInterval(() => {
  const usage = process.memoryUsage();

  console.log(`
Memory Usage:
- Heap Used: ${Math.round(usage.heapUsed / 1024 / 1024)} MB
- Heap Total: ${Math.round(usage.heapTotal / 1024 / 1024)} MB
- External: ${Math.round(usage.external / 1024 / 1024)} MB
  `);

  // Alert if memory usage > 500MB
  if (usage.heapUsed > 500 * 1024 * 1024) {
    console.warn('⚠️  WARNING: High memory usage detected!');
    // In production: Send alert to monitoring service
  }
}, 60000);  // Every 1 minute

// ============ PRODUCTION DEPLOYMENT ============

// This server should be run with:
// 1. PM2 for process management
// 2. Nginx as reverse proxy
// 3. Docker for containerization
// 4. Kubernetes for orchestration (optional)

/*
PM2 Command:
pm2 start src/server-production.js --name "backend-api" --env production

Ecosystem file (ecosystem.config.js):
module.exports = {
  apps: [{
    name: 'backend-api',
    script: './src/server-production.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};

Nginx Reverse Proxy:
server {
  listen 80;
  server_name yourdomain.com;

  location / {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}

Docker:
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server-production.js"]
*/

// ============ COMMON JS EQUIVALENT ============
/*
const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));

app.get('/api/health', (req, res) => {
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
*/

export default app;

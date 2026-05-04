// ============================================
// PHASE 6: PRODUCTION CONFIGURATION
// Security, logging, monitoring setup
// ============================================

import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import compression from 'compression';

// ============ SECURITY CONFIGURATION ============

export const securityConfig = () => {
  return helmet({
    // Explanation:
    // - helmet = Security headers automatically set karta hai
    // - XSS, clickjacking, MIME sniffing attacks se protect

    contentSecurityPolicy: {
      // CSP = Content Security Policy
      // Kaun se sources se scripts load ho sakte hain
      directives: {
        defaultSrc: ["'self'"],  // Same origin se hi load ho
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:']
      }
    },

    hsts: {
      // HSTS = HTTP Strict Transport Security
      // Force HTTPS connection
      maxAge: 31536000,  // 1 year
      includeSubDomains: true,
      preload: true
    },

    frameguard: {
      // Prevent clickjacking attacks
      action: 'deny'
    },

    noSniff: true,
    // Prevent MIME type sniffing

    xssFilter: true
    // Enable XSS filter in browsers
  });
};

// ============ CORS CONFIGURATION ============

export const corsConfig = {
  origin: function(origin, callback) {
    // Explanation:
    // - Custom CORS validator function
    // - origin = Client ka domain

    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://yourapp.com',
      'https://www.yourapp.com'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      // Allow request
    } else {
      callback(new Error('Not allowed by CORS'));
      // Block request
    }
  },

  credentials: true,
  // Allow cookies aur auth headers

  optionsSuccessStatus: 200,
  // Some legacy browsers return 204

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// ============ LOGGING CONFIGURATION ============

export const loggingConfig = {
  format: 'combined',
  // 'combined' = Detailed logging
  // Format: IP, timestamp, method, URL, status, response-time

  skip: function(req, res) {
    // Skip logging for health checks (reduce noise)
    return req.path === '/api/health';
  },

  stream: {
    write: function(message) {
      // Custom logging (e.g., write to file)
      console.log(message.trim());
    }
  }
};

// ============ RATE LIMITING - PRODUCTION ============

export const productionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  // Return rate limit info in headers
  skip: (req, res) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  },
  keyGenerator: (req, res) => {
    // Custom key (use IP address)
    return req.ip;
  }
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // 5 attempts only
  message: 'Too many login attempts, please try again after 15 minutes',
  skipSuccessfulRequests: true,
  // Successful requests don't count
  delayAfterWrongPassword: 2000
  // 2 second delay after wrong password
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute window
  max: 30,  // 30 requests per minute (strict)
  message: 'Too many API requests'
});

// ============ COMPRESSION ============

export const compressionConfig = compression({
  // Explanation:
  // - compression = Gzip response bodies
  // - 50% size reduction, faster transfer

  level: 6,  // Compression level 1-9 (6 = good balance)
  threshold: 1024  // Only compress responses > 1KB
});

// ============ ENVIRONMENT VALIDATION ============

export const validateEnvironment = () => {
  const required = [
    'PORT',
    'MONGODB_URI',
    'NODE_ENV',
    'JWT_SECRET'
  ];

  const missing = required.filter(env => !process.env[env]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }

  // Warn if using weak JWT secret in production
  if (process.env.NODE_ENV === 'production') {
    if (process.env.JWT_SECRET.length < 32) {
      console.warn('⚠️  WARNING: JWT_SECRET is too short (min 32 chars)');
    }
  }
};

// ============ ERROR TRACKING (Sentry Integration) ============

export const errorTracking = () => {
  // Pseudo code - Install sentry in real project
  // npm install @sentry/node

  // const Sentry = require('@sentry/node');
  // Sentry.init({
  //   dsn: process.env.SENTRY_DSN,
  //   environment: process.env.NODE_ENV,
  //   tracesSampleRate: 1.0
  // });
  // return Sentry;
};

// ============ MONITORING - PERFORMANCE ============

export const performanceMonitoring = (req, res, next) => {
  // Explanation:
  // - Monitor response times
  // - Flag slow endpoints

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    // Flag slow responses
    if (duration > 1000) {
      console.warn(`⚠️  SLOW ENDPOINT: ${req.method} ${req.path} took ${duration}ms`);
    }

    // Log all requests
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${duration}ms - Status: ${res.statusCode}`);
  });

  next();
};

// ============ DATABASE CONNECTION POOLING ============

// Mongoose automatically uses connection pooling
// Configure pool size:
export const mongooseConfig = {
  maxPoolSize: 10,  // Maximum connections in pool
  minPoolSize: 5,   // Minimum connections to maintain
  maxIdleTimeMS: 30000,  // 30 seconds idle timeout
  serverSelectionTimeoutMS: 5000
};

// ============ CACHING STRATEGY ============

export const cachingStrategy = {
  // Redis setup (for distributed caching)
  // npm install redis

  // const redis = require('redis');
  // const client = redis.createClient({
  //   host: 'localhost',
  //   port: 6379
  // });

  ttl: 300,  // Cache for 5 minutes

  // Cache keys strategy:
  // users:page:1 = First page of users
  // user:id:123 = Specific user
  // stats:daily = Daily statistics
};

// ============ DATABASE BACKUP ============

export const backupConfig = {
  // Automated backup configuration

  schedule: '0 2 * * *',  // 2 AM daily
  // Explanation:
  // - cron format: minute hour day month weekday
  // - 0 = minute 0
  // - 2 = hour 2 (2 AM)
  // - * = every day/month

  retention: 30,  // Keep 30 days of backups

  location: '/backups/mongodb',

  // Command to backup:
  // mongodump --uri="mongodb://..." --out=/backups/mongodb
};

// ============ LOG ROTATION ============

export const logRotationConfig = {
  // Rotate logs daily to prevent huge files

  format: 'YYYY-MM-DD',
  // Log file: access-2024-01-15.log

  maxDays: 30,
  // Keep 30 days of logs

  maxSize: '100m'
  // Rotate when file reaches 100MB
};

// ============ MONITORING TOOLS ============

export const monitoringSetup = `
Production Monitoring Tools:

1. Application Performance Monitoring (APM)
   └─ New Relic, DataDog, AppDynamics
   └─ Track: Response times, errors, throughput

2. Error Tracking
   └─ Sentry, Rollbar, Bugsnag
   └─ Capture: Exceptions, stack traces

3. Logging
   └─ ELK Stack (Elasticsearch, Logstash, Kibana)
   └─ Splunk, CloudWatch
   └─ Centralized log analysis

4. Metrics & Alerts
   └─ Prometheus, Grafana
   └─ Monitor: CPU, memory, disk, network

5. Uptime Monitoring
   └─ StatusPage.io, Pingdom
   └─ Alert on downtime

6. Security Scanning
   └─ OWASP ZAP, Burp Suite
   └─ Regular vulnerability scans

7. Database Monitoring
   └─ MongoDB Atlas Monitoring
   └─ Monitor: Query performance, storage
`;

// ============ DEPLOYMENT CHECKLIST ============

export const deploymentChecklist = `
✅ Pre-Deployment Checklist:

Code Quality:
☐ Run linter (eslint)
☐ Run tests (jest)
☐ Code review done
☐ Security audit passed
☐ No console.log() in code

Environment:
☐ .env file configured
☐ All secrets in env variables
☐ NODE_ENV=production
☐ JWT_SECRET is strong (32+ chars)
☐ MONGODB_URI points to production DB

Security:
☐ Helmet enabled
☐ CORS properly configured
☐ Rate limiting active
☐ Password encryption working
☐ Input validation enabled
☐ SQL injection protection (Mongoose)
☐ HTTPS enabled

Database:
☐ Backups configured
☐ Indexes created
☐ Connection pooling set
☐ Database user permissions restricted
☐ Read replicas configured (optional)

Monitoring:
☐ Logging configured
☐ Error tracking (Sentry) setup
☐ APM tool integrated
☐ Alerts configured
☐ Dashboards created

Deployment:
☐ CI/CD pipeline tested
☐ Zero-downtime deployment plan
☐ Rollback plan ready
☐ Load balancer configured
☐ DNS updated
☐ SSL certificate installed

Testing:
☐ Load test performed
☐ Security test passed
☐ All API endpoints tested
☐ Error scenarios tested
☐ Database failover tested
`;

// ============ PRODUCTION SERVER SETUP ============

export const productionServerSetup = `
Production Server Setup:

1. Reverse Proxy (Nginx)
   ├─ Load balancing
   ├─ SSL termination
   ├─ Request routing
   └─ Caching static files

2. Process Manager (PM2)
   ├─ Auto restart on crash
   ├─ Cluster mode (multiple cores)
   ├─ Logging
   └─ Zero-downtime restart

3. Container (Docker)
   ├─ Isolated environment
   ├─ Consistent across machines
   ├─ Easy scaling
   └─ Automated deployment

4. Orchestration (Kubernetes)
   ├─ Auto-scaling
   ├─ Load balancing
   ├─ Rolling updates
   └─ High availability

5. Cloud Platform
   ├─ Heroku (Simple)
   ├─ Railway (Easy)
   ├─ AWS (Powerful)
   ├─ Google Cloud
   └─ Azure

Commands:
# PM2
pm2 start src/server.js --name backend
pm2 ecosystem
pm2 start ecosystem.config.js --env production

# Docker
docker build -t mobile-backend .
docker run -p 5000:5000 mobile-backend

# Kubernetes
kubectl apply -f deployment.yaml
kubectl scale deployment backend --replicas=3
`;

// ============ COMMON JS EQUIVALENT ============
/*
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const securityConfig = () => helmet();

const corsConfig = {
  origin: 'https://yourapp.com',
  credentials: true
};

module.exports = {
  securityConfig,
  corsConfig,
  productionLimiter
};
*/

# 📚 Phase 5 & 6: Advanced & Production Implementation

**Complete code for advanced MongoDB operations and production-grade deployment**

---

## 🚀 Phase 5: Advanced Concepts (700+ lines)

### File Structure

```
phase5-advanced/
└── src/
    └── controllers/
        └── advancedController.js (700+ lines, 100% explained)
```

### What's Included in Phase 5

#### 1. **Advanced Pagination** ✅
- Pagination formula: `skip = (page - 1) * limit`
- Next/previous page info
- Mobile app optimization

```javascript
// Example: /api/users?page=2&limit=10
// Skip: 10, Limit: 10, Get items 11-20
const skip = (page - 1) * limit;
```

#### 2. **Advanced Filtering** ✅
- Name search (regex, case-insensitive)
- Age range filtering ($gte, $lte operators)
- Multiple field filtering
- Role-based filtering
- Combining filters with $or

```javascript
// Example: /api/users?name=raj&minAge=25&maxAge=35
// Returns: Users with name containing 'raj' aged 25-35
filter.name = { $regex: name, $options: 'i' };
filter.age = { $gte: minAge, $lte: maxAge };
```

#### 3. **Search Across Multiple Fields** ✅
- Search in name, email, phone, bio
- $or operator for multiple conditions
- Minimum search length validation

```javascript
// Example: /api/search?q=raj
// Searches: name, email, phone, bio for "raj"
const searchFilter = {
  $or: [
    { name: { $regex: q, $options: 'i' } },
    { email: { $regex: q, $options: 'i' } },
    { phone: { $regex: q, $options: 'i' } }
  ]
};
```

#### 4. **Aggregation Pipeline** ✅
- Complex data processing in database
- Group, count, calculate statistics
- More efficient than application-level processing

```javascript
// Example: Get user statistics by role
// Group by role, count users, calculate average age
const stats = await User.aggregate([
  { $match: { isActive: true } },
  { $group: {
      _id: '$role',
      totalUsers: { $sum: 1 },
      avgAge: { $avg: '$age' }
    }
  }
]);
```

#### 5. **Bulk Operations** ✅
- Update multiple users at once
- Delete multiple users efficiently
- $in operator for array matching

```javascript
// Example: Update 5 users at once
const result = await User.updateMany(
  { _id: { $in: userIds } },
  { $set: { isActive: false } }
);
```

#### 6. **Text Search** ✅
- Full-text search across fields
- Relevance scoring
- Requires text index on fields

```javascript
// Example: /api/search/text?text=nodejs
// Searches all text-indexed fields
const users = await User.find(
  { $text: { $search: text } },
  { score: { $meta: "textScore" } }
);
```

#### 7. **Export Data** ✅
- Export as JSON
- Export as CSV
- Useful for reports & backups

```javascript
// Example: /api/users/export?format=csv
// Returns: CSV file with all user data
// Headers: ID, Name, Email, Phone, Role, Created
```

#### 8. **Performance Optimization** ✅
- In-memory caching with TTL
- Cache expiry management
- Reduces database queries

```javascript
// Example: Cache users for 5 minutes
cache.set('all_users', {
  data: users,
  timestamp: Date.now()
});
```

#### 9. **Database Indexes** ✅
- Get index information
- Understand index usage
- Performance impact

```javascript
// Example: Check all indexes
const indexes = await User.collection.getIndexes();
```

---

## 🎯 Phase 6: Production Ready (600+ lines)

### File Structure

```
phase6-production/
├── src/
│   ├── config/
│   │   └── production.js (600+ lines, 100% explained)
│   └── server-production.js (300+ lines, 100% explained)
```

### What's Included in Phase 6

#### 1. **Security Configuration** ✅
- Helmet.js for security headers
- XSS protection
- Clickjacking prevention
- MIME sniffing prevention
- HSTS (force HTTPS)
- Content Security Policy

```javascript
// Helmet automatically sets:
// - X-Frame-Options: DENY
// - X-Content-Type-Options: nosniff
// - Strict-Transport-Security: max-age=31536000
// - Content-Security-Policy: restrict resource loading
```

#### 2. **CORS Configuration** ✅
- Whitelist allowed origins
- Custom origin validation
- Support for credentials
- Prevent unauthorized domains

```javascript
// Only these origins can access API:
const allowedOrigins = [
  'http://localhost:3000',
  'https://yourapp.com'
];
```

#### 3. **Production Logging** ✅
- Morgan HTTP logger
- Request logging format
- Skip health check logs (reduce noise)
- Response time tracking

```javascript
// Log format:
// 192.168.1.1 - - [15/Jan/2024:10:30:00] "GET /api/users HTTP/1.1" 200 1234
```

#### 4. **Advanced Rate Limiting** ✅
- General API rate limiting (100/15 min)
- Auth-specific limiting (5/15 min)
- Skip successful requests
- Delay after failed login
- Per-IP tracking

```javascript
// General: 100 requests per 15 minutes
// Login: 5 attempts per 15 minutes (fails only)
// After wrong password: 2 second delay
```

#### 5. **Response Compression** ✅
- Gzip compression enabled
- ~50% size reduction
- Mobile app optimization
- Smart threshold (only compress >1KB)

```javascript
// Compression level: 6 (good balance)
// Reduces bandwidth usage
// Faster for mobile networks
```

#### 6. **Environment Validation** ✅
- Check required variables exist
- Warn about weak JWT secret
- Prevent production deployment with missing config

```javascript
// Required: PORT, MONGODB_URI, NODE_ENV, JWT_SECRET
// Warning: JWT_SECRET must be 32+ characters
```

#### 7. **Error Tracking** ✅
- Centralized error handling
- Stack traces in development only
- Security: Don't leak sensitive info in production
- Integration with Sentry (optional)

```javascript
// Production: Hide stack trace
// Development: Show full stack trace for debugging
```

#### 8. **Performance Monitoring** ✅
- Track response times
- Flag slow endpoints
- Memory usage monitoring
- Alert on high memory

```javascript
// Log slow requests (>1000ms)
// Monitor memory every 1 minute
// Alert if >500MB used
```

#### 9. **Database Connection Pooling** ✅
- Optimize connection management
- Max 10 connections in pool
- Min 5 connections to maintain
- Idle timeout management

```javascript
maxPoolSize: 10,    // Max connections
minPoolSize: 5,     // Min connections
maxIdleTimeMS: 30000 // 30 second timeout
```

#### 10. **Graceful Shutdown** ✅
- Handle SIGTERM (deployment stop)
- Handle SIGINT (Ctrl+C)
- Close connections properly
- Force shutdown timeout (30 sec)
- Handle uncaught exceptions
- Handle unhandled rejections

```javascript
// On SIGTERM: Close connections, exit gracefully
// If not closed in 30s: Force shutdown
// Prevents data corruption
```

#### 11. **Production Checklist** ✅
- Pre-deployment verification
- Code quality checks
- Environment setup
- Security validation
- Database preparation
- Monitoring setup
- Testing completion

#### 12. **Deployment Options** ✅
- PM2 (Node.js process manager)
- Docker (containerization)
- Kubernetes (orchestration)
- Cloud platforms (Heroku, Railway, AWS)

---

## 🔧 Implementation Examples

### Phase 5: Advanced Pagination

```javascript
// GET /api/users?page=2&limit=10
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const total = await User.countDocuments();
const users = await User.find()
  .skip(skip)
  .limit(limit)
  .lean();

res.json({
  data: users,
  pagination: {
    total: 150,
    page: 2,
    limit: 10,
    totalPages: 15,
    hasNextPage: true,
    hasPrevPage: true
  }
});
```

### Phase 5: Complex Filtering

```javascript
// GET /api/users?name=raj&minAge=25&maxAge=35&isActive=true
const filter = {};

if (name) filter.name = { $regex: name, $options: 'i' };
if (minAge) filter.age = { $gte: minAge };
if (maxAge) {
  if (!filter.age) filter.age = {};
  filter.age.$lte = maxAge;
}
if (isActive) filter.isActive = isActive === 'true';

const users = await User.find(filter);
```

### Phase 5: Aggregation Pipeline

```javascript
// Get statistics by role
const stats = await User.aggregate([
  { $match: { isActive: true } },
  { $group: {
      _id: '$role',
      totalUsers: { $sum: 1 },
      avgAge: { $avg: '$age' },
      minAge: { $min: '$age' },
      maxAge: { $max: '$age' }
    }
  },
  { $sort: { totalUsers: -1 } }
]);

// Response:
[
  {
    _id: 'admin',
    totalUsers: 5,
    avgAge: 35,
    minAge: 28,
    maxAge: 42
  },
  {
    _id: 'user',
    totalUsers: 95,
    avgAge: 28,
    minAge: 18,
    maxAge: 65
  }
]
```

### Phase 6: Production Server

```javascript
// Full setup with security, logging, monitoring
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { productionLimiter } from './config/production.js';

const app = express();

// Security
app.use(helmet());

// CORS
app.use(cors(corsConfig));

// Logging
app.use(morgan('combined'));

// Rate limiting
app.use('/api/', productionLimiter);

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
```

---

## 📊 API Endpoints

### Phase 5: Advanced Endpoints

| Method | Endpoint | Query Parameters | Description |
|--------|----------|------------------|-------------|
| GET | /api/users/paginated | page, limit | Paginated users with info |
| GET | /api/users/filter | name, minAge, maxAge, isActive, role, sortBy | Advanced filtering |
| GET | /api/users/search | q | Multi-field search |
| GET | /api/stats | - | User statistics by role |
| POST | /api/users/bulk-update | ids[], updateData | Update multiple users |
| GET | /api/users/export | format (json/csv) | Export users |
| GET | /api/index-info | - | Database index information |
| GET | /api/cache/users | - | Get cached users |

### Phase 6: Production Features

- Security headers via Helmet
- CORS protection
- Rate limiting (100/15 min)
- Gzip compression
- Request logging
- Error handling
- Graceful shutdown

---

## 🚀 How to Use Phase 5 & 6

### Phase 5: Copy Advanced Controller

```bash
cp phase5-advanced/src/controllers/advancedController.js \
   src/controllers/advancedController.js
```

### Create Routes for Phase 5

```javascript
// src/routes/advancedRoutes.js
import express from 'express';
import * as advancedController from '../controllers/advancedController.js';

const router = express.Router();

router.get('/users/paginated', advancedController.getPaginatedUsers);
router.get('/users/filter', advancedController.filterUsers);
router.get('/users/search', advancedController.searchUsers);
router.get('/stats', advancedController.getUserStatistics);
router.post('/users/bulk-update', advancedController.bulkUpdateUsers);
router.get('/users/export', advancedController.exportUsers);
router.get('/index-info', advancedController.getIndexInfo);
router.get('/cache/users', advancedController.getCachedUsers);

export default router;
```

### Phase 6: Setup Production Server

```bash
# Copy production config
cp phase6-production/src/config/production.js src/config/
cp phase6-production/src/server-production.js src/

# Install production dependencies
npm install helmet compression morgan

# Start with PM2
pm2 start src/server-production.js --name "backend"
```

---

## 🔐 Security Features

✅ Helmet security headers
✅ CORS whitelist
✅ Rate limiting
✅ Gzip compression
✅ Error handling (no stack trace in production)
✅ Environment validation
✅ Graceful shutdown
✅ Input validation from Phase 4
✅ JWT authentication from Phase 4
✅ Password encryption from Phase 4

---

## 📈 Performance Features

✅ Pagination (reduce memory usage)
✅ Filtering (reduce data transfer)
✅ Aggregation (server-side processing)
✅ Caching (reduce database queries)
✅ Compression (50% size reduction)
✅ Indexing (faster queries)
✅ Connection pooling (manage resources)
✅ Monitoring (track performance)

---

## 🎓 Interview Questions

### Phase 5 Questions
1. "Pagination formula kya hai?"
   - Answer: `skip = (page - 1) * limit`

2. "$regex MongoDB operator mein kya karta hai?"
   - Answer: Pattern matching करता है (case-insensitive के साथ)

3. "Aggregation pipeline kya hai?"
   - Answer: Complex database operations ($match, $group, $sort)

4. "Caching kyun zaroori hai?"
   - Answer: Database queries reduce करके performance improve होती है

5. "Text search kaise implement karte ho?"
   - Answer: Text index बना के `$text` operator use करते हैं

### Phase 6 Questions
1. "Helmet middleware kya karta hai?"
   - Answer: Security headers automatically set करता है

2. "Rate limiting kyun zaroori hai?"
   - Answer: Brute force attacks और spam से protection

3. "Graceful shutdown क्या होता है?"
   - Answer: Pending requests complete करके फिर server बंद करना

4. "Production vs Development mein difference?"
   - Answer: Production में stack trace hide करते हैं, security strict है

5. "Compression से kya faida?"
   - Answer: Response size 50% reduce होता है, mobile users के लिए अच्छा

---

## 📚 Related Files

- **COMPLETE_BACKEND_GUIDE.md** - Phase 5 & 6 theory
- **phase-implementations/README.md** - Implementation guide
- **phase-implementations/QUICK_START.md** - Quick setup

---

## ✨ Summary

**Phase 5: Advanced Concepts** (700+ lines)
- Pagination, filtering, search
- Aggregation pipelines
- Bulk operations
- Performance optimization
- Caching strategies

**Phase 6: Production Ready** (600+ lines)
- Security (Helmet, CORS, rate limiting)
- Logging (Morgan)
- Monitoring (performance, memory)
- Error handling
- Graceful shutdown
- Deployment options

---

**Total: 1300+ lines of advanced production-ready code**

All code is 100% explained in Hinglish! 🎓

// ============================================
// PHASE 5: ADVANCED CONCEPTS
// Pagination, filtering, aggregation, optimization
// ============================================

import { User } from '../models/User.js';

// ============ ADVANCED PAGINATION ============

export const getPaginatedUsers = async (req, res) => {
  try {
    // Step 1: Get pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Explanation:
    // - page = Kaun sa page (1, 2, 3, etc)
    // - limit = Har page mein kitne items (default 10)
    // - parseInt() = String ko number mein convert karo

    // Step 2: Validation - reasonable values
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination parameters',
        details: 'Page >= 1, Limit >= 1, Limit <= 100'
      });
    }

    // Step 3: Calculate skip
    const skip = (page - 1) * limit;
    // Explanation:
    // PAGINATION FORMULA:
    // Page 1: skip = (1-1)*10 = 0      (items 1-10)
    // Page 2: skip = (2-1)*10 = 10     (items 11-20)
    // Page 3: skip = (3-1)*10 = 20     (items 21-30)
    //
    // Real-world example:
    // Instagram: 20 posts per page
    // Page 1: skip 0
    // Page 2: skip 20
    // Page 3: skip 40

    // Step 4: Get total count (for pagination info)
    const total = await User.countDocuments();
    // Sab users kitne hain

    // Step 5: Calculate total pages
    const totalPages = Math.ceil(total / limit);
    // Math.ceil() = Round up
    // Example: 25 users, 10 per page = 3 pages
    // (25/10 = 2.5 → ceil = 3)

    // Step 6: Fetch users with pagination
    const users = await User.find()
      .select('-password')           // Exclude password
      .skip(skip)                    // Skip 'skip' documents
      .limit(limit)                  // Limit to 'limit' documents
      .sort({ createdAt: -1 })       // Newest first (-1 = descending)
      .lean();                       // Performance optimization

    // Step 7: Calculate prev/next page info
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Step 8: Send response
    res.status(200).json({
      success: true,
      message: `Page ${page} of ${totalPages}`,
      data: users,
      pagination: {
        total,              // Total users
        page,               // Current page
        limit,              // Items per page
        totalPages,         // Total pages
        hasNextPage,        // Next page exists?
        hasPrevPage,        // Previous page exists?
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ ADVANCED FILTERING ============

export const filterUsers = async (req, res) => {
  try {
    // Step 1: Extract filter parameters
    const {
      name,           // Search by name
      email,          // Exact email match
      minAge,         // Minimum age
      maxAge,         // Maximum age
      isActive,       // Active status
      role,           // User role
      phone,          // Phone search
      sortBy = 'createdAt',  // Sort field
      sortOrder = -1,        // -1 (desc) or 1 (asc)
      page = 1,
      limit = 10
    } = req.query;

    // Step 2: Build filter object
    const filter = {};

    // Filter 1: Name search (case-insensitive pattern matching)
    if (name) {
      filter.name = {
        $regex: name,      // Regular expression
        $options: 'i'      // 'i' = case-insensitive
      };
      // Explanation:
      // - $regex = Pattern matching operator
      // - Search "raj" matches: "Raj", "RAJ", "raj", "Rajesh"
      // - Example: /api/users/search?name=raj
    }

    // Filter 2: Email exact match
    if (email) {
      filter.email = email.toLowerCase();
      // Exact match (case-insensitive)
    }

    // Filter 3: Age range
    if (minAge || maxAge) {
      filter.age = {};

      if (minAge) {
        filter.age.$gte = parseInt(minAge);
        // '$gte' = Greater than or equal
        // age >= 25
      }

      if (maxAge) {
        filter.age.$lte = parseInt(maxAge);
        // '$lte' = Less than or equal
        // age <= 35
      }
      // Example: /api/users?minAge=25&maxAge=35
      // Returns: Users with age between 25-35
    }

    // Filter 4: Active status
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
      // Convert string 'true' to boolean
      // Example: /api/users?isActive=true
    }

    // Filter 5: Role filter
    if (role) {
      filter.role = role;
      // Example: /api/users?role=admin
    }

    // Filter 6: Phone contains search
    if (phone) {
      filter.phone = {
        $regex: phone,
        $options: 'i'
      };
      // Partial phone number search
    }

    // Step 3: Count total matching documents
    const total = await User.countDocuments(filter);

    // Step 4: Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Step 5: Fetch filtered & paginated users
    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ [sortBy]: parseInt(sortOrder) })
      .lean();

    // Step 6: Response
    res.status(200).json({
      success: true,
      message: `Found ${total} users matching filters`,
      filters: {
        name: name || null,
        email: email || null,
        ageRange: (minAge || maxAge) ? { min: minAge, max: maxAge } : null,
        isActive: isActive || null,
        role: role || null
      },
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

// ============ ADVANCED SEARCH ============

export const searchUsers = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    // 'q' = Search query (name, email, phone ko search karega)

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    // Build search filter (multiple fields)
    const searchFilter = {
      $or: [
        // Name contains
        { name: { $regex: q, $options: 'i' } },
        // Email contains
        { email: { $regex: q, $options: 'i' } },
        // Phone contains
        { phone: { $regex: q, $options: 'i' } },
        // Bio contains
        { bio: { $regex: q, $options: 'i' } }
      ]
    };
    // Explanation:
    // - $or = Match any one of these conditions
    // - Example: Search "raj" finds:
    //   - Names: Raj, Rajesh, Rajini
    //   - Emails: raj@..., rajesh@...
    //   - Phones: 9876543210 (if contains raj)

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(searchFilter);

    const users = await User.find(searchFilter)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      message: `Found ${total} users for search: "${q}"`,
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

// ============ AGGREGATION PIPELINE ============

export const getUserStatistics = async (req, res) => {
  try {
    // Aggregation = Complex data processing in database
    // More efficient than fetching all and processing

    const stats = await User.aggregate([
      // Stage 1: Match active users only
      {
        $match: { isActive: true }
      },

      // Stage 2: Group by role and calculate stats
      {
        $group: {
          _id: '$role',  // Group by role

          totalUsers: { $sum: 1 },  // Count users
          // Explanation:
          // - $sum: 1 = Count each document (1 per doc)
          // - If 5 users with role 'admin', totalUsers = 5

          avgAge: { $avg: '$age' },  // Average age
          // - $avg = Calculate average

          minAge: { $min: '$age' },  // Minimum age
          maxAge: { $max: '$age' },  // Maximum age

          createdUsers: {
            $push: '$name'  // Create array of names
          }
        }
      },

      // Stage 3: Sort by totalUsers (descending)
      {
        $sort: { totalUsers: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'User statistics by role',
      data: stats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Example response:
/*
{
  "success": true,
  "data": [
    {
      "_id": "admin",
      "totalUsers": 5,
      "avgAge": 32.5,
      "minAge": 28,
      "maxAge": 38,
      "createdUsers": ["Raj", "Priya", "Amit"]
    },
    {
      "_id": "user",
      "totalUsers": 95,
      "avgAge": 26.3,
      "minAge": 18,
      "maxAge": 45,
      "createdUsers": [...]
    }
  ]
}
*/

// ============ BULK OPERATIONS ============

export const bulkUpdateUsers = async (req, res) => {
  try {
    const { userIds, updateData } = req.body;
    // userIds = Array of user IDs to update
    // updateData = Fields to update

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide array of user IDs'
      });
    }

    // Update multiple users at once
    const result = await User.updateMany(
      {
        _id: { $in: userIds }  // $in = Match any ID in array
      },
      {
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} users updated`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ TEXT SEARCH ============

export const textSearch = async (req, res) => {
  try {
    const { text } = req.query;

    if (!text || text.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search text must be at least 2 characters'
      });
    }

    // Text search across multiple fields
    // Note: Requires text index on fields
    // Create index: db.users.createIndex({ name: "text", email: "text", bio: "text" })

    const users = await User.find(
      { $text: { $search: text } },
      { score: { $meta: "textScore" } }  // Return relevance score
    )
      .select('-password')
      .sort({ score: { $meta: "textScore" } })  // Sort by relevance
      .limit(20);

    res.status(200).json({
      success: true,
      message: `Found ${users.length} results for "${text}"`,
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ EXPORT USERS (CSV) ============

export const exportUsers = async (req, res) => {
  try {
    const { format = 'json' } = req.query;
    // format = 'json' or 'csv'

    const users = await User.find()
      .select('-password')
      .lean();

    if (format === 'csv') {
      // Convert to CSV format
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Role', 'Created'];
      const rows = users.map(u => [
        u._id,
        u.name,
        u.email,
        u.phone || '',
        u.role,
        u.createdAt
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
      res.send(csv);
    } else {
      // JSON format
      res.json({
        success: true,
        count: users.length,
        data: users
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ DATABASE INDEXING INFO ============

export const getIndexInfo = async (req, res) => {
  try {
    // Get all indexes on User collection
    const indexes = await User.collection.getIndexes();

    res.json({
      success: true,
      message: 'Database indexes',
      indexes
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ CACHE OPTIMIZATION ============

// Simple in-memory cache (for small datasets)
const cache = new Map();

export const getCachedUsers = async (req, res) => {
  try {
    const cacheKey = 'all_users';
    const cacheExpiry = 5 * 60 * 1000;  // 5 minutes

    // Check cache
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < cacheExpiry) {
        return res.json({
          success: true,
          message: 'Data from cache',
          data: cached.data
        });
      }
    }

    // Not in cache, fetch from database
    const users = await User.find()
      .select('-password')
      .lean();

    // Store in cache
    cache.set(cacheKey, {
      data: users,
      timestamp: Date.now()
    });

    res.json({
      success: true,
      message: 'Data from database',
      data: users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ COMMON JS EQUIVALENT ============
/*
const getPaginatedUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await User.countDocuments();
  const users = await User.find()
    .skip(skip)
    .limit(limit)
    .lean();

  res.json({
    success: true,
    data: users,
    pagination: { total, page, limit }
  });
};

module.exports = { getPaginatedUsers, filterUsers };
*/

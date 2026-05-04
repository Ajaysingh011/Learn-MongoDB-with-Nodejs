// ============================================
// PHASE 3: CRUD CONTROLLERS
// Business logic - database operations
// ============================================

import { User } from '../models/User.js';

// ============ CREATE - POST /api/users ============

export const createUser = async (req, res) => {
  try {
    // Step 1: Request se data extract karo
    const { name, email, password, confirmPassword, phone } = req.body;
    // Explanation:
    // - req.body = Mobile app ne JSON mein bheja data
    // - Destructuring = Directly variables mein assign karna

    // Step 2: Validation - sab fields present hain?
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
        code: 'MISSING_FIELDS'
      });
      // 400 = Bad Request (client ki galti)
      // 'return' = Function yahi end karo
    }

    // Step 3: Validation - email format check karo
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
        code: 'INVALID_EMAIL'
      });
    }

    // Step 4: Validation - password match karte hain?
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
        code: 'PASSWORD_MISMATCH'
      });
    }

    // Step 5: Validation - password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
        code: 'PASSWORD_TOO_SHORT'
      });
    }

    // Step 6: Check - email pehle se exist karta hai?
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    // Explanation:
    // - findOne() = Database mein ek document dhundo
    // - email.toLowerCase() = Case insensitive search
    // - await = Complete hone tak wait karo

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
        code: 'EMAIL_EXISTS'
      });
    }

    // Step 7: Naya user object banao
    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      phone: phone || null
    });
    // Explanation:
    // - new User() = Model se instance banao
    // - Abhi database mein nahi gaya (in-memory)
    // - trim() = Extra spaces hatao

    // Step 8: Database mein save karo
    await newUser.save();
    // Explanation:
    // - save() method ko call karna padta hai
    // - Yahan:
    //   1. Validation run hota hai
    //   2. Pre-save hook run hota hai (password encrypt)
    //   3. Database mein insert hota hai
    //   4. _id auto-generate hota hai

    // Step 9: Success response banao
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        createdAt: newUser.createdAt
      }
    });
    // 201 = Created (naya resource banaya)

  } catch (error) {
    // Error handling
    console.error('Create user error:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Error creating user',
      code: 'CREATE_ERROR'
    });
    // 500 = Server error
  }
};

// ============ READ ALL - GET /api/users ============

export const getAllUsers = async (req, res) => {
  try {
    // Step 1: Query parameters get karo
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    // Explanation:
    // - req.query = URL ke ? ke baad ka data
    // - /api/users?page=1&limit=10
    // - parseInt() = String ko number mein convert karo

    // Step 2: Validation
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pagination parameters'
      });
    }

    // Step 3: Calculate skip
    const skip = (page - 1) * limit;
    // Explanation:
    // - Page 1: (1-1)*10 = 0 skip
    // - Page 2: (2-1)*10 = 10 skip (first 10 documents)
    // - Page 3: (3-1)*10 = 20 skip (next 10 documents)

    // Step 4: Total count get karo
    const total = await User.countDocuments();
    // Sab users kitne hain

    // Step 5: Users fetch karo with pagination
    const users = await User.find()
      .select('-password')    // Password exclude karo
      .limit(limit)           // Max 'limit' documents
      .skip(skip)             // Skip karte hain
      .sort({ createdAt: -1 }) // Newest first (-1)
      .lean();                // Simple objects return (fast)
    // Explanation:
    // - find() = Sab documents return karo
    // - select('-password') = Password field nahi chahiye
    // - limit(10) = Maximum 10 return karo
    // - skip(20) = Pehle 20 skip karo
    // - sort({ createdAt: -1 }) = Newest first
    // - lean() = Mongoose document overhead nahi

    // Step 6: Calculate total pages
    const totalPages = Math.ceil(total / limit);
    // Explanation:
    // - Math.ceil(25/10) = 3 pages
    // - 25 total users, 10 per page = 3 pages

    // Step 7: Response send karo
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

// ============ READ ONE - GET /api/users/:id ============

export const getUserById = async (req, res) => {
  try {
    // Step 1: URL parameters se ID get karo
    const { id } = req.params;
    // /api/users/12345 → id = '12345'

    // Step 2: Validation - ID valid MongoDB ObjectId hai?
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Step 3: Database mein dhundo
    const user = await User.findById(id);
    // findById() = _id se document dhundo

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
      // 404 = Not Found
    }

    // Step 4: Success response
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

// ============ SEARCH & FILTER ============

export const searchUsers = async (req, res) => {
  try {
    // Step 1: Query parameters get karo
    const { name, email, isActive, page = 1, limit = 10 } = req.query;

    // Step 2: Filter object banao
    const filter = {};

    // Filter 1: Name search (case-insensitive)
    if (name) {
      filter.name = {
        $regex: name,
        $options: 'i'  // Case-insensitive
      };
      // Explanation:
      // - $regex = Pattern matching
      // - 'i' = Case-insensitive
      // - Search: "raj" → Match: "Raj", "RAJ", "raj"
    }

    // Filter 2: Email exact match
    if (email) {
      filter.email = email.toLowerCase();
    }

    // Filter 3: Active status
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Step 3: Pagination
    const skip = (page - 1) * limit;
    const total = await User.countDocuments(filter);

    // Step 4: Find aur return karo
    const users = await User.find(filter)
      .select('-password')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ UPDATE - PUT /api/users/:id ============

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, bio } = req.body;

    // Step 1: Validation
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    // Step 2: Update data prepare karo
    const updateData = {};

    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;
    if (bio) updateData.bio = bio;

    updateData.updatedAt = new Date();

    // Step 3: Database mein update karo
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
      // { new: true } = Updated document return karo
      // { runValidators: true } = Validation run karo
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

// ============ DELETE - DELETE /api/users/:id ============

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

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
      message: 'User deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ BULK DELETE ============

export const deleteMultipleUsers = async (req, res) => {
  try {
    const { ids } = req.body;
    // ids = Array of user IDs to delete

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide array of IDs'
      });
    }

    const result = await User.deleteMany({
      _id: { $in: ids }
      // $in = Array mein se koi bhi ID match kare
    });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} users deleted`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

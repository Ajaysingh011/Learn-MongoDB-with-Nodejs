// ============================================
// PHASE 3: USER MODEL/SCHEMA
// Database mein user ka structure define karte hain
// ============================================

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// ============ SCHEMA DEFINE KARO ============

const userSchema = new mongoose.Schema({

  // ========== FIELD 1: NAME ==========
  name: {
    type: String,
    // Data type: String (text)
    // Explanation: Name hamesha text hota hai

    required: true,
    // Zaroori field hai
    // Agar user ne name nahi diya toh error aayega
    // Error message: "Path `name` is required"

    trim: true,
    // Extra spaces remove karo
    // Example: "  Rajesh  " → "Rajesh"

    minlength: 2,
    // Minimum 2 characters
    // "A" diye toh error: "Path `name` must be at least 2 characters"

    maxlength: 50
    // Maximum 50 characters
  },

  // ========== FIELD 2: EMAIL ==========
  email: {
    type: String,
    required: true,

    unique: true,
    // Same email do users ke paas nahi ho sakti
    // Unique constraint: Database mein index banegi
    // Duplicate email pe error aayega

    lowercase: true,
    // Email ko lowercase mein convert karo
    // "RAJ@GMAIL.COM" → "raj@gmail.com"
    // Kyun? Email case-insensitive hota hai

    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    // Regex: Valid email format check karo
    // Example valid: raj@gmail.com, rajesh.singh@company.co.uk
    // Invalid: rajgmail.com, raj@@gmail.com

    index: true
    // Search mein fast hone ke liye index banao
    // Kyun? Email se user dhundna padta hai frequently
  },

  // ========== FIELD 3: PASSWORD ==========
  password: {
    type: String,
    required: true,
    // Password zaroori hai

    minlength: 6,
    // Minimum 6 characters
    // Kyun? Chhote passwords easily hack ho sakte hain

    select: false
    // Password default queries mein nahi aayega
    // Kyun? Security ke liye
    // Agar chahiye toh: User.findById(id).select('+password')
  },

  // ========== FIELD 4: PHONE (Optional) ==========
  phone: {
    type: String,
    default: null,
    // Agar user ne phone nahi diya toh null hoga
    // Optional field hai

    match: /^[0-9]{10}$/
    // 10 digit phone number
  },

  // ========== FIELD 5: BIO (Optional) ==========
  bio: {
    type: String,
    maxlength: 500,
    default: ''
    // Default empty string
  },

  // ========== FIELD 6: PROFILE PICTURE ==========
  profilePicture: {
    type: String,
    // URL of the image
    // Example: "https://cloudinary.com/image.jpg"
    default: null
  },

  // ========== FIELD 7: IS ACTIVE ==========
  isActive: {
    type: Boolean,
    // True = Account active, False = Deactivated
    default: true,
    // Naya user banate time by default active hota hai
  },

  // ========== FIELD 8: ROLE ==========
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    // Sirf ye 3 values allowed hain
    // Agar "superadmin" diye toh error
    default: 'user'
    // Naya user = normal user
  },

  // ========== FIELD 9: TIMESTAMPS ==========
  createdAt: {
    type: Date,
    default: Date.now
    // Current date automatically set hota hai
    // Manual set karne ki zaroorat nahi
  },

  updatedAt: {
    type: Date,
    default: Date.now
    // Jab user update ho toh ye change hoga
  },

  lastLogin: {
    type: Date,
    default: null
    // Jab user last login kiya
  }

});

// ============ PRE-SAVE HOOK ============
// Save karne se PEHLE password encrypt karo

userSchema.pre('save', async function(next) {
  // 'pre' = Before
  // 'save' = Database mein save karne se pehle
  // 'this' = Current user document
  // 'next()' = Next step par jaane ke liye

  try {

    // Step 1: Check - password modified hua ki nahi?
    if (!this.isModified('password')) {
      // Agar password change nahi hua toh re-hash mat karo
      // Kyun? Update profile mein password same reh sakta hai
      return next();
    }

    // Step 2: Password encrypt karo
    this.password = await bcrypt.hash(
      this.password,  // Original password
      10              // Salt rounds (security strength)
    );
    // Explanation:
    // - bcrypt.hash() = Password ko encrypt karta hai
    // - 10 rounds = Good balance (secure + fast)
    // - Zyada rounds = Zyada secure lekin slow
    // - Password: "123456" → "$2b$10$xyz..." (encrypted)

    // Step 3: Next step par jao
    next();

  } catch (error) {
    next(error);
    // Error pass karo
  }
});

// ============ INSTANCE METHOD: Password Compare ============
// Login time pe ye method use hoga

userSchema.methods.comparePassword = async function(inputPassword) {
  // 'this.password' = Database ka encrypted password
  // 'inputPassword' = User ne jo password type kiya

  try {
    return await bcrypt.compare(inputPassword, this.password);
    // Return: true = Match, false = Nahi match
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// ============ STATIC METHOD: Find by Email ============

userSchema.statics.findByEmail = async function(email) {
  // 'statics' = Model ke liye method (instance nahi)
  // Usage: User.findByEmail('raj@gmail.com')

  return await this.findOne({ email: email.toLowerCase() });
};

// ============ VIRTUAL FIELD: Full Name ============

userSchema.virtual('fullName').get(function() {
  // Virtual field = Database mein store nahi hota
  // Runtime par calculate hota hai
  return `${this.firstName} ${this.lastName}`;
});

// ============ INDEX FOR PERFORMANCE ============

userSchema.index({ email: 1 });
// Email field par index
// Kyun? Email se search fast ho

userSchema.index({ createdAt: -1 });
// Newest users pehle aayein (sorting fast ho)

userSchema.index({ isActive: 1, createdAt: -1 });
// Compound index: active users + newest first

// ============ MODEL EXPORT ============

export const User = mongoose.model('User', userSchema);

// ============ EXAMPLE USAGE ============
/*
// User banao
const newUser = new User({
  name: 'Rajesh Singh',
  email: 'raj@gmail.com',
  password: '123456',
  phone: '9876543210'
});

// Save karo (password automatically encrypt hoga)
await newUser.save();

// Find karo
const user = await User.findOne({ email: 'raj@gmail.com' });

// Password verify karo
const isValid = await user.comparePassword('123456');
console.log(isValid); // true

// Static method use karo
const foundUser = await User.findByEmail('raj@gmail.com');
*/

// ============ COMMON JS EQUIVALENT ============
/*
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
*/

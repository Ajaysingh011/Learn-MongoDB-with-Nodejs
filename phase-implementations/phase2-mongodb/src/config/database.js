// ============================================
// PHASE 2: DATABASE CONNECTION
// MongoDB se connect karne ka code
// ============================================

import mongoose from 'mongoose';

// ============ DATABASE CONNECTION FUNCTION ============

export const connectDB = async () => {
  try {
    // Step 1: Connection attempt
    console.log('🔄 Connecting to MongoDB...');

    const connection = await mongoose.connect(
      process.env.MONGODB_URI,
      // Explanation:
      // - MONGODB_URI = .env se connection string
      // - Format: mongodb://localhost:27017/database-name
      // - OR: mongodb+srv://user:pass@cluster.mongodb.net/database

      {
        // Options object
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );

    // Step 2: Success message
    console.log(`
╔════════════════════════════════════════════╗
║  ✅ MONGODB CONNECTED                      ║
╠════════════════════════════════════════════╣
║  Host: ${connection.connection.host}            ║
║  Database: ${connection.connection.name}        ║
║  Port: ${connection.connection.port}                   ║
╚════════════════════════════════════════════╝
    `);

    return connection;

  } catch (error) {
    // Step 3: Error handling

    console.error(`
╔════════════════════════════════════════════╗
║  ❌ MONGODB CONNECTION FAILED               ║
╠════════════════════════════════════════════╣
║  Error: ${error.message}                    ║
║  Make sure:                                ║
║  1. MongoDB is running                     ║
║  2. MONGODB_URI is correct                 ║
║  3. Database exists                        ║
╚════════════════════════════════════════════╝
    `);

    // Server ko band kar do
    // Kyun? Database bina app chal nahi sakta
    process.exit(1);
  }
};

// ============ DISCONNECT FUNCTION ============

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting:', error.message);
    process.exit(1);
  }
};

// ============ MONGOOSE EVENTS ============

mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose disconnected from MongoDB');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ Mongoose connection error:', error);
});

// ============ COMMON JS EQUIVALENT ============
/*
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB failed:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, disconnectDB };
*/

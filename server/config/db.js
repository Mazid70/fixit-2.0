import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Disable buffering so unhandled database queries fail fast instead of hanging
mongoose.set('bufferCommands', false);

// MongoDB connection setup using environment variables
let isConnected = false;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  const mongoURI = process.env.MONGO_URI;

  if (mongoURI && mongoURI.startsWith('mongodb')) {
    try {
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 2000,
        connectTimeoutMS: 2000,
      });
      isConnected = true;
      console.log(`\n✅ MongoDB Connected: ${conn.connection.host} (DB: ${conn.connection.name})`);
      
      // Auto-load database collections from MongoDB
      try {
        const { loadFromMongoDB } = await import('../services/dataService.js');
        await loadFromMongoDB();
      } catch (syncErr) {
        console.warn('MongoDB Data Load Note:', syncErr.message);
      }
      return;
    } catch (err) {
      console.warn(`\n⚠️ MongoDB connection note (${err.message}).`);
    }
  } else {
    console.log('ℹ️ No MONGO_URI provided in environment. Running with existing store.');
  }
};

export const getDBStatus = () => isConnected;

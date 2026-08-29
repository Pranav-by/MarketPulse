import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI;
    if (!connStr) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }

    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // If running in development without live Atlas access, continue with warning or retry
    console.warn('⚠️ Server will attempt reconnection on requests or continue in degraded mode.');
    throw error;
  }
};

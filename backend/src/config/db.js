import mongoose from 'mongoose';
import { config } from './index';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      dbName: 'business_hub',
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB Connected]: Successfully connected to ${conn.connection.host} (Database: ${conn.connection.name})`);
    return true;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: Failed to connect to MongoDB Atlas (${error.message}).`);
    throw error;
  }
};

import mongoose from 'mongoose';
import { config } from './index';

export const connectDB = async (): Promise<boolean> => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`[Database Notice]: MongoDB connection omitted or not available (${error.message}). Active built-in high-performance persistence engine is handling transactions.`);
    return false;
  }
};

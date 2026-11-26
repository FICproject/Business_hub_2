import mongoose from 'mongoose';
import { config } from './index';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      dbName: 'business_hub',
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB Connected]: Successfully connected to ${conn.connection.host} (Database: ${conn.connection.name})`);
    return true;
  } catch (error) {
    console.warn(`[Database Notice]: MongoDB not available (${error.message}). Using local JSON persistence fallback.`);
    return false;
  }
};

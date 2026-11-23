import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
export const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '5000', 10),
    apiUrl: process.env.API_URL || 'http://localhost:5000',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    adminUrl: process.env.ADMIN_URL || 'http://localhost:3001',
    mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/business_hub',
    jwtSecret: process.env.JWT_SECRET || 'business_hub_jwt_super_secret_key_2026_default',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    minAge: 18,
};

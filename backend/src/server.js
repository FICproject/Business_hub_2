import app from './app';
import { config } from './config';
import { connectDB } from './config/db';
import { seedData } from './utils/seed';
import { dbStore } from './services/storage';
const startServer = async () => {
    // Connect directly to MongoDB Atlas
    await connectDB();
    // Load all collections from MongoDB Atlas
    await dbStore.init();
    // If MongoDB database is empty, automatically seed initial dataset into MongoDB Atlas
    if (dbStore.collection.users.length === 0) {
        await seedData();
    }
    app.listen(config.port, () => {
        console.log(`====================================================`);
        console.log(`   BUSINESS HUB UNIFIED API SERVER`);
        console.log(`   Running on: http://localhost:${config.port}`);
        console.log(`   Environment: ${config.env}`);
        console.log(`   Health Check: http://localhost:${config.port}/api/health`);
        console.log(`====================================================`);
    });
};
startServer().catch((err) => {
    console.error('Fatal error starting Business Hub server:', err);
});

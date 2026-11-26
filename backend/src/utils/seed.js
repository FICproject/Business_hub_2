import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { dbStore } from '../services/storage';
import { DEFAULT_DOCUMENT_REQUIREMENTS } from '../modules/documents/documentRequirements.defaults';
import { PRIVATE_DOCS_DIR } from '../modules/documents/documentUpload.middleware';

export const seedData = async () => {
    console.log('[Seed]: Wiping mock data and initializing clean production platform...');

    // Password hash for platform Administrator
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin12345', salt);

    // 1. Single Administrator Account (Zero mock students, teachers, businessmen, or entrepreneurs)
    const adminId = 'user-admin-001';
    const users = [
        {
            _id: adminId,
            fullName: 'Platform Administrator',
            email: 'admin@businesshub.com',
            mobile: '+1-555-0101',
            dob: '1990-01-01',
            password: adminPassword,
            roles: ['admin'],
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            isEmailVerified: true,
            isMobileVerified: true,
            status: 'active',
            verificationStatus: 'approved',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
    ];

    // 2. Default taxonomies for categories
    const serviceCategories = [
        { _id: 'cat-serv-1', name: 'Civil & Architectural Engineering', icon: 'HardHat', active: true },
        { _id: 'cat-serv-2', name: 'Software & Technology Services', icon: 'Code', active: true },
        { _id: 'cat-serv-3', name: 'Interior Design & Renovation', icon: 'Paintbrush', active: true },
        { _id: 'cat-serv-4', name: 'Electrical & Plumbing Works', icon: 'Zap', active: true },
        { _id: 'cat-serv-5', name: 'Logistics & Cargo Transport', icon: 'Truck', active: true },
        { _id: 'cat-serv-6', name: 'Industrial Fabrication & Metalworks', icon: 'Cpu', active: true },
    ];

    const materialCategories = [
        { _id: 'cat-mat-1', name: 'Computer Science & Coding', active: true },
        { _id: 'cat-mat-2', name: 'Business Administration & Finance', active: true },
        { _id: 'cat-mat-3', name: 'Civil Engineering & Construction', active: true },
        { _id: 'cat-mat-4', name: 'Electrical & Electronics', active: true },
    ];

    // 3. Document Requirements
    const documentRequirements = DEFAULT_DOCUMENT_REQUIREMENTS.map((doc, idx) => ({
        ...doc,
        _id: doc.id || `doc-req-${idx + 1}`,
        id: doc.id || `doc-req-${idx + 1}`,
    }));

    // 4. Remove any mock seed files from private uploads
    try {
        if (fs.existsSync(PRIVATE_DOCS_DIR)) {
            const files = fs.readdirSync(PRIVATE_DOCS_DIR);
            for (const file of files) {
                if (file.startsWith('seed-')) {
                    fs.unlinkSync(path.join(PRIVATE_DOCS_DIR, file));
                }
            }
        }
    } catch (e) {
        console.warn('Notice while cleaning seed files:', e.message);
    }

    // 5. Populate database collections with ONLY clean essentials - ZERO mock data
    dbStore.collection.users = users;
    dbStore.collection.businesses = [];
    dbStore.collection.products = [];
    dbStore.collection.services = [];
    dbStore.collection.courses = [];
    dbStore.collection.liveClasses = [];
    dbStore.collection.materials = [];
    dbStore.collection.tuitions = [];
    dbStore.collection.teacherPayments = [];
    dbStore.collection.jobs = [];
    dbStore.collection.jobApplications = [];
    dbStore.collection.enrollments = [];
    dbStore.collection.orders = [];
    dbStore.collection.carts = [];
    dbStore.collection.auditLogs = [];
    dbStore.collection.sharedLinks = [];
    dbStore.collection.savedItems = [];
    dbStore.collection.notifications = [];
    dbStore.collection.serviceRequests = [];
    dbStore.collection.businessConnections = [];
    dbStore.collection.verificationDocuments = [];
    dbStore.collection.registrationDrafts = [];
    dbStore.collection.documentAuditLogs = [];
    dbStore.collection.otpCodes = [];
    dbStore.collection.serviceCategories = serviceCategories;
    dbStore.collection.materialCategories = materialCategories;
    dbStore.collection.documentRequirements = documentRequirements;

    await dbStore.save();
    console.log('[Seed]: All mock data successfully removed. Database clean and ready for fresh registration!');
};

// Execute if run directly
if (require.main === module) {
    const { connectDB } = require('../config/db');
    connectDB()
        .then(() => dbStore.init())
        .then(() => seedData())
        .then(() => process.exit(0))
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}

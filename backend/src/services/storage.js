import fs from 'fs';
import path from 'path';
// JSON database file persistence for zero-config reliability
const DB_FILE = path.resolve(__dirname, '../data/data_store.json');
const defaultStore = {
    users: [],
    businesses: [],
    verifications: [],
    products: [],
    services: [],
    categories: [],
    carts: [],
    orders: [],
    payments: [],
    courses: [],
    enrollments: [],
    liveClasses: [],
    attendances: [],
    materials: [],
    tuitions: [],
    teacherPayments: [],
    jobs: [],
    jobApplications: [],
    sharedLinks: [],
    notifications: [],
    auditLogs: [],
    savedItems: [],
    platformSettings: {
        siteName: 'Business Hub',
        maintenanceMode: false,
        allowNewRegistrations: true,
        emailServiceEnabled: true,
        paymentProvidersEnabled: true,
        contactEmail: 'support@businesshub.com',
    },
};
class DataStore {
    data;
    constructor() {
        this.data = this.loadFromFile();
    }
    loadFromFile() {
        try {
            if (fs.existsSync(DB_FILE)) {
                const raw = fs.readFileSync(DB_FILE, 'utf-8');
                const parsed = JSON.parse(raw);
                if (!parsed.savedItems)
                    parsed.savedItems = [];
                return parsed;
            }
        }
        catch (err) {
            console.warn('Could not read existing data_store.json, initializing fresh store');
        }
        return JSON.parse(JSON.stringify(defaultStore));
    }
    save() {
        try {
            fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
        }
        catch (err) {
            console.error('Failed to persist data_store.json', err);
        }
    }
    get collection() {
        return this.data;
    }
    reset() {
        this.data = JSON.parse(JSON.stringify(defaultStore));
        this.save();
    }
}
export const dbStore = new DataStore();

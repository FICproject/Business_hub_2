import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// JSON database file persistence for zero-config reliability
const DB_FILE = path.resolve(__dirname, '../data/data_store.json');

export interface MemoryStore {
  users: any[];
  businesses: any[];
  verifications: any[];
  products: any[];
  services: any[];
  categories: any[];
  carts: any[];
  orders: any[];
  payments: any[];
  courses: any[];
  enrollments: any[];
  liveClasses: any[];
  attendances: any[];
  materials: any[];
  tuitions: any[];
  teacherPayments: any[];
  jobs: any[];
  jobApplications: any[];
  sharedLinks: any[];
  notifications: any[];
  auditLogs: any[];
  platformSettings: any;
}

const defaultStore: MemoryStore = {
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
  private data: MemoryStore;

  constructor() {
    this.data = this.loadFromFile();
  }

  private loadFromFile(): MemoryStore {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('Could not read existing data_store.json, initializing fresh store');
    }
    return JSON.parse(JSON.stringify(defaultStore));
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist data_store.json', err);
    }
  }

  public get collection() {
    return this.data;
  }

  public reset() {
    this.data = JSON.parse(JSON.stringify(defaultStore));
    this.save();
  }
}

export const dbStore = new DataStore();

import mongoose from 'mongoose';
import { modelsMap } from '../models';

export const defaultStore = {
  users: [],
  businesses: [],
  verifications: [],
  products: [],
  services: [],
  categories: [],
  serviceCategories: [],
  materialCategories: [],
  serviceRequests: [],
  requestAssignments: [],
  businessConnections: [],
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
  documentRequirements: [],
  verificationDocuments: [],
  registrationDrafts: [],
  documentAuditLogs: [],
  otpCodes: [],
  platformSettings: {
    siteName: 'Business Hub',
    maintenanceMode: false,
    allowNewRegistrations: true,
    emailServiceEnabled: true,
    paymentProvidersEnabled: true,
    contactEmail: 'support@businesshub.com',
  },
};

class MongoDataStore {
  data;
  models;
  initialized = false;
  syncInProgress = false;

  constructor() {
    this.data = JSON.parse(JSON.stringify(defaultStore));
    this.models = modelsMap;
  }

  get collection() {
    return this.data;
  }

  /**
   * Initializes store by loading all collections directly from MongoDB.
   */
  async init() {
    try {
      if (mongoose.connection.readyState !== 1) {
        console.warn('[MongoDB Storage]: Waiting for MongoDB connection before loading collections...');
        return false;
      }

      console.log('[MongoDB Storage]: Synchronizing collections from MongoDB Atlas...');
      for (const [key, Model] of Object.entries(this.models)) {
        try {
          if (key === 'platformSettings') {
            const setting = await Model.findOne({ key: 'default_settings' }).lean();
            if (setting) {
              this.data.platformSettings = setting;
            }
          } else {
            const docs = await Model.find({}).lean();
            this.data[key] = (docs || []).map((d) => {
              if (d && !d.id && d._id) {
                d.id = d._id;
              }
              return d;
            });
          }
        } catch (colErr) {
          console.error(`[MongoDB Storage]: Failed loading collection "${key}":`, colErr.message);
        }
      }

      this.initialized = true;
      console.log(
        `[MongoDB Storage]: Collections loaded successfully from MongoDB. Users count: ${this.data.users.length}`
      );
      return true;
    } catch (err) {
      console.error('[MongoDB Storage Error]: Initialization failed:', err);
      return false;
    }
  }

  /**
   * Persists the current state of collections directly to MongoDB Atlas.
   * Performs bulk upserts and deletes removed records per collection.
   */
  async save() {
    if (mongoose.connection.readyState !== 1) {
      return;
    }

    try {
      for (const [key, Model] of Object.entries(this.models)) {
        try {
          if (key === 'platformSettings') {
            const setting = this.data.platformSettings || {};
            const { _id, ...settingFields } = setting;
            await Model.updateOne(
              { key: 'default_settings' },
              {
                $set: { ...settingFields, key: 'default_settings' },
                $setOnInsert: { _id: _id || 'default_settings' },
              },
              { upsert: true }
            );
            continue;
          }

          const rawItems = this.data[key] || [];
          if (!Array.isArray(rawItems)) continue;

          const items = rawItems.map((item) => {
            if (item && !item._id && item.id) {
              item._id = item.id;
            }
            if (item && !item.id && item._id) {
              item.id = item._id;
            }
            return item;
          });

          const currentIds = items
            .map((item) => item?._id)
            .filter((id) => id !== undefined && id !== null);

          // 1. Bulk Upsert in batches
          if (items.length > 0) {
            const bulkOps = items
              .filter((item) => item && item._id)
              .map((item) => {
                const { _id, ...fields } = item;
                return {
                  updateOne: {
                    filter: { _id },
                    update: {
                      $set: fields,
                      $setOnInsert: { _id },
                    },
                    upsert: true,
                  },
                };
              });

            if (bulkOps.length > 0) {
              await Model.bulkWrite(bulkOps, { ordered: false });
            }
          }

          // 2. Remove items that were deleted from memory
          if (currentIds.length > 0) {
            await Model.deleteMany({ _id: { $nin: currentIds } });
          } else {
            await Model.deleteMany({});
          }
        } catch (colSaveErr) {
          console.error(`[MongoDB Storage]: Error syncing collection "${key}":`, colSaveErr.message);
        }
      }
    } catch (err) {
      console.error('[MongoDB Storage]: Failed to persist changes to MongoDB:', err);
    }
  }

  /**
   * Direct MongoDB insert helper
   */
  async insertOne(collectionName, doc) {
    if (!doc._id) {
      doc._id = new mongoose.Types.ObjectId().toString();
    }
    if (this.data[collectionName]) {
      this.data[collectionName].push(doc);
    }
    const Model = this.models[collectionName];
    if (Model && mongoose.connection.readyState === 1) {
      await Model.create(doc);
    }
    return doc;
  }

  /**
   * Direct MongoDB update helper
   */
  async updateOne(collectionName, filter, update) {
    const Model = this.models[collectionName];
    if (Model && mongoose.connection.readyState === 1) {
      const sanitizedUpdate = { ...update };
      if (sanitizedUpdate.$set && sanitizedUpdate.$set._id) {
        const { _id, ...rest } = sanitizedUpdate.$set;
        sanitizedUpdate.$set = rest;
      }
      await Model.updateOne(filter, sanitizedUpdate);
    }
    // Update local cache
    const items = this.data[collectionName] || [];
    const index = items.findIndex((item) => {
      for (const [k, v] of Object.entries(filter)) {
        if (item[k] !== v) return false;
      }
      return true;
    });
    if (index !== -1) {
      Object.assign(items[index], update.$set || update);
    }
  }

  /**
   * Direct MongoDB delete helper
   */
  async deleteOne(collectionName, filter) {
    const Model = this.models[collectionName];
    if (Model && mongoose.connection.readyState === 1) {
      await Model.deleteOne(filter);
    }
    if (this.data[collectionName]) {
      this.data[collectionName] = this.data[collectionName].filter((item) => {
        for (const [k, v] of Object.entries(filter)) {
          if (item[k] === v) return false;
        }
        return true;
      });
    }
  }

  reset() {
    this.data = JSON.parse(JSON.stringify(defaultStore));
  }
}

export const dbStore = new MongoDataStore();
export default dbStore;

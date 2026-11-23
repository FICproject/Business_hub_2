import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';

// Routes
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import businessRoutes from './modules/business/business.routes';
import marketplaceRoutes from './modules/marketplace/marketplace.routes';
import educationRoutes from './modules/education/education.routes';
import jobsRoutes from './modules/jobs/jobs.routes';
import sharingRoutes from './modules/sharing/sharing.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import adminRoutes from './modules/admin/admin.routes';
import { seedData } from './utils/seed';
import { dbStore } from './services/storage';

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow frontend development ports (3000, 3001, 5173, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Business Hub Unified API',
    version: '1.0.0',
    collections: {
      users: dbStore.collection.users.length,
      products: dbStore.collection.products.length,
      courses: dbStore.collection.courses.length,
      jobs: dbStore.collection.jobs.length,
      orders: dbStore.collection.orders.length,
    },
  });
});

// Reseed endpoint for quick developer convenience
app.post('/api/seed', async (req: Request, res: Response) => {
  try {
    await seedData();
    res.json({ success: true, message: 'Database successfully reseeded with demo data!' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/sharing', sharingRoutes);
app.use('/api/shared-links', sharingRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', (req, res, next) => {
  req.url = `/search${req.url === '/' ? '' : req.url}`;
  usersRoutes(req, res, next);
});

// Direct REST aliases matching PRD specifications
app.use('/api/products', (req, res, next) => {
  req.url = req.url === '/' ? '/products' : `/products${req.url}`;
  marketplaceRoutes(req, res, next);
});
app.use('/api/services', (req, res, next) => {
  req.url = req.url === '/' ? '/services' : `/services${req.url}`;
  marketplaceRoutes(req, res, next);
});
app.use('/api/cart', (req, res, next) => {
  req.url = req.url === '/' ? '/cart' : `/cart${req.url}`;
  marketplaceRoutes(req, res, next);
});
app.use('/api/orders', (req, res, next) => {
  req.url = req.url === '/' ? '/orders' : `/orders${req.url}`;
  marketplaceRoutes(req, res, next);
});
app.use('/api/courses', (req, res, next) => {
  req.url = req.url === '/' ? '/courses' : `/courses${req.url}`;
  educationRoutes(req, res, next);
});
app.use('/api/live-classes', (req, res, next) => {
  req.url = req.url === '/' ? '/live-classes' : `/live-classes${req.url}`;
  educationRoutes(req, res, next);
});
app.use('/api/materials', (req, res, next) => {
  req.url = req.url === '/' ? '/materials' : `/materials${req.url}`;
  educationRoutes(req, res, next);
});
app.use('/api/tuition', (req, res, next) => {
  req.url = req.url === '/' ? '/tuitions' : `/tuitions${req.url}`;
  educationRoutes(req, res, next);
});
app.use('/api/teacher-payments', (req, res, next) => {
  req.url = req.url === '/' ? '/teacher-payments' : `/teacher-payments${req.url}`;
  educationRoutes(req, res, next);
});

// 404 Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found. Check /api/health for active routes.`,
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[API Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

export default app;

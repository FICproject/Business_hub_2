import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('business_hub_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Services
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  sendOtp: (data: { target: string; type: 'email' | 'mobile' }) => api.post('/auth/send-otp', data),
  verifyOtp: (data: { otp: string; type: 'email' | 'mobile' }) => api.post('/auth/verify-otp', data),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
};

// Marketplace Services
export const marketplaceApi = {
  getProducts: (params?: any) => api.get('/marketplace/products', { params }),
  getProductById: (id: string) => api.get(`/marketplace/products/${id}`),
  createProduct: (data: any) => api.post('/marketplace/products', data),
  getBusinessProducts: () => api.get('/marketplace/business/products'),
  updateProduct: (id: string, data: any) => api.put(`/marketplace/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/marketplace/products/${id}`),
  getServices: () => api.get('/marketplace/services'),
  createService: (data: any) => api.post('/marketplace/services', data),
  getCart: () => api.get('/marketplace/cart'),
  addToCart: (data: { productId: string; quantity?: number; variant?: string }) => api.post('/marketplace/cart/items', data),
  updateCartItem: (data: { productId: string; quantity: number }) => api.put('/marketplace/cart/items', data),
  removeFromCart: (productId: string) => api.delete(`/marketplace/cart/items/${productId}`),
  createOrder: (data: any) => api.post('/marketplace/orders', data),
  getMyOrders: () => api.get('/marketplace/orders/my-orders'),
  getBusinessOrders: () => api.get('/marketplace/orders/business'),
  updateOrderStatus: (id: string, status: string) => api.put(`/marketplace/orders/${id}/status`, { orderStatus: status }),
};

// Education Services
export const educationApi = {
  getCourses: (params?: any) => api.get('/education/courses', { params }),
  getCourseById: (id: string) => api.get(`/education/courses/${id}`),
  createCourse: (data: any) => api.post('/education/courses', data),
  enrollCourse: (courseId: string) => api.post(`/education/courses/${courseId}/enroll`),
  getMyEnrollments: () => api.get('/education/enrollments/my'),
  updateProgress: (courseId: string, data: any) => api.put(`/education/courses/${courseId}/progress`, data),
  getLiveClasses: () => api.get('/education/live-classes'),
  createLiveClass: (data: any) => api.post('/education/live-classes', data),
  joinLiveClass: (id: string) => api.post(`/education/live-classes/${id}/join`),
  getMaterials: () => api.get('/education/materials'),
  uploadMaterial: (data: any) => api.post('/education/materials', data),
  getTuitions: () => api.get('/education/tuitions'),
  createTuition: (data: any) => api.post('/education/tuitions', data),
  getTeacherPayments: () => api.get('/education/teacher-payments'),
};

// Jobs Services
export const jobsApi = {
  getJobs: (params?: any) => api.get('/jobs', { params }),
  getJobById: (id: string) => api.get(`/jobs/${id}`),
  createJob: (data: any) => api.post('/jobs', data),
  applyForJob: (id: string, data: any) => api.post(`/jobs/${id}/apply`, data),
  getMyApplications: () => api.get('/jobs/applications/my'),
  getBusinessApplications: () => api.get('/jobs/applications/business'),
  updateApplicationStatus: (id: string, status: string) => api.put(`/jobs/applications/${id}/status`, { status }),
};

// Business Profile & Verification Services
export const businessApi = {
  getMyBusiness: () => api.get('/business/me'),
  saveBusiness: (data: any) => api.post('/business', data),
  submitVerification: (documents: any[]) => api.post('/business/verification', { documents }),
};

// Sharing Services
export const sharingApi = {
  createShareLink: (data: { targetType: 'product' | 'service' | 'job'; targetId: string; title?: string }) =>
    api.post('/sharing', data),
  resolveShareLink: (code: string) => api.get(`/sharing/resolve/${code}`),
  getMySharedLinks: () => api.get('/sharing/my'),
};

// Notification Services
export const notificationsApi = {
  getMyNotifications: () => api.get('/notifications'),
  markAsRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
};

export default api;

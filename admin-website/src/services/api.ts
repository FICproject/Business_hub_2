import axios from 'axios';

export const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('business_hub_admin_token') || localStorage.getItem('business_hub_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  // Metrics & Reports
  getMetrics: () => api.get('/admin/metrics'),
  getAuditLogs: () => api.get('/admin/audit-logs'),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: any) => api.put('/admin/settings', data),

  // Users
  getUsers: (params?: any) => api.get('/users', { params }),
  updateUserStatus: (id: string, status: string, reason?: string) => api.put(`/users/${id}/status`, { status, reason }),
  updateUserRoles: (id: string, roles: string[]) => api.put(`/users/${id}/roles`, { roles }),

  // Businesses & Approvals
  getBusinesses: (params?: any) => api.get('/business', { params }),
  reviewBusiness: (id: string, status: string, rejectionReason?: string) =>
    api.put(`/business/${id}/review`, { status, rejectionReason }),

  // Marketplace & Orders
  getProducts: (params?: any) => api.get('/marketplace/products', { params }),
  deleteProduct: (id: string) => api.delete(`/marketplace/products/${id}`),
  getAllOrders: () => api.get('/marketplace/admin/orders'),
  updateOrderStatus: (id: string, status: string) => api.put(`/marketplace/orders/${id}/status`, { orderStatus: status }),

  // Teacher Payments
  getTeacherPayments: () => api.get('/education/teacher-payments'),
  approveTeacherPayment: (data: { liveClassId: string; teacherId: string; amount: number; notes?: string }) =>
    api.post('/education/teacher-payments/approve', data),
  markPaymentPaid: (id: string, transactionRef?: string) =>
    api.put(`/education/teacher-payments/${id}/pay`, { transactionRef }),

  // Jobs
  getJobs: () => api.get('/jobs'),
  deleteJob: (id: string) => api.delete(`/jobs/${id}`),
  updateJobStatus: (id: string, status: string) => api.put(`/jobs/${id}/status`, { status }),

  // Education & Moderation
  getCourses: () => api.get('/education/courses'),
  deleteCourse: (id: string) => api.delete(`/education/courses/${id}`),
  getLiveClasses: () => api.get('/education/live-classes'),
  deleteLiveClass: (id: string) => api.delete(`/education/live-classes/${id}`),
  getMaterials: () => api.get('/education/materials'),
  deleteMaterial: (id: string) => api.delete(`/education/materials/${id}`),

  // Referrals & Sharing
  getAllSharedLinks: () => api.get('/sharing/admin/all'),

  // Direct login
  login: (data: any) => api.post('/auth/login', data),
};

export default api;

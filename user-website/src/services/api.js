import axios from 'axios';
export const API_BASE_URL = 'http://localhost:5000/api';
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Interceptor to attach Authorization header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('business_hub_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));
// Auth Services
export const authApi = {
    initRegistration: (data) => api.post('/auth/init-registration', data),
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    sendOtp: (data) => api.post('/auth/send-otp', data),
    verifyOtp: (data) => api.post('/auth/verify-otp', data),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (data) => api.post('/auth/reset-password', data),
};
// Marketplace Services
export const marketplaceApi = {
    getProducts: (params) => api.get('/marketplace/products', { params }),
    getProductById: (id) => api.get(`/marketplace/products/${id}`),
    createProduct: (data) => api.post('/marketplace/products', data),
    getBusinessProducts: () => api.get('/marketplace/business/products'),
    updateProduct: (id, data) => api.put(`/marketplace/products/${id}`, data),
    deleteProduct: (id) => api.delete(`/marketplace/products/${id}`),
    getServices: () => api.get('/marketplace/services'),
    createService: (data) => api.post('/marketplace/services', data),
    getCart: () => api.get('/marketplace/cart'),
    addToCart: (data) => api.post('/marketplace/cart/items', data),
    updateCartItem: (data) => api.put('/marketplace/cart/items', data),
    removeFromCart: (productId) => api.delete(`/marketplace/cart/items/${productId}`),
    createOrder: (data) => api.post('/marketplace/orders', data),
    getMyOrders: () => api.get('/marketplace/orders/my-orders'),
    getBusinessOrders: () => api.get('/marketplace/orders/business'),
    updateOrderStatus: (id, status) => api.put(`/marketplace/orders/${id}/status`, { orderStatus: status }),
};
// Education Services
export const educationApi = {
    getCourses: (params) => api.get('/education/courses', { params }),
    getCourseById: (id) => api.get(`/education/courses/${id}`),
    createCourse: (data) => api.post('/education/courses', data),
    enrollCourse: (courseId) => api.post(`/education/courses/${courseId}/enroll`),
    getMyEnrollments: () => api.get('/education/enrollments/my'),
    updateProgress: (courseId, data) => api.put(`/education/courses/${courseId}/progress`, data),
    getLiveClasses: () => api.get('/education/live-classes'),
    createLiveClass: (data) => api.post('/education/live-classes', data),
    joinLiveClass: (id) => api.post(`/education/live-classes/${id}/join`),
    getMaterials: () => api.get('/education/materials'),
    uploadMaterial: (data) => api.post('/education/materials', data),
    getTuitions: () => api.get('/education/tuitions'),
    createTuition: (data) => api.post('/education/tuitions', data),
    getTeacherPayments: () => api.get('/education/teacher-payments'),
};
// Jobs Services
export const jobsApi = {
    getJobs: (params) => api.get('/jobs', { params }),
    getJobById: (id) => api.get(`/jobs/${id}`),
    createJob: (data) => api.post('/jobs', data),
    applyForJob: (id, data) => api.post(`/jobs/${id}/apply`, data),
    getMyApplications: () => api.get('/jobs/applications/my'),
    getBusinessApplications: () => api.get('/jobs/applications/business'),
    updateApplicationStatus: (id, status) => api.put(`/jobs/applications/${id}/status`, { status }),
};
// Business Profile & Verification Services
export const businessApi = {
    getMyBusiness: () => api.get('/business/me'),
    saveBusiness: (data) => api.post('/business', data),
    submitVerification: (documents) => api.post('/business/verification', { documents }),
};
// Sharing Services
export const sharingApi = {
    createShareLink: (data) => api.post('/sharing', data),
    resolveShareLink: (code) => api.get(`/sharing/resolve/${code}`),
    getMySharedLinks: () => api.get('/sharing/my'),
};
// Notification Services
export const notificationsApi = {
    getMyNotifications: () => api.get('/notifications'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
};
// Users & Profile Services
export const usersApi = {
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/users/profile', data),
    changePassword: (data) => api.post('/users/change-password', data),
    getSavedItems: () => api.get('/users/saved-items'),
    addSavedItem: (data) => api.post('/users/saved-items', data),
    removeSavedItem: (id) => api.delete(`/users/saved-items/${id}`),
    globalSearch: (params) => api.get('/users/search', { params }),
};

// Document Verification Services (Supports both User JWT and Registration Draft Token)
export const documentsApi = {
    getRequirements: (params) => api.get('/documents/requirements', { params }),
    getMyChecklist: (customToken) =>
        api.get('/documents/my', customToken ? { headers: { Authorization: `Bearer ${customToken}` } } : undefined),
    updateContext: (applicationContext, customToken) =>
        api.put(
            '/documents/context',
            { applicationContext },
            customToken ? { headers: { Authorization: `Bearer ${customToken}` } } : undefined
        ),
    uploadDocument: (requirementId, file, { customToken, onUploadProgress } = {}) => {
        const formData = new FormData();
        formData.append('requirementId', requirementId);
        formData.append('file', file);
        return api.post('/documents/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...(customToken ? { Authorization: `Bearer ${customToken}` } : {}),
            },
            onUploadProgress,
        });
    },
    removeDocument: (id, customToken) =>
        api.delete(`/documents/${id}`, customToken ? { headers: { Authorization: `Bearer ${customToken}` } } : undefined),
    getAccessToken: (id, download = false, customToken) =>
        api.get(`/documents/${id}/access-token`, {
            params: { download },
            ...(customToken ? { headers: { Authorization: `Bearer ${customToken}` } } : {}),
        }),
};
export default api;

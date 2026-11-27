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
    updateSettings: (data) => api.put('/admin/settings', data),
    // Users
    getUsers: (params) => api.get('/users', { params }),
    updateUserStatus: (id, status, reason) => api.put(`/users/${id}/status`, { status, reason }),
    updateUserRoles: (id, roles) => api.put(`/users/${id}/roles`, { roles }),
    // Businesses & Approvals
    getBusinesses: (params) => api.get('/business', { params }),
    reviewBusiness: (id, status, rejectionReason) => api.put(`/business/${id}/review`, { status, rejectionReason }),
    // Marketplace & Orders
    getProducts: (params) => api.get('/marketplace/products', { params }),
    deleteProduct: (id) => api.delete(`/marketplace/products/${id}`),
    getAllOrders: () => api.get('/marketplace/admin/orders'),
    updateOrderStatus: (id, status) => api.put(`/marketplace/orders/${id}/status`, { orderStatus: status }),
    // Teacher Payments
    getTeacherPayments: () => api.get('/education/teacher-payments'),
    approveTeacherPayment: (data) => api.post('/education/teacher-payments/approve', data),
    markPaymentPaid: (id, transactionRef) => api.put(`/education/teacher-payments/${id}/pay`, { transactionRef }),
    // Jobs & Applications
    getJobs: () => api.get('/jobs'),
    deleteJob: (id) => api.delete(`/jobs/${id}`),
    updateJobStatus: (id, status) => api.put(`/jobs/${id}/status`, { status }),
    getJobApplications: (params) => api.get('/jobs/applications/all', { params }),
    getJobApplicationById: (id) => api.get(`/jobs/applications/${id}`),
    // Education & Moderation
    getCourses: () => api.get('/education/courses'),
    reviewCourse: (id, data) => api.put(`/education/courses/${id}/review`, data),
    updateCourse: (id, data) => api.put(`/education/courses/${id}`, data),
    deleteCourse: (id) => api.delete(`/education/courses/${id}`),
    getLiveClasses: () => api.get('/education/live-classes'),
    getClassRoster: (id) => api.get(`/education/live-classes/${id}/roster`),
    deleteLiveClass: (id) => api.delete(`/education/live-classes/${id}`),
    getMaterials: () => api.get('/education/materials'),
    deleteMaterial: (id) => api.delete(`/education/materials/${id}`),
    getEducationCategories: () => api.get('/education/categories'),
    createEducationCategory: (data) => api.post('/education/categories', data),
    updateEducationCategory: (id, data) => api.put(`/education/categories/${id}`, data),
    deleteEducationCategory: (id) => api.delete(`/education/categories/${id}`),
    // Referrals & Sharing
    getAllSharedLinks: () => api.get('/sharing/admin/all'),
    // Quotation Management (Centralized Coordination)
    getQuotationRequests: (params) => api.get('/quotations/admin/requests', { params }),
    getQuotationRequestById: (id) => api.get(`/quotations/admin/requests/${id}`),
    matchCompaniesForRequest: (id, params) => api.get(`/quotations/admin/requests/${id}/match-companies`, { params }),
    inviteCompaniesToRequest: (id, data) => api.post(`/quotations/admin/requests/${id}/invite`, data),
    updateQuotationVisibility: (id, data) => api.put(`/quotations/admin/requests/${id}/visibility`, data),
    adminSelectQuotation: (id, quotationId) => api.post(`/quotations/admin/requests/${id}/select-quotation`, { quotationId }),
    confirmQuotationSelection: (id) => api.post(`/quotations/admin/requests/${id}/confirm-selection`),
    reopenQuotationRequest: (id) => api.post(`/quotations/admin/requests/${id}/reopen`),
    updateQuotationRequestStatus: (id, data) => api.put(`/quotations/admin/requests/${id}/status`, data),
    // Service Requests & Workflows (Business Hub Core)
    getServiceRequests: (params) => api.get('/requests', { params }),
    getServiceRequestById: (id) => api.get(`/requests/${id}`),
    updateRequestStatus: (id, status, note) => api.patch(`/requests/${id}/status`, { status, note }),
    getMatchingBusinesses: (id) => api.get(`/requests/${id}/matching-businesses`),
    assignBusinessToRequest: (id, data) => api.post(`/requests/${id}/assign`, data),
    // Business Connections
    getBusinessConnections: (params) => api.get('/requests/connections', { params }),
    updateConnectionStatus: (id, status, notes) => api.patch(`/requests/connections/${id}/status`, { status, notes }),
    // Categories Management
    getCategories: (params) => api.get('/categories', { params }),
    createCategory: (data) => api.post('/categories', data),
    updateCategory: (id, data) => api.put(`/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/categories/${id}`),
    // Document Verification & Configurable Rules
    getPendingDocumentApplicants: () => api.get('/documents/admin/pending'),
    getApplicantDocuments: (userId) => api.get(`/documents/admin/applicant/${userId}`),
    reviewDocument: (id, status, reason) => api.put(`/documents/${id}/review`, { status, reason }),
    decideApplicantApplication: (userId, decision, reason, targetRole) =>
        api.post(`/documents/admin/applicant/${userId}/decision`, { decision, reason, targetRole }),
    getDocumentAccessToken: (id, download = false) =>
        api.get(`/documents/${id}/access-token`, { params: { download } }),
    getDocumentRequirements: (params) => api.get('/documents/requirements', { params }),
    createDocumentRequirement: (data) => api.post('/documents/requirements', data),
    updateDocumentRequirement: (id, data) => api.put(`/documents/requirements/${id}`, data),
    deleteDocumentRequirement: (id) => api.delete(`/documents/requirements/${id}`),
    // Direct login
    login: (data) => api.post('/auth/login', data),
};
export default api;

// Base API Configuration for Admin Mobile
// Connected to production backend on Render
export const API_BASE_URL = 'https://business-hub-2.onrender.com/api';

class AdminApiClient {
  private token: string | null = null;
  private baseUrl: string = API_BASE_URL;

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }
      return data;
    } catch (error: any) {
      console.warn(`Admin API Error on ${endpoint}:`, error.message);
      throw error;
    }
  }

  // Admin Auth
  login(credentials: { email?: string; password?: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Metrics & Reports
  getMetrics() {
    return this.request('/admin/metrics');
  }

  // User Management
  getUsers(params?: Record<string, any>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/users${query}`);
  }

  updateUserStatus(id: string, status: string, reason?: string) {
    return this.request(`/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason }),
    });
  }

  // Business Moderation
  getBusinesses(params?: Record<string, any>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/business${query}`);
  }

  reviewBusiness(id: string, status: 'approved' | 'rejected', rejectionReason?: string) {
    return this.request(`/business/${id}/review`, {
      method: 'PUT',
      body: JSON.stringify({ status, rejectionReason }),
    });
  }

  // Student Job Applications & Moderation
  getJobApplications(params?: Record<string, any>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/jobs/applications/all${query}`);
  }

  getJobApplicationById(id: string) {
    return this.request(`/jobs/applications/${id}`);
  }

  getJobs(params?: Record<string, any>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/jobs${query}`);
  }

  updateJobStatus(id: string, status: string) {
    return this.request(`/jobs/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Centralized Quotation Coordination
  getQuotationRequests(params?: Record<string, any>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/quotations/admin/requests${query}`);
  }

  getQuotationRequestById(id: string) {
    return this.request(`/quotations/admin/requests/${id}`);
  }

  matchCompanies(id: string) {
    return this.request(`/quotations/admin/requests/${id}/match-companies`);
  }

  inviteCompanies(id: string, businessIds: string[]) {
    return this.request(`/quotations/admin/requests/${id}/invite`, {
      method: 'POST',
      body: JSON.stringify({ businessIds }),
    });
  }

  updateQuotationVisibility(id: string, allowRequesterSelection: boolean) {
    return this.request(`/quotations/admin/requests/${id}/visibility`, {
      method: 'PUT',
      body: JSON.stringify({ allowRequesterSelection }),
    });
  }

  confirmQuotationSelection(id: string, quotationId?: string) {
    return this.request(`/quotations/admin/requests/${id}/confirm-selection`, {
      method: 'POST',
      body: JSON.stringify({ quotationId }),
    });
  }

  // Education Moderation & Teacher Payments
  getCourses() {
    return this.request('/education/courses');
  }

  reviewCourse(id: string, data: { status: 'published' | 'rejected'; note?: string }) {
    return this.request(`/education/courses/${id}/review`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  getLiveClasses() {
    return this.request('/education/live-classes');
  }

  getClassRoster(id: string) {
    return this.request(`/education/live-classes/${id}/roster`);
  }

  getTeacherPayments() {
    return this.request('/education/teacher-payments');
  }

  approveTeacherPayment(data: { liveClassId: string; teacherId: string; amount: number; notes?: string }) {
    return this.request('/education/teacher-payments/approve', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  markTeacherPaymentPaid(id: string, transactionRef?: string) {
    return this.request(`/education/teacher-payments/${id}/pay`, {
      method: 'PUT',
      body: JSON.stringify({ transactionRef }),
    });
  }

  // Service Requests & Connections
  getServiceRequests() {
    return this.request('/requests');
  }

  getBusinessConnections() {
    return this.request('/requests/connections');
  }
}

export const adminApi = new AdminApiClient();

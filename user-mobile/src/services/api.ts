// Base API Configuration for User Mobile
// Connected to production backend on Render
export const API_BASE_URL = 'https://business-hub-2.onrender.com/api';

class ApiClient {
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
      console.warn(`API Error on ${endpoint}:`, error.message);
      throw error;
    }
  }

  // Auth APIs
  login(credentials: { email?: string; mobile?: string; password?: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  register(data: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getMe() {
    return this.request('/auth/me');
  }

  // Marketplace & Catalog APIs
  getProducts(params?: Record<string, any>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/marketplace/products${query}`);
  }

  getServices(params?: Record<string, any>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/marketplace/services${query}`);
  }

  createProduct(data: any) {
    return this.request('/marketplace/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  createService(data: any) {
    return this.request('/marketplace/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getCart() {
    return this.request('/marketplace/cart');
  }

  addToCart(item: { productId: string; quantity: number }) {
    return this.request('/marketplace/cart/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  removeFromCart(productId: string) {
    return this.request(`/marketplace/cart/items/${productId}`, {
      method: 'DELETE',
    });
  }

  createOrder(data: any) {
    return this.request('/marketplace/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getMyOrders() {
    return this.request('/marketplace/orders/my-orders');
  }

  // Centralized Quotation System APIs
  createQuotationRequest(data: {
    listingId: string;
    listingType: 'product' | 'service';
    requiredQuantity?: number;
    specifications?: string;
    targetDeliveryDate?: string;
    deliveryAddress?: string;
    notes?: string;
  }) {
    return this.request('/quotations/requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getMyQuotationRequests(params?: Record<string, any>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/quotations/my-requests${query}`);
  }

  getQuotationRequestById(id: string) {
    return this.request(`/quotations/requests/${id}`);
  }

  selectQuotation(requestId: string, quotationId: string) {
    return this.request(`/quotations/requests/${requestId}/select`, {
      method: 'POST',
      body: JSON.stringify({ quotationId }),
    });
  }

  // Business Received Quotation Requests & Responses
  getBusinessQuotationRequests() {
    return this.request('/quotations/business/requests');
  }

  submitQuotationResponse(invitationId: string, data: any) {
    return this.request(`/quotations/invitations/${invitationId}/respond`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Education APIs (100% Free for Students)
  getCourses(params?: Record<string, any>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/education/courses${query}`);
  }

  getCourseById(id: string) {
    return this.request(`/education/courses/${id}`);
  }

  createCourse(data: any) {
    return this.request('/education/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  enrollCourse(courseId: string) {
    return this.request(`/education/courses/${courseId}/enroll`, {
      method: 'POST',
    });
  }

  getMyEnrollments() {
    return this.request('/education/enrollments/my');
  }

  updateProgress(courseId: string, lessonId: string) {
    return this.request(`/education/courses/${courseId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ lessonId }),
    });
  }

  getLiveClasses(params?: Record<string, any>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/education/live-classes${query}`);
  }

  createLiveClass(data: any) {
    return this.request('/education/live-classes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  registerForLiveClass(id: string) {
    return this.request(`/education/live-classes/${id}/register`, {
      method: 'POST',
    });
  }

  joinLiveClass(id: string) {
    return this.request(`/education/live-classes/${id}/join`, {
      method: 'POST',
    });
  }

  getMaterials(params?: Record<string, any>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/education/materials${query}`);
  }

  // Jobs & Applications APIs
  getJobs(params?: Record<string, any>) {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/jobs${query}`);
  }

  getJobById(id: string) {
    return this.request(`/jobs/${id}`);
  }

  applyForJob(jobId: string, applicationData: any) {
    return this.request(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  getMyApplications() {
    return this.request('/jobs/applications/my');
  }

  // Business Management
  getMyBusiness() {
    return this.request('/business/me');
  }

  saveBusiness(data: any) {
    return this.request('/business', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getBusinessConnections() {
    return this.request('/requests/connections');
  }

  getBusinessRequests() {
    return this.request('/requests/my-business');
  }
}

export const api = new ApiClient();

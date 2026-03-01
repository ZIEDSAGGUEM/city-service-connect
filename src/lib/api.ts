import axios from 'axios';
import type { Provider, CreateProviderDto, UpdateProviderDto, SearchProvidersFilters, Category, ServiceRequest, CreateServiceRequestDto, CancelServiceRequestDto, CompleteServiceRequestDto, RequestStatus, Review, CreateReviewDto, Message, ConversationSummary, SendMessageDto, AiChatMessage, AiChatResponse, Favorite, Notification, ProviderAnalytics, AdminDashboardStats, AdminUser, AdminProvider } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      localStorage.removeItem('access_token');
      // Skip redirect for the initial auth check — AuthContext handles it gracefully
      if (!requestUrl.includes('/auth/me')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (data: any) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  verifyEmail: async (token: string) => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },
  resendVerification: async (email: string) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },
  requestPasswordReset: async (email: string) => {
    const response = await api.post('/auth/request-password-reset', { email });
    return response.data;
  },
  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },
};

// Provider API
export const providersApi = {
  // Search/filter providers (public)
  search: async (filters?: SearchProvidersFilters): Promise<Provider[]> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.q) params.append('q', filters.q);
      if (filters.categoryId) params.append('categoryId', filters.categoryId);
      if (filters.minRating) params.append('minRating', filters.minRating.toString());
      if (filters.maxHourlyRate) params.append('maxHourlyRate', filters.maxHourlyRate.toString());
      if (filters.skills) filters.skills.forEach(skill => params.append('skills', skill));
      if (filters.availability) params.append('availability', filters.availability);
      if (filters.status) params.append('status', filters.status);
      if (filters.verified !== undefined) params.append('verified', filters.verified.toString());
      if (filters.location) params.append('location', filters.location);
      if (filters.serviceRadius) params.append('serviceRadius', filters.serviceRadius.toString());
    }
    const response = await api.get(`/providers?${params.toString()}`);
    return response.data;
  },

  // Get provider by ID (public)
  getById: async (id: string): Promise<Provider> => {
    const response = await api.get(`/providers/${id}`);
    return response.data;
  },

  // Get my provider profile (requires auth, PROVIDER only)
  getMyProfile: async (): Promise<Provider> => {
    const response = await api.get('/providers/me');
    return response.data;
  },

  // Create provider profile (requires auth, PROVIDER only)
  createProfile: async (data: CreateProviderDto): Promise<Provider> => {
    const response = await api.post('/providers', data);
    return response.data;
  },

  // Update provider profile (requires auth, PROVIDER only)
  updateProfile: async (id: string, data: UpdateProviderDto): Promise<Provider> => {
    const response = await api.put(`/providers/${id}`, data);
    return response.data;
  },

  // Delete provider profile (requires auth, PROVIDER only)
  deleteProfile: async (id: string): Promise<void> => {
    await api.delete(`/providers/${id}`);
  },

  // Get analytics for the current provider
  getAnalytics: async (): Promise<ProviderAnalytics> => {
    const response = await api.get('/providers/me/analytics');
    return response.data;
  },
};

// Category API
export const categoriesApi = {
  // Get all categories (public)
  getAll: async (): Promise<Category[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Get category by ID (public)
  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};

// Service Requests API
export const serviceRequestsApi = {
  // Create service request (CLIENT only)
  create: async (data: CreateServiceRequestDto): Promise<ServiceRequest> => {
    const response = await api.post('/service-requests', data);
    return response.data;
  },

  // Get my service requests (CLIENT only)
  getMyRequests: async (status?: RequestStatus): Promise<ServiceRequest[]> => {
    const params = status ? { status } : {};
    const response = await api.get('/service-requests/my-requests', { params });
    return response.data;
  },

  // Get requests for my provider profile (PROVIDER only)
  getProviderRequests: async (status?: RequestStatus): Promise<ServiceRequest[]> => {
    const params = status ? { status } : {};
    const response = await api.get('/service-requests/provider-requests', { params });
    return response.data;
  },

  // Get service request by ID (CLIENT or PROVIDER)
  getById: async (id: string): Promise<ServiceRequest> => {
    const response = await api.get(`/service-requests/${id}`);
    return response.data;
  },

  // Cancel service request (CLIENT only)
  cancel: async (id: string, data?: CancelServiceRequestDto): Promise<ServiceRequest> => {
    const response = await api.put(`/service-requests/${id}/cancel`, data || {});
    return response.data;
  },

  // Accept service request (PROVIDER only)
  accept: async (id: string): Promise<ServiceRequest> => {
    const response = await api.put(`/service-requests/${id}/accept`);
    return response.data;
  },

  // Decline service request (PROVIDER only)
  decline: async (id: string, reason?: string): Promise<ServiceRequest> => {
    const response = await api.put(`/service-requests/${id}/decline`, { reason });
    return response.data;
  },

  // Start service request (PROVIDER only)
  start: async (id: string): Promise<ServiceRequest> => {
    const response = await api.put(`/service-requests/${id}/start`);
    return response.data;
  },

  // Complete service request (PROVIDER only)
  complete: async (id: string, data?: CompleteServiceRequestDto): Promise<ServiceRequest> => {
    const response = await api.put(`/service-requests/${id}/complete`, data || {});
    return response.data;
  },
};

// Reviews API
export const reviewsApi = {
  // Create review (CLIENT only)
  create: async (data: CreateReviewDto): Promise<Review> => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  // Get reviews for a provider (public)
  getProviderReviews: async (providerId: string): Promise<Review[]> => {
    const response = await api.get(`/reviews/provider/${providerId}`);
    return response.data;
  },
};

// Messages API
export const messagesApi = {
  // Send a message
  send: async (data: SendMessageDto): Promise<Message> => {
    const response = await api.post('/messages', data);
    return response.data;
  },

  // Get all conversations for current user
  getConversations: async (): Promise<ConversationSummary[]> => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  // Get unread message count
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await api.get('/messages/unread-count');
    return response.data;
  },

  // Get all messages in a request conversation
  getConversation: async (requestId: string): Promise<Message[]> => {
    const response = await api.get(`/messages/request/${requestId}`);
    return response.data;
  },
};

// Favorites API
export const favoritesApi = {
  toggle: async (providerId: string): Promise<{ favorited: boolean }> => {
    const response = await api.post(`/favorites/${providerId}`);
    return response.data;
  },
  getMyFavorites: async (): Promise<Favorite[]> => {
    const response = await api.get('/favorites');
    return response.data;
  },
  check: async (providerId: string): Promise<{ favorited: boolean }> => {
    const response = await api.get(`/favorites/check/${providerId}`);
    return response.data;
  },
};

// Notifications API
export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const response = await api.get('/notifications');
    return response.data;
  },
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },
  markAsRead: async (id: string): Promise<void> => {
    await api.put(`/notifications/${id}/read`);
  },
  markAllAsRead: async (): Promise<void> => {
    await api.put('/notifications/read-all');
  },
};

// AI Chat API
export const aiApi = {
  chat: async (messages: AiChatMessage[]): Promise<AiChatResponse> => {
    const response = await api.post('/ai/chat', { messages });
    return response.data;
  },
};

// Uploads API
export const uploadsApi = {
  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/uploads/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  uploadPortfolio: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/uploads/portfolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  removePortfolioImage: async (imageUrl: string): Promise<void> => {
    await api.delete('/uploads/portfolio', { data: { imageUrl } });
  },
};

// Admin API
export const adminApi = {
  getDashboard: async (): Promise<AdminDashboardStats> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },
  getUsers: async (q?: string, role?: string): Promise<AdminUser[]> => {
    const params: any = {};
    if (q) params.q = q;
    if (role) params.role = role;
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  updateUserRole: async (id: string, role: string) => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },
  toggleUserVerification: async (id: string) => {
    const response = await api.put(`/admin/users/${id}/toggle-verification`);
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
  getProviders: async (q?: string, status?: string): Promise<AdminProvider[]> => {
    const params: any = {};
    if (q) params.q = q;
    if (status) params.status = status;
    const response = await api.get('/admin/providers', { params });
    return response.data;
  },
  toggleProviderVerification: async (id: string) => {
    const response = await api.put(`/admin/providers/${id}/toggle-verification`);
    return response.data;
  },
  updateProviderStatus: async (id: string, status: string) => {
    const response = await api.put(`/admin/providers/${id}/status`, { status });
    return response.data;
  },
  createCategory: async (data: { name: string; icon: string; description: string }): Promise<Category> => {
    const response = await api.post('/admin/categories', data);
    return response.data;
  },
  updateCategory: async (id: string, data: { name?: string; icon?: string; description?: string }): Promise<Category> => {
    const response = await api.put(`/admin/categories/${id}`, data);
    return response.data;
  },
  deleteCategory: async (id: string) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },
};

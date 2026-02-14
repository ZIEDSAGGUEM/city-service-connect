import axios from 'axios';
import type { Provider, CreateProviderDto, UpdateProviderDto, SearchProvidersFilters, Category } from './types';

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
      localStorage.removeItem('access_token');
      window.location.href = '/login';
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

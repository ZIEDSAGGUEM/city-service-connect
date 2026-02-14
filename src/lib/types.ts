// User Types
export type UserRole = 'CLIENT' | 'PROVIDER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
  phone?: string | null;
  location?: string | null;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  providerCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Provider Types
export type AvailabilityStatus = 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
export type ProviderStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface AvailabilitySchedule {
  [key: string]: string[]; // e.g., { "monday": ["9:00-17:00"], "tuesday": [...] }
}

export interface Provider {
  id: string;
  userId: string;
  categoryId: string;
  bio?: string | null;
  hourlyRate: number;
  skills: string[];
  availability: AvailabilityStatus;
  availabilitySchedule?: AvailabilitySchedule | null;
  verified: boolean;
  yearsExperience: number;
  completedJobs: number;
  responseTime: string;
  rating: number;
  reviewCount: number;
  serviceRadius: number;
  portfolio: string[];
  certifications: string[];
  status: ProviderStatus;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email?: string;
    avatar?: string | null;
    phone?: string | null;
    location?: string | null;
  };
  category?: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
}

// Provider DTOs
export interface CreateProviderDto {
  categoryId: string;
  bio?: string;
  hourlyRate: number;
  skills: string[];
  availability?: AvailabilityStatus;
  availabilitySchedule?: AvailabilitySchedule;
  yearsExperience?: number;
  serviceRadius?: number;
  portfolio?: string[];
  certifications?: string[];
}

export interface UpdateProviderDto {
  categoryId?: string;
  bio?: string;
  hourlyRate?: number;
  skills?: string[];
  availability?: AvailabilityStatus;
  availabilitySchedule?: AvailabilitySchedule;
  yearsExperience?: number;
  responseTime?: string;
  serviceRadius?: number;
  portfolio?: string[];
  certifications?: string[];
}

export interface SearchProvidersFilters {
  categoryId?: string;
  minRating?: number;
  maxHourlyRate?: number;
  skills?: string[];
  availability?: AvailabilityStatus;
  status?: ProviderStatus;
  verified?: boolean;
  location?: string;
  serviceRadius?: number;
}

// Review Types
export interface Review {
  id: string;
  clientId: string;
  providerId: string;
  rating: number;
  comment: string;
  serviceType: string;
  createdAt: Date;
  updatedAt: Date;
  client?: {
    name: string;
    avatar?: string | null;
  };
}


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
  q?: string;
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
  requestId: string;
  clientId: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  client?: {
    name: string;
    avatar?: string | null;
  };
}

export interface CreateReviewDto {
  requestId: string;
  rating: number;
  comment: string;
}

// Service Request Types
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ServiceRequest {
  id: string;
  clientId: string;
  providerId: string;
  categoryId: string;
  title: string;
  description: string;
  location?: string | null;
  preferredDate: string;
  preferredTime: string;
  scheduledDate?: string | null;
  estimatedBudget?: number | null;
  finalPrice?: number | null;
  status: RequestStatus;
  cancelledBy?: string | null;
  cancelReason?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  completionNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    phone?: string | null;
    location?: string | null;
  };
  provider?: {
    id: string;
    userId: string;
    categoryId: string;
    hourlyRate: number;
    rating: number;
    reviewCount: number;
    user?: {
      id: string;
      name: string;
      avatar?: string | null;
      phone?: string | null;
      location?: string | null;
    };
    category?: {
      id: string;
      name: string;
      icon: string;
    };
  };
  category?: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
}

export interface CreateServiceRequestDto {
  providerId: string;
  categoryId: string;
  title: string;
  description: string;
  location?: string;
  preferredDate: string;
  preferredTime: string;
  estimatedBudget?: number;
}

export interface CancelServiceRequestDto {
  reason?: string;
}

export interface CompleteServiceRequestDto {
  completionNotes?: string;
  finalPrice?: number;
}

// Message Types
export interface Message {
  id: string;
  senderId: string;
  requestId: string;
  content: string;
  read: boolean;
  createdAt: string;
  sender?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface ConversationSummary {
  requestId: string;
  requestTitle: string;
  otherParty: {
    id: string;
    name: string;
    avatar: string | null;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    senderId: string;
  } | null;
  unreadCount: number;
}

export interface SendMessageDto {
  requestId: string;
  content: string;
}

// Favorite Types
export interface Favorite {
  id: string;
  userId: string;
  providerId: string;
  createdAt: string;
  provider?: Provider;
}

// Notification Types
export type NotificationType =
  | 'REQUEST_NEW'
  | 'REQUEST_ACCEPTED'
  | 'REQUEST_DECLINED'
  | 'REQUEST_STARTED'
  | 'REQUEST_COMPLETED'
  | 'REQUEST_CANCELLED'
  | 'NEW_MESSAGE'
  | 'NEW_REVIEW';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

// Provider Analytics Types
export interface ProviderAnalytics {
  totalEarnings: number;
  totalCompletedJobs: number;
  totalRequests: number;
  statusCounts: Record<string, number>;
  monthlyChart: { month: string; jobs: number; earnings: number }[];
  ratingDistribution: number[];
  recentReviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    client: { name: string; avatar: string | null };
  }[];
  favoritesCount: number;
}

// AI Chat Types
export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiChatResponse {
  message: string;
  providers: Provider[];
}


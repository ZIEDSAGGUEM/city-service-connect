// Mock data for the Local Services Marketplace

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  providerCount: number;
}

export interface Provider {
  id: string;
  name: string;
  avatar: string;
  category: string;
  categoryId: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  description: string;
  skills: string[];
  availability: 'available' | 'busy' | 'unavailable';
  verified: boolean;
  yearsExperience: number;
  completedJobs: number;
  responseTime: string;
  location: string;
}

export interface Review {
  id: string;
  providerId: string;
  clientName: string;
  clientAvatar: string;
  rating: number;
  comment: string;
  date: string;
  serviceType: string;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  providerId: string;
  providerName: string;
  category: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  description: string;
  date: string;
  time: string;
  budget: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'client' | 'provider';
  phone?: string;
  location?: string;
}

export const categories: ServiceCategory[] = [
  { id: '1', name: 'Home Cleaning', icon: 'home', description: 'Professional cleaning services for your home', providerCount: 156 },
  { id: '2', name: 'Plumbing', icon: 'wrench', description: 'Expert plumbers for all your needs', providerCount: 89 },
  { id: '3', name: 'Electrical', icon: 'zap', description: 'Licensed electricians available 24/7', providerCount: 67 },
  { id: '4', name: 'Landscaping', icon: 'trees', description: 'Transform your outdoor spaces', providerCount: 112 },
  { id: '5', name: 'Moving', icon: 'truck', description: 'Reliable moving and packing services', providerCount: 45 },
  { id: '6', name: 'Painting', icon: 'paintbrush', description: 'Interior and exterior painting experts', providerCount: 78 },
  { id: '7', name: 'Handyman', icon: 'hammer', description: 'General repairs and maintenance', providerCount: 134 },
  { id: '8', name: 'Pet Care', icon: 'dog', description: 'Trusted pet sitters and groomers', providerCount: 92 },
];

export const providers: Provider[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    category: 'Home Cleaning',
    categoryId: '1',
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 45,
    description: 'Professional cleaner with 8+ years of experience. I specialize in deep cleaning, move-in/move-out services, and regular maintenance. My attention to detail and eco-friendly products ensure your home is spotless and safe.',
    skills: ['Deep Cleaning', 'Move-in/Move-out', 'Eco-friendly Products', 'Organization'],
    availability: 'available',
    verified: true,
    yearsExperience: 8,
    completedJobs: 342,
    responseTime: '< 1 hour',
    location: 'Downtown'
  },
  {
    id: '2',
    name: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    category: 'Plumbing',
    categoryId: '2',
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 75,
    description: 'Licensed master plumber with expertise in residential and commercial plumbing. From leaky faucets to complete bathroom renovations, I handle it all with precision and professionalism.',
    skills: ['Pipe Repair', 'Water Heaters', 'Bathroom Remodeling', 'Emergency Services'],
    availability: 'available',
    verified: true,
    yearsExperience: 15,
    completedJobs: 567,
    responseTime: '< 30 min',
    location: 'Midtown'
  },
  {
    id: '3',
    name: 'Emily Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    category: 'Landscaping',
    categoryId: '4',
    rating: 4.7,
    reviewCount: 64,
    hourlyRate: 55,
    description: 'Creative landscape designer passionate about transforming outdoor spaces. I combine sustainable practices with beautiful design to create gardens that thrive year-round.',
    skills: ['Garden Design', 'Lawn Care', 'Irrigation Systems', 'Sustainable Landscaping'],
    availability: 'busy',
    verified: true,
    yearsExperience: 6,
    completedJobs: 189,
    responseTime: '< 2 hours',
    location: 'Suburbs'
  },
  {
    id: '4',
    name: 'David Park',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    category: 'Electrical',
    categoryId: '3',
    rating: 4.9,
    reviewCount: 156,
    hourlyRate: 85,
    description: 'Certified master electrician specializing in residential electrical work. Safety is my top priority. I handle everything from simple repairs to complete home rewiring.',
    skills: ['Wiring', 'Panel Upgrades', 'Smart Home Installation', 'Safety Inspections'],
    availability: 'available',
    verified: true,
    yearsExperience: 12,
    completedJobs: 478,
    responseTime: '< 1 hour',
    location: 'Citywide'
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    category: 'Pet Care',
    categoryId: '8',
    rating: 5.0,
    reviewCount: 203,
    hourlyRate: 35,
    description: 'Certified pet care specialist and animal lover. I treat every pet like my own family. Services include dog walking, pet sitting, grooming, and specialized care for senior pets.',
    skills: ['Dog Walking', 'Pet Sitting', 'Grooming', 'Senior Pet Care'],
    availability: 'available',
    verified: true,
    yearsExperience: 10,
    completedJobs: 892,
    responseTime: '< 15 min',
    location: 'North Side'
  },
  {
    id: '6',
    name: 'Robert Martinez',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    category: 'Handyman',
    categoryId: '7',
    rating: 4.6,
    reviewCount: 98,
    hourlyRate: 50,
    description: 'Jack of all trades with expertise in home repairs and maintenance. No job is too small! From fixing squeaky doors to assembling furniture, I\'ve got you covered.',
    skills: ['Furniture Assembly', 'Drywall Repair', 'Door/Window Repair', 'General Maintenance'],
    availability: 'available',
    verified: true,
    yearsExperience: 20,
    completedJobs: 1205,
    responseTime: '< 1 hour',
    location: 'East Side'
  },
  {
    id: '7',
    name: 'Amanda Wilson',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    category: 'Painting',
    categoryId: '6',
    rating: 4.8,
    reviewCount: 71,
    hourlyRate: 60,
    description: 'Professional painter with an eye for color and detail. I transform spaces with quality workmanship and premium paints. Free color consultations included!',
    skills: ['Interior Painting', 'Exterior Painting', 'Color Consultation', 'Cabinet Refinishing'],
    availability: 'busy',
    verified: true,
    yearsExperience: 9,
    completedJobs: 234,
    responseTime: '< 3 hours',
    location: 'West Side'
  },
  {
    id: '8',
    name: 'James Brown',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    category: 'Moving',
    categoryId: '5',
    rating: 4.7,
    reviewCount: 145,
    hourlyRate: 65,
    description: 'Experienced mover specializing in residential and commercial relocations. My team handles your belongings with care. Packing services and storage solutions available.',
    skills: ['Residential Moving', 'Commercial Moving', 'Packing Services', 'Storage'],
    availability: 'available',
    verified: true,
    yearsExperience: 11,
    completedJobs: 678,
    responseTime: '< 2 hours',
    location: 'Citywide'
  },
];

export const reviews: Review[] = [
  { id: '1', providerId: '1', clientName: 'John D.', clientAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100', rating: 5, comment: 'Sarah did an amazing job! My apartment has never looked cleaner. Highly recommend!', date: '2024-01-15', serviceType: 'Deep Cleaning' },
  { id: '2', providerId: '1', clientName: 'Maria S.', clientAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100', rating: 5, comment: 'Very professional and thorough. She even organized my closets!', date: '2024-01-10', serviceType: 'Move-out Cleaning' },
  { id: '3', providerId: '2', clientName: 'Alex T.', clientAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', rating: 5, comment: 'Fixed my emergency leak in under an hour. Life saver!', date: '2024-01-18', serviceType: 'Emergency Repair' },
  { id: '4', providerId: '2', clientName: 'Rachel K.', clientAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100', rating: 4, comment: 'Great work on the bathroom renovation. A bit over budget but quality work.', date: '2024-01-05', serviceType: 'Bathroom Remodel' },
  { id: '5', providerId: '5', clientName: 'Chris M.', clientAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100', rating: 5, comment: 'Lisa is absolutely wonderful with my dogs! They love her.', date: '2024-01-20', serviceType: 'Pet Sitting' },
  { id: '6', providerId: '5', clientName: 'Emma L.', clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100', rating: 5, comment: 'Best pet sitter ever! My cat was so happy when I returned.', date: '2024-01-12', serviceType: 'Pet Sitting' },
];

export const sampleRequests: ServiceRequest[] = [
  { id: '1', clientId: 'c1', providerId: '1', providerName: 'Sarah Mitchell', category: 'Home Cleaning', status: 'completed', description: 'Deep cleaning for 2BR apartment', date: '2024-01-15', time: '10:00 AM', budget: 150, createdAt: '2024-01-14' },
  { id: '2', clientId: 'c1', providerId: '2', providerName: 'Mike Johnson', category: 'Plumbing', status: 'in_progress', description: 'Kitchen sink repair', date: '2024-01-22', time: '2:00 PM', budget: 200, createdAt: '2024-01-20' },
  { id: '3', clientId: 'c1', providerId: '5', providerName: 'Lisa Thompson', category: 'Pet Care', status: 'pending', description: 'Weekend pet sitting for 2 dogs', date: '2024-01-27', time: '9:00 AM', budget: 120, createdAt: '2024-01-21' },
];

export const currentUser: User = {
  id: 'c1',
  name: 'Alex Rivera',
  email: 'alex.rivera@email.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  role: 'client',
  phone: '(555) 123-4567',
  location: 'Downtown, Metro City'
};

export const providerUser: User = {
  id: 'p1',
  name: 'Sarah Mitchell',
  email: 'sarah.mitchell@email.com',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  role: 'provider',
  phone: '(555) 987-6543',
  location: 'Downtown'
};

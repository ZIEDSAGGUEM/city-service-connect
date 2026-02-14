import { Link } from 'react-router-dom';
import type { Provider } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Shield, Clock, MapPin } from 'lucide-react';

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const availabilityColors = {
    AVAILABLE: 'bg-success text-success-foreground',
    BUSY: 'bg-warning text-warning-foreground',
    UNAVAILABLE: 'bg-muted text-muted-foreground',
  };

  const availabilityLabels = {
    AVAILABLE: 'Available Now',
    BUSY: 'Busy',
    UNAVAILABLE: 'Unavailable',
  };

  return (
    <Link
      to={`/providers/${provider.id}`}
      className="group block bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      {/* Header */}
      <div className="relative p-5 pb-0">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={provider.user?.avatar || undefined} alt={provider.user?.name || 'Provider'} />
            <AvatarFallback>{provider.user?.name?.charAt(0).toUpperCase() || 'P'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display font-semibold text-lg text-foreground truncate group-hover:text-primary transition-colors">
                {provider.user?.name || 'Unknown Provider'}
              </h3>
              {provider.verified && (
                <Shield className="h-4 w-4 text-primary flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {provider.category?.icon} {provider.category?.name || 'Service Provider'}
            </p>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="font-medium text-foreground">{provider.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({provider.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Availability Badge */}
        <Badge
          className={`absolute top-4 right-4 ${availabilityColors[provider.availability]}`}
        >
          {availabilityLabels[provider.availability]}
        </Badge>
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {provider.bio || 'No description available'}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {provider.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
            >
              {skill}
            </span>
          ))}
          {provider.skills.length > 3 && (
            <span className="px-2 py-1 text-xs text-muted-foreground">
              +{provider.skills.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{provider.responseTime}</span>
            </div>
            {provider.user?.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{provider.user.location}</span>
              </div>
            )}
          </div>
          <p className="font-semibold text-foreground">
            ${provider.hourlyRate}<span className="text-sm font-normal text-muted-foreground">/hr</span>
          </p>
        </div>
      </div>
    </Link>
  );
}

import { Link } from 'react-router-dom';
import type { Provider } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Shield, Clock, MapPin, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const availabilityColors = {
    AVAILABLE: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    BUSY: 'bg-amber-500/15 text-amber-800 dark:text-amber-400 border-amber-500/20',
    UNAVAILABLE: 'bg-muted text-muted-foreground border-border',
  };

  const availabilityLabels = {
    AVAILABLE: 'Available',
    BUSY: 'Busy',
    UNAVAILABLE: 'Away',
  };

  return (
    <Link
      to={`/providers/${provider.id}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/95 text-left shadow-soft',
        'transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-medium',
      )}
    >
      <div className="absolute right-4 top-4 z-10">
        <Badge
          variant="outline"
          className={cn('border font-medium shadow-sm backdrop-blur-sm', availabilityColors[provider.availability])}
        >
          {availabilityLabels[provider.availability]}
        </Badge>
      </div>

      <div className="relative border-b border-border/50 bg-gradient-to-br from-primary/[0.04] to-transparent p-5 pb-4">
        <div className="flex gap-4">
          <Avatar className="h-[4.5rem] w-[4.5rem] border-2 border-card shadow-md ring-2 ring-primary/10">
            <AvatarImage src={provider.user?.avatar || undefined} alt={provider.user?.name || 'Provider'} />
            <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-lg font-semibold text-primary">
              {provider.user?.name?.charAt(0).toUpperCase() || 'P'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 pt-0.5 pr-16">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-display text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                {provider.user?.name || 'Provider'}
              </h3>
              {provider.verified && (
                <Shield className="h-4 w-4 shrink-0 text-primary" aria-label="Verified" />
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="mr-1">{provider.category?.icon}</span>
              {provider.category?.name || 'Service'}
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{provider.rating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({provider.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {provider.bio || 'Experienced professional ready to help with your project.'}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {provider.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-lg border border-border/60 bg-secondary/50 px-2.5 py-1 text-xs font-medium text-secondary-foreground"
            >
              {skill}
            </span>
          ))}
          {provider.skills.length > 3 && (
            <span className="self-center text-xs text-muted-foreground">+{provider.skills.length - 3}</span>
          )}
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-border/50 pt-4">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground sm:text-sm">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {provider.responseTime}
            </span>
            {provider.user?.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {provider.user.location}
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="font-display text-xl font-bold text-foreground">${provider.hourlyRate}</span>
            <span className="text-sm font-normal text-muted-foreground">/hr</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end text-sm font-semibold text-primary opacity-0 transition-all group-hover:opacity-100">
          View profile
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

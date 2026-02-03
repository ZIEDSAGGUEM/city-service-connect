import { Link } from 'react-router-dom';
import { providers } from '@/lib/data';
import { ProviderCard } from '@/components/providers/ProviderCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function FeaturedProviders() {
  const featuredProviders = providers.slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Top-Rated Providers
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Highly recommended professionals trusted by your neighbors
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/services" className="inline-flex items-center gap-2">
              Browse all providers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Provider Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProviders.map((provider, index) => (
            <div
              key={provider.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProviderCard provider={provider} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

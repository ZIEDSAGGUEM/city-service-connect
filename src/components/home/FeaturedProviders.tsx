import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProviderCard } from '@/components/providers/ProviderCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { providersApi } from '@/lib/api';
import type { Provider } from '@/lib/types';

export function FeaturedProviders() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopProviders = async () => {
      try {
        // Fetch providers and sort by rating, take top 4
        const data = await providersApi.search({ minRating: 4 });
        const topProviders = data
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 4);
        setProviders(topProviders);
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopProviders();
  }, []);

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
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : providers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {providers.map((provider, index) => (
            <div
              key={provider.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProviderCard provider={provider} />
            </div>
          ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No providers available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}

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
        const data = await providersApi.search({ minRating: 4 });
        const topProviders = data.sort((a, b) => b.rating - a.rating).slice(0, 4);
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
    <section className="relative border-y border-border/50 bg-gradient-to-b from-secondary/35 via-secondary/25 to-background py-20 md:py-28 dark:from-secondary/15 dark:via-secondary/10">
      <div className="container">
        <div className="mb-14 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="section-label">Spotlight</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.5rem]">
              Top-rated near you
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Highly reviewed professionals your neighbors recommend—updated from real bookings and ratings.
            </p>
          </div>
          <Button
            variant="outline"
            className="h-11 self-start rounded-full border-primary/25 px-6 font-semibold shadow-sm hover:bg-primary/5 md:self-auto"
            asChild
          >
            <Link to="/services" className="inline-flex items-center gap-2">
              Browse all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : providers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {providers.map((provider, index) => (
              <div key={provider.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.08}s` }}>
                <ProviderCard provider={provider} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/50 py-16 text-center">
            <p className="text-muted-foreground">No providers available yet. Check back soon.</p>
          </div>
        )}
      </div>
    </section>
  );
}

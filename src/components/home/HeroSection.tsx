import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Sparkles, Users, Star } from 'lucide-react';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    navigate(`/services?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[520px] w-[min(100%,720px)] -translate-x-1/2 rounded-[100%] bg-gradient-to-b from-primary/[0.12] via-transparent to-transparent blur-2xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-accent/[0.07] blur-3xl" />
      </div>

      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/90 px-4 py-1.5 text-sm font-medium text-primary shadow-soft backdrop-blur-sm animate-slide-up"
            style={{ animationDelay: '0s' }}
          >
            <Sparkles className="h-4 w-4" />
            Trusted pros in your neighborhood
          </div>

          <h1
            className="font-display text-[2.25rem] font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-[3.5rem] animate-slide-up"
            style={{ animationDelay: '0.05s' }}
          >
            Find{' '}
            <span className="text-gradient-hero">reliable</span> local{' '}
            <span className="relative whitespace-nowrap">
              service providers
              <span className="absolute -bottom-1 left-0 right-0 mx-auto h-1 max-w-[8rem] rounded-full bg-gradient-to-r from-accent/80 to-primary/60 opacity-90" />
            </span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            Compare verified professionals, message in real time, and book home services—from cleaning to repairs—with
            confidence.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 max-w-3xl animate-slide-up"
            style={{ animationDelay: '0.15s' }}
          >
            <div className="rounded-2xl border border-border/80 bg-card/95 p-2 shadow-large ring-1 ring-black/[0.03] backdrop-blur-md dark:ring-white/[0.06] sm:p-2.5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
                <div className="relative min-h-[3.25rem] flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Plumber, cleaning, electrician…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 border-0 bg-transparent pl-12 text-base shadow-none focus-visible:ring-0 sm:h-full sm:min-h-[3.25rem]"
                  />
                </div>
                <div className="hidden h-auto w-px bg-border/80 sm:block self-stretch my-2" />
                <div className="relative min-h-[3.25rem] flex-1 border-t border-border/60 pt-2 sm:border-t-0 sm:pt-0">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground sm:top-[calc(50%+2px)]" />
                  <Input
                    type="text"
                    placeholder="City or ZIP"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-12 border-0 bg-transparent pl-12 text-base shadow-none focus-visible:ring-0 sm:h-full sm:min-h-[3.25rem]"
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="h-12 shrink-0 rounded-xl px-8 sm:h-auto sm:min-h-[3.25rem]">
                  Search
                </Button>
              </div>
            </div>
          </form>

          <div
            className="mt-6 flex flex-wrap items-center justify-center gap-2 animate-fade-in"
            style={{ animationDelay: '0.25s' }}
          >
            <span className="text-sm text-muted-foreground">Popular:</span>
            {['House Cleaning', 'Plumber', 'Electrician', 'Landscaping'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setSearchQuery(term);
                  navigate(`/services?q=${encodeURIComponent(term)}`);
                }}
                className="rounded-full border border-border/60 bg-card/80 px-3.5 py-1.5 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              >
                {term}
              </button>
            ))}
          </div>

          <div
            className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-6 border-t border-border/60 pt-10 text-center sm:gap-8 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <div>
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">500+</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Active pros</p>
            </div>
            <div>
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent">
                <Star className="h-5 w-5" />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">4.9</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Avg. rating</p>
            </div>
            <div>
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="font-display text-2xl font-bold text-foreground">24h</p>
              <p className="text-xs text-muted-foreground sm:text-sm">Typical reply</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

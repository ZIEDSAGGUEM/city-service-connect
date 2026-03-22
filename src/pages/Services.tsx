import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProviderCard } from '@/components/providers/ProviderCard';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, MapPin, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { providersApi, categoriesApi } from '@/lib/api';
import type { Provider, Category, SearchProvidersFilters } from '@/lib/types';
import { toast } from 'sonner';

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Data states
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states — initialised from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('rating');
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Debounced search inputs
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [debouncedLocation, setDebouncedLocation] = useState(locationQuery);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const locationTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    searchTimerRef.current = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(searchTimerRef.current);
  }, [searchQuery]);

  useEffect(() => {
    locationTimerRef.current = setTimeout(() => setDebouncedLocation(locationQuery), 400);
    return () => clearTimeout(locationTimerRef.current);
  }, [locationQuery]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategories(data);
      } catch (error: any) {
        console.error('Failed to fetch categories:', error);
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Debounced price range
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange);
  const priceTimerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    priceTimerRef.current = setTimeout(() => setDebouncedPriceRange(priceRange), 400);
    return () => clearTimeout(priceTimerRef.current);
  }, [priceRange[0], priceRange[1]]);

  // Fetch providers from backend whenever filters change
  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters: SearchProvidersFilters = {};

      if (debouncedSearch.trim()) {
        filters.q = debouncedSearch.trim();
      }
      if (debouncedLocation.trim()) {
        filters.location = debouncedLocation.trim();
      }
      if (selectedCategory && selectedCategory !== 'all') {
        filters.categoryId = selectedCategory;
      }
      if (debouncedPriceRange[1] < 150) {
        filters.maxHourlyRate = debouncedPriceRange[1];
      }
      if (availableOnly) {
        filters.availability = 'AVAILABLE';
      }
      if (verifiedOnly) {
        filters.verified = true;
      }

      const data = await providersApi.search(filters);
      setProviders(data);
    } catch (error: any) {
      console.error('Failed to fetch providers:', error);
      toast.error('Failed to load providers');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, debouncedLocation, selectedCategory, debouncedPriceRange, availableOnly, verifiedOnly]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  // Sort client-side (backend already filtered)
  const sortedProviders = useMemo(() => {
    const result = [...providers];
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'price-high':
        result.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case 'experience':
        result.sort((a, b) => b.yearsExperience - a.yearsExperience);
        break;
      case 'jobs':
        result.sort((a, b) => b.completedJobs - a.completedJobs);
        break;
    }
    return result;
  }, [providers, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 150]);
    setAvailableOnly(false);
    setVerifiedOnly(false);
    setSearchQuery('');
    setLocationQuery('');
    setSortBy('rating');
    setSearchParams({});
  };

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (locationQuery) params.set('location', locationQuery);
    if (selectedCategory && selectedCategory !== 'all') params.set('category', selectedCategory);
    setSearchParams(params, { replace: true });
  }, [searchQuery, locationQuery, selectedCategory, setSearchParams]);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-mesh bg-dot-pattern">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-primary/[0.06] blur-3xl" />
      </div>
      <Header onOpenAI={() => setIsAIOpen(true)} />

      <main className="flex-1 container py-10 md:py-12">
        <div className="mb-10 space-y-2">
          <p className="section-label">Directory</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Find your provider
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Search by skill, filter by price and availability, then open a profile to book.
          </p>
        </div>

        <div className="mb-10 flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Name, service, or skills…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-11 shadow-sm"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="City or area"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="h-12 pl-11 shadow-sm"
              />
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="icon"
              className="h-12 w-12 shrink-0 rounded-xl border-primary/20 shadow-sm"
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {showFilters && (
            <div className="animate-fade-in rounded-2xl border border-border/80 bg-card/95 p-6 shadow-medium backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Filters</h3>
                <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="experience">Most Experience</SelectItem>
                      <SelectItem value="jobs">Most Jobs Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}/hr
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={150}
                    step={5}
                    className="mt-2"
                  />
                </div>

                {/* Quick Filters */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Quick Filters</label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="available"
                        checked={availableOnly}
                        onCheckedChange={(checked) => setAvailableOnly(checked as boolean)}
                      />
                      <label htmlFor="available" className="text-sm cursor-pointer">
                        Available Now
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="verified"
                        checked={verifiedOnly}
                        onCheckedChange={(checked) => setVerifiedOnly(checked as boolean)}
                      />
                      <label htmlFor="verified" className="text-sm cursor-pointer">
                        Verified Only
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {selectedCategory === 'all'
                ? 'All providers'
                : `${categories.find((c) => c.id === selectedCategory)?.name || ''} providers`}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              {isLoading
                ? 'Loading…'
                : `${sortedProviders.length} match${sortedProviders.length !== 1 ? 'es' : ''}`}
            </p>
          </div>
        </div>

        {/* Providers Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-lg text-muted-foreground">Loading providers...</p>
            </div>
          </div>
        ) : sortedProviders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No Providers Found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search query
            </p>
            <Button onClick={handleClearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}

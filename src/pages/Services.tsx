import { useState, useMemo, useEffect } from 'react';
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
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { providersApi, categoriesApi } from '@/lib/api';
import type { Provider, Category } from '@/lib/types';
import { toast } from 'sonner';

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Data states
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('rating');
  const [priceRange, setPriceRange] = useState([0, 150]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

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

  // Fetch providers based on filters
  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);
      try {
        const filters: any = {};
        
        if (selectedCategory && selectedCategory !== 'all') {
          filters.categoryId = selectedCategory;
        }
        if (priceRange[1] < 150) {
          filters.maxHourlyRate = priceRange[1];
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
    };

    fetchProviders();
  }, [selectedCategory, priceRange, availableOnly, verifiedOnly]);

  const filteredProviders = useMemo(() => {
    let result = [...providers];

    // Search filter (client-side for responsiveness)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.user?.name.toLowerCase().includes(query) ||
          p.category?.name.toLowerCase().includes(query) ||
          p.skills.some(s => s.toLowerCase().includes(query)) ||
          p.bio?.toLowerCase().includes(query)
      );
    }

    // Price filter (client-side refine)
    result = result.filter(
      p => p.hourlyRate >= priceRange[0] && p.hourlyRate <= priceRange[1]
    );

    // Sorting
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
  }, [providers, searchQuery, priceRange, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 150]);
    setAvailableOnly(false);
    setVerifiedOnly(false);
    setSearchQuery('');
    setSortBy('rating');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <Header onOpenAI={() => setIsAIOpen(true)} />

      <main className="flex-1 container py-8">
        {/* Search and Filters Header */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search providers by name, service, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? 'bg-primary text-primary-foreground' : ''}
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-card rounded-xl p-6 shadow-sm border animate-fade-in">
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

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              {selectedCategory === 'all' 
                ? 'All Service Providers' 
                : `${categories.find(c => c.id === selectedCategory)?.name} Providers`}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isLoading ? 'Loading...' : `${filteredProviders.length} provider${filteredProviders.length !== 1 ? 's' : ''} found`}
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
        ) : filteredProviders.length === 0 ? (
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
            {filteredProviders.map((provider) => (
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

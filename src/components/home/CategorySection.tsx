import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Wrench, Zap, Trees, Truck, Paintbrush, Hammer, Dog, ArrowRight, Loader2 } from 'lucide-react';
import { categoriesApi } from '@/lib/api';
import type { Category } from '@/lib/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  wrench: Wrench,
  zap: Zap,
  trees: Trees,
  truck: Truck,
  paintbrush: Paintbrush,
  hammer: Hammer,
  dog: Dog,
};

export function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getAll();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Browse by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              Find the right professional for any home service need
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
          >
            View all services
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Category Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => {
            const Icon = iconMap[category.icon] || Home;
            return (
              <Link
                key={category.id}
                to={`/services?category=${category.id}`}
                className="group relative p-6 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
                  <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {category.description}
                </p>
                <p className="text-sm font-medium text-primary">
                  {category.providerCount} providers
                </p>

                {/* Hover Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-5 w-5 text-primary" />
                </div>
              </Link>
            );
          })}
          </div>
        )}
      </div>
    </section>
  );
}

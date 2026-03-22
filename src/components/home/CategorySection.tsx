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
    <section className="relative py-20 md:py-28">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="container">
        <div className="mb-14 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl space-y-3">
            <p className="section-label">Categories</p>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.5rem]">
              Browse by specialty
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Every trade in one place—pick a category and discover pros who fit your project.
            </p>
          </div>
          <Link
            to="/services"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-primary/25 bg-card px-5 py-2.5 text-sm font-semibold text-primary shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5 hover:gap-3 md:self-auto"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {categories.map((category, index) => {
              const Icon = iconMap[category.icon] || Home;
              return (
                <Link
                  key={category.id}
                  to={`/services?category=${category.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/90 p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-medium animate-slide-up backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/[0.06] transition-transform duration-500 group-hover:scale-150" />
                  <div className="relative">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/12 to-primary/5 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:from-primary group-hover:to-primary/90 group-hover:text-primary-foreground group-hover:ring-primary/20 group-hover:shadow-md">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">{category.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">{category.description}</p>
                    <p className="mt-4 text-sm font-semibold text-primary">{category.providerCount} providers</p>
                    <ArrowRight className="absolute right-0 top-6 h-5 w-5 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
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

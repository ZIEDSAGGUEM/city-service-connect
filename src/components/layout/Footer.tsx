import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { ShieldCheck, Headphones } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const linkGroups = [
    {
      title: 'Discover',
      links: [
        { label: 'Browse Services', to: '/services' },
        { label: 'How It Works', to: '/how-it-works' },
        { label: 'Become a Provider', to: '/become-provider' },
      ],
    },
    {
      title: 'Account',
      links: [
        { label: 'Log in', to: '/login' },
        { label: 'Sign up', to: '/register' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Terms of Service', to: '/terms' },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-border/60 bg-gradient-to-b from-secondary/40 to-secondary/70 dark:from-secondary/20 dark:to-background">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
      <div className="container py-14 md:py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5 space-y-5">
            <BrandLogo showTagline className="items-start" />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Book vetted local professionals for your home and business. Compare profiles, chat in-app, and get the job
              done with confidence.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Verified providers
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <Headphones className="h-3.5 w-3.5 text-primary" />
                In-app messaging
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7 lg:justify-end">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <p className="section-label mb-4">{group.title}</p>
                <ul className="space-y-3">
                  {group.links.map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-center text-sm text-muted-foreground sm:text-left">
            &copy; {currentYear} City Service Connect. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/80">Crafted for local service marketplaces</p>
        </div>
      </div>
    </footer>
  );
}

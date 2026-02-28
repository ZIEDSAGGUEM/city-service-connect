import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">LocalPro</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs text-center md:text-left">
              Connecting you with trusted local service providers.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
              Browse Services
            </Link>
            <Link to="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link to="/become-provider" className="text-muted-foreground hover:text-primary transition-colors">
              Become a Provider
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} LocalPro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

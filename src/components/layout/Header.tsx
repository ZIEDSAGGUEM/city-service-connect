import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, LogOut, Settings, LayoutDashboard, Bot, MessageSquare, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onOpenAI?: () => void;
}

export function Header({ onOpenAI }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Browse Services', path: '/services' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Become a Provider', path: '/become-provider' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="container flex h-[4.25rem] items-center justify-between gap-4">
        <BrandLogo />

        <nav className="hidden md:flex items-center rounded-full border border-border/80 bg-secondary/40 p-1 shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all duration-200',
                isActive(link.path)
                  ? 'bg-card text-primary shadow-soft ring-1 ring-primary/15'
                  : 'text-muted-foreground hover:bg-card/80 hover:text-foreground',
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:inline-flex h-9 rounded-full border-primary/20 bg-card/50 shadow-sm hover:border-primary/40 hover:bg-accent/5 hover:text-foreground"
            onClick={onOpenAI}
          >
            <Bot className="h-4 w-4 text-primary" />
            <span className="font-medium">AI Assistant</span>
          </Button>

          {isAuthenticated && user ? (
            <>
              <NotificationBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full ring-2 ring-transparent transition-all hover:ring-primary/25"
                  >
                    <Avatar className="h-10 w-10 border-2 border-primary/15 shadow-sm">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-xl border-border/80 shadow-large" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      <p className="text-xs capitalize text-primary/90">{user.role.toLowerCase()}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link
                      to={
                        user.role === 'ADMIN'
                          ? '/admin'
                          : user.role === 'CLIENT'
                            ? '/dashboard'
                            : '/provider-dashboard'
                      }
                      className="flex items-center"
                    >
                      {user.role === 'ADMIN' ? (
                        <ShieldCheck className="mr-2 h-4 w-4" />
                      ) : (
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                      )}
                      {user.role === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link to="/messages" className="flex items-center">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer rounded-lg text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm" className="rounded-full font-medium" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button variant="hero" size="sm" className="rounded-full px-5" asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-lg animate-fade-in">
          <nav className="container flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Button
              variant="outline"
              className="mt-2 h-11 rounded-xl justify-center gap-2 border-primary/20"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAI?.();
              }}
            >
              <Bot className="h-4 w-4 text-primary" />
              AI Assistant
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

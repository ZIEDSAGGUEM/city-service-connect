import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { signIn } from '@/lib/auth';
import { useAuth } from '@/contexts/AuthContext';
import { BrandLogo } from '@/components/layout/BrandLogo';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await signIn({ email, password });
      setUser(response.user);
      toast.success('Welcome back!', {
        description: 'You have been logged in successfully.',
      });
      if (response.user.role === 'PROVIDER') {
        navigate('/provider-dashboard');
      } else if (response.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Please check your credentials and try again.';
      toast.error('Login failed', { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-mesh bg-dot-pattern lg:grid lg:grid-cols-2">
      <div className="pointer-events-none absolute inset-0 -z-10 lg:hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
        <BrandLogo className="mb-10" />

        <Card className="mx-auto w-full max-w-md border-border/80 shadow-large">
          <CardHeader className="space-y-1 pb-2">
            <CardTitle className="font-display text-2xl tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-base">Sign in to manage bookings and messages.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember this device
                </label>
              </div>

              <Button type="submit" variant="hero" className="h-12 w-full rounded-xl text-base" disabled={isLoading}>
                {isLoading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Create one
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-hero lg:flex lg:flex-col lg:justify-center lg:p-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-80 w-80 rounded-full bg-black/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-md text-primary-foreground">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-foreground/70">City Service Connect</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            Hire local pros without the hassle.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-primary-foreground/85">
            One place to discover, message, and book vetted service providers in your area.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, User, Eye, EyeOff, Briefcase, Search } from 'lucide-react';
import { toast } from 'sonner';
import { signUp } from '@/lib/auth';
import type { UserRole } from '@/lib/auth';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { cn } from '@/lib/utils';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CLIENT' as UserRole,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      toast.error('Password too short', {
        description: 'Password must be at least 8 characters long.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
      });

      toast.success('Account created!', {
        description: response.message || 'Please check your email to verify your account.',
      });

      navigate('/login');
    } catch (error: any) {
      toast.error('Registration failed', {
        description: error.response?.data?.message || error.message || 'Please try again.',
      });
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
            <CardTitle className="font-display text-2xl tracking-tight">Create an account</CardTitle>
            <CardDescription className="text-base">Book services or start earning as a provider.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label>I want to</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                  className="grid grid-cols-2 gap-3"
                >
                  <Label
                    htmlFor="client"
                    className={cn(
                      'flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                      formData.role === 'CLIENT'
                        ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/15'
                        : 'border-border/80 hover:border-primary/35',
                    )}
                  >
                    <RadioGroupItem value="CLIENT" id="client" className="sr-only" />
                    <Search className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold">Find services</span>
                  </Label>
                  <Label
                    htmlFor="provider"
                    className={cn(
                      'flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                      formData.role === 'PROVIDER'
                        ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/15'
                        : 'border-border/80 hover:border-primary/35',
                    )}
                  >
                    <RadioGroupItem value="PROVIDER" id="provider" className="sr-only" />
                    <Briefcase className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold">Offer services</span>
                  </Label>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                <p className="text-xs text-muted-foreground">Use 8+ characters for a stronger account.</p>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox id="terms" required className="mt-1" />
                <label htmlFor="terms" className="text-sm leading-snug text-muted-foreground cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms" className="font-medium text-primary hover:underline">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-medium text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button type="submit" variant="hero" className="h-12 w-full rounded-xl text-base" disabled={isLoading}>
                {isLoading ? 'Creating account…' : 'Create account'}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Sign in
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
          <p className="text-sm font-semibold uppercase tracking-widest text-primary-foreground/70">Join the network</p>
          <h2 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            Clients meet pros. Everyone wins.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-primary-foreground/85">
            Whether you need a hand at home or want to grow your local business, we keep it simple and transparent.
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';
import { AppPageShell } from '@/components/layout/AppPageShell';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { toast } from 'sonner';
import { authApi } from '@/lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const sendResetEmail = async () => {
    setIsLoading(true);
    try {
      await authApi.requestPasswordReset(email);
      setEmailSent(true);
      toast.success('Email sent!', {
        description: 'Check your inbox for password reset instructions.',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset email. Please try again.';
      toast.error('Request failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendResetEmail();
  };

  return (
    <AppPageShell>
      <div className="flex min-h-screen flex-1 flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="mb-8">
            <BrandLogo className="gap-2.5" />
          </div>

          {/* Back to Login */}
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          {!emailSent ? (
            <>
              {/* Header */}
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                  Forgot password?
                </h1>
                <p className="text-muted-foreground">
                  No worries! Enter your email and we'll send you reset instructions.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Check your email
                </h1>
                <p className="text-muted-foreground">
                  We've sent password reset instructions to <span className="font-medium text-foreground">{email}</span>
                </p>
                <div className="pt-4">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login">Back to login</Link>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email?{' '}
                  <button
                    onClick={() => sendResetEmail()}
                    className="text-primary font-medium hover:underline"
                  >
                    Resend
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-hero relative">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-primary-foreground max-w-md">
            <h2 className="font-display text-4xl font-bold mb-4">
              We've Got You Covered
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Forgot your password? No problem. We'll help you get back to connecting with trusted local professionals.
            </p>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
      </div>
      </div>
    </AppPageShell>
  );
}





import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { verifyEmail } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AppPageShell } from '@/components/layout/AppPageShell';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus('success');
        setMessage(response.message);

        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Verification failed');
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <AppPageShell>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="mb-8">
          <BrandLogo className="gap-2.5" />
        </div>
        <Card className="w-full max-w-md border-border/70 shadow-soft">
          <CardContent className="p-8 text-center">
            {status === 'loading' && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <h1 className="font-display text-2xl font-bold text-foreground">Verifying your email…</h1>
                <p className="text-sm text-muted-foreground">Please wait a moment.</p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground">Email verified</h1>
                <p className="text-sm text-muted-foreground">{message}</p>
                <p className="text-xs text-muted-foreground">Redirecting to login…</p>
                <Button variant="hero" className="mt-2" asChild>
                  <Link to="/login">Go to login</Link>
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/15">
                  <XCircle className="h-10 w-10 text-destructive" />
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground">Verification failed</h1>
                <p className="text-sm text-muted-foreground">{message}</p>
                <Button variant="outline" className="mt-2 border-border/70" asChild>
                  <Link to="/login">Back to login</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </AppPageShell>
  );
}

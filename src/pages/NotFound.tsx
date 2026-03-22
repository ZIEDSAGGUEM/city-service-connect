import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AppPageShell } from "@/components/layout/AppPageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <AppPageShell>
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <Card className="max-w-md border-border/70 text-center shadow-soft">
          <CardContent className="space-y-4 p-10">
            <p className="section-label">Error 404</p>
            <h1 className="font-display text-5xl font-bold tracking-tight text-foreground">Page not found</h1>
            <p className="text-muted-foreground">
              The page you’re looking for doesn’t exist or was moved.
            </p>
            <Button variant="hero" asChild className="mt-2">
              <Link to="/">Return home</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </AppPageShell>
  );
};

export default NotFound;

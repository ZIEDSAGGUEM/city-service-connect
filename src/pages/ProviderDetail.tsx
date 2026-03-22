import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AppPageShell } from '@/components/layout/AppPageShell';
import { Card, CardContent } from '@/components/ui/card';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Shield, Clock, MapPin, Briefcase, Loader2, MessageSquare, ArrowLeft, CheckCircle, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { providersApi, reviewsApi, favoritesApi } from '@/lib/api';
import type { Provider, Review } from '@/lib/types';
import { BookingRequestDialog } from '@/components/service-requests/BookingRequestDialog';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export default function ProviderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isTogglingFav, setIsTogglingFav] = useState(false);

  // Fetch provider data
  useEffect(() => {
    const fetchProvider = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await providersApi.getById(id);
        setProvider(data);
      } catch (error: any) {
        console.error('Failed to fetch provider:', error);
        toast.error('Failed to load provider details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProvider();
  }, [id]);

  // Check favorite status
  useEffect(() => {
    if (!id || !user) return;
    favoritesApi.check(id).then((data) => setIsFavorited(data.favorited)).catch(() => {});
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!id || isTogglingFav) return;
    setIsTogglingFav(true);
    try {
      const result = await favoritesApi.toggle(id);
      setIsFavorited(result.favorited);
      toast.success(result.favorited ? 'Added to favorites' : 'Removed from favorites');
    } catch {
      toast.error('Failed to update favorites');
    } finally {
      setIsTogglingFav(false);
    }
  };

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;
      
      setIsLoadingReviews(true);
      try {
        const data = await reviewsApi.getProviderReviews(id);
        setReviews(data);
      } catch (error: any) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    if (provider) {
      fetchReviews();
    }
  }, [id, provider]);

  const availabilityColors = {
    AVAILABLE: 'bg-success text-success-foreground',
    BUSY: 'bg-warning text-warning-foreground',
    UNAVAILABLE: 'bg-muted text-muted-foreground',
  };

  const availabilityLabels = {
    AVAILABLE: 'Available Now',
    BUSY: 'Busy',
    UNAVAILABLE: 'Unavailable',
  };

  // Loading state
  if (isLoading) {
    return (
      <AppPageShell>
        <Header onOpenAI={() => setIsAIOpen(true)} />
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg text-muted-foreground">Loading provider details...</p>
          </div>
        </main>
        <Footer />
      </AppPageShell>
    );
  }

  // Not found state
  if (!provider) {
    return (
      <AppPageShell>
        <Header onOpenAI={() => setIsAIOpen(true)} />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <Card className="max-w-md border-border/70 shadow-soft">
            <CardContent className="p-10 text-center">
              <p className="section-label mb-3">Providers</p>
              <h1 className="mb-2 font-display text-2xl font-bold text-foreground">Provider not found</h1>
              <p className="mb-6 text-sm text-muted-foreground">
                This profile may have been removed or the link is incorrect.
              </p>
              <Button variant="hero" asChild>
                <Link to="/services">Browse all providers</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </AppPageShell>
    );
  }

  return (
    <AppPageShell>
      <Header onOpenAI={() => setIsAIOpen(true)} />

      <main className="container flex-1 py-10 md:py-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/services">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Providers
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Header */}
            <div className="rounded-2xl border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur-sm">
              <div className="flex items-start gap-6 mb-6">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src={provider.user?.avatar || undefined} alt={provider.user?.name} />
                  <AvatarFallback className="text-2xl">{provider.user?.name?.charAt(0).toUpperCase() || 'P'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-display font-bold text-foreground">{provider.user?.name}</h1>
                    {provider.verified && (
                      <Shield className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground mb-3">
                    {provider.category?.icon} {provider.category?.name}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-accent text-accent" />
                      <span className="font-semibold text-lg">{provider.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({provider.reviewCount} reviews)</span>
                    </div>
                    <Badge className={availabilityColors[provider.availability]}>
                      {availabilityLabels[provider.availability]}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-secondary/50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{provider.yearsExperience}+</div>
                  <div className="text-sm text-muted-foreground">Years Exp.</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{provider.completedJobs}</div>
                  <div className="text-sm text-muted-foreground">Jobs Done</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{provider.responseTime}</div>
                  <div className="text-sm text-muted-foreground">Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">${provider.hourlyRate}</div>
                  <div className="text-sm text-muted-foreground">Per Hour</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-soft backdrop-blur-sm">
              <TabsList className="h-14 w-full justify-start rounded-none border-b border-border/60 bg-muted/30">
                <TabsTrigger value="about" className="flex-1 sm:flex-none">About</TabsTrigger>
                <TabsTrigger value="portfolio" className="flex-1 sm:flex-none">Portfolio</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1 sm:flex-none">Reviews</TabsTrigger>
              </TabsList>

              <div className="p-6">
                {/* About Tab */}
                <TabsContent value="about" className="mt-0 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-3">About</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {provider.bio || 'No description available.'}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold mb-3">Skills & Expertise</h2>
                    <div className="flex flex-wrap gap-2">
                      {provider.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {provider.certifications.length > 0 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Certifications</h2>
                      <div className="space-y-2">
                        {provider.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-success" />
                            <span className="text-foreground">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {provider.availabilitySchedule && (
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Availability Schedule</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(provider.availabilitySchedule).map(([day, times]) => (
                          <div key={day} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                            <span className="font-medium capitalize">{day}</span>
                            <span className="text-sm text-muted-foreground">
                              {times.length > 0 ? times.join(', ') : 'Closed'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Portfolio Tab */}
                <TabsContent value="portfolio" className="mt-0">
                  <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
                  {provider.portfolio.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {provider.portfolio.map((image, index) => (
                        <div key={index} className="aspect-video rounded-lg overflow-hidden shadow-md">
                          <img src={image} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No portfolio items available.</p>
                  )}
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews" className="mt-0">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold">Reviews</h2>
                      <p className="text-sm text-muted-foreground">
                        {provider.reviewCount} {provider.reviewCount === 1 ? 'review' : 'reviews'}
                      </p>
                    </div>
                    {provider.reviewCount > 0 && (
                      <div className="flex items-center gap-2">
                        <Star className="h-6 w-6 fill-accent text-accent" />
                        <span className="text-2xl font-bold">{provider.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {isLoadingReviews ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-0">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={review.client?.avatar || undefined} />
                              <AvatarFallback>
                                {review.client?.name?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-semibold">{review.client?.name || 'Anonymous'}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? 'fill-accent text-accent'
                                          : 'text-muted'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Request Service Card */}
            <div className="sticky top-8 rounded-2xl border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur-sm">
              {user?.role === 'CLIENT' ? (
                <>
                  <div className="flex gap-2 mb-4">
                    <Button 
                      size="lg" 
                      className="flex-1" 
                      variant="hero"
                      onClick={() => setIsRequestOpen(true)}
                    >
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Request Service
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleToggleFavorite}
                      disabled={isTogglingFav}
                      className={isFavorited ? 'text-destructive border-destructive/30' : ''}
                    >
                      <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <BookingRequestDialog
                    isOpen={isRequestOpen}
                    onClose={() => setIsRequestOpen(false)}
                    provider={provider}
                  />
                </>
              ) : user ? (
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Only clients can request services
                </p>
              ) : (
                <Link to="/login">
                  <Button size="lg" className="w-full mb-4" variant="hero">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Login to Request Service
                  </Button>
                </Link>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="h-5 w-5 flex-shrink-0" />
                  <span>Responds in {provider.responseTime}</span>
                </div>
                {provider.user?.location && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 flex-shrink-0" />
                    <span>{provider.user.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Briefcase className="h-5 w-5 flex-shrink-0" />
                  <span>Service radius: {provider.serviceRadius} km</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            {provider.user?.phone && (
              <div className="rounded-2xl border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur-sm">
                <h3 className="mb-3 font-semibold">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <a href={`tel:${provider.user.phone}`} className="block font-medium text-primary hover:underline">
                      {provider.user.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </AppPageShell>
  );
}

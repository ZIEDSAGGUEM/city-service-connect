import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Shield, Clock, MapPin, Calendar, CheckCircle, MessageSquare, ArrowLeft, Briefcase, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { providersApi } from '@/lib/api';
import type { Provider } from '@/lib/types';

export default function ProviderDetail() {
  const { id } = useParams();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requestForm, setRequestForm] = useState({
    description: '',
    date: '',
    time: '',
    budget: '',
  });

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

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Request sent successfully!', {
      description: `${provider?.user?.name} will respond to your request soon.`,
    });
    setIsRequestOpen(false);
    setRequestForm({ description: '', date: '', time: '', budget: '' });
  };

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
      <div className="min-h-screen flex flex-col">
        <Header onOpenAI={() => setIsAIOpen(true)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-lg text-muted-foreground">Loading provider details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onOpenAI={() => setIsAIOpen(true)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Provider not found</h1>
            <Button asChild>
              <Link to="/services">Browse all providers</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <Header onOpenAI={() => setIsAIOpen(true)} />

      <main className="flex-1 container py-8">
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
            <div className="bg-card rounded-2xl shadow-soft p-6">
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
            <Tabs defaultValue="about" className="bg-card rounded-2xl shadow-soft overflow-hidden">
              <TabsList className="w-full justify-start border-b rounded-none h-14 bg-muted/30">
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
                  <h2 className="text-xl font-semibold mb-4">Reviews</h2>
                  <div className="space-y-4">
                    {provider.reviewCount > 0 ? (
                      <p className="text-muted-foreground">Reviews feature coming soon!</p>
                    ) : (
                      <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                    )}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Request Service Card */}
            <div className="bg-card rounded-2xl shadow-soft p-6 sticky top-8">
              <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full mb-4" variant="hero">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Request Service
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Service from {provider.user?.name}</DialogTitle>
                    <DialogDescription>
                      Fill out the form below and {provider.user?.name} will respond to your request.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleRequestSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="description">Service Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the service you need..."
                        value={requestForm.description}
                        onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Preferred Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={requestForm.date}
                          onChange={(e) => setRequestForm({ ...requestForm, date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Preferred Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={requestForm.time}
                          onChange={(e) => setRequestForm({ ...requestForm, time: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="budget">Budget ($)</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="100"
                        value={requestForm.budget}
                        onChange={(e) => setRequestForm({ ...requestForm, budget: e.target.value })}
                      />
                    </div>
                    <Button type="submit" className="w-full" variant="hero">
                      Send Request
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

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
              <div className="bg-card rounded-2xl shadow-soft p-6">
                <h3 className="font-semibold mb-3">Contact Information</h3>
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
    </div>
  );
}

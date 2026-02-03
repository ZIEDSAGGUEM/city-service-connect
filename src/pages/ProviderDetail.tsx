import { useState } from 'react';
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
import { providers, reviews } from '@/lib/data';
import { Star, Shield, Clock, MapPin, Calendar, CheckCircle, MessageSquare, ArrowLeft, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

export default function ProviderDetail() {
  const { id } = useParams();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    description: '',
    date: '',
    time: '',
    budget: '',
  });

  const provider = providers.find(p => p.id === id);
  const providerReviews = reviews.filter(r => r.providerId === id);

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

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Request sent successfully!', {
      description: `${provider.name} will respond to your request soon.`,
    });
    setIsRequestOpen(false);
    setRequestForm({ description: '', date: '', time: '', budget: '' });
  };

  const availabilityColors = {
    available: 'bg-success text-success-foreground',
    busy: 'bg-warning text-warning-foreground',
    unavailable: 'bg-muted text-muted-foreground',
  };

  const availabilityLabels = {
    available: 'Available Now',
    busy: 'Busy',
    unavailable: 'Unavailable',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenAI={() => setIsAIOpen(true)} />
      
      <main className="flex-1 bg-background">
        {/* Breadcrumb */}
        <div className="bg-secondary/50 border-b border-border">
          <div className="container py-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to services
            </Link>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Provider Header */}
              <div className="bg-card rounded-2xl shadow-soft p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src={provider.avatar} alt={provider.name} />
                    <AvatarFallback className="text-2xl">{provider.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h1 className="font-display text-2xl font-bold text-foreground">
                        {provider.name}
                      </h1>
                      {provider.verified && (
                        <Badge variant="secondary" className="gap-1">
                          <Shield className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                      <Badge className={availabilityColors[provider.availability]}>
                        {availabilityLabels[provider.availability]}
                      </Badge>
                    </div>
                    <p className="text-lg text-muted-foreground mb-3">{provider.category}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-medium text-foreground">{provider.rating}</span>
                        <span className="text-muted-foreground">({provider.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {provider.location}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Responds {provider.responseTime}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="about" className="bg-card rounded-2xl shadow-soft">
                <TabsList className="w-full justify-start border-b border-border rounded-none p-0 h-auto bg-transparent">
                  <TabsTrigger
                    value="about"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6"
                  >
                    About
                  </TabsTrigger>
                  <TabsTrigger
                    value="reviews"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6"
                  >
                    Reviews ({providerReviews.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-display font-semibold text-lg text-foreground mb-3">
                        About
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {provider.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-display font-semibold text-lg text-foreground mb-3">
                        Skills & Services
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {provider.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 bg-secondary/50 rounded-xl text-center">
                        <p className="text-2xl font-bold text-foreground">{provider.yearsExperience}</p>
                        <p className="text-sm text-muted-foreground">Years Experience</p>
                      </div>
                      <div className="p-4 bg-secondary/50 rounded-xl text-center">
                        <p className="text-2xl font-bold text-foreground">{provider.completedJobs}</p>
                        <p className="text-sm text-muted-foreground">Jobs Completed</p>
                      </div>
                      <div className="p-4 bg-secondary/50 rounded-xl text-center">
                        <p className="text-2xl font-bold text-foreground">{provider.rating}</p>
                        <p className="text-sm text-muted-foreground">Avg Rating</p>
                      </div>
                      <div className="p-4 bg-secondary/50 rounded-xl text-center">
                        <p className="text-2xl font-bold text-foreground">{provider.responseTime}</p>
                        <p className="text-sm text-muted-foreground">Response Time</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="p-6">
                  {providerReviews.length > 0 ? (
                    <div className="space-y-6">
                      {providerReviews.map((review) => (
                        <div key={review.id} className="pb-6 border-b border-border last:border-0">
                          <div className="flex items-start gap-4">
                            <img
                              src={review.clientAvatar}
                              alt={review.clientName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="font-medium text-foreground">{review.clientName}</p>
                                  <p className="text-sm text-muted-foreground">{review.serviceType}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{review.date}</p>
                              </div>
                              <div className="flex items-center gap-1 mb-2">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                                ))}
                              </div>
                              <p className="text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No reviews yet
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl shadow-soft p-6 space-y-6">
                {/* Pricing */}
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    ${provider.hourlyRate}
                    <span className="text-lg font-normal text-muted-foreground">/hr</span>
                  </p>
                  <p className="text-sm text-muted-foreground">Starting rate</p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3">
                  <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
                    <DialogTrigger asChild>
                      <Button variant="hero" className="w-full" size="lg">
                        <Calendar className="h-4 w-4 mr-2" />
                        Request Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Service from {provider.name}</DialogTitle>
                        <DialogDescription>
                          Describe your needs and preferred schedule. {provider.name} will respond shortly.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleRequestSubmit} className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="description">What do you need?</Label>
                          <Textarea
                            id="description"
                            placeholder="Describe your project or service needs..."
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
                          <Label htmlFor="budget">Budget (optional)</Label>
                          <Input
                            id="budget"
                            type="number"
                            placeholder="$"
                            value={requestForm.budget}
                            onChange={(e) => setRequestForm({ ...requestForm, budget: e.target.value })}
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Send Request
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline" className="w-full" size="lg">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>

                {/* Trust Badges */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span className="text-muted-foreground">Background checked</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="text-muted-foreground">Identity verified</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="h-5 w-5 text-accent" />
                    <span className="text-muted-foreground">Insured & licensed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}

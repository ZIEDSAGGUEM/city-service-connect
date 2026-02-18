import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProviderProfileForm } from '@/components/providers/ProviderProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { providersApi, serviceRequestsApi } from '@/lib/api';
import type { Provider, ServiceRequest, RequestStatus } from '@/lib/types';
import { Calendar, DollarSign, Star, AlertCircle, Loader2, Settings, User, Briefcase, Shield, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function ProviderDashboard() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch provider profile
  const fetchProvider = async () => {
    setIsLoading(true);
    try {
      const data = await providersApi.getMyProfile();
      setProvider(data);
    } catch (error: any) {
      // Provider profile doesn't exist yet
      console.log('No provider profile found');
      setProvider(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch incoming service requests
  const fetchRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const data = await serviceRequestsApi.getProviderRequests();
      setRequests(data);
    } catch (error: any) {
      console.error('Failed to fetch requests:', error);
      toast.error('Failed to load service requests');
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchProvider();
  }, []);

  useEffect(() => {
    if (provider) {
      fetchRequests();
    }
  }, [provider]);

  // Handle accept request
  const handleAcceptRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      await serviceRequestsApi.accept(requestId);
      toast.success('Request accepted successfully!');
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      console.error('Failed to accept request:', error);
      toast.error('Failed to accept request', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Handle decline request
  const handleDeclineRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to decline this request?')) return;
    
    setActionLoading(requestId);
    try {
      await serviceRequestsApi.decline(requestId);
      toast.success('Request declined');
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      console.error('Failed to decline request:', error);
      toast.error('Failed to decline request', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Handle start request
  const handleStartRequest = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      await serviceRequestsApi.start(requestId);
      toast.success('Job started successfully!');
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      console.error('Failed to start job:', error);
      toast.error('Failed to start job', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Handle complete request
  const handleCompleteRequest = async (requestId: string) => {
    if (!confirm('Mark this job as completed? The client will be able to leave a review.')) return;
    
    setActionLoading(requestId);
    try {
      await serviceRequestsApi.complete(requestId);
      toast.success('Job completed! 🎉');
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      console.error('Failed to complete job:', error);
      toast.error('Failed to complete job', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleProfileSuccess = () => {
    setShowEditForm(false);
    fetchProvider();
    toast.success('Profile saved successfully!');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header onOpenAI={() => setIsAIOpen(true)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-lg text-muted-foreground">Loading dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // No profile yet - show create form
  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
        <Header onOpenAI={() => setIsAIOpen(true)} />
        <main className="flex-1 container py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                Create Your Provider Profile
              </h1>
              <p className="text-muted-foreground">
                Complete your profile to start receiving service requests from clients
              </p>
            </div>

            <div className="bg-card rounded-2xl shadow-soft p-8">
              <ProviderProfileForm onSuccess={handleProfileSuccess} />
            </div>
          </div>
        </main>
        <Footer />
        <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
      </div>
    );
  }

  // Has profile - show dashboard
  const stats = [
    { label: 'Completed Jobs', value: provider.completedJobs, icon: Briefcase, color: 'text-primary' },
    { label: 'Average Rating', value: provider.rating.toFixed(1), icon: Star, color: 'text-accent' },
    { label: 'Total Reviews', value: provider.reviewCount, icon: AlertCircle, color: 'text-success' },
    { label: 'Hourly Rate', value: `$${provider.hourlyRate}`, icon: DollarSign, color: 'text-warning' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <Header onOpenAI={() => setIsAIOpen(true)} />
      
      <main className="flex-1">
        {/* Header Section */}
        <div className="bg-secondary/50 border-b border-border">
          <div className="container py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <Briefcase className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-2">
                    {user?.name}
                    {provider.verified && <Shield className="h-6 w-6 text-primary" />}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {provider.category?.icon} {provider.category?.name} Provider
                  </p>
                  <Badge className="mt-2" variant={provider.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {provider.status}
                  </Badge>
                </div>
              </div>
              <Button onClick={() => setShowEditForm(!showEditForm)} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                {showEditForm ? 'Cancel Edit' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {showEditForm ? (
            // Edit Profile Form
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Edit Your Profile</h2>
              <div className="bg-card rounded-2xl shadow-soft p-8">
                <ProviderProfileForm provider={provider} onSuccess={handleProfileSuccess} />
              </div>
            </div>
          ) : (
            // Dashboard View
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </CardTitle>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Profile Information Tabs */}
              <Card>
                <Tabs defaultValue="overview" className="w-full">
                  <CardHeader>
                    <TabsList className="w-full justify-start">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="requests">Requests</TabsTrigger>
                      <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>
                  </CardHeader>

                  <CardContent>
                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                      {/* Profile Details */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">About You</h3>
                        <p className="text-muted-foreground">
                          {provider.bio || 'No bio added yet'}
                        </p>
                      </div>

                      {/* Skills */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {provider.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-muted-foreground">Years of Experience</p>
                          <p className="text-lg font-semibold">{provider.yearsExperience} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Response Time</p>
                          <p className="text-lg font-semibold">{provider.responseTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Service Radius</p>
                          <p className="text-lg font-semibold">{provider.serviceRadius} km</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Availability</p>
                          <Badge className="text-sm">
                            {provider.availability}
                          </Badge>
                        </div>
                      </div>

                      {/* Certifications */}
                      {provider.certifications.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Certifications</h3>
                          <ul className="space-y-2">
                            {provider.certifications.map((cert, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-success" />
                                <span>{cert}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Portfolio */}
                      {provider.portfolio.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Portfolio</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {provider.portfolio.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Portfolio ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    {/* Requests Tab */}
                    <TabsContent value="requests" className="space-y-4">
                      {isLoadingRequests ? (
                        <div className="flex justify-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                      ) : requests.length === 0 ? (
                        <div className="text-center py-12">
                          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No Service Requests</h3>
                          <p className="text-muted-foreground">
                            You haven't received any service requests yet.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {requests.map((request) => {
                            const statusConfig: Record<RequestStatus, { label: string; color: string; icon: any }> = {
                              PENDING: { label: 'Pending', color: 'bg-warning/20 text-warning', icon: Clock },
                              ACCEPTED: { label: 'Accepted', color: 'bg-success/20 text-success', icon: CheckCircle },
                              IN_PROGRESS: { label: 'In Progress', color: 'bg-primary/20 text-primary', icon: Loader2 },
                              COMPLETED: { label: 'Completed', color: 'bg-success/20 text-success', icon: CheckCircle },
                              CANCELLED: { label: 'Cancelled', color: 'bg-destructive/20 text-destructive', icon: AlertCircle },
                            };
                            
                            const config = statusConfig[request.status];
                            const StatusIcon = config.icon;

                            return (
                              <Card key={request.id}>
                                <CardContent className="p-6">
                                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                                        <Calendar className="h-6 w-6 text-muted-foreground" />
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h3 className="font-semibold text-foreground">{request.title}</h3>
                                          <Badge className={config.color}>
                                            <StatusIcon className="h-3 w-3 mr-1" />
                                            {config.label}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                          From: {request.client?.name || 'Unknown Client'}
                                        </p>
                                        <p className="text-sm text-muted-foreground mb-2">
                                          {request.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                          {request.preferredDate && (
                                            <span className="flex items-center gap-1">
                                              <Calendar className="h-4 w-4" />
                                              {new Date(request.preferredDate).toLocaleDateString()}
                                            </span>
                                          )}
                                          {request.preferredTime && (
                                            <span className="flex items-center gap-1">
                                              <Clock className="h-4 w-4" />
                                              {request.preferredTime}
                                            </span>
                                          )}
                                          {request.estimatedBudget && (
                                            <span className="flex items-center gap-1">
                                              <DollarSign className="h-4 w-4" />
                                              ${request.estimatedBudget}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">
                                          Received {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {request.status === 'PENDING' && (
                                        <>
                                          <Button 
                                            variant="hero" 
                                            size="sm"
                                            onClick={() => handleAcceptRequest(request.id)}
                                            disabled={actionLoading === request.id}
                                          >
                                            {actionLoading === request.id ? (
                                              <>
                                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                Accepting...
                                              </>
                                            ) : (
                                              'Accept'
                                            )}
                                          </Button>
                                          <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => handleDeclineRequest(request.id)}
                                            disabled={actionLoading === request.id}
                                          >
                                            Decline
                                          </Button>
                                        </>
                                      )}
                                      {request.status === 'ACCEPTED' && (
                                        <Button 
                                          variant="hero" 
                                          size="sm"
                                          onClick={() => handleStartRequest(request.id)}
                                          disabled={actionLoading === request.id}
                                        >
                                          {actionLoading === request.id ? (
                                            <>
                                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                              Starting...
                                            </>
                                          ) : (
                                            'Start Job'
                                          )}
                                        </Button>
                                      )}
                                      {request.status === 'IN_PROGRESS' && (
                                        <Button 
                                          variant="hero" 
                                          size="sm"
                                          onClick={() => handleCompleteRequest(request.id)}
                                          disabled={actionLoading === request.id}
                                        >
                                          {actionLoading === request.id ? (
                                            <>
                                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                              Completing...
                                            </>
                                          ) : (
                                            'Mark Complete'
                                          )}
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </TabsContent>

                    {/* Analytics Tab */}
                    <TabsContent value="analytics">
                      <div className="text-center py-12">
                        <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Analytics & Insights</h3>
                        <p className="text-muted-foreground">
                          Analytics dashboard coming soon!
                        </p>
                      </div>
                    </TabsContent>
                  </CardContent>
                </Tabs>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}

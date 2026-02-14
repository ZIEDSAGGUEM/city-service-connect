import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, DollarSign, Star, MessageSquare, Plus, CheckCircle, AlertCircle, Loader2, X } from 'lucide-react';
import { serviceRequestsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { ServiceRequest, RequestStatus } from '@/lib/types';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only fetch requests if user is loaded and authenticated
    if (!isAuthLoading && user) {
      fetchRequests();
    } else if (!isAuthLoading && !user) {
      setIsLoading(false);
    }
  }, [user, isAuthLoading]);

  const fetchRequests = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const data = await serviceRequestsApi.getMyRequests();
      setRequests(data);
    } catch (error: any) {
      console.error('Failed to fetch requests:', error);
      toast.error('Failed to load service requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this request?')) return;

    try {
      await serviceRequestsApi.cancel(id);
      toast.success('Request cancelled successfully');
      fetchRequests(); // Refresh the list
    } catch (error: any) {
      console.error('Failed to cancel request:', error);
      toast.error('Failed to cancel request', {
        description: error.response?.data?.message || 'Please try again',
      });
    }
  };

  const statusConfig: Record<RequestStatus, { label: string; color: string; icon: any }> = {
    PENDING: { label: 'Pending', color: 'bg-warning/20 text-warning', icon: Clock },
    ACCEPTED: { label: 'Accepted', color: 'bg-success/20 text-success', icon: CheckCircle },
    IN_PROGRESS: { label: 'In Progress', color: 'bg-primary/20 text-primary', icon: Loader2 },
    COMPLETED: { label: 'Completed', color: 'bg-success/20 text-success', icon: CheckCircle },
    CANCELLED: { label: 'Cancelled', color: 'bg-destructive/20 text-destructive', icon: AlertCircle },
  };

  const activeStatuses: RequestStatus[] = ['PENDING', 'ACCEPTED', 'IN_PROGRESS'];
  const activeRequests = requests.filter(r => activeStatuses.includes(r.status));
  const completedRequests = requests.filter(r => r.status === 'COMPLETED');
  const totalSpent = completedRequests.reduce((sum, r) => sum + (r.finalPrice || r.estimatedBudget || 0), 0);

  const stats = [
    { label: 'Active Requests', value: activeRequests.length, icon: Clock },
    { label: 'Completed Jobs', value: completedRequests.length, icon: CheckCircle },
    { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, icon: DollarSign },
    { label: 'Favorites', value: 0, icon: Star },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenAI={() => setIsAIOpen(true)} />
      
      <main className="flex-1 bg-background">
        {/* Header */}
        <div className="bg-secondary/50 border-b border-border">
          <div className="container py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground mb-1">
                  Welcome back, {user?.name.split(' ')[0]}!
                </h1>
                <p className="text-muted-foreground">
                  Manage your service requests and bookings
                </p>
              </div>
              <Button variant="hero" asChild>
                <Link to="/services">
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="container py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={stat.label} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <stat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">Active Requests</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : activeRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Active Requests</h3>
                    <p className="text-muted-foreground mb-4">
                      You don't have any active service requests at the moment
                    </p>
                    <Button variant="hero" asChild>
                      <Link to="/services">
                        <Plus className="h-4 w-4 mr-2" />
                        Browse Services
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                activeRequests.map((request, index) => {
                  const config = statusConfig[request.status];
                  const StatusIcon = config.icon;
                  return (
                    <Card key={request.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                              <Calendar className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{request.title}</h3>
                                <Badge className={config.color}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {config.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {request.category?.name} • {request.provider?.user?.name}
                              </p>
                              <p className="text-sm text-muted-foreground mb-2">
                                {request.description.length > 100 
                                  ? `${request.description.substring(0, 100)}...` 
                                  : request.description}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(request.preferredDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {request.preferredTime}
                                </span>
                                {request.estimatedBudget && (
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    ${request.estimatedBudget}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Requested {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/providers/${request.providerId}`}>View Provider</Link>
                            </Button>
                            {request.status === 'PENDING' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleCancelRequest(request.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                  </Card>
                );
                })
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : completedRequests.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Completed Jobs</h3>
                    <p className="text-muted-foreground mb-4">
                      Your completed service requests will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                completedRequests.map((request, index) => {
                  const config = statusConfig[request.status];
                  return (
                    <Card key={request.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                              <CheckCircle className="h-6 w-6 text-success" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{request.title}</h3>
                                <Badge className={config.color}>{config.label}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {request.category?.name} • {request.provider?.user?.name}
                              </p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Completed {formatDistanceToNow(new Date(request.updatedAt), { addSuffix: true })}</span>
                                {request.finalPrice && <span>${request.finalPrice}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Star className="h-4 w-4 mr-1" />
                              Leave Review
                            </Button>
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/providers/${request.providerId}`}>View Provider</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <Card>
                <CardContent className="p-12 text-center">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Favorites Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start adding your favorite providers to easily book them again
                  </p>
                  <Button variant="hero" asChild>
                    <Link to="/services">
                      <Plus className="h-4 w-4 mr-2" />
                      Browse Providers
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}

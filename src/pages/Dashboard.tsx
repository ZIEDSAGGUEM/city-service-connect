import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { currentUser, sampleRequests, providers } from '@/lib/data';
import { Calendar, Clock, DollarSign, Star, MessageSquare, Plus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [isAIOpen, setIsAIOpen] = useState(false);

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-warning/20 text-warning', icon: Clock },
    accepted: { label: 'Accepted', color: 'bg-success/20 text-success', icon: CheckCircle },
    in_progress: { label: 'In Progress', color: 'bg-primary/20 text-primary', icon: Loader2 },
    completed: { label: 'Completed', color: 'bg-success/20 text-success', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'bg-destructive/20 text-destructive', icon: AlertCircle },
  };

  const stats = [
    { label: 'Active Requests', value: sampleRequests.filter(r => ['pending', 'accepted', 'in_progress'].includes(r.status)).length, icon: Clock },
    { label: 'Completed Jobs', value: sampleRequests.filter(r => r.status === 'completed').length, icon: CheckCircle },
    { label: 'Total Spent', value: '$' + sampleRequests.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.budget, 0), icon: DollarSign },
    { label: 'Favorites', value: 3, icon: Star },
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
                  Welcome back, {currentUser.name.split(' ')[0]}!
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
              {sampleRequests.filter(r => ['pending', 'accepted', 'in_progress'].includes(r.status)).map((request, index) => {
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
                              <h3 className="font-semibold text-foreground">{request.description}</h3>
                              <Badge className={config.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {request.category} • {request.providerName}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {request.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {request.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                ${request.budget}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/providers/${request.providerId}`}>View Provider</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {sampleRequests.filter(r => r.status === 'completed').map((request, index) => {
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
                              <h3 className="font-semibold text-foreground">{request.description}</h3>
                              <Badge className={config.color}>{config.label}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {request.category} • {request.providerName}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Completed on {request.date}</span>
                              <span>${request.budget}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Star className="h-4 w-4 mr-1" />
                            Leave Review
                          </Button>
                          <Button variant="ghost" size="sm">Book Again</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.slice(0, 3).map((provider, index) => (
                  <Card key={provider.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={provider.avatar}
                          alt={provider.name}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-foreground">{provider.name}</h3>
                          <p className="text-sm text-muted-foreground">{provider.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-medium">{provider.rating}</span>
                        <span className="text-sm text-muted-foreground">({provider.reviewCount} reviews)</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="default" size="sm" className="flex-1" asChild>
                          <Link to={`/providers/${provider.id}`}>View Profile</Link>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">Book Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { providerUser } from '@/lib/data';
import { Calendar, Clock, DollarSign, Star, MessageSquare, CheckCircle, AlertCircle, TrendingUp, Users, Briefcase } from 'lucide-react';

const incomingRequests = [
  { id: '1', clientName: 'John Smith', clientAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100', service: 'Deep Cleaning', date: '2024-01-25', time: '10:00 AM', budget: 150, status: 'pending' },
  { id: '2', clientName: 'Emily Davis', clientAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100', service: 'Move-out Cleaning', date: '2024-01-26', time: '2:00 PM', budget: 200, status: 'pending' },
];

const upcomingJobs = [
  { id: '3', clientName: 'Michael Chen', clientAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=100', service: 'Regular Cleaning', date: '2024-01-24', time: '9:00 AM', budget: 100, status: 'accepted' },
];

const completedJobs = [
  { id: '4', clientName: 'Sarah Wilson', clientAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100', service: 'Deep Cleaning', date: '2024-01-20', budget: 180, rating: 5 },
  { id: '5', clientName: 'Tom Anderson', clientAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', service: 'Move-in Cleaning', date: '2024-01-18', budget: 220, rating: 5 },
];

export default function ProviderDashboard() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  const stats = [
    { label: 'New Requests', value: incomingRequests.length, icon: AlertCircle, color: 'text-warning' },
    { label: 'Upcoming Jobs', value: upcomingJobs.length, icon: Calendar, color: 'text-primary' },
    { label: 'This Month', value: '$1,240', icon: DollarSign, color: 'text-success' },
    { label: 'Avg Rating', value: '4.9', icon: Star, color: 'text-accent' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenAI={() => setIsAIOpen(true)} userRole="provider" />
      
      <main className="flex-1 bg-background">
        {/* Header */}
        <div className="bg-secondary/50 border-b border-border">
          <div className="container py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={providerUser.avatar}
                  alt={providerUser.name}
                  className="h-16 w-16 rounded-full object-cover border-4 border-primary/20"
                />
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">
                    {providerUser.name}
                  </h1>
                  <p className="text-muted-foreground">Provider Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Availability:</span>
                  <Switch
                    checked={isAvailable}
                    onCheckedChange={setIsAvailable}
                  />
                  <Badge className={isAvailable ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
                    {isAvailable ? 'Available' : 'Unavailable'}
                  </Badge>
                </div>
              </div>
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
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-secondary`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Incoming Requests */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-warning" />
                    Incoming Requests
                  </CardTitle>
                  <CardDescription>New service requests from clients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {incomingRequests.map((request) => (
                    <div key={request.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-secondary/50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <img
                          src={request.clientAvatar}
                          alt={request.clientName}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-foreground">{request.clientName}</h4>
                          <p className="text-sm text-muted-foreground">{request.service}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span>{request.date}</span>
                            <span>{request.time}</span>
                            <span className="font-medium text-foreground">${request.budget}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="success" size="sm">Accept</Button>
                        <Button variant="outline" size="sm">Decline</Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {incomingRequests.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No pending requests</p>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Jobs
                  </CardTitle>
                  <CardDescription>Your scheduled appointments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingJobs.map((job) => (
                    <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="flex items-center gap-4">
                        <img
                          src={job.clientAvatar}
                          alt={job.clientName}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-foreground">{job.clientName}</h4>
                          <p className="text-sm text-muted-foreground">{job.service}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {job.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {job.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-success/20 text-success">Confirmed</Badge>
                        <span className="font-semibold text-foreground">${job.budget}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Response Rate</span>
                    <span className="font-semibold text-foreground">98%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Completion Rate</span>
                    <span className="font-semibold text-foreground">100%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Repeat Clients</span>
                    <span className="font-semibold text-foreground">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="font-semibold text-success">+12 jobs</span>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-accent" />
                    Recent Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {completedJobs.slice(0, 2).map((job) => (
                    <div key={job.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <img
                          src={job.clientAvatar}
                          alt={job.clientName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">{job.clientName}</p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: job.rating }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{job.service} • {job.date}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}

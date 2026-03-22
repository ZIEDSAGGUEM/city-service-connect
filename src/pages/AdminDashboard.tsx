import { useState, useEffect, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users, Briefcase, DollarSign, TrendingUp, Search, Shield, ShieldOff,
  Trash2, Loader2, Plus, Pencil, Star, CheckCircle, XCircle, BarChart3, Flag,
} from 'lucide-react';
import { toast } from 'sonner';
import { adminApi, categoriesApi, disputesApi } from '@/lib/api';
import type { AdminDashboardStats, AdminUser, AdminProvider, Category, Dispute } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [providers, setProviders] = useState<AdminProvider[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [providerSearch, setProviderSearch] = useState('');
  const [providerStatusFilter, setProviderStatusFilter] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Category form
  const [catDialogOpen, setCatDialogOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState({ name: '', icon: '', description: '' });

  // Disputes
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [disputeStatusFilter, setDisputeStatusFilter] = useState('');
  const [resolveDialog, setResolveDialog] = useState<{ open: boolean; dispute: Dispute | null }>({ open: false, dispute: null });
  const [resolveForm, setResolveForm] = useState({ resolution: '', adminNote: '' });

  const fetchDashboard = useCallback(async () => {
    try {
      const data = await adminApi.getDashboard();
      setStats(data);
    } catch { /* */ }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await adminApi.getUsers(userSearch || undefined, userRoleFilter || undefined);
      setUsers(data);
    } catch { /* */ }
  }, [userSearch, userRoleFilter]);

  const fetchProviders = useCallback(async () => {
    try {
      const data = await adminApi.getProviders(providerSearch || undefined, providerStatusFilter || undefined);
      setProviders(data);
    } catch { /* */ }
  }, [providerSearch, providerStatusFilter]);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch { /* */ }
  }, []);

  const fetchDisputes = useCallback(async () => {
    try {
      const data = await disputesApi.adminGetAll(disputeStatusFilter || undefined);
      setDisputes(data);
    } catch { /* */ }
  }, [disputeStatusFilter]);

  useEffect(() => {
    Promise.all([fetchDashboard(), fetchUsers(), fetchProviders(), fetchCategories(), fetchDisputes()])
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchUsers(); }, [userSearch, userRoleFilter]);
  useEffect(() => { fetchProviders(); }, [providerSearch, providerStatusFilter]);
  useEffect(() => { fetchDisputes(); }, [disputeStatusFilter]);

  const handleToggleUserVerification = async (id: string) => {
    setActionLoading(id);
    try {
      await adminApi.toggleUserVerification(id);
      toast.success('User verification toggled');
      fetchUsers();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed');
    } finally { setActionLoading(null); }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete this user permanently?')) return;
    setActionLoading(id);
    try {
      await adminApi.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
      fetchDashboard();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed');
    } finally { setActionLoading(null); }
  };

  const handleToggleProviderVerification = async (id: string) => {
    setActionLoading(id);
    try {
      await adminApi.toggleProviderVerification(id);
      toast.success('Provider verification toggled');
      fetchProviders();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed');
    } finally { setActionLoading(null); }
  };

  const handleProviderStatus = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await adminApi.updateProviderStatus(id, status);
      toast.success(`Provider ${status.toLowerCase()}`);
      fetchProviders();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed');
    } finally { setActionLoading(null); }
  };

  const openCatDialog = (cat?: Category) => {
    if (cat) {
      setEditingCat(cat);
      setCatForm({ name: cat.name, icon: cat.icon, description: cat.description });
    } else {
      setEditingCat(null);
      setCatForm({ name: '', icon: '', description: '' });
    }
    setCatDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!catForm.name || !catForm.icon || !catForm.description) {
      toast.error('All fields required');
      return;
    }
    try {
      if (editingCat) {
        await adminApi.updateCategory(editingCat.id, catForm);
        toast.success('Category updated');
      } else {
        await adminApi.createCategory(catForm);
        toast.success('Category created');
      }
      setCatDialogOpen(false);
      fetchCategories();
      fetchDashboard();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Only works if no providers are assigned.')) return;
    try {
      await adminApi.deleteCategory(id);
      toast.success('Category deleted');
      fetchCategories();
      fetchDashboard();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed');
    }
  };

  const handleResolveDispute = async () => {
    if (!resolveDialog.dispute || !resolveForm.resolution) return;
    setActionLoading(resolveDialog.dispute.id);
    try {
      await disputesApi.adminResolve(resolveDialog.dispute.id, {
        resolution: resolveForm.resolution,
        adminNote: resolveForm.adminNote || undefined,
      });
      toast.success('Dispute resolved');
      setResolveDialog({ open: false, dispute: null });
      fetchDisputes();
      fetchDashboard();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Failed to resolve');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container space-y-8 py-10 md:py-12">
        <div className="space-y-2">
          <p className="section-label">Administration</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Admin dashboard
          </h1>
          <p className="max-w-xl text-muted-foreground">Platform overview, users, providers, and disputes.</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users },
              { label: 'Providers', value: stats.totalProviders, icon: Briefcase },
              { label: 'Requests', value: stats.totalRequests, icon: BarChart3 },
              { label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign },
              { label: 'New (30d)', value: stats.newUsersThisMonth, icon: TrendingUp },
            ].map((s) => (
              <Card key={s.label} className="border-border/70 shadow-soft transition-colors hover:border-primary/15">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <s.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                      <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="providers">Providers</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {stats && (
              <>
                {/* Request Status */}
                <div className="grid grid-cols-5 gap-3">
                  {Object.entries(stats.statusCounts).map(([status, count]) => (
                    <div key={status} className="rounded-lg p-3 text-center bg-muted">
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-xs font-medium text-muted-foreground">{status.replace('_', ' ')}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Signups & Requests Chart */}
                  <Card>
                    <CardHeader><CardTitle className="text-base">Signups & Requests (6 Months)</CardTitle></CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={stats.monthlyChart}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" fontSize={12} />
                          <YAxis fontSize={12} allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="signups" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Signups" />
                          <Bar dataKey="requests" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Requests" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Revenue Chart */}
                  <Card>
                    <CardHeader><CardTitle className="text-base">Revenue (6 Months)</CardTitle></CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={stats.monthlyChart}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" fontSize={12} />
                          <YAxis fontSize={12} tickFormatter={(v) => `$${v}`} />
                          <Tooltip formatter={(value: number) => [`$${value}`, 'Revenue']} />
                          <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Categories */}
                <Card>
                  <CardHeader><CardTitle className="text-base">Top Categories</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                      {stats.topCategories.map((cat) => (
                        <div key={cat.name} className="text-center p-3 rounded-lg bg-muted">
                          <span className="text-2xl">{cat.icon}</span>
                          <p className="text-sm font-medium mt-1">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{cat.providerCount} providers</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
              <Select value={userRoleFilter || 'all'} onValueChange={(v) => setUserRoleFilter(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-40"><SelectValue placeholder="All Roles" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="CLIENT">Client</SelectItem>
                  <SelectItem value="PROVIDER">Provider</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-muted-foreground">
                        <th className="p-4">User</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Verified</th>
                        <th className="p-4">Joined</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={u.avatar || undefined} />
                                <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{u.name}</p>
                                <p className="text-xs text-muted-foreground">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>{u.role}</Badge>
                          </td>
                          <td className="p-4">
                            {u.verified ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            {u.role !== 'ADMIN' && (
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost" size="sm"
                                  onClick={() => handleToggleUserVerification(u.id)}
                                  disabled={actionLoading === u.id}
                                >
                                  {u.verified ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="ghost" size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteUser(u.id)}
                                  disabled={actionLoading === u.id}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No users found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Providers Tab */}
          <TabsContent value="providers" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search providers..."
                  className="pl-10"
                  value={providerSearch}
                  onChange={(e) => setProviderSearch(e.target.value)}
                />
              </div>
              <Select value={providerStatusFilter || 'all'} onValueChange={(v) => setProviderStatusFilter(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-muted-foreground">
                        <th className="p-4">Provider</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Rating</th>
                        <th className="p-4">Jobs</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Verified</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {providers.map((p) => (
                        <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={p.user.avatar || undefined} />
                                <AvatarFallback>{p.user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{p.user.name}</p>
                                <p className="text-xs text-muted-foreground">{p.user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm">{p.category.icon} {p.category.name}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              {p.rating.toFixed(1)}
                            </div>
                          </td>
                          <td className="p-4 text-sm">{p.completedJobs}</td>
                          <td className="p-4">
                            <Badge variant={p.status === 'ACTIVE' ? 'default' : p.status === 'SUSPENDED' ? 'destructive' : 'secondary'}>
                              {p.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            {p.verified ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-400" />
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost" size="sm"
                                onClick={() => handleToggleProviderVerification(p.id)}
                                disabled={actionLoading === p.id}
                              >
                                {p.verified ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                              </Button>
                              {p.status === 'ACTIVE' ? (
                                <Button
                                  variant="ghost" size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleProviderStatus(p.id, 'SUSPENDED')}
                                  disabled={actionLoading === p.id}
                                >
                                  Suspend
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost" size="sm"
                                  className="text-green-600 hover:text-green-600"
                                  onClick={() => handleProviderStatus(p.id, 'ACTIVE')}
                                  disabled={actionLoading === p.id}
                                >
                                  Activate
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {providers.length === 0 && (
                        <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No providers found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">{categories.length} categories</p>
              <Dialog open={catDialogOpen} onOpenChange={setCatDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => openCatDialog()} variant="hero" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCat ? 'Edit Category' : 'New Category'}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <Label>Icon (emoji)</Label>
                        <Input
                          value={catForm.icon}
                          onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                          placeholder="🔧"
                          maxLength={4}
                        />
                      </div>
                      <div className="col-span-3">
                        <Label>Name</Label>
                        <Input
                          value={catForm.name}
                          onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                          placeholder="Category name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={catForm.description}
                        onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                        placeholder="Brief description"
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleSaveCategory} className="w-full" variant="hero">
                      {editingCat ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <Card key={cat.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{cat.icon}</span>
                        <div>
                          <p className="font-semibold">{cat.name}</p>
                          <p className="text-xs text-muted-foreground">{cat.providerCount} providers</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openCatDialog(cat)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost" size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteCategory(cat.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{cat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          {/* Disputes Tab */}
          <TabsContent value="disputes" className="space-y-4">
            <div className="flex gap-3 items-center">
              <p className="text-muted-foreground flex-1">{disputes.length} disputes</p>
              <Select value={disputeStatusFilter || 'all'} onValueChange={(v) => setDisputeStatusFilter(v === 'all' ? '' : v)}>
                <SelectTrigger className="w-44"><SelectValue placeholder="All Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {disputes.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No disputes found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {disputes.map((d) => (
                  <Card key={d.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{d.request?.title}</h3>
                            <Badge
                              className={
                                d.status === 'OPEN'
                                  ? 'bg-warning/20 text-warning'
                                  : d.status === 'UNDER_REVIEW'
                                    ? 'bg-primary/20 text-primary'
                                    : 'bg-success/20 text-success'
                              }
                            >
                              {d.status.replace('_', ' ')}
                            </Badge>
                            {d.resolution && (
                              <Badge variant="secondary">{d.resolution.replace('_', ' ')}</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Client: {d.request?.client?.name || d.raisedBy?.name}</span>
                            <span>Provider: {d.request?.provider?.user?.name}</span>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm"><strong>Reason:</strong> {d.reason}</p>
                          </div>
                          {d.providerResponse && (
                            <div className="mt-1">
                              <p className="text-sm"><strong>Provider Response:</strong> {d.providerResponse}</p>
                            </div>
                          )}
                          {d.adminNote && (
                            <div className="mt-1 p-2 bg-muted rounded">
                              <p className="text-sm"><strong>Admin Note:</strong> {d.adminNote}</p>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Opened {new Date(d.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {d.status !== 'RESOLVED' && (
                          <Button
                            variant="hero"
                            size="sm"
                            onClick={() => {
                              setResolveDialog({ open: true, dispute: d });
                              setResolveForm({ resolution: '', adminNote: '' });
                            }}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Resolve Dispute Dialog */}
        <Dialog open={resolveDialog.open} onOpenChange={(open) => !open && setResolveDialog({ open: false, dispute: null })}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Resolve Dispute</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Resolution</Label>
                <Select value={resolveForm.resolution} onValueChange={(v) => setResolveForm({ ...resolveForm, resolution: v })}>
                  <SelectTrigger><SelectValue placeholder="Select resolution..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENT_FAVORED">Favor Client</SelectItem>
                    <SelectItem value="PROVIDER_FAVORED">Favor Provider</SelectItem>
                    <SelectItem value="COMPROMISE">Compromise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Admin Note (optional)</Label>
                <Textarea
                  placeholder="Explain the resolution decision..."
                  value={resolveForm.adminNote}
                  onChange={(e) => setResolveForm({ ...resolveForm, adminNote: e.target.value })}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setResolveDialog({ open: false, dispute: null })}>
                Cancel
              </Button>
              <Button
                variant="hero"
                onClick={handleResolveDispute}
                disabled={!resolveForm.resolution || actionLoading === resolveDialog.dispute?.id}
              >
                {actionLoading === resolveDialog.dispute?.id ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Resolving...</>
                ) : (
                  'Resolve Dispute'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}


import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Bell, Mail, MessageSquare, Star, Calendar, Shield, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Settings() {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [bookingNotifications, setBookingNotifications] = useState(true);
  const [reviewNotifications, setReviewNotifications] = useState(true);

  const [profileVisibility, setProfileVisibility] = useState(true);
  const [showRatings, setShowRatings] = useState(true);
  const [showAvailability, setShowAvailability] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await authApi.getSettings();
      setEmailNotifications(settings.emailNotifications ?? true);
      setPushNotifications(settings.pushNotifications ?? true);
      setMessageNotifications(settings.messageNotifications ?? true);
      setBookingNotifications(settings.bookingNotifications ?? true);
      setReviewNotifications(settings.reviewNotifications ?? true);
      setProfileVisibility(settings.profileVisibility ?? true);
      setShowRatings(settings.showRatings ?? true);
      setShowAvailability(settings.showAvailability ?? true);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      await authApi.updateSettings({
        emailNotifications,
        pushNotifications,
        messageNotifications,
        bookingNotifications,
        reviewNotifications,
      });
      toast.success('Settings saved', {
        description: 'Your notification preferences have been updated.',
      });
    } catch (error: any) {
      toast.error('Failed to save settings', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePrivacy = async (key: string, value: boolean) => {
    try {
      await authApi.updateSettings({ [key]: value });
    } catch (error) {
      console.error('Failed to save privacy setting:', error);
      toast.error('Failed to save setting');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password');
      return;
    }
    setIsDeleting(true);
    try {
      await authApi.deleteAccount(deletePassword);
      toast.success('Account deleted');
      await logout();
    } catch (error: any) {
      toast.error('Failed to delete account', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setIsDeleting(false);
      setDeletePassword('');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container flex max-w-4xl justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl py-10 md:py-12">
        <div className="mb-10 space-y-2">
          <p className="section-label">Preferences</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Settings
          </h1>
          <p className="max-w-lg text-muted-foreground">
            Notifications, privacy, and account options.
          </p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Manage how you receive email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Email notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">New messages</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you receive a new message
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={messageNotifications}
                    onCheckedChange={setMessageNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Booking updates</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about booking status changes
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={bookingNotifications}
                    onCheckedChange={setBookingNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Reviews and ratings</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified when you receive a review
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={reviewNotifications}
                    onCheckedChange={setReviewNotifications}
                  />
                </div>

                <Button onClick={handleSaveNotifications} className="mt-4" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Preferences'
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>Manage browser push notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Browser notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications in your browser
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control your privacy and data sharing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Profile visibility</p>
                      <p className="text-sm text-muted-foreground">
                        Show your profile to other users
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={profileVisibility}
                    onCheckedChange={(val) => {
                      setProfileVisibility(val);
                      handleSavePrivacy('profileVisibility', val);
                    }}
                  />
                </div>

                {user?.role === 'PROVIDER' && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Show ratings publicly</p>
                          <p className="text-sm text-muted-foreground">
                            Display your ratings and reviews on your profile
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={showRatings}
                        onCheckedChange={(val) => {
                          setShowRatings(val);
                          handleSavePrivacy('showRatings', val);
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Show availability</p>
                          <p className="text-sm text-muted-foreground">
                            Display your availability status to clients
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={showAvailability}
                        onCheckedChange={(val) => {
                          setShowAvailability(val);
                          handleSavePrivacy('showAvailability', val);
                        }}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <p className="text-sm text-muted-foreground capitalize">
                    {user?.role.toLowerCase()} Account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Account Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {user?.verified ? 'Verified' : 'Unverified'}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <p className="text-sm text-muted-foreground">
                    {user?.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible account actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-destructive/10 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Trash2 className="h-5 w-5 text-destructive mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-destructive">Delete Account</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Once you delete your account, there is no going back. Please be certain.
                        </p>
                      </div>
                    </div>
                  </div>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account
                          and remove all your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="space-y-2 py-2">
                        <Label htmlFor="delete-password">Enter your password to confirm</Label>
                        <Input
                          id="delete-password"
                          type="password"
                          placeholder="Your password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                        />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletePassword('')}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={isDeleting || !deletePassword}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            'Delete Account'
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

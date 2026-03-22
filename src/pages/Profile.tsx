import { useState, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Phone, MapPin, Calendar, Shield, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { uploadsApi, authApi } from '@/lib/api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [location, setLocation] = useState(user?.location ?? '');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', { description: 'Max size is 5MB' });
      return;
    }

    setIsUploadingAvatar(true);
    try {
      await uploadsApi.uploadAvatar(file);
      await refreshUser();
      toast.success('Avatar updated');
    } catch (error: any) {
      toast.error('Upload failed', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await authApi.updateProfile({ name, phone, location });
      await refreshUser();
      toast.success('Profile updated', {
        description: 'Your profile has been updated successfully.',
      });
      setIsEditing(false);
    } catch (error: any) {
      toast.error('Update failed', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setIsChangingPassword(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success('Password updated', {
        description: 'Your password has been changed successfully.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.error('Password change failed', {
        description: error.response?.data?.message || 'Please try again',
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) return;
    try {
      await authApi.resendVerification(user.email);
      toast.success('Verification email sent', {
        description: 'Please check your inbox.',
      });
    } catch (error: any) {
      toast.error('Failed to send verification email', {
        description: error.response?.data?.message || 'Please try again',
      });
    }
  };

  return (
    <Layout>
      <div className="container max-w-4xl py-10 md:py-12">
        <div className="mb-10 space-y-2">
          <p className="section-label">Account</p>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            My profile
          </h1>
          <p className="max-w-lg text-muted-foreground">
            Manage your account information and security.
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your profile photo</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {user?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                      <Loader2 className="h-6 w-6 text-white animate-spin" />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                  >
                    {isUploadingAvatar ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        Change photo
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WebP or GIF. Max size 5MB
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={user?.email}
                        disabled
                        className="pl-10 bg-muted"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder="Enter your location"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="role"
                        value={user?.role}
                        disabled
                        className="pl-10 bg-muted capitalize"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joined">Member Since</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="joined"
                        value={user?.createdAt ? format(new Date(user.createdAt), 'MMMM d, yyyy') : 'N/A'}
                        disabled
                        className="pl-10 bg-muted"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false);
                      setName(user?.name || '');
                      setPhone(user?.phone ?? '');
                      setLocation(user?.location ?? '');
                    }}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button
                  className="mt-4"
                  onClick={handleChangePassword}
                  disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Email Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle>Email Verification</CardTitle>
                <CardDescription>Your email verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{user?.email}</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.verified ? 'Verified' : 'Not verified'}
                      </p>
                    </div>
                  </div>
                  {user?.verified ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Shield className="h-5 w-5" />
                      <span className="text-sm font-medium">Verified</span>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={handleResendVerification}>
                      Verify Email
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}


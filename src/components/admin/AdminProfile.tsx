import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useAuth } from '../../lib/auth-context';
import api from '../../lib/api-client';
import { toast } from 'sonner';
import {
  Mail,
  Phone,
  Shield,
  CalendarClock,
  Globe,
  RefreshCw,
  Save,
} from 'lucide-react';

interface AdminProfileData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  isVerified?: boolean;
}

export const AdminProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  const [formState, setFormState] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadProfile(user.id);
    }
  }, [user?.id]);

  const loadProfile = async (adminId: string) => {
    setLoading(true);
    try {
      const data = await api.admin.getAdminProfile(adminId);
      setProfile(data);
      setFormState({
        name: data.name ?? '',
        email: data.email ?? '',
        phone: data.phone ?? '',
      });
    } catch (error) {
      console.error(error);
      toast.error('Unable to load admin profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formState, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const payload = {
        ...profile,
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
      };
      const updated = await api.admin.updateAdminProfile(profile.id, payload);
      setProfile(updated);
      updateUserProfile({ name: updated.name, email: updated.email });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user?.id) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-600">You must be signed in as an administrator to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 text-sm text-gray-600">
        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center text-sm text-gray-600">
            Unable to find admin profile information.
            <div className="mt-4">
              <Button variant="outline" onClick={() => loadProfile(user.id!)} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formattedCreatedAt = profile.createdAt ? new Date(profile.createdAt).toLocaleString() : '—';
  const formattedUpdatedAt = profile.updatedAt ? new Date(profile.updatedAt).toLocaleString() : '—';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-500 uppercase">Administrator</p>
          <h1 className="text-3xl font-semibold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your administrator identity and account preferences.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => loadProfile(user.id!)}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="gap-2" onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 border border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="h-20 w-20 text-xl">
                <AvatarFallback>{profile.name?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                <Badge variant="secondary" className="mt-1 capitalize">
                  {profile.role?.toLowerCase().replace('_', ' ') || 'admin'}
                </Badge>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{profile.phone || '—'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-gray-400" />
                <span>
                  {profile.role === 'SUPER_ADMIN' 
                    ? 'Super Admin (Verified)' 
                    : profile.isVerified 
                    ? 'Verified' 
                    : 'Verification Pending'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CalendarClock className="h-4 w-4 text-gray-400" />
                <span>Joined {formattedCreatedAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Full Name</label>
                <Input
                  value={formState.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <Input
                  type="email"
                  value={formState.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Phone</label>
                <Input
                  value={formState.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1 555 0100"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Role</label>
                <Input value={profile.role || 'ADMIN'} disabled />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <span>
                  Account Status: {profile.role === 'SUPER_ADMIN' 
                    ? 'Super Admin (Verified)' 
                    : profile.isVerified 
                    ? 'Verified' 
                    : 'Pending Verification'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-gray-400" />
                <span>Last Updated: {formattedUpdatedAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Security Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-purple-500 mt-1" />
              <p>Use a strong password and update it regularly to keep your account secure.</p>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="h-4 w-4 text-purple-500 mt-1" />
              <p>Review system activity logs frequently and sign out from unused devices.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>
              <span className="font-medium text-gray-700">Admin ID:</span> {profile.id}
            </p>
            <p>
              <span className="font-medium text-gray-700">Created:</span> {formattedCreatedAt}
            </p>
            <p>
              <span className="font-medium text-gray-700">Last Updated:</span> {formattedUpdatedAt}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


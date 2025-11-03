import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import { Settings, Save, RefreshCw } from 'lucide-react';

interface SystemSettings {
  systemName: string;
  supportEmail: string;
  maxAppointmentsPerDay: number;
  enableNotifications: boolean;
  enableEmergencyMode: boolean;
  maintenanceMode: boolean;
  appointmentReminderHours: number;
  sessionTimeoutMinutes: number;
}

export function AdminSettings() {
  const [settings, setSettings] = useState<SystemSettings>({
    systemName: 'Health Management System',
    supportEmail: 'support@healthsystem.com',
    maxAppointmentsPerDay: 50,
    enableNotifications: true,
    enableEmergencyMode: false,
    maintenanceMode: false,
    appointmentReminderHours: 24,
    sessionTimeoutMinutes: 60
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from the backend
      // For now, we'll use localStorage to persist settings
      const savedSettings = localStorage.getItem('adminSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // In a real implementation, this would save to the backend
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof SystemSettings, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetToDefaults = () => {
    setSettings({
      systemName: 'Health Management System',
      supportEmail: 'support@healthsystem.com',
      maxAppointmentsPerDay: 50,
      enableNotifications: true,
      enableEmergencyMode: false,
      maintenanceMode: false,
      appointmentReminderHours: 24,
      sessionTimeoutMinutes: 60
    });
    toast.info('Settings reset to defaults');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-gray-600">Configure system-wide settings and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="systemName">System Name</Label>
                <Input
                  id="systemName"
                  value={settings.systemName}
                  onChange={(e) => handleInputChange('systemName', e.target.value)}
                  placeholder="Enter system name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleInputChange('supportEmail', e.target.value)}
                  placeholder="support@example.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxAppointments">Max Appointments Per Day</Label>
                <Input
                  id="maxAppointments"
                  type="number"
                  min="1"
                  max="500"
                  value={settings.maxAppointmentsPerDay}
                  onChange={(e) => handleInputChange('maxAppointmentsPerDay', parseInt(e.target.value) || 50)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reminderHours">Appointment Reminder (Hours)</Label>
                <Input
                  id="reminderHours"
                  type="number"
                  min="1"
                  max="168"
                  value={settings.appointmentReminderHours}
                  onChange={(e) => handleInputChange('appointmentReminderHours', parseInt(e.target.value) || 24)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Features */}
        <Card>
          <CardHeader>
            <CardTitle>System Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Notifications</Label>
                <p className="text-sm text-gray-600">Send email and push notifications</p>
              </div>
              <Switch
                checked={settings.enableNotifications}
                onCheckedChange={(checked: boolean) => handleInputChange('enableNotifications', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Emergency Mode</Label>
                <p className="text-sm text-gray-600">Enable emergency appointment handling</p>
              </div>
              <Switch
                checked={settings.enableEmergencyMode}
                onCheckedChange={(checked: boolean) => handleInputChange('enableEmergencyMode', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-gray-600">Put system in maintenance mode</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked: boolean) => handleInputChange('maintenanceMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (Minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  max="480"
                  value={settings.sessionTimeoutMinutes}
                  onChange={(e) => handleInputChange('sessionTimeoutMinutes', parseInt(e.target.value) || 60)}
                />
                <p className="text-xs text-gray-500">Auto-logout after inactivity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Version:</span> 1.0.0
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> {new Date().toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Environment:</span> Development
              </div>
              <div>
                <span className="font-medium">Database:</span> Connected
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

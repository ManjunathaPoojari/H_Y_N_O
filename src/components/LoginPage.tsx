import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Activity, ArrowLeft } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  role: 'patient' | 'doctor' | 'hospital' | 'admin';
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password, role);
    if (success) {
      const dashboardPath = role === 'admin' ? '/admin-dashboard' :
                           role === 'doctor' ? '/doctor-dashboard' :
                           role === 'hospital' ? '/hospital-dashboard' :
                           '/patient/dashboard';
      onNavigate(dashboardPath);
    } else {
      toast.error('Login failed. Please check your credentials and try again.');
    }
  };

  const titles = {
    patient: 'Patient Login',
    doctor: 'Doctor Login',
    hospital: 'Hospital Login',
    admin: 'Admin Login'
  };

  const descriptions = {
    patient: 'Access your health records and appointments',
    doctor: 'Manage your patients and consultations',
    hospital: 'Manage doctors and hospital operations',
    admin: 'System administration and monitoring'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Button variant="ghost" onClick={() => onNavigate('/')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="text-2xl text-blue-600">HYNO</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{titles[role]}</CardTitle>
            <CardDescription>{descriptions[role]}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Login</Button>
            </form>

            {role === 'patient' && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => onNavigate('/register')}
                    className="text-blue-600 hover:underline"
                  >
                    Register
                  </button>
                </p>
              </div>
            )}

            {role !== 'admin' && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 text-center">
                  Demo credentials: Use any email and password
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {role === 'patient' && (
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Need different access?</p>
            <div className="flex gap-2 justify-center mt-2">
              <button
                onClick={() => onNavigate('/doctor-login')}
                className="text-blue-600 hover:underline"
              >
                Doctor
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigate('/hospital-login')}
                className="text-blue-600 hover:underline"
              >
                Hospital
              </button>
              <span>•</span>
              <button
                onClick={() => onNavigate('/admin-login')}
                className="text-blue-600 hover:underline"
              >
                Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

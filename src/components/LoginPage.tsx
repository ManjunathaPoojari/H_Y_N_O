import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Activity, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';

interface LoginPageProps {
  onNavigate: (path: string) => void;
  role: 'patient' | 'doctor' | 'hospital' | 'admin' | 'trainer';
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = 'Please enter your email address';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email address';
    if (!password.trim()) newErrors.password = 'Please enter your password to continue';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const user = await login(email, password, role);
      if (user) {
        const path =
          user.role === 'admin'
            ? '/admin-dashboard'
            : user.role === 'doctor'
            ? '/doctor-dashboard'
            : user.role === 'hospital'
            ? '/hospital-dashboard'
            : user.role === 'trainer'
            ? '/trainer-dashboard'
            : '/patient/dashboard';
        onNavigate(path);
      } else toast.error('Invalid credentials');
    } catch (err: any) {
      // Display the specific error message from backend (e.g., approval pending)
      const errorMessage = err?.message || 'Login failed. Try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-100 rounded-3xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-8 space-y-4">
          {/* Header */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="flex items-center justify-center gap-2 mb-4 hover:scale-105 transition-all duration-200 mx-auto"
            >
              <Activity className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl text-emerald-600 font-bold">HYNO</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Sign In</h1>
            <p className="text-gray-500 text-sm mt-2">Trusted Healthcare • 24/7 Support</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  errors.email && setErrors((s) => ({ ...s, email: undefined }));
                }}
                className={`h-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 ${
                  errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                }`}
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <button
                  type="button"
                  onClick={() => onNavigate('/forgot-password')}
                  className="text-xs text-emerald-600 hover:text-emerald-700 hover:scale-105 font-semibold transition-all duration-200"
                >
                  Forgot?
                </button>
              </div>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    errors.password && setErrors((s) => ({ ...s, password: undefined }));
                  }}
                  className={`h-12 pr-12 rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 ${
                    errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-emerald-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 hover:scale-105 text-black font-semibold transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Divider */}
            <div className="relative -mt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-400">or continue with</span>
              </div>
            </div>

            {/* Google Sign-in */}
            <Button
              type="button"
              onClick={() => toast.info('Google sign-in coming soon!')}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 hover:scale-105 text-black font-semibold transition-all duration-200 -mt-2"
            >
              <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
              Google
            </Button>

            {/* Register link */}
            {role === 'patient' && (
              <p className="text-center text-sm text-gray-500">
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/register')}
                  className="text-emerald-600 hover:text-emerald-700 hover:scale-105 font-semibold transition-all duration-200"
                >
                  Sign up
                </button>
              </p>
            )}
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400">
            By signing in, you agree to our{' '}
            <button
              type="button"
              onClick={() => onNavigate('/terms')}
              className="text-emerald-600 hover:text-emerald-700 hover:scale-105 transition-all duration-200"
            >
              Terms
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => onNavigate('/privacy')}
              className="text-emerald-600 hover:text-emerald-700 hover:scale-105 transition-all duration-200"
            >
              Privacy Policy
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

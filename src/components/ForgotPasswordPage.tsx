import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Activity, ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API_URL } from '../lib/config';

interface ForgotPasswordPageProps {
  onNavigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      if (response.status === 200) {
        setEmailSent(true);
        toast.success('Password reset email sent! Check your inbox.');
      }
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
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
              <CardTitle className="text-center">Check Your Email</CardTitle>
              <CardDescription className="text-center">
                We've sent a password reset link to {email}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Mail className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>
              <Button onClick={() => onNavigate('/login')} className="w-full">
                Back to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Button variant="ghost" onClick={() => onNavigate('/login')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="text-2xl text-blue-600">HYNO</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

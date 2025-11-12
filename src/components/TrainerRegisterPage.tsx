'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Activity, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';
import { PasswordStrengthIndicator } from './ui/password-strength-indicator';

interface TrainerRegisterPageProps {
  onNavigate: (path: string) => void;
}

const TrainerRegisterPage = ({ onNavigate }: TrainerRegisterPageProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+1',
    password: '',
    confirmPassword: '',
    trainerType: '',
    experienceYears: '',
    location: '',
    pricePerSession: '',
    bio: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();


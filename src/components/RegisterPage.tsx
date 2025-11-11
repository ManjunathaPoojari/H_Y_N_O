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

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

const RegisterPage = ({ onNavigate }: RegisterPageProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+1',
    password: '',
    confirmPassword: '',
    role: 'PATIENT' as 'PATIENT' | 'DOCTOR' | 'HOSPITAL' | 'TRAINER',
    // Patient
    age: '',
    gender: '',
    bloodGroup: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    emergencyCountryCode: '+1',
    // Doctor
    specialization: '',
    qualification: '',
    experience: '',
    hospitalId: '',
    // Hospital
    hospitalAddress: '',
    city: '',
    state: '',
    pincode: '',
    registrationNumber: '',
    facilities: [] as string[],
    // Trainer
    trainerType: '',
    specialties: [] as string[],
    experienceYears: '',
    location: '',
    modes: [] as string[],
    qualifications: [] as string[],
    languages: [] as string[],
    pricePerSession: '',
    bio: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Common fields
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email address';

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters long';
    else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(
        formData.password
      )
    )
      newErrors.password =
        'Password must contain uppercase, lowercase, number, and special character';

    if (!formData.confirmPassword)
      newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    // Role-specific validation
    if (formData.role === 'PATIENT') {
      if (!formData.age) newErrors.age = 'Age is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.emergencyContact)
        newErrors.emergencyContact = 'Emergency contact is required';
    }

    if (formData.role === 'DOCTOR') {
      if (!formData.specialization)
        newErrors.specialization = 'Specialization is required';
      if (!formData.qualification)
        newErrors.qualification = 'Qualification is required';
      if (!formData.experience)
        newErrors.experience = 'Experience is required';
    }

    if (formData.role === 'HOSPITAL') {
      if (!formData.hospitalAddress)
        newErrors.hospitalAddress = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.pincode) newErrors.pincode = 'Pincode is required';
      if (!formData.registrationNumber)
        newErrors.registrationNumber = 'Registration number is required';
    }

    if (formData.role === 'TRAINER') {
      if (!formData.trainerType) newErrors.trainerType = 'Trainer type is required';
      if (!formData.experienceYears) newErrors.experienceYears = 'Experience years is required';
      if (!formData.location) newErrors.location = 'Location is required';
      if (!formData.pricePerSession) newErrors.pricePerSession = 'Price per session is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const fullPhone = `${formData.countryCode}${formData.phone.trim()}`;
      const registerData: any = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: fullPhone,
        password: formData.password,
        role: formData.role,
      };

      // Add role-specific data
      if (formData.role === 'TRAINER') {
        registerData.trainerType = formData.trainerType;
        registerData.experienceYears = parseInt(formData.experienceYears);
        registerData.location = formData.location.trim();
        registerData.pricePerSession = parseFloat(formData.pricePerSession);
        registerData.bio = formData.bio?.trim() || '';
      }

      const result = await register(registerData);

      if (result.success) {
        toast.success(
          'Account created successfully! Please check your email to verify your account before logging in.'
        );
        onNavigate('/');
      } else {
        toast.error(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
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
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-2xl text-blue-600">HYNO</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-500 text-sm mt-2">
              Trusted Healthcare • 24/7 Support
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'border-red-500' : ''}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? 'border-red-500' : ''}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex gap-2">
                <select
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  className="w-24 h-10 px-2 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 bg-white"
                >
                  <option value="+1">+1</option>
                  <option value="+91">+91</option>
                  <option value="+44">+44</option>
                  <option value="+61">+61</option>
                  <option value="+81">+81</option>
                  <option value="+86">+86</option>
                  <option value="+49">+49</option>
                  <option value="+33">+33</option>
                  <option value="+39">+39</option>
                  <option value="+7">+7</option>
                </select>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`flex-1 ${errors.phone ? 'border-red-500' : ''}`}
                  required
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label>Join as</Label>
              <div className="grid grid-cols-2 gap-3">
                {(['PATIENT', 'DOCTOR', 'HOSPITAL', 'TRAINER'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, role }))
                    }
                    className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      formData.role === role
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">
                        {role === 'PATIENT'
                          ? '👤'
                          : role === 'DOCTOR'
                          ? '👨‍⚕️'
                          : role === 'HOSPITAL'
                          ? '🏥'
                          : '🏋️‍♂️'}
                      </div>
                      <div className="text-sm font-medium">
                        {role === 'PATIENT'
                          ? 'Patient'
                          : role === 'DOCTOR'
                          ? 'Doctor'
                          : role === 'HOSPITAL'
                          ? 'Hospital'
                          : 'Trainer'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Fields */}
            {formData.role === 'PATIENT' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={handleInputChange}
                      className={errors.age ? 'border-red-500' : ''}
                    />
                    {errors.age && (
                      <p className="text-sm text-red-500">{errors.age}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 bg-white"
                    >
                      <option value="">Select</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-sm text-red-500">{errors.gender}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 bg-white"
                  >
                    <option value="">Select</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
                      (bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      )
                    )}
                  </select>
                  {errors.bloodGroup && (
                    <p className="text-sm text-red-500">
                      {errors.bloodGroup}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={errors.dateOfBirth ? 'border-red-500' : ''}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="123 Main St"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">{errors.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <div className="flex gap-2">
                    <select
                      id="emergencyCountryCode"
                      name="emergencyCountryCode"
                      value={formData.emergencyCountryCode}
                      onChange={handleInputChange}
                      className="w-24 h-10 px-2 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 bg-white"
                    >
                      <option value="+1">+1</option>
                      <option value="+91">+91</option>
                      <option value="+44">+44</option>
                      <option value="+61">+61</option>
                      <option value="+81">+81</option>
                      <option value="+86">+86</option>
                      <option value="+49">+49</option>
                      <option value="+33">+33</option>
                      <option value="+39">+39</option>
                      <option value="+7">+7</option>
                    </select>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      className={`flex-1 ${
                        errors.emergencyContact ? 'border-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.emergencyContact && (
                    <p className="text-sm text-red-500">
                      {errors.emergencyContact}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Doctor Fields */}
            {formData.role === 'DOCTOR' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    name="specialization"
                    type="text"
                    placeholder="e.g., Cardiology"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className={errors.specialization ? 'border-red-500' : ''}
                  />
                  {errors.specialization && (
                    <p className="text-sm text-red-500">
                      {errors.specialization}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    name="qualification"
                    type="text"
                    placeholder="e.g., MD, MBBS"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className={errors.qualification ? 'border-red-500' : ''}
                  />
                  {errors.qualification && (
                    <p className="text-sm text-red-500">
                      {errors.qualification}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    placeholder="5"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={errors.experience ? 'border-red-500' : ''}
                  />
                  {errors.experience && (
                    <p className="text-sm text-red-500">
                      {errors.experience}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hospitalId">Hospital ID (Optional)</Label>
                  <Input
                    id="hospitalId"
                    name="hospitalId"
                    type="text"
                    placeholder="H001"
                    value={formData.hospitalId}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            {/* Hospital Fields */}
            {formData.role === 'HOSPITAL' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="hospitalAddress">Address</Label>
                  <Input
                    id="hospitalAddress"
                    name="hospitalAddress"
                    type="text"
                    placeholder="Hospital full address"
                    value={formData.hospitalAddress}
                    onChange={handleInputChange}
                    className={
                      errors.hospitalAddress ? 'border-red-500' : ''
                    }
                  />
                  {errors.hospitalAddress && (
                    <p className="text-sm text-red-500">
                      {errors.hospitalAddress}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="New York"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? 'border-red-500' : ''}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      placeholder="NY"
                      value={formData.state}
                      onChange={handleInputChange}
                      className={errors.state ? 'border-red-500' : ''}
                    />
                    {errors.state && (
                      <p className="text-sm text-red-500">{errors.state}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    type="text"
                    placeholder="10001"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className={errors.pincode ? 'border-red-500' : ''}
                  />
                  {errors.pincode && (
                    <p className="text-sm text-red-500">{errors.pincode}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    name="registrationNumber"
                    type="text"
                    placeholder="HOSP-2024-001"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    className={
                      errors.registrationNumber ? 'border-red-500' : ''
                    }
                  />
                  {errors.registrationNumber && (
                    <p className="text-sm text-red-500">
                      {errors.registrationNumber}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Trainer Fields */}
            {formData.role === 'TRAINER' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="trainerType">Trainer Type</Label>
                  <select
                    id="trainerType"
                    name="trainerType"
                    value={formData.trainerType}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 bg-white"
                  >
                    <option value="">Select</option>
                    <option value="FITNESS">Fitness</option>
                    <option value="YOGA">Yoga</option>
                  </select>
                  {errors.trainerType && (
                    <p className="text-sm text-red-500">{errors.trainerType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceYears">Years of Experience</Label>
                  <Input
                    id="experienceYears"
                    name="experienceYears"
                    type="number"
                    placeholder="5"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                    className={errors.experienceYears ? 'border-red-500' : ''}
                  />
                  {errors.experienceYears && (
                    <p className="text-sm text-red-500">
                      {errors.experienceYears}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={errors.location ? 'border-red-500' : ''}
                  />
                  {errors.location && (
                    <p className="text-sm text-red-500">{errors.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePerSession">Price per Session ($)</Label>
                  <Input
                    id="pricePerSession"
                    name="pricePerSession"
                    type="number"
                    step="0.01"
                    placeholder="50.00"
                    value={formData.pricePerSession}
                    onChange={handleInputChange}
                    className={errors.pricePerSession ? 'border-red-500' : ''}
                  />
                  {errors.pricePerSession && (
                    <p className="text-sm text-red-500">
                      {errors.pricePerSession}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full h-20 px-3 py-2 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20 bg-white resize-none"
                  />
                </div>
              </>
            )}

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-md transition-all"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              <PasswordStrengthIndicator password={formData.password} />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`pr-10 ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-md transition-all"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 hover:scale-105 text-blac font-semibold transition-all duration-200"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('/login')}
              className="text-emerald-600 hover:text-emerald-700 hover:scale-105 font-semibold transition-all duration-200"
            >
              Sign in
            </button>
          </p>

          {/* Footer */}
          <p className="text-center text-xs text-gray-400">
            By creating an account, you agree to our{' '}
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

export { RegisterPage };
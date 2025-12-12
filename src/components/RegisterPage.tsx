'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Activity, Eye, EyeOff, User, Stethoscope, Building2, Dumbbell, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { toast } from 'sonner';
import { PasswordStrengthIndicator } from './ui/password-strength-indicator';
import { MinimalistHealthBackground } from './common/MinimalistHealthBackground';

interface RegisterPageProps {
  onNavigate: (path: string) => void;
}

const RegisterPage = ({ onNavigate }: RegisterPageProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+1',
    password: '',
    confirmPassword: '',
    role: 'PATIENT' as 'PATIENT' | 'DOCTOR' | 'HOSPITAL' | 'TRAINER',
    // Patient fields
    age: '',
    gender: '',
    bloodGroup: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    emergencyCountryCode: '+1',
    allergies: '',
    medicalHistory: '',
    currentMedications: '',
    // Doctor fields
    specialization: '',
    qualification: '',
    experience: '',
    hospitalId: '',
    consultationFee: '',
    // Hospital fields
    hospitalAddress: '',
    city: '',
    state: '',
    pincode: '',
    registrationNumber: '',
    establishedYear: '',
    bedCount: '',
    description: '',
    // Trainer fields
    trainerType: '',
    experienceYears: '',
    location: '',
    pricePerSession: '',
    bio: '',
    specialties: '',
    modes: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isNextHovered, setIsNextHovered] = useState(false);

  const { register } = useAuth();

  const totalSteps = 4;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 2) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = 'Invalid email';
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    }

    if (step === 3) {
      if (formData.role === 'PATIENT') {
        if (!formData.age) newErrors.age = 'Required';
        if (!formData.gender) newErrors.gender = 'Required';
        if (!formData.bloodGroup) newErrors.bloodGroup = 'Required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Required';
        if (!formData.address) newErrors.address = 'Required';
        if (!formData.emergencyContact) newErrors.emergencyContact = 'Required';
      }
      if (formData.role === 'DOCTOR') {
        if (!formData.specialization) newErrors.specialization = 'Required';
        if (!formData.qualification) newErrors.qualification = 'Required';
        if (!formData.experience) newErrors.experience = 'Required';
      }
      if (formData.role === 'HOSPITAL') {
        if (!formData.hospitalAddress) newErrors.hospitalAddress = 'Required';
        if (!formData.city) newErrors.city = 'Required';
        if (!formData.state) newErrors.state = 'Required';
        if (!formData.pincode) newErrors.pincode = 'Required';
        if (!formData.registrationNumber) newErrors.registrationNumber = 'Required';
      }
      if (formData.role === 'TRAINER') {
        if (!formData.trainerType) newErrors.trainerType = 'Required';
        if (!formData.experienceYears) newErrors.experienceYears = 'Required';
        if (!formData.location) newErrors.location = 'Required';
        if (!formData.pricePerSession) newErrors.pricePerSession = 'Required';
      }
    }

    if (step === 4) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 8) newErrors.password = 'Min 8 characters';
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password))
        newErrors.password = 'Must contain uppercase, lowercase, number & special char';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password';
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

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

      if (formData.role === 'PATIENT') {
        registerData.age = formData.age;
        registerData.gender = formData.gender;
        registerData.bloodGroup = formData.bloodGroup;
        registerData.dateOfBirth = formData.dateOfBirth;
        registerData.address = formData.address.trim();
        registerData.emergencyContact = `${formData.emergencyCountryCode}${formData.emergencyContact.trim()}`;
        // Optional fields
        if (formData.allergies?.trim()) registerData.allergies = formData.allergies.split(',').map((a: string) => a.trim()).filter(Boolean);
        if (formData.medicalHistory?.trim()) registerData.medicalHistory = formData.medicalHistory.split(',').map((m: string) => m.trim()).filter(Boolean);
        if (formData.currentMedications?.trim()) registerData.currentMedications = formData.currentMedications.split(',').map((m: string) => m.trim()).filter(Boolean);
      } else if (formData.role === 'DOCTOR') {
        registerData.specialization = formData.specialization.trim();
        registerData.qualification = formData.qualification.trim();
        registerData.experience = formData.experience;
        if (formData.hospitalId?.trim()) registerData.hospitalId = formData.hospitalId.trim();
        if (formData.consultationFee?.trim()) registerData.consultationFee = formData.consultationFee;
      } else if (formData.role === 'HOSPITAL') {
        registerData.hospitalAddress = formData.hospitalAddress.trim();
        registerData.city = formData.city.trim();
        registerData.state = formData.state.trim();
        registerData.pincode = formData.pincode.trim();
        registerData.registrationNumber = formData.registrationNumber.trim();
        // Optional fields
        if (formData.establishedYear?.trim()) registerData.establishedYear = parseInt(formData.establishedYear);
        if (formData.bedCount?.trim()) registerData.bedCount = parseInt(formData.bedCount);
        if (formData.description?.trim()) registerData.description = formData.description.trim();
      } else if (formData.role === 'TRAINER') {
        registerData.trainerType = formData.trainerType;
        registerData.experienceYears = parseInt(formData.experienceYears);
        registerData.location = formData.location.trim();
        registerData.pricePerSession = parseFloat(formData.pricePerSession);
        registerData.bio = formData.bio?.trim() || '';
        // Optional fields
        if (formData.specialties?.trim()) registerData.specialties = formData.specialties.split(',').map((s: string) => s.trim()).filter(Boolean);
        if (formData.modes?.trim()) registerData.modes = formData.modes.split(',').map((m: string) => m.trim()).filter(Boolean);
      }

      const result = await register(registerData);

      if (result.success) {
        toast.success('Account created! Please check your email to verify.');
        onNavigate('/');
      } else {
        toast.error(result.error || 'Registration failed.');
      }
    } catch {
      toast.error('Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              opacity: 1,
              backgroundColor: currentStep >= step ? '#059669' : '#e5e7eb',
              color: currentStep >= step ? '#ffffff' : '#4b5563',
            }}
          >
            {currentStep > step ? <Check className="h-4 w-4" /> : step}
          </div>
          {step < 4 && (
            <div
              style={{
                width: 32,
                height: 4,
                marginLeft: 4,
                marginRight: 4,
                backgroundColor: currentStep > step ? '#059669' : '#e5e7eb',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );



  const renderStep1 = () => (
    <div className="space-y-4">
      <p className="text-center text-sm text-gray-600 mb-4">Select your role</p>
      <div className="grid grid-cols-2 gap-2">
        {(['PATIENT', 'DOCTOR', 'HOSPITAL', 'TRAINER'] as const).map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, role }))}
            className={`p-3 rounded-lg border transition-all ${formData.role === role
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-200 hover:border-emerald-300'
              }`}
          >
            <div className="flex flex-col items-center gap-1.5">
              <div className={`p-2 rounded-lg ${formData.role === role ? 'bg-emerald-100' : 'bg-gray-50'}`}>
                {role === 'PATIENT' && <User className={`h-4 w-4 ${formData.role === role ? 'text-emerald-600' : 'text-gray-400'}`} />}
                {role === 'DOCTOR' && <Stethoscope className={`h-4 w-4 ${formData.role === role ? 'text-emerald-600' : 'text-gray-400'}`} />}
                {role === 'HOSPITAL' && <Building2 className={`h-4 w-4 ${formData.role === role ? 'text-emerald-600' : 'text-gray-400'}`} />}
                {role === 'TRAINER' && <Dumbbell className={`h-4 w-4 ${formData.role === role ? 'text-emerald-600' : 'text-gray-400'}`} />}
              </div>
              <span className={`text-xs font-medium ${formData.role === role ? 'text-emerald-700' : 'text-gray-600'}`}>
                {role.charAt(0) + role.slice(1).toLowerCase()}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">Full Name</Label>
        <Input name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className={`h-9 text-sm ${errors.name ? 'border-red-400' : ''}`} />
        {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
      </div>
      <div>
        <Label className="text-xs">Email</Label>
        <Input name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className={`h-9 text-sm ${errors.email ? 'border-red-400' : ''}`} />
        {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
      </div>
      <div>
        <Label className="text-xs">Phone</Label>
        <div className="flex gap-1.5">
          <select name="countryCode" value={formData.countryCode} onChange={handleInputChange} className="w-16 h-9 text-xs border border-gray-200 rounded-lg bg-white">
            <option value="+1">+1</option>
            <option value="+91">+91</option>
            <option value="+44">+44</option>
          </select>
          <Input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="555-1234" className={`flex-1 h-9 text-sm ${errors.phone ? 'border-red-400' : ''}`} />
        </div>
        {errors.phone && <p className="text-xs text-red-500 mt-0.5">{errors.phone}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-3">
      {formData.role === 'PATIENT' && (
        <>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Age</Label>
              <Input name="age" type="number" value={formData.age} onChange={handleInputChange} placeholder="25" className={`h-9 text-sm ${errors.age ? 'border-red-400' : ''}`} />
            </div>
            <div>
              <Label className="text-xs">Gender</Label>
              <select name="gender" value={formData.gender} onChange={handleInputChange} className={`w-full h-9 text-sm border rounded-lg bg-white ${errors.gender ? 'border-red-400' : 'border-gray-200'}`}>
                <option value="">Select</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Blood Group</Label>
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} className={`w-full h-9 text-sm border rounded-lg bg-white ${errors.bloodGroup ? 'border-red-400' : 'border-gray-200'}`}>
                <option value="">Select</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-xs">Date of Birth</Label>
              <Input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleInputChange} className={`h-9 text-sm ${errors.dateOfBirth ? 'border-red-400' : ''}`} />
            </div>
          </div>
          <div>
            <Label className="text-xs">Address</Label>
            <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="123 Main St" className={`h-9 text-sm ${errors.address ? 'border-red-400' : ''}`} />
          </div>
          <div>
            <Label className="text-xs">Emergency Contact</Label>
            <div className="flex gap-1.5">
              <select name="emergencyCountryCode" value={formData.emergencyCountryCode} onChange={handleInputChange} className="w-16 h-9 text-xs border border-gray-200 rounded-lg bg-white">
                <option value="+1">+1</option>
                <option value="+91">+91</option>
              </select>
              <Input name="emergencyContact" type="tel" value={formData.emergencyContact} onChange={handleInputChange} className={`flex-1 h-9 text-sm ${errors.emergencyContact ? 'border-red-400' : ''}`} />
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Allergies (Optional, comma separated)</Label>
            <Input name="allergies" value={formData.allergies} onChange={handleInputChange} placeholder="Peanuts, Penicillin" className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Medical History (Optional, comma separated)</Label>
            <Input name="medicalHistory" value={formData.medicalHistory} onChange={handleInputChange} placeholder="Diabetes, Hypertension" className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Current Medications (Optional, comma separated)</Label>
            <Input name="currentMedications" value={formData.currentMedications} onChange={handleInputChange} placeholder="Metformin, Aspirin" className="h-9 text-sm" />
          </div>
        </>
      )}

      {formData.role === 'DOCTOR' && (
        <>
          <div>
            <Label className="text-xs">Specialization</Label>
            <Input name="specialization" value={formData.specialization} onChange={handleInputChange} placeholder="Cardiology" className={`h-9 text-sm ${errors.specialization ? 'border-red-400' : ''}`} />
          </div>
          <div>
            <Label className="text-xs">Qualification</Label>
            <Input name="qualification" value={formData.qualification} onChange={handleInputChange} placeholder="MD, MBBS" className={`h-9 text-sm ${errors.qualification ? 'border-red-400' : ''}`} />
          </div>
          <div>
            <Label className="text-xs">Experience (years)</Label>
            <Input name="experience" type="number" value={formData.experience} onChange={handleInputChange} placeholder="5" className={`h-9 text-sm ${errors.experience ? 'border-red-400' : ''}`} />
          </div>
          <div>
            <Label className="text-xs">Hospital ID (Optional)</Label>
            <Input name="hospitalId" value={formData.hospitalId} onChange={handleInputChange} placeholder="H001" className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Consultation Fee (Optional)</Label>
            <Input name="consultationFee" type="number" value={formData.consultationFee} onChange={handleInputChange} placeholder="500" className="h-9 text-sm" />
          </div>
        </>
      )}

      {formData.role === 'HOSPITAL' && (
        <>
          <div>
            <Label className="text-xs">Address</Label>
            <Input name="hospitalAddress" value={formData.hospitalAddress} onChange={handleInputChange} className={`h-9 text-sm ${errors.hospitalAddress ? 'border-red-400' : ''}`} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">City</Label>
              <Input name="city" value={formData.city} onChange={handleInputChange} className={`h-9 text-sm ${errors.city ? 'border-red-400' : ''}`} />
            </div>
            <div>
              <Label className="text-xs">State</Label>
              <Input name="state" value={formData.state} onChange={handleInputChange} className={`h-9 text-sm ${errors.state ? 'border-red-400' : ''}`} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Pincode</Label>
              <Input name="pincode" value={formData.pincode} onChange={handleInputChange} className={`h-9 text-sm ${errors.pincode ? 'border-red-400' : ''}`} />
            </div>
            <div>
              <Label className="text-xs">Reg. No.</Label>
              <Input name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} className={`h-9 text-sm ${errors.registrationNumber ? 'border-red-400' : ''}`} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-gray-500">Est. Year (Optional)</Label>
              <Input name="establishedYear" type="number" value={formData.establishedYear} onChange={handleInputChange} placeholder="1990" className="h-9 text-sm" />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Bed Count (Optional)</Label>
              <Input name="bedCount" type="number" value={formData.bedCount} onChange={handleInputChange} placeholder="100" className="h-9 text-sm" />
            </div>
          </div>
          <div>
            <Label className="text-xs text-gray-500">Description (Optional)</Label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full h-16 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none" placeholder="About your hospital..." />
          </div>
        </>
      )}

      {formData.role === 'TRAINER' && (
        <>
          <div>
            <Label className="text-xs">Trainer Type</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, trainerType: 'FITNESS' }))}
                className={`p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${formData.trainerType === 'FITNESS'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-emerald-300 text-gray-600'
                  } ${errors.trainerType ? 'border-red-400' : ''}`}
              >
                <Dumbbell className={`h-4 w-4 ${formData.trainerType === 'FITNESS' ? 'text-emerald-600' : 'text-gray-400'}`} />
                <span className="text-sm font-medium">Fitness</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, trainerType: 'YOGA' }))}
                className={`p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${formData.trainerType === 'YOGA'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-200 hover:border-emerald-300 text-gray-600'
                  } ${errors.trainerType ? 'border-red-400' : ''}`}
              >
                <svg className={`h-4 w-4 ${formData.trainerType === 'YOGA' ? 'text-emerald-600' : 'text-gray-400'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4m0 4v2m-4-2l4-4 4 4M4 19h16" />
                </svg>
                <span className="text-sm font-medium">Yoga</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Experience</Label>
              <Input name="experienceYears" type="number" value={formData.experienceYears} onChange={handleInputChange} placeholder="5" className={`h-9 text-sm ${errors.experienceYears ? 'border-red-400' : ''}`} />
            </div>
            <div>
              <Label className="text-xs">Price/Session</Label>
              <Input name="pricePerSession" type="number" value={formData.pricePerSession} onChange={handleInputChange} placeholder="50" className={`h-9 text-sm ${errors.pricePerSession ? 'border-red-400' : ''}`} />
            </div>
          </div>
          <div>
            <Label className="text-xs">Location</Label>
            <Input name="location" value={formData.location} onChange={handleInputChange} className={`h-9 text-sm ${errors.location ? 'border-red-400' : ''}`} />
          </div>
          <div>
            <Label className="text-xs">Bio (Optional)</Label>
            <textarea name="bio" value={formData.bio} onChange={handleInputChange} className="w-full h-16 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Specialties (Optional, comma separated)</Label>
            <Input name="specialties" value={formData.specialties} onChange={handleInputChange} placeholder="Weight Loss, Strength Training" className="h-9 text-sm" />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Training Modes (Optional, comma separated)</Label>
            <Input name="modes" value={formData.modes} onChange={handleInputChange} placeholder="virtual, in-person" className="h-9 text-sm" />
          </div>
        </>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-3">
      <div>
        <Label className="text-xs">Password</Label>
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            className={`h-9 text-sm pr-9 ${errors.password ? 'border-red-400' : ''}`}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2">
            {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
          </button>
        </div>
        <PasswordStrengthIndicator password={formData.password} />
        {errors.password && <p className="text-xs text-red-500 mt-0.5">{errors.password}</p>}
      </div>

      <div>
        <Label className="text-xs">Confirm Password</Label>
        <div className="relative">
          <Input
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="••••••••"
            className={`h-9 text-sm pr-9 ${errors.confirmPassword ? 'border-red-400' : ''}`}
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-2">
            {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-xs text-red-500 mt-0.5">{errors.confirmPassword}</p>}
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mt-2">
        <p className="text-xs font-medium text-gray-700 mb-2">Password must have:</p>
        <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
          <span className={formData.password.length >= 8 ? 'text-emerald-600' : ''}>✓ 8+ characters</span>
          <span className={/[A-Z]/.test(formData.password) ? 'text-emerald-600' : ''}>✓ Uppercase</span>
          <span className={/[a-z]/.test(formData.password) ? 'text-emerald-600' : ''}>✓ Lowercase</span>
          <span className={/\d/.test(formData.password) ? 'text-emerald-600' : ''}>✓ Number</span>
          <span className={/[@$!%*?&]/.test(formData.password) ? 'text-emerald-600' : ''}>✓ Special char</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative">
      <MinimalistHealthBackground />
      <Card className="w-full max-w-md shadow-lg border border-gray-200/50 rounded-xl bg-white/90 backdrop-blur-md relative z-10">
        <CardContent className="p-6">
          {/* Header */}
          <div className="text-center mb-5">
            <button type="button" onClick={() => onNavigate('/')} className="flex items-center justify-center gap-1.5 mx-auto mb-3">
              <Activity className="h-6 w-6 text-emerald-600" />
              <span className="text-xl text-emerald-600 font-bold">HYNO</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
            <p className="text-sm text-gray-500 mt-1">Step {currentStep} of {totalSteps}</p>
          </div>

          {renderStepIndicator()}

          <form onSubmit={handleRegister}>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            <div className="flex justify-between items-center mt-6">
              {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={handleBack} className="h-10 px-5">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
              ) : (
                <div className="flex-1" />
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  onMouseEnter={() => setIsNextHovered(true)}
                  onMouseLeave={() => setIsNextHovered(false)}
                  style={{
                    height: 48,
                    paddingLeft: 24,
                    paddingRight: 24,
                    backgroundColor: 'transparent',
                    color: '#059669',
                    borderRadius: 12,
                    fontWeight: 600,
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Next
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      backgroundColor: isNextHovered ? '#059669' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                      transform: isNextHovered ? 'scale(1)' : 'scale(0)',
                    }}
                  >
                    <ChevronRight
                      style={{
                        width: 16,
                        height: 16,
                        color: 'white',
                        opacity: isNextHovered ? 1 : 0,
                        transition: 'opacity 0.2s',
                      }}
                    />
                  </span>
                </button>
              ) : (
                <Button type="submit" disabled={isLoading} className="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 ml-auto">
                  {isLoading ? 'Creating...' : 'Create Account'}
                </Button>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <button type="button" onClick={() => onNavigate('/login')} className="text-emerald-600 font-medium hover:underline">Sign in</button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export { RegisterPage };
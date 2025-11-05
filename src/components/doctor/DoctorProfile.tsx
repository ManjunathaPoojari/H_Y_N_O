import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, Stethoscope, FileText, Phone, Mail, MapPin, Calendar, Save, Loader2, Star, DollarSign } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { Doctor } from '../../types';
import { API_URL } from '../../lib/config';
import { toast } from 'sonner';

export const DoctorProfile = () => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch doctor data from backend
  useEffect(() => {
    if (user?.id) {
      fetchDoctorData();
    }
  }, [user?.id]);

  useEffect(() => {
    // Cleanup preview URL on unmount
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const fetchDoctorData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/doctors/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const doctorData = await response.json();
        setDoctor(doctorData);
      } else {
        console.error('Failed to fetch doctor data:', response.status, response.statusText);
        toast.error('Failed to load doctor profile');
      }
    } catch (error) {
      console.error('Error fetching doctor data:', error);
      toast.error('Error loading doctor data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file (JPEG or PNG)');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB
        toast.error('Image size must be less than 2MB');
        return;
      }

      setSelectedPhoto(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const handleSave = async () => {
    if (!doctor) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      // Append all doctor fields
      Object.keys(doctor).forEach(key => {
        if (key !== 'hospital' && doctor[key as keyof Doctor] !== undefined && doctor[key as keyof Doctor] !== null) {
          formData.append(key, doctor[key as keyof Doctor] as string);
        }
      });

      // Append photo if selected
      if (selectedPhoto) {
        formData.append('avatar', selectedPhoto);
      }

      const response = await fetch(`${API_URL}/doctors/${doctor.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedDoctor = await response.json();
        setDoctor(updatedDoctor);
        setIsEditing(false);
        setSelectedPhoto(null);
        if (photoPreview) {
          URL.revokeObjectURL(photoPreview);
          setPhotoPreview(null);
        }
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating doctor data:', error);
      toast.error('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof Doctor, value: any) => {
    if (doctor) {
      setDoctor({ ...doctor, [field]: value });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load doctor profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your professional information and practice details</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="relative mx-auto mb-4">
                {photoPreview || doctor.avatarUrl ? (
                  <img
                    src={photoPreview || doctor.avatarUrl}
                    alt="Doctor avatar"
                    className="h-24 w-24 rounded-full object-cover mx-auto"
                  />
                ) : (
                  <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Stethoscope className="h-12 w-12 text-blue-600" />
                  </div>
                )}
                {isEditing && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Photo
                  </Button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handlePhotoChange}
                className="hidden"
                disabled={!isEditing}
              />
              <h3 className="text-xl mb-1">Dr. {doctor.name}</h3>
              <Badge className="mb-2">{doctor.specialization}</Badge>
              <Badge variant="outline" className="mb-4">Doctor ID: {doctor.id}</Badge>
              <div className="space-y-2 text-sm text-left">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  {doctor.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  {doctor.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="h-4 w-4" />
                  Rating: {doctor.rating}/5.0
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  ₹{doctor.consultationFee}/consultation
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  {doctor.experience} years experience
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Practice Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Patients</span>
                <Badge variant="secondary">45</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Appointments</span>
                <Badge variant="secondary">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed Consultations</span>
                <Badge variant="secondary">127</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant={doctor.status === 'approved' ? 'default' : 'secondary'}>
                  {doctor.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={doctor.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing || isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={doctor.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing || isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={doctor.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing || isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={doctor.experience || ''}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    disabled={!isEditing || isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                  <Input
                    id="consultationFee"
                    type="number"
                    value={doctor.consultationFee || ''}
                    onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                    disabled={!isEditing || isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="available">Availability Status</Label>
                  <Select
                    disabled={!isEditing || isSaving}
                    value={doctor.available ? 'available' : 'unavailable'}
                    onValueChange={(value: string) => handleInputChange('available', value === 'available')}
                  >
                    <SelectTrigger id="available">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-500" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={doctor.specialization || ''}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    disabled={!isEditing || isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={doctor.qualification || ''}
                    onChange={(e) => handleInputChange('qualification', e.target.value)}
                    disabled={!isEditing || isSaving}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hospital Affiliation</Label>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm">
                    {doctor.hospital ? doctor.hospital.name : 'Not affiliated with any hospital'}
                  </p>
                  {doctor.hospital && (
                    <p className="text-xs text-gray-500 mt-1">
                      {doctor.hospital.address}, {doctor.hospital.city}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Brief description of your practice, expertise, and approach to patient care..."
                  disabled={!isEditing}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Achievements & Certifications</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">MBBS, MD - Sample University</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Board Certified in Internal Medicine</span>
                  </div>
                  {isEditing && (
                    <Button size="sm" variant="outline" className="w-full">
                      + Add Certification
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          {isEditing && (
            <div className="flex gap-3">
              <Button size="lg" className="flex-1" onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

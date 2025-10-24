import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, Heart, FileText, Phone, Mail, MapPin, Calendar, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { Patient } from '../../types';
import { API_URL } from '../../lib/config';
import { toast } from 'sonner';

export const PatientProfile = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch patient data from backend
  useEffect(() => {
    if (user?.id) {
      fetchPatientData();
    }
  }, [user?.id]);

  const fetchPatientData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/patients/${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const patientData = await response.json();
        setPatient(patientData);
      } else {
        toast.error('Failed to load patient data');
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      toast.error('Error loading patient data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!patient) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/patients/${patient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(patient),
      });

      if (response.ok) {
        const updatedPatient = await response.json();
        setPatient(updatedPatient);
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating patient data:', error);
      toast.error('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof Patient, value: any) => {
    if (patient) {
      setPatient({ ...patient, [field]: value });
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

  if (!patient) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load patient profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information and health details</p>
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
              <div className="h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl mb-1">{patient.name}</h3>
              <Badge className="mb-4">Patient ID: {patient.id}</Badge>
              <div className="space-y-2 text-sm text-left">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  {patient.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  {patient.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {patient.address}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Member since {new Date(patient.createdAt || Date.now()).getFullYear()}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Appointments</span>
                <Badge variant="secondary">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Prescriptions</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Lab Reports</span>
                <Badge variant="secondary">8</Badge>
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
                    value={patient.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing || isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={patient.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing || isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={patient.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing || isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input
                    id="emergency"
                    value={patient.emergencyContact || ''}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    disabled={!isEditing || isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={patient.age || ''}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    disabled={!isEditing || isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    disabled={!isEditing || isSaving}
                    value={patient.gender || ''}
                    onValueChange={(value) => handleInputChange('gender', value)}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blood">Blood Group</Label>
                  <Select
                    disabled={!isEditing || isSaving}
                    value={patient.bloodGroup || ''}
                    onValueChange={(value) => handleInputChange('bloodGroup', value)}
                  >
                    <SelectTrigger id="blood">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={patient.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing || isSaving}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Allergies</Label>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies && patient.allergies.length > 0 ? (
                    patient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive">
                        {allergy}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No allergies recorded</p>
                  )}
                  {isEditing && (
                    <Button size="sm" variant="outline">
                      + Add Allergy
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Medical History</Label>
                <div className="space-y-2">
                  {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
                    patient.medicalHistory.map((condition, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{condition}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No medical history recorded</p>
                  )}
                  {isEditing && (
                    <Button size="sm" variant="outline" className="w-full">
                      + Add Medical Condition
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional medical information..."
                  disabled={!isEditing}
                  rows={3}
                />
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

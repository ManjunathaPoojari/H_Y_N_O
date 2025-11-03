import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { UserPlus, Edit, Trash2, Stethoscope, Phone, Mail, MapPin, Star } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { toast } from 'sonner';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { doctorAPI } from '../../lib/api-client';
import { Doctor } from '../../types';

export const HospitalDoctors = () => {
  const { doctors, updateDoctor, removeDoctor } = useAppStore();
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    phone: '',
    address: '',
    bio: ''
  });

  // Filter doctors for current hospital (hardcoded as H001 for demo)
  const hospitalDoctors = doctors.filter(d => d.hospitalId === 'H001' || d.hospital?.id === 'H001');

  const handleAddDoctor = async () => {
    try {
      const doctorData = {
        id: `DOC${Date.now()}`, // Generate unique ID
        ...doctorForm,
        hospitalId: 'H001', // Associate with current hospital
        experience: parseInt(doctorForm.experience) || 0,
        consultationFee: parseFloat(doctorForm.consultationFee) || 0,
        status: 'pending', // New doctors need approval
        available: true,
        rating: 0,
        password: 'defaultPassword123' // Default password, should be changed later
      };

      await doctorAPI.create(doctorData);
      toast.success('Doctor added successfully! They can now login with their email and password.');
      setIsAddDoctorOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to add doctor. Please try again.');
      console.error('Error adding doctor:', error);
    }
  };

  const handleEditDoctor = async () => {
    try {
      const updatedDoctor = {
        ...editingDoctor,
        ...doctorForm,
        experience: parseInt(doctorForm.experience) || 0,
        consultationFee: parseFloat(doctorForm.consultationFee) || 0,
      };

      await doctorAPI.update(editingDoctor.id, updatedDoctor);
      updateDoctor(editingDoctor.id, updatedDoctor);
      toast.success('Doctor updated successfully!');
      setEditingDoctor(null);
      resetForm();
    } catch (error) {
      toast.error('Failed to update doctor. Please try again.');
      console.error('Error updating doctor:', error);
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (!confirm('Are you sure you want to remove this doctor?')) return;

    try {
      await doctorAPI.delete(doctorId);
      removeDoctor(doctorId);
      toast.success('Doctor removed successfully!');
    } catch (error) {
      toast.error('Failed to remove doctor. Please try again.');
      console.error('Error removing doctor:', error);
    }
  };

  const resetForm = () => {
    setDoctorForm({
      name: '',
      email: '',
      specialization: '',
      qualification: '',
      experience: '',
      consultationFee: '',
      phone: '',
      address: '',
      bio: ''
    });
  };

  const openEditDialog = (doctor) => {
    setEditingDoctor(doctor);
    setDoctorForm({
      name: doctor.name || '',
      email: doctor.email || '',
      specialization: doctor.specialization || '',
      qualification: doctor.qualification || '',
      experience: doctor.experience?.toString() || '',
      consultationFee: doctor.consultationFee?.toString() || '',
      phone: doctor.phone || '',
      address: doctor.address || '',
      bio: doctor.bio || ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Manage Doctors</h1>
          <p className="text-gray-600">Add and manage doctors at your facility</p>
        </div>
        <Dialog open={isAddDoctorOpen} onOpenChange={setIsAddDoctorOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Doctor</DialogTitle>
            </DialogHeader>
            <DoctorForm
              form={doctorForm}
              setForm={setDoctorForm}
              onSubmit={handleAddDoctor}
              onCancel={() => setIsAddDoctorOpen(false)}
              submitLabel="Add Doctor"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Doctors</CardTitle>
            <Stethoscope className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{hospitalDoctors.length}</div>
            <p className="text-xs text-gray-600 mt-1">Active practitioners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Available Now</CardTitle>
            <Stethoscope className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{hospitalDoctors.filter(d => d.available).length}</div>
            <p className="text-xs text-gray-600 mt-1">Currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Pending Approval</CardTitle>
            <Stethoscope className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{hospitalDoctors.filter(d => d.status === 'pending').length}</div>
            <p className="text-xs text-gray-600 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {hospitalDoctors.length > 0
                ? (hospitalDoctors.reduce((sum, d) => sum + (d.rating || 0), 0) / hospitalDoctors.length).toFixed(1)
                : '0.0'
              }
            </div>
            <p className="text-xs text-gray-600 mt-1">Out of 5 stars</p>
          </CardContent>
        </Card>
      </div>

      {/* Doctors List */}
      <Card>
        <CardHeader>
          <CardTitle>Doctors ({hospitalDoctors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hospitalDoctors.length > 0 ? (
              hospitalDoctors.map((doctor) => (
                <div key={doctor.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{doctor.name}</h4>
                        <Badge variant={doctor.available ? 'default' : 'secondary'}>
                          {doctor.available ? 'Available' : 'Unavailable'}
                        </Badge>
                        {doctor.status === 'pending' && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600">
                            Pending Approval
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{doctor.specialization}</p>
                      <p className="text-xs text-gray-500 mb-2">{doctor.qualification}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <span>{doctor.experience} years exp.</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{doctor.rating}/5</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>₹{doctor.consultationFee}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{doctor.phone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{doctor.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{doctor.address}</span>
                        </div>
                      </div>

                      {doctor.bio && (
                        <p className="text-sm text-gray-600 mt-2">{doctor.bio}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(doctor)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteDoctor(doctor.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No doctors added yet.</p>
                <Button className="mt-4" onClick={() => setIsAddDoctorOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Your First Doctor
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Doctor Dialog */}
      {editingDoctor && (
        <Dialog open={!!editingDoctor} onOpenChange={() => setEditingDoctor(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Doctor</DialogTitle>
            </DialogHeader>
            <DoctorForm
              form={doctorForm}
              setForm={setDoctorForm}
              onSubmit={handleEditDoctor}
              onCancel={() => setEditingDoctor(null)}
              submitLabel="Update Doctor"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Reusable Doctor Form Component
const DoctorForm = ({ form, setForm, onSubmit, onCancel, submitLabel }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
          placeholder="Dr. John Doe"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
          placeholder="doctor@example.com"
        />
      </div>
      <div>
        <Label htmlFor="specialization">Specialization</Label>
        <Select value={form.specialization} onValueChange={(value: string) => setForm({...form, specialization: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cardiology">Cardiology</SelectItem>
            <SelectItem value="Neurology">Neurology</SelectItem>
            <SelectItem value="General Medicine">General Medicine</SelectItem>
            <SelectItem value="Orthopedics">Orthopedics</SelectItem>
            <SelectItem value="Dermatology">Dermatology</SelectItem>
            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
            <SelectItem value="Gynecology">Gynecology</SelectItem>
            <SelectItem value="ENT">ENT</SelectItem>
            <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
            <SelectItem value="Dentistry">Dentistry</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="qualification">Qualification</Label>
        <Input
          id="qualification"
          value={form.qualification}
          onChange={(e) => setForm({...form, qualification: e.target.value})}
          placeholder="MBBS, MD"
        />
      </div>
      <div>
        <Label htmlFor="experience">Experience (years)</Label>
        <Input
          id="experience"
          type="number"
          value={form.experience}
          onChange={(e) => setForm({...form, experience: e.target.value})}
          placeholder="5"
        />
      </div>
      <div>
        <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
        <Input
          id="consultationFee"
          type="number"
          value={form.consultationFee}
          onChange={(e) => setForm({...form, consultationFee: e.target.value})}
          placeholder="500"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          value={form.phone}
          onChange={(e) => setForm({...form, phone: e.target.value})}
          placeholder="+91 9876543210"
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={form.address}
          onChange={(e) => setForm({...form, address: e.target.value})}
          placeholder="Clinic address"
        />
      </div>
      <div className="col-span-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={form.bio}
          onChange={(e) => setForm({...form, bio: e.target.value})}
          placeholder="Brief description about the doctor..."
          rows={3}
        />
      </div>
      <div className="col-span-2 flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};

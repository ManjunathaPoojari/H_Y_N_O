import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Building2, Users, Calendar, UserPlus, Stethoscope, TrendingUp } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { toast } from 'sonner';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { doctorAPI } from '../../lib/api-client';
import { HospitalDoctors } from './HospitalDoctors';
import { HospitalAppointments } from './HospitalAppointments';
import { HospitalPatients } from './HospitalPatients';

interface HospitalDashboardProps {
  onNavigate?: (path: string) => void;
}

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({ onNavigate }) => {
  const { doctors, appointments, updateAppointment } = useAppStore();
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
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

  const hospitalDoctors = doctors.filter(d => d.hospitalId === 'H001' || d.hospital?.id === 'H001');
  const hospitalAppointments = appointments.filter(a => a.hospitalId === 'H001');
  const pendingAppointments = hospitalAppointments.filter(a => a.status === 'pending');

  const stats = {
    totalDoctors: hospitalDoctors.length,
    totalAppointments: hospitalAppointments.length,
    pendingApprovals: pendingAppointments.length,
    todayAppointments: 8,
  };

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
    } catch (error) {
      toast.error('Failed to add doctor. Please try again.');
      console.error('Error adding doctor:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Apollo Hospital</h1>
        <p className="text-gray-600">Hospital Management Dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Doctors</CardTitle>
            <Stethoscope className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalDoctors}</div>
            <p className="text-xs text-gray-600 mt-1">Active practitioners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalAppointments}</div>
            <p className="text-xs text-gray-600 mt-1">All time bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Pending Approvals</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.pendingApprovals}</div>
            <p className="text-xs text-gray-600 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Today's Appointments</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.todayAppointments}</div>
            <p className="text-xs text-gray-600 mt-1">Scheduled for today</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Dialog open={isAddDoctorOpen} onOpenChange={setIsAddDoctorOpen}>
              <DialogTrigger asChild>
                <Button className="h-auto py-4 flex flex-col gap-2">
                  <UserPlus className="h-5 w-5" />
                  <span className="text-sm">Add Doctor</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Doctor</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={doctorForm.name}
                      onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                      placeholder="Dr. John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={doctorForm.email}
                      onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                      placeholder="doctor@example.com"
                    />
                  </div>
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select value={doctorForm.specialization} onValueChange={(value: string) => setDoctorForm({...doctorForm, specialization: value})}>
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
                    </SelectContent>
                  </Select>
                </div>
                  <div>
                    <Label htmlFor="qualification">Qualification</Label>
                    <Input
                      id="qualification"
                      value={doctorForm.qualification}
                      onChange={(e) => setDoctorForm({...doctorForm, qualification: e.target.value})}
                      placeholder="MBBS, MD"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience (years)</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={doctorForm.experience}
                      onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                    <Input
                      id="consultationFee"
                      type="number"
                      value={doctorForm.consultationFee}
                      onChange={(e) => setDoctorForm({...doctorForm, consultationFee: e.target.value})}
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={doctorForm.phone}
                      onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                      placeholder="+91 9876543210"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={doctorForm.address}
                      onChange={(e) => setDoctorForm({...doctorForm, address: e.target.value})}
                      placeholder="Clinic address"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={doctorForm.bio}
                      onChange={(e) => setDoctorForm({...doctorForm, bio: e.target.value})}
                      placeholder="Brief description about the doctor..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsAddDoctorOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDoctor}>
                    Add Doctor
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button className="h-auto py-4 flex flex-col gap-2" onClick={() => onNavigate?.('/hospital/appointments')}>
              <Calendar className="h-5 w-5" />
              <span className="text-sm">View Appointments</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => onNavigate?.('/hospital/doctors')}>
              <Stethoscope className="h-5 w-5" />
              <span className="text-sm">Manage Doctors</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => onNavigate?.('/hospital/reports')}>
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Our Doctors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Our Doctors</CardTitle>
          <Dialog open={isAddDoctorOpen} onOpenChange={setIsAddDoctorOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Doctor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Doctor</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({...doctorForm, name: e.target.value})}
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({...doctorForm, email: e.target.value})}
                    placeholder="doctor@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Select value={doctorForm.specialization} onValueChange={(value: string) => setDoctorForm({...doctorForm, specialization: value})}>
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
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    value={doctorForm.qualification}
                    onChange={(e) => setDoctorForm({...doctorForm, qualification: e.target.value})}
                    placeholder="MBBS, MD"
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Experience (years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={doctorForm.experience}
                    onChange={(e) => setDoctorForm({...doctorForm, experience: e.target.value})}
                    placeholder="5"
                  />
                </div>
                <div>
                  <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                  <Input
                    id="consultationFee"
                    type="number"
                    value={doctorForm.consultationFee}
                    onChange={(e) => setDoctorForm({...doctorForm, consultationFee: e.target.value})}
                    placeholder="500"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={doctorForm.phone}
                    onChange={(e) => setDoctorForm({...doctorForm, phone: e.target.value})}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={doctorForm.address}
                    onChange={(e) => setDoctorForm({...doctorForm, address: e.target.value})}
                    placeholder="Clinic address"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={doctorForm.bio}
                    onChange={(e) => setDoctorForm({...doctorForm, bio: e.target.value})}
                    placeholder="Brief description about the doctor..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddDoctorOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddDoctor}>
                  Add Doctor
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hospitalDoctors.map((doctor) => (
              <div key={doctor.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{doctor.name}</h4>
                      <Badge variant={doctor.available ? 'default' : 'secondary'}>
                        {doctor.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    <p className="text-xs text-gray-500 mt-1">{doctor.qualification}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                      <span>{doctor.experience} years exp.</span>
                      <span>Rating: {doctor.rating}/5</span>
                      <span>Fee: ₹{doctor.consultationFee}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm" variant="outline">View Schedule</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pending Appointment Approvals</CardTitle>
          <Badge variant="secondary">{pendingAppointments.length}</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingAppointments.length > 0 ? (
              pendingAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4>{appointment.patientName}</h4>
                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                          Pending
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Doctor: {appointment.doctorName}</p>
                      <p className="text-sm text-gray-600 mb-1">{appointment.reason}</p>
                      <p className="text-xs text-gray-500">{appointment.date} at {appointment.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        updateAppointment(appointment.id, { status: 'upcoming' });
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        updateAppointment(appointment.id, { status: 'cancelled' });
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No pending approvals</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hospital Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Specializations Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cardiology</span>
                <Badge variant="secondary">1 Doctor</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Neurology</span>
                <Badge variant="secondary">1 Doctor</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>General Medicine</span>
                <Badge variant="secondary">3 Doctors</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Facilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['ICU', 'Emergency', 'Surgery', 'Lab', 'Pharmacy', 'Radiology'].map((facility) => (
                <Badge key={facility} variant="outline">{facility}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Appointments</span>
                <span>156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">New Patients</span>
                <span>42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue</span>
                <span>₹2,45,000</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

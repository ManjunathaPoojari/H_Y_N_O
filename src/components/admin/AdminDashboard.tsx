import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Users, Building2, UserCog, Calendar, AlertCircle, CheckCircle, XCircle, TrendingUp, Plus } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { useSearch } from '../../lib/search-context';
import api from '../../lib/api-client';

export const AdminDashboard = () => {
  const { patients, doctors, hospitals, appointments, approveHospital, rejectHospital, approveDoctor, suspendDoctor, addDoctor } = useAppStore();
  const { searchQuery } = useSearch();
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalHospitals: 0,
    pendingApprovals: 0,
    activeAppointments: 0,
    emergencies: 2,
  });

  // Add Doctor Form State
  const [showAddDoctorForm, setShowAddDoctorForm] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: '',
    consultationFee: '',
    hospitalId: '',
    password: '',
  });

  // Load admin stats on component mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        const statsData = await api.admin.getStats();
        setStats({
          totalPatients: statsData.totalPatients || 0,
          totalDoctors: statsData.totalDoctors || 0,
          totalHospitals: statsData.totalHospitals || 0,
          pendingApprovals: statsData.pendingApprovals || 0,
          activeAppointments: statsData.activeAppointments || 0,
          emergencies: 2,
        });
      } catch (error) {
        console.error('Failed to load admin stats:', error);
        // Fallback to local data
        setStats({
          totalPatients: patients.length,
          totalDoctors: doctors.length,
          totalHospitals: hospitals.length,
          pendingApprovals: hospitals.filter(h => h.status === 'pending').length +
                            doctors.filter(d => d.status === 'pending').length,
          activeAppointments: appointments.filter(a => a.status === 'booked').length,
          emergencies: 2,
        });
      }
    };

    loadStats();
  }, [patients, doctors, hospitals, appointments]);

  // Filter data based on search query
  const filteredHospitals = (Array.isArray(hospitals) ? hospitals : []).filter(h => {
    const query = searchQuery.toLowerCase();
    if (query === 'hospital') return true;
    return (h.name?.toLowerCase() || '').includes(query) ||
      (h.city?.toLowerCase() || '').includes(query) ||
      (h.state?.toLowerCase() || '').includes(query);
  });

  const filteredDoctors = (Array.isArray(doctors) ? doctors : []).filter(d => {
    const query = searchQuery.toLowerCase();
    if (query === 'doctor') return true;
    return (d.name?.toLowerCase() || '').includes(query) ||
      (d.specialization?.toLowerCase() || '').includes(query) ||
      (d.email?.toLowerCase() || '').includes(query);
  });

  const filteredPatients = (Array.isArray(patients) ? patients : []).filter(p => {
    const query = searchQuery.toLowerCase();
    if (query === 'patient') return true;
    return (p.name?.toLowerCase() || '').includes(query) ||
      (p.email?.toLowerCase() || '').includes(query) ||
      (p.phone || '').includes(query);
  });

  const pendingHospitals = filteredHospitals.filter(h => h.status === 'pending');
  const pendingDoctors = filteredDoctors.filter(d => d.status === 'pending');



  // Handle Add Doctor Form
  const handleAddDoctor = async () => {
    if (!doctorForm.name || !doctorForm.email || !doctorForm.specialization || !doctorForm.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newDoctor = {
      id: `DOC${String(doctors.length + 1).padStart(3, '0')}`,
      name: doctorForm.name,
      email: doctorForm.email,
      phone: doctorForm.phone,
      specialization: doctorForm.specialization,
      qualification: doctorForm.qualification,
      experience: parseInt(doctorForm.experience) || 0,
      rating: 0,
      available: true,
      hospitalId: doctorForm.hospitalId || undefined,
      consultationFee: parseFloat(doctorForm.consultationFee) || 0,
      status: 'approved' as const,
      avatar: '',
      password: doctorForm.password,
    };

    try {
      await addDoctor(newDoctor);
      setDoctorForm({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        qualification: '',
        experience: '',
        consultationFee: '',
        hospitalId: '',
        password: '',
      });
      setShowAddDoctorForm(false);
    } catch (error) {
      console.error('Failed to add doctor:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalPatients}</div>
            <p className="text-xs text-gray-600 mt-1">Active users in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Doctors</CardTitle>
            <UserCog className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalDoctors}</div>
            <p className="text-xs text-gray-600 mt-1">Registered practitioners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Partner Hospitals</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalHospitals}</div>
            <p className="text-xs text-gray-600 mt-1">Healthcare facilities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Pending Approvals</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.pendingApprovals}</div>
            <p className="text-xs text-gray-600 mt-1">Awaiting verification</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Active Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.activeAppointments}</div>
            <p className="text-xs text-gray-600 mt-1">Scheduled consultations</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-red-900">Emergency Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-900">{stats.emergencies}</div>
            <p className="text-xs text-red-700 mt-1">Needs immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pending Hospitals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pending Hospital Approvals</span>
              <Badge variant="secondary">{pendingHospitals.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingHospitals.length > 0 ? (
                pendingHospitals.map((hospital) => (
                  <div key={hospital.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="mb-1">{hospital.name}</h4>
                        <p className="text-sm text-gray-600">{hospital.city}, {hospital.state}</p>
                        <p className="text-xs text-gray-500 mt-1">Reg: {hospital.registrationNumber}</p>
                      </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        Pending
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="flex-1" onClick={() => approveHospital(hospital.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => rejectHospital(hospital.id)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No pending hospital approvals</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Doctors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pending Doctor Approvals</span>
              <Badge variant="secondary">{pendingDoctors.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDoctors.length > 0 ? (
                pendingDoctors.map((doctor) => (
                  <div key={doctor.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="mb-1">{doctor.name}</h4>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                        <p className="text-xs text-gray-500 mt-1">{doctor.qualification}</p>
                      </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-600">
                        Pending
                      </Badge>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="flex-1" onClick={() => approveDoctor(doctor.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => suspendDoctor(doctor.id)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No pending doctor approvals</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Doctor Form */}
      {showAddDoctorForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Doctor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="doctor-name">Name *</Label>
                <Input
                  id="doctor-name"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  placeholder="Dr. John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-email">Email *</Label>
                <Input
                  id="doctor-email"
                  type="email"
                  value={doctorForm.email}
                  onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                  placeholder="doctor@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-phone">Phone</Label>
                <Input
                  id="doctor-phone"
                  value={doctorForm.phone}
                  onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-specialization">Specialization *</Label>
                <Select value={doctorForm.specialization} onValueChange={(value: string) => setDoctorForm({ ...doctorForm, specialization: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                    <SelectItem value="Dermatology">Dermatology</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                    <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                    <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="Radiology">Radiology</SelectItem>
                    <SelectItem value="General Medicine">General Medicine</SelectItem>
                    <SelectItem value="Gynecology">Gynecology</SelectItem>
                    <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-qualification">Qualification</Label>
                <Input
                  id="doctor-qualification"
                  value={doctorForm.qualification}
                  onChange={(e) => setDoctorForm({ ...doctorForm, qualification: e.target.value })}
                  placeholder="MBBS, MD"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-experience">Experience (years)</Label>
                <Input
                  id="doctor-experience"
                  type="number"
                  value={doctorForm.experience}
                  onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                  placeholder="5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-fee">Consultation Fee (₹)</Label>
                <Input
                  id="doctor-fee"
                  type="number"
                  value={doctorForm.consultationFee}
                  onChange={(e) => setDoctorForm({ ...doctorForm, consultationFee: e.target.value })}
                  placeholder="500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-hospital">Hospital (Optional)</Label>
                <Select value={doctorForm.hospitalId} onValueChange={(value: string) => setDoctorForm({ ...doctorForm, hospitalId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.filter(h => h.status === 'approved').map((hospital) => (
                      <SelectItem key={hospital.id} value={hospital.id}>
                        {hospital.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor-password">Password *</Label>
                <Input
                  id="doctor-password"
                  type="password"
                  value={doctorForm.password}
                  onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddDoctor}>
                <Plus className="h-4 w-4 mr-2" />
                Add Doctor
              </Button>
              <Button variant="outline" onClick={() => setShowAddDoctorForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}



      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => setShowAddDoctorForm(!showAddDoctorForm)}>
              <Plus className="h-5 w-5" />
              <span className="text-sm">Add Doctor</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => window.location.href = '/admin/patients'}>
              <Users className="h-5 w-5" />
              <span className="text-sm">View All Patients</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => window.location.href = '/admin/doctors'}>
              <UserCog className="h-5 w-5" />
              <span className="text-sm">Manage Doctors</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => window.location.href = '/admin/hospitals'}>
              <Building2 className="h-5 w-5" />
              <span className="text-sm">View Hospitals</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => window.location.href = '/admin/appointments'}>
              <Calendar className="h-5 w-5" />
              <span className="text-sm">View Appointments</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

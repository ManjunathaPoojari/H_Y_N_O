import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Users, User, Phone, Mail, Calendar, MapPin, FileText, Activity } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { useAuth } from '../../lib/auth-context';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { patientAPI, hospitalAPI } from '../../lib/api-client';
import { Patient } from '../../types';

export const HospitalPatients = () => {
  const { patients, appointments, doctors } = useAppStore();
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [hospitalPatients, setHospitalPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientForm, setPatientForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    bloodGroup: '',
    address: '',
    emergencyContact: '',
    allergies: '',
    medicalHistory: ''
  });

  // Fetch hospital patients on component mount
  useEffect(() => {
    const fetchHospitalPatients = async () => {
      if (user?.id) {
        try {
          const patients = await hospitalAPI.getPatients(user.id);
          setHospitalPatients(patients);
        } catch (error) {
          console.error('Error fetching hospital patients:', error);
          toast.error('Failed to load patients');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHospitalPatients();
  }, [user?.id]);

  const resetForm = () => {
    setPatientForm({
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      bloodGroup: '',
      address: '',
      emergencyContact: '',
      allergies: '',
      medicalHistory: ''
    });
  };

  const handleAddPatient = async () => {
    try {
      const patientData = {
        id: `PAT${Date.now()}`,
        ...patientForm,
        age: parseInt(patientForm.age) || 0,
        allergies: patientForm.allergies ? patientForm.allergies.split(',').map(a => a.trim()) : [],
        medicalHistory: patientForm.medicalHistory ? patientForm.medicalHistory.split(',').map(h => h.trim()) : [],
        createdAt: new Date().toISOString()
      };

      await patientAPI.create(patientData);
      toast.success('Patient added successfully!');
      setIsAddPatientOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to add patient. Please try again.');
      console.error('Error adding patient:', error);
    }
  };

  const getPatientStats = (patientId: string) => {
    const patientAppointments = appointments.filter(a => a.patientId === patientId);
    const completedAppointments = patientAppointments.filter(a => a.status === 'completed');
    const upcomingAppointments = patientAppointments.filter(a => a.status === 'upcoming');

    return {
      totalAppointments: patientAppointments.length,
      completedAppointments: completedAppointments.length,
      upcomingAppointments: upcomingAppointments.length,
      lastVisit: completedAppointments.length > 0
        ? completedAppointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
        : null
    };
  };

  const getPatientDoctors = (patientId: string) => {
    const patientDoctorIds = new Set(
      appointments
        .filter(a => a.patientId === patientId)
        .map(a => a.doctorId)
    );

    return doctors.filter(d => patientDoctorIds.has(d.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Patient Records</h1>
          <p className="text-gray-600">View and manage patients who have visited your facility</p>
        </div>
        <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
          <DialogTrigger asChild>
            <Button>
              <User className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <PatientForm
              form={patientForm}
              setForm={setPatientForm}
              onSubmit={handleAddPatient}
              onCancel={() => setIsAddPatientOpen(false)}
              submitLabel="Add Patient"
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{hospitalPatients.length}</div>
            <p className="text-xs text-gray-600 mt-1">Registered patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Active Patients</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {hospitalPatients.filter(p => getPatientStats(p.id).upcomingAppointments > 0).length}
            </div>
            <p className="text-xs text-gray-600 mt-1">With upcoming appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {hospitalPatients.reduce((sum, p) => sum + getPatientStats(p.id).totalAppointments, 0)}
            </div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Avg Visits</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {hospitalPatients.length > 0
                ? Math.round(hospitalPatients.reduce((sum, p) => sum + getPatientStats(p.id).totalAppointments, 0) / hospitalPatients.length)
                : '0'
              }
            </div>
            <p className="text-xs text-gray-600 mt-1">Per patient</p>
          </CardContent>
        </Card>
      </div>

      {/* Patients List */}
      <Card>
        <CardHeader>
          <CardTitle>Patients ({hospitalPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hospitalPatients.length > 0 ? (
              hospitalPatients.map((patient) => {
                const stats = getPatientStats(patient.id);
                const patientDoctors = getPatientDoctors(patient.id);

                return (
                  <div key={patient.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{patient.name}</h4>
                          <Badge variant="outline">
                            {patient.age} years
                          </Badge>
                          <Badge variant="outline">
                            {patient.gender}
                          </Badge>
                          {patient.bloodGroup && (
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              {patient.bloodGroup}
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{patient.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{patient.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{patient.address}</span>
                          </div>
                          {patient.emergencyContact && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>Emergency: {patient.emergencyContact}</span>
                            </div>
                          )}
                        </div>

                        {/* Patient Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                          <div className="bg-blue-50 p-2 rounded text-center">
                            <div className="font-medium text-blue-600">{stats.totalAppointments}</div>
                            <div className="text-xs text-blue-500">Total Visits</div>
                          </div>
                          <div className="bg-green-50 p-2 rounded text-center">
                            <div className="font-medium text-green-600">{stats.completedAppointments}</div>
                            <div className="text-xs text-green-500">Completed</div>
                          </div>
                          <div className="bg-orange-50 p-2 rounded text-center">
                            <div className="font-medium text-orange-600">{stats.upcomingAppointments}</div>
                            <div className="text-xs text-orange-500">Upcoming</div>
                          </div>
                          <div className="bg-purple-50 p-2 rounded text-center">
                            <div className="font-medium text-purple-600">{patientDoctors.length}</div>
                            <div className="text-xs text-purple-500">Doctors</div>
                          </div>
                        </div>

                        {/* Medical Info */}
                        {((patient.allergies?.length ?? 0) > 0 || (patient.medicalHistory?.length ?? 0) > 0) && (
                          <div className="space-y-2 text-sm">
                            {(patient.allergies?.length ?? 0) > 0 && (
                              <div>
                                <strong className="text-red-600">Allergies:</strong> {patient.allergies?.join(', ')}
                              </div>
                            )}
                            {(patient.medicalHistory?.length ?? 0) > 0 && (
                              <div>
                                <strong className="text-blue-600">Medical History:</strong> {patient.medicalHistory?.join(', ')}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Last Visit */}
                        {stats.lastVisit && (
                          <div className="text-sm text-gray-500 mt-2">
                            Last visit: {stats.lastVisit}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedPatient(patient)}
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Patient Details - {patient.name}</DialogTitle>
                            </DialogHeader>
                            <PatientDetails
                              patient={patient}
                              stats={stats}
                              doctors={patientDoctors}
                              appointments={appointments.filter(a => a.patientId === patient.id)}
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No patients found.</p>
                <p className="text-sm text-gray-400 mt-2">Patients will appear here once they book appointments at your facility.</p>
                <Button className="mt-4" onClick={() => setIsAddPatientOpen(true)}>
                  <User className="h-4 w-4 mr-2" />
                  Add First Patient
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Patient Details Component
const PatientDetails = ({ patient, stats, doctors, appointments }) => {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>Name:</strong> {patient.name}</div>
            <div><strong>Age:</strong> {patient.age} years</div>
            <div><strong>Gender:</strong> {patient.gender}</div>
            <div><strong>Blood Group:</strong> {patient.bloodGroup || 'Not specified'}</div>
            <div><strong>Email:</strong> {patient.email}</div>
            <div><strong>Phone:</strong> {patient.phone}</div>
            <div className="col-span-2"><strong>Address:</strong> {patient.address}</div>
            {patient.emergencyContact && (
              <div className="col-span-2"><strong>Emergency Contact:</strong> {patient.emergencyContact}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patient.allergies?.length > 0 && (
              <div>
                <strong className="text-red-600">Allergies:</strong>
                <div className="mt-1 flex flex-wrap gap-1">
                  {patient.allergies.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="text-red-600 border-red-600">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {patient.medicalHistory?.length > 0 && (
              <div>
                <strong className="text-blue-600">Medical History:</strong>
                <div className="mt-1 flex flex-wrap gap-1">
                  {patient.medicalHistory.map((condition, index) => (
                    <Badge key={index} variant="outline" className="text-blue-600 border-blue-600">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(!patient.allergies?.length && !patient.medicalHistory?.length) && (
              <p className="text-gray-500">No medical history recorded.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Appointment History */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment History ({appointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {appointments.length > 0 ? (
              appointments
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((appointment) => (
                  <div key={appointment.id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{appointment.date} at {appointment.time}</div>
                        <div className="text-sm text-gray-600">
                          Dr. {doctors.find(d => d.id === appointment.doctorId)?.name || 'Unknown'}
                        </div>
                        {appointment.reason && (
                          <div className="text-sm text-gray-600">Reason: {appointment.reason}</div>
                        )}
                      </div>
                      <Badge variant={appointment.status === 'completed' ? 'default' : 'secondary'}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No appointments found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Patient Form Component
const PatientForm = ({ form, setForm, onSubmit, onCancel, submitLabel }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
          placeholder="John Doe"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
          placeholder="john@example.com"
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
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={form.age}
          onChange={(e) => setForm({...form, age: e.target.value})}
          placeholder="30"
        />
      </div>
      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select value={form.gender} onValueChange={(value: string) => setForm({...form, gender: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="bloodGroup">Blood Group</Label>
        <Select value={form.bloodGroup} onValueChange={(value: string) => setForm({...form, bloodGroup: value})}>
          <SelectTrigger>
            <SelectValue placeholder="Select blood group" />
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
      <div className="col-span-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={form.address}
          onChange={(e) => setForm({...form, address: e.target.value})}
          placeholder="Full address"
        />
      </div>
      <div>
        <Label htmlFor="emergencyContact">Emergency Contact</Label>
        <Input
          id="emergencyContact"
          value={form.emergencyContact}
          onChange={(e) => setForm({...form, emergencyContact: e.target.value})}
          placeholder="+91 9876543210"
        />
      </div>
      <div>
        <Label htmlFor="allergies">Allergies (comma-separated)</Label>
        <Input
          id="allergies"
          value={form.allergies}
          onChange={(e) => setForm({...form, allergies: e.target.value})}
          placeholder="Penicillin, Nuts, etc."
        />
      </div>
      <div className="col-span-2">
        <Label htmlFor="medicalHistory">Medical History (comma-separated)</Label>
        <Textarea
          id="medicalHistory"
          value={form.medicalHistory}
          onChange={(e) => setForm({...form, medicalHistory: e.target.value})}
          placeholder="Diabetes, Hypertension, etc."
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

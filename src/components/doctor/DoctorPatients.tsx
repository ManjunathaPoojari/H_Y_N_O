import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Users, Search, Calendar, FileText, MessageSquare, Video, Phone, Mail, MapPin, Clock, Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { appointmentAPI, patientAPI, chatAPI } from '../../lib/api-client';
import { toast } from 'sonner';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  medicalHistory: string[];
  allergies: string[];
  currentMedications: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  lastVisit: string;
  totalVisits: number;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  type: string;
  status: string;
  reason: string;
  appointmentDate: string;
  time: string;
  notes: string;
}

export const DoctorPatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (user?.id) {
      loadPatients();
    }
  }, [user]);

  const loadPatients = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      // Get all appointments for this doctor
      const appointmentsRes = await appointmentAPI.getByDoctor(user.id);

      // Get unique patients from appointments
      const uniquePatientIds = [...new Set(appointmentsRes.map(app => app.patientId))];
      const patientsRes = await Promise.all(
        uniquePatientIds.map(id => patientAPI.getById(id).catch(() => null))
      ).then(results => results.filter(p => p !== null));

      setAppointments(appointmentsRes);
      setPatients(patientsRes);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'recent') {
      const lastVisit = new Date(patient.lastVisit);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return matchesSearch && lastVisit >= thirtyDaysAgo;
    }
    if (activeTab === 'active') {
      return matchesSearch && patient.totalVisits > 0;
    }

    return matchesSearch;
  });

  const handleViewPatientDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleStartChat = async (patientId: string) => {
    try {
      toast.success('Opening chat...');
      // Find an appointment with this patient to create chat room
      const patientAppointment = appointments.find(app => app.patientId === patientId);
      if (patientAppointment) {
        await chatAPI.createChatRoom(patientAppointment.id);
      }
      window.location.href = 'http://localhost:3001/doctor/chat';
    } catch (error) {
      console.error('Error starting chat:', error);
      toast.error('Failed to start chat');
    }
  };

  const handleScheduleAppointment = (patientId: string) => {
    // Navigate to appointments page with patient pre-selected
    window.location.href = `/doctor/appointments?patientId=${patientId}`;
  };

  const handleAddNote = async () => {
    if (!selectedPatient || !noteText.trim()) return;

    try {
      // Find the latest appointment for this patient
      const patientAppointments = appointments.filter(app => app.patientId === selectedPatient.id);
      const latestAppointment = patientAppointments.sort((a, b) =>
        new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime()
      )[0];

      if (latestAppointment) {
        await appointmentAPI.update(latestAppointment.id, {
          notes: (latestAppointment.notes || '') + '\n\n' + new Date().toLocaleString() + ': ' + noteText
        });
        toast.success('Note added successfully');
        setNoteText('');
        setShowAddNote(false);
        loadPatients(); // Refresh data
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  };

  const getPatientStats = (patientId: string) => {
    const patientAppointments = appointments.filter(app => app.patientId === patientId);
    const completed = patientAppointments.filter(app => app.status === 'COMPLETED').length;
    const upcoming = patientAppointments.filter(app => app.status === 'UPCOMING').length;
    const lastVisit = patientAppointments
      .filter(app => app.status === 'COMPLETED')
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())[0];

    return {
      totalVisits: patientAppointments.length,
      completedVisits: completed,
      upcomingVisits: upcoming,
      lastVisitDate: lastVisit?.appointmentDate || 'Never'
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading patients...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">My Patients</h1>
          <p className="text-gray-600">Manage patient records and history</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Patients ({patients.length})</TabsTrigger>
          <TabsTrigger value="recent">Recent (30 days)</TabsTrigger>
          <TabsTrigger value="active">Active Patients</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid gap-4">
            {filteredPatients.map((patient) => {
              const stats = getPatientStats(patient.id);
              return (
                <Card key={patient.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{patient.name}</h3>
                          <Badge variant="secondary">{patient.gender}</Badge>
                          <Badge variant="outline">
                            {stats.totalVisits} visits
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            {patient.email}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            {patient.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            Last visit: {stats.lastVisitDate}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-600">✓ {stats.completedVisits} completed</span>
                          <span className="text-blue-600">○ {stats.upcomingVisits} upcoming</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewPatientDetails(patient)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartChat(patient.id)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleScheduleAppointment(patient.id)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredPatients.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No patients found</p>
                <p className="text-sm">Patients will appear here once they book appointments with you</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Patient Details Dialog */}
      <Dialog open={showPatientDetails} onOpenChange={setShowPatientDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Patient Details - {selectedPatient?.name}</DialogTitle>
          </DialogHeader>

          {selectedPatient && (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="text-sm text-gray-600">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm text-gray-600">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="text-sm text-gray-600">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <p className="text-sm text-gray-600">{selectedPatient.dateOfBirth}</p>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <p className="text-sm text-gray-600">{selectedPatient.gender}</p>
                  </div>
                  <div>
                    <Label>Address</Label>
                    <p className="text-sm text-gray-600">{selectedPatient.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Medical History */}
              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Medical History</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPatient.medicalHistory?.length > 0 ? (
                        selectedPatient.medicalHistory.map((condition, index) => (
                          <Badge key={index} variant="secondary">{condition}</Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No medical history recorded</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Allergies</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPatient.allergies?.length > 0 ? (
                        selectedPatient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive">{allergy}</Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No allergies recorded</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Current Medications</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedPatient.currentMedications?.length > 0 ? (
                        selectedPatient.currentMedications.map((medication, index) => (
                          <Badge key={index} variant="outline">{medication}</Badge>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500">No current medications</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Name</Label>
                    <p className="text-sm text-gray-600">{selectedPatient.emergencyContact?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="text-sm text-gray-600">{selectedPatient.emergencyContact?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label>Relationship</Label>
                    <p className="text-sm text-gray-600">{selectedPatient.emergencyContact?.relationship || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Appointments */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Appointments</CardTitle>
                  <Button size="sm" onClick={() => setShowAddNote(true)}>
                    Add Note
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appointments
                      .filter(app => app.patientId === selectedPatient.id)
                      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
                      .slice(0, 5)
                      .map((appointment) => (
                        <div key={appointment.id} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary">{appointment.type}</Badge>
                                <Badge variant={appointment.status === 'COMPLETED' ? 'default' : 'outline'}>
                                  {appointment.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{appointment.reason}</p>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                              <p>{appointment.appointmentDate}</p>
                              <p>{appointment.time}</p>
                            </div>
                          </div>
                          {appointment.notes && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                              <p className="text-gray-700">{appointment.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPatientDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Note Dialog */}
      <Dialog open={showAddNote} onOpenChange={setShowAddNote}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note for {selectedPatient?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Note</Label>
              <Textarea
                placeholder="Enter your note here..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddNote(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote}>
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

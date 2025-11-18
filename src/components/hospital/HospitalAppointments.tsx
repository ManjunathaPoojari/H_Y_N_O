import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Video, MessageSquare, MapPin, Building2 } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { toast } from 'sonner';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { appointmentAPI } from '../../lib/api-client';
import { Appointment } from '../../types';

export const HospitalAppointments = () => {
  const { appointments, updateAppointment, doctors } = useAppStore();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [notes, setNotes] = useState('');

  // Filter appointments for current hospital (hardcoded as H001 for demo)
  const hospitalAppointments = appointments.filter(a => a.hospitalId === 'H001');

  const getAppointmentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'chat': return <MessageSquare className="h-4 w-4" />;
      case 'inperson': return <MapPin className="h-4 w-4" />;
      case 'hospital': return <Building2 className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
    switch (status) {
      case 'booked': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleApproveAppointment = async (appointmentId: string) => {
    try {
      await appointmentAPI.update(appointmentId, { status: 'booked' });
      updateAppointment(appointmentId, { status: 'booked' });
      toast.success('Appointment approved successfully!');
    } catch (error) {
      toast.error('Failed to approve appointment. Please try again.');
      console.error('Error approving appointment:', error);
    }
  };

  const handleRejectAppointment = async (appointmentId: string) => {
    try {
      await appointmentAPI.update(appointmentId, { status: 'cancelled' });
      updateAppointment(appointmentId, { status: 'cancelled' });
      toast.success('Appointment rejected.');
    } catch (error) {
      toast.error('Failed to reject appointment. Please try again.');
      console.error('Error rejecting appointment:', error);
    }
  };

  const handleCompleteAppointment = async () => {
    if (!selectedAppointment) return;

    try {
      await appointmentAPI.complete(selectedAppointment.id, notes);
      updateAppointment(selectedAppointment.id, { status: 'completed', notes });
      toast.success('Appointment marked as completed!');
      setSelectedAppointment(null);
      setNotes('');
    } catch (error) {
      toast.error('Failed to complete appointment. Please try again.');
      console.error('Error completing appointment:', error);
    }
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  const upcomingAppointments = hospitalAppointments.filter(a => a.status === 'booked');
  const pendingAppointments = hospitalAppointments.filter(a => a.status === 'pending');
  const completedAppointments = hospitalAppointments.filter(a => a.status === 'completed');
  const cancelledAppointments = hospitalAppointments.filter(a => a.status === 'cancelled');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Appointments Management</h1>
        <p className="text-gray-600">Manage hospital appointments and consultations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{hospitalAppointments.length}</div>
            <p className="text-xs text-gray-600 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{upcomingAppointments.length}</div>
            <p className="text-xs text-gray-600 mt-1">Scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Pending Approval</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{pendingAppointments.length}</div>
            <p className="text-xs text-gray-600 mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{completedAppointments.length}</div>
            <p className="text-xs text-gray-600 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>All Appointments ({hospitalAppointments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hospitalAppointments.length > 0 ? (
              hospitalAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{appointment.patientName}</h4>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status || 'Unknown'}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          {getAppointmentTypeIcon(appointment.type)}
                          <span className="capitalize">{appointment.type}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Dr. {getDoctorName(appointment.doctorId || '')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>

                      {appointment.reason && (
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Reason:</strong> {appointment.reason}
                        </p>
                      )}

                      {appointment.notes && (
                        <p className="text-sm text-gray-600">
                          <strong>Notes:</strong> {appointment.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {appointment.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveAppointment(appointment.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleRejectAppointment(appointment.id)}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}

                      {appointment.status === 'booked' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setSelectedAppointment(appointment)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Complete Appointment</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="notes">Appointment Notes</Label>
                                <Textarea
                                  id="notes"
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                  placeholder="Add notes about the appointment..."
                                  rows={4}
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleCompleteAppointment}>
                                  Mark as Completed
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      {appointment.status === 'completed' && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Completed
                        </Badge>
                      )}

                      {appointment.status === 'cancelled' && (
                        <Badge variant="outline" className="text-red-600 border-red-600">
                          Cancelled
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No appointments found.</p>
                <p className="text-sm text-gray-400 mt-2">Appointments will appear here once patients book them.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

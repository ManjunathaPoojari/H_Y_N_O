import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Users, Video, MessageSquare, Clock, FileText, Loader2, CheckCircle, XCircle, Edit } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { appointmentAPI, chatAPI } from '../../lib/api-client';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  type: string;
  status: string;
  reason: string;
  appointmentDate: string;
  time: string;
  notes?: string;
  prescription?: string;
}

export const DoctorAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const appointmentsRes = await appointmentAPI.getByDoctor(user.id);
      setAppointments(appointmentsRes);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStartVideo = async (appointmentId: string) => {
    try {
      toast.success('Starting video consultation...');
      await chatAPI.createChatRoom(appointmentId);
      setTimeout(() => {
        window.open('https://meet.google.com/new', '_blank');
      }, 1000);
    } catch (error) {
      console.error('Error starting video call:', error);
      toast.error('Failed to start video call');
    }
  };

  const handleStartChat = async (appointmentId: string) => {
    try {
      toast.success('Opening chat window...');
      await chatAPI.createChatRoom(appointmentId);
      // Navigate to chat with appointment ID to select the correct chat room
      window.location.href = `/doctor/chat?appointmentId=${appointmentId}`;
    } catch (error) {
      console.error('Error opening chat:', error);
      toast.error('Failed to open chat');
    }
  };

  const handleApproveAppointment = async (appointmentId: string) => {
    try {
      await appointmentAPI.confirmAppointment(appointmentId);
      toast.success('Appointment approved');
      loadAppointments();
      // Dispatch custom event to notify dashboard to refresh
      window.dispatchEvent(new CustomEvent('appointmentUpdated'));
    } catch (error: any) {
      console.error('Error approving appointment:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to approve appointment';
      toast.error(errorMessage);
    }
  };

  const handleRejectAppointment = async (appointmentId: string) => {
    try {
      await appointmentAPI.cancel(appointmentId);
      toast.success('Appointment rejected');
      loadAppointments();
      // Dispatch custom event to notify dashboard to refresh
      window.dispatchEvent(new CustomEvent('appointmentUpdated'));
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast.error('Failed to reject appointment');
    }
  };

  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      await appointmentAPI.complete(appointmentId, '');
      toast.success('Appointment completed');
      loadAppointments();
      // Dispatch custom event to notify dashboard to refresh
      window.dispatchEvent(new CustomEvent('appointmentUpdated'));
      // Dispatch custom event to notify dashboard to refresh completedToday count
      window.dispatchEvent(new CustomEvent('appointmentCompleted'));
    } catch (error) {
      console.error('Error completing appointment:', error);
      toast.error('Failed to complete appointment');
    }
  };

  const handleRescheduleAppointment = async () => {
    if (!selectedAppointment || !newDate || !newTime) return;

    try {
      await appointmentAPI.reschedule(selectedAppointment.id, newDate, newTime);
      toast.success('Appointment rescheduled');
      setIsRescheduleOpen(false);
      setSelectedAppointment(null);
      setNewDate('');
      setNewTime('');
      loadAppointments();
      // Dispatch custom event to notify dashboard to refresh
      window.dispatchEvent(new CustomEvent('appointmentUpdated'));
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      toast.error('Failed to reschedule appointment');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return <Badge variant="default">Upcoming</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading appointments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Appointments Management</h1>
        <p className="text-gray-600">Manage all your patient appointments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No appointments found</p>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{appointment.patientName}</h4>
                        <Badge variant="secondary" className="capitalize">
                          {appointment.type}
                        </Badge>
                        {getStatusBadge(appointment.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{appointment.reason}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {appointment.appointmentDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.time}
                        </span>
                        <span>Patient ID: {appointment.patientId}</span>
                      </div>
                      {appointment.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          <strong>Notes:</strong> {appointment.notes}
                        </p>
                      )}
                      {appointment.prescription && (
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Prescription:</strong> {appointment.prescription}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {appointment.type === 'video' && appointment.status.toLowerCase() === 'upcoming' && (
                      <Button size="sm" onClick={() => handleStartVideo(appointment.id)}>
                        <Video className="h-4 w-4 mr-2" />
                        Start Video
                      </Button>
                    )}
                    {appointment.type === 'chat' && appointment.status.toLowerCase() === 'upcoming' && (
                      <Button size="sm" onClick={() => handleStartChat(appointment.id)}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Start Chat
                      </Button>
                    )}
                    {appointment.status.toLowerCase() === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApproveAppointment(appointment.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectAppointment(appointment.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    {appointment.status.toLowerCase() === 'upcoming' && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteAppointment(appointment.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete
                      </Button>
                    )}
                    <Dialog open={isRescheduleOpen && selectedAppointment?.id === appointment.id} onOpenChange={setIsRescheduleOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setNewDate(appointment.appointmentDate);
                            setNewTime(appointment.time);
                            setIsRescheduleOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Reschedule
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reschedule Appointment</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="newDate">New Date</Label>
                            <Input
                              id="newDate"
                              type="date"
                              value={newDate}
                              onChange={(e) => setNewDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="newTime">New Time</Label>
                            <Input
                              id="newTime"
                              type="time"
                              value={newTime}
                              onChange={(e) => setNewTime(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button onClick={handleRescheduleAppointment}>Reschedule</Button>
                            <Button variant="outline" onClick={() => setIsRescheduleOpen(false)}>Cancel</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

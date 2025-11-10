import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calendar, Clock, Video, MessageSquare, MapPin, Building2, FileText } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { toast } from 'sonner';
import { Appointment } from '../../types';

export const MyAppointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const { appointments, cancelAppointment, rescheduleAppointment } = useAppStore();
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');

  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const upcomingAppointments = appointments.filter(a => a.status === 'booked');
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled');

  const handleCancel = (id: string) => {
    cancelAppointment(id);
  };

  const handleReschedule = () => {
    if (!rescheduleDate || !rescheduleTime) {
      toast.error('Please select date and time');
      return;
    }
    rescheduleAppointment(selectedAppointment, rescheduleDate, rescheduleTime);
    setRescheduleDate('');
    setRescheduleTime('');
    setSelectedAppointment('');
  };

  const handleJoinVideo = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to join the video call?')) {
      toast.success('Connecting to video call...');
      setTimeout(() => {
        // Navigate to video call page with appointment ID
        window.location.href = `/video-call?appointmentId=${appointmentId}`;
      }, 1000);
    }
  };

  const handleStartChat = (appointmentId: string) => {
    toast.success('Opening chat...');
    // Navigate to chat with appointment ID to select the correct chat room
    window.location.href = `http://localhost:3001/patient/chat?appointmentId=${appointmentId}`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4" />;
      case 'inperson':
        return <MapPin className="h-4 w-4" />;
      case 'hospital':
        return <Building2 className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const renderAppointmentCard = (appointment: Appointment) => (
    <Card key={appointment.id}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4>{appointment.doctorName}</h4>
              <Badge variant="secondary" className="capitalize flex items-center gap-1">
                {getIcon(appointment.type)}
                {appointment.type}
              </Badge>
              <Badge variant={appointment.status === 'booked' ? 'default' :
                             appointment.status === 'completed' ? 'secondary' :
                             'destructive'}>
                {appointment.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-2">{appointment.reason}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {appointment.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {appointment.time}
              </span>
              {appointment.hospitalId && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  Hospital Visit
                </span>
              )}
            </div>
            {appointment.notes && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{appointment.notes}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          {appointment.status === 'pending' && (
            <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
              <strong>Waiting for doctor approval</strong> - Your appointment is pending confirmation from the doctor.
            </div>
          )}

          {appointment.status === 'booked' && (
            <>
              {appointment.type === 'video' && (
                <Button size="sm" onClick={() => handleJoinVideo(appointment.id)}>
                  <Video className="h-4 w-4 mr-2" />
                  Join Video Call
                </Button>
              )}
              {appointment.type === 'video' && appointment.status === 'booked' && (
                <Button size="sm" variant="outline" onClick={() => {
                  if (window.confirm('Are you sure you want to reschedule this appointment?')) {
                    // Handle reschedule logic here
                    toast.success('Reschedule functionality coming soon');
                  }
                }}>
                  Reschedule
                </Button>
              )}
              {appointment.type === 'chat' && (
                <Button size="sm" onClick={() => handleStartChat(appointment.id)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" onClick={() => setSelectedAppointment(appointment.id)}>
                    Reschedule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reschedule Appointment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>New Date</Label>
                      <Input
                        type="date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>New Time</Label>
                      <Input
                        type="time"
                        value={rescheduleTime}
                        onChange={(e) => setRescheduleTime(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleReschedule}>Confirm Reschedule</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button size="sm" variant="outline" className="text-red-600" onClick={() => {
                if (window.confirm('Are you sure you want to cancel this appointment?')) {
                  handleCancel(appointment.id);
                }
              }}>
                Cancel
              </Button>
            </>
          )}
          
          {appointment.status === 'completed' && (
            <>
              <Button size="sm" variant="outline" onClick={() => {
                if (window.confirm('Are you sure you want to view the prescription?')) {
                  toast.success('Opening prescription...');
                }
              }}>
                <FileText className="h-4 w-4 mr-2" />
                View Prescription
              </Button>
              <Button size="sm" variant="outline" onClick={() => {
                if (window.confirm('Are you sure you want to download the report?')) {
                  toast.success('Downloading report...');
                }
              }}>
                Download Report
              </Button>
              <Button size="sm" onClick={() => {
                if (window.confirm('Are you sure you want to book a follow-up appointment?')) {
                  toast.success('Redirecting to book follow-up...');
                }
              }}>
                Book Follow-up
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">My Appointments</h1>
        <p className="text-gray-600">View and manage your appointments</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            History ({completedAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingAppointments.length > 0 ? (
            pendingAppointments.map(renderAppointmentCard)
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No pending appointments
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(renderAppointmentCard)
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No upcoming appointments
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedAppointments.length > 0 ? (
            completedAppointments.map(renderAppointmentCard)
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No completed appointments
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledAppointments.length > 0 ? (
            cancelledAppointments.map(renderAppointmentCard)
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No cancelled appointments
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

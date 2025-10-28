import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Users, Video, MessageSquare, Clock, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { appointmentAPI, doctorAPI, patientAPI, chatAPI } from '../../lib/api-client';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  type: string;
  status: string;
  reason: string;
  appointmentDate: string;
  time: string;
}

interface Patient {
  id: string;
  name: string;
}

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    pendingRequests: 0,
    completedToday: 0,
  });

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }

    // Listen for appointment updates from other components
    const handleAppointmentUpdate = () => {
      if (user?.id) {
        loadDashboardData();
      }
    };

    const handleAppointmentCompleted = () => {
      if (user?.id) {
        loadDashboardData();
      }
    };

    window.addEventListener('appointmentUpdated', handleAppointmentUpdate);
    window.addEventListener('appointmentCompleted', handleAppointmentCompleted);

    return () => {
      window.removeEventListener('appointmentUpdated', handleAppointmentUpdate);
      window.removeEventListener('appointmentCompleted', handleAppointmentCompleted);
    };
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const appointmentsRes = await appointmentAPI.getByDoctor(user.id);

      // Get unique patients from appointments
      const uniquePatientIds = [...new Set(appointmentsRes.map(app => app.patientId))];
      const patientsRes = await Promise.all(
        uniquePatientIds.map(id => patientAPI.getById(id).catch(() => null))
      ).then(results => results.filter(p => p !== null));

      setAppointments(appointmentsRes);
      setPatients(patientsRes);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const todayApps = appointmentsRes.filter(app =>
        app.appointmentDate === today && app.status === 'UPCOMING'
      );
      const completedToday = appointmentsRes.filter(app =>
        app.appointmentDate === today && app.status === 'COMPLETED'
      );
      const pendingRequests = appointmentsRes.filter(app =>
        app.status === 'PENDING'
      );

      setStats({
        todayAppointments: todayApps.length,
        totalPatients: patientsRes.length,
        pendingRequests: pendingRequests.length,
        completedToday: completedToday.length,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const todayAppointments = appointments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.appointmentDate === today && a.status === 'UPCOMING';
  }).slice(0, 4);

  const handleStartVideo = async (appointmentId: string) => {
    try {
      toast.success('Starting video consultation...');
      // Create chat room if it doesn't exist
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
      // Create chat room if it doesn't exist
      await chatAPI.createChatRoom(appointmentId);
      // Navigate to chat or open chat interface
      window.location.href = '/doctor/chat';
    } catch (error) {
      console.error('Error opening chat:', error);
      toast.error('Failed to open chat');
    }
  };

  const handleViewPatientHistory = (patientId: string) => {
    // Navigate to patient profile page which should show history
    window.location.href = `/doctor/patients?patientId=${patientId}`;
  };

  const handleAddNotes = (appointmentId: string) => {
    // For now, show a toast - could be expanded to a modal or separate page
    toast.info('Notes functionality will be implemented soon');
  };

  const handleApproveAppointment = async (appointmentId: string) => {
    try {
      await appointmentAPI.update(appointmentId, { status: 'UPCOMING' });
      toast.success('Appointment approved');
      loadDashboardData(); // Refresh data
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
      loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast.error('Failed to reject appointment');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Welcome, Dr. {user?.name || 'Doctor'}</h1>
        <p className="text-gray-600">Today's Schedule</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.todayAppointments}</div>
            <p className="text-xs text-gray-600 mt-1">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalPatients}</div>
            <p className="text-xs text-gray-600 mt-1">Under your care</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.pendingRequests}</div>
            <p className="text-xs text-gray-600 mt-1">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Completed Today</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.completedToday}</div>
            <p className="text-xs text-gray-600 mt-1">Consultations done</p>
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
            <Button
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => window.open('https://meet.google.com/new', '_blank')}
            >
              <Video className="h-5 w-5" />
              <span className="text-sm">Start Video Call</span>
            </Button>
            <Button
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => window.location.href = '/doctor/chat'}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm">Open Chat</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => window.location.href = '/doctor/patients'}
            >
              <Users className="h-5 w-5" />
              <span className="text-sm">View Patients</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => window.location.href = '/doctor/schedule'}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-sm">Manage Schedule</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Today's Appointments</CardTitle>
          <Button variant="outline" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4>{appointment.patientName}</h4>
                      <Badge variant="secondary" className="capitalize">
                        {appointment.type}
                      </Badge>
                      <Badge variant={appointment.status === 'upcoming' ? 'default' : 'outline'}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{appointment.reason}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {appointment.time}
                      </span>
                      <span>Patient ID: {appointment.patientId}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {appointment.type === 'video' && (
                    <Button size="sm" onClick={handleStartVideo}>
                      <Video className="h-4 w-4 mr-2" />
                      Start Video
                    </Button>
                  )}
                  {appointment.type === 'chat' && (
                    <Button size="sm" onClick={handleStartChat}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Start Chat
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleViewPatientHistory(appointment.patientId)}>
                    View Patient History
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAddNotes(appointment.id)}>
                    Add Notes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Appointment Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments.filter(a => a.status === 'PENDING').slice(0, 2).map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-sm">{appointment.patientName}</h4>
                      <p className="text-xs text-gray-600">{appointment.reason}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Requested: {appointment.appointmentDate} {appointment.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleApproveAppointment(appointment.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleRejectAppointment(appointment.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
              {appointments.filter(a => a.status === 'PENDING').length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No pending requests</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Patient Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm">
                      {appointment.status === 'COMPLETED' ? 'Consultation completed' :
                       appointment.status === 'UPCOMING' ? 'Upcoming appointment' :
                       'Appointment requested'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {appointment.patientName} • {appointment.appointmentDate}
                    </p>
                  </div>
                </div>
              ))}
              {appointments.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

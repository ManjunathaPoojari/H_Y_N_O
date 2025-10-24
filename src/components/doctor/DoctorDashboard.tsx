import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Users, Video, MessageSquare, Clock, FileText } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { toast } from 'sonner';

export const DoctorDashboard = () => {
  const { appointments, patients, updateAppointment } = useAppStore();
  const todayAppointments = appointments.filter(a => a.status === 'upcoming').slice(0, 4);
  const stats = {
    todayAppointments: todayAppointments.length,
    totalPatients: patients.length,
    pendingRequests: 2,
    completedToday: 3,
  };

  const handleStartVideo = () => {
    toast.success('Starting video consultation...');
    setTimeout(() => {
      window.open('https://meet.google.com/new', '_blank');
    }, 1000);
  };

  const handleStartChat = () => {
    toast.success('Opening chat window...');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Welcome, Dr. Priya Patel</h1>
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
            <Button className="h-auto py-4 flex flex-col gap-2">
              <Video className="h-5 w-5" />
              <span className="text-sm">Start Video Call</span>
            </Button>
            <Button className="h-auto py-4 flex flex-col gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="text-sm">Open Chat</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">View Patients</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
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
                  <Button size="sm" variant="outline" onClick={() => toast.success('Opening patient history...')}>
                    View Patient History
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success('Opening notes editor...')}>
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
              <div className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm">Vikram Singh</h4>
                    <p className="text-xs text-gray-600">Knee pain consultation</p>
                    <p className="text-xs text-gray-500 mt-1">Requested: Oct 16, 09:00 AM</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1">Approve</Button>
                  <Button size="sm" variant="outline" className="flex-1">Reject</Button>
                </div>
              </div>

              <div className="border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm">Anita Desai</h4>
                    <p className="text-xs text-gray-600">Follow-up consultation</p>
                    <p className="text-xs text-gray-500 mt-1">Requested: Oct 17, 02:00 PM</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" className="flex-1">Approve</Button>
                  <Button size="sm" variant="outline" className="flex-1">Reject</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Patient Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 pb-3 border-b">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">Lab report uploaded</p>
                  <p className="text-xs text-gray-500">Rahul Sharma • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b">
                <MessageSquare className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">New message received</p>
                  <p className="text-xs text-gray-500">Anita Desai • 4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm">Appointment rescheduled</p>
                  <p className="text-xs text-gray-500">Vikram Singh • Yesterday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

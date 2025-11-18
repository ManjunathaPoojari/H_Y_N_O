import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Video, MessageSquare, MapPin, FileText, Clock, User, Hospital, Activity, Heart, Stethoscope, Pill, Dumbbell, ChevronRight } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { useAuth } from '../../lib/auth-context';

interface PatientDashboardProps {
  onNavigate: (path: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigate }) => {
  const { appointments } = useAppStore();
  const { user } = useAuth();

  const upcomingAppointments = appointments.filter(a => a.status === 'booked').slice(0, 3);
  const recentReports = [
    { id: 1, name: 'Blood Test Report', date: '2025-10-12', type: 'Lab Report' },
    { id: 2, name: 'X-Ray Chest', date: '2025-10-08', type: 'Radiology' },
  ];

  const quickActions = [
    {
      icon: Video,
      label: 'Video Consultation',
      description: 'Connect with doctor remotely',
      path: '/patient/book/video',
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      icon: MessageSquare,
      label: 'Chat Consultation',
      description: 'Text-based medical advice',
      path: '/patient/book/chat',
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      icon: MapPin,
      label: 'In-Person Visit',
      description: 'Visit clinic or hospital',
      path: '/patient/book/inperson',
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      icon: Hospital,
      label: 'Emergency Care',
      description: 'Immediate medical attention',
      path: '/patient/book/hospital',
      color: 'bg-red-50 hover:bg-red-100 border-red-200',
      iconColor: 'text-red-600'
    }
  ];

  const healthServices = [
    {
      icon: Pill,
      label: 'Online Pharmacy',
      description: 'Order medications online',
      path: '/patient/pharmacy',
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      icon: Heart,
      label: 'Nutrition & Diet',
      description: 'Personalized diet plans',
      path: '/patient/nutrition',
      color: 'bg-pink-50 hover:bg-pink-100 border-pink-200',
      iconColor: 'text-pink-600'
    },
    {
      icon: Dumbbell,
      label: 'Yoga & Fitness',
      description: 'Wellness and exercise programs',
      path: '/patient/yoga',
      color: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
      iconColor: 'text-indigo-600'
    },
    {
      icon: FileText,
      label: 'Medical Reports',
      description: 'View test results & reports',
      path: '/patient/reports',
      color: 'bg-teal-50 hover:bg-teal-100 border-teal-200',
      iconColor: 'text-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name || 'Patient'}!
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                Your health dashboard overview
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">All Systems Healthy</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Patient ID</CardTitle>
              <User className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">{user?.id || 'P001'}</div>
              <p className="text-xs text-gray-500">Your unique health identifier</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">{upcomingAppointments.length}</div>
              <p className="text-xs text-gray-500">Scheduled consultations</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Medical Reports</CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">{recentReports.length}</div>
              <p className="text-xs text-gray-500">Available test results</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-blue-600" />
              Book Consultation
            </CardTitle>
            <p className="text-sm text-gray-600">Choose your preferred consultation method</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(action.path)}
                  className={`group p-6 rounded-lg border transition-all duration-200 hover:shadow-md ${action.color}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-white shadow-sm group-hover:scale-110 transition-transform ${action.iconColor}`}>
                      <action.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-gray-900 mb-1">{action.label}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{appointment.doctorName}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Clock className="h-3 w-3" />
                            <span>{appointment.date} at {appointment.time}</span>
                          </div>
                          <Badge variant={appointment.type === 'video' ? 'default' : 'secondary'} className="text-xs">
                            {appointment.type}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{appointment.reason}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => onNavigate('/patient/appointments')}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No upcoming appointments</p>
                  <Button onClick={() => onNavigate('/patient/book/video')}>
                    Book Your First Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Services */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Health Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {healthServices.map((service, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigate(service.path)}
                    className={`group w-full p-4 rounded-lg border transition-all duration-200 hover:shadow-sm ${service.color}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg bg-white shadow-sm ${service.iconColor}`}>
                        <service.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-medium text-gray-900">{service.label}</h4>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity / Quick Access */}
        <Card className="mt-8 border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-sm text-gray-600">Your latest health-related activities</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{report.name}</h4>
                      <p className="text-sm text-gray-600">{report.type} • {report.date}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => onNavigate('/patient/reports')}>
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -20px) scale(1.1); }
            50% { transform: translate(-20px, 20px) scale(0.9); }
            75% { transform: translate(20px, 20px) scale(1.05); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
        `}</style>
      </div>
    </div>
  );
};

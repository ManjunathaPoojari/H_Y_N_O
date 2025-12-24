import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Activity,
  AlertCircle,
  Apple,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  HeartPulse,
  MapPin,
  MessageSquare,
  Phone,
  Pill,
  Stethoscope,
  User,
  Video,
  Ambulance,
  Shield,
} from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { useAuth } from '../../lib/auth-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from 'sonner';

interface PatientDashboardProps {
  onNavigate: (path: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigate }) => {
  const { appointments, carePlanTasks, createEmergencyRequest } = useAppStore();
  const { user } = useAuth();
  const [unreadMessages, setUnreadMessages] = React.useState(3);
  const [pendingReports, setPendingReports] = React.useState(2);

  const upcomingAppointments = appointments.filter((a) => a.status === 'booked').slice(0, 4);
  const totalCareTasks = carePlanTasks.length;
  const completedCareTasks = carePlanTasks.filter(t => t.status === 'completed').length;
  const pendingCareTasks = totalCareTasks - completedCareTasks;

  // Auto-refresh metrics every 1 second
  React.useEffect(() => {
    const fetchMetrics = () => {
      // Simulate fetching metrics - in real app, call API
      setUnreadMessages(Math.floor(Math.random() * 5));
      setPendingReports(Math.floor(Math.random() * 3));
    };

    fetchMetrics();
    const intervalId = setInterval(fetchMetrics, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const recentReports = [
    { id: 1, name: 'Comprehensive Blood Test', date: '12 Nov 2025', type: 'Lab Report' },
    { id: 2, name: 'Chest X-Ray', date: '08 Nov 2025', type: 'Radiology' },
  ];

  const quickStats = [
    {
      title: 'Upcoming visits',
      value: upcomingAppointments.length,
      helper: upcomingAppointments[0] ? `Next with ${upcomingAppointments[0].doctorName}` : 'No visits planned',
      icon: Calendar,
      path: '/patient/appointments'
    },
    {
      title: 'Care plan',
      value: `${totalCareTasks} tasks`,
      helper: `${completedCareTasks} completed today`,
      icon: CheckCircle2,
      path: '/patient/care-plan'
    },
    {
      title: 'Reports',
      value: recentReports.length,
      helper: 'Latest results are ready',
      icon: FileText,
      path: '/patient/reports'
    },
  ];

  const careReminders = [
    { title: 'Morning medication', detail: 'Taken at 8:00 AM', status: 'Done' },
    { title: 'Hydration goal', detail: '2.5L daily • 60% complete', status: 'In progress' },
    { title: 'Daily movement', detail: 'Walk 4,000 steps • 2,750 done', status: 'In progress' },
  ];

  const wellnessHighlights = [
    {
      title: 'Sleep quality',
      value: '7h 45m',
      detail: 'Consistent bedtime',
      icon: Activity,
    },
    {
      title: 'Heart health',
      value: '72 bpm',
      detail: 'Resting average today',
      icon: HeartPulse,
    },
    {
      title: 'Nutrition',
      value: 'Balanced',
      detail: 'Protein-rich meals logged',
      icon: Apple,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Daily summary</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {(() => {
              const hour = new Date().getHours();
              if (hour < 12) return 'Good morning';
              if (hour < 17) return 'Good afternoon';
              return 'Good evening';
            })()}, {user?.name || 'Patient'}
            <Badge variant="outline" className="ml-3 font-mono text-sm font-normal align-middle">
              {user?.id}
            </Badge>
          </h1>
          <p className="text-muted-foreground mt-2">
            Your latest appointments, care tasks, and wellness updates are ready.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="destructive"
            className="animate-pulse shadow-lg shadow-red-500/20"
            onClick={() => {
              createEmergencyRequest({
                patientId: user?.id || 'P-GUEST',
                patientName: user?.name || 'Current User',
                patientPhone: user?.phone || 'Not Provided',
                patientLocation: 'Home (Dashboard)',
                emergencyType: 'medical',
                severity: 'critical',
                symptoms: 'Emergency SOS triggered from Dashboard',
                description: 'Emergency SOS triggered from Patient Dashboard'
              });
            }}
          >
            <Shield className="mr-2 h-4 w-4" />
            Emergency SOS
          </Button>
          <Button variant="outline" onClick={() => onNavigate('/patient/book/video')}>
            <Video className="h-4 w-4" />
            Book visit
          </Button>
          <Button variant="outline" onClick={() => onNavigate('/patient/reports')}>
            <FileText className="h-4 w-4" />
            View reports
          </Button>
        </div>


      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {quickStats.map((stat) => (
          <Card
            key={stat.title}
            className="h-full border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => onNavigate(stat.path)}
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
                <p className="text-3xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="rounded-full bg-slate-100 p-2 text-slate-600">
                  <stat.icon className="h-4 w-4" />
                </div>

              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500">{stat.helper}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming appointments</CardTitle>
              <CardDescription>Your next confirmed visits</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('/patient/appointments')}>
              View all
            </Button>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-slate-300" />
                <p className="mt-4 text-sm text-muted-foreground">No visits scheduled yet.</p>
                <Button className="mt-4" onClick={() => onNavigate('/patient/book/video')}>
                  Schedule visit
                </Button>
              </div>
            )}
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{appointment.doctorName}</p>
                        <span className="text-xs text-slate-400 font-mono">#{appointment.id}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {appointment.type}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      {appointment.date} • {appointment.time}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-slate-400" />
                      Hybrid care
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Care reminders</CardTitle>
            <CardDescription>Keep up with the essentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {careReminders.map((reminder) => (
              <div
                key={reminder.title}
                className="rounded-lg border border-slate-200 p-4 text-sm"
              >
                <p className="font-medium text-slate-900">{reminder.title}</p>
                <p className="mt-1 text-muted-foreground">{reminder.detail}</p>
                <Badge variant="outline" className="mt-3">
                  {reminder.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
            <CardDescription>Access your most-used tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: Video, label: 'Video consultation', path: '/patient/book/video' },
              { icon: MessageSquare, label: 'Chat with doctor', path: '/patient/book/chat' },
              { icon: MapPin, label: 'In-person visit', path: '/patient/book/inperson' },
              { icon: Pill, label: 'Pharmacy orders', path: '/patient/pharmacy' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => onNavigate(action.path)}
                className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-slate-50"
              >
                <span className="rounded-full bg-slate-100 p-2 text-slate-600">
                  <action.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-slate-900">{action.label}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Wellness highlights</CardTitle>
            <CardDescription>Updated every 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {wellnessHighlights.map((highlight) => (
              <div key={highlight.title} className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{highlight.title}</p>
                  <p className="text-xl font-semibold text-slate-900">{highlight.value}</p>
                  <p className="text-xs text-slate-500">{highlight.detail}</p>
                </div>
                <span className="rounded-full bg-slate-100 p-3 text-slate-600">
                  <highlight.icon className="h-5 w-5" />
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

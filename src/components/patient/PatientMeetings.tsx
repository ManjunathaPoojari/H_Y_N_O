import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Video, Calendar, Clock, MessageSquare, Play, Users } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { useAppStore } from '../../lib/app-store';
import { appointmentAPI, chatAPI } from '../../lib/api-client';
import { toast } from 'sonner';

interface PatientMeeting {
  id: string;
  appointmentId: string;
  doctorName: string;
  doctorId: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  meetingType: 'video' | 'audio';
  meetingUrl?: string;
  notes: string;
  recordingUrl?: string;
}

export const PatientMeetings = () => {
  const { user } = useAuth();
  const { appointments, doctors } = useAppStore();
  const [meetings, setMeetings] = useState<PatientMeeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id && appointments.length > 0) {
      loadMeetings();
    }
  }, [user, appointments]);

  const loadMeetings = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      // Get video appointments for this patient
      const patientAppointments = appointments.filter(
        app => app.patientId === user.id && app.type === 'video'
      );

      // Convert appointments to meetings
      const meetingsData: PatientMeeting[] = patientAppointments.map(app => {
        return {
          id: `meeting-${app.id}`,
          appointmentId: app.id,
          doctorName: app.doctorName || 'Doctor',
          doctorId: app.doctorId,
          scheduledDate: app.date,
          scheduledTime: app.time,
          duration: 30, // Default 30 minutes
          status: app.status === 'upcoming' ? 'scheduled' :
                  app.status === 'completed' ? 'completed' : 'cancelled',
          meetingType: 'video',
          meetingUrl: `https://meet.google.com/${app.id}`,
          notes: app.notes || '',
          recordingUrl: undefined
        };
      });

      setMeetings(meetingsData);
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinMeeting = (meeting: PatientMeeting) => {
    if (meeting.meetingUrl) {
      window.open(meeting.meetingUrl, '_blank');
      toast.success('Opening meeting in new tab');
    } else {
      toast.error('Meeting URL not available');
    }
  };

  const handleOpenChat = async (meeting: PatientMeeting) => {
    try {
      await chatAPI.createChatRoom(meeting.appointmentId);
      window.location.href = 'http://localhost:3001/patient/chat?appointmentId=' + meeting.appointmentId;
    } catch (error) {
      console.error('Error opening chat:', error);
      toast.error('Failed to open chat');
    }
  };

  const getUpcomingMeetings = () => {
    const now = new Date();
    return meetings.filter(meeting => {
      if (meeting.status !== 'scheduled') return false;
      const meetingDateTime = new Date(`${meeting.scheduledDate}T${meeting.scheduledTime}`);
      return meetingDateTime > now;
    }).sort((a, b) => {
      const aTime = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
      const bTime = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
      return aTime.getTime() - bTime.getTime();
    });
  };

  const getTodayMeetings = () => {
    const today = new Date().toISOString().split('T')[0];
    return meetings.filter(meeting => meeting.scheduledDate === today);
  };

  const getCompletedMeetings = () => {
    return meetings.filter(meeting => meeting.status === 'completed');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading meetings...</span>
      </div>
    );
  }

  const upcomingMeetings = getUpcomingMeetings();
  const todayMeetings = getTodayMeetings();
  const completedMeetings = getCompletedMeetings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Video Consultations</h1>
        <p className="text-gray-600">Your scheduled video consultation meetings</p>
      </div>

      {/* Today's Meetings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Meetings ({todayMeetings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayMeetings.length > 0 ? (
              todayMeetings.map((meeting) => (
                <div key={meeting.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-lg">Dr. {meeting.doctorName}</h4>
                        <Badge variant={meeting.status === 'scheduled' ? 'default' :
                                       meeting.status === 'in-progress' ? 'destructive' : 'secondary'}>
                          {meeting.status}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Video className="h-3 w-3" />
                          {meeting.meetingType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {meeting.scheduledDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {meeting.scheduledTime} ({meeting.duration}min)
                        </span>
                      </div>
                      {meeting.notes && (
                        <p className="text-sm text-gray-700 mt-2">{meeting.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {meeting.status === 'scheduled' && (
                      <Button size="sm" onClick={() => handleJoinMeeting(meeting)}>
                        <Video className="h-4 w-4 mr-2" />
                        Join Meeting
                      </Button>
                    )}
                    {meeting.status === 'in-progress' && (
                      <Button size="sm" onClick={() => handleJoinMeeting(meeting)}>
                        <Video className="h-4 w-4 mr-2" />
                        Rejoin Meeting
                      </Button>
                    )}
                    {meeting.status === 'completed' && meeting.recordingUrl && (
                      <Button size="sm" variant="outline" onClick={() => window.open(meeting.recordingUrl, '_blank')}>
                        <Play className="h-4 w-4 mr-2" />
                        View Recording
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleOpenChat(meeting)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chat with Doctor
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No meetings scheduled for today</p>
                <p className="text-sm">Book a video consultation to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Meetings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Upcoming Meetings ({upcomingMeetings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingMeetings.slice(0, 5).map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="text-sm font-medium">Dr. {meeting.doctorName}</h4>
                    <p className="text-xs text-gray-600">
                      {meeting.scheduledDate} at {meeting.scheduledTime} ({meeting.duration}min)
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleJoinMeeting(meeting)}>
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleOpenChat(meeting)}>
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {upcomingMeetings.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming meetings</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Meeting History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Meetings ({completedMeetings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completedMeetings.slice(0, 10).map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="text-sm font-medium">Dr. {meeting.doctorName}</h4>
                    <p className="text-xs text-gray-600">
                      {meeting.scheduledDate} • {meeting.duration}min • Completed
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {meeting.recordingUrl && (
                    <Button size="sm" variant="outline" onClick={() => window.open(meeting.recordingUrl, '_blank')}>
                      <Play className="h-3 w-3" />
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleOpenChat(meeting)}>
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            {completedMeetings.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No completed meetings yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

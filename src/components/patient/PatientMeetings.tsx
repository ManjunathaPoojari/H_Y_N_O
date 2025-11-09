import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Clock, Video, MessageSquare } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { useAppStore } from '../../lib/app-store';
import { Appointment } from '../../types';

interface Meeting {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  date: string;
  time: string;
  type: 'video' | 'chat';
  status: 'booked' | 'completed' | 'cancelled';
  appointmentId: string;
}

const PatientMeetings: React.FC = () => {
  const { user } = useAuth();
  const { appointments } = useAppStore();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'video' | 'chat' | 'completed' | 'upcoming'>('all');

  useEffect(() => {
    if (!user?.id) return;

    const fetchMeetings = () => {
      try {
        setLoading(true);
        // Filter appointments that are video or chat consultations
        const videoChatAppointments = appointments.filter(app =>
          (app.type === 'video' || app.type === 'chat') &&
          app.patientId === user.id
        );

        // Convert appointments to meetings format
        const meetingsData: Meeting[] = videoChatAppointments
          .map(app => ({
            id: `meeting-${app.id}`,
            doctorName: app.doctorName,
            doctorSpecialty: app.reason || 'Consultation', // Use appointment reason as specialty or default to 'Consultation'
            date: app.date,
            time: app.time,
            type: app.type as 'video' | 'chat',
            status: app.status as 'booked' | 'completed' | 'cancelled',
            appointmentId: app.id
          }))
          .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

        setMeetings(meetingsData);
      } catch (error) {
        console.error('Error processing meetings:', error);
        setMeetings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [user?.id, appointments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'video' ? <Video className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">My Meetings</h1>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Calculate meeting statistics
  const totalVideoSessions = meetings.filter(m => m.type === 'video').length;
  const totalChatSessions = meetings.filter(m => m.type === 'chat').length;
  const completedVideoSessions = meetings.filter(m => m.type === 'video' && m.status === 'completed').length;
  const completedChatSessions = meetings.filter(m => m.type === 'chat' && m.status === 'completed').length;
  const upcomingSessions = meetings.filter(m => m.status === 'booked').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Meetings</h1>
        <p className="text-gray-600">View and manage your video consultations and chat sessions</p>
      </div>

      {/* Meeting Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedFilter('video')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Video Sessions</p>
                <p className="text-2xl font-bold">{totalVideoSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedFilter('chat')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Chat Sessions</p>
                <p className="text-2xl font-bold">{totalChatSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedFilter('completed')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{completedVideoSessions + completedChatSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedFilter('upcoming')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingSessions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter indicator */}
      {selectedFilter !== 'all' && (
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <span className="text-sm text-gray-600">
            Showing: <span className="font-medium capitalize">{selectedFilter}</span> sessions
          </span>
          <Button variant="outline" size="sm" onClick={() => setSelectedFilter('all')}>
            Show All
          </Button>
        </div>
      )}

      <div className="grid gap-4">
        {(() => {
          let filteredMeetings = meetings;

          if (selectedFilter === 'video') {
            filteredMeetings = meetings.filter(m => m.type === 'video');
          } else if (selectedFilter === 'chat') {
            filteredMeetings = meetings.filter(m => m.type === 'chat');
          } else if (selectedFilter === 'completed') {
            filteredMeetings = meetings.filter(m => m.status === 'completed');
          } else if (selectedFilter === 'upcoming') {
            filteredMeetings = meetings.filter(m => m.status === 'booked');
          }

          return filteredMeetings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">No meetings found</h3>
                <p className="text-gray-600">
                  {selectedFilter === 'all'
                    ? "You don't have any upcoming or past meetings."
                    : `No ${selectedFilter} sessions found.`
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMeetings.map((meeting) => (
              <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{meeting.doctorName}</CardTitle>
                    <Badge className={getStatusColor(meeting.status)}>
                      {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{meeting.doctorSpecialty}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{new Date(meeting.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{meeting.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(meeting.type)}
                      <span className="text-sm capitalize">{meeting.type} Call</span>
                    </div>
                  </div>

                  {meeting.status === 'booked' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => {
                          if (meeting.type === 'video') {
                            // Navigate to video call component with appointment ID
                            window.location.href = `/video-call?appointmentId=${meeting.appointmentId}`;
                          } else if (meeting.type === 'chat') {
                            // Navigate to chat with appointment ID
                            window.location.href = `/patient/chat?appointmentId=${meeting.appointmentId}`;
                          }
                        }}
                      >
                        {getTypeIcon(meeting.type)}
                        Join {meeting.type === 'video' ? 'Video Call' : 'Chat'}
                      </Button>
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                    </div>
                  )}

                  {meeting.status === 'completed' && (
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          );
        })()}
      </div>
    </div>
  );
};

export { PatientMeetings };

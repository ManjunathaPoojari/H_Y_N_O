import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Video, Phone, Users, Calendar, Clock, Play, Square, Settings, Loader2, MessageSquare } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { appointmentAPI, chatAPI } from '../../lib/api-client';
import { toast } from 'sonner';

interface Meeting {
  id: string;
  appointmentId: string;
  patientName: string;
  patientId: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  meetingType: 'video' | 'audio';
  meetingUrl?: string;
  notes: string;
  recordingUrl?: string;
}

interface ActiveMeeting {
  id: string;
  patientName: string;
  startTime: string;
  duration: number;
  isRecording: boolean;
}

export const DoctorMeetings = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeMeeting, setActiveMeeting] = useState<ActiveMeeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMeetingSettings, setShowMeetingSettings] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // Meeting settings
  const [meetingType, setMeetingType] = useState<'video' | 'audio'>('video');
  const [duration, setDuration] = useState(30);
  const [autoRecord, setAutoRecord] = useState(false);
  const [waitingRoom, setWaitingRoom] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadMeetings();
    }
  }, [user]);

  const loadMeetings = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      // Get video appointments for this doctor
      const appointmentsRes = await appointmentAPI.getByDoctor(user.id);
      const videoAppointments = appointmentsRes.filter(app => app.type === 'video');

      // Convert appointments to meetings
      const meetingsData: Meeting[] = videoAppointments.map(app => ({
        id: `meeting-${app.id}`,
        appointmentId: app.id,
        patientName: app.patientName || 'Unknown Patient',
        patientId: app.patientId,
        scheduledDate: app.appointmentDate,
        scheduledTime: app.time,
        duration: 30, // Default 30 minutes
        status: app.status === 'UPCOMING' ? 'scheduled' :
                app.status === 'COMPLETED' ? 'completed' : 'cancelled',
        meetingType: 'video',
        meetingUrl: `https://meet.google.com/${app.id}`,
        notes: app.notes || '',
        recordingUrl: undefined
      }));

      setMeetings(meetingsData);
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleStartMeeting = async (meeting: Meeting) => {
    try {
      // Create chat room for the meeting
      await chatAPI.createChatRoom(meeting.appointmentId);

      // Update meeting status
      setMeetings(prev => prev.map(m =>
        m.id === meeting.id ? { ...m, status: 'in-progress' as const } : m
      ));

      // Set active meeting
      setActiveMeeting({
        id: meeting.id,
        patientName: meeting.patientName,
        startTime: new Date().toISOString(),
        duration: meeting.duration,
        isRecording: autoRecord
      });

      toast.success('Meeting started successfully');

      // Open meeting in new tab
      window.open(meeting.meetingUrl, '_blank');
    } catch (error) {
      console.error('Error starting meeting:', error);
      toast.error('Failed to start meeting');
    }
  };

  const handleEndMeeting = () => {
    if (!activeMeeting) return;

    // Update meeting status
    setMeetings(prev => prev.map(m =>
      m.id === activeMeeting.id ? { ...m, status: 'completed' as const } : m
    ));

    setActiveMeeting(null);
    toast.success('Meeting ended successfully');
  };

  const handleJoinMeeting = (meeting: Meeting) => {
    if (meeting.meetingUrl) {
      window.open(meeting.meetingUrl, '_blank');
    } else {
      toast.error('Meeting URL not available');
    }
  };

  const handleViewRecording = (meeting: Meeting) => {
    if (meeting.recordingUrl) {
      window.open(meeting.recordingUrl, '_blank');
    } else {
      toast.error('Recording not available');
    }
  };

  const handleOpenChat = async (meeting: Meeting) => {
    try {
      await chatAPI.createChatRoom(meeting.appointmentId);
      window.location.href = 'http://localhost:3001/doctor/chat';
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
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading meetings...</span>
      </div>
    );
  }

  const upcomingMeetings = getUpcomingMeetings();
  const todayMeetings = getTodayMeetings();
  const completedMeetings = getCompletedMeetings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Video Consultations</h1>
          <p className="text-gray-600">Conduct video consultations with your patients</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showMeetingSettings} onOpenChange={setShowMeetingSettings}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Meeting Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Meeting Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Default Meeting Type</Label>
                  <Select value={meetingType} onValueChange={(value: 'video' | 'audio') => setMeetingType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Meeting</SelectItem>
                      <SelectItem value="audio">Audio Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Default Duration (minutes)</Label>
                  <Input
                    type="number"
                    min="15"
                    max="120"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Auto Record Meetings</Label>
                  <input
                    type="checkbox"
                    checked={autoRecord}
                    onChange={(e) => setAutoRecord(e.target.checked)}
                    className="rounded"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Enable Waiting Room</Label>
                  <input
                    type="checkbox"
                    checked={waitingRoom}
                    onChange={(e) => setWaitingRoom(e.target.checked)}
                    className="rounded"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowMeetingSettings(false)}>
                  Save Settings
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Active Meeting Banner */}
      {activeMeeting && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="font-semibold">Meeting in Progress</h3>
                  <p className="text-sm text-gray-600">
                    With {activeMeeting.patientName} • Started at {new Date(activeMeeting.startTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {activeMeeting.isRecording && (
                  <Badge variant="destructive" className="animate-pulse">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                    Recording
                  </Badge>
                )}
                <Button size="sm" variant="outline" onClick={() => setActiveMeeting(null)}>
                  <Square className="h-4 w-4 mr-2" />
                  End Meeting
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                        <h4 className="text-lg">{meeting.patientName}</h4>
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
                      <>
                        <Button size="sm" onClick={() => handleStartMeeting(meeting)}>
                          <Play className="h-4 w-4 mr-2" />
                          Start Meeting
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleJoinMeeting(meeting)}>
                          <Video className="h-4 w-4 mr-2" />
                          Join Meeting
                        </Button>
                      </>
                    )}
                    {meeting.status === 'in-progress' && (
                      <Button size="sm" variant="outline" onClick={() => handleJoinMeeting(meeting)}>
                        <Video className="h-4 w-4 mr-2" />
                        Rejoin Meeting
                      </Button>
                    )}
                    {meeting.status === 'completed' && meeting.recordingUrl && (
                      <Button size="sm" variant="outline" onClick={() => handleViewRecording(meeting)}>
                        <Play className="h-4 w-4 mr-2" />
                        View Recording
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleOpenChat(meeting)}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Open Chat
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No meetings scheduled for today</p>
                <p className="text-sm">Meetings will appear here when patients book video appointments</p>
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
                    <h4 className="text-sm font-medium">{meeting.patientName}</h4>
                    <p className="text-xs text-gray-600">
                      {meeting.scheduledDate} at {meeting.scheduledTime} ({meeting.duration}min)
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleJoinMeeting(meeting)}>
                  View Details
                </Button>
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
                    <h4 className="text-sm font-medium">{meeting.patientName}</h4>
                    <p className="text-xs text-gray-600">
                      {meeting.scheduledDate} • {meeting.duration}min • Completed
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {meeting.recordingUrl && (
                    <Button size="sm" variant="outline" onClick={() => handleViewRecording(meeting)}>
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

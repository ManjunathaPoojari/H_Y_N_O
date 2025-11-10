import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useYogaState } from '../../hooks/useYogaState';
import { useAppointments } from '../../hooks/useAppointments';
import { useYogaTimer } from '../../hooks/useYogaTimer';
import { yogaPoses } from '../../lib/yoga-poses';
import { YogaTrainer, YogaVideo } from '../../types/yoga';
import { AIChatAssistant } from '../common/AIChatAssistant';
import { aiService } from '../../lib/ai-service';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Play,
  BookOpen,
  Calendar as CalendarIcon,
  TrendingUp,
  Search,
  Star,
  Clock,
  Heart,
  PlayCircle,
  User,
  MapPin,
  Sparkles, Brain, Zap, Trophy, Flame, Activity,
  Plus, X, Eye, ThumbsUp, MessageCircle, BarChart3,
  Filter, Target, Award, ChevronRight, Video, MessageSquare,
  CalendarDays, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';


// Mock data for demonstration
const mockTrainers: YogaTrainer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    specialty: ['Hatha', 'Vinyasa'],
    experience: 8,
    rating: 4.9,
    reviews: 127,
    location: 'Downtown Studio',
    availability: 'available',
    modes: ['virtual', 'in-person'],
    qualifications: ['RYT-500', 'Anatomy Certified'],
    languages: ['English', 'Spanish'],
    pricePerSession: 75,
    bio: 'Passionate yoga instructor with 8 years of experience...',
    image: '/api/placeholder/150/150',
    status: 'active',
    createdAt: '2023-01-01',
    updatedAt: '2024-01-01'
  }
];

const mockVideos: YogaVideo[] = [
  {
    id: '1',
    title: 'Morning Flow',
    trainer: 'Sarah Johnson',
    trainerId: '1',
    duration: 25,
    level: 'beginner',
    style: 'Vinyasa',
    views: 1250,
    rating: 4.8,
    thumbnail: '/api/placeholder/300/200',
    description: 'Start your day with this energizing flow...',
    benefits: ['Energy boost', 'Flexibility', 'Mental clarity'],
    videoUrl: 'https://youtube.com/watch?v=example',
    tags: ['morning', 'flow', 'beginner'],
    isActive: true,
    createdAt: '2023-01-01',
    updatedAt: '2024-01-01'
  }
];

interface YogaFitnessProps {
  onNavigate: (path: string) => void;
  currentTab?: string;
}

export const YogaFitness: React.FC<YogaFitnessProps> = ({
  onNavigate,
  currentTab = 'trainers'
}) => {
  const { state, updateState, toggleFavorite, togglePoseFavorite } = useYogaState();
  const { appointments, bookAppointment, joinSession } = useAppointments();
  const { timerState, startTimer, stopTimer, formatTime } = useYogaTimer();

  const [activeTab, setActiveTab] = useState(currentTab);
  const [bookingDate, setBookingDate] = useState<Date>();
  const [bookingTime, setBookingTime] = useState<string>('');
  const [bookingMode, setBookingMode] = useState<'virtual' | 'in-person'>('virtual');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [showAIChat, setShowAIChat] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onNavigate(`/patient/yoga/${tab}`);
  };

  const TrainersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Yoga Trainers</h2>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search trainers..."
            value={state.searchQuery}
            onChange={(e) => updateState({ searchQuery: e.target.value })}
            className="w-64"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTrainers.map((trainer) => (
          <Card key={trainer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{trainer.name}</CardTitle>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{trainer.rating}</span>
                      <span>({trainer.reviews})</span>
                    </div>
                  </div>
                </div>
                <Badge variant={trainer.availability === 'available' ? 'default' : 'secondary'}>
                  {trainer.availability}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{trainer.location}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {trainer.specialty.map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">${trainer.pricePerSession}/session</span>
                  <Button
                    size="sm"
                    onClick={() => updateState({ showBookingModal: true, selectedTrainer: trainer })}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const VideosTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Yoga Videos</h2>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search videos..."
            value={state.searchQuery}
            onChange={(e) => updateState({ searchQuery: e.target.value })}
            className="w-64"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVideos.map((video) => (
          <Card key={video.id} className="hover:shadow-lg transition-shadow">
            <div className="relative">
              <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                <PlayCircle className="h-12 w-12 text-gray-400" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => toggleFavorite(video.id)}
              >
                <Heart className={`h-4 w-4 ${state.favorites.includes(video.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold">{video.title}</h3>
                <p className="text-sm text-gray-600">{video.trainer}</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{video.duration} min</span>
                  </div>
                  <Badge variant="outline">{video.level}</Badge>
                </div>
                <div className="flex items-center space-x-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{video.rating}</span>
                  <span className="text-gray-500">({video.views} views)</span>
                </div>
                <Button
                  className="w-full"
                  onClick={() => updateState({ showVideoPlayer: true, selectedVideo: video })}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const PosesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Yoga Poses</h2>
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search poses..."
            value={state.poseSearchQuery}
            onChange={(e) => updateState({ poseSearchQuery: e.target.value })}
            className="w-64"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {yogaPoses.slice(0, 12).map((pose) => (
          <Card key={pose.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{pose.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePoseFavorite(pose.id)}
                >
                  <Heart className={`h-4 w-4 ${state.poseFavorites.includes(pose.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
              {pose.sanskritName && (
                <p className="text-sm text-gray-600 italic">{pose.sanskritName}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{pose.difficulty}</Badge>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{pose.duration}s</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{pose.benefits[0]}</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateState({ showPoseDetailModal: true, selectedPose: pose })}
                  >
                    Details
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      updateState({ isPracticingPose: true, selectedPose: pose });
                      startTimer(pose.duration, () => {}, () => {
                        updateState({ isPracticingPose: false });
                      });
                    }}
                  >
                    Practice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const AppointmentsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Appointments</h2>
        <Button onClick={() => updateState({ showAppointmentModal: true })}>
          <Calendar className="h-4 w-4 mr-2" />
          Book New
        </Button>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No appointments yet</h3>
              <p className="text-gray-600 mb-4">Book your first yoga session with a trainer</p>
              <Button onClick={() => setActiveTab('trainers')}>
                Browse Trainers
              </Button>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Yoga Session</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {appointment.mode}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${appointment.price}</p>
                    <Badge
                      variant={appointment.status === 'upcoming' ? 'default' : 'secondary'}
                    >
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
                {appointment.status === 'upcoming' && (
                  <div className="mt-4 flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => joinSession(appointment, onNavigate)}
                    >
                      Join Session
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateState({ showRescheduleModal: true, selectedAppointment: appointment })}
                    >
                      Reschedule
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const ProgressTab = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Progress</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{state.posePracticeHistory.length}</div>
            <p className="text-sm text-gray-600">Poses Practiced</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Play className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{state.watchHistory.length}</div>
            <p className="text-sm text-gray-600">Videos Watched</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{state.activityDates.length}</div>
            <p className="text-sm text-gray-600">Active Days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold">{state.poseFavorites.length}</div>
            <p className="text-sm text-gray-600">Favorite Poses</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {state.posePracticeHistory.slice(-5).map((poseId, index) => {
              const pose = yogaPoses.find(p => p.id === poseId);
              return pose ? (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{pose.name}</p>
                    <p className="text-sm text-gray-600">Practiced recently</p>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const handleBookAppointment = async () => {
    if (!state.selectedTrainer || !bookingDate || !bookingTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await bookAppointment({
        trainerId: state.selectedTrainer.id,
        date: bookingDate,
        time: bookingTime,
        mode: bookingMode,
        notes: bookingNotes,
        price: state.selectedTrainer.pricePerSession
      });

      toast.success('Appointment booked successfully!');
      updateState({ showBookingModal: false });
      setBookingDate(undefined);
      setBookingTime('');
      setBookingNotes('');
    } catch (error) {
      toast.error('Failed to book appointment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Yoga & Fitness</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAIChat(!showAIChat)}
            className="flex items-center space-x-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Assistant</span>
          </Button>
          <Badge variant="outline" className="px-3 py-1">
            {state.posePracticeHistory.length} poses practiced
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {state.favorites.length} favorites
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="flex w-full justify-center h-auto p-1">
          <TabsTrigger value="trainers" className="flex items-center space-x-1 px-3 py-2 text-sm flex-1 justify-center">
            <Users className="h-4 w-4" />
            <span>Trainers</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center space-x-1 px-3 py-2 text-sm flex-1 justify-center">
            <Play className="h-4 w-4" />
            <span>Videos</span>
          </TabsTrigger>
          <TabsTrigger value="poses" className="flex items-center space-x-1 px-3 py-2 text-sm flex-1 justify-center">
            <BookOpen className="h-4 w-4" />
            <span>Poses</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center space-x-1 px-3 py-2 text-sm flex-1 justify-center">
            <Calendar className="h-4 w-4" />
            <span>Appointments</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-1 px-3 py-2 text-sm flex-1 justify-center">
            <TrendingUp className="h-4 w-4" />
            <span>Progress</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trainers">
          <TrainersTab />
        </TabsContent>

        <TabsContent value="videos">
          <VideosTab />
        </TabsContent>

        <TabsContent value="poses">
          <PosesTab />
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentsTab />
        </TabsContent>

        <TabsContent value="progress">
          <ProgressTab />
        </TabsContent>
      </Tabs>

      {/* Practice Timer */}
      {state.isPracticingPose && state.selectedPose && (
        <Card className="fixed bottom-4 right-4 w-80 z-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{state.selectedPose.name}</h3>
                <p className="text-sm text-gray-600">
                  {formatTime(timerState.currentPoseTimeLeft)}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  stopTimer();
                  updateState({ isPracticingPose: false });
                }}
              >
                Stop
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booking Modal */}
      <Dialog open={state.showBookingModal} onOpenChange={(open: boolean) => updateState({ showBookingModal: open })}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book Yoga Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {state.selectedTrainer && (
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{state.selectedTrainer.name}</h3>
                  <p className="text-sm text-gray-600">{state.selectedTrainer.specialty.join(', ')}</p>
                  <p className="text-sm font-medium">${state.selectedTrainer.pricePerSession}/session</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingDate ? format(bookingDate, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={bookingDate}
                      onSelect={setBookingDate}
                      disabled={(date: Date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Select value={bookingTime} onValueChange={setBookingTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                    <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                    <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                    <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                    <SelectItem value="6:00 PM">6:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Session Mode</label>
              <Select value={bookingMode} onValueChange={(value: 'virtual' | 'in-person') => setBookingMode(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="virtual">Virtual Session</SelectItem>
                  <SelectItem value="in-person">In-Person Session</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Textarea
                placeholder="Any special requests or notes..."
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => updateState({ showBookingModal: false })}>
              Cancel
            </Button>
            <Button onClick={handleBookAppointment}>
              Book Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AI Chat Assistant */}
      {showAIChat && (
        <div className="fixed bottom-4 left-4 w-96 h-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
              AI Yoga Assistant
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAIChat(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-4 h-80 overflow-y-auto">
            <AIChatAssistant
              context="yoga-fitness"
              initialMessage="Hello! I'm your AI yoga assistant. I can help you with yoga poses, breathing techniques, meditation guidance, and answer any questions about your yoga practice. How can I assist you today?"
            />
          </div>
        </div>
      )}
    </div>
  );
};

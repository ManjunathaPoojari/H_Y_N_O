import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar } from '../ui/calendar';
import {
  Users, Video, Calendar as CalendarIcon, Star, Clock,
  TrendingUp, Award, Heart, Activity, Dumbbell, Target,
  MessageSquare, Phone, Mail, MapPin, Play, BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../lib/auth-context';
import apiClient from '../../lib/api-client';
import { toast } from 'sonner';

interface TrainerDashboardProps {
  onNavigate: (path: string) => void;
}

interface Session {
  id: string;
  clientName: string;
  date: Date;
  time: string;
  mode: 'virtual' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
  type: string;
  price: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  sessionsCompleted: number;
  rating: number;
  lastSession: Date;
  goals: string[];
}

interface VideoContent {
  id: string;
  title: string;
  views: number;
  rating: number;
  duration: number;
  level: string;
  style: string;
}

const mockSessions: Session[] = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    date: new Date(),
    time: '10:00 AM',
    mode: 'virtual',
    status: 'upcoming',
    type: 'Hatha Yoga',
    price: 800
  },
  {
    id: '2',
    clientName: 'Mike Chen',
    date: new Date(Date.now() + 86400000), // tomorrow
    time: '2:00 PM',
    mode: 'in-person',
    status: 'upcoming',
    type: 'Power Yoga',
    price: 1000
  },
  {
    id: '3',
    clientName: 'Emma Davis',
    date: new Date(Date.now() - 86400000), // yesterday
    time: '6:00 PM',
    mode: 'virtual',
    status: 'completed',
    type: 'Meditation',
    price: 700
  }
];

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    sessionsCompleted: 12,
    rating: 4.9,
    lastSession: new Date(),
    goals: ['Stress relief', 'Flexibility']
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    sessionsCompleted: 8,
    rating: 4.7,
    lastSession: new Date(Date.now() - 86400000),
    goals: ['Strength building', 'Weight loss']
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma@example.com',
    sessionsCompleted: 15,
    rating: 5.0,
    lastSession: new Date(Date.now() - 172800000), // 2 days ago
    goals: ['Meditation practice', 'Mental clarity']
  }
];

const mockVideos: VideoContent[] = [
  {
    id: '1',
    title: 'Morning Energy Flow',
    views: 1250,
    rating: 4.8,
    duration: 20,
    level: 'beginner',
    style: 'Vinyasa'
  },
  {
    id: '2',
    title: 'Power Yoga Strength',
    views: 890,
    rating: 4.9,
    duration: 45,
    level: 'intermediate',
    style: 'Power Yoga'
  },
  {
    id: '3',
    title: 'Relaxing Yin Evening',
    views: 1520,
    rating: 4.9,
    duration: 30,
    level: 'beginner',
    style: 'Yin Yoga'
  }
];

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [videos, setVideos] = useState<VideoContent[]>(mockVideos);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Calculate stats
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const upcomingSessions = sessions.filter(s => s.status === 'upcoming').length;
  const totalEarnings = sessions.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.price, 0);
  const averageRating = clients.reduce((sum, c) => sum + c.rating, 0) / clients.length;

  const todaySessions = sessions.filter(s =>
    s.date.toDateString() === new Date().toDateString() && s.status === 'upcoming'
  );

  return (
    <div className="space-y-6 p-6 relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 -z-10"></div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Trainer Dashboard
          </h1>
          <p className="text-slate-600">Welcome back, {user?.name}! Manage your yoga and fitness sessions.</p>
        </div>
        <Button
          onClick={() => onNavigate('/trainer/schedule')}
          className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <CalendarIcon className="h-4 w-4" />
          Manage Schedule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <CalendarIcon className="h-5 w-5" />
              <Badge className="bg-white/20">Today</Badge>
            </div>
            <div className="text-3xl">{todaySessions.length}</div>
            <div className="text-sm opacity-90">Sessions Today</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5" />
              <Badge className="bg-white/20">Active</Badge>
            </div>
            <div className="text-3xl">{clients.length}</div>
            <div className="text-sm opacity-90">Total Clients</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5" />
              <Badge className="bg-white/20">This Month</Badge>
            </div>
            <div className="text-3xl">₹{totalEarnings.toLocaleString()}</div>
            <div className="text-sm opacity-90">Earnings</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="h-5 w-5" />
              <Badge className="bg-white/20">Average</Badge>
            </div>
            <div className="text-3xl">{averageRating.toFixed(1)}</div>
            <div className="text-sm opacity-90">Client Rating</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Today's Sessions */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-purple-600" />
                  Today's Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaySessions.length > 0 ? (
                  <div className="space-y-3">
                    {todaySessions.map(session => (
                      <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                        <div>
                          <div className="font-medium">{session.clientName}</div>
                          <div className="text-sm text-slate-600">{session.type} • {session.time}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">{session.mode}</Badge>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            {session.mode === 'virtual' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-4">No sessions scheduled for today</p>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions.filter(s => s.status === 'upcoming').slice(0, 5).map(session => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                      <div>
                        <div className="font-medium">{session.clientName}</div>
                        <div className="text-sm text-slate-600">
                          {session.date.toLocaleDateString()} • {session.time}
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">{session.mode}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All Sessions */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle>All Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.map(session => (
                  <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {session.mode === 'virtual' ? '💻' : '🏠'}
                      </div>
                      <div>
                        <div className="font-medium">{session.clientName}</div>
                        <div className="text-sm text-slate-600">
                          {session.date.toLocaleDateString()} • {session.time} • {session.type}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={
                        session.status === 'completed' ? 'bg-green-500' :
                        session.status === 'upcoming' ? 'bg-blue-500' : 'bg-slate-400'
                      }>
                        {session.status}
                      </Badge>
                      <div className="text-right">
                        <div className="font-medium">₹{session.price}</div>
                        <div className="text-sm text-slate-600 capitalize">{session.mode}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map(client => (
              <Card key={client.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">👤</div>
                    <div className="flex-1">
                      <h3 className="text-lg mb-1">{client.name}</h3>
                      <p className="text-sm text-slate-600 mb-2">{client.email}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span>{client.rating}</span>
                        <span>•</span>
                        <span>{client.sessionsCompleted} sessions</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="text-sm font-medium">Goals:</div>
                    <div className="flex flex-wrap gap-1">
                      {client.goals.map(goal => (
                        <Badge key={goal} variant="secondary" className="text-xs">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 mb-4">
                    Last session: {client.lastSession.toLocaleDateString()}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl">Your Content Library</h2>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Play className="h-4 w-4 mr-2" />
              Create New Video
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map(video => (
              <Card key={video.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all">
                <CardContent className="pt-6">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4 text-4xl">
                    🧘‍♀️
                  </div>

                  <h4 className="font-semibold mb-1">{video.title}</h4>
                  <p className="text-sm text-slate-600 mb-2">{video.style} • {video.level}</p>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Activity className="h-4 w-4" />
                      <span>{video.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{video.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                    <Clock className="h-4 w-4" />
                    <span>{video.duration} min</span>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Session Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Total Sessions</span>
                    <span className="font-semibold">{totalSessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completed</span>
                    <span className="font-semibold text-green-600">{completedSessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Upcoming</span>
                    <span className="font-semibold text-blue-600">{upcomingSessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Completion Rate</span>
                    <span className="font-semibold">{((completedSessions / totalSessions) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  Client Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Average Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-semibold">{averageRating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>5-Star Reviews</span>
                    <span className="font-semibold">{clients.filter(c => c.rating === 5.0).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Repeat Clients</span>
                    <span className="font-semibold">{clients.filter(c => c.sessionsCompleted > 5).length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                Monthly Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Sessions Goal: 50</span>
                    <span className="font-semibold">{completedSessions}/50</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600" style={{ width: `${(completedSessions / 50) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>Earnings Goal: ₹50,000</span>
                    <span className="font-semibold">₹{totalEarnings.toLocaleString()}/50,000</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-600 to-red-600" style={{ width: `${(totalEarnings / 50000) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span>New Clients Goal: 10</span>
                    <span className="font-semibold">{clients.length}/10</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-600 to-green-600" style={{ width: `${(clients.length / 10) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

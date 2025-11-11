import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar } from '../ui/calendar';
import {
  Dumbbell, Video, MapPin, Star, Clock, Heart, Award,
  Search, Filter, Play, BookOpen, Calendar as CalendarIcon,
  User, TrendingUp, Zap, Target, CheckCircle, ChevronRight,
  MessageSquare, Phone, Mail, Globe, Users, Sparkles, Trophy,
  Activity, Brain, Flame, Wind, Wand2, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { useRef } from 'react';
import { AIChatAssistant } from '../common/AIChatAssistant';
import { aiService } from '../../lib/ai-service';
import apiClient from '../../lib/api-client';
import { useAuth } from '../../lib/auth-context';
import { toast } from 'sonner';

interface YogaFitnessProps {
  onNavigate: (path: string) => void;
}

interface Trainer {
  id: string;
  name: string;
  specialty: string[];
  experience: number;
  rating: number;
  reviews: number;
  location: string;
  availability: 'available' | 'busy' | 'offline';
  modes: ('virtual' | 'in-person')[];
  qualifications: string[];
  languages: string[];
  pricePerSession: number;
  bio: string;
  image: string;
}

interface YogaVideo {
  id: string;
  title: string;
  trainer: string;
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  style: string;
  views: number;
  rating: number;
  thumbnail: string;
  description: string;
  benefits: string[];
}

interface Appointment {
  id: string;
  trainerId: string;
  date: Date;
  time: string;
  mode: 'virtual' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled';
  price: number;
}

const mockTrainers: Trainer[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    specialty: ['Hatha Yoga', 'Prenatal Yoga', 'Meditation'],
    experience: 8,
    rating: 4.9,
    reviews: 156,
    location: 'Mumbai, India',
    availability: 'available',
    modes: ['virtual', 'in-person'],
    qualifications: ['RYT 500', 'Prenatal Yoga Certified', 'Meditation Teacher'],
    languages: ['English', 'Hindi', 'Marathi'],
    pricePerSession: 800,
    bio: 'Certified yoga instructor with 8+ years of experience specializing in prenatal yoga and meditation.',
    image: '🧘‍♀️'
  },
  {
    id: '2',
    name: 'Arjun Patel',
    specialty: ['Power Yoga', 'Ashtanga', 'Strength Training'],
    experience: 10,
    rating: 4.8,
    reviews: 203,
    location: 'Bangalore, India',
    availability: 'available',
    modes: ['virtual', 'in-person'],
    qualifications: ['RYT 500', 'Ashtanga Certified', 'Fitness Coach'],
    languages: ['English', 'Hindi', 'Kannada'],
    pricePerSession: 1000,
    bio: 'Expert in power yoga and strength training. Helping people achieve their fitness goals for a decade.',
    image: '🏋️'
  },
  {
    id: '3',
    name: 'Meera Reddy',
    specialty: ['Yin Yoga', 'Restorative', 'Flexibility'],
    experience: 6,
    rating: 4.9,
    reviews: 98,
    location: 'Hyderabad, India',
    availability: 'busy',
    modes: ['virtual'],
    qualifications: ['RYT 200', 'Yin Yoga Specialist', 'Thai Massage'],
    languages: ['English', 'Telugu', 'Hindi'],
    pricePerSession: 700,
    bio: 'Specializing in gentle practices for stress relief and flexibility. Perfect for beginners.',
    image: '🌸'
  },
  {
    id: '4',
    name: 'Rahul Singh',
    specialty: ['Vinyasa Flow', 'Core Strength', 'HIIT'],
    experience: 7,
    rating: 4.7,
    reviews: 142,
    location: 'Delhi, India',
    availability: 'available',
    modes: ['virtual', 'in-person'],
    qualifications: ['RYT 300', 'HIIT Certified', 'Nutrition Coach'],
    languages: ['English', 'Hindi', 'Punjabi'],
    pricePerSession: 900,
    bio: 'Dynamic trainer combining yoga with high-intensity workouts for maximum results.',
    image: '💪'
  },
  {
    id: '5',
    name: 'Kavita Joshi',
    specialty: ['Kundalini Yoga', 'Chakra Healing', 'Sound Therapy'],
    experience: 12,
    rating: 4.9,
    reviews: 278,
    location: 'Pune, India',
    availability: 'available',
    modes: ['virtual', 'in-person'],
    qualifications: ['RYT 500', 'Kundalini Certified', 'Sound Healing Practitioner'],
    languages: ['English', 'Hindi', 'Marathi', 'Sanskrit'],
    pricePerSession: 1200,
    bio: 'Spiritual guide and Kundalini yoga expert. Transform your energy and consciousness through ancient practices.',
    image: '🕉️'
  },
  {
    id: '6',
    name: 'Vikram Kumar',
    specialty: ['Iyengar Yoga', 'Therapeutic Yoga', 'Back Pain Relief'],
    experience: 15,
    rating: 4.8,
    reviews: 324,
    location: 'Chennai, India',
    availability: 'available',
    modes: ['virtual', 'in-person'],
    qualifications: ['Iyengar Certified', 'Therapeutic Yoga Specialist', 'Anatomy Expert'],
    languages: ['English', 'Hindi', 'Tamil', 'Telugu'],
    pricePerSession: 1100,
    bio: 'Precision-focused Iyengar yoga teacher specializing in therapeutic practices for chronic pain and injuries.',
    image: '📐'
  },
  {
    id: '7',
    name: 'Ananya Gupta',
    specialty: ['Aerial Yoga', 'AcroYoga', 'Partner Yoga'],
    experience: 5,
    rating: 4.7,
    reviews: 89,
    location: 'Kolkata, India',
    availability: 'available',
    modes: ['in-person'],
    qualifications: ['RYT 200', 'Aerial Yoga Certified', 'AcroYoga Teacher'],
    languages: ['English', 'Hindi', 'Bengali'],
    pricePerSession: 950,
    bio: 'Fun and playful yoga instructor bringing creativity and strength through aerial and partner practices.',
    image: '🎪'
  },
  {
    id: '8',
    name: 'Dr. Rajesh Verma',
    specialty: ['Medical Yoga', 'Yoga Therapy', 'Stress Management'],
    experience: 18,
    rating: 4.9,
    reviews: 412,
    location: 'Ahmedabad, India',
    availability: 'busy',
    modes: ['virtual', 'in-person'],
    qualifications: ['MD Yoga Therapy', 'RYT 500', 'Clinical Psychologist'],
    languages: ['English', 'Hindi', 'Gujarati'],
    pricePerSession: 1500,
    bio: 'Medical doctor and yoga therapist combining modern medicine with ancient wisdom for holistic healing.',
    image: '⚕️'
  },
  {
    id: '9',
    name: 'Sneha Malhotra',
    specialty: ['Kids Yoga', 'Family Yoga', 'Playful Movement'],
    experience: 9,
    rating: 4.8,
    reviews: 167,
    location: 'Jaipur, India',
    availability: 'available',
    modes: ['virtual', 'in-person'],
    qualifications: ['RYT 200', 'Kids Yoga Certified', 'Montessori Inspired'],
    languages: ['English', 'Hindi', 'Rajasthani'],
    pricePerSession: 600,
    bio: 'Bringing joy and mindfulness to children and families through creative, play-based yoga practices.',
    image: '👶'
  },
  {
    id: '10',
    name: 'Amitabh Sharma',
    specialty: ['Yoga Philosophy', 'Sanskrit', 'Traditional Practices'],
    experience: 20,
    rating: 4.9,
    reviews: 356,
    location: 'Varanasi, India',
    availability: 'available',
    modes: ['virtual', 'in-person'],
    qualifications: ['Sanskrit Scholar', 'Philosophy Expert', 'Traditional Yoga Master'],
    languages: ['English', 'Hindi', 'Sanskrit'],
    pricePerSession: 1300,
    bio: 'Scholar of yoga philosophy and traditional practices. Deepen your understanding of yoga\'s ancient wisdom.',
    image: '📚'
  },
  {
    id: '11',
    name: 'Lisa Chen',
    specialty: ['Hot Yoga', 'Detox Yoga', 'Weight Loss'],
    experience: 11,
    rating: 4.6,
    reviews: 198,
    location: 'Goa, India',
    availability: 'available',
    modes: ['in-person'],
    qualifications: ['RYT 500', 'Hot Yoga Certified', 'Nutrition Specialist'],
    languages: ['English', 'Hindi', 'Mandarin'],
    pricePerSession: 850,
    bio: 'High-energy hot yoga instructor helping clients achieve weight loss goals through intense, detoxifying practices.',
    image: '🔥'
  },
  {
    id: '12',
    name: 'Deepak Nair',
    specialty: ['Beach Yoga', 'Outdoor Yoga', 'Nature Connection'],
    experience: 13,
    rating: 4.8,
    reviews: 234,
    location: 'Kochi, India',
    availability: 'available',
    modes: ['in-person'],
    qualifications: ['RYT 300', 'Outdoor Yoga Specialist', 'Environmental Educator'],
    languages: ['English', 'Hindi', 'Malayalam'],
    pricePerSession: 750,
    bio: 'Connect with nature through outdoor yoga practices. Experience the healing power of earth, water, and sky.',
    image: '🏖️'
  }
];

const mockVideos: YogaVideo[] = [
  {
    id: '1',
    title: 'Morning Energy Yoga Flow',
    trainer: 'Priya Sharma',
    duration: 20,
    level: 'beginner',
    style: 'Vinyasa',
    views: 12500,
    rating: 4.8,
    thumbnail: '🌅',
    description: 'Start your day with energy! This gentle flow wakes up your body and mind.',
    benefits: ['Increases energy', 'Improves flexibility', 'Reduces stress']
  },
  {
    id: '2',
    title: 'Power Yoga for Strength',
    trainer: 'Arjun Patel',
    duration: 45,
    level: 'intermediate',
    style: 'Power Yoga',
    views: 8900,
    rating: 4.9,
    thumbnail: '💪',
    description: 'Build strength and endurance with this dynamic power yoga session.',
    benefits: ['Builds muscle', 'Burns calories', 'Improves stamina']
  },
  {
    id: '3',
    title: 'Relaxing Yin Yoga Evening',
    trainer: 'Meera Reddy',
    duration: 30,
    level: 'beginner',
    style: 'Yin Yoga',
    views: 15200,
    rating: 4.9,
    thumbnail: '🌙',
    description: 'Wind down with gentle stretches and deep relaxation.',
    benefits: ['Reduces stress', 'Improves sleep', 'Increases flexibility']
  },
  {
    id: '4',
    title: 'Core Strength Vinyasa',
    trainer: 'Rahul Singh',
    duration: 35,
    level: 'intermediate',
    style: 'Vinyasa',
    views: 6700,
    rating: 4.7,
    thumbnail: '🔥',
    description: 'Challenging core-focused flow to build abdominal strength.',
    benefits: ['Strengthens core', 'Improves posture', 'Tones abs']
  },
  {
    id: '5',
    title: 'Prenatal Gentle Yoga',
    trainer: 'Priya Sharma',
    duration: 25,
    level: 'beginner',
    style: 'Prenatal',
    views: 4200,
    rating: 5.0,
    thumbnail: '🤰',
    description: 'Safe and gentle yoga for expecting mothers.',
    benefits: ['Reduces pregnancy discomfort', 'Prepares for childbirth', 'Reduces stress']
  },
  {
    id: '6',
    title: 'Ashtanga Primary Series',
    trainer: 'Arjun Patel',
    duration: 60,
    level: 'advanced',
    style: 'Ashtanga',
    views: 3800,
    rating: 4.8,
    thumbnail: '🧘',
    description: 'Traditional Ashtanga primary series for advanced practitioners.',
    benefits: ['Full body workout', 'Mental clarity', 'Discipline']
  },
  {
    id: '7',
    title: 'Meditation for Beginners',
    trainer: 'Meera Reddy',
    duration: 15,
    level: 'beginner',
    style: 'Meditation',
    views: 18900,
    rating: 4.9,
    thumbnail: '🧘‍♀️',
    description: 'Learn basic meditation techniques for inner peace.',
    benefits: ['Reduces anxiety', 'Improves focus', 'Promotes calmness']
  },
  {
    id: '8',
    title: 'HIIT Yoga Fusion',
    trainer: 'Rahul Singh',
    duration: 40,
    level: 'advanced',
    style: 'HIIT',
    views: 5600,
    rating: 4.6,
    thumbnail: '⚡',
    description: 'Intense workout combining yoga with high-intensity intervals.',
    benefits: ['Burns fat', 'Builds endurance', 'Increases metabolism']
  }
];

const yogaStyles = ['Hatha', 'Vinyasa', 'Power Yoga', 'Yin Yoga', 'Ashtanga', 'Prenatal', 'Restorative', 'Meditation', 'HIIT'];
const levels = ['beginner', 'intermediate', 'advanced'];

export const YogaFitness: React.FC<YogaFitnessProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string[]>([]);
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<YogaVideo | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [watchHistory, setWatchHistory] = useState<string[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMode, setSelectedMode] = useState<'virtual' | 'in-person'>('virtual');
  const [aiRoutine, setAiRoutine] = useState<any>(null);
  const [isGeneratingRoutine, setIsGeneratingRoutine] = useState(false);
  const [showAIRoutine, setShowAIRoutine] = useState(false);
  const [aiFormAnalysis, setAiFormAnalysis] = useState<any>(null);
  const [showFormAnalysis, setShowFormAnalysis] = useState(false);

  // Filter trainers
  const filteredTrainers = mockTrainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.specialty.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStyle = selectedStyleFilter.length === 0 ||
      selectedStyleFilter.some(style => trainer.specialty.includes(style));
    
    return matchesSearch && matchesStyle;
  });

  // Filter videos
  const filteredVideos = mockVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.style.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStyle = selectedStyleFilter.length === 0 ||
      selectedStyleFilter.includes(video.style);
    
    const matchesLevel = selectedLevelFilter.length === 0 ||
      selectedLevelFilter.includes(video.level);
    
    return matchesSearch && matchesStyle && matchesLevel;
  });

  const handleBookAppointment = () => {
    if (!selectedTrainer || !selectedDate || !selectedTime) {
      toast.error('Please select all booking details');
      return;
    }

    const newAppointment: Appointment = {
      id: Math.random().toString(),
      trainerId: selectedTrainer.id,
      date: selectedDate,
      time: selectedTime,
      mode: selectedMode,
      status: 'upcoming',
      price: selectedTrainer.pricePerSession
    };

    setAppointments(prev => [...prev, newAppointment]);
    setShowBookingModal(false);
    toast.success('Appointment booked successfully!');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const playVideo = (video: YogaVideo) => {
    setSelectedVideo(video);
    setShowVideoPlayer(true);
    if (!watchHistory.includes(video.id)) {
      setWatchHistory(prev => [...prev, video.id]);
    }
  };

  const timeSlots = ['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', 
                     '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'];

  // AI Functions
  const generateAIRoutine = async () => {
    setIsGeneratingRoutine(true);
    try {
      const response = await aiService.getYogaRecommendations({
        userProfile: {
          age: 28,
          fitnessLevel: 'intermediate',
          healthConditions: [],
          goals: ['flexibility', 'strength'],
          experience: 'intermediate',
        },
        requestType: 'routine-plan',
      });

      if (response.success) {
        setAiRoutine(response.data);
        setShowAIRoutine(true);
      }
    } catch (error) {
      console.error('AI routine generation error:', error);
    } finally {
      setIsGeneratingRoutine(false);
    }
  };

  const analyzePoseForm = async (poseName: string) => {
    try {
      const response = await aiService.getYogaRecommendations({
        userProfile: {
          age: 28,
          fitnessLevel: 'intermediate',
          healthConditions: [],
          goals: [],
          experience: 'intermediate',
        },
        requestType: 'form-analysis',
        context: { poseName },
      });

      if (response.success) {
        setAiFormAnalysis(response.data);
        setShowFormAnalysis(true);
      }
    } catch (error) {
      console.error('Form analysis error:', error);
    }
  };

  return (
    <div className="space-y-6 p-6 relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 -z-10"></div>

      {/* AI Chat Assistant */}
      <AIChatAssistant context="yoga" />

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedTrainer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl mb-2">Book Session with {selectedTrainer.name}</h3>
                  <p className="text-slate-600">{selectedTrainer.specialty.join(', ')}</p>
                </div>
                <Button variant="ghost" onClick={() => setShowBookingModal(false)}>✕</Button>
              </div>

              <div className="space-y-6">
                {/* Mode Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Session Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedTrainer.modes.map(mode => (
                      <button
                        key={mode}
                        onClick={() => setSelectedMode(mode)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedMode === mode
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        {mode === 'virtual' ? <Video className="h-5 w-5 mb-2" /> : <MapPin className="h-5 w-5 mb-2" />}
                        <div className="font-semibold capitalize">{mode}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Calendar */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Select Date</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date: Date) => date < new Date()}
                    className="rounded-xl border shadow-sm"
                  />
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Select Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border-2 text-sm transition-all ${
                          selectedTime === time
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50">
                  <span className="font-semibold">Session Price</span>
                  <span className="text-2xl">₹{selectedTrainer.pricePerSession}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleBookAppointment}
                    className="flex-1 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Confirm Booking
                  </Button>
                  <Button variant="outline" onClick={() => setShowBookingModal(false)} className="flex-1 py-6">
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Player Modal */}
      <AnimatePresence>
        {showVideoPlayer && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setShowVideoPlayer(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl p-6 max-w-4xl w-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl text-white mb-1">{selectedVideo.title}</h3>
                  <p className="text-slate-400">{selectedVideo.trainer} • {selectedVideo.duration} min</p>
                </div>
                <Button variant="ghost" onClick={() => setShowVideoPlayer(false)} className="text-white">
                  ✕
                </Button>
              </div>

              {/* Video Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-purple-900 to-pink-900 rounded-xl flex items-center justify-center mb-4">
                <div className="text-center text-white">
                  <div className="text-8xl mb-4">{selectedVideo.thumbnail}</div>
                  <Button className="bg-white text-slate-900 hover:bg-slate-100">
                    <Play className="h-5 w-5 mr-2" />
                    Play Video
                  </Button>
                </div>
              </div>

              <div className="text-white">
                <h4 className="font-semibold mb-2">About this practice</h4>
                <p className="text-slate-300 mb-4">{selectedVideo.description}</p>
                
                <h4 className="font-semibold mb-2">Benefits</h4>
                <ul className="space-y-1">
                  {selectedVideo.benefits.map((benefit, i) => (
                    <li key={i} className="text-slate-300 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Routine Modal */}
      <AnimatePresence>
        {showAIRoutine && aiRoutine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAIRoutine(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl mb-2 flex items-center gap-2">
                    <Brain className="h-6 w-6 text-purple-600" />
                    AI-Generated Yoga Routine
                  </h3>
                  <p className="text-slate-600">Personalized for your level: {aiRoutine.duration} minutes</p>
                </div>
                <Button variant="ghost" onClick={() => setShowAIRoutine(false)}>✕</Button>
              </div>

              <div className="space-y-6">
                {/* Warm Up */}
                <div>
                  <h4 className="font-semibold mb-3 text-lg">🔥 Warm Up</h4>
                  <div className="space-y-2">
                    {aiRoutine.warmUp?.map((pose: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                        <div>
                          <div className="font-medium">{pose.pose}</div>
                          <div className="text-sm text-slate-600">{pose.focus}</div>
                        </div>
                        <Badge variant="outline">{pose.duration}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Sequence */}
                <div>
                  <h4 className="font-semibold mb-3 text-lg">💪 Main Sequence</h4>
                  <div className="space-y-2">
                    {aiRoutine.mainSequence?.map((pose: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
                        <div>
                          <div className="font-medium">{pose.pose}</div>
                          <div className="text-sm text-slate-600">Difficulty: {pose.difficulty}/5</div>
                        </div>
                        <Badge variant="outline">{pose.duration}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cool Down */}
                <div>
                  <h4 className="font-semibold mb-3 text-lg">🧘 Cool Down</h4>
                  <div className="space-y-2">
                    {aiRoutine.coolDown?.map((pose: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                        <div>
                          <div className="font-medium">{pose.pose}</div>
                          <div className="text-sm text-slate-600">{pose.focus}</div>
                        </div>
                        <Badge variant="outline">{pose.duration}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Benefits & Tips */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-green-50">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-green-600" />
                      Benefits
                    </h4>
                    <ul className="text-sm space-y-1">
                      {aiRoutine.benefits?.map((benefit: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-amber-600" />
                      Tips
                    </h4>
                    <ul className="text-sm space-y-1">
                      {aiRoutine.tips?.map((tip: string, idx: number) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Button
                  onClick={() => setShowAIRoutine(false)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  Start Routine
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate('/patient/yoga')}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Yoga & Fitness
            </h1>
            <p className="text-slate-600">Your journey to wellness starts here - powered by AI</p>
          </div>
        </div>
        <Button
          onClick={generateAIRoutine}
          disabled={isGeneratingRoutine}
          className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isGeneratingRoutine ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              AI Routine
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5" />
              <Badge className="bg-white/20">Active</Badge>
            </div>
            <div className="text-3xl">{filteredTrainers.length}</div>
            <div className="text-sm opacity-90">Expert Trainers</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Video className="h-5 w-5" />
              <Badge className="bg-white/20">Library</Badge>
            </div>
            <div className="text-3xl">{mockVideos.length}</div>
            <div className="text-sm opacity-90">Video Sessions</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <CalendarIcon className="h-5 w-5" />
              <Badge className="bg-white/20">Upcoming</Badge>
            </div>
            <div className="text-3xl">{appointments.filter(a => a.status === 'upcoming').length}</div>
            <div className="text-sm opacity-90">Appointments</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Heart className="h-5 w-5" />
              <Badge className="bg-white/20">Saved</Badge>
            </div>
            <div className="text-3xl">{favorites.length}</div>
            <div className="text-sm opacity-90">Favorites</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="trainers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="trainers">Trainers</TabsTrigger>
          <TabsTrigger value="videos">Video Library</TabsTrigger>
          <TabsTrigger value="appointments">My Sessions</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        {/* Trainers Tab */}
        <TabsContent value="trainers" className="space-y-4">
          {/* Search and Filters */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search trainers or specialties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Filter className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-semibold">Yoga Styles</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {yogaStyles.map(style => (
                      <Badge
                        key={style}
                        variant={selectedStyleFilter.includes(style) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelectedStyleFilter(prev =>
                            prev.includes(style)
                              ? prev.filter(s => s !== style)
                              : [...prev, style]
                          );
                        }}
                      >
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trainers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTrainers.map(trainer => (
              <Card key={trainer.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-6xl">{trainer.image}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl mb-1">{trainer.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{trainer.rating}</span>
                            <span>•</span>
                            <span>{trainer.reviews} reviews</span>
                          </div>
                        </div>
                        <Badge className={
                          trainer.availability === 'available' ? 'bg-green-500' :
                          trainer.availability === 'busy' ? 'bg-yellow-500' : 'bg-slate-400'
                        }>
                          {trainer.availability}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {trainer.specialty.map(spec => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 mb-4">{trainer.bio}</p>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-purple-600" />
                      <span>{trainer.experience} years exp</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-purple-600" />
                      <span>{trainer.location.split(',')[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-purple-600" />
                      <span>{trainer.languages.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      <span>₹{trainer.pricePerSession}/session</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    {trainer.modes.map(mode => (
                      <Badge key={mode} variant="outline" className="flex items-center gap-1">
                        {mode === 'virtual' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                        {mode}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setSelectedTrainer(trainer);
                        setShowBookingModal(true);
                      }}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      disabled={trainer.availability === 'offline'}
                    >
                      Book Session
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => onNavigate(`/patient/trainer-profile/${trainer.id}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Video Library Tab */}
        <TabsContent value="videos" className="space-y-4">
          {/* Filters */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-semibold mb-2 block">Style</span>
                    <div className="flex flex-wrap gap-2">
                      {yogaStyles.map(style => (
                        <Badge
                          key={style}
                          variant={selectedStyleFilter.includes(style) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedStyleFilter(prev =>
                              prev.includes(style)
                                ? prev.filter(s => s !== style)
                                : [...prev, style]
                            );
                          }}
                        >
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-semibold mb-2 block">Level</span>
                    <div className="flex flex-wrap gap-2">
                      {levels.map(level => (
                        <Badge
                          key={level}
                          variant={selectedLevelFilter.includes(level) ? 'default' : 'outline'}
                          className="cursor-pointer capitalize"
                          onClick={() => {
                            setSelectedLevelFilter(prev =>
                              prev.includes(level)
                                ? prev.filter(l => l !== level)
                                : [...prev, level]
                            );
                          }}
                        >
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map(video => (
              <Card
                key={video.id}
                className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                onClick={() => playVideo(video)}
              >
                <CardContent className="pt-6">
                  <div className="relative mb-4">
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                      {video.thumbnail}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                        <Play className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(video.id);
                        }}
                        className="p-2 rounded-full bg-white/90 shadow-lg hover:scale-110 transition-transform"
                        aria-label={favorites.includes(video.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart
                          className={`h-4 w-4 ${favorites.includes(video.id) ? 'fill-red-500 text-red-500' : 'text-slate-600'}`}
                        />
                      </button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration} min
                    </div>
                  </div>

                  <h4 className="font-semibold mb-1">{video.title}</h4>
                  <p className="text-sm text-slate-600 mb-2">{video.trainer}</p>

                  <div className="flex items-center gap-2 mb-3 text-xs">
                    <Badge variant="outline" className="capitalize">{video.level}</Badge>
                    <Badge variant="secondary">{video.style}</Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span>{video.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      <span>{video.views.toLocaleString()} views</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map(appointment => {
                const trainer = mockTrainers.find(t => t.id === appointment.trainerId);
                if (!trainer) return null;

                return (
                  <Card key={appointment.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="text-5xl">{trainer.image}</div>
                          <div className="flex-1">
                            <h4 className="text-lg mb-1">{trainer.name}</h4>
                            <p className="text-sm text-slate-600 mb-2">{trainer.specialty.join(', ')}</p>
                            <div className="flex flex-wrap gap-2 text-sm">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4 text-purple-600" />
                                {appointment.date.toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-purple-600" />
                                {appointment.time}
                              </div>
                              <div className="flex items-center gap-1">
                                {appointment.mode === 'virtual' ? 
                                  <Video className="h-4 w-4 text-purple-600" /> : 
                                  <MapPin className="h-4 w-4 text-purple-600" />
                                }
                                {appointment.mode}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={
                            appointment.status === 'upcoming' ? 'bg-green-500' :
                            appointment.status === 'completed' ? 'bg-blue-500' : 'bg-slate-400'
                          }>
                            {appointment.status}
                          </Badge>
                          <div className="text-lg mt-2">₹{appointment.price}</div>
                        </div>
                      </div>

                      {appointment.status === 'upcoming' && (
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                            <Video className="h-4 w-4 mr-2" />
                            Join Session
                          </Button>
                          <Button size="sm" variant="outline">
                            Reschedule
                          </Button>
                          <Button size="sm" variant="outline">
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="py-12 text-center">
                <CalendarIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">No appointments yet</p>
                <Button onClick={() => setShowBookingModal(true)} className="bg-gradient-to-r from-purple-600 to-pink-600">
                  Book Your First Session
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-3">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl mb-1">{appointments.filter(a => a.status === 'completed').length}</div>
                <div className="text-sm text-slate-600">Sessions Completed</div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mx-auto mb-3">
                  <Flame className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl mb-1">0</div>
                <div className="text-sm text-slate-600">Day Streak</div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="pt-6 text-center">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center mx-auto mb-3">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl mb-1">{watchHistory.length}</div>
                <div className="text-sm text-slate-600">Videos Watched</div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Your Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Practice 3 times per week</span>
                    <span className="text-sm font-semibold">0/3</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600" style={{ width: '0%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Complete 10 beginner videos</span>
                    <span className="text-sm font-semibold">{watchHistory.length}/10</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-600 to-pink-600" style={{ width: `${(watchHistory.length / 10) * 100}%` }}></div>
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

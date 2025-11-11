import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Calendar } from '../ui/calendar';
import {
  Star, MapPin, Award, Globe, Clock, Video, Users, Heart,
  MessageSquare, Phone, Mail, Calendar as CalendarIcon,
  CheckCircle, ChevronLeft, ChevronRight, Play, Share,
  Bookmark, ThumbsUp, Flag, Sparkles, Zap, Flame, Wind,
  Target, Trophy, Activity, Brain, ArrowLeft, Send
} from 'lucide-react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'motion/react';
import { AIChatAssistant } from '../common/AIChatAssistant';
import { toast } from 'sonner';

interface TrainerProfileProps {
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
  gallery: string[];
  achievements: string[];
  socialLinks: {
    instagram?: string;
    youtube?: string;
    website?: string;
  };
}

interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

// Mock data - in real app, fetch from API
const mockTrainer: Trainer = {
  id: '1',
  name: 'Priya Sharma',
  specialty: ['Hatha Yoga', 'Prenatal Yoga', 'Meditation', 'Therapeutic Yoga'],
  experience: 8,
  rating: 4.9,
  reviews: 156,
  location: 'Mumbai, Maharashtra, India',
  availability: 'available',
  modes: ['virtual', 'in-person'],
  qualifications: ['RYT 500', 'Prenatal Yoga Certified', 'Meditation Teacher', 'Therapeutic Yoga Specialist'],
  languages: ['English', 'Hindi', 'Marathi'],
  pricePerSession: 800,
  bio: 'Certified yoga instructor with 8+ years of experience specializing in prenatal yoga and meditation. I believe in creating a safe, inclusive space where everyone can explore their practice at their own pace. My approach combines traditional yoga wisdom with modern therapeutic techniques to help students achieve physical strength, mental clarity, and emotional balance.',
  image: '🧘‍♀️',
  gallery: ['🌅', '🧘‍♀️', '🧘‍♀️', '🕉️', '🌸', '🌺', '🌿'],
  achievements: [
    'Featured in Yoga Journal India',
    'Led 500+ prenatal yoga sessions',
    'Certified meditation retreat facilitator',
    'Winner of Best Yoga Teacher Award 2023'
  ],
  socialLinks: {
    instagram: '@priya_yoga_mumbai',
    youtube: 'PriyaYogaOfficial',
    website: 'priyayoga.com'
  }
};

const mockReviews: Review[] = [
  {
    id: '1',
    userName: 'Sarah Johnson',
    userAvatar: '👩',
    rating: 5,
    date: '2024-01-15',
    comment: 'Priya is an amazing instructor! Her prenatal yoga classes helped me stay strong and calm throughout my pregnancy. Highly recommend!',
    helpful: 12
  },
  {
    id: '2',
    userName: 'Rajesh Kumar',
    userAvatar: '👨',
    rating: 5,
    date: '2024-01-10',
    comment: 'The meditation sessions are transformative. Priya has a wonderful way of explaining complex concepts simply.',
    helpful: 8
  },
  {
    id: '3',
    userName: 'Maria Garcia',
    userAvatar: '👩‍🦱',
    rating: 4,
    date: '2024-01-08',
    comment: 'Great virtual sessions. Very attentive to individual needs and modifications.',
    helpful: 6
  }
];

const timeSlots: TimeSlot[] = [
  { time: '06:00 AM', available: true },
  { time: '07:00 AM', available: false },
  { time: '08:00 AM', available: true },
  { time: '09:00 AM', available: true },
  { time: '05:00 PM', available: true },
  { time: '06:00 PM', available: false },
  { time: '07:00 PM', available: true },
  { time: '08:00 PM', available: true }
];

export const TrainerProfile: React.FC<TrainerProfileProps> = ({ onNavigate }) => {
  const { id } = useParams<{ id: string }>();
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedMode, setSelectedMode] = useState<'virtual' | 'in-person'>('virtual');
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const isInView = useInView(heroRef, { once: true });

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTrainer(mockTrainer);
      setReviews(mockReviews);
    }, 500);
  }, [id]);

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select date and time');
      return;
    }
    toast.success('Appointment booked successfully!');
    setShowBookingModal(false);
  };

  const handleSubmitReview = () => {
    if (!reviewComment.trim()) {
      toast.error('Please write a review');
      return;
    }
    toast.success('Review submitted successfully!');
    setShowReviewModal(false);
    setReviewComment('');
    setReviewRating(5);
  };

  const nextGallery = () => {
    setCurrentGalleryIndex((prev) => (prev + 1) % trainer!.gallery.length);
  };

  const prevGallery = () => {
    setCurrentGalleryIndex((prev) => (prev - 1 + trainer!.gallery.length) % trainer!.gallery.length);
  };

  if (!trainer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* AI Chat Assistant */}
      <AIChatAssistant context="trainer-profile" />

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-orange-400/20"
          />
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="absolute w-2 h-2 bg-purple-300 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          onClick={() => onNavigate('/patient/yoga-fitness')}
          className="absolute top-6 left-6 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </motion.button>

        {/* Main Content */}
        <div className="relative z-10 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="text-9xl mb-6"
          >
            {trainer.image}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-6xl font-bold mb-4 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent"
          >
            {trainer.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-2 mb-6"
          >
            {trainer.specialty.map((spec, index) => (
              <motion.div
                key={spec}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                  {spec}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center items-center gap-6 text-lg"
          >
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-300 fill-current" />
              <span>{trainer.rating}</span>
              <span>•</span>
              <span>{trainer.reviews} reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <span>{trainer.experience} years</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{trainer.location.split(',')[0]}</span>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Main Content */}
      <div className="relative -mt-32 z-20">
        <div className="max-w-6xl mx-auto px-6 space-y-8">

          {/* Quick Actions Bar */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 rounded-full ${isFavorite ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'} transition-colors`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-slate-100 text-slate-600"
                >
                  <Share className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-full bg-slate-100 text-slate-600"
                >
                  <Bookmark className="h-5 w-5" />
                </motion.button>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600">₹{trainer.pricePerSession}</div>
                  <div className="text-sm text-slate-600">per session</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowBookingModal(true)}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Book Session
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-2 shadow-xl"
          >
            <div className="flex space-x-2">
              {['overview', 'gallery', 'reviews', 'schedule'].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 px-6 rounded-2xl font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* Bio Section */}
                <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
                  <CardContent className="p-8">
                    <motion.h2
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                    >
                      About {trainer.name}
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="text-lg text-slate-700 leading-relaxed mb-8"
                    >
                      {trainer.bio}
                    </motion.p>

                    {/* Stats Grid */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
                    >
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">{trainer.experience}</div>
                        <div className="text-sm text-slate-600">Years Experience</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-pink-600 mb-2">{trainer.reviews}</div>
                        <div className="text-sm text-slate-600">Happy Students</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600 mb-2">{trainer.rating}</div>
                        <div className="text-sm text-slate-600">Average Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-teal-600 mb-2">{trainer.modes.length}</div>
                        <div className="text-sm text-slate-600">Session Types</div>
                      </div>
                    </motion.div>

                    {/* Qualifications */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                    >
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Award className="h-5 w-5 text-purple-600" />
                        Qualifications & Certifications
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {trainer.qualifications.map((qual, index) => (
                          <motion.div
                            key={qual}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl"
                          >
                            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <span className="text-sm">{qual}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Languages & Location */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="grid md:grid-cols-2 gap-6 mt-8"
                    >
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Globe className="h-4 w-4 text-purple-600" />
                          Languages
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {trainer.languages.map(lang => (
                            <Badge key={lang} variant="outline">{lang}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-purple-600" />
                          Location
                        </h4>
                        <p className="text-slate-600">{trainer.location}</p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl">
                  <CardContent className="p-8">
                    <motion.h3
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-2xl font-bold mb-6 flex items-center gap-2"
                    >
                      <Trophy className="h-6 w-6 text-yellow-600" />
                      Achievements & Recognition
                    </motion.h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {trainer.achievements.map((achievement, index) => (
                        <motion.div
                          key={achievement}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="flex items-start gap-3 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                        >
                          <Trophy className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                          <span className="text-sm">{achievement}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'gallery' && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
                  <CardContent className="p-8">
                    <motion.h2
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                    >
                      Gallery
                    </motion.h2>

                    {/* Main Gallery Image */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6 }}
                      className="relative mb-6"
                    >
                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl flex items-center justify-center text-9xl shadow-2xl">
                        {trainer.gallery[currentGalleryIndex]}
                      </div>

                      {/* Navigation Buttons */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prevGallery}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextGallery}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </motion.button>

                      {/* Indicators */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {trainer.gallery.map((_, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.2 }}
                            onClick={() => setCurrentGalleryIndex(index)}
                            className={`w-3 h-3 rounded-full transition-all ${
                              index === currentGalleryIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>

                    {/* Thumbnail Grid */}
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                      {trainer.gallery.map((image, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentGalleryIndex(index)}
                          className={`aspect-square rounded-xl flex items-center justify-center text-4xl transition-all ${
                            index === currentGalleryIndex
                              ? 'ring-4 ring-purple-500 shadow-lg'
                              : 'hover:shadow-md'
                          }`}
                        >
                          {image}
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Review Summary */}
                <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">Student Reviews</h2>
                        <p className="text-slate-600">{reviews.length} reviews • Average {trainer.rating} stars</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowReviewModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold"
                      >
                        Write Review
                      </motion.button>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-purple-600 mb-2">{trainer.rating}</div>
                        <div className="flex justify-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= trainer.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-slate-600">Based on {trainer.reviews} reviews</p>
                      </div>

                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const count = reviews.filter(r => Math.floor(r.rating) === rating).length;
                          const percentage = (count / reviews.length) * 100;
                          return (
                            <div key={rating} className="flex items-center gap-3">
                              <span className="text-sm w-8">{rating}★</span>
                              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                                />
                              </div>
                              <span className="text-sm text-slate-600 w-8">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual Reviews */}
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">{review.userAvatar}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold">{review.userName}</h4>
                                  <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`h-3 w-3 ${
                                            star <= review.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span>•</span>
                                    <span>{review.date}</span>
                                  </div>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-slate-400 hover:text-slate-600"
                                >
                                  <ThumbsUp className="h-4 w-4" />
                                </motion.button>
                              </div>
                              <p className="text-slate-700 mb-3">{review.comment}</p>
                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <span>{review.helpful} people found this helpful</span>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  className="text-purple-600 hover:text-purple-700"
                                >
                                  Helpful
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'schedule' && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-xl">
                  <CardContent className="p-8">
                    <motion.h2
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                      className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                    >
                      Schedule Availability
                    </motion.h2>

                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Calendar */}
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Select Date</h3>
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
                        <h3 className="text-xl font-semibold mb-4">Available Times</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {timeSlots.map((slot, index) => (
                            <motion.button
                              key={slot.time}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.4, delay: index * 0.05 }}
                              onClick={() => slot.available && setSelectedTime(slot.time)}
                              disabled={!slot.available}
                              className={`p-4 rounded-xl border-2 transition-all ${
                                selectedTime === slot.time
                                  ? 'border-purple-500 bg-purple-50'
                                  : slot.available
                                  ? 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                                  : 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-50'
                              }`}
                            >
                              <div className="font-semibold">{slot.time}</div>
                              <div className={`text-sm ${slot.available ? 'text-green-600' : 'text-slate-400'}`}>
                                {slot.available ? 'Available' : 'Booked'}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Session Mode Selection */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="mt-8"
                    >
                      <h3 className="text-xl font-semibold mb-4">Session Mode</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {trainer.modes.map((mode, index) => (
                          <motion.button
                            key={mode}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            onClick={() => setSelectedMode(mode)}
                            className={`p-6 rounded-xl border-2 transition-all ${
                              selectedMode === mode
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-slate-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {mode === 'virtual' ? <Video className="h-6 w-6" /> : <MapPin className="h-6 w-6" />}
                              <div>
                                <div className="font-semibold capitalize">{mode}</div>
                                <div className="text-sm text-slate-600">
                                  {mode === 'virtual' ? 'Online session' : 'In-person session'}
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Book Session</h3>
                <p className="text-slate-600">Confirm your booking details</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                  <span className="font-semibold">Trainer</span>
                  <span>{trainer.name}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                  <span className="font-semibold">Date</span>
                  <span>{selectedDate?.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                  <span className="font-semibold">Time</span>
                  <span>{selectedTime}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                  <span className="font-semibold">Mode</span>
                  <span className="capitalize">{selectedMode}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                  <span className="font-semibold">Total</span>
                  <span className="text-purple-600 font-bold">₹{trainer.pricePerSession}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 px-6 border border-slate-300 rounded-full font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBookAppointment}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Confirm Booking
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Write a Review</h3>
                <p className="text-slate-600">Share your experience with {trainer.name}</p>
              </div>

              <div className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Rating</label>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setReviewRating(star)}
                        className="text-2xl"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= reviewRating ? 'text-yellow-400 fill-current' : 'text-slate-300'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-semibold mb-3">Your Review</label>
                  <Textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell others about your experience..."
                    className="min-h-24 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 py-3 px-6 border border-slate-300 rounded-full font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmitReview}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Submit Review
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

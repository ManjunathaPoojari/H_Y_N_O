import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Check, Star, Award, Users, Mail, Phone, MapPin, ChevronLeft, ChevronRight, Calendar, Clock, QrCode } from 'lucide-react';
import { useNotifications } from '../../lib/notification-context';

interface PremiumPlansProps {
  onNavigate: (path: string) => void;
}

export const PremiumPlans: React.FC<PremiumPlansProps> = ({ onNavigate }) => {
  const { addNotification } = useNotifications();
  const [selectedNutritionist, setSelectedNutritionist] = useState<any>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    consultationType: '',
    preferredDate: '',
    preferredTime: '',
    healthGoals: ''
  });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleBookConsultation = () => {
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the booking data to your backend
    console.log('Booking submitted:', bookingForm);
    setBookingSubmitted(true);
    addNotification({
      type: 'system',
      title: 'Booking Submitted',
      message: 'Your consultation booking has been submitted successfully. We\'ll contact you soon to confirm your appointment.',
      unread: true
    });
    setTimeout(() => {
      setShowBookingForm(false);
      setSelectedNutritionist(null);
      setBookingSubmitted(false);
      setBookingForm({
        name: '',
        email: '',
        phone: '',
        consultationType: '',
        preferredDate: '',
        preferredTime: '',
        healthGoals: ''
      });
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const handlePaymentComplete = () => {
    setPaymentCompleted(true);
    setTimeout(() => {
      setShowPaymentDialog(false);
      setSelectedPlan(null);
      setPaymentCompleted(false);
    }, 3000);
  };

  const plans = [
    {
      name: 'Basic Plan',
      price: '₹799/month',
      features: [
        'Personalized meal suggestions based on user profile',
        'Basic daily nutrition tracking',
        'Access to a library of healthy recipes',
        'Weekly progress reports'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Advanced Plan',
      price: '₹1599/month',
      features: [
        'All Basic features',
        'One-on-one virtual coaching sessions (2 per month)',
        'Advanced analytics and insights on nutrition data',
        'Custom meal plans tailored to goals (e.g., weight loss, muscle gain)',
        'Integration with wearable devices for automatic tracking'
      ],
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Elite Plan',
      price: '₹2399/month',
      features: [
        'All Advanced features',
        'Unlimited coaching sessions',
        'Priority support and 24/7 chat access',
        'Exclusive premium recipes and expert tips',
        'Family plan option (up to 4 members)'
      ],
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const nutritionists = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      specialty: 'Clinical Nutritionist',
      experience: '8 years',
      rating: 4.9,
      qualifications: 'MSc in Clinical Nutrition, PhD in Dietetics',
      languages: 'English, Hindi, Gujarati',
      email: 'priya.sharma@nutritrack.com',
      phone: '+91-98765-43210',
      location: 'Mumbai, Maharashtra',
      bio: 'Dr. Priya Sharma is a renowned clinical nutritionist with over 8 years of experience in helping patients achieve optimal health through personalized nutrition plans. She specializes in managing chronic conditions like diabetes, hypertension, and metabolic disorders.',
      achievements: ['Published 15+ research papers', 'Certified Diabetes Educator', 'Member of Indian Dietetic Association'],
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
      icon: Star,
      color: 'text-yellow-500'
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      specialty: 'Sports Nutritionist',
      experience: '12 years',
      rating: 4.8,
      qualifications: 'MSc in Sports Nutrition, Certified Strength & Conditioning Specialist',
      languages: 'English, Hindi, Tamil',
      email: 'rajesh.kumar@nutritrack.com',
      phone: '+91-87654-32109',
      location: 'Chennai, Tamil Nadu',
      bio: 'Dr. Rajesh Kumar is a leading sports nutritionist who has worked with professional athletes and sports teams. His expertise lies in optimizing athletic performance through evidence-based nutrition strategies.',
      achievements: ['Consultant to Indian Cricket Team', 'Published book on Sports Nutrition', 'International Sports Nutrition Association Member'],
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face',
      icon: Award,
      color: 'text-blue-500'
    },
    {
      id: 3,
      name: 'Dr. Pranav Patel',
      specialty: 'Dietetics Specialist',
      experience: '10 years',
      rating: 4.9,
      qualifications: 'MSc in Food Science & Nutrition, RD (Registered Dietitian)',
      languages: 'English, Hindi, Marathi',
      email: 'pranav.patel@nutritrack.com',
      phone: '+91-76543-21098',
      location: 'Pune, Maharashtra',
      bio: 'Dr. Pranav Patel is a registered dietitian with extensive experience in pediatric and geriatric nutrition. She focuses on creating sustainable, long-term dietary solutions for all age groups.',
      achievements: ['Best Dietitian Award 2022', 'Pediatric Nutrition Specialist', 'Author of 3 nutrition books'],
      photo: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=300&h=300&fit=crop&crop=face',
      icon: Users,
      color: 'text-green-500'
    },
    {
      id: 4,
      name: 'Dr. Amit Singh',
      specialty: 'Weight Management Specialist',
      experience: '9 years',
      rating: 4.7,
      qualifications: 'MSc in Nutrition & Dietetics, Certified Weight Management Consultant',
      languages: 'English, Hindi, Punjabi',
      email: 'amit.singh@nutritrack.com',
      phone: '+91-65432-10987',
      location: 'Delhi, NCR',
      bio: 'Dr. Amit Singh specializes in weight management and obesity treatment. He combines medical nutrition therapy with behavioral counseling to help patients achieve sustainable weight loss.',
      achievements: ['5000+ successful weight loss cases', 'Certified Bariatric Nutritionist', 'Media nutrition expert'],
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      icon: Star,
      color: 'text-purple-500'
    },
    {
      id: 5,
      name: 'Dr. Kiran Reddy',
      specialty: 'Maternal & Child Nutrition',
      experience: '11 years',
      rating: 4.8,
      qualifications: 'MSc in Community Nutrition, IBCLC (International Board Certified Lactation Consultant)',
      languages: 'English, Hindi, Telugu',
      email: 'kiran.reddy@nutritrack.com',
      phone: '+91-54321-09876',
      location: 'Hyderabad, Telangana',
      bio: 'Dr. Kiran Reddy is an expert in maternal and child nutrition, specializing in pregnancy nutrition, lactation support, and pediatric feeding. She helps families establish healthy eating habits from infancy.',
      achievements: ['IBCLC Certified', 'Maternal Nutrition Researcher', 'Parent Education Specialist'],
      photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
      icon: Award,
      color: 'text-pink-500'
    },
    {
      id: 6,
      name: 'Dr. Vikram Joshi',
      specialty: 'Functional Medicine Nutritionist',
      experience: '13 years',
      rating: 4.9,
      qualifications: 'MD in Alternative Medicine, MSc in Functional Nutrition',
      languages: 'English, Hindi, Marathi',
      email: 'vikram.joshi@nutritrack.com',
      phone: '+91-43210-98765',
      location: 'Bangalore, Karnataka',
      bio: 'Dr. Vikram Joshi practices functional medicine nutrition, addressing root causes of health issues through comprehensive nutritional approaches. He specializes in gut health, autoimmune conditions, and hormonal balance.',
      achievements: ['Functional Medicine Certified', 'Gut Health Specialist', 'Published 20+ research articles'],
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
      icon: Users,
      color: 'text-indigo-500'
    },
    {
      id: 7,
      name: 'Dr. Sunita Agarwal',
      specialty: 'Renal Nutrition Specialist',
      experience: '14 years',
      rating: 4.8,
      qualifications: 'MSc in Renal Nutrition, Certified Nephrology Dietitian',
      languages: 'English, Hindi, Bengali',
      email: 'sunita.agarwal@nutritrack.com',
      phone: '+91-32109-87654',
      location: 'Kolkata, West Bengal',
      bio: 'Dr. Sunita Agarwal is a specialist in renal nutrition with extensive experience in managing kidney disease through dietary interventions. She works closely with nephrologists to optimize patient outcomes.',
      achievements: ['Renal Dietitian of the Year 2021', 'Published 12 research papers on CKD', 'ISRN Member'],
      photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&h=300&fit=crop&crop=face',
      icon: Star,
      color: 'text-orange-500'
    },
    {
      id: 8,
      name: 'Dr. Karan Malhotra',
      specialty: 'Cardiac Nutritionist',
      experience: '11 years',
      rating: 4.7,
      qualifications: 'MSc in Cardiac Nutrition, Certified Preventive Cardiology Dietitian',
      languages: 'English, Hindi, Punjabi',
      email: 'karan.malhotra@nutritrack.com',
      phone: '+91-21098-76543',
      location: 'Ahmedabad, Gujarat',
      bio: 'Dr. Karan Malhotra specializes in cardiac nutrition and preventive cardiology. He helps patients with heart conditions and those at risk of cardiovascular disease through targeted nutritional strategies.',
      achievements: ['Cardiac Nutrition Excellence Award', 'Consultant to Apollo Hospitals', 'Author of Heart-Healthy Cookbook'],
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      icon: Award,
      color: 'text-red-500'
    },
    {
      id: 9,
      name: 'Dr. Anjali Gupta',
      specialty: 'Oncology Nutritionist',
      experience: '10 years',
      rating: 4.9,
      qualifications: 'MSc in Oncology Nutrition, Certified Oncology Dietitian',
      languages: 'English, Hindi, Marathi',
      email: 'anjali.gupta@nutritrack.com',
      phone: '+91-10987-65432',
      location: 'Nagpur, Maharashtra',
      bio: 'Dr. Anjali Gupta is dedicated to supporting cancer patients through their treatment journey with specialized nutritional care. She focuses on maintaining nutritional status during chemotherapy and radiation.',
      achievements: ['Oncology Nutrition Specialist Certification', 'Tata Memorial Hospital Consultant', 'Cancer Nutrition Researcher'],
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      id: 10,
      name: 'Dr. Rohit Sharma',
      specialty: 'Geriatric Nutritionist',
      experience: '15 years',
      rating: 4.8,
      qualifications: 'MSc in Geriatric Nutrition, Certified Senior Nutrition Specialist',
      languages: 'English, Hindi, Gujarati',
      email: 'rohit.sharma@nutritrack.com',
      phone: '+91-09876-54321',
      location: 'Jaipur, Rajasthan',
      bio: 'Dr. Rohit Sharma specializes in geriatric nutrition, helping elderly patients maintain health and independence through appropriate dietary interventions. He addresses age-related nutritional challenges.',
      achievements: ['Geriatric Nutrition Pioneer', 'AIIMS Delhi Consultant', 'Published 18 papers on elderly nutrition'],
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
      icon: Star,
      color: 'text-teal-500'
    },
    {
      id: 11,
      name: 'Dr. Pavan Jain',
      specialty: 'Pediatric Nutritionist',
      experience: '9 years',
      rating: 4.9,
      qualifications: 'MSc in Pediatric Nutrition, Certified Child Nutrition Specialist',
      languages: 'English, Hindi, Kannada',
      email: 'pavan.jain@nutritrack.com',
      phone: '+91-98765-12345',
      location: 'Mysore, Karnataka',
      bio: 'Dr. Pavan Jain is passionate about pediatric nutrition and child development. She helps children achieve optimal growth and addresses feeding difficulties and nutritional deficiencies.',
      achievements: ['Pediatric Nutrition Excellence Award', 'Child Nutrition Researcher', 'Author of 2 children\'s nutrition books'],
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face',
      icon: Award,
      color: 'text-pink-600'
    },
    {
      id: 12,
      name: 'Dr. Arjun Kapoor',
      specialty: 'Mental Health Nutritionist',
      experience: '12 years',
      rating: 4.7,
      qualifications: 'MSc in Nutritional Psychiatry, Certified Mental Health Dietitian',
      languages: 'English, Hindi, Malayalam',
      email: 'arjun.kapoor@nutritrack.com',
      phone: '+91-87654-23456',
      location: 'Kochi, Kerala',
      bio: 'Dr. Arjun Kapoor explores the connection between nutrition and mental health. He helps patients with depression, anxiety, and other mental health conditions through nutritional psychiatry approaches.',
      achievements: ['Nutritional Psychiatry Specialist', 'Mental Health Nutrition Researcher', 'TEDx Speaker on Brain Nutrition'],
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face',
      icon: Users,
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Nutritionists Section */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Meet Our Expert Nutritionists & Dietitians
        </h2>

        {/* Nutritionists Slides */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>

          <button
            onClick={() => setCurrentSlide(Math.min(1, currentSlide + 1))}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>

          {/* Slide Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Slide 1: First 6 Nutritionists */}
              <div className="w-full flex-shrink-0">
                <div className="grid md:grid-cols-3 gap-6">
                  {nutritionists.slice(0, 6).map((nutritionist, index) => (
                    <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedNutritionist(nutritionist)}>
                      <CardContent className="p-6">
                        <img
                          src={nutritionist.photo}
                          alt={nutritionist.name}
                          className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-gray-100"
                        />
                        <h3 className="text-xl font-semibold mb-2">{nutritionist.name}</h3>
                        <p className="text-gray-600 mb-2">{nutritionist.specialty}</p>
                        <p className="text-sm text-gray-500 mb-3">{nutritionist.experience} experience</p>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{nutritionist.rating}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Slide 2: Next 6 Nutritionists */}
              <div className="w-full flex-shrink-0">
                <div className="grid md:grid-cols-3 gap-6">
                  {nutritionists.slice(6, 12).map((nutritionist, index) => (
                    <Card key={index + 6} className="text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedNutritionist(nutritionist)}>
                      <CardContent className="p-6">
                        <img
                          src={nutritionist.photo}
                          alt={nutritionist.name}
                          className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-gray-100"
                        />
                        <h3 className="text-xl font-semibold mb-2">{nutritionist.name}</h3>
                        <p className="text-gray-600 mb-2">{nutritionist.specialty}</p>
                        <p className="text-sm text-gray-500 mb-3">{nutritionist.experience} experience</p>
                        <div className="flex items-center justify-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{nutritionist.rating}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentSlide(0)}
              className={`w-3 h-3 rounded-full transition-colors ${currentSlide === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}
            />
            <button
              onClick={() => setCurrentSlide(1)}
              className={`w-3 h-3 rounded-full transition-colors ${currentSlide === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}
            />
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Choose Plans
        </h2>
        <p className="text-lg text-gray-600 text-center mb-8">
          Select the perfect plan for your nutritional journey
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className={`bg-gradient-to-r ${plan.color} text-white`}>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-3xl font-bold">{plan.price}</div>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => handleSelectPlan(plan)}
                >
                  Select Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Nutritionist Detail Dialog */}
      <Dialog open={!!selectedNutritionist} onOpenChange={() => setSelectedNutritionist(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {selectedNutritionist?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedNutritionist && (
            <div className="space-y-6">
              {/* Photo and Basic Info */}
              <div className="flex flex-col items-center text-center">
                <img
                  src={selectedNutritionist.photo}
                  alt={selectedNutritionist.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{selectedNutritionist.specialty}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{selectedNutritionist.rating} rating</span>
                </div>
                <p className="text-gray-600">{selectedNutritionist.experience} experience</p>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedNutritionist.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedNutritionist.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedNutritionist.location}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Qualifications</h4>
                  <p className="text-sm text-gray-600">{selectedNutritionist.qualifications}</p>
                  <h4 className="font-semibold text-lg">Languages</h4>
                  <p className="text-sm text-gray-600">{selectedNutritionist.languages}</p>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h4 className="font-semibold text-lg mb-2">About</h4>
                <p className="text-gray-600 leading-relaxed">{selectedNutritionist.bio}</p>
              </div>

              {/* Achievements */}
              <div>
                <h4 className="font-semibold text-lg mb-2">Key Achievements</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedNutritionist.achievements.map((achievement: string, index: number) => (
                    <li key={index} className="text-gray-600 text-sm">{achievement}</li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-3 pt-4">
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleBookConsultation}>
                  Book Consultation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Form Dialog */}
      <Dialog open={showBookingForm} onOpenChange={() => setShowBookingForm(false)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Book Consultation with {selectedNutritionist?.name}
            </DialogTitle>
          </DialogHeader>

          {bookingSubmitted ? (
            <div className="text-center py-8">
              <Check className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-600 mb-2">Booking Submitted Successfully!</h3>
              <p className="text-gray-600">Thank you for booking a consultation. We'll contact you soon to confirm your appointment.</p>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <Input
                    type="text"
                    value={bookingForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    value={bookingForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    value={bookingForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Type</label>
                  <Select value={bookingForm.consultationType} onValueChange={(value: string) => handleInputChange('consultationType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select consultation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initial">Initial Consultation</SelectItem>
                      <SelectItem value="followup">Follow-up Consultation</SelectItem>
                      <SelectItem value="nutrition-plan">Nutrition Plan Review</SelectItem>
                      <SelectItem value="dietary-counseling">Dietary Counseling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={bookingForm.preferredDate}
                      onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Select value={bookingForm.preferredTime} onValueChange={(value: string) => handleInputChange('preferredTime', value)}>
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                        <SelectItem value="17:00">5:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Goals & Concerns</label>
                <Textarea
                  value={bookingForm.healthGoals}
                  onChange={(e) => handleInputChange('healthGoals', e.target.value)}
                  required
                  placeholder="Please describe your health goals, current dietary habits, and any specific concerns you'd like to address..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowBookingForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Book Consultation
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={() => setShowPaymentDialog(false)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Complete Payment
            </DialogTitle>
          </DialogHeader>

          {paymentCompleted ? (
            <div className="text-center py-8">
              <Check className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-600 mb-2">Payment Successful!</h3>
              <p className="text-gray-600">Thank you for subscribing to the {selectedPlan?.name}. Your plan is now active.</p>
            </div>
          ) : (
            selectedPlan && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">{selectedPlan.name}</h3>
                  <p className="text-2xl font-bold text-blue-600">{selectedPlan.price}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold">Plan Features:</h4>
                  <ul className="space-y-2">
                    {selectedPlan.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="text-center">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
                      onClick={handlePaymentComplete}
                    >
                      <QrCode className="h-5 w-5" />
                      Scan
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">Use your phone's camera to scan and pay</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowPaymentDialog(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handlePaymentComplete}>
                    Complete Payment
                  </Button>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

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
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

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
      name: 'Go Free',
      price: 'Free',
      features: [
        'Basic meal suggestions',
        'Limited recipe access',
        'Basic nutrition tracking',
        'Access to community forum',
        'Daily nutrition tips',
        'Basic progress tracking'
      ],
      color: 'from-blue-500 to-blue-600'
    },
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
        'Custom meal plans tailored to goals (e.g., weight loss, muscle gain)'
      ],
      color: 'from-blue-500 to-blue-600'
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
      <h1 className="text-3xl font-bold text-center mb-8">Choose Plans</h1>
      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${plan.color} text-white`}>
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <div className="text-2xl font-bold">{plan.price}</div>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button onClick={() => handleSelectPlan(plan)} className="w-full">
                Select Plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Nutritionists Carousel */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-8">Our Expert Nutritionists</h2>
        <div className="relative overflow-hidden rounded-lg">
          <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {/* Slide 1 */}
            <div className="flex-shrink-0 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {nutritionists.slice(0, 4).map((nutritionist) => (
                <Card key={nutritionist.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <img src={nutritionist.photo} alt={nutritionist.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
                    <h3 className="font-bold text-lg">{nutritionist.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{nutritionist.specialty}</p>
                    <div className="flex items-center justify-center mb-2">
                      <nutritionist.icon className={`h-4 w-4 mr-1 ${nutritionist.color}`} />
                      <span className="text-sm">{nutritionist.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{nutritionist.experience}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Slide 2 */}
            <div className="flex-shrink-0 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {nutritionists.slice(4, 8).map((nutritionist) => (
                <Card key={nutritionist.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <img src={nutritionist.photo} alt={nutritionist.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
                    <h3 className="font-bold text-lg">{nutritionist.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{nutritionist.specialty}</p>
                    <div className="flex items-center justify-center mb-2">
                      <nutritionist.icon className={`h-4 w-4 mr-1 ${nutritionist.color}`} />
                      <span className="text-sm">{nutritionist.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{nutritionist.experience}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Slide 3 */}
            <div className="flex-shrink-0 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
              {nutritionists.slice(8, 12).map((nutritionist) => (
                <Card key={nutritionist.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <img src={nutritionist.photo} alt={nutritionist.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
                    <h3 className="font-bold text-lg">{nutritionist.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{nutritionist.specialty}</p>
                    <div className="flex items-center justify-center mb-2">
                      <nutritionist.icon className={`h-4 w-4 mr-1 ${nutritionist.color}`} />
                      <span className="text-sm">{nutritionist.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">{nutritionist.experience}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <button
            onClick={() => setCurrentSlide(Math.min(2, currentSlide + 1))}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentSlide(0)}
              className={`w-3 h-3 rounded-full transition-colors ${currentSlide === 0 ? 'bg-blue-600' : 'bg-gray-300'}`}
            />
            <button
              onClick={() => setCurrentSlide(1)}
              className={`w-3 h-3 rounded-full transition-colors ${currentSlide === 1 ? 'bg-blue-600' : 'bg-gray-300'}`}
            />
            <button
              onClick={() => setCurrentSlide(2)}
              className={`w-3 h-3 rounded-full transition-colors ${currentSlide === 2 ? 'bg-blue-600' : 'bg-gray-300'}`}
            />
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          {paymentCompleted ? (
            <div className="text-center">
              <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Payment Successful!</h3>
              <p className="text-gray-600">Thank you for subscribing to {selectedPlan?.name}.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <Input placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <Input placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <Input placeholder="123" />
                </div>
              </div>
              <Button onClick={handlePaymentComplete} className="w-full">
                Pay {selectedPlan?.price}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

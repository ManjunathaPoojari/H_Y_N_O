import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChefHat, Calendar, Crown, Star, ChevronLeft, ChevronRight, Mail, Phone, MapPin, Check, Clock, Award, Users, Package, Heart, Video } from 'lucide-react';
import { useNotifications } from '../../lib/notification-context';

interface NutritionWellnessProps {
  onNavigate: (path: string) => void;
}

export const NutritionWellness: React.FC<NutritionWellnessProps> = ({ onNavigate }) => {
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({});
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);


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

  const categories = [
    { id: 1, name: 'Diabetes' },
    { id: 2, name: 'Hypertension' },
    { id: 3, name: 'Weight Loss' },
    { id: 4, name: 'Digestive Issues' },
    { id: 5, name: 'Heart Health' }
  ];

  const recipes = [
    {
      id: 1,
      name: 'Quinoa Salad with Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      calories: 320,
      dietaryPrefs: ['Vegan', 'Gluten-Free'],
      categoryId: 1,
      ingredients: ['1 cup quinoa', '2 cups mixed vegetables', '1 tbsp olive oil', 'Lemon juice', 'Fresh herbs'],
      instructions: 'Cook quinoa according to package. Chop vegetables and mix with cooked quinoa. Dress with olive oil and lemon juice. Garnish with herbs.',
      prepTime: '20 mins'
    },
    {
      id: 2,
      name: 'Grilled Chicken with Broccoli',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      calories: 280,
      dietaryPrefs: ['Low-Carb', 'High-Protein'],
      categoryId: 1,
      ingredients: ['4 oz chicken breast', '2 cups broccoli', '1 tbsp olive oil', 'Garlic powder', 'Salt and pepper'],
      instructions: 'Season chicken with garlic powder, salt, and pepper. Grill chicken until cooked through. Steam broccoli and serve together.',
      prepTime: '25 mins'
    },
    {
      id: 3,
      name: 'Oatmeal with Berries',
      imageUrl: 'https://images.unsplash.com/photo-1505252585461-9044a396130f?w=400&h=300&fit=crop',
      calories: 250,
      dietaryPrefs: ['Vegan', 'Gluten-Free'],
      categoryId: 1,
      ingredients: ['1/2 cup oats', '1 cup almond milk', '1/2 cup mixed berries', '1 tbsp chia seeds', 'Cinnamon'],
      instructions: 'Cook oats in almond milk. Top with berries, chia seeds, and cinnamon. Let sit for 5 minutes before serving.',
      prepTime: '10 mins'
    },
    {
      id: 4,
      name: 'Baked Salmon with Asparagus',
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
      calories: 350,
      dietaryPrefs: ['Omega-3 Rich', 'Low-Carb'],
      categoryId: 2,
      ingredients: ['6 oz salmon fillet', '1 bunch asparagus', '1 tbsp olive oil', 'Lemon slices', 'Herbs'],
      instructions: 'Place salmon and asparagus on baking sheet. Drizzle with olive oil and top with lemon slices. Bake at 400°F for 15-20 minutes.',
      prepTime: '30 mins'
    },
    {
      id: 5,
      name: 'Spinach and Mushroom Stir-Fry',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
      calories: 180,
      dietaryPrefs: ['Vegan', 'Low-Calorie'],
      categoryId: 2,
      ingredients: ['2 cups spinach', '1 cup mushrooms', '1 tbsp olive oil', 'Garlic', 'Soy sauce (low-sodium)'],
      instructions: 'Heat olive oil in pan. Add garlic and mushrooms, cook until tender. Add spinach and soy sauce. Stir until wilted.',
      prepTime: '15 mins'
    },
    {
      id: 6,
      name: 'Greek Yogurt Parfait',
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
      calories: 220,
      dietaryPrefs: ['Probiotic', 'High-Protein'],
      categoryId: 2,
      ingredients: ['1 cup Greek yogurt', '1/2 cup granola', '1/2 cup berries', '1 tbsp honey', 'Nuts'],
      instructions: 'Layer yogurt, granola, and berries in a glass. Drizzle with honey and top with nuts.',
      prepTime: '5 mins'
    },
    {
      id: 7,
      name: 'Turkey Lettuce Wraps',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      calories: 240,
      dietaryPrefs: ['Low-Carb', 'High-Protein'],
      categoryId: 3,
      ingredients: ['4 oz ground turkey', 'Large lettuce leaves', '1/2 cup vegetables', '1 tbsp soy sauce', 'Ginger'],
      instructions: 'Cook ground turkey with vegetables and seasonings. Spoon into lettuce leaves and roll up.',
      prepTime: '20 mins'
    },
    {
      id: 8,
      name: 'Zucchini Noodles with Pesto',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
      calories: 190,
      dietaryPrefs: ['Vegan', 'Low-Carb'],
      categoryId: 3,
      ingredients: ['2 zucchinis', '2 tbsp pesto', 'Cherry tomatoes', 'Basil leaves', 'Olive oil'],
      instructions: 'Spiralize zucchinis. Toss with pesto and halved tomatoes. Garnish with basil.',
      prepTime: '15 mins'
    },
    {
      id: 9,
      name: 'Chickpea Salad',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
      calories: 280,
      dietaryPrefs: ['Vegan', 'High-Fiber'],
      categoryId: 3,
      ingredients: ['1 can chickpeas', 'Cucumber', 'Tomatoes', 'Red onion', 'Lemon dressing'],
      instructions: 'Drain and rinse chickpeas. Chop vegetables and mix together. Dress with lemon juice and olive oil.',
      prepTime: '10 mins'
    },
    {
      id: 10,
      name: 'Ginger Tea with Lemon',
      imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
      calories: 30,
      dietaryPrefs: ['Caffeine-Free', 'Anti-Inflammatory'],
      categoryId: 4,
      ingredients: ['1 inch ginger', '1 cup water', 'Lemon slice', 'Honey (optional)'],
      instructions: 'Slice ginger and boil in water for 10 minutes. Add lemon slice and honey if desired.',
      prepTime: '15 mins'
    },
    {
      id: 11,
      name: 'Banana Oat Smoothie',
      imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e9c9b90c?w=400&h=300&fit=crop',
      calories: 200,
      dietaryPrefs: ['Vegan', 'Quick'],
      categoryId: 4,
      ingredients: ['1 banana', '1/2 cup oats', '1 cup almond milk', '1 tbsp peanut butter', 'Cinnamon'],
      instructions: 'Blend all ingredients until smooth. Serve immediately.',
      prepTime: '5 mins'
    },
    {
      id: 12,
      name: 'Sweet Potato Mash',
      imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
      calories: 150,
      dietaryPrefs: ['Vegan', 'Gluten-Free'],
      categoryId: 4,
      ingredients: ['2 sweet potatoes', '1 tbsp olive oil', 'Salt', 'Pepper', 'Herbs'],
      instructions: 'Bake sweet potatoes until soft. Mash with olive oil and seasonings.',
      prepTime: '45 mins'
    },
    {
      id: 13,
      name: 'Avocado Toast with Eggs',
      imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
      calories: 320,
      dietaryPrefs: ['High-Protein', 'Healthy Fats'],
      categoryId: 5,
      ingredients: ['2 slices whole grain bread', '1 avocado', '2 eggs', 'Cherry tomatoes', 'Salt and pepper'],
      instructions: 'Toast bread and mash avocado on top. Poach eggs and place on avocado. Garnish with tomatoes.',
      prepTime: '15 mins'
    },
    {
      id: 14,
      name: 'Berry Smoothie Bowl',
      imageUrl: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop',
      calories: 250,
      dietaryPrefs: ['Antioxidant-Rich', 'Vegan'],
      categoryId: 5,
      ingredients: ['1 cup mixed berries', '1 banana', '1/2 cup yogurt', 'Granola', 'Chia seeds'],
      instructions: 'Blend berries, banana, and yogurt. Pour into bowl and top with granola and chia seeds.',
      prepTime: '10 mins'
    },
    {
      id: 15,
      name: 'Grilled Vegetable Skewers',
      imageUrl: 'https://images.unsplash.com/photo-1551782450-17144efb5723?w=400&h=300&fit=crop',
      calories: 180,
      dietaryPrefs: ['Vegan', 'Low-Calorie'],
      categoryId: 5,
      ingredients: ['Mixed vegetables', 'Olive oil', 'Herbs', 'Garlic', 'Lemon juice'],
      instructions: 'Cut vegetables into chunks and thread onto skewers. Brush with olive oil mixture and grill until tender.',
      prepTime: '25 mins'
    }
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || categories.find(cat => cat.id === recipe.categoryId)?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleLike = (recipeId: number) => {
    setLikes(prev => ({ ...prev, [recipeId]: !prev[recipeId] }));
  };

  return (
    <div className="space-y-8 p-6">
      {/* Hero Section */}
      <section className="text-center py-48 px-8 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl mb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl mb-6 text-black font-bold tracking-tight leading-tight">
            Transform Your Wellness Journey
          </h1>
          <div className="space-y-2">
            <p className="text-gray-600 text-xl md:text-2xl font-light leading-relaxed">
              Personalized nutrition plans, smart tracking,
            </p>
            <p className="text-gray-600 text-xl md:text-2xl font-light leading-relaxed">
              and expert guidance to help you achieve your health goals
            </p>
          </div>
          <div className="flex justify-center mt-20">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3" onClick={handleBookConsultation}>
              Consult an Expert
            </Button>
          </div>
        </div>
      </section>

      {/* Your Wellness Toolbox Heading */}
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Your Wellness Toolbox
      </h2>

      {/* Nutrition Dashboard Boxes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: ChefHat,
            title: 'Healthy Recipes',
            description: 'Discover healthy recipes tailored to your needs\nExplore nutritious meal ideas and cooking tips',
            path: '/patient/nutrition/recipes',
            color: 'text-green-600'
          },
          {
            icon: Package,
            title: ' Meal Kits',
            description: 'Convenient meal planning with pre-portioned ingredients\nSave time with ready-to-cook meal solutions',
            path: '/patient/nutrition/meal-kits',
            color: 'text-blue-600'
          },
          {
            icon: Calendar,
<<<<<<< HEAD
            title: 'Daily Tracker',
            description: 'Track your daily nutrition, wellness goals, and water intake',
            path: '/patient/nutrition/daily-tracker',
=======
            title: ' Track Progress',
            description: 'Monitor your daily nutrition and wellness goals\nTrack achievements and stay motivated',
            path: '/patient/nutrition/track-progress',
>>>>>>> 4e65214484a86abdfbe7623e8fd6fbe48db07b60
            color: 'text-purple-400'
          },
          {
            icon: Crown,
            title: 'Premium Plans',
            description: 'Advanced nutrition coaching and premium features\nUnlock personalized insights and expert support',
            path: '/patient/nutrition/premium',
            color: 'text-orange-600'
          }
        ].map((box, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onNavigate(box.path)}
          >
            <CardContent className="p-6 text-center">
              <box.icon className={`h-12 w-12 mx-auto mb-4 ${box.color}`} />
              <h3 className="text-lg font-semibold mb-2">{box.title}</h3>
              <p className="text-gray-600 text-sm">{box.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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

      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
        Join Our Wellness Community
      </h2>

      <p className="text-center text-gray-600 mb-8">
        Share your journey, get support, and inspire others on their path to better health
      </p>

      {/* Community Features Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            icon: Users,
            title: 'Supportive Community',
            description: 'Connect with like-minded individuals on similar wellness journeys',
            color: 'text-blue-600'
          },
          {
            icon: Award,
            title: 'Wellness Challenges',
            description: 'Participate in group challenges to stay motivated and accountable',
            color: 'text-green-600'
          },
          {
            icon: Video,
            title: 'Live Events',
            description: 'Join cooking demos, expert Q&As, and wellness workshops',
            color: 'text-purple-600'
          },
          {
            icon: Heart,
            title: 'Support Groups',
            description: 'Specialized groups for specific health goals and conditions',
            color: 'text-pink-600'
          }
        ].map((card, index) => (
          <Card
            key={index}
            className="cursor-default hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6 text-center">
              <card.icon className={`h-12 w-12 mx-auto mb-4 ${card.color}`} />
              <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Join Community Button */}
      <div className="flex justify-center mb-12">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold" onClick={() => onNavigate('/patient/community')}>
          Join Community
        </Button>
      </div>

      {/* Recipe Detail Dialog */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {selectedRecipe?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedRecipe && (
            <div className="space-y-6">
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.name}
                className="w-full h-64 object-cover rounded-lg"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Nutrition Info</h4>
                  <p className="text-gray-600">{selectedRecipe.calories} calories</p>
                  <p className="text-gray-600">Prep time: {selectedRecipe.prepTime}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Dietary Preferences</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedRecipe.dietaryPrefs.map((pref: string, index: number) => (
                      <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Ingredients</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedRecipe.ingredients.map((ingredient: string, index: number) => (
                    <li key={index} className="text-gray-600">{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Instructions</h4>
                <p className="text-gray-600 leading-relaxed">{selectedRecipe.instructions}</p>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <Button
                  onClick={() => toggleLike(selectedRecipe.id)}
                  variant={likes[selectedRecipe.id] ? "default" : "outline"}
                  className={likes[selectedRecipe.id] ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <Heart className={`h-4 w-4 mr-2 ${likes[selectedRecipe.id] ? 'fill-current' : ''}`} />
                  {likes[selectedRecipe.id] ? 'Liked' : 'Like Recipe'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(selectedNutritionist.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="font-medium ml-1">{selectedNutritionist.rating} rating</span>
                  <span className="text-sm text-gray-500 ml-1">(25 reviews)</span>
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
    </div>
  );
};

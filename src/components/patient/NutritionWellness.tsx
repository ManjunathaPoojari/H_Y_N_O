import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import {
  Apple, Droplet, TrendingUp, Heart, Search, Filter,
  Plus, Check, X, Award, Clock, Target, Sparkles,
  ChefHat, Flame, Activity, AlertCircle, Star, Bell,
  Calendar, ChevronRight, Trophy, Zap, Brain, Wand2, Lock, Lightbulb, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NutritionHeroCarousel } from './nutrition/NutritionHeroCarousel';
import { AIChatAssistant } from '../common/AIChatAssistant';
import { aiService } from '../../lib/ai-service';
import { useAppStore } from '../../lib/app-store';
import { useAuth } from '../../lib/auth-context';
import api from '../../lib/api-client';
import { toast } from 'sonner';

interface NutritionWellnessProps {
  onNavigate: (path: string) => void;
}

interface Meal {
  id: string;
  name: string;
  calories: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: string[];
  image: string;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  diseaseCategories: string[];
  dietaryTags: string[];
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  imageUrl?: string;
}

interface UserProfile {
  height: number;
  weight: number;
  age: number;
  gender: string;
  allergies: string[];
  dietaryPreferences: string[];
  bmi: number;
  calorieGoal: number;
  waterGoal: number; // in ml
  activeDietPlan: string;
  healthConditions: string[];
  activityLevel: string;
}

const mockMeals: Meal[] = [
  {
    id: '1',
    name: 'Masala Oats with Vegetables',
    calories: 320,
    category: 'breakfast',
    ingredients: ['Oats', 'Mixed Vegetables', 'Turmeric', 'Cumin', 'Ginger'],
    image: '🥣',
    protein: 12,
    carbs: 45,
    fats: 8,
    fiber: 7,
    diseaseCategories: ['Diabetes', 'Weight Loss', 'Heart Health', 'PCOS'],
    dietaryTags: ['Vegetarian', 'Gluten-Free', 'Low-Fat'],
    cookingTime: 15,
    difficulty: 'easy',
    servings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'Moong Dal Chilla',
    calories: 280,
    category: 'breakfast',
    ingredients: ['Moong Dal', 'Onions', 'Tomatoes', 'Green Chilies', 'Coriander'],
    image: '🥞',
    protein: 18,
    carbs: 35,
    fats: 6,
    fiber: 8,
    diseaseCategories: ['Diabetes', 'Thyroid', 'Weight Loss'],
    dietaryTags: ['Vegetarian', 'High-Protein', 'Gluten-Free'],
    cookingTime: 20,
    difficulty: 'easy',
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    name: 'Brown Rice with Dal Tadka',
    calories: 450,
    category: 'lunch',
    ingredients: ['Brown Rice', 'Toor Dal', 'Ghee', 'Cumin', 'Garlic', 'Curry Leaves'],
    image: '🍛',
    protein: 15,
    carbs: 68,
    fats: 12,
    fiber: 9,
    diseaseCategories: ['Diabetes', 'Weight Management', 'Digestive Health'],
    dietaryTags: ['Vegetarian', 'Whole Grain', 'Low-GI'],
    cookingTime: 35,
    difficulty: 'medium',
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    name: 'Grilled Chicken Salad',
    calories: 380,
    category: 'lunch',
    ingredients: ['Chicken Breast', 'Lettuce', 'Cucumber', 'Tomatoes', 'Olive Oil', 'Lemon'],
    image: '🥗',
    protein: 42,
    carbs: 12,
    fats: 18,
    fiber: 5,
    diseaseCategories: ['Weight Loss', 'Muscle Building', 'Keto', 'Low-Carb'],
    dietaryTags: ['Non-Vegetarian', 'High-Protein', 'Low-Carb', 'Keto'],
    cookingTime: 25,
    difficulty: 'easy',
    servings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    name: 'Palak Paneer with Roti',
    calories: 420,
    category: 'dinner',
    ingredients: ['Spinach', 'Paneer', 'Whole Wheat', 'Tomatoes', 'Spices'],
    image: '🍽️',
    protein: 22,
    carbs: 38,
    fats: 20,
    fiber: 8,
    diseaseCategories: ['Thyroid', 'Anemia', 'Bone Health'],
    dietaryTags: ['Vegetarian', 'High-Protein', 'Iron-Rich'],
    cookingTime: 30,
    difficulty: 'medium',
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    name: 'Mixed Nuts and Seeds',
    calories: 180,
    category: 'snack',
    ingredients: ['Almonds', 'Walnuts', 'Pumpkin Seeds', 'Sunflower Seeds'],
    image: '🥜',
    protein: 8,
    carbs: 10,
    fats: 14,
    fiber: 4,
    diseaseCategories: ['Heart Health', 'Brain Health', 'PCOS', 'Hair Fall'],
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Keto'],
    cookingTime: 0,
    difficulty: 'easy',
    servings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '7',
    name: 'Greek Yogurt with Berries',
    calories: 220,
    category: 'snack',
    ingredients: ['Greek Yogurt', 'Blueberries', 'Strawberries', 'Honey', 'Chia Seeds'],
    image: '🍨',
    protein: 18,
    carbs: 28,
    fats: 5,
    fiber: 4,
    diseaseCategories: ['Digestive Health', 'Gut Health', 'Immunity'],
    dietaryTags: ['Vegetarian', 'High-Protein', 'Probiotic'],
    cookingTime: 5,
    difficulty: 'easy',
    servings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '8',
    name: 'Quinoa Vegetable Pulao',
    calories: 390,
    category: 'dinner',
    ingredients: ['Quinoa', 'Mixed Vegetables', 'Spices', 'Cashews'],
    image: '🍚',
    protein: 14,
    carbs: 52,
    fats: 12,
    fiber: 8,
    diseaseCategories: ['Diabetes', 'Weight Loss', 'Gluten Intolerance'],
    dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free', 'High-Fiber'],
    cookingTime: 30,
    difficulty: 'medium',
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '9',
    name: 'Avocado Toast with Egg',
    calories: 350,
    category: 'breakfast',
    ingredients: ['Whole Grain Bread', 'Avocado', 'Egg', 'Chili Flakes'],
    image: '🥑',
    protein: 14,
    carbs: 28,
    fats: 18,
    fiber: 9,
    diseaseCategories: ['Heart Health', 'Weight Loss'],
    dietaryTags: ['Vegetarian', 'High-Fiber'],
    cookingTime: 10,
    difficulty: 'easy',
    servings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414395d8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '10',
    name: 'Grilled Salmon with Asparagus',
    calories: 450,
    category: 'dinner',
    ingredients: ['Salmon Fillet', 'Asparagus', 'Lemon', 'Olive Oil', 'Garlic'],
    image: '🐟',
    protein: 38,
    carbs: 8,
    fats: 24,
    fiber: 4,
    diseaseCategories: ['Heart Health', 'Brain Health', 'Diabetes'],
    dietaryTags: ['Non-Vegetarian', 'Keto', 'Gluten-Free', 'High-Protein'],
    cookingTime: 20,
    difficulty: 'medium',
    servings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '11',
    name: 'Fresh Fruit Salad',
    calories: 180,
    category: 'snack',
    ingredients: ['Watermelon', 'Pineapple', 'Mint', 'Lime'],
    image: '🍉',
    protein: 2,
    carbs: 45,
    fats: 0,
    fiber: 5,
    diseaseCategories: ['Immunity', 'Digestive Health', 'Hydration'],
    dietaryTags: ['Vegan', 'Gluten-Free', 'Low-Fat'],
    cookingTime: 10,
    difficulty: 'easy',
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '12',
    name: 'Lentil Soup',
    calories: 320,
    category: 'lunch',
    ingredients: ['Lentils', 'Carrots', 'Celery', 'Onion', 'Thyme'],
    image: '🥣',
    protein: 18,
    carbs: 40,
    fats: 6,
    fiber: 14,
    diseaseCategories: ['Heart Health', 'Weight Loss', 'Diabetes'],
    dietaryTags: ['Vegan', 'Gluten-Free', 'High-Fiber', 'High-Protein'],
    cookingTime: 40,
    difficulty: 'medium',
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23acbe32263b?auto=format&fit=crop&q=80&w=800'
  }
];

const diseaseCategories = [
  'Diabetes', 'Thyroid', 'PCOS', 'Weight Loss', 'Weight Gain', 'Heart Health',
  'Acne', 'Hair Fall', 'Anemia', 'Digestive Health', 'Bone Health', 'Immunity',
  'Brain Health', 'Muscle Building', 'Keto', 'Low-Carb', 'Gut Health'
];

const dietaryTags = [
  'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Gluten-Free',
  'Lactose-Free', 'High-Protein', 'Low-Carb', 'Keto', 'Low-Fat'
];

export const NutritionWellness: React.FC<NutritionWellnessProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { nutritionPlans, addNutritionPlan, updateNutritionPlan } = useAppStore();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [planId, setPlanId] = useState<string | null>(null);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    height: 170,
    weight: 70,
    age: 28,
    gender: 'Male',
    allergies: [],
    dietaryPreferences: ['Vegetarian'],
    bmi: 24.2,
    calorieGoal: 2000,
    waterGoal: 3000,
    activeDietPlan: 'Weight Maintenance',
    healthConditions: [],
    activityLevel: 'moderate'
  });

  const [selectedMeals, setSelectedMeals] = useState<{ [key: string]: { meal: Meal; status: 'pending' | 'done' | 'skipped' } }>({});
  const [waterIntake, setWaterIntake] = useState(0); // in ml
  const [showWaterReminder, setShowWaterReminder] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiseaseFilter, setSelectedDiseaseFilter] = useState<string[]>([]);
  const [selectedDietaryFilter, setSelectedDietaryFilter] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showSetupForm, setShowSetupForm] = useState(false);
  const [showAllRecipes, setShowAllRecipes] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [dailyTip, setDailyTip] = useState('');
  const [waterStreak, setWaterStreak] = useState(0);
  const [aiMealPlan, setAiMealPlan] = useState<any>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [selectedMealForAnalysis, setSelectedMealForAnalysis] = useState<Meal | null>(null);

  // Load existing plan and meals
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch meals from library
        const fetchedMeals = await api.nutrition.getMeals();
        setMeals(fetchedMeals && fetchedMeals.length > 0 ? fetchedMeals : mockMeals);

        if (user) {
          const plan = await api.nutrition.getPlanByPatient(user.id);
          if (plan) {
            setPlanId(plan.id);
            setUserProfile({
              ...userProfile,
              bmi: plan.bmi || userProfile.bmi,
              calorieGoal: plan.dailyCalorieGoal || userProfile.calorieGoal,
              waterGoal: plan.dailyWaterGoal || userProfile.waterGoal,
              dietaryPreferences: plan.dietaryRestrictions || userProfile.dietaryPreferences
            });
            setWaterIntake(plan.waterIntake || 0);

            // Map meal items
            if (plan.mealPlanItems) {
              const mapped: any = {};
              plan.mealPlanItems.forEach((item: any) => {
                mapped[item.meal.id] = { meal: item.meal, status: item.status };
              });
              setSelectedMeals(mapped);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load nutrition data", error);
        setMeals(mockMeals); // Fallback to mock
      }
    };
    loadData();
  }, [user]);

  // Persist changes
  const savePlan = async (updatedProfile: UserProfile, updatedWater: number, updatedMeals: any) => {
    if (!user) return;

    const mealPlanItems = Object.entries(updatedMeals).map(([id, data]: [string, any]) => ({
      meal: { id: data.meal.id },
      status: data.status,
      dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' })
    }));

    const planData: any = {
      patientId: user.id,
      bmi: updatedProfile.bmi,
      dailyCalorieGoal: updatedProfile.calorieGoal,
      dailyWaterGoal: updatedProfile.waterGoal,
      dietaryRestrictions: updatedProfile.dietaryPreferences,
      waterIntake: updatedWater,
      mealPlanItems
    };

    try {
      if (planId) {
        await api.nutrition.updatePlan(planId, planData);
      } else {
        const newPlan = await api.nutrition.createPlan(planData);
        setPlanId(newPlan.id);
      }
    } catch (error) {
      console.error("Failed to save plan", error);
    }
  };

  const waterReminderInterval = useRef<NodeJS.Timeout | null>(null);

  // Calculate BMI
  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
  };

  // Calculate calorie goal based on BMI and goals
  const calculateCalorieGoal = (bmi: number, plan: string) => {
    const baseCalories = 2000;
    if (plan === 'Weight Loss') return baseCalories - 500;
    if (plan === 'Weight Gain') return baseCalories + 500;
    if (plan === 'Muscle Building') return baseCalories + 300;
    return baseCalories;
  };

  // Water reminder system
  useEffect(() => {
    waterReminderInterval.current = setInterval(() => {
      if (waterIntake < userProfile.waterGoal) {
        setShowWaterReminder(true);
      }
    }, 45 * 60 * 1000); // 45 minutes

    return () => {
      if (waterReminderInterval.current) {
        clearInterval(waterReminderInterval.current);
      }
    };
  }, [waterIntake, userProfile.waterGoal]);

  // Check if water goal is met
  useEffect(() => {
    if (waterIntake >= userProfile.waterGoal && waterIntake > 0) {
      setShowCongratulations(true);
      setWaterStreak(prev => prev + 1);
      if (!achievements.includes('hydration_hero')) {
        setAchievements(prev => [...prev, 'hydration_hero']);
      }
    }
  }, [waterIntake, userProfile.waterGoal]);

  // Daily nutrition tips
  const tips = [
    "Start your day with a glass of warm water with lemon for better digestion.",
    "Include colorful vegetables in every meal for diverse nutrients.",
    "Protein-rich breakfast helps maintain energy levels throughout the day.",
    "Stay hydrated - drink at least 8 glasses of water daily.",
    "Healthy fats like nuts and seeds support brain health.",
    "Eating slowly and mindfully improves digestion and satisfaction.",
    "Plan your meals in advance to make healthier choices."
  ];

  useEffect(() => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setDailyTip(randomTip);
  }, []);

  // Filter meals
  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDisease = selectedDiseaseFilter.length === 0 ||
      selectedDiseaseFilter.some(disease => meal.diseaseCategories.includes(disease));

    const matchesDietary = selectedDietaryFilter.length === 0 ||
      selectedDietaryFilter.some(tag => meal.dietaryTags.includes(tag));

    return matchesSearch && matchesDisease && matchesDietary;
  });

  const handleMealAction = (mealId: string, meal: Meal, action: 'done' | 'skipped' | 'pending') => {
    const updated = {
      ...selectedMeals,
      [mealId]: { meal, status: action }
    };
    setSelectedMeals(updated);
    savePlan(userProfile, waterIntake, updated);

    if (action === 'done' && !achievements.includes('meal_completed')) {
      setAchievements(prev => [...prev, 'meal_completed']);
    }
  };

  const addWater = (amount: number) => {
    const newIntake = Math.min(waterIntake + amount, userProfile.waterGoal + 1000);
    setWaterIntake(newIntake);
    savePlan(userProfile, newIntake, selectedMeals);
    setShowWaterReminder(false);
  };

  const toggleFavorite = (mealId: string) => {
    setFavorites(prev =>
      prev.includes(mealId)
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
  };

  const totalCaloriesConsumed = Object.values(selectedMeals)
    .filter(item => item.status === 'done')
    .reduce((sum, item) => sum + item.meal.calories, 0);

  const waterPercentage = Math.min((waterIntake / userProfile.waterGoal) * 100, 100);
  const caloriePercentage = Math.min((totalCaloriesConsumed / userProfile.calorieGoal) * 100, 100);

  // AI Functions
  const generateAIMealPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const response = await aiService.getNutritionRecommendations({
        userProfile: {
          ...userProfile,
          healthConditions: selectedDiseaseFilter,
          activityLevel: 'moderate',
        },
        requestType: 'meal-plan',
      });

      if (response.success) {
        setAiMealPlan(response.data);
        setAiInsights(response.data.insights || []);
      }
    } catch (error) {
      console.error('AI meal plan generation error:', error);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const analyzeSelectedMeal = async (meal: Meal) => {
    setSelectedMealForAnalysis(meal);
    setShowAIAnalysis(true);

    try {
      const response = await aiService.getNutritionRecommendations({
        userProfile,
        requestType: 'nutrition-analysis',
        context: { meal },
      });

      if (response.success) {
        // Store analysis results
      }
    } catch (error) {
      console.error('Meal analysis error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 relative">
      {/* Background */}
      <div className="fixed inset-0 bg-white -z-10"></div>

      {/* AI Chat Assistant */}
      <AIChatAssistant context="nutrition" userProfile={userProfile} />

      {/* Hero Carousel */}
      <div className="w-full mb-8">
        <NutritionHeroCarousel onNavigate={onNavigate} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Water Reminder Modal */}
        <AnimatePresence>
          {showWaterReminder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowWaterReminder(false)}
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 max-w-md shadow-2xl"
              >
                <div className="text-center">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Droplet className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl mb-2">Time to Hydrate! 💧</h3>
                  <p className="text-slate-600 mb-6">
                    Remember to drink water. You've consumed {waterIntake}ml out of {userProfile.waterGoal}ml today.
                  </p>
                  <div className="flex gap-3">
                    <Button onClick={() => addWater(250)} className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500">
                      Add 250ml
                    </Button>
                    <Button onClick={() => setShowWaterReminder(false)} variant="outline" className="flex-1">
                      Later
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Congratulations Modal */}
        <AnimatePresence>
          {showCongratulations && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowCongratulations(false)}
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.5, rotate: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl p-8 max-w-md shadow-2xl text-center"
              >
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Trophy className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-3xl mb-2">🎉 Congratulations! 🎉</h3>
                <p className="text-lg text-slate-600 mb-2">
                  You've reached your daily water goal!
                </p>
                <p className="text-sm text-slate-500 mb-6">
                  Streak: {waterStreak} days 🔥
                </p>
                <Button onClick={() => setShowCongratulations(false)} className="bg-gradient-to-r from-green-500 to-emerald-500">
                  Awesome!
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Dashboard Hero */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-900 bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 shadow-2xl p-10 text-white mb-10 transform transition-all hover:scale-[1.01] duration-500">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Apple className="w-64 h-64 rotate-12 text-white" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Daily Wellness Summary</span>
            </div>

            <h1 className="text-5xl font-black mb-4 tracking-tight leading-tight text-white drop-shadow-md">
              Nutrition & Wellness
            </h1>
            <p className="text-lg text-slate-200 font-medium mb-8 max-w-lg leading-relaxed drop-shadow-sm">
              Your AI-powered journey to peak vitality. Track, analyze, and optimize your health with precision.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={generateAIMealPlan}
                disabled={isGeneratingPlan}
                className="h-12 px-8 rounded-xl bg-white text-emerald-950 font-bold hover:bg-emerald-50 transition-all shadow-lg hover:shadow-emerald-900/20 active:scale-95 text-base border-0"
              >
                {isGeneratingPlan ? (
                  <>
                    <div className="h-5 w-5 border-2 border-emerald-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Brain className="h-5 w-5 mr-2" />
                    Create AI Meal Plan
                  </>
                )}
              </Button>
              <Button
                onClick={() => setShowSetupForm(true)}
                variant="ghost"
                className="h-12 px-8 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10"
              >
                Update Goals
              </Button>
            </div>
          </div>
        </div>

        {/* AI Insights Banner */}
        {aiInsights.length > 0 && (
          <Card className="border-0 bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    AI Nutrition Insights
                  </h3>
                  <div className="space-y-1">
                    {aiInsights.map((insight, idx) => (
                      <p key={idx} className="text-sm text-slate-600">• {insight}</p>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Smart Insight Card */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 shadow-xl mb-10">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative p-6 md:p-8 flex items-start md:items-center gap-6">
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-110 transition-transform">
              <Lightbulb className="h-7 w-7 text-amber-300" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">Today's Insight</span>
                <div className="h-px bg-indigo-400/30 flex-1"></div>
              </div>
              <p className="text-xl md:text-2xl font-bold text-white leading-snug">
                {dailyTip}
              </p>
              <button className="mt-3 text-sm font-medium text-white/80 hover:text-white flex items-center gap-1 hover:gap-2 transition-all">
                Why is this important? <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Wellness Metrics Grid - The Control Center */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* 1. Weight Trend Card */}
          <Card className="border-0 bg-white rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all overflow-hidden group relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity"></div>
            <CardContent className="p-6 h-full flex flex-col justify-between relative z-10">
              <div>
                <div className="flex items-center gap-2 text-slate-500 mb-4">
                  <Activity className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Weight Trend</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">{userProfile.weight}</span>
                  <span className="text-sm font-medium text-slate-400">kg</span>
                </div>
                <p className="text-xs text-emerald-600 font-bold mt-1 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">
                  On Track
                </p>
              </div>

              {/* Visual Decoration for Trend */}
              <div className="h-16 mt-4 opacity-50 absolute bottom-0 right-0 w-full grayscale group-hover:grayscale-0 transition-all">
                <svg viewBox="0 0 100 40" className="w-full h-full text-emerald-500 fill-current opacity-20" preserveAspectRatio="none">
                  <path d="M0,40 L0,20 C10,15 20,25 30,22 C40,19 50,10 60,15 C70,20 80,10 90,5 L100,0 L100,40 Z" />
                </svg>
                <svg viewBox="0 0 100 40" className="w-full h-full text-emerald-500 stroke-current stroke-2 fill-none absolute top-0 left-0" preserveAspectRatio="none">
                  <path d="M0,20 C10,15 20,25 30,22 C40,19 50,10 60,15 C70,20 80,10 90,5 L100,0" />
                </svg>
              </div>
            </CardContent>
          </Card>

          {/* 2. BMI Gauge Card */}
          <Card className="border-0 bg-white rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-10 -mt-10 z-0"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-slate-500">
                  <Target className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">BMI Score</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <span className="text-4xl font-black text-slate-900 tracking-tight">{userProfile.bmi}</span>
                  <div className="text-xs font-medium text-slate-400 mt-1">
                    {userProfile.bmi < 18.5 ? 'Underweight' :
                      userProfile.bmi < 25 ? 'Normal' :
                        userProfile.bmi < 30 ? 'Overweight' : 'Obese'}
                  </div>
                </div>

                {/* Simple Circular Gauge Visualization */}
                <div className="relative h-16 w-16">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="32" cy="32" r="28" className="text-slate-100" strokeWidth="6" stroke="currentColor" fill="none" />
                    <circle cx="32" cy="32" r="28" className={`${userProfile.bmi < 25 ? 'text-indigo-500' : 'text-orange-500'}`} strokeWidth="6" strokeDasharray={175} strokeDashoffset={175 - (Math.min(userProfile.bmi / 40, 1) * 175)} strokeLinecap="round" stroke="currentColor" fill="none" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. Calories Circular Progress */}
          <Card className="border-0 bg-white rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all overflow-hidden relative group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-5 group-hover:opacity-10 transition-opacity"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-2 text-slate-500 mb-4">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Net Calories</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="40" cy="40" r="36" className="text-orange-100" strokeWidth="8" stroke="currentColor" fill="none" />
                    <circle cx="40" cy="40" r="36" className="text-orange-500 transition-all duration-1000 ease-out" strokeWidth="8" strokeDasharray={226} strokeDashoffset={226 - ((Math.min(caloriePercentage, 100) / 100) * 226)} strokeLinecap="round" stroke="currentColor" fill="none" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600">{Math.round(caloriePercentage)}%</span>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-slate-900">{totalCaloriesConsumed}</div>
                  <div className="text-xs text-slate-400 font-medium">consumed of {userProfile.calorieGoal}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. Water Interactive Card (Replaces Grid Item) */}
          <Card className="border-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl shadow-lg hover:shadow-cyan-200/50 transition-all text-white overflow-hidden relative group">
            {/* Background Wave Effect */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560060150-202a59a197b0?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-10 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-full h-[60%] opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wave-grid.png')]"></div>

            <CardContent className="p-6 relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-cyan-100">
                  <Droplet className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Hydration</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold">
                  {waterStreak} Day Streak 🔥
                </div>
              </div>

              <div className="text-center my-4">
                <span className="text-4xl font-black tracking-tight">{waterIntake}</span>
                <span className="text-lg opacity-80 ml-1">ml</span>
                <div className="w-full bg-black/20 rounded-full h-1.5 mt-3 overflow-hidden">
                  <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(waterPercentage, 100)}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => addWater(250)} className="bg-white/20 hover:bg-white text-white hover:text-blue-600 rounded-lg py-2 text-xs font-bold transition-all backdrop-blur-sm">
                  +250
                </button>
                <button onClick={() => addWater(500)} className="bg-white/20 hover:bg-white text-white hover:text-blue-600 rounded-lg py-2 text-xs font-bold transition-all backdrop-blur-sm">
                  +500
                </button>
                <button onClick={() => addWater(1000)} className="bg-white/20 hover:bg-white text-white hover:text-blue-600 rounded-lg py-2 text-xs font-bold transition-all backdrop-blur-sm">
                  +1L
                </button>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Today's Meals Section */}
        <section id="meals-section" className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-green-600" />
            Today's Meals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((category) => {
              const categoryMeals = mockMeals.filter(m => m.category === category);
              const selectedMeal = Object.values(selectedMeals).find(
                item => item.meal.category === category
              );

              return (
                <Card key={category} className="border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden group h-full flex flex-col rounded-2xl">
                  <div className="relative h-48 w-full shrink-0 overflow-hidden">
                    {selectedMeal?.meal?.imageUrl ? (
                      <img
                        src={selectedMeal.meal.imageUrl}
                        alt={selectedMeal.meal.name}
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <img
                        src={
                          category === 'breakfast' ? 'https://images.unsplash.com/photo-1493770348161-369560ae357d?auto=format&fit=crop&q=80&w=800' :
                            category === 'lunch' ? 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' :
                              category === 'dinner' ? 'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?auto=format&fit=crop&q=80&w=800' :
                                'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=800'
                        }
                        alt={category}
                        className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-slate-800 backdrop-blur-sm shadow-sm hover:bg-white capitalize px-2 py-0.5 rounded-md font-medium border-0">
                        <ChefHat className="h-3 w-3 mr-1.5 text-emerald-600" />
                        {category}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col">
                    {selectedMeal ? (
                      <div className="flex-1 flex flex-col">
                        <div className="mb-4">
                          <h4 className="font-bold text-lg text-slate-900 mb-2 leading-snug line-clamp-2 min-h-[3.5rem]">
                            {selectedMeal.meal.name}
                          </h4>

                          <div className="flex items-center flex-wrap gap-3 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-md text-orange-700">
                              <Flame className="h-3 w-3" />
                              {selectedMeal.meal.calories} kcal
                            </span>
                            {selectedMeal.status !== 'pending' && (
                              <Badge className={`ml-auto border-0 ${selectedMeal.status === 'done' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                                {selectedMeal.status === 'done' ? 'Completed' : 'Skipped'}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Nutrition Grid - kept for detailed view on planned meals */}
                        <div className="flex gap-4 mb-4 text-xs text-slate-500 border-t border-b border-slate-50 py-3">
                          <div className="flex-1 text-center border-r border-slate-50 last:border-0">
                            <span className="block font-bold text-slate-900 text-sm mb-0.5">{selectedMeal.meal.protein}g</span>
                            Protein
                          </div>
                          <div className="flex-1 text-center border-r border-slate-50 last:border-0">
                            <span className="block font-bold text-slate-900 text-sm mb-0.5">{selectedMeal.meal.carbs}g</span>
                            Carbs
                          </div>
                          <div className="flex-1 text-center">
                            <span className="block font-bold text-slate-900 text-sm mb-0.5">{selectedMeal.meal.fats}g</span>
                            Fat
                          </div>
                        </div>

                        <div className="mt-auto flex gap-3 pt-2">
                          {selectedMeal.status === 'pending' && (
                            <>
                              <Button
                                onClick={() => handleMealAction(selectedMeal.meal.id, selectedMeal.meal, 'done')}
                                size="sm"
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm h-9 rounded-lg"
                              >
                                <Check className="h-4 w-4 mr-1.5" />
                                Done
                              </Button>
                              <Button
                                onClick={() => handleMealAction(selectedMeal.meal.id, selectedMeal.meal, 'skipped')}
                                size="sm"
                                variant="ghost"
                                className="flex-1 h-9 px-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg"
                              >
                                <X className="h-4 w-4 mr-1.5" />
                                Skip
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 flex-1 flex flex-col justify-center items-center">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                          <Plus className="h-6 w-6 text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-sm mb-4 font-medium">No meal planned</p>
                        <Button variant="outline" className="w-full border-dashed border-slate-300 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 h-10" onClick={() => {
                          const meal = categoryMeals[0];
                          if (meal) handleMealAction(meal.id, meal, 'pending');
                        }}>
                          Generate Suggestion
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Recipe Library Section */}
        <section id="recipe-section" className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-orange-600" />
            Recipe Library
          </h2>
          {/* Search and Filters */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search recipes, ingredients, or diseases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Filter className="h-4 w-4 text-slate-600" />
                      <span className="text-sm font-semibold">Disease Categories</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {diseaseCategories.map(disease => (
                        <Badge
                          key={disease}
                          variant={selectedDiseaseFilter.includes(disease) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedDiseaseFilter(prev =>
                              prev.includes(disease)
                                ? prev.filter(d => d !== disease)
                                : [...prev, disease]
                            );
                          }}
                        >
                          {disease}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-semibold mb-2 block">Dietary Preferences</span>
                    <div className="flex flex-wrap gap-2">
                      {dietaryTags.map(tag => (
                        <Badge
                          key={tag}
                          variant={selectedDietaryFilter.includes(tag) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedDietaryFilter(prev =>
                              prev.includes(tag)
                                ? prev.filter(t => t !== tag)
                                : [...prev, tag]
                            );
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {(selectedDiseaseFilter.length > 0 || selectedDietaryFilter.length > 0) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedDiseaseFilter([]);
                        setSelectedDietaryFilter([]);
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* View All Toggle - Right Above Grid */}
          {filteredMeals.length > 4 && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-semibold gap-1"
                onClick={() => setShowAllRecipes(!showAllRecipes)}
              >
                {showAllRecipes ? (
                  <>Show Less <ChevronRight className="w-4 h-4 -rotate-90" /></>
                ) : (
                  <>View All Recipes <ChevronRight className="w-4 h-4" /></>
                )}
              </Button>
            </div>
          )}

          {/* Recipes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(showAllRecipes ? filteredMeals : filteredMeals.slice(0, 4)).map(meal => (
              <Card key={meal.id} className="border-0 bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden group h-full flex flex-col rounded-2xl">
                <div className="relative w-full shrink-0 overflow-hidden bg-slate-200" style={{ height: '200px' }}>
                  <img
                    src={meal.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'}
                    alt={meal.name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                  <button
                    onClick={() => toggleFavorite(meal.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/30 backdrop-blur-md hover:bg-white transition-colors shadow-sm"
                  >
                    <Star
                      className={`h-4 w-4 ${favorites.includes(meal.id) ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`}
                    />
                  </button>
                </div>

                <CardContent className="p-5 flex-1 flex flex-col">
                  {/* Title & Metadata */}
                  <div className="mb-4">
                    <h4 className="font-bold text-lg text-slate-900 mb-2 leading-snug line-clamp-2 min-h-[3rem]">
                      {meal.name}
                    </h4>

                    <div className="flex items-center flex-wrap gap-3 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-md text-orange-700">
                        <Flame className="h-3 w-3" />
                        {meal.calories} kcal
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-semibold text-slate-700">{meal.protein}g</span> P
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="font-semibold text-slate-700">{meal.carbs}g</span> C
                      </span>
                    </div>
                  </div>

                  {/* Dietary Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {meal.dietaryTags.slice(0, 3).map(tag => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 border-0 rounded-md"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions - Pinned to bottom */}
                  <div className="mt-auto flex gap-3 pt-2 border-t border-slate-50">
                    <Button
                      onClick={() => handleMealAction(meal.id, meal, 'pending')}
                      size="sm"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm h-9 rounded-lg"
                    >
                      <Plus className="h-4 w-4 mr-1.5" />
                      Add
                    </Button>
                    <Button
                      onClick={() => analyzeSelectedMeal(meal)}
                      size="sm"
                      variant="outline"
                      className="aspect-square h-9 p-0 border-slate-200 text-slate-400 hover:text-purple-600 hover:border-purple-200 rounded-lg"
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>



          {filteredMeals.length === 0 && (
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="py-12 text-center">
                <Apple className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No recipes found matching your filters.</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Diet Plans Section */}
        <section id="plan-section" className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Target className="h-6 w-6 text-blue-600" />
            Diet Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Weight Loss',
                description: 'Calorie deficit plan with balanced nutrition',
                calories: 1500,
                icon: '📉',
                features: ['High Protein', 'Low Carb', 'Fiber Rich'],
                image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800'
              },
              {
                name: 'Weight Gain',
                description: 'Calorie surplus for muscle building',
                calories: 2500,
                icon: '📈',
                features: ['High Protein', 'Complex Carbs', 'Healthy Fats'],
                image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800'
              },
              {
                name: 'Muscle Building',
                description: 'Protein-rich plan for muscle growth',
                calories: 2300,
                icon: '💪',
                features: ['Very High Protein', 'Pre/Post Workout Meals', 'Supplements'],
                image: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?auto=format&fit=crop&q=80&w=800'
              },
              {
                name: 'Weight Maintenance',
                description: 'Balanced diet for current weight',
                calories: 2000,
                icon: '⚖️',
                features: ['Balanced Macros', 'All Food Groups', 'Flexible'],
                image: 'https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&q=80&w=800'
              }
            ].map(plan => (
              <Card
                key={plan.name}
                className={`border-0 ${userProfile.activeDietPlan === plan.name ? 'ring-2 ring-emerald-500 bg-emerald-50/10' : 'bg-white'} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full overflow-hidden group flex flex-col rounded-2xl`}
                onClick={() => {
                  setUserProfile(prev => ({
                    ...prev,
                    activeDietPlan: plan.name,
                    calorieGoal: plan.calories
                  }));
                }}
              >
                <div className="relative w-full shrink-0 overflow-hidden bg-slate-200" style={{ height: '200px' }}>
                  <img src={plan.image} alt={plan.name} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                    <span className="text-5xl filter drop-shadow-xl transform group-hover:scale-110 transition-transform">{plan.icon}</span>
                  </div>
                  {userProfile.activeDietPlan === plan.name && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-md border-0 px-2 py-0.5 rounded-md">
                        Active Plan
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-5 flex-1 flex flex-col items-center text-center">
                  <div className="mb-4 w-full flex flex-col items-center">
                    <h4 className="font-bold text-lg text-slate-900 mb-2 leading-snug">
                      {plan.name}
                    </h4>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[2.5rem] leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="flex items-center gap-2 justify-center">
                      <span className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-md text-orange-700 text-xs font-semibold">
                        <Flame className="h-3.5 w-3.5" />
                        {plan.calories} kcal/day
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mt-auto border-t border-slate-50 pt-4 w-full">
                    {plan.features.map(feature => (
                      <div key={feature} className="flex items-center justify-center gap-2.5 text-sm text-slate-600">
                        <div className="min-w-[1.25rem] h-5 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section id="achievements-section" className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Achievements
          </h2>
          {/* View All Toggle - Right Above Grid */}
          <div className="flex justify-end mt-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 font-semibold gap-1"
              onClick={() => setShowAllAchievements(!showAllAchievements)}
            >
              {showAllAchievements ? (
                <>Show Less <ChevronRight className="w-4 h-4 -rotate-90" /></>
              ) : (
                <>View All Achievements <ChevronRight className="w-4 h-4" /></>
              )}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 'hydration_hero',
                name: 'Hydration Hero',
                description: 'Reached water goal',
                icon: '💧',
                unlocked: achievements.includes('hydration_hero'),
                image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=800'
              },
              {
                id: 'meal_completed',
                name: 'Meal Master',
                description: 'Completed a meal',
                icon: '🍽️',
                unlocked: achievements.includes('meal_completed'),
                image: 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&q=80&w=800'
              },
              {
                id: 'week_streak',
                name: '7 Day Streak',
                description: 'Track meals for 7 days',
                icon: '🔥',
                unlocked: false,
                image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800'
              },
              {
                id: 'recipe_explorer',
                name: 'Recipe Explorer',
                description: 'Try 10 different recipes',
                icon: '👨‍🍳',
                unlocked: false,
                image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&q=80&w=800'
              },
              {
                id: 'nutrition_ninja',
                name: 'Nutrition Ninja',
                description: 'Meet calorie goal 5 days',
                icon: '🥷',
                unlocked: false,
                image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800'
              },
              {
                id: 'wellness_warrior',
                name: 'Wellness Warrior',
                description: 'Complete all daily goals',
                icon: '⚔️',
                unlocked: false,
                image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800'
              }
            ].slice(0, showAllAchievements ? undefined : 4).map(achievement => (
              <Card
                key={achievement.id}
                className={`border-0 ${achievement.unlocked ? 'bg-white' : 'bg-slate-50'} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden group h-full flex flex-col rounded-2xl`}
              >
                <div className="relative w-full shrink-0 overflow-hidden bg-slate-200" style={{ height: '200px' }}>
                  <img src={achievement.image} className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${!achievement.unlocked && 'grayscale opacity-70'}`} alt={achievement.name} />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className={`text-5xl filter drop-shadow-lg transform transition-transform group-hover:scale-110 ${!achievement.unlocked && 'opacity-60'}`}>{achievement.icon}</span>
                  </div>
                </div>
                <CardContent className="p-5 flex-1 flex flex-col items-center text-center">
                  <h4 className="font-bold text-lg text-slate-900 mb-2">{achievement.name}</h4>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">{achievement.description}</p>

                  <div className="mt-auto pt-2">
                    {achievement.unlocked ? (
                      <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-md px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5" />
                        Unlocked
                      </Badge>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        <Lock className="w-3 h-3" />
                        Locked
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

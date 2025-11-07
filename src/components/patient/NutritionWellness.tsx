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
  Calendar, ChevronRight, Trophy, Zap, Brain, Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AIChatAssistant } from '../common/AIChatAssistant';
import { aiService } from '../../lib/ai-service';

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
    servings: 1
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
    servings: 2
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
    servings: 2
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
    servings: 1
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
    servings: 2
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
    servings: 1
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
    servings: 1
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
    servings: 2
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
    activeDietPlan: 'Weight Maintenance'
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
  const [dailyTip, setDailyTip] = useState('');
  const [waterStreak, setWaterStreak] = useState(0);
  const [aiMealPlan, setAiMealPlan] = useState<any>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [selectedMealForAnalysis, setSelectedMealForAnalysis] = useState<Meal | null>(null);

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
  const filteredMeals = mockMeals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDisease = selectedDiseaseFilter.length === 0 ||
      selectedDiseaseFilter.some(disease => meal.diseaseCategories.includes(disease));
    
    const matchesDietary = selectedDietaryFilter.length === 0 ||
      selectedDietaryFilter.some(tag => meal.dietaryTags.includes(tag));
    
    return matchesSearch && matchesDisease && matchesDietary;
  });

  const handleMealAction = (mealId: string, meal: Meal, action: 'done' | 'skipped') => {
    setSelectedMeals(prev => ({
      ...prev,
      [mealId]: { meal, status: action }
    }));

    if (action === 'done' && !achievements.includes('meal_completed')) {
      setAchievements(prev => [...prev, 'meal_completed']);
    }
  };

  const addWater = (amount: number) => {
    setWaterIntake(prev => Math.min(prev + amount, userProfile.waterGoal + 1000));
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
    <div className="space-y-6 p-6 relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 -z-10"></div>

      {/* AI Chat Assistant */}
      <AIChatAssistant context="nutrition" userProfile={userProfile} />

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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Nutrition & Wellness
          </h1>
          <p className="text-slate-600">Your personalized nutrition journey powered by AI</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={generateAIMealPlan} 
            disabled={isGeneratingPlan}
            className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGeneratingPlan ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4" />
                AI Meal Plan
              </>
            )}
          </Button>
          <Button onClick={() => setShowSetupForm(true)} variant="outline" className="gap-2">
            <Target className="h-4 w-4" />
            Update Goals
          </Button>
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

      {/* Daily Tip */}
      <Card className="border-0 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">💡 Daily Nutrition Tip</h3>
              <p className="text-sm text-slate-600">{dailyTip}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Weight</div>
              <Activity className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-3xl">{userProfile.weight}kg</div>
            <div className="text-xs text-slate-500 mt-1">Current</div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">BMI</div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-3xl">{userProfile.bmi}</div>
            <div className="text-xs text-slate-500 mt-1">
              {userProfile.bmi < 18.5 ? 'Underweight' : 
               userProfile.bmi < 25 ? 'Normal' : 
               userProfile.bmi < 30 ? 'Overweight' : 'Obese'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Calories</div>
              <Flame className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-3xl">{totalCaloriesConsumed}</div>
            <div className="text-xs text-slate-500 mt-1">
              of {userProfile.calorieGoal} kcal
            </div>
            <Progress value={caloriePercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-slate-600">Water</div>
              <Droplet className="h-4 w-4 text-cyan-600" />
            </div>
            <div className="text-3xl">{waterIntake}ml</div>
            <div className="text-xs text-slate-500 mt-1">
              of {userProfile.waterGoal}ml
            </div>
            <Progress value={waterPercentage} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Water Tracker */}
      <Card className="border-0 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-cyan-600" />
            Water 
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Daily Goal: {userProfile.waterGoal}ml</span>
                  <span className="text-sm font-semibold">{Math.round(waterPercentage)}%</span>
                </div>
                <Progress value={waterPercentage} className="h-3" />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => addWater(250)} size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  +250ml
                </Button>
                <Button onClick={() => addWater(500)} size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  +500ml
                </Button>
                <Button onClick={() => addWater(1000)} size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  +1L
                </Button>
                <Button onClick={() => setWaterIntake(0)} size="sm" variant="outline">
                  Reset
                </Button>
              </div>
              {waterStreak > 0 && (
                <div className="mt-3 text-sm text-slate-600">
                  🔥 {waterStreak} day streak!
                </div>
              )}
            </div>
            <div className="ml-8">
              <div className="relative h-32 w-32">
                <svg className="transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#waterGradient)"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - waterPercentage / 100)}`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Droplet className="h-8 w-8 text-cyan-500" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="meals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
          <TabsTrigger value="meals">Today's Meals</TabsTrigger>
          <TabsTrigger value="library">Recipe Library</TabsTrigger>
          <TabsTrigger value="plans">Diet Plans</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Today's Meals */}
        <TabsContent value="meals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((category) => {
              const categoryMeals = mockMeals.filter(m => m.category === category);
              const selectedMeal = Object.values(selectedMeals).find(
                item => item.meal.category === category
              );

              return (
                <Card key={category} className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      <ChefHat className="h-5 w-5 text-green-600" />
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedMeal ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{selectedMeal.meal.name}</h4>
                            <p className="text-sm text-slate-600">{selectedMeal.meal.calories} kcal</p>
                          </div>
                          <div className="text-3xl">{selectedMeal.meal.image}</div>
                        </div>
                        <div className="flex gap-2">
                          {selectedMeal.status === 'pending' ? (
                            <>
                              <Button
                                onClick={() => handleMealAction(selectedMeal.meal.id, selectedMeal.meal, 'done')}
                                size="sm"
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Done
                              </Button>
                              <Button
                                onClick={() => handleMealAction(selectedMeal.meal.id, selectedMeal.meal, 'skipped')}
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Skip
                              </Button>
                            </>
                          ) : (
                            <Badge className={selectedMeal.status === 'done' ? 'bg-green-500' : 'bg-slate-400'}>
                              {selectedMeal.status === 'done' ? '✓ Completed' : '✗ Skipped'}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-600">
                          P: {selectedMeal.meal.protein}g | C: {selectedMeal.meal.carbs}g | F: {selectedMeal.meal.fats}g
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-slate-500 mb-3">No meal selected</p>
                        <Button size="sm" onClick={() => {
                          const meal = categoryMeals[0];
                          if (meal) handleMealAction(meal.id, meal, 'pending');
                        }}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add Meal
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Recipe Library */}
        <TabsContent value="library" className="space-y-4">
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

          {/* Recipes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMeals.map(meal => (
              <Card key={meal.id} className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-5xl">{meal.image}</div>
                    <button
                      onClick={() => toggleFavorite(meal.id)}
                      className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                    >
                      <Star
                        className={`h-5 w-5 ${favorites.includes(meal.id) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'}`}
                      />
                    </button>
                  </div>
                  
                  <h4 className="font-semibold mb-1">{meal.name}</h4>
                  <div className="flex items-center gap-2 mb-2 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {meal.cookingTime}min
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {meal.calories}kcal
                    </span>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {meal.difficulty}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {meal.dietaryTags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-xs text-slate-600 mb-3">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <div className="font-semibold">{meal.protein}g</div>
                        <div className="text-slate-500">Protein</div>
                      </div>
                      <div>
                        <div className="font-semibold">{meal.carbs}g</div>
                        <div className="text-slate-500">Carbs</div>
                      </div>
                      <div>
                        <div className="font-semibold">{meal.fats}g</div>
                        <div className="text-slate-500">Fats</div>
                      </div>
                      <div>
                        <div className="font-semibold">{meal.fiber}g</div>
                        <div className="text-slate-500">Fiber</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleMealAction(meal.id, meal, 'pending')}
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                    >
                      Add to Today
                    </Button>
                    <Button
                      onClick={() => analyzeSelectedMeal(meal)}
                      size="sm"
                      variant="outline"
                      className="gap-1"
                    >
                      <Wand2 className="h-3 w-3" />
                      AI
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
        </TabsContent>

        {/* Diet Plans */}
        <TabsContent value="plans" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Weight Loss',
                description: 'Calorie deficit plan with balanced nutrition',
                calories: 1500,
                icon: '📉',
                features: ['High Protein', 'Low Carb', 'Fiber Rich']
              },
              {
                name: 'Weight Gain',
                description: 'Calorie surplus with muscle-building focus',
                calories: 2500,
                icon: '📈',
                features: ['High Protein', 'Complex Carbs', 'Healthy Fats']
              },
              {
                name: 'Muscle Building',
                description: 'Protein-rich plan for muscle growth',
                calories: 2300,
                icon: '💪',
                features: ['Very High Protein', 'Pre/Post Workout Meals', 'Supplements']
              },
              {
                name: 'Weight Maintenance',
                description: 'Balanced diet for current weight',
                calories: 2000,
                icon: '⚖️',
                features: ['Balanced Macros', 'All Food Groups', 'Flexible']
              }
            ].map(plan => (
              <Card
                key={plan.name}
                className={`border-2 ${userProfile.activeDietPlan === plan.name ? 'border-green-500 bg-green-50' : 'border-transparent bg-white/80'} backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer`}
                onClick={() => {
                  setUserProfile(prev => ({
                    ...prev,
                    activeDietPlan: plan.name,
                    calorieGoal: plan.calories
                  }));
                }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{plan.icon}</div>
                    {userProfile.activeDietPlan === plan.name && (
                      <Badge className="bg-green-500">Active</Badge>
                    )}
                  </div>
                  <h4 className="text-xl mb-2">{plan.name}</h4>
                  <p className="text-sm text-slate-600 mb-3">{plan.description}</p>
                  <div className="flex items-center gap-2 mb-3 text-sm">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span>{plan.calories} kcal/day</span>
                  </div>
                  <div className="space-y-1">
                    {plan.features.map(feature => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="h-3 w-3 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'hydration_hero',
                name: 'Hydration Hero',
                description: 'Reached water goal',
                icon: '💧',
                unlocked: achievements.includes('hydration_hero')
              },
              {
                id: 'meal_completed',
                name: 'Meal Master',
                description: 'Completed a meal',
                icon: '🍽️',
                unlocked: achievements.includes('meal_completed')
              },
              {
                id: 'week_streak',
                name: '7 Day Streak',
                description: 'Track meals for 7 days',
                icon: '🔥',
                unlocked: false
              },
              {
                id: 'recipe_explorer',
                name: 'Recipe Explorer',
                description: 'Try 10 different recipes',
                icon: '👨‍🍳',
                unlocked: false
              },
              {
                id: 'nutrition_ninja',
                name: 'Nutrition Ninja',
                description: 'Meet calorie goal 5 days',
                icon: '🥷',
                unlocked: false
              },
              {
                id: 'wellness_warrior',
                name: 'Wellness Warrior',
                description: 'Complete all daily goals',
                icon: '⚔️',
                unlocked: false
              }
            ].map(achievement => (
              <Card
                key={achievement.id}
                className={`border-0 ${achievement.unlocked ? 'bg-gradient-to-br from-amber-50 to-yellow-50' : 'bg-slate-100'} shadow-xl`}
              >
                <CardContent className="pt-6 text-center">
                  <div className={`text-5xl mb-3 ${!achievement.unlocked && 'grayscale opacity-50'}`}>
                    {achievement.icon}
                  </div>
                  <h4 className="font-semibold mb-1">{achievement.name}</h4>
                  <p className="text-sm text-slate-600">{achievement.description}</p>
                  {achievement.unlocked && (
                    <Badge className="mt-3 bg-gradient-to-r from-amber-500 to-yellow-500">
                      <Award className="h-3 w-3 mr-1" />
                      Unlocked
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

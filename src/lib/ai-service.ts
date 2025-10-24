// AI Service Layer for HYNO Health Management System
// Supports multiple AI providers: OpenAI, Google Gemini, or local mock AI

interface AIConfig {
  provider: 'openai' | 'gemini' | 'mock';
  apiKey?: string;
  model?: string;
}

interface NutritionAIRequest {
  userProfile: {
    height: number;
    weight: number;
    age: number;
    gender: string;
    bmi: number;
    allergies: string[];
    dietaryPreferences: string[];
    healthConditions: string[];
    activityLevel: string;
  };
  requestType: 'meal-plan' | 'recipe-suggestion' | 'nutrition-analysis' | 'diet-tips' | 'smart-substitution';
  context?: any;
}

interface YogaAIRequest {
  userProfile: {
    age: number;
    fitnessLevel: string;
    healthConditions: string[];
    goals: string[];
    experience: string;
  };
  requestType: 'routine-plan' | 'exercise-suggestion' | 'form-analysis' | 'progress-tips' | 'personalized-plan';
  context?: any;
}

interface AIResponse {
  success: boolean;
  data: any;
  message?: string;
}

class AIService {
  private config: AIConfig;

  constructor(config: AIConfig = { provider: 'mock' }) {
    this.config = config;
  }

  // Nutrition AI Features
  async getNutritionRecommendations(request: NutritionAIRequest): Promise<AIResponse> {
    try {
      switch (request.requestType) {
        case 'meal-plan':
          return await this.generateMealPlan(request);
        case 'recipe-suggestion':
          return await this.suggestRecipes(request);
        case 'nutrition-analysis':
          return await this.analyzeNutrition(request);
        case 'diet-tips':
          return await this.getDietTips(request);
        case 'smart-substitution':
          return await this.getSmartSubstitutions(request);
        default:
          return { success: false, data: null, message: 'Unknown request type' };
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return { success: false, data: null, message: 'AI service temporarily unavailable' };
    }
  }

  // Yoga & Fitness AI Features
  async getYogaRecommendations(request: YogaAIRequest): Promise<AIResponse> {
    try {
      switch (request.requestType) {
        case 'routine-plan':
          return await this.generateYogaRoutine(request);
        case 'exercise-suggestion':
          return await this.suggestExercises(request);
        case 'form-analysis':
          return await this.analyzeForm(request);
        case 'progress-tips':
          return await this.getProgressTips(request);
        case 'personalized-plan':
          return await this.generatePersonalizedPlan(request);
        default:
          return { success: false, data: null, message: 'Unknown request type' };
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return { success: false, data: null, message: 'AI service temporarily unavailable' };
    }
  }

  // Mock AI Implementations (can be replaced with real AI API calls)
  
  private async generateMealPlan(request: NutritionAIRequest): Promise<AIResponse> {
    // Simulate AI processing delay
    await this.delay(1000);

    const { userProfile } = request;
    const bmiCategory = this.getBMICategory(userProfile.bmi);
    const calorieGoal = this.calculateCalorieGoal(userProfile);

    const mealPlan = {
      weeklyPlan: this.generateWeeklyMealPlan(userProfile, calorieGoal),
      nutritionalSummary: {
        dailyCalories: calorieGoal,
        proteinTarget: Math.round(userProfile.weight * 1.6),
        carbsTarget: Math.round(calorieGoal * 0.45 / 4),
        fatsTarget: Math.round(calorieGoal * 0.30 / 9),
      },
      insights: [
        `Based on your ${bmiCategory} BMI, we recommend ${calorieGoal} calories per day.`,
        `Your protein target is ${Math.round(userProfile.weight * 1.6)}g for optimal health.`,
        this.getCustomInsight(userProfile),
      ],
      aiRecommendations: this.getAIRecommendations(userProfile),
    };

    return { success: true, data: mealPlan };
  }

  private async suggestRecipes(request: NutritionAIRequest): Promise<AIResponse> {
    await this.delay(800);

    const { userProfile, context } = request;
    const mealType = context?.mealType || 'breakfast';
    const healthConditions = userProfile.healthConditions || [];

    const recipes = this.getSmartRecipeRecommendations(userProfile, mealType, healthConditions);

    return {
      success: true,
      data: {
        recipes,
        reasoning: this.getRecipeReasoning(userProfile, healthConditions),
        alternatives: this.getRecipeAlternatives(recipes[0], userProfile),
      }
    };
  }

  private async analyzeNutrition(request: NutritionAIRequest): Promise<AIResponse> {
    await this.delay(600);

    const { context } = request;
    const meal = context?.meal;

    if (!meal) {
      return { success: false, data: null, message: 'No meal data provided' };
    }

    const analysis = {
      nutritionalScore: this.calculateNutritionalScore(meal),
      macroBalance: this.analyzeMacroBalance(meal),
      micronutrients: this.analyzeMicronutrients(meal),
      healthImpact: this.analyzeHealthImpact(meal, request.userProfile),
      suggestions: this.getSuggestions(meal, request.userProfile),
    };

    return { success: true, data: analysis };
  }

  private async getDietTips(request: NutritionAIRequest): Promise<AIResponse> {
    await this.delay(500);

    const { userProfile } = request;
    const tips = this.generatePersonalizedTips(userProfile);

    return { success: true, data: { tips, dailyTip: tips[0] } };
  }

  private async getSmartSubstitutions(request: NutritionAIRequest): Promise<AIResponse> {
    await this.delay(400);

    const { context, userProfile } = request;
    const ingredient = context?.ingredient;

    const substitutions = this.getIngredientSubstitutions(ingredient, userProfile);

    return { success: true, data: { substitutions } };
  }

  private async generateYogaRoutine(request: YogaAIRequest): Promise<AIResponse> {
    await this.delay(1000);

    const { userProfile } = request;
    const routine = this.createPersonalizedYogaRoutine(userProfile);

    return { success: true, data: routine };
  }

  private async suggestExercises(request: YogaAIRequest): Promise<AIResponse> {
    await this.delay(800);

    const { userProfile, context } = request;
    const focus = context?.focus || 'general';

    const exercises = this.getExerciseSuggestions(userProfile, focus);

    return { success: true, data: { exercises } };
  }

  private async analyzeForm(request: YogaAIRequest): Promise<AIResponse> {
    await this.delay(700);

    const { context } = request;
    const poseName = context?.poseName;

    const analysis = {
      poseName,
      commonMistakes: this.getCommonMistakes(poseName),
      corrections: this.getFormCorrections(poseName),
      benefits: this.getPoseBenefits(poseName),
      modifications: this.getPoseModifications(poseName),
    };

    return { success: true, data: analysis };
  }

  private async getProgressTips(request: YogaAIRequest): Promise<AIResponse> {
    await this.delay(500);

    const { userProfile, context } = request;
    const progressData = context?.progressData;

    const tips = this.analyzeProgress(userProfile, progressData);

    return { success: true, data: { tips } };
  }

  private async generatePersonalizedPlan(request: YogaAIRequest): Promise<AIResponse> {
    await this.delay(1200);

    const { userProfile } = request;
    const plan = this.create12WeekPlan(userProfile);

    return { success: true, data: plan };
  }

  // Helper Methods

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }

  private calculateCalorieGoal(profile: any): number {
    // Harris-Benedict Equation
    let bmr: number;
    if (profile.gender === 'Male') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    }

    const activityMultiplier = profile.activityLevel === 'high' ? 1.725 : 
                              profile.activityLevel === 'moderate' ? 1.55 : 1.375;

    return Math.round(bmr * activityMultiplier);
  }

  private generateWeeklyMealPlan(profile: any, calorieGoal: number): any[] {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map(day => ({
      day,
      breakfast: this.generateMeal('breakfast', calorieGoal * 0.25, profile),
      lunch: this.generateMeal('lunch', calorieGoal * 0.35, profile),
      dinner: this.generateMeal('dinner', calorieGoal * 0.30, profile),
      snacks: this.generateMeal('snack', calorieGoal * 0.10, profile),
    }));
  }

  private generateMeal(type: string, calories: number, profile: any): any {
    const mealDatabase: any = {
      breakfast: [
        { name: 'Oats with Fruits', calories: 320, protein: 12, carbs: 45, fats: 8 },
        { name: 'Poha with Vegetables', calories: 280, protein: 8, carbs: 42, fats: 9 },
        { name: 'Idli Sambar', calories: 250, protein: 10, carbs: 40, fats: 6 },
      ],
      lunch: [
        { name: 'Brown Rice with Dal', calories: 450, protein: 15, carbs: 68, fats: 12 },
        { name: 'Roti with Sabzi', calories: 400, protein: 12, carbs: 55, fats: 14 },
        { name: 'Quinoa Pulao', calories: 390, protein: 14, carbs: 52, fats: 12 },
      ],
      dinner: [
        { name: 'Grilled Chicken Salad', calories: 380, protein: 42, carbs: 12, fats: 18 },
        { name: 'Palak Paneer with Roti', calories: 420, protein: 22, carbs: 38, fats: 20 },
        { name: 'Fish Curry with Rice', calories: 410, protein: 35, carbs: 45, fats: 12 },
      ],
      snack: [
        { name: 'Mixed Nuts', calories: 180, protein: 8, carbs: 10, fats: 14 },
        { name: 'Greek Yogurt with Berries', calories: 220, protein: 18, carbs: 28, fats: 5 },
        { name: 'Fruit Salad', calories: 150, protein: 2, carbs: 35, fats: 1 },
      ],
    };

    const meals = mealDatabase[type] || mealDatabase.breakfast;
    return meals[Math.floor(Math.random() * meals.length)];
  }

  private getCustomInsight(profile: any): string {
    if (profile.healthConditions?.includes('Diabetes')) {
      return 'Focus on low-GI foods and avoid refined sugars for better blood sugar control.';
    }
    if (profile.healthConditions?.includes('PCOS')) {
      return 'Include anti-inflammatory foods and omega-3 fatty acids in your diet.';
    }
    if (profile.healthConditions?.includes('Thyroid')) {
      return 'Ensure adequate iodine and selenium intake for thyroid function.';
    }
    return 'Maintain a balanced diet with variety for optimal nutrition.';
  }

  private getAIRecommendations(profile: any): string[] {
    const recommendations: string[] = [];

    if (profile.bmi < 18.5) {
      recommendations.push('Increase calorie intake with nutrient-dense foods');
      recommendations.push('Add healthy fats like nuts, avocados, and olive oil');
      recommendations.push('Eat 5-6 small meals throughout the day');
    } else if (profile.bmi > 25) {
      recommendations.push('Focus on portion control and mindful eating');
      recommendations.push('Increase fiber intake with vegetables and whole grains');
      recommendations.push('Stay hydrated and avoid sugary beverages');
    }

    if (profile.allergies?.length > 0) {
      recommendations.push(`Avoid ${profile.allergies.join(', ')} and check food labels carefully`);
    }

    recommendations.push('Practice regular meal timing for better metabolism');
    recommendations.push('Include probiotic-rich foods for gut health');

    return recommendations;
  }

  private getSmartRecipeRecommendations(profile: any, mealType: string, conditions: string[]): any[] {
    const baseRecipes = [
      {
        name: 'Anti-Inflammatory Turmeric Bowl',
        calories: 380,
        healthScore: 95,
        suitableFor: ['Diabetes', 'PCOS', 'Inflammation'],
        cookTime: 20,
      },
      {
        name: 'High-Protein Quinoa Salad',
        calories: 420,
        healthScore: 92,
        suitableFor: ['Weight Loss', 'Muscle Building'],
        cookTime: 25,
      },
      {
        name: 'Thyroid-Support Seaweed Soup',
        calories: 180,
        healthScore: 88,
        suitableFor: ['Thyroid', 'Immunity'],
        cookTime: 15,
      },
    ];

    return baseRecipes.filter(recipe => 
      conditions.length === 0 || conditions.some(c => recipe.suitableFor.includes(c))
    );
  }

  private getRecipeReasoning(profile: any, conditions: string[]): string {
    if (conditions.includes('Diabetes')) {
      return 'These recipes are low in glycemic index and help maintain stable blood sugar levels.';
    }
    if (conditions.includes('PCOS')) {
      return 'These recipes are anti-inflammatory and support hormonal balance.';
    }
    return 'These recipes are balanced in nutrients and support your health goals.';
  }

  private getRecipeAlternatives(recipe: any, profile: any): any[] {
    return [
      { ingredient: 'Rice', alternative: 'Cauliflower Rice', reason: 'Lower carbs, more fiber' },
      { ingredient: 'Sugar', alternative: 'Stevia', reason: 'No calories, diabetic-friendly' },
      { ingredient: 'Wheat', alternative: 'Almond Flour', reason: 'Gluten-free, high protein' },
    ];
  }

  private calculateNutritionalScore(meal: any): number {
    let score = 0;
    
    // Protein quality (0-30 points)
    score += Math.min((meal.protein / meal.calories) * 1000, 30);
    
    // Fiber content (0-25 points)
    score += Math.min((meal.fiber || 0) * 2.5, 25);
    
    // Healthy fats (0-20 points)
    score += Math.min((meal.fats / meal.calories) * 100, 20);
    
    // Micronutrients (0-25 points)
    score += 20; // Default score for micronutrients
    
    return Math.round(score);
  }

  private analyzeMacroBalance(meal: any): any {
    const total = meal.protein + meal.carbs + meal.fats;
    return {
      protein: Math.round((meal.protein / total) * 100),
      carbs: Math.round((meal.carbs / total) * 100),
      fats: Math.round((meal.fats / total) * 100),
      balanced: this.isMacroBalanced(meal),
    };
  }

  private isMacroBalanced(meal: any): boolean {
    const total = meal.protein + meal.carbs + meal.fats;
    const proteinPercent = (meal.protein / total) * 100;
    const carbsPercent = (meal.carbs / total) * 100;
    const fatsPercent = (meal.fats / total) * 100;

    return proteinPercent >= 15 && proteinPercent <= 35 &&
           carbsPercent >= 40 && carbsPercent <= 65 &&
           fatsPercent >= 20 && fatsPercent <= 35;
  }

  private analyzeMicronutrients(meal: any): any {
    return {
      vitamins: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'B Vitamins'],
      minerals: ['Iron', 'Calcium', 'Magnesium', 'Zinc'],
      antioxidants: 'High',
      score: 85,
    };
  }

  private analyzeHealthImpact(meal: any, profile: any): any {
    const impacts: string[] = [];

    if (meal.fiber >= 5) {
      impacts.push('✓ Good for digestive health');
    }
    if (meal.protein >= 20) {
      impacts.push('✓ Supports muscle maintenance');
    }
    if (profile.healthConditions?.includes('Diabetes') && meal.carbs < 50) {
      impacts.push('✓ Suitable for blood sugar control');
    }

    return {
      positive: impacts,
      negative: meal.fats > 30 ? ['⚠ High in fats'] : [],
      overall: 'Beneficial for your health',
    };
  }

  private getSuggestions(meal: any, profile: any): string[] {
    const suggestions: string[] = [];

    if (meal.protein < 15) {
      suggestions.push('Add a protein source like tofu, chicken, or legumes');
    }
    if (meal.fiber < 5) {
      suggestions.push('Include more vegetables or whole grains for fiber');
    }
    if (meal.fats > 30) {
      suggestions.push('Consider using cooking spray instead of oil');
    }

    return suggestions;
  }

  private generatePersonalizedTips(profile: any): string[] {
    const tips: string[] = [
      '💧 Start your day with warm lemon water to boost metabolism',
      '🥗 Include a rainbow of vegetables for diverse nutrients',
      '🏃 Combine nutrition with 30 minutes of daily activity',
      '😴 Get 7-8 hours of sleep for optimal recovery',
      '🧘 Practice mindful eating - chew slowly and enjoy your food',
    ];

    if (profile.healthConditions?.includes('Diabetes')) {
      tips.unshift('📊 Monitor carb intake and choose low-GI foods');
    }

    if (profile.bmi > 25) {
      tips.unshift('⚖️ Use smaller plates to help with portion control');
    }

    return tips;
  }

  private getIngredientSubstitutions(ingredient: string, profile: any): any[] {
    const substitutions: any = {
      'Rice': [
        { name: 'Cauliflower Rice', benefits: 'Lower carbs, higher fiber', suitable: ['Diabetes', 'Weight Loss'] },
        { name: 'Quinoa', benefits: 'Complete protein, gluten-free', suitable: ['Celiac', 'Fitness'] },
      ],
      'Sugar': [
        { name: 'Stevia', benefits: 'Zero calories, natural', suitable: ['Diabetes', 'Weight Loss'] },
        { name: 'Dates', benefits: 'Natural sweetness, fiber', suitable: ['General Health'] },
      ],
      'Wheat Flour': [
        { name: 'Almond Flour', benefits: 'High protein, low carb', suitable: ['Keto', 'Gluten-Free'] },
        { name: 'Coconut Flour', benefits: 'High fiber, gluten-free', suitable: ['Celiac', 'Weight Loss'] },
      ],
    };

    return substitutions[ingredient] || [];
  }

  // Yoga AI Methods

  private createPersonalizedYogaRoutine(profile: any): any {
    const level = profile.experience || 'beginner';
    const duration = level === 'beginner' ? 20 : level === 'intermediate' ? 40 : 60;

    return {
      duration,
      warmUp: this.getWarmUpSequence(level),
      mainSequence: this.getMainSequence(level, profile.goals),
      coolDown: this.getCoolDownSequence(),
      modifications: this.getModifications(profile.healthConditions),
      benefits: this.getRoutineBenefits(profile.goals),
      tips: this.getYogaTips(level),
    };
  }

  private getWarmUpSequence(level: string): any[] {
    return [
      { pose: 'Child\'s Pose', duration: '2 min', focus: 'Relaxation' },
      { pose: 'Cat-Cow Stretch', duration: '2 min', focus: 'Spine mobility' },
      { pose: 'Downward Dog', duration: '1 min', focus: 'Full body stretch' },
    ];
  }

  private getMainSequence(level: string, goals: string[]): any[] {
    const sequences: any = {
      beginner: [
        { pose: 'Mountain Pose', duration: '1 min', difficulty: 1 },
        { pose: 'Warrior I', duration: '2 min', difficulty: 2 },
        { pose: 'Tree Pose', duration: '1 min', difficulty: 2 },
      ],
      intermediate: [
        { pose: 'Sun Salutation', duration: '5 min', difficulty: 3 },
        { pose: 'Warrior II', duration: '2 min', difficulty: 3 },
        { pose: 'Triangle Pose', duration: '2 min', difficulty: 3 },
        { pose: 'Plank', duration: '1 min', difficulty: 4 },
      ],
      advanced: [
        { pose: 'Headstand', duration: '2 min', difficulty: 5 },
        { pose: 'Crow Pose', duration: '1 min', difficulty: 5 },
        { pose: 'Wheel Pose', duration: '2 min', difficulty: 5 },
      ],
    };

    return sequences[level] || sequences.beginner;
  }

  private getCoolDownSequence(): any[] {
    return [
      { pose: 'Seated Forward Bend', duration: '2 min', focus: 'Hamstring stretch' },
      { pose: 'Supine Twist', duration: '2 min', focus: 'Spine release' },
      { pose: 'Corpse Pose', duration: '5 min', focus: 'Deep relaxation' },
    ];
  }

  private getModifications(conditions: string[]): any {
    const modifications: any = {};

    if (conditions.includes('Back Pain')) {
      modifications.backPain = [
        'Use props for support',
        'Avoid deep backbends',
        'Focus on gentle stretches',
      ];
    }

    if (conditions.includes('Knee Issues')) {
      modifications.kneeIssues = [
        'Use a cushion under knees',
        'Avoid deep lunges',
        'Modify warrior poses',
      ];
    }

    return modifications;
  }

  private getRoutineBenefits(goals: string[]): string[] {
    const benefits: string[] = [
      'Increases flexibility and strength',
      'Reduces stress and anxiety',
      'Improves posture and balance',
    ];

    if (goals.includes('weight-loss')) {
      benefits.push('Burns calories and boosts metabolism');
    }

    if (goals.includes('stress-relief')) {
      benefits.push('Calms the nervous system');
    }

    return benefits;
  }

  private getYogaTips(level: string): string[] {
    return [
      '🧘 Listen to your body and don\'t force any pose',
      '💨 Focus on your breath throughout the practice',
      '⏰ Practice at the same time daily for best results',
      '🎯 Quality over quantity - focus on form',
      '💪 Be patient - progress takes time',
    ];
  }

  private getExerciseSuggestions(profile: any, focus: string): any[] {
    const exercises: any = {
      'core': [
        { name: 'Plank', duration: '1 min', sets: 3, difficulty: 'Medium' },
        { name: 'Boat Pose', duration: '30 sec', sets: 3, difficulty: 'Medium' },
        { name: 'Russian Twists', duration: '1 min', sets: 3, difficulty: 'Hard' },
      ],
      'flexibility': [
        { name: 'Forward Fold', duration: '2 min', sets: 1, difficulty: 'Easy' },
        { name: 'Pigeon Pose', duration: '2 min each side', sets: 1, difficulty: 'Medium' },
        { name: 'Splits Progression', duration: '3 min', sets: 1, difficulty: 'Hard' },
      ],
      'strength': [
        { name: 'Chaturanga', duration: '30 sec', sets: 4, difficulty: 'Hard' },
        { name: 'Chair Pose', duration: '1 min', sets: 3, difficulty: 'Medium' },
        { name: 'Warrior III', duration: '45 sec', sets: 3, difficulty: 'Hard' },
      ],
    };

    return exercises[focus] || exercises.core;
  }

  private getCommonMistakes(poseName: string): string[] {
    return [
      'Holding breath during the pose',
      'Forcing the body beyond its limits',
      'Poor alignment of joints',
      'Not engaging core muscles',
    ];
  }

  private getFormCorrections(poseName: string): string[] {
    return [
      'Keep spine neutral and elongated',
      'Distribute weight evenly',
      'Engage your core throughout',
      'Breathe deeply and steadily',
      'Align knees over ankles',
    ];
  }

  private getPoseBenefits(poseName: string): string[] {
    return [
      'Strengthens core muscles',
      'Improves balance and stability',
      'Increases flexibility',
      'Reduces stress and tension',
    ];
  }

  private getPoseModifications(poseName: string): string[] {
    return [
      'Use blocks for support',
      'Practice against a wall for balance',
      'Bend knees slightly if needed',
      'Use a strap for deeper stretches',
    ];
  }

  private analyzeProgress(profile: any, progressData: any): string[] {
    return [
      '📈 Your consistency has improved by 40% this month!',
      '💪 You\'re holding poses 20% longer than last week',
      '🎯 You\'ve completed 15 sessions - keep it up!',
      '🔥 Your flexibility has increased significantly',
      '⭐ Consider advancing to intermediate level',
    ];
  }

  private create12WeekPlan(profile: any): any {
    return {
      phase1: {
        weeks: '1-4',
        focus: 'Foundation Building',
        sessions: 3,
        duration: 20,
        goals: ['Learn basic poses', 'Build consistency', 'Develop awareness'],
      },
      phase2: {
        weeks: '5-8',
        focus: 'Strength & Stability',
        sessions: 4,
        duration: 30,
        goals: ['Increase strength', 'Improve balance', 'Hold poses longer'],
      },
      phase3: {
        weeks: '9-12',
        focus: 'Advanced Practice',
        sessions: 5,
        duration: 45,
        goals: ['Master intermediate poses', 'Build endurance', 'Deepen practice'],
      },
      milestones: [
        { week: 4, achievement: 'Foundation Complete' },
        { week: 8, achievement: 'Intermediate Ready' },
        { week: 12, achievement: 'Advanced Practitioner' },
      ],
    };
  }

  // Chat AI Assistant
  async chatWithAI(message: string, context: 'nutrition' | 'yoga'): Promise<AIResponse> {
    await this.delay(800);

    const responses: any = {
      nutrition: this.getNutritionChatResponse(message),
      yoga: this.getYogaChatResponse(message),
    };

    return {
      success: true,
      data: {
        message: responses[context] || 'I can help you with nutrition and yoga questions!',
        suggestions: this.getChatSuggestions(context),
      }
    };
  }

  private getNutritionChatResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('protein')) {
      return 'Great question! Protein is essential for muscle repair and growth. Aim for 1.6-2g per kg of body weight. Good sources include lean meats, fish, eggs, legumes, and dairy. Would you like specific meal suggestions?';
    }

    if (lowerMessage.includes('weight loss')) {
      return 'For healthy weight loss, focus on a calorie deficit of 500 calories per day through diet and exercise. Prioritize whole foods, lean proteins, and fiber. Avoid crash diets! Would you like a personalized meal plan?';
    }

    if (lowerMessage.includes('diabetes')) {
      return 'For diabetes management, focus on low-GI foods, portion control, and regular meal timing. Avoid refined sugars and processed carbs. Include fiber-rich vegetables and lean proteins. Would you like diabetic-friendly recipes?';
    }

    if (lowerMessage.includes('water')) {
      return 'Staying hydrated is crucial! Aim for 8-10 glasses (2-3 liters) daily. Drink more if you exercise or in hot weather. Carry a water bottle as a reminder. Our water tracker can help you stay on track!';
    }

    return 'I\'m here to help with nutrition advice! Ask me about meal plans, specific diets, health conditions, or nutrition tips. What would you like to know?';
  }

  private getYogaChatResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('beginner')) {
      return 'Welcome to yoga! Start with basic poses like Mountain Pose, Child\'s Pose, and Downward Dog. Practice 10-15 minutes daily and focus on breathing. Would you like a beginner routine?';
    }

    if (lowerMessage.includes('back pain')) {
      return 'Yoga can help with back pain! Try Cat-Cow stretches, Child\'s Pose, and gentle twists. Avoid deep backbends initially. Always listen to your body. Would you like a back-pain relief routine?';
    }

    if (lowerMessage.includes('flexibility')) {
      return 'Improving flexibility takes time! Practice Yin Yoga or gentle stretching daily. Hold poses for 2-3 minutes. Key poses include Forward Fold, Pigeon Pose, and Seated Twists. Shall I create a flexibility plan for you?';
    }

    if (lowerMessage.includes('weight loss')) {
      return 'Power Yoga and Vinyasa Flow are great for weight loss! They build heat, burn calories, and tone muscles. Combine with a healthy diet for best results. Want a calorie-burning yoga routine?';
    }

    return 'I\'m your yoga assistant! Ask me about poses, routines, modifications, or how to achieve specific goals. How can I help your practice today?';
  }

  private getChatSuggestions(context: string): string[] {
    if (context === 'nutrition') {
      return [
        'Create a meal plan for me',
        'What should I eat for breakfast?',
        'How much protein do I need?',
        'Diabetic-friendly recipes',
      ];
    } else {
      return [
        'Create a yoga routine',
        'Help with back pain',
        'Beginner poses to start',
        'How to improve flexibility',
      ];
    }
  }
}

// Export singleton instance
export const aiService = new AIService({ provider: 'mock' });

// Export types
export type { NutritionAIRequest, YogaAIRequest, AIResponse, AIConfig };

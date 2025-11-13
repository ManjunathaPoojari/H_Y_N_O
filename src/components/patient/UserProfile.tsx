import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Edit3, Save, ChefHat, Apple, Coffee, Utensils, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

interface UserProfileProps {
  onNavigate: (path: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    weight: 55,
    height: 165,
    age: 23
  });
  const [submitted, setSubmitted] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const calculateBMI = (weight: number, height: number) => {
    if (height <= 0) return '0.0';
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const calculateBMR = (weight: number, height: number, age: number) => {
    // BMR formula for women: 655 + (9.6 × weight) + (1.8 × height) - (4.7 × age)
    // Assuming sedentary activity, multiply by 1.2 for daily calories
    const bmr = 655 + (9.6 * weight) + (1.8 * height) - (4.7 * age);
    return Math.round(bmr * 1.2);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = () => {
    setIsEditing(false);
    setSubmitted(true);
  };

  const bmi = calculateBMI(profileData.weight, profileData.height);
  const recommendedCalories = calculateBMR(profileData.weight, profileData.height, profileData.age);

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Background Image - Realistic Nutrition and Wellness Theme */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')"
        }}
      ></div>
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => onNavigate('/patient/nutrition')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Nutrition
          </Button>
        </div>

        {/* Header with Patient Name */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-black-900 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">{user?.name || 'Patient'}</h1>
          <p className="text-2xl font-bold text-black-700">{profileData.age} years old · Female</p>
        </div>

        {/* Personal Information */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-sm border border-gray-200/50">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Personal Information</h2>
          <div className="flex justify-between items-center space-x-4">
            <div className="text-center flex-1">
              <p className="text-sm text-gray-600 mb-2">Age</p>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full text-center text-xl font-semibold text-gray-900 bg-white/80 border rounded px-2 py-1"
                />
              ) : (
                <p className="text-xl font-semibold text-gray-900">{profileData.age}</p>
              )}
            </div>
            <div className="text-center flex-1">
              <p className="text-sm text-gray-600 mb-2">Height</p>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="w-full text-center text-xl font-semibold text-gray-900 bg-white/80 border rounded px-2 py-1"
                />
              ) : (
                <p className="text-xl font-semibold text-gray-900">{profileData.height} cm</p>
              )}
            </div>
            <div className="text-center flex-1">
              <p className="text-sm text-gray-600 mb-2">Weight</p>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full text-center text-xl font-semibold text-gray-900 bg-white/80 border rounded px-2 py-1"
                />
              ) : (
                <p className="text-xl font-semibold text-gray-900">{profileData.weight} kg</p>
              )}
            </div>
            <div className="text-center flex-1">
              <p className="text-sm text-gray-600 mb-2">BMI</p>
              <p className="text-xl font-semibold text-gray-900">{bmi}</p>
              <span className="inline-block mt-1 px-2 py-1 bg-green-200/80 text-green-800 text-xs rounded-full">Healthy</span>
            </div>
          </div>
        </div>

        {/* Edit/Save Button */}
        <div className="text-center mb-8">
          {isEditing ? (
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        {/* Recommended Calories */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 mb-8 text-center shadow-sm border border-gray-200/50">
          <p className="text-lg font-medium text-gray-900">Recommended Calories: {recommendedCalories} kcal/day</p>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 mb-8" />

        {/* Conditional Rendering Based on Submission */}
        {submitted ? (
          <div className="space-y-8">
            {/* Recommended Diet Chart */}
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Recommended Diet Chart</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    meal: 'Breakfast',
                    calories: 400,
                    icon: Coffee,
                    items: ['Oatmeal with fruits', 'Greek yogurt', 'Whole grain toast'],
                    ingredients: ['1 cup rolled oats', '1 cup milk', '1 banana', '1 tbsp honey', '1/2 cup Greek yogurt', '2 slices whole grain toast'],
                    procedure: ['Cook oats with milk for 5 minutes', 'Top with sliced banana and honey', 'Serve with Greek yogurt and toast on the side']
                  },
                  {
                    meal: 'Lunch',
                    calories: 500,
                    icon: ChefHat,
                    items: ['Grilled chicken salad', 'Quinoa', 'Vegetables'],
                    ingredients: ['150g chicken breast', '2 cups mixed greens', '1/2 cup cooked quinoa', '1 cucumber', '1 tomato', '2 tbsp olive oil', '1 tbsp lemon juice'],
                    procedure: ['Grill chicken breast for 10-12 minutes', 'Cook quinoa according to package', 'Chop vegetables and mix with greens', 'Dress with olive oil and lemon juice', 'Top with sliced chicken']
                  },
                  {
                    meal: 'Snacks',
                    calories: 250,
                    icon: Apple,
                    items: ['Apple with almonds', 'Carrot sticks', 'Protein shake'],
                    ingredients: ['1 medium apple', '10 almonds', '2 carrots', '1 scoop protein powder', '1 cup almond milk'],
                    procedure: ['Slice apple and serve with almonds', 'Cut carrots into sticks', 'Blend protein powder with almond milk until smooth']
                  },
                  {
                    meal: 'Dinner',
                    calories: 500,
                    icon: Utensils,
                    items: ['Fish with vegetables', 'Brown rice', 'Mixed greens'],
                    ingredients: ['150g salmon fillet', '1 cup broccoli', '1 cup brown rice', '2 cups mixed greens', '1 tbsp olive oil', '1 lemon'],
                    procedure: ['Cook brown rice for 20-25 minutes', 'Bake salmon at 200°C for 12-15 minutes', 'Steam broccoli for 5 minutes', 'Dress greens with olive oil and lemon', 'Serve salmon over rice with greens']
                  }
                ].map((mealPlan, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedMeal(selectedMeal === mealPlan.meal ? null : mealPlan.meal)}>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <mealPlan.icon className="h-5 w-5 text-green-600 mr-2" />
                        <h3 className="text-lg font-semibold text-gray-900">{mealPlan.meal}</h3>
                      </div>
                      <span className="text-sm font-medium text-blue-600">{mealPlan.calories} kcal</span>
                    </div>
                    <ul className="space-y-1">
                      {mealPlan.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-sm text-gray-600 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    {selectedMeal === mealPlan.meal && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="mb-3">
                          <h4 className="font-medium text-gray-900 mb-2">Ingredients:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {mealPlan.ingredients.map((ingredient, idx) => (
                              <li key={idx} className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Procedure:</h4>
                          <ol className="text-sm text-gray-600 space-y-1">
                            {mealPlan.procedure.map((step, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="font-medium mr-2">{idx + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <p className="text-lg font-medium text-gray-900">Total: {recommendedCalories} kcal/day</p>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Achievements</h2>
              <div className="flex justify-between items-center space-x-4">
                {[
                  { label: 'Water Completions', progress: 85, color: 'text-blue-500' },
                  { label: 'Meal Goals', progress: 70, color: 'text-green-500' },
                  { label: 'Calories Goal Reached', progress: 90, color: 'text-orange-500' }
                ].map((achievement, index) => (
                  <div key={index} className="text-center flex-1">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray={`${achievement.progress}, 100`}
                          className={achievement.color}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-900">{achievement.progress}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{achievement.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weight Progress Graph */}
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Weight Progress</h2>
              <div className="w-full h-48 bg-gray-50 rounded-lg flex items-end justify-center p-4">
                <svg viewBox="0 0 300 120" className="w-full h-full">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="300" height="120" fill="url(#grid)" />

                  {/* Weight progress line */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="20,100 60,85 100,75 140,70 180,65 220,60 260,55 300,50"
                  />

                  {/* Data points */}
                  {[100, 85, 75, 70, 65, 60, 55, 50].map((y, index) => (
                    <circle
                      key={index}
                      cx={20 + index * 40}
                      cy={y}
                      r="4"
                      fill="#10b981"
                      stroke="white"
                      strokeWidth="2"
                    />
                  ))}
                </svg>
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">Last 7 days weight tracking</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-white-600 mb-4">Please submit your profile information to view your personalized nutrition plan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

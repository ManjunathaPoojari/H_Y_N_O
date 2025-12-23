import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Droplets, Flame, Apple, Coffee, Sandwich, Cookie, Utensils, Edit, User } from 'lucide-react';

interface ProfileData {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
}

interface Meal {
  name: string;
  items: string[];
  calories: number;
  icon: React.ComponentType<any>;
}

export const UserProfile: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    age: 0,
    gender: '',
    height: 0,
    weight: 0,
    bmi: 0,
  });
  const [waterGlasses, setWaterGlasses] = useState<boolean[]>(Array(8).fill(false));

  const calculateBMI = (height: number, weight: number): number => {
    if (height > 0 && weight > 0) {
      return Math.round((weight / ((height / 100) ** 2)) * 10) / 10;
    }
    return 0;
  };

  const handleInputChange = (field: keyof ProfileData, value: string | number) => {
    setProfileData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'height' || field === 'weight') {
        updated.bmi = calculateBMI(updated.height, updated.weight);
      }
      return updated;
    });
  };

  const isFormValid = () => {
    return profileData.name.trim() !== '' &&
           profileData.age > 0 &&
           profileData.gender !== '' &&
           profileData.height > 0 &&
           profileData.weight > 0;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      setShowDashboard(true);
    }
  };

  const handleEdit = () => {
    setShowDashboard(false);
  };

  const toggleGlass = (index: number) => {
    const newGlasses = [...waterGlasses];
    newGlasses[index] = !newGlasses[index];
    setWaterGlasses(newGlasses);
  };

  const getDietPlan = (bmi: number): Meal[] => {
    if (bmi < 18.5) {
      // Underweight - higher calorie meals
      return [
        {
          name: 'Breakfast',
          items: ['Oatmeal with nuts and fruits', 'Whole grain toast with avocado', 'Greek yogurt with honey'],
          calories: 450,
          icon: Coffee
        },
        {
          name: 'Lunch',
          items: ['Grilled chicken salad with quinoa', 'Whole grain bread sandwich', 'Fruit smoothie'],
          calories: 550,
          icon: Sandwich
        },
        {
          name: 'Snacks',
          items: ['Mixed nuts and dried fruits', 'Cheese and crackers', 'Protein bar'],
          calories: 300,
          icon: Cookie
        },
        {
          name: 'Dinner',
          items: ['Salmon with brown rice', 'Steamed vegetables', 'Sweet potato'],
          calories: 600,
          icon: Utensils
        }
      ];
    } else if (bmi < 25) {
      // Healthy weight - balanced meals
      return [
        {
          name: 'Breakfast',
          items: ['Greek yogurt with berries', 'Whole grain toast', 'Green tea'],
          calories: 350,
          icon: Coffee
        },
        {
          name: 'Lunch',
          items: ['Turkey and vegetable wrap', 'Mixed green salad', 'Apple'],
          calories: 450,
          icon: Sandwich
        },
        {
          name: 'Snacks',
          items: ['Handful of almonds', 'Fresh fruit', 'Carrot sticks with hummus'],
          calories: 200,
          icon: Cookie
        },
        {
          name: 'Dinner',
          items: ['Grilled fish with quinoa', 'Steamed broccoli', 'Mixed greens salad'],
          calories: 500,
          icon: Utensils
        }
      ];
    } else {
      // Overweight - lower calorie, portion controlled meals
      return [
        {
          name: 'Breakfast',
          items: ['Oatmeal with berries', 'Black coffee', 'Small banana'],
          calories: 250,
          icon: Coffee
        },
        {
          name: 'Lunch',
          items: ['Grilled chicken breast', 'Large mixed salad', 'Light vinaigrette'],
          calories: 350,
          icon: Sandwich
        },
        {
          name: 'Snacks',
          items: ['Celery sticks', 'Small apple', 'Herbal tea'],
          calories: 100,
          icon: Cookie
        },
        {
          name: 'Dinner',
          items: ['Baked turkey breast', 'Steamed vegetables', 'Small sweet potato'],
          calories: 400,
          icon: Utensils
        }
      ];
    }
  };

  const waterProgress = (waterGlasses.filter(Boolean).length / 8) * 100;
  const calorieProgress = 65; // Example value
  const totalCaloriesConsumed = 1200; // Example value
  const recommendedCalories = profileData.bmi < 18.5 ? 2000 : profileData.bmi < 25 ? 1800 : 1500;

  if (showDashboard) {
    return (
      <div className="min-h-screen bg-gray-50 p-6" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1935&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="max-w-6xl mx-auto space-y-6 bg-white/90 backdrop-blur-sm rounded-lg p-6">
          {/* Dashboard Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <User className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">{profileData.name}'s Nutrition Dashboard</h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Weight</p>
                <p className="text-xl font-semibold text-gray-900">{profileData.weight} kg</p>
              </div>
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Height</p>
                <p className="text-xl font-semibold text-gray-900">{profileData.height} cm</p>
              </div>
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Age</p>
                <p className="text-xl font-semibold text-gray-900">{profileData.age}</p>
              </div>
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 mb-1">Gender</p>
                <p className="text-xl font-semibold text-gray-900">{profileData.gender}</p>
              </div>
              <div className="bg-white/80 p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500 mb-1">BMI</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold text-gray-900">{profileData.bmi}</span>
                  <Badge variant={profileData.bmi < 18.5 ? 'secondary' : profileData.bmi < 25 ? 'default' : 'destructive'}>
                    {profileData.bmi < 18.5 ? 'Underweight' : profileData.bmi < 25 ? 'Healthy' : profileData.bmi < 30 ? 'Overweight' : 'Obese'}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex justify-center mb-6">
              <Button onClick={handleEdit} variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Recommended Diet Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-green-600" />
                Recommended Diet Chart
              </CardTitle>
              <p className="text-sm text-gray-600">Personalized meal recommendations based on your BMI and health profile</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {getDietPlan(profileData.bmi).map((meal, index) => (
                  <Card key={index} className="border-2 border-gray-100 hover:border-green-200 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <meal.icon className="h-6 w-6 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">{meal.name}</h3>
                      </div>
                      <ul className="space-y-1 mb-3">
                        {meal.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{meal.calories} cal</span>
                        <Badge variant="outline" className="text-xs">
                          Recommended
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Water Tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-blue-600" />
                  Water Intake Achievement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-center space-x-2 mb-4">
                    {waterGlasses.map((filled, index) => (
                      <button
                        key={index}
                        onClick={() => toggleGlass(index)}
                        className={`w-8 h-8 rounded-full border-2 transition-colors ${
                          filled ? 'bg-blue-200 border-blue-300' : 'border-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${waterProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">{waterGlasses.filter(Boolean).length}/8 glasses</p>
                    <Badge variant={waterProgress >= 100 ? 'default' : 'secondary'}>
                      {waterProgress >= 100 ? 'Goal Achieved!' : 'In Progress'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calorie Tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-600" />
                  Calorie Achievement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{totalCaloriesConsumed}</p>
                    <p className="text-sm text-gray-600">Calories consumed today</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-orange-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${calorieProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">{calorieProgress}% of daily goal</p>
                    <Badge variant={calorieProgress >= 100 ? 'default' : 'secondary'}>
                      {calorieProgress >= 100 ? 'Goal Achieved!' : 'In Progress'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Recommended: {recommendedCalories} calories/day
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Profile Information</h1>
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Name</label>
              <Input
                type="text"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter your name"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Age</label>
              <Input
                type="number"
                value={profileData.age || ''}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                placeholder="Enter your age"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Gender</label>
              <Select value={profileData.gender} onValueChange={(value: string) => handleInputChange('gender', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Height (cm)</label>
              <Input
                type="number"
                value={profileData.height || ''}
                onChange={(e) => handleInputChange('height', parseFloat(e.target.value) || 0)}
                placeholder="Enter height in cm"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Weight (kg)</label>
              <Input
                type="number"
                value={profileData.weight || ''}
                onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                placeholder="Enter weight in kg"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">BMI (Auto Calculated)</label>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                <span className="text-lg font-semibold text-gray-900">{profileData.bmi}</span>
                {profileData.bmi > 0 && (
                  <Badge variant={profileData.bmi < 18.5 ? 'secondary' : profileData.bmi < 25 ? 'default' : 'destructive'}>
                    {profileData.bmi < 18.5 ? 'Underweight' :
                     profileData.bmi < 25 ? 'Healthy' :
                     profileData.bmi < 30 ? 'Overweight' : 'Obese'}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <Button onClick={handleSubmit} disabled={!isFormValid()} className="px-8">
              Submit
            </Button>
            <Button onClick={handleEdit} variant="outline" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Card, CardContent } from '../ui/card';
import { User, ChefHat, Calendar, Crown } from 'lucide-react';

interface NutritionWellnessProps {
  onNavigate: (path: string) => void;
}

export const NutritionWellness: React.FC<NutritionWellnessProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl mb-4 text-black font-bold tracking-tight">
          Nutrition and Wellness
        </h1>
        <p className="text-gray-600 text-lg">
          Elevate your daily wellness with NutriTrack
        </p>
      </div>

      {/* Nutrition Dashboard Boxes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: User,
            title: 'Personalize',
            description: 'Manage your nutrition profile and preferences',
            path: '/patient/nutrition/profile',
            color: 'text-blue-600'
          },
          {
            icon: ChefHat,
            title: 'Recipes',
            description: 'Discover healthy recipes tailored to your needs',
            path: '/patient/nutrition/recipes',
            color: 'text-green-600'
          },
          {
            icon: Calendar,
            title: 'Daily Tracker',
            description: 'Track your daily nutrition and wellness goals',
            path: '/patient/nutrition/daily-tracker',
            color: 'text-purple-400'
          },
          {
            icon: Crown,
            title: 'Premium Plans',
            description: 'Advanced nutrition coaching and premium features',
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
    </div>
  );
};

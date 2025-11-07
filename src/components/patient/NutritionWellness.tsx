import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { User, ChefHat, Calendar, Crown, Sparkles, Activity } from 'lucide-react';

interface NutritionWellnessProps {
  onNavigate: (path: string) => void;
}

export const NutritionWellness: React.FC<NutritionWellnessProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 p-6 relative">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 -z-10"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob -z-10"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 -z-10"></div>

      {/* Welcome Section */}
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl mb-4 text-black font-bold tracking-tight">
          Nutrition and Wellness
        </h1>
        <p className="text-gray-600 flex items-center justify-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-green-500 animate-pulse" />
          Elevate your daily wellness with NutriTrack
        </p>

      </div>

      {/* Nutrition Dashboard Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: User,
            title: 'Profile',
            description: 'Manage your nutrition profile and preferences',
            path: '/patient/nutrition/profile',
            gradient: 'from-blue-500 to-blue-600',
            bgPattern: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg=='
          },
          {
            icon: ChefHat,
            title: 'Recipes',
            description: 'Discover healthy recipes tailored to your needs',
            path: '/patient/nutrition/recipes',
            gradient: 'from-orange-500 to-red-600',
            bgPattern: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg=='
          },
          {
            icon: Calendar,
            title: 'Meal Plans',
            description: 'Weekly meal plans and dietary schedules',
            path: '/patient/nutrition/meal-plans',
            gradient: 'from-purple-500 to-pink-600',
            bgPattern: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg=='
          },
          {
            icon: Crown,
            title: 'Premium Plans',
            description: 'Advanced nutrition coaching and premium features',
            path: '/patient/nutrition/premium',
            gradient: 'from-yellow-500 to-amber-600',
            bgPattern: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHoiLz48L2c+PC9nPjwvc3ZnPg=='
          }
        ].map((box, index) => (
          <Card
            key={index}
            className={`group relative overflow-hidden border-0 bg-gradient-to-br ${box.gradient} text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer`}
            onClick={() => onNavigate(box.path)}
          >
            <div className={`absolute inset-0 bg-[url('${box.bgPattern}')] opacity-20`}></div>
            <CardHeader className="flex flex-col items-center justify-center pb-4 relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform mb-4">
                <box.icon className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-semibold text-center">{box.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center relative z-10">
              <p className="text-sm text-white/90 mb-6">{box.description}</p>
              <Button
                className="w-full bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-sm text-white hover:text-white transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(box.path);
                }}
              >
                Explore {box.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>



      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -20px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(20px, 20px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

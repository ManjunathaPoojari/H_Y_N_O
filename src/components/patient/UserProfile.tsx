import React, { useState } from 'react';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const [waterGlasses, setWaterGlasses] = useState<boolean[]>(Array(8).fill(false));
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleGlass = (index: number) => {
    const newGlasses = [...waterGlasses];
    newGlasses[index] = !newGlasses[index];
    setWaterGlasses(newGlasses);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const waterProgress = (waterGlasses.filter(Boolean).length / 8) * 100;
  const calorieProgress = 65; // Example value

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Top Section */}
        <div className="flex items-start justify-between mb-12">
          <div className="flex-1 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Twinkle</h1>
            <p className="text-lg text-gray-500">23 · Female</p>
          </div>
          <Button variant="link" className="text-gray-600 hover:text-gray-800">
            Edit Profile
          </Button>
        </div>

        {/* User Stats Row */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Height</p>
            <p className="text-2xl font-semibold text-gray-900">165 cm</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">Weight</p>
            <p className="text-2xl font-semibold text-gray-900">55 kg</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-1">BMI</p>
            <p className="text-2xl font-semibold text-gray-900">20.2</p>
            <span className="inline-block ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Healthy</span>
          </div>
        </div>

        {/* Recommended Calories */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-center">
          <p className="text-lg font-medium text-gray-900">Recommended Calories: 1650 kcal/day</p>
        </div>

        {/* Divider */}
        <hr className="border-gray-200 mb-8" />

        {/* Accordion Sections */}
        <div className="space-y-4">
          {/* Water Tracker */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleSection('water')}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="text-xl font-medium text-gray-900">Water Tracker</span>
              {expandedSections.water ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.water ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="pb-6">
                <div className="flex justify-center space-x-2 mb-6">
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
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${waterProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">{waterGlasses.filter(Boolean).length}/8 glasses</p>
              </div>
            </div>
          </div>

          {/* Meal Tracker */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleSection('meal')}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="text-xl font-medium text-gray-900">Meal Tracker</span>
              {expandedSections.meal ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.meal ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="pb-6 space-y-4">
                {['Breakfast', 'Lunch', 'Dinner'].map((meal) => (
                  <div key={meal} className="flex items-center justify-between">
                    <span className="text-lg text-gray-900">{meal}</span>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                ))}
                <div className="mt-6">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${calorieProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 text-center">{calorieProgress}% of daily calories</p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleSection('achievements')}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="text-xl font-medium text-gray-900">Achievements</span>
              {expandedSections.achievements ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.achievements ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="pb-6 flex justify-around">
                {[
                  { label: 'Water Streak', progress: 80, color: 'text-blue-500' },
                  { label: 'Calorie Consistency', progress: 65, color: 'text-green-500' },
                  { label: 'Weight Tracking', progress: 90, color: 'text-purple-500' }
                ].map((achievement, index) => (
                  <div key={index} className="text-center">
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
          </div>

          {/* Weight Progress */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleSection('weight')}
              className="w-full flex items-center justify-between py-4 text-left"
            >
              <span className="text-xl font-medium text-gray-900">Weight Progress</span>
              {expandedSections.weight ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.weight ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="pb-6">
                <svg viewBox="0 0 300 100" className="w-full h-24">
                  <polyline
                    fill="none"
                    stroke="#6CC4A1"
                    strokeWidth="2"
                    points="0,80 50,70 100,60 150,55 200,50 250,45 300,40"
                  />
                </svg>
                <p className="text-sm text-gray-600 mt-2 text-center">Last 7 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

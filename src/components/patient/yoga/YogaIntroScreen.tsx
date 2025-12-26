import React from 'react';

interface YogaIntroScreenProps {
  onNavigate: (path: string) => void;
}

export const YogaIntroScreen: React.FC<YogaIntroScreenProps> = ({ onNavigate }) => {
  const handleBeginJourney = () => {
    onNavigate('/patient/yoga');
  };

  const handlePractice = () => {
    onNavigate('/patient/yoga?mode=session');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Hero Section */}
        <div className="bg-green-200 rounded-3xl p-16 text-center shadow-md">
          <h1 className="text-5xl font-light text-slate-800 mb-4">
            Balance Your Body & Mind
          </h1>
          <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
            Daily yoga and fitness for a healthy life
          </p>
          <button
            onClick={handleBeginJourney}
            className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-full font-medium shadow-md transition-colors mt-6"
          >
            Begin Your Journey
          </button>
        </div>

        {/* Yoga Practice Section */}
        <div className="space-y-4">
          <h2 className="text-4xl font-light text-slate-800 text-center">Yoga Practice</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-xl font-medium text-gray-800 mb-3">Surya Namaskar</h3>
              <p className="text-green-700 mb-1 font-medium">Beginner</p>
              <p className="text-slate-600 mb-4">15 minutes</p>
              <button
                onClick={handlePractice}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-full text-sm font-medium shadow-sm transition-colors self-start"
              >
                Practice
              </button>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-xl font-medium text-gray-800 mb-3">Vrikshasana</h3>
              <p className="text-green-700 mb-1 font-medium">Intermediate</p>
              <p className="text-slate-600 mb-4">10 minutes</p>
              <button
                onClick={handlePractice}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-full text-sm font-medium shadow-sm transition-colors self-start"
              >
                Practice
              </button>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="text-xl font-medium text-gray-800 mb-3">Meditation</h3>
              <p className="text-green-700 mb-1 font-medium">All Levels</p>
              <p className="text-slate-600 mb-4">20 minutes</p>
              <button
                onClick={handlePractice}
                className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-full text-sm font-medium shadow-sm transition-colors self-start"
              >
                Practice
              </button>
            </div>
          </div>
        </div>

        {/* Fitness Stats Section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-green-700 mb-2">245</div>
              <p className="text-slate-600 font-medium">Calories Burned</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-green-700 mb-2">12</div>
              <p className="text-slate-600 font-medium">Yoga Sessions</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <div className="text-3xl font-bold text-green-700 mb-2">45</div>
              <p className="text-slate-600 font-medium">Minutes Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

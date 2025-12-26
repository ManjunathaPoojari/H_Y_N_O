import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import {
  CheckCircle, Heart, Star, Share2,
  RotateCcw, Home, Calendar, Trophy
} from 'lucide-react';

interface CompletionScreenProps {
  sessionDuration: number; // in seconds
  posesCompleted: number;
  onRestart: () => void;
  onNewSession: () => void;
  onGoHome: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = ({
  sessionDuration,
  posesCompleted,
  onRestart,
  onNewSession,
  onGoHome
}) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const achievements = [
    { icon: CheckCircle, label: 'Session Completed', color: 'text-emerald-500' },
    { icon: Heart, label: 'Inner Peace Found', color: 'text-rose-500' },
    { icon: Star, label: 'Wellness Journey', color: 'text-amber-500' },
    { icon: Trophy, label: `${posesCompleted} Poses Mastered`, color: 'text-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-12">

        {/* Celebration Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="text-center space-y-8"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring", bounce: 0.5 }}
            className="flex justify-center"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle className="w-20 h-20 text-white" />
            </div>
          </motion.div>

          {/* Congratulations Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-light text-slate-800 leading-tight">
              Well Done!
              <span className="block text-3xl md:text-4xl font-medium bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mt-4">
                You've completed your practice
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
              Take a moment to breathe and celebrate this step in your wellness journey.
              Every practice brings you closer to inner peace.
            </p>
          </motion.div>
        </motion.div>

        {/* Session Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">{formatDuration(sessionDuration)}</div>
              <div className="text-slate-600 font-medium">Practice Time</div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{posesCompleted}</div>
              <div className="text-slate-600 font-medium">Poses Completed</div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-slate-600 font-medium">Session Complete</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          <h3 className="text-2xl font-light text-slate-800 text-center mb-8">Your Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.4 }}
              >
                <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <achievement.icon className={`w-12 h-12 mx-auto mb-3 ${achievement.color}`} />
                    <div className="text-sm font-medium text-slate-800">{achievement.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Gentle Reflection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
        >
          <Card className="border-0 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-xl">
            <CardContent className="p-8 text-center">
              <h4 className="text-xl font-medium text-slate-800 mb-4">Take a Moment to Reflect</h4>
              <p className="text-slate-600 leading-relaxed max-w-2xl mx-auto">
                How does your body feel now? Notice the calm that comes from taking time for yourself.
                This peace is always available to you, just one breath away.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Button
            onClick={onRestart}
            variant="outline"
            size="lg"
            className="py-6 text-lg font-medium border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-2xl"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Practice Again
          </Button>

          <Button
            onClick={onNewSession}
            size="lg"
            className="py-6 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl shadow-xl"
          >
            <Calendar className="w-5 h-5 mr-2" />
            New Session
          </Button>

          <Button
            onClick={onGoHome}
            variant="outline"
            size="lg"
            className="py-6 text-lg font-medium border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-2xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Back Home
          </Button>
        </motion.div>

        {/* Share Achievement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.6 }}
          className="text-center"
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-slate-700"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Your Achievement
          </Button>
        </motion.div>

        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-100/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};

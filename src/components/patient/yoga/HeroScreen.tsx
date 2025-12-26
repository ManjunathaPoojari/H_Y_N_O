import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Play, Heart, Wind, Sparkles } from 'lucide-react';

interface HeroScreenProps {
  onStartSession: () => void;
  isLoading?: boolean;
}

export const HeroScreen: React.FC<HeroScreenProps> = ({
  onStartSession,
  isLoading = false
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-12">

        {/* Main Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          {/* Gentle Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
              <Wind className="w-16 h-16 text-indigo-600" />
            </div>
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-5xl md:text-7xl font-light text-slate-800 leading-tight">
              Find Your
              <span className="block font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Inner Peace
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
              Take a moment to breathe, stretch, and reconnect with yourself.
              Each pose is designed to bring comfort and gentle strength to your practice.
            </p>
          </motion.div>

          {/* Start Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Button
              onClick={onStartSession}
              disabled={isLoading}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-medium rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Preparing your session...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Play className="w-6 h-6" />
                  Begin Your Practice
                </div>
              )}
            </Button>
          </motion.div>
        </motion.div>

        {/* Gentle Reminders */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">Listen to Your Body</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Feel free to modify any pose to suit your comfort. Your well-being comes first.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Wind className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">Breathe Deeply</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Focus on your breath. Let each inhale bring peace, each exhale release tension.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">Take Your Time</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                There's no rush. Move at your own pace and enjoy the present moment.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subtle Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-100/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
};

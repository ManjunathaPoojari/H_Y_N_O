import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Progress } from '../../ui/progress';
import {
  Play, Pause, SkipForward, SkipBack,
  Clock, Wind, Heart, Volume2, VolumeX, Shield, Zap
} from 'lucide-react';
import { YogaPose } from '../../../types/health-yoga';
import { getYogaGesture } from '../../../lib/yoga-gestures';

export type YogaMode = 'guided' | 'silent' | 'therapeutic' | 'beginner' | 'advanced';

interface SessionScreenProps {
  routine: any;
  onComplete: () => void;
  onBack: () => void;
  user: any;
  mode?: YogaMode;
}

export const SessionScreen: React.FC<SessionScreenProps> = ({
  routine,
  onComplete,
  onBack,
  user,
  mode = 'guided'
}) => {
  const [currentPoseIndex, setCurrentPoseIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds per pose
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  const poses = routine?.poses || [];
  const currentPose = poses[currentPoseIndex];
  const progress = poses.length > 0 ? ((currentPoseIndex + 1) / poses.length) * 100 : 0;

  // Timer effect
  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Move to next pose when time runs out
          if (currentPoseIndex < poses.length - 1) {
            setCurrentPoseIndex(prevIndex => prevIndex + 1);
            return 60; // Reset timer for next pose
          } else {
            // Session complete
            onComplete();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, timeRemaining, currentPoseIndex, poses.length, onComplete]);

  // Breathing guide animation
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setBreathPhase(prev => {
        switch (prev) {
          case 'inhale': return 'hold';
          case 'hold': return 'exhale';
          case 'exhale': return 'inhale';
          default: return 'inhale';
        }
      });
    }, 4000); // 4 seconds per phase

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNextPose = () => {
    if (currentPoseIndex < poses.length - 1) {
      setCurrentPoseIndex(prev => prev + 1);
      setTimeRemaining(60); // Reset timer
    }
  };

  const handlePreviousPose = () => {
    if (currentPoseIndex > 0) {
      setCurrentPoseIndex(prev => prev - 1);
      setTimeRemaining(60); // Reset timer
    }
  };

  const handlePauseResume = () => {
    setIsPaused(prev => !prev);
  };

  const handleEndSession = () => {
    onBack();
  };

  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Text-to-Speech Helper
  const speak = (text: string) => {
    if (isMuted || mode === 'silent') return;

    // Cancel any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for calming effect
    utterance.pitch = 1;
    utterance.volume = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  // Background Music
  useEffect(() => {
    const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/09/audio_c8c8a73467.mp3?filename=meditation-relaxed-5954.mp3'); // Royalty-free calming music
    audio.loop = true;
    audio.volume = 0.3;

    if (!isMuted && !isPaused && mode !== 'silent') {
      audio.play().catch(e => console.log('Audio playback failed (interaction required):', e));
    }

    if (isPaused || isMuted || mode === 'silent') {
      audio.pause();
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [isMuted, isPaused, mode]);

  // Speak Pose Instructions
  useEffect(() => {
    if (currentPose && mode === 'guided' && !isPaused) {
      // Small delay to let transition start
      const timeout = setTimeout(() => {
        const gesture = getYogaGesture(currentPose.name);
        speak(`${currentPose.name}. ${gesture}`);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [currentPoseIndex, mode, isPaused]);

  // Speak Breathing Instructions
  useEffect(() => {
    if (mode === 'guided' && !isPaused && !isMuted) {
      switch (breathPhase) {
        case 'inhale':
          speak('Breathe in deeply');
          break;
        case 'hold':
          speak('Hold');
          break;
        case 'exhale':
          speak('Breathe out slowly');
          break;
      }
    }
  }, [breathPhase, mode, isPaused, isMuted]);

  const getBreathingInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe in deeply';
      case 'hold': return 'Hold your breath';
      case 'exhale': return 'Breathe out slowly';
      default: return 'Breathe naturally';
    }
  };

  const getModeConfig = () => {
    switch (mode) {
      case 'guided':
        return {
          name: 'Guided',
          icon: Volume2,
          description: 'Full guidance with breathing cues',
          showBreathing: true,
          showInstructions: true,
          showReminders: true,
          timerDuration: 30
        };
      case 'silent':
        return {
          name: 'Silent',
          icon: VolumeX,
          description: 'Peaceful practice without guidance',
          showBreathing: false,
          showInstructions: false,
          showReminders: false,
          timerDuration: 45
        };
      case 'therapeutic':
        return {
          name: 'Therapeutic',
          icon: Shield,
          description: 'Medical-focused with safety reminders',
          showBreathing: true,
          showInstructions: true,
          showReminders: true,
          timerDuration: 20
        };
      case 'beginner':
        return {
          name: 'Beginner',
          icon: Heart,
          description: 'Gentle pace with extra guidance',
          showBreathing: true,
          showInstructions: true,
          showReminders: true,
          timerDuration: 20
        };
      case 'advanced':
        return {
          name: 'Advanced',
          icon: Zap,
          description: 'Challenging poses with minimal guidance',
          showBreathing: false,
          showInstructions: false,
          showReminders: false,
          timerDuration: 60
        };
      default:
        return {
          name: 'Guided',
          icon: Volume2,
          description: 'Full guidance with breathing cues',
          showBreathing: true,
          showInstructions: true,
          showReminders: true,
          timerDuration: 60
        };
    }
  };

  const modeConfig = getModeConfig();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50/30 to-pink-50/50 flex flex-col">
      {/* Header with Progress and Controls */}
      <div className="flex-shrink-0 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-600">
                Pose {currentPoseIndex + 1} of {poses.length}
              </span>
              <span className="text-sm font-medium text-slate-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <Button
              onClick={handleEndSession}
              variant="outline"
              size="sm"
              className="text-slate-600 hover:text-slate-800"
            >
              End Session
            </Button>

            <div className="flex items-center gap-4">
              <Button
                onClick={handlePreviousPose}
                disabled={currentPoseIndex === 0}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <SkipBack className="w-4 h-4" />
              </Button>

              <Button
                onClick={handlePauseResume}
                size="lg"
                className="rounded-full w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isPaused ? (
                  <Play className="w-6 h-6" />
                ) : (
                  <Pause className="w-6 h-6" />
                )}
              </Button>

              <Button
                onClick={handleNextPose}
                disabled={currentPoseIndex === poses.length - 1}
                variant="outline"
                size="sm"
                className="rounded-full"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-4 text-slate-600">
              <Button
                onClick={handleToggleMute}
                variant="ghost"
                size="icon"
                className="text-slate-600 hover:text-slate-800 hover:bg-white/50"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Pose Visualization */}
          <motion.div
            key={currentPoseIndex}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-12">
                {/* Pose Image/Icon */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="w-64 h-64 mx-auto mb-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <div className="text-8xl">
                    {currentPose?.emoji || '🧘‍♀️'}
                  </div>
                </motion.div>

                {/* Pose Name */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-3xl font-light text-slate-800 mb-4"
                >
                  {currentPose?.name || 'Resting Pose'}
                </motion.h2>

                {/* Pose Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="text-slate-600 leading-relaxed max-w-md mx-auto font-medium"
                >
                  {currentPose ? getYogaGesture(currentPose.name) : 'Take this time to breathe deeply and center yourself.'}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Breathing Guide and Instructions */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Breathing Animation - Only show if modeConfig.showBreathing is true */}
            {modeConfig.showBreathing && (
              <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-xl">
                <CardContent className="p-8 text-center">
                  <motion.div
                    animate={{
                      scale: breathPhase === 'inhale' ? 1.2 : breathPhase === 'hold' ? 1.1 : 0.9,
                      opacity: breathPhase === 'inhale' ? 1 : 0.7
                    }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Wind className="w-10 h-10 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-medium text-slate-800 mb-2">
                    {getBreathingInstruction()}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Follow the gentle rhythm of your breath
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Gentle Reminders - Only show if modeConfig.showReminders is true */}
            {modeConfig.showReminders && (
              <div className="grid grid-cols-1 gap-4">
                <Card className="border-0 bg-gradient-to-r from-rose-50 to-pink-50 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Heart className="w-6 h-6 text-rose-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-slate-800 mb-1">Listen to Your Body</h4>
                        <p className="text-sm text-slate-600">
                          Feel free to modify this pose to suit your comfort. Your well-being comes first.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Volume2 className="w-6 h-6 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-slate-800 mb-1">Stay Present</h4>
                        <p className="text-sm text-slate-600">
                          If your mind wanders, gently bring your attention back to your breath and this moment.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Next Pose Preview - Only show if modeConfig.showInstructions is true */}
            {modeConfig.showInstructions && currentPoseIndex < poses.length - 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <Card
                  className="border-0 bg-white/40 backdrop-blur-sm shadow-lg cursor-pointer hover:bg-white/60 transition-colors"
                  onClick={handleNextPose}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">
                          {poses[currentPoseIndex + 1]?.emoji || '🧘‍♀️'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Next</p>
                        <p className="font-medium text-slate-800">
                          {poses[currentPoseIndex + 1]?.name || 'Next Pose'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

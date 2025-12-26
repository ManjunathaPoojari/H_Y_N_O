import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { yogaAPI } from '../../lib/yoga-api';
import { HeroScreen, SessionScreen, CompletionScreen } from './yoga';
import { YogaMode } from './yoga/SessionScreen';

interface YogaSessionProps {
  categoryId: string;
  onNavigate: (path: string) => void;
}

type SessionState = 'hero' | 'session' | 'completion';

export const YogaSession: React.FC<YogaSessionProps> = ({ categoryId, onNavigate }) => {
  const { user } = useAuth();
  const [sessionState, setSessionState] = useState<SessionState>('hero');
  const [routine, setRoutine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<YogaMode>('guided');

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        setLoading(true);
        // Fetch yoga routine for the category
        const routineData = await yogaAPI.routines.getByCategory(categoryId);
        setRoutine(routineData);
      } catch (err) {
        console.error('Failed to fetch yoga routine:', err);
        setError('Failed to load yoga session. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchRoutine();
    }
  }, [categoryId]);

  const handleStartSession = () => {
    setSessionState('session');
  };

  const handleCompleteSession = () => {
    setSessionState('completion');
  };

  const handleBackToCategories = () => {
    onNavigate('/patient/yoga');
  };

  const handleRestartSession = () => {
    setSessionState('hero');
  };

  const handleNewSession = () => {
    onNavigate('/patient/yoga');
  };

  const handleGoHome = () => {
    onNavigate('/patient/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Preparing your yoga session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-6">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Session Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleBackToCategories}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Back to Categories
            </button>
          </div>
        </div>
      </div>
    );
  }

  switch (sessionState) {
    case 'hero':
      return (
        <HeroScreen
          onStartSession={handleStartSession}
          isLoading={false}
        />
      );

    case 'session':
      return (
        <SessionScreen
          routine={routine}
          onComplete={handleCompleteSession}
          onBack={handleBackToCategories}
          user={user}
          mode={mode}
        />
      );

    case 'completion':
      return (
        <CompletionScreen
          sessionDuration={routine?.duration || 0}
          posesCompleted={routine?.poses?.length || 0}
          onRestart={handleRestartSession}
          onNewSession={handleNewSession}
          onGoHome={handleGoHome}
        />
      );

    default:
      return null;
  }
};

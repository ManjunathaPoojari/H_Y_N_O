import React, { useState, useEffect } from 'react';
import { yogaAPI } from '../../lib/yoga-api';
import { Search, Play, Filter, Star, ChevronDown, ShieldCheck, Heart } from 'lucide-react';
import { DynamicBanner } from './yoga/DynamicBanner';
import { HeroBanner } from './yoga/HeroBanner';
import { PracticeCard } from './yoga/PracticeCard';
import { StatsRow } from './yoga/StatsRow';
import { DemographicSelector } from './yoga/DemographicSelector';
import { IntegratedHeroCarousel } from './yoga/IntegratedHeroCarousel';

interface YogaFitnessProps {
  onNavigate: (path: string) => void;
}

interface YogaCategory {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  color?: string;
  duration?: string;
  sessions?: number;
  rating?: number;
  safetyTips?: string[];
  equipment: string[];
  whoShouldAvoid?: string;
  type?: 'Yoga' | 'Strength' | 'Meditation';
}

export const YogaFitness: React.FC<YogaFitnessProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<YogaCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('beginner'); // Default to beginner for safety
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'rating'>('name');
  const [showAllPractices, setShowAllPractices] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const scrollToPractices = () => {
    const element = document.getElementById('yoga-practices');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    // Check for scroll request
    const params = new URLSearchParams(window.location.search);
    if (params.get('scrollTo') === 'practices') {
      setTimeout(() => {
        const element = document.getElementById('yoga-practices');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // Small delay to ensure render
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Fetch existing yoga data
        const apiData = await yogaAPI.categories.getAll();

        // Helper to generate safety tips
        const getSafetyTips = (difficulty: string, type: string) => {
          const tips = [];
          if (type === 'Strength' || difficulty.toLowerCase() === 'advanced') {
            tips.push('Mandatory 5-10 min warm-up required.');
          } else {
            tips.push('Light warm-up recommended.');
          }

          if (type === 'Yoga') {
            tips.push('Avoid if you have severe back pain or recent injuries.');
            tips.push('Stop immediately if you feel sharp pain.');
          } else if (type === 'Strength') {
            tips.push('Maintain proper posture to avoid injury.');
            tips.push('Cool-down stretching is essential.');
          } else if (type === 'Meditation') {
            tips.push('Find a quiet, comfortable space.');
            tips.push('Stop if you feel dizzy or disoriented.');
          }

          if (difficulty.toLowerCase() === 'advanced') {
            tips.push('Contraindicated for pregnancy without supervision.');
            tips.push('Ensure 48hr recovery between sessions.');
          }

          return tips;
        };

        // Augment API Data
        const augmentedApiData = apiData.map(item => {
          const type = item.name.includes('Power') || item.name.includes('Strength') ? 'Strength' : 'Yoga';
          const tips = getSafetyTips(item.difficulty, type);

          let equipment = ['Yoga Mat'];
          if (type === 'Strength') equipment.push('Light Dumbbells');
          if (item.difficulty.toLowerCase() === 'advanced') equipment.push('Yoga Blocks');

          let avoid = 'Consult doctor if you have severe injuries or recent surgery.';
          if (item.difficulty.toLowerCase() === 'advanced') avoid = 'Not suitable for severe cardiac conditions or late-term pregnancy.';

          return {
            ...item,
            type,
            safetyTips: tips,
            equipment,
            whoShouldAvoid: avoid
          };
        });

        // Add Mock Modules for Gym/Strength & Meditation (if missing)
        const mockModules: YogaCategory[] = [
          {
            id: 'gym-1',
            name: 'Full Body Strength',
            description: 'Complete gym workout focusing on compound movements.',
            difficulty: 'Intermediate',
            duration: '45 min',
            rating: 4.8,
            type: 'Strength',
            safetyTips: getSafetyTips('Intermediate', 'Strength'),
            equipment: ['Dumbbells', 'Adjustable Bench'],
            whoShouldAvoid: 'Individuals with acute shoulder or spinal injuries.'
          },
          {
            id: 'meditation-1',
            name: 'Deep Sleep Nidra',
            description: 'Guided meditation for deep relaxation and sleep.',
            difficulty: 'Beginner',
            duration: '20 min',
            rating: 4.9,
            type: 'Meditation',
            safetyTips: getSafetyTips('Beginner', 'Meditation'),
            equipment: ['Comfortable Seating', 'Cushion'],
            whoShouldAvoid: 'None. Suitable for all users.'
          },
          {
            id: 'yoga-morning',
            name: 'Morning Sunrise Flow',
            description: 'Energize your day with this gentle flow sequence.',
            difficulty: 'Beginner',
            duration: '30 min',
            rating: 4.7,
            type: 'Yoga',
            safetyTips: getSafetyTips('Beginner', 'Yoga'),
            equipment: ['Yoga Mat'],
            whoShouldAvoid: 'Safe for most; move mindfully if managing mild lower back pain.'
          },
          {
            id: 'gym-core',
            name: 'Core Power Blast',
            description: 'Intense ab workout to build core stability.',
            difficulty: 'Advanced',
            duration: '25 min',
            rating: 4.9,
            type: 'Strength',
            safetyTips: getSafetyTips('Advanced', 'Strength'),
            equipment: ['Yoga Mat', 'Stability Ball'],
            whoShouldAvoid: 'Not recommended for individuals with diastasis recti or hernia.'
          },
          {
            id: 'meditation-breath',
            name: 'Mindful Breathing',
            description: 'Quick stress relief through guided breathwork.',
            difficulty: 'Beginner',
            duration: '10 min',
            rating: 4.8,
            type: 'Meditation',
            safetyTips: getSafetyTips('Beginner', 'Meditation'),
            equipment: ['Quiet Space'],
            whoShouldAvoid: 'None. Safe for all.'
          },
          {
            id: 'gym-2',
            name: 'HIIT Cardio Blast',
            description: 'High intensity interval training for fat loss.',
            difficulty: 'Advanced',
            duration: '30 min',
            rating: 4.7,
            type: 'Strength',
            safetyTips: getSafetyTips('Advanced', 'Strength'),
            equipment: ['Sport Shoes', 'Towel'],
            whoShouldAvoid: 'Contraindicated for severe hypertension, joint inflammation, or asthma.'
          }
        ];

        setCategories([...augmentedApiData, ...mockModules]);
      } catch (err) {
        console.error('Failed to fetch yoga categories:', err);
        setError('Failed to load fitness data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredAndSortedCategories = categories
    .filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesDemographic = true;
      if (selectedCategory) {
        const type = category.type || 'Yoga';
        const diff = category.difficulty.toLowerCase();
        const name = category.name.toLowerCase();

        if (selectedCategory === 'child') {
          // Strict safety: Only Beginner, No Weights/Gym
          matchesDemographic = diff === 'beginner' && type !== 'Strength';
        } else if (selectedCategory === 'seniors') {
          // Strict safety: No High Impact, Advanced
          matchesDemographic = diff !== 'advanced' && !name.includes('hiit') && !name.includes('power');
        } else if (selectedCategory === 'men') {
          // Preference: Strength/Gym/Back Pain
          if (selectedIssue === 'Muscle Build') matchesDemographic = type === 'Strength';
          else if (selectedIssue === 'Back Pain') matchesDemographic = name.includes('yoga') || name.includes('stretch');
          else matchesDemographic = true;
        } else if (selectedCategory === 'women') {
          // Preference: Yoga/PCOS
          if (selectedIssue === 'PCOS' || selectedIssue === 'Weight Loss') matchesDemographic = type === 'Yoga' || type === 'Strength';
          else matchesDemographic = true;
        }
      }

      const matchesDifficulty = selectedDifficulty === 'all' || category.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      const matchesFavorites = !showFavoritesOnly || favorites.has(category.id);
      return matchesSearch && matchesDifficulty && matchesDemographic && matchesFavorites;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
          return (difficultyOrder[a.difficulty.toLowerCase() as keyof typeof difficultyOrder] || 0) -
            (difficultyOrder[b.difficulty.toLowerCase() as keyof typeof difficultyOrder] || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* 1. HERO SECTION (Primary Focus) */}
      <div className="w-full">
        <IntegratedHeroCarousel onNavigate={onNavigate} />
      </div>

      {/* Main Content Container (STATIC) */}
      <div id="yoga-content-main" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 2. App Statistics (STATIC) */}
        <div className="mb-16 -mt-10 relative z-30">
          <StatsRow
            totalPractices={categories.length}
            beginnerFriendly={categories.filter(c => c.difficulty.toLowerCase() === 'beginner').length}
            favorites={favorites.size}
            todaySessions={2}
            onClickTotal={() => {
              setSelectedDifficulty('all');
              setShowFavoritesOnly(false);
              scrollToPractices();
            }}
            onClickBeginner={() => {
              setSelectedDifficulty('beginner');
              setShowFavoritesOnly(false);
              scrollToPractices();
            }}
            onClickFavorites={() => {
              setShowFavoritesOnly(!showFavoritesOnly);
              scrollToPractices();
            }}
            onClickToday={() => onNavigate('/patient/yoga/schedule')}
          />
        </div>

        {/* 3. Explore Practices by Lifecycle (STATIC) */}
        <DemographicSelector onNavigate={onNavigate} />

        {/* 4. Expert Guidance (STATIC) */}
        <div className="mb-16 pt-12 border-t border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-emerald-600 font-bold tracking-wider text-xs uppercase block mb-1">Expert Mentors</span>
              <h2 className="text-3xl font-black text-slate-900 leading-none">Train with the Best</h2>
              <p className="text-slate-500 mt-2 font-medium">Certified specialists mapped to your demographic needs.</p>
            </div>
            <button
              onClick={() => onNavigate('/patient/yoga/trainers')}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-full font-bold hover:bg-slate-50 transition-all text-sm shadow-sm"
            >
              View All Trainers
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { id: '1', name: 'Dr. Sarah Jenning', expertise: 'Pediatric Specialist', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800', rating: '4.9', status: 'Available Today' },
              { id: '2', name: 'Michael Chen', expertise: 'Vinyasa Expert', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800', rating: '4.8', status: 'Online Now' },
              { id: '3', name: 'Emma Wilson', expertise: 'Mindfulness Lead', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800', rating: '5.0', status: 'Highly Rated' },
              { id: '4', name: 'Arun Patel', expertise: 'Senior Wellness', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800', rating: '4.9', status: 'Available Today' }
            ].map((trainer) => (
              <div
                key={trainer.id}
                onClick={() => onNavigate(`/patient/yoga/book/${trainer.id}`)}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col h-full"
              >
                <div className="h-80 overflow-hidden">
                  <img src={trainer.img} className="w-full h-full object-cover object-center grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt={trainer.name} />
                </div>
                <div className="p-6 flex flex-col min-h-[140px]">
                  <h3 className="font-bold text-slate-900 text-lg leading-tight">{trainer.name}</h3>
                  <p className="text-emerald-600 text-sm font-bold mt-2 uppercase tracking-wider mb-6">{trainer.role}</p>

                  <div className="mt-auto">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">View Profile</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Safety & Precautions (STATIC - Mandatory per architecture) */}
        <div className="mb-20 bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-rose-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Commitment to Safety
              </span>
              <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Listen to your body. <br /><span className="text-emerald-400">We do, too.</span></h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
                Every practice at HYNO includes mandatory safety disclaimers and contraindications.
                If you have pre-existing medical conditions, please consult our specialized trainers before starting high-intensity flows.
              </p>
            </div>
            <div className="w-full md:w-1/3 grid grid-cols-1 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <p className="text-emerald-400 font-black text-xl mb-1">99.9%</p>
                <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">Injury-Free Practice</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <p className="text-emerald-400 font-black text-xl mb-1">Personalized</p>
                <p className="text-slate-300 text-xs font-bold uppercase tracking-wider">Demographic Matching</p>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Filterable Practice List (STATIC) */}
        <div id="practice-list-start" className="space-y-8 pt-12 border-t border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-emerald-600 font-bold tracking-wider text-xs uppercase block mb-1">Curated Workouts</span>
              <h2 className="text-3xl font-bold text-slate-900">Explore Practices</h2>
            </div>

            {/* Search & Filter - Reduced visual noise */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 transition-all"
                />
              </div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer text-slate-600"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {filteredAndSortedCategories.length > 3 && (
                <button
                  onClick={() => onNavigate('/patient/yoga/practices')}
                  className="flex items-center gap-2 text-emerald-700 font-medium hover:text-emerald-800 transition-colors text-sm whitespace-nowrap ml-2"
                >
                  View All
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                </button>
              )}
            </div>
          </div>

          {filteredAndSortedCategories.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="text-4xl mb-3 opacity-50">🧘‍♀️</div>
              <h3 className="text-lg font-medium text-slate-900">No practices found</h3>
              <p className="text-slate-500 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredAndSortedCategories.slice(0, showAllPractices ? undefined : 3).map((category) => {
                  const categoryType = category.type || (category.name.includes('Meditation') ? 'Meditation' : 'Yoga');

                  const getImage = (cat: typeof category) => {
                    const name = cat.name.toLowerCase();

                    // Specific overrides for distinct visuals
                    if (name.includes('relax')) {
                      return 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=2026&auto=format&fit=crop';
                    }

                    // Category based
                    switch (categoryType) {
                      case 'Meditation': return 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2031&auto=format&fit=crop';
                      case 'Strength': return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop';
                      // New Default for Yoga/Beginner
                      default: return 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop';
                    }
                  };

                  return (
                    <PracticeCard
                      key={category.id}
                      title={category.name}
                      category={categoryType}
                      level={category.difficulty}
                      duration={category.duration || '20 min'}
                      equipment={category.equipment}
                      whoShouldAvoid={category.whoShouldAvoid}
                      safetyTips={category.safetyTips}
                      image={getImage(category)}
                      isFavorite={favorites.has(category.id)}
                      onToggleFavorite={(e) => toggleFavorite(category.id, e)}
                      onClick={() => onNavigate(`/patient/yoga/${category.id}`)}
                    />
                  );
                })}
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

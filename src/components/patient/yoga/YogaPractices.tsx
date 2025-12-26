import React, { useState, useEffect } from 'react';
import { yogaAPI } from '../../../lib/yoga-api';
import { Search, ArrowLeft } from 'lucide-react';
import { PracticeCard } from './PracticeCard';

interface YogaPracticesProps {
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
    equipment?: string[];
    type?: 'Yoga' | 'Strength' | 'Meditation';
}

export const YogaPractices: React.FC<YogaPracticesProps> = ({ onNavigate }) => {
    const [categories, setCategories] = useState<YogaCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'rating'>('name');

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
                const augmentedApiData = apiData.map(item => ({
                    ...item,
                    type: item.name.includes('Power') ? 'Strength' : 'Yoga',
                    safetyTips: getSafetyTips(item.difficulty, item.name.includes('Power') ? 'Strength' : 'Yoga')
                }));

                // Add Mock Modules
                const mockModules: YogaCategory[] = [
                    {
                        id: 'gym-1',
                        name: 'Full Body Strength',
                        description: 'Complete gym workout focusing on compound movements.',
                        difficulty: 'Intermediate',
                        duration: '45 min',
                        rating: 4.8,
                        type: 'Strength',
                        safetyTips: getSafetyTips('Intermediate', 'Strength')
                    },
                    {
                        id: 'meditation-1',
                        name: 'Deep Sleep Nidra',
                        description: 'Guided meditation for deep relaxation and sleep.',
                        difficulty: 'Beginner',
                        duration: '20 min',
                        rating: 4.9,
                        type: 'Meditation',
                        safetyTips: getSafetyTips('Beginner', 'Meditation')
                    },
                    {
                        id: 'yoga-morning',
                        name: 'Morning Sunrise Flow',
                        description: 'Energize your day with this gentle flow sequence.',
                        difficulty: 'Beginner',
                        duration: '30 min',
                        rating: 4.7,
                        type: 'Yoga',
                        safetyTips: getSafetyTips('Beginner', 'Yoga')
                    },
                    {
                        id: 'gym-core',
                        name: 'Core Power Blast',
                        description: 'Intense ab workout to build core stability.',
                        difficulty: 'Advanced',
                        duration: '25 min',
                        rating: 4.9,
                        type: 'Strength',
                        safetyTips: getSafetyTips('Advanced', 'Strength')
                    },
                    {
                        id: 'meditation-breath',
                        name: 'Mindful Breathing',
                        description: 'Quick stress relief through guided breathwork.',
                        difficulty: 'Beginner',
                        duration: '10 min',
                        rating: 4.8,
                        type: 'Meditation',
                        safetyTips: getSafetyTips('Beginner', 'Meditation')
                    },
                    {
                        id: 'gym-2',
                        name: 'HIIT Cardio Blast',
                        description: 'High intensity interval training for fat loss.',
                        difficulty: 'Advanced',
                        duration: '30 min',
                        rating: 4.7,
                        type: 'Strength',
                        safetyTips: getSafetyTips('Advanced', 'Strength')
                    }
                ];

                setCategories([...augmentedApiData, ...mockModules]);
            } catch (err) {
                console.error('Failed to fetch yoga categories:', err);
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
            const matchesDifficulty = selectedDifficulty === 'all' || category.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
            return matchesSearch && matchesDifficulty;
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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto pt-4">
                <button
                    onClick={() => onNavigate('/patient/yoga')}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Yoga
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <span className="text-emerald-600 font-bold tracking-wider text-xs uppercase block mb-1">Full Library</span>
                        <h2 className="text-3xl font-bold text-slate-900">All Practices</h2>
                    </div>

                    {/* View All Page Filtering */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-48 transition-all shadow-sm"
                            />
                        </div>
                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer text-slate-600 shadow-sm"
                        >
                            <option value="all">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white h-96 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredAndSortedCategories.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                        <div className="text-4xl mb-3 opacity-50">🧘‍♀️</div>
                        <h3 className="text-lg font-medium text-slate-900">No practices found</h3>
                        <p className="text-slate-500 text-sm">Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
                        {filteredAndSortedCategories.map((category) => {
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
                                    equipment={category.equipment || []}
                                    safetyTips={category.safetyTips}
                                    image={getImage(category)}
                                    onClick={() => onNavigate(`/patient/yoga/${category.id}`)}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

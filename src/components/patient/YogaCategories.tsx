import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Search, Filter, Clock, Users, Star,
  ChevronRight, Sparkles, Target, Heart,
  Zap, Moon, Flame, Mountain
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  YogaCategoryUnion,
  YogaCategoryType,
  YOGA_STYLES,
  DEMOGRAPHIC_CATEGORIES,
  BENEFIT_CATEGORIES,
  DIFFICULTY_CATEGORIES,
  ALL_CATEGORIES,
  YogaFilter
} from '../../types/yoga';

interface YogaCategoriesProps {
  onCategorySelect?: (category: YogaCategoryUnion) => void;
  selectedCategory?: YogaCategoryUnion | null;
  showFilters?: boolean;
}

export const YogaCategories: React.FC<YogaCategoriesProps> = ({
  onCategorySelect,
  selectedCategory,
  showFilters = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<YogaCategoryType>('style');
  const [filters, setFilters] = useState<YogaFilter>({});

  const filteredCategories = useMemo(() => {
    let categories = ALL_CATEGORIES;

    // Filter by type
    if (activeTab !== 'all') {
      categories = categories.filter(cat => cat.type === activeTab);
    }

    // Filter by search query
    if (searchQuery) {
      categories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.benefits.some(benefit => benefit.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by difficulty
    if (filters.difficulty?.length) {
      categories = categories.filter(cat => filters.difficulty!.includes(cat.difficulty));
    }

    // Filter by duration
    if (filters.duration?.length) {
      categories = categories.filter(cat => {
        return filters.duration!.some(range => {
          if (range === 30) return cat.duration <= 30;
          if (range === 60) return cat.duration > 30 && cat.duration <= 60;
          if (range === 90) return cat.duration > 60;
          return false;
        });
      });
    }

    return categories;
  }, [activeTab, searchQuery, filters]);

  const getCategoryIcon = (category: YogaCategoryUnion) => {
    switch (category.type) {
      case 'style':
        return <Sparkles className="h-6 w-6" />;
      case 'demographic':
        return <Users className="h-6 w-6" />;
      case 'benefit':
        return <Target className="h-6 w-6" />;
      case 'difficulty':
        return <Mountain className="h-6 w-6" />;
      default:
        return <Sparkles className="h-6 w-6" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'advanced': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const CategoryCard: React.FC<{ category: YogaCategoryUnion; index: number }> = ({ category, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group"
    >
      <Card
        className={`relative overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl border-0 ${
          selectedCategory?.id === category.id ? 'ring-4 ring-indigo-500/50 shadow-2xl' : ''
        }`}
        onClick={() => onCategorySelect?.(category)}
      >
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-95`} />

        {/* Content */}
        <CardContent className="relative p-8 h-full flex flex-col text-white">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-6xl group-hover:scale-110 transition-transform">
                {category.emoji}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black mb-2 group-hover:text-yellow-200 transition-colors">
                  {category.name}
                </h3>
                <Badge className="bg-white/20 backdrop-blur-md border-0 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  {category.type}
                </Badge>
              </div>
            </div>
            <div className="opacity-60 group-hover:opacity-100 transition-opacity">
              {getCategoryIcon(category)}
            </div>
          </div>

          {/* Description */}
          <p className="text-white/90 leading-relaxed mb-6 text-lg font-medium flex-1">
            {category.description}
          </p>

          {/* Benefits */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {category.benefits.slice(0, 3).map((benefit, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="bg-white/15 backdrop-blur-md border-white/20 text-white text-xs px-3 py-1"
                >
                  {benefit}
                </Badge>
              ))}
              {category.benefits.length > 3 && (
                <Badge className="bg-white/15 backdrop-blur-md border-white/20 text-white text-xs px-3 py-1">
                  +{category.benefits.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-white/70" />
                <span className="text-sm font-bold text-white/90">{category.duration}min</span>
              </div>
              <Badge className={`${getDifficultyColor(category.difficulty)} text-xs px-2 py-1 font-bold`}>
                {category.difficulty}
              </Badge>
            </div>
            <ChevronRight className="h-5 w-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">
          Discover Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Yoga Practice</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Explore our comprehensive collection of yoga styles, tailored for every body, mind, and spirit.
        </p>
      </div>

      {/* Search and Filters */}
      {showFilters && (
        <div className="bg-white rounded-[3rem] p-8 shadow-xl border border-slate-100">
          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
            <Input
              placeholder="Search yoga styles, benefits, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-16 h-16 rounded-[2rem] border-2 border-slate-200 text-lg font-medium placeholder:text-slate-400 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as YogaCategoryType)} className="w-full">
            <TabsList className="bg-slate-100 p-2 rounded-[2rem] h-16 w-full grid grid-cols-5 gap-2">
              <TabsTrigger value="style" className="rounded-2xl px-6 h-full data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-black text-sm uppercase tracking-wider transition-all">
                Styles
              </TabsTrigger>
              <TabsTrigger value="demographic" className="rounded-2xl px-6 h-full data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-black text-sm uppercase tracking-wider transition-all">
                For You
              </TabsTrigger>
              <TabsTrigger value="benefit" className="rounded-2xl px-6 h-full data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-black text-sm uppercase tracking-wider transition-all">
                Benefits
              </TabsTrigger>
              <TabsTrigger value="difficulty" className="rounded-2xl px-6 h-full data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-black text-sm uppercase tracking-wider transition-all">
                Level
              </TabsTrigger>
              <TabsTrigger value="all" className="rounded-2xl px-6 h-full data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-black text-sm uppercase tracking-wider transition-all">
                All
              </TabsTrigger>
            </TabsList>

            {/* Quick Filters */}
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-slate-500" />
                <span className="font-bold text-slate-700">Quick Filters:</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ ...filters, difficulty: ['beginner'] })}
                className="rounded-full px-6 py-2 border-green-200 text-green-700 hover:bg-green-50"
              >
                Beginner
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ ...filters, duration: [30] })}
                className="rounded-full px-6 py-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                Quick (30min)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ ...filters, duration: [60] })}
                className="rounded-full px-6 py-2 border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Standard (60min)
              </Button>
            </div>
          </Tabs>
        </div>
      )}

      {/* Categories Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + searchQuery}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCategories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="py-32 text-center bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
          <Target className="h-24 w-24 text-slate-200 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-slate-800 mb-2">No categories found</h3>
          <p className="text-slate-400 text-lg">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
        <div className="bg-white rounded-[2rem] p-6 text-center shadow-lg border border-slate-100">
          <div className="text-3xl font-black text-indigo-600 mb-2">{YOGA_STYLES.length}</div>
          <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">Yoga Styles</div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 text-center shadow-lg border border-slate-100">
          <div className="text-3xl font-black text-green-600 mb-2">{BENEFIT_CATEGORIES.length}</div>
          <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">Benefit Types</div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 text-center shadow-lg border border-slate-100">
          <div className="text-3xl font-black text-purple-600 mb-2">{DEMOGRAPHIC_CATEGORIES.length}</div>
          <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">Demographics</div>
        </div>
        <div className="bg-white rounded-[2rem] p-6 text-center shadow-lg border border-slate-100">
          <div className="text-3xl font-black text-orange-600 mb-2">{DIFFICULTY_CATEGORIES.length}</div>
          <div className="text-sm font-bold text-slate-600 uppercase tracking-wider">Difficulty Levels</div>
        </div>
      </div>
    </div>
  );
};

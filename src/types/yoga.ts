export type YogaCategoryType = 'demographic' | 'style' | 'benefit' | 'difficulty' | 'all';

export interface YogaCategory {
  id: string;
  name: string;
  type: YogaCategoryType;
  emoji: string;
  description: string;
  benefits: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  color: string;
  gradient: string;
  icon?: string;
}

export interface YogaStyle extends YogaCategory {
  type: 'style';
  origin?: string;
  focus: string;
  poses: string[];
}

export interface DemographicCategory extends YogaCategory {
  type: 'demographic';
  ageRange?: string;
  targetAudience: string;
}

export interface BenefitCategory extends YogaCategory {
  type: 'benefit';
  healthBenefits: string[];
  mentalBenefits: string[];
}

export interface DifficultyCategory extends YogaCategory {
  type: 'difficulty';
  recommendedFor: string;
}

export type YogaCategoryUnion = YogaStyle | DemographicCategory | BenefitCategory | DifficultyCategory;

export interface YogaFilter {
  type?: YogaCategoryType;
  difficulty?: string[];
  duration?: number[];
  benefits?: string[];
}

export const YOGA_STYLES: YogaStyle[] = [
  {
    id: 'hatha',
    name: 'Hatha Yoga',
    type: 'style',
    emoji: '🧘',
    description: 'Traditional yoga focusing on physical postures and breathing',
    benefits: ['Flexibility', 'Strength', 'Balance', 'Stress Relief'],
    difficulty: 'beginner',
    duration: 60,
    color: 'from-orange-400 to-red-500',
    gradient: 'from-orange-400/90 to-red-500/90',
    origin: 'India',
    focus: 'Physical postures and breathing',
    poses: ['Mountain Pose', 'Tree Pose', 'Warrior Pose']
  },
  {
    id: 'vinyasa',
    name: 'Vinyasa Flow',
    type: 'style',
    emoji: '🌊',
    description: 'Dynamic flowing sequences synchronized with breath',
    benefits: ['Cardiovascular Health', 'Flexibility', 'Coordination', 'Mindfulness'],
    difficulty: 'intermediate',
    duration: 75,
    color: 'from-blue-400 to-cyan-500',
    gradient: 'from-blue-400/90 to-cyan-500/90',
    origin: 'Modern',
    focus: 'Movement and breath synchronization',
    poses: ['Sun Salutation', 'Chaturanga', 'Downward Dog']
  },
  {
    id: 'ashtanga',
    name: 'Ashtanga Yoga',
    type: 'style',
    emoji: '🔥',
    description: 'Rigorous, structured practice with fixed sequences',
    benefits: ['Strength', 'Discipline', 'Heat Generation', 'Mental Focus'],
    difficulty: 'advanced',
    duration: 90,
    color: 'from-red-500 to-pink-500',
    gradient: 'from-red-500/90 to-pink-500/90',
    origin: 'India',
    focus: 'Structured sequences and discipline',
    poses: ['Primary Series', 'Intermediate Series']
  },
  {
    id: 'iyengar',
    name: 'Iyengar Yoga',
    type: 'style',
    emoji: '📐',
    description: 'Precise alignment using props and longer pose holds',
    benefits: ['Alignment', 'Injury Prevention', 'Therapeutic', 'Precision'],
    difficulty: 'intermediate',
    duration: 60,
    color: 'from-purple-400 to-indigo-500',
    gradient: 'from-purple-400/90 to-indigo-500/90',
    origin: 'India',
    focus: 'Precision and alignment',
    poses: ['Tadasana', 'Vrksasana', 'Virabhadrasana']
  },
  {
    id: 'kundalini',
    name: 'Kundalini Yoga',
    type: 'style',
    emoji: '⚡',
    description: 'Spiritual practice combining movement, breath, and meditation',
    benefits: ['Spiritual Awakening', 'Energy Flow', 'Meditation', 'Emotional Balance'],
    difficulty: 'intermediate',
    duration: 60,
    color: 'from-yellow-400 to-orange-500',
    gradient: 'from-yellow-400/90 to-orange-500/90',
    origin: 'India',
    focus: 'Spiritual awakening and energy',
    poses: ['Sat Kriya', 'Breath of Fire', 'Meditation']
  },
  {
    id: 'yin',
    name: 'Yin Yoga',
    type: 'style',
    emoji: '🌙',
    description: 'Passive, restorative practice targeting connective tissues',
    benefits: ['Joint Health', 'Relaxation', 'Fascia Release', 'Stress Relief'],
    difficulty: 'beginner',
    duration: 75,
    color: 'from-indigo-400 to-purple-600',
    gradient: 'from-indigo-400/90 to-purple-600/90',
    origin: 'Modern',
    focus: 'Connective tissue and relaxation',
    poses: ['Butterfly Pose', 'Dragon Pose', 'Twisted Roots']
  }
];

export const DEMOGRAPHIC_CATEGORIES: DemographicCategory[] = [
  {
    id: 'child',
    name: 'Kids Yoga',
    type: 'demographic',
    emoji: '👶',
    description: 'Fun, playful yoga designed for children',
    benefits: ['Focus', 'Coordination', 'Confidence', 'Creativity'],
    difficulty: 'beginner',
    duration: 30,
    color: 'from-amber-400 to-orange-500',
    gradient: 'from-amber-400/90 to-orange-500/90',
    ageRange: '5-12 years',
    targetAudience: 'Children'
  },
  {
    id: 'men',
    name: 'Men\'s Yoga',
    type: 'demographic',
    emoji: '🧑',
    description: 'Strength-building yoga for men',
    benefits: ['Strength', 'Power', 'Mental Toughness', 'Stress Relief'],
    difficulty: 'intermediate',
    duration: 60,
    color: 'from-blue-600 to-cyan-500',
    gradient: 'from-blue-600/90 to-cyan-500/90',
    ageRange: '18-65 years',
    targetAudience: 'Men'
  },
  {
    id: 'women',
    name: 'Women\'s Yoga',
    type: 'demographic',
    emoji: '👩',
    description: 'Hormone-balancing and restorative yoga for women',
    benefits: ['Hormonal Balance', 'Flexibility', 'Emotional Health', 'Strength'],
    difficulty: 'intermediate',
    duration: 60,
    color: 'from-pink-500 to-rose-400',
    gradient: 'from-pink-500/90 to-rose-400/90',
    ageRange: '18-65 years',
    targetAudience: 'Women'
  },
  {
    id: 'senior',
    name: 'Senior Yoga',
    type: 'demographic',
    emoji: '👴',
    description: 'Gentle, joint-friendly yoga for seniors',
    benefits: ['Joint Health', 'Balance', 'Vitality', 'Peace of Mind'],
    difficulty: 'beginner',
    duration: 45,
    color: 'from-emerald-500 to-teal-400',
    gradient: 'from-emerald-500/90 to-teal-400/90',
    ageRange: '65+ years',
    targetAudience: 'Seniors'
  }
];

export const BENEFIT_CATEGORIES: BenefitCategory[] = [
  {
    id: 'stress-relief',
    name: 'Stress Relief',
    type: 'benefit',
    emoji: '😌',
    description: 'Calming practices to reduce stress and anxiety',
    benefits: ['Stress Reduction', 'Anxiety Relief', 'Mental Clarity'],
    difficulty: 'beginner',
    duration: 30,
    color: 'from-green-400 to-emerald-500',
    gradient: 'from-green-400/90 to-emerald-500/90',
    healthBenefits: ['Lower cortisol levels', 'Better sleep', 'Reduced anxiety'],
    mentalBenefits: ['Mental clarity', 'Emotional balance', 'Peace of mind']
  },
  {
    id: 'weight-loss',
    name: 'Weight Loss',
    type: 'benefit',
    emoji: '⚖️',
    description: 'Dynamic yoga to support weight management goals',
    benefits: ['Calorie Burn', 'Metabolism Boost', 'Muscle Toning'],
    difficulty: 'intermediate',
    duration: 60,
    color: 'from-orange-500 to-red-500',
    gradient: 'from-orange-500/90 to-red-500/90',
    healthBenefits: ['Increased metabolism', 'Muscle building', 'Cardiovascular health'],
    mentalBenefits: ['Motivation', 'Body confidence', 'Discipline']
  },
  {
    id: 'flexibility',
    name: 'Flexibility',
    type: 'benefit',
    emoji: '🤸',
    description: 'Improve range of motion and joint mobility',
    benefits: ['Increased Flexibility', 'Better Posture', 'Injury Prevention'],
    difficulty: 'beginner',
    duration: 45,
    color: 'from-purple-400 to-pink-500',
    gradient: 'from-purple-400/90 to-pink-500/90',
    healthBenefits: ['Better posture', 'Reduced injury risk', 'Improved mobility'],
    mentalBenefits: ['Body awareness', 'Patience', 'Mind-body connection']
  },
  {
    id: 'strength',
    name: 'Strength Building',
    type: 'benefit',
    emoji: '💪',
    description: 'Build muscle strength and endurance through yoga',
    benefits: ['Muscle Strength', 'Core Power', 'Endurance'],
    difficulty: 'intermediate',
    duration: 60,
    color: 'from-red-500 to-pink-600',
    gradient: 'from-red-500/90 to-pink-600/90',
    healthBenefits: ['Muscle building', 'Bone density', 'Metabolic health'],
    mentalBenefits: ['Confidence', 'Resilience', 'Achievement']
  }
];

export const DIFFICULTY_CATEGORIES: DifficultyCategory[] = [
  {
    id: 'beginner',
    name: 'Beginner Friendly',
    type: 'difficulty',
    emoji: '🌱',
    description: 'Perfect for those new to yoga',
    benefits: ['Learn Basics', 'Build Confidence', 'Gentle Introduction'],
    difficulty: 'beginner',
    duration: 30,
    color: 'from-green-400 to-emerald-400',
    gradient: 'from-green-400/90 to-emerald-400/90',
    recommendedFor: 'Complete beginners, those with limited mobility'
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    type: 'difficulty',
    emoji: '🌿',
    description: 'For practitioners with some yoga experience',
    benefits: ['Skill Development', 'Challenge', 'Progression'],
    difficulty: 'intermediate',
    duration: 60,
    color: 'from-blue-500 to-indigo-500',
    gradient: 'from-blue-500/90 to-indigo-500/90',
    recommendedFor: 'Those with 3-6 months of regular practice'
  },
  {
    id: 'advanced',
    name: 'Advanced',
    type: 'difficulty',
    emoji: '🏔️',
    description: 'Challenging practices for experienced yogis',
    benefits: ['Mastery', 'Strength', 'Spiritual Growth'],
    difficulty: 'advanced',
    duration: 90,
    color: 'from-purple-600 to-pink-600',
    gradient: 'from-purple-600/90 to-pink-600/90',
    recommendedFor: 'Experienced practitioners with strong foundation'
  }
];

export const ALL_CATEGORIES: YogaCategoryUnion[] = [
  ...YOGA_STYLES,
  ...DEMOGRAPHIC_CATEGORIES,
  ...BENEFIT_CATEGORIES,
  ...DIFFICULTY_CATEGORIES
];

// Yoga Entry Mode for navigation
export type YogaEntryMode = 'discovery' | 'planning' | 'session';

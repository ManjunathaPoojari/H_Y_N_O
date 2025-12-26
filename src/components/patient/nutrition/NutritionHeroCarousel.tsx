import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Target, Droplet, ArrowRight, ShieldCheck, Leaf, Apple } from 'lucide-react';

/**
 * NUTRITION HERO CAROUSEL
 * Based on HYNO Professional Hero Carousel
 */

interface HeroSlide {
    id: string;
    badge: { text: string; icon: React.ReactNode };
    title: string;
    description: string;
    primaryCTA: { text: string; link: string };
    bgImage: string;
}

const HERO_SLIDES: HeroSlide[] = [
    {
        id: 'smart-nutrition',
        badge: { text: 'AI Powered', icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
        title: 'Smart Nutrition Planning',
        description: 'Your personal AI nutritionist creates meal plans that adapt to your taste and health goals.',
        primaryCTA: { text: 'Create Plan', link: '/patient/nutrition/generate-plan' },
        bgImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2053&auto=format&fit=crop',
    },
    {
        id: 'macro-tracking',
        badge: { text: 'Goal Tracking', icon: <Target className="w-4 h-4 text-orange-400" /> },
        title: 'Track Every Calorie',
        description: 'Precise macro-nutrient tracking to ensure you meet your weight and fitness targets.',
        primaryCTA: { text: 'Log Meals', link: '/patient/nutrition/tracker' },
        bgImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 'hydration',
        badge: { text: 'Wellness', icon: <Droplet className="w-4 h-4 text-blue-400" /> },
        title: 'Hydration Mastery',
        description: 'Stay hydrated with intelligent reminders and tracking. Water is key to your health.',
        primaryCTA: { text: 'Track Water', link: '/patient/nutrition/water' },
        bgImage: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=1888&auto=format&fit=crop',
    }
];

export const NutritionHeroCarousel: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === HERO_SLIDES.length - 1 ? 0 : prev + 1));
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
    }, []);

    useEffect(() => {
        if (isAutoPlaying) {
            timeoutRef.current = setTimeout(nextSlide, 7000);
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [currentIndex, isAutoPlaying, nextSlide]);

    const activeSlide = HERO_SLIDES[currentIndex];

    return (
        <div
            className="group relative w-full h-[600px] bg-[#0f172a] overflow-hidden shadow-2xl flex items-center justify-center cursor-default"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* 1. LAYERED BACKGROUND SYSTEM */}
            <div className="absolute inset-0 z-0 bg-[#0f172a]">
                <div
                    key={activeSlide.bgImage}
                    className="absolute inset-0 transition-opacity duration-1000 bg-center bg-cover bg-no-repeat"
                    style={{
                        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.8)), url(${activeSlide.bgImage})`,
                        opacity: 0.8
                    }}
                />
                {/* Cinema Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#020617] to-transparent" />
            </div>

            {/* 2. RICH CONTENT HUB */}
            <div className="relative z-10 w-full px-6 flex flex-col items-center justify-center text-center">
                <div className="max-w-[1000px] w-full mx-auto">
                    {/* Badge */}
                    <div className="mb-8 flex justify-center">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl transition-all duration-300 hover:bg-white/20">
                            <span className="flex items-center justify-center">{activeSlide.badge.icon}</span>
                            <span className="text-xs md:text-sm font-black uppercase tracking-[0.25em] text-white">
                                {activeSlide.badge.text}
                            </span>
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-black text-white leading-[0.9] tracking-tighter mb-8 transition-all duration-1000 drop-shadow-2xl">
                        {activeSlide.title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-2xl text-slate-100 font-medium leading-relaxed mb-12 mx-auto max-w-[800px] drop-shadow-lg">
                        {activeSlide.description}
                    </p>

                    {/* Centered CTA Stack */}
                    <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <button
                            onClick={() => onNavigate(activeSlide.primaryCTA.link)}
                            className="group/btn px-12 py-5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:from-emerald-400 hover:to-green-500 hover:scale-105 hover:shadow-[0_20px_40px_-10px_rgba(52,211,153,0.4)] transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 shadow-2xl w-full sm:w-auto border border-emerald-400/20"
                        >
                            {activeSlide.primaryCTA.text}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1.5" />
                        </button>

                        <div className="flex items-center gap-3 px-6 py-3 bg-black/20 border border-white/5 rounded-xl backdrop-blur-md shadow-inner mt-4">
                            <Leaf className="w-5 h-5 text-green-400" />
                            <div className="text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Dietitian Verified</p>
                                <p className="text-sm font-bold text-slate-200 leading-none lowercase tracking-tight">Scientifically Backed</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. NAVIGATION ARROWS */}
            <div className="absolute inset-y-0 left-0 flex items-center px-4 md:px-10 z-20">
                <button
                    onClick={prevSlide}
                    className="p-4 md:p-6 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl active:scale-90 hover:scale-110 group"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 group-hover:-translate-x-1 transition-transform" />
                </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 md:px-10 z-20">
                <button
                    onClick={nextSlide}
                    className="p-4 md:p-6 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl active:scale-90 hover:scale-110 group"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            {/* 4. PAGINATION DOTS */}
            <div className="absolute bottom-10 inset-x-0 z-30 flex justify-center">
                <div className="flex items-center gap-4 bg-black/20 px-6 py-3 rounded-full backdrop-blur-md border border-white/5">
                    {HERO_SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`group transition-all duration-500 rounded-full flex items-center justify-center ${currentIndex === idx
                                ? 'h-3 w-3 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]'
                                : 'h-2 w-2 bg-white/30 hover:bg-white/60'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        >
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

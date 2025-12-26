import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Gift, Zap, Play, Star, ShieldCheck, ArrowRight } from 'lucide-react';

/**
 * HYNO PROFESSIONAL HERO CAROUSEL V8 (FINAL STABLE)
 * - Navigation: Arrows locked to the far left and right edges.
 * - Symmetrical: Perfectly centered content block.
 * - Solid Backgrounds: Uses CSS background-image + fallbacks to eliminate "broken image" marks.
 * - Fully Responsive: 100vh on Desktop, Professional scale on Mobile.
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
        id: 'new-year- resilience',
        badge: { text: 'New Year Transformation', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
        title: 'New Year Resilience: 2026',
        description: 'Ignite your transformation with HYNO. Start your year with clarity, strength, and a fresh perspective on wellness.',
        primaryCTA: { text: 'Start Training', link: '/patient/yoga/explore' },
        bgImage: 'https://images.unsplash.com/photo-1545208393-596371ba4a30?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 'elite-performance',
        badge: { text: 'Premium Feature', icon: <Zap className="w-4 h-4 text-blue-400" /> },
        title: 'Unlock Elite Access Today',
        description: 'Get personalized mentorship and 1200+ exclusive workout programs designed for your specific health goals.',
        primaryCTA: { text: 'Explore Elite', link: '/patient/membership' },
        bgImage: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 'kids-yoga-growth',
        badge: { text: 'Fresh Release', icon: <Star className="w-4 h-4 text-emerald-400" /> },
        title: 'Power Kids: Yoga For Growth',
        description: 'Specially curated for 6-14 year olds. Boost focus and coordination through fun, story-based movement.',
        primaryCTA: { text: 'Check it Out', link: '/patient/yoga/category/child' },
        bgImage: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=2070&auto=format&fit=crop',
    }
];

export const IntegratedHeroCarousel: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
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
            {/* 1. LAYERED BACKGROUND SYSTEM (Safe from 'X' marks) */}
            <div className="absolute inset-0 z-0 bg-[#0f172a]">
                <div
                    key={activeSlide.bgImage}
                    className="absolute inset-0 transition-opacity duration-1000 bg-center bg-cover bg-no-repeat"
                    style={{
                        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.9)), url(${activeSlide.bgImage})`,
                        opacity: 0.7
                    }}
                />
                {/* Cinema Overlay */}
                <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-[#020617] to-transparent" />
            </div>

            {/* 2. RICH CONTENT HUB (Symmetrical Centering) */}
            <div className="relative z-10 w-full px-6 flex flex-col items-center justify-center text-center">
                <div className="max-w-[1000px] w-full mx-auto">
                    {/* Badge */}
                    <div className="mb-8 flex justify-center">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full shadow-2xl transition-all duration-300 hover:bg-white/10">
                            <span className="flex items-center justify-center">{activeSlide.badge.icon}</span>
                            <span className="text-xs md:text-sm font-black uppercase tracking-[0.25em] text-white">
                                {activeSlide.badge.text}
                            </span>
                        </div>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black text-white leading-[0.9] tracking-tighter mb-10 transition-all duration-1000">
                        {activeSlide.title}
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-3xl text-slate-200 font-medium leading-relaxed mb-16 mx-auto max-w-[800px] drop-shadow-lg">
                        {activeSlide.description}
                    </p>

                    {/* Centered CTA Stack */}
                    <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <button
                            onClick={() => onNavigate(activeSlide.primaryCTA.link)}
                            className="group/btn px-16 py-6 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-400 hover:scale-105 hover:shadow-[0_20px_40px_-10px_rgba(52,211,153,0.3)] transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 shadow-2xl w-full sm:w-auto"
                        >
                            {activeSlide.primaryCTA.text}
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1.5" />
                        </button>

                        <div className="flex items-center gap-3 px-6 py-3 bg-white/[0.03] border border-white/5 rounded-xl backdrop-blur-sm shadow-inner mt-4">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            <div className="text-center">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Security Verified</p>
                                <p className="text-sm font-bold text-slate-300 leading-none lowercase tracking-tight">hyno safety protocol</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. NAVIGATION ARROWS (Locked Left and Right) */}
            <div className="absolute inset-y-0 left-0 flex items-center px-4 md:px-10 z-20">
                <button
                    onClick={prevSlide}
                    className="p-6 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl active:scale-90 hover:scale-110"
                    aria-label="Previous slide"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 md:px-10 z-20">
                <button
                    onClick={nextSlide}
                    className="p-6 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all shadow-2xl active:scale-90 hover:scale-110"
                    aria-label="Next slide"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            </div>

            {/* 4. PAGINATION DOTS (The Only Bottom Navigation) */}
            <div className="absolute bottom-10 inset-x-0 z-30 flex justify-center">
                <div className="flex items-center gap-4">
                    {HERO_SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`group transition-all duration-500 rounded-full flex items-center justify-center ${currentIndex === idx
                                ? 'h-4 w-4 bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                                : 'h-2.5 w-2.5 bg-white/30 hover:bg-white/60'
                                }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        >
                            {currentIndex === idx && (
                                <div className="w-1.5 h-1.5 bg-black rounded-full animate-in zoom-in duration-300" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

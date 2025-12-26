import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Gift, Users, Zap, Heart, Star, ShoppingBag } from 'lucide-react';

/**
 * UX ARCHITECT NOTES:
 * 1. Infinite Loop: Implemented via index wrapping for a seamless "circular" feel.
 * 2. Visual Hierarchy: Badge (Category) -> Headline (Offer/Event) -> Desc -> Action.
 * 3. Wellness Aesthetic: Using HSL-based soft gradients and a "Glass" card for the content overlay.
 * 4. Priority: Festive > Offers > Category Promos > Brand.
 */

interface BannerCard {
    id: string;
    badge: {
        text: string;
        icon: React.ReactNode;
        color: string;
    };
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
    category: 'festive' | 'offer' | 'launch' | 'program' | 'challenge' | 'brand';
    priority: number;
    bgImage: string;
    themeColor: string;
}

const BANNERS: BannerCard[] = [
    {
        id: 'festive-1',
        badge: { text: 'Festive Season', icon: <Sparkles className="w-3 h-3" />, color: 'bg-orange-100 text-orange-700' },
        title: 'New Year Yoga Retreat 2026',
        description: 'Embrace a fresh start. Join our exclusive sunset sessions and mindful workshops to kickstart your wellness journey.',
        ctaText: 'View Retreat Details',
        ctaLink: '/patient/yoga/retreat',
        category: 'festive',
        priority: 1,
        bgImage: 'https://images.unsplash.com/photo-1545208393-596371ba4a30?q=80&w=2070&auto=format&fit=crop',
        themeColor: 'from-orange-50/80 to-amber-50/80'
    },
    {
        id: 'offer-1',
        badge: { text: 'Limited Offer', icon: <Gift className="w-3 h-3" />, color: 'bg-emerald-100 text-emerald-700' },
        title: 'Unlimited Wellness: 40% Off',
        description: 'Unlock premium access to all live sessions and on-demand content with our Elite Yearly Pass. Offer ends in 48 hours.',
        ctaText: 'Claim Your Discount',
        ctaLink: '/patient/membership',
        category: 'offer',
        priority: 2,
        bgImage: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=2070&auto=format&fit=crop',
        themeColor: 'from-emerald-50/80 to-teal-50/80'
    },
    {
        id: 'launch-1',
        badge: { text: 'Newly Launched', icon: <Zap className="w-3 h-3" />, color: 'bg-blue-100 text-blue-700' },
        title: 'Power Yoga with Sarah Jenning',
        description: 'Our top-rated trainer is back with a high-intensity vinyasa series designed for strength and athletic performance.',
        ctaText: 'Book a Spot',
        ctaLink: '/patient/yoga/book/1',
        category: 'launch',
        priority: 3,
        bgImage: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1000&auto=format&fit=crop',
        themeColor: 'from-blue-50/80 to-indigo-50/80'
    },
    {
        id: 'program-kids',
        badge: { text: 'Child Fitness', icon: <Users className="w-3 h-3" />, color: 'bg-indigo-100 text-indigo-700' },
        title: 'Yoga For Growing Champions',
        description: 'Fun, engaging sessions for kids and teens to improve concentration, posture, and natural coordination.',
        ctaText: 'Explore Kids Plans',
        ctaLink: '/patient/yoga/category/child',
        category: 'program',
        priority: 3,
        bgImage: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000',
        themeColor: 'from-indigo-50/80 to-purple-50/80'
    },
    {
        id: 'program-seniors',
        badge: { text: 'Senior Wellness', icon: <Heart className="w-3 h-3" />, color: 'bg-rose-100 text-rose-700' },
        title: 'Active Aging: Senior Serenity',
        description: 'Gentle mobility and restorative breathing exercises tailored for life at 60+. Reclaim your vitality safely.',
        ctaText: 'Learn More',
        ctaLink: '/patient/yoga/category/seniors',
        category: 'program',
        priority: 3,
        bgImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop',
        themeColor: 'from-rose-50/80 to-pink-50/80'
    },
    {
        id: 'brand-1',
        badge: { text: 'Our Mission', icon: <Star className="w-3 h-3" />, color: 'bg-slate-100 text-slate-700' },
        title: 'Wellness Without Boundaries',
        description: 'HYNO is more than an app. We are a community dedicated to mindful living and collective growth through movement.',
        ctaText: 'Our Story',
        ctaLink: '/about',
        category: 'brand',
        priority: 4,
        bgImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2031&auto=format&fit=crop',
        themeColor: 'from-slate-50/80 to-gray-50/80'
    }
].sort((a, b) => a.priority - b.priority);

export const PromotionalCarousel: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, []);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === BANNERS.length - 1 ? 0 : prev + 1));
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev === 0 ? BANNERS.length - 1 : prev - 1));
    }, []);

    useEffect(() => {
        if (isAutoPlaying) {
            resetTimeout();
            timeoutRef.current = setTimeout(nextSlide, 5500); // 5.5s sync with instruction
        }
        return () => resetTimeout();
    }, [currentIndex, isAutoPlaying, nextSlide, resetTimeout]);

    // Touch handlers for Swiping
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStart === null) return;
        const currentTouch = e.targetTouches[0].clientX;
        const diff = touchStart - currentTouch;

        if (diff > 50) { // Swipe Left
            nextSlide();
            setTouchStart(null);
        } else if (diff < -50) { // Swipe Right
            prevSlide();
            setTouchStart(null);
        }
    };

    return (
        <div
            className="group relative w-full mb-16 overflow-hidden select-none"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
        >
            {/* Banner Container */}
            <div className="relative h-[320px] md:h-[380px] rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 bg-white">

                {/* Visual Track */}
                <div
                    className="flex h-full transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {BANNERS.map((banner) => (
                        <div key={banner.id} className="relative w-full h-full flex-shrink-0">

                            {/* Background Image with Mask */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={banner.bgImage}
                                    className="w-full h-full object-cover grayscale-[20%] opacity-90"
                                    alt=""
                                />
                                <div className={`absolute inset-0 bg-gradient-to-r ${banner.themeColor} via-white/40 to-transparent`}></div>
                            </div>

                            {/* Precise Content Overlay */}
                            <div className="relative z-10 h-full flex flex-col justify-center px-10 md:px-20 max-w-3xl">

                                {/* Badge */}
                                <div className="flex mb-6">
                                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm backdrop-blur-md ${banner.badge.color}`}>
                                        {banner.badge.icon}
                                        {banner.badge.text}
                                    </span>
                                </div>

                                {/* Typography */}
                                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-5 leading-[1.1] tracking-tight">
                                    {banner.title}
                                </h2>

                                <p className="text-slate-600 text-sm md:text-lg mb-8 max-w-lg leading-relaxed font-semibold opacity-90">
                                    {banner.description}
                                </p>

                                {/* CTA Button - Cult.fit Style */}
                                <div className="flex">
                                    <button
                                        onClick={() => onNavigate(banner.ctaLink)}
                                        className="h-12 px-10 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:scale-[1.03] transition-all flex items-center gap-3 shadow-lg shadow-slate-900/20 active:scale-95 group/btn"
                                    >
                                        {banner.ctaText}
                                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Navigation Controls */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={prevSlide}
                        className="pointer-events-auto p-3 rounded-2xl bg-white/60 backdrop-blur-lg border border-white text-slate-800 hover:bg-white transition-all shadow-lg active:scale-90"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="pointer-events-auto p-3 rounded-2xl bg-white/60 backdrop-blur-lg border border-white text-slate-800 hover:bg-white transition-all shadow-lg active:scale-90"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Indicators (Dots) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
                    {BANNERS.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${currentIndex === idx ? 'w-10 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

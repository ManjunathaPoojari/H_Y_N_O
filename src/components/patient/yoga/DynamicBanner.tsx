import React, { useState, useEffect } from 'react';
import { X, Gift, Sparkles, Calendar, PartyPopper } from 'lucide-react';

export const DynamicBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [bannerType, setBannerType] = useState<'festival' | 'offer' | 'default'>('default');
    const [content, setContent] = useState<{ title: string; message: string; icon: React.ReactNode }>({
        title: '',
        message: '',
        icon: null
    });

    useEffect(() => {
        const today = new Date();
        const month = today.getMonth(); // 0-11
        const date = today.getDate();

        // 1. Festival Logic (Expanded for demo purposes)
        const isDiwali = month === 10 && date === 12; // Example date
        const isChristmas = month === 11 && date === 25; // Dec 25
        const isNewYear = month === 0 && date === 1;
        const isYogaDay = month === 5 && date === 21; // June 21

        if (isChristmas) {
            setBannerType('festival');
            setContent({
                title: 'Merry Christmas! 🎄',
                message: 'Gift yourself the joy of health and peace today.',
                icon: <Gift className="w-5 h-5" />
            });
        } else if (isDiwali) {
            setBannerType('festival');
            setContent({
                title: 'Happy Diwali 🪔',
                message: 'Begin your day with light & balance.',
                icon: <Sparkles className="w-5 h-5" />
            });
        } else if (isNewYear) {
            setBannerType('festival');
            setContent({
                title: 'Happy New Year 🎉',
                message: 'Start your year with a new wellness routine.',
                icon: <PartyPopper className="w-5 h-5" />
            });
        } else if (isYogaDay) {
            setBannerType('festival');
            setContent({
                title: 'Happy International Yoga Day! 🧘‍♀️',
                message: 'Join a special global session today.',
                icon: <Calendar className="w-5 h-5" />
            });
        }
        // 2. Offer Logic (Randomly active for demo if no festival)
        else if (Math.random() > 0.7) {
            setBannerType('offer');
            setContent({
                title: 'Limited Offer',
                message: 'Flat 30% off Yoga Plans this week!',
                icon: <Gift className="w-5 h-5" />
            });
        }
        // 3. Default Motivational Message
        else {
            setBannerType('default');
            const messages = [
                "A few minutes of yoga can change your entire day.",
                "Consistency is the key to transformation.",
                "Breathe. Stretch. Relax. Repeat."
            ];
            setContent({
                title: 'Daily Motivation',
                message: messages[Math.floor(Math.random() * messages.length)],
                icon: <Sparkles className="w-5 h-5" />
            });
        }
    }, []);

    if (!isVisible) return null;

    const getStyles = () => {
        switch (bannerType) {
            case 'festival':
                return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-orange-900 icon-bg-orange-100';
            case 'offer':
                return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-900 icon-bg-blue-100';
            default:
                return 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-900 icon-bg-emerald-100';
        }
    };

    const styleClasses = getStyles();

    return (
        <div className={`relative w-full max-w-7xl mx-auto mb-8 rounded-xl p-4 border flex items-center justify-between shadow-sm animate-in fade-in slide-in-from-top-4 duration-500 ${styleClasses}`}>
            <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-full bg-white/60 backdrop-blur-sm shadow-sm`}>
                    {content.icon}
                </div>
                <div>
                    <span className="font-bold text-sm md:text-base mr-2">{content.title}</span>
                    <span className="text-sm opacity-90 block md:inline font-medium">{content.message}</span>
                </div>
            </div>
            <button
                onClick={() => setIsVisible(false)}
                className="p-1.5 hover:bg-black/5 rounded-full transition-colors ml-4"
                aria-label="Dismiss banner"
            >
                <X className="w-4 h-4 opacity-60 hover:opacity-100" />
            </button>
        </div>
    );
};

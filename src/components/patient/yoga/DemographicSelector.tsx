import React from 'react';
import { ShieldCheck, Baby, Heart, User, Sparkles } from 'lucide-react';

interface DemographicSelectorProps {
    onNavigate: (path: string) => void;
}

const DEMOGRAPHICS = [
    {
        id: 'child',
        title: 'Kids & Teens',
        // New Alternative: Young girl doing yoga (High availability)
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000',
        desc: 'Growth & Focus',
        icon: <Baby className="w-5 h-5" />
    },
    {
        id: 'men',
        title: 'Men',
        // Verified working: Gym Man
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop',
        desc: 'Strength & Power',
        icon: <User className="w-5 h-5" />
    },
    {
        id: 'women',
        title: 'Women',
        // New Alternative: Woman stretching blue background (High availability)
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000',
        desc: 'Holistic Wellness',
        icon: <Heart className="w-5 h-5" />
    },
    {
        id: 'seniors',
        title: 'Seniors',
        // Verified working: Active seniors
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000&auto=format&fit=crop',
        desc: 'Active Aging',
        icon: <Sparkles className="w-5 h-5" />
    }
];

export const DemographicSelector: React.FC<DemographicSelectorProps> = ({ onNavigate }) => {
    return (
        <div className="space-y-8 mb-12">
            <div>
                <span className="text-emerald-600 font-bold tracking-wider text-xs uppercase block mb-1">Tailored Wellness</span>
                <h2 className="text-2xl font-bold text-slate-900">Browse by Life Stage</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {DEMOGRAPHICS.map((demo) => {
                    return (
                        <div
                            key={demo.id}
                            onClick={() => onNavigate(`/patient/yoga/category/${demo.id}`)}
                            className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 cursor-pointer h-72"
                        >
                            <img
                                src={demo.image}
                                alt={demo.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                    // Fallback text if image fails entirely
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add('bg-slate-800');
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/40 transition-all"></div>

                            <div className="absolute bottom-0 left-0 p-5 w-full">
                                <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-white">
                                    {demo.icon}
                                    {demo.desc}
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2 leading-none">{demo.title}</h3>

                                <div className="flex items-center gap-2 text-white text-xs opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                    <ShieldCheck className="w-3 h-3 text-white" />
                                    <span>Explore Plans</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

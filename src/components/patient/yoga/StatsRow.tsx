import React from 'react';
import { Activity, Users, Heart, Calendar } from 'lucide-react';

interface StatsRowProps {
    totalPractices: number;
    beginnerFriendly: number;
    favorites: number;
    todaySessions: number;
    onClickTotal?: () => void;
    onClickBeginner?: () => void;
    onClickFavorites?: () => void;
    onClickToday?: () => void;
}

export const StatsRow: React.FC<StatsRowProps> = ({
    totalPractices,
    beginnerFriendly,
    favorites,
    todaySessions,
    onClickTotal,
    onClickBeginner,
    onClickFavorites,
    onClickToday
}) => {
    const stats = [
        {
            label: 'Total Practices',
            value: totalPractices,
            icon: Activity,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            onClick: onClickTotal
        },
        {
            label: 'Beginner Friendly',
            value: beginnerFriendly,
            icon: Users,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
            onClick: onClickBeginner
        },
        {
            label: 'Favorites',
            value: favorites,
            icon: Heart,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            onClick: onClickFavorites
        },
        {
            label: 'Today',
            value: todaySessions > 0 ? todaySessions : '-',
            icon: Calendar,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            onClick: onClickToday
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, idx) => (
                <div
                    key={idx}
                    onClick={stat.onClick}
                    className={`bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:scale-[1.02] transition-all duration-300 ${stat.onClick ? 'cursor-pointer active:scale-95' : ''}`}
                >
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-slate-900 leading-none mb-1">
                            {stat.value}
                        </div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                            {stat.label}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

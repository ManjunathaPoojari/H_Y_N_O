import React, { useState } from 'react';
import { Play, Clock, BarChart, Info, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, Heart, Dumbbell, AlertOctagon } from 'lucide-react';

/**
 * HYNO SAFETY-FIRST PRACTICE CARD
 * 1. Difficulty, Duration, and Equipment clearly defined.
 * 2. Mandatory safety precautions toggle.
 * 3. 'Who should avoid' section for maximum liability protection.
 */

interface PracticeCardProps {
    title: string;
    level: string;
    duration: string;
    category: string;
    image: string;
    equipment: string[];
    safetyTips?: string[];
    whoShouldAvoid?: string;
    onClick: () => void;
    isFavorite?: boolean;
    onToggleFavorite?: (e: React.MouseEvent) => void;
}

export const PracticeCard: React.FC<PracticeCardProps> = ({
    title,
    level,
    duration,
    category,
    image,
    equipment,
    safetyTips = [],
    whoShouldAvoid,
    onClick,
    isFavorite = false,
    onToggleFavorite
}) => {
    const [showSafety, setShowSafety] = useState(false);
    const [acknowledged, setAcknowledged] = useState(false);

    const handleStart = () => {
        // Enforce safety review if tips or warnings exist
        if (!acknowledged && (safetyTips.length > 0 || whoShouldAvoid)) {
            setShowSafety(true);
            return;
        }
        onClick();
    };

    return (
        <div className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500 flex flex-col h-full">

            {/* Image Header */}
            <div className="relative h-80 overflow-hidden cursor-pointer" onClick={onClick}>
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-1000"
                />

                {/* Gradient Masks */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                {/* Level Badge */}
                <div className="absolute top-4 left-4 z-10">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${level.toLowerCase() === 'beginner' ? 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30' :
                        level.toLowerCase() === 'intermediate' ? 'bg-blue-500/20 text-blue-100 border-blue-400/30' :
                            'bg-rose-500/20 text-rose-100 border-rose-400/30'
                        }`}>
                        {level}
                    </span>
                </div>

                {/* Favorite Toggle */}
                <button
                    onClick={onToggleFavorite}
                    className="absolute top-4 right-4 p-2.5 rounded-2xl backdrop-blur-md bg-white/10 text-white hover:bg-rose-500 transition-all z-10 border border-white/10"
                >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                </button>

                {/* Bottom Text */}
                <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{category}</p>
                    <h3 className="text-xl font-bold text-white leading-tight">{title}</h3>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex flex-col flex-1">

                {/* Primary Meta */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        {duration}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                        <Dumbbell className="w-3.5 h-3.5 text-emerald-500" />
                        {equipment?.[0] || 'No Equipment'}
                    </div>
                </div>

                {/* Safety Expansion */}
                <div className="mb-6">
                    <button
                        onClick={() => setShowSafety(!showSafety)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${showSafety ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-100 hover:border-emerald-200'
                            }`}
                    >
                        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                            <ShieldAlert className="w-4 h-4" />
                            Safety & Equipment
                        </span>
                        {showSafety ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {showSafety && (
                        <div className="mt-3 space-y-4 animate-in fade-in slide-in-from-top-2">
                            {/* Who should avoid */}
                            {whoShouldAvoid && (
                                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex gap-3">
                                    <AlertOctagon className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-black text-rose-700 uppercase mb-1">Who should avoid?</p>
                                        <p className="text-[11px] text-rose-600 leading-tight font-medium">{whoShouldAvoid}</p>
                                    </div>
                                </div>
                            )}

                            {/* Tips */}
                            <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100/50">
                                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-[0.2em] mb-4">Pre-Start Checklist</p>
                                <ul className="space-y-4">
                                    {safetyTips?.map((tip, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-xs text-slate-700 font-semibold leading-relaxed">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                            {tip}
                                        </li>
                                    ))}
                                    <li className="flex items-center gap-3 text-xs text-slate-800 font-black pt-3 border-t border-emerald-200/50">
                                        <Dumbbell className="w-3.5 h-3.5 text-emerald-500" />
                                        <span>Required Gear: {equipment?.join(', ') || 'Yoga Mat'}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Acknowledge */}
                            <label className="flex items-center gap-4 p-4 bg-emerald-600 rounded-xl border border-emerald-500 cursor-pointer group hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/10">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-white/30 bg-white/20 text-white focus:ring-white/50"
                                    checked={acknowledged}
                                    onChange={(e) => setAcknowledged(e.target.checked)}
                                />
                                <span className="text-xs font-black text-white uppercase tracking-widest">I confirm I am fit to start</span>
                            </label>
                        </div>
                    )}
                </div>

                {/* Action CTA */}
                <div className="mt-auto">
                    <button
                        onClick={handleStart}
                        className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl ${!acknowledged && (safetyTips.length > 0 || whoShouldAvoid)
                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20'
                            }`}
                    >
                        {(!acknowledged && (safetyTips.length > 0 || whoShouldAvoid)) ? (
                            <>
                                <Info className="w-4 h-4" />
                                Review Safety to Start
                            </>
                        ) : (
                            <>
                                <Play className="w-4 h-4 fill-current" />
                                Start Training Now
                            </>
                        )}
                    </button>
                    <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
                        Powered by HYNO Safety Engine
                    </p>
                </div>
            </div>
        </div>
    );
};

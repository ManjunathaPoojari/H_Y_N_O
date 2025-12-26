import React from 'react';
import { Play, Target, Flame, Clock } from 'lucide-react';

interface HeroBannerProps {
    onNavigate: (path: string) => void;
    onStartPractice: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate, onStartPractice }) => {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 shadow-sm border border-emerald-100/50 mb-12">
            {/* Abstract Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-100/40 to-emerald-100/40 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-green-100/40 to-lime-100/40 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3" />
            </div>

            <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="max-w-xl space-y-6 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                        Transform Your <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">Body & Mind</span>
                    </h1>

                    <p className="text-lg text-slate-600 leading-relaxed font-medium md:pr-12">
                        Experience the power of personalized yoga. Find balance, strength, and inner peace with our curated sessions designed for every level.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                        <button
                            onClick={onStartPractice}
                            className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 group"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Start Practice
                        </button>
                        <button
                            onClick={() => onNavigate('/patient/yoga/schedule')}
                            className="px-8 py-4 rounded-xl font-semibold border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 transition-colors duration-200"
                        >
                            View Schedule
                        </button>
                    </div>
                </div>

                {/* Hero Graphic - Wellness Dashboard Widget */}
                <div className="hidden md:block relative w-full max-w-sm lg:max-w-md aspect-square perspective-1000">
                    {/* Animated Glow Blob */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-emerald-200/40 to-teal-200/40 rounded-full animate-blob mix-blend-multiply filter blur-3xl opacity-70"></div>

                    {/* Main Glass Card */}
                    <div className="absolute inset-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-6 flex flex-col justify-between transform rotate-y-6 rotate-x-6 hover:rotate-0 transition-all duration-700 group">

                        {/* Header */}
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h3 className="text-slate-900 font-bold text-lg">Daily Goals</h3>
                                <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Today's Progress</p>
                            </div>
                            <div className="bg-emerald-50 p-2 rounded-full shadow-inner">
                                <Target className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>

                        {/* Central Circular Progress */}
                        <div className="flex-1 flex items-center justify-center py-2">
                            <div className="relative w-48 h-48">
                                {/* Background Circle */}
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="96" cy="96" r="80" stroke="#f1f5f9" strokeWidth="16" fill="transparent" />
                                    <circle
                                        cx="96"
                                        cy="96"
                                        r="80"
                                        stroke="currentColor"
                                        strokeWidth="16"
                                        fill="transparent"
                                        strokeDasharray="502"
                                        strokeDashoffset="125"
                                        strokeLinecap="round"
                                        className="text-emerald-500 drop-shadow-lg transition-all duration-1000 ease-out group-hover:stroke-emerald-400"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-900">
                                    <span className="text-4xl font-extrabold tracking-tight">75%</span>
                                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mt-1">Achieved</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Widgets */}
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="bg-white/80 p-3 rounded-2xl flex items-center gap-3 shadow-sm border border-emerald-50">
                                <div className="bg-orange-100 p-2.5 rounded-xl text-orange-600">
                                    <Flame className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">320</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Kcal Burn</p>
                                </div>
                            </div>
                            <div className="bg-white/80 p-3 rounded-2xl flex items-center gap-3 shadow-sm border border-emerald-50">
                                <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">45m</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Duration</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

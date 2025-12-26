import React from 'react';
import { ArrowRight, Play, Activity, Heart, Zap } from 'lucide-react';

interface ModernWellnessHeroProps {
    onExplore: () => void;
}

export const ModernWellnessHero: React.FC<ModernWellnessHeroProps> = ({ onExplore }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);

    return (
        <div className="relative w-full min-h-[85vh] bg-slate-50 overflow-hidden mb-8 md:rounded-b-[4rem] group">

            {/* 1. Subtle Background Video (Animating Human) */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50/95 via-slate-50/70 to-slate-50/90 z-10" /> {/* Smart gradient for text readability */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-50"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-young-woman-working-out-at-the-gym-43765-large.mp4" type="video/mp4" />
                </video>
            </div>

            {/* Background Decor (Optional geometric accents) */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-emerald-50/40 skew-x-12 translate-x-32 z-0 mix-blend-multiply" />


            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col lg:flex-row items-center pt-20 pb-12 gap-12 lg:gap-20">

                {/* Left Content - HIGHER Z-INDEX TO PREVENT OVERLAP */}
                <div className="flex-1 space-y-8 text-center lg:text-left pt-10 lg:pt-0 relative z-30">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4 duration-700 shadow-sm">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>#1 Rated Wellness App</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tight">
                        HYNO <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-400">FITNESS</span>
                    </h1>

                    <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                        Experience the next evolution of personal wellness.
                        Expert-led yoga, meditation, and strength training tailored to your bio-rhythm.
                        {isPlaying && <span className="block mt-2 text-emerald-600 font-bold animate-pulse">Now Playing Demo...</span>}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <button
                            onClick={onExplore}
                            className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all duration-300 shadow-xl hover:shadow-emerald-500/20 flex items-center justify-center gap-2 group/btn relative z-20"
                        >
                            Start Training
                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`w-full sm:w-auto px-8 py-4 border-2 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 relative z-20 ${isPlaying
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-inner'
                                : 'bg-white/80 backdrop-blur-sm text-slate-700 border-slate-200 hover:border-emerald-200 hover:text-emerald-700'
                                }`}
                        >
                            <Play className={`w-5 h-5 fill-current ${isPlaying ? 'text-emerald-600' : ''}`} />
                            {isPlaying ? 'Pause Demo' : 'Watch Demo'}
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 opacity-90">
                        <div>
                            <p className="text-3xl font-black text-slate-900">50+</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Expert Trainers</p>
                        </div>
                        <div className="w-px h-10 bg-slate-300" />
                        <div>
                            <p className="text-3xl font-black text-slate-900">1200+</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Workouts</p>
                        </div>
                        <div className="w-px h-10 bg-slate-300" />
                        <div>
                            <p className="text-3xl font-black text-slate-900">4.9</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">User Rating</p>
                        </div>
                    </div>
                </div>

                {/* Right Visuals - LOWER Z-INDEX */}
                <div className="flex-1 relative w-full h-[500px] md:h-[700px] flex items-center justify-center z-10">

                    {/* Video Container Blob/Shape */}
                    <div className="relative w-full max-w-lg aspect-[4/5] md:aspect-square">
                        {/* Background Blob Glow */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200 to-teal-200 rounded-[3rem] rotate-6 scale-105 blur-2xl opacity-60 animate-pulse-slow"></div>

                        {/* Main Video Card */}
                        <div className="absolute inset-0 bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/50 transform -rotate-2 hover:rotate-0 transition-all duration-700 ease-out clip-path-custom z-10">
                            <video
                                key={isPlaying ? 'playing' : 'paused'}
                                src="https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-stretch-40-large.mp4"
                                className={`w-full h-full object-cover transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-90'}`}
                                autoPlay={true}
                                loop
                                muted
                                playsInline
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none"></div>

                            {!isPlaying && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] transition-all duration-500">
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl cursor-pointer hover:scale-110 transition-transform" onClick={() => setIsPlaying(true)}>
                                        <Play className="w-8 h-8 text-white fill-current ml-1" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Floating Widgets - SAFE INSIDE RIGHT SIDE */}
                        <div className="absolute top-12 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/60 animate-bounce-slow z-30 hidden md:block">
                            <div className="flex items-center gap-3">
                                <div className="bg-rose-100 p-2.5 rounded-xl text-rose-500">
                                    <Heart className="w-5 h-5 fill-current" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Heart Rate</p>
                                    <p className="text-lg font-black text-slate-800">112 <span className="text-xs font-semibold text-slate-400">bpm</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute bottom-12 right-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/60 animate-bounce-slow delay-700 z-30 hidden md:block">
                            <div className="flex items-center gap-3">
                                <div className="bg-amber-100 p-2.5 rounded-xl text-amber-500">
                                    <Activity className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Calories</p>
                                    <p className="text-lg font-black text-slate-800">324 <span className="text-xs font-semibold text-slate-400">kcal</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

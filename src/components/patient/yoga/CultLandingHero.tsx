import React from 'react';
import { ChevronDown, QrCode, Smartphone } from 'lucide-react';

interface CultLandingHeroProps {
    onExplore: () => void;
}

export const CultLandingHero: React.FC<CultLandingHeroProps> = ({ onExplore }) => {
    return (
        <div className="relative w-full min-h-screen overflow-hidden rounded-b-[3rem] mb-12 shadow-2xl group bg-black">

            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for contrast */}
                {/* Fallback image if video fails or loads slowly */}
                <img
                    src="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075&auto=format&fit=crop"
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Fitness Background"
                />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                    poster="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075&auto=format&fit=crop"
                >
                    {/* Using a reliable gym/fitness stock video URL */}
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-athlete-working-out-with-heavy-ropes-in-gym-43759-large.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>

            {/* Navbar Overlay */}
            <nav className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-6 py-6 md:px-12 text-white/90 font-medium tracking-wide text-sm md:text-base">
                <div className="flex gap-8 items-center">
                    <span className="text-white hover:text-emerald-400 cursor-pointer transition-colors">FITNESS</span>
                    <span className="hidden md:inline hover:text-emerald-400 cursor-pointer transition-colors">SPORTS</span>
                    <span className="hidden md:inline hover:text-emerald-400 cursor-pointer transition-colors">STORE</span>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="hidden md:inline">BANGALORE</span>
                    <button className="border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
                        GET APP
                    </button>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-xs">👤</span>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 mt-16">

                {/* Hyno Typography Logo Simulation */}
                <div className="mb-4 animate-in fade-in zoom-in duration-1000">
                    <h2 className="text-white font-bold tracking-[0.2em] text-lg md:text-xl mb-[-0.5rem] opacity-90">WE ARE</h2>
                    <h1 className="text-[8rem] md:text-[10rem] lg:text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-white drop-shadow-2xl font-sans"
                        style={{ WebkitTextStroke: '2px rgba(255,255,255,0.1)' }}>
                        Hyno
                    </h1>
                </div>

                <h3 className="text-xl md:text-3xl text-white font-bold max-w-2xl leading-snug drop-shadow-lg mb-10">
                    A fitness movement that is worth <br />
                    breaking a sweat for
                </h3>

                <button
                    onClick={onExplore}
                    className="bg-white text-emerald-900 px-8 py-4 rounded-lg font-bold text-lg md:text-xl tracking-wide hover:scale-105 hover:bg-emerald-50 transition-all duration-300 shadow-xl"
                >
                    EXPLORE HYNO
                </button>


                <div
                    onClick={onExplore}
                    className="absolute bottom-12 cursor-pointer animate-bounce text-white/50 hover:text-white transition-colors"
                >
                    <ChevronDown className="w-10 h-10" />
                </div>
            </div>

            {/* QR Code Card - Bottom Right */}
            <div className="absolute bottom-8 right-8 z-30 hidden lg:flex bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl flex-col items-center gap-3 transform translate-y-4 hover:translate-y-0 transition-transform duration-300">
                <div className="text-xs font-bold text-slate-800 text-center leading-tight">
                    For better experience,<br />use Hyno app
                </div>
                <div className="bg-slate-900 p-2 rounded-lg">
                    <QrCode className="w-20 h-20 text-white" />
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Smartphone className="w-3 h-3" />
                    <span>Scan to download</span>
                </div>
            </div>

            {/* Decorative Vector Curves (Optional visual flair similar to screenshot) */}
            <svg className="absolute top-1/2 left-0 w-full h-full pointer-events-none opacity-30 mix-blend-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 50 Q 50 100 100 50" stroke="white" strokeWidth="0.5" fill="none" />
                <path d="M0 60 Q 50 110 100 60" stroke="teal" strokeWidth="0.5" fill="none" />
            </svg>
        </div>
    );
};

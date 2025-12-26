import React, { useState } from 'react';
import { ArrowLeft, Activity, ShieldAlert, Heart, Zap, Info, Play, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { PracticeCard } from './PracticeCard';

/**
 * HYNO CATEGORY & SAFETY ARCHITECTURE
 * 1. Demographic Centered (Child, Men, Women, Seniors)
 * 2. Sub-categories: Health Issues, Fitness Goals, Experience Levels
 * 3. Mandatory Safety Pre-check
 */

const PlusCircle = (props: any) => <Activity {...props} />; // Mock for missing icon

interface YogaCategoryPageProps {
    categoryId: string;
    onNavigate: (path: string) => void;
}

const CATEGORY_DATA: Record<string, {
    title: string;
    desc: string;
    image: string;
    accent: string;
    issues: { id: string; name: string; icon: React.ReactNode; desc: string }[];
    goals: { id: string; name: string; icon: React.ReactNode; desc: string }[];
}> = {
    'child': {
        title: 'Kids & Teens Wellness',
        desc: 'Active foundations for growth, focus, and natural coordination.',
        accent: 'emerald',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1000',
        issues: [
            { id: 'obesity', name: 'Childhood Obesity', icon: <Activity className="w-5 h-5" />, desc: 'Fun intense movement for weight health.' },
            { id: 'adhd', name: 'Concentration/ADHD', icon: <Zap className="w-5 h-5" />, desc: 'Focus-building mindfulness exercises.' },
            { id: 'posture', name: 'Scoliosis/Posture', icon: <ShieldAlert className="w-5 h-5" />, desc: 'Corrective flows for screen-time fatigue.' }
        ],
        goals: [
            { id: 'growth', name: 'Growth & Height', icon: <Zap className="w-5 h-5" />, desc: 'Spinal elongation and bone health.' },
            { id: 'calm', name: 'Exam Stress', icon: <Heart className="w-5 h-5" />, desc: 'Calming breathwork for academic pressure.' }
        ]
    },
    'men': {
        title: "Men's Health & Performance",
        desc: 'Optimizing structural strength, cardiovascular health, and focus.',
        accent: 'blue',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000',
        issues: [
            { id: 'diabetes', name: 'Diabetes Mgmt', icon: <Activity className="w-5 h-5" />, desc: 'Metabolic flows to help insulin sensitivity.' },
            { id: 'back-pain', name: 'Lower Back Pain', icon: <ShieldAlert className="w-5 h-5" />, desc: 'Relief for desk-bound lower back stress.' },
            { id: 'knee-pain', name: 'Knee & Joint Pain', icon: <ShieldAlert className="w-5 h-5" />, desc: 'Ligament strengthening and recovery.' }
        ],
        goals: [
            { id: 'weight-loss', name: 'Weight Loss', icon: <Zap className="w-5 h-5" />, desc: 'High-burn Vinyasa and power training.' },
            { id: 'strength', name: 'Core Strength', icon: <Heart className="w-5 h-5" />, desc: 'Functional stability for daily power.' }
        ]
    },
    'women': {
        title: "Women's Holistic Health",
        desc: 'Nurturing wellness through every biological cycle and life stage.',
        accent: 'rose',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000',
        issues: [
            { id: 'pcos', name: 'PCOS & Hormonal', icon: <ShieldAlert className="w-5 h-5" />, desc: 'Cycle regulation and cortisol reduction.' },
            { id: 'thyroid', name: 'Thyroid Support', icon: <Activity className="w-5 h-5" />, desc: 'Flows to stimulate glandular health.' },
            { id: 'stress', name: 'Anxiety/Stress', icon: <Heart className="w-5 h-5" />, desc: 'Restorative deep-breathing therapy.' }
        ],
        goals: [
            { id: 'flexibility', name: 'Flexibility', icon: <Zap className="w-5 h-5" />, desc: 'Deep tissue stretching and elongation.' },
            { id: 'postnatal', name: 'Postnatal Recovery', icon: <PlusCircle className="w-5 h-5" />, desc: 'Safe core-rebuilding and energy flows.' }
        ]
    },
    'seniors': {
        title: 'Silver Vitality',
        desc: 'Active aging with focus on balance, heart health, and joint care.',
        accent: 'amber',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1000',
        issues: [
            { id: 'arthritis', name: 'Arthritis Care', icon: <ShieldAlert className="w-5 h-5" />, desc: 'Gentle lubrication for stiff joints.' },
            { id: 'blood-pressure', name: 'Hypertension', icon: <Activity className="w-5 h-5" />, desc: 'Heart-safe flows for arterial health.' },
            { id: 'balance', name: 'Balance/Vertigo', icon: <AlertTriangle className="w-5 h-5" />, desc: 'Proprioception drills to prevent falls.' }
        ],
        goals: [
            { id: 'longevity', name: 'Longevity/Vitality', icon: <Heart className="w-5 h-5" />, desc: 'Full body restorative circulation.' },
            { id: 'mobility', name: 'Functional Mobility', icon: <Zap className="w-5 h-5" />, desc: 'Daily ROM for independent living.' }
        ]
    }
};

export const YogaCategoryPage: React.FC<YogaCategoryPageProps> = ({ categoryId, onNavigate }) => {
    const data = CATEGORY_DATA[categoryId];
    const [selectedSubTab, setSelectedSubTab] = useState<'issues' | 'goals' | 'level'>('issues');
    const [selectedLevel, setSelectedLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
    const [activeSelection, setActiveSelection] = useState<string | null>(null);

    if (!data) return <div>Category not found</div>;

    return (
        <div className="min-h-screen bg-white font-sans">
            {/* 1. Header Hero Area */}
            <div className="relative h-[400px] max-w-7xl mx-auto bg-slate-900 overflow-hidden md:rounded-[3rem] mt-8 shadow-2xl">
                <img src={data.image} className="w-full h-full object-cover opacity-50 grayscale-[30%]" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                <div className="absolute top-6 left-6 right-6 z-20 flex flex-wrap gap-3">
                    <button
                        onClick={() => onNavigate('/patient/yoga')}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all shadow-xl"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        BACK TO EXPLORE
                    </button>
                    <button
                        onClick={() => onNavigate('/patient/dashboard')}
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all shadow-xl"
                    >
                        <Activity className="w-4 h-4" />
                        BACK TO DASHBOARD
                    </button>
                </div>

                <div className="absolute bottom-20 left-10 md:left-20 max-w-3xl z-20">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-md">
                            Tailored Selection
                        </span>
                        <div className="w-12 h-px bg-white/20" />
                        <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{categoryId} demographics</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                        {data.title}
                    </h1>
                    <p className="text-xl text-slate-300 font-medium leading-relaxed opacity-90">
                        {data.desc}
                    </p>
                </div>
            </div>

            {/* 2. Structured Discovery Logic (Sub-Tabs) */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-8 md:p-14 mb-64 -mt-20 relative z-30 border border-slate-100/50">

                    {/* Discovery Nav */}
                    <div className="flex flex-wrap gap-4 mb-14 border-b border-slate-100 pb-8">
                        {[
                            { id: 'issues', label: 'Health Issues', icon: <Heart className="w-4 h-4" /> },
                            { id: 'goals', label: 'Fitness Goals', icon: <Zap className="w-4 h-4" /> },
                            { id: 'level', label: 'Experience Level', icon: <Activity className="w-4 h-4" /> }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setSelectedSubTab(tab.id as any); setActiveSelection(null); }}
                                className={`px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 transition-all ${selectedSubTab === tab.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Sub-content: Issues/Goals */}
                    {selectedSubTab !== 'level' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {data[selectedSubTab].map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => setActiveSelection(item.id)}
                                    className={`group cursor-pointer p-10 rounded-[2.5rem] border-2 transition-all duration-500 relative overflow-hidden ${activeSelection === item.id ? 'bg-slate-900 border-slate-900 text-white shadow-[0_20px_60px_rgba(15,23,42,0.3)] scale-[1.02]' : 'bg-white border-slate-100 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/10'}`}
                                >
                                    {activeSelection !== item.id && (
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
                                    )}
                                    <div className={`p-4 rounded-2xl w-fit mb-6 transition-colors ${activeSelection === item.id ? 'bg-white/10 text-emerald-400' : 'bg-slate-50 text-emerald-600'}`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl font-black mb-3 leading-tight">{item.name}</h3>
                                    <p className={`text-sm font-medium leading-relaxed ${activeSelection === item.id ? 'text-slate-300' : 'text-slate-500'}`}>
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Level Selector */
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                                <div
                                    key={lvl}
                                    onClick={() => setSelectedLevel(lvl as any)}
                                    className={`p-10 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 relative overflow-hidden ${selectedLevel === lvl ? 'bg-slate-900 border-slate-900 text-white shadow-[0_20px_60px_rgba(15,23,42,0.3)]' : 'bg-white border-slate-100 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/10'}`}
                                >
                                    {selectedLevel !== lvl && (
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl" />
                                    )}
                                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase mb-4 ${selectedLevel === lvl ? 'bg-white/10 text-emerald-400' : 'bg-slate-100 text-slate-500'}`}>Tier {lvl[0]}</span>
                                    <h3 className="text-3xl font-black mb-2">{lvl}</h3>
                                    <p className={`text-sm font-medium ${selectedLevel === lvl ? 'text-slate-300' : 'text-slate-500'}`}>
                                        {lvl === 'Beginner' ? 'Low impact foundation.' : lvl === 'Intermediate' ? 'Moderate flow and power.' : 'Peak athletic intensity.'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Safety & Disclaimer Area (MANDATORY BEFORE PRACTICES) */}
                <div className="mb-48 bg-slate-50 rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/[0.03] blur-[100px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-12 w-fit border border-emerald-100">
                            <ShieldAlert className="w-4 h-4" />
                            Mandatory Pre-Check
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-14 leading-[1.1] tracking-tight text-center md:text-left">Your Health, <br /><span className="text-emerald-600">Our Responsibility.</span></h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                            {/* Who should avoid */}
                            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md flex flex-col h-full">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-6">Who should avoid?</p>
                                <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                                    {"Individuals with acute physical trauma, recent surgical procedures (< 3 months), or uncontrolled cardiovascular conditions should consult an in-person specialist."}
                                </p>
                            </div>

                            {/* Required Equipment */}
                            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md flex flex-col h-full">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-6">Required Equipment</p>
                                <ul className="space-y-4">
                                    <li className="text-sm font-semibold text-slate-600 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]" /> Anti-slip Professional Mat
                                    </li>
                                    <li className="text-sm font-semibold text-slate-600 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]" /> Hydration (1L+ Electrolytes)
                                    </li>
                                    <li className="text-sm font-semibold text-slate-600 flex items-center gap-3">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]" /> Supportive Props (Blocks)
                                    </li>
                                </ul>
                            </div>

                            {/* Expert Review */}
                            <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md flex flex-col h-full">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-2.5 bg-emerald-50 rounded-xl">
                                        <Info className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900">Expert Review</h3>
                                </div>
                                <p className="text-sm text-slate-500 font-bold mb-10 leading-relaxed">
                                    Verified by our {data.title} medical board for maximum safety.
                                </p>
                                <div className="mt-auto">
                                    <button
                                        className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                        I am fit to start
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Practices Hub (STATIC) */}
                <div className="mb-48">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">Recommended Flows</h2>
                            <p className="text-lg text-slate-500 font-medium">Safe, medically-reviewed flows curated for {selectedLevel} practitioners.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* DEMO: Sample filtered practices */}
                        {[
                            { title: 'Morning Vitality', duration: '20m', equipment: ['Yoga Mat'], difficulty: 'Beginner' },
                            { title: 'Structural Relief', duration: '15m', equipment: ['Mat', 'Block'], difficulty: 'Beginner' },
                            { title: 'Breath & Focus', duration: '10m', equipment: ['Chair'], difficulty: 'Beginner' }
                        ].map((p, i) => (
                            <PracticeCard
                                key={i}
                                title={p.title}
                                category="Yoga"
                                level={p.difficulty as any}
                                duration={p.duration}
                                equipment={p.equipment}
                                image={`https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&sig=${i}`}
                                safetyTips={['Avoid sharp pain', 'Breath deeply']}
                                onClick={() => { }}
                            />
                        ))}
                    </div>
                </div>

                {/* 5. Recommended Experts (STATIC) */}
                <div className="pt-48 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <span className="text-emerald-600 font-black tracking-[0.2em] text-[10px] uppercase block mb-3">Professional Support</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">Featured {data.title} <br />Specialists</h2>
                        </div>
                        <button onClick={() => onNavigate('/patient/yoga/trainers')} className="px-6 py-3 border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-900 hover:text-white transition-all">
                            View Network
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { name: 'Dr. Sarah Jenning', expertise: 'Pediatric Specialist', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800', rating: '4.9', status: 'Available Today' },
                            { name: 'Arun Patel', expertise: 'Geriatric Wellness', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800', rating: '4.8', status: 'Online Now' },
                            { name: 'Lisa Wong', expertise: 'Mindfulness Expert', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=800', rating: '5.0', status: 'Highly Rated' }
                        ].map((trainer, i) => (
                            <div key={i} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col h-full">
                                {/* Image Container */}
                                <div className="relative h-80 overflow-hidden">
                                    <img src={trainer.img} className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-110" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                    {/* Overlays */}
                                    <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                                            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                                            <span className="text-[10px] font-black text-white">{trainer.rating}</span>
                                        </div>
                                        <div className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                                            {trainer.status}
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col min-h-[180px]">
                                    <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight group-hover:text-emerald-600 transition-colors">
                                        {trainer.name}
                                    </h3>
                                    <p className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.15em] mb-6">
                                        {trainer.expertise}
                                    </p>

                                    <div className="mt-auto">
                                        <button className="w-full py-4.5 bg-slate-900 text-white rounded-[1.5rem] font-black hover:bg-emerald-600 transition-all text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95">
                                            Book Consultation
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

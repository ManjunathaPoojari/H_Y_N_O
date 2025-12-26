import React, { useState } from 'react';
import { ArrowLeft, Star, Calendar, Clock, Filter, CheckCircle2, ShieldCheck, Search } from 'lucide-react';

/**
 * HYNO TRAINER DISCOVERY ARCHITECTURE
 * 1. Demographic Filtering (Child, Men, Women, Seniors)
 * 2. Specialty Tags (Yoga, Strength, Rehab, Weight Loss)
 * 3. Verified Certifications
 * 4. Language & Rating Sort
 */

interface Trainer {
    id: string;
    name: string;
    role: string;
    expertise: ('Child' | 'Men' | 'Women' | 'Seniors')[];
    specialties: string[];
    experience: string;
    rating: number;
    reviews: number;
    image: string;
    bio: string;
    certs: string[];
    languages: string[];
}

const TRAINERS: Trainer[] = [
    {
        id: '1',
        name: 'Dr. Sarah Jenning',
        role: 'Pediatric Yoga Therapist',
        expertise: ['Child'],
        specialties: ['Yoga', 'Rehab', 'Postural Correction'],
        experience: '8 years',
        rating: 4.9,
        reviews: 124,
        image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1000&auto=format&fit=crop',
        bio: 'Sarah specializes in childhood developmental yoga and focusing exercises for ADHD and posture.',
        certs: ['Certified Pediatric Yoga', 'RYT-500'],
        languages: ['English', 'Spanish']
    },
    {
        id: '2',
        name: 'Michael Chen',
        role: 'Performance Coach',
        expertise: ['Men', 'Women'],
        specialties: ['Strength', 'Power Yoga', 'Weight Loss'],
        experience: '6 years',
        rating: 4.8,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1000&auto=format&fit=crop',
        bio: 'Michael combines traditional Vinyasa with modern strength training to optimize athletic performance.',
        certs: ['ACE Certified Personal Trainer', 'Vinyasa Pro'],
        languages: ['English', 'Mandarin']
    },
    {
        id: '3',
        name: 'Emma Wilson',
        role: 'Mindfulness & Recovery Lead',
        expertise: ['Women', 'Seniors'],
        specialties: ['Meditation', 'Rehab', 'Stess Management'],
        experience: '10 years',
        rating: 5.0,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop',
        bio: 'Emma focuses on the mental-physical connection, leading restorative sessions for hormonal balance.',
        certs: ['MBSR Practitioner', 'Yoga for Seniors Certified'],
        languages: ['English', 'French']
    },
    {
        id: '4',
        name: 'Arun Patel',
        role: 'Geriatric Wellness Coach',
        expertise: ['Seniors'],
        specialties: ['Physio-Yoga', 'Rehab', 'Joint Mobility'],
        experience: '15 years',
        rating: 4.9,
        reviews: 340,
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop',
        bio: 'Arun uses clinical yoga therapy to help seniors with arthritis, heart health, and balance.',
        certs: ['Doctorate in Physiotherapy', 'Advanced Yoga Therapy'],
        languages: ['English', 'Hindi', 'Gujarati']
    }
];

export const YogaTrainers: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    const [selectedExpertise, setSelectedExpertise] = useState<string>('All');
    const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTrainers = TRAINERS.filter(trainer => {
        const matchesExpertise = selectedExpertise === 'All' || trainer.expertise.includes(selectedExpertise as any);
        const matchesSpecialty = selectedSpecialty === 'All' || trainer.specialties.includes(selectedSpecialty);
        const matchesSearch = trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            trainer.role.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesExpertise && matchesSpecialty && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Section */}
                <div className="pt-10 mb-12">
                    <button
                        onClick={() => onNavigate('/patient/yoga')}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors text-sm font-bold"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        BACK TO HUB
                    </button>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <span className="text-emerald-600 font-bold tracking-[0.2em] text-xs uppercase block mb-3">Verified Mentorship</span>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none">Find Your <span className="text-emerald-500">Expert</span>.</h1>
                            <p className="text-slate-500 mt-4 text-lg font-medium max-w-xl">
                                We never auto-assign. Choose from our elite network of certified specialists based on your unique bio-needs.
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name or specialty..."
                                className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-900"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-wrap items-center gap-4 mb-12">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg">
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                    </div>

                    {/* Expertise Pills */}
                    <div className="flex flex-wrap gap-2">
                        {['All', 'Child', 'Men', 'Women', 'Seniors'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => setSelectedExpertise(opt)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${selectedExpertise === opt ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}
                            >
                                {opt === 'All' ? 'Lifecycle: All' : opt}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-6 bg-slate-200 mx-2 hidden md:block" />

                    {/* Specialty Pills */}
                    <div className="flex flex-wrap gap-2">
                        {['All', 'Yoga', 'Strength', 'Meditation', 'Rehab'].map(opt => (
                            <button
                                key={opt}
                                onClick={() => setSelectedSpecialty(opt)}
                                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${selectedSpecialty === opt ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'}`}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Trainers Grid */}
                {filteredTrainers.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold text-xl">No experts found for these filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTrainers.map((trainer) => (
                            <div key={trainer.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-700">
                                {/* Profile Head */}
                                <div className="relative h-[400px] overflow-hidden">
                                    <img
                                        src={trainer.image}
                                        alt={trainer.name}
                                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                                    {/* Quick Stats Overlay */}
                                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                                        <div className="bg-white/20 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2 text-white">
                                            <Star className="w-4 h-4 text-emerald-400 fill-current" />
                                            <span className="text-sm font-black">{trainer.rating} <span className="text-[10px] opacity-60">({trainer.reviews})</span></span>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2 text-white">
                                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                            <span className="text-xs font-bold uppercase tracking-wider">{trainer.experience} Exp</span>
                                        </div>
                                    </div>

                                    {/* Bottom Overlay Content */}
                                    <div className="absolute bottom-8 left-8 right-8 text-white">
                                        <h3 className="text-3xl font-black mb-1">{trainer.name}</h3>
                                        <p className="text-emerald-400 font-bold uppercase tracking-[0.1em] text-xs mb-4">{trainer.role}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {trainer.certs.slice(0, 2).map((cert, i) => (
                                                <span key={i} className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-bold uppercase border border-white/10">
                                                    {cert}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Body Content */}
                                <div className="p-10">
                                    <p className="text-slate-600 font-medium leading-relaxed mb-8 line-clamp-3">
                                        "{trainer.bio}"
                                    </p>

                                    <div className="space-y-6 mb-10">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-slate-50 rounded-xl text-slate-500">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Expertise Categories</p>
                                                <p className="text-sm font-black text-slate-900">{trainer.expertise.join(', ')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-slate-50 rounded-xl text-slate-500">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Languages</p>
                                                <p className="text-sm font-black text-slate-900">{trainer.languages.join(', ')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onNavigate(`/patient/yoga/book/${trainer.id}`)}
                                        className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold text-base hover:bg-emerald-600 transition-all duration-300 shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group/btn active:scale-95"
                                    >
                                        <Calendar className="w-5 h-5" />
                                        Secure Booking
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

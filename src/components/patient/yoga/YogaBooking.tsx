import React, { useState } from 'react';
import { ArrowLeft, User, Calendar, Clock, CheckCircle } from 'lucide-react';

interface YogaBookingProps {
    trainerId: string;
    onNavigate: (path: string) => void;
}

export const YogaBooking: React.FC<YogaBookingProps> = ({ trainerId, onNavigate }) => {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    // Mock trainer lookup
    const TRAINERS: Record<string, any> = {
        '1': { name: 'Sarah Jenning', specialty: 'Hatha Yoga', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=200' },
        '2': { name: 'Michael Chen', specialty: 'Vinyasa Flow', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=200' },
        '3': { name: 'Emma Wilson', specialty: 'Meditation', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=200' },
        '4': { name: 'Raj Patel', specialty: 'Yoga Therapy', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=200' },
        't1': { name: 'Dr. Sarah Jenning', specialty: 'Pediatric Yoga', image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=200' },
        't2': { name: 'Markus Steele', specialty: 'Strength Coach', image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200' },
        't3': { name: 'Elena Gilbert', specialty: 'Women\'s Health', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200' },
        't4': { name: 'Arun Patel', specialty: 'Geriatric Wellness', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200' },
        't5': { name: 'Lisa Wong', specialty: 'Mindfulness', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200' },
    };

    const trainer = TRAINERS[trainerId] || {
        id: trainerId,
        name: 'Yoga Expert',
        specialty: 'Specialist',
        image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1000'
    };

    const handleBooking = () => {
        // Create new session object
        const newSession = {
            id: Date.now(),
            title: `Private Session with ${trainer.name}`,
            instructor: trainer.name,
            time: selectedTime,
            date: selectedDate, // In a real app, format this nicely
            duration: '60 min',
            type: 'Virtual',
            status: 'upcoming'
        };

        // Save to LocalStorage
        try {
            const existing = JSON.parse(localStorage.getItem('yogaSessions') || '[]');
            const updated = [...existing, newSession];
            localStorage.setItem('yogaSessions', JSON.stringify(updated));
        } catch (e) {
            console.error("Failed to save booking locally", e);
        }

        // Show success UI
        setStep(3);
        setTimeout(() => {
            onNavigate('/patient/yoga/schedule');
        }, 2000);
    };

    if (step === 3) {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
                    <p className="text-slate-600 mb-6">Your session with {trainer.name} has been scheduled.</p>
                    <p className="text-sm text-slate-500">Redirecting to schedule...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => onNavigate('/patient/yoga/trainers')}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Trainers
                </button>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h1 className="text-2xl font-bold text-slate-900">Book Private Session</h1>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex items-center gap-4 mb-8 bg-green-50 p-4 rounded-lg">
                            <img
                                src={trainer.image}
                                alt={trainer.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                            <div>
                                <h3 className="font-bold text-slate-900">{trainer.name}</h3>
                                <p className="text-slate-600 text-sm">{trainer.specialty}</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Select Date</label>
                                <input
                                    type="date"
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Select Time</label>
                                <select
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                >
                                    <option value="">Choose a slot...</option>
                                    <option value="09:00">09:00 AM</option>
                                    <option value="10:30">10:30 AM</option>
                                    <option value="14:00">02:00 PM</option>
                                    <option value="16:30">04:30 PM</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <button
                                    disabled={!selectedDate || !selectedTime}
                                    onClick={handleBooking}
                                    className="w-full py-4 bg-green-600 text-white rounded-lg font-bold shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

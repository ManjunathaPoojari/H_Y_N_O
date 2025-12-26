import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Video, User } from 'lucide-react';

interface YogaScheduleProps {
    onNavigate: (path: string) => void;
}

export const YogaSchedule: React.FC<YogaScheduleProps> = ({ onNavigate }) => {
    const [sessions, setSessions] = useState<any[]>([
        {
            id: 1,
            title: 'Morning Flow',
            instructor: 'Sarah Jenning',
            time: '08:00 AM',
            date: 'Today',
            duration: '45 min',
            type: 'Virtual',
            status: 'upcoming'
        },
        {
            id: 2,
            title: 'Power Yoga',
            instructor: 'Michael Chen',
            time: '05:00 PM',
            date: 'Tomorrow',
            duration: '60 min',
            type: 'Studio',
            status: 'upcoming'
        }
    ]);

    useEffect(() => {
        try {
            const localSessions = JSON.parse(localStorage.getItem('yogaSessions') || '[]');
            if (localSessions.length > 0) {
                setSessions(prev => {
                    const existingIds = new Set(prev.map(p => p.id));
                    const newItems = localSessions.filter((s: any) => !existingIds.has(s.id));
                    return [...prev, ...newItems];
                });
            }
        } catch (e) {
            console.error('Error loading sessions', e);
        }
    }, []);

    const [activeTab, setActiveTab] = useState<'schedule' | 'completed' | 'payments'>('schedule');

    useEffect(() => {
        setSessions(prev => {
            const hasPast = prev.some(s => s.status === 'completed');
            if (hasPast) return prev;
            return [...prev, {
                id: 'past-session',
                title: 'Vinyasa Foundation',
                instructor: 'Emma Wilson',
                time: '07:00 AM',
                date: 'Dec 24, 2025',
                duration: '45 min',
                type: 'Virtual',
                status: 'completed'
            }];
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => onNavigate('/patient/yoga')}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Yoga
                </button>

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your Yoga Activity</h1>
                        <p className="text-slate-600">Review your past sessions and upcoming classes</p>
                    </div>
                </div>

                <div className="flex gap-6 mb-8 border-b border-gray-200">
                    {[
                        { id: 'schedule', label: 'Upcoming' },
                        { id: 'completed', label: 'Completed' },
                        { id: 'payments', label: 'Payments' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`pb-4 px-2 font-semibold text-sm transition-all relative ${activeTab === tab.id ? 'text-emerald-700 border-b-2 border-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'payments' ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500">Session Details</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {sessions.map(session => (
                                    <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{session.title}</p>
                                            <p className="text-xs text-slate-500">{session.instructor}</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-medium">{session.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="inline-flex w-fit px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase">Paid</span>
                                                {session.status === 'completed' && (
                                                    <span className="text-[9px] text-slate-400 font-bold italic">Session Finished</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-900">₹500.00</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sessions.filter(s => s.status === (activeTab === 'schedule' ? 'upcoming' : 'completed')).length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                                <p className="text-slate-400 font-medium">No {activeTab} sessions yet</p>
                            </div>
                        ) : (
                            sessions.filter(s => s.status === (activeTab === 'schedule' ? 'upcoming' : 'completed')).map(session => (
                                <div key={session.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-xl flex flex-col items-center min-w-[70px] ${session.status === 'completed' ? 'bg-slate-50 text-slate-400' : 'bg-emerald-50 text-emerald-600'}`}>
                                            <span className="text-[10px] font-bold uppercase tracking-tight">{session.date}</span>
                                            <span className="text-lg font-black">{session.time.split(' ')[0]}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-1 leading-none">{session.title}</h3>
                                            <div className="flex gap-4 text-xs font-semibold text-slate-400">
                                                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{session.instructor}</span>
                                                <span className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5" />{session.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {activeTab === 'schedule' ? (
                                        <button className="px-8 py-2.5 bg-emerald-600 text-white rounded-full font-bold text-sm shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95">
                                            Join Now
                                        </button>
                                    ) : (
                                        <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-full font-bold text-[10px] uppercase hover:bg-slate-200 transition-all">
                                            View Report
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

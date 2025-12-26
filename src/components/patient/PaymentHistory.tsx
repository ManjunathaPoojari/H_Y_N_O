import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Calendar, CreditCard, Download, Activity, Pill, User } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';

interface Transaction {
    id: string;
    date: string;
    service: string;
    provider: string;
    type: string;
    amount: number;
    status: string;
    icon: React.ReactNode;
}

export const PaymentHistory = () => {
    const { appointments } = useAppStore();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const allTransactions: Transaction[] = [];

        // 1. Convert Medical Appointments to Transactions
        appointments.forEach(appt => {
            if (appt.status !== 'cancelled') {
                allTransactions.push({
                    id: `apt-${appt.id}`,
                    date: appt.date,
                    service: 'Medical Consultation',
                    provider: appt.doctorName,
                    type: 'Appointment',
                    amount: 800, // Standard fee
                    status: appt.status === 'completed' ? 'Paid' : 'Pending',
                    icon: <User className="w-4 h-4 text-blue-600" />
                });
            }
        });

        // 2. Convert Yoga Sessions to Transactions
        try {
            const yogaSessions = JSON.parse(localStorage.getItem('yogaSessions') || '[]');
            yogaSessions.forEach((session: any) => {
                allTransactions.push({
                    id: `yoga-${session.id}`,
                    date: session.date || 'Today',
                    service: session.title,
                    provider: session.instructor,
                    type: 'Wellness',
                    amount: 500, // Standard yoga fee
                    status: 'Paid', // Assuming immediate payment for booking
                    icon: <Activity className="w-4 h-4 text-emerald-600" />
                });
            });
        } catch (e) {
            console.error(e);
        }

        // Sort by date (mock sort for now as dates formats vary)
        setTransactions(allTransactions.reverse());
    }, [appointments]);

    const totalSpent = transactions.reduce((acc, curr) => curr.status === 'Paid' ? acc + curr.amount : acc, 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl mb-2">Billing & Payments</h1>
                <p className="text-gray-600">Track your healthcare expenses and transaction history</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
                    <CardContent className="pt-6">
                        <p className="text-slate-400 mb-1 font-medium">Total Spent</p>
                        <h2 className="text-4xl font-bold mb-4">₹{totalSpent}</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-300 bg-white/10 p-2 rounded-lg w-fit">
                            <CreditCard className="w-4 h-4" />
                            <span>{transactions.filter(t => t.status === 'Paid').length} Successful Payments</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <p className="text-slate-500 mb-1 font-medium text-sm">Pending Payments</p>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            ₹{transactions.filter(t => t.status === 'Pending').reduce((a, b) => a + b.amount, 0)}
                        </h2>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                            {transactions.filter(t => t.status === 'Pending').length} Invoices Due
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <p className="text-slate-500 mb-1 font-medium text-sm">Last Transaction</p>
                        <div className="flex items-center gap-3 mt-2">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900">₹{transactions[0]?.amount || 0}</p>
                                <p className="text-xs text-slate-500">{transactions[0]?.date || 'N/A'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {transactions.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No transactions found.</p>
                        ) : (
                            transactions.map((t) => (
                                <div key={t.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                                            {t.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{t.service}</h4>
                                            <p className="text-sm text-gray-500">{t.provider} • {t.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">₹{t.amount}</p>
                                        <div className="flex items-center gap-2 justify-end mt-1">
                                            <Badge variant={t.status === 'Paid' ? 'default' : 'secondary'}
                                                className={t.status === 'Paid' ? 'bg-emerald-600' : 'bg-amber-500'}>
                                                {t.status}
                                            </Badge>
                                            {t.status === 'Paid' && (
                                                <button className="text-slate-400 hover:text-slate-600" title="Download Invoice">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

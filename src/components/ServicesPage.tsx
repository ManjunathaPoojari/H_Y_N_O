import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Video, Pill, Dumbbell, Apple, Activity, HeartPulse, Stethoscope, Truck } from 'lucide-react';

interface ServicesPageProps {
    onNavigate: (path: string) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
    const services = [
        {
            icon: Video,
            title: 'Video Consultations',
            description: 'Connect with top specialists from the comfort of your home. High-quality secure video calls with digital prescriptions.',
            features: ['24/7 Availability', 'Secure & Private', 'Digital Prescription']
        },
        {
            icon: Pill,
            title: 'Online Pharmacy',
            description: 'Order medicines online and get them delivered to your doorstep. Upload prescriptions and track your orders.',
            features: ['Fast Delivery', 'Genuine Medicines', 'Subscription Refills']
        },
        {
            icon: Apple,
            title: 'Clinical Nutrition',
            description: 'Get personalized diet plans from certified nutritionists. Manage chronic conditions with food.',
            features: ['Custom Meal Plans', 'Dietary Tracking', 'Expert Chat']
        },
        {
            icon: Dumbbell,
            title: 'Wellness & Yoga',
            description: 'Join live yoga sessions and get fitness training from certified coaches. Track your physical health.',
            features: ['Live Classes', 'Fitness Assessments', 'Progress Tracking']
        },
        {
            icon: Stethoscope,
            title: 'Diagnostic Tests',
            description: 'Book lab tests including blood work, MRI, and X-rays at home or partner centers.',
            features: ['Home Sample Collection', 'Online Reports', 'Certified Labs']
        },
        {
            icon: Truck,
            title: 'Emergency Services',
            description: 'Quick ambulance booking and emergency assistance. One-tap SOS for critical situations.',
            features: ['GPS Tracking', '24/7 Response', 'Critical Care Support']
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {/* Nav */}
            <nav className="border-b bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
                            <div className="h-8 w-8 bg-emerald-600 rounded-md flex items-center justify-center" style={{ backgroundColor: '#059669' }}>
                                <Activity className="h-5 w-5 text-white" style={{ color: '#ffffff' }} />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">HYNO</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button onClick={() => onNavigate('/')} variant="ghost">Back to Home</Button>
                            <Button onClick={() => onNavigate('/login')} className="bg-emerald-600 text-white hover:bg-emerald-700">Sign In</Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <div className="bg-emerald-900 text-white py-20 relative overflow-hidden" style={{ backgroundColor: '#064e3b', color: '#ffffff' }}>
                <div className="absolute inset-0 bg-emerald-600 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]" style={{ backgroundColor: '#059669' }}></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Medical Services</h1>
                    <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                        Comprehensive healthcare solutions designed around your needs. From consultations to medication, we have you covered.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, idx) => (
                        <Card key={idx} className="hover:shadow-lg transition-shadow border-slate-200">
                            <CardHeader>
                                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                                    <service.icon className="h-6 w-6 text-emerald-600" />
                                </div>
                                <CardTitle className="text-xl">{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-600 mb-6">{service.description}</p>
                                <ul className="space-y-2">
                                    {service.features.map((feature, i) => (
                                        <li key={i} className="flex items-center text-sm text-slate-500">
                                            <HeartPulse className="h-4 w-4 text-emerald-500 mr-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full mt-6" variant="outline" onClick={() => onNavigate('/login')}>
                                    Book Now
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="bg-slate-900 text-white py-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to prioritize your health?</h2>
                    <Button onClick={() => onNavigate('/register')} size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                        Get Started via One ID
                    </Button>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import {
    Activity, Apple, Dumbbell, Pill, ArrowRight,
    CheckCircle, Star, Video, Phone, Mail, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../lib/api-client';

interface LandingPageProps {
    onNavigate: (path: string) => void;
}

// Smooth counter hook
function useCountTo(target: number, duration = 1200, start = 0, trigger = true) {
    const [value, setValue] = useState(start);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (!trigger) return () => { };
        const startTime = performance.now();
        const diff = target - start;

        function step(now: number) {
            const t = Math.min(1, (now - startTime) / duration);
            const eased = 1 - Math.pow(1 - t, 3); // easing out cubic
            setValue(Math.round(start + diff * eased));
            if (t < 1 && rafRef.current !== null) {
                rafRef.current = requestAnimationFrame(step);
            }
        }

        rafRef.current = requestAnimationFrame(step);
        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [target, duration, start, trigger]);

    return value;
}

// Doctor Card with 3D Flip
const DoctorCard = ({ doctor, onBook }: { doctor: any; onBook: () => void }) => {
    const [flipped, setFlipped] = useState(false);

    return (
        <div className="perspective-1000 h-80 w-full group">
            <motion.div
                className="relative w-full h-full transition-all duration-500"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* Front */}
                <div
                    className="absolute inset-0 rounded-xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="flex items-center gap-4 mb-6">
                        {doctor.avatarUrl ? (
                            <img src={doctor.avatarUrl} alt={doctor.name} className="w-14 h-14 rounded-full object-cover" />
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xl font-medium">
                                {doctor.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h4 className="text-lg font-semibold text-slate-900 line-clamp-1">{doctor.name}</h4>
                            <div className="text-sm text-slate-500 line-clamp-1">{doctor.specialization || doctor.specialty}</div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-center text-sm text-slate-600">
                            <div className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium mr-2">
                                {doctor.experience || '10+'} years
                            </div>
                            <span>Experience</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600">
                            <Star className="h-4 w-4 mr-2 text-yellow-500 fill-yellow-500" />
                            <span>{doctor.rating || '4.9'} Patient Rating</span>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-auto">
                        <Button onClick={onBook} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-none">
                            Book
                        </Button>
                        <Button onClick={() => setFlipped(true)} variant="outline" className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50">
                            Details
                        </Button>
                    </div>
                </div>

                {/* Back */}
                <div
                    className="absolute inset-0 rounded-xl bg-slate-50 p-6 shadow-md border border-slate-200 flex flex-col"
                    style={{
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                    }}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h4 className="text-lg font-semibold text-slate-900 line-clamp-1">{doctor.name}</h4>
                            <div className="text-sm text-slate-500 line-clamp-1">{doctor.specialization || doctor.specialty}</div>
                        </div>
                        <Button onClick={() => setFlipped(false)} variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-slate-200">
                            ✕
                        </Button>
                    </div>

                    <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">
                        {doctor.bio || "Specializes in patient-centered care, clinical diagnosis, and comprehensive treatment plans."}
                    </p>

                    <div className="bg-white rounded-lg p-3 text-sm text-slate-600 space-y-2 mb-4 border border-slate-100 flex-1">
                        <div className="flex justify-between">
                            <span>Availability</span>
                            <span className="font-medium text-slate-900">{doctor.available ? 'Available' : 'By Appointment'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Consultation</span>
                            <span className="font-medium text-slate-900">₹{doctor.consultationFee || 500}</span>
                        </div>
                    </div>

                    <Button onClick={onBook} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Confirm Booking
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

// Scroll to Top Button
const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-slate-900 text-white shadow-lg hover:bg-slate-800 transition-all transform hover:-translate-y-1"
            aria-label="Scroll to top"
        >
            <ChevronUp className="h-5 w-5" />
        </button>
    );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
    const [newsletter, setNewsletter] = useState('');

    // State
    const [doctors, setDoctors] = useState<any[]>([]);
    const [stats, setStats] = useState([
        { value: 0, label: 'Happy Patients', suffix: '+' },
        { value: 0, label: 'Expert Doctors', suffix: '+' },
        { value: 0, label: 'Partner Hospitals', suffix: '+' },
        { value: 98, label: 'Success Rate', suffix: '%' },
    ]);

    // Data Fetching
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Doctors
                // We'll wrap this in a try/catch specifically so one failure doesn't stop the other
                try {
                    const doctorsData = await api.doctors.getAll();
                    if (doctorsData && Array.isArray(doctorsData) && doctorsData.length > 0) {
                        // Map API data to our UI format if necessary, keeping first 6
                        const mappedDoctors = doctorsData.slice(0, 6).map((doc: any) => ({
                            name: doc.name || 'Dr. Unknown',
                            specialty: doc.specialization || 'General',
                            experience: doc.experience || '5',
                            rating: doc.rating || 4.5,
                            consultationFee: doc.consultationFee,
                            available: doc.available,
                            avatarUrl: doc.avatarUrl
                        }));
                        setDoctors(mappedDoctors);

                        // Update doctor count stat based on real data
                        setStats(prev => prev.map(s =>
                            s.label === 'Expert Doctors'
                                ? { ...s, value: doctorsData.length }
                                : s
                        ));
                    }
                } catch (err) {
                    console.log('Using default doctors list (Backend unreachable or empty)');
                }

                // 2. Fetch Stats (Optional - if admin endpoint exists and is public)
                // If it requires auth, it will likely fail here, which is fine, we use defaults.
                try {
                    const statsData = await api.admin.getStats();
                    if (statsData) {
                        setStats([
                            { value: statsData.totalPatients || 0, label: 'Happy Patients', suffix: '+' },
                            { value: statsData.totalDoctors || 0, label: 'Expert Doctors', suffix: '+' },
                            { value: statsData.totalHospitals || 0, label: 'Partner Hospitals', suffix: '+' },
                            { value: 99, label: 'Success Rate', suffix: '%' },
                        ]);
                    }
                } catch (err) {
                    // Fail silently for stats
                }

            } catch (error) {
                console.error('Landing page data fetch error:', error);
            }
        };

        fetchData();
    }, []);


    // Contact form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        preferredDoctor: '',
        appointmentDate: '',
    });

    // Intersection observer for stats
    const statsRef = useRef(null);
    const statsInView = useInView(statsRef, { once: true, amount: 0.4 });

    // Mouse parallax (Subtle)
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            setMouse({
                x: (e.clientX / window.innerWidth - 0.5) * 10,
                y: (e.clientY / window.innerHeight - 0.5) * 10,
            });
        };
        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, []);


    const services = [
        { title: 'Video Consults', icon: Video, desc: 'Connect with doctors instantly via secure high-quality video calls.' },
        { title: 'Wellness Plans', icon: Dumbbell, desc: 'Personalized fitness routines and wellness tracking for a healthier you.' },
        { title: 'Clinical Nutrition', icon: Apple, desc: 'Expert diet plans tailored to your specific health conditions and goals.' },
        { title: 'Online Pharmacy', icon: Pill, desc: 'Prescription medicines delivered to your doorstep within hours.' },
    ];

    const testimonials = [
        { name: 'John Doe', text: 'The booking process was seamless, and the doctor was extremely professional.', rating: 5 },
        { name: 'Jane Smith', text: 'I love having all my health records in one place. Highly recommended!', rating: 5 },
        { name: 'Mike Johnson', text: 'Pharmacy delivery is a game changer. Saved me so much time.', rating: 4 },
    ];

    const submitContact = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            toast.error('Please fill your name and email.');
            return;
        }
        toast.success('Appointment requested — we\'ll contact you soon!');
        setFormData({
            name: '',
            email: '',
            preferredDoctor: '',
            appointmentDate: '',
        });
    };

    const submitNewsletter = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newsletter) return;
        toast.success('Successfully subscribed!');
        setNewsletter('');
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 relative">
            {/* Animated Background */}
            {/* Animated Background - Removed */}

            {/* Navigation */}
            <nav className="border-b bg-white sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-emerald-600 rounded-md flex items-center justify-center" style={{ backgroundColor: '#059669' }}>
                                <Activity className="h-5 w-5 text-white" style={{ color: '#ffffff' }} />
                            </div>
                            <span className="text-xl font-bold text-slate-900 tracking-tight">
                                HYNO
                            </span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <button onClick={() => onNavigate('/about')} className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">About</button>
                            <button onClick={() => onNavigate('/services')} className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Services</button>
                            <button onClick={() => onNavigate('/doctors')} className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Doctors</button>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" onClick={() => onNavigate('/login')} className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50">
                                Sign In
                            </Button>
                            <Button onClick={() => onNavigate('/register')} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm">
                                Get Started
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <header className="relative pt-20 pb-32 overflow-hidden bg-slate-50">
                {/* Animated Background for Hero */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* <LandingBackground /> Removed */}
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium mb-8">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                                Video Consultations Live
                            </div>

                            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
                                Healthcare that <br />
                                <span className="text-emerald-600">Revolves Around You</span>
                            </h1>

                            <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
                                Experience clear, connected care with HYNO. One ID for everything—from instant video consults to medication delivery.
                            </p>

                            <div className="flex flex-wrap gap-4 mb-10">
                                <Button
                                    onClick={() => onNavigate('/register')}
                                    size="lg"
                                    className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 text-base"
                                >
                                    Start Your Journey
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>                                <Button
                                    onClick={() => onNavigate('/login')}
                                    size="lg"
                                    variant="outline"
                                    className="h-12 px-8 border-slate-200 text-slate-700 hover:bg-slate-50 backdrop-blur-sm text-base"
                                >
                                    Portal Login
                                </Button>
                            </div>

                            <div className="flex gap-6 text-sm text-slate-500 font-medium">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    <span>HIPAA Compliant</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    <span>24/7 Support</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Minimal Hero Visual */}
                        <div className="relative hidden lg:block" style={{ transform: `translate(${mouse.x}px, ${mouse.y}px)` }}>
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 bg-white">
                                <img
                                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1964&auto=format&fit=crop"
                                    alt="Doctor using tablet"
                                    className="w-full h-auto object-cover"
                                />
                                <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm p-6 border-t border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <Video className="h-5 w-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">Dr. Sarah is Online</p>
                                            <p className="text-xs text-slate-500">Dermatologist • 5m wait time</p>
                                        </div>
                                        <Button size="sm" className="ml-auto bg-slate-900 text-white hover:bg-slate-800">
                                            Join
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* SERVICES */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Complete Healthcare Ecosystem</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Connect seamlessly with doctors, hospitals, and wellness experts through our integrated platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {services.map((service, i) => (
                            <Card key={i} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 bg-white">
                                <CardContent className="pt-8 p-6">
                                    <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-6">
                                        <service.icon className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-3">{service.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {service.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section >

            {/* STATS */}
            < section ref={statsRef} className="py-20 bg-slate-900 text-white" >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center text-white">
                        {stats.map((stat, i) => (
                            <div key={i}>
                                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tight">
                                    {useCountTo(stat.value, 1500, 0, statsInView)}{stat.suffix}
                                </div>
                                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DOCTORS - Only show if we have doctors */}
            {doctors.length > 0 && (
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Specialists</h2>
                                <p className="text-slate-600">Top rated doctors available for online and in-person consultation.</p>
                            </div>
                            <Button variant="outline" className="hidden md:flex" onClick={() => onNavigate('/doctors')}>
                                View All Doctors
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {doctors.map((doc, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <DoctorCard doctor={doc} onBook={() => onNavigate('/login')} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* TESTIMONIALS & FORM */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
                    {/* Testimonials */}
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-8">What our patients say</h3>
                        <div className="space-y-6">
                            {testimonials.map((t, idx) => (
                                <Card key={idx} className="border border-slate-100 shadow-sm bg-white">
                                    <CardContent className="pt-6 p-6">
                                        <div className="flex items-center mb-4">
                                            {[...Array(t.rating)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                                            ))}
                                        </div>
                                        <p className="text-slate-700 mb-4 italic">"{t.text}"</p>
                                        <div className="font-semibold text-slate-900 text-sm">— {t.name}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-8">Quick Appointment Request</h3>
                        <Card className="border-none shadow-lg bg-white">
                            <CardContent className="p-8">
                                <form onSubmit={submitContact} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Name</label>
                                            <input
                                                required
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Email</label>
                                            <input
                                                type="email"
                                                required
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Date</label>
                                            <input
                                                type="date"
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-600"
                                                value={formData.appointmentDate}
                                                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-slate-500 uppercase">Doctor</label>
                                            <select
                                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-slate-600"
                                                value={formData.preferredDoctor}
                                                onChange={(e) => setFormData({ ...formData, preferredDoctor: e.target.value })}
                                            >
                                                <option value="">Any Specialist</option>
                                                {doctors.map((d, i) => <option key={i} value={d.name}>{d.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg"
                                    >
                                        Request Appointment
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section >

            {/* FOOTER */}
            < footer className="bg-slate-900 text-slate-300 py-16" >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-8 w-8 bg-emerald-600 rounded-md flex items-center justify-center" style={{ backgroundColor: '#059669' }}>
                                    <Activity className="h-5 w-5 text-white" style={{ color: '#ffffff' }} />
                                </div>
                                <span className="text-2xl font-bold text-white tracking-tight">HYNO</span>
                            </div>
                            <p className="text-slate-400 max-w-sm leading-relaxed mb-6">
                                A comprehensive healthcare management system designed to simplify the connection between patients, doctors, and hospitals.
                            </p>
                            <div className="flex gap-4">
                                {/* Social placeholders */}
                                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition-colors">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-emerald-600 transition-colors">
                                    <Mail className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
                            <ul className="space-y-3">
                                <li><button onClick={() => onNavigate('/about')} className="hover:text-blue-400 transition-colors">About Us</button></li>
                                <li><button onClick={() => onNavigate('/services')} className="hover:text-blue-400 transition-colors">Our Services</button></li>
                                <li><button onClick={() => onNavigate('/doctors')} className="hover:text-blue-400 transition-colors">Find a Doctor</button></li>
                                <li><button onClick={() => onNavigate('/contact')} className="hover:text-blue-400 transition-colors">Contact Support</button></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-semibold mb-6">Stay Updated</h4>
                            <form onSubmit={submitNewsletter} className="flex flex-col gap-3">
                                <input
                                    className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:border-blue-500 outline-none"
                                    placeholder="Enter your email"
                                    value={newsletter}
                                    onChange={(e) => setNewsletter(e.target.value)}
                                />
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white">Subscribe</Button>
                            </form>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                        <p>© {new Date().getFullYear()} HYNO Health. All rights reserved.</p>
                        <div className="flex gap-6">
                            <button className="hover:text-white transition-colors">Privacy Policy</button>
                            <button className="hover:text-white transition-colors">Terms of Service</button>
                        </div>
                    </div>
                </div>
            </footer >

            <ScrollToTop />
            <style>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div >
    );
};
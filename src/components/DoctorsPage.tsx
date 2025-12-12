import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Activity, Search, Star, Filter, MapPin } from 'lucide-react';
import { api } from '../lib/api-client';

interface DoctorsPageProps {
    onNavigate: (path: string) => void;
}

export function DoctorsPage({ onNavigate }: DoctorsPageProps) {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('');

    // Fetch doctors
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                // Try fetching real data
                const data = await api.doctors.getAll();
                if (data && Array.isArray(data)) {
                    const mapped = data.map((d: any) => ({
                        id: d.id,
                        name: d.name,
                        specialty: d.specialization || d.specialty || 'General Physician',
                        experience: d.experience || 5,
                        rating: d.rating || 4.5,
                        location: d.hospital?.name || d.location || 'Online',
                        fee: d.consultationFee,
                        image: d.avatarUrl
                    }));
                    setDoctors(mapped);
                    setFilteredDoctors(mapped);
                } else {
                    throw new Error('No data');
                }
            } catch (err) {
                // Fallback data
                const mockDoctors = [
                    { id: 1, name: 'Dr. Akshay Hiremath', specialty: 'General Physician', experience: 8, rating: 4.8, location: 'City Hospital', fee: 500 },
                    { id: 2, name: 'Dr. Sanjana Reddy', specialty: 'Gynecologist', experience: 12, rating: 4.9, location: 'Woman Care Clinic', fee: 800 },
                    { id: 3, name: 'Dr. Madhu M', specialty: 'Dermatologist', experience: 10, rating: 4.7, location: 'Skin Health Center', fee: 700 },
                    { id: 4, name: 'Dr. Abhishek Patil', specialty: 'Pediatrician', experience: 15, rating: 5.0, location: 'Child Care Hospital', fee: 600 },
                    { id: 5, name: 'Dr. Rakshatha S', specialty: 'Neurologist', experience: 20, rating: 4.9, location: 'Brain Institute', fee: 1200 },
                    { id: 6, name: 'Dr. Priya Sharma', specialty: 'Psychiatrist', experience: 9, rating: 4.8, location: 'Mind Wellness', fee: 1000 },
                    { id: 7, name: 'Dr. Rahul Verma', specialty: 'Cardiologist', experience: 18, rating: 4.9, location: 'Heart Center', fee: 1500 },
                    { id: 8, name: 'Dr. Anita Desai', specialty: 'Dentist', experience: 6, rating: 4.6, location: 'Smile Clinic', fee: 400 },
                ];
                setDoctors(mockDoctors);
                setFilteredDoctors(mockDoctors);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    // Filter logic
    useEffect(() => {
        let result = doctors;
        if (searchTerm) {
            result = result.filter(d =>
                d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (specialtyFilter) {
            result = result.filter(d => d.specialty === specialtyFilter);
        }
        setFilteredDoctors(result);
    }, [searchTerm, specialtyFilter, doctors]);

    const specialties = Array.from(new Set(doctors.map(d => d.specialty)));

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
                        </div>
                    </div>
                </div>
            </nav>

            {/* Search Header */}
            <div className="bg-white border-b border-slate-200 py-8">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-3xl font-bold mb-6">Find Your Doctor</h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                            <Input
                                placeholder="Search by name or specialty..."
                                className="pl-10 h-12 text-lg"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="h-12 px-4 rounded-md border border-slate-200 bg-white min-w-[200px]"
                            value={specialtyFilter}
                            onChange={(e) => setSpecialtyFilter(e.target.value)}
                        >
                            <option value="">All Specialties</option>
                            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="text-center py-20">Loading doctors...</div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map((doc) => (
                            <Card key={doc.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-500">
                                            {doc.image ? <img src={doc.image} alt={doc.name} className="w-full h-full rounded-full object-cover" /> : doc.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900">{doc.name}</h3>
                                            <p className="text-emerald-600 font-medium text-sm">{doc.specialty}</p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                <span className="flex items-center"><Star className="h-3 w-3 text-yellow-500 mr-1" /> {doc.rating}</span>
                                                <span>{doc.experience} years exp</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                                        <div className="flex items-center text-sm text-slate-600">
                                            <MapPin className="h-4 w-4 mr-2 text-slate-400" />
                                            {doc.location}
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="font-bold text-slate-900">₹{doc.fee || 500}<span className="text-xs font-normal text-slate-500">/visit</span></span>
                                            <Button size="sm" onClick={() => onNavigate('/login')}>Book Appointment</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && filteredDoctors.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        No doctors found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}

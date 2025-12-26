import React, { useState } from 'react';
import { useAppStore } from '../../lib/app-store';
import { useAuth } from '../../lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
    Calendar, MapPin, Users, Building2, Search,
    Droplets, Heart, Syringe, Megaphone, Stethoscope, Info
} from 'lucide-react';
import { format } from 'date-fns';
import { MedicalEvent, MedicalEventType } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { toast } from 'sonner';

export const EventsList: React.FC = () => {
    const { medicalEvents, registerForEvent, unregisterFromEvent, addMedicalEvent, deleteMedicalEvent } = useAppStore();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        type: 'HEALTH_CAMP' as MedicalEventType,
        startDateTime: '',
        endDateTime: '',
        location: '',
        capacity: 100
    });

    const getEventIcon = (type: MedicalEventType) => {
        switch (type) {
            case 'BLOOD_DONATION': return <Droplets className="h-5 w-5 text-red-500" />;
            case 'HEALTH_CAMP': return <Heart className="h-5 w-5 text-pink-500" />;
            case 'VACCINATION': return <Syringe className="h-5 w-5 text-blue-500" />;
            case 'AWARENESS_SEMINAR': return <Megaphone className="h-5 w-5 text-orange-500" />;
            case 'EQUIPMENT_DONATION': return <Stethoscope className="h-5 w-5 text-purple-500" />;
            default: return <Info className="h-5 w-5 text-gray-500" />;
        }
    };

    const filteredEvents = medicalEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.hospital.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || event.type === filterType;
        return matchesSearch && matchesType;
    });

    const isRegistered = (event: any) => {
        return event.registeredPatients?.some((p: any) => p.id === user?.id);
    };

    const handleRegister = async (eventId: string) => {
        if (!user) return;
        await registerForEvent(eventId, user.id);
    };

    const handleUnregister = async (eventId: string) => {
        if (!user) return;
        await unregisterFromEvent(eventId, user.id);
    };

    const handleCreateEvent = async () => {
        if (!user || user.role !== 'hospital') return;
        try {
            await addMedicalEvent({
                ...newEvent,
                hospitalId: user.id
            } as any);
            setIsCreateModalOpen(false);
            setNewEvent({
                title: '',
                description: '',
                type: 'HEALTH_CAMP',
                startDateTime: '',
                endDateTime: '',
                location: '',
                capacity: 100
            });
        } catch (error) {
            // Error handled in store
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600">
                        Health Events
                    </h1>
                    <p className="text-gray-600">Join community health programs and make a difference.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    {user?.role === 'hospital' && (
                        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-emerald-600 hover:bg-emerald-700">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Create Event
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                    <DialogTitle>Create community health event</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">Event Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g., Blood Donation Drive"
                                            value={newEvent.title}
                                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="type">Event Type</Label>
                                            <select
                                                id="type"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                value={newEvent.type}
                                                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as MedicalEventType })}
                                            >
                                                <option value="BLOOD_DONATION">Blood Donation</option>
                                                <option value="HEALTH_CAMP">Health Camp</option>
                                                <option value="VACCINATION">Vaccination</option>
                                                <option value="AWARENESS_SEMINAR">Awareness Seminar</option>
                                                <option value="EQUIPMENT_DONATION">Equipment Donation</option>
                                            </select>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="capacity">Capacity</Label>
                                            <Input
                                                id="capacity"
                                                type="number"
                                                value={newEvent.capacity}
                                                onChange={(e) => setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="start">Start Date & Time</Label>
                                            <Input
                                                id="start"
                                                type="datetime-local"
                                                value={newEvent.startDateTime}
                                                onChange={(e) => setNewEvent({ ...newEvent, startDateTime: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="end">End Date & Time</Label>
                                            <Input
                                                id="end"
                                                type="datetime-local"
                                                value={newEvent.endDateTime}
                                                onChange={(e) => setNewEvent({ ...newEvent, endDateTime: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            placeholder="Full address or room number"
                                            value={newEvent.location}
                                            onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="desc">Description</Label>
                                        <textarea
                                            id="desc"
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            placeholder="What is this event about?"
                                            value={newEvent.description}
                                            onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                                    <Button onClick={handleCreateEvent}>Save Event</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search events..."
                            className="pl-9 w-full sm:w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        <option value="BLOOD_DONATION">Blood Donation</option>
                        <option value="HEALTH_CAMP">Health Camp</option>
                        <option value="VACCINATION">Vaccination</option>
                        <option value="AWARENESS_SEMINAR">Awareness Seminar</option>
                        <option value="EQUIPMENT_DONATION">Equipment Donation</option>
                    </select>
                </div>
            </div>

            {filteredEvents.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                    <div className="flex flex-col items-center">
                        <Building2 className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No events found</h3>
                        <p className="text-gray-500">Check back later for new community health programs.</p>
                    </div>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200 flex flex-col relative">
                            {user?.role === 'hospital' && event.hospital?.id === user.id && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
                                    onClick={() => deleteMedicalEvent(event.id)}
                                >
                                    <Users className="h-4 w-4" />
                                </Button>
                            )}
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <Badge variant="outline" className="flex gap-2 items-center px-2 py-1">
                                        {getEventIcon(event.type)}
                                        <span className="text-[10px] uppercase tracking-wider font-semibold">
                                            {event.type.replace('_', ' ')}
                                        </span>
                                    </Badge>
                                    {event.capacity && (
                                        <Badge variant="secondary" className="text-[10px]">
                                            {event.registeredPatients?.length || 0} / {event.capacity} Filled
                                        </Badge>
                                    )}
                                </div>
                                <CardTitle className="text-xl mt-3 line-clamp-1">{event.title}</CardTitle>
                                <CardDescription className="line-clamp-2 min-h-[40px]">
                                    {event.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-1">
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-blue-500" />
                                        <span>
                                            {format(new Date(event.startDateTime), 'PPP')} at {format(new Date(event.startDateTime), 'p')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-emerald-500" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-orange-500" />
                                        <span>Hosted by {event.hospital.name}</span>
                                    </div>
                                </div>

                                <div className="pt-4 mt-auto">
                                    {isRegistered(event) ? (
                                        <Button
                                            variant="outline"
                                            className="w-full text-red-600 border-red-200 hover:bg-red-50"
                                            onClick={() => handleUnregister(event.id)}
                                        >
                                            Cancel Registration
                                        </Button>
                                    ) : (
                                        <Button
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            disabled={event.capacity !== undefined && (event.registeredPatients?.length || 0) >= event.capacity}
                                            onClick={() => handleRegister(event.id)}
                                        >
                                            {(event.capacity !== undefined && (event.registeredPatients?.length || 0) >= event.capacity)
                                                ? 'Event Full'
                                                : 'Register Now'
                                            }
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Bed, UserPlus, CheckCircle, Clock, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../lib/auth-context';
import { hospitalAPI } from '../../lib/api-client';

interface BedType {
    id: string;
    ward: string;
    number: string;
    status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
    patientName?: string;
    admissionDate?: string;
    hospitalId?: string;
}

export const HospitalBedManagement = () => {
    const { user } = useAuth();
    const [beds, setBeds] = useState<BedType[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newBed, setNewBed] = useState<Partial<BedType>>({
        ward: '',
        number: '',
        status: 'available',
    });

    useEffect(() => {
        const fetchBeds = async () => {
            if (user?.id) {
                try {
                    const data = await hospitalAPI.getBeds(user.id);
                    setBeds(data || []);
                } catch (error) {
                    console.error('Failed to fetch beds:', error);
                    toast.error('Failed to load beds');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchBeds();
    }, [user?.id]);

    const handleAddBed = async () => {
        if (!user?.id) return;
        if (!newBed.ward || !newBed.number) {
            toast.error('Please fill in required fields');
            return;
        }

        const bedToSave = {
            ...newBed,
            id: `BED-${Date.now()}`,
            status: 'available', // confirm status
            hospitalId: user.id,
            patientName: undefined,
            admissionDate: undefined
        };

        try {
            await hospitalAPI.updateBed(bedToSave);
            setBeds([...beds, bedToSave as BedType]);
            setIsAddOpen(false);
            setNewBed({ ward: '', number: '', status: 'available' });
            toast.success('Bed added successfully');
        } catch (error) {
            console.error('Failed to add bed:', error);
            toast.error('Failed to add bed');
        }
    };

    const handleDeleteBed = async (id: string) => {
        if (!confirm('Are you sure you want to delete this bed?')) return;
        try {
            await hospitalAPI.deleteBed(id);
            setBeds(beds.filter(b => b.id !== id));
            toast.success('Bed deleted successfully');
        } catch (error) {
            console.error('Failed to delete bed:', error);
            toast.error('Failed to delete bed');
        }
    };

    const filteredBeds = filter === 'all' ? beds : beds.filter(b => b.status === filter);

    const handleStatusChange = async (id: string, newStatus: BedType['status']) => {
        const bed = beds.find(b => b.id === id);
        if (!bed) return;

        const updatedBed = {
            ...bed,
            status: newStatus,
            patientName: newStatus === 'available' ? undefined : bed.patientName,
            admissionDate: newStatus === 'available' ? undefined : bed.admissionDate
        };

        try {
            await hospitalAPI.updateBed(updatedBed);
            setBeds(beds.map(b => b.id === id ? { ...b, status: newStatus } : b));
            toast.success(`Bed ${id} status updated to ${newStatus}`);
        } catch (error) {
            console.error('Failed to update bed:', error);
            toast.error('Failed to update bed status');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'occupied': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'cleaning': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'maintenance': return 'bg-slate-100 text-slate-700 border-slate-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading beds...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bed Management</h1>
                    <p className="text-slate-500">Real-time occupancy tracking and management</p>
                </div>
                <div className="flex gap-2 items-center">
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" /> Add Bed
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Bed</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Ward Name</Label>
                                    <Input
                                        value={newBed.ward}
                                        onChange={(e) => setNewBed({ ...newBed, ward: e.target.value })}
                                        placeholder="e.g. ICU, General Ward"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bed Number</Label>
                                    <Input
                                        value={newBed.number}
                                        onChange={(e) => setNewBed({ ...newBed, number: e.target.value })}
                                        placeholder="e.g. 101-A"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                                <Button onClick={handleAddBed}>Save Bed</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <div className="h-8 w-px bg-slate-200 mx-2" />

                    <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>All</Button>
                    <Button variant={filter === 'available' ? 'default' : 'outline'} onClick={() => setFilter('available')}>Available</Button>
                    <Button variant={filter === 'occupied' ? 'default' : 'outline'} onClick={() => setFilter('occupied')}>Occupied</Button>
                </div>
            </div>

            {beds.length === 0 ? (
                <Card className="p-8 text-center text-slate-500">
                    No beds configured.
                    {/* Maybe add "Add Bed" button here later if needed */}
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredBeds.map((bed) => (
                        <Card key={bed.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className={`h-2 w-full ${bed.status === 'available' ? 'bg-emerald-500' :
                                bed.status === 'occupied' ? 'bg-blue-500' :
                                    bed.status === 'cleaning' ? 'bg-amber-500' : 'bg-slate-400'
                                }`} />
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline" className={getStatusColor(bed.status)}>
                                        {bed.status.toUpperCase()}
                                    </Badge>
                                    <div className="flex gap-1">
                                        {bed.status === 'occupied' && (
                                            <Button size="icon" variant="ghost" className="h-6 w-6" title="Discharge" onClick={() => handleStatusChange(bed.id, 'cleaning')}>
                                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                                            </Button>
                                        )}
                                        {bed.status === 'cleaning' && (
                                            <Button size="icon" variant="ghost" className="h-6 w-6" title="Mark Clean" onClick={() => handleStatusChange(bed.id, 'available')}>
                                                <CheckCircle className="h-4 w-4 text-emerald-600" />
                                            </Button>
                                        )}
                                        {bed.status === 'available' && (
                                            <Button size="icon" variant="ghost" className="h-6 w-6" title="Maintenance" onClick={() => handleStatusChange(bed.id, 'maintenance')}>
                                                <Clock className="h-4 w-4 text-amber-600" />
                                            </Button>
                                        )}
                                        <Button size="icon" variant="ghost" className="h-6 w-6" title="Delete Bed" onClick={() => handleDeleteBed(bed.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Bed className="h-5 w-5 text-slate-500" />
                                    {bed.ward} - {bed.number}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {bed.status === 'occupied' ? (
                                    <div className="space-y-2 mt-2">
                                        <div className="text-sm font-medium text-slate-700">Patient: {bed.patientName}</div>
                                        <div className="text-xs text-slate-500">Admitted: {bed.admissionDate}</div>
                                    </div>
                                ) : (
                                    <div className="h-12 flex items-center justify-center text-slate-400 text-sm italic mt-2">
                                        {bed.status === 'available' ? 'Ready for admission' : bed.status}
                                    </div>
                                )}

                                {bed.status === 'available' && (
                                    <Button className="w-full mt-4" variant="outline" size="sm">
                                        <UserPlus className="h-4 w-4 mr-2" /> Admit Patient
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

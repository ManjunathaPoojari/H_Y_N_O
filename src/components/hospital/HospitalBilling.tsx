import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FileText, DollarSign, Download, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../lib/auth-context';
import { hospitalAPI } from '../../lib/api-client';

interface Bill {
    id: string;
    patientName: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    items: string[];
    hospitalId?: string;
}

export const HospitalBilling = () => {
    const { user } = useAuth();
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Form state
    const [newBill, setNewBill] = useState<Partial<Bill>>({
        patientName: '',
        amount: 0,
        status: 'pending',
        items: [],
        date: new Date().toISOString().split('T')[0]
    });
    const [tempItems, setTempItems] = useState('');

    useEffect(() => {
        const fetchBills = async () => {
            if (user?.id) {
                try {
                    const data = await hospitalAPI.getBills(user.id);
                    setBills(data || []);
                } catch (error) {
                    console.error('Failed to fetch bills:', error);
                    toast.error('Failed to load bills');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBills();
    }, [user?.id]);

    const handleCreateInvoice = async () => {
        if (!user?.id) return;
        if (!newBill.patientName || !newBill.amount) {
            toast.error('Please fill in required fields');
            return;
        }

        const billToSave = {
            ...newBill,
            id: `INV-${Date.now()}`,
            items: tempItems ? tempItems.split(',').map(i => i.trim()) : [],
            hospitalId: user.id
        };

        try {
            const savedBill = await hospitalAPI.createBill(billToSave);
            setBills([...bills, savedBill]);
            setIsCreateOpen(false);
            setNewBill({
                patientName: '',
                amount: 0,
                status: 'pending',
                items: [],
                date: new Date().toISOString().split('T')[0]
            });
            setTempItems('');
            toast.success('Invoice created successfully');
        } catch (error) {
            toast.error('Failed to create invoice');
        }
    };

    const handleDownload = (id: string) => {
        toast.success(`Downloading invoice ${id}...`);
    };

    const filteredBills = bills.filter(bill =>
        bill.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-slate-500">Loading billing data...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Billing & Invoices</h1>
                    <p className="text-slate-500">Manage patient payments and generate invoices</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" /> Create Invoice
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Invoice</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Patient Name</Label>
                                <Input
                                    value={newBill.patientName}
                                    onChange={(e) => setNewBill({ ...newBill, patientName: e.target.value })}
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input
                                        type="date"
                                        value={newBill.date}
                                        onChange={(e) => setNewBill({ ...newBill, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Amount (₹)</Label>
                                    <Input
                                        type="number"
                                        value={newBill.amount}
                                        onChange={(e) => setNewBill({ ...newBill, amount: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={newBill.status}
                                    onValueChange={(val: any) => setNewBill({ ...newBill, status: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="paid">Paid</SelectItem>
                                        <SelectItem value="overdue">Overdue</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Items (comma separated)</Label>
                                <Input
                                    value={tempItems}
                                    onChange={(e) => setTempItems(e.target.value)}
                                    placeholder="Consultation, Medicines, X-Ray"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateInvoice}>Generate Invoice</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <Search className="h-5 w-5 text-slate-400" />
                <Input
                    placeholder="Search by patient or invoice ID..."
                    className="max-w-md border-0 focus-visible:ring-0 px-0 text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{bills.filter(b => b.status === 'pending').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Collected (This Month)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">₹{bills.filter(b => b.status === 'paid').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Overdue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">₹{bills.filter(b => b.status === 'overdue').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Invoices</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Patient Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Items</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredBills.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-6 text-slate-500">
                                        No invoices found. Create a new invoice to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredBills.map((bill) => (
                                    <TableRow key={bill.id}>
                                        <TableCell className="font-medium">{bill.id}</TableCell>
                                        <TableCell>{bill.patientName}</TableCell>
                                        <TableCell>{bill.date}</TableCell>
                                        <TableCell className="text-slate-500 text-sm truncate max-w-[200px]">
                                            {bill.items?.join(', ') || '-'}
                                        </TableCell>
                                        <TableCell>₹{bill.amount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                bill.status === 'paid' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' :
                                                    bill.status === 'overdue' ? 'border-red-200 text-red-700 bg-red-50' :
                                                        'border-blue-200 text-blue-700 bg-blue-50'
                                            }>
                                                {bill.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button size="icon" variant="ghost" onClick={() => handleDownload(bill.id)}>
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

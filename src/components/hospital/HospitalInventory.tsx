import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../lib/auth-context';
import { hospitalAPI } from '../../lib/api-client';

interface InventoryItem {
    id: string;
    name: string;
    category: 'Medicine' | 'Equipment' | 'Consumable';
    quantity: number;
    unit: string;
    minLevel: number;
    expiry?: string;
    hospitalId?: string;
}

export const HospitalInventory = () => {
    const { user } = useAuth();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form state
    const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
        name: '',
        category: 'Medicine',
        quantity: 0,
        unit: 'units',
        minLevel: 10,
        expiry: ''
    });

    useEffect(() => {
        const fetchInventory = async () => {
            if (user?.id) {
                try {
                    const data = await hospitalAPI.getInventory(user.id);
                    setInventory(data || []);
                } catch (error) {
                    console.error('Failed to fetch inventory:', error);
                    toast.error('Failed to load inventory');
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchInventory();
    }, [user?.id]);

    const handleAddItem = async () => {
        if (!user?.id) return;
        if (!newItem.name || !newItem.quantity) {
            toast.error('Please fill in required fields');
            return;
        }

        const itemToSave = {
            ...newItem,
            id: `INV-${Date.now()}`, // Temporary ID if backend doesn't generate UUID immediately in response or just rely on backend result
            hospitalId: user.id
        };

        try {
            const savedItem = await hospitalAPI.saveInventoryItem(itemToSave);
            setInventory([...inventory, savedItem]);
            setIsAddOpen(false);
            setNewItem({ name: '', category: 'Medicine', quantity: 0, unit: 'units', minLevel: 10, expiry: '' });
            toast.success('Item added successfully');
        } catch (error) {
            toast.error('Failed to add item');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await hospitalAPI.deleteInventoryItem(id);
            setInventory(inventory.filter(i => i.id !== id));
            toast.success('Item removed');
        } catch (error) {
            toast.error('Failed to delete item');
        }
    };

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStockStatus = (item: InventoryItem) => {
        if (item.quantity <= item.minLevel) return 'critical';
        if (item.quantity <= item.minLevel * 1.5) return 'low';
        return 'good';
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading inventory...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventory & Pharmacy</h1>
                    <p className="text-slate-500">Manage medicines, equipment, and supplies</p>
                </div>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" /> Add Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Item</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Item Name</Label>
                                <Input
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    placeholder="e.g. Paracetamol"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={newItem.category}
                                        onValueChange={(val: any) => setNewItem({ ...newItem, category: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Medicine">Medicine</SelectItem>
                                            <SelectItem value="Equipment">Equipment</SelectItem>
                                            <SelectItem value="Consumable">Consumable</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Unit</Label>
                                    <Input
                                        value={newItem.unit}
                                        onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                                        placeholder="e.g. box, tablet"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Min Level</Label>
                                    <Input
                                        type="number"
                                        value={newItem.minLevel}
                                        onChange={(e) => setNewItem({ ...newItem, minLevel: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Expiry Date (Optional)</Label>
                                <Input
                                    type="date"
                                    value={newItem.expiry}
                                    onChange={(e) => setNewItem({ ...newItem, expiry: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddItem}>Save Item</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                <Search className="h-5 w-5 text-slate-400" />
                <Input
                    placeholder="Search inventory..."
                    className="max-w-md border-0 focus-visible:ring-0 px-0 text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Current Stock</CardTitle>
                    <CardDescription>Real-time view of all tracked items</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Stock Level</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Expiry</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredInventory.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-slate-500">
                                        No items found. Add some items to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredInventory.map((item) => {
                                    const status = getStockStatus(item);
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium text-slate-900">{item.name}</TableCell>
                                            <TableCell>{item.category}</TableCell>
                                            <TableCell>
                                                {item.quantity} {item.unit}
                                                {item.quantity <= item.minLevel && (
                                                    <span className="ml-2 text-xs text-red-500 font-bold">(Low)</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={
                                                    status === 'critical' ? 'border-red-500 text-red-600 bg-red-50' :
                                                        status === 'low' ? 'border-amber-500 text-amber-600 bg-amber-50' :
                                                            'border-emerald-500 text-emerald-600 bg-emerald-50'
                                                }>
                                                    {status.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{item.expiry || '-'}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="icon" variant="ghost" onClick={() => handleDelete(item.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

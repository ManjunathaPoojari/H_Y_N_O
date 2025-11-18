import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Pill, Plus, Edit, Trash2, CheckCircle, XCircle, Package, FileText, Clock } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import api from '../../lib/api-client';

interface Medicine {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  manufacturer?: string;
  status: string;
}

interface Order {
  id: string;
  patientName: string;
  date: string;
  total: number;
  status: string;
}

interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  status: string;
}

export const AdminPharmacy = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);

  // Medicine Form State
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    manufacturer: '',
  });

  // Load data on component mount
  useEffect(() => {
    loadPharmacyData();
  }, []);

  const loadPharmacyData = async () => {
    try {
      // Load medicines
      const medicinesData = await api.pharmacy.getMedicines();
      setMedicines(medicinesData || []);

      // Load orders
      const ordersData = await api.pharmacy.getOrders();
      setOrders(ordersData || []);
      setPendingOrders(ordersData.filter(order => order.status === 'pending') || []);

      // Load prescriptions
      const prescriptionsData = await api.pharmacy.getPrescriptions();
      setPrescriptions(prescriptionsData || []);
    } catch (error) {
      console.error('Failed to load pharmacy data:', error);
      // Fallback to empty arrays
      setMedicines([]);
      setOrders([]);
      setPrescriptions([]);
      setPendingOrders([]);
    }
  };

  // Handle Medicine CRUD
  const handleAddMedicine = async () => {
    if (!medicineForm.name || !medicineForm.price || !medicineForm.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newMedicine = {
      id: `MED${String(medicines.length + 1).padStart(3, '0')}`,
      name: medicineForm.name,
      description: medicineForm.description,
      price: parseFloat(medicineForm.price),
      stock: parseInt(medicineForm.stock),
      category: medicineForm.category,
      manufacturer: medicineForm.manufacturer,
      status: 'active',
    };

    try {
      await api.pharmacy.addMedicine(newMedicine);
      setMedicines([...medicines, newMedicine]);
      resetMedicineForm();
      toast.success('Medicine added successfully');
    } catch (error) {
      console.error('Failed to add medicine:', error);
      toast.error('Failed to add medicine');
    }
  };

  const handleEditMedicine = async () => {
    if (!medicineForm.name || !medicineForm.price || !medicineForm.stock || !editingMedicine) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedMedicine: Medicine = {
      ...editingMedicine,
      name: medicineForm.name,
      description: medicineForm.description,
      price: parseFloat(medicineForm.price),
      stock: parseInt(medicineForm.stock),
      category: medicineForm.category,
      manufacturer: medicineForm.manufacturer,
    };

    try {
      await api.pharmacy.updateMedicine(updatedMedicine.id, updatedMedicine);
      setMedicines(medicines.map(med => med.id === updatedMedicine.id ? updatedMedicine : med));
      resetMedicineForm();
      toast.success('Medicine updated successfully');
    } catch (error) {
      console.error('Failed to update medicine:', error);
      toast.error('Failed to update medicine');
    }
  };

  const handleDeleteMedicine = async (medicineId: string) => {
    try {
      await api.pharmacy.deleteMedicine(medicineId);
      setMedicines(medicines.filter(med => med.id !== medicineId));
      toast.success('Medicine deleted successfully');
    } catch (error) {
      console.error('Failed to delete medicine:', error);
      toast.error('Failed to delete medicine');
    }
  };

  const resetMedicineForm = () => {
    setMedicineForm({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      manufacturer: '',
    });
    setEditingMedicine(null);
    setShowMedicineForm(false);
  };

  const startEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setMedicineForm({
      name: medicine.name,
      description: medicine.description || '',
      price: medicine.price.toString(),
      stock: medicine.stock.toString(),
      category: medicine.category || '',
      manufacturer: medicine.manufacturer || '',
    });
    setShowMedicineForm(true);
  };

  // Handle Order Status Updates
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.pharmacy.updateOrderStatus(orderId, status);
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status } : order
      ));
      setPendingOrders(pendingOrders.filter(order => order.id !== orderId));
      toast.success(`Order ${status} successfully`);
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Pharmacy Management</h1>
        <p className="text-gray-600">Manage medicines, orders, and prescriptions</p>
      </div>

      <Tabs defaultValue="medicines" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
          <TabsTrigger value="orders">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending Orders</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        {/* Medicines Tab */}
        <TabsContent value="medicines" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Medicines Inventory</h2>
            <Button onClick={() => setShowMedicineForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </div>

          {/* Medicine Form */}
          {showMedicineForm && (
            <Card>
              <CardHeader>
                <CardTitle>{editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicine-name">Name *</Label>
                    <Input
                      id="medicine-name"
                      value={medicineForm.name}
                      onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
                      placeholder="Medicine name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-price">Price (₹) *</Label>
                    <Input
                      id="medicine-price"
                      type="number"
                      value={medicineForm.price}
                      onChange={(e) => setMedicineForm({ ...medicineForm, price: e.target.value })}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-stock">Stock Quantity *</Label>
                    <Input
                      id="medicine-stock"
                      type="number"
                      value={medicineForm.stock}
                      onChange={(e) => setMedicineForm({ ...medicineForm, stock: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-category">Category</Label>
                    <Input
                      id="medicine-category"
                      value={medicineForm.category}
                      onChange={(e) => setMedicineForm({ ...medicineForm, category: e.target.value })}
                      placeholder="Pain Relief"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-manufacturer">Manufacturer</Label>
                    <Input
                      id="medicine-manufacturer"
                      value={medicineForm.manufacturer}
                      onChange={(e) => setMedicineForm({ ...medicineForm, manufacturer: e.target.value })}
                      placeholder="Pharma Corp"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicine-description">Description</Label>
                  <Textarea
                    id="medicine-description"
                    value={medicineForm.description}
                    onChange={(e) => setMedicineForm({ ...medicineForm, description: e.target.value })}
                    placeholder="Medicine description"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={editingMedicine ? handleEditMedicine : handleAddMedicine}>
                    {editingMedicine ? 'Update' : 'Add'} Medicine
                  </Button>
                  <Button variant="outline" onClick={resetMedicineForm}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Medicines List */}
          <div className="grid gap-4">
            {medicines.map((medicine) => (
              <Card key={medicine.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Pill className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-semibold">{medicine.name}</h3>
                        <p className="text-sm text-gray-600">{medicine.category}</p>
                        <p className="text-xs text-gray-500">Stock: {medicine.stock} | ₹{medicine.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEditMedicine(medicine)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteMedicine(medicine.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* All Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <h2 className="text-xl font-semibold">All Orders</h2>
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">Patient: {order.patientName}</p>
                      <p className="text-xs text-gray-500">Date: {order.date} | Total: ₹{order.total}</p>
                    </div>
                    <Badge variant={order.status === 'delivered' ? 'default' : order.status === 'pending' ? 'secondary' : 'outline'}>
                      {order.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pending Orders Tab */}
        <TabsContent value="pending" className="space-y-6">
          <h2 className="text-xl font-semibold">Pending Orders</h2>
          <div className="grid gap-4">
            {pendingOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Order #{order.id}</h3>
                      <p className="text-sm text-gray-600">Patient: {order.patientName}</p>
                      <p className="text-xs text-gray-500">Date: {order.date} | Total: ₹{order.total}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdateOrderStatus(order.id, 'approved')}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleUpdateOrderStatus(order.id, 'rejected')}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-6">
          <h2 className="text-xl font-semibold">Prescriptions</h2>
          <div className="grid gap-4">
            {prescriptions.map((prescription) => (
              <Card key={prescription.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-semibold">Prescription #{prescription.id}</h3>
                        <p className="text-sm text-gray-600">Patient: {prescription.patientName}</p>
                        <p className="text-xs text-gray-500">Doctor: {prescription.doctorName} | Date: {prescription.date}</p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {prescription.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

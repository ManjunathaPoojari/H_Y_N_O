import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Pill, Plus, Edit, Trash2, Package } from 'lucide-react';
import api from '../../lib/api-client';

interface Medicine {
  id: string;
  name: string;
  genericName?: string;
  description?: string;
  manufacturer?: string;
  dosageForm?: string;
  strength?: string;
  indications?: string;
  contraindications?: string;
  sideEffects?: string;
  precautions?: string;
  interactions?: string;
  category?: string;
  price: number;
  stockQuantity: number;
  prescriptionRequired?: string;
  status: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminMedicineListProps {
  onNavigate: (path: string) => void;
}

export const AdminMedicineList = ({ onNavigate }: AdminMedicineListProps) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    try {
      setLoading(true);
      const data = await api.pharmacy.getMedicines();
      setMedicines(data || []);
    } catch (error) {
      console.error('Failed to load medicines:', error);
      toast.error('Failed to load medicines');
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedicine = async (medicineId: string) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;

    try {
      await api.pharmacy.deleteMedicine(medicineId);
      setMedicines(medicines.filter(med => med.id !== medicineId));
      toast.success('Medicine deleted successfully');
    } catch (error) {
      console.error('Failed to delete medicine:', error);
      toast.error('Failed to delete medicine');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'discontinued':
        return <Badge variant="destructive">Discontinued</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl mb-2">Medicines</h1>
          <p className="text-gray-600">Manage your medicine inventory</p>
        </div>
        <Button onClick={() => onNavigate('/admin/pharmacy/medicines/add')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      {medicines.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No medicines found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first medicine to the inventory.</p>
            <Button onClick={() => onNavigate('/admin/pharmacy/medicines/add')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </CardContent>
        </Card>
      ) : (
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
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">Stock: {medicine.stockQuantity}</span>
                        <span className="text-xs text-gray-500">₹{medicine.price}</span>
                        {medicine.prescriptionRequired === 'YES' && (
                          <Badge variant="outline" className="text-xs">Rx Required</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(medicine.status)}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onNavigate(`/admin/pharmacy/medicines/edit/${medicine.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteMedicine(medicine.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

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

interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  status: string;
}

export const AdminPharmacy = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  // Medicine Form State
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [medicineForm, setMedicineForm] = useState({
    name: '',
    genericName: '',
    description: '',
    manufacturer: '',
    dosageForm: '',
    strength: '',
    indications: '',
    contraindications: '',
    sideEffects: '',
    precautions: '',
    interactions: '',
    category: '',
    price: '',
    stockQuantity: '',
    prescriptionRequired: '',
    status: 'ACTIVE',
    imageUrl: '',
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

      // Load prescriptions
      const prescriptionsData = await api.pharmacy.getPrescriptions();
      setPrescriptions(prescriptionsData || []);
    } catch (error) {
      console.error('Failed to load pharmacy data:', error);
      // Fallback to empty arrays
      setMedicines([]);
      setPrescriptions([]);
    }
  };

  // Handle Medicine CRUD
  const handleAddMedicine = async () => {
    if (!medicineForm.name || !medicineForm.price || !medicineForm.stockQuantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const medicineData = {
      name: medicineForm.name,
      genericName: medicineForm.genericName,
      description: medicineForm.description,
      manufacturer: medicineForm.manufacturer,
      dosageForm: medicineForm.dosageForm,
      strength: medicineForm.strength,
      indications: medicineForm.indications,
      contraindications: medicineForm.contraindications,
      sideEffects: medicineForm.sideEffects,
      precautions: medicineForm.precautions,
      interactions: medicineForm.interactions,
      category: medicineForm.category,
      price: parseFloat(medicineForm.price),
      stockQuantity: parseInt(medicineForm.stockQuantity),
      prescriptionRequired: medicineForm.prescriptionRequired,
      status: medicineForm.status,
      imageUrl: medicineForm.imageUrl,
    };

    try {
      await api.pharmacy.addMedicine(medicineData);
      resetMedicineForm();
      toast.success('Medicine added successfully');
      // Reload data to ensure consistency
      await loadPharmacyData();
    } catch (error) {
      console.error('Failed to add medicine:', error);
      toast.error('Failed to add medicine');
    }
  };

  const handleEditMedicine = async () => {
    if (!editingMedicine) return;
    if (!medicineForm.name || !medicineForm.price || !medicineForm.stockQuantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const updatedMedicine: Medicine = {
      ...editingMedicine,
      name: medicineForm.name,
      genericName: medicineForm.genericName,
      description: medicineForm.description,
      manufacturer: medicineForm.manufacturer,
      dosageForm: medicineForm.dosageForm,
      strength: medicineForm.strength,
      indications: medicineForm.indications,
      contraindications: medicineForm.contraindications,
      sideEffects: medicineForm.sideEffects,
      precautions: medicineForm.precautions,
      interactions: medicineForm.interactions,
      category: medicineForm.category,
      price: parseFloat(medicineForm.price),
      stockQuantity: parseInt(medicineForm.stockQuantity),
      prescriptionRequired: medicineForm.prescriptionRequired,
      status: medicineForm.status,
      imageUrl: medicineForm.imageUrl,
    };

    try {
      await api.pharmacy.updateMedicine(updatedMedicine.id, updatedMedicine);
      resetMedicineForm();
      toast.success('Medicine updated successfully');
      // Reload data to ensure consistency
      await loadPharmacyData();
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
      // Reload data to ensure consistency
      await loadPharmacyData();
    } catch (error) {
      console.error('Failed to delete medicine:', error);
      toast.error('Failed to delete medicine');
    }
  };

  const resetMedicineForm = () => {
    setMedicineForm({
      name: '',
      genericName: '',
      description: '',
      manufacturer: '',
      dosageForm: '',
      strength: '',
      indications: '',
      contraindications: '',
      sideEffects: '',
      precautions: '',
      interactions: '',
      category: '',
      price: '',
      stockQuantity: '',
      prescriptionRequired: '',
      status: 'ACTIVE',
      imageUrl: '',
    });
    setEditingMedicine(null);
    setShowMedicineForm(false);
  };

  const startEditMedicine = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setMedicineForm({
      name: medicine.name,
      genericName: medicine.genericName || '',
      description: medicine.description || '',
      manufacturer: medicine.manufacturer || '',
      dosageForm: medicine.dosageForm || '',
      strength: medicine.strength || '',
      indications: medicine.indications || '',
      contraindications: medicine.contraindications || '',
      sideEffects: medicine.sideEffects || '',
      precautions: medicine.precautions || '',
      interactions: medicine.interactions || '',
      category: medicine.category || '',
      price: medicine.price.toString(),
      stockQuantity: medicine.stockQuantity.toString(),
      prescriptionRequired: medicine.prescriptionRequired || '',
      status: medicine.status,
      imageUrl: medicine.imageUrl || '',
    });
    setShowMedicineForm(true);
  };



  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Pharmacy Management</h1>
        <p className="text-gray-600">Manage medicines, orders, and prescriptions</p>
      </div>

      <Tabs defaultValue="medicines" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="medicines">Medicines</TabsTrigger>
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
                    <Label htmlFor="medicine-generic-name">Generic Name</Label>
                    <Input
                      id="medicine-generic-name"
                      value={medicineForm.genericName}
                      onChange={(e) => setMedicineForm({ ...medicineForm, genericName: e.target.value })}
                      placeholder="Generic name"
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
                      value={medicineForm.stockQuantity}
                      onChange={(e) => setMedicineForm({ ...medicineForm, stockQuantity: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-category">Category</Label>
                    <Select value={medicineForm.category} onValueChange={(value: string) => setMedicineForm({ ...medicineForm, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pain Relief">Pain Relief</SelectItem>
                        <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                        <SelectItem value="Vitamins & Supplements">Vitamins & Supplements</SelectItem>
                        <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                        <SelectItem value="Respiratory">Respiratory</SelectItem>
                        <SelectItem value="Digestive">Digestive</SelectItem>
                        <SelectItem value="Neurological">Neurological</SelectItem>
                        <SelectItem value="Dermatological">Dermatological</SelectItem>
                        <SelectItem value="Endocrine">Endocrine</SelectItem>
                        <SelectItem value="Ophthalmic">Ophthalmic</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <div className="space-y-2">
                    <Label htmlFor="medicine-dosage-form">Dosage Form</Label>
                    <Input
                      id="medicine-dosage-form"
                      value={medicineForm.dosageForm}
                      onChange={(e) => setMedicineForm({ ...medicineForm, dosageForm: e.target.value })}
                      placeholder="Tablet, Capsule, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-strength">Strength</Label>
                    <Input
                      id="medicine-strength"
                      value={medicineForm.strength}
                      onChange={(e) => setMedicineForm({ ...medicineForm, strength: e.target.value })}
                      placeholder="500mg, 10mg/ml, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-prescription-required">Prescription Required</Label>
                    <Select value={medicineForm.prescriptionRequired} onValueChange={(value: string) => setMedicineForm({ ...medicineForm, prescriptionRequired: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select prescription requirement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="YES">Yes</SelectItem>
                        <SelectItem value="NO">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-status">Status</Label>
                    <Select value={medicineForm.status} onValueChange={(value: string) => setMedicineForm({ ...medicineForm, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                        <SelectItem value="DISCONTINUED">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medicine-image-url">Image URL</Label>
                    <Input
                      id="medicine-image-url"
                      value={medicineForm.imageUrl}
                      onChange={(e) => setMedicineForm({ ...medicineForm, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
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
                <div className="space-y-2">
                  <Label htmlFor="medicine-indications">Indications</Label>
                  <Textarea
                    id="medicine-indications"
                    value={medicineForm.indications}
                    onChange={(e) => setMedicineForm({ ...medicineForm, indications: e.target.value })}
                    placeholder="Medical conditions this medicine treats"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicine-contraindications">Contraindications</Label>
                  <Textarea
                    id="medicine-contraindications"
                    value={medicineForm.contraindications}
                    onChange={(e) => setMedicineForm({ ...medicineForm, contraindications: e.target.value })}
                    placeholder="Conditions where this medicine should not be used"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicine-side-effects">Side Effects</Label>
                  <Textarea
                    id="medicine-side-effects"
                    value={medicineForm.sideEffects}
                    onChange={(e) => setMedicineForm({ ...medicineForm, sideEffects: e.target.value })}
                    placeholder="Possible side effects"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicine-precautions">Precautions</Label>
                  <Textarea
                    id="medicine-precautions"
                    value={medicineForm.precautions}
                    onChange={(e) => setMedicineForm({ ...medicineForm, precautions: e.target.value })}
                    placeholder="Precautions to take while using this medicine"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicine-interactions">Interactions</Label>
                  <Textarea
                    id="medicine-interactions"
                    value={medicineForm.interactions}
                    onChange={(e) => setMedicineForm({ ...medicineForm, interactions: e.target.value })}
                    placeholder="Drug interactions"
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
                        <p className="text-xs text-gray-500">Stock: {medicine.stockQuantity} | ₹{medicine.price}</p>
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

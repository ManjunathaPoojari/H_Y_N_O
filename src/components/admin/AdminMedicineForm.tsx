import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { ArrowLeft } from 'lucide-react';
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

interface AdminMedicineFormProps {
  onNavigate: (path: string) => void;
  medicineId?: string;
}

export const AdminMedicineForm = ({ onNavigate, medicineId }: AdminMedicineFormProps) => {
  const isEditing = !!medicineId;
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
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
    prescriptionRequired: 'NO',
    status: 'ACTIVE',
    imageUrl: '',
  });

  useEffect(() => {
    if (isEditing) {
      loadMedicine();
    }
  }, [medicineId]);

  const loadMedicine = async () => {
    if (!medicineId) return;

    try {
      setLoading(true);
      const medicine = await api.medicines.getById(medicineId);
      if (medicine) {
        setFormData({
          name: medicine.name || '',
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
          price: medicine.price?.toString() || '',
          stockQuantity: medicine.stockQuantity?.toString() || '',
          prescriptionRequired: medicine.prescriptionRequired || 'NO',
          status: medicine.status || 'ACTIVE',
          imageUrl: medicine.imageUrl || '',
        });
      }
    } catch (error) {
      console.error('Failed to load medicine:', error);
      toast.error('Failed to load medicine details');
      onNavigate('/admin/pharmacy/medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stockQuantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const medicineData = {
      name: formData.name,
      genericName: formData.genericName,
      description: formData.description,
      manufacturer: formData.manufacturer,
      dosageForm: formData.dosageForm,
      strength: formData.strength,
      indications: formData.indications,
      contraindications: formData.contraindications,
      sideEffects: formData.sideEffects,
      precautions: formData.precautions,
      interactions: formData.interactions,
      category: formData.category,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      prescriptionRequired: formData.prescriptionRequired,
      status: formData.status,
      imageUrl: formData.imageUrl,
    };

    try {
      setSaving(true);
      if (isEditing && medicineId) {
        await api.pharmacy.updateMedicine(medicineId, medicineData);
        toast.success('Medicine updated successfully');
      } else {
        await api.pharmacy.addMedicine(medicineData);
        toast.success('Medicine added successfully');
      }
      onNavigate('/admin/pharmacy/medicines');
    } catch (error) {
      console.error('Failed to save medicine:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} medicine`);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => onNavigate('/admin/pharmacy/medicines')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Medicines
        </Button>
        <div>
          <h1 className="text-3xl mb-2">{isEditing ? 'Edit Medicine' : 'Add Medicine'}</h1>
          <p className="text-gray-600">
            {isEditing ? 'Update medicine information' : 'Add a new medicine to your inventory'}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medicine Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Medicine name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genericName">Generic Name</Label>
                <Input
                  id="genericName"
                  value={formData.genericName}
                  onChange={(e) => handleInputChange('genericName', e.target.value)}
                  placeholder="Generic name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="100.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                  placeholder="50"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  placeholder="Pharma Corp"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosageForm">Dosage Form</Label>
                <Input
                  id="dosageForm"
                  value={formData.dosageForm}
                  onChange={(e) => handleInputChange('dosageForm', e.target.value)}
                  placeholder="Tablet, Capsule, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="strength">Strength</Label>
                <Input
                  id="strength"
                  value={formData.strength}
                  onChange={(e) => handleInputChange('strength', e.target.value)}
                  placeholder="500mg, 10mg/ml, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prescriptionRequired">Prescription Required</Label>
                <Select value={formData.prescriptionRequired} onValueChange={(value) => handleInputChange('prescriptionRequired', value)}>
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
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Medicine description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="indications">Indications</Label>
                <Textarea
                  id="indications"
                  value={formData.indications}
                  onChange={(e) => handleInputChange('indications', e.target.value)}
                  placeholder="Medical conditions this medicine treats"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contraindications">Contraindications</Label>
                <Textarea
                  id="contraindications"
                  value={formData.contraindications}
                  onChange={(e) => handleInputChange('contraindications', e.target.value)}
                  placeholder="Conditions where this medicine should not be used"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sideEffects">Side Effects</Label>
                <Textarea
                  id="sideEffects"
                  value={formData.sideEffects}
                  onChange={(e) => handleInputChange('sideEffects', e.target.value)}
                  placeholder="Possible side effects"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precautions">Precautions</Label>
                <Textarea
                  id="precautions"
                  value={formData.precautions}
                  onChange={(e) => handleInputChange('precautions', e.target.value)}
                  placeholder="Precautions to take while using this medicine"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interactions">Interactions</Label>
                <Textarea
                  id="interactions"
                  value={formData.interactions}
                  onChange={(e) => handleInputChange('interactions', e.target.value)}
                  placeholder="Drug interactions"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : (isEditing ? 'Update Medicine' : 'Add Medicine')}
              </Button>
              <Button type="button" variant="outline" onClick={() => onNavigate('/admin/pharmacy/medicines')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { medicineAPI } from '../../lib/api-client';
import { useAuth } from '../../lib/auth-context';
import { Pill, Search, Plus, ShoppingCart, Filter } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  category?: string;
  imageUrl?: string;
  prescriptionRequired: string;
}

interface PharmacyMedicinesProps {
  onAddToCart: (medicine: Medicine) => void;
  cartItemCount: number;
  onNavigate: (path: string) => void;
}

export const PharmacyMedicines: React.FC<PharmacyMedicinesProps> = ({
  onAddToCart,
  cartItemCount,
  onNavigate
}) => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const data = await medicineAPI.getAll();
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  // Predefined medicine categories
  const categories = [
    'Pain Relief',
    'Antibiotics',
    'Vitamins & Supplements',
    'Cardiovascular',
    'Respiratory',
    'Digestive',
    'Neurological',
    'Dermatological',
    'Endocrine',
    'Ophthalmic',
    'Other'
  ];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medicines</h1>
          <p className="text-gray-600">Browse and order medicines online</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="px-3 py-1">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {cartItemCount} items in cart
          </Badge>
          <Button onClick={() => onNavigate('/patient/pharmacy/cart')}>
            View Cart
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="pl-10 w-full sm:w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.map((medicine) => (
          <Card key={medicine.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {medicine.imageUrl ? (
                  <img
                    src={medicine.imageUrl}
                    alt={medicine.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg></div>';
                      }
                    }}
                  />
                ) : (
                  <Pill className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <CardTitle className="text-lg">{medicine.name}</CardTitle>
              <CardDescription>{medicine.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    ₹{medicine.price.toFixed(2)}
                  </span>
                  <Badge variant={medicine.stockQuantity > 0 ? "secondary" : "destructive"}>
                    {medicine.stockQuantity > 0 ? `${medicine.stockQuantity} in stock` : 'Out of stock'}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Form:</strong> {medicine.dosageForm}</p>
                  <p><strong>Strength:</strong> {medicine.strength}</p>
                  <p><strong>Manufacturer:</strong> {medicine.manufacturer}</p>
                </div>
                {medicine.prescriptionRequired === 'YES' && (
                  <Alert>
                    <AlertDescription>
                      Prescription required for this medicine
                    </AlertDescription>
                  </Alert>
                )}
                <Button
                  onClick={() => onAddToCart(medicine)}
                  disabled={medicine.stockQuantity === 0}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { medicineAPI } from '../../lib/api-client';
import { useAuth } from '../../lib/auth-context';
import {
  Pill, ShoppingCart, Search, Plus, Package, CreditCard, ArrowRight
} from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  imageUrl?: string;
  prescriptionRequired: string;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: any[];
}

interface PharmacyDashboardProps {
  cartItemCount: number;
  onNavigate: (path: string) => void;
  onAddToCart: (medicine: Medicine) => void;
}

export const PharmacyDashboard: React.FC<PharmacyDashboardProps> = ({
  cartItemCount,
  onNavigate,
  onAddToCart
}) => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Mock data for new features
  const healthTips = [
    "Stay hydrated! Drink at least 8 glasses of water daily for better health.",
    "Take your medications at the same time each day to maintain consistent levels in your body.",
    "Always read the medication label and follow dosage instructions carefully.",
    "Store medicines in a cool, dry place away from direct sunlight.",
    "Never share prescription medications with others, even if they have similar symptoms."
  ];

  const healthReminders = [
    { id: 1, type: 'medication', title: 'Blood Pressure Medication', time: '8:00 AM', daysLeft: 2 },
    { id: 2, type: 'refill', title: 'Vitamin D Supplement', time: 'Refill due', daysLeft: 5 },
    { id: 3, type: 'appointment', title: 'Doctor Checkup', time: 'Tomorrow 2:00 PM', daysLeft: 1 }
  ];

  const upcomingRefills = [
    { id: 1, medicine: 'Lisinopril 10mg', dueDate: '2024-01-15', quantity: 30 },
    { id: 2, medicine: 'Metformin 500mg', dueDate: '2024-01-18', quantity: 60 },
    { id: 3, medicine: 'Amlodipine 5mg', dueDate: '2024-01-20', quantity: 30 }
  ];

  const recentActivity = [
    { id: 1, type: 'order', title: 'Order #1234 Delivered', time: '2 hours ago', status: 'completed' },
    { id: 2, type: 'prescription', title: 'New Prescription Added', time: '1 day ago', status: 'pending' },
    { id: 3, type: 'refill', title: 'Refill Reminder Sent', time: '3 days ago', status: 'info' }
  ];

  const spendingData = [1200, 950, 1400, 1100, 1600, 1300]; // Mock monthly spending

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const medicinesData = await medicineAPI.getAll();
      setMedicines(medicinesData);
      // For now, we'll skip orders since getAll doesn't exist, can be added later
      setRecentOrders([]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredMedicines = medicines.slice(0, 6); // Top 6 medicines as featured
  const totalMedicines = medicines.length;
  const recentOrderCount = recentOrders.length;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to medicines page with search query
      onNavigate(`/patient/pharmacy/medicine?search=${encodeURIComponent(searchQuery)}`);
    } else {
      onNavigate('/patient/pharmacy/medicine');
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Online Pharmacy</h1>
          <p className="text-gray-600">Browse medicines, manage your cart, and track orders</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="px-3 py-1">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {cartItemCount} items in cart
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('/patient/pharmacy/medicine')}>
          <CardContent className="p-6 text-center">
            <Pill className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Browse Medicines</h3>
            <p className="text-gray-600 text-sm">Search and order medicines online</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('/patient/pharmacy/cart')}>
          <CardContent className="p-6 text-center">
            <ShoppingCart className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Shopping Cart</h3>
            <p className="text-gray-600 text-sm">{cartItemCount} items in cart</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('/patient/pharmacy/checkout')}>
          <CardContent className="p-6 text-center">
            <CreditCard className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Checkout</h3>
            <p className="text-gray-600 text-sm">Complete your order</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('/patient/pharmacy/orders')}>
          <CardContent className="p-6 text-center">
            <Package className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Order History</h3>
            <p className="text-gray-600 text-sm">View your past orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Medicines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-600" />
            Featured Medicines
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredMedicines.slice(0, 6).map((medicine) => (
                <div key={medicine.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Pill className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">{medicine.name}</h4>
                        <p className="text-sm text-gray-600">{medicine.description}</p>
                      </div>
                    </div>
                    <Badge variant={medicine.stockQuantity > 0 ? "secondary" : "destructive"}>
                      {medicine.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">₹{medicine.price.toFixed(2)}</span>
                    <Button
                      size="sm"
                      onClick={() => onAddToCart(medicine)}
                      disabled={medicine.stockQuantity === 0}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => onNavigate('/patient/pharmacy/medicine')}
          >
            View All Medicines
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

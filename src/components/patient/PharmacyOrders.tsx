import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Package, Clock, CheckCircle, XCircle, Truck, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { orderAPI } from '../../lib/api-client';

interface OrderItem {
  id: string;
  medicine: {
    id: string;
    name: string;
    price: number;
    dosageForm: string;
    strength: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress: {
    name: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  orderItems: OrderItem[];
}

interface PharmacyOrdersProps {
  onNavigate: (path: string) => void;
}

export const PharmacyOrders: React.FC<PharmacyOrdersProps> = ({ onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current patient ID from localStorage
      const patientId = localStorage.getItem('userId');
      if (!patientId) {
        setError('Patient ID not found. Please log in again.');
        return;
      }

      const ordersData = await orderAPI.getByPatient(patientId);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'secondary';
      case 'confirmed':
        return 'default';
      case 'shipped':
        return 'outline';
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={fetchOrders} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
        <p className="text-gray-600 mb-4">You haven't placed any orders yet. Start shopping to see your order history here.</p>
        <Button onClick={() => onNavigate('/patient/pharmacy')}>
          Browse Medicines
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
        </div>
        <Button onClick={fetchOrders} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <Badge variant={getStatusBadgeVariant(order.status)} className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Ordered on</p>
                  <p className="font-medium">{formatDate(order.orderDate)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {order.orderItems?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.medicine?.name}</h4>
                      <p className="text-xs text-gray-600">
                        {item.medicine?.dosageForm} • {item.medicine?.strength}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">Qty: {item.quantity}</p>
                      <p className="text-sm text-gray-600">₹{item.price?.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-2">Delivery Address</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium">{order.deliveryAddress?.name}</p>
                    <p>{order.deliveryAddress?.street}</p>
                    <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.pincode}</p>
                    <p>{order.deliveryAddress?.phone}</p>
                    <p>{order.deliveryAddress?.email}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-2">Payment Details</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Method:</span> {order.paymentMethod}</p>
                    <p><span className="font-medium">Total:</span> ₹{order.totalAmount?.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                {order.status?.toLowerCase() === 'pending' && (
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Cancel Order
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

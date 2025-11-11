import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ShoppingCart, Pill, Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';

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

interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface PharmacyCartProps {
  cart: CartItem[];
  onUpdateQuantity: (medicineId: string, quantity: number) => void;
  onRemoveFromCart: (medicineId: string) => void;
  onNavigate: (path: string) => void;
}

export const PharmacyCart: React.FC<PharmacyCartProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onNavigate
}) => {
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.medicine.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => onNavigate('/patient/pharmacy')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Medicines
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600">{getCartItemCount()} items in your cart</p>
          </div>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <ShoppingCart className="h-4 w-4 mr-2" />
          {getCartItemCount()} items
        </Badge>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-4">Add some medicines to get started</p>
          <Button onClick={() => onNavigate('/patient/pharmacy')}>
            Browse Medicines
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <Card key={item.medicine.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Pill className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.medicine.name}</h4>
                    <p className="text-sm text-gray-600">₹{item.medicine.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.medicine.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.medicine.id, item.quantity + 1)}
                      disabled={item.quantity >= item.medicine.stockQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{(item.medicine.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFromCart(item.medicine.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Separator />

          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total:</span>
            <span className="text-2xl font-bold text-blue-600">₹{getTotalPrice().toFixed(2)}</span>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={() => onNavigate('/patient/pharmacy')}>
              Continue Shopping
            </Button>
            <Button onClick={() => onNavigate('/patient/pharmacy/checkout')} className="flex-1">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

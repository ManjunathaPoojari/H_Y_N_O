import React, { useState, useEffect } from 'react';
import { PharmacyMedicines } from './PharmacyMedicines';
import { PharmacyCart } from './PharmacyCart';
import { PharmacyDashboard } from './PharmacyDashboard';
import { PharmacyMedicineDetails } from './PharmacyMedicineDetails';
import { PharmacyWishlist } from './PharmacyWishlist';
import { PharmacyHealthTips } from './PharmacyHealthTips';
import { PrescriptionUpload } from './PrescriptionUpload';
import { PharmacyCheckout } from './PharmacyCheckout';
import { PharmacyOrders } from './PharmacyOrders';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Pill, ShoppingCart, CreditCard, Home, Package } from 'lucide-react';

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

interface PharmacyRouterProps {
  onNavigate: (path: string) => void;
  currentPath: string;
}

export const PharmacyRouter: React.FC<PharmacyRouterProps> = ({
  onNavigate,
  currentPath
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('pharmacy-cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pharmacy-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (medicine: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map(item =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { medicine, quantity: 1 }];
    });
  };

  const updateQuantity = (medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.medicine.id === medicineId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (medicineId: string) => {
    setCart(prev => prev.filter(item => item.medicine.id !== medicineId));
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleOrderPlaced = () => {
    setCart([]);
    onNavigate('/patient/pharmacy/orders');
  };

  const renderContent = () => {
    switch (currentPath) {
      case '/patient/pharmacy':
        return (
          <PharmacyDashboard
            cartItemCount={getCartItemCount()}
            onNavigate={onNavigate}
            onAddToCart={addToCart}
          />
        );
      case '/patient/pharmacy/medicine':
        return (
          <PharmacyMedicines
            onAddToCart={addToCart}
            cartItemCount={getCartItemCount()}
            onNavigate={onNavigate}
          />
        );
      case '/patient/pharmacy/medicine-details':
        const urlParams = new URLSearchParams(window.location.search);
        const medicineId = urlParams.get('id') || '1'; // Default to '1' if no id provided
        return (
          <PharmacyMedicineDetails
            medicineId={medicineId}
            onNavigate={onNavigate}
            onAddToCart={addToCart}
            cartItemCount={getCartItemCount()}
          />
        );
      case '/patient/pharmacy/prescription-upload':
        return (
          <PrescriptionUpload onNavigate={onNavigate} />
        );
      case '/patient/pharmacy/wishlist':
        return (
          <PharmacyWishlist
            onNavigate={onNavigate}
            onAddToCart={addToCart}
            cartItemCount={getCartItemCount()}
          />
        );
      case '/patient/pharmacy/health-tips':
        return (
          <PharmacyHealthTips
            onNavigate={onNavigate}
          />
        );
      case '/patient/pharmacy/cart':
        return (
          <PharmacyCart
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onNavigate={onNavigate}
          />
        );
      case '/patient/pharmacy/checkout':
        return (
          <PharmacyCheckout
            cart={cart}
            onNavigate={onNavigate}
            onOrderPlaced={handleOrderPlaced}
          />
        );
      case '/patient/pharmacy/orders':
        return (
          <PharmacyOrders onNavigate={onNavigate} />
        );
      default:
        return (
          <PharmacyDashboard
            cartItemCount={getCartItemCount()}
            onNavigate={onNavigate}
            onAddToCart={addToCart}
          />
        );
    }
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="space-y-6">
      {/* Pharmacy Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Home */}
            <Button
              variant="ghost"
              onClick={() => onNavigate('/patient/pharmacy')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Home className="h-5 w-5" />
              <span className="font-semibold">Online Pharmacy</span>
            </Button>

            {/* Navigation Links */}
            <nav className="flex items-center space-x-4">
              <Button
                variant={isActive('/patient/pharmacy/medicine') ? "default" : "ghost"}
                onClick={() => onNavigate('/patient/pharmacy/medicine')}
                className="flex items-center gap-2"
              >
                <Pill className="h-4 w-4" />
                Medicines
              </Button>

              <Button
                variant={isActive('/patient/pharmacy/prescription-upload') ? "default" : "ghost"}
                onClick={() => onNavigate('/patient/pharmacy/prescription-upload')}
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Upload Prescription
              </Button>

              <Button
                variant={isActive('/patient/pharmacy/wishlist') ? "default" : "ghost"}
                onClick={() => onNavigate('/patient/pharmacy/wishlist')}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Wishlist
              </Button>

              <Button
                variant={isActive('/patient/pharmacy/health-tips') ? "default" : "ghost"}
                onClick={() => onNavigate('/patient/pharmacy/health-tips')}
                className="flex items-center gap-2"
              >
                <Pill className="h-4 w-4" />
                Health Tips
              </Button>

              <Button
                variant={isActive('/patient/pharmacy/cart') ? "default" : "ghost"}
                onClick={() => onNavigate('/patient/pharmacy/cart')}
                className="flex items-center gap-2 relative"
              >
                <ShoppingCart className="h-4 w-4" />
                Cart
                {getCartItemCount() > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>

              <Button
                variant={isActive('/patient/pharmacy/checkout') ? "default" : "ghost"}
                onClick={() => onNavigate('/patient/pharmacy/checkout')}
                disabled={cart.length === 0}
                className="flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                Checkout
              </Button>

              <Button
                variant={isActive('/patient/pharmacy/orders') ? "default" : "ghost"}
                onClick={() => onNavigate('/patient/pharmacy/orders')}
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Orders
              </Button>
            </nav>

            {/* Cart Summary */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {getCartItemCount()} items in cart
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Pill className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-blue-600">HYNO Pharmacy</span>
              </div>
              <p className="text-gray-600 mb-4">
                Your trusted online pharmacy for quality medicines and healthcare products.
                We ensure safe, reliable, and convenient healthcare solutions.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong>Address:</strong> 123 Healthcare St, Medical City, MC 12345</p>
                <p><strong>Phone:</strong> +1-800-123-4567</p>
                <p><strong>Email:</strong> support@hyno.com</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-gray-600 hover:text-blue-600"
                    onClick={() => onNavigate('/patient/pharmacy')}
                  >
                    Home
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-gray-600 hover:text-blue-600"
                    onClick={() => onNavigate('/patient/pharmacy/medicine')}
                  >
                    Medicines
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-gray-600 hover:text-blue-600"
                    onClick={() => onNavigate('/patient/pharmacy/cart')}
                  >
                    Shopping Cart
                  </Button>
                </li>
                <li>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-gray-600 hover:text-blue-600"
                    onClick={() => onNavigate('/patient/pharmacy/orders')}
                  >
                    Order History
                  </Button>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
                    Privacy Policy
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
                    Terms of Service
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
                    FAQ
                  </Button>
                </li>
                <li>
                  <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-blue-600">
                    Contact Us
                  </Button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              © 2024 HYNO Healthcare. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-600">Follow us:</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="p-2">
                  <span className="text-xs">FB</span>
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <span className="text-xs">TW</span>
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <span className="text-xs">IG</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

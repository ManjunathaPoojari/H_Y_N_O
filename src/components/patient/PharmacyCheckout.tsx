import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Pill, MapPin, CreditCard, Truck, Smartphone, Banknote, ShoppingCart, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { toast } from 'sonner';
import { orderAPI } from '../../lib/api-client';

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

interface PharmacyCheckoutProps {
  cart: CartItem[];
  onNavigate: (path: string) => void;
  onOrderPlaced: () => void;
}

interface Address {
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export const PharmacyCheckout: React.FC<PharmacyCheckoutProps> = ({
  cart,
  onNavigate,
  onOrderPlaced
}) => {
  const [address, setAddress] = useState<Address>({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [upiId, setUpiId] = useState<string>('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [paymentErrors, setPaymentErrors] = useState<{[key: string]: string}>({});

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.medicine.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const validateAddress = () => {
    const required = ['name', 'phone', 'email', 'street', 'city', 'state', 'pincode'];
    return required.every(field => address[field as keyof Address].trim() !== '');
  };

  const validatePaymentDetails = () => {
    const errors: {[key: string]: string} = {};

    if (paymentMethod === 'upi') {
      if (!upiId.trim()) {
        errors.upiId = 'UPI ID is required';
      } else if (!upiId.includes('@')) {
        errors.upiId = 'Please enter a valid UPI ID (e.g., user@paytm)';
      }
    } else if (paymentMethod === 'debit') {
      if (!cardDetails.number.trim()) {
        errors.cardNumber = 'Card number is required';
      } else if (cardDetails.number.replace(/\s/g, '').length < 13) {
        errors.cardNumber = 'Please enter a valid card number';
      }

      if (!cardDetails.expiry.trim()) {
        errors.cardExpiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        errors.cardExpiry = 'Please enter expiry in MM/YY format';
      }

      if (!cardDetails.cvv.trim()) {
        errors.cardCvv = 'CVV is required';
      } else if (cardDetails.cvv.length < 3) {
        errors.cardCvv = 'CVV must be 3 digits';
      }

      if (!cardDetails.name.trim()) {
        errors.cardName = 'Cardholder name is required';
      }
    }

    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      toast.error('Please fill in all address fields');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!validatePaymentDetails()) {
      toast.error('Please correct the payment details');
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Get current user ID from localStorage (optional for orders)
      const userId = localStorage.getItem('userId');

      // Prepare order data (patientId and patientName are required)
      const orderData = {
        patientId: userId || 'PAT001', // Default patient ID if not logged in
        patientName: address.name || 'Unknown Patient', // Use the name from address
        orderItems: cart.map(item => ({
          medicineId: item.medicine.id,
          medicineName: item.medicine.name,
          quantity: item.quantity,
          price: item.medicine.price
        })),
        totalAmount: getTotalPrice(),
        paymentMethod,
        deliveryAddress: JSON.stringify(address), // Serialize address to JSON string
        paymentDetails: paymentMethod === 'upi' ? { upiId } : paymentMethod === 'debit' ? cardDetails : null
      };

      // Place the order via API
      await orderAPI.create(orderData);

      toast.success('Order placed successfully!');
      onOrderPlaced();
    } catch (error: any) {
      console.error('Error placing order:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to place order. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      onNavigate('/patient/pharmacy/cart');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
        <p className="text-gray-600 mb-4">Add some medicines to proceed to checkout</p>
        <Button onClick={() => onNavigate('/patient/pharmacy')}>
          Browse Medicines
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600">{getCartItemCount()} items in your order</p>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          <Pill className="h-4 w-4 mr-2" />
          {getCartItemCount()} items
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Cart Summary & Address */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.medicine.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Pill className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.medicine.name}</h4>
                    <p className="text-xs text-gray-600">₹{item.medicine.price.toFixed(2)} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">Qty: {item.quantity}</p>
                    <p className="text-sm text-gray-600">₹{(item.medicine.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total:</span>
                <span className="text-2xl font-bold text-blue-600">₹{getTotalPrice().toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={address.name}
                    onChange={(e) => handleAddressChange('name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={address.phone}
                    onChange={(e) => handleAddressChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={address.email}
                  onChange={(e) => handleAddressChange('email', e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <Label htmlFor="street">Street Address *</Label>
                <Textarea
                  id="street"
                  value={address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  placeholder="Enter your street address"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={address.pincode}
                    onChange={(e) => handleAddressChange('pincode', e.target.value)}
                    placeholder="Pincode"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Payment Options */}
        <div className="space-y-6">
          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="space-y-4">
                  {/* Cash on Delivery */}
                  <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Banknote className="h-5 w-5 text-green-600" />
                        <div className="flex-1">
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-gray-600">Pay ₹{getTotalPrice().toFixed(2)} in cash upon delivery</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">Most Popular</Badge>
                      </Label>
                    </div>
                    {paymentMethod === 'cod' && (
                      <div className="mt-3 pl-8 text-sm text-gray-600 space-y-1">
                        <p>• No online payment needed</p>
                        <p>• Delivered in 2-3 days</p>
                        <p>• Exact change recommended</p>
                      </div>
                    )}
                  </div>

                  {/* UPI Payment */}
                  <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'upi' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Smartphone className="h-5 w-5 text-blue-600" />
                        <div className="flex-1">
                          <div className="font-medium">UPI Payment</div>
                          <div className="text-sm text-gray-600">Pay using UPI apps like Google Pay, PhonePe</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">Fast & Secure</Badge>
                      </Label>
                    </div>
                    {paymentMethod === 'upi' && (
                      <div className="mt-3 space-y-3">
                        <div className="pl-8 text-sm text-gray-600 space-y-1">
                          <p>• Secure & instant payment</p>
                          <p>• No extra charges</p>
                          <p>• Supported apps: Google Pay, PhonePe, Paytm</p>
                        </div>
                        <div className="pl-8">
                          <Label htmlFor="upi-id" className="text-sm font-medium">UPI ID *</Label>
                          <Input
                            id="upi-id"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="user@paytm"
                            className={paymentErrors.upiId ? 'border-red-500' : ''}
                          />
                          {paymentErrors.upiId && (
                            <p className="text-sm text-red-600 mt-1">{paymentErrors.upiId}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Debit Card */}
                  <div className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    paymentMethod === 'debit' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="debit" id="debit" />
                      <Label htmlFor="debit" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                        <div className="flex-1">
                          <div className="font-medium">Debit Card</div>
                          <div className="text-sm text-gray-600">Pay using your debit card</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">Accepted Worldwide</Badge>
                      </Label>
                    </div>
                    {paymentMethod === 'debit' && (
                      <div className="mt-3 space-y-3">
                        <div className="pl-8 text-sm text-gray-600 space-y-1">
                          <p>• Secure payment gateway</p>
                          <p>• ₹{(getTotalPrice() * 0.02).toFixed(2)} processing fee may apply</p>
                          <p>• Accepted cards: Visa, Mastercard, RuPay</p>
                        </div>
                        <div className="pl-8 grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <Label htmlFor="card-number" className="text-sm font-medium">Card Number *</Label>
                            <Input
                              id="card-number"
                              value={cardDetails.number}
                              onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              className={paymentErrors.cardNumber ? 'border-red-500' : ''}
                            />
                            {paymentErrors.cardNumber && (
                              <p className="text-sm text-red-600 mt-1">{paymentErrors.cardNumber}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="card-expiry" className="text-sm font-medium">Expiry (MM/YY) *</Label>
                            <Input
                              id="card-expiry"
                              value={cardDetails.expiry}
                              onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                              placeholder="12/25"
                              maxLength={5}
                              className={paymentErrors.cardExpiry ? 'border-red-500' : ''}
                            />
                            {paymentErrors.cardExpiry && (
                              <p className="text-sm text-red-600 mt-1">{paymentErrors.cardExpiry}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="card-cvv" className="text-sm font-medium">CVV *</Label>
                            <Input
                              id="card-cvv"
                              type="password"
                              value={cardDetails.cvv}
                              onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                              placeholder="123"
                              maxLength={3}
                              className={paymentErrors.cardCvv ? 'border-red-500' : ''}
                            />
                            {paymentErrors.cardCvv && (
                              <p className="text-sm text-red-600 mt-1">{paymentErrors.cardCvv}</p>
                            )}
                          </div>
                          <div className="col-span-2">
                            <Label htmlFor="card-name" className="text-sm font-medium">Cardholder Name *</Label>
                            <Input
                              id="card-name"
                              value={cardDetails.name}
                              onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="John Doe"
                              className={paymentErrors.cardName ? 'border-red-500' : ''}
                            />
                            {paymentErrors.cardName && (
                              <p className="text-sm text-red-600 mt-1">{paymentErrors.cardName}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </RadioGroup>

              {/* Payment Summary */}
              {paymentMethod && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Payment Summary</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>Method: {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'upi' ? 'UPI Payment' : 'Debit Card'}</p>
                    <p>Total: ₹{getTotalPrice().toFixed(2)}</p>
                    {paymentMethod === 'debit' && <p>Processing Fee: ₹{(getTotalPrice() * 0.02).toFixed(2)}</p>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Confirmation */}
          <Card>
            <CardHeader>
              <CardTitle>Order Confirmation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 space-y-2">
                <p>• Your order will be delivered within 2-3 business days</p>
                <p>• You will receive an SMS and email confirmation</p>
                <p>• Track your order in the Orders section</p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleCancelOrder}
                  className="flex-1"
                  disabled={isPlacingOrder}
                >
                  Cancel Order
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  className="flex-1"
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? 'Placing Order...' : 'Confirm Order'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

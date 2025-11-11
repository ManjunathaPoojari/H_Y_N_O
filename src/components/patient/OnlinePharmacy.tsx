import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { medicineAPI, orderAPI } from '../../lib/api-client';
import { useAuth } from '../../lib/auth-context';
import { ShoppingCart, Pill, CreditCard, Truck, Plus, Minus, Trash2, Search } from 'lucide-react';

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

export const OnlinePharmacy = () => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('medicines');

  // Checkout form state
  const [checkoutData, setCheckoutData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    notes: ''
  });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

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

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.medicine.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckout = async () => {
    if (!user) return;

    setPlacingOrder(true);
    try {
      const orderItems = cart.map(item => ({
        medicineId: item.medicine.id,
        quantity: item.quantity,
        price: item.medicine.price
      }));

      const order = {
        patientId: user.id,
        patientName: user.name || user.email,
        total: getTotalPrice(),
        items: orderItems,
        deliveryAddress: `${checkoutData.address}, ${checkoutData.city}, ${checkoutData.state} ${checkoutData.zipCode}`,
        phone: checkoutData.phone,
        paymentMethod: checkoutData.paymentMethod,
        notes: checkoutData.notes
      };

      await orderAPI.create(order);
      setOrderPlaced(true);
      setCart([]);
      setActiveTab('medicines');
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to place order. Please try again.';
      alert(errorMessage);
    } finally {
      setPlacingOrder(false);
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
          <p className="text-gray-600">Order medicines online with prescription delivery</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="px-3 py-1">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {getCartItemCount()} items
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="medicines" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Medicines
          </TabsTrigger>
          <TabsTrigger value="cart" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Cart ({getCartItemCount()})
          </TabsTrigger>
          <TabsTrigger value="checkout" className="flex items-center gap-2" disabled={cart.length === 0}>
            <CreditCard className="h-4 w-4" />
            Checkout
          </TabsTrigger>
        </TabsList>

        {/* Medicines Tab */}
        <TabsContent value="medicines" className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Medicines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((medicine) => (
              <Card key={medicine.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <Pill className="h-12 w-12 text-gray-400" />
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
                      onClick={() => addToCart(medicine)}
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
        </TabsContent>

        {/* Cart Tab */}
        <TabsContent value="cart" className="space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600">Add some medicines to get started</p>
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
                          onClick={() => updateQuantity(item.medicine.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.medicine.id, item.quantity + 1)}
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
                        onClick={() => removeFromCart(item.medicine.id)}
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

              <Button
                onClick={() => setActiveTab('checkout')}
                className="w-full"
                size="lg"
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Checkout Tab */}
        <TabsContent value="checkout" className="space-y-6">
          {orderPlaced ? (
            <Alert>
              <Truck className="h-4 w-4" />
              <AlertDescription>
                Order placed successfully! You will receive a confirmation email shortly.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.medicine.id} className="flex justify-between">
                      <span>{item.medicine.name} x{item.quantity}</span>
                      <span>₹{(item.medicine.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Checkout Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Delivery & Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="address">Delivery Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your full address"
                        value={checkoutData.address}
                        onChange={(e) => setCheckoutData(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={checkoutData.city}
                        onChange={(e) => setCheckoutData(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={checkoutData.state}
                        onChange={(e) => setCheckoutData(prev => ({ ...prev, state: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        value={checkoutData.zipCode}
                        onChange={(e) => setCheckoutData(prev => ({ ...prev, zipCode: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={checkoutData.phone}
                        onChange={(e) => setCheckoutData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                      value={checkoutData.paymentMethod}
                      onValueChange={(value) => setCheckoutData(prev => ({ ...prev, paymentMethod: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {checkoutData.paymentMethod === 'card' && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-3">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={checkoutData.cardNumber}
                          onChange={(e) => setCheckoutData(prev => ({ ...prev, cardNumber: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={checkoutData.expiryDate}
                          onChange={(e) => setCheckoutData(prev => ({ ...prev, expiryDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={checkoutData.cvv}
                          onChange={(e) => setCheckoutData(prev => ({ ...prev, cvv: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions..."
                      value={checkoutData.notes}
                      onChange={(e) => setCheckoutData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={placingOrder || !checkoutData.address || !checkoutData.phone}
                    className="w-full"
                    size="lg"
                  >
                    {placingOrder ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

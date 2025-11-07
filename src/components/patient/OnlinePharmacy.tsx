import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Search, ShoppingCart, Upload, Pill, Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import { useAppStore } from '../../lib/app-store';
import { useAuth } from '../../lib/auth-context';
import { toast } from 'sonner';

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'placed' | 'processing' | 'delivered' | 'cancelled';
}

interface CartItem {
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
  requiresPrescription: boolean;
}

export const OnlinePharmacy = () => {
  const { medicines, getPrescriptionsByPatient } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [category, setCategory] = useState<string>('all');
  const [view, setView] = useState<'catalog'|'orders'|'prescriptions'|'offers'>('catalog');
  const [orders, setOrders] = useState<Order[]>([]);

  const { user } = useAuth();

  const categories = ['All', ...new Set(medicines.map(m => m.category))];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || medicine.category === category;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicine: typeof medicines[0]) => {
    const existingItem = cart.find(item => item.medicineId === medicine.id);
    
    if (medicine.requiresPrescription && !prescriptionUploaded) {
      toast.error('Please upload prescription first for this medicine');
      return;
    }

    if (existingItem) {
      setCart(cart.map(item => 
        item.medicineId === medicine.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        medicineId: medicine.id,
        name: medicine.name,
        price: medicine.price,
        quantity: 1,
        requiresPrescription: medicine.requiresPrescription,
      }]);
    }
    toast.success(`${medicine.name} added to cart`);
  };

  const updateQuantity = (medicineId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.medicineId === medicineId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (medicineId: string) => {
    setCart(cart.filter(item => item.medicineId !== medicineId));
    toast.success('Item removed from cart');
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    const requiresPrescription = cart.some(item => item.requiresPrescription);
    if (requiresPrescription && !prescriptionUploaded) {
      toast.error('Please upload prescription for prescription medicines');
      return;
    }

    toast.success('Order placed successfully! You will receive confirmation email shortly.');
    // Create a lightweight order record for session
    const deliveryCharge = calculateTotal() > 500 ? 0 : 50;
    const newOrder: Order = {
      id: `ORD${String(orders.length + 1).padStart(4, '0')}`,
      items: cart,
      total: calculateTotal() + deliveryCharge,
      date: new Date().toISOString(),
      status: 'placed',
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
  };

  const handlePrescriptionUpload = () => {
    setPrescriptionUploaded(true);
    toast.success('Prescription uploaded successfully');
  };

  const prescriptionsForUser = user ? getPrescriptionsByPatient(user.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Online Pharmacy</h1>
        <p className="text-gray-600">Order medicines with prescription upload and home delivery</p>
      </div>

      {/* Top-level Pharmacy Tabs: Catalog / Orders / Prescriptions / Offers */}
      <div>
  <Tabs value={view} onValueChange={(v: string) => setView(v as 'catalog'|'orders'|'prescriptions'|'offers')}>
          <TabsList className="w-full max-w-md">
            <TabsTrigger value="catalog">Catalog</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            <TabsTrigger value="offers">Offers</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Catalog View */}
      {view === 'catalog' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Medicines Catalog */}
          <div className="lg:col-span-2 space-y-4">
          {/* Upload Prescription */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Upload className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="text-sm">Upload Prescription</h4>
                    <p className="text-xs text-gray-500">Required for prescription medicines</p>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={prescriptionUploaded ? "outline" : "default"}>
                      {prescriptionUploaded ? 'Uploaded ✓' : 'Upload'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upload Prescription</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                        <Input type="file" className="mt-4" accept=".pdf,.jpg,.jpeg,.png" />
                      </div>
                      <div className="space-y-2">
                        <Label>Patient ID</Label>
                        <Input placeholder="Enter Patient ID" defaultValue="P001" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handlePrescriptionUpload}>Upload Prescription</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Tabs value={category} onValueChange={setCategory}>
                <TabsList className="w-full justify-start overflow-x-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  {categories.filter(c => c !== 'All').map(cat => (
                    <TabsTrigger key={cat} value={cat}>{cat}</TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Medicines Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredMedicines.map((medicine) => (
              <Card key={medicine.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Pill className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="mb-1">{medicine.name}</h4>
                        <p className="text-xs text-gray-500">{medicine.manufacturer}</p>
                      </div>
                    </div>
                    <Badge variant={medicine.stock > 0 ? 'default' : 'destructive'}>
                      {medicine.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{medicine.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg">₹{medicine.price}</p>
                      {medicine.requiresPrescription && (
                        <Badge variant="outline" className="text-xs mt-1">Rx Required</Badge>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => addToCart(medicine)}
                      disabled={medicine.stock === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMedicines.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No medicines found
              </CardContent>
            </Card>
          )}
          </div>

          {/* Shopping Cart */}
          <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Shopping Cart</span>
                <Badge variant="secondary">{cart.length} items</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length > 0 ? (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.medicineId} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-sm mb-1">{item.name}</h4>
                            <p className="text-sm text-gray-600">₹{item.price} each</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.medicineId)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.medicineId, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-8 text-center">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.medicineId, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery</span>
                      <span>{calculateTotal() > 500 ? 'FREE' : '₹50'}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span>Total</span>
                      <span className="text-lg">₹{calculateTotal() + (calculateTotal() > 500 ? 0 : 50)}</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Button>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Your cart is empty</p>
                </div>
              )}
            </CardContent>
          </Card>
          </div>
        </div>
      )}

      {/* Orders View */}
      {view === 'orders' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-gray-500 py-8 text-center">You have no orders yet.</div>
                ) : (
                  <div className="space-y-3">
                    {orders.map(order => (
                      <div key={order.id} className="border rounded-md p-3">
                        <div className="flex justify-between mb-2">
                          <div>
                            <div className="font-medium">Order {order.id}</div>
                            <div className="text-xs text-gray-500">{new Date(order.date).toLocaleString()}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">₹{order.total}</div>
                            <div className="text-xs text-gray-500 capitalize">{order.status}</div>
                          </div>
                        </div>
                        <div className="text-sm">
                          {order.items.map(i => (
                            <div key={i.medicineId} className="flex justify-between">
                              <span>{i.name} x{i.quantity}</span>
                              <span>₹{i.price * i.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">Select an order to view details.</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Prescriptions View */}
      {view === 'prescriptions' && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Prescriptions</CardTitle>
              </CardHeader>
              <CardContent>
                {prescriptionsForUser.length === 0 ? (
                  <div className="text-gray-500 py-8 text-center">No prescriptions found.</div>
                ) : (
                  <div className="space-y-3">
                    {prescriptionsForUser.map(p => (
                      <div key={p.id} className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">Prescription</div>
                            <div className="text-xs text-gray-500">Issued: {new Date(p.date).toLocaleDateString()}</div>
                          </div>
                          <div className="text-sm">Rx ID: {p.id}</div>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <div className="font-medium">Diagnosis</div>
                          <div className="text-sm text-gray-600">{p.diagnosis}</div>
                          <div className="mt-2 font-medium">Medicines</div>
                          <ul className="list-disc ml-5 text-sm text-gray-700">
                            {p.medicines.map(m => (
                              <li key={m.medicineId}>{m.medicineName} — {m.dosage} ({m.duration})</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Upload / Manage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">Upload new prescriptions or view upload status here.</div>
                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Upload Prescription</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Prescription</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                          <Input type="file" className="mt-4" accept=".pdf,.jpg,.jpeg,.png" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handlePrescriptionUpload}>Upload Prescription</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Offers View (placeholder) */}
      {view === 'offers' && (
        <Card>
          <CardContent>
            <h3 className="text-lg font-medium mb-2">Offers & Promotions</h3>
            <p className="text-sm text-gray-600">No current offers. Check back later.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

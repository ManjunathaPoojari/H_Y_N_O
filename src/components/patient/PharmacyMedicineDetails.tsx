import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Separator } from '../ui/separator';
import { medicineAPI } from '../../lib/api-client';
import { useAuth } from '../../lib/auth-context';
import {
  Pill, ArrowLeft, Heart, Share2, Star, Plus, Minus, ShoppingCart,
  Info, AlertTriangle, Clock, Shield, Truck
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
  category?: string;
  imageUrl?: string;
  prescriptionRequired: string;
  usageInstructions?: string;
  sideEffects?: string;
  warnings?: string;
  storageInstructions?: string;
  expiryDate?: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface PharmacyMedicineDetailsProps {
  medicineId: string;
  onNavigate: (path: string) => void;
  onAddToCart: (medicine: Medicine) => void;
  cartItemCount: number;
}

export const PharmacyMedicineDetails: React.FC<PharmacyMedicineDetailsProps> = ({
  medicineId,
  onNavigate,
  onAddToCart,
  cartItemCount
}) => {
  const { user } = useAuth();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchMedicineDetails();
    fetchReviews();
  }, [medicineId]);

  const fetchMedicineDetails = async () => {
    try {
      const data = await medicineAPI.getById(medicineId);
      setMedicine(data);
    } catch (error) {
      console.error('Error fetching medicine details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      // Mock reviews data - replace with actual API call
      setReviews([
        {
          id: '1',
          userId: 'user1',
          userName: 'John Doe',
          rating: 5,
          comment: 'Very effective medication. Fast delivery and good packaging.',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          userId: 'user2',
          userName: 'Jane Smith',
          rating: 4,
          comment: 'Good quality medicine. Took a bit longer than expected for delivery.',
          createdAt: '2024-01-10'
        }
      ]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = () => {
    if (medicine) {
      for (let i = 0; i < quantity; i++) {
        onAddToCart(medicine);
      }
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Implement wishlist API call
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="text-center py-12">
        <Pill className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Medicine not found</h3>
        <Button onClick={() => onNavigate('/patient/pharmacy')}>
          Back to Pharmacy
        </Button>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => onNavigate('/patient/pharmacy/medicine')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Medicines
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            <ShoppingCart className="h-4 w-4 mr-2" />
            {cartItemCount} items in cart
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Medicine Image & Basic Info */}
        <Card>
          <CardContent className="p-6">
            <div className="aspect-square bg-gray-100 rounded-lg mb-6 flex items-center justify-center overflow-hidden">
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
                      parent.innerHTML = '<div class="flex items-center justify-center w-full h-full"><svg class="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg></div>';
                    }
                  }}
                />
              ) : (
                <Pill className="h-24 w-24 text-gray-400" />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{medicine.name}</h1>
                <p className="text-gray-600">{medicine.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(Math.round(averageRating))}
                  <span className="text-sm text-gray-600 ml-2">
                    {averageRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">
                  ₹{medicine.price.toFixed(2)}
                </span>
                <Badge variant={medicine.stockQuantity > 0 ? "secondary" : "destructive"}>
                  {medicine.stockQuantity > 0 ? `${medicine.stockQuantity} in stock` : 'Out of stock'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Form</p>
                  <p className="font-medium">{medicine.dosageForm}</p>
                </div>
                <div>
                  <p className="text-gray-600">Strength</p>
                  <p className="font-medium">{medicine.strength}</p>
                </div>
                <div>
                  <p className="text-gray-600">Manufacturer</p>
                  <p className="font-medium">{medicine.manufacturer}</p>
                </div>
                <div>
                  <p className="text-gray-600">Category</p>
                  <p className="font-medium">{medicine.category || 'General'}</p>
                </div>
              </div>

              {medicine.prescriptionRequired === 'YES' && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Prescription required for this medicine
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Purchase Section */}
        <Card>
          <CardHeader>
            <CardTitle>Add to Cart</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(medicine.stockQuantity, quantity + 1))}
                  disabled={quantity >= medicine.stockQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-600">
                Max: {medicine.stockQuantity}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddToCart}
                disabled={medicine.stockQuantity === 0}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Cart - ₹{(medicine.price * quantity).toFixed(2)}
              </Button>
              <Button
                variant="outline"
                onClick={toggleWishlist}
                className={isWishlisted ? 'text-red-600' : ''}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Free delivery on orders above ₹500</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>100% genuine medicines</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Usually delivered in 2-3 days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Card>
        <CardContent className="p-0">
          <div className="border-b">
            <nav className="flex">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'usage', label: 'Usage & Dosage' },
                { id: 'side-effects', label: 'Side Effects' },
                { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{medicine.description}</p>
                </div>

                {medicine.usageInstructions && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Usage Instructions</h3>
                    <p className="text-gray-600">{medicine.usageInstructions}</p>
                  </div>
                )}

                {medicine.storageInstructions && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Storage Instructions</h3>
                    <p className="text-gray-600">{medicine.storageInstructions}</p>
                  </div>
                )}

                {medicine.expiryDate && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Expiry Date</h3>
                    <p className="text-gray-600">{medicine.expiryDate}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">How to Use</h3>
                  <p className="text-gray-600">
                    {medicine.usageInstructions || 'Usage instructions not available. Please consult your doctor or pharmacist.'}
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Always follow your doctor's instructions for dosage and usage. Do not exceed recommended dosage.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {activeTab === 'side-effects' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Possible Side Effects</h3>
                  <p className="text-gray-600">
                    {medicine.sideEffects || 'Side effects information not available. Please consult your doctor for detailed information.'}
                  </p>
                </div>

                {medicine.warnings && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {medicine.warnings}
                    </AlertDescription>
                  </Alert>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    If you experience any unusual symptoms, stop taking the medication and consult your doctor immediately.
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <Button variant="outline" size="sm">
                    Write a Review
                  </Button>
                </div>

                {reviews.length === 0 ? (
                  <p className="text-gray-600">No reviews yet. Be the first to review this medicine!</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{review.userName}</span>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Check, Star, Award, Users, Mail, Phone, MapPin, ChevronLeft, ChevronRight, Calendar, Clock, QrCode } from 'lucide-react';
import { useNotifications } from '../../lib/notification-context';

interface PremiumPlansProps {
  onNavigate: (path: string) => void;
}

export const PremiumPlans: React.FC<PremiumPlansProps> = ({ onNavigate }) => {
  const { addNotification } = useNotifications();
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setShowPaymentDialog(true);
  };

  const handlePaymentComplete = () => {
    setPaymentCompleted(true);
    setTimeout(() => {
      setShowPaymentDialog(false);
      setSelectedPlan(null);
      setPaymentCompleted(false);
    }, 3000);
  };

  const plans = [
    {
      name: 'Go Free',
      price: 'Free',
      features: [
        'Basic meal suggestions',
        'Limited recipe access',
        'Basic nutrition tracking',
        'Access to community forum',
        'Daily nutrition tips',
        'Basic progress tracking'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Basic Plan',
      price: '₹799/month',
      features: [
        'Personalized meal suggestions based on user profile',
        'Basic daily nutrition tracking',
        'Access to a library of healthy recipes',
        'Weekly progress reports'
      ],
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Advanced Plan',
      price: '₹1599/month',
      features: [
        'All Basic features',
        'One-on-one virtual coaching sessions (2 per month)',
        'Advanced analytics and insights on nutrition data',
        'Custom meal plans tailored to goals (e.g., weight loss, muscle gain)'
      ],
      color: 'from-blue-500 to-blue-600'
    }
  ];

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Plans</h1>
      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className={`bg-gradient-to-r ${plan.color} text-white`}>
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <div className="text-2xl font-bold">{plan.price}</div>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button onClick={() => handleSelectPlan(plan)} className="w-full">
                Select Plan
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
          </DialogHeader>
          {paymentCompleted ? (
            <div className="text-center">
              <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Payment Successful!</h3>
              <p className="text-gray-600">Thank you for subscribing to {selectedPlan?.name}.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <Input placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <Input placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <Input placeholder="123" />
                </div>
              </div>
              <Button onClick={handlePaymentComplete} className="w-full">
                Pay {selectedPlan?.price}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, Heart, Droplets, Clock, Shield, Pill, Activity } from 'lucide-react';

interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'medication' | 'lifestyle' | 'prevention';
  icon: string;
  readTime: number;
}

interface PharmacyHealthTipsProps {
  onNavigate: (path: string) => void;
}

export const PharmacyHealthTips: React.FC<PharmacyHealthTipsProps> = ({
  onNavigate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const healthTips: HealthTip[] = [
    {
      id: '1',
      title: 'Stay Hydrated',
      content: 'Drink at least 8 glasses of water daily for better health. Proper hydration helps maintain body temperature, keeps joints healthy, and prevents infections.',
      category: 'lifestyle',
      icon: 'droplets',
      readTime: 1
    },
    {
      id: '2',
      title: 'Medication Timing',
      content: 'Take your medications at the same time each day to maintain consistent levels in your body. Set reminders on your phone to help you remember.',
      category: 'medication',
      icon: 'clock',
      readTime: 1
    },
    {
      id: '3',
      title: 'Read Labels Carefully',
      content: 'Always read the medication label and follow dosage instructions carefully. Pay attention to warnings, side effects, and interactions with other medications.',
      category: 'medication',
      icon: 'shield',
      readTime: 2
    },
    {
      id: '4',
      title: 'Proper Storage',
      content: 'Store medicines in a cool, dry place away from direct sunlight. Keep them in their original containers and out of reach of children.',
      category: 'general',
      icon: 'pill',
      readTime: 1
    },
    {
      id: '5',
      title: 'Regular Exercise',
      content: 'Engage in at least 30 minutes of moderate exercise daily. Walking, swimming, or cycling can improve cardiovascular health and boost your immune system.',
      category: 'lifestyle',
      icon: 'activity',
      readTime: 2
    },
    {
      id: '6',
      title: 'Healthy Diet',
      content: 'Include plenty of fruits, vegetables, whole grains, and lean proteins in your diet. Limit processed foods, sugary drinks, and excessive salt intake.',
      category: 'lifestyle',
      icon: 'heart',
      readTime: 2
    },
    {
      id: '7',
      title: 'Sleep Well',
      content: 'Aim for 7-9 hours of quality sleep each night. Good sleep helps your body repair itself and strengthens your immune system.',
      category: 'lifestyle',
      icon: 'clock',
      readTime: 1
    },
    {
      id: '8',
      title: 'Regular Check-ups',
      content: 'Schedule regular health check-ups with your doctor. Early detection of health issues can lead to more effective treatment.',
      category: 'prevention',
      icon: 'activity',
      readTime: 1
    }
  ];

  const categories = [
    { id: 'all', label: 'All Tips', icon: Heart },
    { id: 'medication', label: 'Medication', icon: Pill },
    { id: 'lifestyle', label: 'Lifestyle', icon: Activity },
    { id: 'prevention', label: 'Prevention', icon: Shield },
    { id: 'general', label: 'General', icon: Heart }
  ];

  const filteredTips = selectedCategory === 'all'
    ? healthTips
    : healthTips.filter(tip => tip.category === selectedCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'droplets': return <Droplets className="h-6 w-6" />;
      case 'clock': return <Clock className="h-6 w-6" />;
      case 'shield': return <Shield className="h-6 w-6" />;
      case 'pill': return <Pill className="h-6 w-6" />;
      case 'activity': return <Activity className="h-6 w-6" />;
      case 'heart': return <Heart className="h-6 w-6" />;
      default: return <Heart className="h-6 w-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication': return 'bg-blue-100 text-blue-800';
      case 'lifestyle': return 'bg-green-100 text-green-800';
      case 'prevention': return 'bg-purple-100 text-purple-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex(prev => (prev + 1) % filteredTips.length);
    }, 10000); // Change tip every 10 seconds

    return () => clearInterval(interval);
  }, [filteredTips.length]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => onNavigate('/patient/pharmacy')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pharmacy
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Tips</h1>
          <p className="text-gray-600">Stay healthy with our expert advice</p>
        </div>
      </div>

      {/* Featured Tip */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {getIcon(filteredTips[currentTipIndex]?.icon)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getCategoryColor(filteredTips[currentTipIndex]?.category)}>
                  {filteredTips[currentTipIndex]?.category}
                </Badge>
                <span className="text-sm text-gray-600">
                  {filteredTips[currentTipIndex]?.readTime} min read
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {filteredTips[currentTipIndex]?.title}
              </h3>
              <p className="text-gray-700">
                {filteredTips[currentTipIndex]?.content}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            className="flex items-center gap-2"
          >
            <category.icon className="h-4 w-4" />
            {category.label}
          </Button>
        ))}
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTips.map((tip) => (
          <Card key={tip.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getIcon(tip.icon)}
                  </div>
                  <Badge className={getCategoryColor(tip.category)}>
                    {tip.category}
                  </Badge>
                </div>
                <span className="text-sm text-gray-600">{tip.readTime} min</span>
              </div>
              <CardTitle className="text-lg">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm leading-relaxed">
                {tip.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Health Reminder */}
      <Alert>
        <Heart className="h-4 w-4" />
        <AlertDescription>
          <strong>Remember:</strong> These tips are for general health information only.
          Always consult your healthcare provider for personalized medical advice.
        </AlertDescription>
      </Alert>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ArrowLeft, ChefHat, Clock, Users, Star } from 'lucide-react';

interface MealKitsPageProps {
  onNavigate: (path: string) => void;
}

interface MealKit {
  id: number;
  name: string;
  condition: string;
  preference: string;
  duration: string;
  description: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  meals: {
    breakfast: Recipe;
    lunch: Recipe;
    snacks: Recipe[];
    dinner: Recipe;
  };
}

interface Recipe {
  name: string;
  image: string;
  ingredients: string[];
  procedure: string;
  prepTime: string;
  calories: number;
}

export const MealKitsPage: React.FC<MealKitsPageProps> = ({ onNavigate }) => {
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedPreference, setSelectedPreference] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedMealKit, setSelectedMealKit] = useState<MealKit | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const conditions = [
    { value: 'all', label: 'All Conditions' },
    { value: 'diabetes', label: 'Diabetes' },
    { value: 'hypertension', label: 'Hypertension' },
    { value: 'weight-loss', label: 'Weight Loss' },
    { value: 'digestive-issues', label: 'Digestive Issues' },
    { value: 'heart-health', label: 'Heart Health' },
    { value: 'kidney-disease', label: 'Kidney Disease' },
    { value: 'thyroid', label: 'Thyroid Disorders' },
    { value: 'pregnancy', label: 'Pregnancy' },
    { value: 'general', label: 'General Wellness' }
  ];

  const preferences = [
    { value: 'all', label: 'All Preferences' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'non-vegetarian', label: 'Non-Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten-Free' },
    { value: 'nut-free', label: 'Nut-Free' },
    { value: 'lactose-free', label: 'Lactose-Free' },
    { value: 'keto', label: 'Keto' },
    { value: 'low-carb', label: 'Low-Carb' },
    { value: 'mediterranean', label: 'Mediterranean' }
  ];

  const durations = [
    { value: 'all', label: 'All Durations' },
    { value: '1-week', label: '1 Week' },
    { value: '15-days', label: '15 Days' },
    { value: '30-days', label: '30 Days' },
    { value: '3-months', label: '3 Months' },
    { value: '6-months', label: '6 Months' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const mealKits: MealKit[] = [
    {
      id: 1,
      name: 'Diabetes Care Meal Kit',
      condition: 'diabetes',
      preference: 'vegetarian',
      duration: '1-week',
      description: 'Balanced meals designed for blood sugar management with controlled carbs and healthy fats.',
      rating: 4.8,
      reviews: 156,
      price: 2499,
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop',
      meals: {
        breakfast: {
          name: 'Oatmeal with Berries and Nuts',
          image: 'https://images.unsplash.com/photo-1505252585461-9044a396130f?w=300&h=200&fit=crop',
          ingredients: ['1/2 cup rolled oats', '1 cup almond milk', '1/2 cup mixed berries', '1 tbsp chia seeds', '1 tbsp almonds'],
          procedure: 'Cook oats in almond milk for 5 minutes. Top with berries, chia seeds, and almonds. Serve warm.',
          prepTime: '10 mins',
          calories: 280
        },
        lunch: {
          name: 'Grilled Chicken Salad with Quinoa',
          image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
          ingredients: ['4 oz grilled chicken breast', '1 cup mixed greens', '1/2 cup cooked quinoa', 'Cherry tomatoes', 'Cucumber', 'Olive oil dressing'],
          procedure: 'Grill chicken breast and slice. Mix greens, quinoa, tomatoes, and cucumber. Top with chicken and drizzle with dressing.',
          prepTime: '20 mins',
          calories: 350
        },
        snacks: [
          {
            name: 'Greek Yogurt with Seeds',
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=200&fit=crop',
            ingredients: ['1 cup Greek yogurt', '1 tbsp pumpkin seeds', '1 tbsp flaxseeds', 'Cinnamon'],
            procedure: 'Mix yogurt with seeds and sprinkle cinnamon on top.',
            prepTime: '5 mins',
            calories: 180
          },
          {
            name: 'Apple with Peanut Butter',
            image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop',
            ingredients: ['1 medium apple', '1 tbsp natural peanut butter'],
            procedure: 'Slice apple and spread peanut butter on slices.',
            prepTime: '5 mins',
            calories: 150
          }
        ],
        dinner: {
          name: 'Baked Salmon with Vegetables',
          image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop',
          ingredients: ['6 oz salmon fillet', '1 cup broccoli', '1 cup carrots', '1 tbsp olive oil', 'Lemon juice', 'Herbs'],
          procedure: 'Place salmon and vegetables on baking sheet. Drizzle with olive oil and lemon juice. Bake at 400°F for 20 minutes.',
          prepTime: '25 mins',
          calories: 380
        }
      }
    },
    {
      id: 2,
      name: 'Hypertension Control Kit',
      condition: 'hypertension',
      preference: 'vegan',
      duration: '15-days',
      description: 'Heart-healthy meals low in sodium with DASH diet principles for blood pressure management.',
      rating: 4.7,
      reviews: 89,
      price: 3999,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
      meals: {
        breakfast: {
          name: 'Smoothie Bowl with Fruits',
          image: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=300&h=200&fit=crop',
          ingredients: ['1 banana', '1 cup spinach', '1/2 cup berries', '1 cup almond milk', '1 tbsp chia seeds'],
          procedure: 'Blend all ingredients until smooth. Pour into bowl and top with chia seeds.',
          prepTime: '8 mins',
          calories: 220
        },
        lunch: {
          name: 'Quinoa Buddha Bowl',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
          ingredients: ['1/2 cup cooked quinoa', '1 cup mixed vegetables', '1/2 avocado', 'Lemon tahini dressing', 'Fresh herbs'],
          procedure: 'Arrange quinoa and vegetables in bowl. Top with avocado and drizzle with dressing.',
          prepTime: '15 mins',
          calories: 320
        },
        snacks: [
          {
            name: 'Fresh Fruit Salad',
            image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=300&h=200&fit=crop',
            ingredients: ['1 cup mixed fruits', '1 tbsp lemon juice', 'Fresh mint'],
            procedure: 'Chop fruits and mix with lemon juice. Garnish with mint.',
            prepTime: '10 mins',
            calories: 120
          }
        ],
        dinner: {
          name: 'Stir-Fried Tofu with Vegetables',
          image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
          ingredients: ['6 oz firm tofu', '2 cups mixed vegetables', '1 tbsp low-sodium soy sauce', 'Ginger', 'Garlic'],
          procedure: 'Cube tofu and stir-fry with vegetables and seasonings. Cook until vegetables are tender.',
          prepTime: '20 mins',
          calories: 280
        }
      }
    },
    {
      id: 3,
      name: 'Weight Loss Accelerator',
      condition: 'weight-loss',
      preference: 'non-vegetarian',
      duration: '30-days',
      description: 'Calorie-controlled meals with high protein content to support sustainable weight loss.',
      rating: 4.9,
      reviews: 234,
      price: 7499,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      meals: {
        breakfast: {
          name: 'Egg White Omelette',
          image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=300&h=200&fit=crop',
          ingredients: ['4 egg whites', 'Spinach', 'Tomatoes', 'Onions', 'Black pepper'],
          procedure: 'Whisk egg whites and pour into non-stick pan. Add chopped vegetables and cook until set.',
          prepTime: '12 mins',
          calories: 180
        },
        lunch: {
          name: 'Grilled Turkey Salad',
          image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
          ingredients: ['4 oz turkey breast', '2 cups lettuce', 'Cucumber', 'Carrots', 'Light vinaigrette'],
          procedure: 'Grill turkey and slice. Toss with vegetables and dressing.',
          prepTime: '18 mins',
          calories: 290
        },
        snacks: [
          {
            name: 'Protein Shake',
            image: 'https://images.unsplash.com/photo-1553909489-cd47e9c9b90c?w=300&h=200&fit=crop',
            ingredients: ['1 scoop protein powder', '1 cup water', 'Ice cubes'],
            procedure: 'Blend protein powder with water and ice.',
            prepTime: '3 mins',
            calories: 120
          }
        ],
        dinner: {
          name: 'Baked Chicken Breast',
          image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop',
          ingredients: ['6 oz chicken breast', 'Mixed herbs', 'Garlic powder', 'Steamed broccoli'],
          procedure: 'Season chicken with herbs and bake at 375°F for 25 minutes. Serve with steamed broccoli.',
          prepTime: '30 mins',
          calories: 320
        }
      }
    },
    {
      id: 4,
      name: 'Digestive Wellness Kit',
      condition: 'digestive-issues',
      preference: 'gluten-free',
      duration: '1-week',
      description: 'Gut-friendly meals with probiotics and easy-to-digest ingredients for digestive health.',
      rating: 4.6,
      reviews: 67,
      price: 2999,
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
      meals: {
        breakfast: {
          name: 'Chia Pudding',
          image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=200&fit=crop',
          ingredients: ['3 tbsp chia seeds', '1 cup coconut milk', '1/2 tsp vanilla', 'Berries'],
          procedure: 'Mix chia seeds with coconut milk and vanilla. Refrigerate overnight. Top with berries.',
          prepTime: '5 mins + overnight',
          calories: 240
        },
        lunch: {
          name: 'Rice and Vegetable Bowl',
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
          ingredients: ['1/2 cup brown rice', '1 cup steamed vegetables', '1 tbsp olive oil', 'Herbs'],
          procedure: 'Cook rice and steam vegetables. Mix together and drizzle with olive oil.',
          prepTime: '25 mins',
          calories: 280
        },
        snacks: [
          {
            name: 'Banana with Yogurt',
            image: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=300&h=200&fit=crop',
            ingredients: ['1 banana', '1/2 cup yogurt'],
            procedure: 'Slice banana and serve with yogurt.',
            prepTime: '5 mins',
            calories: 160
          }
        ],
        dinner: {
          name: 'Baked Sweet Potato',
          image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=300&h=200&fit=crop',
          ingredients: ['1 large sweet potato', '1 cup greens', '1 tbsp olive oil'],
          procedure: 'Bake sweet potato at 400°F for 45 minutes. Serve with sautéed greens.',
          prepTime: '50 mins',
          calories: 220
        }
      }
    },
    {
      id: 5,
      name: 'Heart Health Package',
      condition: 'heart-health',
      preference: 'mediterranean',
      duration: '3-months',
      description: 'Mediterranean-style meals rich in omega-3s and antioxidants for cardiovascular wellness.',
      rating: 4.8,
      reviews: 145,
      price: 18999,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
      meals: {
        breakfast: {
          name: 'Greek Yogurt Parfait',
          image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=200&fit=crop',
          ingredients: ['1 cup Greek yogurt', '1/2 cup granola', '1/2 cup berries', '1 tbsp honey'],
          procedure: 'Layer yogurt, granola, and berries in a glass. Drizzle with honey.',
          prepTime: '8 mins',
          calories: 320
        },
        lunch: {
          name: 'Mediterranean Salad',
          image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
          ingredients: ['2 cups mixed greens', 'Cherry tomatoes', 'Cucumber', 'Feta cheese', 'Olives', 'Olive oil dressing'],
          procedure: 'Combine all ingredients in a bowl and toss with dressing.',
          prepTime: '10 mins',
          calories: 280
        },
        snacks: [
          {
            name: 'Mixed Nuts',
            image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop',
            ingredients: ['1 oz almonds', '1 oz walnuts', '1 oz pistachios'],
            procedure: 'Mix nuts and portion into small serving.',
            prepTime: '2 mins',
            calories: 200
          }
        ],
        dinner: {
          name: 'Grilled Fish with Herbs',
          image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop',
          ingredients: ['6 oz white fish', 'Fresh herbs', 'Lemon', 'Olive oil', 'Quinoa'],
          procedure: 'Season fish with herbs and grill. Serve with lemon and cooked quinoa.',
          prepTime: '20 mins',
          calories: 340
        }
      }
    }
  ];

  const filteredMealKits = mealKits.filter(kit => {
    const conditionMatch = selectedCondition === 'all' || kit.condition === selectedCondition;
    const preferenceMatch = selectedPreference === 'all' || kit.preference === selectedPreference;
    const durationMatch = selectedDuration === 'all' || kit.duration === selectedDuration;
    return conditionMatch && preferenceMatch && durationMatch;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => onNavigate('/patient/nutrition')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Meal Kits</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Customize Your Meal Kit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Health Condition</label>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {conditions.map(condition => (
                    <SelectItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Food Preference</label>
              <Select value={selectedPreference} onValueChange={setSelectedPreference}>
                <SelectTrigger>
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  {preferences.map(preference => (
                    <SelectItem key={preference.value} value={preference.value}>
                      {preference.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map(duration => (
                    <SelectItem key={duration.value} value={duration.value}>
                      {duration.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Kits Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMealKits.map(kit => (
          <Card key={kit.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <img
                src={kit.image}
                alt={kit.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{kit.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{kit.description}</p>

                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{kit.rating}</span>
                  <span className="text-sm text-gray-500">({kit.reviews} reviews)</span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-green-600">₹{kit.price}</span>
                  <span className="text-sm text-gray-500">{kit.duration.replace('-', ' ')}</span>
                </div>

                <Button
                  className="w-full"
                  onClick={() => setSelectedMealKit(kit)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMealKits.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No meal kits found</h3>
          <p className="text-gray-500">Try adjusting your filters to see available options.</p>
        </div>
      )}

      {/* Meal Kit Detail Dialog */}
      <Dialog open={!!selectedMealKit} onOpenChange={() => setSelectedMealKit(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedMealKit?.name}</DialogTitle>
          </DialogHeader>

          {selectedMealKit && (
            <div className="space-y-6">
              <img
                src={selectedMealKit.image}
                alt={selectedMealKit.name}
                className="w-full h-64 object-cover rounded-lg"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Kit Details</h4>
                  <p className="text-gray-600 mb-2">{selectedMealKit.description}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{selectedMealKit.rating} ({selectedMealKit.reviews} reviews)</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">₹{selectedMealKit.price}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-2">Meal Plan Overview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Breakfast:</span>
                      <span className="font-medium">{selectedMealKit.meals.breakfast.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lunch:</span>
                      <span className="font-medium">{selectedMealKit.meals.lunch.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Snacks:</span>
                      <span className="font-medium">{selectedMealKit.meals.snacks.length} options</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dinner:</span>
                      <span className="font-medium">{selectedMealKit.meals.dinner.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meals Section */}
              <div className="space-y-6">
                {/* Breakfast */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Breakfast
                  </h4>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedRecipe(selectedMealKit.meals.breakfast)}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={selectedMealKit.meals.breakfast.image}
                          alt={selectedMealKit.meals.breakfast.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium">{selectedMealKit.meals.breakfast.name}</h5>
                          <p className="text-sm text-gray-600">{selectedMealKit.meals.breakfast.prepTime} • {selectedMealKit.meals.breakfast.calories} cal</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Lunch */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Lunch
                  </h4>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedRecipe(selectedMealKit.meals.lunch)}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={selectedMealKit.meals.lunch.image}
                          alt={selectedMealKit.meals.lunch.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium">{selectedMealKit.meals.lunch.name}</h5>
                          <p className="text-sm text-gray-600">{selectedMealKit.meals.lunch.prepTime} • {selectedMealKit.meals.lunch.calories} cal</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Snacks */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Snacks
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedMealKit.meals.snacks.map((snack, index) => (
                      <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedRecipe(snack)}>
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={snack.image}
                              alt={snack.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-sm">{snack.name}</h5>
                              <p className="text-xs text-gray-600">{snack.prepTime} • {snack.calories} cal</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Dinner */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Dinner
                  </h4>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedRecipe(selectedMealKit.meals.dinner)}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={selectedMealKit.meals.dinner.image}
                          alt={selectedMealKit.meals.dinner.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium">{selectedMealKit.meals.dinner.name}</h5>
                          <p className="text-sm text-gray-600">{selectedMealKit.meals.dinner.prepTime} • {selectedMealKit.meals.dinner.calories} cal</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8">
                  Order This Kit - ₹{selectedMealKit.price}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Recipe Detail Dialog */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{selectedRecipe?.name}</DialogTitle>
          </DialogHeader>

          {selectedRecipe && (
            <div className="space-y-4">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.name}
                className="w-full h-48 object-cover rounded-lg"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Nutrition Info</h4>
                  <p className="text-gray-600">{selectedRecipe.calories} calories</p>
                  <p className="text-gray-600">Prep time: {selectedRecipe.prepTime}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Ingredients</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-600">{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Instructions</h4>
                <p className="text-gray-600 leading-relaxed">{selectedRecipe.procedure}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

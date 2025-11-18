import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Heart, Search } from 'lucide-react';

interface HealthyRecipesProps {
  onNavigate: (path: string) => void;
}

export const HealthyRecipes: React.FC<HealthyRecipesProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({});

  const categories = [
    { id: 1, name: 'Diabetes' },
    { id: 2, name: 'Hypertension' },
    { id: 3, name: 'Weight Loss' },
    { id: 4, name: 'Digestive Issues' },
    { id: 5, name: 'Heart Health' }
  ];

  const recipes = [
    {
      id: 1,
      name: 'Quinoa Salad with Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      calories: 320,
      dietaryPrefs: ['Vegan', 'Gluten-Free'],
      categoryId: 1,
      ingredients: ['1 cup quinoa', '2 cups mixed vegetables', '1 tbsp olive oil', 'Lemon juice', 'Fresh herbs'],
      instructions: 'Cook quinoa according to package. Chop vegetables and mix with cooked quinoa. Dress with olive oil and lemon juice. Garnish with herbs.',
      prepTime: '20 mins'
    },
    {
      id: 2,
      name: 'Grilled Chicken with Broccoli',
      imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      calories: 280,
      dietaryPrefs: ['Low-Carb', 'High-Protein'],
      categoryId: 1,
      ingredients: ['4 oz chicken breast', '2 cups broccoli', '1 tbsp olive oil', 'Garlic powder', 'Salt and pepper'],
      instructions: 'Season chicken with garlic powder, salt, and pepper. Grill chicken until cooked through. Steam broccoli and serve together.',
      prepTime: '25 mins'
    },
    {
      id: 3,
      name: 'Oatmeal with Berries',
      imageUrl: 'https://images.unsplash.com/photo-1505252585461-9044a396130f?w=400&h=300&fit=crop',
      calories: 250,
      dietaryPrefs: ['Vegan', 'Gluten-Free'],
      categoryId: 1,
      ingredients: ['1/2 cup oats', '1 cup almond milk', '1/2 cup mixed berries', '1 tbsp chia seeds', 'Cinnamon'],
      instructions: 'Cook oats in almond milk. Top with berries, chia seeds, and cinnamon. Let sit for 5 minutes before serving.',
      prepTime: '10 mins'
    },
    {
      id: 4,
      name: 'Baked Salmon with Asparagus',
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
      calories: 350,
      dietaryPrefs: ['Omega-3 Rich', 'Low-Carb'],
      categoryId: 2,
      ingredients: ['6 oz salmon fillet', '1 bunch asparagus', '1 tbsp olive oil', 'Lemon slices', 'Herbs'],
      instructions: 'Place salmon and asparagus on baking sheet. Drizzle with olive oil and top with lemon slices. Bake at 400°F for 15-20 minutes.',
      prepTime: '30 mins'
    },
    {
      id: 5,
      name: 'Spinach and Mushroom Stir-Fry',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
      calories: 180,
      dietaryPrefs: ['Vegan', 'Low-Calorie'],
      categoryId: 2,
      ingredients: ['2 cups spinach', '1 cup mushrooms', '1 tbsp olive oil', 'Garlic', 'Soy sauce (low-sodium)'],
      instructions: 'Heat olive oil in pan. Add garlic and mushrooms, cook until tender. Add spinach and soy sauce. Stir until wilted.',
      prepTime: '15 mins'
    },
    {
      id: 6,
      name: 'Greek Yogurt Parfait',
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
      calories: 220,
      dietaryPrefs: ['Probiotic', 'High-Protein'],
      categoryId: 2,
      ingredients: ['1 cup Greek yogurt', '1/2 cup granola', '1/2 cup berries', '1 tbsp honey', 'Nuts'],
      instructions: 'Layer yogurt, granola, and berries in a glass. Drizzle with honey and top with nuts.',
      prepTime: '5 mins'
    },
    {
      id: 7,
      name: 'Turkey Lettuce Wraps',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      calories: 240,
      dietaryPrefs: ['Low-Carb', 'High-Protein'],
      categoryId: 3,
      ingredients: ['4 oz ground turkey', 'Large lettuce leaves', '1/2 cup vegetables', '1 tbsp soy sauce', 'Ginger'],
      instructions: 'Cook ground turkey with vegetables and seasonings. Spoon into lettuce leaves and roll up.',
      prepTime: '20 mins'
    },
    {
      id: 8,
      name: 'Zucchini Noodles with Pesto',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
      calories: 190,
      dietaryPrefs: ['Vegan', 'Low-Carb'],
      categoryId: 3,
      ingredients: ['2 zucchinis', '2 tbsp pesto', 'Cherry tomatoes', 'Basil leaves', 'Olive oil'],
      instructions: 'Spiralize zucchinis. Toss with pesto and halved tomatoes. Garnish with basil.',
      prepTime: '15 mins'
    },
    {
      id: 9,
      name: 'Chickpea Salad',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
      calories: 280,
      dietaryPrefs: ['Vegan', 'High-Fiber'],
      categoryId: 3,
      ingredients: ['1 can chickpeas', 'Cucumber', 'Tomatoes', 'Red onion', 'Lemon dressing'],
      instructions: 'Drain and rinse chickpeas. Chop vegetables and mix together. Dress with lemon juice and olive oil.',
      prepTime: '10 mins'
    },
    {
      id: 10,
      name: 'Ginger Tea with Lemon',
      imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop',
      calories: 30,
      dietaryPrefs: ['Caffeine-Free', 'Anti-Inflammatory'],
      categoryId: 4,
      ingredients: ['1 inch ginger', '1 cup water', 'Lemon slice', 'Honey (optional)'],
      instructions: 'Slice ginger and boil in water for 10 minutes. Add lemon slice and honey if desired.',
      prepTime: '15 mins'
    },
    {
      id: 11,
      name: 'Banana Oat Smoothie',
      imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e9c9b90c?w=400&h=300&fit=crop',
      calories: 200,
      dietaryPrefs: ['Vegan', 'Quick'],
      categoryId: 4,
      ingredients: ['1 banana', '1/2 cup oats', '1 cup almond milk', '1 tbsp peanut butter', 'Cinnamon'],
      instructions: 'Blend all ingredients until smooth. Serve immediately.',
      prepTime: '5 mins'
    },
    {
      id: 12,
      name: 'Sweet Potato Mash',
      imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=300&fit=crop',
      calories: 150,
      dietaryPrefs: ['Vegan', 'Gluten-Free'],
      categoryId: 4,
      ingredients: ['2 sweet potatoes', '1 tbsp olive oil', 'Salt', 'Pepper', 'Herbs'],
      instructions: 'Bake sweet potatoes until soft. Mash with olive oil and seasonings.',
      prepTime: '45 mins'
    },
    {
      id: 13,
      name: 'Avocado Toast with Eggs',
      imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
      calories: 320,
      dietaryPrefs: ['High-Protein', 'Healthy Fats'],
      categoryId: 5,
      ingredients: ['2 slices whole grain bread', '1 avocado', '2 eggs', 'Cherry tomatoes', 'Salt and pepper'],
      instructions: 'Toast bread and mash avocado on top. Poach eggs and place on avocado. Garnish with tomatoes.',
      prepTime: '15 mins'
    },
    {
      id: 14,
      name: 'Berry Smoothie Bowl',
      imageUrl: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop',
      calories: 250,
      dietaryPrefs: ['Antioxidant-Rich', 'Vegan'],
      categoryId: 5,
      ingredients: ['1 cup mixed berries', '1 banana', '1/2 cup yogurt', 'Granola', 'Chia seeds'],
      instructions: 'Blend berries, banana, and yogurt. Pour into bowl and top with granola and chia seeds.',
      prepTime: '10 mins'
    },
    {
      id: 15,
      name: 'Grilled Vegetable Skewers',
      imageUrl: 'https://images.unsplash.com/photo-1551782450-17144efb5723?w=400&h=300&fit=crop',
      calories: 180,
      dietaryPrefs: ['Vegan', 'Low-Calorie'],
      categoryId: 5,
      ingredients: ['Mixed vegetables', 'Olive oil', 'Herbs', 'Garlic', 'Lemon juice'],
      instructions: 'Cut vegetables into chunks and thread onto skewers. Brush with olive oil mixture and grill until tender.',
      prepTime: '25 mins'
    }
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || categories.find(cat => cat.id === recipe.categoryId)?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleLike = (recipeId: number) => {
    setLikes(prev => ({ ...prev, [recipeId]: !prev[recipeId] }));
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Healthy Recipes</h1>
        <p className="text-gray-600">Discover nutritious meal ideas tailored to your health needs</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Recipes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedRecipe(recipe)}>
            <CardContent className="p-0">
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{recipe.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(recipe.id);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Heart className={`h-5 w-5 ${likes[recipe.id] ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">{recipe.calories} cal</span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-600">{recipe.prepTime}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {recipe.dietaryPrefs.map((pref, index) => (
                    <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {pref}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {recipe.ingredients.join(', ')}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No recipes found matching your criteria.</p>
        </div>
      )}

      {/* Recipe Detail Dialog */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {selectedRecipe?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedRecipe && (
            <div className="space-y-6">
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.name}
                className="w-full h-64 object-cover rounded-lg"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Nutrition Info</h4>
                  <p className="text-gray-600">{selectedRecipe.calories} calories</p>
                  <p className="text-gray-600">Prep time: {selectedRecipe.prepTime}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Dietary Preferences</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedRecipe.dietaryPrefs.map((pref: string, index: number) => (
                      <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Ingredients</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedRecipe.ingredients.map((ingredient: string, index: number) => (
                    <li key={index} className="text-gray-600">{ingredient}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-lg mb-2">Instructions</h4>
                <p className="text-gray-600 leading-relaxed">{selectedRecipe.instructions}</p>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <Button
                  onClick={() => toggleLike(selectedRecipe.id)}
                  variant={likes[selectedRecipe.id] ? "default" : "outline"}
                  className={likes[selectedRecipe.id] ? "bg-red-500 hover:bg-red-600" : ""}
                >
                  <Heart className={`h-4 w-4 mr-2 ${likes[selectedRecipe.id] ? 'fill-current' : ''}`} />
                  {likes[selectedRecipe.id] ? 'Liked' : 'Like Recipe'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

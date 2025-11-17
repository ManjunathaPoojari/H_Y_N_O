import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Plus, Search, Filter, Clock, Users, ChefHat, Leaf, Wheat, Milk } from 'lucide-react';
import { apiClient } from '../../lib/api-client';

interface Recipe {
  id: number;
  name: string;
  description: string;
  category: string;
  cuisineType: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  ingredients: string[];
  instructions: string;
  caloriesPerServing: number;
  proteinGPerServing: number;
  carbsGPerServing: number;
  fatGPerServing: number;
  fiberGPerServing: number;
  sugarGPerServing: number;
  sodiumMgPerServing: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface RecipeFormData {
  name: string;
  description: string;
  category: string;
  cuisineType: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  ingredients: string[];
  instructions: string;
  caloriesPerServing: number;
  proteinGPerServing: number;
  carbsGPerServing: number;
  fatGPerServing: number;
  fiberGPerServing: number;
  sugarGPerServing: number;
  sodiumMgPerServing: number;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  imageUrl: string;
}

export const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [formData, setFormData] = useState<RecipeFormData>({
    name: '',
    description: '',
    category: '',
    cuisineType: '',
    prepTimeMinutes: 0,
    cookTimeMinutes: 0,
    servings: 1,
    difficulty: 'easy',
    ingredients: [''],
    instructions: '',
    caloriesPerServing: 0,
    proteinGPerServing: 0,
    carbsGPerServing: 0,
    fatGPerServing: 0,
    fiberGPerServing: 0,
    sugarGPerServing: 0,
    sodiumMgPerServing: 0,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isDairyFree: false,
    imageUrl: ''
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, selectedCategory, selectedCuisine, selectedDifficulty]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/api/nutrition/recipes');
      setRecipes(response.data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    if (selectedCuisine) {
      filtered = filtered.filter(recipe => recipe.cuisineType === selectedCuisine);
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
    }

    setFilteredRecipes(filtered);
  };

  const handleAddRecipe = async () => {
    try {
      await apiClient.post('/api/nutrition/recipes', formData);
      setShowAddDialog(false);
      resetForm();
      fetchRecipes();
    } catch (error) {
      console.error('Error adding recipe:', error);
    }
  };

  const handleEditRecipe = async () => {
    if (!editingRecipe) return;

    try {
      await apiClient.put(`/api/nutrition/recipes/${editingRecipe.id}`, formData);
      setEditingRecipe(null);
      resetForm();
      fetchRecipes();
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  };

  const handleDeleteRecipe = async (id: number) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await apiClient.delete(`/api/nutrition/recipes/${id}`);
      fetchRecipes();
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      cuisineType: '',
      prepTimeMinutes: 0,
      cookTimeMinutes: 0,
      servings: 1,
      difficulty: 'easy',
      ingredients: [''],
      instructions: '',
      caloriesPerServing: 0,
      proteinGPerServing: 0,
      carbsGPerServing: 0,
      fatGPerServing: 0,
      fiberGPerServing: 0,
      sugarGPerServing: 0,
      sodiumMgPerServing: 0,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isDairyFree: false,
      imageUrl: ''
    });
  };

  const openEditDialog = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      name: recipe.name,
      description: recipe.description || '',
      category: recipe.category || '',
      cuisineType: recipe.cuisineType || '',
      prepTimeMinutes: recipe.prepTimeMinutes || 0,
      cookTimeMinutes: recipe.cookTimeMinutes || 0,
      servings: recipe.servings || 1,
      difficulty: recipe.difficulty || 'easy',
      ingredients: recipe.ingredients || [''],
      instructions: recipe.instructions || '',
      caloriesPerServing: recipe.caloriesPerServing || 0,
      proteinGPerServing: recipe.proteinGPerServing || 0,
      carbsGPerServing: recipe.carbsGPerServing || 0,
      fatGPerServing: recipe.fatGPerServing || 0,
      fiberGPerServing: recipe.fiberGPerServing || 0,
      sugarGPerServing: recipe.sugarGPerServing || 0,
      sodiumMgPerServing: recipe.sodiumMgPerServing || 0,
      isVegetarian: recipe.isVegetarian || false,
      isVegan: recipe.isVegan || false,
      isGlutenFree: recipe.isGlutenFree || false,
      isDairyFree: recipe.isDairyFree || false,
      imageUrl: recipe.imageUrl || ''
    });
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'breakfast': return 'bg-orange-100 text-orange-800';
      case 'lunch': return 'bg-blue-100 text-blue-800';
      case 'dinner': return 'bg-purple-100 text-purple-800';
      case 'snack': return 'bg-pink-100 text-pink-800';
      case 'dessert': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recipes</h1>
          <p className="text-gray-600 mt-1">Discover and manage healthy recipes</p>
        </div>
        <Dialog open={showAddDialog || !!editingRecipe} onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false);
            setEditingRecipe(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Recipe Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter recipe name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the recipe"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                        <SelectItem value="dessert">Dessert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="cuisineType">Cuisine Type</Label>
                    <Input
                      id="cuisineType"
                      value={formData.cuisineType}
                      onChange={(e) => setFormData(prev => ({ ...prev, cuisineType: e.target.value }))}
                      placeholder="e.g., Italian, Mexican"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="prepTime">Prep Time (minutes)</Label>
                    <Input
                      id="prepTime"
                      type="number"
                      value={formData.prepTimeMinutes}
                      onChange={(e) => setFormData(prev => ({ ...prev, prepTimeMinutes: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cookTime">Cook Time (minutes)</Label>
                    <Input
                      id="cookTime"
                      type="number"
                      value={formData.cookTimeMinutes}
                      onChange={(e) => setFormData(prev => ({ ...prev, cookTimeMinutes: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="servings">Servings</Label>
                    <Input
                      id="servings"
                      type="number"
                      value={formData.servings}
                      onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Ingredients & Instructions */}
              <div className="space-y-4">
                <div>
                  <Label>Ingredients</Label>
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        placeholder={`Ingredient ${index + 1}`}
                      />
                      {formData.ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeIngredient(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addIngredient} className="mt-2">
                    Add Ingredient
                  </Button>
                </div>
                <div>
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                    placeholder="Step-by-step cooking instructions"
                    rows={6}
                  />
                </div>
              </div>

              {/* Nutritional Info */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-semibold">Nutritional Information (per serving)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={formData.caloriesPerServing}
                      onChange={(e) => setFormData(prev => ({ ...prev, caloriesPerServing: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      step="0.1"
                      value={formData.proteinGPerServing}
                      onChange={(e) => setFormData(prev => ({ ...prev, proteinGPerServing: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      step="0.1"
                      value={formData.carbsGPerServing}
                      onChange={(e) => setFormData(prev => ({ ...prev, carbsGPerServing: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fat">Fat (g)</Label>
                    <Input
                      id="fat"
                      type="number"
                      step="0.1"
                      value={formData.fatGPerServing}
                      onChange={(e) => setFormData(prev => ({ ...prev, fatGPerServing: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-semibold">Dietary Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isVegetarian}
                      onChange={(e) => setFormData(prev => ({ ...prev, isVegetarian: e.target.checked }))}
                    />
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isVegan}
                      onChange={(e) => setFormData(prev => ({ ...prev, isVegan: e.target.checked }))}
                    />
                    <span>Vegan</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isGlutenFree}
                      onChange={(e) => setFormData(prev => ({ ...prev, isGlutenFree: e.target.checked }))}
                    />
                    <span>Gluten Free</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.isDairyFree}
                      onChange={(e) => setFormData(prev => ({ ...prev, isDairyFree: e.target.checked }))}
                    />
                    <span>Dairy Free</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setEditingRecipe(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={editingRecipe ? handleEditRecipe : handleAddRecipe}>
                {editingRecipe ? 'Update Recipe' : 'Add Recipe'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
                <SelectItem value="dessert">Dessert</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setSelectedCategory('');
              setSelectedCuisine('');
              setSelectedDifficulty('');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{recipe.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    {recipe.category && (
                      <Badge className={getCategoryColor(recipe.category)}>
                        {recipe.category}
                      </Badge>
                    )}
                    {recipe.difficulty && (
                      <Badge className={getDifficultyColor(recipe.difficulty)}>
                        {recipe.difficulty}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(recipe)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {recipe.description && (
                <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {(recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {recipe.servings} servings
                  </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="h-4 w-4" />
                    {recipe.caloriesPerServing} cal
                  </div>
                </div>

                {recipe.cuisineType && (
                  <p className="text-sm text-gray-600">
                    <strong>Cuisine:</strong> {recipe.cuisineType}
                  </p>
                )}
              </div>

              {/* Dietary badges */}
              <div className="flex flex-wrap gap-1 mb-4">
                {recipe.isVegetarian && (
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    <Leaf className="h-3 w-3 mr-1" />
                    Vegetarian
                  </Badge>
                )}
                {recipe.isVegan && (
                  <Badge variant="outline" className="text-green-700 border-green-700">
                    <Leaf className="h-3 w-3 mr-1" />
                    Vegan
                  </Badge>
                )}
                {recipe.isGlutenFree && (
                  <Badge variant="outline" className="text-orange-600 border-orange-600">
                    <Wheat className="h-3 w-3 mr-1" />
                    Gluten Free
                  </Badge>
                )}
                {recipe.isDairyFree && (
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    <Milk className="h-3 w-3 mr-1" />
                    Dairy Free
                  </Badge>
                )}
              </div>

              {/* Nutritional info */}
              <div className="text-xs text-gray-600">
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <strong>Protein:</strong> {recipe.proteinGPerServing}g
                  </div>
                  <div>
                    <strong>Carbs:</strong> {recipe.carbsGPerServing}g
                  </div>
                  <div>
                    <strong>Fat:</strong> {recipe.fatGPerServing}g
                  </div>
                  <div>
                    <strong>Fiber:</strong> {recipe.fiberGPerServing}g
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory || selectedCuisine || selectedDifficulty
              ? 'Try adjusting your filters or search terms.'
              : 'Start by adding your first recipe.'}
          </p>
        </div>
      )}
    </div>
  );
};

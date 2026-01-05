
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChefHat, Clock, Users, Star, Heart, Search, Filter, ChevronDown, ChevronUp, Loader2, AlertCircle } from 'lucide-react';
import { RecipeDetailDialog } from '../common/RecipeDetailDialog';

interface HealthyRecipesProps {
  onNavigate: (path: string) => void;
}

interface Symptom {
  id: number;
  name: string;
}

interface Recipe {
  id: number;
  name: string;
  description?: string;
  category?: string;
  cuisineType?: string;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
  difficulty?: string;
  ingredients: string[];
  instructions: string;
  caloriesPerServing?: number;
  proteinGPerServing?: number;
  carbsGPerServing?: number;
  fatGPerServing?: number;
  fiberGPerServing?: number;
  sugarGPerServing?: number;
  sodiumMgPerServing?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  symptom?: Symptom;
  imageUrl?: string;
}

export const HealthyRecipes: React.FC<HealthyRecipesProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({});
  const [expandedRecipes, setExpandedRecipes] = useState<Set<number>>(new Set());

  // API state
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch symptoms on component mount
  useEffect(() => {
    fetchSymptoms();
  }, []);

  // Fetch recipes when symptom selection changes
  useEffect(() => {
    if (selectedCategory !== 'All') {
      fetchRecipesBySymptom(selectedCategory);
    } else {
      setRecipes([]);
    }
  }, [selectedCategory]);

  const fetchSymptoms = async () => {
    try {
      setLoadingSymptoms(true);
      setError(null);
      const response = await fetch('http://localhost:8081/api/symptoms');
      if (!response.ok) {
        throw new Error('Failed to fetch symptoms');
      }
      const data = await response.json();
      setSymptoms(data);
    } catch (err) {
      setError('Failed to load symptoms. Please try again.');
      console.error('Error fetching symptoms:', err);
    } finally {
      setLoadingSymptoms(false);
    }
  };

  const fetchRecipesBySymptom = async (symptomId: string) => {
    try {
      setLoadingRecipes(true);
      setError(null);
      const response = await fetch(`http://localhost:8081/api/symptoms/${symptomId}/recipes`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await response.json();
      setRecipes(data);
    } catch (err) {
      setError('Failed to load recipes. Please try again.');
      console.error('Error fetching recipes:', err);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const categories = [
    { id: 'All', name: 'All Symptoms' },
    ...symptoms.map(symptom => ({ id: symptom.id.toString(), name: symptom.name }))
  ];

  const handleLike = (recipeId: number) => {
    setLikes(prev => ({ ...prev, [recipeId]: !prev[recipeId] }));
  };

  const toggleExpanded = (recipeId: number) => {
    setExpandedRecipes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recipeId)) {
        newSet.delete(recipeId);
      } else {
        newSet.add(recipeId);
      }
      return newSet;
    });
  };

  const formatTime = (minutes?: number) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getDietaryPrefs = (recipe: Recipe) => {
    const prefs = [];
    if (recipe.isVegan) prefs.push('Vegan');
    if (recipe.isVegetarian) prefs.push('Vegetarian');
    if (recipe.isGlutenFree) prefs.push('Gluten-Free');
    if (recipe.isDairyFree) prefs.push('Dairy-Free');
    return prefs;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Healthy Recipes</h1>
          <p className="text-lg text-gray-600">Discover nutritious recipes tailored to your symptoms</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search recipes or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            {loadingSymptoms ? (
              <div className="flex items-center justify-center h-10">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2">Loading symptoms...</span>
              </div>
            ) : (
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select symptom" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                if (selectedCategory === 'All') {
                  fetchSymptoms();
                } else {
                  fetchRecipesBySymptom(selectedCategory);
                }
              }}
            >
              Retry
            </Button>
          </div>
        )}

        {selectedCategory !== 'All' && loadingRecipes && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span className="text-lg">Loading recipes...</span>
          </div>
        )}

        {selectedCategory !== 'All' && !loadingRecipes && !error && (
          <>
            {filteredRecipes.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes found</h3>
                <p className="text-gray-500">
                  {searchQuery ? 'Try adjusting your search terms.' : 'No recipes available for this symptom yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map(recipe => {
                  const isExpanded = expandedRecipes.has(recipe.id);
                  const dietaryPrefs = getDietaryPrefs(recipe);
                  return (
                    <Card key={recipe.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">{recipe.name}</h3>
                          <Heart
                            className={`h-5 w-5 cursor-pointer ${likes[recipe.id] ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(recipe.id);
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatTime(recipe.prepTimeMinutes)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {recipe.servings || 'N/A'}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {dietaryPrefs.slice(0, 2).map(pref => (
                            <span key={pref} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              {pref}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                          {recipe.caloriesPerServing || 'N/A'} calories • {recipe.difficulty || 'N/A'}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-between mb-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpanded(recipe.id);
                          }}
                        >
                          {isExpanded ? 'Hide Instructions' : 'View Instructions'}
                          {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                        </Button>

                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
                          {isExpanded && (
                            <div className="text-sm text-gray-700 whitespace-pre-line">
                              <strong>Instructions:</strong><br />
                              {recipe.instructions}
                            </div>
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecipe(recipe);
                          }}
                        >
                          Full Details
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}

        {selectedCategory === 'All' && !loadingSymptoms && (
          <div className="text-center py-12">
            <Filter className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Select a symptom</h3>
            <p className="text-gray-500">Choose a symptom from the dropdown to view tailored recipes.</p>
          </div>
        )}

        {selectedRecipe && (
          <RecipeDetailDialog
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </div>
    </div>
  );
};

export default HealthyRecipes;

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Clock, Users, ChefHat } from 'lucide-react';

interface RecipeDetailDialogProps {
  recipe: any;
  onClose: () => void;
}

export const RecipeDetailDialog: React.FC<RecipeDetailDialogProps> = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">{recipe.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-64 object-cover rounded-lg" />
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Prep: {recipe.prepTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Cook: {recipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Servings: {recipe.servings}</span>
            </div>
            <div className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              <span>Difficulty: {recipe.difficulty}</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
            <ul className="list-disc list-inside space-y-1">
              {recipe.ingredients.map((ingredient: string, index: number) => (
                <li key={index} className="text-gray-700">{ingredient}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Instructions</h3>
            <div className="text-gray-700 whitespace-pre-line">{recipe.instructions}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {recipe.dietaryPrefs.map((pref: string) => (
              <span key={pref} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {pref}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-600">
            {recipe.calories} calories • Symptom: {recipe.symptom}
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

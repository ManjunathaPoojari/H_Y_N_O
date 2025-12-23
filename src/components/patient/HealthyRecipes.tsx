import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ChefHat, Clock, Users, Star, Heart, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { RecipeDetailDialog } from '../common/RecipeDetailDialog';

interface HealthyRecipesProps {
  onNavigate: (path: string) => void;
}

export const HealthyRecipes: React.FC<HealthyRecipesProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({});
  const [expandedRecipes, setExpandedRecipes] = useState<Set<number>>(new Set());

  const recipes = [
    {
      id: 1,
      name: 'Vegetable Broth Soup',
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
      calories: 120,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Low-Calorie'],
      categoryId: 1,
      ingredients: ['2 carrots, chopped', '2 celery stalks, chopped', '1 onion, chopped', '4 cups vegetable broth', '1 cup mixed vegetables', 'Salt and pepper to taste', 'Fresh herbs'],
      instructions: '1. Heat a large pot over medium heat. Add chopped carrots, celery, and onion. Sauté for 5 minutes until softened.\n2. Add vegetable broth and mixed vegetables. Bring to a boil, then reduce heat and simmer for 15-20 minutes.\n3. Season with salt, pepper, and fresh herbs. Serve hot.',
      prepTime: '10 mins',
      cookTime: '20 mins',
      servings: 4,
      difficulty: 'Easy',
      symptom: 'Fever'
    },
    {
      id: 2,
      name: 'Lemon Ginger Tea',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      calories: 25,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Caffeine-Free'],
      categoryId: 1,
      ingredients: ['1 inch fresh ginger, sliced', '1 lemon, juiced', '1 tsp honey (optional)', '2 cups water', 'Fresh mint leaves (optional)'],
      instructions: '1. Bring water to a boil in a small saucepan. Add sliced ginger and simmer for 5-7 minutes.\n2. Remove from heat and stir in lemon juice and honey if using.\n3. Strain into a cup and garnish with mint leaves if desired. Sip slowly while warm.',
      prepTime: '5 mins',
      cookTime: '7 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Fever'
    },
    {
      id: 3,
      name: 'Steamed Rice with Boiled Veggies',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      calories: 180,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Low-Calorie'],
      categoryId: 1,
      ingredients: ['1 cup rice', '2 cups water', '1 carrot, chopped', '1 cup broccoli florets', '1 zucchini, sliced', 'Salt to taste'],
      instructions: '1. Rinse rice and cook in water according to package instructions.\n2. While rice cooks, steam vegetables until tender (about 10 minutes).\n3. Serve rice topped with steamed vegetables. Season lightly with salt.',
      prepTime: '10 mins',
      cookTime: '20 mins',
      servings: 2,
      difficulty: 'Easy',
      symptom: 'Fever'
    },
    {
      id: 4,
      name: 'Oatmeal with Honey',
      imageUrl: 'https://images.unsplash.com/photo-1505252585461-9044a396130f?w=400&h=300&fit=crop',
      calories: 220,
      dietaryPrefs: ['Vegetarian', 'Gluten-Free Option'],
      categoryId: 1,
      ingredients: ['1/2 cup oats', '1 cup water or milk', '1 tbsp honey', '1/4 tsp cinnamon', 'Fresh fruit (optional)'],
      instructions: '1. Bring water or milk to a boil in a saucepan. Add oats and reduce heat.\n2. Cook for 5-7 minutes, stirring occasionally until thickened.\n3. Stir in honey and cinnamon. Top with fresh fruit if desired.',
      prepTime: '5 mins',
      cookTime: '7 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Fever'
    },
    {
      id: 5,
      name: 'Coconut Water Smoothie',
      imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e9c9b90c?w=400&h=300&fit=crop',
      calories: 150,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Refreshing'],
      categoryId: 1,
      ingredients: ['1 cup coconut water', '1/2 cup pineapple chunks', '1/2 banana', '1 tbsp lime juice', 'Ice cubes'],
      instructions: '1. Add all ingredients to a blender.\n2. Blend until smooth and creamy.\n3. Pour into a glass and serve immediately. Best consumed cold.',
      prepTime: '5 mins',
      cookTime: '0 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Fever'
    },
    // Cough recipes
    {
      id: 6,
      name: 'Honey Lemon Tea',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      calories: 35,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Soothes Throat'],
      categoryId: 2,
      ingredients: ['1 cup hot water', '1 tbsp honey', '1/2 lemon, juiced', '1/4 tsp ginger powder (optional)', 'Fresh lemon slice'],
      instructions: '1. Pour hot water into a mug. Add honey and stir until dissolved.\n2. Squeeze in lemon juice and add ginger powder if using.\n3. Garnish with a lemon slice. Sip slowly to soothe the throat.',
      prepTime: '2 mins',
      cookTime: '0 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Cough'
    },
    {
      id: 7,
      name: 'Turmeric Milk (Golden Milk)',
      imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop',
      calories: 180,
      dietaryPrefs: ['Vegetarian', 'Anti-Inflammatory'],
      categoryId: 2,
      ingredients: ['1 cup milk (dairy or plant-based)', '1/2 tsp turmeric powder', '1/4 tsp cinnamon', '1/4 tsp ginger powder', '1 tsp honey', 'Pinch of black pepper'],
      instructions: '1. Heat milk in a saucepan over medium heat until hot but not boiling.\n2. Whisk in turmeric, cinnamon, ginger, and black pepper.\n3. Remove from heat, stir in honey, and serve warm.',
      prepTime: '5 mins',
      cookTime: '5 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Cough'
    },
    {
      id: 8,
      name: 'Ginger Carrot Soup',
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
      calories: 140,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Immune-Boosting'],
      categoryId: 2,
      ingredients: ['4 carrots, chopped', '1 inch ginger, sliced', '1 onion, chopped', '3 cups vegetable broth', '1 tbsp olive oil', 'Salt and pepper'],
      instructions: '1. Heat olive oil in a pot. Sauté onion and ginger for 3 minutes.\n2. Add carrots and broth. Bring to boil, then simmer for 20 minutes.\n3. Blend until smooth. Season with salt and pepper.',
      prepTime: '10 mins',
      cookTime: '25 mins',
      servings: 2,
      difficulty: 'Easy',
      symptom: 'Cough'
    },
    {
      id: 9,
      name: 'Warm Herbal Tea with Tulsi',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      calories: 15,
      dietaryPrefs: ['Vegan', 'Caffeine-Free', 'Calming'],
      categoryId: 2,
      ingredients: ['1 cup hot water', '2-3 tulsi (holy basil) leaves', '1/2 tsp honey (optional)', '1/4 lemon slice', 'Pinch of cinnamon'],
      instructions: '1. Pour hot water over tulsi leaves in a mug.\n2. Let steep for 3-5 minutes.\n3. Add honey and lemon if desired. Sip slowly.',
      prepTime: '2 mins',
      cookTime: '5 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Cough'
    },
    {
      id: 10,
      name: 'Steamed Pear with Honey',
      imageUrl: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop',
      calories: 120,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Soothes Cough'],
      categoryId: 2,
      ingredients: ['1 ripe pear', '1 tsp honey', '1/4 tsp cinnamon', '1 cup water'],
      instructions: '1. Core the pear and place in a steamer basket.\n2. Steam for 10-15 minutes until soft.\n3. Drizzle with honey and sprinkle cinnamon. Serve warm.',
      prepTime: '5 mins',
      cookTime: '15 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Cough'
    },
    // Headache recipes
    {
      id: 11,
      name: 'Spinach and Avocado Smoothie',
      imageUrl: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop',
      calories: 220,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Nutrient-Rich'],
      categoryId: 3,
      ingredients: ['1 cup spinach', '1/2 avocado', '1 banana', '1 cup almond milk', '1 tbsp chia seeds', '1/2 cup frozen berries'],
      instructions: '1. Add all ingredients to a blender.\n2. Blend until smooth and creamy.\n3. Pour into a glass and drink immediately.',
      prepTime: '5 mins',
      cookTime: '0 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Headache'
    },
    {
      id: 12,
      name: 'Almond Banana Shake',
      imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e9c9b90c?w=400&h=300&fit=crop',
      calories: 280,
      dietaryPrefs: ['Vegetarian', 'Gluten-Free', 'Energizing'],
      categoryId: 3,
      ingredients: ['1 banana', '1 cup almond milk', '1 tbsp almond butter', '1/4 tsp cinnamon', 'Handful of almonds', 'Ice cubes'],
      instructions: '1. Blend banana, almond milk, almond butter, and cinnamon.\n2. Add ice and blend again until smooth.\n3. Top with chopped almonds.',
      prepTime: '5 mins',
      cookTime: '0 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Headache'
    },
    {
      id: 13,
      name: 'Whole Grain Toast with Nut Butter',
      imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
      calories: 250,
      dietaryPrefs: ['Vegetarian', 'High-Fiber'],
      categoryId: 3,
      ingredients: ['2 slices whole grain bread', '2 tbsp almond butter', '1 banana, sliced', '1/4 tsp cinnamon', 'Handful of berries'],
      instructions: '1. Toast bread slices until golden.\n2. Spread almond butter evenly on toast.\n3. Top with banana slices, sprinkle cinnamon, and add berries.',
      prepTime: '5 mins',
      cookTime: '3 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Headache'
    },
    {
      id: 14,
      name: 'Cucumber Mint Salad',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
      calories: 45,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Refreshing'],
      categoryId: 3,
      ingredients: ['1 cucumber, sliced', '1/4 cup fresh mint leaves', '1 tbsp olive oil', '1 tbsp lemon juice', 'Salt to taste'],
      instructions: '1. Slice cucumber thinly and place in a bowl.\n2. Add torn mint leaves.\n3. Drizzle with olive oil and lemon juice. Toss gently and season with salt.',
      prepTime: '10 mins',
      cookTime: '0 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Headache'
    },
    {
      id: 15,
      name: 'Chamomile Tea',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      calories: 5,
      dietaryPrefs: ['Vegan', 'Caffeine-Free', 'Calming'],
      categoryId: 3,
      ingredients: ['1 chamomile tea bag', '1 cup hot water', '1 tsp honey (optional)', 'Lemon slice (optional)'],
      instructions: '1. Place tea bag in a mug and pour hot water over it.\n2. Steep for 5 minutes.\n3. Remove tea bag, add honey and lemon if desired. Sip slowly.',
      prepTime: '2 mins',
      cookTime: '5 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Headache'
    },
    // Fatigue recipes
    {
      id: 16,
      name: 'Quinoa Salad with Chickpeas',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      calories: 380,
      dietaryPrefs: ['Vegan', 'High-Protein', 'Gluten-Free'],
      categoryId: 4,
      ingredients: ['1/2 cup quinoa', '1/2 cup chickpeas, drained', '1 cucumber, diced', '1 tomato, diced', '2 tbsp olive oil', '1 tbsp lemon juice', 'Fresh herbs'],
      instructions: '1. Cook quinoa according to package instructions.\n2. Mix cooked quinoa with chickpeas, cucumber, and tomato.\n3. Dress with olive oil and lemon juice. Garnish with herbs.',
      prepTime: '15 mins',
      cookTime: '15 mins',
      servings: 2,
      difficulty: 'Easy',
      symptom: 'Fatigue'
    },
    {
      id: 17,
      name: 'Green Smoothie (Spinach, Kale, Apple)',
      imageUrl: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop',
      calories: 180,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Energizing'],
      categoryId: 4,
      ingredients: ['1 cup spinach', '1 cup kale', '1 apple, chopped', '1 banana', '1 cup coconut water', '1 tbsp chia seeds'],
      instructions: '1. Add all ingredients to a blender.\n2. Blend until smooth.\n3. Pour into a glass and drink immediately for maximum nutrients.',
      prepTime: '5 mins',
      cookTime: '0 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Fatigue'
    },
    {
      id: 18,
      name: 'Lentil Soup',
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
      calories: 220,
      dietaryPrefs: ['Vegan', 'High-Protein', 'Gluten-Free'],
      categoryId: 4,
      ingredients: ['1/2 cup lentils', '1 carrot, chopped', '1 onion, chopped', '2 cups vegetable broth', '1 tsp cumin', 'Salt and pepper'],
      instructions: '1. Sauté onion and carrot in a pot for 5 minutes.\n2. Add lentils, broth, and spices. Bring to boil.\n3. Simmer for 25-30 minutes until lentils are tender.',
      prepTime: '10 mins',
      cookTime: '30 mins',
      servings: 2,
      difficulty: 'Easy',
      symptom: 'Fatigue'
    },
    {
      id: 19,
      name: 'Overnight Oats with Chia Seeds',
      imageUrl: 'https://images.unsplash.com/photo-1505252585461-9044a396130f?w=400&h=300&fit=crop',
      calories: 320,
      dietaryPrefs: ['Vegetarian', 'High-Fiber'],
      categoryId: 4,
      ingredients: ['1/2 cup oats', '1 cup almond milk', '1 tbsp chia seeds', '1/2 banana, sliced', '1 tbsp almond butter', 'Cinnamon'],
      instructions: '1. Mix oats, milk, and chia seeds in a jar.\n2. Refrigerate overnight.\n3. In the morning, top with banana, almond butter, and cinnamon.',
      prepTime: '5 mins',
      cookTime: '0 mins (overnight)',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Fatigue'
    },
    {
      id: 20,
      name: 'Grilled Salmon with Vegetables',
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
      calories: 350,
      dietaryPrefs: ['High-Protein', 'Omega-3 Rich'],
      categoryId: 4,
      ingredients: ['4 oz salmon fillet', '1 cup mixed vegetables', '1 tbsp olive oil', 'Lemon juice', 'Fresh herbs', 'Salt and pepper'],
      instructions: '1. Season salmon with salt, pepper, and herbs.\n2. Grill salmon for 4-5 minutes per side.\n3. Steam vegetables and serve alongside salmon.',
      prepTime: '10 mins',
      cookTime: '10 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Fatigue'
    },
    // Dizziness recipes
    {
      id: 21,
      name: 'Banana Smoothie',
      imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e9c9b90c?w=400&h=300&fit=crop',
      calories: 200,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Potassium-Rich'],
      categoryId: 5,
      ingredients: ['2 bananas', '1 cup almond milk', '1 tbsp peanut butter', '1/4 tsp cinnamon', 'Ice cubes'],
      instructions: '1. Peel and slice bananas.\n2. Add all ingredients to blender.\n3. Blend until smooth and creamy. Serve cold.',
      prepTime: '5 mins',
      cookTime: '0 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Dizziness'
    },
    {
      id: 22,
      name: 'Hydrating Watermelon Juice',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      calories: 80,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Hydrating'],
      categoryId: 5,
      ingredients: ['2 cups watermelon chunks', '1/2 lime, juiced', '1 cup water', 'Ice cubes', 'Mint leaves (optional)'],
      instructions: '1. Blend watermelon chunks with water and lime juice.\n2. Strain if desired for smoother juice.\n3. Serve over ice with mint garnish.',
      prepTime: '5 mins',
      cookTime: '0 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Dizziness'
    },
    {
      id: 23,
      name: 'Yogurt with Berries',
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
      calories: 180,
      dietaryPrefs: ['Vegetarian', 'Probiotic', 'Antioxidant-Rich'],
      categoryId: 5,
      ingredients: ['1 cup Greek yogurt', '1/2 cup mixed berries', '1 tbsp honey', '1 tbsp chia seeds', 'Handful of nuts'],
      instructions: '1. Spoon yogurt into a bowl.\n2. Top with berries, honey, chia seeds, and nuts.\n3. Mix gently and enjoy immediately.',
      prepTime: '5 mins',
      cookTime: '0 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Dizziness'
    },
    {
      id: 24,
      name: 'Spinach Omelet',
      imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
      calories: 220,
      dietaryPrefs: ['High-Protein', 'Vegetarian'],
      categoryId: 5,
      ingredients: ['2 eggs', '1 cup spinach', '1/4 onion, chopped', '1 tbsp olive oil', 'Salt and pepper', 'Herbs'],
      instructions: '1. Whisk eggs with salt and pepper.\n2. Sauté spinach and onion in olive oil.\n3. Pour eggs over vegetables and cook until set.',
      prepTime: '5 mins',
      cookTime: '5 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Dizziness'
    },
    {
      id: 25,
      name: 'Herbal Ginger Tea',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      calories: 20,
      dietaryPrefs: ['Vegan', 'Caffeine-Free', 'Digestive'],
      categoryId: 5,
      ingredients: ['1 inch ginger, sliced', '1 cup hot water', '1/2 lemon, juiced', '1 tsp honey (optional)', 'Mint leaves'],
      instructions: '1. Steep ginger in hot water for 5 minutes.\n2. Add lemon juice and honey.\n3. Garnish with mint and sip slowly.',
      prepTime: '5 mins',
      cookTime: '5 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Dizziness'
    },
    // Nausea recipes
    {
      id: 26,
      name: 'Plain Rice Porridge',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      calories: 150,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Easy to Digest'],
      categoryId: 6,
      ingredients: ['1/2 cup rice', '4 cups water', 'Salt to taste', 'Ginger slice (optional)'],
      instructions: '1. Rinse rice and add to boiling water.\n2. Simmer for 20-25 minutes until creamy.\n3. Season with salt and serve warm.',
      prepTime: '5 mins',
      cookTime: '25 mins',
      servings: 2,
      difficulty: 'Easy',
      symptom: 'Nausea'
    },
    {
      id: 27,
      name: 'Ginger Tea',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      calories: 15,
      dietaryPrefs: ['Vegan', 'Caffeine-Free', 'Anti-Nausea'],
      categoryId: 6,
      ingredients: ['1 inch fresh ginger, sliced', '1 cup hot water', '1 tsp honey (optional)', 'Lemon slice'],
      instructions: '1. Steep ginger in hot water for 5-7 minutes.\n2. Strain and add honey and lemon.\n3. Sip slowly while warm.',
      prepTime: '5 mins',
      cookTime: '7 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Nausea'
    },
    {
      id: 28,
      name: 'Apple Sauce',
      imageUrl: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop',
      calories: 100,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Mild'],
      categoryId: 6,
      ingredients: ['2 apples, peeled and chopped', '1/4 cup water', '1/2 tsp cinnamon', '1 tsp honey (optional)'],
      instructions: '1. Cook apples with water until soft.\n2. Mash or blend until smooth.\n3. Add cinnamon and honey. Cool slightly before serving.',
      prepTime: '10 mins',
      cookTime: '15 mins',
      servings: 2,
      difficulty: 'Easy',
      symptom: 'Nausea'
    },
    {
      id: 29,
      name: 'Toasted Whole Wheat Bread',
      imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
      calories: 120,
      dietaryPrefs: ['Vegetarian', 'High-Fiber'],
      categoryId: 6,
      ingredients: ['2 slices whole wheat bread', '1 tsp butter (optional)', 'Salt (optional)'],
      instructions: '1. Toast bread slices until golden.\n2. Spread with butter if desired.\n3. Sprinkle lightly with salt and serve warm.',
      prepTime: '2 mins',
      cookTime: '3 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Nausea'
    },
    {
      id: 30,
      name: 'Peppermint Tea',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      calories: 5,
      dietaryPrefs: ['Vegan', 'Caffeine-Free', 'Calming'],
      categoryId: 6,
      ingredients: ['1 peppermint tea bag', '1 cup hot water', '1 tsp honey (optional)', 'Lemon slice (optional)'],
      instructions: '1. Steep tea bag in hot water for 3-5 minutes.\n2. Remove bag and add honey/lemon if desired.\n3. Sip slowly to soothe stomach.',
      prepTime: '2 mins',
      cookTime: '5 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Nausea'
    },
    // Vomiting recipes
    {
      id: 31,
      name: 'Clear Vegetable Soup',
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
      calories: 80,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Light'],
      categoryId: 7,
      ingredients: ['2 carrots, thinly sliced', '1 zucchini, sliced', '4 cups water', 'Salt to taste', 'Fresh herbs'],
      instructions: '1. Bring water to boil with carrots and zucchini.\n2. Simmer for 10-15 minutes.\n3. Season lightly and serve warm broth.',
      prepTime: '10 mins',
      cookTime: '15 mins',
      servings: 2,
      difficulty: 'Easy',
      symptom: 'Vomiting'
    },
    {
      id: 32,
      name: 'Rice Congee',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      calories: 120,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Gentle'],
      categoryId: 7,
      ingredients: ['1/4 cup rice', '4 cups water', 'Salt to taste', 'Ginger slice (optional)'],
      instructions: '1. Rinse rice and cook in plenty of water.\n2. Simmer for 30-40 minutes until very soft.\n3. Season and serve warm.',
      prepTime: '5 mins',
      cookTime: '40 mins',
      servings: 2,
      difficulty: 'Easy',
      symptom: 'Vomiting'
    },
    {
      id: 33,
      name: 'Banana Mash',
      imageUrl: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop',
      calories: 105,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Binding'],
      categoryId: 7,
      ingredients: ['1 ripe banana', '1 tsp honey (optional)', 'Pinch of cinnamon'],
      instructions: '1. Peel and mash banana with a fork.\n2. Mix in honey and cinnamon if desired.\n3. Serve immediately.',
      prepTime: '2 mins',
      cookTime: '0 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Vomiting'
    },
    {
      id: 34,
      name: 'Coconut Water',
      imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e9c9b90c?w=400&h=300&fit=crop',
      calories: 45,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Electrolyte-Rich'],
      categoryId: 7,
      ingredients: ['1 cup fresh coconut water', 'Ice cubes (optional)'],
      instructions: '1. Chill coconut water if desired.\n2. Serve in a glass over ice.\n3. Sip slowly throughout the day.',
      prepTime: '0 mins',
      cookTime: '0 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Vomiting'
    },
    {
      id: 35,
      name: 'Steamed Apple Puree',
      imageUrl: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop',
      calories: 85,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Mild'],
      categoryId: 7,
      ingredients: ['1 apple, peeled and chopped', '2 tbsp water', '1/4 tsp cinnamon'],
      instructions: '1. Steam apple pieces until soft.\n2. Blend or mash until smooth.\n3. Add cinnamon and serve warm.',
      prepTime: '5 mins',
      cookTime: '10 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Vomiting'
    },
    // Diarrhea recipes
    {
      id: 36,
      name: 'Plain Rice with Boiled Carrots',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      calories: 160,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Binding'],
      categoryId: 8,
      ingredients: ['1/2 cup rice', '1 carrot, chopped', '2 cups water', 'Salt to taste'],
      instructions: '1. Cook rice in water until soft.\n2. Boil carrot separately until tender.\n3. Mix together and season lightly.',
      prepTime: '10 mins',
      cookTime: '20 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Diarrhea'
    },
    {
      id: 37,
      name: 'Banana Yogurt Smoothie',
      imageUrl: 'https://images.unsplash.com/photo-1553909489-cd47e9c9b90c?w=400&h=300&fit=crop',
      calories: 180,
      dietaryPrefs: ['Vegetarian', 'Probiotic', 'Potassium-Rich'],
      categoryId: 8,
      ingredients: ['1 banana', '1/2 cup plain yogurt', '1/2 cup water', '1 tsp honey', 'Pinch of cinnamon'],
      instructions: '1. Blend all ingredients until smooth.\n2. Serve cold for best results.\n3. Drink slowly.',
      prepTime: '5 mins',
      cookTime: '0 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Diarrhea'
    },
    {
      id: 38,
      name: 'Apple Rice Porridge',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      calories: 140,
      dietaryPrefs: ['Vegan', 'Gluten-Free', 'Gentle'],
      categoryId: 8,
      ingredients: ['1/4 cup rice', '1 apple, grated', '2 cups water', '1/4 tsp cinnamon'],
      instructions: '1. Cook rice in water until soft.\n2. Stir in grated apple and cinnamon.\n3. Simmer for 5 more minutes.',
      prepTime: '10 mins',
      cookTime: '25 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Diarrhea'
    },
    {
      id: 39,
      name: 'Lentil Khichdi (Light Indian Dish)',
      imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
      calories: 200,
      dietaryPrefs: ['Vegan', 'High-Protein', 'Gluten-Free'],
      categoryId: 8,
      ingredients: ['1/4 cup rice', '1/4 cup lentils', '3 cups water', '1/2 carrot, chopped', 'Salt to taste', 'Ghee (optional)'],
      instructions: '1. Rinse rice and lentils together.\n2. Cook with water and carrot for 20-25 minutes.\n3. Mash slightly and season.',
      prepTime: '10 mins',
      cookTime: '25 mins',
      servings: 2,
      difficulty: 'Easy',
      symptom: 'Diarrhea'
    },
    {
      id: 40,
      name: 'Herbal Chamomile Tea',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      calories: 5,
      dietaryPrefs: ['Vegan', 'Caffeine-Free', 'Calming'],
      categoryId: 8,
      ingredients: ['1 chamomile tea bag', '1 cup hot water', '1 tsp honey (optional)', 'Lemon slice (optional)'],
      instructions: '1. Steep tea bag in hot water for 5 minutes.\n2. Remove bag and add honey/lemon.\n3. Sip slowly to calm digestive system.',
      prepTime: '2 mins',
      cookTime: '5 mins',
      servings: 1,
      difficulty: 'Easy',
      symptom: 'Diarrhea'
    },
    // Constipation recipes
    {
      id: 41,
      name: 'Oatmeal with Flax Seeds',
      imageUrl: 'https://images.unsplash.com/photo-1505252585461-9044a396130f?w=400&h=300&fit=crop',
      calories: 280,
      dietaryPrefs: ['Vegetarian', 'High-Fiber', 'Omega-3'],
      categoryId: 9,
      ingredients: ['1/2 cup oats', '1 cup water', '1 tbsp flax seeds', '1/2 apple, chopped', '1 tbsp honey', 'Cinnamon'],
      instructions: '1. Cook oats in water until creamy.\n2. Stir in flax seeds, apple, honey, and cinnamon.\n3. Serve warm.'
    }
  ];

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || recipe.categoryId.toString() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'All', name: 'All Symptoms' },
    { id: '1', name: 'Fever' },
    { id: '2', name: 'Cough' },
    { id: '3', name: 'Headache' },
    { id: '4', name: 'Fatigue' },
    { id: '5', name: 'Dizziness' },
    { id: '6', name: 'Nausea' },
    { id: '7', name: 'Vomiting' },
    { id: '8', name: 'Diarrhea' },
    { id: '9', name: 'Constipation' }
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => {
            const isExpanded = expandedRecipes.has(recipe.id);
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
                      {recipe.prepTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {recipe.servings}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {recipe.dietaryPrefs.slice(0, 2).map(pref => (
                      <span key={pref} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {pref}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    {recipe.calories} calories • {recipe.difficulty}
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

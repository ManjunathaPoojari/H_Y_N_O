# TODO: Add 100 Recipes to HealthyRecipes Component

## Steps to Complete

1. **Update HealthyRecipes.tsx recipes array**
   - Add recipes from id 42 to 100 (59 more recipes needed)
   - Define 20 symptom categories (extend from existing 9 to 20)
   - For each symptom, create 5 recipes with full details:
     - id, name, imageUrl, calories, dietaryPrefs, categoryId, ingredients, instructions, prepTime, cookTime, servings, difficulty, symptom
   - Ensure recipes are appropriate for each symptom's nutritional needs

2. **Define Symptom Categories**
   - 1: Fever
   - 2: Cough
   - 3: Headache
   - 4: Fatigue
   - 5: Dizziness
   - 6: Nausea
   - 7: Vomiting
   - 8: Diarrhea
   - 9: Constipation
   - 10: Indigestion
   - 11: Acidity
   - 12: Bloating
   - 13: Gas
   - 14: Insomnia
   - 15: Anxiety
   - 16: Depression
   - 17: Joint Pain
   - 18: Muscle Pain
   - 19: Cold
   - 20: Sore Throat

3. **Generate Recipe Content**
   - Create realistic ingredients lists for each recipe
   - Write step-by-step instructions
   - Calculate approximate calories and dietary preferences
   - Set appropriate prep/cook times, servings, difficulty

4. **Test and Verify**
   - Run development server
   - Navigate to http://localhost:3000/patient/nutrition/recipes
   - Verify all 100 recipes display correctly
   - Test filtering by category and search functionality
   - Check recipe detail dialogs work properly

## Progress Tracking
- [ ] Step 1: Update recipes array in HealthyRecipes.tsx
- [ ] Step 2: Define all symptom categories
- [ ] Step 3: Generate and add all recipe content
- [ ] Step 4: Run dev server and test preview

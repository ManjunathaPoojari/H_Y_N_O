package com.hyno.service;

import com.hyno.entity.Recipe;
import com.hyno.repository.RecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RecipeService {
    private final RecipeRepository recipeRepository;

    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    public Optional<Recipe> getRecipeById(Long id) {
        return recipeRepository.findById(id);
    }

    public List<Recipe> getRecipesByCategory(String category) {
        return recipeRepository.findByCategory(category);
    }

    public List<Recipe> getRecipesByCuisine(String cuisineType) {
        return recipeRepository.findByCuisineType(cuisineType);
    }

    public List<Recipe> getRecipesByDifficulty(String difficulty) {
        return recipeRepository.findByDifficulty(difficulty);
    }

    public List<Recipe> getVegetarianRecipes() {
        return recipeRepository.findVegetarianRecipes();
    }

    public List<Recipe> getVeganRecipes() {
        return recipeRepository.findVeganRecipes();
    }

    public List<Recipe> getGlutenFreeRecipes() {
        return recipeRepository.findGlutenFreeRecipes();
    }

    public List<Recipe> getDairyFreeRecipes() {
        return recipeRepository.findDairyFreeRecipes();
    }

    public List<Recipe> getRecipesByCalorieRange(Integer minCalories, Integer maxCalories) {
        return recipeRepository.findByCalorieRange(minCalories, maxCalories);
    }

    public List<Recipe> searchRecipes(String keyword) {
        return recipeRepository.searchByKeyword(keyword);
    }

    public Recipe createRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public Recipe updateRecipe(Long id, Recipe recipeDetails) {
        return recipeRepository.findById(id)
                .map(recipe -> {
                    recipe.setName(recipeDetails.getName());
                    recipe.setDescription(recipeDetails.getDescription());
                    recipe.setCategory(recipeDetails.getCategory());
                    recipe.setCuisineType(recipeDetails.getCuisineType());
                    recipe.setPrepTimeMinutes(recipeDetails.getPrepTimeMinutes());
                    recipe.setCookTimeMinutes(recipeDetails.getCookTimeMinutes());
                    recipe.setServings(recipeDetails.getServings());
                    recipe.setDifficulty(recipeDetails.getDifficulty());
                    recipe.setIngredients(recipeDetails.getIngredients());
                    recipe.setInstructions(recipeDetails.getInstructions());
                    recipe.setCaloriesPerServing(recipeDetails.getCaloriesPerServing());
                    recipe.setProteinGPerServing(recipeDetails.getProteinGPerServing());
                    recipe.setCarbsGPerServing(recipeDetails.getCarbsGPerServing());
                    recipe.setFatGPerServing(recipeDetails.getFatGPerServing());
                    recipe.setFiberGPerServing(recipeDetails.getFiberGPerServing());
                    recipe.setSugarGPerServing(recipeDetails.getSugarGPerServing());
                    recipe.setSodiumMgPerServing(recipeDetails.getSodiumMgPerServing());
                    recipe.setIsVegetarian(recipeDetails.getIsVegetarian());
                    recipe.setIsVegan(recipeDetails.getIsVegan());
                    recipe.setIsGlutenFree(recipeDetails.getIsGlutenFree());
                    recipe.setIsDairyFree(recipeDetails.getIsDairyFree());
                    recipe.setImageUrl(recipeDetails.getImageUrl());
                    return recipeRepository.save(recipe);
                })
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
    }

    public void deleteRecipe(Long id) {
        recipeRepository.deleteById(id);
    }
}

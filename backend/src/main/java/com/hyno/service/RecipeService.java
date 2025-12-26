package com.hyno.service;

import com.hyno.entity.Recipe;
import com.hyno.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }

    public List<Recipe> searchRecipes(String query) {
        return recipeRepository.searchByKeyword(query);
    }

    public List<Recipe> getRecipesByCategory(String category) {
        return recipeRepository.findByCategory(category);
    }

    public List<Recipe> getRecipesByCuisine(String cuisine) {
        return recipeRepository.findByCuisineType(cuisine);
    }

    public List<Recipe> getRecipesByDifficulty(String difficulty) {
        return recipeRepository.findByDifficulty(difficulty);
    }

    public Optional<Recipe> getRecipeById(Long id) {
        return recipeRepository.findById(id);
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

    public Recipe createRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public Recipe updateRecipe(Long id, Recipe recipe) {
        if (recipeRepository.existsById(id)) {
            recipe.setId(id);
            return recipeRepository.save(recipe);
        }
        throw new RuntimeException("Recipe not found");
    }

    public void deleteRecipe(Long id) {
        recipeRepository.deleteById(id);
    }
}

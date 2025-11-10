package com.hyno.controller;

import com.hyno.entity.NutritionProfile;
import com.hyno.entity.Recipe;
import com.hyno.entity.MealPlan;
import com.hyno.entity.PremiumPlan;
import com.hyno.service.NutritionProfileService;
import com.hyno.service.RecipeService;
import com.hyno.service.MealPlanService;
import com.hyno.service.PremiumPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/nutrition")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NutritionController {
    private final NutritionProfileService nutritionProfileService;
    private final RecipeService recipeService;
    private final MealPlanService mealPlanService;
    private final PremiumPlanService premiumPlanService;

    // Nutrition Profile Endpoints
    @GetMapping("/profiles")
    public ResponseEntity<List<NutritionProfile>> getAllProfiles() {
        return ResponseEntity.ok(nutritionProfileService.getAllProfiles());
    }

    @GetMapping("/profiles/{id}")
    public ResponseEntity<NutritionProfile> getProfileById(@PathVariable Long id) {
        return nutritionProfileService.getProfileById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/profiles/patient/{patientId}")
    public ResponseEntity<NutritionProfile> getProfileByPatientId(@PathVariable Long patientId) {
        return nutritionProfileService.getProfileByPatientId(patientId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/profiles")
    public ResponseEntity<NutritionProfile> createProfile(@RequestBody NutritionProfile profile) {
        return ResponseEntity.ok(nutritionProfileService.createProfile(profile));
    }

    @PutMapping("/profiles/{id}")
    public ResponseEntity<NutritionProfile> updateProfile(@PathVariable Long id, @RequestBody NutritionProfile profile) {
        return ResponseEntity.ok(nutritionProfileService.updateProfile(id, profile));
    }

    @DeleteMapping("/profiles/{id}")
    public ResponseEntity<Void> deleteProfile(@PathVariable Long id) {
        nutritionProfileService.deleteProfile(id);
        return ResponseEntity.noContent().build();
    }

    // Recipe Endpoints
    @GetMapping("/recipes")
    public ResponseEntity<List<Recipe>> getAllRecipes(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String cuisine,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String search) {
        List<Recipe> recipes;
        if (search != null && !search.trim().isEmpty()) {
            recipes = recipeService.searchRecipes(search);
        } else if (category != null) {
            recipes = recipeService.getRecipesByCategory(category);
        } else if (cuisine != null) {
            recipes = recipeService.getRecipesByCuisine(cuisine);
        } else if (difficulty != null) {
            recipes = recipeService.getRecipesByDifficulty(difficulty);
        } else {
            recipes = recipeService.getAllRecipes();
        }
        return ResponseEntity.ok(recipes);
    }

    @GetMapping("/recipes/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable Long id) {
        return recipeService.getRecipeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/recipes/vegetarian")
    public ResponseEntity<List<Recipe>> getVegetarianRecipes() {
        return ResponseEntity.ok(recipeService.getVegetarianRecipes());
    }

    @GetMapping("/recipes/vegan")
    public ResponseEntity<List<Recipe>> getVeganRecipes() {
        return ResponseEntity.ok(recipeService.getVeganRecipes());
    }

    @GetMapping("/recipes/gluten-free")
    public ResponseEntity<List<Recipe>> getGlutenFreeRecipes() {
        return ResponseEntity.ok(recipeService.getGlutenFreeRecipes());
    }

    @GetMapping("/recipes/dairy-free")
    public ResponseEntity<List<Recipe>> getDairyFreeRecipes() {
        return ResponseEntity.ok(recipeService.getDairyFreeRecipes());
    }

    @PostMapping("/recipes")
    public ResponseEntity<Recipe> createRecipe(@RequestBody Recipe recipe) {
        return ResponseEntity.ok(recipeService.createRecipe(recipe));
    }

    @PutMapping("/recipes/{id}")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable Long id, @RequestBody Recipe recipe) {
        return ResponseEntity.ok(recipeService.updateRecipe(id, recipe));
    }

    @DeleteMapping("/recipes/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        recipeService.deleteRecipe(id);
        return ResponseEntity.noContent().build();
    }

    // Meal Plan Endpoints
    @GetMapping("/meal-plans")
    public ResponseEntity<List<MealPlan>> getAllMealPlans() {
        return ResponseEntity.ok(mealPlanService.getAllMealPlans());
    }

    @GetMapping("/meal-plans/{id}")
    public ResponseEntity<MealPlan> getMealPlanById(@PathVariable Long id) {
        return mealPlanService.getMealPlanById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/meal-plans/patient/{patientId}")
    public ResponseEntity<List<MealPlan>> getMealPlansByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(mealPlanService.getMealPlansByPatientId(patientId));
    }

    @GetMapping("/meal-plans/patient/{patientId}/active")
    public ResponseEntity<List<MealPlan>> getActiveMealPlansByPatientId(@PathVariable Long patientId) {
        return ResponseEntity.ok(mealPlanService.getActiveMealPlansByPatientId(patientId));
    }

    @PostMapping("/meal-plans")
    public ResponseEntity<MealPlan> createMealPlan(@RequestBody MealPlan mealPlan) {
        return ResponseEntity.ok(mealPlanService.createMealPlan(mealPlan));
    }

    @PutMapping("/meal-plans/{id}")
    public ResponseEntity<MealPlan> updateMealPlan(@PathVariable Long id, @RequestBody MealPlan mealPlan) {
        return ResponseEntity.ok(mealPlanService.updateMealPlan(id, mealPlan));
    }

    @PutMapping("/meal-plans/{id}/activate")
    public ResponseEntity<MealPlan> activateMealPlan(@PathVariable Long id) {
        return ResponseEntity.ok(mealPlanService.activateMealPlan(id));
    }

    @PutMapping("/meal-plans/{id}/deactivate")
    public ResponseEntity<MealPlan> deactivateMealPlan(@PathVariable Long id) {
        return ResponseEntity.ok(mealPlanService.deactivateMealPlan(id));
    }

    @DeleteMapping("/meal-plans/{id}")
    public ResponseEntity<Void> deleteMealPlan(@PathVariable Long id) {
        mealPlanService.deleteMealPlan(id);
        return ResponseEntity.noContent().build();
    }

    // Premium Plan Endpoints
    @GetMapping("/premium-plans")
    public ResponseEntity<List<PremiumPlan>> getAllPremiumPlans() {
        return ResponseEntity.ok(premiumPlanService.getAllPremiumPlans());
    }

    @GetMapping("/premium-plans/active")
    public ResponseEntity<List<PremiumPlan>> getActivePremiumPlans() {
        return ResponseEntity.ok(premiumPlanService.getActivePremiumPlans());
    }

    @GetMapping("/premium-plans/{id}")
    public ResponseEntity<PremiumPlan> getPremiumPlanById(@PathVariable Long id) {
        return premiumPlanService.getPremiumPlanById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/premium-plans")
    public ResponseEntity<PremiumPlan> createPremiumPlan(@RequestBody PremiumPlan premiumPlan) {
        return ResponseEntity.ok(premiumPlanService.createPremiumPlan(premiumPlan));
    }

    @PutMapping("/premium-plans/{id}")
    public ResponseEntity<PremiumPlan> updatePremiumPlan(@PathVariable Long id, @RequestBody PremiumPlan premiumPlan) {
        return ResponseEntity.ok(premiumPlanService.updatePremiumPlan(id, premiumPlan));
    }

    @PutMapping("/premium-plans/{id}/activate")
    public ResponseEntity<PremiumPlan> activatePremiumPlan(@PathVariable Long id) {
        return ResponseEntity.ok(premiumPlanService.activatePremiumPlan(id));
    }

    @PutMapping("/premium-plans/{id}/deactivate")
    public ResponseEntity<PremiumPlan> deactivatePremiumPlan(@PathVariable Long id) {
        return ResponseEntity.ok(premiumPlanService.deactivatePremiumPlan(id));
    }

    @DeleteMapping("/premium-plans/{id}")
    public ResponseEntity<Void> deletePremiumPlan(@PathVariable Long id) {
        premiumPlanService.deletePremiumPlan(id);
        return ResponseEntity.noContent().build();
    }
}

package com.hyno.repository;

import com.hyno.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, Long> {
    List<Recipe> findByCategory(String category);

    List<Recipe> findByCuisineType(String cuisineType);

    List<Recipe> findByDifficulty(String difficulty);

    @Query("SELECT r FROM Recipe r WHERE r.isVegetarian = true")
    List<Recipe> findVegetarianRecipes();

    @Query("SELECT r FROM Recipe r WHERE r.isVegan = true")
    List<Recipe> findVeganRecipes();

    @Query("SELECT r FROM Recipe r WHERE r.isGlutenFree = true")
    List<Recipe> findGlutenFreeRecipes();

    @Query("SELECT r FROM Recipe r WHERE r.isDairyFree = true")
    List<Recipe> findDairyFreeRecipes();

    @Query("SELECT r FROM Recipe r WHERE r.caloriesPerServing BETWEEN :minCalories AND :maxCalories")
    List<Recipe> findByCalorieRange(@Param("minCalories") Integer minCalories, @Param("maxCalories") Integer maxCalories);

    @Query("SELECT r FROM Recipe r WHERE LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Recipe> searchByKeyword(@Param("keyword") String keyword);
}

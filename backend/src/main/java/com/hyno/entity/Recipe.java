package com.hyno.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "recipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "category")
    private String category; // breakfast, lunch, dinner, snack, dessert

    @Column(name = "cuisine_type")
    private String cuisineType;

    @Column(name = "prep_time_minutes")
    private Integer prepTimeMinutes;

    @Column(name = "cook_time_minutes")
    private Integer cookTimeMinutes;

    @Column(name = "servings")
    private Integer servings;

    @Column(name = "difficulty")
    private String difficulty; // easy, medium, hard

    @ElementCollection
    @CollectionTable(name = "recipe_ingredients", joinColumns = @JoinColumn(name = "recipe_id"))
    @Column(name = "ingredient")
    private List<String> ingredients;

    @Column(name = "instructions", columnDefinition = "TEXT")
    private String instructions;

    @Column(name = "calories_per_serving")
    private Integer caloriesPerServing;

    @Column(name = "protein_g_per_serving")
    private Double proteinGPerServing;

    @Column(name = "carbs_g_per_serving")
    private Double carbsGPerServing;

    @Column(name = "fat_g_per_serving")
    private Double fatGPerServing;

    @Column(name = "fiber_g_per_serving")
    private Double fiberGPerServing;

    @Column(name = "sugar_g_per_serving")
    private Double sugarGPerServing;

    @Column(name = "sodium_mg_per_serving")
    private Double sodiumMgPerServing;

    @Column(name = "is_vegetarian")
    private Boolean isVegetarian = false;

    @Column(name = "is_vegan")
    private Boolean isVegan = false;

    @Column(name = "is_gluten_free")
    private Boolean isGlutenFree = false;

    @Column(name = "is_dairy_free")
    private Boolean isDairyFree = false;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

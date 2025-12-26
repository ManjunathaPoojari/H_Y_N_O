package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meals")
@Getter
@Setter
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    private Integer calories;
    
    @Column(length = 50)
    private String category; // breakfast, lunch, dinner, snack

    @ElementCollection
    @CollectionTable(name = "meal_ingredients", joinColumns = @JoinColumn(name = "meal_id"))
    @Column(name = "ingredient")
    private List<String> ingredients = new ArrayList<>();

    private String recipe;
    private String image;

    private Integer protein;
    private Integer carbs;
    private Integer fats;
    private Integer fiber;

    @ElementCollection
    @CollectionTable(name = "meal_disease_categories", joinColumns = @JoinColumn(name = "meal_id"))
    @Column(name = "category_name")
    private List<String> diseaseCategories = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "meal_dietary_tags", joinColumns = @JoinColumn(name = "meal_id"))
    @Column(name = "tag")
    private List<String> dietaryTags = new ArrayList<>();

    private Integer cookingTime;
    
    @Column(length = 50)
    private String difficulty; // easy, medium, hard
    
    private Integer servings;
}

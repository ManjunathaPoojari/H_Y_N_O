package com.hyno.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "meal_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MealPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "plan_name", nullable = false)
    private String planName;

    @Column(name = "description")
    private String description;

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Column(name = "total_calories")
    private Integer totalCalories;

    @Column(name = "total_protein_g")
    private Double totalProteinG;

    @Column(name = "total_carbs_g")
    private Double totalCarbsG;

    @Column(name = "total_fat_g")
    private Double totalFatG;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @ElementCollection
    @CollectionTable(name = "meal_plan_meals", joinColumns = @JoinColumn(name = "meal_plan_id"))
    private List<Meal> meals;

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

    @Embeddable
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Meal {
        @Column(name = "day")
        private Integer day;

        @Column(name = "meal_type")
        private String mealType; // breakfast, lunch, dinner, snack

        @Column(name = "recipe_id")
        private Long recipeId;

        @Column(name = "recipe_name")
        private String recipeName;

        @Column(name = "servings")
        private Double servings;
    }
}

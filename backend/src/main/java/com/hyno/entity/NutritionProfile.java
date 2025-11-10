package com.hyno.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "nutrition_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NutritionProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false)
    private Long patientId;

    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "height_cm")
    private Double heightCm;

    @Column(name = "age")
    private Integer age;

    @Column(name = "gender")
    private String gender;

    @Column(name = "activity_level")
    private String activityLevel; // sedentary, lightly_active, moderately_active, very_active

    @Column(name = "dietary_restrictions")
    private String dietaryRestrictions; // comma-separated values

    @Column(name = "health_goals")
    private String healthGoals; // weight_loss, weight_gain, muscle_gain, maintenance

    @Column(name = "calorie_goal")
    private Integer calorieGoal;

    @Column(name = "protein_goal_g")
    private Integer proteinGoalG;

    @Column(name = "carb_goal_g")
    private Integer carbGoalG;

    @Column(name = "fat_goal_g")
    private Integer fatGoalG;

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

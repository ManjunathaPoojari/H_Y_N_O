package com.hyno.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "premium_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PremiumPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plan_name", nullable = false)
    private String planName;

    @Column(name = "description")
    private String description;

    @Column(name = "price_monthly")
    private Double priceMonthly;

    @Column(name = "price_yearly")
    private Double priceYearly;

    @Column(name = "currency")
    private String currency = "USD";

    @ElementCollection
    @CollectionTable(name = "premium_plan_features", joinColumns = @JoinColumn(name = "premium_plan_id"))
    @Column(name = "feature")
    private List<String> features;

    @Column(name = "max_profiles")
    private Integer maxProfiles = 1;

    @Column(name = "max_meal_plans")
    private Integer maxMealPlans = 5;

    @Column(name = "has_personal_coach")
    private Boolean hasPersonalCoach = false;

    @Column(name = "has_advanced_analytics")
    private Boolean hasAdvancedAnalytics = false;

    @Column(name = "has_custom_recipes")
    private Boolean hasCustomRecipes = false;

    @Column(name = "is_active")
    private Boolean isActive = true;

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

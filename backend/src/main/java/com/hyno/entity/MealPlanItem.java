package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "meal_plan_items")
@Getter
@Setter
public class MealPlanItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne
    @JoinColumn(name = "meal_id")
    private Meal meal;

    @Column(length = 50)
    private String status = "pending"; // pending, done, skipped
    
    private String dayOfWeek; // e.g., Monday, or specific date
}

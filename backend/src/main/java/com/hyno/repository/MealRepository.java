package com.hyno.repository;

import com.hyno.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, String> {
    List<Meal> findByCategory(String category);
}

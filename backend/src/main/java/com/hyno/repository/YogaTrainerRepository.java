package com.hyno.repository;

import com.hyno.entity.YogaTrainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface YogaTrainerRepository extends JpaRepository<YogaTrainer, Long> {

    List<YogaTrainer> findByAvailability(YogaTrainer.AvailabilityStatus availability);

    @Query("SELECT t FROM YogaTrainer t WHERE " +
           "LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "EXISTS (SELECT s FROM t.specialties s WHERE LOWER(s) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<YogaTrainer> findByNameOrSpecialty(@Param("search") String search);

    @Query("SELECT t FROM YogaTrainer t WHERE t.availability = :availability AND " +
           "(LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "EXISTS (SELECT s FROM t.specialties s WHERE LOWER(s) LIKE LOWER(CONCAT('%', :search, '%'))))")
    List<YogaTrainer> findByAvailabilityAndNameOrSpecialty(@Param("availability") YogaTrainer.AvailabilityStatus availability,
                                                          @Param("search") String search);

    @Query("SELECT t FROM YogaTrainer t WHERE EXISTS (SELECT s FROM t.specialties s WHERE s IN :specialties)")
    List<YogaTrainer> findBySpecialtiesIn(@Param("specialties") List<String> specialties);

    List<YogaTrainer> findByLocationContainingIgnoreCase(String location);

    @Query("SELECT t FROM YogaTrainer t WHERE t.pricePerSession BETWEEN :minPrice AND :maxPrice")
    List<YogaTrainer> findByPriceRange(@Param("minPrice") java.math.BigDecimal minPrice,
                                      @Param("maxPrice") java.math.BigDecimal maxPrice);

    @Query("SELECT t FROM YogaTrainer t WHERE EXISTS (SELECT m FROM t.modes m WHERE m = :mode)")
    List<YogaTrainer> findByMode(@Param("mode") String mode);

    @Query("SELECT t FROM YogaTrainer t ORDER BY t.rating DESC")
    List<YogaTrainer> findTopRated();

    @Query("SELECT t FROM YogaTrainer t WHERE t.experienceYears >= :years")
    List<YogaTrainer> findByMinimumExperience(@Param("years") Integer years);
}

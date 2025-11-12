package com.hyno.repository;

import com.hyno.entity.Trainer;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, String> {

    List<Trainer> findByAvailability(Trainer.AvailabilityStatus availability);

    List<Trainer> findByTrainerType(Trainer.TrainerType trainerType);

    List<Trainer> findByStatus(String status);

    @Query("SELECT t FROM Trainer t WHERE " +
           "LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "EXISTS (SELECT s FROM t.specialties s WHERE LOWER(s) LIKE LOWER(CONCAT('%', :search, '%'))) OR " +
           "LOWER(t.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Trainer> findByNameOrSpecialtyOrEmail(@Param("search") String search);

    @Query("SELECT t FROM Trainer t WHERE EXISTS (SELECT s FROM t.specialties s WHERE s IN :specialties)")
    List<Trainer> findBySpecialtiesIn(@Param("specialties") List<String> specialties);

    List<Trainer> findByLocationContainingIgnoreCase(String location);

    @Query("SELECT t FROM Trainer t WHERE t.pricePerSession BETWEEN :minPrice AND :maxPrice")
    List<Trainer> findByPriceRange(@Param("minPrice") java.math.BigDecimal minPrice,
                                  @Param("maxPrice") java.math.BigDecimal maxPrice);

    @Query("SELECT t FROM Trainer t WHERE EXISTS (SELECT m FROM t.modes m WHERE m = :mode)")
    List<Trainer> findByMode(@Param("mode") String mode);

    @Query("SELECT t FROM Trainer t ORDER BY t.rating DESC")
    List<Trainer> findTopRated();

    @Query("SELECT t FROM Trainer t WHERE t.experienceYears >= :years")
    List<Trainer> findByMinimumExperience(@Param("years") Integer years);

    @Query("SELECT t FROM Trainer t WHERE t.trainerType = :trainerType AND t.availability = :availability")
    List<Trainer> findByTrainerTypeAndAvailability(@Param("trainerType") Trainer.TrainerType trainerType,
                                                   @Param("availability") Trainer.AvailabilityStatus availability);

    Trainer findByEmail(String email);

    Optional<Trainer> findTopByOrderByIdDesc();
}

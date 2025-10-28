package com.hyno.repository;

import com.hyno.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, String> {

    List<Medicine> findByStatus(String status);

    List<Medicine> findByCategory(String category);

    List<Medicine> findByPrescriptionRequired(String prescriptionRequired);

    @Query("SELECT m FROM Medicine m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(m.genericName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Medicine> searchByNameOrGenericName(@Param("query") String query);

    @Query("SELECT m FROM Medicine m WHERE m.stockQuantity > 0 AND m.status = 'ACTIVE'")
    List<Medicine> findAvailableMedicines();

    List<Medicine> findByManufacturer(String manufacturer);
}

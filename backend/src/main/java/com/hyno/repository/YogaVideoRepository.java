package com.hyno.repository;

import com.hyno.entity.YogaVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface YogaVideoRepository extends JpaRepository<YogaVideo, Long> {

    List<YogaVideo> findByLevel(YogaVideo.DifficultyLevel level);

    List<YogaVideo> findByStyle(String style);

    List<YogaVideo> findByTrainerName(String trainerName);

    @Query("SELECT v FROM YogaVideo v WHERE " +
           "LOWER(v.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.style) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.trainerName) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<YogaVideo> findByTitleOrStyleOrTrainer(@Param("search") String search);

    @Query("SELECT v FROM YogaVideo v WHERE v.level = :level AND " +
           "(LOWER(v.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.style) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.trainerName) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<YogaVideo> findByLevelAndSearch(@Param("level") YogaVideo.DifficultyLevel level,
                                        @Param("search") String search);

    @Query("SELECT v FROM YogaVideo v WHERE v.style = :style AND " +
           "(LOWER(v.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(v.trainerName) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<YogaVideo> findByStyleAndSearch(@Param("style") String style,
                                        @Param("search") String search);

    @Query("SELECT v FROM YogaVideo v WHERE v.durationMinutes BETWEEN :minDuration AND :maxDuration")
    List<YogaVideo> findByDurationRange(@Param("minDuration") Integer minDuration,
                                       @Param("maxDuration") Integer maxDuration);

    @Query("SELECT v FROM YogaVideo v ORDER BY v.viewCount DESC")
    List<YogaVideo> findMostViewed();

    @Query("SELECT v FROM YogaVideo v ORDER BY v.rating DESC")
    List<YogaVideo> findTopRated();

    @Query("SELECT v FROM YogaVideo v WHERE v.rating >= :minRating")
    List<YogaVideo> findByMinimumRating(@Param("minRating") Double minRating);

    @Query("SELECT v FROM YogaVideo v WHERE EXISTS (SELECT b FROM v.benefits b WHERE LOWER(b) LIKE LOWER(CONCAT('%', :benefit, '%')))")
    List<YogaVideo> findByBenefit(@Param("benefit") String benefit);

    List<YogaVideo> findByViewCountGreaterThan(Integer viewCount);
}

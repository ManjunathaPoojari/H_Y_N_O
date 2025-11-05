package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "yoga_videos")
@Data
public class YogaVideo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String trainerName;

    @Column(nullable = false)
    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DifficultyLevel level;

    @Column(nullable = false)
    private String style;

    @Column(nullable = false)
    private Integer viewCount = 0;

    @Column(nullable = false)
    private Double rating;

    @Column(nullable = false)
    private String thumbnail;

    @Column(length = 2000)
    private String description;

    @ElementCollection
    @CollectionTable(name = "video_benefits", joinColumns = @JoinColumn(name = "video_id"))
    @Column(name = "benefit")
    private java.util.List<String> benefits;

    @Column(nullable = false)
    private String videoUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum DifficultyLevel {
        BEGINNER, INTERMEDIATE, ADVANCED
    }
}

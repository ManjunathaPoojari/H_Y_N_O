package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "yoga_poses")
@Data
public class YogaPose {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    private String thumbnail;

    @ElementCollection(targetClass = YogaAudience.class)
    @CollectionTable(name = "yoga_pose_audience", joinColumns = @JoinColumn(name = "pose_id"))
    @Column(name = "audience")
    @Enumerated(EnumType.STRING)
    private List<YogaAudience> allowedAudience = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "yoga_pose_contraindications", joinColumns = @JoinColumn(name = "pose_id"))
    @Column(name = "disease")
    private List<String> contraindicatedDiseases = new ArrayList<>();

    private String riskLevel; // LOW, MEDIUM, HIGH

    private boolean pregnancySafe = false;
    
    private boolean seniorSafe = false;

    // Helper for children as requested in specification
    public boolean isAllowedForChild() {
        return allowedAudience.contains(YogaAudience.CHILD);
    }
}

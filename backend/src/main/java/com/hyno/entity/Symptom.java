package com.hyno.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.ArrayList;
import com.hyno.entity.Recipe;

@Entity
@Table(name = "symptoms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Symptom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @OneToMany(mappedBy = "symptom", fetch = FetchType.LAZY)
    private List<Recipe> recipes = new ArrayList<>();
}

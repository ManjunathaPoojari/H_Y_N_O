package com.hyno.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/yoga/routines")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001", "http://localhost:5173" })
public class YogaRoutineController {

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Map<String, Object>> getRoutineByCategory(@PathVariable String categoryId) {
        Map<String, Object> routine = new HashMap<>();
        List<Map<String, Object>> poses = new ArrayList<>();

        if ("1".equals(categoryId)) { // Beginner
            routine.put("id", "r1");
            routine.put("name", "Morning Awakening");
            routine.put("duration", 900); // 15 mins
            
            poses.add(createPose("Mountain Pose", "Stand tall with feet together, shoulders relaxed, weight evenly distributed. Deep breaths.", "⛰️"));
            poses.add(createPose("Tree Pose", "Shift weight to one leg, place other foot on inner thigh. Hands in prayer position.", "🌳"));
            poses.add(createPose("Child's Pose", "Kneel and sit on your heels, then fold forward resting forehead on the floor.", "👶"));
            poses.add(createPose("Cat-Cow Stretch", "On hands and knees, alternate arching back (Cat) and dropping belly (Cow).", "🐈"));

        } else if ("2".equals(categoryId)) { // Intermediate
            routine.put("id", "r2");
            routine.put("name", "Core Stability");
            routine.put("duration", 1200); // 20 mins

            poses.add(createPose("Downward Dog", "Inverted V-shape. Hands shoulder-width, feet hip-width. Press heels down.", "🐕"));
            poses.add(createPose("Warrior I", "Lunge with back heel down, arms raised overhead. Hips squared forward.", "⚔️"));
            poses.add(createPose("Warrior II", "Lunge with back foot at 90 degrees. Arms parallel to floor, gaze over front hand.", "🏹"));
            poses.add(createPose("Plank Pose", "High push-up position. Core engaged, body in straight line.", "🪵"));
            poses.add(createPose("Boat Pose", "Balance on sit bones, legs lifted, torso back. Arms parallel to floor.", "🚣"));

        } else if ("3".equals(categoryId)) { // Advanced
            routine.put("id", "r3");
            routine.put("name", "Power Flow");
            routine.put("duration", 1800); // 30 mins

            poses.add(createPose("Crow Pose", "Balance on hands, knees resting on upper arms. Feet lifted.", "🦅"));
            poses.add(createPose("Headstand", "Inversion balancing on forearms and head. Core engaged, legs vertical.", "🙃"));
            poses.add(createPose("Wheel Pose", "Backbend with hands and feet on floor, body arched upward.", "🎡"));
            poses.add(createPose("King Pigeon", "Deep backbend in seated hip opener. Hands grasping foot overhead.", "🐦"));
            
        } else if ("4".equals(categoryId)) { // Relaxation
            routine.put("id", "r4");
            routine.put("name", "Stress Relief");
            routine.put("duration", 900); // 15 mins
            
            poses.add(createPose("Easy Pose", "Sit comfortably cross-legged. Hands on knees, spine straight.", "🧘"));
            poses.add(createPose("Legs Up The Wall", "Lie on back with legs vertical against a wall.", "🧱"));
            poses.add(createPose("Reclined Butterfly", "Lie on back, soles of feet together, knees open wide.", "🦋"));
            poses.add(createPose("Corpse Pose", "Lie flat on back, arms by sides, palms up. Complete relaxation.", "💀"));

        } else if ("5".equals(categoryId)) { // Strength
            routine.put("id", "r5");
            routine.put("name", "Full Body Strength");
            routine.put("duration", 1500); // 25 mins
            
            poses.add(createPose("Chair Pose", "Squat as if sitting in a chair, arms raised. Weight in heels.", "🪑"));
            poses.add(createPose("High Lunge", "Deep lunge with back heel lifted. Strong legs.", "🦵"));
            poses.add(createPose("Side Plank", "Balance on one hand and edge of foot. Body straight.", "📐"));
            poses.add(createPose("Chaturanga", "Low plank, elbows close to ribs. Hover above floor.", "💪"));

        } else if ("6".equals(categoryId)) { // Flexibility
            routine.put("id", "r6");
            routine.put("name", "Deep Stretch");
            routine.put("duration", 1200); // 20 mins
            
            poses.add(createPose("Forward Fold", "Stand and hinge at hips to reach towards floor.", "🙇"));
            poses.add(createPose("Triangle Pose", "Wide stance, reach forward and down to shin/floor. Other arm up.", "🔺"));
            poses.add(createPose("Cobra Pose", "Lie on belly, lift chest using back muscles. Hands under shoulders.", "🐍"));
            poses.add(createPose("Seated Forward Bend", "Sit with legs extended, fold forward over legs.", "📏"));

        } else {
            // Default/Fallback
            routine.put("id", "r_def");
            routine.put("name", "General Practice");
            routine.put("duration", 600); // 10 mins
            poses.add(createPose("Easy Pose", "Sit comfortably cross-legged. Hands on knees, spine straight.", "🧘"));
            poses.add(createPose("Corpse Pose", "Lie flat on back, arms by sides, palms up. Complete relaxation.", "💀"));
        }

        routine.put("poses", poses);
        return ResponseEntity.ok(routine);
    }

    private Map<String, Object> createPose(String name, String description, String emoji) {
        Map<String, Object> pose = new HashMap<>();
        pose.put("name", name);
        pose.put("description", description);
        pose.put("emoji", emoji);
        return pose;
    }
}

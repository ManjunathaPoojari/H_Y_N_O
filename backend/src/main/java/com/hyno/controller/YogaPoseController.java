package com.hyno.controller;

import com.hyno.entity.YogaPose;
import com.hyno.service.YogaPoseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/yoga/poses")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001", "http://localhost:5173" })
public class YogaPoseController {

    private final YogaPoseService yogaPoseService;

    @GetMapping("/safe/{patientId}")
    public ResponseEntity<List<YogaPose>> getSafePoses(@PathVariable String patientId) {
        return ResponseEntity.ok(yogaPoseService.getSafePosesForPatient(patientId));
    }

    @GetMapping
    public ResponseEntity<List<YogaPose>> getAllPoses() {
        return ResponseEntity.ok(yogaPoseService.getAllPoses());
    }

    @PostMapping
    public ResponseEntity<YogaPose> createPose(@RequestBody YogaPose pose) {
        return ResponseEntity.ok(yogaPoseService.savePose(pose));
    }
}

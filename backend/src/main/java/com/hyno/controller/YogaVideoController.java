package com.hyno.controller;

import com.hyno.entity.YogaVideo;
import com.hyno.service.YogaVideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/yoga-videos") // Matching the frontend's likely endpoint path
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001", "http://localhost:5173" })
public class YogaVideoController {

    private final YogaVideoService yogaVideoService;

    @GetMapping
    public ResponseEntity<List<YogaVideo>> getAllVideos() {
        return ResponseEntity.ok(yogaVideoService.getAllVideos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<YogaVideo> getVideoById(@PathVariable Long id) {
        return yogaVideoService.getVideoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<YogaVideo>> searchVideos(@RequestParam String query) {
        return ResponseEntity.ok(yogaVideoService.searchVideos(query));
    }
}

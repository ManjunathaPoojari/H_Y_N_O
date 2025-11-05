package com.hyno.service;

import com.hyno.entity.YogaVideo;
import com.hyno.repository.YogaVideoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class YogaVideoService {

    private static final Logger logger = LoggerFactory.getLogger(YogaVideoService.class);

    @Autowired
    private YogaVideoRepository yogaVideoRepository;

    public List<YogaVideo> getAllVideos() {
        logger.info("Fetching all yoga videos");
        try {
            List<YogaVideo> videos = yogaVideoRepository.findAll();
            logger.info("Retrieved {} yoga videos", videos.size());
            return videos;
        } catch (Exception e) {
            logger.error("Error fetching all yoga videos", e);
            throw e;
        }
    }

    public Optional<YogaVideo> getVideoById(Long id) {
        logger.info("Fetching yoga video by ID: {}", id);
        try {
            Optional<YogaVideo> video = yogaVideoRepository.findById(id);
            if (video.isPresent()) {
                logger.info("Yoga video found: {}", id);
            } else {
                logger.warn("Yoga video not found: {}", id);
            }
            return video;
        } catch (Exception e) {
            logger.error("Error fetching yoga video by ID: {}", id, e);
            throw e;
        }
    }

    public List<YogaVideo> getVideosByLevel(YogaVideo.DifficultyLevel level) {
        logger.info("Fetching yoga videos by level: {}", level);
        try {
            List<YogaVideo> videos = yogaVideoRepository.findByLevel(level);
            logger.info("Retrieved {} yoga videos for level: {}", videos.size(), level);
            return videos;
        } catch (Exception e) {
            logger.error("Error fetching yoga videos by level: {}", level, e);
            throw e;
        }
    }

    public List<YogaVideo> getVideosByStyle(String style) {
        logger.info("Fetching yoga videos by style: {}", style);
        try {
            List<YogaVideo> videos = yogaVideoRepository.findByStyle(style);
            logger.info("Retrieved {} yoga videos for style: {}", videos.size(), style);
            return videos;
        } catch (Exception e) {
            logger.error("Error fetching yoga videos by style: {}", style, e);
            throw e;
        }
    }

    public List<YogaVideo> searchVideos(String searchTerm) {
        logger.info("Searching yoga videos with term: {}", searchTerm);
        try {
            List<YogaVideo> videos = yogaVideoRepository.findByTitleOrStyleOrTrainer(searchTerm);
            logger.info("Found {} yoga videos matching search term: {}", videos.size(), searchTerm);
            return videos;
        } catch (Exception e) {
            logger.error("Error searching yoga videos with term: {}", searchTerm, e);
            throw e;
        }
    }

    public List<YogaVideo> getMostViewedVideos() {
        logger.info("Fetching most viewed yoga videos");
        try {
            List<YogaVideo> videos = yogaVideoRepository.findMostViewed();
            logger.info("Retrieved {} most viewed yoga videos", videos.size());
            return videos;
        } catch (Exception e) {
            logger.error("Error fetching most viewed yoga videos", e);
            throw e;
        }
    }

    public List<YogaVideo> getTopRatedVideos() {
        logger.info("Fetching top rated yoga videos");
        try {
            List<YogaVideo> videos = yogaVideoRepository.findTopRated();
            logger.info("Retrieved {} top rated yoga videos", videos.size());
            return videos;
        } catch (Exception e) {
            logger.error("Error fetching top rated yoga videos", e);
            throw e;
        }
    }

    public List<YogaVideo> getVideosByDurationRange(Integer minDuration, Integer maxDuration) {
        logger.info("Fetching yoga videos by duration range: {} - {}", minDuration, maxDuration);
        try {
            List<YogaVideo> videos = yogaVideoRepository.findByDurationRange(minDuration, maxDuration);
            logger.info("Retrieved {} yoga videos in duration range: {} - {}", videos.size(), minDuration, maxDuration);
            return videos;
        } catch (Exception e) {
            logger.error("Error fetching yoga videos by duration range: {} - {}", minDuration, maxDuration, e);
            throw e;
        }
    }

    public List<YogaVideo> getVideosByMinimumRating(Double minRating) {
        logger.info("Fetching yoga videos by minimum rating: {}", minRating);
        try {
            List<YogaVideo> videos = yogaVideoRepository.findByMinimumRating(minRating);
            logger.info("Retrieved {} yoga videos with minimum rating: {}", videos.size(), minRating);
            return videos;
        } catch (Exception e) {
            logger.error("Error fetching yoga videos by minimum rating: {}", minRating, e);
            throw e;
        }
    }

    public List<YogaVideo> getVideosByBenefit(String benefit) {
        logger.info("Fetching yoga videos by benefit: {}", benefit);
        try {
            List<YogaVideo> videos = yogaVideoRepository.findByBenefit(benefit);
            logger.info("Retrieved {} yoga videos with benefit: {}", videos.size(), benefit);
            return videos;
        } catch (Exception e) {
            logger.error("Error fetching yoga videos by benefit: {}", benefit, e);
            throw e;
        }
    }

    public YogaVideo createVideo(YogaVideo video) {
        logger.info("Creating new yoga video: {}", video.getTitle());
        try {
            YogaVideo savedVideo = yogaVideoRepository.save(video);
            logger.info("Yoga video created successfully with ID: {}", savedVideo.getId());
            return savedVideo;
        } catch (Exception e) {
            logger.error("Error creating yoga video: {}", video.getTitle(), e);
            throw e;
        }
    }

    public YogaVideo updateVideo(Long id, YogaVideo videoDetails) {
        logger.info("Updating yoga video: {}", id);
        try {
            Optional<YogaVideo> optionalVideo = yogaVideoRepository.findById(id);
            if (optionalVideo.isPresent()) {
                YogaVideo video = optionalVideo.get();
                video.setTitle(videoDetails.getTitle());
                video.setTrainerName(videoDetails.getTrainerName());
                video.setDurationMinutes(videoDetails.getDurationMinutes());
                video.setLevel(videoDetails.getLevel());
                video.setStyle(videoDetails.getStyle());
                video.setViewCount(videoDetails.getViewCount());
                video.setRating(videoDetails.getRating());
                video.setThumbnail(videoDetails.getThumbnail());
                video.setDescription(videoDetails.getDescription());
                video.setBenefits(videoDetails.getBenefits());
                video.setVideoUrl(videoDetails.getVideoUrl());
                YogaVideo updatedVideo = yogaVideoRepository.save(video);
                logger.info("Yoga video updated successfully: {}", id);
                return updatedVideo;
            } else {
                logger.warn("Yoga video not found for update: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error updating yoga video: {}", id, e);
            throw e;
        }
    }

    public void deleteVideo(Long id) {
        logger.info("Deleting yoga video: {}", id);
        try {
            yogaVideoRepository.deleteById(id);
            logger.info("Yoga video deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting yoga video: {}", id, e);
            throw e;
        }
    }

    public void incrementViewCount(Long id) {
        logger.info("Incrementing view count for yoga video: {}", id);
        try {
            Optional<YogaVideo> optionalVideo = yogaVideoRepository.findById(id);
            if (optionalVideo.isPresent()) {
                YogaVideo video = optionalVideo.get();
                video.setViewCount(video.getViewCount() + 1);
                yogaVideoRepository.save(video);
                logger.info("View count incremented for yoga video: {}", id);
            } else {
                logger.warn("Yoga video not found for view count increment: {}", id);
            }
        } catch (Exception e) {
            logger.error("Error incrementing view count for yoga video: {}", id, e);
            throw e;
        }
    }
}

package com.hyno.service;

import com.hyno.entity.YogaTrainer;
import com.hyno.repository.YogaTrainerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class YogaTrainerService {

    private static final Logger logger = LoggerFactory.getLogger(YogaTrainerService.class);

    @Autowired
    private YogaTrainerRepository yogaTrainerRepository;

    public List<YogaTrainer> getAllTrainers() {
        logger.info("Fetching all yoga trainers");
        try {
            List<YogaTrainer> trainers = yogaTrainerRepository.findAll();
            logger.info("Retrieved {} yoga trainers", trainers.size());
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching all yoga trainers", e);
            throw e;
        }
    }

    public Optional<YogaTrainer> getTrainerById(Long id) {
        logger.info("Fetching yoga trainer by ID: {}", id);
        try {
            Optional<YogaTrainer> trainer = yogaTrainerRepository.findById(id);
            if (trainer.isPresent()) {
                logger.info("Yoga trainer found: {}", id);
            } else {
                logger.warn("Yoga trainer not found: {}", id);
            }
            return trainer;
        } catch (Exception e) {
            logger.error("Error fetching yoga trainer by ID: {}", id, e);
            throw e;
        }
    }

    public List<YogaTrainer> getAvailableTrainers() {
        logger.info("Fetching available yoga trainers");
        try {
            List<YogaTrainer> trainers = yogaTrainerRepository.findByAvailability(YogaTrainer.AvailabilityStatus.AVAILABLE);
            logger.info("Retrieved {} available yoga trainers", trainers.size());
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching available yoga trainers", e);
            throw e;
        }
    }

    public List<YogaTrainer> searchTrainers(String searchTerm) {
        logger.info("Searching yoga trainers with term: {}", searchTerm);
        try {
            List<YogaTrainer> trainers = yogaTrainerRepository.findByNameOrSpecialty(searchTerm);
            logger.info("Found {} yoga trainers matching search term: {}", trainers.size(), searchTerm);
            return trainers;
        } catch (Exception e) {
            logger.error("Error searching yoga trainers with term: {}", searchTerm, e);
            throw e;
        }
    }

    public List<YogaTrainer> getTrainersBySpecialties(List<String> specialties) {
        logger.info("Fetching yoga trainers by specialties: {}", specialties);
        try {
            List<YogaTrainer> trainers = yogaTrainerRepository.findBySpecialtiesIn(specialties);
            logger.info("Retrieved {} yoga trainers with specialties: {}", trainers.size(), specialties);
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching yoga trainers by specialties: {}", specialties, e);
            throw e;
        }
    }

    public List<YogaTrainer> getTrainersByLocation(String location) {
        logger.info("Fetching yoga trainers by location: {}", location);
        try {
            List<YogaTrainer> trainers = yogaTrainerRepository.findByLocationContainingIgnoreCase(location);
            logger.info("Retrieved {} yoga trainers in location: {}", trainers.size(), location);
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching yoga trainers by location: {}", location, e);
            throw e;
        }
    }

    public List<YogaTrainer> getTrainersByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        logger.info("Fetching yoga trainers by price range: {} - {}", minPrice, maxPrice);
        try {
            List<YogaTrainer> trainers = yogaTrainerRepository.findByPriceRange(minPrice, maxPrice);
            logger.info("Retrieved {} yoga trainers in price range: {} - {}", trainers.size(), minPrice, maxPrice);
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching yoga trainers by price range: {} - {}", minPrice, maxPrice, e);
            throw e;
        }
    }

    public List<YogaTrainer> getTrainersByMode(String mode) {
        logger.info("Fetching yoga trainers by mode: {}", mode);
        try {
            List<YogaTrainer> trainers = yogaTrainerRepository.findByMode(mode);
            logger.info("Retrieved {} yoga trainers with mode: {}", trainers.size(), mode);
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching yoga trainers by mode: {}", mode, e);
            throw e;
        }
    }

    public List<YogaTrainer> getTopRatedTrainers() {
        logger.info("Fetching top rated yoga trainers");
        try {
            List<YogaTrainer> trainers = yogaTrainerRepository.findTopRated();
            logger.info("Retrieved {} top rated yoga trainers", trainers.size());
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching top rated yoga trainers", e);
            throw e;
        }
    }

    public YogaTrainer createTrainer(YogaTrainer trainer) {
        logger.info("Creating new yoga trainer: {}", trainer.getName());
        try {
            YogaTrainer savedTrainer = yogaTrainerRepository.save(trainer);
            logger.info("Yoga trainer created successfully with ID: {}", savedTrainer.getId());
            return savedTrainer;
        } catch (Exception e) {
            logger.error("Error creating yoga trainer: {}", trainer.getName(), e);
            throw e;
        }
    }

    public YogaTrainer updateTrainer(Long id, YogaTrainer trainerDetails) {
        logger.info("Updating yoga trainer: {}", id);
        try {
            Optional<YogaTrainer> optionalTrainer = yogaTrainerRepository.findById(id);
            if (optionalTrainer.isPresent()) {
                YogaTrainer trainer = optionalTrainer.get();
                trainer.setName(trainerDetails.getName());
                trainer.setSpecialties(trainerDetails.getSpecialties());
                trainer.setExperienceYears(trainerDetails.getExperienceYears());
                trainer.setRating(trainerDetails.getRating());
                trainer.setReviewCount(trainerDetails.getReviewCount());
                trainer.setLocation(trainerDetails.getLocation());
                trainer.setAvailability(trainerDetails.getAvailability());
                trainer.setModes(trainerDetails.getModes());
                trainer.setQualifications(trainerDetails.getQualifications());
                trainer.setLanguages(trainerDetails.getLanguages());
                trainer.setPricePerSession(trainerDetails.getPricePerSession());
                trainer.setBio(trainerDetails.getBio());
                trainer.setImage(trainerDetails.getImage());
                YogaTrainer updatedTrainer = yogaTrainerRepository.save(trainer);
                logger.info("Yoga trainer updated successfully: {}", id);
                return updatedTrainer;
            } else {
                logger.warn("Yoga trainer not found for update: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error updating yoga trainer: {}", id, e);
            throw e;
        }
    }

    public void deleteTrainer(Long id) {
        logger.info("Deleting yoga trainer: {}", id);
        try {
            yogaTrainerRepository.deleteById(id);
            logger.info("Yoga trainer deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting yoga trainer: {}", id, e);
            throw e;
        }
    }
}

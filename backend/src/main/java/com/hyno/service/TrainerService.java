package com.hyno.service;

import com.hyno.entity.Trainer;
import com.hyno.repository.TrainerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class TrainerService {

    private static final Logger logger = LoggerFactory.getLogger(TrainerService.class);

    @Autowired
    private TrainerRepository trainerRepository;

    public List<Trainer> getAllTrainers() {
        logger.info("Fetching all trainers");
        try {
            List<Trainer> trainers = trainerRepository.findAll();
            logger.info("Retrieved {} trainers", trainers.size());
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching all trainers", e);
            throw e;
        }
    }

    public Optional<Trainer> getTrainerById(String id) {
        logger.info("Fetching trainer by ID: {}", id);
        try {
            Optional<Trainer> trainer = trainerRepository.findById(id);
            if (trainer.isPresent()) {
                logger.info("Trainer found: {}", id);
            } else {
                logger.warn("Trainer not found: {}", id);
            }
            return trainer;
        } catch (Exception e) {
            logger.error("Error fetching trainer by ID: {}", id, e);
            throw e;
        }
    }

    public Optional<Trainer> getTrainerByEmail(String email) {
        logger.info("Fetching trainer by email: {}", email);
        try {
            Trainer trainer = trainerRepository.findByEmail(email);
            if (trainer != null) {
                logger.info("Trainer found by email: {}", email);
                return Optional.of(trainer);
            } else {
                logger.warn("Trainer not found by email: {}", email);
                return Optional.empty();
            }
        } catch (Exception e) {
            logger.error("Error fetching trainer by email: {}", email, e);
            throw e;
        }
    }

    public List<Trainer> getAvailableTrainers() {
        logger.info("Fetching available trainers");
        try {
            List<Trainer> trainers = trainerRepository.findByAvailability(Trainer.AvailabilityStatus.AVAILABLE);
            logger.info("Retrieved {} available trainers", trainers.size());
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching available trainers", e);
            throw e;
        }
    }

    public List<Trainer> getTrainersByType(Trainer.TrainerType trainerType) {
        logger.info("Fetching trainers by type: {}", trainerType);
        try {
            List<Trainer> trainers = trainerRepository.findByTrainerType(trainerType);
            logger.info("Retrieved {} {} trainers", trainers.size(), trainerType);
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching trainers by type: {}", trainerType, e);
            throw e;
        }
    }

    public List<Trainer> getTrainersByStatus(String status) {
        logger.info("Fetching trainers by status: {}", status);
        try {
            List<Trainer> trainers = trainerRepository.findByStatus(status);
            logger.info("Retrieved {} trainers with status: {}", trainers.size(), status);
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching trainers by status: {}", status, e);
            throw e;
        }
    }

    public List<Trainer> searchTrainers(String searchTerm) {
        logger.info("Searching trainers with term: {}", searchTerm);
        try {
            List<Trainer> trainers = trainerRepository.findByNameOrSpecialtyOrEmail(searchTerm);
            logger.info("Found {} trainers matching search term: {}", trainers.size(), searchTerm);
            return trainers;
        } catch (Exception e) {
            logger.error("Error searching trainers with term: {}", searchTerm, e);
            throw e;
        }
    }

    public List<Trainer> getTrainersBySpecialties(List<String> specialties) {
        logger.info("Fetching trainers by specialties: {}", specialties);
        try {
            List<Trainer> trainers = trainerRepository.findBySpecialtiesIn(specialties);
            logger.info("Retrieved {} trainers with specialties: {}", trainers.size(), specialties);
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching trainers by specialties: {}", specialties, e);
            throw e;
        }
    }

    public List<Trainer> getTrainersByLocation(String location) {
        logger.info("Fetching trainers by location: {}", location);
        try {
            List<Trainer> trainers = trainerRepository.findByLocationContainingIgnoreCase(location);
            logger.info("Retrieved {} trainers in location: {}", trainers.size(), location);
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching trainers by location: {}", location, e);
            throw e;
        }
    }

    public List<Trainer> getTrainersByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        logger.info("Fetching trainers by price range: {} - {}", minPrice, maxPrice);
        try {
            List<Trainer> trainers = trainerRepository.findByPriceRange(minPrice, maxPrice);
            logger.info("Retrieved {} trainers in price range: {} - {}", trainers.size(), minPrice, maxPrice);
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching trainers by price range: {} - {}", minPrice, maxPrice, e);
            throw e;
        }
    }

    public List<Trainer> getTrainersByMode(String mode) {
        logger.info("Fetching trainers by mode: {}", mode);
        try {
            List<Trainer> trainers = trainerRepository.findByMode(mode);
            logger.info("Retrieved {} trainers with mode: {}", trainers.size(), mode);
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching trainers by mode: {}", mode, e);
            throw e;
        }
    }

    public List<Trainer> getTopRatedTrainers() {
        logger.info("Fetching top rated trainers");
        try {
            List<Trainer> trainers = trainerRepository.findTopRated();
            logger.info("Retrieved {} top rated trainers", trainers.size());
            return trainers;
        } catch (Exception e) {
            logger.error("Error fetching top rated trainers", e);
            throw e;
        }
    }

    public Trainer createTrainer(Trainer trainer) {
        logger.info("Creating new trainer: {}", trainer.getName());
        try {
            // Generate trainer ID starting from T001 and incrementing
            String nextId = generateNextTrainerId();
            trainer.setId(nextId);
            Trainer savedTrainer = trainerRepository.save(trainer);
            logger.info("Trainer created successfully with ID: {}", savedTrainer.getId());
            return savedTrainer;
        } catch (Exception e) {
            logger.error("Error creating trainer: {}", trainer.getName(), e);
            throw e;
        }
    }

    private String generateNextTrainerId() {
        Optional<Trainer> lastTrainer = trainerRepository.findTopByOrderByIdDesc();
        if (lastTrainer.isPresent()) {
            String lastId = lastTrainer.get().getId();
            if (lastId.startsWith("T")) {
                try {
                    int number = Integer.parseInt(lastId.substring(1));
                    return String.format("T%03d", number + 1);
                } catch (NumberFormatException e) {
                    // If parsing fails, start from T001
                }
            }
        }
        return "T001";
    }

    public Trainer updateTrainer(String id, Trainer trainerDetails) {
        logger.info("Updating trainer: {}", id);
        try {
            Optional<Trainer> optionalTrainer = trainerRepository.findById(id);
            if (optionalTrainer.isPresent()) {
                Trainer trainer = optionalTrainer.get();

                if (trainerDetails.getName() != null) {
                    trainer.setName(trainerDetails.getName());
                }
                if (trainerDetails.getEmail() != null) {
                    trainer.setEmail(trainerDetails.getEmail());
                }
                if (trainerDetails.getPhone() != null) {
                    trainer.setPhone(trainerDetails.getPhone());
                }
                if (trainerDetails.getTrainerType() != null) {
                    trainer.setTrainerType(trainerDetails.getTrainerType());
                }
                if (trainerDetails.getSpecialties() != null) {
                    trainer.setSpecialties(trainerDetails.getSpecialties());
                }
                if (trainerDetails.getExperienceYears() != null) {
                    trainer.setExperienceYears(trainerDetails.getExperienceYears());
                }
                if (trainerDetails.getRating() != null) {
                    trainer.setRating(trainerDetails.getRating());
                }
                if (trainerDetails.getReviewCount() != null) {
                    trainer.setReviewCount(trainerDetails.getReviewCount());
                }
                if (trainerDetails.getLocation() != null) {
                    trainer.setLocation(trainerDetails.getLocation());
                }
                if (trainerDetails.getAvailability() != null) {
                    trainer.setAvailability(trainerDetails.getAvailability());
                }
                if (trainerDetails.getModes() != null) {
                    trainer.setModes(trainerDetails.getModes());
                }
                if (trainerDetails.getQualifications() != null) {
                    trainer.setQualifications(trainerDetails.getQualifications());
                }
                if (trainerDetails.getLanguages() != null) {
                    trainer.setLanguages(trainerDetails.getLanguages());
                }
                if (trainerDetails.getPricePerSession() != null) {
                    trainer.setPricePerSession(trainerDetails.getPricePerSession());
                }
                if (trainerDetails.getBio() != null) {
                    trainer.setBio(trainerDetails.getBio());
                }
                if (trainerDetails.getImage() != null) {
                    trainer.setImage(trainerDetails.getImage());
                }
                if (trainerDetails.getStatus() != null) {
                    trainer.setStatus(trainerDetails.getStatus());
                }
                if (trainerDetails.getPassword() != null) {
                    trainer.setPassword(trainerDetails.getPassword());
                }
                if (trainer.isVerified() != trainerDetails.isVerified()) {
                    trainer.setVerified(trainerDetails.isVerified());
                }

                Trainer updatedTrainer = trainerRepository.save(trainer);
                logger.info("Trainer updated successfully: {}", id);
                return updatedTrainer;
            } else {
                logger.warn("Trainer not found for update: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error updating trainer: {}", id, e);
            throw e;
        }
    }

    public Trainer approveTrainer(String id) {
        logger.info("Approving trainer: {}", id);
        try {
            Optional<Trainer> optionalTrainer = trainerRepository.findById(id);
            if (optionalTrainer.isPresent()) {
                Trainer trainer = optionalTrainer.get();
                trainer.setStatus("approved");
                trainer.setVerified(true);
                Trainer approvedTrainer = trainerRepository.save(trainer);
                logger.info("Trainer approved successfully: {}", id);
                return approvedTrainer;
            } else {
                logger.warn("Trainer not found for approval: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error approving trainer: {}", id, e);
            throw e;
        }
    }

    public Trainer rejectTrainer(String id) {
        logger.info("Rejecting trainer: {}", id);
        try {
            Optional<Trainer> optionalTrainer = trainerRepository.findById(id);
            if (optionalTrainer.isPresent()) {
                Trainer trainer = optionalTrainer.get();
                trainer.setStatus("rejected");
                Trainer rejectedTrainer = trainerRepository.save(trainer);
                logger.info("Trainer rejected successfully: {}", id);
                return rejectedTrainer;
            } else {
                logger.warn("Trainer not found for rejection: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error rejecting trainer: {}", id, e);
            throw e;
        }
    }

    public void deleteTrainer(String id) {
        logger.info("Deleting trainer: {}", id);
        try {
            trainerRepository.deleteById(id);
            logger.info("Trainer deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting trainer: {}", id, e);
            throw e;
        }
    }
}

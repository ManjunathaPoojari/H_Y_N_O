# TODO: Change YogaTrainer.id to Unique String Type (UUID)

## Tasks
- [x] Update YogaTrainer.java: Change id from Long to String, add UUID generation
- [x] Update YogaTrainerRepository.java: Change JpaRepository generic type from Long to String
- [x] Update YogaTrainerService.java: Change method signatures from Long id to String id
- [x] Update YogaController.java: Change @PathVariable from Long to String in trainer endpoints
- [x] Update YogaSessionService.java: Adjust any references to trainer.getId() if needed
- [x] Test the changes to ensure no compilation errors
- [x] Add Google OAuth2 support for patient login

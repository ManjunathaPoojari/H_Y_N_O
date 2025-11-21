-- Direct fix: Try modifying columns directly
-- If this fails due to foreign keys, run find_trainer_foreign_keys.sql first

USE hyno_db;

-- Try modifying columns directly (this will work if no foreign keys exist)
ALTER TABLE trainer_languages MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_specialties MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_modes MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_qualifications MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;


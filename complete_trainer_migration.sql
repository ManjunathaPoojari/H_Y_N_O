-- Direct SQL migration for trainer ID column type
-- Run this in MySQL Workbench or command line

USE hyno_db;

-- First, check what foreign keys exist
SELECT TABLE_NAME, CONSTRAINT_NAME 
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE REFERENCED_TABLE_NAME = 'trainers' AND TABLE_SCHEMA = 'hyno_db';

-- Drop all foreign keys (replace constraint names with actual names from above query)
-- Based on the error, we know at least these exist:
ALTER TABLE trainer_specialties DROP FOREIGN KEY FKbh1r4sm6dbpvwop9savgsu7s4;
ALTER TABLE trainer_modes DROP FOREIGN KEY IF EXISTS FKa1b2c3d4e5f6g7h8i9j0k1l2m3;
ALTER TABLE trainer_qualifications DROP FOREIGN KEY IF EXISTS FKn4o5p6q7r8s9t0u1v2w3x4y5z6;

-- Alter all columns to VARCHAR(50)
-- trainers.id and trainer_languages.trainer_id are already done
ALTER TABLE trainer_specialties MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_modes MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_qualifications MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;

-- Recreate foreign keys with CASCADE delete
ALTER TABLE trainer_languages 
  ADD CONSTRAINT fk_trainer_languages_trainer 
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;

ALTER TABLE trainer_specialties 
  ADD CONSTRAINT fk_trainer_specialties_trainer 
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;

ALTER TABLE trainer_modes 
  ADD CONSTRAINT fk_trainer_modes_trainer 
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;

ALTER TABLE trainer_qualifications 
  ADD CONSTRAINT fk_trainer_qualifications_trainer 
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;

-- Verify the changes
SHOW COLUMNS FROM trainers WHERE Field='id';
SHOW COLUMNS FROM trainer_languages WHERE Field='trainer_id';
SHOW COLUMNS FROM trainer_specialties WHERE Field='trainer_id';
SHOW COLUMNS FROM trainer_modes WHERE Field='trainer_id';
SHOW COLUMNS FROM trainer_qualifications WHERE Field='trainer_id';

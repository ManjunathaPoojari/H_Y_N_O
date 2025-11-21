-- Step 1: Drop all foreign key constraints referencing trainers table
-- Get the constraint names first
SELECT CONCAT('ALTER TABLE ', TABLE_NAME, ' DROP FOREIGN KEY ', CONSTRAINT_NAME, ';') AS drop_statement
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_NAME = 'trainers' 
  AND TABLE_SCHEMA = 'hyno_db';

-- Step 2: Alter the primary key column
ALTER TABLE trainers MODIFY COLUMN id VARCHAR(50) NOT NULL;

-- Step 3: Alter all foreign key columns
ALTER TABLE trainer_languages MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_specialties MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_modes MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_qualifications MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;

-- Step 4: Recreate foreign key constraints
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

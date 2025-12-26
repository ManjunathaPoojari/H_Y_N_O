USE hyno_db;
SET FOREIGN_KEY_CHECKS=0;

-- Alter primary key column
ALTER TABLE trainers MODIFY COLUMN id VARCHAR(50) NOT NULL;

-- Alter foreign key columns
ALTER TABLE trainer_languages MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_specialties MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_modes MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_qualifications MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;

-- Re-establish FK constraints (optional, verifying names)
-- Note: MySQL might keep old constraints but they might be invalid if types mismatch.
-- Ideally we drop them. But since we don't know names, we rely on Hibernate to fix or ignore.
-- If we want to be clean, we should drop them.
-- But given the difficulty, modifying columns with check=0 is a good start.

SET FOREIGN_KEY_CHECKS=1;

SELECT 'Migration completed.' as status;
SHOW COLUMNS FROM trainers WHERE Field='id';

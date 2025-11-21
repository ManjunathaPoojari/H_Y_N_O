-- Fix trainer collection tables to use VARCHAR for trainer_id
-- Run this script in your MySQL database to fix the schema mismatch

USE hyno_db;

-- Step 1: Drop foreign key constraints (if they exist)
SET @dbname = DATABASE();
SET @tablename = 'trainer_languages';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (CONSTRAINT_TYPE = 'FOREIGN KEY')
  ) > 0,
  'SELECT CONCAT("ALTER TABLE ", @tablename, " DROP FOREIGN KEY ", CONSTRAINT_NAME, ";") INTO @sqlst FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE (TABLE_SCHEMA = @dbname) AND (TABLE_NAME = @tablename) AND (CONSTRAINT_TYPE = "FOREIGN KEY") LIMIT 1; PREPARE stmt FROM @sqlst; EXECUTE stmt; DEALLOCATE PREPARE stmt;',
  'SELECT "No foreign keys found"'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @tablename = 'trainer_specialties';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (CONSTRAINT_TYPE = 'FOREIGN KEY')
  ) > 0,
  'SELECT CONCAT("ALTER TABLE ", @tablename, " DROP FOREIGN KEY ", CONSTRAINT_NAME, ";") INTO @sqlst FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE (TABLE_SCHEMA = @dbname) AND (TABLE_NAME = @tablename) AND (CONSTRAINT_TYPE = "FOREIGN KEY") LIMIT 1; PREPARE stmt FROM @sqlst; EXECUTE stmt; DEALLOCATE PREPARE stmt;',
  'SELECT "No foreign keys found"'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @tablename = 'trainer_modes';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (CONSTRAINT_TYPE = 'FOREIGN KEY')
  ) > 0,
  'SELECT CONCAT("ALTER TABLE ", @tablename, " DROP FOREIGN KEY ", CONSTRAINT_NAME, ";") INTO @sqlst FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE (TABLE_SCHEMA = @dbname) AND (TABLE_NAME = @tablename) AND (CONSTRAINT_TYPE = "FOREIGN KEY") LIMIT 1; PREPARE stmt FROM @sqlst; EXECUTE stmt; DEALLOCATE PREPARE stmt;',
  'SELECT "No foreign keys found"'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @tablename = 'trainer_qualifications';
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE
      (TABLE_SCHEMA = @dbname)
      AND (TABLE_NAME = @tablename)
      AND (CONSTRAINT_TYPE = 'FOREIGN KEY')
  ) > 0,
  'SELECT CONCAT("ALTER TABLE ", @tablename, " DROP FOREIGN KEY ", CONSTRAINT_NAME, ";") INTO @sqlst FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE (TABLE_SCHEMA = @dbname) AND (TABLE_NAME = @tablename) AND (CONSTRAINT_TYPE = "FOREIGN KEY") LIMIT 1; PREPARE stmt FROM @sqlst; EXECUTE stmt; DEALLOCATE PREPARE stmt;',
  'SELECT "No foreign keys found"'
));
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Step 2: Modify columns to VARCHAR
ALTER TABLE trainer_languages MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_specialties MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_modes MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_qualifications MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;

-- Step 3: Recreate foreign key constraints (Hibernate will handle this automatically on next startup)
-- Or you can manually add them back if needed:
-- ALTER TABLE trainer_languages ADD CONSTRAINT FK_trainer_languages_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;
-- ALTER TABLE trainer_specialties ADD CONSTRAINT FK_trainer_specialties_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;
-- ALTER TABLE trainer_modes ADD CONSTRAINT FK_trainer_modes_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;
-- ALTER TABLE trainer_qualifications ADD CONSTRAINT FK_trainer_qualifications_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;


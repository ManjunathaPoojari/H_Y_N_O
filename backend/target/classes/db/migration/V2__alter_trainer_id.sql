-- V2__alter_trainer_id.sql
-- Migration to change trainer_id columns to VARCHAR(50)

ALTER TABLE trainers MODIFY COLUMN id VARCHAR(50) NOT NULL;

-- Update foreign key columns in related tables
ALTER TABLE trainer_languages MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_specialties MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_modes MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_qualifications MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;

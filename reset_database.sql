-- COMPLETE DATABASE RESET
-- Run these commands in MySQL Workbench or MySQL command line

-- Step 1: Drop the entire database
DROP DATABASE IF EXISTS hyno_db;

-- Step 2: Create a fresh database
CREATE DATABASE hyno_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Step 3: Verify it's empty
USE hyno_db;
SHOW TABLES;

-- The output should be "Empty set" - no tables should exist
-- Now restart your backend application and Hibernate will create all tables with correct types

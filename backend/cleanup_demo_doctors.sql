-- ============================================
-- Script to Remove Demo/Test Doctors
-- ============================================
-- This script removes all doctors and their associated records
-- Run this script carefully as it will permanently delete data
-- ============================================

-- Step 1: Remove chat room messages (if exists)
DELETE FROM chat_messages WHERE chat_room_id IN (SELECT id FROM chat_rooms WHERE doctor_id IS NOT NULL);

-- Step 2: Remove chat rooms associated with doctors
DELETE FROM chat_rooms WHERE doctor_id IS NOT NULL;

-- Step 3: Remove prescriptions created by doctors
DELETE FROM prescriptions WHERE doctor_id IS NOT NULL;

-- Step 4: Remove appointments with doctors
DELETE FROM appointments WHERE doctor_id IS NOT NULL;

-- Step 5: Remove hospital-doctor associations
DELETE FROM hospital_doctors;

-- Step 6: Remove all doctors
DELETE FROM doctors;

-- Step 7: Verify deletion
SELECT COUNT(*) as remaining_doctors FROM doctors;
SELECT COUNT(*) as remaining_associations FROM hospital_doctors;
SELECT COUNT(*) as remaining_chat_rooms FROM chat_rooms WHERE doctor_id IS NOT NULL;
SELECT COUNT(*) as remaining_appointments FROM appointments WHERE doctor_id IS NOT NULL;

-- ============================================
-- Expected Results:
-- All counts should be 0
-- ============================================

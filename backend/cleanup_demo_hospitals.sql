-- ============================================
-- Script to Remove Demo/Test Hospitals
-- ============================================
-- This script removes all hospitals and their associated records
-- Run this script carefully as it will permanently delete data
-- ============================================

-- Step 1: Remove chat messages for appointments at hospitals
DELETE FROM chat_messages WHERE chat_room_id IN (
    SELECT cr.id FROM chat_rooms cr 
    INNER JOIN appointments a ON cr.appointment_id = a.id 
    WHERE a.hospital_id IS NOT NULL
);

-- Step 2: Remove chat rooms for appointments at hospitals
DELETE FROM chat_rooms WHERE appointment_id IN (
    SELECT id FROM appointments WHERE hospital_id IS NOT NULL
);

-- Step 3: Remove appointments at hospitals
DELETE FROM appointments WHERE hospital_id IS NOT NULL;

-- Step 4: Remove hospital-doctor associations
DELETE FROM hospital_doctors;

-- Step 5: Remove all hospitals
DELETE FROM hospitals;

-- Step 6: Verify deletion
SELECT COUNT(*) as remaining_hospitals FROM hospitals;
SELECT COUNT(*) as remaining_associations FROM hospital_doctors;
SELECT COUNT(*) as remaining_appointments_with_hospitals FROM appointments WHERE hospital_id IS NOT NULL;

-- ============================================
-- Expected Results:
-- All counts should be 0
-- ============================================

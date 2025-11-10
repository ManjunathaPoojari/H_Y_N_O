# Video Call Feature Fixes - TODO List

## Phase 1: Core Video Call Logic ✅
- [x] Simplify initialization flow to prevent race conditions
- [x] Add proper error handling for media permissions
- [x] Fix WebSocket/peer connection synchronization
- [x] Improve connection state management

## Phase 2: User Experience
- [ ] Add appointment time validation (only allow joining within appointment window)
- [ ] Better loading states and error messages
- [ ] Clear visual feedback for connection status
- [ ] Add retry mechanisms for failed connections

## Phase 3: Backend Integration - Video Call Status Tracking
- [ ] Add video call status fields to Appointment entity (videoCallStatus, videoCallStartTime, videoCallEndTime, videoCallDuration)
- [ ] Add methods in AppointmentService to track video call lifecycle (startVideoCall, endVideoCall, updateVideoCallStatus)
- [ ] Add endpoints in AdminController for video call status tracking
- [ ] Update VideoCall component to call backend APIs when call starts/ends

## Phase 4: Testing & Validation
- [ ] Test end-to-end video call flow
- [ ] Add fallback mechanisms
- [ ] Validate appointment timing logic
- [ ] Test video call status tracking integration
- [ ] Update appointment lists to show video call status
- [ ] Add video call history/logs

## Current Task: Phase 3 - Backend Integration - Video Call Status Tracking
- [ ] Step 1: Update Appointment entity with video call fields
- [ ] Step 2: Add video call methods to AppointmentService
- [ ] Step 3: Add video call endpoints to AdminController
- [ ] Step 4: Update VideoCall component to integrate with backend

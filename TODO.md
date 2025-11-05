# Video Call Redesign - Microsoft Teams Style

## Current Status
- Existing video call implementation is functional but has basic UI
- Complex WebRTC peer-to-peer setup with custom signaling
- Simple controls and layout

## Planned Changes

### Phase 1: UI Redesign
- [ ] Create new Teams-inspired VideoCall component
- [ ] Implement meeting header with title and controls
- [ ] Add participant gallery/grid view
- [ ] Create control bar with Teams-style buttons
- [ ] Add chat sidebar with toggle
- [ ] Implement participant list panel
- [ ] Add meeting information display

### Phase 2: Enhanced Controls
- [ ] Add screen share functionality
- [ ] Implement hand raise feature
- [ ] Add more options menu
- [ ] Improve mute/video toggle states
- [ ] Add recording indicator (if needed)
- [ ] Implement picture-in-picture mode

### Phase 3: Backend Integration
- [ ] Update WebSocket signaling if needed
- [ ] Add participant management endpoints
- [ ] Implement screen share signaling
- [ ] Add meeting metadata storage

### Phase 4: Testing & Polish
- [ ] Test all new features
- [ ] Ensure responsive design
- [ ] Add loading states and error handling
- [ ] Optimize performance
- [ ] Add accessibility features

## Files to Modify
- src/components/common/VideoCall.tsx (complete rewrite)
- src/components/doctor/VideoCall.tsx (update wrapper)
- src/lib/websocket-client.ts (add new signaling methods)
- src/types/index.ts (add new types for Teams features)

## New Components Needed
- MeetingHeader component
- ParticipantGrid component
- ControlBar component
- ChatSidebar component
- ParticipantList component
- MeetingInfo component

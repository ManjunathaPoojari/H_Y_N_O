
package com.hyno.controller;

import com.hyno.service.VideoCallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class WebSocketVideoCallController {

    @Autowired
    private VideoCallService videoCallService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Store ParticipantInfo instead of just String IDs
    // AppointmentID -> Map<UserID, ParticipantInfo>
    private static Map<String, Map<String, ParticipantInfo>> appointmentParticipants = new ConcurrentHashMap<>();

    @MessageMapping("/video-call/{appointmentId}/join")
    public void joinVideoCall(
            @DestinationVariable String appointmentId,
            @Payload JoinCallRequest request) {

        // Get or create the participants map for this appointment
        Map<String, ParticipantInfo> participants = appointmentParticipants.computeIfAbsent(appointmentId, k -> new ConcurrentHashMap<>());
        
        // Store the new participant's info
        ParticipantInfo newParticipant = new ParticipantInfo(request.getUserId(), request.getUserName(), request.getUserRole());
        participants.put(request.getUserId(), newParticipant);

        // 1. Notify EVERYONE (including existing users) that a new user joined
        messagingTemplate.convertAndSend(
            "/topic/video-call/" + appointmentId + "/join",
            new JoinCallNotification(request.getUserId(), request.getUserName(), request.getUserRole())
        );

        // 2. Notify the NEW user about ALL EXISTING participants
        // We broadcast this to the room, but client-side filtering (if(fromUserId === myId)) prevents issues for existing users.
        // The new user will receive "Join" events for essentially "re-playing" the room state.
        for (ParticipantInfo existingUser : participants.values()) {
            if (!existingUser.getUserId().equals(request.getUserId())) {
                messagingTemplate.convertAndSend(
                    "/topic/video-call/" + appointmentId + "/join",
                    new JoinCallNotification(existingUser.getUserId(), existingUser.getUserName(), existingUser.getUserRole())
                );
            }
        }
    }

    @MessageMapping("/video-call/{appointmentId}/offer")
    public void handleOffer(
            @DestinationVariable String appointmentId,
            @Payload WebRTCOffer offer) {

        // Broadcast offer to the appointment room
        messagingTemplate.convertAndSend(
            "/topic/video-call/" + appointmentId + "/offer",
            offer
        );
    }

    @MessageMapping("/video-call/{appointmentId}/answer")
    public void handleAnswer(
            @DestinationVariable String appointmentId,
            @Payload WebRTCAnswer answer) {

        // Broadcast answer to the appointment room
        messagingTemplate.convertAndSend(
            "/topic/video-call/" + appointmentId + "/answer",
            answer
        );
    }

    @MessageMapping("/video-call/{appointmentId}/ice-candidate")
    public void handleIceCandidate(
            @DestinationVariable String appointmentId,
            @Payload IceCandidate candidate) {

        // Broadcast ICE candidate to the appointment room
        messagingTemplate.convertAndSend(
            "/topic/video-call/" + appointmentId + "/ice-candidate",
            candidate
        );
    }

    @MessageMapping("/video-call/{appointmentId}/leave")
    public void leaveVideoCall(
            @DestinationVariable String appointmentId,
            @Payload LeaveCallRequest request) {

        // Remove participant from the appointment
        Map<String, ParticipantInfo> participants = appointmentParticipants.get(appointmentId);
        if (participants != null) {
            participants.remove(request.getUserId());
            if (participants.isEmpty()) {
                appointmentParticipants.remove(appointmentId);
            }
            
            // Notify others that someone left the call
            // We can iterate remaining participants or just broadcast to the room topic (simpler/more robust)
             messagingTemplate.convertAndSend(
                "/topic/video-call/" + appointmentId + "/leave",
                new LeaveCallNotification(request.getUserId(), request.getUserName())
            );
        }
    }

    // DTO classes for WebRTC signaling
    public static class JoinCallRequest {
        private String userId;
        private String userName;
        private String userRole;

        public JoinCallRequest() {}

        public JoinCallRequest(String userId, String userName, String userRole) {
            this.userId = userId;
            this.userName = userName;
            this.userRole = userRole;
        }

        // Getters and setters
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }

        public String getUserRole() { return userRole; }
        public void setUserRole(String userRole) { this.userRole = userRole; }
    }

    public static class JoinCallNotification {
        private String userId;
        private String userName;
        private String userRole;

        public JoinCallNotification() {}

        public JoinCallNotification(String userId, String userName, String userRole) {
            this.userId = userId;
            this.userName = userName;
            this.userRole = userRole;
        }

        // Getters and setters
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }

        public String getUserRole() { return userRole; }
        public void setUserRole(String userRole) { this.userRole = userRole; }
    }

    public static class WebRTCOffer {
        private String fromUserId;
        private String offer;

        public WebRTCOffer() {}

        public WebRTCOffer(String fromUserId, String offer) {
            this.fromUserId = fromUserId;
            this.offer = offer;
        }

        // Getters and setters
        public String getFromUserId() { return fromUserId; }
        public void setFromUserId(String fromUserId) { this.fromUserId = fromUserId; }

        public String getOffer() { return offer; }
        public void setOffer(String offer) { this.offer = offer; }
    }

    public static class WebRTCAnswer {
        private String fromUserId;
        private String answer;

        public WebRTCAnswer() {}

        public WebRTCAnswer(String fromUserId, String answer) {
            this.fromUserId = fromUserId;
            this.answer = answer;
        }

        // Getters and setters
        public String getFromUserId() { return fromUserId; }
        public void setFromUserId(String fromUserId) { this.fromUserId = fromUserId; }

        public String getAnswer() { return answer; }
        public void setAnswer(String answer) { this.answer = answer; }
    }

    public static class IceCandidate {
        private String fromUserId;
        private String candidate;
        private Integer sdpMLineIndex;
        private String sdpMid;

        public IceCandidate() {}

        public IceCandidate(String fromUserId, String candidate) {
            this.fromUserId = fromUserId;
            this.candidate = candidate;
        }

        public IceCandidate(String fromUserId, String candidate, Integer sdpMLineIndex, String sdpMid) {
            this.fromUserId = fromUserId;
            this.candidate = candidate;
            this.sdpMLineIndex = sdpMLineIndex;
            this.sdpMid = sdpMid;
        }

        // Getters and setters
        public String getFromUserId() { return fromUserId; }
        public void setFromUserId(String fromUserId) { this.fromUserId = fromUserId; }

        public String getCandidate() { return candidate; }
        public void setCandidate(String candidate) { this.candidate = candidate; }

        public Integer getSdpMLineIndex() { return sdpMLineIndex; }
        public void setSdpMLineIndex(Integer sdpMLineIndex) { this.sdpMLineIndex = sdpMLineIndex; }

        public String getSdpMid() { return sdpMid; }
        public void setSdpMid(String sdpMid) { this.sdpMid = sdpMid; }
    }

    public static class LeaveCallRequest {
        private String userId;
        private String userName;

        public LeaveCallRequest() {}

        public LeaveCallRequest(String userId, String userName) {
            this.userId = userId;
            this.userName = userName;
        }

        // Getters and setters
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
    }

    public static class LeaveCallNotification {
        private String userId;
        private String userName;

        public LeaveCallNotification() {}

        public LeaveCallNotification(String userId, String userName) {
            this.userId = userId;
            this.userName = userName;
        }

        // Getters and setters
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
    }

    // Helper class to store participant info
    public static class ParticipantInfo {
        private String userId;
        private String userName;
        private String userRole;

        public ParticipantInfo(String userId, String userName, String userRole) {
            this.userId = userId;
            this.userName = userName;
            this.userRole = userRole;
        }

        public String getUserId() { return userId; }
        public String getUserName() { return userName; }
        public String getUserRole() { return userRole; }
    }
}

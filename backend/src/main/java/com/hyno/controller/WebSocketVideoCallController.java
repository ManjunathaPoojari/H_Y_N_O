package com.hyno.controller;

import com.hyno.service.VideoCallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketVideoCallController {

    @Autowired
    private VideoCallService videoCallService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/video-call/{appointmentId}/join")
    public void joinVideoCall(
            @DestinationVariable String appointmentId,
            @Payload JoinCallRequest request) {

        // Notify the doctor that a patient wants to join
        messagingTemplate.convertAndSend(
            "/topic/video-call/" + appointmentId + "/join",
            new JoinCallNotification(request.getUserId(), request.getUserName(), request.getUserRole())
        );
    }

    @MessageMapping("/video-call/{appointmentId}/offer")
    public void handleOffer(
            @DestinationVariable String appointmentId,
            @Payload WebRTCOffer offer) {

        // Forward the offer to the other participant
        messagingTemplate.convertAndSend(
            "/topic/video-call/" + appointmentId + "/offer",
            offer
        );
    }

    @MessageMapping("/video-call/{appointmentId}/answer")
    public void handleAnswer(
            @DestinationVariable String appointmentId,
            @Payload WebRTCAnswer answer) {

        // Forward the answer to the other participant
        messagingTemplate.convertAndSend(
            "/topic/video-call/" + appointmentId + "/answer",
            answer
        );
    }

    @MessageMapping("/video-call/{appointmentId}/ice-candidate")
    public void handleIceCandidate(
            @DestinationVariable String appointmentId,
            @Payload IceCandidate candidate) {

        // Forward ICE candidate to the other participant
        messagingTemplate.convertAndSend(
            "/topic/video-call/" + appointmentId + "/ice-candidate",
            candidate
        );
    }

    @MessageMapping("/video-call/{appointmentId}/leave")
    public void leaveVideoCall(
            @DestinationVariable String appointmentId,
            @Payload LeaveCallRequest request) {

        // Notify others that someone left the call
        messagingTemplate.convertAndSend(
            "/topic/video-call/" + appointmentId + "/leave",
            new LeaveCallNotification(request.getUserId(), request.getUserName())
        );
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

        public IceCandidate() {}

        public IceCandidate(String fromUserId, String candidate) {
            this.fromUserId = fromUserId;
            this.candidate = candidate;
        }

        // Getters and setters
        public String getFromUserId() { return fromUserId; }
        public void setFromUserId(String fromUserId) { this.fromUserId = fromUserId; }

        public String getCandidate() { return candidate; }
        public void setCandidate(String candidate) { this.candidate = candidate; }
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
}

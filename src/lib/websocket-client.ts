import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { API_URL } from './config';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'patient' | 'doctor';
  content: string;
  createdAt: string;
  read: boolean;
  messageType?: 'text' | 'image' | 'file';
}

export interface ChatRoom {
  id: string;
  participants: {
    id: string;
    name: string;
    role: 'patient' | 'doctor';
  }[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  status: 'active' | 'archived';
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface VideoCallSignal {
  type: 'join' | 'offer' | 'answer' | 'ice-candidate' | 'leave';
  fromUserId: string;
  userName?: string;
  userRole?: string;
  data?: any;
}

class WebSocketClient {
  private client: Client | null = null;
  private connected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private subscriptionQueue: Array<() => void> = [];
  private publishQueue: Array<{ destination: string; body: string }> = [];

  // Callbacks
  private onMessageReceived?: (message: ChatMessage, chatRoomId: string) => void;
  private onTypingIndicator?: (indicator: TypingIndicator, chatRoomId: string) => void;
  private onMessageRead?: (readerId: string, chatRoomId: string) => void;
  private onConnectionChange?: (connected: boolean) => void;
  private onVideoCallSignal?: (signal: VideoCallSignal, appointmentId: string) => void;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    try {
      this.client = new Client({
        webSocketFactory: () => new SockJS(`${API_URL}/ws`),
        connectHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        debug: () => {
          // Debug logging disabled
        },
        reconnectDelay: this.reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.client.onConnect = (frame) => {
        console.log('WebSocket connected successfully');
        this.connected = true;
        this.reconnectAttempts = 0;
        this.onConnectionChange?.(true);

        // Process queued subscriptions
        while (this.subscriptionQueue.length > 0) {
          const subscribeFn = this.subscriptionQueue.shift();
          if (subscribeFn) {
            subscribeFn();
          }
        }

        // Process queued publishes
        while (this.publishQueue.length > 0) {
          const publishItem = this.publishQueue.shift();
          if (publishItem && this.client) {
            this.client.publish({
              destination: publishItem.destination,
              body: publishItem.body,
            });
          }
        }
      };

      this.client.onStompError = (frame) => {
        console.error('WebSocket STOMP error:', frame.headers['message']);
        console.error('WebSocket error details:', frame.body);
        this.connected = false;
        this.onConnectionChange?.(false);
      };

      this.client.onWebSocketClose = () => {
        this.connected = false;
        this.onConnectionChange?.(false);
        this.attemptReconnect();
      };

      this.client.onWebSocketError = (error) => {
        console.error('WebSocket connection error:', error);
        this.connected = false;
        this.onConnectionChange?.(false);
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket client:', error);
      throw error;
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  connect() {
    if (this.client && !this.connected) {
      this.client.activate();
    }
  }

  disconnect() {
    if (this.client && this.connected) {
      this.client.deactivate();
    }
    this.connected = false;
  }

  subscribeToChatRoom(chatRoomId: string) {
    if (!this.client || !this.connected) {
      console.warn('WebSocket not connected, cannot subscribe to chat room');
      return;
    }

    try {
      // Subscribe to messages in this chat room
      this.client.subscribe(`/topic/chat/${chatRoomId}`, (message) => {
        const chatMessage: ChatMessage = JSON.parse(message.body);
        this.onMessageReceived?.(chatMessage, chatRoomId);
      });

      // Subscribe to read notifications
      this.client.subscribe(`/topic/chat/${chatRoomId}/read`, (message) => {
        const readNotification = JSON.parse(message.body);
        this.onMessageRead?.(readNotification.readerId, chatRoomId);
      });

      // Subscribe to typing indicators
      this.client.subscribe(`/topic/chat/${chatRoomId}/typing`, (message) => {
        const typingIndicator: TypingIndicator = JSON.parse(message.body);
        this.onTypingIndicator?.(typingIndicator, chatRoomId);
      });
    } catch (error) {
      console.error('Failed to subscribe to chat room:', error);
    }
  }

  unsubscribeFromChatRoom(chatRoomId: string) {
    // Note: STOMP client doesn't have direct unsubscribe by destination
    // Subscriptions are managed automatically when reconnecting
  }

  subscribeToVideoCall(appointmentId: string) {
    if (!this.client) {
      // Queue subscription for when connection is established
      this.subscriptionQueue.push(() => this.subscribeToVideoCall(appointmentId));
      return;
    }

    if (!this.connected) {
      console.warn('WebSocket not connected, queuing video call subscription');
      this.subscriptionQueue.push(() => this.subscribeToVideoCall(appointmentId));
      return;
    }

    try {
      // Subscribe to video call signals
      this.client.subscribe(`/topic/video-call/${appointmentId}/join`, (message) => {
        const joinNotification = JSON.parse(message.body);
        this.onVideoCallSignal?.({
          type: 'join',
          fromUserId: joinNotification.userId,
          userName: joinNotification.userName,
          userRole: joinNotification.userRole
        }, appointmentId);
      });

      this.client.subscribe(`/topic/video-call/${appointmentId}/offer`, (message) => {
        const offer = JSON.parse(message.body);
        this.onVideoCallSignal?.({
          type: 'offer',
          fromUserId: offer.fromUserId,
          data: offer.offer
        }, appointmentId);
      });

      this.client.subscribe(`/topic/video-call/${appointmentId}/answer`, (message) => {
        const answer = JSON.parse(message.body);
        this.onVideoCallSignal?.({
          type: 'answer',
          fromUserId: answer.fromUserId,
          data: answer.answer
        }, appointmentId);
      });

      this.client.subscribe(`/topic/video-call/${appointmentId}/ice-candidate`, (message) => {
        const candidate = JSON.parse(message.body);
        this.onVideoCallSignal?.({
          type: 'ice-candidate',
          fromUserId: candidate.fromUserId,
          data: candidate.candidate
        }, appointmentId);
      });

      this.client.subscribe(`/topic/video-call/${appointmentId}/leave`, (message) => {
        const leaveNotification = JSON.parse(message.body);
        this.onVideoCallSignal?.({
          type: 'leave',
          fromUserId: leaveNotification.userId,
          userName: leaveNotification.userName
        }, appointmentId);
      });
    } catch (error) {
      console.error('Failed to subscribe to video call:', error);
    }
  }

  sendMessage(chatRoomId: string, messageData: {
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
  }) {
    if (!this.client || !this.connected) {
      console.warn('WebSocket not connected, queuing message send');
      this.publishQueue.push({
        destination: `/app/chat.send`,
        body: JSON.stringify({
          chatRoomId,
          ...messageData,
        }),
      });
      return;
    }

    try {
      this.client.publish({
        destination: `/app/chat.send`,
        body: JSON.stringify({
          chatRoomId,
          ...messageData,
        }),
      });
    } catch (error) {
      console.error('Failed to send message via WebSocket:', error);
      throw error;
    }
  }

  markAsRead(chatRoomId: string, userId: string, userType: string) {
    if (!this.client || !this.connected) {
      console.warn('WebSocket not connected, queuing mark as read');
      this.publishQueue.push({
        destination: `/app/chat/${chatRoomId}/markAsRead`,
        body: JSON.stringify({
          userId,
          userType,
        }),
      });
      return;
    }

    this.client.publish({
      destination: `/app/chat/${chatRoomId}/markAsRead`,
      body: JSON.stringify({
        userId,
        userType,
      }),
    });
  }

  sendTypingIndicator(chatRoomId: string, userId: string, userName: string, isTyping: boolean) {
    if (!this.client || !this.connected) {
      console.warn('WebSocket not connected, queuing typing indicator');
      this.publishQueue.push({
        destination: `/app/chat/${chatRoomId}/typing`,
        body: JSON.stringify({
          userId,
          userName,
          isTyping,
        }),
      });
      return;
    }

    this.client.publish({
      destination: `/app/chat/${chatRoomId}/typing`,
      body: JSON.stringify({
        userId,
        userName,
        isTyping,
      }),
    });
  }

  joinVideoCall(appointmentId: string, userData: {
    userId: string;
    userName: string;
    userRole: string;
  }) {
    if (!this.client || !this.connected) {
      console.warn('WebSocket not connected, queuing video call join');
      this.publishQueue.push({
        destination: `/app/video-call/${appointmentId}/join`,
        body: JSON.stringify(userData),
      });
      return;
    }

    this.client.publish({
      destination: `/app/video-call/${appointmentId}/join`,
      body: JSON.stringify(userData),
    });
  }

  sendVideoCallOffer(appointmentId: string, offerData: {
    fromUserId: string;
    offer: string;
  }) {
    if (!this.client || !this.connected) {
      console.warn('WebSocket not connected, queuing video call offer');
      this.publishQueue.push({
        destination: `/app/video-call/${appointmentId}/offer`,
        body: JSON.stringify(offerData),
      });
      return;
    }

    this.client.publish({
      destination: `/app/video-call/${appointmentId}/offer`,
      body: JSON.stringify(offerData),
    });
  }

  sendVideoCallAnswer(appointmentId: string, answerData: {
    fromUserId: string;
    answer: string;
  }) {
    if (!this.client || !this.connected) {
      throw new Error('WebSocket not connected');
    }

    this.client.publish({
      destination: `/app/video-call/${appointmentId}/answer`,
      body: JSON.stringify(answerData),
    });
  }

  sendIceCandidate(appointmentId: string, candidateData: {
    fromUserId: string;
    candidate: string;
  }) {
    if (!this.client || !this.connected) {
      throw new Error('WebSocket not connected');
    }

    this.client.publish({
      destination: `/app/video-call/${appointmentId}/ice-candidate`,
      body: JSON.stringify(candidateData),
    });
  }

  leaveVideoCall(appointmentId: string, userData: {
    userId: string;
    userName: string;
  }) {
    if (!this.client || !this.connected) {
      console.warn('WebSocket not connected, cannot leave video call');
      return;
    }

    this.client.publish({
      destination: `/app/video-call/${appointmentId}/leave`,
      body: JSON.stringify(userData),
    });
  }

  // Set callback functions
  setOnMessageReceived(callback: (message: ChatMessage, chatRoomId: string) => void) {
    this.onMessageReceived = callback;
  }

  setOnTypingIndicator(callback: (indicator: TypingIndicator, chatRoomId: string) => void) {
    this.onTypingIndicator = callback;
  }

  setOnMessageRead(callback: (readerId: string, chatRoomId: string) => void) {
    this.onMessageRead = callback;
  }

  setOnConnectionChange(callback: (connected: boolean) => void) {
    this.onConnectionChange = callback;
  }

  setOnVideoCallSignal(callback: (signal: VideoCallSignal, appointmentId: string) => void) {
    this.onVideoCallSignal = callback;
  }

  isConnected(): boolean {
    return this.connected;
  }
}

// Export singleton instance
export const websocketClient = new WebSocketClient();

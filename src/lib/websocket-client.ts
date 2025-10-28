import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { API_URL } from './config';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'patient' | 'doctor';
  content: string;
  timestamp: string;
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

class WebSocketClient {
  private client: Client | null = null;
  private connected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  // Callbacks
  private onMessageReceived?: (message: ChatMessage, chatRoomId: string) => void;
  private onTypingIndicator?: (indicator: TypingIndicator, chatRoomId: string) => void;
  private onMessageRead?: (readerId: string, chatRoomId: string) => void;
  private onConnectionChange?: (connected: boolean) => void;

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

  sendMessage(chatRoomId: string, messageData: {
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
  }) {
    if (!this.client || !this.connected) {
      throw new Error('WebSocket not connected');
    }

    this.client.publish({
      destination: `/app/chat.send`,
      body: JSON.stringify({
        chatRoomId,
        ...messageData,
      }),
    });
  }

  markAsRead(chatRoomId: string, userId: string, userType: string) {
    if (!this.client || !this.connected) {
      console.warn('WebSocket not connected, cannot mark as read');
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

  isConnected(): boolean {
    return this.connected;
  }
}

// Export singleton instance
export const websocketClient = new WebSocketClient();

import { websocketClient } from './websocket-client';

export interface YogaSessionUpdate {
  type: 'session_started' | 'session_completed' | 'trainer_available' | 'trainer_busy' | 'progress_update';
  sessionId?: string;
  trainerId?: string;
  patientId: string;
  data?: any;
}

export interface YogaNotificationSignal {
  type: 'new_video' | 'appointment_reminder' | 'progress_milestone' | 'achievement_unlocked';
  patientId: string;
  title: string;
  message: string;
  data?: any;
}

class YogaWebSocketClient {
  private onSessionUpdate?: (update: YogaSessionUpdate) => void;
  private onNotification?: (notification: YogaNotificationSignal) => void;

  constructor() {
    this.setupYogaSubscriptions();
  }

  private setupYogaSubscriptions() {
    // Subscribe to yoga session updates
    websocketClient.subscribeToYogaSessions?.((update: YogaSessionUpdate) => {
      this.onSessionUpdate?.(update);
    });

    // Subscribe to yoga notifications
    websocketClient.subscribeToYogaNotifications?.((notification: YogaNotificationSignal) => {
      this.onNotification?.(notification);
    });
  }

  // Yoga-specific WebSocket methods
  subscribeToYogaSessions(callback: (update: YogaSessionUpdate) => void) {
    this.onSessionUpdate = callback;
  }

  subscribeToYogaNotifications(callback: (notification: YogaNotificationSignal) => void) {
    this.onNotification = callback;
  }

  sendSessionUpdate(update: YogaSessionUpdate) {
    websocketClient.sendYogaSessionUpdate?.(update);
  }

  sendNotification(notification: YogaNotificationSignal) {
    websocketClient.sendYogaNotification?.(notification);
  }
}

// Extend the main websocket client with yoga methods
declare module './websocket-client' {
  interface WebSocketClient {
    subscribeToYogaSessions?: (callback: (update: YogaSessionUpdate) => void) => void;
    subscribeToYogaNotifications?: (callback: (notification: YogaNotificationSignal) => void) => void;
    sendYogaSessionUpdate?: (update: YogaSessionUpdate) => void;
    sendYogaNotification?: (notification: YogaNotificationSignal) => void;
  }
}

// Export singleton instance
export const yogaWebSocketClient = new YogaWebSocketClient();

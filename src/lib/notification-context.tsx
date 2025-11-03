import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-context';
import api from './api-client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: 'appointment' | 'approval' | 'system' | 'emergency';
  userId?: string;
  relatedId?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'time'>) => void;
  removeNotification: (id: string) => void;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      refreshNotifications();
    }
  }, [user]);

  const refreshNotifications = async () => {
    if (!user) return;

    try {
      // In a real implementation, this would fetch from the backend
      // For now, we'll use mock data based on user role
      const mockNotifications: Notification[] = [];

      if (user.role === 'admin') {
        mockNotifications.push(
          {
            id: '1',
            title: 'New hospital registration',
            message: 'City General Hospital has submitted registration',
            time: '2 min ago',
            unread: true,
            type: 'approval',
            relatedId: 'HOSP001'
          },
          {
            id: '2',
            title: 'Doctor approval pending',
            message: 'Dr. Smith is waiting for approval',
            time: '1 hour ago',
            unread: true,
            type: 'approval',
            relatedId: 'DOC001'
          },
          {
            id: '3',
            title: 'Emergency consultation request',
            message: 'Patient John Doe needs immediate attention',
            time: '5 min ago',
            unread: true,
            type: 'emergency',
            relatedId: 'APP001'
          },
          {
            id: '4',
            title: 'System maintenance',
            message: 'Scheduled maintenance tonight at 11 PM',
            time: '3 hours ago',
            unread: false,
            type: 'system'
          }
        );
      } else if (user.role === 'doctor') {
        mockNotifications.push(
          {
            id: '1',
            title: 'New appointment request',
            message: 'Patient John Doe requested an appointment',
            time: '2 min ago',
            unread: true,
            type: 'appointment',
            relatedId: 'APP001'
          },
          {
            id: '2',
            title: 'Appointment reminder',
            message: 'You have an appointment in 30 minutes',
            time: '30 min ago',
            unread: false,
            type: 'appointment',
            relatedId: 'APP002'
          }
        );
      } else if (user.role === 'patient') {
        mockNotifications.push(
          {
            id: '1',
            title: 'Appointment confirmed',
            message: 'Your appointment with Dr. Smith is confirmed',
            time: '1 hour ago',
            unread: true,
            type: 'appointment',
            relatedId: 'APP001'
          },
          {
            id: '2',
            title: 'Prescription ready',
            message: 'Your prescription is ready for pickup',
            time: '2 hours ago',
            unread: false,
            type: 'appointment',
            relatedId: 'PRE001'
          }
        );
      }

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, unread: false } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'time'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: 'Just now'
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      addNotification,
      removeNotification,
      refreshNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

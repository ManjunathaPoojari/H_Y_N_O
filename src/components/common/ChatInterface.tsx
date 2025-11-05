

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Send, Paperclip, Smile, Wifi, WifiOff, FileText, Pill, User, MessageCircle, Video } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { useAppStore } from '../../lib/app-store';
import { websocketClient, ChatMessage, ChatRoom, TypingIndicator } from '../../lib/websocket-client';
import { chatAPI } from '../../lib/api-client';
import { VideoCall } from './VideoCall';
import ErrorBoundary from './ErrorBoundary';
import { toast } from 'sonner';

interface Message extends ChatMessage {
  sender: string;
  senderRole: 'patient' | 'doctor';
  message: string;
  timestamp: string;
  read: boolean;
}

interface ChatRoomUI {
  id: string;
  name: string;
  participants: string[];
  createdAt: string;
  lastMessage: any;
  lastMessageTime: string;
  unreadCount: number;
  doctorName: string;
  doctorSpecialty: string;
  appointmentId?: string;
  patientId?: string;
  doctorId?: string;
  status?: string;
}

interface ChatInterfaceProps {
  onNavigate?: (path: string) => void;
}

export const ChatInterface = ({ onNavigate }: ChatInterfaceProps) => {
  const { user } = useAuth();
  const { appointments, doctors, refreshData } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoomUI[]>([]);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showVideoCall, setShowVideoCall] = useState(false);

  // Clear chat state when user changes (e.g., switching login)
  useEffect(() => {
    setSelectedChatRoomId(null);
    setMessages([]);
    setChatRooms([]);
    setLoading(true);
  }, [user?.id]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Get appointment ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const appointmentIdFromUrl = urlParams.get('appointmentId');

  // Reload chat rooms when URL changes (e.g., direct navigation to chat with appointmentId)
  useEffect(() => {
    if (user?.id && appointmentIdFromUrl) {
      loadChatRooms();
    }
  }, [appointmentIdFromUrl, user?.id]);

  // Helper function to format timestamp safely
  const formatTimestamp = (timestamp?: string | Date | null): string => {
    try {
      if (!timestamp || timestamp === 'null' || timestamp === '') return '';
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'UPCOMING';
      }
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'UPCOMING';
    }
  };

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChatRoomId]);

  // Load data and chat rooms when component mounts
  useEffect(() => {
    const initializeChat = async () => {
      if (refreshData) {
        await refreshData(); // Wait for data to be refreshed
      }
      // Small delay to ensure state updates
      setTimeout(() => {
        loadChatRooms();
      }, 100);
    };

    if (user?.id) {
      initializeChat();
    }
  }, [user?.id, appointmentIdFromUrl, refreshData]); // Include appointmentIdFromUrl to reload when URL changes

  // Reload chat rooms when appointments or doctors change
  useEffect(() => {
    if (user?.id && appointments.length > 0 && doctors.length > 0) {
      loadChatRooms();
    }
  }, [appointments, doctors, user?.id, appointmentIdFromUrl]);

  // WebSocket connection management
  useEffect(() => {
    // Set up WebSocket callbacks
    websocketClient.setOnConnectionChange(setIsConnected);
    websocketClient.setOnMessageReceived(handleIncomingMessage);
    websocketClient.setOnTypingIndicator(handleTypingIndicator);
    websocketClient.setOnMessageRead(handleMessageRead);

    // Connect to WebSocket
    websocketClient.connect();

    return () => {
      websocketClient.disconnect();
    };
  }, []);

  // Subscribe to selected chat room
  useEffect(() => {
    if (selectedChatRoomId && isConnected) {
      websocketClient.subscribeToChatRoom(selectedChatRoomId);
      loadMessages(selectedChatRoomId);
      markMessagesAsRead(selectedChatRoomId);
    }
  }, [selectedChatRoomId, isConnected]);

  // Ensure chat room exists before sending messages
  const ensureChatRoomExists = async (appointmentId: string) => {
    try {
      await chatAPI.createChatRoom(appointmentId);
    } catch (error) {
      console.warn('Chat room might already exist:', error);
    }
  };

  const loadChatRooms = async () => {
    try {
      if (!user?.id) return;

      // Get user-specific appointments
      const userAppointments = user.role === 'patient'
        ? appointments.filter(apt => apt.patientId === user.id)
        : appointments.filter(apt => apt.doctorId === user.id);

      // Try to load chat rooms from API first
      let apiRooms: any[] = [];
      try {
        apiRooms = await chatAPI.getChatRooms(user.id, user.role);
      } catch (apiError) {
        console.error('Failed to load chat rooms from API:', apiError);
      }

      // Create UI rooms from API rooms - deduplicate by doctor/patient to avoid multiples
      const roomMap = new Map<string, any>();
      apiRooms.forEach((room: any) => {
        const key = user.role === 'doctor' ? room.patientId : room.doctorId;
        if (!roomMap.has(key)) {
          roomMap.set(key, room);
        }
      });
      const uniqueApiRooms = Array.from(roomMap.values());

      let uiRooms: ChatRoomUI[] = uniqueApiRooms.map((room: any) => ({
        ...room,
        doctorName: user.role === 'doctor' ? (room.patientName || 'Unknown Patient') : (room.doctorName || 'Doctor'),
        doctorSpecialty: user.role === 'doctor' ? 'Patient' : (room.doctor?.specialization || 'General Physician'),
        lastMessageTime: room.lastMessageTime ? formatTimestamp(room.lastMessageTime) : '',
        appointmentId: room.appointment?.id,
        status: room.status || 'active',
      }));

      // For appointments that don't have chat rooms yet, create UI-only rooms
      // and ensure chat rooms exist in backend
      for (const appointment of userAppointments) {
        const existingRoom = uiRooms.find(room => room.appointmentId === appointment.id);
        if (!existingRoom) {
          // Try to create chat room in backend
          try {
            const createdRoom = await chatAPI.createChatRoom(appointment.id);
            // Add the created room to UI rooms
            const doctor = user.role === 'patient'
              ? doctors.find(d => d.id === appointment.doctorId)
              : null;
            const patientName = user.role === 'doctor'
              ? (appointment.patientName || 'Unknown Patient')
              : (user.name || 'Patient');

            uiRooms.push({
              id: createdRoom.id,
              name: user.role === 'patient'
                ? `Chat with ${doctor?.name || 'Doctor'}`
                : `Chat with ${patientName}`,
              participants: [appointment.patientId, appointment.doctorId],
              createdAt: appointment.date || new Date().toISOString(),
              lastMessage: null,
              lastMessageTime: '',
              unreadCount: 0,
              doctorName: user.role === 'patient' ? (doctor?.name || 'Doctor') : patientName,
              doctorSpecialty: user.role === 'patient'
                ? (doctor?.specialization || 'General Physician')
                : 'Patient',
              appointmentId: appointment.id,
              patientId: appointment.patientId,
              doctorId: appointment.doctorId,
              status: 'active',
            });
          } catch (createError) {
            console.error('Failed to create chat room for appointment:', appointment.id, createError);
            // Fallback: create UI-only room
            const doctor = user.role === 'patient'
              ? doctors.find(d => d.id === appointment.doctorId)
              : null;
            const patientName = user.role === 'doctor'
              ? (appointment.patientName || 'Unknown Patient')
              : (user.name || 'Patient');

            uiRooms.push({
              id: `chat-${appointment.id}`,
              name: user.role === 'patient'
                ? `Chat with ${doctor?.name || 'Doctor'}`
                : `Chat with ${patientName}`,
              participants: [appointment.patientId, appointment.doctorId],
              createdAt: appointment.date || new Date().toISOString(),
              lastMessage: null,
              lastMessageTime: '',
              unreadCount: 0,
              doctorName: user.role === 'patient' ? (doctor?.name || 'Doctor') : patientName,
              doctorSpecialty: user.role === 'patient'
                ? (doctor?.specialization || 'General Physician')
                : 'Patient',
              appointmentId: appointment.id,
              patientId: appointment.patientId,
              doctorId: appointment.doctorId,
              status: 'active',
            });
          }
        }
      }

      // Remove duplicates based on doctor/patient ID to prevent multiple entries for same person
      const uniqueUiRooms = uiRooms.filter((room, index, self) =>
        index === self.findIndex(r => (user.role === 'doctor' ? r.patientId : r.doctorId) === (user.role === 'doctor' ? room.patientId : room.doctorId))
      );

      setChatRooms(uniqueUiRooms);

      // Select room based on appointmentId from URL or default to first room
      if (appointmentIdFromUrl) {
        const matchingRoom = uiRooms.find(room => room.appointmentId === appointmentIdFromUrl);
        if (matchingRoom) {
          setSelectedChatRoomId(matchingRoom.id);
          loadMessages(matchingRoom.id);
        } else if (uiRooms.length > 0) {
          setSelectedChatRoomId(uiRooms[0].id);
          loadMessages(uiRooms[0].id);
        }
      } else if (uiRooms.length > 0 && !selectedChatRoomId) {
        setSelectedChatRoomId(uiRooms[0].id);
        loadMessages(uiRooms[0].id);
      }
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
      toast.error('Failed to load chat rooms');
    } finally {
      setLoading(false);
    }
  };

  const createChatRoomForAppointment = async (appointmentId: string) => {
    try {
      await chatAPI.createChatRoom(appointmentId);
      toast.success('Chat room created for appointment');
      // Reload chat rooms after creating new one
      loadChatRooms();
    } catch (error) {
      console.error('Failed to create chat room:', error);
      toast.error('Failed to create chat room');
    }
  };

  const loadMessages = async (chatRoomId: string) => {
    try {
      const msgs = await chatAPI.getChatMessages(chatRoomId);

      const uiMessages: Message[] = msgs.map((msg: any) => ({
        ...msg,
        sender: msg.senderName,
        senderRole: msg.senderRole.toLowerCase(),
        message: msg.content,
        timestamp: formatTimestamp(msg.createdAt),
        read: msg.read || false,
      }));
      setMessages(uiMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
      // Don't clear messages on error - keep any existing messages
    }
  };

  const handleIncomingMessage = useCallback((message: ChatMessage, chatRoomId: string) => {
    if (chatRoomId === selectedChatRoomId) {
      // Check if message already exists to prevent duplicates
      setMessages(prev => {
        const messageExists = prev.some(msg => msg.id === message.id);
        if (messageExists) {
          return prev; // Don't add duplicate
        }

        const uiMessage: Message = {
          ...message,
          sender: message.senderName || 'Unknown',
          senderRole: message.senderRole.toLowerCase() as 'patient' | 'doctor',
          message: message.content,
          timestamp: formatTimestamp(message.createdAt),
          read: false,
        };
        return [...prev, uiMessage];
      });
    }

    // Update chat room's last message
    setChatRooms(prev => prev.map(room =>
      room.id === chatRoomId
        ? { ...room, lastMessage: message, lastMessageTime: formatTimestamp(message.createdAt) }
        : room
    ));
  }, [selectedChatRoomId]);

  const handleTypingIndicator = useCallback((indicator: TypingIndicator, chatRoomId: string) => {
    if (chatRoomId === selectedChatRoomId && indicator.userId !== user?.id) {
      setOtherUserTyping(indicator.isTyping);
    }
  }, [selectedChatRoomId, user?.id]);

  const handleMessageRead = useCallback((readerId: string, chatRoomId: string) => {
    if (chatRoomId === selectedChatRoomId && readerId !== user?.id) {
      setMessages(prev => prev.map(msg =>
        msg.senderId !== user?.id ? { ...msg, read: true } : msg
      ));
    }
  }, [selectedChatRoomId, user?.id]);

  const markMessagesAsRead = async (chatRoomId: string) => {
    try {
      if (user?.id) {
        await chatAPI.markMessagesAsRead(chatRoomId, user.id, user.role);
        websocketClient.markAsRead(chatRoomId, user.id, user.role);
      }
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
      // Don't throw error to prevent UI disruption
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChatRoomId || !user) {
      toast.error('Please enter a message');
      return;
    }

    try {
      let chatRoomIdToUse = selectedChatRoomId;
      const selectedRoom = chatRooms.find(room => room.id === selectedChatRoomId);
      const appointmentId = selectedRoom?.appointmentId;

      // If it's a fallback ID (starts with 'chat-'), create the real chat room
      if (selectedChatRoomId.startsWith('chat-') && appointmentId) {
        const createdRoom = await chatAPI.createChatRoom(appointmentId);
        chatRoomIdToUse = createdRoom.id;

        // Update the chat room ID in the UI
        setChatRooms(prev => prev.map(room =>
          room.id === selectedChatRoomId
            ? { ...room, id: createdRoom.id }
            : room
        ));
        setSelectedChatRoomId(createdRoom.id);
      } else {
        // Ensure chat room exists for real IDs
        if (appointmentId) {
          await ensureChatRoomExists(appointmentId);
        }
      }

      const messageData = {
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role.toUpperCase(),
        content: newMessage,
      };

      // Send via WebSocket only - backend will handle persistence
      websocketClient.sendMessage(chatRoomIdToUse, messageData);

      // Clear input immediately
      setNewMessage('');

      // Stop typing indicator
      handleTypingStop();

    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleTypingStart = () => {
    if (!isTyping && selectedChatRoomId && user) {
      setIsTyping(true);
      websocketClient.sendTypingIndicator(selectedChatRoomId, user.id, user.name, true);

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing
      typingTimeoutRef.current = setTimeout(() => {
        handleTypingStop();
      }, 3000);
    }
  };

  const handleTypingStop = () => {
    if (isTyping && selectedChatRoomId && user) {
      setIsTyping(false);
      websocketClient.sendTypingIndicator(selectedChatRoomId, user.id, user.name, false);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (value: string) => {
    setNewMessage(value);
    handleTypingStart();
  };

  // Helper function to check if video call should be enabled
  const isVideoCallEnabled = () => {
    if (!user || user.role !== 'patient' || !selectedChatRoomId) return false;

    const selectedRoom = chatRooms.find(room => room.id === selectedChatRoomId);
    if (!selectedRoom?.appointmentId) return false;

    const appointment = appointments.find(apt => apt.id === selectedRoom.appointmentId);
    if (!appointment || appointment.status !== 'booked') return false;

    // Check if current time is within 15 minutes before appointment time
    const now = new Date();
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds

    return timeDiff > 0 && timeDiff <= fifteenMinutes;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Chat</h1>
        <p className="text-gray-600">Communicate with your {user?.role === 'patient' ? 'doctors' : 'patients'}</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Chat List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Active Chats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Loading active chats...</p>
              </div>
            ) : chatRooms.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">No active chats</p>
                <p className="text-xs text-gray-400 mt-2">
                  {user?.role === 'patient'
                    ? 'Chat rooms will appear here when you book appointments with doctors'
                    : 'Chat rooms will appear here when patients book appointments with you'
                  }
                </p>
              </div>
            ) : (
              chatRooms.map((room) => (
                <div
                  key={room.id}
                  className={`border rounded-lg p-3 cursor-pointer hover:bg-gray-50 ${
                    selectedChatRoomId === room.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onClick={() => setSelectedChatRoomId(room.id)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {(room.doctorName || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="text-sm">{room.doctorName}</h4>
                      <p className="text-xs text-gray-500">{room.doctorSpecialty}</p>
                    </div>
                    {room.unreadCount && room.unreadCount > 0 && (
                      <Badge variant="default" className="text-xs">
                        {room.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 truncate">
                    {room.lastMessage?.content || (
                      <span className="text-blue-600 font-medium">Click to start conversation</span>
                    )}
                  </p>
                  {room.lastMessageTime ? (
                    <p className="text-xs text-gray-400 mt-1">{room.lastMessageTime}</p>
                  ) : (
                    <p className="text-xs text-blue-500 mt-1">New conversation</p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-3">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {chatRooms.find(room => room.id === selectedChatRoomId)?.doctorName.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'DP'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4>{chatRooms.find(room => room.id === selectedChatRoomId)?.doctorName || 'Select a conversation'}</h4>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    <p className="text-xs text-gray-500">
                      {chatRooms.find(room => room.id === selectedChatRoomId)?.doctorSpecialty || 'Online'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {user?.role === 'patient' && (
                  <Button size="sm" variant="outline">
                    <User className="h-4 w-4 mr-2" />
                    View Profile
                  </Button>
                )}
                {user?.role === 'doctor' && (
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Patient History
                  </Button>
                )}
                {isVideoCallEnabled() && user?.role === 'patient' && selectedChatRoomId && (
                  <Dialog open={showVideoCall} onOpenChange={setShowVideoCall}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Video className="h-4 w-4 mr-2" />
                        Video Call
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] w-[95vw] sm:w-[90vw]">
                      <DialogHeader>
                        <DialogTitle>Video Consultation</DialogTitle>
                      </DialogHeader>
                      <div className="h-[60vh]">
                        <ErrorBoundary>
                          <VideoCall
                            appointmentId={chatRooms.find(room => room.id === selectedChatRoomId)?.appointmentId || ''}
                          />
                        </ErrorBoundary>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {!isVideoCallEnabled() && user?.role === 'patient' && selectedChatRoomId && (
                  <Button size="sm" variant="outline" disabled>
                    <Video className="h-4 w-4 mr-2" />
                    Video Call
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && selectedChatRoomId ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <MessageCircle className="h-12 w-12 mx-auto mb-2" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Send a message to begin chatting with your {user?.role === 'patient' ? 'doctor' : 'patient'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Messages are secure and private between you and your healthcare provider
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderRole === user?.role ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md ${msg.senderRole === user?.role ? 'order-2' : 'order-1'}`}>
                      {msg.senderRole !== user?.role && (
                        <p className="text-xs text-gray-500 mb-1">{msg.sender}</p>
                      )}
                      <div
                        className={`rounded-lg p-3 ${
                          msg.senderRole === user?.role
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.senderRole === user?.role ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" disabled>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button size="sm" variant="ghost" disabled>
                  <Smile className="h-4 w-4" />
                </Button>
                {user?.role === 'doctor' && (
                  <Button size="sm" variant="outline" disabled>
                    <Pill className="h-4 w-4 mr-2" />
                    Prescribe
                  </Button>
                )}
                <Button size="sm" onClick={handleSendMessage}>
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

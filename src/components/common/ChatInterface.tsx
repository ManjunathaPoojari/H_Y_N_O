
import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Send, Paperclip, Smile, Wifi, WifiOff, FileText, Pill, User, MessageCircle } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { useAppStore } from '../../lib/app-store';
import { websocketClient, ChatMessage, ChatRoom, TypingIndicator } from '../../lib/websocket-client';
import { chatAPI } from '../../lib/api-client';
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
  status?: string;
}

export const ChatInterface = () => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Get appointment ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const appointmentId = urlParams.get('appointmentId');

  // Helper function to format timestamp safely
  const formatTimestamp = (timestamp?: string | Date | null) => {
    try {
      if (!timestamp || timestamp === 'null' || timestamp === '') return '';
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return 'Invalid Date';
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
  }, [user?.id, appointments, doctors]); // Include appointments and doctors to reload when they change

  // Reload chat rooms when appointments or doctors change
  useEffect(() => {
    if (user?.id && appointments.length > 0 && doctors.length > 0) {
      loadChatRooms();
    }
  }, [appointments, doctors, user?.id]);

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

  const loadChatRooms = async () => {
    try {
      if (!user?.id) return;

      // For patients, create chat rooms based on their appointments
      if (user.role === 'patient') {
        const patientAppointments = appointments.filter(apt => apt.patientId === user.id);
        const uiRooms: ChatRoomUI[] = patientAppointments.map((appointment) => {
          const doctor = doctors.find(d => d.id === appointment.doctorId);
          return {
            id: `chat-${appointment.id}`,
            name: `Chat with ${doctor?.name || 'Doctor'}`,
            participants: [user.id, appointment.doctorId],
            createdAt: appointment.date,
            lastMessage: null,
            lastMessageTime: '',
            unreadCount: 0,
            doctorName: doctor?.name || 'Doctor',
            doctorSpecialty: doctor?.specialization || 'General Physician',
            appointmentId: appointment.id,
            status: 'active',
          };
        });

        setChatRooms(uiRooms);

        // Select room based on appointmentId from URL or default to first room
        if (appointmentId) {
          const matchingRoom = uiRooms.find(room => room.appointmentId === appointmentId);
          if (matchingRoom) {
            setSelectedChatRoomId(matchingRoom.id);
            // Load messages for the selected room
            loadMessages(matchingRoom.id);
          } else if (uiRooms.length > 0) {
            // If no matching room found, select first available
            setSelectedChatRoomId(uiRooms[0].id);
            loadMessages(uiRooms[0].id);
          }
        } else if (uiRooms.length > 0 && !selectedChatRoomId) {
          setSelectedChatRoomId(uiRooms[0].id);
          loadMessages(uiRooms[0].id);
        }
      } else {
        // For doctors, load chat rooms from backend
        const rooms = await chatAPI.getChatRooms(user.id, user.role);
        const uiRooms: ChatRoomUI[] = rooms.map((room: any) => ({
          ...room,
          doctorName: room.doctorName,
          doctorSpecialty: room.doctor?.specialization || 'General Physician',
          lastMessageTime: room.lastMessageTime ? formatTimestamp(room.lastMessageTime) : '',
          appointmentId: room.appointment?.id,
        }));

        setChatRooms(uiRooms);

        if (uiRooms.length > 0 && !selectedChatRoomId) {
          setSelectedChatRoomId(uiRooms[0].id);
          loadMessages(uiRooms[0].id);
        }
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
    } catch (error) {
      console.error('Failed to create chat room:', error);
      toast.error('Failed to create chat room');
    }
  };

  const loadMessages = async (chatRoomId: string) => {
    try {
      // Clear existing messages to ensure real-time only
      setMessages([]);

      const msgs = await chatAPI.getChatMessages(chatRoomId);
      // Only load messages from the last 24 hours to keep it real-time focused
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const recentMsgs = msgs.filter((msg: any) => {
        const msgDate = new Date(msg.timestamp);
        return msgDate >= oneDayAgo;
      });

      const uiMessages: Message[] = recentMsgs.map((msg: any) => ({
        ...msg,
        sender: msg.senderName,
        senderRole: msg.senderRole.toLowerCase(),
        message: msg.content,
        timestamp: formatTimestamp(msg.timestamp),
      }));
      setMessages(uiMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleIncomingMessage = useCallback((message: ChatMessage, chatRoomId: string) => {
    if (chatRoomId === selectedChatRoomId) {
      const uiMessage: Message = {
        ...message,
        sender: message.senderName,
        senderRole: message.senderRole.toLowerCase() as 'patient' | 'doctor',
        message: message.content,
        timestamp: formatTimestamp(message.timestamp),
      };
      setMessages(prev => [...prev, uiMessage]);
    }

    // Update chat room's last message
    setChatRooms(prev => prev.map(room =>
      room.id === chatRoomId
        ? { ...room, lastMessage: message, lastMessageTime: formatTimestamp(message.timestamp) }
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
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChatRoomId || !user) {
      toast.error('Please enter a message');
      return;
    }

    try {
      const messageData = {
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role.toUpperCase(),
        content: newMessage,
      };

      // Send via API first (fallback if WebSocket fails)
      await chatAPI.sendMessage(selectedChatRoomId, messageData);

      // Send via WebSocket
      websocketClient.sendMessage(selectedChatRoomId, messageData);

      // Optimistically add to UI
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role as 'patient' | 'doctor',
        content: newMessage,
        sender: user.name,
        message: newMessage,
        timestamp: formatTimestamp(new Date()),
        read: false,
      };

      setMessages(prev => [...prev, optimisticMessage]);
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
                        {room.doctorName.split(' ').map(n => n[0]).join('').toUpperCase()}
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
                <Button size="sm" variant="outline" disabled>
                  Video Call
                </Button>
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



import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Send, Paperclip, Smile, Wifi, WifiOff, FileText, Pill,
  User, MessageCircle, Video, Check, CheckCheck, Loader2, Save, X
} from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { useAppStore } from '../../lib/app-store';
import { websocketClient, ChatMessage, ChatRoom, TypingIndicator } from '../../lib/websocket-client';
import { chatAPI, appointmentAPI } from '../../lib/api-client';
import { generatePrescriptionPDF, blobToDataURL } from '../../lib/pdf-utils';
import { VideoCall } from './VideoCall';
import ErrorBoundary from './ErrorBoundary';
import { toast } from 'sonner';

interface Message extends ChatMessage {
  sender: string;
  senderRole: 'patient' | 'doctor';
  // Standardized to 'content' from base ChatMessage
  timestamp: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
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
  patientName?: string;
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
  const [isPrescriptionOpen, setIsPrescriptionOpen] = useState(false);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  const [prescriptionMedicines, setPrescriptionMedicines] = useState('');
  const [isSavingPrescription, setIsSavingPrescription] = useState(false);

  const commonEmojis = ['😊', '👍', '🙏', '💊', '👨‍⚕️', '👋', '❤️', '✅', '🏥', '📅'];

  // Clear chat state when user changes (e.g., switching login)
  useEffect(() => {
    setSelectedChatRoomId(null);
    setMessages([]);
    setChatRooms([]);
    setLoading(true);
  }, [user?.id]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadChatRoomsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingChatRooms = useRef<boolean>(false);

  // Get appointment ID from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const appointmentIdFromUrl = urlParams.get('appointmentId');

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

  // Debounced loadChatRooms to prevent spam
  const debouncedLoadChatRooms = useCallback(() => {
    // Clear any pending load
    if (loadChatRoomsTimeoutRef.current) {
      clearTimeout(loadChatRoomsTimeoutRef.current);
    }

    // Prevent concurrent loads
    if (isLoadingChatRooms.current) {
      return;
    }

    // Debounce by 500ms
    loadChatRoomsTimeoutRef.current = setTimeout(() => {
      loadChatRooms();
    }, 500);
  }, [user?.id, user?.role]);

  // Single unified effect for loading chat rooms
  useEffect(() => {
    if (user?.id) {
      const initializeChat = async () => {
        if (refreshData) {
          await refreshData();
        }
        // Load chat rooms with debounce
        debouncedLoadChatRooms();
      };
      initializeChat();
    }

    return () => {
      if (loadChatRoomsTimeoutRef.current) {
        clearTimeout(loadChatRoomsTimeoutRef.current);
      }
    };
  }, [user?.id, appointmentIdFromUrl]);

  // Reload chat rooms when appointments or doctors change (but debounced)
  useEffect(() => {
    if (user?.id && appointments.length > 0 && doctors.length > 0) {
      debouncedLoadChatRooms();
    }
  }, [appointments.length, doctors.length]);

  // WebSocket connection management
  useEffect(() => {
    // Set up WebSocket callbacks
    websocketClient.setOnConnectionChange(setIsConnected);
    websocketClient.setOnMessageReceived(handleIncomingMessage);
    websocketClient.setOnTypingIndicator(handleTypingIndicator);
    websocketClient.setOnMessageRead(handleMessageRead);
    websocketClient.setOnMessageDelivered(handleMessageDelivered);

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
      if (!user?.id || isLoadingChatRooms.current) return;

      isLoadingChatRooms.current = true;

      // Get user-specific appointments
      const userAppointments = user.role === 'patient'
        ? appointments.filter(apt => apt.patientId === user.id)
        : appointments.filter(apt => apt.doctorId === user.id);

      // Try to load chat rooms from API first
      let apiRooms: any[] = [];
      try {
        apiRooms = await chatAPI.getChatRooms(user.id, user.role);
        console.log('📡 [CHAT] Raw API Rooms:', apiRooms);
      } catch (apiError) {
        console.error('Failed to load chat rooms from API:', apiError);
      }

      // Create UI rooms from API rooms - deduplicate by doctor/patient to avoid multiples
      const roomMap = new Map<string, any>();
      apiRooms.forEach((room: any) => {
        // Robust key discovery using IDs or names if missing
        let pId = room.patientId || room.patient?.id;
        let dId = room.doctorId || room.doctor?.id;

        if (!pId || !dId) {
          const match = appointments.find(apt =>
            (apt.patientName === room.patientName || apt.patientId === (user.role === 'patient' ? user.id : null)) &&
            (apt.doctorName === room.doctorName || apt.doctorId === (user.role === 'doctor' ? user.id : null))
          );
          if (match) {
            pId = pId || match.patientId;
            dId = dId || match.doctorId;
          }
        }

        const key = user.role === 'doctor' ? pId : dId;

        if (key && !roomMap.has(key)) {
          roomMap.set(key, room);
        } else if (!key) {
          // If no key found, use room ID as fallback to avoid losing the room
          roomMap.set(room.id, room);
        }
      });
      const uniqueApiRooms = Array.from(roomMap.values());

      let uiRooms: ChatRoomUI[] = uniqueApiRooms.map((room: any) => {
        const isPatient = user.role === 'patient';

        // Final multi-stage ID recovery for the UI object
        let appointmentId = room.appointmentId || room.appointment?.id;
        let patientId = room.patientId || room.patient?.id;
        let doctorId = room.doctorId || room.doctor?.id;

        // Ensure current user ID is present
        if (user.role === 'doctor' && !doctorId) doctorId = user.id;
        if (user.role === 'patient' && !patientId) patientId = user.id;

        // Link missing fields from store using name matching
        if (!appointmentId || !patientId || !doctorId) {
          const matchingApt = appointments.find(apt => {
            // Normalize strings for comparison
            const roomPName = (room.patientName || '').trim().toLowerCase();
            const roomDName = (room.doctorName || '').trim().toLowerCase();
            const aptPName = (apt.patientName || '').trim().toLowerCase();
            const aptDName = (apt.doctorName || '').trim().toLowerCase();

            // Extract IDs from various possible locations in appointment object
            const aptPId = apt.patientId || (apt as any).patient?.id;
            const aptDId = apt.doctorId || (apt as any).doctor?.id;

            // SOFT MATCHING: Names must match. IDs only MUST match if both are present.
            const pMatch = (roomPName && aptPName === roomPName) && (!patientId || !aptPId || patientId === aptPId);
            const dMatch = (roomDName && aptDName === roomDName || user.role === 'doctor') && (!doctorId || !aptDId || doctorId === aptDId);

            return pMatch && dMatch;
          });

          if (matchingApt) {
            appointmentId = appointmentId || matchingApt.id;
            patientId = patientId || matchingApt.patientId || (matchingApt.patient as any)?.id;
            doctorId = doctorId || matchingApt.doctorId || (matchingApt.doctor as any)?.id;
            console.log('🔍 [CHAT] Recovered missing IDs for room:', room.id, { patientId, doctorId, appointmentId });
          }
        }

        return {
          ...room,
          doctorName: isPatient ? (room.doctorName || 'Doctor') : (room.patientName || 'Patient'),
          doctorSpecialty: isPatient ? (room.doctor?.specialization || 'General Physician') : 'Patient',
          lastMessageTime: room.lastMessageTime ? formatTimestamp(room.lastMessageTime) : '',
          unreadCount: isPatient ? (room.unreadCountPatient || 0) : (room.unreadCountDoctor || 0),
          appointmentId: appointmentId,
          patientId: patientId,
          doctorId: doctorId,
          patientName: room.patientName,

          status: room.status || 'active',
        };
      });

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
              participants: [appointment.patientId || '', appointment.doctorId || ''].filter(Boolean),
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
              participants: [appointment.patientId || '', appointment.doctorId || ''].filter(Boolean),
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
        console.log('🔄 [CHAT] Searching for room with appointmentId:', appointmentIdFromUrl);
        const matchingRoom = uniqueUiRooms.find(room => room.appointmentId === appointmentIdFromUrl);
        if (matchingRoom) {
          console.log('✅ [CHAT] Auto-selecting room from URL:', matchingRoom.id);
          setSelectedChatRoomId(matchingRoom.id);
          loadMessages(matchingRoom.id);
        } else if (uniqueUiRooms.length > 0 && !selectedChatRoomId) {
          console.log('⚠️ [CHAT] URL appointmentId not found, selecting first room');
          setSelectedChatRoomId(uniqueUiRooms[0].id);
          loadMessages(uniqueUiRooms[0].id);
        }
      } else if (uniqueUiRooms.length > 0 && !selectedChatRoomId) {
        console.log('ℹ️ [CHAT] No URL param, selecting first available room:', uniqueUiRooms[0].id);
        setSelectedChatRoomId(uniqueUiRooms[0].id);
        loadMessages(uniqueUiRooms[0].id);
      }
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
      toast.error('Failed to load chat rooms');
    } finally {
      setLoading(false);
      isLoadingChatRooms.current = false;
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
        content: msg.content,
        timestamp: formatTimestamp(msg.createdAt),
        read: msg.read || false,
        messageType: msg.messageType ? msg.messageType.toLowerCase() : 'text',
        fileUrl: msg.fileUrl,
        fileName: msg.fileName,
        fileSize: msg.fileSize,
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
          content: message.content,
          timestamp: formatTimestamp(message.createdAt),
          read: message.read || false,
          status: message.status || 'SENT',
          fileUrl: message.fileUrl,
          fileName: message.fileName,
          fileSize: message.fileSize,
          messageType: message.messageType ? (message.messageType as string).toLowerCase() as any : 'text'
        };

        // If message is from OTHER person, mark it as delivered automatically
        if (message.senderId !== user?.id) {
          websocketClient.markAsDelivered(chatRoomId, user?.id || '', user?.role || '');
        }

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
        msg.senderId === user?.id ? { ...msg, read: true, status: 'READ' } : msg
      ));
    }
  }, [selectedChatRoomId, user?.id]);

  const handleMessageDelivered = useCallback((deliveredUserId: string, chatRoomId: string) => {
    if (chatRoomId === selectedChatRoomId && deliveredUserId !== user?.id) {
      setMessages(prev => prev.map(msg =>
        (msg.senderId === user?.id && msg.status === 'SENT') ? { ...msg, status: 'DELIVERED' } : msg
      ));
    }
  }, [selectedChatRoomId, user?.id]);

  const markMessagesAsRead = async (chatRoomId: string) => {
    try {
      // Strict UUID validation to prevent backend parsing errors
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

      if (user?.id && chatRoomId && uuidRegex.test(chatRoomId)) {
        await chatAPI.markMessagesAsRead(chatRoomId, user.id, user.role);
        websocketClient.markAsRead(chatRoomId, user.id, user.role);
      } else if (chatRoomId && !chatRoomId.startsWith('chat-')) {
        console.warn('Skipping markMessagesAsRead for invalid UUID format:', chatRoomId);
      }
    } catch (error: any) {
      // Extract detailed error if available from backend
      const detail = error.message || 'Unknown error';
      console.error(`Failed to mark messages as read for room ${chatRoomId}:`, detail);
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

      // Optimistic Update: Add message to list immediately
      const optimisticId = `temp-${Date.now()}`;
      const uiMessage: Message = {
        id: optimisticId,
        ...messageData,
        sender: user.name,
        senderRole: user.role.toLowerCase() as 'patient' | 'doctor',
        content: newMessage,
        timestamp: formatTimestamp(new Date()),
        read: false,
        status: 'SENT',
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, uiMessage]);

      // Optimistic Update: Update sidebar
      setChatRooms(prev => prev.map(room =>
        room.id === chatRoomIdToUse
          ? { ...room, lastMessage: { content: newMessage }, lastMessageTime: formatTimestamp(new Date()) }
          : room
      ));

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

  const handleSavePrescription = async () => {
    let selectedRoom = chatRooms.find(room => room.id === selectedChatRoomId);

    // Robust fallback: if room is missing but we have an ID, try to re-find from state
    if (!selectedRoom && selectedChatRoomId) {
      console.log('🔄 [PRESCRIPTION] Room not found in current list, re-searching state...');
      selectedRoom = chatRooms.find(r => r.id === selectedChatRoomId);
    }

    console.log('💊 [PRESCRIPTION] Attempting to save. Selected room:', JSON.stringify({
      id: selectedRoom?.id,
      appointmentId: selectedRoom?.appointmentId,
      patientId: selectedRoom?.patientId,
      doctorId: selectedRoom?.doctorId,
      patientName: selectedRoom?.patientName,
      doctorName: selectedRoom?.doctorName,
      hasUser: !!user
    }, null, 2));

    // FINAL RECOVERY: If appointmentId is missing, try one last check in the global state
    if (selectedRoom && !selectedRoom.appointmentId && user) {
      const pId = selectedRoom.patientId || (user.role === 'patient' ? user.id : null);
      const dId = selectedRoom.doctorId || (user.role === 'doctor' ? user.id : null);

      const pName = (selectedRoom.patientName || '').trim().toLowerCase();
      const dName = (selectedRoom.doctorName || '').trim().toLowerCase();

      console.log('💊 [PRESCRIPTION] Room missing appointmentId. Emergency recovery with:', { pId, dId, pName, dName, totalApts: appointments.length });

      const fallbackApt = appointments.find(apt => {
        const aptPId = apt.patientId;
        const aptDId = apt.doctorId;
        const aptPName = (apt.patientName || '').trim().toLowerCase();
        const aptDName = (apt.doctorName || '').trim().toLowerCase();

        // SOFT MATCHING: Names must match. IDs only MUST match if both are present.
        const pMatch = (pName && aptPName === pName) && (!pId || !aptPId || pId === aptPId);
        const dMatch = (dName && aptDName === dName) && (!dId || !aptDId || dId === aptDId);

        return pMatch && dMatch;
      });

      if (fallbackApt) {
        console.log('💊 [PRESCRIPTION] Emergency recovery SUCCESS: Linked to appointment:', fallbackApt.id);
        selectedRoom.appointmentId = fallbackApt.id;
      } else {
        console.warn('💊 [PRESCRIPTION] Emergency recovery FAILED: No matching appointment found. Checking first 3 appointments in store:', appointments.slice(0, 3).map(a => ({ id: a.id, pName: a.patientName, dName: a.doctorName, pId: a.patientId, dId: a.doctorId })));
      }
    }

    if (!selectedRoom?.appointmentId || !user) {
      console.warn('💊 [PRESCRIPTION] Save skipped: No appointmentId or user found. Room ID:', selectedChatRoomId, 'Rooms available:', chatRooms.length);
      toast.error('Cannot save prescription: Appointment link missing');
      return;
    }

    try {
      setIsSavingPrescription(true);
      const prescriptionContent = `Medications:\n${prescriptionMedicines}\n\nNotes:\n${prescriptionNotes}`;

      console.log('Saving prescription for appointment:', selectedRoom.appointmentId);

      // DON'T update appointment yet - wait until we have the PDF URL

      let chatRoomIdToUse = selectedChatRoomId;

      // If it's a fallback ID (starts with 'chat-'), create the real chat room
      if (selectedChatRoomId?.startsWith('chat-')) {
        try {
          console.log('Creating real chat room for prescription from temporary ID:', selectedChatRoomId);
          const createdRoom = await chatAPI.createChatRoom(selectedRoom.appointmentId);
          chatRoomIdToUse = createdRoom.id;

          // Update the chat room ID in state
          setChatRooms(prev => prev.map(room =>
            room.id === selectedChatRoomId
              ? { ...room, id: createdRoom.id }
              : room
          ));
          setSelectedChatRoomId(createdRoom.id);
        } catch (roomError) {
          console.error('Failed to create chat room for prescription:', roomError);
        }
      }

      // Send a chat message about the prescription
      const messageData = {
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role.toUpperCase(),
        content: `📋 PRESCRIPTION ADDED:\n\n${prescriptionContent}\n\nYou can view the full details in your appointment history.`,
      };

      // Create UI Message for optimistic update
      const optimisticId = `temp-presc-${Date.now()}`;
      const uiMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: user.id,
        senderName: user.name,
        sender: user.name,
        senderRole: user.role.toLowerCase() as 'patient' | 'doctor',
        content: messageData.content,
        timestamp: formatTimestamp(new Date()),
        read: false,
        status: 'SENT',
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, uiMessage]);

      // Optimistic Update: Update sidebar
      setChatRooms(prev => prev.map(room =>
        room.id === chatRoomIdToUse
          ? {
            ...room,
            lastMessage: { content: messageData.content },
            lastMessageTime: formatTimestamp(new Date())
          }
          : room
      ));

      console.log('Sending prescription message via websocket to room:', chatRoomIdToUse);
      websocketClient.sendMessage(chatRoomIdToUse!, messageData);

      // --- PDF GENERATION & SENDING ---
      try {
        console.log('📄 Generating PDF Prescription...');
        const doctor = doctors.find(d => d.id === selectedRoom?.doctorId);
        const appointment = appointments.find(a => a.id === selectedRoom?.appointmentId);

        if (appointment) {
          const pdfBlob = generatePrescriptionPDF({
            appointment,
            doctor,
            medications: prescriptionMedicines,
            notes: prescriptionNotes
          });


          // Convert PDF to Data URL
          const pdfDataUrl = await blobToDataURL(pdfBlob);
          const pdfFileName = `Prescription_${appointment.patientName.replace(/\s+/g, '_')}_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;

          // Prepare full prescription text
          const fullPrescriptionText = `MEDICATIONS:\n${prescriptionMedicines}\n\nNOTES:\n${prescriptionNotes}`;

          // NOW update appointment with BOTH prescription text AND the PDF URL in ONE call
          console.log('💾 Saving prescription with PDF URL to appointment:', selectedRoom.appointmentId);
          const updateResult = await appointmentAPI.update(selectedRoom.appointmentId, {
            prescription: fullPrescriptionText,
            prescriptionUrl: pdfDataUrl, // Save persistent PDF
            status: 'completed'
          });
          console.log('✅ Appointment updated successfully:', updateResult);

          const pdfMessageData = {
            senderId: user.id,
            senderName: user.name,
            senderRole: user.role.toUpperCase(),
            content: `I've attached your formal prescription: ${pdfFileName}`,
            messageType: 'file' as const, // Ensure lowercase for optimistic update
            fileUrl: pdfDataUrl,
            fileName: pdfFileName,
            fileSize: pdfBlob.size
          };

          // Optimistic update for PDF message
          const pdfUiMessage: Message = {
            id: `temp-pdf-${Date.now()}`,
            ...pdfMessageData,
            sender: user.name,
            senderRole: user.role.toLowerCase() as 'patient' | 'doctor',
            timestamp: formatTimestamp(new Date()),
            read: false,
            status: 'SENT',
            createdAt: new Date().toISOString(),
            messageType: 'file' // Explicitly set for UI renderer
          };

          setMessages(prev => [...prev, pdfUiMessage]);

          // Send via WebSocket (backend will handle persistence of message)
          websocketClient.sendMessage(chatRoomIdToUse!, pdfMessageData);
        }
      } catch (pdfError) {
        console.error('Failed to generate or send PDF:', pdfError);
        toast.error('Prescription saved, but PDF generation failed');
      }
      // --------------------------------

      toast.success('Prescription saved and sent to patient');
      setIsPrescriptionOpen(false);
      setPrescriptionMedicines('');
      setPrescriptionNotes('');

      // Refresh appointments to get the updated prescriptionUrl
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.id && user.role === 'doctor') {
          const updatedAppointments = await appointmentAPI.getByDoctor(user.id);
          // Update the store with fresh data
          // Update the store with fresh data
          if (refreshData) {
            await refreshData();
          }
        }
      } catch (refreshError) {
        console.error('Failed to refresh appointments:', refreshError);
      }

      // Notify other parts of the app
      window.dispatchEvent(new CustomEvent('appointmentUpdated'));

    } catch (error: any) {
      console.error('Failed to save prescription:', error);
      toast.error(`Failed to save prescription: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSavingPrescription(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    handleTypingStart();
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
                  className={`border rounded-lg p-3 cursor-pointer hover:bg-gray-50 ${selectedChatRoomId === room.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  onClick={() => setSelectedChatRoomId(room.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                        {(room.doctorName || 'U').split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">{room.doctorName}</h4>
                      <p className="text-xs text-slate-500 truncate">{room.doctorSpecialty}</p>
                    </div>
                    {room.unreadCount && room.unreadCount > 0 && (
                      <Badge variant="default" className="bg-blue-600 text-white text-[10px] px-1.5 h-5 shrink-0">
                        {room.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-3 overflow-hidden flex flex-col">
          {selectedChatRoomId ? (
            <>
              <CardHeader className="border-b bg-white z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
                        {chatRooms.find(room => room.id === selectedChatRoomId)?.doctorName.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'DP'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-slate-900">{chatRooms.find(room => room.id === selectedChatRoomId)?.doctorName || 'Chat'}</h4>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                        <p className="text-xs text-gray-500 font-medium">
                          {chatRooms.find(room => room.id === selectedChatRoomId)?.doctorSpecialty || 'Online'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {user?.role === 'patient' && (
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        <User className="h-3 w-3 mr-1" />
                        Profile
                      </Button>
                    )}
                    {user?.role === 'doctor' && (
                      <Button size="sm" variant="outline" className="h-8 text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        Patient History
                      </Button>
                    )}
                    {isVideoCallEnabled() && user?.role === 'patient' && selectedChatRoomId && (
                      <Dialog open={showVideoCall} onOpenChange={setShowVideoCall}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8 text-xs bg-blue-50 text-blue-700 border-blue-200">
                            <Video className="h-3 w-3 mr-1" />
                            Video Call
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] w-[95vw] sm:w-[90vw]">
                          <DialogHeader>
                            <DialogTitle>Video Consultation</DialogTitle>
                            <DialogDescription>
                              Connect with your doctor for a secure video visit.
                            </DialogDescription>
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
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0 flex flex-col flex-1 min-h-0">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px]">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      <div className="bg-slate-50 p-4 rounded-full mb-4">
                        <MessageCircle className="h-10 w-10 text-slate-300" />
                      </div>
                      <h3 className="text-lg font-medium text-slate-900 mb-2">Start a conversation</h3>
                      <p className="text-sm text-slate-500 max-w-sm">
                        Send a message to begin chatting with your {user?.role === 'patient' ? 'doctor' : 'patient'}.
                      </p>
                      <p className="text-xs text-slate-400 mt-4 max-w-xs">
                        Messages are secure and private between you and your healthcare provider.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.senderRole === user?.role ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] ${msg.senderRole === user?.role ? 'order-2' : 'order-1'}`}>
                          {msg.senderRole !== user?.role && (
                            <p className="text-[10px] font-semibold text-slate-500 mb-1 ml-1 uppercase tracking-wider">{msg.sender}</p>
                          )}
                          <div
                            className={`rounded-2xl p-3 relative shadow-sm ${msg.senderRole === user?.role
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border border-slate-100 text-slate-900'
                              }`}
                          >
                            {msg.messageType?.toLowerCase() === 'file' ? (
                              <div className="flex items-center gap-3 p-1">
                                <div className={`p-2 rounded-lg ${msg.senderRole === user?.role ? 'bg-blue-500/30' : 'bg-slate-50'}`}>
                                  <FileText className={`h-6 w-6 ${msg.senderRole === user?.role ? 'text-blue-100' : 'text-blue-600'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{msg.fileName || 'prescription.pdf'}</p>
                                  <p className={`text-[10px] ${msg.senderRole === user?.role ? 'text-blue-200' : 'text-slate-400'}`}>
                                    {msg.fileSize ? `${(msg.fileSize / 1024).toFixed(1)} KB` : 'PDF Document'}
                                  </p>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className={`h-8 w-8 shrink-0 ${msg.senderRole === user?.role ? 'hover:bg-blue-500/50 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = msg.fileUrl || '';
                                    link.download = msg.fileName || 'prescription.pdf';
                                    link.click();
                                  }}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            )}
                            <div className="flex items-center justify-end gap-1 mt-1.5 opacity-80">
                              <p
                                className={`text-[10px] font-medium ${msg.senderRole === user?.role ? 'text-blue-100' : 'text-slate-400'
                                  }`}
                              >
                                {msg.timestamp}
                              </p>
                              {msg.senderRole === user?.role && (
                                <div className="flex items-center ml-0.5">
                                  {msg.status === 'READ' || msg.read ? (
                                    <CheckCheck className="h-3 w-3 text-blue-200" />
                                  ) : msg.status === 'DELIVERED' ? (
                                    <CheckCheck className="h-3 w-3 text-blue-300/50" />
                                  ) : (
                                    <Check className="h-3 w-3 text-blue-300/50" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t bg-slate-50/50 p-4">
                  <div className="flex items-center gap-2 max-w-4xl mx-auto">
                    <Button size="icon" variant="ghost" disabled className="h-9 w-9 shrink-0 text-slate-400 hover:text-slate-600">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="relative flex-1 group">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="pr-10 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400 h-10 transition-all rounded-xl"
                      />
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8 text-slate-400 hover:text-blue-600">
                            <Smile className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-2" side="top" align="end">
                          <div className="grid grid-cols-5 gap-1">
                            {commonEmojis.map(emoji => (
                              <Button
                                key={emoji}
                                variant="ghost"
                                className="h-10 w-10 p-0 text-xl hover:bg-slate-100"
                                onClick={() => handleEmojiSelect(emoji)}
                              >
                                {emoji}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {user?.role === 'doctor' && (
                      <Dialog open={isPrescriptionOpen} onOpenChange={setIsPrescriptionOpen}>
                        <DialogTrigger asChild>
                          <Button size="icon" variant="outline" className="h-10 w-10 shrink-0 bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 hover:text-emerald-700 transition-colors rounded-xl">
                            <Pill className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-emerald-700">
                              <Pill className="h-5 w-5" />
                              Create Prescription
                            </DialogTitle>
                            <DialogDescription>
                              Add medications and clinical notes for the patient.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="medicines" className="text-sm font-semibold text-slate-700">Medications & Dosage</Label>
                              <Textarea
                                id="medicines"
                                placeholder="e.g. Paracetamol 500mg - Twice a day (After food)"
                                value={prescriptionMedicines}
                                onChange={(e) => setPrescriptionMedicines(e.target.value)}
                                rows={4}
                                className="resize-none border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="notes" className="text-sm font-semibold text-slate-700">Clinical Notes</Label>
                              <Textarea
                                id="notes"
                                placeholder="Additional instructions..."
                                value={prescriptionNotes}
                                onChange={(e) => setPrescriptionNotes(e.target.value)}
                                className="resize-none border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                              />
                            </div>
                          </div>
                          <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={() => setIsPrescriptionOpen(false)} className="hover:bg-slate-100">
                              Cancel
                            </Button>
                            <Button
                              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                              disabled={isSavingPrescription || !prescriptionMedicines.trim()}
                              onClick={handleSavePrescription}
                            >
                              {isSavingPrescription ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4 mr-2" />
                              )}
                              Save & Send
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}

                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 shadow-sm px-4 h-10 rounded-xl"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-center p-8">
              <div className="bg-slate-50 p-6 rounded-full mb-6">
                <MessageCircle className="h-16 w-16 text-slate-300" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Your Conversations</h2>
              <p className="text-slate-500 max-w-md mx-auto mb-8">
                Select a chat from the sidebar to view messages and communicate with your {user?.role === 'patient' ? 'doctor' : 'patient'}.
              </p>
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Security</p>
                  <p className="text-xs text-slate-500">End-to-end encrypted messaging</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Privacy</p>
                  <p className="text-xs text-slate-500">Private clinical records</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

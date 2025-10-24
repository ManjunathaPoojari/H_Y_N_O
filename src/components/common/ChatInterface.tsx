import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: string;
  senderRole: 'patient' | 'doctor';
  message: string;
  timestamp: string;
  read: boolean;
}

export const ChatInterface = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Dr. Priya Patel',
      senderRole: 'doctor',
      message: 'Hello! How are you feeling today?',
      timestamp: '10:30 AM',
      read: true,
    },
    {
      id: '2',
      sender: user?.name || 'Patient',
      senderRole: 'patient',
      message: 'Hi Doctor, I have been experiencing headaches.',
      timestamp: '10:32 AM',
      read: true,
    },
    {
      id: '3',
      sender: 'Dr. Priya Patel',
      senderRole: 'doctor',
      message: 'I see. How long have you been experiencing these headaches? And how severe are they on a scale of 1-10?',
      timestamp: '10:33 AM',
      read: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    const message: Message = {
      id: String(messages.length + 1),
      sender: user?.name || 'Patient',
      senderRole: user?.role as 'patient' | 'doctor',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage('');
    toast.success('Message sent');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
            <CardTitle className="text-base">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="border rounded-lg p-3 bg-blue-50 border-blue-200 cursor-pointer">
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>DP</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-sm">Dr. Priya Patel</h4>
                  <p className="text-xs text-gray-500">Cardiologist</p>
                </div>
                <Badge variant="default" className="text-xs">3</Badge>
              </div>
              <p className="text-xs text-gray-600 truncate">How are you feeling today?</p>
            </div>

            <div className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-sm">Dr. Arjun Mehta</h4>
                  <p className="text-xs text-gray-500">Neurologist</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 truncate">Your test results are ready</p>
            </div>

            <div className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>SK</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="text-sm">Dr. Sneha Kumar</h4>
                  <p className="text-xs text-gray-500">Dermatologist</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 truncate">Please follow the skincare routine</p>
            </div>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="lg:col-span-3">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>DP</AvatarFallback>
                </Avatar>
                <div>
                  <h4>Dr. Priya Patel</h4>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  View Profile
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast.success('Starting video call...')}>
                  Video Call
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages Area */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
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
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => toast.success('Attachment dialog opened')}>
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button size="sm" variant="ghost" onClick={() => toast.success('Emoji picker opened')}>
                  <Smile className="h-4 w-4" />
                </Button>
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

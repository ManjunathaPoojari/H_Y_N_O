import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  Bot, Send, Sparkles, X, Minimize2, Maximize2, 
  Brain, Lightbulb, TrendingUp, MessageSquare 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { aiService } from '../../lib/ai-service';

interface AIChatAssistantProps {
  context: 'nutrition' | 'yoga';
  userProfile?: any;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ context, userProfile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: context === 'nutrition'
        ? '👋 Hi! I\'m your AI nutrition assistant. I can help you with meal planning, recipes, diet tips, and nutrition analysis. What would you like to know?'
        : 'Namaste! 🧘‍♀️ Welcome to your yoga journey. I\'m here to guide you with personalized routines, pose suggestions, and wellness tips. How are you feeling today?',
      timestamp: new Date(),
      suggestions: context === 'nutrition'
        ? ['Create a meal plan', 'Healthy breakfast ideas', 'Count my calories', 'Diet tips']
        : ['Create a yoga routine', 'Beginner poses', 'Help with flexibility', 'Yoga for stress relief']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Get AI response
    try {
      const response = await aiService.chatWithAI(text, context);
      
      if (response.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.data.message,
          timestamp: new Date(),
          suggestions: response.data.suggestions,
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I\'m having trouble responding right now. Please try again!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getContextColor = () => {
    return context === 'nutrition'
      ? 'from-green-500 to-emerald-500'
      : 'from-purple-500 to-pink-500';
  };

  const getContextIcon = () => {
    return context === 'nutrition' ? '🥗' : '🧘';
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-r ${getContextColor()} text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 flex items-center justify-center group`}
        >
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
          <div className="relative flex flex-col items-center">
            <Bot className="h-7 w-7 mb-1" />
            <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">AI Help</span>
          </div>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed ${
              isMinimized ? 'bottom-6 right-6' : 'bottom-6 right-6'
            } z-50 ${
              isMinimized ? 'w-80' : 'w-96'
            } transition-all duration-300`}
          >
            <Card className="border-0 shadow-2xl overflow-hidden">
              {/* Header */}
              <CardHeader className={`bg-gradient-to-r ${getContextColor()} text-white p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Brain className="h-6 w-6" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <CardTitle className="text-lg">AI Assistant {getContextIcon()}</CardTitle>
                      <p className="text-xs opacity-90">
                        {context === 'nutrition' ? 'Nutrition Expert' : 'Yoga Coach'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                      aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-lg hover:bg-white/20 transition-colors"
                      aria-label="Close chat"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              {!isMinimized && (
                <CardContent className="p-0">
                  <ScrollArea className="h-96 p-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className="space-y-2">
                          <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                message.role === 'user'
                                  ? `bg-gradient-to-r ${getContextColor()} text-white`
                                  : 'bg-slate-100 text-slate-900'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-slate-500'}`}>
                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>

                          {/* Suggestions */}
                          {message.role === 'assistant' && message.suggestions && (
                            <div className="flex flex-wrap gap-2 ml-4">
                              {message.suggestions.map((suggestion, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-xs px-3 py-1.5 rounded-full border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-slate-100 rounded-2xl px-4 py-3">
                            <div className="flex gap-1">
                              <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></div>
                              <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                              <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Quick Actions */}
                  <div className="border-t border-slate-200 p-3 bg-slate-50">
                    <div className="flex gap-2 overflow-x-auto">
                      {context === 'nutrition' ? (
                        <>
                          <Badge
                            onClick={() => handleSuggestionClick('Create a meal plan for me')}
                            className="cursor-pointer bg-green-100 text-green-700 hover:bg-green-200 whitespace-nowrap"
                            aria-label="Create a meal plan"
                          >
                            <Lightbulb className="h-3 w-3 mr-1" />
                            Meal Plan
                          </Badge>
                          <Badge
                            onClick={() => handleSuggestionClick('Healthy snack ideas')}
                            className="cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200 whitespace-nowrap"
                            aria-label="Get healthy snack ideas"
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            Snacks
                          </Badge>
                          <Badge
                            onClick={() => handleSuggestionClick('Weight loss tips')}
                            className="cursor-pointer bg-purple-100 text-purple-700 hover:bg-purple-200 whitespace-nowrap"
                            aria-label="Get weight loss tips"
                          >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Weight Loss
                          </Badge>
                        </>
                      ) : (
                        <>
                          <Badge
                            onClick={() => handleSuggestionClick('Create a yoga routine')}
                            className="cursor-pointer bg-purple-100 text-purple-700 hover:bg-purple-200 whitespace-nowrap"
                            aria-label="Create a yoga routine"
                          >
                            <Lightbulb className="h-3 w-3 mr-1" />
                            Routine
                          </Badge>
                          <Badge
                            onClick={() => handleSuggestionClick('Poses for back pain')}
                            className="cursor-pointer bg-pink-100 text-pink-700 hover:bg-pink-200 whitespace-nowrap"
                            aria-label="Get poses for back pain"
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            Back Pain
                          </Badge>
                          <Badge
                            onClick={() => handleSuggestionClick('Beginner yoga tips')}
                            className="cursor-pointer bg-blue-100 text-blue-700 hover:bg-blue-200 whitespace-nowrap"
                            aria-label="Get beginner yoga tips"
                          >
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Beginner
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Input */}
                  <div className="border-t border-slate-200 p-4 bg-white">
                    <div className="flex gap-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1"
                        disabled={isTyping}
                      />
                      <Button
                        onClick={() => handleSendMessage()}
                        disabled={!inputMessage.trim() || isTyping}
                        className={`bg-gradient-to-r ${getContextColor()} hover:opacity-90`}
                        aria-label="Send message"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Press Enter to send • Powered by AI
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </>
  );
};

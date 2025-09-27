import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/App';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  MessageCircle,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AITutorChat = ({ 
  lessonId = null, 
  courseId = null, 
  contextType = "general",
  codeContext = null,
  placeholder = "Ask me anything about programming! 🤖"
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const scrollAreaRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?.role === 'student') {
      fetchChatHistory();
      // Add welcome message
      setMessages([{
        id: 'welcome',
        type: 'ai',
        content: `Hi ${user.first_name}! 👋 I'm TecAI, your AI tutor. I'm here to help you learn programming and technology. What would you like to know?`,
        timestamp: new Date(),
        suggestions: [
          "What is programming?",
          "How do I write my first code?",
          "Can you help me with this lesson?",
          "I'm stuck on a coding problem"
        ]
      }]);
    }
  }, [user, lessonId, courseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatHistory = async () => {
    try {
      const params = new URLSearchParams();
      if (lessonId) params.append('lesson_id', lessonId);
      if (courseId) params.append('course_id', courseId);
      params.append('limit', '10');
      
      const response = await axios.get(`${API}/ai-tutor/history?${params}`);
      setChatHistory(response.data);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const sendMessage = async (messageText = null) => {
    const message = messageText || inputMessage.trim();
    if (!message || isLoading) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/ai-tutor`, {
        message: message,
        context_type: contextType,
        lesson_id: lessonId,
        course_id: courseId,
        code_context: codeContext
      });

      // Add AI response to chat
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.data.response,
        timestamp: new Date(),
        suggestions: response.data.suggestions,
        resources: response.data.helpful_resources
      };

      setMessages(prev => [...prev, aiMessage]);
      
      toast({
        title: "TecAI responded! 🤖",
        description: "Got your answer from your AI tutor.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Oops! Something went wrong",
        description: "TecAI is having trouble right now. Please try again!",
        variant: "destructive",
      });
      
      // Add error message
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Sorry, I'm having trouble right now. Please try asking your question again! 😅",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (user?.role !== 'student') {
    return (
      <Alert>
        <AlertDescription>
          AI tutoring is available for students only.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="h-full flex flex-col" data-testid="ai-tutor-chat">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <span>TecAI Tutor</span>
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </CardTitle>
        <CardDescription>
          Your personal AI tutor is here to help you learn! Ask questions, get explanations, and get coding help.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col min-h-0">
        {/* Chat Messages */}
        <ScrollArea className="flex-1 mb-4" ref={scrollAreaRef}>
          <div className="space-y-4 pr-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    
                    <div className={`rounded-lg px-3 py-2 ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-1 opacity-70`}>
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  {/* AI Suggestions */}
                  {message.type === 'ai' && message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2 ml-10">
                      <div className="text-xs text-gray-500 mb-1 flex items-center">
                        <Lightbulb className="h-3 w-3 mr-1" />
                        Helpful suggestions:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            className="text-xs h-6 px-2"
                            onClick={() => sendMessage(suggestion)}
                            data-testid={`suggestion-${index}`}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="border-t pt-4">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              className="flex-1"
              data-testid="chat-input"
            />
            <Button 
              onClick={() => sendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              data-testid="send-message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Context Badge */}
          {(lessonId || courseId || contextType !== 'general') && (
            <div className="mt-2 flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                <MessageCircle className="h-3 w-3 mr-1" />
                {contextType === 'lesson_help' && 'Lesson Help'}
                {contextType === 'code_help' && 'Code Help'}
                {contextType === 'quiz_help' && 'Quiz Help'}
                {contextType === 'general' && 'General Chat'}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
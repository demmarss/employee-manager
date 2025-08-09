import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatService } from '../services/api';

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatAction {
  type: 'navigate' | 'create' | 'update' | 'delete' | 'list';
  route?: string;
  data?: any;
}

interface ChatContextType {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  toggleChat: () => void;
  closeChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: "Hi! I'm your AI assistant. I can help you manage employees, organizations, departments, and positions. What would you like to do?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const sendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(message);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: response.message,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle navigation actions
      if (response.action?.type === 'navigate' && response.action.route) {
        setTimeout(() => {
          navigate(response.action!.route!);
        }, 1000); // Small delay to show the message first
      }

      // Add next steps as a follow-up message
      if (response.nextSteps && response.nextSteps.length > 0) {
        const nextStepsMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          message: `Here are some things you can do next:\n${response.nextSteps.map(step => `• ${step}`).join('\n')}`,
          isUser: false,
          timestamp: new Date()
        };
        
        setTimeout(() => {
          setMessages(prev => [...prev, nextStepsMessage]);
        }, 500);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ChatContext.Provider value={{
      messages,
      isOpen,
      isLoading,
      sendMessage,
      toggleChat,
      closeChat
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
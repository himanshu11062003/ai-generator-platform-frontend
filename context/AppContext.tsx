
import React, { createContext, useState, useCallback } from 'react';
import { ChatMessage, MessageAuthor } from '../types';
import { generateComponentCode } from '../services/geminiService';
import { INITIAL_TSX_CODE } from '../constants';

interface AppContextType {
  messages: ChatMessage[];
  tsxCode: string;
  isLoading: boolean;
  error: string | null;
  handleSendPrompt: (prompt: string) => Promise<void>;
  setTsxCode: React.Dispatch<React.SetStateAction<string>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { author: MessageAuthor.BOT, text: "Hello! Describe the React component you'd like me to create." }
  ]);
  const [tsxCode, setTsxCode] = useState<string>(INITIAL_TSX_CODE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendPrompt = useCallback(async (prompt: string) => {
    if (!prompt || isLoading) return;

    const userMessage: ChatMessage = { author: MessageAuthor.USER, text: prompt };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const history = [...messages, userMessage];
      const newCode = await generateComponentCode(history, tsxCode);
      setTsxCode(newCode);

      const botMessage: ChatMessage = { author: MessageAuthor.BOT, text: "Here is the updated component. What would you like to do next?" };
      setMessages(prev => [...prev, botMessage]);

    } catch (e: any) {
      const errorMessage = e.message || "Sorry, I encountered an error. Please check your API key and try again.";
      setError(errorMessage);
      setMessages(prev => [...prev, { author: MessageAuthor.BOT, text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, messages, tsxCode]);


  const value = {
    messages,
    tsxCode,
    isLoading,
    error,
    handleSendPrompt,
    setTsxCode
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

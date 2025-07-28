
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { MessageAuthor } from '../types';
import Spinner from './Spinner';

interface ChatPanelProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const BotIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);

const FullscreenEnterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m-4.5 11.25v-4.5m0 4.5h-4.5m4.5 0L9 15m11.25 0v-4.5m0 4.5h-4.5m4.5 0L15 15" /></svg>
);

const FullscreenExitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9L3.75 3.75M3.75 3.75v4.5m0-4.5h4.5m6.75 0L20.25 3.75m0 0v4.5m0-4.5h-4.5M9 15l-5.25 5.25m0 0v-4.5m0 4.5h4.5m6.75 0l5.25 5.25m0 0v-4.5m0 4.5h-4.5" /></svg>
);

const ChatPanel: React.FC<ChatPanelProps> = ({ isFullscreen, onToggleFullscreen }) => {
  const { messages, handleSendPrompt, isLoading } = useAppContext();
  const [prompt, setPrompt] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      handleSendPrompt(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
      <div className="flex justify-between items-center p-2 bg-gray-900 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-sm font-semibold text-gray-400 pl-2">AI Chat</h2>
          <button 
              onClick={onToggleFullscreen}
              className="p-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
              aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
          >
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
          </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.author === MessageAuthor.USER ? 'justify-end' : ''}`}>
               {msg.author === MessageAuthor.BOT && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white"><BotIcon/></div>}
              <div className={`p-3 rounded-lg max-w-sm ${msg.author === MessageAuthor.USER ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
               {msg.author === MessageAuthor.USER && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white"><UserIcon/></div>}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white"><BotIcon/></div>
              <div className="p-3 rounded-lg bg-gray-700 flex items-center">
                <Spinner />
                <span className="text-sm ml-2 text-gray-400">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., a login form with a dark theme"
            className="flex-1 p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="p-2 bg-indigo-600 rounded-md text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;

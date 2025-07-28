
import React, { useState } from 'react';
import Header from './Header';
import ChatPanel from './ChatPanel';
import PreviewPanel from './PreviewPanel';
import CodePanel from './CodePanel';
import { AppProvider } from '../context/AppContext';

type FullscreenPanel = 'chat' | 'code' | 'preview' | null;

const Dashboard: React.FC = () => {
  const [fullscreenPanel, setFullscreenPanel] = useState<FullscreenPanel>(null);

  const toggleFullscreen = (panel: 'chat' | 'code' | 'preview') => {
    setFullscreenPanel(current => (current === panel ? null : panel));
  };

  return (
    <AppProvider>
      <div className="flex flex-col h-screen bg-gray-900 text-gray-200 font-sans">
        <Header />
        <main className="flex flex-1 overflow-hidden">
          {/* Column 1: Chat Panel */}
          <div className={`flex flex-col h-full transition-all duration-300 ease-in-out ${!fullscreenPanel || fullscreenPanel === 'chat' ? 'border-r border-gray-700' : ''} ${fullscreenPanel === 'chat' ? 'w-full' : fullscreenPanel === null ? 'w-[30%]' : 'w-0 hidden'}`}>
            <ChatPanel 
              isFullscreen={fullscreenPanel === 'chat'} 
              onToggleFullscreen={() => toggleFullscreen('chat')} 
            />
          </div>
          {/* Column 2: Code Panel */}
          <div className={`flex flex-col h-full transition-all duration-300 ease-in-out ${!fullscreenPanel || fullscreenPanel === 'code' ? 'border-r border-gray-700' : ''} ${fullscreenPanel === 'code' ? 'w-full' : fullscreenPanel === null ? 'w-[40%]' : 'w-0 hidden'}`}>
            <CodePanel 
              isFullscreen={fullscreenPanel === 'code'} 
              onToggleFullscreen={() => toggleFullscreen('code')} 
            />
          </div>
          {/* Column 3: Preview Panel */}
          <div className={`flex flex-col h-full transition-all duration-300 ease-in-out ${fullscreenPanel === 'preview' ? 'w-full' : fullscreenPanel === null ? 'w-[30%]' : 'w-0 hidden'}`}>
            <PreviewPanel 
              isFullscreen={fullscreenPanel === 'preview'} 
              onToggleFullscreen={() => toggleFullscreen('preview')} 
            />
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default Dashboard;

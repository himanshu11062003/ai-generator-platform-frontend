
import React, { useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';

interface PreviewPanelProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

const FullscreenEnterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m-4.5 11.25v-4.5m0 4.5h-4.5m4.5 0L9 15m11.25 0v-4.5m0 4.5h-4.5m4.5 0L15 15" /></svg>
);

const FullscreenExitIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9L3.75 3.75M3.75 3.75v4.5m0-4.5h4.5m6.75 0L20.25 3.75m0 0v4.5m0-4.5h-4.5M9 15l-5.25 5.25m0 0v-4.5m0 4.5h4.5m6.75 0l5.25 5.25m0 0v-4.5m0 4.5h-4.5" /></svg>
);

const PreviewPanel: React.FC<PreviewPanelProps> = ({ isFullscreen, onToggleFullscreen }) => {
  const { tsxCode, error } = useAppContext();

  const iframeContent = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Component Preview</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #F3F4F6;
            font-family: sans-serif;
          }
          /* Ensure dark mode works if component uses it */
          .dark body {
             background-color: #1F2937;
          }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          try {
            const App = () => {
              ${tsxCode}
              return <GeneratedComponent />;
            };
            const root = ReactDOM.createRoot(document.getElementById('root'));
            root.render(<App />);
          } catch (err) {
            const root = document.getElementById('root');
            root.innerHTML = '<div style="color: red; padding: 20px; text-align: left; background-color: #fee2e2; border: 1px solid #f87171; border-radius: 8px; max-width: 400px;">' +
              '<strong>Render Error:</strong><br/><pre>' + err.message + '</pre>' +
              '</div>';
            console.error(err);
          }
        </script>
      </body>
      </html>
    `;
  }, [tsxCode]);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="flex justify-between items-center p-2 bg-gray-800 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-400 pl-2">Live Preview</h2>
        <button 
            onClick={onToggleFullscreen}
            className="p-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
            aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
        >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
        </button>
      </div>
      <div className="flex-1 bg-gray-200 p-4 relative">
        {error && (
             <div className="absolute inset-0 bg-red-900 bg-opacity-75 flex items-center justify-center p-4">
                <p className="text-white text-center">{error}</p>
             </div>
        )}
        <iframe
          srcDoc={iframeContent}
          title="Component Preview"
          sandbox="allow-scripts"
          className="w-full h-full bg-white rounded-md shadow-inner"
        />
      </div>
    </div>
  );
};

export default PreviewPanel;

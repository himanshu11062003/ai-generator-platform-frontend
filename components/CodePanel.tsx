import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';

interface CodePanelProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

// Dummy SyntaxHighlighter since library import isn't used in this mock
const SyntaxHighlighter = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  [key: string]: any;
}) => (
  <pre
    {...props}
    style={{
      background: '#1e1e1e',
      color: '#d4d4d4',
      padding: '1rem',
      borderRadius: '0.5rem',
      overflowX: 'auto',
      height: '100%',
    }}
  >
    <code>{children}</code>
  </pre>
);

// Download handler
const handleDownload = (code: string) => {
  const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'GeneratedComponent.tsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert('In a real app, this would download a ZIP file. Downloading TSX file now.');
};

// Icons
const CopyIcon = ({ copied }: { copied: boolean }) =>
  copied ? (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="22 4 12 14.01 9 11.01" />
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    </svg>
  ) : (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );

const DownloadIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const FullscreenEnterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m-4.5 11.25v-4.5m0 4.5h-4.5m4.5 0L9 15m11.25 0v-4.5m0 4.5h-4.5m4.5 0L15 15"
    />
  </svg>
);

const FullscreenExitIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 9L3.75 3.75M3.75 3.75v4.5m0-4.5h4.5m6.75 0L20.25 3.75m0 0v4.5m0-4.5h-4.5M9 15l-5.25 5.25m0 0v-4.5m0 4.5h4.5m6.75 0l5.25 5.25m0 0v-4.5m0 4.5h-4.5"
    />
  </svg>
);

const CodePanel: React.FC<CodePanelProps> = ({ isFullscreen, onToggleFullscreen }) => {
  const { tsxCode } = useAppContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tsxCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-800">
      <div className="flex justify-between items-center p-2 bg-gray-900 border-b border-gray-700">
        <h2 className="text-sm font-semibold text-gray-400 pl-2">Code Editor</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleFullscreen}
            className="p-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
            aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center px-3 py-1 text-sm bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
          >
            <CopyIcon copied={copied} />
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={() => handleDownload(tsxCode)}
            className="flex items-center px-3 py-1 text-sm bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
          >
            <DownloadIcon />
            Download
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <SyntaxHighlighter>{tsxCode}</SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodePanel;

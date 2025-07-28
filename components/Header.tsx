
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
    const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700 flex-shrink-0">
      <div className="flex items-center">
        <svg className="w-8 h-8 mr-3 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
        </svg>
        <h1 className="text-xl font-bold text-gray-200">AI Component Generator</h1>
      </div>
      <div className="flex items-center space-x-4">
         <span className="text-sm text-gray-400" aria-label="Current user">
            Welcome, {user?.isAdmin ? 'Admin' : user?.email}
        </span>
        <button 
            onClick={logout} 
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;

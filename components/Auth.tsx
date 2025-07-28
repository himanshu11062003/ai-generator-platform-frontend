import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

type AuthMode = 'login' | 'signup' | 'admin';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const { setAuthToken, adminLogin } = useAuth();

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let response;
      if (mode === 'login') {
        response = await fetch('https://multi-component-generator-platform-wazx.onrender.com/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      } else if (mode === 'signup') {
        response = await fetch('https://multi-component-generator-platform-wazx.onrender.com/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      } else if (mode === 'admin') {
        adminLogin(secretCode);
        return;
      }

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Something went wrong');
      }

      const data = await response.json();
      setAuthToken(data.token, data.email);
    } catch (err: any) {
      setError(err.message || 'Unexpected error');
    }
  };

  const renderForm = () => {
    if (mode === 'admin') {
      return (
        <>
          <label className="text-sm font-medium text-white mb-2" htmlFor="secretCode">
            Secret Code
          </label>
          <input
            type="password"
            id="secretCode"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all animate-inputFade"
            required
          />
        </>
      );
    }

    return (
      <>
        <label className="text-sm font-medium text-white mb-2" htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all animate-inputFade"
          required
        />
        <label className="text-sm font-medium text-white mt-4 mb-2" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all animate-inputFade"
          required
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center px-4 font-[Poppins] relative overflow-hidden">
      {/* Animated Gradient Waves */}
      <div className="absolute inset-0 before:absolute before:w-full before:h-full before:bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.05)_50%,rgba(255,255,255,0.05)_75%,transparent_75%,transparent)] before:bg-[length:60px_60px] before:animate-bgMove"></div>

      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-cardZoom">
        {/* Logo + Heading */}
        <div className="flex flex-col items-center mb-8">
          <svg className="w-16 h-16 text-cyan-400 mb-3 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4m12-6l4 4-4 4m-8-8L4 12l4 4" />
          </svg>
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide animate-gradientMove">
            AI-Generator-Platform
          </h1>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-between border-b border-white/20 mb-6">
          {['login', 'signup', 'admin'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as AuthMode)}
              className={`flex-1 py-3 text-sm font-medium transition ${
                mode === m ? 'border-b-2 border-cyan-400 text-white' : 'text-gray-300 hover:text-white'
              }`}
            >
              {m === 'login' ? 'Login' : m === 'signup' ? 'Sign Up' : 'Admin'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleAuthAction} className="flex flex-col space-y-4">
          <h2 className="text-xl font-semibold text-white text-center mb-2">
            {mode === 'login'
              ? 'Login to your account'
              : mode === 'signup'
              ? 'Create a new account'
              : 'Admin Panel Access'}
          </h2>
          {renderForm()}
          {error && <p className="text-red-400 text-center text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white font-semibold hover:shadow-[0_0_20px_rgba(0,255,255,0.8)] hover:scale-105 transition-all duration-300 animate-buttonRipple"
          >
            {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Register' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;

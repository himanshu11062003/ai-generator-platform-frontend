// src/components/login.tsx
import React, { useState } from 'react';
import API from '../services/api';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const { setUser } = useAuth(); // context se user set
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });
      setUser(res.data.user); // backend se user mila, context mein save
      alert("✅ Login successful");
    } catch (err: any) {
      console.error("❌ Login failed", err.response?.data || err.message);
      alert("❌ Login failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Login</button>
      </form>
    </div>
  );
};

export default Login;

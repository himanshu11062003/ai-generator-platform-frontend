
// import React, { createContext, useState, useEffect, useCallback } from 'react';

// interface User {
//   email: string;
//   isAdmin: boolean;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, pass: string) => Promise<void>;
//   adminLogin: (secretCode: string) => Promise<void>;
//   signup: (email: string, pass: string) => Promise<void>;
//   logout: () => void;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// const ADMIN_SECRET_CODE = '706162';

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem('authUser');
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//       }
//     } catch (error) {
//       console.error("Failed to parse user from localStorage", error);
//       localStorage.removeItem('authUser');
//     } finally {
//         setLoading(false);
//     }
//   }, []);
// const setAuthToken = (token: string) => {
//       localStorage.setItem('token', token);
//   };
//   return { setAuthToken };
//   const login = useCallback(async (email: string, pass: string) => {
//     const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
//     if (storedUsers[email] && storedUsers[email] === pass) {
//       const loggedInUser = { email, isAdmin: false };
//       setUser(loggedInUser);
//       localStorage.setItem('authUser', JSON.stringify(loggedInUser));
//     } else {
//       throw new Error('Invalid email or password.');
//     }
//   }, []);
  
//   const adminLogin = useCallback(async (secretCode: string) => {
//     if (secretCode === ADMIN_SECRET_CODE) {
//         const adminUser = { email: 'admin@app.com', isAdmin: true };
//         setUser(adminUser);
//         localStorage.setItem('authUser', JSON.stringify(adminUser));
//     } else {
//         throw new Error('Invalid secret code.');
//     }
//   }, []);

//   const signup = useCallback(async (email: string, pass: string) => {
//     const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
//     if (storedUsers[email]) {
//       throw new Error('An account with this email already exists.');
//     }
//     const newUsers = { ...storedUsers, [email]: pass };
//     localStorage.setItem('users', JSON.stringify(newUsers));
    
//     const newUser = { email, isAdmin: false };
//     setUser(newUser);
//     localStorage.setItem('authUser', JSON.stringify(newUser));
//   }, []);

//   const logout = useCallback(() => {
//     setUser(null);
//     localStorage.removeItem('authUser');
//   }, []);

//   const value = { user, loading, login, adminLogin, signup, logout };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface User {
  email: string;
  isAdmin: boolean;
}

interface MessageType {
  userId: string;
  message: string;
  response: string;
  code: string;
  timestamp: string;
}

interface AuthContextType {
    setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;

  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  setAuthToken : (token: string, email : string) => Promise<void>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  adminLogin: (secretCode: string) => Promise<void>;
  signup: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_SECRET_CODE = '706162';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('token');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Store token using useCallback
  const setAuthToken = useCallback((token: string, email : string) => {
    localStorage.setItem('token', token);
    setUser ({email : email , isAdmin : false});
  }, []);

  const login = useCallback(async (email: string, pass: string) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password: pass,
      });

      const token = res.data.token;
      setAuthToken(token, email);

      const loggedInUser = { email, isAdmin: false };
      setUser(loggedInUser);
      localStorage.setItem('authUser', JSON.stringify(loggedInUser));
    } catch (err) {
      console.error('Login failed:', err);
      throw new Error('Invalid credentials or server error.');
    }
  }, [setAuthToken]);

  const signup = useCallback(async (email: string, pass: string) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        password: pass,
      });

      const token = res.data.token;
      setAuthToken(token, email);

      const newUser = { email, isAdmin: false };
      setUser(newUser);
      localStorage.setItem('authUser', JSON.stringify(newUser));
    } catch (err) {
      console.error('Signup failed:', err);
      throw new Error('Signup error: User might already exist.');
    }
  }, [setAuthToken]);

  const adminLogin = useCallback(async (secretCode: string) => {
    if (secretCode === ADMIN_SECRET_CODE) {
      const adminUser = { email: 'admin@app.com', isAdmin: true };
      setUser(adminUser);
      localStorage.setItem('authUser', JSON.stringify(adminUser));
    } else {
      throw new Error('Invalid secret code.');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('token');
  }, []);

  const value = { user, loading, login, adminLogin, signup, logout, setAuthToken , setMessages, setIsLoading};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

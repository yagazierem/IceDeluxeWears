

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOKEN_KEY } from '../utils/auth';
import Endpoint from '../utils/endpoint';


const USER_KEY = 'current_user';

// Create context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  // Check if user is already logged in on mount
  useEffect(() => {
    if (token) {
      // Endpoint.init(token); // Pass the token directly to init
    }
    setLoading(false);
  }, [token]);

  

  // Login function - store token and user data
  const login = (newToken, userData) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setToken(newToken);
    console.log(userData, newToken, "newToken && Data")
    setCurrentUser(userData);
    Endpoint.init(newToken);
    navigate('/admin/dashboard'); // Redirect to dashboard after login
  };

  // Logout function - clear token and user data
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setCurrentUser(null);
    navigate('/admin/login');
  };

  // Context value
  const value = {
    currentUser,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export default AuthContext;

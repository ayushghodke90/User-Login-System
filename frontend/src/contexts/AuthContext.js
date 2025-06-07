import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Login attempt'); // Debug log
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      console.log('AuthContext: Login response received'); // Debug log
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      // Store token and update state
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      
      console.log('AuthContext: Login successful, user state updated'); // Debug log
      return true;
    } catch (error) {
      console.error('AuthContext: Login error:', error); // Debug log
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      setUser(null);
      localStorage.removeItem('token'); // Clear any existing token
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('AuthContext: Registration attempt'); // Debug log
      const response = await api.post('/auth/register', {
        username,
        email,
        password
      });
      
      console.log('AuthContext: Registration response received'); // Debug log
      const { token, user } = response.data;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }

      // Store token and update state
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      
      console.log('AuthContext: Registration successful, user state updated'); // Debug log
      return true;
    } catch (error) {
      console.error('AuthContext: Registration error:', error); // Debug log
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      setUser(null);
      localStorage.removeItem('token'); // Clear any existing token
      throw error; // Re-throw to let the component handle it
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 
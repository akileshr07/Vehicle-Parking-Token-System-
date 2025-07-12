import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../config/apiconfig';

/*
 * API INTEGRATION NOTES:
 * 
 * 1. Login API Call:
 *    POST /api/auth/login
 *    Request: { "username": "Admin", "password": "admin@123" }
 *    Response: { "success": true, "token": "jwt-token", "user": { "username": "Admin", "role": "admin" } }
 * 
 * 2. Error Response:
 *    { "success": false, "message": "Invalid credentials" }
 */

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // TODO: Replace with actual API call
      const response = await apiClient.post('/auth/login', credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
        
        setIsAuthenticated(true);
        setUser(user);
        
        return { success: true, token };
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      // Fallback for development - remove in production
      if (credentials.username === 'Admin' && credentials.password === 'admin@123') {
        const mockToken = 'mock-jwt-token-admin';
        const userData = { username: 'Admin', role: 'admin' };
        
        localStorage.setItem('authToken', mockToken);
        localStorage.setItem('userData', JSON.stringify(userData));
        
        setIsAuthenticated(true);
        setUser(userData);
        
        return { success: true, token: mockToken };
      }
      
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
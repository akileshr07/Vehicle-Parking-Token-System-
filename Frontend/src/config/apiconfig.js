import axios from 'axios';
import { BASE_URL } from './baseurl';

/*
 * API CLIENT CONFIGURATION
 * 
 * This axios instance is pre-configured with:
 * - Base URL from baseurl.js
 * - Automatic JWT token attachment
 * - Response/Request interceptors
 * - Error handling for 401 (Unauthorized)
 * 
 * Usage in components:
 * import apiClient from '../config/apiconfig';
 * const response = await apiClient.get('/endpoint');
 * const response = await apiClient.post('/endpoint', data);
 */
// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
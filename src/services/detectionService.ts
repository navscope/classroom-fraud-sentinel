
import axios from 'axios';
import { DetectionResult } from '@/types';

// Set the base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Store the authentication token
let authToken: string | null = null;

// Authentication functions
export const isAuthenticated = (): boolean => {
  return !!authToken || !!localStorage.getItem('auth_token');
};

export const getToken = (): string | null => {
  return authToken || localStorage.getItem('auth_token');
};

export const setToken = (token: string): void => {
  authToken = token;
  localStorage.setItem('auth_token', token);
};

export const clearToken = (): void => {
  authToken = null;
  localStorage.removeItem('auth_token');
};

export async function login(email: string, password: string): Promise<{success: boolean; message: string; token?: string}> {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    if (response.data.token) {
      setToken(response.data.token);
      return { success: true, message: 'Login successful', token: response.data.token };
    }
    return { success: false, message: response.data.message || 'Login failed' };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Login failed. Please try again.'
    };
  }
}

export async function register(name: string, email: string, password: string): Promise<{success: boolean; message: string}> {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
    return { success: true, message: 'Registration successful' };
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Registration failed. Please try again.'
    };
  }
}

export async function logout(): Promise<void> {
  clearToken();
}

// Protected API call helper
const authFetch = async (url: string, options: any = {}) => {
  const token = getToken();
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`
  };
  
  return axios({
    url: `${API_BASE_URL}${url}`,
    ...options,
    headers
  });
};

export async function detectAiContent(text: string): Promise<DetectionResult> {
  if (!text || text.trim().length < 50) {
    return {
      aiProbability: 0,
      humanProbability: 0,
      confidence: 0,
      status: 'error',
      error: 'Text must be at least 50 characters long'
    };
  }

  try {
    console.log('Sending text for AI detection:', text.substring(0, 100) + '...');
    
    const headers = isAuthenticated() ? { Authorization: `Bearer ${getToken()}` } : {};
    const response = await axios.post(`${API_BASE_URL}/detect`, { text }, { headers });
    return {
      ...response.data,
      status: 'success'
    };
  } catch (error) {
    console.error('Error detecting AI content:', error);
    return {
      aiProbability: 0,
      humanProbability: 0,
      confidence: 0,
      status: 'error',
      error: error instanceof Error ? error.message : 'Failed to analyze text. Please try again later.'
    };
  }
}

// Enhanced file text extraction with support for multiple file types
export async function extractTextFromFile(file: File): Promise<string> {
  // For text files, we can use FileReader directly
  if (file.type === 'text/plain') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          resolve(text);
        } catch (error) {
          reject(new Error('Failed to read file content'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }
  
  // For PDF, DOC, DOCX, and other complex files, we'll use the server API
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const headers = isAuthenticated() ? { Authorization: `Bearer ${getToken()}` } : {};
    const response = await axios.post(`${API_BASE_URL}/extract`, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.data && response.data.text) {
      return response.data.text;
    } else {
      throw new Error('No text extracted from file');
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to extract text from file');
  }
}

export async function getDetectionHistory() {
  try {
    if (!isAuthenticated()) {
      throw new Error('Authentication required');
    }
    
    const response = await authFetch('/history', {
      method: 'GET'
    });
    
    return response.data.history;
  } catch (error) {
    console.error('Error fetching detection history:', error);
    throw new Error('Failed to fetch detection history');
  }
}

export async function getUserProfile() {
  try {
    if (!isAuthenticated()) {
      throw new Error('Authentication required');
    }
    
    const response = await authFetch('/user/profile', {
      method: 'GET'
    });
    
    return response.data.user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}

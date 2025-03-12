
import axios from 'axios';
import { DetectionResult } from '@/types';

// Set the base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
    
    const response = await axios.post(`${API_BASE_URL}/detect`, { text });
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

// In a real implementation, this would process the file and extract text
export async function extractTextFromFile(file: File): Promise<string> {
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

export async function getDetectionHistory() {
  try {
    const response = await axios.get(`${API_BASE_URL}/history`);
    return response.data.history;
  } catch (error) {
    console.error('Error fetching detection history:', error);
    throw new Error('Failed to fetch detection history');
  }
}

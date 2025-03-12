
import { DetectionResult } from '@/types';

// This would be replaced with an actual API key in a production environment
// In a real application, this should be stored securely on the backend
const API_KEY = 'demo-api-key';

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
    
    // For demo purposes, we're simulating an API call with a timeout
    // In a real application, this would be an actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // This is a simulated response for demonstration
        // In a real app, we would make an actual API request to a detection service
        
        // Generate a somewhat random result for demo purposes
        const aiScore = Math.random() * 0.7 + 0.2; // Between 0.2 and 0.9
        
        resolve({
          aiProbability: parseFloat(aiScore.toFixed(2)),
          humanProbability: parseFloat((1 - aiScore).toFixed(2)),
          confidence: parseFloat((0.7 + Math.random() * 0.25).toFixed(2)),
          suggestedAction: aiScore > 0.7 
            ? 'Review carefully - high probability of AI-generated content'
            : aiScore > 0.4 
              ? 'Some indicators of AI content - further review recommended'
              : 'Likely human-written content',
          details: {
            flaggedSentences: generateFlaggedSentences(text, aiScore),
          },
          status: 'success'
        });
      }, 1500); // Simulate network delay
    });
  } catch (error) {
    console.error('Error detecting AI content:', error);
    return {
      aiProbability: 0,
      humanProbability: 0,
      confidence: 0,
      status: 'error',
      error: 'Failed to analyze text. Please try again later.'
    };
  }
}

// Helper function to generate random flagged sentences for the demo
function generateFlaggedSentences(text: string, overallScore: number) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  return sentences
    .filter(() => Math.random() > 0.7) // Randomly select some sentences
    .map(sentence => ({
      text: sentence,
      score: Math.min(overallScore + (Math.random() * 0.4 - 0.2), 0.99) // Score close to overall score
    }))
    .sort((a, b) => b.score - a.score) // Sort by highest score first
    .slice(0, 3); // Take top 3
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

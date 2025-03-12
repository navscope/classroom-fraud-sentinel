
export interface DetectionResult {
  aiProbability: number;
  humanProbability: number;
  confidence: number;
  suggestedAction?: string;
  details?: {
    patterns?: string[];
    flaggedSentences?: {
      text: string;
      score: number;
    }[];
  };
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  content: string;
}

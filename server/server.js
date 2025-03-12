
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { pool, initializeDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Initialize database on startup
initializeDatabase().catch(console.error);

// Helper function to hash text for identification
function hashText(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// Route to detect AI content
app.post('/api/detect', async (req, res) => {
  const { text } = req.body;
  
  if (!text || text.trim().length < 50) {
    return res.status(400).json({
      status: 'error',
      error: 'Text must be at least 50 characters long'
    });
  }
  
  try {
    const textHash = hashText(text);
    const textPreview = text.substring(0, 200);
    
    // Check if we've already analyzed this text
    const [existingResults] = await pool.query(
      'SELECT * FROM detection_results WHERE text_hash = ?',
      [textHash]
    );
    
    if (existingResults.length > 0) {
      console.log('Found existing analysis for text');
      const result = existingResults[0];
      
      return res.json({
        aiProbability: result.ai_probability,
        humanProbability: result.human_probability,
        confidence: result.confidence,
        suggestedAction: result.suggested_action,
        details: {
          flaggedSentences: JSON.parse(result.flagged_sentences || '[]'),
        },
        status: 'success',
        fromCache: true
      });
    }
    
    // For demo purposes, we're simulating an AI detection algorithm
    // In a real app, this would call an external API or use a local model
    const aiScore = Math.random() * 0.7 + 0.2; // Between 0.2 and 0.9
    const humanScore = parseFloat((1 - aiScore).toFixed(2));
    const confidence = parseFloat((0.7 + Math.random() * 0.25).toFixed(2));
    
    const suggestedAction = aiScore > 0.7 
      ? 'Review carefully - high probability of AI-generated content'
      : aiScore > 0.4 
        ? 'Some indicators of AI content - further review recommended'
        : 'Likely human-written content';
    
    // Generate flagged sentences
    const sentences = text.split(/(?<=[.!?])\s+/);
    const flaggedSentences = sentences
      .filter(() => Math.random() > 0.7)
      .map(sentence => ({
        text: sentence,
        score: Math.min(aiScore + (Math.random() * 0.4 - 0.2), 0.99)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    
    // Store the results in the database
    await pool.query(
      `INSERT INTO detection_results 
      (text_hash, text_preview, ai_probability, human_probability, confidence, 
       suggested_action, flagged_sentences) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        textHash, 
        textPreview, 
        aiScore, 
        humanScore, 
        confidence, 
        suggestedAction, 
        JSON.stringify(flaggedSentences)
      ]
    );
    
    // Return the results
    return res.json({
      aiProbability: parseFloat(aiScore.toFixed(2)),
      humanProbability: humanScore,
      confidence: confidence,
      suggestedAction: suggestedAction,
      details: {
        flaggedSentences: flaggedSentences,
      },
      status: 'success'
    });
    
  } catch (error) {
    console.error('Detection error:', error);
    return res.status(500).json({
      status: 'error',
      error: 'An error occurred during detection'
    });
  }
});

// Get recent detection history (limited to last 10)
app.get('/api/history', async (req, res) => {
  try {
    const [results] = await pool.query(
      `SELECT id, text_preview, ai_probability, human_probability, 
       confidence, suggested_action, created_at 
       FROM detection_results 
       ORDER BY created_at DESC LIMIT 10`
    );
    
    return res.json({
      history: results,
      status: 'success'
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.status(500).json({
      status: 'error',
      error: 'Failed to retrieve detection history'
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import express from 'express';

const router = express.Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5002';

// Forward AI chat request to AI Microservice
router.post('/chat', async (req, res, next) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: 'AI Microservice is currently unreachable on port 5002.',
      error: error.message,
    });
  }
});

// Forward quick prompts
router.get('/quick-prompts', async (req, res) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/ai/quick-prompts`);
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.json({
      prompts: [
        { id: '1', label: '🔥 Best Sellers', query: 'Show me top rated products' },
        { id: '2', label: '🎧 Audio & Gadgets', query: 'Find headphones and monitors' },
      ]
    });
  }
});

// Forward health check
router.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/api/ai/health`);
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    return res.status(503).json({ status: 'offline', message: 'AI Microservice unreachable' });
  }
});

export default router;

import express from 'express';
import { ChatService } from '../services/ChatService.js';

const router = express.Router();
const chatService = new ChatService();

// Process chat message
router.post('/message', async (req, res) => {
  try {
    const { message, context } = req.body;
    const response = await chatService.processMessage(message, context);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Get chat history
router.get('/history', async (req, res) => {
  try {
    // In a real application, you'd retrieve from a database
    const history = []; // Placeholder
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

export default router;
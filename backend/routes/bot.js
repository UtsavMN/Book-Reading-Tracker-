const express = require('express');
const auth = require('../middleware/auth');
const ReadingProgress = require('../models/ReadingProgress');
const Book = require('../models/Book');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// POST chat with bot
router.post('/', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id; // From auth middleware
    console.log(`${req.method} ${req.path} - User: ${userId}, Message: ${message}`);

    // Query user's reading progress and books
    const progress = await ReadingProgress.find({ user: userId }).populate('book');
    let context = 'No current books or progress found.';
    if (progress.length > 0) {
      context = progress.map(p => `${p.book.title} by ${p.book.author}: ${p.currentPage}/${p.book.totalPages || 'N/A'} pages (${((p.currentPage / (p.book.totalPages || 1)) * 100).toFixed(0)}%), Status: ${p.status}`).join('; ');
      context = `User's current reading: ${context}.`;
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `${context} The user says: "${message}". Respond conversationally about literature, books, authors, or reading progress. Reference the user's reading context if relevant. Keep responses engaging and helpful, under 150 words.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    res.json({ response });
  } catch (error) {
    console.error('Bot error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

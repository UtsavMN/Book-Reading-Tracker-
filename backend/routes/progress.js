const express = require('express');
const ReadingProgress = require('../models/ReadingProgress');
const auth = require('../middleware/auth');

const router = express.Router();

// GET all progress for user
router.get('/', auth, async (req, res) => {
  try {
    const progress = await ReadingProgress.find({ user: req.user.id }).populate('book');
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create progress
router.post('/', auth, async (req, res) => {
  try {
    const progress = new ReadingProgress({ ...req.body, user: req.user.id });
    await progress.save();
    res.status(201).json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET progress by id (if needed)
router.get('/:id', auth, async (req, res) => {
  try {
    const progress = await ReadingProgress.findOne({ _id: req.params.id, user: req.user.id }).populate('book');
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update progress
router.put('/:id', auth, async (req, res) => {
  try {
    const progress = await ReadingProgress.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    ).populate('book');
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    res.json(progress);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE progress
router.delete('/:id', auth, async (req, res) => {
  try {
    const progress = await ReadingProgress.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    res.json({ message: 'Progress deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const mongoose = require('mongoose');

const readingProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  currentPage: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['Not Started', 'Reading', 'Completed'],
    default: 'Not Started',
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
}, { timestamps: true });

module.exports = mongoose.model('ReadingProgress', readingProgressSchema);

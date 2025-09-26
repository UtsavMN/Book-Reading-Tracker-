const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  totalPages: {
    type: Number,
  },
  currentPage: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Not Started', 'Reading', 'Completed'],
    default: 'Not Started',
  },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);

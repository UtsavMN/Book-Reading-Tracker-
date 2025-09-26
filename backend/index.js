require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
try {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
} catch (error) {
  console.error('Failed to connect to MongoDB:', error);
}

// Routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const progressRoutes = require('./routes/progress');
const botRoutes = require('./routes/bot');

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/bot', botRoutes);

app.get('/', (req, res) => {
  res.send('Book Reading Tracker API is running');
});

app.get('/api/welcome', (req, res) => {
  res.json({ message: 'Welcome to the Book Reading Tracker API!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

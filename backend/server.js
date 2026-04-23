const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/neuronote';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

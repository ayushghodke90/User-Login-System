require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: '*', // Allow all origins for now
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString()
  });
  
  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Database connection and server start
async function startServer() {
  try {
    // Sync database models with force: false to prevent data loss
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer(); 
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome & API Manifest endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Nomadix Smart Travel & Collaborative Expense API Gateway',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
    },
  });
});

// Healthcheck endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);

// Test-only crash route for 500 error handler verification
if (process.env.NODE_ENV === 'test') {
  app.get('/test-error', (req, res, next) => {
    next(new Error('Simulated internal failure'));
  });
}

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: err.message || 'An unexpected error occurred',
    },
  });
});

module.exports = app;

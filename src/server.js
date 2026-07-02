import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { supabase } from './config/supabase.js';
import { errorHandler } from './middlewares/error.middleware.js';

// Import routes
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AI HR Assistant API is running',
    timestamp: new Date().toISOString(),
  });
});

// Global error handler - HARUS paling bawah
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`✅ Server running on http://localhost:${env.port}`);
  console.log(`🌍 Environment: ${env.nodeEnv}`);
});
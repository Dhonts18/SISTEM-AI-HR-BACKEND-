import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { supabase } from './config/supabase.js';

// Import routes
import authRoutes from './routes/auth.routes.js';

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // URL frontend Vite
  credentials: true,               // Penting: izinkan cookie dikirim
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

app.get('/api/health/db', async (req, res) => {
  try {
    const { error } = await supabase.from('users').select('count').limit(1);
    const tableNotFound =
      error?.code === '42P01' ||
      error?.message?.includes('schema cache') ||
      error?.message?.includes('does not exist');

    if (error && !tableNotFound) throw error;

    res.status(200).json({
      status: 'ok',
      message: 'Supabase connection successful',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Supabase connection failed',
      error: err.message,
    });
  }
});

app.listen(env.port, () => {
  console.log(`✅ Server running on http://localhost:${env.port}`);
  console.log(`🌍 Environment: ${env.nodeEnv}`);
});
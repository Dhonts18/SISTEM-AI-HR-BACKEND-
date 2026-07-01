import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { supabase } from './config/supabase.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check - cek server hidup
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'AI HR Assistant API is running',
    timestamp: new Date().toISOString(),
  });
});

// Health check - cek koneksi Supabase
app.get('/api/health/db', async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    // Koneksi berhasil jika:
    // 1. Tidak ada error sama sekali, ATAU
    // 2. Error karena tabel belum ada (wajar, schema belum dibuat)
    const tableNotFound =
      error?.code === '42P01' ||
      error?.message?.includes('schema cache') ||
      error?.message?.includes('does not exist');

    if (error && !tableNotFound) {
      throw error;
    }

    res.status(200).json({
      status: 'ok',
      message: 'Supabase connection successful',
      note: error ? 'Tables not created yet (schema pending)' : 'All tables ready',
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
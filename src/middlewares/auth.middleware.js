import dotenv from 'dotenv';
dotenv.config();

import { verifyAccessToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';
import { findUserById } from '../repositories/user.repository.js';

export const authenticate = async (req, res, next) => {
  try {
    // Ambil token dari header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Access token required', 401);
    }

    const token = authHeader.split(' ')[1];

    // Verifikasi token
    const decoded = verifyAccessToken(token);

    // Pastikan user masih ada dan aktif di database
    const user = await findUserById(decoded.userId);
    if (!user || !user.is_active) {
      return errorResponse(res, 'User not found or deactivated', 401);
    }

    // Attach user ke request supaya controller bisa akses
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next(); // lanjut ke controller
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Access token expired', 401);
    }
    if (err.name === 'JsonWebTokenError') {
      return errorResponse(res, 'Invalid access token', 401);
    }
    return errorResponse(res, 'Authentication failed', 500);
  }
};
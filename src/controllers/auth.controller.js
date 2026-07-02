import {
  registerService,
  loginService,
  refreshTokenService,
} from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const register = async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;

    if (!email || !password || !full_name) {
      return errorResponse(res, 'Email, password, and full name are required', 400);
    }

    if (password.length < 8) {
      return errorResponse(res, 'Password must be at least 8 characters', 400);
    }

    const user = await registerService({ email, password, full_name, role });
    return successResponse(res, 'Registration successful', user, 201);
  } catch (err) {
    if (err.message === 'Email already registered') {
      return errorResponse(res, err.message, 409);
    }
    return errorResponse(res, 'Registration failed', 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const { user, accessToken, refreshToken } = await loginService({ email, password });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 'Login successful', { user, accessToken });
  } catch (err) {
    console.error('LOGIN ERROR:', err.message); // ← tambah ini
    if (err.message === 'Invalid email or password') {
      return errorResponse(res, err.message, 401);
    }
    return errorResponse(res, err.message, 500); // ← tampilkan pesan asli sementara
  }
};

export const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const { accessToken } = await refreshTokenService(refreshToken);
    return successResponse(res, 'Token refreshed', { accessToken });
  } catch (err) {
    return errorResponse(res, 'Invalid or expired refresh token', 401);
  }
};

export const logout = async (req, res) => {
  res.clearCookie('refreshToken');
  return successResponse(res, 'Logout successful');
};
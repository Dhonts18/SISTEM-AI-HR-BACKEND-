import bcrypt from 'bcryptjs';
import {
  findUserByEmail,
  findUserById,
  createUser,
  createProfile,
} from '../repositories/user.repository.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';

export const registerService = async ({ email, password, full_name, role }) => {
  // Cek apakah email sudah terdaftar
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Hash password (salt rounds: 12 = keamanan tinggi tapi tidak terlalu lambat)
  const hashedPassword = await bcrypt.hash(password, 12);

  // Buat user baru
  const user = await createUser({
    email,
    password: hashedPassword,
    role: role || 'candidate',
  });

  // Buat profile kosong untuk user ini
  await createProfile({
    user_id: user.id,
    full_name,
  });

  // Jangan kembalikan password ke client
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const loginService = async ({ email, password }) => {
  // Cari user
  const user = await findUserByEmail(email);
  if (!user) {
    // Pesan error sengaja dibuat generik (tidak bilang "email tidak ditemukan")
    // supaya attacker tidak tahu email mana yang terdaftar
    throw new Error('Invalid email or password');
  }

  // Bandingkan password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Cek apakah akun aktif
  if (!user.is_active) {
    throw new Error('Account is deactivated');
  }

  // Generate tokens
  const payload = { userId: user.id, role: user.role, email: user.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, accessToken, refreshToken };
};

export const refreshTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }

  // Verifikasi refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Pastikan user masih ada dan aktif
  const user = await findUserById(decoded.userId);
  if (!user || !user.is_active) {
    throw new Error('User not found or deactivated');
  }

  // Generate access token baru
  const payload = { userId: user.id, role: user.role, email: user.email };
  const newAccessToken = generateAccessToken(payload);

  return { accessToken: newAccessToken };
};
import { errorResponse } from '../utils/response.js';

// Fungsi ini menerima daftar role yang diizinkan
// Contoh: authorize('hr', 'admin') → hanya hr dan admin yang boleh akses
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Access denied. Required roles: ${allowedRoles.join(', ')}`,
        403
      );
    }

    next();
  };
};
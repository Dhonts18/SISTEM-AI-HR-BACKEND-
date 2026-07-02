import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Route test protected - hanya user login yang bisa akses
router.get('/me', authenticate, (req, res) => {
  res.json({ success: true, message: 'You are authenticated', data: req.user });
});

// Route test role - hanya HR dan Admin yang bisa akses
router.get('/hr-only', authenticate, authorize('hr', 'admin'), (req, res) => {
  res.json({ success: true, message: 'Welcome HR!', data: req.user });
});

export default router;
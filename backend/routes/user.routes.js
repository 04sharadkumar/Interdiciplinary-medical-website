// backend/routes/user.routes.js
import express from 'express';
import { registerUser, loginUser, getMe } from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only admins can register users
router.post('/register', protect, authorize('admin'), registerUser);

// Login public
router.post('/login', loginUser);

// Get current user
router.get('/me', protect, getMe);

export default router;

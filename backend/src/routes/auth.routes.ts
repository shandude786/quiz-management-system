import express from 'express';
import { body } from 'express-validator';
import { register, login, logout, getMe } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty().trim(),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  login
);

router.post('/logout', logout);

router.get('/me', authMiddleware, getMe);

export default router;
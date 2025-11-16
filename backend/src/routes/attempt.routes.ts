import express from 'express';
import { body } from 'express-validator';
import { submitQuiz, getUserAttempts } from '../controllers/attempt.controller';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

router.post(
  '/submit',
  authMiddleware,
  [
    body('quizId').notEmpty(),
    body('answers').isObject(),
    body('timeTaken').optional().isInt(),
  ],
  submitQuiz
);

router.get('/quiz/:quizId', authMiddleware, getUserAttempts);

export default router;
import express from 'express';
import { body } from 'express-validator';
import {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} from '../controllers/quiz.controller';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';

const router = express.Router();

router.get('/', authMiddleware, getAllQuizzes);
router.get('/:id', authMiddleware, getQuizById);

router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  [
    body('title').notEmpty().trim(),
    body('category').notEmpty().trim(),
    body('timeLimit').isInt({ min: 1 }),
    body('totalQuestions').isInt({ min: 1 }),
  ],
  createQuiz
);

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  [
    body('title').notEmpty().trim(),
    body('category').notEmpty().trim(),
    body('timeLimit').isInt({ min: 1 }),
    body('totalQuestions').isInt({ min: 1 }),
  ],
  updateQuiz
);

router.delete('/:id', authMiddleware, adminMiddleware, deleteQuiz);

export default router;

import express from 'express';
import { body } from 'express-validator';
import {
  getQuestionsByQuizId,
  getQuestionsForAdmin,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '../controllers/question.controller';
import { authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';

const router = express.Router();

router.get('/quiz/:quizId', authMiddleware, getQuestionsByQuizId);
router.get('/quiz/:quizId/admin', authMiddleware, adminMiddleware, getQuestionsForAdmin);

router.post(
  '/',
  authMiddleware,
  adminMiddleware,
  [
    body('quizId').notEmpty(),
    body('questionText').notEmpty().trim(),
    body('optionA').notEmpty().trim(),
    body('optionB').notEmpty().trim(),
    body('optionC').notEmpty().trim(),
    body('optionD').notEmpty().trim(),
    body('correctAnswer').isIn(['A', 'B', 'C', 'D']),
  ],
  createQuestion
);

router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  [
    body('questionText').notEmpty().trim(),
    body('optionA').notEmpty().trim(),
    body('optionB').notEmpty().trim(),
    body('optionC').notEmpty().trim(),
    body('optionD').notEmpty().trim(),
    body('correctAnswer').isIn(['A', 'B', 'C', 'D']),
  ],
  updateQuestion
);

router.delete('/:id', authMiddleware, adminMiddleware, deleteQuestion);

export default router;

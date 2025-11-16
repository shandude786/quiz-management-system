import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getQuestionsByQuizId = async (req: AuthRequest, res: Response) => {
  try {
    const { quizId } = req.params;
    const isAdmin = req.user?.role === 'ADMIN';

    const questions = await prisma.question.findMany({
      where: { quizId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        questionText: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        correctAnswer: isAdmin, // Only include correct answer for admin
        createdAt: true,
      },
    });

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getQuestionsForAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const { quizId } = req.params;

    const questions = await prisma.question.findMany({
      where: { quizId },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { quizId, questionText, optionA, optionB, optionC, optionD, correctAnswer } = req.body;

    const question = await prisma.question.create({
      data: {
        quizId,
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
      },
    });

    res.status(201).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { questionText, optionA, optionB, optionC, optionD, correctAnswer } = req.body;

    const question = await prisma.question.update({
      where: { id },
      data: {
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
      },
    });

    res.json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.question.delete({ where: { id } });

    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

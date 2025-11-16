import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const getAllQuizzes = async (req: AuthRequest, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    res.json({ success: true, quizzes });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getQuizById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, timeLimit, totalQuestions } = req.body;

    const quiz = await prisma.quiz.create({
      data: {
        title,
        category,
        timeLimit,
        totalQuestions,
        createdBy: req.user!.id,
      },
    });

    res.status(201).json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, timeLimit, totalQuestions } = req.body;

    const quiz = await prisma.quiz.update({
      where: { id },
      data: {
        title,
        category,
        timeLimit,
        totalQuestions,
      },
    });

    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.quiz.delete({ where: { id } });

    res.json({ success: true, message: 'Quiz deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth';

export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { quizId, answers, timeTaken } = req.body;

    // Get all questions with correct answers
    const questions = await prisma.question.findMany({
      where: { quizId },
      select: {
        id: true,
        correctAnswer: true,
      },
    });

    // Calculate score
    let score = 0;
    const results = questions.map((question) => {
      const userAnswer = answers[question.id];
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) score++;
      
      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      };
    });

    // Save attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: req.user!.id,
        quizId,
        score,
        totalQuestions: questions.length,
        answers,
        timeTaken,
      },
    });

    // Get detailed question info for response
    const detailedQuestions = await prisma.question.findMany({
      where: { quizId },
      select: {
        id: true,
        questionText: true,
        optionA: true,
        optionB: true,
        optionC: true,
        optionD: true,
        correctAnswer: true,
      },
    });

    const detailedResults = detailedQuestions.map((q) => {
      const userAnswer = answers[q.id];
      return {
        ...q,
        userAnswer,
        isCorrect: userAnswer === q.correctAnswer,
      };
    });

    res.json({
      success: true,
      result: {
        score,
        totalQuestions: questions.length,
        percentage: (score / questions.length) * 100,
        questions: detailedResults,
      },
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserAttempts = async (req: AuthRequest, res: Response) => {
  try {
    const { quizId } = req.params;

    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId: req.user!.id,
        quizId,
      },
      orderBy: { completedAt: 'desc' },
      include: {
        quiz: {
          select: {
            title: true,
            category: true,
          },
        },
      },
    });

    res.json({ success: true, attempts });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  timeLimit: number;
  totalQuestions: number;
  createdAt?: string;
  _count?: {
    questions: number;
  };
}

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer?: 'A' | 'B' | 'C' | 'D';
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  answers: Record<string, string>;
  timeTaken?: number;
  completedAt: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  questions: Array<Question & {
    userAnswer: string;
    isCorrect: boolean;
  }>;
}
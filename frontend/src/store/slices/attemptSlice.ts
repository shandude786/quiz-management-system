import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { QuizResult } from '../../types';

interface AttemptState {
  currentQuizId: string | null;
  answers: Record<string, string>;
  timeRemaining: number;
  result: QuizResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: AttemptState = {
  currentQuizId: null,
  answers: {},
  timeRemaining: 0,
  result: null,
  loading: false,
  error: null,
};

export const submitQuiz = createAsyncThunk(
  'attempt/submitQuiz',
  async (data: { quizId: string; answers: Record<string, string>; timeTaken?: number }) => {
    const response = await api.post('/api/attempts/submit', data);
    return response.data.result;
  }
);

const attemptSlice = createSlice({
  name: 'attempt',
  initialState,
  reducers: {
    startQuiz: (state, action: PayloadAction<{ quizId: string; timeLimit: number }>) => {
      state.currentQuizId = action.payload.quizId;
      state.answers = {};
      state.timeRemaining = action.payload.timeLimit * 60;
      state.result = null;
    },
    setAnswer: (state, action: PayloadAction<{ questionId: string; answer: string }>) => {
      state.answers[action.payload.questionId] = action.payload.answer;
    },
    decrementTime: (state) => {
      if (state.timeRemaining > 0) {
        state.timeRemaining -= 1;
      }
    },
    resetAttempt: (state) => {
      state.currentQuizId = null;
      state.answers = {};
      state.timeRemaining = 0;
      state.result = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitQuiz.fulfilled, (state, action: PayloadAction<QuizResult>) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit quiz';
      });
  },
});

export const { startQuiz, setAnswer, decrementTime, resetAttempt } = attemptSlice.actions;
export default attemptSlice.reducer;
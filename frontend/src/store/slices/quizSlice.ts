import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Quiz } from '../../types';

interface QuizState {
  quizzes: Quiz[];
  currentQuiz: Quiz | null;
  loading: boolean;
  error: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  currentQuiz: null,
  loading: false,
  error: null,
};

export const fetchQuizzes = createAsyncThunk('quiz/fetchQuizzes', async () => {
  const response = await api.get('/api/quizzes');
  return response.data.quizzes;
});

export const fetchQuizById = createAsyncThunk('quiz/fetchQuizById', async (id: string) => {
  const response = await api.get(`/api/quizzes/${id}`);
  return response.data.quiz;
});

export const createQuiz = createAsyncThunk('quiz/createQuiz', async (quizData: Omit<Quiz, 'id'>) => {
  const response = await api.post('/api/quizzes', quizData);
  return response.data.quiz;
});

export const updateQuiz = createAsyncThunk(
  'quiz/updateQuiz',
  async ({ id, data }: { id: string; data: Partial<Quiz> }) => {
    const response = await api.put(`/api/quizzes/${id}`, data);
    return response.data.quiz;
  }
);

export const deleteQuiz = createAsyncThunk('quiz/deleteQuiz', async (id: string) => {
  await api.delete(`/api/quizzes/${id}`);
  return id;
});

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    clearCurrentQuiz: (state) => {
      state.currentQuiz = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action: PayloadAction<Quiz[]>) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch quizzes';
      })
      .addCase(fetchQuizById.fulfilled, (state, action: PayloadAction<Quiz>) => {
        state.currentQuiz = action.payload;
      })
      .addCase(createQuiz.fulfilled, (state, action: PayloadAction<Quiz>) => {
        state.quizzes.push(action.payload);
      })
      .addCase(updateQuiz.fulfilled, (state, action: PayloadAction<Quiz>) => {
        const index = state.quizzes.findIndex((q) => q.id === action.payload.id);
        if (index !== -1) {
          state.quizzes[index] = action.payload;
        }
      })
      .addCase(deleteQuiz.fulfilled, (state, action: PayloadAction<string>) => {
        state.quizzes = state.quizzes.filter((q) => q.id !== action.payload);
      });
  },
});

export const { clearCurrentQuiz } = quizSlice.actions;
export default quizSlice.reducer;

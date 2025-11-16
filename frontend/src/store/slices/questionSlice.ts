import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';
import { Question } from '../../types';

interface QuestionState {
  questions: Question[];
  loading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  questions: [],
  loading: false,
  error: null,
};

export const fetchQuestions = createAsyncThunk('question/fetchQuestions', async (quizId: string) => {
  const response = await api.get(`/api/questions/quiz/${quizId}`);
  return response.data.questions;
});

export const fetchQuestionsForAdmin = createAsyncThunk(
  'question/fetchQuestionsForAdmin',
  async (quizId: string) => {
    const response = await api.get(`/api/questions/quiz/${quizId}/admin`);
    return response.data.questions;
  }
);

export const createQuestion = createAsyncThunk(
  'question/createQuestion',
  async (questionData: Omit<Question, 'id'>) => {
    const response = await api.post('/api/questions', questionData);
    return response.data.question;
  }
);

export const updateQuestion = createAsyncThunk(
  'question/updateQuestion',
  async ({ id, data }: { id: string; data: Partial<Question> }) => {
    const response = await api.put(`/api/questions/${id}`, data);
    return response.data.question;
  }
);

export const deleteQuestion = createAsyncThunk('question/deleteQuestion', async (id: string) => {
  await api.delete(`/api/questions/${id}`);
  return id;
});

const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    clearQuestions: (state) => {
      state.questions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuestions.fulfilled, (state, action: PayloadAction<Question[]>) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch questions';
      })
      .addCase(fetchQuestionsForAdmin.fulfilled, (state, action: PayloadAction<Question[]>) => {
        state.questions = action.payload;
      })
      .addCase(createQuestion.fulfilled, (state, action: PayloadAction<Question>) => {
        state.questions.push(action.payload);
      })
      .addCase(updateQuestion.fulfilled, (state, action: PayloadAction<Question>) => {
        const index = state.questions.findIndex((q) => q.id === action.payload.id);
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })
      .addCase(deleteQuestion.fulfilled, (state, action: PayloadAction<string>) => {
        state.questions = state.questions.filter((q) => q.id !== action.payload);
      });
  },
});

export const { clearQuestions } = questionSlice.actions;
export default questionSlice.reducer;

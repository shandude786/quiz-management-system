import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import quizReducer from './slices/quizSlice';
import questionReducer from './slices/questionSlice';
import attemptReducer from './slices/attemptSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quiz: quizReducer,
    question: questionReducer,
    attempt: attemptReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getCurrentUser } from './store/slices/authSlice';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TakeQuizPage from './pages/TakeQuizPage';
import QuizResultPage from './pages/QuizResultPage';
import QuestionManagementPage from './pages/QuestionManagementPage';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';
import { CircularProgress, Box } from '@mui/material';

function App() {
  const dispatch = useAppDispatch();
  const {  loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/quiz/:id" element={<TakeQuizPage />} />
        <Route path="/quiz/:id/result" element={<QuizResultPage />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/quiz/:id/questions" element={<QuestionManagementPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

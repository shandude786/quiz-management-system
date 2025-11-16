import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchQuizzes } from '../store/slices/quizSlice';
import { logout } from '../store/slices/authSlice';
import { startQuiz } from '../store/slices/attemptSlice';
import QuizCard from '../components/user/QuizCard';
import { Quiz } from '../types';

const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { quizzes, loading } = useAppSelector((state) => state.quiz);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const handleStartQuiz = (quiz: Quiz) => {
    dispatch(startQuiz({ quizId: quiz.id, timeLimit: quiz.timeLimit }));
    navigate(`/quiz/${quiz.id}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Welcome, {user?.name}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Quizzes
        </Typography>
        {loading ? (
          <Typography>Loading quizzes...</Typography>
        ) : (
          <Grid container spacing={3}>
            {quizzes.map((quiz) => (
              <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                <QuizCard quiz={quiz} onStart={handleStartQuiz} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default UserDashboard;

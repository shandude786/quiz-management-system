import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Add, Edit, Delete, Logout } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchQuizzes, createQuiz, deleteQuiz } from '../store/slices/quizSlice';
import { logout } from '../store/slices/authSlice';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { quizzes } = useAppSelector((state) => state.quiz);
  const { user } = useAppSelector((state) => state.auth);

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    timeLimit: 10,
    totalQuestions: 10,
  });

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const handleCreateQuiz = async () => {
    await dispatch(createQuiz(formData));
    setOpenDialog(false);
    setFormData({ title: '', category: '', timeLimit: 10, totalQuestions: 10 });
    dispatch(fetchQuizzes());
  };

  const handleDeleteQuiz = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      await dispatch(deleteQuiz(id));
    }
  };

  const handleManageQuestions = (quizId: string) => {
    navigate(`/admin/quiz/${quizId}/questions`);
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
            Admin Dashboard - {user?.name}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Quiz Management</Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          sx={{ mb: 3 }}
        >
          Create New Quiz
        </Button>

        <Paper>
          <List>
            {quizzes.map((quiz, index) => (
              <div key={quiz.id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton onClick={() => handleManageQuestions(quiz.id)}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteQuiz(quiz.id)} color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={quiz.title}
                    secondary={`${quiz.category} • ${quiz.timeLimit} min • ${quiz._count?.questions || 0} questions`}
                  />
                </ListItem>
              </div>
            ))}
          </List>
        </Paper>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Quiz</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Quiz Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="number"
              label="Time Limit (minutes)"
              value={formData.timeLimit}
              onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="number"
              label="Number of Questions"
              value={formData.totalQuestions}
              onChange={(e) =>
                setFormData({ ...formData, totalQuestions: parseInt(e.target.value) })
              }
              margin="normal"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateQuiz} variant="contained">
              Create Quiz
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default AdminDashboard;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Add, Delete, ArrowBack } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchQuizById } from '../store/slices/quizSlice';
import {
  fetchQuestionsForAdmin,
  createQuestion,
  deleteQuestion,
} from '../store/slices/questionSlice';

const QuestionManagementPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentQuiz } = useAppSelector((state) => state.quiz);
  const { questions } = useAppSelector((state) => state.question);

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A' as 'A' | 'B' | 'C' | 'D',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchQuizById(id));
      dispatch(fetchQuestionsForAdmin(id));
    }
  }, [id, dispatch]);

  const handleCreateQuestion = async () => {
    if (id) {
      await dispatch(createQuestion({ ...formData, quizId: id }));
      setOpenDialog(false);
      setFormData({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
      });
      dispatch(fetchQuestionsForAdmin(id));
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      await dispatch(deleteQuestion(questionId));
      if (id) {
        dispatch(fetchQuestionsForAdmin(id));
      }
    }
  };

  const handleBack = () => {
    navigate('/admin');
  };

  if (!currentQuiz) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={handleBack}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">Manage Questions - {currentQuiz.title}</Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpenDialog(true)}
        sx={{ mb: 3 }}
      >
        Add Question
      </Button>

      <Paper>
        <List>
          {questions.map((question, index) => (
            <div key={question.id}>
              {index > 0 && <Divider />}
              <ListItem
                secondaryAction={
                  <IconButton onClick={() => handleDeleteQuestion(question.id)} color="error">
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`Q${index + 1}: ${question.questionText}`}
                  secondary={`Correct Answer: ${question.correctAnswer}`}
                />
              </ListItem>
            </div>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Question</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Question Text"
            value={formData.questionText}
            onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
            margin="normal"
            multiline
            rows={2}
            required
          />
          <TextField
            fullWidth
            label="Option A"
            value={formData.optionA}
            onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Option B"
            value={formData.optionB}
            onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Option C"
            value={formData.optionC}
            onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Option D"
            value={formData.optionD}
            onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
            margin="normal"
            required
          />
          <FormControl component="fieldset" margin="normal">
            <FormLabel>Correct Answer</FormLabel>
            <RadioGroup
              row
              value={formData.correctAnswer}
              onChange={(e) =>
                setFormData({ ...formData, correctAnswer: e.target.value as 'A' | 'B' | 'C' | 'D' })
              }
            >
              <FormControlLabel value="A" control={<Radio />} label="A" />
              <FormControlLabel value="B" control={<Radio />} label="B" />
              <FormControlLabel value="C" control={<Radio />} label="C" />
              <FormControlLabel value="D" control={<Radio />} label="D" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateQuestion} variant="contained">
            Save Question
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuestionManagementPage;
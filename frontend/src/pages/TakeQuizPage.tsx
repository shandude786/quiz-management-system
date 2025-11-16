import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  IconButton,
  FormControl,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchQuizById } from '../store/slices/quizSlice';
import { fetchQuestions } from '../store/slices/questionSlice';
import { submitQuiz, setAnswer, resetAttempt } from '../store/slices/attemptSlice';
import Timer from '../components/common/Timer';

const TakeQuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentQuiz } = useAppSelector((state) => state.quiz);
  const { questions } = useAppSelector((state) => state.question);
  const { answers, timeRemaining } = useAppSelector((state) => state.attempt);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchQuizById(id));
      dispatch(fetchQuestions(id));
    }
  }, [id, dispatch]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    dispatch(setAnswer({ questionId, answer }));
  };

  const handleSubmit = async () => {
    if (id && !submitted) {
      setSubmitted(true);
      const timeTaken = (currentQuiz!.timeLimit * 60) - timeRemaining;
      await dispatch(submitQuiz({ quizId: id, answers, timeTaken }));
      navigate(`/quiz/${id}/result`);
    }
  };

  const handleBack = () => {
    dispatch(resetAttempt());
    navigate('/dashboard');
  };

  if (!currentQuiz) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={handleBack}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">{currentQuiz.title}</Typography>
      </Box>

      <Timer timeLimit={currentQuiz.timeLimit} onExpire={handleSubmit} />

      {questions.map((question, index) => (
        <Paper key={question.id} sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Question {index + 1}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {question.questionText}
          </Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            >
              <FormControlLabel value="A" control={<Radio />} label={`A. ${question.optionA}`} />
              <FormControlLabel value="B" control={<Radio />} label={`B. ${question.optionB}`} />
              <FormControlLabel value="C" control={<Radio />} label={`C. ${question.optionC}`} />
              <FormControlLabel value="D" control={<Radio />} label={`D. ${question.optionD}`} />
            </RadioGroup>
          </FormControl>
        </Paper>
      ))}

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleSubmit}
        disabled={submitted}
      >
        {submitted ? 'Submitting...' : 'Submit Quiz'}
      </Button>
    </Container>
  );
};

export default TakeQuizPage;
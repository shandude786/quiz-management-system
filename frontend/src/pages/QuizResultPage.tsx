import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  LinearProgress,
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { resetAttempt } from '../store/slices/attemptSlice';

const QuizResultPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { result } = useAppSelector((state) => state.attempt);

  if (!result) {
    return <Typography>Loading results...</Typography>;
  }

  const handleBackToDashboard = () => {
    dispatch(resetAttempt());
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, mb: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Quiz Results
        </Typography>
        <Typography variant="h2" color="primary" gutterBottom>
          {result.score} / {result.totalQuestions}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {result.percentage.toFixed(0)}% Score
        </Typography>
        <LinearProgress
          variant="determinate"
          value={result.percentage}
          sx={{ mt: 2, height: 10, borderRadius: 5 }}
        />
      </Paper>

      <Typography variant="h5" gutterBottom>
        Answer Review
      </Typography>
      {result.questions.map((question, index) => (
        <Paper key={question.id} sx={{ p: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            {question.isCorrect ? (
              <Check color="success" />
            ) : (
              <Close color="error" />
            )}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" gutterBottom>
                Question {index + 1}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {question.questionText}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography
                  variant="body2"
                  color={question.isCorrect ? 'success.main' : 'error.main'}
                >
                  Your Answer:{' '}
                  {question.userAnswer
                    ? `${question.userAnswer}. ${
                        question[`option${question.userAnswer}` as keyof typeof question]
                      }`
                    : 'Not answered'}
                </Typography>
                {!question.isCorrect && question.correctAnswer && (
                  <Typography variant="body2" color="success.main">
                    Correct Answer:{' '}
                    {question.correctAnswer}.{' '}
                    {question[`option${question.correctAnswer}` as keyof typeof question]}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      ))}

      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={handleBackToDashboard}
      >
        Back to Dashboard
      </Button>
    </Container>
  );
};

export default QuizResultPage;

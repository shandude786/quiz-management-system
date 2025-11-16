import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { Timer, QuestionAnswer } from '@mui/icons-material';
import { Quiz } from '../../types';

interface QuizCardProps {
  quiz: Quiz;
  onStart: (quiz: Quiz) => void;
}

const QuizCard = ({ quiz, onStart }: QuizCardProps) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {quiz.title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={quiz.category} color="primary" size="small" />
          <Chip icon={<Timer />} label={`${quiz.timeLimit} min`} size="small" />
          <Chip
            icon={<QuestionAnswer />}
            label={`${quiz._count?.questions || quiz.totalQuestions} questions`}
            size="small"
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button fullWidth variant="contained" onClick={() => onStart(quiz)}>
          Start Quiz
        </Button>
      </CardActions>
    </Card>
  );
};

export default QuizCard;

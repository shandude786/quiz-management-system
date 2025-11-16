import { useEffect } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { Timer as TimerIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { decrementTime } from '../../store/slices/attemptSlice';

interface TimerProps {
  timeLimit: number;
  onExpire: () => void;
}

const Timer = ({ timeLimit, onExpire }: TimerProps) => {
  const dispatch = useAppDispatch();
  const timeRemaining = useAppSelector((state) => state.attempt.timeRemaining);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      dispatch(decrementTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, dispatch, onExpire]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const percentage = (timeRemaining / (timeLimit * 60)) * 100;

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <TimerIcon color={percentage < 20 ? 'error' : 'primary'} />
        <Typography variant="h6" color={percentage < 20 ? 'error' : 'primary'}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={percentage}
        color={percentage < 20 ? 'error' : 'primary'}
      />
    </Box>
  );
};

export default Timer;

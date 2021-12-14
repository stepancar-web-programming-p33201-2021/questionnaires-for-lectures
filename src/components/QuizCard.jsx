import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box
} from '@mui/material';

import React from 'react';
import testImage from '../images/3307.jpg';

function QuizCard() {
  return (
    <Card sx={{ width: 345 }}>
      <CardMedia
        component='img'
        height='140'
        src={testImage}
        alt='test'
      />
      <CardContent>
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Typography gutterBottom variant='h5' component='p'>
            Название квиза
          </Typography>
          <Typography sx={{fontSize: '13px'}}>Автор квиза</Typography>
        </Box>
        <Typography color='text.secondary'>Описание квиза</Typography>
      </CardContent>
      <CardActions>
        <Button size='small'>Пройти</Button>
      </CardActions>
    </Card>
  );
}

export default QuizCard;

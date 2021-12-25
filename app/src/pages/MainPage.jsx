import { Container, Grid } from '@mui/material';
import React from 'react';
import QuizCard from '../components/QuizCard';

function MainPage() {
  return (
    <Container sx={{ padding: 5 }} maxWidth='xl'>
      <Grid container spacing={2}>
        <Grid item>
          <QuizCard />
        </Grid>
        <Grid item>
          <QuizCard />
        </Grid>
        <Grid item>
          <QuizCard />
        </Grid>
        <Grid item>
          <QuizCard />
        </Grid>
      </Grid>
    </Container>
  );
}

export default MainPage;

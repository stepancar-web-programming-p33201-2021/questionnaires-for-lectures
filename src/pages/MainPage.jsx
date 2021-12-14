import { Container, Grid } from '@mui/material';
import React from 'react';
import QuizBuilder from '../components/QuizBuilder';
import QuizCard from '../components/QuizCard';

function MainPage() {
  return (
      <QuizBuilder />
    /* <Container sx={{ padding: 5 }} maxWidth='xl'>
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
    </Container> */
  );
}

export default MainPage;

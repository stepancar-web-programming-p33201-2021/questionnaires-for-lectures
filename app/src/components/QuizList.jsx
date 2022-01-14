import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getAllQuizzes } from '../actions/QuizActions';
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Statistics from './Statistics';

export class QuizList extends Component {
  componentDidMount() {
    this.props.getAllQuizzes();
  }
  render() {
    let { someQuizzes } = this.props;
    return (
      <>
        <Typography
          component='h2'
          variant='h3'
          sx={{ textAlign: 'center', marginBottom: '20px' }}
        >
          Квизы
        </Typography>
        <Container
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {someQuizzes &&
            someQuizzes.length > 0 &&
            someQuizzes.map((quiz, index) => {
              return (
                <Card key={quiz._id} sx={{ width: 350, margin: '10px' }}>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant='h5'
                      component='p'
                      sx={{ textAlign: 'left' }}
                    >
                      {quiz.name}
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Button fullWidth>
                      <Link
                        style={{ textDecoration: 'none' }}
                        key={quiz._id}
                        to={`/quiz/${quiz._id}`}
                      >
                        Пройти
                      </Link>
                    </Button>
                    <Button fullWidth>
                      <Link
                        style={{ textDecoration: 'none' }}
                        key={quiz._id}
                        to={`/qr/${quiz._id}`}
                      >
                        QR-code
                      </Link>
                    </Button>
                  </CardActions>
                  <Statistics quiz={quiz}/>
                </Card>
              );
            })}
        </Container>
      </>
    );
  }
}

const mapStateToProps = ({ quizBuilder: { someQuizzes } }) => ({
  someQuizzes,
});

export default connect(mapStateToProps, { getAllQuizzes })(QuizList);

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
            someQuizzes.map((quiz) => {
              return (
                <Card key={quiz._id} sx={{ width: 345, margin: '10px' }}>
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
                  <CardActions>
                    <Button size='small'>
                      <Link style={{textDecoration: 'none'}} key={quiz._id} to={`/quiz/${quiz._id}`}>
                        Пройти
                      </Link>
                    </Button>
                  </CardActions>
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

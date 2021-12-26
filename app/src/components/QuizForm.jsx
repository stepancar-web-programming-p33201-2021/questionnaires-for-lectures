import {
  Container,
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  Alert,
  Fade,
} from '@mui/material';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addQuestion, submitQuiz } from '../actions/QuizActions';
import QuestionBuilder from './QuestionBuilder';
import { styled } from '@mui/material/styles';

var shuffle = require('knuth-shuffle').knuthShuffle;

export const CustomMuiButton = styled(Button)({
  marginBottom: '20px',
  width: '100%',
  height: '50px',
});

class QuizForm extends Component {
  state = {
    name: '',
  };

  componentDidMount() {}
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  setErrorMessage(message) {
    this.setState({
      error: message,
    });
    setTimeout(() => {
      this.setState({
        error: null,
      });
    }, 3000);
  }

  onSubmit = async (e) => {
    e.preventDefault();
    //проверка все ли обязательные поля заполнены
    let incompleteQuestion = this.props.questions.filter(
      (q) => q.requiredFieldsEmpty === true
    );

    if (
      incompleteQuestion.length > 0 ||
      this.state.name === '' ||
      this.state.name === undefined
    ) {
      this.setErrorMessage('Заполните пустые поля');
    } else {
      let questions = this.props.questions.map((q) => {
        let randomOrderedAnswers = shuffle(
          [
            q.correct_answer,
            q.other_answers1,
            q.other_answers2,
            q.other_answers3,
          ].slice(0)
        );
        return {
          correct_answer: q.correct_answer,
          created: q.created,
          error: q.error,
          id: q.id,
          img_src: q.img_src,
          index: q.index,
          answers: randomOrderedAnswers,
          question: q.question,
        };
      });
      let quiz = {
        questions,
        name: this.state.name,
      };
      const id = await this.props.submitQuiz(quiz);
      this.props.navigate(`/quiz/${id}`);
    }
  };
  render() {
    let content = this.props.questions
      ? this.props.questions.map((q, i) => (
          <React.Fragment key={i}>
            <QuestionBuilder key={q.id} {...q} index={i} />
          </React.Fragment>
        ))
      : null;
    return (
      <Paper
        sx={{
          width: '50%',
          margin: '0 auto',
          padding: '20px',
          boxSizing: 'border-box',
          marginBottom: '30px',
        }}
      >
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            component='h2'
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              marginBottom: '20px',
              fontSize: '22px',
              letterSpacing: 3,
            }}
          >
            Cоздать квиз
          </Typography>

          <TextField
            fullWidth
            name='name'
            value={this.state.name}
            onChange={this.handleChange}
            type='text'
            label='Название квиза'
            sx={{ marginBottom: '20px' }}
          />
          {/* Генератор квиза */}
          <Box sx={{borderBottom: '1.5px solid rgb(228, 228, 228)', borderTop: '1.5px solid rgb(228, 228, 228)', paddingTop: '20px'}}>{content}</Box>
          {this.state.error && (
            <Fade in={this.state.error} timeout={{ enter: 1000, exit: 500 }}>
              <Alert
                severity='error'
                sx={{
                  mb: 2,
                  position: 'fixed',
                  bottom: 16,
                  left: 16,
                  zIndex: '10',
                }}
              >
                {this.state.error}
              </Alert>
            </Fade>
          )}

          <CustomMuiButton
            sx={{ marginTop: '20px' }}
            variant='contained'
            color='success'
            onClick={this.props.addQuestion}
          >
            Добавить вопрос
          </CustomMuiButton>

          <CustomMuiButton
            variant='contained'
            type='submit'
            onClick={this.onSubmit}
          >
            Создать квиз
          </CustomMuiButton>
        </Container>
      </Paper>
    );
  }
}

const mapStateToProps = ({ quizBuilder: { name, questions } }) => ({
  name,
  questions,
});

export default connect(mapStateToProps, { addQuestion, submitQuiz })(QuizForm);

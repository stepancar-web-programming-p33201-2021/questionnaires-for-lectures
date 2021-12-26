import React, { Component } from 'react';
import {
  addQuestion,
  updateQuestion,
  deleteQuestion,
} from '../actions/QuizActions';
import QuestionPreview from './QuestionPreview';
import { connect } from 'react-redux';
import { CustomMuiButton } from './QuizForm';
import { Typography, TextField, Box } from '@mui/material';

class QuestionBuilder extends Component {
  state = {
    id: this.props.id,
    question: this.props.question,
    img_src: this.props.img_src,
    correct_answer: this.props.correct_answer,
    other_answers1: this.props.other_answers1,
    other_answers2: this.props.other_answers2,
    other_answers3: this.props.other_answers3,
    requiredFieldsEmpty: this.props.requiredFieldsEmpty,
    index: this.props.index,
    error: this.props.error,
    created: this.props.created,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.props.updateQuestion(this.state);
      if (this.requiredFieldsEmpty()) {
        this.setState(
          {
            requiredFieldsEmpty: true,
          },
          () => this.props.updateQuestion(this.state)
        );
      } else {
        this.setState(
          {
            requiredFieldsEmpty: false,
          },
          () => this.props.updateQuestion(this.state)
        );
      }
    });
  };

  requiredFieldsEmpty() {
    if (
      this.state.question === undefined ||
      this.state.question === '' ||
      this.state.correct_answer === undefined ||
      this.state.correct_answer === '' ||
      this.state.other_answers1 === undefined ||
      this.state.other_answers1 === '' ||
      this.state.other_answers2 === undefined ||
      this.state.other_answers2 === '' ||
      this.state.other_answers3 === undefined ||
      this.state.other_answers3 === ''
    ) {
      return true;
    } else {
      return false;
    }
  }

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

  render() {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          fullWidth
          type='text'
          name='question'
          value={this.state.question || ''}
          onChange={this.handleChange}
          label='Вопрос'
          sx={{ marginBottom: '30px' }}
        />
        <TextField
          type='text'
          sx={{ marginBottom: '10px' }}
          name='img_src'
          onChange={this.handleChange}
          value={this.state.img_src || ''}
          label='Изображение (Необязательно)'
        />
        <TextField
          type='text'
          name='correct_answer'
          onChange={this.handleChange}
          value={this.state.correct_answer || ''}
          label='Правильный ответ'
          sx={{ marginBottom: '20px' }}
          color='success'
        />
        <Box sx={{ display: 'flex'}}>
          <TextField
            type='text'
            name='other_answers1'
            onChange={this.handleChange}
            value={this.state.other_answers1 || ''}
            label='Вариант ответа 1'
            sx={{ marginRight: '15px' }}
          />
          <TextField
            type='text'
            name='other_answers2'
            onChange={this.handleChange}
            value={this.state.other_answers2 || ''}
            label='Вариант ответа 2'
            sx={{ marginRight: '15px' }}
          />
          <TextField
            type='text'
            name='other_answers3'
            onChange={this.handleChange}
            value={this.state.other_answers3 || ''}
            label='Вариант ответа 3'
          />
        </Box>
        <Typography sx={{marginTop: '10px', marginBottom: '20px'}} component='span' >
          * Ответы будут перемешаны автоматически
        </Typography>
        <div>
          {this.state.error && (
            <div className='alert alert-warning' role='alert'>
              {this.state.error}
            </div>
          )}
        </div>
        <QuestionPreview {...this.state} />

        <CustomMuiButton
          color='error'
          variant='contained'
          onClick={() => this.props.deleteQuestion(this.props.id)}
        >
          Удалить вопрос
        </CustomMuiButton>
      </Box>
    );
  }
}

const mapStateToProps = ({ quizBuilder: { questions } }) => ({ questions });

export default connect(mapStateToProps, {
  addQuestion,
  updateQuestion,
  deleteQuestion,
})(QuestionBuilder);

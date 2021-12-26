import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { setQuiz, showAnswers } from '../actions/answerQuizActions';
import QuestionDisplay from './QuestionDisplay';
import { useParams } from 'react-router-dom';

const withRouter = (WrappedComponent) => (props) => {
  const params = useParams();
  return (
    <WrappedComponent
      {...props}
      params={params}

    />
  );
};

class Quiz extends React.Component {
  state = {
    score: null,
    submitted: false,
  };
  componentDidMount() {
    this.props.setQuiz(this.props.params.id);
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

  onSubmit() {
    //проверка все ли вопросы отвечены
    let unanswered = this.props.questions.filter((q) => !q.userAnswer);
    if (unanswered.length === 0) {
      // если неотвеченных нет
      this.props.showAnswers();
      //количество очков
      this.setState({
        score: this.calculateScore(this.props.questions),
        submitted: true,
      });
    } else {
      this.setErrorMessage('Ответьте на все вопросы');
    }
  }

  calculateScore(questions) {
    const score = questions.reduce((acc, q) => {
      if (q.correct_answer === q.userAnswer) {
        return ++acc;
      } else return acc;
    }, 0);
    return score;
  }

  render() {
    const questions =
      this.props.questions &&
      this.props.questions.length > 0 &&
      this.props.questions.map((q, i) => <QuestionDisplay key={i} {...q} />);
    return (
      <Fragment>
        <div className='d-flex'>
          <div className='container'>
            <h1 className='text-center'>{this.props.name}</h1>
            {questions}

            {this.state.error && (
              <div className='alert alert-danger mt-3' role='alert'>
                {this.state.error}
              </div>
            )}
            {this.state.submitted && (
              <div className='alert alert-success mt-3' role='alert'>
                {`Количество правильных ответов ${this.state.score} / ${this.props.questions.length} вопросов`}
              </div>
            )}
            <div className='d-flex'>
              <button
                disabled={this.state.submitted}
                onClick={() => this.onSubmit()}
                className='btn btn-success mx-auto p-3 m-3 w-25'
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
let QuizWithRouter = withRouter(Quiz);
const mapStateToProps = ({ answerQuiz: { name, questions, showAnswers } }) => ({
  name,
  questions,
  showAnswers,
});

export default connect(mapStateToProps, { setQuiz, showAnswers })(
  QuizWithRouter
);

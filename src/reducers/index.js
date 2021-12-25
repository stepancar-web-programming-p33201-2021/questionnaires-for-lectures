import { combineReducers } from 'redux';
import quizReducer from './quizReducer';
import answerQuizReducer from './answerQuizReducer';
export default combineReducers({
  quizBuilder: quizReducer,
  answerQuiz: answerQuizReducer
});

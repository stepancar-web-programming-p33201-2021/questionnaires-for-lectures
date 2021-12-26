import { SET_QUIZ, UPDATE_ANSWER, SHOW_ANSWERS } from '../actions/types';

//Initial state for quiz
const initialState = {
  name: '',
  questions: [],
  showAnswers: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
    case SHOW_ANSWERS:
      let withAnswers = state.questions.map(q => ({
        ...q,
        showCorrectAnswer: true
      }));
      return {
        ...state,
        questions: withAnswers
      };
    case SET_QUIZ:
      return {
        ...action.payload
      };
    case UPDATE_ANSWER:
      //find correct question
      let q = state.questions.filter(
        q => q.id === action.payload.question_id
      )[0];
      q.userAnswer = action.payload.answer;
      let qs = [
        ...state.questions.filter(q => q.id !== action.payload.question_id),
        q
      ].sort((a, b) => a.index - b.index);
      return {
        ...state,
        questions: qs
      };
  }
};

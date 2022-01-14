import {
    SUBMIT_QUIZ,
    ADD_QUESTION,
    UPDATE_QUESTION,
    DELETE_QUESTION,
    SET_QUIZZES,
  } from "../actions/types";
  var shuffle = require("knuth-shuffle").knuthShuffle;

  const initialState = { name: "", questions: [] };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      default:
        return state;
      case SET_QUIZZES:
        let someQuizzes = shuffle(action.payload);
        if (someQuizzes.length > 6) {
          someQuizzes.length = 5;
        }
        return {
          ...state,
          someQuizzes,
        };
      case SUBMIT_QUIZ:
        return {
          ...state,
        };
      case ADD_QUESTION:
        let isInArray = state.questions.filter((q) => q.id === action.payload.id);
  
        if (isInArray.length === 0) {
          let qs = [
            ...state.questions.filter((q) => q.id !== action.payload.id),
            action.payload,
          ].sort((a, b) => a.created > b.created);
          return {
            ...state,
            questions: qs,
          };
        } else {
          return state;
        }
      case UPDATE_QUESTION:
        let qs = [
          ...state.questions.filter((q) => q.id !== action.payload.id),
          action.payload,
        ].sort((a, b) => a.created - b.created);
        return {
          ...state,
          questions: qs,
        };
      case DELETE_QUESTION:
        let Qs = [...state.questions.filter((q) => q.id !== action.payload)].sort(
          (a, b) => a.created - b.created
        );
        return {
          ...state,
          questions: Qs,
        };
    }
  };
  
import {
  SUBMIT_QUIZ,
  ADD_QUESTION,
  UPDATE_QUESTION,
  DELETE_QUESTION,
  SET_QUIZZES,
} from "./types";
const { uuid } = require('uuidv4');

export const submitQuiz = (props) => async (dispatch) => {
  const quiz = {
    ...props,
  };
  const res = await fetch("http://localhost:3005/quiz", {
    method: "POST",
    body: JSON.stringify(quiz),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (data !== undefined) {
    dispatch({ type: SUBMIT_QUIZ, payload: data });
  }

  return data._id;
};

export const getAllQuizzes = () => async (dispatch) => {
  const res = await fetch("http://localhost:3005/allquizzes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (data !== undefined) {
    dispatch({ type: SET_QUIZZES, payload: data });
  }
  return data;
};

export const addQuestion = () => {
  return {
    type: ADD_QUESTION,
    payload: {
      id: uuid(),
      question: undefined,
      img_src: undefined,
      correct_answer: undefined,
      other_answers1: undefined,
      other_answers2: undefined,
      other_answers3: undefined,
      requiredFieldsEmpty: true,
      error: undefined,
      created: new Date(),
    },
  };
};

export const updateQuestion = (question) => {
  return {
    type: UPDATE_QUESTION,
    payload: question,
  };
};

export const deleteQuestion = (id) => {
  return {
    type: DELETE_QUESTION,
    payload: id,
  };
};
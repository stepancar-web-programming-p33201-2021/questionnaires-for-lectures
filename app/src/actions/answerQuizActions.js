import { SET_QUIZ, UPDATE_ANSWER, SHOW_ANSWERS, SEND_ANSWERS } from "./types";

export const setQuiz = (id) => async (dispatch) => {
  let res = await fetch(`http://localhost:3005/quiz/${id}`);
  const data = await res.json();
  dispatch({
    type: SET_QUIZ,
    payload: data,
  });
};

export const updateAnswer = (answer, question_id) => {
  return {
    type: UPDATE_ANSWER,
    payload: { question_id, answer },
  };
};

export const showAnswers = () => {
  return {
    type: SHOW_ANSWERS,
  };
};
export const sendAnswers = () => {
  return {
    type: SEND_ANSWERS,
  };
};

import { Button, Card } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import BuildCard from './BuildCard';

function QuizBuilder({ changeState }) {
  const [visible, setVisible] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [time, setTime] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: null,
      question: '',
      options: '',
      answers: '',
    },
  ]);

  const addQuestion = (e) => {
    //добавить новый вопрос
    setQuestions((prevState) => [...prevState, {
        id: null,
        question: '',
        options: '',
        answers: '',
      }]);
  };

  const removeQuestion = (e) => {
    //создаем копию массива вопросов и методом pop удаляем последний элемент из массива
    var questionsCopy = questions;
    questionsCopy.pop()
    setQuestions(questionsCopy);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validated = true;
    //check the user has atleast a title, and atleast 1 question (заменю на валидацию библиотекой)
    if (
      e.target.title.value === '' ||
      e.target.title.value === null ||
      e.target.title.value === '' ||
      questions.length < 1
    ) {
      validated = false;
    }
    //проверка каждого вопроса на наличие вопросов и ответов и хотя бы 1 ответ
    for (let i = 0; i < questions.length; i++) {
      if (
        questions[i].question === null ||
        questions[i].answers === null ||
        questions[i].question.length < 1 ||
        questions[i].answers.length < 1
      ) {
        validated = false;
      }
    }
    if (validated === false) {
      alert(
        "There needs to be a title and atleast 1 question with atleast 1 correct answer, nor can there be any questions that don't meet these requirements."
      );
    } else {
      //константа с новым квизом и его полями
      const newQuiz = {
        title: e.target.title.value,
        description: e.target.description.value,
        imageURL: e.target.imageURL.value,
        /* author : userID.userID, */
        time: e.target.time.value,
      };
      //post quiz data (title, description, author, imageURL, time)

      fetch('УРЛА ПРОЕКТА', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newQuiz }),
      })
        //get back the id of the quiz now stored in the db
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          //run through all questions stored in the array
          for (let i = 0; i < questions.length; i++) {
            //подготовка json к отправке
            let newQuestion = {
              question: questions[i].question,
              imageURL: '',
              quizID: data[0]['LAST_INSERT_ID()'],
            };
            fetch('УРЛА ПРОЕКТА', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ newQuestion }),
            })
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                //создание массива правильных ответов, и разделение
                let answerArray = [];
                let corArray = questions[i].answers.split(',');
                for (let j = 0; j < corArray.length; j++) {
                  var newAnswer = {
                    answer: corArray[j],
                    correct: 1,
                    questionID: data[0]['LAST_INSERT_ID()'],
                  };
                  //push correct answer object into one large array of both correct and incorrect answers
                  answerArray.push(newAnswer);
                }
                //неккоректные ответы в массив ответов
                let incorArray = questions[i].options.split(',');
                for (let j = 0; j < incorArray.length; j++) {
                  var newAnswer = {
                    answer: incorArray[j],
                    correct: 0,
                    questionID: data[0]['LAST_INSERT_ID()'],
                  };
                  answerArray.push(newAnswer);
                }

                //рандомизировать ответы в массиве

                let newAnswers = answerArray.sort(() => Math.random() - 0.5);
                fetch('УРЛА ПРОЕКТА', {
                  method: 'POST',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ newAnswers }),
                });
              });
          }
        });

      return changeState('Browse');
    }
  };

  const handleChange = (e) => {
    if (['question', 'options', 'answers'].includes(e.target.className)) {
      let questions = [...questions];
      questions[e.target.dataset.id][e.target.className] = e.target.value;
      setQuestions(() => console.log(questions));
    } else {
      setTitle({ [e.target.name]: e.target.value });
      console.log(title);
    }
  };

  return (
    <Box component='form' onChange={handleChange}>
      <div className='quizBuildDiv'>
        <div className='buildTitle'>
          <label htmlFor='title'>Title</label>
          <input type='text' name='title' id='title' value={title} />
        </div>
        <div className='buildDescription'>
          <label htmlFor='description' className='buildDescription'>
            Description{' '}
          </label>
          <input
            type='text'
            name='description'
            id='description'
            value={description}
          />
        </div>
        <div className='conjoiner'>
          <div className='buildImg'>
            <label htmlFor='imageURL'>Image URL </label>
            <input
              type='text'
              name='imageURL'
              id='imageURL'
              value={imageURL}
            />
          </div>
          <div className='buildTime'>
            <label htmlFor='time'>Time </label>
            <input type='time' id='time' name='time' values={time} />
          </div>
        </div>
      </div>
      <Button className='addQuestion' onClick={addQuestion}>
        Add question
      </Button>
      <Button className='removeQuestion' onClick={removeQuestion}>
        Remove last question
      </Button>
      <BuildCard questions={questions} />
      <input type='submit' value='Submit' className='buildSubmit' />
    </Box>
  );
}

export default QuizBuilder;

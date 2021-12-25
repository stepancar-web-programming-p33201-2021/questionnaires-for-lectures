import React from 'react';
import { Typography, Box } from '@mui/material';

const QuestionPreview = (data) => {
  const {
    question = 'Пропущен вопрос',
    correct_answer = 'Пропущен правильный ответ',
    other_answers1 = 'Пропущен ответ',
    other_answers2 = 'Пропущен ответ',
    other_answers3 = 'Пропущен ответ',
    index,
    img_src = undefined,
  } = data;

  const textClass = (dataAttr) => {
    if (data[dataAttr] === undefined || data[dataAttr] === '') {
      return 'text-danger';
    } else {
      return 'text-success';
    }
  };

  return (
    <Box sx={{maxWidth: '97%'}}>
      <Typography style={{ fontSize: '2rem' }}>
      Вопрос № {index + 1}  
      </Typography>
      <h3 className={textClass('question')}>
        {question === '' ? 'Пропущен вопрос' : question}
      </h3>
      <div className='d-flex w-100'>
        {img_src ? (
          <div className='w-50 mb-3 mr-3'>
            {' '}
            <img className='img-fluid' src={img_src} alt='изображение' style={{maxWidth: '100%'}} />{' '}
          </div>
        ) : null}
        <ul className={'list-group' + (img_src ? ' w-50' : ' w-100')}>
          <li
            className={
              textClass('correct_answer') +
              ' ' +
              'list-group-item list-group-item-action'
            }
          >
            {correct_answer === '' ? 'Пропущен правильный ответ' : correct_answer}
          </li>
          <li
            className={
              textClass('other_answers1') +
              ' ' +
              'list-group-item list-group-item-action'
            }
          >
            {other_answers1 === '' ? 'Пропущен ответ 1' : other_answers1}
          </li>
          <li
            className={
              textClass('other_answers2') +
              ' ' +
              'list-group-item list-group-item-action'
            }
          >
            {other_answers2 === '' ? 'Пропущен ответ 2' : other_answers2}
          </li>
          <li
            className={
              textClass('other_answers3') +
              ' ' +
              'list-group-item list-group-item-action'
            }
          >
            {other_answers3 === '' ? 'Пропущен ответ 3' : other_answers3}
          </li>
        </ul>
      </div>
    </Box>
  );
};

export default QuestionPreview;

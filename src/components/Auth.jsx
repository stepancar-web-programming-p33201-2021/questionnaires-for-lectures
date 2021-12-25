import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { AuthInput } from './AuthInput';
import { SIGN_UP_TITLE } from '../utils/constants';

function Auth({ onSubmit, title, onChange, textButton }) {
  return (
    <Container
      maxWidth='sm'
      sx={{
        paddingTop: 25,
        paddingBottom: 25,
      }}
    >
      <Container
        sx={{
          background: 'white',
          paddingTop: 2,
          paddingBottom: 4,
          borderRadius: '6px',
          boxShadow:
            ' 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)',
          width: '80%',
        }}
      >
        <Box component='form' onSubmit={onSubmit}>
          <Typography
            component='h2'
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              margin: '20px',
              fontSize: '22px',
              fontFamily: 'Raleway',
              letterSpacing: 3,
            }}
          >
            {' '}
            {title}{' '}
          </Typography>
          <AuthInput
            name='email'
            label='Почта'
            type='email'
            onChange={onChange}
          />
          <AuthInput
            name='password'
            label='Пароль'
            type='password'
            onChange={onChange}
          />
          <Button
            variant='contained'
            sx={{
              width: '100%',
              padding: '10px',
              marginTop: '30px',
              letterSpacing: 1,
              fontWeight: 'bold',
            }}
            type='submit'
          >
            {textButton}
          </Button>
          {title === SIGN_UP_TITLE ? (
            <Typography
              component='p'
              sx={{ marginTop: '20px', textAlign: 'center' }}
            >
              Вы уже зарегистрировались?{' '}
              <Link className='link' to='/sign-in'>
                Войти
              </Link>
            </Typography>
          ) : (
            <Typography
              component='p'
              sx={{ marginTop: '20px', textAlign: 'center' }}
            >
              <Link className='link' to='/sign-up'>
                Зарегистрироваться{' '}
              </Link>
            </Typography>
          )}
        </Box>
      </Container>
    </Container>
  );
}

export default Auth;

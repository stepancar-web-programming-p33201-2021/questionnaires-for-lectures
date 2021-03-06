import './App.css';
import SignUp from './pages/SignUp';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import store from './store';
import Header from './components/Header';
import Quiz from './components/Quiz';
import QuizForm from './components/QuizForm';
import QuizList from './components/QuizList';
import { useEffect, useState } from 'react';
import Qr from './components/Qr';
import { getUser } from './utils/authAPi';

const theme = createTheme({
  typography: {
    fontFamily: 'Raleway, Arial',
  },
});

function App() {
  let navigate = useNavigate();
  const [nameUser, setNameUser] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  function tokenCheck() {
    const token = localStorage.getItem('jwt');
    if (token) {
      getUser(token)
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          setNameUser(res.name);
        }
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem('token');
      });
    }
  }

  useEffect(() => {
    tokenCheck();
  }, [navigate]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <div className='App'>
          <Header setLoggedIn={setLoggedIn} loggedIn={loggedIn} />
          <Routes>
            <Route
              exact
              path='/'
              element={
                loggedIn ? (
                  <QuizList navigate={navigate} />
                ) : (
                  <SignUp setLoggedIn={setLoggedIn} navigate={navigate} />
                )
              }
            />
            <Route path='/quiz/:id' element={<Quiz nameUser={nameUser}/>} />
            <Route path='/qr/:id' element={<Qr />} />
            <Route
              path='/sign-up'
              element={<SignUp setNameUser={setNameUser} setLoggedIn={setLoggedIn} navigate={navigate} />}
            />
            <Route
              path='/sign-in'
              element={<SignIn setLoggedIn={setLoggedIn} navigate={navigate} />}
            />
            <Route
              path='/quiz-form'
              element={<QuizForm navigate={navigate} />}
            />
          </Routes>
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;

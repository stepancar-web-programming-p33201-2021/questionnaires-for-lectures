import './App.css';
import SignUp from './pages/SignUp';
import { Routes, Route, Link } from "react-router-dom";
import SignIn from './pages/SignIn';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MainPage from './pages/MainPage';
import Header from './components/Header'

const theme = createTheme({
  typography: {
    fontFamily: 'Raleway, Arial',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
    <div className='App'>
      <Header />
      <Routes>
      <Route exact path='/' element={<MainPage />} />
      <Route path='/sign-up' element={<SignUp />} />
      <Route path='/sign-in' element={<SignIn />} />
      </Routes>
    </div>
    </ThemeProvider>
  );
}

export default App;

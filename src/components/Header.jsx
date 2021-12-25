import { Toolbar, AppBar, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const HeaderBar = styled(Toolbar)({
  backgroundColor: 'white',
  justifyContent: 'flex-end',
});
const HeaderButton = styled(Button)({
  marginRight: '20px',
  fontSize: '13px',
});

function Header({ loggedIn, setLoggedIn }) {
  const navigate = useNavigate();
  

  function handleLogOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    navigate('/sign-in');
  }
  return (
    <>
      {loggedIn ? (
        <AppBar position='static' sx={{ mb: '20px' }}>
          <HeaderBar>
            <HeaderButton variant='contained' onClick={() => navigate('/')}>
              На главную
            </HeaderButton>
            <HeaderButton
              variant='contained'
              onClick={() => navigate('/quiz-form')}
            >
              Новый квиз
            </HeaderButton>
            <HeaderButton onClick={handleLogOut} variant='contained'>Выйти</HeaderButton>
          </HeaderBar>
        </AppBar>
      ) : (
        null
      )}
    </>
  );
}

export default Header;

import { Toolbar, Typography, AppBar, Button, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import quizLogo from '../icons/quiz_logo.svg';

const HeaderBar = styled(Toolbar)({
  backgroundColor: 'white',
  justifyContent: 'flex-end',
});
const HeaderButton = styled(Button)({
  marginRight: '20px',
  fontSize: '13px',
});

function Header() {
  return (
    <>
      <AppBar position='static' sx={{ mb: '20px' }}>
        <HeaderBar>
          <HeaderButton variant='contained'>Новый квиз</HeaderButton>
          <HeaderButton variant='contained'>Выйти</HeaderButton>
          <Avatar alt='avatar' src='' sx={{ cursor: 'pointer' }} />
        </HeaderBar>
      </AppBar>
    </>
  );
}

export default Header;

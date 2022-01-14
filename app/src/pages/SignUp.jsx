import Auth from '../components/Auth';
import { SIGN_UP_TITLE } from '../utils/constants';
import useFormWithValidation from '../hooks/useFormWithValidation';
import { createProfile, login } from '../utils/authAPi';

function SignUp({ navigate, setLoggedIn, setNameUser }) {
  const { values, handleChange, resetForm } = useFormWithValidation({});

  function handleOnSubmit(evt) {
    evt.preventDefault();
    createProfile(values.name, values.email, values.password)
      .then((res) => {
        if (res) {
          login(values.email, values.password)
            .then((res) => {
              if (res.token) {
                setLoggedIn(true);
                localStorage.setItem('jwt', res.token);
                navigate(`/`);
              }
            })
            .catch((err) => {
              alert('Неверный логин или пароль');
              console.log(err);
            })
            .finally(() => {
              resetForm();
            });
            setNameUser(values.name)
          navigate('/');
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        resetForm();
      });
  }

  return (
    <Auth
      onSubmit={handleOnSubmit}
      onChange={handleChange}
      textButton={'Зарегистрироваться'}
      title={SIGN_UP_TITLE}
    />
  );
}

export default SignUp;

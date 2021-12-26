import Auth from '../components/Auth';
import { SIGN_UP_TITLE } from '../utils/constants';
import useFormWithValidation from '../hooks/useFormWithValidation';
import { createProfile } from '../utils/authAPi';

function SignUp({ navigate, setLoggedIn }) {
  const { values, handleChange, resetForm } = useFormWithValidation({});

  function handleOnSubmit(evt) {
    evt.preventDefault();
    createProfile(values.email, values.password)
      .then((res) => {
        if (res) {
          setLoggedIn(true);
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

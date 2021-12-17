import Validator from 'validator';
import isEmpty from './isEmpty';

function validateLoginForm(data) {
  let errors = {};

  data.email = !isEmpty(data.login) ? data.login : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (Validator.isEmpty(data.login)) {
    errors.email = 'Login is required';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export default validateLoginForm
const Validator = require('validator')
const isEmpty = require('./isEmpty')

exports.validateLoginForm = (data) => {
  const errors = {}

  data.email = !isEmpty.isEmpty(data.login) ? data.login : ''
  data.password = !isEmpty.isEmpty(data.password) ? data.password : ''

  if (Validator.isEmpty(data.login)) {
    errors.email = 'Login is required'
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password is required'
  }

  return {
    errors,
    isValid: isEmpty.isEmpty(errors)
  }
}

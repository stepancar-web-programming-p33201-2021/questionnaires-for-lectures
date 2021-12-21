const Validator = require('validator')
const isEmpty = require('./isEmpty')

exports.validateRegisterForm = (data) => {
  const errors = {}

  data.login = !isEmpty.isEmpty(data.login) ? data.login : ''
  data.email = !isEmpty.isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty.isEmpty(data.password) ? data.password : ''

  if (Validator.isEmpty(data.login)) {
    errors.login = 'login field is required'
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'email field is required'
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'email is invalid'
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'password field is required'
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'password must be at least 6 characters long and not longer than 30 characters'
  }

  return {
    errors,
    isValid: isEmpty.isEmpty(errors)
  }
}

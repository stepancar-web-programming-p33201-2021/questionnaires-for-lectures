const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
  },
  password: {
    type: String,
    minlength: 3,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильная почта или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильная почта или пароль'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('users', userSchema);
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AuthError = require('../errors/AuthError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const DuplicateError = require('../errors/DuplicateError');

dotenv.config();

const { NODE_ENV, JWT_SECRET } = process.env;

exports.getMyUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Пользователя с таким id не существует');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Id неверный'));
      } else {
        next(err);
      }
    });
};

exports.create = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AuthError('Пароль или почта некорректны');
  }
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      email,
      password: hash,
    })
      .then((user) => res.status(200).send({
        _id: user._id,
        email: user.email,
      }))
      .catch((err) => {
        if (err.name === 'MongoError' || err.code === 11000) {
          next(new DuplicateError('Пользователь с таким email уже существует'));
        } else if (err.name === 'ValidationError' || err.name === 'CastError') {
          next(new ValidationError('Пароль или почта некорректны'));
        } else {
          next(err);
        }
      });
  });
};


exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`,
        {
          expiresIn: '7d',
        },
      );
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthError(err.message);
    })
    .catch(next);
};

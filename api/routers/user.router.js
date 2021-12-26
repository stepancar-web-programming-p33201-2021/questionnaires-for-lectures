module.exports = app => {
    const users = require('../controllers/user.controller');
  
    const router = require('express').Router()
  
    router.post('/signup', users.create);

    router.post('/signin', users.login);

    app.use('', router)
  }
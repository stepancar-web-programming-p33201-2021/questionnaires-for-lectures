module.exports = app => {
    const quizzes = require('../controllers/quiz.controller');
  
    const router = require('express').Router()
  
    router.post('/quiz', quizzes.create);
      
    router.get('/quiz/:id', quizzes.findById);
      
    router.get('/allquizzes', quizzes.findAll);

    app.use('', router)
  }
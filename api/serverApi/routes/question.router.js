passport = require('passport')

module.exports = app => {
  const questions = require('../controllers/question.controller.js')

  const router = require('express').Router()

  router.get('/questions/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    questions.findById)

  router.post('/questions',
    passport.authenticate('jwt', {
      session: false
    }),
    questions.create)

  router.put('/questions/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    questions.updateById)

  router.delete('/questions/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    questions.deleteById)

  app.use('/api', router)
}

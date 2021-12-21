passport = require('passport')

module.exports = app => {
  const quizzes = require('../controllers/quiz.controller.js')

  const router = require('express').Router()

  router.get('/quizzes/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    quizzes.findById)

  router.get('/quizzes/code/:code', quizzes.findByCode)

  router.post('/quizzes',
    passport.authenticate(['jwt', 'anonymous'], {
      session: false
    }),
    quizzes.create)

  router.put('/quizzes/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    quizzes.updateById)

  router.put('/quizzes/:id/activate',
    passport.authenticate('jwt', {
      session: false
    }),
    quizzes.activateById)

  router.put('/quizzes/:id/deactivate',
    passport.authenticate('jwt', {
      session: false
    }),
    quizzes.deactivateById)

  router.delete('/quizzes/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    quizzes.deleteById)

  app.use('/api', router)
}

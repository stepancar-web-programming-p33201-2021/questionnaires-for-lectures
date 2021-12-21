passport = require('passport')

module.exports = app => {
  const answers = require('../controllers/answer.controller.js')

  const router = require('express').Router()

  router.get('/answers/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    answers.findById)

  router.post('/answers',
    passport.authenticate('jwt', {
      session: false
    }),
    answers.create)

  router.put('/answers/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    answers.updateById)

  router.delete('/answers/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    answers.deleteById)

  app.use('/api', router)
}

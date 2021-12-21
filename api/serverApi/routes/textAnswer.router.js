passport = require('passport')

module.exports = app => {
  const textAnswers = require('../controllers/textAnswer.controller.js')

  const router = require('express').Router()

  router.get('/textAnswers/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    textAnswers.findById)

  router.post('/textAnswers',
    passport.authenticate('jwt', {
      session: false
    }),
    textAnswers.create)

  router.put('/textAnswers/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    textAnswers.updateById)

  router.delete('/textAnswers/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    textAnswers.deleteById)

  app.use('/api', router)
}

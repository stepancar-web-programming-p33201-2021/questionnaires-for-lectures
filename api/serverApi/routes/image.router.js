passport = require('passport')

module.exports = app => {
  const images = require('../controllers/image.controller.js')

  const router = require('express').Router()

  router.get('/images/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    images.findById)

  router.post('/images',
    passport.authenticate('jwt', {
      session: false
    }),
    images.create)

  router.put('/images/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    images.updateById)

  router.delete('/images/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    images.deleteById)

  app.use('/api', router)
}

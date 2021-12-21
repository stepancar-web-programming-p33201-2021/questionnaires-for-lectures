passport = require('passport')

module.exports = app => {
  const users = require('../controllers/user.controller.js')

  const router = require('express').Router()

  /**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: The description of an error
 *       example:
 *         message: "Not Found"
 */

  router.get('/users',
    passport.authenticate('jwt', {
      session: false
    }),
    users.findAuthenticated)

  router.post('/users', users.create)

  router.post('/users/login', users.login)

  router.delete('/users',
    passport.authenticate('jwt', {
      session: false
    }),
    users.delete)

  app.use('/api', router)
}

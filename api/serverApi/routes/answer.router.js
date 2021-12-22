passport = require('passport')

module.exports = app => {
  const answers = require('../controllers/answer.controller.js')

  const router = require('express').Router()

  /**
 * @swagger
 * components:
 *   schemas:
 *     Answer:
 *       type: object
 *       required:
 *         - text
 *         - indexInsideTheQuestion
 *         - questionId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the answer
 *         text:
 *           type: string
 *           description: The text of the answer
 *         questionId:
 *           type: integer
 *           description: The id of the question that the answer refers to
 *         indexInsideTheQuestion:
 *           type: integer
 *           description: The answer's position inside the question. Indices are starting with 0
 *         isRight:
 *           type: boolean
 *           description: True if the question is right and false otherwise
 *           default: false
 *         numberOfVoters:
 *           type: integer
 *           description: number of people who voted for this answer
 *           default: 0
 *       example:
 *         id: 1
 *         text: JavaScript
 *         indexInsideTheQuestion: 0
 *         isRight: true
 *         numberOfVoters: 0
 */

  /**
  * @swagger
  * tags:
  *   name: Answers
  *   description: The answer managing API
  */

  /**
 * @swagger
 * /answers/{id}:
 *   get:
 *     summary: Get the answer by id
 *     tags: [Answers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The answer id
 *     security:
 *       - jwt: []
 *     responses:
 *      200:
 *         description: The Answer was successfully found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Answer'
 *
 *       403:
 *         description: This answer is placed in the quiz that doesn't belong to the authorized user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *
 *       404:
 *         description: The answer was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *
 */

  router.get('/answers/:id',
    passport.authenticate('jwt', {
      session: false
    }),
    answers.findById)

  /**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new answer
 *     tags: [Answers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Answer'
 *     responses:
 *       200:
 *         description: The Answer was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Answer'
 *
 *       403:
 *         description: This answer has to be placed in the quiz that doesn't belong to the authorized user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *
 *       404:
 *         description: The question for sent questionId was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 */
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

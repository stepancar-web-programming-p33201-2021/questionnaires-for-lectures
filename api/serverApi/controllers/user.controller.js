const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

const registrator = require('../validation/register')
const loginator = require('../validation/login')

const db = require('../models')
const codeGenerator = require('../codeGenerator')
const User = db.users
const Quiz = db.quizzes
const Question = db.questions
const Answer = db.answers
const TextAnswer = db.textAnswers
const Type = db.types
const Image = db.images
const Op = db.Sequelize.Op
const N = 6

exports.create = (req, res) => {
  const { errors, isValid } = registrator.validateRegisterForm(req.body)

  if (!isValid) {
    return res.status(400).json(errors)
  }

  User.findAll({ where: { login: req.body.login } }).then(foundedUser => {
    if (foundedUser.length) {
      return res.status(400).json({ login: 'Login already exists!' })
    } else {
      User.findAll({ where: { email: req.body.email } }).then(foundedUser => {
        if (foundedUser.length) {
          return res.status(400).json({ email: 'Email already exists!' })
        } else {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if (err) throw err

              const user = {
                login: req.body.login,
                email: req.body.email,
                hashPassword: hash
              }

              if (req.body.quizzes) {
                user.quizzes = req.body.quizzes
              }

              const quizzes = []

              const promises = []

              const length = user.quizzes ? user.quizzes.length : 0

              for (let i = 0; i < length; i++) {
                promises.push(codeGenerator(N))
              }

              Promise.all(promises)
                .then(codes => {
                  if (user.quizzes) {
                    let index = 0

                    user.quizzes.forEach(e => {
                      const quiz = {
                        name: e.name,
                        userLogin: e.userLogin ? e.userLogin : null,
                        isActive: e.isActive ? e.isActive : false,
                        code: codes[index]
                      }

                      index++

                      if (e.images) {
                        quiz.images = e.images
                      }

                      if (e.questions) {
                        quiz.questions = e.questions
                      }

                      const questions = []

                      if (quiz.questions) {
                        quiz.questions.forEach(e1 => {
                          const type = e1.type.toLowerCase()

                          if (type != 'answer' && type != 'textanswer') {
                            res.status(404).send({
                              message: 'Cannot find Type.'
                            })
                            return
                          }

                          const question = {
                            text: e1.text,
                            indexInsideTheQuiz: e1.indexInsideTheQuiz,
                            typeId: type == 'answer' ? 1 : 2,
                            totalVoters: e1.totalVoters ? e1.totalVoters : 0,
                            quizId: e1.quizId
                          }

                          if (e1.answers && type == 'answer') {
                            question.answers = e1.answers
                          } else if (e1.answers) {
                            res.status(400).send({
                              message: 'Answers are not allowed in this Type'
                            })
                            return
                          }

                          if (e1.textAnswers && type == 'textanswer') {
                            question.textAnswers = e1.textAnswers
                          } else if (e1.textAnswers) {
                            res.status(400).send({
                              message: 'TextAnswers are not allowed in this Type'
                            })
                            return
                          }

                          const answers = []

                          if (question.answers) {
                            for (let i = 0; i < question.answers.length; i++) {
                              const e2 = question.answers[i]

                              answers.push({
                                text: e2.text,
                                indexInsideTheQuestion: i,
                                numberOfVoters: e2.numberOfVoters ? e2.numberOfVoters : 0,
                                isRight: e2.isRight ? e2.isRight : false,
                                questionId: e2.questionId
                              })
                            }

                            question.answers = answers
                          }

                          const textAnswers = []

                          if (question.textAnswers) {
                            question.textAnswers.forEach(e2 => textAnswers.push({
                              userText: e2.userText,
                              numberOfVoters: e2.numberOfVoters ? e2.numberOfVoters : 0,
                              questionId: e2.questionId
                            }))

                            question.textAnswers = textAnswers
                          }

                          questions.push(question)
                        })

                        quiz.questions = questions
                      }

                      let images

                      if (quiz.images) {
                        quiz.images.forEach(e1 => images.push({
                          quizId: e1.quizId,
                          url: e1.url,
                          indexInsideTheQuiz: e1.indexInsideTheQuiz
                        }))
                      }

                      quizzes.push(quiz)
                    })

                    user.quizzes = quizzes
                  }

                  User.create(user, {
                    include: [
                      {
                        model: Quiz,
                        required: false,
                        attributes: {
                          exclude: ['createdAt', 'updatedAt']
                        },
                        include: [
                          {
                            model: Question,
                            required: false,
                            attributes: {
                              exclude: ['createdAt', 'updatedAt']
                            },
                            include: [
                              {
                                model: Type,
                                required: false,
                                attributes: {
                                  exclude: ['createdAt', 'updatedAt']
                                }
                              },
                              {
                                model: Answer,
                                required: false,
                                attributes: {
                                  exclude: ['createdAt', 'updatedAt']
                                }
                              },
                              {
                                model: TextAnswer,
                                required: false,
                                attributes: {
                                  exclude: ['createdAt', 'updatedAt']
                                }
                              }
                            ]
                          },
                          {
                            model: Image,
                            required: false,
                            attributes: {
                              exclude: ['createdAt', 'updatedAt']
                            }
                          }
                        ]
                      }
                    ]
                  })
                    .then(data => {
                      res.send(data)
                    })
                    .catch(err => {
                      res.status(500).send({
                        message:
                        err.message || 'Some error occurred while creating the User.'
                      })
                    })
                })
            })
          })
        }
      })
    }
  })
}

exports.login = (req, res) => {
  const { errors, isValid } = loginator.validateLoginForm(req.body)

  if (!isValid) {
    return res.status(400).json(errors)
  }

  User.findAll({
    where: {
      login: req.body.login
    }
  })
    .then(user => {
      if (!user.length) {
        errors.login = 'User not found!'
        return res.status(404).json(errors)
      }

      const originalPassword = user[0].dataValues.hashPassword

      bcrypt
        .compare(req.body.password, originalPassword)
        .then(isMatch => {
          if (isMatch) {
            console.log('matched!')
            const { login } = user[0].dataValues
            const payload = { login }

            jwt.sign(payload, 'secret', {
              expiresIn: 3600
            }, (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              })
            })
          } else {
            errors.password = 'Password not correct'
            return res.status(400).json(errors)
          }
        }).catch(err => { console.log(err) })
    }).catch(err => { return res.status(500).json({ err }) })
}

exports.findAuthenticated = async (req, res) => {
  const login = req.user.login

  User.findOne({
    where: { login: login },
    attributes: {
      exclude: ['hashPassword']
    },
    include: [
      {
        model: Quiz,
        required: false,
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [
          {
            model: Question,
            required: false,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
            include: [
              {
                model: Type,
                required: false,
                attributes: {
                  exclude: ['createdAt', 'updatedAt']
                }
              },
              {
                model: Answer,
                required: false,
                attributes: {
                  exclude: ['createdAt', 'updatedAt']
                }
              },
              {
                model: TextAnswer,
                required: false,
                attributes: {
                  exclude: ['createdAt', 'updatedAt']
                }
              }
            ]
          },
          {
            model: Image,
            required: false,
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }
        ]
      }
    ]
  })
    .then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: 'Cannot find User'
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving User'
      })
    })
}

exports.delete = (req, res) => {
  const login = req.user.login

  User.destroy({
    where: { login: login }
  })
    .then(num => {
      if (num) {
        res.send({
          message: 'User was deleted successfully!'
        })
      } else {
        res.send({
          message: 'Cannot delete User'
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Could not delete User'
      })
    })
}

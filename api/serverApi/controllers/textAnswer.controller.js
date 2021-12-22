const db = require('../models')
const TextAnswer = db.textAnswers
const Question = db.questions
const User = db.users
const Quiz = db.quizzes
const Op = db.Sequelize.Op

exports.create = (req, res) => {
  if (!req.body.userText) {
    res.status(400).send({
      message: 'userText is required'
    })
    return
  }

  if (!req.body.questionId) {
    res.status(400).send({
      message: 'questionId is required'
    })
    return
  }

  const textAnswer = {
    userText: req.body.userText,
    numberOfVoters: req.body.numberOfVoters ? req.body.numberOfVoters : 0,
    questionId: req.body.questionId
  }

  Question.findOne({ where: { id: req.body.questionId } }).then(question => {
    if (!question) {
      res.status(404).send({
        message: 'Not Found Question for this QuestionId'
      })
      return
    }

    Quiz.findOne({ where: { id: question.quizId } }).then(quiz => {
      if (quiz.userLogin != req.user.login) {
        res.status(403).send({
          message: 'Forbidden'
        })
        return
      }

      if (question.typeId != 2) {
        res.status(400).send({
          message: 'Cannot add textAnswer to the question of this type'
        })
        return
      }

      TextAnswer.create(textAnswer)
        .then(data => {
          res.send(data)
        })
        .catch(err => {
          res.status(500).send({
            message:
          err.message || 'Some error occurred while creating the TextAnswer.'
          })
        })
    })
  })
}

exports.findById = (req, res) => {
  const id = req.params.id

  TextAnswer.findOne({
    where: { id: id },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include: [{
      model: Question,
      required: false,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
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
              model: User,
              required: false,
              attributes: {
                exclude: ['hashPassword', 'createdAt', 'updatedAt']
              }
            }
          ]
        }
      ]
    }]
  })
    .then(data => {
      if (data) {
        if (data.question.quiz.userLogin != req.user.login) {
          res.status(403).send({
            message: 'Forbidden'
          })
          return
        }

        res.send(data)
      } else {
        res.status(404).send({
          message: 'Not found'
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving TextAnswer with id=' + id
      })
    })
}

exports.findByUserText = (req, res) => {
  if (!req.body.userText) {
    res.status(400).send({
      message: 'userText is required'
    })
    return
  }

  if (!req.body.questionId) {
    res.status(400).send({
      message: 'QuestionId is required'
    })
    return
  }

  const userText = req.body.userText

  TextAnswer.findOne({
    where: { userText: userText, questionId: req.body.questionId },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    },
    include: [{
      model: Question,
      required: false,
      attributes: {
        exclude: ['createdAt', 'updatedAt']
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
              model: User,
              required: false,
              attributes: {
                exclude: ['createdAt', 'updatedAt', 'hashPassword']
              }
            }
          ]
        }
      ]
    }]
  })
    .then(data => {
      if (data) {
        if (data.question.quiz.userLogin != req.user.login) {
          res.status(403).send({
            message: 'Forbidden'
          })
          return
        }

        res.send(data)
      } else {
        res.status(404).send({
          message: 'Not found'
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving TextAnswer with id=' + id
      })
    })
}

exports.updateById = (req, res) => {
  const id = req.params.id

  TextAnswer.findByPk(id).then(textAnswer => {
    if (!textAnswer) {
      res.status(404).send({
        message: 'Not Found'
      })
      return
    }

    Question.findByPk(textAnswer.questionId).then(question => {
      Quiz.findByPk(question.quizId).then(quiz => {
        if (quiz.userLogin != req.user.login) {
          res.status(403).send({
            message: 'Forbidden'
          })
          return
        }

        if (req.body.questionId && textAnswer.questionId != req.body.questionId) {
          res.status(400).send({
            message: 'It is resticted to update questionId'
          })
          return
        }

        if (req.body.id && textAnswer.id != req.body.id) {
          res.status(400).send({
            message: 'It is resticted to update id'
          })
          return
        }

        if (req.body.userText && textAnswer.userText != req.body.userText) {
          res.status(400).send({
            message: 'It is resticted to update userText'
          })
          return
        }

        textAnswer.update({
          numberOfVoters: req.body.numberOfVoters ? req.body.numberOfVoters : textAnswer.numberOfVoters
        })
          .then(num => {
            if (num) {
              res.send({
                message: 'TextAnswer was updated successfully.'
              })
            } else {
              res.send({
                message: `Cannot update TextAnswer with id=${id}.`
              })
            }
          })
          .catch(err => {
            res.status(500).send({
              message: 'Error updating TextAnswer with id=' + id
            })
          })
      })
    })
  })
}

exports.deleteById = (req, res) => {
  const id = req.params.id

  TextAnswer.findByPk(id).then(textAnswer => {
    if (!textAnswer) {
      res.status(404).send({
        message: 'Not Found'
      })
      return
    }

    Question.findByPk(textAnswer.questionId).then(question => {
      Quiz.findByPk(question.quizId).then(quiz => {
        if (quiz.userLogin != req.user.login) {
          res.status(403).send({
            message: 'Forbidden'
          })
          return
        }

        TextAnswer.destroy({
          where: { id: id }
        })
          .then(num => {
            if (num) {
              res.send({
                message: 'TextAnswer was deleted successfully!'
              })
            } else {
              res.send({
                message: `Cannot delete TextAnswer with id=${id}. Maybe TextAnswer was not found!`
              })
            }
          })
          .catch(err => {
            res.status(500).send({
              message: 'Could not delete TextAnswer with id=' + id
            })
          })
      })
    })
  })
}

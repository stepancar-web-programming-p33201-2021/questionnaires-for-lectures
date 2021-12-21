const db = require('../models')
const Answer = db.answers
const Quiz = db.quizzes
const User = db.users
const Question = db.questions
const Op = db.Sequelize.Op

exports.create = (req, res) => {
  if (!req.body.text) {
    res.status(400).send({
      message: 'text is required'
    })
    return
  }

  if (!req.body.indexInsideTheQuestion) {
    res.status(400).send({
      message: 'indexInsideTheQuestion is required'
    })
    return
  }

  if (!req.body.text) {
    res.status(400).send({
      message: 'questionId is required'
    })
    return
  }

  const answer = {
    text: req.body.text,
    indexInsideTheQuestion: req.body.indexInsideTheQuestion,
    numberOfVoters: req.body.numberOfVoters ? req.body.numberOfVoters : 0,
    isRight: req.body.isRight ? req.body.isRight : false,
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

      if (question.typeId != 1) {
        res.status(400).send({
          message: 'Cannot add answer to the question of this type'
        })
        return
      }

      Answer.create(answer)
        .then(data => {
          res.send(data)
        })
        .catch(err => {
          res.status(500).send({
            message:
          err.message || 'Some error occurred while creating the Answer.'
          })
        })
    })
  })
}

exports.findById = (req, res) => {
  const id = req.params.id

  Answer.findOne({
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
        message: 'Error retrieving Answer with id=' + id
      })
    })
}

exports.updateById = (req, res) => {
  const id = req.params.id

  Answer.findByPk(id).then(answer => {
    if (!answer) {
      res.status(404).send({
        message: 'Not Found'
      })
      return
    }

    Question.findByPk(answer.questionId).then(question => {
      Quiz.findByPk(question.quizId).then(quiz => {
        if (quiz.userLogin != req.user.login) {
          res.status(403).send({
            message: 'Forbidden'
          })
          return
        }

        if (req.body.questionId && answer.questionId != req.body.questionId) {
          res.status(400).send({
            message: 'It is resticted to update questionId'
          })
          return
        }

        if (req.body.id && answer.id != req.body.id) {
          res.status(400).send({
            message: 'It is resticted to update id'
          })
          return
        }

        answer.update({
          isRight: req.body.isRight ? req.body.isRight : answer.isRight,
          text: req.body.text ? req.body.text : answer.text,
          numberOfVoters: req.body.numberOfVoters ? req.body.numberOfVoters : answer.numberOfVoters,
          indexInsideTheQuestion: req.body.indexInsideTheQuestion ? req.body.indexInsideTheQuestion : answer.indexInsideTheQuestion
        })
          .then(num => {
            if (num) {
              res.send({
                message: 'Answer was updated successfully.'
              })
            } else {
              res.send({
                message: `Cannot update Answer with id=${id}.`
              })
            }
          })
          .catch(err => {
            res.status(500).send({
              message: 'Error updating Answer with id=' + id
            })
          })
      })
    })
  })
}

exports.deleteById = (req, res) => {
  const id = req.params.id

  Answer.findByPk(id).then(answer => {
    if (!answer) {
      res.status(404).send({
        message: 'Not Found'
      })
      return
    }

    Question.findByPk(answer.questionId).then(question => {
      Quiz.findByPk(question.quizId).then(quiz => {
        if (quiz.userLogin != req.user.login) {
          res.status(403).send({
            message: 'Forbidden'
          })
          return
        }

        Answer.destroy({
          where: { id: id }
        })
          .then(num => {
            if (num) {
              res.send({
                message: 'Answer was deleted successfully!'
              })
            } else {
              res.send({
                message: `Cannot delete Answer with id=${id}. Maybe Answer was not found!`
              })
            }
          })
          .catch(err => {
            res.status(500).send({
              message: 'Could not delete Answer with id=' + id
            })
          })
      })
    })
  })
}

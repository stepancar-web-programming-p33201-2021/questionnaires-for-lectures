const db = require("../models");
const TextAnswer = db.textAnswers;
const Question = db.questions;
const User = db.users;
const Quiz = db.quizzes;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  console.log("Posting TextAnswer");
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  let textAnswer = {
    userText: req.body.quizId,
    numberOfVoters: req.body.numberOfVoters ? req.body.numberOfVoters : 0,
    questionId: req.body.questionId
  };

  Question.findOne({where: {id : req.body.questionId}}).then(question => {
    if (!question) {
      res.status(404).send({
        message: "Not Found Question for this QuestionId"
      });
    }

    Quiz.findOne({where: {id : question.quizId}}).then(quiz => {
      if (quiz.userLogin != req.user.login) {
        res.status(403).send({
          message: `Forbidden`
        });
      }

  TextAnswer.create(textAnswer)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the TextAnswer."
      });
    });
  });
});
}

exports.findById = (req, res) => {
  const id = req.params.id;

  TextAnswer.findOne({
    where: {id : id}, 
    include: [{
      model: Question, 
      required: false,
      include: [
        {
          model: Quiz,
          required: false,
          include: [
            {
              model: User,
              required: false 
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
            message: `Forbidden`
          });
        }

        res.send(data);
      } else {
        res.status(404).send({
          message: "Not found"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving TextAnswer with id=" + id
      });
    });  
}

exports.updateById = (req, res) => {
  const id = req.params.id;

  TextAnswer.findByPk(id).then(textAnswer => {

    if (!textAnswer) {
      res.status(404).send({
        message: `Not Found`
      });
    }
  
    Question.findByPk(textAnswer.questionId).then(question => {
      Quiz.findByPk(question.quizId).then(quiz => {
    if (quiz.userLogin != req.user.login) {
      res.status(403).send({
        message: `Forbidden`
      });
    }


  if (req.body.questionId && textAnswer.questionId != req.body.questionId) {
    res.status(400).send({
      message: `It is resticted to update questionId`
    });
  }

  if (req.body.id && textAnswer.id != req.body.id) {
    res.status(400).send({
      message: `It is resticted to update id`
    });
  }
  
  answer.update({
    userText: req.body.userText ? req.body.userText : textAnswer.text,
    numberOfVoters: req.body.numberOfVoters ? req.body.numberOfVoters : answer.numberOfVoters,
    indexInsideTheQuestion: req.body.indexInsideTheQuestion ? req.body.indexInsideTheQuestion : answer.indexInsideTheQuestion
  })
    .then(num => {
      if (num) {
        res.send({
          message: "TextAnswer was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update TextAnswer with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating TextAnswer with id=" + id
      });
    });
  });
});
  });
}

exports.deleteById = (req, res) => {
  const id = req.params.id;

  TextAnswer.findByPk(id).then(textAnswer => {

    if (!textAnswer) {
      res.status(404).send({
        message: `Not Found`
      });
    }
  
    Question.findByPk(textAnswer.questionId).then(question => {
      Quiz.findByPk(question.quizId).then(quiz => {
      
    if (quiz.userLogin != req.user.login) {
      res.status(403).send({
        message: `Forbidden`
      });
    }

  TextAnswer.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "TextAnswer was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete TextAnswer with id=${id}. Maybe TextAnswer was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete TextAnswer with id=" + id
      });
    });
  });
});
  });
}
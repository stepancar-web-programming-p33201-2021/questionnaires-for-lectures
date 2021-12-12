const db = require("../models");  
/*
const questionController = require("../controllers/question.controller.js");
const imageController = require("../controllers/image.controller.js");
*/
const Quiz = db.quizzes;
const Question = db.questions;
const Image = db.images;
const Type = db.types;
const TextAnswer = db.textAnswers;
const Answer = db.answers;
const User = db.users;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  let quiz = {
    name: req.body.name,
    userLogin: req.body.userLogin ? req.body.userLogin : null,
    isActive: req.body.isActive ? req.body.isActive : false,
  };

  if (req.body.images) {
    quiz.images = req.body.images;
  } 

  if (req.body.questions) {
    quiz.questions = req.body.questions;
  } 

  var questions = [];

  if (quiz.questions) {
    quiz.questions.forEach(e => {
      //const typeFinder = Type.findOne({where: {name : e.type.toLowerCase()}});

      const type = e.type.toLowerCase();

      if (type != "answer" && type != "textanswer") {
        res.status(404).send({
          message: `Cannot find Type.`
        });
      }

      let question = {
        text: e.text,
        indexInsideTheQuiz: e.indexInsideTheQuiz,
        typeId: type == "answer" ? 1 : 2,
        totalVoters: e.totalVoters ? e.totalVoters : 0,
        quizId: e.quizId,
      }

      if (e.answers && type == "answer") {
        question.answers = e.answers;
      } else if (e.answers) {
        res.status(400).send({
          message: `Answers are not allowed in this Type`
        });
      }
    
      if (e.textAnswers && type == "textanswer") {
        question.textAnswers = e.textAnswers;
      } else if (e.textAnswers) {
        res.status(400).send({
          message: `TextAnswers are not allowed in this Type`
        });
      }

      var answers = [];

      if (question.answers) {
        /*
        question.answers.forEach(e2 => answers.push({
          text: e2.text,
          indexInsideTheQuestion: e2.indexInsideTheQuestion,
          numberOfVoters: e2.numberOfVoters ? e2.numberOfVoters : 0,
          isRight: e2.isRight ? e2.isRight : false,
          questionId: e2.questionId
        }));
        */

        for (var i = 0; i < question.answers.length; i++) {
          var e2 = question.answers[i];
    
          answers.push({
            text: e2.text,
            indexInsideTheQuestion: i,
            numberOfVoters: e2.numberOfVoters ? e2.numberOfVoters : 0,
            isRight: e2.isRight ? e2.isRight : false,
            questionId: e2.questionId
          })
        }

        question.answers = answers;
      }

      var textAnswers = [];

      if (question.textAnswers) {
        question.textAnswers.forEach(e2 => textAnswers.push({
          userText: e2.userText,
          numberOfVoters: e2.numberOfVoters ? e2.numberOfVoters : 0,
          questionId: e2.questionId
        }));

        question.textAnswers = textAnswers;
      }

      questions.push(question);
    });

    quiz.questions = questions;
  }

  var images;

  if (quiz.images) {
    quiz.images.forEach(e => images.push({
      quizId: e.quizId,
      url: e.url,
      indexInsideTheQuiz: e.indexInsideTheQuiz
    }));

    quiz.images = images;
  }


  Quiz.create(quiz, {
    include: [
      {
        model: Question, 
        required: false,
        include: [
          {
            model: Type, 
            required: false
          },
          {
            model: Answer, 
            required: false
          },
          {
            model: TextAnswer, 
            required: false
          }
        ]
      }, 
      {
        model: Image, 
        required: false
      }
    ]
  })
    .then(data => {
      res.send(data);
      //quizId = data.id;
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Quiz."
      });
    });
}


exports.findById = (req, res) => {
  const id = req.params.id;

  Quiz.findOne({
    where: {id : id}, 
    include: [
      {
        model: Question, 
        required: false,
        include: [
          {
            model: Type, 
            required: false
          },
          {
            model: Answer, 
            required: false
          },
          {
            model: TextAnswer, 
            required: false
          }
        ]
      }, 
      {
        model: Image, 
        required: false
      },
      {
        model: User, 
        required: false,
        attributes: {
          exclude: ['hashPassword']
        }
      }
    ]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Quiz with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Quiz with id=" + id
      });
    });  
}

exports.findAll = (req, res) => {
  Quiz.findAll({ include: Question })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving quizzes."
      });
  });
}

exports.updateById = (req, res) => {
  const id = req.params.id;

  Quiz.findByPk(id).then(quiz => {

  if (req.body.userLogin && quiz.userLogin != req.body.userLogin) {
    res.status(400).send({
      message: `It is resticted to update userLogin`
    });
  }

  Quiz.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Quiz was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Quiz with id=${id}. Maybe Quiz was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Quiz with id=" + id
      });
    });
  })
}

exports.activateById = (req, res) => {
  const id = req.params.id;
  let quiz = Quiz.findById(id);
  quiz.isActive = true;

  Quiz.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Quiz was activated successfully."
        });
      } else {
        res.send({
          message: `Cannot activate Quiz with id=${id}. Maybe Quiz was not found`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Quiz with id=" + id
      });
    });
}

exports.deactivateById = (req, res) => {
  const id = req.params.id;
  let quiz = Quiz.findById(id);
  quiz.isActive = false;

  Quiz.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Quiz was activated successfully."
        });
      } else {
        res.send({
          message: `Cannot activate Quiz with id=${id}. Maybe Quiz was not found`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Quiz with id=" + id
      });
    });
}

exports.deleteById = (req, res) => {
  const id = req.params.id;

  Quiz.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Quiz was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Quiz with id=${id}. Maybe Quiz was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Quiz with id=" + id
      });
    });
}
const db = require("../models");
const User = db.users;
const Question = db.questions;
const Answer = db.answers;
const TextAnswer = db.textAnswers;
const Type = db.types;
const Quiz = db.quizzes;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  console.log("Posting question");
  console.log(req.body);
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const type = req.body.type.toLowerCase();

  Type.findOne({where: {name : type}}).then(typeFinder => {

  if (!typeFinder) {
    res.status(404).send({
      message: `Cannot find Type.`
    });
  }

  let question = {
    text: req.body.text,
    indexInsideTheQuiz: req.body.indexInsideTheQuiz,
    typeId: typeFinder.id,
    totalVoters: req.body.totalVoters ? req.body.totalVoters : 0,
    quizId: req.body.quizId,
  };

  Quiz.findOne({where: {id : req.body.quizId}}).then(quiz => {

  if (!quiz) {
    res.status(404).send({
      message: "Not Found Quiz for this QuizId"
    });
  }

  if (quiz.userLogin != req.user.login) {
    res.status(403).send({
      message: `Forbidden`
    });
  }

  if (req.body.answers && type == "answer") {
    question.answers = req.body.answers;
  } else if (req.body.answers) {
    res.status(400).send({
      message: `Answers are not allowed in this Type`
    });
  }

  if (req.body.textAnswers && type == "textanswer") {
    question.textAnswers = req.body.textAnswers;
  } else if (req.body.textAnswers) {
    res.status(400).send({
      message: `TextAnswers are not allowed in this Type`
    });
  }

  var answers = [];

  if (question.answers) {
    for (var i = 0; i < question.answers.length; i++) {
      var e = question.answers[i];

      answers.push({
        text: e.text,
        indexInsideTheQuestion: i,
        numberOfVoters: e.numberOfVoters ? e.numberOfVoters : 0,
        isRight: e.isRight ? e.isRight : false,
        questionId: e.questionId
      })
    }

    question.answers = answers;
  }

  var textAnswers = [];

  if (question.textAnswers) {
    question.textAnswers.forEach(e => textAnswers.push({
      userText: e.userText,
      numberOfVoters: e.numberOfVoters ? e.numberOfVoters : 0,
      questionId: e.questionId
    }));

    question.textAnswers = textAnswers;
  }

  Question.create(question, {include: [
    {
      model: Answer,
      required: false
    }, 
    { 
      model: TextAnswer,
      required: false
    }
  ]})
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Question."
      });
    });
});
});
}

exports.findById = (req, res) => {
  const id = req.params.id;

  Question.findOne({
    where: {id : id}, 
    include: [
      {
        model: Type, 
        required: false,
      }, 
      {
        model: Answer, 
        required: false,
      }, 
      {
        model: TextAnswer, 
        required: false
      },
      {
        model: Quiz, 
        required: false,
        include: [
          {
            model: User,
            required: false,
            attributes: {
              exclude: ['hashPassword']
            }
          }
        ]
      }
    ]
  })
    .then(data => {
      if (data) {
        if (data.quiz.userLogin != req.user.login) {
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
        message: "Error retrieving Question with id=" + id
      });
    });  
}

exports.updateById = (req, res) => {
  const id = req.params.id;
  
  Question.findByPk(id).then(question => {

  if (!question) {
    res.status(404).send({
      message: `Not Found`
    });
  }

  Quiz.findByPk(question.quizId).then(quiz => {

  if (quiz.userLogin != req.user.login) {
    res.status(403).send({
      message: `Forbidden`
    });
  }

  if (req.body.type && !(question.typeId == 1 && req.body.type == "answer" || question.typeId == 2 && req.body.type == "textanswer")) {
    res.status(400).send({
      message: `It is resticted to update type`
    });
  }

  if (req.body.quizId && question.quizId != req.body.quizId) {
    res.status(400).send({
      message: `It is resticted to update quizId`
    });
  }

  if (req.body.id && question.quizId != req.body.id) {
    res.status(400).send({
      message: `It is resticted to update id`
    });
  }

  if (req.body.answers) {
    res.status(400).send({
      message: `It is resticted to update answers`
    });
  }

  if (req.body.textAnswers) {
    res.status(400).send({
      message: `It is resticted to update textAnswers`
    });
  }

  question.update({
    text: req.body.text ? req.body.text : question.text,
    type: req.body.type ? req.body.type : question.type,
    indexInsideTheQuiz: req.body.indexInsideTheQuiz ? req.body.indexInsideTheQuiz : question.indexInsideTheQuiz,
    totalVoters: req.body.totalVoters ? req.body.totalVoters : question.totalVoters
  })
    .then(num => {
      if (num) {
        res.send({
          message: "Question was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Question with id=${id}. Maybe Question was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Question with id=" + id
      });
    });
    });
    })
}

exports.deleteById = (req, res) => {
  const id = req.params.id;

  Question.findByPk(id).then(question => {

  if (!question) {
    res.status(404).send({
      message: `Not Found`
    });
  }

  Quiz.findOne({
    where: { id: question.quizId }
  }).then(quiz => {
    
  if (quiz.userLogin != req.user.login) {
    res.status(403).send({
      message: `Forbidden`
    });
  }

  Question.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num) {
        res.send({
          message: "Question was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Question with id=${id}. Maybe Question was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Question with id=" + id
      });
    });
  });
});
}
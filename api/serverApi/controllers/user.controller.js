const db = require("../models");
//const quizController = require("../controllers/quiz.controller.js");
const User = db.users;
const Quiz = db.quizzes;
const Question = db.questions;
const Answer = db.answers;
const TextAnswer = db.textAnswers;
const Type = db.types;
const Image = db.images;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const user = {
    login: req.body.login,
    email: req.body.email,
    hashPassword: hash(req.body.password),
    quizzes: req.body.quizzes
  };

  var quizzes = [];

  if (user.quizzes) {
    user.quizzes.forEach(e => {
      let quiz = {
        name: e.name,
        userLogin: e.userLogin ? e.userLogin : null,
        isActive: e.isActive ? e.isActive : false,
        images: e.images,
        questions: e.images
      };
    
      var questions = [];
    
      if (quiz.questions) {
        quiz.questions.forEach(async e1 => {
          const typeFinder = await Type.findOne({where: {name : req.body.type.toLowerCase()}});
    
          if (!typeFinder) {
            res.status(404).send({
              message: `Cannot find Type.`
            });
          }
    
          let question = {
            text: e1.text,
            indexInsideTheQuiz: e1.indexInsideTheQuiz,
            typeId: typeFinder.id,
            totalVoters: e1.totalVoters ? e1.totalVoters : 0,
            quizId: e1.quizId,
            answers: e1.answers,
            textAnswers: e1.textAnswers
          }
    
          var answers = [];
    
          if (question.answers) {
            question.answers.forEach(e2 => answers.push({
              text: e2.text,
              indexInsideTheQuestion: e2.indexInsideTheQuestion,
              numberOfVoters: e2.numberOfVoters ? e2.numberOfVoters : 0,
              isRight: e2.isRight ? e2.isRight : false,
              questionId: e2.questionId
            }));
          }
    
          question[answers] = answers;
    
          var textAnswers = [];
    
          if (question.textAnswers) {
            question.textAnswers.forEach(e2 => textAnswers.push({
              userText: e2.quizId,
              numberOfVoters: e2.numberOfVoters ? e2.numberOfVoters : 0,
              questionId: e2.questionId
            }));
          }
    
          question[textAnswers] = textAnswers;
    
          questions.push(question);
        });
      }
    
      var images;
    
      if (quiz.images) {
        quiz.images.forEach(e1 => images.push({
          quizId: e1.quizId,
          url: e1.url,
          indexInsideTheQuiz: e1.indexInsideTheQuiz
        }));
      }

      quizzes.push(quiz);
    });
  }

  //let userId;

  User.create(user, {
    include: [
      {
      model: Quiz,
      required: false,
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
  }
  ]
  })
    .then(data => {
      res.send(data);
      //userId = data.id;
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });

  /*
  if (req.body.quizzes) {
    req.body.quizzes.forEach(element => {
      element["userId"] = userId;
      const reqElement = {body : element};
      quizController.create(reqElement, res);
    });  
  }
  */
}


exports.findByLogin = async (req, res) => {
  const login = req.params.login;

  User.findOne({
    where: {login : login}, 
    include: [
      {
      model: Quiz,
      required: false,
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
  }
    ]
  })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User"
      });
    });
}

//todo
exports.updateById = (req, res) => {
  const login = req.params.login;

  User.update(req.body, {
    where: { login: login }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User"
      });
    });
}

//todo
exports.deleteById = (req, res) => {
  const login = req.params.login;

  User.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User"
      });
    });
}

function hash(s) {
  return s;
  //todo
}
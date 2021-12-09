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
    hashPassword: hash(req.body.password)
  };

  //let userId;

  User.create(user)
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


exports.findByLogin = (req, res) => {
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
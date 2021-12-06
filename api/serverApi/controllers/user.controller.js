const db = require("../models");
const quizController = require("../controllers/quiz.controller.js");
const User = db.users;
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

  User.create(user)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });

  if (req.body.quizzes) {
    req.body.quizzes.forEach(element => {
      quizController.create(element);
    });  
  }
}


exports.findById = (req, res) => {
  const id = req.params.id;

  User.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id
      });
    });
}

function hash(s) {
  return s;
  //todo
}
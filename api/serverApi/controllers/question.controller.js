const db = require("../models");
const Question = db.questions;
const answerController = require("../controllers/answer.controller.js");
const textAnswerController = require("../controllers/textAnswer.controller.js");
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  console.log("Posting question");
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  let question = {
    text: req.body.text,
    indexInsideTheQuiz: req.body.indexInsideTheQuiz,
    totalVoters: req.body.totalVoters
  };

  Question.create(question)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Question."
      });
    });

  if (req.body.type.toLowerCase().equals("answer")) {
    if (req.body.textAnswers) {
      res.status(400).send({
        message: "type is answer, why are there textAnswers?"
      });
    } else if (req.body.answers)
      req.body.questions.forEach(element => {
        answerController.create(element);
    });  
  } 

  if (req.body.type.toLowerCase().equals("textanswer")) {
    if (req.body.answers) {
      res.status(400).send({
        message: "type is textAnswer, why are there answers?"
      });
    } else if (req.body.textAnswers)
      req.body.questions.forEach(element => {
        textAnswerController.create(element);
    });  
  } 
  
}

exports.findById = (req, res) => {
  const id = req.params.id;

  Quiz.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Question with id=${id}.`
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

  Question.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
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
}

exports.deleteById = (req, res) => {
  const id = req.params.id;

  Question.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
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
}
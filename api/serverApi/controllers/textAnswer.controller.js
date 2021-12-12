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
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find TextAnswer with id=${id}.`
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

  if (req.body.questionId) {
    res.status(400).send({
      message: `It is resticted to update questionId`
    });
  }

  TextAnswer.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "TextAnswer was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update TextAnswer with id=${id}. Maybe TextAnswer was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating TextAnswer with id=" + id
      });
    });
}

exports.deleteById = (req, res) => {
  const id = req.params.id;

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
}
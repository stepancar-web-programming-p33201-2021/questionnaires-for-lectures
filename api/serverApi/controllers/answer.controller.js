const db = require("../models");
const Answer = db.answers;
const Quiz = db.quizzes;
const User = db.users;
const Question = db.questions;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  console.log("Posting Answer");
  
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  let answer = {
    text: req.body.text,
    indexInsideTheQuestion: req.body.indexInsideTheQuestion,
    numberOfVoters: req.body.numberOfVoters ? req.body.numberOfVoters : 0,
    isRight: req.body.isRight ? req.body.isRight : false,
    questionId: req.body.questionId
  };

  Answer.create(answer)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Answer."
      });
    });
}

exports.findById = (req, res) => {
  const id = req.params.id;

  Answer.findOne({
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
          message: `Cannot find Answer with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Answer with id=" + id
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

  Answer.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Answer was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Answer with id=${id}. Maybe Answer was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Answer with id=" + id
      });
    });
}

exports.deleteById = (req, res) => {
  const id = req.params.id;

  Answer.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Answer was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Answer with id=${id}. Maybe Answer was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Answer with id=" + id
      });
    });
}
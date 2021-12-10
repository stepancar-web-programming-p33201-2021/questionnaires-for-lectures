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
  console.log("Posting quiz");
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  let quiz = {
    name: req.body.name
  };

  if (req.body.userLogin) {
    quiz.userLogin = req.body.userLogin;
  }

  if (req.body.isActive) {
    quiz.isActive = req.body.isActive;
  }

  //let quizId = 0;

  Quiz.create(quiz)
    .then(data => {
      res.send(data);
      console.log(data.id + " is a new id YASITIS");
      //quizId = data.id;
    })
    .catch(err => {
      console.log("ERRORRRORERROR");
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Quiz."
      });
    });
  
  /*
  if (req.body.images) {
    req.body.images.forEach(element => {
      element["quizId"] = quizId;
      console.log(element);
      const reqElement = {body : element};
      imageController.create(reqElement, res);
    });  
  }

  if (req.body.questions) {
    req.body.questions.forEach(element => {
      element["quizId"] = quizId;
      console.log(element);
      const reqElement = {body : element};
      questionController.create(reqElement, res);
    });  
  }
  */
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
        required: false
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
  Tutorial.findAll({ include: Question })
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
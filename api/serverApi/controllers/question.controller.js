const db = require("../models");
const User = db.users;
const Question = db.questions;
const Answer = db.answers;
const TextAnswer = db.textAnswers;
const Type = db.types;
const Quiz = db.quizzes;

/*
const answerController = require("../controllers/answer.controller.js");
const textAnswerController = require("../controllers/textAnswer.controller.js");
*/
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
  console.log("Posting question");
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const result = await Type.findOne({where: {name : req.body.type.toLowerCase()}});
  /*.then(data => {
    if (data) {
      //result = data;
    } else {
      res.status(404).send({
        message: `Cannot find Type.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Type"
    });
  }); */

  if (!result) {
    res.status(404).send({
      message: `Cannot find Type.`
    });
  }

  let question = {
    text: req.body.text,
    indexInsideTheQuiz: req.body.indexInsideTheQuiz,
    typeId: result.id,
    totalVoters: req.body.totalVoters ? req.body.totalVoters : 0,
    quizId: req.body.quizId,
    answers: req.body.answers
  };

  /*var answers;

  question.answers.forEach(e => answers.push({
    text: e.text,
    indexInsideTheQuestion: e.indexInsideTheQuestion,
    numberOfVoters: e.numberOfVoters ? e.numberOfVoters : 0,
    isRight: e.isRight ? e.isRight : false,
    questionId: e.questionId
  }));

  question[answers] = answers;
*/
  //let questionId;

  Question.create(/*{*/question/*}, {include: [Answer]}*/)
    .then(data => {
      res.send(data);
      //questionId = data.id;
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Question."
      });
    });

  /*
  if (req.body.type.toLowerCase() == "answer") {
    if (req.body.textAnswers) {
      res.status(400).send({
        message: "type is answer, why are there textAnswers?"
      });
    } else if (req.body.answers)
      req.body.questions.forEach(element => {
        element["questionId"] = questionId;
        const reqElement = {body : element};
        answerController.create(reqElement, res);
    });  
  } 

  if (req.body.type.toLowerCase() == "textanswer") {
    if (req.body.answers) {
      res.status(400).send({
        message: "type is textAnswer, why are there answers?"
      });
    } else if (req.body.textAnswers)
      req.body.questions.forEach(element => {
        element["questionId"] = questionId;
        const reqElement = {body : element};
        textAnswerController.create(reqElement, res);
    });  
  } 
  
  */
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
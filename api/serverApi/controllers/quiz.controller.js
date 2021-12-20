const db = require("../models");  
const codeGenerator = require("../codeGenerator");
const Quiz = db.quizzes;
const Question = db.questions;
const Image = db.images;
const Type = db.types;
const TextAnswer = db.textAnswers;
const Answer = db.answers;
const User = db.users;
const Op = db.Sequelize.Op;
const N = 6;

exports.create = (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "name is required"
    });
    return;
  }

  let code;
  codeGenerator(N).then(result => {
  code = result;
  
  let quiz = {
    name: req.body.name,
    userLogin: req.user.login ? req.user.login : null,
    isActive: req.body.isActive ? req.body.isActive : false,
    code: code
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

      const type = e.type.toLowerCase();

      if (type != "answer" && type != "textanswer") {
        res.status(404).send({
          message: `Cannot find Type.`
        });
        return;
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
        return;
      }
    
      if (e.textAnswers && type == "textanswer") {
        question.textAnswers = e.textAnswers;
      } else if (e.textAnswers) {
        res.status(400).send({
          message: `TextAnswers are not allowed in this Type`
        });
        return;
      }

      var answers = [];

      if (question.answers) {

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
      return;
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Quiz."
      });
      return;
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
        if (data.userLogin == req.user.login) {
          res.send(data);
          return;
        } else {
          res.status(403).send({
            message: `Forbidden.`
          });
          return;
        }
      } else {
        res.status(404).send({
          message: `Cannot find Quiz with id = ${id}.`
        });
        return;
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Quiz with id = " + id
      });
      return;
    });  
}

exports.findByCode = (req, res) => {
  const code = req.params.code;

  Quiz.findOne({
    where: {code : code}, 
    attributes: {
      exclude: ['id']
    },
    include: [
      {
        model: Question, 
        required: false,
        attributes: {
          exclude: ['id', 'quizId', 'typeId']
        },
        include: [
          {
            model: Type, 
            required: false,
            attributes: {
              exclude: ['id']
            }
          },
          {
            model: Answer, 
            required: false,
            attributes: {
              exclude: ['id', 'questionId']
            }
          },
          {
            model: TextAnswer, 
            required: false,
            attributes: {
              exclude: ['id', 'questionId']
            }
          }
        ]
      }, 
      {
        model: Image, 
        required: false,
        attributes: {
          exclude: ['id', 'quizId']
        }
      }
    ]
  })
    .then(data => {
      if (data) {
        if (data.isActive) {
          res.send(data);
          return;
        } else {
          res.status(403).send({
            message: `Quiz with code ${code} is not active.`
          });
          return;
        }
      } else {
        res.status(404).send({
          message: `Cannot find Quiz with code = ${code}.`
        });
        return;
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Quiz with code = " + code
      });
      return;
    });  
}

exports.updateById = (req, res) => {
  const id = req.params.id;

  Quiz.findOne({where: {id: id}}).then(quiz => {

  if (!quiz) {
    res.status(404).send({
      message: `Not Found`
    });
    return;
  }

  if (quiz.userLogin != req.user.login) {
    res.status(403).send({
      message: `Forbidden`
    });
    return;
  }

  if (req.body.userLogin && quiz.userLogin != req.body.userLogin) {
    res.status(400).send({
      message: `It is resticted to update userLogin`
    });
    return;
  }

  if (req.body.id && quiz.id != req.body.id) {
    res.status(400).send({
      message: `It is resticted to update id`
    });
    return;
  }

  if (req.body.code && quiz.code != req.body.code) {
    res.status(400).send({
      message: `It is resticted to update code`
    });
    return;
  }

  if (req.body.images) {
    res.status(400).send({
      message: `It is resticted to update images`
    });
    return;
  }

  if (req.body.questions) {
    res.status(400).send({
      message: `It is resticted to update questions`
    });
    return;
  }

  quiz.update({
    name: req.body.name ? req.body.name : quiz.name,
    isActive: req.body.isActive ? req.body.isActive : quiz.isActive
  })
    .then(num => {
      if (num) {
        res.send({
          message: "Quiz was updated successfully."
        });
        return;
      } else {
        res.send({
          message: `Cannot update Quiz with id = ${id}.`
        });
        return;
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Quiz with id=" + id
      });
      return;
    });
  })
}

exports.activateById = (req, res) => {
  const id = req.params.id;
  Quiz.findOne({where: {id : id}}).then(quiz => {
    if (!quiz) {
      res.status(404).send({
        message: `Not Found`
      });
      return;
    }

  if (quiz.userLogin != req.user.login) {
    res.status(403).send({
      message: `Forbidden`
    });
    return;
  }

  quiz.update({
    isActive: true
  })
    .then(num => {
      if (num) {
        res.send({
          message: "Quiz was activated successfully."
        });
        return;
      } else {
        res.send({
          message: `Cannot activate Quiz with id = ${id}. Maybe Quiz was not found`
        });
        return;
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Quiz with id=" + id
      });
      return;
    });
  });

}

exports.deactivateById = (req, res) => {
  const id = req.params.id;
  Quiz.findOne({where: {id : id}}).then(quiz => {
    if (!quiz) {
      res.status(404).send({
        message: `Not Found`
      });
      return;
    }
    
  if (quiz.userLogin != req.user.login) {
    res.status(403).send({
      message: `Forbidden`
    });
    return;
  }

  quiz.update({
    isActive: false
  })
    .then(num => {
      if (num) {
        res.send({
          message: "Quiz was deactivated successfully."
        });
        return;
      } else {
        res.send({
          message: `Cannot deactivate Quiz with id = ${id}. Maybe Quiz was not found`
        });
        return;
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Quiz with id=" + id
      });
      return;
    });
  });
}

exports.deleteById = (req, res) => {
  const id = req.params.id;

  Quiz.findOne({
    where: { id: id }
  }).then(quiz => {

  if (!quiz) {
    res.status(404).send({
      message: `Not Found`
    });
    return;
  }

  if (quiz.userLogin != req.user.login) {
    res.status(403).send({
      message: `Forbidden`
    });
    return;
  }

  Quiz.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num) {
        res.send({
          message: "Quiz was deleted successfully!"
        });
        return;
      } else {
        res.send({
          message: `Cannot delete Quiz with id=${id}. Maybe Quiz was not found!`
        });
        return;
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Quiz with id=" + id
      });
      return;
    });
  });
}
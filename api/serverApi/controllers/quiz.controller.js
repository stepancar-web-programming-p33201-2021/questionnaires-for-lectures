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
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
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
      //const typeFinder = Type.findOne({where: {name : e.type.toLowerCase()}});

      const type = e.type.toLowerCase();

      if (type != "answer" && type != "textanswer") {
        res.status(404).send({
          message: `Cannot find Type.`
        });
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
      }
    
      if (e.textAnswers && type == "textanswer") {
        question.textAnswers = e.textAnswers;
      } else if (e.textAnswers) {
        res.status(400).send({
          message: `TextAnswers are not allowed in this Type`
        });
      }

      var answers = [];

      if (question.answers) {
        /*
        question.answers.forEach(e2 => answers.push({
          text: e2.text,
          indexInsideTheQuestion: e2.indexInsideTheQuestion,
          numberOfVoters: e2.numberOfVoters ? e2.numberOfVoters : 0,
          isRight: e2.isRight ? e2.isRight : false,
          questionId: e2.questionId
        }));
        */

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
      //quizId = data.id;
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Quiz."
      });
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
        } else {
          res.status(403).send({
            message: `Forbidden.`
          });
        }
      } else {
        res.status(404).send({
          message: `Cannot find Quiz with id = ${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Quiz with id = " + id
      });
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
      }/*,
      {
        model: User, 
        required: false,
        attributes: {
          exclude: ['hashPassword']
        }
      }*/
    ]
  })
    .then(data => {
      if (data) {
        if (data.isActive) {
          res.send(data);
        } else {
          res.status(403).send({
            message: `Quiz with code ${code} is not active.`
          });
        }
      } else {
        res.status(404).send({
          message: `Cannot find Quiz with code = ${code}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Quiz with code = " + code
      });
    });  
}

exports.findAllOfUser = (req, res) => {
  Quiz.findAll({ where: {userLogin: req.user.login}, include: Question })
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

  Quiz.findOne({where: {id: id}}).then(quiz => {

  if (!quiz) {
    res.status(404).send({
      message: `Not Found`
    });
  }

  if (quiz.userLogin != req.user.login) {
    res.status(403).send({
      message: `Forbidden`
    });
  }

  if (req.body.userLogin && quiz.userLogin != req.body.userLogin) {
    res.status(400).send({
      message: `It is resticted to update userLogin`
    });
  }

  if (req.body.id && quiz.id != req.body.id) {
    res.status(400).send({
      message: `It is resticted to update id`
    });
  }

  if (req.body.code && quiz.code != req.body.code) {
    res.status(400).send({
      message: `It is resticted to update code`
    });
  }

  if (req.body.images) {
    res.status(400).send({
      message: `It is resticted to update images`
    });
  }

  if (req.body.questions) {
    res.status(400).send({
      message: `It is resticted to update questions`
    });
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
      } else {
        res.send({
          message: `Cannot update Quiz with id = ${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Quiz with id=" + id
      });
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
    }

  if (quiz.userLogin != req.user.login) {
    res.status(403).send({
      message: `Forbidden`
    });
  }

  quiz.update({
    isActive: true
  })
    .then(num => {
      if (num) {
        res.send({
          message: "Quiz was activated successfully."
        });
      } else {
        res.send({
          message: `Cannot activate Quiz with id = ${id}. Maybe Quiz was not found`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Quiz with id=" + id
      });
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
    }
    
  if (quiz.userLogin != req.user.login) {
    res.status(403).send({
      message: `Forbidden`
    });
  }

  quiz.update({
    isActive: false
  })
    .then(num => {
      if (num) {
        res.send({
          message: "Quiz was deactivated successfully."
        });
      } else {
        res.send({
          message: `Cannot deactivate Quiz with id = ${id}. Maybe Quiz was not found`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Quiz with id=" + id
      });
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
  }

  if (quiz.userLogin != req.user.login) {
    res.status(403).send({
      message: `Forbidden`
    });
  }

  Quiz.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num) {
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
  });
}
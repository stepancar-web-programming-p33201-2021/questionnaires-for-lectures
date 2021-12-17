import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const db = require("../models");
const codeGenerator = require("../codeGenerator");
const User = db.users;
const Quiz = db.quizzes;
const Question = db.questions;
const Answer = db.answers;
const TextAnswer = db.textAnswers;
const Type = db.types;
const Image = db.images;
const Op = db.Sequelize.Op;
const N = 6;

exports.create = (req, res) => {

  const { errors, isValid } = validateRegisterForm(req.body);

  if(!isValid) {
    return res.status(400).json(errors);
  }

  User.findAll({ where: { login: req.body.login } }).then(foundedUser => {
    if (foundedUser.length) {
      return res.status(400).json({ login: 'Login already exists!' });
    } else {
      User.findAll({ where: { email: req.body.email} }).then(foundedUser => {
        if (foundedUser.length) {
          return res.status(400).json({ email: 'Email already exists!' });
        } else {
    

  /*
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  */

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) throw err;

  const user = {
    login: req.body.login,
    email: req.body.email,
    hashPassword: hash
  };

  if (req.body.quizzes) {
    user.quizzes = req.body.quizzes;
  } 

  var quizzes = [];

  var promises = [];

  var length = user.quizzes ? user.quizzes.length : 0;

  for (var i = 0; i < length; i++) {
    promises.push(codeGenerator(N));
  }

  Promise.all(promises)
    .then(codes => {

    if (user.quizzes) {

    let index = 0;
    
    user.quizzes.forEach(e => {
      let quiz = {
        name: e.name,
        userLogin: e.userLogin ? e.userLogin : null,
        isActive: e.isActive ? e.isActive : false,
        code: codes[index]
      };

      index++;

      if (e.images) {
        quiz.images = e.images;
      } 
    
      if (e.questions) {
        quiz.questions = e.questions;
      } 
    
      var questions = [];
    
      if (quiz.questions) {
        quiz.questions.forEach(e1 => {
          //const typeFinder = Type.findOne({where: {name : e.type.toLowerCase()}});
    
          const type = e1.type.toLowerCase();

          if (type != "answer" && type != "textanswer") {
            res.status(404).send({
            message: `Cannot find Type.`
          });
        }

          /*
          if (!typeFinder) {
            res.status(404).send({
              message: `Cannot find Type.`
            });
          }
          */
    
          let question = {
            text: e1.text,
            indexInsideTheQuiz: e1.indexInsideTheQuiz,
            typeId: type == "answer" ? 1 : 2,
            totalVoters: e1.totalVoters ? e1.totalVoters : 0,
            quizId: e1.quizId
          }

          if (e1.answers && type == "answer") {
            question.answers = e1.answers;
          } else if (e1.answers) {
            res.status(400).send({
              message: `Answers are not allowed in this Type`
            });
          }
        
          if (e1.textAnswers && type == "textanswer") {
            question.textAnswers = e1.textAnswers;
          } else if (e1.textAnswers) {
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
        quiz.images.forEach(e1 => images.push({
          quizId: e1.quizId,
          url: e1.url,
          indexInsideTheQuiz: e1.indexInsideTheQuiz
        }));
      }

      quizzes.push(quiz);
    });

    user.quizzes = quizzes;
    
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
          err.message || "Some error occurred while creating the User."
      });
    });
});
})});
}});
}});
}

exports.login = (req, res) => {
  const { errors, isValid } = validateLoginForm(req.body);

  // check validation
  if(!isValid) {
    return res.status(400).json(errors);
  }

  const { login, password } = req.body;

  User.findAll({ 
    where: { 
      login: req.body.login 
    } 
  })
  .then(user => {

    //check for user
    if (!user.length) {
      errors.login = 'User not found!';
      return res.status(404).json(errors);
    }
     
    let originalPassword = user[0].dataValues.password

    //check for password
    bcrypt
      .compare(password, originalPassword)
      .then(isMatch => {
        if (isMatch) {
          // user matched
          console.log('matched!')
          const { id, username } = user[0].dataValues;
          const payload = { id, username }; //jwt payload
          // console.log(payload)

          jwt.sign(payload, 'secret', { 
            expiresIn: 3600 
          }, (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
              role: user[0].dataValues.role
            });
          });
        } else {
          errors.password = 'Password not correct';
          return res.status(400).json(errors);
        }
    }).catch(err => console.log(err));
  }).catch(err => res.status(500).json({err}));
};


exports.findByLogin = async (req, res) => {
  const login = req.params.login;

  User.findOne({
    where: {login : login}, 
    attributes: {
      exclude: ['hashPassword']
    },
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
/*
exports.updateByLogin = (req, res) => {
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
*/

//todo
exports.deleteByLogin = (req, res) => {
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

exports.findAll = (req, res) => {
  User.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
  });
}

function hash(s) {
  return s;
  //todo
}
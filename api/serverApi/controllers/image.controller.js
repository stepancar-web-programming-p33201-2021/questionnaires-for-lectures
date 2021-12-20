const db = require("../models");
const Image = db.images;
const Quiz = db.quizzes;
const User = db.users;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  console.log("Posting Image");
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  let image = {
    quizId: req.body.quizId,
    url: req.body.url,
    indexInsideTheQuiz: req.body.indexInsideTheQuiz
  };

  Quiz.findOne({where: {id : req.body.quizId}}).then(quiz => {

    if (!quiz) {
      res.status(404).send({
        message: "Not Found Quiz for this QuizId"
      });
    }

    if (quiz.userLogin != req.user.login) {
      res.status(403).send({
        message: `Forbidden`
      });
    }

  Image.create(image)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Image."
      });
    });
  });
}

exports.findById = (req, res) => {
  const id = req.params.id;

  
  Image.findOne({
    where: {id : id}, 
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
  })
    .then(data => {
      if (data) {
        if (data.quiz.userLogin != req.user.login) {
          res.status(403).send({
            message: `Forbidden`
          });
        }

        res.send(data);
      } else {
        res.status(404).send({
          message: "Not found"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Image with id=" + id
      });
    });  
}

exports.updateById = (req, res) => {
  const id = req.params.id;

  Image.findByPk(id).then(image => {

    if (!image) {
      res.status(404).send({
        message: `Not Found`
      });
    }
  
    Quiz.findByPk(image.quizId).then(quiz => {
  
    if (quiz.userLogin != req.user.login) {
      res.status(403).send({
        message: `Forbidden`
      });
    }

  if (req.body.quizId && image.quizId != req.body.quizId) {
    res.status(400).send({
      message: `It is resticted to update quizId`
    });
  }

  image.update({
    url: req.body.url ? req.body.url : image.url,
    indexInsideTheQuiz: req.body.indexInsideTheQuiz ? req.body.indexInsideTheQuiz : image.indexInsideTheQuiz
  })
    .then(num => {
      if (num) {
        res.send({
          message: "Image was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Image with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Image with id=" + id
      });
    });
  });
});
}

exports.deleteById = (req, res) => {
  const id = req.params.id;

  Image.findByPk(id).then(image => {

    if (!image) {
      res.status(404).send({
        message: `Not Found`
      });
    }
  
    Quiz.findOne({
      where: { id: image.quizId }
    }).then(quiz => {
      
    if (quiz.userLogin != req.user.login) {
      res.status(403).send({
        message: `Forbidden`
      });
    }

  Image.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num) {
        res.send({
          message: "Image was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Image with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Image with id=" + id
      });
    });
  });
});
}
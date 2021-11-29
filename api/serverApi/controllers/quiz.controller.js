const db = require("../models");
const Quiz = db.quizzes;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const quiz = {
    id: req.body.id,
    userId: req.body.userId,
    name: req.body.name,
    isActive: req.body.isActive,
  };

  Quiz.create(quiz)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Quiz."
      });
    });
}

exports.findById = (req, res) => {
  const id = req.params.id;

  Quiz.findByPk(id)
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
/*
export function activateById(req, res) {
  Quiz.activateById(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ошибка сервера"
      });
    else res.send(data);
  }); 
}

export function deactivateById(req, res) {
  Quiz.deactivateById(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ошибка сервера"
      });
    else res.send(data);
  });   
}
*/
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
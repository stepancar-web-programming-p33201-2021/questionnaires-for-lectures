const db = require("../models");
const Image = db.images;
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
}

exports.findById = (req, res) => {
  const id = req.params.id;

  Image.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Image with id=${id}.`
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

  Image.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Image was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Image with id=${id}. Maybe Image was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Image with id=" + id
      });
    });
}

exports.deleteById = (req, res) => {
  const id = req.params.id;

  Image.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Image was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Image with id=${id}. Maybe Image was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Image with id=" + id
      });
    });
}
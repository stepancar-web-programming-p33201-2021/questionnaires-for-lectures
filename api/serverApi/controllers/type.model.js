const db = require("../models");
const Type = db.types;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  console.log("Posting Type");
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  let type = {
    name: req.body.name
  };

  Type.create(type)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Type."
      });
    });
}

exports.findById = (req, res) => {
  const id = req.params.id;

  Type.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Type with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Type with id=" + id
      });
    });  
}

exports.updateById = (req, res) => {
  const id = req.params.id;

  Type.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Type was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Type with id=${id}. Maybe Type was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Type with id=" + id
      });
    });
}

exports.deleteById = (req, res) => {
  const id = req.params.id;

  Type.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Type was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Type with id=${id}. Maybe Type was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Type with id=" + id
      });
    });
}
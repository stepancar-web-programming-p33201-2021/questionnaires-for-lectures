const db = require('../models')
const Type = db.types
const Op = db.Sequelize.Op

exports.create = (req, res) => {
  console.log('Posting Type')
  if (!req.body) {
    console.log('No bodies for types')
  }

  const type = {
    name: req.body.name
  }

  console.log(type)

  Type.create(type)
    .catch(err => {
      console.log('Some error occurred while creating the Type.')
    })
}

exports.findById = (req, res) => {
  const id = req.params.id

  Type.findByPk(id, {
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })
    .then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `Cannot find Type with id=${id}.`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'Error retrieving Type with id=' + id
      })
    })
}

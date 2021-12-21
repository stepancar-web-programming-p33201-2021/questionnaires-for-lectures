/*
Question = require("./question.model");
User = require("./user.model");
Image = require("./image.model");
*/

module.exports = (sequelize, Sequelize) => {
  const Quiz = sequelize.define('quiz', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    code: {
      type: Sequelize.STRING,
      unique: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  }, {
    hooks: {
      afterCreate: (record) => {
        delete record.dataValues.createdAt
        delete record.dataValues.updatedAt
      },
      afterUpdate: (record) => {
        delete record.dataValues.createdAt
        delete record.dataValues.updatedAt
      }
    }
  })

  return Quiz
}

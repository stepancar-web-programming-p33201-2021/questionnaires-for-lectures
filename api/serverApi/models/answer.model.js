// Question = require("./question.model");

module.exports = (sequelize, Sequelize) => {
  const Answer = sequelize.define('answer', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    text: {
      type: Sequelize.STRING,
      allowNull: false
    },
    indexInsideTheQuestion: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    isRight: {
      type: Sequelize.BOOLEAN,
      default: false
    },
    numberOfVoters: {
      type: Sequelize.INTEGER,
      defaultValue: 0
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

  // Answer.belongsTo(Question);

  return Answer
}

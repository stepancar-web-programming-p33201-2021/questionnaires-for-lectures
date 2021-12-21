// Question = require("./question.model");

module.exports = (sequelize, Sequelize) => {
  const TextAnswer = sequelize.define('textAnswer', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    userText: {
      type: Sequelize.STRING,
      allowNull: false
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

  //  TextAnswer.belongsTo(Question);

  return TextAnswer
}

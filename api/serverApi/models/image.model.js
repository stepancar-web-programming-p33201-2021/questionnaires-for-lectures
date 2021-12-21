// Quiz = require("./quiz.model");

module.exports = (sequelize, Sequelize) => {
  const Image = sequelize.define('image', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    quizId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    url: {
      type: Sequelize.STRING,
      allowNull: false
    },
    indexInsideTheQuiz: {
      type: Sequelize.INTEGER,
      allowNull: false
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

  //  Image.belongsTo(Quiz);

  return Image
}

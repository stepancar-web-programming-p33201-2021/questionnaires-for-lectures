//Question = require("./question.model");

module.exports = (sequelize, Sequelize) => {
  const Answer = sequelize.define("answer", {
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
        type: Sequelize.BOOLEAN
      },
      numberOfVoters: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
  });

  //Answer.belongsTo(Question);

  return Answer;
};

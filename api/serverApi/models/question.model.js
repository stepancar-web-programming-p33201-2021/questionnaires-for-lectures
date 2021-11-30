/*
Question = require("./question.model");
Type = require("./type.model");
Answer = require("./answer.model");
TextAnswer = require("./textAnswer.model");
*/

module.exports = (sequelize, Sequelize) => {
  const Question = sequelize.define("question", {
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
      indexInsideTheQuiz: {
        type: Sequelize.INTEGER,
      },
      totalVoters: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
  });
  
  return Question;
}
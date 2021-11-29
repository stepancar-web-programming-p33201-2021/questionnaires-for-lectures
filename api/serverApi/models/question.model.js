Question = require("./question.model");
Type = require("./type.model");
Answer = require("./answer.model");
TextAnswer = require("./textAnswer.model");

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
          default: 0
      }
  });

  Question.belongsTo(Quiz);
  Question.belongsTo(Type);

  Question.hasMany(Answer, 
    {
        foreignKey: 'questionId',
        onDelete: 'CASCADE'
    }
  );

  Question.hasMany(TextAnswer, 
    {
        foreignKey: 'questionId',
        onDelete: 'CASCADE'
    }
  );
  
  return Question;
}
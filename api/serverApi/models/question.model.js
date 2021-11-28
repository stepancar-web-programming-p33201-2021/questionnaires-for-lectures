import Quiz from "quiz.model.js";
import Type from "quiz.model.js";
import Answer from "answer.model.js";
import TextAnswer from "textAnswer.model.js";

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

Quiz.hasMany(Answer, 
  {
    foreignKey: 'questionId',
    onDelete: 'CASCADE'
  }
);

Quiz.hasMany(TextAnswer, 
  {
    foreignKey: 'questionId',
    onDelete: 'CASCADE'
  }
);
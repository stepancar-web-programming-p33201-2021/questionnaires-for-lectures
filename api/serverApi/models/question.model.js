import Quiz from "quiz.model.js";
import Type from "quiz.model.js";

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
    typeId: {
       type: Sequelize.INTEGER,
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

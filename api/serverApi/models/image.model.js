import Quiz from "quiz.model.js";

const Image = sequelize.define("image", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    quizId: {
      type: Sequelize.INTEGER
    },
    url: {
      type: Sequelize.STRING
    },
    indexInsideTheQuiz: {
       type: Sequelize.INTEGER
    }
});

Image.belongsTo(Quiz);
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

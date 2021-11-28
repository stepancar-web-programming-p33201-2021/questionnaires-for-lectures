import Question from "question.model.js";

const Type = sequelize.define("type", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
});

Type.hasMany(Question, 
  {
    foreignKey: 'typeId',
    onDelete: 'RESTRICT'
  }
);
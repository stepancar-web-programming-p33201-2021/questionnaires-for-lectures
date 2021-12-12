//Question = require("./question.model");

module.exports = (sequelize, Sequelize) => {
  const Type = sequelize.define("type", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      }
  });

  /*
  Type.hasMany(Question, 
    {
      foreignKey: 'typeId',
      onDelete: 'RESTRICT'
    }
  );
  */
  
  return Type;
}
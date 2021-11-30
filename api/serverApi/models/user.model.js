//Quiz = require("./quiz.model");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
      login: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      hashPassword: {
        type: Sequelize.STRING,
        allowNull: false
      }
  });

  /*
  User.hasMany(Quiz, 
    {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    }
  );
  */
 
  return User;
}
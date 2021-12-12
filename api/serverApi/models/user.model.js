//Quiz = require("./quiz.model");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
      login: {
        type: Sequelize.STRING,
        primaryKey: true,
        unique: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      hashPassword: {
        type: Sequelize.STRING,
        allowNull: false
      }
  }, {
    hooks: {
      afterCreate: (record) => {
          delete record.dataValues.hashPassword;
      },
      afterUpdate: (record) => {
          delete record.dataValues.hashPassword;
      },
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
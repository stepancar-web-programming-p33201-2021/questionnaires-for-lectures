// Quiz = require("./quiz.model");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
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
        delete record.dataValues.hashPassword
        delete record.dataValues.createdAt
        delete record.dataValues.updatedAt
      },
      afterUpdate: (record) => {
        delete record.dataValues.hashPassword
        delete record.dataValues.createdAt
        delete record.dataValues.updatedAt
      }
    }
  })

  /*
  User.hasMany(Quiz,
    {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    }
  );
  */

  return User
}

/*
Question = require("./question.model");
User = require("./user.model");
Image = require("./image.model");
*/

module.exports = (sequelize, Sequelize) => {
    const Quiz = sequelize.define("quiz", {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false
        },
        code: {
          type: Sequelize.STRING,
          unique: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        isActive: {
           type: Sequelize.BOOLEAN,
           defaultValue: false
        }
    });

    /*
    Quiz.belongsTo(User);

    Quiz.hasMany(Image, 
      {
          foreignKey: 'quizId',
          onDelete: 'CASCADE'
      }
    );

    Quiz.hasMany(Question, 
      {
          foreignKey: 'quizId',
          onDelete: 'CASCADE'
      }
    );
    */
    return Quiz;
}

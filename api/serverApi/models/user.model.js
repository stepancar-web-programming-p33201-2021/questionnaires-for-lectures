/*
export default class User {

    constructor(login, email, hashPassword) {
        this.login = login;
        this.email = email;
        this.hashPassword = hashPassword;
    }

    auth() {
        //todo
    }

    static create() {
        //todo
    }

    static findAllQuizzesByUserId() {
        //todo
    }
}
*/

import Quiz from "quiz.model.js";

const User = sequelize.define("user", {
    login: {
      type: Sequelize.STRING,
      primaryKey: true,
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
});

User.hasMany(Quiz, 
  {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  }
);
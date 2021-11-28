/*
export default class Quiz {

    constructor(id, userId, name, isActive) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.isActive = isActive;
    }

    static create(newQuiz, result) {
        sql.query("INSERT INTO quizzes SET ?", newQuiz, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            console.log("Квиз добавлен", { id: res.insertId, ...newQuiz });
            result(null, { id: res.insertId, ...newQuiz });
        });
    }

    static findById(id, result) {
        sql.query(`SELECT * FROM quizzes WHERE id = ${id}`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            
            if (res.length) {
                console.log("Найден квиз: ", res[0]);
                result(null, res[0]);
                return;
            }
            
            result({ kind: "notFound" }, null);
        });  
    }

    static updateById(req, res) {
        //todo    
    }
    
    static activateById(req, res) {
        //todo    
    }
    
    static deactivateById(req, res) {
        //todo    
    }
    
    static deleteById(req, res) {
        //todo    
    }
}
*/

import User from "user.model.js";
import Question from "question.model.js";

const Quiz = sequelize.define("quiz", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    isActive: {
       type: Sequelize.BOOLEAN,
       allowNull: false,
       default: false
    }
});

Quiz.belongsTo(User);

Quiz.hasMany(Question, 
    {
      foreignKey: 'quizId',
      onDelete: 'CASCADE'
    }
);
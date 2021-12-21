module.exports = (db) => {
//	const db = require("../models");
  const Answer = db.answers
  const Image = db.images
  const Question = db.questions
  const Quiz = db.quizzes
  const TextAnswer = db.textAnswers
  const Type = db.types
  const User = db.users

  User.hasMany(Quiz,
    {
      foreignKey: 'userLogin',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  )
  Quiz.belongsTo(User)

  Quiz.hasMany(Image,
    {
      foreignKey: 'quizId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  )
  Image.belongsTo(Quiz)

  Quiz.hasMany(Question,
    {
      foreignKey: 'quizId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  )
  Question.belongsTo(Quiz)

  Type.hasMany(Question,
    {
      foreignKey: 'typeId',
      onDelete: 'RESTRICT'
    }
  )
  Question.belongsTo(Type)

  Question.hasMany(TextAnswer,
    {
      foreignKey: 'questionId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  )
  TextAnswer.belongsTo(Question)

  Question.hasMany(Answer,
    {
      foreignKey: 'questionId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  )
  Answer.belongsTo(Question)

  db.answers = Answer
  db.images = Image
  db.questions = Question
  db.quizzes = Quiz
  db.textAnswers = TextAnswer
  db.types = Type
  db.users = User

  return db
}

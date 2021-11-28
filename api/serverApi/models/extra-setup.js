function applyExtraSetup(sequelize) {
	const { answer, image, question, quiz, textAnswer, type, user} = sequelize.models;

    user.hasMany(quiz, 
        {
          foreignKey: 'userId',
          onDelete: 'CASCADE'
        }
    );
    quiz.belongsTo(user);

    quiz.hasMany(image, 
        {
            foreignKey: 'quizId',
            onDelete: 'CASCADE'
        }
    );
    image.belongsTo(quiz);   

    quiz.hasMany(question, 
        {
            foreignKey: 'quizId',
            onDelete: 'CASCADE'
        }
    );
    question.belongsTo(quiz);

    type.hasMany(question, 
        {
          foreignKey: 'typeId',
          onDelete: 'RESTRICT'
        }
    );
    question.belongsTo(type);

    question.hasMany(answer, 
        {
            foreignKey: 'questionId',
            onDelete: 'CASCADE'
        }
    );
	answer.belongsTo(question);

    question.hasMany(textAnswer, 
        {
            foreignKey: 'questionId',
            onDelete: 'CASCADE'
        }
    );
    textAnswer.belongsTo(question);
}

export default { applyExtraSetup };
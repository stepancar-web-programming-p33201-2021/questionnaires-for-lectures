function applyExtraSetup(sequelize) {
	const { answer, image, question, quiz, textAnswer, type, user} = sequelize.models;

    Question.belongsTo(Quiz);
}

export default { applyExtraSetup };
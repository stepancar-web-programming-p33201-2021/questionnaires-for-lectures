const Quiz = require('../models/quiz.model');

exports.create = async (req, res) => {
    const { name, questions } = req.body;
    try {
      let newQuiz = new Quiz({
        name,
        questions,
      });
      const quiz = await newQuiz.save();
      res.json(quiz);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
}

exports.findById = async (req, res) => {
    try {
      let quiz = await Quiz.findById(req.params.id);
      res.json(quiz);
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error.message);
    }
  }

  exports.findAll = async (req, res) => {
    try {
      let quizzes = await Quiz.find({});
      res.json(quizzes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const Quiz = require('./models/quiz');
const cors = require('cors');
const { createUser, login, getMyUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { PORT = 3005 } = process.env;

dotenv.config();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/quizapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/signup', createUser);
app.post('/signin', login);

app.get('/me', auth, getMyUser)

app.post('/quiz', async (req, res) => {
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
});

app.get('/quiz/:id', async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);
    res.json(quiz);
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
});

app.get('/allquizzes', async (req, res) => {
  try {
    let quizzes = await Quiz.find({});
    res.json(quizzes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

app.patch('/:quizId/statistics', async (req, res) => {
  const { name ,score } = req.body;
  try {
    await Quiz.findByIdAndUpdate(
      req.params.quizId,
      { $addToSet: { statistics: {name: name, score: score}} },
      { new: true, runValidators: true }
    );
    
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log('QUIZ APP LISTEN');
});

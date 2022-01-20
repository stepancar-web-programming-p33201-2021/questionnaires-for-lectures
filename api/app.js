const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const { PORT = 3005 } = process.env;

dotenv.config();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/quizapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


require('./routers/user.router')(app)
require('./routers/quiz.router')(app)


app.listen(PORT, () => {
  console.log('QUIZ APP LISTEN');
});

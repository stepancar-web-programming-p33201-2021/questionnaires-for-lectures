const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  questions: {
    type: Array
  }
});

module.exports = mongoose.model('quiz', QuizSchema);
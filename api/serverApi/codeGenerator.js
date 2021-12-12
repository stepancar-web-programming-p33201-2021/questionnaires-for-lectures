const db = require("./models");  
const Quiz = db.quizzes;

module.exports = async n => {
  var res;
  var is = true;
  while (is) {
    res = count(n);
    await Quiz.findOne({where: {code : res}}).then(quiz => {
      if (!quiz) {
        is = false;
      }
    });
  } 

  return res;
}

function count(n) {
  var chars = '0123456789'.split('');
    var result = '';
    for(var i = 0; i < n; i++){
      var x = Math.floor(Math.random() * chars.length);
      result += chars[x];
    }
    return result;
}
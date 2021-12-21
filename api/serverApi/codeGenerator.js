const db = require('./models')
const Quiz = db.quizzes

module.exports = async n => {
  let res
  let is = true
  while (is) {
    res = count(n)
    await Quiz.findOne({ where: { code: res } }).then(quiz => {
      if (!quiz) {
        is = false
      }
    })
  }

  return res
}

function count (n) {
  const chars = '0123456789'.split('')
  let result = ''
  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * chars.length)
    result += chars[x]
  }
  return result
}

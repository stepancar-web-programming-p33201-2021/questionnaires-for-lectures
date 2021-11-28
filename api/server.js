const express = require("express");
const bodyParser = require("body-parser");

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('quizzes', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql'
});

/*
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
*/

const app = express();

//делаем наш парсинг в формате json
app.use(bodyParser.json());

// парсит запросы по типу: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//  простой response - request
app.get("/", (req, res) => {
  res.json({ message: "Это стартовая страница нашего приложения" });
});

// установить порт, и слушать запросы
app.listen(3001, () => {
  console.log("Сервер запущен на 3001 порту");
});
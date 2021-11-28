import express from "express";
import { json, urlencoded } from "body-parser";

const app = express();

//делаем наш парсинг в формате json
app.use(json());

// парсит запросы по типу: application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

//  простой response - request
app.get("/", (req, res) => {
  res.json({ message: "Это стартовая страница нашего приложения" });
});

// установить порт, и слушать запросы
app.listen(3001, () => {
  console.log("Сервер запущен на 3001 порту");
});
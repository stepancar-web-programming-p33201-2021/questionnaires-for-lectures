import User from "../models/user.model.js";

export function create(req, res) {
  if (!req.body) {
    res.status(400).send({
      message: "Тело запроса должно присутствовать"
    });
  }

  const user = new User({
    login: req.body.login,
    email: req.body.email,
    hashPassword: hash(req.body.password)
  });

  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ошибка сервера"
      });
    else res.send(data);
  });
}


export function findAllQuizzesByUserId(req, res) {
  User.findAllQuizzesByUserId((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Что-то случилось во время получения всех пользователей"
      });
    else 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.send(data);
  }); 
}

function hash(s) {
  return s;
  //todo
}
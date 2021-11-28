import Quiz from "../models/quiz.model.js";

export function create(req, res) {
  if (!req.body) {
    res.status(400).send({
      message: "Тело запроса должно присутствовать"
    });
  }

  const quiz = new Quiz({
    id: req.body.id,
    userId: req.body.userId,
    name: req.body.name,
    isActive: req.body.isActive,
  });

  Quiz.create(quiz, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ошибка сервера"
      });
    else res.send(data);
  });
}

export function findById(req, res) {
  Quiz.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "notFound") {
        res.status(404).send({
          message: `Нет дела с id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Ошибка сервера, id" + req.params.id
        });
      }
    } else res.send(data);
  });    
}

export function updateById(req, res) {
  if (!req.body) {
    res.status(400).send({
      message: "Тело запроса должно присутствовать"
    });
  }

  const quiz = new Quiz({
    id: req.body.id,
    userId: req.body.userId,
    name: req.body.name,
    isActive: req.body.isActive,
  });


  Quiz.update(quiz, req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ошибка сервера"
      });
    else res.send(data);
  }); 
}

export function activateById(req, res) {
  Quiz.activateById(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ошибка сервера"
      });
    else res.send(data);
  }); 
}

export function deactivateById(req, res) {
  Quiz.deactivateById(req.params.id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Ошибка сервера"
      });
    else res.send(data);
  });   
}

export function deleteById(req, res) {
  Quiz.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "notFound") {
        res.status(404).send({
          message: `Не найден квиз ${req.params.dealId}.`
        });
      } else {
        res.status(500).send({
          message: "Ошибка сервера, id = " + req.params.dealId
        });
      }
    } else res.send({ message: `Квиз удален` });
  }); 
}
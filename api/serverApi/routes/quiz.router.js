module.exports = app => {
  const quizzes = require("../controllers/quiz.controller.js");

  var router = require("express").Router();

  router.get("/quizzes/:id", quizzes.findById);

  router.post("/quizzes", quizzes.create);

  router.put("/quizzes/:id", quizzes.updateById);
  
  router.put("/quizzes/:id/activate", quizzes.activateById);

  router.put("/quizzes/:id/deactivate", quizzes.deactivateById);

  router.delete("/quizzes/:id", quizzes.deleteById);

  router.get("/quizzes", quizzes.findAll);

  app.use("/api", router);
}
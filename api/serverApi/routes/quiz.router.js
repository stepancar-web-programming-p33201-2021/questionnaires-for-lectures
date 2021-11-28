export default app => {
  const quizzes = require("../controllers/quiz.controller.js");
     
  app.get("/quizzes/:quizId", quizzes.findById);

  app.post("/quizzes", quizzes.create);

  app.put("/quizzes/:quizId", quizzes.updateById);

  app.put("/quizzes/:quizId/activate", quizzes.activateById);

  app.put("/quizzes/:quizId/deactivate", quizzes.deactivateById);

  app.delete("/quizzes/:quizId", quizzes.deleteById);
};
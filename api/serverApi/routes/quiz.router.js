
/*export default app => {
  const quizzes = require("../controllers/quiz.controller.js");
     
  app.get("/quizzes/:quizId", quizzes.findById);

  app.post("/quizzes", quizzes.create);

  app.put("/quizzes/:quizId", quizzes.updateById);

  app.put("/quizzes/:quizId/activate", quizzes.activateById);

  app.put("/quizzes/:quizId/deactivate", quizzes.deactivateById);

  app.delete("/quizzes/:quizId", quizzes.deleteById);
};
*/
module.exports = app => {
  var router = require("express").Router();

  const quizzes = require("../controllers/quiz.controller.js");
     
  router.get("/quizzes/:id", quizzes.findById);

  router.post("/quizzes", quizzes.create);

  router.put("/quizzes/:id", quizzes.updateById);
  
  /*
  router.put("/quizzes/:id/activate", quizzes.activateById);

  router.put("/quizzes/:id/deactivate", quizzes.deactivateById);
  */

  router.delete("/quizzes/:id", quizzes.deleteById);

  app.use('/api/tutorials', router);
}
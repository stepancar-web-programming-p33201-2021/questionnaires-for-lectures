passport = require("passport");

module.exports = app => {
  const quizzes = require("../controllers/quiz.controller.js");

  var router = require("express").Router();

  router.get("/quizzes/:id", 
  passport.authenticate('jwt', { 
    session: false 
  }),
  quizzes.findById);

  router.get("/quizzes/code/:code", quizzes.findByCode);

  router.post("/quizzes", 
  passport.authenticate('jwt', { 
    session: false 
  }),
  quizzes.create);

  router.put("/quizzes/:id",
  passport.authenticate('jwt', { 
    session: false 
  }), 
  quizzes.updateById);
  
  router.put("/quizzes/:id/activate",
  passport.authenticate('jwt', { 
    session: false 
  }),
   quizzes.activateById);

  router.put("/quizzes/:id/deactivate",
  passport.authenticate('jwt', { 
    session: false 
  }),
  quizzes.deactivateById);

  router.delete("/quizzes/:id", 
  passport.authenticate('jwt', { 
    session: false 
  }),
  quizzes.deleteById);

  router.get("/quizzes", quizzes.findAllOfUser);

  app.use("/api", router);
}
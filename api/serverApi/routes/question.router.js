module.exports = app => {
    const questions = require("../controllers/question.controller.js");
  
    var router = require("express").Router();
  
    router.get("/questions/:id", questions.findById);
  
    router.post("/questions", questions.create);
  
    router.put("/questions/:id", questions.updateById);
  
    router.delete("/questions/:id", questions.deleteById);
    
    app.use("/api", router);
  }
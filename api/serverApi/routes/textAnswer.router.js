module.exports = app => {
    const textAnswers = require("../controllers/textAnswer.controller.js");
  
    var router = require("express").Router();
  
    router.get("/textAnswers/:id", textAnswers.findById);
  
    router.post("/textAnswers", textAnswers.create);
  
    router.put("/textAnswers/:id", textAnswers.updateById);
  
    router.delete("/textAnswers/:id", textAnswers.deleteById);
    
    app.use("/api", router);
  }
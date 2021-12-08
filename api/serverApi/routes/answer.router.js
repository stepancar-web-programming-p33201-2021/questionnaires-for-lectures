module.exports = app => {
    const answers = require("../controllers/answer.controller.js");
  
    var router = require("express").Router();
  
    router.get("/answers/:id", answers.findById);
  
    router.post("/answers", answers.create);
  
    router.put("/answers/:id", answers.updateById);
  
    router.delete("/answers/:id", answers.deleteById);
    
    app.use("/api", router);
  }
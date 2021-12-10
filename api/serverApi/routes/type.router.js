module.exports = app => {
    const types = require("../controllers/type.controller.js");
  
    var router = require("express").Router();
  
    router.get("/types/:id", types.findById);
  
    router.post("/types", types.create);
  
    router.put("/types/:id", types.updateById);
  
    router.delete("/types/:id", types.deleteById);
    
    app.use("/api", router);
  }